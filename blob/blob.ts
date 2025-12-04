import { type Class, type Concrete, constant, toStringTag } from '@hqtsm/class';
import type { Reader } from '../util/reader.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Blob static.
 *
 * @template T Blob type.
 */
export type BlobStatic<T extends Blob = Blob> =
	& typeof Blob
	& (new (...args: ConstructorParameters<typeof Blob>) => T);

/**
 * Polymorphic memory blob for magic number.
 */
export abstract class Blob extends BlobCore {
	declare public readonly ['constructor']: Class<typeof Blob>;

	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param size Length.
	 */
	public initializeLength(size = 0): void {
		this.initialize(this.constructor.typeMagic, size);
	}

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param length Optionally require exact length.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public validateBlobLength(
		length?: number,
		context?: { errno: number },
	): boolean {
		const { byteLength } = this;
		if (length === undefined) {
			return this.validateBlob(
				this.constructor.typeMagic,
				byteLength,
				undefined,
				context,
			);
		}
		return (
			length >= byteLength &&
			this.validateBlob(
				this.constructor.typeMagic,
				byteLength,
				undefined,
				context,
			) &&
			this.mLength === length
		);
	}

	/**
	 * Type magic number for this blob.
	 *
	 * @returns Type magic number.
	 */
	public static readonly typeMagic: number = 0;

	/**
	 * Cast blob to specific type.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param blob Blob.
	 * @param context Context.
	 * @returns Cast blob or null.
	 */
	public static specific<T extends Blob>(
		this: BlobStatic<T>,
		blob: BlobCore,
		context?: { errno: number },
	): T | null {
		const p = new (this as Concrete<typeof this>)(
			blob.buffer,
			blob.byteOffset,
		);
		return p.validateBlobLength(undefined, context) ? p : null;
	}

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap.
	 * @returns Blob data.
	 */
	public static blobify(
		content: ArrayBufferLike | ArrayBufferView,
	): ArrayBuffer {
		const { typeMagic } = this;
		const { BYTE_LENGTH } = BlobCore;
		const view = 'buffer' in content
			? new Uint8Array(
				content.buffer,
				content.byteOffset,
				content.byteLength,
			)
			: new Uint8Array(content);
		const size = BYTE_LENGTH + view.byteLength;
		const buffer = new ArrayBuffer(size);
		new (class extends Blob {
			public static override readonly typeMagic = typeMagic;
		})(buffer).initializeLength(size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return buffer;
	}

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends Blob>(
		this: BlobStatic<T>,
		reader: Reader,
		context?: { errno: number },
	): Promise<BlobCore | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends Blob>(
		this: BlobStatic<T>,
		reader: Reader,
		offset: number,
		maxSize?: number,
		context?: { errno: number },
	): Promise<BlobCore | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends Blob>(
		this: BlobStatic<T>,
		reader: Reader,
		offset?: number | { errno: number },
		maxSize?: number,
		context?: { errno: number },
	): Promise<BlobCore | null> {
		if (typeof offset !== 'number') {
			context = offset;
			maxSize = offset = 0;
		}
		const p = await BlobCore.readBlobInternal(
			reader,
			offset,
			this.typeMagic,
			0,
			maxSize || 0,
			context,
		);
		return p ? this.specific(p, context) : p;
	}

	static {
		toStringTag(this, 'Blob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
