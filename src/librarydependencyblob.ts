import {kSecCodeMagicDRList} from './const.ts';
import {SuperBlob} from './superblob.ts';

/**
 * LibraryDependencyBlob class.
 */
export class LibraryDependencyBlob extends SuperBlob {
	public declare readonly ['constructor']: typeof LibraryDependencyBlob;

	/**
	 * @inheritdoc
	 */
	public static readonly sizeof: number = 12;

	/**
	 * Type magic number for new instance.
	 */
	public static readonly typeMagic: number = kSecCodeMagicDRList;
}
