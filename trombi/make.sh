#!/bin/sh

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
    (cd $CWD/event-bridge; docker build -f Dockerfile.build -t $IMAGE-builder1 . )
    (cd $CWD/trombi; docker build -f $CWD/trombi/Dockerfile.build -t $IMAGE-builder2 . )
  ;;
  build)
    rm -rf $CWD/dist
#    docker run -v gopath:/go/src -v $CWD/event-bridge:/go/src/github.com/tauffredou/pcd-monitor -v $CWD/dist:/output $IMAGE-builder1
    docker run -v $CWD/trombi:/app -v $CWD/dist/static:/app/dist $IMAGE-builder webpack
    cp $CWD/trombi/dist/index.html $CWD/dist/static
    echo "Built in $CWD/bin"
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