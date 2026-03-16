import { constant, toStringTag } from '@hqtsm/class';
import { SuperBlob } from './superblob.ts';

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlob {
	public static override readonly typeMagic = 0xfade0c05;

	static {
		toStringTag(this, 'LibraryDependencyBlob');
		constant(this, 'typeMagic');
	}
}
