// Security Error Codes:
// CF_ENUM(OSStatus) {

/**
 * Security error: No error.
 */
export const errSecSuccess = 0;

/**
 * Security error: Not implemented.
 */
export const errSecUnimplemented = -4;

/**
 * Security error: Disk full.
 */
export const errSecDiskFull = -34;

/**
 * Security error: Disk full alias.
 */
export const errSecDskFull = errSecDiskFull;

/**
 * Security error: I/O error.
 */
export const errSecIO = -36;

/**
 * Security error: Already open for writing.
 */
export const errSecOpWr = -49;

/**
 * Security error: Invalid parameter.
 */
export const errSecParam = -50;

/**
 * Security error: Write permission denied.
 */
export const errSecWrPerm = -61;

/**
 * Security error: Failed to allocate memory.
 */
export const errSecAllocate = -108;

/**
 * Security error: User canceled.
 */
export const errSecUserCanceled = -128;

/**
 * Security error: Bad request.
 */
export const errSecBadReq = -909;

/**
 * Security error: Internal component.
 */
export const errSecInternalComponent = -2070;

/**
 * Security error: Core Foundation unknown.
 */
export const errSecCoreFoundationUnknown = -4960;

/**
 * Security error: Missing entitlement.
 */
export const errSecMissingEntitlement = -34018;

/**
 * Security error: Restricted API.
 */
export const errSecRestrictedAPI = -34020;

/**
 * Security error: Not available.
 */
export const errSecNotAvailable = -25291;

/**
 * Security error: Read-only.
 */
export const errSecReadOnly = -25292;

/**
 * Security error: Authentication failed.
 */
export const errSecAuthFailed = -25293;

/**
 * Security error: No such keychain.
 */
export const errSecNoSuchKeychain = -25294;

/**
 * Security error: Invalid keychain.
 */
export const errSecInvalidKeychain = -25295;

/**
 * Security error: Duplicate keychain.
 */
export const errSecDuplicateKeychain = -25296;

/**
 * Security error: Duplicate callback.
 */
export const errSecDuplicateCallback = -25297;

/**
 * Security error: Invalid callback.
 */
export const errSecInvalidCallback = -25298;

/**
 * Security error: Duplicate item.
 */
export const errSecDuplicateItem = -25299;

/**
 * Security error: Item not found.
 */
export const errSecItemNotFound = -25300;

/**
 * Security error: Buffer too small.
 */
export const errSecBufferTooSmall = -25301;

/**
 * Security error: Data too large.
 */
export const errSecDataTooLarge = -25302;

/**
 * Security error: No such attribute.
 */
export const errSecNoSuchAttr = -25303;

/**
 * Security error: Invalid item ref.
 */
export const errSecInvalidItemRef = -25304;

/**
 * Security error: Invalid search ref.
 */
export const errSecInvalidSearchRef = -25305;

/**
 * Security error: No such class.
 */
export const errSecNoSuchClass = -25306;

/**
 * Security error: No default keychain.
 */
export const errSecNoDefaultKeychain = -25307;

/**
 * Security error: Interaction not allowed.
 */
export const errSecInteractionNotAllowed = -25308;

/**
 * Security error: Read-only attribute.
 */
export const errSecReadOnlyAttr = -25309;

/**
 * Security error: Wrong security version.
 */
export const errSecWrongSecVersion = -25310;

/**
 * Security error: Key size not allowed.
 */
export const errSecKeySizeNotAllowed = -25311;

/**
 * Security error: No storage module.
 */
export const errSecNoStorageModule = -25312;

/**
 * Security error: No certificate module.
 */
export const errSecNoCertificateModule = -25313;

/**
 * Security error: No policy module.
 */
export const errSecNoPolicyModule = -25314;

/**
 * Security error: Interaction required.
 */
export const errSecInteractionRequired = -25315;

/**
 * Security error: Data not available.
 */
export const errSecDataNotAvailable = -25316;

/**
 * Security error: Data not modifiable.
 */
export const errSecDataNotModifiable = -25317;

/**
 * Security error: Create chain failed.
 */
export const errSecCreateChainFailed = -25318;

/**
 * Security error: Invalid preferences domain.
 */
export const errSecInvalidPrefsDomain = -25319;

/**
 * Security error: In dark wake (no UI).
 */
export const errSecInDarkWake = -25320;

/**
 * Security error: Access control list not simple.
 */
export const errSecACLNotSimple = -25240;

/**
 * Security error: Policy not found.
 */
export const errSecPolicyNotFound = -25241;

/**
 * Security error: Invalid trust setting.
 */
export const errSecInvalidTrustSetting = -25242;

/**
 * Security error: No access for item.
 */
export const errSecNoAccessForItem = -25243;

/**
 * Security error: Invalid owner edit.
 */
export const errSecInvalidOwnerEdit = -25244;

/**
 * Security error: Trust not available.
 */
export const errSecTrustNotAvailable = -25245;

/**
 * Security error: Unsupported format.
 */
export const errSecUnsupportedFormat = -25256;

/**
 * Security error: Unknown format.
 */
export const errSecUnknownFormat = -25257;

/**
 * Security error: Key is sensitive.
 */
export const errSecKeyIsSensitive = -25258;

/**
 * Security error: Multiple private keys.
 */
export const errSecMultiplePrivKeys = -25259;

/**
 * Security error: Passphrase required.
 */
export const errSecPassphraseRequired = -25260;

/**
 * Security error: Invalid password ref.
 */
export const errSecInvalidPasswordRef = -25261;

/**
 * Security error: Invalid trust settings.
 */
export const errSecInvalidTrustSettings = -25262;

/**
 * Security error: No trust settings.
 */
export const errSecNoTrustSettings = -25263;

/**
 * Security error: PKCS#12 verify failure.
 */
export const errSecPkcs12VerifyFailure = -25264;

/**
 * Security error: Not signer.
 */
export const errSecNotSigner = -26267;

/**
 * Security error: Decode error.
 */
export const errSecDecode = -26275;

/**
 * Security error: Service not available.
 */
export const errSecServiceNotAvailable = -67585;

/**
 * Security error: Insufficient client ID.
 */
export const errSecInsufficientClientID = -67586;

/**
 * Security error: Device reset.
 */
export const errSecDeviceReset = -67587;

/**
 * Security error: Device failed.
 */
export const errSecDeviceFailed = -67588;

/**
 * Security error: Apple add app ACL subject.
 */
export const errSecAppleAddAppACLSubject = -67589;

/**
 * Security error: Apple public key incomplete.
 */
export const errSecApplePublicKeyIncomplete = -67590;

/**
 * Security error: Apple signature mismatch.
 */
export const errSecAppleSignatureMismatch = -67591;

/**
 * Security error: Apple invalid key start date.
 */
export const errSecAppleInvalidKeyStartDate = -67592;

/**
 * Security error: Apple invalid key end date.
 */
export const errSecAppleInvalidKeyEndDate = -67593;

/**
 * Security error: Apple conversion error.
 */
export const errSecConversionError = -67594;

/**
 * Security error: Apple SSLv2 rollback.
 */
export const errSecAppleSSLv2Rollback = -67595;

/**
 * Security error: Quota exceeded.
 */
export const errSecQuotaExceeded = -67596;

/**
 * Security error: File too big.
 */
export const errSecFileTooBig = -67597;

/**
 * Security error: Invalid database blob.
 */
export const errSecInvalidDatabaseBlob = -67598;

/**
 * Security error: Invalid key blob.
 */
export const errSecInvalidKeyBlob = -67599;

/**
 * Security error: Incompatible database blob.
 */
export const errSecIncompatibleDatabaseBlob = -67600;

/**
 * Security error: Incompatible key blob.
 */
export const errSecIncompatibleKeyBlob = -67601;

/**
 * Security error: Host name mismatch.
 */
export const errSecHostNameMismatch = -67602;

/**
 * Security error: Unknown critical extension flag.
 */
export const errSecUnknownCriticalExtensionFlag = -67603;

/**
 * Security error: No basic constraints.
 */
export const errSecNoBasicConstraints = -67604;

/**
 * Security error: No basic constraints CA.
 */
export const errSecNoBasicConstraintsCA = -67605;

/**
 * Security error: Invalid authority key ID.
 */
export const errSecInvalidAuthorityKeyID = -67606;

/**
 * Security error: Invalid subject key ID.
 */
export const errSecInvalidSubjectKeyID = -67607;

/**
 * Security error: Invalid key usage for policy.
 */
export const errSecInvalidKeyUsageForPolicy = -67608;

/**
 * Security error: Invalid extended key usage.
 */
export const errSecInvalidExtendedKeyUsage = -67609;

/**
 * Security error: Invalid ID linkage.
 */
export const errSecInvalidIDLinkage = -67610;

/**
 * Security error: Path length constraint exceeded.
 */
export const errSecPathLengthConstraintExceeded = -67611;

/**
 * Security error: Invalid root.
 */
export const errSecInvalidRoot = -67612;

/**
 * Security error: CRL expired.
 */
export const errSecCRLExpired = -67613;

/**
 * Security error: CRL not valid yet.
 */
export const errSecCRLNotValidYet = -67614;

/**
 * Security error: CRL not found.
 */
export const errSecCRLNotFound = -67615;

/**
 * Security error: CRL server down.
 */
export const errSecCRLServerDown = -67616;

/**
 * Security error: CRL bad URI.
 */
export const errSecCRLBadURI = -67617;

/**
 * Security error: Unknown certificate extension.
 */
export const errSecUnknownCertExtension = -67618;

/**
 * Security error: Unknown CRL extension.
 */
export const errSecUnknownCRLExtension = -67619;

/**
 * Security error: CRL not trusted.
 */
export const errSecCRLNotTrusted = -67620;

/**
 * Security error: CRL policy failed.
 */
export const errSecCRLPolicyFailed = -67621;

/**
 * Security error: IDP failure.
 */
export const errSecIDPFailure = -67622;

/**
 * Security error: SMIME email addresses not found.
 */
export const errSecSMIMEEmailAddressesNotFound = -67623;

/**
 * Security error: SMIME bad extended key usage.
 */
export const errSecSMIMEBadExtendedKeyUsage = -67624;

/**
 * Security error: SMIME bad key usage.
 */
export const errSecSMIMEBadKeyUsage = -67625;

/**
 * Security error: SMIME key usage not critical.
 */
export const errSecSMIMEKeyUsageNotCritical = -67626;

/**
 * Security error: SMIME no email address.
 */
export const errSecSMIMENoEmailAddress = -67627;

/**
 * Security error: SMIME subject alt name not critical.
 */
export const errSecSMIMESubjAltNameNotCritical = -67628;

/**
 * Security error: SSL bad extended key usage.
 */
export const errSecSSLBadExtendedKeyUsage = -67629;

/**
 * Security error: OCSP bad response.
 */
export const errSecOCSPBadResponse = -67630;

/**
 * Security error: OCSP bad request.
 */
export const errSecOCSPBadRequest = -67631;

/**
 * Security error: OCSP unavailable.
 */
export const errSecOCSPUnavailable = -67632;

/**
 * Security error: OCSP status unrecognized.
 */
export const errSecOCSPStatusUnrecognized = -67633;

/**
 * Security error: End of data.
 */
export const errSecEndOfData = -67634;

/**
 * Security error: Incomplete certificate revocation check.
 */
export const errSecIncompleteCertRevocationCheck = -67635;

/**
 * Security error: Network failure.
 */
export const errSecNetworkFailure = -67636;

/**
 * Security error: OCSP not trusted to anchor.
 */
export const errSecOCSPNotTrustedToAnchor = -67637;

/**
 * Security error: OCSP record modified.
 */
export const errSecRecordModified = -67638;

/**
 * Security error: OCSP signature error.
 */
export const errSecOCSPSignatureError = -67639;

/**
 * Security error: OCSP no signer.
 */
export const errSecOCSPNoSigner = -67640;

/**
 * Security error: OCSP responder malformed request.
 */
export const errSecOCSPResponderMalformedReq = -67641;

/**
 * Security error: OCSP responder internal error.
 */
export const errSecOCSPResponderInternalError = -67642;

/**
 * Security error: OCSP responder try later.
 */
export const errSecOCSPResponderTryLater = -67643;

/**
 * Security error: OCSP responder signature required.
 */
export const errSecOCSPResponderSignatureRequired = -67644;

/**
 * Security error: OCSP responder unauthorized.
 */
export const errSecOCSPResponderUnauthorized = -67645;

/**
 * Security error: OCSP response nonce mismatch.
 */
export const errSecOCSPResponseNonceMismatch = -67646;

/**
 * Security error: Code signing bad certificate chain length.
 */
export const errSecCodeSigningBadCertChainLength = -67647;

/**
 * Security error: Code signing no basic constraints.
 */
export const errSecCodeSigningNoBasicConstraints = -67648;

/**
 * Security error: Code signing bad path length constraint.
 */
export const errSecCodeSigningBadPathLengthConstraint = -67649;

/**
 * Security error: Code signing no extended key usage.
 */
export const errSecCodeSigningNoExtendedKeyUsage = -67650;

/**
 * Security error: Code signing development.
 */
export const errSecCodeSigningDevelopment = -67651;

/**
 * Security error: Resource signing bad certificate chain length.
 */
export const errSecResourceSignBadCertChainLength = -67652;

/**
 * Security error: Resource signing bad extended key usage.
 */
export const errSecResourceSignBadExtKeyUsage = -67653;

/**
 * Security error: Trust setting deny.
 */
export const errSecTrustSettingDeny = -67654;

/**
 * Security error: Invalid subject name.
 */
export const errSecInvalidSubjectName = -67655;

/**
 * Security error: Unknown qualified certificate statement.
 */
export const errSecUnknownQualifiedCertStatement = -67656;

/**
 * Security error: MobileMe request queued.
 */
export const errSecMobileMeRequestQueued = -67657;

/**
 * Security error: MobileMe request redirected.
 */
export const errSecMobileMeRequestRedirected = -67658;

/**
 * Security error: MobileMe server error.
 */
export const errSecMobileMeServerError = -67659;

/**
 * Security error: MobileMe server not available.
 */
export const errSecMobileMeServerNotAvailable = -67660;

/**
 * Security error: MobileMe server already exists.
 */
export const errSecMobileMeServerAlreadyExists = -67661;

/**
 * Security error: MobileMe server service error.
 */
export const errSecMobileMeServerServiceErr = -67662;

/**
 * Security error: MobileMe request already pending.
 */
export const errSecMobileMeRequestAlreadyPending = -67663;

/**
 * Security error: MobileMe no request pending.
 */
export const errSecMobileMeNoRequestPending = -67664;

/**
 * Security error: MobileMe CSR verify failure.
 */
export const errSecMobileMeCSRVerifyFailure = -67665;

/**
 * Security error: MobileMe failed consistency check.
 */
export const errSecMobileMeFailedConsistencyCheck = -67666;

/**
 * Security error: Not initialized.
 */
export const errSecNotInitialized = -67667;

/**
 * Security error: Invalid handle usage.
 */
export const errSecInvalidHandleUsage = -67668;

/**
 * Security error: PVC referent not found.
 */
export const errSecPVCReferentNotFound = -67669;

/**
 * Security error: Function integrity failure.
 */
export const errSecFunctionIntegrityFail = -67670;

/**
 * Security error: Internal error.
 */
export const errSecInternalError = -67671;

/**
 * Security error: Memory error.
 */
export const errSecMemoryError = -67672;

/**
 * Security error: Invalid data.
 */
export const errSecInvalidData = -67673;

/**
 * Security error: MDS error.
 */
export const errSecMDSError = -67674;

/**
 * Security error: Invalid pointer.
 */
export const errSecInvalidPointer = -67675;

/**
 * Security error: Self check failed.
 */
export const errSecSelfCheckFailed = -67676;

/**
 * Security error: Function failed.
 */
export const errSecFunctionFailed = -67677;

/**
 * Security error: Module manifest verify failed.
 */
export const errSecModuleManifestVerifyFailed = -67678;

/**
 * Security error: Invalid GUID.
 */
export const errSecInvalidGUID = -67679;

/**
 * Security error: Invalid handle.
 */
export const errSecInvalidHandle = -67680;

/**
 * Security error: Invalid DB list.
 */
export const errSecInvalidDBList = -67681;

/**
 * Security error: Invalid passthrough ID.
 */
export const errSecInvalidPassthroughID = -67682;

/**
 * Security error: Invalid network address.
 */
export const errSecInvalidNetworkAddress = -67683;

/**
 * Security error: CRL already signed.
 */
export const errSecCRLAlreadySigned = -67684;

/**
 * Security error: Invalid number of fields.
 */
export const errSecInvalidNumberOfFields = -67685;

/**
 * Security error: Verification failure.
 */
export const errSecVerificationFailure = -67686;

/**
 * Security error: Unknown tag.
 */
export const errSecUnknownTag = -67687;

/**
 * Security error: Invalid signature.
 */
export const errSecInvalidSignature = -67688;

/**
 * Security error: Invalid name.
 */
export const errSecInvalidName = -67689;

/**
 * Security error: Invalid certificate ref.
 */
export const errSecInvalidCertificateRef = -67690;

/**
 * Security error: Invalid certificate group.
 */
export const errSecInvalidCertificateGroup = -67691;

/**
 * Security error: Tag not found.
 */
export const errSecTagNotFound = -67692;

/**
 * Security error: Invalid query.
 */
export const errSecInvalidQuery = -67693;

/**
 * Security error: Invalid value.
 */
export const errSecInvalidValue = -67694;

/**
 * Security error: Callback failed.
 */
export const errSecCallbackFailed = -67695;

/**
 * Security error: ACL delete failed.
 */
export const errSecACLDeleteFailed = -67696;

/**
 * Security error: ACL replace failed.
 */
export const errSecACLReplaceFailed = -67697;

/**
 * Security error: ACL add failed.
 */
export const errSecACLAddFailed = -67698;

/**
 * Security error: ACL change failed.
 */
export const errSecACLChangeFailed = -67699;

/**
 * Security error: Invalid access credentials.
 */
export const errSecInvalidAccessCredentials = -67700;

/**
 * Security error: Invalid record.
 */
export const errSecInvalidRecord = -67701;

/**
 * Security error: Invalid ACL.
 */
export const errSecInvalidACL = -67702;

/**
 * Security error: Invalid sample value.
 */
export const errSecInvalidSampleValue = -67703;

/**
 * Security error: Incompatible version.
 */
export const errSecIncompatibleVersion = -67704;

/**
 * Security error: Privilege not granted.
 */
export const errSecPrivilegeNotGranted = -67705;

/**
 * Security error: Invalid scope.
 */
export const errSecInvalidScope = -67706;

/**
 * Security error: PVC already configured.
 */
export const errSecPVCAlreadyConfigured = -67707;

/**
 * Security error: Invalid PVC.
 */
export const errSecInvalidPVC = -67708;

/**
 * Security error: EMM load failed.
 */
export const errSecEMMLoadFailed = -67709;

/**
 * Security error: EMM unload failed.
 */
export const errSecEMMUnloadFailed = -67710;

/**
 * Security error: Addin load failed.
 */
export const errSecAddinLoadFailed = -67711;

/**
 * Security error: Invalid key ref.
 */
export const errSecInvalidKeyRef = -67712;

/**
 * Security error: Invalid key hierarchy.
 */
export const errSecInvalidKeyHierarchy = -67713;

/**
 * Security error: Addin unload failed.
 */
export const errSecAddinUnloadFailed = -67714;

/**
 * Security error: Library reference not found.
 */
export const errSecLibraryReferenceNotFound = -67715;

/**
 * Security error: Invalid addin function table.
 */
export const errSecInvalidAddinFunctionTable = -67716;

/**
 * Security error: Invalid service mask.
 */
export const errSecInvalidServiceMask = -67717;

/**
 * Security error: Module not loaded.
 */
export const errSecModuleNotLoaded = -67718;

/**
 * Security error: Invalid sub-service ID.
 */
export const errSecInvalidSubServiceID = -67719;

/**
 * Security error: Attribute not in context.
 */
export const errSecAttributeNotInContext = -67720;

/**
 * Security error: Module manager initialize failed.
 */
export const errSecModuleManagerInitializeFailed = -67721;

/**
 * Security error: Module manager not found.
 */
export const errSecModuleManagerNotFound = -67722;

/**
 * Security error: Event notification callback not found.
 */
export const errSecEventNotificationCallbackNotFound = -67723;

/**
 * Security error: Invalid input length.
 */
export const errSecInputLengthError = -67724;

/**
 * Security error: Output length error.
 */
export const errSecOutputLengthError = -67725;

/**
 * Security error: Privilege not supported.
 */
export const errSecPrivilegeNotSupported = -67726;

/**
 * Security error: Device error.
 */
export const errSecDeviceError = -67727;

/**
 * Security error: Attach handle busy.
 */
export const errSecAttachHandleBusy = -67728;

/**
 * Security error: Not logged in.
 */
export const errSecNotLoggedIn = -67729;

/**
 * Security error: Algorithm mismatch.
 */
export const errSecAlgorithmMismatch = -67730;

/**
 * Security error: Key usage incorrect.
 */
export const errSecKeyUsageIncorrect = -67731;

/**
 * Security error: Key blob type incorrect.
 */
export const errSecKeyBlobTypeIncorrect = -67732;

/**
 * Security error: Key header inconsistent.
 */
export const errSecKeyHeaderInconsistent = -67733;

/**
 * Security error: Unsupported key format.
 */
export const errSecUnsupportedKeyFormat = -67734;

/**
 * Security error: Unsupported key size.
 */
export const errSecUnsupportedKeySize = -67735;

/**
 * Security error: Invalid key usage mask.
 */
export const errSecInvalidKeyUsageMask = -67736;

/**
 * Security error: Unsupported key usage mask.
 */
export const errSecUnsupportedKeyUsageMask = -67737;

/**
 * Security error: Invalid key attribute mask.
 */
export const errSecInvalidKeyAttributeMask = -67738;

/**
 * Security error: Unsupported key attribute mask.
 */
export const errSecUnsupportedKeyAttributeMask = -67739;

/**
 * Security error: Invalid key label.
 */
export const errSecInvalidKeyLabel = -67740;

/**
 * Security error: Unsupported key label.
 */
export const errSecUnsupportedKeyLabel = -67741;

/**
 * Security error: Invalid key format.
 */
export const errSecInvalidKeyFormat = -67742;

/**
 * Security error: Unsupported vector of buffers.
 */
export const errSecUnsupportedVectorOfBuffers = -67743;

/**
 * Security error: Invalid input vector.
 */
export const errSecInvalidInputVector = -67744;

/**
 * Security error: Invalid output vector.
 */
export const errSecInvalidOutputVector = -67745;

/**
 * Security error: Invalid context.
 */
export const errSecInvalidContext = -67746;

/**
 * Security error: Invalid algorithm.
 */
export const errSecInvalidAlgorithm = -67747;

/**
 * Security error: Invalid attribute key.
 */
export const errSecInvalidAttributeKey = -67748;

/**
 * Security error: Missing attribute key.
 */
export const errSecMissingAttributeKey = -67749;

/**
 * Security error: Invalid attribute init vector.
 */
export const errSecInvalidAttributeInitVector = -67750;

/**
 * Security error: Missing attribute init vector.
 */
export const errSecMissingAttributeInitVector = -67751;

/**
 * Security error: Invalid attribute salt.
 */
export const errSecInvalidAttributeSalt = -67752;

/**
 * Security error: Missing attribute salt.
 */
export const errSecMissingAttributeSalt = -67753;

/**
 * Security error: Invalid attribute padding.
 */
export const errSecInvalidAttributePadding = -67754;

/**
 * Security error: Missing attribute padding.
 */
export const errSecMissingAttributePadding = -67755;

/**
 * Security error: Invalid attribute random.
 */
export const errSecInvalidAttributeRandom = -67756;

/**
 * Security error: Missing attribute random.
 */
export const errSecMissingAttributeRandom = -67757;

/**
 * Security error: Invalid attribute seed.
 */
export const errSecInvalidAttributeSeed = -67758;

/**
 * Security error: Missing attribute seed.
 */
export const errSecMissingAttributeSeed = -67759;

/**
 * Security error: Invalid attribute passphrase.
 */
export const errSecInvalidAttributePassphrase = -67760;

/**
 * Security error: Missing attribute passphrase.
 */
export const errSecMissingAttributePassphrase = -67761;

/**
 * Security error: Invalid attribute key length.
 */
export const errSecInvalidAttributeKeyLength = -67762;

/**
 * Security error: Missing attribute key length.
 */
export const errSecMissingAttributeKeyLength = -67763;

/**
 * Security error: Invalid attribute block size.
 */
export const errSecInvalidAttributeBlockSize = -67764;

/**
 * Security error: Missing attribute block size.
 */
export const errSecMissingAttributeBlockSize = -67765;

/**
 * Security error: Invalid attribute output size.
 */
export const errSecInvalidAttributeOutputSize = -67766;

/**
 * Security error: Missing attribute output size.
 */
export const errSecMissingAttributeOutputSize = -67767;

/**
 * Security error: Invalid attribute rounds.
 */
export const errSecInvalidAttributeRounds = -67768;

/**
 * Security error: Missing attribute rounds.
 */
export const errSecMissingAttributeRounds = -67769;

/**
 * Security error: Invalid algorithm parameters.
 */
export const errSecInvalidAlgorithmParms = -67770;

/**
 * Security error: Missing algorithm parameters.
 */
export const errSecMissingAlgorithmParms = -67771;

/**
 * Security error: Invalid attribute label.
 */
export const errSecInvalidAttributeLabel = -67772;

/**
 * Security error: Missing attribute label.
 */
export const errSecMissingAttributeLabel = -67773;

/**
 * Security error: Invalid attribute key type.
 */
export const errSecInvalidAttributeKeyType = -67774;

/**
 * Security error: Missing attribute key type.
 */
export const errSecMissingAttributeKeyType = -67775;

/**
 * Security error: Invalid attribute mode.
 */
export const errSecInvalidAttributeMode = -67776;

/**
 * Security error: Missing attribute mode.
 */
export const errSecMissingAttributeMode = -67777;

/**
 * Security error: Invalid attribute effective bits.
 */
export const errSecInvalidAttributeEffectiveBits = -67778;

/**
 * Security error: Missing attribute effective bits.
 */
export const errSecMissingAttributeEffectiveBits = -67779;

/**
 * Security error: Invalid attribute start date.
 */
export const errSecInvalidAttributeStartDate = -67780;

/**
 * Security error: Missing attribute start date.
 */
export const errSecMissingAttributeStartDate = -67781;

/**
 * Security error: Invalid attribute end date.
 */
export const errSecInvalidAttributeEndDate = -67782;

/**
 * Security error: Missing attribute end date.
 */
export const errSecMissingAttributeEndDate = -67783;

/**
 * Security error: Invalid attribute version.
 */
export const errSecInvalidAttributeVersion = -67784;

/**
 * Security error: Missing attribute version.
 */
export const errSecMissingAttributeVersion = -67785;

/**
 * Security error: Invalid attribute prime.
 */
export const errSecInvalidAttributePrime = -67786;

/**
 * Security error: Missing attribute prime.
 */
export const errSecMissingAttributePrime = -67787;

/**
 * Security error: Invalid attribute base.
 */
export const errSecInvalidAttributeBase = -67788;

/**
 * Security error: Missing attribute base.
 */
export const errSecMissingAttributeBase = -67789;

/**
 * Security error: Invalid attribute subprime.
 */
export const errSecInvalidAttributeSubprime = -67790;

/**
 * Security error: Missing attribute subprime.
 */
export const errSecMissingAttributeSubprime = -67791;

/**
 * Security error: Invalid attribute iteration count.
 */
export const errSecInvalidAttributeIterationCount = -67792;

/**
 * Security error: Missing attribute iteration count.
 */
export const errSecMissingAttributeIterationCount = -67793;

/**
 * Security error: Invalid attribute DLDB handle.
 */
export const errSecInvalidAttributeDLDBHandle = -67794;

/**
 * Security error: Missing attribute DLDB handle.
 */
export const errSecMissingAttributeDLDBHandle = -67795;

/**
 * Security error: Invalid attribute access credentials.
 */
export const errSecInvalidAttributeAccessCredentials = -67796;

/**
 * Security error: Missing attribute access credentials.
 */
export const errSecMissingAttributeAccessCredentials = -67797;

/**
 * Security error: Invalid attribute public key format.
 */
export const errSecInvalidAttributePublicKeyFormat = -67798;

/**
 * Security error: Missing attribute public key format.
 */
export const errSecMissingAttributePublicKeyFormat = -67799;

/**
 * Security error: Invalid attribute private key format.
 */
export const errSecInvalidAttributePrivateKeyFormat = -67800;

/**
 * Security error: Missing attribute private key format.
 */
export const errSecMissingAttributePrivateKeyFormat = -67801;

/**
 * Security error: Invalid attribute symmetric key format.
 */
export const errSecInvalidAttributeSymmetricKeyFormat = -67802;

/**
 * Security error: Missing attribute symmetric key format.
 */
export const errSecMissingAttributeSymmetricKeyFormat = -67803;

/**
 * Security error: Invalid attribute wrapped key format.
 */
export const errSecInvalidAttributeWrappedKeyFormat = -67804;

/**
 * Security error: Missing attribute wrapped key format.
 */
export const errSecMissingAttributeWrappedKeyFormat = -67805;

/**
 * Security error: Staged operation in progress.
 */
export const errSecStagedOperationInProgress = -67806;

/**
 * Security error: Staged operation not started.
 */
export const errSecStagedOperationNotStarted = -67807;

/**
 * Security error: Verify failed.
 */
export const errSecVerifyFailed = -67808;

/**
 * Security error: Query size unknown.
 */
export const errSecQuerySizeUnknown = -67809;

/**
 * Security error: Block size mismatch.
 */
export const errSecBlockSizeMismatch = -67810;

/**
 * Security error: Public key inconsistent.
 */
export const errSecPublicKeyInconsistent = -67811;

/**
 * Security error: Device verify failed.
 */
export const errSecDeviceVerifyFailed = -67812;

/**
 * Security error: Invalid login name.
 */
export const errSecInvalidLoginName = -67813;

/**
 * Security error: Already logged in.
 */
export const errSecAlreadyLoggedIn = -67814;

/**
 * Security error: Invalid digest algorithm.
 */
export const errSecInvalidDigestAlgorithm = -67815;

/**
 * Security error: Invalid CRL group.
 */
export const errSecInvalidCRLGroup = -67816;

/**
 * Security error: Certificate cannot operate.
 */
export const errSecCertificateCannotOperate = -67817;

/**
 * Security error: Certificate expired.
 */
export const errSecCertificateExpired = -67818;

/**
 * Security error: Certificate not valid yet.
 */
export const errSecCertificateNotValidYet = -67819;

/**
 * Security error: Certificate revoked.
 */
export const errSecCertificateRevoked = -67820;

/**
 * Security error: Certificate suspended.
 */
export const errSecCertificateSuspended = -67821;

/**
 * Security error: Insufficient credentials.
 */
export const errSecInsufficientCredentials = -67822;

/**
 * Security error: Invalid action.
 */
export const errSecInvalidAction = -67823;

/**
 * Security error: Invalid authority.
 */
export const errSecInvalidAuthority = -67824;

/**
 * Security error: Verify action failed.
 */
export const errSecVerifyActionFailed = -67825;

/**
 * Security error: Invalid certificate authority.
 */
export const errSecInvalidCertAuthority = -67826;

/**
 * Security error: Invalid CRL authority.
 */
export const errSecInvalidCRLAuthority = -67827;

/**
 * Security error: Invalid CRL authority.
 */
export const errSecInvaldCRLAuthority = errSecInvalidCRLAuthority;

/**
 * Security error: Invalid CRL encoding.
 */
export const errSecInvalidCRLEncoding = -67828;

/**
 * Security error: Invalid CRL type.
 */
export const errSecInvalidCRLType = -67829;

/**
 * Security error: Invalid CRL.
 */
export const errSecInvalidCRL = -67830;

/**
 * Security error: Invalid form type.
 */
export const errSecInvalidFormType = -67831;

/**
 * Security error: Invalid ID.
 */
export const errSecInvalidID = -67832;

/**
 * Security error: Invalid identifier.
 */
export const errSecInvalidIdentifier = -67833;

/**
 * Security error: Invalid index.
 */
export const errSecInvalidIndex = -67834;

/**
 * Security error: Invalid policy identifiers.
 */
export const errSecInvalidPolicyIdentifiers = -67835;

/**
 * Security error: Invalid time string.
 */
export const errSecInvalidTimeString = -67836;

/**
 * Security error: Invalid reason.
 */
export const errSecInvalidReason = -67837;

/**
 * Security error: Invalid request inputs.
 */
export const errSecInvalidRequestInputs = -67838;

/**
 * Security error: Invalid response vector.
 */
export const errSecInvalidResponseVector = -67839;

/**
 * Security error: Invalid stop on policy.
 */
export const errSecInvalidStopOnPolicy = -67840;

/**
 * Security error: Invalid tuple.
 */
export const errSecInvalidTuple = -67841;

/**
 * Security error: Multiple values unsupported.
 */
export const errSecMultipleValuesUnsupported = -67842;

/**
 * Security error: Not trusted.
 */
export const errSecNotTrusted = -67843;

/**
 * Security error: No default authority.
 */
export const errSecNoDefaultAuthority = -67844;

/**
 * Security error: Rejected form.
 */
export const errSecRejectedForm = -67845;

/**
 * Security error: Request lost.
 */
export const errSecRequestLost = -67846;

/**
 * Security error: Request rejected.
 */
export const errSecRequestRejected = -67847;

/**
 * Security error: Unsupported address type.
 */
export const errSecUnsupportedAddressType = -67848;

/**
 * Security error: Unsupported service.
 */
export const errSecUnsupportedService = -67849;

/**
 * Security error: Invalid tuple group.
 */
export const errSecInvalidTupleGroup = -67850;

/**
 * Security error: Invalid base ACLs.
 */
export const errSecInvalidBaseACLs = -67851;

/**
 * Security error: Invalid tuple credentials.
 */
export const errSecInvalidTupleCredentials = -67852;

/**
 * Security error: Invalid tuple credentials.
 */
export const errSecInvalidTupleCredendtials = errSecInvalidTupleCredentials;

/**
 * Security error: Invalid encoding.
 */
export const errSecInvalidEncoding = -67853;

/**
 * Security error: Invalid validity period.
 */
export const errSecInvalidValidityPeriod = -67854;

/**
 * Security error: Invalid requestor.
 */
export const errSecInvalidRequestor = -67855;

/**
 * Security error: Request descriptor.
 */
export const errSecRequestDescriptor = -67856;

/**
 * Security error: Invalid bundle info.
 */
export const errSecInvalidBundleInfo = -67857;

/**
 * Security error: Invalid CRL index.
 */
export const errSecInvalidCRLIndex = -67858;

/**
 * Security error: No field values.
 */
export const errSecNoFieldValues = -67859;

/**
 * Security error: Unsupported field format.
 */
export const errSecUnsupportedFieldFormat = -67860;

/**
 * Security error: Unsupported index info.
 */
export const errSecUnsupportedIndexInfo = -67861;

/**
 * Security error: Unsupported locality.
 */
export const errSecUnsupportedLocality = -67862;

/**
 * Security error: Unsupported number of attributes.
 */
export const errSecUnsupportedNumAttributes = -67863;

/**
 * Security error: Unsupported number of indexes.
 */
export const errSecUnsupportedNumIndexes = -67864;

/**
 * Security error: Unsupported number of record types.
 */
export const errSecUnsupportedNumRecordTypes = -67865;

/**
 * Security error: Field specified multiple times.
 */
export const errSecFieldSpecifiedMultiple = -67866;

/**
 * Security error: Incompatible field format.
 */
export const errSecIncompatibleFieldFormat = -67867;

/**
 * Security error: Invalid parsing module.
 */
export const errSecInvalidParsingModule = -67868;

/**
 * Security error: Database locked.
 */
export const errSecDatabaseLocked = -67869;

/**
 * Security error: Datastore is open.
 */
export const errSecDatastoreIsOpen = -67870;

/**
 * Security error: Missing value.
 */
export const errSecMissingValue = -67871;

/**
 * Security error: Unsupported query limits.
 */
export const errSecUnsupportedQueryLimits = -67872;

/**
 * Security error: Unsupported number of selection predicates.
 */
export const errSecUnsupportedNumSelectionPreds = -67873;

/**
 * Security error: Unsupported operator.
 */
export const errSecUnsupportedOperator = -67874;

/**
 * Security error: Invalid database location.
 */
export const errSecInvalidDBLocation = -67875;

/**
 * Security error: Invalid access request.
 */
export const errSecInvalidAccessRequest = -67876;

/**
 * Security error: Invalid index info.
 */
export const errSecInvalidIndexInfo = -67877;

/**
 * Security error: Invalid new owner.
 */
export const errSecInvalidNewOwner = -67878;

/**
 * Security error: Invalid modify mode.
 */
export const errSecInvalidModifyMode = -67879;

/**
 * Security error: Missing required extension.
 */
export const errSecMissingRequiredExtension = -67880;

/**
 * Security error: Extended key usage not critical.
 */
export const errSecExtendedKeyUsageNotCritical = -67881;

/**
 * Security error: Timestamp missing.
 */
export const errSecTimestampMissing = -67882;

/**
 * Security error: Timestamp invalid.
 */
export const errSecTimestampInvalid = -67883;

/**
 * Security error: Timestamp not trusted.
 */
export const errSecTimestampNotTrusted = -67884;

/**
 * Security error: Timestamp service not available.
 */
export const errSecTimestampServiceNotAvailable = -67885;

/**
 * Security error: Timestamp bad algorithm.
 */
export const errSecTimestampBadAlg = -67886;

/**
 * Security error: Timestamp bad request.
 */
export const errSecTimestampBadRequest = -67887;

/**
 * Security error: Timestamp bad data format.
 */
export const errSecTimestampBadDataFormat = -67888;

/**
 * Security error: Timestamp time not available.
 */
export const errSecTimestampTimeNotAvailable = -67889;

/**
 * Security error: Timestamp unaccepted policy.
 */
export const errSecTimestampUnacceptedPolicy = -67890;

/**
 * Security error: Timestamp unaccepted extension.
 */
export const errSecTimestampUnacceptedExtension = -67891;

/**
 * Security error: Timestamp add info not available.
 */
export const errSecTimestampAddInfoNotAvailable = -67892;

/**
 * Security error: Timestamp system failure.
 */
export const errSecTimestampSystemFailure = -67893;

/**
 * Security error: Signing time missing.
 */
export const errSecSigningTimeMissing = -67894;

/**
 * Security error: Timestamp rejection.
 */
export const errSecTimestampRejection = -67895;

/**
 * Security error: Timestamp waiting.
 */
export const errSecTimestampWaiting = -67896;

/**
 * Security error: Timestamp revocation warning.
 */
export const errSecTimestampRevocationWarning = -67897;

/**
 * Security error: Timestamp revocation notification.
 */
export const errSecTimestampRevocationNotification = -67898;

/**
 * Security error: Certificate policy not allowed.
 */
export const errSecCertificatePolicyNotAllowed = -67899;

/**
 * Security error: Certificate name not allowed.
 */
export const errSecCertificateNameNotAllowed = -67900;

/**
 * Security error: Certificate validity period too long.
 */
export const errSecCertificateValidityPeriodTooLong = -67901;

/**
 * Security error: Certificate is CA.
 */
export const errSecCertificateIsCA = -67902;

/**
 * Security error: Certificate duplicate extension.
 */
export const errSecCertificateDuplicateExtension = -67903;

/**
 * Security error: Missing qualified cert statement.
 */
export const errSecMissingQualifiedCertStatement = -67904;

// }

// SecureTransport Error Codes:
// CF_ENUM(OSStatus) {

/**
 * SSL error: Protocol.
 */
export const errSSLProtocol = -9800;

/**
 * SSL error: Negotiation.
 */
export const errSSLNegotiation = -9801;

/**
 * SSL error: Fatal alert.
 */
export const errSSLFatalAlert = -9802;

/**
 * SSL error: Would block.
 */
export const errSSLWouldBlock = -9803;

/**
 * SSL error: Session not found.
 */
export const errSSLSessionNotFound = -9804;

/**
 * SSL error: Closed gracefully.
 */
export const errSSLClosedGraceful = -9805;

/**
 * SSL error: Closed abort.
 */
export const errSSLClosedAbort = -9806;

/**
 * SSL error: Certificate chain invalid.
 */
export const errSSLXCertChainInvalid = -9807;

/**
 * SSL error: Bad certificate.
 */
export const errSSLBadCert = -9808;

/**
 * SSL error: Crypto.
 */
export const errSSLCrypto = -9809;

/**
 * SSL error: Internal.
 */
export const errSSLInternal = -9810;

/**
 * SSL error: Module attach.
 */
export const errSSLModuleAttach = -9811;

/**
 * SSL error: Unknown root cert.
 */
export const errSSLUnknownRootCert = -9812;

/**
 * SSL error: No root cert.
 */
export const errSSLNoRootCert = -9813;

/**
 * SSL error: Cert expired.
 */
export const errSSLCertExpired = -9814;

/**
 * SSL error: Cert not yet valid.
 */
export const errSSLCertNotYetValid = -9815;

/**
 * SSL error: Closed no notify.
 */
export const errSSLClosedNoNotify = -9816;

/**
 * SSL error: Buffer overflow.
 */
export const errSSLBufferOverflow = -9817;

/**
 * SSL error: Bad cipher suite.
 */
export const errSSLBadCipherSuite = -9818;

/**
 * SSL error: Peer unexpected message.
 */
export const errSSLPeerUnexpectedMsg = -9819;

/**
 * SSL error: Peer bad record MAC.
 */
export const errSSLPeerBadRecordMac = -9820;

/**
 * SSL error: Peer decryption fail.
 */
export const errSSLPeerDecryptionFail = -9821;

/**
 * SSL error: Peer record overflow.
 */
export const errSSLPeerRecordOverflow = -9822;

/**
 * SSL error: Peer decompression fail.
 */
export const errSSLPeerDecompressFail = -9823;

/**
 * SSL error: Peer handshake fail.
 */
export const errSSLPeerHandshakeFail = -9824;

/**
 * SSL error: Peer bad certificate.
 */
export const errSSLPeerBadCert = -9825;

/**
 * SSL error: Peer unsupported cert.
 */
export const errSSLPeerUnsupportedCert = -9826;

/**
 * SSL error: Peer cert revoked.
 */
export const errSSLPeerCertRevoked = -9827;

/**
 * SSL error: Peer cert expired.
 */
export const errSSLPeerCertExpired = -9828;

/**
 * SSL error: Peer cert unknown.
 */
export const errSSLPeerCertUnknown = -9829;

/**
 * SSL error: Illegal param.
 */
export const errSSLIllegalParam = -9830;

/**
 * SSL error: Peer unknown CA.
 */
export const errSSLPeerUnknownCA = -9831;

/**
 * SSL error: Peer access denied.
 */
export const errSSLPeerAccessDenied = -9832;

/**
 * SSL error: Peer decode error.
 */
export const errSSLPeerDecodeError = -9833;

/**
 * SSL error: Peer decrypt error.
 */
export const errSSLPeerDecryptError = -9834;

/**
 * SSL error: Peer export restriction.
 */
export const errSSLPeerExportRestriction = -9835;

/**
 * SSL error: Peer protocol version.
 */
export const errSSLPeerProtocolVersion = -9836;

/**
 * SSL error: Peer insufficient security.
 */
export const errSSLPeerInsufficientSecurity = -9837;

/**
 * SSL error: Peer internal error.
 */
export const errSSLPeerInternalError = -9838;

/**
 * SSL error: Peer user cancelled.
 */
export const errSSLPeerUserCancelled = -9839;

/**
 * SSL error: Peer no renegotiation.
 */
export const errSSLPeerNoRenegotiation = -9840;

/**
 * SSL error: Peer auth completed.
 */
export const errSSLPeerAuthCompleted = -9841;

/**
 * SSL error: Client cert requested.
 */
export const errSSLClientCertRequested = -9842;

/**
 * SSL error: Host name mismatch.
 */
export const errSSLHostNameMismatch = -9843;

/**
 * SSL error: Connection refused.
 */
export const errSSLConnectionRefused = -9844;

/**
 * SSL error: Decryption fail.
 */
export const errSSLDecryptionFail = -9845;

/**
 * SSL error: Bad record MAC.
 */
export const errSSLBadRecordMac = -9846;

/**
 * SSL error: Record overflow.
 */
export const errSSLRecordOverflow = -9847;

/**
 * SSL error: Bad configuration.
 */
export const errSSLBadConfiguration = -9848;

/**
 * SSL error: Unexpected record.
 */
export const errSSLUnexpectedRecord = -9849;

/**
 * SSL error: Weak peer ephemeral DH key.
 */
export const errSSLWeakPeerEphemeralDHKey = -9850;

/**
 * SSL error: Client hello received.
 */
export const errSSLClientHelloReceived = -9851;

/**
 * SSL error: Transport reset.
 */
export const errSSLTransportReset = -9852;

/**
 * SSL error: Network timeout.
 */
export const errSSLNetworkTimeout = -9853;

/**
 * SSL error: Configuration failed.
 */
export const errSSLConfigurationFailed = -9854;

/**
 * SSL error: Unsupported extension.
 */
export const errSSLUnsupportedExtension = -9855;

/**
 * SSL error: Unexpected message.
 */
export const errSSLUnexpectedMessage = -9856;

/**
 * SSL error: Decompression fail.
 */
export const errSSLDecompressFail = -9857;

/**
 * SSL error: Handshake fail.
 */
export const errSSLHandshakeFail = -9858;

/**
 * SSL error: Decode error.
 */
export const errSSLDecodeError = -9859;

/**
 * SSL error: Inappropriate fallback.
 */
export const errSSLInappropriateFallback = -9860;

/**
 * SSL error: Missing extension.
 */
export const errSSLMissingExtension = -9861;

/**
 * SSL error: Bad certificate status response.
 */
export const errSSLBadCertificateStatusResponse = -9862;

/**
 * SSL error: Certificate required.
 */
export const errSSLCertificateRequired = -9863;

/**
 * SSL error: Unknown PSK identity.
 */
export const errSSLUnknownPSKIdentity = -9864;

/**
 * SSL error: Unrecognized name.
 */
export const errSSLUnrecognizedName = -9865;

/**
 * SSL error: ATS violation.
 */
export const errSSLATSViolation = -9880;

/**
 * SSL error: ATS minimum version violation.
 */
export const errSSLATSMinimumVersionViolation = -9881;

/**
 * SSL error: ATS ciphersuite violation.
 */
export const errSSLATSCiphersuiteViolation = -9882;

/**
 * SSL error: ATS minimum key size violation.
 */
export const errSSLATSMinimumKeySizeViolation = -9883;

/**
 * SSL error: ATS leaf certificate hash algorithm violation.
 */
export const errSSLATSLeafCertificateHashAlgorithmViolation = -9884;

/**
 * SSL error: ATS certificate hash algorithm violation.
 */
export const errSSLATSCertificateHashAlgorithmViolation = -9885;

/**
 * SSL error: ATS certificate trust violation.
 */
export const errSSLATSCertificateTrustViolation = -9886;

/**
 * SSL error: Early data rejected.
 */
export const errSSLEarlyDataRejected = -9890;

// }
