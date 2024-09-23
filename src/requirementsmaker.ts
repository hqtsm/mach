import {Requirements} from './requirements.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * RequirementsMaker class.
 */
export class RequirementsMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: typeof RequirementsMaker;

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = Requirements;
}
