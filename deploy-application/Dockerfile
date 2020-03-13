FROM okteto/bin:1.1.9-cloud as cli
FROM stedolan/jq as jq

# Container image that runs your code
FROM alpine:3.11

COPY --from=cli /usr/local/bin/okteto /usr/local/bin/okteto

COPY --from=jq /usr/local/bin/jq /usr/local/bin/jq

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]