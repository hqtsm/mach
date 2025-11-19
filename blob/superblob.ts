import { type Class, constant, toStringTag } from '@hqtsm/class';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * A generic SuperBlob base.
 */
export abstract class SuperBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Class<typeof SuperBlob>;

	static {
		toStringTag(this, 'SuperBlob');
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
