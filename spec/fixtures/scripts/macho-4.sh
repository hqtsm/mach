#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

for arch in 'macho/'*'/dist/'*'/'; do
	pushd "${arch}" > /dev/null
	zip -r -y -X -9 "../$(basename "${arch}").zip" *
	popd > /dev/null
done
