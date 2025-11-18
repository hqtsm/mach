import { type Class, constant } from '@hqtsm/class';
import { kSecCodeMagicDetachedSignature } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 */
export class DetachedSignatureBlob extends SuperBlob {
	declare public readonly ['constructor']: Class<
		typeof DetachedSignatureBlob
	>;

	public static override readonly typeMagic = kSecCodeMagicDetachedSignature;

	static {
		constant(this, 'typeMagic');
	}
}
