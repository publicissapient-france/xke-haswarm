# Trombi

## Build application

```shell
$ docker run --rm -v $(pwd):/usr/src/trombi -w /usr/src/trombi \
 			 -e CGO_ENABLED=0 -e GOOS=linux -e GOARCH=amd64 \
 			 golang:1.6 go build -v
```

## Build Docker image

```shell
$ docker build -t trombi trombi
```

## Run application

```shell
$ docker run -d -p 8080:8080 trombi
```