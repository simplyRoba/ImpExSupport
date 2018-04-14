
import { Range, TextLine } from "vscode";

export abstract class ImpexLine implements TextLine {

    lineNumber: number;
    text: string;
    range: Range;
    rangeIncludingLineBreak: Range;
    firstNonWhitespaceCharacterIndex: number;
    isEmptyOrWhitespace: boolean;

    constructor(textLine: TextLine) {
        this.lineNumber = textLine.lineNumber;
        this.text = textLine.text;
        this.range = textLine.range;
        this.rangeIncludingLineBreak = textLine.rangeIncludingLineBreak;
        this.firstNonWhitespaceCharacterIndex = textLine.firstNonWhitespaceCharacterIndex;
        this.isEmptyOrWhitespace = textLine.isEmptyOrWhitespace;
    }

    /**
     * @abstract
     * @returns {string[]}
     * @memberof ImpexLine
     */
    abstract getColumns(): string[];
    /**
     * @abstract
     * @param {number} position zero-based position somewhere in the column
     * @returns {number} zero-based index of the column
     * @memberof ImpexLine
     */
    abstract columnIndexOfPostion(position: number): number;
    /**
     * @abstract
     * @param {number} columnIndex zero-based index of the column
     * @returns {Range} the range of the column at given index
     * @memberof ImpexLine
     */
    abstract rangeForColumnAtIndex(columnIndex: number): Range;
    /**
     * @abstract
     * @param {number} position zero-based position somewhere in the column
     * @returns {Range} the range of the column at given position
     * @memberof ImpexLine
     */
    rangeForColumnAtPosition(position: number): Range {
        return this.rangeForColumnAtIndex(this.columnIndexOfPostion(position));
    }
}