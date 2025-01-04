import {
	kSecCodeSignatureHashSHA1,
	kSecCodeSignatureHashSHA256,
	kSecCodeSignatureHashSHA256Truncated,
	kSecCodeSignatureHashSHA384,
	kSecCodeSignatureHashSHA512,
} from '../const.ts';

export async function hash(
	hashType: number,
	data: Readonly<ArrayBufferView>,
): Promise<Uint8Array> {
	let limit = -1;
	let algo = '';
	switch (hashType) {
		case kSecCodeSignatureHashSHA1: {
			algo = 'SHA-1';
			break;
		}
		case kSecCodeSignatureHashSHA256Truncated: {
			limit = 20;
			algo = 'SHA-256';
			break;
		}
		case kSecCodeSignatureHashSHA256: {
			algo = 'SHA-256';
			break;
		}
		case kSecCodeSignatureHashSHA384: {
			algo = 'SHA-384';
			break;
		}
		case kSecCodeSignatureHashSHA512: {
			algo = 'SHA-512';
			break;
		}
		default: {
			throw new Error(`Unknown hash type: ${hashType}`);
		}
	}
	const h = await crypto.subtle.digest(algo, data);
	return new Uint8Array(limit < 0 ? h : h.slice(0, limit));
}

// deno-lint-ignore require-await
export async function chunkedHashes(
	hashType: number,
	data: Readonly<ArrayBufferView>,
	chunk: number,
	offset = 0,
	length = -1,
): Promise<Uint8Array[]> {
	const d = length < 0
		? new Uint8Array(data.buffer, data.byteOffset + offset)
		: new Uint8Array(data.buffer, data.byteOffset + offset, length);
	const l = d.length;
	chunk = chunk || l;
	const slices = [];
	for (let i = 0; i < l; i += chunk) {
		slices.push(d.subarray(i, Math.min(i + chunk, l)));
	}
	return Promise.all(slices.map((d) => hash(hashType, d)));
}
