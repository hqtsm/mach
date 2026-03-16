import { constant, toStringTag } from '@hqtsm/class';
import { EmbeddedSignatureBlob } from './embeddedsignatureblob.ts';
import { SuperBlobCoreMaker } from './superblobcoremaker.ts';

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobCoreMaker {
	public static override readonly SuperBlob = EmbeddedSignatureBlob;

	static {
		toStringTag(this, 'EmbeddedSignatureBlobMaker');
		constant(this, 'SuperBlob');
	}
}
