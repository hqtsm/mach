import { type ArrayBufferReal, type BufferView, constant } from '@hqtsm/struct';
import { BlobCore } from './blobcore.ts';

/**
 * Polymorphic memory blob for magic number.
 *
 * @template B Blob type.
 * @template M Magic number.
 */
export interface Blob<B extends BlobCore, M extends number> extends BlobCore {
	/**
	 * Blob constructor.
	 */
	readonly constructor: Omit<BlobConstructor<B, M>, 'new'>;

	/**
	 * Initialize blob with length, using known type magic.
	 *
	 * @param size Length.
	 */
	initializeLength(size?: number): void;

	/**
	 * Validate blob with length, using known type magic.
	 *
	 * @param length Optionally require exact length.
	 */
	validateBlobLength(length?: number): void;
}

/**
 * Blob constructor.
 *
 * @template B Blob type.
 * @template M Magic number.
 */
export interface BlobConstructor<
	B extends BlobCore,
	M extends number,
> extends Omit<typeof BlobCore, 'new'> {
	/**
	 * Blob constructor.
	 */
	new (...args: ConstructorParameters<typeof BlobCore>): Blob<B, M>;

	/**
	 * Blob prototype.
	 */
	readonly prototype: Blob<B, M>;

	/**
	 * Type magic number for this blob.
	 *
	 * @returns Type magic number.
	 */
	readonly typeMagic: M;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of content bytes.
	 * @returns Blob data.
	 */
	blobify(content: ArrayBufferReal | BufferView | number): ArrayBuffer;
}

/**
 * Blob template.
 *
 * @template B Blob type.
 * @template M Magic number.
 * @param Class Blob class.
 * @param magic Type magic number.
 * @returns Blob constructor.
 */
export function templateBlob<
	B extends Blob<BlobCore, M>,
	M extends number,
>(
	_Class: () => Omit<BlobConstructor<B, M>, 'new'> & {
		new (...args: ConstructorParameters<BlobConstructor<B, M>>): B;
	},
	magic: M,
): BlobConstructor<B, M> {
	return class Blob extends BlobCore {
		declare public readonly ['constructor']: Omit<typeof Blob, 'new'>;

		public initializeLength(size = 0): void {
			this.initialize(this.constructor.typeMagic, size);
		}

		public validateBlobLength(length?: number): void {
			const { byteLength } = this;
			if (length === undefined) {
				this.validateBlob(this.constructor.typeMagic, byteLength);
			} else {
				if (length < byteLength) {
					throw new RangeError('Invalid length');
				}
				this.validateBlob(this.constructor.typeMagic, byteLength);
				if (this.mLength !== length) {
					throw new RangeError('Invalid length');
				}
			}
		}

		public static readonly typeMagic = magic;

		public static blobify(
			content: ArrayBufferReal | BufferView | number = 0,
		): ArrayBuffer {
			const { BYTE_LENGTH } = Blob;
			let view;
			let size = BYTE_LENGTH;
			if (typeof content === 'number') {
				size += content;
			} else {
				view = 'buffer' in content
					? new Uint8Array(
						content.buffer,
						content.byteOffset,
						content.byteLength,
					)
					: new Uint8Array(content);
				size += view.byteLength;
			}
			const buffer = new ArrayBuffer(size);
			new Blob(buffer).initializeLength(size);
			if (view) {
				new Uint8Array(buffer, BYTE_LENGTH).set(view);
			}
			return buffer;
		}

		static {
			constant(this, 'BYTE_LENGTH');
			constant(this, 'typeMagic');
		}
	};
}
