#!/bin/sh

token=$1
tag=$2
file=$3
path=$4

ls -la

export OKTETO_TOKEN=$token
echo okteto build -t "$tag" -f "$file" "$path"
okteto version
okteto build -t "$tag" -f "$file" "$path"