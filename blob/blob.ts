import { type Concrete, constant, toStringTag } from '@hqtsm/class';
import { asUint8Array } from '../util/memory.ts';
import type { Reader } from '../util/reader.ts';
import { BlobCore } from './blobcore.ts';

/**
 * Blob template.
 */
export type TemplateBlob = Concrete<typeof Blob> & typeof Blob;

/**
 * Polymorphic memory blob for magic number.
 */
export abstract class Blob extends BlobCore {
	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param size Length.
	 */
	public static initializeSize(_this: Blob, size = 0): void {
		BlobCore.initialize(_this, this.typeMagic, size);
	}

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Blob,
		context?: { errno: number },
	): boolean;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param length Require exact length.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Blob,
		length: number,
		context?: { errno: number },
	): boolean;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param _this This.
	 * @param length Exact length or context.
	 * @param context Context.
	 * @returns Is valid.
	 */
	public static validateBlobSize(
		_this: Blob,
		length?: number | { errno: number },
		context?: { errno: number },
	): boolean {
		if (typeof length === 'number') {
			return (
				length >= _this.byteLength &&
				Blob.validateBlobSize.call<
					typeof this,
					[typeof _this, typeof context],
					boolean
				>(this, _this, context) &&
				_this.mLength === length
			);
		}
		return BlobCore.validateBlob(
			_this,
			this.typeMagic,
			_this.byteLength,
			undefined,
			length,
		);
	}

	/**
	 * Clone blob.
	 *
	 * @template T Blob type.
	 * @param this Blob class.
	 * @param _this This.
	 * @param context Context.
	 * @returns Cloned blob.
	 */
	public static override clone<T extends TemplateBlob>(
		this: T,
		_this: Blob,
		context?: { errno: number },
	): T['prototype'] | null {
		const c = BlobCore.clone(_this);
		return c && Blob.specific.call(this, c, context);
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
	public static specific<T extends TemplateBlob>(
		this: T,
		blob: BlobCore,
		context?: { errno: number },
	): T['prototype'] | null {
		const p = new this(blob.buffer, blob.byteOffset, blob.littleEndian);
		return Blob.validateBlobSize.call<
				typeof this,
				[typeof p, typeof context],
				boolean
			>(this, p, context)
			? p
			: null;
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
		const view = asUint8Array(content);
		const size = BYTE_LENGTH + view.byteLength;
		const buffer = new ArrayBuffer(size);
		class B extends Blob {
			public static override readonly typeMagic = typeMagic;
		}
		B.initializeSize(new B(buffer), size);
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
	public static override async readBlob<T extends TemplateBlob>(
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
	public static override async readBlob<T extends TemplateBlob>(
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
	public static override async readBlob<T extends TemplateBlob>(
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
