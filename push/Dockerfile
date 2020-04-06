FROM okteto/okteto:1.8.2 as cli
FROM mikefarah/yq as yq

FROM alpine:3.11

COPY --from=cli /usr/local/bin/okteto /usr/local/bin/okteto
COPY --from=yq /usr/bin/yq /usr/bin/yq

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]