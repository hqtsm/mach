export { SecSHA1DigestCreate, SecSHA256DigestCreate } from './SecDigest.ts';

/**
 * String.
 *
 * @param key Key.
 * @param _comment Comment.
 * @returns String.
 */
export const SecString = (
	key: string,
	_comment: string,
): string => key;

/**
 * String from table.
 *
 * @param key Key.
 * @param _tbl Table.
 * @param _comment Comment.
 * @returns String.
 */
export const SecStringFromTable = (
	key: string,
	_tbl: string,
	_comment: string,
): string => key;

/**
 * String with default value.
 *
 * @param key Key.
 * @param _tbl Table.
 * @param _bundle Bundle.
 * @param _value Value.
 * @param _comment Comment.
 * @returns String.
 */
export const SecStringWithDefaultValue = (
	key: string,
	_tbl: string,
	_bundle: unknown,
	_value: string,
	_comment: string,
): string => key;

/**
 * Framework copy localized string.
 *
 * @param key Key.
 * @param _tableName Table name.
 * @returns String.
 */
export function SecFrameworkCopyLocalizedString(
	key: string,
	_tableName: string,
): string {
	return key;
}
