import { type ArrayBufferData, asUint8Array } from './memory.ts';

/**
 * Subtle crypto digest algorithm.
 */
export type SubtleCryptoDigestAlgorithm =
	| 'SHA-1'
	| 'SHA-256'
	| 'SHA-384'
	| 'SHA-512';

/**
 * Subtle crypto interface.
 */
export interface SubtleCrypto {
	/**
	 * Create digest.
	 *
	 * @param algorithm Hash algorithm.
	 * @param data Data to be hashed.
	 * @returns Hash digest.
	 */
	digest: (
		algorithm: SubtleCryptoDigestAlgorithm,
		data: ArrayBufferData,
	) => Promise<ArrayBuffer>;
}

/**
 * Subtle crypto interface with async generator extension.
 */
export interface SubtleCryptoExtended extends SubtleCrypto {
	/**
	 * Create digest.
	 *
	 * @param algorithm Hash algorithm.
	 * @param data Data to be hashed.
	 * @returns Hash digest.
	 */
	digest: (
		algorithm: SubtleCryptoDigestAlgorithm,
		data: ArrayBufferData | AsyncGenerator<ArrayBuffer>,
	) => Promise<ArrayBuffer>;
}

/**
 * Digest stream writer.
 */
export interface DigestStreamWriter {
	/**
	 * Write data.
	 *
	 * @param data Data.
	 * @returns Promise.
	 */
	write(data: ArrayBuffer): Promise<void>;

	/**
	 * Close stream.
	 *
	 * @returns Promise.
	 */
	close(): Promise<void>;
}

/**
 * Digest stream.
 */
export interface DigestStream {
	/**
	 * Get digest.
	 */
	readonly digest: Promise<ArrayBuffer>;

	/**
	 * Get writer.
	 *
	 * @returns Digest stream writer.
	 */
	getWriter(): DigestStreamWriter;
}

/**
 * Subtle crypto interface with digest stream interface.
 */
export interface SubtleCryptoStreaming extends SubtleCrypto {
	/**
	 * Create digest stream.
	 *
	 * @param algorithm Hash algorithm.
	 * @returns Digest stream.
	 */
	DigestStream: new (algorithm: SubtleCryptoDigestAlgorithm) => DigestStream;
}

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
	SubtleCryptoDigestAlgorithm,
	NodeCryptoHashAlgorithm
> = {
	'SHA-1': 'sha1',
	'SHA-256': 'sha256',
	'SHA-384': 'sha384',
	'SHA-512': 'sha512',
};

/**
 * Create subtle crypto from node crypto.
 *
 * @param crypto Node crypto.
 * @returns Subtle crypto with async generator extension.
 */
export function subtleCryptoFromNodeCrypto(
	crypto: NodeCryptoHash,
): SubtleCryptoExtended {
	return {
		async digest(
			algorithm: SubtleCryptoDigestAlgorithm,
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

/**
 * Create subtle crypto from streaming crypto.
 *
 * @param crypto Streaming crypto.
 * @returns Subtle crypto with async generator extension.
 */
export function subtleCryptoFromStreaming(
	crypto: SubtleCryptoStreaming,
): SubtleCryptoExtended {
	return {
		async digest(
			algorithm: SubtleCryptoDigestAlgorithm,
			data: ArrayBufferData | AsyncGenerator<ArrayBuffer>,
		): Promise<ArrayBuffer> {
			if ('next' in data) {
				const stream = new crypto.DigestStream(algorithm);
				const writer = stream.getWriter();
				for await (const part of data) {
					await writer.write(part);
				}
				await writer.close();
				return await stream.digest;
			}
			return crypto.digest(algorithm, data);
		},
	};
}
