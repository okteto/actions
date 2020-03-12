#!/bin/sh
set -e

namespace=$1
name=$2
deploy=$3

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

echo running: okteto push $params
okteto push $params

kubectl rollout status deployment/$name --namespace "$namespace" --timeout=300s