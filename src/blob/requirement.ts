import {Blob} from '../blob.ts';
import {BufferView} from '../type.ts';
import {kSecCodeMagicRequirement} from '../const.ts';
import {subview} from '../util.ts';

/**
 * Requirement class.
 */
export class Requirement extends Blob {
	/**
	 * @inheritdoc
	 */
	public get magic() {
		return kSecCodeMagicRequirement;
	}

	/**
	 * @inheritdoc
	 */
	public get length() {
		return 8 + this.data.byteLength;
	}

	/**
	 * Compiled code signing requirement binary data.
	 */
	public data: BufferView = new Uint8Array();

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const {length} = this;
		const d = subview(DataView, buffer, offset, length);
		d.setUint32(0, this.magic);
		d.setUint32(4, length);
		subview(Uint8Array, d, 8).set(subview(Uint8Array, this.data));
		return length;
	}
}
