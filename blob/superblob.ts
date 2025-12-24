import { constant, toStringTag } from '@hqtsm/class';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * A generic SuperBlob base.
 */
export abstract class SuperBlob extends SuperBlobCore {
	static {
		toStringTag(this, 'SuperBlob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
