# Markdown to HTML Converter

Este proyecto es una herramienta de conversión que transforma archivos Markdown en archivos HTML. Diseñado para manejar varios elementos de Markdown como encabezados, listas, enlaces, imágenes, y más, este conversor facilita la visualización de documentos Markdown en navegadores web.

## Estructura del Proyecto

El proyecto está organizado en varias carpetas principales:

- `/src`: Contiene el código fuente del conversor.

  - `main.js`: El punto de entrada del script que ejecuta la conversión.
  - `handleMarkdown.js`: Procesa el markdown detectando y manejando diferentes elementos.
  - `markdownElements.js`: Define las funciones para detectar y transformar elementos específicos de Markdown.
  - `/assets`: Almacena recursos estáticos como imágenes utilizadas en los tests.
  - `/utils`: Incluye utilidades generales como la importación de archivos y funciones auxiliares.

- `/tests`: Contiene archivos Markdown usados para probar el conversor.

## Requisitos

Para ejecutar este proyecto, necesitas tener instalado [Node.js](https://nodejs.org/). Esto te permitirá correr el script de conversión usando Node.

## Ejecución

Para convertir un archivo Markdown a HTML, sigue estos pasos:

1. Asegúrate de estar en la carpeta `/src` del proyecto:

   ```sh
   cd src
   ```

2. Ejecuta el script principal usando Node.js:
   ```sh
   node main.js
   ```

Al correr este comando, el script leerá un archivo Markdown especificado dentro de `main.js`, lo convertirá a HTML y guardará el resultado en un archivo `result.html` dentro de la carpeta `/src`.

## Especificar el Archivo de Prueba

Para elegir qué archivo Markdown convertir a HTML, debes modificar la constante `filePath` dentro de la función `main` en `main.js`. Por ejemplo:

```
function main() {
    const filePath = "../tests/nombreDeTuArchivo.md"; // Cambia esto por el path de tu archivo de prueba
    ...
}
```

## Enfoque general

El proceso de conversión de Markdown a HTML se basa en un enfoque recursivo implementado principalmente a través de la función handleReadFile en handleMarkdown.js. En cada iteración, esta función llama a handleMarkdown para procesar la línea actual del archivo Markdown y va concatenando el resultado en la variable translation. Este enfoque permite manejar estructuras anidadas y repetitivas de Markdown de manera eficiente y ordenada, asegurando que todos los elementos sean procesados adecuadamente antes de generar el archivo HTML final.
