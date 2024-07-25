#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

export CC='clang'
archs=(
	'arm64'
	'x86_64 arm64'
)
sdk='/Library/Developer/CommandLineTools/SDKs/MacOSX11.sdk'
minver='-mmacosx-version-min=11.0'
warnings='-Wall -Wextra -Wno-unused-parameter'
includes="-I${sdk}/usr/include"

for sample in 'macho/'*'/'; do
	pushd "${sample}" > /dev/null
	for arch in "${archs[@]}"; do
		flags="${warnings}"
		signs=('u')
		for a in $arch; do
			flags="${flags} -arch ${a}"
			if [[ "${a}" == 'arm64' ]]; then
				signs=('a' 'u')
			fi
		done
		flags="${flags} -isysroot ${sdk} ${includes} ${minver}"

		for sign in "${signs[@]}"; do
			if [[ "${a}" == 'arm64' && "${sign}" == 'u' ]]; then
				export FLAGS="${flags} -Wl,-no_adhoc_codesign"
			else
				export FLAGS="${flags}"
			fi
			export ARCH="${arch}"
			export SIGN="${sign}"
			./build.sh
		done
	done
	popd > /dev/null
done
