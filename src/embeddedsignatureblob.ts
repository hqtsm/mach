import {kSecCodeMagicEmbeddedSignature} from './const.ts';
import {SuperBlob} from './superblob.ts';

/**
 * EmbeddedSignatureBlob class.
 */
export class EmbeddedSignatureBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof EmbeddedSignatureBlob;

	/**
	 * Type magic number for new instance.
	 */
	public static readonly typeMagic: number = kSecCodeMagicEmbeddedSignature;
}
