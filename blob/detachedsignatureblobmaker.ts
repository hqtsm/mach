import { DetachedSignatureBlob } from './detachedsignatureblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Omit<
		typeof DetachedSignatureBlobMaker,
		'new'
	>;

	/**
	 * @inheritdoc
	 */
	public static override readonly SuperBlob = DetachedSignatureBlob;
}
