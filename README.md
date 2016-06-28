# XKE HA Swarm

## Provision infrastructure

```shell
$ make provision
```

## Run Application

Configure your `DOCKER_HOST` environment variable to point to your Swarm cluster

```shell
$ export DOCKER_HOST=tcp://admin.xke-ha-swarm.aws.xebiatechevent.info:3375
```

Then run the application

```shell
$ docker-compose up -d
```
