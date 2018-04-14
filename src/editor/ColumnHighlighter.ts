
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
            let editor: TextEditor = event.textEditor;
            let document: TextDocument = editor.document;

            if (this.isValidSelection(primarySelection, document)) {
                let lineNumber: number = primarySelection.active.line;
                let line: TextLine = document.lineAt(lineNumber);

                if (isDataLine(line.text)) {
                    let data: ImpexDataLine = new ImpexDataLine(line);
                    let header: ImpexDataLine = this.findHeaderFor(line, document);
                    let columnIndex: number = data.columnIndexOfPostion(primarySelection.active.character);
                    let headerColumnRange: Range = header.rangeForColumnAtIndex(columnIndex);

                    editor.setDecorations(columnHighlighterDecoration , [headerColumnRange]);
                } else {
                    this.resetDecorations(editor);
                }
            } else {
                this.resetDecorations(editor);
            }
        }
    }

    private findHeaderFor(line: TextLine, doc: TextDocument): ImpexHeaderLine {

        // start at the line above and go up till the end of the document
        for (let i = line.lineNumber - 1; i >= 0; i--) {
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
