#!/bin/sh
set -e
namespace=$1
okteto version
okteto namespace "$namespace"