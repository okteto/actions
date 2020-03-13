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
pushd $wd
fi

echo running: okteto push $params
okteto push $params

if [ -z "$name" ]; then
name=$(yq r okteto.yml name)
kubectl rollout status deployment/$name --namespace "$namespace" --timeout=300s
fi


