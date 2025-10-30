import { constant } from '@hqtsm/struct';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * A generic SuperBlob base.
 */
export class SuperBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<typeof SuperBlob, 'new'>;

	static {
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
	}
}
