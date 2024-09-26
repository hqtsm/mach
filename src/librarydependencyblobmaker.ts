import {LibraryDependencyBlob} from './librarydependencyblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class LibraryDependencyBlobMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: typeof LibraryDependencyBlobMaker;

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = LibraryDependencyBlob;
}
