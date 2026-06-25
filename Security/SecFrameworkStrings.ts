// deno-lint-ignore-file prefer-ascii
import {
	SecFrameworkCopyLocalizedString,
	SecStringWithDefaultValue,
} from './SecFramework.ts';

/**
 * Copy cert string.
 *
 * @param KEY Key.
 * @returns String.
 */
export const SecCopyCertString = (
	KEY: string,
): string => SecFrameworkCopyLocalizedString(KEY, 'Certificate');

/**
 * Copy CK string.
 *
 * @param KEY Key.
 * @returns String.
 */
export const SecCopyCKString = (
	KEY: string,
): string => SecFrameworkCopyLocalizedString(KEY, 'CloudKeychain');

/**
 * SEC_NULL_KEY.
 */
export const SEC_NULL_KEY: string = SecStringWithDefaultValue(
	'<NULL>',
	'Certificate',
	0,
	'<NULL>',
	'Value of a field if its length is 0',
);

/**
 * SEC_OID_TOO_LONG_KEY.
 */
export const SEC_OID_TOO_LONG_KEY: string = SecStringWithDefaultValue(
	'OID too long',
	'Certificate',
	0,
	'OID too long',
	'value of an OID field if its length is more than what we allow for OIDs',
);

/**
 * SEC_UNPARSED_KEY.
 */
export const SEC_UNPARSED_KEY: string = SecStringWithDefaultValue(
	'Unparsed %@',
	'Certificate',
	0,
	'Unparsed %@',
	'Label of a value is printed into this string if the data can not been parsed according to its type',
);

/**
 * SEC_INVALID_KEY.
 */
export const SEC_INVALID_KEY: string = SecStringWithDefaultValue(
	'Invalid %@',
	'Certificate',
	0,
	'Invalid %@',
	'Label of a value is printed into this string if the data is not valid',
);

/**
 * SEC_ALGORITHM_KEY.
 */
export const SEC_ALGORITHM_KEY: string = SecStringWithDefaultValue(
	'Algorithm',
	'Certificate',
	0,
	'Algorithm',
	'Label of the algorithm sub-field of an AlgorithmIdentifier',
);

/**
 * SEC_PARAMETERS_KEY.
 */
export const SEC_PARAMETERS_KEY: string = SecStringWithDefaultValue(
	'Parameters',
	'Certificate',
	0,
	'Parameters',
	'Label of the parameters sub-field of an AlgorithmIdentifier',
);

/**
 * SEC_NONE_KEY.
 */
export const SEC_NONE_KEY: string = SecStringWithDefaultValue(
	'none',
	'Certificate',
	0,
	'none',
	'field value of parameters field when no parameters are present',
);

/**
 * SEC_BLOB_KEY.
 */
export const SEC_BLOB_KEY: string = SecStringWithDefaultValue(
	'%@; %d %@; data = %@',
	'Certificate',
	0,
	'%@; %d %@; data = %@',
	'Format string for encoded field data (e.g. Sequence; 128 bytes; data = 00 00 ...)',
);

/**
 * SEC_BYTE_STRING_KEY.
 */
export const SEC_BYTE_STRING_KEY: string = SecStringWithDefaultValue(
	'Byte string',
	'Certificate',
	0,
	'Byte string',
	'First argument to SEC_BLOB_KEY format string for a Byte string',
);

/**
 * SEC_BYTES_KEY.
 */
export const SEC_BYTES_KEY: string = SecStringWithDefaultValue(
	'bytes',
	'Certificate',
	0,
	'bytes',
	'Third argument to SEC_BLOB_KEY format string for a byte string',
);

/**
 * SEC_BIT_STRING_KEY.
 */
export const SEC_BIT_STRING_KEY: string = SecStringWithDefaultValue(
	'Bit string',
	'Certificate',
	0,
	'Bit string',
	'First argument to SEC_BLOB_KEY format string for a bit string',
);

/**
 * SEC_BITS_KEY.
 */
export const SEC_BITS_KEY: string = SecStringWithDefaultValue(
	'bits',
	'Certificate',
	0,
	'bits',
	'',
);

/**
 * SEC_SEQUENCE_KEY.
 */
export const SEC_SEQUENCE_KEY: string = SecStringWithDefaultValue(
	'Sequence',
	'Certificate',
	0,
	'Sequence',
	'First argument to SEC_BLOB_KEY format string for a Sequence',
);

/**
 * SEC_SET_KEY.
 */
export const SEC_SET_KEY: string = SecStringWithDefaultValue(
	'Set',
	'Certificate',
	0,
	'Set',
	'First argument to SEC_BLOB_KEY format string for a Set',
);

/**
 * SEC_NOT_DISPLAYED_KEY.
 */
export const SEC_NOT_DISPLAYED_KEY: string = SecStringWithDefaultValue(
	'not displayed (tag = %ld; length %ld)',
	'Certificate',
	0,
	'not displayed (tag = %ld; length %ld)',
	'format string for undisplayed field data with a given DER tag and length',
);

/**
 * SEC_RDN_KEY.
 */
export const SEC_RDN_KEY: string = SecStringWithDefaultValue(
	'RDN',
	'Certificate',
	0,
	'RDN',
	'Label of a RDN',
);

/**
 * SEC_X501_NAME_KEY.
 */
export const SEC_X501_NAME_KEY: string = SecStringWithDefaultValue(
	'X.501 Name',
	'Certificate',
	0,
	'X.501 Name',
	'Label of a X.501 Name',
);

/**
 * SEC_YES_KEY.
 */
export const SEC_YES_KEY: string = SecStringWithDefaultValue(
	'Yes',
	'Certificate',
	0,
	'Yes',
	"Value for a boolean property when it's value is true (example critical: yes)",
);

/**
 * SEC_NO_KEY.
 */
export const SEC_NO_KEY: string = SecStringWithDefaultValue(
	'No',
	'Certificate',
	0,
	'No',
	"Value for a boolean property when it's value is false (example critical: no)",
);

/**
 * SEC_STRING_LIST_KEY.
 */
export const SEC_STRING_LIST_KEY: string = SecStringWithDefaultValue(
	'%@, %@',
	'Certificate',
	0,
	'%@, %@',
	'Format string used to build a list of values, first argument is list second argument is to be appended element',
);

/**
 * SEC_DIGITAL_SIGNATURE_KEY.
 */
export const SEC_DIGITAL_SIGNATURE_KEY: string = SecStringWithDefaultValue(
	'Digital Signature',
	'Certificate',
	0,
	'Digital Signature',
	'X.509 key usage bit-field name',
);

/**
 * SEC_NON_REPUDIATION_KEY.
 */
export const SEC_NON_REPUDIATION_KEY: string = SecStringWithDefaultValue(
	'Non-Repudiation',
	'Certificate',
	0,
	'Non-Repudiation',
	'X.509 key usage bit-field name',
);

/**
 * SEC_KEY_ENCIPHERMENT_KEY.
 */
export const SEC_KEY_ENCIPHERMENT_KEY: string = SecStringWithDefaultValue(
	'Key Encipherment',
	'Certificate',
	0,
	'Key Encipherment',
	'X.509 key usage bit-field name',
);

/**
 * SEC_DATA_ENCIPHERMENT_KEY.
 */
export const SEC_DATA_ENCIPHERMENT_KEY: string = SecStringWithDefaultValue(
	'Data Encipherment',
	'Certificate',
	0,
	'Data Encipherment',
	'X.509 key usage bit-field name',
);

/**
 * SEC_KEY_AGREEMENT_KEY.
 */
export const SEC_KEY_AGREEMENT_KEY: string = SecStringWithDefaultValue(
	'Key Agreement',
	'Certificate',
	0,
	'Key Agreement',
	'X.509 key usage bit-field name',
);

/**
 * SEC_CERT_SIGN_KEY.
 */
export const SEC_CERT_SIGN_KEY: string = SecStringWithDefaultValue(
	'Cert Sign',
	'Certificate',
	0,
	'Cert Sign',
	'X.509 key usage bit-field name',
);

/**
 * SEC_CRL_SIGN_KEY.
 */
export const SEC_CRL_SIGN_KEY: string = SecStringWithDefaultValue(
	'CRL Sign',
	'Certificate',
	0,
	'CRL Sign',
	'X.509 key usage bit-field name',
);

/**
 * SEC_ENCIPHER_ONLY_KEY.
 */
export const SEC_ENCIPHER_ONLY_KEY: string = SecStringWithDefaultValue(
	'Encipher Only',
	'Certificate',
	0,
	'Encipher Only',
	'X.509 key usage bit-field name',
);

/**
 * SEC_DECIPHER_ONLY_KEY.
 */
export const SEC_DECIPHER_ONLY_KEY: string = SecStringWithDefaultValue(
	'Decipher Only',
	'Certificate',
	0,
	'Decipher Only',
	'X.509 key usage bit-field name',
);

/**
 * SEC_USAGE_KEY.
 */
export const SEC_USAGE_KEY: string = SecStringWithDefaultValue(
	'Usage',
	'Certificate',
	0,
	'Usage',
	'Label for Key Usage bit-field values',
);

/**
 * SEC_NOT_VALID_BEFORE_KEY.
 */
export const SEC_NOT_VALID_BEFORE_KEY: string = SecStringWithDefaultValue(
	'Not Valid Before',
	'Certificate',
	0,
	'Not Valid Before',
	'label indicating the soonest date at which something is valid',
);

/**
 * SEC_NOT_VALID_AFTER_KEY.
 */
export const SEC_NOT_VALID_AFTER_KEY: string = SecStringWithDefaultValue(
	'Not Valid After',
	'Certificate',
	0,
	'Not Valid After',
	'label indicating the date after which something is no longer valid',
);

/**
 * SEC_VALIDITY_PERIOD_KEY.
 */
export const SEC_VALIDITY_PERIOD_KEY: string = SecStringWithDefaultValue(
	'Validity Period',
	'Certificate',
	0,
	'Validity Period',
	'',
);

/**
 * SEC_PRIVATE_KU_PERIOD_KEY.
 */
export const SEC_PRIVATE_KU_PERIOD_KEY: string = SecStringWithDefaultValue(
	'Private Key Usage Period',
	'Certificate',
	0,
	'Private Key Usage Period',
	'Label for an invalid private key usage period value',
);

/**
 * SEC_OTHER_NAME_KEY.
 */
export const SEC_OTHER_NAME_KEY: string = SecStringWithDefaultValue(
	'Other Name',
	'Certificate',
	0,
	'Other Name',
	'Label used for Other Name RDN when value is invalid',
);

/**
 * SEC_EMAIL_ADDRESS_KEY.
 */
export const SEC_EMAIL_ADDRESS_KEY: string = SecStringWithDefaultValue(
	'Email Address',
	'Certificate',
	0,
	'Email Address',
	'label for general name field value',
);

/**
 * SEC_DNS_NAME_KEY.
 */
export const SEC_DNS_NAME_KEY: string = SecStringWithDefaultValue(
	'DNS Name',
	'Certificate',
	0,
	'DNS Name',
	'label for general name field value',
);

/**
 * SEC_X400_ADDRESS_KEY.
 */
export const SEC_X400_ADDRESS_KEY: string = SecStringWithDefaultValue(
	'X.400 Address',
	'Certificate',
	0,
	'X.400 Address',
	'label for general name field value',
);

/**
 * SEC_DIRECTORY_NAME_KEY.
 */
export const SEC_DIRECTORY_NAME_KEY: string = SecStringWithDefaultValue(
	'Directory Name',
	'Certificate',
	0,
	'Directory Name',
	'label for general name field value',
);

/**
 * SEC_EDI_PARTY_NAME_KEY.
 */
export const SEC_EDI_PARTY_NAME_KEY: string = SecStringWithDefaultValue(
	'EDI Party Name',
	'Certificate',
	0,
	'EDI Party Name',
	'label for general name field value',
);

/**
 * SEC_URI_KEY.
 */
export const SEC_URI_KEY: string = SecStringWithDefaultValue(
	'URI',
	'Certificate',
	0,
	'URI',
	'label for general name field value',
);

/**
 * SEC_IP_ADDRESS_KEY.
 */
export const SEC_IP_ADDRESS_KEY: string = SecStringWithDefaultValue(
	'IP Address',
	'Certificate',
	0,
	'IP Address',
	'label for general name field value',
);

/**
 * SEC_REGISTERED_ID_KEY.
 */
export const SEC_REGISTERED_ID_KEY: string = SecStringWithDefaultValue(
	'Registered ID',
	'Certificate',
	0,
	'Registered ID',
	'label for general name field value',
);

/**
 * SEC_GENERAL_NAME_KEY.
 */
export const SEC_GENERAL_NAME_KEY: string = SecStringWithDefaultValue(
	'General Name',
	'Certificate',
	0,
	'General Name',
	'Label used for General Name entry when value is invalid',
);

/**
 * SEC_GENERAL_NAMES_KEY.
 */
export const SEC_GENERAL_NAMES_KEY: string = SecStringWithDefaultValue(
	'General Names',
	'Certificate',
	0,
	'General Names',
	'Label used for General Names when value is invalid',
);

/**
 * SEC_CERT_AUTHORITY_KEY.
 */
export const SEC_CERT_AUTHORITY_KEY: string = SecStringWithDefaultValue(
	'Certificate Authority',
	'Certificate',
	0,
	'Certificate Authority',
	'Label for boolean is_ca property of a basic constraints extension',
);

/**
 * SEC_PATH_LEN_CONSTRAINT_KEY.
 */
export const SEC_PATH_LEN_CONSTRAINT_KEY: string = SecStringWithDefaultValue(
	'Path Length Constraint',
	'Certificate',
	0,
	'Path Length Constraint',
	'Label for path length constraint property of a basic constraints extension',
);

/**
 * SEC_BASIC_CONSTRAINTS_KEY.
 */
export const SEC_BASIC_CONSTRAINTS_KEY: string = SecStringWithDefaultValue(
	'Basic Constraints',
	'Certificate',
	0,
	'Basic Constraints',
	'Label used for Basic Constraints when value is invalid',
);

/**
 * SEC_NAME_CONSTRAINTS_KEY.
 */
export const SEC_NAME_CONSTRAINTS_KEY: string = SecStringWithDefaultValue(
	'Name Constraints',
	'Certificate',
	0,
	'Name Constraints',
	'Label used for Name Constraints when value is invalid',
);

/**
 * SEC_PERMITTED_MINIMUM_KEY.
 */
export const SEC_PERMITTED_MINIMUM_KEY: string = SecStringWithDefaultValue(
	'Permitted Subtree Minimum',
	'Certificate',
	0,
	'Permitted Subtree Minimum',
	'Label for minimum base distance property of a permitted subtree in name constraints extension.',
);

/**
 * SEC_PERMITTED_MAXIMUM_KEY.
 */
export const SEC_PERMITTED_MAXIMUM_KEY: string = SecStringWithDefaultValue(
	'Permitted Subtree Maximum',
	'Certificate',
	0,
	'Permitted Subtree Maximum',
	'Label for maximum base distance property of a permitted subtree in name constraints extension.',
);

/**
 * SEC_PERMITTED_NAME_KEY.
 */
export const SEC_PERMITTED_NAME_KEY: string = SecStringWithDefaultValue(
	'Permitted Subtree General Name',
	'Certificate',
	0,
	'Permitted Subtree General Name',
	'Label for general name of a permitted subtree in name constraints extension.',
);

/**
 * SEC_EXCLUDED_MINIMUM_KEY.
 */
export const SEC_EXCLUDED_MINIMUM_KEY: string = SecStringWithDefaultValue(
	'Excluded Subtree Minimum',
	'Certificate',
	0,
	'Excluded Subtree Minimum',
	'Label for minimum base distance property of an excluded subtree in name constraints extension.',
);

/**
 * SEC_EXCLUDED_MAXIMUM_KEY.
 */
export const SEC_EXCLUDED_MAXIMUM_KEY: string = SecStringWithDefaultValue(
	'Excluded Subtree Maximum',
	'Certificate',
	0,
	'Excluded Subtree Maximum',
	'Label for maximum base distance property of an excluded subtree in name constraints extension.',
);

/**
 * SEC_EXCLUDED_NAME_KEY.
 */
export const SEC_EXCLUDED_NAME_KEY: string = SecStringWithDefaultValue(
	'Excluded Subtree General Name',
	'Certificate',
	0,
	'Excluded Subtree General Name',
	'Label for general name of an excluded subtree in name constraints extension.',
);

/**
 * SEC_NAME_REL_CRL_ISSUER_KEY.
 */
export const SEC_NAME_REL_CRL_ISSUER_KEY: string = SecStringWithDefaultValue(
	'Name Relative To CRL Issuer',
	'Certificate',
	0,
	'Name Relative To CRL Issuer',
	'Subsection label in CRL Distribution Points extension.',
);

/**
 * SEC_UNUSED_KEY.
 */
export const SEC_UNUSED_KEY: string = SecStringWithDefaultValue(
	'Unused',
	'Certificate',
	0,
	'Unused',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_KEY_COMPROMISE_KEY.
 */
export const SEC_KEY_COMPROMISE_KEY: string = SecStringWithDefaultValue(
	'Key Compromise',
	'Certificate',
	0,
	'Key Compromise',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_CA_COMPROMISE_KEY.
 */
export const SEC_CA_COMPROMISE_KEY: string = SecStringWithDefaultValue(
	'CA Compromise',
	'Certificate',
	0,
	'CA Compromise',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_AFFILIATION_CHANGED_KEY.
 */
export const SEC_AFFILIATION_CHANGED_KEY: string = SecStringWithDefaultValue(
	'Affiliation Changed',
	'Certificate',
	0,
	'Affiliation Changed',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_SUPERSEDED_KEY.
 */
export const SEC_SUPERSEDED_KEY: string = SecStringWithDefaultValue(
	'Superseded',
	'Certificate',
	0,
	'Superseded',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_CESSATION_OF_OPER_KEY.
 */
export const SEC_CESSATION_OF_OPER_KEY: string = SecStringWithDefaultValue(
	'Cessation Of Operation',
	'Certificate',
	0,
	'Cessation Of Operation',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_CERTIFICATE_HOLD_KEY.
 */
export const SEC_CERTIFICATE_HOLD_KEY: string = SecStringWithDefaultValue(
	'Certificate Hold',
	'Certificate',
	0,
	'Certificate Hold',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_PRIV_WITHDRAWN_KEY.
 */
export const SEC_PRIV_WITHDRAWN_KEY: string = SecStringWithDefaultValue(
	'Privilege Withdrawn',
	'Certificate',
	0,
	'Privilege Withdrawn',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_AA_COMPROMISE_KEY.
 */
export const SEC_AA_COMPROMISE_KEY: string = SecStringWithDefaultValue(
	'AA Compromise',
	'Certificate',
	0,
	'AA Compromise',
	'CRL Distribution Points extension supported reason name',
);

/**
 * SEC_REASONS_KEY.
 */
export const SEC_REASONS_KEY: string = SecStringWithDefaultValue(
	'Reasons',
	'Certificate',
	0,
	'Reasons',
	'CRL Distribution Points extension supported reasons bit-field label',
);

/**
 * SEC_CRL_ISSUER_KEY.
 */
export const SEC_CRL_ISSUER_KEY: string = SecStringWithDefaultValue(
	'CRL Issuer',
	'Certificate',
	0,
	'CRL Issuer',
	'Label for CRL issuer field of CRL Distribution Points extension',
);

/**
 * SEC_CRL_DISTR_POINTS_KEY.
 */
export const SEC_CRL_DISTR_POINTS_KEY: string = SecStringWithDefaultValue(
	'CRL Distribution Points',
	'Certificate',
	0,
	'CRL Distribution Points',
	'CRL Distribution Points extension label',
);

/**
 * SEC_POLICY_IDENTIFIER_KEY.
 */
export const SEC_POLICY_IDENTIFIER_KEY: string = SecStringWithDefaultValue(
	'Policy Identifier #%d',
	'Certificate',
	0,
	'Policy Identifier #%d',
	'Format string for label of field in Certificate Policies extension, %d is a monotonic increasing counter starting at 1',
);

/**
 * SEC_POLICY_QUALIFIER_KEY.
 */
export const SEC_POLICY_QUALIFIER_KEY: string = SecStringWithDefaultValue(
	'Policy Qualifier #%d',
	'Certificate',
	0,
	'Policy Qualifier #%d',
	'Format string for label of field in Certificate Policies extension, %d is a monotonic increasing counter starting at 1',
);

/**
 * SEC_CPS_URI_KEY.
 */
export const SEC_CPS_URI_KEY: string = SecStringWithDefaultValue(
	'CPS URI',
	'Certificate',
	0,
	'CPS URI',
	'Label of field in Certificate Policies extension',
);

/**
 * SEC_ORGANIZATION_KEY.
 */
export const SEC_ORGANIZATION_KEY: string = SecStringWithDefaultValue(
	'Organization',
	'Certificate',
	0,
	'Organization',
	'Label of field in Certificate Policies extension',
);

/**
 * SEC_NOTICE_NUMBERS_KEY.
 */
export const SEC_NOTICE_NUMBERS_KEY: string = SecStringWithDefaultValue(
	'Notice Numbers',
	'Certificate',
	0,
	'Notice Numbers',
	'Label of field in Certificate Policies extension',
);

/**
 * SEC_EXPLICIT_TEXT_KEY.
 */
export const SEC_EXPLICIT_TEXT_KEY: string = SecStringWithDefaultValue(
	'Explicit Text',
	'Certificate',
	0,
	'Explicit Text',
	'Label of field in Certificate Policies extension',
);

/**
 * SEC_QUALIFIER_KEY.
 */
export const SEC_QUALIFIER_KEY: string = SecStringWithDefaultValue(
	'Qualifier',
	'Certificate',
	0,
	'Qualifier',
	'Label of field in Certificate Policies extension',
);

/**
 * SEC_CERT_POLICIES_KEY.
 */
export const SEC_CERT_POLICIES_KEY: string = SecStringWithDefaultValue(
	'Certificate Policies',
	'Certificate',
	0,
	'Certificate Policies',
	'Certificate Policies extension label',
);

/**
 * SEC_KEY_IDENTIFIER_KEY.
 */
export const SEC_KEY_IDENTIFIER_KEY: string = SecStringWithDefaultValue(
	'Key Identifier',
	'Certificate',
	0,
	'Key Identifier',
	'Label of field in Subject or Authority Key Identifier extension',
);

/**
 * SEC_SUBJ_KEY_ID_KEY.
 */
export const SEC_SUBJ_KEY_ID_KEY: string = SecStringWithDefaultValue(
	'Subject Key Identifier',
	'Certificate',
	0,
	'Subject Key Identifier',
	'Subject Key Identifier extension label',
);

/**
 * SEC_AUTH_CERT_SERIAL_KEY.
 */
export const SEC_AUTH_CERT_SERIAL_KEY: string = SecStringWithDefaultValue(
	'Authority Certificate Serial Number',
	'Certificate',
	0,
	'Authority Certificate Serial Number',
	'Label of field in Authority Key Identifier extension',
);

/**
 * SEC_AUTHORITY_KEY_ID_KEY.
 */
export const SEC_AUTHORITY_KEY_ID_KEY: string = SecStringWithDefaultValue(
	'Authority Key Identifier',
	'Certificate',
	0,
	'Authority Key Identifier',
	'Authority Key Identifier extension label',
);

/**
 * SEC_REQUIRE_EXPL_POLICY_KEY.
 */
export const SEC_REQUIRE_EXPL_POLICY_KEY: string = SecStringWithDefaultValue(
	'Require Explicit Policy',
	'Certificate',
	0,
	'Require Explicit Policy',
	'Label of field in policy constraints extension',
);

/**
 * SEC_INHIBIT_POLICY_MAP_KEY.
 */
export const SEC_INHIBIT_POLICY_MAP_KEY: string = SecStringWithDefaultValue(
	'Inhibit Policy Mapping',
	'Certificate',
	0,
	'Inhibit Policy Mapping',
	'Label of field in policy constraints extension',
);

/**
 * SEC_POLICY_CONSTRAINTS_KEY.
 */
export const SEC_POLICY_CONSTRAINTS_KEY: string = SecStringWithDefaultValue(
	'Policy Constraints',
	'Certificate',
	0,
	'Policy Constraints',
	'Policy constraints extension label',
);

/**
 * SEC_PURPOSE_KEY.
 */
export const SEC_PURPOSE_KEY: string = SecStringWithDefaultValue(
	'Purpose',
	'Certificate',
	0,
	'Purpose',
	'Label of field in extended key usage extension',
);

/**
 * SEC_EXTENDED_KEY_USAGE_KEY.
 */
export const SEC_EXTENDED_KEY_USAGE_KEY: string = SecStringWithDefaultValue(
	'Extended Key Usage',
	'Certificate',
	0,
	'Extended Key Usage',
	'Extended key usage extension label',
);

/**
 * SEC_ACCESS_METHOD_KEY.
 */
export const SEC_ACCESS_METHOD_KEY: string = SecStringWithDefaultValue(
	'Access Method',
	'Certificate',
	0,
	'Access Method',
	'Label of field in authority info access extension',
);

/**
 * SEC_ACCESS_LOCATION_KEY.
 */
export const SEC_ACCESS_LOCATION_KEY: string = SecStringWithDefaultValue(
	'Access Location',
	'Certificate',
	0,
	'Access Location',
	'Label of field in authority info access extension',
);

/**
 * SEC_AUTH_INFO_ACCESS_KEY.
 */
export const SEC_AUTH_INFO_ACCESS_KEY: string = SecStringWithDefaultValue(
	'Authority Information Access',
	'Certificate',
	0,
	'Authority Information Access',
	'Authority info access extension label',
);

/**
 * SEC_QUAL_CERT_STATMENTS.
 */
export const SEC_QUAL_CERT_STATMENTS: string = SecStringWithDefaultValue(
	'Qualified Certificate Statements',
	'Certificate',
	0,
	'Qualified Certificate Statements',
	'Qualified Certificate Statements extension label',
);

/**
 * SEC_QCS_EU_COMPLIANCE.
 */
export const SEC_QCS_EU_COMPLIANCE: string = SecStringWithDefaultValue(
	'Qualified Certificate',
	'Certificate',
	0,
	'Qualified Certificate',
	'Label present in qcStatements extension: QCStatement claiming that the certificate is a EU qualified certificate or a certificate being qualified within a defined legal framework from an identified country or set of countries',
);

/**
 * SEC_QCS_TYPE.
 */
export const SEC_QCS_TYPE: string = SecStringWithDefaultValue(
	'Qualified Certificate Type',
	'Certificate',
	0,
	'Qualified Certificate Type',
	'Label present in qcStatements extension:QCStatement claiming that the certificate is a certificate of a particular type',
);

/**
 * SEC_QCS_TYPE_LIMIT_VALUE.
 */
export const SEC_QCS_TYPE_LIMIT_VALUE: string = SecStringWithDefaultValue(
	'Limit Value',
	'Certificate',
	0,
	'Limit Value',
	'Label present in qcStatements extension: Limit Value specifies a maximum monetary value',
);

/**
 * SEC_QCS_TYPE_RETENTION.
 */
export const SEC_QCS_TYPE_RETENTION: string = SecStringWithDefaultValue(
	'Retention Period',
	'Certificate',
	0,
	'Retention Period',
	'Label present in qcStatements extension: specifies how long to keep data',
);

/**
 * SEC_QCS_TYPE_PDS_LOCATION.
 */
export const SEC_QCS_TYPE_PDS_LOCATION: string = SecStringWithDefaultValue(
	'Disclosure Location',
	'Certificate',
	0,
	'Disclosure Location',
	'Label present in qcStatements extension: URL where disclosures can be found',
);

/**
 * SEC_QCS_TYPE_ESEAL.
 */
export const SEC_QCS_TYPE_ESEAL: string = SecStringWithDefaultValue(
	'Electronic Seal',
	'Certificate',
	0,
	'Electronic Seal',
	'Label present in qcStatements extension: can be used for an electronic seal',
);

/**
 * SEC_QCS_TYPE_ESIGNATURE.
 */
export const SEC_QCS_TYPE_ESIGNATURE: string = SecStringWithDefaultValue(
	'Electronic Signature',
	'Certificate',
	0,
	'Electronic Signature',
	'Label present in qcStatements extension: can be used for a signature',
);

/**
 * SEC_QCS_TYPE_WEB_AUTH.
 */
export const SEC_QCS_TYPE_WEB_AUTH: string = SecStringWithDefaultValue(
	'Web Authentication',
	'Certificate',
	0,
	'Web Authentication',
	'Label present in qcStatements extension: can be used for website authentication',
);

/**
 * SEC_SSL_CLIENT_KEY.
 */
export const SEC_SSL_CLIENT_KEY: string = SecStringWithDefaultValue(
	'SSL client',
	'Certificate',
	0,
	'SSL client',
	'Netscape certificate type usage value',
);

/**
 * SEC_SSL_SERVER_KEY.
 */
export const SEC_SSL_SERVER_KEY: string = SecStringWithDefaultValue(
	'SSL server',
	'Certificate',
	0,
	'SSL server',
	'Netscape certificate type usage value',
);

/**
 * SEC_SMIME_KEY.
 */
export const SEC_SMIME_KEY: string = SecStringWithDefaultValue(
	'S/MIME',
	'Certificate',
	0,
	'S/MIME',
	'Netscape certificate type usage value',
);

/**
 * SEC_OBJECT_SIGNING_KEY.
 */
export const SEC_OBJECT_SIGNING_KEY: string = SecStringWithDefaultValue(
	'Object Signing',
	'Certificate',
	0,
	'Object Signing',
	'Netscape certificate type usage value',
);

/**
 * SEC_RESERVED_KEY.
 */
export const SEC_RESERVED_KEY: string = SecStringWithDefaultValue(
	'Reserved',
	'Certificate',
	0,
	'Reserved',
	'Netscape certificate type usage value',
);

/**
 * SEC_SSL_CA_KEY.
 */
export const SEC_SSL_CA_KEY: string = SecStringWithDefaultValue(
	'SSL CA',
	'Certificate',
	0,
	'SSL CA',
	'Netscape certificate type usage value',
);

/**
 * SEC_SMIME_CA_KEY.
 */
export const SEC_SMIME_CA_KEY: string = SecStringWithDefaultValue(
	'S/MIME CA',
	'Certificate',
	0,
	'S/MIME CA',
	'Netscape certificate type usage value',
);

/**
 * SEC_OBJECT_SIGNING_CA_KEY.
 */
export const SEC_OBJECT_SIGNING_CA_KEY: string = SecStringWithDefaultValue(
	'Object Signing CA',
	'Certificate',
	0,
	'Object Signing CA',
	'Netscape certificate type usage value',
);

/**
 * SEC_CRITICAL_KEY.
 */
export const SEC_CRITICAL_KEY: string = SecStringWithDefaultValue(
	'Critical',
	'Certificate',
	0,
	'Critical',
	'Label of field in extension that indicates whether this extension is critical',
);

/**
 * SEC_DATA_KEY.
 */
export const SEC_DATA_KEY: string = SecStringWithDefaultValue(
	'Data',
	'Certificate',
	0,
	'Data',
	'Label for raw data of extension (used for unknown extensions)',
);

/**
 * SEC_COMMON_NAME_DESC_KEY.
 */
export const SEC_COMMON_NAME_DESC_KEY: string = SecStringWithDefaultValue(
	'%@ (%@)',
	'Certificate',
	0,
	'%@ (%@)',
	'If a X.500 name has a description and a common name we display Common Name (Description) using this format string',
);

/**
 * SEC_ISSUER_SUMMARY_KEY.
 */
export const SEC_ISSUER_SUMMARY_KEY: string = SecStringWithDefaultValue(
	'Issuer Summary',
	'Certificate',
	0,
	'Issuer Summary',
	'',
);

/**
 * SEC_ISSUED_BY_KEY.
 */
export const SEC_ISSUED_BY_KEY: string = SecStringWithDefaultValue(
	'Issued By',
	'Certificate',
	0,
	'Issued By',
	'',
);

/**
 * SEC_EXPIRED_KEY.
 */
export const SEC_EXPIRED_KEY: string = SecStringWithDefaultValue(
	'Expired',
	'Certificate',
	0,
	'Expired',
	'',
);

/**
 * SEC_CERT_EXPIRED_KEY.
 */
export const SEC_CERT_EXPIRED_KEY: string = SecStringWithDefaultValue(
	'This certificate has expired',
	'Certificate',
	0,
	'This certificate has expired',
	'',
);

/**
 * SEC_VALID_FROM_KEY.
 */
export const SEC_VALID_FROM_KEY: string = SecStringWithDefaultValue(
	'Valid from',
	'Certificate',
	0,
	'Valid from',
	'',
);

/**
 * SEC_CERT_NOT_YET_VALID_KEY.
 */
export const SEC_CERT_NOT_YET_VALID_KEY: string = SecStringWithDefaultValue(
	'This certificate is not yet valid',
	'Certificate',
	0,
	'This certificate is not yet valid',
	'',
);

/**
 * SEC_ISSUER_EXPIRED_KEY.
 */
export const SEC_ISSUER_EXPIRED_KEY: string = SecStringWithDefaultValue(
	'This certificate has an issuer that has expired',
	'Certificate',
	0,
	'This certificate has an issuer that has expired',
	'',
);

/**
 * SEC_ISSR_NOT_YET_VALID_KEY.
 */
export const SEC_ISSR_NOT_YET_VALID_KEY: string = SecStringWithDefaultValue(
	'This certificate has an issuer that is not yet valid',
	'Certificate',
	0,
	'This certificate has an issuer that is not yet valid',
	'',
);

/**
 * SEC_EXPIRES_KEY.
 */
export const SEC_EXPIRES_KEY: string = SecStringWithDefaultValue(
	'Expires',
	'Certificate',
	0,
	'Expires',
	'Label of expiration date value when certificate is temporally valid',
);

/**
 * SEC_CERT_VALID_KEY.
 */
export const SEC_CERT_VALID_KEY: string = SecStringWithDefaultValue(
	'This certificate is valid',
	'Certificate',
	0,
	'This certificate is valid',
	'The certificate is temporally valid',
);

/**
 * SEC_SUBJECT_NAME_KEY.
 */
export const SEC_SUBJECT_NAME_KEY: string = SecStringWithDefaultValue(
	'Subject Name',
	'Certificate',
	0,
	'Subject Name',
	'',
);

/**
 * SEC_ISSUER_NAME_KEY.
 */
export const SEC_ISSUER_NAME_KEY: string = SecStringWithDefaultValue(
	'Issuer Name',
	'Certificate',
	0,
	'Issuer Name',
	'',
);

/**
 * SEC_CERT_VERSION_VALUE_KEY.
 */
export const SEC_CERT_VERSION_VALUE_KEY: string = SecStringWithDefaultValue(
	'%d',
	'Certificate',
	0,
	'%d',
	'format string to turn version number into a string',
);

/**
 * SEC_VERSION_KEY.
 */
export const SEC_VERSION_KEY: string = SecStringWithDefaultValue(
	'Version',
	'Certificate',
	0,
	'Version',
	'',
);

/**
 * SEC_SERIAL_NUMBER_KEY.
 */
export const SEC_SERIAL_NUMBER_KEY: string = SecStringWithDefaultValue(
	'Serial Number',
	'Certificate',
	0,
	'Serial Number',
	'',
);

/**
 * SEC_SUBJECT_UNIQUE_ID_KEY.
 */
export const SEC_SUBJECT_UNIQUE_ID_KEY: string = SecStringWithDefaultValue(
	'Subject Unique ID',
	'Certificate',
	0,
	'Subject Unique ID',
	'',
);

/**
 * SEC_ISSUER_UNIQUE_ID_KEY.
 */
export const SEC_ISSUER_UNIQUE_ID_KEY: string = SecStringWithDefaultValue(
	'Issuer Unique ID',
	'Certificate',
	0,
	'Issuer Unique ID',
	'',
);

/**
 * SEC_PUBLIC_KEY_KEY.
 */
export const SEC_PUBLIC_KEY_KEY: string = SecStringWithDefaultValue(
	'Public Key Info',
	'Certificate',
	0,
	'Public Key Info',
	'',
);

/**
 * SEC_PUBLIC_KEY_ALG_KEY.
 */
export const SEC_PUBLIC_KEY_ALG_KEY: string = SecStringWithDefaultValue(
	'Public Key Algorithm',
	'Certificate',
	0,
	'Public Key Algorithm',
	'',
);

/**
 * SEC_PUBLIC_KEY_DATA_KEY.
 */
export const SEC_PUBLIC_KEY_DATA_KEY: string = SecStringWithDefaultValue(
	'Public Key Data',
	'Certificate',
	0,
	'Public Key Data',
	'',
);

/**
 * SEC_PUBLIC_KEY_SIZE_KEY.
 */
export const SEC_PUBLIC_KEY_SIZE_KEY: string = SecStringWithDefaultValue(
	'Public Key Size',
	'Certificate',
	0,
	'Public Key Size',
	'',
);

/**
 * SEC_SIGNATURE_KEY.
 */
export const SEC_SIGNATURE_KEY: string = SecStringWithDefaultValue(
	'Signature',
	'Certificate',
	0,
	'Signature',
	'',
);

/**
 * SEC_SIGNATURE_ALGORITHM_KEY.
 */
export const SEC_SIGNATURE_ALGORITHM_KEY: string = SecStringWithDefaultValue(
	'Signature Algorithm',
	'Certificate',
	0,
	'Signature Algorithm',
	'',
);

/**
 * SEC_SIGNATURE_DATA_KEY.
 */
export const SEC_SIGNATURE_DATA_KEY: string = SecStringWithDefaultValue(
	'Signature Data',
	'Certificate',
	0,
	'Signature Data',
	'',
);

/**
 * SEC_FINGERPRINTS_KEY.
 */
export const SEC_FINGERPRINTS_KEY: string = SecStringWithDefaultValue(
	'Fingerprints',
	'Certificate',
	0,
	'Fingerprints',
	'',
);

/**
 * SEC_SHA1_FINGERPRINT_KEY.
 */
export const SEC_SHA1_FINGERPRINT_KEY: string = SecStringWithDefaultValue(
	'SHA-1',
	'Certificate',
	0,
	'SHA-1',
	'',
);

/**
 * SEC_SHA2_FINGERPRINT_KEY.
 */
export const SEC_SHA2_FINGERPRINT_KEY: string = SecStringWithDefaultValue(
	'SHA-256',
	'Certificate',
	0,
	'SHA-256',
	'',
);

/**
 * SEC_CK_PASSWORD_INCORRECT.
 */
export const SEC_CK_PASSWORD_INCORRECT: string = SecStringWithDefaultValue(
	'Incorrect Password For “%@”',
	'CloudKeychain',
	0,
	'Incorrect Password For “%@”',
	'Title for alert when password has been entered incorrectly',
);

/**
 * SEC_CK_TRY_AGAIN.
 */
export const SEC_CK_TRY_AGAIN: string = SecStringWithDefaultValue(
	'Try Again',
	'CloudKeychain',
	0,
	'Try Again',
	'Button for try again after incorrect password',
);

/**
 * SEC_CK_ALLOW.
 */
export const SEC_CK_ALLOW: string = SecStringWithDefaultValue(
	'Allow',
	'CloudKeychain',
	0,
	'Allow',
	'Allow button',
);

/**
 * SEC_CK_DONT_ALLOW.
 */
export const SEC_CK_DONT_ALLOW: string = SecStringWithDefaultValue(
	'Don’t Allow',
	'CloudKeychain',
	0,
	'Don’t Allow',
	'Don’t Allow button',
);

/**
 * SEC_CK_ICLOUD_PASSWORD.
 */
export const SEC_CK_ICLOUD_PASSWORD: string = SecStringWithDefaultValue(
	'Password',
	'CloudKeychain',
	0,
	'password',
	'Password prompt text',
);

/**
 * SEC_CK_PWD_REQUIRED_TITLE.
 */
export const SEC_CK_PWD_REQUIRED_TITLE: string = SecStringWithDefaultValue(
	'Apple Account Password Required',
	'CloudKeychain',
	0,
	'Apple Account Password Required',
	'Title for alert when iCloud keychain was disabled or reset',
);

/**
 * SEC_CK_PWD_REQUIRED_BODY_OSX.
 */
export const SEC_CK_PWD_REQUIRED_BODY_OSX: string = SecStringWithDefaultValue(
	'Enter your password in Apple Account Preferences.',
	'CloudKeychain',
	0,
	'Enter your password in Apple Account Preferences.',
	'macOS alert text when iCloud keychain was disabled or reset',
);

/**
 * SEC_CK_PWD_REQUIRED_BODY_IOS.
 */
export const SEC_CK_PWD_REQUIRED_BODY_IOS: string = SecStringWithDefaultValue(
	'Enter your password in iCloud Settings.',
	'CloudKeychain',
	0,
	'Enter your password in iCloud Settings.',
	'iOS alert text when iCloud keychain was disabled or reset',
);

/**
 * SEC_CK_CR_REASON_INTERNAL.
 */
export const SEC_CK_CR_REASON_INTERNAL: string = SecStringWithDefaultValue(
	' (AppleInternal: departure reason %s)',
	'CloudKeychain',
	0,
	' (AppleInternal: departure reason %s)',
	'Display departure reason code on internal devices',
);

/**
 * SEC_CK_CONTINUE.
 */
export const SEC_CK_CONTINUE: string = SecStringWithDefaultValue(
	'Continue',
	'CloudKeychain',
	0,
	'Continue',
	'Button text to continue to iCloud settings (iOS)',
);

/**
 * SEC_CK_NOT_NOW.
 */
export const SEC_CK_NOT_NOW: string = SecStringWithDefaultValue(
	'Not Now',
	'CloudKeychain',
	0,
	'Not Now',
	'Button text to dismiss alert',
);

/**
 * SEC_CK_APPROVAL_TITLE.
 */
export const SEC_CK_APPROVAL_TITLE: string = SecStringWithDefaultValue(
	'Approve “%@”?',
	'CloudKeychain',
	0,
	'Approve “%@”?',
	'Title for alert when approving another device',
);

/**
 * SEC_CK_APPROVAL_BODY_OSX_IPAD.
 */
export const SEC_CK_APPROVAL_BODY_OSX_IPAD: string = SecStringWithDefaultValue(
	'This iPad wants to use your iCloud account.',
	'CloudKeychain',
	0,
	'This iPad wants to use your iCloud account.',
	'Body text when approving an iPad on Mac',
);

/**
 * SEC_CK_APPROVAL_BODY_OSX_IPHONE.
 */
export const SEC_CK_APPROVAL_BODY_OSX_IPHONE: string =
	SecStringWithDefaultValue(
		'This iPhone wants to use your iCloud account.',
		'CloudKeychain',
		0,
		'This iPhone wants to use your iCloud account.',
		'Body text when approving an iPhone on Mac',
	);

/**
 * SEC_CK_APPROVAL_BODY_OSX_IPOD.
 */
export const SEC_CK_APPROVAL_BODY_OSX_IPOD: string = SecStringWithDefaultValue(
	'This iPod wants to use your iCloud account.',
	'CloudKeychain',
	0,
	'This iPod wants to use your iCloud account.',
	'Body text when approving an iPod on Mac',
);

/**
 * SEC_CK_APPROVAL_BODY_OSX_MAC.
 */
export const SEC_CK_APPROVAL_BODY_OSX_MAC: string = SecStringWithDefaultValue(
	'This Mac wants to use your iCloud account.',
	'CloudKeychain',
	0,
	'This Mac wants to use your iCloud account.',
	'Body text when approving a Mac on Mac',
);

/**
 * SEC_CK_APPROVAL_BODY_OSX_GENERIC.
 */
export const SEC_CK_APPROVAL_BODY_OSX_GENERIC: string =
	SecStringWithDefaultValue(
		'This device wants to use your iCloud account.',
		'CloudKeychain',
		0,
		'This device wants to use your iCloud account.',
		'Body text when approving a device on Mac',
	);

/**
 * SEC_CK_APPROVE.
 */
export const SEC_CK_APPROVE: string = SecStringWithDefaultValue(
	'Approve',
	'CloudKeychain',
	0,
	'Approve',
	'Button text to approve iCloud sign in request',
);

/**
 * SEC_CK_DECLINE.
 */
export const SEC_CK_DECLINE: string = SecStringWithDefaultValue(
	'Decline',
	'CloudKeychain',
	0,
	'Decline',
	'Button text to decline iCloud sign in request',
);

/**
 * SEC_CK_APPROVAL_BODY_IOS_IPAD.
 */
export const SEC_CK_APPROVAL_BODY_IOS_IPAD: string = SecStringWithDefaultValue(
	'Enter the password for the Apple Account “%@” to allow this new iPad to use your iCloud account.',
	'CloudKeychain',
	0,
	'Enter the password for the Apple Account “%@” to allow this new iPad to use your iCloud account.',
	'Body text when approving an iPad',
);

/**
 * SEC_CK_APPROVAL_BODY_IOS_IPHONE.
 */
export const SEC_CK_APPROVAL_BODY_IOS_IPHONE: string =
	SecStringWithDefaultValue(
		'Enter the password for the Apple Account “%@” to allow this new iPhone to use your iCloud account.',
		'CloudKeychain',
		0,
		'Enter the password for the Apple Account “%@” to allow this new iPhone to use your iCloud account.',
		'Body text when approving an iPhone',
	);

/**
 * SEC_CK_APPROVAL_BODY_IOS_IPOD.
 */
export const SEC_CK_APPROVAL_BODY_IOS_IPOD: string = SecStringWithDefaultValue(
	'Enter the password for the Apple Account “%@” to allow this new iPod to use your iCloud account.',
	'CloudKeychain',
	0,
	'Enter the password for the Apple Account “%@” to allow this new iPod to use your iCloud account.',
	'Body text when approving an iPod',
);

/**
 * SEC_CK_APPROVAL_BODY_IOS_MAC.
 */
export const SEC_CK_APPROVAL_BODY_IOS_MAC: string = SecStringWithDefaultValue(
	'Enter the password for the Apple Account “%@” to allow this new Mac to use your iCloud account.',
	'CloudKeychain',
	0,
	'Enter the password for the Apple Account “%@” to allow this new Mac to use your iCloud account.',
	'Body text when approving another Mac',
);

/**
 * SEC_CK_APPROVAL_BODY_IOS_GENERIC.
 */
export const SEC_CK_APPROVAL_BODY_IOS_GENERIC: string =
	SecStringWithDefaultValue(
		'Enter the password for the Apple Account “%@” to allow this new device to use your iCloud account.',
		'CloudKeychain',
		0,
		'Enter the password for the Apple Account “%@” to allow this new device to use your iCloud account.',
		'Body text when approving another (generic) device',
	);

/**
 * SEC_CK_REMINDER_TITLE_OSX.
 */
export const SEC_CK_REMINDER_TITLE_OSX: string = SecStringWithDefaultValue(
	'iCloud Approval Required',
	'CloudKeychain',
	0,
	'iCloud Approval Required',
	'Title for reminder that iCloud Keychain Application (from this device) is still pending',
);

/**
 * SEC_CK_REMINDER_BODY_OSX.
 */
export const SEC_CK_REMINDER_BODY_OSX: string = SecStringWithDefaultValue(
	'This Mac is still waiting for approval by another device.',
	'CloudKeychain',
	0,
	'This Mac is still waiting for approval by another device.',
	'Body text for reminder that iCloud Keychain Application (from this device) is still pending',
);

/**
 * SEC_CK_REMINDER_TITLE_IOS.
 */
export const SEC_CK_REMINDER_TITLE_IOS: string = SecStringWithDefaultValue(
	'Approval Request Sent',
	'CloudKeychain',
	0,
	'Approval Request Sent',
	'Title for reminder that iCloud Keychain Application (from this device) is still pending',
);

/**
 * SEC_CK_REMINDER_BODY_IOS_IPAD.
 */
export const SEC_CK_REMINDER_BODY_IOS_IPAD: string = SecStringWithDefaultValue(
	'To continue using iCloud on this iPad, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
	'CloudKeychain',
	0,
	'To continue using iCloud on this iPad, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
	'Body of reminder text that the iCloud keychain application for this iPad is still pending',
);

/**
 * SEC_CK_REMINDER_BODY_IOS_IPHONE.
 */
export const SEC_CK_REMINDER_BODY_IOS_IPHONE: string =
	SecStringWithDefaultValue(
		'To continue using iCloud on this iPhone, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
		'CloudKeychain',
		0,
		'To continue using iCloud on this iPhone, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
		'Body of reminder text that the iCloud keychain application for this iPhone is still pending',
	);

/**
 * SEC_CK_REMINDER_BODY_IOS_IPOD.
 */
export const SEC_CK_REMINDER_BODY_IOS_IPOD: string = SecStringWithDefaultValue(
	'To continue using iCloud on this iPod, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
	'CloudKeychain',
	0,
	'To continue using iCloud on this iPod, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
	'Body of reminder text that the iCloud keychain application for this iPod is still pending',
);

/**
 * SEC_CK_REMINDER_BODY_IOS_GENERIC.
 */
export const SEC_CK_REMINDER_BODY_IOS_GENERIC: string =
	SecStringWithDefaultValue(
		'To continue using iCloud on this device, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
		'CloudKeychain',
		0,
		'To continue using iCloud on this device, approve it from one of your other devices using iCloud or enter your iCloud Security Code.',
		'Body of reminder text that the iCloud keychain application for this device is still pending',
	);

/**
 * SEC_CK_REMINDER_BUTTON_ICSC.
 */
export const SEC_CK_REMINDER_BUTTON_ICSC: string = SecStringWithDefaultValue(
	'Use Security Code',
	'CloudKeychain',
	0,
	'Use Security Code',
	'Button label to approve via iCSC',
);

/**
 * SEC_CK_REMINDER_BUTTON_OK.
 */
export const SEC_CK_REMINDER_BUTTON_OK: string = SecStringWithDefaultValue(
	'OK',
	'CloudKeychain',
	0,
	'OK',
	'Button label to acknowledge/dismiss reminder alert without further action',
);

/**
 * SEC_INVALID_LINKAGE_KEY.
 */
export const SEC_INVALID_LINKAGE_KEY: string = SecStringWithDefaultValue(
	'Invalid certificate chain linkage.',
	'Certificate',
	0,
	'Invalid certificate chain linkage.',
	'',
);

/**
 * SEC_BAD_CRIT_EXTN_KEY.
 */
export const SEC_BAD_CRIT_EXTN_KEY: string = SecStringWithDefaultValue(
	'One or more unsupported critical extensions found.',
	'Certificate',
	0,
	'One or more unsupported critical extensions found.',
	'',
);

/**
 * SEC_ROOT_UNTRUSTED_KEY.
 */
export const SEC_ROOT_UNTRUSTED_KEY: string = SecStringWithDefaultValue(
	'Root certificate is not trusted.',
	'Certificate',
	0,
	'Root certificate is not trusted.',
	'',
);

/**
 * SEC_HOSTNAME_MISMATCH_KEY.
 */
export const SEC_HOSTNAME_MISMATCH_KEY: string = SecStringWithDefaultValue(
	'Hostname mismatch.',
	'Certificate',
	0,
	'Hostname mismatch.',
	'',
);

/**
 * SEC_POLICY__REQ_NOT_MET_KEY.
 */
export const SEC_POLICY__REQ_NOT_MET_KEY: string = SecStringWithDefaultValue(
	'Policy requirements not met.',
	'Certificate',
	0,
	'Policy requirements not met.',
	'',
);

/**
 * SEC_CHAIN_VALIDITY_ERR_KEY.
 */
export const SEC_CHAIN_VALIDITY_ERR_KEY: string = SecStringWithDefaultValue(
	'One or more certificates have expired or are not valid yet.',
	'Certificate',
	0,
	'One or more certificates have expired or are not valid yet.',
	'',
);

/**
 * SEC_WEAK_KEY_ERR_KEY.
 */
export const SEC_WEAK_KEY_ERR_KEY: string = SecStringWithDefaultValue(
	'One or more certificates is using a weak key size.',
	'Certificate',
	0,
	'One or more certificates is using a weak key size.',
	'',
);

/**
 * SEC_MISSING_INTERMEDIATE_KEY.
 */
export const SEC_MISSING_INTERMEDIATE_KEY: string = SecStringWithDefaultValue(
	'Unable to build chain to root certificate.',
	'Certificate',
	0,
	'Unable to build chain to root certificate.',
	'',
);

/**
 * SEC_TRUST_CERTIFICATE_ERROR.
 */
export const SEC_TRUST_CERTIFICATE_ERROR: string = SecStringWithDefaultValue(
	'Certificate %ld “%@” has errors: ',
	'Trust',
	0,
	'Certificate %ld “%@” has errors: ',
	'Preface for per-certificate errors',
);

/**
 * SEC_TRUST_ERROR_SUBTYPE_BLOCKED.
 */
export const SEC_TRUST_ERROR_SUBTYPE_BLOCKED: string =
	SecStringWithDefaultValue(
		'“%@” certificate is blocked',
		'Trust',
		0,
		'“%@” certificate is blocked',
		'Error for blocked certificates',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_REVOKED.
 */
export const SEC_TRUST_ERROR_SUBTYPE_REVOKED: string =
	SecStringWithDefaultValue(
		'“%@” certificate is revoked',
		'Trust',
		0,
		'“%@” certificate is revoked',
		'Error for revoked certificates',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_KEYSIZE.
 */
export const SEC_TRUST_ERROR_SUBTYPE_KEYSIZE: string =
	SecStringWithDefaultValue(
		'“%@” certificate is using a broken key size',
		'Trust',
		0,
		'“%@” certificate is using a broken key size',
		'Error for certificates with weak key sizes',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_WEAKHASH.
 */
export const SEC_TRUST_ERROR_SUBTYPE_WEAKHASH: string =
	SecStringWithDefaultValue(
		'“%@” certificate is using a broken signature algorithm',
		'Trust',
		0,
		'“%@” certificate is using a broken signature algorithm',
		'Error for certificates with weak signature algorithms',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_DENIED.
 */
export const SEC_TRUST_ERROR_SUBTYPE_DENIED: string = SecStringWithDefaultValue(
	'User or administrator set “%@” certificate as distrusted',
	'Trust',
	0,
	'User or administrator set “%@” certificate as distrusted',
	'Error for certificates with deny trust settings',
);

/**
 * SEC_TRUST_ERROR_SUBTYPE_COMPLIANCE.
 */
export const SEC_TRUST_ERROR_SUBTYPE_COMPLIANCE: string =
	SecStringWithDefaultValue(
		'“%@” certificate is not standards compliant',
		'Trust',
		0,
		'“%@” certificate is not standards compliant',
		'Error for certificates that violate standards',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_EXPIRED.
 */
export const SEC_TRUST_ERROR_SUBTYPE_EXPIRED: string =
	SecStringWithDefaultValue(
		'“%@” certificate is expired',
		'Trust',
		0,
		'“%@” certificate is expired',
		'Error for certificates that are expired',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_TRUST.
 */
export const SEC_TRUST_ERROR_SUBTYPE_TRUST: string = SecStringWithDefaultValue(
	'“%@” certificate is not trusted',
	'Trust',
	0,
	'“%@” certificate is not trusted',
	'Error for certificates that are not trusted',
);

/**
 * SEC_TRUST_ERROR_SUBTYPE_NAME.
 */
export const SEC_TRUST_ERROR_SUBTYPE_NAME: string = SecStringWithDefaultValue(
	'“%@” certificate name does not match input',
	'Trust',
	0,
	'“%@” certificate name does not match input',
	'Error for certificates whose names do not match the policy',
);

/**
 * SEC_TRUST_ERROR_SUBTYPE_USAGE.
 */
export const SEC_TRUST_ERROR_SUBTYPE_USAGE: string = SecStringWithDefaultValue(
	'“%@” certificate is not permitted for this usage',
	'Trust',
	0,
	'“%@” certificate is not permitted for this usage',
	'Error for certificates whose usages do not match the policy',
);

/**
 * SEC_TRUST_ERROR_SUBTYPE_PINNING.
 */
export const SEC_TRUST_ERROR_SUBTYPE_PINNING: string =
	SecStringWithDefaultValue(
		'%@ certificates do not meet pinning requirements',
		'Trust',
		0,
		'%@ certificates do not meet pinning requirements',
		'Error for certificates that do not meet pinning requirements',
	);

/**
 * SEC_TRUST_ERROR_SUBTYPE_ISSUER.
 */
export const SEC_TRUST_ERROR_SUBTYPE_ISSUER: string = SecStringWithDefaultValue(
	'“%@” certificate does not meet issuer constraints',
	'Trust',
	0,
	'“%@” certificate does not meet issuer constraints',
	'Error for certificates which violate constraints set on their issuer',
);

/**
 * SEC_TRUST_ERROR_SUBTYPE_INVALID.
 */
export const SEC_TRUST_ERROR_SUBTYPE_INVALID: string =
	SecStringWithDefaultValue(
		'Unknown trust error for “%@” certificate',
		'Trust',
		0,
		'Unknown trust error for “%@” certificate',
		'Error for unknown error',
	);

/**
 * SEC_TRUST_ERROR_SSLHostname.
 */
export const SEC_TRUST_ERROR_SSLHostname: string = SecStringWithDefaultValue(
	'SSL hostname does not match name(s) in certificate',
	'Trust',
	0,
	'SSL hostname does not match name(s) in certificate',
	'Error for SSL hostname mismatch',
);

/**
 * SEC_TRUST_ERROR_Email.
 */
export const SEC_TRUST_ERROR_Email: string = SecStringWithDefaultValue(
	'Email address does not match name(s) in certificate',
	'Trust',
	0,
	'Email address does not match name(s) in certificate',
	'Error for email mismatch',
);

/**
 * SEC_TRUST_ERROR_TemporalValidity.
 */
export const SEC_TRUST_ERROR_TemporalValidity: string =
	SecStringWithDefaultValue(
		'Certificate is not temporally valid',
		'Trust',
		0,
		'Certificate is not temporally valid',
		'Error for temporal validity',
	);

/**
 * SEC_TRUST_ERROR_ValidLeaf.
 */
export const SEC_TRUST_ERROR_ValidLeaf: string = SecStringWithDefaultValue(
	'Certificate is not temporally valid',
	'Trust',
	0,
	'Certificate is not temporally valid',
	'Error for temporal validity',
);

/**
 * SEC_TRUST_ERROR_WeakKeySize.
 */
export const SEC_TRUST_ERROR_WeakKeySize: string = SecStringWithDefaultValue(
	'Certificate is using a broken key size',
	'Trust',
	0,
	'Certificate is using a broken key size',
	'Error for weak keys',
);

/**
 * SEC_TRUST_ERROR_WeakSignature.
 */
export const SEC_TRUST_ERROR_WeakSignature: string = SecStringWithDefaultValue(
	'Certificate is using a broken signature algorithm',
	'Trust',
	0,
	'Certificate is using a broken signature algorithm',
	'Error for weak signatures',
);

/**
 * SEC_TRUST_ERROR_KeyUsage.
 */
export const SEC_TRUST_ERROR_KeyUsage: string = SecStringWithDefaultValue(
	'Key usage does not match certificate usage',
	'Trust',
	0,
	'Key usage does not match certificate usage',
	'Error for key usage mismatch',
);

/**
 * SEC_TRUST_ERROR_ExtendedKeyUsage.
 */
export const SEC_TRUST_ERROR_ExtendedKeyUsage: string =
	SecStringWithDefaultValue(
		'Extended key usage does not match certificate usage',
		'Trust',
		0,
		'Extended key usage does not match certificate usage',
		'Error for extended key usage mismatch',
	);

/**
 * SEC_TRUST_ERROR_SubjectCommonName.
 */
export const SEC_TRUST_ERROR_SubjectCommonName: string =
	SecStringWithDefaultValue(
		'Common Name does not match expected name',
		'Trust',
		0,
		'Common Name does not match expected name',
		'Error for subject common name mismatch',
	);

/**
 * SEC_TRUST_ERROR_SubjectCommonNamePrefix.
 */
export const SEC_TRUST_ERROR_SubjectCommonNamePrefix: string =
	SecStringWithDefaultValue(
		'Common Name does not match expected name',
		'Trust',
		0,
		'Common Name does not match expected name',
		'Error for subject common name prefix mismatch',
	);

/**
 * SEC_TRUST_ERROR_SubjectCommonNameTEST.
 */
export const SEC_TRUST_ERROR_SubjectCommonNameTEST: string =
	SecStringWithDefaultValue(
		'Common Name does not match expected name',
		'Trust',
		0,
		'Common Name does not match expected name',
		'Error for subject common name mismatch, allowing test',
	);

/**
 * SEC_TRUST_ERROR_SubjectOrganization.
 */
export const SEC_TRUST_ERROR_SubjectOrganization: string =
	SecStringWithDefaultValue(
		'Organization does not match expected name',
		'Trust',
		0,
		'Organization does not match expected name',
		'Error for subject organization mismatch',
	);

/**
 * SEC_TRUST_ERROR_SubjectOrganizationalUnit.
 */
export const SEC_TRUST_ERROR_SubjectOrganizationalUnit: string =
	SecStringWithDefaultValue(
		'Organizational Unit does not match expected name',
		'Trust',
		0,
		'Certificate Organizational Unit does not match expected name',
		'Error for subject organizational unit mismatch',
	);

/**
 * SEC_TRUST_ERROR_NotValidBefore.
 */
export const SEC_TRUST_ERROR_NotValidBefore: string = SecStringWithDefaultValue(
	'Certificate issued before allowed time',
	'Trust',
	0,
	'Certificate issued before allowed time',
	'Error for not before date',
);

/**
 * SEC_TRUST_ERROR_EAPTrustedServerNames.
 */
export const SEC_TRUST_ERROR_EAPTrustedServerNames: string =
	SecStringWithDefaultValue(
		'Trusted EAP hostname does not match name(s) in certificate',
		'Trust',
		0,
		'Trusted EAP hostname does not match name(s) in certificate',
		'Error for EAP hostname mismatch',
	);

/**
 * SEC_TRUST_ERROR_LeafMarkerOid.
 */
export const SEC_TRUST_ERROR_LeafMarkerOid: string = SecStringWithDefaultValue(
	'Missing project-specific extension OID',
	'Trust',
	0,
	'Missing project-specific extension OID',
	'Error for leaf marker OID',
);

/**
 * SEC_TRUST_ERROR_LeafMarkerOidWithoutValueCheck.
 */
export const SEC_TRUST_ERROR_LeafMarkerOidWithoutValueCheck: string =
	SecStringWithDefaultValue(
		'Missing project-specific extension OID',
		'Trust',
		0,
		'Missing project-specific extension OID',
		'Error for leaf marker OID without value check',
	);

/**
 * SEC_TRUST_ERROR_LeafMarkersProdAndQA.
 */
export const SEC_TRUST_ERROR_LeafMarkersProdAndQA: string =
	SecStringWithDefaultValue(
		'Missing project-specific extension OID',
		'Trust',
		0,
		'Missing project-specific extension OID',
		'Error for leaf marker OID allowing prod or QA',
	);

/**
 * SEC_TRUST_ERROR_BlackListedLeaf.
 */
export const SEC_TRUST_ERROR_BlackListedLeaf: string =
	SecStringWithDefaultValue(
		'Certificate is blocked',
		'Trust',
		0,
		'Certificate is blocked',
		'Error for blocklisted certificates',
	);

/**
 * SEC_TRUST_ERROR_GrayListedLeaf.
 */
export const SEC_TRUST_ERROR_GrayListedLeaf: string = SecStringWithDefaultValue(
	'Certificate is listed as untrusted',
	'Trust',
	0,
	'Certificate is listed as untrusted',
	'Error for graylisted certificates',
);

/**
 * SEC_TRUST_ERROR_LeafSPKISHA256.
 */
export const SEC_TRUST_ERROR_LeafSPKISHA256: string = SecStringWithDefaultValue(
	'Public key does not match pinned value',
	'Trust',
	0,
	'Public key does not match pinned value',
	'Error for leaf public key pin',
);

/**
 * SEC_TRUST_ERROR_NotCA.
 */
export const SEC_TRUST_ERROR_NotCA: string = SecStringWithDefaultValue(
	'Leaf certificate is a CA',
	'Trust',
	0,
	'Leaf certificate is a CA',
	'Error for leaf CA',
);

/**
 * SEC_TRUST_ERROR_IssuerCommonName.
 */
export const SEC_TRUST_ERROR_IssuerCommonName: string =
	SecStringWithDefaultValue(
		'Common Name does not match expected name',
		'Trust',
		0,
		'Common Name does not match expected name',
		'Error for issuer common name mismatch',
	);

/**
 * SEC_TRUST_ERROR_IssuerCommonNamePrefix.
 */
export const SEC_TRUST_ERROR_IssuerCommonNamePrefix: string =
	SecStringWithDefaultValue(
		'Common Name does not match expected name',
		'Trust',
		0,
		'Common Name does not match expected name',
		'Error for issuer common name mismatch',
	);

/**
 * SEC_TRUST_ERROR_BasicConstraints.
 */
export const SEC_TRUST_ERROR_BasicConstraints: string =
	SecStringWithDefaultValue(
		'Basic constraints are required but missing',
		'Trust',
		0,
		'Basic constraints are required but missing',
		'Error for missing basic constraints',
	);

/**
 * SEC_TRUST_ERROR_BasicConstraintsCA.
 */
export const SEC_TRUST_ERROR_BasicConstraintsCA: string =
	SecStringWithDefaultValue(
		'Non-CA certificate used as a CA',
		'Trust',
		0,
		'Non-CA certificate used as a CA',
		'Error for CA basic constraints',
	);

/**
 * SEC_TRUST_ERROR_BasicConstraintsPathLen.
 */
export const SEC_TRUST_ERROR_BasicConstraintsPathLen: string =
	SecStringWithDefaultValue(
		'Chain exceeded constrained path length',
		'Trust',
		0,
		'Chain exceeded constrained path length',
		'Error for path length basic constraints',
	);

/**
 * SEC_TRUST_ERROR_IntermediateSPKISHA256.
 */
export const SEC_TRUST_ERROR_IntermediateSPKISHA256: string =
	SecStringWithDefaultValue(
		'Public key does not match pinned value',
		'Trust',
		0,
		'Public key does not match pinned value',
		'Error for intermediate public key pin',
	);

/**
 * SEC_TRUST_ERROR_CAspkiSHA256.
 */
export const SEC_TRUST_ERROR_CAspkiSHA256: string = SecStringWithDefaultValue(
	'Public key does not match pinned value',
	'Trust',
	0,
	'Public key does not match pinned value',
	'Error for CA public key pin',
);

/**
 * SEC_TRUST_ERROR_IntermediateEKU.
 */
export const SEC_TRUST_ERROR_IntermediateEKU: string =
	SecStringWithDefaultValue(
		'Extended key usage does not match pinned value',
		'Trust',
		0,
		'Extended key usage does not match pinned value',
		'Error for intermediate extended key usage pin',
	);

/**
 * SEC_TRUST_ERROR_IntermediateMarkerOid.
 */
export const SEC_TRUST_ERROR_IntermediateMarkerOid: string =
	SecStringWithDefaultValue(
		'Missing issuer-specific extension OID',
		'Trust',
		0,
		'Missing issuer-specific extension OID',
		'Error for intermediate marker OID',
	);

/**
 * SEC_TRUST_ERROR_IntermediateMarkerOidWithoutValueCheck.
 */
export const SEC_TRUST_ERROR_IntermediateMarkerOidWithoutValueCheck: string =
	SecStringWithDefaultValue(
		'Missing issuer-specific extension OID',
		'Trust',
		0,
		'Missing issuer-specific extension OID',
		'Error for intermediate marker OID',
	);

/**
 * SEC_TRUST_ERROR_IntermediateOrganization.
 */
export const SEC_TRUST_ERROR_IntermediateOrganization: string =
	SecStringWithDefaultValue(
		'Organization does not match expected name',
		'Trust',
		0,
		'Organization does not match expected name',
		'Error for issuer organization mismatch',
	);

/**
 * SEC_TRUST_ERROR_IntermediateCountry.
 */
export const SEC_TRUST_ERROR_IntermediateCountry: string =
	SecStringWithDefaultValue(
		'Country or Region does not match expected name',
		'Trust',
		0,
		'Country or Region does not match expected name',
		'Error for issuer country mismatch',
	);

/**
 * SEC_TRUST_ERROR_AnchorSHA256.
 */
export const SEC_TRUST_ERROR_AnchorSHA256: string = SecStringWithDefaultValue(
	'Anchor does not match pinned fingerprint',
	'Trust',
	0,
	'Anchor does not match pinned fingerprint',
	'Error for anchor SHA-256 fingerprint pin',
);

/**
 * SEC_TRUST_ERROR_AnchorTrusted.
 */
export const SEC_TRUST_ERROR_AnchorTrusted: string = SecStringWithDefaultValue(
	'Root is not trusted',
	'Trust',
	0,
	'Root is not trusted',
	'Error for untrusted root',
);

/**
 * SEC_TRUST_ERROR_MissingIntermediate.
 */
export const SEC_TRUST_ERROR_MissingIntermediate: string =
	SecStringWithDefaultValue(
		'Unable to build chain to root (possible missing intermediate)',
		'Trust',
		0,
		'Unable to build chain to root (possible missing intermediate)',
		'Error for missing intermediates',
	);

/**
 * SEC_TRUST_ERROR_AnchorApple.
 */
export const SEC_TRUST_ERROR_AnchorApple: string = SecStringWithDefaultValue(
	'Anchor is not an Apple root',
	'Trust',
	0,
	'Anchor is not an Apple root',
	'Error for Apple anchor pin',
);

/**
 * SEC_TRUST_ERROR_NonEmptySubject.
 */
export const SEC_TRUST_ERROR_NonEmptySubject: string =
	SecStringWithDefaultValue(
		'Certificate missing a name',
		'Trust',
		0,
		'Certificate missing a name',
		'Error for empty subject name',
	);

/**
 * SEC_TRUST_ERROR_IdLinkage.
 */
export const SEC_TRUST_ERROR_IdLinkage: string = SecStringWithDefaultValue(
	'SubjectKeyID/AuthorityKeyID mismatch in chain',
	'Trust',
	0,
	'SubjectKeyID/AuthorityKeyID mismatch in chain',
	'Error for bad key ID linkage',
);

/**
 * SEC_TRUST_ERROR_KeySize.
 */
export const SEC_TRUST_ERROR_KeySize: string = SecStringWithDefaultValue(
	'Key size is not permitted for this use',
	'Trust',
	0,
	'Key size is not permitted for this use',
	'Error for pinned key size',
);

/**
 * SEC_TRUST_ERROR_SignatureHashAlgorithms.
 */
export const SEC_TRUST_ERROR_SignatureHashAlgorithms: string =
	SecStringWithDefaultValue(
		'Signature hash algorithm is not permitted for this use',
		'Trust',
		0,
		'Signature hash algorithm is not permitted for this use',
		'Error for pinned hash algorithm',
	);

/**
 * SEC_TRUST_ERROR_CertificatePolicy.
 */
export const SEC_TRUST_ERROR_CertificatePolicy: string =
	SecStringWithDefaultValue(
		'Missing project-specific Certificate Policy OID',
		'Trust',
		0,
		'Missing project-specific Certificate Policy OID',
		'Error for certificate policy marker OID',
	);

/**
 * SEC_TRUST_ERROR_ValidRoot.
 */
export const SEC_TRUST_ERROR_ValidRoot: string = SecStringWithDefaultValue(
	'Root is not temporally valid',
	'Trust',
	0,
	'Root is not temporally valid',
	'Error for root temporal validity',
);

/**
 * SEC_TRUST_ERROR_CriticalExtensions.
 */
export const SEC_TRUST_ERROR_CriticalExtensions: string =
	SecStringWithDefaultValue(
		'Found unknown critical extensions',
		'Trust',
		0,
		'Found unknown critical extensions',
		'Error for unknown critical extensions',
	);

/**
 * SEC_TRUST_ERROR_ChainLength.
 */
export const SEC_TRUST_ERROR_ChainLength: string = SecStringWithDefaultValue(
	'Chain does not match expected path length',
	'Trust',
	0,
	'Chain does not match expected path length',
	'Error for pinned chain length',
);

/**
 * SEC_TRUST_ERROR_BasicCertificateProcessing.
 */
export const SEC_TRUST_ERROR_BasicCertificateProcessing: string =
	SecStringWithDefaultValue(
		'Certificate is not standards compliant',
		'Trust',
		0,
		'Certificate is not standards compliant',
		'Error for certificates that violate standards',
	);

/**
 * SEC_TRUST_ERROR_NameConstraints.
 */
export const SEC_TRUST_ERROR_NameConstraints: string =
	SecStringWithDefaultValue(
		'Name constraints violated',
		'Trust',
		0,
		'Name constraints violated',
		'Error for name constraints',
	);

/**
 * SEC_TRUST_ERROR_PolicyConstraints.
 */
export const SEC_TRUST_ERROR_PolicyConstraints: string =
	SecStringWithDefaultValue(
		'Policy constraints violated',
		'Trust',
		0,
		'Policy constraints violated',
		'Error for policy constraints',
	);

/**
 * SEC_TRUST_ERROR_GrayListedKey.
 */
export const SEC_TRUST_ERROR_GrayListedKey: string = SecStringWithDefaultValue(
	'Key is listed as untrusted',
	'Trust',
	0,
	'Key is listed as untrusted',
	'Error for graylisted keys',
);

/**
 * SEC_TRUST_ERROR_BlackListedKey.
 */
export const SEC_TRUST_ERROR_BlackListedKey: string = SecStringWithDefaultValue(
	'Key is blocked',
	'Trust',
	0,
	'Key is blocked',
	'Error for blocklisted keys',
);

/**
 * SEC_TRUST_ERROR_UsageConstraints.
 */
export const SEC_TRUST_ERROR_UsageConstraints: string =
	SecStringWithDefaultValue(
		'User or administrator set certificate as distrusted',
		'Trust',
		0,
		'User or administrator set certificate as distrusted',
		'Error for certificates with deny trust settings',
	);

/**
 * SEC_TRUST_ERROR_SystemTrustedWeakHash.
 */
export const SEC_TRUST_ERROR_SystemTrustedWeakHash: string =
	SecStringWithDefaultValue(
		'Signature hash algorithm is not permitted for this use',
		'Trust',
		0,
		'Signature hash algorithm is not permitted for this use',
		'Error for system-trust hash algorithm',
	);

/**
 * SEC_TRUST_ERROR_SystemTrustedWeakKey.
 */
export const SEC_TRUST_ERROR_SystemTrustedWeakKey: string =
	SecStringWithDefaultValue(
		'Key size is not permitted for this use',
		'Trust',
		0,
		'Key size is not permitted for this use',
		'Error for system-trust key size',
	);

/**
 * SEC_TRUST_ERROR_SystemTrustedCTRequired.
 */
export const SEC_TRUST_ERROR_SystemTrustedCTRequired: string =
	SecStringWithDefaultValue(
		'Certificate Transparency validation required for this use',
		'Trust',
		0,
		'Certificate Transparency validation required for this use',
		'Error for system-trust CT requirement',
	);

/**
 * SEC_TRUST_ERROR_PinningRequired.
 */
export const SEC_TRUST_ERROR_PinningRequired: string =
	SecStringWithDefaultValue(
		'Pinning required but not used',
		'Trust',
		0,
		'Pinning required but not used',
		'Error for required pinning',
	);

/**
 * SEC_TRUST_ERROR_Revocation.
 */
export const SEC_TRUST_ERROR_Revocation: string = SecStringWithDefaultValue(
	'Certificate is revoked',
	'Trust',
	0,
	'Certificate is revoked',
	'Error for revocation',
);

/**
 * SEC_TRUST_ERROR_RevocationResponseRequired.
 */
export const SEC_TRUST_ERROR_RevocationResponseRequired: string =
	SecStringWithDefaultValue(
		'Failed to check revocation',
		'Trust',
		0,
		'Failed to check revocation',
		'Error for revocation required',
	);

/**
 * SEC_TRUST_ERROR_CTRequired.
 */
export const SEC_TRUST_ERROR_CTRequired: string = SecStringWithDefaultValue(
	'Certificate Transparency validation required but missing',
	'Trust',
	0,
	'Certificate Transparency validation required but missing',
	'Error for missing Certificate Transparency validation',
);

/**
 * SEC_TRUST_ERROR_NoNetworkAccess.
 */
export const SEC_TRUST_ERROR_NoNetworkAccess: string =
	SecStringWithDefaultValue(
		'Unexpected error detail',
		'Trust',
		0,
		'Unexpected error detail',
		'Error for unexpected error details',
	);

/**
 * SEC_TRUST_ERROR_ExtendedValidation.
 */
export const SEC_TRUST_ERROR_ExtendedValidation: string =
	SecStringWithDefaultValue(
		'Unexpected error detail',
		'Trust',
		0,
		'Unexpected error detail',
		'Error for unexpected error details',
	);

/**
 * SEC_TRUST_ERROR_RevocationOnline.
 */
export const SEC_TRUST_ERROR_RevocationOnline: string =
	SecStringWithDefaultValue(
		'Unexpected error detail',
		'Trust',
		0,
		'Unexpected error detail',
		'Error for unexpected error details',
	);

/**
 * SEC_TRUST_ERROR_RevocationIfTrusted.
 */
export const SEC_TRUST_ERROR_RevocationIfTrusted: string =
	SecStringWithDefaultValue(
		'Unexpected error detail',
		'Trust',
		0,
		'Unexpected error detail',
		'Error for unexpected error details',
	);

/**
 * SEC_TRUST_ERROR_RevocationDbIgnored.
 */
export const SEC_TRUST_ERROR_RevocationDbIgnored: string =
	SecStringWithDefaultValue(
		'Unexpected error detail',
		'Trust',
		0,
		'Unexpected error detail',
		'Error for unexpected error details',
	);

/**
 * SEC_TRUST_ERROR_IssuerPolicyConstraints.
 */
export const SEC_TRUST_ERROR_IssuerPolicyConstraints: string =
	SecStringWithDefaultValue(
		'Certificate violates issuer policy constraints',
		'Trust',
		0,
		'Certificate violates issuer policy constraints',
		'Error for certificates which violate policy constraints set on their issuer',
	);

/**
 * SEC_TRUST_ERROR_IssuerNameConstraints.
 */
export const SEC_TRUST_ERROR_IssuerNameConstraints: string =
	SecStringWithDefaultValue(
		'Certificate violates issuer name constraints',
		'Trust',
		0,
		'Certificate violates issuer name constraints',
		'Error for certificates which violate name constraints set on their issuer',
	);

/**
 * SEC_TRUST_ERROR_ValidityPeriodMaximums.
 */
export const SEC_TRUST_ERROR_ValidityPeriodMaximums: string =
	SecStringWithDefaultValue(
		'Certificate exceeds maximum temporal validity period',
		'Trust',
		0,
		'Certificate exceeds maximum temporal validity period',
		"Error for certificates that exceed the system's maximum temporal validity",
	);

/**
 * SEC_TRUST_ERROR_OtherTrustValidityPeriod.
 */
export const SEC_TRUST_ERROR_OtherTrustValidityPeriod: string =
	SecStringWithDefaultValue(
		'Certificate exceeds maximum temporal validity period',
		'Trust',
		0,
		'Certificate exceeds maximum temporal validity period',
		"Error for certificates that exceed the system's maximum temporal validity",
	);

/**
 * SEC_TRUST_ERROR_SystemTrustValidityPeriod.
 */
export const SEC_TRUST_ERROR_SystemTrustValidityPeriod: string =
	SecStringWithDefaultValue(
		'Certificate exceeds maximum temporal validity period',
		'Trust',
		0,
		'Certificate exceeds maximum temporal validity period',
		"Error for certificates that exceed the system's maximum temporal validity",
	);

/**
 * SEC_TRUST_ERROR_ServerAuthEKU.
 */
export const SEC_TRUST_ERROR_ServerAuthEKU: string = SecStringWithDefaultValue(
	'Extended key usage does not match certificate usage',
	'Trust',
	0,
	'Extended key usage does not match certificate usage',
	'Error for extended key usage mismatch',
);

/**
 * SEC_TRUST_ERROR_UnparseableExtension.
 */
export const SEC_TRUST_ERROR_UnparseableExtension: string =
	SecStringWithDefaultValue(
		'Unable to parse known extension',
		'Trust',
		0,
		'Unable to parse known extension',
		'Error for unparseable known extensions',
	);

/**
 * SEC_TRUST_ERROR_NonTlsCTRequired.
 */
export const SEC_TRUST_ERROR_NonTlsCTRequired: string =
	SecStringWithDefaultValue(
		'Certificate Transparency validation required but missing',
		'Trust',
		0,
		'Certificate Transparency validation required but missing',
		'Error for missing Certificate Transparency validation',
	);

/**
 * SEC_TRUST_ERROR_DuplicateExtension.
 */
export const SEC_TRUST_ERROR_DuplicateExtension: string =
	SecStringWithDefaultValue(
		'Multiple extensions with the same extension ID',
		'Trust',
		0,
		'Multiple extensions with the same extension ID',
		'Error for duplicate extensions',
	);

/**
 * SEC_TRUST_ERROR_EmailProtectionEKU.
 */
export const SEC_TRUST_ERROR_EmailProtectionEKU: string =
	SecStringWithDefaultValue(
		'Extended key usage does not match certificate usage',
		'Trust',
		0,
		'Extended key usage does not match certificate usage',
		'Error for extended key usage mismatch',
	);

/**
 * SEC_TRUST_ERROR_SinglePurposeChainEKU.
 */
export const SEC_TRUST_ERROR_SinglePurposeChainEKU: string =
	SecStringWithDefaultValue(
		'Extended key usage does not match certificate usage',
		'Trust',
		0,
		'Extended key usage does not match certificate usage',
		'Error for extended key usage mismatch',
	);

/**
 * SEC_TRUST_ERROR_MarkRepresentation.
 */
export const SEC_TRUST_ERROR_MarkRepresentation: string =
	SecStringWithDefaultValue(
		'SVG data does not match logotype extension',
		'Trust',
		0,
		'SVG data does not match logotype extension',
		'Error for SVG logotype mismatch',
	);

/**
 * SEC_TRUST_ERROR_URI.
 */
export const SEC_TRUST_ERROR_URI: string = SecStringWithDefaultValue(
	'URI does not match name(s) in certificate',
	'Trust',
	0,
	'URI address does not match name(s) in certificate',
	'Error for URI mismatch',
);

/**
 * SEC_TRUST_ERROR_RootMarkerOid.
 */
export const SEC_TRUST_ERROR_RootMarkerOid: string = SecStringWithDefaultValue(
	'Missing issuer-specific extension OID',
	'Trust',
	0,
	'Missing issuer-specific extension OID',
	'Error for intermediate marker OID',
);

/**
 * SEC_TRUST_ERROR_QWAC.
 */
export const SEC_TRUST_ERROR_QWAC: string = SecStringWithDefaultValue(
	'Certificate is not a qualified web certificate',
	'Trust',
	0,
	'Certificate is not a qualified web certificate',
	'Error for non-QWAC certs',
);
