#!/bin/sh
set -e

namespace=$1

echo  running: okteto create namespace $namespace
okteto create namespace $namespace