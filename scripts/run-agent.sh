#!/usr/bin/env bash

node "./agent-backend/dist/server.js" 2> >(jq -R -s '{stderr: .}' >&2) | jq -R -s '{stdout: .}'

