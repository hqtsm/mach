import type { Class } from '@hqtsm/class';
import { LibraryDependencyBlob } from './librarydependencyblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for LibraryDependencyBlob.
 */
export class LibraryDependencyBlobMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Class<
		typeof LibraryDependencyBlobMaker
	>;

	public static override readonly SuperBlob = LibraryDependencyBlob;
}
