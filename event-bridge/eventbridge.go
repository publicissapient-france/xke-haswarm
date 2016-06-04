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
		CheckOrigin: func(r *http.Request) bool { return true },
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
	Type string `json:"type"`
	Name string `json:"name"`
}

//func broadcast(event *interface{}) {
//	log.Printf("broadcast: %s", event)
//	for c := range connections {
//		c.WriteJSON(event)
//	}
//}

func staticHandler(w http.ResponseWriter, r *http.Request) {
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

	http.HandleFunc("/static/", staticHandler)
	http.HandleFunc("/ws", wsHandler)
	http.ListenAndServe(":8082", nil)
}
