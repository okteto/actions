#!/bin/sh
set -e

namespace=$1
if [ -z $namespace ]; then
  echo "Namespace name is required"
  exit 1
fi

echo running: okteto delete namespace $namespace
okteto delete namespace $namespace