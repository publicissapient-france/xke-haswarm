package main

import (
	"html/template"
	"net/http"
	"os"
)

type Id struct {
	Filename string
	Hostname string
}

var templates = template.Must(template.ParseFiles("id.html"))

func loadId(filename string) (*Id, error) {
	hostname, err := os.Hostname()
	if err != nil {
		return nil, err
	}

	return &Id{Filename: filename, Hostname: hostname}, nil
}

func idHandler(w http.ResponseWriter, r *http.Request) {
	id, err := loadId("not_available.png")
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