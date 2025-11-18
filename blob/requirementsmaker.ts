import type { Class } from '@hqtsm/class';
import { Requirements } from './requirements.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for Requirements.
 */
export class RequirementsMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Class<typeof RequirementsMaker>;

	public static override readonly SuperBlob = Requirements;
}
