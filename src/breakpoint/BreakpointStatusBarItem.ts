import { window, StatusBarAlignment, StatusBarItem } from 'vscode';

export class BreakpointStatusBarItem {
    private statusBarItemTrue: StatusBarItem;
    constructor() {
        this.statusBarItemTrue = window.createStatusBarItem(
            StatusBarAlignment.Left,
            -1
        );
    }
    public setText(title: string) {
        this.statusBarItemTrue.text = title;
    }
    public dispose() {
        this.statusBarItemTrue.dispose();
    }
    public show() {
        this.statusBarItemTrue.show();
    }
    public hide() {
        this.statusBarItemTrue.hide();
    }
}
