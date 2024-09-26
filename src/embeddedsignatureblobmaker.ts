import {EmbeddedSignatureBlob} from './embeddedsignatureblob.ts';
import {SuperBlobMaker} from './superblobmaker.ts';

/**
 * EmbeddedSignatureBlobMaker class.
 */
export class EmbeddedSignatureBlobMaker extends SuperBlobMaker {
	public declare readonly ['constructor']: typeof EmbeddedSignatureBlobMaker;

	/**
	 * SuperBlob reference.
	 */
	public static readonly SuperBlob = EmbeddedSignatureBlob;
}
