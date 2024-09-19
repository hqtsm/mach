import {Blob} from '../blob.ts';
import {kSecCodeMagicEntitlement} from '../const.ts';
import {BufferView} from '../type.ts';
import {viewUint8R, viewUint8W, viewDataR, viewDataW} from '../util.ts';

/**
 * Entitlement Blob.
 */
export class EntitlementBlob extends Blob {
	public declare readonly ['constructor']: typeof EntitlementBlob;

	/**
	 * @inheritdoc
	 */
	public get magic() {
		return kSecCodeMagicEntitlement;
	}

	/**
	 * @inheritdoc
	 */
	public get length() {
		return 8 + this.body.byteLength;
	}

	/**
	 * Binary data.
	 */
	public body: BufferView = new Uint8Array();

	/**
	 * @inheritdoc
	 */
	public byteRead(buffer: Readonly<BufferView>, offset = 0): number {
		const d = viewDataR(buffer, offset);
		const magic = d.getUint32(0);
		if (magic !== this.magic) {
			throw new Error(`Invalid magic: ${magic}`);
		}
		const length = d.getUint32(4);
		if (length < 8) {
			throw new Error(`Invalid length: ${length}`);
		}
		this.body = viewUint8R(d, 8, length - 8).slice();
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
