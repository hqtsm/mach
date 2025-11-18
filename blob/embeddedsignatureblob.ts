import { type Class, constant } from '@hqtsm/class';
import { kSecCodeMagicEmbeddedSignature } from '../const.ts';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 */
export class EmbeddedSignatureBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Class<
		typeof EmbeddedSignatureBlob
	>;

	public static override readonly typeMagic = kSecCodeMagicEmbeddedSignature;

	static {
		constant(this, 'typeMagic');
	}
}
