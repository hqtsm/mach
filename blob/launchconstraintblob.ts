import { constant } from '@hqtsm/struct';
import { kSecCodeMagicLaunchConstraint } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * Launch constraint in DER format.
 */
export class LaunchConstraintBlob extends Blob {
	declare public readonly ['constructor']: typeof LaunchConstraintBlob;

	/**
	 * DER data.
	 *
	 * @returns View starting from DER.
	 */
	public get der(): Uint8Array {
		return new Uint8Array(this.buffer, this.byteOffset + 8);
	}

	/**
	 * DER length.
	 *
	 * @returns Byte length.
	 */
	public get derLength(): number {
		return this.length - 8;
	}

	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	static {
		constant(this, 'typeMagic');
	}
}
