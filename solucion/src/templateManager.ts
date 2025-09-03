import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Snippet } from './snippets';

// Interfaz para plantillas de usuario
export interface UserTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
    language?: string;
    category: string;
    prefix?: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
}

// Interfaz para archivo de plantillas
export interface TemplateFile {
    version: string;
    templates: UserTemplate[];
    metadata: {
        name: string;
        description?: string;
        author?: string;
        createdAt: string;
        updatedAt: string;
    };
}

export class TemplateManager {
    private context: vscode.ExtensionContext;
    private userTemplates: UserTemplate[] = [];
    private templatesPath: string;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.templatesPath = path.join(context.globalStorageUri?.fsPath || '', 'user-templates.json');
        this.ensureTemplatesDirectory();
        this.loadUserTemplates();
    }

    // Asegurar que el directorio de plantillas existe
    private ensureTemplatesDirectory(): void {
        try {
            const dir = path.dirname(this.templatesPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        } catch (error) {
            console.error('Error creando directorio de plantillas:', error);
        }
    }

    // Cargar plantillas de usuario desde archivo
    private loadUserTemplates(): void {
        try {
            if (fs.existsSync(this.templatesPath)) {
                const fileContent = fs.readFileSync(this.templatesPath, 'utf8');
                const templateFile: TemplateFile = JSON.parse(fileContent);
                this.userTemplates = templateFile.templates || [];
                console.log(`Cargadas ${this.userTemplates.length} plantillas de usuario`);
            } else {
                // Crear archivo inicial si no existe
                this.saveUserTemplates();
            }
        } catch (error) {
            console.error('Error cargando plantillas de usuario:', error);
            vscode.window.showErrorMessage('Error al cargar plantillas personalizadas');
            this.userTemplates = [];
        }
    }

    // Guardar plantillas de usuario a archivo
    private saveUserTemplates(): void {
        try {
            const templateFile: TemplateFile = {
                version: '1.0.0',
                templates: this.userTemplates,
                metadata: {
                    name: 'Plantillas Personalizadas',
                    description: 'Snippets personalizados del usuario',
                    author: 'Usuario',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            fs.writeFileSync(this.templatesPath, JSON.stringify(templateFile, null, 2), 'utf8');
            console.log('Plantillas de usuario guardadas correctamente');
        } catch (error) {
            console.error('Error guardando plantillas de usuario:', error);
            vscode.window.showErrorMessage('Error al guardar plantillas personalizadas');
        }
    }

    // Obtener todas las plantillas de usuario
    public getUserTemplates(): UserTemplate[] {
        return [...this.userTemplates];
    }

    // Convertir plantillas de usuario a snippets
    public getUserSnippets(): Snippet[] {
        return this.userTemplates.map(template => ({
            name: template.name,
            description: template.description,
            content: template.content,
            language: template.language,
            category: template.category,
            prefix: template.prefix
        }));
    }

    // Crear nueva plantilla
    public async createTemplate(): Promise<void> {
        try {
            // Obtener información básica
            const name = await vscode.window.showInputBox({
                prompt: 'Nombre del snippet',
                placeHolder: 'Ej: mi-funcion-util',
                validateInput: (value) => {
                    if (!value.trim()) return 'El nombre es obligatorio';
                    if (this.userTemplates.some(t => t.name === value.trim())) {
                        return 'Ya existe un snippet con ese nombre';
                    }
                    return null;
                }
            });

            if (!name) return;

            const description = await vscode.window.showInputBox({
                prompt: 'Descripción del snippet',
                placeHolder: 'Ej: Función útil para...'
            });

            if (!description) return;

            // Seleccionar categoría
            const categories = ['Custom', 'Functions', 'Classes', 'Debug', 'Loops', 'Conditionals', 'Other'];
            const category = await vscode.window.showQuickPick(categories, {
                placeHolder: 'Selecciona una categoría'
            });

            if (!category) return;

            // Seleccionar lenguaje
            const languages = ['javascript', 'typescript', 'html', 'css', 'python', 'java', 'csharp', 'other'];
            const language = await vscode.window.showQuickPick(languages, {
                placeHolder: 'Selecciona un lenguaje (opcional)',
                canPickMany: false
            });

            const prefix = await vscode.window.showInputBox({
                prompt: 'Prefijo para autocompletado (opcional)',
                placeHolder: 'Ej: mfu'
            });

            // Obtener contenido del snippet
            const content = await vscode.window.showInputBox({
                prompt: 'Contenido del snippet',
                placeHolder: 'Ej: function ${1:nombre}() { ${2:// código} }',
                value: 'function ${1:nombre}() {\n\t${2:// código aquí}\n\treturn ${3:valor};\n}$0'
            });

            if (!content) return;

            // Crear la plantilla
            const template: UserTemplate = {
                id: this.generateId(),
                name: name.trim(),
                description: description.trim(),
                content: content,
                language: language === 'other' ? undefined : language,
                category,
                prefix: prefix?.trim() || undefined,
                author: 'Usuario',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.userTemplates.push(template);
            this.saveUserTemplates();

            vscode.window.showInformationMessage(`✅ Snippet "${name}" creado correctamente`);
        } catch (error) {
            console.error('Error creando plantilla:', error);
            vscode.window.showErrorMessage('Error al crear el snippet personalizado');
        }
    }

    // Editar plantilla existente
    public async editTemplate(): Promise<void> {
        try {
            if (this.userTemplates.length === 0) {
                vscode.window.showInformationMessage('No hay snippets personalizados para editar');
                return;
            }

            // Seleccionar plantilla para editar
            const templateItems = this.userTemplates.map(template => ({
                label: `$(symbol-snippet) ${template.name}`,
                description: `${template.category} - ${template.description}`,
                detail: `Lenguaje: ${template.language || 'Cualquiera'}`,
                template
            }));

            const selectedItem = await vscode.window.showQuickPick(templateItems, {
                placeHolder: 'Selecciona el snippet a editar'
            });

            if (!selectedItem) return;

            const template = selectedItem.template;

            // Editar propiedades
            const newName = await vscode.window.showInputBox({
                prompt: 'Nombre del snippet',
                value: template.name,
                validateInput: (value) => {
                    if (!value.trim()) return 'El nombre es obligatorio';
                    if (value.trim() !== template.name && 
                        this.userTemplates.some(t => t.name === value.trim())) {
                        return 'Ya existe un snippet con ese nombre';
                    }
                    return null;
                }
            });

            if (!newName) return;

            const newDescription = await vscode.window.showInputBox({
                prompt: 'Descripción del snippet',
                value: template.description
            });

            if (!newDescription) return;

            const newContent = await vscode.window.showInputBox({
                prompt: 'Contenido del snippet',
                value: template.content
            });

            if (!newContent) return;

            // Actualizar plantilla
            template.name = newName.trim();
            template.description = newDescription.trim();
            template.content = newContent;
            template.updatedAt = new Date().toISOString();

            this.saveUserTemplates();

            vscode.window.showInformationMessage(`✅ Snippet "${template.name}" actualizado correctamente`);
        } catch (error) {
            console.error('Error editando plantilla:', error);
            vscode.window.showErrorMessage('Error al editar el snippet personalizado');
        }
    }

    // Eliminar plantilla
    public async deleteTemplate(): Promise<void> {
        try {
            if (this.userTemplates.length === 0) {
                vscode.window.showInformationMessage('No hay snippets personalizados para eliminar');
                return;
            }

            // Seleccionar plantilla para eliminar
            const templateItems = this.userTemplates.map(template => ({
                label: `$(trash) ${template.name}`,
                description: `${template.category} - ${template.description}`,
                detail: `Lenguaje: ${template.language || 'Cualquiera'}`,
                template
            }));

            const selectedItem = await vscode.window.showQuickPick(templateItems, {
                placeHolder: 'Selecciona el snippet a eliminar'
            });

            if (!selectedItem) return;

            // Confirmar eliminación
            const confirmMessage = `¿Estás seguro de que quieres eliminar "${selectedItem.template.name}"?`;
            const confirm = await vscode.window.showWarningMessage(
                confirmMessage,
                { modal: true },
                'Eliminar'
            );

            if (confirm === 'Eliminar') {
                const index = this.userTemplates.findIndex(t => t.id === selectedItem.template.id);
                if (index !== -1) {
                    this.userTemplates.splice(index, 1);
                    this.saveUserTemplates();
                    vscode.window.showInformationMessage(`✅ Snippet "${selectedItem.template.name}" eliminado`);
                }
            }
        } catch (error) {
            console.error('Error eliminando plantilla:', error);
            vscode.window.showErrorMessage('Error al eliminar el snippet personalizado');
        }
    }

    // Importar plantillas desde archivo
    public async importTemplates(): Promise<void> {
        try {
            const fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                filters: {
                    'JSON': ['json']
                },
                openLabel: 'Importar Plantillas'
            });

            if (!fileUri || fileUri.length === 0) return;

            const filePath = fileUri[0].fsPath;
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const importedFile: TemplateFile = JSON.parse(fileContent);

            if (!importedFile.templates || !Array.isArray(importedFile.templates)) {
                vscode.window.showErrorMessage('Archivo de plantillas inválido');
                return;
            }

            let importedCount = 0;
            let skippedCount = 0;

            for (const template of importedFile.templates) {
                // Verificar si ya existe una plantilla con el mismo nombre
                if (this.userTemplates.some(t => t.name === template.name)) {
                    skippedCount++;
                    continue;
                }

                // Agregar ID si no tiene
                if (!template.id) {
                    template.id = this.generateId();
                }

                this.userTemplates.push(template);
                importedCount++;
            }

            this.saveUserTemplates();

            vscode.window.showInformationMessage(
                `✅ Importación completada: ${importedCount} plantillas importadas, ${skippedCount} omitidas (nombres duplicados)`
            );
        } catch (error) {
            console.error('Error importando plantillas:', error);
            vscode.window.showErrorMessage('Error al importar plantillas');
        }
    }

    // Exportar plantillas a archivo
    public async exportTemplates(): Promise<void> {
        try {
            if (this.userTemplates.length === 0) {
                vscode.window.showInformationMessage('No hay snippets personalizados para exportar');
                return;
            }

            const fileUri = await vscode.window.showSaveDialog({
                filters: {
                    'JSON': ['json']
                },
                defaultUri: vscode.Uri.file('mis-snippets.json'),
                saveLabel: 'Exportar Plantillas'
            });

            if (!fileUri) return;

            const templateFile: TemplateFile = {
                version: '1.0.0',
                templates: this.userTemplates,
                metadata: {
                    name: 'Plantillas Exportadas',
                    description: 'Snippets personalizados exportados',
                    author: 'Usuario',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            fs.writeFileSync(fileUri.fsPath, JSON.stringify(templateFile, null, 2), 'utf8');

            vscode.window.showInformationMessage(
                `✅ ${this.userTemplates.length} plantillas exportadas correctamente`
            );
        } catch (error) {
            console.error('Error exportando plantillas:', error);
            vscode.window.showErrorMessage('Error al exportar plantillas');
        }
    }

    // Abrir archivo de plantillas en editor
    public async openTemplatesFile(): Promise<void> {
        try {
            const uri = vscode.Uri.file(this.templatesPath);
            await vscode.window.showTextDocument(uri);
        } catch (error) {
            console.error('Error abriendo archivo de plantillas:', error);
            vscode.window.showErrorMessage('Error al abrir archivo de plantillas');
        }
    }

    // Recargar plantillas desde archivo
    public reloadTemplates(): void {
        this.loadUserTemplates();
        vscode.window.showInformationMessage('✅ Plantillas recargadas');
    }

    // Generar ID único
    private generateId(): string {
        return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Crear plantilla desde datos del asistente
    public async createTemplateFromData(data: {
        name: string;
        description: string;
        content: string;
        language?: string;
        category: string;
        prefix?: string;
    }): Promise<void> {
        try {
            // Verificar que no existe una plantilla con el mismo nombre
            if (this.userTemplates.some(t => t.name === data.name)) {
                throw new Error(`Ya existe un snippet con el nombre "${data.name}"`);
            }

            // Crear la plantilla
            const template: UserTemplate = {
                id: this.generateId(),
                name: data.name,
                description: data.description,
                content: data.content,
                language: data.language,
                category: data.category,
                prefix: data.prefix,
                author: 'Usuario',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.userTemplates.push(template);
            this.saveUserTemplates();

            console.log(`Plantilla "${data.name}" creada correctamente`);
        } catch (error) {
            console.error('Error creando plantilla desde datos:', error);
            throw error;
        }
    }

    // Obtener estadísticas
    public getStats(): { total: number; byLanguage: Record<string, number>; byCategory: Record<string, number> } {
        const byLanguage: Record<string, number> = {};
        const byCategory: Record<string, number> = {};

        this.userTemplates.forEach(template => {
            const lang = template.language || 'other';
            const cat = template.category;

            byLanguage[lang] = (byLanguage[lang] || 0) + 1;
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });

        return {
            total: this.userTemplates.length,
            byLanguage,
            byCategory
        };
    }
} 