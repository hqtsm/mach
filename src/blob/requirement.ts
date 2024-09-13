import {Blob} from '../blob.ts';
import {BufferView} from '../type.ts';
import {kSecCodeMagicRequirement} from '../const.ts';
import {subview} from '../util.ts';

/**
 * Requirement class.
 */
export class Requirement extends Blob {
	public declare readonly ['constructor']: typeof Requirement;

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
	public byteRead(buffer: BufferView, offset?: number): number {
		const d = subview(DataView, buffer, offset);
		const magic = d.getUint32(0);
		if (magic !== this.magic) {
			throw new Error(`Invalid magic: ${magic}`);
		}
		const length = d.getUint32(4);
		if (length < 8) {
			throw new Error(`Invalid length: ${length}`);
		}
		this.data = subview(Uint8Array, d, 8, length - 8);
		return length;
	}

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
