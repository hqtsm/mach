import { EmbeddedSignatureBlob } from './embeddedsignatureblob.ts';
import { SuperBlobCoreMaker } from './superblobcoremaker.ts';

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobCoreMaker {
	declare public readonly ['constructor']: Omit<
		typeof EmbeddedSignatureBlobMaker,
		'new'
	>;

	public static override readonly SuperBlob = EmbeddedSignatureBlob;
}
