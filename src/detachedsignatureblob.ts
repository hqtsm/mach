import {kSecCodeMagicDetachedSignature} from './const.ts';
import {SuperBlob} from './superblob.ts';

/**
 * DetachedSignatureBlob class.
 */
export class DetachedSignatureBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof DetachedSignatureBlob;

	/**
	 * Type magic number for new instance.
	 */
	public static readonly typeMagic: number = kSecCodeMagicDetachedSignature;
}
