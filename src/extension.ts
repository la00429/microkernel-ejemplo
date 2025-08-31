import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Quick Snippet Inserter está activo!');

    // Registrar el comando principal
    let disposable = vscode.commands.registerCommand('quickSnippet.insertSnippet', () => {
        // Por ahora solo mostramos un mensaje de información
        vscode.window.showInformationMessage('¡Hola desde Quick Snippet Inserter!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('👋 Quick Snippet Inserter desactivado');
} 