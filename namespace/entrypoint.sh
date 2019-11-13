#!/bin/sh
token=$1
namespace=$2

export OKTETO_TOKEN=$token
okteto version
okteto namespace "$namespace"
k="/github/home/.kube/config"
echo "::set-output name=kubeconfig::$k"