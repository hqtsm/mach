import { constant, toStringTag } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import { kSecCodeMagicRequirement } from './CSCommonPriv.ts';
import { Blob } from './blob.ts';

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	/**
	 * Requirement kind.
	 */
	declare private mKind: number;

	/**
	 * Get kind.
	 *
	 * @param _this This.
	 * @returns Kind.
	 */
	public static kind(_this: Requirement): number;

	/**
	 * Set kind.
	 *
	 * @param _this This.
	 * @param k Kind.
	 */
	public static kind(_this: Requirement, k: number): void;

	/**
	 * Get or set kind.
	 *
	 * @param _this This.
	 * @param k Kind to set or undefined to get.
	 * @returns Kind on get or undefined on set.
	 */
	public static kind(_this: Requirement, k?: number): number | void {
		if (k === undefined) {
			return _this.mKind;
		}
		_this.mKind = k >>> 0;
	}

	public static override readonly typeMagic = kSecCodeMagicRequirement;

	/**
	 * Common alignment rule for all requirement forms.
	 */
	public static readonly baseAlignment: number = 4;

	/**
	 * Kind: Prefix expr form.
	 */
	public static readonly exprForm = 1;

	/**
	 * Kind: DER encoded lightweight code requirement form.
	 */
	public static readonly lwcrForm = 2;

	static {
		toStringTag(this, 'Requirement');
		uint32BE(this, 'mKind' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
		constant(this, 'baseAlignment');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
	}
}

// Opcodes exprForm:

/**
 * Opcode flag mask.
 */
export const opFlagMask = 0xFF000000;

/**
 * Opcode generic false.
 */
export const opGenericFalse = 0x80000000;

/**
 * Opcode generic skip.
 */
export const opGenericSkip = 0x40000000;

// ExprOp:

/**
 * Opcode: False.
 */
export const opFalse = 0;

/**
 * Opcode: True.
 */
export const opTrue = 1;

/**
 * Opcode: Ident.
 */
export const opIdent = 2;

/**
 * Opcode: Apple anchor.
 */
export const opAppleAnchor = 3;

/**
 * Opcode: Anchor hash.
 */
export const opAnchorHash = 4;

/**
 * Opcode: Info key value.
 */
export const opInfoKeyValue = 5;

/**
 * Opcode: And.
 */
export const opAnd = 6;

/**
 * Opcode: Or.
 */
export const opOr = 7;

/**
 * Opcode: CD hash.
 */
export const opCDHash = 8;

/**
 * Opcode: Not.
 */
export const opNot = 9;

/**
 * Opcode: Info key field.
 */
export const opInfoKeyField = 10;

/**
 * Opcode: Op cert field.
 */
export const opCertField = 11;

/**
 * Opcode: Trusted cert.
 */
export const opTrustedCert = 12;

/**
 * Opcode: Trusted certs.
 */
export const opTrustedCerts = 13;

/**
 * Opcode: Generic.
 */
export const opCertGeneric = 14;

/**
 * Opcode: Apple generic anchor.
 */
export const opAppleGenericAnchor = 15;

/**
 * Opcode: Entitlement field.
 */
export const opEntitlementField = 16;

/**
 * Opcode: Cert policy.
 */
export const opCertPolicy = 17;

/**
 * Opcode: Named anchor.
 */
export const opNamedAnchor = 18;

/**
 * Opcode: Named code.
 */
export const opNamedCode = 19;

/**
 * Opcode: Platform.
 */
export const opPlatform = 20;

/**
 * Opcode: Notarized.
 */
export const opNotarized = 21;

/**
 * Opcode: Cert field date.
 */
export const opCertFieldDate = 22;

/**
 * Opcode: Legacy dev ID.
 */
export const opLegacyDevID = 23;

/**
 * Opcode count.
 */
export const exprOpCount = 24;

// MatchOperation:

/**
 * Match: Exists.
 */
export const matchExists = 0;

/**
 * Match: Equal.
 */
export const matchEqual = 1;

/**
 * Match: Contains.
 */
export const matchContains = 2;

/**
 * Match: Begins with.
 */
export const matchBeginsWith = 3;

/**
 * Match: Ends with.
 */
export const matchEndsWith = 4;

/**
 * Match: Less than.
 */
export const matchLessThan = 5;

/**
 * Match: Greater than.
 */
export const matchGreaterThan = 6;

/**
 * Match: Less than or equal.
 */
export const matchLessEqual = 7;

/**
 * Match: Greater than or equal.
 */
export const matchGreaterEqual = 8;

/**
 * Match: On.
 */
export const matchOn = 9;

/**
 * Match: Before.
 */
export const matchBefore = 10;

/**
 * Match: After.
 */
export const matchAfter = 11;

/**
 * Match: On or before.
 */
export const matchOnOrBefore = 12;

/**
 * Match: On or after.
 */
export const matchOnOrAfter = 13;

/**
 * Match: Absent.
 */
export const matchAbsent = 14;
