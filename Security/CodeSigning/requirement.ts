import { constant, toStringTag } from '@hqtsm/class';
import { uint32BE } from '@hqtsm/struct';
import type { uint32_t } from '../../libc/stdint.ts';
import { Blob } from '../blob.ts';
import {
	kSecCodeMagicRequirement,
	kSecCodeMagicRequirementSet,
} from '../CSCommonPriv.ts';
import type { Endian } from '../endian.ts';
import { SuperBlob, SuperBlobMaker } from '../superblob.ts';

/**
 * Requirement kind.
 */
export type RequirementKind =
	| typeof Requirement.exprForm
	| typeof Requirement.lwcrForm;

/**
 * Single requirement.
 */
export class Requirement extends Blob {
	public static override readonly typeMagic = kSecCodeMagicRequirement;

	/**
	 * Kind: Prefix expr form.
	 */
	public static readonly exprForm = 1;

	/**
	 * Kind: DER encoded lightweight code requirement form.
	 */
	public static readonly lwcrForm = 2;

	/**
	 * Get kind.
	 *
	 * @param _this This.
	 * @returns Kind.
	 */
	public static kind(_this: Requirement): RequirementKind;

	/**
	 * Set kind.
	 *
	 * @param _this This.
	 * @param k Kind.
	 */
	public static kind(_this: Requirement, k: RequirementKind): void;

	/**
	 * Get or set kind.
	 *
	 * @param _this This.
	 * @param k Kind to set or undefined to get.
	 * @returns Kind on get or undefined on set.
	 */
	public static kind(
		_this: Requirement,
		k?: RequirementKind,
	): RequirementKind | void {
		if (k === undefined) {
			return _this.mKind as RequirementKind;
		}
		_this.mKind = k >>> 0;
	}

	/**
	 * Index for leaf.
	 */
	public static readonly leafCert = 0;

	/**
	 * Index for anchor.
	 */
	public static readonly anchorCert = -1;

	/**
	 * Common alignment rule for all requirement forms.
	 */
	public static readonly baseAlignment = 4;

	/**
	 * Requirement kind.
	 */
	declare private mKind: Endian<uint32_t>;

	static {
		toStringTag(this, 'Requirement');
		uint32BE(this, 'mKind' as never);
		constant(this, 'BYTE_LENGTH');
		constant(this, 'typeMagic');
		constant(this, 'exprForm');
		constant(this, 'lwcrForm');
		constant(this, 'leafCert');
		constant(this, 'anchorCert');
		constant(this, 'baseAlignment');
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

/**
 * Expression opcode.
 */
export type ExprOp =
	| typeof opFalse
	| typeof opTrue
	| typeof opIdent
	| typeof opAppleAnchor
	| typeof opAnchorHash
	| typeof opInfoKeyValue
	| typeof opAnd
	| typeof opOr
	| typeof opCDHash
	| typeof opNot
	| typeof opInfoKeyField
	| typeof opCertField
	| typeof opTrustedCert
	| typeof opTrustedCerts
	| typeof opCertGeneric
	| typeof opAppleGenericAnchor
	| typeof opEntitlementField
	| typeof opCertPolicy
	| typeof opNamedAnchor
	| typeof opNamedCode
	| typeof opPlatform
	| typeof opNotarized
	| typeof opCertFieldDate
	| typeof opLegacyDevID
	| typeof exprOpCount;

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

/**
 * Match operation.
 */
export type MatchOperation =
	| typeof matchExists
	| typeof matchEqual
	| typeof matchContains
	| typeof matchBeginsWith
	| typeof matchEndsWith
	| typeof matchLessThan
	| typeof matchGreaterThan
	| typeof matchLessEqual
	| typeof matchGreaterEqual
	| typeof matchOn
	| typeof matchBefore
	| typeof matchAfter
	| typeof matchOnOrBefore
	| typeof matchOnOrAfter
	| typeof matchAbsent;

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

/**
 * Requirement groups indexed by SecRequirementType.
 */
export class Requirements extends SuperBlob {
	public static override readonly typeMagic = kSecCodeMagicRequirementSet;

	static {
		toStringTag(this, 'Requirements');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for Requirements.
 */
export class RequirementsMaker extends SuperBlobMaker {
	public static override readonly SuperBlob = Requirements;

	static {
		toStringTag(this, 'RequirementsMaker');
		constant(this, 'SuperBlob');
	}
}
