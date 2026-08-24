/**
 * A whitespace character other than a space, a line feed or a carriage
 * return: a tab, a form feed, a no-break space.
 *
 * At the start of a line inside a template or JSX text, recast's
 * reprinting printer keeps such a character and its generic printer
 * writes spaces for it.
 */
export const ODD_WHITESPACE = /[^\S \n\r]/
