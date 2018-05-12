
import * as path from "path";
import { expect } from "chai";
import { TestColumnHiglighterImpex } from "../Resources";
import { ColumnHighlighter } from "../../src/editor/ColumnHighlighter";
import { Selection, workspace, TextEditor, TextEditorSelectionChangeEvent, TextEditorSelectionChangeKind, window, Position } from "vscode";

suite("ColumnHighlighter Integration Test", () => {

    test.skip("should decorate header", () => {
        workspace.openTextDocument(TestColumnHiglighterImpex).then((document) => {

            window.showTextDocument(document).then((editor) => {

                let pos: Position = new Position(10, 5);
                let selection: Selection = new Selection(pos, pos);

                let columnHighlighter: ColumnHighlighter = new ColumnHighlighter();
                columnHighlighter.selectionChanged(createSelectionChangeEvent(editor, selection));

                // vscode 1.22.1 still not possible to verify if decorations where applied or not
                // https://stackoverflow.com/questions/45472857/testing-vscode-extensions-how-to-verify-that-decorations-are-set
            }, (error) => {
                expect.fail(error, null, error.message);
            });
        }, (error) => {
            expect.fail(error, null, error.message);
        });
    });
});

function createSelectionChangeEvent(editor: TextEditor, selection: Selection): TextEditorSelectionChangeEvent {
    let event: TextEditorSelectionChangeEvent = {
        textEditor: editor,
        selections: [selection],
        kind: TextEditorSelectionChangeKind.Keyboard
    };
    return event;
}