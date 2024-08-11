#!/bin/sh
DOCKER_HOST=
docker login docker.re-idea.jp
docker buildx build . --platform=linux/amd64 -t docker.re-idea.jp/market-entry-lp-backend:latest
docker push docker.re-idea.jp/market-entry-lp-backend:latest
