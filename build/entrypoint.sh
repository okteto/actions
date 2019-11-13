#!/bin/sh

token=$1
tag=$2
file=$3
path=$4

export OKTETO_TOKEN=$token
okteto build -t $tag -f $file $path