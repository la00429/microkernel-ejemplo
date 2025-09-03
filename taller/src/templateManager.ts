import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Snippet } from './snippets';

// TODO: Paso 5 - Definir interface para archivo de plantillas
export interface TemplateFile {
    // TODO: Completar definicion
}

export class TemplateManager {
    private userTemplatesPath: string;

    constructor(private context: vscode.ExtensionContext) {
        // TODO: Paso 5 - Configurar ruta de almacenamiento
        // Pista: Usar context.globalStorageUri.fsPath
        this.userTemplatesPath = '';
    }

    async loadUserTemplates(): Promise<Snippet[]> {
        // TODO: Paso 5 - Cargar plantillas del archivo JSON
        // Pista: Usar fs.readFileSync y JSON.parse
        return [];
    }

    async saveUserTemplates(templates: Snippet[]): Promise<void> {
        // TODO: Paso 5 - Guardar plantillas en archivo JSON
        // Pista: Crear estructura TemplateFile y usar fs.writeFileSync
    }

    async addTemplate(template: Snippet): Promise<void> {
        // TODO: Paso 5 - Agregar nuevo template
        // Pista: Cargar existentes, agregar nuevo, guardar
    }

    // TODO: Paso 5 - Implementar mas metodos CRUD segun necesidades
}
