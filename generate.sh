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
    hostname: ${CONTAINER_NAME}.\${IP}.xip.io
    environment:
        NAME: ${NAME}
        FILENAME: ${FILENAME}
        URL: ${URL}
    labels:
      - "interlock.hostname=${CONTAINER_NAME}"
      - "interlock.domain=\${IP}.xip.io"
    depends_on:
      - haproxy
      - redis
    ports:
      - 8080
EOF
done < identities.list