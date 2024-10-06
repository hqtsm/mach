import {kSecCodeMagicEmbeddedSignature} from './const.ts';
import {SuperBlob} from './superblob.ts';
import {constant} from './util.ts';

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 */
export class EmbeddedSignatureBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof EmbeddedSignatureBlob;

	static {
		constant(this, 'typeMagic', kSecCodeMagicEmbeddedSignature);
	}
}
