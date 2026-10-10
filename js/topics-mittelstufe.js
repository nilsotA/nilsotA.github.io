/* ============================================================
   MatheNils – Neue Themen der Mittelstufe (Klasse 8–10)
   Zinsrechnung · Terme & binomische Formeln · Gleichungssysteme ·
   Flächen & Umfang · Körper & Volumen · Trigonometrie ·
   Statistik & Daten · Wahrscheinlichkeit
   ============================================================ */
'use strict';

const TOPICS_MITTEL_NEU = (() => {
  const { rnd, choice, shuffle, gcd, fmt, frac, numCheck, multiCheck, orderedCheck, probCheck } = Util;
  const { reduce, fracHTML, makeChoice, rndNonZero, koef, plural, par, quadLhs, beispielBruch } = TopicUtils;

  const PI = 3.14;

  /** Toleranter Zahlencheck für Aufgaben mit π ≈ 3,14 oder Rundung. */
  function circaCheck(value) {
    return numCheck(value, Math.abs(value) * 0.01 + 0.05);
  }

  /** Auf zwei Nachkommastellen runden. ⁴⁄₃ · π · r³ ergibt sonst Antworten wie
      „1436,02666667 cm³“ – zwölf Stellen, die niemand eintippt. Zusammengesetzte
      Körper runden nicht zwei Teile und addieren dann: Die Erklärseite sagt „Erst
      am Ende runden", und bei der Eistüte kam so 58,62 statt 58,61 heraus. Geht
      ein Teil nicht auf, steht er im Weg mit drei Stellen (siehe Eistüte). Die
      Dose darf ihre Kugel gerundet abziehen, weil der Zylinder immer aufgeht –
      dann ist das Ergebnis dasselbe. */
  const rundeCirca = x => Math.round(x * 100) / 100;

  /* ---------- Zinsrechnung ---------- */

  const zinsen = {
    id: 'zinsen',
    icon: 'K·p',
    title: 'Zinsrechnung',
    tagline: 'Zinsen, Kapital und Zinseszins',
    learn: `
      <h2>Zinsrechnung – Prozentrechnung mit Geld</h2>
      <p>Wer Geld anlegt, bekommt <strong>Zinsen</strong>. Die Größen heißen:
      <strong>Kapital K</strong> (das angelegte Geld), <strong>Zinssatz p %</strong> (pro Jahr)
      und <strong>Zinsen Z</strong>.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Jahreszinsen</span>
        <p><span class="formula">Z = K · p ⁄ 100</span></p>
        <p>Neues Kapital nach einem Jahr: K + Z = K · (1 + p/100)</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>1200 € zu 3 % pro Jahr: Z = 1200 · 3/100 = <strong>36 €</strong></p>
      </div>
      <h3>Zinseszins</h3>
      <p>Bleiben die Zinsen auf dem Konto, werden sie im nächsten Jahr <strong>mitverzinst</strong>:</p>
      <p><span class="formula">K<sub>n</sub> = K · (1 + p⁄100)<sup>n</sup></span></p>
      <div class="example-box"><span class="ex-title">Beispiel Zinseszins</span>
        <p>1000 € zu 5 % für 2 Jahre: 1000 · 1,05² = 1000 · 1,1025 = <strong>1102,50 €</strong></p>
      </div>
    `,
    gen(diff) {
      if (diff === 1) {
        const K = rnd(5, 50) * 100, p = rnd(1, 5);
        const Z = K * p / 100;
        return {
          q: `${fmt(K)} € werden zu ${p} % pro Jahr angelegt. Wie viel Zinsen gibt es nach einem Jahr (in €)?`,
          type: 'input', placeholder: 'Zinsen in €',
          check: numCheck(Z), testAnswer: String(Z), answerText: `${fmt(Z)} €`,
          solution: `Z = K · p/100 = ${fmt(K)} · ${p}/100 = ${fmt(Z)} €`
        };
      }
      if (diff === 2) {
        const kind = choice(['neuesKapital', 'zinssatz']);
        if (kind === 'neuesKapital') {
          const K = rnd(5, 40) * 100, p = rnd(2, 6);
          const Z = K * p / 100;
          return {
            q: `${fmt(K)} € liegen ein Jahr zu ${p} % auf dem Konto. Wie hoch ist das Kapital danach (in €)?`,
            type: 'input', placeholder: 'Kapital in €',
            check: numCheck(K + Z), testAnswer: String(K + Z), answerText: `${fmt(K + Z)} €`,
            solution: `Zinsen: Z = ${fmt(K)} · ${p}/100 = ${fmt(Z)} €.<br>Neues Kapital: ${fmt(K)} € + ${fmt(Z)} € = ${fmt(K + Z)} €`
          };
        }
        const K = choice([500, 800, 1000, 2000, 2500, 4000]);
        const p = rnd(2, 8);
        const Z = K * p / 100;
        return {
          q: `Für ${fmt(K)} € gibt es nach einem Jahr ${fmt(Z)} € Zinsen. Wie hoch ist der Zinssatz (in %)?`,
          type: 'input', placeholder: 'Zinssatz in %',
          check: numCheck(p, 1e-6, { prozent: true }), testAnswer: String(p), answerText: `${p} %`,
          solution: `p = Z · 100/K = ${fmt(Z)} · 100/${fmt(K)} = ${p} %`
        };
      }
      const K = rnd(5, 30) * 100;
      const p = choice([2, 5, 10]);
      const K2 = K * (100 + p) * (100 + p) / 10000;
      return {
        q: `${fmt(K)} € werden 2 Jahre zu ${p} % pro Jahr mit Zinseszins angelegt. Wie hoch ist das Kapital danach (in €)?`,
        type: 'input', placeholder: 'Kapital in €',
        check: numCheck(K2, 0.01), testAnswer: String(K2), answerText: `${fmt(K2, 2)} €`,
        solution: `Zinseszins-Formel: K₂ = K · (1 + p/100)² = ${fmt(K)} · ${fmt(1 + p / 100)}²<br>` +
          `Nach Jahr 1: ${fmt(K)} · ${fmt(1 + p / 100)} = ${fmt(K * (100 + p) / 100, 2)} €<br>` +
          `Nach Jahr 2: ${fmt(K * (100 + p) / 100, 2)} · ${fmt(1 + p / 100)} = ${fmt(K2, 2)} €`
      };
    }
  };

  /* ---------- Terme & binomische Formeln ---------- */

  const terme = {
    id: 'terme',
    icon: '(a+b)²',
    title: 'Terme & binomische Formeln',
    tagline: 'Zusammenfassen, ausmultiplizieren, faktorisieren',
    learn: `
      <h2>Mit Termen rechnen</h2>
      <p>Gleichartige Terme darf man <strong>zusammenfassen</strong>: 3x + 5x = 8x.
      Eine Zahl vor der Klammer wird auf <strong>jeden</strong> Summanden verteilt: 3 · (x + 4) = 3x + 12.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die drei binomischen Formeln</span>
        <ul>
          <li>1.&nbsp;(a + b)² = a² + 2ab + b²</li>
          <li>2.&nbsp;(a − b)² = a² − 2ab + b²</li>
          <li>3.&nbsp;(a + b)(a − b) = a² − b²</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>(x + 3)² = x² + 2 · 3 · x + 3² = <strong>x² + 6x + 9</strong><br>
        <em>Häufiger Fehler:</em> (x + 3)² ist <u>nicht</u> x² + 9 – der mittlere Term fehlt!</p>
      </div>
      <p><strong>Faktorisieren</strong> ist der Rückweg: x² + 10x + 25 = (x + 5)² – man erkennt es an
      den Quadratzahlen vorn und hinten.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['zusammen', 'ausmult']);
        if (kind === 'zusammen') {
          const a = rnd(2, 9), b = rnd(2, 9), c = rnd(1, Math.min(a + b - 1, 9));
          const res = a + b - c;
          // koef(res + 1) ist eine Nachbarzahl – nur bei c = 1 steckt ein Fehler
          // dahinter: Wer „− x“ nicht als 1x mitzählt, landet genau auf a + b.
          const mc = makeChoice(koef(res), [koef(a + b + c), koef(res, 'x²'), koef(res + 1)], [
            `Hier ist auch ${koef(c)} addiert – davor steht aber ein Minus.`,
            'Hier ist aus x ein x² geworden. Beim Zusammenfassen gleichartiger Terme bleibt die Variable, wie sie ist.',
            c === 1 ? 'So kommt man darauf, wenn − x gar nicht mitgezählt wird – ein x ohne Zahl davor zählt einmal.' : null
          ]);
          return {
            q: `Fasse zusammen: ${koef(a)} + ${koef(b)} − ${koef(c)}`, type: 'choice',
            options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: koef(res),
            solution: `Gleichartige Terme: nur die Zahlen verrechnen.<br>(${a} + ${b} − ${c})x = ${koef(res)}`
          };
        }
        const a = rnd(2, 9), b = rnd(2, 9);
        // Reserve am Ende: bei a = b = 2 ist a + b = a · b, der dritte Ablenker
        // wäre dann zeichengleich mit der Lösung.
        // (a + b)x: Bei a = b = 2 ist a + b = a · b – dann kann 4x ebenso aus
        // „alles miteinander multipliziert“ stammen, der Grund entfällt.
        const mc = makeChoice(`${a}x + ${a * b}`, [`${a}x + ${b}`, `${a + b}x`, `${a}x + ${a + b}`, `${a * b}x + ${a * b}`], [
          `Hier ist die ${fmt(a)} nur mit dem x multipliziert, nicht mit dem zweiten Summanden.`,
          a + b === a * b ? null : `Hier sind ${fmt(a)} und ${fmt(b)} addiert und vor das x gestellt. Die ${fmt(a)} multipliziert aber jeden Summanden der Klammer.`,
          `Hier sind ${fmt(a)} und ${fmt(b)} addiert statt multipliziert.`,
          `Hier ist auch das x mit der ${fmt(b)} aus der Klammer multipliziert.`
        ]);
        return {
          q: `Multipliziere aus: ${a} · (x + ${b})`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `${a}x + ${a * b}`,
          solution: `Die ${a} auf beide Summanden verteilen:<br>${a} · x + ${a} · ${b} = ${a}x + ${a * b}`
        };
      }
      if (diff === 2) {
        const b = rnd(2, 9);
        const plus = choice([true, false]);
        const sgn = plus ? '+' : '−';
        const correct = `x² ${sgn} ${2 * b}x + ${b * b}`;
        const mc = makeChoice(correct, [
          `x² + ${b * b}`,
          `x² ${sgn} ${b}x + ${b * b}`,
          // Vor b² steht in der Lösung immer ein Plus – der Ablenker muss also
          // fest ein Minus tragen. Gekoppelt an `plus` war er bei (x − b)²
          // Zeichen für Zeichen die richtige Antwort.
          `x² ${sgn} ${2 * b}x − ${b * b}`
        ], [
          `Hier fehlt der Mittelterm: (x ${sgn} ${fmt(b)})² ist nicht x² + ${fmt(b)}².`,
          'Beim Mittelterm fehlt der Faktor 2 aus 2ab.',
          `Vor ${fmt(b * b)} steht hier ein Minus, aber ${plus ? '' : 'auch '}${plus ? fmt(b) : par(-b)}² ist positiv.`
        ]);
        return {
          q: `Wende die binomische Formel an: (x ${sgn} ${b})²`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: correct,
          solution: `${plus ? '1.' : '2.'} binomische Formel: (a ${sgn} b)² = a² ${sgn} 2ab + b²<br>` +
            `(x ${sgn} ${b})² = x² ${sgn} 2 · ${b} · x + ${b}² = ${correct}`
        };
      }
      const kind = choice(['binom3', 'faktorisieren', 'koeff']);
      if (kind === 'binom3') {
        const b = rnd(2, 10);
        const correct = `x² − ${b * b}`;
        const mc = makeChoice(correct, [`x² + ${b * b}`, `x² − ${2 * b}x − ${b * b}`, `x² − ${2 * b}x + ${b * b}`], [
          `Vor ${fmt(b * b)} steht hier ein Plus, aber ${fmt(b)} · ${par(-b)} ist negativ.`,
          `Hier steht ein Mittelterm. Bei (x + ${fmt(b)})(x − ${fmt(b)}) heben sich +${fmt(b)}x und −${fmt(b)}x aber auf.`,
          `Das ist (x − ${fmt(b)})², die 2. binomische Formel.`
        ]);
        return {
          q: `Multipliziere aus: (x + ${b})(x − ${b})`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: correct,
          solution: `3. binomische Formel: (a + b)(a − b) = a² − b²<br>(x + ${b})(x − ${b}) = x² − ${b}² = ${correct}`
        };
      }
      if (kind === 'faktorisieren') {
        const b = rnd(2, 9);
        const correct = `(x + ${b})²`;
        const mc = makeChoice(correct, [`(x − ${b})²`, `(x + ${b})(x − ${b})`, `(x + ${b * b})²`], [
          `Ausmultipliziert ergibt das x² − ${fmt(2 * b)}x + ${fmt(b * b)}: Der Mittelterm hätte ein Minus.`,
          `Ausmultipliziert ergibt das x² − ${fmt(b * b)}: Bei der 3. binomischen Formel fehlt der Mittelterm.`,
          `Hier steht die Quadratzahl ${fmt(b * b)} selbst in der Klammer. Ausmultipliziert stünde hinten ${fmt(b ** 4)}.`
        ]);
        return {
          q: `Faktorisiere: x² + ${2 * b}x + ${b * b}`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: correct,
          solution: `Erkenne die 1. binomische Formel: vorn x², hinten ${b}² = ${b * b}, Mitte 2 · ${b} · x = ${2 * b}x.<br>` +
            `Also: x² + ${2 * b}x + ${b * b} = (x + ${b})²`
        };
      }
      const a = rnd(2, 4), b = rnd(1, 6);
      const correct = `${a * a}x² + ${2 * a * b}x + ${b * b}`;
      const mc = makeChoice(correct, [
        `${a * a}x² + ${b * b}`,
        `${a}x² + ${2 * a * b}x + ${b * b}`,
        `${a * a}x² + ${a * b}x + ${b * b}`
      ], [
        `Hier fehlt der Mittelterm: (${fmt(a)}x + ${fmt(b)})² ist nicht (${fmt(a)}x)² + ${fmt(b)}².`,
        `Hier ist nur das x quadriert, nicht der Koeffizient ${fmt(a)}.`,
        // Bei a = 2 ist a · b = 2b – derselbe Mittelterm entsteht, wenn dort
        // x statt 2x für a eingesetzt wird. Zwei Wege, also kein Grund.
        a === 2 ? null : 'Beim Mittelterm fehlt der Faktor 2 aus 2ab.'
      ]);
      return {
        q: `Wende die binomische Formel an: (${a}x + ${b})²`, type: 'choice',
        options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: correct,
        solution: `(a + b)² = a² + 2ab + b² mit a = ${a}x und b = ${b}:<br>` +
          `(${a}x)² + 2 · ${a}x · ${b} + ${b}² = ${correct}`
      };
    }
  };

  /* ---------- Lineare Gleichungssysteme ---------- */

  const lgs = {
    id: 'lgs',
    icon: 'x,y',
    title: 'Gleichungssysteme',
    tagline: 'Zwei Gleichungen, zwei Unbekannte',
    learn: `
      <h2>Lineare Gleichungssysteme (LGS)</h2>
      <p>Zwei Gleichungen mit zwei Unbekannten x und y – gesucht ist das Zahlenpaar,
      das <strong>beide</strong> Gleichungen erfüllt.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Lösungsverfahren</span>
        <ul>
          <li><strong>Einsetzungsverfahren:</strong> Eine Gleichung nach x oder y umstellen und in die andere einsetzen.</li>
          <li><strong>Additionsverfahren:</strong> Beide Gleichungen so addieren, dass eine Variable wegfällt.</li>
          <li><strong>Gleichsetzungsverfahren:</strong> Beide nach derselben Variablen umstellen und gleichsetzen.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel (Einsetzen)</span>
        <p>I.&nbsp;y = x + 1&ensp;<span class="trenn">•</span>&ensp;II.&nbsp;x + y = 5<br>
        I in II: x + (x + 1) = 5 → 2x = 4 → x = 2, dann y = 3.</p>
      </div>
      <p><em>Probe nicht vergessen:</em> Lösung in beide Gleichungen einsetzen!</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const x = rnd(1, 10), a = rnd(1, 8);
        const y = x + a, b = x + y;
        return {
          q: `Löse das Gleichungssystem:<br>I.&nbsp;y = x + ${a}<br>II.&nbsp;x + y = ${b} <span class="hint">Gib zuerst x, dann y an – z. B. „2; 5“.</span>`,
          type: 'input', placeholder: 'x; y',
          check: orderedCheck([x, y], 1e-6, ['x', 'y']), testAnswer: `${x}; ${y}`,
          answerText: `x = ${x}, y = ${y}`,
          solution: `Setze I in II ein: x + (x + ${a}) = ${b}<br>2x + ${a} = ${b} → 2x = ${b - a} → x = ${x}<br>` +
            `Dann: y = ${x} + ${a} = ${y}. Probe in II: ${x} + ${y} = ${b} ✓`
        };
      }
      if (diff === 2) {
        const x = rnd(1, 8), y = rnd(1, 8);
        const a1 = rnd(1, 4), a2 = rnd(1, 4), b = rnd(1, 4);
        const c1 = a1 * x + b * y, c2 = a2 * x - b * y;
        // x und y sind hier positiv, Klammern braucht es nicht. Sind beide
        // Koeffizienten 1, wäre der Zwischenschritt die Einsetzzeile noch einmal.
        const probeEin = `${a2 === 1 ? '' : a2 + ' · '}${fmt(x)} − ${b === 1 ? '' : b + ' · '}${fmt(y)}`;
        const probeAus = `${fmt(a2 * x)} − ${fmt(b * y)}`;
        const probe2 = `Probe in II: ${probeEin}${probeEin === probeAus ? '' : ` = ${probeAus}`} = ${fmt(c2)} ✓`;
        return {
          q: `Löse mit dem Additionsverfahren:<br>I.&nbsp;${a1 === 1 ? '' : a1}x + ${b === 1 ? '' : b}y = ${fmt(c1)}<br>II.&nbsp;${a2 === 1 ? '' : a2}x − ${b === 1 ? '' : b}y = ${fmt(c2)} <span class="hint">Gib zuerst x, dann y an – z. B. „2; 5“.</span>`,
          type: 'input', placeholder: 'x; y',
          check: orderedCheck([x, y], 1e-6, ['x', 'y']), testAnswer: `${x}; ${y}`,
          answerText: `x = ${x}, y = ${y}`,
          solution: `I + II addieren – die y-Terme heben sich auf:<br>${koef(a1 + a2)} = ${fmt(c1 + c2)} → x = ${x}<br>` +
            // Bei b = 1 fiel der Koeffizient weg und der Zwischenschritt wurde zur
            // wörtlichen Wiederholung des Endschritts: „→ y = 3 → y = 3“.
            `In I einsetzen: ${a1 === 1 ? '' : a1 + ' · '}${x} + ${b === 1 ? '' : b}y = ${fmt(c1)} → ` +
            (b === 1 ? `y = ${y}` : `${b}y = ${fmt(c1 - a1 * x)} → y = ${y}`) +
            // Schritt 5 der Seite: „Probe in beiden Gleichungen – erst dann ist die
            // Aufgabe fertig." y kam aus I, also prüft erst II wirklich etwas. Die
            // Stufe endete als einzige ohne Probe.
            `<br>${probe2}`
        };
      }
      const x = rndNonZero(-5, 8), y = rndNonZero(-5, 8);
      const a1 = rnd(1, 3), b1 = rnd(1, 3), a2 = rnd(1, 3);
      let b2 = rnd(1, 3);
      while (a1 * b2 === a2 * b1) b2 = rnd(1, 4) + 1; // Determinante ≠ 0 sicherstellen
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
      const eq = (a, b, c) => `${a === 1 ? '' : a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y = ${fmt(c)}`;

      // Der Weg folgt dem Verfahren der Erklärseite (Schritt 3 und Beispiel
      // „Additionsverfahren mit Vervielfachen“). Vorher vervielfachte er immer
      // beide Gleichungen über Kreuz („I · 3 − II · 1“, auch bei schon gleichen
      // Koeffizienten), schrieb I' und II' nie aus und rechnete stur I − II,
      // sodass in vier von zehn Aufgaben „| : −3“ stand.
      // Welche Variable wegfällt: Stimmt ein Koeffizient schon überein, die –
      // ohne Vervielfachen („Stimmt ein Koeffizient schon überein, sparst du dir
      // das Vervielfachen"). Sonst die, bei der weniger Gleichungen vervielfacht
      // werden müssen, jeweils nur bis zum kgV; bei Gleichstand die mit dem
      // kleineren kgV (kleinere Zahlen), sonst y wie im Beispiel der Seite.
      const faktoren = (p, q) => { const k = Util.lcm(p, q); return { f: [k / p, k / q], k, n: (k !== p) + (k !== q) }; };
      const fx = faktoren(a1, a2), fy = faktoren(b1, b2);
      const wegX = fx.n < fy.n || (fx.n === fy.n && fx.k < fy.k);
      const e = wegX ? 'x' : 'y', r = wegX ? 'y' : 'x';     // e fällt weg, r bleibt
      const [f1, f2] = (wegX ? fx : fy).f;
      const G1 = { x: a1 * f1, y: b1 * f1, c: c1 * f1 }, G2 = { x: a2 * f2, y: b2 * f2, c: c2 * f2 };
      const n1 = f1 === 1 ? 'I' : 'I′', n2 = f2 === 1 ? 'II' : 'II′';
      const zeilen = [];
      if (f1 === 1 && f2 === 1) {
        zeilen.push(`Additionsverfahren: Die ${e}-Koeffizienten stimmen schon überein, also ohne Vervielfachen subtrahieren:`);
      } else {
        const neu = [];
        if (f1 !== 1) neu.push(`I · ${f1} = I′: ${eq(G1.x, G1.y, G1.c)}`);
        if (f2 !== 1) neu.push(`II · ${f2} = II′: ${eq(G2.x, G2.y, G2.c)}`);
        zeilen.push(`Additionsverfahren: Hier hebt sich nichts weg. Also zuerst gleiche ${e}-Koeffizienten herstellen:`,
          neu.join('&ensp;<span class="trenn">•</span>&ensp;'));
      }
      // Die größere Gleichung zuerst, damit der Koeffizient positiv bleibt –
      // die Seite rechnet aus demselben Grund II' − I': 15x − 4x.
      const [P, Q, nP, nQ] = G1[r] > G2[r] ? [G1, G2, n1, n2] : [G2, G1, n2, n1];
      const kr = P[r] - Q[r], wr = wegX ? y : x;
      // Ist die abgezogene rechte Seite 0, bleibt rechts nur die andere Zahl stehen (kein
      // „4 − 0“). Folgt dann noch „4x = 4“ zum Teilen, bricht die Zeile um –
      // „= 4 → 4x = 4“ in einem Zug hielt der Sprachscan für eine Wiederholung.
      zeilen.push(`${nP} − ${nQ}: ${koef(P[r], r)} − ${koef(Q[r], r)} = ${Q.c === 0 ? `${fmt(P.c)}${kr === 1 ? ' → ' : '<br>'}` : `${fmt(P.c)} − ${par(Q.c)} → `}` +
        (kr === 1 ? `${r} = ${fmt(wr)}` : `${koef(kr, r)} = ${fmt(P.c - Q.c)}&nbsp;| : ${kr} → ${r} = ${fmt(wr)}`));

      // Zurücksetzen in I wie auf der Seite („In I: 4 + 3y = 13 → 3y = 9“):
      // erst einsetzen, das Produkt ausrechnen, dann umstellen. Vorher sprang
      // die Zeile von „3 · (7) + 2 · y = 25“ direkt zu „y = 2“ – gerade dort,
      // wo sich Vorzeichenfehler verstecken.
      const kBek = wegX ? b1 : a1, kUnb = wegX ? a1 : b1, we = wegX ? x : y, p = kBek * wr;
      const unbek = koef(kUnb, e);
      const eingesetzt = wegX
        ? (kBek === 1 ? `${unbek} ${wr < 0 ? '−' : '+'} ${fmt(Math.abs(wr))}` : `${unbek} + ${kBek} · ${par(wr)}`)
        : `${kBek === 1 ? fmt(wr) : `${kBek} · ${par(wr)}`} + ${unbek}`;
      const ausgerechnet = wegX ? `${unbek} ${p < 0 ? '−' : '+'} ${fmt(Math.abs(p))}` : `${fmt(p)} + ${unbek}`;
      // Das Ausrechnen beginnt eine neue Zeile: Einsetzen und Umstellen sind
      // zwei Schritte. In einem Zug stand „= 3 → 3x + 9 = 3“, und das hielt der
      // Sprachscan („Wiederholung über einen Pfeil“) für eine doppelte Zeile.
      zeilen.push(`In I einsetzen: ${eingesetzt} = ${fmt(c1)}` +
        (eingesetzt === ausgerechnet ? '' : `<br>${ausgerechnet} = ${fmt(c1)}`) +
        `&nbsp;| ${p < 0 ? '+' : '−'} ${fmt(Math.abs(p))} → ${unbek} = ${fmt(c1 - p)}` +
        (kUnb === 1 ? '' : `&nbsp;| : ${kUnb} → ${e} = ${fmt(we)}`));

      // Vorher stand hier „Probe in II: 2x + y ergibt −7 ✓“ – das ist
      // Gleichung II selbst, nur mit anderem Wort. Es wurde nichts eingesetzt.
      // a2 und b2 sind per Konstruktion positiv, das Vorzeichen ist immer „+“.
      // Den Zwischenschritt nur, wenn er sich von der Einsetzzeile unterscheidet –
      // sonst stand „4 + 1 = 4 + 1 = 5“.
      const probeEin = `${a2 === 1 ? fmt(x) : `${a2} · ${par(x)}`} + ${b2 === 1 ? par(y) : `${b2} · ${par(y)}`}`;
      const probeAus = `${fmt(a2 * x)} ${b2 * y >= 0 ? '+' : '−'} ${fmt(Math.abs(b2 * y))}`;
      zeilen.push(`Probe in II: ${probeEin}${probeEin === probeAus ? '' : ` = ${probeAus}`} = ${fmt(c2)} ✓`);
      return {
        q: `Löse das Gleichungssystem:<br>I.&nbsp;${eq(a1, b1, c1)}<br>II.&nbsp;${eq(a2, b2, c2)} <span class="hint">Gib zuerst x, dann y an – z. B. „2; −1“.</span>`,
        type: 'input', placeholder: 'x; y',
        check: orderedCheck([x, y], 1e-6, ['x', 'y']), testAnswer: `${x}; ${y}`,
        answerText: `x = ${fmt(x)}, y = ${fmt(y)}`,
        solution: zeilen.join('<br>')
      };
    }
  };

  /* ---------- Flächen & Umfang ---------- */

  const flaechen = {
    id: 'flaechen',
    icon: 'a·b',
    title: 'Flächen & Umfang',
    tagline: 'Rechteck, Dreieck, Trapez und Kreis',
    learn: `
      <h2>Flächeninhalt und Umfang</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Die wichtigsten Formeln</span>
        <ul>
          <li><strong>Rechteck:</strong> A = a · b,&nbsp;U = 2 · (a + b)</li>
          <li><strong>Dreieck:</strong> A = g · h : 2</li>
          <li><strong>Parallelogramm:</strong> A = g · h</li>
          <li><strong>Trapez:</strong> A = (a + c) : 2 · h</li>
          <li><strong>Kreis:</strong> A = π · r²,&nbsp;U = 2 · π · r&nbsp;(π ≈ 3,14)</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Dreieck</span>
        <p>g = 8 cm, h = 5 cm:&nbsp;A = 8 · 5 : 2 = <strong>20 cm²</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Kreis</span>
        <p>r = 5 cm:&nbsp;A = 3,14 · 5² = 3,14 · 25 = <strong>78,5 cm²</strong></p>
      </div>
      <p><em>Tipp:</em> Fläche in cm², Umfang in cm – die Einheit verrät, was gefragt ist.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        // Erst die Breite, dann die größere Länge darüber: sonst entstand
        // „3 cm lang und 18 cm breit“. Die Deckelung auf das Vierfache hält
        // das Rechteck als Rechteck erkennbar statt als Streifen.
        const b = rnd(3, 12), a = rnd(b + 1, Math.min(20, 4 * b));
        const gesuchtA = choice([true, false]);
        if (gesuchtA) {
          return {
            q: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Flächeninhalt (in cm²).`,
            type: 'input', placeholder: 'A in cm²',
            check: numCheck(a * b), testAnswer: String(a * b), answerText: `${a * b} cm²`,
            solution: `A = a · b = ${a} · ${b} = ${a * b} cm²`
          };
        }
        return {
          q: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Berechne den Umfang (in cm).`,
          type: 'input', placeholder: 'U in cm',
          check: numCheck(2 * (a + b)), testAnswer: String(2 * (a + b)), answerText: `${2 * (a + b)} cm`,
          solution: `U = 2 · (a + b) = 2 · (${a} + ${b}) = 2 · ${a + b} = ${2 * (a + b)} cm`
        };
      }
      if (diff === 2) {
        const kind = choice(['dreieck', 'parallelogramm', 'trapez']);
        if (kind === 'dreieck') {
          const g = rnd(2, 12) * 2, h = rnd(3, 12);
          const A = g * h / 2;
          return {
            q: `Ein Dreieck hat die Grundseite g = ${g} cm und die Höhe h = ${h} cm. Berechne den Flächeninhalt (in cm²).`,
            type: 'input', placeholder: 'A in cm²',
            check: numCheck(A), testAnswer: String(A), answerText: `${fmt(A)} cm²`,
            solution: `A = g · h : 2 = ${g} · ${h} : 2 = ${g * h} : 2 = ${fmt(A)} cm²`
          };
        }
        if (kind === 'parallelogramm') {
          const g = rnd(4, 15), h = rnd(3, 10);
          return {
            q: `Ein Parallelogramm hat die Grundseite g = ${g} cm und die Höhe h = ${h} cm. Berechne den Flächeninhalt (in cm²).`,
            type: 'input', placeholder: 'A in cm²',
            check: numCheck(g * h), testAnswer: String(g * h), answerText: `${g * h} cm²`,
            solution: `A = g · h = ${g} · ${h} = ${g * h} cm²`
          };
        }
        const a = rnd(4, 14), c = a % 2 === 0 ? rnd(2, 7) * 2 : rnd(1, 6) * 2 + 1; // a + c gerade
        const h = rnd(3, 10);
        const A = (a + c) / 2 * h;
        return {
          q: `Ein Trapez hat die parallelen Seiten a = ${a} cm und c = ${c} cm sowie die Höhe h = ${h} cm. Berechne den Flächeninhalt (in cm²).`,
          type: 'input', placeholder: 'A in cm²',
          check: numCheck(A), testAnswer: String(A), answerText: `${fmt(A)} cm²`,
          solution: `A = (a + c) : 2 · h = (${a} + ${c}) : 2 · ${h} = ${(a + c) / 2} · ${h} = ${fmt(A)} cm²`
        };
      }
      const r = rnd(2, 10);
      const gesuchtA = choice([true, false]);
      if (gesuchtA) {
        const A = PI * r * r;
        return {
          q: `Ein Kreis hat den Radius r = ${r} cm. Berechne den Flächeninhalt (in cm²). <span class="hint">Rechne mit π ≈ 3,14.</span>`,
          type: 'input', placeholder: 'A in cm²',
          check: circaCheck(A), testAnswer: String(A), answerText: `≈ ${fmt(A)} cm²`,
          solution: `A = π · r² = 3,14 · ${r}² = 3,14 · ${r * r} = ${fmt(A)} cm²`
        };
      }
      const U = 2 * PI * r;
      return {
        q: `Ein Kreis hat den Radius r = ${r} cm. Berechne den Umfang (in cm). <span class="hint">Rechne mit π ≈ 3,14.</span>`,
        type: 'input', placeholder: 'U in cm',
        check: circaCheck(U), testAnswer: String(U), answerText: `≈ ${fmt(U)} cm`,
        solution: `U = 2 · π · r = 2 · 3,14 · ${r} = ${fmt(U)} cm`
      };
    }
  };

  /* ---------- Körper & Volumen ---------- */

  const volumen = {
    id: 'volumen',
    icon: 'a³',
    title: 'Körper & Volumen',
    tagline: 'Quader, Würfel, Prisma und Zylinder',
    learn: `
      <h2>Volumen und Oberfläche von Körpern</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Die wichtigsten Formeln</span>
        <ul>
          <li><strong>Quader:</strong> V = a · b · c,&nbsp;O = 2 · (ab + ac + bc)</li>
          <li><strong>Würfel:</strong> V = a³,&nbsp;O = 6 · a²</li>
          <li><strong>Prisma:</strong> V = Grundfläche · Höhe</li>
          <li><strong>Zylinder:</strong> V = π · r² · h&nbsp;(π ≈ 3,14)</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Quader</span>
        <p>a = 4 cm, b = 3 cm, c = 5 cm:&nbsp;V = 4 · 3 · 5 = <strong>60 cm³</strong></p>
      </div>
      <p>Volumen misst man in <strong>cm³, dm³ (= Liter!) oder m³</strong> – Oberfläche in cm² oder m².</p>
      <p><em>Tipp:</em> Alle Prismen und Zylinder folgen derselben Idee:
      „Grundfläche mal Höhe“.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['quader', 'wuerfel']);
        if (kind === 'quader') {
          const a = rnd(2, 10), b = rnd(2, 10), c = rnd(2, 10);
          const V = a * b * c;
          return {
            q: `Ein Quader hat die Kantenlängen a = ${a} cm, b = ${b} cm und c = ${c} cm. Berechne das Volumen (in cm³).`,
            type: 'input', placeholder: 'V in cm³',
            check: numCheck(V), testAnswer: String(V), answerText: `${V} cm³`,
            solution: `V = a · b · c = ${a} · ${b} · ${c} = ${V} cm³`
          };
        }
        const a = rnd(2, 10);
        return {
          q: `Ein Würfel hat die Kantenlänge a = ${a} cm. Berechne das Volumen (in cm³).`,
          type: 'input', placeholder: 'V in cm³',
          check: numCheck(a ** 3), testAnswer: String(a ** 3), answerText: `${a ** 3} cm³`,
          solution: `V = a³ = ${a} · ${a} · ${a} = ${a ** 3} cm³`
        };
      }
      if (diff === 2) {
        const kind = choice(['wuerfelO', 'quaderO', 'prisma']);
        if (kind === 'wuerfelO') {
          const a = rnd(2, 12);
          const O = 6 * a * a;
          return {
            q: `Ein Würfel hat die Kantenlänge a = ${a} cm. Berechne die Oberfläche (in cm²).`,
            type: 'input', placeholder: 'O in cm²',
            check: numCheck(O), testAnswer: String(O), answerText: `${O} cm²`,
            solution: `Ein Würfel hat 6 gleich große Quadratflächen:<br>O = 6 · a² = 6 · ${a * a} = ${O} cm²`
          };
        }
        if (kind === 'quaderO') {
          const a = rnd(2, 8), b = rnd(2, 8), c = rnd(2, 8);
          const O = 2 * (a * b + a * c + b * c);
          return {
            q: `Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${c} cm. Berechne die Oberfläche (in cm²).`,
            type: 'input', placeholder: 'O in cm²',
            check: numCheck(O), testAnswer: String(O), answerText: `${O} cm²`,
            solution: `O = 2 · (ab + ac + bc) = 2 · (${a * b} + ${a * c} + ${b * c}) = 2 · ${a * b + a * c + b * c} = ${O} cm²`
          };
        }
        const G = rnd(10, 60), h = rnd(3, 15);
        return {
          q: `Ein Prisma hat die Grundfläche G = ${G} cm² und die Höhe h = ${h} cm. Berechne das Volumen (in cm³).`,
          type: 'input', placeholder: 'V in cm³',
          check: numCheck(G * h), testAnswer: String(G * h), answerText: `${G * h} cm³`,
          solution: `V = G · h = ${G} · ${h} = ${G * h} cm³`
        };
      }
      const kind = choice(['zylinder', 'kante']);
      if (kind === 'zylinder') {
        const r = rnd(2, 8), h = rnd(3, 15);
        const V = PI * r * r * h;
        return {
          q: `Ein Zylinder hat den Radius r = ${r} cm und die Höhe h = ${h} cm. Berechne das Volumen (in cm³). <span class="hint">Rechne mit π ≈ 3,14.</span>`,
          type: 'input', placeholder: 'V in cm³',
          check: circaCheck(V), testAnswer: String(V), answerText: `≈ ${fmt(V)} cm³`,
          solution: `V = π · r² · h = 3,14 · ${r * r} · ${h} = ${fmt(V)} cm³`
        };
      }
      const a = rnd(2, 10);
      return {
        q: `Ein Würfel hat das Volumen V = ${a ** 3} cm³. Wie lang ist seine Kante (in cm)?`,
        type: 'input', placeholder: 'a in cm',
        check: numCheck(a), testAnswer: String(a), answerText: `${a} cm`,
        solution: `Gesucht ist die Zahl, die dreimal mit sich selbst multipliziert ${a ** 3} ergibt:<br>a = ∛${a ** 3} = ${a} cm, denn ${a} · ${a} · ${a} = ${a ** 3}.`
      };
    }
  };

  /* ---------- Pyramide, Kegel & Kugel ---------- */

  // Rechtwinklige Tripel (r, h, s): Nur so bleibt die Mantellinie ganzzahlig –
  // sonst steht im Lösungsweg eine Wurzel, die niemand im Kopf zieht.
  const KEGEL_TRIPEL = [[3, 4, 5], [6, 8, 10], [9, 12, 15], [5, 12, 13],
    [8, 15, 17], [12, 16, 20], [7, 24, 25], [20, 21, 29]];

  const koerper = {
    id: 'koerper',
    icon: '⅓G·h',
    title: 'Pyramide, Kegel & Kugel',
    tagline: 'Spitze Körper und die Kugel berechnen',
    learn: `
      <h2>Pyramide, Kegel und Kugel – die spitzen Körper</h2>
      <p>Quader, Würfel und Zylinder haben oben und unten dieselbe Fläche: Man nimmt die
      Grundfläche und stapelt sie bis zur Höhe. Pyramide und Kegel laufen dagegen nach oben
      <strong>spitz zu</strong> – jede Schicht ist kleiner als die darunter. Deshalb passt
      weniger hinein, als die Stapelformel behauptet. Genau <em>ein Drittel</em> so viel.
      Die Kugel ist noch einmal ein Fall für sich: Sie hat gar keine Grundfläche.</p>

      <div class="einstieg-box">
        <p class="box-title">Die Eistüte</p>
        <p>Eine Waffel ist ein Kegel mit Radius r = 3 cm und Höhe h = 12 cm. Obendrauf kommt
        eine Kugel Eis, ebenfalls mit Radius 3 cm. Beim Essen schmilzt das Eis und läuft in
        die Waffel.</p>
        <p class="frage">Läuft die Waffel über – oder passt die ganze Kugel hinein?</p>
      </div>

      <div class="herleitung-box">
        <p class="box-title">Woher das Drittel kommt</p>
        <p>Nimm einen Würfel mit der Kantenlänge a und markiere <strong>eine</strong> Ecke.
        Von dieser Ecke aus lässt sich der Würfel in drei Pyramiden zerlegen: Jede hat als
        Grundfläche eine der drei Würfelflächen, die die markierte Ecke <em>nicht</em>
        berühren, und ihre Spitze liegt in eben dieser Ecke.</p>
        <p>Die drei Pyramiden sind gleich groß und füllen den Würfel lückenlos. Also gilt für
        jede einzelne:</p>
        <p>V<sub>Pyramide</sub> = ⅓ · a³ = ⅓ · a² · a = ⅓ · G · h</p>
        <p>Jede Pyramide hat G = a² und h = a – und damit steht die Formel da. Sie gilt für
        <strong>jede</strong> Pyramide und für den Kegel gleich mit, denn ein Kegel ist nichts
        anderes als eine Pyramide, deren Grundfläche ein Kreis ist.</p>
        <p>Bei der Kugel half schon Archimedes: Stellt man eine Kugel in den engsten Zylinder,
        der sie gerade umschließt (Radius r, Höhe 2r), so füllt die Kugel davon genau
        <strong>zwei Drittel</strong>. Und weil der Zylinder V = π · r² · 2r = 2π · r³ misst,
        folgt V<sub>Kugel</sub> = ⅔ · 2π · r³ = ⁴⁄₃ · π · r³.</p>
      </div>

      <div class="merkkasten">
        <p class="box-title">Die Formeln</p>
        <p><strong>Pyramide und Kegel:</strong>&nbsp;V = ⅓ · G · h</p>
        <p><strong>Kegel:</strong>&nbsp;V = ⅓ · π · r² · h,&nbsp;Mantel M = π · r · s,&nbsp;Oberfläche O = π · r² + π · r · s,&nbsp;Mantellinie s = √(r² + h²)&nbsp;(Pythagoras)</p>
        <p><strong>Kugel:</strong>&nbsp;V = ⁴⁄₃ · π · r³,&nbsp;O = 4 · π · r²,&nbsp;Halbkugel V = ½ · ⁴⁄₃ · π · r³ = ⅔ · π · r³</p>
        <p><strong>Quadratische Pyramide:</strong>&nbsp;O = a² + 4 · ½ · a · h<sub>a</sub>,&nbsp;Seitenhöhe h<sub>a</sub> = √(h² + (a : 2)²)&nbsp;(Pythagoras)</p>
        <p>h ist immer die <em>senkrechte</em> Höhe von der Grundfläche zur Spitze –
        nicht die schräge Kante. Die Seitenhöhe h<sub>a</sub> ist die Höhe eines
        Seitendreiecks: Sie läuft außen auf der Seitenfläche zur Spitze.</p>
      </div>

      <div class="merkkasten">
        <p class="box-title">Rückwärts: die Formel umstellen</p>
        <p>Ist das Volumen oder die Oberfläche bekannt und eine Länge gesucht, löst du die
        Formel nach dieser Länge auf. Jede Rechnung wandert als ihre Umkehrung auf die
        andere Seite: Aus „mal ⅓“ wird „mal 3“, aus „mal 4 · π“ wird „geteilt durch
        4 · π“, aus „hoch drei“ wird die dritte Wurzel ∛.</p>
        <p><strong>Pyramide und Kegel:</strong>&nbsp;h = 3V : G</p>
        <p><strong>Kugel:</strong>&nbsp;r = √(O : (4 · π))&nbsp;und&nbsp;r = ∛(3V : (4 · π))</p>
      </div>

      <h3>So rechnest du</h3>
      <ol class="schritte">
        <li>Körper bestimmen: Läuft er spitz zu (Pyramide, Kegel) oder nicht (Prisma, Zylinder)?
        Nur der spitze bekommt das ⅓.</li>
        <li>Besteht der Körper aus mehreren Teilen – ein Silo aus Zylinder und Kegeldach,
        eine Eistüte aus Kegel und Halbkugel –, nimm jeden Teil für sich. Die nächsten
        Schritte gehst du dann für jeden Teil einzeln. Addiert – oder abgezogen, wie bei der Kugel in der Dose – wird erst ganz am Ende.</li>
        <li>Grundfläche G ausrechnen – beim Kegel ist das der Kreis π · r².</li>
        <li>Die senkrechte Höhe h heraussuchen. Steht stattdessen die Mantellinie s da,
        zuerst mit Pythagoras umrechnen: h = √(s² − r²).</li>
        <li>Einsetzen und rechnen. Ist Volumen oder Oberfläche gegeben und eine Länge gesucht, stelle die
        Formel zuerst nach dieser Länge um. Erst am Ende runden, nicht zwischendurch.</li>
        <li>Einheit prüfen: Volumen in cm³, Flächen in cm².</li>
      </ol>

      <h3>Beispiele</h3>

      <div class="example-box">
        <p class="ex-title">Kegel: Volumen</p>
        <p>r = 5 cm, h = 9 cm</p>
        <p>G = π · r² = 3,14 · 25 = 78,5 cm²</p>
        <p>V = ⅓ · 78,5 · 9 = 78,5 · 3 = <strong>235,5 cm³</strong></p>
        <p>Praktisch: Ist h durch 3 teilbar, teile zuerst – das spart das Bruchrechnen.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Kegel: von der Mantellinie zur Höhe</p>
        <p>r = 6 cm, s = 10 cm. Gesucht ist das Volumen.</p>
        <p>h² = s² − r² = 100 − 36 = 64&nbsp;⇒&nbsp;h = 8 cm</p>
        <p>V = ⅓ · 3,14 · 36 · 8 ≈ <strong>301,44 cm³</strong></p>
        <p>Wer hier s = 10 statt h = 8 einsetzt, bekommt 376,8 cm³ – ein Viertel zu viel.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Quadratische Pyramide: Volumen und Oberfläche</p>
        <p>Ein Zelt hat die Grundkante a = 6 m und die Höhe h = 4 m.</p>
        <p>G = a² = 36 m²</p>
        <p>V = ⅓ · 36 · 4 = <strong>48 m³</strong></p>
        <p>Wie viel Stoff braucht das Zelt? Der Boden ist das Quadrat, die vier Seiten sind
        Dreiecke. Jedes Seitendreieck hat die Grundseite a und die Seitenhöhe
        h<sub>a</sub> – sie läuft außen auf der Fläche zur Spitze, die Höhe h steckt innen.
        Beide hängen über Pythagoras zusammen, denn von der Mitte der Grundkante bis zur
        Mitte des Bodens sind es a : 2 = 3 m:</p>
        <p>h<sub>a</sub>² = h² + (a : 2)² = 16 + 9 = 25&nbsp;⇒&nbsp;h<sub>a</sub> = 5 m</p>
        <p>Ein Seitendreieck: ½ · 6 · 5 = 15 m², alle vier: 60 m²</p>
        <p>O = 36 + 60 = <strong>96 m²</strong></p>
        <p>Wer hier h = 4 statt h<sub>a</sub> = 5 in die Dreiecksfläche steckt, rechnet jede
        Seite um ein Fünftel zu klein – der Stoff wäre zu knapp.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Die Eistüte aus dem Einstieg</p>
        <p>Waffel (Kegel): V = ⅓ · 3,14 · 3² · 12 = ⅓ · 3,14 · 9 · 12 = 3,14 · 36 = 113,04 cm³</p>
        <p>Eiskugel: V = ⁴⁄₃ · 3,14 · 3³ = ⁴⁄₃ · 3,14 · 27 = 4 · 3,14 · 9 = 113,04 cm³</p>
        <p><strong>Beide sind exakt gleich groß</strong> – die Kugel passt genau hinein, kein
        Tropfen mehr. Das ist kein Zufall: Bei r = 3 und h = 12 gilt h = 4r, und dann steht in
        beiden Formeln ⅓ · π · r² · 4r = ⁴⁄₃ · π · r³ dasselbe.</p>
        <p>Sitzt statt der ganzen Kugel nur eine <strong>Halbkugel</strong> auf der Waffel,
        ist ihr Volumen die Hälfte: ½ · 113,04 = 56,52 cm³. Waffel und Halbkugel zusammen
        fassen dann 113,04 + 56,52 = <strong>169,56 cm³</strong> Eis.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Zusammengesetzter Körper: das Silo</p>
        <p>Ein Silo ist ein Zylinder mit r = 3 m und h = 8 m. Obendrauf sitzt ein Kegeldach
        mit demselben Radius und der Höhe 3 m. Wie groß ist das Volumen des Silos?</p>
        <p>Zylinder: V = π · r² · h = 3,14 · 9 · 8 = 226,08 m³</p>
        <p>Kegeldach: V = ⅓ · 3,14 · 9 · 3 = 3,14 · 9 = 28,26 m³</p>
        <p>Zusammen: 226,08 + 28,26 = <strong>254,34 m³</strong></p>
        <p>So geht es bei jedem zusammengesetzten Körper: Teil für Teil rechnen, dann
        addieren. Das ⅓ bekommt nur das Dach – der Zylinder darunter nicht.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Rückwärts: vom Volumen zum Radius</p>
        <p>Manchmal ist das Volumen bekannt und der Radius gesucht. Dann löst du die Formel
        Schritt für Schritt nach r auf. Eine Kugel hat V ≈ 113,04 cm³.</p>
        <p>V = ⁴⁄₃ · π · r³&nbsp;| · 3<br>
        3V = 4 · π · r³&nbsp;| : (4 · π)<br>
        r³ = 3V : (4 · π) = 339,12 : 12,56 = 27<br>
        r = ∛27 = <strong>3 cm</strong>, denn 3 · 3 · 3 = 27 – das war die Eiskugel von oben.</p>
        <p>Bei der Oberfläche ist es eine Stufe kürzer: O = 4 · π · r²&nbsp;| : (4 · π) ergibt
        r² = O : (4 · π). Für O ≈ 314 cm² heißt das r² = 314 : 12,56 = 25, also
        r = √25 = <strong>5 cm</strong>.</p>
        <p>Bei der Pyramide wandert das Drittel als „mal 3“ hinüber: h = 3V : G. Für V = 48 m³
        und G = 36 m² ergibt das h = 144 : 36 = <strong>4 m</strong> – genau das Zelt von oben.</p>
      </div>

      <div class="achtung-box">
        <p class="achtung-title">Die schräge Kante ist nicht die Höhe</p>
        <p>Beim Kegel liegt die Mantellinie s außen und ist leicht zu messen – die Höhe h
        steckt innen. Wer s in die Volumenformel steckt, rechnet immer zu viel.</p>
        <p><strong>Gegenbeispiel:</strong> r = 3 cm, s = 5 cm.</p>
        <p>Falsch: V = ⅓ · 3,14 · 9 · 5 = 47,1 cm³</p>
        <p>Richtig: h = √(25 − 9) = √16 = 4, also V = ⅓ · 3,14 · 9 · 4 = 37,68 cm³</p>
        <p>Der Fehler beträgt 25 % – und er fällt nicht auf, weil das Ergebnis plausibel
        aussieht. Merke: s ist die <em>längste</em> der drei Strecken, sie ist die Hypotenuse.
        In der Volumenformel steht nie die längste.</p>
        <p>Bei der Pyramide gilt dasselbe für die Seitenhöhe h<sub>a</sub>: Sie liegt außen
        auf der Seitenfläche und ist länger als h. In die Volumenformel gehört h, in die
        Fläche des Seitendreiecks h<sub>a</sub>.</p>
      </div>

      <div class="selbstcheck">
        <p class="box-title">Selbstcheck</p>
        <details><summary>Warum steht bei Pyramide und Kegel ein ⅓, beim Zylinder nicht?</summary>
        <p>Weil beide nach oben spitz zulaufen: Jede waagerechte Schicht ist kleiner als die
        darunter. Drei solche Pyramiden füllen genau einen Würfel mit derselben Grundfläche
        und Höhe. Der Zylinder hat dagegen in jeder Höhe denselben Kreis.</p></details>
        <details><summary>Ein Kegel hat r = 8 cm und s = 17 cm. Wie hoch ist er?</summary>
        <p>h = √(17² − 8²) = √(289 − 64) = √225 = 15 cm.</p></details>
        <details><summary>Der Radius einer Kugel wird verdoppelt. Wie viel Mal so groß ist das Volumen?</summary>
        <p>Achtmal. In V = ⁴⁄₃ · π · r³ steht r hoch drei, und 2³ = 8. Die Oberfläche dagegen
        wird nur viermal so groß, denn dort steht r².</p></details>
        <details><summary>Ein Kegelglas wird randvoll in einen gleich breiten Becher gegossen. Wie hoch steht das Wasser?</summary>
        <p>Ein Drittel der Kegelhöhe. In beiden Formeln steht π · r², das kürzt sich weg –
        übrig bleibt genau der Faktor ⅓.</p></details>
        <details><summary>Wie viel Prozent einer Dose füllt eine genau hineinpassende Kugel?</summary>
        <p>Zwei Drittel, also rund 67 %. Das ist der Satz des Archimedes – er ließ ihn sich
        auf seinen Grabstein meißeln.</p></details>
        <details><summary>Eine Kugel hat das Volumen V ≈ 904,32 cm³ (π ≈ 3,14). Wie groß ist ihr Radius?</summary>
        <p>3V = 2712,96, geteilt durch 4 · 3,14 = 12,56 ergibt r³ = 216. Also r = ∛216 = 6 cm,
        denn 6 · 6 · 6 = 216.</p></details>
        <details><summary>Ein Zelt ist eine quadratische Pyramide mit a = 8 m und h = 3 m. Wie lang ist die Seitenhöhe h<sub>a</sub>?</summary>
        <p>Von der Mitte des Bodens bis zur Kantenmitte sind es a : 2 = 4 m. Pythagoras:
        h<sub>a</sub>² = 3² + 4² = 9 + 16 = 25, also h<sub>a</sub> = 5 m.</p></details>
      </div>
    `,
    gen(diff) {
      const piHint = '<span class="hint">Rechne mit π ≈ 3,14.</span>';

      if (diff === 1) {
        const art = rnd(1, 6);

        if (art === 1) {
          const G = rnd(4, 30) * 3, h = rnd(3, 15);
          const V = G * h / 3;
          return {
            q: `Eine Pyramide hat die Grundfläche G = ${fmt(G)} cm² und die Höhe h = ${fmt(h)} cm. Berechne das Volumen (in cm³).`,
            type: 'input', placeholder: 'V in cm³',
            check: numCheck(V), testAnswer: String(V), answerText: `${fmt(V)} cm³`,
            solution: `V = ⅓ · G · h = ⅓ · ${fmt(G)} · ${fmt(h)} = ${fmt(G / 3)} · ${fmt(h)} = <strong>${fmt(V)} cm³</strong>`
          };
        }

        if (art === 2) {
          const a = rnd(3, 12), h = rnd(1, 5) * 3;
          const V = a * a * h / 3;
          return {
            q: `Eine quadratische Pyramide hat die Grundkante a = ${fmt(a)} cm und die Höhe h = ${fmt(h)} cm. Berechne das Volumen (in cm³).`,
            type: 'input', placeholder: 'V in cm³',
            check: numCheck(V), testAnswer: String(V), answerText: `${fmt(V)} cm³`,
            solution: `Grundfläche: G = a² = ${fmt(a)}² = ${fmt(a * a)} cm²<br>V = ⅓ · G · h = ⅓ · ${fmt(a * a)} · ${fmt(h)} = <strong>${fmt(V)} cm³</strong>`
          };
        }

        if (art === 3) {
          const r = rnd(2, 9), h = rnd(1, 5) * 3;
          const V = rundeCirca(PI * r * r * h / 3);
          /* Wie das Seitenbeispiel „Kegel: Volumen“: erst G als eigener Schritt
             (Schritt 3 des Verfahrens), dann „Ist h durch 3 teilbar, teile
             zuerst". h wird genau dafür als Vielfaches von 3 gezogen – ohne den
             Schritt blieb der Lernende mit ⅓ · 3,14 · 25 · 6 allein. G = 3,14 · r²
             geht immer auf zwei Stellen auf, V damit ebenso: kein ≈ im Weg. */
          const G = 314 * r * r / 100;
          const volumen = h === 3
            // ⅓ · 3 wäre „· 1“ im nächsten Schritt – das Drittel hebt die Höhe ganz auf.
            ? `V = ⅓ · G · h = ⅓ · ${fmt(G)} · 3 = <strong>${fmt(V)} cm³</strong> – das ⅓ und die Höhe 3 heben sich auf.`
            : `h = ${fmt(h)} ist durch 3 teilbar, also zuerst teilen: ⅓ · ${fmt(h)} = ${fmt(h / 3)}<br>` +
              `V = ⅓ · G · h = ⅓ · ${fmt(G)} · ${fmt(h)} = ${fmt(G)} · ${fmt(h / 3)} = <strong>${fmt(V)} cm³</strong>`;
          return {
            q: `Ein Kegel hat den Radius r = ${fmt(r)} cm und die Höhe h = ${fmt(h)} cm. Berechne das Volumen (in cm³). ${piHint}`,
            type: 'input', placeholder: 'V in cm³',
            check: circaCheck(V), testAnswer: String(V), answerText: `≈ ${fmt(V)} cm³`,
            solution: `Grundfläche: G = π · r² = 3,14 · ${fmt(r)}² = 3,14 · ${fmt(r * r)} = ${fmt(G)} cm²<br>${volumen}`
          };
        }

        if (art === 4) {
          const r = rnd(2, 9);
          const V = rundeCirca(4 / 3 * PI * r * r * r);
          /* Bei r = 3, 6, 9 ist r³ durch 3 teilbar: dann wie das Seitenbeispiel
             zur Eistüte zuerst teilen (⁴⁄₃ · 3,14 · 27 = 4 · 3,14 · 9), und das
             Ergebnis geht glatt auf. Für die übrigen Radien zeigt die Seite
             keinen anderen Weg – dort bleibt die kurze Form mit ≈. */
          const rest = r % 3 === 0
            ? `= 4 · 3,14 · ${fmt(r ** 3 / 3)} = <strong>${fmt(V)} cm³</strong>`
            : `≈ <strong>${fmt(V)} cm³</strong>`;
          return {
            q: `Eine Kugel hat den Radius r = ${fmt(r)} cm. Berechne das Volumen (in cm³). ${piHint}`,
            type: 'input', placeholder: 'V in cm³',
            check: circaCheck(V), testAnswer: String(V), answerText: `≈ ${fmt(V)} cm³`,
            solution: `V = ⁴⁄₃ · π · r³ = ⁴⁄₃ · 3,14 · ${fmt(r)}³ = ⁴⁄₃ · 3,14 · ${fmt(r ** 3)} ${rest}`
          };
        }

        if (art === 5) {
          const r = rnd(2, 12);
          const O = rundeCirca(4 * PI * r * r);
          return {
            q: `Eine Kugel hat den Radius r = ${fmt(r)} cm. Berechne die Oberfläche (in cm²). ${piHint}`,
            type: 'input', placeholder: 'O in cm²',
            check: circaCheck(O), testAnswer: String(O), answerText: `≈ ${fmt(O)} cm²`,
            solution: `O = 4 · π · r² = 4 · 3,14 · ${fmt(r)}² = 4 · 3,14 · ${fmt(r * r)} ≈ <strong>${fmt(O)} cm²</strong>`
          };
        }

        // Die vier Formeln stehen fest – die Auswahl kann nie zusammenfallen.
        const gefragt = choice(['einer Kugel', 'eines Kegels', 'einer Pyramide']);
        const richtig = { 'einer Kugel': '⁴⁄₃ · π · r³', 'eines Kegels': '⅓ · π · r² · h', 'einer Pyramide': '⅓ · G · h' }[gefragt];
        /* ⅓ · G · h steht beim Kegel NICHT zur Wahl: Die Erklärseite führt
           genau diese Formel für „Pyramide und Kegel“ ein – sie war dort eine
           zweite richtige Antwort, gewertet als falsch. Ihren Platz nimmt die
           Mantellinie ein, die in keiner Volumenformel steht (Tipp der Stufe 2). */
        const alle = gefragt === 'eines Kegels'
          ? ['⁴⁄₃ · π · r³', '⅓ · π · r² · h', '⅓ · π · r² · s', '4 · π · r²', 'π · r² · h']
          : ['⁴⁄₃ · π · r³', '⅓ · π · r² · h', '⅓ · G · h', '4 · π · r²', 'π · r² · h'];
        const kugel = gefragt === 'einer Kugel';
        const grundZu = {
          '⁴⁄₃ · π · r³': 'Das ist das Volumen der Kugel. In der Formel fehlt die Höhe h, ohne die kein spitzer Körper auskommt.',
          '⅓ · π · r² · h': kugel
            ? 'Das ist das Volumen des Kegels. Eine Kugel hat weder Grundfläche noch Höhe.'
            : 'Das ist das Volumen des Kegels: π · r² ist eine Kreisfläche, und eine Pyramide steht nicht auf einem Kreis.',
          '⅓ · G · h': kugel ? '⅓ · G · h gilt für Pyramide und Kegel. Eine Kugel hat keine Grundfläche G.' : null,
          '⅓ · π · r² · s': 'Hier steht die Mantellinie s statt der Höhe h. s ist die schräge Seite des Kegels und kommt in keiner Volumenformel vor.',
          '4 · π · r²': '4 · π · r² ist die Oberfläche der Kugel, kein Volumen.',
          'π · r² · h': 'Das ist das Volumen des Zylinders – ohne das ⅓, das nur spitze Körper bekommen.'
        };
        const ablenker = alle.filter(f => f !== richtig);
        const mc = makeChoice(richtig, ablenker, ablenker.map(f => grundZu[f]));
        return {
          q: `Welche Formel berechnet das <strong>Volumen</strong> ${gefragt}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: richtig,
          solution: `Volumen ${gefragt}: <strong>V = ${richtig}</strong><br>Zur Erinnerung: 4 · π · r² ist die <em>Oberfläche</em> der Kugel, π · r² · h das Volumen des <em>Zylinders</em>.`
        };
      }

      if (diff === 2) {
        const art = rnd(1, 7);
        const [r, h, s] = choice(KEGEL_TRIPEL);

        if (art === 1) {
          return {
            q: `Ein Kegel hat den Radius r = ${fmt(r)} cm und die Höhe h = ${fmt(h)} cm. Berechne die Mantellinie s (in cm).`,
            type: 'input', placeholder: 's in cm',
            check: numCheck(s), testAnswer: String(s), answerText: `${fmt(s)} cm`,
            solution: `r, h und s bilden ein rechtwinkliges Dreieck mit s als Hypotenuse:<br>s² = r² + h² = ${fmt(r)}² + ${fmt(h)}² = ${fmt(r * r)} + ${fmt(h * h)} = ${fmt(s * s)}<br>s = √${fmt(s * s)} = <strong>${fmt(s)} cm</strong>`
          };
        }

        if (art === 2) {
          return {
            q: `Ein Kegel hat den Radius r = ${fmt(r)} cm und die Mantellinie s = ${fmt(s)} cm. Berechne die Höhe h (in cm).`,
            type: 'input', placeholder: 'h in cm',
            check: numCheck(h), testAnswer: String(h), answerText: `${fmt(h)} cm`,
            solution: `s ist die Hypotenuse, also nach h umstellen:<br>h² = s² − r² = ${fmt(s)}² − ${fmt(r)}² = ${fmt(s * s)} − ${fmt(r * r)} = ${fmt(s * s - r * r)}<br>h = √${fmt(s * s - r * r)} = <strong>${fmt(h)} cm</strong>`
          };
        }

        if (art === 3) {
          const M = rundeCirca(PI * r * s);
          return {
            q: `Ein Kegel hat den Radius r = ${fmt(r)} cm und die Mantellinie s = ${fmt(s)} cm. Berechne die Mantelfläche M (in cm²). ${piHint}`,
            type: 'input', placeholder: 'M in cm²',
            check: circaCheck(M), testAnswer: String(M), answerText: `≈ ${fmt(M)} cm²`,
            solution: `M = π · r · s = 3,14 · ${fmt(r)} · ${fmt(s)} ≈ <strong>${fmt(M)} cm²</strong>`
          };
        }

        if (art === 4) {
          const grund = rundeCirca(PI * r * r), mantel = rundeCirca(PI * r * s);
          const O = rundeCirca(grund + mantel);
          return {
            q: `Ein Kegel hat den Radius r = ${fmt(r)} cm und die Höhe h = ${fmt(h)} cm. Berechne die <strong>gesamte</strong> Oberfläche (in cm²). ${piHint}`,
            type: 'input', placeholder: 'O in cm²',
            check: circaCheck(O), testAnswer: String(O), answerText: `≈ ${fmt(O)} cm²`,
            solution: `Erst die Mantellinie: s = √(r² + h²) = √(${fmt(r * r)} + ${fmt(h * h)}) = ${fmt(s)} cm<br>Grundkreis: π · r² = 3,14 · ${fmt(r * r)} ≈ ${fmt(grund)} cm²<br>Mantel: π · r · s = 3,14 · ${fmt(r)} · ${fmt(s)} ≈ ${fmt(mantel)} cm²<br>O ≈ <strong>${fmt(O)} cm²</strong>`
          };
        }

        if (art === 5) {
          const G = rnd(5, 40) * 3, hh = rnd(3, 18);
          const V = G * hh / 3;
          return {
            q: `Eine Pyramide hat das Volumen V = ${fmt(V)} cm³ und die Grundfläche G = ${fmt(G)} cm². Berechne die Höhe h (in cm).`,
            type: 'input', placeholder: 'h in cm',
            check: numCheck(hh), testAnswer: String(hh), answerText: `${fmt(hh)} cm`,
            solution: `V = ⅓ · G · h&nbsp;| · 3<br>3V = G · h&nbsp;| : G<br>h = 3V : G = ${fmt(3 * V)} : ${fmt(G)} = <strong>${fmt(hh)} cm</strong>`
          };
        }

        if (art === 6) {
          const rk = choice([3, 6, 9]);
          const V = rundeCirca(4 / 3 * PI * rk ** 3);
          return {
            q: `Eine Kugel hat das Volumen V ≈ ${fmt(V)} cm³. Berechne den Radius r (in cm). ${piHint}`,
            type: 'input', placeholder: 'r in cm',
            check: circaCheck(rk), testAnswer: String(rk), answerText: `${fmt(rk)} cm`,
            solution: `V = ⁴⁄₃ · π · r³&nbsp;| · 3<br>3V = 4 · π · r³&nbsp;| : (4 · π)<br>r³ = 3V : (4 · 3,14) = ${fmt(3 * V)} : ${fmt(4 * PI)} = ${fmt(rk ** 3)}<br>r = ∛${fmt(rk ** 3)} = <strong>${fmt(rk)} cm</strong>`
          };
        }

        const rk = rnd(2, 10);
        const O = rundeCirca(4 * PI * rk * rk);
        return {
          q: `Eine Kugel hat die Oberfläche O ≈ ${fmt(O)} cm². Berechne den Radius r (in cm). ${piHint}`,
          type: 'input', placeholder: 'r in cm',
          check: circaCheck(rk), testAnswer: String(rk), answerText: `${fmt(rk)} cm`,
          solution: `O = 4 · π · r²&nbsp;| : (4 · π)<br>r² = O : (4 · 3,14) = ${fmt(O)} : ${fmt(4 * PI)} = ${fmt(rk * rk)}<br>r = √${fmt(rk * rk)} = <strong>${fmt(rk)} cm</strong>`
        };
      }

      /* ---- Stufe 3: zusammengesetzte Körper und Sachzusammenhänge ---- */
      const art = rnd(1, 6);

      if (art === 1) {
        const r = rnd(2, 5), h = rnd(3, 6) * 2;
        /* Schritt 5 der Seite: „Erst am Ende runden, nicht zwischendurch.“
           Früher wurden beide Teile auf zwei Stellen gerundet und dann addiert –
           bei r = 2/h = 10, r = 4/h = 8 und r = 5/h = 10 zeigte der Weg dann eine
           andere letzte Stelle als bei dem, der der Seite folgt (58,62 statt
           58,61). Jetzt gilt die ungerundete Summe; ein Teil, der nicht aufgeht,
           steht mit einer Stelle mehr da. Nachgerechnet für alle 16 Paare (r, h):
           Die Summe der Dreistellen-Werte rundet auf dieselbe Antwort.
           Gerechnet wird ganzzahlig mit dem 300-Fachen des Volumens, damit
           „geht auf“ nicht an einem Gleitkommarest hängt. */
        const zKegel = 314 * r * r * h, zHalb = 2 * 314 * r ** 3;
        const V = rundeCirca((zKegel + zHalb) / 300);
        const teil = z => z % 3 === 0 ? z / 300 : Math.round(z * 10 / 3) / 1000;
        const vKegel = teil(zKegel), vHalb = teil(zHalb);
        // Wie „Kegel: Volumen“ auf der Seite: Ist h (oder r²) durch 3 teilbar, zuerst teilen.
        const kegel = h % 3 === 0
          ? `= 3,14 · ${fmt(r * r)} · ${fmt(h / 3)} = ${fmt(vKegel)}`
          : r % 3 === 0
            ? `= 3,14 · ${fmt(r * r / 3)} · ${fmt(h)} = ${fmt(vKegel)}`
            : `= ${fmt(zKegel / 100)} : 3 ≈ ${fmt(vKegel)}`;
        const halb = r % 3 === 0
          ? `= 2 · 3,14 · ${fmt(r ** 3 / 3)} = ${fmt(vHalb)}`
          : `= ${fmt(zHalb / 100)} : 3 ≈ ${fmt(vHalb)}`;
        const summe = Math.round((vKegel + vHalb) * 1000);
        const zusammen = summe === Math.round(V * 1000)
          ? `<strong>${fmt(V)} cm³</strong>`
          : `${fmt(summe / 1000)} ≈ <strong>${fmt(V)} cm³</strong> – auf zwei Stellen gerundet wird erst hier`;
        return {
          q: `Eine Eistüte besteht aus einem Kegel (r = ${fmt(r)} cm, h = ${fmt(h)} cm) und einer aufgesetzten Halbkugel mit demselben Radius. Wie viel Eis passt insgesamt hinein (in cm³)? ${piHint}`,
          type: 'input', placeholder: 'V in cm³',
          check: circaCheck(V), testAnswer: String(V), answerText: `≈ ${fmt(V)} cm³`,
          solution: `Kegel: V = ⅓ · 3,14 · ${fmt(r * r)} · ${fmt(h)} ${kegel} cm³<br>` +
            `Halbkugel: V = ½ · ⁴⁄₃ · 3,14 · ${fmt(r ** 3)} = ⅔ · 3,14 · ${fmt(r ** 3)} ${halb} cm³<br>` +
            `Zusammen: ${fmt(vKegel)} + ${fmt(vHalb)} = ${zusammen}`
        };
      }

      if (art === 2) {
        const r = rnd(2, 6), hz = rnd(4, 12), hk = rnd(1, 4) * 3;
        const vZyl = rundeCirca(PI * r * r * hz), vKegel = rundeCirca(PI * r * r * hk / 3);
        const V = rundeCirca(vZyl + vKegel);
        /* Wie das Silo-Beispiel der Seite: Die Dachhöhe ist ein Vielfaches von 3,
           also zuerst teilen (⅓ · 3,14 · 9 · 3 = 3,14 · 9). Beide Teile gehen mit
           π ≈ 3,14 auf zwei Stellen auf – im Weg steht deshalb „=“, nicht „≈“. */
        const dach = hk === 3 ? `3,14 · ${fmt(r * r)}` : `3,14 · ${fmt(r * r)} · ${fmt(hk / 3)}`;
        return {
          q: `Ein Silo besteht aus einem Zylinder (r = ${fmt(r)} m, h = ${fmt(hz)} m) mit einem Kegeldach der Höhe ${fmt(hk)} m. Berechne das gesamte Volumen (in m³). ${piHint}`,
          type: 'input', placeholder: 'V in m³',
          check: circaCheck(V), testAnswer: String(V), answerText: `≈ ${fmt(V)} m³`,
          solution: `Zylinder: V = π · r² · h = 3,14 · ${fmt(r * r)} · ${fmt(hz)} = ${fmt(vZyl)} m³<br>` +
            `Kegeldach: V = ⅓ · 3,14 · ${fmt(r * r)} · ${fmt(hk)} = ${dach} = ${fmt(vKegel)} m³<br>` +
            `Zusammen: ${fmt(vZyl)} + ${fmt(vKegel)} = <strong>${fmt(V)} m³</strong>`
        };
      }

      if (art === 3) {
        const r = rnd(2, 6);
        const vZyl = rundeCirca(PI * r * r * (2 * r)), vKugel = rundeCirca(4 / 3 * PI * r ** 3);
        const frei = rundeCirca(vZyl - vKugel);
        /* Wie das Silo und die Kugel der Stufe 1: 3,14 · r² · 2r geht immer auf
           zwei Stellen auf, also „=“. Die Kugel geht nur bei r = 3 und 6 auf (r³
           durch 3 teilbar) – dann zuerst teilen wie im Eistüten-Beispiel der
           Seite, und auch „Frei“ ist genau. Sonst trägt die Kugel „≈“, und das
           Ergebnis erbt es. */
        const kugelGenau = r % 3 === 0;
        const kugel = kugelGenau
          ? `= 4 · 3,14 · ${fmt(r ** 3 / 3)} = ${fmt(vKugel)}`
          : `≈ ${fmt(vKugel)}`;
        const zf = kugelGenau ? '=' : '≈';
        return {
          q: `Eine Kugel mit r = ${fmt(r)} cm liegt genau passend in einer Dose: Der Zylinder hat denselben Radius und die Höhe ${fmt(2 * r)} cm. Wie viel cm³ bleiben neben der Kugel frei? ${piHint}`,
          type: 'input', placeholder: 'Rest in cm³',
          check: circaCheck(frei), testAnswer: String(frei), answerText: `≈ ${fmt(frei)} cm³`,
          solution: `Dose: V = π · r² · h = 3,14 · ${fmt(r * r)} · ${fmt(2 * r)} = ${fmt(vZyl)} cm³<br>Kugel: V = ⁴⁄₃ · 3,14 · ${fmt(r ** 3)} ${kugel} cm³<br>Frei: ${fmt(vZyl)} − ${fmt(vKugel)} ${zf} <strong>${fmt(frei)} cm³</strong><br>Das ist genau ein Drittel der Dose – die Kugel füllt immer ⅔ ihres Zylinders.`
        };
      }

      if (art === 4) {
        // hs = Seitenhöhe (Höhe des Seitendreiecks). Sie muss größer als a/2 sein,
        // sonst gibt es die Pyramide nicht: h² = hs² − (a/2)² wäre null oder negativ.
        // Vorher traf das jede sechste Zelt-Aufgabe (a = 12 m, hs = 6 m ⇒ h = 0).
        const a = rnd(4, 14), hs = rnd(Math.floor(a / 2) + 1, 12);
        const O = a * a + 2 * a * hs;
        return {
          q: `Ein Zelt hat die Form einer quadratischen Pyramide: Grundkante a = ${fmt(a)} m, Seitenhöhe (Höhe eines Seitendreiecks) h<sub>a</sub> = ${fmt(hs)} m. Wie viel m² Stoff braucht man für die <strong>vier Seitenflächen und den Boden</strong>?`,
          type: 'input', placeholder: 'Fläche in m²',
          check: numCheck(O), testAnswer: String(O), answerText: `${fmt(O)} m²`,
          solution: `Boden: a² = ${fmt(a)}² = ${fmt(a * a)} m²<br>Ein Seitendreieck: ½ · a · h<sub>a</sub> = ½ · ${fmt(a)} · ${fmt(hs)} = ${fmt(a * hs / 2)} m², mal 4 = ${fmt(2 * a * hs)} m²<br>Zusammen: ${fmt(a * a)} + ${fmt(2 * a * hs)} = <strong>${fmt(O)} m²</strong>`
        };
      }

      if (art === 5) {
        const k = choice([2, 3]);
        const was = choice(['Volumen', 'Oberfläche']);
        const f = was === 'Volumen' ? k ** 3 : k * k;
        const richtig = `mal ${fmt(f)}`;
        // Aus der Kandidatenliste bleiben nach dem Aussortieren des richtigen
        // Werts immer mindestens drei verschiedene übrig – auch bei k = 3,
        // wo k² und 3k beide 9 ergeben.
        const werte = [k, k * k, k ** 3, 2 * k, 3 * k, k + 2].filter(x => x !== f);
        /* Der Grund hängt am Wert, nicht am Listenplatz: Bei k = 2 ist k² = 2k,
           bei k = 3 ist k² = 3k. Führen zwei typische Fehler auf dieselbe Zahl,
           bleibt sie ohne Grund. 2k beim Volumen und 3k bei der Oberfläche sind
           keine eigenen Fehler, zählen aber als Weg mit – k + 2 nicht.
           Ausnahme k² beim Volumen (dritter Eintrag `true`): Der Grund beschreibt
           den Wert, nicht den Weg („mal 4 ist 2²“) – er stimmt für jeden Weg,
           der auf diese Zahl führt, und gilt deshalb auch bei einer Kollision. */
        const wege = was === 'Volumen'
          ? [[k, `Mal ${fmt(k)} gilt nur für Längen wie den Radius selbst.`],
             [k * k, `Mal ${fmt(k * k)} ist ${fmt(k)}² – so wächst eine Fläche, kein Volumen.`, true],
             [3 * k, `Hier ist ${fmt(k)} mit 3 multipliziert statt hoch 3 genommen.`],
             [2 * k, null]]
          : [[k, `Mal ${fmt(k)} gilt nur für Längen wie den Radius selbst.`],
             [k ** 3, `Mal ${fmt(k ** 3)} ist ${fmt(k)}³ – so wächst ein Volumen, keine Oberfläche.`],
             [2 * k, `Hier ist ${fmt(k)} mit 2 multipliziert statt quadriert.`],
             [3 * k, null]];
        const grundFuer = x => {
          const treffer = wege.filter(w => w[0] === x);
          const wertbezogen = treffer.find(w => w[2]);
          if (wertbezogen) return wertbezogen[1];
          return treffer.length === 1 ? treffer[0][1] : null;
        };
        const mc = makeChoice(richtig, werte.map(x => `mal ${fmt(x)}`), werte.map(grundFuer));
        // Für die Probe r = 3 wählen: 3³ = 27 und 6³ = 216 gehen mit π ≈ 3,14 glatt auf.
        const v = z => rundeCirca((was === 'Volumen' ? 4 / 3 * PI * z ** 3 : 4 * PI * z * z));
        return {
          q: `Der Radius einer Kugel wird <strong>ver${k === 2 ? 'doppelt' : 'dreifacht'}</strong>. Wie verändert sich ${was === 'Volumen' ? 'das' : 'die'} <strong>${was}</strong>?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: richtig,
          solution: `In ${was === 'Volumen' ? 'V = ⁴⁄₃ · π · r³ steht r <strong>hoch drei</strong>' : 'O = 4 · π · r² steht r <strong>hoch zwei</strong>'}. Aus r wird ${fmt(k)}r, also aus r${was === 'Volumen' ? '³' : '²'} das (${fmt(k)}r)${was === 'Volumen' ? '³' : '²'} = ${fmt(f)} · r${was === 'Volumen' ? '³' : '²'}.<br>Probe mit r = 3 und r = ${fmt(3 * k)}: ${fmt(v(3))} und ${fmt(v(3 * k))} – das ist das ${fmt(f)}-fache.`
        };
      }

      const r = rnd(2, 6), h = rnd(1, 4) * 3, hz = rnd(2, 8);
      const vKegel = PI * r * r * h / 3;
      const fuell = vKegel / (PI * r * r);
      return {
        q: `Ein kegelförmiges Glas (r = ${fmt(r)} cm, h = ${fmt(h)} cm) wird randvoll gefüllt und in einen zylindrischen Becher mit demselben Radius gegossen. Wie hoch steht das Wasser dann im Becher (in cm)? <span class="hint">Der Becher ist hoch genug.</span>`,
        type: 'input', placeholder: 'Höhe in cm',
        check: numCheck(fuell), testAnswer: String(fuell), answerText: `${fmt(fuell)} cm`,
        solution: `Das Volumen bleibt gleich, nur die Form ändert sich:<br>Kegel: V = ⅓ · π · r² · h<br>Becher: V = π · r² · x<br>Beide Male steht π · r² da – es kürzt sich weg: x = ⅓ · h = ⅓ · ${fmt(h)} = <strong>${fmt(fuell)} cm</strong><br>Der Kegel füllt den gleich breiten Zylinder immer genau zu einem Drittel.`
      };
    }
  };

  /* ---------- Strahlensätze & Ähnlichkeit ---------- */

  /* Aus a : b = c : d folgt über Kreuz a · d = b · c. Die gesuchte Größe ist
     immer das Produkt der beiden anderen, geteilt durch ihren Diagonalpartner –
     so lässt sich jede der vier Größen mit derselben Zeile berechnen. */
  const DIAGONAL = { 1: 4, 4: 1, 2: 3, 3: 2 };

  function verhaeltnisAufgabe(namen, werte, weg, einleitung, gleichung, hinweis) {
    const p = DIAGONAL[weg];
    const rest = [1, 2, 3, 4].filter(i => i !== weg && i !== p);
    const ges = namen[weg - 1], partner = namen[p - 1];
    const n1 = namen[rest[0] - 1], n2 = namen[rest[1] - 1];
    const loes = werte[rest[0] - 1] * werte[rest[1] - 1] / werte[p - 1];
    const gegeben = namen.map((n, i) => i === weg - 1 ? null : `${n} = ${fmt(werte[i])} cm`)
      .filter(Boolean).join(', ');
    return {
      q: `${einleitung} Gegeben: ${gegeben}. Berechne ${ges} (in cm).${hinweis || ''}`,
      type: 'input', placeholder: `${ges} in cm`,
      check: numCheck(loes), testAnswer: String(loes), answerText: `${ges} = ${fmt(loes)} cm`,
      solution: `${gleichung}&ensp;<span class="trenn">•</span>&ensp;Über Kreuz: ${namen[0]} · ${namen[3]} = ${namen[1]} · ${namen[2]}&ensp;<span class="trenn">•</span>&ensp;Nach ${ges} umstellen: ${ges} = (${n1} · ${n2}) : ${partner} = (${fmt(werte[rest[0] - 1])} · ${fmt(werte[rest[1] - 1])}) : ${fmt(werte[p - 1])} = <strong>${fmt(loes)} cm</strong>`
    };
  }

  const strahlensaetze = {
    id: 'strahlensaetze',
    icon: 'k·a',
    title: 'Strahlensätze & Ähnlichkeit',
    tagline: 'Zentrische Streckung und Verhältnisse am Strahlensatz',
    learn: `
      <h2>Strahlensätze – rechnen, was man nicht messen kann</h2>
      <p>Wie hoch ist ein Baum? Wie breit ein Fluss? An beides kommt man mit dem Maßband
      nicht heran. Man braucht es auch nicht: Wenn zwei Figuren <strong>dieselbe Form</strong>
      haben und sich nur in der Größe unterscheiden, stehen ihre Längen alle im selben
      Verhältnis. Aus drei bekannten Strecken folgt dann die vierte.</p>

      <div class="einstieg-box">
        <p class="box-title">Der Baum im Schulhof</p>
        <p>Du bist 1,60 m groß und wirfst einen 2 m langen Schatten. Der Baum daneben wirft
        zur selben Zeit einen 15 m langen Schatten.</p>
        <p class="frage">Wie hoch ist der Baum – ohne hinaufzuklettern?</p>
      </div>

      <div class="herleitung-box">
        <p class="box-title">Warum die Verhältnisse gleich bleiben</p>
        <p>Bei einer <strong>zentrischen Streckung</strong> wählt man einen festen Punkt Z
        und einen Faktor k. Jeder Punkt P wandert auf der Geraden ZP so weit, dass
        ZP′ = k · ZP gilt. Ist k größer als 1, wird die Figur größer, liegt k zwischen
        0 und 1, wird sie kleiner – verzerrt wird sie in keinem Fall: Alle Längen
        werden mit demselben k multipliziert, alle Winkel bleiben, wie sie sind.</p>
        <p>Und genau das ist der Grund für die Strahlensätze. Zeichne zwei Strahlen von Z aus
        und schneide sie mit zwei <strong>parallelen</strong> Geraden. Die zweite Schnittfigur
        ist dann das Bild der ersten unter einer Streckung mit einem k. Also gilt für jede
        Strecke der Figur derselbe Faktor:</p>
        <p>ZB = k · ZA&nbsp;und&nbsp;ZD = k · ZC&nbsp;⇒&nbsp;ZB : ZA = ZD : ZC = k</p>
        <p>Dieselbe Gleichung, nur anders sortiert, ist der 1. Strahlensatz. Weil auch die
        Verbindungsstrecken auf den Parallelen mitgestreckt werden, gilt BD = k · AC – das
        ist der 2. Strahlensatz.</p>
        <p>Die Parallelität ist keine Verzierung: Ohne sie ist die zweite Figur kein
        gestrecktes Bild der ersten, und keiner der beiden Sätze gilt.</p>
      </div>

      <div class="merkkasten">
        <p class="box-title">Die beiden Strahlensätze</p>
        <p>Zwei Strahlen gehen von Z aus. Eine Parallele schneidet sie in A und C, eine
        zweite in B und D.</p>
        <p><strong>1. Strahlensatz</strong> (Abschnitte auf den <em>Strahlen</em>):&nbsp;ZA : ZB = ZC : ZD,&nbsp;ZA : ZC = ZB : ZD&nbsp;und&nbsp;ZA : AB = ZC : CD</p>
        <p><strong>2. Strahlensatz</strong> (Abschnitte auf den <em>Parallelen</em>):&nbsp;ZA : ZB = AC : BD&nbsp;und&nbsp;ZC : ZD = AC : BD</p>
        <p><strong>Zentrische Streckung:</strong>&nbsp;Länge · k,&nbsp;Fläche · k²,&nbsp;Winkel unverändert</p>
        <p>Jede dieser Gleichungen darf man umschreiben: beide Seiten tauschen (aus a : b = c : d
        wird c : d = a : b), die mittleren Glieder tauschen (a : c = b : d) oder über Kreuz
        multiplizieren&nbsp;(a · d = b · c).</p>
      </div>

      <h3>So rechnest du</h3>
      <ol class="schritte">
        <li>Den Scheitel Z suchen – den Punkt, von dem beide Strahlen ausgehen.</li>
        <li>Prüfen, ob die beiden Schnittgeraden wirklich parallel sind. Sonst gilt nichts
        von alldem.</li>
        <li>Entscheiden, welcher Satz passt: Liegen die gesuchten Strecken auf den
        <em>Strahlen</em>, ist es der erste; liegen sie auf den <em>Parallelen</em>,
        der zweite.</li>
        <li>Verhältnisgleichung aufschreiben und dabei streng darauf achten, dass links und
        rechts <strong>in derselben Richtung</strong> gemessen wird – beide Male vom
        Scheitel aus oder beide Male das Zwischenstück.</li>
        <li>Über Kreuz multiplizieren und nach der gesuchten Größe auflösen.</li>
      </ol>

      <h3>Beispiele</h3>

      <div class="example-box">
        <p class="ex-title">1. Strahlensatz: die vierte Strecke</p>
        <p>ZA = 4 cm, ZB = 6 cm, ZC = 12 cm. Gesucht ist ZD.</p>
        <p>ZA : ZB = ZC : ZD&nbsp;⇒&nbsp;4 : 6 = 12 : ZD</p>
        <p>Über Kreuz: 4 · ZD = 6 · 12 = 72</p>
        <p>ZD = 72 : 4 = <strong>18 cm</strong></p>
        <p>Kontrolle: Von A nach C ist es das Dreifache (4 → 12), von B nach D auch
        (6 → 18). Der Faktor ist auf beiden Strahlen derselbe.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">2. Strahlensatz: eine Strecke auf der Parallelen</p>
        <p>ZA = 3 cm, ZB = 9 cm, AC = 5 cm. Gesucht ist BD.</p>
        <p>ZA : ZB = AC : BD&nbsp;⇒&nbsp;3 : 9 = 5 : BD</p>
        <p>Über Kreuz: 3 · BD = 9 · 5 = 45</p>
        <p>BD = 45 : 3 = <strong>15 cm</strong></p>
      </div>

      <div class="example-box">
        <p class="ex-title">Dieselbe Aussage, vier Schreibweisen</p>
        <p>ZA = 3 cm, ZB = 9 cm, ZC = 4 cm, ZD = 12 cm, AC = 5 cm, BD = 15 cm. Der
        2. Strahlensatz gilt in jeder dieser Formen; jede Seite ergibt nachgerechnet 1 : 3.</p>
        <p>ZA : ZB = AC : BD&nbsp;⇒&nbsp;3 : 9 = 5 : 15&ensp;<span class="trenn">•</span>&ensp;ZC : ZD = AC : BD&nbsp;⇒&nbsp;4 : 12 = 5 : 15</p>
        <p>AC : BD = ZA : ZB&nbsp;⇒&nbsp;5 : 15 = 3 : 9&ensp;<span class="trenn">•</span>&ensp;AC : BD = ZC : ZD&nbsp;⇒&nbsp;5 : 15 = 4 : 12</p>
        <p>Dass links auch der zweite Strahl stehen darf, liegt am 1. Strahlensatz: ZA : ZB und
        ZC : ZD sind dasselbe Verhältnis. Und beide Seiten einer Verhältnisgleichung darf man
        vertauschen.</p>
        <p>Beim 1. Strahlensatz genauso: Aus ZA : ZB = ZC : ZD wird mit vertauschten mittleren
        Gliedern ZA : ZC = ZB : ZD, also 3 : 4 = 9 : 12. Beides ist der 1. Strahlensatz.</p>
        <p>Über Kreuz wird aus ZA : ZB = AC : BD die Gleichung ZA · BD = ZB · AC, also
        3 · 15 = 9 · 5 = 45. Nicht dagegen ZA · ZB = AC · BD: Das wären 27 und 75.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Zentrische Streckung: Länge, Fläche, Winkel</p>
        <p>Ein Rechteck ist 3 cm × 4 cm groß, hat also den Flächeninhalt A = 12 cm².
        Es wird mit k = 3 gestreckt.</p>
        <p>Seiten: 9 cm und 12 cm&ensp;<span class="trenn">•</span>&ensp;Umfang: 14 cm → 42 cm (mal 3)</p>
        <p>Fläche: 9 · 12 = 108 cm² = <strong>3² · 12 cm²</strong> – also mal 9, nicht mal 3.</p>
        <p>Die vier rechten Winkel bleiben rechte Winkel.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Der Baum aus dem Einstieg</p>
        <p>Die Sonnenstrahlen fallen parallel ein, Person und Baum stehen beide senkrecht –
        zwei ähnliche Dreiecke.</p>
        <p>Höhe : Schatten ist bei beiden gleich:&nbsp;h : 15 = 1,60 : 2</p>
        <p>Über Kreuz: h · 2 = 15 · 1,60 = 24</p>
        <p>h = 24 : 2 = <strong>12 m</strong></p>
        <p>Kurzweg: Der Baumschatten ist 7,5-mal so lang wie deiner, also ist der Baum
        7,5-mal so hoch: 1,60 · 7,5 = 12 m.</p>
      </div>

      <div class="achtung-box">
        <p class="achtung-title">Beim 2. Strahlensatz steht links nicht das Zwischenstück</p>
        <p>Der 2. Strahlensatz vergleicht die Parallelstrecken mit den Abständen
        <strong>vom Scheitel aus</strong>. Wer stattdessen das Stück zwischen den beiden
        Parallelen einsetzt, rechnet falsch.</p>
        <p><strong>Gegenbeispiel:</strong> ZA = 3 cm, ZB = 9 cm, AC = 5 cm, also AB = 6 cm.</p>
        <p>Richtig: ZA : ZB = AC : BD&nbsp;⇒&nbsp;3 : 9 = 5 : BD&nbsp;⇒&nbsp;BD = 15 cm</p>
        <p>Falsch: AB : ZB = AC : BD&nbsp;⇒&nbsp;6 : 9 = 5 : BD&nbsp;⇒&nbsp;BD = 7,5 cm</p>
        <p>Das ist nur die Hälfte des richtigen Werts. Probe: Der Faktor von der ersten zur
        zweiten Parallelen ist ZB : ZA = 9 : 3 = 3, also muss BD = 3 · 5 = 15 cm sein.
        Die 7,5 kann schon deshalb nicht stimmen, weil BD größer als AC sein muss.</p>
      </div>

      <div class="selbstcheck">
        <p class="box-title">Selbstcheck</p>
        <details><summary>Warum müssen die beiden Schnittgeraden parallel sein?</summary>
        <p>Nur dann ist die zweite Figur das Bild der ersten unter einer zentrischen
        Streckung. Ohne Parallelität hat jede Strecke ihren eigenen Faktor, und es gibt
        gar kein gemeinsames Verhältnis mehr.</p></details>
        <details><summary>ZA = 5 cm, ZC = 8 cm, ZD = 24 cm. Wie lang ist ZB?</summary>
        <p>ZA : ZB = ZC : ZD, also 5 : ZB = 8 : 24. Über Kreuz: 8 · ZB = 5 · 24 = 120,
        also ZB = 15 cm. Kontrolle: 8 → 24 ist mal 3, und 5 · 3 = 15.</p></details>
        <details><summary>Eine Figur wird mit k = 4 gestreckt. Wie ändern sich Umfang und Fläche?</summary>
        <p>Der Umfang ist eine Summe von Längen und wird viermal so groß. Die Fläche wächst
        in zwei Richtungen und wird 4² = 16-mal so groß.</p></details>
        <details><summary>Ein Modellhaus im Maßstab 1 : 50 hat eine 6 cm hohe Tür. Wie hoch ist die echte Tür?</summary>
        <p>6 cm · 50 = 300 cm = 3 m.</p></details>
        <details><summary>Welche Größen ändert eine zentrische Streckung nicht?</summary>
        <p>Die Winkel – und damit die Form. Deshalb heißen Original und Bild ähnlich.</p></details>
      </div>
    `,
    gen(diff) {

      if (diff === 1) {
        const art = rnd(1, 7);

        if (art === 1) {
          const a = rnd(3, 14), k = choice([2, 3, 4, 5, 0.5, 1.5, 2.5]);
          const b = a * k;
          return {
            q: `Eine Strecke ist ${fmt(a)} cm lang und wird zentrisch mit dem Streckfaktor k = ${fmt(k)} gestreckt. Wie lang ist die Bildstrecke (in cm)?`,
            type: 'input', placeholder: 'Länge in cm',
            check: numCheck(b), testAnswer: String(b), answerText: `${fmt(b)} cm`,
            solution: `Bei der zentrischen Streckung wird <strong>jede</strong> Länge mit k multipliziert:&ensp;<span class="trenn">•</span>&ensp;a′ = k · a = ${fmt(k)} · ${fmt(a)} = <strong>${fmt(b)} cm</strong>${k < 1 ? `&ensp;<span class="trenn">•</span>&ensp;k = ${fmt(k)} liegt zwischen 0 und 1 – die Bildstrecke ist also kürzer als das Original.` : ''}`
          };
        }

        if (art === 2) {
          const a = rnd(2, 12), k = choice([2, 3, 4, 5, 0.5, 1.5, 2.5]);
          const b = a * k;
          return {
            q: `Eine ${fmt(a)} cm lange Strecke wird durch eine zentrische Streckung auf ${fmt(b)} cm abgebildet. Bestimme den Streckfaktor k.`,
            type: 'input', placeholder: 'k = ?',
            check: numCheck(k), testAnswer: String(k), answerText: `k = ${fmt(k)}`,
            solution: `k ist der Faktor, der aus der Originallänge die Bildlänge macht:&ensp;<span class="trenn">•</span>&ensp;k = a′ : a = ${fmt(b)} : ${fmt(a)} = <strong>${fmt(k)}</strong>${k < 1 ? '&ensp;<span class="trenn">•</span>&ensp;k liegt zwischen 0 und 1 – die Figur wird also kleiner.' : ''}`
          };
        }

        if (art === 3) {
          const a = rnd(3, 14), k = choice([2, 3, 4, 5]);
          const b = a * k;
          return {
            q: `Eine Bildstrecke ist ${fmt(b)} cm lang, der Streckfaktor war k = ${fmt(k)}. Wie lang war die Originalstrecke (in cm)?`,
            type: 'input', placeholder: 'Länge in cm',
            check: numCheck(a), testAnswer: String(a), answerText: `${fmt(a)} cm`,
            solution: `Aus a′ = k · a wird durch Teilen durch k:&ensp;<span class="trenn">•</span>&ensp;a = a′ : k = ${fmt(b)} : ${fmt(k)} = <strong>${fmt(a)} cm</strong>`
          };
        }

        if (art === 4) {
          const U = rnd(3, 20) * 2, k = choice([2, 3, 4, 0.5]);
          const U2 = U * k;
          return {
            q: `Ein Vieleck hat den Umfang U = ${fmt(U)} cm. Es wird zentrisch mit k = ${fmt(k)} gestreckt. Wie groß ist der Umfang der Bildfigur (in cm)?`,
            type: 'input', placeholder: 'U in cm',
            check: numCheck(U2), testAnswer: String(U2), answerText: `${fmt(U2)} cm`,
            solution: `Der Umfang ist eine Summe von Längen, und jede Länge wird mit k multipliziert:&ensp;<span class="trenn">•</span>&ensp;U′ = k · U = ${fmt(k)} · ${fmt(U)} = <strong>${fmt(U2)} cm</strong>${k < 1 ? `&ensp;<span class="trenn">•</span>&ensp;k = ${fmt(k)} liegt zwischen 0 und 1 – die Bildfigur ist also kleiner als das Original.` : ''}`
          };
        }

        if (art === 5) {
          const A = rnd(2, 20) * 2, k = choice([2, 3, 4]);
          const A2 = A * k * k;
          return {
            q: `Eine Figur hat den Flächeninhalt A = ${fmt(A)} cm². Sie wird zentrisch mit k = ${fmt(k)} gestreckt. Wie groß ist die Bildfläche (in cm²)?`,
            type: 'input', placeholder: 'A in cm²',
            check: numCheck(A2), testAnswer: String(A2), answerText: `${fmt(A2)} cm²`,
            solution: `Eine Fläche wächst in <strong>zwei</strong> Richtungen – Länge und Breite werden beide mit k multipliziert:&ensp;<span class="trenn">•</span>&ensp;A′ = k² · A = ${fmt(k)}² · ${fmt(A)} = ${fmt(k * k)} · ${fmt(A)} = <strong>${fmt(A2)} cm²</strong>`
          };
        }

        if (art === 6) {

          /* ---- 6 · Die Winkel bleiben, wie sie sind ----
             Als Eingabe statt als Auswahl, siehe die Begründung bei Aufgabe 7: Unter
             lauter gestreckten Größen ist „unverändert“ das auffällige Element. Hier
             gibt es nichts zu vergleichen – wer glaubt, dass Winkel mitwachsen, tippt
             das k-fache und liegt falsch. Gefragt ist außerdem nicht „der Winkel“,
             sondern der größte oder der kleinste: So steht die Antwort zwar in der
             Aufgabe, aber man muss wissen, welche der drei Zahlen sie ist. */
          const kw = choice([2, 3, 4]);
          let wa, wb, wc;
          do {
            wa = rnd(25, 85); wb = rnd(25, 85); wc = 180 - wa - wb;
          } while (wc < 25 || wc > 95 || wa === wb || wb === wc || wa === wc);
          const winkel = shuffle([wa, wb, wc]);
          const grosse = rnd(1, 2) === 1;
          const gesucht = grosse ? Math.max(...winkel) : Math.min(...winkel);
          return {
            q: `Ein Dreieck hat die Winkel ${fmt(winkel[0])}°, ${fmt(winkel[1])}° und ${fmt(winkel[2])}°. Es wird zentrisch mit dem Streckfaktor k = ${fmt(kw)} gestreckt. Wie groß ist der <strong>${grosse ? 'größte' : 'kleinste'}</strong> Winkel der Bildfigur (in Grad)?`,
            type: 'input', placeholder: 'Winkel in °',
            check: numCheck(gesucht), testAnswer: String(gesucht), answerText: `${fmt(gesucht)}°`,
            solution: `Eine zentrische Streckung ändert die <strong>Größe</strong>, nicht die <strong>Form</strong>: Jede Länge wird mit k multipliziert, jeder Winkel bleibt genau so groß, wie er war.&ensp;<span class="trenn">•</span>&ensp;Der ${grosse ? 'größte' : 'kleinste'} Winkel des Originals misst ${fmt(gesucht)}° – also misst er im Bild ebenfalls <strong>${fmt(gesucht)}°</strong>.&ensp;<span class="trenn">•</span>&ensp;Gegenprobe: Die Winkelsumme im Dreieck ist ${fmt(winkel[0])}° + ${fmt(winkel[1])}° + ${fmt(winkel[2])}° = 180°. Würde jeder Winkel mit ${fmt(kw)} multipliziert, käme ${fmt(180 * kw)}° heraus – ein Dreieck mit ${fmt(180 * kw)}° Winkelsumme gibt es nicht.`
          };
        }

        /* ---- 7 · Länge mal k, Fläche mal k² ----

           Hier stand vorher eine einzige Frage nach den Winkeln, und „Sie bleiben
           gleich groß." war in jeder Ziehung die Antwort – zugleich die kürzeste
           Option. Ohne die Frage zu lesen war sie zu 100 % richtig.

           Der erste Reparaturversuch stellte drei Aussagen der Form „X wird n-mal
           so groß." nebeneinander und scheiterte an derselben Stelle: „Jeder Winkel
           bleibt gleich groß." ist aus sich heraus wahr und kann deshalb NIE
           Ablenker sein. Stand die Zeile ohne Zahl da, war sie zu 100 % die Lösung;
           stand eine Zahl darin, war sie sicher falsch – blindes Streichen hob die
           Ratequote von 33 % auf 67 %. Das ist die Familie, die in CLAUDE.md unter
           `symmetrie` steht („jeder Großvokal ist achsensymmetrisch“): Eine Aussage,
           die schon ohne die Zahlen der Aufgabe wahr ist, verrät sich, sobald sie
           im Feld steht.

           Der Winkel lässt sich in einem Auswahlfeld nicht neben Umfang und Fläche
           stellen, ohne sich zu verraten – „unverändert“ ist unter lauter
           gestreckten Größen immer die Ausnahme. Drei Anläufe zeigten das an drei
           verschiedenen Merkmalen: an der fehlenden Ziffer, an der Zahl, die schon
           in der Aufgabe steht, und an dem Verhältnis 1 zwischen Original und Bild
           (gemessen 86 % bei einer Darstellung „Winkel: 51° → 51°“). Deshalb wird
           er jetzt als Eingabe geprüft – Aufgabe 6 gleich darüber, dort ist er
           nicht zu erraten, sondern zu rechnen. Genauso ist das Projekt schon bei
           `vektoren` mit einem unvermeidbaren Muster verfahren.

           Übrig bleibt hier die Unterscheidung, um die es beim Streckfaktor
           wirklich geht: Längen wachsen mit k, Flächen mit k². Beide Größen stehen
           mit je zwei Zeilen im Feld, eine davon ist die richtige – wer eine Größe
           errät, hat damit nichts gewonnen. Keine Option nennt eine Zahl aus der
           Aufgabe, keine ist an Länge oder Form zu erkennen.

           Nachgemessen über 50 000 Ziehungen (fünf Saaten) liegt jede blinde
           Faustregel zwischen 19 und 26 % – bei einem Zufall von 25 %: längste
           Option 21, kürzeste 23, größte Zahl 19, kleinste 25, zweitgrößte 22,
           zweitkleinste 26; der Ausreißer der Form und die Token-Ähnlichkeit
           greifen in weniger als einem Zehntel der Ziehungen überhaupt, die Lage
           der Lösung liegt bei 25/25/25/25. Und keine der 161 Zeilen, die
           häufig genug vorkommen, um sie sich zu merken, ist häufiger als in 60 %
           oder seltener als in 5 % ihrer Auftritte die Lösung: Wer alle je
           gesehenen Zeilen auswendig lernt und die Frage nicht liest, kommt auf
           34 % (projektweit stehen 73 Aufgabentypen bei dieser Merkregel auf
           100 %). */
        const k = choice([2, 3]);
        const U = rnd(8, 60);
        /* Umfang und Flächeninhalt müssen zusammenpassen: Zu einem Umfang U gibt es
           höchstens die Fläche eines Quadrats mit der Seite U : 4, also U² : 16.
           Ohne diese Schranke stünde in der Aufgabe schon einmal „Umfang 15 cm,
           Flächeninhalt 25 cm²" – eine Figur, die es nicht gibt. */
        const A = rnd(3, Math.min(40, Math.floor(U * U / 16)));
        /* `moeglich` beschreibt, welche Zahlen für diese Größe überhaupt als
           Bildwert herauskommen können: Umfänge sind k-mal eine Zahl aus [8, 60],
           Flächen k²-mal eine aus [3, 40]. Ablenker müssen diese Probe bestehen.
           Sonst gäbe es Zeilen, die in KEINER Ziehung richtig sein können („Der
           Umfang beträgt dann 13 cm." – 13 ist weder durch 2 noch durch 3 teilbar),
           und wer sie einmal als falsch erlebt hat, streicht sie fortan blind.
           `frisch` liefert einen Wert derselben Art, der zu einer anderen Figur
           passen würde. Ohne ihn fehlen dem Feld die großen Zahlen, sobald die
           Probe die k³-Fläche aussortiert – die gesuchte Zahl wäre dann zu oft die
           größte im Feld. */
        /* `grund` nennt den Fehler hinter einer falschen Zeile – nur, wenn ihre
           Zahl genau aus diesem Fehler entsteht und aus keiner anderen
           Verwechslung des Vorrats (unten): Bei U = A · k ist U · k² zugleich
           A · k³, dann bleibt die Zeile ohne Grund. */
        const vonU = [U * k, U * k * k], vonA = [A * k, A * k * k, A * k * k * k];
        const groessen = [
          { wahr: U * k, frisch: () => k * rnd(8, 60),
            moeglich: x => (x % 2 === 0 && x >= 16 && x <= 120) || (x % 3 === 0 && x >= 24 && x <= 180),
            text: x => `Der Umfang beträgt dann ${fmt(x)} cm.`,
            grund: x => x === U * k * k && !vonA.includes(x)
              ? `Hier ist der Umfang mit ${fmt(k)}² = ${fmt(k * k)} multipliziert. Er ist aber eine Summe von Längen, keine Fläche.` : null },
          { wahr: A * k * k, frisch: () => k * k * rnd(3, 40),
            moeglich: x => (x % 4 === 0 && x >= 12 && x <= 160) || (x % 9 === 0 && x >= 27 && x <= 360),
            text: x => `Der Flächeninhalt beträgt dann ${fmt(x)} cm².`,
            grund: x => vonU.includes(x) ? null
              : x === A * k ? `Hier ist der Flächeninhalt nur mit k = ${fmt(k)} multipliziert. Eine Fläche wächst aber in zwei Richtungen.`
              : x === A * k * k * k ? `Hier ist der Flächeninhalt mit ${fmt(k)}³ multipliziert – so wächst ein Volumen, keine Fläche.` : null }
        ];
        /* Der gemeinsame Zahlenvorrat: die beiden Bildwerte und ihre typischen
           Verwechslungen – mit k statt k² gestreckt, mit k² statt k, mit k³ wie bei
           einem Körper. Jede Zeile des Feldes nennt eine Zahl aus diesem Vorrat,
           die richtige wie die falschen. */
        const vorrat = [U * k, U * k * k, A * k, A * k * k, A * k * k * k];
        const falschFuer = i => {
          const g = groessen[i];
          // U und A selbst kommen nicht vor: Eine Zahl, die schon in der Aufgabe
          // steht, wäre ein Merkmal, an dem sich die Zeile erkennen ließe.
          const passt = x => x !== g.wahr && x !== U && x !== A;
          const liste = [...new Set(vorrat)].filter(x => passt(x) && g.moeglich(x));
          for (let n = 0; n < 3 || liste.length < 2; n++) {
            const x = g.frisch();
            if (passt(x) && !liste.includes(x)) liste.push(x);
          }
          return shuffle(liste);
        };
        /* Beide Größen stehen mit genau zwei Zeilen da. Damit ist „nimm die Größe,
           die häufiger/seltener vorkommt" keine Regel mehr, und wer blind eine
           Größe wählt, steht weiter bei 25 %. */
        const zielIdx = rnd(0, 1);
        const zeilen = [], grundZu = new Map();
        for (let i = 0; i < 2; i++) {
          const g = groessen[i], f = falschFuer(i);
          const zeile = x => { zeilen.push(g.text(x)); if (x !== g.wahr) grundZu.set(g.text(x), g.grund(x)); };
          if (i === zielIdx) { zeile(g.wahr); zeile(f[0]); }
          else { zeile(f[0]); zeile(f[1]); }
        }
        const richtig = groessen[zielIdx].text(groessen[zielIdx].wahr);
        /* Kein Reserve-Ablenker nötig: Die beiden Größen tragen verschiedene
           Satzanfänge, und innerhalb einer Größe stehen nie zwei gleiche Zahlen.
           Zwei Zeilen können also nicht zusammenfallen – die Optionszahl ist
           konstant vier. */
        const ablenker = shuffle(zeilen.filter(z => z !== richtig));
        const mc = makeChoice(richtig, ablenker, ablenker.map(z => grundZu.get(z) || null));
        return {
          q: `Eine Figur hat den Umfang ${fmt(U)} cm und den Flächeninhalt ${fmt(A)} cm². Sie wird zentrisch mit k = ${fmt(k)} gestreckt. Welche Aussage über die Bildfigur stimmt?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: richtig,
          solution: `Der Umfang ist eine Summe von <strong>Längen</strong>, also wird er mit k multipliziert:&ensp;<span class="trenn">•</span>&ensp;${fmt(U)} cm · ${fmt(k)} = <strong>${fmt(U * k)} cm</strong>&ensp;<span class="trenn">•</span>&ensp;Der Flächeninhalt wächst in <strong>zwei</strong> Richtungen – Länge und Breite werden beide mit k multipliziert, also mal k²:&ensp;<span class="trenn">•</span>&ensp;${fmt(A)} cm² · ${fmt(k)}² = ${fmt(A)} cm² · ${fmt(k * k)} = <strong>${fmt(A * k * k)} cm²</strong>&ensp;<span class="trenn">•</span>&ensp;Richtig ist damit: <strong>${richtig}</strong>`
        };
      }

      if (diff === 2) {
        const a = rnd(2, 9), b = a + rnd(1, 8), t = rnd(2, 5);
        const weg = rnd(1, 4);
        const art = rnd(1, 3);

        if (art === 1) {
          return verhaeltnisAufgabe(['ZA', 'ZB', 'ZC', 'ZD'], [a, b, a * t, b * t], weg,
            'Zwei Strahlen gehen von Z aus und werden von zwei Parallelen geschnitten: A und B liegen auf dem einen Strahl, C und D auf dem anderen.',
            '1. Strahlensatz – die Abschnitte auf den beiden Strahlen:&nbsp;ZA : ZB = ZC : ZD');
        }

        if (art === 2) {
          return verhaeltnisAufgabe(['ZA', 'AB', 'ZC', 'CD'], [a, b - a, a * t, (b - a) * t], weg,
            'Zwei Strahlen gehen von Z aus und werden von zwei Parallelen geschnitten. AB ist das Stück zwischen den Parallelen auf dem einen Strahl, CD das auf dem anderen.',
            '1. Strahlensatz, hier mit den Zwischenstücken:&nbsp;ZA : AB = ZC : CD',
            ' <span class="hint">ZA reicht vom Scheitel bis zur ersten Parallelen, AB von der ersten zur zweiten.</span>');
        }

        const u = rnd(2, 6);
        return verhaeltnisAufgabe(['ZA', 'ZB', 'AC', 'BD'], [a, b, a * u, b * u], weg,
          'Zwei Strahlen gehen von Z aus und werden von zwei Parallelen geschnitten. AC ist die kürzere Parallelstrecke, BD die längere.',
          '2. Strahlensatz – Abschnitte auf den Parallelen zu Abschnitten ab dem Scheitel:&nbsp;ZA : ZB = AC : BD');
      }

      /* ---- Stufe 3: Sachzusammenhänge ---- */
      const art = rnd(1, 5);

      if (art === 1) {
        // Nicht „koerper“ nennen – so heißt weiter oben das Themenobjekt.
        const person = choice([1.5, 1.6, 1.75, 1.8]);
        const schatten = choice([2, 2.5, 3]);
        const m = rnd(3, 8);
        const rund = x => Math.round(x * 100) / 100;
        const baum = rund(person * m), langschatten = rund(schatten * m);
        return {
          q: `Eine ${fmt(person)} m große Person wirft einen ${fmt(schatten)} m langen Schatten. Ein Baum daneben wirft zur selben Zeit einen ${fmt(langschatten)} m langen Schatten. Wie hoch ist der Baum (in m)?`,
          type: 'input', placeholder: 'Höhe in m',
          check: numCheck(baum, 0.02), testAnswer: String(baum), answerText: `${fmt(baum)} m`,
          solution: `Die Sonnenstrahlen fallen parallel ein. Person und Baum stehen beide senkrecht – also sind die beiden Dreiecke aus Körper, Schatten und Sonnenstrahl <strong>ähnlich</strong>:&ensp;<span class="trenn">•</span>&ensp;Baumhöhe : Baumschatten = Personenhöhe : Personenschatten&ensp;<span class="trenn">•</span>&ensp;h : ${fmt(langschatten)} = ${fmt(person)} : ${fmt(schatten)}&ensp;<span class="trenn">•</span>&ensp;Über Kreuz: h · ${fmt(schatten)} = ${fmt(langschatten)} · ${fmt(person)}&ensp;<span class="trenn">•</span>&ensp;h = (${fmt(langschatten)} · ${fmt(person)}) : ${fmt(schatten)} = <strong>${fmt(baum)} m</strong>&ensp;<span class="trenn">•</span>&ensp;Kurzweg: Der Baumschatten ist ${fmt(m)}-mal so lang, also ist der Baum ${fmt(m)}-mal so hoch.`
        };
      }

      if (art === 2) {
        // Die Stabmethode: Auge, Stabspitze und Turmspitze auf einer Linie. Das Auge ist
        // der Scheitel, Stab und Turm stehen senkrecht – also zwei Parallelen.
        const stab = choice([1.2, 1.5, 1.8, 2]);
        const nah = choice([2, 2.5, 3].filter(x => x !== stab));   // stab = nah: Antwort stünde in der Frage
        const m = rnd(5, 15);
        const rund = x => Math.round(x * 100) / 100;
        const fern = rund(nah * m), hoch = rund(stab * m);
        return {
          q: `Um die Höhe eines Turms zu bestimmen, steckt Lena einen ${fmt(stab)} m langen Stab senkrecht in den Boden. Dann geht sie so weit zurück, bis ihr Auge, die Stabspitze und die Turmspitze auf einer Linie liegen. Vom Auge bis zum Stab sind es ${fmt(nah)} m, bis zum Turm ${fmt(fern)} m. Wie hoch ist der Turm (in m)? <span class="hint">Das Auge liegt am Boden.</span>`,
          type: 'input', placeholder: 'Höhe in m',
          check: numCheck(hoch, 0.02), testAnswer: String(hoch), answerText: `${fmt(hoch)} m`,
          solution: `Stab und Turm stehen beide senkrecht, sind also parallel. Das Auge ist der Scheitel Z – das ist die Figur des 2. Strahlensatzes:&ensp;<span class="trenn">•</span>&ensp;${fmt(nah)} : ${fmt(fern)} = ${fmt(stab)} : h&ensp;<span class="trenn">•</span>&ensp;Über Kreuz: ${fmt(nah)} · h = ${fmt(fern)} · ${fmt(stab)}&ensp;<span class="trenn">•</span>&ensp;h = (${fmt(fern)} · ${fmt(stab)}) : ${fmt(nah)} = <strong>${fmt(hoch)} m</strong>&ensp;<span class="trenn">•</span>&ensp;Kurzweg: Der Turm steht ${fmt(m)}-mal so weit weg wie der Stab, also ist er ${fmt(m)}-mal so hoch.`
        };
      }

      if (art === 3) {
        const s1 = rnd(2, 8), s2 = s1 + rnd(1, 6), k = rnd(2, 5);
        return {
          q: `Zwei Dreiecke sind ähnlich. Im kleinen Dreieck sind zwei Seiten ${fmt(s1)} cm und ${fmt(s2)} cm lang. Die Seite, die der ${fmt(s1)}-cm-Seite entspricht, ist im großen Dreieck ${fmt(s1 * k)} cm lang. Wie lang ist dort die zweite Seite (in cm)?`,
          type: 'input', placeholder: 'Seite in cm',
          check: numCheck(s2 * k), testAnswer: String(s2 * k), answerText: `${fmt(s2 * k)} cm`,
          solution: `Bei ähnlichen Figuren hat <strong>jede</strong> Seite denselben Faktor:&ensp;<span class="trenn">•</span>&ensp;k = ${fmt(s1 * k)} : ${fmt(s1)} = ${fmt(k)}&ensp;<span class="trenn">•</span>&ensp;Zweite Seite: ${fmt(s2)} · ${fmt(k)} = <strong>${fmt(s2 * k)} cm</strong>`
        };
      }

      if (art === 4) {
        const b = choice([10, 12, 15]), h = choice([15, 18, 20].filter(x => x !== b)), f = rnd(2, 5);   // b = h: die Höhe wäre die Breite aus der Frage
        return {
          q: `Ein Foto ist ${fmt(b)} cm breit und ${fmt(h)} cm hoch. Es wird ohne Verzerrung auf die Breite ${fmt(b * f)} cm vergrößert. Wie hoch ist es dann (in cm)?`,
          type: 'input', placeholder: 'Höhe in cm',
          check: numCheck(h * f), testAnswer: String(h * f), answerText: `${fmt(h * f)} cm`,
          solution: `„Ohne Verzerrung“ heißt: ähnlich, also beide Seiten mal denselben Faktor.&ensp;<span class="trenn">•</span>&ensp;k = ${fmt(b * f)} : ${fmt(b)} = ${fmt(f)}&ensp;<span class="trenn">•</span>&ensp;Höhe: ${fmt(h)} · ${fmt(f)} = <strong>${fmt(h * f)} cm</strong>`
        };
      }

      /* ---- 5 · Welche Gleichung ist der 1., welche der 2. Strahlensatz? ----

         Die Basis stellte hier immer dieselbe Frage mit immer derselben Antwort
         („ZA : ZB = AC : BD“) und immer denselben Ablenkern – wer die Aufgabe
         einmal gesehen hatte, brauchte sie nie wieder zu lesen. Einer der
         Ablenker war zudem gar kein Fehler: „ZA : AC = ZB : BD“ ist derselbe Satz
         mit vertauschten Mittelgliedern und wurde trotzdem als falsch gewertet.

         Der erste Reparaturversuch loste die Antwort unter vier Schreibweisen des
         2. Strahlensatzes aus. Fachlich ging das schief: Drei dieser Formen kamen
         auf der Erklärseite nirgends vor, und wer die dort gelernte linke Seite
         „ZA : ZB“ suchte, wurde in einem Drittel der Ziehungen gezielt auf einen
         Ablenker gezogen. Die Erklärseite führt die Umformungen jetzt ein
         (Merkkasten und das Beispiel „Dieselbe Aussage, vier Schreibweisen“), und
         zwar mit Zahlen nachgerechnet.

         Strukturell steckte in derselben Fassung eine zweite Falle, die erst beim
         Nachmessen auffiel. Ein reines Wahr-Feld – richtige Antwort aus dem einen
         Satz, alle Ablenker aus dem anderen – ist ohne jedes Lesen lösbar: Alle
         Gleichungen des 2. Strahlensatzes enthalten AC und BD, alle des ersten
         keines von beidem. Die Lösung teilt mit den drei Ablenkern also weniger
         Bausteine als diese untereinander, und „nimm die Zeile, die den anderen am
         unähnlichsten ist" trifft sie zu 100 %. Gemessen: greift in einem Viertel
         der Ziehungen, blinde Trefferquote damit 44 % statt 25 %.

         Das Feld ist deshalb in beiden Richtungen ausgewogen: zwei Zeilen mit den
         Parallelstrecken AC und BD, zwei ohne. Eine der beiden Zeilen der
         gefragten Seite ist die richtige Antwort, die andere eine falsche
         Gleichung derselben Bauart (Kehrwert, vertauschte Abschnitte,
         Zwischenstück links). Damit gibt es keine Zeile mehr, die sich allein an
         ihren Bausteinen erkennen ließe; alle acht wahren Zeilen sind 17 Zeichen
         lang und tragen dieselbe Form „XX : XX = XX : XX“.

         Jede wahre Zeile ist in genau einem Drittel der Ziehungen, in denen sie
         dasteht, die Lösung: Sie ist Lösung mit ½ · ¼ (ihr Satz ist gefragt, dann
         wird sie gezogen) und Ablenker mit ½ · ½ (der andere Satz ist gefragt,
         zwei ihrer vier Zeilen kommen ins Feld). Wer sich alle Zeilen merkt und
         die Frage nicht liest, kommt damit auf 33 % statt 25 % (nachgemessen
         31 %) – zum Vergleich: dieselbe Merkregel steht projektweit bei 73
         Aufgabentypen bei 100 %. Ein reines Wahr-Feld käme auf 25 %, wäre dafür
         aber wie beschrieben ohne Wissen lösbar; die Ausgewogenheit der
         Bausteine wiegt schwerer.

         Alle vier Ablenker sind echte Fehlvorstellungen, keine zufälligen
         Buchstabenpaare: die Antwort auf die andere Frage (zwei Zeilen) und eine
         Gleichung, die in keiner Figur gilt (eine Zeile). */
      const WAHR_STRAHL = ['ZA : ZB = ZC : ZD', 'ZC : ZD = ZA : ZB', 'ZA : ZC = ZB : ZD', 'ZA : AB = ZC : CD'];
      const WAHR_PARALLEL = ['ZA : ZB = AC : BD', 'ZC : ZD = AC : BD', 'AC : BD = ZA : ZB', 'AC : BD = ZC : ZD'];
      /* Falsch in JEDER Figur, nicht nur in den meisten: Bei allen vieren steht auf
         einer Seite k und auf der anderen 1 : k, oder es sind Abschnitte beider
         Strahlen in einem Verhältnis gemischt. Formen wie „AB : CD = AC : BD“
         wären nur meistens falsch – sie stimmen, wenn ZA : ZC gerade 1 : k ist. */
      const FALSCH_STRAHL = [
        { f: 'ZA : ZB = ZD : ZC', g: 'Rechts steht der Kehrwert: Links wächst der Bruch vom Scheitel nach außen, rechts von außen zum Scheitel.' },
        { f: 'ZB : ZA = ZC : ZD', g: 'Links steht der Kehrwert. Beide Seiten müssen in derselben Richtung gemessen werden.' },
        { f: 'ZA : ZD = ZB : ZC', g: 'Hier ist auf jeder Seite ein Abschnitt des einen und einer des anderen Strahls gemischt. Verglichen werden aber Strahl mit Strahl.' },
        { f: 'ZA : AB = ZD : CD', g: 'Links steht ZA (ab dem Scheitel) über AB (dem Zwischenstück), rechts aber ZD über CD – ZD reicht schon bis zur zweiten Parallelen. Richtig wäre ZC : CD.' }
      ];
      const FALSCH_PARALLEL = [
        { f: 'ZA : ZB = BD : AC', g: 'Rechts steht der Kehrwert: Zur kürzeren Strahlenstrecke ZA gehört die kürzere Parallelstrecke AC, nicht die längere BD.' },
        { f: 'AC : BD = ZB : ZA', g: 'Links geht es von der kürzeren zur längeren Strecke, rechts umgekehrt. Eine der beiden Seiten ist der Kehrwert der anderen.' },
        { f: 'BD : AC = ZA : ZB', g: 'Auch hier zeigen die beiden Seiten in verschiedene Richtungen: links das größere durch das kleinere, rechts das kleinere durch das größere.' },
        { f: 'ZA : AB = AC : BD', g: 'Links steht das Zwischenstück AB statt ZB. Genau davor warnt der Achtungskasten: Mit AB gilt der 2. Strahlensatz nicht.' }
      ];
      /* Rückmeldung zu den wahren Zeilen des anderen Satzes: Sie stimmen, sind
         aber der andere Satz. Je Zeile ein eigener Satz, weil zwei davon im
         selben Feld stehen – ein gemeinsamer Grund unterschiede sie nicht. Die
         Texte `g` oben sind für den Lösungsweg und nennen teils die richtige
         Form („Richtig wäre ZC : CD“); nach dem ersten Fehlgriff darf das nicht
         stehen, daher eigene, kürzere Gründe. */
      const GRUND_ZEILE = {
        'ZA : ZB = ZC : ZD': 'Die Gleichung stimmt, ist aber der 1. Strahlensatz: Sie vergleicht nur Abschnitte auf den Strahlen.',
        'ZC : ZD = ZA : ZB': 'Die Gleichung stimmt, ist aber der 1. Strahlensatz mit getauschten Seiten – AC und BD kommen nicht vor.',
        'ZA : ZC = ZB : ZD': 'Die Gleichung stimmt, ist aber der 1. Strahlensatz mit getauschten mittleren Gliedern.',
        'ZA : AB = ZC : CD': 'Die Gleichung stimmt, ist aber der 1. Strahlensatz mit den Zwischenstücken AB und CD.',
        'ZA : ZB = AC : BD': 'Die Gleichung stimmt, ist aber der 2. Strahlensatz: Rechts stehen die Parallelstrecken AC und BD.',
        'ZC : ZD = AC : BD': 'Die Gleichung stimmt, ist aber der 2. Strahlensatz: Der zweite Strahl wird mit den Parallelstrecken verglichen.',
        'AC : BD = ZA : ZB': 'Die Gleichung stimmt, ist aber der 2. Strahlensatz mit getauschten Seiten: Links stehen die Parallelstrecken.',
        'AC : BD = ZC : ZD': 'Die Gleichung stimmt, ist aber der 2. Strahlensatz: Links stehen die Parallelstrecken, rechts der zweite Strahl.',
        'ZA : ZB = ZD : ZC': 'Links steht erst die innere Strecke ZA, dann die äußere ZB – rechts ist es umgekehrt.',
        'ZB : ZA = ZC : ZD': 'Links steht erst die äußere Strecke ZB, dann die innere ZA – rechts ist es umgekehrt.',
        'ZA : ZD = ZB : ZC': 'Links steht der innere Abschnitt ZA über dem äußeren ZD, rechts der äußere ZB über dem inneren ZC.',
        'ZA : AB = ZD : CD': 'Links reicht ZA nur bis zur ersten Parallelen, rechts reicht ZD bis zur zweiten – die Seiten passen nicht zusammen.',
        'ZA : ZB = BD : AC': 'Links steht die kürzere Strecke vorn, rechts die längere – eine Seite ist verkehrt herum.',
        'AC : BD = ZB : ZA': 'Links geht es von der kürzeren zur längeren Strecke, rechts umgekehrt – eine Seite ist verkehrt herum.',
        'BD : AC = ZA : ZB': 'Links geht es von der längeren zur kürzeren Strecke, rechts umgekehrt – eine Seite ist verkehrt herum.',
        'ZA : AB = AC : BD': 'Links steht das Zwischenstück AB. Mit dem Zwischenstück gilt der 2. Strahlensatz nicht.'
      };
      const zweiter = rnd(1, 2) === 1;
      const wahrGefragt = zweiter ? WAHR_PARALLEL : WAHR_STRAHL;
      const wahrAnderer = zweiter ? WAHR_STRAHL : WAHR_PARALLEL;
      const falschGefragt = zweiter ? FALSCH_PARALLEL : FALSCH_STRAHL;
      const loesung = choice(wahrGefragt);
      const daneben = choice(falschGefragt);
      const zweiAndere = shuffle(wahrAnderer).slice(0, 2);
      // Vier Ablenker für drei Plätze: der vierte ist Reserve und rückt nur nach,
      // wenn zwei Zeilen zusammenfielen – die Optionszahl bleibt so konstant vier.
      const ablenker = [...shuffle([daneben.f, ...zweiAndere]), shuffle(wahrAnderer)[0]];
      const mc = makeChoice(loesung, ablenker, ablenker.map(z => GRUND_ZEILE[z]));
      const formen = wahrGefragt.map(f => `&ensp;<span class="trenn">•</span>&ensp;${f}`).join('');
      return {
        q: `Zwei Strahlen aus Z werden von zwei Parallelen geschnitten (A, B auf dem einen Strahl, C, D auf dem anderen; AC parallel zu BD). Welche Gleichung ist der <strong>${zweiter ? 2 : 1}. Strahlensatz</strong>?`,
        type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
        answerText: loesung,
        solution: `${zweiter
          ? 'Der <strong>2. Strahlensatz</strong> setzt die Abschnitte auf den <em>Parallelen</em> ins Verhältnis zu den Abschnitten, die vom Scheitel Z aus gemessen werden. In ihm kommen AC und BD vor.'
          : 'Der <strong>1. Strahlensatz</strong> vergleicht nur Abschnitte auf den <em>Strahlen</em> – ab dem Scheitel Z oder als Zwischenstück zwischen den Parallelen. AC und BD kommen in ihm nicht vor.'}&ensp;<span class="trenn">•</span>&ensp;Richtig ist: <strong>${loesung}</strong>&ensp;<span class="trenn">•</span>&ensp;Beide Seiten einer Verhältnisgleichung darf man tauschen, die mittleren Glieder ebenso${zweiter ? ', und weil ZA : ZB = ZC : ZD gilt, darf links auch der zweite Strahl stehen' : ' – so entstehen die ersten drei der folgenden Zeilen. Die vierte ist keine Umstellung, sondern die eigene Form des 1. Satzes mit den Zwischenstücken AB und CD, wie sie im Kasten „Die beiden Strahlensätze“ steht'}. Diese vier Zeilen meinen dasselbe:${formen}&ensp;<span class="trenn">•</span>&ensp;Nicht gemeint ist <strong>${daneben.f}</strong>: ${daneben.g}&ensp;<span class="trenn">•</span>&ensp;Die beiden übrigen Gleichungen stimmen zwar, sind aber der <em>${zweiter ? 1 : 2}.</em> Strahlensatz.`
      };
    }
  };

  /* ---------- Trigonometrie ---------- */

  const RAD = Math.PI / 180;

  /**
   * Eingabe eines Seitenverhältnisses prüfen („a/c“).
   *
   * Groß-/Kleinschreibung, Leerzeichen und der Doppelpunkt als Bruchstrich sind
   * egal, und die ausgeschriebene Form „Gegenkathete/Hypotenuse“ gilt ebenso:
   * Geprüft werden soll, ob jemand das Verhältnis kennt, nicht, ob er es in
   * genau einer Schreibweise tippt.
   */
  function verhaeltnisCheck(oben, unten, obenName, untenName) {
    const norm = s => {
      s = String(s).toLowerCase().replace(/\s+/g, '');
      s = s.slice(s.lastIndexOf('=') + 1);   // „cos(β) = a/c“: wie Util.kern zählt, was hinter dem letzten „=“ steht
      return s.replace(/\.$/, '').replace(/[:÷]/g, '/');
    };
    const erlaubt = [`${oben}/${unten}`, `${obenName}/${untenName}`].map(norm);
    return s => erlaubt.includes(norm(s));
  }

  const trigonometrie = {
    id: 'trigonometrie',
    icon: 'sin',
    title: 'Trigonometrie',
    tagline: 'Sinus, Kosinus und Tangens im Dreieck',
    learn: `
      <h2>Sinus, Kosinus, Tangens</h2>
      <p>Im <strong>rechtwinkligen Dreieck</strong> verbinden die Winkelfunktionen einen Winkel α
      mit den Seitenverhältnissen. Vom Winkel α aus gesehen heißen die Seiten:
      <strong>Gegenkathete</strong> (gegenüber), <strong>Ankathete</strong> (anliegend) und
      <strong>Hypotenuse</strong> (gegenüber dem rechten Winkel).</p>
      <p>Jede Seite trägt den Buchstaben ihres Gegenwinkels: <strong>a</strong> liegt dem Winkel α
      gegenüber, <strong>b</strong> dem Winkel β, <strong>c</strong> dem rechten Winkel – c ist also die
      Hypotenuse. Die Buchstaben stehen fest, die Namen wechseln: Dieselbe Seite a ist von α aus die
      Gegenkathete, von β aus die Ankathete.</p>
      <div class="merkkasten"><span class="merk-title">Merke: GAGA-HühnerHof-AG</span>
        <ul>
          <li>sin(α) = <strong>G</strong>egenkathete / <strong>H</strong>ypotenuse</li>
          <li>cos(α) = <strong>A</strong>nkathete / <strong>H</strong>ypotenuse</li>
          <li>tan(α) = <strong>G</strong>egenkathete / <strong>A</strong>nkathete</li>
          <li>Oben GAGA, unten HHAG: Das vierte Paar A/G gehört zum Kotangens –
          in der Schule brauchst du die ersten drei.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Seite berechnen</span>
        <p>Hypotenuse c = 10 cm, α = 30°. Gegenkathete: a = c · sin(30°) = 10 · 0,5 = <strong>5 cm</strong></p>
      </div>
      <p>Winkel findet man mit den <strong>Umkehrfunktionen</strong> (sin⁻¹, cos⁻¹, tan⁻¹ auf dem
      Taschenrechner). <em>Taschenrechner auf „DEG“ (Grad) stellen!</em></p>
    `,
    gen(diff) {
      if (diff === 1) {
        // Die Aufgabe war eine Auswahl aus vier festen Seitenverhältnissen –
        // erst aus den Seitennamen (Gegenkathete 12, Hypotenuse 10, Ankathete 9
        // Zeichen: „nimm die längste Option“ traf sin(α) zu 100 %, „nimm die
        // kürzeste“ cos(α)), dann aus den gleich langen Buchstabenbrüchen
        // a/c, b/c, a/b, b/a. Auch das trägt noch: Weil die Optionsmenge in
        // jeder Ziehung dieselbe ist und zu einer Frage genau eine Antwort
        // gehört, trifft JEDE Vorschrift, die aus einer festen Liste einen
        // festen Eintrag greift, diese Frage zu 100 % – die längste, die
        // kürzeste, die alphabetisch erste. Gegen diese Familie hilft kein
        // anderer Zuschnitt der Optionen; sie verschwindet erst mit den
        // Optionen. Wer das Verhältnis selbst hinschreibt, muss es wissen.
        //
        // Die Buchstabenkonvention steht in der Frage, im Merkkasten der
        // Erklärseite und in der Illustration – ohne sie wäre die Aufgabe
        // nicht lösbar.
        const [winkel, gegen, an] = choice([['α', 'a', 'b'], ['β', 'b', 'a']]);
        const [fn, obenName, oben, untenName, unten] = choice([
          ['sin', 'Gegenkathete', gegen, 'Hypotenuse', 'c'],
          ['cos', 'Ankathete', an, 'Hypotenuse', 'c'],
          ['tan', 'Gegenkathete', gegen, 'Ankathete', an]
        ]);
        return {
          q: `Schreibe ${fn}(${winkel}) als Verhältnis zweier Seiten. <span class="hint">Jede Seite trägt den Buchstaben ihres Gegenwinkels: a liegt α gegenüber, b liegt β gegenüber, c dem rechten Winkel. Zwei Buchstaben mit Schrägstrich, z. B. c/b.</span>`,
          type: 'input', placeholder: 'z. B. c/b',
          check: verhaeltnisCheck(oben, unten, obenName, untenName),
          testAnswer: `${oben}/${unten}`, answerText: `${oben}/${unten}`,
          solution: `Merkspruch „GAGA-HühnerHof-AG“: sin = G/H, cos = A/H, tan = G/A.<br>` +
            `Vom Winkel ${winkel} aus gesehen ist ${gegen} die Gegenkathete und ${an} die Ankathete; ` +
            `c liegt dem rechten Winkel gegenüber und heißt von beiden Winkeln aus Hypotenuse.<br>` +
            `${fn}(${winkel}) = ${frac(obenName, untenName)} = ${frac(oben, unten)} – getippt <strong>${oben}/${unten}</strong>`
        };
      }
      if (diff === 2) {
        const alpha = rnd(20, 70), c = rnd(5, 20);
        const useSin = choice([true, false]);
        const w = useSin ? c * Math.sin(alpha * RAD) : c * Math.cos(alpha * RAD);
        const gerundet = Math.round(w * 10) / 10;
        const seite = useSin ? 'Gegenkathete a' : 'Ankathete b';
        const fn = useSin ? 'sin' : 'cos';
        // Wie auf der Erklärseite („h = 50 · tan(38°) ≈ 50 · 0,781 ≈ 39,1 m“):
        // Der Tabellenwert ist gerundet, also steht schon vor ihm „≈“. Nur
        // sin(30°) und cos(60°) sind genau 0,5 – dann wird nichts gerundet und
        // der Weg schreibt durchgehend „=“ („10 · sin(30°) = 10 · 0,5 = 5 cm“).
        const exakt = (useSin ? alpha : 90 - alpha) === 30;
        const z = exakt ? '=' : '≈';
        return {
          q: `Im rechtwinkligen Dreieck ist die Hypotenuse c = ${c} cm und α = ${alpha}°. Berechne die ${seite} (in cm). <span class="hint">Runde auf eine Dezimalstelle – Taschenrechner erlaubt!</span>`,
          type: 'input', placeholder: 'in cm',
          // Die angezeigte Antwort trägt dasselbe Zeichen wie der Weg – sonst
          // stünde „≈ 3 cm“ direkt neben „= 3 cm“.
          check: numCheck(w, 0.1), testAnswer: String(gerundet), answerText: `${exakt ? '' : '≈ '}${fmt(gerundet)} cm`,
          solution: `${fn}(α) = ${seite.split(' ')[0]} / Hypotenuse → umgestellt:<br>` +
            `${seite.split(' ')[1]} = c · ${fn}(${alpha}°) ${z} ${c} · ${fmt(Math.round(Math.sin((useSin ? alpha : 90 - alpha) * RAD) * 10000) / 10000)} ${z} ${fmt(gerundet)} cm`
        };
      }
      const useTan = choice([true, false]);
      if (useTan) {
        // a = b ergibt immer exakt 45° und war damit die mit Abstand häufigste
        // Antwort dieser Stufe (7,5 %, zweieinhalbmal so oft wie jede andere) –
        // ein Muster, das sich raten lässt, statt es zu rechnen.
        const a = rnd(3, 15);
        let b = rnd(3, 15);
        while (b === a) b = rnd(3, 15);
        const alpha = Math.atan(a / b) / RAD;
        const gerundet = Math.round(alpha);
        return {
          q: `Im rechtwinkligen Dreieck ist die Gegenkathete a = ${a} cm und die Ankathete b = ${b} cm. Berechne den Winkel α (in °). <span class="hint">Runde auf ganze Grad – Taschenrechner erlaubt!</span>`,
          type: 'input', placeholder: 'α in °',
          check: numCheck(alpha, 0.6), testAnswer: String(gerundet), answerText: `≈ ${gerundet}°`,
          // „= 0,267“ behauptete Gleichheit, wo gerundet wurde (4/15 = 0,2666…).
          solution: `tan(α) = a/b = ${a}/${b} ${a % b === 0 ? '=' : '≈'} ${fmt(Math.round(a / b * 1000) / 1000)}<br>` +
            `α = tan⁻¹(${fmt(Math.round(a / b * 1000) / 1000)}) ≈ ${gerundet}°`
        };
      }
      // Der Lösungsweg zeigt den auf drei Stellen gerundeten Quotienten. Liegt
      // der exakte Winkel knapp an einer halben Gradzahl, führt dieser gerundete
      // Wert auf eine andere ganze Gradzahl als die ausgewiesene Antwort – der
      // Weg widerspräche dann seinem eigenen Ergebnis. Solche Fälle überspringen.
      let c, a, alpha;
      do {
        c = rnd(8, 25); a = rnd(3, c - 2);
        alpha = Math.asin(a / c) / RAD;
      } while (Math.round(Math.asin(Math.round(a / c * 1000) / 1000) / RAD) !== Math.round(alpha));
      const gerundet = Math.round(alpha);
      return {
        q: `Im rechtwinkligen Dreieck ist die Hypotenuse c = ${c} cm und die Gegenkathete a = ${a} cm. Berechne den Winkel α (in °). <span class="hint">Runde auf ganze Grad – Taschenrechner erlaubt!</span>`,
        type: 'input', placeholder: 'α in °',
        check: numCheck(alpha, 0.6), testAnswer: String(gerundet), answerText: `≈ ${gerundet}°`,
        solution: `sin(α) = a/c = ${a}/${c} ${a % c === 0 || (a / c * 1000) % 1 === 0 ? '=' : '≈'} ${fmt(Math.round(a / c * 1000) / 1000)}<br>` +
          `α = sin⁻¹(${fmt(Math.round(a / c * 1000) / 1000)}) ≈ ${gerundet}°`
      };
    }
  };

  /* ---------- Statistik & Daten ---------- */

  const statistik = {
    id: 'statistik',
    icon: 'x̄',
    title: 'Statistik & Daten',
    tagline: 'Mittelwert, Median und Spannweite',
    learn: `
      <h2>Daten auswerten</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Die drei wichtigsten Kennwerte</span>
        <ul>
          <li><strong>Mittelwert (Durchschnitt):</strong> alle Werte addieren, durch die Anzahl teilen.</li>
          <li><strong>Median (Zentralwert):</strong> Werte sortieren – der Wert genau in der Mitte.</li>
          <li><strong>Spannweite:</strong> größter Wert minus kleinster Wert.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>Daten: 3, 8, 5, 10, 4<br>
        Mittelwert: (3+8+5+10+4) : 5 = 30 : 5 = <strong>6</strong><br>
        Sortiert: 3, 4, <u>5</u>, 8, 10 → Median = <strong>5</strong>&ensp;<span class="trenn">•</span>&ensp;Spannweite: 10 − 3 = <strong>7</strong></p>
      </div>
      <p>Der Median ist <strong>robuster gegen Ausreißer</strong> als der Mittelwert –
      ein einzelner Extremwert verändert ihn kaum.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const n = choice([4, 5]);
        let werte, mean;
        for (let t = 0; t < 60; t++) {
          mean = rnd(8, 25);
          werte = [];
          for (let i = 0; i < n - 1; i++) werte.push(rnd(Math.max(1, mean - 7), mean + 7));
          const letzter = n * mean - werte.reduce((s, w) => s + w, 0);
          if (letzter >= 1 && letzter <= mean + 12) { werte.push(letzter); break; }
          werte = null;
        }
        if (!werte) { werte = [4, 6, 8, 10]; mean = 7; }
        return {
          q: `Berechne den Mittelwert der Daten: ${werte.join(', ')}`,
          type: 'input', placeholder: 'Mittelwert',
          check: numCheck(mean), testAnswer: String(mean), answerText: `${mean}`,
          solution: `Summe: ${werte.join(' + ')} = ${werte.reduce((s, w) => s + w, 0)}<br>` +
            `Mittelwert: ${werte.reduce((s, w) => s + w, 0)} : ${werte.length} = ${mean}`
        };
      }
      if (diff === 2) {
        const kind = choice(['median', 'spannweite']);
        const n = choice([5, 7]);
        const werte = [];
        for (let i = 0; i < n; i++) werte.push(rnd(2, 40));
        const sortiert = werte.slice().sort((a, b) => a - b);
        if (kind === 'median') {
          const med = sortiert[(n - 1) / 2];
          return {
            q: `Bestimme den Median der Daten: ${werte.join(', ')}`,
            type: 'input', placeholder: 'Median',
            check: numCheck(med), testAnswer: String(med), answerText: `${med}`,
            solution: `Zuerst sortieren: ${sortiert.join(', ')}<br>` +
              `Der Wert in der Mitte (Position ${(n + 1) / 2} von ${n}) ist der Median: ${med}`
          };
        }
        const spann = sortiert[n - 1] - sortiert[0];
        return {
          q: `Bestimme die Spannweite der Daten: ${werte.join(', ')}`,
          type: 'input', placeholder: 'Spannweite',
          check: numCheck(spann), testAnswer: String(spann), answerText: `${spann}`,
          solution: `Größter Wert: ${sortiert[n - 1]}, kleinster Wert: ${sortiert[0]}.<br>` +
            `Spannweite: ${sortiert[n - 1]} − ${sortiert[0]} = ${spann}`
        };
      }
      const n = choice([3, 4]);
      const mean = rnd(8, 15);
      const bekannt = [];
      for (let i = 0; i < n; i++) bekannt.push(rnd(Math.max(2, mean - 5), mean + 5));
      const gesucht = (n + 1) * mean - bekannt.reduce((s, w) => s + w, 0);
      if (gesucht < 0 || gesucht > 30) {
        // saubere Standardaufgabe als Rückfall
        return this.gen(diff);
      }
      return {
        q: `Nach ${n + 1} Tests hat Mia im Schnitt genau ${mean} Punkte. In den ersten ${n} Tests hatte sie ${bekannt.join(', ')} Punkte. Wie viele Punkte hatte sie im letzten Test?`,
        type: 'input', placeholder: 'Punkte',
        check: numCheck(gesucht), testAnswer: String(gesucht),
        answerText: `${gesucht} ${plural(gesucht, 'Punkt', 'Punkte')}`,
        solution: `Gesamtsumme bei Schnitt ${mean}: ${n + 1} · ${mean} = ${(n + 1) * mean} Punkte.<br>` +
          `Bisher: ${bekannt.join(' + ')} = ${bekannt.reduce((s, w) => s + w, 0)} Punkte.<br>` +
          `Letzter Test: ${(n + 1) * mean} − ${bekannt.reduce((s, w) => s + w, 0)} = ${gesucht} ${plural(gesucht, 'Punkt', 'Punkte')}`
      };
    }
  };

  /* ---------- Wahrscheinlichkeit ---------- */

  function probAufgabe(qText, num, den, solText) {
    const [rn, rd] = reduce(num, den);
    const bsp = beispielBruch(num, den);
    return {
      // Das Beispiel darf nie die Lösung sein – sonst ist der graue Platzhalter die Antwort.
      q: `${qText} <span class="hint">Als Bruch, z. B. ${bsp} – oder auf 3 Dezimalstellen gerundet.</span>`,
      type: 'input', placeholder: `z. B. ${bsp}`,
      check: probCheck(num, den), testAnswer: `${rn}/${rd}`,
      answerText: fracHTML(rn, rd),
      solution: solText
    };
  }

  /** Laplace-Bruch wie auf der Erklärseite („P(gerade) = 3/6 = 1/2“): erst
      günstige durch mögliche Ergebnisse, dann gekürzt. Die Kürzung steht nur
      da, wenn es etwas zu kürzen gibt – sonst hieße es „7/10 = 7/10“. */
  function laplaceBruch(num, den) {
    const [rn, rd] = reduce(num, den);
    return rn === num ? fracHTML(num, den) : `${fracHTML(num, den)} = ${fracHTML(rn, rd)}`;
  }

  const wahrscheinlichkeit = {
    id: 'wahrscheinlichkeit',
    icon: 'P(A)',
    title: 'Wahrscheinlichkeit',
    tagline: 'Vom Würfel bis zum Baumdiagramm',
    learn: `
      <h2>Wahrscheinlichkeiten berechnen</h2>
      <p>Wenn alle Ergebnisse gleich wahrscheinlich sind (<strong>Laplace-Experiment</strong>,
      z. B. Würfel oder Münze), gilt:</p>
      <div class="merkkasten"><span class="merk-title">Merke: Laplace-Formel</span>
        <p><span class="formula">P(E) = günstige Ergebnisse ⁄ mögliche Ergebnisse</span></p>
        <p>P liegt immer zwischen 0 (unmöglich) und 1 (sicher).</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>P(gerade Zahl beim Würfeln) = ${frac(3, 6)} = ${frac(1, 2)}, denn 2, 4, 6 sind günstig.</p>
      </div>
      <h3>Mehrstufige Experimente</h3>
      <p>Bei mehreren Stufen (z. B. zweimal würfeln) werden die Wahrscheinlichkeiten
      <strong>entlang des Pfades multipliziert</strong>:</p>
      <p>P(zwei Sechsen) = ${frac(1, 6)} · ${frac(1, 6)} = ${frac(1, 36)}</p>
      <p><em>Gegenereignis-Trick:</em> P(mindestens einmal …) = 1 − P(kein einziges Mal …)</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const variante = choice(['gerade', 'sechs', 'mind5', 'keine6']);
        if (variante === 'gerade') {
          return probAufgabe('Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine gerade Zahl?', 3, 6,
            `Günstig sind 2, 4 und 6 – also 3 von 6 Ergebnissen.<br>P = ${frac(3, 6)} = ${frac(1, 2)}`);
        }
        if (variante === 'sechs') {
          return probAufgabe('Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine 6?', 1, 6,
            `Genau 1 von 6 gleich wahrscheinlichen Ergebnissen ist günstig.<br>P = ${frac(1, 6)}`);
        }
        if (variante === 'mind5') {
          // „mindestens eine 5“ liest die Erklärseite als Anzahl (wenigstens
          // einmal eine 5, über das Gegenereignis) – gemeint ist hier aber die
          // Augenzahl. Deshalb dieselbe Schreibweise wie im Beispiel der Seite,
          // „P(mindestens 5)“, und der Unterschied steht im Lösungsweg.
          return probAufgabe('Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine Augenzahl von mindestens 5?', 2, 6,
            `„Mindestens 5“ heißt: Die Augenzahl ist 5 oder größer – günstig sind also 5 und 6, 2 von 6 Ergebnissen.<br>P(mindestens 5) = ${frac(2, 6)} = ${frac(1, 3)}<br>Nicht verwechseln mit „mindestens eine 6“ bei mehreren Würfen: Dort zählt, wie oft die 6 fällt.`);
        }
        return probAufgabe('Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit, KEINE 6 zu würfeln?', 5, 6,
          `Günstig sind 1, 2, 3, 4, 5 – also 5 von 6.<br>P = ${frac(5, 6)}`);
      }
      if (diff === 2) {
        // Stufe 2 stellte bis hierher dieselben einstufigen Abzählaufgaben wie
        // Stufe 1 (Urne ziehen, Glücksrad drehen) – nur mit anderen Zahlen. Wer
        // von „Leicht“ auf „Mittel“ wechselte, bekam die Aufgabe von vorhin.
        // Jetzt kommt hier je ein echter Schritt dazu: Gegenereignis, Summenregel
        // für unvereinbare Ereignisse, zweistufiges Ziehen mit Zurücklegen.
        const kind = choice(['gegen', 'oder', 'zweimal']);
        const rot = rnd(2, 6), blau = rnd(2, 6), gruen = rnd(2, 6);
        const ges = rot + blau + gruen;

        if (kind === 'gegen') {
          return probAufgabe(
            `In einer Urne liegen ${rot} rote, ${blau} blaue und ${gruen} grüne Kugeln. Du ziehst eine Kugel. Wie groß ist die Wahrscheinlichkeit, <strong>keine rote</strong> zu ziehen?`,
            ges - rot, ges,
            `Über das Gegenereignis: P(rot) = ${laplaceBruch(rot, ges)}, also<br>` +
            `P(nicht rot) = 1 − ${fracHTML(...reduce(rot, ges))} = ${fracHTML(...reduce(ges - rot, ges))}<br>` +
            `Zur Kontrolle direkt abgezählt: ${blau} blaue + ${gruen} grüne = ${ges - rot} günstige von ${ges} Kugeln ✓`
          );
        }

        if (kind === 'oder') {
          /* Die Spanne bis felder/3 war zu eng: Bei 10 Feldern konnte die Summe
             nur 4, 5 oder 6 sein – und 5 von 10 ist ½. Über alle Feldzahlen war
             die Antwort deshalb in 30 % der Ziehungen ½. Bis felder/2 − 1 bleibt
             immer ein weißer Rest, die Summen streuen aber über die doppelte
             Breite. */
          const felder = choice([10, 12, 16, 20]);
          const grenze = Math.floor(felder / 2) - 1;
          const rotF = rnd(2, grenze);
          const blauF = rnd(2, grenze);
          return probAufgabe(
            `Ein Glücksrad hat ${felder} gleich große Felder: ${rotF} rote, ${blauF} blaue, der Rest weiß. Wie groß ist die Wahrscheinlichkeit, <strong>rot oder blau</strong> zu treffen?`,
            rotF + blauF, felder,
            `Rot und blau können nicht gleichzeitig eintreten – solche Ereignisse heißen unvereinbar, ` +
            `und dann darf man ihre Wahrscheinlichkeiten addieren:<br>` +
            `P(rot oder blau) = ${fracHTML(rotF, felder)} + ${fracHTML(blauF, felder)} = ${laplaceBruch(rotF + blauF, felder)}<br>` +
            `<em>Vorsicht:</em> Addieren ist nur erlaubt, weil kein Feld beide Farben trägt.`
          );
        }

        /* Erst das Verhältnis ziehen, dann die Kugelzahlen dazu. Zieht man rot
           und blau unabhängig aus 2..6, liegt rot = blau auf der Diagonalen –
           in 20 % der Ziehungen, und dann ist die Antwort ausnahmslos ¼. Wer
           blind ¼ tippte, lag jedes fünfte Mal richtig, ohne je zu rechnen.
           Jetzt ist jedes vorkommende Verhältnis gleich wahrscheinlich. */
        const nachVerhaeltnis = new Map();
        for (let r = 2; r <= 9; r++)
          for (let b = 2; b <= 9; b++) {
            const schluessel = reduce(r, r + b).join('/');
            if (!nachVerhaeltnis.has(schluessel)) nachVerhaeltnis.set(schluessel, []);
            nachVerhaeltnis.get(schluessel).push([r, b]);
          }
        const [zRot, zBlau] = choice(choice([...nachVerhaeltnis.values()]));
        return probAufgabe(
          `In einer Urne liegen ${zRot} rote und ${zBlau} blaue Kugeln. Du ziehst zweimal <strong>mit Zurücklegen</strong>. Wie groß ist die Wahrscheinlichkeit für zweimal Rot?`,
          zRot * zRot, (zRot + zBlau) * (zRot + zBlau),
          // Die Gesamtzahl gehört in den Weg: Wer rot durch blau teilt (8/4 statt
          // 8/12), findet sonst nirgends den Nenner, den die Seite verlangt.
          `In der Urne liegen ${zRot} + ${zBlau} = ${zRot + zBlau} Kugeln, davon ${zRot} rote: P(rot) = ${laplaceBruch(zRot, zRot + zBlau)}.<br>` +
          `Mit Zurücklegen ändert sich zwischen den Zügen nichts – beide Male ${fracHTML(...reduce(zRot, zRot + zBlau))}.<br>` +
          `Entlang eines Pfades wird multipliziert:<br>` +
          `P = ${fracHTML(...reduce(zRot, zRot + zBlau))} · ${fracHTML(...reduce(zRot, zRot + zBlau))} = ${fracHTML(...reduce(zRot * zRot, (zRot + zBlau) * (zRot + zBlau)))}<br>` +
          `<em>Nicht addieren:</em> ${fracHTML(...reduce(zRot, zRot + zBlau))} + ${fracHTML(...reduce(zRot, zRot + zBlau))} wäre größer als das einfache Ziehen – zwei Treffer sind aber seltener, nicht häufiger.`
        );
      }
      const variante = choice(['zweiSechsen', 'muenze3', 'pfad']);
      if (variante === 'zweiSechsen') {
        return probAufgabe('Du würfelst zweimal. Wie groß ist die Wahrscheinlichkeit für zwei Sechsen?', 1, 36,
          `Pfadregel – entlang des Pfades multiplizieren:<br>P = ${frac(1, 6)} · ${frac(1, 6)} = ${frac(1, 36)}`);
      }
      if (variante === 'muenze3') {
        return probAufgabe('Du wirfst dreimal eine Münze. Wie groß ist die Wahrscheinlichkeit für dreimal Kopf?', 1, 8,
          `Jeder Wurf: P(Kopf) = ${frac(1, 2)}. Pfadregel:<br>P = ${frac(1, 2)} · ${frac(1, 2)} · ${frac(1, 2)} = ${frac(1, 8)}`);
      }
      return probAufgabe('Du würfelst zweimal. Wie groß ist die Wahrscheinlichkeit, erst eine 6 und dann eine gerade Zahl zu würfeln?', 1, 12,
        `Pfadregel: P(6) · P(gerade) = ${frac(1, 6)} · ${frac(1, 2)} = ${frac(1, 12)}`);
    }
  };

  /* ---------- Quadratische Funktionen ---------- */

  /** „ + 5“ bzw. „ − 5“; bei 0 bleibt nichts übrig („x² + 6x − 0“). */
  function summand(n) { return n === 0 ? '' : ` ${n > 0 ? '+' : '−'} ${fmt(Math.abs(n))}`; }

  /** „(x − 3)“ bzw. „(x + 3)“; d = 0 ergibt schlicht „x“. */
  function xMinus(d) {
    if (d === 0) return 'x';
    return `(x ${d > 0 ? '−' : '+'} ${fmt(Math.abs(d))})`;
  }

  /** Scheitelform „a(x − d)² + e“ mit allen Sonderfällen (a = 1, a = −1, e = 0). */
  function scheitelForm(a, d, e) {
    const kern = `${koef(a, `${xMinus(d)}²`)}`;
    if (e === 0) return kern;
    return `${kern} ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))}`;
  }

  const quadfunktion = {
    id: 'quadfunktion',
    icon: 'S(d|e)',
    title: 'Quadratische Funktionen',
    tagline: 'Parabeln, Scheitelpunkt und Verschiebungen',
    learn: `
      <h2>Quadratische Funktionen und ihre Parabeln</h2>
      <p>Der Graph von f(x) = x² ist die <strong>Normalparabel</strong>. Aus ihr entsteht jede andere
      Parabel durch Verschieben, Strecken und Spiegeln.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Scheitelpunktform</span>
        <p><span class="formula">f(x) = a · (x − d)² + e</span></p>
        <p>Der Scheitel liegt bei <strong>S(d | e)</strong>. a &gt; 0 öffnet nach oben, a &lt; 0 nach unten;
        |a| &gt; 1 macht die Parabel enger, |a| &lt; 1 weiter.</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>f(x) = 2(x − 3)² − 5 → Scheitel S(3 | −5), nach oben geöffnet, enger als die Normalparabel.</p>
      </div>
    `,
    gen(diff) {
      /* ---------- Stufe 1: Die Scheitelform lesen ---------- */
      if (diff === 1) {
        const kind = choice(['scheitel', 'form', 'wert']);
        // Für die Formfrage ist |a| = 1 ausgeschlossen: Die Parabel wäre dann
        // weder enger noch weiter, sondern genau die Normalparabel – keine der
        // vier Antwortmöglichkeiten träfe zu.
        // Je acht Faktoren über und unter 1, je zur Hälfte positiv und negativ –
        // damit alle vier Antworten gleich oft vorkommen. Vor allem aber trägt
        // JEDER Faktor ein Komma: Mit ganzen Zahlen für „enger“ genügte der Blick
        // auf das Komma, „0,5“ war zu 100 % „weiter“ und „2“ zu 100 % „enger“.
        // Der Vergleich mit 1, um den die Aufgabe geht, musste nie angestellt
        // werden. Mit 1,5 und 2,5 trennt das Komma nichts mehr (gemessen 49,9 %).
        // Ebenso ausgeglichen ist die Zahl der Nachkommastellen: 1,5 und 2,5
        // gegen 0,5 und 0,2, 1,25 und 1,75 gegen 0,25 und 0,75 – sonst wäre sie
        // das nächste Merkmal.
        const a = kind === 'form'
          ? choice([1.5, -1.5, 2.5, -2.5, 1.25, -1.25, 1.75, -1.75,
                    0.5, -0.5, 0.2, -0.2, 0.25, -0.25, 0.75, -0.75])
          : choice([1, -1, 2, -2, 3, 0.5, -0.5]);
        const d = rndNonZero(-6, 6), e = rndNonZero(-8, 8);

        if (kind === 'scheitel') {
          return {
            q: `Lies den Scheitelpunkt ab: f(x) = ${scheitelForm(a, d, e)} <span class="hint">Gib x und y an – z. B. „3; −5“.</span>`,
            type: 'input', placeholder: 'x; y',
            check: orderedCheck([d, e]), testAnswer: `${d}; ${e}`,
            answerText: `S(${fmt(d)} | ${fmt(e)})`,
            solution: `In der Scheitelform f(x) = a · (x − d)² + e steht der Scheitel direkt da: <strong>S(d | e)</strong>.<br>` +
              `Hier ist ${xMinus(d)}², also d = ${fmt(d)} – <em>das Vorzeichen dreht sich</em>, weil in der Formel ein Minus steht.<br>` +
              `Der Summand am Ende ist e = ${fmt(e)}.<br>` +
              `Scheitel: <strong>S(${fmt(d)} | ${fmt(e)})</strong><br>` +
              // Bei a = 1 steht in der Aufgabe kein Faktor – dann auch nicht in
              // der Probe („1 · 0²“ wäre ein leerer Schritt). Bei a = −1 bleibt
              // er: Dort macht er das Minus vor dem Quadrat sichtbar.
              `Probe: f(${fmt(d)}) = ${a === 1 ? '' : `${fmt(a)} · `}0² ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))} = ${fmt(e)} ✓ – an der Scheitelstelle wird die Klammer null.`
          };
        }

        if (kind === 'form') {
          const richtung = a > 0 ? 'nach oben' : 'nach unten';
          const weite = Math.abs(a) > 1 ? 'enger' : 'weiter';
          const richtig = `${richtung} geöffnet, ${weite} als die Normalparabel`;
          const alle = [];
          for (const r of ['nach oben', 'nach unten']) for (const wt of ['enger', 'weiter']) {
            alle.push(`${r} geöffnet, ${wt} als die Normalparabel`);
          }
          /* Ist nur eines der beiden Merkmale falsch, wird es genannt. Die Option
             mit beiden falsch bleibt ohne Grund: Das sind zwei Fehler, und
             „beides passt nicht“ gäbe die Lösung vollständig preis. */
          const grund = x => {
            const r = x.startsWith(richtung), w = x.includes(weite);
            if (!r && w) return `Die Öffnung passt nicht zum Vorzeichen von a = ${fmt(a)}.`;
            if (r && !w) return `Die Weite passt nicht zu |a| = ${fmt(Math.abs(a))} – entscheidend ist, ob |a| größer oder kleiner als 1 ist.`;
            return null;
          };
          const ablenker = alle.filter(x => x !== richtig);
          const mc = makeChoice(richtig, ablenker, ablenker.map(grund));
          return {
            q: `Wie sieht die Parabel zu f(x) = ${scheitelForm(a, d, e)} aus?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `Nur der Faktor vor der Klammer entscheidet darüber – Verschiebungen ändern die Form nicht.<br>` +
              `a = ${fmt(a)} ist ${a > 0 ? 'positiv' : 'negativ'} → ${richtung} geöffnet.<br>` +
              `|a| = ${fmt(Math.abs(a))} ist ${Math.abs(a) > 1 ? 'größer' : 'kleiner'} als 1 → die Parabel ist ${weite} als die Normalparabel.<br>` +
              `<em>Merkhilfe:</em> a streckt in y-Richtung. Ein großes a zieht die Parabel in die Höhe und damit schmaler.`
          };
        }

        // wert: Funktionswert aus der Scheitelform
        const x0 = d + choice([-3, -2, -1, 1, 2, 3]);
        const res = a * (x0 - d) * (x0 - d) + e;
        return {
          q: `Berechne f(${fmt(x0)}) für f(x) = ${scheitelForm(a, d, e)}.`,
          type: 'input', placeholder: 'f(' + fmt(x0) + ')',
          check: numCheck(res), testAnswer: String(res), answerText: `f(${fmt(x0)}) = ${fmt(res)}`,
          solution: `Von innen nach außen einsetzen:<br>` +
            `Klammer: ${fmt(x0)} ${d > 0 ? '−' : '+'} ${fmt(Math.abs(d))} = ${fmt(x0 - d)}<br>` +
            `Quadrieren: ${par(x0 - d)}² = ${fmt((x0 - d) * (x0 - d))}<br>` +
            // Bei a = 1 gibt es nichts zu multiplizieren: „Mal 1“ und der Satz
            // „dann mit a multiplizieren“ liefen ins Leere, weil in der Aufgabe
            // gar kein a steht.
            (a === 1
              ? `${e > 0 ? 'Plus' : 'Minus'} ${fmt(Math.abs(e))}: ${fmt((x0 - d) * (x0 - d))} ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))} = <strong>${fmt(res)}</strong>`
              : `Mal ${fmt(a)} und ${e > 0 ? 'plus' : 'minus'} ${fmt(Math.abs(e))}: ${fmt(a)} · ${fmt((x0 - d) * (x0 - d))} ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))} = <strong>${fmt(res)}</strong><br>` +
                `<em>Erst quadrieren, dann mit a multiplizieren</em> – die Reihenfolge steckt in der Klammer.`)
        };
      }

      /* ---------- Stufe 2: Verschiebung, a bestimmen, Nullstellen ---------- */
      if (diff === 2) {
        const kind = choice(['verschiebung', 'faktor', 'nullstellen']);

        if (kind === 'verschiebung') {
          // Bis hierher lautete die Frage „Wie entsteht der Graph von
          // f(x) = (x + 5)² + 2 aus der Normalparabel y = x²?" – und genau
          // darin lag der Fehler. Geht man von der Normalparabel aus, IST die
          // Verschiebung nichts anderes als das Vorzeichenpaar der Gleichung:
          // Zu „(x + …)²“ gehört immer „nach links“, zu „+ …“ immer „nach
          // oben". Wer den Aufgabentyp an seiner Oberfläche wiedererkennt,
          // kennt damit schon die Antwort, ohne eine einzige Zahl gelesen zu
          // haben. Gemessen wurde das an der Länge der Optionen („links“ ist
          // kürzer als „rechts“, „oben“ kürzer als „unten“): innerhalb eines
          // Vorzeichenmusters traf die kürzeste bzw. die längste Option zu
          // 100 %. Über alle Vorzeichenmuster gemittelt sind es die üblichen
          // 25 % – dieser Mittelwert verdeckt das Muster aber nur, denn vor
          // dem Lernenden steht immer ein konkretes Vorzeichen, nie der
          // Durchschnitt.
          //
          // Andere Ablenker helfen nicht: Vier Richtungspaare sind die
          // vollständige Antwortliste, mehr gibt es nicht. Repariert ist der
          // Typ nur dadurch, dass die Richtung nicht länger am Vorzeichen
          // hängt. Verschoben wird jetzt von einer beliebigen Parabel aus, und
          // wohin es geht, entscheidet der Vergleich der beiden
          // Scheitelstellen – also gerade die Zahlen, die das Oberflächenmuster
          // maskiert. Die Vorzeichenfalle bleibt dabei erhalten und wird sogar
          // schärfer: Wer die Scheitelstelle von f falsch abliest, bekommt
          // nicht nur die falsche Richtung, sondern auch die falsche Weite.
          //
          // Was bleibt – und bleiben muss: Steht in der Klammer ein Minus, ist
          // die gedruckte Zahl selbst schon die Scheitelstelle. Wer sie dort
          // ohne Vorzeichenwechsel übernimmt, rechnet richtig (gemessen 100 %
          // in diesem Vorzeichenmuster, 50 % im anderen). Das ist keine
          // Abkürzung an der Aufgabe vorbei, sondern die Notation selbst:
          // (x − 3)² hat seinen Scheitel nun einmal bei x = 3. Und blind ist
          // diese Leseweise ohnehin nicht – sie liest beide Zahlen, bildet die
          // Differenz und übersetzt deren Vorzeichen in ein Richtungswort.
          //
          // Der Betrag der Scheitelstelle ist bewusst größer als die halbe
          // waagerechte Verschiebung (|d1| ≥ 2, |vx| ≤ 3). Damit wird der
          // typische Fehler – die Zahl in der Klammer mit dem dort gedruckten
          // Vorzeichen zu übernehmen – zum reinen Münzwurf: Er liefert dann
          // immer die Richtung, in der die Scheitelstelle selbst liegt, und
          // trifft die wirkliche Verschiebungsrichtung genau in der Hälfte der
          // Fälle. Ohne diese Kopplung käme er auf 62,5 % (abgezählt über alle
          // Parameterpaare) – die Aufgabe wäre dann ausgerechnet für den
          // überdurchschnittlich oft lösbar, der die Vorzeichenregel nicht kann.
          const d1 = choice([-5, -4, -3, -2, 2, 3, 4, 5]), e1 = rndNonZero(-5, 5);
          // Erst die Verschiebung ziehen, dann daraus den Zielscheitel – nicht
          // umgekehrt. Zöge man das Ziel unabhängig, wäre die Richtung schief
          // verteilt: Steht in der Klammer ein Minus, ist die Scheitelstelle
          // von f positiv, und ein symmetrisch gezogenes Ziel läge dann meist
          // links davon – „nach links“ käme in diesem Vorzeichenmuster auf
          // 77,8 %. So dagegen ist jede der vier Richtungen in jedem Muster
          // gleich wahrscheinlich (gemessen 24,8 bis 27,5 %).
          const vx = rndNonZero(-3, 3), vy = rndNonZero(-6, 6);
          const d2 = d1 + vx, e2 = e1 + vy;
          const wo = vx > 0 ? 'rechts' : 'links';
          const hoch = vy > 0 ? 'oben' : 'unten';
          const wie = (w, h) => `${fmt(Math.abs(vx))} nach ${w}, ${fmt(Math.abs(vy))} nach ${h}`;
          const richtig = wie(wo, hoch);
          // Alle vier Richtungspaare tragen dieselben zwei Zahlen an denselben
          // Stellen – die Optionen unterscheiden sich ausschließlich in den
          // Richtungswörtern. Damit greift keine Zahlenregel (jede Option
          // beginnt mit derselben Zahl), und weil sich die Wörter
          // unterscheiden, kann makeChoice keinen Ablenker verwerfen: Die
          // Auswahl hat immer genau vier Optionen, ganz ohne Reserve.
          const alle = [];
          for (const w of ['rechts', 'links']) for (const h of ['oben', 'unten']) alle.push(wie(w, h));
          /* Gründe als Gegenprobe: Die falsche Richtung führt vom Startscheitel
             nicht zum Ziel. Sind beide Richtungen verkehrt, bleibt die Option
             ohne Grund – die Umkehr beider Merkmale wäre schon die Lösung
             (wie bei der Formfrage auf Stufe 1). */
          const grund = x => {
            const w = x.includes('rechts') ? 'rechts' : 'links', h = x.includes('oben') ? 'oben' : 'unten';
            if (w !== wo && h !== hoch) return null;
            if (w !== wo) return `Waagerecht passt das nicht: ${fmt(Math.abs(vx))} nach ${w} führt von x = ${fmt(d1)} auf x = ${fmt(d1 - vx)}, nicht auf x = ${fmt(d2)}.`;
            if (h !== hoch) return `Senkrecht passt das nicht: ${fmt(Math.abs(vy))} nach ${h} führt von y = ${fmt(e1)} auf y = ${fmt(e1 - vy)}, nicht auf y = ${fmt(e2)}.`;
            return null;
          };
          const ablenker = alle.filter(x => x !== richtig);
          const mc = makeChoice(richtig, ablenker, ablenker.map(grund));
          return {
            // Die Richtungswörter dürfen in der Frage nicht vorkommen – sonst
            // zeigt die Regel „Wort aus der Frage“ auf eine der Optionen.
            q: `Der Graph von f(x) = ${scheitelForm(1, d1, e1)} wird verschoben. Danach liegt der Scheitel bei S(${fmt(d2)} | ${fmt(e2)}). Wie wurde verschoben?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `Zuerst den Scheitel von f ablesen: ${xMinus(d1)} wird null für x = ${fmt(d1)} – <em>das Vorzeichen in der Klammer dreht sich um</em>. Der Summand am Ende wird unverändert übernommen, also S(${fmt(d1)} | ${fmt(e1)}).<br>` +
              `Eine Verschiebung ist <strong>Ziel minus Start</strong>:<br>` +
              // Kein Pfeil zwischen Differenz und Richtung: Bei positiver
              // Differenz stünde dort „= 3 → 3 nach rechts“ – dieselbe Zahl
              // zweimal um ein Rechenzeichen herum, was der Sprachscan zu
              // Recht als leeren Schritt meldet. Mit „also“ ist der Schritt
              // als Übersetzung lesbar: Vorzeichen wird Richtungswort.
              `waagerecht: ${fmt(d2)} − ${par(d1)} = ${fmt(vx)}, also ${fmt(Math.abs(vx))} nach ${wo}<br>` +
              `senkrecht: ${fmt(e2)} − ${par(e1)} = ${fmt(vy)}, also ${fmt(Math.abs(vy))} nach ${hoch}<br>` +
              `Ergebnis: <strong>${richtig}</strong><br>` +
              `<em>Probe:</em> Von ${fmt(d1)} aus ${fmt(Math.abs(vx))} nach ${wo} führt auf ${fmt(d2)} ✓, von ${fmt(e1)} aus ${fmt(Math.abs(vy))} nach ${hoch} auf ${fmt(e2)} ✓<br>` +
              // Die Gegenprobe wird ausgerechnet, nicht behauptet: Weil
              // |2 · d1| immer größer ist als |vx| (siehe oben), zeigt die
              // falsch gelesene Verschiebung stets in die Richtung, in der
              // die Scheitelstelle selbst liegt – mal dieselbe wie die
              // richtige, mal die entgegengesetzte. Beides muss dastehen,
              // sonst behauptet der Satz in der Hälfte der Ziehungen etwas
              // Falsches.
              `<strong>Die Falle:</strong> Die Zahl in der Klammer ist noch nicht die Scheitelstelle. Wer bei ${xMinus(d1)}² auf ${fmt(-d1)} statt auf ${fmt(d1)} tippt, kommt auf ${fmt(Math.abs(vx + 2 * d1))} nach ${d1 > 0 ? 'rechts' : 'links'} – ${(d1 > 0) === (vx > 0) ? 'die Richtung stimmt zufällig, die Weite nicht' : 'falsche Richtung und falsche Weite'}.`
          };
        }

        if (kind === 'faktor') {
          const d = rndNonZero(-4, 4), e = rndNonZero(-6, 6);
          const a = choice([2, 3, -2, -3, 0.5, -0.5]);
          const dx = choice([2, -2, 4, -4]);
          const x1 = d + dx, y1 = a * dx * dx + e;
          return {
            q: `Eine Parabel hat den Scheitel S(${fmt(d)} | ${fmt(e)}) und verläuft durch P(${fmt(x1)} | ${fmt(y1)}). Wie groß ist a?`,
            type: 'input', placeholder: 'a',
            check: numCheck(a), testAnswer: String(a), answerText: `a = ${fmt(a)}`,
            solution: `Ansatz mit der Scheitelform: f(x) = a · ${xMinus(d)}² ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))}<br>` +
              `Punkt P einsetzen: ${fmt(y1)} = a · ${par(x1 - d)}² ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))}<br>` +
              `${fmt(y1)} = a · ${fmt(dx * dx)} ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))}&nbsp;| ${e > 0 ? '−' : '+'} ${fmt(Math.abs(e))}<br>` +
              `${fmt(y1 - e)} = a · ${fmt(dx * dx)}&nbsp;| : ${fmt(dx * dx)}<br>` +
              `a = <strong>${fmt(a)}</strong><br>` +
              `Die Klammer wird quadriert – deshalb spielt es keine Rolle, ob P links oder rechts vom Scheitel liegt.`
          };
        }

        // nullstellen: aus der Scheitelform, mit ganzzahliger Wurzel
        const a2 = choice([1, -1, 2, -2]);
        const w = rnd(12, 75);                    // Abstand der Nullstellen vom Scheitel
        const d2 = rndNonZero(-5, 5);
        const e2 = -a2 * w * w;                 // damit a(x−d)² + e = 0 bei d ± w
        return {
          q: `Berechne die Nullstellen von f(x) = ${scheitelForm(a2, d2, e2)}. <span class="hint">Beide angeben, z. B. „2; 6“.</span>`,
          type: 'input', placeholder: 'x₁; x₂',
          check: multiCheck([d2 - w, d2 + w]), testAnswer: `${d2 - w}; ${d2 + w}`,
          answerText: `x₁ = ${fmt(d2 - w)}, x₂ = ${fmt(d2 + w)}`,
          // Der Weg folgt dem Beispiel der Erklärseite: Klammer freistellen,
          // Wurzel ziehen, je Zweig nach x auflösen, Probe. Bei a = 1 entfällt
          // das Teilen – „| : 1“ wiederholte nur die Zeile davor. Bei a = −1
          // wird mit (−1) malgenommen, ein negativer Teiler steht in Klammern.
          // Der negative Zweig steht vorn, damit x₁ wie in der Antwort die
          // kleinere Nullstelle bleibt und die Nummern der Zeilenfolge folgen.
          solution: `Nullstellen heißt f(x) = 0:<br>` +
            `${scheitelForm(a2, d2, e2)} = 0&nbsp;| ${e2 > 0 ? '−' : '+'} ${fmt(Math.abs(e2))}<br>` +
            (a2 === 1 ? '' :
              `${koef(a2, `${xMinus(d2)}²`)} = ${fmt(-e2)}&nbsp;| ${a2 === -1 ? '· (−1)' : `: ${par(a2)}`}<br>`) +
            `${xMinus(d2)}² = ${fmt(w * w)}&nbsp;| √<br>` +
            `Die Wurzel liefert <strong>zwei</strong> Werte, denn ${par(-w)}² = ${fmt(w * w)} und ${fmt(w)}² = ${fmt(w * w)}:<br>` +
            // xMinus ohne die äußere Klammer, wie auf der Seite („x + 2 = 3“)
            `${xMinus(d2).slice(1, -1)} = ${fmt(-w)} → x₁ = <strong>${fmt(d2 - w)}</strong>&ensp;<span class="trenn">•</span>&ensp;` +
            `${xMinus(d2).slice(1, -1)} = ${fmt(w)} → x₂ = <strong>${fmt(d2 + w)}</strong><br>` +
            `<em>Probe:</em> ${[-w, w].map(u => `f(${fmt(d2 + u)}) = ${a2 === 1 ? '' : `${fmt(a2)} · `}${par(u)}²${summand(e2)} = 0 ✓`)
              .join('&ensp;<span class="trenn">•</span>&ensp;')}<br>` +
            `Beide liegen ${fmt(w)} vom Scheitel entfernt – die Parabel ist symmetrisch zur Geraden x = ${fmt(d2)}.`
        };
      }

      /* ---------- Stufe 3: Von der Normalform zur Scheitelform ---------- */
      const kind = choice(['ergaenzung', 'extremstelle', 'anwendung']);

      if (kind === 'ergaenzung') {
        const d = rndNonZero(-6, 6), e = rndNonZero(-9, 9);
        const p = -2 * d, q = d * d + e;        // x² + px + q = (x − d)² + e
        return {
          q: `Bestimme den Scheitelpunkt von f(x) = ${quadLhs(p, q)} mit quadratischer Ergänzung. <span class="hint">Gib x und y an – z. B. „3; −5“.</span>`,
          type: 'input', placeholder: 'x; y',
          check: orderedCheck([d, e]), testAnswer: `${d}; ${e}`,
          answerText: `S(${fmt(d)} | ${fmt(e)})`,
          // Wie das Beispiel der Seite: den quadrierten Wert ausdrücklich
          // nennen – bei negativer halber Zahl steckt genau in (−6)² = 36 der
          // typische Fehler „− 36 in die Klammer“. Ebenso wird der Rest hinter
          // der Klammer zusammengefasst („dahinter bleibt …“). q = 0 kommt
          // vor (d = ±1, e = −1), dann bleibt nur −d².
          solution: `Die halbe Zahl vor x ist ${fmt(p)} : 2 = ${fmt(p / 2)}, quadriert ${par(p / 2)}² = ${fmt(d * d)}. ` +
            `Also ${fmt(d * d)} addieren und gleich wieder abziehen:<br>` +
            `f(x) = ${quadLhs(p, q)}<br>` +
            `= (x² ${p > 0 ? '+' : '−'} ${fmt(Math.abs(p))}x <strong>+ ${fmt(d * d)}</strong>) <strong>− ${fmt(d * d)}</strong>${summand(q)}<br>` +
            `Die Klammer ist jetzt ${xMinus(d)}², dahinter bleibt ${q === 0 ? fmt(e) : `−${fmt(d * d)}${summand(q)} = ${fmt(e)}`}:<br>` +
            `f(x) = ${xMinus(d)}² ${e > 0 ? '+' : '−'} ${fmt(Math.abs(e))} → Scheitel <strong>S(${fmt(d)} | ${fmt(e)})</strong><br>` +
            `<em>Probe:</em> f(${fmt(d)}) = ${par(d)}² ${p > 0 ? '+' : '−'} ${fmt(Math.abs(p))} · ${par(d)}${summand(q)} = ${fmt(e)} ✓`
        };
      }

      if (kind === 'extremstelle') {
        const a = choice([2, 3, -2, -3, 4]);
        const d = rndNonZero(-4, 4);
        const b = -2 * a * d, c = rndNonZero(-8, 8);
        const art = a > 0 ? 'Tiefpunkt' : 'Hochpunkt';
        return {
          q: `Für welches x hat f(x) = ${koef(a, 'x²')} ${b > 0 ? '+' : '−'} ${koef(Math.abs(b))} ${c > 0 ? '+' : '−'} ${fmt(Math.abs(c))} seinen ${art}?`,
          type: 'input', placeholder: 'x',
          check: numCheck(d), testAnswer: String(d), answerText: `x = ${fmt(d)}`,
          solution: `Bei f(x) = ax² + bx + c liegt der Scheitel immer bei <strong>x = −b ⁄ (2a)</strong>.<br>` +
            `Hier ist a = ${fmt(a)} und b = ${fmt(b)}:<br>` +
            // Erst −b wörtlich einsetzen, dann ausrechnen – wie auf der Seite
            // („x = −(−12) ⁄ (2 · 2)“). Sonst stand bei negativem b gleich die
            // 12 da, bei positivem „−32“: zwei scheinbar verschiedene Formeln.
            `x = −${par(b)} ⁄ (2 · ${par(a)}) = ${fmt(-b)} ⁄ ${par(2 * a)} = <strong>${fmt(d)}</strong><br>` +
            `a ist ${a > 0 ? 'positiv, die Parabel öffnet nach oben – also ein Tiefpunkt' : 'negativ, die Parabel öffnet nach unten – also ein Hochpunkt'}.<br>` +
            `<em>Der Summand ${fmt(c)} verschiebt nur nach oben oder unten</em> und ändert die Stelle des Scheitels nicht.`
        };
      }

      // anwendung: Wurfparabel, maximale Höhe
      // a zuerst wählen, Höhe daraus ableiten: Aus hMax/t0² entstanden sonst
      // Faktoren wie −0,1875, die in der Aufgabenstellung stehen und niemand
      // im Kopf behält. Die Kombinationen sind so gewählt, dass die Scheitel-
      // höhe zwischen 2 m und 18 m bleibt.
      const aA = choice([-0.5, -1, -1.5, -2]);
      const t0 = choice([2, 3, aA >= -1 ? 4 : 3]);
      const hMax = -aA * t0 * t0;                // damit h(0) = 0 und h(t0) = hMax
      const tFrage = t0 + choice([-1, 1, 2]);
      const hWert = aA * (tFrage - t0) * (tFrage - t0) + hMax;
      return {
        // koef gegen „−1 · (t − 2)²“, plural gegen „nach 1 Sekunden“
        q: `Ein Ball fliegt auf einer Wurfparabel. Seine Höhe beschreibt h(t) = ${koef(aA, `(t − ${fmt(t0)})²`)} + ${fmt(hMax)} (t in Sekunden, h in Metern). Wie hoch ist der Ball nach ${fmt(tFrage)} ${plural(tFrage, 'Sekunde', 'Sekunden')}?`,
        type: 'input', placeholder: 'Höhe in m',
        // Die Faktoren sind glatt (−0,5 … −2), der Abstand zum Scheitel 1 oder 2: Alle Antworten
        // sind ganze oder halbe Meter, ein Hinweis „auf 2 Dezimalstellen“ versprach eine Form,
        // die nie vorkam.
        check: numCheck(hWert), testAnswer: String(hWert),
        answerText: `${fmt(hWert)} m`,
        solution: `Die Gleichung steht schon in Scheitelform: Der höchste Punkt liegt bei t = ${fmt(t0)} s mit ${fmt(hMax)} m.<br>` +
          `Für t = ${fmt(tFrage)}:<br>` +
          `Klammer: ${fmt(tFrage)} − ${fmt(t0)} = ${fmt(tFrage - t0)}<br>` +
          `Quadrat: ${par(tFrage - t0)}² = ${fmt((tFrage - t0) * (tFrage - t0))}<br>` +
          `h(${fmt(tFrage)}) = ${fmt(aA)} · ${fmt((tFrage - t0) * (tFrage - t0))} + ${fmt(hMax)} = <strong>${fmt(Math.round(hWert * 100) / 100)} m</strong><br>` +
          `<em>Plausibel:</em> ${fmt(tFrage)} s liegt ${fmt(Math.abs(tFrage - t0))} ${plural(Math.abs(tFrage - t0), 'Sekunde', 'Sekunden')} ${tFrage > t0 ? 'nach' : 'vor'} dem höchsten Punkt, der Ball ist also tiefer als ${fmt(hMax)} m ✓`
      };
    }
  };


  return [zinsen, terme, lgs, quadfunktion, flaechen, volumen, koerper, strahlensaetze, trigonometrie, statistik, wahrscheinlichkeit];
})();
