import {Blob} from './blob.ts';
import {kSecCodeMagicLaunchConstraint} from './const.ts';

/**
 * Launch Constraint Blob.
 */
export class LaunchConstraintBlob extends Blob {
	public declare readonly ['constructor']: typeof LaunchConstraintBlob;

	/**
	 * DER data.
	 *
	 * @returns View starting from DER.
	 */
	public get der() {
		return new Uint8Array(this.buffer, this.byteOffset + 8);
	}

	/**
	 * DER length.
	 *
	 * @returns Byte length.
	 */
	public get derLength() {
		return this.length - 8;
	}

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = kSecCodeMagicLaunchConstraint;
}
