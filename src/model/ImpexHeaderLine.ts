
import { Position, Range, TextLine } from "vscode";
import { isHeaderLine } from "../ImpexUtil";
import { ImpexLine } from "./ImpexLine";

export class ImpexHeaderLine extends ImpexLine {

    constructor(textLine: TextLine) {
        if (isHeaderLine(textLine.text)) {
            super(textLine);
        } else {
            throw new Error("Passed line is not an impex header line");
        }
    }

    // TODO remoce header keyword
    getColumns(): string[] {
        return this.text.split(";");
    }

    // TODO remoce header keyword
    rangeForColumnAtIndex(columnIndex: number): Range {
        let columns: string[] = this.getColumns();

        let lengthSum: number = 0;
        for (let i = 0; i < columnIndex ; i++) {
            // sum up the length of all columns before the desired column to get start position
            // add 1 to the length for the semicolon
            lengthSum = lengthSum + columns[i].length + 1;
        }
        let startPosition: number = lengthSum;

        // take the start position and add the length of the desired column to get end position
        let endPosition: number = startPosition + columns[columnIndex].length;

        return new Range(
            new Position(this.lineNumber, startPosition),
            new Position(this.lineNumber, endPosition)
        );
    }

    // TODO remoce header keyword
    columnIndexOfPostion(position: number): number {
        let columns: string[] = this.getColumns();

        let lengthSum: number = 0;
        for (let i = 0; i < columns.length; i++) {
            // add 1 to the length for the semicolon
            let newLengthSum: number = lengthSum + columns[i].length + 1;
            // check if position is in this column
            if (lengthSum <= position &&
                newLengthSum > position) {
                    return i;
            }
            lengthSum = newLengthSum;
        }

        // will never be hit
        return 0;
    }
}