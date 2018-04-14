
import { TextEditorDecorationType, window, Disposable } from "vscode";

const seperatorHighlighterDecoration: TextEditorDecorationType = window.createTextEditorDecorationType({
    color: "orange"
});

export class SeperatorHighlighter implements Disposable {

    private subscriptions: Disposable[] = [];

    dispose() {
        this.subscriptions.forEach(sub => {
            sub.dispose();
        });
    }
}