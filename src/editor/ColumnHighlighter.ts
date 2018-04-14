
import { window, Disposable, TextEditorSelectionChangeEvent, Range, Selection, TextLine, TextDocument, TextEditor, TextEditorDecorationType, DecorationOptions, DecorationRenderOptions, OverviewRulerLane, Position } from "vscode";
import { isHeaderLine, isDataLine } from "../ImpexUtil";

const columnHighlighterDecoration: TextEditorDecorationType = window.createTextEditorDecorationType({
    backgroundColor: "rgba(0,255,0,0.2)"
});

export class ColumnHighlighter implements Disposable {

    private _subscriptions: Disposable[] = [];

    constructor () {
        // reigster event on initialize
        window.onDidChangeTextEditorSelection(this.selectionChanged, this, this._subscriptions);
    }

    private selectionChanged(event: TextEditorSelectionChangeEvent) {
        // The primary selection is always at index 0.
        let primarySelection: Selection = event.selections[0];

        if (this.isValidSelection(primarySelection)) {
            let lineNumber: number = primarySelection.active.line;
            let editor: TextEditor = event.textEditor;
            let document: TextDocument = editor.document;
            let line: TextLine = document.lineAt(lineNumber);

            if (isDataLine(line.text)) {

                //window.showInformationMessage(line.text);
                let header: TextLine = this.findHeaderFor(line, document);
                //window.showInformationMessage(header.text);

                let columnIndex: number = this.findColumnIndexAtPosition(primarySelection.active, document);
                //window.showInformationMessage(columnIndex.toString());

                let headerColumnRange: Range = this.findColumnRangeAtLine(columnIndex, header);
                
                editor.setDecorations(columnHighlighterDecoration , [headerColumnRange]);
            } else {
                // remove decoration
                let zeroRange: Range =  new Range(
                    new Position(line.lineNumber, 0), 
                    new Position(line.lineNumber, 0)
                );
                editor.setDecorations(columnHighlighterDecoration , [zeroRange]);
            }
        }
    }

    private findColumnRangeAtLine(columnIndex: number, line: TextLine): Range {
        let columns: string[] = line.text.split(";");

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
            new Position(line.lineNumber, startPosition), 
            new Position(line.lineNumber, endPosition)
        );
    }

    // Zero based index
    private findColumnIndexAtPosition(position: Position, doc: TextDocument): number {
        let line: TextLine = doc.lineAt(position.line);
        let columns: string[] = line.text.split(";");

        let lengthSum: number = 0;
        for (let i = 0; i < columns.length; i++) {
            // add 1 to the length for the semicolon
            let newLengthSum: number = lengthSum + columns[i].length + 1;
            // check if position is in this column
            if (lengthSum <= position.character &&
                newLengthSum > position.character) {
                    return i;
            }
            lengthSum = newLengthSum;
        }
        // TODO should not be possible maybe use function without end
        return null;
    }

    private findHeaderFor(line: TextLine, doc: TextDocument): TextLine {

        // start at the line above and go up till the end of the document
        for (let i = line.lineNumber - 1; i >= 0; i--) {
            let actualLine: TextLine = doc.lineAt(i);
            if (isHeaderLine(actualLine.text)) {
                return actualLine;
            }
        }

        return null;
    }

    private isValidSelection(selection: Selection): boolean {
        // TODO check for
        // only cursor and no selection
        // is impex file
        return true;
    }

    private isValidLine(line: TextLine): boolean {

        return (isHeaderLine(line.text) || isDataLine(line.text));
    }

    dispose() {
        this._subscriptions.forEach(sub => {
            sub.dispose();
        });
    }
}
