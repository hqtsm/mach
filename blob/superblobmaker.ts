import { constant } from '@hqtsm/struct';
import { SuperBlobCoreMaker } from './superblobcoremaker.ts';

/**
 * SuperBlob maker.
 */
export class SuperBlobMaker extends SuperBlobCoreMaker {
	declare public readonly ['constructor']: Omit<typeof SuperBlobMaker, 'new'>;

	static {
		constant(this, 'SuperBlob');
	}
}
