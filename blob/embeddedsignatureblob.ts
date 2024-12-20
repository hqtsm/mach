import { kSecCodeMagicEmbeddedSignature } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 */
export class EmbeddedSignatureBlob extends SuperBlob {
	declare public readonly ['constructor']: typeof EmbeddedSignatureBlob;

	/**
	 * @inheritdoc
	 */
	public static override readonly typeMagic = kSecCodeMagicEmbeddedSignature;
}
