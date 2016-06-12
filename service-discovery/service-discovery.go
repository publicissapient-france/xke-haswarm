package main

import (
	"html/template"
	"net/http"
	"github.com/fsouza/go-dockerclient"
	"github.com/caarlos0/env"
	"encoding/json"
	"strings"
)

type Config struct {
	DockerEndpoint string `env:"DOCKER_HOST" envDefault:"unix:///var/run/docker.sock"`
}

var cfg = Config{}

type Identity struct {
	Name     string `json:"name"`
	Filename string `json:"filename"`
	Url      string `json:"url"`
}

type Service struct {
	Hostname   string    `json:"hostname"`
	Domainname string    `json:"domainname"`
	Url        string    `json:"url"`
	Identity   *Identity `json:"identity"`
}

func getContainer(id string) (*docker.Container, error) {
	client, err := docker.NewClient(cfg.DockerEndpoint)

	if err != nil {
		return nil, err
	}

	container, err := client.InspectContainer(id)

	if err != nil {
		return nil, err
	}

	return container, nil
}

func listServices() ([]*Service, error) {
	client, err := docker.NewClient(cfg.DockerEndpoint)

	if err != nil {
		return nil, err
	}

	containerList, err := client.ListContainers(docker.ListContainersOptions{
		Filters: map[string][]string{
			"ancestor":  {"jlrigau/identity"},
		},
	})

	if err != nil {
		return nil, err
	}

	var services []*Service

	for _, apiContainer := range containerList {
		container, err := getContainer(apiContainer.ID)

		if err != nil {
			return nil, err
		}

		hostname := container.Config.Hostname
		Domainname := container.Config.Domainname
		url := "http://" + hostname + "." + Domainname + "/identity"

		identity := Identity{}

		for _, env := range container.Config.Env {
			envAsArray := strings.Split(env, "=")
			
			key := envAsArray[0]
			value := envAsArray[1]

			switch key {
			case "NAME":
				identity.Name = value
			case "FILENAME":
				identity.Filename = value
			case "URL":
				identity.Url = value
			}
		}

		services = append(services, &Service{hostname, Domainname, url, &identity})
	}

	return services, nil
}

var templates = template.Must(template.ParseFiles("services.html"))

func servicesHandler(w http.ResponseWriter, r *http.Request) {
	services, err := listServices()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	err = templates.ExecuteTemplate(w, "services.html", services)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func jsonHandler(w http.ResponseWriter, r *http.Request) {
	services, err := listServices()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")

	js, err := json.Marshal(services)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Write(js)
}

func main() {
	env.Parse(&cfg)

	http.HandleFunc("/", servicesHandler)
	http.HandleFunc("/json", jsonHandler)

	http.ListenAndServe(":8080", nil)
}