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

func listServices() ([]*docker.Container, error) {
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

	var services []*docker.Container

	for _, apiContainer := range containerList {
		container, err := getContainer(apiContainer.ID)

		if err != nil {
			return nil, err
		}

		services = append(services, container)
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

func main() {
	env.Parse(&cfg)

	http.HandleFunc("/", servicesHandler)

	http.ListenAndServe(":8080", nil)
}