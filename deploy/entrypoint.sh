#!/bin/sh
set -e

namespace=$1
manifest=$2
image=$3
tag=$4
waitOn=$5

if [ ! -f kustomization.yaml ]; then 
cat << EOF > kustomization.yaml
resources:
 - $manifest
images:
 - name: $image
   newName: $image
   newTag: $tag
EOF
cat kustomization.yaml
fi

kubectl apply -k ./ --namespace $namespace

if [ ! -z $waitOn ]; then
kubectl rollout status $waitOn --namespace $namespace --timeout=300s
fi