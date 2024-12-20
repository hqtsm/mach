import { kSecCodeMagicDRList } from '../const.ts';
import { SuperBlob } from './superblob.ts';

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlob {
	declare public readonly ['constructor']: typeof LibraryDependencyBlob;

	/**
	 * @inheritdoc
	 */
	public static override readonly typeMagic = kSecCodeMagicDRList;
}
