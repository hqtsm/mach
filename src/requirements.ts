import {kSecCodeMagicRequirementSet} from './const.ts';
import {SuperBlob} from './superblob.ts';

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob(kSecCodeMagicRequirementSet) {
	public declare readonly ['constructor']: typeof Requirements;
}
