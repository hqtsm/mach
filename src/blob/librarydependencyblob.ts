import {kSecCodeMagicDRList} from '../const.ts';
import {constant} from '../util.ts';

import {SuperBlob} from './superblob.ts';

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
