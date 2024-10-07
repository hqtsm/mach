import {Blob} from './blob.ts';
import {CSMAGIC_BLOBWRAPPER} from './const.ts';
import {memberU8A} from './member.ts';
import type {BufferView} from './type.ts';
import {cast, constant} from './util.ts';

/**
 * Generic blob wrapping arbitrary binary data.
 */
export class BlobWrapper extends Blob {
	public declare readonly ['constructor']: typeof BlobWrapper;

	/**
	 * Data of payload (only).
	 */
	public declare readonly dataArea: Uint8Array;

	/**
	 * Data of payload (only).
	 *
	 * @inheritdoc
	 */
	public get data() {
		// Overridden to point to payload (only).
		return cast(DataView, this.dataArea);
	}

	/**
	 * Get length of payload (only), set length for full blob.
	 *
	 * @inheritdoc
	 */
	public get length() {
		// Overridden to get length of payload (only).
		return super.length - 8;
	}

	/**
	 * Get length of payload (only), set length for full blob.
	 *
	 * @inheritdoc
	 */
	public set length(value: number) {
		// No change, needed to keep setter.
		super.length = value;
	}

	/**
	 * Wrap data into a new blob.
	 *
	 * @param content Data to wrap, or number of bytes.
	 * @param magic Magic number.
	 * @returns Blob.
	 */
	public static alloc(
		content: Readonly<BufferView> | number = 0,
		magic = BlobWrapper.typeMagic
	) {
		const {sizeof} = BlobWrapper;
		let view;
		let size = sizeof;
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
		const blob = new BlobWrapper(buffer);
		blob.initialize(magic, size);
		if (view) {
			new Uint8Array(buffer, sizeof).set(view);
		}
		return blob;
	}

	static {
		let {sizeof} = this;
		sizeof += memberU8A(this, sizeof, 'dataArea', 0);
		constant(this, 'sizeof', sizeof);
		constant(this, 'typeMagic', CSMAGIC_BLOBWRAPPER);
	}
}
