/**
 * Matches an ECMAScript IdentifierName: an ID_Start, `$` or `_`, then
 * ID_Continue, `$`, ZWNJ or ZWJ characters. The empty string is not one.
 */
export const IDENTIFIER_NAME_REGEX = /^[\p{ID_Start}$_][\p{ID_Continue}$‌‍]*$/u
