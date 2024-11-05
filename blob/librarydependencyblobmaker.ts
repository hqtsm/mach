import { LibraryDependencyBlob } from './librarydependencyblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class LibraryDependencyBlobMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Omit<
		typeof LibraryDependencyBlobMaker,
		'new'
	>;

	/**
	 * @inheritdoc
	 */
	public static override readonly SuperBlob = LibraryDependencyBlob;
}
