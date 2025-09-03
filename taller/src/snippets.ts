// TODO: Paso 3 - Definir interface Snippet
// Pista: Debe incluir id, name, description, content, language, category, prefix

export interface Snippet {
    // TODO: Completar definicion de la interface
}

// TODO: Paso 3 - Crear array de snippets predefinidos
export const predefinedSnippets: Snippet[] = [
    // TODO: Agregar snippets aqui
    // Ejemplo:
    // {
    //     id: 'js-console-log',
    //     name: 'console.log',
    //     description: 'Log basico de consola',
    //     content: 'console.log(${1:mensaje});$0',
    //     language: 'javascript',
    //     category: 'Debug',
    //     prefix: 'cl'
    // }
];

// TODO: Paso 3 - Implementar funciones de filtrado
export function getSnippetsByLanguage(language: string): Snippet[] {
    // TODO: Filtrar snippets por lenguaje
    return [];
}

export function getSnippetsByCategory(category: string): Snippet[] {
    // TODO: Filtrar snippets por categoria
    return [];
}
