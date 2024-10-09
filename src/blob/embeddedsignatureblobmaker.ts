import {EmbeddedSignatureBlob} from './embeddedsignatureblob.ts';
import {superblobmaker, SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: Omit<
		typeof EmbeddedSignatureBlobMaker,
		'new'
	>;

	/**
	 * @inheritdoc
	 */
	public static readonly SuperBlob = EmbeddedSignatureBlob;

	static {
		superblobmaker(this);
	}
}
