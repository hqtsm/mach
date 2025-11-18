import { type Class, constant } from '@hqtsm/class';
import { DetachedSignatureBlob } from './detachedsignatureblob.ts';
import { SuperBlobMaker } from './superblobmaker.ts';

/**
 * SuperBlob maker for DetachedSignatureBlob.
 */
export class DetachedSignatureBlobMaker extends SuperBlobMaker {
	declare public readonly ['constructor']: Class<
		typeof DetachedSignatureBlobMaker
	>;

	public static override readonly SuperBlob = DetachedSignatureBlob;

	static {
		constant(this, 'SuperBlob');
	}
}
