import {Blob} from './blob.ts';
import {CSMAGIC_BLOBWRAPPER} from './const.ts';
import {viewDataW} from './util.ts';

/**
 * Generic Blob.
 */
export class BlobWrapper extends Blob {
	public declare readonly ['constructor']: typeof BlobWrapper;

	/**
	 * Overridden to point to payload (only).
	 * Apple weirdness.
	 *
	 * @inheritdoc
	 */
	public get data() {
		return viewDataW(this, 8, this.length);
	}

	/**
	 * Overridden to point to payload (only).
	 * Apple weirdness.
	 *
	 * @inheritdoc
	 */
	public get length() {
		return super.length - 8;
	}

	/**
	 * Unchanged from parent setter.
	 *
	 * @inheritdoc
	 */
	public set length(value: number) {
		super.length = value;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = CSMAGIC_BLOBWRAPPER;
}
