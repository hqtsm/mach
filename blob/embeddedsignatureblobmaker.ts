import { EmbeddedSignatureBlob } from './embeddedsignatureblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Omit<
		typeof EmbeddedSignatureBlobMaker,
		'new'
	>;

	/**
	 * @inheritdoc
	 */
	public static override readonly SuperBlob = EmbeddedSignatureBlob;
}
