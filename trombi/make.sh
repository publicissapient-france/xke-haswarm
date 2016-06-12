#!/bin/sh
set -x

CWD=$(cd $(dirname $0);pwd)
MAKE=$0
IMAGE=tauffredou/pcd-monitor

usage(){
cat<<-EOUSAGE
make.sh [Action]
Actions:
  builder       create builder image
  build         create binary using builder image
  image         create final image
  run           run the final image
  build-chain   builder,build,image

EOUSAGE
}

case $1 in
  builder)
    (cd $CWD; docker build -f $CWD/Dockerfile.build -t $IMAGE-builder . )
  ;;
  build)
    rm -rf $CWD/dist
    docker run -v $CWD:/src -v $CWD/dist:/src/dist $IMAGE-builder
  ;;
  image)
    cp $CWD/Dockerfile $CWD/dist/
    docker build -t $IMAGE $CWD/dist
    echo run pcd-monitor with: docker run $IMAGE
  ;;
  run)
    docker run $IMAGE
  ;;
  build-chain)
    $MAKE builder && $MAKE build && $MAKE image
  ;;
  *)
    usage
  ;;
esac