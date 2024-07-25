#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

export CC='gcc'
archs=(
	'ppc'
	'ppc64'
	'ppc970'
	'i386'
	'x86_64'
	'ppc ppc64 ppc970 i386 x86_64'
)
sdk='/Developer/SDKs/MacOSX10.4u.sdk'
minver='-mmacosx-version-min=10.3'
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
			export FLAGS="${flags}"
			export ARCH="${arch}"
			export SIGN="${sign}"
			./build.sh
		done
	done
	popd > /dev/null
done
