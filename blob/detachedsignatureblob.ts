import { constant } from '@hqtsm/struct';
import { kSecCodeMagicDetachedSignature } from '../const.ts';
import {
	type SuperBlobCoreConstructor,
	templateSuperBlobCore,
} from './superblobcore.ts';

const SuperBlobCore: SuperBlobCoreConstructor<
	DetachedSignatureBlob,
	typeof kSecCodeMagicDetachedSignature
> = templateSuperBlobCore(
	() => DetachedSignatureBlob,
	kSecCodeMagicDetachedSignature,
);

/**
 * Multiple architecture EmbeddedSignatureBlobs for Mach-O detached signatures.
 * Indexed by main architecture.
 */
export class DetachedSignatureBlob extends SuperBlobCore {
	declare public readonly ['constructor']: Omit<
		typeof DetachedSignatureBlob,
		'new'
	>;

	static {
		constant(this, 'typeMagic');
	}
}
