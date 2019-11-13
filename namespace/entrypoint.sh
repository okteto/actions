#!/bin/sh
token=$1
namespace=$2
fild=$3
path=$4

export OKTETO_TOKEN=$token
okteto namespace "$namespace"
k="$(pwd)/.kube/config"
export KUBECONFIG=$k
echo ::set-output kubeconfig::$k
::set-output kubeconfig::$k