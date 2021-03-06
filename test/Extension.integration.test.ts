
import { Extension, workspace, window, extensions } from "vscode";
import { expect } from "chai";
import { Sample1Impex } from "./Resources";

suite("Extension Integration Test", () => {

    test("should get activated by opening an impex file", () => {
        workspace.openTextDocument(Sample1Impex).then((document) => {

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
