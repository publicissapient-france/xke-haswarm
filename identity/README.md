# Identity

## Build application

```shell
$ docker run --rm -v $(pwd):/usr/src/identity -w /usr/src/identity \
 			 -e CGO_ENABLED=0 -e GOOS=linux -e GOARCH=amd64 \
 			 golang:1.6 go build -v
```

## Build Docker image

The image is build based on an `alpine` image for being much slimmer 

```shell
$ docker build -t identity .
```

## Run application

Run the application

```shell
$ docker run -d -p 8080:8080 identity
```

Run the application with a specific name

```shell
$ docker run -d -e NAME="Jean-Louis Rigau" -p 8080:8080 identity
```

Run the application with a specific filename

**Note** The corresponding file must be present in the `static/img`directory

```shell
$ docker run -d -e NAME="Jean-Louis Rigau" -e FILENAME=jlrigau.jpg \
				-p 8080:8080 identity
```

Run the application by indicating the url of the image to use

**Note** If the image is not of `PNG` type, you have to indicate a specific filename according to the type

```shell
$ docker run -d -e NAME="Jean-Louis Rigau" -e FILENAME=identity.jpg \
				-e URL=https://twitter.com/jlrigau/profile_image?size=original \
				-p 8080:8080 identity
```