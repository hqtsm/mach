import { constant, toStringTag } from '@hqtsm/class';
import { LibraryDependencyBlob } from './librarydependencyblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class LibraryDependencyBlobMaker extends SuperBlobMaker {
	public static override readonly SuperBlob = LibraryDependencyBlob;

	static {
		toStringTag(this, 'LibraryDependencyBlobMaker');
		constant(this, 'SuperBlob');
	}
}
