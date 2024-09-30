import {Requirements} from './requirements.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for Requirements.
 */
export class RequirementsMaker extends SuperBlobMaker(Requirements) {
	public declare readonly ['constructor']: Omit<
		typeof RequirementsMaker,
		'new'
	>;
}
