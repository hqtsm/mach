import {kSecCodeMagicDRList} from './const.ts';
import {SuperBlob} from './superblob.ts';
import {constant} from './util.ts';

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof LibraryDependencyBlob;

	static {
		constant(this, 'typeMagic', kSecCodeMagicDRList);
	}
}
