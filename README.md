
# Alquimistas del Café – Realidad Aumentada

Este repositorio contiene la experiencia AR basada en escaneo de la etiqueta de Alquimistas.

## 📦 Estructura
- `index.html`: Página principal con escaneo de etiqueta
- `contenido.html`: Página de destino para contenido exclusivo
- `isologo.svg`: Logo sobreimpreso en la experiencia AR
- `etiqueta_target.jpg`: Imagen entrenable para generar el archivo `targets.mind`
- `targets.mind`: Archivo necesario para detección (debe generarse con MindAR CLI)

## ⚙️ Cómo publicar en GitHub Pages

1. Subí todos estos archivos a un repositorio de GitHub.
2. Andá a `Settings > Pages`.
3. En "Source", elegí la rama `main` y la carpeta `/ (root)`.
4. Guardá y accedé desde `https://tuusuario.github.io/nombre-del-repo`.

## 🧠 Cómo generar el archivo targets.mind

1. Instalá Node.js si no lo tenés.
2. Instalá MindAR CLI:
   npm install -g @mindar/cli
3. Generá el archivo con:
   mindar compile --input etiqueta_target.jpg --output targets.mind

Una vez generado, reemplazá el archivo `targets.mind` por el nuevo.

---

¡Listo! Ahora podés invitar a tus consumidorxs a escanear sus etiquetas y entrar al mundo mágico de los Alquimistas del Café.
