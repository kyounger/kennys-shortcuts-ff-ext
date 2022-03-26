#!/usr/bin/env sh

set -eufo pipefail

echo $AMO_JWT_ISSUER
echo $AMO_JWT_SECRET

EXT_VERSION=$(jq -r '.version' manifest.json)
DOCKER_TAG=kennys-ff-ext-builder${EXT_VERSION}

docker build --progress=plain --tag ff-web-ext .
docker run --rm -v $(pwd):/root --entrypoint "" ff-web-ext /bin/sh -c "cd /root && web-ext build && web-ext sign --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET"
