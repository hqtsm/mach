import {Blob} from '../blob.ts';
import {BufferView} from '../type.ts';
import {viewUint8R, viewUint8W, viewDataR, viewDataW} from '../util.ts';

/**
 * UnknownBlob Blob.
 */
export class UnknownBlob extends Blob {
	public declare readonly ['constructor']: typeof UnknownBlob;

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
		return 8 + this.body.byteLength;
	}

	/**
	 * Compiled code signing requirement binary data.
	 */
	public body: BufferView = new Uint8Array();

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
		const data = viewUint8R(d, 8, length - 8).slice();
		this.#magic = magic;
		this.body = data;
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
		viewUint8W(d, 8).set(viewUint8R(this.body));
		return length;
	}
}
