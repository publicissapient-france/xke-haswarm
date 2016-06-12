all: compile build-image

compile:
	docker run --rm -v $(PWD):/usr/src/service-discovery -w /usr/src/service-discovery \
     			 	-e CGO_ENABLED=0 -e GOOS=linux -e GOARCH=amd64 \
     			 	golang:1.6 bash -c "go get -v -d && go build -v"

build-image:
	docker build -t jlrigau/service-discovery .

push-image:
	docker push jlrigau/service-discovery