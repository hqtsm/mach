import {kSecCodeMagicDetachedSignature} from './const.ts';
import {SuperBlob} from './superblob.ts';

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 */
export class DetachedSignatureBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof DetachedSignatureBlob;

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic: number = kSecCodeMagicDetachedSignature;
}
