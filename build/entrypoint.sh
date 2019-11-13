#!/bin/sh -l
token=$1
tag=$2
fild=$3
path=$4

export OKTETO_TOKEN=$token
okteto build -t $tag -f $file $path