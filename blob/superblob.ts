import { constant } from '@hqtsm/struct';
import { SuperBlobCore } from './superblobcore.ts';

/**
 * Multiple Blobs wrapped in a single indexed blob.
 */
export class SuperBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<typeof SuperBlob, 'new'>;

	static {
		constant(this, 'BYTE_LENGTH');
	}
}
