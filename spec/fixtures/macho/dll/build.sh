#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

dist="dist/${ARCH// /-}/${SIGN}"
rm -rf "${dist}"
mkdir -p "${dist}"

dylib='sample.dylib'
bin='main'

"${CC}" $FLAGS \
	-shared \
	-o "${dist}/${dylib}" \
	'src/sample.c'

"${CC}" $FLAGS \
	-o "${dist}/${bin}" \
	'src/main.c'
