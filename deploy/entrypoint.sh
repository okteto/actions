#!/bin/sh
set -e

namespace=$1
manifest=$2
full=$3
waitOn=$4
registry=$5

image=$(echo $full | cut -d':' -f1)
tag=$(echo $full | cut -d':' -f2)
newName=$image

if [ -z $tag ]; then
tag='latest'
fi

if [ ! -f kustomization.yaml ]; then
  if [ ! -z $registry ]; then
    newName=$(echo $registry/$image)
  fi
cat << EOF > kustomization.yaml
resources:
 - $manifest
images:
 - name: $image
   newName: $newName
   newTag: $tag
EOF
cat kustomization.yaml
fi

kubectl apply -k ./ --namespace $namespace

if [ ! -z $waitOn ]; then
  kubectl rollout status $waitOn --namespace $namespace --timeout=300s
fi
