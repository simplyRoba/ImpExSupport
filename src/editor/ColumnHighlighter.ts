
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

                let columnIndex: Number = this.findColumnIndexFor(primarySelection.active, document);
                window.showInformationMessage(columnIndex.toString());

                let headerColumnRange: Range = this.findColumnRangeForIndex(columnIndex);
                editor.setDecorations(columnHighlighterDecoration , [header.range]);
            }
        }
    }

    private findColumnRangeForIndex(columnIndex: Number): Range {
        return null;
    }

    // Zero based index
    private findColumnIndexFor(position: Position, doc: TextDocument): Number {
        let line: TextLine = doc.lineAt(position.line);
        let columns: String[] = line.text.split(";");

        let lengthSum: number = 0;
        for (let i = 0; i < columns.length; i++) {
            let newLengthSum: number = lengthSum + columns[i].length + 1; // add 1 to the length for the semicolon
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

class ImpexData implements TextLine {
    lineNumber: number;
    text: string;
    range: Range;
    rangeIncludingLineBreak: Range;
    firstNonWhitespaceCharacterIndex: number;
    isEmptyOrWhitespace: boolean;
}

class ImpexHeader {
}
