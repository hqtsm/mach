import { constant, toStringTag } from '@hqtsm/class';
import { kSecCodeMagicEmbeddedSignature } from './CSCommonPriv.ts';
import { SuperBlobCore } from './superblob.ts';

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
