import {kSecCodeMagicDetachedSignature} from './const.ts';
import {SuperBlob} from './superblob.ts';
import {constant} from './util.ts';

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 */
export class DetachedSignatureBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof DetachedSignatureBlob;

	static {
		constant(this, 'typeMagic', kSecCodeMagicDetachedSignature);
	}
}
