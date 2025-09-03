import * as vscode from 'vscode';
import { Snippet } from './snippets';

// TODO: Paso 4 - Implementar showSnippetPicker
export async function showSnippetPicker(snippets: Snippet[]): Promise<Snippet | undefined> {
    // TODO: Crear QuickPick items desde snippets
    // Pista: Mapear snippets a vscode.QuickPickItem[]
    
    // TODO: Mostrar QuickPick y retornar snippet seleccionado
    // Pista: Usar vscode.window.showQuickPick()
    
    return undefined;
}

// TODO: Paso 4 - Implementar showMainMenu
export async function showMainMenu(): Promise<string | undefined> {
    // TODO: Crear opciones del menu principal
    // TODO: Mostrar selector y retornar accion seleccionada
    
    return undefined;
}

// TODO: Paso 4 - Implementar mas funciones de interfaz segun necesidades
