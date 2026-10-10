/* ============================================================
   MatheNils – Neue Themen der Unterstufe (Klasse 5–7)
   Negative Zahlen · Teilbarkeit & Primzahlen · Dezimalzahlen ·
   Einheiten · Dreisatz · Winkel
   ============================================================ */
'use strict';

const TOPICS_UNTER_NEU = (() => {
  const { rnd, choice, shuffle, gcd, lcm, fmt, frac, numCheck, fracCheck, orderedCheck } = Util;
  const { par, makeChoice, rndNonZero, plural } = TopicUtils;

  /** Zufallszahl, die kein Vielfaches von 10 ist – siehe „einheiten“, Stufe 2. */
  function rndNonZehner(min, max) {
    let n = rnd(min, max);
    while (n % 10 === 0) n = rnd(min, max);
    return n;
  }

  /* ---------- Negative Zahlen ---------- */

  const negative = {
    id: 'negative',
    icon: '−5',
    title: 'Negative Zahlen',
    tagline: 'Rechnen mit Zahlen unter null',
    learn: `
      <h2>Rechnen mit negativen Zahlen</h2>
      <p>Negative Zahlen liegen auf dem Zahlenstrahl <strong>links von der Null</strong> – wie
      Temperaturen unter dem Gefrierpunkt oder Schulden auf dem Konto.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Addition und Subtraktion</span>
        <ul>
          <li>Plus eine negative Zahl = Minus:&nbsp;5 + (−3) = 5 − 3 = 2</li>
          <li>Minus eine negative Zahl = Plus:&nbsp;5 − (−3) = 5 + 3 = 8</li>
        </ul>
      </div>
      <div class="merkkasten"><span class="merk-title">Merke: Vorzeichenregeln bei · und :</span>
        <ul>
          <li>Gleiche Vorzeichen → Ergebnis <strong>positiv</strong>: (−4) · (−3) = 12</li>
          <li>Verschiedene Vorzeichen → Ergebnis <strong>negativ</strong>: (−4) · 3 = −12</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel mit dem Zahlenstrahl</span>
        <p>−7 + 12: Starte bei −7 und gehe 12 Schritte nach rechts → <strong>5</strong></p>
      </div>
    `,
    gen(diff) {
      if (diff === 1) {
        let a = rndNonZero(-20, 20), b = rndNonZero(-20, 20);
        if (a > 0 && b > 0) b = -b;
        const res = a + b;
        const schritte = `${fmt(Math.abs(b))} ${plural(b, 'Schritt', 'Schritte')}`;
        // Bei „+ (−5)“ geht es nach links, obwohl ein Plus dasteht – die
        // Erklärseite löst das in einem eigenen Schritt auf (zwei Zeichen
        // zusammenfassen). Ohne ihn widerspricht der Weg scheinbar der Regel
        // „+ heißt nach rechts“, und wer 20 + 5 gerechnet hat, erfährt nicht,
        // warum.
        return {
          q: `Berechne: ${fmt(a)} + ${par(b)}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: b < 0
            ? `Zwei Zeichen treffen aufeinander: + ${par(b)} wird zu − ${fmt(-b)}, also ${fmt(a)} + ${par(b)} = ${fmt(a)} − ${fmt(-b)}.<br>` +
              `Auf dem Zahlenstrahl: Start bei ${fmt(a)}, ${schritte} nach links → ${fmt(res)}.`
            : `Starte auf dem Zahlenstrahl bei ${fmt(a)} und gehe ${schritte} nach rechts: Ergebnis ${fmt(res)}.`
        };
      }
      if (diff === 2) {
        const kind = choice(['sub', 'mul']);
        if (kind === 'sub') {
          const a = rndNonZero(-20, 20), b = -rnd(2, 15);
          const res = a - b;
          return {
            q: `Berechne: ${fmt(a)} − ${par(b)}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
            solution: `Minus eine negative Zahl wird zu Plus:<br>${fmt(a)} − ${par(b)} = ${fmt(a)} + ${Math.abs(b)} = ${fmt(res)}`
          };
        }
        const a = rnd(2, 12) * choice([1, -1]);
        let b = rnd(2, 12) * choice([1, -1]);
        if (a > 0 && b > 0) b = -b;
        const res = a * b;
        return {
          q: `Berechne: ${par(a)} · ${par(b)}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `${a < 0 === b < 0 ? 'Gleiche Vorzeichen → Ergebnis positiv.' : 'Verschiedene Vorzeichen → Ergebnis negativ.'}<br>` +
            `${Math.abs(a)} · ${Math.abs(b)} = ${Math.abs(res)}, also ${par(a)} · ${par(b)} = ${fmt(res)}`
        };
      }
      const kind = choice(['div', 'kette']);
      if (kind === 'div') {
        const q0 = rnd(2, 12) * choice([1, -1]);
        let b = rnd(2, 9) * choice([1, -1]);
        if (q0 > 0 && b > 0) b = -b;
        const a = q0 * b;
        return {
          q: `Berechne: ${par(a)} : ${par(b)}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(q0), testAnswer: String(q0), answerText: fmt(q0),
          solution: `${a < 0 === b < 0 ? 'Gleiche Vorzeichen → positiv.' : 'Verschiedene Vorzeichen → negativ.'}<br>` +
            `${Math.abs(a)} : ${Math.abs(b)} = ${Math.abs(q0)}, also ist das Ergebnis ${fmt(q0)}.`
        };
      }
      const a = rnd(-15, 15), b = rnd(2, 8) * choice([1, -1]), c = rnd(2, 8);
      const res = a - b * c;
      const p = b * c;
      // Bei negativem b steht nach der Punktrechnung „− (−35)“ da – genau dort
      // entsteht der typische Fehler −8 − 35. Die Erklärseite rechnet dieselbe
      // Form im Beispiel „Punkt vor Strich – auch mit Vorzeichen“ mit beiden
      // Teilschritten vor: Vorzeichenregel, dann zwei Zeichen zusammenfassen.
      // c ist immer positiv, die Vorzeichen sind also verschieden.
      return {
        q: `Berechne: ${fmt(a)} − ${par(b)} · ${c}`, type: 'input', placeholder: 'Ergebnis',
        check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
        solution: b < 0
          ? `Punkt vor Strich, Vorzeichen verschieden: ${par(b)} · ${fmt(c)} = ${fmt(p)}.<br>` +
            `Übrig bleibt ${fmt(a)} − ${par(p)}. Zwei Zeichen treffen aufeinander: − ${par(p)} wird zu + ${fmt(-p)}.<br>` +
            (a === 0 ? `Ergebnis: ${fmt(res)}` : `${fmt(a)} + ${fmt(-p)} = ${fmt(res)}`)
          : `Punkt vor Strich: ${par(b)} · ${c} = ${fmt(p)}.<br>Dann: ${fmt(a)} − ${par(p)} = ${fmt(res)}`
      };
    }
  };

  /* ---------- Teilbarkeit & Primzahlen ---------- */

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }

  function quersumme(n) {
    return String(n).split('').reduce((s, z) => s + Number(z), 0);
  }

  // Primfaktoren aufsteigend, wie im Verfahren der Erklärseite: immer durch die
  // kleinste passende Primzahl teilen. Gebraucht für ggT (Stufe 2) und kgV (Stufe 3).
  function primfaktoren(n) {
    const f = [];
    for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; }
    return f;
  }

  /* --- Zahlenvorrat für die Teilbarkeitsfrage (Stufe 1) --------------------
     Die Frage nennt einen Teiler aus 2, 3, 5, 9, 10 – eine blinde Regel liest
     ihn aber gar nicht. Wer stur „gerade → Ja“ antwortet, hat bei der 2 immer
     recht und muss bei den übrigen vier nur den Zufall schlagen. Früher war das
     leicht: Eine beliebige Zahl ist zur Hälfte durch 2, aber nur zu einem
     Zehntel durch 10 teilbar, also traf „Nein“ in 75 % der Ziehungen zu.
     Die Zahl wird deshalb über ihr *Profil* gezogen: Endziffernklasse (0 · 5 ·
     gerade ohne 0 · ungerade ohne 5) und Quersummenklasse (durch 9 · durch 3,
     aber nicht durch 9 · gar nicht). Das Profil legt für alle fünf Teiler die
     Antwort fest, und die Gewichte unten sind so gewählt, dass jedes Profil
     ungefähr gleich oft „Ja“ wie „Nein“ bedeutet. Wer nur Endziffer und
     Quersumme liest, kommt damit über den ganzen Aufgabentyp auf höchstens
     56 % statt auf 80 % – nachgerechnet über alle Regeln, die sich aus diesen
     beiden Merkmalen bilden lassen.
     Zwei der zwölf Profile fehlen mit Absicht: Vielfache von 90 heißen bei
     allen fünf Teilern „Ja“, ungerade Zahlen ohne Endziffer 5 mit unteilbarer
     Quersumme bei allen fünf „Nein“ – beide lassen sich nicht ausgleichen. */

  /** Profilname einer Zahl, z. B. „LEQ3“ = gerade ohne 0, Quersumme durch 3. */
  function profil(n) {
    const e = n % 10 === 0 ? 'L0' : n % 10 === 5 ? 'L5' : n % 2 === 0 ? 'LE' : 'LO';
    const q = quersumme(n);
    return e + (q % 9 === 0 ? 'Q9' : q % 3 === 0 ? 'Q3' : 'QN');
  }

  /** Alle Zahlen von 24 bis 999 nach Profil sortiert – einmal beim Laden. */
  const ZAHLEN_NACH_PROFIL = {};
  for (let z = 24; z <= 999; z++) {
    const p = profil(z);
    if (!ZAHLEN_NACH_PROFIL[p]) ZAHLEN_NACH_PROFIL[p] = [];
    ZAHLEN_NACH_PROFIL[p].push(z);
  }

  /* Jede durch 10 teilbare Zahl trägt eine 0 – „irgendwo eine 0“ wäre damit
     beinahe dieselbe Regel wie „endet auf 0“. Deshalb trägt auch die Hälfte der
     Nein-Zahlen der 10 eine 0 an anderer Stelle (105, 306, 502 …). Nur wo der
     Vorrat dafür zu klein ist, bleibt es beim ganzen Profil. */
  const MIT_NULL = {}, OHNE_NULL = {};
  Object.keys(ZAHLEN_NACH_PROFIL).forEach(p => {
    MIT_NULL[p] = ZAHLEN_NACH_PROFIL[p].filter(z => String(z).indexOf('0') >= 0);
    OHNE_NULL[p] = ZAHLEN_NACH_PROFIL[p].filter(z => String(z).indexOf('0') < 0);
  });

  /* Je Teiler und Antwort: welche Profile mit welchem Gewicht. Innerhalb eines
     Teilers stimmen Ja- und Nein-Zahlen in dem Merkmal überein, das nicht zur
     Sache gehört – bei der 2 haben beide Seiten dieselbe Quersummenmischung,
     bei der 3 dieselbe Endziffernmischung. Sonst löste eine fremde Regel die
     Aufgabe mit. Absicht ist außerdem: die Ja-Zahlen der 3 sind nie durch 9
     teilbar und die Nein-Zahlen der 9 immer durch 3 – genau die Verwechslung,
     um die es geht. */
  const TEILER_FAELLE = {
    2:  { ja:   [['LEQ9', 1], ['LEQ3', 3], ['LEQN', 3]],
          nein: [['L5Q9', 2], ['L5Q3', 1], ['L5QN', 1], ['LOQ9', 6], ['LOQ3', 6]] },
    3:  { ja:   [['L0Q3', 2], ['L5Q3', 1], ['LEQ3', 1], ['LOQ3', 3]],
          nein: [['L0QN', 3], ['L5QN', 1], ['LEQN', 1]] },
    5:  { ja:   [['L0Q3', 2], ['L0QN', 4], ['L5Q9', 1], ['L5Q3', 3], ['L5QN', 2]],
          nein: [['LEQ9', 3], ['LEQ3', 3], ['LEQN', 2], ['LOQ9', 4], ['LOQ3', 4]] },
    9:  { ja:   [['L5Q9', 1], ['LEQ9', 1], ['LOQ9', 3]],
          nein: [['L0Q3', 2], ['L5Q3', 2], ['LEQ3', 2], ['LOQ3', 1]] },
    10: { ja:   [['L0Q3', 1], ['L0QN', 2]],
          nein: [['L5Q9', 3], ['L5Q3', 2], ['L5QN', 1], ['LEQ9', 1], ['LEQ3', 2], ['LEQN', 3]] }
  };

  /** Gewichtstabelle zu einer flachen Liste, aus der `choice` ziehen kann. */
  const TEILER_PROFILE = {};
  Object.keys(TEILER_FAELLE).forEach(t => {
    TEILER_PROFILE[t] = { ja: [], nein: [] };
    ['ja', 'nein'].forEach(seite => TEILER_FAELLE[t][seite].forEach(([p, g]) => {
      for (let i = 0; i < g; i++) TEILER_PROFILE[t][seite].push(p);
    }));
  });

  /* Die 10 kommt halb so oft vor wie die anderen: Jede durch 10 teilbare Zahl
     endet auf 0 und ist damit auch durch 2 und 5 teilbar – zu viele
     Zehner-Fragen kippen die Bilanz der Endziffer 0 ins „Ja“. */
  const TEILER_WAHL = [2, 2, 3, 3, 5, 5, 9, 9, 10];

  /* --- Zahlenvorrat für die Primzahlfrage (Stufe 2) ------------------------
     Zwischen 20 und 99 ist nur jede fünfte Zahl prim, „Nein“ traf also zu 80 %.
     Die Antwort vorher zu werfen genügt aber nicht: Von den 20 Zahlen zwischen
     20 und 99, die weder durch 2 noch durch 3 noch durch 5 teilbar sind, sind
     17 prim. Wer nur die drei Regeln des Merkkastens anwendet und nie durch 7
     teilt, läge damit in über 90 % der Fälle richtig – die Probedivision, um
     die es geht, wäre entbehrlich. Dagegen hilft nur ein größerer Zahlenraum:
     Bis 288 gibt es 18 Zerlegungen ohne 2, 3 und 5 (49 = 7 · 7 bis
     287 = 7 · 41), und die kommen jetzt genauso oft vor wie die Primzahlen.
     288 ist die Grenze, weil 17 · 17 = 289 ist: Bis dahin genügen die Proben
     2, 3, 5, 7, 11 und 13, die auch der Tipp nennt. */
  const PRIM_JA = [], PRIM_GERADE = [], PRIM_DREI = [], PRIM_FUENF = [];
  /* Die schweren Zerlegungen noch einmal nach ihrem kleinsten Primteiler
     getrennt: Zehn von ihnen fallen bei der Probe mit 7, fünf erst bei 11 und
     drei erst bei 13. Zöge man gleichmäßig aus allen achtzehn, hätte die Probe
     mit 7 allein schon 70 % erledigt und 11 und 13 wären entbehrlich. */
  const PRIM_HART_7 = [], PRIM_HART_11 = [], PRIM_HART_13 = [];
  for (let z = 20; z <= 288; z++) {
    if (isPrime(z)) { PRIM_JA.push(z); continue; }
    if (z % 2 && z % 3 && z % 5) {
      (z % 7 === 0 ? PRIM_HART_7 : z % 11 === 0 ? PRIM_HART_11 : PRIM_HART_13).push(z);
    } else if (z <= 99) {
      // Die leichten Zerlegungen bleiben zweistellig: Sonst wären fast alle
      // dreistelligen Zahlen der Aufgabe prim, und „dreistellig“ verriete etwas.
      if (z % 5 === 0) PRIM_FUENF.push(z);
      else if (z % 2) PRIM_DREI.push(z);
      else PRIM_GERADE.push(z);
    }
  }
  const PRIM_HART_WAHL = [PRIM_HART_7, PRIM_HART_7, PRIM_HART_11, PRIM_HART_11, PRIM_HART_13];

  const teilbarkeit = {
    id: 'teilbarkeit',
    icon: '2·3·5',
    title: 'Teilbarkeit & Primzahlen',
    tagline: 'Teiler, ggT, kgV und Primzahlen',
    learn: `
      <h2>Teilbarkeit, ggT, kgV und Primzahlen</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Teilbarkeitsregeln</span>
        <ul>
          <li>Durch <strong>2</strong>: letzte Ziffer gerade · durch <strong>5</strong>: endet auf 0 oder 5 · durch <strong>10</strong>: endet auf 0</li>
          <li>Durch <strong>3</strong>: Quersumme durch 3 teilbar · durch <strong>9</strong>: Quersumme durch 9 teilbar</li>
        </ul>
      </div>
      <p>Eine <strong>Primzahl</strong> hat genau zwei Teiler: 1 und sich selbst.
      Die ersten Primzahlen: 2, 3, 5, 7, 11, 13, 17, 19, 23 …</p>
      <h3>ggT und kgV</h3>
      <ul>
        <li><strong>ggT</strong> = größter gemeinsamer Teiler: die größte Zahl, die beide teilt (wichtig beim Kürzen).</li>
        <li><strong>kgV</strong> = kleinstes gemeinsames Vielfaches: die kleinste Zahl in beiden Vielfachenreihen (wichtig beim Hauptnenner).</li>
      </ul>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>ggT(12, 18) = 6, denn 12 = 2·6 und 18 = 3·6.&nbsp;kgV(12, 18) = 36.</p>
      </div>
      <p>Jede Zahl lässt sich eindeutig in <strong>Primfaktoren</strong> zerlegen: 60 = 2 · 2 · 3 · 5.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['quersumme', 'teilbar']);
        if (kind === 'quersumme') {
          const n = rnd(120, 9999);
          const qs = quersumme(n);
          return {
            q: `Bestimme die Quersumme von ${n}.`, type: 'input', placeholder: 'Quersumme',
            check: numCheck(qs), testAnswer: String(qs), answerText: `${qs}`,
            solution: `Alle Ziffern addieren: ${String(n).split('').join(' + ')} = ${qs}`
          };
        }
        const t = choice(TEILER_WAHL);
        // Erst die Antwort werfen, dann ein dazu passendes Profil und daraus die
        // Zahl – siehe TEILER_FAELLE. Aus `n % t === 0` zu lesen, wie die Aufgabe
        // ausgeht, wäre falsch herum: Dann bestimmt der Zufall der Zahl die
        // Antwortquote, und die ist je Teiler eine andere.
        const teilbar = choice([true, false]);
        const pf = choice(TEILER_PROFILE[t][teilbar ? 'ja' : 'nein']);
        const vorrat = t === 10 && !teilbar && MIT_NULL[pf].length >= 3
          ? choice([MIT_NULL[pf], OHNE_NULL[pf]]) : ZAHLEN_NACH_PROFIL[pf];
        const n = choice(vorrat);
        const qs = quersumme(n), letzte = n % 10;
        // Bei den Quersummenregeln gehört die Entscheidung über die Quersumme in
        // den Lösungsweg; die beiden Fallen (durch 3, aber nicht durch 9 · durch
        // 5, aber nicht durch 10) bekommen den Halbsatz, der sie benennt.
        const regeln = {
          2: `Regel: durch 2 teilbar, wenn die letzte Ziffer gerade ist. ${fmt(n)} endet auf ${fmt(letzte)}.`,
          3: `Regel: durch 3 teilbar, wenn die Quersumme durch 3 teilbar ist. Quersumme von ${fmt(n)}: ${fmt(qs)} – ${teilbar ? '' : 'nicht '}durch 3 teilbar.`,
          5: `Regel: durch 5 teilbar, wenn die Zahl auf 0 oder 5 endet. ${fmt(n)} endet auf ${fmt(letzte)}.`,
          9: `Regel: durch 9 teilbar, wenn die Quersumme durch 9 teilbar ist. Quersumme von ${fmt(n)}: ${fmt(qs)} – ` +
            (teilbar ? 'durch 9 teilbar.' : qs % 3 === 0 ? 'zwar durch 3, aber nicht durch 9 teilbar.' : 'nicht durch 9 teilbar.'),
          10: `Regel: durch 10 teilbar, wenn die Zahl auf 0 endet. ${fmt(n)} endet auf ${fmt(letzte)}` +
            (letzte === 5 ? ' – also durch 5 teilbar, aber nicht durch 10.' : '.')
        };
        // Rückmeldung nur für zwei Fehlvorstellungen, die der Lösungsweg nicht
        // ausspricht: die Regel der letzten Ziffer auf die 3 übertragen (die
        // falsche Antwort ist dann genau die, die diese Regel liefert), und eine
        // 0 in der Mitte für die Endziffer 0 halten. Bei 105, 305 … bleibt es
        // still – dort nennt der Lösungsweg schon die 5. Die Verwechslung 3/9
        // steht ebenfalls im Lösungsweg und bekommt deshalb keinen Grund.
        let grund = null;
        if (t === 3 && teilbar !== (letzte % 3 === 0)) {
          grund = teilbar
            ? `Auf ${fmt(letzte)} zu enden spricht bei der 3 nicht dagegen: Nur bei 2, 5 und 10 entscheidet die letzte Ziffer.`
            : `Auf ${fmt(letzte)} zu enden hilft bei der 3 nicht: Nur bei 2, 5 und 10 entscheidet die letzte Ziffer.`;
        }
        if (t === 10 && !teilbar && letzte !== 5 && String(n).includes('0')) {
          grund = `Eine 0 in der Mitte zählt nicht: Durch 10 teilbar macht nur die 0 als letzte Ziffer.`;
        }
        return {
          q: `Ist ${fmt(n)} durch ${fmt(t)} teilbar?`, type: 'choice',
          options: ['Ja', 'Nein'], correct: teilbar ? 0 : 1, answerText: teilbar ? 'Ja' : 'Nein',
          gruende: teilbar ? [null, grund] : [grund, null],
          solution: `${regeln[t]}<br>Also: ${fmt(n)} ist ${teilbar ? '' : 'nicht '}durch ${fmt(t)} teilbar.`
        };
      }
      if (diff === 2) {
        const kind = choice(['ggt', 'prim']);
        if (kind === 'ggt') {
          const g = choice([2, 3, 4, 5, 6, 8, 10, 12]);
          let x = rnd(2, 9), y = rnd(2, 9);
          let tries = 0;
          while ((gcd(x, y) !== 1 || x === y) && tries++ < 40) { x = rnd(2, 9); y = rnd(2, 9); }
          if (gcd(x, y) !== 1 || x === y) { x = 2; y = 3; }
          const a = g * x, b = g * y;
          // Früher stand hier nur „54 = 6 · 9“ – der ggT war vorausgesetzt, nicht
          // bestimmt. Jetzt der Weg der Erklärseite (Beispiel 24 und 36): beide
          // Zahlen zerlegen, die gemeinsamen Primfaktoren in der kleineren Anzahl
          // nehmen. Die Probe danach zeigt, warum es der GRÖSSTE ist: Die Reste
          // x und y sind nach Bauart teilerfremd.
          const fa = primfaktoren(a), fb = primfaktoren(b);
          const uebrig = [...fb], gemeinsam = [];
          fa.forEach(p => {
            const i = uebrig.indexOf(p);
            if (i >= 0) { gemeinsam.push(p); uebrig.splice(i, 1); }
          });
          const kette = f => f.map(k => fmt(k)).join(' · ');
          return {
            q: `Bestimme den größten gemeinsamen Teiler: ggT(${a}, ${b})`, type: 'input', placeholder: 'ggT',
            check: numCheck(g), testAnswer: String(g), answerText: `${g}`,
            solution: `${fmt(a)} = ${kette(fa)}&ensp;<span class="trenn">•</span>&ensp;${fmt(b)} = ${kette(fb)}<br>` +
              `Gemeinsam: ${kette(gemeinsam)} → ggT = ${fmt(g)}<br>` +
              `Probe: ${fmt(a)} = ${fmt(g)} · ${fmt(x)} und ${fmt(b)} = ${fmt(g)} · ${fmt(y)}. ` +
              `${fmt(x)} und ${fmt(y)} haben außer 1 keinen gemeinsamen Teiler mehr.`
          };
        }
        // 44 % Primzahl, 44 % Zerlegung ohne 2, 3 und 5, 12 % leichte Zerlegung.
        // Die beiden ersten Töpfe müssen gleich schwer sein: Sonst entscheidet
        // die Probe „durch 2, 3 oder 5?“ allein die Aufgabe (siehe PRIM_HART_7).
        const wurf = rnd(1, 25);
        const prim = wurf <= 11;
        const hart = !prim && wurf <= 22;
        const n = prim ? choice(PRIM_JA)
          : hart ? choice(choice(PRIM_HART_WAHL))
          : choice(choice([PRIM_GERADE, PRIM_DREI, PRIM_FUENF]));
        let teiler = '';
        if (!prim) {
          for (let i = 2; i <= n; i++) if (n % i === 0) { teiler = `${fmt(i)} · ${fmt(n / i)}`; break; }
        }
        // Bis wohin muss man probieren? Bis das Quadrat des Teilers die Zahl übersteigt.
        const proben = [2, 3, 5, 7, 11, 13, 17].filter(p => p * p <= n);
        const schluss = [2, 3, 5, 7, 11, 13, 17].find(p => p * p > n);
        // Die leichten ungeraden Zerlegungen ohne 5 am Ende (21, 51, 57, 87 …)
        // sind genau die, die wegen „ungerade“ für prim gehalten werden – ihr
        // Teiler ist immer die 3. Bei den schweren nennt der Lösungsweg die
        // Falle schon selbst.
        const ungeradeMitDrei = !prim && !hart && n % 2 === 1 && n % 5 !== 0;
        return {
          q: `Ist ${fmt(n)} eine Primzahl?`, type: 'choice',
          options: ['Ja', 'Nein'], correct: prim ? 0 : 1, answerText: prim ? 'Ja' : 'Nein',
          gruende: [ungeradeMitDrei ? 'Ungerade und nicht auf 5 endend heißt noch nicht prim: Auch 3 kann ein Teiler sein.' : null, null],
          solution: prim
            ? `Der Reihe nach probieren: ${proben.map(p => fmt(p)).join(', ')} – keine dieser Zahlen teilt ${fmt(n)}. ` +
              `Bei ${fmt(schluss)} darfst du aufhören, denn ${fmt(schluss)} · ${fmt(schluss)} = ${fmt(schluss * schluss)} ist schon größer als ${fmt(n)}. Also eine Primzahl.`
            : `${fmt(n)} = ${teiler}, hat also mehr als zwei Teiler – keine Primzahl.` +
              (hart ? ` Achtung: An 2, 3 und 5 kommt ${fmt(n)} vorbei – erst die Probe mit 7, 11 oder 13 bringt die Zerlegung.` : '')
        };
      }
      const kind = choice(['kgv', 'primfaktoren']);
      if (kind === 'kgv') {
        let a = rnd(4, 12), b = rnd(4, 12);
        while (b === a) b = rnd(4, 12);
        const L = lcm(a, b);
        // Der Weg lief früher über Vielfachenreihen, die nach drei Gliedern
        // abbrachen – das kgV stand bei 58 von 72 Paaren in keiner davon, und
        // die „Trick“-Zeile teilte durch einen ggT, den niemand bestimmt hatte.
        // Bis zum kgV ausgeschrieben wären es bis zu zwölf Glieder
        // (kgV(11, 12) = 132). Deshalb der Primfaktorweg der Erklärseite.
        const fa = primfaktoren(a), fb = primfaktoren(b);
        const zerlegt = (n, f) => f.length === 1
          ? `${fmt(n)} ist eine Primzahl`
          : `${fmt(n)} = ${f.map(k => fmt(k)).join(' · ')}`;
        let solution;
        if (gcd(a, b) === 1) {
          // Satz der Erklärseite: „Ist der ggT 1, ist das kgV einfach das Produkt.“
          solution = (fa.length === 1 && fb.length === 1
            ? `${fmt(a)} und ${fmt(b)} sind Primzahlen.`
            : `${zerlegt(a, fa)}&ensp;<span class="trenn">•</span>&ensp;${zerlegt(b, fb)}`) +
            `<br>Kein gemeinsamer Primfaktor, also ggT = 1. Dann ist das kgV einfach das Produkt: ` +
            `kgV(${fmt(a)}, ${fmt(b)}) = ${fmt(a)} · ${fmt(b)} = ${fmt(L)}`;
        } else {
          const hoechste = [];
          [...new Set([...fa, ...fb])].sort((x, y) => x - y).forEach(p => {
            const anzahl = Math.max(fa.filter(k => k === p).length, fb.filter(k => k === p).length);
            for (let i = 0; i < anzahl; i++) hoechste.push(p);
          });
          // Teilt die eine Zahl die andere, ist das kgV die größere – dann
          // hieße die Kontrolle „12 = 1 · 12“.
          const gross = Math.max(a, b), klein = Math.min(a, b);
          const kontrolle = L === gross
            ? `${fmt(L)} = ${fmt(L / klein)} · ${fmt(klein)} – die ${fmt(L)} ist selbst ein Vielfaches von ${fmt(klein)}.`
            : `${fmt(L)} = ${fmt(L / a)} · ${fmt(a)} = ${fmt(L / b)} · ${fmt(b)} – die ${fmt(L)} steht in beiden Vielfachenreihen.`;
          solution = `${zerlegt(a, fa)}&ensp;<span class="trenn">•</span>&ensp;${zerlegt(b, fb)}<br>` +
            `Alle Primfaktoren in höchster Anzahl: kgV = ${hoechste.map(k => fmt(k)).join(' · ')} = ${fmt(L)}<br>` +
            `Kontrolle: ${kontrolle}`;
        }
        return {
          q: `Bestimme das kleinste gemeinsame Vielfache: kgV(${a}, ${b})`, type: 'input', placeholder: 'kgV',
          check: numCheck(L), testAnswer: String(L), answerText: `${L}`,
          solution
        };
      }
      const zerlegungen = [[12, '2 · 2 · 3'], [18, '2 · 3 · 3'], [20, '2 · 2 · 5'], [28, '2 · 2 · 7'], [30, '2 · 3 · 5'],
        [36, '2 · 2 · 3 · 3'], [45, '3 · 3 · 5'], [50, '2 · 5 · 5'], [60, '2 · 2 · 3 · 5'], [84, '2 · 2 · 3 · 7']];
      const [n, zer] = choice(zerlegungen);
      const falsche = zerlegungen.filter(z => z[0] !== n).map(z => z[1]);
      // Dreimal unabhängig aus demselben Topf zu ziehen lieferte in 31 % der
      // Fälle zwei- oder dreimal dieselbe Zerlegung. Mischen und abschneiden
      // garantiert drei verschiedene.
      const ablenker = shuffle(falsche).slice(0, 3);
      // Jede falsche Zerlegung gehört zu einer anderen Zahl der Liste – der
      // Grund ist die Probe aus der Erklärseite: ausmultiplizieren.
      const produkt = new Map(zerlegungen.map(([z, s]) => [s, z]));
      const mc = makeChoice(zer, ablenker,
        ablenker.map(s => `Multipliziert ergeben diese Faktoren ${fmt(produkt.get(s))}, nicht ${fmt(n)}.`));
      // Die Divisionskette wie im Beispiel der Erklärseite („60 : 2 = 30 →
      // 30 : 2 = 15 → 15 : 3 = 5 → 5 ist prim"): Vorher nannte der Weg nur das
      // Verfahren und kündigte die Probe an, ohne einen Schritt vorzurechnen –
      // wer falsch gewählt hatte, sah nicht, wo seine Zerlegung abweicht.
      // Ein Schritt je Zeile statt der Pfeilkette: „= 15 → 15 : 3“ hält der
      // Sprachscan für eine Wiederholung über einen Pfeil.
      const faktoren = zer.split(' · ').map(Number);
      let rest = n;
      const kette = faktoren.slice(0, -1).map(p => {
        const schritt = `${fmt(rest)} : ${fmt(p)} = ${fmt(rest / p)}`;
        rest /= p;
        return schritt;
      });
      return {
        q: `Welche Primfaktorzerlegung gehört zu ${n}?`, type: 'choice',
        options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: zer,
        solution: `Immer durch die kleinste passende Primzahl teilen:<br>` +
          `${kette.join('<br>')}, und ${fmt(rest)} ist prim.<br>` +
          `Also ${fmt(n)} = ${zer}&nbsp;(Probe: ${zer} = ${fmt(n)} ✓)`
      };
    }
  };

  /* ---------- Dezimalzahlen ---------- */

  const dezimalzahlen = {
    id: 'dezimalzahlen',
    icon: '0,5',
    title: 'Dezimalzahlen',
    tagline: 'Kommazahlen verstehen, runden und rechnen',
    learn: `
      <h2>Dezimalzahlen (Kommazahlen)</h2>
      <p>Die Stellen hinter dem Komma heißen <strong>Zehntel, Hundertstel, Tausendstel</strong> …
      Beispiel: 3,47 = 3 + ${frac(4, 10)} + ${frac(7, 100)}.</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <ul>
          <li><strong>Vergleichen:</strong> stellenweise von links – 0,8 &gt; 0,45 (denn 8 Zehntel &gt; 4 Zehntel)!</li>
          <li><strong>· 10 / · 100:</strong> Komma nach rechts verschieben, <strong>: 10 / : 100</strong>: nach links.</li>
          <li><strong>Runden:</strong> Ziffer dahinter 0–4 → abrunden, 5–9 → aufrunden.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Multiplizieren</span>
        <p>0,3 · 0,4: Rechne 3 · 4 = 12, zusammen 2 Nachkommastellen → <strong>0,12</strong></p>
      </div>
      <p>Bei + und − die Kommas <strong>untereinander</strong> schreiben und stellenweise rechnen.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['add', 'sub', 'runden']);
        if (kind === 'add' || kind === 'sub') {
          // Zwei Zehnervielfache ergäben „18 − 15“, also eine Aufgabe ohne
          // Komma – während die Lösung „Kommas untereinander schreiben“ sagt.
          let t1 = rnd(11, 199), t2 = rnd(11, 199);
          if (t1 % 10 === 0) t1 += 3;
          if (t2 % 10 === 0) t2 += 3;
          if (kind === 'sub' && t1 < t2) [t1, t2] = [t2, t1];
          const res = kind === 'add' ? (t1 + t2) / 10 : (t1 - t2) / 10;
          const op = kind === 'add' ? '+' : '−';
          return {
            q: `Berechne: ${fmt(t1 / 10)} ${op} ${fmt(t2 / 10)}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
            solution: `Kommas untereinander schreiben und stellenweise rechnen:<br>${fmt(t1 / 10)} ${op} ${fmt(t2 / 10)} = ${fmt(res)}`
          };
        }
        let t = rnd(101, 999);
        if (t % 10 === 0) t += 3;
        const x = t / 10, res = Math.round(x);
        return {
          q: `Runde ${fmt(x)} auf eine ganze Zahl.`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `Die erste Nachkommastelle ist ${t % 10} – also wird ${t % 10 >= 5 ? 'auf' : 'ab'}gerundet: ${fmt(x)} ≈ ${fmt(res)}`
        };
      }
      if (diff === 2) {
        const kind = choice(['mult', 'komma']);
        if (kind === 'mult') {
          // Ohne diese Korrektur entstünde bei t = 20 die Aufgabe „Berechne:
          // 2 · 6“ – im Thema Dezimalzahlen, ganz ohne Komma. Der Nachbarzweig
          // macht es oben schon genauso.
          let t = rnd(11, 99);
          if (t % 10 === 0) t += 3;
          const k = rnd(2, 9);
          const res = (t * k) / 10;
          // Endet t · k auf 0 (32 · 5 = 160), erst die abgetrennte Form 16,0
          // zeigen, dann die Endnull streichen – sonst kündigt der Weg eine
          // Nachkommastelle an, die das Ergebnis 16 gar nicht hat.
          const abgetrennt = t * k % 10 === 0
            ? `${fmt(res, 1)} = ${fmt(res)} (die Null am Ende darf weg)`
            : fmt(res);
          return {
            q: `Berechne: ${fmt(t / 10)} · ${k}`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
            solution: `Ohne Komma rechnen: ${fmt(t)} · ${fmt(k)} = ${fmt(t * k)}. Eine Nachkommastelle abtrennen: ${abgetrennt}`
          };
        }
        // h = 800 ergäbe x = 8 und damit „Berechne: 8 · 10“ – ebenfalls ohne Komma.
        let h = rnd(11, 999);
        if (h % 100 === 0) h += 3;
        const x = h / 100;
        const [faktor, fName] = choice([[10, '· 10'], [100, '· 100'], [0.1, ': 10']]);
        const res = faktor === 0.1 ? h / 1000 : x * faktor;
        return {
          q: `Berechne: ${fmt(x)} ${fName}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `Das Komma wandert ${faktor === 0.1 ? 'eine Stelle nach links' : faktor === 10 ? 'eine Stelle nach rechts' : 'zwei Stellen nach rechts'}: ${fmt(x)} ${fName} = ${fmt(res)}`
        };
      }
      const kind = choice(['multdez', 'vergleich']);
      if (kind === 'multdez') {
        // Bei a = 10, 20, 30 wird a/10 ganzzahlig und die Aufgabe lautet „3 · 0,7“.
        // Der Lösungstext behauptet dann zwei Nachkommastellen (es ist nur eine)
        // und rechnet „30 · 7“ – eine Zahl, die aus der Aufgabe nicht herleitbar
        // ist. Beide Fehler heben sich im Ergebnis auf, der Weg bleibt falsch.
        let a = rnd(2, 30);
        if (a % 10 === 0) a += 3;
        const b = rnd(2, 9);
        const res = (a * b) / 100;
        // Wie auf Stufe 2: Endet a · b auf 0 (4 · 5 = 20), steht erst 0,20 da
        // und dann 0,2 – „2 Nachkommastellen → 0,2“ widerspräche der Zählung.
        const endnullen = (a * b) % 100 === 0 ? 2 : (a * b) % 10 === 0 ? 1 : 0;
        const abgetrennt = endnullen === 0 ? fmt(res)
          : `${fmt(res, 2)} = ${fmt(res)} (${endnullen === 1 ? 'die Null am Ende darf' : 'die Nullen am Ende dürfen'} weg)`;
        return {
          q: `Berechne: ${fmt(a / 10)} · ${fmt(b / 10)}`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `Ohne Kommas: ${fmt(a)} · ${fmt(b)} = ${fmt(a * b)}. Beide Faktoren haben zusammen 2 Nachkommastellen → ${abgetrennt}`
        };
      }
      /* ---------- Vergleichen: vier Dezimalzahlen ordnen ----------
         Vorher stand hier „Welche Zahl ist größer?“ mit den beiden Zahlen als
         Antwortmöglichkeiten. Die größere trug dabei immer weniger Stellen
         (0,3 gegen 0,27): Wer blind die kürzeste Option nahm, lag zu 100 %
         richtig, und die Falle „mehr Ziffern heißt nicht mehr Wert“ ging nur in
         eine Richtung.

         Als Vergleich ZWEIER Zahlen ist die Aufgabe nicht zu retten. Stehen die
         Zahlen selbst zur Wahl, ist „die größte Zahl“ die Antwort; stehen die
         Vergleichszeichen zur Wahl, zieht das Muster in den Fragetext um. Dort
         gilt bei höchstens drei Nachkommastellen nämlich folgender Satz: Ein
         Paar, das die Regel „nur die ersten zwei Nachkommastellen lesen“ NICHT
         entscheidet, stimmt in diesen zwei Stellen überein – dann unterscheiden
         sich die Zahlen nur noch in der letzten Ziffer, und die Quersumme der
         Nachkommaziffern zeigt zwingend in dieselbe Richtung wie der Vergleich.
         Die beiden Regeln decken jedes Paar gemeinsam ab: Wird die eine
         seltener richtig, wird die andere im selben Maß häufiger richtig. Genau
         das war an der Zwischenfassung zu messen – 89,7 % fürs Abschneiden,
         90,6 % für die Quersumme.

         Geordnet wird deshalb eine Reihe aus vier Zahlen, und zwar als Eingabe.
         Eine Faustregel muss dafür alle vier richtig einsortieren; ein einziger
         falsch gesetzter Wert kostet die ganze Aufgabe. Gemessen über 60 000
         Ziehungen, Zufall wäre 1/24 = 4,2 % (Saat 555001; über drei weitere
         Saaten nachgemessen, Abweichung unter einem halben Punkt):

           mehr / weniger Nachkommastellen heißt kleiner   39,5 / 38,1 %
           kurze Zahl blind ans Ende / an den Anfang       39,5 / 38,1 %
           Block blind an den Anfang / ans Ende            39,5 / 37,7 %
           nur die ersten zwei Nachkommastellen lesen          38,9 %
           Komma weglassen, wie ganze Zahlen vergleichen       38,1 %
           nur die Zehntelstelle lesen                         25,2 %
           Quersumme der Nachkommaziffern                      20,4 %
           letzte Ziffer                                       11,9 %
           nur die Hundertstelziffer                            8,5 %
           Reihenfolge aus der Frage übernehmen                 4,2 %

         Tiefer geht es nicht, und der Grund liegt in der Aufgabenform: Eine
         Reihenfolge zerfällt in Vergleiche, und wer alle bis auf einen wirklich
         rechnet, rät nur noch diesen einen. Das sind die Regeln um 39 % – sie
         erraten, an welcher Stelle die kurze Zahl bzw. der Block steht.
         Entscheidend ist deshalb nicht ihre Höhe, sondern dass dieses Raten ein
         Münzwurf bleibt: Beide Richtungen kommen gleich oft vor (39,5 gegen
         38,1), keine Fehlvorstellung wird belohnt. Zum Vergleich: Die im Projekt
         abgenommenen Reparaturen liegen bei 53,6 % (`vierecke`) und 43 %
         (`geraden`).

         Zwei Bauformen wechseln sich ab:

         ① Dreierblock (ein Drittel der Ziehungen): Drei Zahlen stimmen in den
            ersten zwei Nachkommastellen überein und tragen alle drei Stellen.
            Daran scheitert das Abschneiden nach zwei Stellen, und weil die drei
            gleich lang sind, hilft dort auch „die längere ist die größere“
            nicht. Die vierte, kürzere Zahl steht zwangsläufig davor oder
            dahinter – beides gleich oft.
         ② Zweierblock (zwei Drittel): dazu eine dreistellige Fernzahl und eine
            kurze Zahl. Alle sechs möglichen Anordnungen kommen gleich oft vor;
            damit steht die kurze Zahl gleich oft an jeder Stelle der Reihe, auch
            mittendrin, und der Block ebenso oft in der Mitte wie am Rand.

         Ein Drittel zu zwei Dritteln ist der Ausgleichspunkt: Mehr Dreierblöcke
         drücken das Abschneiden (dort trifft es nur 1/6), treiben aber die
         Längenregeln nach oben, weniger Dreierblöcke genau umgekehrt. */
      const stellen = w => w % 100 === 0 ? 1 : w % 10 === 0 ? 2 : 3;   // Nachkommastellen ohne Schluss-Null
      const quer = w => String(w).split('').reduce((s, c) => s + Number(c), 0);
      const letzte = w => w % 10 || Math.floor(w / 10) % 10 || Math.floor(w / 100);
      const vorn = w => Math.floor(w / 10);                            // die ersten zwei Nachkommastellen
      // Gerechnet wird in Tausendsteln, damit kein Wert an einer Rundung hängt;
      // alle vier Zahlen teilen sich den Vorkommateil.
      const ganz = choice([0, 0, 0, 0, rnd(1, 19)]);
      const dreier = rnd(1, 3) === 1;
      const basis = rnd(2, 7) * 100 + rnd(0, 9) * 10;   // Zehntel 2–7: ober- und unterhalb bleibt Platz
      const block = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, dreier ? 3 : 2).map(d => basis + d);
      const bMin = Math.min(...block), bMax = Math.max(...block);
      const qMin = Math.min(...block.map(w => quer(w))), qMax = Math.max(...block.map(w => quer(w)));
      const lMin = Math.min(...block.map(w => letzte(w))), lMax = Math.max(...block.map(w => letzte(w)));

      // Alles, was nicht zum Block gehört: andere erste zwei Nachkommastellen.
      const kurzeKand = [], langeKand = [];
      for (let w = 100; w <= 999; w++) {
        if (vorn(w) === vorn(basis)) continue;
        (stellen(w) === 3 ? langeKand : kurzeKand).push(w);
      }
      /* Zieht eine Zahl zwischen `von` und `bis`. Quersumme und letzte Ziffer
         sollen dabei in die falsche Richtung zeigen: Wer eine dieser
         Ziffernproben statt des Vergleichs benutzt, sortiert die Zahl dann
         falsch ein. In einem Viertel der Ziehungen unterbleibt der Griff –
         sonst wären die Proben systematisch falsch und damit selbst wieder
         verwertbar. */
      const zieh = (menge, von, bis, nahZehntel) => {
        let feld = menge.filter(w => w > von && w < bis);
        if (!feld.length) return null;
        if (nahZehntel) {
          // Ein Drittel der kurzen Zahlen trägt nur EINE Nachkommastelle – die
          // schärfste Form der Falle (0,6 neben 0,478), und genau die Form, mit
          // der die Erklärseite einsteigt (12,8 s gegen 12,45 s).
          const eins = feld.filter(w => stellen(w) === 1);
          const nah = feld.filter(w => Math.floor(w / 100) === Math.floor(basis / 100));
          // Sonst meist dieselbe Zehntelziffer wie der Block: Andernfalls
          // entscheidet schon die erste Nachkommastelle, und „nur die
          // Zehntelstelle lesen" träfe zu oft.
          if (eins.length && rnd(1, 3) === 1) feld = eins;
          else if (nah.length && rnd(1, 2) === 1) feld = nah;
        }
        const falle = feld.filter(w => w > bMax ? quer(w) < qMin && letzte(w) < lMax
          : quer(w) > qMax && letzte(w) > lMin);
        return choice(rnd(1, 4) <= 3 && falle.length ? falle : feld);
      };

      let zusatz = null;
      if (dreier) {
        // Ein Dreierblock lässt für die vierte Zahl nur zwei Plätze: davor oder
        // dahinter. Beide sind gleich wahrscheinlich – läge die kurze Zahl
        // meistens hinten, wäre „weniger Stellen heißt größer“ eine sichere
        // Wette, läge sie meistens vorn, träfe „Komma weglassen, wie ganze
        // Zahlen vergleichen".
        const oben = choice([true, false]);
        zusatz = [zieh(kurzeKand, oben ? bMax : 0, oben ? 1000 : bMin, true)];
      } else {
        /* Zweierblock, dazu eine dreistellige Fernzahl und eine kurze Zahl.
           Alle sechs Anordnungen werden gleich oft gezogen:

             ① fern · kurz · Block    ② kurz · fern · Block
             ③ kurz · Block · fern    ④ fern · Block · kurz
             ⑤ Block · kurz · fern    ⑥ Block · fern · kurz

           Damit steht der Block gleich oft unten, in der Mitte und oben, und die
           kurze Zahl kommt an jeder der vier Stellen vor – auch mittendrin.
           Nachgerechnet: Gleichverteilung ist hier das Optimum. Zieht man eine
           Anordnung häufiger, gewinnt sofort eine der Regeln „kurze Zahl ans
           Ende", „kurze Zahl an den Anfang“, „Block ans Ende“ oder „Block an den
           Anfang" – jede von ihnen trifft so nur ein Drittel dieser Ziehungen. */
        for (let versuch = 0; versuch < 10 && !zusatz; versuch++) {
          const anordnung = rnd(1, 6);
          const ohne = w => x => vorn(x) !== vorn(w);   // kein zweiter Block aus Versehen
          let fern = null, kurzZahl = null;
          if (anordnung === 1) {            // fern · kurz · Block
            fern = zieh(langeKand, 0, bMin, false);
            if (fern !== null) kurzZahl = zieh(kurzeKand.filter(ohne(fern)), fern, bMin, true);
          } else if (anordnung === 2) {             // kurz · fern · Block
            kurzZahl = zieh(kurzeKand, 0, bMin, true);
            if (kurzZahl !== null) fern = zieh(langeKand.filter(ohne(kurzZahl)), kurzZahl, bMin, false);
          } else if (anordnung === 3) {             // kurz · Block · fern
            kurzZahl = zieh(kurzeKand, 0, bMin, true);
            if (kurzZahl !== null) fern = zieh(langeKand.filter(ohne(kurzZahl)), bMax, 1000, false);
          } else if (anordnung === 4) {             // fern · Block · kurz
            fern = zieh(langeKand, 0, bMin, false);
            if (fern !== null) kurzZahl = zieh(kurzeKand.filter(ohne(fern)), bMax, 1000, true);
          } else if (anordnung === 5) {             // Block · kurz · fern
            kurzZahl = zieh(kurzeKand, bMax, 1000, true);
            if (kurzZahl !== null) fern = zieh(langeKand.filter(ohne(kurzZahl)), kurzZahl, 1000, false);
          } else {                          // Block · fern · kurz
            fern = zieh(langeKand, bMax, 1000, false);
            if (fern !== null) kurzZahl = zieh(kurzeKand.filter(ohne(fern)), fern, 1000, true);
          }
          if (fern !== null && kurzZahl !== null) zusatz = [fern, kurzZahl];
        }
        // Notnagel, falls kein Platz frei war: je eine kurze Zahl ober- und unterhalb
        if (!zusatz) zusatz = [zieh(kurzeKand, bMax, 1000, true), zieh(kurzeKand, 0, bMin, true)];
      }
      const zahlen = block.concat(zusatz);

      const sortiert = [...zahlen].sort((a, b) => a - b);
      const zeige = w => fmt(ganz + w / 1000, stellen(w));
      const voll = w => fmt(ganz + w / 1000, 3);          // mit Nullen auf drei Stellen aufgefüllt
      const gemischt = shuffle(zahlen);
      const kurz = Math.min(...zahlen.map(w => stellen(w)));
      const kuerzeste = zahlen.filter(w => stellen(w) === kurz);
      const schluss = kuerzeste.includes(sortiert[3])
        ? 'Die Zahl mit den wenigsten Ziffern ist hier die größte – die Anzahl der Stellen sagt nichts über den Wert.'
        : kuerzeste.includes(sortiert[0])
          ? 'Diesmal ist die kürzeste Zahl wirklich die kleinste. Auch das ist kein Merkmal, sondern das Ergebnis der Rechnung.'
          : 'Die kürzeste Zahl steht mitten in der Reihe – aus der Anzahl der Ziffern folgt gar nichts.';
      const vorspann = ganz > 0 ? `Vor dem Komma steht überall ${fmt(ganz)}, es entscheiden also die Nachkommastellen. ` : '';
      return {
        q: `Ordne der Größe nach, die kleinste zuerst: ${gemischt.map(w => zeige(w)).join('; ')} ` +
          '<span class="hint">Gib die vier Zahlen mit Semikolon getrennt ein.</span>',
        type: 'input', placeholder: 'z. B. 0,3; 0,45; 0,5; 0,7',
        check: orderedCheck(sortiert.map(w => ganz + w / 1000)),
        testAnswer: sortiert.map(w => zeige(w)).join('; '),
        answerText: sortiert.map(w => zeige(w)).join(' &lt; '),
        solution: `${vorspann}Zuerst alle auf drei Nachkommastellen auffüllen; angehängte Nullen ändern den Wert nicht: ` +
          `${gemischt.map(w => voll(w)).join('; ')}.<br>` +
          `In Tausendsteln gerechnet: ${sortiert.map(w => fmt(w)).join(' &lt; ')}.<br>` +
          `Der Größe nach also <strong>${sortiert.map(w => zeige(w)).join(' &lt; ')}</strong>.<br>${schluss}`
      };
    }
  };

  /* ---------- Einheiten ---------- */

  const einheiten = {
    id: 'einheiten',
    icon: 'm→cm',
    title: 'Einheiten umrechnen',
    tagline: 'Längen, Gewichte, Zeiten und Flächen',
    learn: `
      <h2>Einheiten sicher umrechnen</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Die wichtigsten Umrechnungszahlen</span>
        <ul>
          <li><strong>Längen:</strong> 1 km = 1000 m · 1 m = 100 cm · 1 cm = 10 mm</li>
          <li><strong>Gewichte:</strong> 1 t = 1000 kg · 1 kg = 1000 g</li>
          <li><strong>Zeit:</strong> 1 h = 60 min · 1 min = 60 s</li>
          <li><strong>Flächen:</strong> 1 m² = 100 dm² = 10&nbsp;000 cm² (Umrechnungszahl 100!)</li>
        </ul>
      </div>
      <p>In die <strong>kleinere</strong> Einheit: multiplizieren. In die <strong>größere</strong>: dividieren.</p>
      <div class="example-box"><span class="ex-title">Beispiele</span>
        <p>3,5 km = 3,5 · 1000 m = <strong>3500 m</strong><br>
        250 cm = 250 : 100 m = <strong>2,5 m</strong><br>
        2 h 15 min = 120 min + 15 min = <strong>135 min</strong></p>
      </div>
      <p><em>Achtung bei Flächen:</em> Zwischen m² und dm² liegt Faktor 100 (nicht 10), denn beide Richtungen werden umgerechnet.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const arten = [
          () => { const a = rnd(2, 30); return [a, 'm', a * 100, 'cm', '1 m = 100 cm']; },
          () => { const a = rnd(2, 25); return [a, 'cm', a * 10, 'mm', '1 cm = 10 mm']; },
          () => { const a = rnd(2, 15); return [a, 'kg', a * 1000, 'g', '1 kg = 1000 g']; },
          () => { const a = rnd(2, 12); return [a, 'min', a * 60, 's', '1 min = 60 s']; },
          () => { const a = rnd(2, 12); return [a, 'h', a * 60, 'min', '1 h = 60 min']; }
        ];
        const [wert, von, res, nach, regel] = choice(arten)();
        return {
          q: `Wandle um: ${fmt(wert)} ${von} = ? ${nach}`, type: 'input', placeholder: `in ${nach}`,
          check: numCheck(res, 1e-6, { falscheEinheit: von }), testAnswer: String(res), answerText: `${fmt(res)} ${nach}`,
          solution: `${regel}. Also: ${fmt(wert)} ${von} = ${fmt(wert)} · ${Math.round(res / wert)} ${nach} = ${fmt(res)} ${nach}`
        };
      }
      if (diff === 2) {
        const arten = [
          // z darf kein Vielfaches von 10 sein: Sonst wird aus z/10 eine ganze
          // Zahl und die Aufgabe ist wortgleich mit Stufe 1 („2 m = ? cm“).
          () => { const z = rndNonZehner(11, 99); return [z / 10, 'km', z * 100, 'm', true, 1000, '1 km = 1000 m']; },
          () => { const c = rnd(110, 999); return [c, 'cm', c / 100, 'm', false, 100, '1 m = 100 cm']; },
          () => { const g = rnd(1100, 9900); return [g, 'g', g / 1000, 'kg', false, 1000, '1 kg = 1000 g']; },
          () => { const z = rndNonZehner(11, 79); return [z / 10, 'm', z * 10, 'cm', true, 100, '1 m = 100 cm']; }
        ];
        const [wert, von, res, nach, mal, faktor, regel] = choice(arten)();
        // Der Weg beginnt mit der Entscheidung, auf die die Erklärseite das
        // Verfahren baut („Ist die Zieleinheit kleiner oder größer?“). Vorher
        // stand nur „Rechne : 1000: 8427 g = …“ – ohne Grund für die Rechenart,
        // und Geteiltzeichen und Doppelpunkt stießen aneinander.
        return {
          q: `Wandle um: ${fmt(wert)} ${von} = ? ${nach}`, type: 'input', placeholder: `in ${nach}`,
          check: numCheck(res, 1e-6, { falscheEinheit: von }), testAnswer: String(res), answerText: `${fmt(res)} ${nach}`,
          solution: `Die Zieleinheit ${nach} ist ${mal ? 'kleiner' : 'größer'} als ${von} → ${mal ? 'multiplizieren' : 'dividieren'}.<br>` +
            `${regel}, also ${fmt(wert)} ${von} = ${fmt(wert)} ${mal ? '·' : ':'} ${fmt(faktor)} ${nach} = ${fmt(res)} ${nach}`
        };
      }
      const kind = choice(['zeit', 'flaeche']);
      if (kind === 'zeit') {
        const h = rnd(1, 5), m = rnd(5, 55);
        const res = h * 60 + m;
        return {
          q: `Wandle um: ${h} h ${m} min = ? min`, type: 'input', placeholder: 'in min',
          check: numCheck(res), testAnswer: String(res), answerText: `${res} min`,
          solution: `${h} h = ${h * 60} min. Dann: ${h * 60} min + ${m} min = ${res} min`
        };
      }
      const arten = [
        () => { const a = rnd(2, 9); return [a, 'm²', a * 10000, 'cm²', '1 m² = 10 000 cm²']; },
        () => { const a = rnd(2, 20); return [a, 'm²', a * 100, 'dm²', '1 m² = 100 dm²']; },
        () => { const a = rnd(2, 9) * 100; return [a, 'dm²', a / 100, 'm²', '100 dm² = 1 m²']; }
      ];
      const [wert, von, res, nach, regel] = choice(arten)();
      return {
        q: `Wandle um: ${fmt(wert)} ${von} = ? ${nach}`, type: 'input', placeholder: `in ${nach}`,
        check: numCheck(res, 1e-6, { falscheEinheit: von }), testAnswer: String(res), answerText: `${fmt(res)} ${nach}`,
        solution: `Bei Flächen ist die Umrechnungszahl 100 pro Einheitenschritt (Länge · Breite!).<br>${regel}, also ${fmt(wert)} ${von} = ${fmt(res)} ${nach}`
      };
    }
  };

  /* ---------- Dreisatz ---------- */

  const dreisatz = {
    id: 'dreisatz',
    icon: 'a:b',
    title: 'Dreisatz & Zuordnungen',
    tagline: 'Proportional und antiproportional rechnen',
    learn: `
      <h2>Der Dreisatz</h2>
      <p>Der Dreisatz löst Alltagsaufgaben in drei Schritten: <strong>gegeben → auf 1 zurückrechnen → auf die gesuchte Menge hochrechnen</strong>.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Zwei Arten von Zuordnungen</span>
        <ul>
          <li><strong>Proportional</strong> („je mehr, desto mehr“): doppelte Menge → doppelter Preis. Rechne <em>: dann ·</em></li>
          <li><strong>Antiproportional</strong> („je mehr, desto weniger“): doppelt so viele Arbeiter → halbe Zeit. Rechne <em>· dann :</em></li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: proportional</span>
        <p>3 Brötchen kosten 1,20 €. Was kosten 7?<br>
        1 Brötchen: 1,20 € : 3 = 0,40 € → 7 Brötchen: 0,40 € · 7 = <strong>2,80 €</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: antiproportional</span>
        <p>4 Pumpen brauchen 6 h. Wie lange brauchen 3 Pumpen?<br>
        1 Pumpe: 6 h · 4 = 24 h → 3 Pumpen: 24 h : 3 = <strong>8 h</strong></p>
      </div>
    `,
    gen(diff) {
      if (diff === 1) {
        // Einzahl als Paar hinterlegt: Aus "Brötchen" per Regel "Brötch" und
        // aus "Äpfel" "Äpfel" zu machen, ging in der Lösungszeile schief.
        const dinge = [
          { pl: 'Brötchen', sg: 'Brötchen' },
          { pl: 'Äpfel', sg: 'Apfel' },
          { pl: 'Hefte', sg: 'Heft' },
          { pl: 'Stifte', sg: 'Stift' }
        ];
        const n1 = rnd(2, 6);
        const unitCt = choice([30, 40, 50, 60, 70, 80, 90, 110, 120]);
        let n2 = rnd(2, 12);
        while (n2 === n1) n2 = rnd(2, 12);
        const ding = choice(dinge);
        const p1 = (n1 * unitCt) / 100, res = (n2 * unitCt) / 100;
        return {
          q: `${n1} ${ding.pl} kosten ${fmt(p1, 2)} €. Wie viel kosten ${n2} ${ding.pl} (in €)?`,
          type: 'input', placeholder: 'Preis in €',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res, 2)} €`,
          solution: `Dreisatz (proportional):<br>1 ${ding.sg}: ${fmt(p1, 2)} € : ${n1} = ${fmt(unitCt / 100, 2)} €<br>` +
            `${n2} ${ding.pl}: ${fmt(unitCt / 100, 2)} € · ${n2} = ${fmt(res, 2)} €`
        };
      }
      if (diff === 2) {
        const r = rnd(20, 90), t1 = rnd(2, 8);
        let t2 = rnd(2, 12);
        while (t2 === t1) t2 = rnd(2, 12);
        const n1 = r * t1, res = r * t2;
        return {
          q: `Eine Maschine füllt in ${t1} Minuten ${n1} Flaschen ab. Wie viele Flaschen schafft sie in ${t2} Minuten?`,
          type: 'input', placeholder: 'Anzahl Flaschen',
          check: numCheck(res), testAnswer: String(res), answerText: `${res} Flaschen`,
          solution: `Proportional („je mehr Zeit, desto mehr Flaschen“):<br>` +
            `1 Minute: ${n1} : ${t1} = ${r} Flaschen<br>${t2} Minuten: ${r} · ${t2} = ${res} Flaschen`
        };
      }
      const total = choice([24, 36, 48, 60, 72, 120]);
      const teiler = [2, 3, 4, 6].filter(d => total % d === 0);
      const n1 = choice(teiler);
      let n2 = choice(teiler.concat([total % 8 === 0 ? 8 : 2]));
      while (n2 === n1) n2 = choice(teiler);
      const t1 = total / n1, res = total / n2;
      const szenario = choice([
        [`${n1} Pumpen leeren ein Becken in ${t1} Stunden. Wie lange brauchen ${n2} Pumpen (in h)?`, 'Pumpen', 'h', 'in h'],
        [`${n1} Maler streichen eine Halle in ${t1} Tagen. Wie lange brauchen ${n2} Maler (in Tagen)?`, 'Maler', 'Tage', 'in Tagen']
      ]);
      return {
        q: szenario[0], type: 'input', placeholder: szenario[3],
        check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)} ${szenario[2]}`,
        solution: `Antiproportional („je mehr ${szenario[1]}, desto weniger Zeit“):<br>` +
          `1 ${szenario[1].replace(/n$/, '')} bräuchte: ${t1} · ${n1} = ${total}<br>` +
          `${n2} ${szenario[1]}: ${total} : ${n2} = ${fmt(res)} ${szenario[2]}`
      };
    }
  };

  /* ---------- Winkel ---------- */

  const winkel = {
    id: 'winkel',
    icon: '180°',   // „∠“ setzt die Anzeigeschrift nicht: ein winziger Haken in der Kachel
    title: 'Winkel',
    tagline: 'Winkelsummen und Winkelarten berechnen',
    learn: `
      <h2>Winkel berechnen</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Die wichtigsten Winkelsätze</span>
        <ul>
          <li>Winkelsumme im <strong>Dreieck</strong>: α + β + γ = <strong>180°</strong></li>
          <li>Winkelsumme im <strong>Viereck</strong>: <strong>360°</strong></li>
          <li><strong>Nebenwinkel</strong> ergänzen sich zu 180°, <strong>Scheitelwinkel</strong> sind gleich groß.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Dreieck</span>
        <p>α = 65°, β = 48° → γ = 180° − 65° − 48° = <strong>67°</strong></p>
      </div>
      <h3>Gleichschenklige Dreiecke</h3>
      <p>Die beiden <strong>Basiswinkel sind gleich groß</strong>. Mit der Winkelsumme gilt:
      Spitzenwinkel = 180° − 2 · Basiswinkel.</p>
      <p><em>Winkelarten:</em> spitz (&lt; 90°), rechter Winkel (90°), stumpf (90°–180°), gestreckt (180°).</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const a = rnd(25, 100);
        const b = rnd(20, 160 - a);
        const g = 180 - a - b;
        return {
          q: `In einem Dreieck sind α = ${a}° und β = ${b}°. Wie groß ist γ (in °)?`,
          type: 'input', placeholder: 'γ in °',
          check: numCheck(g), testAnswer: String(g), answerText: `γ = ${g}°`,
          solution: `Winkelsumme im Dreieck: 180°.<br>γ = 180° − ${a}° − ${b}° = ${g}°`
        };
      }
      if (diff === 2) {
        const kind = choice(['neben', 'gleichschenklig']);
        if (kind === 'neben') {
          const a = rnd(15, 165);
          return {
            q: `Ein Winkel misst α = ${a}°. Wie groß ist sein Nebenwinkel (in °)?`,
            type: 'input', placeholder: 'in °',
            check: numCheck(180 - a), testAnswer: String(180 - a), answerText: `${180 - a}°`,
            solution: `Nebenwinkel ergänzen sich zu 180°: 180° − ${a}° = ${180 - a}°`
          };
        }
        const basis = rnd(20, 80);
        const spitze = 180 - 2 * basis;
        return {
          q: `Ein gleichschenkliges Dreieck hat die Basiswinkel β = ${basis}°. Wie groß ist der Winkel an der Spitze (in °)?`,
          type: 'input', placeholder: 'in °',
          check: numCheck(spitze), testAnswer: String(spitze), answerText: `${spitze}°`,
          solution: `Beide Basiswinkel sind gleich: 2 · ${basis}° = ${2 * basis}°.<br>Spitze: 180° − ${2 * basis}° = ${spitze}°`
        };
      }
      const kind = choice(['viereck', 'gleichschenkligRueck']);
      if (kind === 'viereck') {
        const a = rnd(60, 120), b = rnd(60, 120);
        // Den dritten Winkel an die ersten beiden koppeln, damit der gesuchte
        // vierte zwischen 50° und 160° bleibt: ab 180° wäre das Viereck nach
        // innen geknickt und passte nicht zu der Skizze im Kopf.
        const c = rnd(Math.max(40, 200 - a - b), Math.min(100, 310 - a - b));
        const d = 360 - a - b - c;
        return {
          q: `In einem Viereck sind drei Winkel bekannt: ${a}°, ${b}° und ${c}°. Wie groß ist der vierte Winkel (in °)?`,
          type: 'input', placeholder: 'in °',
          check: numCheck(d), testAnswer: String(d), answerText: `${d}°`,
          solution: `Winkelsumme im Viereck: 360°.<br>${a}° + ${b}° + ${c}° = ${a + b + c}° → vierter Winkel: 360° − ${a + b + c}° = ${d}°`
        };
      }
      const spitze = 2 * rnd(10, 70);
      const basis = (180 - spitze) / 2;
      return {
        q: `Ein gleichschenkliges Dreieck hat an der Spitze den Winkel γ = ${spitze}°. Wie groß ist jeder Basiswinkel (in °)?`,
        type: 'input', placeholder: 'in °',
        check: numCheck(basis), testAnswer: String(basis), answerText: `${basis}°`,
        solution: `Für die beiden gleichen Basiswinkel bleiben 180° − ${spitze}° = ${180 - spitze}°.<br>Jeder Basiswinkel: ${180 - spitze}° : 2 = ${basis}°`
      };
    }
  };

  /* ============================================================
     Symmetrie (Klasse 5–7)
  
     Bisher stand in der Unterstufe nur „winkel“ an Geometrie. Symmetrie
     kommt in Klasse 5/6 aber überall vor – und sie bringt nebenbei das
     Koordinatensystem mit, das in der Unterstufe ebenfalls fehlte.
  
     Stufe 1 arbeitet ohne Koordinaten (falten und drehen), Stufe 2
     spiegelt an den Achsen und am Ursprung, Stufe 3 an beliebigen
     waagerechten/senkrechten Geraden und an einem beliebigen Zentrum.
  
     Sprache: Zielgruppe sind Elf- bis Dreizehnjährige. Kurze Sätze,
     konkrete Dinge statt Variablen, keine Algebra. Gemessen: 9,6 Wörter
     je Satz im Schnitt, Median 8 – kürzer als „dezimalzahlen“ (10,4 / 9)
     und „winkel“ (9,8 / 9), mit derselben Methode gezählt.
     ============================================================ */
  
  const SYM_TRENN = '&ensp;<span class="trenn">•</span>&ensp;';
  
  /* Das Antwortformat steht im Fragetext, nicht im Tipp: In der Challenge
     gibt es keinen Tipp-Knopf, dort wäre der Hinweis sonst unsichtbar. */
  const SYM_KOORD = '<span class="hint">Gib beide Koordinaten mit Semikolon getrennt ein, z. B. 3; −2.</span>';
  
  /** Punkt in der Ebene: P(3 | −4). Beide Zahlen über fmt – sonst steht dort
      der ASCII-Bindestrich statt des echten Minuszeichens. */
  function symPunkt(name, x, y) { return `${name}(${fmt(x)} | ${fmt(y)})`; }
  
  /* Figur · Anzahl der Symmetrieachsen · Begründung.
     Gezogen wird erst die ANZAHL, dann eine Figur dazu. Andersherum käme
     „1 Achse“ viermal so oft vor wie „3 Achsen“ – und die häufigste Antwort
     ließe sich raten, ohne die Figur anzusehen. Gemessen liegt jede der acht
     Anzahlen jetzt bei 4,2 bis 4,4 % der Stufe. */
  const SYM_FIGUREN = [
    [0, 'ein schiefes Parallelogramm (kein Rechteck und keine Raute)',
      'Keine Faltlinie passt: Faltet man längs einer Diagonale, kippt die schiefe Form zur Seite. Das Parallelogramm ist nur punktsymmetrisch.'],
    [0, 'ein Dreieck mit drei verschieden langen Seiten',
      'Eine Symmetrieachse müsste zwei gleich lange Seiten aufeinanderlegen. Hier ist keine Seite so lang wie eine andere.'],
    [1, 'ein gleichschenkliges Dreieck, das nicht gleichseitig ist',
      'Die Achse läuft von der Spitze senkrecht auf die Basis. Die beiden gleich langen Schenkel liegen dann genau aufeinander.'],
    [1, 'ein gleichschenkliges Trapez',
      'Die Achse steht senkrecht auf den beiden parallelen Seiten und geht durch ihre Mitten.'],
    /* Nicht „die lange Diagonale“: Beim Drachen A(0 | 1), B(3 | 0), C(0 | −4),
       D(−3 | 0) ist die Achse AC 5 lang, BD aber 6. Die Achse ist die Diagonale
       durch die Ecken zwischen gleich langen Seiten – wie auf der vierecke-Seite. */
    [1, 'ein Drachenviereck, das keine Raute ist',
      'Achse ist nur eine Diagonale. Sie verbindet die beiden Ecken, an denen gleich lange Seiten zusammenstoßen. Die andere Diagonale trennt die kurzen Seiten von den langen.'],
    [1, 'ein Halbkreis',
      'Nur die Senkrechte durch die Mitte des Durchmessers passt.'],
    [2, 'ein Rechteck, das kein Quadrat ist',
      'Die beiden Mittellinien der Seiten sind Achsen. Die Diagonalen sind es nicht – dafür müssten alle vier Seiten gleich lang sein.'],
    [2, 'eine Raute, die kein Quadrat ist',
      'Beide Diagonalen sind Achsen. Die Mittellinien der Seiten sind es nicht.'],
    [3, 'ein gleichseitiges Dreieck',
      'Von jeder Ecke führt eine Achse senkrecht auf die gegenüberliegende Seite. Das sind drei.'],
    [4, 'ein Quadrat',
      'Zwei Mittellinien und zwei Diagonalen, zusammen vier.'],
    [5, 'ein regelmäßiges Fünfeck',
      'Ein regelmäßiges Vieleck hat so viele Achsen, wie es Ecken hat. Jede führt von einer Ecke zur Mitte der gegenüberliegenden Seite.'],
    [6, 'ein regelmäßiges Sechseck',
      'Ein regelmäßiges Vieleck hat so viele Achsen, wie es Ecken hat. Drei gehen durch gegenüberliegende Ecken, drei durch gegenüberliegende Seitenmitten.'],
    [8, 'ein regelmäßiges Achteck',
      'Ein regelmäßiges Vieleck hat so viele Achsen, wie es Ecken hat. Vier gehen durch gegenüberliegende Ecken, vier durch gegenüberliegende Seitenmitten.']
  ];
  const SYM_ACHSENZAHLEN = [...new Set(SYM_FIGUREN.map(f => f[0]))];
  
  /* Großbuchstaben in Druckschrift.
     Bewusst nur Buchstaben mit SENKRECHTER Achse als richtige Antwort: Ob B, C,
     D, E und K eine waagerechte Achse haben, hängt an der Schriftart (die untere
     Rundung des B ist meist größer als die obere). Auf der Erklärseite werden sie
     erwähnt, als Aufgabenlösung wären sie streitbar. */
  const SYM_ACHSE_JA = {
    A: 'Die senkrechte Achse läuft durch die Spitze und legt die beiden Schrägen aufeinander.',
    H: 'Gleich zwei Achsen: eine senkrecht, eine waagerecht durch den Querbalken.',
    I: 'Eine senkrechte und eine waagerechte Achse durch die Mitte.',
    M: 'Die senkrechte Achse in der Mitte legt die beiden Zacken aufeinander.',
    O: 'Eine senkrechte und eine waagerechte Achse durch den Mittelpunkt.',
    T: 'Die senkrechte Achse läuft mitten durch den Stamm.',
    U: 'Die senkrechte Achse in der Mitte legt die beiden Schenkel aufeinander.',
    V: 'Die senkrechte Achse durch die Spitze legt die beiden Striche aufeinander.',
    W: 'Die senkrechte Achse in der Mitte legt beide Hälften aufeinander.',
    X: 'Eine senkrechte und eine waagerechte Achse durch den Kreuzungspunkt.',
    Y: 'Die senkrechte Achse läuft durch Stamm und Gabelung.'
  };
  const SYM_ACHSE_NEIN = ['F', 'G', 'J', 'L', 'N', 'P', 'R', 'S', 'Z'];
  
  const SYM_PUNKT_JA = {
    H: 'Der Querbalken liegt in der Mitte, oben und unten sind gleich.',
    I: 'Um 180° gedreht steht das I unverändert da.',
    N: 'Die halbe Drehung vertauscht oben und unten – beim N passt das genau.',
    O: 'Nach der halben Drehung sieht der Kreis unverändert aus.',
    S: 'Oberer und unterer Bogen tauschen bei der halben Drehung die Plätze.',
    X: 'Nach der halben Drehung liegen die vier Arme wieder gleich.',
    Z: 'Die halbe Drehung vertauscht den oberen und den unteren Balken.'
  };
  const SYM_PUNKT_NEIN = ['A', 'C', 'D', 'E', 'F', 'G', 'J', 'K', 'L', 'M', 'P', 'R', 'T', 'U', 'V', 'W', 'Y'];

  /* Warum ein Ablenker der Buchstabenfrage nicht passt – je Buchstabe ein
     eigener Satz, der für genau diesen Buchstaben gilt. Bei der Achsenfrage
     sind N, S und Z die eigentliche Falle: punkt-, aber nicht achsensymmetrisch.
     Bei der Punktfrage nennen nur A, M, T, U, V, W und Y ihre (senkrechte)
     Achse; bei C, D, E und K hängt die waagerechte an der Schriftart (siehe
     oben), dort steht nur, was die halbe Drehung verändert. Kein Satz nennt
     einen Buchstaben, der bei derselben Frage richtig sein könnte. */
  const SYM_ACHSE_FEHL = {
    F: 'Das F lässt sich nicht falten: Beide Balken zeigen nach rechts, unten ist keiner.',
    G: 'Das G lässt sich nicht falten: Der Haken rechts unten hat kein Gegenstück.',
    J: 'Das J lässt sich nicht falten: Der Bogen unten links hat kein Gegenstück.',
    L: 'Das L lässt sich nicht falten: Der Fuß sitzt nur unten rechts und ist kürzer als der Stamm.',
    N: 'Das N ist nur punktsymmetrisch: Um 180° gedreht passt es, gefaltet entsteht ein verkehrtes N.',
    P: 'Das P lässt sich nicht falten: Der Bogen sitzt nur oben rechts.',
    R: 'Das R lässt sich nicht falten: Oben rechts sitzt ein Bogen, unten rechts ein schräges Bein.',
    S: 'Das S ist nur punktsymmetrisch: Um 180° gedreht passt es, gefaltet entsteht ein verkehrtes S.',
    Z: 'Das Z ist nur punktsymmetrisch: Um 180° gedreht passt es, gefaltet entsteht ein verkehrtes Z.'
  };
  const SYM_PUNKT_FEHL = {
    A: 'Das A ist nur achsensymmetrisch: Um 180° gedreht zeigt die Spitze nach unten.',
    C: 'Um 180° gedreht öffnet sich das C nach links statt nach rechts.',
    D: 'Um 180° gedreht sitzt der Bogen des D links statt rechts.',
    E: 'Um 180° gedreht zeigen die Balken des E nach links statt nach rechts.',
    F: 'Um 180° gedreht hängen die Balken des F unten links statt oben rechts.',
    G: 'Um 180° gedreht liegt der Haken des G links oben statt rechts unten.',
    J: 'Um 180° gedreht hängt der Bogen des J oben statt unten.',
    K: 'Um 180° gedreht zeigen die Schrägen des K nach links statt nach rechts.',
    L: 'Um 180° gedreht steht der Fuß des L oben statt unten.',
    // Nicht „wird daraus ein W“: In vielen Schriften hat das M senkrechte
    // Außenstriche, das W schräge – gedreht entsteht dann kein W.
    M: 'Das M ist nur achsensymmetrisch: Um 180° gedreht zeigt die Spitze in der Mitte nach oben.',
    P: 'Um 180° gedreht sitzt der Bogen des P unten statt oben.',
    R: 'Um 180° gedreht zeigt das Bein des R nach links oben statt nach rechts unten.',
    T: 'Das T ist nur achsensymmetrisch: Um 180° gedreht hängt der Balken unten.',
    U: 'Das U ist nur achsensymmetrisch: Um 180° gedreht ist es unten offen statt oben.',
    V: 'Das V ist nur achsensymmetrisch: Um 180° gedreht zeigt die Spitze nach oben.',
    W: 'Das W ist nur achsensymmetrisch: Um 180° gedreht zeigt die Spitze in der Mitte nach unten.',
    Y: 'Das Y ist nur achsensymmetrisch: Um 180° gedreht steht die Gabelung unten.'
  };

  /* Die vier Antwortmöglichkeiten der Einordnungsaufgabe – fest, damit die
     Optionszahl über alle Ziehungen konstant vier bleibt. */
  const SYM_EINORDNUNG = ['nur achsensymmetrisch', 'nur punktsymmetrisch',
    'achsen- und punktsymmetrisch', 'keines von beiden'];

  /* Warum eine Einordnung nicht passt: SYM_EINORDNUNG_FEHL[richtig][gewählt].
     Die vier Klassen sind die vier Ausgänge von Falt- und Drehprobe; der Grund
     nennt die Probe, die anders ausgeht, als die gewählte Klasse behauptet.
     Er gilt für jedes Objekt der Klasse, weil er nur vom Probenausgang
     spricht, nicht vom Objekt. */
  const SYM_FALT_JA = 'Die Faltprobe gelingt hier: Es gibt eine Faltlinie, an der beide Hälften genau aufeinanderliegen.';
  const SYM_FALT_NEIN = 'Die Faltprobe scheitert hier: Keine Faltlinie legt beide Hälften genau aufeinander.';
  const SYM_DREH_JA = 'Die Drehprobe gelingt hier: Um 180° gedreht sieht die Figur genauso aus wie vorher.';
  const SYM_DREH_NEIN = 'Die Drehprobe scheitert hier: Um 180° gedreht sieht die Figur anders aus als vorher.';
  /* Die Diagonale der Tafel (beide Proben anders als gewählt) nennt nur die
     Faltprobe: Beide Proben zu nennen hieße, die richtige Klasse mit anderen
     Worten zu beschreiben – der zweite Versuch wäre geschenkt. So bleiben
     nach jedem Grund zwei Antworten offen. */
  const SYM_EINORDNUNG_FEHL = [
    /* richtig: nur achsensymmetrisch */
    [null, 'Hier gibt es eine Faltlinie – „nur punktsymmetrisch“ schließt das aus.', SYM_DREH_NEIN, SYM_FALT_JA],
    /* richtig: nur punktsymmetrisch */
    ['Hier gibt es keine Faltlinie – „nur achsensymmetrisch“ verlangt aber eine.', null, SYM_FALT_NEIN, SYM_DREH_JA],
    /* richtig: achsen- und punktsymmetrisch */
    [SYM_DREH_JA, SYM_FALT_JA, null, 'Hier gibt es eine Faltlinie – „keines von beiden“ schließt das aus.'],
    /* richtig: keines von beiden */
    [SYM_FALT_NEIN, SYM_DREH_NEIN, 'Hier gibt es keine Faltlinie – „achsen- und punktsymmetrisch“ verlangt aber eine.', null]
  ];

  /* Je Objekt: Name · Ergebnis der Faltprobe · Ergebnis der Drehprobe.
     Der Lösungsweg führt beide Proben vor, nicht nur die entscheidende –
     sonst lernt man die eine Hälfte nie. Gezogen wird erst die KLASSE,
     dann ein Objekt daraus; gemessen liegt jede der vier Antworten damit
     bei 8,1 bis 8,6 % der Stufe. */
  const SYM_OBJEKTE = [
    [ /* 0 – nur achsensymmetrisch */
      ['ein gleichseitiges Dreieck', 'Drei Faltlinien passen, jede von einer Ecke zur gegenüberliegenden Seitenmitte.', 'Die halbe Drehung stellt die Spitze nach unten. Die Figur deckt sich nicht mehr.'],
      ['ein gleichschenkliges Trapez', 'Eine Faltlinie steht senkrecht auf den beiden parallelen Seiten.', 'Nach der halben Drehung läge die kurze Seite unten. Das passt nicht.'],
      // Die Drehprobe sprach von „der spitzen und der stumpfen Ecke“ – die beiden
      // Ecken auf der Achse können aber auch beide stumpf oder beide spitz sein.
      ['ein Drachenviereck, das keine Raute ist', 'Faltlinie ist die Diagonale, an deren Enden gleich lange Seiten zusammenstoßen. Beide Hälften decken sich.', 'Die halbe Drehung müsste die Ecke zwischen den kurzen Seiten auf die zwischen den langen legen. Das passt nicht.'],
      ['ein Schmetterling mit ausgebreiteten Flügeln', 'Die Faltlinie läuft längs durch den Körper.', 'Um 180° gedreht steht er auf dem Kopf.'],
      ['ein Herz', 'Die senkrechte Faltlinie durch die Spitze passt.', 'Um 180° gedreht zeigt die Spitze nach oben.'],
      ['ein Halbkreis', 'Die Senkrechte durch die Mitte des Durchmessers passt.', 'Um 180° gedreht wölbt er sich nach unten.'],
      ['der Großbuchstabe A', 'Eine senkrechte Faltlinie durch die Spitze passt.', 'Um 180° gedreht steht das A auf dem Kopf.'],
      ['der Großbuchstabe T', 'Eine senkrechte Faltlinie durch den Stamm passt.', 'Um 180° gedreht hängt der Balken unten.'],
      ['der Großbuchstabe M', 'Die senkrechte Faltlinie in der Mitte passt.', 'Um 180° gedreht zeigt die Spitze in der Mitte nach oben.']
    ],
    [ /* 1 – nur punktsymmetrisch */
      ['ein schiefes Parallelogramm (kein Rechteck und keine Raute)', 'Keine Faltlinie passt, auch die Diagonalen nicht.', 'Die halbe Drehung um den Schnittpunkt der Diagonalen passt genau.'],
      ['ein Windrad mit vier gleichen, gebogenen Flügeln', 'Jede Faltung kehrt die Drehrichtung um. Dann passen die Flügel nicht mehr.', 'Die halbe Drehung bringt jeden Flügel auf den übernächsten.'],
      ['eine Spielkarte mit doppeltem Bild', 'Falten geht nicht: Das untere Bild steht auf dem Kopf, es ist nicht gespiegelt.', 'Auf den Kopf gestellt sieht die Karte genauso aus wie vorher.'],
      ['der Großbuchstabe S', 'Jede Faltung lässt zwei ungleiche Hälften übrig.', 'Um 180° gedreht sieht das S unverändert aus.'],
      ['der Großbuchstabe N', 'Weder senkrecht noch waagerecht lässt sich das N falten.', 'Die halbe Drehung vertauscht oben und unten. Beim N passt das.'],
      ['der Großbuchstabe Z', 'Keine Faltlinie legt die beiden Balken aufeinander.', 'Um 180° gedreht steht dort wieder ein Z.']
    ],
    [ /* 2 – achsen- und punktsymmetrisch */
      ['ein Quadrat', 'Vier Faltlinien passen: zwei Mittellinien und zwei Diagonalen.', 'Die halbe Drehung um den Mittelpunkt passt ebenfalls.'],
      ['ein Rechteck, das kein Quadrat ist', 'Die beiden Mittellinien der Seiten sind Faltlinien.', 'Die halbe Drehung um den Mittelpunkt passt.'],
      ['eine Raute, die kein Quadrat ist', 'Beide Diagonalen sind Faltlinien.', 'Die halbe Drehung um den Schnittpunkt der Diagonalen passt.'],
      ['ein Kreis', 'Jede Gerade durch den Mittelpunkt ist eine Faltlinie.', 'Jede Drehung um den Mittelpunkt passt, auch die um 180°.'],
      ['ein regelmäßiges Sechseck', 'Sechs Faltlinien passen, so viele wie es Ecken hat.', 'Die Eckenzahl ist gerade, deshalb bringt die halbe Drehung jede Ecke auf die gegenüberliegende.'],
      ['der Großbuchstabe H', 'Eine senkrechte und eine waagerechte Faltlinie passen.', 'Um 180° gedreht steht dort wieder ein H.'],
      ['der Großbuchstabe O', 'Senkrecht und waagerecht lässt sich das O falten.', 'Um 180° gedreht sieht es unverändert aus.'],
      ['der Großbuchstabe X', 'Senkrecht und waagerecht durch den Kreuzungspunkt passt es.', 'Die halbe Drehung bringt jeden Arm auf den gegenüberliegenden.'],
      ['der Großbuchstabe I', 'Eine senkrechte und eine waagerechte Faltlinie passen.', 'Um 180° gedreht steht dort wieder ein I.']
    ],
    [ /* 3 – keines von beiden */
      ['ein Dreieck mit drei verschieden langen Seiten', 'Eine Faltlinie müsste zwei gleich lange Seiten aufeinanderlegen. Die gibt es nicht.', 'Bei der halben Drehung müsste jede Ecke auf eine andere fallen. Bei drei Ecken bleibt immer eine übrig.'],
      ['ein Viereck mit vier verschieden langen Seiten', 'Keine Faltlinie legt zwei gleich lange Seiten aufeinander.', 'Dafür müssten gegenüberliegende Seiten gleich lang und parallel sein.'],
      ['der Großbuchstabe F', 'Keine Faltlinie passt, beide Balken sitzen oben.', 'Um 180° gedreht zeigen die Balken nach links unten.'],
      ['der Großbuchstabe G', 'Der Haken rechts unten stört jede Faltung.', 'Um 180° gedreht liegt der Haken links oben.'],
      ['der Großbuchstabe L', 'Keine Faltlinie legt Stamm und Fuß aufeinander.', 'Um 180° gedreht steht der Fuß oben.'],
      ['der Großbuchstabe P', 'Der Bogen sitzt nur oben, falten geht nicht.', 'Um 180° gedreht sitzt der Bogen unten.'],
      ['der Großbuchstabe R', 'Bogen und Bein machen jede Faltung unmöglich.', 'Um 180° gedreht zeigt das Bein nach links oben.']
    ]
  ];
  const symmetrie = {
    id: 'symmetrie',
    icon: 'A|A',
    title: 'Symmetrie',
    tagline: 'Achsen- und Punktsymmetrie erkennen und zeichnen',
    learn: `
        <h2>Symmetrie: falten und drehen</h2>
        <p>Symmetrie steckt überall: im Schmetterling, im Verkehrszeichen, in Buchstaben.
        Zwei Arten musst du auseinanderhalten. Bei der einen wird <strong>gefaltet</strong>,
        bei der anderen <strong>gedreht</strong>. Sie sehen sich ähnlich, sind aber
        nicht dasselbe.</p>

        <div class="einstieg-box">
          <p class="box-title">Der Schmetterling und die Spielkarte</p>
          <p>Lena legt zwei Bilder auf den Tisch: einen Schmetterling und eine Spielkarte
          mit doppeltem Bild. Sie dreht beide um 180°. Die Karte sieht danach genauso aus
          wie vorher. Der Schmetterling steht auf dem Kopf.</p>
          <p>Dafür kann Lena den Schmetterling in der Mitte falten. Beide Flügel liegen
          dann genau aufeinander. Bei der Karte klappt das nicht.</p>
          <p class="frage">Beide Bilder wirken symmetrisch – was unterscheidet sie?</p>
        </div>

        <h3>Achsensymmetrie: die Faltprobe</h3>
        <p>Zwei Linien kommen als Achse besonders oft in Frage. Eine <strong>Mittellinie</strong>
        verbindet die Mitten zweier gegenüberliegender Seiten. Eine <strong>Diagonale</strong>
        verbindet zwei gegenüberliegende Ecken. Beim Rechteck sind die beiden Mittellinien
        Achsen, die Diagonalen nicht. Bei der Raute ist es genau umgekehrt.</p>
        <p>Eine Figur ist <strong>achsensymmetrisch</strong>, wenn du sie falten kannst.
        Beide Hälften müssen dabei genau aufeinanderliegen. Die Faltlinie heißt
        <strong>Symmetrieachse</strong> oder Spiegelachse.</p>
        <p>Jeder Punkt bekommt dabei einen Bildpunkt auf der anderen Seite. Beide sind
        gleich weit von der Achse entfernt. Ihre Verbindungsstrecke steht senkrecht auf
        der Achse. Punkte auf der Achse bleiben liegen.</p>
        <p>Eine Figur kann mehrere Achsen haben. Beim gleichschenkligen Dreieck, das nicht
        gleichseitig ist, beim gleichschenkligen Trapez und beim Drachenviereck ist es genau
        eine. Beim Quadrat sind es vier, beim Kreis unendlich viele.</p>
        <p>In Druckschrift lassen sich diese Großbuchstaben senkrecht falten:
        A, H, I, M, O, T, U, V, W, X, Y. Waagerecht falten kann man B, C, D, E, H, I, K, O
        und X – in vielen Schriften allerdings nur ungefähr.</p>

        <h3>Punktsymmetrie: die Drehprobe</h3>
        <p>Eine Figur ist <strong>punktsymmetrisch</strong>, wenn du sie um 180° drehen
        kannst und sie danach genauso aussieht wie vorher. Der Drehpunkt heißt
        <strong>Symmetriezentrum</strong>.</p>
        <p>Das Zentrum liegt immer genau in der Mitte zwischen einem Punkt und seinem
        Bildpunkt. Punktsymmetrisch sind zum Beispiel H, I, N, O, S, X und Z. Auch ein
        Windrad mit vier gleichen Flügeln gehört dazu.</p>
        <p>Beides zugleich geht auch: Quadrat, Rechteck, Raute und Kreis lassen sich
        falten <em>und</em> drehen. Und beides zugleich kann auch fehlen, etwa beim F.</p>

        <div class="herleitung-box">
          <p class="box-title">Warum beim Spiegeln das Vorzeichen wechselt</p>
          <p>Zeichne den Punkt P(3 | 2) ins Koordinatensystem. Er liegt 2 Kästchen über
          der x-Achse. Sein Bildpunkt muss 2 Kästchen darunter liegen – gleich weit weg,
          nur auf der anderen Seite.</p>
          <p>Nach links oder rechts wandert dabei nichts. Die erste Koordinate bleibt
          also 3. Zwei Kästchen unter der x-Achse heißt −2. So entsteht P′(3 | −2).
          Nur die zweite Koordinate hat das Vorzeichen gewechselt.</p>
          <p>Bei einer anderen senkrechten Geraden zählst du genauso. P(3 | 2) liegt
          2 Kästchen links von der Geraden x = 5. Der Bildpunkt liegt 2 Kästchen rechts
          davon, also bei x = 7. Als Rechnung: 5 + (5 − 3) = 2 · 5 − 3 = 7.</p>
          <p>Die x-Achse ist übrigens nur die Gerade y = 0 und die y-Achse die Gerade
          x = 0. Die Regeln oben sind also derselbe Gedanke, nur mit einer besonders
          bequemen Geraden.</p>
        </div>

        <div class="merkkasten">
          <p class="box-title">Die Regeln zum Spiegeln</p>
          <p><strong>An der x-Achse:</strong> P(x | y) wird zu P′(x | −y). Die erste
          Koordinate bleibt, die zweite wechselt das Vorzeichen.</p>
          <p><strong>An der y-Achse:</strong> P(x | y) wird zu P′(−x | y).</p>
          <p><strong>Am Ursprung:</strong> P(x | y) wird zu P′(−x | −y). Beide Koordinaten
          wechseln das Vorzeichen. Dasselbe erreichst du, indem du nacheinander an beiden
          Achsen spiegelst.</p>
          <p><strong>An der senkrechten Geraden x = a:</strong> P(x | y) wird zu
          P′(2a − x | y). Die zweite Koordinate bleibt.</p>
          <p><strong>An der waagerechten Geraden y = b:</strong> P(x | y) wird zu
          P′(x | 2b − y). Die erste Koordinate bleibt.</p>
          <p><strong>Am Punkt Z(a | b):</strong> P(x | y) wird zu P′(2a − x | 2b − y).
          Hier ändern sich beide Koordinaten.</p>
          <p><strong>Rückwärts:</strong> Die Spiegelachse liegt genau in der Mitte
          zwischen P und P′. Das Zentrum Z ebenso: Z = ((x + x′) : 2 | (y + y′) : 2).</p>
          <p><strong>Anzahl der Symmetrieachsen:</strong> Quadrat 4, Rechteck 2, Raute 2,
          gleichseitiges Dreieck 3, gleichschenkliges Dreieck 1, gleichschenkliges
          Trapez 1, Drachenviereck 1, Halbkreis 1, schiefes Parallelogramm 0,
          Kreis unendlich viele.</p>
          <p><strong>Regelmäßige Vielecke</strong> haben so viele Achsen, wie sie Ecken
          haben: das Fünfeck 5, das Sechseck 6, das Achteck 8. Punktsymmetrisch sind sie
          nur bei gerader Eckenzahl – das Sechseck ja, das Fünfeck und das gleichseitige
          Dreieck nicht.</p>
          <p><strong>Im Parallelogramm</strong> halbieren sich die Diagonalen. Ihr
          Schnittpunkt ist das Symmetriezentrum.</p>
        </div>

        <h3>So gehst du vor</h3>
        <ol class="schritte">
          <li>Lies die Koordinaten des Punktes ab: erst nach rechts, dann nach oben.</li>
          <li>Kläre, <strong>woran</strong> gespiegelt wird: an einer Achse, an einer
          anderen Geraden oder an einem Punkt.</li>
          <li>Entscheide für jede Koordinate einzeln, ob sie stehen bleibt oder sich
          ändert. Bei senkrechten Geraden ändert sich nur die erste, bei waagerechten
          nur die zweite, bei einem Zentrum beide.</li>
          <li>Rechne die geänderte Koordinate aus: bei x = a mit 2a − x, bei y = b mit
          2b − y.</li>
          <li>Mach die <strong>Probe</strong>: Die Achse muss genau in der Mitte zwischen
          Punkt und Bildpunkt liegen, das Zentrum ebenso.</li>
        </ol>

        <h3>Beispiele</h3>

        <div class="example-box">
          <p class="ex-title">Der Schmetterling und die Spielkarte – die Frage vom Anfang</p>
          <p>Der Schmetterling besteht die <em>Faltprobe</em>: Die Achse läuft längs durch
          den Körper, beide Flügel liegen dann aufeinander. Die Drehprobe besteht er nicht –
          um 180° gedreht steht er auf dem Kopf. Er ist also nur achsensymmetrisch.</p>
          <p>Die Spielkarte besteht die <em>Drehprobe</em>: Auf den Kopf gestellt sieht sie
          gleich aus. Falten kann man sie nicht, denn das untere Bild steht auf dem Kopf und
          ist nicht gespiegelt. Sie ist also nur punktsymmetrisch.</p>
          <p><strong>Beides ist Symmetrie – aber nicht dieselbe.</strong></p>
        </div>

        <div class="example-box">
          <p class="ex-title">Wie viele Symmetrieachsen hat ein Rechteck?</p>
          <p>Falte in der Breite: Die linke Hälfte liegt auf der rechten. ✓</p>
          <p>Falte in der Höhe: Die obere Hälfte liegt auf der unteren. ✓</p>
          <p>Falte längs einer Diagonale: Die lange Seite müsste auf der kurzen landen. ✗</p>
          <p>Also hat ein Rechteck <strong>2 Symmetrieachsen</strong>. Beim Quadrat sind
          alle Seiten gleich lang, dort passen auch die Diagonalen – macht 4.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Spiegeln an der y-Achse</p>
          <p>Gesucht ist der Bildpunkt von P(4 | −3).</p>
          <p>Die y-Achse verläuft senkrecht. Die zweite Koordinate bleibt also stehen: −3.</p>
          <p>P liegt 4 Kästchen rechts von der Achse, der Bildpunkt 4 Kästchen links:
          aus 4 wird −4.</p>
          <p>Ergebnis: <strong>P′(−4 | −3)</strong></p>
        </div>

        <div class="example-box">
          <p class="ex-title">Spiegeln an der Geraden y = 4</p>
          <p>Gesucht ist der Bildpunkt von P(5 | 1).</p>
          <p>Die Gerade y = 4 verläuft waagerecht. Die erste Koordinate bleibt also 5.</p>
          <p>P liegt 3 Kästchen unterhalb der Geraden (4 − 1 = 3). Der Bildpunkt liegt
          3 Kästchen oberhalb: 4 + 3 = 7.</p>
          <p>Als Rechnung: y′ = 2 · 4 − 1 = 7, also <strong>P′(5 | 7)</strong></p>
        </div>

        <div class="example-box">
          <p class="ex-title">Punktspiegelung am Zentrum Z(2 | 1)</p>
          <p>Gesucht ist der Bildpunkt von P(5 | 3).</p>
          <p>Bei einer Punktspiegelung liegt Z genau in der Mitte zwischen P und P′.
          Beide Koordinaten ändern sich.</p>
          <p>x′ = 2 · 2 − 5 = −1&ensp;<span class="trenn">•</span>&ensp;y′ = 2 · 1 − 3 = −1</p>
          <p>Ergebnis: <strong>P′(−1 | −1)</strong>. Probe: Die Mitte von P(5 | 3) und
          P′(−1 | −1) ist ((5 + (−1)) : 2 | (3 + (−1)) : 2) = (2 | 1) – genau Z. ✓</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Die Spiegelachse zurückrechnen</p>
          <p>P(2 | 3) und P′(8 | 3) sind symmetrisch zu einer senkrechten Geraden x = a.</p>
          <p>Die Achse liegt genau in der Mitte zwischen beiden Punkten:
          a = (2 + 8) : 2 = 5.</p>
          <p>Die Spiegelachse ist also die Gerade <strong>x = 5</strong>. Probe: P ist
          3 Schritte von der Achse entfernt, P′ genauso weit. ✓</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Die fehlende Ecke im Parallelogramm</p>
          <p>Von einem Parallelogramm ABCD kennst du A(1 | 1), B(7 | 2) und C(9 | 9).
          Gesucht ist D.</p>
          <p>Ein Parallelogramm ist punktsymmetrisch. Sein Zentrum ist der Schnittpunkt
          der Diagonalen, und die Diagonalen halbieren sich.</p>
          <p>Mitte von A und C: x = (1 + 9) : 2 = 5&ensp;<span class="trenn">•</span>&ensp;
          y = (1 + 9) : 2 = 5, also M(5 | 5).</p>
          <p>D ist das Bild von B bei der Punktspiegelung an M:
          x = 2 · 5 − 7 = 3&ensp;<span class="trenn">•</span>&ensp;y = 2 · 5 − 2 = 8.</p>
          <p>Ergebnis: <strong>D(3 | 8)</strong>. Probe: Die Mitte von B(7 | 2) und D(3 | 8)
          ist (5 | 5) – dasselbe Zentrum wie bei A und C. ✓</p>
        </div>

        <div class="achtung-box">
          <p class="achtung-title">Achsensymmetrisch heißt nicht punktsymmetrisch</p>
          <p>Viele denken: „Wenn eine Figur symmetrisch aussieht, ist sie beides.“ Das
          stimmt nicht. Die beiden Eigenschaften sind unabhängig voneinander – eine Figur
          kann die eine haben und die andere nicht.</p>
          <p><strong>Gegenbeispiel 1: nur Achse, kein Zentrum.</strong> Das gleichschenklige
          Dreieck mit den Ecken A(1 | 1), B(5 | 1) und C(3 | 4).</p>
          <p>Faltprobe an der Geraden x = 3: A wird zu (2 · 3 − 1 | 1) = (5 | 1) = B,
          B wird zu (1 | 1) = A, C wird zu (2 · 3 − 3 | 4) = (3 | 4) = C. Jede Ecke landet
          auf einer Ecke – die Figur geht in sich über. ✓</p>
          <p>Drehprobe: Das Zentrum müsste in der Mitte der Figur liegen, also bei (3 | 2).
          A wird dabei zu (2 · 3 − 1 | 2 · 2 − 1) = (5 | 3). Dieser Punkt ist keine Ecke
          des Dreiecks. ✗ Der Buchstabe A verhält sich genauso.</p>
          <p><strong>Gegenbeispiel 2: Zentrum, keine Achse.</strong> Das Parallelogramm mit
          den Ecken A(1 | 1), B(3 | 1), C(5 | 5) und D(3 | 5).</p>
          <p>Drehprobe am Zentrum Z(3 | 3): A wird zu (2 · 3 − 1 | 2 · 3 − 1) = (5 | 5) = C,
          B wird zu (2 · 3 − 3 | 2 · 3 − 1) = (3 | 5) = D. Die Figur geht in sich über. ✓</p>
          <p>Faltprobe an x = 3: A wird zu (5 | 1) – keine Ecke. ✗ Faltprobe an y = 3:
          A wird zu (1 | 5) – auch keine Ecke. ✗ Und schräg falten geht erst recht nicht:
          Am Punkt A stößt eine kurze Seite (2 nach rechts bis B) auf eine lange
          (2 nach rechts und 4 nach oben bis D). Eine Faltlinie durch A müsste die beiden
          aufeinanderlegen – gleich lang sind sie aber nicht. Der Buchstabe S verhält sich
          genauso.</p>
          <p>Merke: Erst falten, dann drehen – <em>zwei</em> Proben, nicht eine.</p>
        </div>

        <div class="selbstcheck">
          <p class="box-title">Selbstcheck</p>
          <details><summary>Wie viele Symmetrieachsen hat ein Kreis?</summary>
          <p>Unendlich viele. Jede Gerade durch den Mittelpunkt teilt ihn in zwei
          deckungsgleiche Halbkreise. Der Kreis ist außerdem punktsymmetrisch, denn jede
          Drehung um den Mittelpunkt lässt ihn unverändert.</p></details>
          <details><summary>Welche Großbuchstaben sind achsen- und punktsymmetrisch zugleich?</summary>
          <p>H, I, O und X. Sie haben eine senkrechte und eine waagerechte Achse. Wo beide
          Achsen sich kreuzen, liegt zugleich das Symmetriezentrum – das gilt immer, wenn
          zwei Achsen senkrecht aufeinanderstehen.</p></details>
          <details><summary>P(−2 | 5) wird am Ursprung gespiegelt. Wo landet der Bildpunkt?</summary>
          <p>Beide Koordinaten wechseln das Vorzeichen: P′(2 | −5). Denselben Punkt bekommst
          du, wenn du erst an der x-Achse und danach an der y-Achse spiegelst.</p></details>
          <details><summary>P(1 | 4) und P′(9 | 4) sind symmetrisch zu einer senkrechten Geraden. Welcher?</summary>
          <p>Die Achse liegt in der Mitte: (1 + 9) : 2 = 5, also die Gerade x = 5. Die zweite
          Koordinate hilft hier nicht weiter – sie ist bei beiden Punkten gleich, weil eine
          senkrechte Achse nichts an der Höhe ändert.</p></details>
          <details><summary>Ist ein Parallelogramm achsensymmetrisch?</summary>
          <p>Im Allgemeinen nicht. Es ist punktsymmetrisch zum Schnittpunkt seiner Diagonalen,
          eine Faltlinie gibt es aber nicht. Nur die besonderen Parallelogramme haben eine:
          das Rechteck (2 Achsen), die Raute (2 Achsen) und das Quadrat (4 Achsen).</p></details>
          <details><summary>Ein Punkt bleibt beim Spiegeln an der y-Achse an seinem Platz. Was weißt du über ihn?</summary>
          <p>Er liegt auf der y-Achse, seine erste Koordinate ist also 0. Aus P(0 | y) wird
          wieder derselbe Punkt, denn nach links oder rechts ist von der Achse aus kein Weg
          zurückzulegen. Allgemein gilt: Genau die Punkte auf der Spiegelachse bleiben liegen.</p></details>
        </div>
      `,

    gen(diff) {

      /* ---------------- Stufe 1: erkennen, ohne Koordinaten ---------------- */
      if (diff === 1) {
        const art = choice(['achsen', 'buchstabe', 'einordnen']);

        if (art === 'achsen') {
          // Erst die Anzahl ziehen, dann eine Figur dazu – siehe SYM_FIGUREN.
          const n = choice(SYM_ACHSENZAHLEN);
          const [, figur, grund] = choice(SYM_FIGUREN.filter(f => f[0] === n));
          return {
            q: `Wie viele Symmetrieachsen hat ${figur}?`,
            type: 'input', placeholder: 'Anzahl',
            check: numCheck(n, 1e-6, { zahlwort: true }), testAnswer: String(n),
            answerText: `${fmt(n)} ${plural(n, 'Symmetrieachse', 'Symmetrieachsen')}`,
            solution: `${grund}<br>${n === 0
              ? 'Die Figur hat also keine Symmetrieachse.'
              : n === 1
                ? 'Die Figur hat also genau eine Symmetrieachse.'
                : `Es sind also ${fmt(n)} Symmetrieachsen.`}`
          };
        }

        if (art === 'buchstabe') {
          const drehen = choice([false, true]);
          const tabelle = drehen ? SYM_PUNKT_JA : SYM_ACHSE_JA;
          const nein = drehen ? SYM_PUNKT_NEIN : SYM_ACHSE_NEIN;
          /* Bei der Achsensymmetrie nur Konsonanten: JEDER deutsche Großvokal
             (A, E, I, O, U, Y) ist achsensymmetrisch, also kann kein Ablenker ein
             Vokal sein – stand einer unter den Optionen, war er zwingend die
             Lösung. Gemessen: in 45,2 % der Ziehungen ein Vokal dabei, davon
             100 % richtig. Bei der Punktsymmetrie besteht das Problem nicht,
             dort stehen Vokale auf beiden Seiten (I, O sind punktsymmetrisch,
             A, E, U, Y nicht). Die Vokale kommen auf der Erklärseite vor. */
          const VOKAL = /[AEIOUY]/;
          const auswahl = drehen ? Object.keys(tabelle)
                                 : Object.keys(tabelle).filter(b => !VOKAL.test(b));
          const richtig = choice(auswahl);
          // Fünf Ablenker statt drei: makeChoice verwirft doppelte, die
          // überzähligen rücken nach. So bleiben es immer vier Optionen.
          const ablenker = shuffle(nein).slice(0, 5);
          const fehl = drehen ? SYM_PUNKT_FEHL : SYM_ACHSE_FEHL;
          const mc = makeChoice(richtig, ablenker, ablenker.map(b => fehl[b]));
          const andere = mc.options.filter((_, i) => i !== mc.correct).join(', ');
          return {
            q: `Welcher dieser Großbuchstaben ist ${drehen ? 'punktsymmetrisch' : 'achsensymmetrisch'}?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: richtig,
            solution: drehen
              ? `${richtig} sieht nach einer Drehung um ${fmt(180)}° unverändert aus. ${tabelle[richtig]}<br>Bei ${andere} steht nach der halben Drehung etwas anderes da.`
              : `${richtig} lässt sich falten. ${tabelle[richtig]}<br>Bei ${andere} bleiben nach jeder Faltung zwei ungleiche Hälften übrig.`
          };
        }

        // Einordnen: erst die Klasse ziehen, dann ein Objekt daraus.
        const k = rnd(0, 3);
        const [objekt, falt, dreh] = choice(SYM_OBJEKTE[k]);
        const mc = makeChoice(SYM_EINORDNUNG[k], SYM_EINORDNUNG.filter((_, i) => i !== k),
          SYM_EINORDNUNG_FEHL[k].filter((_, i) => i !== k));
        return {
          q: `Welche Symmetrie hat ${objekt}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: SYM_EINORDNUNG[k],
          solution: `Faltprobe: ${falt}<br>Drehprobe: ${dreh}<br>Also ist es ${SYM_EINORDNUNG[k]}.`
        };
      }

      /* ---------------- Stufe 2: Achsen und Ursprung ---------------- */
      if (diff === 2) {
        const art = choice(['spiegeln', 'spiegeln', 'erkennen', 'doppelt']);

        // Beide Koordinaten ungleich 0. Läge P auf der Spiegelachse, stünde die
        // Antwort zeichengleich in der Aufgabe – zu rechnen gäbe es nichts mehr.
        const px = rndNonZero(-9, 9), py = rndNonZero(-9, 9);

        if (art === 'spiegeln') {
          const wo = choice(['x', 'y', 'u']);
          const bx = wo === 'x' ? px : -px;
          const by = wo === 'y' ? py : -py;
          const wortWo = wo === 'x' ? 'an der x-Achse' : wo === 'y' ? 'an der y-Achse' : 'am Ursprung O(0 | 0)';
          const regel = wo === 'x'
            ? 'Die x-Achse verläuft waagerecht. Die erste Koordinate bleibt deshalb stehen, die zweite wechselt das Vorzeichen.'
            : wo === 'y'
              ? 'Die y-Achse verläuft senkrecht. Die zweite Koordinate bleibt deshalb stehen, die erste wechselt das Vorzeichen.'
              : 'Bei der Spiegelung am Ursprung wechseln beide Koordinaten das Vorzeichen. Der Ursprung liegt dann genau in der Mitte zwischen P und P′.';
          return {
            q: `Spiegle den Punkt ${symPunkt('P', px, py)} ${wortWo}. Welche Koordinaten hat der Bildpunkt P′? ${SYM_KOORD}`,
            type: 'input', placeholder: 'x; y',
            check: Util.orderedCheck([bx, by]), testAnswer: `${bx}; ${by}`,
            answerText: symPunkt('P′', bx, by),
            solution: `${regel}<br>${symPunkt('P', px, py)} → ${symPunkt('P′', bx, by)}`
          };
        }

        if (art === 'erkennen') {
          const wo = choice(['x', 'y', 'u']);
          const spiegel = (x, y) => [wo === 'x' ? x : -x, wo === 'y' ? y : -y];
          const [bx, by] = spiegel(px, py);
          // Q darf weder P noch P′ sein: Sonst stünde die gesuchte Antwort schon
          // als Zahlenpaar in der Aufgabe.
          let qx = rndNonZero(-9, 9), qy = rndNonZero(-9, 9);
          while ((qx === px && qy === py) || (qx === bx && qy === by)) {
            qx = rndNonZero(-9, 9); qy = rndNonZero(-9, 9);
          }
          const [rx, ry] = spiegel(qx, qy);
          const erkannt = wo === 'x'
            ? 'P und P′ haben dieselbe erste Koordinate, nur die zweite wechselt das Vorzeichen. Gespiegelt wurde also an der x-Achse.'
            : wo === 'y'
              ? 'P und P′ haben dieselbe zweite Koordinate, nur die erste wechselt das Vorzeichen. Gespiegelt wurde also an der y-Achse.'
              : 'Bei P und P′ haben beide Koordinaten das Vorzeichen gewechselt. Gespiegelt wurde also am Ursprung.';
          return {
            /* Der Suchraum steht in der Frage. Ohne ihn ist die Aufgabe
               unterbestimmt: Zu jedem Punktepaar passt neben der Achsenspiegelung
               auch die Punktspiegelung am Mittelpunkt von P und P′ – und die
               führt Q woandershin. Der Merkkasten derselben Seite führt beide
               Abbildungen ein, also wäre die zweite Lesart genauso berechtigt. */
            q: `Gespiegelt wurde an der x-Achse, an der y-Achse oder am Ursprung: Der Punkt ${symPunkt('P', px, py)} wird dabei auf ${symPunkt('P′', bx, by)} abgebildet. Welche Koordinaten hat das Bild von ${symPunkt('Q', qx, qy)}? ${SYM_KOORD}`,
            type: 'input', placeholder: 'x; y',
            check: Util.orderedCheck([rx, ry]), testAnswer: `${rx}; ${ry}`,
            answerText: symPunkt('Q′', rx, ry),
            solution: `${erkannt}<br>Dieselbe Regel auf Q anwenden:<br>${symPunkt('Q', qx, qy)} → ${symPunkt('Q′', rx, ry)}`
          };
        }

        // Zweimal hintereinander spiegeln – die Reihenfolge ist frei. Das Ergebnis
        // ist die Punktspiegelung am Ursprung; genau das soll auffallen.
        const zuerstX = choice([true, false]);
        const mx = zuerstX ? px : -px;
        const my = zuerstX ? -py : py;
        const erste = zuerstX ? 'x-Achse' : 'y-Achse';
        const zweite = zuerstX ? 'y-Achse' : 'x-Achse';
        return {
          q: `Der Punkt ${symPunkt('P', px, py)} wird zuerst an der ${erste} gespiegelt, das Ergebnis danach an der ${zweite}. Welche Koordinaten hat der Endpunkt P″? ${SYM_KOORD}`,
          type: 'input', placeholder: 'x; y',
          check: Util.orderedCheck([-px, -py]), testAnswer: `${-px}; ${-py}`,
          answerText: symPunkt('P″', -px, -py),
          solution: `Erster Schritt (${erste}): ${symPunkt('P', px, py)} → ${symPunkt('P′', mx, my)}<br>` +
            `Zweiter Schritt (${zweite}): ${symPunkt('P′', mx, my)} → ${symPunkt('P″', -px, -py)}<br>` +
            `Am Ende haben beide Koordinaten das Vorzeichen gewechselt. Zweimal an den Achsen gespiegelt ist dasselbe wie einmal am Ursprung gespiegelt.`
        };
      }

      /* ---------------- Stufe 3: beliebige Gerade, beliebiges Zentrum ---------------- */
      const art = choice(['gerade', 'gerade', 'zentrum', 'rueckwaerts', 'ecke']);

      if (art === 'gerade') {
        const senkrecht = choice([true, false]);
        // a ≠ 0, sonst wäre die Spiegelgerade eine der beiden Achsen – das ist Stufe 2.
        const a = rndNonZero(-6, 6);
        let s = rndNonZero(-9, 9);                    // Koordinate, die sich ändert
        while (s === a) s = rndNonZero(-9, 9);        // auf der Achse bliebe P liegen
        const f = rndNonZero(-9, 9);                  // Koordinate, die stehen bleibt
        const s2 = 2 * a - s;
        const d = Math.abs(a - s);
        // Wie im Beispiel „Spiegeln an der Geraden y = 4“: erst den Abstand zur
        // Geraden ausrechnen, dann von der Geraden aus weiterzählen – und erst
        // danach 2a − x als dieselbe Rechnung. In drei von vier Ziehungen steckt
        // eine negative Zahl in a oder s; 9 − (−2) = 11 ist genau der Schritt,
        // an dem gezählt statt gerechnet wird.
        const abstand = s > a ? `${fmt(s)} − ${par(a)} = ${fmt(d)}` : `${fmt(a)} − ${par(s)} = ${fmt(d)}`;
        const weiter = `${fmt(a)} ${s > a ? '−' : '+'} ${fmt(d)} = ${fmt(s2)}`;
        const [px, py] = senkrecht ? [s, f] : [f, s];
        const [bx, by] = senkrecht ? [s2, f] : [f, s2];
        const wo1 = senkrecht ? (s < a ? 'links von der Geraden' : 'rechts von der Geraden')
          : (s < a ? 'unterhalb der Geraden' : 'oberhalb der Geraden');
        const wo2 = senkrecht ? (s < a ? 'rechts davon' : 'links davon')
          : (s < a ? 'oberhalb davon' : 'unterhalb davon');
        return {
          q: `Spiegle den Punkt ${symPunkt('P', px, py)} an der ${senkrecht ? 'senkrechten' : 'waagerechten'} Geraden ${senkrecht ? 'x' : 'y'} = ${fmt(a)}. Welche Koordinaten hat der Bildpunkt P′? ${SYM_KOORD}`,
          type: 'input', placeholder: 'x; y',
          check: Util.orderedCheck([bx, by]), testAnswer: `${bx}; ${by}`,
          answerText: symPunkt('P′', bx, by),
          solution: `Die Gerade ${senkrecht ? 'x' : 'y'} = ${fmt(a)} verläuft ${senkrecht ? 'senkrecht' : 'waagerecht'}. Die ${senkrecht ? 'zweite' : 'erste'} Koordinate bleibt also stehen: ${fmt(f)}.<br>` +
            `P liegt ${fmt(d)} Kästchen ${wo1} (${abstand}). Der Bildpunkt liegt ${fmt(d)} Kästchen ${wo2}: ${weiter}.<br>` +
            `Als Rechnung: ${senkrecht ? 'x' : 'y'}′ = 2 · ${par(a)} − ${par(s)} = ${fmt(s2)}, also ${symPunkt('P′', bx, by)}`
        };
      }

      if (art === 'zentrum') {
        // Zentrum nicht auf einer Achse: „2 · 0 − 5“ wäre ein leerer Rechenschritt.
        const zx = rndNonZero(-6, 6), zy = rndNonZero(-6, 6);
        let px = rndNonZero(-9, 9), py = rndNonZero(-9, 9);
        while (px === zx) px = rndNonZero(-9, 9);
        while (py === zy) py = rndNonZero(-9, 9);
        const bx = 2 * zx - px, by = 2 * zy - py;
        return {
          q: `Spiegle den Punkt ${symPunkt('P', px, py)} am Punkt ${symPunkt('Z', zx, zy)}. Welche Koordinaten hat der Bildpunkt P′? ${SYM_KOORD}`,
          type: 'input', placeholder: 'x; y',
          check: Util.orderedCheck([bx, by]), testAnswer: `${bx}; ${by}`,
          answerText: symPunkt('P′', bx, by),
          solution: `Bei einer Punktspiegelung liegt Z genau in der Mitte zwischen P und P′. Beide Koordinaten ändern sich.<br>` +
            `x′ = 2 · ${par(zx)} − ${par(px)} = ${fmt(bx)} ${SYM_TRENN} y′ = 2 · ${par(zy)} − ${par(py)} = ${fmt(by)}<br>` +
            `Ergebnis: ${symPunkt('P′', bx, by)}`
        };
      }

      if (art === 'rueckwaerts') {
        const zentrum = choice([true, false]);
        if (!zentrum) {
          const senkrecht = choice([true, false]);
          const a = rndNonZero(-6, 6);
          // Keine Koordinate 0: „(3 + 0) : 2“ wäre ein leerer Rechenschritt.
          let s = rndNonZero(-9, 9);
          while (s === a || 2 * a - s === 0) s = rndNonZero(-9, 9);
          const s2 = 2 * a - s;
          const f = rndNonZero(-9, 9);
          const p1 = senkrecht ? [s, f] : [f, s];
          const p2 = senkrecht ? [s2, f] : [f, s2];
          const name = senkrecht ? 'x' : 'y';
          const wert = senkrecht ? 'a' : 'b';           // wie im Merkkasten: x = a, y = b
          const d = Math.abs(a - s);
          return {
            q: `Die Punkte ${symPunkt('P', p1[0], p1[1])} und ${symPunkt('P′', p2[0], p2[1])} sind symmetrisch zu einer ${senkrecht ? 'senkrechten' : 'waagerechten'} Geraden ${name} = ${wert}. Welchen Wert hat ${wert}?`,
            type: 'input', placeholder: `Wert von ${wert}`,
            check: numCheck(a), testAnswer: String(a),
            answerText: `${wert} = ${fmt(a)}`,
            solution: `Die Spiegelachse liegt genau in der Mitte zwischen den beiden Punkten.<br>` +
              `${wert} = (${fmt(s)} + ${par(s2)}) : 2 = ${fmt(a)}<br>` +
              `Die Achse ist also die Gerade ${name} = ${fmt(a)}. Probe: P ist ${fmt(d)} ${plural(d, 'Schritt', 'Schritte')} von der Achse entfernt, P′ genauso weit.`
          };
        }
        const zx = rndNonZero(-6, 6), zy = rndNonZero(-6, 6);
        let px = rndNonZero(-9, 9), py = rndNonZero(-9, 9);
        while (px === zx || 2 * zx - px === 0) px = rndNonZero(-9, 9);
        while (py === zy || 2 * zy - py === 0) py = rndNonZero(-9, 9);
        const bx = 2 * zx - px, by = 2 * zy - py;
        return {
          q: `Die Punkte ${symPunkt('P', px, py)} und ${symPunkt('P′', bx, by)} sind punktsymmetrisch zu einem Zentrum Z. Welche Koordinaten hat Z? ${SYM_KOORD}`,
          type: 'input', placeholder: 'x; y',
          check: Util.orderedCheck([zx, zy]), testAnswer: `${zx}; ${zy}`,
          answerText: symPunkt('Z', zx, zy),
          solution: `Das Zentrum liegt genau in der Mitte zwischen P und P′. Rechne beide Koordinaten einzeln.<br>` +
            `x = (${fmt(px)} + ${par(bx)}) : 2 = ${fmt(zx)} ${SYM_TRENN} y = (${fmt(py)} + ${par(by)}) : 2 = ${fmt(zy)}<br>` +
            `Ergebnis: ${symPunkt('Z', zx, zy)}`
        };
      }

      /* Fehlende Ecke im Parallelogramm ABCD. Aufgebaut aus dem Zentrum M:
         A = M − u, C = M + u, B = M − w, D = M + w. Dann liegen A und C sowie
         B und D punktsymmetrisch zu M, und M ist ganzzahlig – sonst stünde im
         Lösungsweg eine Mitte mit Komma. */
      let mx, my, u1, u2, w1, w2, ax, ay, bx, by, cx, cy, dx, dy;
      let versuche = 0;
      do {
        mx = rndNonZero(-3, 3); my = rndNonZero(-3, 3);
        u1 = rndNonZero(-4, 4); u2 = rndNonZero(-4, 4);
        w1 = rndNonZero(-4, 4); w2 = rndNonZero(-4, 4);
        ax = mx - u1; ay = my - u2; cx = mx + u1; cy = my + u2;
        bx = mx - w1; by = my - w2; dx = mx + w1; dy = my + w2;
        versuche++;
        /* |u₁| ≠ |w₁| und |u₂| ≠ |w₂| sind die wichtigste Bedingung: Sonst ist eine
           Seite waagerecht oder senkrecht, und dann steht eine Koordinate von D
           zeichengleich in der Aufgabe (D = A + C − B). Gemessen war die Antwort
           vorher in 6,5 % der Ziehungen reines Abschreiben, jetzt in keiner.
           |det| ≥ 4 hält das Parallelogramm in Form – eine fast platte Figur sähe
           wie eine Strecke aus. Keine Koordinate 0, sonst entstehen im Lösungsweg
           leere Schritte wie „(3 + 0) : 2“. */
      } while (versuche < 400 && (
        Math.abs(u1) === Math.abs(w1) || Math.abs(u2) === Math.abs(w2) ||
        Math.abs(u1 * w2 - u2 * w1) < 4 ||
        [ax, ay, bx, by, cx, cy, dx, dy].some(k => k === 0)));

      return {
        q: `Von einem Parallelogramm ABCD kennst du drei Ecken: ${symPunkt('A', ax, ay)}, ${symPunkt('B', bx, by)} und ${symPunkt('C', cx, cy)}. Welche Koordinaten hat die vierte Ecke D? ${SYM_KOORD}`,
        type: 'input', placeholder: 'x; y',
        check: Util.orderedCheck([dx, dy]), testAnswer: `${dx}; ${dy}`,
        answerText: symPunkt('D', dx, dy),
        solution: `Ein Parallelogramm ist punktsymmetrisch. Sein Zentrum ist der Schnittpunkt der Diagonalen, und die Diagonalen halbieren sich.<br>` +
          `Mitte von A und C: x = (${fmt(ax)} + ${par(cx)}) : 2 = ${fmt(mx)} ${SYM_TRENN} y = (${fmt(ay)} + ${par(cy)}) : 2 = ${fmt(my)}, also ${symPunkt('M', mx, my)}.<br>` +
          `D ist das Bild von B bei der Punktspiegelung an M:<br>` +
          `x = 2 · ${par(mx)} − ${par(bx)} = ${fmt(dx)} ${SYM_TRENN} y = 2 · ${par(my)} − ${par(by)} = ${fmt(dy)}<br>` +
          `Ergebnis: ${symPunkt('D', dx, dy)}`
      };
    }
  };

  /* ============================================================
     Vierecke & Dreiecke (Unterstufe, Klasse 5–7)
  
     Abgrenzung zu `winkel`: Dort stehen die Winkelsummen im Dreieck
     und im Viereck sowie Neben- und Scheitelwinkel. Hier geht es um
     die ARTEN und ihre EIGENSCHAFTEN – welche Seiten gleich lang
     sind, welche parallel laufen, was die Diagonalen tun und was
     daraus folgt. Deshalb wird hier nirgends ein fehlender Winkel
     aus 180° oder 360° ausgerechnet.
     ============================================================ */
  const vierecke = {
    id: 'vierecke',
    icon: '□◇',
    title: 'Vierecke & Dreiecke',
    tagline: 'Arten erkennen und ihre Eigenschaften nutzen',

    learn: `
      <h2>Vierecke und Dreiecke – jede Form hat ihre Regeln</h2>
      <p>Ein Viereck ist nicht einfach ein Viereck. Sobald du weißt, welche Seiten gleich
      lang sind und welche parallel laufen, hat die Figur einen Namen. Und mit dem Namen
      bekommst du Eigenschaften geschenkt. Die musst du dann nicht mehr nachmessen. Diese
      Seite sortiert die sechs wichtigsten Vierecke und die Dreiecksarten.</p>

      <div class="einstieg-box">
        <p class="box-title">Vier gleich lange Latten</p>
        <p>Lina hat vier Latten. Jede ist 80 cm lang. Sie nagelt die vier Latten an den
        Ecken zu einem Viereck zusammen. Alle vier Seiten sind also gleich lang.</p>
        <p class="frage">Ist das damit schon ein Quadrat?</p>
      </div>

      <h3>Warum die Vierecke eine Familie sind</h3>

      <div class="herleitung-box">
        <p class="box-title">Eine Eigenschaft nach der anderen</p>
        <p>Fang mit einem ganz beliebigen Viereck an. Es hat vier Ecken, sonst nichts.
        Jetzt legst du eine Bedingung nach der anderen dazu. Bei jedem Schritt wird die
        Form besonderer – und bekommt einen neuen Namen.</p>
        <p><strong>Ein Paar paralleler Seiten</strong> macht daraus ein Trapez.</p>
        <p><strong>Beide Seitenpaare parallel</strong> macht daraus ein Parallelogramm.
        Dann sind gegenüberliegende Seiten auch gleich lang.</p>
        <p>Jetzt gibt es zwei Wege. <strong>Ein rechter Winkel</strong> macht aus dem
        Parallelogramm ein Rechteck. <strong>Vier gleich lange Seiten</strong> machen
        daraus eine Raute.</p>
        <p>Gehst du beide Wege zugleich, landest du beim <strong>Quadrat</strong>. Es hat
        vier gleich lange Seiten und vier rechte Winkel.</p>
        <p>Und hier steckt der wichtigste Gedanke: Eine Bedingung geht beim Weitergehen
        nie verloren. Das Quadrat behält alles, was das Rechteck ausmacht. Deshalb sagt
        man: Das Quadrat ist ein <strong>Sonderfall</strong> des Rechtecks. Man malt das
        als <strong>Haus der Vierecke</strong> auf. Oben steht die Form mit den meisten
        Bedingungen, unten die mit den wenigsten.</p>
        <p>Der Drachen steht etwas abseits. Bei ihm sind zwei Paare <em>benachbarter</em>
        Seiten gleich lang, nicht die gegenüberliegenden. Die Raute erfüllt das auch, denn
        bei ihr sind ja alle vier Seiten gleich lang. Also ist jede Raute ein Drachen.</p>
      </div>

      <h3>Die sechs Vierecke auf einen Blick</h3>
      <p>Drei Fragen genügen fast immer. Welche Seiten sind gleich lang? Welche Seiten
      sind parallel? Gibt es rechte Winkel? Die Diagonalen verraten den Rest. Diagonalen
      sind die beiden Strecken zwischen gegenüberliegenden Ecken.</p>

      <div class="table-wrap"><table>
        <tr><th>Viereck</th><th>Seiten</th><th>Winkel</th><th>Diagonalen</th><th>Achsen</th></tr>
        <tr><td>Quadrat</td><td>alle vier gleich lang</td><td>vier rechte</td><td>gleich lang, senkrecht, halbieren sich</td><td>4</td></tr>
        <tr><td>Rechteck</td><td>gegenüberliegende gleich lang</td><td>vier rechte</td><td>gleich lang, halbieren sich</td><td>2</td></tr>
        <tr><td>Raute</td><td>alle vier gleich lang</td><td>meist keine rechten</td><td>senkrecht, halbieren sich</td><td>2</td></tr>
        <tr><td>Parallelogramm</td><td>gegenüberliegende gleich lang und parallel</td><td>meist keine rechten</td><td>halbieren sich</td><td>0</td></tr>
        <tr><td>Trapez</td><td>mindestens ein Paar parallel</td><td>beliebig</td><td>ohne feste Regel</td><td>0</td></tr>
        <tr><td>Drachen</td><td>zwei Paare benachbarter gleich lang</td><td>beliebig</td><td>senkrecht, eine halbiert die andere</td><td>1</td></tr>
      </table></div>

      <p>Eine <strong>Symmetrieachse</strong> (auch Spiegelachse) ist eine Gerade, an der du
      die Figur klappen kannst. Danach müssen beide Hälften genau aufeinanderliegen. In der
      Spalte Achsen steht, wie viele es davon gibt.</p>
      <p>Bei einem Viereck kommen nur vier Geraden als Achse in Frage. Das sind die zwei
      Diagonalen und die zwei <strong>Mittellinien</strong>. Eine Mittellinie verbindet die
      Mitten zweier gegenüberliegender Seiten. Nimm ein Rechteck, 12 cm lang und 8 cm
      breit. An beiden Mittellinien passt es auf sich selbst, einmal längs, einmal quer.
      An einer Diagonalen passt es nicht. Geklappt müsste die 12 cm lange Seite auf der
      8 cm langen liegen. Bei der Raute ist es genau umgekehrt. Ihre Diagonalen sind
      Achsen, die Mittellinien nicht. Dort müsste eine spitze Ecke auf einer stumpfen
      liegen. Das Quadrat kann beides, also 2 + 2 = 4 Achsen. Ein Parallelogramm, das weder
      Rechteck noch Raute ist, kann keins von beiden. Deshalb steht dort 0.</p>
      <p>Bei Quadrat, Rechteck, Raute und Parallelogramm <strong>halbieren sich die
      Diagonalen</strong>. Ihr <strong>Schnittpunkt</strong> liegt deshalb von allen vier
      Ecken gleich weit entfernt – nämlich eine halbe Diagonale weit.</p>
      <p>Die ganze Tabelle meint immer die Form <strong>ohne ihre Sonderfälle</strong>.
      Ein Rechteck, das zugleich ein Quadrat ist, hat natürlich vier Achsen und nicht zwei.
      Und eine Raute mit vier rechten Winkeln gibt es sehr wohl – die heißt dann Quadrat.
      Deshalb steht in der Winkelspalte „meist keine rechten“ und nicht „keine“.</p>

      <p>Beim Drachen ist die Achse die Diagonale zwischen den beiden Ecken, an denen
      jeweils zwei gleich lange Seiten zusammenstoßen. Die andere Diagonale wird von ihr
      halbiert, ist aber selbst keine Achse.</p>

      <h3>Die Dreiecksarten</h3>
      <p>Dreiecke sortiert man auf zwei Arten. Einmal nach den Seiten, einmal nach den
      Winkeln. Beide Namen darf eine Figur gleichzeitig tragen.</p>

      <div class="table-wrap"><table>
        <tr><th>nach den Seiten</th><th>Bedingung</th><th>Achsen</th></tr>
        <tr><td>gleichseitig</td><td>alle drei Seiten gleich lang</td><td>3</td></tr>
        <tr><td>gleichschenklig</td><td>genau zwei Seiten gleich lang</td><td>1</td></tr>
        <tr><td>ungleichseitig</td><td>alle drei Seiten verschieden</td><td>0</td></tr>
      </table></div>

      <p>Beim gleichschenkligen Dreieck haben die beiden gleich langen Seiten einen eigenen
      Namen. Sie heißen <strong>Schenkel</strong>. Die dritte Seite ist die
      <strong>Basis</strong>. Der Umfang ist damit U = 2 · Schenkel + Basis.</p>

      <div class="table-wrap"><table>
        <tr><th>nach den Winkeln</th><th>Bedingung</th></tr>
        <tr><td>spitzwinklig</td><td>alle drei Winkel kleiner als 90°</td></tr>
        <tr><td>rechtwinklig</td><td>ein Winkel misst genau 90°</td></tr>
        <tr><td>stumpfwinklig</td><td>ein Winkel ist größer als 90°</td></tr>
      </table></div>

      <p>Bei den Winkeln entscheidet immer der <strong>größte</strong> Winkel. Zwei stumpfe
      Winkel kann ein Dreieck nämlich nie haben.</p>

      <div class="merkkasten">
        <p class="box-title">Was du dir merken musst</p>
        <p>Umfang von Rechteck und Parallelogramm: U = 2 · (a + b)</p>
        <p>Umfang von Quadrat und Raute: U = 4 · a</p>
        <p>Umfang eines gleichseitigen Dreiecks: U = 3 · a</p>
        <p>Umfang eines gleichschenkligen Dreiecks: U = 2 · Schenkel + Basis</p>
        <p>Flächeninhalt eines Rechtecks: A = a · b</p>
        <p>Flächeninhalt eines rechtwinkligen Dreiecks: A = (g · h) : 2</p>
        <p>Dabei sind g und h die beiden Seiten am rechten Winkel.</p>
        <p>Jedes Quadrat ist ein Rechteck, eine Raute, ein Parallelogramm, ein Trapez und
        ein Drachen. Umgekehrt gilt das nicht.</p>
      </div>

      <h3>So bestimmst du die Art</h3>
      <ol class="schritte">
        <li>Zähle, welche Seiten gleich lang sind. Alle vier? Zwei gegenüberliegende?
        Zwei benachbarte?</li>
        <li>Schau nach parallelen Seiten. Kein Paar, ein Paar oder zwei Paare?</li>
        <li>Prüfe die Winkel. Ist ein rechter Winkel dabei, sind es meist gleich vier.</li>
        <li>Wenn du unsicher bist, hilft die Diagonale. Sind beide gleich lang? Stehen
        sie senkrecht? Halbieren sie einander?</li>
        <li>Nenne zum Schluss den <strong>genauesten</strong> Namen. Ein Quadrat heißt
        Quadrat, auch wenn Rechteck ebenfalls stimmen würde.</li>
      </ol>

      <h3>Beispiele</h3>

      <div class="example-box">
        <p class="ex-title">Linas Lattenviereck</p>
        <p>Vier Latten zu je 80 cm ergeben vier gleich lange Seiten. Das reicht für eine
        <strong>Raute</strong>, aber noch nicht für ein Quadrat.</p>
        <p>Lina kann den Rahmen nämlich zur Seite drücken, ohne dass eine Latte länger oder
        kürzer wird. Aus den Winkeln 90°, 90°, 90°, 90° werden dann zum Beispiel 60°, 120°,
        60°, 120°. Die Seiten sind weiter 80 cm lang, das Quadrat ist trotzdem weg.</p>
        <p>Erst wenn Lina zusätzlich einen rechten Winkel einstellt, ist es ein Quadrat.
        Ihr Umfang ist so oder so U = 4 · 80 cm = <strong>320 cm</strong>.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Ein Viereck an seinen Diagonalen erkennen</p>
        <p>Von einem Viereck ist bekannt: Die Diagonalen halbieren einander und stehen
        senkrecht aufeinander. Die eine ist 12 cm lang, die andere 8 cm.</p>
        <p>Dass sie sich halbieren, haben alle Parallelogramme. Dass sie senkrecht stehen,
        hat unter ihnen nur die Raute. Gleich lang sind sie nicht, sonst wäre es ein
        Quadrat.</p>
        <p>Der genaueste Name ist also <strong>Raute</strong>.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Ein Dreieck doppelt benennen</p>
        <p>Ein Dreieck hat die Seiten 6 cm, 6 cm und 9 cm. Seine Winkel messen dann rund
        41°, 41° und 97°. (Die drei Werte sind gerundet, deshalb ergeben sie zusammen
        179° statt 180°.)</p>
        <p>Zwei Seiten sind gleich lang, die dritte nicht. Nach den Seiten ist es also
        <strong>gleichschenklig</strong>. Die beiden 6 cm langen Seiten sind die Schenkel,
        die 9 cm lange Seite ist die Basis.</p>
        <p>Der größte Winkel misst rund 97°, das ist mehr als 90°. Nach den Winkeln ist es also
        <strong>stumpfwinklig</strong>. Beide Namen stimmen gleichzeitig.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Eine fehlende Seite aus dem Umfang</p>
        <p>Ein Parallelogramm hat den Umfang 34 cm. Eine Seite ist 5 cm lang. Wie lang ist
        die benachbarte Seite?</p>
        <p>Im Parallelogramm kommt jede Länge zweimal vor. Die Hälfte des Umfangs ist also
        a + b: 34 cm : 2 = 17 cm.</p>
        <p>Damit bleibt für die zweite Seite: 17 cm − 5 cm = <strong>12 cm</strong>.</p>
        <p>Probe: 5 cm + 12 cm + 5 cm + 12 cm ergibt 34 cm.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Eine Ecke aussparen</p>
        <p>Ein rechteckiger Hof ist 14 m lang und 9 m breit. In einer Ecke steht ein
        Schuppen, 4 m lang und 3 m breit. Wie groß ist die freie Fläche, wie lang ist der
        Rand des freien Teils?</p>
        <p>Fläche des Hofes: 14 m · 9 m = 126 m². Fläche des Schuppens: 4 m · 3 m = 12 m².
        Frei bleiben 126 m² − 12 m² = <strong>114 m²</strong>.</p>
        <p>Der Rand der freien Fläche hat sechs Strecken. Zwei Seiten bleiben ganz, zwei
        sind verkürzt, zwei kommen vom Ausschnitt dazu: 14 m + 6 m + 4 m + 3 m + 10 m +
        9 m = <strong>46 m</strong>.</p>
        <p>Das ist genau der Umfang des ganzen Hofes: 2 · (14 m + 9 m) ergibt ebenfalls
        46 m. Die Ecke auszusparen kostet Fläche, aber keinen Rand.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Zwei Teile zusammensetzen</p>
        <p>Ein Wimpel besteht aus einem Rechteck und einem rechtwinkligen Dreieck. Das
        Rechteck ist 20 cm lang und 8 cm hoch. Rechts schließt das Dreieck an; seine
        Seiten am rechten Winkel sind 8 cm und 6 cm lang.</p>
        <p>Rechteck: 20 cm · 8 cm = 160 cm². Dreieck: (8 cm · 6 cm) : 2 = 48 cm² : 2 =
        24 cm². Zusammen sind das <strong>184 cm²</strong>.</p>
        <p>Rückwärts geht es auch. Ein rechtwinkliges Dreieck hat 24 cm² Fläche, eine Seite
        am rechten Winkel ist 6 cm lang. Aus A = (g · h) : 2 wird mal 2 gerechnet
        g · h = 48 cm², also ist die andere Seite 48 cm² : 6 cm = <strong>8 cm</strong>
        lang.</p>
      </div>

      <div class="achtung-box">
        <p class="achtung-title">Die Oberbegriffe gelten nur in eine Richtung</p>
        <p>Jedes Quadrat ist ein Rechteck. Viele drehen den Satz um und behaupten, jedes
        Rechteck sei ein Quadrat. Das ist falsch, und ein einziges Beispiel widerlegt es.</p>
        <p><strong>Gegenbeispiel:</strong> Ein Rechteck mit den Seiten 5 cm und 3 cm.</p>
        <p>Es hat vier rechte Winkel, also ist es wirklich ein Rechteck. Aber seine Seiten
        sind 5 cm, 3 cm, 5 cm und 3 cm lang. Ein Quadrat bräuchte vier gleich lange Seiten,
        und 5 cm sind nicht 3 cm. Also ist dieses Rechteck kein Quadrat.</p>
        <p>Andersherum geht die Probe immer auf. Nimm ein Quadrat mit 4 cm Seitenlänge.
        Das Rechteck verlangt vier rechte Winkel: hat es. Es verlangt, dass
        gegenüberliegende Seiten gleich lang sind: 4 cm und 4 cm, stimmt. Mehr verlangt
        das Rechteck nicht. Also ist dieses Quadrat ein Rechteck – und jedes andere
        auch.</p>
        <p>Merke dir den Grund: Nach oben im Haus kommen Bedingungen dazu. Ein Pfeil
        bedeutet immer nur „ist ein Sonderfall von“ und nie umgekehrt.</p>
      </div>

      <div class="selbstcheck">
        <p class="box-title">Selbstcheck</p>
        <details><summary>Ein Viereck hat vier gleich lange Seiten. Welche Namen kommen infrage?</summary>
        <p>Raute auf jeden Fall, und Drachen ebenfalls, weil auch benachbarte Seiten gleich
        lang sind. Ob es zusätzlich ein Quadrat ist, verraten erst die Winkel.</p></details>
        <details><summary>Warum ist jedes Rechteck ein Trapez?</summary>
        <p>Ein Trapez braucht nur ein Paar paralleler Seiten. Das Rechteck hat zwei Paare,
        also auch mindestens eines. Damit ist die Bedingung erfüllt.</p></details>
        <details><summary>Die Diagonalen eines Vierecks sind gleich lang und halbieren einander, stehen aber nicht senkrecht. Welches Viereck ist es?</summary>
        <p>Ein Rechteck. Ständen sie zusätzlich senkrecht, wäre es ein Quadrat.</p></details>
        <details><summary>Ein Dreieck hat die Winkel 30°, 60° und 90°. Wie heißt es nach seinen Winkeln, wie nach seinen Seiten?</summary>
        <p>Nach den Winkeln rechtwinklig, denn ein Winkel misst genau 90°. Nach den Seiten
        ungleichseitig, denn zu drei verschiedenen Winkeln gehören drei verschiedene
        Seiten.</p></details>
        <details><summary>Wie viele Symmetrieachsen hat ein Parallelogramm mit den Seiten 8 cm und 5 cm ohne rechten Winkel?</summary>
        <p>Keine einzige. Es lässt sich zwar um seinen Mittelpunkt drehen, aber an keiner
        Geraden spiegeln.</p></details>
        <details><summary>Ein Drachen hat den Umfang 40 cm, zwei seiner Seiten sind je 7 cm lang. Wie lang sind die anderen beiden?</summary>
        <p>Die beiden bekannten Seiten sind zusammen 14 cm lang. Es bleiben 26 cm für das
        zweite Paar, jede Seite ist also 13 cm lang.</p></details>
      </div>
    `,

    gen(diff) {

      /* Grammatik der sechs Vierecksnamen. „Jeder Drachen“, aber „Jede Raute“ –
         ohne diese Tabelle stünde in jeder zweiten erzeugten Aussage ein falscher
         Artikel, und der Satz sähe aus wie ein Tippfehler statt wie Mathematik. */
      const V = {
        Quadrat:        { jedes: 'Jedes', ein: 'ein' },
        Rechteck:       { jedes: 'Jedes', ein: 'ein' },
        Raute:          { jedes: 'Jede',  ein: 'eine' },
        Parallelogramm: { jedes: 'Jedes', ein: 'ein' },
        Trapez:         { jedes: 'Jedes', ein: 'ein' },
        Drachen:        { jedes: 'Jeder', ein: 'ein' }
      };
      const NAMEN = ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'];

      /* Haus der Vierecke: wovon jede Form ein Sonderfall ist. */
      const OBER = {
        Quadrat: ['Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'],
        Rechteck: ['Parallelogramm', 'Trapez'],
        Raute: ['Parallelogramm', 'Trapez', 'Drachen'],
        Parallelogramm: ['Trapez'],
        Trapez: [],
        Drachen: []
      };

      /* Rückmeldung für die beiden Fragen nach dem genauesten Namen. Ein
         falscher Name ist dort entweder ein Oberbegriff – er stimmt auch, sagt
         aber weniger, als beschrieben ist – oder er verlangt etwas, das die
         Beschreibung ausschließt oder nicht hergibt. Im ersten Fall nennt der
         Grund, was für den gewählten Namen schon genügt; die gesuchte Form nennt
         er nie. */
      const genauer = (x, genuegt) =>
        `${V[x].ein[0].toUpperCase()}${V[x].ein.slice(1)} ${x} ist es auch – aber ${genuegt}. Gesucht ist der genaueste Name.`;
      const GENUEGT_SEITEN = {
        Rechteck: 'dafür genügen schon vier rechte Winkel',
        Raute: 'dafür genügen schon vier gleich lange Seiten',
        Parallelogramm: 'dafür genügen schon zwei Paare paralleler Seiten',
        Trapez: 'dafür genügt schon ein Paar paralleler Seiten',
        Drachen: 'dafür genügen schon zwei Paare benachbarter gleich langer Seiten'
      };
      const GENUEGT_DIAGONALEN = {
        Rechteck: 'dafür genügen schon gleich lange Diagonalen, die einander halbieren',
        Raute: 'dafür genügen schon senkrechte Diagonalen, die einander halbieren',
        Parallelogramm: 'dafür genügen schon Diagonalen, die einander halbieren',
        Drachen: 'dafür genügen schon senkrechte Diagonalen, von denen eine halbiert wird'
      };
      /* [beschrieben][gewählt] für Namen, die kein Oberbegriff sind. */
      const PASST_NICHT_SEITEN = {
        Rechteck: {
          Quadrat: 'Ein Quadrat braucht vier gleich lange Seiten – hier sind benachbarte Seiten verschieden lang.',
          Raute: 'Eine Raute braucht vier gleich lange Seiten – hier sind benachbarte Seiten verschieden lang.',
          Drachen: 'Ein Drachen braucht gleich lange benachbarte Seiten – hier sind benachbarte Seiten verschieden lang.'
        },
        Raute: {
          Quadrat: 'Ein Quadrat hat neben vier gleich langen Seiten auch vier rechte Winkel – hier ist keiner ein rechter.',
          Rechteck: 'Ein Rechteck braucht vier rechte Winkel – hier ist kein Winkel ein rechter.'
        },
        Parallelogramm: {
          Quadrat: 'Ein Quadrat braucht rechte Winkel und vier gleich lange Seiten – hier fehlt beides.',
          Rechteck: 'Ein Rechteck braucht vier rechte Winkel – hier gibt es keinen.',
          Raute: 'Eine Raute braucht vier gleich lange Seiten – hier sind benachbarte Seiten verschieden lang.',
          Drachen: 'Ein Drachen braucht gleich lange benachbarte Seiten – hier sind benachbarte Seiten verschieden lang.'
        },
        Trapez: {
          Quadrat: 'Ein Quadrat hat zwei Paare paralleler Seiten – hier ist nur ein Paar parallel.',
          Rechteck: 'Ein Rechteck hat zwei Paare paralleler Seiten – hier ist nur ein Paar parallel.',
          Raute: 'Eine Raute hat zwei Paare paralleler Seiten – hier ist nur ein Paar parallel.',
          Parallelogramm: 'Ein Parallelogramm braucht zwei Paare paralleler Seiten – hier ist nur ein Paar parallel.',
          Drachen: 'Ein Drachen braucht zwei Paare benachbarter gleich langer Seiten – davon steht hier nichts.'
        },
        Drachen: {
          Quadrat: 'Beim Quadrat sind alle vier Seiten gleich lang – das schließt die Beschreibung aus.',
          Rechteck: 'Ein Rechteck braucht vier rechte Winkel – davon steht hier nichts.',
          Raute: 'Bei der Raute sind alle vier Seiten gleich lang – das schließt die Beschreibung aus.',
          Parallelogramm: 'Ein Parallelogramm braucht zwei Paare paralleler Seiten – davon steht hier nichts.',
          Trapez: 'Ein Trapez braucht ein Paar paralleler Seiten – davon steht hier nichts.'
        }
      };
      const PASST_NICHT_DIAGONALEN = {
        Rechteck: {
          Quadrat: 'Beim Quadrat stehen die Diagonalen senkrecht aufeinander – hier nicht.',
          Raute: 'Bei der Raute stehen die Diagonalen senkrecht aufeinander – hier nicht.',
          Drachen: 'Beim Drachen stehen die Diagonalen senkrecht aufeinander – hier nicht.'
        },
        Raute: {
          Quadrat: 'Beim Quadrat sind die Diagonalen gleich lang – hier nicht.',
          Rechteck: 'Beim Rechteck sind die Diagonalen gleich lang – hier nicht.'
        },
        Parallelogramm: {
          Quadrat: 'Beim Quadrat sind die Diagonalen gleich lang und senkrecht zueinander – hier ist beides nicht der Fall.',
          Rechteck: 'Beim Rechteck sind die Diagonalen gleich lang – hier nicht.',
          Raute: 'Bei der Raute stehen die Diagonalen senkrecht aufeinander – hier nicht.',
          Drachen: 'Beim Drachen stehen die Diagonalen senkrecht aufeinander – hier nicht.'
        },
        Drachen: {
          Quadrat: 'Beim Quadrat halbieren sich beide Diagonalen gegenseitig – hier wird nur eine halbiert.',
          Rechteck: 'Beim Rechteck halbieren sich beide Diagonalen gegenseitig – hier wird nur eine halbiert.',
          Raute: 'Bei der Raute halbieren sich beide Diagonalen gegenseitig – hier wird nur eine halbiert.',
          Parallelogramm: 'Im Parallelogramm halbieren sich beide Diagonalen gegenseitig – hier wird nur eine halbiert.'
        }
      };
      const nameFehl = (beschrieben, x, genuegt, passtNicht) =>
        OBER[beschrieben].includes(x) ? genauer(x, genuegt[x]) : passtNicht[beschrieben][x];

      /* ============================================================
         Stufe 1 – die Arten an ihren Eigenschaften erkennen
         ============================================================ */
      if (diff === 1) {
        const art = rnd(1, 4);

        /* 1 · Vierecksart aus einer Beschreibung.
           Jede Beschreibung schließt die Sonderfälle nach unten aus („aber kein
           rechter Winkel“). Nach oben lässt sich das nicht ausschließen: Ein
           Rechteck IST auch ein Parallelogramm und ein Trapez, und beide stehen
           als Ablenker daneben. Deshalb wird ausdrücklich der GENAUESTE Name
           verlangt – sonst hätte die Aufgabe mehrere richtige Antworten. */
        if (art === 1) {
          const b = choice([
            { name: 'Quadrat',
              text: 'Alle vier Seiten sind gleich lang, und alle vier Winkel sind rechte Winkel.',
              grund: 'Vier gleich lange Seiten und vier rechte Winkel hat nur das Quadrat. Ohne die rechten Winkel wäre es eine Raute. Wären nur gegenüberliegende Seiten gleich lang, wäre es ein Rechteck.' },
            { name: 'Rechteck',
              text: 'Alle vier Winkel sind rechte Winkel, aber benachbarte Seiten sind verschieden lang.',
              grund: 'Vier rechte Winkel machen das Viereck zum Rechteck. Weil benachbarte Seiten verschieden lang sind, ist es kein Quadrat.' },
            { name: 'Raute',
              text: 'Alle vier Seiten sind gleich lang, aber kein Winkel ist ein rechter Winkel.',
              grund: 'Vier gleich lange Seiten machen das Viereck zur Raute. Weil kein rechter Winkel dabei ist, ist es kein Quadrat.' },
            { name: 'Parallelogramm',
              text: 'Beide Paare gegenüberliegender Seiten sind parallel und gleich lang. Es gibt keinen rechten Winkel, und benachbarte Seiten sind verschieden lang.',
              grund: 'Zwei Paare paralleler Seiten machen das Parallelogramm aus. Rechte Winkel fehlen, also ist es kein Rechteck. Benachbarte Seiten sind verschieden lang, also ist es keine Raute.' },
            { name: 'Trapez',
              text: 'Genau ein Paar gegenüberliegender Seiten ist parallel, das andere Paar nicht.',
              grund: 'Ein Paar paralleler Seiten genügt für das Trapez. Wären es zwei Paare, wäre es ein Parallelogramm.' },
            { name: 'Drachen',
              text: 'Zwei Paare benachbarter Seiten sind gleich lang, aber nicht alle vier Seiten.',
              grund: 'Benachbarte gleich lange Seiten sind das Kennzeichen des Drachens. Wären alle vier Seiten gleich lang, wäre es eine Raute.' }
          ]);
          // Fünf Ablenker statt drei: makeChoice wirft Doppelte weg, die Reserve
          // hält die Optionszahl trotzdem konstant bei vier.
          const ablenker = shuffle(NAMEN.filter(n => n !== b.name));
          const mc = makeChoice(b.name, ablenker,
            ablenker.map(x => nameFehl(b.name, x, GENUEGT_SEITEN, PASST_NICHT_SEITEN)));
          return {
            q: `Welches Viereck wird beschrieben? ${b.text} Gib den genauesten Namen an.`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: b.name,
            solution: b.grund
          };
        }

        /* 2 · Dreiecksart nach den Seiten */
        if (art === 2) {
          const sorte = choice(['gleichseitig', 'gleichschenklig', 'ungleichseitig']);
          let s;
          if (sorte === 'gleichseitig') {
            const a = rnd(3, 14);
            s = [a, a, a];
          } else if (sorte === 'gleichschenklig') {
            const sch = rnd(5, 14);
            // Basis kleiner als die Summe der Schenkel, sonst gibt es kein Dreieck.
            // Zusätzlich nie gleich dem Schenkel – sonst wäre es gleichseitig.
            const grenze = Math.min(2 * sch - 2, sch + 6);
            let bas = rnd(2, grenze);
            while (bas === sch) bas = rnd(2, grenze);
            s = shuffle([sch, sch, bas]);
          } else {
            let a, b, c;
            do {
              a = rnd(3, 10); b = rnd(4, 12); c = rnd(5, 15);
            } while (a === b || b === c || a === c ||
                     Math.max(a, b, c) * 2 >= a + b + c);
            s = shuffle([a, b, c]);
          }
          const gross = Math.max(...s), klein = Math.min(...s);
          const grund = sorte === 'gleichseitig'
            ? `Alle drei Seiten messen ${fmt(s[0])} cm. Drei gleich lange Seiten heißen gleichseitig.`
            : sorte === 'gleichschenklig'
              ? 'Zwei Seiten sind gleich lang, die dritte nicht. Die beiden gleichen heißen Schenkel, die dritte ist die Basis – das Dreieck ist gleichschenklig.'
              : `Die drei Seiten sind alle verschieden lang, von ${fmt(klein)} cm bis ${fmt(gross)} cm. Damit ist das Dreieck ungleichseitig.`;
          // Die Namen wie in der Tabelle der Erklärseite: gleichschenklig heißt
          // dort „genau zwei Seiten gleich lang“.
          const doppelt = s.find((x, i) => s.indexOf(x) !== i);
          const fehl = {
            gleichseitig: {
              // gilt unter beiden Lesarten von „gleichschenklig“ (genau / mindestens zwei)
              gleichschenklig: 'Hier sind alle drei Seiten gleich lang, nicht nur zwei.',
              ungleichseitig: 'Ungleichseitig heißt: alle drei Seiten verschieden lang. Hier kommt eine Länge mehrfach vor.'
            },
            gleichschenklig: {
              gleichseitig: 'Gleichseitig heißt: alle drei Seiten gleich lang. Hier ist eine Seite anders lang.',
              ungleichseitig: `Ungleichseitig heißt: alle drei Seiten verschieden lang. Hier kommt ${fmt(doppelt)} cm zweimal vor.`
            },
            ungleichseitig: {
              gleichseitig: `Gleichseitig heißt: alle drei Seiten gleich lang. Hier reichen sie von ${fmt(klein)} cm bis ${fmt(gross)} cm.`,
              gleichschenklig: 'Gleichschenklig heißt: genau zwei Seiten gleich lang. Hier kommt keine Länge zweimal vor.'
            }
          }[sorte];
          const ablenker = shuffle(['gleichseitig', 'gleichschenklig', 'ungleichseitig'].filter(x => x !== sorte));
          const mc = makeChoice(sorte, ablenker, ablenker.map(x => fehl[x]));
          return {
            q: `Ein Dreieck hat die Seiten ${fmt(s[0])} cm, ${fmt(s[1])} cm und ${fmt(s[2])} cm. Wie heißt es nach seinen Seiten?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: sorte,
            solution: grund
          };
        }

        /* 3 · Dreiecksart nach den Winkeln.
           Hier wird nichts ausgerechnet: Alle drei Winkel stehen da, gefragt ist
           allein die Einordnung. Das Ausrechnen eines fehlenden Winkels gehört
           zum Thema „Winkel“. */
        if (art === 3) {
          const sorte = choice(['spitzwinklig', 'rechtwinklig', 'stumpfwinklig']);
          let w;
          if (sorte === 'rechtwinklig') {
            const a = rnd(20, 70);
            w = shuffle([90, a, 90 - a]);
          } else if (sorte === 'stumpfwinklig') {
            const g = rnd(95, 140);
            const a = rnd(15, 165 - g);
            w = shuffle([g, a, 180 - g - a]);
          } else {
            let a, b, c;
            do { a = rnd(45, 85); b = rnd(45, 85); c = 180 - a - b; }
            while (c < 25 || c > 85);
            w = shuffle([a, b, c]);
          }
          const gross = Math.max(...w);
          const grund = sorte === 'rechtwinklig'
            ? 'Ein Winkel misst genau 90°. Damit ist das Dreieck rechtwinklig.'
            : sorte === 'stumpfwinklig'
              ? `Der größte Winkel misst ${fmt(gross)}°. Das ist mehr als 90°, also ist das Dreieck stumpfwinklig.`
              : `Der größte Winkel misst ${fmt(gross)}°. Auch er bleibt unter 90°, also sind alle drei Winkel spitz.`;
          // „Keiner misst 90°“ gilt bei spitz- und stumpfwinklig für jede Ziehung:
          // Der größte spitze Winkel ist 85°, die kleinen Winkel der stumpfen
          // Dreiecke bleiben unter 71°.
          const fehl = {
            rechtwinklig: {
              spitzwinklig: 'Spitzwinklig heißt: alle drei Winkel kleiner als 90°. Ein Winkel von genau 90° ist nicht spitz.',
              stumpfwinklig: 'Stumpfwinklig heißt: ein Winkel größer als 90°. Genau 90° ist noch nicht stumpf.'
            },
            stumpfwinklig: {
              spitzwinklig: `Spitzwinklig heißt: alle drei Winkel kleiner als 90°. ${fmt(gross)}° ist größer.`,
              rechtwinklig: 'Rechtwinklig heißt: ein Winkel misst genau 90°. Keiner der drei Winkel misst 90°.'
            },
            spitzwinklig: {
              rechtwinklig: 'Rechtwinklig heißt: ein Winkel misst genau 90°. Keiner der drei Winkel misst 90°.',
              stumpfwinklig: `Stumpfwinklig heißt: ein Winkel größer als 90°. Hier misst der größte nur ${fmt(gross)}°.`
            }
          }[sorte];
          const ablenker = shuffle(['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'].filter(x => x !== sorte));
          const mc = makeChoice(sorte, ablenker, ablenker.map(x => fehl[x]));
          return {
            q: `Ein Dreieck hat die Winkel ${fmt(w[0])}°, ${fmt(w[1])}° und ${fmt(w[2])}°. Wie heißt es nach seinen Winkeln?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: sorte,
            solution: grund
          };
        }

        /* 4 · Symmetrieachsen.
           Die Figur wird mit konkreten Maßen beschrieben, damit die Sonderfälle
           ausgeschlossen sind: „ein Rechteck“ allein könnte ein Quadrat sein und
           hätte dann vier Achsen statt zwei. */
        const f = choice([
          (() => {
            // „lang“ muss die längere Seite sein – sonst steht da „8 cm lang und 12 cm breit“.
            const x = rnd(5, 14); let y = rnd(3, 12); while (y === x) y = rnd(3, 12);
            const a = Math.max(x, y), b = Math.min(x, y);
            return { t: `Ein Rechteck ist ${fmt(a)} cm lang und ${fmt(b)} cm breit.`, n: 2,
              g: 'Ein Rechteck lässt sich an zwei Mittellinien spiegeln: einmal längs, einmal quer. Über eine Diagonale geklappt passt es nicht auf sich selbst.' };
          })(),
          (() => {
            const a = rnd(3, 12);
            return { t: `Ein Quadrat hat ${fmt(a)} cm lange Seiten.`, n: 4,
              g: 'Das Quadrat vereint beides: die zwei Mittellinien des Rechtecks und die zwei Diagonalen der Raute – zusammen vier Achsen.' };
          })(),
          (() => {
            const a = rnd(3, 12);
            return { t: `Eine Raute hat vier ${fmt(a)} cm lange Seiten und keinen rechten Winkel.`, n: 2,
              // Begründet wie die Erklärseite über die Ecken, nicht über die Lage:
              // „steht schief“ stützte die Vorstellung „Raute = gedrehtes Quadrat“.
              g: 'Die Raute ist an beiden Diagonalen symmetrisch. Die Mittellinien sind keine Achsen. An einer Mittellinie geklappt, müsste eine spitze Ecke auf einer stumpfen liegen.' };
          })(),
          (() => {
            const a = rnd(5, 14); let b = rnd(3, 12); while (b === a) b = rnd(3, 12);
            return { t: `Ein Parallelogramm hat die Seiten ${fmt(a)} cm und ${fmt(b)} cm und keinen rechten Winkel.`, n: 0,
              // Die beiden Klapp-Argumente der Erklärseite: Wer 2 tippt, hält meist
              // die Diagonalen für Achsen – der Weg muss sagen, warum sie keine sind.
              g: `Beim Viereck kommen nur die zwei Mittellinien und die zwei Diagonalen als Achse in Frage. An einer Mittellinie geklappt, müsste eine spitze Ecke auf einer stumpfen liegen. An einer Diagonalen geklappt, müsste die ${fmt(a)} cm lange Seite auf der ${fmt(b)} cm langen liegen. Also hat dieses Parallelogramm keine Symmetrieachse. Es passt nur auf sich selbst, wenn man es um seinen Mittelpunkt dreht.` };
          })(),
          (() => {
            const a = rnd(3, 8), b = a + rnd(2, 7);
            return { t: `Ein Drachen hat zwei ${fmt(a)} cm lange und zwei ${fmt(b)} cm lange Seiten.`, n: 1,
              g: 'Der Drachen ist an genau einer Diagonalen symmetrisch: an der zwischen den beiden Ecken, wo jeweils zwei gleich lange Seiten zusammenstoßen. Die andere Diagonale ist keine Achse, weil die beiden Seitenpaare verschieden lang sind.' };
          })(),
          (() => {
            const a = rnd(4, 13);
            return { t: `Ein Dreieck hat drei ${fmt(a)} cm lange Seiten.`, n: 3,
              g: 'Ein gleichseitiges Dreieck hat zu jeder seiner drei Seiten eine Spiegelachse.' };
          })(),
          (() => {
            const sch = rnd(6, 13); let bas = rnd(3, sch + 5); while (bas === sch) bas = rnd(3, sch + 5);
            return { t: `Ein Dreieck hat die Seiten ${fmt(sch)} cm, ${fmt(sch)} cm und ${fmt(bas)} cm.`, n: 1,
              g: 'Zwei gleich lange Seiten bedeuten eine Achse: die Gerade durch die Spitze und die Mitte der Basis.' };
          })(),
          (() => {
            let a, b, c;
            do { a = rnd(3, 9); b = rnd(4, 12); c = rnd(6, 15); }
            while (a === b || b === c || a === c || Math.max(a, b, c) * 2 >= a + b + c);
            return { t: `Ein Dreieck hat die Seiten ${fmt(a)} cm, ${fmt(b)} cm und ${fmt(c)} cm.`, n: 0,
              g: 'Alle drei Seiten sind verschieden lang. Dann gibt es keine Achse, an der sich die Figur decken würde.' };
          })()
        ]);
        return {
          q: `${f.t} Wie viele Symmetrieachsen hat die Figur?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(f.n, 1e-6, { zahlwort: true }), testAnswer: String(f.n),
          answerText: `${fmt(f.n)} ${plural(f.n, 'Symmetrieachse', 'Symmetrieachsen')}`,
          solution: f.g
        };
      }

      /* ============================================================
         Stufe 2 – Eigenschaften anwenden
         ============================================================ */
      if (diff === 2) {
        const art = rnd(1, 7);

        /* 1 · Umfang eines Parallelogramms aus zwei Seiten */
        if (art === 1) {
          const a = rnd(4, 16);
          let b = rnd(3, 15); while (b === a) b = rnd(3, 15);
          const U = 2 * (a + b);
          return {
            q: `Ein Parallelogramm hat die Seiten a = ${fmt(a)} cm und b = ${fmt(b)} cm. Wie groß ist sein Umfang (in cm)?`,
            type: 'input', placeholder: 'Umfang in cm',
            check: numCheck(U), testAnswer: String(U), answerText: `${fmt(U)} cm`,
            solution: `Im Parallelogramm sind gegenüberliegende Seiten gleich lang. Jede Länge kommt also zweimal vor.&ensp;<span class="trenn">•</span>&ensp;U = 2 · (a + b) = 2 · (${fmt(a)} cm + ${fmt(b)} cm) = 2 · ${fmt(a + b)} cm = <strong>${fmt(U)} cm</strong>`
          };
        }

        /* 2 · Fehlende Seite im Parallelogramm */
        if (art === 2) {
          const a = rnd(3, 14);
          let b = rnd(3, 14); while (b === a) b = rnd(3, 14);
          const U = 2 * (a + b);
          return {
            q: `Ein Parallelogramm hat den Umfang ${fmt(U)} cm. Eine Seite ist ${fmt(a)} cm lang. Wie lang ist die benachbarte Seite (in cm)?`,
            type: 'input', placeholder: 'Seite in cm',
            check: numCheck(b), testAnswer: String(b), answerText: `${fmt(b)} cm`,
            solution: `Aus U = 2 · (a + b) folgt: Die Hälfte des Umfangs ist a + b.&ensp;<span class="trenn">•</span>&ensp;a + b = ${fmt(U)} cm : 2 = ${fmt(U / 2)} cm&ensp;<span class="trenn">•</span>&ensp;b = ${fmt(U / 2)} cm − ${fmt(a)} cm = <strong>${fmt(b)} cm</strong>`
          };
        }

        /* 3 · Seitenlänge einer Raute aus dem Umfang */
        if (art === 3) {
          const a = rnd(3, 18), U = 4 * a;
          return {
            q: `Eine Raute hat den Umfang ${fmt(U)} cm. Wie lang ist eine ihrer Seiten (in cm)?`,
            type: 'input', placeholder: 'Seite in cm',
            check: numCheck(a), testAnswer: String(a), answerText: `${fmt(a)} cm`,
            solution: `In der Raute sind alle vier Seiten gleich lang. Der Umfang verteilt sich also gleichmäßig auf vier Stücke.&ensp;<span class="trenn">•</span>&ensp;a = U : 4 = ${fmt(U)} cm : 4 = <strong>${fmt(a)} cm</strong>`
          };
        }

        /* 4 · Basis eines gleichschenkligen Dreiecks aus Umfang und Schenkel */
        if (art === 4) {
          const sch = rnd(6, 16);
          // Basis kleiner als beide Schenkel zusammen, sonst schließt sich das
          // Dreieck nicht. Und nie gleich dem Schenkel – sonst wäre es gleichseitig.
          const grenze = Math.min(2 * sch - 2, sch + 7);
          let bas = rnd(3, grenze);
          while (bas === sch) bas = rnd(3, grenze);
          const U = 2 * sch + bas;
          return {
            q: `Ein gleichschenkliges Dreieck hat den Umfang ${fmt(U)} cm. Jeder Schenkel ist ${fmt(sch)} cm lang. Wie lang ist die Basis (in cm)?`,
            type: 'input', placeholder: 'Basis in cm',
            check: numCheck(bas), testAnswer: String(bas), answerText: `${fmt(bas)} cm`,
            solution: `Gleichschenklig heißt: Die beiden Schenkel sind gleich lang.&ensp;<span class="trenn">•</span>&ensp;Zusammen messen sie 2 · ${fmt(sch)} cm = ${fmt(2 * sch)} cm.&ensp;<span class="trenn">•</span>&ensp;Für die Basis bleibt: ${fmt(U)} cm − ${fmt(2 * sch)} cm = <strong>${fmt(bas)} cm</strong>`
          };
        }

        /* 5 · Umfang eines gleichseitigen Dreiecks */
        if (art === 5) {
          const a = rnd(4, 19), U = 3 * a;
          return {
            q: `Ein gleichseitiges Dreieck hat ${fmt(a)} cm lange Seiten. Wie groß ist sein Umfang (in cm)?`,
            type: 'input', placeholder: 'Umfang in cm',
            check: numCheck(U), testAnswer: String(U), answerText: `${fmt(U)} cm`,
            solution: `Gleichseitig heißt: Alle drei Seiten sind gleich lang.&ensp;<span class="trenn">•</span>&ensp;U = 3 · a = 3 · ${fmt(a)} cm = <strong>${fmt(U)} cm</strong>`
          };
        }

        /* 6 · Diagonalen im Rechteck.
           Verlangt zwei Eigenschaften auf einmal: Die Diagonalen sind gleich lang
           UND sie halbieren einander. Nur zusammen ergibt sich, dass der Abstand
           zu JEDER Ecke derselbe ist. Deshalb steht in der Frage „eine Diagonale“
           und nicht „jede Diagonale“ – sonst wäre die halbe Antwort geschenkt. */
        if (art === 6) {
          const halb = rnd(3, 13), e = 2 * halb;
          return {
            q: `Eine Diagonale eines Rechtecks ist ${fmt(e)} cm lang. Wie weit ist der Schnittpunkt der Diagonalen von jeder Ecke entfernt (in cm)?`,
            type: 'input', placeholder: 'Abstand in cm',
            check: numCheck(halb), testAnswer: String(halb), answerText: `${fmt(halb)} cm`,
            solution: `Im Rechteck sind beide Diagonalen gleich lang, und sie halbieren einander. Vom Schnittpunkt zu jeder der vier Ecken ist es also gleich weit, nämlich eine halbe Diagonale.&ensp;<span class="trenn">•</span>&ensp;${fmt(e)} cm : 2 = <strong>${fmt(halb)} cm</strong>`
          };
        }

        /* 7 · Von den Diagonalen auf die Art schließen. Auch hier ist der
           genaueste Name verlangt: Ein Rechteck bleibt daneben ein
           Parallelogramm, und das steht als Ablenker mit im Feld.

           Das Trapez fehlt in den Antwortmöglichkeiten, und zwar mit Absicht:
           Es hat keine kennzeichnende Diagonaleneigenschaft, kann hier also nie
           die Lösung sein. Als Ablenker stand es in 61 % der Ziehungen und war
           in 0 % davon richtig – wer das einmal bemerkt, streicht es und rät
           fortan aus drei statt aus vier Möglichkeiten. Ohne Trapez ist jeder
           der fünf Namen genauso oft richtig, wie er im Feld steht. */
        const d = choice([
          { name: 'Quadrat',
            text: 'Die Diagonalen sind gleich lang, halbieren einander und stehen senkrecht aufeinander.',
            grund: 'Gleich lang wie beim Rechteck, senkrecht wie bei der Raute. Beides zusammen hat nur das Quadrat.' },
          { name: 'Rechteck',
            text: 'Die Diagonalen sind gleich lang und halbieren einander, stehen aber nicht senkrecht aufeinander.',
            grund: 'Gleich lange Diagonalen, die einander halbieren, hat das Rechteck. Senkrecht stünden sie nur beim Quadrat.' },
          { name: 'Raute',
            text: 'Die Diagonalen halbieren einander und stehen senkrecht aufeinander, sind aber verschieden lang.',
            grund: 'Senkrechte Diagonalen, die einander halbieren, hat die Raute. Gleich lang wären sie nur beim Quadrat.' },
          { name: 'Parallelogramm',
            text: 'Die Diagonalen halbieren einander, sind aber weder gleich lang noch senkrecht zueinander.',
            grund: 'Dass sich die Diagonalen halbieren, hat jedes Parallelogramm. Gleich lang sind sie nur im Rechteck, senkrecht nur in der Raute.' },
          { name: 'Drachen',
            text: 'Die Diagonalen stehen senkrecht aufeinander, aber nur eine der beiden wird von der anderen halbiert.',
            grund: 'Beim Drachen ist eine Diagonale die Symmetrieachse. Sie steht senkrecht auf der anderen und halbiert sie – selbst halbiert wird sie nicht.' }
        ]);
        const ablenker = shuffle(NAMEN.filter(n => n !== d.name && n !== 'Trapez'));
        const mcd = makeChoice(d.name, ablenker,
          ablenker.map(x => nameFehl(d.name, x, GENUEGT_DIAGONALEN, PASST_NICHT_DIAGONALEN)));
        return {
          q: `Welches Viereck ist gemeint? ${d.text} Gib den genauesten Namen an.`,
          type: 'choice', options: mcd.options, correct: mcd.correct, gruende: mcd.gruende,
          answerText: d.name,
          solution: d.grund
        };
      }

      /* ============================================================
         Stufe 3 – Haus der Vierecke und zusammengesetzte Figuren
         ============================================================ */
      const art = rnd(1, 6);

      /* 1 · Haus der Vierecke.
         Zwei Fragerichtungen im Wechsel: einmal die wahre Aussage suchen, einmal
         die falsche. Mit nur einer Richtung ließe sich die Aufgabe an einem
         Merkmal der Zeile lösen: Steht „Jedes Quadrat …“ im Feld, ist das immer
         die wahre Aussage – das Quadrat liegt ja unter allen anderen. In der
         Falsch-Variante ist genau diese Zeile ein Ablenker. Wer nicht liest,
         welche Richtung gefragt ist, gewinnt also nichts. */
      if (art === 1) {
        // OBER steht oben in gen() – die Fragen nach dem genauesten Namen brauchen es auch.
        const GRUND = {
          'Quadrat>Rechteck': 'Ein Rechteck braucht vier rechte Winkel. Die hat jedes Quadrat.',
          'Quadrat>Raute': 'Eine Raute braucht vier gleich lange Seiten. Die hat jedes Quadrat.',
          'Quadrat>Parallelogramm': 'Ein Parallelogramm braucht zwei Paare paralleler Seiten. Die hat jedes Quadrat.',
          'Quadrat>Trapez': 'Ein Trapez braucht ein Paar paralleler Seiten. Das Quadrat hat sogar zwei Paare.',
          'Quadrat>Drachen': 'Ein Drachen braucht zwei Paare benachbarter gleich langer Seiten. Im Quadrat sind alle vier Seiten gleich lang.',
          'Rechteck>Parallelogramm': 'Im Rechteck sind gegenüberliegende Seiten parallel. Genau das verlangt das Parallelogramm.',
          'Rechteck>Trapez': 'Ein Trapez braucht ein Paar paralleler Seiten. Das Rechteck hat zwei Paare.',
          'Raute>Parallelogramm': 'In der Raute sind gegenüberliegende Seiten parallel. Genau das verlangt das Parallelogramm.',
          'Raute>Trapez': 'Ein Trapez braucht ein Paar paralleler Seiten. Die Raute hat zwei Paare.',
          'Raute>Drachen': 'Ein Drachen braucht zwei Paare benachbarter gleich langer Seiten. In der Raute sind alle vier gleich lang.',
          'Parallelogramm>Trapez': 'Ein Trapez braucht ein Paar paralleler Seiten. Das Parallelogramm hat zwei Paare.'
        };
        const GEGEN = {
          'Quadrat>Rechteck': 'Ein Rechteck mit den Seiten 5 cm und 3 cm ist kein Quadrat.',
          'Quadrat>Raute': 'Eine Raute mit den Winkeln 60° und 120° ist kein Quadrat.',
          'Quadrat>Parallelogramm': 'Ein Parallelogramm mit den Seiten 6 cm und 4 cm ist kein Quadrat.',
          'Quadrat>Trapez': 'Ein Trapez mit den parallelen Seiten 8 cm und 5 cm ist kein Quadrat.',
          'Quadrat>Drachen': 'Ein Drachen mit zwei 3 cm und zwei 7 cm langen Seiten ist kein Quadrat.',
          'Rechteck>Parallelogramm': 'Ein Parallelogramm mit den Winkeln 70° und 110° ist kein Rechteck.',
          'Rechteck>Trapez': 'Ein Trapez mit den parallelen Seiten 9 cm und 4 cm ist kein Rechteck.',
          'Raute>Parallelogramm': 'Ein Parallelogramm mit den Seiten 7 cm und 3 cm ist keine Raute.',
          'Raute>Trapez': 'Ein Trapez mit den parallelen Seiten 10 cm und 6 cm ist keine Raute.',
          'Raute>Drachen': 'Ein Drachen mit zwei 5 cm und zwei 8 cm langen Seiten ist keine Raute.',
          'Parallelogramm>Trapez': 'Ein Trapez mit nur einem Paar paralleler Seiten ist kein Parallelogramm.'
        };
        const satz = (x, y) => `${V[x].jedes} ${x} ist ${V[y].ein} ${y}.`;

        /* Beide Aussagenlisten sind gleich lang: elf wahre Oberbegriffs-Paare und
           genau ihre elf Umkehrungen. Das ist kein Zufall, sondern die Bedingung
           dafür, dass die Aufgabe nicht am Wortlaut lösbar ist. Zieht man die
           richtige Antwort aus einer kleinen Menge und die Ablenker aus einer
           größeren, ist jede Zeile der kleinen Menge häufiger richtig als sie
           überhaupt im Feld steht – gemessen 43 % für „Jedes Trapez ist ein
           Parallelogramm". Mit zwei gleich großen Listen liegt jede einzelne
           Zeile bei genau 25 %, also bei blindem Raten.
           Nebenbei ist so JEDER Ablenker eine echte Fehlvorstellung und nicht
           ein zusammengewürfeltes Paar wie „Jedes Trapez ist ein Drachen“. */
        /* Nur mit den Oberbegriffssätzen bleibt ein Muster übrig, das ohne jedes
           Wissen über das einzelne Paar trägt: Das Quadrat ist Sonderfall von
           ALLEM, kann also nie Subjekt einer falschen Aussage sein; Trapez und
           Drachen sind Sonderfall von nichts und nie Subjekt einer wahren.
           Gemessen: „Jedes Quadrat …“ in einer Wahr-Frage war zu 100 % die
           Antwort, „Jedes Trapez …“ in einer Falsch-Frage ebenso – zusammen die
           Hälfte aller Ziehungen. Deshalb kommen Eigenschaftsaussagen dazu, die
           jede Form auf BEIDEN Seiten als Subjekt auftreten lassen. */
        /* Vierte Spalte: der Grund, wenn diese Aussage fälschlich gewählt wird –
           bei einer wahren Aussage (in der Falsch-Frage), warum sie stimmt, bei
           einer falschen (in der Wahr-Frage) das Gegenbeispiel. */
        const EIG_WAHR = [
          ['Quadrat', 'hat vier rechte Winkel.', 'Das steht schon in der Beschreibung des Quadrats.',
            'Vier rechte Winkel gehören zur Beschreibung des Quadrats.'],
          ['Quadrat', 'hat vier gleich lange Seiten.', 'Auch das gehört zur Beschreibung des Quadrats.',
            'Vier gleich lange Seiten gehören zur Beschreibung des Quadrats.'],
          ['Rechteck', 'hat gleich lange Diagonalen.', 'Das gilt in jedem Rechteck, auch im 8 cm mal 3 cm großen.',
            'Das gilt in jedem Rechteck, auch im 8 cm mal 3 cm großen.'],
          ['Raute', 'hat senkrecht zueinander stehende Diagonalen.', 'In jeder Raute schneiden sich die Diagonalen im rechten Winkel.',
            'Beide Diagonalen der Raute sind Symmetrieachsen, und sie kreuzen sich im rechten Winkel.'],
          ['Parallelogramm', 'hat zwei Paare paralleler Seiten.', 'Daher der Name: Beide Seitenpaare laufen parallel.',
            'Die beiden parallelen Seitenpaare geben dem Parallelogramm seinen Namen.'],
          ['Trapez', 'hat mindestens ein Paar paralleler Seiten.', 'Genau das macht ein Viereck zum Trapez.',
            'Genau das macht ein Viereck zum Trapez.'],
          ['Trapez', 'hat vier Ecken.', 'Jedes Trapez ist ein Viereck, und ein Viereck hat vier Ecken.',
            'Jedes Trapez ist ein Viereck, und ein Viereck hat vier Ecken.'],
          ['Drachen', 'hat zwei Paare benachbarter gleich langer Seiten.', 'Genau das ist die Beschreibung des Drachens.',
            'Genau das ist die Beschreibung des Drachens.'],
          ['Drachen', 'hat senkrecht zueinander stehende Diagonalen.', 'In jedem Drachen kreuzen sich die beiden Diagonalen im rechten Winkel.',
            'Die Symmetrieachse des Drachens steht senkrecht auf der anderen Diagonale.']
        ];
        const EIG_FALSCH = [
          ['Quadrat', 'hat zwei verschieden lange Seiten.', 'Im Quadrat sind alle vier Seiten gleich lang.',
            'Im Quadrat sind alle vier Seiten gleich lang.'],
          ['Quadrat', 'hat einen spitzen Winkel.', 'Alle vier Winkel des Quadrats messen 90°.',
            'Alle vier Winkel des Quadrats messen 90°.'],
          ['Rechteck', 'hat einen stumpfen Winkel.', 'Alle vier Winkel messen 90°; ein Winkel über 90° passt nicht dazu.',
            'Im Rechteck messen alle vier Winkel 90° – stumpf ist keiner.'],
          ['Raute', 'hat genau ein Paar paralleler Seiten.', 'Die Raute ist ein Parallelogramm – bei ihr laufen beide Seitenpaare parallel.',
            'Bei der Raute laufen beide Seitenpaare parallel.'],
          ['Parallelogramm', 'hat genau ein Paar paralleler Seiten.', 'Im Parallelogramm sind beide Seitenpaare parallel, also nie genau eines.',
            'Im Parallelogramm sind beide Seitenpaare parallel, also nie genau eines.'],
          ['Trapez', 'hat immer vier gleich lange Seiten.', 'Ein Trapez mit den parallelen Seiten 8 cm und 5 cm hat schon zwei verschiedene Längen.',
            'Ein Trapez mit den Seiten 8 cm, 5 cm, 4 cm und 5 cm hat drei verschiedene Längen.'],
          ['Drachen', 'hat vier verschieden lange Seiten.', 'Beim Drachen sind zwei Paare benachbarter Seiten gleich lang.',
            'Beim Drachen sind zwei Paare benachbarter Seiten gleich lang.']
        ];
        const eig = ([x, rest]) => `${V[x].jedes} ${x} ${rest}`;

        const paare = [];
        for (const x of NAMEN) for (const y of OBER[x]) paare.push([x, y]);
        const wahrSaetze = paare.map(([x, y]) => satz(x, y)).concat(EIG_WAHR.map(eig));
        const falschSaetze = paare.map(([x, y]) => satz(y, x)).concat(EIG_FALSCH.map(eig));

        /* Jede Aussage trägt ihre eigene Begründung mit – so darf die richtige
           Antwort aus BEIDEN Vorräten kommen, nicht nur aus den Oberbegriffssätzen.
           Vorher stammte die Lösung immer aus den Paaren; damit konnte das Quadrat
           nie die richtige Antwort einer Falsch-Frage sein und Trapez oder Drachen
           nie die einer Wahr-Frage. */
        const wahrVorrat = paare.map(([x, y]) => ({
          satz: satz(x, y),
          grund: `${GRUND[x + '>' + y]} Umgekehrt gilt es nicht: ${GEGEN[x + '>' + y]}`
        })).concat(EIG_WAHR.map(([x, rest, g]) => ({ satz: eig([x, rest]), grund: g })));

        const falschVorrat = paare.map(([x, y]) => ({
          satz: satz(y, x),
          grund: `${GEGEN[x + '>' + y]} Nur die Umkehrung stimmt: ${satz(x, y)}`
        })).concat(EIG_FALSCH.map(([x, rest, g]) => ({ satz: eig([x, rest]), grund: g })));

        /* Rückmeldung je Aussage, wenn sie fälschlich gewählt wird. Eine falsche
           Aussage bekommt nur ihr Gegenbeispiel – das „Nur die Umkehrung stimmt“
           des Lösungswegs nennte oft wörtlich die richtige Option. Eine wahre
           bekommt ihre Begründung ohne das „Umgekehrt gilt es nicht“. */
        const FEHL = new Map();
        paare.forEach(([x, y]) => {
          FEHL.set(satz(x, y), `Diese Aussage stimmt: ${GRUND[x + '>' + y]}`);
          FEHL.set(satz(y, x), GEGEN[x + '>' + y]);
        });
        EIG_WAHR.forEach(([x, rest, , f]) => FEHL.set(eig([x, rest]), `Diese Aussage stimmt: ${f}`));
        EIG_FALSCH.forEach(([x, rest, , f]) => FEHL.set(eig([x, rest]), f));
        /* Wo ein Grund die gesuchte Aussage mitverrät, schweigt er: „Im Quadrat
           sind alle vier Seiten gleich lang" neben „Jedes Quadrat hat vier gleich
           lange Seiten", „Ein Trapez braucht ein Paar paralleler Seiten“ neben
           „Jedes Trapez ist ein Parallelogramm“. [gewählt, [gesucht, …]] */
        const e = (x, rest) => eig([x, rest]);
        const STILL = new Map([
          // Wahr-Frage: Gegenbeispiele, die eine wahre Option aussprechen
          [e('Quadrat', 'hat zwei verschieden lange Seiten.'),
            [e('Quadrat', 'hat vier gleich lange Seiten.'), satz('Quadrat', 'Raute'), satz('Quadrat', 'Drachen')]],
          [e('Quadrat', 'hat einen spitzen Winkel.'), [e('Quadrat', 'hat vier rechte Winkel.'), satz('Quadrat', 'Rechteck')]],
          [e('Raute', 'hat genau ein Paar paralleler Seiten.'), [satz('Raute', 'Parallelogramm'), satz('Raute', 'Trapez')]],
          [e('Parallelogramm', 'hat genau ein Paar paralleler Seiten.'),
            [e('Parallelogramm', 'hat zwei Paare paralleler Seiten.'), satz('Parallelogramm', 'Trapez')]],
          [e('Drachen', 'hat vier verschieden lange Seiten.'),
            [e('Drachen', 'hat zwei Paare benachbarter gleich langer Seiten.'), satz('Quadrat', 'Drachen'), satz('Raute', 'Drachen')]],
          [satz('Trapez', 'Quadrat'), [e('Trapez', 'hat mindestens ein Paar paralleler Seiten.')]],
          [satz('Trapez', 'Rechteck'), [e('Trapez', 'hat mindestens ein Paar paralleler Seiten.')]],
          [satz('Trapez', 'Raute'), [e('Trapez', 'hat mindestens ein Paar paralleler Seiten.')]],
          [satz('Trapez', 'Parallelogramm'),
            [e('Trapez', 'hat mindestens ein Paar paralleler Seiten.'), e('Parallelogramm', 'hat zwei Paare paralleler Seiten.')]],
          [satz('Drachen', 'Quadrat'), [e('Drachen', 'hat zwei Paare benachbarter gleich langer Seiten.')]],
          [satz('Drachen', 'Raute'), [e('Drachen', 'hat zwei Paare benachbarter gleich langer Seiten.')]],
          // Falsch-Frage: Begründungen, die eine falsche Option widerlegen
          [satz('Quadrat', 'Rechteck'), [e('Quadrat', 'hat einen spitzen Winkel.'), e('Rechteck', 'hat einen stumpfen Winkel.')]],
          [satz('Quadrat', 'Raute'), [e('Quadrat', 'hat zwei verschieden lange Seiten.')]],
          [satz('Quadrat', 'Parallelogramm'), [e('Parallelogramm', 'hat genau ein Paar paralleler Seiten.'), satz('Trapez', 'Parallelogramm')]],
          [satz('Quadrat', 'Trapez'), [satz('Trapez', 'Parallelogramm'), satz('Trapez', 'Quadrat')]],
          [satz('Quadrat', 'Drachen'), [e('Quadrat', 'hat zwei verschieden lange Seiten.'), e('Drachen', 'hat vier verschieden lange Seiten.'),
            satz('Drachen', 'Quadrat'), satz('Drachen', 'Raute')]],
          [satz('Rechteck', 'Parallelogramm'), [e('Parallelogramm', 'hat genau ein Paar paralleler Seiten.')]],
          [satz('Rechteck', 'Trapez'), [satz('Trapez', 'Parallelogramm'), satz('Trapez', 'Rechteck')]],
          [satz('Raute', 'Parallelogramm'), [e('Raute', 'hat genau ein Paar paralleler Seiten.'), e('Parallelogramm', 'hat genau ein Paar paralleler Seiten.')]],
          [satz('Raute', 'Trapez'), [e('Raute', 'hat genau ein Paar paralleler Seiten.'), satz('Trapez', 'Parallelogramm'), satz('Trapez', 'Raute')]],
          // Das 8-cm-mal-3-cm-Rechteck ist zugleich das Gegenbeispiel zu „Jedes Rechteck ist ein Quadrat“
          [e('Rechteck', 'hat gleich lange Diagonalen.'), [satz('Rechteck', 'Quadrat')]],
          [satz('Raute', 'Drachen'), [e('Drachen', 'hat vier verschieden lange Seiten.'), satz('Drachen', 'Quadrat'), satz('Drachen', 'Raute')]],
          [satz('Parallelogramm', 'Trapez'), [e('Parallelogramm', 'hat genau ein Paar paralleler Seiten.'), satz('Trapez', 'Parallelogramm')]],
          [e('Quadrat', 'hat vier rechte Winkel.'), [e('Quadrat', 'hat einen spitzen Winkel.')]],
          [e('Quadrat', 'hat vier gleich lange Seiten.'), [e('Quadrat', 'hat zwei verschieden lange Seiten.')]],
          [e('Parallelogramm', 'hat zwei Paare paralleler Seiten.'),
            [e('Parallelogramm', 'hat genau ein Paar paralleler Seiten.'), satz('Trapez', 'Parallelogramm')]],
          [e('Trapez', 'hat mindestens ein Paar paralleler Seiten.'), [satz('Trapez', 'Parallelogramm')]],
          [e('Drachen', 'hat zwei Paare benachbarter gleich langer Seiten.'),
            [e('Drachen', 'hat vier verschieden lange Seiten.'), satz('Drachen', 'Quadrat'), satz('Drachen', 'Raute')]]
        ]);

        const wahrFrage = choice([true, false]);
        const ziel = choice(wahrFrage ? wahrVorrat : falschVorrat);
        const gegen = shuffle((wahrFrage ? falschVorrat : wahrVorrat).map(z => z.satz));
        const mc = makeChoice(ziel.satz, gegen,
          gegen.map(s => (STILL.get(s) || []).includes(ziel.satz) ? null : FEHL.get(s)));
        return {
          q: `Welche dieser vier Aussagen über das Haus der Vierecke ist ${wahrFrage ? 'wahr' : 'falsch'}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: ziel.satz,
          solution: `${wahrFrage ? 'Wahr' : 'Falsch'} ist: <strong>${ziel.satz}</strong>&ensp;<span class="trenn">•</span>&ensp;${ziel.grund}`
        };
      }

      /* 2 · Gilt eine Aussage immer, manchmal oder nie?
         Erst die Kategorie ziehen, dann den Satz. Zieht man gleichverteilt über
         alle Sätze, hängt die Antwortverteilung an der Länge der drei Listen. */
      if (art === 2) {
        const AUSSAGEN = {
          immer: [
            { s: 'Ein Quadrat hat vier rechte Winkel.', g: 'Das steht schon in der Beschreibung des Quadrats. Ohne vier rechte Winkel ist es keines.' },
            { s: 'Ein Rechteck hat vier rechte Winkel.', g: 'Genau dadurch ist das Rechteck festgelegt.' },
            { s: 'Ein Rechteck hat gleich lange Diagonalen.', g: 'Das gilt in jedem Rechteck, auch im 8 cm mal 3 cm großen: Beide Diagonalen messen dort dasselbe.' },
            { s: 'Eine Raute hat vier gleich lange Seiten.', g: 'Das ist die Beschreibung der Raute.' },
            { s: 'Eine Raute hat senkrecht zueinander stehende Diagonalen.', g: 'In jeder Raute schneiden sich die beiden Diagonalen im rechten Winkel.' },
            { s: 'Ein Parallelogramm hat zwei Paare paralleler Seiten.', g: 'Daher der Name: Beide Seitenpaare laufen parallel.' },
            { s: 'Ein Quadrat hat vier gleich lange Seiten.', g: 'Auch das steht in der Beschreibung des Quadrats.' },
            { s: 'Ein Trapez hat mindestens ein Paar paralleler Seiten.', g: 'Genau das macht ein Viereck zum Trapez.' },
            { s: 'Ein Trapez hat vier Ecken.', g: 'Jedes Trapez ist ein Viereck, und ein Viereck hat vier Ecken.' },
            { s: 'Ein Drachen hat zwei Paare benachbarter gleich langer Seiten.', g: 'Das ist die Beschreibung des Drachens.' },
            { s: 'Ein Drachen hat senkrecht zueinander stehende Diagonalen.', g: 'In jedem Drachen kreuzen sich die beiden Diagonalen im rechten Winkel.' }
          ],
          /* bsp: eine Form, bei der die Aussage stimmt – gegen: eine, bei der
             sie nicht stimmt. Beide für die Rückmeldung auf „nie“ und „immer“. */
          manchmal: [
            { s: 'Ein Rechteck hat vier gleich lange Seiten.', g: 'Nur beim Quadrat. Ein Rechteck mit den Seiten 5 cm und 3 cm hat sie nicht.',
              bsp: 'jedes Quadrat ist ein solches Rechteck.', gegen: 'ein Rechteck mit den Seiten 5 cm und 3 cm ist eines.' },
            { s: 'Eine Raute hat vier rechte Winkel.', g: 'Nur beim Quadrat. Eine Raute mit den Winkeln 60° und 120° hat keinen einzigen rechten Winkel.',
              bsp: 'jedes Quadrat ist eine solche Raute.', gegen: 'eine Raute mit den Winkeln 60° und 120° ist eines.' },
            { s: 'Ein Parallelogramm hat gleich lange Diagonalen.', g: 'Nur beim Rechteck. Bei den Winkeln 70° und 110° sind die Diagonalen verschieden lang.',
              bsp: 'jedes Rechteck ist ein solches Parallelogramm.', gegen: 'ein Parallelogramm mit den Winkeln 70° und 110° ist eines.' },
            { s: 'Ein Trapez hat zwei Paare paralleler Seiten.', g: 'Nur beim Parallelogramm. Ein Trapez mit den parallelen Seiten 8 cm und 5 cm hat nur ein Paar.',
              bsp: 'jedes Parallelogramm ist ein solches Trapez.', gegen: 'ein Trapez mit den parallelen Seiten 8 cm und 5 cm ist eines.' },
            { s: 'Ein Drachen hat vier gleich lange Seiten.', g: 'Nur bei der Raute. Ein Drachen mit zwei 4 cm und zwei 9 cm langen Seiten hat sie nicht.',
              bsp: 'jede Raute ist ein solcher Drachen.', gegen: 'ein Drachen mit zwei 4 cm und zwei 9 cm langen Seiten ist eines.' },
            { s: 'Ein Parallelogramm hat einen rechten Winkel.', g: 'Nur beim Rechteck. Bei den Winkeln 70° und 110° ist kein rechter Winkel dabei.',
              bsp: 'jedes Rechteck ist ein solches Parallelogramm.', gegen: 'ein Parallelogramm mit den Winkeln 70° und 110° ist eines.' },
            // 9, 6, 4, 5: rechtwinkliges Trapez, Höhe 4, die schräge Seite ist √(3² + 4²) = 5.
            { s: 'Ein Trapez hat vier verschieden lange Seiten.', g: 'Möglich, aber nicht nötig. Ein Trapez mit den Seiten 8 cm, 5 cm, 4 cm und 5 cm hat zwei gleich lange.',
              bsp: 'ein Trapez mit den Seiten 9 cm, 6 cm, 4 cm und 5 cm passt.', gegen: 'ein Trapez mit den Seiten 8 cm, 5 cm, 4 cm und 5 cm ist eines.' },
            { s: 'Ein Drachen hat einen rechten Winkel.', g: 'Möglich. Das Quadrat ist ein Drachen und hat sogar vier. Ein Drachen mit den Winkeln 40°, 110°, 100° und 110° hat keinen.',
              bsp: 'das Quadrat ist ein Drachen mit sogar vier rechten Winkeln.', gegen: 'ein Drachen mit den Winkeln 40°, 110°, 100° und 110° ist eines.' },
            { s: 'Ein Quadrat hat einen Umfang von 12 cm.', g: 'Möglich – dann ist jede Seite 3 cm lang. Ein Quadrat mit 5 cm langen Seiten hat aber 20 cm Umfang.',
              bsp: 'ein Quadrat mit 3 cm langen Seiten passt.', gegen: 'ein Quadrat mit 5 cm langen Seiten ist eines.' },
            { s: 'Ein Quadrat hat eine 8 cm lange Diagonale.', g: 'Möglich, hängt aber von der Größe ab. Bei 2 cm langen Seiten ist die Diagonale viel kürzer.',
              bsp: 'ein Quadrat lässt sich genau so groß zeichnen.', gegen: 'ein Quadrat mit 2 cm langen Seiten ist eines.' }
          ],
          nie: [
            { s: 'Ein Quadrat hat zwei verschieden lange Seiten.', g: 'Im Quadrat sind alle vier Seiten gleich lang. Zwei verschiedene kann es dort nicht geben.' },
            { s: 'Ein Rechteck hat einen stumpfen Winkel.', g: 'Alle vier Winkel messen 90°. Ein Winkel über 90° passt nicht dazu.' },
            { s: 'Ein Rechteck hat vier spitze Winkel.', g: 'Alle vier Winkel messen 90°, und 90° ist nicht spitz.' },
            { s: 'Ein Drachen hat vier verschieden lange Seiten.', g: 'Beim Drachen sind zwei Paare benachbarter Seiten gleich lang. Vier verschiedene Längen sind damit ausgeschlossen.' },
            { s: 'Ein Parallelogramm hat genau ein Paar paralleler Seiten.', g: 'Im Parallelogramm sind beide Seitenpaare parallel, also nie genau eines.' },
            { s: 'Eine Raute hat genau ein Paar paralleler Seiten.', g: 'Die Raute ist ein Parallelogramm. Bei ihr laufen beide Seitenpaare parallel.' },
            { s: 'Ein Quadrat hat einen spitzen Winkel.', g: 'Alle vier Winkel des Quadrats messen 90°.' },
            { s: 'Eine Raute hat drei gleich lange Seiten und eine kürzere.', g: 'In der Raute sind alle vier Seiten gleich lang, nicht nur drei.' },
            { s: 'Ein Trapez hat keine parallelen Seiten.', g: 'Ohne ein Paar paralleler Seiten ist es kein Trapez.' },
            { s: 'Ein Parallelogramm hat drei Ecken.', g: 'Jedes Viereck hat vier Ecken, das Parallelogramm auch.' }
          ]
        };
        const kat = choice(['immer', 'manchmal', 'nie']);
        const a = choice(AUSSAGEN[kat]);
        /* Der Grund sagt, was die gewählte Antwort verlangt und warum die
           Aussage das nicht erfüllt. Bei „manchmal“-Aussagen mit dem konkreten
           Beispiel bzw. Gegenbeispiel; bei „immer“ und „nie“ so, dass er
           zwischen den beiden übrigen Antworten nicht entscheidet, wo das geht. */
        const fehl = {
          immer: {
            manchmal: '„Manchmal“ verlangt beides: ein passendes Beispiel und ein Gegenbeispiel – eins davon fehlt hier.',
            nie: 'Für „nie“ dürfte kein einziges Beispiel passen – hier passt schon das erste.'
          },
          manchmal: {
            immer: `Für „immer“ dürfte es kein Gegenbeispiel geben – ${a.gegen}`,
            nie: `Für „nie“ dürfte kein einziges Beispiel passen – ${a.bsp}`
          },
          nie: {
            immer: 'Für „immer“ dürfte es kein Gegenbeispiel geben – hier ist schon das erste Beispiel eines.',
            manchmal: '„Manchmal“ verlangt beides: ein passendes Beispiel und ein Gegenbeispiel – eins davon fehlt hier.'
          }
        }[kat];
        const ablenker = shuffle(['immer', 'manchmal', 'nie'].filter(x => x !== kat));
        const mc = makeChoice(kat, ablenker, ablenker.map(x => fehl[x]));
        return {
          q: `Gilt diese Aussage immer, manchmal oder nie? „${a.s}“`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: kat,
          solution: `Die Aussage gilt <strong>${kat}</strong>.&ensp;<span class="trenn">•</span>&ensp;${a.g}`
        };
      }

      /* 3 · Flächeninhalt einer Figur mit ausgesparter Ecke */
      if (art === 3) {
        // Beide Rechtecke so herum, dass die als „lang“ genannte Seite auch die längere ist.
        const a0 = rnd(9, 20), b0 = rnd(6, 14);
        const a = Math.max(a0, b0), b = Math.min(a0, b0);
        const c0 = rnd(2, a - 4), d0 = rnd(2, b - 3);
        const c = Math.max(c0, d0), d = Math.min(c0, d0);
        const A = a * b - c * d;
        return {
          q: `Ein rechteckiger Hof ist ${fmt(a)} m lang und ${fmt(b)} m breit. In einer Ecke steht ein Schuppen, ${fmt(c)} m lang und ${fmt(d)} m breit. Wie groß ist die freie Fläche (in m²)?`,
          type: 'input', placeholder: 'Fläche in m²',
          check: numCheck(A), testAnswer: String(A), answerText: `${fmt(A)} m²`,
          solution: `Zuerst die ganze Fläche, dann das Loch abziehen.&ensp;<span class="trenn">•</span>&ensp;Hof: ${fmt(a)} m · ${fmt(b)} m = ${fmt(a * b)} m²&ensp;<span class="trenn">•</span>&ensp;Schuppen: ${fmt(c)} m · ${fmt(d)} m = ${fmt(c * d)} m²&ensp;<span class="trenn">•</span>&ensp;Frei: ${fmt(a * b)} m² − ${fmt(c * d)} m² = <strong>${fmt(A)} m²</strong>`
        };
      }

      /* 4 · Umfang derselben Bauart. Rechnerisch etwas ganz anderes als Aufgabe 3:
         Hier werden sechs Kanten addiert, und heraus kommt der Umfang des vollen
         Rechtecks. Die ausgesparte Ecke kostet Fläche, aber keinen Rand. */
      if (art === 4) {
        // „lang“ ist auch hier die längere Seite.
        const a0 = rnd(9, 20), b0 = rnd(6, 14);
        const a = Math.max(a0, b0), b = Math.min(a0, b0);
        const c = rnd(2, a - 4), d = rnd(2, b - 3);
        const U = 2 * (a + b);
        return {
          q: `Aus einem Rechteck, das ${fmt(a)} m lang und ${fmt(b)} m breit ist, wird an einer Ecke ein Rechteck von ${fmt(c)} m mal ${fmt(d)} m herausgeschnitten. Wie lang ist der Rand der übrig gebliebenen Figur (in m)?`,
          type: 'input', placeholder: 'Rand in m',
          check: numCheck(U), testAnswer: String(U), answerText: `${fmt(U)} m`,
          solution: `Der Rand besteht aus sechs Strecken. Zwei Seiten bleiben ganz, zwei sind verkürzt, zwei kommen vom Ausschnitt dazu.&ensp;<span class="trenn">•</span>&ensp;${fmt(a)} m + ${fmt(b - d)} m + ${fmt(c)} m + ${fmt(d)} m + ${fmt(a - c)} m + ${fmt(b)} m = <strong>${fmt(U)} m</strong>&ensp;<span class="trenn">•</span>&ensp;Das ist genau der Umfang des vollen Rechtecks: 2 · (${fmt(a)} m + ${fmt(b)} m) ergibt ebenfalls ${fmt(U)} m. Denn ${fmt(b - d)} m und ${fmt(d)} m ergeben zusammen wieder ${fmt(b)} m, ${fmt(c)} m und ${fmt(a - c)} m wieder ${fmt(a)} m.`
        };
      }

      /* 5 · Rechteck und rechtwinkliges Dreieck zusammengesetzt */
      if (art === 5) {
        const a = rnd(10, 26);
        let b = rnd(6, 16), h = rnd(4, 15);
        // Das Produkt muss gerade sein, sonst hat die halbe Dreiecksfläche eine
        // Nachkommastelle und die Aufgabe verliert ihren Kopfrechencharakter.
        while ((b * h) % 2 !== 0) { b = rnd(6, 16); h = rnd(4, 15); }
        const A = a * b + b * h / 2;
        return {
          q: `Ein Wimpel besteht aus zwei Teilen. Links ist ein Rechteck, ${fmt(a)} cm lang und ${fmt(b)} cm hoch. Rechts schließt daran ein rechtwinkliges Dreieck an; seine beiden Seiten am rechten Winkel sind ${fmt(b)} cm und ${fmt(h)} cm lang. Wie groß ist die Gesamtfläche (in cm²)?`,
          type: 'input', placeholder: 'Fläche in cm²',
          check: numCheck(A), testAnswer: String(A), answerText: `${fmt(A)} cm²`,
          solution: `Beide Teile einzeln ausrechnen und addieren.&ensp;<span class="trenn">•</span>&ensp;Rechteck: ${fmt(a)} cm · ${fmt(b)} cm = ${fmt(a * b)} cm²&ensp;<span class="trenn">•</span>&ensp;Dreieck: (${fmt(b)} cm · ${fmt(h)} cm) : 2 = ${fmt(b * h)} cm² : 2 = ${fmt(b * h / 2)} cm²&ensp;<span class="trenn">•</span>&ensp;Zusammen: ${fmt(a * b)} cm² + ${fmt(b * h / 2)} cm² = <strong>${fmt(A)} cm²</strong>`
        };
      }

      /* 6 · Rückwärts: aus der Fläche eines rechtwinkligen Dreiecks eine Seite */
      let g = rnd(3, 15), h = rnd(3, 16);
      while (g === h || (g * h) % 2 !== 0) { g = rnd(3, 15); h = rnd(3, 16); }
      const A = g * h / 2;
      // Mal ist die eine Seite gegeben, mal die andere. Wäre immer dieselbe
      // gegeben, wäre die gesuchte Zahl immer gerade – ein Muster ohne Inhalt.
      const erste = choice([true, false]);
      const bekannt = erste ? g : h, gesucht = erste ? h : g;
      return {
        q: `Ein rechtwinkliges Dreieck hat den Flächeninhalt ${fmt(A)} cm². Eine der beiden Seiten am rechten Winkel ist ${fmt(bekannt)} cm lang. Wie lang ist die andere (in cm)?`,
        type: 'input', placeholder: 'Seite in cm',
        check: numCheck(gesucht), testAnswer: String(gesucht), answerText: `${fmt(gesucht)} cm`,
        // Wie das Rückwärts-Beispiel der Erklärseite: Die Formel wird mal 2
        // gerechnet. Von einem Rechteck aus zwei Dreiecken spricht die Seite nicht.
        solution: `Für das rechtwinklige Dreieck gilt A = (g · h) : 2.&ensp;<span class="trenn">•</span>&ensp;Mal 2 gerechnet: g · h = 2 · ${fmt(A)} cm² = ${fmt(2 * A)} cm²&ensp;<span class="trenn">•</span>&ensp;Gesuchte Seite: ${fmt(2 * A)} cm² : ${fmt(bekannt)} cm = <strong>${fmt(gesucht)} cm</strong>`
      };
    }
  };

  return [negative, teilbarkeit, dezimalzahlen, einheiten, dreisatz, winkel, symmetrie, vierecke];
})();
