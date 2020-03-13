#!/bin/sh
set -e
namespace=$1
echo running: okteto namespace "$namespace"
okteto namespace "$namespace"
k="/github/home/.kube/config"
echo "::set-output name=kubeconfig::$k"