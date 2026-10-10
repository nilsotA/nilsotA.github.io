/* ============================================================
   MatheNils – Kern-Themen, Lerninhalte und Aufgaben-Generatoren
   Jedes Thema: { id, icon, title, tagline, learn, gen(diff) }
   gen(diff) liefert eine Aufgabe:
     { q, type: 'input'|'choice', placeholder?, check?, testAnswer?,
       options?, correct?, answerText, solution }
   Weitere Themen: topics-unterstufe.js, topics-mittelstufe.js,
   topics-oberstufe.js – zusammengeführt in topics-index.js
   ============================================================ */
'use strict';

const TOPICS_KERN = (() => {
  const { rnd, choice, shuffle, gcd, lcm, fmt, frac, numCheck, fracCheck, multiCheck } = Util;

  /* ---------- gemeinsame Helfer ---------- */

  /** Bruch vollständig kürzen, Vorzeichen in den Zähler. */
  function reduce(n, d) {
    const g = gcd(n, d);
    n /= g; d /= g;
    if (d < 0) { n = -n; d = -d; }
    return [n, d];
  }

  /** Bruch als HTML; ganze Zahlen ohne Bruchstrich. */
  function fracHTML(n, d) {
    return d === 1 ? `${fmt(n)}` : frac(fmt(n), fmt(d));
  }

  /** Bruch so, wie man ihn eintippen würde ("3/4" bzw. "5"). */
  function fracInput(n, d) {
    return d === 1 ? `${n}` : `${n}/${d}`;
  }

  /**
   * Zähler und Nenner für einen Bruch, der keine verkappte 1 ist.
   * Vorher konnten a und b gleich gezogen werden – dann stand in jeder fünften
   * Multiplikationsaufgabe „2/2 · 2/3“, also eine Aufgabe ohne Multiplikation.
   */
  function echterBruch(zMin, zMax, nMin, nMax) {
    let z = rnd(zMin, zMax), n = rnd(nMin, nMax);
    while (z === n) n = rnd(nMin, nMax);
    return [z, n];
  }

  /** Zahl für die Anzeige in einer Rechnung: negative Zahlen in Klammern. */
  function par(n) {
    return n < 0 ? `(${fmt(n)})` : `${fmt(n)}`;
  }

  /**
   * Koeffizient vor einer Variablen. In der Mathematik schreibt niemand „1x“
   * oder „−1x“ – stand aber genau so in Aufgaben und Lösungen, teilweise als
   * anzuklickende richtige Antwort.
   */
  function koef(k, v = 'x') {
    if (k === 1) return v;
    if (k === -1) return `−${v}`;
    return `${fmt(k)}${v}`;
  }

  /** Ein- oder Mehrzahl passend zur Anzahl – gegen „1 Kugeln“. */
  function plural(n, ein, viele) {
    return Math.abs(n) === 1 ? ein : viele;
  }

  /** Linearer Term "mx + b" hübsch formatiert. */
  function linTerm(m, b) {
    let s = m === 1 ? 'x' : m === -1 ? '−x' : `${fmt(m)}x`;
    if (b > 0) s += ` + ${b}`;
    else if (b < 0) s += ` − ${Math.abs(b)}`;
    return s;
  }

  /** Linke Seite "x² + px + q" hübsch formatiert. */
  function quadLhs(p, q) {
    let s = 'x²';
    if (p === 1) s += ' + x';
    else if (p === -1) s += ' − x';
    else if (p > 0) s += ` + ${p}x`;
    else if (p < 0) s += ` − ${Math.abs(p)}x`;
    if (q > 0) s += ` + ${q}`;
    else if (q < 0) s += ` − ${Math.abs(q)}`;
    return s;
  }

  /**
   * Multiple-Choice-Optionen mischen.
   *
   * Ablenker, die mit der Lösung oder untereinander zusammenfallen, werden
   * verworfen. Deshalb dürfen Generatoren **mehr als drei** übergeben: Die
   * überzähligen sind Reserve und rücken nur nach, wenn ein früherer wegfällt.
   * Ohne sie schrumpfte die Auswahl bei bestimmten Zufallszahlen auf drei oder
   * zwei Optionen – bei (x²)² blieb „x⁴ oder x⁵“ übrig, eine 50:50-Rateaufgabe.
   *
   * `gruende[i]` gehört zu `distractors[i]`: der Fehler, aus dem genau dieser
   * Ablenker entsteht („Hier sind die Exponenten multipliziert statt
   * addiert."). Die App zeigt ihn nach einem Fehlgriff an – so wie die
   * Eingabeprüfung die Fehlerart nennt. Ablenker ohne erkennbaren Fehler
   * (Nachbarzahlen, Füllwerte) bekommen keinen Grund; das ist erlaubt.
   *
   * Führen zwei **verschiedene** Fehler auf denselben Ablenker, entfällt der
   * Grund: Welchen Weg der Lernende gegangen ist, lässt sich dann nicht
   * sagen, und ein Hinweis, der in die falsche Richtung zeigt, ist schlimmer
   * als keiner. Das Ergebnis trägt `gruende` parallel zu `options`, an der
   * Stelle der Lösung immer `null`.
   */
  function makeChoice(correct, distractors, gruende = []) {
    const opts = [correct];
    const grund = new Map(), strittig = new Set();
    distractors.forEach((d, i) => {
      if (d === correct) return;
      const g = gruende[i] || null;
      if (grund.has(d)) {
        const alt = grund.get(d);
        if (g && alt && g !== alt) strittig.add(d);
        else if (g && !alt) grund.set(d, g);
        return;
      }
      grund.set(d, g);
      if (opts.length < 4) opts.push(d);
    });
    const shuffled = shuffle(opts);
    return {
      options: shuffled,
      correct: shuffled.indexOf(correct),
      gruende: shuffled.map(o => (o === correct || strittig.has(o)) ? null : grund.get(o) || null)
    };
  }

  /**
   * Auswahl, in der die Lösung an keinem Größenrang zu erkennen ist.
   *
   * Eine Auswahlaufgabe lässt sich raten, sobald die richtige Antwort unter
   * den vier Optionen immer dieselbe Rolle spielt. Bei den Ableitungen war der
   * Faktor der Lösung immer der größte und kam als einziger zweimal vor – die
   * blinde Regel „zweitgrößte Zahl“ traf 51 % statt 25 % (`ratbar.js`).
   *
   * Deshalb wird **zuerst der Rang gewürfelt**, den die Lösung unter den vier
   * Zahlen einnehmen soll, und erst danach werden so viele kleinere und
   * größere Ablenker gezogen, wie dieser Rang verlangt. Über viele Ziehungen
   * ist die Lösung gleich oft die kleinste, die zweitkleinste, die zweitgrößte
   * und die größte Zahl; jede Regel dieser Art trifft dann genau ein Viertel.
   * Ablenker mit **derselben Stellenzahl** wie die Lösung kommen zuerst: Wäre
   * die Lösung als einzige zweistellig, verriete schon ihre Länge sie.
   *
   * `kandidaten` ist eine Liste `[Text, Zahlenwert]`. Werte, die mit der
   * Lösung oder untereinander zusammenfallen, fallen heraus; was nicht gezogen
   * wird, geht als Reserve an `makeChoice`.
   *
   * `opt.pflicht` ist ein Ablenker, der immer erscheinen muss – etwa die Zahl
   * aus der Frage: Steht sie sonst nirgends, ist die Lösung die einzige
   * Option, die eine Zahl aus der Aufgabe trägt. `opt.rang` erzwingt einen
   * Rang, wenn der Aufrufer die Parameter schon danach gezogen hat.
   */
  function rangAuswahl(correct, wert, kandidaten, opt = {}) {
    const stellen = String(Math.abs(wert)).length;
    const gesehen = new Set([wert]);
    const frei = [];
    // Ein dritter Eintrag `[Text, Wert, Grund]` ist der Fehler hinter dem
    // Ablenker (siehe makeChoice). Fallen zwei Kandidaten mit verschiedenem
    // Grund auf denselben Wert, ist die Rückmeldung mehrdeutig und entfällt.
    const grundJeWert = new Map(), strittig = new Set();
    const merke = k => {
      if (!k || !k[2] || k[1] === wert) return;
      const alt = grundJeWert.get(k[1]);
      if (alt && alt !== k[2]) strittig.add(k[1]); else grundJeWert.set(k[1], k[2]);
    };
    kandidaten.forEach(merke); merke(opt.pflicht);
    for (const kand of kandidaten) {
      if (gesehen.has(kand[1]) || kand[0] === correct) continue;
      gesehen.add(kand[1]); frei.push(kand);
    }
    const grundVon = k => strittig.has(k[1]) ? null : grundJeWert.get(k[1]) || null;
    const pflicht = opt.pflicht && opt.pflicht[1] !== wert ? opt.pflicht : null;
    const rest = pflicht ? frei.filter(k => k[1] !== pflicht[1]) : frei;
    const kleiner = rest.filter(k => k[1] < wert);
    const groesser = rest.filter(k => k[1] > wert);
    const unten = pflicht && pflicht[1] < wert ? 1 : 0;
    const oben = pflicht && pflicht[1] > wert ? 1 : 0;
    // Rang 1 heißt: die Lösung ist die kleinste der vier Zahlen, Rang 4: die größte.
    const raenge = [];
    for (let r = 1; r <= 4; r++) {
      if (r - 1 < unten || 4 - r < oben) continue;
      if (r - 1 - unten <= kleiner.length && 4 - r - oben <= groesser.length) raenge.push(r);
    }
    if (!raenge.length) { const f = shuffle(frei); return makeChoice(correct, f.map(k => k[0]), f.map(grundVon)); }
    const rang = raenge.includes(opt.rang) ? opt.rang : choice(raenge);
    const ziehe = (liste, anzahl) => {
      const gleichLang = shuffle(liste.filter(k => String(Math.abs(k[1])).length === stellen));
      const anders = shuffle(liste.filter(k => String(Math.abs(k[1])).length !== stellen));
      return gleichLang.concat(anders).slice(0, anzahl);
    };
    const gezogen = (pflicht ? [pflicht] : [])
      .concat(ziehe(kleiner, rang - 1 - unten), ziehe(groesser, 4 - rang - oben));
    const reserve = frei.filter(k => !gezogen.includes(k));
    const liste = shuffle(gezogen).concat(shuffle(reserve));
    return makeChoice(correct, liste.map(k => k[0]), liste.map(grundVon));
  }

  /* Drei Ablenker so wählen, dass die Lösung an einer gewürfelten Stelle der
     Größe nach steht. Ohne das entstehen die Ablenker aus der Lösung (m+n+1,
     m+n+2, m·n) und die Lösung liegt zwangsläufig immer ähnlich – bei den
     Potenzgesetzen traf „die Zahl am nächsten am Mittelwert der Optionen“ so
     59 % statt 25 %. Erst den Rang ziehen, dann die Ablenker dazu: dieselbe
     Umkehrung wie bei der Ja-Quote in `teilbarkeit`. */
  function ablenkerMitRang(richtig, kandidaten) {
    const pool = [...new Set(kandidaten)].filter(k => k >= 1 && k !== richtig);
    if (pool.length < 3) return pool;
    const kleiner = pool.filter(k => k < richtig), groesser = pool.filter(k => k > richtig);
    const ziel = rnd(0, 3);                       // so viele Ablenker sollen unter der Lösung liegen
    if (ziel > kleiner.length || 3 - ziel > groesser.length) return shuffle(pool).slice(0, 3);
    return [...shuffle(kleiner).slice(0, ziel), ...shuffle(groesser).slice(0, 3 - ziel)];
  }

  /** Zufallszahl ungleich 0 im Bereich [min, max]. */
  function rndNonZero(min, max) {
    let n = 0;
    while (n === 0) n = rnd(min, max);
    return n;
  }

  /* ============================================================
     1) Grundrechenarten
     ============================================================ */

  const grundrechenarten = {
    id: 'grundrechenarten',
    icon: '+−·:',
    title: 'Grundrechenarten',
    tagline: 'Kopfrechnen, Punkt vor Strich und Klammern',
    learn: `
      <h2>Sicher rechnen mit den Grundrechenarten</h2>
      <p>Die vier Grundrechenarten sind <strong>Addition</strong> (+), <strong>Subtraktion</strong> (−),
      <strong>Multiplikation</strong> (·) und <strong>Division</strong> (:). Ihre Ergebnisse heißen
      <em>Summe</em>, <em>Differenz</em>, <em>Produkt</em> und <em>Quotient</em>.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Rechenreihenfolge</span>
        <ul>
          <li><strong>Klammern</strong> werden immer zuerst berechnet.</li>
          <li>Danach gilt <strong>Punkt vor Strich</strong>: erst · und :, dann + und −.</li>
          <li>Sonst wird von links nach rechts gerechnet.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Punkt vor Strich</span>
        <p>8 + 4 · 5 = 8 + 20 = <strong>28</strong>&nbsp;(nicht 60!)</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Klammern zuerst</span>
        <p>(8 + 4) · 5 = 12 · 5 = <strong>60</strong></p>
      </div>
      <h3>Tipps fürs Kopfrechnen</h3>
      <ul>
        <li>Zerlege geschickt: 47 + 38 = 47 + 40 − 2 = 85</li>
        <li>Bei · 5: erst · 10, dann halbieren. 24 · 5 = 240 : 2 = 120</li>
        <li>Division ist die Umkehrung: 72 : 8 = ? heißt „? · 8 = 72“.</li>
      </ul>
    `,
    gen(diff) {
      /* Hunderter, Zehner und Einer einer Zahl bis 999: 755 → [700, 50, 5].
         Die Lösungswege rechnen damit „stellenweise“ wie die Erklärseite
         („47 + 38 → Zehner 40 + 30 = 70, Einer 7 + 8 = 15, zusammen 85“).
         Vorher kündigten sie das Verfahren nur an („Stellenweise addieren:
         Hunderter, Zehner, Einer. 558 + 197 = 755.“) – der Übertrag, an dem der
         Fehler entsteht (8 + 7 = 15, 50 + 90 = 140), stand nirgends. */
      const stellen = n => [Math.floor(n / 100) * 100, Math.floor(n / 10) % 10 * 10, n % 10];
      const STELLE = ['Hunderter', 'Zehner', 'Einer'];

      if (diff === 1) {
        const kind = choice(['add', 'sub', 'mul', 'div']);
        if (kind === 'add') {
          const a = rnd(11, 89), b = rnd(11, 89), res = a + b;
          const [, za, ea] = stellen(a), [, zb, eb] = stellen(b);
          // Ist ein Einer 0, steht er nicht als „+ 0“ da; sind beide 0, gibt es
          // nur Zehner – dann wie bei der Multiplikation „Glatte Zehnerzahl“.
          const einer = ea && eb ? `Einer ${ea} + ${eb} = ${fmt(ea + eb)}` : `Einer ${fmt(ea + eb)}`;
          return { q: `Berechne: ${a} + ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: ea + eb === 0
              ? `Glatte Zehnerzahlen: ${za / 10} + ${zb / 10} = ${fmt((za + zb) / 10)}, also ${a} + ${b} = ${fmt(res)}.`
              : `${a} + ${b} → Zehner ${za} + ${zb} = ${fmt(za + zb)}, ${einer}, zusammen ${fmt(res)}.` };
        }
        if (kind === 'sub') {
          const a = rnd(25, 99), b = rnd(11, a - 10), res = a - b;
          // Vorher nur Ergebnis und Probe. Die Seite hat für genau diese Zahlen
          // zwei Wege: „Aufrunden: 68 − 29 = 68 − 30 + 1“ (bei den Einern 7 bis 9
          // der kürzere) und das Zerlegen in Zehner und Einer.
          const [, zb, eb] = stellen(b);
          const weg = eb === 0
            ? `Nur Zehner abziehen, die Einer bleiben: ${a} − ${b} = ${fmt(res)}`
            : eb >= 7
              ? `Aufrunden: ${a} − ${b} = ${a} − ${fmt(zb + 10)} + ${fmt(10 - eb)} = ${fmt(res)}`
              : `Erst die Zehner, dann die Einer abziehen: ${a} − ${fmt(zb)} = ${fmt(a - zb)}, ${fmt(a - zb)} − ${eb} = ${fmt(res)}`;
          return { q: `Berechne: ${a} − ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: `${weg}<br>Kontrolle: ${fmt(res)} + ${b} = ${a} ✓` };
        }
        if (kind === 'mul') {
          const a = rnd(3, 10), b = rnd(3, 10), res = a * b;
          return { q: `Berechne: ${a} · ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: `${a} · ${b} = ${res} – das kleine Einmaleins lohnt sich auswendig!` };
        }
        const b = rnd(2, 10), q0 = rnd(2, 10), a = b * q0;
        return { q: `Berechne: ${a} : ${b}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(q0), testAnswer: String(q0), answerText: `${q0}`,
          solution: `Frage dich: Welche Zahl mal ${b} ergibt ${a}? Antwort: ${q0}, denn ${q0} · ${b} = ${a}.` };
      }

      if (diff === 2) {
        const kind = choice(['add', 'sub', 'mul', 'div', 'mixed']);
        if (kind === 'add') {
          const a = rnd(120, 880), b = rnd(120, 880), res = a + b;
          const A = stellen(a), B = stellen(b), teile = [], summen = [];
          // Eine Stelle, an der ein Summand 0 ist, ohne „0 +“; sind beide 0, entfällt sie.
          for (let i = 0; i < 3; i++) {
            const s = A[i] + B[i];
            if (!s) continue;
            teile.push(A[i] && B[i] ? `${STELLE[i]} ${fmt(A[i])} + ${fmt(B[i])} = ${fmt(s)}` : `${STELLE[i]} ${fmt(s)}`);
            summen.push(fmt(s));
          }
          return { q: `Berechne: ${a} + ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: `Stellenweise: ${teile.join(', ')}` +
              (summen.length > 1 ? `, zusammen ${summen.join(' + ')} = ${fmt(res)}.` : '.') };
        }
        if (kind === 'sub') {
          const a = rnd(200, 950), b = rnd(110, a - 50), res = a - b;
          // „Bei großen Zahlen zuerst die Hunderter“ (Erklärseite). Stellen, an
          // denen der Subtrahend eine 0 hat, fallen weg – kein „− 0“.
          const schritte = [];
          let rest = a;
          for (const s of stellen(b)) {
            if (!s) continue;
            schritte.push(`${fmt(rest)} − ${fmt(s)} = ${fmt(rest - s)}`);
            rest -= s;
          }
          return { q: `Berechne: ${a} − ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: (schritte.length > 1 ? 'Stellenweise abziehen, zuerst die Hunderter: ' : 'Nur Hunderter abziehen, Zehner und Einer bleiben: ') +
              `${schritte.join(', ')}<br>Kontrolle: ${fmt(res)} + ${b} = ${a} ✓` };
        }
        if (kind === 'mul') {
          const a = rnd(11, 25), b = rnd(3, 9), res = a * b;
          // Bei a = 20 hieße die „Zerlegung“ 20 · 8 = 20 · 8 + 0 · 8 – sie
          // zerlegt dann nichts und verwirrt nur.
          const zerlegt = a % 10 !== 0;
          return { q: `Berechne: ${a} · ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: zerlegt
              ? `Zerlegen: ${a} · ${b} = ${Math.floor(a / 10) * 10} · ${b} + ${a % 10} · ${b} = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${res}.`
              : `Glatte Zehnerzahl: ${a / 10} · ${b} = ${a / 10 * b}, also ${a} · ${b} = ${res}.` };
        }
        if (kind === 'div') {
          // Der Ergebnisbereich lag mit [3,12] im kleinen Einmaleins und damit
          // vollständig in Stufe 1 – „30 : 10“ war auf beiden Stufen dieselbe
          // Aufgabe. Ab 11 verlässt das Ergebnis das Einmaleins.
          const b = rnd(3, 12), q0 = rnd(11, 30), a = b * q0;
          // Abgespalten wird das größte Zehnervielfache von b, damit der Rest
          // im Einmaleins liegt – wie auf der Seite (84 = 60 + 24). Vorher immer
          // 10 · b: Bei 234 : 9 blieb 144 : 9 übrig, so schwer wie die Aufgabe.
          const z = Math.floor(q0 / 10) * 10;
          return { q: `Berechne: ${a} : ${b}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(q0), testAnswer: String(q0), answerText: `${q0}`,
            solution: (q0 === z
              ? `Glatte Zehnerzahl: ${fmt(a / 10)} : ${b} = ${fmt(q0 / 10)}, also ${a} : ${b} = ${fmt(q0)}.<br>`
              : `Dividend zerlegen: ${a} = ${fmt(b * z)} + ${fmt(a - b * z)}, also ${a} : ${b} = ${fmt(z)} + ${fmt(q0 - z)} = ${fmt(q0)}.<br>`) +
              `Kontrolle: ${fmt(q0)} · ${b} = ${a} ✓` };
        }
        const b = rnd(2, 9), c = rnd(2, 9), plus = choice([true, false]);
        if (plus) {
          const a = rnd(10, 60), res = a + b * c;
          return { q: `Berechne: ${a} + ${b} · ${c}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: `Punkt vor Strich! Zuerst ${b} · ${c} = ${b * c}, dann ${a} + ${b * c} = ${res}.` };
        }
        const a = b * c + rnd(2, 40), res = a - b * c;
        return { q: `Berechne: ${a} − ${b} · ${c}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
          solution: `Punkt vor Strich! Zuerst ${b} · ${c} = ${b * c}, dann ${a} − ${b * c} = ${res}.` };
      }

      // diff === 3
      const kind = choice(['mul2', 'div3', 'klammer', 'mixed2']);
      if (kind === 'mul2') {
        const a = rnd(12, 29), b = rnd(12, 29), res = a * b;
        return { q: `Berechne: ${a} · ${b}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
          solution: b % 10 !== 0
            ? `Schriftlich oder zerlegt: ${a} · ${b} = ${a} · ${Math.floor(b / 10) * 10} + ${a} · ${b % 10} = ${a * Math.floor(b / 10) * 10} + ${a * (b % 10)} = ${res}.`
            : `Glatte Zehnerzahl: ${a} · ${b / 10} = ${a * (b / 10)}, also ${a} · ${b} = ${res}.` };
      }
      if (kind === 'div3') {
        const b = rnd(3, 9), q0 = rnd(21, 120), a = b * q0;
        // Vorher nur Ergebnis und Probe – auf der Stufe mit den größten
        // Dividenden. Jetzt zerlegt wie auf Stufe 2, nach den Stellen des
        // Ergebnisses: Jeder Teil ist ein Einmaleins-Vielfaches von b mal 100,
        // mal 10 oder mal 1 (714 = 600 + 60 + 54). Teile mit 0 fallen weg.
        const qTeile = stellen(q0).filter(Boolean);
        return { q: `Berechne: ${a} : ${b}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(q0), testAnswer: String(q0), answerText: `${q0}`,
          solution: (q0 % 10 === 0
            ? `Glatte Zehnerzahl: ${fmt(a / 10)} : ${b} = ${fmt(q0 / 10)}, also ${a} : ${b} = ${fmt(q0)}.<br>`
            : `Dividend zerlegen: ${a} = ${qTeile.map(t => fmt(t * b)).join(' + ')}, ` +
              `also ${a} : ${b} = ${qTeile.map(t => fmt(t)).join(' + ')} = ${fmt(q0)}.<br>`) +
            `Kontrolle: ${fmt(q0)} · ${b} = ${a} ✓` };
      }
      if (kind === 'klammer') {
        const a = rnd(3, 20), b = rnd(3, 20), c = rnd(3, 9), res = (a + b) * c;
        return { q: `Berechne: (${a} + ${b}) · ${c}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
          solution: `Klammern zuerst: ${a} + ${b} = ${a + b}, dann ${a + b} · ${c} = ${res}.` };
      }
      let a = rnd(4, 12), b = rnd(4, 12), c = rnd(2, 9), d = rnd(2, 9);
      if (a * b < c * d) { [a, c] = [c, a]; [b, d] = [d, b]; }
      const res = a * b - c * d;
      return { q: `Berechne: ${a} · ${b} − ${c} · ${d}`, type: 'input', placeholder: 'Ergebnis',
        check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
        solution: `Punkt vor Strich: erst beide Produkte. ${a} · ${b} = ${a * b} und ${c} · ${d} = ${c * d}. Dann ${a * b} − ${c * d} = ${res}.` };
    }
  };

  /* ============================================================
     2) Brüche
     ============================================================ */

  /* Nennerpaare der Stufe 2 für „+“ und „−“. Kein Nenner teilt den anderen,
     der Hauptnenner ist also nie einer der beiden Nenner selbst – sonst
     stünde im Lösungsweg „Erweitern: 5/12 = 5/12“. */
  const BRUCH_NENNERPAARE = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 6], [2, 7], [4, 5], [6, 8], [3, 8], [5, 6], [2, 9], [4, 10]];

  /* Alle Subtraktionsaufgaben der Stufe 2, einmal aufgezählt und geordnet:
     [Hauptnenner bis 15, Hauptnenner 18 bis 30] → je Ergebnis → Aufgaben.
     Gezogen wird von außen nach innen – erst die Größe des Hauptnenners, dann
     das Ergebnis, dann eine Aufgabe dazu.

     Vorher wurde das Nennerpaar gleichverteilt gezogen und die Zähler dazu.
     Kleine Paare liefern aber kaum verschiedene Differenzen: Bei 2 und 3 kommt
     immer ⅙ heraus (½ − ⅓ und ⅔ − ½), dazu liefern 3 und 4, 4 und 6, 2 und 9
     … ebenfalls ⅙. Ergebnis: ⅙ war in 16 % aller Subtraktionen die Antwort.
     Jetzt ist jedes Ergebnis innerhalb seiner Klasse gleich wahrscheinlich;
     das häufigste liegt bei 5 %.

     Die Klasse davor hält die Schwierigkeit: Zöge man das Ergebnis direkt aus
     allen 38, kämen die Hauptnenner 20, 24 und 30 auf 70 % statt 42 %, weil es
     mit ihnen schlicht mehr verschiedene Brüche gibt. So bleibt es wie vorher
     bei je der Hälfte. Ungekürzte Brüche in der Aufgabe (2/4, 4/6) bleiben
     erlaubt – nur mit ihnen muss am Ende gekürzt werden; bei gekürzten
     Brüchen dieser Nennerpaare geht jede Differenz schon glatt auf. */
  const BRUCH_DIFFERENZEN = (() => {
    const klassen = [new Map(), new Map()];
    for (const [dA, dB] of BRUCH_NENNERPAARE)
      for (let a1 = 1; a1 < dA; a1++)
        for (let a2 = 1; a2 < dB; a2++) {
          // Der größere Bruch steht vorn, damit die Differenz positiv ist.
          const [x, dx, y, dy] = a1 * dB > a2 * dA ? [a1, dA, a2, dB] : [a2, dB, a1, dA];
          const L = lcm(dx, dy), z = x * (L / dx) - y * (L / dy);
          if (z === 0) continue;   // 2/4 − 5/10: zwei gleich große Brüche
          const [rn, rd] = reduce(z, L);
          const klasse = klassen[L <= 15 ? 0 : 1], k = `${rn}/${rd}`;
          if (!klasse.has(k)) klasse.set(k, []);
          klasse.get(k).push([x, dx, y, dy]);
        }
    return klassen.map(m => [...m.values()]);
  })();

  const brueche = {
    id: 'brueche',
    icon: '½',
    title: 'Brüche',
    tagline: 'Kürzen, erweitern und mit Brüchen rechnen',
    learn: `
      <h2>Brüche verstehen</h2>
      <p>Ein Bruch beschreibt einen Anteil: ${frac(3, 4)} bedeutet „3 von 4 Teilen“.
      Oben steht der <strong>Zähler</strong>, unten der <strong>Nenner</strong>.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Kürzen und Erweitern</span>
        <p>Zähler und Nenner dürfen mit derselben Zahl multipliziert (erweitern) oder durch
        dieselbe Zahl geteilt (kürzen) werden – der Wert bleibt gleich:
        ${frac(6, 8)} = ${frac(3, 4)}</p>
      </div>
      <h3>Addieren und Subtrahieren</h3>
      <p>Nur <strong>gleichnamige</strong> Brüche (gleicher Nenner) kann man direkt addieren.
      Sonst zuerst auf den <strong>Hauptnenner</strong> (kleinstes gemeinsames Vielfaches) erweitern.</p>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>${frac(1, 2)} + ${frac(1, 3)} = ${frac(3, 6)} + ${frac(2, 6)} = ${frac(5, 6)}</p>
      </div>
      <h3>Multiplizieren und Dividieren</h3>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <ul>
          <li><strong>Mal:</strong> Zähler · Zähler und Nenner · Nenner.</li>
          <li><strong>Geteilt:</strong> Mit dem <strong>Kehrwert</strong> multiplizieren:
          ${frac(1, 2)} : ${frac(3, 4)} = ${frac(1, 2)} · ${frac(4, 3)} = ${frac(4, 6)} = ${frac(2, 3)}</li>
        </ul>
      </div>
      <p><em>Tipp:</em> Ergebnisse immer vollständig kürzen – so wollen es auch die Aufgaben hier.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['kuerzen', 'kuerzen', 'addGleich']);
        if (kind === 'kuerzen') {
          /* Erst den gekürzten Bruch ziehen, dann erweitern. Vorher wurden Zähler
             und Nenner gezogen und danach gekürzt – dabei landet jedes Paar mit
             n = d/2 auf ½, und bei Nenner 2 gibt es gar nichts anderes. Ergebnis:
             ½ war in 23 % aller Ziehungen die Antwort. Jetzt ist jeder der 31
             echten gekürzten Brüche mit Nenner bis 10 gleich wahrscheinlich. */
          const gekuerzt = [];
          for (const d of [2, 3, 4, 5, 6, 8, 9, 10])
            for (let n = 1; n < d; n++) if (gcd(n, d) === 1) gekuerzt.push([n, d]);
          const [n0, d0] = choice(gekuerzt);
          const k = rnd(2, 6);
          return {
            q: `Kürze den Bruch ${frac(n0 * k, d0 * k)} so weit wie möglich.`,
            type: 'input', placeholder: `z. B. ${beispielBruch(n0, d0)}`,
            check: fracCheck(n0, d0, true), testAnswer: fracInput(n0, d0),
            answerText: fracHTML(n0, d0),
            solution: `Der größte gemeinsame Teiler von ${n0 * k} und ${d0 * k} ist ${k}. Teile Zähler und Nenner durch ${k}: ${frac(n0 * k, d0 * k)} = ${fracHTML(n0, d0)}`
          };
        }
        const den = choice([4, 5, 6, 8, 10, 12]);
        /* Erst die Summe der Zähler gleichverteilt ziehen, dann die Summanden.
           Zieht man a und b unabhängig, ist a + b = den (Ergebnis genau 1) in
           1/(den−1) der Fälle – bei Nenner 4 also in jedem dritten. Über alle
           Nenner war „1“ so in 20 % aller Ziehungen die Antwort. */
        const summe = rnd(2, 2 * den - 2);
        const a = rnd(Math.max(1, summe - (den - 1)), Math.min(den - 1, summe - 1));
        const b = summe - a;
        const [rn, rd] = reduce(a + b, den);
        const g = gcd(a + b, den);
        const bsp = beispielBruch(rn, rd);
        return {
          q: `Berechne: ${frac(a, den)} + ${frac(b, den)} <span class="hint">Gib das Ergebnis vollständig gekürzt an (z. B. ${bsp} oder 2).</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: fracCheck(rn, rd, true), testAnswer: fracInput(rn, rd),
          answerText: fracHTML(rn, rd),
          solution: `Gleiche Nenner → Zähler addieren: ${frac(a, den)} + ${frac(b, den)} = ${frac(a + b, den)}` +
            (g > 1 ? `. Mit ${g} kürzen: ${fracHTML(rn, rd)}` : '')
        };
      }

      if (diff === 2) {
        const kind = choice(['addUngleich', 'addUngleich', 'mult']);
        if (kind === 'addUngleich') {
          const op = choice(['+', '−']);
          let a1, d1_, a2, d2_;
          if (op === '+') {
            [d1_, d2_] = choice(BRUCH_NENNERPAARE);
            a1 = rnd(1, d1_ - 1); a2 = rnd(1, d2_ - 1);
          } else {
            // Klasse des Hauptnenners → Ergebnis → Aufgabe (siehe BRUCH_DIFFERENZEN)
            [a1, d1_, a2, d2_] = choice(choice(choice(BRUCH_DIFFERENZEN)));
          }
          const L = lcm(d1_, d2_), f1 = L / d1_, f2 = L / d2_;
          const sumN = op === '+' ? a1 * f1 + a2 * f2 : a1 * f1 - a2 * f2;
          const [rn, rd] = reduce(sumN, L);
          const g = gcd(sumN, L);
          const bsp = beispielBruch(rn, rd);
          return {
            q: `Berechne: ${frac(a1, d1_)} ${op} ${frac(a2, d2_)} <span class="hint">Gib das Ergebnis vollständig gekürzt an (z. B. ${bsp} oder 2).</span>`,
            type: 'input', placeholder: `z. B. ${bsp}`,
            check: fracCheck(rn, rd, true), testAnswer: fracInput(rn, rd),
            answerText: fracHTML(rn, rd),
            solution: `Hauptnenner: ${L}. Erweitern: ${frac(a1, d1_)} = ${frac(a1 * f1, L)} und ${frac(a2, d2_)} = ${frac(a2 * f2, L)}.<br>` +
              `Dann: ${frac(a1 * f1, L)} ${op} ${frac(a2 * f2, L)} = ${frac(sumN, L)}` +
              (g > 1 ? ` = ${fracHTML(rn, rd)} (mit ${g} gekürzt)` : '')
          };
        }
        const [a, b] = echterBruch(1, 7, 2, 9), [c, d] = echterBruch(1, 7, 2, 9);
        const [rn, rd] = reduce(a * c, b * d);
        const g = gcd(a * c, b * d);
        return {
          q: `Berechne: ${frac(a, b)} · ${frac(c, d)} <span class="hint">Gib das Ergebnis vollständig gekürzt an.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(rn, rd)}`,
          check: fracCheck(rn, rd, true), testAnswer: fracInput(rn, rd),
          answerText: fracHTML(rn, rd),
          solution: `Zähler mal Zähler, Nenner mal Nenner: ${frac(`${a} · ${c}`, `${b} · ${d}`)} = ${frac(a * c, b * d)}` +
            (g > 1 ? ` = ${fracHTML(rn, rd)} (mit ${g} gekürzt)` : '')
        };
      }

      // diff === 3
      const kind = choice(['divi', 'toDec', 'toFrac']);
      if (kind === 'divi') {
        // Auch hier keine verkappte 1: c = d hieße „durch 1 teilen“.
        const [a, b] = echterBruch(1, 7, 2, 9), [c, d] = echterBruch(1, 7, 2, 9);
        const [rn, rd] = reduce(a * d, b * c);
        const g = gcd(a * d, b * c);
        return {
          q: `Berechne: ${frac(a, b)} : ${frac(c, d)} <span class="hint">Gib das Ergebnis vollständig gekürzt an.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(rn, rd)}`,
          check: fracCheck(rn, rd, true), testAnswer: fracInput(rn, rd),
          answerText: fracHTML(rn, rd),
          solution: `Mit dem Kehrwert multiplizieren: ${frac(a, b)} · ${frac(d, c)} = ${frac(`${a} · ${d}`, `${b} · ${c}`)} = ${frac(a * d, b * c)}` +
            (g > 1 ? ` = ${fracHTML(rn, rd)} (mit ${g} gekürzt)` : '')
        };
      }
      const decs = [[1, 2, '0,5'], [1, 4, '0,25'], [3, 4, '0,75'], [1, 5, '0,2'], [2, 5, '0,4'], [3, 5, '0,6'], [4, 5, '0,8'],
        [1, 8, '0,125'], [3, 8, '0,375'], [5, 8, '0,625'], [7, 8, '0,875'], [1, 10, '0,1'], [3, 10, '0,3'], [7, 10, '0,7'],
        [9, 10, '0,9'], [1, 20, '0,05'], [3, 20, '0,15'], [1, 25, '0,04'], [3, 25, '0,12']];
      const [n, d, decStr] = choice(decs);
      const target = [10, 100, 1000].find(t => t % d === 0);
      const f = target / d;
      if (kind === 'toDec') {
        return {
          q: `Schreibe ${frac(n, d)} als Dezimalzahl.`,
          type: 'input', placeholder: `z. B. ${fmt(beispielZahl(n / d, [0.35, 0.45, 0.65, 0.32]))}`,
          // numCheck allein akzeptierte „1/2“, weil parseNum die Bruchschreibweise
          // versteht – das Kind hätte die Frage abschreiben können. Genau die
          // verlangte Umwandlung blieb ungeprüft.
          // Der Lösungsweg schreibt „3/5 = 6/10 = 0,6“, also darf der Bruch links vom „=“ stehen.
          check: Util.rueckmeldung(
            (s) => { s = String(s); const i = Math.max(s.lastIndexOf('='), s.lastIndexOf('≈')); return !/\//.test(s.slice(i + 1)) && numCheck(n / d)(s); },
            1, 'zahl',
            (s) => { s = String(s); const i = Math.max(s.lastIndexOf('='), s.lastIndexOf('≈')); return /\//.test(s.slice(i + 1)) ? 'Gefragt ist die Dezimalzahl – der Bruch steht schon in der Aufgabe.' : numCheck(n / d).diagnose(s); }),
          testAnswer: decStr,
          answerText: decStr,
          // f = 1 (Nenner 10) schrieb „Erweitere auf den Nenner 10: 3/10 = 3/10
          // = 0,3 – es ist nichts zu erweitern“: ein leerer Schritt, der sich
          // selbst widerspricht. Die Seite nennt diesen Fall eigens: „Hat der
          // Nenner 10, 100 oder 1000, kannst du den Bruch direkt mit Komma schreiben.“
          solution: f > 1
            ? `Erweitere auf den Nenner ${target}: ${frac(n, d)} = ${frac(n * f, target)} = ${decStr}`
            : `Der Nenner ist schon ${target} – dann direkt mit Komma schreiben: ${frac(n, d)} = ${decStr} (${n === 1 ? 'ein' : n} Zehntel).`
        };
      }
      return {
        q: `Schreibe ${decStr} als vollständig gekürzten Bruch.`,
        type: 'input', placeholder: `z. B. ${beispielBruch(n, d)}`,
        check: fracCheck(n, d, true), testAnswer: fracInput(n, d),
        answerText: fracHTML(n, d),
        // f = 1 (Nenner 10) ergab „0,1 = 1/10. Mit 1 kürzen: 1/10“ – mit 1 zu
        // kürzen ist keine Rechenoperation, und der Bruch war schon gekürzt.
        solution: `${decStr} = ${frac(n * f, target)}` +
          (f > 1
            ? `. Mit ${f} kürzen: ${fracHTML(n, d)}`
            : ` – Zähler und Nenner haben außer 1 keinen gemeinsamen Teiler, der Bruch ist damit schon vollständig gekürzt.`)
      };
    }
  };

  /* ============================================================
     3) Prozentrechnung
     ============================================================ */

  const prozent = {
    id: 'prozent',
    icon: '%',
    title: 'Prozentrechnung',
    tagline: 'Prozentwert, Grundwert und Prozentsatz berechnen',
    learn: `
      <h2>Prozente – Anteile von Hundert</h2>
      <p>„Prozent“ heißt „von Hundert“: 25 % = ${frac(25, 100)} = ${frac(1, 4)} = 0,25.
      In jeder Prozentaufgabe stecken drei Größen:</p>
      <ul>
        <li><strong>Grundwert G</strong> – das Ganze (100 %)</li>
        <li><strong>Prozentsatz p %</strong> – der Anteil in Prozent</li>
        <li><strong>Prozentwert W</strong> – der Anteil als Zahl</li>
      </ul>
      <div class="merkkasten"><span class="merk-title">Merke: Die Grundgleichung</span>
        <p><span class="formula">W = G · p ⁄ 100</span></p>
        <p>Umgestellt:&nbsp;G = W · 100 ⁄ p&nbsp;und&nbsp;p = W · 100 ⁄ G</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>Wie viel sind 20 % von 150 €? → W = 150 · 20/100 = <strong>30 €</strong></p>
      </div>
      <h3>Nützliche Anker im Kopf</h3>
      <ul>
        <li>50 % = die Hälfte, 25 % = ein Viertel, 10 % = ein Zehntel</li>
        <li>1 % = Grundwert : 100 – daraus lässt sich alles zusammensetzen.</li>
        <li>Rabatt: neuer Preis = alter Preis − Prozentwert.</li>
      </ul>
    `,
    gen(diff) {
      // Zwei Formen je Einheit: „von 400 Punkten“ (Dativ) gegen „120 Punkte“
      // (Nominativ). Vorher stand beides gleich da – „von 400 Punkte“.
      const einheiten = [
        { nom: '€', dat: '€' },
        { nom: 'kg', dat: 'kg' },
        { nom: 'Punkte', dat: 'Punkten' }
      ];
      if (diff === 1) {
        const p = choice([10, 20, 25, 50, 75]);
        const G = rnd(1, 15) * 20;
        const W = G * p / 100;
        const tricks = { 10: 'ein Zehntel', 20: 'ein Fünftel', 25: 'ein Viertel', 50: 'die Hälfte', 75: 'drei Viertel' };
        return {
          q: `Wie viel sind ${p} % von ${G}?`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(W), testAnswer: String(W), answerText: fmt(W),
          solution: `${p} % ist ${tricks[p]} des Grundwerts.<br>W = G · p/100 = ${G} · ${p}/100 = ${fmt(W)}`
        };
      }
      if (diff === 2) {
        const kind = choice(['pw', 'gw']);
        if (kind === 'pw') {
          const p = choice([5, 15, 30, 40, 60, 90]);
          const G = rnd(2, 20) * 20;
          const W = G * p / 100;
          const einheit = choice(einheiten);
          return {
            q: `Wie viel sind ${p} % von ${G} ${einheit.dat}?`, type: 'input', placeholder: `Ergebnis in ${einheit.dat}`,
            check: numCheck(W), testAnswer: String(W), answerText: `${fmt(W)} ${einheit.nom}`,
            solution: `W = G · p/100 = ${G} · ${p}/100 = ${fmt(W)} ${einheit.nom}.<br>Tipp: 1 % von ${G} ist ${fmt(G / 100)} – mal ${p} nehmen.`
          };
        }
        const p = choice([5, 10, 20, 25, 50]);
        const G = rnd(2, 25) * 20;
        const W = G * p / 100;
        return {
          q: `${p} % eines Betrags sind ${fmt(W)} €. Wie hoch ist der gesamte Betrag (Grundwert)?`,
          type: 'input', placeholder: 'Betrag in €',
          check: numCheck(G), testAnswer: String(G), answerText: `${fmt(G)} €`,
          solution: `G = W · 100/p = ${fmt(W)} · 100/${p} = ${fmt(G)} €.<br>Probe: ${p} % von ${fmt(G)} € sind ${fmt(W)} €. ✓`
        };
      }
      // diff === 3
      const kind = choice(['ps', 'rabatt', 'erhoehung']);
      if (kind === 'ps') {
        let G, p, W;
        for (let i = 0; i < 60; i++) {
          // Schulgrößen statt Kleingruppen: „eine Schule mit 20 Schülerinnen
          // und Schülern“ gibt es nicht. Alle Werte sind Vielfache von 50, die
          // Suchschleife darunter findet weiterhin ganzzahlige Prozentsätze.
          G = choice([200, 250, 300, 400, 500, 600, 750, 800, 900]);
          p = choice([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90]);
          if ((G * p) % 100 === 0) { W = G * p / 100; break; }
        }
        if (W === undefined) { G = 200; p = 25; W = 50; }
        return {
          q: `In einer Schule mit ${G} Schülerinnen und Schülern fahren ${W} mit dem Rad. Wie viel Prozent sind das?`,
          type: 'input', placeholder: 'Prozent',
          check: numCheck(p, 1e-6, { prozent: true }), testAnswer: String(p), answerText: `${p} %`,
          solution: `p = W · 100/G = ${W} · 100/${G} = ${p} %`
        };
      }
      if (kind === 'rabatt') {
        // Ein Pullover kostet 40–120 €, keine 400 €. Die 20er-Schritte bleiben,
        // damit alle Prozentwerte (auch 25 %) ganzzahlig aufgehen.
        const P = rnd(2, 6) * 20;
        const p = choice([10, 20, 25, 30, 50]);
        const rab = P * p / 100, neu = P - rab;
        return {
          q: `Ein Pullover kostet ${P} €. Im Sale ist er um ${p} % reduziert. Was kostet er jetzt?`,
          type: 'input', placeholder: 'Preis in €',
          check: numCheck(neu), testAnswer: String(neu), answerText: `${fmt(neu)} €`,
          solution: `Rabatt: ${p} % von ${P} € = ${P} · ${p}/100 = ${fmt(rab)} €.<br>Neuer Preis: ${P} € − ${fmt(rab)} € = ${fmt(neu)} €<br>` +
            `Direkt: ${P} · ${fmt(1 - p / 100)} = ${fmt(neu)} € ✓`
        };
      }
      // Eine Monatskarte kostet 40–100 €. 20er-Schritte halten auch 5 %
      // ganzzahlig, die Rechenschritte bleiben damit unverändert.
      const P = rnd(2, 5) * 20;
      const p = choice([5, 10, 20, 25, 50]);
      const auf = P * p / 100, neu = P + auf;
      return {
        q: `Eine Monatskarte kostet ${P} €. Der Preis steigt um ${p} %. Wie teuer ist sie danach?`,
        type: 'input', placeholder: 'Preis in €',
        check: numCheck(neu), testAnswer: String(neu), answerText: `${fmt(neu)} €`,
        // Wie der Rabatt derselben Stufe und das Beispiel „5 % Aufschlag auf
        // 240 €“ der Seite: erst in W = G · p/100 einsetzen (Schritt 3 der
        // Seite), dann addieren, dann über den Faktor gegenrechnen. Vorher stand
        // nur „5 % von 60 € = 3 €“ – wer 5 % als ein Fünftel las, sah nicht, wo.
        solution: `Erhöhung: ${p} % von ${P} € = ${P} · ${p}/100 = ${fmt(auf)} €.<br>Neuer Preis: ${P} € + ${fmt(auf)} € = ${fmt(neu)} €<br>` +
          `Direkt: ${P} · ${fmt(1 + p / 100)} = ${fmt(neu)} € ✓`
      };
    }
  };

  /* ============================================================
     4) Gleichungen
     ============================================================ */

  const gleichungen = {
    id: 'gleichungen',
    icon: 'x=?',
    title: 'Gleichungen',
    tagline: 'Lineare Gleichungen Schritt für Schritt lösen',
    learn: `
      <h2>Gleichungen lösen wie eine Waage</h2>
      <p>Eine Gleichung ist wie eine Waage im Gleichgewicht. Was du auf der einen Seite machst,
      musst du auch auf der anderen machen – das sind <strong>Äquivalenzumformungen</strong>.
      Ziel: <strong>x allein</strong> auf eine Seite bringen.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Erlaubte Umformungen</span>
        <ul>
          <li>Auf beiden Seiten dieselbe Zahl <strong>addieren</strong> oder <strong>subtrahieren</strong></li>
          <li>Beide Seiten mit derselben Zahl (≠ 0) <strong>multiplizieren</strong> oder durch sie <strong>dividieren</strong></li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: 3x + 5 = 17</span>
        <p>3x + 5 = 17&nbsp;| − 5<br>
        3x = 12&nbsp;| : 3<br>
        x = <strong>4</strong></p>
        <p><em>Probe:</em> 3 · 4 + 5 = 17 ✓</p>
      </div>
      <h3>Strategie</h3>
      <ul>
        <li>Erst alle x-Terme auf eine Seite, alle Zahlen auf die andere.</li>
        <li>Klammern zuerst auflösen (oder durch den Faktor teilen).</li>
        <li>Am Ende immer die <strong>Probe</strong> machen – einsetzen und prüfen!</li>
      </ul>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['plus', 'minus', 'mal']);
        if (kind === 'plus') {
          const x = rnd(2, 30), a = rnd(2, 30), b = x + a;
          return { q: `Löse die Gleichung: x + ${a} = ${b}`, type: 'input', placeholder: 'x = ?',
            check: numCheck(x), testAnswer: String(x), answerText: `x = ${x}`,
            solution: `x + ${a} = ${b}&nbsp;| − ${a}<br>x = ${b} − ${a} = ${x}<br>Probe: ${x} + ${a} = ${b} ✓` };
        }
        if (kind === 'minus') {
          const a = rnd(2, 25), b = rnd(1, 30), x = a + b;
          return { q: `Löse die Gleichung: x − ${a} = ${b}`, type: 'input', placeholder: 'x = ?',
            check: numCheck(x), testAnswer: String(x), answerText: `x = ${x}`,
            solution: `x − ${a} = ${b}&nbsp;| + ${a}<br>x = ${b} + ${a} = ${x}<br>Probe: ${x} − ${a} = ${b} ✓` };
        }
        const a = rnd(2, 12), x = rnd(2, 12), b = a * x;
        return { q: `Löse die Gleichung: ${a} · x = ${b}`, type: 'input', placeholder: 'x = ?',
          check: numCheck(x), testAnswer: String(x), answerText: `x = ${x}`,
          solution: `${a} · x = ${b}&nbsp;| : ${a}<br>x = ${b} : ${a} = ${x}<br>Probe: ${a} · ${x} = ${b} ✓` };
      }

      if (diff === 2) {
        const kind = choice(['linPlus', 'linMinus', 'divX']);
        if (kind === 'linPlus') {
          const a = rnd(2, 9), x = rnd(1, 12), b = rnd(1, 30), c = a * x + b;
          return { q: `Löse die Gleichung: ${a}x + ${b} = ${c}`, type: 'input', placeholder: 'x = ?',
            check: numCheck(x), testAnswer: String(x), answerText: `x = ${x}`,
            solution: `${a}x + ${b} = ${c}&nbsp;| − ${b}<br>${a}x = ${c - b}&nbsp;| : ${a}<br>x = ${x}<br>Probe: ${a} · ${x} + ${b} = ${c} ✓` };
        }
        if (kind === 'linMinus') {
          const a = rnd(2, 9), x = rnd(2, 12), b = rnd(1, a * x - 1), c = a * x - b;
          return { q: `Löse die Gleichung: ${a}x − ${b} = ${c}`, type: 'input', placeholder: 'x = ?',
            check: numCheck(x), testAnswer: String(x), answerText: `x = ${x}`,
            solution: `${a}x − ${b} = ${c}&nbsp;| + ${b}<br>${a}x = ${c + b}&nbsp;| : ${a}<br>x = ${x}<br>Probe: ${a} · ${x} − ${b} = ${c} ✓` };
        }
        const a = rnd(2, 9), b = rnd(2, 12), x = a * b;
        return { q: `Löse die Gleichung: ${frac('x', a)} = ${b}`, type: 'input', placeholder: 'x = ?',
          check: numCheck(x), testAnswer: String(x), answerText: `x = ${x}`,
          solution: `${frac('x', a)} = ${b}&nbsp;| · ${a}<br>x = ${b} · ${a} = ${x}<br>Probe: ${x} : ${a} = ${b} ✓` };
      }

      // diff === 3
      const kind = choice(['beideSeiten', 'klammer']);
      if (kind === 'beideSeiten') {
        const a = rnd(3, 9), cc = rnd(1, a - 2 >= 1 ? a - 2 : 1), x = rndNonZero(-9, 12), b = rnd(1, 25);
        const d = (a - cc) * x + b;
        // d = 0 kommt vor (a = 4, cc = 2, x = −4, b = 8) und schrieb „2x + 0“.
        const rhs = d === 0 ? koef(cc)
          : d > 0 ? `${koef(cc)} + ${fmt(d)}`
                  : `${koef(cc)} − ${fmt(Math.abs(d))}`;
        // Probe in die ursprüngliche Gleichung (Schritt 6 der Seite, Beispiel
        // „x auf beiden Seiten … Probe: 27 = 27 ✓“). Dieser Typ war der einzige
        // ohne Probe – obwohl x hier oft negativ ist, also gerade dort, wo die
        // Seite die Probe gegen Vorzeichenfehler empfiehlt.
        const ccx = cc === 1 ? fmt(x) : `${cc} · ${par(x)}`;
        const rechts = d === 0
          ? (cc === 1 ? `x = ${fmt(x)}` : `${ccx} = ${fmt(cc * x)}`)
          : `${ccx} ${d > 0 ? '+' : '−'} ${fmt(Math.abs(d))} = ${fmt(cc * x + d)}`;
        return {
          q: `Löse die Gleichung: ${koef(a)} + ${b} = ${rhs}`, type: 'input', placeholder: 'x = ?',
          check: numCheck(x), testAnswer: String(x), answerText: `x = ${fmt(x)}`,
          solution: `${koef(a)} + ${b} = ${rhs}&nbsp;| − ${koef(cc)}<br>` +
            `${koef(a - cc)} + ${b} = ${fmt(d)}&nbsp;| − ${b}<br>` +
            `${koef(a - cc)} = ${fmt(d - b)}&nbsp;| : ${a - cc}<br>` +
            `x = ${fmt(x)}<br>` +
            `Probe: links ${a} · ${par(x)} + ${b} = ${fmt(a * x + b)}, rechts ${rechts} ✓`
        };
      }
      const a = rnd(2, 9), b = rnd(1, 9), x = rndNonZero(-9, 12), c = a * (x + b);
      // Das Verfahren der Seite (Schritt 2 „Klammern auflösen“) und der Tipp
      // der Stufe („Klammern zuerst ausmultiplizieren“) kommen zuerst. Vorher
      // teilte der Weg sofort durch den Faktor – ein Weg, den die Seite nicht
      // nennt; Tipp und Lösung widersprachen sich auf demselben Bildschirm.
      // Der kürzere Weg bleibt als begründeter Nachsatz stehen.
      return {
        q: `Löse die Gleichung: ${a} · (x + ${b}) = ${fmt(c)}`, type: 'input', placeholder: 'x = ?',
        check: numCheck(x), testAnswer: String(x), answerText: `x = ${fmt(x)}`,
        solution: `${a} · (x + ${b}) = ${fmt(c)}<br>` +
          `Klammer auflösen: ${a}x + ${fmt(a * b)} = ${fmt(c)}&nbsp;| − ${fmt(a * b)}<br>` +
          `${a}x = ${fmt(a * x)}&nbsp;| : ${a}<br>` +
          `x = ${fmt(x)}<br>` +
          `Probe: ${a} · (${fmt(x)} + ${b}) = ${a} · ${par(x + b)} = ${fmt(c)} ✓<br>` +
          `Kürzer geht es hier, weil rechts nur eine Zahl steht: gleich beide Seiten durch ${a} teilen → ` +
          `x + ${b} = ${fmt(c / a)}&nbsp;| − ${b} → x = ${fmt(x)}.`
      };
    }
  };

  /* ============================================================
     5) Lineare Funktionen
     ============================================================ */

  const linfunktion = {
    id: 'linfunktion',
    icon: 'mx+b',
    title: 'Lineare Funktionen',
    tagline: 'Steigung, y-Achsenabschnitt und Nullstellen',
    learn: `
      <h2>Lineare Funktionen: f(x) = mx + b</h2>
      <p>Der Graph einer linearen Funktion ist eine <strong>Gerade</strong>. Zwei Zahlen legen sie fest:</p>
      <ul>
        <li><strong>m – die Steigung:</strong> Wie steil ist die Gerade? Pro Schritt nach rechts geht es
        um m nach oben (m &gt; 0) oder unten (m &lt; 0).</li>
        <li><strong>b – der y-Achsenabschnitt:</strong> Dort schneidet die Gerade die y-Achse, im Punkt (0|b).</li>
      </ul>
      <div class="merkkasten"><span class="merk-title">Merke: Steigung aus zwei Punkten</span>
        <p><span class="formula">m = (y₂ − y₁) ⁄ (x₂ − x₁)</span></p>
        <p>„Höhenunterschied geteilt durch Breitenunterschied“ – das Steigungsdreieck.</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>f(x) = 2x − 1.&nbsp;Funktionswert an der Stelle 3: f(3) = 2 · 3 − 1 = <strong>5</strong>.
        Der Punkt (3|5) liegt also auf der Geraden.</p>
      </div>
      <h3>Nullstelle</h3>
      <p>Die Nullstelle ist der x-Wert, bei dem die Gerade die x-Achse schneidet.
      Setze f(x) = 0 und löse nach x auf: mx + b = 0 → x = −b/m.</p>
      <h3>Punktprobe</h3>
      <p>Liegt ein Punkt P(x|y) auf der Geraden? Setze x ein und prüfe, ob f(x) = y herauskommt.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const m = rndNonZero(-5, 5), b = rnd(-10, 10), x0 = rnd(-5, 8);
        const y = m * x0 + b;
        const bTeil = b > 0 ? ` + ${b}` : b < 0 ? ` − ${Math.abs(b)}` : '';
        // Bei m = 1 heißt die Funktion „x + 4“ – ein Faktor 1 steht nicht in
        // der Aufgabe, und „1 · 7 + 4 = 7 + 4“ ist ein leerer Schritt. Bei
        // m = −1 bleibt „−1 · (−5)“: Es macht die Vorzeichenregel sichtbar.
        const eingesetzt = m === 1 ? fmt(x0) : `${fmt(m)} · ${par(x0)}`;
        return {
          q: `Gegeben ist die Funktion f(x) = ${linTerm(m, b)}. Berechne f(${fmt(x0)}).`,
          type: 'input', placeholder: 'Funktionswert',
          check: numCheck(y), testAnswer: String(y), answerText: `f(${fmt(x0)}) = ${fmt(y)}`,
          // Ohne Summanden b entfiele der Zwischenschritt – sonst stand dort
          // „f(8) = 3 · 8 = 24 = 24“.
          solution: `Setze x = ${fmt(x0)} ein:<br>f(${fmt(x0)}) = ${eingesetzt}${bTeil}` +
            (m === 1 ? (bTeil ? ` = ${fmt(y)}` : '')
              : bTeil ? ` = ${fmt(m * x0)}${bTeil} = ${fmt(y)}` : ` = ${fmt(y)}`)
        };
      }
      if (diff === 2) {
        const kind = choice(['steigung', 'punktprobe']);
        if (kind === 'steigung') {
          const m = rndNonZero(-4, 4), b = rnd(-8, 8);
          const x1 = rnd(-6, 4), x2 = x1 + rnd(1, 6);
          const y1 = m * x1 + b, y2 = m * x2 + b;
          return {
            q: `Eine Gerade verläuft durch die Punkte A(${fmt(x1)} | ${fmt(y1)}) und B(${fmt(x2)} | ${fmt(y2)}). Bestimme die Steigung m.`,
            type: 'input', placeholder: 'm = ?',
            check: numCheck(m), testAnswer: String(m), answerText: `m = ${fmt(m)}`,
            solution: `m = ${frac('y₂ − y₁', 'x₂ − x₁')} = ${frac(`${fmt(y2)} − ${par(y1)}`, `${fmt(x2)} − ${par(x1)}`)} = ${frac(fmt(y2 - y1), fmt(x2 - x1))} = ${fmt(m)}`
          };
        }
        const m = rndNonZero(-4, 4), b = rnd(-8, 8), px = rnd(-5, 6);
        const trueY = m * px + b;
        const onLine = choice([true, false]);
        const py = onLine ? trueY : trueY + choice([-3, -2, -1, 1, 2, 3]);
        // „Ja“ bei einem Punkt neben der Geraden bekommt nur dann einen Grund,
        // wenn ein typischer Fehlerweg genau diesen Punkt trifft: b vergessen
        // (m · x allein ergibt y) oder x und y vertauscht (f(y) ergibt x).
        // Treffen zwei Wege zu, ist nicht zu sagen, welcher es war – dann
        // still. Beim Vertauschen gehört dazu „b mit falschem Vorzeichen“
        // (m · x − b ergibt y): Bei f(x) = x − 1 und P(−3 | −2) treffen beide.
        const ohneB = !onLine && b !== 0 && py === m * px;
        const vertauscht = !onLine && m * py + b === px && py !== m * px - b;
        // Wie auf Stufe 1: bei m = 1 kein „1 · 3“, bei m = 1 ohne b auch kein „f(3) = 3 = 3“.
        const bTeil = b > 0 ? ` + ${b}` : b < 0 ? ` − ${Math.abs(b)}` : '';
        const eingesetzt = m === 1 ? fmt(px) : `${fmt(m)} · ${par(px)}`;
        const grundJa = ohneB && !vertauscht
          ? (m === 1
            ? `So kommt man darauf, wenn der y-Achsenabschnitt fehlt: Ohne ihn ergäbe f(${fmt(px)}) genau ${fmt(py)}.`
            : `So kommt man darauf, wenn der y-Achsenabschnitt fehlt: ${fmt(m)} · ${par(px)} ergibt allein ${fmt(py)}.`)
          : vertauscht && !ohneB
            ? `So kommt man darauf, wenn x und y vertauscht werden: f(${fmt(py)}) ergibt ${fmt(px)}.`
            : null;
        return {
          q: `Liegt der Punkt P(${fmt(px)} | ${fmt(py)}) auf der Geraden f(x) = ${linTerm(m, b)}?`,
          type: 'choice', options: ['Ja', 'Nein'], correct: onLine ? 0 : 1, gruende: [grundJa, null],
          answerText: onLine ? 'Ja' : 'Nein',
          solution: `Punktprobe – setze x = ${fmt(px)} ein:<br>f(${fmt(px)}) = ${eingesetzt}${bTeil}` +
            (m === 1 && !bTeil ? '' : ` = ${fmt(trueY)}`) + '.<br>' +
            (onLine ? `Das stimmt mit y = ${fmt(py)} überein → P liegt auf der Geraden.` :
              `Der Punkt hat aber y = ${fmt(py)} ≠ ${fmt(trueY)} → P liegt nicht auf der Geraden.`)
        };
      }
      // diff === 3
      const kind = choice(['nullstelle', 'yabschnitt']);
      if (kind === 'nullstelle') {
        const m = choice([-4, -3, -2, 2, 3, 4, 5]);
        const x0 = rndNonZero(-8, 8);
        const b = -m * x0;
        return {
          q: `Bestimme die Nullstelle der Funktion f(x) = ${linTerm(m, b)}.`,
          type: 'input', placeholder: 'x = ?',
          check: numCheck(x0), testAnswer: String(x0), answerText: `x = ${fmt(x0)}`,
          solution: `Setze f(x) = 0:<br>${linTerm(m, b)} = 0&nbsp;| ${b > 0 ? `− ${b}` : `+ ${Math.abs(b)}`}<br>` +
            `${fmt(m)}x = ${fmt(-b)}&nbsp;| : ${par(m)}<br>x = ${fmt(x0)}`
        };
      }
      // x1 = 0 hieße: Der gegebene Punkt IST der gesuchte y-Achsenabschnitt.
      // Die Aufgabe fragt dann nichts und der Weg zeigt „− m · 0 = − 0“.
      const m = rndNonZero(-4, 4), b = rnd(-9, 9), x1 = rndNonZero(-5, 6);
      const y1 = m * x1 + b;
      return {
        q: `Eine Gerade hat die Steigung m = ${fmt(m)} und verläuft durch den Punkt P(${fmt(x1)} | ${fmt(y1)}). Bestimme den y-Achsenabschnitt b.`,
        type: 'input', placeholder: 'b = ?',
        check: numCheck(b), testAnswer: String(b), answerText: `b = ${fmt(b)}`,
        // Wie die Seite („Einsetzen von (3 | 10): 10 = 2 · 3 + b → b = 4“) und
        // der Tipp der Stufe: einsetzen, dann nach b auflösen. Vorher stand die
        // fertig umgestellte Formel b = y − m · x da, die keine Seite nennt, und
        // sie erzeugte das doppelte Minus („23 − (−4) · (−4)“), das der Weg der
        // Seite gar nicht kennt. Bei m = 1 entfällt die Zeile mit „1 ·“.
        solution: `Setze P(${fmt(x1)} | ${fmt(y1)}) und m = ${fmt(m)} in y = mx + b ein:<br>` +
          (m === 1 ? '' : `${fmt(y1)} = ${fmt(m)} · ${par(x1)} + b<br>`) +
          `${fmt(y1)} = ${fmt(m * x1)} + b&nbsp;| ${m * x1 > 0 ? '−' : '+'} ${fmt(Math.abs(m * x1))}<br>` +
          `b = ${fmt(b)}`
      };
    }
  };

  /* ============================================================
     6) Quadratische Gleichungen
     ============================================================ */

  const quadratisch = {
    id: 'quadratisch',
    icon: 'x²',
    title: 'Quadratische Gleichungen',
    tagline: 'Mit der pq-Formel zu beiden Lösungen',
    learn: `
      <h2>Quadratische Gleichungen</h2>
      <p>In einer quadratischen Gleichung kommt x² vor. Die <strong>Normalform</strong> lautet:</p>
      <p><span class="formula">x² + px + q = 0</span></p>
      <p>Sie hat <strong>bis zu zwei Lösungen</strong> – der Graph (eine Parabel) kann die x-Achse
      zweimal, einmal oder gar nicht schneiden.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die <span class="mathe">pq</span>-Formel</span>
        <p><span class="formula">x₁,₂ = −p⁄2 ± √( (p⁄2)² − q )</span></p>
        <p>Der Ausdruck unter der Wurzel heißt Diskriminante D:&nbsp;D &gt; 0 → zwei Lösungen,
        D = 0 → eine Lösung, D &lt; 0 → keine Lösung.</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: x² − 2x − 8 = 0</span>
        <p>p = −2, q = −8<br>
        x₁,₂ = 1 ± √(1 + 8) = 1 ± 3<br>
        x₁ = <strong>4</strong>,&nbsp;x₂ = <strong>−2</strong></p>
      </div>
      <h3>Sonderfälle ohne pq-Formel</h3>
      <ul>
        <li><strong>x² = a</strong> → Wurzel ziehen: x = ±√a (zwei Lösungen!)</li>
        <li><strong>x² + px = 0</strong> → x ausklammern: x · (x + p) = 0 → x₁ = 0, x₂ = −p</li>
      </ul>
    `,
    gen(diff) {
      if (diff === 1) {
        const k = rnd(2, 12), a = k * k;
        // Das Beispiel im Hinweis darf nie die Lösung sein: „4; −4“ war sie bei k = 4.
        // 13 und 15 liegen außerhalb von k = 2 … 12, müssen also nie ausweichen.
        const bsp = beispielZahl(k, [13, 15]);
        return {
          q: `Löse die Gleichung: x² = ${a} <span class="hint">Gib beide Lösungen an, z. B. „${bsp}; −${bsp}“.</span>`,
          type: 'input', placeholder: 'x₁; x₂',
          check: multiCheck([k, -k]), testAnswer: `${k}; -${k}`,
          answerText: `x₁ = ${k}, x₂ = −${k}`,
          solution: `Wurzel ziehen – und an beide Vorzeichen denken:<br>x = ±√${a}, also x₁ = ${k} und x₂ = −${k}.<br>Probe: ${k}² = ${a} und (−${k})² = ${a} ✓`
        };
      }
      if (diff === 2 || diff === 3) {
        const useAusklammern = diff === 3 && choice([true, false]);
        if (useAusklammern) {
          // Auf Stufe 1 lautet dieselbe Aufgabe „x² + 6x = 0“. Damit „Schwer“
          // nicht hinter „Mittel“ zurückfällt, steht hier ein Vorfaktor davor:
          // Erst muss a · x ausgeklammert werden, dann bleibt x − p übrig.
          const a = rnd(2, 5), p = rnd(2, 12) * choice([1, -1]);
          const lhs = `${koef(a, 'x²')} ${p > 0 ? '+' : '−'} ${koef(a * Math.abs(p), 'x')}`;
          const klammer = `x ${p > 0 ? `+ ${fmt(p)}` : `− ${fmt(Math.abs(p))}`}`;
          const bsp = beispielZahl(-p, [13, 15]);
          return {
            q: `Löse die Gleichung: ${lhs} = 0 <span class="hint">Gib beide Lösungen an, z. B. „0; ${bsp}“.</span>`,
            type: 'input', placeholder: 'x₁; x₂',
            check: multiCheck([0, -p]), testAnswer: `0; ${-p}`,
            answerText: `x₁ = 0, x₂ = ${fmt(-p)}`,
            solution: `Klammere den größten gemeinsamen Faktor aus – hier ${koef(a, 'x')}:<br>` +
              `${lhs} = ${koef(a, 'x')} · (${klammer}) = 0<br>` +
              `Ein Produkt ist 0, sobald ein Faktor 0 ist. Der Vorfaktor ${fmt(a)} ist nie 0, ` +
              `es bleiben also zwei Möglichkeiten:<br>` +
              `x = 0&nbsp;oder&nbsp;${klammer} = 0 → x₂ = ${fmt(-p)}<br>` +
              // Beide Summanden haben denselben Betrag a·p² und heben sich auf –
              // die Zeile subtrahiert also immer, unabhängig vom Vorzeichen von p.
              // Klammern um −p sind Pflicht: „−8²“ läse sich als −(8²).
              `<em>Probe für x₂:</em> ${fmt(a)} · ${par(-p)}² ${p > 0 ? '+' : '−'} ${fmt(a * Math.abs(p))} · ${par(-p)} = ` +
              `${fmt(a * p * p)} − ${fmt(a * p * p)} = 0 ✓`
          };
        }
        const lim = 9;
        let r = rndNonZero(-lim, lim), s = rndNonZero(-lim, lim);
        let tries = 0;
        while ((s === r || Math.abs(r + s) > 14) && tries++ < 50) s = rndNonZero(-lim, lim);
        if (s === r) s = r > 0 ? -r : r + 1 || 1;
        const p = -(r + s), q0 = r * s;
        const halbP = -p / 2;
        const D = (p / 2) * (p / 2) - q0;
        const sqrtD = Math.abs(r - s) / 2;
        const x1 = Math.max(r, s), x2 = Math.min(r, s);

        /* Die pq-Formel so, wie die Seite sie vorrechnet (Beet-Beispiel):
           „−p/2 = −1 • D = (−1)² − (−8) = 1 + 8 = 9 ⏎ x₁,₂ = −1 ± 3“. Vorher
           sprang der Weg von der allgemeinen Formel direkt auf „√(30,25)“ –
           gerade das doppelte Minus bei negativem q, das die Seite zweimal
           vorführt, fehlte, und D kam nicht vor, obwohl der Merkkasten damit
           arbeitet. */
        const pqWeg =
          `−p/2 = ${fmt(halbP)}&ensp;<span class="trenn">•</span>&ensp;` +
          `D = ${par(halbP)}² − ${par(q0)} = ${fmt(halbP * halbP)} ${q0 < 0 ? '+' : '−'} ${fmt(Math.abs(q0))} = ${fmt(D)}<br>` +
          `x₁,₂ = ${fmt(halbP)} ± √${fmt(D)} = ${fmt(halbP)} ± ${fmt(sqrtD)}<br>` +
          `x₁ = ${fmt(x1)},&nbsp;x₂ = ${fmt(x2)}<br>` +
          // Kontrolle über Vieta wie im Beispiel „Vorzeichen sauber ablesen“.
          // Die alte „Probe“ nannte eine Zerlegung (x − x₁)(x − x₂), die keine
          // Seite einführt, und multiplizierte nichts aus – das ✓ stand ohne Rechnung.
          `<em>Vieta-Kontrolle:</em> x₁ + x₂ = ${fmt(x1)} + ${par(x2)} = ${fmt(x1 + x2)} = −p ✓ und ` +
          `x₁ · x₂ = ${par(x1)} · ${par(x2)} = ${fmt(x1 * x2)} = q ✓`;

        /* p = 0 (s = −r): Es fehlt der x-Term. Das ist der erste Sonderfall der
           Seite („nur x² und Zahl → Wurzel ziehen“, Selbstcheck 3x² − 12 = 0).
           Durch die pq-Formel entstand „0 ± √(25)“ – genau der Weg, von dem die
           Seite abrät. q ist hier immer −r², also negativ. */
        const k = x1, kk = -q0;
        const wurzelWeg = `x² = ${fmt(kk)}<br>x = ±√${fmt(kk)} → x₁ = ${fmt(k)}, x₂ = ${fmt(-k)}`;

        // Stufe 3 stellte bis hierher genau dieselben Gleichungen wie Stufe 2,
        // nur mit einem um drei größeren Zahlenbereich – jede Stufe-2-Aufgabe
        // war damit auch auf „Schwer“ erreichbar. Der echte nächste Schritt ist
        // ein Vorfaktor vor x²: Erst durch ihn teilen, dann pq-Formel.
        if (diff === 3) {
          const a = rnd(2, 4);
          // p = 0 (s = −r) schrieb „4x² + 0x − 196“ – das lineare Glied fällt dann weg
          const linear = p === 0 ? '' : ` ${p > 0 ? '+' : '−'} ${koef(a * Math.abs(p), 'x')}`;
          const lhs = `${koef(a, 'x²')}${linear} ${q0 >= 0 ? '+' : '−'} ${fmt(a * Math.abs(q0))}`;
          return {
            q: `Löse die Gleichung: ${lhs} = 0 <span class="hint">Gib beide Lösungen an, z. B. „2; −5“.</span>`,
            type: 'input', placeholder: 'z. B. 2; −5',
            check: multiCheck([r, s]), testAnswer: `${r}; ${s}`,
            answerText: `x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}`,
            solution: p === 0
              ? `Hier fehlt der x-Term – Wurzel ziehen statt pq-Formel:<br>` +
                `${lhs} = 0&nbsp;| + ${fmt(a * kk)}<br>` +
                `${koef(a, 'x²')} = ${fmt(a * kk)}&nbsp;| : ${fmt(a)}<br>` +
                `${wurzelWeg}<br>` +
                `Probe: ${fmt(a)} · ${fmt(k)}² = ${fmt(a * kk)} und ${fmt(a)} · ${par(-k)}² = ${fmt(a * kk)} ✓`
              : `Vor x² steht ${fmt(a)} – die pq-Formel verlangt aber eine 1. Also zuerst durch ${fmt(a)} teilen:<br>` +
                `${lhs} = 0&nbsp;| : ${fmt(a)}<br>` +
                `${quadLhs(p, q0)} = 0<br>` +
                `Jetzt liegt die Normalform vor: p = ${fmt(p)}, q = ${fmt(q0)}.<br>` +
                `${pqWeg}<br>` +
                `<em>Achtung:</em> Das Teilen betrifft <strong>jeden</strong> Summanden – wer nur x² durch ${fmt(a)} teilt, bekommt eine andere Gleichung.`
          };
        }

        return {
          q: `Löse die Gleichung: ${quadLhs(p, q0)} = 0 <span class="hint">Gib beide Lösungen an, z. B. „2; −5“.</span>`,
          type: 'input', placeholder: 'z. B. 2; −5',
          check: multiCheck([r, s]), testAnswer: `${r}; ${s}`,
          answerText: `x₁ = ${fmt(x1)}, x₂ = ${fmt(x2)}`,
          solution: p === 0
            ? `Hier fehlt der x-Term – ein Sonderfall, die pq-Formel braucht es nicht:<br>` +
              `${quadLhs(p, q0)} = 0&nbsp;| + ${fmt(kk)}<br>` +
              `${wurzelWeg} (beide Vorzeichen!)<br>` +
              `Probe: ${fmt(k)}² − ${fmt(kk)} = 0 ✓ und ${par(-k)}² − ${fmt(kk)} = 0 ✓`
            : `pq-Formel mit p = ${fmt(p)}, q = ${fmt(q0)}:<br>${pqWeg}`
        };
      }
    }
  };

  /* ============================================================
     7) Potenzen & Wurzeln
     ============================================================ */

  const potenzen = {
    id: 'potenzen',
    icon: '√',
    title: 'Potenzen & Wurzeln',
    tagline: 'Potenzgesetze anwenden und Wurzeln ziehen',
    learn: `
      <h2>Potenzen und Wurzeln</h2>
      <p>Eine Potenz ist eine abgekürzte Multiplikation:
      a<sup>n</sup> bedeutet „a wird n-mal mit sich selbst multipliziert“.
      Beispiel: 2<sup>4</sup> = 2 · 2 · 2 · 2 = 16.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Potenzgesetze</span>
        <ul>
          <li>Gleiche Basis, mal:&nbsp;a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup></li>
          <li>Gleiche Basis, geteilt:&nbsp;a<sup>m</sup> : a<sup>n</sup> = a<sup>m−n</sup></li>
          <li>Potenz einer Potenz:&nbsp;(a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup></li>
          <li>Jede Zahl hoch 0:&nbsp;a<sup>0</sup> = 1 (für a ≠ 0)</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>x³ · x⁴ = x·x·x · x·x·x·x = x<sup>7</sup> – die Exponenten werden addiert, nicht multipliziert!</p>
      </div>
      <h3>Wurzeln</h3>
      <p>Die Quadratwurzel √a ist die Umkehrung des Quadrierens: √49 = 7, weil 7² = 49.
      Die Kubikwurzel ∛a ist die Umkehrung von „hoch 3“: ∛27 = 3, weil 3³ = 27.</p>
      <p><em>Tipp:</em> Lerne die Quadratzahlen bis 15² = 225 auswendig – das macht dich richtig schnell.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['quad', 'kubik', 'wurzel', 'zweier']);
        if (kind === 'quad') {
          const a = rnd(3, 15);
          return { q: `Berechne: ${a}<sup>2</sup>`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(a * a), testAnswer: String(a * a), answerText: `${a * a}`,
            solution: `${a}² = ${a} · ${a} = ${a * a}` };
        }
        if (kind === 'kubik') {
          const a = rnd(2, 6);
          return { q: `Berechne: ${a}<sup>3</sup>`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(a ** 3), testAnswer: String(a ** 3), answerText: `${a ** 3}`,
            solution: `${a}³ = ${a} · ${a} · ${a} = ${a * a} · ${a} = ${a ** 3}` };
        }
        if (kind === 'wurzel') {
          const a = rnd(2, 15);
          return { q: `Berechne: √${a * a}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(a), testAnswer: String(a), answerText: `${a}`,
            solution: `Gesucht ist die Zahl, die mit sich selbst multipliziert ${a * a} ergibt: ${a} · ${a} = ${a * a}, also √${a * a} = ${a}.` };
        }
        const n = rnd(4, 10);
        return { q: `Berechne: 2<sup>${n}</sup>`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(2 ** n), testAnswer: String(2 ** n), answerText: `${2 ** n}`,
          solution: `Immer verdoppeln: 2, 4, 8, 16, … Nach ${n} Schritten: 2<sup>${n}</sup> = ${2 ** n}.` };
      }

      if (diff === 2) {
        const kind = choice(['mal', 'geteilt', 'potenzPotenz']);
        if (kind === 'mal') {
          let m = rnd(2, 7), n = rnd(2, 7);
          if (m === 2 && n === 2) m = 3;
          // Letzter Eintrag ist Reserve: m · n fällt bei (2,3) und (3,2) mit m + n + 1 zusammen.
          const abl = ablenkerMitRang(m + n, [m * n, Math.abs(m - n), m + n + 1, m + n + 2, m + n - 1, m, n]);
          // Gründe über den Wert. m · n und |m − n| fallen nie zusammen; trifft
          // einer davon eine Nachbarzahl oder m bzw. n, bleibt der Fehlerweg
          // derselbe (4 − 2 ergibt eben 2). Nachbarzahlen, m und n selbst: still.
          const grund = e => e === m * n ? 'Hier sind die Exponenten multipliziert statt addiert.'
            : e === Math.abs(m - n) ? 'Hier sind die Exponenten subtrahiert statt addiert.' : null;
          const mc = makeChoice(`x<sup>${m + n}</sup>`, abl.map(e => `x<sup>${e}</sup>`), abl.map(grund));
          return { q: `Vereinfache: x<sup>${m}</sup> · x<sup>${n}</sup>`, type: 'choice',
            options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `x<sup>${m + n}</sup>`,
            solution: `Gleiche Basis, mal → Exponenten addieren: x<sup>${m}</sup> · x<sup>${n}</sup> = x<sup>${m}+${n}</sup> = x<sup>${m + n}</sup>` };
        }
        if (kind === 'geteilt') {
          const m = rnd(5, 9), n = rnd(2, m - 2);
          // Reserve am Ende: „Exponenten geteilt“ (Math.round) ergibt bei (5,2), (5,3)
          // und (6,4) genau m − n und wäre dann die richtige Antwort ein zweites Mal.
          const abl = ablenkerMitRang(m - n, [m + n, Math.round(m / n), m * n, m - n + 1, m - n - 1, m, n]);
          // „Geteilt“ nur, wenn die Division aufgeht: Aus 7 : 2 wird gerundet 4,
          // und auf 4 kommt niemand, der die Exponenten teilt.
          const grund = e => e === m + n ? 'Hier sind die Exponenten addiert statt subtrahiert.'
            : e === m * n ? 'Hier sind die Exponenten multipliziert statt subtrahiert.'
              : m % n === 0 && e === m / n ? 'Hier sind die Exponenten geteilt statt subtrahiert.' : null;
          const mc = makeChoice(`x<sup>${m - n}</sup>`, abl.map(e => `x<sup>${e}</sup>`), abl.map(grund));
          return { q: `Vereinfache: x<sup>${m}</sup> : x<sup>${n}</sup>`, type: 'choice',
            options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `x<sup>${m - n}</sup>`,
            solution: `Gleiche Basis, geteilt → Exponenten subtrahieren: x<sup>${m}</sup> : x<sup>${n}</sup> = x<sup>${m}−${n}</sup> = x<sup>${m - n}</sup>` };
        }
        // (2,2) ist der einzige Fall, in dem m + n und mⁿ beide m · n treffen –
        // übrig blieben „x⁴ oder x⁵“. Gleiche Absicherung wie im Zweig „mal“.
        const m = rnd(2, 5); let n = rnd(2, 5);
        if (m === 2 && n === 2) n = 3;
        const abl = ablenkerMitRang(m * n, [m + n, m * n + 1, m ** n > 40 ? m * n + 2 : m ** n, m * n - 1, m * n + 2, m, n]);
        // m + n und mⁿ treffen sich nur bei (2,2), das oben ausgeschlossen ist.
        const grund = e => e === m + n ? 'Hier sind die Exponenten addiert statt multipliziert.'
          : m ** n <= 40 && e === m ** n ? `Hier ist ${fmt(m)} hoch ${fmt(n)} gerechnet statt ${fmt(m)} mal ${fmt(n)}.` : null;
        const mc = makeChoice(`x<sup>${m * n}</sup>`, abl.map(e => `x<sup>${e}</sup>`), abl.map(grund));
        return { q: `Vereinfache: (x<sup>${m}</sup>)<sup>${n}</sup>`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `x<sup>${m * n}</sup>`,
          solution: `Potenz einer Potenz → Exponenten multiplizieren: (x<sup>${m}</sup>)<sup>${n}</sup> = x<sup>${m}·${n}</sup> = x<sup>${m * n}</sup>` };
      }

      // diff === 3
      const kind = choice(['mixcalc', 'nullExp', 'kubikwurzel']);
      if (kind === 'mixcalc') {
        const variant = choice(['diff', 'summe']);
        if (variant === 'diff') {
          const a = rnd(5, 12), b = rnd(2, a - 2);
          const res = a * a - b * b;
          return { q: `Berechne: ${a}<sup>2</sup> − ${b}<sup>2</sup>`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
            solution: `${a}² = ${a * a} und ${b}² = ${b * b}. Also ${a * a} − ${b * b} = ${res}.` };
        }
        const a = rnd(3, 9), b = rnd(2, 4);
        const res = a * a + b ** 3;
        return { q: `Berechne: ${a}<sup>2</sup> + ${b}<sup>3</sup>`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: `${res}`,
          solution: `${a}² = ${a * a} und ${b}³ = ${b ** 3}. Also ${a * a} + ${b ** 3} = ${res}.` };
      }
      if (kind === 'nullExp') {
        const a = choice([3, 5, 7, 12, 100, 2026]);
        const mc = makeChoice('1', ['0', `${a}`, 'nicht definiert'], [
          'Hier ist „hoch 0“ wie „mal 0“ gerechnet.',
          'Hier ist der Exponent 0 einfach weggelassen.',
          `„Hoch 0“ ist für jede Basis außer 0 festgelegt – und ${fmt(a)} ist nicht 0.`
        ]);
        return { q: `Was ist ${a}<sup>0</sup>?`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: '1',
          solution: `Jede Zahl (≠ 0) hoch 0 ergibt 1. Das passt zum Potenzgesetz: ${a}<sup>1</sup> : ${a}<sup>1</sup> = ${a}<sup>0</sup> – und ${a} : ${a} = 1.` };
      }
      const a = choice([2, 3, 4, 5, 6, 10]);
      return { q: `Berechne: ∛${a ** 3} <span class="hint">(Kubikwurzel)</span>`, type: 'input', placeholder: 'Ergebnis',
        check: numCheck(a), testAnswer: String(a), answerText: `${a}`,
        solution: `Gesucht ist die Zahl, die dreimal mit sich selbst multipliziert ${a ** 3} ergibt: ${a} · ${a} · ${a} = ${a ** 3}, also ∛${a ** 3} = ${a}.` };
    }
  };

  /* ============================================================
     8) Satz des Pythagoras
     ============================================================ */

  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

  function pickTriple(maxC = 60) {
    for (let i = 0; i < 40; i++) {
      const t = choice(TRIPLES);
      const k = rnd(1, 4);
      if (t[2] * k <= maxC) return [t[0] * k, t[1] * k, t[2] * k];
    }
    return [3, 4, 5];
  }

  const pythagoras = {
    id: 'pythagoras',
    icon: 'a²+b²',
    title: 'Satz des Pythagoras',
    tagline: 'Seitenlängen im rechtwinkligen Dreieck berechnen',
    learn: `
      <h2>Der Satz des Pythagoras</h2>
      <p>Er gilt <strong>nur in rechtwinkligen Dreiecken</strong>. Die beiden Seiten am rechten Winkel
      heißen <strong>Katheten</strong> (a und b), die längste Seite gegenüber dem rechten Winkel heißt
      <strong>Hypotenuse</strong> (c).</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">a² + b² = c²</span></p>
        <p>Die Flächen der Kathetenquadrate ergeben zusammen genau das Hypotenusenquadrat.</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Hypotenuse berechnen</span>
        <p>a = 3 cm, b = 4 cm:<br>
        c² = 3² + 4² = 9 + 16 = 25 → c = √25 = <strong>5 cm</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Kathete berechnen</span>
        <p>c = 13 cm, a = 5 cm:<br>
        b² = c² − a² = 169 − 25 = 144 → b = <strong>12 cm</strong></p>
      </div>
      <h3>Typische Anwendungen</h3>
      <ul>
        <li>Leiter an der Wand, Diagonale eines Rechtecks, Bildschirmdiagonale …</li>
        <li>Wichtig: Erst überlegen, welche Seite die Hypotenuse ist – sie liegt immer
        gegenüber dem rechten Winkel und ist die längste Seite!</li>
      </ul>
    `,
    gen(diff) {
      if (diff === 1) {
        const [a, b, c] = pickTriple(60);
        return {
          q: `In einem rechtwinkligen Dreieck sind die Katheten a = ${a} cm und b = ${b} cm lang. Berechne die Länge der Hypotenuse c (in cm).`,
          type: 'input', placeholder: 'c in cm',
          check: numCheck(c), testAnswer: String(c), answerText: `c = ${c} cm`,
          solution: `c² = a² + b² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}<br>c = √${c * c} = ${c} cm`
        };
      }
      if (diff === 2) {
        const [a, b, c] = pickTriple(60);
        const giveA = choice([true, false]);
        const given = giveA ? a : b, searched = giveA ? b : a;
        return {
          q: `In einem rechtwinkligen Dreieck ist die Hypotenuse c = ${c} cm lang, eine Kathete misst ${given} cm. Berechne die andere Kathete (in cm).`,
          type: 'input', placeholder: 'Kathete in cm',
          check: numCheck(searched), testAnswer: String(searched), answerText: `${searched} cm`,
          solution: `Nach der Kathete umstellen:<br>b² = c² − a² = ${c}² − ${given}² = ${c * c} − ${given * given} = ${searched * searched}<br>b = √${searched * searched} = ${searched} cm`
        };
      }
      // diff === 3
      const kind = choice(['leiter', 'diagonale', 'bildschirm']);
      if (kind === 'leiter') {
        const [a, b, c] = pickTriple(15);
        return {
          q: `Eine ${c} m lange Leiter lehnt an einer Wand. Ihr unteres Ende steht ${a} m von der Wand entfernt. In welcher Höhe (in m) berührt die Leiter die Wand?`,
          type: 'input', placeholder: 'Höhe in m',
          check: numCheck(b), testAnswer: String(b), answerText: `${b} m`,
          solution: `Die Leiter ist die Hypotenuse (c = ${c} m), Abstand und Höhe sind die Katheten.<br>` +
            `Höhe² = c² − Abstand² = ${c * c} − ${a * a} = ${b * b}<br>Höhe = √${b * b} = ${b} m`
        };
      }
      if (kind === 'diagonale') {
        // pickTriple liefert die kürzere Kathete zuerst – „lang“ muss aber die
        // größere Seite sein, sonst steht da „3 m lang und 4 m breit“. Erst ab
        // 25 m Diagonale ist es ein Sportplatz und keine Picknickdecke, und
        // höchstens 2,5-mal so lang wie breit – sonst wird es ein Feldweg.
        let breit, lang, diag;
        for (let i = 0; i < 60; i++) {
          [breit, lang, diag] = pickTriple(100);
          if (diag >= 25 && 2 * lang <= 5 * breit) break;
        }
        if (diag < 25 || 2 * lang > 5 * breit) { breit = 20; lang = 21; diag = 29; }
        return {
          q: `Ein rechteckiger Sportplatz ist ${lang} m lang und ${breit} m breit. Wie lang ist der diagonale Weg von Ecke zu Ecke (in m)?`,
          type: 'input', placeholder: 'Diagonale in m',
          check: numCheck(diag), testAnswer: String(diag), answerText: `${diag} m`,
          solution: `Die Diagonale ist die Hypotenuse:<br>d² = ${lang}² + ${breit}² = ${lang * lang} + ${breit * breit} = ${diag * diag}<br>d = √${diag * diag} = ${diag} m`
        };
      }
      // Ein Bildschirm ist breiter als hoch – pickTriple liefert die kürzere
      // Kathete zuerst, deshalb hier vertauscht. Ab 30 cm Diagonale ist es ein
      // Bildschirm („6 cm breit und 8 cm hoch“ war eine Armbanduhr); das
      // Seitenverhältnis bleibt zwischen 5:4 und 5:2, sonst entsteht ein
      // quadratischer oder ein kinobandförmiger Monitor.
      let hoch, breit, diag;
      for (let i = 0; i < 60; i++) {
        [hoch, breit, diag] = pickTriple(100);
        if (diag >= 30 && 2 * breit <= 5 * hoch && 4 * breit >= 5 * hoch) break;
      }
      if (diag < 30 || 2 * breit > 5 * hoch || 4 * breit < 5 * hoch) { hoch = 15; breit = 36; diag = 39; }
      return {
        q: `Ein Bildschirm ist ${breit} cm breit und ${hoch} cm hoch. Berechne seine Diagonale (in cm).`,
        type: 'input', placeholder: 'Diagonale in cm',
        check: numCheck(diag), testAnswer: String(diag), answerText: `${diag} cm`,
        solution: `Die Diagonale ist die Hypotenuse:<br>d² = ${breit}² + ${hoch}² = ${breit * breit} + ${hoch * hoch} = ${diag * diag}<br>d = √${diag * diag} = ${diag} cm`
      };
    }
  };

  /* ---------- Vektorschreibweise ----------
     Die analytische Geometrie braucht Spaltenvektoren. Ohne Mathe-Bibliothek
     ist das ein Inline-Grid mit zwei gebogenen Seitenlinien (siehe `.vek` im
     Stylesheet) – die lesen sich wie Klammern und tragen hell wie dunkel.
     Der Pfeil über einem Vektornamen kommt ebenfalls aus dem CSS, nicht aus
     dem kombinierenden Zeichen U+20D7: das setzen längst nicht alle Schriften. */

  /** Spaltenvektor aus Zahlen. Jede Komponente läuft durch `fmt` – sonst
      stünde dort der ASCII-Bindestrich statt des echten Minus. */
  function vek(komponenten) {
    return `<span class="vek">${komponenten.map(k => `<span>${fmt(k)}</span>`).join('')}</span>`;
  }

  /** Benannter Vektor, etwa `vname('a')` oder `vname('AB')`. */
  function vname(text) {
    return `<span class="vpfeil">${text}</span>`;
  }

  /** Punkt in Koordinatenschreibweise: P(2 | −1 | 3). */
  function punkt(name, koordinaten) {
    return `${name}(${koordinaten.map(k => fmt(k)).join(' | ')})`;
  }

  /**
   * Beispiel für Platzhalter und Hinweis, das NIE die Lösung ist. „z. B. 1/56“
   * beim Mini-Lotto war aus der Lösung gebaut, „z. B. 3/8“ traf beim Münzwurf
   * in der Hälfte der Ziehungen – wer abtippt, was grau im Feld steht, hatte
   * recht. design/pruefung/eingabe.js misst das je Aufgabentyp.
   */
  /* Früher stand hier „der erste Kandidat, der nicht die Lösung ist“. Dann
     stand fast immer „z. B. 1/6“ da – und stand „z. B. 1/4“ da, WAR die
     Lösung 1/6. Beim einfachen Würfelwurf verriet das Beispiel so in einem
     Drittel der Aufgaben die Antwort (`eingabe.js`, „Ausweichendes Beispiel“).
     Zwei Gegenmittel: Die Kandidaten sind Werte, die als Lösung kaum
     vorkommen (Nenner 7, 11, 13, 17), sodass fast nie ausgewichen werden
     muss – und gewählt wird zufällig unter allen, die nicht die Lösung sind,
     sodass ein Ausweichen nichts mehr über die Lösung sagt. */
  function beispielBruch(num, den, kandidaten = ['3/7', '5/11', '4/13', '6/17']) {
    const [n, d] = reduce(num, den);
    const frei = kandidaten.filter(k => k !== `${n}/${d}`);
    return frei.length ? choice(frei) : kandidaten[0];
  }
  function beispielZahl(wert, kandidaten) {
    const frei = kandidaten.filter(k => Math.abs(k - wert) > 1e-9);
    return frei.length ? choice(frei) : kandidaten[0];
  }

  // Gemeinsame Helfer für die weiteren Themen-Dateien verfügbar machen
  window.TopicUtils = { reduce, fracHTML, fracInput, par, linTerm, quadLhs, makeChoice, rangAuswahl, rndNonZero, pickTriple, koef, plural, vek, vname, punkt, beispielBruch, beispielZahl };

  return [grundrechenarten, brueche, prozent, gleichungen, linfunktion, quadratisch, potenzen, pythagoras];
})();
