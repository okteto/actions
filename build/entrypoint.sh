#!/bin/sh
set -e

tag=$1
file=$2
path=$3
args=$4

BUILDPARAMS=""

if [ ! -z "${INPUT_BUILDARGS}" ]; then
  for ARG in $(echo "${INPUT_BUILDARGS}" | tr ',' '\n'); do
    BUILDPARAMS="${BUILDPARAMS} --build-arg ${ARG}=\$${ARG}"
  done
fi

params=$(eval echo --progress plain -t "$tag" -f "$file" "$BUILDPARAMS" "$path")
echo running: okteto build $params
okteto build $params