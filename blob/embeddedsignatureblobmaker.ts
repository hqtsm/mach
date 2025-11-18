import type { Class } from '@hqtsm/class';
import { EmbeddedSignatureBlob } from './embeddedsignatureblob.ts';
import { SuperBlobCoreMaker } from './superblobcoremaker.ts';

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobCoreMaker {
	declare public readonly ['constructor']: Class<
		typeof EmbeddedSignatureBlobMaker
	>;

	public static override readonly SuperBlob = EmbeddedSignatureBlob;
}
