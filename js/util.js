/* MatheNils – Hilfsfunktionen (Zufall, Zahlenformat, Antwortprüfung) */
'use strict';

const Util = (() => {

  /**
   * Zufallsquelle. Normalerweise Math.random – für die Tages-Challenge lässt
   * sie sich aber auf einen festen Startwert legen, damit dieselbe Runde nach
   * einem Neuladen dieselben Aufgaben stellt. Ohne das ließ sich die noch
   * offene Frage beliebig oft neu würfeln, bis eine leichte kam.
   *
   * xorshift32: kurz, ohne Abhängigkeiten, und für Aufgabenauswahl mehr als
   * gut genug. Nicht für irgendetwas Sicherheitsrelevantes gedacht.
   */
  let saat = null;
  function zufall() {
    if (saat === null) return Math.random();
    saat ^= saat << 13; saat ^= saat >>> 17; saat ^= saat << 5;
    return (saat >>> 0) / 4294967296;
  }

  /**
   * Führt `fn` mit fester Zufallssaat aus und gibt die Quelle danach in jedem
   * Fall wieder frei – auch wenn `fn` eine Ausnahme wirft. Bliebe die Saat
   * gesetzt, würde die ganze App ab da vorhersagbare Aufgaben stellen.
   */
  function mitSaat(wert, fn) {
    // Die Saat wird erst durchmischt (Finalisierer aus MurmurHash3). Ohne das
    // liefert xorshift32 bei kleinen, dicht liegenden Startwerten als ersten
    // Wert immer fast dasselbe: Bei 4711 + i lag er in 200 von 200 Fällen
    // unter 0,31, bei i · 7 + 1 unter 0,14. Jede Prüfung mit solchen Saaten
    // sah nur den ersten Zweig jeder Auswahl – die Zusatzvarianten nie.
    let x = wert | 0;
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
    saat = (x ^ (x >>> 16)) || 1;
    try { return fn(); } finally { saat = null; }
  }

  /** Ganzzahliger Zufall im Bereich [min, max] (beide inklusive). */
  function rnd(min, max) {
    return Math.floor(zufall() * (max - min + 1)) + min;
  }

  /** Zufälliges Element eines Arrays. */
  function choice(arr) {
    return arr[rnd(0, arr.length - 1)];
  }

  /** Kopiertes, gemischtes Array (Fisher-Yates). */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /** Größter gemeinsamer Teiler (immer >= 1). */
  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
  }

  /** Kleinstes gemeinsames Vielfaches. */
  function lcm(a, b) {
    return Math.abs(a * b) / gcd(a, b);
  }

  /**
   * Zahl im deutschen Format (Komma als Dezimaltrenner).
   *
   * Ohne feste Nachkommastellen werden Binärartefakte abgeschnitten:
   * 3,14 · 36 ergibt in JavaScript 113.03999999999999, und genau dieser
   * Wert stand vorher als Musterlösung auf dem Bildschirm. Zwölf
   * signifikante Stellen sind für jede Aufgabe dieser Plattform weit mehr
   * als genug und machen daraus wieder 113,04.
   */
  function fmt(n, decimals) {
    let s;
    if (decimals != null) s = n.toFixed(decimals);
    else if (typeof n === 'number' && Number.isFinite(n)) s = String(Number(n.toPrecision(12)));
    else s = String(n);
    return s.replace('.', ',').replace('-', '−');
  }

  /** HTML für einen schön gesetzten Bruch. */
  function frac(num, den) {
    return `<span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span>`;
  }

  /* ── Eingaben lesen ──────────────────────────────────────────────────────
   *
   * Was jemand eintippt, sieht selten aus wie der nackte Zahlenwert. Der
   * Platzhalter sagt „in cm“, die Musterlösung zeigt „200 cm“, also wird
   * „200 cm“ getippt; bei „x = ?“ kommt „x = 7“, bei S(2 | −7) kommt „2 | −7“,
   * bei einer Kreisfläche „≈ 50,24“, bei x² = 49 kommt „±7“. Gemessen
   * (design/pruefung/eingabe.js): Vor dieser Schicht lehnte check() die Zahl
   * mit Einheit in allen 69 Aufgabentypen ab, deren Platzhalter die Einheit
   * selbst vorgibt, das Paar mit senkrechtem Strich in allen 26
   * Koordinatenaufgaben, und „13.000“ las es als 13 – der Tausenderpunkt
   * wurde still zum Dezimalpunkt.
   *
   * Deshalb wird jede Eingabe erst auf ihren Zahlenkern gebracht:
   *   – Bindestrich, Gedankenstrich und echtes Minus gelten gleich,
   *   – hinter dem letzten „=“, „≈“, „≥“ oder „≤“ steht die Antwort
   *     („f′(1) = 65“, „n ≥ 22“, auch der Rechenweg „2x = 18 → x = 9“),
   *   – „≈“, „ca.“, „etwa“, „ungefähr“, „rund“, „um“ davor zählen nicht,
   *   – eine Klammer um die Zahl fällt weg („(−20)“, so setzt die Aufgabe
   *     selbst negative Zahlen), „minus 20“ und „- 20“ gelten,
   *   – ein Nachspann OHNE Ziffer ist Einheit oder Kommentar („cm²“, „€“,
   *     „°C“, „Flaschen“, „% (Abnahme)“) und fällt weg. Einzige Ausnahme mit
   *     Ziffer: die Tastaturform der Hochzahl („cm2“, „m^3“). Jeder andere
   *     Nachspann MIT Ziffer („2 · 3“, „7 oder 8“) macht die Eingabe ungültig –
   *     rechnen und entscheiden soll weiter der Lernende.
   *   – Zwei Antworten mit je eigenem Vorspann („x = 8 oder x = 9“,
   *     „x = 4, x = 3“) sind ein Hedge und ungültig: Wer der Regel „hinter dem
   *     letzten = steht die Antwort" blind folgt, ließe jeden Hedge durch,
   *     dessen letzter Wert stimmt. Erkannt wird das an zwei Zuweisungen
   *     „Name = fertiger Wert“ mit verschiedenen Werten; ein Wert, auf den ein
   *     Rechenzeichen folgt („x = 18 : 2 = 9“), ist Zwischenschritt.
   *
   * Der Punkt ist zweideutig: „1.024“ ist auf Deutsch tausendvierundzwanzig
   * und auf dem Taschenrechner 1,024. Beide Lesarten werden geprüft und die
   * Eingabe gilt, wenn eine passt. Die Alternative – nur die deutsche Lesart –
   * hätte „6.352“ für 6,352 kg abgelehnt, und wer das tippt, hat die Aufgabe
   * gelöst. Der Preis: Wer um den Faktor 1000 danebenliegt UND den
   * Tausenderpunkt setzt, wird nicht erwischt. Zwei Dinge fangen davon das
   * meiste ab: Eine Gruppe, die auf 0 endet („6.000“, „3.200“), ist NUR die
   * Tausenderschreibweise – kein Taschenrechner zeigt 3,2 als „3.200“ –, und
   * wo die Einheit der Lerninhalt ist (Thema einheiten), gilt eine
   * mitgetippte Ausgangseinheit als nicht umgerechnet: „8.840 g“ ist keine
   * Antwort auf „8840 g = ? kg“, gleich wie man den Punkt liest.
   */
  const STRICHE = /[−–—‒‐‑]/g; // − – — ‒ ‐ ‑
  // Eine Zahl: 1.234.567,89 · 1 234 567 · 1,234.5 · 12,5 · 12.5 · ,5 · 42
  const ZAHL = String.raw`[+-]?(?:\d{1,3}(?:[ .]\d{3})+(?:,\d+)?|\d{1,3}(?:,\d{3})+\.\d+|\d+(?:[.,]\d+)?|[.,]\d+)`;
  // (?!\d) hinter der Zahl: sonst nähme „0.0376“ die Tausender-Lesart „0.037“ und ließe die 6 übrig
  const KERN = new RegExp(String.raw`^(${ZAHL})(?!\d)(?:\s*\/\s*([+-]?\d+(?:[.,]\d+)?))?(.*)$`, 's');
  // Bewusst eine Weißliste – kein allgemeines Abstreifen führender Buchstaben,
  // sonst würde aus „knapp 5“ oder „über 5“ eine 5.
  const VORSPANN = /^\s*(?:[a-zäöüß]+:|≈|~|ca\.?|circa|etwa|ungefähr|ungefaehr|rund|gerundet|um|€|eur|euro)(?=[\s\d.,(+-]|$)\s*/i;
  // Ein Name vor „=“, dazu ein fertiger Wert: „x = 9“, „x₁ = 8“, nicht „2x = 18“ (kein Name) und
  // nicht „x = 18 : 2“ (Rechenzeichen dahinter, Zwischenschritt)
  const ZUWEISUNG = new RegExp(String.raw`(?:^|[\s;,(])([A-Za-zα-ω][A-Za-z]*)[₀-₉\d]*\s*[=≈]\s*(${ZAHL})(?!\d)\s*(?=$|[;,)]|\b(?:oder|und|bzw)\b|[A-Za-z(])`, 'g');
  const EINHEITEN = {
    gramm: 'g', kilogramm: 'kg', milligramm: 'mg', tonne: 't', tonnen: 't',
    millimeter: 'mm', zentimeter: 'cm', dezimeter: 'dm', meter: 'm', kilometer: 'km',
    sekunde: 's', sekunden: 's', sek: 's', minute: 'min', minuten: 'min', stunde: 'h', stunden: 'h', std: 'h',
    liter: 'l', milliliter: 'ml', qmm: 'mm2', qcm: 'cm2', qdm: 'dm2', qm: 'm2', qkm: 'km2',
    quadratmillimeter: 'mm2', quadratzentimeter: 'cm2', quadratdezimeter: 'dm2', quadratmeter: 'm2', quadratkilometer: 'km2'
  };
  const ZAHLWORT = {
    null: 0, kein: 0, keine: 0, keins: 0, keinen: 0, ein: 1, eine: 1, einer: 1, eins: 1, einen: 1,
    zwei: 2, drei: 3, vier: 4, fünf: 5, fuenf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10,
    elf: 11, zwölf: 12, zwoelf: 12
  };
  /** Einheit vergleichbar machen: „cm²“, „cm2“, „cm^2“, „Quadratzentimeter“ → „cm2“. */
  function einheitNorm(u) {
    const s = String(u || '').toLowerCase().replace(/[\s.]+/g, '').replace(/\^/g, '').replace(/²/g, '2').replace(/³/g, '3');
    return EINHEITEN[s] || s;
  }

  /**
   * Zahlenkern einer Eingabe: { zahl, nenner, prozent, einheit } oder null.
   * „≈ 12,5 cm²“ → { zahl: '12,5', einheit: 'cm²' }, „x = 3/4“ → { zahl: '3',
   * nenner: '4' }, „25 %“ → { zahl: '25', prozent: true }, „2 · 3“ → null.
   * opt.zahlwort: „keine“, „eine“, „zwei“ … am Anfang gelten als Zahl – nur für
   * Anzahl-Fragen, denn „keine“ heißt sonst mehr als 0 („keine Lösung“).
   */
  function kern(str, opt = {}) {
    if (typeof str !== 'string') return null;
    let s = str.replace(/ /g, ' ').replace(STRICHE, '-').trim();
    // Hedge: derselbe oder ein zweiter Name mit einem anderen fertigen Wert
    const werte = new Set();
    for (const z of s.matchAll(ZUWEISUNG)) werte.add(z[2].replace(/\s+/g, ''));
    if (werte.size > 1 || /;\s*[+-]?[\d.,]*\d/.test(s)) return null;
    const schnitt = Math.max(...['=', '≈', '≥', '≤'].map(z => s.lastIndexOf(z)));
    if (schnitt >= 0) s = s.slice(schnitt + 1);
    s = s.replace(VORSPANN, '').trim();
    // Klammer um die Zahl, nicht um die ganze Eingabe: „(−20) €“ gilt, „(−3)²“ ist eine Potenz
    s = s.replace(/^\(\s*([^()]*?)\s*\)(?![⁰¹²³⁴⁵⁶⁷⁸⁹])/, '$1 ').trim();
    s = s.replace(/^minus\s+(?=[\d.,])/i, '-');
    s = s.replace(/^([+-])\s+(?=[\d.,])/, '$1');
    const wort = s.match(/^([a-zäöü]+)\b(.*)$/is);
    if (wort) {
      const w = wort[1].toLowerCase();
      if (w === 'null' || (opt.zahlwort && ZAHLWORT[w] !== undefined)) s = ZAHLWORT[w] + wort[2];
    }
    const gemischt = s.match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)(?!\d)(.*)$/s);  // „1 1/4“ → „5/4“
    if (gemischt) s = `${gemischt[1]}${Number(gemischt[2]) * Number(gemischt[4]) + Number(gemischt[3])}/${gemischt[4]}${gemischt[5]}`;
    const m = s.match(KERN);
    if (!m) return null;
    // Hochzahl einer Längeneinheit von der Tastatur: „cm2“, „m^3“ – nur Meter-Einheiten, ohne Leerraum,
    // damit „5 m 2 cm“ und „7 oder 2“ weiter als Nachspann mit Ziffer ungültig bleiben
    let rest = m[3].trim().replace(/^([kcdm]?m)\^?2(?![\d.,])/i, '$1²').replace(/^([kcdm]?m)\^?3(?![\d.,])/i, '$1³');
    if (/\d/.test(rest) || /^\//.test(rest)) return null;   // „3/“ ist ein angefangener Bruch, keine 3
    if (opt.zahlwort && /\b(?:oder|bzw)\b/i.test(rest)) return null;   // „eine oder keine“ ist ein Hedge
    // „16π“, „16 · pi“: der exakte Wert – multipliziert, damit er gegen die Näherung 3,14 bestehen kann
    let faktor = 1;
    const pi = rest.match(/^[·*]?\s*(?:π|pi)(?![\wäöü])\s*/i);
    if (pi) { faktor = Math.PI; rest = rest.slice(pi[0].length); }
    const prozent = /^(?:%|prozent\b)/i.test(rest);
    const einheit = prozent ? '%' : rest.replace(/[(,;].*$/s, '').trim();
    return { zahl: m[1].replace(/\s+/g, ''), nenner: m[2] ? m[2].replace(',', '.') : null, prozent, einheit, faktor };
  }

  /** Alle Lesarten eines Zahlenkerns: [{ wert, stellen }] – bei „1.024“ zwei, sonst eine. */
  function lesarten(zahl) {
    const aus = [];
    // deutsch: Tausenderpunkt, Dezimalkomma (die führende Gruppe hat keine führende Null)
    let m = zahl.match(/^([+-]?)([1-9]\d{0,2}(?:\.\d{3})+)(?:,(\d+))?$/);
    if (m) aus.push({ wert: parseFloat(m[1] + m[2].replace(/\./g, '') + (m[3] ? '.' + m[3] : '')), stellen: m[3] ? m[3].length : 0 });
    // „6.000“, „3.200“: eine Gruppe, die auf 0 endet, ist nur die Tausenderschreibweise –
    // kein Taschenrechner zeigt 3,2 als „3.200“
    const nurTausender = /^[+-]?[1-9]\d{0,2}\.\d{2}0$/.test(zahl);
    // englisch: Tausenderkomma, Dezimalpunkt
    m = zahl.match(/^([+-]?)(\d{1,3}(?:,\d{3})+)\.(\d+)$/);
    if (m) aus.push({ wert: parseFloat(m[1] + m[2].replace(/,/g, '') + '.' + m[3]), stellen: m[3].length });
    // schlicht: ein Trenner, Komma oder Punkt
    m = zahl.match(/^([+-]?)(\d*)(?:[.,](\d+))?$/);
    if (m && (m[2] || m[3]) && !nurTausender) aus.push({ wert: parseFloat(m[1] + (m[2] || '0') + '.' + (m[3] || '0')), stellen: m[3] ? m[3].length : 0 });
    return aus.filter(l => Number.isFinite(l.wert));
  }

  /** Alle Zahlen, als die sich eine Eingabe lesen lässt (leer, wenn keine). */
  function parseAlle(str, opt) {
    const k = kern(str, opt);
    if (!k) return [];
    let werte = lesarten(k.zahl).map(l => l.wert * k.faktor);
    if (k.nenner !== null) {
      const den = parseFloat(k.nenner);
      werte = den === 0 ? [] : werte.map(v => v / den);
    }
    return werte;
  }

  /**
   * Nutzereingabe zu einer Zahl parsen – die erste Lesart, NaN wenn keine.
   * Erlaubt: "12", "-3", "+4", "2,5", "2.5", "3/4", "−2", "≈ 12,5 cm", "x = 7".
   */
  function parseNum(str) {
    const werte = parseAlle(str);
    return werte.length ? werte[0] : NaN;
  }

  /** Nutzereingabe als Bruch parsen: "3/4", "1 1/4" oder ganze Zahl "5" -> {num, den} oder null. */
  function parseFraction(str) {
    const k = kern(str);
    if (!k || !/^[+-]?\d+$/.test(k.zahl)) return null;
    if (k.nenner === null) return { num: parseInt(k.zahl, 10), den: 1 };
    if (!/^[+-]?\d+$/.test(k.nenner)) return null;
    const den = parseInt(k.nenner, 10);
    if (den === 0) return null;
    return { num: parseInt(k.zahl, 10), den };
  }

  const NAME = String.raw`[A-Za-zÀ-ÿα-ω][A-Za-z′″']*[₀-₉\d]{0,2}`;
  /** Name vor dem „=“ eines Teils („x“, „x₁“, „x1“) als Sortierschlüssel, sonst null. */
  function teilName(p) {
    const m = String(p).match(new RegExp(String.raw`^\s*([A-Za-zÀ-ÿα-ω][A-Za-z′″']*)([₀-₉\d]{0,2})\s*[=≈]`));
    if (!m) return null;
    const index = m[2].replace(/[₀-₉]/g, c => String(c.charCodeAt(0) - 0x2080));
    return m[1].toLowerCase() + (index ? index.padStart(3, '0') : '');
  }

  /**
   * Eingabe mit mehreren Werten in Teile zerlegen. Trenner: Semikolon, „und“,
   * „oder“, senkrechter Strich, „<" und „>" (beim Ordnen; eine reine >-Kette
   * ist die Folge rückwärts, Pfeile „→“ tragen keine Richtung) und Komma mit
   * Leerzeichen dahinter („−5, 3“ ist ein Paar, „−5,3“ eine Zahl). Ein Name mit
   * Klammern außen herum fällt weg – „S(2 | −7)“ ist, was die Musterlösung
   * zeigt, auch mit getipptem Index („S3(0 | 0 | 1)“). Kommt so nur ein Teil heraus, obwohl mehrere erwartet
   * sind, zählen die Zahlen im Text („3 5“, „x = 3 y = 5“) – aber nur, wenn
   * außer Zahlen und kurzen Namen nichts dasteht: „x² − 5x = 0“ ist die Frage
   * abgeschrieben, keine Antwort.
   */
  function teile(input, anzahl) {
    if (typeof input !== 'string') return null;
    let s = input.replace(/ /g, ' ').replace(STRICHE, '-').trim();
    s = s.replace(/([A-Za-z])_(?=\d)/g, '$1');                          // x_1 → x1
    s = s.replace(/-+>|=+>|→|⇒/g, ';');                                 // Pfeile trennen, ohne Richtung
    const klammer = s.match(/^(?:[^\d({+.,-]*?[A-Za-z′″']\d{1,2}|[^\d({+.,-]*)\s*[({](.*)[)}]\s*$/s);
    if (klammer) s = klammer[1];
    if (/</.test(s) && />/.test(s)) return [];                          // weder auf- noch absteigend
    const fallend = />/.test(s);
    const TRENNER = new RegExp(String.raw`\s*(?:;|\b(?:und|oder|bzw)\b\.?|∨|\||<|>|,\s|,(?=${NAME}\s*[=≈]))\s*|\s+(?=${NAME}\s*[=≈])`, 'i');
    let parts = s.split(TRENNER).map(p => p.trim()).filter(Boolean);
    if (parts.length === 1 && anzahl > 1) {
      const WERT = String.raw`(?:${NAME}\s*[=≈]\s*)?${ZAHL}(?!\d)`;
      const nurWerte = new RegExp(String.raw`^\s*${WERT}(?:\s+${WERT})*\s*$`);
      parts = nurWerte.test(s) ? s.match(new RegExp(ZAHL + String.raw`(?!\d)`, 'g')) : [];
    }
    if (fallend) parts.reverse();
    return parts;
  }

  const trifft = (werte, ziel, toleranz) => werte.some(v => Math.abs(v - ziel) <= toleranz);

  /* ── Rückmeldung statt nur „falsch“ ─────────────────────────────────────
   *
   * Jede Prüffunktion trägt zwei Zusatzfunktionen, die app.js benutzt:
   *   check.unlesbar(eingabe) → Text oder null. Eine Eingabe ohne lesbaren
   *     Wert („abc“, „x = 3 oder x = 4“) ist kein Versuch, sondern ein
   *     Missverständnis – sie wird nicht gewertet, sondern erklärt.
   *   check.diagnose(eingabe) → Text oder null. Nach einem gewerteten
   *     Fehlversuch ein Hinweis auf die Fehlerart, ohne die Lösung zu nennen:
   *     Vorzeichen, Größenordnung, Prozent/Dezimalzahl, ungekürzter Bruch,
   *     Reihenfolge, fehlender zweiter Wert. Nur, wenn die Ursache sicher
   *     ist – ein Hinweis, der in die falsche Richtung zeigt, ist schlimmer
   *     als keiner. design/pruefung/eingabe.js prüft beides in festen Proben.
   */
  const TAUSCH = /\b(?:umgekehrt|andersrum|anders ?herum|vertauscht|getauscht|tauschen|verkehrt)\b/i;
  const RECHENZEICHEN = /\d\s*[+·*:×÷^√]\s*[\d(]|\d\s*-\s*\d/;
  // Marker, die Alternativen meinen. Bewusst NICHT Leerzeichen, Komma oder „und“:
  // „2 m 50 cm“, „5 m und 2 cm“ sind keine Hedges, sondern nicht umgerechnete Größen.
  const HEDGEMARKER = /\b(?:oder|bzw|bis)\b|;|\||±/i;
  // Beispiele ohne Trefferchance: In Worten statt als Zahl, bei Paaren ein
  // nicht-ganzzahliger Wert (gemessen 0 Treffer über alle Eingabeaufgaben).
  const FORM = {
    zahl: 'eine Zahl – mit Komma als Dezimalzeichen oder als Bruch mit Schrägstrich',
    bruch: 'ein Bruch – Zähler, Schrägstrich, Nenner',
    wahrscheinlichkeit: 'die Wahrscheinlichkeit als Bruch, Dezimalzahl oder in Prozent',
    paar: 'zwei Werte, mit Semikolon getrennt – z. B. „2,5; −7“',
    tripel: 'drei Werte, mit Semikolon getrennt – z. B. „2,5; −7; 4“',
  };
  /* „3; 7 oder 7; 3“: dieselben Werte in anderer Reihenfolge – ein Reihenfolge-Hedge */
  function reihenfolgeHedge(s, anzahl) {
    const h = s.split(/\b(?:oder|bzw)\b\.?/i);
    if (h.length !== 2) return false;
    const [a, b] = h.map(x => (teile(x, anzahl) || []).map(p => parseAlle(p)[0]).filter(Number.isFinite).sort((p, q) => p - q));
    return a.length === anzahl && b.length === anzahl && a.every((v, i) => v === b[i]);
  }
  function unlesbarText(input, anzahl, art) {
    if (typeof input !== 'string' || !input.trim()) return 'Gib zuerst eine Antwort ein.';
    const s = input.replace(STRICHE, '-');
    const zahlen = (s.match(new RegExp(ZAHL, 'g')) || []).length;
    if (anzahl === 1) {
      if (zahlen > 1 && RECHENZEICHEN.test(s)) return 'Rechne aus und gib nur das Ergebnis ein.';
      if ((zahlen > 1 && HEDGEMARKER.test(s)) || /\b(?:oder|bzw)\b/i.test(s)) return 'Leg dich auf eine Antwort fest – ein Wert genügt.';
      if (zahlen > 1) return `Das lässt sich nicht als eine Zahl lesen. Erwartet wird genau ein Wert: ${FORM[art] || FORM.zahl}.`;
      return `Das lässt sich nicht lesen. Erwartet wird ${FORM[art] || FORM.zahl}.`;
    }
    const form = anzahl === 2 ? FORM.paar : FORM.tripel;
    if (TAUSCH.test(s) || reihenfolgeHedge(s, anzahl)) return 'Leg dich auf eine Reihenfolge fest – „oder umgekehrt“ gilt nicht.';
    // „3,4“ oder „3,-1“ für ein Paar: Komma als Trenner ohne Leerzeichen. Eine Dezimalzahl
    // ist bei mehreren Werten nie die Antwort – also nachfragen statt werten.
    const kette = s.replace(/\s+/g, '').replace(/^[A-Za-z′″']{0,3}\d{0,2}[({]|[)}]$/g, '');
    if (new RegExp(String.raw`^[+-]?\d+(?:,[+-]?\d+){${anzahl - 1}}$`).test(kette)) {
      return `Meinst du ${anzahl === 2 ? 'zwei' : 'drei'} Werte? Dann trenn sie mit Semikolon: „${kette.split(',').join('; ')}“.`;
    }
    if (!zahlen) return `Das lässt sich nicht lesen. Erwartet werden ${form}.`;
    return `Ein Teil davon lässt sich nicht lesen. Erwartet werden ${form}.`;
  }
  /* lesbar(input) muss dieselbe Lesart benutzen wie fn selbst: Was fn lesen kann,
     ist ein Versuch und wird gewertet – auch wenn es falsch ist. Sonst ließe sich
     mit einer Eingabe, die fn liest und unlesbar() nicht, beliebig oft raten. */
  function mitRueckmeldung(fn, anzahl, art, diagnose, lesbar) {
    fn.util = true;
    fn.anzahl = anzahl;
    fn.art = art;
    fn.unlesbar = input => {
      let ok = false, kann = false;
      try { ok = fn(input) === true; kann = lesbar(input); } catch (e) { kann = false; }
      if (ok) return null;
      const text = unlesbarText(input, anzahl, art);
      // Eine Kommakette oder ein Reihenfolge-Hedge ist auch dann eine Rückfrage, wenn fn etwas lesen könnte
      if (kann && !/^(?:Meinst du|Leg dich auf eine Reihenfolge)/.test(text || '')) return null;
      return text;
    };
    fn.diagnose = input => { try { return fn(input) ? null : diagnose(input); } catch (e) { return null; } };
    return fn;
  }
  /* Hinweise für eine einzelne Zahl gegen einen Zielwert – gemeinsam für
     numCheck und die Einzelwerte von multi/orderedCheck. */
  function zahlHinweis(werte, ziel, toleranz, k, opt = {}) {
    if (!werte.length) return null;
    if (ziel !== 0 && trifft(werte, -ziel, toleranz)) return 'Das Vorzeichen stimmt nicht.';
    // Richtige Zahl mit %-Zeichen, wo kein Prozentsatz gefragt ist („16 %“ für 16):
    // das % macht daraus 0,16. Umgekehrt die Dezimalzahl, wo der Prozentsatz gefragt ist.
    if (ziel !== 0 && k.prozent && !opt.prozent && trifft(werte, ziel / 100, toleranz / 100)) {
      return 'Gefragt ist ein Wert, kein Prozentsatz – mit %-Zeichen wird die Zahl als Hundertstel gelesen. Lass das % weg.';
    }
    if (ziel !== 0 && opt.prozent && !k.prozent && trifft(werte, ziel / 100, toleranz / 100)) {
      return 'Gefragt ist der Prozentsatz als Zahl vor dem %-Zeichen, nicht als Dezimalzahl.';
    }
    // Faktor 10, 100 oder 1000 daneben: Komma, Einheit – oder eine vergessene Angabe
    // aus der Aufgabe. Welches, ist von hier nicht zu sehen; darum neutral.
    if (ziel !== 0 && [10, 100, 1000, 0.1, 0.01, 0.001].some(f => trifft(werte, ziel * f, toleranz * f))) {
      return 'Die Ziffern stimmen, die Größenordnung nicht – ein Faktor 10, 100 oder 1000 fehlt oder ist zu viel.';
    }
    // „Nah dran“ nur knapp außerhalb einer echten Toleranz – dort ist es die
    // Rundung. Ein Prozent vom Ziel war zu viel: 1320 statt 1323 € ist keine
    // Rundung, sondern einfache statt Zinseszins-Verzinsung, 16,0 statt 15,9
    // ein Übertragsfehler. Ein Hinweis, der den Kernfehler „Rundung“ nennt,
    // schickt in die falsche Richtung.
    if (toleranz > 1e-6 && werte.some(v => Math.abs(v - ziel) <= 2 * toleranz)) {
      return 'Nah dran – schau auf die Rundung.';
    }
    return null;
  }

  /**
   * Prüffunktion: Eingabe muss (bis auf Toleranz) einer Zahl entsprechen.
   * opt.prozent: Die Antwort IST eine Prozentzahl („in %“) – „6 %“ heißt 6.
   *   Sonst heißt „5 %“ 0,05 – und „0,05 %“ ist dann 0,0005, also falsch.
   * opt.falscheEinheit: eine mitgetippte Einheit, die die Aufgabe nicht
   *   umgerechnet zeigt („30 cm“ bei „3 cm = ? mm“). Andere Einheiten und
   *   keine Einheit zählen wie bisher nur die Zahl.
   * opt.zahlwort: siehe kern().
   */
  function numCheck(value, tolerance = 1e-6, opt = {}) {
    const werteVon = input => {
      const k = kern(input, opt);
      if (!k) return { k: null, werte: [] };
      return { k, werte: parseAlle(input, opt).map(v => k.prozent && !opt.prozent ? v / 100 : v) };
    };
    const fn = (input) => {
      const { k, werte } = werteVon(input);
      if (!k) return false;
      if (opt.falscheEinheit && k.einheit && einheitNorm(k.einheit) === einheitNorm(opt.falscheEinheit)) return false;
      return trifft(werte, value, tolerance);
    };
    return mitRueckmeldung(fn, 1, 'zahl', input => {
      const { k, werte } = werteVon(input);
      if (!k) return null;
      if (opt.falscheEinheit && k.einheit && einheitNorm(k.einheit) === einheitNorm(opt.falscheEinheit)) {
        return 'Die Einheit ist noch die alte – rechne in die gefragte Einheit um.';
      }
      return zahlHinweis(werte, value, tolerance, k, opt);
    }, input => werteVon(input).werte.length > 0);
  }

  /**
   * Prüffunktion für Brüche. num/den ist die korrekte Lösung (muss nicht gekürzt übergeben werden).
   * requireReduced: Eingabe muss der vollständig gekürzte Bruch sein.
   */
  function fracCheck(num, den, requireReduced = true) {
    // Lösung normalisieren und kürzen
    let rn = num, rd = den;
    if (rd < 0) { rn = -rn; rd = -rd; }
    const g = gcd(rn, rd);
    rn /= g; rd /= g;
    const gleich = f => f.num * den === num * f.den;
    const fn = (input) => {
      const f = parseFraction(input);
      if (!f) return false;
      if (!requireReduced) return gleich(f);
      // Eingabe normalisieren (Vorzeichen in den Zähler)
      let fz = f.num, fd = f.den;
      if (fd < 0) { fz = -fz; fd = -fd; }
      if (gcd(fz, fd) !== 1) return false; // nicht vollständig gekürzt
      return fz === rn && fd === rd;
    };
    return mitRueckmeldung(fn, 1, 'bruch', input => {
      const f = parseFraction(input);
      if (!f) return parseAlle(input).length ? 'Gib das Ergebnis als Bruch an – Zähler, Schrägstrich, Nenner.' : null;
      if (gleich(f)) return 'Der Wert stimmt – aber der Bruch ist noch nicht vollständig gekürzt.';
      if (f.num * den === -num * f.den) return 'Das Vorzeichen stimmt nicht.';
      if (f.num !== 0 && f.num * num === f.den * den) return 'Zähler und Nenner vertauscht?';
      return null;
    }, input => parseAlle(input).length > 0);
  }

  /* Gemeinsame Hinweise für Antworten aus mehreren Werten. */
  const ZAHLNAME = ['null', 'ein', 'zwei', 'drei', 'vier'];
  function mehrHinweis(parts, values, tolerance, reihenfolge) {
    const n = values.length;
    if (!parts || parts.length !== n) return `Erwartet werden ${ZAHLNAME[n] || n} Werte, mit Semikolon getrennt.`;
    const gelesen = parts.map(p => parseAlle(p));
    if (gelesen.some(w => !w.length)) return null;
    // Vorzeichen zuerst – vor der Mengenprobe, sonst wäre „10; −10; 10“ für
    // (−10 | 10 | −10) eine Reihenfolge-Meldung
    const alleNegiert = reihenfolge
      ? values.every((v, i) => trifft(gelesen[i], -v, tolerance))
      : (() => { const r = values.slice(); return gelesen.every(w => { const i = r.findIndex(v => trifft(w, -v, tolerance)); if (i < 0) return false; r.splice(i, 1); return true; }); })();
    const alleRichtig = reihenfolge ? values.every((v, i) => trifft(gelesen[i], v, tolerance)) : false;
    if (alleNegiert && !alleRichtig && values.some(v => v !== 0)) return 'Die Vorzeichen stimmen nicht.';
    // Als Multimenge vergleichen: bei der Lösung (3; 3) ist „3; 6“ kein Reihenfolgefehler
    const rest = values.slice();
    let alsMenge = 0;
    gelesen.forEach(w => { const i = rest.findIndex(v => trifft(w, v, tolerance)); if (i >= 0) { rest.splice(i, 1); alsMenge++; } });
    if (reihenfolge) {
      if (alsMenge === n) return 'Die Werte kommen alle vor – aber nicht an der richtigen Stelle.';
      const anPosition = gelesen.filter((w, i) => trifft(w, values[i], tolerance)).length;
      if (anPosition === n - 1) return n === 2 ? 'Ein Wert stimmt schon.' : `${anPosition} von ${n} Werten stimmen schon.`;
    } else {
      if (alsMenge === n - 1) return n === 2 ? 'Ein Wert stimmt schon.' : `${alsMenge} von ${n} Werten stimmen schon.`;
    }
    return null;
  }

  /**
   * Prüffunktion für mehrere Lösungen (Reihenfolge egal). Trenner siehe teile().
   * Bei einem Paar aus Zahl und Gegenzahl gilt „±7“ – die Schreibweise, die
   * Erklärseite und Lösungsweg von x² = 49 selbst benutzen. Nur hier: Bei
   * Koordinaten (orderedCheck) wäre „±5“ ein Hedge.
   */
  const PLUSMINUS = new RegExp(String.raw`^(?:.*[=≈])?\s*(?:±|\+\s*\/?\s*-)\s*(${ZAHL})(?!\d)\s*$`);
  function multiCheck(values, tolerance = 1e-6) {
    // „±k“ gilt bei jedem Paar als die zwei Werte k und −k – bei x² + 9x = 0 ist
    // „±9“ die typische Fehlvorstellung, ein gewerteter Versuch, kein Lesefehler
    const teileVon = input => {
      let parts = teile(input, values.length);
      if (values.length === 2 && typeof input === 'string') {
        const pm = input.replace(STRICHE, '-').match(PLUSMINUS);
        if (pm) parts = [pm[1], '-' + pm[1].replace(/^[+-]/, '')];
      }
      return parts;
    };
    const fn = (input) => {
      const parts = teileVon(input);
      if (!parts || parts.length !== values.length) return false;
      const remaining = values.slice();
      for (const p of parts) {
        const werte = parseAlle(p);
        if (!werte.length) return false;
        const idx = remaining.findIndex(v => trifft(werte, v, tolerance));
        if (idx === -1) return false;
        remaining.splice(idx, 1);
      }
      return true;
    };
    const lesbar = input => { const p = teileVon(input); return !!p && p.length > 0 && p.every(x => parseAlle(x).length > 0); };
    return mitRueckmeldung(fn, values.length, 'zahl', input => mehrHinweis(teileVon(input), values, tolerance, false), lesbar);
  }

  /**
   * Prüffunktion für mehrere Lösungen mit FESTER Reihenfolge (z. B. "x; y" bei
   * Gleichungssystemen). Tragen alle Teile einen Namen („y = 7; x = 3“), zählt
   * der Name statt der Position: Wer beim Additionsverfahren zuerst y erhält,
   * schreibt es zuerst hin – und meint es so. Mit `namen` (['x', 'y']) müssen
   * es genau diese sein; ohne gilt die alphabetische Folge (x vor y, r vor s,
   * x₁ vor x₂). Gleiche Namen und „… oder umgekehrt“ sind ein Hedge.
   */
  function orderedCheck(values, tolerance = 1e-6, namen = null) {
    // Teile in der Reihenfolge, in der sie gegen values gehalten werden; null bei Hedge/Namensfehler
    const sortiert = input => {
      if (typeof input === 'string' && TAUSCH.test(input)) return null;
      let parts = teile(input, values.length);
      if (!parts || parts.length !== values.length) return parts;
      const gefunden = parts.map(teilName);
      if (gefunden.every(Boolean)) {
        if (new Set(gefunden).size !== gefunden.length) return null;
        const soll = namen ? namen.map(n => n.toLowerCase()) : gefunden.slice().sort();
        if (namen && (soll.length !== gefunden.length || soll.some(n => !gefunden.includes(n)))) return null;
        parts = soll.map(n => parts[gefunden.indexOf(n)]);
      }
      return parts;
    };
    const fn = (input) => {
      const parts = sortiert(input);
      if (!parts || parts.length !== values.length) return false;
      return parts.every((p, i) => trifft(parseAlle(p), values[i], tolerance));
    };
    const lesbar = input => { const p = sortiert(input); return !!p && p.length > 0 && p.every(x => parseAlle(x).length > 0); };
    const rm = mitRueckmeldung(fn, values.length, 'zahl', input => mehrHinweis(sortiert(input), values, tolerance, true), lesbar);
    // Fremde oder doppelte Namen („λ = 3; μ = 3“, „x = 2; x = 5“): nicht zuzuordnen, also keine Wertung
    const ohneNamen = rm.unlesbar;
    rm.unlesbar = input => {
      if (typeof input === 'string' && !TAUSCH.test(input) && sortiert(input) === null && teile(input, values.length)) {
        return namen ? `Benenne die Werte wie in der Aufgabe (${namen.join(' und ')}) – oder lass die Namen weg.` : 'Jeder Name darf nur einmal vorkommen – oder lass die Namen weg.';
      }
      return ohneNamen(input);
    };
    return rm;
  }

  /**
   * Prüffunktion für Wahrscheinlichkeiten: akzeptiert jeden wertgleichen
   * Bruch ("3/6" wie "1/2"), die Prozentschreibweise ("25 %" für 1/4) und
   * eine Dezimalzahl, die auf die getippten Stellen gerundet oder abgeschnitten
   * ist, mindestens zwei Stellen (bei Prozent zählen zwei dazu).
   * Eine relative Toleranz (2 % vom Ziel) ließ 0,857 für 0,850 durch: den
   * Wert des typischen Fehlers „mit Zurücklegen“, den die Aufgabe gerade
   * abprüfen soll – und „79 %“ für 7/9, das falsch gerundet ist.
   */
  function probCheck(num, den) {
    const ziel = num / den;
    const fn = (input) => {
      const k = kern(input);
      if (!k) return false;
      // „25 %“ ist kein Bruch 25/1 – die Prozentform geht den Zahlenweg
      const f = k.prozent ? null : parseFraction(input);
      if (f) return f.num * den === num * f.den;
      if (k.nenner !== null) return false;
      return lesarten(k.zahl).some(l => {
        const v = k.prozent ? l.wert / 100 : l.wert;
        const stellen = l.stellen + (k.prozent ? 2 : 0);
        if (Math.abs(v - ziel) < 1e-9) return true;
        if (stellen < 2) return false;
        // gerundet ODER abgeschnitten auf die getippten Stellen – „0,251“ für 0,25
        // ist keins von beiden, auch wenn es nur eine Einheit daneben liegt
        const f = Math.pow(10, stellen);
        const gerundet = Math.round(ziel * f + 1e-9) / f, abgeschnitten = Math.trunc(ziel * f + 1e-9) / f;
        return Math.abs(v - gerundet) < 1e-9 || Math.abs(v - abgeschnitten) < 1e-9;
      });
    };
    return mitRueckmeldung(fn, 1, 'wahrscheinlichkeit', input => {
      const k = kern(input);
      if (!k) return null;
      if (k.nenner !== null) {
        const f = parseFraction(input);
        return f && f.num * den === -num * f.den ? 'Das Vorzeichen stimmt nicht.' : null;
      }
      const werte = lesarten(k.zahl).map(l => k.prozent ? l.wert / 100 : l.wert);
      if (ziel !== 0 && werte.some(v => Math.abs(-v - ziel) < 0.0005)) return 'Das Vorzeichen stimmt nicht.';
      if (ziel !== 0 && werte.some(v => Math.abs(v * 100 - ziel) < 0.0005 || Math.abs(v / 100 - ziel) < 0.0005)) {
        return 'Prozent oder Dezimalzahl? Ohne %-Zeichen wird die Zahl als Dezimalzahl gelesen.';
      }
      if (werte.some(v => v > 1 || v < 0)) return 'Eine Wahrscheinlichkeit liegt zwischen 0 und 1 – in Prozent zwischen 0 % und 100 %.';
      // Kein „Nah dran“: Bei kleinen Wahrscheinlichkeiten liegt der typische
      // Rechenfehler innerhalb jedes absoluten Fensters.
      return null;
    }, input => kern(input) !== null);
  }

  /** Nachträglich eine Rückmeldung an einen eigenen check hängen (Generatoren mit Sonderregeln). */
  function rueckmeldung(fn, anzahl, art, diagnose, lesbar) {
    return mitRueckmeldung(fn, anzahl, art, diagnose || (() => null), lesbar || (input => kern(input) !== null));
  }

  return { rnd, choice, shuffle, gcd, lcm, fmt, frac, parseNum, parseAlle, parseFraction, teile, numCheck, fracCheck, multiCheck, orderedCheck, probCheck, rueckmeldung, mitSaat, zufall };
})();
