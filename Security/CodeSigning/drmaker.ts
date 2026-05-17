import { toStringTag } from '@hqtsm/class';
import { Uint8Ptr } from '@hqtsm/struct';
import type { _const, bool } from '../../libc/c.ts';
import type { CSSM_DATA } from '../cssmtype.ts';
import { APPLE_EXTENSION_OID } from '../oidsbase.ts';
import { cssm_data } from '../SecAsn1Types.ts';
import { certificateHasField } from './csutilities.ts';
import { Requirement_Maker } from './reqmaker.ts';
import { type Requirement, Requirement_Context } from './requirement.ts';

const adcSdkMarker = new Uint8Array([...APPLE_EXTENSION_OID, 2, 1]);

/**
 * iOS intermediate marker.
 */
export const adcSdkMarkerOID: _const<CSSM_DATA> = new cssm_data(
	adcSdkMarker.byteLength,
	new Uint8Ptr(adcSdkMarker.buffer),
);

const caspianSdkMarker = new Uint8Array([...APPLE_EXTENSION_OID, 2, 6]);

/**
 * Caspian intermediate marker.
 */
export const devIdSdkMarkerOID: _const<CSSM_DATA> = new cssm_data(
	caspianSdkMarker.byteLength,
	new Uint8Ptr(caspianSdkMarker.buffer),
);

const caspianLeafMarker = new Uint8Array([...APPLE_EXTENSION_OID, 1, 13]);

/**
 * Caspian leaf certificate marker.
 */
export const devIdLeafMarkerOID: _const<CSSM_DATA> = new cssm_data(
	caspianLeafMarker.byteLength,
	new Uint8Ptr(caspianLeafMarker.buffer),
);

/**
 * Designated Requirements maker.
 */
export class DRMaker extends Requirement_Maker {
	/**
	 * Constructor.
	 *
	 * @param context Interpretation context.
	 */
	constructor(context: _const<Requirement_Context>) {
		super();
		this.ctx = context;
	}

	/**
	 * Interpretation context.
	 */
	public ctx: _const<Requirement_Context>;

	/**
	 * Make requirement.
	 *
	 * @param _this This.
	 * @returns Requirement instance.
	 */
	public static override make(_this: DRMaker): Requirement {
		throw new Error('TODO');
	}

	/**
	 * Add Apple anchor.
	 *
	 * @param _this This.
	 */
	private static appleAnchor(_this: DRMaker): void {
		throw new Error('TODO');
	}

	/**
	 * Add non-Apple anchor.
	 *
	 * @param _this This.
	 */
	private static nonAppleAnchor(_this: DRMaker): void {
		throw new Error('TODO');
	}

	/**
	 * Is iOS signature.
	 *
	 * @param _this This.
	 */
	private static isIOSSignature(_this: DRMaker): bool {
		const { ctx } = _this;
		return (
			Requirement_Context.certCount(ctx) === 3 &&
			certificateHasField(
				Requirement_Context.cert(ctx, 1),
				adcSdkMarkerOID,
			)
		);
	}

	/**
	 * Is developer ID signature.
	 *
	 * @param _this This.
	 */
	private static isDeveloperIDSignature(_this: DRMaker): bool {
		const { ctx } = _this;
		return (
			Requirement_Context.certCount(ctx) === 3 &&
			certificateHasField(
				Requirement_Context.cert(ctx, 1),
				devIdSdkMarkerOID,
			)
		);
	}

	static {
		toStringTag(this, 'DRMaker');
	}
}
