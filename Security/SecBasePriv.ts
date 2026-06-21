import { errSecDecode, errSecParam, errSecUnimplemented } from './SecBase.ts';

// enum {

/**
 * Invalid certificate.
 */
export const errSecInvalidCertificate = errSecDecode;

/**
 * Policy denied.
 */
export const errSecPolicyDenied = -26270;

/**
 * Invalid key.
 */
export const errSecInvalidKey = errSecDecode;

/**
 * Internal error.
 */
export const errSecInternal = -26276;

/**
 * Unsupported algorithm.
 */
export const errSecUnsupportedAlgorithm = errSecUnimplemented;

/**
 * Unsupported operation.
 */
export const errSecUnsupportedOperation = errSecUnimplemented;

/**
 * Unsupported padding.
 */
export const errSecUnsupportedPadding = errSecParam;

/**
 * Item invalid key.
 */
export const errSecItemInvalidKey = errSecParam;

/**
 * Item invalid key type.
 */
export const errSecItemInvalidKeyType = errSecParam;

/**
 * Item invalid value.
 */
export const errSecItemInvalidValue = errSecParam;

/**
 * Item class missing.
 */
export const errSecItemClassMissing = errSecParam;

/**
 * Item match unsupported.
 */
export const errSecItemMatchUnsupported = errSecParam;

/**
 * Use item list unsupported.
 */
export const errSecUseItemListUnsupported = errSecParam;

/**
 * Use keychain unsupported.
 */
export const errSecUseKeychainUnsupported = errSecParam;

/**
 * Use keychain list unsupported.
 */
export const errSecUseKeychainListUnsupported = errSecParam;

/**
 * Return data unsupported.
 */
export const errSecReturnDataUnsupported = errSecParam;

/**
 * Return attributes unsupported.
 */
export const errSecReturnAttributesUnsupported = errSecParam;

/**
 * Return ref unsupported.
 */
export const errSecReturnRefUnsupported = errSecParam;

/**
 * Return persistent ref unsupported.
 */
export const errSecReturnPersistentRefUnsupported = errSecParam;

/**
 * Value ref unsupported.
 */
export const errSecValueRefUnsupported = errSecParam;

/**
 * Value persistent ref unsupported.
 */
export const errSecValuePersistentRefUnsupported = errSecParam;

/**
 * Return missing pointer.
 */
export const errSecReturnMissingPointer = errSecParam;

/**
 * Match limit unsupported.
 */
export const errSecMatchLimitUnsupported = errSecParam;

/**
 * Item illegal query.
 */
export const errSecItemIllegalQuery = errSecParam;

/**
 * Wait for callback.
 */
export const errSecWaitForCallback = -34017;

/**
 * Upgrade pending.
 */
export const errSecUpgradePending = -34019;

/**
 * MP signature invalid.
 */
export const errSecMPSignatureInvalid = -25327;

/**
 * OTR too old.
 */
export const errSecOTRTooOld = -25328;

/**
 * OTR ID too new.
 */
export const errSecOTRIDTooNew = -25329;

/**
 * OTR not ready.
 */
export const errSecOTRNotReady = -25331;

/**
 * Auth needed.
 */
export const errSecAuthNeeded = -25330;

/**
 * Peers not available.
 */
export const errSecPeersNotAvailable = -25336;

/**
 * Error string not available.
 */
export const errSecErrorStringNotAvailable = -25337;

/**
 * Device ID needed.
 */
export const errSecDeviceIDNeeded = -25332;

/**
 * IDS not registered.
 */
export const errSecIDSNotRegistered = -25333;

/**
 * Failed to send IDS message.
 */
export const errSecFailedToSendIDSMessage = -25334;

/**
 * Device ID no match.
 */
export const errSecDeviceIDNoMatch = -25335;

/**
 * Timed out.
 */
export const errSecTimedOut = -25336;

// }
