import {Requirements} from './requirements.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for Requirements.
 */
export class RequirementsMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: Omit<
		typeof RequirementsMaker,
		'new'
	>;

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = Requirements;
}
