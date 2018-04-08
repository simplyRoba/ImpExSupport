
import { window, Disposable, TextEditorSelectionChangeEvent, Range, Selection, TextLine } from "vscode";

export class ColumnHighlighter implements Disposable {

    private _subscriptions: Disposable[] = [];

    constructor () {
        // reigster event on initialize
        window.onDidChangeTextEditorSelection(this._selectionChanged, this, this._subscriptions)
    }

    private _selectionChanged(event: TextEditorSelectionChangeEvent) {
        //The primary selection is always at index 0.
        let primarySelection: Selection = event.selections[0];

        if (this._isValidSelection(primarySelection)) { 

            let lineNumber: number = primarySelection.active.line;
            let line: TextLine = event.textEditor.document.lineAt(lineNumber);

            if(this._isValidLine(line)) {
                
                // TODO mark cell depend on is header pr row  selected
                window.showInformationMessage(line.text);
            }
        } 
    }

    private _isValidSelection(selection: Selection): boolean {
        // TODO check for 
        // only cursor and no selection
        // is impex file
        return true;
    }

    private _isValidLine(line: TextLine): boolean {
        // TODO check for
        // is header or row
        return true;
    }

    dispose() {
        this._subscriptions.forEach(sub => {
            sub.dispose();
        });
    }
}

class ImpexRow implements TextLine {
    lineNumber: number;
    text: string;
    range: Range;
    rangeIncludingLineBreak: Range;
    firstNonWhitespaceCharacterIndex: number;
    isEmptyOrWhitespace: boolean;
}

class ImpexHeader {
    
}
