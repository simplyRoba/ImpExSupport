
import { isHeaderLine, isDataLine } from "../src/ImpexUtil";
import { expect } from "chai";

suite("Impex Util Test", () => {
    test("recognizes header line", () => {

        let result1: boolean = isHeaderLine("INSERT Item;code[unique=true];attribute;");
        let result2: boolean = isHeaderLine("INSERT_UPDATE Item;code[unique=true];attribute;ref(id, version)");
        let result3: boolean = isHeaderLine("UPDATE Item;code;$variable");
        let result4: boolean = isHeaderLine("REMOVE Product;name[lang=en];");
        let result5: boolean = isHeaderLine("REMOVE ;code");
        let result6: boolean = isHeaderLine("#REMOVE Product;name[lang=en];");

        expect(result1).to.be.true;
        expect(result2).to.be.true;
        expect(result3).to.be.true;
        expect(result4).to.be.true;
        expect(result5).to.be.false;
        expect(result6).to.be.false;
    });

    test("recognizes data line", () => {

        let result1: boolean = isDataLine(";;;;;;;");
        let result2: boolean = isDataLine("Item;");
        let result3: boolean = isDataLine(";;\"string\";45;;");
        let result4: boolean = isDataLine(";   ;  ergR;535;    ;f454;");
        let result5: boolean = isDataLine("");
        let result6: boolean = isDataLine("#;this;is;a;comment");

        expect(result1).to.be.true;
        expect(result2).to.be.true;
        expect(result3).to.be.true;
        expect(result4).to.be.true;
        expect(result5).to.be.false;
        expect(result6).to.be.false;
    });
});