/* FIAS · motor de animaciones v4 (portada y final por tema en escenas.js)
   Se carga ANTES del script de la animación (los ayudantes $, p, fade… quedan globales).
   La animación define:
     DUR    duración del loop en ms
     FOTO   ms del cuadro que se muestra fijo con prefers-reduced-motion
     CAM    [[ms, x, y, escala]]: la cámara (encuadre sobre el escenario de 1280×720)
     CAMINO [[ms, "id"|x, dx|y, dy]]: recorrido del cursor (por id de elemento o coordenadas)
     CLICS  [ms, ...]: momentos de clic
     VIS    [desde, hasta]: cuándo se ve el cursor
     SUBS   [[desde, hasta, "texto"]]: subtítulos (admite <em>)
     ESCENA(t): dibuja todo lo demás en el ms t
   Play y pausa: postMessage({fias:"play"|"pause"}) desde index.html. ?t=5000 congela el ms 5000. */
(() => {
const $ = id => document.getElementById(id);
const cl = x => x < 0 ? 0 : x > 1 ? 1 : x;
const p = (t, a, b) => cl((t - a) / (b - a));
const eo = x => 1 - Math.pow(1 - x, 3);
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const back = x => { const c = 1.7, d = c + 1; return 1 + d * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const S = (el, o, tr) => { if (!el) return; el.style.opacity = o; el.style.visibility = o > 0.001 ? "visible" : "hidden"; if (tr !== undefined) el.style.transform = tr; };
// Aparece en a (sube 14 px) y se va en b
const fade = (el, t, a, b, dy = 14, d = 320) => { const k = eo(p(t, a, a + d)), o = b ? 1 - p(t, b, b + 260) : 1; S(el, k * o, `translateY(${dy * (1 - k)}px)`); return k * o; };
// Entrada real de las ventanas de FIAS: fiasPopIn .22s — escala .93 y 6 px
const modal = (el, t, a, b) => { const k = eo(p(t, a, a + 220)), o = b ? 1 - p(t, b, b + 180) : 1; S(el, k * o, `translateY(${6 * (1 - k)}px) scale(${.93 + .07 * k})`); return k * o; };
const pop = (el, t, a, b) => { const k = p(t, a, a + 520), o = b ? 1 - p(t, b, b + 220) : 1; S(el, (k > 0 ? 1 : 0) * o, `scale(${k > 0 ? back(k) : .6})`); return k * o; };
const tipeo = (txt, t, a, b) => txt.slice(0, Math.round(txt.length * p(t, a, b)));
const caret = (t, a, b) => (t > a && t < b && Math.floor(t / 380) % 2) ? "|" : "";
const plata = n => "$ " + Math.round(n).toLocaleString("es-AR");
const num = n => Math.round(n).toLocaleString("es-AR");
Object.assign(window, { $, cl, p, eo, eio, back, S, fade, modal, pop, tipeo, caret, plata, num });

const stage = $("stage"), cam = $("cam");
function ajustar() {
  const W = innerWidth, H = innerHeight, k = Math.min(W / 1280, H / 720);
  stage.style.transform = `translate(${(W - 1280 * k) / 2}px,${(H - 720 * k) / 2}px) scale(${k})`;
}
addEventListener("resize", ajustar); ajustar();

// Posición de un elemento dentro de #cam, sin transformaciones (offsets)
function pos(el) { let x = 0, y = 0, e = el; while (e && e !== cam) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x + el.offsetWidth / 2, y + el.offsetHeight / 2]; }
let RUTA = [];
function medir() { RUTA = CAMINO.map(c => typeof c[1] === "string" ? (([x, y]) => [c[0], x + (c[2] || 0), y + (c[3] || 0)])(pos($(c[1]))) : c); }
function cursor(t) {
  if (!RUTA.length) return [0, 0];
  if (t <= RUTA[0][0]) return RUTA[0].slice(1);
  for (let i = 1; i < RUTA.length; i++) { const [t1, x1, y1] = RUTA[i], [t0, x0, y0] = RUTA[i - 1]; if (t <= t1) { const k = eio(p(t, t0, t1)); return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]; } }
  return RUTA[RUTA.length - 1].slice(1);
}
function camara(t) {
  let a = CAM[0], b = CAM[0];
  for (let i = 0; i < CAM.length; i++) { if (CAM[i][0] <= t) { a = CAM[i]; b = CAM[i + 1] || CAM[i]; } }
  const k = b === a ? 0 : eio(p(t, a[0], b[0]));
  const x = a[1] + (b[1] - a[1]) * k, y = a[2] + (b[2] - a[2]) * k, s = a[3] + (b[3] - a[3]) * k;
  // (x, y) es el punto del escenario que queda en el centro; s es el zoom
  cam.style.transform = `translate(${640 - x * s}px,${360 - y * s}px) scale(${s})`;
}
const luces = [...document.querySelectorAll(".fx-luz")], grano = document.querySelector(".fx-grano");
function fondo(t) {
  luces.forEach((l, i) => { const w = t / 1000 * (0.35 + i * 0.12); l.style.transform = `translate(${Math.sin(w + i * 2) * 60}px,${Math.cos(w * .8 + i) * 40}px)`; });
  if (grano) grano.style.transform = `translate(${(Math.floor(t / 90) * 37) % 80 - 40}px,${(Math.floor(t / 90) * 53) % 80 - 40}px)`;
}
let subAct = null;
function subtitulos(t) {
  const el = $("subt"), s = SUBS.find(([a, b]) => t >= a && t < b);
  if (!s) { S(el, 0); return; }
  if (s !== subAct) { subAct = s; el.innerHTML = s[2]; }
  const k = eo(p(t, s[0], s[0] + 260)), o = 1 - p(t, s[1] - 200, s[1]);
  S(el, k * o, `translateX(-50%) translateY(${16 * (1 - k)}px)`);
}
function dibujar(T) {
  const t = CAPA.mapa(T);
  fondo(T); camara(t); ESCENA(t); subtitulos(t); CAPA.dibujar(T);
  const [x, y] = cursor(t), vis = p(t, VIS[0], VIS[0] + 200) * (1 - p(t, VIS[1], VIS[1] + 300));
  let esc = 1, pul = 0, pk = 0;
  for (const c of CLICS) { const q = p(t, c, c + 450); if (q > 0 && q < 1) { pul = 1 - q; pk = q; esc = .82 + .18 * p(t, c + 60, c + 200); } }
  S($("cursor"), vis, `translate(${x}px,${y}px) scale(${esc})`);
  S($("pulso"), pul * vis, `translate(${x}px,${y}px) scale(${.4 + pk})`);
}

const fijo = new URLSearchParams(location.search).get("t");
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
let corriendo = !fijo && !quieto, t0 = performance.now(), tPausa = 0;
function loop(now) {
  if (corriendo) dibujar((now - t0) % CAPA.largo());
  requestAnimationFrame(loop);
}
addEventListener("message", e => {
  if (!e.data || !e.data.fias || fijo || quieto || !window.CAPA) return;
  if (e.data.fias === "pause" && corriendo) { corriendo = false; tPausa = (performance.now() - t0) % CAPA.largo(); }
  if (e.data.fias === "play" && !corriendo) { corriendo = true; t0 = performance.now() - tPausa; }
});
const arrancar = () => { CAPA.armar(); medir(); dibujar(fijo ? +fijo : quieto ? CAPA.foto(FOTO) : 0); requestAnimationFrame(loop); };
addEventListener("load", () => (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(arrancar));
})();
