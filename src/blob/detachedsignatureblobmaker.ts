import {DetachedSignatureBlob} from './detachedsignatureblob.ts';
import {superblobmaker, SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: Omit<
		typeof DetachedSignatureBlobMaker,
		'new'
	>;

	/**
	 * @inheritdoc
	 */
	public static readonly SuperBlob = DetachedSignatureBlob;

	static {
		superblobmaker(this);
	}
}
