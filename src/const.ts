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