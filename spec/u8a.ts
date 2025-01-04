export function indexOf(
	haystack: Readonly<Uint8Array>,
	needle: Readonly<Uint8Array>,
	offset = 0,
): number {
	const l = needle.length;
	OUTER: for (const e = haystack.length - l; offset <= e; offset++) {
		offset = haystack.indexOf(needle[0], offset);
		if (offset < 0) {
			break;
		}
		for (let i = 1; i < l; i++) {
			if (haystack[offset + i] !== needle[i]) {
				continue OUTER;
			}
		}
		return offset;
	}
	return -1;
}
