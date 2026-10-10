/* ============================================================
   MatheNils – Uni-Themen: Stochastik für Lehramtsstudierende
   Kombinatorik · Bedingte Wahrscheinlichkeit & Bayes ·
   Zufallsvariablen & Erwartungswert · Binomialverteilung
   ============================================================ */
'use strict';

const TOPICS_UNI_NEU = (() => {
  const { rnd, choice, fmt, frac, numCheck, probCheck } = Util;
  const { reduce, fracHTML, makeChoice, par, koef, plural, beispielBruch, beispielZahl } = TopicUtils;

  /** n! */
  function fact(n) {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }

  /** Binomialkoeffizient "n über k". */
  function binom(n, k) {
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }

  /**
   * Rechenweg zu „n über k“ so, wie ihn die Erklärseite vormacht: oben k
   * Faktoren absteigend ab n, unten k! – „(10 über 3) = 10 · 9 · 8 ⁄ (3 · 2 · 1)
   * = 720 ⁄ 6 = 120". Vorher stand hier n! ⁄ (k! · (n−k)!) und gleich danach
   * das Ergebnis: genau die Fakultätenform, von der Schritt 5 der Seite abrät,
   * und ohne einen Zwischenwert, an dem man den eigenen Rechenweg prüfen kann.
   */
  function binomWeg(n, k) {
    const oben = Array.from({ length: k }, (_, i) => n - i);
    const unten = Array.from({ length: k }, (_, i) => k - i);
    const produkt = oben.reduce((p, f) => p * f, 1);
    return `(${fmt(n)} über ${fmt(k)}) = ${frac(oben.map(f => fmt(f)).join(' · '), unten.map(f => fmt(f)).join(' · '))}` +
      ` = ${frac(fmt(produkt), fmt(fact(k)))} = ${fmt(binom(n, k))}`;
  }

  /**
   * Kürzen VOR dem Ausmultiplizieren – der Rechentipp der Seite („Oben k
   * Faktoren absteigend, unten k! – das kürzt sich meist schön") für die
   * großen Koeffizienten der Stufe 3. Bei (10 über 5) erspart das die
   * Division 30240 ⁄ 120, die binomWeg zeigen würde.
   *
   * Jeder Faktor unten (außer der 1) wird einem Faktor oben zugeordnet, den
   * er teilt; mehrere Faktoren unten dürfen sich einen oben teilen
   * („12 : (4 · 3) = 1“). Die Zuordnung hängt davon ab, von welcher Seite man
   * die Faktoren oben durchgeht – beide Richtungen werden versucht, die mit
   * weniger Kürzungsschritten gewinnt: (11 über 4) wird so zu
   * „8 : (4 · 2) = 1 und 9 : 3 = 3“ statt zu drei Einzelschritten.
   * Kürzt sich unten nicht alles weg, liefert die Funktion null.
   */
  function binomKuerzen(n, k) {
    const oben = Array.from({ length: k }, (_, i) => n - i);
    const versuch = reihenfolge => {
      const rest = oben.slice();
      let unten = Array.from({ length: k - 1 }, (_, i) => k - i);   // k, …, 2
      const schritte = [];
      for (const i of reihenfolge) {
        const teiler = [];
        for (const d of unten) if (rest[i] % d === 0) { rest[i] /= d; teiler.push(d); }
        if (!teiler.length) continue;
        unten = unten.filter(d => !teiler.includes(d));
        const durch = teiler.length > 1 ? `(${teiler.map(d => fmt(d)).join(' · ')})` : fmt(teiler[0]);
        schritte.push(`${fmt(oben[i])} : ${durch} = ${fmt(rest[i])}`);
      }
      return unten.length ? null : { schritte, rest: rest.filter(f => f !== 1) };
    };
    const vorwaerts = versuch(oben.map((_, i) => i));
    const rueckwaerts = versuch(oben.map((_, i) => k - 1 - i));
    const w = !vorwaerts ? rueckwaerts
      : !rueckwaerts ? vorwaerts
      : rueckwaerts.schritte.length < vorwaerts.schritte.length ? rueckwaerts : vorwaerts;
    if (!w) return null;
    const s = w.schritte;
    const liste = s.length === 1 ? s[0] : `${s.slice(0, -1).join(', ')} und ${s[s.length - 1]}`;
    // Bleibt nur ein Faktor übrig, IST er das Ergebnis – kein „= 105 = 105“.
    const bleibt = w.rest.length > 1 ? `${w.rest.map(f => fmt(f)).join(' · ')} = ` : '';
    return `(${fmt(n)} über ${fmt(k)}) = ${frac(oben.map(f => fmt(f)).join(' · '), Array.from({ length: k }, (_, i) => fmt(k - i)).join(' · '))}<br>` +
      `Vor dem Ausmultiplizieren kürzen: ${liste}<br>` +
      `Übrig bleibt ${bleibt}${fmt(binom(n, k))}`;
  }

  /**
   * Wahrscheinlichkeit anzeigen: gekürzter Bruch plus Dezimalzahl.
   * Das Näherungszeichen stand früher bedingungslos da – auch bei „3/4 ≈ 0,75“,
   * wo die Division aufgeht. Wer daraus lernt, 3/4 sei nur ungefähr 0,75, lernt
   * etwas Falsches. Deshalb entscheidet der Vergleich mit dem ungerundeten Wert.
   */
  function probText(num, den) {
    const [rn, rd] = reduce(num, den);
    const wert = Math.round(num / den * 1000) / 1000;
    return `${fracHTML(rn, rd)} ${wert === num / den ? '=' : '≈'} ${fmt(wert)}`;
  }

  /**
   * Wie probText, zeigt aber den Kürzungsschritt nur, wenn wirklich gekürzt
   * wird – sonst stand in der Lösung „15/56 = 15/56 ≈ 0,268“.
   */
  function probSchritt(num, den) {
    const [rn, rd] = reduce(num, den);
    return (rn === num && rd === den) ? probText(num, den) : `${frac(num, den)} = ${probText(num, den)}`;
  }

  /* ---------- Kombinatorik ---------- */

  const kombinatorik = {
    id: 'kombinatorik',
    icon: 'n!',
    title: 'Kombinatorik',
    tagline: 'Zählen mit Fakultät und Binomialkoeffizient',
    learn: `
      <h2>Kombinatorik – die Kunst des geschickten Zählens</h2>
      <p>Grundlage ist die <strong>Produktregel</strong>: Gibt es für Schritt 1 genau m Möglichkeiten
      und für Schritt 2 genau n, dann insgesamt m · n.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Das Urnenmodell (<span class="mathe">k</span> aus <span class="mathe">n</span>)</span>
        <ul>
          <li><strong>Mit Reihenfolge, mit Zurücklegen:</strong> n<sup>k</sup></li>
          <li><strong>Mit Reihenfolge, ohne Zurücklegen:</strong> n · (n−1) · … · (n−k+1) = n!⁄(n−k)!</li>
          <li><strong>Ohne Reihenfolge, ohne Zurücklegen:</strong> <span class="formula">( n über k ) = n! ⁄ (k! · (n−k)!)</span></li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiele</span>
        <p>Alle Anordnungen von 5 Personen: 5! = 120<br>
        4-stellige PIN: 10⁴ = 10 000<br>
        3er-Team aus 10 Personen: (10 über 3) = 120</p>
      </div>
      <h3>Permutationen mit Wiederholung</h3>
      <p>Kommen Objekte mehrfach vor, teilt man durch die Fakultäten der Wiederholungen:
      Anordnungen von ANNA = 4! ⁄ (2! · 2!) = 6.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['fakultaet', 'produkt']);
        if (kind === 'fakultaet') {
          const n = rnd(3, 7);
          const res = fact(n);
          const kontexte = [`Auf wie viele Arten können ${n} Personen in einer Reihe stehen?`,
            `Auf wie viele Arten lassen sich ${n} verschiedene Bücher nebeneinander ins Regal stellen?`];
          return {
            q: choice(kontexte), type: 'input', placeholder: 'Anzahl',
            check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
            solution: `Für den ersten Platz gibt es ${n} Möglichkeiten, für den zweiten ${n - 1}, usw.<br>` +
              `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(' · ')} = ${fmt(res)}`
          };
        }
        const dreistufig = choice([true, false]);
        if (dreistufig) {
          // 6 · 3 · 2 steht als Beispiel auf der Erklärseite – nicht als Aufgabe
          let m, k, j;
          do { m = rnd(3, 6); k = rnd(2, 5); j = rnd(2, 4); } while (m === 6 && k === 3 && j === 2);
          return {
            q: `Eine Mensa bietet ${m} Vorspeisen, ${k} Hauptgerichte und ${j} Desserts an. Wie viele verschiedene Menüs sind möglich?`,
            type: 'input', placeholder: 'Anzahl',
            check: numCheck(m * k * j), testAnswer: String(m * k * j), answerText: `${m * k * j}`,
            solution: `Produktregel: ${m} · ${k} · ${j} = ${m * k * j}`
          };
        }
        /* Erst das Ergebnis, dann die Aufgabe dazu. Wurden Hosen (3–6) und
           T-Shirts (2–5) unabhängig gezogen, häuften sich Zahlen mit vielen
           Zerlegungen: 12 = 3 · 4 = 4 · 3 = 6 · 2 war in 18,6 % der Ziehungen
           die Antwort, dreimal so oft wie 6, 9 oder 25. Jetzt ist jedes der
           zwölf möglichen Ergebnisse gleich wahrscheinlich, und erst danach
           wird eine Zerlegung in Hosen und T-Shirts gewählt. */
        const zerlegungen = new Map();
        for (let h = 3; h <= 6; h++) {
          for (let s = 2; s <= 5; s++) {
            // 3 Hosen und 2 Shirts rechnet die Erklärseite samt Figur vor – als
            // Aufgabe wäre das Abschreiben (CLAUDE.md: Beispiele tragen keine
            // Zahlen des Generators). Damit entfällt das Ergebnis 6 ganz.
            if (h === 3 && s === 2) continue;
            if (!zerlegungen.has(h * s)) zerlegungen.set(h * s, []);
            zerlegungen.get(h * s).push([h, s]);
          }
        }
        const [hosen, shirts] = choice(choice([...zerlegungen.values()]));
        const outfits = hosen * shirts;
        return {
          q: `Im Schrank liegen ${fmt(hosen)} Hosen und ${fmt(shirts)} T-Shirts. Wie viele verschiedene Outfits sind möglich?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(outfits), testAnswer: String(outfits), answerText: fmt(outfits),
          solution: `Produktregel: Zu jeder der ${fmt(hosen)} Hosen passen ${fmt(shirts)} T-Shirts: ${fmt(hosen)} · ${fmt(shirts)} = ${fmt(outfits)}`
        };
      }
      if (diff === 2) {
        const kind = choice(['binomKlein', 'variation']);
        if (kind === 'binomKlein') {
          const n = rnd(5, 10), k = rnd(2, Math.min(4, n - 1));
          const res = binom(n, k);
          return {
            q: `Aus ${n} Studierenden soll eine ${k}er-Gruppe gebildet werden (die Reihenfolge spielt keine Rolle). Wie viele Möglichkeiten gibt es?`,
            type: 'input', placeholder: 'Anzahl',
            check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
            solution: `Ohne Reihenfolge, ohne Zurücklegen → Binomialkoeffizient.<br>` +
              `Oben ${fmt(k)} Faktoren absteigend ab ${fmt(n)}, unten ${fmt(k)}!:<br>` +
              binomWeg(n, k)
          };
        }
        const n = rnd(4, 10);
        const res = n * (n - 1) * (n - 2);
        return {
          q: `Bei einem Wettlauf mit ${n} Teilnehmenden werden Gold, Silber und Bronze vergeben. Wie viele Podest-Besetzungen sind möglich?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
          solution: `Mit Reihenfolge, ohne Zurücklegen:<br>Gold: ${n} Möglichkeiten, Silber: ${n - 1}, Bronze: ${n - 2}.<br>${n} · ${n - 1} · ${n - 2} = ${fmt(res)}`
        };
      }
      const kind = choice(['zuruecklegen', 'wort', 'binomGross']);
      if (kind === 'zuruecklegen') {
        const variante = choice(['pin', 'code']);
        if (variante === 'pin') {
          const k = rnd(3, 5);
          const res = 10 ** k;
          return {
            q: `Wie viele verschiedene ${k}-stellige PINs gibt es (Ziffern 0–9, Wiederholung erlaubt)?`,
            type: 'input', placeholder: 'Anzahl',
            check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
            solution: `Mit Zurücklegen, mit Reihenfolge: n<sup>k</sup>-Regel.<br>10<sup>${k}</sup> = ${fmt(res)}`
          };
        }
        const n = rnd(2, 6), k = rnd(2, 4);
        const res = n ** k;
        return {
          q: `Aus ${n} verschiedenen Symbolen werden Codes der Länge ${k} gebildet (Wiederholung erlaubt). Wie viele Codes gibt es?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
          solution: `Für jede der ${k} Stellen gibt es ${n} Möglichkeiten:<br>${n}<sup>${k}</sup> = ${fmt(res)}`
        };
      }
      if (kind === 'wort') {
        /* In der Form des Seitenbeispiels ANNA: erst alle Anordnungen (n!),
           dann durch die Vertauschungen gleicher Buchstaben teilen – mit dem
           Zwischenschritt 24 ⁄ 4. Der Name „Permutation mit Wiederholung“, der
           hier früher stand, kommt auf der Erklärseite nicht vor.
           Spalten: Wort, Buchstabenzahl, Nenner als Term, sein Wert, Grund. */
        const woerter = [
          ['ANNA', 4, '2! · 2!', 4, 'A und N kommen je zweimal vor'],
          ['OTTO', 4, '2! · 2!', 4, 'O und T kommen je zweimal vor'],
          ['PIZZA', 5, '2!', 2, 'Z kommt zweimal vor'],
          ['KOKOS', 5, '2! · 2!', 4, 'K und O kommen je zweimal vor'],
          ['BANANE', 6, '2! · 2!', 4, 'A und N kommen je zweimal vor']
        ];
        const [wort, laenge, nenner, nennerWert, grund] = choice(woerter);
        const alle = fact(laenge);
        const res = alle / nennerWert;
        return {
          q: `Wie viele verschiedene Buchstaben-Anordnungen des Wortes ${wort} gibt es?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `${fmt(laenge)} Buchstaben ergäben ${fmt(laenge)}! = ${fmt(alle)} Anordnungen. ` +
            `Aber ${grund}, und gleiche Buchstaben zu vertauschen ändert nichts:<br>` +
            `${frac(`${fmt(laenge)}!`, nenner)} = ${frac(fmt(alle), fmt(nennerWert))} = ${fmt(res)}`
        };
      }
      /* Derselbe Binomialkoeffizient wie bei der Gruppen-Aufgabe der Stufe 2,
         aber mit dem Schritt, den Stufe 2 nicht braucht: Stufe 2 rechnet wie
         das Seitenbeispiel erst aus und teilt dann (720 ⁄ 6), Stufe 3 kürzt
         vor dem Ausmultiplizieren – bei (14 über 4) stünde sonst 24024 ⁄ 24
         da. Die Einleitung ist mit Stufe 2 wortgleich; der Unterschied liegt
         im Rechenweg, nicht in der Formulierung.
         Jedes Paar hat k ≥ 3, also mindestens zwei Faktoren unten, die weg
         müssen. (15 über 2) stand hier früher: 15 · 14 ⁄ 2 ist kleiner als
         (9 über 4) aus Stufe 2 und hätte „schwer“ nur dem Namen nach gemacht. */
      const paare = [[12, 3], [11, 4], [16, 3], [13, 3], [10, 5], [14, 4]];
      const [n, k] = choice(paare);
      const res = binom(n, k);
      return {
        q: `Beim Mini-Lotto werden ${k} aus ${n} Zahlen gezogen (ohne Zurücklegen, Reihenfolge egal). Wie viele Ziehungen sind möglich?`,
        type: 'input', placeholder: 'Anzahl',
        check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
        solution: `Ohne Reihenfolge, ohne Zurücklegen → Binomialkoeffizient.<br>` +
          `Oben ${fmt(k)} Faktoren absteigend ab ${fmt(n)}, unten ${fmt(k)}!:<br>` +
          (binomKuerzen(n, k) || binomWeg(n, k))
      };
    }
  };

  /* ---------- Bedingte Wahrscheinlichkeit & Bayes ---------- */

  const bedingte = {
    id: 'bedingte',
    icon: 'P(A|B)',
    title: 'Bedingte Wahrscheinlichkeit',
    tagline: 'Vierfeldertafel, Unabhängigkeit und Bayes',
    learn: `
      <h2>Bedingte Wahrscheinlichkeit</h2>
      <p>P(A|B) ist die Wahrscheinlichkeit von A, <strong>wenn man schon weiß</strong>, dass B
      eingetreten ist. Man rechnet nur noch innerhalb von B:</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">P(A|B) = P(A ∩ B) ⁄ P(B)</span></p>
        <p><strong>Unabhängigkeit:</strong> A und B sind stochastisch unabhängig, wenn
        P(A ∩ B) = P(A) · P(B).</p>
      </div>
      <h3>Satz von Bayes – mit natürlichen Häufigkeiten</h3>
      <p>Der Klausur-Klassiker (Krankheitstest) wird einfach, wenn man mit konkreten
      Anzahlen statt Prozenten denkt:</p>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>Von 1000 Personen sind 20 krank. Der Test erkennt 18 davon (positiv),
        schlägt aber auch bei 98 Gesunden an.<br>
        Positiv getestet sind also 18 + 98 = 116 Personen – davon wirklich krank: 18.<br>
        P(krank | positiv) = ${frac(18, 116)} ≈ 0,155 – überraschend klein!</p>
      </div>
      <p><em>Werkzeuge:</em> Vierfeldertafel und Baumdiagramm – beide führen zum Ziel.
      Die <strong>totale Wahrscheinlichkeit</strong> summiert über alle Pfade: P(D) = P(A)·P(D|A) + P(B)·P(D|B).</p>
    `,
    gen(diff) {
      if (diff === 1) {
        let b, p;
        for (let i = 0; i < 60; i++) {
          b = choice([20, 40, 50, 60, 80]);
          p = choice([10, 20, 25, 50, 75]);
          if ((b * p) % 100 === 0) break;
        }
        if ((b * p) % 100 !== 0) { b = 40; p = 25; }
        const a = b * p / 100;
        const bsp = beispielBruch(a, b);
        return {
          q: `Von 100 Jugendlichen treiben ${b} regelmäßig Sport, ${a} davon im Verein. Eine sporttreibende Person wird zufällig ausgewählt. Wie groß ist P(Verein | Sport)? <span class="hint">Als Bruch (z. B. ${bsp}) oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: probCheck(a, b), testAnswer: `${a}/${b}`,
          answerText: probText(a, b),
          solution: `Bedingung „Sport“ schränkt auf die ${b} Sportlichen ein:<br>P(Verein | Sport) = ${probSchritt(a, b)}`
        };
      }
      if (diff === 2) {
        const kind = choice(['vierfeld', 'unabh']);
        if (kind === 'vierfeld') {
          const a = rnd(2, 8) * 5, b = rnd(2, 8) * 5, c = rnd(2, 8) * 5, d = rnd(2, 8) * 5;
          const N = a + b + c + d;
          return {
            q: `Umfrage unter ${N} Personen: ${a} Frauen und ${c} Männer spielen ein Instrument, ${b} Frauen und ${d} Männer nicht. Eine zufällig gewählte Frau wird befragt. Wie groß ist P(Instrument | Frau)? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
            type: 'input', placeholder: `z. B. ${beispielBruch(a, a + b)}`,
            check: probCheck(a, a + b), testAnswer: `${a}/${a + b}`,
            answerText: probText(a, a + b),
            solution: `Vierfeldertafel: Es gibt ${a} + ${b} = ${a + b} Frauen, davon spielen ${a} ein Instrument.<br>` +
              `P(Instrument | Frau) = ${probSchritt(a, a + b)}`
          };
        }
        const x = choice([20, 30, 40, 50, 60]), y = choice([20, 30, 40, 50, 60]);
        const produkt = x * y / 100;
        const unabhaengig = choice([true, false]);
        let z = produkt;
        if (!unabhaengig) {
          const delta = choice([-4, -2, 2, 4, 6]);
          z = produkt + delta;
          if (z < 1 || z >= Math.min(x, y)) z = produkt + 2;
        }
        /* Nur „Nein“ bei unabhängigen Ereignissen trägt einen Grund. Er nennt die
           Bedingung (Wortlaut des Merkkastens) und die typische Fehlvorstellung,
           gemeinsames Eintreten mache abhängig – hier ist P(A ∩ B) immer
           mindestens 4 %. Er muss auch stimmen, wenn „Nein“ aus einem Rechenfehler
           kommt (0,3 · 0,4 = 1,2); deshalb steht die Bedingung vorn. Ein „Ja“ bei
           abhängigen Ereignissen hat keinen typischen Fehlerweg außer der
           Abweichung, die der Lösungsweg ohnehin nennt. */
        return {
          q: `Für zwei Ereignisse gilt: P(A) = ${x} %, P(B) = ${y} % und P(A ∩ B) = ${z} %. Sind A und B stochastisch unabhängig?`,
          type: 'choice', options: ['Ja', 'Nein'], correct: unabhaengig ? 0 : 1,
          gruende: unabhaengig
            ? [null, 'Unabhängig heißt: P(A ∩ B) = P(A) · P(B). Dass A und B zusammen eintreten können, macht sie nicht abhängig.']
            : [null, null],
          answerText: unabhaengig ? 'Ja' : 'Nein',
          solution: `Prüfe P(A) · P(B) = 0,${x < 10 ? '0' : ''}${x} · 0,${y < 10 ? '0' : ''}${y} = ${fmt(produkt / 100)} = ${produkt} %.<br>` +
            (unabhaengig
              ? `Das stimmt mit P(A ∩ B) = ${z} % überein → unabhängig.`
              : `P(A ∩ B) = ${z} % weicht davon ab → nicht unabhängig.`)
        };
      }
      const kind = choice(['bayes', 'totale']);
      if (kind === 'bayes') {
        const N = 1000;
        let k, sens, fpr, rp, fp;
        for (let i = 0; i < 80; i++) {
          k = choice([20, 50, 100, 200]);
          sens = choice([80, 90, 95]);
          fpr = choice([5, 10, 20]);
          rp = k * sens / 100;
          fp = (N - k) * fpr / 100;
          if (Number.isInteger(rp) && Number.isInteger(fp)) break;
        }
        if (!Number.isInteger(rp) || !Number.isInteger(fp)) { k = 100; sens = 90; fpr = 10; rp = 90; fp = 90; }
        // Der Platzhalter zeigt beide erlaubten Formen; die Dezimalzahl ist der
        // gerundete Wert desselben Beispielbruchs, damit beide zusammenpassen.
        const bsp = beispielBruch(rp, rp + fp);
        const [bspZ, bspN] = bsp.split('/').map(Number);
        return {
          q: `Eine Krankheit betrifft ${k} von ${N} Personen. Ein Test erkennt ${sens} % der Kranken, schlägt aber auch bei ${fpr} % der Gesunden fälschlich an. Eine Person wird positiv getestet. Mit welcher Wahrscheinlichkeit ist sie wirklich krank? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp} oder ${fmt(bspZ / bspN, 3)}`,
          check: probCheck(rp, rp + fp), testAnswer: `${rp}/${rp + fp}`,
          answerText: probText(rp, rp + fp),
          solution: `Mit natürlichen Häufigkeiten (Satz von Bayes):<br>` +
            `Krank: ${k} → davon positiv: ${sens} % = ${rp}.<br>` +
            `Gesund: ${N - k} → davon fälschlich positiv: ${fpr} % = ${fp}.<br>` +
            `Positiv insgesamt: ${rp} + ${fp} = ${rp + fp}.<br>` +
            `P(krank | positiv) = ${probSchritt(rp, rp + fp)}`
        };
      }
      let x, a1, a2, res;
      for (let i = 0; i < 80; i++) {
        x = choice([20, 30, 40, 50, 60, 80]);
        a1 = rnd(1, 10); a2 = rnd(1, 10);
        if (a1 !== a2 && (x * a1 + (100 - x) * a2) % 100 === 0) {
          res = (x * a1 + (100 - x) * a2) / 100;
          break;
        }
      }
      if (res === undefined) { x = 50; a1 = 4; a2 = 2; res = 3; }
      return {
        q: `Maschine A stellt ${x} % der Produktion her (Ausschussquote ${a1} %), Maschine B den Rest (Ausschussquote ${a2} %). Wie viel Prozent der Gesamtproduktion sind Ausschuss?`,
        type: 'input', placeholder: 'in %',
        check: numCheck(res, 1e-6, { prozent: true }), testAnswer: String(res), answerText: `${fmt(res)} %`,
        /* Wie das Maschinen-Beispiel der Seite: mit Dezimalzahlen multiplizieren,
           erst am Ende in Prozent. „20 % · 10 % = 2 %“ stand dort nirgends – und
           wer 20 · 10 = 200 rechnet, fand den Umrechnungsschritt im Weg nicht.
           Den Anteil von B nennt die Aufgabe nur als „Rest“; er wird deshalb
           ausgerechnet, bevor er in den Baum geht. */
        solution: `Maschine B stellt den Rest her: 100 % − ${fmt(x)} % = ${fmt(100 - x)} %.<br>` +
          `Totale Wahrscheinlichkeit – über beide Pfade des Baumdiagramms summieren, die Prozente als Dezimalzahlen:<br>` +
          `P(Ausschuss) = ${fmt(x / 100)} · ${fmt(a1 / 100)} + ${fmt((100 - x) / 100)} · ${fmt(a2 / 100)}` +
          ` = ${fmt(x * a1 / 10000)} + ${fmt((100 - x) * a2 / 10000)} = ${fmt(res / 100)} = ${fmt(res)} %`
      };
    }
  };

  /* ---------- Zufallsvariablen & Erwartungswert ---------- */

  /* Die Fairness-Aufgabe der Stufe 2 zieht ein Los aus einer Trommel: Preis
     eines Loses und Zahl der Lose werden gezogen, die Gewinnsumme ergibt sich
     daraus. Die Bereiche stehen als Konstanten, weil `losanzahlen` sie braucht.
     Sie sind so gewählt, dass keine der drei Zahlen der Aufgabe für sich
     genommen eine Antwort ausschließt (gemessen: 0,000 % der Ziehungen). */
  const LOS_PREIS = [3, 15];
  const LOS_ANZAHL = [5, 24];

  /**
   * Zulässige Losanzahlen zu einer erwarteten Auszahlung k (= z/n).
   *
   * In der Aufgabe stehen Preis, Losanzahl und Gewinnsumme; k steht dort
   * nicht, es muss gerechnet werden. Für die mittleren k gibt es zu jeder der
   * drei Antworten einen passenden Preis (k − 1, k, k + 1 liegen alle im
   * Preisbereich). Am Rand gilt das nicht: k = 2 entsteht nur aus dem
   * kleinsten Preis mit Verlust, k = 16 nur aus dem größten mit Gewinn.
   * Gehörte eine Gewinnsumme nur zu so einem Randwert, verriete sie die
   * Antwort, ohne dass jemand rechnet – dieselbe Fehlerfamilie wie „jeder
   * Großvokal ist achsensymmetrisch" bei `symmetrie`. Für Randwerte wird die
   * Losanzahl deshalb so gewählt, dass dieselbe Gewinnsumme auch aus einem
   * mittleren k entstehen kann; dann steht neben jeder Gewinnsumme mindestens
   * eine Ziehung mit anderer Antwort.
   */
  function losanzahlen(k) {
    const mitteVon = LOS_PREIS[0] + 1, mitteBis = LOS_PREIS[1] - 1;
    const alle = [];
    for (let n = LOS_ANZAHL[0]; n <= LOS_ANZAHL[1]; n++) alle.push(n);
    if (k >= mitteVon && k <= mitteBis) return alle;
    const passend = alle.filter(n => {
      const z = k * n;
      for (let m = LOS_ANZAHL[0]; m <= LOS_ANZAHL[1]; m++) {
        if (m === n) continue;
        const andere = z / m;
        if (Number.isInteger(andere) && andere >= mitteVon && andere <= mitteBis) return true;
      }
      return false;
    });
    // Bei den festen Bereichen oben bleibt nie eine leere Liste übrig; die
    // Rückfallebene steht da, damit ein späterer Bereichswechsel nicht abstürzt.
    return passend.length ? passend : alle;
  }

  const erwartungswert = {
    id: 'erwartungswert',
    icon: 'E(X)',
    title: 'Erwartungswert & Varianz',
    tagline: 'Zufallsvariablen, faire Spiele und Streuung',
    learn: `
      <h2>Zufallsvariablen, Erwartungswert und Varianz</h2>
      <p>Eine <strong>Zufallsvariable X</strong> ordnet jedem Ergebnis eine Zahl zu (z. B. den Gewinn
      eines Spiels). Der Erwartungswert ist ihr „Durchschnitt auf lange Sicht“:</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">E(X) = x₁ · p₁ + x₂ · p₂ + … + xₙ · pₙ</span></p>
        <p><span class="formula">Var(X) = E(X²) − (E(X))²</span>&nbsp;(Verschiebungssatz),&nbsp;σ = √Var(X)</p>
        <p>Linearität: E(aX + b) = a · E(X) + b</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: Ist das Spiel fair?</span>
        <p>Einsatz 2 €. Bei einer 6 gibt es 6 € zurück.<br>
        E(Gewinn) = 6 · ${frac(1, 6)} − 2 = 1 − 2 = <strong>−1 €</strong> pro Spiel → nicht fair
        (fair wäre E = 0).</p>
      </div>
      <p>Die <strong>Varianz</strong> misst die Streuung um den Erwartungswert – die
      Standardabweichung σ hat dieselbe Einheit wie X.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['rad', 'wuerfel']);
        if (kind === 'wuerfel') {
          return {
            q: `X sei die Augenzahl bei einem fairen Würfelwurf. Berechne den Erwartungswert E(X).`,
            type: 'input', placeholder: 'E(X)',
            check: numCheck(3.5), testAnswer: '3,5', answerText: '3,5',
            solution: `E(X) = (1 + 2 + 3 + 4 + 5 + 6) · ${frac(1, 6)} = 21/6 = 3,5`
          };
        }
        let w1, w2, w3, E;
        for (let i = 0; i < 60; i++) {
          w1 = rnd(0, 4); w2 = rnd(2, 8); w3 = rnd(4, 12);
          // Die drei Sektorwerte müssen verschieden sein: bei „je zu einem
          // Viertel 8 € und 8 €“ nimmt X diesen Wert in Wahrheit mit
          // Wahrscheinlichkeit ½ an – der Text beschriebe die Verteilung falsch.
          if (w1 === w2 || w1 === w3 || w2 === w3) continue;
          if ((2 * w1 + w2 + w3) % 4 === 0) { E = (2 * w1 + w2 + w3) / 4; break; }
        }
        if (E === undefined) { w1 = 1; w2 = 4; w3 = 6; E = 3; }
        return {
          q: `Ein Glücksrad zeigt zur Hälfte ${w1} €, je zu einem Viertel ${w2} € und ${w3} €. X sei die Auszahlung. Berechne E(X) in €.`,
          type: 'input', placeholder: 'E(X) in €',
          check: numCheck(E), testAnswer: String(E), answerText: `${fmt(E)} €`,
          solution: `E(X) = ${w1} · ${frac(1, 2)} + ${w2} · ${frac(1, 4)} + ${w3} · ${frac(1, 4)} = ${fmt(w1 / 2)} + ${fmt(w2 / 4)} + ${fmt(w3 / 4)} = ${fmt(E)} €`
        };
      }
      if (diff === 2) {
        const kind = choice(['gewinn', 'fair']);
        if (kind === 'gewinn') {
          // z = 3e ausgeschlossen: Dann wäre „Einsatz vergessen“ (z/6) genau −E, und die
          // Vorzeichen-Rückmeldung deutete den fehlenden Rechenschritt als Zeichenfehler.
          let e, z;
          do { e = rnd(1, 3); z = 6 * rnd(1, 3); } while (z === 3 * e);
          const E = z / 6 - e;
          return {
            q: `Ein Spiel kostet ${e} € Einsatz. Bei einer gewürfelten 6 werden ${z} € ausgezahlt, sonst nichts. X sei der Gewinn (Auszahlung minus Einsatz). Berechne E(X) in €.`,
            type: 'input', placeholder: 'E(X) in €',
            check: numCheck(E), testAnswer: String(E), answerText: `${fmt(E)} €`,
            solution: `E(X) = ${z} · ${frac(1, 6)} − ${e} = ${fmt(z / 6)} − ${e} = ${fmt(E)} €` +
              (E < 0 ? '<br>Auf lange Sicht verliert man also pro Spiel.' : E === 0 ? '<br>Das Spiel ist fair!' : '<br>Auf lange Sicht gewinnt man – ungewöhnlich großzügig!')
          };
        }
        /* Fairness-Frage. Die Antwort ist das Vorzeichen von „erwartete
           Auszahlung minus Preis". Der Preis steht in der Aufgabe, die
           erwartete Auszahlung k = z · 1/n nicht – sie muss gerechnet werden.

           Gezogen wird deshalb zuerst der Preis, dann die Lage, dann k = e ± 1:
           damit ist für JEDEN Preis jede der drei Antworten exakt gleich
           wahrscheinlich (33,3 %). Vorher stand die Trefferwahrscheinlichkeit
           mit 1/6 fest, k ließ sich also direkt an der Auszahlung ablesen; weil
           die Auszahlung nur sechs Werte annahm, entschied sie die Antwort zu
           64 % allein. Jetzt gehört zu jeder Gewinnsumme eine ganze Reihe von
           Paaren aus Losanzahl und erwarteter Auszahlung.
           Gemessen über alle Kombinationen (exakt ausgezählt, nicht gestichprobt):
           Preis 33,3 % · Losanzahl 36,2 % · Gewinnsumme 38,5 % · Fragelänge
           39,0 % gegen 33,3 % Zufall; keine einzelne Zahl schließt je eine
           Antwort aus.
           Was bleibt, ist die Teilbarkeitsprobe „Gewinnsumme glatt durch den
           Preis?" mit 61,6 %. Sie ist keine blinde Regel: Sie verlangt genau
           die Division z : e, und wer sie zu Ende führt und das Ergebnis gegen
           die Losanzahl hält, hat die Aufgabe vollständig gelöst (z : e gegen n
           ist dieselbe Entscheidung wie z : n gegen e). Bei jeder Fairness-
           Frage der Form „Auszahlung = Preis · Anzahl“ ist diese Spur
           unvermeidbar. */
        const lage = choice(['fair', 'verlust', 'gewinn']);
        const e = rnd(LOS_PREIS[0], LOS_PREIS[1]);
        const k = e + (lage === 'fair' ? 0 : lage === 'verlust' ? -1 : 1);
        const n = choice(losanzahlen(k));
        const z = k * n, E = k - e;
        const optionen = ['Ja, es ist fair', 'Nein, der Spieler verliert im Schnitt', 'Nein, der Spieler gewinnt im Schnitt'];
        const correct = { fair: 0, verlust: 1, gewinn: 2 }[lage];
        /* Keine der drei Aussagen ist aus einem bestimmten Fehler gebaut: „gewinnt“
           entsteht ohne Abzug des Lospreises, ohne den Faktor 1/n, mit 1/6 oder
           mit vertauschtem Vorzeichen. Der Grund nennt deshalb keinen Fehlerweg,
           sondern die Bedingung, die die gewählte Aussage verlangt – sie gilt bei
           jeder Ziehung und verrät nach dem Fehlgriff nicht, welche der beiden
           übrigen Aussagen stimmt. */
        const erwartet = `${fmt(z)} € · ${frac(1, n)}`;
        const gruende = [
          `Fair hieße: ${erwartet} ergibt genau den Lospreis von ${fmt(e)} €. Das trifft hier nicht zu.`,
          `Verlust im Schnitt hieße: ${erwartet} liegt unter dem Lospreis von ${fmt(e)} €. Das trifft hier nicht zu.`,
          `Gewinn im Schnitt hieße: ${erwartet} liegt über dem Lospreis von ${fmt(e)} €. Das trifft hier nicht zu.`
        ].map((g, i) => i === correct ? null : g);
        return {
          q: `Bei einem Glücksspiel kostet ein Los ${fmt(e)} €. Unter ${fmt(n)} Losen ist genau ein Gewinnlos, es bringt ${fmt(z)} €. Ist das Spiel fair (E(Gewinn) = 0)?`,
          type: 'choice', options: optionen, correct, gruende,
          answerText: optionen[correct],
          solution: `E(Gewinn) = ${fmt(z)} · ${frac(1, n)} − ${fmt(e)} = ${fmt(k)} − ${fmt(e)} = ${fmt(E)} €.<br>` +
            (E === 0 ? 'E = 0 → das Spiel ist fair.' : `E ${E < 0 ? '&lt;' : '&gt;'} 0 → nicht fair: Der Spieler ${E < 0 ? 'verliert' : 'gewinnt'} im Schnitt ${fmt(Math.abs(E))} € pro Los.`)
        };
      }
      const kind = choice(['varianz', 'linear']);
      if (kind === 'varianz') {
        let a = 2 * rnd(1, 4), b = a + 2 * rnd(1, 4);
        const E = (a + b) / 2;
        const V = ((b - a) / 2) ** 2;
        return {
          q: `X nimmt die Werte ${a} und ${b} jeweils mit Wahrscheinlichkeit ${frac(1, 2)} an. Berechne die Varianz Var(X).`,
          type: 'input', placeholder: 'Var(X)',
          check: numCheck(V), testAnswer: String(V), answerText: `${fmt(V)}`,
          solution: `E(X) = (${a} + ${b}) · ${frac(1, 2)} = ${fmt(E)}<br>` +
            `E(X²) = (${a}² + ${b}²) · ${frac(1, 2)} = ${fmt((a * a + b * b) / 2)}<br>` +
            `Var(X) = E(X²) − (E(X))² = ${fmt((a * a + b * b) / 2)} − ${fmt(E * E)} = ${fmt(V)}`
        };
      }
      const m = rnd(2, 10), a = rnd(2, 5), b = rnd(-10, 10);
      const res = a * m + b;
      // b = 0 schrieb „E(4X + 0)“ – den Summanden 0 setzt niemand hin.
      const bTeil = b === 0 ? '' : b > 0 ? `+ ${fmt(b)}` : `− ${fmt(Math.abs(b))}`;
      return {
        q: `Für eine Zufallsvariable X gilt E(X) = ${fmt(m)}. Berechne E(${koef(a, 'X')}${bTeil ? ' ' + bTeil : ''}).`,
        type: 'input', placeholder: 'Erwartungswert',
        check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
        solution: `Linearität des Erwartungswerts: E(aX + b) = a · E(X) + b<br>` +
          `E(${koef(a, 'X')}${bTeil ? ' ' + bTeil : ''}) = ${fmt(a)} · ${fmt(m)}${bTeil ? ' ' + bTeil : ''} = ${fmt(res)}`
      };
    }
  };

  /* ---------- Binomialverteilung ---------- */

  const binomial = {
    id: 'binomial',
    icon: 'B(n,p)',
    title: 'Binomialverteilung',
    tagline: 'Bernoulli-Ketten und ihre Kennwerte',
    learn: `
      <h2>Die Binomialverteilung</h2>
      <p>Eine <strong>Bernoulli-Kette</strong>: n unabhängige Wiederholungen desselben Experiments
      mit nur zwei Ausgängen (Treffer/Niete) und konstanter Trefferwahrscheinlichkeit p.
      X = Anzahl der Treffer ist dann binomialverteilt.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Bernoulli-Formel</span>
        <p><span class="formula">P(X = k) = ( n über k ) · pᵏ · (1−p)ⁿ⁻ᵏ</span></p>
        <p>Kennwerte:&nbsp;E(X) = n · p&ensp;<span class="trenn">•</span>&ensp;Var(X) = n · p · (1−p)&ensp;<span class="trenn">•</span>&ensp;σ = √Var</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>3 Münzwürfe, P(genau 2× Kopf) = (3 über 2) · ${frac(1, 2)}² · ${frac(1, 2)} = 3 · ${frac(1, 8)} = ${frac(3, 8)}</p>
      </div>
      <h3>Der Gegenereignis-Trick</h3>
      <p>„Mindestens ein Treffer“ rechnet man über das Gegenteil:</p>
      <p><span class="formula">P(X ≥ 1) = 1 − P(X = 0) = 1 − (1−p)ⁿ</span></p>
    `,
    gen(diff) {
      if (diff === 1) {
        const n = rnd(3, 4), k = rnd(1, n - 1);
        const num = binom(n, k), den = 2 ** n;
        const bsp = beispielBruch(num, den);
        return {
          q: `Eine faire Münze wird ${n}-mal geworfen. Wie groß ist die Wahrscheinlichkeit für genau ${k}-mal Kopf? <span class="hint">Als Bruch (z. B. ${bsp}) oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Bernoulli-Formel mit n = ${n}, k = ${k}, p = ${frac(1, 2)}:<br>` +
            `P(X = ${k}) = (${n} über ${k}) · ${frac(1, 2)}<sup>${n}</sup> = ${num} · ${frac(1, den)} = ${probText(num, den)}`
        };
      }
      if (diff === 2) {
        const kind = choice(['wuerfel', 'erwartung']);
        if (kind === 'wuerfel') {
          const n = rnd(3, 4), k = rnd(1, 2);
          const num = binom(n, k) * 5 ** (n - k), den = 6 ** n;
          return {
            q: `Ein fairer Würfel wird ${n}-mal geworfen. Wie groß ist die Wahrscheinlichkeit für genau ${k} Sechs${k > 1 ? 'en' : ''}? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
            type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
            check: probCheck(num, den), testAnswer: `${num}/${den}`,
            answerText: probText(num, den),
            solution: `Bernoulli-Formel mit n = ${n}, k = ${k}, p = ${frac(1, 6)}:<br>` +
              `P(X = ${k}) = (${n} über ${k}) · ${frac(1, 6)}<sup>${k}</sup> · ${frac(5, 6)}<sup>${n - k}</sup> = ${binom(n, k)} · ${frac(5 ** (n - k), 6 ** n)} = ${probText(num, den)}`
          };
        }
        /* Ohne Münze. Die stand mit p = ½ auch in den Zusatzaufgaben der Stufe 1
           („Eine faire Münze wird n-mal geworfen – wie viele Kopf-Würfe sind zu
           erwarten?"), und damit war diese Aufgabe auf beiden Stufen dieselbe
           Rechnung in anderer Einkleidung. Jetzt nur Wahrscheinlichkeiten ≠ ½;
           n ist ein Vielfaches von 6, damit E(X) in allen Fällen ganzzahlig ist. */
        const variante = choice([
          [6, 'Sechsen'],
          [3, 'Würfe mit einer Augenzahl über 4'],
          [3, 'Würfe mit einer durch 3 teilbaren Augenzahl']
        ]);
        const n = 6 * rnd(2, 8);
        const E = n / variante[0];
        return {
          q: `Man wirft einen fairen Würfel ${fmt(n)}-mal. Wie viele ${variante[1]} sind zu erwarten (E(X))?`,
          type: 'input', placeholder: 'E(X)',
          check: numCheck(E), testAnswer: String(E), answerText: fmt(E),
          solution: `${variante[0] === 6 ? 'Eine von sechs Augenzahlen ist die Sechs' : 'Zwei der sechs Augenzahlen zählen'}, also p = ${frac(1, variante[0])}.<br>E(X) = n · p = ${fmt(n)} · ${frac(1, variante[0])} = <strong>${fmt(E)}</strong>`
        };
      }
      const kind = choice(['mindestens', 'sigma']);
      if (kind === 'mindestens') {
        const n = rnd(2, 4);
        const num = 6 ** n - 5 ** n, den = 6 ** n;
        return {
          q: `Ein fairer Würfel wird ${n}-mal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Gegenereignis-Trick: P(X ≥ 1) = 1 − P(keine Sechs)<br>` +
            `= 1 − ${frac(5, 6)}<sup>${n}</sup> = 1 − ${frac(5 ** n, den)} = ${probSchritt(num, den)}`
        };
      }
      const faelle = [[100, '1/2', 0.5, 25, 5], [64, '1/2', 0.5, 16, 4], [36, '1/2', 0.5, 9, 3], [48, '1/4', 0.25, 9, 3], [192, '1/4', 0.25, 36, 6], [400, '1/2', 0.5, 100, 10]];
      const [n, pStr, p, V, sigma] = choice(faelle);
      return {
        q: `X sei binomialverteilt mit n = ${n} und p = ${pStr}. Berechne die Standardabweichung σ.`,
        type: 'input', placeholder: 'σ',
        check: numCheck(sigma), testAnswer: String(sigma), answerText: `σ = ${sigma}`,
        solution: `Var(X) = n · p · (1−p) = ${n} · ${fmt(p)} · ${fmt(1 - p)} = ${V}<br>σ = √${V} = ${sigma}`
      };
    }
  };

  /* ---------- Hypergeometrische Verteilung ---------- */

  const hypergeometrisch = {
    id: 'hypergeometrisch',
    icon: '6/49',
    title: 'Hypergeometrische Verteilung',
    tagline: 'Ziehen ohne Zurücklegen – bis zum Lotto',
    learn: `
      <h2>Ziehen ohne Zurücklegen</h2>
      <p>In einer Urne liegen N Kugeln, davon K „Treffer“. Man zieht n Kugeln
      <strong>ohne Zurücklegen</strong>. X = Anzahl der gezogenen Treffer ist dann
      <strong>hypergeometrisch verteilt</strong> – anders als bei der Binomialverteilung ändert
      sich die Trefferwahrscheinlichkeit nach jedem Zug!</p>
      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">P(X = k) = (K über k) · (N−K über n−k) ⁄ (N über n)</span></p>
        <p>Erwartungswert: E(X) = n · K⁄N</p>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>Urne: 4 rote, 6 blaue Kugeln. 3 werden gezogen. P(genau 2 rote)?<br>
        P = (4 über 2) · (6 über 1) / (10 über 3) = 6 · 6 / 120 = ${frac(36, 120)} = ${frac(3, 10)}</p>
      </div>
      <p><em>Alternativ über Pfade:</em> Bei kleinen Aufgaben hilft der Baum – die Brüche
      ändern sich pro Stufe: P(rot, rot) = ${frac(4, 10)} · ${frac(3, 9)}.</p>
      <p>Das große Lotto „6 aus 49“ ist genau dieses Modell: P(6 Richtige) = 1 / (49 über 6) ≈ 1 : 14 Millionen.</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const K = rnd(3, 6), B = rnd(3, 6), N = K + B;
        const kind = choice(['beideRot', 'erstDann']);
        if (kind === 'beideRot') {
          const num = K * (K - 1), den = N * (N - 1);
          return {
            q: `In einer Urne liegen ${K} rote und ${B} blaue Kugeln. Du ziehst zwei Kugeln ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit, dass beide rot sind? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
            type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
            check: probCheck(num, den), testAnswer: `${num}/${den}`,
            answerText: probText(num, den),
            solution: `Pfadregel – die Brüche ändern sich, weil nicht zurückgelegt wird:<br>` +
              `P(rot, rot) = ${frac(K, N)} · ${frac(K - 1, N - 1)} = ${frac(num, den)} = ${probText(num, den)}`
          };
        }
        const num = K * B, den = N * (N - 1);
        return {
          q: `In einer Urne liegen ${K} rote und ${B} blaue Kugeln. Du ziehst zwei Kugeln ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für erst rot, dann blau? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          /* Das Seitenbeispiel zur Pfadregel zieht zweimal dieselbe Farbe („die
             Brüche schrumpfen mit"). Hier schrumpft nur der Nenner – genau das
             muss der Weg begründen, sonst rechnet man nach der Seite 3/8 · 4/7. */
          solution: `Pfadregel ohne Zurücklegen:<br>` +
            `Erster Zug rot: ${fmt(K)} der ${fmt(N)} Kugeln sind rot → ${frac(K, N)}<br>` +
            `Zweiter Zug blau: Es liegen nur noch ${fmt(N - 1)} Kugeln in der Urne, aber alle ${fmt(B)} blauen sind noch da → ${frac(B, N - 1)}<br>` +
            `P(rot, blau) = ${frac(K, N)} · ${frac(B, N - 1)} = ${probSchritt(num, den)}<br>` +
            `Der Nenner wird bei jedem Zug kleiner, der Zähler nur, wenn vorher schon dieselbe Farbe gezogen wurde.`
        };
      }
      if (diff === 2) {
        const N = rnd(8, 12), K = rnd(3, 5);
        const k = choice([1, 2]);
        const num = binom(K, k) * binom(N - K, 3 - k);
        const den = binom(N, 3);
        return {
          q: `Eine Urne enthält ${N} Kugeln, davon ${K} rote. Du ziehst 3 Kugeln ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für genau ${k} rote? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Hypergeometrische Formel mit N = ${N}, K = ${K}, n = 3, k = ${k}:<br>` +
            `P(X = ${k}) = (${K} über ${k}) · (${N - K} über ${3 - k}) / (${N} über 3) = ${binom(K, k)} · ${binom(N - K, 3 - k)} / ${den} = ${probText(num, den)}`
        };
      }
      const kind = choice(['lotto', 'erwartung']);
      if (kind === 'lotto') {
        const N = rnd(8, 12);
        const den = binom(N, 3);
        return {
          q: `Beim Mini-Lotto werden 3 aus ${N} Zahlen gezogen. Du gibst einen Tipp mit 3 Zahlen ab. Wie groß ist die Wahrscheinlichkeit für 3 Richtige? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(1, den)}`,
          check: probCheck(1, den), testAnswer: `1/${den}`,
          answerText: probText(1, den),
          solution: `Es gibt (${N} über 3) = ${den} gleich wahrscheinliche Ziehungen – genau eine davon ist dein Tipp.<br>` +
            // Die Frage verlangt drei Dezimalstellen, hier standen vier: Antwort
            // („≈ 0,005“) und Lösungsweg („≈ 0,0045“) nannten zwei verschiedene
            // Zahlen für dieselbe Wahrscheinlichkeit.
            `P(3 Richtige) = ${probText(1, den)}`
        };
      }
      const faelle = [[10, 4, 5, 2], [10, 5, 4, 2], [12, 4, 3, 1], [10, 2, 5, 1], [8, 4, 2, 1], [12, 6, 4, 2], [10, 6, 5, 3]];
      const [N, K, n, E] = choice(faelle);
      return {
        q: `Eine Urne enthält ${N} Kugeln, davon ${K} rote. Du ziehst ${n} Kugeln ohne Zurücklegen. Wie viele rote sind zu erwarten (E(X))?`,
        type: 'input', placeholder: 'E(X)',
        check: numCheck(E), testAnswer: String(E), answerText: `E(X) = ${E}`,
        solution: `Wie bei der Binomialverteilung gilt E(X) = n · K/N:<br>E(X) = ${n} · ${K}/${N} = ${E}`
      };
    }
  };

  /* ---------- Normalverteilung ---------- */

  const normalverteilung = {
    id: 'normalverteilung',
    icon: 'μ±σ',
    title: 'Normalverteilung',
    tagline: 'Glockenkurve, Sigma-Regeln und z-Werte',
    learn: `
      <h2>Die Normalverteilung</h2>
      <p>Viele Größen (Körpergröße, Messfehler, Testergebnisse) folgen der
      <strong>Gauß’schen Glockenkurve</strong>. Sie ist symmetrisch um den Erwartungswert μ,
      die Standardabweichung σ bestimmt ihre Breite.</p>
      <div class="merkkasten"><span class="merk-title">Merke: Die Sigma-Regeln</span>
        <ul>
          <li>[μ − σ; μ + σ] enthält ca. <strong>68 %</strong> der Werte</li>
          <li>[μ − 2σ; μ + 2σ] enthält ca. <strong>95 %</strong></li>
          <li>[μ − 3σ; μ + 3σ] enthält ca. <strong>99,7 %</strong></li>
        </ul>
      </div>
      <h3>Standardisieren mit dem z-Wert</h3>
      <p><span class="formula">z = (x − μ) ⁄ σ</span></p>
      <p>Der z-Wert sagt, wie viele Standardabweichungen x vom Mittelwert entfernt liegt –
      damit vergleicht man Werte aus verschiedenen Verteilungen.</p>
      <div class="example-box"><span class="ex-title">Beispiel</span>
        <p>IQ-Test: μ = 100, σ = 15. Ein Ergebnis von 130 hat z = (130 − 100)/15 = <strong>2</strong>
        – nur ca. 2,5 % erreichen mehr (Symmetrie + 95 %-Regel!).</p>
      </div>
    `,
    gen(diff) {
      if (diff === 1) {
        const varianten = [['[μ − σ; μ + σ]', '68 %'], ['[μ − 2σ; μ + 2σ]', '95 %'], ['[μ − 3σ; μ + 3σ]', '99,7 %']];
        const [intervall, korrekt] = choice(varianten);
        // Jeder Ablenker ist der Anteil eines anderen festen Bereichs – das sagt der Grund.
        const GRUND = {
          '68 %': 'Das ist der Anteil in [μ − σ; μ + σ], eine Standardabweichung nach jeder Seite.',
          '95 %': 'Das ist der Anteil in [μ − 2σ; μ + 2σ], zwei Standardabweichungen nach jeder Seite.',
          '99,7 %': 'Das ist der Anteil in [μ − 3σ; μ + 3σ], drei Standardabweichungen nach jeder Seite.',
          '50 %': 'Das ist der Anteil unter μ, also nur auf einer Seite. Das Intervall reicht nach beiden Seiten von μ.'
        };
        const ablenker = ['68 %', '95 %', '99,7 %', '50 %'].filter(o => o !== korrekt);
        const mc = makeChoice(korrekt, ablenker, ablenker.map(o => GRUND[o]));
        return {
          q: `X ist normalverteilt mit Erwartungswert μ und Standardabweichung σ. Etwa welcher Anteil der Werte liegt im Intervall ${intervall}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: korrekt,
          solution: `Sigma-Regeln: 1σ → 68 %, 2σ → 95 %, 3σ → 99,7 %.<br>Für ${intervall} sind es also ca. ${korrekt}.`
        };
      }
      if (diff === 2) {
        const kind = choice(['zwert', 'symmetrie']);
        if (kind === 'zwert') {
          const mu = rnd(5, 20) * 10;
          const sigma = choice([5, 10, 15, 20]);
          const z = choice([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2]);
          const x = mu + z * sigma;
          return {
            q: `X ist normalverteilt mit μ = ${mu} und σ = ${sigma}. Berechne den z-Wert von x = ${fmt(x)}.`,
            type: 'input', placeholder: 'z = ?',
            check: numCheck(z), testAnswer: String(z), answerText: `z = ${fmt(z)}`,
            solution: `z = (x − μ)/σ = (${fmt(x)} − ${mu})/${sigma} = ${fmt(x - mu)}/${sigma} = ${fmt(z)}`
          };
        }
        const variante = choice(['halb', 'anteil']);
        if (variante === 'halb') {
          return {
            q: `X ist normalverteilt mit Erwartungswert μ. Wie groß ist P(X ≤ μ) in Prozent?`,
            type: 'input', placeholder: 'in %',
            check: numCheck(50, 1e-6, { prozent: true }), testAnswer: '50', answerText: '50 %',
            solution: `Die Glockenkurve ist symmetrisch um μ – genau die Hälfte der Werte liegt darunter: 50 %.`
          };
        }
        // Anteile aus den Sigma-Regeln: halbieren – und entscheiden, ob die 50 %
        // jenseits von μ dazugehören. Das ist der Rechenschritt dieser Stufe.
        //
        // Die Aufgabe war ratbar, und zwar nicht wegen eines einzelnen Ablenkers,
        // sondern wegen ihrer Bauform: Sie stellte genau eine Frage („Etwa wie
        // groß ist P(X ≤ μ + σ)?“) mit genau einem festen Vierersatz
        // (84 · 68 · 16 · 95 %). In einem festen Satz hat die Lösung einen festen
        // Rang – 84 % war zu 100 % die zweitgrößte Zahl und damit zu treffen,
        // ohne ein Wort der Frage zu lesen. Gestrichen wird die Aufgabe deshalb
        // nicht: Ihre Ablenker sind die Fehlvorstellungen, die hier geprüft
        // gehören (Sigma-Regel unhalbiert, halbiert ohne die 50 %, falsche
        // Sigma-Stufe, falsche Seite). Repariert wird an beiden Enden:
        //
        // 1. Die Frage variiert über acht Fälle – 1σ oder 2σ, x über oder unter
        //    μ, gefragt der Bereich bis x oder nur der Streifen zwischen μ und x.
        //    Das ergibt vier gleich häufige Lösungen (34 · 47,5 · 84 · 97,5 %).
        // 2. Zu jeder Lösung liegen sechs Ablenkersätze bereit, die ihren Rang
        //    verteilen: je zwei Sätze mit derselben Zahl größerer Ablenker, über
        //    drei verschiedene Ränge hinweg. Keine Rangregel („größte“,
        //    „zweitgrößte“, „kleinste“ Zahl) kommt damit über 33 %.
        // 3. In jedem Satz trägt mindestens ein Ablenker dieselbe Schreibform wie
        //    die Lösung (gleich viele Vor- und Nachkommastellen – und damit auch
        //    dieselbe Zeichenzahl). Die Lösung ist so nie die einzige Zahl mit
        //    Komma und nie die eindeutig längste oder kürzeste Option; die drei
        //    Regeln „Ausreißer der Form“, „längste“ und „kürzeste Option“ können
        //    sie gar nicht mehr wählen.
        // 4. Jede der vier Lösungen steht auch unter den Ablenkern der anderen
        //    drei. Sonst wäre sie die Zahl, die im Ziehungspool dieses Typs am
        //    seltensten vorkommt – auch das eine blinde Regel, mit der ein
        //    Prüfskript schon andernorts fündig wurde.
        //
        // Keine der vier Lösungen kommt auf einer anderen Stufe vor: Stufe 1 und
        // 3 fragen die ganzen Regeln (68 · 95 · 32 %) und die Ränder (16 · 2,5 %),
        // hier geht es um die Hälften. Deshalb wird der kumulierte Bereich auch
        // immer über μ hinweg gefragt – die Gegenrichtung wäre ein Rand, und
        // dieselbe Rechnung stünde dann auf zwei Stufen.
        const sigmaStufe = choice([1, 2]);
        const ueberMu = choice([true, false]);       // liegt x über oder unter μ?
        const nurStreifen = choice([true, false]);   // nur μ bis x, oder alles bis x?
        const kSigma = sigmaStufe === 1 ? 'σ' : '2σ';
        const regel = sigmaStufe === 1 ? 68 : 95;    // Sigma-Regel dieser Stufe
        const halbe = regel / 2;                     // 34 bzw. 47,5
        const anteil = nurStreifen ? halbe : 50 + halbe;
        const bereich = nurStreifen ? 'zwischen μ und x' : (ueberMu ? 'unter x' : 'über x');
        const loesung = `${fmt(anteil)} %`;
        /* Ablenkersätze je Lösung. Jeder Wert ist ein begründeter Fehler:
           – die Sigma-Regel unhalbiert genommen (68 bzw. 95 %)
           – halbiert, aber die 50 % jenseits von μ vergessen (34 bzw. 47,5 %)
           – die 50 % genommen und den Streifen vergessen (50 %)
           – die falsche Seite erwischt (16 bzw. 2,5 %)
           – die falsche Sigma-Stufe erwischt (95 · 97,5 · 68 · 34 · 99,7 · 99,85 %)
           – den Rest außerhalb des Intervalls genommen (32 bzw. 5 %)
           Reserve-Ablenker braucht es hier ausnahmsweise nicht: Die Sätze sind von
           Hand als paarweise verschiedene Werte gewählt, keiner fällt je mit der
           Lösung zusammen. Ein vierter Ablenker würde auch gar nicht ziehen,
           sondern nur den Rang der Lösung verschieben – also genau das Muster
           wieder einführen, das hier behoben wird. */
        const ABLENKERSAETZE = {
          34:   [['2,5 %', '16 %', '84 %'],     ['2,5 %', '68 %', '99,85 %'],
                 ['5 %', '32 %', '68 %'],       ['32 %', '50 %', '68 %'],
                 ['47,5 %', '84 %', '99,7 %'],  ['50 %', '68 %', '97,5 %']],
          47.5: [['2,5 %', '16 %', '97,5 %'],   ['2,5 %', '32 %', '97,5 %'],
                 ['2,5 %', '50 %', '97,5 %'],   ['32 %', '68 %', '97,5 %'],
                 ['50 %', '95 %', '99,7 %'],    ['68 %', '97,5 %', '99,7 %']],
          84:   [['5 %', '32 %', '68 %'],       ['32 %', '34 %', '68 %'],
                 ['34 %', '47,5 %', '95 %'],    ['34 %', '99,7 %', '99,85 %'],
                 ['47,5 %', '68 %', '97,5 %'],  ['68 %', '97,5 %', '99,7 %']],
          97.5: [['2,5 %', '47,5 %', '95 %'],   ['16 %', '47,5 %', '99,85 %'],
                 ['34 %', '47,5 %', '50 %'],    ['47,5 %', '68 %', '99,85 %'],
                 ['47,5 %', '99,7 %', '99,85 %'], ['95 %', '99,7 %', '99,85 %']]
        };
        /* Gründe: Jeder Wert ist der Anteil eines festen Bereichs der Glocke, und
           der Grund sagt, welcher. Einen Fehlerweg zu nennen wäre nicht sicher –
           68 % bei der Frage „unter x“ (x = μ + σ) ist nicht „Halbieren
           vergessen", sondern die Sigma-Regel ohne den Rand unter μ − σ; 2,5 %
           beim Streifen bis μ + σ sind zwei Fehler zugleich (Stufe und Seite).
           Die Beschreibung des Bereichs stimmt dagegen immer. Die Grenze auf der
           Seite von x heißt „x“, sobald sie zu derselben Sigma-Stufe gehört. */
        const sg = j => j === 1 ? 'σ' : `${j}σ`;
        const intervallZu = j => `[μ − ${sg(j)}; μ + ${sg(j)}]`;
        const ortX = j => j === sigmaStufe ? 'x' : `μ ${ueberMu ? '+' : '−'} ${sg(j)}`;
        const gegenueber = j => `μ ${ueberMu ? '−' : '+'} ${sg(j)}`;
        const hinter = ueberMu ? 'über' : 'unter';   // von μ aus gesehen hinter x
        const vor = ueberMu ? 'unter' : 'über';      // von x aus zu μ hin
        const BEREICH = {
          '2,5 %': ['rand', 2], '16 %': ['rand', 1], '5 %': ['aussen', 2], '32 %': ['aussen', 1],
          '34 %': ['streifen', 1], '47,5 %': ['streifen', 2], '50 %': ['haelfte', 0],
          '68 %': ['innen', 1], '95 %': ['innen', 2], '99,7 %': ['innen', 3],
          '84 %': ['bis', 1], '97,5 %': ['bis', 2], '99,85 %': ['bis', 3]
        };
        const grundZu = o => {
          const [art, j] = BEREICH[o];
          const gleich = j === sigmaStufe;
          if (art === 'rand') return `Das ist der Anteil ${hinter} ${ortX(j)}` +
            (!gleich ? '.' : nurStreifen ? ', nicht zwischen μ und x.' : `, nicht ${vor} x.`);
          if (art === 'aussen') return `Das ist der Anteil außerhalb von ${intervallZu(j)}, beide Ränder zusammen.`;
          if (art === 'streifen') return gleich
            ? `Das ist nur der Streifen zwischen μ und x; die Hälfte ${vor} μ fehlt.`
            : `Das ist der Streifen zwischen μ und ${ortX(j)}.`;
          if (art === 'haelfte') return nurStreifen
            ? `Das ist die ganze Hälfte ${hinter} μ; der Streifen endet schon bei x.`
            : `Das ist nur die Hälfte ${vor} μ; der Streifen zwischen μ und x fehlt.`;
          if (art === 'innen') return nurStreifen
            ? `Das ist der Anteil in ${intervallZu(j)}, also auf beiden Seiten von μ.`
            : gleich ? `Das ist der Anteil in ${intervallZu(j)} – ohne den Rand ${vor} ${gegenueber(j)}.`
            : `Das ist der Anteil in ${intervallZu(j)}.`;
          return gleich
            ? `Das ist der Anteil ${vor} x, also samt der Hälfte ${vor} μ.`
            : `Das ist der Anteil ${vor} ${ortX(j)}.`;
        };
        const satz = choice(ABLENKERSAETZE[anteil]);
        const mc = makeChoice(loesung, satz, satz.map(grundZu));
        return {
          q: `X ist normalverteilt mit Erwartungswert μ und Standardabweichung σ. Der Wert x liegt genau ` +
            `${plural(sigmaStufe, 'eine Standardabweichung', 'zwei Standardabweichungen')} ${ueberMu ? 'über' : 'unter'} μ. ` +
            `Etwa wie groß ist der Anteil der Werte ${bereich}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: loesung,
          solution: nurStreifen
            ? `x liegt bei μ ${ueberMu ? '+' : '−'} ${kSigma}. Das Intervall [μ − ${kSigma}; μ + ${kSigma}] enthält ca. ${fmt(regel)} % der Werte – aber auf <em>beiden</em> Seiten von μ.<br>` +
              `Gefragt ist nur die ${ueberMu ? 'rechte' : 'linke'} Seite, und die Glocke ist symmetrisch um μ:<br>` +
              `${fmt(regel)} % : 2 = <strong>${fmt(halbe)} %</strong><br>` +
              `Wer die ganzen ${fmt(regel)} % nimmt, hat den Streifen auf der anderen Seite mitgezählt.`
            : `x liegt bei μ ${ueberMu ? '+' : '−'} ${kSigma}. Der gefragte Bereich reicht über μ hinaus, also aus zwei Stücken:<br>` +
              `${ueberMu ? 'Unter' : 'Über'} μ liegen 50 % (Symmetrie).<br>` +
              `Dazu der Streifen zwischen μ und x – die Hälfte der ${fmt(regel)} % aus [μ − ${kSigma}; μ + ${kSigma}]: ${fmt(regel)} % : 2 = ${fmt(halbe)} %.<br>` +
              `50 % + ${fmt(halbe)} % = <strong>${fmt(anteil)} %</strong><br>` +
              `Wer die 50 % vergisst, landet bei ${fmt(halbe)} %; wer die Sigma-Regel gar nicht halbiert, bei ${fmt(regel)} %.`
        };
      }
      const kontexte = [
        ['Die Körpergröße von Studenten ist normalverteilt mit μ = 180 cm und σ = 7 cm.', 180, 7, 'cm'],
        ['Die Füllmenge von Flaschen ist normalverteilt mit μ = 500 ml und σ = 10 ml.', 500, 10, 'ml'],
        ['Die Punktzahl eines Tests ist normalverteilt mit μ = 60 und σ = 8 Punkten.', 60, 8, 'Punkten']
      ];
      const [text, mu, sigma] = choice(kontexte);
      /* Der einzige Denkschritt dieser Aufgaben ist die Zuordnung der Zahl aus
         der Frage zu μ ± kσ (Schritt 3 der Seite; „480 ml ist μ − 2σ“ im
         Selbstcheck). Dort passiert der typische Fehler – 16 % statt 2,5 % –,
         also beginnt jeder Weg mit dieser Zeile und nennt die Intervallgrenzen
         in Zahlen, wie die Seite beim IQ („≈ 95 % zwischen 70 und 130“). */
      const m = fmt(mu), s = fmt(sigma);
      const plus1 = `${fmt(mu + sigma)} = ${m} + ${s} = μ + σ`;
      const minus1 = `${fmt(mu - sigma)} = ${m} − ${s} = μ − σ`;
      const plus2 = `${fmt(mu + 2 * sigma)} = ${m} + 2 · ${s} = μ + 2σ`;
      const minus2 = `${fmt(mu - 2 * sigma)} = ${m} − 2 · ${s} = μ − 2σ`;
      const varianten = [
        [`zwischen ${fmt(mu - sigma)} und ${fmt(mu + sigma)}`, 68,
          `${minus1} und ${plus1}.<br>In [μ − σ; μ + σ] liegen ca. 68 %.`],
        [`zwischen ${fmt(mu - 2 * sigma)} und ${fmt(mu + 2 * sigma)}`, 95,
          `${minus2} und ${plus2}.<br>In [μ − 2σ; μ + 2σ] liegen ca. 95 %.`],
        [`außerhalb von [${fmt(mu - sigma)}; ${fmt(mu + sigma)}]`, 32,
          `${minus1} und ${plus1}.<br>In [μ − σ; μ + σ] liegen ca. 68 %, außerhalb also 100 % − 68 % = 32 %.`],
        [`über ${fmt(mu + sigma)}`, 16,
          `${plus1}.<br>Außerhalb von [μ − σ; μ + σ] = [${fmt(mu - sigma)}; ${fmt(mu + sigma)}] liegen 32 % – ` +
          `wegen der Symmetrie die Hälfte davon oben: ca. 16 %.`],
        [`über ${fmt(mu + 2 * sigma)}`, 2.5,
          `${plus2}.<br>Außerhalb von [μ − 2σ; μ + 2σ] = [${fmt(mu - 2 * sigma)}; ${fmt(mu + 2 * sigma)}] liegen 5 % – ` +
          `wegen der Symmetrie die Hälfte davon oben: ca. 2,5 %.`]
      ];
      const [bereich, antwort, erklaerung] = choice(varianten);
      return {
        q: `${text} Etwa wie viel Prozent der Werte liegen ${bereich}? <span class="hint">Sigma-Regeln verwenden.</span>`,
        type: 'input', placeholder: 'in %',
        check: numCheck(antwort, 0.5, { prozent: true }), testAnswer: String(antwort), answerText: `ca. ${fmt(antwort)} %`,
        solution: `${erklaerung}`
      };
    }
  };

  /* Notendurchschnitt: erst das Mittel ziehen, dann eine Verteilung dazu.

     Vorher wurde gewürfelt und verworfen, bis der Durchschnitt auf eine
     Nachkommastelle aufging. Diese Probe besteht aber JEDE Verteilung mit
     sum = 2 · total sofort – und genau 2 ist der Wert, den die Noten 1, 2 und
     3/4 am leichtesten treffen. Ergebnis: In 55 % der Ziehungen war die Antwort
     „2“. Wer blind 2 tippte, lag öfter richtig als falsch, ohne je zu rechnen.
     Jetzt sind die Fälle nach Durchschnitt gruppiert und der Durchschnitt wird
     gleichverteilt gezogen – dieselbe Umkehrung wie bei den Beträgen in
     `vektoren` und der Ja-Quote in `teilbarkeit`. */
  const NOTEN_NACH_SCHNITT = (() => {
    const nach = new Map();
    for (let n1 = 2; n1 <= 6; n1++)
      for (let n2 = 2; n2 <= 8; n2++)
        for (let n3 = 2; n3 <= 6; n3++)
          for (const g3 of [3, 4]) {
            const total = n1 + n2 + n3, sum = n1 + 2 * n2 + g3 * n3;
            if ((sum * 10) % total !== 0) continue;
            const schnitt = sum * 10 / total / 10;
            if (!nach.has(schnitt)) nach.set(schnitt, []);
            nach.get(schnitt).push({ n1, n2, n3, g3, total, sum });
          }
    return [...nach.entries()];
  })();

  /* ---------- Beschreibende Statistik ---------- */

  const deskriptiv = {
    id: 'deskriptiv',
    icon: 'σ',
    title: 'Beschreibende Statistik',
    tagline: 'Gewichtetes Mittel, Varianz und Quartile',
    learn: `
      <h2>Daten beschreiben wie in der Statistik-Vorlesung</h2>
      <div class="merkkasten"><span class="merk-title">Merke: Lage- und Streuungsmaße</span>
        <ul>
          <li><strong>Gewichtetes Mittel:</strong> Werte mit ihren Häufigkeiten multiplizieren, durch die Gesamtzahl teilen.</li>
          <li><strong>Empirische Varianz:</strong> s² = Mittelwert der quadrierten Abweichungen,&nbsp;s = √s²</li>
          <li><strong>Quartile:</strong> Q1 und Q3 sind die Mediane der unteren bzw. oberen Datenhälfte (ohne den Median). Interquartilsabstand: IQR = Q3 − Q1 – die „Box“ im Boxplot.</li>
        </ul>
      </div>
      <div class="example-box"><span class="ex-title">Beispiel: empirische Varianz</span>
        <p>Daten: 4, 6, 8, 10 → Mittel x̄ = 7<br>
        s² = ((−3)² + (−1)² + 1² + 3²) / 4 = 20/4 = <strong>5</strong></p>
      </div>
      <p><strong>Robustheit:</strong> Der Median und der IQR reagieren kaum auf Ausreißer –
      Mittelwert und Spannweite dagegen stark. Deshalb zeigt der Boxplot Median und Quartile.</p>
      <p><em>Hinweis für die Klausur:</em> Manche Skripte teilen bei der Stichprobenvarianz durch
      n−1 statt n – hier üben wir die empirische Variante (durch n).</p>
    `,
    gen(diff) {
      if (diff === 1) {
        const kind = choice(['modal', 'gewichtet']);
        if (kind === 'modal') {
          let m = rnd(1, 20), a = rnd(1, 20), b = rnd(1, 20), c = rnd(1, 20);
          while (a === m) a = rnd(1, 20);
          while (b === m || b === a) b = rnd(1, 20);
          while (c === m || c === a || c === b) c = rnd(1, 20);
          const werte = Util.shuffle([m, m, m, a, a, b, c]);
          return {
            q: `Bestimme den Modalwert (häufigsten Wert) der Daten: ${werte.join(', ')}`,
            type: 'input', placeholder: 'Modalwert',
            check: numCheck(m), testAnswer: String(m), answerText: `${m}`,
            solution: `Die ${m} kommt dreimal vor – öfter als jeder andere Wert. Modalwert: ${m}`
          };
        }
        const [schnitt, faelle] = choice(NOTEN_NACH_SCHNITT);
        const { n1, n2, n3, g3, total, sum } = choice(faelle);
        return {
          q: `In einer Klausur erreichen ${n1} Studierende die Note 1, ${n2} die Note 2 und ${n3} die Note ${g3}. Berechne den Notendurchschnitt.`,
          type: 'input', placeholder: 'Durchschnitt',
          check: numCheck(schnitt), testAnswer: String(schnitt), answerText: fmt(schnitt),
          solution: `Gewichtetes Mittel:<br>(${n1} · 1 + ${n2} · 2 + ${n3} · ${g3}) / ${total} = ${sum}/${total} = ${fmt(schnitt)}`
        };
      }
      if (diff === 2) {
        const kind = choice(['varianz', 'ausreisser']);
        if (kind === 'varianz') {
          const [a, b, V] = choice([[3, 1, 5], [4, 2, 10], [5, 1, 13], [5, 3, 17]]);
          const m = rnd(6, 15);
          const werte = Util.shuffle([m - a, m - b, m + b, m + a]);
          return {
            q: `Berechne die empirische Varianz s² (Teilung durch n) der Daten: ${werte.join(', ')}`,
            type: 'input', placeholder: 's²',
            check: numCheck(V), testAnswer: String(V), answerText: `s² = ${V}`,
            /* Den Mittelwert führt die Seite als eigenen Schritt (Verfahren,
               Schritt 2). Stand er nur als Ergebnis da, sah man bei einem
               Rechenfehler, dass er anders ist – aber nicht, wo. */
            solution: `Mittelwert: x̄ = (${werte.map(w => fmt(w)).join(' + ')})/4 = ${fmt(4 * m)}/4 = ${fmt(m)}.<br>` +
              `Abweichungen vom Mittelwert: ${werte.map(w => fmt(w - m)).join(', ')}<br>` +
              `s² = (${werte.map(w => `${par(w - m)}²`).join(' + ')})/4 = ${fmt(2 * (a * a + b * b))}/4 = ${fmt(V)}`
          };
        }
        const m = rnd(8, 20);
        const d = rnd(2, 6);
        const A = m + 5 * d;
        const basis = [m - 2, m - 1, m + 1, m + 2];
        const werte = basis.concat([A]);
        return {
          q: `Messreihe: ${werte.join(', ')}. Der Ausreißer ${A} wird entfernt. Um wie viel sinkt dadurch der Mittelwert?`,
          type: 'input', placeholder: 'Differenz',
          check: numCheck(d), testAnswer: String(d), answerText: fmt(d),
          solution: `Mit Ausreißer: x̄ = ${werte.reduce((s, w) => s + w, 0)}/5 = ${fmt(m + d)}<br>` +
            `Ohne Ausreißer: x̄ = ${basis.reduce((s, w) => s + w, 0)}/4 = ${m}<br>` +
            `Der Mittelwert sinkt um ${fmt(d)} – er ist empfindlich gegenüber Ausreißern!`
        };
      }
      const kind = choice(['iqr', 'robust']);
      if (kind === 'iqr') {
        const w = [];
        let x = rnd(2, 8);
        for (let i = 0; i < 7; i++) { w.push(x); x += rnd(1, 5); }
        const q1 = w[1], q3 = w[5], iqr = q3 - q1;
        return {
          q: `Gegeben sind die sortierten Daten: ${w.join(', ')}. Bestimme den Interquartilsabstand IQR = Q3 − Q1. <span class="hint">Q1/Q3 = Median der unteren/oberen Hälfte (ohne den Gesamtmedian).</span>`,
          type: 'input', placeholder: 'IQR',
          check: numCheck(iqr), testAnswer: String(iqr), answerText: `IQR = ${iqr}`,
          solution: `Untere Hälfte: ${w[0]}, ${w[1]}, ${w[2]} → Q1 = ${q1}.<br>` +
            `Obere Hälfte: ${w[4]}, ${w[5]}, ${w[6]} → Q3 = ${q3}.<br>` +
            `IQR = ${q3} − ${q1} = ${iqr} – das ist die Länge der Box im Boxplot.`
        };
      }
      // Die Gründe gelten für jede Messreihe; das Zahlenbeispiel ist das der Erklärseite.
      const mc = makeChoice('Median', ['Arithmetisches Mittel', 'Spannweite', 'Summe'], [
        'In das Mittel geht jeder Wert voll ein: Kommt zu 10, 11, 12, 13 der Ausreißer 44 dazu, steigt es von 11,5 auf 18.',
        'Die Spannweite ist größter minus kleinster Wert – ein Ausreißer ist selbst einer dieser beiden Werte.',
        'Ein Ausreißer geht mit seinem vollen Wert in die Summe ein.'
      ]);
      return {
        q: `Welcher Kennwert reagiert am wenigsten empfindlich auf Ausreißer?`,
        type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: 'Median',
        solution: `Der Median hängt nur von der Mitte der sortierten Daten ab – ein einzelner Extremwert verschiebt ihn kaum.<br>` +
          `Mittelwert, Spannweite und Summe ändern sich dagegen direkt mit jedem Ausreißer.`
      };
    }
  };

  /* ============================================================
     Hypothesentest – Abschluss der Schulstochastik.
  
     Setzt `binomial` voraus (Bernoulli-Formel, n, p, E(X) = n · p) und
     baut darauf die kumulierte Verteilung und den einseitigen
     Signifikanztest auf.
  
     Zu den Zahlen: Kumulierte Binomialwerte sind ohne Tabelle mühsam.
     Deshalb bleibt n klein (Stufe 1 bis 8, sonst bis 20), p einfach, und
     jede Aufgabe, die eine Tabelle bräuchte, bringt die nötigen Werte im
     Aufgabentext mit – so wie es Schulbücher tun. Angezeigt wird auf vier
     Nachkommastellen, geprüft mit Toleranz, damit die Summe der
     ANGEZEIGTEN Werte immer als richtig durchgeht.
  
     Alle Parametersätze werden einmal beim Laden ausgerechnet statt in
     einer Schleife gewürfelt: So ist jede Ziehung gleich wahrscheinlich,
     und keine Aufgabe kann an ungünstigen Zahlen scheitern. Aussortiert
     sind dabei drei Fallen:
       · Tabellenwerte, die auf vier Stellen 0,0000 oder 1,0000 ergäben,
       · der Wert 0,5000 – „1 − 0,5000 = 0,5000“ liest sich wie ein
         Rechenfehler, obwohl es keiner ist,
       · Fenster, in denen die gesuchte Antwort selbst als Tabellenzeile
         steht. Bei p = 0,5 ist die Verteilung symmetrisch, und dann ist
         1 − P(X ≤ j) oft genau die Zeile P(X ≤ n−j−1) darunter: gemessen
         1,7 % aller Eingabeaufgaben waren so ohne jede Rechnung lösbar.
  
     Die Helfer tragen alle das Kürzel „ht“, weil sie nach dem Einbinden im
     selben Gültigkeitsbereich stehen wie `binom` und `probText` aus
     `topics-uni.js` – ein zweites `binom` würde die Binomialverteilung
     still überschreiben.
     ============================================================ */

  /* Der Trennpunkt steht nur zwischen gleichrangigen Einträgen EINER Zeile:
     in den Tabellenwerten der Frage und zwischen H₀ und H₁ eines Paars. Die
     Lösungswege trennten damit früher auch ihre Rechenschritte – dann las sich
     der Punkt im Weg wie ein weiterer Tabelleneintrag der Frage darüber. Die
     Schritte stehen jetzt auf eigenen Zeilen, wie auf der Erklärseite. */
  const HT_TRENN = '&ensp;<span class="trenn">•</span>&ensp;';

  /** Binomialkoeffizient, für n ≤ 20 exakt. */
  function htKoef(n, k) {
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - i + 1) / i;
    return Math.round(r);
  }
  
  /** P(X = k) der Binomialverteilung. */
  function htEinzel(n, p, k) {
    return htKoef(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }
  
  /** P(X ≤ k), also die kumulierte Wahrscheinlichkeit. */
  function htKum(n, p, k) {
    let s = 0;
    for (let i = 0; i <= k; i++) s += htEinzel(n, p, i);
    return Math.min(1, s);
  }
  
  /** Auf vier Nachkommastellen – genau so, wie der Wert im Text steht. */
  function htR4(x) { return Math.round(x * 1e4) / 1e4; }
  
  /** Wahrscheinlichkeit im Aufgabentext: immer vier Nachkommastellen. */
  function htP4(x) { return fmt(htR4(x), 4); }
  
  /** Dieselbe Zahl als Prozentwert mit einer Nachkommastelle. */
  function htProz1(x) { return fmt(Math.round(x * 1000) / 10, 1); }
  
  /** Aus einem Anteil wird die Prozentzahl im Fließtext („höchstens 20 %“). */
  function htProz(p) { return fmt(Math.round(p * 100)); }
  
  /**
   * Ein Wert taugt für die Tabelle nur, wenn er weder zu 0,0000 noch zu
   * 1,0000 wird – und nicht genau 0,5000 ergibt: In der Zeile
   * „1 − 0,5000 = 0,5000“ sieht jeder Rechenschritt aus wie ein Fehler.
   */
  function htZeigbar(x) {
    const v = htR4(x);
    return v > 0 && v < 1 && v !== 0.5;
  }
  
  /** Mengenschreibweise: kurze Bereiche ausschreiben, lange mit Auslassung. */
  function htMenge(von, bis) {
    if (bis - von <= 3) {
      const z = [];
      for (let i = von; i <= bis; i++) z.push(fmt(i));
      return `{${z.join(', ')}}`;
    }
    return `{${fmt(von)}, ${fmt(von + 1)}, …, ${fmt(bis)}}`;
  }
  
  /** Tabellenzeilen als Text; art 'kum' liefert P(X ≤ i), art 'einzel' P(X = i). */
  function htTab(n, p, von, bis, art) {
    const z = [];
    for (let i = von; i <= bis; i++) {
      z.push(art === 'kum'
        ? `P(X ≤ ${fmt(i)}) = ${htP4(htKum(n, p, i))}`
        : `P(X = ${fmt(i)}) = ${htP4(htEinzel(n, p, i))}`);
    }
    return z.join(` ${HT_TRENN} `);
  }
  
  /** Die fünf angezeigten Werte eines Fensters, auf vier Stellen gerundet. */
  function htWerte(n, p, s, art) {
    const w = [];
    for (let i = s; i <= s + 4; i++) w.push(htR4(art === 'kum' ? htKum(n, p, i) : htEinzel(n, p, i)));
    return w;
  }
  
  /**
   * Mögliche Anfänge eines Tabellenfensters der Länge `laenge`, das alle
   * Zeilen aus `muss` enthält und in dem jeder Wert zeigbar ist.
   *
   * Warum eine Liste und nicht eine feste Lage: Stünde die entscheidende
   * Zeile immer in der Mitte des Fensters, ließe sich die Aufgabe durch
   * Abzählen statt durch Vergleichen lösen.
   */
  function htFenster(n, p, muss, laenge, art) {
    const gut = [];
    for (let s = 0; s + laenge - 1 <= n; s++) {
      const en = s + laenge - 1;
      if (muss.some(m => m < s || m > en)) continue;
      let ok = true;
      for (let i = s; i <= en; i++) {
        if (!htZeigbar(art === 'kum' ? htKum(n, p, i) : htEinzel(n, p, i))) ok = false;
      }
      if (ok) gut.push(s);
    }
    return gut;
  }
  
  /** Nur die Fenster behalten, in denen die gesuchte Antwort nicht selbst steht. */
  function htOhneAntwort(n, p, starts, antwort, art) {
    return starts.filter(s => !htWerte(n, p, s, art).includes(antwort));
  }
  
  /* ---------- Sachkontexte ----------
     Die geprüfte Behauptung steht immer in H₀. Deshalb zwei Listen: „höchstens p“
     führt auf einen rechtsseitigen Test, „mindestens p“ auf einen linksseitigen.
     Ohne die Trennung entstünden Zusagen wie „mindestens 10 % der Bauteile sind
     Ausschuss", die so niemand geben würde. */
  
  const HT_OBEN = [
    { satz: q => `Ein Zulieferer sichert zu, dass höchstens ${q} % der gelieferten Bauteile Ausschuss sind.`,
      zweifel: 'Die Eingangskontrolle vermutet einen höheren Anteil.',
      zaehlt: 'die Ausschussteile', probe: 'Bauteile' },
    { satz: q => `Ein Netzbetreiber gibt an, dass höchstens ${q} % der Verbindungen abbrechen.`,
      zweifel: 'Ein Kundenverband vermutet einen höheren Anteil.',
      zaehlt: 'die abgebrochenen Verbindungen', probe: 'Verbindungen' },
    { satz: q => `Eine Gärtnerei behauptet, dass höchstens ${q} % der Setzlinge eingehen.`,
      zweifel: 'Eine Kundin vermutet, dass es mehr sind.',
      zaehlt: 'die eingegangenen Setzlinge', probe: 'Setzlinge' },
    { satz: q => `Ein Verkehrsbetrieb gibt an, dass höchstens ${q} % der Fahrten verspätet sind.`,
      zweifel: 'Ein Fahrgastverband vermutet einen höheren Anteil.',
      zaehlt: 'die verspäteten Fahrten', probe: 'Fahrten' }
  ];
  
  const HT_UNTEN = [
    { satz: q => `Auf der Samenpackung steht, dass mindestens ${q} % der Körner keimen.`,
      zweifel: 'Eine Gärtnerin vermutet, dass es weniger sind.',
      zaehlt: 'die gekeimten Körner', probe: 'Körner' },
    { satz: q => `Eine Werkstatt wirbt damit, dass mindestens ${q} % der Kunden zufrieden sind.`,
      zweifel: 'Eine Prüfstelle vermutet einen kleineren Anteil.',
      zaehlt: 'die zufriedenen Kunden', probe: 'Kunden' },
    { satz: q => `Eine Basketballspielerin behauptet, mindestens ${q} % ihrer Freiwürfe zu treffen.`,
      zweifel: 'Ihr Trainer vermutet eine kleinere Trefferquote.',
      zaehlt: 'die Treffer', probe: 'Freiwürfe' },
    { satz: q => `Ein Hersteller verspricht, dass mindestens ${q} % der Akkus nach zwei Jahren noch volle Ladung halten.`,
      zweifel: 'Ein Testlabor vermutet einen kleineren Anteil.',
      zaehlt: 'die Akkus mit voller Ladung', probe: 'Akkus' }
  ];
  
  /* ---------- Parametersätze ---------- */
  
  const HT_N = [10, 12, 15, 20];
  const HT_P_OBEN = [0.1, 0.2, 0.25, 0.3];          // „höchstens p“ – über 30 % gäbe niemand als Zusage
  const HT_P_UNTEN = [0.5, 0.6, 0.7, 0.75, 0.8, 0.9];
  const HT_NIVEAU = [0.01, 0.05, 0.1];              // aufsteigend – darauf baut die Wahl in Stufe 2
  
  const HT_S1_N = [5, 6, 7, 8];
  const HT_S1_P = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8];
  
  /* Stufe 1, Bereichsaufgabe: (n, p, Fensterstart, a, b, Antwort).
     Der gefragte Bereich ist stets kürzer als das Fenster – sonst hieße die
     Aufgabe „addiere alles, was dasteht“. */
  const HT_S1_BEREICH = (() => {
    const out = [];
    for (const n of HT_S1_N) for (const p of HT_S1_P) {
      for (const s of htFenster(n, p, [], 5, 'einzel')) {
        const zeilen = htWerte(n, p, s, 'einzel');
        for (let laenge = 2; laenge <= 3; laenge++) {
          for (let a = s; a + laenge - 1 <= s + 4; a++) {
            const b = a + laenge - 1;
            let summe = 0;
            for (let i = a; i <= b; i++) summe += htR4(htEinzel(n, p, i));
            const w = htR4(summe);
            if (zeilen.includes(w)) continue;
            out.push([n, p, s, a, b, w]);
          }
        }
      }
    }
    return out;
  })();
  
  /* Stufe 1, Gegenereignis: (n, p, Fensterstart, j, Antwort) mit k = j + 1. */
  const HT_S1_GEGEN = (() => {
    const out = [];
    for (const n of HT_S1_N) for (const p of HT_S1_P) {
      for (const s of htFenster(n, p, [], 5, 'kum')) {
        const zeilen = htWerte(n, p, s, 'kum');
        for (let j = s; j <= s + 3; j++) {
          const w = htR4(1 - htR4(htKum(n, p, j)));
          if (zeilen.includes(w)) continue;
          out.push([n, p, s, j, w]);
        }
      }
    }
    return out;
  })();
  
  /* Stufe 2: gegebener rechtsseitiger Ablehnungsbereich Ā = {k, …, n}.
     α zwischen 0,5 % und 15 % – darunter wäre die Zahl im Text nicht mehr
     ablesbar, darüber wäre es kein Signifikanztest mehr.
     Immer rechtsseitig: linksseitig stünde der gesuchte Wert P(X ≤ c) wörtlich
     in der Tabelle, und die Aufgabe wäre reines Abschreiben. */
  const HT_2B = (() => {
    const out = [];
    for (const n of HT_N) for (const p of HT_P_OBEN) for (let k = 2; k <= n; k++) {
      const a = 1 - htKum(n, p, k - 1);
      if (a < 0.005 || a > 0.15) continue;
      const starts = htOhneAntwort(n, p, htFenster(n, p, [k - 1], 5, 'kum'),
        htR4(1 - htR4(htKum(n, p, k - 1))), 'kum');
      if (!starts.length) continue;
      out.push([n, p, k, a, starts]);
    }
    return out;
  })();
  
  /* Stufe 3, rechtsseitig: kleinstes k mit P(X ≥ k) ≤ α. Das Fenster muss die
     Zeile k−1 UND die davorliegende enthalten – erst beide zusammen machen die
     Grenze zu einer Entscheidung statt zu einem Ablesen. */
  const HT_3A_RECHTS = (() => {
    const out = [];
    for (const n of HT_N) for (const p of HT_P_OBEN) for (const niv of HT_NIVEAU) {
      let j = -1;
      // Entschieden wird auf dem ANGEZEIGTEN Wert, nicht auf dem exakten. Sonst
      // widerspricht die Tabelle, die die Aufgabe selbst abdruckt, der Antwort:
      // Bei n = 15, p = 0,3 ist P(X ≤ 7) = 0,94998746 – exakt knapp unter 0,95,
      // angezeigt aber als 0,9500. Wer korrekt abliest, käme auf k = 8 und würde
      // als falsch gewertet.
      for (let i = 0; i <= n; i++) if (htR4(htKum(n, p, i)) >= 1 - niv) { j = i; break; }
      if (j < 1 || j + 1 > n) continue;
      const a = htR4(1 - htR4(htKum(n, p, j)));
      if (a < 0.0005) continue;
      const starts = htFenster(n, p, [j - 1, j], 5, 'kum');
      if (!starts.length) continue;
      out.push([n, p, niv, j + 1, a, starts]);
    }
    return out;
  })();
  
  /* Stufe 3, linksseitig: größtes c mit P(X ≤ c) ≤ α. */
  const HT_3A_LINKS = (() => {
    const out = [];
    for (const n of HT_N) for (const p of HT_P_UNTEN) for (const niv of HT_NIVEAU) {
      let c = -1;
      // Wie oben: auf dem angezeigten Wert entscheiden (spiegelbildlicher Fall,
      // n = 15, p = 0,7, Niveau 5 %).
      for (let i = 0; i <= n; i++) { if (htR4(htKum(n, p, i)) <= niv) c = i; else break; }
      if (c < 0 || c + 1 > n) continue;
      const a = htR4(htKum(n, p, c));
      if (a < 0.0005) continue;
      const starts = htFenster(n, p, [c, c + 1], 5, 'kum');
      if (!starts.length) continue;
      out.push([n, p, niv, c, a, starts]);
    }
    return out;
  })();
  
  /* Stufe 3, Fehler 2. Art: linksseitiger Test, Ā = {0, …, c}, in Wahrheit gilt
     p₁ < p₀. β liegt zwischen 5 % und 95 % – bei 0,4 % wäre die Aufgabe keine
     Warnung mehr, sondern eine Beruhigung.
     Das Niveau geht nicht in den Fragetext ein, deshalb werden Sätze, die auf
     dasselbe (n, p₀, c, p₁) führen, nur einmal aufgenommen. */
  const HT_3B = (() => {
    const out = [], gesehen = new Set();
    for (const n of HT_N) for (const p0 of HT_P_UNTEN) for (const niv of HT_NIVEAU) {
      let c = -1;
      // Dieselbe Grenzsuche wie in HT_3A_LINKS – also auch hier auf dem angezeigten Wert.
      for (let i = 0; i <= n; i++) { if (htR4(htKum(n, p0, i)) <= niv) c = i; else break; }
      if (c < 0 || c + 1 > n) continue;
      for (const p1 of [0.3, 0.4, 0.5, 0.6, 0.7]) {
        if (p1 >= p0) continue;
        const b = 1 - htKum(n, p1, c);
        if (b < 0.05 || b > 0.95) continue;
        const starts = htOhneAntwort(n, p1, htFenster(n, p1, [c], 5, 'kum'),
          htR4(1 - htR4(htKum(n, p1, c))), 'kum');
        if (!starts.length) continue;
        const schluessel = `${n}|${p0}|${c}|${p1}`;
        if (gesehen.has(schluessel)) continue;
        gesehen.add(schluessel);
        out.push([n, p0, c, p1, b, starts]);
      }
    }
    return out;
  })();
  
  /**
   * Trefferzahlen k für die Münzaufgaben der Stufe 1.
   * Ausgeschlossen ist der symmetrische Fall, in dem die Summe genau die Hälfte
   * aller Pfade trifft: Die Antwort wäre dann immer ½ – und im Lösungsweg stünde
   * „1 − 64/128 = 64/128“, was sich wie ein Abschreibfehler liest.
   */
  function htMuenzK(n, hoechstens) {
    const raus = [];
    const von = hoechstens ? 1 : 2;
    const bis = Math.min(5, hoechstens ? n - 2 : n - 1);
    for (let k = von; k <= bis; k++) {
      let s = 0;
      for (let i = 0; i <= (hoechstens ? k : k - 1); i++) s += htKoef(n, i);
      if (s * 2 !== Math.pow(2, n)) raus.push(k);
    }
    return raus;
  }
  
  /** Nachbarwerte von p₀ für die Aufgaben zur Fehlerart – nie p₀ selbst. */
  function htNachbarn(p0, richtung) {
    const out = [];
    for (const d of [0.05, 0.1, 0.15]) {
      const v = Math.round((p0 + richtung * d) * 100) / 100;
      if (v > 0.02 && v < 0.98) out.push(v);
    }
    return out;
  }
  
  /** Bruch plus Dezimalwert; „≈“ nur dort, wo wirklich gerundet wird. */
  function htBruchText(num, den) {
    const g = Util.gcd(num, den);
    const v = num / den;
    return `${frac(fmt(num / g), fmt(den / g))} ${htR4(v) === v ? '=' : '≈'} ${htP4(v)}`;
  }
  const hypothesentest = {
    id: 'hypothesentest',
    icon: 'H₀',
    title: 'Hypothesentest',
    tagline: 'Kumulierte Binomialverteilung und Signifikanztest',
    learn: `
        <h2>Der Hypothesentest</h2>
        <p>Eine Stichprobe sagt nie mit Sicherheit, wie es in der Grundgesamtheit aussieht.
        Der Hypothesentest macht aus dieser Unsicherheit eine Zahl: Er legt <em>vorher</em>
        fest, welche Ergebnisse er noch für Zufall hält – und welche nicht mehr. Er ist der
        Grund, warum man die Binomialverteilung überhaupt lernt.</p>

        <div class="einstieg-box">
          <p class="box-title">Acht Ausschussteile in einer Kontrolle</p>
          <p>Ein Zulieferer sichert zu, dass höchstens 20 % der gelieferten Bauteile Ausschuss
          sind. Die Eingangskontrolle prüft 20 Bauteile und findet 8 Ausschussteile. Erwartet
          hätte man 20 · 0,2 = 4.</p>
          <p class="frage">Acht statt vier – ist die Zusage damit widerlegt, oder kann das noch
          Zufall sein?</p>
        </div>

        <h3>Kumulierte Wahrscheinlichkeiten</h3>
        <p>Ein Test fragt nie nach einer einzelnen Trefferzahl, sondern immer nach einem ganzen
        Bereich: „mindestens 8“, „höchstens 3“, „zwischen 4 und 6“. Solche Wahrscheinlichkeiten
        heißen <strong>kumuliert</strong>; man summiert die Einzelwerte der Bernoulli-Formel
        auf. Tabellen und Rechner geben deshalb P(X ≤ k) aus – daraus lässt sich jeder Bereich
        zusammensetzen. Für „mindestens“ führt der Weg über das Gegenereignis, und dabei
        verschiebt sich die Grenze um eins: Das Gegenteil von „mindestens 8“ ist „höchstens 7“,
        nicht „höchstens 8“.</p>

        <div class="herleitung-box">
          <p class="box-title">Warum eine einzelne Zahl noch nichts entscheidet</p>
          <p>Auch wenn der Zulieferer recht hat und p = 0,2 gilt, kommt in einer Stichprobe von
          20 Stück selten genau 4-mal Ausschuss heraus. X ist binomialverteilt mit n = 20 und
          p = 0,2, die Standardabweichung beträgt σ = √(20 · 0,2 · 0,8) = √3,2 ≈ 1,79.
          Ergebnisse von 2 bis 6 sind ganz gewöhnlich – zusammen decken sie rund 84 % aller
          Kontrollen ab.</p>
          <p>Die Frage lautet deshalb nicht „stimmt p = 0,2?“, sondern: <strong>Wie
          wahrscheinlich wäre ein Ergebnis wie das beobachtete, wenn p = 0,2 gälte?</strong>
          Dabei zählt nicht nur die 8 selbst, sondern alles, was mindestens so stark gegen die
          Zusage spricht – also der ganze Bereich X ≥ 8.</p>
          <p>Aus der kumulierten Verteilung: P(X ≤ 7) = 0,9679, also
          P(X ≥ 8) = 1 − 0,9679 = 0,0321. Nur in gut 3 von 100 Kontrollen käme bei einem
          ehrlichen Zulieferer ein so schlechtes Ergebnis heraus. Das ist wenig genug, um die
          Zusage zu verwerfen. Entscheidend ist dabei die Reihenfolge: Die Schwelle wird
          festgelegt, <em>bevor</em> man die Zahl kennt – sonst schiebt man sie hinterher genau
          dorthin, wo sie das eigene Ergebnis einschließt.</p>
        </div>

        <div class="merkkasten">
          <p class="box-title">Die Bausteine eines Signifikanztests</p>
          <p><strong>Kumuliert rechnen:</strong>
          <span class="formula">P(X ≥ k) = 1 − P(X ≤ k−1)</span> und
          <span class="formula">P(a ≤ X ≤ b) = P(X ≤ b) − P(X ≤ a−1)</span></p>
          <p><strong>Nullhypothese H₀:</strong> die Behauptung, die auf dem Prüfstand steht. Sie
          bleibt stehen, solange die Daten sie nicht deutlich widerlegen.</p>
          <p><strong>Gegenhypothese H₁:</strong> die Vermutung, die man nachweisen möchte. Wer
          etwas zeigen will, muss es in H₁ schreiben – nur H₀ kann verworfen werden.</p>
          <p><strong>Ablehnungsbereich Ā:</strong> die Trefferzahlen, bei denen H₀ verworfen
          wird. Rechtsseitig ist Ā = {k, k+1, …, n}, linksseitig Ā = {0, 1, …, c}. Ein Ergebnis
          in Ā schreibt man kurz X ∈ Ā, eines außerhalb X ∉ Ā. Alles außerhalb von Ā heißt
          <strong>Annahmebereich</strong>.</p>
          <p><strong>Signifikanzniveau α:</strong> die größte Wahrscheinlichkeit für einen
          Fehlalarm, die man zulässt.
          <span class="formula">P(X ∈ Ā) ≤ α, gerechnet mit dem p aus H₀</span></p>
          <p><strong>Rechtsseitig:</strong> kleinstes k mit P(X ≥ k) ≤ α, gleichbedeutend mit
          P(X ≤ k−1) ≥ 1 − α. <strong>Linksseitig:</strong> größtes c mit P(X ≤ c) ≤ α.</p>
          <p><strong>Fehler 1. Art:</strong> H₀ wird abgelehnt, obwohl H₀ stimmt. Seine
          Wahrscheinlichkeit ist die tatsächliche Irrtumswahrscheinlichkeit P(X ∈ Ā), gerechnet
          mit dem p aus H₀.</p>
          <p><strong>Fehler 2. Art:</strong> H₀ bleibt stehen, obwohl H₁ stimmt.
          <span class="formula">β = P(X ∉ Ā), gerechnet mit dem wahren p</span></p>
        </div>

        <h3>So gehst du vor</h3>
        <ol class="schritte">
          <li><strong>Hypothesen aufstellen.</strong> Die geprüfte Behauptung kommt nach H₀, die
          Vermutung nach H₁. Die Richtung von H₁ entscheidet, an welchem Rand Ā liegt.</li>
          <li><strong>Modell festlegen:</strong> X ist binomialverteilt mit dem
          Stichprobenumfang n und dem p aus H₀.</li>
          <li><strong>Signifikanzniveau wählen</strong> – üblich sind 5 %, je nach Anlass auch
          1 % oder 10 %.</li>
          <li><strong>Ablehnungsbereich bestimmen.</strong> Vom Rand her aufsummieren, solange α
          noch nicht überschritten wird. Mit einer Tabelle der kumulierten Werte geht das in
          einer Zeile.</li>
          <li><strong>Entscheiden.</strong> Liegt das Stichprobenergebnis in Ā, wird H₀
          abgelehnt, sonst nicht.</li>
          <li><strong>Deuten.</strong> Einen Satz schreiben, der sagt, was das Ergebnis über die
          Behauptung aussagt – und dabei nie das Wort „bewiesen“ benutzen.</li>
        </ol>

        <h3>Beispiele</h3>

        <div class="example-box">
          <p class="ex-title">Die Kontrolle aus dem Einstieg</p>
          <p>H₀: p ≤ 0,2 gegen H₁: p &gt; 0,2, n = 20, Signifikanzniveau 5 %. Weil H₁ nach oben
          zeigt, liegt Ā am oberen Rand.</p>
          <p>Gesucht ist das kleinste k mit P(X ≤ k−1) ≥ 0,95. Die Tabelle für p = 0,2 liefert
          P(X ≤ 6) = 0,9133 und P(X ≤ 7) = 0,9679. Erst die zweite Zeile erreicht 0,95, also ist
          k = 8 und <strong>Ā = {8, 9, …, 20}</strong>.</p>
          <p>Tatsächliche Irrtumswahrscheinlichkeit: 1 − 0,9679 = 0,0321, also 3,2 % – das
          Niveau von 5 % wird eingehalten.</p>
          <p>Das Ergebnis 8 liegt in Ā: <strong>H₀ wird abgelehnt.</strong> Die Zusage
          „höchstens 20 %“ lässt sich nicht länger halten. Ein Irrtum bleibt möglich, aber nur
          mit einer Wahrscheinlichkeit von gut 3 %.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Ein linksseitiger Test</p>
          <p>Eine Werkstatt wirbt damit, dass mindestens 80 % ihrer Kunden zufrieden sind. Eine
          Prüfstelle befragt 20 Kunden. H₀: p ≥ 0,8 gegen H₁: p &lt; 0,8, Niveau 5 %. X zählt
          die zufriedenen Kunden; weil H₁ nach unten zeigt, liegt Ā am unteren Rand.</p>
          <p>Gesucht ist das größte c mit P(X ≤ c) ≤ 0,05. Für p = 0,8 gilt P(X ≤ 11) = 0,0100,
          P(X ≤ 12) = 0,0321 und P(X ≤ 13) = 0,0867. Die letzte Zeile ist schon zu groß, also
          c = 12 und <strong>Ā = {0, 1, …, 12}</strong> bei einer Irrtumswahrscheinlichkeit von
          3,2 %.</p>
          <p>Waren 14 der 20 Befragten zufrieden, liegt das Ergebnis nicht in Ā:
          <strong>H₀ wird nicht abgelehnt.</strong> 14 von 20 sind zwar weniger als 80 %, aber
          nicht auffällig weniger.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Hält ein vorgegebener Bereich das Niveau?</p>
          <p>n = 10, H₀: p ≤ 0,2, festgelegt wurde Ā = {5, 6, …, 10}. Wie groß ist die
          tatsächliche Irrtumswahrscheinlichkeit?</p>
          <p>Gerechnet wird mit dem p aus H₀:
          P(X ≥ 5) = 1 − P(X ≤ 4) = 1 − 0,9672 = <strong>0,0328</strong>, also 3,3 %.</p>
          <p>Der Bereich hält damit das 5-%-Niveau ein. Ā = {4, 5, …, 10} täte das nicht mehr:
          1 − P(X ≤ 3) = 1 − 0,8791 = 0,1209, also über 12 %.</p>
        </div>

        <h3>Die beiden Fehlerarten</h3>
        <p>Ein Test kann sich auf zwei Weisen irren, und die beiden Irrtümer lassen sich nicht
        gleichzeitig klein halten: Ein kleineres α kann Ā nur verkleinern, nie vergrößern.
        Dadurch wird seltener abgelehnt – und damit auch dann seltener, wenn H₁ zutrifft.
        Weil die Grenze k eine ganze Zahl ist, bleibt Ā bei einem kleineren α aber manchmal
        genau gleich; dann ändert sich an β nichts. Wer beide Fehler wirklich drücken will,
        braucht eine größere Stichprobe.</p>

        <div class="example-box">
          <p class="ex-title">Fehler 2. Art zum linksseitigen Test</p>
          <p>Derselbe Test wie oben: n = 20, H₀: p ≥ 0,8, Ā = {0, 1, …, 12}. Angenommen, in
          Wahrheit sind nur 60 % der Kunden zufrieden.</p>
          <p>Nicht abgelehnt wird bei X ≥ 13. Gerechnet wird jetzt mit dem <em>wahren</em> p,
          also mit p = 0,6:</p>
          <p>β = P(X ≥ 13) = 1 − P(X ≤ 12) = 1 − 0,5841 = <strong>0,4159</strong></p>
          <p>In rund 42 % der Fälle bleibt die Verschlechterung von 80 % auf 60 % unentdeckt.
          Der Test ist also alles andere als scharf – und das ändert erst ein größeres n.</p>
        </div>

        <div class="achtung-box">
          <p class="achtung-title">„Die Nullhypothese ist damit bewiesen“</p>
          <p>Ein Test, der H₀ nicht ablehnt, hat nichts bewiesen. Er hat nur keinen
          ausreichenden Grund gefunden, H₀ zu verwerfen – und das ist etwas ganz anderes. Wie
          anders, zeigt ein Ergebnis, das mit zwei einander widersprechenden Nullhypothesen
          verträglich ist.</p>
          <p><strong>Gegenbeispiel:</strong> In einer Stichprobe von n = 20 Teilen sind X = 5
          Teile Ausschuss. Zwei Tests, beide zum Niveau 5 %.</p>
          <p><strong>Test A</strong> – H₀: p ≤ 0,2 gegen H₁: p &gt; 0,2. Gesucht ist das
          kleinste k mit P(X ≤ k−1) ≥ 0,95. Für p = 0,2 ist P(X ≤ 6) = 0,9133 und
          P(X ≤ 7) = 0,9679, also Ā = {8, 9, …, 20}. Die 5 liegt nicht darin: H₀ wird nicht
          abgelehnt.</p>
          <p><strong>Test B</strong> – H₀: p ≥ 0,4 gegen H₁: p &lt; 0,4. Gesucht ist das größte
          c mit P(X ≤ c) ≤ 0,05. Für p = 0,4 ist P(X ≤ 3) = 0,0160 und P(X ≤ 4) = 0,0510, also
          Ā = {0, 1, 2, 3}. Die 5 liegt auch hier nicht darin: H₀ wird nicht abgelehnt.</p>
          <p>Dasselbe Ergebnis lässt also sowohl „höchstens 20 %“ als auch „mindestens 40 %“
          stehen – zwei Aussagen, die sich gegenseitig ausschließen. Beide können unmöglich
          bewiesen sein. Richtig heißt es: <em>Das Ergebnis reicht nicht aus, um H₀ zu
          verwerfen.</em></p>
        </div>

        <div class="selbstcheck">
          <p class="box-title">Selbstcheck</p>
          <details><summary>Warum steht die Vermutung in H₁ und nicht in H₀?</summary>
          <p>Weil der Test nur H₀ verwerfen kann, und nur eine Ablehnung hat eine bekannte
          Irrtumswahrscheinlichkeit. Wer seine Vermutung in H₀ schreibt, kann sie bestenfalls
          nicht widerlegen – und das sagt nichts.</p></details>
          <details><summary>Es ist P(X ≤ 5) = 0,8042. Wie groß ist P(X ≥ 6)?</summary>
          <p>P(X ≥ 6) = 1 − P(X ≤ 5) = 1 − 0,8042 = <strong>0,1958</strong>. Wichtig ist die
          Verschiebung um eins: Das Gegenteil von „mindestens 6“ ist „höchstens 5“, nicht
          „höchstens 6“.</p></details>
          <details><summary>Ein Test lehnt H₀ nicht ab. Welcher Fehler kann passiert sein?</summary>
          <p>Nur der Fehler 2. Art: H₀ bleibt stehen, obwohl H₁ zutrifft. Der Fehler 1. Art
          kann ausschließlich dann auftreten, wenn abgelehnt wird.</p></details>
          <details><summary>Warum wird der Ablehnungsbereich vor der Stichprobe festgelegt?</summary>
          <p>Sonst ließe sich die Grenze so schieben, dass das beobachtete Ergebnis gerade
          hineinfällt. Das Niveau α wäre dann keine Zusage mehr, sondern eine nachträgliche
          Rechtfertigung.</p></details>
          <details><summary>Was passiert mit β, wenn man α kleiner macht?</summary>
          <p>β wird nie kleiner, meist größer. Ein kleineres α kann Ā nur verkleinern, also
          wird seltener abgelehnt – auch dann seltener, wenn H₁ zutrifft. Weil k eine ganze
          Zahl ist, bleibt Ā manchmal gleich; dann bleibt auch β unverändert. Beide Fehler
          zugleich zu verkleinern geht nur über einen größeren Stichprobenumfang.</p></details>
        </div>
      `,

    gen(diff) {

      /* ---------------- Stufe 1: kumulierte Wahrscheinlichkeiten ---------------- */
      if (diff === 1) {
        const art = rnd(1, 4);

        /* 1 · Münze, P(X ≤ k). p = ½ hält alle Werte exakt: jeder Pfad hat die
           Wahrscheinlichkeit 1/2ⁿ, gezählt werden nur die Pfade. */
        if (art === 1) {
          const n = rnd(4, 8);
          const k = choice(htMuenzK(n, true));
          const den = Math.pow(2, n);
          const koefs = [];
          let num = 0;
          for (let i = 0; i <= k; i++) { koefs.push(htKoef(n, i)); num += htKoef(n, i); }
          const g = Util.gcd(num, den);
          const kuerzen = g > 1 ? ` = ${frac(fmt(num / g), fmt(den / g))}` : '';
          const zeichen = htR4(num / den) === num / den ? '=' : '≈';
          const bsp = beispielBruch(num, den);
          return {
            q: `Eine faire Münze wird ${fmt(n)}-mal geworfen; X zählt, wie oft Kopf fällt. Berechne die kumulierte Wahrscheinlichkeit P(X ≤ ${fmt(k)}). <span class="hint">Als Bruch (z. B. ${bsp}) oder auf 3 Dezimalstellen gerundet.</span>`,
            type: 'input', placeholder: `z. B. ${bsp}`,
            check: probCheck(num, den), testAnswer: `${num}/${den}`,
            answerText: htBruchText(num, den),
            solution: `Kumuliert heißt: alle Fälle von 0 bis ${fmt(k)} aufsummieren.<br>` +
              `P(X ≤ ${fmt(k)}) = P(X = 0) + … + P(X = ${fmt(k)})<br>` +
              `Bei p = ${frac(1, 2)} hat jeder Pfad die Wahrscheinlichkeit ${frac(1, fmt(den))}; gezählt werden also nur die Pfade:<br>` +
              `P(X ≤ ${fmt(k)}) = (${koefs.map(z => fmt(z)).join(' + ')}) · ${frac(1, fmt(den))} = ${frac(fmt(num), fmt(den))}${kuerzen} ${zeichen} <strong>${htP4(num / den)}</strong>`
          };
        }

        /* 2 · Münze, P(X ≥ k) über das Gegenereignis. */
        if (art === 2) {
          const n = rnd(4, 8);
          const k = choice(htMuenzK(n, false));
          const den = Math.pow(2, n);
          const koefs = [];
          let gegen = 0;
          for (let i = 0; i <= k - 1; i++) { koefs.push(htKoef(n, i)); gegen += htKoef(n, i); }
          const num = den - gegen;
          const g = Util.gcd(num, den);
          const kuerzen = g > 1 ? ` = ${frac(fmt(num / g), fmt(den / g))}` : '';
          const zeichen = htR4(num / den) === num / den ? '=' : '≈';
          const bsp = beispielBruch(num, den);
          return {
            q: `Eine faire Münze wird ${fmt(n)}-mal geworfen; X zählt, wie oft Kopf fällt. Berechne P(X ≥ ${fmt(k)}) mithilfe des Gegenereignisses. <span class="hint">Als Bruch (z. B. ${bsp}) oder auf 3 Dezimalstellen gerundet.</span>`,
            type: 'input', placeholder: `z. B. ${bsp}`,
            check: probCheck(num, den), testAnswer: `${num}/${den}`,
            answerText: htBruchText(num, den),
            solution: `Das Gegenteil von „mindestens ${fmt(k)}“ ist „höchstens ${fmt(k - 1)}“ – nicht „höchstens ${fmt(k)}“.<br>` +
              `P(X ≤ ${fmt(k - 1)}) = (${koefs.map(z => fmt(z)).join(' + ')}) · ${frac(1, fmt(den))} = ${frac(fmt(gegen), fmt(den))}<br>` +
              `P(X ≥ ${fmt(k)}) = 1 − ${frac(fmt(gegen), fmt(den))} = ${frac(fmt(num), fmt(den))}${kuerzen} ${zeichen} <strong>${htP4(num / den)}</strong>`
          };
        }

        /* 3 · Aus einzelnen Werten einen Bereich zusammensetzen. */
        if (art === 3) {
          const [n, p, s, a, b, wert] = choice(HT_S1_BEREICH);
          const teile = [];
          for (let i = a; i <= b; i++) teile.push(htR4(htEinzel(n, p, i)));
          return {
            q: `Für eine binomialverteilte Zufallsgröße X mit n = ${fmt(n)} und p = ${fmt(p)} sind die Einzelwahrscheinlichkeiten gegeben: ${htTab(n, p, s, s + 4, 'einzel')}. Berechne P(${fmt(a)} ≤ X ≤ ${fmt(b)}). <span class="hint">Als Dezimalzahl auf vier Nachkommastellen.</span>`,
            type: 'input', placeholder: `z. B. ${fmt(beispielZahl(wert, [0.4271, 0.3086]))}`,
            check: numCheck(wert, 0.0006), testAnswer: String(wert),
            answerText: htP4(wert),
            solution: `Ein Bereich ist die Summe seiner Einzelwerte – gebraucht werden genau die Zeilen von ${fmt(a)} bis ${fmt(b)}, die übrigen bleiben liegen.<br>` +
              `P(${fmt(a)} ≤ X ≤ ${fmt(b)}) = ${teile.map(v => htP4(v)).join(' + ')} = <strong>${htP4(wert)}</strong>`
          };
        }

        /* 4 · Aus der kumulierten Tabelle über das Gegenereignis. Die richtige
           Zeile ist k−1, nicht k – genau hier verrutscht es. */
        const [n, p, s, j, wert] = choice(HT_S1_GEGEN);
        const k = j + 1;
        const gelesen = htR4(htKum(n, p, j));
        return {
          q: `Für eine binomialverteilte Zufallsgröße X mit n = ${fmt(n)} und p = ${fmt(p)} sind die kumulierten Wahrscheinlichkeiten gegeben: ${htTab(n, p, s, s + 4, 'kum')}. Berechne P(X ≥ ${fmt(k)}). <span class="hint">Als Dezimalzahl auf vier Nachkommastellen.</span>`,
          type: 'input', placeholder: `z. B. ${fmt(beispielZahl(wert, [0.1958, 0.3086]))}`,
          check: numCheck(wert, 0.0006), testAnswer: String(wert),
          answerText: htP4(wert),
          solution: `„Mindestens ${fmt(k)}“ hat als Gegenereignis „höchstens ${fmt(j)}“ – gebraucht wird also die Zeile ${fmt(j)}, nicht die Zeile ${fmt(k)}.<br>` +
            `P(X ≥ ${fmt(k)}) = 1 − P(X ≤ ${fmt(j)}) = 1 − ${htP4(gelesen)} = <strong>${htP4(wert)}</strong>`
        };
      }

      /* ---------------- Stufe 2: Hypothesen, Niveau, Entscheidung ---------------- */
      if (diff === 2) {
        const art = rnd(1, 3);

        /* 1 · Hypothesenpaar wählen. */
        if (art === 1) {
          const oben = rnd(0, 1) === 1;
          const K = choice(oben ? HT_OBEN : HT_UNTEN);
          const p0 = choice(oben ? HT_P_OBEN : HT_P_UNTEN);
          const pt = fmt(p0);
          const richtig = oben
            ? `H₀: p ≤ ${pt} ${HT_TRENN} H₁: p &gt; ${pt}`
            : `H₀: p ≥ ${pt} ${HT_TRENN} H₁: p &lt; ${pt}`;
          /* Die vier angebotenen Paare müssen in BEIDEN Richtungen dieselben sein.
             Vorher nahm makeChoice nur die ersten drei Ablenker, und übrig blieb je
             nach Richtung ein anderer Satz: „oben“ bot >/≤ an, „unten“ </≥. Damit
             verriet schon die Optionsmenge die Antwort – gemessen zu 100 %, ohne
             den Sachtext überhaupt zu lesen. Das zweiseitige Paar =/≠ steht deshalb
             am Ende und wird nur als Reserve gebraucht. */
          const ablenker = oben
            ? [`H₀: p ≥ ${pt} ${HT_TRENN} H₁: p &lt; ${pt}`,
               `H₀: p &gt; ${pt} ${HT_TRENN} H₁: p ≤ ${pt}`,
               `H₀: p &lt; ${pt} ${HT_TRENN} H₁: p ≥ ${pt}`,
               `H₀: p = ${pt} ${HT_TRENN} H₁: p ≠ ${pt}`]
            : [`H₀: p ≤ ${pt} ${HT_TRENN} H₁: p &gt; ${pt}`,
               `H₀: p &gt; ${pt} ${HT_TRENN} H₁: p ≤ ${pt}`,
               `H₀: p &lt; ${pt} ${HT_TRENN} H₁: p ≥ ${pt}`,
               `H₀: p = ${pt} ${HT_TRENN} H₁: p ≠ ${pt}`];
          /* Gründe, parallel zu `ablenker`. Jedes der drei gezeigten Paare trägt in
             beiden Richtungen einen Grund, jeweils einen anderen Fehler:
             Richtung umgedreht (≥/< oben, ≤/> unten), Behauptung und Vermutung
             vertauscht (>/≤ oben, </≥ unten), Grenzfall p = p₀ in H₁ (</≥ oben,
             >/≤ unten). Zwei der drei Texte sind wortgleich für beide Richtungen,
             der dritte nennt nur die Wörter, die ohnehin in der Aufgabe stehen.
             Das umgedrehte Paar entsteht auf zwei Wegen: Die Richtung wird falsch
             gelesen, oder die Vermutung kommt nach H₀ und die Gleichheit nach der
             Schulregel dazu. Der Grund sagt deshalb nur, was in H₀ steht und was
             dort hingehört (Wortlaut der Erklärseite) – das stimmt für beide Wege. */
          const wort = oben ? 'höchstens' : 'mindestens';
          const gRichtung = `Hier steht „${oben ? 'mindestens' : 'höchstens'} ${htProz(p0)} %“ in H₀. Die geprüfte Behauptung kommt nach H₀, und die lautet „${wort} ${htProz(p0)} %“.`;
          const gTausch = 'Hier sind Behauptung und Vermutung vertauscht: Die Vermutung steht in H₀, die geprüfte Behauptung in H₁.';
          const gGleich = `Hier liegt p = ${pt} in H₁. Dieser Grenzfall gehört zu H₀ – mit genau diesem p wird der Test gerechnet.`;
          const gZwei = `Das ist ein zweiseitiger Test. Die Behauptung „${wort} ${htProz(p0)} %“ gibt aber eine Richtung vor.`;
          const mc = makeChoice(richtig, ablenker, oben
            ? [gRichtung, gTausch, gGleich, gZwei]
            : [gRichtung, gGleich, gTausch, gZwei]);
          return {
            q: `${K.satz(htProz(p0))} ${K.zweifel} Welches Hypothesenpaar gehört zu diesem Test?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: richtig,
            solution: `Die geprüfte Behauptung kommt nach H₀, die Vermutung nach H₁ – nur H₀ kann der Test verwerfen.<br>` +
              (oben
                ? `Behauptet wird „höchstens ${htProz(p0)} %“, also H₀: p ≤ ${pt}. Vermutet wird ein größerer Anteil, also H₁: p &gt; ${pt}.<br>Der Ablehnungsbereich liegt damit am oberen Rand: Ā = {k, …, n}.`
                : `Behauptet wird „mindestens ${htProz(p0)} %“, also H₀: p ≥ ${pt}. Vermutet wird ein kleinerer Anteil, also H₁: p &lt; ${pt}.<br>Der Ablehnungsbereich liegt damit am unteren Rand: Ā = {0, …, c}.`)
          };
        }

        /* 2 · Tatsächliche Irrtumswahrscheinlichkeit zu einem vorgegebenen Ā.
           Das vorgegebene Niveau wird dicht an α gewählt – stünde „vorgegeben war
           1 %" über einem Bereich, der 11 % erreicht, wäre die Aufgabe keine
           Prüfung mehr, sondern eine Karikatur. */
        if (art === 2) {
          const [n, p, k, alpha, starts] = choice(HT_2B);
          const K = choice(HT_OBEN);
          const s = choice(starts);
          const passt = HT_NIVEAU.filter(v => alpha <= v);
          const verletzt = HT_NIVEAU.filter(v => alpha > v);
          const niv = !passt.length ? verletzt[verletzt.length - 1]
            : !verletzt.length ? passt[0]
            : (rnd(0, 1) === 1 ? passt[0] : verletzt[verletzt.length - 1]);
          const gelesen = htR4(htKum(n, p, k - 1));
          const wert = htR4(1 - gelesen);
          return {
            q: `${K.satz(htProz(p))} Die Stichprobe umfasst ${fmt(n)} ${K.probe}; X zählt ${K.zaehlt}. Unter H₀: p ≤ ${fmt(p)} gilt: ${htTab(n, p, s, s + 4, 'kum')}. Festgelegt wurde der Ablehnungsbereich Ā = ${htMenge(k, n)}, vorgegeben war ein Signifikanzniveau von ${htProz(niv)} %. Wie groß ist die tatsächliche Irrtumswahrscheinlichkeit? <span class="hint">Als Dezimalzahl auf vier Nachkommastellen.</span>`,
            // 0,0321 war selbst eine mögliche Antwort; die beiden Kandidaten liegen
            // weiter als die Toleranz des Checks (0,0006) von jedem Tabellenwert.
            type: 'input', placeholder: `z. B. ${fmt(beispielZahl(wert, [0.0417, 0.0512]))}`,
            check: numCheck(wert, 0.0006), testAnswer: String(wert),
            answerText: htP4(wert),
            solution: `Ein Fehler 1. Art heißt: X fällt in Ā, obwohl H₀ stimmt. Gerechnet wird deshalb mit p = ${fmt(p)}.<br>` +
              `P(X ≥ ${fmt(k)}) = 1 − P(X ≤ ${fmt(k - 1)}) = 1 − ${htP4(gelesen)} = <strong>${htP4(wert)}</strong><br>` +
              `Das sind rund ${htProz1(wert)} %; das vorgegebene Niveau von ${htProz(niv)} % wird damit ${wert <= niv ? 'eingehalten' : 'überschritten'}.`
          };
        }

        /* 3 · Entscheidung. Alle vier Antworten haben dieselbe Bauform
           „Entscheidung + Lage des Ergebnisses“. Wer nur die Regel kennt, kann
           zwei streichen, muss aber immer noch nachsehen, wo X liegt – und
           umgekehrt. Vorher trugen zwei Ablenker ihre Widerlegung im Text
           („damit ist H₀ bewiesen“): Die ließen sich ohne jede Rechnung streichen.

           Die Lage steht als „∈ Ā“ bzw. „∉ Ā“ da, nicht als „liegt (nicht) in Ā“.
           Sonst hängt die Länge einer Option an BEIDEN Merkmalen, „H₀ wird nicht
           abgelehnt, denn x liegt nicht in Ā" ist dann eindeutig die längste – und
           die Faustregel „nimm die längste Antwort“ traf gemessen 50 % der Fälle.
           Mit gleich langen Symbolen zerfallen die vier Optionen in zwei
           Längenklassen zu je zwei; die Faustregel ist damit wieder ein Viertel
           wert, also genau so viel wie blindes Raten. */
        const oben = rnd(0, 1) === 1;
        const K = choice(oben ? HT_OBEN : HT_UNTEN);
        const n = choice(HT_N);
        const p0 = choice(oben ? HT_P_OBEN : HT_P_UNTEN);
        /* Die Grenze liegt drei Treffer neben dem Erwartungswert – damit hat Ā
           eine Irrtumswahrscheinlichkeit in der üblichen Größenordnung. */
        const grenze = oben
          ? Math.min(n - 1, Math.max(2, Math.round(n * p0) + 3))
          : Math.max(1, Math.min(n - 2, Math.round(n * p0) - 3));
        const x = Math.max(0, Math.min(n, grenze + (oben ? rnd(-3, 2) : rnd(-2, 3))));
        const drin = oben ? x >= grenze : x <= grenze;
        const menge = oben ? htMenge(grenze, n) : htMenge(0, grenze);
        const hyp = oben
          ? `H₀: p ≤ ${fmt(p0)} gegen H₁: p &gt; ${fmt(p0)}`
          : `H₀: p ≥ ${fmt(p0)} gegen H₁: p &lt; ${fmt(p0)}`;
        const A = `H₀ wird abgelehnt, denn ${fmt(x)} ∈ Ā.`;
        const B = `H₀ wird nicht abgelehnt, denn ${fmt(x)} ∈ Ā.`;
        const C = `H₀ wird abgelehnt, denn ${fmt(x)} ∉ Ā.`;
        const D = `H₀ wird nicht abgelehnt, denn ${fmt(x)} ∉ Ā.`;
        const richtig = drin ? A : D;
        /* B und C widersprechen sich selbst – das gilt bei jeder Ziehung und sagt
           nichts über die Lage von X. Der dritte Ablenker (A bzw. D) wendet die
           Regel richtig an und ordnet nur die Lage falsch ein. */
        const gLage = `Hier ist die Lage falsch eingeordnet: ${fmt(x)} gehört ${drin ? '' : 'nicht '}zu Ā = ${menge}.`;
        const paare = [
          [A, gLage],
          [B, 'Diese Antwort widerspricht sich: Ā enthält genau die Ergebnisse, bei denen H₀ abgelehnt wird.'],
          [C, 'Diese Antwort widerspricht sich: Außerhalb von Ā wird H₀ nicht abgelehnt.'],
          [D, gLage]
        ].filter(([o]) => o !== richtig);
        const mc2 = makeChoice(richtig, paare.map(([o]) => o), paare.map(([, g]) => g));
        return {
          q: `${K.satz(htProz(p0))} Getestet wird ${hyp}. Die Stichprobe umfasst ${fmt(n)} ${K.probe}; X zählt ${K.zaehlt}. Der Ablehnungsbereich ist Ā = ${menge}, die Stichprobe ergab X = ${fmt(x)}. Wie lautet die Entscheidung?`,
          type: 'choice', options: mc2.options, correct: mc2.correct, gruende: mc2.gruende,
          answerText: richtig,
          solution: `Zwei Dinge zusammen ergeben die Entscheidung: die Lage des Ergebnisses und die Regel „in Ā heißt ablehnen“.<br>` +
            `Ā = ${menge}, beobachtet wurde X = ${fmt(x)} – das liegt ${drin ? '' : 'nicht '}in Ā.<br>` +
            (drin
              ? `Also wird H₀ abgelehnt. Bewiesen ist H₁ damit nicht: Ein Fehler 1. Art bleibt möglich – seine Wahrscheinlichkeit ist die tatsächliche Irrtumswahrscheinlichkeit und liegt höchstens beim Signifikanzniveau.`
              : `Also bleibt H₀ stehen. Bewiesen ist H₀ damit nicht – der Test hat nur keinen ausreichenden Grund gefunden, sie zu verwerfen.`)
        };
      }

      /* ---------------- Stufe 3: Ablehnungsbereich, Fehler 2. Art, Fehlerarten ---------------- */
      const art = rnd(1, 3);

      /* 1 · Ablehnungsbereich zum vorgegebenen Niveau selbst bestimmen. */
      if (art === 1) {
        const rechts = rnd(0, 1) === 1;
        if (rechts) {
          const [n, p, niv, k, alpha, starts] = choice(HT_3A_RECHTS);
          const K = choice(HT_OBEN);
          const s = choice(starts);
          const j = k - 1;
          return {
            q: `${K.satz(htProz(p))} Zum Signifikanzniveau ${htProz(niv)} % wird H₀: p ≤ ${fmt(p)} gegen H₁: p &gt; ${fmt(p)} getestet. Die Stichprobe umfasst ${fmt(n)} ${K.probe}; X zählt ${K.zaehlt}. Es gilt: ${htTab(n, p, s, s + 4, 'kum')}. Bestimme den Ablehnungsbereich und gib die kleinste Trefferzahl an, die zur Ablehnung von H₀ führt. <span class="hint">Nur die Zahl eingeben.</span>`,
            type: 'input', placeholder: 'Trefferzahl',
            check: numCheck(k), testAnswer: String(k),
            answerText: `${fmt(k)} – also Ā = ${htMenge(k, n)}`,
            solution: `H₁ zeigt nach oben, also ist Ā = {k, …, ${fmt(n)}}. Gesucht ist das kleinste k mit P(X ≥ k) ≤ ${fmt(niv)}, gleichbedeutend mit P(X ≤ k−1) ≥ ${fmt(1 - niv)}.<br>` +
              `P(X ≤ ${fmt(j - 1)}) = ${htP4(htKum(n, p, j - 1))} liegt noch darunter, P(X ≤ ${fmt(j)}) = ${htP4(htKum(n, p, j))} erreicht die Schranke.<br>` +
              `Also k = <strong>${fmt(k)}</strong> und Ā = ${htMenge(k, n)}.<br>` +
              `Tatsächliche Irrtumswahrscheinlichkeit: 1 − ${htP4(htKum(n, p, j))} = ${htP4(htR4(1 - htR4(htKum(n, p, j))))}, also rund ${htProz1(alpha)} %.`
          };
        }
        const [n, p, niv, c, alpha, starts] = choice(HT_3A_LINKS);
        const K = choice(HT_UNTEN);
        const s = choice(starts);
        return {
          q: `${K.satz(htProz(p))} Zum Signifikanzniveau ${htProz(niv)} % wird H₀: p ≥ ${fmt(p)} gegen H₁: p &lt; ${fmt(p)} getestet. Die Stichprobe umfasst ${fmt(n)} ${K.probe}; X zählt ${K.zaehlt}. Es gilt: ${htTab(n, p, s, s + 4, 'kum')}. Bestimme den Ablehnungsbereich und gib die größte Trefferzahl an, die zur Ablehnung von H₀ führt. <span class="hint">Nur die Zahl eingeben.</span>`,
          type: 'input', placeholder: 'Trefferzahl',
          check: numCheck(c), testAnswer: String(c),
          answerText: `${fmt(c)} – also Ā = ${htMenge(0, c)}`,
          solution: `H₁ zeigt nach unten, also ist Ā = {0, …, c}. Gesucht ist das größte c mit P(X ≤ c) ≤ ${fmt(niv)}.<br>` +
            `P(X ≤ ${fmt(c)}) = ${htP4(htKum(n, p, c))} ist noch klein genug, P(X ≤ ${fmt(c + 1)}) = ${htP4(htKum(n, p, c + 1))} schon zu groß.<br>` +
            `Also c = <strong>${fmt(c)}</strong> und Ā = ${htMenge(0, c)}.<br>` +
            `Tatsächliche Irrtumswahrscheinlichkeit: ${htP4(alpha)}, also rund ${htProz1(alpha)} %.`
        };
      }

      /* 2 · Fehler 2. Art. Gerechnet wird mit dem WAHREN p, nicht mit dem aus H₀ –
         das ist der Schritt, den die Aufgabe prüft. */
      if (art === 2) {
        const [n, p0, c, p1, beta, starts] = choice(HT_3B);
        const K = choice(HT_UNTEN);
        const s = choice(starts);
        const gelesen = htR4(htKum(n, p1, c));
        const wert = htR4(1 - gelesen);
        return {
          q: `${K.satz(htProz(p0))} Getestet wird H₀: p ≥ ${fmt(p0)} gegen H₁: p &lt; ${fmt(p0)}. Die Stichprobe umfasst ${fmt(n)} ${K.probe}; X zählt ${K.zaehlt}. Der Ablehnungsbereich ist Ā = ${htMenge(0, c)}. Unter H₀ wäre P(X ≤ ${fmt(c)}) = ${htP4(htKum(n, p0, c))}. Tatsächlich beträgt der Anteil aber nur ${fmt(p1)}. Für p = ${fmt(p1)} gilt: ${htTab(n, p1, s, s + 4, 'kum')}. Wie groß ist die Wahrscheinlichkeit für einen Fehler 2. Art? <span class="hint">Als Dezimalzahl auf vier Nachkommastellen.</span>`,
          type: 'input', placeholder: 'β',
          check: numCheck(wert, 0.0006), testAnswer: String(wert),
          answerText: htP4(wert),
          solution: `Ein Fehler 2. Art heißt: H₀ bleibt stehen, obwohl H₁ zutrifft. Stehen bleibt H₀ für alle Ergebnisse außerhalb von Ā = ${htMenge(0, c)}, also für X ≥ ${fmt(c + 1)}.<br>` +
            `Entscheidend ist, mit welcher Tabelle gerechnet wird: mit der zum wahren Anteil ${fmt(p1)}, nicht mit dem Wert unter H₀ (${fmt(p0)}):<br>` +
            `β = P(X ≥ ${fmt(c + 1)}) = 1 − P(X ≤ ${fmt(c)}) = 1 − ${htP4(gelesen)} = <strong>${htP4(wert)}</strong><br>` +
            `In rund ${htProz1(wert)} % der Fälle bleibt die Abweichung also unentdeckt.`
        };
      }

      /* 3 · Entscheidung und Wirklichkeit einordnen. Die vier Fälle werden gleich
         häufig gezogen, sonst ließe sich die Antwort erraten: Zwei richtige
         Entscheidungen unter einem gemeinsamen Etikett wären allein 50 % wert. */
      const oben = rnd(0, 1) === 1;
      const K = choice(oben ? HT_OBEN : HT_UNTEN);
      const p0 = choice(oben ? HT_P_OBEN : HT_P_UNTEN);
      const fall = rnd(0, 3);
      const abgelehnt = fall === 0 || fall === 2;
      const h0wahr = fall === 0 || fall === 3;
      /* H₀ lautet oben „p ≤ p₀“, unten „p ≥ p₀“ – wahr ist sie also unterhalb
         bzw. oberhalb von p₀. */
      const pWahr = choice(htNachbarn(p0, (oben ? -1 : 1) * (h0wahr ? 1 : -1)));
      const hyp = oben
        ? `H₀: p ≤ ${fmt(p0)} gegen H₁: p &gt; ${fmt(p0)}`
        : `H₀: p ≥ ${fmt(p0)} gegen H₁: p &lt; ${fmt(p0)}`;
      const F1 = 'Fehler 1. Art';
      const F2 = 'Fehler 2. Art';
      const R1 = 'Richtige Entscheidung: H₀ zu Recht abgelehnt';
      const R2 = 'Richtige Entscheidung: H₀ zu Recht beibehalten';
      const richtig = abgelehnt ? (h0wahr ? F1 : R1) : (h0wahr ? R2 : F2);
      /* Passt eine Option nicht zur Entscheidung, nennt der Grund die Entscheidung –
         sie steht ohnehin in der Aufgabe, der Grund verrät also nichts über H₀.
         Nur wenn die Entscheidung passt, liegt der Fehler bei der Frage, ob H₀
         stimmt; dann nennt der Grund den wahren Anteil gegen H₀. */
      const h0 = `H₀: ${oben ? 'p ≤' : 'p ≥'} ${fmt(p0)}`;
      const lage = `beim wahren Anteil ${fmt(pWahr)} ist ${h0} aber ${h0wahr ? '' : 'nicht '}erfüllt.`;
      const paare = [
        [F1, abgelehnt
          ? `Ein Fehler 1. Art verwirft eine wahre H₀ – ${lage}`
          : 'Ein Fehler 1. Art setzt voraus, dass H₀ abgelehnt wird – dieser Test lehnt H₀ nicht ab.'],
        [F2, abgelehnt
          ? 'Ein Fehler 2. Art setzt voraus, dass H₀ stehen bleibt – dieser Test lehnt H₀ ab.'
          : `Ein Fehler 2. Art lässt eine falsche H₀ stehen – ${lage}`],
        [R1, abgelehnt
          ? `„Zu Recht abgelehnt“ hieße, H₀ ist falsch – ${lage}`
          : '„Zu Recht abgelehnt“ passt nicht: Dieser Test lehnt H₀ gar nicht ab.'],
        [R2, abgelehnt
          ? '„Zu Recht beibehalten“ passt nicht: Dieser Test lehnt H₀ ab.'
          : `„Zu Recht beibehalten“ hieße, H₀ stimmt – ${lage}`]
      ].filter(([o]) => o !== richtig);
      const mc3 = makeChoice(richtig, paare.map(([o]) => o), paare.map(([, g]) => g));
      return {
        q: `${K.satz(htProz(p0))} Ein Test prüft ${hyp}. Der Test lehnt H₀ ${abgelehnt ? 'ab' : 'nicht ab'}. In Wahrheit beträgt der Anteil ${fmt(pWahr)}. Wie ist diese Entscheidung einzuordnen?`,
        type: 'choice', options: mc3.options, correct: mc3.correct, gruende: mc3.gruende,
        answerText: richtig,
        solution: `Zwei Fragen entscheiden: Wurde abgelehnt, und stimmt H₀?<br>` +
          `H₀ sagt p ${oben ? '≤' : '≥'} ${fmt(p0)}; in Wahrheit ist p = ${fmt(pWahr)}, also ist H₀ ${h0wahr ? 'wahr' : 'falsch'}. Der Test hat H₀ ${abgelehnt ? 'abgelehnt' : 'stehen gelassen'}.<br>` +
          (abgelehnt
            ? (h0wahr
              /* Wortlaut des Merkkastens: P(X ∈ Ā) ≤ α, gerechnet mit dem p aus H₀.
                 „liegt unter“ widersprach dem ≤, und ohne den Zusatz legte der
                 Weg nahe, mit dem wahren Anteil zu rechnen, den die Frage nennt. */
              ? `Eine wahre Nullhypothese zu verwerfen ist der <strong>Fehler 1. Art</strong>. Seine Wahrscheinlichkeit ist die tatsächliche Irrtumswahrscheinlichkeit P(X ∈ Ā), gerechnet mit dem p aus H₀ (hier ${fmt(p0)}) – sie ist höchstens so groß wie das Signifikanzniveau α.`
              : `Eine falsche Nullhypothese zu verwerfen ist genau das, wofür der Test gebaut ist: eine <strong>richtige Entscheidung</strong>.`)
            : (h0wahr
              ? `Eine wahre Nullhypothese stehen zu lassen ist eine <strong>richtige Entscheidung</strong> – bewiesen ist H₀ damit trotzdem nicht.`
              : `Eine falsche Nullhypothese stehen zu lassen ist der <strong>Fehler 2. Art</strong>; seine Wahrscheinlichkeit heißt β und hängt vom wahren p ab.`))
      };
    }
  };

  return [kombinatorik, bedingte, erwartungswert, binomial, hypergeometrisch, normalverteilung, deskriptiv, hypothesentest];
})();
