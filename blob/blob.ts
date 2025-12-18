import { type Class, type Concrete, constant, toStringTag } from '@hqtsm/class';
import type { Reader } from '../util/reader.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Polymorphic memory blob for magic number.
 */
export abstract class Blob extends BlobCore {
	declare public readonly ['constructor']: Class<typeof Blob>;

	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param self This.
	 * @param size Length.
	 */
	public static initializeLength(self: Blob, size = 0): void {
		BlobCore.initialize(self, this.typeMagic, size);
	}

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param self This.
	 * @param length Optionally require exact length.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobLength(
		self: Blob,
		length?: number,
		context?: { errno: number },
	): boolean {
		if (length === undefined) {
			return BlobCore.validateBlob(
				self,
				self.constructor.typeMagic,
				self.byteLength,
				undefined,
				context,
			);
		}
		return (
			length >= self.byteLength &&
			Blob.validateBlobLength(self, undefined, context) &&
			self.mLength === length
		);
	}

	/**
	 * Clone blob.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param self This.
	 * @param context Context.
	 * @returns Cloned blob.
	 */
	public static override clone<T extends Concrete<typeof Blob>>(
		this: T,
		self: Blob,
		context?: { errno: number },
	): T['prototype'] | null {
		const c = BlobCore.clone(self);
		return c && this.specific(c, context);
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
	public static specific<T extends Concrete<typeof Blob>>(
		this: T,
		blob: BlobCore,
		context?: { errno: number },
	): T['prototype'] | null {
		const p = new this(blob.buffer, blob.byteOffset, blob.littleEndian);
		return Blob.validateBlobLength(p, undefined, context) ? p : null;
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
		class B extends Blob {
			public static override readonly typeMagic = typeMagic;
		}
		B.initializeLength(new B(buffer), size);
		new Uint8Array(buffer, BYTE_LENGTH).set(view);
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
	public static override async readBlob<T extends Concrete<typeof Blob>>(
		this: T,
		reader: Reader,
		context?: { errno: number },
	): Promise<T['prototype'] | null>;

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
	public static override async readBlob<T extends Concrete<typeof Blob>>(
		this: T,
		reader: Reader,
		offset: number,
		maxSize?: number,
		context?: { errno: number },
	): Promise<T['prototype'] | null>;

	/**
	 * Read blob from reader.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param reader Reader.
	 * @param offset Byte offset or context.
	 * @param maxSize Maximum size.
	 * @param context Context.
	 * @returns Blob or null if not valid.
	 */
	public static override async readBlob<T extends Concrete<typeof Blob>>(
		this: T,
		reader: Reader,
		offset?: number | { errno: number },
		maxSize?: number,
		context?: { errno: number },
	): Promise<T['prototype'] | null> {
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
		return p ? Blob.specific.call(this, p, context) : p;
	}

	static {
		toStringTag(this, 'Blob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
