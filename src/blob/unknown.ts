import {Blob} from '../blob.ts';
import {BufferView} from '../type.ts';
import {viewUint8R, viewUint8W, viewDataR, viewDataW} from '../util.ts';

/**
 * Unknown Blob.
 */
export class Unknown extends Blob {
	public declare readonly ['constructor']: typeof Unknown;

	/**
	 * Magic number.
	 */
	#magic = 0;

	/**
	 * @inheritdoc
	 */
	public get magic() {
		return this.#magic;
	}

	/**
	 * @inheritdoc
	 */
	public set magic(magic: number) {
		this.#magic = magic;
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
	public byteRead(buffer: Readonly<BufferView>, offset = 0): number {
		const d = viewDataR(buffer, offset);
		const magic = d.getUint32(0);
		const length = d.getUint32(4);
		if (length < 8) {
			throw new Error(`Invalid length: ${length}`);
		}
		// eslint-disable-next-line unicorn/prefer-spread
		const data = viewUint8R(d, 8, length - 8).slice();
		this.#magic = magic;
		this.data = data;
		return length;
	}

	/**
	 * @inheritdoc
	 */
	public byteWrite(buffer: BufferView, offset = 0) {
		const {length} = this;
		const d = viewDataW(buffer, offset, length);
		d.setUint32(0, this.magic);
		d.setUint32(4, length);
		viewUint8W(d, 8).set(viewUint8R(this.data));
		return length;
	}
}
