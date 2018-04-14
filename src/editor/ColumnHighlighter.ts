
import { window, Disposable, TextEditorSelectionChangeEvent, Range, Selection, TextLine, TextDocument, TextEditor, TextEditorDecorationType, DecorationOptions, DecorationRenderOptions, OverviewRulerLane, Position, workspace, ConfigurationChangeEvent } from "vscode";
import { isHeaderLine, isDataLine } from "../ImpexUtil";

const columnHighlighterDecoration: TextEditorDecorationType = window.createTextEditorDecorationType({
    backgroundColor: "rgba(0,255,0,0.2)"
});

export class ColumnHighlighter implements Disposable {

    private subscriptions: Disposable[] = [];
    private enabled: boolean = workspace.getConfiguration().get("impex.editor.columnHighlighting.enabled");

    constructor () {
        // reigster event on initialize
        window.onDidChangeTextEditorSelection(this.selectionChanged, this, this.subscriptions);
        workspace.onDidChangeConfiguration(this.changeConfigProperty, this, this.subscriptions);
    }

    private changeConfigProperty(event: ConfigurationChangeEvent) {
        // TODO handle configuration change with register/deregister event listener
        if (event.affectsConfiguration("impex.editor.columnHighlighting.enabled")) {
            this.enabled = workspace.getConfiguration().get("impex.editor.columnHighlighting.enabled");
        }
    }

    private selectionChanged(event: TextEditorSelectionChangeEvent) {
        if (this.enabled) {
            // The primary selection is always at index 0.
            let primarySelection: Selection = event.selections[0];
            let editor: TextEditor = event.textEditor;
            let document: TextDocument = editor.document;

            if (this.isValidSelection(primarySelection, document)) {
                let lineNumber: number = primarySelection.active.line;
                let line: TextLine = document.lineAt(lineNumber);

                if (isDataLine(line.text)) {

                    let header: TextLine = this.findHeaderFor(line, document);
                    let columnIndex: number = this.findColumnIndexAtPosition(primarySelection.active, document);
                    let headerColumnRange: Range = this.findColumnRangeAtLine(columnIndex, header);

                    editor.setDecorations(columnHighlighterDecoration , [headerColumnRange]);
                } else {
                    this.resetDecorations(editor);
                }
            } else {
                this.resetDecorations(editor);
            }
        }
    }

    // TODO exclude header keyword from range when first column
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

    // returns the column zero-based index at the line at the given postion
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

        // will never be hit
        return 0;
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

    private isValidSelection(selection: Selection, doc: TextDocument): boolean {
        if (doc.languageId === "impex") {
            // if anchor and active in selection are the same its just the cursor and no selection
            if (selection.active.isEqual(selection.anchor)) {
                return true;
            }
        }
        return false;
    }

    // check if its a valid impex line
    private isValidLine(line: TextLine): boolean {
        // TODO check if there is a header above data line if its a data line
        return (isHeaderLine(line.text) || isDataLine(line.text));
    }

    private resetDecorations(editor: TextEditor): void {
        // remove decoration
        let zeroRange: Range =  new Range(
            new Position(0, 0),
            new Position(0, 0)
        );
        editor.setDecorations(columnHighlighterDecoration , [zeroRange]);
    }

    dispose() {
        this.subscriptions.forEach(sub => {
            sub.dispose();
        });
    }
}
