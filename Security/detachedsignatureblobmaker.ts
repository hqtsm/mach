import { constant, toStringTag } from '@hqtsm/class';
import { DetachedSignatureBlob } from './detachedsignatureblob.ts';
import { SuperBlobMaker } from './superblob.ts';

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	public static override readonly SuperBlob = DetachedSignatureBlob;

	static {
		toStringTag(this, 'DetachedSignatureBlobMaker');
		constant(this, 'SuperBlob');
	}
}
