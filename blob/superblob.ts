import { type Class, constant } from '@hqtsm/class';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * A generic SuperBlob base.
 */
export class SuperBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Class<typeof SuperBlob>;

	static {
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
