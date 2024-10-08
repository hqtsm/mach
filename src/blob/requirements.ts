import {kSecCodeMagicRequirementSet} from '../const.ts';
import {constant} from '../util.ts';

import {SuperBlob} from './superblob.ts';

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob {
	public declare readonly ['constructor']: typeof Requirements;

	static {
		constant(this, 'typeMagic', kSecCodeMagicRequirementSet);
	}
}
