// Code signing process attributes:

/**
 * Dynamically valid.
 */
export const CS_VALID = 0x00000001;

/**
 * Ad hoc signed.
 */
export const CS_ADHOC = 0x00000002;

/**
 * Get-task-allow entitlement.
 */
export const CS_GET_TASK_ALLOW = 0x00000004;

/**
 * Installer entitlement.
 */
export const CS_INSTALLER = 0x00000008;

/**
 * Library validation required.
 */
export const CS_FORCED_LV = 0x00000010;

/**
 * Page invalidation allowed.
 */
export const CS_INVALID_ALLOWED = 0x00000020;

/**
 * Reject loading invalid pages.
 */
export const CS_HARD = 0x00000100;

/**
 * Kill process if invalid.
 */
export const CS_KILL = 0x00000200;

/**
 * Force expiration checking.
 */
export const CS_CHECK_EXPIRATION = 0x00000400;

/**
 * Tread as restricted.
 */
export const CS_RESTRICT = 0x00000800;

/**
 * Require enforcement.
 */
export const CS_ENFORCEMENT = 0x00001000;

/**
 * Require library validation.
 */
export const CS_REQUIRE_LV = 0x00002000;

/**
 * Code signature allows for restricted entitlements.
 */
export const CS_ENTITLEMENTS_VALIDATED = 0x00004000;

/**
 * Unrestricted NVRAM variables.
 */
export const CS_NVRAM_UNRESTRICTED = 0x00008000;

/**
 * Hardened runtime.
 */
export const CS_RUNTIME = 0x00010000;

/**
 * Linker signed.
 */
export const CS_LINKER_SIGNED = 0x00020000;

/**
 * Mach-O allowed.
 */
export const CS_ALLOWED_MACHO = 0x33F02;
// CS_ADHOC | CS_HARD | CS_KILL | CS_CHECK_EXPIRATION | CS_RESTRICT |
// CS_ENFORCEMENT | CS_REQUIRE_LV | CS_RUNTIME | CS_LINKER_SIGNED

/**
 * Set CS_HARD on exec.
 */
export const CS_EXEC_SET_HARD = 0x00100000;

/**
 * Set CS_KILL on exec.
 */
export const CS_EXEC_SET_KILL = 0x00200000;

/**
 * Set CS_RESTRICT on exec.
 */
export const CS_EXEC_SET_ENFORCEMENT = 0x00400000;

/**
 * Set CS_RESTRICT on exec.
 */
export const CS_EXEC_INHERIT_SIP = 0x00800000;

/**
 * Killed by kernel.
 */
export const CS_KILLED = 0x01000000;

/**
 * No untrusted helpers.
 */
export const CS_NO_UNTRUSTED_HELPERS = 0x02000000;

/**
 * No untrusted helpers, legacy alias.
 */
export const CS_DYLD_PLATFORM = CS_NO_UNTRUSTED_HELPERS;

/**
 * Platform binary.
 */
export const CS_PLATFORM_BINARY = 0x04000000;

/**
 * Platform binary by path.
 */
export const CS_PLATFORM_PATH = 0x08000000;

/**
 * Process debugged.
 */
export const CS_DEBUGGED = 0x10000000;

/**
 * Process has a signature.
 */
export const CS_SIGNED = 0x20000000;

/**
 * Code is dev signed.
 */
export const CS_DEV_CODE = 0x40000000;

/**
 * Data Vault controller entitlement.
 */
export const CS_DATAVAULT_CONTROLLER = 0x80000000;

/**
 * Entitlement flags.
 */
export const CS_ENTITLEMENT_FLAGS = 0x8000800C;
// CS_GET_TASK_ALLOW | CS_INSTALLER | CS_DATAVAULT_CONTROLLER |
// CS_NVRAM_UNRESTRICTED

// Executable segment flags:

/**
 * Executable segment is main binary.
 */
export const CS_EXECSEG_MAIN_BINARY = 0x1;

/**
 * Allow unsigned pages.
 */
export const CS_EXECSEG_ALLOW_UNSIGNED = 0x10;

/**
 * Main binary is debugger.
 */
export const CS_EXECSEG_DEBUGGER = 0x20;

/**
 * Enable JIT.
 */
export const CS_EXECSEG_JIT = 0x40;

/**
 * Skip library validation.
 */
export const CS_EXECSEG_SKIP_LV = 0x80;

/**
 * Can load cdhash.
 */
export const CS_EXECSEG_CAN_LOAD_CDHASH = 0x100;

/**
 * Can execute cdhash.
 */
export const CS_EXECSEG_CAN_EXEC_CDHASH = 0x200;

// Magic numbers used by code signing:

/**
 * Single requirement.
 */
export const CSMAGIC_REQUIREMENT = 0xfade0c00;

/**
 * Multiple requirements.
 */
export const CSMAGIC_REQUIREMENTS = 0xfade0c01;

/**
 * Code directory.
 */
export const CSMAGIC_CODEDIRECTORY = 0xfade0c02;

/**
 * Embedded signature.
 */
export const CSMAGIC_EMBEDDED_SIGNATURE = 0xfade0cc0;

/**
 * Embedded signature (old).
 */
export const CSMAGIC_EMBEDDED_SIGNATURE_OLD = 0xfade0b02;

/**
 * Embedded entitlements.
 */
export const CSMAGIC_EMBEDDED_ENTITLEMENTS = 0xfade7171;

/**
 * Embedded DER entitlements.
 */
export const CSMAGIC_EMBEDDED_DER_ENTITLEMENTS = 0xfade7172;

/**
 * Detached signature.
 */
export const CSMAGIC_DETACHED_SIGNATURE = 0xfade0cc1;

/**
 * Blob wrapper.
 */
export const CSMAGIC_BLOBWRAPPER = 0xfade0b01;

/**
 * Embedded launch constraint.
 */
export const CSMAGIC_EMBEDDED_LAUNCH_CONSTRAINT = 0xfade8181;

/**
 * Code signature supports scatter.
 */
export const CS_SUPPORTSSCATTER = 0x20100;

/**
 * Code signature supports Team ID.
 */
export const CS_SUPPORTSTEAMID = 0x20200;

/**
 * Code signature supports 64-bit code limit.
 */
export const CS_SUPPORTSCODELIMIT64 = 0x20300;

/**
 * Code signature supports execseg.
 */
export const CS_SUPPORTSEXECSEG = 0x20400;

/**
 * Code signature supports runtime.
 */
export const CS_SUPPORTSRUNTIME = 0x20500;

/**
 * Code signature supports linkage.
 */
export const CS_SUPPORTSLINKAGE = 0x20600;

/**
 * Code signature slot: Code directory.
 */
export const CSSLOT_CODEDIRECTORY = 0;

/**
 * Code signature slot: Info slot.
 */
export const CSSLOT_INFOSLOT = 1;

/**
 * Code signature slot: Requirements.
 */
export const CSSLOT_REQUIREMENTS = 2;

/**
 * Code signature slot: Resource directory.
 */
export const CSSLOT_RESOURCEDIR = 3;

/**
 * Code signature slot: Application.
 */
export const CSSLOT_APPLICATION = 4;

/**
 * Code signature slot: Entitlements.
 */
export const CSSLOT_ENTITLEMENTS = 5;

/**
 * Code signature slot: DER entitlements.
 */
export const CSSLOT_DER_ENTITLEMENTS = 7;

/**
 * Code signature slot: Launch constraint.
 */
export const CSSLOT_LAUNCH_CONSTRAINT_SELF = 8;

/**
 * Code signature slot: Launch constraint.
 */
export const CSSLOT_LAUNCH_CONSTRAINT_PARENT = 9;

/**
 * Code signature slot: Launch constraint.
 */
export const CSSLOT_LAUNCH_CONSTRAINT_RESPONSIBLE = 10;

/**
 * Code signature slot: Library constraint.
 */
export const CSSLOT_LIBRARY_CONSTRAINT = 11;

/**
 * Code signature slot: Alternate code directories.
 */
export const CSSLOT_ALTERNATE_CODEDIRECTORIES = 0x1000;

/**
 * Code signature slot: Alternate code directory max.
 */
export const CSSLOT_ALTERNATE_CODEDIRECTORY_MAX = 5;

/**
 * Code signature slot: Alternate code directory limit.
 */
export const CSSLOT_ALTERNATE_CODEDIRECTORY_LIMIT = 0x1005;
// CSSLOT_ALTERNATE_CODEDIRECTORIES + CSSLOT_ALTERNATE_CODEDIRECTORY_MAX

/**
 * Code signature slot: CMS signature slot.
 */
export const CSSLOT_SIGNATURESLOT = 0x10000;

/**
 * Code signature slot: Identification slot.
 */
export const CSSLOT_IDENTIFICATIONSLOT = 0x10001;

/**
 * Code signature slot: Ticket slot.
 */
export const CSSLOT_TICKETSLOT = 0x10002;

/**
 * Code signature type index: Requirements.
 */
export const CSTYPE_INDEX_REQUIREMENTS = 0x00000002;

/**
 * Code signature type index: Entitlements.
 */
export const CSTYPE_INDEX_ENTITLEMENTS = 0x00000005;

/**
 * Code signature hash type: SHA-1.
 */
export const CS_HASHTYPE_SHA1 = 1;

/**
 * Code signature hash type: SHA-256.
 */
export const CS_HASHTYPE_SHA256 = 2;

/**
 * Code signature hash type: SHA-256 truncated.
 */
export const CS_HASHTYPE_SHA256_TRUNCATED = 3;

/**
 * Code signature hash type: SHA-384.
 */
export const CS_HASHTYPE_SHA384 = 4;

/**
 * Code signature hash length: SHA-1.
 */
export const CS_SHA1_LEN = 20;

/**
 * Code signature hash length: SHA-256.
 */
export const CS_SHA256_LEN = 32;

/**
 * Code signature hash length: SHA-256 truncated.
 */
export const CS_SHA256_TRUNCATED_LEN = 20;

/**
 * Code signature code directory hash length.
 */
export const CS_CDHASH_LEN = 20;

/**
 * Code signature hash maximum size.
 */
export const CS_HASH_MAX_SIZE = 48;

/**
 * Code signature signer type: Unknown.
 */
export const CS_SIGNER_TYPE_UNKNOWN = 0;

/**
 * Code signature signer type: Legacy VPN.
 */
export const CS_SIGNER_TYPE_LEGACYVPN = 5;

/**
 * Code signature signer type: Mac App Store.
 */
export const CS_SIGNER_TYPE_MAC_APP_STORE = 6;

/**
 * Code signature supplementary signer type: Unknown.
 */
export const CS_SUPPL_SIGNER_TYPE_UNKNOWN = 0;

/**
 * Code signature supplementary signer type: TrustCache.
 */
export const CS_SUPPL_SIGNER_TYPE_TRUSTCACHE = 7;

/**
 * Code signature supplementary signer type: Local.
 */
export const CS_SUPPL_SIGNER_TYPE_LOCAL = 8;

/**
 * Code signature signer type: OOPJIT.
 */
export const CS_SIGNER_TYPE_OOPJIT = 9;

// Validation categories for trusted launch environment:

/**
 * Code signature validation category: Invalid.
 */
export const CS_VALIDATION_CATEGORY_INVALID = 0;

/**
 * Code signature validation category: Platform.
 */
export const CS_VALIDATION_CATEGORY_PLATFORM = 1;

/**
 * Code signature validation category: TestFlight.
 */
export const CS_VALIDATION_CATEGORY_TESTFLIGHT = 2;

/**
 * Code signature validation category: Development.
 */
export const CS_VALIDATION_CATEGORY_DEVELOPMENT = 3;

/**
 * Code signature validation category: App Store.
 */
export const CS_VALIDATION_CATEGORY_APP_STORE = 4;

/**
 * Code signature validation category: Enterprise.
 */
export const CS_VALIDATION_CATEGORY_ENTERPRISE = 5;

/**
 * Code signature validation category: Developer ID.
 */
export const CS_VALIDATION_CATEGORY_DEVELOPER_ID = 6;

/**
 * Code signature validation category: Local signing.
 */
export const CS_VALIDATION_CATEGORY_LOCAL_SIGNING = 7;

/**
 * Code signature validation category: Rosetta.
 */
export const CS_VALIDATION_CATEGORY_ROSETTA = 8;

/**
 * Code signature validation category: OOPJIT.
 */
export const CS_VALIDATION_CATEGORY_OOPJIT = 9;

/**
 * Code signature validation category: None.
 */
export const CS_VALIDATION_CATEGORY_NONE = 10;

// Set of application types to support linkage signatures:

/**
 * Code signature linkage application: Invalid.
 */
export const CS_LINKAGE_APPLICATION_INVALID = 0;

/**
 * Code signature linkage application: Rosetta.
 */
export const CS_LINKAGE_APPLICATION_ROSETTA = 1;

/**
 * Code signature linkage application: OOPJIT.
 */
export const CS_LINKAGE_APPLICATION_XOJIT = 2;

/**
 * Code signature linkage application: OOPJIT.
 */
export const CS_LINKAGE_APPLICATION_OOPJIT = 2;

// Set of application subtypes to support linkage signatures:

/**
 * Code signature linkage application: Rosetta AOT.
 */
export const CS_LINKAGE_APPLICATION_ROSETTA_AOT = 0;

/**
 * Code signature linkage application: XOJIT previews.
 */
export const CS_LINKAGE_APPLICATION_XOJIT_PREVIEWS = 1;

/**
 * Code signature linkage application: OOPJIT invalid.
 */
export const CS_LINKAGE_APPLICATION_OOPJIT_INVALID = 0;

/**
 * Code signature linkage application: OOPJIT previews.
 */
export const CS_LINKAGE_APPLICATION_OOPJIT_PREVIEWS = 1;

/**
 * Code signature linkage application: OOPJIT ML Compiler.
 */
export const CS_LINKAGE_APPLICATION_OOPJIT_MLCOMPILER = 2;

/**
 * Code signature linkage application: OOPJIT total.
 */
export const CS_LINKAGE_APPLICATION_OOPJIT_TOTAL = 3;
