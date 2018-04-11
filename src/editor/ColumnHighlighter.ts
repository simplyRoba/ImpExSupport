
import { window, Disposable, TextEditorSelectionChangeEvent, Range, Selection, TextLine, TextDocument } from "vscode";
import { isHeaderLine, isDataLine } from "../ImpexUtil";

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
            let document: TextDocument = event.textEditor.document;
            let line: TextLine = document.lineAt(lineNumber);

            if (isDataLine(line.text)) {

                // TODO mark cell depend on is header or row selected
                window.showInformationMessage(line.text);
                let header: TextLine = this.findHeaderFor(line, document);
                window.showInformationMessage(header.text);
            }
        }
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
