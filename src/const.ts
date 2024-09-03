// Highest number value before approximation, 2^53-1.
export const INT_LIMIT = 0x1fffffffffffff;

// A very large but still compatible upper block size limit.
export const BLK_LIMIT = 0x100000000;

export const kSecCodeMagicRequirement = 0xfade0c00;
export const kSecCodeMagicRequirementSet = 0xfade0c01;
export const kSecCodeMagicCodeDirectory = 0xfade0c02;
export const kSecCodeMagicEmbeddedSignature = 0xfade0cc0;
export const kSecCodeMagicDetachedSignature = 0xfade0cc1;
export const kSecCodeMagicEntitlement = 0xfade7171;
export const kSecCodeMagicEntitlementDER = 0xfade7172;
export const kSecCodeMagicLaunchConstraint = 0xfade8181;
export const kSecCodeMagicByte = 0xfa;

export const kSecCodeExecSegMainBinary = 0x0001;
export const kSecCodeExecSegAllowUnsigned = 0x0010;
export const kSecCodeExecSegDebugger = 0x0020;
export const kSecCodeExecSegJit = 0x0040;
export const kSecCodeExecSegSkipLibraryVal = 0x0080;
export const kSecCodeExecSegCanLoadCdHash = 0x0100;
export const kSecCodeExecSegCanExecCdHash = 0x0200;

export const kSecCodeCDHashLength = 20;

export const kSecCodeSignatureNoHash = 0;
export const kSecCodeSignatureHashSHA1 = 1;
export const kSecCodeSignatureHashSHA256 = 2;
export const kSecCodeSignatureHashSHA256Truncated = 3;
export const kSecCodeSignatureHashSHA384 = 4;
export const kSecCodeSignatureHashSHA512 = 5;

export const cdInfoSlot = 1;
export const cdRequirementsSlot = 2;
export const cdResourceDirSlot = 3;
export const cdTopDirectorySlot = 4;
export const cdEntitlementSlot = 5;
export const cdRepSpecificSlot = 6;
export const cdEntitlementDERSlot = 7;
export const cdLaunchConstraintSelf = 8;
export const cdLaunchConstraintParent = 9;
export const cdLaunchConstraintResponsible = 10;
export const cdLibraryConstraint = 11;
