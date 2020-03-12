FROM okteto/bin:1.1.8-dev as cli
FROM mikefarah/yq as yq

# Container image that runs your code
FROM alpine:3.11

COPY --from=cli /usr/local/bin/okteto /usr/local/bin/okteto
COPY --from=yq /usr/bin/yq /usr/bin/yq
COPY --from=cli /usr/local/bin/kubectl /usr/local/bin/kubectl

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]