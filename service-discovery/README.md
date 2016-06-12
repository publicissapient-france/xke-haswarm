# Service Discovery

## Build application

```shell
$ make
```

If you only want to compile the application

```shell
$ make compile
```

If you only want to build the Docker image

```shell
$ make build-image
```

Push the Docker image to DockerHub

```shell
$ make push-image
```

## Run application

Run the application

```shell
$ docker run -d -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock jlrigau/service-discovery
```