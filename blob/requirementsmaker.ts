import { Requirements } from './requirements.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for Requirements.
 */
export class RequirementsMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Omit<
		typeof RequirementsMaker,
		'new'
	>;

	public static override readonly SuperBlob = Requirements;
}
