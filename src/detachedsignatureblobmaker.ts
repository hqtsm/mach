import {DetachedSignatureBlob} from './detachedsignatureblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * DetachedSignatureBlobMaker class.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: typeof DetachedSignatureBlobMaker;

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = DetachedSignatureBlob;
}
