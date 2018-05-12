
import { ImpexHeaderLine } from "../../src/model/ImpexHeaderLine";
import { TextLine, Range } from "vscode";
import { expect } from "chai";
import { mock } from "ts-mockito";

suite("ImpexHeaderLine Integration Test", () => {

    test("should not instantiate on invalid line", () => {
        expect(() => new ImpexHeaderLine(createTextLine(8, ""))).to.throw(Error);
        expect(() => new ImpexHeaderLine(createTextLine(34, "#;item;"))).to.throw(Error);
        expect(() => new ImpexHeaderLine(createTextLine(65, ";Item;;2342;231;"))).to.throw(Error);
    });

    test("should return the correct column count", () => {
        let line1: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(67, "UPDATE Component;;field1;field2;attribute"));
        let line2: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(12, "INSERT_UPDATE Product;;;list[mode=append];;field"));

        let columns1: string[] = line1.getColumns();
        let columns2: string[] = line2.getColumns();

        expect(columns1.length).to.be.equals(5);
        expect(columns2.length).to.be.equals(6);
    });

});

function createTextLine(lineNumber: number, text: string): TextLine {
    return {
        lineNumber: lineNumber,
        text: text,
        range: mock(Range),
        rangeIncludingLineBreak: mock(Range),
        firstNonWhitespaceCharacterIndex: 0,
        isEmptyOrWhitespace: false,
    };
}