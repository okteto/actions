#!/bin/sh
token=$1
namespace=$2
fild=$3
path=$4

export OKTETO_TOKEN=$token
okteto version
okteto namespace "$namespace"
k="$(pwd)/.kube/config"
echo "::set-output name=kubeconfig::$k"