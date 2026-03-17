import { constant, toStringTag } from '@hqtsm/class';
import { Requirements } from './requirements.ts';
import { SuperBlobMaker } from './superblob.ts';

/**
 * SuperBlob maker for Requirements.
 */
export class RequirementsMaker extends SuperBlobMaker {
	public static override readonly SuperBlob = Requirements;

	static {
		toStringTag(this, 'RequirementsMaker');
		constant(this, 'SuperBlob');
	}
}
