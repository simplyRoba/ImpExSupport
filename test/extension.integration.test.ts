
import { activate } from "../src/extension";
import { ExtensionContext, Memento, extensions, Extension, workspace, window } from "vscode";
import { spy, mock, verify } from "ts-mockito/lib/ts-mockito";
import { expect } from "chai";
import { TestColumnHiglighterImpex } from "./resources";


suite("Extension Integration Test", () => {

    test("should get activated by opening an impex file", () => {
        workspace.openTextDocument(TestColumnHiglighterImpex).then((document) => {

            window.showTextDocument(document).then((editor) => {
                let extension: Extension<any> = extensions.getExtension("simplyRoba.impex-support");
                expect(extension.isActive).to.be.true;
            }, (error) => {
                expect.fail(error, null, error.message);
            });
        }, (error) => {
            expect.fail(error, null, error.message);
        });
    });
});
