FROM alpine

COPY static /trombi/static
COPY id.html /trombi
COPY trombi /trombi

WORKDIR /trombi

EXPOSE 8080

ENTRYPOINT ["/trombi/trombi"]