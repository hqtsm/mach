import {DetachedSignatureBlob} from './detachedsignatureblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker(
	DetachedSignatureBlob
) {
	public declare readonly ['constructor']: Omit<
		typeof DetachedSignatureBlobMaker,
		'new'
	>;
}
