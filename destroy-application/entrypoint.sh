#!/bin/sh
set -ex

namespace=$1
name=$2

if [ -z "$name" ]; then
echo name is not defined
exit 1
fi

token=$(jq  .Token $HOME/.okteto/.token.json -r)
url=$(jq  .URL $HOME/.okteto/.token.json -r)/graphql

echo Destroying $namespace/$name via $url

cat << EOF > okteto.payload
{
  "query": "mutation {
    destroyApp(
    name: \"${name}\", space: \"${namespace}\") {
    id
    }
  }"
}
EOF

curl -X POST \
--url $url \
-H "content-Type: application/json" \
-H "authorization: Bearer $token" \
--data @okteto.payload


