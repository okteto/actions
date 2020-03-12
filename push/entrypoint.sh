#!/bin/sh
set -e

token=$1
deploy=$2
name=$3

okteto login --token=$token
params=""

if [ "$deploy" == "true" ]; then
params="--deploy"
fi

if [ ! -z "$name" ]; then
params="${params} --name $name"
fi

echo okteto push $params
okteto push $params