import { constant, toStringTag } from '@hqtsm/class';
import { kSecCodeMagicEmbeddedSignature } from '../const.ts';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 */
export class EmbeddedSignatureBlob extends SuperBlobCore {
	public static override readonly typeMagic = kSecCodeMagicEmbeddedSignature;

	static {
		toStringTag(this, 'EmbeddedSignatureBlob');
		constant(this, 'typeMagic');
	}
}
