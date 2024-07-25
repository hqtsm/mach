#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

for arch in 'macho/'*'/dist/'*'/'; do
	pushd "${arch}" > /dev/null
	rm -rf us usr ar

	cp -R u us
	find us -type f -iname '*.dylib' -execdir codesign -f -s - '{}' \;
	find us -type d -iname '*.framework' -execdir codesign -f -s - '{}' \;
	find us -type d -iname '*.app' -execdir codesign -f -s - '{}' \;
	find us -type f -not -ipath '*.*' -execdir codesign -f -s - '{}' \;

	cp -R us usr
	find usr -type f -iname '*.dylib' -execdir codesign --remove-signature '{}' \;
	find usr -type d -iname '*.framework' -execdir codesign --remove-signature '{}' \;
	find usr -type d -iname '*.app' -execdir codesign --remove-signature '{}' \;
	find usr -type f -not -ipath '*.*' -execdir codesign --remove-signature '{}' \;

	if [[ -d a ]]; then
		cp -R a ar
		find ar -type f -iname '*.dylib' -execdir codesign --remove-signature '{}' \;
		find ar -type d -iname '*.framework' -execdir codesign --remove-signature '{}' \;
		find ar -type d -iname '*.app' -execdir codesign --remove-signature '{}' \;
		find ar -type f -not -ipath '*.*' -execdir codesign --remove-signature '{}' \;
	fi

	popd > /dev/null
done
