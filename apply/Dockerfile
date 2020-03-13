FROM okteto/bin:1.1.9-cloud as cli

FROM alpine:3.11

COPY --from=cli /usr/local/bin/kubectl /usr/local/bin/kubectl

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"] 