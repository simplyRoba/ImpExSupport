
export function isHeaderLine(line: string): boolean {
    /* Group 1 (INSERT|UPDATE|REMOVE|INSERT_UPDATE) matches the Keyword
     * Group 2 ([ ]+)                               matches the space between Keyword and Itemtype
     * Group 3 ([a-zA-Z]+)                          matches the Itemtype
     * Group 4 ((([;]+)([^;]+))+)                   matches ; and then everything except ; multiple times
     * Group 5 ([;]*)                               matches the trailing ; if exists
     */
    return /^(INSERT|UPDATE|REMOVE|INSERT_UPDATE)([ ]+)([a-z]+)((([;]+)([^;]+))+)([;]*)$/gi.test(line);
}

export function isDataLine(line: string): boolean {
    /* Group 1 ([a-zA-Z]+)?            matches the Itemtype if exists
     * Group 2 ((([;]+)([^;]+))+)      matches ; and then everything except ; multiple times
     */
    return /^([a-zA-Z]+)?((([;]+)([^;]+))+)([;]*)$/g.test(line);
}
