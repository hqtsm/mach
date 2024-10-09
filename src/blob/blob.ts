/* eslint-disable max-classes-per-file */
import {struct} from '../struct.ts';
import type {BufferView} from '../type.ts';
import {constant} from '../util.ts';

import {BlobCore} from './blobcore.ts';

/**
 * Polymorphic memory blob for magic number.
 */
export class Blob extends BlobCore {
	public declare readonly ['constructor']: typeof Blob;

	/**
	 * Initialize blob with length.
	 *
	 * @param size Length.
	 */
	public initialize2(size = 0) {
		this.initialize(this.constructor.typeMagic, size);
	}

	/**
	 * Type magic number for this blob.
	 *
	 * @returns Type magic number.
	 */
	public static readonly typeMagic: number = 0;

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of bytes.
	 * @returns Blob.
	 */
	public static blobify(content: Readonly<BufferView> | number = 0) {
		const {BYTE_LENGTH} = Blob;
		let view;
		let size = BYTE_LENGTH;
		if (typeof content === 'number') {
			size += content;
		} else {
			view = new Uint8Array(
				content.buffer,
				content.byteOffset,
				content.byteLength
			);
			size += view.byteLength;
		}
		const buffer = new ArrayBuffer(size);
		const {typeMagic} = this;
		new (class extends Blob {
			public static readonly typeMagic = typeMagic;
		})(buffer).initialize2(size);
		if (view) {
			new Uint8Array(buffer, BYTE_LENGTH).set(view);
		}
		return new DataView(buffer);
	}

	static {
		blob(this);
	}
}

/**
 * Finalize Blob.
 *
 * @param BlobT Blob constructor.
 * @param byteLength Byte length.
 */
export function blob(
	BlobT: typeof Blob,
	byteLength: number = BlobT.BYTE_LENGTH
) {
	struct(BlobT, byteLength);
	constant(BlobT, 'typeMagic');
}
