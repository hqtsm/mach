import { type Class, toStringTag } from '@hqtsm/class';
import { SuperBlobCoreMaker } from './superblobcoremaker.ts';

/**
 * SuperBlob maker.
 */
export abstract class SuperBlobMaker extends SuperBlobCoreMaker {
	declare public readonly ['constructor']: Class<typeof SuperBlobMaker>;

	static {
		toStringTag(this, 'SuperBlobMaker');
	}
}
