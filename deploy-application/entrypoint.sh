#!/bin/sh
set -e

namespace=$1
application=$2
name=$3
version=$4
configuration=$5
repo=$6

if [ -z "$application" ]; then
echo application is not defined
exit 1
fi

if [ -z "$name" ]; then
echo name is not defined
exit 1
fi

if [ -z "$version" ]; then
echo version is not defined
exit 1
fi

if [ -z "$configuration" ]; then
configuration=$(pwd)/config.yaml
fi

token=$(jq  .Token $HOME/.okteto/.token.json -r)
url=$(jq  .URL $HOME/.okteto/.token.json -r)/graphql

encoded_configuration=$(base64 $configuration)

echo Deploying $namespace/$name via $url

cat << EOF > deploy.payload
{
  "query": "mutation {
    deployApp(
    chart: \"${application}\", name: \"${name}\", space: \"${namespace}\", version: \"${version}\",repo: \"${repo}\", config: \"${encoded_configuration}\") {
    id
    }
  }"
}
EOF

curl -X POST \
--url $url \
-H "content-Type: application/json" \
-H "authorization: Bearer $token" \
--data @deploy.payload


