
/**
 * Checks if given string is a header line
 *
 * @export
 * @param {string} line the line to be checked
 * @returns {boolean}
 */
export function isHeaderLine(line: string): boolean {
    /*
     * Group 1 (INSERT|UPDATE|REMOVE|INSERT_UPDATE) matches the Keyword
     * Group 2 ([ ]+)                               matches the space between Keyword and Itemtype
     * Group 3 ([a-z]+)                          matches the Itemtype
     * Group 4 ((([;]+)([^;]*))+)                   matches ; and then everything except ; if exists multiple times
     */
    return /^(INSERT|UPDATE|REMOVE|INSERT_UPDATE)([ ]+)([a-z]+)((([;]+)([^;]*))+)$/gi.test(line);
}

/**
 * Checks if given string is a data line
 *
 * @export
 * @param {string} line the line to be checked
 * @returns {boolean}
 */
export function isDataLine(line: string): boolean {
    /* 
     * Group 1 ([a-z]+)?            matches the Itemtype if exists
     * Group 2 ((([;]+)([^;]*))+)      matches ; and then everything except ; if exists multiple times
     */
    return /^([a-z]+)?((([;]+)([^;]*))+)$/gi.test(line);
}
