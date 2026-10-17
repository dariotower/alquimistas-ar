# Tierra — Alquimistas del Café, prueba de relieve WebAR

Reconoce exclusivamente el frente derecho de la etiqueta suministrada en `ETIQUETA 2025.pdf`, recortado dentro de las marcas de corte. No utiliza ni reemplaza el antiguo target del repositorio.

## Uso

Abrir `index.html` desde HTTPS (GitHub Pages) o un servidor en localhost. Elegir **Abrir cámara**, permitir el acceso y encuadrar el frente completo con buena iluminación. Para inspeccionar la geometría sin cámara, elegir **Explorar el relieve sin cámara** y arrastrar. El control **Relieve** permite comparar la imagen plana con el volumen.

## Alcance

- La imagen impresa sirve de referencia para estimar posición, escala y orientación.
- El triángulo conserva su textura y se proyecta sobre una malla triangular con profundidad. El resto del frente permanece plano.
- No reconstruye la forma, los pliegues ni la profundidad física de la bolsa negra. No es un escaneo 3D del envase.
- Para máxima estabilidad, mantener el frente liso. Las deformaciones, los reflejos y las oclusiones pueden interrumpir el seguimiento.
- La cámara se procesa en el dispositivo. Esta prueba no envía imágenes, no graba y no incorpora analítica.
- No contiene aún videos, voz, compras ni la campaña de comunidad: es una prueba del reconocimiento y el relieve.

## Verificación

Probada en Chrome de escritorio con un flujo de cámara simulado: reconocimiento del frente, seguimiento con rotación, pérdida y recuperación de la referencia. Probados además el visor sin cámara, el regulador y el cierre. Falta probar sobre la bolsa física con Safari/iPhone y Chrome/Android antes de considerarla lista para lanzamiento.

## Dependencias

MindAR 1.2.5 (MIT), Three.js 0.160.0 (MIT). Dependencias locales, sin CDN durante el uso. La integración de MindAR incluye dos ajustes mínimos: conservar el error original al denegar cámara y retirar su manejador de resize al cerrar. Licencias junto al código.

Fuentes técnicas: https://hiukim.github.io/mind-ar-js-doc/ y https://threejs.org/.
