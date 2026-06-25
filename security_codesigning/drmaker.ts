import { toStringTag } from '@hqtsm/class';
import { Uint8Ptr } from '@hqtsm/struct';
import type { _const, bool } from '../libc/c.ts';
import type { CSSM_DATA } from '../Security/cssmtype.ts';
import { APPLE_EXTENSION_OID } from '../Security/oidsbase.ts';
import { cssm_data } from '../Security/SecAsn1Types.ts';
import { Security_CodeSigning_certificateHasField } from './csutilities.ts';
import { Security_CodeSigning_Requirement_Maker } from './reqmaker.ts';
import {
	type Security_CodeSigning_Requirement,
	Security_CodeSigning_Requirement_Context,
} from './requirement.ts';

const adcSdkMarker = new Uint8Array([...APPLE_EXTENSION_OID, 2, 1]);

/**
 * iOS intermediate marker.
 */
export const Security_CodeSigning_adcSdkMarkerOID: _const<CSSM_DATA> =
	new cssm_data(
		adcSdkMarker.byteLength,
		new Uint8Ptr(adcSdkMarker.buffer),
	);

const caspianSdkMarker = new Uint8Array([...APPLE_EXTENSION_OID, 2, 6]);

/**
 * Caspian intermediate marker.
 */
export const Security_CodeSigning_devIdSdkMarkerOID: _const<CSSM_DATA> =
	new cssm_data(
		caspianSdkMarker.byteLength,
		new Uint8Ptr(caspianSdkMarker.buffer),
	);

const caspianLeafMarker = new Uint8Array([...APPLE_EXTENSION_OID, 1, 13]);

/**
 * Caspian leaf certificate marker.
 */
export const Security_CodeSigning_devIdLeafMarkerOID: _const<CSSM_DATA> =
	new cssm_data(
		caspianLeafMarker.byteLength,
		new Uint8Ptr(caspianLeafMarker.buffer),
	);

/**
 * Designated Requirements maker.
 */
export class Security_CodeSigning_DRMaker
	extends Security_CodeSigning_Requirement_Maker {
	/**
	 * Constructor.
	 *
	 * @param context Interpretation context.
	 */
	constructor(context: _const<Security_CodeSigning_Requirement_Context>) {
		super();
		this.ctx = context;
	}

	/**
	 * Interpretation context.
	 */
	public ctx: _const<Security_CodeSigning_Requirement_Context>;

	/**
	 * Make requirement.
	 *
	 * @param _this This.
	 * @returns Requirement instance.
	 */
	public static override make(
		_this: Security_CodeSigning_DRMaker,
	): Security_CodeSigning_Requirement {
		throw new Error('TODO');
	}

	/**
	 * Add Apple anchor.
	 *
	 * @param _this This.
	 */
	private static appleAnchor(_this: Security_CodeSigning_DRMaker): void {
		throw new Error('TODO');
	}

	/**
	 * Add non-Apple anchor.
	 *
	 * @param _this This.
	 */
	private static nonAppleAnchor(_this: Security_CodeSigning_DRMaker): void {
		throw new Error('TODO');
	}

	/**
	 * Is iOS signature.
	 *
	 * @param _this This.
	 */
	private static isIOSSignature(_this: Security_CodeSigning_DRMaker): bool {
		const { ctx } = _this;
		return (
			Security_CodeSigning_Requirement_Context.certCount(ctx) === 3 &&
			Security_CodeSigning_certificateHasField(
				Security_CodeSigning_Requirement_Context.cert(ctx, 1),
				Security_CodeSigning_adcSdkMarkerOID,
			)
		);
	}

	/**
	 * Is developer ID signature.
	 *
	 * @param _this This.
	 */
	private static isDeveloperIDSignature(
		_this: Security_CodeSigning_DRMaker,
	): bool {
		const { ctx } = _this;
		return (
			Security_CodeSigning_Requirement_Context.certCount(ctx) === 3 &&
			Security_CodeSigning_certificateHasField(
				Security_CodeSigning_Requirement_Context.cert(ctx, 1),
				Security_CodeSigning_devIdSdkMarkerOID,
			)
		);
	}

	static {
		toStringTag(this, 'Security_CodeSigning_DRMaker');
	}
}
