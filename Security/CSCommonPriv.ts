import type { uint32_t } from '../libc/stdint.ts';

// Blob types used for code signing:
// enum {

/**
 * Security code magic: Single requirement.
 */
export const kSecCodeMagicRequirement = 0xfade0c00;

/**
 * Security code magic: Requirement set.
 */
export const kSecCodeMagicRequirementSet = 0xfade0c01;

/**
 * Security code magic: Code directory.
 */
export const kSecCodeMagicCodeDirectory = 0xfade0c02;

/**
 * Security code magic: Embedded signature.
 */
export const kSecCodeMagicEmbeddedSignature = 0xfade0cc0;

/**
 * Security code magic: Detached signature.
 */
export const kSecCodeMagicDetachedSignature = 0xfade0cc1;

/**
 * Security code magic: Entitlement.
 */
export const kSecCodeMagicEntitlement = 0xfade7171;

/**
 * Security code magic: Entitlement DER.
 */
export const kSecCodeMagicEntitlementDER = 0xfade7172;

/**
 * Security code magic: Launch constraint.
 */
export const kSecCodeMagicLaunchConstraint = 0xfade8181;

/**
 * Security code magic: Shared first byte.
 */
export const kSecCodeMagicByte = 0xfa;

// }

// CF_OPTIONS(uint32_t, SecCodeExecSegFlags) {

/**
 * Executable code segment flags.
 */
export type SecCodeExecSegFlags =
	& uint32_t
	& (
		| typeof kSecCodeExecSegMainBinary
		| typeof kSecCodeExecSegAllowUnsigned
		| typeof kSecCodeExecSegDebugger
		| typeof kSecCodeExecSegJit
		| typeof kSecCodeExecSegSkipLibraryVal
		| typeof kSecCodeExecSegCanLoadCdHash
		| typeof kSecCodeExecSegCanExecCdHash
	);

/**
 * SecCodeExecSegFlags: Main binary.
 */
export const kSecCodeExecSegMainBinary = 0x0001;

/**
 * SecCodeExecSegFlags: Allow unsigned.
 */
export const kSecCodeExecSegAllowUnsigned = 0x0010;

/**
 * SecCodeExecSegFlags: Debugger.
 */
export const kSecCodeExecSegDebugger = 0x0020;

/**
 * SecCodeExecSegFlags: JIT.
 */
export const kSecCodeExecSegJit = 0x0040;

/**
 * SecCodeExecSegFlags: Skip library validation.
 */
export const kSecCodeExecSegSkipLibraryVal = 0x0080;

/**
 * SecCodeExecSegFlags: Can load cdhash.
 */
export const kSecCodeExecSegCanLoadCdHash = 0x0100;

/**
 * SecCodeExecSegFlags: Can execute cdhash.
 */
export const kSecCodeExecSegCanExecCdHash = 0x0200;

// }

// enum {

/**
 * The current fixed side of cdhash.
 */
export const kSecCodeCDHashLength = 20;

// }
