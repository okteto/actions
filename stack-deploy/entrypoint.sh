#!/bin/sh
set -e

namespace=$1
name=$2
build=$3
wd=$4

params="--wait "

if [ ! -z "$namespace" ]; then
params="${params} --namespace $namespace"
fi

if [ ! -z "$name" ]; then
params="${params} --name $name"
fi

if [ "$build" == "true" ]; then
params="${params} --build"
fi

if [ ! -z "$wd" ]; then
cd $wd
fi

echo running: okteto stack deploy $params on $(pwd)
okteto stack deploy $params