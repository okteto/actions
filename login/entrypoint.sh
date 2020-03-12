#!/bin/sh
set -e

token=$1
if [ -z $token ]; then
  echo "Okteto API token is required"
  exit 1
fi

okteto login --token=$token