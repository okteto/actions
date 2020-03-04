#!/bin/sh
set -e

token=$1
tag=$2
file=$3
path=$4
args=$5

BUILDPARAMS=""

okteto login --token=$token

if [ ! -z "${INPUT_BUILDARGS}" ]; then
  for ARG in $(echo "${INPUT_BUILDARGS}" | tr ',' '\n'); do
    BUILDPARAMS="${BUILDPARAMS} --build-arg ${ARG}=\$${ARG}"
  done
fi

params=$(eval echo -t "$tag" -f "$file" "$BUILDPARAMS" "$path")
echo $params
okteto build $params