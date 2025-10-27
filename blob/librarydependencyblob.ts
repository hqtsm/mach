import { constant } from '@hqtsm/struct';
import { kSecCodeMagicDRList } from '../const.ts';
import {
	type SuperBlobCoreConstructor,
	templateSuperBlobCore,
} from './superblobcore.ts';

const SuperBlobCore: SuperBlobCoreConstructor<
	LibraryDependencyBlob,
	typeof kSecCodeMagicDRList
> = templateSuperBlobCore(
	() => LibraryDependencyBlob,
	kSecCodeMagicDRList,
);

/**
 * Dependency records from dylib inputs.
 * Indexed sequentially from 0.
 */
export class LibraryDependencyBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<
		typeof LibraryDependencyBlob,
		'new'
	>;

	static {
		constant(this, 'typeMagic');
	}
}
