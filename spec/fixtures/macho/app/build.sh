#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

if [[ "${SIGN}" == 'a' ]]; then
	exit
fi

dist="dist/${ARCH// /-}/${SIGN}"
rm -rf "${dist}"
mkdir -p "${dist}"

dylib='Sample'
framework="${dylib}.framework"
bin='Sample'
app="${bin}.app"
frameworks="${dist}/${app}/Contents/Frameworks"

mkdir -p "${frameworks}/${framework}/Versions/A/Resources"
ln -s 'Versions/Current/Resources' "${frameworks}/${framework}/Resources"
ln -s "Versions/Current/${dylib}" "${frameworks}/${framework}/${dylib}"
ln -s 'A' "${frameworks}/${framework}/Versions/Current"
"${CC}" $FLAGS \
	-dynamiclib \
	-current_version '1.0.0' -compatibility_version '1.0.0' \
	-install_name "@executable_path/../Frameworks/${framework}/Versions/A/${dylib}" \
	-o "${frameworks}/${framework}/Versions/A/${dylib}" \
	'src/sample.c'
cp 'src/sample.plist' "${frameworks}/${framework}/Versions/Current/Resources/Info.plist"

mkdir "${dist}/${app}/Contents/MacOS"
mkdir "${dist}/${app}/Contents/Resources"
"${CC}" $FLAGS \
	-F"${frameworks}" \
	-framework "${dylib}" \
	-o "${dist}/${app}/Contents/MacOS/${bin}" \
	'src/main.c'
cp 'src/icon.icns' "${dist}/${app}/Contents/Resources/Sample.icns"
cp 'src/main.plist' "${dist}/${app}/Contents/Info.plist"
