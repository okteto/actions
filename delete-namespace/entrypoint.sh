#!/bin/sh
set -e

namespace=$1
echo running: okteto delete namespace $namespace
okteto delete namespace $namespace