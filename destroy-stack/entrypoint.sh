#!/bin/sh
set -e

namespace=$1
name=$2
wd=$3

params=""

if [ ! -z "$namespace" ]; then
params="${params} --namespace $namespace"
fi

if [ ! -z "$name" ]; then
params="${params} --name $name"
fi

if [ ! -z "$wd" ]; then
cd $wd
fi

echo running: okteto stack destroy $params on $(pwd)
okteto stack destroy $params