import {constant} from '../util.ts';

import {DetachedSignatureBlob} from './detachedsignatureblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

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
		constant(this, 'SuperBlob');
	}
}
