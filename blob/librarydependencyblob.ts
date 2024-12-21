import { constant } from '@hqtsm/struct';
import { kSecCodeMagicDRList } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlob {
	declare public readonly ['constructor']: Omit<
		typeof LibraryDependencyBlob,
		'new'
	>;

	public static override readonly typeMagic = kSecCodeMagicDRList;

	static {
		constant(this, 'typeMagic');
	}
}
