package main

import (
	"fmt"
	"github.com/caarlos0/env"
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"strconv"
)

type Config struct {
	RedisHost string `env:"REDIS_HOST" envDefault:"localhost"`
	RedisPort int    `env:"REDIS_PORT" envDefault:"6379"`
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
)

func wsHandler(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	connections[c] = true

}

type ServiceHitEvent struct {
	Name     string `json:"name"`
	Filename string `json:"filename"`
	Hostname string `json:"hostname"`
	Hits     int    `json:"hits"`
}

func staticHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("Handle %s\n", r.URL.Path[1:])
	http.ServeFile(w, r, r.URL.Path[1:])
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
	http.Handle("/", fs)
	http.ListenAndServe(":8082", nil)
}
