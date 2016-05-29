package main

import (
	"html/template"
	"net/http"
	"os"
	"log"
	"io"
)

type Id struct {
	Name     string
	Filename string
	Hostname string
}

var templates = template.Must(template.ParseFiles("id.html"))

func getImage(url string, filename string) {
	response, e := http.Get(url)
	if e != nil {
		log.Fatal(e)
	}

	defer response.Body.Close()

	file, err := os.Create("static/img/" + filename)
	if err != nil {
		log.Fatal(err)
	}

	_, err = io.Copy(file, response.Body)
	if err != nil {
		log.Fatal(err)
	}

	file.Close()
}

func loadId() (*Id, error) {
	name := os.Getenv("NAME")
	if len(name) == 0 {
		name = "N/A"
	}

	filename := os.Getenv("FILENAME")
	if len(filename) == 0 {
		filename = "id.png"
	}

	url := os.Getenv("URL")
	if len(url) != 0 {
		getImage(url, filename);
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