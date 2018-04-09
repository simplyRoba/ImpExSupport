
import { ExtensionContext } from 'vscode';
import { ColumnHighlighter } from './editor/ColumnHighlighter';


// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ImpEx Support" is now active!');

    let columnHighlighter = new ColumnHighlighter();

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(columnHighlighter);
}