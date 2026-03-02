import type {
	HashCryptoSubtleAlgorithm,
	HashCryptoSubtleAsyncGenerator,
} from '../hash/dynamichash.ts';
import { type ArrayBufferData, asUint8Array } from '../util/memory.ts';

/**
 * Node crypto hash algorithm.
 */
export type NodeCryptoHashAlgorithm =
	| 'sha1'
	| 'sha256'
	| 'sha384'
	| 'sha512';

/**
 * Node crypto hash stream.
 */
export interface NodeCryptoHashStream {
	/**
	 * Write data to hash.
	 *
	 * @param data Data.
	 * @param cb Callback.
	 */
	// deno-lint-ignore no-explicit-any
	write(data: Uint8Array<ArrayBuffer>, cb: (err?: any) => void): void;

	/**
	 * End hash.
	 *
	 * @param cb Callback.
	 */
	// deno-lint-ignore no-explicit-any
	end(cb: (err?: any) => void): void;

	/**
	 * Get digest.
	 *
	 * @returns Hash digest.
	 */
	read(): ArrayBufferView;
}

/**
 * Node crypto hash interface.
 */
export interface NodeCryptoHash {
	/**
	 * Create hash.
	 *
	 * @param algo Hash algorithm.
	 */
	createHash(algo: NodeCryptoHashAlgorithm): NodeCryptoHashStream;
}

const nodeAlgorithm: Record<
	HashCryptoSubtleAlgorithm,
	NodeCryptoHashAlgorithm
> = {
	'SHA-1': 'sha1',
	'SHA-256': 'sha256',
	'SHA-384': 'sha384',
	'SHA-512': 'sha512',
};

/**
 * Create hash crypto from node crypto.
 *
 * @param crypto Node crypto.
 * @returns Hash crypto.
 */
export function hashCryptoFromNodeCrypto(
	crypto: NodeCryptoHash,
): HashCryptoSubtleAsyncGenerator {
	return {
		async digest(
			algorithm: HashCryptoSubtleAlgorithm,
			data: ArrayBufferData | AsyncGenerator<ArrayBuffer>,
		): Promise<ArrayBuffer> {
			const hash = crypto.createHash(nodeAlgorithm[algorithm]);
			if ('next' in data) {
				for await (const part of data) {
					const d = asUint8Array(part);
					await new Promise<void>((r, f) =>
						hash.write(d, (e) => e ? f(e) : r())
					);
				}
			} else {
				const d = asUint8Array(data);
				await new Promise<void>((r, f) =>
					hash.write(d, (e) => e ? f(e) : r())
				);
			}
			await new Promise<void>((r, f) => hash.end((e) => e ? f(e) : r()));
			const d = hash.read();
			return new Uint8Array(d.buffer, d.byteOffset, d.byteLength)
				.slice().buffer;
		},
	};
}
