import {EmbeddedSignatureBlob} from './embeddedsignatureblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * SuperBlob maker for EmbeddedSignatureBlob.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobMaker(
	EmbeddedSignatureBlob
) {
	public declare readonly ['constructor']: Omit<
		typeof EmbeddedSignatureBlobMaker,
		'new'
	>;
}
