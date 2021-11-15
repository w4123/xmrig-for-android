#!/usr/bin/env bash

set -e

source script/env.sh

cd $EXTERNAL_LIBS_BUILD_ROOT

version="v6.15.3"

if [ ! -d "xmrig" ]; then
  git clone https://github.com/xmrig/xmrig.git -b ${version}
else
  cd xmrig
  git checkout ${version}
fi
