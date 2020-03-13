FROM okteto/bin:1.1.6-cloud as cli

FROM alpine:3.11

COPY --from=cli /usr/local/bin/okteto /usr/local/bin/okteto

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]