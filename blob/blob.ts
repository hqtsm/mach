import { type Class, constant, toStringTag } from '@hqtsm/class';
import { BlobCore } from './blobcore.ts';

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
	 * @param this Type.
	 * @param blob Blob.
	 * @returns Cast blob or null.
	 */
	public static specific<T extends Blob>(
		this: new (...args: ConstructorParameters<typeof Blob>) => T,
		blob: BlobCore,
		context?: { errno: number },
	): T | null {
		const p = new this(blob.buffer, blob.byteOffset);
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

	static {
		toStringTag(this, 'Blob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
