/* ============================================================
   MatheNils – Themen-Register
   Führt alle Themen-Dateien zusammen und ordnet sie den
   Klassenstufen-Gruppen zu. Muss NACH den Themen-Dateien und
   VOR app.js geladen werden.
   ============================================================ */
'use strict';

const TOPIC_GROUPS = (() => {
  const alle = [...TOPICS_KERN, ...TOPICS_UNTER_NEU, ...TOPICS_MITTEL_NEU, ...TOPICS_OBER_NEU,
    ...TOPICS_GEOMETRIE, ...TOPICS_UNI_NEU];
  const byId = {};
  for (const t of alle) byId[t.id] = t;

  // Ausführliche Erklärseiten (learn-*.js) einbinden – ersetzen die Kurzfassungen
  const LEARN_ALLE = Object.assign({},
    typeof LEARN_UNTER !== 'undefined' ? LEARN_UNTER : {},
    typeof LEARN_MITTEL1 !== 'undefined' ? LEARN_MITTEL1 : {},
    typeof LEARN_MITTEL2 !== 'undefined' ? LEARN_MITTEL2 : {},
    typeof LEARN_OBER !== 'undefined' ? LEARN_OBER : {},
    typeof LEARN_UNI !== 'undefined' ? LEARN_UNI : {});
  for (const t of alle) {
    if (LEARN_ALLE[t.id]) t.learn = LEARN_ALLE[t.id];
  }

  // Anwendungsaufgaben zuschalten: Auf der Stufe „Schwer“ folgt auf das reine
  // Rechnen der Transfer in einen Sachkontext. Die Originalgeneratoren bleiben
  // unangetastet – sie werden nur umhüllt.
  // Zusatzvarianten für Stufen, die zu wenig Abwechslung boten
  if (typeof EXTRA_AUFGABEN !== 'undefined') {
    for (const t of alle) {
      const original = t.gen.bind(t);
      t.gen = function (diff) {
        const liste = EXTRA_AUFGABEN[`${t.id}:${diff}`];
        // Util.zufall statt Math.random: Sonst läuft ausgerechnet die Entscheidung
        // „Zusatzvariante oder Original?“ an der Zufallssaat vorbei, und die
        // Tages-Challenge stellte nach dem Neuladen doch eine andere Aufgabe.
        if (liste && liste.length && Util.zufall() < 0.55) return Util.choice(liste)();
        return original(diff);
      };
    }
  }

  if (typeof SACHAUFGABEN !== 'undefined') {
    for (const t of alle) {
      const liste = SACHAUFGABEN[t.id];
      if (!liste || !liste.length) continue;
      const original = t.gen.bind(t);
      t.gen = function (diff) {
        if (diff === 3 && Util.zufall() < 0.5) return Util.choice(liste)();   // siehe oben
        return original(diff);
      };
    }
  }

  // Suchbegriffe, die Lernende tatsächlich eintippen, aber im Titel nicht
  // vorkommen: Grundformen („ableiten“ statt „Ableitungen“), Synonyme und
  // Schreibweisen aus dem Unterricht. Die Suche normalisiert Umlaute selbst,
  // deshalb steht hier nur, was inhaltlich fehlt.
  const SCHLAGWORTE = {
    grundrechenarten: 'plus minus mal geteilt addieren subtrahieren multiplizieren dividieren kopfrechnen punkt vor strich klammern rechenregeln',
    negative: 'minuszahlen vorzeichen zahlenstrahl unter null temperatur schulden betrag',
    teilbarkeit: 'teiler primzahl primfaktoren ggt kgv teilbarkeitsregeln faktorisieren',
    brueche: 'bruch bruchrechnen kuerzen erweitern gemischte zahl hauptnenner zaehler nenner',
    dezimalzahlen: 'komma kommazahlen runden stellenwert dezimalbruch',
    einheiten: 'umrechnen umwandeln meter gramm liter sekunden kilometer tonne einheitentreppe masseinheiten',
    dreisatz: 'proportional antiproportional zuordnung verhaeltnis schlussrechnung je desto',
    winkel: 'grad winkelsumme scheitelwinkel stufenwinkel nebenwinkel geodreieck spitz stumpf',
    prozent: 'prozentrechnung grundwert prozentwert prozentsatz rabatt mehrwertsteuer anteil promille',
    zinsen: 'zins zinsrechnung kapital zinssatz zinseszins sparen kredit jahreszins',
    terme: 'term ausmultiplizieren ausklammern zusammenfassen binomische formel faktorisieren variablen klammer aufloesen',
    gleichungen: 'gleichung loesen umstellen aequivalenzumformung waage unbekannte nach x aufloesen',
    lgs: 'gleichungssystem einsetzungsverfahren gleichsetzungsverfahren additionsverfahren zwei unbekannte schnittpunkt',
    linfunktion: 'lineare funktion gerade steigung y achsenabschnitt geradengleichung funktionsgleichung schnittpunkt',
    quadfunktion: 'parabel normalparabel scheitelpunkt scheitelform verschieben strecken stauchen spiegeln oeffnung nullstellen quadratische ergaenzung wurfparabel',
    quadratisch: 'quadratische gleichung parabel pq formel mitternachtsformel diskriminante nullstellen scheitelpunkt wurzel ziehen',
    potenzen: 'potenz hochzahl exponent wurzel quadratwurzel potenzgesetze wurzelgesetze zehnerpotenzen',
    flaechen: 'flaeche flaecheninhalt umfang rechteck dreieck kreis trapez parallelogramm quadrat radius',
    volumen: 'koerper rauminhalt oberflaeche wuerfel quader zylinder prisma',
    hypothesentest: 'hypothese nullhypothese signifikanz signifikanztest ablehnungsbereich irrtumswahrscheinlichkeit kumuliert testen stichprobe fehler erster art zweiter art einseitig',
    symmetrie: 'symmetrie achsensymmetrie punktsymmetrie symmetrieachse spiegeln spiegelung achse zentrum koordinatensystem gespiegelt drehsymmetrie',
    vierecke: 'viereck vierecke dreieck dreiecke quadrat rechteck raute parallelogramm trapez drachen gleichschenklig gleichseitig rechtwinklig spitzwinklig stumpfwinklig haus der vierecke diagonale',
    vektoren: 'vektor ortsvektor verbindungsvektor betrag laenge komponenten pfeil kollinear linearkombination mittelpunkt schwerpunkt raum koordinaten',
    geraden: 'gerade geradengleichung parameterform stuetzvektor richtungsvektor punktprobe windschief lagebeziehung schnittpunkt spurpunkt parameter',
    skalarprodukt: 'skalarprodukt punktprodukt senkrecht orthogonal rechter winkel zwischen vektoren cosinus normalenvektor',
    ebenen: 'ebene ebenengleichung koordinatenform normalenform parameterform normalenvektor spurpunkt hessesche normalform abstand schnitt gerade ebene',
    strahlensaetze: 'strahlensatz aehnlichkeit aehnlich zentrische streckung streckfaktor verhaeltnis proportion massstab schatten vergroessern verkleinern',
    koerper: 'pyramide kegel kugel spitze koerper mantellinie mantelflaeche halbkugel drittel archimedes rauminhalt oberflaeche',
    pythagoras: 'hypotenuse kathete rechtwinkliges dreieck seitenlaenge a2 b2 c2 diagonale',
    trigonometrie: 'sinus kosinus cosinus tangens sin cos tan winkelfunktionen gegenkathete ankathete gaga hufhuf',
    statistik: 'mittelwert durchschnitt median modalwert spannweite boxplot daten diagramm haeufigkeit',
    wahrscheinlichkeit: 'zufall laplace wuerfel muenze urne baumdiagramm pfadregel ereignis chance gluecksrad',
    wachstum: 'exponentiell exponentialfunktion zerfall halbwertszeit verdopplungszeit wachstumsfaktor zinseszins bakterien',
    efunktion: 'e funktion eulersche zahl natuerlicher logarithmus ln exponentialfunktion zerfall halbwertszeit wachstumskonstante abitur analysis',
    logarithmen: 'logarithmus log lg ln logarithmieren logarithmengesetze exponent bestimmen',
    kurvendiskussion: 'zweite ableitung wendepunkt wendestelle monotonie kruemmung hochpunkt tiefpunkt extremstelle sattelpunkt graph untersuchen abitur analysis',
    ableitungsregeln: 'produktregel quotientenregel kettenregel innere aeussere funktion verkettung nachdifferenzieren ableiten abitur oberstufe analysis',
    ableitungen: 'ableiten ableitung differenzieren steigung tangente potenzregel kettenregel produktregel extremstellen kurvendiskussion',
    integrale: 'integrieren integral stammfunktion flaeche unter der kurve aufleiten bestimmtes integral hauptsatz',
    kombinatorik: 'zaehlprinzip permutation variation kombination binomialkoeffizient fakultaet n ueber k urnenmodell ziehen abitur oberstufe stochastik',
    bedingte: 'bayes satz von bayes vierfeldertafel abhaengigkeit unabhaengigkeit totale wahrscheinlichkeit baumdiagramm test abitur oberstufe stochastik',
    erwartungswert: 'varianz standardabweichung streuung zufallsvariable mittelwert einer verteilung fairer einsatz spiel abitur oberstufe stochastik',
    binomial: 'binomialverteilung bernoulli n ueber k treffer erfolgswahrscheinlichkeit kumuliert mindestens hoechstens abitur oberstufe stochastik',
    hypergeometrisch: 'ziehen ohne zuruecklegen lotto urne stichprobe qualitaetskontrolle stochastik uni lehramt',
    normalverteilung: 'gauss glockenkurve sigma regeln z wert standardnormalverteilung standardisieren erwartungswert streuung abitur oberstufe stochastik',
    deskriptiv: 'beschreibende statistik lagemasse streumasse quartil boxplot median modus varianz stichprobe abitur oberstufe stochastik klasse 9 klasse 10'
  };
  for (const t of alle) {
    if (SCHLAGWORTE[t.id]) t.schlagworte = SCHLAGWORTE[t.id];
  }

  const gruppen = [
    {
      id: 'unterstufe', title: 'Unterstufe', klasse: 'Klasse 5–7', grad: 'g-unter', stufen: ['g-unter'],
      ids: ['grundrechenarten', 'negative', 'teilbarkeit', 'brueche', 'dezimalzahlen', 'einheiten', 'dreisatz', 'winkel', 'symmetrie', 'vierecke']
    },
    {
      id: 'mittelstufe', title: 'Mittelstufe', klasse: 'Klasse 8–10', grad: 'g-mittel', stufen: ['g-mittel'],
      ids: ['prozent', 'zinsen', 'terme', 'gleichungen', 'lgs', 'linfunktion', 'quadratisch', 'quadfunktion', 'potenzen',
        'flaechen', 'volumen', 'koerper', 'pythagoras', 'strahlensaetze', 'trigonometrie', 'statistik', 'wahrscheinlichkeit']
    },
    {
      // Heißt seit dem Geometrie-Block nur noch „Analysis“: Mit „Analytische
      // Geometrie" und „Stochastik“ daneben lesen sich die drei Abiturbereiche
      // als Reihe. Das „Oberstufe:“ davor sagte ohnehin nichts, was nicht schon
      // in `klasse` steht.
      id: 'oberstufe', title: 'Analysis', klasse: 'Klasse 10–13', grad: 'g-ober', stufen: ['g-ober'],
      ids: ['wachstum', 'logarithmen', 'efunktion', 'ableitungen', 'ableitungsregeln', 'kurvendiskussion', 'integrale']
    },
    {
      // Der dritte der drei Abiturbereiche, zwischen Analysis und Stochastik –
      // in dieser Reihenfolge stehen sie auch im Lehrplan. Geraden und Ebenen
      // kommen noch dazu; die beiden Vektorthemen tragen für sich.
      id: 'geometrie', title: 'Analytische Geometrie', klasse: 'Klasse 10–13', grad: 'g-ober', stufen: ['g-ober'],
      ids: ['vektoren', 'geraden', 'skalarprodukt', 'ebenen']
    },
    {
      // Hieß bis August 2026 „Uni: Stochastik“ mit der Stufenangabe „Lehramt“.
      // Sechs der sieben Themen sind aber Kernstoff der Abiturprüfung –
      // Binomialverteilung, Normalverteilung, bedingte Wahrscheinlichkeit,
      // Erwartungswert, Kombinatorik –, und Vierfeldertafel und Boxplot kommen
      // schon in Klasse 9/10 dran. Unter „Lehramt“ hat sie dort niemand gesucht:
      // Der Stufenfilter zeigte für „Klasse 10–13“ ganze vier Themen.
      // Der Name folgt jetzt dem Sachgebiet, wie im Abitur (Analysis,
      // Analytische Geometrie, Stochastik), und die Stufenangabe sagt, für wen.
      // stufen: zwei Einträge – die Gruppe erscheint sowohl unter „Klasse 10–13“
      // als auch unter „Uni & Lehramt“. Genau das war vorher nicht möglich.
      id: 'stochastik', title: 'Stochastik', klasse: 'Klasse 10–13 & Uni', grad: 'g-uni', stufen: ['g-ober', 'g-uni'],
      ids: ['kombinatorik', 'bedingte', 'erwartungswert', 'binomial', 'hypergeometrisch', 'normalverteilung', 'deskriptiv', 'hypothesentest']
    }
  ];

  return gruppen.map(g => {
    const topics = g.ids.map(id => byId[id]).filter(Boolean);
    // Gruppen-Infos direkt am Thema hinterlegen (für Farbe & Badge)
    for (const t of topics) { t.grad = g.grad; t.klasse = g.klasse; }
    // stufen muss mitwandern – sonst weiß der Stufenfilter nichts davon, dass
    // die Stochastik zu zwei Stufen gehört.
    return { id: g.id, title: g.title, klasse: g.klasse, grad: g.grad, stufen: g.stufen || [g.grad], topics };
  });
})();

const TOPICS = TOPIC_GROUPS.flatMap(g => g.topics);

/* Erklärvideos vom YouTube-Kanal MatheNils, je Thema. app.js zeigt sie auf der
   Erklärseite unter der Illustration – als einfache Links, nicht eingebettet:
   Ein eingebettetes Video lädt schon beim Aufruf der Seite Daten von YouTube
   (und setzt Cookies), ein Link erst beim Klick. Titel ohne die Emoji der
   YouTube-Titel; in der Oberfläche gibt es keine. Neues Video: id ist der
   Teil hinter „watch?v=". */
const ERKLAERVIDEOS = {
  ableitungen: [
    { id: '5vtfxPtbYtc', titel: 'Ableitungen einfach erklärt – Regeln, Beispiele und Übungsaufgaben' },
    { id: 'DGESIcaQBlE', titel: 'Ableitungen in Klasse 10 – Beispiele zu allen Regeln' }
  ],
  ableitungsregeln: [
    { id: 'Mlfg_rKkL8Q', titel: 'Produktregel einfach erklärt' },
    { id: 'aOt-NGQk-Tg', titel: 'Kettenregel einfach erklärt – Ableitung von sin(x²)' },
    { id: 'j8Sp9JpwJ0c', titel: 'Logarithmus ableiten einfach erklärt' }
  ]
};

/**
 * Die Knöpfe des Stufenfilters. Bewusst eine eigene Liste und nicht aus
 * TOPIC_GROUPS abgeleitet: Die Stochastik gehört zu zwei Stufen, und zwei
 * Knöpfe namens „Klasse 10–13“ und „Klasse 10–13 & Uni“ wären nicht zu
 * unterscheiden gewesen.
 */
const STUFEN_FILTER = [
  { grad: 'g-unter',  label: 'Klasse 5–7' },
  { grad: 'g-mittel', label: 'Klasse 8–10' },
  { grad: 'g-ober',   label: 'Klasse 10–13' },
  { grad: 'g-uni',    label: 'Uni & Lehramt' }
];
