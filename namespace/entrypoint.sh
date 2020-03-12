#!/bin/sh
set -e
namespace=$2

okteto version
okteto namespace "$namespace"