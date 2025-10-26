import { constant, Uint8Ptr } from '@hqtsm/struct';
import { kSecCodeMagicLaunchConstraint } from '../const.ts';
import { type BlobConstructor, templateBlob } from './blob.ts';

const Blob: BlobConstructor<
	LaunchConstraintBlob,
	typeof kSecCodeMagicLaunchConstraint
> = templateBlob(
	() => LaunchConstraintBlob,
	kSecCodeMagicLaunchConstraint,
);

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
	 *
	 * @returns Data pointer.
	 */
	public der(): Uint8Ptr {
		return new Uint8Ptr(
			this.buffer,
			this.byteOffset + 8,
			this.littleEndian,
		);
	}

	/**
	 * DER length.
	 *
	 * @returns Byte length.
	 */
	public derLength(): number {
		return this.length() - 8;
	}

	public static override readonly typeMagic = kSecCodeMagicLaunchConstraint;

	static {
		constant(this, 'typeMagic');
	}
}
