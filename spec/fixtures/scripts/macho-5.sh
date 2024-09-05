#!/usr/bin/env bash
set -o errexit
set -o nounset
set -o pipefail

tmpdir='/tmp/macho-sign-signatures'
tmpbin="${tmpdir}/bin"
rm -rf "${tmpdir}"
mkdir "${tmpdir}"
for d in 'macho/'*'/dist/'*'/'*'/'; do
	d="${d%/*}"
	while read -r f; do
		archs="$(lipo -archs "${f}")"
		printf '%s:\n' "${f}"
		for arch in $archs; do
			printf '\t%s:\n' "${arch}"
			if [[ "${arch}" == "${archs}" ]]; then
				cp "${f}" "${tmpbin}"
			else
				lipo "${f}" -thin "${arch}" -output "${tmpbin}"
			fi
			sigoff="$(
				otool -l "${tmpbin}" |\
					grep 'LC_CODE_SIGNATURE' -A 2 |\
					grep -o 'dataoff .*' |\
					cut -d' ' -f2 || true
				)"
			if [[ ! -z "${sigoff}" ]]; then
				version=''
				flags=''
				identifier=''
				teamid=''
				page=''
				hashes=''
				execsegbase=''
				execseglimit=''
				execsegflags=''
				while read -r line; do
					case "${line}" in
						'CodeDirectory'*)
							version="0x$(
								grep -o 'v=[^ ]*' <<< "${line#* }" |\
								cut -d'=' -f2
							)"
							flags="$(
								grep -o 'flags=[^ ()]*' <<< "${line#* }" |\
								cut -d'=' -f2
							)"
							;;
						'Identifier='*)
							identifier="${line#*=}"
							;;
						'TeamIdentifier=not set')
							teamid=''
							;;
						'TeamIdentifier='*)
							teamid="${line#*=}"
							;;
						'Hash choices='*)
							hashes="${line#*=}"
							;;
						'Page size='*)
							page="${line#*=}"
							;;
						'Executable Segment base='*)
							execsegbase="${line#*=}"
							;;
						'Executable Segment limit='*)
							execseglimit="${line#*=}"
							;;
						'Executable Segment flags='*)
							execsegflags="${line#*=}"
							;;
					esac
				done < <(codesign -vvvvd "$tmpbin" 2>&1)
				printf '\t\t%s=%s\n' 'offset' "${sigoff}"
				printf '\t\t%s=%s\n' 'version' "${version}"
				printf '\t\t%s=%s\n' 'flags' "${flags}"
				printf '\t\t%s=%s\n' 'identifier' "${identifier}"
				printf '\t\t%s=%s\n' 'teamid' "${teamid}"
				printf '\t\t%s=%s\n' 'hashes' "${hashes}"
				printf '\t\t%s=%s\n' 'page' "${page}"
				printf '\t\t%s=%s\n' 'execsegbase' "${execsegbase}"
				printf '\t\t%s=%s\n' 'execseglimit' "${execseglimit}"
				printf '\t\t%s=%s\n' 'execsegflags' "${execsegflags}"
			fi
			rm "${tmpbin}"
		done
	done < <(
		find -s "${d}" -type f -not -iname '.*' \
			'(' \
				-not -ipath '*.app/*' \
				-o \
				-ipath '*.app/Contents/MacOS/*' \
				-o \
				-ipath '*.app/Contents/Frameworks/*/Versions/A/*' \
				-not -ipath '*/_CodeSignature/*' \
				-not -iname '*.plist' \
			')' \
			-print
	)
done > 'macho.txt'
rm -rf "${tmpdir}"
