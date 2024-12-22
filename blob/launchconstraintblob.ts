import { constant, type Ptr, Uint8Ptr } from '@hqtsm/struct';
import { kSecCodeMagicLaunchConstraint } from '../const.ts';
import { Blob } from './blob.ts';

/**
 * Launch constraint in DER format.
 */
export class LaunchConstraintBlob extends Blob {
	declare public readonly ['constructor']: Omit<
		typeof LaunchConstraintBlob,
		'new'
	>;

	/**
	 * DER data.
	 */
	public get der(): Ptr<number> {
		return new Uint8Ptr(
			this.buffer,
			this.byteOffset + 8,
			this.littleEndian,
		);
	}

	/**
	 * DER length.
	 */
	public get derLength(): number {
		return this.length - 8;
	}

	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	static {
		constant(this, 'typeMagic');
	}
}
