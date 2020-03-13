#!/bin/sh
set -e

namespace=$1
name=$2
deploy=$3
wd=$4

params=""

if [ ! -z "$namespace" ]; then
params="${params} --namespace $namespace"
fi

if [ ! -z "$name" ]; then
params="${params} --name $name"
fi

if [ "$deploy" == "true" ]; then
params="${params} --deploy"
fi

if [ ! -z "$wd" ]; then
cd $wd
ls -la
fi

echo running: okteto push $params on $(pwd)
okteto push $params