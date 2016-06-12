package main

import (
	"fmt"
	"github.com/caarlos0/env"
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strconv"
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	RedisHost string `env:"REDIS_HOST" envDefault:"localhost"`
	RedisPort int    `env:"REDIS_PORT" envDefault:"6379"`
	RegistryUrl string `env:"REGISTRY_URL" envDefault:"http://service-discovery:8080"`
}

var (
	cfg = Config{}
	connections map[*websocket.Conn]bool = make(map[*websocket.Conn]bool)
	upgrader = &websocket.Upgrader{
		ReadBufferSize: 1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	registry = make(map[string]ServiceHitEvent)
)

func wsHandler(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	connections[c] = true

}

func registryHandler(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(cfg.RegistryUrl + "/json")
	if err != nil {
		// handle error
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	w.Write(body)
}

type ServiceHitEvent struct {
	Name     string `json:"name"`
	Filename string `json:"filename"`
	Hostname string `json:"hostname"`
	Hits     int    `json:"hits"`
}

func main() {

	env.Parse(&cfg)

	c, err := redis.Dial("tcp", cfg.RedisHost + ":" + strconv.Itoa(cfg.RedisPort))
	if err != nil {
		return
	}

	defer c.Close()

	go func() {
		psc := redis.PubSubConn{c}
		psc.Subscribe("service.hit")
		for {
			switch v := psc.Receive().(type) {

			case redis.Message:
				fmt.Printf("%s: message: %s\n", v.Channel, v.Data)
				var service ServiceHitEvent
				json.Unmarshal(v.Data,&service)
				registry[service.Name]=service
				fmt.Printf("data: %+v\n",registry)
				for c := range connections {
					c.WriteMessage(websocket.TextMessage, v.Data)
				}
			case redis.Subscription:
				fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
			case error:

			}
		}
	}()

	fs := http.FileServer(http.Dir("static"))
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/services", registryHandler)
	http.Handle("/", fs)
	http.ListenAndServe(":8082", nil)
}
