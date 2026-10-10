/* ============================================================
   MatheNils – Anwendungsaufgaben
   Für Themen, deren Generatoren bisher rein rechnerisch waren.
   Sie erscheinen auf der Stufe „Schwer“, wo das reine Rechnen
   sitzt und der Transfer in den Sachkontext an der Reihe ist.
   ============================================================ */
'use strict';

const SACHAUFGABEN = (() => {
  const { rnd, choice, gcd, fmt, frac, numCheck, fracCheck } = Util;
  const { koef, makeChoice } = TopicUtils;

  /* Parameter der Grundstücksaufgabe im Thema `terme`, nach der
     Größenreihenfolge von k², 2ka und a² in vier Klassen sortiert. Der
     Generator zieht erst eine Klasse, dann ein Paar daraus – sonst wären die
     vier Reihenfolgen ungleich häufig (9 : 16 : 16 : 9 über den ganzen
     Zahlenbereich) und schon die Reihenfolge der drei Zahlen wäre eine Wette
     wert. Dieselbe Vorsichtsmaßnahme wie bei `vektoren`: erst den Betrag
     ziehen, dann ein Tripel dazu. Ergibt 24 Paare, sechs je Klasse. */
  const GRUNDSTUECK_KLASSEN = (() => {
    const klassen = {};
    for (let k = 2; k <= 10; k++) for (let a = 2; a <= 10; a++) {
      // k ≠ a, a ≠ 2k, k ≠ 2a: sonst fallen zwei der drei Zahlen k², 2ka, a²
      // zusammen, und aus den vier Anordnungen würden drei Optionen.
      if (k === a || a === 2 * k || k === 2 * a) continue;
      // Gleiche Parität: 2ka ist immer gerade. Hätten k² und a² verschiedene
      // Parität, gäbe es unter den drei Zahlen genau eine ungerade – und allein
      // deren Stelle verriete die Anordnung (gemessen 50 % statt 25 %). So sind
      // entweder alle drei gerade oder die beiden Quadrate ungerade; in beiden
      // Fällen zeigt die Parität nie auf die Lösung.
      if ((k + a) % 2 !== 0) continue;
      const zahlen = [k * k, 2 * k * a, a * a];
      // Über 120 wird aus der binomischen Formel eine Rechenübung.
      if (Math.max(...zahlen) > 120) continue;
      const sortiert = [...zahlen].sort((x, y) => x - y);
      const klasse = zahlen.map(z => sortiert.indexOf(z) + 1).join('');
      (klassen[klasse] = klassen[klasse] || []).push([k, a]);
    }
    return Object.keys(klassen).sort().map(s => klassen[s]);
  })();

  /** Bruch kürzen, Vorzeichen in den Zähler. */
  function kuerze(n, d) {
    const g = gcd(n, d);
    return [n / g, d / g];
  }

  /** Primfaktoren aufsteigend – wie auf der Erklärseite von `teilbarkeit`:
      immer durch die kleinste passende Primzahl teilen. */
  function primfaktoren(n) {
    const f = [];
    for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; }
    return f;
  }

  return {

    /* ---------- Grundrechenarten ---------- */
    grundrechenarten: [
      () => {
        const a = rnd(3, 9), b = rnd(3, 9), c = rnd(2, 6), d = rnd(3, 9);
        const res = a * b + c * d;
        return {
          q: `Für das Klassenfest kauft ihr ${a} Packungen Muffins zu je ${b} € und ${c} Kisten Saft zu je ${d} €. Wie viel kostet alles zusammen (in €)?`,
          type: 'input', placeholder: 'Betrag in €',
          check: numCheck(res), testAnswer: String(res), answerText: `${res} €`,
          solution: `Zuerst die beiden Teilbeträge (Punkt vor Strich):<br>` +
            `Muffins: ${a} · ${b} € = ${a * b} €&ensp;<span class="trenn">•</span>&ensp;Saft: ${c} · ${d} € = ${c * d} €<br>` +
            `Zusammen: ${a * b} € + ${c * d} € = <strong>${res} €</strong>`
        };
      },
      () => {
        // Budget an den Einkauf koppeln: Sonst blieb im ersten Thema der
        // Klasse 5 ein negativer Restbetrag übrig – lange bevor negative
        // Zahlen überhaupt eingeführt sind.
        const stueck = rnd(3, 8), preis = rnd(3, 9);
        const geld = Math.ceil((stueck * preis + rnd(5, 40)) / 10) * 10;
        const res = geld - stueck * preis;
        return {
          q: `Du hast ${geld} € dabei und kaufst ${stueck} Hefte zu je ${preis} €. Wie viel Geld bleibt dir (in €)?`,
          type: 'input', placeholder: 'Restbetrag in €',
          check: numCheck(res), testAnswer: String(res), answerText: `${res} €`,
          solution: `Erst die Hefte: ${stueck} · ${preis} € = ${stueck * preis} €.<br>` +
            `Dann abziehen: ${geld} € − ${stueck * preis} € = <strong>${res} €</strong>`
        };
      }
    ],

    /* ---------- Negative Zahlen ---------- */
    negative: [
      () => {
        const start = rnd(-6, 6), ab = rnd(7, 16);
        const res = start - ab;
        return {
          q: `Am Nachmittag zeigt das Thermometer ${fmt(start)} °C. Bis Mitternacht fällt die Temperatur um ${ab} Grad. Wie kalt ist es dann (in °C)?`,
          type: 'input', placeholder: 'Temperatur in °C',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)} °C`,
          solution: `Fallen heißt subtrahieren:<br>${fmt(start)} °C − ${ab} °C = <strong>${fmt(res)} °C</strong><br>` +
            `Auf dem Zahlenstrahl: von ${fmt(start)} aus ${ab} Schritte nach links.`
        };
      },
      () => {
        const konto = -rnd(20, 90), ein = rnd(100, 200);
        const res = konto + ein;
        return {
          q: `Dein Kontostand beträgt ${fmt(konto)} € – du bist also im Minus. Du zahlst ${ein} € ein. Wie hoch ist der Kontostand danach (in €)?`,
          type: 'input', placeholder: 'Kontostand in €',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)} €`,
          solution: `${fmt(konto)} € + ${ein} € = <strong>${fmt(res)} €</strong><br>` +
            `Die Einzahlung gleicht zuerst die Schulden aus, der Rest bleibt als Guthaben.`
        };
      }
    ],

    /* ---------- Teilbarkeit ---------- */
    teilbarkeit: [
      () => {
        const g = choice([4, 6, 8, 9, 12]);
        let x = rnd(2, 7), y = rnd(2, 7);
        let versuche = 0;
        while ((gcd(x, y) !== 1 || x === y) && versuche++ < 40) { x = rnd(2, 7); y = rnd(2, 7); }
        if (gcd(x, y) !== 1 || x === y) { x = 2; y = 3; }
        const A = g * x, B = g * y;
        /* Der ggT wird BESTIMMT, nicht vorausgesetzt: Die alte Fassung schrieb
           „48 = 12 · 4 und 60 = 12 · 5 → ggT = 12“ – das ist eine Probe mit
           der schon bekannten Lösung, und wer 6 getippt hatte, sah keinen Weg
           dorthin. Die Erklärseite bestimmt den ggT über die gemeinsamen
           Primfaktoren (24 und 36 → 2 · 2 · 3), also hier genauso. Weil x und
           y teilerfremd sind, ergeben die gemeinsamen Faktoren genau g; g ist
           nie prim, es stehen also immer mindestens zwei da. */
        const fA = primfaktoren(A), fB = primfaktoren(B);
        const uebrig = [...fB];
        const gemeinsam = fA.filter(p => {
          const i = uebrig.indexOf(p);
          if (i < 0) return false;
          uebrig.splice(i, 1);          // jeden Faktor nur so oft, wie er in beiden steckt
          return true;
        });
        const kette = f => f.map(p => fmt(p)).join(' · ');
        return {
          q: `Eine Lehrerin verteilt ${A} Stifte und ${B} Hefte auf möglichst viele gleich große Gruppen – ohne Rest. Wie viele Gruppen sind das höchstens?`,
          type: 'input', placeholder: 'Anzahl Gruppen',
          check: numCheck(g), testAnswer: String(g), answerText: `${g} Gruppen`,
          solution: `Möglichst viele gleich große Gruppen ohne Rest → gesucht ist der ggT (größter gemeinsamer Teiler).<br>` +
            `${fmt(A)} = ${kette(fA)}&ensp;<span class="trenn">•</span>&ensp;${fmt(B)} = ${kette(fB)}<br>` +
            `Gemeinsam: ${kette(gemeinsam)} → ggT = <strong>${fmt(g)}</strong><br>` +
            `Also höchstens ${fmt(g)} Gruppen. Jede bekommt ${fmt(A)} : ${fmt(g)} = ${fmt(x)} Stifte und ${fmt(B)} : ${fmt(g)} = ${fmt(y)} Hefte.`
        };
      }
    ],

    /* ---------- Brüche ---------- */
    brueche: [
      () => {
        const [[a, b], [c, d]] = choice([[[1, 4], [1, 3]], [[2, 5], [1, 4]], [[1, 6], [1, 3]], [[3, 8], [1, 4]], [[1, 2], [1, 5]]]);
        // Hauptnenner ist das kgV, nicht das Produkt der Nenner – so steht es
        // auf der Erklärseite, im Tipp und im Haupt-Generator dieses Themas.
        const hn = Util.lcm(b, d);
        const gegessen = a * (hn / b) + c * (hn / d);
        const zaehler = hn - gegessen;
        const [rn, rd] = kuerze(zaehler, hn);
        return {
          q: `Von einer Pizza isst Mia ${frac(a, b)} und Ben ${frac(c, d)}. Welcher Anteil bleibt übrig? <span class="hint">Als vollständig gekürzten Bruch angeben.</span>`,
          type: 'input', placeholder: 'Anteil als Bruch',
          check: fracCheck(rn, rd, true), testAnswer: `${rn}/${rd}`,
          answerText: frac(rn, rd),
          solution: `Zuerst zusammenzählen, was gegessen wurde – Hauptnenner ${hn}:<br>` +
            `${frac(a, b)} + ${frac(c, d)} = ${frac(a * (hn / b), hn)} + ${frac(c * (hn / d), hn)} = ${frac(gegessen, hn)}<br>` +
            `Vom Ganzen abziehen: ${frac(hn, hn)} − ${frac(gegessen, hn)} = ` +
            // Den Kürzungsschritt nur zeigen, wenn wirklich gekürzt wird –
            // sonst stand dort „5/12 = 5/12“.
            (rd === hn ? `<strong>${frac(rn, rd)}</strong>`
                       : `${frac(zaehler, hn)} = <strong>${frac(rn, rd)}</strong>`)
        };
      }
    ],

    /* ---------- Dezimalzahlen ---------- */
    dezimalzahlen: [
      () => {
        const p = [rnd(120, 480), rnd(120, 480), rnd(120, 480)];
        const summe = p.reduce((s, x) => s + x, 0) / 100;
        return {
          q: `Im Supermarkt kaufst du drei Artikel: ${fmt(p[0] / 100, 2)} €, ${fmt(p[1] / 100, 2)} € und ${fmt(p[2] / 100, 2)} €. Wie viel zahlst du insgesamt (in €)?`,
          type: 'input', placeholder: 'Betrag in €',
          check: numCheck(summe, 0.005), testAnswer: String(summe), answerText: `${fmt(summe, 2)} €`,
          solution: `Kommas untereinander schreiben und stellenweise addieren:<br>` +
            `${fmt(p[0] / 100, 2)} € + ${fmt(p[1] / 100, 2)} € + ${fmt(p[2] / 100, 2)} € = <strong>${fmt(summe, 2)} €</strong>`
        };
      },
      () => {
        // Schein an den Preis koppeln: Mit 10 € kann man keine 14,30 €
        // bezahlen – in jedem fünften Fall kam vorher negatives Rückgeld heraus.
        const gegeben = choice([10, 20]);
        const preis = rnd(320, gegeben * 100 - 20) / 100;
        const rest = Math.round((gegeben - preis) * 100) / 100;
        return {
          q: `Dein Einkauf kostet ${fmt(preis, 2)} €. Du zahlst mit einem ${gegeben}-Euro-Schein. Wie viel Rückgeld bekommst du (in €)?`,
          type: 'input', placeholder: 'Rückgeld in €',
          check: numCheck(rest, 0.005), testAnswer: String(rest), answerText: `${fmt(rest, 2)} €`,
          /* Wie im Beispiel „Subtrahieren: Rückgeld“ der Erklärseite: Das
             Auffüllen des Scheins ist ein eigener Schritt, denn genau dort
             liegt der Fehler, vor dem Merkkasten und Warnkasten warnen
             (rechtsbündig statt Komma unter Komma). */
          solution: `Rückgeld heißt Schein minus Einkauf.<br>` +
            `Die ${fmt(gegeben)} hat keine Nachkommastellen → auffüllen zu ${fmt(gegeben, 2)} € − ${fmt(preis, 2)} €<br>` +
            `Kommas untereinander, stellenweise subtrahieren → <strong>${fmt(rest, 2)} €</strong><br>` +
            `Kontrolle: ${fmt(preis, 2)} € + ${fmt(rest, 2)} € = ${fmt(gegeben, 2)} € ✓ – Einkauf plus Rückgeld ergibt den Schein.`
        };
      }
    ],

    /* ---------- Einheiten ---------- */
    einheiten: [
      () => {
        const runden = rnd(3, 12);
        const km = runden * 400 / 1000;
        return {
          q: `Ein Läufer dreht ${runden} Runden auf einer 400-m-Bahn. Wie viele Kilometer legt er zurück?`,
          type: 'input', placeholder: 'Strecke in km',
          check: numCheck(km), testAnswer: String(km), answerText: `${fmt(km)} km`,
          solution: `Zuerst die Gesamtstrecke: ${runden} · 400 m = ${runden * 400} m<br>` +
            `In Kilometer umrechnen (: 1000): <strong>${fmt(km)} km</strong>`
        };
      },
      () => {
        const kisten = rnd(4, 12), gramm = choice([250, 500, 750]);
        const kg = kisten * gramm / 1000;
        return {
          q: `Ein Karton enthält ${kisten} Packungen zu je ${gramm} g. Wie schwer ist der Inhalt in Kilogramm?`,
          type: 'input', placeholder: 'Masse in kg',
          check: numCheck(kg), testAnswer: String(kg), answerText: `${fmt(kg)} kg`,
          solution: `${kisten} · ${gramm} g = ${kisten * gramm} g<br>` +
            `1 kg = 1000 g, also : 1000 → <strong>${fmt(kg)} kg</strong>`
        };
      }
    ],

    /* ---------- Terme ---------- */
    terme: [
      () => {
        // Die Aufgabe war ohne jede Rechnung lösbar: Die Lösung war die längste
        // Option (100 %, greift in der Hälfte der Ziehungen), ihre erste Zahl in
        // 92 % die zweitgrößte. Schuld war die Bauform der Ablenker – x² + a²,
        // x² + ax + a² und 2x + 2a sind allesamt Auslassungen, und die
        // vollständige Lösung ist zwangsläufig länger und größer als jede
        // Auslassung. Dagegen hilft nur, den Ablenkern dieselben Zahlen zu geben
        // wie der Lösung: Alle vier Optionen bestehen aus denselben drei Zahlen
        // an anderen Plätzen. Dieselbe Bauart benutzt `geraden` für seine
        // Richtungsvektoren („Umstellungen derselben drei Zahlen – gleiche
        // Summe, gleicher Betrag, kein Merkmal“). Damit sind Länge,
        // Zahlensumme, Zahlenprodukt, Ziffernzahl und die Zahl der Pluszeichen
        // bei allen vier Optionen gleich; keine dieser Regeln entscheidet noch
        // etwas.
        //
        // Es sind aber nicht irgendwelche vier der sechs Anordnungen, sondern
        // genau die vier, bei denen in der Mitte NICHT die kleinste Zahl steht.
        // Das ist keine Willkür, sondern die vollständige Liste der
        // Anordnungen, die überhaupt als Ergebnis herauskommen können: 2ka ist
        // nie kleiner als beide Quadrate (wäre 2ka < k² und 2ka < a², so folgte
        // durch Multiplizieren 4k²a² < k²a²). Ein Ablenker mit der kleinsten
        // Zahl in der Mitte ließe sich also blind ausschließen und die Auswahl
        // schrumpfte auf drei. So kommt jede der vier möglichen Reihenfolgen
        // genau einmal vor, und dass die Zahlen im Term auf- oder absteigen,
        // sagt nichts mehr.
        //
        // Nachgemessen mit rund fünfzig blinden Regeln über 30 000 Ziehungen (fünf
        // Saaten): Keine Regel, die in mindestens einem Viertel der Ziehungen
        // greift, kommt über 34 % – Zufall sind 25 %. Vorher waren „längste
        // Option", „meiste Ziffern“, „größte Zahlensumme“ und „größtes
        // Zahlenprodukt" allesamt bei 100 %.
        const [k, a] = choice(choice(GRUNDSTUECK_KLASSEN));
        const seite = koef(k);                                  // „3x“
        const quadrat = k * k, streifen = 2 * k * a, ecke = a * a;
        const term = ([v1, v2, v3]) => `${koef(v1, 'x²')} + ${koef(v2)} + ${fmt(v3)}`;
        const [klein, mittel, gross] = [quadrat, streifen, ecke].sort((x, y) => x - y);
        const reihen = [
          [klein, mittel, gross], [klein, gross, mittel],
          [mittel, gross, klein], [gross, mittel, klein]
        ];
        const anordnungen = reihen.map(term);
        const richtig = term([quadrat, streifen, ecke]);        // (kx + a)²
        // Rückmeldung: Welche zwei Teile der Fläche haben die Plätze getauscht?
        // Die drei Zahlen sind paarweise verschieden (siehe GRUNDSTUECK_KLASSEN),
        // die Zuordnung ist also eindeutig. Ein Ringtausch aller drei Plätze ist
        // kein erkennbarer Fehlerweg und bleibt ohne Grund.
        const tausch = ([v1, v2, v3]) =>
          v2 === streifen ? 'Hier haben das alte Grundstück und das Eckquadrat die Plätze getauscht.'
            : v3 === ecke ? 'Hier haben das alte Grundstück und die Randstreifen die Plätze getauscht.'
              : v1 === quadrat ? 'Hier haben Randstreifen und Eckquadrat die Plätze getauscht: Die Streifen wachsen mit x, das Eckquadrat nicht.'
                : null;
        // Genau drei Ablenker, ausnahmsweise ohne Reserve: Die drei Zahlen sind
        // nach der Wahl von k und a paarweise verschieden, also auch die vier
        // Anordnungen – makeChoice kann keine verwerfen (nachgemessen über
        // 30 000 Ziehungen: immer vier Optionen, nie eine doppelt). Ein Reserve-Ablenker müsste
        // eine vierte Zahl mitbringen und würde genau die Symmetrie zerstören,
        // die das Raten verhindert.
        const falsch = reihen.filter((_, i) => anordnungen[i] !== richtig);
        const mc = makeChoice(richtig, falsch.map(term), falsch.map(tausch));
        return {
          q: `Ein quadratisches Grundstück hat die Seitenlänge ${seite} m. Jede Seite wird um ${fmt(a)} m verlängert, sodass wieder ein Quadrat entsteht. Welcher Term beschreibt die neue Fläche in m²?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: richtig,
          solution: `Die neue Seitenlänge ist (${seite} + ${fmt(a)}) m, die Fläche also (${seite} + ${fmt(a)})².<br>` +
            `1. binomische Formel mit a = ${seite} und b = ${fmt(a)}:<br>` +
            `(${seite})² + 2 · ${seite} · ${fmt(a)} + ${fmt(a)}² = <strong>${richtig}</strong><br>` +
            `Jede Zahl hat ihren Platz: ${koef(quadrat, 'x²')} ist das alte Grundstück, ${koef(streifen)} sind die beiden Randstreifen (je ${fmt(a)} m breit und ${seite} m lang), ${fmt(ecke)} ist das Eckquadrat ${fmt(a)} m · ${fmt(a)} m. Das Eckquadrat hat eine feste Größe, die Randstreifen wachsen mit x – deshalb steht ${fmt(streifen)} vor dem x und ${fmt(ecke)} allein am Ende. Wer die Streifen ganz vergisst und nur ${koef(quadrat, 'x²')} + ${fmt(ecke)} rechnet, macht den häufigsten Fehler bei binomischen Formeln.`
        };
      }
    ],

    /* ---------- Gleichungen ---------- */
    gleichungen: [
      () => {
        const grund = rnd(3, 9), proGB = rnd(2, 5), gb = rnd(3, 12);
        const rechnung = grund + proGB * gb;
        return {
          q: `Ein Handytarif kostet ${grund} € Grundgebühr plus ${proGB} € pro GB. Deine Rechnung beträgt ${rechnung} €. Wie viele GB hast du verbraucht?`,
          type: 'input', placeholder: 'Anzahl GB',
          check: numCheck(gb), testAnswer: String(gb), answerText: `${gb} GB`,
          // Wie das Einstiegsbeispiel der Erklärseite: erst das Gesuchte x
          // nennen und den Text übersetzen, am Ende x in GB zurückübersetzen.
          // Wer an der Sachaufgabe scheitert, scheitert meist beim Aufstellen –
          // „Gleichung aufstellen: 5x + 9 = 39“ übersprang genau diesen Schritt.
          solution: `Gesucht ist die Anzahl der GB – nenne sie x. „${fmt(proGB)} € pro GB“ ergibt ${koef(proGB)} €, ` +
            `dazu ${fmt(grund)} € Grundgebühr:<br>` +
            `${koef(proGB)} + ${fmt(grund)} = ${fmt(rechnung)}&nbsp;| − ${fmt(grund)}<br>` +
            `${koef(proGB)} = ${fmt(rechnung - grund)}&nbsp;| : ${fmt(proGB)}<br>` +
            `x = <strong>${fmt(gb)}</strong> → du hast ${fmt(gb)} GB verbraucht.<br>` +
            `Probe: ${fmt(proGB)} · ${fmt(gb)} + ${fmt(grund)} = ${fmt(rechnung)} ✓`
        };
      },
      () => {
        // Alter an den Faktor koppeln, sodass der Vater bei der Geburt
        // mindestens 20 war. Vorher entstanden Väter, die mit 12 Jahren Vater
        // geworden wären: Kind 6, Faktor 2.
        const faktor = choice([3, 4]);
        const alterKind = rnd(Math.ceil(20 / (faktor - 1)), 14);
        const summe = alterKind + faktor * alterKind;
        return {
          q: `Ein Vater ist ${faktor}-mal so alt wie sein Kind. Zusammen sind sie ${summe} Jahre alt. Wie alt ist das Kind?`,
          type: 'input', placeholder: 'Alter in Jahren',
          check: numCheck(alterKind), testAnswer: String(alterKind), answerText: `${alterKind} Jahre`,
          // Aufbau wie das Vater-Beispiel der Erklärseite: x benennen, „zusammen“
          // übersetzen, ein Schritt je Zeile, x zurückübersetzen, Probe.
          solution: `Das Gesuchte bekommt das x: Kind = x, Vater = ${koef(faktor)}. „Zusammen“ heißt addieren:<br>` +
            `x + ${koef(faktor)} = ${fmt(summe)}<br>` +
            `${koef(faktor + 1)} = ${fmt(summe)}&nbsp;| : ${fmt(faktor + 1)}<br>` +
            `x = <strong>${fmt(alterKind)}</strong> → das Kind ist ${fmt(alterKind)} Jahre alt, ` +
            `der Vater ${fmt(faktor)} · ${fmt(alterKind)} = ${fmt(faktor * alterKind)} Jahre.<br>` +
            `Probe: ${fmt(alterKind)} + ${fmt(faktor * alterKind)} = ${fmt(summe)} ✓`
        };
      }
    ],

    /* ---------- Gleichungssysteme ---------- */
    lgs: [
      () => {
        const E = rnd(8, 15), K = rnd(4, 8);
        const c1 = 2 * E + 3 * K, c2 = E + 4 * K;
        return {
          q: `Im Kino kosten 2 Erwachsenen- und 3 Kindertickets zusammen ${c1} €, 1 Erwachsenen- und 4 Kindertickets ${c2} €. Was kostet ein Kinderticket (in €)?`,
          type: 'input', placeholder: 'Preis in €',
          check: numCheck(K), testAnswer: String(K), answerText: `${K} €`,
          solution: `I. 2E + 3K = ${c1}&ensp;<span class="trenn">•</span>&ensp;II. E + 4K = ${c2}<br>` +
            `II nach E auflösen: E = ${c2} − 4K, in I einsetzen:<br>` +
            `2(${c2} − 4K) + 3K = ${c1} → ${2 * c2} − 8K + 3K = ${c1} → −5K = ${fmt(c1 - 2 * c2)}<br>` +
            `K = <strong>${K} €</strong> (und E = ${E} €). Probe in I: ${2 * E} + ${3 * K} = ${c1} ✓`
        };
      }
    ],

    /* ---------- Quadratische Gleichungen ---------- */
    quadratisch: [
      () => {
        const breite = rnd(2, 9), mehr = rnd(1, 5);
        const flaeche = breite * (breite + mehr);
        return {
          q: `Ein rechteckiges Beet ist ${mehr} m länger als breit und hat eine Fläche von ${flaeche} m². Wie breit ist das Beet (in m)?`,
          type: 'input', placeholder: 'Breite in m',
          check: numCheck(breite), testAnswer: String(breite), answerText: `${breite} m`,
          solution: `Breite x, Länge x + ${mehr}:&nbsp;x · (x + ${mehr}) = ${flaeche}<br>` +
            `x² + ${koef(mehr)} − ${flaeche} = 0 → p = ${mehr}, q = −${flaeche}<br>` +
            `x₁,₂ = −${fmt(mehr / 2)} ± √(${fmt((mehr / 2) * (mehr / 2))} + ${flaeche}) = −${fmt(mehr / 2)} ± ${fmt(breite + mehr / 2)}<br>` +
            `x₁ = <strong>${breite}</strong>,&nbsp;x₂ = ${fmt(-(breite + mehr))} – eine Länge kann nicht negativ sein.<br>` +
            `Das Beet ist ${breite} m breit und ${breite + mehr} m lang. Probe: ${breite} · ${breite + mehr} = ${flaeche} ✓`
        };
      }
    ],

    /* ---------- Potenzen ---------- */
    potenzen: [
      () => {
        const n = rnd(5, 12);
        const res = 2 ** n;
        return {
          q: `Ein Blatt Papier wird ${n}-mal in der Mitte gefaltet. Wie viele Lagen liegen dann übereinander?`,
          type: 'input', placeholder: 'Anzahl Lagen',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
          solution: `Jede Faltung verdoppelt die Lagen: 2, 4, 8, 16, …<br>` +
            `Nach ${n} Faltungen: 2<sup>${n}</sup> = <strong>${fmt(res)} Lagen</strong>`
        };
      },
      () => {
        const start = choice([5, 10, 20, 50]), n = rnd(3, 6);
        const res = start * 2 ** n;
        return {
          q: `Eine Bakterienkultur startet mit ${start} Bakterien und verdoppelt sich jede Stunde. Wie viele sind es nach ${n} Stunden?`,
          type: 'input', placeholder: 'Anzahl',
          check: numCheck(res), testAnswer: String(res), answerText: `${fmt(res)}`,
          solution: `${start} · 2<sup>${n}</sup> = ${start} · ${2 ** n} = <strong>${fmt(res)}</strong>`
        };
      }
    ],

    /* ---------- Logarithmen ---------- */
    logarithmen: [
      () => {
        const n = rnd(3, 8);
        const faktor = 2 ** n;
        return {
          q: `Eine Bakterienkultur verdoppelt sich jede Stunde. Nach wie vielen Stunden ist sie ${fmt(faktor)}-mal so groß wie am Anfang?`,
          type: 'input', placeholder: 'Stunden',
          check: numCheck(n), testAnswer: String(n), answerText: `${n} Stunden`,
          solution: `Gesucht ist x mit 2<sup>x</sup> = ${fmt(faktor)}, also x = log₂(${fmt(faktor)}).<br>` +
            `Wegen 2<sup>${n}</sup> = ${fmt(faktor)} gilt x = <strong>${n}</strong>.`
        };
      }
    ],

    /* ---------- Integrale ---------- */
    integrale: [
      () => {
        const a = choice([2, 4, 6]), c = rnd(1, 6), t = rnd(2, 5);
        const weg = a / 2 * t * t + c * t;
        return {
          q: `Ein Auto beschleunigt gleichmäßig, seine Geschwindigkeit beträgt v(t) = ${a}t + ${c} (in m/s). Welchen Weg legt es in den ersten ${t} Sekunden zurück (in m)?`,
          type: 'input', placeholder: 'Weg in m',
          check: numCheck(weg), testAnswer: String(weg), answerText: `${fmt(weg)} m`,
          solution: `Der Weg ist die Fläche unter dem v-t-Graphen, also das Integral:<br>` +
            `Stammfunktion: s(t) = ${koef(a / 2, 't²')} + ${koef(c, 't')}<br>` +
            // Einsetzungs- und Ergebniszeile fallen zusammen, wenn beide
            // Vorfaktoren 1 sind („= 4 + 2 = 4 + 2 = 8“). Dann entfällt der
            // Zwischenschritt, weil er nichts mehr zeigt.
            `s(${t}) − s(0) = ${a / 2 === 1 && c === 1 ? '' :
              `${a / 2 === 1 ? fmt(t * t) : `${fmt(a / 2)} · ${fmt(t * t)}`} + ${c === 1 ? fmt(t) : `${fmt(c)} · ${fmt(t)}`} = `}` +
            `${fmt(a / 2 * t * t)} + ${fmt(c * t)} = <strong>${fmt(weg)} m</strong><br>` +
            `<em>Kontrolle:</em> Die Fläche ist ein Trapez mit den Seiten ${c} und ${fmt(a * t + c)} bei Breite ${t}: (${c} + ${fmt(a * t + c)})/2 · ${t} = ${fmt(weg)} ✓`
        };
      }
    ]

  };
})();
