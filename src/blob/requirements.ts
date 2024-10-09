import {kSecCodeMagicRequirementSet} from '../const.ts';
import {blob} from './blob.ts';

import {SuperBlob} from './superblob.ts';

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob {
	public declare readonly ['constructor']: typeof Requirements;

	/**
	 * @inheritdoc
	 */
	public static readonly typeMagic = kSecCodeMagicRequirementSet;

	static {
		blob(this);
	}
}
