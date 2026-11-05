/* FIAS · portada y final por tema (animaciones v4).
   Cada apartado se explica con objetos isométricos: caen en la portada sobre el celeste
   y en el final, sobre blanco, se mueven para mostrar la idea con datos ficticios.
   El medio es la animación v3 sin tocar: mapa(T) traduce el tiempo total al de la escena.
   TP: largo de la portada · FIN: ms de la escena donde termina el medio · TF: largo del final. */
(() => {
const TP = 3500, TF = 6600, MED0 = 2300;
const A = 72, B = 41, Z = 86;
const PAL = {
  caja: ["#f4f8ff", "#e3edfd", "#bcd3f8"], hoja: ["#f4f8ff", "#dfe9f8", "#c3d5f2"], tecla: ["#ffffff", "#e3edfd", "#b9cdf0"],
  azul: ["#7fb0f6", "#4f8ff5", "#2f6fe0"], marino: ["#2c4a73", "#1b3558", "#0a2540"],
  verde: ["#dcfce7", "#a9ecc0", "#6fd191"], ambar: ["#fef3c7", "#fde08a", "#f5c04e"], rojo: ["#fee2e2", "#fecaca", "#f59a9a"],
  nar: ["#ffe3bd", "#ffd29a", "#f7ae5e"], billete: ["#e3f7e8", "#bfeccb", "#86d9a2"]
};
const P3 = (E, i, j, k) => [E.OX + (i - j) * A, E.OY + (i + j) * B - k * Z];
const pts = a => a.map(q => q.map(n => n.toFixed(1)).join(",")).join(" ");
function prisma(E, [i, j, k, w, d, h], pal, cls) {
  const P = (a, b, c) => P3(E, a, b, c), t = k + h, c = PAL[pal], x = cls ? ` class="${cls}"` : "";
  const a0 = P(i, j, t), b0 = P(i + w, j, t), c0 = P(i + w, j + d, t), d0 = P(i, j + d, t);
  const b1 = P(i + w, j, k), c1 = P(i + w, j + d, k), d1 = P(i, j + d, k);
  return `<polygon points="${pts([a0, b0, c0, d0])}" fill="${c[0]}"${x}/><polygon points="${pts([d0, c0, c1, d1])}" fill="${c[1]}"${x}/><polygon points="${pts([c0, b0, b1, c1])}" fill="${c[2]}"${x}/>`;
}
// Dibujos sobre las caras
const sobreTapa = (E, i, j, k, html) => { const [x, y] = P3(E, i, j, k); return `<g transform="matrix(1,.57,-1,.57,${x},${y})">${html}</g>`; };
const sobreDer = (E, i, j, k, html) => { const [x, y] = P3(E, i, j, k); return `<g transform="matrix(1,-.57,0,1,${x},${y})">${html}</g>`; };
const rect = (x, y, w, h, c, r = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;
const txt = (x, y, s, tam, c, peso = 800) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter" font-size="${tam}" font-weight="${peso}" fill="${c}">${s}</text>`;
const cinta = (E, c) => { const [i, j, k, w, d, h] = c, T = k + h, a = P3(E, i + w * .42, j, T), b = P3(E, i + w * .58, j, T), e = P3(E, i + w * .58, j + d, T), f = P3(E, i + w * .42, j + d, T), g = P3(E, i + w * .58, j + d, T - h * .3), l = P3(E, i + w * .42, j + d, T - h * .3); return `<polygon points="${pts([a, b, e, f])}" fill="#6fa3f2"/><polygon points="${pts([f, e, g, l])}" fill="#6fa3f2"/>`; };
const etiqueta = (E, c, s) => { const [i, j, k, w, d, h] = c; return sobreDer(E, i + w, j + d * .72, k + h * .62, rect(0, 0, 42, 24, "#fff", 3) + txt(21, 17, s, 13, "#0a2540")); };

const ESC = {
  recorrido: { FIN: 24600, chip: "Tutoriales", OX: 770, OY: 440, st: 90,
    t: ["FIAS te enseña", "a usar FIAS."], f: ["Aprendés usándolo.", "En tu propio programa."],
    p: E => { const r = []; for (let n = 5; n >= 0; n--) r.push({ c: [0, -n, 0, 1.5, 1, .34 + n * .34], pal: "caja", o: n, tin: n === 0 ? { pal: "verde", at: 2500 } : null }); r.push({ c: [.42, .1, .34, .66, .66, .66], pal: "azul", o: 7, mv: { to: [72, -70], at: 1900, dur: 600, arc: 70 } }); return r; },
    et: [["g", "25 tutoriales", "adentro del programa", 790, 96, 1900], ["r", "1 de 25 hechos", "anota lo que ya aprendiste", 690, 612, 2600], ["f", "Etiquetas de góndola", "uno de los 25, en 4 pasos", 1010, 612, 2900]] },
  ventas: { FIN: 19700, chip: "Ventas", OX: 866, OY: 232, st: 70,
    t: ["Vendés", "sin soltar", "el teclado."], f: ["Cobrás con el teclado.", "Y seguís atendiendo."],
    p: E => { const r = [{ c: [0, 0, 0, 5.2, 2.5, .2], pal: "azul", o: 0 }], tecla = (i, j, w, s, x = {}) => { const c = [i, j, .2, w, .9, .3]; r.push(Object.assign({ c, pal: "tecla", o: r.length, de: sobreTapa(E, i + w / 2 - .05, j + .45, .5, `<g transform="scale(.82)">${txt(0, 6, s, 24, "#0a2540")}</g>`) }, x)); };
      [["1", 0], ["0", 1], ["0", 2], ["1", 3]].forEach(([s, n]) => tecla(.12 + n, .12, .9, s)); tecla(4.12, .12, .96, "F2", { tin: { pal: "verde", at: 2150 }, pul: 2100 });
      [["7", 0], ["2", 1]].forEach(([s, n]) => tecla(.12 + n, 1.14, .9, s)); tecla(2.12, 1.14, 2.96, "Enter", { tin: { pal: "verde", at: 1650 }, pul: 1600 });
      return r; },
    et: [["g", "Código y Enter", "cantidad y Enter", 830, 96, 1700], ["r", "F2 para vender", "elegís cómo paga", 700, 612, 2300], ["f", "Sale el comprobante", "listo para imprimir", 980, 612, 2700]] },
  productos: { FIN: 22800, chip: "Productos", OX: 895, OY: 300, st: 120, nota: 'Llave ajustable 10" cromada',
    t: ["Tu catálogo,", "con los tres", "stocks."], f: ["Sabés qué tenés.", "Y dónde está."],
    p: E => { const r = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [.5, 0, 1], [1.5, 0, 1], [1, 0, 2]].map(([i, j, k], n) => { const c = [i, j, k, 1, 1, 1]; return { c, pal: "caja", o: n, de: cinta(E, c) + etiqueta(E, c, "1005") }; }); const u = r[8]; u.tin = { pal: "nar", at: 1500 }; u.mv = { to: [215, 184], at: 1100, dur: 1000, arc: 90 }; return r; },
    et: [["g", "Stock global: 9", "todo lo que es tuyo", 790, 96, 2000], ["r", "Stock real: 8", "lo que está en el local", 700, 612, 2300], ["f", "Stock fiado: 1", "se lo llevaron sin pagar", 1016, 612, 2600]] },
  fiados: { FIN: 26900, chip: "Fiados", OX: 870, OY: 270, st: 100, nota: "Cuenta de Juan Pérez",
    t: ["La libreta", "de fiados", "que suma sola."], f: ["Sabés quién te debe.", "Y cuánto, al centavo."],
    p: E => { const r = []; for (let n = 0; n < 9; n++) { const c = [0, 0, n * .2, 2.2, 1.7, .17], x = c[0], y = c[1], T = c[2] + c[5]; const lin = [.25, .5, .75, 1, 1.25, 1.5].map(v => rect(0, v * 72, 158, 1.4, "#c9dcf9")).join(""); r.push({ c, pal: "hoja", o: n, de: sobreTapa(E, x, y, T, lin + rect(22, 0, 2, 122, "#f59a9a")), mv: n > 5 ? { to: [190, 170 - (8 - n) * 16], at: 1200 + (8 - n) * 180, dur: 800, arc: 70 } : null, tin: n > 5 ? { pal: "verde", at: 1500 + (8 - n) * 180 } : null }); } return r; },
    et: [["x", "Debe: $ 65.920", "saldo a pagar", 880, 96, 800], ["r", "Entregó: $ 20.000", "con «Registrar entrega»", 1000, 612, 2300], ["g", "Saldo: $ 45.920", "baja solo", 690, 612, 2800]] },
  boleta: { FIN: 24300, chip: "Boletas de compra", OX: 930, OY: 196, st: 110, nota: "Boleta de Distribuidora Norte",
    t: ["La boleta", "del proveedor,", "con una foto."], f: ["Le sacás una foto.", "Vos revisás y confirmás."],
    p: E => { const r = []; for (let n = 0; n < 5; n++) { const c = [0, 0, n * .05, 2.7, 3.5, .05]; r.push({ c, pal: "hoja", o: n }); } const fila = (j, pal, at, to) => { const c = [.25, j, .3, 2.2, .46, .1]; r.push({ c, pal: "caja", o: r.length, tin: { pal, at }, mv: { to, at: at + 250, dur: 700, arc: 26 } }); }; fila(.35, "verde", 1000, [60, -62]); fila(1, "verde", 1150, [60, -40]); fila(1.65, "ambar", 1300, [96, 30]); fila(2.3, "rojo", 1450, [120, 108]); const c = [1.1, -1.2, 1.5, 1.1, 2, .1]; r.push({ c, pal: "marino", o: r.length, mv: { to: [230, -250], at: 500, dur: 800, fue: 1 }, de: sobreTapa(E, 1.18, -1.1, 1.6, rect(0, 0, 66, 130, "#a9dcff", 4)) }); return r; },
    et: [["r", "Código exacto", "ya lo tenías cargado", 1040, 96, 1900], ["f", "Coincidencia parcial", "lo revisás vos", 1010, 612, 2200], ["x", "Sin coincidencia", "decidís qué hacer", 690, 612, 2500]] },
  listas: { FIN: 21000, chip: "Listas de precios", OX: 945, OY: 210, st: 45,
    t: ["La lista", "del proveedor,", "en un Excel."], f: ["Remarcás toda la lista.", "Sin tipear un precio."],
    p: E => { const r = []; for (let f = 0; f < 5; f++) for (let c = 0; c < 4; c++) { const cc = [c * 1.02, f * .82, 0, .96, .76, .34]; r.push({ c: cc, pal: f === 0 ? "azul" : "hoja", o: r.length, de: f ? rect(0, 0, 0, 0, "#fff") : "" }); } let m = 0; for (let f = 4; f > 0; f--) for (let c = 3; c >= 0; c--) { } for (let f = 1; f < 5; f++) for (let c = 0; c < 4; c++) if (c === 3 || c === 2) { const h = .5 + f * .13; r.push({ c: [c * 1.02, f * .82, .34, .96, .76, h], pal: "verde", o: 40 + m, solo: 1100 + m * 80 }); m++; } return r; },
    et: [["g", "Llega la lista nueva", "en Excel, CSV o PDF", 800, 96, 700], ["f", "Suben los costos", "con el precio anterior al lado", 690, 612, 1900], ["r", "Mantiene el margen", "cada precio, uno por uno", 1000, 612, 2500]] },
  arca: { FIN: 18800, chip: "Facturación ARCA", OX: 930, OY: 190, st: 130, nota: "Factura de ejemplo",
    t: ["Facturás", "sin entrar", "a ARCA."], f: ["Vendés y facturás.", "Desde el mismo lugar."],
    p: E => { const r = []; for (let n = 0; n < 6; n++) r.push({ c: [0, 0, n * .05, 2.8, 3.6, .05], pal: "hoja", o: n }); const T = .3, qr = []; [[0, 0], [24, 0], [48, 0], [0, 24], [48, 24], [24, 48], [48, 48], [0, 48], [24, 24]].forEach(([x, y]) => qr.push(rect(x, y, 20, 20, "#0a2540"))); const fin = rect(0, 0, 62, 62, "#0a2540", 6) + txt(31, 46, "C", 44, "#fff"); const lin = [0, 26, 52, 78].map(y => rect(0, y, 104, 9, "#bcd3f8", 2)).join(""); r.push({ c: [0, 0, T, 0, 0, 0], pal: "hoja", o: 6, de: sobreTapa(E, .5, .4, T, fin) + sobreTapa(E, 1.5, .5, T, `<g transform="translate(0,20)">${lin}</g>`) + sobreTapa(E, .7, 2.3, T, qr.join("")) }); r.push({ c: [.9, 1.2, 1.5, 1, 1, .5], pal: "azul", o: 12, sello: 1400 }); return r; },
    et: [["g", "Factura C", "con consumidor final", 960, 96, 1800], ["r", "Con CAE y QR", "lista para entregar", 690, 612, 2150], ["f", "Dos toques", "sin entrar a la página", 1000, 612, 2500]] },
  caja: { FIN: 21300, chip: "Cierre de Caja", OX: 860, OY: 276, st: 40,
    t: ["El cajón,", "lo que tiene", "que haber."], f: ["Lo que tiene que haber.", "Todos los días."],
    p: E => { const r = [{ c: [-.1, -.1, 0, 3.4, 2.3, .3], pal: "marino", o: 0 }]; let n = 0; for (let k = 0; k < 3; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { const c = [i * 1.08 + .04, j * 1.05 + .02, .3 + k * .42, 1, .98, .4]; const se = n >= 5, [x, y] = [i * 1.08 + .04, j * 1.05 + .02]; const de = rect(0, 0, 0, 0, "#fff"); const faja = sobreTapa(E, x + .4, y, c[2] + c[5], rect(0, 0, 14, 70, "#5ec581")); r.push({ c, pal: "billete", o: 1 + n, de: faja, mv: se ? { to: [240, -330], at: 1100 + (n - 5) * 70, dur: 700, fue: 1 } : null }); n++; } return r; },
    et: [["g", "En caja: $ 180.320", "lo que tiene que haber", 720, 96, 500], ["f", "Retirás: $ 130.320", "con «Cerrar caja (retirar)»", 1000, 96, 1700], ["r", "Queda: $ 50.000", "el cambio para mañana", 830, 612, 2500]] },
  numeros: { FIN: 25500, chip: "Informes", OX: 850, OY: 270, st: 240, nota: "Ventas del mes: $ 549.230",
    t: ["Cuánto", "ganaste,", "de verdad."], f: ["Sabés si ganaste.", "Y cuánto."],
    p: E => [{ c: [0, 0, 0, 2.2, 2.2, .7], pal: "azul", o: 0, tin: { pal: "verde", at: 2100 } }, { c: [0, 0, .7, 2.2, 2.2, .12], pal: "caja", o: 1, tin: { pal: "ambar", at: 1500 }, mv: { to: [200, 30], at: 1700, dur: 800, arc: 50 } }, { c: [0, 0, .82, 2.2, 2.2, 1.9], pal: "caja", o: 2, tin: { pal: "rojo", at: 800 }, mv: { to: [300, -250], at: 1000, dur: 900, fue: 1 } }],
    et: [["x", "Costo de lo vendido", "$ 395.400", 1000, 96, 1100], ["f", "Gastos y mermas", "$ 8.500", 1020, 186, 1800], ["r", "Utilidad neta: $ 145.330", "lo que ganaste de verdad", 720, 612, 2400]] }
};

const AN = document.body.dataset.anim, E = ESC[AN];
let pzP = [], pzF = [];
const logo = '<div class="logo"><span class="f-fila"><img src="../logo_fias.png" alt="FIAS"><span class="fias-wm">FIAS<sup>®</sup></span></span><span class="fias-wm-s">Sistema de Gestión</span></div>';
const lineas = (a, cols, pre) => a.map((s, i) => `<span class="f-ln"><span class="${cols(i)}" id="${pre}${i}">${s}</span></span>`).join("");
const grupo = (x, i, pre) => `<g id="${pre}${i}">${prisma(E, x.c, x.pal)}${x.tin ? prisma(E, x.c, x.tin.pal, "tn") : ""}${x.de || ""}</g>`;
const ex = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
const linea = (e, t, a, b) => { const k = ex(p(t, a, a + 800)), o = b ? eio(p(t, b, b + 300)) : 0; e.style.transform = `translateY(${(1 - k) * 110 - o * 110}%)`; };
const mapa = T => T < TP ? MED0 : Math.min(MED0 + T - TP, E.FIN);
const largo = () => TP + (E.FIN - MED0) + TF;

function armar() {
  const lista = E.p(E);
  $("capa").innerHTML = `<div id="pt"><div class="cielo"></div><svg viewBox="0 0 1280 720">${lista.map((x, i) => grupo(x, i, "a")).join("")}</svg>
    <div id="ptx"><div class="f-chip" id="pch">${E.chip}</div><div class="f-tit">${lineas(E.t, i => i ? "c-bl" : "c-nv", "pl")}</div></div><div class="f-tab">${logo}</div></div>
    <div id="fn"><div id="fnB"></div><svg viewBox="0 0 1280 720" id="fsv">${lista.map((x, i) => grupo(x, i, "b")).join("")}</svg>
    <div id="ftx"><div class="f-tit">${lineas(E.f, i => i ? "c-az" : "c-nv", "fl")}</div><div class="f-cta" id="fct">Consultá por WhatsApp</div></div>
    ${E.nota ? `<div id="nota">${E.nota}</div>` : ""}${E.et.map(([c, a, s, x, y], i) => `<div class="f-et ${c}" id="e${i}" style="left:${x}px;top:${y}px">${a}<small>${s}</small></div>`).join("")}<div class="f-tab">${logo}</div></div>`;
  pzP = lista.map((x, i) => ({ ...x, el: $("a" + i), tn: [...$("a" + i).querySelectorAll(".tn")] }));
  pzF = lista.map((x, i) => ({ ...x, el: $("b" + i), tn: [...$("b" + i).querySelectorAll(".tn")] }));
  [...pzP, ...pzF].forEach(q => q.tn.forEach(e => e.style.opacity = 0));
  // Los títulos largos se achican hasta entrar en la columna izquierda
  [$("ptx").querySelector(".f-tit"), $("ftx").querySelector(".f-tit")].forEach(t => { const w = Math.max(...[...t.querySelectorAll(".f-ln>span")].map(s => { const r = document.createRange(); r.selectNodeContents(s); return r.getBoundingClientRect().width / (document.getElementById("stage").getBoundingClientRect().width / 1280); })); if (w > 610) t.style.fontSize = parseFloat(getComputedStyle(t).fontSize) * 610 / w + "px"; });
}
function caida(q, t, a0) {
  const k = p(t, a0, a0 + 520), e = k * k, reb = Math.sin(p(t, a0 + 520, a0 + 760) * Math.PI) * 7;
  return [(e - 1) * 640 - reb, k > 0 ? 1 : 0];
}
function dibujar(T) {
  // Portada
  const sa = eio(p(T, TP, TP + 450));
  S($("pt"), 1 - sa, `scale(${1 + .03 * sa})`);
  if (sa < 1) {
    S($("pch"), ex(p(T, 100, 500)));
    E.t.forEach((_, i) => linea($("pl" + i), T, 200 + i * 140, TP - 150));
    pzP.forEach(q => { const a0 = q.solo ? 900 + (q.o - 40) * 30 : 500 + q.o * E.st, [dy, op] = caida(q, T, a0); q.el.setAttribute("transform", `translate(0,${dy})`); q.el.style.opacity = op; });
  }
  // Final
  const F = T - largo() + TF, vis = F > -10;
  $("fn").style.visibility = vis ? "visible" : "hidden";
  if (!vis) return;
  const r = eio(p(F, 0, 700)); $("fn").style.clipPath = `circle(${r * 1500}px at ${E.OX}px 380px)`;
  E.f.forEach((_, i) => linea($("fl" + i), F, 450 + i * 180));
  const c = ex(p(F, 1000, 1500)); S($("fct"), c, `translateY(${12 * (1 - c)}px)`);
  const stF = Math.min(E.st, 900 / pzF.length);
  pzF.forEach(q => {
    if (q.solo) { const [dy, op] = caida(q, F, q.solo); q.el.setAttribute("transform", `translate(0,${dy})`); q.el.style.opacity = op; return; }
    let [dy, op] = caida(q, F, 250 + Math.min(q.o, 30) * stF), dx = 0;
    if (q.mv) { const m = eio(p(F, q.mv.at, q.mv.at + q.mv.dur)); dx = q.mv.to[0] * m; dy += q.mv.to[1] * m - Math.sin(m * Math.PI) * (q.mv.arc || 0); if (q.mv.fue) op *= 1 - p(F, q.mv.at + q.mv.dur * .55, q.mv.at + q.mv.dur); }
    if (q.pul) dy += Math.sin(p(F, q.pul, q.pul + 180) * Math.PI) * 9;
    if (q.sello) { const b = eio(p(F, q.sello, q.sello + 260)), s = eio(p(F, q.sello + 320, q.sello + 700)); dy += 92 * b - 130 * s; }
    q.el.setAttribute("transform", `translate(${dx},${dy})`); q.el.style.opacity = op;
    if (q.tin) q.tn.forEach(e => e.style.opacity = eio(p(F, q.tin.at, q.tin.at + 500)));
  });
  if (E.nota) { const k = ex(p(F, 700, 1200)); S($("nota"), k, `translateY(${14 * (1 - k)}px)`); }
  E.et.forEach((x, i) => { const k = ex(p(F, x[5], x[5] + 500)); S($("e" + i), k, `translateY(${14 * (1 - k)}px)`); });
}
window.CAPA = { armar, dibujar, mapa, largo, foto: f => f + TP - MED0 };
})();
