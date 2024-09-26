import {kSecCodeMagicRequirementSet} from './const.ts';
import {SuperBlob} from './superblob.ts';

/**
 * Requirements class.
 */
export class Requirements extends SuperBlob {
	public declare readonly ['constructor']: typeof Requirements;

	/**
	 * Type magic number for new instance.
	 */
	public static readonly typeMagic: number = kSecCodeMagicRequirementSet;
}
