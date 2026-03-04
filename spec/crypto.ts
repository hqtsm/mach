// deno-lint-ignore no-external-import
import { createHash } from 'node:crypto';
import type {
	NodeCryptoHashAlgorithm,
	SubtleCryptoDigestAlgorithm,
} from '../util/crypto.ts';

const nodeHash: Record<
	SubtleCryptoDigestAlgorithm,
	NodeCryptoHashAlgorithm
> = {
	'SHA-1': 'sha1',
	'SHA-256': 'sha256',
	'SHA-384': 'sha384',
	'SHA-512': 'sha512',
};

const cb = (
	r: () => void,
	f: (e: unknown) => void,
	fail: (e: unknown) => void,
) =>
(e?: unknown | null) => {
	if (e) {
		f(e);
		fail(e);
	} else {
		r();
	}
};
const noop = () => {};
cb(noop, noop, noop)(1);

/**
 * Digest stream.
 */
export class DigestStream extends WritableStream<ArrayBuffer> {
	/**
	 * Digest.
	 */
	public readonly digest: Promise<ArrayBuffer>;

	/**
	 * Digest stream constructor.
	 *
	 * @param algorithm Digest algorithm.
	 */
	constructor(algorithm: SubtleCryptoDigestAlgorithm) {
		const hash = createHash(nodeHash[algorithm]);
		let pass: (hash: ArrayBuffer) => void;
		let fail: (e: unknown) => void;
		const digest = new Promise<ArrayBuffer>((r, f) => {
			pass = r;
			fail = f;
		});
		super({
			write: async (chunk): Promise<void> => {
				await new Promise<void>((r, f) =>
					hash.write(new Uint8Array(chunk), cb(r, f, fail))
				);
			},
			close: async (): Promise<void> => {
				await new Promise<void>((r, f) => hash.end(cb(r, f, fail)));
				const d = hash.read() as ArrayBufferView;
				pass(
					new Uint8Array(d.buffer, d.byteOffset, d.byteLength)
						.slice().buffer,
				);
			},
		});
		this.digest = digest;
	}
}
