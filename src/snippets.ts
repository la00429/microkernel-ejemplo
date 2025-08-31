// Interfaz para definir un snippet
export interface Snippet {
    name: string;
    description: string;
    content: string;
    language?: string;
    category: string;
    prefix?: string;
}

// Interfaz para variables dinámicas en snippets
export interface SnippetVariable {
    name: string;
    description: string;
    defaultValue: string;
}

// Snippets de JavaScript/TypeScript
const javascriptSnippets: Snippet[] = [
    {
        name: 'console.log',
        description: 'Log de consola básico',
        content: 'console.log("${1:mensaje}");$0',
        language: 'javascript',
        category: 'Debug',
        prefix: 'cl'
    },
    {
        name: 'console.error',
        description: 'Log de error en consola',
        content: 'console.error("${1:error}");$0',
        language: 'javascript',
        category: 'Debug',
        prefix: 'ce'
    },
    {
        name: 'function',
        description: 'Función básica de JavaScript',
        content: 'function ${1:nombreFuncion}(${2:parametros}) {\n\t${3:// código aquí}\n\treturn ${4:valor};\n}$0',
        language: 'javascript',
        category: 'Functions',
        prefix: 'fn'
    },
    {
        name: 'arrow-function',
        description: 'Función flecha de ES6',
        content: 'const ${1:nombreFuncion} = (${2:parametros}) => {\n\t${3:// código aquí}\n\treturn ${4:valor};\n};$0',
        language: 'javascript',
        category: 'Functions',
        prefix: 'af'
    },
    {
        name: 'async-function',
        description: 'Función asíncrona',
        content: 'async function ${1:nombreFuncion}(${2:parametros}) {\n\ttry {\n\t\t${3:// código aquí}\n\t\treturn ${4:valor};\n\t} catch (error) {\n\t\tconsole.error("Error:", error);\n\t\tthrow error;\n\t}\n}$0',
        language: 'javascript',
        category: 'Functions',
        prefix: 'afn'
    },
    {
        name: 'class',
        description: 'Clase básica de JavaScript',
        content: 'class ${1:NombreClase} {\n\tconstructor(${2:parametros}) {\n\t\t${3:// inicialización}\n\t}\n\n\t${4:// métodos}\n}$0',
        language: 'javascript',
        category: 'Classes',
        prefix: 'cls'
    },
    {
        name: 'try-catch',
        description: 'Bloque try-catch',
        content: 'try {\n\t${1:// código que puede fallar}\n} catch (${2:error}) {\n\tconsole.error("Error:", ${2:error});\n\t${3:// manejo del error}\n}$0',
        language: 'javascript',
        category: 'Error Handling',
        prefix: 'tc'
    },
    {
        name: 'for-loop',
        description: 'Bucle for tradicional',
        content: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${3:// código del bucle}\n\tconsole.log(${2:array}[${1:i}]);\n}$0',
        language: 'javascript',
        category: 'Loops',
        prefix: 'for'
    },
    {
        name: 'for-of',
        description: 'Bucle for...of',
        content: 'for (const ${1:item} of ${2:array}) {\n\t${3:// código del bucle}\n\tconsole.log(${1:item});\n}$0',
        language: 'javascript',
        category: 'Loops',
        prefix: 'fof'
    },
    {
        name: 'if-else',
        description: 'Estructura condicional if-else',
        content: 'if (${1:condicion}) {\n\t${2:// código si es verdadero}\n} else {\n\t${3:// código si es falso}\n}$0',
        language: 'javascript',
        category: 'Conditionals',
        prefix: 'if'
    }
];

// Snippets de HTML
const htmlSnippets: Snippet[] = [
    {
        name: 'html5-boilerplate',
        description: 'Plantilla HTML5 básica',
        content: '<!DOCTYPE html>\n<html lang="${1:es}">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${2:Título}</title>\n</head>\n<body>\n\t${3:<!-- Contenido aquí -->}\n</body>\n</html>$0',
        language: 'html',
        category: 'Boilerplate',
        prefix: 'html5'
    },
    {
        name: 'div-class',
        description: 'Div con clase CSS',
        content: '<div class="${1:nombre-clase}">\n\t${2:<!-- Contenido -->}\n</div>$0',
        language: 'html',
        category: 'Elements',
        prefix: 'div'
    },
    {
        name: 'form-basic',
        description: 'Formulario básico',
        content: '<form action="${1:#}" method="${2:post}">\n\t<label for="${3:campo}">${4:Etiqueta}:</label>\n\t<input type="${5:text}" id="${3:campo}" name="${3:campo}" required>\n\t<button type="submit">${6:Enviar}</button>\n</form>$0',
        language: 'html',
        category: 'Forms',
        prefix: 'form'
    }
];

// Snippets de CSS
const cssSnippets: Snippet[] = [
    {
        name: 'flexbox-center',
        description: 'Centrar con Flexbox',
        content: '.${1:contenedor} {\n\tdisplay: flex;\n\tjustify-content: center;\n\talign-items: center;\n\t${2:/* Altura opcional */}\n\theight: ${3:100vh};\n}$0',
        language: 'css',
        category: 'Layout',
        prefix: 'flex-center'
    },
    {
        name: 'grid-template',
        description: 'Plantilla básica de CSS Grid',
        content: '.${1:grid-container} {\n\tdisplay: grid;\n\tgrid-template-columns: ${2:repeat(3, 1fr)};\n\tgrid-gap: ${3:1rem};\n\t${4:/* Propiedades adicionales */}\n}$0',
        language: 'css',
        category: 'Layout',
        prefix: 'grid'
    },
    {
        name: 'media-query',
        description: 'Media query responsive',
        content: '@media (max-width: ${1:768px}) {\n\t${2:/* Estilos para dispositivos móviles */}\n\t.${3:clase} {\n\t\t${4:/* Propiedades */}\n\t}\n}$0',
        language: 'css',
        category: 'Responsive',
        prefix: 'mq'
    }
];

// Snippets de Python
const pythonSnippets: Snippet[] = [
    {
        name: 'print-debug',
        description: 'Print de debug',
        content: 'print(f"${1:variable}: {${1:variable}}")$0',
        language: 'python',
        category: 'Debug',
        prefix: 'pd'
    },
    {
        name: 'def-function',
        description: 'Función de Python',
        content: 'def ${1:nombre_funcion}(${2:parametros}):\n\t"""${3:Descripción de la función}"""\n\t${4:# código aquí}\n\treturn ${5:valor}$0',
        language: 'python',
        category: 'Functions',
        prefix: 'def'
    },
    {
        name: 'class-python',
        description: 'Clase de Python',
        content: 'class ${1:NombreClase}:\n\t"""${2:Descripción de la clase}"""\n\t\n\tdef __init__(self, ${3:parametros}):\n\t\t${4:# inicialización}\n\t\tpass\n\t\n\tdef ${5:metodo}(self):\n\t\t${6:# código del método}\n\t\tpass$0',
        language: 'python',
        category: 'Classes',
        prefix: 'class'
    },
    {
        name: 'try-except',
        description: 'Bloque try-except',
        content: 'try:\n\t${1:# código que puede fallar}\n\tpass\nexcept ${2:Exception} as ${3:e}:\n\tprint(f"Error: {${3:e}}")\n\t${4:# manejo del error}$0',
        language: 'python',
        category: 'Error Handling',
        prefix: 'try'
    }
];

// Combinar todos los snippets
export const allSnippets: Snippet[] = [
    ...javascriptSnippets,
    ...htmlSnippets,
    ...cssSnippets,
    ...pythonSnippets
];

// Función para obtener snippets por lenguaje
export function getSnippetsByLanguage(language: string): Snippet[] {
    return allSnippets.filter(snippet => 
        snippet.language === language || snippet.language === undefined
    );
}

// Función para obtener snippets por categoría
export function getSnippetsByCategory(category: string): Snippet[] {
    return allSnippets.filter(snippet => snippet.category === category);
}

// Función para obtener todas las categorías
export function getAllCategories(): string[] {
    const categories = new Set(allSnippets.map(snippet => snippet.category));
    return Array.from(categories).sort();
}

// Función para obtener todos los lenguajes
export function getAllLanguages(): string[] {
    const languages = new Set(
        allSnippets
            .map(snippet => snippet.language)
            .filter((lang): lang is string => lang !== undefined)
    );
    return Array.from(languages).sort();
}

// Función para buscar snippets por texto
export function searchSnippets(query: string): Snippet[] {
    const lowerQuery = query.toLowerCase();
    return allSnippets.filter(snippet => 
        snippet.name.toLowerCase().includes(lowerQuery) ||
        snippet.description.toLowerCase().includes(lowerQuery) ||
        snippet.category.toLowerCase().includes(lowerQuery) ||
        (snippet.prefix && snippet.prefix.toLowerCase().includes(lowerQuery))
    );
} 