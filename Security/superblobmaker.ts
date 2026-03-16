import { toStringTag } from '@hqtsm/class';
import { SuperBlobCoreMaker } from './superblobcoremaker.ts';

/**
 * SuperBlob maker.
 */
export abstract class SuperBlobMaker extends SuperBlobCoreMaker {
	static {
		toStringTag(this, 'SuperBlobMaker');
	}
}
