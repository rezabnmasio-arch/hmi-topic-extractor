#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
PORT=5000
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"

start_service() {
    cd "${COZE_WORKSPACE_PATH}"
    
    # 生产环境下，Express 同时服务 API 和静态文件
    echo "Starting HTTP service on port ${DEPLOY_RUN_PORT}..."
    DEPLOY_RUN_PORT=${DEPLOY_RUN_PORT} npx tsx server/index.ts
}

echo "Starting HTTP service on port ${DEPLOY_RUN_PORT} for deploy..."
start_service
