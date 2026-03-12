#!/usr/bin/env bash

cd "$(dirname "$0")/.."

set -e

OUTPUT=$(cd agent-backend && npm test || true)

if echo "$OUTPUT" | grep -q '"success": true'; then
  echo "{\"success\": true, \"component\": \"agent-backend\", \"details\": \"Tests passed\"}"
  exit 0
else
  echo "{\"success\": false, \"component\": \"agent-backend\", \"details\": \"Tests failed\"}" >&2
  exit 1
fi

