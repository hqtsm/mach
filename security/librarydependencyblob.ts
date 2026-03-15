import { constant, toStringTag } from '@hqtsm/class';
import { kSecCodeMagicDRList } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlob {
	public static override readonly typeMagic = kSecCodeMagicDRList;

	static {
		toStringTag(this, 'LibraryDependencyBlob');
		constant(this, 'typeMagic');
	}
}
