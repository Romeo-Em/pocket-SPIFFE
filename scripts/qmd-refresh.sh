#!/usr/bin/env bash
set -euo pipefail

usage() {
    cat <<'EOF'
Usage:
  qmd-refresh.sh [--no-embed]

Options:
  --no-embed   Run qmd update + status only.
EOF
}

EMBED=1
if [ "${1:-}" = "--no-embed" ]; then
    EMBED=0
    shift
fi

if [ "$#" -ne 0 ]; then
    usage >&2
    exit 2
fi

if ! command -v qmd >/dev/null 2>&1; then
    printf '%s\n' 'qmd-refresh: qmd not found in PATH' >&2
    printf '%s\n' 'Install with: npm install -g @tobilu/qmd' >&2
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_NAME="${QMD_INDEX_NAME:-ppd}"

"${SCRIPT_DIR}/qmd-bootstrap.sh" >/dev/null

qmd --index "${INDEX_NAME}" update
if [ "${EMBED}" -eq 1 ]; then
    qmd --index "${INDEX_NAME}" embed
fi
qmd --index "${INDEX_NAME}" status