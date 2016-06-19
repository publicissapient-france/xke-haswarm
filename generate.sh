#!/usr/bin/env bash

while read IDENTITY
do
	NAME=$(echo "$IDENTITY" | cut -d ',' -f1)
	URL=$(echo "$IDENTITY" | cut -d ',' -f2)
	CONTAINER_NAME=$(echo "$IDENTITY" | cut -d ',' -f3)
	FILENAME=$(echo "$URL" | cut -d '/' -f8)

	cat <<-EOF

  ${CONTAINER_NAME}:
    image: xebiafrance/identity
    environment:
        NAME: ${NAME}
        FILENAME: ${FILENAME}
        URL: ${URL}
    labels:
      - "interlock.hostname=${CONTAINER_NAME}"
      - "interlock.domain=service.xke-ha-swarm.aws.xebiatechevent.info"
    depends_on:
      - redis
    ports:
      - 8080
EOF
done < identities.list