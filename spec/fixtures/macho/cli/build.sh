#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

dist="dist/${ARCH// /-}/${SIGN}"
rm -rf "${dist}"
mkdir -p "${dist}"

bin='main'
"${CC}" $FLAGS \
	-o "${dist}/${bin}" \
	'src/main.c'
