#!/bin/sh
set -e
token=$1
namespace=$2

okteto login --token $token
okteto version
okteto namespace "$namespace"
k="/github/home/.kube/config"
echo "::set-output name=kubeconfig::$k"