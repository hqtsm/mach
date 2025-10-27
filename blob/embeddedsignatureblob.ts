import { constant } from '@hqtsm/struct';
import { kSecCodeMagicEmbeddedSignature } from '../const.ts';
import {
	type SuperBlobCoreConstructor,
	templateSuperBlobCore,
} from './superblobcore.ts';

const SuperBlobCore: SuperBlobCoreConstructor<
	EmbeddedSignatureBlob,
	typeof kSecCodeMagicEmbeddedSignature
> = templateSuperBlobCore(
	() => EmbeddedSignatureBlob,
	kSecCodeMagicEmbeddedSignature,
);

/**
 * An EmbeddedSignatureBlob is a SuperBlob indexed by component slot number.
 * For embedded Mach-O signatures and detached non-Mach-O binaries.
 */
export class EmbeddedSignatureBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<
		typeof EmbeddedSignatureBlob,
		'new'
	>;

	static {
		constant(this, 'typeMagic');
	}
}
