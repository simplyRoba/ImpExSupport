
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

    test("should be the correct line number", () => {
        let lineNumber: number = 12;
        let line: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(lineNumber, "INSERT Item;field1;field2;"));

        let range: Range = line.rangeForColumnAtIndex(2);

        expect(range.start.line).to.be.equals(lineNumber);
        expect(range.end.line).to.be.equals(lineNumber);
    });

    test("should return correct range for index", () => {
        let line: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(44, "REMOVE Item;field1;field2;"));

        let range: Range = line.rangeForColumnAtIndex(1);

        expect(range.start.character).to.be.equals(12);
        expect(range.end.character).to.be.equals(18);
    });

    test("range of empty column should be following semicolon", () => {
        let line: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(23, "INSERT Item;;nufun;d"));

        let range: Range = line.rangeForColumnAtIndex(1);

        expect(range.start.character).to.be.equals(12);
        expect(range.end.character).to.be.equals(13);
    });

    test("should return correct index for position", () => {
        let line: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(34, "UPDATE Item;field1;field2;"));

        let index: number = line.columnIndexOfPostion(14);

        expect(index).to.be.equals(1);
    });

    test("should return correct range for position", () => {
        let line: ImpexHeaderLine = new ImpexHeaderLine(createTextLine(12, "UPDATE Item;field[unique=true];field"));

        let range: Range = line.rangeForColumnAtPosition(18);

        expect(range.start.character).to.be.equals(12);
        expect(range.end.character).to.be.equals(30);
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