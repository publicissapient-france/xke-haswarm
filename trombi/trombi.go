package main

import (
	"html/template"
	"net/http"
	"os"
)

type Id struct {
	Name     string
	Filename string
	Hostname string
}

var templates = template.Must(template.ParseFiles("id.html"))

func loadId() (*Id, error) {
	name := os.Getenv("NAME")
	if len(name) == 0 {
		name = "N/A"
	}

	filename := os.Getenv("FILENAME")
	if len(filename) == 0 {
		filename = "not_available.png"
	}

	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}

	return &Id{Name: name, Filename: filename, Hostname: hostname}, nil
}

func idHandler(w http.ResponseWriter, r *http.Request) {
	id, err := loadId()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	err = templates.ExecuteTemplate(w, "id.html", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func staticHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, r.URL.Path[1:])
}

func main() {
	http.HandleFunc("/", idHandler)
	http.HandleFunc("/static/", staticHandler)

	http.ListenAndServe(":8080", nil)
}