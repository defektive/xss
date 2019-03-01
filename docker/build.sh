#! /bin/bash

ID=`git log src/xss.as| head -n 1 | awk '{print substr($2, 0,7)}'`
OLD=`cat .latest_build_id`
if [ "$ID" == $OLD ]; then
  echo "same same, no build"
  exit
fi

docker build -t xss-swf .
docker run --rm \
  -v `pwd`/bin/:/tmp/bin \
  -v `pwd`/dist/:/tmp/dist \
  -v `pwd`/src:/tmp/src \
  -w /tmp \
  xss-swf bin/compile.sh $ID

echo $ID | tee .latest_build_id
git add dist/xss.swf
git commit -m "Build $ID"
