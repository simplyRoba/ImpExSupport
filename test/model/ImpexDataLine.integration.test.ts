
import { ImpexDataLine } from "../../src/model/ImpexDataLine";
import { TextLine, Range } from "vscode";
import { expect } from "chai";
import { createStubInstance } from "sinon";

suite("ImpexDataLine Integration Test", () => {

    test("should not instantiate on invalid line", () => {
        expect(() => new ImpexDataLine(createTextLine(8, ""))).to.throw(Error);
        expect(() => new ImpexDataLine(createTextLine(34, "#;item;"))).to.throw(Error);
    });

    test("should return the correct column count", () => {
        let line1: ImpexDataLine = new ImpexDataLine(createTextLine(67, ";;\"string\";45;;"));
        let line2: ImpexDataLine = new ImpexDataLine(createTextLine(12, ";   ;  ergR;535;    ;f454"));
        let line3: ImpexDataLine = new ImpexDataLine(createTextLine(21, ";\"String1\";\"String2\";535;uhefuwebf;f454;"));

        let columns1: string[] = line1.getColumns();
        let columns2: string[] = line2.getColumns();
        let columns3: string[] = line3.getColumns();

        expect(columns1.length).to.be.equals(6);
        expect(columns2.length).to.be.equals(6);
        expect(columns3.length).to.be.equals(7);
    });

    test("should ignore semicolons on strings in column", () => {
        let line1: ImpexDataLine = new ImpexDataLine(createTextLine(34, ";;  \"str;ing\"   ;45;;"));
        let line2: ImpexDataLine = new ImpexDataLine(createTextLine(43, ";;\"str;\"\"ing\";45;;  \"str;ing\"   "));

        let columns1: string[] = line1.getColumns();
        let columns2: string[] = line2.getColumns();

        expect(columns1.length).to.be.equals(6);
        expect(columns2.length).to.be.equals(6);
    });

    test("length of the last column should be correct", () => {
        let line1: ImpexDataLine = new ImpexDataLine(createTextLine(23, ";;testRow10;4634;\"ein#s\""));
        let line2: ImpexDataLine = new ImpexDataLine(createTextLine(12, ";   ;  ergR;535;    ;f454"));

        let columns1: string[] = line1.getColumns();
        let columns2: string[] = line2.getColumns();

        expect(columns1[4].length).to.be.equals(7);
        expect(columns2[5].length).to.be.equals(4);
    });
});

function createTextLine(lineNumber: number, text: string): TextLine {
    return {
        lineNumber: lineNumber,
        text: text,
        range: createStubInstance(Range),
        rangeIncludingLineBreak: createStubInstance(Range),
        firstNonWhitespaceCharacterIndex: 0,
        isEmptyOrWhitespace: false,
    };
}