import {DetachedSignatureBlob} from './detachedsignatureblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: typeof DetachedSignatureBlobMaker;

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = DetachedSignatureBlob;
}
