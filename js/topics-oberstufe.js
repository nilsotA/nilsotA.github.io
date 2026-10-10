/* ============================================================
   MatheNils – Themen der Oberstufe (Klasse 10–13)
   Exponentielles Wachstum · Logarithmen · Ableitungen · Integrale
   ============================================================ */
'use strict';

const TOPICS_OBER_NEU = (() => {
  const { rnd, choice, fmt, frac, numCheck } = Util;
  const { rndNonZero } = TopicUtils;
  const { multiCheck } = Util;
  const { makeChoice, koef, linTerm, par, beispielZahl } = TopicUtils;

  /* ---------- Exponentielles Wachstum ---------- */

  const wachstum = {
    id: 'wachstum',
    icon: '2ⁿ',
    title: 'Exponentielles Wachstum',
    tagline: 'Wachstumsfaktoren und Zerfall verstehen',
    learn: `
      <h2>Exponentielles Wachstum und Zerfall</h2>
      <p>Wächst etwas <strong>in jedem Schritt um denselben Faktor</strong> (nicht denselben Betrag!),
      spricht man von exponentiellem Wachstum – etwa Bakterien, Zinseszins oder virale Videos.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Wachstumsformel</span>
        <p><span class="formula">B(n) = B₀ · q<sup>n</sup></span></p>
        <ul>
          <li>B₀ = Startwert, q = Wachstumsfaktor, n = Anzahl der Schritte</li>
          <li>+ p % pro Schritt → q = 1 + p/100&nbsp;(z. B. +5 % → q = 1,05)</li>
          <li>− p % pro Schritt → q = 1 − p/100&nbsp;(z. B. −20 % → q = 0,8)</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>200 Bakterien verdoppeln sich stündlich (q = 2).<br>
        Nach 4 Stunden: 200 · 2⁴ = 200 · 16 = <strong>3200 Bakterien</strong></p>
      </div>
      <p><em>q &gt; 1:</em> Wachstum · <em>q &lt; 1:</em> Abnahme (Zerfall) · <em>q = 1:</em> nichts ändert sich.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['zuFaktor', 'vonFaktor']);
        if (kind === 'zuFaktor') {
          const p = choice([3, 5, 8, 10, 20, 25, 50]);
          const wachs = choice([true, false]);
          const q = wachs ? 1 + p / 100 : 1 - p / 100;
          return {
            q: `Ein Bestand ${wachs ? 'wächst' : 'schrumpft'} um ${p} % pro Jahr. Wie lautet der Wachstumsfaktor q?`,
            type: 'input', placeholder: `z. B. ${fmt(beispielZahl(q, [1.04, 0.94, 1.06, 0.85]))}`,
            check: numCheck(q), testAnswer: String(q), answerText: `q = ${fmt(q)}`,
            solution: `${wachs ? '+' : '−'}${p} % bedeutet: q = 1 ${wachs ? '+' : '−'} ${p}/100 = ${fmt(q)}`
          };
        }
        const varianten = [[1.5, 'nimmt um 50 % zu'], [1.2, 'nimmt um 20 % zu'], [1.03, 'nimmt um 3 % zu'], [0.9, 'nimmt um 10 % ab'], [0.75, 'nimmt um 25 % ab'], [0.5, 'nimmt um 50 % ab']];
        const [q, beschreibung] = choice(varianten);
        const p = Math.round(Math.abs(q - 1) * 100);
        return {
          q: `Der Wachstumsfaktor beträgt q = ${fmt(q)}. Um wie viel Prozent ändert sich der Bestand pro Schritt?`,
          type: 'input', placeholder: 'in %',
          // Der Merkkasten schreibt Abnahmen als „−20 % → q = 0,8“, also darf die Umkehrung
          // das Vorzeichen tragen; bei Zunahme wäre „−20 %“ falsch.
          check: Util.rueckmeldung(
            s => numCheck(p, 1e-6, { prozent: true })(s) || (q < 1 && numCheck(-p, 1e-6, { prozent: true })(s)),
            1, 'zahl', s => numCheck(p, 1e-6, { prozent: true }).diagnose(s)),
          testAnswer: String(p), answerText: `${p} % (${q > 1 ? 'Zunahme' : 'Abnahme'})`,
          solution: `q = ${fmt(q)} heißt: der Bestand ${beschreibung}.<br>|${fmt(q)} − 1| = ${fmt(Math.abs(q - 1))} = ${p} %`
        };
      }
      if (diff === 2) {
        const kind = choice(['verdopplung', 'halbierung']);
        if (kind === 'verdopplung') {
          /* Startwerte, die nicht durch Verdopplung auseinander hervorgehen.
             Mit 50, 100, 200 und 400 führten vier Parameterpaare auf denselben
             Endwert (50·2⁶ = 100·2⁵ = 200·2⁴ = 400·2³ = 3200) – „3200“ war
             deshalb in 17 % aller Ziehungen die Antwort. Jedes B₀ ist jetzt ein
             ungerades Vielfaches von 10, damit sind alle 24 Ergebnisse
             verschieden. */
          const B0 = choice([30, 50, 70, 90, 110, 130]);
          const n = rnd(3, 6);
          const B = B0 * 2 ** n;
          return {
            q: `${B0} Bakterien verdoppeln sich jede Stunde. Wie viele sind es nach ${n} Stunden?`,
            type: 'input', placeholder: 'Anzahl',
            check: numCheck(B), testAnswer: String(B), answerText: `${fmt(B)} Bakterien`,
            solution: `B(n) = B₀ · 2ⁿ = ${B0} · 2<sup>${n}</sup> = ${B0} · ${2 ** n} = ${fmt(B)}`
          };
        }
        const n = rnd(2, 4);
        const rest = choice([5, 10, 15, 20, 25]);
        const B0 = rest * 2 ** n;
        return {
          q: `Von ${fmt(B0)} g eines Stoffes zerfällt jede Stunde die Hälfte. Wie viel ist nach ${n} Stunden übrig (in g)?`,
          type: 'input', placeholder: 'in g',
          check: numCheck(rest), testAnswer: String(rest), answerText: `${fmt(rest)} g`,
          solution: `B(n) = B₀ · 0,5ⁿ = ${fmt(B0)} · 0,5<sup>${n}</sup> = ${fmt(B0)} : ${2 ** n} = ${fmt(rest)} g`
        };
      }
      const kind = choice(['prozentWachstum', 'anzahlSchritte']);
      if (kind === 'prozentWachstum') {
        const B0 = rnd(1, 9) * 1000;
        const [p, n] = choice([[10, 2], [10, 3], [20, 2], [50, 2], [50, 3]]);
        const q = 1 + p / 100;
        const B = B0 * Math.round(q ** n * 1000) / 1000;
        return {
          q: `Eine Stadt hat ${fmt(B0)} Einwohner und wächst um ${p} % pro Jahrzehnt. Wie viele Einwohner hat sie nach ${n} Jahrzehnten?`,
          type: 'input', placeholder: 'Einwohner',
          check: numCheck(B, 0.5), testAnswer: String(B), answerText: `${fmt(B)} Einwohner`,
          // Erst q aus der Prozentangabe (Schritt 2 der Erklärseite), dann die
          // Potenz. Ohne die erste Zeile sah nicht, wer mit 0,5 oder 50 statt
          // 1,5 gerechnet hat, wo er abgebogen ist – genau diesen Fehler nennt
          // der Warnkasten der Seite. Alle q^n gehen auf drei Stellen auf, daher „=“.
          solution: `+${p} % pro Jahrzehnt → q = 1 + ${p}/100 = ${fmt(q)} (nicht ${fmt(p / 100)}: Die 100 % des Bestands bleiben, ${p} % kommen dazu)<br>` +
            `B(${n}) = B₀ · q<sup>${n}</sup> = ${fmt(B0)} · ${fmt(q)}<sup>${n}</sup> = ${fmt(B0)} · ${fmt(Math.round(q ** n * 1000) / 1000)} = <strong>${fmt(B)}</strong><br>` +
            `<em>Plausibel:</em> q &gt; 1, also müssen es mehr als ${fmt(B0)} sein ✓`
        };
      }
      const B0 = choice([2, 3, 4, 5]);
      const n = rnd(3, 6);
      const X = B0 * 2 ** n;
      return {
        q: `${B0} Personen kennen ein Gerücht. Stündlich verdoppelt sich die Anzahl. Nach wie vielen Stunden kennen es genau ${fmt(X)} Personen?`,
        type: 'input', placeholder: 'Stunden',
        check: numCheck(n), testAnswer: String(n), answerText: `${n} Stunden`,
        solution: `Gesucht: n mit ${B0} · 2ⁿ = ${fmt(X)}, also 2ⁿ = ${X / B0}.<br>` +
          `Wegen 2<sup>${n}</sup> = ${2 ** n} gilt n = ${n}.`
      };
    }
  };

  /* ---------- Logarithmen ---------- */

  const logarithmen = {
    id: 'logarithmen',
    icon: 'log',
    title: 'Logarithmen',
    tagline: 'Die Umkehrung des Potenzierens',
    learn: `
      <h2>Was ist ein Logarithmus?</h2>
      <p>Der Logarithmus beantwortet die Frage: <strong>„Mit welcher Zahl muss ich die Basis
      potenzieren, um x zu erhalten?“</strong></p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">log<sub>b</sub>(x) = n&nbsp;⇔&nbsp;b<sup>n</sup> = x</span></p>
        <p>Beispiel: log₂(8) = 3, denn 2³ = 8.</p>
      </div>
      <div class="example-box"><span class="ex-title">Wichtige Werte</span>
        <p>log<sub>b</sub>(1) = 0&ensp;<span class="trenn">•</span>&ensp;log<sub>b</sub>(b) = 1&ensp;<span class="trenn">•</span>&ensp;log₁₀(1000) = 3</p>
      </div>
      <h3>Die Logarithmusgesetze</h3>
      <ul>
        <li>log(a · b) = log(a) + log(b)</li>
        <li>log(a : b) = log(a) − log(b)</li>
        <li>log(aⁿ) = n · log(a)</li>
      </ul>
      <p>Mit Logarithmen löst man <strong>Exponentialgleichungen</strong> wie 2ˣ = 64 –
      sie holen das x aus dem Exponenten herunter.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const basen = { 2: rnd(2, 8), 3: rnd(2, 4), 5: rnd(2, 3), 10: rnd(2, 4) };
        const b = Number(choice(['2', '3', '5', '10']));
        const e = basen[b];
        const x = b ** e;
        return {
          q: `Berechne: log<sub>${b}</sub>(${fmt(x)})`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(e), testAnswer: String(e), answerText: `${e}`,
          solution: `Frage: ${b} hoch was ergibt ${fmt(x)}?<br>${b}<sup>${e}</sup> = ${fmt(x)}, also log<sub>${b}</sub>(${fmt(x)}) = ${e}`
        };
      }
      if (diff === 2) {
        const kind = choice(['positiv', 'negativ']);
        if (kind === 'positiv') {
          const b = choice([2, 3, 10]);
          const e = b === 2 ? rnd(3, 8) : b === 3 ? rnd(2, 4) : rnd(2, 4);
          const v = b ** e;
          return {
            q: `Löse die Gleichung: ${b}<sup>x</sup> = ${fmt(v)}`, type: 'input', placeholder: 'x = ?',
            check: numCheck(e), testAnswer: String(e), answerText: `x = ${e}`,
            solution: `x = log<sub>${b}</sub>(${fmt(v)}) = ${e}, denn ${b}<sup>${e}</sup> = ${fmt(v)}.`
          };
        }
        const varianten = [[10, 2, '0,01'], [10, 3, '0,001'], [2, 2, `1/4`], [2, 3, `1/8`], [5, 2, `1/25`]];
        const [b, e, anzeige] = choice(varianten);
        return {
          q: `Löse die Gleichung: ${b}<sup>x</sup> = ${anzeige}`, type: 'input', placeholder: 'x = ?',
          check: numCheck(-e), testAnswer: String(-e), answerText: `x = ${fmt(-e)}`,
          // Vorher stand hier der ausgerechnete Nenner: Bei 1/25 ergab das
          // „1/25 = 1/25 = 5⁻²“, also einen Schritt, der nichts zeigt.
          solution: `${anzeige} = 1/${b}<sup>${e}</sup> = ${b}<sup>−${e}</sup>.<br>Also x = ${fmt(-e)} – negative Exponenten ergeben Stammbrüche.`
        };
      }
      const kind = choice(['gesetz', 'spezial']);
      if (kind === 'gesetz') {
        /* Jeder Ablenker ist eine Aussage, also widerlegt ihn ein Gegenbeispiel –
           mit lg wie auf der Erklärseite und mit a = 100, b = 10, damit beide
           Seiten im Kopf gehen. Das Beispiel rechnet nur die falsche Seite
           vor; das richtige Gesetz nennt kein Grund. */
        const varianten = [
          [`log(a · b)`, `log(a) + log(b)`, [`log(a) · log(b)`, `log(a) − log(b)`, `log(a + b)`], [
            'Das Malzeichen wandert nicht einfach nach außen: lg(100 · 10) = 3, aber lg(100) · lg(10) = 2.',
            'Das Minus gehört zum Quotienten. Gegenbeispiel: lg(100 · 10) = 3, aber lg(100) − lg(10) = 1.',
            'Hier ist aus dem Produkt eine Summe im Logarithmus geworden: lg(100 · 10) = 3, aber lg(110) ≈ 2,04.'
          ]],
          [`log(a : b)`, `log(a) − log(b)`, [`log(a) : log(b)`, `log(a) + log(b)`, `log(a − b)`], [
            'Das Geteiltzeichen wandert nicht einfach nach außen: lg(100 : 10) = 1, aber lg(100) : lg(10) = 2.',
            'Das Plus gehört zum Produkt. Gegenbeispiel: lg(100 : 10) = 1, aber lg(100) + lg(10) = 3.',
            'Hier ist aus dem Quotienten eine Differenz im Logarithmus geworden: lg(100 : 10) = 1, aber lg(90) ≈ 1,95.'
          ]],
          [`log(a<sup>n</sup>)`, `n · log(a)`, [`log(a)<sup>n</sup>`, `n + log(a)`, `log(n · a)`], [
            'Hier ist der Logarithmus potenziert statt a: lg(10³) = 3, aber (lg(10))³ = 1.',
            'Der Exponent wird nicht addiert: lg(10³) = 3, aber 3 + lg(10) = 4.',
            'Hier ist aus der Potenz ein Produkt geworden: lg(10³) = 3, aber lg(3 · 10) = lg(30) ≈ 1,48.'
          ]]
        ];
        const [term, correct, falsch, gruende] = choice(varianten);
        const mc = makeChoice(correct, falsch, gruende);
        return {
          q: `Welches Logarithmusgesetz gilt? ${term} = ?`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: correct,
          solution: `Logarithmen machen aus Produkten Summen, aus Quotienten Differenzen und holen Exponenten nach vorn:<br>${term} = ${correct}`
        };
      }
      // log_b(1) = 0 und log_b(b) = 1 standen hier auf „Schwer“ – dieselben
      // beiden Aufgaben stellt schon Stufe 1. Übrig bleiben die Fälle mit
      // negativem Exponenten, die den Stammbruch erst umformen müssen.
      const varianten = [
        ['log<sub>2</sub>(1/16)', -4, '1/16 = 1/2⁴ = 2⁻⁴, also ist der Logarithmus −4.'],
        ['log<sub>2</sub>(1/64)', -6, '1/64 = 1/2⁶ = 2⁻⁶, also ist der Logarithmus −6.'],
        ['log<sub>3</sub>(1/81)', -4, '1/81 = 1/3⁴ = 3⁻⁴, also ist der Logarithmus −4.'],
        ['log<sub>5</sub>(1/125)', -3, '1/125 = 1/5³ = 5⁻³, also ist der Logarithmus −3.'],
        ['log<sub>10</sub>(0,001)', -3, '0,001 = 1/10³ = 10⁻³, also ist der Logarithmus −3.'],
        ['log<sub>10</sub>(0,1)', -1, '0,1 = 1/10 = 10⁻¹, also ist der Logarithmus −1.']
      ];
      const [term, res, erklaerung] = choice(varianten);
      return {
        q: `Berechne: ${term}`, type: 'input', placeholder: 'Ergebnis',
        check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
        solution: erklaerung
      };
    }
  };

  /* ---------- Ableitungen ---------- */

  /** "a·x^n" hübsch formatiert (n >= 0). */
  function pot(a, n) {
    const koeff = a === 1 ? '' : a === -1 ? '−' : `${fmt(a)}`;
    if (n === 0) return `${fmt(a)}`;
    if (n === 1) return `${koeff}x`;
    return `${koeff}x<sup>${n}</sup>`;
  }

  const ableitungen = {
    id: 'ableitungen',
    icon: 'f′',
    title: 'Ableitungen',
    tagline: 'Steigungen mit der Potenzregel berechnen',
    learn: `
      <h2>Die Ableitung – Steigung an jeder Stelle</h2>
      <p>Die Ableitung f′(x) gibt an, <strong>wie steil</strong> der Graph von f an jeder Stelle x ist –
      sie ist die Steigung der Tangente.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Potenzregel</span>
        <p><span class="formula">f(x) = xⁿ → f′(x) = n · xⁿ⁻¹</span></p>
        <p>Der Exponent kommt als Faktor nach vorn und wird um 1 kleiner.</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiele</span>
        <p>f(x) = x³ → f′(x) = 3x²&ensp;<span class="trenn">•</span>&ensp;f(x) = 5x² → f′(x) = 10x<br>
        f(x) = 4x → f′(x) = 4&ensp;<span class="trenn">•</span>&ensp;f(x) = 7 (konstant) → f′(x) = 0</p>
      </div>
      <h3>Summen ableiten</h3>
      <p>Jeden Summanden einzeln ableiten: f(x) = x³ + 2x − 5 → f′(x) = 3x² + 2.
      Mit einem x²-Glied genauso: f(x) = 2x³ + 5x² − 4 → f′(x) = 6x² + 10x.</p>
      <p><em>Wichtig:</em> An Stellen mit f′(x) = 0 hat der Graph waagerechte Tangenten –
      dort liegen Hoch- und Tiefpunkte.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        /* Ratbare Struktur (ratbar.js und härtere blinde Regeln): Neben
           x^(n−1), n·xⁿ, (n−1)·x^(n−1) und (n+1)·x^(n−1) war die Lösung
           n·x^(n−1) die einzige Option, die überhaupt die Ableitung einer
           Potenz sein kann (Faktor = Hochzahl + 1, zu 100 % erkennbar), ihr
           Faktor war zu 50 % die größte Zahl, und sie trug als einzige die
           Zahl aus der Frage.
           Jetzt sind alle vier Optionen Ableitungen benachbarter Potenzen:
           m·x^(m−1) für vier aufeinanderfolgende m. Welches m gemeint ist,
           steht nur in der Frage. Welchen Rang die Lösung im Fenster einnimmt,
           wird zuerst gewürfelt – so ist sie gleich oft die kleinste und die
           größte der vier Zahlen. */
        const rang = rnd(1, 4);
        // Das Fenster muss in [3, 9] bleiben: unter 3 hätte die Ableitung keine
        // Hochzahl mehr („2x“ statt „2x²“) und fiele aus der Bauart, über 9
        // würde ihr Faktor zweistellig und damit die längste Option.
        const moeglich = [];
        for (let k = 4; k <= 8; k++) if (k - rang + 1 >= 3 && k + 4 - rang <= 9) moeglich.push(k);
        const n = choice(moeglich);
        const correct = pot(n, n - 1);
        // Die Zahl aus der Frage muss in mindestens zwei Optionen stehen, sonst
        // genügt „die einzige Option mit der 6“. Für Rang 1–3 liegt n + 1 im
        // Fenster und trägt n als Hochzahl; bei Rang 4 bekommt dafür n − 1 den
        // erhöhten Exponenten. Nicht immer: Ohne diesen Tausch hat die Lösung
        // die höchste Hochzahl, und würde sie es nie, wäre auch das ein Muster.
        // Zwei von drei Ziehungen halten beide Regeln bei rund 31 % statt 25 %;
        // ganz auflösen lässt sich der Zielkonflikt nicht.
        const erhoeht = rang === 4 && rnd(1, 3) !== 1 ? n - 1 : 0;
        // Vier verschiedene m ergeben vier verschiedene Faktoren – hier kann
        // kein Ablenker mit der Lösung zusammenfallen, Reserve ist unnötig.
        const ms = [0, 1, 2, 3].map(i => n - rang + 1 + i).filter(m => m !== n);
        // Die Ablenker entstehen nicht aus einem Fehler, sondern sind die
        // Ableitungen benachbarter Potenzen. Das ist der Grund, und er gilt bei
        // jeder Ziehung. Der Sonderfall (n − 1)·xⁿ ist keine Ableitung einer
        // Potenz: vorn der schon verkleinerte Exponent, oben noch der alte.
        const mc = makeChoice(correct,
          ms.map(m => m === erhoeht ? pot(m, m + 1) : pot(m, m - 1)),
          ms.map(m => m === erhoeht
            ? 'Hier steht vorn schon der verkleinerte Exponent, oben aber noch der alte.'
            : `Das ist die Ableitung von x<sup>${fmt(m)}</sup>, nicht von x<sup>${fmt(n)}</sup>.`));
        return {
          q: `Leite ab: f(x) = x<sup>${n}</sup>`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `f′(x) = ${correct}`,
          solution: `Potenzregel: Exponent nach vorn, Exponent um 1 verringern.<br>f′(x) = ${n} · x<sup>${n - 1}</sup> = ${correct}`
        };
      }
      if (diff === 2) {
        const kind = choice(['koeff', 'stelle']);
        if (kind === 'koeff') {
          // n ab 4: Der Fall a · x² gehört zu Stufe 1 (siehe aufgaben-extra.js),
          // und der Ablenker mit zweimal verringertem Exponenten braucht x².
          const a = rnd(2, 6), n = rnd(4, 6);
          const k = a * n;
          const correct = pot(k, n - 1);
          /* Ratbare Struktur: Der Faktor a·n war immer der größte und kam als
             einziger zweimal vor – „zweitgrößte Zahl“ traf 51 % statt 25 %.
             Jetzt spannen zwei Achsen ein Viereck auf: Der Vorfaktor stimmt
             (a·n) oder nicht (u), der Exponent stimmt (n − 1) oder nicht (w).
             Jede Zahl kommt damit zweimal vor, alle vier Optionen haben
             dieselbe Bauart, und die Würfe für u und w entscheiden, ob die
             Lösung oben oder unten in der Rangfolge steht. */
          const w = rnd(0, 1) === 1 ? choice([n, n + 1]) : n - 2;
          const uKandidaten = rnd(0, 1) === 1
            // Exponent erhöht statt verringert · Ableitung von (a + 1)xⁿ
            ? [a * (n + 1), (a + 1) * n]
            // Vorfaktor nicht multipliziert · neuer Exponent als Faktor ·
            // addiert statt multipliziert · Ableitung von (a − 1)xⁿ
            : [a, a * (n - 1), a + n, (a - 1) * n];
          // Trägt schon der falsche Exponent eine Zahl aus der Frage, darf der
          // falsche Vorfaktor keine mehr tragen: Sonst wäre die Lösung die
          // einzige Option ohne Zahl aus der Aufgabe – und die fände man blind.
          const heikel = w === a || w === n;
          const brauchbar = uKandidaten.filter(v => v !== k && (!heikel || (v !== a && v !== n)));
          const u = choice(brauchbar.length ? brauchbar : uKandidaten.filter(v => v !== k));
          // Der Fehler hinter dem Exponenten w steht fest. Der Vorfaktor u wird
          // über seinen WERT gedeutet, nicht über die Liste, aus der er kam: Bei
          // a = n ist (a + 1)·n = a·(n + 1), bei a = 2, n = 4 ist a·(n − 1) = a + n,
          // bei a = n ist u = a zugleich „Vorfaktor weggelassen“ (4x⁴ → 4x³).
          // Passt er auf zwei Fehler, schweigt der Grund; passt er auf keinen
          // (Ableitung von (a ± 1)xⁿ, ein reiner Füllwert), ebenso.
          const oben = { [n]: 'ist der Exponent nicht um 1 kleiner geworden',
            [n + 1]: 'ist der Exponent um 1 größer statt kleiner geworden',
            [n - 2]: 'ist der Exponent um 2 statt um 1 kleiner geworden' }[w];
          const vornTreffer = [
            [a * (n + 1), 'ist mit dem erhöhten Exponenten multipliziert'],
            [a, 'fehlt der Exponent als Faktor'],
            [a * (n - 1), 'ist mit dem verkleinerten Exponenten multipliziert'],
            [a + n, 'sind Vorfaktor und Exponent addiert statt multipliziert'],
            [n, 'fehlt der Vorfaktor']            // bei a = 2 trifft der Füllwert (a − 1)·n hierauf
          ].filter(([wert]) => wert === u);
          const vorn = vornTreffer.length === 1 ? vornTreffer[0][1] : null;
          // Verschiedener Vorfaktor oder verschiedener Exponent – die vier
          // Optionen können nicht zusammenfallen, Reserve ist unnötig.
          const mc = makeChoice(correct, [pot(k, w), pot(u, n - 1), pot(u, w)], [
            `Oben ${oben}.`,
            vorn && `Vorn ${vorn}.`,
            // Beide Fehler zugleich bleiben ohne Grund: Wer beide Merkmale
            // genannt bekommt, muss nur beide umkehren – das IST die Lösung.
            null
          ]);
          return {
            q: `Leite ab: f(x) = ${pot(a, n)}`, type: 'choice',
            options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `f′(x) = ${correct}`,
            solution: `Der Vorfaktor bleibt, die Potenzregel wirkt auf xⁿ:<br>f′(x) = ${a} · ${n} · x<sup>${n - 1}</sup> = ${correct}`
          };
        }
        const a = rnd(1, 4), x0 = rnd(-4, 5);
        const w = 2 * a * x0;
        return {
          q: `Gegeben ist f(x) = ${pot(a, 2)}. Berechne die Steigung an der Stelle x = ${fmt(x0)}, also f′(${fmt(x0)}).`,
          type: 'input', placeholder: 'Steigung',
          check: numCheck(w), testAnswer: String(w), answerText: `f′(${fmt(x0)}) = ${fmt(w)}`,
          solution: `f′(x) = ${pot(2 * a, 1)}.<br>Einsetzen: f′(${fmt(x0)}) = ${2 * a} · ${x0 < 0 ? `(${fmt(x0)})` : fmt(x0)} = ${fmt(w)}`
        };
      }
      const kind = choice(['polynom', 'nullsteigung']);
      if (kind === 'polynom') {
        /* Ratbare Struktur: Die Lösung war die einzige Option der Bauart
           „Zahl·x² + Zahl“ (65 %) und bei a = 1 zu 100 % die zweitkürzeste.
           Der Grund steckt in den Ablenkern selbst: „+ bx“ und „+ b − c“ haben
           eine andere Bauart als die Lösung, und eine andere Bauart sieht man,
           ohne zu rechnen. Deshalb steht jetzt ein x²-Glied statt des linearen
           Glieds in der Aufgabe. Dann tragen alle vier Optionen die Bauart
           „Zahl·x² + Zahl·x“, und derselbe Fehler – den Exponenten nicht als
           Faktor genommen – steckt in den Zahlen statt in der Form. Die
           Konstante fällt nach wie vor weg. */
        const a = rnd(2, 5), b = rnd(2, 7), c = rnd(1, 9);
        const correct = `${pot(3 * a, 2)} + ${pot(2 * b, 1)}`;
        // Zwei Achsen: Der Faktor vor x² stimmt (3a) oder nicht (u), der Faktor
        // vor x stimmt (2b) oder nicht (v). Die Richtung wird je Achse
        // gewürfelt, damit die Lösung mal die größte und mal die kleinste Zahl
        // trägt.
        const u = rnd(0, 1) === 1
          // Exponent erhöht statt verringert · Ableitung von (a + 1)x³
          ? choice([4 * a, 3 * (a + 1)])
          // Exponent nicht als Faktor · neuer Exponent als Faktor ·
          // addiert statt multipliziert · Ableitung von (a − 1)x³
          : choice([a, 2 * a, a + 3, 3 * (a - 1)]);
        const v = rnd(0, 1) === 1
          // Exponent erhöht statt verringert · Ableitung von (b + 1)x²
          ? choice([3 * b, 2 * (b + 1)])
          // Exponent nicht als Faktor · Ableitung von (b − 1)x²
          : choice([b, 2 * (b - 1)]);
        // Gründe nach dem Wert der Faktoren, nicht nach der gezogenen Liste.
        // Zwei Fehler, ein Wert – dann schweigt der Grund: beim x³-Glied bei a = 3
        // (2a = a + 3 = 6, und a = 3 ist zugleich „Vorfaktor weggelassen“), beim
        // x²-Glied bei b = 2 (b = 2 ist auch die Ableitung von x² ohne Vorfaktor).
        // „Mit dem verkleinerten Exponenten multipliziert“ (b · 1) ergibt beim
        // x²-Glied denselben Wert wie „Exponent nicht als Faktor“ – beides heißt,
        // dass die 2 als Faktor fehlt, und so ist der Grund formuliert.
        // 3(a ± 1) und 2(b ± 1) sind Füllwerte ohne Grund; wo sie zufällig auf
        // einen Fehlerwert treffen (3(a − 1) = 3 bei a = 2), gilt dessen Grund.
        const deute = (wert, treffer) => {
          const t = treffer.filter(([w]) => w === wert);
          return t.length === 1 ? t[0][1] : null;
        };
        const glied3 = deute(u, [
          [4 * a, 'ist mit dem erhöhten Exponenten multipliziert'],
          [a, 'fehlt der Exponent als Faktor'],
          [2 * a, 'ist mit dem verkleinerten Exponenten multipliziert'],
          [a + 3, 'sind Vorfaktor und Exponent addiert statt multipliziert'],
          [3, 'fehlt der Vorfaktor']
        ]);
        const glied2 = deute(v, [
          [3 * b, 'ist mit dem erhöhten Exponenten multipliziert'],
          [b, 'fehlt der Exponent als Faktor'],
          [2, 'fehlt der Vorfaktor']
        ]);
        // Jeder der drei Ablenker weicht in mindestens einem Faktor ab –
        // zusammenfallen können sie nicht, Reserve ist unnötig.
        const mc = makeChoice(correct, [
          `${pot(3 * a, 2)} + ${pot(v, 1)}`,
          `${pot(u, 2)} + ${pot(2 * b, 1)}`,
          `${pot(u, 2)} + ${pot(v, 1)}`
        ], [
          // Der Summand aus f wird genannt, nicht „das x²-Glied“: In der Option
          // ist das x²-Glied gerade das richtige, falsch ist die Ableitung von bx².
          glied2 && `Beim Ableiten von ${pot(b, 2)} ${glied2}.`,
          glied3 && `Beim Ableiten von ${pot(a, 3)} ${glied3}.`,
          // Fehler in beiden Summanden: kein Grund, sonst verrät die Umkehr
          // beider Hinweise die Lösung.
          null
        ]);
        return {
          q: `Leite ab: f(x) = ${pot(a, 3)} + ${pot(b, 2)} − ${c}`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `f′(x) = ${correct}`,
          solution: `Summand für Summand:<br>(${pot(a, 3)})′ = ${pot(3 * a, 2)},&nbsp;(${pot(b, 2)})′ = ${pot(2 * b, 1)},&nbsp;(−${c})′ = 0<br>f′(x) = ${correct}`
        };
      }
      const a = rnd(1, 6);
      return {
        q: `Gegeben ist f(x) = x² − ${2 * a}x. An welcher Stelle x hat der Graph eine waagerechte Tangente (f′(x) = 0)?`,
        type: 'input', placeholder: 'x = ?',
        check: numCheck(a), testAnswer: String(a), answerText: `x = ${a}`,
        solution: `f′(x) = 2x − ${2 * a}.<br>Setze f′(x) = 0: 2x − ${2 * a} = 0 → 2x = ${2 * a} → x = ${a}`
      };
    }
  };

  /* ---------- Integrale ---------- */

  function intZeichen(von, bis) {
    return `∫<sub>${von}</sub><sup>${bis}</sup>`;
  }

  const integrale = {
    id: 'integrale',
    icon: '∫',
    title: 'Integrale',
    tagline: 'Stammfunktionen und Flächen unter Kurven',
    learn: `
      <h2>Integrale – die Umkehrung des Ableitens</h2>
      <p>Eine <strong>Stammfunktion</strong> F ist eine Funktion, deren Ableitung wieder f ergibt:
      F′(x) = f(x). Das Integrieren kehrt die Potenzregel um:</p>
      <div class="merkkasten"><span class="merk-title">Merke: Potenzregel rückwärts</span>
        <p><span class="formula">f(x) = xⁿ → F(x) = xⁿ⁺¹ ⁄ (n+1) + C</span></p>
        <p>Exponent um 1 erhöhen, durch den neuen Exponenten teilen. Das „+ C“ steht für
        eine beliebige Konstante.</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiele</span>
        <p>f(x) = 2x → F(x) = x² + C&ensp;<span class="trenn">•</span>&ensp;f(x) = 3x² → F(x) = x³ + C</p>
      </div>
      <h3>Das bestimmte Integral</h3>
      <p>${intZeichen('a', 'b')} f(x) dx = F(b) − F(a) berechnet die <strong>Fläche</strong> zwischen
      Graph und x-Achse von a bis b (Hauptsatz der Analysis).</p>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>${intZeichen(0, 4)} x dx = F(4) − F(0) = 4²/2 − 0 = <strong>8</strong></p>
      </div>
    `,
    gen(diff) {
      if (diff === 1) {
        // Die drei Fehler der Potenzregel rückwärts: nicht geteilt, nicht
        // erhöht, abgeleitet statt integriert. Wo kein Fehlerweg eindeutig ist
        // (5x² zu f = 5), widerlegt die Kontrolle durch Ableiten.
        const nichtGeteilt = 'Hier ist der Exponent erhöht, aber nicht durch den neuen Exponenten geteilt.';
        const nichtErhoeht = 'Hier ist durch den neuen Exponenten geteilt, der Exponent selbst aber nicht erhöht.';
        const abgeleitet = term => `Das ist die Ableitung von ${term}, keine Stammfunktion.`;
        // Die fünfte Spalte ist Schritt 1 der Erklärseite: F bilden. Vorher
        // zeigte der Weg nur Schritt 2 (die Kontrolle) – wer 4x⁴ gewählt hatte,
        // sah, dass x⁴ passt, aber nicht, woher es kommt. Die Zusatzvariante
        // derselben Stufe (aufgaben-extra.js) bildet F ebenso erst und prüft dann.
        const potenzregel = 'Exponent um 1 erhöhen und durch den neuen Exponenten teilen';
        const varianten = [
          ['2x', 'x²', ['2x²', 'x', '2'], [nichtGeteilt, nichtErhoeht, abgeleitet('2x')],
            `${potenzregel}: 2x → 2x² ⁄ 2 = x²`],
          ['3x²', 'x³', ['3x³', 'x²', '6x'], [nichtGeteilt, nichtErhoeht, abgeleitet('3x²')],
            `${potenzregel}: 3x² → 3x³ ⁄ 3 = x³`],
          ['4x³', 'x⁴', ['4x⁴', 'x³', '12x²'], [nichtGeteilt, nichtErhoeht, abgeleitet('4x³')],
            `${potenzregel}: 4x³ → 4x⁴ ⁄ 4 = x⁴`],
          ['5', '5x', ['5', '5x²', '0'], ['Das ist f selbst – und abgeleitet ergibt die Konstante 5 nur 0.',
            'Abgeleitet ergibt diese Funktion 10x, nicht 5.', abgeleitet('5')],
            // Wie auf der Erklärseite („f(x) = 5 → F(x) = 5x + C“), ohne x⁰ und x¹.
            'Eine Konstante wird zu Konstante mal x: 5 → 5x'],
          ['2x + 3', 'x² + 3x', ['2x² + 3x', 'x² + 3', '2 + 3x'], [
            'Bei 2x ist der Exponent erhöht, aber nicht durch den neuen Exponenten geteilt.',
            'Hier ist die 3 einfach stehen geblieben – abgeleitet würde sie zu 0.',
            'Hier ist 2x abgeleitet statt integriert – abgeleitet ergibt 2 + 3x nur 3.'],
            `Summandenweise: 2x → 2x² ⁄ 2 = x² (${potenzregel})&ensp;<span class="trenn">•</span>&ensp;die Konstante 3 wird zu 3x`]
        ];
        const [f, F, falsch, gruende, bilden] = choice(varianten);
        const mc = makeChoice(F, falsch, gruende);
        return {
          q: `Welche Funktion ist eine Stammfunktion von f(x) = ${f}?`, type: 'choice',
          options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: `F(x) = ${F} + C`,
          solution: `${bilden}<br>Kontrolle durch Ableiten: (${F})′ = ${f} ✓<br>Allgemein: F(x) = ${F} + C`
        };
      }
      if (diff === 2) {
        const kind = choice(['dreieck', 'parabel']);
        if (kind === 'dreieck') {
          const b = choice([2, 4, 6, 8]);
          const res = b * b / 2;
          return {
            q: `Berechne: ${intZeichen(0, b)} x dx`, type: 'input', placeholder: 'Ergebnis',
            check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
            solution: `Stammfunktion: F(x) = x²/2.<br>${intZeichen(0, b)} x dx = F(${b}) − F(0) = ${b}²/2 − 0 = ${fmt(res)}`
          };
        }
        const b = choice([3, 6]);
        const res = b ** 3 / 3;
        return {
          q: `Berechne: ${intZeichen(0, b)} x² dx`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `Stammfunktion: F(x) = x³/3.<br>${intZeichen(0, b)} x² dx = ${b}³/3 − 0 = ${b ** 3}/3 = ${fmt(res)}`
        };
      }
      const kind = choice(['linear', 'verschoben']);
      if (kind === 'linear') {
        const a = choice([2, 4, 6]), c = rnd(1, 5), b = rnd(2, 5);
        const res = a * b * b / 2 + c * b;
        // Eingesetzt in der Form der Erklärseite („F(3) − F(0) = (9 + 3) − 0“).
        // Ein Faktor 1 steht nicht da, weil die Stammfunktion ihn nicht zeigt
        // (F(x) = x² + x) – vorher hieß es „1 · 4 + 1 · 2“. Gleiche Weiche wie
        // in sachaufgaben.js.
        const teil1 = a / 2 === 1 ? fmt(b * b) : `${fmt(a / 2)} · ${fmt(b * b)}`;
        const teil2 = c === 1 ? fmt(b) : `${fmt(c)} · ${fmt(b)}`;
        const ausgerechnet = a / 2 === 1 && c === 1 ? '' : ` = ${fmt(a * b * b / 2)} + ${fmt(c * b)}`;
        return {
          q: `Berechne: ${intZeichen(0, b)} (${a}x + ${c}) dx`, type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `Stammfunktion: F(x) = ${koef(a / 2, 'x²')} + ${koef(c)}.<br>` +
            `F(${fmt(b)}) − F(0) = (${teil1} + ${teil2}) − 0${ausgerechnet} = <strong>${fmt(res)}</strong>`
        };
      }
      const von = rnd(1, 3), bis = von + rnd(1, 3);
      const res = bis * bis - von * von;
      return {
        q: `Berechne: ${intZeichen(von, bis)} 2x dx`, type: 'input', placeholder: 'Ergebnis',
        check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
        solution: `Stammfunktion: F(x) = x².<br>${intZeichen(von, bis)} 2x dx = F(${bis}) − F(${von}) = ${bis * bis} − ${von * von} = ${fmt(res)}`
      };
    }
  };

  /* ---------- Ableitungsregeln ---------- */

  /** Klammerterm „(2x + 1)“ – erspart das Zusammenstückeln an jeder Stelle. */
  function kl(a, b) { return `(${linTerm(a, b)})`; }

  /** Potenz eines Klammerterms: „(2x + 1)³“, Exponent 1 wird nicht geschrieben. */
  function klPot(a, b, n) { return n === 1 ? kl(a, b) : `${kl(a, b)}<sup>${n}</sup>`; }

  const ableitungsregeln = {
    id: 'ableitungsregeln',
    icon: '(u·v)′',
    title: 'Ableitungsregeln',
    tagline: 'Produkt-, Quotienten- und Kettenregel',
    learn: `
      <h2>Produkt-, Quotienten- und Kettenregel</h2>
      <p>Die Potenzregel reicht, solange nur Summen von Potenzen dastehen. Sobald Funktionen
      <strong>multipliziert, geteilt oder ineinandergesteckt</strong> werden, braucht es eigene Regeln.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die drei Regeln</span>
        <p><span class="formula">(u · v)′ = u′ · v + u · v′</span></p>
        <p><span class="formula">(u ⁄ v)′ = (u′ · v − u · v′) ⁄ v²</span></p>
        <p><span class="formula">(u(v(x)))′ = u′(v(x)) · v′(x)</span>&nbsp;– äußere mal innere Ableitung</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>f(x) = (2x + 1)³ → innere Funktion 2x + 1, äußere Funktion u³<br>
        f′(x) = 3 · (2x + 1)² · 2 = 6 · (2x + 1)²</p>
      </div>
    `,
    gen(diff) {
      /* ---------- Stufe 1: Welche Regel? Und die Produktregel im Grundfall ---------- */
      if (diff === 1) {
        const kind = choice(['regel', 'produktWert', 'produktTerm']);

        if (kind === 'regel') {
          const a = rnd(2, 5), b = rnd(1, 6) * choice([1, -1]);
          const c = rnd(2, 5), d = rnd(1, 6) * choice([1, -1]);
          const n = rnd(2, 4), m = rnd(2, 5);
          const faelle = [
            ['Produktregel', `${kl(a, b)} · ${kl(c, d)}`,
              'Zwei Funktionen werden multipliziert – dafür ist die Produktregel da.'],
            ['Kettenregel', klPot(a, b, n),
              'Eine Funktion steckt in einer anderen: außen die Potenz, innen der Klammerterm.'],
            ['Quotientenregel', `${frac(linTerm(a, b), linTerm(c, d))}`,
              'Ein Bruch mit x im Nenner – dafür ist die Quotientenregel da.'],
            ['Potenzregel', `${pot(a, m)} + ${pot(c, 1)}`,
              'Nur eine Summe von Potenzen – hier genügt die Potenzregel, Summand für Summand.']
          ];
          const [richtig, term, warum] = choice(faelle);
          // Jeder Grund nennt das Erkennungsmerkmal der gewählten Regel und
          // stellt fest, dass es fehlt – das gilt für jede der drei anderen
          // Bauarten gleichermaßen und verrät nicht, welche es ist.
          const mc = makeChoice(richtig, ['Produktregel', 'Kettenregel', 'Quotientenregel', 'Potenzregel'], [
            'Die Produktregel braucht zwei Klammern mit x, verbunden durch einen Malpunkt – so ein Produkt steht hier nicht.',
            'Die Kettenregel braucht eine Funktion in einer anderen, etwa eine Klammer mit Exponent – die gibt es hier nicht.',
            'Die Quotientenregel braucht einen Bruchstrich mit x im Nenner – hier steht keiner.',
            'Die Potenzregel allein reicht nur für eine Summe von Potenzen – dieser Term ist anders gebaut.'
          ]);
          return {
            q: `Welche Regel brauchst du, um f(x) = ${term} abzuleiten?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `${warum}<br>Erkennungsmerkmal: ` +
              (richtig === 'Produktregel' ? 'zwei Klammern nebeneinander, verbunden durch einen Malpunkt.'
              : richtig === 'Kettenregel' ? 'eine Klammer mit einem Exponenten – die Klammer ist die innere Funktion.'
              : richtig === 'Quotientenregel' ? 'ein Bruchstrich mit einer Variablen darunter.'
              : 'kein Produkt, kein Bruch, keine Verschachtelung.')
          };
        }

        if (kind === 'produktWert') {
          const a = rnd(2, 5), b = rnd(1, 6) * choice([1, -1]);
          let c = rnd(2, 5), d = rnd(1, 6) * choice([1, -1]);
          // Wären beide Klammern gleich, stünde dort ein Quadrat – dann braucht
          // es die Kettenregel und nicht die Produktregel.
          while (a === c && b === d) { c = rnd(2, 5); d = rnd(1, 6) * choice([1, -1]); }
          let x0 = rnd(1, 4);
          // Wird an der Stelle x0 eine der beiden Klammern null, fällt ein Summand
          // weg; werden beide null, lautet die ganze Rechnung „5 · 0 + 0 · 3 = 0“
          // und die Aufgabe prüft nichts mehr.
          let versuche = 0;
          while ((a * x0 + b === 0 || c * x0 + d === 0) && versuche++ < 8) x0 = rnd(1, 4);
          if (a * x0 + b === 0 || c * x0 + d === 0) x0 = 5;
          const u = a * x0 + b, v = c * x0 + d;
          const res = a * v + u * c;
          const mittel = a * d + b * c;   // linearer Koeffizient des ausmultiplizierten Terms
          return {
            q: `Gegeben ist f(x) = ${kl(a, b)} · ${kl(c, d)}. Berechne f′(${fmt(x0)}) mit der Produktregel.`,
            type: 'input', placeholder: 'f′(' + fmt(x0) + ')',
            check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(x0)}) = ${fmt(res)}`,
            solution: `u = ${linTerm(a, b)} und v = ${linTerm(c, d)}, also u′ = ${fmt(a)} und v′ = ${fmt(c)}.<br>` +
              `<strong>(u · v)′ = u′ · v + u · v′</strong><br>` +
              `f′(x) = ${fmt(a)} · ${kl(c, d)} + ${kl(a, b)} · ${fmt(c)}<br>` +
              `An der Stelle ${fmt(x0)}: u = ${fmt(u)}, v = ${fmt(v)}<br>` +
              `f′(${fmt(x0)}) = ${fmt(a)} · ${par(v)} + ${par(u)} · ${fmt(c)} = ${fmt(a * v)} ${u * c < 0 ? '−' : '+'} ${fmt(Math.abs(u * c))} = <strong>${fmt(res)}</strong><br>` +
              // Heben sich die linearen Glieder auf (etwa bei (2x − 2)(4x + 4)), darf
              // der Term nicht ausgeschrieben werden: „8x² + 0x − 8, abgeleitet 16x + 0“
              // sind zwei leere Rechenschritte in einer Zeile, die eine Probe sein soll.
              `<em>Gegenprobe durch Ausmultiplizieren:</em> f(x) = ${pot(a * c, 2)}${mittel ? ` ${mittel < 0 ? '−' : '+'} ${koef(Math.abs(mittel))}` : ''} ${b * d < 0 ? '−' : '+'} ${fmt(Math.abs(b * d))}, ` +
              `abgeleitet ${koef(2 * a * c)}${mittel ? ` ${mittel < 0 ? '−' : '+'} ${fmt(Math.abs(mittel))}` : ''}, an der Stelle ${fmt(x0)} ebenfalls ${fmt(res)} ✓`
          };
        }

        // produktTerm: der abgeleitete Term selbst, als Auswahl.
        //
        // Die zweite Klammer trägt einen Vorfaktor c:
        //
        //   f(x) = (x + a) · (cx + b)   →   f′(x) = 2c·x + (b + a·c)
        //
        // Drei der vier Optionen tragen dasselbe Steigungsglied 2c und
        // unterscheiden sich nur in der Konstanten. Diese drei Konstanten
        // benutzen dieselben drei Zahlen, nur anders verknüpft: b + a·c,
        // a + b·c und c + a·b. Weil a, b und c aus demselben Bereich gezogen und
        // paarweise verschieden sind, gehen die drei Ausdrücke durch Vertauschen
        // der Zahlen ineinander über – sie haben deshalb dieselbe Verteilung,
        // und die Lösung ist gleich oft die größte, die mittlere und die
        // kleinste. Alle drei liegen zwischen 10 und 47, sind also zweistellig
        // und mit demselben Vorfaktor davor auch exakt gleich lang. Keine
        // Faustregel über Größe, Länge, Stellenzahl, Anfangsziffer oder
        // Zeichenreihenfolge trifft die Lösung damit öfter als jede dritte.
        //
        // Die frühere Fassung stellte „(x + a) · (x + b)“ und hatte deshalb nur
        // eine einzige freie Zahl: die Lösung hieß 2x + (a + b), zwei Ablenker
        // trugen dieselbe Zahl a + b oder das Produkt a · b, einer war die nackte
        // 1. Gemessen (100 000 Ziehungen, fünf Saaten): „nimm die zweitgrößte
        // Zahl" traf zu 50,7 %, „nimm die zweitlängste Option“ zu 100 % (greift
        // in 43 %), und die beiden Optionen mit derselben Endzahl enthielten die
        // Lösung ausnahmslos – blind zwischen ihnen zu würfeln waren 50 %.
        let a = rnd(2, 7), b = rnd(2, 7), c = rnd(2, 7);
        // Paarweise verschieden: b + a·c = a + b·c gilt genau für c = 1,
        // b + a·c = c + a·b genau für a = 1 und a + b·c = c + a·b genau für
        // b = 1. Mit drei verschiedenen Zahlen ab 2 sind die drei Konstanten
        // also immer verschieden – sonst verwürfe makeChoice eine davon und die
        // Auswahl schrumpfte still von vier auf drei Optionen.
        while (b === a) b = rnd(2, 7);
        while (c === a || c === b) c = rnd(2, 7);
        const summe = b + a * c;
        const richtig = `${koef(2 * c)} + ${fmt(summe)}`;
        // Der vierte Ablenker ist der häufigste Fehler überhaupt: nach dem ersten
        // Summanden aufhören. u′ · v ist 1 · (cx + b), also die zweite Klammer
        // unverändert. Er trägt ein anderes Steigungsglied und ist damit ohne
        // Rechnung als der Ausreißer erkennbar – das ist Absicht und führt zu
        // nichts: Seine Konstante b ist höchstens 7, die drei anderen Konstanten
        // sind mindestens 10. Wer den Ausreißer streicht und danach nach der
        // größeren Zahl geht, behält deshalb immer alle drei übrig.
        //
        // Zugleich ist er die einzige Option, die wörtlich in der Frage steht.
        // Das macht „schreib das Längste ab, was in der Aufgabe vorkommt“ zu einer
        // Regel, die sicher danebengreift. Ohne ihn traf sie zu 47 %: Die drei
        // Konstanten sind zweistellig, und diejenige, die zufällig mit derselben
        // Ziffer beginnt wie die Zahl der ersten Klammer, teilt mit der Frage ein
        // Zeichen mehr („x + 1“ statt nur „x + “).
        const mc = makeChoice(richtig, [
          `${koef(2 * c)} + ${fmt(a + b * c)}`,  // den Vorfaktor mit der falschen Klammerzahl multipliziert
          `${koef(2 * c)} + ${fmt(c + a * b)}`,  // die Klammerzahlen multipliziert, den Vorfaktor nur addiert
          linTerm(c, b),                         // nur u′ · v gerechnet und dort aufgehört
          // Reserve. Sie rückt nur nach, wenn eine der drei vorderen
          // Möglichkeiten je zur Dublette würde; beim Zahlenbereich ab 2 ist das
          // ausgeschlossen (siehe oben). Die Zeile sichert eine spätere
          // Änderung des Bereichs gegen eine still schrumpfende Auswahl ab.
          `${koef(2 * c)} + ${fmt(a + b + c)}`   // Reserve: alle drei Zahlen addiert
        ], [
          // Paarweise verschiedene a, b, c ≥ 2 halten die vier Konstanten
          // auseinander (siehe oben) – kein Wert entsteht aus zwei Fehlern.
          `Hier trifft der Vorfaktor ${fmt(c)} auf die ${fmt(b)} aus seiner eigenen Klammer.`,
          `Hier sind die Klammerzahlen ${fmt(a)} und ${fmt(b)} multipliziert und der Vorfaktor ${fmt(c)} nur addiert.`,
          // Bei b = a·c ist u′ · v = u · v′ – dann kann es ebenso der zweite
          // Summand allein sein, und der Grund legt sich nicht fest.
          b === a * c ? 'Das ist nur einer der beiden Summanden der Produktregel – der andere fehlt.'
            : 'Das ist nur der erste Summand u′ · v – der zweite Summand u · v′ fehlt.',
          'Hier sind alle drei Zahlen nur addiert.'
        ]);
        return {
          q: `Wie lautet die Ableitung von f(x) = ${kl(1, a)} · ${kl(c, b)}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
          solution: `u = ${linTerm(1, a)} mit u′ = 1, v = ${linTerm(c, b)} mit v′ = ${fmt(c)}.<br>` +
            `<strong>(u · v)′ = u′ · v + u · v′</strong><br>` +
            `f′(x) = 1 · ${kl(c, b)} + ${kl(1, a)} · ${fmt(c)} = ${kl(c, b)} + (${koef(c)} + ${fmt(a * c)}) = <strong>${richtig}</strong><br>` +
            `<em>Probe durch Ausmultiplizieren:</em> f(x) = ${pot(c, 2)} + ${koef(summe)} + ${fmt(a * b)} → f′(x) = ${richtig} ✓<br>` +
            `Auf die Zuordnung kommt es an: Der Vorfaktor ${fmt(c)} trifft auf die ${fmt(a)} aus der ersten Klammer, denn er stammt aus ${kl(1, a)} · ${fmt(c)} – nicht auf die ${fmt(b)}.<br>` +
            `Zwei Abkürzungen führen daneben: Wer nach dem ersten Summanden aufhört, notiert nur ${linTerm(c, b)} – die zweite Klammer, unverändert abgeschrieben. Und u′ · v′ wäre 1 · ${fmt(c)} = ${fmt(c)}, eine Zahl ganz ohne x.`
        };
      }

      /* ---------- Stufe 2: Kettenregel und Produkt mit Potenz ---------- */
      if (diff === 2) {
        const kind = choice(['kette', 'innere', 'produktPotenz']);

        if (kind === 'kette') {
          // Klammerwert zuerst festlegen und b daraus bestimmen: So bleibt
          // f′(x0) auch bei Exponent 4 eine überschaubare Zahl.
          const a = rnd(2, 5), n = rnd(2, 4);
          const inner = choice([-2, -1, 1, 2, 3]);
          const xx = rnd(1, 4);
          const b = inner - a * xx;
          const res = n * a * Math.pow(inner, n - 1);
          // Bei n = 2 ist der Exponent der äußeren Ableitung 1 und wird nicht
          // geschrieben – wie in klPot und auf der Erklärseite („2 · (3x − 1) · 3“).
          // Vorher stand „u′ = 2v¹“ und „8 · 3¹ = 8 · 3“, also ein leerer Schritt.
          const potHoch = n - 1 > 1 ? `<sup>${fmt(n - 1)}</sup>` : '';
          const auswertung = n - 1 > 1
            ? `${fmt(n * a)} · ${par(inner)}${potHoch} = ${fmt(n * a)} · ${par(Math.pow(inner, n - 1))}`
            : `${fmt(n * a)} · ${par(inner)}`;
          return {
            q: `Leite ab und werte aus: f(x) = ${klPot(a, b, n)}. Wie groß ist f′(${fmt(xx)})?`,
            type: 'input', placeholder: 'f′(' + fmt(xx) + ')',
            check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(xx)}) = ${fmt(res)}`,
            solution: `Innere Funktion: v = ${linTerm(a, b)} mit v′ = ${fmt(a)}. Äußere Funktion: u = v<sup>${fmt(n)}</sup> mit u′ = ${fmt(n)}v${potHoch}.<br>` +
              `<strong>Äußere mal innere Ableitung:</strong><br>` +
              `f′(x) = ${fmt(n)} · ${klPot(a, b, n - 1)} · ${fmt(a)} = ${koef(n * a, klPot(a, b, n - 1))}<br>` +
              `An der Stelle ${fmt(xx)} ist die Klammer ${fmt(inner)}:<br>` +
              `f′(${fmt(xx)}) = ${auswertung} = <strong>${fmt(res)}</strong><br>` +
              `<em>Ohne die innere Ableitung</em> käme ${fmt(n)} · ${par(Math.pow(inner, n - 1))} = ${fmt(n * Math.pow(inner, n - 1))} heraus – der Faktor ${fmt(a)} fehlte dann.`
          };
        }

        if (kind === 'innere') {
          const a = rnd(2, 5), b = rnd(1, 7) * choice([1, -1]);
          const n = rnd(2, 5);
          const innen = linTerm(a, b);                  // die innere Funktion, „3x + 7“
          const aussen = `x<sup>${fmt(n)}</sup>`;       // die äußere Funktion, „x⁴“
          // Basis und Hochzahl vertauscht: „4ˣ“ ist eine Exponentialfunktion,
          // „x⁴“ eine Potenzfunktion – zwei ganz verschiedene Funktionen.
          const getauscht = `${fmt(n)}<sup>x</sup>`;
          // Probestelle für den Lösungsweg: x = 1, außer die Klammer wird dort
          // null – „zuerst 5 · 1 − 5 = 0, danach 0 hoch 4“ zeigt nichts.
          const xp = a + b === 0 ? 2 : 1;
          // Die Rollenwörter stehen hinter den Termen, nicht davor. Das ist kein
          // Stilentscheid: Endet eine Option mit „…außen x<sup>4</sup>", steht das
          // Hochzahl-Markup am Zeilenende – jede Messung, die Auszeichnungen durch
          // ein Leerzeichen ersetzt, schneidet es dort ab und misst die Option um
          // ein Zeichen kürzer als die vertauschte. Damit wären zwei Optionen
          // messbar kürzer als die beiden anderen, und die Lösung säße immer in
          // derselben Hälfte. So endet jede Option auf ein Wort und alle vier sind
          // gleich lang.
          const zerlegung = (i, ae) => `${i} innen, ${ae} außen`;
          const richtig = zerlegung(innen, aussen);
          // Gefragt ist nicht mehr ein einzelner Term, sondern die Zuordnung
          // beider Terme – und zwar aus einem messbaren Grund. Bot die Aufgabe die
          // vier Terme „ax + b“, „x hoch n“, „(ax + b) hoch n“ und „a“ zur Wahl,
          // war die Lösung ausnahmslos die zweitlängste Option (gemessen 100 %),
          // denn nur die ganze Funktion ist länger als die Klammer allein.
          // Strich man die Potenzen, war die Lösung das Längste, was sich
          // wörtlich aus der Frage abschreiben lässt – ebenfalls 100 %.
          //
          // Die vier Zuordnungen sind gegen beides gebaut: Sie bestehen aus
          // denselben zwei Bausteinen in denselben zwei Rollen, enthalten
          // dieselben drei Zahlen und sind alle gleich lang (der Klammerterm
          // zählt sechs, jede Potenz drei Zeichen). Jede enthält den Klammerterm
          // wörtlich, also hilft auch Abschreiben nicht weiter. Übrig bleiben
          // zwei Entscheidungen, die nur die Sache selbst beantwortet: Was steht
          // innen, und wie sieht die Potenz aus.
          const mc = makeChoice(richtig, [
            zerlegung(aussen, innen),        // innen und außen vertauscht – der Kernfehler
            zerlegung(innen, getauscht),     // außen Basis und Hochzahl vertauscht
            zerlegung(getauscht, innen),     // beides zugleich
            // Reserve. Sie rückt nur nach, wenn eine der drei vorderen
            // Möglichkeiten je zur Dublette würde; das ist ausgeschlossen, weil
            // der Klammerterm (er trägt ein x mit Vorfaktor und eine Konstante)
            // mit keiner der beiden Potenzen zusammenfallen kann und „x hoch n“
            // nie gleich „n hoch x“ ist. Die Zeile sichert spätere Änderungen ab.
            zerlegung(innen, `x<sup>${fmt(n + 1)}</sup>`)
          ], [
            'Hier sind innere und äußere Funktion vertauscht.',
            'Hier sind bei der Potenz Basis und Exponent vertauscht.',
            // Beides zugleich: kein Grund – die Umkehr beider Merkmale wäre die
            // Lösung. Die Reserve x^(n+1) ist kein Fehlerweg und bleibt ebenso still.
            null
          ]);
          return {
            q: `Bei f(x) = ${klPot(a, b, n)} wendest du die Kettenregel an. Welcher Term steht <strong>innen</strong>, welcher <strong>außen</strong>?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `Innen steht, was zuerst mit x passiert – hier wird x mit ${fmt(a)} multipliziert und ${b > 0 ? 'um ' + fmt(b) + ' erhöht' : 'um ' + fmt(Math.abs(b)) + ' verringert'}: <strong>v = ${innen}</strong>.<br>` +
              `Erst dieses Ergebnis wird hoch ${fmt(n)} genommen. Die äußere Funktion ist also u = v<sup>${fmt(n)}</sup>, für sich aufgeschrieben <strong>${aussen}</strong>.<br>` +
              `<em>Probe mit einer Zahl:</em> Bei x = ${fmt(xp)} rechnest du zuerst ${fmt(a)} · ${fmt(xp)} ${b > 0 ? '+' : '−'} ${fmt(Math.abs(b))} = ${fmt(a * xp + b)} und erst danach ${par(a * xp + b)}<sup>${fmt(n)}</sup>. Was zuerst dran ist, steht innen.<br>` +
              `Nicht verwechseln: ${aussen} und ${getauscht} sind verschiedene Funktionen – bei ${aussen} steht das x unten und die ${fmt(n)} oben, bei ${getauscht} genau umgekehrt.`
          };
        }

        // produktPotenz: Produktregel mit einem Potenzfaktor
        const m = rnd(2, 4), a = rnd(2, 5), b = rnd(1, 5) * choice([1, -1]);
        // x0 höchstens 2: Bei x⁴ und x0 = 3 stand als Antwort schon 2565 –
        // rechnerisch richtig, aber als Kopfrechnung sinnlos.
        const x0 = rnd(1, 2);
        const v0 = a * x0 + b;
        const res = m * Math.pow(x0, m - 1) * v0 + Math.pow(x0, m) * a;
        return {
          q: `Gegeben ist f(x) = ${pot(1, m)} · ${kl(a, b)}. Berechne f′(${fmt(x0)}).`,
          type: 'input', placeholder: 'f′(' + fmt(x0) + ')',
          check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(x0)}) = ${fmt(res)}`,
          solution: `u = ${pot(1, m)} mit u′ = ${pot(m, m - 1)}, v = ${linTerm(a, b)} mit v′ = ${fmt(a)}.<br>` +
            `<strong>(u · v)′ = u′ · v + u · v′</strong><br>` +
            `f′(x) = ${pot(m, m - 1)} · ${kl(a, b)} + ${pot(1, m)} · ${fmt(a)}<br>` +
            `An der Stelle ${fmt(x0)}: ${pot(1, m)} = ${fmt(Math.pow(x0, m))}, ${pot(m, m - 1)} = ${fmt(m * Math.pow(x0, m - 1))}, Klammer = ${fmt(v0)}<br>` +
            `f′(${fmt(x0)}) = ${fmt(m * Math.pow(x0, m - 1))} · ${par(v0)} + ${fmt(Math.pow(x0, m))} · ${fmt(a)} = ${fmt(m * Math.pow(x0, m - 1) * v0)} + ${fmt(Math.pow(x0, m) * a)} = <strong>${fmt(res)}</strong>`
        };
      }

      /* ---------- Stufe 3: Quotientenregel, Wurzel, Logarithmus, Kombination ---------- */
      const kind = choice(['quotient', 'wurzel', 'logarithmus', 'kombi']);

      if (kind === 'logarithmus') {
        // f(x) = ln(ax + b), f′(x0) = a / (ax0 + b). Der Wert t = ax0 + b hat nur
        // die Primfaktoren 2 und 5, also bricht a/t als Dezimalzahl ab. a ≥ 2, sonst
        // wäre „mal innere Ableitung" ein leerer Schritt (· 1). a ≠ t,
        // sonst stünde immer 1 da; b ≠ 0, sonst kürzt sich a weg (ln(ax) hat die
        // Ableitung 1/x – das steht als Selbstcheck auf der Seite).
        let a, x0, t, b;
        do {
          t = choice([2, 4, 5, 8, 10]); a = rnd(2, 9); x0 = rnd(1, 4); b = t - a * x0;
        } while (a === t || b === 0);
        const res = a / t;
        return {
          q: `Gegeben ist f(x) = ln(${linTerm(a, b)}). Berechne f′(${fmt(x0)}). <span class="hint">Kettenregel: ln ist die äußere Funktion.</span>`,
          type: 'input', placeholder: 'f′(' + fmt(x0) + ')',
          check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(x0)}) = ${fmt(res)}`,
          // Aufbau wie im Beispiel „ln mit innerer Funktion" der Erklärseite.
          solution: `Kettenregel, der Logarithmus ist außen.<br>` +
            `Innere Funktion v = ${linTerm(a, b)} → v′ = ${fmt(a)}&ensp;<span class="trenn">•</span>&ensp;` +
            `äußere Funktion u = ln(v) → u′ = 1 ⁄ v<br>` +
            `<strong>Äußere mal innere Ableitung:</strong><br>` +
            `f′(x) = 1 ⁄ (${linTerm(a, b)}) · ${fmt(a)} = ${fmt(a)} ⁄ (${linTerm(a, b)})<br>` +
            `An der Stelle ${fmt(x0)} ist ${linTerm(a, b)} = ${fmt(a)} · ${fmt(x0)} ${b > 0 ? '+' : '−'} ${fmt(Math.abs(b))} = ${fmt(t)}.<br>` +
            `f′(${fmt(x0)}) = ${fmt(a)} ⁄ ${fmt(t)} = <strong>${fmt(res)}</strong><br>` +
            `<em>Ohne die innere Ableitung</em> stünde dort 1 ⁄ ${fmt(t)} = ${fmt(1 / t)} – der Faktor ${fmt(a)} fehlte.`
        };
      }

      if (kind === 'quotient') {
        const a = rnd(1, 5), b = rnd(1, 6) * choice([1, -1]);
        const c = rnd(1, 4);
        const t = choice([1, 2, -1, -2]);          // Nennerwert an der Stelle x0
        const x0 = rnd(1, 4);
        const d = t - c * x0;                       // damit c·x0 + d = t
        const zaehlerAbl = a * d - b * c;           // (ad − bc) ist die ganze Zählerarbeit
        const res = zaehlerAbl / (t * t);
        return {
          q: `Gegeben ist f(x) = ${frac(linTerm(a, b), linTerm(c, d))}. Berechne f′(${fmt(x0)}) mit der Quotientenregel.`,
          type: 'input', placeholder: 'f′(' + fmt(x0) + ')',
          check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(x0)}) = ${fmt(res)}`,
          solution: `u = ${linTerm(a, b)} mit u′ = ${fmt(a)}, v = ${linTerm(c, d)} mit v′ = ${fmt(c)}.<br>` +
            `<strong>(u ⁄ v)′ = (u′ · v − u · v′) ⁄ v²</strong><br>` +
            `Zähler: ${fmt(a)} · ${kl(c, d)} − ${kl(a, b)} · ${fmt(c)} = ${fmt(zaehlerAbl)} – die x-Terme heben sich gegenseitig auf, übrig bleibt eine reine Zahl.<br>` +
            `An der Stelle ${fmt(x0)} ist der Nenner ${linTerm(c, d)} = ${fmt(t)}, also v² = ${fmt(t * t)}.<br>` +
            `f′(${fmt(x0)}) = ${fmt(zaehlerAbl)} ⁄ ${fmt(t * t)} = <strong>${fmt(res)}</strong><br>` +
            `<em>Die Reihenfolge im Zähler zählt:</em> u · v′ − u′ · v ergäbe ${fmt(-zaehlerAbl)} statt ${fmt(zaehlerAbl)}, also das falsche Vorzeichen.`
        };
      }

      if (kind === 'wurzel') {
        // ax0 + b soll eine Quadratzahl q² sein, und a/(2q) muss abbrechen:
        // deshalb q ∈ {1, 2, 4, 5} – bei q = 3 entstünde 5/6 = 0,8333…
        const q = choice([1, 2, 4, 5]);
        const a = rnd(2, 9), x0 = rnd(1, 4);
        const b = q * q - a * x0;
        const res = a / (2 * q);
        return {
          q: `Gegeben ist f(x) = √(${linTerm(a, b)}). Berechne f′(${fmt(x0)}). <span class="hint">Kettenregel: die Wurzel ist die äußere Funktion.</span>`,
          type: 'input', placeholder: 'f′(' + fmt(x0) + ')',
          check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(x0)}) = ${fmt(res)}`,
          // Aufbau wie im Beispiel „Die Wurzel als äußere Funktion“: v, u und ihre
          // Ableitungen, dann ausdrücklich das Produkt „äußere mal innere
          // Ableitung". Vorher sprang der Weg von u′ und v′ direkt zum fertigen
          // Bruch – genau über den Faktor, den der Merkkasten den häufigsten
          // Fehler nennt. Die Potenzschreibweise wird jetzt auch benutzt: Aus ihr
          // kommt u′ (Potenzregel mit dem Exponenten ½).
          solution: `Kettenregel, die Wurzel ist außen.<br>` +
            `Innere Funktion v = ${linTerm(a, b)} → v′ = ${fmt(a)}&ensp;<span class="trenn">•</span>&ensp;` +
            `äußere Funktion u = √v = v<sup>1/2</sup> → u′ = ½ · v<sup>−1/2</sup> = 1 ⁄ (2√v)<br>` +
            `<strong>Äußere mal innere Ableitung:</strong><br>` +
            `f′(x) = 1 ⁄ (2√(${linTerm(a, b)})) · ${fmt(a)} = ${fmt(a)} ⁄ (2√(${linTerm(a, b)}))<br>` +
            `An der Stelle ${fmt(x0)} steht unter der Wurzel ${fmt(a)} · ${fmt(x0)}${b === 0 ? '' : ` ${b > 0 ? '+' : '−'} ${fmt(Math.abs(b))}`} = ${fmt(q * q)}, also √${fmt(q * q)} = ${fmt(q)}.<br>` +
            `f′(${fmt(x0)}) = ${fmt(a)} ⁄ ${fmt(2 * q)} = <strong>${fmt(res)}</strong><br>` +
            `<em>Ohne die innere Ableitung</em> stünde dort 1 ⁄ ${fmt(2 * q)} = ${fmt(1 / (2 * q))} – der Faktor ${fmt(a)} fehlte.`
        };
      }

      // kombi: Produktregel und Kettenregel in einer Aufgabe
      const a = rnd(2, 4), n = rnd(2, 3);
      const t = choice([1, 2]);
      const x0 = rnd(1, 3);
      const b = t - a * x0;
      const res = Math.pow(t, n) + x0 * n * a * Math.pow(t, n - 1);
      /* Der Klammerwert wird mit seiner Potenz eingesetzt, wie auf der
         Erklärseite („(2)² + 6 · 2“): Nur so ist zu sehen, dass der erste
         Summand die n-te und der zweite die (n−1)-te Potenz trägt – dort sitzt
         der typische Exponentenfehler. Vorher stand bei Klammerwert 1 nur
         „1 + 2 · 6 · 1“. Ein Exponent 1 wird nicht geschrieben, und bei x0 = 1
         entfällt der Faktor x wie auf der Seite. */
      const zweiterFaktor = n - 1 > 1 ? `${fmt(t)}<sup>${fmt(n - 1)}</sup>` : fmt(t);
      const einsetzen = `${fmt(t)}<sup>${fmt(n)}</sup> + ${x0 === 1 ? '' : `${fmt(x0)} · `}${fmt(n * a)} · ${zweiterFaktor}`;
      return {
        q: `Gegeben ist f(x) = x · ${klPot(a, b, n)}. Berechne f′(${fmt(x0)}). <span class="hint">Erst die Produktregel, für den zweiten Faktor dann die Kettenregel.</span>`,
        type: 'input', placeholder: 'f′(' + fmt(x0) + ')',
        check: numCheck(res), testAnswer: String(res), answerText: `f′(${fmt(x0)}) = ${fmt(res)}`,
        solution: `u = x mit u′ = 1, v = ${klPot(a, b, n)}.<br>` +
          `v′ braucht die Kettenregel: v′ = ${fmt(n)} · ${klPot(a, b, n - 1)} · ${fmt(a)} = ${koef(n * a, klPot(a, b, n - 1))}<br>` +
          `<strong>(u · v)′ = u′ · v + u · v′</strong><br>` +
          `f′(x) = ${klPot(a, b, n)} + x · ${koef(n * a, klPot(a, b, n - 1))}<br>` +
          `An der Stelle ${fmt(x0)} ist die Klammer ${fmt(t)}:<br>` +
          `f′(${fmt(x0)}) = ${einsetzen} = ${fmt(Math.pow(t, n))} + ${fmt(x0 * n * a * Math.pow(t, n - 1))} = <strong>${fmt(res)}</strong>`
      };
    }
  };


  /* ---------- e-Funktion und natürlicher Logarithmus ---------- */

  /** „e^(kx)“ bzw. „e^x“; k = 1 wird nicht geschrieben, k = −1 nur als Minus. */
  function eHoch(k) {
    if (k === 1) return 'e<sup>x</sup>';
    if (k === -1) return 'e<sup>−x</sup>';
    return `e<sup>${fmt(k)}x</sup>`;
  }

  const efunktion = {
    id: 'efunktion',
    icon: 'eˣ',
    title: 'e-Funktion und ln',
    tagline: 'Die natürliche Exponentialfunktion und ihre Umkehrung',
    learn: `
      <h2>Die e-Funktion und der natürliche Logarithmus</h2>
      <p>Unter allen Exponentialfunktionen gibt es genau eine, die sich beim Ableiten nicht
      verändert: f(x) = e<sup>x</sup>.</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">(e<sup>x</sup>)′ = e<sup>x</sup></span>&nbsp;·&nbsp;<span class="formula">(e<sup>kx</sup>)′ = k · e<sup>kx</sup></span></p>
        <p>ln ist die Umkehrung: <span class="formula">ln(e<sup>x</sup>) = x</span> und
        <span class="formula">e<sup>ln(a)</sup> = a</span></p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>f(x) = 3e<sup>2x</sup> → f′(x) = 3 · 2 · e<sup>2x</sup> = 6e<sup>2x</sup></p>
      </div>
    `,
    gen(diff) {
      /* ---------- Stufe 1: e und ln heben sich auf ---------- */
      if (diff === 1) {
        const kind = choice(['umkehr', 'ableitungRegel', 'sonderwert']);

        if (kind === 'umkehr') {
          const n = rndNonZero(-6, 8);
          const richtungLn = choice([true, false]);
          if (richtungLn) {
            return {
              q: `Berechne ohne Taschenrechner: ln(e<sup>${fmt(n)}</sup>)`,
              type: 'input', placeholder: 'Ergebnis',
              check: numCheck(n), testAnswer: String(n), answerText: fmt(n),
              solution: `ln und e sind Umkehrfunktionen – sie heben sich gegenseitig auf:<br>` +
                `<strong>ln(e<sup>x</sup>) = x</strong> für jedes x.<br>` +
                `Also ist ln(e<sup>${fmt(n)}</sup>) = <strong>${fmt(n)}</strong>.<br>` +
                `<em>Warum:</em> ln fragt „Mit welchem Exponenten muss ich e potenzieren?“ – und der steht hier schon da.`
            };
          }
          const a = rnd(2, 40);
          return {
            q: `Berechne ohne Taschenrechner: e<sup>ln(${fmt(a)})</sup>`,
            type: 'input', placeholder: 'Ergebnis',
            check: numCheck(a), testAnswer: String(a), answerText: fmt(a),
            solution: `Auch andersherum heben sich die beiden auf:<br>` +
              `<strong>e<sup>ln(a)</sup> = a</strong> für jedes a &gt; 0.<br>` +
              `Also ist e<sup>ln(${fmt(a)})</sup> = <strong>${fmt(a)}</strong>.<br>` +
              `<em>Warum:</em> ln(${fmt(a)}) ist genau der Exponent, mit dem e die Zahl ${fmt(a)} ergibt. Setzt man ihn ein, kommt ${fmt(a)} heraus.`
          };
        }

        if (kind === 'ableitungRegel') {
          const k = rndNonZero(-4, 5);
          const richtig = k === 1 ? eHoch(1) : `${koef(k, eHoch(k))}`;
          const mc = makeChoice(richtig, [
            eHoch(k),                                  // Faktor k vergessen
            // Innere Funktion statt ihrer Ableitung angehängt. Steht hier nicht
            // aus Vollständigkeit, sondern weil sonst NUR die Lösung die Zahl des
            // Exponenten zweimal trägt: „In welcher Antwort kommt die 4 doppelt
            // vor?" traf zu 100 %, ohne dass man die Kettenregel kennen musste.
            `${koef(k, 'x')} · ${eHoch(k)}`,
            `${koef(k, eHoch(k === 1 ? 2 : k - 1))}`,  // Exponent wie bei der Potenzregel verkleinert
            `${koef(k * k, eHoch(k))}`,                // k zweimal angewandt
            // k + 1 wäre bei k = −1 gleich 0 und ergäbe „0e^(−x)“ – kein Term,
            // den jemand als Ableitung anbieten würde.
            `${koef(k > 0 ? k + 1 : k - 1, eHoch(k))}`  // Reserve
          ], [
            // Bei k = 1 ist die innere Ableitung 1: Dieser Ablenker IST dann die
            // Lösung und fällt in makeChoice heraus. Bei k = −1 ist er e^(−x) wie
            // der Ablenker „k zweimal“ – zwei Fehler, ein Wert: makeChoice schweigt.
            'Hier fehlt die Ableitung des Exponenten als Faktor davor.',
            `Hier ist der Exponent ${koef(k, 'x')} selbst davorgestellt statt seiner Ableitung.`,
            // Bei k = 1 steht dort e^(2x) – kein verkleinerter Exponent, kein Fehlerweg.
            k === 1 ? null : 'Hier ist die Zahl vor dem x im Exponenten um 1 verkleinert, wie bei der Potenzregel.',
            `Hier ist mit ${fmt(k)} zweimal multipliziert.`,
            null                                        // Reserve: Füllwert
          ]);
          return {
            q: `Wie lautet die Ableitung von f(x) = ${eHoch(k)}?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            // „Die e-Funktion bleibt beim Ableiten sie selbst“ war wörtlich die
            // Fehlvorstellung, die der Warnkasten der Seite widerlegt – wer den
            // Ablenker e^(kx) gewählt hatte, las zuerst eine Bestätigung. Die
            // Seite sagt in Schritt 2 „e-Teil abschreiben“, nicht „die Funktion“.
            solution: (k === 1
              ? `Der e-Teil e<sup>x</sup> wird abgeschrieben. Die Ableitung des Exponenten x ist 1 – ein Faktor 1 ändert nichts:<br>`
              : `Der e-Teil ${eHoch(k)} wird abgeschrieben. Davor kommt als Faktor die Ableitung des Exponenten ${koef(k, 'x')}, also ${fmt(k)} (Kettenregel):<br>`) +
              `<strong>(e<sup>kx</sup>)′ = k · e<sup>kx</sup></strong><br>` +
              (k === 1
                ? `Hier ist k = 1 – nur in diesem Fall verändert sich e<sup>x</sup> beim Ableiten nicht: f′(x) = <strong>${richtig}</strong>.<br>`
                : `Hier ist k = ${fmt(k)}, also f′(x) = <strong>${richtig}</strong>.<br>`) +
              `<em>Anders als bei x<sup>n</sup> wird der Exponent nicht kleiner</em> – bei der e-Funktion steht x im Exponenten, nicht in der Basis.`
          };
        }

        /* Die Werte, die man auswendig können sollte. `ln(e²)` stand hier
           früher mit dabei – und weil der Zweig „umkehr“ dieselbe Form mit
           beliebigem Exponenten stellt, häufte sich die Antwort 2 auf 39 % aller
           Ziehungen dieser Frageform. Der Exponentenfall ist dort ohnehin
           abgedeckt, hier bleiben die drei Werte, die man wirklich kennen muss. */
        const faelle = [
          ['ln(1)', 0, 'e hoch 0 ist 1 – wie jede Zahl hoch 0.'],
          ['ln(e)', 1, 'e hoch 1 ist e selbst.'],
          ['e<sup>0</sup>', 1, 'Jede Zahl hoch 0 ergibt 1, auch e.']
        ];
        const [term, wert, warum] = choice(faelle);
        return {
          q: `Berechne ohne Taschenrechner: ${term}`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(wert), testAnswer: String(wert), answerText: fmt(wert),
          solution: `${warum}<br>Also ${term} = <strong>${fmt(wert)}</strong>.`
        };
      }

      /* ---------- Stufe 2: Ableiten und Exponentialgleichungen ---------- */
      if (diff === 2) {
        const kind = choice(['ableiten', 'gleichung', 'tangente']);

        if (kind === 'ableiten') {
          const a = rndNonZero(-6, 8), k = rndNonZero(-3, 4);
          const res = a * k;            // f′(0) = a · k · e^0 = a · k
          /* Wortlaut des Selbstchecks der Seite: „Der Vorfaktor bleibt, der
             e-Teil bleibt, und die Ableitung des Exponenten kommt davor." Früher
             hieß es „die e-Funktion bleibt sie selbst“ – genau die Begründung,
             die der Warnkasten widerlegt. Und bei a = ±1 steht in der Aufgabe gar
             kein Vorfaktor: „1 · (−3) · e^(−3x)“ war ein leerer Schritt, „der
             Vorfaktor bleibt stehen" meinte etwas, das niemand sieht. */
          const eTeil = eHoch(k);
          let regel, ableitung, merke;
          if (a === 1 || a === -1) {
            const anfang = a === 1 ? 'Kein Vorfaktor.' : 'Das Minus vor dem e bleibt stehen.';
            if (k === 1) {
              regel = `${anfang} e<sup>x</sup> abgeleitet ist wieder e<sup>x</sup>:`;
              ableitung = koef(res, eTeil);
            } else {
              regel = `${anfang} Der e-Teil ${eTeil} bleibt, die Ableitung des Exponenten (${fmt(k)}) kommt davor:`;
              // −(−3) · e^(−3x) ist ein echter Vorzeichenschritt, −4e^(4x) steht direkt da.
              ableitung = a === -1 && k < 0 ? `−${par(k)} · ${eTeil} = ${koef(res, eTeil)}` : koef(res, eTeil);
            }
            merke = k === 1
              ? (a === 1 ? 'gleich 1 – genau die Steigung im Punkt (0 | 1), durch die e festgelegt ist' : 'einfach −1, das Minus davor')
              : (a === 1 ? 'einfach k, die Zahl vor dem x im Exponenten' : 'einfach −k: das Minus davor mal die Zahl vor dem x im Exponenten');
          } else if (k === 1) {
            regel = `Der Vorfaktor ${fmt(a)} bleibt, e<sup>x</sup> abgeleitet ist wieder e<sup>x</sup>:`;
            ableitung = koef(res, eTeil);
            merke = 'einfach der Vorfaktor selbst';
          } else {
            regel = `Der Vorfaktor ${fmt(a)} bleibt, der e-Teil ${eTeil} bleibt, und die Ableitung des Exponenten (${fmt(k)}) kommt davor:`;
            ableitung = `${fmt(a)} · ${par(k)} · ${eTeil} = ${koef(res, eTeil)}`;
            merke = 'einfach der Vorfaktor mal k';
          }
          // Einsetzen wie im Seitenbeispiel („f′(0) = 6 · e⁰ = 6 · 1 = 6“); bei
          // ±e⁰ ohne den Faktor 1.
          const anNull = Math.abs(res) === 1
            ? `${res < 0 ? '−' : ''}e<sup>0</sup> = <strong>${fmt(res)}</strong>`
            : `${fmt(res)} · e<sup>0</sup> = ${fmt(res)} · 1 = <strong>${fmt(res)}</strong>`;
          return {
            q: `Gegeben ist f(x) = ${koef(a, eHoch(k))}. Berechne f′(0).`,
            type: 'input', placeholder: 'f′(0)',
            check: numCheck(res), testAnswer: String(res), answerText: `f′(0) = ${fmt(res)}`,
            solution: `${regel}<br>` +
              `f′(x) = ${ableitung}<br>` +
              `An der Stelle 0 wird der Exponent ${koef(k, 'x')} zu 0, und e<sup>0</sup> = 1:<br>` +
              `f′(0) = ${anNull}<br>` +
              `<em>Merke:</em> e<sup>0</sup> = 1 – deshalb ist f′(0) ${merke}.`
          };
        }

        if (kind === 'gleichung') {
          const k = rndNonZero(-3, 4);
          const m = rndNonZero(-4, 6);
          const res = m / k;
          const rund = Math.round(res * 100) / 100;
          /* „=“ nur, wo die Division aufgeht, „≈“ nur, wo gerundet wird – wie im
             Seitenbeispiel („0,5x = ln(4) ≈ 1,386“). Vorher stand es vertauscht:
             „x = 4 ⁄ 3 = 1,33“ und dann „3 · 1,33 ≈ 3,99, also dasselbe wie
             rechts". Die Probe rechnet deshalb mit dem ungerundeten Wert.
             Bei k = 1 steht x nach dem Logarithmieren schon allein – kein
             „| : 1“, kein „2 ⁄ 1“, keine Probe. Bei k = −1 ist „| : (−1)“ ein
             echter Schritt, das Ergebnis steht aber ohne „6 ⁄ (−1)“ da. */
          const exakt = Math.abs(rund - res) < 1e-9;
          let umformen;
          if (k === 1) {
            umformen = `x = <strong>${fmt(m)}</strong>`;
          } else if (k === -1) {
            // „−x = −6“ statt „−6 = −6“: Ist x positiv, steht die Probe schon da.
            umformen = `−x = ${fmt(m)}&nbsp;| : (−1)<br>x = <strong>${fmt(rund)}</strong><br>` +
              `<em>Probe:</em> Mit x = ${fmt(rund)} wird der Exponent links −x = ${rund < 0 ? `−${par(rund)} = ` : ''}${fmt(m)}, genau der Exponent rechts ✓`;
          } else {
            umformen = `${koef(k)} = ${fmt(m)}&nbsp;| : ${par(k)}<br>` +
              `x = ${fmt(m)} ⁄ ${par(k)} ${exakt ? '=' : '≈'} <strong>${fmt(rund)}</strong><br>` +
              (exakt
                ? `<em>Probe:</em> Der Exponent links wird ${fmt(k)} · ${par(rund)} = ${fmt(m)}, genau der Exponent rechts ✓`
                : `<em>Probe mit dem ungerundeten Wert:</em> Der Exponent links wird ${fmt(k)} · (${fmt(m)} ⁄ ${par(k)}) = ${fmt(m)}, genau der Exponent rechts ✓`);
          }
          // e¹ schreibt niemand; und gerundet heißt die Antwort „≈“, wie im Weg
          const eM = m === 1 ? 'e' : `e<sup>${fmt(m)}</sup>`;
          return {
            q: `Löse nach x auf: ${eHoch(k)} = ${eM} <span class="hint">Auf 2 Dezimalstellen, falls nötig.</span>`,
            type: 'input', placeholder: 'x',
            check: numCheck(res, 0.006), testAnswer: String(rund), answerText: `x ${exakt ? '=' : '≈'} ${fmt(rund)}`,
            solution: `Auf beiden Seiten steht dieselbe Basis e. Dann müssen die Exponenten gleich sein – formal: auf beiden Seiten ln anwenden.<br>` +
              `ln(${eHoch(k)}) = ln(${eM})<br>` +
              umformen
          };
        }

        // tangente: Steigung im Punkt (0 | a)
        const a2 = rnd(2, 9), k2 = rndNonZero(-3, 4);
        return {
          q: `Der Graph von f(x) = ${koef(a2, eHoch(k2))} schneidet die y-Achse. Welche Steigung hat er dort?`,
          type: 'input', placeholder: 'Steigung',
          check: numCheck(a2 * k2), testAnswer: String(a2 * k2), answerText: `m = ${fmt(a2 * k2)}`,
          solution: `Die y-Achse wird bei x = 0 geschnitten, die Steigung dort ist f′(0).<br>` +
            `f′(x) = ${k2 === 1 ? koef(a2 * k2, eHoch(k2)) : `${fmt(a2)} · ${par(k2)} · ${eHoch(k2)} = ${koef(a2 * k2, eHoch(k2))}`}<br>` +
            `f′(0) = ${fmt(a2 * k2)} · e<sup>0</sup> = ${fmt(a2 * k2)} · 1 = <strong>${fmt(a2 * k2)}</strong><br>` +
            `Der Schnittpunkt selbst liegt bei (0 | ${fmt(a2)}), denn f(0) = ${fmt(a2)} · 1 = ${fmt(a2)}.`
        };
      }

      /* ---------- Stufe 3: Zerfall, Halbwertszeit, Produktregel ---------- */
      const kind = choice(['zerfall', 'halbwert', 'produkt']);

      if (kind === 'zerfall') {
        const N0 = choice([200, 400, 500, 800, 1000]);
        const lam = choice([0.1, 0.2, 0.25, 0.5]);
        const t = rnd(2, 8);
        const res = N0 * Math.exp(-lam * t);
        const rund = Math.round(res * 100) / 100;
        return {
          q: `Ein Stoff zerfällt nach N(t) = ${fmt(N0)} · e<sup>−${fmt(lam)}t</sup> (t in Stunden). Wie viel ist nach ${fmt(t)} Stunden übrig? <span class="hint">Auf 2 Dezimalstellen, Taschenrechner erlaubt.</span>`,
          type: 'input', placeholder: 'Menge',
          // Toleranz 0,06: deckt den Weg über den 4-stelligen Faktor (bis 0,035 daneben), über
          // e ≈ 2,718 (bis 0,041) und die auf eine Stelle gerundete Antwort ab. Vorher stand im
          // Lösungsweg „1000 · 0,4493 ≈ 449,33“, und wer 449,3 tippte, lag außerhalb der 0,02.
          check: numCheck(res, 0.06), testAnswer: String(rund), answerText: fmt(rund),
          solution: `t einsetzen und ausrechnen:<br>` +
            `Exponent: −${fmt(lam)} · ${fmt(t)} = ${fmt(-lam * t)}<br>` +
            `N(${fmt(t)}) = ${fmt(N0)} · e<sup>${fmt(-lam * t)}</sup> ≈ ${fmt(N0)} · ${fmt(Math.round(Math.exp(-lam * t) * 1e6) / 1e6)} ≈ <strong>${fmt(rund)}</strong><br>` +
            `<em>Plausibel:</em> Der Exponent ist negativ, also ist e<sup>…</sup> kleiner als 1 – es muss weniger als ${fmt(N0)} herauskommen ✓`
        };
      }

      if (kind === 'halbwert') {
        const lam = choice([0.1, 0.2, 0.25, 0.5, 0.05]);
        const res = Math.log(2) / lam;
        const rund = Math.round(res * 100) / 100;
        return {
          q: `Ein Stoff zerfällt nach N(t) = N<sub>0</sub> · e<sup>−${fmt(lam)}t</sup> (t in Jahren). Nach welcher Zeit ist die Hälfte übrig? <span class="hint">Auf 2 Dezimalstellen.</span>`,
          type: 'input', placeholder: 'Halbwertszeit',
          check: numCheck(res, 0.02), testAnswer: String(rund), answerText: `${fmt(rund)} Jahre`,
          solution: `„Die Hälfte übrig“ heißt N(t) = 0,5 · N<sub>0</sub>. Das N<sub>0</sub> kürzt sich heraus – die Halbwertszeit hängt nicht von der Startmenge ab:<br>` +
            `0,5 = e<sup>−${fmt(lam)}t</sup>&nbsp;| ln<br>` +
            `ln(0,5) = −${fmt(lam)} · t&nbsp;| : ${par(-lam)}<br>` +
            `t = ln(0,5) ⁄ ${par(-lam)} = ln(2) ⁄ ${fmt(lam)} ≈ <strong>${fmt(rund)} Jahre</strong><br>` +
            `<em>Warum ln(2):</em> ln(0,5) = ln(1/2) = −ln(2). Die beiden Minuszeichen heben sich auf.`
        };
      }

      // produkt: Produktregel zusammen mit der e-Funktion
      const a3 = rndNonZero(-4, 5);
      const res3 = a3;               // f(x) = a·x·e^x → f′(x) = a·e^x·(1 + x); bei x = 0: a
      /* Die Zeile mit der Regel und den eingesetzten Teilen steht da wie im
         Seitenbeispiel „Wenn x auch vor dem e steht“ („u′ · v + u · v′ =
         6 · e^x + 6x · e^x"). Ohne sie war bei negativem Faktor nicht zu sehen,
         woher das Minus vor dem zweiten Summanden kommt. Negative Teile stehen
         beim Einsetzen in Klammern; bei a = ±1 fällt der Faktor 1 weg. */
      const uTerm = koef(a3, 'x');
      const eX = 'e<sup>x</sup>';
      const uKlammer = a3 < 0 ? `(${uTerm})` : uTerm;
      const eingesetzt = Math.abs(a3) === 1
        ? `${koef(a3, eX)} + ${uKlammer} · ${eX}`
        : `${par(a3)} · ${eX} + ${uKlammer} · ${eX}`;
      const zusammen = `${koef(a3, eX)} ${a3 < 0 ? '−' : '+'} ${koef(Math.abs(a3), 'x')} · ${eX}`;
      return {
        q: `Gegeben ist f(x) = ${uTerm} · e<sup>x</sup>. Berechne f′(0).`,
        type: 'input', placeholder: 'f′(0)',
        check: numCheck(res3), testAnswer: String(res3), answerText: `f′(0) = ${fmt(res3)}`,
        solution: `Hier stehen zwei Funktionen im Produkt – also die Produktregel:<br>` +
          `u = ${uTerm} mit u′ = ${fmt(a3)}&ensp;<span class="trenn">•</span>&ensp;v = ${eX} mit v′ = ${eX}<br>` +
          `f′(x) = u′ · v + u · v′ = ${eingesetzt}${a3 < 0 ? ` = ${zusammen}` : ''} = ${koef(a3, eX)} · (1 + x)<br>` +
          `An der Stelle 0: e<sup>0</sup> = 1 und die Klammer wird 1 + 0 = 1<br>` +
          `f′(0) = ${Math.abs(a3) === 1 ? `${a3 < 0 ? '−' : ''}1 · 1` : `${fmt(a3)} · 1 · 1`} = <strong>${fmt(res3)}</strong><br>` +
          `<em>Der zweite Summand u · v′ gehört zu f′(x)</em> – nur an der Stelle 0 ist er null, weil u = ${uTerm} dort 0 ist. ` +
          `Wer ${uTerm} wie einen Vorfaktor behandelt, erhält f′(x) = ${uTerm} · ${eX} und damit fälschlich f′(0) = 0.`
      };
    }
  };


  /* ---------- Kurvendiskussion ---------- */

  const kurvendiskussion = {
    id: 'kurvendiskussion',
    icon: 'f″',
    title: 'Kurvendiskussion',
    tagline: 'Monotonie, Krümmung und Wendepunkte',
    learn: `
      <h2>Kurvendiskussion mit der zweiten Ableitung</h2>
      <p>f′ sagt, ob der Graph steigt oder fällt. f″ sagt, ob er nach oben oder nach unten
      gekrümmt ist – und erst damit lässt sich ein Hochpunkt von einem Tiefpunkt unterscheiden.</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">f′(x₀) = 0 und f″(x₀) &lt; 0 → Hochpunkt</span></p>
        <p><span class="formula">f′(x₀) = 0 und f″(x₀) &gt; 0 → Tiefpunkt</span></p>
        <p><span class="formula">f″(x₀) = 0 und Vorzeichenwechsel → Wendepunkt</span></p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>f(x) = x³ − 3x → f′(x) = 3x² − 3, f″(x) = 6x<br>
        f′ = 0 bei x = ±1; f″(1) = 6 &gt; 0 → Tiefpunkt, f″(−1) = −6 &lt; 0 → Hochpunkt.</p>
      </div>
    `,
    gen(diff) {
      /* Alle Aufgaben bauen auf f(x) = x³ + px² + qx auf. Konstruiert wird über die
         beiden Extremstellen r und s: f′(x) = 3(x − r)(x − s) = 3x² − 3(r+s)x + 3rs.
         Damit p und q ganzzahlig bleiben, muss r + s gerade sein. */
      function bauen() {
        let r, sZ;
        do {
          r = rndNonZero(-5, 5); sZ = rndNonZero(-5, 5);
        } while (r === sZ || (r + sZ) % 2 !== 0);
        const p = -1.5 * (r + sZ), q = 3 * r * sZ;
        return { r: Math.min(r, sZ), s: Math.max(r, sZ), p, q, wende: (r + sZ) / 2 };
      }
      /* Summand mit Vorzeichen, der bei 0 ganz entfällt – sonst stand dort
         „x³ + 0x² − 12x“, wenn die beiden Extremstellen symmetrisch liegen. */
      // Ohne Variable die nackte Zahl: koef(1, '') gäbe „“ und damit „x² − = 0“
      const term = (k, v) => k === 0 ? '' : ` ${k > 0 ? '+' : '−'} ${v ? koef(Math.abs(k), v) : fmt(Math.abs(k))}`;
      const kubTerm = (p, q) => `x³${term(p, 'x²')}${term(q, 'x')}`;
      /* Die pq-Formel so vorgerechnet wie im Seitenbeispiel „Extremstellen mit
         der pq-Formel": −p/2, Radikand, Wurzel, ±. Vorher hieß es nur „pq-Formel
         mit p = −6 und q = 5:" und direkt danach das Ergebnis – wer sich
         verrechnet hatte, fand die Stelle nicht. Nach dem Teilen durch 3 lautet
         f′ = 0 hier x² − (r+s)x + rs = 0, also −p/2 = (r+s)/2 und der Radikand
         ((s−r)/2)². Weil r + s gerade ist (bauen()), geht beides ganzzahlig
         auf. Verlangt r < s. */
      const pqZeilen = (r, s) => {
        const pp = -(r + s), qq = r * s, mitte = (r + s) / 2, w = (s - r) / 2;
        return `pq-Formel mit p = ${fmt(pp)} und q = ${fmt(qq)}: −p/2 = ${fmt(mitte)} und ` +
          `(p/2)² − q = ${fmt(mitte * mitte)} ${qq < 0 ? '+' : '−'} ${fmt(Math.abs(qq))} = ${fmt(w * w)}<br>` +
          `x₁,₂ = ${fmt(mitte)} ± √${fmt(w * w)} = ${fmt(mitte)} ± ${fmt(w)} → x₁ = ${fmt(r)}, x₂ = ${fmt(s)}`;
      };
      /* Gründe für die vier Punktarten, in der Reihenfolge Hoch, Tief, Wende,
         nichts. Jede falsche Option nennt die Bedingung ihres Merkkasten-Falls,
         die an dieser Stelle verletzt ist – welche das ist, hängt nur am Fall,
         nie an den Zahlen. Nur für Stufe 1: Dort stehen f′(x₀) und f″(x₀) schon
         in der Frage, der Grund verrät also kein Zwischenergebnis. */
      const artGruende = (fall, stelle) => {
        const waagerecht = fall === 'hoch' || fall === 'tief';   // f′ = 0 an der Stelle
        return [
          waagerecht ? `Für einen Hochpunkt müsste f″(${stelle}) negativ sein.` : `Für einen Hochpunkt müsste f′(${stelle}) = 0 sein.`,
          waagerecht ? `Für einen Tiefpunkt müsste f″(${stelle}) positiv sein.` : `Für einen Tiefpunkt müsste f′(${stelle}) = 0 sein.`,
          `Für einen Wendepunkt müsste f″(${stelle}) = 0 sein.`,
          `Diese Antwort übersieht, was f${waagerecht ? '′' : '″'}(${stelle}) = 0 bedeutet.`
        ];
      };
      /* Stufe 2 rechnet f′ und f″ an der Stelle erst aus. Ein Grund, der sagt,
         WELCHE Bedingung verletzt ist, lieferte das Zwischenergebnis mit (ob
         f′ dort null ist). Deshalb hier nur die Bedingung des gewählten Falls,
         im Wortlaut des Merkkastens – unabhängig vom Fall der Aufgabe. */
      const artBedingung = stelle => [
        `Ein Hochpunkt verlangt f′(${stelle}) = 0 und f″(${stelle}) &lt; 0.`,
        `Ein Tiefpunkt verlangt f′(${stelle}) = 0 und f″(${stelle}) &gt; 0.`,
        `Ein Wendepunkt verlangt f″(${stelle}) = 0 mit Vorzeichenwechsel von f″.`,
        `Kein besonderer Punkt heißt: weder f′(${stelle}) noch f″(${stelle}) ist 0.`
      ];

      /* ---------- Stufe 1: f″ bilden und aus f′, f″ die Art des Punktes lesen ---------- */
      if (diff === 1) {
        const kind = choice(['zweiteAbleitung', 'artBestimmen']);

        if (kind === 'zweiteAbleitung') {
          const a = rnd(1, 4), b = rndNonZero(-6, 6), x0 = rndNonZero(-3, 4);
          // f(x) = a·x³ + b·x²  →  f′ = 3a·x² + 2b·x  →  f″ = 6a·x + 2b
          const res = 6 * a * x0 + 2 * b;
          return {
            q: `Gegeben ist f(x) = ${koef(a, 'x³')} ${b > 0 ? '+' : '−'} ${koef(Math.abs(b), 'x²')}. Berechne f″(${fmt(x0)}).`,
            type: 'input', placeholder: 'f″(' + fmt(x0) + ')',
            check: numCheck(res), testAnswer: String(res), answerText: `f″(${fmt(x0)}) = ${fmt(res)}`,
            solution: `f″ ist die Ableitung von f′ – also zweimal hintereinander die Potenzregel:<br>` +
              `f′(x) = ${koef(3 * a, 'x²')} ${b > 0 ? '+' : '−'} ${koef(Math.abs(2 * b), 'x')}<br>` +
              `f″(x) = ${koef(6 * a, 'x')} ${b > 0 ? '+' : '−'} ${fmt(Math.abs(2 * b))}<br>` +
              `Einsetzen: f″(${fmt(x0)}) = ${fmt(6 * a)} · ${par(x0)} ${b > 0 ? '+' : '−'} ${fmt(Math.abs(2 * b))} = <strong>${fmt(res)}</strong><br>` +
              `<em>Nicht f abkürzen:</em> f″ entsteht aus f′, nicht aus f. Wer f direkt zweimal „vereinfacht“, verliert den Faktor 3 aus der ersten Ableitung.`
          };
        }

        /* artBestimmen: Was f′ und f″ an einer Stelle verraten. Vier Fälle, jeder
           gleich oft. Vorher galt immer f′(x₀) = 0, die Antwort war also stets
           Hoch- oder Tiefpunkt – wer blind „Tiefpunkt“ tippte, traf 50 % statt 25 %,
           und „Wendepunkt“ wie „kein besonderer Punkt“ waren Ablenker, die nie
           richtig sein konnten. Damit f″(x₀) = 0 wirklich einen Wendepunkt bedeutet,
           ist f eine Funktion dritten Grades: Dann ist f″ eine Gerade und wechselt an
           ihrer Nullstelle sicher das Vorzeichen (so steht es im Selbstcheck der
           Erklärseite). Der Sattelpunkt (f′ = 0 und f″ = 0) bleibt außen vor – die
           Erklärseite führt ihn nicht ein. */
        const fall = choice(['hoch', 'tief', 'wende', 'nichts']);
        const w1 = fall === 'hoch' || fall === 'tief' ? 0 : rndNonZero(-6, 6);
        const w2 = fall === 'hoch' ? -rnd(1, 9) : fall === 'tief' ? rnd(1, 9) : fall === 'wende' ? 0 : rndNonZero(-9, 9);
        const richtig = { hoch: 'ein Hochpunkt', tief: 'ein Tiefpunkt', wende: 'ein Wendepunkt', nichts: 'kein besonderer Punkt' }[fall];
        const mc = makeChoice(richtig, ['ein Hochpunkt', 'ein Tiefpunkt', 'ein Wendepunkt', 'kein besonderer Punkt'], artGruende(fall, 'x₀'));
        const zeileF1 = w1 === 0
          ? `<strong>f′(x₀) = 0</strong>: waagerechte Tangente – hier kann ein Hoch- oder Tiefpunkt liegen.`
          : `<strong>f′(x₀) = ${fmt(w1)} ≠ 0</strong>: keine waagerechte Tangente, der Graph ${w1 > 0 ? 'steigt' : 'fällt'} hier – also weder Hoch- noch Tiefpunkt, egal, was f″ sagt.`;
        const zeileF2 = w2 === 0
          ? `<strong>f″(x₀) = 0</strong>: Bei einer Funktion dritten Grades ist f″ eine Gerade und wechselt an ihrer Nullstelle sicher das Vorzeichen – die Krümmung kippt hier.`
          : `<strong>f″(x₀) = ${fmt(w2)}</strong>, also ${w2 > 0 ? 'positiv → Linkskrümmung, der Graph ist wie eine Schale geöffnet' : 'negativ → Rechtskrümmung, wie ein Hügel'}.`;
        const schluss = {
          hoch: 'Waagerechte Tangente und Rechtskrümmung → <strong>ein Hochpunkt</strong>.',
          tief: 'Waagerechte Tangente und Linkskrümmung → <strong>ein Tiefpunkt</strong>.',
          wende: 'Kein Extrempunkt, aber die Krümmung kippt → <strong>ein Wendepunkt</strong>.',
          nichts: 'Keine waagerechte Tangente und kein Krümmungswechsel → <strong>kein besonderer Punkt</strong>, der Graph läuft hier einfach durch.'
        }[fall];
        return {
          q: `f ist eine Funktion dritten Grades. An der Stelle x₀ gilt f′(x₀) = ${fmt(w1)} und f″(x₀) = ${fmt(w2)}. Was liegt dort vor?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
          solution: `Zwei Fragen, in dieser Reihenfolge – erst f′, dann f″:<br>` +
            `${zeileF1}<br>${zeileF2}<br>${schluss}<br>` +
            `<em>Merkhilfe:</em> Ein trauriger Mund ist rechtsgekrümmt – f″ negativ, Hochpunkt. ` +
            `<em>Aber:</em> f″ allein entscheidet nichts. Ohne f′(x₀) = 0 gibt es keinen Hoch- oder Tiefpunkt, so negativ f″ auch sein mag.`
        };
      }

      /* ---------- Stufe 2: Extremstellen einer Funktion dritten Grades ---------- */
      if (diff === 2) {
        const kind = choice(['stellen', 'artAnStelle']);

        if (kind === 'stellen') {
          const { r, s, p, q } = bauen();
          /* Verfahren der Seite: f′ = 0 liefert nur KANDIDATEN (Schritt 2), erst
             f″ entscheidet (Schritt 3). Vorher begann der Weg mit „Extremstellen
             heißt f′(x) = 0" – genau die Gleichsetzung, gegen die die Seite ihren
             Aufbau stellt – und prüfte nur f′(x₁) = 0. Ohne x-Glied (p = 0)
             stellt die Seite um statt die pq-Formel mit p = 0 zu nehmen
             („da reichte Umstellen“). */
          const f1 = `3x²${term(2 * p, 'x')}${term(q, '')}`;
          const loesen = p === 0
            ? `f′(x) = ${f1} = 0 – kein x-Glied, Umstellen reicht:<br>` +
              `3x² = ${fmt(-q)}&nbsp;| : 3<br>` +
              `x² = ${fmt(-q / 3)} → x₁ = ${fmt(r)}, x₂ = ${fmt(s)}`
            : `f′(x) = ${f1} = 0. Durch 3 teilen: x²${term(2 * p / 3, 'x')}${term(q / 3, '')} = 0<br>` +
              pqZeilen(r, s);
          return {
            q: `Bestimme die Extremstellen von f(x) = ${kubTerm(p, q)}. <span class="hint">Beide x-Werte angeben, z. B. „−1; 3“.</span>`,
            type: 'input', placeholder: 'x₁; x₂',
            check: multiCheck([r, s]), testAnswer: `${r}; ${s}`,
            answerText: `x₁ = ${fmt(r)}, x₂ = ${fmt(s)}`,
            solution: `Kandidaten für Extremstellen: f′(x) = 0 setzen.<br>` +
              `${loesen}<br>` +
              `Prüfen mit f″(x) = ${koef(6, 'x')}${term(2 * p, '')}: ` +
              `f″(${fmt(r)}) = ${fmt(6 * r + 2 * p)} → negativ → Hochpunkt&ensp;<span class="trenn">•</span>&ensp;` +
              `f″(${fmt(s)}) = ${fmt(6 * s + 2 * p)} → positiv → Tiefpunkt<br>` +
              `Beide Kandidaten sind Extremstellen: x₁ = <strong>${fmt(r)}</strong>, x₂ = <strong>${fmt(s)}</strong>`
          };
        }

        /* artAnStelle: Was liegt an einer gegebenen Stelle vor?

           Drei Umbauten stecken darin, jeder gegen eine Stelle, an der man die
           Antwort ohne Rechnung sah.

           1 · Vorher wurde immer nach der LINKEN Extremstelle gefragt – und die
           ist bei x³ mit positivem Vorfaktor immer ein Hochpunkt: f″(r) =
           3(r − s) < 0. Die Antwort stand damit fest, ohne dass ratbar.js es
           meldete (eine Antwort, die nie wechselt, zählt dort nicht als
           „häufigste“). Deshalb vier Fälle statt zwei.

           2 · Die Stelle darf nichts verraten. Zieht man erst den Fall und dann
           eine passende Funktion, hängt die Antwort an der Stelle selbst: x = 0
           entstand nur als Wendestelle (gemessen 1202 von 1202 Ziehungen „ein
           Wendepunkt“); x = ±5 konnte umgekehrt nie eine sein – dafür müssten
           beide Extremstellen weiter außen liegen, als der Zahlenraum zulässt.
           Beides ist ohne jede Rechnung zu sehen. Jetzt entstehen erst die vier Stellen EINER
           Funktion, und danach wird gewürfelt, nach welcher gefragt wird: Damit
           ist jeder Fall bei jeder Funktion genau ein Viertel wert.

           3 · Der Vorfaktor von x³ wechselt das Vorzeichen. Sonst wäre die
           linke Extremstelle immer der Hochpunkt, und die Stelle links der Mitte
           verriete die Antwort. Bei −x³ ist f′ nach unten geöffnet: Dann liegt
           der Tiefpunkt links. Die Kriterien im Merkkasten gelten unverändert –
           sie fragen nur nach dem Vorzeichen von f″; die Erklärseite sagt den
           Vorzeichenwechsel im Abschnitt „Monotonie“ ausdrücklich dazu.

           Der frühere Ablenker „Sattelpunkt“ ist durch „kein besonderer Punkt“
           ersetzt: Den Sattelpunkt führt die Erklärseite nicht ein, er konnte
           also nie die Antwort sein. Die vierte Kategorie steht dafür jetzt im
           Merkkasten und im Selbstcheck der Erklärseite. */
        const vorfaktor = choice([1, -1]);
        const seite = choice([1, -1]);          // beide Extremstellen links oder rechts der Null
        /* Gleiches Vorzeichen für beide Stellen heißt: p ≠ 0 (die Wendestelle
           liegt nie sichtbar bei 0) und q ≠ 0. Übrig bleiben genau vier
           Vorzeichenbilder der Funktion – wenige genug, dass ratbar.js je Bild
           über 300 Ziehungen sammelt und nicht mangels Masse schweigt. */
        const paare = [];
        for (let u = 1; u <= 6; u++) for (let v = u + 2; v <= 6; v++) if ((u + v) % 2 === 0) paare.push([u, v]);
        const [uu, vv] = paare[rnd(0, paare.length - 1)];
        const r = seite > 0 ? uu : -vv, s = seite > 0 ? vv : -uu;
        const wende = (r + s) / 2, p = -1.5 * (r + s), q = 3 * r * s;
        /* Die gewöhnliche Stelle wird NICHT gleichverteilt gezogen, sondern
           viermal so oft auf einem der beiden mittleren Werte. Grund: Die
           Wendestelle liegt zwischen den Extremstellen, also häufig in der Mitte
           des Zahlenraums, eine Extremstelle häufig außen. Gleichverteilt wäre
           eine mittige Stelle zu 43 % die Wendestelle; mit dieser Gewichtung
           sind es 38 %, und an den Rändern (wo keine Wendestelle liegen kann)
           teilen sich Hoch-, Tief- und gewöhnlicher Punkt genau ein Drittel.
           Ganz auf 25 % lässt sich das nicht drücken: r < Wendestelle < s ist
           eine geometrische Tatsache, die äußersten Stellen sind nie die Mitte. */
        const gewichtet = [1, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 6];
        let ort;
        do { ort = seite * choice(gewichtet); } while (ort === r || ort === s || ort === wende);
        const x0 = choice([r, s, wende, ort]);
        const a2 = vorfaktor * p, a1 = vorfaktor * q;            // f(x) = ±x³ + a2·x² + a1·x
        const w1 = 3 * vorfaktor * x0 * x0 + 2 * a2 * x0 + a1;   // f′(x0): 0 genau an den Extremstellen
        const w2 = 6 * vorfaktor * x0 + 2 * a2;                  // f″(x0): 0 genau an der Wendestelle
        const fall = w1 !== 0 ? (w2 === 0 ? 'wende' : 'nichts') : (w2 < 0 ? 'hoch' : 'tief');
        const richtig = { hoch: 'ein Hochpunkt', tief: 'ein Tiefpunkt', wende: 'ein Wendepunkt', nichts: 'kein besonderer Punkt' }[fall];
        const mc2 = makeChoice(richtig, ['ein Hochpunkt', 'ein Tiefpunkt', 'ein Wendepunkt', 'kein besonderer Punkt'], artBedingung(fmt(x0)));
        const urteil = {
          hoch: 'f′ = 0 und f″ negativ → Rechtskrümmung an einer waagerechten Tangente → <strong>ein Hochpunkt</strong>.',
          tief: 'f′ = 0 und f″ positiv → Linkskrümmung an einer waagerechten Tangente → <strong>ein Tiefpunkt</strong>.',
          wende: 'f′ ≠ 0, also kein Extrempunkt. Aber f″ = 0 – und f″ ist eine Gerade, wechselt hier also das Vorzeichen: Die Krümmung kippt → <strong>ein Wendepunkt</strong>.',
          nichts: 'f′ ≠ 0, also keine waagerechte Tangente; f″ ≠ 0, also kein Krümmungswechsel → <strong>kein besonderer Punkt</strong>.'
        }[fall];
        return {
          q: `Untersuche den Graphen von f(x) = ${vorfaktor > 0 ? 'x³' : '−x³'}${term(a2, 'x²')}${term(a1, 'x')} an der Stelle x = ${fmt(x0)}. Was liegt dort vor?`,
          type: 'choice', options: mc2.options, correct: mc2.correct, gruende: mc2.gruende, answerText: richtig,
          solution: `Zwei Werte entscheiden: f′(${fmt(x0)}) sagt, ob die Tangente waagerecht ist, f″(${fmt(x0)}) sagt, wie der Graph gekrümmt ist.<br>` +
            `f′(x) = ${koef(3 * vorfaktor, 'x²')}${term(2 * a2, 'x')}${term(a1, '')}<br>` +
            `f″(x) = ${koef(6 * vorfaktor, 'x')}${term(2 * a2, '')}<br>` +
            `f′(${fmt(x0)}) = ${fmt(3 * vorfaktor)} · ${par(x0)}² ${a2 > 0 ? '+' : '−'} ${fmt(Math.abs(2 * a2))} · ${par(x0)}${term(a1, '')} = ${fmt(w1)}<br>` +
            `f″(${fmt(x0)}) = ${fmt(6 * vorfaktor)} · ${par(x0)}${term(2 * a2, '')} = ${fmt(w2)}<br>` +
            `${urteil}<br>` +
            `<em>Zur Kontrolle:</em> Die Extremstellen sind ${fmt(r)} und ${fmt(s)}, die Wendestelle liegt genau dazwischen bei ${fmt(wende)}. ` +
            `Wegen des ${vorfaktor > 0 ? 'positiven' : 'negativen'} Vorfaktors vor x³ liegt ${vorfaktor > 0 ? 'der Hochpunkt links und der Tiefpunkt rechts' : 'der Tiefpunkt links und der Hochpunkt rechts'}.`
        };
      }

      /* ---------- Stufe 3: Wendepunkt und Monotonie ---------- */
      const kind = choice(['wendestelle', 'wendepunkt', 'monotonie']);

      if (kind === 'monotonie') {
        /* Wo steigt – oder fällt – der Graph?

           Die am leichtesten zu ratende Aufgabe des Themas, und der Grund lag
           nicht an einzelnen Ablenkern, sondern am Bauprinzip: Die Optionen
           entstanden AUS der Lösung (die richtige Form plus Abwandlungen).
           Dann trägt jede Eigenschaft der Liste eine Spur zur Lösung – „längste
           Option“ traf 100 %, nach einem ersten Umbau (vier Optionen aus zwei
           Formen und zwei Zahlenpaaren) immer noch 50 %, weil die Form die
           Fragerichtung verriet und das Feld halbierte.

           Jetzt ist die Reihenfolge umgedreht: Erst entsteht die Liste der vier
           Kandidatenpaare, dann wird gewürfelt, welches davon das richtige ist,
           und erst daraus die Funktion gebaut. Weil die Liste die Lösung nicht
           kennt, kann kein Merkmal der Liste mit ihr zusammenhängen – Länge,
           Rang, Zahlenband, Symmetrie, Alphabet, „diese Zeichenkette war hier
           noch nie richtig“: alles liegt bei genau einem Viertel.

           Drei Bedingungen halten das dicht:
           · Alle vier Optionen haben DIESELBE Form. Mischt man zwei Formen, ist
             die Regel „nimm die Form, die zur Fragerichtung passt“ rechnerisch
             immer 50 % wert, ganz gleich, wie man mischt.
           · Beide Stellen haben dasselbe Vorzeichen und denselben Abstand –
             damit sind alle vier Optionen gleich lang und gleich gebaut.
           · Kein Paar ist spiegelbildlich (−c | c). Sonst fehlte der Funktion
             das x²-Glied, und diese eine Bauform der Frage verriete das Paar. */
        const vorzeichen = choice([1, -1]);
        const abstand = choice([2, 4]);
        const paare = [];
        for (let m = 1; m + abstand <= 8; m++)
          paare.push(vorzeichen > 0 ? [m, m + abstand] : [-(m + abstand), -m]);
        const auswahl = [];
        while (auswahl.length < 4) {
          const kand = paare[rnd(0, paare.length - 1)];
          if (!auswahl.some(x => x[0] === kand[0])) auswahl.push(kand);
        }
        const treffer = auswahl[rnd(0, 3)];
        const [rM, sM] = treffer;
        const pM = -1.5 * (rM + sM), qM = 3 * rM * sM, mitte = (rM + sM) / 2;
        const steigt = choice([true, false]);
        // Die Fragerichtung bestimmt die Form ALLER Optionen, nicht nur der richtigen.
        const bereich = ([u, v]) => steigt
          ? `für x &lt; ${fmt(u)} und x &gt; ${fmt(v)}`
          : `für ${fmt(u)} &lt; x &lt; ${fmt(v)}`;
        const richtigM = bereich(treffer);
        /* Die vier Paare sind verschieden, die Optionen können also nicht
           zusammenfallen – eine Reserve anderer Bauform brächte das Längenmuster
           zurück. Jeder Ablenker ist zudem sicher falsch: Ein Bereich gleicher
           Breite, um mindestens 1 verschoben, enthält immer eine Stelle, an der
           der Graph in die andere Richtung läuft. */
        const mcM = makeChoice(richtigM, auswahl.filter(x => x !== treffer).map(bereich));
        const klammer = k => `(x ${k < 0 ? '+' : '−'} ${fmt(Math.abs(k))})`;
        const probe = 3 * mitte * mitte + 2 * pM * mitte + qM;
        return {
          q: `Für welche x ${steigt ? 'steigt' : 'fällt'} der Graph von f(x) = ${kubTerm(pM, qM)}?`,
          type: 'choice', options: mcM.options, correct: mcM.correct, answerText: richtigM,
          // Die Nullstellen von f′ werden bestimmt, nicht gesetzt: Die Seite
          // zerlegt nur 3x² − 3 ohne Rechnung und schickt f′ mit x-Glied über die
          // pq-Formel. Vorher stand die Zerlegung in Linearfaktoren ohne Herkunft da.
          solution: `Der Graph steigt, wo f′(x) &gt; 0 ist, und fällt, wo f′(x) &lt; 0 ist.<br>` +
            `Nullstellen von f′: f′(x) = 3x²${term(2 * pM, 'x')}${term(qM, '')} = 0. Durch 3 teilen: x²${term(2 * pM / 3, 'x')}${term(qM / 3, '')} = 0<br>` +
            `${pqZeilen(rM, sM)}<br>` +
            `Damit ist f′(x) = 3 · ${klammer(rM)} · ${klammer(sM)}, eine nach oben geöffnete Parabel – außerhalb ihrer Nullstellen positiv, dazwischen negativ:<br>` +
            `f′ &gt; 0 für x &lt; ${fmt(rM)} und x &gt; ${fmt(sM)}&ensp;<span class="trenn">•</span>&ensp;f′ &lt; 0 für ${fmt(rM)} &lt; x &lt; ${fmt(sM)}<br>` +
            `Der Graph ${steigt ? 'steigt' : 'fällt'} also <strong>${richtigM}</strong>.<br>` +
            `<em>Anschaulich:</em> Zwischen Hoch- und Tiefpunkt geht es bergab – überall sonst bergauf.<br>` +
            `<em>Probe mit einer Zahl:</em> Genau zwischen den beiden Stellen, bei x = ${fmt(mitte)}, ist ` +
            `f′(${fmt(mitte)}) = 3 · ${par(mitte)}² ${pM > 0 ? '+' : '−'} ${fmt(Math.abs(2 * pM))} · ${par(mitte)}${term(qM, '')} = ${fmt(probe)} – negativ. Dort fällt der Graph also wirklich, außerhalb steigt er.`
        };
      }

      let { r, s, p, q, wende } = bauen();

      if (kind === 'wendepunkt') {
        /* Liegen die Extremstellen symmetrisch, ist der Wendepunkt (0 | 0) und die
           ganze Rechnung lautet „0 − 0 = 0“ – die Aufgabe fragt dann nichts mehr. */
        let versuche = 0;
        while (wende === 0 && versuche++ < 12) ({ r, s, p, q, wende } = bauen());
        const y = wende ** 3 + p * wende ** 2 + q * wende;
        return {
          q: `Die Funktion f(x) = ${kubTerm(p, q)} hat bei x = ${fmt(wende)} eine Wendestelle. Welchen y-Wert hat der Wendepunkt?`,
          type: 'input', placeholder: 'y',
          check: numCheck(y, 0.006), testAnswer: String(Math.round(y * 100) / 100), answerText: `y = ${fmt(Math.round(y * 100) / 100)}`,
          solution: `Die Wendestelle in die <strong>Ausgangsfunktion</strong> einsetzen – nicht in f′ oder f″:<br>` +
            `f(${fmt(wende)}) = ${par(wende)}³${p === 0 ? '' : ` ${p > 0 ? '+' : '−'} ${fmt(Math.abs(p))} · ${par(wende)}²`}${q === 0 ? '' : ` ${q > 0 ? '+' : '−'} ${fmt(Math.abs(q))} · ${par(wende)}`}<br>` +
            `= ${fmt(Math.round(wende ** 3 * 100) / 100)}${p === 0 ? '' : ` ${p * wende ** 2 < 0 ? '−' : '+'} ${fmt(Math.abs(Math.round(p * wende ** 2 * 100) / 100))}`}${q === 0 ? '' : ` ${q * wende < 0 ? '−' : '+'} ${fmt(Math.abs(Math.round(q * wende * 100) / 100))}`}<br>` +
            `= <strong>${fmt(Math.round(y * 100) / 100)}</strong><br>` +
            `Der Wendepunkt lautet also W(${fmt(wende)} | ${fmt(Math.round(y * 100) / 100)}).<br>` +
            `<em>Häufiger Fehler:</em> f″(${fmt(wende)}) einsetzen. Das ergibt 0 – das war ja gerade die Bedingung, nicht das Ergebnis.`
        };
      }

      // wendestelle
      return {
        q: `Bestimme die Wendestelle von f(x) = ${kubTerm(p, q)}.`,
        type: 'input', placeholder: 'x',
        check: numCheck(wende), testAnswer: String(wende), answerText: `x = ${fmt(wende)}`,
        solution: `Für den Wendepunkt wird f″ null gesetzt:<br>` +
          `f′(x) = 3x²${term(2 * p, 'x')}${term(q, '')}<br>` +
          `f″(x) = ${koef(6, 'x')}${term(2 * p, '')}<br>` +
          // Bei p = 0 ist f″(x) = 6x: dann direkt „6x = 0 | : 6“, wie auf der Seite
          // („6x = 0 → x = 0“). Vorher stand „6x = 0“ zweimal untereinander, dazwischen
          // ein Hinweis auf einen Summanden, den diese Aufgabe nie gezeigt hat.
          (p === 0 ? '' : `${koef(6, 'x')}${term(2 * p, '')} = 0&nbsp;| ${p > 0 ? '−' : '+'} ${fmt(Math.abs(2 * p))}<br>`) +
          `${koef(6, 'x')} = ${fmt(-2 * p)}&nbsp;| : 6<br>` +
          `x = <strong>${fmt(wende)}</strong><br>` +
          `f″ ist hier eine Gerade und wechselt an dieser Stelle das Vorzeichen – die Krümmung kippt also wirklich um.<br>` +
          `<em>Schöne Kontrolle:</em> Die Wendestelle liegt bei einer Funktion dritten Grades immer genau in der Mitte zwischen den beiden Extremstellen ${fmt(r)} und ${fmt(s)}.`
      };
    }
  };


  return [wachstum, logarithmen, efunktion, ableitungen, ableitungsregeln, kurvendiskussion, integrale];
})();
