#!/bin/sh
set -e

token=$1
namespace=$2

okteto login --token=$token
echo okteto delete namespace $namespace
okteto delete namespace $namespace