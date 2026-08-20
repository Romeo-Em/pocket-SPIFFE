#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
INDEX_NAME="${QMD_INDEX_NAME:-ppd}"
CONFIG_DIR="${QMD_CONFIG_DIR:-${HOME}/.config/qmd}"
CONFIG_PATH="${CONFIG_DIR}/${INDEX_NAME}.yml"

mkdir -p "${CONFIG_DIR}"
mkdir -p \
    "${REPO_ROOT}/output/01.meetings" \
    "${REPO_ROOT}/output/02.strategy" \
    "${REPO_ROOT}/output/03.pdrs" \
    "${REPO_ROOT}/output/04.wireframes"

cat > "${CONFIG_PATH}" <<EOF
collections:
  meetings:
    path: "${REPO_ROOT}/output/01.meetings"
    pattern: "**/*.md"
  strategy:
    path: "${REPO_ROOT}/output/02.strategy"
    pattern: "**/*.md"
  pdr:
    path: "${REPO_ROOT}/output/03.pdrs"
    pattern: "**/*.md"
  wireframes:
    path: "${REPO_ROOT}/output/04.wireframes"
    pattern: "**/*.md"
EOF

printf 'Bootstrapped QMD config: %s\n' "${CONFIG_PATH}"
printf 'Index name: %s\n' "${INDEX_NAME}"