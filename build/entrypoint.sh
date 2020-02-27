#!/bin/sh
set -e

token=$1
tag=$2
file=$3
path=$4
args=$5

BUILDPARAMS=""

export OKTETO_TOKEN=$token

if [ ! -d ${HOME}/.okteto ]; then
  mkdir ${HOME}/.okteto
fi

wget -O ${HOME}/.okteto/.ca.crt https://storage.googleapis.com/get.okteto.com/okteto-cloud-ca-crt

if [ ! -z "${INPUT_BUILDARGS}" ]; then
  for ARG in $(echo "${INPUT_BUILDARGS}" | tr ',' '\n'); do
    BUILDPARAMS="${BUILDPARAMS} --build-arg ${ARG}=\'\$${ARG}\'"
  done
fi

params=$(eval echo -t "$tag" -f "$file" "$BUILDPARAMS" "$path")
echo $params
okteto build $params