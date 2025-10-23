export function hex(data: Readonly<Uint8Array>, delim = ''): string {
	return [...data].map((x) => x.toString(16).padStart(2, '0')).join(delim);
}

export function unhex(...hex: string[]): InstanceType<typeof Uint8Array> {
	return new Uint8Array(
		hex
			.join('')
			.replace(/\s+/g, '')
			.match(/.{1,2}/g)!
			.map((x) => +`0x${x}`),
	);
}
