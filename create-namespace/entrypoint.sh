#!/bin/sh
set -e

namespace=$1
if [ -z $namespace ]; then
  echo "Namespace name is required"
  exit 1
fi

echo running: okteto create namespace $namespace
okteto create namespace $namespace