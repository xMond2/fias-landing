# Animaciones de producto

Cada espacio de la web muestra un `iframe` con una de estas animaciones: HTML, CSS y JS, sin video ni librerías.

| Archivo | Espacio en index.html | Loop |
|---|---|---|
| `listas.html` | `#slot-listas` | 21,5 s |
| `boleta.html` | `#slot-boleta` | 23,5 s |
| `ventas.html` | `#slot-ventas` | 14 s |
| `fiados.html` | `#slot-fiados` | 23 s |
| `arca.html` | `#slot-arca` | 13 s |
| `caja.html` | `#slot-caja` | 14,5 s |
| `numeros.html` | `#slot-numeros` | 15 s |

`_base.css` tiene los estilos **reales** de FIAS 4.3.4, tomados de `static/styles.css` y `templates/base.html` con los mismos nombres de clase. El programa se dibuja a 1280×720 y se escala. `logo_fias.png` es el logo real reducido.

## Cambiar un texto o un monto
- Los textos de pantalla están en el HTML de cada archivo, dentro de `<div id="stage">`.
- Los subtítulos están en la constante `SUBS`: `[desde_ms, hasta_ms, "texto"]`.
- Los montos que cuentan (totales, contadores) están en la función `escena(t)` (o `render(t)` en listas y boleta).
- Las 7 se generan con `herramientas/anim_v2.py` (y `anim_shell.py`), en la carpeta *Contenido Claude Code*. Si cambiás algo a mano en un HTML, pasalo también al generador, o no lo vuelvas a correr.

## Play y pausa
- `index.html` tiene un `IntersectionObserver` que manda `postMessage({fias:"play"})` cuando el espacio entra en pantalla y `{fias:"pause"}` cuando sale.
- Abierta sola, cada animación arranca sola.
- Con `prefers-reduced-motion: reduce` se muestra el cuadro final, quieto.
- `archivo.html?t=5000` muestra el cuadro del segundo 5, fijo. Sirve para sacar capturas.

## Veracidad
Todos los datos son ficticios: Comercio Demo, Juan Pérez, Distribuidora Norte, Ferrosur y CUIT 20/30-00000000-0. Las listas de precios se suben en Excel, CSV o PDF, nunca en foto.
