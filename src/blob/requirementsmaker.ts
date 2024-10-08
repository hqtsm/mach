import {constant} from '../util.ts';

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
	 * @inheritdoc
	 */
	public static readonly SuperBlob = Requirements;

	static {
		constant(this, 'SuperBlob');
	}
}
