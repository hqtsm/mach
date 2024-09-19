import {Blob} from './blob.ts';
import {kSecCodeMagicLaunchConstraint} from './const.ts';
import {viewUint8W} from './util.ts';

/**
 * Launch Constraint Blob.
 */
export class LaunchConstraintBlob extends Blob {
	public declare readonly ['constructor']: typeof LaunchConstraintBlob;

	/**
	 * DER data.
	 *
	 * @returns View of DER data.
	 */
	public get der() {
		return viewUint8W(this.data, 8, Math.max(this.derLength, 0));
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
