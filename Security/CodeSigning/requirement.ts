import { constant, toStringTag } from '@hqtsm/class';
import { type ArrayBufferPointer, uint32BE } from '@hqtsm/struct';
import type { CFDataRef } from '../../CoreFoundation/CFData.ts';
import type { CFDateRef } from '../../CoreFoundation/CFDate.ts';
import type { CFDictionaryRef } from '../../CoreFoundation/CFDictionary.ts';
import { type ArrayBufferLikeData, viewBytes } from '../../helpers/memory.ts';
import { CS_VALIDATION_CATEGORY_INVALID } from '../../kern/cs_blobs.ts';
import type { _const, bool, int, uint } from '../../libc/c.ts';
import type { uint32_t, uint8_t } from '../../libc/stdint.ts';
import { Security_Blob } from '../blob.ts';
import {
	kSecCodeSignatureNoHash,
	type SecCSDigestAlgorithm,
} from '../CSCommon.ts';
import {
	kSecCodeMagicRequirement,
	kSecCodeMagicRequirementSet,
} from '../CSCommonPriv.ts';
import type { Security_Endian } from '../endian.ts';
import type { SecCertificateRef } from '../SecBase.ts';
import { Security_SuperBlob, Security_SuperBlob_Maker } from '../superblob.ts';
import type { Security_CodeSigning_CodeDirectory } from './codedirectory.ts';

/**
 * Requirement kind.
 */
export type Security_CodeSigning_RequirementKind =
	| typeof Security_CodeSigning_Requirement.exprForm
	| typeof Security_CodeSigning_Requirement.lwcrForm;

/**
 * Single requirement.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_Requirement<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_Blob<TArrayBuffer> {
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
	public static kind(
		_this: Security_CodeSigning_Requirement,
	): Security_CodeSigning_RequirementKind;

	/**
	 * Set kind.
	 *
	 * @param _this This.
	 * @param k Kind.
	 */
	public static kind(
		_this: Security_CodeSigning_Requirement,
		k: Security_CodeSigning_RequirementKind,
	): void;

	/**
	 * Get or set kind.
	 *
	 * @param _this This.
	 * @param k Kind to set or undefined to get.
	 * @returns Kind on get or undefined on set.
	 */
	public static kind(
		_this: Security_CodeSigning_Requirement,
		k?: Security_CodeSigning_RequirementKind,
	): Security_CodeSigning_RequirementKind | void {
		if (k === undefined) {
			return _this.mKind as Security_CodeSigning_RequirementKind;
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
	declare private mKind: Security_Endian<uint32_t>;

	static {
		toStringTag(this, 'Security_CodeSigning_Requirement');
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

/**
 * Interpretation context.
 */
export class Security_CodeSigning_Requirement_Context {
	/**
	 * Constructor.
	 */
	constructor();

	/**
	 * Constructor.
	 *
	 * @param certChain Certificate chain.
	 * @param infoDict Info dictionary.
	 * @param entitlementDict Entitlement dictionary.
	 * @param ident Identifier.
	 * @param dir Code directory.
	 * @param packageChecksum Package checksum.
	 * @param packageAlgorithm Package algorithm.
	 * @param force_platform Force platform.
	 * @param secure_timestamp Secure timestamp.
	 * @param teamID Team ID.
	 * @param platformType Platform type.
	 * @param isSIPProtected Is SIP protected.
	 * @param onAuthorizedAuthAPFSVolume On authorized auth APFS volume.
	 * @param onSystemVolume On system volume.
	 * @param validationCategory Validation category.
	 */
	constructor(
		certChain: SecCertificateRef[] | null,
		infoDict: CFDictionaryRef | null,
		entitlementDict: CFDictionaryRef | null,
		ident: ArrayBufferLikeData,
		dir: _const<Security_CodeSigning_CodeDirectory | null>,
		packageChecksum: CFDataRef | null,
		packageAlgorithm: SecCSDigestAlgorithm,
		force_platform: bool,
		secure_timestamp: CFDateRef | null,
		teamID: ArrayBufferPointer | null,
		platformType?: uint8_t,
		isSIPProtected?: bool,
		onAuthorizedAuthAPFSVolume?: bool,
		onSystemVolume?: bool,
		validationCategory?: uint,
	);

	/**
	 * Constructor.
	 *
	 * @param certChain Certificate chain.
	 * @param infoDict Info dictionary.
	 * @param entitlementDict Entitlement dictionary.
	 * @param ident Identifier.
	 * @param dir Code directory.
	 * @param packageChecksum Package checksum.
	 * @param packageAlgorithm Package algorithm.
	 * @param force_platform Force platform.
	 * @param secure_timestamp Secure timestamp.
	 * @param teamID Team ID.
	 * @param platformType Platform type.
	 * @param isSIPProtected Is SIP protected.
	 * @param onAuthorizedAuthAPFSVolume On authorized auth APFS volume.
	 * @param onSystemVolume On system volume.
	 * @param validationCategory Validation category.
	 */
	constructor(
		certChain?: SecCertificateRef[] | null,
		infoDict?: CFDictionaryRef | null,
		entitlementDict?: CFDictionaryRef | null,
		ident?: ArrayBufferLikeData,
		dir?: _const<Security_CodeSigning_CodeDirectory | null>,
		packageChecksum?: CFDataRef | null,
		packageAlgorithm?: SecCSDigestAlgorithm,
		force_platform?: bool,
		secure_timestamp?: CFDateRef | null,
		teamID?: ArrayBufferPointer | null,
		platformType?: uint8_t,
		isSIPProtected?: bool,
		onAuthorizedAuthAPFSVolume?: bool,
		onSystemVolume?: bool,
		validationCategory?: uint,
	) {
		if (certChain === undefined) {
			this.certs = null;
			this.info = null;
			this.entitlements = null;
			this.identifier = new ArrayBuffer();
			this.directory = null;
			this.packageChecksum = null;
			this.packageAlgorithm = kSecCodeSignatureNoHash;
			this.forcePlatform = false;
			this.secureTimestamp = null;
			this.teamIdentifier = null;
			this.platformType = 0;
			this.isSIPProtected = false;
			this.onAuthorizedAuthAPFSVolume = false;
			this.onSystemVolume = false;
			this.validationCategory = CS_VALIDATION_CATEGORY_INVALID;
		} else {
			this.certs = certChain;
			this.info = infoDict!;
			this.entitlements = entitlementDict!;
			this.identifier = viewBytes(ident!).slice().buffer;
			this.directory = dir!;
			this.packageChecksum = packageChecksum!;
			this.packageAlgorithm = packageAlgorithm!;
			this.forcePlatform = force_platform!;
			this.secureTimestamp = secure_timestamp!;
			this.teamIdentifier = teamID!;
			this.platformType = platformType ?? 0;
			this.isSIPProtected = isSIPProtected ?? false;
			this.onAuthorizedAuthAPFSVolume = onAuthorizedAuthAPFSVolume ??
				false;
			this.onSystemVolume = onSystemVolume ?? false;
			this.validationCategory = validationCategory ??
				CS_VALIDATION_CATEGORY_INVALID;
		}
	}

	/**
	 * Certificate chain.
	 */
	public certs: SecCertificateRef[] | null;

	/**
	 * Info dictionary.
	 */
	public info: CFDictionaryRef | null;

	/**
	 * Entitlements dictionary.
	 */
	public entitlements: CFDictionaryRef | null;

	/**
	 * Identifier.
	 */
	public identifier: ArrayBufferLike;

	/**
	 * Code directory.
	 */
	public directory: _const<Security_CodeSigning_CodeDirectory> | null;

	/**
	 * Package checksum.
	 */
	public packageChecksum: CFDataRef | null;

	/**
	 * Package algorithm.
	 */
	public packageAlgorithm: SecCSDigestAlgorithm;

	/**
	 * Force platform.
	 */
	public forcePlatform: bool;

	/**
	 * Secure timestamp.
	 */
	public secureTimestamp: CFDateRef | null;

	/**
	 * Team ID.
	 */
	public teamIdentifier: _const<ArrayBufferPointer | null>;

	/**
	 * Platform type.
	 */
	public platformType: uint8_t;

	/**
	 * Is SIP protected.
	 */
	public isSIPProtected: bool;

	/**
	 * On authorized auth APFS volume.
	 */
	public onAuthorizedAuthAPFSVolume: bool;

	/**
	 * On system volume.
	 */
	public onSystemVolume: bool;

	/**
	 * Validation category.
	 */
	public validationCategory: uint;

	/**
	 * Get cert from chain.
	 *
	 * @param _this This.
	 * @param ix Index.
	 * @returns Cert or null.
	 */
	public static cert(
		_this: Security_CodeSigning_Requirement_Context,
		ix: int,
	): SecCertificateRef | null {
		const { certs } = _this;
		return certs ? certs.at(ix) ?? null : null;
	}

	/**
	 * Length of cert chain.
	 *
	 * @param _this This.
	 * @returns Cert count, including root.
	 */
	public static certCount(
		_this: Security_CodeSigning_Requirement_Context,
	): uint {
		const { certs } = _this;
		return certs ? certs.length : 0;
	}

	static {
		toStringTag(this, 'Security_CodeSigning_Requirement_Context');
	}
}

// Opcode exprForm:
// enum {

/**
 * Opcode flag mask.
 */
export const Security_CodeSigning_opFlagMask = 0xFF000000;

/**
 * Opcode generic false.
 */
export const Security_CodeSigning_opGenericFalse = 0x80000000;

/**
 * Opcode generic skip.
 */
export const Security_CodeSigning_opGenericSkip = 0x40000000;

// }

// enum ExprOp {

/**
 * Expression opcode.
 */
export type Security_CodeSigning_ExprOp =
	| typeof Security_CodeSigning_opFalse
	| typeof Security_CodeSigning_opTrue
	| typeof Security_CodeSigning_opIdent
	| typeof Security_CodeSigning_opAppleAnchor
	| typeof Security_CodeSigning_opAnchorHash
	| typeof Security_CodeSigning_opInfoKeyValue
	| typeof Security_CodeSigning_opAnd
	| typeof Security_CodeSigning_opOr
	| typeof Security_CodeSigning_opCDHash
	| typeof Security_CodeSigning_opNot
	| typeof Security_CodeSigning_opInfoKeyField
	| typeof Security_CodeSigning_opCertField
	| typeof Security_CodeSigning_opTrustedCert
	| typeof Security_CodeSigning_opTrustedCerts
	| typeof Security_CodeSigning_opCertGeneric
	| typeof Security_CodeSigning_opAppleGenericAnchor
	| typeof Security_CodeSigning_opEntitlementField
	| typeof Security_CodeSigning_opCertPolicy
	| typeof Security_CodeSigning_opNamedAnchor
	| typeof Security_CodeSigning_opNamedCode
	| typeof Security_CodeSigning_opPlatform
	| typeof Security_CodeSigning_opNotarized
	| typeof Security_CodeSigning_opCertFieldDate
	| typeof Security_CodeSigning_opLegacyDevID
	| typeof Security_CodeSigning_exprOpCount;

/**
 * Opcode: False.
 */
export const Security_CodeSigning_opFalse = 0;

/**
 * Opcode: True.
 */
export const Security_CodeSigning_opTrue = 1;

/**
 * Opcode: Ident.
 */
export const Security_CodeSigning_opIdent = 2;

/**
 * Opcode: Apple anchor.
 */
export const Security_CodeSigning_opAppleAnchor = 3;

/**
 * Opcode: Anchor hash.
 */
export const Security_CodeSigning_opAnchorHash = 4;

/**
 * Opcode: Info key value.
 */
export const Security_CodeSigning_opInfoKeyValue = 5;

/**
 * Opcode: And.
 */
export const Security_CodeSigning_opAnd = 6;

/**
 * Opcode: Or.
 */
export const Security_CodeSigning_opOr = 7;

/**
 * Opcode: CD hash.
 */
export const Security_CodeSigning_opCDHash = 8;

/**
 * Opcode: Not.
 */
export const Security_CodeSigning_opNot = 9;

/**
 * Opcode: Info key field.
 */
export const Security_CodeSigning_opInfoKeyField = 10;

/**
 * Opcode: Op cert field.
 */
export const Security_CodeSigning_opCertField = 11;

/**
 * Opcode: Trusted cert.
 */
export const Security_CodeSigning_opTrustedCert = 12;

/**
 * Opcode: Trusted certs.
 */
export const Security_CodeSigning_opTrustedCerts = 13;

/**
 * Opcode: Generic.
 */
export const Security_CodeSigning_opCertGeneric = 14;

/**
 * Opcode: Apple generic anchor.
 */
export const Security_CodeSigning_opAppleGenericAnchor = 15;

/**
 * Opcode: Entitlement field.
 */
export const Security_CodeSigning_opEntitlementField = 16;

/**
 * Opcode: Cert policy.
 */
export const Security_CodeSigning_opCertPolicy = 17;

/**
 * Opcode: Named anchor.
 */
export const Security_CodeSigning_opNamedAnchor = 18;

/**
 * Opcode: Named code.
 */
export const Security_CodeSigning_opNamedCode = 19;

/**
 * Opcode: Platform.
 */
export const Security_CodeSigning_opPlatform = 20;

/**
 * Opcode: Notarized.
 */
export const Security_CodeSigning_opNotarized = 21;

/**
 * Opcode: Cert field date.
 */
export const Security_CodeSigning_opCertFieldDate = 22;

/**
 * Opcode: Legacy dev ID.
 */
export const Security_CodeSigning_opLegacyDevID = 23;

/**
 * Opcode count.
 */
export const Security_CodeSigning_exprOpCount = 24;

// }

// enum MatchOperation {

/**
 * Match operation.
 */
export type Security_CodeSigning_MatchOperation =
	| typeof Security_CodeSigning_matchExists
	| typeof Security_CodeSigning_matchEqual
	| typeof Security_CodeSigning_matchContains
	| typeof Security_CodeSigning_matchBeginsWith
	| typeof Security_CodeSigning_matchEndsWith
	| typeof Security_CodeSigning_matchLessThan
	| typeof Security_CodeSigning_matchGreaterThan
	| typeof Security_CodeSigning_matchLessEqual
	| typeof Security_CodeSigning_matchGreaterEqual
	| typeof Security_CodeSigning_matchOn
	| typeof Security_CodeSigning_matchBefore
	| typeof Security_CodeSigning_matchAfter
	| typeof Security_CodeSigning_matchOnOrBefore
	| typeof Security_CodeSigning_matchOnOrAfter
	| typeof Security_CodeSigning_matchAbsent;

/**
 * Match: Exists.
 */
export const Security_CodeSigning_matchExists = 0;

/**
 * Match: Equal.
 */
export const Security_CodeSigning_matchEqual = 1;

/**
 * Match: Contains.
 */
export const Security_CodeSigning_matchContains = 2;

/**
 * Match: Begins with.
 */
export const Security_CodeSigning_matchBeginsWith = 3;

/**
 * Match: Ends with.
 */
export const Security_CodeSigning_matchEndsWith = 4;

/**
 * Match: Less than.
 */
export const Security_CodeSigning_matchLessThan = 5;

/**
 * Match: Greater than.
 */
export const Security_CodeSigning_matchGreaterThan = 6;

/**
 * Match: Less than or equal.
 */
export const Security_CodeSigning_matchLessEqual = 7;

/**
 * Match: Greater than or equal.
 */
export const Security_CodeSigning_matchGreaterEqual = 8;

/**
 * Match: On.
 */
export const Security_CodeSigning_matchOn = 9;

/**
 * Match: Before.
 */
export const Security_CodeSigning_matchBefore = 10;

/**
 * Match: After.
 */
export const Security_CodeSigning_matchAfter = 11;

/**
 * Match: On or before.
 */
export const Security_CodeSigning_matchOnOrBefore = 12;

/**
 * Match: On or after.
 */
export const Security_CodeSigning_matchOnOrAfter = 13;

/**
 * Match: Absent.
 */
export const Security_CodeSigning_matchAbsent = 14;

// }

/**
 * Requirement groups indexed by SecRequirementType.
 *
 * @template TArrayBuffer Buffer type.
 */
export class Security_CodeSigning_Requirements<
	TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
> extends Security_SuperBlob<TArrayBuffer> {
	public static override readonly typeMagic = kSecCodeMagicRequirementSet;

	static {
		toStringTag(this, 'Security_CodeSigning_Requirements');
		constant(this, 'typeMagic');
	}
}

/**
 * SuperBlob maker for Requirements.
 */
export class Security_CodeSigning_Requirements_Maker
	extends Security_SuperBlob_Maker {
	public static override readonly SuperBlob:
		typeof Security_CodeSigning_Requirements<
			ArrayBuffer
		> = Security_CodeSigning_Requirements;

	static {
		toStringTag(this, 'Security_CodeSigning_Requirements_Maker');
		constant(this, 'SuperBlob');
	}
}
