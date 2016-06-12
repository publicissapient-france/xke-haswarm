FROM alpine

RUN apk add --update ca-certificates # Certificates for SSL

RUN mkdir /service-discovery

COPY services.html /service-discovery
COPY service-discovery /service-discovery

WORKDIR /service-discovery

EXPOSE 8080

ENTRYPOINT ["/service-discovery/service-discovery"]