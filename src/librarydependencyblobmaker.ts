import {LibraryDependencyBlob} from './librarydependencyblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class LibraryDependencyBlobMaker extends SuperBlobMaker(
	LibraryDependencyBlob
) {
	public declare readonly ['constructor']: Omit<
		typeof LibraryDependencyBlobMaker,
		'new'
	>;
}
