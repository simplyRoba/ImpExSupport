
import { ExtensionContext } from "vscode";
import { ColumnHighlighter } from "./editor/ColumnHighlighter";

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    let columnHighlighter: ColumnHighlighter = new ColumnHighlighter();
    columnHighlighter.init();

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(columnHighlighter);
}