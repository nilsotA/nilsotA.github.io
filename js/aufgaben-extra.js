/* ============================================================
   MatheNils – Zusätzliche Aufgabenvarianten
   Für Thema/Stufe-Kombinationen, die zu wenige verschiedene
   Aufgaben erzeugt haben. Schlüssel: "themaId:stufe".
   Ergänzen die bestehenden Generatoren, ohne sie zu verändern.
   ============================================================ */
'use strict';

const EXTRA_AUFGABEN = (() => {
  const { rnd, choice, fmt, frac, numCheck, multiCheck, probCheck } = Util;
  const { plural, koef, par, quadLhs, pickTriple, reduce, fracHTML, makeChoice, rangAuswahl, beispielBruch, beispielZahl } = TopicUtils;

  /** Binomialkoeffizient */
  function binom(n, k) {
    let r = 1;
    for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }

  /**
   * Auswahlaufgabe aus richtiger Antwort und Ablenkern bauen.
   * Früher eine eigene Kopie von `TopicUtils.makeChoice` (Doppelte fallen weg,
   * überzählige Ablenker sind Reserve). Sie wählte dieselben Optionen in
   * derselben Reihenfolge und mischte sie mit genau einem `shuffle` – das
   * Ergebnis ist also unter jeder Saat bit-gleich. Jetzt wird direkt
   * weitergereicht, damit auch die Gründe (`gruende[i]` gehört zu
   * `ablenker[i]`) dieselbe Mehrdeutigkeitsregel bekommen: Führen zwei
   * verschiedene Fehler auf dieselbe Option, bleibt sie ohne Grund.
   */
  function auswahl(richtig, ablenker, gruende = []) {
    return makeChoice(richtig, ablenker, gruende);
  }
  /**
   * Freitext-Antwort auf ein einzelnes Fachwort prüfen.
   * Groß- und Kleinschreibung, Bindestriche und ein vorangestelltes „die“ sind
   * egal – gefragt ist das Wort, nicht die Sorgfalt beim Artikel.
   */
  function wortCheck(wort) {
    const norm = s => String(s).toLowerCase().replace(/[\s-]+/g, '').replace(/[.!]+$/, '').replace(/^die/, '');
    return s => norm(s) === norm(wort);
  }

  /**
   * Wahrscheinlichkeit anzeigen: gekürzter Bruch plus Dezimalzahl.
   *
   * Das Näherungszeichen stand früher bedingungslos da – auch bei „3/4 ≈ 0,75“,
   * wo die Division aufgeht. Wer lernt, dass 3/4 nur ungefähr 0,75 ist, lernt
   * etwas Falsches. Deshalb entscheidet der Vergleich mit dem ungerundeten Wert.
   */
  function probText(num, den) {
    const [rn, rd] = reduce(num, den);
    const wert = Math.round(num / den * 1000) / 1000;
    return `${fracHTML(rn, rd)} ${wert === num / den ? '=' : '≈'} ${fmt(wert)}`;
  }

  /** Wie probText, zeigt aber den ungekürzten Bruch davor – nur wenn er sich
      vom gekürzten unterscheidet, sonst stünde „27/220 = 27/220“ da. */
  function probKuerzung(num, den) {
    const [rn, rd] = reduce(num, den);
    return (rn === num && rd === den) ? probText(num, den)
      : `${frac(fmt(num), fmt(den))} = ${probText(num, den)}`;
  }

  /** Laplace-Bruch der Stufe 1: gekürzt wie auf der Erklärseite und in den
      Originalaufgaben derselben Stufe („P = 3/6 = 1/2“), ohne Dezimalzahl.
      Die Kürzung steht nur da, wenn es etwas zu kürzen gibt – sonst hieße es
      „P = 7/12 = 7/12“. Vorher endeten die Zusatzvarianten bei „P = 6/12“,
      während die Nachbaraufgabe „= 1/2“ schrieb. */
  function laplaceGekuerzt(num, den) {
    const [rn, rd] = reduce(num, den);
    return (rn === num && rd === den) ? fracHTML(num, den)
      : `${fracHTML(num, den)} = ${fracHTML(rn, rd)}`;
  }

  /**
   * Alle Wurfpaare zweier Würfel mit der Augensumme s, in der Schreibweise der
   * Erklärseite („(3, 6), (4, 5), (5, 4), (6, 3)“). Die Seite zählt die Paare
   * einzeln auf, weil genau dort der typische Fehler sitzt: (3, 6) und (6, 3)
   * als ein Paar gezählt. Ein Weg, der nur die Anzahl nennt, lässt den
   * Lernenden an dieser Stelle allein – er erfährt nicht, welche Paare fehlen.
   */
  function wurfpaare(s) {
    const paare = [];
    for (let a = 1; a <= 6; a++) if (s - a >= 1 && s - a <= 6) paare.push([a, s - a]);
    return paare;
  }
  const paarText = ([a, b]) => `(${fmt(a)}, ${fmt(b)})`;


  return {

    /* ---------- Quadratische Gleichungen, leicht ---------- */
    'quadratisch:1': [
      () => {
        const p = rnd(2, 12) * choice([1, -1]);
        const klammer = p > 0 ? `x + ${fmt(p)}` : `x − ${fmt(Math.abs(p))}`;
        // Das Formatbeispiel im Hinweis darf nie die Lösung sein (bei p = −5 wäre „0; 5“ die Antwort).
        const bsp = p === -5 ? '0; 3' : '0; 5';
        return {
          q: `Löse die Gleichung: ${quadLhs(p, 0)} = 0 <span class="hint">Gib beide Lösungen an, z. B. „${bsp}“.</span>`,
          type: 'input', placeholder: 'x₁; x₂',
          check: multiCheck([0, -p]), testAnswer: `0; ${-p}`,
          answerText: `x₁ = 0, x₂ = ${fmt(-p)}`,
          solution: `Hier fehlt das absolute Glied – dann braucht es keine pq-Formel, Ausklammern genügt:<br>` +
            `x · (${klammer}) = 0<br>` +
            `Ein Produkt ist genau dann 0, wenn ein Faktor 0 ist:<br>` +
            `x₁ = 0&nbsp;oder&nbsp;${klammer} = 0 → x₂ = ${fmt(-p)}<br>` +
            `Probe mit x₂: ${par(-p)}² ${p > 0 ? '+' : '−'} ${fmt(Math.abs(p))} · ${par(-p)} = ${fmt(p * p)} − ${fmt(p * p)} = 0 ✓`
        };
      },
      () => {
        const k = rnd(2, 10), a = choice([2, 3, 4, 5]);
        const rechts = a * k * k;
        const bsp = k === 4 ? '3; −3' : '4; −4';
        return {
          q: `Löse die Gleichung: ${koef(a, 'x²')} = ${fmt(rechts)} <span class="hint">Gib beide Lösungen an, z. B. „${bsp}“.</span>`,
          type: 'input', placeholder: 'x₁; x₂',
          check: multiCheck([k, -k]), testAnswer: `${k}; -${k}`,
          answerText: `x₁ = ${fmt(k)}, x₂ = ${fmt(-k)}`,
          solution: `Erst den Vorfaktor wegteilen, dann die Wurzel ziehen:<br>` +
            `${koef(a, 'x²')} = ${fmt(rechts)}&nbsp;| : ${fmt(a)}<br>` +
            `x² = ${fmt(k * k)}<br>` +
            `x = ±√${fmt(k * k)}, also x₁ = ${fmt(k)} und x₂ = ${fmt(-k)}.<br>` +
            `Probe: ${fmt(a)} · ${fmt(k)}² = ${fmt(a)} · ${fmt(k * k)} = ${fmt(rechts)} ✓`
        };
      },
      () => {
        const k = rnd(2, 12);
        // Vierter Eintrag: warum jede FALSCHE Anzahl bei genau diesem Fall
        // nicht stimmt. „Keine Lösung“ hängt nur am Vorzeichen der rechten
        // Seite, „eine Lösung“ nur an der 0 – das gilt für jedes k.
        const nurNegativ = `Keine Lösung gibt es nur, wenn rechts eine negative Zahl steht`;
        const faelle = [
          [`x² = ${fmt(k * k)}`, 'zwei Lösungen',
            `${fmt(k)}² = ${fmt(k * k)} und ${par(-k)}² = ${fmt(k * k)} – beim Quadrieren führen beide Vorzeichen zum selben Ergebnis.`,
            { 'eine Lösung': `So zählt nur x = ${fmt(k)} – aber auch ${par(-k)}² ergibt ${fmt(k * k)}.`,
              'keine Lösung': `${nurNegativ} – ${fmt(k * k)} ist positiv.` }],
          ['x² = 0', 'eine Lösung',
            'Nur x = 0 ergibt quadriert wieder 0 – die beiden Lösungen fallen hier zusammen.',
            { 'zwei Lösungen': 'Hier ist ±√0 doppelt gezählt – aber plus null und minus null sind dieselbe Zahl.',
              'keine Lösung': `${nurNegativ} – 0 ist nicht negativ.` }],
          [`x² = ${fmt(-k * k)}`, 'keine Lösung',
            `Ein Quadrat ist nie negativ, deshalb kann x² niemals ${fmt(-k * k)} werden.`,
            { 'zwei Lösungen': `Hier ist das Minus übersehen: ${fmt(k)}² und ${par(-k)}² ergeben beide ${fmt(k * k)}, nicht ${fmt(-k * k)}.`,
              'eine Lösung': `Genau eine Lösung gibt es nur bei x² = 0 – hier steht rechts ${fmt(-k * k)}.` }]
        ];
        const [gleichung, antwort, begruendung, falschWeil] = choice(faelle);
        const anzahlen = ['keine Lösung', 'eine Lösung', 'zwei Lösungen'];
        const a = auswahl(antwort, anzahlen, anzahlen.map(o => falschWeil[o]));
        return {
          q: `Wie viele Lösungen hat die Gleichung ${gleichung}?`,
          type: 'choice', options: a.options, correct: a.correct, gruende: a.gruende, answerText: antwort,
          solution: `<strong>${antwort}</strong> – ${begruendung}`
        };
      }
    ],

    /* ---------- Pythagoras, leicht ---------- */
    'pythagoras:1': [
      () => {
        // Der rechte Winkel wandert durch die Ecken – so lernt man, die Hypotenuse
        // an seiner Lage zu erkennen und nicht am Buchstaben c.
        // Jeder Ablenker ist eine Aussage, die zu einer ANDEREN Ecke gehört und
        // deshalb hier falsch ist. Achtung bei der umgestellten Form: „a² − b² = c²“
        // ist gleichbedeutend mit a² = b² + c², also mit der Aussage für Ecke A –
        // sie darf nur dort NICHT als Ablenker stehen (dasselbe gilt für B).
        const ecken = [
          ['C', 'c', 'a² + b² = c²', ['a² + c² = b²', 'b² + c² = a²', 'a² − b² = c²']],
          ['A', 'a', 'b² + c² = a²', ['a² + b² = c²', 'a² + c² = b²', 'b² − c² = a²']],
          ['B', 'b', 'a² + c² = b²', ['a² + b² = c²', 'b² + c² = a²', 'a² − b² = c²']]
        ];
        // Jede falsche Gleichung macht eine andere Seite zur Hypotenuse. Die
        // Minus-Form ist gleichwertig zu einer der Plus-Formen daneben – ihr
        // Grund nennt deshalb das Umstellen, sonst trügen zwei Optionen
        // derselben Aufgabe denselben Satz.
        const hypGrund = {
          'a² + b² = c²': 'Hier ist c die Hypotenuse – das gilt nur, wenn der rechte Winkel bei C liegt.',
          'b² + c² = a²': 'Hier ist a die Hypotenuse – das gilt nur, wenn der rechte Winkel bei A liegt.',
          'a² + c² = b²': 'Hier ist b die Hypotenuse – das gilt nur, wenn der rechte Winkel bei B liegt.',
          'a² − b² = c²': 'Vor dem Minus steht beim Umstellen das Hypotenusenquadrat – diese Gleichung macht also a zur Hypotenuse.',
          'b² − c² = a²': 'Vor dem Minus steht beim Umstellen das Hypotenusenquadrat – diese Gleichung macht also b zur Hypotenuse.'
        };
        const [ecke, seite, richtig, falsch] = choice(ecken);
        const w = auswahl(richtig, falsch, falsch.map(f => hypGrund[f]));
        // Die Aufgabe ist nur mit der Namensregel „Seite a liegt Ecke A gegenüber“
        // lösbar. Die Pythagoras-Seite nennt nur Seiten, keine Ecken – die Regel
        // steht erst bei der Trigonometrie. Deshalb steht sie als Hinweis in der
        // Frage (wie bei trigonometrie:1) und als erste Zeile im Lösungsweg: Wer
        // sie nicht kannte, lernt sie dort, statt nur das Ergebnis zu sehen.
        // Bei Ecke C IST c die Hypotenuse – „also nicht automatisch“ passte dort nicht.
        const schluss = ecke === 'C'
          ? 'Hier heißt die Hypotenuse c, weil der rechte Winkel bei C liegt – entscheidend ist der Winkel, nicht der Buchstabe.'
          : 'Der Buchstabe c ist also nicht automatisch die Hypotenuse – entscheidend ist der rechte Winkel.';
        return {
          q: `In einem Dreieck liegt der rechte Winkel bei der Ecke ${ecke}. Welche Gleichung gilt nach dem Satz des Pythagoras? <span class="hint">Jede Seite trägt den kleinen Buchstaben der Ecke, der sie gegenüberliegt: a liegt A gegenüber, b liegt B gegenüber, c liegt C gegenüber.</span>`,
          type: 'choice', options: w.options, correct: w.correct, gruende: w.gruende, answerText: richtig,
          solution: `Jede Seite trägt den kleinen Buchstaben der Ecke, der sie gegenüberliegt.<br>` +
            `Gegenüber dem rechten Winkel bei ${ecke} liegt also die Seite ${seite} – sie ist die Hypotenuse.<br>` +
            `Die beiden anderen Seiten sind die Katheten, nur ihre Quadrate werden addiert:<br>` +
            `<strong>${richtig}</strong><br>` +
            schluss
        };
      },
      () => {
        const [a, b, c] = pickTriple(60);
        const rechtwinklig = choice([true, false]);
        // Die abweichende Seite muss die längste bleiben und die Dreiecksungleichung
        // erfüllen – sonst gäbe es das Dreieck überhaupt nicht.
        const moeglich = [-2, -1, 1, 2].filter(d => c + d > Math.max(a, b) && c + d < a + b);
        const cWert = rechtwinklig ? c : c + choice(moeglich);
        return {
          q: `Ein Dreieck hat die Seiten ${fmt(a)} cm, ${fmt(b)} cm und ${fmt(cWert)} cm. Ist es rechtwinklig?`,
          type: 'choice', options: ['Ja', 'Nein'], correct: rechtwinklig ? 0 : 1,
          answerText: rechtwinklig ? 'Ja' : 'Nein',
          solution: `Die längste Seite ist die einzige mögliche Hypotenuse – also prüfen wir sie:<br>` +
            `${fmt(a)}² + ${fmt(b)}² = ${fmt(a * a)} + ${fmt(b * b)} = ${fmt(a * a + b * b)}<br>` +
            `${fmt(cWert)}² = ${fmt(cWert * cWert)}<br>` +
            (rechtwinklig
              ? `Beide Werte sind gleich, also gilt a² + b² = c² → das Dreieck ist <strong>rechtwinklig</strong>.`
              : `${fmt(a * a + b * b)} ≠ ${fmt(cWert * cWert)} → das Dreieck ist <strong>nicht rechtwinklig</strong>.`)
        };
      },
      () => {
        const [a, b, c] = pickTriple(60);
        return {
          q: `In einem rechtwinkligen Dreieck sind die Katheten a = ${fmt(a)} cm und b = ${fmt(b)} cm lang. Wie groß ist das Hypotenusenquadrat c² (in cm²)?`,
          type: 'input', placeholder: 'c² in cm²',
          check: numCheck(c * c), testAnswer: String(c * c), answerText: `c² = ${fmt(c * c)} cm²`,
          solution: `Gefragt ist nur der erste Schritt – die Wurzel bleibt diesmal aus:<br>` +
            `c² = a² + b² = ${fmt(a)}² + ${fmt(b)}² = ${fmt(a * a)} + ${fmt(b * b)} = <strong>${fmt(c * c)} cm²</strong><br>` +
            `Das ist die Fläche des Hypotenusenquadrats. Erst √${fmt(c * c)} = ${fmt(c)} cm wäre die Seitenlänge.`
        };
      }
    ],

    /* ---------- Trigonometrie, leicht ---------- */
    'trigonometrie:1': [
      () => {
        // Die Optionen hießen „Sinus“, „Kosinus“ und „Tangens“ – fünf, sieben
        // und sieben Zeichen. „Nimm die kürzeste Option“ traf damit in den
        // beiden Sinus-Fällen zu 100 %, ohne die Frage zu lesen. Dieselben drei
        // Funktionen in Kurzschreibweise sind alle gleich lang; an der Aufgabe
        // ändert das nichts, an der Ratbarkeit alles.
        const faelle = [
          ['die Hypotenuse', 'die Gegenkathete', 'sin(α)', 'sin(α) = Gegenkathete / Hypotenuse'],
          ['die Hypotenuse', 'die Ankathete', 'cos(α)', 'cos(α) = Ankathete / Hypotenuse'],
          ['die Ankathete', 'die Gegenkathete', 'tan(α)', 'tan(α) = Gegenkathete / Ankathete'],
          ['die Gegenkathete', 'die Ankathete', 'tan(α)', 'tan(α) = Gegenkathete / Ankathete'],
          ['die Gegenkathete', 'die Hypotenuse', 'sin(α)', 'sin(α) = Gegenkathete / Hypotenuse'],
          ['die Ankathete', 'die Hypotenuse', 'cos(α)', 'cos(α) = Ankathete / Hypotenuse']
        ];
        const [geg, ges, fn, regel] = choice(faelle);
        // Jede falsche Funktion braucht die dritte Seite, die hier weder
        // gegeben noch gesucht ist – das ist ihr Grund, für jeden der sechs Fälle.
        const seiten = { 'sin(α)': ['Gegenkathete', 'Hypotenuse', 'Der Sinus'],
          'cos(α)': ['Ankathete', 'Hypotenuse', 'Der Kosinus'], 'tan(α)': ['Gegenkathete', 'Ankathete', 'Der Tangens'] };
        const dritte = ['Gegenkathete', 'Ankathete', 'Hypotenuse'].find(s => ![geg, ges].includes('die ' + s));
        const funktionen = ['sin(α)', 'cos(α)', 'tan(α)'];
        const a = auswahl(fn, funktionen, funktionen.map(f =>
          `${seiten[f][2]} ist ${seiten[f][0]} durch ${seiten[f][1]} – die ${dritte} ist hier aber weder gegeben noch gesucht.`));
        return {
          // Gegebene und gesuchte Seite stehen jetzt in einem Satz beieinander,
          // vorher trennte sie ein Nebensatz. Für `ratbar.js` ändert das
          // nichts: Die sechs Fälle bleiben mit 35 bis 62 Ziehungen unter
          // dessen Mindestzahl von 150 und werden gar nicht erst gemessen –
          // nachgemessen wurde hier mit abgesenkter Schwelle.
          q: `Im rechtwinkligen Dreieck kennst du ${geg}, gesucht ist ${ges}. Der Winkel α ist bekannt – welche Winkelfunktion brauchst du?`,
          type: 'choice', options: a.options, correct: a.correct, gruende: a.gruende, answerText: fn,
          solution: `Es kommen ${geg.replace('die ', '')} und ${ges.replace('die ', '')} vor – dazu passt genau eine Funktion:<br>` +
            `<strong>${regel}</strong><br>Merkhilfe: GAGA-HühnerHof-AG.`
        };
      },
      () => {
        // Die Optionen waren die drei Seitennamen – und die haben feste,
        // verschiedene Längen (Gegenkathete 12, Hypotenuse 10, Ankathete 9
        // Zeichen). Zu jeder der drei Fragen gehörte genau einer davon, also
        // war jede ohne Lesen lösbar: „nimm die längste Option“ traf die
        // Gegenkathete zu 100 %, „nimm die kürzeste“ die Ankathete, „nimm die
        // mittlere" die Hypotenuse. Mit Wörtern ist das nicht zu heilen, die
        // Namen sind nun einmal verschieden lang.
        //
        // Deshalb steht der Name jetzt in der Frage und gesucht ist der
        // Seitenbuchstabe: a, b und c sind gleich lang, gleich gebaut, tragen
        // keine Zahl und kein Wort aus der Frage – an ihnen findet keine der
        // blinden Faustregeln noch ein Merkmal. Gefragt wird von beiden spitzen
        // Winkeln aus und zweimal nach c – so ist jeder der drei Buchstaben in
        // genau zwei der sechs Fälle die Lösung, und auch „immer a“ bringt
        // nichts über den Zufall hinaus.
        const faelle = [
          ['die Hypotenuse', 'c', 'Sie liegt dem rechten Winkel gegenüber – deshalb trägt sie dessen Buchstaben.'],
          ['die Gegenkathete von α', 'a', 'Sie liegt dem Winkel α gegenüber, und genau dafür steht der Buchstabe a.'],
          ['die Ankathete von α', 'b', 'Sie grenzt an α an, ist aber nicht die Hypotenuse – bleibt b.'],
          ['die Gegenkathete von β', 'b', 'Sie liegt dem Winkel β gegenüber, und genau dafür steht der Buchstabe b.'],
          ['die Ankathete von β', 'a', 'Sie grenzt an β an, ist aber nicht die Hypotenuse – bleibt a.'],
          ['die längste Seite', 'c', 'Die längste Seite liegt dem größten Winkel gegenüber, und das ist der rechte – also c, die Hypotenuse.']
        ];
        const [name, seite, erklaerung] = choice(faelle);
        const ablenker = ['a', 'b', 'c'].filter(x => x !== seite);
        // Was der gewählte Buchstabe tatsächlich ist – vom Winkel aus, nach dem
        // die Frage fragt. Die Hypotenuse grenzt an beide spitzen Winkel an; wer
        // „Ankathete“ nur als „liegt am Winkel“ liest, landet bei c.
        // Ohne Winkel in der Frage (Hypotenuse, längste Seite) ist c die Lösung,
        // die Ablenker sind also immer a und b – beides Katheten.
        const winkel = name.endsWith('β') ? 'β' : name.endsWith('α') ? 'α' : null;
        const istWas = x => {
          const gegen = x === 'a' ? 'α' : 'β';
          if (!winkel) return name === 'die längste Seite'
            ? `${x} ist eine Kathete, und jede Kathete ist kürzer als die Hypotenuse.`
            : `${x} liegt ${gegen} gegenüber, nicht dem rechten Winkel – sie ist eine Kathete.`;
          if (x === 'c') return `c grenzt zwar an ${winkel} an, liegt aber dem rechten Winkel gegenüber – sie ist die Hypotenuse, keine Kathete.`;
          return winkel === gegen
            ? `${x} liegt ${winkel} gegenüber – von ${winkel} aus ist sie die Gegenkathete.`
            : `${x} grenzt an ${winkel} an und ist nicht die Hypotenuse – von ${winkel} aus ist sie die Ankathete.`;
        };
        const a = auswahl(seite, ablenker, ablenker.map(istWas));
        return {
          q: `Welche Seite ist ${name}? <span class="hint">Jede Seite trägt den Buchstaben ihres Gegenwinkels: a liegt α gegenüber, b liegt β gegenüber, c dem rechten Winkel.</span>`,
          type: 'choice', options: a.options, correct: a.correct, gruende: a.gruende, answerText: seite,
          solution: `Es ist die Seite <strong>${seite}</strong>. ${erklaerung}`
        };
      }
      ,
      () => {
        // Nur die Winkel, die auf der Erklärseite tatsächlich in der Wertetabelle
        // stehen (30°, 45°, 60°). 0° und 90° kommen dort nicht vor – in einem
        // rechtwinkligen Dreieck kann kein spitzer Winkel 0° oder 90° sein.
        const faelle = [
          ['sin(30°)', 0.5, 0, 'Im halbierten gleichseitigen Dreieck ist die Gegenkathete von 30° genau halb so lang wie die Hypotenuse.'],
          ['cos(60°)', 0.5, 0, 'Die Ankathete von 60° ist dieselbe Seite wie die Gegenkathete von 30° – also wieder die halbe Hypotenuse.'],
          ['tan(45°)', 1, 0, 'Bei 45° sind Gegen- und Ankathete gleich lang, ihr Quotient ist 1.'],
          ['sin(45°)', 0.707, 0.001, 'Im halben Quadrat sind beide Katheten gleich lang, die Hypotenuse ist √2-mal so lang – der Quotient ist 1/√2 ≈ 0,707.'],
          ['cos(45°)', 0.707, 0.001, 'Bei 45° sind Gegen- und Ankathete gleich lang, also ist der Kosinus so groß wie der Sinus.'],
          ['sin(60°)', 0.866, 0.001, 'Das ist der Wert aus der Tabelle: die Höhe im gleichseitigen Dreieck, geteilt durch die Seitenlänge.'],
          ['cos(30°)', 0.866, 0.001, 'Die Ankathete von 30° ist dieselbe Seite wie die Gegenkathete von 60° – deshalb steht hier derselbe Wert.']
        ];
        const [term, wert, tol, begruendung] = choice(faelle);
        const schluss = term.startsWith('tan')
          ? `Anders als Sinus und Kosinus ist der Tangens <em>nicht</em> nach oben begrenzt – bei Winkeln über 45° wird er größer als 1.`
          : `Sinus und Kosinus sind Quotienten aus einer Kathete und der Hypotenuse. Weil die Hypotenuse die längste Seite ist, kommt dabei nie ein Wert über 1 heraus.`;
        return {
          q: `Berechne ohne Taschenrechner: ${term} <span class="hint">${tol ? 'Auf 3 Dezimalstellen gerundet.' : 'Der Wert ist eine glatte Zahl.'}</span>`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(wert, tol || 1e-6), testAnswer: String(wert), answerText: fmt(wert),
          // Gerundete Werte stehen mit „≈“, wie in der Wertetabelle der
          // Erklärseite; „=“ nur bei den glatten Werten 0,5 und 1.
          solution: `${begruendung}<br>Also ${term} ${tol ? '≈' : '='} <strong>${fmt(wert)}</strong>.<br>${schluss}`
        };
      },
      () => {
        const [a, b, c] = pickTriple(30);
        const faelle = [
          ['sin(α)', a, c, 'Gegenkathete', 'Hypotenuse'],
          ['cos(α)', b, c, 'Ankathete', 'Hypotenuse'],
          ['tan(α)', a, b, 'Gegenkathete', 'Ankathete']
        ];
        const [term, zaehler, nenner, zName, nName] = choice(faelle);
        const wert = zaehler / nenner;
        const [rz, rn] = reduce(zaehler, nenner);
        const gekuerzt = (rz === zaehler && rn === nenner) ? '' : ` = ${frac(fmt(rz), fmt(rn))}`;
        // „3/5 ≈ 0,6“ ist falsch: Geht die Division auf, gilt „=“; nur sonst „≈“
        const dez = Math.round(wert * 100) / 100;
        const gl = Math.abs(dez - wert) < 1e-9 ? '=' : '≈';
        return {
          q: `In einem rechtwinkligen Dreieck sind die Gegenkathete a = ${fmt(a)} cm, die Ankathete b = ${fmt(b)} cm und die Hypotenuse c = ${fmt(c)} cm. Wie groß ist ${term}? <span class="hint">Als Bruch oder auf 2 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${fmt(beispielZahl(wert, [0.65, 0.35, 0.57, 0.83]))}`,
          check: numCheck(wert, 0.006), testAnswer: String(Math.round(wert * 100) / 100),
          answerText: `${frac(fmt(zaehler), fmt(nenner))} ${gl} ${fmt(dez)}`,
          solution: `Ein Taschenrechner ist hier gar nicht nötig – ${term} <em>ist</em> nur ein Verhältnis zweier Seiten:<br>` +
            `${term} = ${zName} / ${nName} = ${frac(fmt(zaehler), fmt(nenner))}${gekuerzt} ${gl} <strong>${fmt(dez)}</strong><br>` +
            `Der Winkel α selbst wird dafür nicht gebraucht – erst wenn du ihn <em>ausrechnen</em> willst, brauchst du die Umkehrtaste.`
        };
      },
      () => {
        // Gefragt wurde immer „vom Winkel β aus gesehen“, und richtig war
        // deshalb immer ein Name mit β: „immer die Gegenkathete von β“ traf
        // 54 % der Ziehungen, ohne die Frage zu lesen. Vier Optionen aus zwei
        // Namen mal zwei Winkeln heilen das nur halb – die Antwort steht dann
        // zwar gleichverteilt da, ist aber rein sprachlich zu haben: der
        // andere Name am zuletzt genannten Winkel, in 100 % der Ziehungen.
        // Das liegt an der Sache. Die Umbenennung ist eine Vertauschung, und
        // eine Vertauschung liest man vier Bausteinen an, ohne je ein Dreieck
        // gesehen zu haben.
        //
        // Deshalb wird der Name jetzt geschrieben statt angeklickt. Das holt
        // auch die Hypotenuse zurück: Sie ist die einzige Seite, die ihren
        // Namen behält, war als Ablenker aber verschwunden – erklärt wurde sie
        // im Lösungsweg trotzdem weiter. Jetzt wird sie wieder gefragt.
        const faelle = [
          ['a', 'α', 'Gegenkathete', 'Von α aus liegt a dem Winkel gegenüber.'],
          ['a', 'β', 'Ankathete', 'Von β aus grenzt dieselbe Seite an den Winkel an.'],
          ['b', 'α', 'Ankathete', 'Von α aus grenzt b an den Winkel an.'],
          ['b', 'β', 'Gegenkathete', 'Von β aus liegt dieselbe Seite dem Winkel gegenüber.'],
          ['c', 'α', 'Hypotenuse', 'Sie gehört zu keinem der beiden spitzen Winkel: Sie liegt dem rechten gegenüber, und der bleibt derselbe, von wo aus du auch schaust.'],
          ['c', 'β', 'Hypotenuse', 'Sie gehört zu keinem der beiden spitzen Winkel: Sie liegt dem rechten gegenüber, und der bleibt derselbe, von wo aus du auch schaust.']
        ];
        const [seite, winkel, name, warum] = choice(faelle);
        const istKathete = seite !== 'c';
        return {
          q: `Wie heißt die Seite ${seite} vom Winkel ${winkel} aus gesehen? <span class="hint">Jede Seite trägt den Buchstaben ihres Gegenwinkels: a liegt α gegenüber, b liegt β gegenüber, c dem rechten Winkel. Antworte mit einem Wort: Gegenkathete, Ankathete oder Hypotenuse.</span>`,
          type: 'input', placeholder: 'Name der Seite',
          check: wortCheck(name), testAnswer: name, answerText: `die ${name}`,
          solution: (istKathete
            ? `Die Katheten heißen nicht absolut, sondern immer <em>bezogen auf einen Winkel</em>: ${warum}`
            : `Die Hypotenuse ist die Ausnahme. ${warum}`) +
            `<br>Also ist ${seite} von ${winkel} aus <strong>die ${name}</strong>.<br>` +
            (istKathete
              ? `Nur die Hypotenuse behält ihren Namen – sie liegt dem rechten Winkel gegenüber und gehört zu keinem der beiden spitzen Winkel.`
              : `Die beiden Katheten tauschen dagegen die Namen: Was von α aus die Gegenkathete ist, ist von β aus die Ankathete.`)
        };
      }
    ],

    /* ---------- Wahrscheinlichkeit, leicht ---------- */
    'wahrscheinlichkeit:1': [
      () => {
        const rot = rnd(2, 9), blau = rnd(2, 9);
        const farbe = choice([['rote', rot], ['blaue', blau]]);
        const bsp = beispielBruch(farbe[1], rot + blau);
        return {
          q: `In einer Urne liegen ${rot} rote und ${blau} blaue Kugeln. Du ziehst eine Kugel. Wie groß ist die Wahrscheinlichkeit für eine ${farbe[0]} Kugel? <span class="hint">Als Bruch, z. B. ${bsp} – oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: probCheck(farbe[1], rot + blau), testAnswer: `${farbe[1]}/${rot + blau}`,
          answerText: fracHTML(...reduce(farbe[1], rot + blau)),
          solution: `Insgesamt ${rot} + ${blau} = ${rot + blau} Kugeln, davon ${farbe[1]} ${farbe[0]}.<br>` +
            `P = günstige / mögliche = ${laplaceGekuerzt(farbe[1], rot + blau)}`
        };
      },
      () => {
        const felder = choice([8, 10, 12, 16, 20]);
        const gewinn = rnd(1, felder - 2);
        const bsp = beispielBruch(gewinn, felder);
        return {
          q: `Ein Glücksrad hat ${felder} gleich große Felder, davon ${plural(gewinn, 'ist 1 Gewinnfeld', `sind ${gewinn} Gewinnfelder`)}. Wie groß ist die Gewinnwahrscheinlichkeit? <span class="hint">Als Bruch, z. B. ${bsp} – oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: probCheck(gewinn, felder), testAnswer: `${gewinn}/${felder}`,
          answerText: fracHTML(...reduce(gewinn, felder)),
          solution: `${plural(gewinn, '1 günstiges', `${gewinn} günstige`)} von ${felder} gleich wahrscheinlichen Feldern:<br>P = ${laplaceGekuerzt(gewinn, felder)}`
        };
      }
    ],

    /* ---------- Wahrscheinlichkeit, schwer ---------- */
    'wahrscheinlichkeit:3': [
      () => {
        const summe = rnd(3, 11);
        const paare = wurfpaare(summe);
        const anzahl = paare.length;
        // Bei 3 bis 11 gibt es immer ein Paar mit zwei verschiedenen Augenzahlen;
        // an ihm und seinem Tauschpartner zeigt der Weg, dass beide zählen.
        const [x, y] = paare.find(([a, b]) => a < b);
        return {
          q: `Du würfelst zweimal. Wie groß ist die Wahrscheinlichkeit, dass die Augensumme genau ${summe} beträgt? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(anzahl, 36)}`,
          check: probCheck(anzahl, 36), testAnswer: `${anzahl}/36`,
          // Gekürzt wie auf der Erklärseite („P = 4/36 = 1/9“), nicht bei 4/36 stehen bleiben.
          answerText: probKuerzung(anzahl, 36),
          solution: `Es gibt 6 · 6 = 36 gleich wahrscheinliche Wurfpaare.<br>` +
            `Augensumme ${fmt(summe)}: ${paare.map(paarText).join(', ')} – ${fmt(anzahl)} ${plural(anzahl, 'Paar', 'Paare')}<br>` +
            `${paarText([x, y])} und ${paarText([y, x])} sind zwei verschiedene Ergebnisse und zählen beide.<br>` +
            `P = ${probKuerzung(anzahl, 36)}`
        };
      },
      () => {
        const n = rnd(2, 4);
        const num = 6 ** n - 5 ** n;
        return {
          q: `Du würfelst ${n}-mal. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, 6 ** n)}`,
          check: probCheck(num, 6 ** n), testAnswer: `${num}/${6 ** n}`,
          answerText: frac(num, 6 ** n),
          solution: `Über das Gegenereignis: P(keine Sechs) = ${frac(5, 6)}<sup>${n}</sup> = ${frac(5 ** n, 6 ** n)}<br>` +
            `P(mindestens eine) = 1 − ${frac(5 ** n, 6 ** n)} = ${frac(num, 6 ** n)}`
        };
      },
      () => {
        // Ziehen OHNE Zurücklegen: der zweite Nenner ist um 1 kleiner. Genau
        // das übersehen Lernende und rechnen rot/n · rot/n.
        const rot = rnd(3, 6), blau = rnd(3, 6);
        const n = rot + blau;
        const num = rot * (rot - 1), den = n * (n - 1);
        return {
          q: `In einer Urne liegen ${rot} rote und ${blau} blaue Kugeln. Du ziehst zwei Kugeln <strong>ohne Zurücklegen</strong>. Wie groß ist die Wahrscheinlichkeit, dass beide rot sind? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probKuerzung(num, den),
          solution: `Erster Zug: ${rot} von ${n} Kugeln sind rot, also ${frac(rot, n)}.<br>` +
            `Zweiter Zug: Die rote Kugel ist weg – jetzt sind es ${rot - 1} von ${n - 1}, also ${frac(rot - 1, n - 1)}.<br>` +
            `Entlang eines Pfades wird multipliziert:<br>` +
            `P = ${frac(rot, n)} · ${frac(rot - 1, n - 1)} = ${probKuerzung(num, den)}<br>` +
            `Typischer Fehler: ${frac(rot, n)} · ${frac(rot, n)} = ${probText(rot * rot, n * n)} – das wäre <em>mit</em> Zurücklegen.`
        };
      },
      () => {
        // „Genau einmal“ hat zwei Pfade – Treffer/Fehl und Fehl/Treffer.
        const [a, b] = choice([[3, 5], [2, 5], [3, 4], [1, 4], [2, 3], [1, 3]]);
        const num = 2 * a * (b - a), den = b * b;
        return {
          q: `Eine Basketballspielerin trifft einen Freiwurf mit der Wahrscheinlichkeit ${frac(a, b)}. Sie wirft zweimal. Wie groß ist die Wahrscheinlichkeit, dass sie <strong>genau einmal</strong> trifft? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probKuerzung(num, den),
          solution: `„Genau einmal“ passiert auf <strong>zwei</strong> Wegen:<br>` +
            `Treffer, dann Fehlwurf: ${frac(a, b)} · ${frac(b - a, b)} = ${frac(a * (b - a), den)}<br>` +
            `Fehlwurf, dann Treffer: ${frac(b - a, b)} · ${frac(a, b)} = ${frac(a * (b - a), den)}<br>` +
            // Als Summe, wie der Merkkasten es sagt: „·“ steht in diesem Thema
            // für „entlang eines Pfades“, und „2 · p“ führt die Seite in der
            // Achtung-Box gerade als falsche Form vor. Warum es hier trotzdem
            // dasselbe ist, sagt die Zeile danach.
            `Verschiedene Pfade zum selben Ziel werden addiert:<br>` +
            `P = ${frac(a * (b - a), den)} + ${frac(a * (b - a), den)} = ${probKuerzung(num, den)}<br>` +
            `Die beiden Pfade können nicht zugleich eintreten und sind gleich wahrscheinlich – ` +
            `deshalb ist die Summe dasselbe wie 2 · ${frac(a * (b - a), den)}.<br>` +
            `Wer nur einen Pfad zählt, halbiert das Ergebnis.`
        };
      },
      () => {
        // Mindestens einer: Gegenereignis, diesmal ohne Würfel.
        const felder = choice([4, 5, 6, 8, 10]);
        const n = rnd(2, 3);
        const num = felder ** n - (felder - 1) ** n, den = felder ** n;
        return {
          q: `Ein Glücksrad hat ${felder} gleich große Felder, genau eines davon ist ein Gewinnfeld. Du drehst ${n}-mal. Wie groß ist die Wahrscheinlichkeit für <strong>mindestens einen</strong> Gewinn? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probKuerzung(num, den),
          solution: `„Mindestens einer“ hat viele Fälle, das Gegenteil nur einen: <em>gar kein</em> Gewinn.<br>` +
            `P(kein Gewinn) = ${frac(felder - 1, felder)}<sup>${n}</sup> = ${frac((felder - 1) ** n, den)}<br>` +
            `P(mindestens einer) = 1 − ${frac((felder - 1) ** n, den)} = ${probKuerzung(num, den)}<br>` +
            `Nicht ${n} · ${frac(1, felder)} = ${probText(n, felder)} rechnen – das zählt die Fälle mit mehreren Gewinnen doppelt.`
        };
      },
      () => {
        // Mindestens/höchstens statt genau: erzwingt das Abzählen mehrerer Summen.
        const grenze = rnd(8, 11);
        // Je Summe eine Zeile mit ihren Paaren, wie im Beispiel der Erklärseite –
        // die frühere Kurzform „10 (3·)“ gab es dort nicht, und sie zeigte nicht,
        // welche Paare zählen.
        const zeilen = [], anzahlen = [];
        for (let s = grenze; s <= 12; s++) {
          const p = wurfpaare(s);
          anzahlen.push(p.length);
          zeilen.push(`Augensumme ${fmt(s)}: ${p.map(paarText).join(', ')} – ${fmt(p.length)} ${plural(p.length, 'Paar', 'Paare')}`);
        }
        const anzahl = anzahlen.reduce((x, y) => x + y, 0);
        return {
          q: `Du würfelst zweimal. Wie groß ist die Wahrscheinlichkeit, dass die Augensumme <strong>mindestens ${grenze}</strong> beträgt? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(anzahl, 36)}`,
          check: probCheck(anzahl, 36), testAnswer: `${anzahl}/36`,
          answerText: probKuerzung(anzahl, 36),
          solution: `36 gleich wahrscheinliche Wurfpaare, davon zählen alle Summen ab ${fmt(grenze)}:<br>` +
            zeilen.join('<br>') + '<br>' +
            `Zusammen ${anzahlen.map(k => fmt(k)).join(' + ')} = ${fmt(anzahl)} Paare.<br>` +
            `P = ${probKuerzung(anzahl, 36)}<br>` +
            `„Mindestens ${grenze}“ schließt ${grenze} mit ein – wer erst bei ${grenze + 1} anfängt, verliert die häufigste Summe des Bereichs.`
        };
      }
    ],

    /* ---------- Bedingte Wahrscheinlichkeit, leicht ---------- */
    'bedingte:1': [
      () => {
        // P(B) und P(A|B) werden gekoppelt gezogen, damit P(A ∩ B) eine glatte
        // Prozentzahl bleibt – sonst stünden Werte wie 0,13333 in der Aufgabe.
        let b, q;
        for (let i = 0; i < 60; i++) {
          b = choice([20, 25, 40, 50, 60, 80]);
          q = choice([10, 20, 25, 40, 50, 75]);
          if ((b * q) % 100 === 0) break;
        }
        if ((b * q) % 100 !== 0) { b = 40; q = 25; }
        const schnitt = b * q / 100;
        const wert = q / 100;
        return {
          q: `Für zwei Ereignisse gilt P(A ∩ B) = ${fmt(schnitt / 100)} und P(B) = ${fmt(b / 100)}. Wie groß ist P(A|B)? <span class="hint">Als Bruch, Dezimalzahl oder in %.</span>`,
          type: 'input', placeholder: `z. B. ${fmt(beispielZahl(wert, [0.35, 0.65, 0.15, 0.45]))}`,
          // probCheck statt numCheck(wert): Die Lösung endet selbst mit „das sind 10 % der
          // B-Fälle", und die Nachbaraufgaben der Stufe nehmen „10 %“ an – diese lehnte es ab.
          check: probCheck(q, 100), testAnswer: String(wert), answerText: fmt(wert),
          solution: `Die Definition direkt einsetzen:<br>` +
            `P(A|B) = P(A ∩ B) / P(B) = ${fmt(schnitt / 100)} / ${fmt(b / 100)} = <strong>${fmt(wert)}</strong><br>` +
            `Anschaulich: Von 100 Fällen liegen ${fmt(b)} in B, davon ${fmt(schnitt)} auch in A – ` +
            `das sind ${fmt(q)} % der B-Fälle.`
        };
      },
      () => {
        // Immer paarweise dieselben Ereignisse in beiden Richtungen – genau daran
        // zeigt sich, dass P(A|B) und P(B|A) verschiedene Fragen sind.
        // Die drei Ablenker sind in jedem Fall dieselben drei Fehler, in dieser
        // Reihenfolge: die Umkehrung, der Schnitt statt der Bedingung und die
        // Wahrscheinlichkeit ohne Bedingung. Der fünfte Eintrag trägt je einen Grund.
        const schnitt = (was, p) => `Das ∩ misst, wie viele von allen ${was} sind. Die ${p} % beziehen sich aber nur auf eine Gruppe.`;
        const faelle = [
          ['Ein Test erkennt 90 % aller Kranken.', 'P(positiv | krank)',
            ['P(krank | positiv)', 'P(krank ∩ positiv)', 'P(krank)'],
            'Gesprochen wird über die Gruppe der Kranken – sie ist die Bedingung und steht hinter dem Strich.',
            ['Das ist die Umkehrung: Bedingung wären hier die positiv Getesteten.',
              schnitt('krank und positiv getestet', 90),
              'P(krank) ist nur der Anteil der Kranken an allen – vom Testergebnis ist darin keine Rede.']],
          ['Von den positiv Getesteten sind 15 % wirklich krank.', 'P(krank | positiv)',
            ['P(positiv | krank)', 'P(krank ∩ positiv)', 'P(positiv)'],
            'Bezugsgruppe sind die positiv Getesteten – sie sind die Bedingung und stehen hinter dem Strich.',
            ['Das ist die Umkehrung: Bedingung wären hier die Kranken.',
              schnitt('krank und positiv getestet', 15),
              'P(positiv) ist nur der Anteil der positiv Getesteten an allen – ob sie krank sind, steckt darin nicht.']],
          ['Von den Vereinsmitgliedern sind 30 % jünger als 18 Jahre.', 'P(unter 18 | Verein)',
            ['P(Verein | unter 18)', 'P(Verein ∩ unter 18)', 'P(Verein)'],
            'Gezählt wird innerhalb der Vereinsmitglieder – sie bilden die Bedingung.',
            ['Das ist die Umkehrung: Bedingung wären hier die unter 18-Jährigen.',
              schnitt('im Verein und unter 18', 30),
              'P(Verein) ist nur der Anteil der Vereinsmitglieder an allen – vom Alter ist darin keine Rede.']],
          ['Von den unter 18-Jährigen sind 30 % in einem Verein.', 'P(Verein | unter 18)',
            ['P(unter 18 | Verein)', 'P(Verein ∩ unter 18)', 'P(unter 18)'],
            'Gezählt wird innerhalb der unter 18-Jährigen – sie bilden die Bedingung.',
            ['Das ist die Umkehrung: Bedingung wären hier die Vereinsmitglieder.',
              schnitt('im Verein und unter 18', 30),
              'P(unter 18) ist nur der Anteil der unter 18-Jährigen an allen – vom Verein ist darin keine Rede.']]
        ];
        const [satz, richtig, falsch, begruendung, falschWeil] = choice(faelle);
        const w = auswahl(richtig, falsch, falschWeil);
        return {
          q: `„${satz}“ Welche Wahrscheinlichkeit ist damit gemeint?`,
          type: 'choice', options: w.options, correct: w.correct, gruende: w.gruende, answerText: richtig,
          solution: `${begruendung}<br><strong>${richtig}</strong><br>` +
            `Die Umkehrung wäre eine ganz andere Frage – das ist der häufigste Fehler bei bedingten Wahrscheinlichkeiten.`
        };
      },
      () => {
        // Aufeinander aufbauend gezogen, damit die Zahlen zusammenpassen: „beides“
        // kann nie größer sein als eine der beiden Gruppen.
        const kuchen = rnd(4, 12) * 10;
        const beides = rnd(2, kuchen / 10 - 1) * 10;
        const kaffee = beides + rnd(3, 9) * 10;
        const gesamt = kaffee + kuchen - beides + rnd(2, 6) * 10;
        const bsp = beispielBruch(beides, kuchen);
        return {
          q: `In einem Café bestellen von ${fmt(gesamt)} Gästen ${fmt(kaffee)} einen Kaffee und ${fmt(kuchen)} ein Stück Kuchen; ${fmt(beides)} Gäste bestellen beides. Ein Gast, der Kuchen bestellt hat, wird zufällig ausgewählt. Wie groß ist P(Kaffee | Kuchen)? <span class="hint">Als Bruch (z. B. ${bsp}) oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: probCheck(beides, kuchen), testAnswer: `${beides}/${kuchen}`,
          answerText: probText(beides, kuchen),
          solution: `Die Bedingung „Kuchen“ schränkt auf ${fmt(kuchen)} Gäste ein – nur diese Zahl darf in den Nenner:<br>` +
            `P(Kaffee | Kuchen) = ${frac(fmt(beides), fmt(kuchen))} = ${probText(beides, kuchen)}<br>` +
            `Achtung: ${frac(fmt(beides), fmt(kaffee))} wäre P(Kuchen | Kaffee) – dieselben Gäste, aber eine andere Bezugsgruppe.`
        };
      }
    ],

    /* ---------- Hypergeometrische Verteilung, mittel ---------- */
    'hypergeometrisch:2': [
      () => {
        const N = choice([10, 12, 15, 20]);
        const K = rnd(1, 4), n = choice([3, 4]);
        const num = binom(N - K, n), den = binom(N, n);
        return {
          q: `Eine Lieferung enthält ${fmt(N)} Geräte, davon ${plural(K, 'ist 1 defekt', `sind ${fmt(K)} defekt`)}. Zur Kontrolle werden ${fmt(n)} Geräte ohne Zurücklegen geprüft. Wie groß ist die Wahrscheinlichkeit, dass kein defektes dabei ist? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Hypergeometrisch mit N = ${fmt(N)}, K = ${fmt(K)}, n = ${fmt(n)} und k = 0:<br>` +
            `P(X = 0) = (${fmt(K)} über 0) · (${fmt(N - K)} über ${fmt(n)}) / (${fmt(N)} über ${fmt(n)}) ` +
            `= 1 · ${fmt(num)} / ${fmt(den)} = ${probText(num, den)}<br>` +
            `Alle ${fmt(n)} geprüften Geräte müssen also aus den ${fmt(N - K)} einwandfreien stammen.`
        };
      },
      () => {
        const n = choice([3, 4, 5]);
        const num = binom(4, 1) * binom(28, n - 1), den = binom(32, n);
        return {
          q: `Aus einem Skatblatt mit 32 Karten – darunter 4 Asse – werden ${fmt(n)} Karten ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für genau ein Ass? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Karten werden nicht zurückgelegt – also hypergeometrisch mit N = 32, K = 4, n = ${fmt(n)}, k = 1:<br>` +
            `günstig: (4 über 1) · (28 über ${fmt(n - 1)}) = 4 · ${fmt(binom(28, n - 1))} = ${fmt(num)}<br>` +
            `möglich: (32 über ${fmt(n)}) = ${fmt(den)}<br>` +
            `P(X = 1) = ${frac(fmt(num), fmt(den))} = ${probText(num, den)}`
        };
      },
      () => {
        const N = choice([12, 15, 20]);
        const K = choice([3, 4, 5]), n = choice([3, 4]);
        const keine = binom(N - K, n), den = binom(N, n);
        const num = den - keine;
        return {
          q: `In einer Lostrommel liegen ${fmt(N)} Lose, davon ${fmt(K)} Gewinnlose. Du ziehst ${fmt(n)} Lose ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für mindestens einen Gewinn? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `„Mindestens einer“ geht am schnellsten über das Gegenereignis „kein Gewinn“:<br>` +
            `P(X = 0) = (${fmt(N - K)} über ${fmt(n)}) / (${fmt(N)} über ${fmt(n)}) = ${frac(fmt(keine), fmt(den))}<br>` +
            `P(X ≥ 1) = 1 − ${frac(fmt(keine), fmt(den))} = ${frac(fmt(num), fmt(den))} = ${probText(num, den)}<br>` +
            `Der direkte Weg über k = 1, 2, … wäre deutlich mehr Rechnerei.`
        };
      }
    ],

    /* ---------- Normalverteilung, leicht ---------- */
    'normalverteilung:1': [
      () => {
        const mu = rnd(4, 20) * 10, sigma = choice([4, 5, 8, 10, 12, 15]);
        const anteil = choice([1, 2]);
        const unten = mu - anteil * sigma, oben = mu + anteil * sigma;
        const prozent = anteil === 1 ? 68 : 95;
        const frageNachUnten = choice([true, false]);
        const antwort = frageNachUnten ? unten : oben;
        return {
          q: `X ist normalverteilt mit μ = ${mu} und σ = ${sigma}. Im Intervall mit ca. ${prozent} % der Werte – wie lautet die ${frageNachUnten ? 'untere' : 'obere'} Grenze?`,
          type: 'input', placeholder: 'Grenze',
          check: numCheck(antwort), testAnswer: String(antwort), answerText: String(antwort),
          /* Die Grenzen sind die einzige Rechnung dieser Aufgabe – sie steht
             deshalb ausgeschrieben da, wie auf der Seite („62 ± 2 · 4 = [54; 70]“).
             Bei einer Standardabweichung „μ ± σ“, nicht „μ ± 1σ“, und ohne „1 ·“. */
          solution: `${prozent} % der Werte liegen im Bereich μ ± ${anteil === 1 ? '' : '2'}σ:<br>` +
            `${fmt(mu)} − ${anteil === 1 ? '' : '2 · '}${fmt(sigma)} = ${fmt(unten)} und ` +
            `${fmt(mu)} + ${anteil === 1 ? '' : '2 · '}${fmt(sigma)} = ${fmt(oben)}.<br>` +
            `Das Intervall ist [${fmt(unten)}; ${fmt(oben)}] – die ${frageNachUnten ? 'untere' : 'obere'} Grenze ist <strong>${fmt(antwort)}</strong>.`
        };
      },
      () => {
        const mu = rnd(4, 20) * 10, sigma = choice([5, 10, 15, 20]);
        /* Der Denkschritt ist die Zuordnung der Grenze zu μ ± kσ (Schritt 3 der
           Seite, „480 ml ist μ − 2σ“ im Selbstcheck) – dort entsteht der typische
           Fehler 16 % statt 2,5 %. Deshalb beginnt der Weg mit dieser Zeile. */
        const m = fmt(mu), s = fmt(sigma);
        const faelle = [
          [`P(X ≤ ${mu})`, 50, 'Die Kurve ist symmetrisch um μ – genau die Hälfte liegt darunter.'],
          [`P(X ≥ ${mu})`, 50, 'Die Kurve ist symmetrisch um μ – genau die Hälfte liegt darüber.'],
          [`P(X ≥ ${mu + sigma})`, 16, `${fmt(mu + sigma)} = ${m} + ${s} = μ + σ.<br>Außerhalb von μ ± σ liegen 32 %, davon die Hälfte oben.`],
          [`P(X ≤ ${mu - sigma})`, 16, `${fmt(mu - sigma)} = ${m} − ${s} = μ − σ.<br>Außerhalb von μ ± σ liegen 32 %, davon die Hälfte unten.`],
          [`P(X ≥ ${mu + 2 * sigma})`, 2.5, `${fmt(mu + 2 * sigma)} = ${m} + 2 · ${s} = μ + 2σ.<br>Außerhalb von μ ± 2σ liegen 5 %, davon die Hälfte oben.`]
        ];
        const [frageText, antwort, erklaerung] = choice(faelle);
        return {
          q: `X ist normalverteilt mit μ = ${mu} und σ = ${sigma}. Wie groß ist ${frageText} ungefähr (in %)?`,
          type: 'input', placeholder: 'in %',
          check: numCheck(antwort, 0.6, { prozent: true }), testAnswer: String(antwort), answerText: `ca. ${fmt(antwort)} %`,
          solution: `${erklaerung}<br>Also <strong>ca. ${fmt(antwort)} %</strong>.`
        };
      }
    ],

    /* ---------- Normalverteilung, schwer ----------
       Der Originalgenerator fragt immer in dieselbe Richtung: Intervall
       gegeben, Anteil gesucht. Diese fünf drehen die Frage um (Schranke,
       σ, z-Wert), verlangen ein unsymmetrisches Intervall oder eine
       Stückzahl statt eines Prozentsatzes. */
    'normalverteilung:3': [
      () => {
        // Rückwärts: nicht der Anteil ist gesucht, sondern die Schranke.
        const orte = [
          ['Die Ladezeit eines Akkus', 'min', 300, 25],
          ['Das Gewicht der Äpfel einer Ernte', 'g', 160, 12],
          ['Die Brenndauer einer Lampe', 'h', 1200, 90],
          ['Die Bearbeitungszeit einer Klausur', 'min', 90, 8]
        ];
        const [was, einheit, mu, sigma] = choice(orte);
        const faelle = [
          ['überschreiten', 2.5, mu + 2 * sigma, 'Oberhalb von μ + 2σ liegen 2,5 % – die Hälfte der 5 % außerhalb von μ ± 2σ.'],
          ['überschreiten', 16, mu + sigma, 'Oberhalb von μ + σ liegen 16 % – die Hälfte der 32 % außerhalb von μ ± σ.'],
          ['unterschreiten', 2.5, mu - 2 * sigma, 'Unterhalb von μ − 2σ liegen 2,5 % – die Hälfte der 5 % außerhalb von μ ± 2σ.'],
          ['unterschreiten', 16, mu - sigma, 'Unterhalb von μ − σ liegen 16 % – die Hälfte der 32 % außerhalb von μ ± σ.']
        ];
        const [richtung, anteil, wert, begruendung] = choice(faelle);
        return {
          q: `${was} ist normalverteilt mit μ = ${fmt(mu)} ${einheit} und σ = ${fmt(sigma)} ${einheit}. Etwa ${fmt(anteil)} % der Werte ${richtung} welche Schranke? <span class="hint">Sigma-Regeln verwenden, Antwort in ${einheit}.</span>`,
          type: 'input', placeholder: `Schranke in ${einheit}`,
          check: numCheck(wert), testAnswer: String(wert), answerText: `${fmt(wert)} ${einheit}`,
          solution: `Hier ist der Anteil bekannt und die Schranke gesucht – die Sigma-Regel wird rückwärts gelesen.<br>` +
            `${begruendung}<br>` +
            `Schranke = ${fmt(mu)} ${anteil === 2.5 ? (richtung === 'überschreiten' ? '+ 2 · ' : '− 2 · ') : (richtung === 'überschreiten' ? '+ ' : '− ')}${fmt(sigma)} = <strong>${fmt(wert)} ${einheit}</strong>`
        };
      },
      () => {
        // Umkehrung der z-Transformation. Die Hinrichtung (x gegeben, z gesucht)
        // steht schon auf Stufe 2 – und dort sogar ohne Formelangabe, „Schwer“
        // wäre also die leichtere Aufgabe gewesen. Hier ist z gegeben und der
        // Rohwert gesucht: dieselbe Formel, aber nach x umgestellt.
        const mu = rnd(4, 20) * 10, sigma = choice([4, 5, 8, 10, 12, 20, 25]);
        const z = choice([-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
        const x = mu + z * sigma;
        return {
          q: `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Welcher Wert x gehört zum z-Wert ${fmt(z)}?`,
          type: 'input', placeholder: 'Wert x',
          check: numCheck(x, 0.005), testAnswer: String(x),
          answerText: `x = ${fmt(x)}`,
          // Wortlaut wie im Seitenabschnitt „Rückwärts: vom z-Wert zum Rohwert“.
          solution: `Der z-Wert wird mit z = (x − μ)/σ berechnet. Gesucht ist diesmal der Rohwert x – also die Formel nach x umstellen:<br>` +
            `z · σ = x − μ &ensp;⟹&ensp; <strong>x = μ + z · σ</strong><br>` +
            `x = ${fmt(mu)} + ${par(z)} · ${fmt(sigma)} = ${fmt(mu)} ${z < 0 ? '−' : '+'} ${fmt(Math.abs(z * sigma))} = <strong>${fmt(x)}</strong><br>` +
            `Plausibel: z = ${fmt(z)} heißt „${plural(z, 'eine Standardabweichung', `${fmt(Math.abs(z))} Standardabweichungen`)} ${z < 0 ? 'unter' : 'über'} dem Mittelwert" – und ${fmt(x)} liegt ${z < 0 ? 'unter' : 'über'} ${fmt(mu)} ✓<br>` +
            `<em>Nicht</em> μ · z rechnen: σ ist der Maßstab, μ nur der Nullpunkt.`
        };
      },
      () => {
        // σ aus einem Intervall zurückrechnen.
        const mu = rnd(4, 20) * 10, sigma = choice([4, 5, 8, 10, 12, 15, 20]);
        const anteil = choice([1, 2]);
        const unten = mu - anteil * sigma, oben = mu + anteil * sigma;
        const prozent = anteil === 1 ? 68 : 95;
        return {
          q: `X ist normalverteilt mit μ = ${fmt(mu)}. Etwa ${prozent} % der Werte liegen zwischen ${fmt(unten)} und ${fmt(oben)}. Wie groß ist σ?`,
          type: 'input', placeholder: 'σ',
          check: numCheck(sigma), testAnswer: String(sigma), answerText: `σ = ${fmt(sigma)}`,
          solution: `${prozent} % gehören zum Intervall μ ± ${anteil === 1 ? 'σ' : '2σ'} – die halbe Intervallbreite ist also ${anteil === 1 ? 'σ' : '2σ'}.<br>` +
            `Breite = ${fmt(oben)} − ${fmt(unten)} = ${fmt(oben - unten)}, halbe Breite = ${fmt(anteil * sigma)}<br>` +
            `${anteil === 1 ? `σ = <strong>${fmt(sigma)}</strong>` : `2σ = ${fmt(anteil * sigma)}, also σ = ${fmt(anteil * sigma)} / 2 = <strong>${fmt(sigma)}</strong>`}<br>` +
            `Probe: ${fmt(mu)} ± ${anteil === 1 ? '' : '2 · '}${fmt(sigma)} = [${fmt(unten)}; ${fmt(oben)}] ✓`
        };
      },
      () => {
        // Unsymmetrisches Intervall – die Hälften müssen einzeln addiert werden.
        const mu = rnd(4, 20) * 10, sigma = choice([4, 5, 8, 10, 12, 15]);
        const links = choice([1, 2]), rechts = links === 1 ? 2 : 1;
        const halb = { 1: 34, 2: 47.5 };
        const prozent = halb[links] + halb[rechts];
        // Erst die Grenzen zuordnen (Schritt 3 der Seite) – daran sieht man die Unsymmetrie.
        const m = fmt(mu), s = fmt(sigma);
        const zuordnung = `${fmt(mu - links * sigma)} = ${m} − ${links === 1 ? '' : '2 · '}${s} = μ − ${links === 1 ? '' : '2'}σ und ` +
          `${fmt(mu + rechts * sigma)} = ${m} + ${rechts === 1 ? '' : '2 · '}${s} = μ + ${rechts === 1 ? '' : '2'}σ.`;
        return {
          q: `X ist normalverteilt mit μ = ${fmt(mu)} und σ = ${fmt(sigma)}. Etwa wie viel Prozent der Werte liegen zwischen ${fmt(mu - links * sigma)} und ${fmt(mu + rechts * sigma)}? <span class="hint">Sigma-Regeln verwenden.</span>`,
          type: 'input', placeholder: 'in %',
          check: numCheck(prozent, 0.6, { prozent: true }), testAnswer: String(prozent), answerText: `ca. ${fmt(prozent)} %`,
          solution: `${zuordnung}<br>` +
            `Das Intervall ist also <strong>nicht</strong> symmetrisch: links ${links === 1 ? 'σ' : '2σ'}, rechts ${rechts === 1 ? 'σ' : '2σ'}. Die Sigma-Regel gilt aber nur für symmetrische Bereiche – also beide Hälften einzeln nehmen.<br>` +
            `Von μ bis μ − ${links === 1 ? '' : '2'}σ: die Hälfte von ${links === 1 ? '68' : '95'} % = ${fmt(halb[links])} %<br>` +
            `Von μ bis μ + ${rechts === 1 ? '' : '2'}σ: die Hälfte von ${rechts === 1 ? '68' : '95'} % = ${fmt(halb[rechts])} %<br>` +
            `Zusammen: ${fmt(halb[links])} % + ${fmt(halb[rechts])} % = <strong>ca. ${fmt(prozent)} %</strong>`
        };
      },
      () => {
        // Vom Anteil zur Stückzahl – der Schritt, den Sachaufgaben verlangen.
        // Nur Vielfache von 200 – sonst kommen bei 2,5 % halbe Packungen heraus.
        const stueck = choice([200, 400, 600, 800, 1000, 2000]);
        // Feste μ/σ-Paare statt freier Wahl: Bei μ = 60 g und σ = 20 g läge
        // μ − 3σ bei 0 g, es gäbe also Packungen mit negativem Gewicht.
        const [mu, sigma] = choice([[125, 5], [200, 8], [250, 10], [400, 12], [500, 15], [750, 20], [1000, 25]]);
        /* Vor der Sigma-Regel steht die Zuordnung der Grenzen zu μ ± kσ
           (Schritt 3 der Seite) – wie im Grundgenerator derselben Stufe. */
        const m = fmt(mu), s = fmt(sigma);
        const plus1 = `${fmt(mu + sigma)} = ${m} + ${s} = μ + σ`;
        const minus1 = `${fmt(mu - sigma)} = ${m} − ${s} = μ − σ`;
        const plus2 = `${fmt(mu + 2 * sigma)} = ${m} + 2 · ${s} = μ + 2σ`;
        const minus2 = `${fmt(mu - 2 * sigma)} = ${m} − 2 · ${s} = μ − 2σ`;
        const faelle = [
          [`außerhalb des Bereichs ${fmt(mu - 2 * sigma)} g bis ${fmt(mu + 2 * sigma)} g`, 5, `${minus2} und ${plus2}.<br>Außerhalb von μ ± 2σ liegen 5 %.`],
          [`außerhalb des Bereichs ${fmt(mu - sigma)} g bis ${fmt(mu + sigma)} g`, 32, `${minus1} und ${plus1}.<br>Außerhalb von μ ± σ liegen 32 %.`],
          [`mit mehr als ${fmt(mu + sigma)} g`, 16, `${plus1}.<br>Oberhalb von μ + σ liegen 16 %.`],
          [`mit weniger als ${fmt(mu - 2 * sigma)} g`, 2.5, `${minus2}.<br>Unterhalb von μ − 2σ liegen 2,5 %.`]
        ];
        const [bereich, prozent, begruendung] = choice(faelle);
        const anzahl = stueck * prozent / 100;
        return {
          q: `Ein Betrieb füllt ${fmt(stueck)} Packungen ab. Das Füllgewicht ist normalverteilt mit μ = ${fmt(mu)} g und σ = ${fmt(sigma)} g. Mit etwa wie vielen Packungen ${bereich} ist zu rechnen? <span class="hint">Sigma-Regeln, Antwort als Stückzahl.</span>`,
          type: 'input', placeholder: 'Anzahl Packungen',
          check: numCheck(anzahl, 0.5), testAnswer: String(anzahl), answerText: `ca. ${fmt(anzahl)} Packungen`,
          solution: `${begruendung}<br>` +
            `Der Anteil wird zur Stückzahl, indem man ihn auf die Gesamtzahl anwendet:<br>` +
            `${fmt(prozent)} % von ${fmt(stueck)} = ${fmt(prozent)} / 100 · ${fmt(stueck)} = <strong>ca. ${fmt(anzahl)} Packungen</strong><br>` +
            `Die Sigma-Regeln sind Näherungen – „ca.“ gehört zur Antwort dazu.`
        };
      }
    ],

    /* ---------- Logarithmen, leicht ---------- */
    'logarithmen:1': [
      () => {
        const b = choice([2, 3, 5, 10]);
        const e = b === 2 ? rnd(2, 7) : b === 3 ? rnd(2, 4) : b === 5 ? rnd(2, 3) : rnd(2, 4);
        const x = b ** e;
        return {
          q: `Für welche Zahl x gilt log<sub>${fmt(b)}</sub>(x) = ${fmt(e)}?`,
          type: 'input', placeholder: 'x = ?',
          check: numCheck(x), testAnswer: String(x), answerText: `x = ${fmt(x)}`,
          solution: `Der Logarithmus nennt den Exponenten – hier ist er schon bekannt und das Argument gesucht.<br>` +
            `log<sub>${fmt(b)}</sub>(x) = ${fmt(e)} heißt übersetzt ${fmt(b)}<sup>${fmt(e)}</sup> = x.<br>` +
            `x = ${fmt(b)}<sup>${fmt(e)}</sup> = <strong>${fmt(x)}</strong>`
        };
      },
      () => {
        const b = choice([2, 3, 4, 5, 7, 10]);
        const faelle = [
          [`log<sub>${fmt(b)}</sub>(1)`, 0, `Jede Basis hoch 0 ergibt 1: ${fmt(b)}<sup>0</sup> = 1.`],
          [`log<sub>${fmt(b)}</sub>(${fmt(b)})`, 1, `Die Basis hoch 1 ist die Basis selbst: ${fmt(b)}<sup>1</sup> = ${fmt(b)}.`],
          [`log<sub>${fmt(b)}</sub>(${fmt(b * b)})`, 2, `${fmt(b)}<sup>2</sup> = ${fmt(b * b)}.`]
        ];
        const [term, wert, begruendung] = choice(faelle);
        return {
          q: `Berechne ohne Taschenrechner: ${term}`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(wert), testAnswer: String(wert), answerText: fmt(wert),
          solution: `Frage dich: „${fmt(b)} hoch was?“<br>${begruendung}<br>` +
            `Also ist ${term} = <strong>${fmt(wert)}</strong>.`
        };
      },
      () => {
        const b = choice([2, 3, 5]);
        let e = rnd(2, 4);
        // b = e machte einen Ablenker mit der Lösung identisch, und 2⁴ = 4² ist der
        // eine Fall, in dem der vertauschte Ablenker log₄(16) = 2 selbst wahr wäre.
        while (e === b || (b === 2 && e === 4)) e = rnd(2, 4);
        const x = b ** e;
        const richtig = `log<sub>${fmt(b)}</sub>(${fmt(x)}) = ${fmt(e)}`;
        // Jeder Ablenker vertauscht genau zwei der drei Rollen. Weil b, e und x
        // nach der Schleife oben paarweise verschieden sind, ist jeder Tausch
        // an seiner Option eindeutig abzulesen.
        const w = auswahl(richtig, [
          `log<sub>${fmt(e)}</sub>(${fmt(x)}) = ${fmt(b)}`,
          `log<sub>${fmt(x)}</sub>(${fmt(b)}) = ${fmt(e)}`,
          `log<sub>${fmt(b)}</sub>(${fmt(e)}) = ${fmt(x)}`
        ], [
          `Hier sind Basis und Exponent vertauscht – unten steht ${fmt(e)}, der Exponent.`,
          `Hier sind Basis und Argument vertauscht – unten steht ${fmt(x)}, das Ergebnis der Potenz.`,
          `Hier sind Argument und Exponent vertauscht – in der Klammer steht ${fmt(e)}, der Exponent.`
        ]);
        return {
          q: `Es gilt ${fmt(b)}<sup>${fmt(e)}</sup> = ${fmt(x)}. Welche Logarithmus-Schreibweise gehört dazu?`,
          type: 'choice', options: w.options, correct: w.correct, gruende: w.gruende, answerText: richtig,
          solution: `Potenz und Logarithmus sind dieselbe Aussage von zwei Seiten:<br>` +
            `b<sup>n</sup> = x&nbsp;⇔&nbsp;log<sub>b</sub>(x) = n<br>` +
            `Die Basis bleibt unten, das Ergebnis der Potenz wandert in die Klammer, der Exponent ist die Lösung:<br>` +
            `<strong>${richtig}</strong>`
        };
      }
    ],

    /* ---------- Ableitungen, leicht ---------- */
    'ableitungen:1': [
      () => {
        // Der Exponent 1 wird nie ausgeschrieben – sonst stünde einmal „4x“ und
        // einmal „4x¹“ zur Auswahl, also zweimal dieselbe Ableitung.
        const pot = c => `${c}x`;
        // Exponent fest auf 2: Der Fall a · x² ist der erste, den man mit
        // Vorfaktor rechnet. Höhere Potenzen mit Vorfaktor sind Stufe 2 –
        // vorher waren n ∈ [2,5] hier und n ∈ [2,4] dort, also fast dieselbe
        // Aufgabe auf zwei Stufen.
        const n = 2;
        // a ab 3: Bei a = 2 fielen „addiert“ (a + 2) und die Nachbarableitung
        // 2(a − 1) mit der Lösung 2a bzw. mit a·x zusammen.
        const a = rnd(3, 9);
        const richtig = pot(a * n);
        /* Ratbare Struktur (ratbar.js): Mit den drei festen Ablenkern a·x,
           (a + 2)·x und 2a·x² war der Koeffizient der Lösung immer der größte
           und kam als einziger zweimal vor – „eine der beiden 18“ traf 51 %
           statt 25 %.
           Jetzt haben alle vier Optionen die Bauart „Zahl·x“; sie unterscheiden
           sich nur im Faktor, und rangAuswahl würfelt zuerst, den wievielt-
           größten die Lösung trägt. Die Ableitungen der Nachbarfunktionen
           (a ± 1)x², (a ± 2)x² und (a + 3)x² sind kein Denkfehler, sondern
           Zahlen derselben Form und Größe. Ohne sie stünde über 2a nur ein
           einziger Kandidat (3a) – die Lösung wäre fast immer die größte Zahl. */
        const w = rangAuswahl(richtig, a * n, [
          // „a·x“ ist der wichtigste Ablenker (den Exponenten nicht als Faktor
          // genommen) und zugleich der heikelste: Die Lösung 2a ist genau sein
          // Doppeltes, und „die Option, die das Doppelte einer anderen ist“ ist
          // eine blinde Regel. Deshalb steht er zwischen sechs weiteren
          // Kandidaten und erscheint in rund einer von fünf Ziehungen – oft
          // genug als Diagnose, selten genug, dass die Regel nicht greift.
          // Gründe nur an den fünf Fehlerwegen. Für a = 3 … 9 sind a, 2, a + 2,
          // 3a und 4a paarweise verschieden und nie 2a; fällt einer mit einer
          // Nachbarableitung zusammen (a + 2 = 2(a − 1) bei a = 4), trägt die
          // Option trotzdem genau diesen Fehler – die Nachbarn haben keinen Grund.
          [pot(a), a, `Hier ist der Exponent ${n} nur verringert, aber nicht als Faktor nach vorn gezogen.`],
          [pot(n), n, `Das ist die Ableitung von x<sup>${n}</sup> allein – der Vorfaktor ${a} ist verloren gegangen.`],
          [pot(a + n), a + n, `Hier ist der Exponent ${n} zum Vorfaktor ${a} addiert statt mit ihm multipliziert.`],
          [pot(a * (n + 1)), a * (n + 1), `Hier ist mit ${n + 1} multipliziert, dem um 1 erhöhten Exponenten – beim Ableiten kommt der alte Exponent nach vorn.`],
          [pot(2 * (a - 1)), 2 * (a - 1)],      // Ableitung von (a − 1)x²
          [pot(2 * (a - 2)), 2 * (a - 2)],      // Ableitung von (a − 2)x²
          [pot(2 * (a + 1)), 2 * (a + 1)],      // Ableitung von (a + 1)x²
          [pot(2 * (a + 2)), 2 * (a + 2)],      // Ableitung von (a + 2)x²
          [pot(2 * (a + 3)), 2 * (a + 3)],      // Ableitung von (a + 3)x²
          // 4a ist genau das Doppelte der Lösung. Damit ist die Lösung nicht
          // mehr die einzige Option, die das Doppelte einer anderen ist,
          // sobald „a·x“ mit im Spiel ist.
          [pot(4 * a), 4 * a, `Hier ist der Exponent ${n} zweimal als Faktor genommen statt einmal.`]
        ]);
        return {
          q: `Leite ab: f(x) = ${a}x<sup>${n}</sup>`,
          type: 'choice', options: w.options, correct: w.correct, gruende: w.gruende, answerText: richtig,
          // Schreibweise der Faktorregel auf der Erklärseite: (5x²)′ = 10x. Das
          // „x¹“, das hier vorher stand, kommt dort nicht vor – und die Optionen
          // schreiben den Exponenten 1 aus demselben Grund nie aus (siehe oben).
          solution: `Faktorregel: Der Vorfaktor bleibt, die Potenzregel wirkt auf x<sup>${n}</sup>:<br>` +
            `f′(x) = ${fmt(a)} · ${pot(n)} = <strong>${richtig}</strong>`
        };
      },
      () => {
        /* Ratbare Struktur, zwei Runden:
           1. Mit den festen Ablenkern a·x, a + b und b war die Steigung a nie
              die größte und nie die kleinste der vier Zahlen – „die nackte
              Zahl in der Mitte" traf 51 % statt 25 %.
           2. Danach wurde der Rang der Lösung zuerst gewürfelt, die Füllwerte
              waren aber die Nachbarsteigungen a ± 1, a ± 2, a ± 3 – sie lagen
              symmetrisch um die Lösung. Der Rang war damit gleichverteilt, die
              Lage nicht: „die Zahl am nächsten am Mittelwert der Optionen“
              traf 47 % (ratbar2.js, n = 33 059), „die einzige gerade Zahl“
              41 %, weil a ± 1 und a ± 3 die andere Parität tragen.
           Jetzt entstehen zuerst die vier Zahlen, und erst danach wird
           gewürfelt, welche davon die Steigung a und welche die Konstante b
           ist – die Aufgabe folgt aus der Auswahl. Jede der vier Zahlen ist
           damit gleich wahrscheinlich die Lösung, und jede blinde Regel, die
           nur die Optionen ansieht (Größe, Lage zum Mittelwert, Parität,
           Häufigkeit), trifft genau ein Viertel.
           Alle Werte liegen in 2 … 9: einstellig, damit keine Option durch
           ihre Länge auffällt, und ohne 1 – a = 1 würde als „x + b“ ohne
           Zahl geschrieben, und eine 1, die nur als Ablenker vorkäme, wäre
           nie die Lösung. b steht immer unter den Optionen, sonst wäre die
           Lösung die einzige Zahl aus der Aufgabe. */
        // Die Menge enthält immer eine Summe x + y: Wird aus x und y das Paar
        // (a, b), steht „beide addiert“ als Ablenker da – in rund einer von
        // fünf Aufgaben, so oft wie vorher. Die Lösung ist dabei nicht öfter
        // Summand als Summe oder vierter Wert, weil a erst danach fällt.
        let x, y, z;
        do { x = rnd(2, 9); y = rnd(2, 9); } while (x === y || x + y > 9);
        do { z = rnd(2, 9); } while (z === x || z === y || z === x + y);
        const werte = [x, y, x + y, z];
        const a = choice(werte);
        const b = choice(werte.filter(v => v !== a));
        const ablenker = werte.filter(v => v !== a);
        const richtig = fmt(a);
        // Gründe nur an b und an a + b. Die übrigen Werte v sind Füllwerte –
        // die Ableitungen der Nachbargeraden v·x + b, kein Denkfehler.
        const w = makeChoice(richtig, ablenker.map(v => fmt(v)), ablenker.map(v =>
          v === b ? `Das ist die Konstante ${fmt(b)} – beim Ableiten fällt gerade sie weg.`
          : v === a + b ? `Hier ist die Konstante ${fmt(b)} zur Steigung addiert – beim Ableiten fällt sie aber weg.`
          : null));
        return {
          q: `Leite ab: f(x) = ${fmt(a)}x + ${fmt(b)}`,
          type: 'choice', options: w.options, correct: w.correct, gruende: w.gruende, answerText: richtig,
          solution: `(${fmt(a)}x)′ = ${fmt(a)} und (${fmt(b)})′ = 0 – die Konstante fällt weg.<br>` +
            `f′(x) = <strong>${fmt(a)}</strong> (die Steigung der Geraden)`
        };
      }
    ],

    /* ---------- Integrale, leicht ---------- */
    'integrale:1': [
      () => {
        // Ein Potenzsetzer für alle Stellen: Exponent 0 verschwindet samt x,
        // Exponent 1 wird nicht geschrieben, der Faktor 1 entfällt. Vorher
        // standen „10x¹“ in der Frage und „10x⁰“ als Ablenker – beides
        // Schreibweisen, die in keinem Schulbuch vorkommen.
        const pot = (c, e) => e === 0 ? `${c}`
          : `${c === 1 ? '' : c}x${e > 1 ? '<sup>' + e + '</sup>' : ''}`;
        const n = rnd(1, 4), k = rnd(1, 5);
        const a = k * (n + 1);
        const richtig = pot(k, n + 1);
        // Die drei Ablenker haben verschiedene Exponenten (n + 1, n, n − 1) bzw.
        // bei gleichem Exponenten einen anderen Faktor (a ≠ k, weil n ≥ 1) –
        // es sind also immer vier Optionen, und jede ist genau ein Fehler.
        const w = auswahl(richtig, [
          pot(a, n + 1),
          pot(k, n),
          pot(a * n, n - 1)
        ], [
          'Hier ist der Exponent erhöht, aber nicht durch den neuen Exponenten geteilt.',
          'Hier ist durch den neuen Exponenten geteilt, der Exponent selbst aber nicht erhöht.',
          // Wortlaut wie beim Basisgenerator des Themas, damit dieselbe Verwechslung
          // in beiden Aufgabenarten gleich heißt.
          `Das ist die Ableitung von ${pot(a, n)}, keine Stammfunktion.`
        ]);
        return {
          q: `Welche Funktion ist eine Stammfunktion von f(x) = ${pot(a, n)}?`,
          type: 'choice', options: w.options, correct: w.correct, gruende: w.gruende, answerText: `${richtig} + C`,
          solution: `Exponent um 1 erhöhen und durch den neuen Exponenten teilen:<br>` +
            `F(x) = ${pot(a, n + 1)} / ${n + 1} = <strong>${richtig}</strong> + C<br>` +
            `Probe durch Ableiten: (${richtig})′ = ${pot(a, n)} ✓`
        };
      }
    ],

    /* ---------- Integrale, mittel ---------- */
    'integrale:2': [
      () => {
        const a = choice([2, 4, 6, 8]), b = rnd(2, 6);
        const res = a / 2 * b * b;
        return {
          q: `Berechne: ∫<sub>0</sub><sup>${b}</sup> ${a}x dx`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          // Bei a = 2 heißt die Stammfunktion x² – ein „1 · 9“ im Einsetzen wäre
          // ein leerer Schritt mit einem Faktor, den F(x) gar nicht zeigt. Die
          // Erklärseite setzt direkt ein: „F(3) − F(0) = (9 + 3) − 0“.
          solution: `Stammfunktion: F(x) = ${koef(a / 2, 'x²')}<br>` +
            `F(${b}) − F(0) = ${a / 2 === 1 ? fmt(b * b) : fmt(a / 2) + ' · ' + fmt(b * b)} − 0 = <strong>${fmt(res)}</strong>`
        };
      },
      () => {
        const c = rnd(2, 9), von = rnd(0, 3), bis = von + rnd(2, 5);
        const res = c * (bis - von);
        return {
          q: `Berechne: ∫<sub>${von}</sub><sup>${bis}</sup> ${c} dx`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(res), testAnswer: String(res), answerText: fmt(res),
          solution: `Stammfunktion einer Konstanten: F(x) = ${c}x<br>` +
            `F(${bis}) − F(${von}) = ${c * bis} − ${c * von} = <strong>${fmt(res)}</strong><br>` +
            `<em>Anschaulich:</em> ein Rechteck der Höhe ${c} und Breite ${bis - von}.`
        };
      }
    ],

    /* ---------- Binomialverteilung, leicht ---------- */
    'binomial:1': [
      () => {
        const n = rnd(3, 6), k = rnd(1, n - 1);
        const num = binom(n, k), den = 2 ** n;
        const bsp = beispielBruch(num, den);
        return {
          q: `Eine faire Münze wird ${n}-mal geworfen. Wie groß ist die Wahrscheinlichkeit für genau ${k}-mal Kopf? <span class="hint">Als Bruch (z. B. ${bsp}) oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${bsp}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          // Der Basisgenerator derselben Stufe kürzt und ergänzt den Dezimalwert.
          // Hier stand der rohe Bruch: Dieselbe Münzaufgabe bekam einmal
          // „3/8 = 0,375“ und einmal „6/16“ als Antwort.
          answerText: probText(num, den),
          solution: `Bernoulli-Formel mit n = ${n}, k = ${k}, p = ${frac(1, 2)}:<br>` +
            `P(X = ${k}) = (${n} über ${k}) · ${frac(1, 2)}<sup>${n}</sup> = ${num} · ${frac(1, den)} = ${probKuerzung(num, den)}`
        };
      },
      () => {
        const n = rnd(4, 30) * 2;
        return {
          q: `Eine faire Münze wird ${n}-mal geworfen. Wie viele Kopf-Würfe sind zu erwarten?`,
          type: 'input', placeholder: 'E(X)',
          check: numCheck(n / 2), testAnswer: String(n / 2), answerText: String(n / 2),
          solution: `E(X) = n · p = ${n} · ${frac(1, 2)} = <strong>${n / 2}</strong>`
        };
      }
    ]
,

    /* ---------- Binomialverteilung, schwer ---------- */
    'binomial:3': [
      () => {
        // Kumuliert: „höchstens einmal“ verlangt P(0) + P(1) – der Additionsschritt
        // fehlte auf dieser Stufe bisher völlig.
        const n = rnd(5, 10);
        const num = 1 + n, den = 2 ** n;
        return {
          q: `Eine faire Münze wird ${fmt(n)}-mal geworfen. Wie groß ist die Wahrscheinlichkeit für <em>höchstens einmal</em> Kopf? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `„Höchstens einmal“ heißt k = 0 <em>oder</em> k = 1 – beide Fälle zählen und werden addiert:<br>` +
            `P(X = 0) = (${fmt(n)} über 0) · ${frac(1, 2)}<sup>${fmt(n)}</sup> = ${frac(1, den)}<br>` +
            `P(X = 1) = (${fmt(n)} über 1) · ${frac(1, 2)}<sup>${fmt(n)}</sup> = ${frac(n, den)}<br>` +
            `P(X ≤ 1) = ${frac(1, den)} + ${frac(n, den)} = ${probKuerzung(num, den)}<br>` +
            `Der Nenner ${fmt(den)} bleibt dabei stehen – er zählt alle ${fmt(den)} möglichen Wurffolgen, addiert werden nur die Zähler.`
        };
      },
      () => {
        // Umgekehrte Fragerichtung: nicht P berechnen, sondern n bestimmen. Der Weg
        // führt über das Gegenereignis und eine Ungleichung – deutlich schwerer.
        const situationen = [
          ['eine faire Münze', 'werfen', 'mindestens einmal Kopf fällt', 2],
          ['einen fairen Würfel', 'werfen', 'mindestens eine Sechs fällt', 6],
          ['ein Glücksrad mit 4 gleich großen Feldern (1 Gewinnfeld)', 'drehen', 'mindestens ein Gewinn dabei ist', 4],
          ['ein Glücksrad mit 10 gleich großen Feldern (1 Gewinnfeld)', 'drehen', 'mindestens ein Gewinn dabei ist', 10]
        ];
        const [objekt, verb, ziel, m] = choice(situationen);
        const schwelle = choice([90, 95, 99]);
        const gegen = frac(m - 1, m);
        const q0 = (m - 1) / m;
        let n = 1;
        while (1 - Math.pow(q0, n) < schwelle / 100) n++;
        // Vier Nachkommastellen: Auf drei gerundet sähe 1 − (5/6)²⁵ ≈ 0,9895 wie
        // „0,99“ aus – die Probe würde also scheinbar schon vorher aufgehen.
        // Landet auch der Wert mit vier Stellen genau auf der Schwelle, kommt eine
        // Stelle dazu: 1 − (3/4)¹⁶ = 0,98998 stand sonst als „≈ 0,99 ✗“ neben
        // „> 0,99" – dieselbe Zahl, einmal durchgefallen.
        // Das Zeichen kommt mit dem Wert, wie bei probText: Bei der Münze geht
        // 1 − (1/2)⁴ = 15/16 genau als 0,9375 auf, dort wäre „≈“ falsch.
        const p4 = (k) => {
          const w = 1 - Math.pow(q0, k);
          for (let st = 4; ; st++) {
            const r = Math.round(w * 10 ** st) / 10 ** st;
            if (r !== schwelle / 100 || st >= 8) return `${r === w ? '=' : '≈'} ${fmt(r)}`;
          }
        };
        const s = fmt(schwelle / 100), rest = fmt(1 - schwelle / 100);
        // Der Logarithmus steht wie auf der Erklärseite als log(5/6), nicht als
        // log(0,8333) – im gerundeten Wert erkennt man den Bruch nicht wieder.
        // Sein Zahlenwert (dekadisch, wie dort) zeigt nur das Vorzeichen.
        const logQ = fmt(Math.round(Math.log10(q0) * 10000) / 10000);
        return {
          q: `Wie oft muss man ${objekt} mindestens ${verb}, damit mit einer Wahrscheinlichkeit von über ${fmt(schwelle)} % ${ziel}?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(n), testAnswer: String(n), answerText: `${fmt(n)}`,
          // Schritte wie im Beispiel „Wie oft mindestens?“ der Erklärseite. Vorher
          // fehlte die Zeile n · log(q) < log(…), und das Umdrehen des Zeichens
          // hing am Logarithmieren („Logarithmieren; weil log negativ ist, dreht
          // sich das Zeichen um") – die Seite hängt es ausdrücklich an das
          // Teilen durch die negative Zahl. „Über 95 %“ heißt > wie dort, nicht ≥.
          solution: `Gesucht ist das kleinste n mit P(X ≥ 1) &gt; ${s}. Direkt ist das kaum zu fassen – über das Gegenereignis schon:<br>` +
            `1 − ${gegen}<sup>n</sup> &gt; ${s}, also ${gegen}<sup>n</sup> &lt; ${rest}<br>` +
            `Das n steht im Exponenten – da hilft nur der Logarithmus:<br>` +
            `n · log(${gegen}) &lt; log(${rest})<br>` +
            `log(${gegen}) ≈ ${logQ} ist <strong>negativ</strong>. Teilst du durch eine negative Zahl, dreht sich das Zeichen um:<br>` +
            // Auf zwei Stellen gerundet stand hier „≈ 8“, während die Antwort 9
            // lautet – der exakte Wert ist 8,0039. Wer der Zeile folgt und
            // aufrundet, kommt auf 8 und damit auf die falsche Antwort.
            // Vier Stellen zeigen, dass die Grenze schon überschritten ist.
            `n &gt; log(${rest}) / log(${gegen}) ≈ ${fmt(Math.round(Math.log(1 - schwelle / 100) / Math.log(q0) * 10000) / 10000)}<br>` +
            `n muss eine ganze Zahl sein, also wird <strong>aufgerundet: ${fmt(n)}</strong>.<br>` +
            `Probe: mit ${fmt(n)} ist P(X ≥ 1) ${p4(n)} &gt; ${s} ✓, mit ${fmt(n - 1)} erst ${p4(n - 1)} ✗`
        };
      },
      () => {
        // „Mindestens zwei“: Jetzt reicht ein abgezogener Fall nicht mehr, es sind zwei.
        const n = choice([3, 4, 5]);
        const keine = 5 ** n;
        const genauEine = n * 5 ** (n - 1);
        const den = 6 ** n;
        const num = den - keine - genauEine;
        return {
          q: `Ein fairer Würfel wird ${fmt(n)}-mal geworfen. Wie groß ist die Wahrscheinlichkeit für <em>mindestens zwei</em> Sechsen? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Das Gegenteil von „mindestens zwei“ ist „keine <em>oder</em> genau eine“ – beide Fälle müssen abgezogen werden:<br>` +
            `P(X = 0) = ${frac(5, 6)}<sup>${fmt(n)}</sup> = ${frac(keine, den)}<br>` +
            `P(X = 1) = (${fmt(n)} über 1) · ${frac(1, 6)} · ${frac(5, 6)}<sup>${fmt(n - 1)}</sup> = ${frac(genauEine, den)}<br>` +
            `P(X ≥ 2) = 1 − ${frac(keine, den)} − ${frac(genauEine, den)} = ${probKuerzung(num, den)}<br>` +
            `Wer nur ${frac(keine, den)} abzieht, hat „mindestens <em>eine</em>“ gerechnet – ein Fall zu wenig abgezogen.`
        };
      }
    ],

    /* ---------- Hypergeometrische Verteilung, schwer ---------- */
    'hypergeometrisch:3': [
      () => {
        // Nicht der Volltreffer, sondern der Teiltreffer: erst hier werden beide
        // Binomialkoeffizienten des Zählers gebraucht.
        const N = rnd(8, 12);
        const num = binom(3, 2) * binom(N - 3, 1), den = binom(N, 3);
        return {
          q: `Beim Mini-Lotto werden 3 aus ${fmt(N)} Zahlen gezogen. Du gibst einen Tipp mit 3 Zahlen ab. Wie groß ist die Wahrscheinlichkeit für <em>genau 2</em> Richtige? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Deine 3 getippten Zahlen sind die „Treffer“, die übrigen ${fmt(N - 3)} sind Nieten – also N = ${fmt(N)}, K = 3, n = 3, k = 2:<br>` +
            `günstig: (3 über 2) · (${fmt(N - 3)} über 1) = 3 · ${fmt(N - 3)} = ${fmt(num)}<br>` +
            `möglich: (${fmt(N)} über 3) = ${fmt(den)}<br>` +
            `P(genau 2 Richtige) = ${probKuerzung(num, den)}<br>` +
            `Der zweite Faktor darf nicht fehlen: Zu jedem der 3 möglichen Zweier-Paare gibt es ${fmt(N - 3)} falsche dritte Zahlen.`
        };
      },
      () => {
        // Annahmekennlinie einer Stichprobenprüfung: zwei Summanden, ein Nenner.
        const N = choice([15, 20]);
        const K = choice([3, 4, 5]);
        const n = 4;
        const keine = binom(N - K, n);
        const eine = binom(K, 1) * binom(N - K, n - 1);
        const num = keine + eine, den = binom(N, n);
        return {
          q: `Eine Lieferung von ${fmt(N)} Bauteilen enthält ${fmt(K)} defekte. Der Kunde prüft ${fmt(n)} Teile ohne Zurücklegen und nimmt die Lieferung an, wenn <em>höchstens 1</em> defektes darunter ist. Wie groß ist die Annahme&shy;wahrscheinlichkeit? <span class="hint">Als Bruch oder auf 3 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${beispielBruch(num, den)}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: probText(num, den),
          solution: `Angenommen wird bei k = 0 <em>oder</em> k = 1 defekten Teilen – beides zählt, mit N = ${fmt(N)}, K = ${fmt(K)}, n = ${fmt(n)}:<br>` +
            `P(X = 0) = (${fmt(N - K)} über ${fmt(n)}) / (${fmt(N)} über ${fmt(n)}) = ${frac(fmt(keine), fmt(den))}<br>` +
            `P(X = 1) = (${fmt(K)} über 1) · (${fmt(N - K)} über ${fmt(n - 1)}) / (${fmt(N)} über ${fmt(n)}) = ${frac(fmt(eine), fmt(den))}<br>` +
            `P(Annahme) = ${frac(fmt(keine), fmt(den))} + ${frac(fmt(eine), fmt(den))} = ${probKuerzung(num, den)}<br>` +
            `Der Nenner ${fmt(den)} bleibt stehen – er zählt alle möglichen Stichproben; addiert werden nur die Zähler.`
        };
      },
      () => {
        // Dieselbe Formel, nur mit den Zahlen, die jeder vom Lottoschein kennt.
        const spiel = choice([[49, 13983816], [45, 8145060]]);
        const N = spiel[0], den = spiel[1];
        const k = choice([3, 4]);
        const num = binom(6, k) * binom(N - 6, 6 - k);
        const dez = fmt(Math.round(num / den * 10000) / 10000);
        return {
          q: `Beim Lotto „6 aus ${fmt(N)}“ werden 6 Zahlen ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für genau ${fmt(k)} Richtige? <span class="hint">Als Bruch oder auf 4 Dezimalstellen gerundet.</span>`,
          type: 'input', placeholder: `z. B. ${fmt(beispielZahl(num / den, [0.0321, 0.0417]))}`,
          check: probCheck(num, den), testAnswer: `${num}/${den}`,
          answerText: `${frac(fmt(num), fmt(den))} ≈ ${dez}`,
          solution: `Hypergeometrisch mit N = ${fmt(N)}, K = 6 (deine angekreuzten Zahlen), n = 6, k = ${fmt(k)}:<br>` +
            `günstig: (6 über ${fmt(k)}) · (${fmt(N - 6)} über ${fmt(6 - k)}) = ${fmt(binom(6, k))} · ${fmt(binom(N - 6, 6 - k))} = ${fmt(num)}<br>` +
            `möglich: (${fmt(N)} über 6) = ${fmt(den)}<br>` +
            `P(${fmt(k)} Richtige) = ${frac(fmt(num), fmt(den))} ≈ ${dez}, also rund 1 : ${fmt(Math.round(den / num))}<br>` +
            `Beide Faktoren werden gebraucht: Die ${fmt(6 - k)} übrigen Kreuze müssen aus den ${fmt(N - 6)} <em>nicht</em> gezogenen Zahlen stammen.`
        };
      }
    ],

    /* ---------- Logarithmen, schwer ---------- */
    'logarithmen:3': [
      () => {
        // Das Gesetz wird nicht nur benannt, sondern angewendet – mit ganzzahligem
        // Ergebnis, damit ohne Taschenrechner gerechnet werden kann.
        const b = choice([2, 3, 5, 10]);
        const maxE = b === 2 ? 3 : 2;
        const e1 = rnd(1, maxE), e2 = rnd(1, maxE);
        const addieren = choice([true, false]);
        // Bei der Differenz muss der erste Exponent größer sein, sonst käme ein
        // negatives Ergebnis heraus – hier soll die Regel geübt werden, nicht das.
        const [ea, eb] = addieren ? [e1, e2] : [Math.max(e1, e2) + 1, Math.min(e1, e2)];
        const x1 = b ** ea, x2 = b ** eb;
        const wert = addieren ? ea + eb : ea - eb;
        const zusammen = b ** wert;
        const zeichen = addieren ? '+' : '−';
        const regel = addieren
          ? `log<sub>${fmt(b)}</sub>(u) + log<sub>${fmt(b)}</sub>(v) = log<sub>${fmt(b)}</sub>(u · v)`
          : `log<sub>${fmt(b)}</sub>(u) − log<sub>${fmt(b)}</sub>(v) = log<sub>${fmt(b)}</sub>(u : v)`;
        const innen = addieren ? `${fmt(x1)} · ${fmt(x2)}` : `${fmt(x1)} : ${fmt(x2)}`;
        return {
          q: `Fasse zusammen und berechne: log<sub>${fmt(b)}</sub>(${fmt(x1)}) ${zeichen} log<sub>${fmt(b)}</sub>(${fmt(x2)})`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(wert), testAnswer: String(wert), answerText: fmt(wert),
          solution: `Beide Logarithmen haben dieselbe Basis – also darf zusammengefasst werden:<br>` +
            `<strong>${regel}</strong><br>` +
            `log<sub>${fmt(b)}</sub>(${fmt(x1)}) ${zeichen} log<sub>${fmt(b)}</sub>(${fmt(x2)}) = log<sub>${fmt(b)}</sub>(${innen}) = log<sub>${fmt(b)}</sub>(${fmt(zusammen)}) = <strong>${fmt(wert)}</strong>, denn ${fmt(b)}<sup>${fmt(wert)}</sup> = ${fmt(zusammen)}.<br>` +
            `Kontrolle einzeln: ${fmt(ea)} ${zeichen} ${fmt(eb)} = ${fmt(wert)} ✓ – zusammengefasst werden die <em>Argumente</em> mit · bzw. :, die Logarithmuswerte selbst mit + bzw. −.`
        };
      },
      () => {
        // Exponentialgleichung ohne glatte Lösung: Jetzt führt kein Weg mehr am
        // Basiswechsel vorbei – genau dafür gibt es den Logarithmus.
        const b = choice([2, 3, 5, 7]);
        const zielwerte = [12, 20, 30, 50, 100, 200, 500, 1000];
        // Werte aussortieren, die (fast) eine Potenz von b sind – dort wäre die
        // gerundete Lösung eine glatte Zahl und die Aufgabe verlöre ihren Zweck.
        const v = choice(zielwerte.filter(z => Math.abs(Math.log(z) / Math.log(b) - Math.round(Math.log(z) / Math.log(b))) > 0.02));
        const x = Math.log(v) / Math.log(b);
        const gerundet = Math.round(x * 100) / 100;
        const unten = Math.floor(x);
        return {
          q: `Löse die Gleichung: ${fmt(b)}<sup>x</sup> = ${fmt(v)} <span class="hint">Runde auf 2 Dezimalstellen – Taschenrechner erlaubt.</span>`,
          type: 'input', placeholder: 'x = ?',
          check: numCheck(x, 0.006), testAnswer: String(gerundet), answerText: `x ≈ ${fmt(gerundet)}`,
          solution: `${fmt(v)} ist keine Potenz von ${fmt(b)} – Raten führt hier nicht zum Ziel, der Logarithmus schon:<br>` +
            `x = log<sub>${fmt(b)}</sub>(${fmt(v)})<br>` +
            `Der Taschenrechner kennt aber nur lg und ln, deshalb der Basiswechsel:<br>` +
            // „≈“ schon vor den Dezimalwerten, wie auf der Erklärseite
            // („lg(2) / lg(1,05) ≈ 0,301 / 0,0212 ≈ 14,2“): lg(b) ist für
            // b ∈ {2, 3, 5, 7} immer gerundet.
            `x = lg(${fmt(v)}) / lg(${fmt(b)}) ≈ ${fmt(Math.round(Math.log10(v) * 10000) / 10000)} / ${fmt(Math.round(Math.log10(b) * 10000) / 10000)} ≈ <strong>${fmt(gerundet)}</strong><br>` +
            `Probe: ${fmt(b)}<sup>${fmt(gerundet)}</sup> ≈ ${fmt(Math.round(Math.pow(b, gerundet) * 100) / 100)} ✓<br>` +
            `Plausibel, denn ${fmt(b)}<sup>${fmt(unten)}</sup> = ${fmt(b ** unten)} &lt; ${fmt(v)} &lt; ${fmt(b ** (unten + 1))} = ${fmt(b)}<sup>${fmt(unten + 1)}</sup> – x muss also zwischen ${fmt(unten)} und ${fmt(unten + 1)} liegen.`
        };
      },
      () => {
        // Ein einziger Tabellenwert genügt, wenn man das Potenzgesetz kennt –
        // die klassische Aufgabe „ohne Taschenrechner“.
        const basen = [
          [2, 0.301, [3, 4, 5, 6]],
          [3, 0.477, [2, 3, 4]],
          [5, 0.699, [2, 3]],
          [7, 0.845, [2, 3]]
        ];
        const [z, lg, expos] = choice(basen);
        const n = choice(expos);
        const x = z ** n;
        const wert = Math.round(lg * n * 1000) / 1000;
        const stellen = Math.floor(Math.log10(x));
        return {
          q: `Gegeben ist lg(${fmt(z)}) ≈ ${fmt(lg)}. Bestimme daraus lg(${fmt(x)}) ohne Taschenrechner. <span class="hint">Runde auf 3 Dezimalstellen.</span>`,
          type: 'input', placeholder: 'Ergebnis',
          check: numCheck(wert, 0.006), testAnswer: String(wert), answerText: `≈ ${fmt(wert)}`,
          solution: `Schreibe ${fmt(x)} zuerst als Potenz der gegebenen Zahl: ${fmt(x)} = ${fmt(z)}<sup>${fmt(n)}</sup>.<br>` +
            `Das Potenzgesetz holt den Exponenten als Faktor nach vorn:<br>` +
            `<strong>lg(u<sup>n</sup>) = n · lg(u)</strong><br>` +
            `lg(${fmt(x)}) = ${fmt(n)} · lg(${fmt(z)}) ≈ ${fmt(n)} · ${fmt(lg)} = <strong>${fmt(wert)}</strong><br>` +
            `Plausibel: ${fmt(x)} liegt zwischen 10<sup>${fmt(stellen)}</sup> und 10<sup>${fmt(stellen + 1)}</sup>, der Zehnerlogarithmus also zwischen ${fmt(stellen)} und ${fmt(stellen + 1)}.<br>` +
            `Nicht verwechseln mit ${fmt(n)} + lg(${fmt(z)}) – addiert wird nur, wenn ein <em>Produkt</em> im Logarithmus steht.`
        };
      }
    ]
  };
})();
