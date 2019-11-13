#!/bin/sh
set -e

namespace=$1
manifest=$2
full=$3
waitOn=$4

tag=$(echo $full | cut -d':' -f1)
image=$(echo $full | cut -d':' -f2)

if [ -z $image ]; then
image='latest'
fi


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