package main

import (
	"html/template"
	"net/http"
	"github.com/fsouza/go-dockerclient"
	"github.com/caarlos0/env"
)

type Config struct {
	DockerEndpoint string `env:"DOCKER_HOST" envDefault:"unix:///var/run/docker.sock"`
}

var cfg = Config{}

func listServices() ([]docker.APIContainers, error) {
	client, err := docker.NewClient(cfg.DockerEndpoint)

	if err != nil {
		return nil, err
	}

	containers, err := client.ListContainers(docker.ListContainersOptions{
		Filters: map[string][]string{
			"ancestor":  {"jlrigau/identity"},
		},
	})

	if err != nil {
		return nil, err
	}

	return containers, nil
}

var templates = template.Must(template.ParseFiles("services.html"))

func servicesHandler(w http.ResponseWriter, r *http.Request) {
	containers, err := listServices()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	err = templates.ExecuteTemplate(w, "services.html", containers)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	env.Parse(&cfg)

	http.HandleFunc("/", servicesHandler)

	http.ListenAndServe(":8080", nil)
}