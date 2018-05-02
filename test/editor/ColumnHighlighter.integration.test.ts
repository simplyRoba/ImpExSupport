
import * as vscode from "vscode";
import * as path from "path";
import { expect } from "chai";
import { createStubInstance } from "sinon";
import { TestColumnHiglighterImpex } from "../resources/resources";
import { ColumnHighlighter } from "../../src/editor/ColumnHighlighter";

suite("ColumnHighlighter Integration Test", () => {

    test("should decorate header", () => {
        vscode.workspace.openTextDocument(TestColumnHiglighterImpex).then((document) => {
            let columnHighlighter: ColumnHighlighter = new ColumnHighlighter();
            // columnHighlighter.selectionChanged();
        }, (error) => {
            expect.fail(error);
        });
    });

    test("", () => {

    });
});

function createSelectionChangeEvent(): vscode.TextEditorSelectionChangeEvent {
    return null;
}