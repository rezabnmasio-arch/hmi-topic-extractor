#!/bin/bash
set -Eeuo pipefail

PORT=5000
BACKEND_PORT=5001
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
DEPLOY_RUN_PORT=5000

cd "${COZE_WORKSPACE_PATH}"

kill_port_if_listening() {
    local port=$1
    local pids
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${port}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
    if [[ -z "${pids}" ]]; then
      echo "Port ${port} is free."
      return
    fi
    echo "Port ${port} in use by PIDs: ${pids} (SIGKILL)"
    echo "${pids}" | xargs -I {} kill -9 {} 2>/dev/null || true
    sleep 1
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${port}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
    if [[ -n "${pids}" ]]; then
      echo "Warning: port ${port} still busy after SIGKILL, PIDs: ${pids}"
    else
      echo "Port ${port} cleared."
    fi
}

echo "Clearing ports ${PORT} and ${BACKEND_PORT} before start."
kill_port_if_listening ${PORT}
kill_port_if_listening ${BACKEND_PORT}

echo "Starting backend service on port ${BACKEND_PORT}..."
BACKEND_PORT=${BACKEND_PORT} pnpm run dev:server > /app/work/logs/bypass/backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend PID: ${BACKEND_PID}"
sleep 2

echo "Starting frontend service on port ${PORT}..."
pnpm run dev:frontend
