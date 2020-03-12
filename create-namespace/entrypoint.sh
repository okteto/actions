#!/bin/sh
set -e

token=$1
namespace=$2

okteto login --token=$token
echo okteto create namespace $namespace
okteto create namespace $namespace
k="/github/home/.kube/config"
echo "::set-output name=kubeconfig::$k"