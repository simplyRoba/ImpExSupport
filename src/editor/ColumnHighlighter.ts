
import { ConfigurationChangeEvent, Disposable, Position, Range, Selection, TextDocument, TextEditor, TextEditorDecorationType, TextEditorSelectionChangeEvent, TextLine, window, workspace } from "vscode";
import { isDataLine, isHeaderLine } from "../ImpexUtil";
import { ImpexDataLine } from "../model/ImpexDataLine";
import { ImpexHeaderLine } from "../model/ImpexHeaderLine";

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
            let cursorPosition: Position = primarySelection.active;
            let editor: TextEditor = event.textEditor;
            let document: TextDocument = editor.document;

            if (this.isValidSelection(primarySelection, document)) {
                let lineNumber: number = cursorPosition.line;
                let line: TextLine = document.lineAt(lineNumber);

                this.setDecorations(line, cursorPosition, editor);
            } else {
                this.resetDecorations(editor);
            }
        }
    }

    private setDecorations(line: TextLine, cursor: Position, editor: TextEditor):void {
        if (isDataLine(line.text)) {
            let data: ImpexDataLine = new ImpexDataLine(line);
            let header: ImpexHeaderLine = this.findHeaderFor(data, editor.document);
            if (header) {
                let columnIndex: number = data.columnIndexOfPostion(cursor.character);
                this.setHeaderLineColumnDecoration(header, columnIndex, editor);
            } else {
                this.resetDecorations(editor);
            }
        } else if (isHeaderLine(line.text)) {
            let header: ImpexHeaderLine = new ImpexHeaderLine(line);
            let dataLines: ImpexDataLine[] = this.findDataLinesFor(header, editor.document);
            if (dataLines) {
                let columnIndex: number = header.columnIndexOfPostion(cursor.character);
                this.setDataLineColumnDecorations(dataLines, columnIndex, editor);
            } else {
                this.resetDecorations(editor);
            }
        } else {
            this.resetDecorations(editor);
        }
    }

    private setDataLineColumnDecorations(datalines: ImpexDataLine[], columnIndex: number, editor: TextEditor): void {
        let ranges: Range[] = [];
        datalines.forEach(line => {
            ranges.push(line.rangeForColumnAtIndex(columnIndex));
        });
        editor.setDecorations(columnHighlighterDecoration, ranges);
    }

    private setHeaderLineColumnDecoration(header: ImpexHeaderLine, columnIndex: number, editor: TextEditor): void {
        let columnRange: Range = header.rangeForColumnAtIndex(columnIndex);
        editor.setDecorations(columnHighlighterDecoration, [columnRange]);
    }

    private findDataLinesFor(header: ImpexHeaderLine, doc: TextDocument): ImpexDataLine[] {
        // start at the line below and go down till the the next header or end of document is reached
        let dataLines: ImpexDataLine[] = [];
        for (let i = header.lineNumber + 1; i < doc.lineCount; i++) {
            let actualLine: TextLine = doc.lineAt(i);
            if (isDataLine(actualLine.text)) {
                dataLines.push(new ImpexDataLine(actualLine));
            } else if (isHeaderLine(actualLine.text)) {
                break;
            }
        }
        if (dataLines.length > 0) {
            return dataLines;
        } else {
            return null;
        }
    }

    private findHeaderFor(dataLine: ImpexDataLine, doc: TextDocument): ImpexHeaderLine {
        // start at the line above and go up till end of the document or header reached
        for (let i = dataLine.lineNumber - 1; i >= 0; i--) {
            let actualLine: TextLine = doc.lineAt(i);
            if (isHeaderLine(actualLine.text)) {
                return new ImpexHeaderLine(actualLine);
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
