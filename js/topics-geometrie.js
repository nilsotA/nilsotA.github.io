/* ============================================================
   MatheNils – Analytische Geometrie (Klasse 10–13)
   Vektoren · Geraden · Skalarprodukt · Ebenen

   Eigene Datei, weil der Block als Ganzes gehört: Die vier Themen
   bauen aufeinander auf (Vektoren → Geraden → Skalarprodukt →
   Ebenen) und teilen sich die Vektorschreibweise aus `TopicUtils`
   (`vek`, `vname`, `punkt`, dazu `.vek` und `.vpfeil` im Stylesheet).
   ============================================================ */
'use strict';

const TOPICS_GEOMETRIE = (() => {
  const { rnd, choice, shuffle, gcd, lcm, fmt, frac, numCheck, fracCheck, multiCheck, orderedCheck, probCheck } = Util;
  const { reduce, fracHTML, fracInput, par, linTerm, quadLhs, makeChoice, rndNonZero,
    pickTriple, koef, plural, vek, vname, punkt } = TopicUtils;

  /* ============================================================
     Vektoren im Raum – erstes Thema der analytischen Geometrie.
     Hier wird die Schreibweise eingeführt, auf der Geraden,
     Skalarprodukt und Ebenen später aufbauen.
     ============================================================ */
  
  /* Tripel mit ganzzahliger Wurzel: (x, y, z, Betrag). Ohne sie käme bei jedem
     Betrag eine Wurzel heraus, die niemand im Kopf zieht. Die Vorzeichen werden
     frei gewürfelt – der Betrag bleibt derselbe. */
  const BETRAG_TRIPEL = [
    [1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11],
    [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15], [2, 10, 11, 15],
    [1, 12, 12, 17], [8, 9, 12, 17]
  ];
  
  /* Antwortformat. Der Hinweis steht im Fragetext, damit er auch im
     Challenge-Modus sichtbar ist – dort gibt es keinen Tipp-Knopf. */
  const KOMP_HINWEIS = '<span class="hint">Gib die drei Komponenten mit Semikolon getrennt ein, z. B. 3; −1; 5.</span>';
  const PUNKT_HINWEIS = '<span class="hint">Gib die drei Koordinaten mit Semikolon getrennt ein, z. B. 3; −1; 5.</span>';
  /* Rechenschritte im Lösungsweg stehen je auf einer eigenen Zeile – wie auf
     den Erklärseiten, die jeden Schritt in einen eigenen Absatz setzen. Hier
     stand früher der Trennpunkt: Ein Weg bei `geraden` wurde so ein Fließtext
     mit 16 Punkten, einmal sogar direkt hinter einem Doppelpunkt
     („Gleichsetzen: • I: …“). Der Trennpunkt gehört zwischen zwei Formeln IN
     einer Zeile, nicht zwischen Schritte. */
  const TRENN = '<br>';
  
  /* Komponenten nie 0: Sonst stünde in den Rechenzeilen „4 + 0“ – ein Schritt,
     der nichts tut, und genau der Fall, den der Sprachscan meldet. */
  function zufallsVektor(min, max) {
    return [rndNonZero(min, max), rndNonZero(min, max), rndNonZero(min, max)];
  }
  
  function gleichV(u, w) {
    return u[0] === w[0] && u[1] === w[1] && u[2] === w[2];
  }
  
  function plusV(u, w) { return u.map((k, i) => k + w[i]); }
  function minusV(u, w) { return u.map((k, i) => k - w[i]); }
  function malV(r, u) { return u.map(k => r * k); }
  
  function kollinearV(u, w) {
    return u[1] * w[2] - u[2] * w[1] === 0
        && u[2] * w[0] - u[0] * w[2] === 0
        && u[0] * w[1] - u[1] * w[0] === 0;
  }
  
  /* Vektor mit ganzzahligem Betrag: erst den Betrag gleichverteilt ziehen, dann ein
     Tripel dazu, Reihenfolge mischen, Vorzeichen würfeln.
     Vorher wurde gleichverteilt über die TRIPEL gezogen – und weil zu 9, 11, 15
     und 17 je zwei Tripel gehören, zu 3, 7 und 13 aber nur eines, kamen die
     ersten doppelt so oft vor (gemessen 18,8 % gegen 8,7 %). Bei sieben
     möglichen Antworten ist das ein Muster, das sich merken lässt. */
  const BETRAEGE = [...new Set(BETRAG_TRIPEL.map(t => t[3]))];

  function betragsVektor() {
    const L = choice(BETRAEGE);
    const t = choice(BETRAG_TRIPEL.filter(x => x[3] === L));
    return [shuffle([t[0], t[1], t[2]]).map(k => k * choice([1, -1])), t[3]];
  }
  
  /* Für die Kollinearitäts-Ablenker: Vertauscht man zwei Komponenten, darf das
     Ergebnis kein Vielfaches mehr sein. Bei |x| = |y| wäre es genau das – dann
     gäbe es zwei richtige Antworten. */
  function verschiedeneKomponenten(min, max) {
    let v;
    do { v = zufallsVektor(min, max); }
    while (new Set(v.map(Math.abs)).size < 3);
    return v;
  }
  
  /* Rechenzeilen „a + (b) = c“, eine je Komponente. */
  function zeilen(links, zeichen, rechts, ergebnis) {
    return links.map((k, i) => `${fmt(k)} ${zeichen} ${par(rechts[i])} = ${fmt(ergebnis[i])}`).join(TRENN);
  }

  /* ---------- Einsetzen mit allen Zwischenzeilen (Geraden und Ebenen) ---------- */

  /** Linearer Term aus Gliedern [Faktor, Variable], etwa „−12 − 4s − 3s“; eine
      leere Variable steht für eine Zahl. Nullen fallen weg – sonst „+ 0“. */
  function linText(glieder) {
    const g = glieder.filter(([k]) => k !== 0);
    if (!g.length) return '0';
    return g.map(([k, v], i) => {
      const betrag = v ? koef(Math.abs(k), v) : fmt(Math.abs(k));
      return i === 0 ? (k < 0 ? `−${betrag}` : betrag) : `${k < 0 ? '−' : '+'} ${betrag}`;
    }).join(' ');
  }

  /** „A + B · y“ als Term – bei A = 0 ohne „0 +“, das sonst dreimal im Weg stand. */
  function aufgeloest(A, B, y) {
    return A === 0 ? koef(B, y) : `${fmt(A)} ${B < 0 ? '−' : '+'} ${koef(Math.abs(B), y)}`;
  }

  /**
   * Einsetzen eines aufgelösten Terms in eine zweite Gleichung – mit den
   * Zwischenzeilen, die die Erklärseite von `geraden` zeigt („In II:
   * −3 + 2 · (5 − s) = 1 + s, also 7 − 2s = 1 + s, also 3s = 6"): eingesetzt,
   * ausmultipliziert, zusammengefasst, aufgelöst. Vorher sprang der Weg vom
   * Einsetzen direkt auf „−7s = 14“ – genau über die Klammer mit Minus
   * davor, an der die meisten Fehler entstehen. Wer dort falsch lag, fand im
   * Weg keinen Vergleichswert.
   *   Gleichung  f · x + g · y = c,  eingesetzt wird  x = A + B · y.
   * Ein Faktor ±1 wird nicht hingeschrieben („1 · (…)“ wäre ein leerer
   * Schritt), sondern als Klammer bzw. Minus vor der Klammer.
   * Ergebnis: Zeilen; die letzte lautet „y = <strong>…</strong>".
   */
  function einsetzWeg(f, A, B, g, c, y, vorspann) {
    const xTerm = aufgeloest(A, B, y);
    const klammer = A !== 0 || B < 0;              // „2s“ braucht nach „·“ keine Klammer, „(−2s)“ schon
    // Bei x = y wechselt nur der Buchstabe: „2t + 3s“ wird „2s + 3s“, nicht „2 · s + 3s“.
    const eingesetzt = A === 0 && B === 1 ? koef(f, y)
      : f === 1 ? (A === 0 ? xTerm : `(${xTerm})`)
        : f === -1 ? (klammer ? `−(${xTerm})` : `−${xTerm}`)
          : `${par(f)} · ${klammer ? `(${xTerm})` : xTerm}`;
    const links = eingesetzt + (g === 0 ? '' : ` ${g < 0 ? '−' : '+'} ${koef(Math.abs(g), y)}`);
    const weg = [`${vorspann}${links} = ${fmt(c)}`];
    const k0 = f * A, cY = f * B + g, R = c - k0;
    const ausmult = linText([[k0, ''], [f * B, y], [g, y]]);
    if (ausmult !== links) weg.push(`${Math.abs(f) === 1 ? 'Klammer aufgelöst' : 'Ausmultipliziert'}: ${ausmult} = ${fmt(c)}`);
    // Zusammenfassen steht in derselben Zeile, wie auf der Seite
    // („6 + 2t + 16 − 2t + 20 − 4t = 30, zusammengefasst 42 − 4t = 30“).
    const zusammen = linText([[k0, ''], [cY, y]]);
    const loes = `${y} = <strong>${fmt(R / cY)}</strong>`;
    const teilen = cY === -1 ? '&nbsp;| · (−1)' : `&nbsp;| : ${par(cY)}`;
    if (k0 !== 0) {
      if (zusammen !== ausmult) weg[weg.length - 1] += `, zusammengefasst ${zusammen} = ${fmt(c)}`;
      weg[weg.length - 1] += `&nbsp;| ${k0 > 0 ? '−' : '+'} ${fmt(Math.abs(k0))}`;
      if (cY === 1) weg.push(loes);
      else weg.push(`${koef(cY, y)} = ${fmt(R)}${teilen}`, loes);
    } else {
      // Keine Zahl zu verschieben: Die Zusammenfassung ist schon „cY · y = R“.
      if (zusammen !== ausmult) weg[weg.length - 1] += `, zusammengefasst ${cY === 1 ? loes : `${koef(cY, y)} = ${fmt(R)}`}`;
      if (cY !== 1) {
        weg[weg.length - 1] += teilen;
        weg.push(loes);
      }
    }
    return weg;
  }

  /** Rückrechnung aus x = A + B · y, etwa „t = −6 − 2 · (−2) = −2“; bei A = 0
      „t = 2 · (−1) = −2“, „t = s = 3“ oder „t = −s = −(−1) = 1“. */
  function rueckWeg(x, A, B, y, yWert, fett) {
    const w = A + B * yWert;
    const erg = fett ? `<strong>${fmt(w)}</strong>` : fmt(w);
    if (A !== 0) {
      const glied = Math.abs(B) === 1 ? par(yWert) : `${fmt(Math.abs(B))} · ${par(yWert)}`;
      return `${x} = ${fmt(A)} ${B < 0 ? '−' : '+'} ${glied} = ${erg}`;
    }
    if (B === 1) return `${x} = ${y} = ${erg}`;
    if (B === -1) return `${x} = −${y} = ${yWert < 0 ? `−${par(yWert)} = ` : ''}${erg}`;
    return `${x} = ${fmt(B)} · ${par(yWert)} = ${erg}`;
  }
  const vektoren = {
    id: 'vektoren',
    icon: 'x|y|z',
    title: 'Vektoren im Raum',
    tagline: 'Punkte, Pfeile und Rechnen mit Koordinaten',
    learn: `
      <h2>Vektoren im Raum – Orte und Verschiebungen</h2>
      <p>In der Ebene braucht man zwei Zahlen, um einen Ort anzugeben. Im Raum sind es drei:
      eine nach rechts, eine nach hinten, eine nach oben. Dieselben drei Zahlen können aber
      auch etwas ganz anderes bedeuten – nämlich eine <strong>Verschiebung</strong>. Genau
      diese beiden Rollen hält die analytische Geometrie auseinander: Ein <em>Punkt</em> ist
      ein Ort, ein <em>Vektor</em> ist ein Pfeil, der von irgendwo nach irgendwo führt.</p>

      <div class="einstieg-box">
        <p class="box-title">Die Drohne über dem Sportplatz</p>
        <p>Eine Drohne steht auf dem Rasen im Punkt P(3 | 1 | 0); gemessen wird in Metern,
        die dritte Zahl ist die Höhe. Sie fliegt 2 m nach rechts, 6 m nach hinten und
        9 m nach oben.</p>
        <p class="frage">In welchem Punkt schwebt sie danach – und wie weit ist sie dann in
        Luftlinie vom Start entfernt?</p>
      </div>

      <h3>Punkt oder Pfeil?</h3>

      <div class="herleitung-box">
        <p class="box-title">Warum sich die Komponenten einfach addieren</p>
        <p>Ein Pfeil im Raum wird durch drei Zahlen beschrieben: wie weit er nach rechts, nach
        hinten und nach oben führt. Diese drei Zahlen heißen seine <strong>Komponenten</strong>.
        Sie werden unabhängig voneinander gemessen – eine Bewegung nach rechts ändert nichts
        an der Höhe.</p>
        <p>Deshalb sind zwei Pfeile genau dann derselbe Vektor, wenn ihre drei Komponenten
        übereinstimmen. Wo der Pfeil beginnt, gehört nicht dazu: Ein Pfeil, der vom Boden drei
        Schritte nach oben führt, und einer, der vom Dach drei Schritte nach oben führt,
        beschreiben dieselbe Verschiebung.</p>
        <p>Hängt man zwei Verschiebungen hintereinander, addieren sich die Anteile in jeder
        Richtung für sich: erst 2 nach rechts, dann noch 5 nach rechts, zusammen 7 nach rechts.
        Die Höhe hat davon nichts mitbekommen. Deshalb rechnet man mit Vektoren
        <strong>zeilenweise</strong> – jede Komponente ist eine eigene kleine Rechnung.</p>
        <p>Einen Punkt bekommt man in diese Rechnung hinein, indem man ihm den Pfeil vom
        Ursprung O(0 | 0 | 0) zu ihm selbst zuordnet: seinen <strong>Ortsvektor</strong>. Der
        trägt genau die Koordinaten des Punktes. Ab da darf man mit Punkten rechnen wie mit
        Pfeilen – und das ist der ganze Trick der analytischen Geometrie.</p>
      </div>

      <p>Und weil jede Zeile für sich rechnet, wird aus einer Vektorgleichung wie
      r · a + s · b = c ein Bündel aus <strong>drei gewöhnlichen Gleichungen</strong> – eine
      je Zeile. Zwei davon genügen, um r und s zu bestimmen; die dritte ist dann die Probe.
      Geht sie nicht auf, lässt sich c gar nicht aus a und b zusammensetzen.</p>

      <div class="merkkasten">
        <p class="box-title">Die Grundformeln</p>
        <p><strong>Ortsvektor:</strong> Zu P(p₁ | p₂ | p₃) gehört der Ortsvektor
        ${vname('OP')} = <span class="vek"><span>p₁</span><span>p₂</span><span>p₃</span></span> –
        dieselben drei Zahlen, nur untereinander geschrieben. Diese Spaltenschreibweise
        benutzen die Aufgaben durchgehend.</p>
        <p><strong>Verbindungsvektor:</strong> AB = OB − OA, kurz: <em>Spitze minus Fuß</em>.</p>
        <p><strong>Addieren, subtrahieren, vervielfachen:</strong> zeilenweise, jede Komponente
        für sich – etwa ${vek([2, -1, 4])} + ${vek([3, 5, -1])} = ${vek([5, 4, 3])}.</p>
        <p><strong>Betrag (Länge):</strong> |a| = √(a₁² + a₂² + a₃²)</p>
        <p><strong>Mittelpunkt der Strecke AB:</strong> OM = ½ · (OA + OB)</p>
        <p><strong>Kollinear</strong> heißt: b = r · a für eine Zahl r. Die beiden Pfeile sind
        dann parallel.</p>
        <p><strong>Gegenvektor:</strong> −a dreht in jeder Zeile das Vorzeichen um;
        a + (−a) ergibt den <em>Nullvektor</em> (0 | 0 | 0).</p>
        <p><strong>Vierte Ecke im Parallelogramm ABCD:</strong> OD = OA + BC&nbsp;(denn AD und BC sind gleich lang und gleich gerichtet)</p>
        <p><strong>Schwerpunkt des Dreiecks ABC:</strong> OS = ⅓ · (OA + OB + OC)</p>
        <p><strong>Vektorgleichung r · a + s · b = c:</strong> zeilenweise aufschreiben, das
        ergibt drei Gleichungen. Zwei davon liefern r und s, die dritte ist die Probe – geht
        sie nicht auf, gibt es kein passendes r und s.</p>
      </div>

      <h3>So rechnest du</h3>
      <ol class="schritte">
        <li>Punkte in Ortsvektoren übersetzen: Aus den Koordinaten werden Komponenten.</li>
        <li>Brauchst du den Pfeil zwischen zwei Punkten, rechne <strong>Spitze minus Fuß</strong>:
        AB = B − A.</li>
        <li>Rechne zeilenweise. Die drei Zeilen wissen nichts voneinander – schreibe sie
        untereinander, dann verrutscht nichts. Stecken Unbekannte darin, ist jede Zeile eine
        Gleichung: zwei lösen, mit der dritten prüfen.</li>
        <li>Beim Betrag: alle drei Komponenten quadrieren, addieren, Wurzel ziehen. Die
        Vorzeichen fallen dabei weg.</li>
        <li>Am Ende zurückübersetzen: War ein Punkt gefragt, schreibe P(… | … | …). War ein
        Vektor gefragt, gib die drei Komponenten an.</li>
      </ol>

      <h3>Beispiele</h3>

      <div class="example-box">
        <p class="ex-title">Verbindungsvektor und Länge</p>
        <p>A(2 | 1 | 1) und B(3 | 5 | 9).</p>
        <p>Spitze minus Fuß: 3 − 2 = 1,&nbsp;5 − 1 = 4,&nbsp;9 − 1 = 8. Der Vektor AB hat
        also die Komponenten 1, 4, 8.</p>
        <p>|AB| = √(1² + 4² + 8²) = √(1 + 16 + 64) = √81 = <strong>9</strong></p>
        <p>Die Strecke AB ist 9 Einheiten lang.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Mittelpunkt einer Strecke</p>
        <p>A(1 | 2 | 4) und B(7 | 6 | 10).</p>
        <p>Zeile für Zeile der Mittelwert: (1 + 7) : 2 = 4,&nbsp;(2 + 6) : 2 = 4,&nbsp;(4 + 10) : 2 = 7.</p>
        <p>Der Mittelpunkt ist <strong>M(4 | 4 | 7)</strong>. Probe: Von A nach M sind es
        3, 2, 3 – und von M nach B noch einmal genau 3, 2, 3.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Kollinear oder nicht?</p>
        <p>a hat die Komponenten 2, −3, 4, und b hat −6, 9, −12.</p>
        <p>Zeile 1: −6 : 2 = −3.&nbsp;Zeile 2: 9 : (−3) = −3.&nbsp;Zeile 3: −12 : 4 = −3.</p>
        <p>Alle drei Zeilen liefern denselben Faktor, also ist b = −3 · a. Die Pfeile sind
        <strong>kollinear</strong> – und weil der Faktor negativ ist, zeigen sie in genau
        entgegengesetzte Richtungen.</p>
        <p>Achtung: Es genügt nicht, dass <em>eine</em> Zeile aufgeht. Bei b mit den
        Komponenten −6, 9, −11 stimmen zwei Zeilen und die dritte nicht: −11 : 4 = −2,75.
        Dann sind die Vektoren nicht kollinear.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Die vierte Ecke eines Parallelogramms</p>
        <p>A(1 | 4 | −1), B(4 | 7 | −4) und C(5 | 3 | −6) sind drei Ecken des
        Parallelogramms ABCD. Gesucht ist D.</p>
        <p>Im Parallelogramm sind AD und BC gleich lang und gleich gerichtet, also
        AD = BC:</p>
        <p>BC = OC − OB = (5 | 3 | −6) − (4 | 7 | −4) = (1 | −4 | −2)</p>
        <p>OD = OA + BC = (1 | 4 | −1) + (1 | −4 | −2) = <strong>(2 | 0 | −3)</strong>, also D(2 | 0 | −3)</p>
        <p>Probe: AB = (3 | 3 | −3) und DC = OC − OD = (3 | 3 | −3) – auch die zweite
        Seite passt, es ist wirklich ein Parallelogramm.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Schwerpunkt eines Dreiecks</p>
        <p>A(2 | 1 | 4), B(5 | 7 | 1), C(−1 | 4 | 7)</p>
        <p>OS = ⅓ · (OA + OB + OC) = ⅓ · (6 | 12 | 12) = <strong>(2 | 4 | 4)</strong></p>
        <p>Wie beim Mittelpunkt wird zeilenweise gemittelt – nur über drei Punkte statt
        über zwei. Der Schwerpunkt ist der Punkt, in dem sich die drei Seitenhalbierenden
        treffen.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Zwei Zahlen aus drei Zeilen</p>
        <p>a hat die Komponenten 4, 4, −1, b hat 0, 4, −3, und c hat −8, 0, −4. Gesucht sind
        r und s mit r · a + s · b = c.</p>
        <p>Jede Zeile ist eine eigene Gleichung. Fang mit der an, in der eine Null steht:</p>
        <p>Zeile 1: r · 4 + s · 0 = −8. Die Null bei b macht diese Zeile bequem – dort bleibt
        nur r · 4 = −8 übrig, also r = <strong>−2</strong>.</p>
        <p>Zeile 2: r in die Zeile einsetzen: (−2) · 4 + s · 4 = 0, also s · 4 = 8 und
        s = <strong>2</strong>.</p>
        <p>Zeile 3 ist die Probe: (−2) · (−1) + 2 · (−3) = 2 − 6 = −4 ✓</p>
        <p>Also r = −2 und s = 2: c lässt sich aus a und b zusammensetzen.</p>
        <p>Wäre c = (−8 | 0 | −3), gingen die ersten beiden Zeilen genauso auf – die dritte
        ergäbe aber −4 statt −3. Dann gibt es <em>kein</em> passendes r und s: c lässt sich
        nicht aus a und b zusammensetzen. Zwei Zeilen genügen also nie; erst die dritte
        entscheidet.</p>
      </div>

      <div class="example-box">
        <p class="ex-title">Die Drohne aus dem Einstieg</p>
        <p>Start: P(3 | 1 | 0). Die Verschiebung hat die Komponenten 2, 6, 9.</p>
        <p>Zielpunkt zeilenweise: 3 + 2 = 5,&nbsp;1 + 6 = 7,&nbsp;0 + 9 = 9, also
        <strong>Q(5 | 7 | 9)</strong>.</p>
        <p>Luftlinie: √(2² + 6² + 9²) = √(4 + 36 + 81) = √121 = <strong>11 m</strong>.</p>
        <p>Sie schwebt 9 m hoch, ist aber 11 m vom Start entfernt – der schräge Weg ist immer
        länger als der senkrechte.</p>
      </div>

      <div class="achtung-box">
        <p class="achtung-title">Spitze minus Fuß – nicht umgekehrt</p>
        <p>Der Verbindungsvektor AB ist B − A. Wer A − B rechnet, bekommt denselben Pfeil in
        der Gegenrichtung, also BA. Im Ergebnis stimmen alle Zahlen, nur alle Vorzeichen sind
        falsch – und genau das fällt beim Abschreiben nicht auf.</p>
        <p><strong>Gegenbeispiel:</strong> A(2 | 1 | 1) und B(3 | 5 | 9).</p>
        <p>Richtig: AB = B − A hat die Komponenten 1, 4, 8. Probe: 2 + 1 = 3,&nbsp;1 + 4 = 5,&nbsp;1 + 8 = 9 – das ist B. ✓</p>
        <p>Falsch: A − B hat die Komponenten −1, −4, −8. Probe: 2 + (−1) = 1,&nbsp;1 + (−4) = −3,&nbsp;1 + (−8) = −7. Das ergibt (1 | −3 | −7) und liegt nirgends
        in der Nähe von B(3 | 5 | 9).</p>
        <p>Merke dir die Probe: <em>Fuß plus Pfeil muss die Spitze ergeben.</em> Sie kostet
        zehn Sekunden und findet den Vorzeichenfehler jedes Mal.</p>
      </div>

      <div class="selbstcheck">
        <p class="box-title">Selbstcheck</p>
        <details><summary>Worin unterscheiden sich der Punkt P(2 | 3 | 6) und ein Vektor mit den Komponenten 2, 3, 6?</summary>
        <p>Der Punkt ist ein Ort, der Vektor eine Verschiebung. Beide tragen dieselben drei
        Zahlen, weil der Ortsvektor von P genau vom Ursprung nach P führt. Der Vektor darf
        aber überall angesetzt werden – der Punkt liegt fest.</p></details>
        <details><summary>Ist die Länge eines Vektors mit den Komponenten 3, 4, 12 gleich 3 + 4 + 12?</summary>
        <p>Nein. Die Summe wäre 19, der Betrag ist √(9 + 16 + 144) = √169 = 13. Addieren
        dürfte man nur, wenn man die drei Wege nacheinander in derselben Richtung liefe. Der
        Pfeil geht aber auf direktem Weg.</p></details>
        <details><summary>Ein Vektor a hat den Betrag 6. Wie lang ist 2 · a?</summary>
        <p>12. Jede Komponente wird verdoppelt, unter der Wurzel steht dann das Vierfache, und
        √4 = 2. Allgemein gilt |r · a| = |r| · |a| – der Betrag von r, denn eine Länge ist nie
        negativ.</p></details>
        <details><summary>Warum ergibt A + AB immer B?</summary>
        <p>Weil AB als B − A festgelegt ist. Eingesetzt: A + (B − A) = B. Genau das ist die
        Probe für jeden Verbindungsvektor.</p></details>
        <details><summary>Zwei Pfeile liegen an ganz verschiedenen Stellen im Raum. Wann stellen sie denselben Vektor dar?</summary>
        <p>Wenn ihre drei Komponenten übereinstimmen – wenn sie also gleich lang sind, parallel
        liegen und in dieselbe Richtung zeigen. Der Startpunkt gehört nicht zum Vektor.</p></details>
      </div>
    `,
    gen(diff) {

      /* ---------------- Stufe 1: Grundrechenarten mit Vektoren ---------------- */
      if (diff === 1) {
        const art = rnd(1, 7);

        if (art === 1 || art === 2) {
          const plus = art === 1;
          const a = zufallsVektor(-7, 7);
          let b = zufallsVektor(-7, 7);
          while (gleichV(a, b)) b = zufallsVektor(-7, 7);   // a − a wäre keine Aufgabe
          const s = plus ? plusV(a, b) : minusV(a, b);
          const z = plus ? '+' : '−';
          return {
            q: `Gegeben sind ${vname('a')} = ${vek(a)} und ${vname('b')} = ${vek(b)}. Berechne ${vname('a')} ${z} ${vname('b')}. ${KOMP_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(s), testAnswer: s.join('; '),
            answerText: vek(s),
            solution: `Zeile für Zeile rechnen, jede Komponente für sich:${TRENN}${zeilen(a, z, b, s)}${TRENN}${vname('a')} ${z} ${vname('b')} = <strong>${vek(s)}</strong>`
          };
        }

        if (art === 3) {
          const a = zufallsVektor(-6, 6);
          const r = choice([-4, -3, -2, 2, 3, 4]);   // ±1 wäre der Gegenvektor bzw. gar nichts
          const s = malV(r, a);
          return {
            q: `Gegeben ist ${vname('a')} = ${vek(a)}. Berechne ${fmt(r)} · ${vname('a')}. ${KOMP_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(s), testAnswer: s.join('; '),
            answerText: vek(s),
            solution: `Der Faktor trifft jede Komponente einzeln:${TRENN}${a.map((k, i) => `${fmt(r)} · ${par(k)} = ${fmt(s[i])}`).join(TRENN)}${TRENN}${fmt(r)} · ${vname('a')} = <strong>${vek(s)}</strong>`
          };
        }

        if (art === 4) {
          const a = zufallsVektor(-8, 8);
          const g = malV(-1, a);
          // Sechs verschiedene Vorzeichenmuster, alle Komponenten ungleich 0:
          // damit sind die Optionen paarweise verschieden, egal wie gewürfelt wird.
          const ablenker = [a, [-a[0], a[1], a[2]], [a[0], -a[1], -a[2]],
            [-a[0], -a[1], a[2]], [a[0], -a[1], a[2]]].map(vek);
          // Gründe beschreiben den Ablenker gegenüber a – nie gegenüber der Lösung.
          const mc = makeChoice(vek(g), ablenker, [
            `Das ist ${vname('a')} selbst – hier ist kein Vorzeichen umgedreht.`,
            'Hier ist nur das Vorzeichen der ersten Komponente umgedreht.',
            'Hier sind nur die Vorzeichen der zweiten und dritten Komponente umgedreht.',
            'Hier sind nur die Vorzeichen der ersten und zweiten Komponente umgedreht.',
            'Hier ist nur das Vorzeichen der zweiten Komponente umgedreht.'
          ]);
          return {
            q: `Gegeben ist ${vname('a')} = ${vek(a)}. Welcher Vektor ist der Gegenvektor zu ${vname('a')}?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: vek(g),
            solution: `Der Gegenvektor dreht <em>jedes</em> Vorzeichen um: <strong>${vek(g)}</strong>${TRENN}Probe: ${vek(a)} + ${vek(g)} = ${vek([0, 0, 0])} – zusammen ergeben die beiden den Nullvektor, und genau das macht sie zu Gegenvektoren.`
          };
        }

        if (art === 5) {
          /* Der Punkt wird in WORTEN beschrieben, nicht in Koordinaten.
             Vorher lautete die Aufgabe „P(7 | −7 | −4) – gib die Komponenten
             seines Ortsvektors an“, und die Antwort stand damit zeichengleich
             schon in der Frage: reines Abschreiben, 14 % der Stufe ohne jede
             Übersetzungsleistung. Jetzt muss die Richtung erst in ein
             Vorzeichen übersetzt werden. */
          const p = zufallsVektor(-9, 9);
          const wort = [
            [p[0] > 0 ? 'nach rechts' : 'nach links', Math.abs(p[0])],
            [p[1] > 0 ? 'nach hinten' : 'nach vorn', Math.abs(p[1])],
            [p[2] > 0 ? 'nach oben' : 'nach unten', Math.abs(p[2])]
          ].map(([r, n]) => `${fmt(n)} ${r}`).join(', ');
          return {
            q: `Vom Ursprung aus geht es ${wort} zum Punkt P. Gib die Komponenten des Ortsvektors ${vname('OP')} an. <span class="hint">Rechts, hinten und oben zählen positiv. Drei Komponenten mit Semikolon, z. B. 3; −1; 5.</span>`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(p), testAnswer: p.join('; '),
            answerText: vek(p),
            solution: `Der Ortsvektor ist der Pfeil vom Ursprung O(0 | 0 | 0) zum Punkt – seine drei Komponenten sind genau die drei Wege.${TRENN}${fmt(Math.abs(p[0]))} ${p[0] > 0 ? 'nach rechts' : 'nach links'} ⇒ erste Komponente ${fmt(p[0])}${TRENN}${fmt(Math.abs(p[1]))} ${p[1] > 0 ? 'nach hinten' : 'nach vorn'} ⇒ zweite Komponente ${fmt(p[1])}${TRENN}${fmt(Math.abs(p[2]))} ${p[2] > 0 ? 'nach oben' : 'nach unten'} ⇒ dritte Komponente ${fmt(p[2])}${TRENN}${vname('OP')} = <strong>${vek(p)}</strong>, also ${punkt('P', p)}`
          };
        }

        if (art === 6) {
          const a = zufallsVektor(-5, 5);
          const b = zufallsVektor(-9, 9);
          const r = choice([-3, -2, 2, 3]);
          const ra = malV(r, a);
          const s = plusV(ra, b);
          return {
            q: `Gegeben sind ${vname('a')} = ${vek(a)} und ${vname('b')} = ${vek(b)}. Berechne ${fmt(r)} · ${vname('a')} + ${vname('b')}. ${KOMP_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(s), testAnswer: s.join('; '),
            answerText: vek(s),
            solution: `Erst vervielfachen, dann addieren – wieder zeilenweise:${TRENN}${a.map((k, i) => `${fmt(r)} · ${par(k)} + ${par(b[i])} = ${fmt(s[i])}`).join(TRENN)}${TRENN}${fmt(r)} · ${vname('a')} + ${vname('b')} = <strong>${vek(s)}</strong>`
          };
        }

        const A = zufallsVektor(-8, 8);
        const v = zufallsVektor(-6, 6);
        const B = plusV(A, v);
        return {
          q: `Ein Pfeil beginnt im Punkt ${punkt('A', A)} und beschreibt die Verschiebung ${vname('v')} = ${vek(v)}. In welchem Punkt endet er? ${PUNKT_HINWEIS}`,
          type: 'input', placeholder: 'z. B. 3; −1; 5',
          check: orderedCheck(B), testAnswer: B.join('; '),
          answerText: punkt('B', B),
          solution: `Zum Ortsvektor von A wird die Verschiebung addiert:${TRENN}${zeilen(A, '+', v, B)}${TRENN}Der Pfeil endet in <strong>${punkt('B', B)}</strong>`
        };
      }

      /* ------- Stufe 2: Verbindungsvektor, Betrag, Mittelpunkt, Länge ------- */
      if (diff === 2) {
        const art = rnd(1, 7);

        if (art === 1) {
          const A = zufallsVektor(-8, 8);
          let B = zufallsVektor(-8, 8);
          while (gleichV(A, B)) B = zufallsVektor(-8, 8);
          const d = minusV(B, A);
          return {
            q: `Gegeben sind ${punkt('A', A)} und ${punkt('B', B)}. Berechne den Verbindungsvektor ${vname('AB')}. ${KOMP_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(d), testAnswer: d.join('; '),
            answerText: vek(d),
            solution: `Spitze minus Fuß: ${vname('AB')} = ${vname('OB')} − ${vname('OA')}${TRENN}${zeilen(B, '−', A, d)}${TRENN}${vname('AB')} = <strong>${vek(d)}</strong>${TRENN}Probe: Fuß plus Pfeil ergibt die Spitze – ${vek(A)} + ${vek(d)} = ${vek(B)} ✓`
          };
        }

        if (art === 2) {
          const [a, L] = betragsVektor();
          return {
            q: `Berechne den Betrag des Vektors ${vname('a')} = ${vek(a)}.`,
            type: 'input', placeholder: 'Betrag',
            check: numCheck(L), testAnswer: String(L),
            answerText: `|${vname('a')}| = ${fmt(L)}`,
            solution: `Alle drei Komponenten quadrieren, addieren, Wurzel ziehen:${TRENN}|${vname('a')}| = √(${par(a[0])}² + ${par(a[1])}² + ${par(a[2])}²) = √(${fmt(a[0] * a[0])} + ${fmt(a[1] * a[1])} + ${fmt(a[2] * a[2])}) = √${fmt(L * L)} = <strong>${fmt(L)}</strong>${TRENN}Die Vorzeichen fallen beim Quadrieren weg – eine Länge ist nie negativ.`
          };
        }

        if (art === 3) {
          const A = zufallsVektor(-8, 8);
          // Gerade Differenz, damit der Mittelpunkt ganzzahlig bleibt
          const B = A.map(k => k + 2 * rndNonZero(-4, 4));
          const M = A.map((k, i) => (k + B[i]) / 2);
          return {
            q: `Gegeben sind ${punkt('A', A)} und ${punkt('B', B)}. Berechne den Mittelpunkt M der Strecke AB. ${PUNKT_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(M), testAnswer: M.join('; '),
            answerText: punkt('M', M),
            solution: `Der Mittelpunkt ist der Mittelwert der beiden Ortsvektoren:${TRENN}${vname('OM')} = ½ · (${vek(A)} + ${vek(B)}) = ½ · ${vek(plusV(A, B))} = ${vek(M)}${TRENN}Also <strong>${punkt('M', M)}</strong>`
          };
        }

        if (art === 4) {
          const [d, L] = betragsVektor();
          const A = zufallsVektor(-7, 7);
          const B = plusV(A, d);
          return {
            q: `Wie lang ist die Strecke zwischen ${punkt('A', A)} und ${punkt('B', B)}?`,
            type: 'input', placeholder: 'Länge',
            check: numCheck(L), testAnswer: String(L),
            answerText: `|${vname('AB')}| = ${fmt(L)}`,
            solution: `Erst der Verbindungsvektor, dann sein Betrag.${TRENN}${vname('AB')} = ${vek(B)} − ${vek(A)} = ${vek(d)}${TRENN}|${vname('AB')}| = √(${par(d[0])}² + ${par(d[1])}² + ${par(d[2])}²) = √(${fmt(d[0] * d[0])} + ${fmt(d[1] * d[1])} + ${fmt(d[2] * d[2])}) = √${fmt(L * L)} = <strong>${fmt(L)}</strong>`
          };
        }

        if (art === 5) {
          /* Nach dem FUSS gefragt, nicht nach der Spitze. Vorher war das
             dieselbe Addition wie in Stufe 1 („Pfeil beginnt in A, Verschiebung
             v – wo endet er?“), nur anders eingekleidet: gleicher Zahlenraum,
             gleicher Lösungsweg. Rückwärts verlangt es die Umstellung, die die
             Erklärseite als „Spitze minus Fuß“ einführt. */
          const A = zufallsVektor(-8, 8);
          const d = zufallsVektor(-7, 7);
          const B = plusV(A, d);
          return {
            q: `Der Verbindungsvektor ${vname('AB')} = ${vek(d)} endet im Punkt ${punkt('B', B)}. Bestimme die Koordinaten von A. ${PUNKT_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(A), testAnswer: A.join('; '),
            answerText: punkt('A', A),
            solution: `Aus ${vname('AB')} = ${vname('OB')} − ${vname('OA')} folgt durch Umstellen ${vname('OA')} = ${vname('OB')} − ${vname('AB')}:${TRENN}${zeilen(B, '−', d, A)}${TRENN}<strong>${punkt('A', A)}</strong>${TRENN}Probe: Fuß plus Pfeil ergibt die Spitze – ${vek(A)} + ${vek(d)} = ${vek(B)} ✓`
          };
        }

        if (art === 6) {
          const A = zufallsVektor(-8, 8);
          const halb = zufallsVektor(-5, 5);
          const M = plusV(A, halb);
          const B = plusV(M, halb);
          return {
            q: `${punkt('M', M)} ist der Mittelpunkt der Strecke AB, und ${punkt('A', A)} ist bekannt. Bestimme B. ${PUNKT_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(B), testAnswer: B.join('; '),
            answerText: punkt('B', B),
            solution: `Von A nach M ist es der halbe Weg – von M nach B geht es noch einmal genauso weiter.${TRENN}${vname('AM')} = ${vek(M)} − ${vek(A)} = ${vek(halb)}${TRENN}${vname('OB')} = ${vname('OM')} + ${vname('AM')} = ${vek(M)} + ${vek(halb)} = ${vek(B)}${TRENN}Also <strong>${punkt('B', B)}</strong>`
          };
        }

        /* Früher eine Auswahlaufgabe („Welcher Punkt liegt am weitesten …?“).
           Die war ohne Rechnung lösbar: Bei ganzzahligen Beträgen wächst die
           Koordinatensumme fast zwangsläufig mit dem Betrag, gemessen traf die
           Faustregel „größte Summe“ in 99,3 % der Fälle. Widerlegen lässt sich
           die Regel nicht – der Quotient Summe : Betrag liegt bei ganzzahligen
           Beträgen immer zwischen 1,4 und √3, eine Umkehrung gibt es nicht.
           Deshalb jetzt eine Eingabe: Welcher Punkt der weitere ist, mag man
           raten – der Betrag will trotzdem gerechnet werden, und genau der ist
           die Fertigkeit. */
        const [t1, t2] = (() => {
          const g = shuffle(BETRAG_TRIPEL);
          const a = g[0];
          const b = g.find(x => x[3] !== a[3]);
          return [a, b];
        })();
        const mach = t => shuffle([t[0], t[1], t[2]]).map(k => k * choice([1, -1]));
        const P = mach(t1), Q = mach(t2);
        const weiter = t1[3] > t2[3];
        const gesuchtP = weiter ? P : Q, gesuchtL = Math.max(t1[3], t2[3]);
        const quad = v => v.map(k => k * k);
        const zeile = (name, v, L) =>
          `|${vname('O' + name)}| = √(${par(v[0])}² + ${par(v[1])}² + ${par(v[2])}²) = √(${quad(v).map(k => fmt(k)).join(' + ')}) = √${fmt(L * L)} = ${fmt(L)}`;
        return {
          q: `Welcher der beiden Punkte ${punkt('A', P)} und ${punkt('B', Q)} liegt weiter vom Ursprung entfernt? Gib den Betrag seines Ortsvektors an.`,
          type: 'input', placeholder: 'Betrag',
          // „B, 15“ oder „Punkt B: 15“ gilt, wenn der Buchstabe stimmt – der falsche Buchstabe nicht
          check: Util.rueckmeldung(
            s => numCheck(gesuchtL)(s) || (typeof s === 'string' && new RegExp(`^\\s*(?:Punkt\\s*)?${weiter ? 'A' : 'B'}\\b[^\\d=≈]*`, 'i').test(s) && numCheck(gesuchtL)(s.replace(/^[^\d]*/, ''))),
            1, 'zahl', s => numCheck(gesuchtL).diagnose(String(s).replace(/^\s*(?:Punkt\s*)?[AB]\b[^\d=≈]*/i, '')),
            // lesbar mit demselben Vorspann: „B, 17“ (falscher Punkt) ist ein Versuch, kein Lesefehler
            s => Util.parseAlle(String(s).replace(/^\s*(?:Punkt\s*)?[AB]\b[^\d=≈]*/i, '')).length > 0),
          testAnswer: String(gesuchtL),
          answerText: `|${vname('O' + (weiter ? 'A' : 'B'))}| = ${fmt(gesuchtL)}`,
          solution: `Beide Beträge ausrechnen und vergleichen:${TRENN}${zeile('A', P, t1[3])}${TRENN}${zeile('B', Q, t2[3])}${TRENN}Weiter entfernt liegt <strong>${weiter ? 'A' : 'B'}</strong>, sein Ortsvektor hat den Betrag <strong>${fmt(gesuchtL)}</strong>.${TRENN}Die Summe der Koordinaten hilft dabei nicht: Gefragt ist die Wurzel aus der Summe der <em>Quadrate</em>.`
        };
      }

      /* --- Stufe 3: Kollinearität, Linearkombination, Parallelogramm, Schwerpunkt --- */
      const art = rnd(1, 6);

      if (art === 1) {
        const a = verschiedeneKomponenten(-6, 6);
        const k = choice([-3, -2, 2, 3]);
        const [x, y, z] = malV(k, a);
        const richtig = vek([x, y, z]);
        // Vertauschte und vorzeichenverdrehte Fassungen desselben Vielfachen: Sie
        // sehen aus wie die Lösung und sind doch keine – wer nur eine Zeile prüft,
        // fällt darauf herein.
        const ablenker = [[y, x, z], [x, z, y], [x, y, -z], [-x, y, z], [y, z, x]].map(vek);
        /* Gründe nur an den Vorzeichenfassungen: Dort ergeben zwei Zeilen den
           Faktor k, die dritte −k – genau der Fehler „zwei Zeilen genügen“.
           Die Umstellungen entstehen aus keinem benennbaren Fehler; jeder Satz
           über sie („vertauscht“) zeigte direkt auf die Lösung. */
        const mc = makeChoice(richtig, ablenker, [null, null,
          'Die ersten beiden Zeilen ergeben denselben Faktor, die dritte einen anderen – zwei passende Zeilen genügen nicht.',
          'Die zweite und dritte Zeile ergeben denselben Faktor, die erste einen anderen – zwei passende Zeilen genügen nicht.',
          null]);
        return {
          q: `Gegeben ist ${vname('a')} = ${vek(a)}. Welcher der Vektoren ist zu ${vname('a')} kollinear, also ein Vielfaches von ${vname('a')}?`,
          type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
          answerText: richtig,
          solution: `Kollinear heißt: In <em>allen drei</em> Zeilen steht derselbe Faktor.${TRENN}${fmt(a[0])} · ${par(k)} = ${fmt(x)},&nbsp;${fmt(a[1])} · ${par(k)} = ${fmt(y)},&nbsp;${fmt(a[2])} · ${par(k)} = ${fmt(z)}${TRENN}Also ist <strong>${richtig}</strong> = ${fmt(k)} · ${vname('a')}.${TRENN}Bei den anderen stimmt der Faktor nicht in allen drei Zeilen – eine passende Zeile genügt nicht.`
        };
      }

      if (art === 2) {
        const a = verschiedeneKomponenten(-6, 6);
        const r = choice([-4, -3, -2, 2, 3, 4]);
        const b = malV(r, a);
        return {
          q: `Die Vektoren ${vname('a')} = ${vek(a)} und ${vname('b')} = ${vek(b)} sind kollinear. Für welche Zahl r gilt ${vname('b')} = r · ${vname('a')}?`,
          type: 'input', placeholder: 'r = ?',
          check: numCheck(r), testAnswer: String(r),
          answerText: `r = ${fmt(r)}`,
          solution: `r aus einer Zeile ablesen und in den beiden anderen prüfen.${TRENN}Erste Zeile: r = ${fmt(b[0])} : ${par(a[0])} = <strong>${fmt(r)}</strong>${TRENN}Probe: ${fmt(r)} · ${par(a[1])} = ${fmt(b[1])} ✓&nbsp;und&nbsp;${fmt(r)} · ${par(a[2])} = ${fmt(b[2])} ✓`
        };
      }

      if (art === 3) {
        // In der ersten Zeile steht bei b eine 0 – dort bleibt nur r stehen. So ist
        // das Gleichungssystem im Kopf zu lösen, ohne Additionsverfahren.
        const a = [rnd(2, 4), rndNonZero(-4, 4), rndNonZero(-4, 4)];
        const b = [0, rnd(2, 4), rndNonZero(-4, 4)];
        const r = choice([-3, -2, 2, 3]);   // ±1 schriebe „1 · (−3)“ in den Lösungsweg
        const s = choice([-3, -2, 2, 3]);
        const c = a.map((k, i) => r * k + s * b[i]);
        return {
          q: `Gegeben sind ${vname('a')} = ${vek(a)}, ${vname('b')} = ${vek(b)} und ${vname('c')} = ${vek(c)}. Bestimme r und s so, dass r · ${vname('a')} + s · ${vname('b')} = ${vname('c')} gilt. <span class="hint">Gib erst r, dann s an, mit Semikolon getrennt.</span>`,
          type: 'input', placeholder: 'r; s',
          check: orderedCheck([r, s], 1e-6, ['r', 's']), testAnswer: `${r}; ${s}`,
          answerText: `r = ${fmt(r)}, s = ${fmt(s)}`,
          /* r und s stehen wie auf der Erklärseite in Klammern, sobald sie negativ
             sind („(−2) · 4 + s · 4 = 0“), und die Probe zeigt ihre Zwischenzeile
             („2 − 6 = −4“). Vorher stand dort „+ −3 · 4“ – eine negative Zahl
             direkt hinter dem Pluszeichen. Beide Produkte der Probe sind nie
             null, weil a₃, b₃, r und s es nicht sind. */
          solution: `Jede Zeile ist eine Gleichung. In der ersten steht bei ${vname('b')} eine Null – dort bleibt nur r:${TRENN}r · ${fmt(a[0])} = ${fmt(c[0])}, also r = <strong>${fmt(r)}</strong>${TRENN}r in die zweite Zeile einsetzen: ${par(r)} · ${par(a[1])} + s · ${fmt(b[1])} = ${fmt(c[1])}${TRENN}s · ${fmt(b[1])} = ${fmt(c[1] - r * a[1])}, also s = <strong>${fmt(s)}</strong>${TRENN}Probe in der dritten Zeile: ${par(r)} · ${par(a[2])} + ${par(s)} · ${par(b[2])} = ${fmt(r * a[2])} ${s * b[2] < 0 ? '−' : '+'} ${fmt(Math.abs(s * b[2]))} = ${fmt(c[2])} ✓`
        };
      }

      if (art === 4) {
        const A = zufallsVektor(-6, 6);
        const ab = zufallsVektor(-6, 6);
        let ad = zufallsVektor(-6, 6);
        // Parallele Seiten würden das Parallelogramm zu einer Strecke plattdrücken
        while (kollinearV(ab, ad)) ad = zufallsVektor(-6, 6);
        const B = plusV(A, ab);
        const C = plusV(B, ad);
        const D = plusV(A, ad);
        return {
          q: `Die Punkte ${punkt('A', A)}, ${punkt('B', B)} und ${punkt('C', C)} sind drei Ecken eines Parallelogramms ABCD. Bestimme die vierte Ecke D. ${PUNKT_HINWEIS}`,
          type: 'input', placeholder: 'z. B. 3; −1; 5',
          check: orderedCheck(D), testAnswer: D.join('; '),
          answerText: punkt('D', D),
          solution: `Im Parallelogramm ABCD sind die Seiten AD und BC gleich lang und gleich gerichtet, also ${vname('AD')} = ${vname('BC')}.${TRENN}${vname('BC')} = ${vek(C)} − ${vek(B)} = ${vek(ad)}${TRENN}${vname('OD')} = ${vname('OA')} + ${vname('BC')} = ${vek(A)} + ${vek(ad)} = ${vek(D)}${TRENN}Also <strong>${punkt('D', D)}</strong>`
        };
      }

      // Schwerpunkt: Erst S würfeln, dann die Ecken drumherum – so ist die Summe
      // der drei Ortsvektoren garantiert durch 3 teilbar.
      const S = zufallsVektor(-5, 5);
      const u = zufallsVektor(-6, 6);
      const w = zufallsVektor(-6, 6);
      const A = plusV(S, u);
      const B = plusV(S, w);
      const C = minusV(S, plusV(u, w));

      if (art === 5) {
        return {
          q: `Ein Dreieck hat die Ecken ${punkt('A', A)}, ${punkt('B', B)} und ${punkt('C', C)}. Bestimme seinen Schwerpunkt S. ${PUNKT_HINWEIS}`,
          type: 'input', placeholder: 'z. B. 3; −1; 5',
          check: orderedCheck(S), testAnswer: S.join('; '),
          answerText: punkt('S', S),
          solution: `Der Schwerpunkt ist der Mittelwert der drei Ortsvektoren:${TRENN}${vname('OS')} = ⅓ · (${vek(A)} + ${vek(B)} + ${vek(C)}) = ⅓ · ${vek(plusV(plusV(A, B), C))} = ${vek(S)}${TRENN}Also <strong>${punkt('S', S)}</strong>`
        };
      }

      const dreiS = malV(3, S);
      return {
        q: `Von einem Dreieck ABC sind der Schwerpunkt ${punkt('S', S)} und die Ecken ${punkt('A', A)} und ${punkt('B', B)} bekannt. Bestimme die dritte Ecke C. ${PUNKT_HINWEIS}`,
        type: 'input', placeholder: 'z. B. 3; −1; 5',
        check: orderedCheck(C), testAnswer: C.join('; '),
        answerText: punkt('C', C),
        solution: `Aus ${vname('OS')} = ⅓ · (${vname('OA')} + ${vname('OB')} + ${vname('OC')}) wird nach ${vname('OC')} umgestellt:${TRENN}${vname('OC')} = 3 · ${vname('OS')} − ${vname('OA')} − ${vname('OB')}${TRENN}3 · ${vek(S)} = ${vek(dreiS)}${TRENN}${vek(dreiS)} − ${vek(A)} − ${vek(B)} = ${vek(C)}${TRENN}Also <strong>${punkt('C', C)}</strong>`
      };
    }
  };

  /* ============================================================
     Skalarprodukt & Winkel – Entwurf, noch nicht eingebunden.
     Prüfen mit:
       node design/pruefung/einzel.js <diese Datei> <fig-skalarprodukt.svg>
     ============================================================ */
  'use strict';
  const skalarprodukt = (() => {

    /* ---------- Vektor-Werkzeuge ---------- */

    const skalar = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
    const quadrat = a => skalar(a, a);

    /* Nullkomponenten machen jede Rechenzeile unleserlich: aus „2 · 0 + 3 · 4“
       wird in der Zwischenzeile ein „+ 0“, also ein Summand, der nichts tut.
       Deshalb werden Komponenten grundsätzlich ungleich null gezogen. */
    const nz = max => rndNonZero(-max, max);
    const zufallsVektor = (n, max) => Array.from({ length: n }, () => nz(max));

    /* Antwortformat für einen Vektor der Ebene. Der Hinweis steht im Fragetext,
       damit er auch im Challenge-Modus sichtbar ist – dort gibt es keinen
       Tipp-Knopf. */
    const EBENE_HINWEIS = '<span class="hint">Gib die zwei Komponenten mit Semikolon getrennt ein, z. B. 3; −1.</span>';

    /**
     * Prüfung für „gib einen Vektor an, der senkrecht auf a steht“.
     * Die Aufgabe hat unendlich viele Lösungen – jedes von null verschiedene
     * Vielfache zählt –, deshalb wird nicht mit einer festen Antwort verglichen,
     * sondern gerechnet: Die Eingabe ist richtig, wenn ihr Skalarprodukt mit a
     * null ist. Der Nullvektor fällt heraus; er steht auf allem senkrecht und
     * beantwortet damit nichts – genau das sagt auch der Merkkasten.
     * Zerlegt wird wie in `Util.multiCheck`: Semikolon, „und“ oder Leerzeichen.
     *
     * Die Schranke ist RELATIV, nicht absolut: Eine feste Schranke von 1e−9
     * hätte „0,0000000001; 0“ durchgehen lassen (Skalarprodukt 6e−10), obwohl
     * dieser Vektor praktisch der Nullvektor ist – ausgerechnet der Fall, den die
     * Zeile darüber ausschließt. Gemessen am Produkt der beiden Beträge ist der
     * Vergleich unabhängig von der Größe der Eingabe: Exakte Lösungen ergeben
     * glatt null, alles andere fällt durch.
     */
    function senkrechtCheck(a) {
      return (eingabe) => {
        if (typeof eingabe !== 'string') return false;
        const teile = Util.teile(eingabe, a.length);
        if (!teile || teile.length !== a.length) return false;
        const z = teile.map(Util.parseNum);
        if (z.some(v => !Number.isFinite(v))) return false;
        const schranke = 1e-9 * Math.sqrt(quadrat(a) * quadrat(z));
        return schranke > 0 && Math.abs(skalar(a, z)) <= schranke;
      };
    }

    /** √q – als ganze Zahl, wenn die Wurzel aufgeht. */
    function wurzel(q) {
      const w = Math.sqrt(q);
      return Number.isInteger(w) ? fmt(w) : `√${fmt(q)}`;
    }

    /**
     * Rechenweg eines Skalarprodukts:
     * „2 · 3 + (−1) · 4 + 3 · (−2) = 6 − 4 − 6 = −4“
     * Die Zwischenzeile entfällt, sobald ein Produkt null wird – sonst stünde
     * dort „+ 0“.
     */
    function rechenweg(a, b) {
      const teile = a.map((x, i) => x * b[i]);
      const produkte = a.map((x, i) => `${par(x)} · ${par(b[i])}`).join(' + ');
      const zwischen = teile.some(t => t === 0) ? '' : ' = ' + teile
        .map((w, i) => i === 0 ? fmt(w) : (w < 0 ? ` − ${fmt(-w)}` : ` + ${fmt(w)}`)).join('');
      return `${produkte}${zwischen} = ${fmt(skalar(a, b))}`;
    }

    /** „|a| = √(2² + (−1)² + 3²) = √14“ */
    function betragWeg(name, v) {
      return `|${vname(name)}| = √(${v.map(x => `${par(x)}²`).join(' + ')}) = ${wurzel(quadrat(v))}`;
    }

    /**
     * Winkeldaten zu zwei Vektoren – oder null, wenn die Ziehung untauglich ist.
     *
     * Winkel gehen fast nie glatt auf, deshalb wird auf ganze Grad gerundet. Der
     * Lösungsweg zeigt den gerundeten Kosinus; aus genau diesem angezeigten Wert
     * muss derselbe Winkel folgen wie aus dem exakten – sonst führt der Weg
     * woanders hin als die Antwort. Zusätzlich fliegen sehr spitze und sehr
     * stumpfe Fälle raus: dort reagiert cos⁻¹ so empfindlich, dass die vierte
     * Nachkommastelle über das Ergebnis entscheidet.
     */
    /* `winkelGleich`: Auch der Winkel selbst geht auf – dann steht in der
       Winkelzeile „=“ statt „≈“. Bei rationalem Kosinus ist ein ganzzahliger
       Winkel nur bei ±0,5 möglich (60° bzw. 120°; 0°, 90° und 180° sind
       ausgeschlossen). Ohne das stand „cos φ = … = 0,5“ direkt über
       „φ = cos⁻¹(0,5) ≈ 60°“ – das Näherungszeichen, das die Fachprüfung bei
       „3/4 ≈ 0,75“ gestrichen hat. acos(0,5) liefert 60,00000000000001,
       daher die Toleranz. */
    function winkelExakt(gleich, anzeige, grad) {
      return gleich && Math.abs(Math.acos(anzeige) * 180 / Math.PI - grad) < 1e-9;
    }
    const winkelZeichen = d => d.winkelGleich ? '=' : '≈';

    function winkelDaten(a, b, mitBetrag) {
      const sk = skalar(a, b);
      if (sk === 0) return null;
      const q = quadrat(a) * quadrat(b);
      const cos = (mitBetrag ? Math.abs(sk) : sk) / Math.sqrt(q);
      if (Math.abs(cos) > 0.97) return null;
      const phi = Math.acos(cos) * 180 / Math.PI;
      const grad = Math.round(phi);
      if (Math.abs(phi - grad) > 0.45) return null;
      const anzeige = Number(cos.toFixed(4));
      if (Math.round(Math.acos(anzeige) * 180 / Math.PI) !== grad) return null;
      // `gleich`: Der Kosinus geht in vier Stellen auf (−48/60 = −0,8) – dann
      // steht „=“ statt „≈“, wie die Seite „8 : 9 ≈ 0,8889“ nur bei Rest rundet.
      const gleich = Math.abs(anzeige - cos) < 1e-12;
      return { sk, q, grad, kos: fmt(anzeige), gleich, winkelGleich: winkelExakt(gleich, anzeige, grad) };
    }

    /**
     * Der Bruch für cos φ so, wie ihn die Erklärseite schreibt: Der Nenner
     * bleibt das Produkt der beiden Beträge („8 : (3 · 3) = 8 : 9 ≈ 0,8889“).
     * Vorher wurden beide Wurzeln stillschweigend zu einer zusammengezogen –
     * aus |a| = √42 und |b| = √17 wurde √714, aus 6 und √26 wurde √936. Die
     * Regel √x · √y = √(xy) kommt auf der Seite nicht vor, und wer √42 · √17 in
     * den Taschenrechner tippt, findet √714 nirgends wieder. Gehen beide Beträge
     * auf, folgt wie auf der Seite das ausgerechnete Produkt.
     * `zaehler` ist der Zähler als Text (beim Schnittwinkel mit
     * Betragsstrichen), `wert` die Zahl, die danach im Zähler steht.
     */
    function kosBruch(zaehler, wert, a, b, d) {
      const qa = quadrat(a), qb = quadrat(b);
      const ganz = Number.isInteger(Math.sqrt(qa)) && Number.isInteger(Math.sqrt(qb));
      const nenner = `${wurzel(qa)} · ${wurzel(qb)}`;
      const kette = [frac(zaehler, nenner)];
      if (ganz) kette.push(frac(fmt(wert), fmt(Math.sqrt(qa) * Math.sqrt(qb))));
      else if (zaehler !== fmt(wert)) kette.push(frac(fmt(wert), nenner));
      return `${kette.join(' = ')} ${d.gleich ? '=' : '≈'} ${d.kos}`;
    }

    /** Zieht so lange, bis winkelDaten zufrieden ist. */
    /* `mitBetrag` heißt: Der Zähler bekommt Betragsstriche, weil der Schnittwinkel
       zweier Geraden höchstens 90° groß ist. Damit dieser Schritt nicht ins Leere
       läuft, wird dann ein NEGATIVES Skalarprodukt erzwungen – sonst ändern die
       Striche nichts, und die Aufgabe ist rechnerisch dieselbe wie die
       Winkelaufgabe der Stufe 2. Gemessen war das in 48,3 % der Fälle so. */
    function zieheWinkel(bauen, mitBetrag) {
      for (let i = 0; i < 400; i++) {
        const paar = bauen();
        const sk = paar[0][0] * paar[1][0] + paar[0][1] * paar[1][1] + paar[0][2] * paar[1][2];
        if (mitBetrag && sk >= 0) continue;
        const d = winkelDaten(paar[0], paar[1], mitBetrag);
        if (d) return { a: paar[0], b: paar[1], d };
      }
      // Rückfall: cos φ = ±8/9, φ ≈ 27,27° bzw. 152,73° – weit weg von jeder
      // Rundungsgrenze. Mit Betrag wird b gespiegelt, damit auch hier das
      // Skalarprodukt negativ ist.
      const a = [2, 1, 2], b = mitBetrag ? [-1, -2, -2] : [1, 2, 2];
      return { a, b, d: winkelDaten(a, b, mitBetrag) };
    }

    /** Zwei Vektoren mit lauter Komponenten ≠ 0 und Skalarprodukt 0. */
    function senkrechtPaar() {
      for (let i = 0; i < 400; i++) {
        const a = zufallsVektor(3, 4);
        const b1 = nz(4), b2 = nz(4);
        const rest = -(a[0] * b1 + a[1] * b2);
        if (rest % a[2] !== 0) continue;
        const b3 = rest / a[2];
        if (b3 === 0 || Math.abs(b3) > 6) continue;
        return [a, [b1, b2, b3]];
      }
      return [[2, 1, 2], [1, 2, -2]];   // 2 + 2 − 4 = 0
    }

    /** Zwei Vektoren mit lauter Komponenten ≠ 0 und Skalarprodukt ≠ 0. */
    function schiefesPaar(n, max) {
      for (let i = 0; i < 200; i++) {
        const a = zufallsVektor(n, max), b = zufallsVektor(n, max);
        if (skalar(a, b) !== 0) return [a, b];
      }
      return [[2, 1, 2], [1, 2, 2]];
    }

    /**
     * Aufgabe „fehlende Komponente“: Ein Platz von a bleibt frei, und x muss so
     * gewählt werden, dass a senkrecht auf b steht. Damit x ganzzahlig wird, muss
     * der Partner b[pos] die Summe der übrigen Produkte teilen; |b[pos]| ≥ 2
     * sorgt dafür, dass im Lösungsweg wirklich eine Division steht.
     */
    function komponenteAufgabe(n) {
      for (let i = 0; i < 400; i++) {
        const b = zufallsVektor(n, 5);
        const pos = rnd(0, n - 1);
        if (Math.abs(b[pos]) < 2) continue;
        const a = zufallsVektor(n, 5);
        const s = a.reduce((sum, x, k) => k === pos ? sum : sum + x * b[k], 0);
        if (s === 0 || s % b[pos] !== 0) continue;
        const x = -s / b[pos];
        if (x === 0 || Math.abs(x) > 12) continue;
        a[pos] = x;
        return { a, b, pos, s, x };
      }
      return { a: [2, -3, -1], b: [4, 2, 2], pos: 2, s: 2, x: -1 };   // 8 − 6 − 2 = 0
    }

    /** Lösungsweg der Komponentenaufgabe. */
    function komponenteWeg({ a, b, pos, s, x }) {
      const bp = b[pos];
      const produkte = a.map((v, k) => k === pos
        ? `x · ${par(b[k])}`
        : `${par(v)} · ${par(b[k])}`).join(' + ');
      const term = `${koef(bp, 'x')} ${s > 0 ? '+' : '−'} ${fmt(Math.abs(s))}`;
      return `${vname('a')} · ${vname('b')} = ${produkte} = ${term}`
        + `<br>Senkrecht heißt: das Skalarprodukt ist null.`
        + `<br>${term} = 0&nbsp;| ${s > 0 ? '−' : '+'} ${fmt(Math.abs(s))}`
        + `<br>${koef(bp, 'x')} = ${fmt(-s)}&nbsp;| : ${par(bp)}`
        + `<br>x = <strong>${fmt(x)}</strong>`;
    }

    /** Drei Ecken, deren sämtliche Verbindungsvektoren keine Nullkomponente haben. */
    function dreieck() {
      for (let i = 0; i < 400; i++) {
        const A = [rnd(-4, 6), rnd(-4, 6), rnd(-4, 6)];
        const B = A.map(c => c + nz(4)), C = A.map(c => c + nz(4));
        const sauber = [[A, B], [A, C], [B, C]].every(([P, Q]) => Q.every((c, k) => c - P[k] !== 0));
        if (sauber) return [A, B, C];
      }
      return [[1, 2, 1], [4, 3, 3], [2, 5, 2]];
    }

    const diff3 = (P, Q) => Q.map((c, k) => c - P[k]);

    /** Kreuzprodukt – nur zum Bauen der Aufgabe, es kommt im Text nicht vor. */
    const kreuz = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];

    const ECKEN = ['A', 'B', 'C'];
    const WINKELNAMEN = ['α', 'β', 'γ'];

    return {
      id: 'skalarprodukt',
      icon: 'a⊥b',
      title: 'Skalarprodukt & Winkel',
      tagline: 'Senkrecht prüfen und Winkel berechnen',

      learn: `
        <h2>Das Skalarprodukt – zwei Vektoren, eine Zahl</h2>
        <p>Vektoren kann man addieren und mit Zahlen strecken; dabei kommt immer wieder ein
        Vektor heraus. Das Skalarprodukt fällt aus der Reihe: Es nimmt zwei Vektoren und liefert
        eine <strong>Zahl</strong>. Genau darin liegt sein Nutzen – diese Zahl misst, wie stark
        zwei Richtungen zusammenpassen. Ist sie null, stehen die beiden Vektoren senkrecht
        aufeinander. Damit lässt sich ein rechter Winkel nachrechnen, statt ihn zu schätzen, und
        jeder beliebige Winkel gleich mit. Im Fließtext steht ein Vektor hier platzsparend als Zeile –
        a = (2 | −1 | 3) –, in den Aufgaben als Spalte ${vek([2, -1, 3])}.
        Gemeint ist beides Mal dasselbe.</p>

        <div class="einstieg-box">
          <p class="box-title">Der Bauplan</p>
          <p>Auf einem Plan sind drei Ecken eines Raums eingetragen: A(2 | 1 | 3), B(5 | 3 | 4)
          und C(6 | 1 | 5). Der Architekt behauptet, die Wand von B nach A und die Wand von B
          nach C treffen sich bei B im rechten Winkel. Auf dem Ausdruck sieht es fast so aus –
          aber „fast“ reicht auf einer Baustelle nicht.</p>
          <p class="frage">Wie prüfst du allein aus den Koordinaten, ob der Winkel bei B wirklich
          90° beträgt?</p>
        </div>

        <div class="herleitung-box">
          <p class="box-title">Warum null gerade senkrecht bedeutet</p>
          <p>Rechne das Skalarprodukt zuerst rein rechnerisch aus: Man multipliziert die
          Komponenten paarweise und addiert alles. Für a = (a₁ | a₂ | a₃) und b = (b₁ | b₂ | b₃)
          ist also a · b = a₁b₁ + a₂b₂ + a₃b₃.</p>
          <p>Was das mit Winkeln zu tun hat, zeigt ein Dreieck. Trägt man a und b vom selben Punkt
          aus ab, so ist die Verbindung der beiden Spitzen der Vektor a − b. Seine Länge lässt
          sich auf zwei Wegen bestimmen.</p>
          <p><strong>Weg 1 – ausmultiplizieren.</strong> Das Skalarprodukt gehorcht denselben
          Klammerregeln wie das Rechnen mit Zahlen, und a · a ist gerade |a|²:</p>
          <p>|a − b|² = (a − b) · (a − b) = |a|² − 2 · (a · b) + |b|²</p>
          <p><strong>Weg 2 – Kosinussatz.</strong> Im Dreieck aus a, b und a − b liegt der
          Winkel φ zwischen a und b der Seite a − b gegenüber:</p>
          <p>|a − b|² = |a|² + |b|² − 2 · |a| · |b| · cos φ</p>
          <p>Beide Zeilen beschreiben dieselbe Länge. |a|² und |b|² stehen in beiden, sie fallen
          weg. Übrig bleibt −2 · (a · b) = −2 · |a| · |b| · cos φ, also nach Kürzen durch −2:</p>
          <p><strong>a · b = |a| · |b| · cos φ</strong></p>
          <p>Damit ist alles gesagt. Sind a und b keine Nullvektoren, so sind |a| und |b| größer
          als null – das Produkt kann also nur dann null werden, wenn cos φ = 0 ist. Und im
          Bereich von 0° bis 180° ist der Kosinus genau bei 90° null.</p>
        </div>

        <div class="merkkasten">
          <p class="box-title">Die Formeln</p>
          <p><strong>Berechnung:</strong>&nbsp;a · b = a₁b₁ + a₂b₂ + a₃b₃&nbsp;(eine Zahl,
          kein Vektor)</p>
          <p>Zeilenweise multiplizieren, dann alles addieren:&nbsp;${vek([2, -1, 3])} · ${vek([4, 5, 1])} = 2 · 4 + (−1) · 5 + 3 · 1 = 6</p>
          <p><strong>Bedeutung:</strong>&nbsp;a · b = |a| · |b| · cos φ</p>
          <p><strong>Senkrecht:</strong>&nbsp;a ⊥ b&nbsp;⇔&nbsp;a · b = 0&nbsp;(für
          a ≠ 0 und b ≠ 0)</p>
          <p><strong>Senkrecht in der Ebene:</strong>&nbsp;zu a = (a₁ | a₂) steht n = (a₂ | −a₁)
          senkrecht – Komponenten vertauschen, bei einer das Vorzeichen umdrehen. Jedes von null
          verschiedene Vielfache von n steht ebenso senkrecht; der Nullvektor zählt nicht, denn er
          steht auf allem senkrecht.</p>
          <p><strong>Winkel zwischen zwei Vektoren:</strong>&nbsp;cos φ = (a · b) : (|a| · |b|)</p>
          <p><strong>Schnittwinkel zweier Geraden</strong> mit den Richtungsvektoren u und v:&nbsp;cos φ = |u · v| : (|u| · |v|),&nbsp;also 0° ≤ φ ≤ 90°</p>
          <p><strong>Quadrat:</strong>&nbsp;a · a = |a|², also |a| = √(a · a)</p>
          <p><strong>Senkrecht im Raum auf zwei Vektoren:</strong>&nbsp;n · a = 0 und n · b = 0 – zwei
          Gleichungen, drei Unbekannte (a und b nicht parallel), eine Komponente darf man frei wählen.</p>
          <p><strong>Arbeit in der Physik:</strong>&nbsp;W = F · s = |F| · |s| · cos φ&nbsp;(Newton mal
          Meter ergibt Joule)</p>
        </div>

        <h3>So rechnest du</h3>
        <ol class="schritte">
          <li>Skalarprodukt bilden: Komponente mal Komponente, dann alles addieren. Das Ergebnis
          ist eine Zahl.</li>
          <li>Ist nur nach „senkrecht?“ gefragt, bist du hier schon fertig: 0 heißt ja, alles
          andere heißt nein.</li>
          <li>Für einen Winkel zusätzlich beide Beträge bestimmen: |a| = √(a₁² + a₂² + a₃²).</li>
          <li>Einsetzen: cos φ = (a · b) : (|a| · |b|). Geht es um zwei <em>Geraden</em>, dann mit
          Betragsstrichen um den Zähler.</li>
          <li>Mit cos⁻¹ (auch acos oder arccos) den Winkel bestimmen und auf ganze Grad runden.
          Der Taschenrechner muss dabei auf DEG stehen.</li>
          <li>Ergebnis prüfen: Ein negatives Skalarprodukt gehört zu einem Winkel über 90°, ein
          positives zu einem unter 90°.</li>
          <li>Ist umgekehrt ein Vektor <em>gesucht</em>, der auf a = (a₁ | a₂) senkrecht steht:
          Komponenten vertauschen und bei einer von beiden das Vorzeichen umdrehen, also
          n = (a₂ | −a₁). Die Probe geht immer auf, denn a · n = a₁a₂ − a₂a₁ = 0.</li>
          <li>Soll n im Raum auf <em>zwei</em> Vektoren senkrecht stehen, setze beide
          Skalarprodukte null: zwei Gleichungen, drei Unbekannte. Wähle eine Komponente frei
          (etwa n₃ = 1) und rechne die anderen beiden aus.</li>
        </ol>

        <h3>Beispiele</h3>

        <div class="example-box">
          <p class="ex-title">Senkrecht oder nicht?</p>
          <p>a = (3 | −2 | 1), b = (2 | 4 | 2)</p>
          <p>a · b = 3 · 2 + (−2) · 4 + 1 · 2 = 6 − 8 + 2 = 0</p>
          <p>Das Skalarprodukt ist null, also stehen die beiden <strong>senkrecht</strong>
          aufeinander. Die Beträge braucht man dafür gar nicht.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Winkel zwischen zwei Vektoren</p>
          <p>a = (2 | 1 | 2), b = (1 | 2 | 2)</p>
          <p>a · b = 2 · 1 + 1 · 2 + 2 · 2 = 2 + 2 + 4 = 8</p>
          <p>|a| = √(4 + 1 + 4) = √9 = 3&nbsp;und&nbsp;|b| = √(1 + 4 + 4) = √9 = 3</p>
          <p>cos φ = 8 : (3 · 3) = 8 : 9 ≈ 0,8889</p>
          <p>φ = cos⁻¹(0,8889) ≈ 27,3°, gerundet <strong>27°</strong></p>
        </div>

        <div class="example-box">
          <p class="ex-title">Fehlende Komponente bestimmen</p>
          <p>Für welches x stehen a = (4 | −1 | x) und b = (2 | 3 | 5) senkrecht aufeinander?</p>
          <p>a · b = 4 · 2 + (−1) · 3 + x · 5 = 5x + 5</p>
          <p>5x + 5 = 0&nbsp;| − 5&nbsp;⇒&nbsp;5x = −5&nbsp;| : 5&nbsp;⇒&nbsp;<strong>x = −1</strong></p>
          <p>Probe: 8 − 3 + (−1) · 5 = 8 − 3 − 5 = 0 ✓</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Einen senkrechten Vektor finden</p>
          <p>Gesucht ist ein Vektor, der in der Ebene senkrecht auf a = (6 | 3) steht.</p>
          <p>Vertausche die beiden Komponenten und drehe bei <em>einer</em> von beiden das
          Vorzeichen um:&nbsp;n = (3 | −6)</p>
          <p>Probe: a · n = 6 · 3 + 3 · (−6) = 18 − 18 = 0 ✓</p>
          <p>Nur vertauschen genügt nicht: Für (3 | 6) käme 6 · 3 + 3 · 6 = 36 heraus.</p>
          <p>Welche der beiden Komponenten das Vorzeichen wechselt, ist egal – (−3 | 6) steht
          genauso senkrecht. Und weil sich beim Strecken jeder Summand mit demselben Faktor
          multipliziert, bleibt die Null erhalten: Auch (6 | −12) ist eine Lösung. Nur der
          Nullvektor zählt nicht, denn der steht auf allem senkrecht.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Senkrecht auf zwei Vektoren im Raum</p>
          <p>Gesucht ist ein Vektor n, der auf a = (1 | 2 | −1) <em>und</em> auf b = (1 | 1 | −2)
          senkrecht steht.</p>
          <p>Der Trick aus der Ebene hilft hier nicht: Im Raum steht auf einem einzelnen Vektor eine
          ganze Ebene voller Richtungen senkrecht. Erst die zweite Bedingung legt die Richtung fest.
          Schreibe deshalb beide Bedingungen als Gleichungen auf:</p>
          <p>n · a = 0:&nbsp;n₁ + 2n₂ − n₃ = 0</p>
          <p>n · b = 0:&nbsp;n₁ + n₂ − 2n₃ = 0</p>
          <p>Zwei Gleichungen, drei Unbekannte – eine Komponente darfst du frei wählen. Ziehst du
          die zweite Gleichung von der ersten ab, fällt n₁ weg: n₂ + n₃ = 0, also n₂ = −n₃.</p>
          <p>Mit n₃ = 1 folgt n₂ = −1, und aus der ersten Gleichung n₁ − 2 − 1 = 0, also n₁ = 3.</p>
          <p>n = (3 | −1 | 1).&nbsp;Probe: n · a = 3 · 1 + (−1) · 2 + 1 · (−1) = 3 − 2 − 1 = 0 ✓&nbsp;und&nbsp;n · b = 3 · 1 + (−1) · 1 + 1 · (−2) = 3 − 1 − 2 = 0 ✓</p>
          <p>Jedes von null verschiedene Vielfache tut es ebenso, etwa (−3 | 1 | −1) mit n₃ = −1.
          Genau so entsteht später der Normalenvektor einer Ebene.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Der Bauplan aus dem Einstieg</p>
          <p>Der Winkel sitzt bei B, also gehen beide Vektoren <em>von B aus</em> los:</p>
          <p>BA = A − B = (2 − 5 | 1 − 3 | 3 − 4) = (−3 | −2 | −1)</p>
          <p>BC = C − B = (6 − 5 | 1 − 3 | 5 − 4) = (1 | −2 | 1)</p>
          <p>BA · BC = (−3) · 1 + (−2) · (−2) + (−1) · 1 = −3 + 4 − 1 = 0</p>
          <p><strong>Der Architekt hat recht:</strong> Der Winkel bei B ist exakt 90°. Nachgerechnet
          in vier Zeilen, ohne Winkelmesser und ohne Zeichnung.</p>
          <p>Wichtig ist die Richtung: Beide Vektoren müssen von der Ecke wegzeigen, um die es
          geht. Mit AB statt BA käme der Nebenwinkel heraus.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Schnittwinkel zweier Geraden</p>
          <p>g hat den Richtungsvektor u = (2 | 1 | 2), h hat v = (−1 | 2 | −2).</p>
          <p>u · v = 2 · (−1) + 1 · 2 + 2 · (−2) = −2 + 2 − 4 = −4</p>
          <p>|u| = √(4 + 1 + 4) = 3&nbsp;und&nbsp;|v| = √(1 + 4 + 4) = 3</p>
          <p>cos φ = |−4| : (3 · 3) = 4 : 9 ≈ 0,4444</p>
          <p>φ = cos⁻¹(0,4444) ≈ 63,6°, gerundet <strong>64°</strong></p>
          <p>Die Aufpunkte der beiden Geraden kommen in der Rechnung nicht vor: Für den Winkel
          zählt allein die Richtung.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Das Skalarprodukt in der Physik: Arbeit</p>
          <p>Ein Schlitten wird an einem Seil gezogen. Das Seil ist um 60° gegen den Weg geneigt,
          die Zugkraft beträgt |F| = 50 N, der Schlitten fährt 10 m weit. Die verrichtete Arbeit
          ist das Skalarprodukt aus Kraft und Weg: W = F · s.</p>
          <p>W = |F| · |s| · cos φ = 50 · 10 · cos 60° = 50 · 10 · 0,5 = <strong>250 J</strong></p>
          <p>Newton mal Meter ergibt Joule. Arbeit verrichtet nur der Anteil der Kraft, der in
          Wegrichtung zeigt – das sind |F| · cos φ = 25 N. Der Anteil quer zum Weg zieht den
          Schlitten nach oben, nicht nach vorn – er verrichtet keine Arbeit.</p>
          <p>Zwei Sonderfälle: Steht die Kraft senkrecht zum Weg, ist cos 90° = 0 – sie verrichtet
          keine Arbeit. Schließt sie mit dem Weg einen Winkel über 90° ein, zeigt sie also eher
          gegen die Bewegung, dann ist der Kosinus negativ und W negativ: Die Kraft bremst.</p>
        </div>

        <div class="achtung-box">
          <p class="achtung-title">Bei zwei Geraden fehlen gern die Betragsstriche</p>
          <p>Zwei sich schneidende Geraden bilden vier Winkel, paarweise gleich groß und zusammen
          immer 180°. Als Schnittwinkel gilt der <strong>kleinere</strong> von beiden, er ist also
          höchstens 90°. Der Richtungsvektor einer Geraden darf aber auch andersherum zeigen –
          dann kippt das Vorzeichen des Skalarprodukts, und cos⁻¹ liefert prompt den
          Nebenwinkel.</p>
          <p><strong>Gegenbeispiel:</strong> u = (2 | 3 | 6), v = (−1 | 2 | −2).</p>
          <p>u · v = 2 · (−1) + 3 · 2 + 6 · (−2) = −2 + 6 − 12 = −8,&nbsp;|u| = √49 = 7,&nbsp;|v| = √9 = 3</p>
          <p>Ohne Betrag: cos φ = −8 : 21 ≈ −0,3810&nbsp;⇒&nbsp;φ ≈ 112,4°, gerundet 112°</p>
          <p>Mit Betrag: cos φ = 8 : 21 ≈ 0,3810&nbsp;⇒&nbsp;φ ≈ 67,6°, gerundet 68°</p>
          <p>112° + 68° = 180° – die beiden Ergebnisse sind Nebenwinkel. Als Schnittwinkel zählt
          68°. Zwischen zwei <em>Vektoren</em> ist dagegen alles bis 180° erlaubt; dort wäre der
          Betrag falsch, denn ein stumpfer Winkel ist dann eine echte Information.</p>
        </div>

        <div class="selbstcheck">
          <p class="box-title">Selbstcheck</p>
          <details><summary>Ist a · b eine Zahl oder ein Vektor?</summary>
          <p>Eine Zahl. Deshalb heißt es Skalarprodukt – „Skalar“ ist das Wort für eine Zahl, die
          keine Richtung hat. Ein Ergebnis wie (6 | −8 | 2) wäre die komponentenweise
          Multiplikation, und die hat mit Winkeln nichts zu tun.</p></details>
          <details><summary>Stehen a = (3 | −2 | 1) und b = (1 | 2 | 1) senkrecht aufeinander?</summary>
          <p>a · b = 3 · 1 + (−2) · 2 + 1 · 1 = 3 − 4 + 1 = 0 – ja, sie stehen senkrecht.</p></details>
          <details><summary>Was bedeutet a · b &lt; 0?</summary>
          <p>Dass der Winkel zwischen den beiden größer als 90° ist. In a · b = |a| · |b| · cos φ
          sind die Beträge nie negativ, das Vorzeichen kommt also allein vom Kosinus – und der ist
          zwischen 90° und 180° negativ.</p></details>
          <details><summary>Warum steht beim Schnittwinkel zweier Geraden ein Betrag im Zähler?</summary>
          <p>Weil eine Gerade keine Vorzugsrichtung hat: u und −u beschreiben dieselbe Gerade.
          Ohne Betrag hinge das Ergebnis davon ab, wie man den Richtungsvektor zufällig
          aufgeschrieben hat, und man bekäme mal den Winkel, mal seinen Nebenwinkel.</p></details>
          <details><summary>Was ergibt a · a?</summary>
          <p>|a|², also das Quadrat der Länge. Für a = (2 | 3 | 6) ist a · a = 4 + 9 + 36 = 49,
          und tatsächlich ist |a| = √49 = 7. Das ist der Satz des Pythagoras im Raum.</p></details>
          <details><summary>Aus a · b = a · c folgt b = c – stimmt das?</summary>
          <p>Nein, kürzen ist verboten. Für a = (1 | 2 | 2), b = (3 | 1 | 1) und c = (5 | −1 | 2)
          gilt a · b = 3 + 2 + 2 = 7 und a · c = 5 − 2 + 4 = 7, obwohl b und c verschieden sind.
          Der Unterschied b − c = (−2 | 2 | −1) steht nämlich senkrecht auf a.</p></details>
          <details><summary>Im Raum ist ein Vektor n gesucht, der auf a senkrecht steht. Warum reicht diese eine Bedingung nicht?</summary>
          <p>Weil n · a = 0 nur eine Gleichung für drei Komponenten ist. Alle Vektoren, die sie
          erfüllen, bilden eine ganze Ebene. Erst ein zweiter Vektor b, der nicht parallel zu a ist,
          legt mit n · b = 0 die Richtung von n fest – bis auf Vielfache.</p></details>
          <details><summary>Warum verrichtet eine Kraft senkrecht zum Weg keine Arbeit?</summary>
          <p>Weil W = |F| · |s| · cos φ ist und cos 90° = 0. Nur der Anteil der Kraft in
          Wegrichtung zählt – und der ist bei 90° null. Wer eine Tasche auf ebener Strecke
          trägt, hält sie nur hoch; im physikalischen Sinn verrichtet er dabei keine Arbeit.</p></details>
        </div>
      `,

      gen(diff) {

        /* ============================================================
           Stufe 1 – Skalarprodukt berechnen, Senkrechtprüfung, a · a
           ============================================================ */
        if (diff === 1) {
          const art = rnd(1, 6);

          if (art === 1) {
            const [a, b] = [zufallsVektor(3, 5), zufallsVektor(3, 5)];
            const s = skalar(a, b);
            return {
              q: `Berechne das Skalarprodukt ${vname('a')} · ${vname('b')} im Raum.<br>${vname('a')} = ${vek(a)}&nbsp;und&nbsp;${vname('b')} = ${vek(b)}`,
              type: 'input', placeholder: 'Skalarprodukt',
              check: numCheck(s), testAnswer: String(s), answerText: fmt(s),
              solution: `Komponente mal Komponente, dann alles addieren:<br>${vname('a')} · ${vname('b')} = ${rechenweg(a, b)}<br>Heraus kommt eine <strong>Zahl</strong>, kein Vektor.`
            };
          }

          if (art === 2) {
            const [a, b] = [zufallsVektor(2, 6), zufallsVektor(2, 6)];
            const s = skalar(a, b);
            return {
              q: `Zwei Vektoren der Ebene: ${vname('a')} = ${vek(a)}&nbsp;und&nbsp;${vname('b')} = ${vek(b)}. Wie groß ist ihr Skalarprodukt?`,
              type: 'input', placeholder: 'Skalarprodukt',
              check: numCheck(s), testAnswer: String(s), answerText: fmt(s),
              solution: `In der Ebene sind es zwei Produkte statt drei – sonst ändert sich nichts:<br>${vname('a')} · ${vname('b')} = ${rechenweg(a, b)}`
            };
          }

          if (art === 3) {
            const senkrecht = rnd(0, 1) === 1;
            const [a, b] = senkrecht ? senkrechtPaar() : schiefesPaar(3, 5);
            const s = skalar(a, b);
            const ja = 'Ja, sie stehen senkrecht aufeinander.';
            const nein = 'Nein, sie stehen nicht senkrecht aufeinander.';
            const richtig = senkrecht ? ja : nein;
            const opts = shuffle([ja, nein]);
            return {
              q: `Stehen ${vname('a')} = ${vek(a)} und ${vname('b')} = ${vek(b)} senkrecht aufeinander?`,
              type: 'choice', options: opts, correct: opts.indexOf(richtig),
              answerText: richtig,
              solution: `${vname('a')} · ${vname('b')} = ${rechenweg(a, b)}<br>`
                + (senkrecht
                  ? `Das Skalarprodukt ist null – und genau dann stehen zwei Vektoren senkrecht aufeinander.`
                  : `Das Skalarprodukt ist ${fmt(s)}. Senkrecht wären die beiden nur, wenn hier null stünde.`)
            };
          }

          if (art === 4) {
            const a = zufallsVektor(3, 6);
            const s = quadrat(a);
            return {
              q: `Berechne ${vname('a')} · ${vname('a')} für ${vname('a')} = ${vek(a)}.`,
              type: 'input', placeholder: 'Skalarprodukt',
              check: numCheck(s), testAnswer: String(s), answerText: fmt(s),
              solution: `${vname('a')} · ${vname('a')} = ${a.map(x => `${par(x)}²`).join(' + ')} = ${a.map(x => fmt(x * x)).join(' + ')} = <strong>${fmt(s)}</strong><br>Ein Vektor mal sich selbst ergibt immer das Quadrat seiner Länge: |${vname('a')}|² = ${fmt(s)}, also |${vname('a')}| = ${wurzel(s)}.`
            };
          }

          if (art === 5) {
            /* Zwei Begriffsaufgaben – und beide sind so gebaut, dass die richtige
               Antwort von Ziehung zu Ziehung WECHSELT. Das ist hier keine
               Feinheit, sondern die ganze Reparatur: Eine Auswahl aus vier festen
               Sätzen mit einer festen Lösung ist blind lösbar. Stehen die
               Zeichenketten fest, so steht auch fest, an welcher Stelle die Lösung
               in jeder denkbaren Rangfolge liegt – nach Länge, nach dem letzten
               Wort, nach Alphabet. Gemessen wurde erst „längste Option“ 100 %,
               nach dem bloßen Umformulieren „zweitlängste Option“ 100 %: Ein
               anderer Rang ist wieder ein fester Rang, und wer ihn kennt, muss die
               Frage nie lesen. Erst eine Lösung, die wechselt, nimmt jeder solchen
               Faustregel die Grundlage. */
            if (rnd(1, 2) === 1) {
              /* Vom Vorzeichen auf den Winkel schließen. Welche der drei Aussagen
                 stimmt, entscheidet allein die Zahl in der Frage, und alle drei
                 kommen gleich oft vor. Ihr Betrag ist bewusst belanglos: Gefragt
                 ist das Vorzeichen, nicht eine Rechnung. */
              const fall = rnd(1, 3);
              const s = fall === 1 ? rnd(1, 40) : fall === 3 ? -rnd(1, 40) : 0;
              const spitz = 'Er ist kleiner als 90°.';
              const recht = 'Er ist genau 90°.';
              const stumpf = 'Er ist größer als 90°.';
              const richtig = fall === 1 ? spitz : fall === 3 ? stumpf : recht;
              const opts = shuffle([spitz, recht, stumpf]);
              // Jede Aussage gehört zu genau einem Vorzeichen – der Grund nennt es
              // und stellt die Zahl aus der Frage daneben.
              const bedingung = {
                [spitz]: `Kleiner als 90° ist der Winkel nur bei positivem Skalarprodukt – hier ist es ${fmt(s)}.`,
                [recht]: `Genau 90° sind es nur, wenn das Skalarprodukt null ist – hier ist es ${fmt(s)}.`,
                [stumpf]: `Größer als 90° ist der Winkel nur bei negativem Skalarprodukt – hier ist es ${fmt(s)}.`
              };
              const folgerung = fall === 1
                ? `Hier ist das Skalarprodukt positiv, also ist auch cos φ positiv – und positiv ist der Kosinus von 0° bis unter 90°. Der Winkel ist <strong>kleiner als 90°</strong>.`
                : fall === 3
                  ? `Hier ist das Skalarprodukt negativ, also ist auch cos φ negativ – und negativ ist der Kosinus von über 90° bis 180°. Der Winkel ist <strong>größer als 90°</strong>.`
                  : `Hier ist das Skalarprodukt null. Die beiden Beträge sind es nicht, also muss cos φ null sein – und das trifft zwischen 0° und 180° nur auf <strong>90°</strong> zu.`;
              return {
                q: `Für zwei Vektoren ${vname('a')} und ${vname('b')} (beide nicht der Nullvektor) gilt ${vname('a')} · ${vname('b')} = ${fmt(s)}. Was folgt für den Winkel φ zwischen ihnen?`,
                type: 'choice', options: opts, correct: opts.indexOf(richtig), answerText: richtig,
                gruende: opts.map(o => (o === richtig ? null : bedingung[o])),
                solution: `In ${vname('a')} · ${vname('b')} = |${vname('a')}| · |${vname('b')}| · cos φ sind beide Beträge größer als null. Das Vorzeichen kommt also allein vom Kosinus.<br>${folgerung}`
                  + (fall === 2 ? '' : `<br>Wie groß die Zahl ist, spielt dabei keine Rolle: Für den Winkel selbst bräuchte man zusätzlich |${vname('a')}| und |${vname('b')}|, für „kleiner oder größer als 90°“ genügt das Vorzeichen.`)
              };
            }

            /* Aussagen-Pool. Zu jedem der fünf Gesichtspunkte gehören ein wahrer
               Satz und drei falsche; gezogen wird ein Gesichtspunkt für die Lösung
               und drei weitere für die Ablenker. Drei Eigenschaften dieser Bauart
               sind Absicht und ohne sie fiele die Aufgabe zurück ins Ratbare:
                 · Die vier Optionen kommen aus vier VERSCHIEDENEN Gesichtspunkten,
                   und welcher davon den wahren Satz stellt, ist gleichverteilt.
                   Jede Regel, die nur die Form der vier Sätze vergleicht (Länge,
                   Wortzahl, letztes Wort, Alphabet), trifft damit ein Viertel –
                   genau so viel wie Raten.
                 · Innerhalb eines Gesichtspunkts sind alle vier Sätze gleich
                   gebaut: dieselbe Wortzahl, dieselbe Länge auf ein, zwei Zeichen
                   genau, dasselbe Schlusswort. Sonst verriete sich der wahre Satz
                   an seiner Form, sobald sein Gesichtspunkt dabei ist.
                 · Drei falsche Sätze je Gesichtspunkt sind kein Zierrat, sondern
                   sorgen für gleiche Häufigkeiten: Ein wahrer Satz erscheint mit
                   Wahrscheinlichkeit ⅕ (nämlich als Lösung), ein bestimmter
                   falscher mit ⅘ · ¾ · ⅓ = ⅕ ebenso. Bei nur einem falschen Satz
                   je Gesichtspunkt wären die falschen dreimal so häufig, und „nimm
                   den Satz, den du am seltensten siehst" wäre eine sichere Wette,
                   ohne ein Wort zu lesen. */
            const A = vname('a'), B = vname('b');
            const BSP = `${A} = (2 | 3 | 6)`;
            const AUSSAGEN = [
              {
                wahr: `Das Ergebnis von ${A} · ${B} ist eine Zahl ohne Richtung.`,
                grund: `Man multipliziert die Komponenten paarweise und addiert alles – am Ende steht eine einzige Zahl. „Skalar“ ist genau das Wort für eine Zahl ohne Richtung.`,
                falsch: [
                  [`Das Ergebnis von ${A} · ${B} ist ein Vektor mit Richtung.`, `Wer die Komponenten einzeln multipliziert und stehen lässt, erhält zwar einen Vektor – aber nicht das Skalarprodukt.`],
                  [`Das Ergebnis von ${A} · ${B} ist ein Punkt ohne Richtung.`, `Ein Punkt bräuchte wieder drei Koordinaten; heraus kommt aber eine einzige Zahl.`],
                  [`Das Ergebnis von ${A} · ${B} ist eine Länge mit Richtung.`, `Eine Länge ist nie negativ, ein Skalarprodukt sehr wohl – und eine Richtung hat es schon gar nicht.`]
                ]
              },
              {
                wahr: `Ist ${A} · ${B} = 0, so stehen ${A} und ${B} senkrecht zueinander.`,
                grund: `In ${A} · ${B} = |${A}| · |${B}| · cos φ sind beide Beträge größer als null. Null wird das Produkt also nur über cos φ = 0, und das heißt φ = 90°.`,
                falsch: [
                  [`Ist ${A} · ${B} = 0, so stehen ${A} und ${B} parallel zueinander.`, `Bei gleichgerichteten Vektoren ist cos φ = 1, das Skalarprodukt also |${A}| · |${B}| und gerade nicht null.`],
                  [`Ist ${A} · ${B} = 0, so stehen ${A} und ${B} gegenläufig zueinander.`, `Zeigen sie genau entgegen, ist cos φ = −1 und das Skalarprodukt −|${A}| · |${B}|, also ebenfalls nicht null.`],
                  [`Ist ${A} · ${B} = 1, so stehen ${A} und ${B} senkrecht zueinander.`, `Nur die Null zwingt cos φ auf null. Bei ${A} · ${B} = 1 ist der Winkel kleiner als 90°, also sicher nicht 90°.`]
                ]
              },
              {
                wahr: `Ist ${A} · ${B} negativ, so ist der Winkel über 90° groß.`,
                grund: `Die beiden Beträge sind nie negativ, das Vorzeichen kommt also allein vom Kosinus – und der ist zwischen 90° und 180° negativ.`,
                falsch: [
                  [`Ist ${A} · ${B} negativ, so ist der Winkel unter 90° groß.`, `Genau andersherum: Unter 90° ist der Kosinus positiv und damit auch das Skalarprodukt.`],
                  [`Ist ${A} · ${B} negativ, so ist der Winkel genau 180° groß.`, `Die 180° sind nur ein Sonderfall; negativ wird das Skalarprodukt schon knapp über 90°.`],
                  [`Ist ${A} · ${B} positiv, so ist der Winkel über 90° groß.`, `Bei positivem Skalarprodukt ist auch der Kosinus positiv – der Winkel ist dann kleiner als 90°.`]
                ]
              },
              {
                wahr: `${A} · ${A} ist genau das Quadrat der Länge von ${A}.`,
                grund: `${A} · ${A} = a₁² + a₂² + a₃², und genau diese Summe steht bei |${A}| = √(a₁² + a₂² + a₃²) unter der Wurzel.`,
                falsch: [
                  [`${A} · ${A} ist genau das Doppelte der Länge von ${A}.`, `Für ${BSP} ist ${A} · ${A} = 49; das Doppelte der Länge wären 14.`],
                  [`${A} · ${A} ist genau die Hälfte der Länge von ${A}.`, `Für ${BSP} ist ${A} · ${A} = 49; die halbe Länge wäre 3,5.`],
                  [`${A} · ${A} ist genau das Quadrat der Länge von ${B}.`, `Mit ${B} hat ${A} · ${A} nichts zu tun – dort steht zweimal derselbe Vektor ${A}.`]
                ]
              },
              {
                wahr: `${A} · ${B} und ${B} · ${A} sind immer identisch.`,
                grund: `Summand für Summand steht dasselbe Produkt, nur andersherum aufgeschrieben: a₁b₁ ist dieselbe Zahl wie b₁a₁.`,
                falsch: [
                  [`${A} · ${B} und ${B} · ${A} sind stets ungleich.`, `Ungleich sind sie nie: In jedem Summanden stehen dieselben zwei Faktoren.`],
                  [`${A} · ${B} und ${B} · ${A} sind oft verschieden.`, `Verschieden sind sie nie – a₁b₁ ist dieselbe Zahl wie b₁a₁.`],
                  [`${A} · ${B} und ${B} · ${A} sind nie vergleichbar.`, `Sie sind nicht nur vergleichbar, sondern gleich: (1 | 2) · (5 | 3) und (5 | 3) · (1 | 2) ergeben beide 11.`]
                ]
              }
            ];
            const wahrNr = rnd(0, AUSSAGEN.length - 1);
            const ablenkerNr = shuffle(AUSSAGEN.map((_, k) => k).filter(k => k !== wahrNr)).slice(0, 3);
            const gewaehlt = ablenkerNr.map(k => choice(AUSSAGEN[k].falsch));
            const richtig = AUSSAGEN[wahrNr].wahr;
            const opts = shuffle([richtig, ...gewaehlt.map(f => f[0])]);
            return {
              q: `Welche Aussage über das Skalarprodukt ist richtig?`,
              type: 'choice', options: opts, correct: opts.indexOf(richtig), answerText: richtig,
              // Jeder falsche Satz trägt seine Widerlegung schon mit; sie betrifft nur
              // seinen eigenen Gesichtspunkt, die Lösung stammt aus einem anderen.
              gruende: opts.map(o => (o === richtig ? null : gewaehlt.find(f => f[0] === o)[1])),
              solution: `Richtig ist: <strong>${richtig}</strong><br>${AUSSAGEN[wahrNr].grund}`
                + gewaehlt.map(f => `<br>„${f[0]}“ – das stimmt nicht. ${f[1]}`).join('')
            };
          }

          /* Senkrechter Vektor in der Ebene – als EINGABE, nicht als Auswahl.
             Als Auswahl war diese Aufgabe nicht zu retten. Der Raum der zu a
             senkrechten Vektoren ist in der Ebene eindimensional, die Lösung trägt
             also zwangsläufig die beiden Beträge von a in vertauschter Reihenfolge.
             Daraus folgt für jede Zusammenstellung von vier Optionen:
               · Tragen alle vier dieselben Beträge wie a, so sind von den vier
                 Vorzeichenkombinationen mit vertauschten Beträgen immer ZWEI
                 senkrecht – vier solche Optionen hätten zwei richtige Antworten.
                 Bietet man nur zwei oder drei davon an, bleibt eine Gruppe von
                 genau zwei Optionen übrig („Beträge vertauscht“ bzw. „nicht das
                 Gegenvektor-Paar"): 50 % statt 25 %, ohne eine Multiplikation.
               · Tragen die Ablenker andere Beträge, ist die Lösung die einzige
                 Option, deren Zahlen wörtlich in der Frage stehen: 100 %.
             Beides ist gemessen worden – erst kürzeste Option 52 % und längste
             50 %, nach dem ersten Reparaturversuch Betragsreihenfolge 50 % und
             Fragezahl-Extreme 50 %. Eingetippt gibt es nichts zu raten, und das
             Rezept muss angewandt statt wiedererkannt werden. */
          let a;
          do { a = zufallsVektor(2, 6); } while (a[0] === a[1] || a[0] === -a[1]);
          // Beide Umdrehungen sind richtig; welche im Lösungsweg steht, ist Zufall.
          const n = choice([[a[1], -a[0]], [-a[1], a[0]]]);
          const gegen = n.map(k => -k);
          const nurGetauscht = [a[1], a[0]];   // a · (a₂ | a₁) = 2a₁a₂ ≠ 0
          return {
            /* Hier gilt JEDER senkrechte Vektor – „3; −1“ war bei a = (2 | 6) selbst
               eine Lösung (6,7 %). „1; 1“ steht nie senkrecht, weil a₁ = −a₂
               oben ausgeschlossen ist. */
            q: `Gib einen Vektor an, der in der Ebene senkrecht auf ${vname('a')} = ${vek(a)} steht. ${EBENE_HINWEIS.replace('3; −1', '1; 1')}`,
            type: 'input', placeholder: 'z. B. 1; 1',
            check: senkrechtCheck(a), testAnswer: `${n[0]}; ${n[1]}`,
            answerText: `${vek(n)} – ebenso jedes Vielfache davon außer dem Nullvektor`,
            solution: `Gesucht ist ein Vektor ${vname('n')} mit ${vname('a')} · ${vname('n')} = 0.<br>Das Rezept in der Ebene: Komponenten <strong>vertauschen</strong> und bei <strong>einer</strong> das Vorzeichen umdrehen. Aus ${vek(a)} wird so ${vek(n)}.<br>Probe: ${vname('a')} · ${vname('n')} = ${rechenweg(a, n)} ✓<br>Nur vertauschen reicht nicht: ${vek(nurGetauscht)} ergibt ${rechenweg(a, nurGetauscht)} ≠ 0.<br>Welche der beiden Komponenten du umdrehst, ist egal – die andere Wahl ergibt den Gegenvektor ${vek(gegen)}, und der steht genauso senkrecht. Auch jedes Vielfache tut es, etwa ${vek(n.map(k => 2 * k))} – nur der Nullvektor zählt nicht, denn der steht auf allem senkrecht.`
          };
        }

        /* ============================================================
           Stufe 2 – fehlende Komponente und Winkel zwischen Vektoren
           ============================================================ */
        if (diff === 2) {
          const art = rnd(1, 6);

          if (art === 1) {
            const auf = komponenteAufgabe(3);
            const gezeigt = auf.a.map((v, k) => k === auf.pos ? 'x' : v);
            return {
              q: `Für welchen Wert von x stehen ${vname('a')} = ${vek(gezeigt)} und ${vname('b')} = ${vek(auf.b)} senkrecht aufeinander?`,
              type: 'input', placeholder: 'x = ?',
              check: numCheck(auf.x), testAnswer: String(auf.x), answerText: `x = ${fmt(auf.x)}`,
              solution: komponenteWeg(auf)
            };
          }

          if (art === 2) {
            const auf = komponenteAufgabe(2);
            const gezeigt = auf.a.map((v, k) => k === auf.pos ? 'x' : v);
            return {
              q: `In der Ebene: Bestimme x so, dass ${vname('a')} = ${vek(gezeigt)} auf ${vname('b')} = ${vek(auf.b)} senkrecht steht.`,
              type: 'input', placeholder: 'x = ?',
              check: numCheck(auf.x), testAnswer: String(auf.x), answerText: `x = ${fmt(auf.x)}`,
              solution: komponenteWeg(auf)
            };
          }

          if (art === 3 || art === 4) {
            const dim = art === 3 ? 2 : 3;
            const { a, b, d } = zieheWinkel(() => schiefesPaar(dim, dim === 2 ? 7 : 5), false);
            const ort = dim === 2 ? 'in der Ebene' : 'im Raum';
            return {
              q: `Berechne den Winkel φ zwischen ${vname('a')} = ${vek(a)} und ${vname('b')} = ${vek(b)} ${ort} – auf ganze Grad genau.`,
              type: 'input', placeholder: 'φ in °',
              check: numCheck(d.grad, 0.6), testAnswer: String(d.grad), answerText: `${fmt(d.grad)}°`,
              solution: `${vname('a')} · ${vname('b')} = ${rechenweg(a, b)}<br>${betragWeg('a', a)}<br>${betragWeg('b', b)}<br>cos φ = ${frac(`${vname('a')} · ${vname('b')}`, `|${vname('a')}| · |${vname('b')}|`)} = ${kosBruch(fmt(d.sk), d.sk, a, b, d)}<br>φ = cos⁻¹(${d.kos}) ${winkelZeichen(d)} <strong>${fmt(d.grad)}°</strong>`
            };
          }

          if (art === 5) {
            // Beträge und Skalarprodukt frei setzen: So bleibt der Kosinus greifbar,
            // und die Aufgabe prüft die Formel statt der Komponentenrechnung.
            let la = 5, lb = 5, sk = 15, d = null;
            for (let i = 0; i < 400 && !d; i++) {
              la = rnd(2, 9); lb = rnd(2, 9);
              sk = rndNonZero(-(la * lb - 1), la * lb - 1);
              const cos = sk / (la * lb);
              if (Math.abs(cos) > 0.97) continue;
              const phi = Math.acos(cos) * 180 / Math.PI;
              const grad = Math.round(phi);
              if (Math.abs(phi - grad) > 0.45) continue;
              const anzeige = Number(cos.toFixed(4));
              if (Math.round(Math.acos(anzeige) * 180 / Math.PI) !== grad) continue;
              const gleich = Math.abs(anzeige - cos) < 1e-12;
              d = { grad, kos: fmt(anzeige), gleich, winkelGleich: winkelExakt(gleich, anzeige, grad) };
            }
            if (!d) { la = 3; lb = 5; sk = 9; d = { grad: 53, kos: fmt(0.6), gleich: true, winkelGleich: false }; }
            return {
              q: `Von zwei Vektoren ist bekannt: ${vname('a')} · ${vname('b')} = ${fmt(sk)},&nbsp;|${vname('a')}| = ${fmt(la)}&nbsp;und&nbsp;|${vname('b')}| = ${fmt(lb)}. Wie groß ist der Winkel φ zwischen ihnen? (Auf ganze Grad genau.)`,
              type: 'input', placeholder: 'φ in °',
              check: numCheck(d.grad, 0.6), testAnswer: String(d.grad), answerText: `${fmt(d.grad)}°`,
              solution: `Die Komponenten braucht man hier gar nicht – die zweite Form des Skalarprodukts genügt:<br>cos φ = ${frac(fmt(sk), `${fmt(la)} · ${fmt(lb)}`)} = ${frac(fmt(sk), fmt(la * lb))} ${d.gleich ? '=' : '≈'} ${d.kos}<br>φ = cos⁻¹(${d.kos}) ${winkelZeichen(d)} <strong>${fmt(d.grad)}°</strong><br>${sk < 0 ? 'Das Skalarprodukt ist negativ, der Winkel ist also stumpf.' : 'Das Skalarprodukt ist positiv, der Winkel ist also spitz.'}`
            };
          }

          const achse = [1, 0, 0];
          const { a } = zieheWinkel(() => [zufallsVektor(3, 6), achse], false);
          const dA = winkelDaten(a, achse, false);
          return {
            q: `Welchen Winkel schließt ${vname('a')} = ${vek(a)} mit der x-Achse ein? Die x-Achse hat den Richtungsvektor ${vek(achse)}. (Auf ganze Grad genau.)`,
            type: 'input', placeholder: 'φ in °',
            check: numCheck(dA.grad, 0.6), testAnswer: String(dA.grad), answerText: `${fmt(dA.grad)}°`,
            solution: `Vom Skalarprodukt mit ${vek(achse)} überlebt nur die erste Komponente, die beiden anderen werden mit null multipliziert:<br>${vname('a')} · ${vek(achse)} = ${fmt(a[0])}<br>${betragWeg('a', a)}, und der Richtungsvektor der Achse hat die Länge 1<br>cos φ = ${frac(fmt(a[0]), wurzel(quadrat(a)))} ${dA.gleich ? '=' : '≈'} ${dA.kos}<br>φ = cos⁻¹(${dA.kos}) ${winkelZeichen(dA)} <strong>${fmt(dA.grad)}°</strong>`
          };
        }

        /* ============================================================
           Stufe 3 – Geraden, Dreiecke, gemeinsame Senkrechte
           ============================================================ */
        const art = rnd(1, 6);

        if (art === 1 || art === 2) {
          const { a: u, b: v, d } = zieheWinkel(() => schiefesPaar(3, 4), true);
          const gemeinsam = `${vname('u')} · ${vname('v')} = ${rechenweg(u, v)}`
            + `<br>${betragWeg('u', u)}`
            + `<br>${betragWeg('v', v)}`
            + `<br>Der Schnittwinkel zweier Geraden ist höchstens 90°, deshalb steht der Zähler in Betragsstrichen:`
            + `<br>cos φ = ${frac(`|${vname('u')} · ${vname('v')}|`, `|${vname('u')}| · |${vname('v')}|`)} = ${kosBruch(`|${fmt(d.sk)}|`, Math.abs(d.sk), u, v, d)}`
            + `<br>φ = cos⁻¹(${d.kos}) ${winkelZeichen(d)} <strong>${fmt(d.grad)}°</strong>`
            + (d.sk < 0 ? `<br>Ohne die Betragsstriche käme ${fmt(180 - d.grad)}° heraus – das ist der Nebenwinkel, nicht der Schnittwinkel.` : '');

          if (art === 1) {
            return {
              q: `Zwei Geraden haben die Richtungsvektoren ${vname('u')} = ${vek(u)} und ${vname('v')} = ${vek(v)}. Berechne ihren Schnittwinkel auf ganze Grad genau.`,
              type: 'input', placeholder: 'φ in °',
              check: numCheck(d.grad, 0.6), testAnswer: String(d.grad), answerText: `${fmt(d.grad)}°`,
              solution: gemeinsam
            };
          }

          // Parameterform: Die Aufpunkte werden aus einem gemeinsamen Schnittpunkt
          // zurückgerechnet – sonst könnten die Geraden windschief sein und es gäbe
          // gar keinen Schnittwinkel.
          const S = [rnd(-3, 5), rnd(-3, 5), rnd(-3, 5)];
          const t0 = choice([1, 2]), s0 = choice([1, 2]);
          const p = S.map((c, i) => c - t0 * u[i]);
          const qP = S.map((c, i) => c - s0 * v[i]);
          return {
            q: `Die Geraden g und h schneiden sich. Berechne den Schnittwinkel auf ganze Grad genau.<br>g: ${vname('x')} = ${vek(p)} + t · ${vek(u)}<br>h: ${vname('x')} = ${vek(qP)} + s · ${vek(v)}`,
            type: 'input', placeholder: 'φ in °',
            check: numCheck(d.grad, 0.6), testAnswer: String(d.grad), answerText: `${fmt(d.grad)}°`,
            solution: `Für den Winkel zählen allein die Richtungsvektoren – die Aufpunkte ${vek(p)} und ${vek(qP)} werden nicht gebraucht.<br>${gemeinsam}`
          };
        }

        if (art === 3) {
          let A = [1, 2, 1], B = [4, 3, 3], C = [2, 5, 2], i = 0, u = null, v = null, d = null;
          for (let versuch = 0; versuch < 400 && !d; versuch++) {
            const ecken = dreieck();
            const j = rnd(0, 2);
            const rest = [0, 1, 2].filter(k => k !== j);
            const kandU = diff3(ecken[j], ecken[rest[0]]);
            const kandV = diff3(ecken[j], ecken[rest[1]]);
            const kand = winkelDaten(kandU, kandV, false);
            if (!kand) continue;
            [A, B, C] = ecken; i = j; u = kandU; v = kandV; d = kand;
          }
          const P = [A, B, C];
          const rest = [0, 1, 2].filter(k => k !== i);
          const nam1 = ECKEN[i] + ECKEN[rest[0]], nam2 = ECKEN[i] + ECKEN[rest[1]];
          const w = WINKELNAMEN[i];
          return {
            q: `Das Dreieck ABC hat die Ecken ${punkt('A', A)}, ${punkt('B', B)} und ${punkt('C', C)}. Berechne den Innenwinkel bei ${ECKEN[i]} auf ganze Grad genau.`,
            type: 'input', placeholder: `${w} in °`,
            check: numCheck(d.grad, 0.6), testAnswer: String(d.grad), answerText: `${w} ${winkelZeichen(d)} ${fmt(d.grad)}°`,
            solution: `Beide Vektoren müssen von ${ECKEN[i]} <strong>weg</strong>zeigen:<br>${vname(nam1)} = ${vek(P[rest[0]])} − ${vek(P[i])} = ${vek(u)}<br>${vname(nam2)} = ${vek(P[rest[1]])} − ${vek(P[i])} = ${vek(v)}<br>${vname(nam1)} · ${vname(nam2)} = ${rechenweg(u, v)}<br>${betragWeg(nam1, u)}<br>${betragWeg(nam2, v)}<br>cos ${w} = ${frac(`${vname(nam1)} · ${vname(nam2)}`, `|${vname(nam1)}| · |${vname(nam2)}|`)} = ${kosBruch(fmt(d.sk), d.sk, u, v, d)}<br>${w} = cos⁻¹(${d.kos}) ${winkelZeichen(d)} <strong>${fmt(d.grad)}°</strong>`
          };
        }

        if (art === 4) {
          /* Kleiner Normalenvektor zu u und w: Kreuzprodukt, durch den ggT geteilt –
             oder null, wenn eine Komponente 0 wird oder der Vektor zu groß gerät.
             Dient für die Lösung wie für die Ablenker „nur auf a/b senkrecht“. */
          const kleinerNormalenvektor = (u, w) => {
            const kn = kreuz(u, w);
            if (kn.some(c => c === 0)) return null;
            const g = gcd(gcd(Math.abs(kn[0]), Math.abs(kn[1])), Math.abs(kn[2]));
            const r = kn.map(c => c / g);
            return r.some(c => Math.abs(c) > 8) ? null : r;
          };
          const minusZahl = v => v.filter(c => c < 0).length;
          // Die Lösung bekommt gemischte Vorzeichen: Ein Vektor ganz ohne Minus
          // (oder ganz mit) wäre unter den Optionen die kürzeste bzw. längste –
          // und damit ratbar. Ihr Vorzeichen ist Zufall, beide Richtungen sind
          // Normalenvektoren.
          let a = [2, 1, 2], b = [1, 3, -1], n = [-7, 4, 5];   // −14 + 4 + 10 = 0 und −7 + 12 − 5 = 0
          for (let versuch = 0; versuch < 400; versuch++) {
            const ka = zufallsVektor(3, 3), kb = zufallsVektor(3, 3);
            const kn = kleinerNormalenvektor(ka, kb);
            if (!kn || minusZahl(kn) % 3 === 0) continue;
            a = ka; b = kb; n = choice([kn, kn.map(c => -c)]); break;
          }
          const richtig = vek(n);
          const k = minusZahl(n);   // 1 oder 2
          /* Vorher waren die Ablenker drei Einzelkipps der Lösung. Dann ist die
             Lösung in jeder Komponente die Mehrheit der vier Optionen, und wer das
             sieht, braucht die Frage nicht (gemessen: 100 %). Jetzt entstehen die
             Ablenker genauso wie die Lösung – als kleiner Normalenvektor zweier
             Zufallsvektoren – und tragen dieselbe Zahl von Minuszeichen:
               · einer steht nur auf a senkrecht, einer nur auf b – der Fehler,
                 nur eine der beiden Bedingungen zu prüfen
               · einer auf keinem von beiden
             So haben alle vier Optionen dieselbe Länge, Bauform und Größenordnung.
             Auch ein einzelner Vorzeichenkipp der Lösung schied als Ablenker aus:
             Er bildet mit ihr ein Zwillingspaar (zwei Optionen mit denselben
             Beträgen), und „eine von den beiden, die sich gleichen“ träfe zu 50 %.
             Reserve, falls eine Suche scheitert: die beiden Doppelkipps, die die
             Zahl der Minuszeichen behalten – sie enthalten die einzeln stehende
             Komponente i, ihr Skalarprodukt mit a ist 2aₗnₗ und damit nie null. */
          const mitKMinus = v => minusZahl(v) === k ? v : minusZahl(v) === 3 - k ? v.map(c => -c) : null;
          const muster = v => v.map(c => (c < 0 ? '−' : '+')).join('');
          /* Kleiner Normalenvektor zu u (ohne u: zu einem Zufallsvektor), der auf
             keinem Vektor aus `schief` senkrecht steht und möglichst das
             Vorzeichenmuster `ziel` trägt; ist das für u unerreichbar, tut es der
             erste brauchbare Vektor. */
          const suche = (u, schief, ziel) => {
            let ersatz = null;
            for (let i = 0; i < 300; i++) {
              const d = kleinerNormalenvektor(u || zufallsVektor(3, 3), zufallsVektor(3, 3));
              if (!d || schief.some(w => skalar(d, w) === 0)) continue;
              const e = mitKMinus(d);
              if (!e) continue;
              if (muster(e) === ziel) return e;
              ersatz = ersatz || e;
            }
            return ersatz;
          };
          const zufallsMuster = () => muster(shuffle([-1, ...(k === 1 ? [1, 1] : [-1, 1])]));
          const nurA = suche(a, [b], zufallsMuster()), nurB = suche(b, [a], zufallsMuster());
          /* Vektoren senkrecht zu a erben ihr Vorzeichenmuster über a – für manche a
             sind nur zwei der drei Muster erreichbar, und die Lösung liegt
             zwangsläufig darin. Die Ablenker ⊥ a und ⊥ b teilen ihr Muster deshalb
             öfter mit der Lösung als der Zufall, und „nie die Option mit dem
             einmaligen Muster" wurde zur Faustregel (gemessen: 9 % statt 25 %).
             Der freie Ablenker kann jedes Muster tragen und schließt die Lücke:
             Sind die drei Muster gleich, nimmt er dasselbe (vier gleiche); sind
             zwei gleich, nimmt er das dritte (zwei Paare); sind alle verschieden,
             schließt er sich zur Hälfte der Lösung an, sonst einem der beiden
             anderen. So hat nie genau eine Option ein einmaliges Muster, und
             „aus dem Paar“ wie „aus den Einzelnen“ treffen je 25 %. */
          const gesehen = [n, nurA, nurB].filter(Boolean).map(muster);
          const zielFrei = gesehen.length < 3 || new Set(gesehen).size === 1 ? gesehen[0]
            : new Set(gesehen).size === 2 ? gesehen.find(m => gesehen.filter(x => x === m).length === 1)
              : rnd(0, 1) === 0 ? gesehen[0] : choice(gesehen.slice(1));
          const keiner = suche(null, [a, b], zielFrei);
          const i = n.findIndex(c => n.filter(x => Math.sign(x) === Math.sign(c)).length === 1);
          const [j, l] = shuffle([0, 1, 2].filter(x => x !== i));
          const doppelKipp = (x, y) => n.map((c, m) => (m === x || m === y ? -c : c));
          /* Die Doppelkipps bleiben ohne Grund: Sie stehen wie `keiner` auf keinem
             der beiden senkrecht – zwei Optionen mit demselben Grund unterschiede
             er nicht –, und ihre Bauart („zwei Vorzeichen der Lösung gedreht“)
             zu nennen, hieße die Lösung zu nennen. */
          const paare = [
            [nurA, `Dieser Vektor steht nur auf ${vname('a')} senkrecht, nicht auf ${vname('b')} – eine Bedingung allein genügt nicht.`],
            [nurB, `Dieser Vektor steht nur auf ${vname('b')} senkrecht, nicht auf ${vname('a')} – eine Bedingung allein genügt nicht.`],
            [keiner, `Dieser Vektor steht weder auf ${vname('a')} noch auf ${vname('b')} senkrecht.`],
            [doppelKipp(i, j), null], [doppelKipp(i, l), null]
          ].filter(([v]) => v);
          const ablenker = paare.map(([v]) => vek(v));
          const mc = makeChoice(richtig, ablenker, paare.map(([, g]) => g));
          return {
            q: `Welcher Vektor steht auf ${vname('a')} = ${vek(a)} <strong>und</strong> auf ${vname('b')} = ${vek(b)} senkrecht?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `Beide Bedingungen müssen gelten: ${vname('n')} · ${vname('a')} = 0 <strong>und</strong> ${vname('n')} · ${vname('b')} = 0. Für die Auswahl genügt die Probe – wer ${vname('n')} selbst bauen will, löst die beiden Gleichungen für drei Unbekannte und wählt eine Komponente frei.<br>Probe für ${vname('n')} = ${vek(n)}:<br>${vname('n')} · ${vname('a')} = ${rechenweg(n, a)} ✓<br>${vname('n')} · ${vname('b')} = ${rechenweg(n, b)} ✓<br>Bei den anderen Vorschlägen ist mindestens eines der beiden Skalarprodukte nicht null.`
              + (nurA ? `<br>Vorsicht bei ${vek(nurA)}: Er steht zwar senkrecht auf ${vname('a')}, aber ${vek(nurA)} · ${vname('b')} = ${rechenweg(nurA, b)} ≠ 0 – eine Bedingung allein genügt nicht.` : '')
          };
        }

        if (art === 5) {
          const rechtwinklig = rnd(1, 4) <= 3;
          let A = [1, 2, 1], B = [4, 3, 3], C = [2, 5, 2], ecke = 3;
          if (rechtwinklig) {
            for (let versuch = 0; versuch < 400; versuch++) {
              const paar = senkrechtPaar();
              const S = [rnd(-3, 5), rnd(-3, 5), rnd(-3, 5)];
              const P1 = S.map((c, k) => c + paar[0][k]);
              const P2 = S.map((c, k) => c + paar[1][k]);
              const i = rnd(0, 2);
              const punkte = [];
              punkte[i] = S;
              const rest = [0, 1, 2].filter(k => k !== i);
              punkte[rest[0]] = P1; punkte[rest[1]] = P2;
              [A, B, C] = punkte; ecke = i;
              break;
            }
          } else {
            for (let versuch = 0; versuch < 400; versuch++) {
              const ecken = dreieck();
              const [E1, E2, E3] = ecken;
              const winkelfrei = skalar(diff3(E1, E2), diff3(E1, E3)) !== 0
                && skalar(diff3(E2, E1), diff3(E2, E3)) !== 0
                && skalar(diff3(E3, E1), diff3(E3, E2)) !== 0;
              if (!winkelfrei) continue;
              [A, B, C] = ecken; ecke = 3;
              break;
            }
          }
          const P = [A, B, C];
          /* Die Verbindungsvektoren stehen vorab da, Spitze minus Fuß, wie im
             Bauplan-Beispiel der Seite („BA = A − B = …“). Vorher tauchten ihre
             Komponenten nur verstreut in den Produkten auf – gerade beim Bilden
             der Vektoren (Richtung, Spitze minus Fuß) liegt aber die Fehlerquelle,
             die die Seite hervorhebt, und ohne sie gab es nichts zum Vergleichen.
             Die drei Gegenvektoren entstehen durch Drehen aller Vorzeichen; die
             Null bleibt dabei null (kein „−0“). */
          const AB = diff3(A, B), AC = diff3(A, C), BC = diff3(B, C);
          const gegen = w => w.map(k => (k === 0 ? 0 : -k));
          const vektorWeg = [
            `${vname('AB')} = ${vek(B)} − ${vek(A)} = ${vek(AB)}`,
            `${vname('AC')} = ${vek(C)} − ${vek(A)} = ${vek(AC)}`,
            `${vname('BC')} = ${vek(C)} − ${vek(B)} = ${vek(BC)}`,
            `Die übrigen drei zeigen genau andersherum, alle Vorzeichen gedreht: ${vname('BA')} = ${vek(gegen(AB))}, ${vname('CA')} = ${vek(gegen(AC))}, ${vname('CB')} = ${vek(gegen(BC))}`
          ].join(TRENN);
          const zeilen = [0, 1, 2].map(i => {
            const rest = [0, 1, 2].filter(k => k !== i);
            const u = diff3(P[i], P[rest[0]]), v = diff3(P[i], P[rest[1]]);
            const nam1 = ECKEN[i] + ECKEN[rest[0]], nam2 = ECKEN[i] + ECKEN[rest[1]];
            return `${vname(nam1)} · ${vname(nam2)} = ${rechenweg(u, v)}${skalar(u, v) === 0 ? ' ✓' : ''}`;
          });
          const optionen = ['bei A', 'bei B', 'bei C', 'bei keiner Ecke'];
          const richtig = optionen[ecke];
          /* An jeder falschen Ecke ist das Skalarprodukt der wegführenden Vektoren
             ungleich null: im schiefen Fall nach `winkelfrei`, im rechtwinkligen,
             weil ein Dreieck nur einen rechten Winkel haben kann. */
          const gruende = optionen.map((_, e) => {
            if (e === ecke) return null;
            if (e === 3) return 'An einer der drei Ecken ergibt das Skalarprodukt der wegführenden Vektoren null.';
            const rest = [0, 1, 2].filter(k => k !== e);
            return `${vname(ECKEN[e] + ECKEN[rest[0]])} · ${vname(ECKEN[e] + ECKEN[rest[1]])} ist nicht null – bei ${ECKEN[e]} liegt kein rechter Winkel.`;
          });
          return {
            q: `Hat das Dreieck mit den Ecken ${punkt('A', A)}, ${punkt('B', B)} und ${punkt('C', C)} einen rechten Winkel – und wenn ja, wo?`,
            type: 'choice', options: optionen, correct: ecke, gruende, answerText: richtig,
            solution: `An jeder Ecke die beiden wegführenden Vektoren bilden und das Skalarprodukt prüfen. Zuerst die Vektoren, Spitze minus Fuß:${TRENN}${vektorWeg}${TRENN}${zeilen.join('<br>')}<br>${ecke === 3 ? 'Kein einziges Skalarprodukt ist null – das Dreieck hat <strong>keinen</strong> rechten Winkel.' : `Nur bei ${ECKEN[ecke]} kommt null heraus, der rechte Winkel liegt also <strong>${richtig}</strong>.`}<br>Mehr als einen rechten Winkel kann ein Dreieck ohnehin nicht haben – die Winkelsumme wäre sonst überschritten.`
          };
        }

        // Sachaufgabe: Arbeit ist das Skalarprodukt aus Kraft und Weg. Über die
        // zweite Form der Formel gerechnet, damit der Winkel eine Rolle spielt.
        /* 90° liefert IMMER 0 J, gleich welche Kraft und welcher Weg gezogen
           werden – bei fünf gleich wahrscheinlichen Winkeln war „0“ deshalb in
           20 % aller Ziehungen richtig, während sich jede andere Antwort über
           alle Kraft-Weg-Paare verteilte. Wer blind 0 tippte, lag jedes fünfte
           Mal richtig. Der Sonderfall bleibt – er trägt die Einsicht, dass eine
           senkrechte Kraft keine Arbeit verrichtet –, kommt aber nur noch in
           einem von acht Fällen vor. */
        const grad = rnd(1, 8) === 1 ? 90 : choice([0, 60, 120, 180]);
        const kos = { 0: 1, 60: 0.5, 90: 0, 120: -0.5, 180: -1 }[grad];
        const kraft = rnd(2, 15) * 10, weg = rnd(2, 12);
        const W = kraft * weg * kos;
        const deutung = grad === 90
          ? 'Steht die Kraft senkrecht zum Weg, ist das Skalarprodukt null: Sie verrichtet keine Arbeit. Genau deshalb kostet das Tragen einer Tasche auf ebener Strecke im physikalischen Sinn nichts.'
          : grad > 90
            ? 'Der Winkel ist größer als 90°, der Kosinus negativ – die Arbeit ist negativ. Die Kraft bremst die Bewegung, statt sie anzutreiben.'
            : 'Der Winkel ist kleiner als 90°, der Kosinus positiv – die Kraft treibt die Bewegung an.';
        return {
          q: `Eine Kraft vom Betrag |${vname('F')}| = ${fmt(kraft)} N schiebt eine Kiste ${fmt(weg)} m weit. Kraft und Weg schließen den Winkel φ = ${fmt(grad)}° ein. Die verrichtete Arbeit ist W = ${vname('F')} · ${vname('s')}. Berechne W (in Joule).`,
          type: 'input', placeholder: 'W in J',
          check: numCheck(W), testAnswer: String(W), answerText: `${fmt(W)} J`,
          solution: `W = |${vname('F')}| · |${vname('s')}| · cos φ = ${fmt(kraft)} · ${fmt(weg)} · cos ${fmt(grad)}° = ${fmt(kraft)} · ${fmt(weg)} · ${par(kos)} = <strong>${fmt(W)} J</strong><br>${deutung}`
        };
      }
    };
  })();

  /* ============================================================
     Geraden im Raum – Entwurf.
  
     ACHTUNG: Diese Datei ist die FERTIGE Fassung. Der Entwurfsordner
     wurde während der Arbeit von `einbinden.py` geleert; die dabei
     eingebundene Fassung in `js/topics-geometrie.js` ist ein
     Zwischenstand und hat drei Befunde noch nicht behoben (Numerus
     „nach 1 Sekunden“, falsch benannte Probezeile, „v = 1 · u“).
     Diese Datei hier hat sie.
  
     Prüfen mit:
       node design/pruefung/einzel.js design/pruefung/entwurf/geo-geraden.js \
                                      design/pruefung/entwurf/fig-geraden.svg
       node design/pruefung/proben.js design/pruefung/entwurf/geo-geraden.js 8
     ============================================================ */
  const geraden = (() => {

    const TRENN = '<br>';
    const KOMP_HINWEIS = '<span class="hint">Gib die drei Komponenten mit Semikolon getrennt ein, z. B. 3; −1; 5.</span>';
    const PUNKT_HINWEIS = '<span class="hint">Gib die drei Koordinaten mit Semikolon getrennt ein, z. B. 3; −1; 5.</span>';
    const ROEM = ['I', 'II', 'III'];

    /* ---------- Vektor-Werkzeuge ---------- */

    const plusV = (a, b) => a.map((k, i) => k + b[i]);
    const minusV = (a, b) => a.map((k, i) => k - b[i]);
    const malV = (r, a) => a.map(k => r * k);
    const kreuz = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
    /* Kollinear heißt hier: das Kreuzprodukt verschwindet. Das Kreuzprodukt kommt
       im Text des Themas nirgends vor – es ist nur das schnellste exakte Kriterium
       beim Bauen der Aufgaben, gerechnet in ganzen Zahlen und damit ohne Rundung. */
    const kollinear = (a, b) => kreuz(a, b).every(k => k === 0);

    /* Richtungsvektor: Komponenten nie 0 und paarweise verschieden.
       Nie 0, weil sonst in einer Zeile „4 + 0 · t“ stünde – ein Schritt, der nichts
       tut, und eine Zeile, aus der sich t nicht bestimmen lässt.
       Paarweise verschieden, weil zwei gleiche Komponenten zwei wortgleiche
       Rechenzeilen ergeben: Wer die eine prüft, hat die andere mitgeprüft, und die
       Punktprobe verliert stillschweigend eine ihrer drei Zeilen. */
    function richtung(max) {
      let v;
      do { v = [rndNonZero(-max, max), rndNonZero(-max, max), rndNonZero(-max, max)]; }
      while (new Set(v).size < 3);
      return v;
    }
    const punktV = max => [rndNonZero(-max, max), rndNonZero(-max, max), rndNonZero(-max, max)];

    /** Richtungsvektor, der mindestens eine ±1 enthält – siehe `lageVon`. */
    function richtungMitEins(max) {
      let u;
      do { u = richtung(max); } while (!u.some(k => Math.abs(k) === 1));
      return u;
    }

    /* ---------- Darstellung ---------- */

    /** „g: x = (…) + t · (…)“ */
    const gleichung = (name, p, u, param = 't') =>
      `${name}: ${vname('x')} = ${vek(p)} + ${param} · ${vek(u)}`;

    /** Punkt ohne Namen: „(3 | −1 | 5)“ – für Antwortmöglichkeiten. */
    const koordText = v => `(${v.map(k => fmt(k)).join(' | ')})`;

    /** „4 + 3 · (−2) = −2“ – eine Zeile beim Einsetzen eines t-Wertes. */
    const punktZeile = (p, u, t, i) =>
      `${fmt(p[i])} + ${par(t)} · ${par(u[i])} = ${fmt(p[i] + t * u[i])}`;

    /** „x₁ = 2 + 3t“ – die Koordinatenform, Zeile i. */
    const koordZeile = (p, u, i, param = 't') =>
      `x<sub>${i + 1}</sub> = ${fmt(p[i])} ${u[i] < 0 ? '−' : '+'} ${koef(Math.abs(u[i]), param)}`;

    /** „4 − 2t = −1 + 3s“ – Zeile i des gleichgesetzten Systems. */
    const lgsZeile = (p, u, q, v, i) =>
      `${fmt(p[i])} ${u[i] < 0 ? '−' : '+'} ${koef(Math.abs(u[i]), 't')}`
      + ` = ${fmt(q[i])} ${v[i] < 0 ? '−' : '+'} ${koef(Math.abs(v[i]), 's')}`;

    /** Dieselbe Zeile nach t und s sortiert: „t − 3s = −5“. */
    const sortZeile = (p, u, q, v, i) => {
      const bs = -v[i];                       // Koeffizient von s nach dem Sortieren
      return `${koef(u[i], 't')} ${bs < 0 ? '−' : '+'} ${koef(Math.abs(bs), 's')} = ${fmt(q[i] - p[i])}`;
    };

    /** „t = 2“ bzw. „t = 5/2“ – nie eine Dezimalzahl mit zwölf Stellen. */
    const quot = (z, n) => fracHTML(...reduce(z, n));

    /* ---------- Lagebeziehung: exakt bestimmen ---------- */

    /**
     * Lage zweier Geraden, in ganzen Zahlen entschieden.
     *
     * Bei nicht parallelen Richtungsvektoren wird ein Zeilenpaar mit nicht
     * verschwindender Determinante gesucht; die dritte Zeile ist die Probe.
     * Bevorzugt wird ein Paar, dessen erste Zeile den Koeffizienten ±1 hat und
     * das ganzzahlige Werte liefert – nur dann lässt sich der Lösungsweg glatt
     * hinschreiben („Zeile I nach t auflösen“), ohne dass mitten in der Rechnung
     * ein Bruch auftaucht.
     */
    function lageVon(p, u, q, v) {
      const d = minusV(q, p);
      if (kollinear(u, v)) {
        const lam = [0, 1, 2].map(i => d[i] / u[i]);
        const identisch = lam.every(x => Math.abs(x - lam[0]) < 1e-9);
        return { art: identisch ? 'identisch' : 'parallel', k: v[0] / u[0] };
      }
      let beste = null;
      for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
        const det = u[j] * v[i] - u[i] * v[j];
        if (det === 0) continue;
        const t = (v[i] * d[j] - d[i] * v[j]) / det;
        const s = (u[i] * d[j] - d[i] * u[j]) / det;
        const k = 3 - i - j;                                   // die verbleibende Zeile
        const art = Math.abs(t * u[k] - s * v[k] - d[k]) < 1e-9 ? 'schneidend' : 'windschief';
        const kand = { art, i, j, k, t, s, S: plusV(p, malV(t, u)) };
        if (Number.isInteger(t) && Number.isInteger(s)) {
          if (Math.abs(u[i]) === 1) return kand;
          if (Math.abs(u[j]) === 1) return { ...kand, i: j, j: i };
        }
        if (!beste) beste = kand;
      }
      return beste;
    }

    /**
     * Zwei Geraden mit vorgegebener Lage.
     *
     * Wichtig ist nicht nur, dass die Lage stimmt, sondern dass sich die vier
     * Fälle an den Zahlen NICHT unterscheiden lassen. Deshalb entstehen sie aus
     * demselben Vorrat und paarweise auseinander:
     *
     *   identisch  → echt parallel: EINE Koordinate von q um höchstens 1 verrücken
     *   schneidend → windschief:    EINE Koordinate von q um höchstens 2 verrücken
     *
     * Die beiden Verschiebungen sind klein gegenüber dem Zahlenraum (±9), also
     * gibt es kein Merkmal, an dem man die Fälle ohne Rechnung trennen könnte.
     * Genau das war beim Thema `ebenen` der schwerste Befund: Dort kamen die
     * parallelen Fälle aus einem größeren Zahlenraum als die schneidenden.
     */
    function lagePaar(ziel) {
      for (let versuch = 0; versuch < 900; versuch++) {
        const u = richtungMitEins(3);
        const kF = choice([-2, -1, 1, 2]);
        const parallelFall = ziel === 'identisch' || ziel === 'parallel';
        let v;
        if (parallelFall) v = malV(kF, u);
        else {
          const w = richtung(3);
          if (kollinear(u, w)) continue;
          v = malV(kF, w);                    // gleiche Bauart wie k · u: kein Größenunterschied
        }
        const p = punktV(6);
        let q, kz = -1;
        if (parallelFall) {
          /* Der Grundfall ist „identisch“: Q = P + m · u liegt auf g. Der Faktor m
             kommt bei beiden Lagen aus demselben Vorrat – sonst wären echt
             parallele Paare schon an der Größe von Q − P zu erkennen. */
          const FAKTOREN = [-3, -2, -1, 1, 2, 3];
          q = plusV(p, malV(choice(FAKTOREN), u));
          if (ziel === 'parallel') {
            if (rnd(1, 4) === 1) {
              // Fall A: ein Versatz quer zur Richtung – Q liegt neben g, und die
              // Faktoren gehen nicht mehr auf (im Lösungsweg stehen dann Brüche).
              const w2 = [rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)];
              if (w2.every(k => k === 0) || kollinear(u, w2)) continue;
              q = plusV(q, w2);
            } else {
              /* Fall B: EINE Zeile bekommt einen anderen Faktor. Dann ist Q − P
                 weiterhin in allen drei Zeilen durch u teilbar – wer nur auf
                 Teilbarkeit schaut, hält die Geraden fälschlich für identisch.
                 Ohne diesen Fall war die Frage zu 71 % ohne den eigentlichen
                 Vergleich der drei Faktoren zu beantworten (gemessen); mit ihm
                 sind es 57 %, also kaum mehr als ein Münzwurf. */
              const kz2 = rnd(0, 2);
              const m = (q[kz2] - p[kz2]) / u[kz2];
              q = q.slice();
              q[kz2] = p[kz2] + choice(FAKTOREN.filter(x => x !== m)) * u[kz2];
            }
          }
        } else {
          const t0 = choice([-2, -1, 1, 2]), s0 = choice([-2, -1, 1, 2]);
          q = minusV(plusV(p, malV(t0, u)), malV(s0, v));
          if (ziel === 'windschief') {
            // Nur eine Zeile verrücken, und zwar eine, die beim Lösen NICHT
            // gebraucht wird: Dann liefern die beiden anderen Zeilen weiterhin
            // ganzzahlige Werte, und der Widerspruch steht sauber in der dritten.
            const n = kreuz(u, v);
            kz = choice([0, 1, 2].filter(i => n[i] !== 0));
            q = q.slice();
            q[kz] += choice([-2, -1, 1, 2]);
          }
        }
        if (!q.every(k => k !== 0 && Math.abs(k) <= 9)) continue;
        const info = lageVon(p, u, q, v);
        if (!info || info.art !== ziel) continue;
        if (!parallelFall) {
          /* Die verrückte Zeile muss auch die Probezeile sein. Sonst rechnet der
             Lösungsweg mit einer Zeile, die gar nicht mehr zur Geraden passt, und
             liefert Werte wie t = 4/3 oder s = 0 – Zahlen, die in der Aufgabe
             nichts zu suchen haben. */
          if (ziel === 'windschief' && info.k !== kz) continue;
          if (!Number.isInteger(info.t) || !Number.isInteger(info.s)) continue;
          if (info.t === 0 || info.s === 0) continue;
          if (Math.abs(u[info.i]) !== 1) continue;
          if (info.S.some(k => Math.abs(k) > 14)) continue;
        }
        return { p, u, q, v, info };
      }
      // Rückfall – nachgerechnet: Richtungen nicht kollinear, Zeilen I und II
      // liefern t = 2 und s = 1, Zeile III geht auf.
      const p = [1, 2, 3], u = [2, 1, 1], q = [4, 5, 3], v = [1, -1, 2];
      return { p, u, q, v, info: lageVon(p, u, q, v) };
    }

    /**
     * Die beiden brauchbaren Zeilen nach t und s auflösen – als Folge von
     * Schritten. Eigene Funktion, weil zwei Aufgabenarten sie brauchen: die
     * Lagebeziehung und die Frage nach dem fehlenden Wert a. Dort stand vorher
     * nur „die beiden Zeilen liefern t = −1 und s = −1“ – ein Lösungsweg, der
     * den Weg gerade an der Stelle verschweigt, an der gerechnet wird.
     */
    function zeilenLoesen(p, u, q, v, info) {
      const d = minusV(q, p);
      const { i, j, s } = info;
      const paar = [i, j].slice().sort((a, b) => a - b);
      const teile = [`Beide Zeilen nach t und s sortieren:`];
      teile.push(paar.map(z => `${ROEM[z]}: ${sortZeile(p, u, q, v, z)}`).join(TRENN));

      /* Sortierte Zeile i: u[i] · t − v[i] · s = d[i], mit u[i] = ±1 – deshalb
         geht das Auflösen glatt. Bei −t wird das Drehen aller Vorzeichen als
         eigener Schritt „| · (−1)“ gezeigt, so wie derselbe Weg es bei −s tut;
         die Seite zeigt nur den Fall +t. */
      const eps = u[i];
      const A = eps * d[i], Bc = eps * v[i];   // t = A + Bc · s
      if (eps === 1) teile.push(`Zeile ${ROEM[i]} nach t auflösen: t = ${aufgeloest(A, Bc, 's')}`);
      else teile.push(`Zeile ${ROEM[i]} nach t auflösen: −t = ${aufgeloest(d[i], v[i], 's')}&nbsp;| · (−1)`,
        `t = ${aufgeloest(A, Bc, 's')}`);

      // Sortierte Zeile j: u[j] · t − v[j] · s = d[j]
      teile.push(...einsetzWeg(u[j], A, Bc, -v[j], d[j], 's', `In Zeile ${ROEM[j]} einsetzen: `));
      teile.push(rueckWeg('t', A, Bc, 's', s, true));
      return teile;
    }

    /**
     * Der vollständige Lösungsweg zur Lage zweier Geraden.
     * `nameG` und `nameH` werden auch in „… von h auf g“ eingesetzt – bei der
     * Sachaufgabe steht dort „von B auf der Bahn von A“. `wort` ist der Plural
     * der beiden Objekte („Geraden“ oder „Bahnen“), `stuetze` das Wort für den
     * Punkt, an dem die Gleichung ansetzt.
     */
    function lageWeg(p, u, q, v, info, nameG = 'g', nameH = 'h', wort = 'Geraden', stuetze = 'Stützpunkt') {
      const d = minusV(q, p);
      const verhaeltnis = [0, 1, 2]
        .map(i => `${fmt(v[i])} : ${par(u[i])} = ${quot(v[i], u[i])}`).join(', ');
      const teile = [];

      if (info.art === 'identisch' || info.art === 'parallel') {
        teile.push(`<strong>1. Richtungsvektoren vergleichen.</strong> Zeile für Zeile:`);
        teile.push(verhaeltnis);
        // Bei k = ±1 stünde sonst „v = 1 · u“ – ein Faktor, den niemand schreibt.
        const kText = info.k === 1 ? vname('u')
          : info.k === -1 ? `−${vname('u')}` : `${fmt(info.k)} · ${vname('u')}`;
        teile.push(`Überall derselbe Faktor, also ${vname('v')} = ${kText}. Die ${wort} sind parallel – ob sie sogar zusammenfallen, entscheidet erst der zweite Schritt.`);
        teile.push(`<strong>2. Punktprobe.</strong> Liegt der ${stuetze} ${punkt('Q', q)} von ${nameH} auf ${nameG}?`);
        teile.push(`${vek(q)} − ${vek(p)} = ${vek(d)}`);
        teile.push([0, 1, 2].map(i => `${fmt(d[i])} : ${par(u[i])} = ${quot(d[i], u[i])}`).join(', '));
        teile.push(info.art === 'identisch'
          ? `Auch hier steht dreimal derselbe Faktor: Q liegt auf ${nameG}. Beide Gleichungen beschreiben <strong>dieselbe Gerade</strong> – sie sind identisch.`
          : `Die Faktoren sind verschieden, Q liegt also nicht auf ${nameG}. Die ${wort} sind <strong>echt parallel</strong> und haben keinen gemeinsamen Punkt.`);
        return teile.join(TRENN);
      }

      const { i, j, k, t, s } = info;
      teile.push(`<strong>1. Richtungsvektoren vergleichen.</strong> Zeile für Zeile:`);
      teile.push(verhaeltnis);
      teile.push(`Die Faktoren sind verschieden – ${vname('v')} ist kein Vielfaches von ${vname('u')}. Weder parallel noch identisch; jetzt entscheidet das Gleichungssystem.`);
      teile.push(`<strong>2. Gleichsetzen</strong> und zeilenweise aufschreiben:`);
      teile.push([0, 1, 2].map(z => `${ROEM[z]}: ${lgsZeile(p, u, q, v, z)}`).join(TRENN));
      teile.push(`Zwei Zeilen genügen, um t und s zu bestimmen – hier ${[i, j].slice().sort((x, y) => x - y).map(z => ROEM[z]).join(' und ')}.`);
      teile.push(...zeilenLoesen(p, u, q, v, info));

      const links = p[k] + t * u[k], rechts = q[k] + s * v[k];
      teile.push(`<strong>3. Probe in Zeile ${ROEM[k]}</strong> – der entscheidende Schritt:`);
      teile.push(`linke Seite ${fmt(p[k])} + ${par(t)} · ${par(u[k])} = ${fmt(links)}`
        + `, rechte Seite ${fmt(q[k])} + ${par(s)} · ${par(v[k])} = ${fmt(rechts)}`);
      if (info.art === 'schneidend') {
        teile.push(`Beide Seiten stimmen überein: Das Gleichungssystem ist lösbar, die ${wort} <strong>schneiden sich</strong>.`);
        teile.push(`Schnittpunkt: t = ${fmt(t)} in die erste Gleichung einsetzen${TRENN}${[0, 1, 2].map(z => punktZeile(p, u, t, z)).join(TRENN)}${TRENN}<strong>${punkt('S', info.S)}</strong>`);
      } else {
        teile.push(`${fmt(links)} ≠ ${fmt(rechts)} – Zeile ${ROEM[k]} geht nicht auf. Das Gleichungssystem hat keine Lösung: Es gibt kein Paar (t | s), das alle drei Zeilen erfüllt. Die ${wort} sind <strong>windschief</strong>.`);
      }
      return teile.join(TRENN);
    }

    /* ---------- Sachaufgabe: zwei Flugbahnen ---------- */

    /**
     * Zwei Bahnen mit vorgegebenem Ausgang. Anders als bei `lagePaar` laufen die
     * Parameter hier vorwärts (Zeit ≥ 1) und die Höhe bleibt positiv – sonst
     * flöge die Drohne rückwärts oder unter dem Boden. Die vier Ausgänge stammen
     * wieder aus demselben Vorrat und unterscheiden sich nur im letzten Schritt.
     */
    function bahnPaar(ziel) {
      for (let versuch = 0; versuch < 900; versuch++) {
        const u = richtungMitEins(3);
        const kF = choice([-2, -1, 1, 2]);
        let v;
        if (ziel === 'parallel') v = malV(kF, u);
        else {
          const w = richtung(3);
          if (kollinear(u, w)) continue;
          v = malV(kF, w);
        }
        const p = [rnd(1, 9), rnd(1, 9), rnd(2, 9)];
        let q, t0 = 0, s0 = 0, kz = -1;
        if (ziel === 'parallel') {
          q = plusV(p, malV(choice([-3, -2, -1, 1, 2, 3]), u));
          const w2 = [rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)];
          if (w2.every(k => k === 0) || kollinear(u, w2)) continue;
          q = plusV(q, w2);
        } else {
          /* Beim Zusammenstoß sind beide Zeiten gleich, sonst liegen sie dicht
             beieinander. Weit auseinanderliegende Zeiten würden Q − P sichtbar
             größer machen – dann ließe sich der Zusammenstoß an der Größe der
             Stützpunkte erahnen, ohne eine Zeile zu rechnen. */
          t0 = choice([1, 2, 3, 4]);
          s0 = ziel === 'treffen' ? t0
            : choice([t0 - 1, t0 + 1].filter(x => x >= 1 && x <= 4));
          const S = plusV(p, malV(t0, u));
          if (S.some(k => k < 1) || S[2] < 2) continue;      // Treffpunkt über dem Boden
          q = minusV(S, malV(s0, v));
          if (ziel === 'windschief') {
            const n = kreuz(u, v);
            kz = choice([0, 1, 2].filter(i => n[i] !== 0));
            q = q.slice();
            q[kz] += choice([-2, -1, 1, 2]);
          }
        }
        if (!q.every(k => k >= 1 && k <= 12)) continue;
        const info = lageVon(p, u, q, v);
        const erwartet = ziel === 'windschief' ? 'windschief' : ziel === 'parallel' ? 'parallel' : 'schneidend';
        if (!info || info.art !== erwartet) continue;
        if (erwartet !== 'parallel') {
          // Wie bei `lagePaar`: die verrückte Zeile muss die Probezeile sein,
          // damit im Lösungsweg dieselben glatten Zeiten stehen wie im Aufbau.
          if (ziel === 'windschief' && info.k !== kz) continue;
          if (!Number.isInteger(info.t) || !Number.isInteger(info.s)) continue;
          if (Math.abs(u[info.i]) !== 1) continue;
          if (info.t < 1 || info.s < 1) continue;
          if (ziel !== 'windschief' && (ziel === 'treffen') !== (info.t === info.s)) continue;
        }
        return { p, u, q, v, info };
      }
      // Rückfall: kreuzende Bahnen, A ist nach 2 Sekunden dort, B schon nach 1.
      const p = [1, 2, 3], u = [2, 1, 1], q = [4, 5, 3], v = [1, -1, 2];
      return { p, u, q, v, info: lageVon(p, u, q, v) };
    }

    return {
      id: 'geraden',
      icon: 'p+t·u',
      title: 'Geraden im Raum',
      tagline: 'Parameterform, Punktprobe und Lagebeziehungen',

      learn: `
        <h2>Geraden im Raum – ein Punkt und eine Richtung</h2>
        <p>In der Ebene beschreibt y = mx + b eine Gerade: eine Steigung, ein Achsenabschnitt.
        Im Raum trägt das nicht mehr – zu einer Richtung gehören dort drei Zahlen, und eine
        einzelne Steigung gibt es nicht. Die analytische Geometrie beschreibt eine Gerade
        deshalb ganz anders: durch <strong>einen Punkt auf ihr</strong> und <strong>eine
        Richtung</strong>. Beides zusammen legt sie eindeutig fest. Wie man mit Komponenten
        rechnet, steht im Thema „Vektoren im Raum“ – hier kommt nur eine Idee dazu: ein
        Parameter, der die Gerade abläuft.</p>

        <div class="einstieg-box">
          <p class="box-title">Zwei Drohnen über dem Messfeld</p>
          <p>Zwei Drohnen starten gleichzeitig. Drohne A ist nach t Sekunden im Punkt
          (1 | 2 | 3) + t · (2 | 1 | 1), Drohne B nach s Sekunden im Punkt
          (4 | 5 | 3) + s · (1 | −1 | 2). Gemessen wird in Metern, die dritte Zahl ist die
          Höhe über dem Boden.</p>
          <p class="frage">Kreuzen sich die beiden Flugbahnen – und wenn ja: Stoßen die Drohnen
          dort zusammen?</p>
        </div>

        <h3>Die Parameterform</h3>

        <div class="herleitung-box">
          <p class="box-title">Warum ein Punkt und ein Pfeil genügen</p>
          <p>Gegeben sei ein Punkt P auf der Geraden g und ein Vektor ${vname('u')}, der in
          ihre Richtung zeigt (er darf nicht der Nullvektor sein – der zeigt nirgendwohin).</p>
          <p>Wann liegt ein Punkt X auf g? Genau dann, wenn der Pfeil von P nach X in dieselbe
          Richtung läuft wie ${vname('u')} – oder genau entgegengesetzt. Das heißt: ${vname('PX')}
          ist ein <strong>Vielfaches</strong> von ${vname('u')}, also ${vname('PX')} = t · ${vname('u')}
          für genau eine Zahl t.</p>
          <p>Über die Ortsvektoren geschrieben – ${vname('PX')} = ${vname('OX')} − ${vname('OP')} –
          wird daraus die <strong>Parameterform</strong>:</p>
          <p>${vname('OX')} = ${vname('OP')} + t · ${vname('u')},&nbsp;kurz&nbsp;g: ${vname('x')} = ${vname('p')} + t · ${vname('u')}</p>
          <p>Jede Zahl t liefert genau einen Punkt, und jeder Punkt der Geraden gehört zu genau
          einem t. Der Parameter läuft die Gerade ab: t = 0 gibt den Stützpunkt selbst, t = 1
          einen Schritt ${vname('u')} weiter, t = 2 zwei Schritte, negative Werte gehen in die
          Gegenrichtung. Zwischenwerte wie t = 0,5 sind ausdrücklich erlaubt – sonst wären es
          einzelne Punkte statt einer Geraden.</p>
          <p>Zwei Dinge folgen daraus sofort. Erstens ist die Gleichung <strong>nicht
          eindeutig</strong>: Als Stützvektor taugt der Ortsvektor jedes Punktes der Geraden,
          als Richtungsvektor jedes Vielfache von ${vname('u')}. ${vek([2, -1, 3])} und
          ${vek([-4, 2, -6])} beschreiben dieselbe Richtung. Zweitens bekommt man aus zwei
          Punkten A und B sofort eine Gleichung: A als Stützpunkt, ${vname('AB')} = B − A als
          Richtungsvektor.</p>
        </div>

        <p>Rechnen lässt sich mit der Parameterform, indem man sie <strong>zeilenweise</strong>
        liest. Aus g: ${vname('x')} = ${vek([2, -1, 4])} + t · ${vek([3, 1, -2])} werden drei
        gewöhnliche Gleichungen, die <em>Koordinatenform</em>:</p>
        <p>x<sub>1</sub> = 2 + 3t,&nbsp;x<sub>2</sub> = −1 + t,&nbsp;x<sub>3</sub> = 4 − 2t</p>
        <p>Alle drei enthalten dasselbe t. Genau darauf beruht jede Punktprobe: Man bestimmt t
        aus einer Zeile und prüft es in den beiden anderen.</p>

        <div class="merkkasten">
          <p class="box-title">Die Formeln</p>
          <p><strong>Parameterform:</strong>&nbsp;g: ${vname('x')} = ${vname('p')} + t · ${vname('u')}&nbsp;mit dem Stützvektor ${vname('p')} und dem Richtungsvektor ${vname('u')} ≠ ${vname('0')}</p>
          <p><strong>Gerade durch A und B:</strong>&nbsp;${vname('x')} = ${vname('OA')} + t · ${vname('AB')}&nbsp;mit ${vname('AB')} = B − A</p>
          <p><strong>Koordinatenform:</strong>&nbsp;x<sub>1</sub> = p<sub>1</sub> + t · u<sub>1</sub>,&nbsp;x<sub>2</sub> = p<sub>2</sub> + t · u<sub>2</sub>,&nbsp;x<sub>3</sub> = p<sub>3</sub> + t · u<sub>3</sub></p>
          <p><strong>Punktprobe:</strong>&nbsp;t aus einer Zeile bestimmen, in den beiden
          anderen prüfen. Nur wenn alle drei dasselbe t liefern, liegt der Punkt auf g.</p>
          <p><strong>Spurpunkt</strong> mit einer Koordinatenebene: die betreffende Koordinate
          null setzen. Für die x<sub>1</sub>x<sub>2</sub>-Ebene also x<sub>3</sub> = 0, daraus t
          bestimmen und einsetzen.</p>
          <p><strong>Zwei Geraden – vier Lagen:</strong> Sind die Richtungsvektoren Vielfache
          voneinander, sind die Geraden <em>identisch</em> oder <em>echt parallel</em> (die
          Punktprobe entscheidet). Sonst gleichsetzen: Ist das Gleichungssystem lösbar, so
          <em>schneiden</em> sie sich, sonst sind sie <em>windschief</em>.</p>
        </div>

        <h3>So rechnest du</h3>
        <ol class="schritte">
          <li>Gleichung aufstellen: Stützpunkt und Richtungsvektor besorgen. Sind zwei Punkte
          gegeben, ist der Richtungsvektor B − A (Spitze minus Fuß).</li>
          <li>Punkt zu einem t gesucht: t einsetzen und zeilenweise rechnen.</li>
          <li>Punktprobe: den Punkt gleich ${vname('p')} + t · ${vname('u')} setzen, t aus einer
          Zeile bestimmen und in den beiden anderen prüfen.</li>
          <li>Spurpunkt: die passende Koordinate null setzen, das ergibt t; dann t einsetzen und
          die beiden anderen Koordinaten ausrechnen.</li>
          <li>Zwei Geraden: zuerst die Richtungsvektoren vergleichen. Vielfache? Dann entscheidet
          eine Punktprobe zwischen identisch und echt parallel.</li>
          <li>Sonst gleichsetzen, zwei Zeilen nach t und s auflösen – und das Ergebnis in der
          dritten Zeile prüfen. Geht sie auf, schneiden sich die Geraden; geht sie nicht auf,
          sind sie windschief.</li>
        </ol>

        <h3>Beispiele</h3>

        <div class="example-box">
          <p class="ex-title">Punkte auf einer Geraden</p>
          <p>g: ${vname('x')} = ${vek([1, 3, -2])} + t · ${vek([2, -1, 3])}</p>
          <p>Für t = 2:&nbsp;1 + 2 · 2 = 5,&nbsp;3 + 2 · (−1) = 1,&nbsp;−2 + 2 · 3 = 4 –
          also <strong>P(5 | 1 | 4)</strong>.</p>
          <p>Für t = −1:&nbsp;1 − 2 = −1,&nbsp;3 + 1 = 4,&nbsp;−2 − 3 = −5 – also
          Q(−1 | 4 | −5). Negative Parameterwerte führen einfach in die andere Richtung.</p>
          <p>Der Stützpunkt (1 | 3 | −2) selbst gehört zu t = 0.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Gerade durch zwei Punkte – und eine Punktprobe, die scheitert</p>
          <p>A(2 | 1 | 4) und B(5 | 3 | 1). Richtungsvektor: ${vname('AB')} = B − A = (3 | 2 | −3).</p>
          <p>g: ${vname('x')} = ${vek([2, 1, 4])} + t · ${vek([3, 2, -3])}</p>
          <p>Liegt D(8 | 5 | 0) auf g? Zeile 1: 2 + 3t = 8, also t = 2. Zeile 2: 1 + 2 · 2 = 5 ✓.
          Zeile 3: 4 + 2 · (−3) = −2, verlangt ist aber 0.</p>
          <p><strong>D liegt nicht auf g.</strong> Zwei Zeilen haben gepasst – das genügt eben
          nicht.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Spurpunkt mit der x<sub>1</sub>x<sub>2</sub>-Ebene</p>
          <p>g: ${vname('x')} = ${vek([4, -1, 6])} + t · ${vek([1, 2, -3])}</p>
          <p>Auf der x<sub>1</sub>x<sub>2</sub>-Ebene ist die dritte Koordinate null:
          6 + t · (−3) = 0, also t = 2.</p>
          <p>Einsetzen: 4 + 2 · 1 = 6,&nbsp;−1 + 2 · 2 = 3,&nbsp;dritte Koordinate 0.</p>
          <p>Der Spurpunkt ist <strong>S(6 | 3 | 0)</strong>.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Zwei Geraden, die sich schneiden</p>
          <p>g: ${vname('x')} = ${vek([2, -3, 3])} + t · ${vek([1, 2, -1])}&nbsp;und&nbsp;h: ${vname('x')} = ${vek([7, 1, -4])} + s · ${vek([-1, 1, 2])}</p>
          <p>Richtungsvektoren: −1 : 1 = −1, aber 1 : 2 = ½ – keine Vielfachen. Also gleichsetzen:</p>
          <p>I: 2 + t = 7 − s<br>II: −3 + 2t = 1 + s<br>III: 3 − t = −4 + 2s</p>
          <p>Aus I: t = 5 − s. In II: −3 + 2 · (5 − s) = 1 + s, also 7 − 2s = 1 + s, also
          3s = 6, also s = 2 und damit t = 3.</p>
          <p>Probe in III: 3 − 3 = 0 und −4 + 2 · 2 = 0 ✓. Die Geraden schneiden sich; t = 3 in
          g eingesetzt ergibt den <strong>Schnittpunkt S(5 | 3 | 0)</strong>.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Die beiden Drohnen aus dem Einstieg</p>
          <p>A: ${vek([1, 2, 3])} + t · ${vek([2, 1, 1])}&nbsp;und&nbsp;B: ${vek([4, 5, 3])} + s · ${vek([1, -1, 2])}</p>
          <p>1 : 2 = ½, aber (−1) : 1 = −1 – keine Vielfachen, also gleichsetzen:</p>
          <p>I: 1 + 2t = 4 + s<br>II: 2 + t = 5 − s<br>III: 3 + t = 3 + 2s</p>
          <p>Aus II: t = 3 − s. In I: 1 + 2 · (3 − s) = 4 + s, also 7 − 2s = 4 + s, also
          3s = 3, also s = 1 und t = 2.</p>
          <p>Probe in III: 3 + 2 = 5 und 3 + 2 · 1 = 5 ✓. Die Bahnen kreuzen sich in
          S(5 | 4 | 5).</p>
          <p><strong>Zusammenstoß gibt es trotzdem keinen:</strong> Drohne A ist dort nach
          t = 2 Sekunden, Drohne B schon nach s = 1 Sekunde. Sie passieren denselben Punkt im
          Abstand einer Sekunde. Ein Zusammenstoß verlangt denselben Ort <em>und</em> dieselbe
          Zeit, also t = s.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Eine fehlende Zahl bestimmen</p>
          <p>g: ${vname('x')} = ${vek([1, 1, 1])} + t · ${vek([2, 1, 3])}&nbsp;und&nbsp;h: ${vname('x')} = ${vek([4, 'a', 6])} + s · ${vek([1, -1, 1])}. Für welches a schneiden
          sich die beiden?</p>
          <p>In den Zeilen 1 und 3 kommt a nicht vor – dort lässt sich rechnen:</p>
          <p>I: 1 + 2t = 4 + s<br>III: 1 + 3t = 6 + s</p>
          <p>III minus I: t = 2. Aus I: s = 1 + 2 · 2 − 4 = 1.</p>
          <p>Jetzt Zeile II: 1 + 2 · 1 = a + 1 · (−1), also 3 = a − 1 und damit
          <strong>a = 4</strong>. Für jedes andere a sind die Geraden windschief.</p>
        </div>

        <div class="achtung-box">
          <p class="achtung-title">Zwei Zeilen genügen nie</p>
          <p>Beim Gleichsetzen entstehen drei Gleichungen für nur zwei Unbekannte. Zwei davon
          legen t und s schon fest – die dritte ist keine Fleißaufgabe, sondern die Entscheidung.
          Wer sie weglässt, erklärt windschiefe Geraden zu schneidenden.</p>
          <p><strong>Gegenbeispiel:</strong> g: ${vname('x')} = ${vek([1, 2, 3])} + t · ${vek([2, 1, 1])}
          und h: ${vname('x')} = ${vek([4, 5, 5])} + s · ${vek([1, -1, 2])}</p>
          <p>I: 1 + 2t = 4 + s<br>II: 2 + t = 5 − s<br>III: 3 + t = 5 + 2s</p>
          <p>Aus II: t = 3 − s. In I eingesetzt: 7 − 2s = 4 + s, also s = 1 und t = 2. Beide
          Zeilen gehen auf – und wer jetzt aufhört, notiert einen „Schnittpunkt“.</p>
          <p>Probe in III: links 3 + 2 = 5, rechts 5 + 2 · 1 = 7. Und 5 ≠ 7.</p>
          <p>Man sieht es auch am Punkt selbst: t = 2 führt auf g zu (5 | 4 | 5), s = 1 führt auf
          h zu (5 | 4 | 7). Zwei verschiedene Punkte, zwei Meter übereinander. Die Geraden sind
          <strong>windschief</strong> – sie laufen aneinander vorbei.</p>
        </div>

        <div class="selbstcheck">
          <p class="box-title">Selbstcheck</p>
          <details><summary>Beschreiben ${vek([1, 2, 0])} + t · ${vek([2, -1, 3])} und ${vek([3, 1, 3])} + t · ${vek([-4, 2, -6])} dieselbe Gerade?</summary>
          <p>Ja. Der zweite Richtungsvektor ist das (−2)-fache des ersten, und der zweite
          Stützpunkt (3 | 1 | 3) gehört zur ersten Geraden (t = 1). Beide Bestandteile einer
          Geradengleichung dürfen ausgetauscht werden – die Gerade bleibt dieselbe.</p></details>
          <details><summary>Was bedeutet t = 0, und warum darf t auch 0,5 sein?</summary>
          <p>t = 0 liefert den Stützpunkt. Und t durchläuft alle reellen Zahlen, nicht nur ganze:
          t = 0,5 ist der Punkt in der Mitte zwischen Stützpunkt und dem Punkt zu t = 1. Ohne die
          Zwischenwerte wären es einzelne Punkte statt einer durchgehenden Geraden.</p></details>
          <details><summary>Zwei Geraden haben Richtungsvektoren, die keine Vielfachen voneinander sind. Müssen sie sich schneiden?</summary>
          <p>Nein. In der Ebene ja, im Raum nicht: Sie können auch windschief sein, also
          aneinander vorbeilaufen, ohne sich zu treffen. Genau deshalb muss man das
          Gleichungssystem wirklich lösen, statt aus den Richtungen zu schließen.</p></details>
          <details><summary>Liegt P(4 | 1 | 7) auf g: ${vname('x')} = ${vek([2, 3, 1])} + t · ${vek([1, -1, 3])}?</summary>
          <p>Zeile 1: 2 + t = 4, also t = 2. Zeile 2: 3 + 2 · (−1) = 1 ✓. Zeile 3:
          1 + 2 · 3 = 7 ✓. Alle drei Zeilen liefern dasselbe t – <strong>P liegt auf g</strong>,
          und zwar bei t = 2.</p></details>
          <details><summary>Wie unterscheidest du identische von echt parallelen Geraden?</summary>
          <p>Die Richtungsvektoren helfen nicht weiter – sie sind in beiden Fällen Vielfache
          voneinander. Entscheidend ist eine Punktprobe: Liegt der Stützpunkt der einen Geraden
          auf der anderen, sind sie identisch; sonst sind sie echt parallel.</p></details>
          <details><summary>Zwei Flugbahnen kreuzen sich. Warum ist das noch kein Zusammenstoß?</summary>
          <p>Weil beim Kreuzen nur die Orte übereinstimmen. Beim Zusammenstoß müssen beide zur
          gleichen Zeit dort sein, die beiden Parameter also denselben Wert haben. Ergibt die
          Rechnung t = 4 und s = 2, passiert der zweite Flugkörper den Punkt zwei Sekunden
          früher.</p></details>
        </div>
      `,

      gen(diff) {

        /* ============================================================
           Stufe 1 – Parameterform lesen, Punkte einsetzen,
           Gerade aus zwei Punkten
           ============================================================ */
        if (diff === 1) {
          const art = rnd(1, 6);

          if (art === 1) {
            const p = punktV(6), u = richtung(4);
            const t = choice([-3, -2, 2, 3, 4]);      // t = 0 und t = 1 stehen schon da
            const X = plusV(p, malV(t, u));
            return {
              q: `Gegeben ist die Gerade ${gleichung('g', p, u)}. Welcher Punkt gehört zum Parameterwert t = ${fmt(t)}? ${PUNKT_HINWEIS}`,
              type: 'input', placeholder: 'z. B. 3; −1; 5',
              check: orderedCheck(X), testAnswer: X.join('; '),
              answerText: punkt('P', X),
              solution: `t einsetzen und zeilenweise rechnen – jede Komponente für sich:${TRENN}${[0, 1, 2].map(i => punktZeile(p, u, t, i)).join(TRENN)}${TRENN}Der Punkt ist <strong>${punkt('P', X)}</strong>.`
            };
          }

          if (art === 2) {
            const A = punktV(7), d = richtung(5);
            const B = plusV(A, d);
            return {
              q: `Die Gerade g soll durch ${punkt('A', A)} und ${punkt('B', B)} verlaufen. Als Stützpunkt wird A genommen. Welche Komponenten hat dann der Richtungsvektor ${vname('AB')}? ${KOMP_HINWEIS}`,
              type: 'input', placeholder: 'z. B. 3; −1; 5',
              check: orderedCheck(d), testAnswer: d.join('; '),
              answerText: vek(d),
              solution: `Der Richtungsvektor ist der Verbindungsvektor der beiden Punkte, also Spitze minus Fuß:${TRENN}${[0, 1, 2].map(i => `${fmt(B[i])} − ${par(A[i])} = ${fmt(d[i])}`).join(TRENN)}${TRENN}${vname('AB')} = <strong>${vek(d)}</strong>, damit lautet eine Gleichung ${gleichung('g', A, d)}${TRENN}Probe: Für t = 1 kommt ${punkt('B', B)} heraus – B liegt also wirklich auf g.`
            };
          }

          if (art === 3) {
            const p = punktV(6), u = richtung(4);
            const t0 = choice([-4, -3, -2, 2, 3, 4]);
            const Q = plusV(p, malV(t0, u));
            return {
              q: `Der Punkt ${punkt('Q', Q)} liegt auf ${gleichung('g', p, u)}. Zu welchem Wert von t gehört er?`,
              type: 'input', placeholder: 't = ?',
              check: numCheck(t0), testAnswer: String(t0),
              answerText: `t = ${fmt(t0)}`,
              // Bei u₁ = 1 steht t nach dem Verschieben schon da – „t = 4, also
              // t = 4 : 1 = 4" wäre ein leerer Schritt. Die Seite schreibt
              // „2 + t = 4, also t = 2“. Bei u₁ = −1 bleibt das Teilen, dort
              // dreht es das Vorzeichen.
              solution: `Eine Zeile genügt, um t zu bestimmen – hier die erste:${TRENN}${u[0] === 1
                ? `${fmt(p[0])} + t = ${fmt(Q[0])}, also t = <strong>${fmt(t0)}</strong>`
                : `${fmt(p[0])} ${u[0] < 0 ? '−' : '+'} ${koef(Math.abs(u[0]), 't')} = ${fmt(Q[0])}${TRENN}${koef(u[0], 't')} = ${fmt(Q[0] - p[0])}, also t = ${fmt(Q[0] - p[0])} : ${par(u[0])} = <strong>${fmt(t0)}</strong>`}${TRENN}Probe in den beiden anderen Zeilen: ${punktZeile(p, u, t0, 1)} ✓ und ${punktZeile(p, u, t0, 2)} ✓`
            };
          }

          if (art === 4) {
            const p = punktV(6);
            // Mindestens eine ±1: Sonst stünde die gesuchte Zahl in jeder Zeile
            // fertig da und die Aufgabe wäre reines Abschreiben. Bei „− t“ muss
            // erst übersetzt werden, dass dort die Komponente −1 steht.
            const u = richtungMitEins(4);
            return {
              q: `Eine Gerade ist zeilenweise gegeben: ${koordZeile(p, u, 0)},&nbsp;${koordZeile(p, u, 1)},&nbsp;${koordZeile(p, u, 2)}. Welche Komponenten hat ihr Richtungsvektor? ${KOMP_HINWEIS}`,
              type: 'input', placeholder: 'z. B. 3; −1; 5',
              check: orderedCheck(u), testAnswer: u.join('; '),
              answerText: vek(u),
              solution: `Der Richtungsvektor steht bei t: In jeder Zeile ist es die Zahl, mit der t multipliziert wird. Steht dort gar keine Zahl, ist der Faktor 1 – bei einem Minuszeichen entsprechend −1.${TRENN}${[0, 1, 2].map(i => `${koordZeile(p, u, i)} ⇒ ${fmt(u[i])}`).join(TRENN)}${TRENN}${vname('u')} = <strong>${vek(u)}</strong>${TRENN}Die übrigen Zahlen bilden den Stützvektor ${vek(p)}.`
            };
          }

          if (art === 5) {
            const p = punktV(6), u = richtung(3);
            const k = choice([-3, -2, 2, 3]);
            const richtig = malV(k, u);
            /* Die Ablenker sind Umstellungen derselben drei Zahlen. Damit tragen
               alle vier Möglichkeiten exakt dieselben Beträge, dieselbe Summe und
               denselben größten Wert – es gibt kein Merkmal, an dem sich die
               richtige ohne Rechnung erkennen ließe. (Ablenker mit veränderten
               Zahlen hatten dieses Merkmal: Die richtige Antwort war dann nie die
               auffällig größte, und wer die größte strich, ratete besser.)
               Eine Umstellung ist nie ein Vielfaches von u: Sie hat dieselbe
               Summe und dieselbe Länge wie k · u, müsste also k · u selbst sein –
               und die Komponenten sind paarweise verschieden. */
            const UMSTELLUNGEN = [[1, 0, 2], [0, 2, 1], [2, 1, 0], [1, 2, 0], [2, 0, 1]];
            const ablenker = shuffle(UMSTELLUNGEN).map(o => vek(o.map(i => richtig[i])));
            // Bewusst ohne Gründe: Eine Umstellung entsteht aus keinem benennbaren
            // Fehler, und „hier sind zwei Komponenten vertauscht“ nennte die Lösung.
            const mc = makeChoice(vek(richtig), ablenker);
            return {
              q: `Gegeben ist ${gleichung('g', p, u)}. Welcher dieser Vektoren ist ebenfalls ein Richtungsvektor von g?`,
              type: 'choice', options: mc.options, correct: mc.correct,
              answerText: vek(richtig),
              solution: `Richtungsvektor ist jedes Vielfache von ${vname('u')} = ${vek(u)} – die Gerade zeigt in dieselbe Richtung, egal wie lang der Pfeil ist.${TRENN}${[0, 1, 2].map(i => `${fmt(u[i])} · ${par(k)} = ${fmt(richtig[i])}`).join(', ')}${TRENN}Also ist <strong>${vek(richtig)}</strong> = ${fmt(k)} · ${vname('u')}.${TRENN}Die anderen enthalten dieselben drei Zahlen, nur in anderer Reihenfolge. Das genügt nicht: Der Faktor muss <em>Zeile für Zeile</em> derselbe sein – die erste Komponente gehört zur ersten, die zweite zur zweiten.`
            };
          }

          const A = punktV(6), d = richtung(4);
          const B = plusV(A, d);
          const t = choice([-2, 2, 3]);               // t = 0 wäre A, t = 1 wäre B
          const X = plusV(A, malV(t, d));
          return {
            q: `Die Gerade g verläuft durch ${punkt('A', A)} und ${punkt('B', B)}; sie wird mit A als Stützpunkt und ${vname('AB')} als Richtungsvektor beschrieben. Welcher Punkt gehört zu t = ${fmt(t)}? ${PUNKT_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(X), testAnswer: X.join('; '),
            answerText: punkt('P', X),
            solution: `Erst den Richtungsvektor, dann einsetzen.${TRENN}${vname('AB')} = ${vek(B)} − ${vek(A)} = ${vek(d)}${TRENN}${gleichung('g', A, d)}${TRENN}${[0, 1, 2].map(i => punktZeile(A, d, t, i)).join(TRENN)}${TRENN}Der Punkt ist <strong>${punkt('P', X)}</strong>.`
          };
        }

        /* ============================================================
           Stufe 2 – Punktprobe, Spurpunkte, Parallelität
           ============================================================ */
        if (diff === 2) {
          const art = rnd(1, 5);

          if (art === 1) {
            const p = punktV(6), u = richtung(4);
            /* Nur in einem Viertel der Fälle liegt P nicht auf g. Bei der Hälfte
               wäre „Nein“ eine Strategie, die ohne jede Rechnung 50 % holt – bei
               vier Antwortmöglichkeiten ist ein Viertel genau die Ratequote. */
            const liegt = rnd(1, 4) !== 1;
            const t0 = choice([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
            const P = plusV(p, malV(t0, u));
            /* Wert im Abstand `abstand` von `start`, niemals 0 – „Ja, für t = 0“
               wäre der einzige Wert, den man ohne Rechnung ausschließen kann.
               Das gilt nur für die Werte aus `weg`: Im Fall „Nein“ steht auch
               t₀ + versatz zur Wahl, den die verrückte Zeile wirklich liefert, und
               der ist gelegentlich 0 (gemessen in 12 % der Fälle „Nein“, rund 3 % aller
               Punktprobe-Aufgaben). Ihn zu
               verschieben, änderte die Aufgabe; er bleibt. */
            const weg = (start, seite, abstand) => {
              const x = start + seite * abstand;
              return x === 0 ? start + seite * (abstand + 1) : x;
            };
            let versatz = 0, zeile = -1;
            if (!liegt) {
              zeile = rnd(0, 2);
              versatz = choice([-2, -1, 1, 2]);
              // Um ein Vielfaches von u verschieben: Dann liefert auch die
              // verrückte Zeile ein ganzzahliges t – nur eben ein anderes.
              P[zeile] += versatz * u[zeile];
            }
            const jaText = x => `Ja, für t = ${fmt(x)}.`;
            const NEIN = 'Nein, P liegt nicht auf g.';
            let richtig, ablenker, gruende;
            if (liegt) {
              /* Ein naher (Abstand 1–2) und ein ferner (4–7) Ablenker – dieselbe
                 Bauart wie im Fall „Nein“, wo der nahe Wert aus der verrückten
                 Zeile stammt. Und der Rang des richtigen Wertes wird ausgewürfelt:
                 Mit festen Ablenkern t ± 1, t ± 2 stand er zu 55 % in der Mitte,
                 „nimm den mittleren“ wäre also eine Strategie ohne Rechnung. */
              const rang = rnd(0, 2);
              const seiten = rang === 0 ? [1, 1] : rang === 2 ? [-1, -1]
                : (rnd(0, 1) === 1 ? [1, -1] : [-1, 1]);
              richtig = jaText(t0);
              ablenker = [jaText(weg(t0, seiten[0], choice([1, 2]))), jaText(weg(t0, seiten[1], rnd(4, 7))),
                NEIN, jaText(weg(t0, 1, 9))];
              // Die anderen t-Werte sind Füllwerte, zu denen keine Zeile passt.
              gruende = [null, null, 'Hier liefern alle drei Zeilen denselben Wert für t.', null];
            } else {
              richtig = NEIN;
              ablenker = shuffle([jaText(t0), jaText(t0 + versatz), jaText(weg(t0, choice([-1, 1]), rnd(4, 7)))]);
              // Zwei Zeilen liefern t0, die verrückte Zeile t0 + versatz; der ferne Wert ist Füllwert.
              const grundJe = {
                [jaText(t0)]: `Für t = ${fmt(t0)} gehen nur zwei der drei Zeilen auf – zwei Zeilen genügen nicht.`,
                [jaText(t0 + versatz)]: `Den Wert t = ${fmt(t0 + versatz)} liefert nur Zeile ${ROEM[zeile]} – eine Zeile genügt nicht.`
              };
              gruende = ablenker.map(x => grundJe[x] || null);
            }
            const mc = makeChoice(richtig, ablenker, gruende);
            const zeilen = [0, 1, 2].map(i =>
              `${fmt(p[i])} ${u[i] < 0 ? '−' : '+'} ${koef(Math.abs(u[i]), 't')} = ${fmt(P[i])} ⇒ t = ${fmt((P[i] - p[i]) / u[i])}`);
            return {
              q: `Liegt der Punkt ${punkt('P', P)} auf der Geraden ${gleichung('g', p, u)}?`,
              type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
              answerText: richtig,
              solution: `Punktprobe: In jeder Zeile muss dasselbe t herauskommen.${TRENN}${zeilen.join(TRENN)}${TRENN}`
                + (liegt
                  ? `Alle drei Zeilen liefern denselben Wert – <strong>P liegt auf g</strong>, und zwar zu t = ${fmt(t0)}.`
                  : `Zeile ${ROEM[zeile]} liefert t = ${fmt(t0 + versatz)}, die beiden anderen t = ${fmt(t0)}. Es gibt kein t, das alle drei Zeilen erfüllt: <strong>P liegt nicht auf g</strong>. Wer nur eine Zeile prüft, fällt genau hier herein.`)
            };
          }

          if (art === 2) {
            const p = punktV(6), u = richtung(4);
            const t0 = choice([-3, -2, 2, 3, 4]);
            const X = plusV(p, malV(t0, u));
            const pos = rnd(0, 2);
            const bekannt = [0, 1, 2].filter(i => i !== pos);
            const gezeigt = X.map((k, i) => i === pos ? 'a' : k);
            return {
              q: `Der Punkt ${punkt('P', gezeigt)} liegt auf ${gleichung('g', p, u)}. Bestimme a.`,
              type: 'input', placeholder: 'a = ?',
              check: numCheck(X[pos]), testAnswer: String(X[pos]),
              answerText: `a = ${fmt(X[pos])}`,
              solution: `In Zeile ${ROEM[pos]} steht die Unbekannte – also zuerst t aus einer der beiden anderen Zeilen bestimmen.${TRENN}Zeile ${ROEM[bekannt[0]]}: ${fmt(p[bekannt[0]])} ${u[bekannt[0]] < 0 ? '−' : '+'} ${koef(Math.abs(u[bekannt[0]]), 't')} = ${fmt(X[bekannt[0]])}, also t = ${fmt(t0)}${TRENN}Probe in Zeile ${ROEM[bekannt[1]]}: ${punktZeile(p, u, t0, bekannt[1])} ✓${TRENN}Jetzt t in Zeile ${ROEM[pos]} einsetzen: ${punktZeile(p, u, t0, pos)}${TRENN}a = <strong>${fmt(X[pos])}</strong>`
            };
          }

          if (art === 3) {
            /* Zwei Einkleidungen derselben Rechnung – die abstrakte und die
               Landung einer Drohne. Der Spurpunkt ist DAS Verfahren dieser Stufe;
               wer ihn nur abstrakt übt, erkennt ihn in der Sachaufgabe nicht
               wieder (und umgekehrt). */
            if (rnd(1, 3) === 1) {
              const u3 = choice([-2, -3, -4, -5]);
              const t0 = choice([2, 3, 4]);
              const u = [rndNonZero(-4, 4), rndNonZero(-4, 4), u3];
              const D = [rndNonZero(-9, 9), rndNonZero(-9, 9), 0];
              const p = minusV(D, malV(t0, u));
              return {
                q: `Eine Drohne fliegt geradlinig: Nach t Sekunden ist sie im Punkt ${vname('x')} = ${vek(p)} + t · ${vek(u)}. Alle Angaben sind Meter, die dritte Zahl ist die Höhe über dem Boden. In welchem Punkt setzt sie auf dem Boden auf? ${PUNKT_HINWEIS}`,
                type: 'input', placeholder: 'z. B. 3; −1; 0',
                check: orderedCheck(D), testAnswer: D.join('; '),
                answerText: punkt('S', D),
                solution: `Auf dem Boden ist die Höhe null – das ist der Spurpunkt mit der x<sub>1</sub>x<sub>2</sub>-Ebene.${TRENN}Dritte Zeile null setzen: ${fmt(p[2])} ${u[2] < 0 ? '−' : '+'} ${koef(Math.abs(u[2]), 't')} = 0, also t = ${fmt(t0)}${TRENN}Die Drohne ist demnach nach ${fmt(t0)} ${plural(t0, 'Sekunde', 'Sekunden')} unten. Jetzt t einsetzen:${TRENN}${[0, 1, 2].map(i => punktZeile(p, u, t0, i)).join(TRENN)}${TRENN}Sie setzt in <strong>${punkt('S', D)}</strong> auf.`
              };
            }
            const ebene = rnd(0, 2);
            const u = richtung(4);
            const t0 = choice([-3, -2, 2, 3]);
            const D = [0, 1, 2].map(i => i === ebene ? 0 : rndNonZero(-6, 6));
            const p = minusV(D, malV(t0, u));
            const NAMEN = ['x<sub>2</sub>x<sub>3</sub>', 'x<sub>1</sub>x<sub>3</sub>', 'x<sub>1</sub>x<sub>2</sub>'];
            return {
              q: `In welchem Punkt durchstößt ${gleichung('g', p, u)} die ${NAMEN[ebene]}-Ebene? ${PUNKT_HINWEIS}`,
              type: 'input', placeholder: 'z. B. 3; −1; 0',
              check: orderedCheck(D), testAnswer: D.join('; '),
              answerText: punkt('S', D),
              solution: `Auf der ${NAMEN[ebene]}-Ebene ist die Koordinate x<sub>${ebene + 1}</sub> null. Also Zeile ${ROEM[ebene]} null setzen:${TRENN}${fmt(p[ebene])} ${u[ebene] < 0 ? '−' : '+'} ${koef(Math.abs(u[ebene]), 't')} = 0${TRENN}${u[ebene] === 1 ? `t = ${fmt(t0)}` : `${koef(u[ebene], 't')} = ${fmt(-p[ebene])}, also t = ${fmt(t0)}`}${TRENN}t einsetzen:${TRENN}${[0, 1, 2].map(i => punktZeile(p, u, t0, i)).join(TRENN)}${TRENN}Der Spurpunkt ist <strong>${punkt('S', D)}</strong>.`
            };
          }

          if (art === 4) {
            const u = richtung(3);
            const parallel = rnd(1, 4) !== 1;         // wieder ein Viertel „Nein“
            const k = choice([-3, -2, 2, 3]);
            let v;
            if (parallel) v = malV(k, u);
            else {
              let w;
              do { w = richtung(3); } while (kollinear(u, w));
              v = malV(choice([-3, -2, 2, 3]), w);    // gleiche Bauart, gleiche Größe
            }
            const p = punktV(6);
            let q;
            do { q = punktV(6); } while (kollinear(u, minusV(q, p)));   // nicht identisch
            // Auch hier gilt: „1 · u“ und „−1 · u“ schreibt niemand.
            const jaText = x => `Ja – ${vname('v')} = ${x === 1 ? vname('u')
              : x === -1 ? `−${vname('u')}` : `${fmt(x)} · ${vname('u')}`}.`;
            const NEIN = `Nein – ${vname('v')} ist kein Vielfaches von ${vname('u')}.`;
            const richtig = parallel ? jaText(k) : NEIN;
            /* Im Fall „nicht parallel“ müssen die angebotenen Faktoren die
               enthalten, die beim Prüfen EINER Zeile herauskommen. Fehlte der
               eigene Zwischenwert in der Liste, wäre schon an diesem Fehlen zu
               sehen, dass „Nein“ richtig ist – ohne die beiden anderen Zeilen zu
               rechnen. Gemessen an einem Beispiel: Die Zeilen lieferten 3, −3, 3,
               angeboten waren 2, −2 und −3. */
            const eigene = parallel ? [] : [...new Set([0, 1, 2].map(i => v[i] / u[i]).filter(Number.isInteger))];
            const andere = [...shuffle(eigene),
              ...shuffle([-3, -2, 2, 3].filter(x => x !== k && !eigene.includes(x)))];
            const ablenker = parallel
              ? [jaText(andere[0]), jaText(andere[1]), NEIN, jaText(andere[2])]
              : [jaText(andere[0]), jaText(andere[1]), jaText(andere[2]), jaText(andere[3])];
            /* Einen Grund bekommt ein falscher Faktor nur, wenn ihn eine oder zwei
               Zeilen wirklich liefern – der Fehler, nicht alle drei zu prüfen. Zu den
               übrigen passt keine Zeile; auch −k bleibt still, denn „Vorzeichen
               verdreht" zeigte bei vier Ja-Optionen direkt auf die Lösung. */
            const faktorGrund = x => {
              const z = [0, 1, 2].filter(i => v[i] === x * u[i]);
              if (z.length === 1) return `Den Faktor ${fmt(x)} liefert nur Zeile ${ROEM[z[0]]} – eine Zeile genügt nicht.`;
              if (z.length === 2) return `Den Faktor ${fmt(x)} liefern nur die Zeilen ${ROEM[z[0]]} und ${ROEM[z[1]]} – zwei Zeilen genügen nicht.`;
              return null;
            };
            const gruende = parallel
              ? [null, null, 'Hier ergibt jede der drei Zeilen denselben Faktor.', null]
              : andere.slice(0, 4).map(faktorGrund);
            const mc = makeChoice(richtig, ablenker, gruende);
            return {
              q: `Verlaufen die beiden Geraden parallel?<br>${gleichung('g', p, u)}<br>${gleichung('h', q, v, 's')}`,
              type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
              answerText: richtig,
              solution: `Für die Parallelität zählen allein die Richtungsvektoren – die Stützpunkte spielen keine Rolle. Gesucht ist eine Zahl k mit ${vname('v')} = k · ${vname('u')}, und zwar in allen drei Zeilen:${TRENN}${[0, 1, 2].map(i => `${fmt(v[i])} : ${par(u[i])} = ${quot(v[i], u[i])}`).join(', ')}${TRENN}`
                + (parallel
                  ? `Dreimal derselbe Faktor: ${vname('v')} = ${fmt(k)} · ${vname('u')}, die Geraden sind <strong>parallel</strong>. (Sie sind nicht identisch – der Stützpunkt ${punkt('Q', q)} von h liegt nicht auf g.)`
                  : `Die Faktoren sind verschieden, ${vname('v')} ist also kein Vielfaches von ${vname('u')}: Die Geraden sind <strong>nicht parallel</strong>. Ob sie sich schneiden oder windschief sind, entscheidet dann erst das Gleichungssystem.`)
            };
          }

          const p = punktV(6), u = richtung(4);
          /* Die vier Parameterwerte kommen aus demselben Vorrat, der richtige ist
             einer davon. Wären die Ablenker t ± 1 und t ± 2, läge der gesuchte
             Punkt der Größe nach fast immer in der Mitte: Wer die beiden
             äußersten streicht, käme dann ohne Rechnung auf 42 % (gemessen). */
          const tVorrat = shuffle([-4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 4);
          const t0 = tVorrat[rnd(0, 3)];
          const richtigP = plusV(p, malV(t0, u));
          /* Die drei Ablenker gehören zu den anderen t-Werten, bei denen EINE
             Koordinate um ein Vielfaches von u verschoben ist. Sie liegen damit
             genauso dicht an der Geraden wie der richtige Punkt. */
          const kandidaten = [], verrueckt = [];
          for (const tt of tVorrat.filter(x => x !== t0)) {
            const P2 = plusV(p, malV(tt, u));
            const z = rnd(0, 2);
            P2[z] += choice([-2, -1, 1, 2]) * u[z];
            kandidaten.push(P2);
            verrueckt.push([tt, z]);
          }
          const tWerte = X => [0, 1, 2].map(i => fmt((X[i] - p[i]) / u[i])).join(', ');
          const ablenkerTexte = [], ablenkerGruende = [];
          kandidaten.forEach((K, m) => {
            const txt = koordText(K);
            if (txt === koordText(richtigP) || ablenkerTexte.includes(txt)) return;
            // Zwei Zeilen liefern tt, die verrückte Zeile z einen anderen Wert.
            const [tt, z] = verrueckt[m];
            ablenkerTexte.push(txt);
            ablenkerGruende.push(`Hier liefern zwei Zeilen t = ${fmt(tt)}, Zeile ${ROEM[z]} aber t = ${fmt((K[z] - p[z]) / u[z])} – zwei Zeilen genügen nicht.`);
          });
          const mc = makeChoice(koordText(richtigP), ablenkerTexte, ablenkerGruende);
          const alle = [richtigP, ...kandidaten];
          const zeilen = mc.options.map(o => {
            const X = alle.find(K => koordText(K) === o);
            return `${o}: t = ${tWerte(X)}${X === richtigP ? ' – dreimal gleich ✓' : ' ✗'}`;
          });
          return {
            q: `Welcher dieser vier Punkte liegt auf der Geraden ${gleichung('g', p, u)}?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende,
            answerText: koordText(richtigP),
            solution: `Für jeden Punkt zeilenweise t bestimmen. Nur wenn alle drei Zeilen denselben Wert liefern, liegt er auf g.${TRENN}${zeilen.join(TRENN)}${TRENN}Auf g liegt <strong>${koordText(richtigP)}</strong> mit t = ${fmt(t0)}.`
          };
        }

        /* ============================================================
           Stufe 3 – die vier Lagen zweier Geraden
           ============================================================ */
        const art = rnd(1, 6);

        if (art === 1 || art === 2) {
          // Der Kern des Themas, deshalb doppelt gewichtet. Die vier Lagen werden
          // gleich häufig gezogen: Bei vier Antwortmöglichkeiten ist Raten damit
          // genau ein Viertel wert, und keine Lage wird zur bequemen Standardwahl.
          const ziel = choice(['identisch', 'parallel', 'schneidend', 'windschief']);
          const { p, u, q, v, info } = lagePaar(ziel);
          const OPTIONEN = [
            'Sie sind identisch.',
            'Sie sind echt parallel.',
            'Sie schneiden sich in genau einem Punkt.',
            'Sie sind windschief.'
          ];
          const index = { identisch: 0, parallel: 1, schneidend: 2, windschief: 3 }[info.art];
          /* Gründe je tatsächlicher Lage, in der Reihenfolge der OPTIONEN. Jeder
             nennt den Schritt, an dem die gewählte Lage scheitert, ohne dessen
             Ergebnis vorwegzunehmen: Bei „identisch statt echt parallel“ steht die
             Bedingung der Punktprobe da, nicht ihr Ausgang. */
          const nichtVielfach = [
            'Identisch können die Geraden nicht sein: Ihre Richtungsvektoren sind keine Vielfachen voneinander.',
            'Parallel wären die Geraden nur, wenn die Richtungsvektoren in allen drei Zeilen denselben Faktor ergäben.'
          ];
          const vielfach = [
            'Die Richtungsvektoren sind Vielfache voneinander – dann gibt es nie genau einen Schnittpunkt.',
            'Die Richtungsvektoren sind Vielfache voneinander – windschiefe Geraden haben nie parallele Richtungen.'
          ];
          const LAGE_GRUND = {
            identisch: [null, 'Ein anderer Stützpunkt macht noch keine andere Gerade – ob er auf g liegt, entscheidet die Punktprobe.', ...vielfach],
            parallel: ['Identisch sind die Geraden nur, wenn der Stützpunkt von h auf g liegt – mit demselben Faktor in allen drei Zeilen.', null, ...vielfach],
            schneidend: [...nichtVielfach, null, 'Nicht parallel heißt im Raum noch nicht windschief – das entscheidet erst das Gleichungssystem.'],
            // „meist“: Bei rund einem Viertel der windschiefen Paare ist ein Zeilenpaar singulär.
            windschief: [...nichtVielfach, 'Zwei Zeilen liefern meist schon ein t und ein s – ob sie passen, entscheidet erst die dritte Zeile.', null]
          };
          return {
            q: `Wie liegen die beiden Geraden zueinander?<br>${gleichung('g', p, u)}<br>${gleichung('h', q, v, 's')}`,
            type: 'choice', options: OPTIONEN, correct: index, gruende: LAGE_GRUND[info.art],
            answerText: OPTIONEN[index],
            solution: lageWeg(p, u, q, v, info)
          };
        }

        if (art === 3) {
          const { p, u, q, v, info } = lagePaar('schneidend');
          return {
            q: `Die Geraden g und h schneiden sich. Berechne den Schnittpunkt.<br>${gleichung('g', p, u)}<br>${gleichung('h', q, v, 's')} ${PUNKT_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(info.S), testAnswer: info.S.join('; '),
            answerText: punkt('S', info.S),
            solution: lageWeg(p, u, q, v, info)
          };
        }

        if (art === 4) {
          /* Rückwärts gebaut: erst ein schneidendes Paar, dann wird genau die
             Koordinate durch a ersetzt, die beim Lösen NICHT gebraucht wird. So
             bleiben zwei Zeilen rechenbar, und die dritte legt a fest. */
          const { p, u, q, v, info } = lagePaar('schneidend');
          const gezeigt = q.map((k, i) => i === info.k ? 'a' : k);
          const links = p[info.k] + info.t * u[info.k];
          return {
            q: `Für welchen Wert von a schneiden sich die beiden Geraden?<br>${gleichung('g', p, u)}<br>${gleichung('h', gezeigt, v, 's')}`,
            type: 'input', placeholder: 'a = ?',
            check: numCheck(q[info.k]), testAnswer: String(q[info.k]),
            answerText: `a = ${fmt(q[info.k])}`,
            solution: `In Zeile ${ROEM[info.k]} steht die Unbekannte. Die beiden anderen Zeilen kommen ohne a aus – aus ihnen lassen sich t und s bestimmen. Gleichsetzen:${TRENN}${[info.i, info.j].slice().sort((x, y) => x - y).map(z => `${ROEM[z]}: ${lgsZeile(p, u, q, v, z)}`).join(TRENN)}${TRENN}${zeilenLoesen(p, u, q, v, info).join(TRENN)}${TRENN}Damit sich die Geraden wirklich schneiden, muss auch Zeile ${ROEM[info.k]} aufgehen:${TRENN}${fmt(p[info.k])} + ${par(info.t)} · ${par(u[info.k])} = a + ${par(info.s)} · ${par(v[info.k])}${TRENN}${fmt(links)} = a ${info.s * v[info.k] < 0 ? '−' : '+'} ${fmt(Math.abs(info.s * v[info.k]))}${TRENN}a = <strong>${fmt(q[info.k])}</strong>${TRENN}Für jeden anderen Wert von a sind die beiden Geraden windschief.`
          };
        }

        if (art === 5) {
          const u = richtung(3);
          /* Die gesuchte Zahl ist k · u[pos]. Aus |k| ∈ {2, 3} und |u| ∈ {1, 2, 3}
             entsteht die 6 auf zwei Wegen (2 · 3 und 3 · 2), jede andere Zahl nur
             auf einem – ohne Gegensteuern wäre jede dritte Antwort eine 6.
             Die halbe Ablehnung der 6er-Fälle macht die fünf möglichen Beträge
             gleich häufig (gemessen 33 % → 20 %). */
          let k, pos;
          do { k = choice([-3, -2, 2, 3]); pos = rnd(0, 2); }
          while (Math.abs(k * u[pos]) === 6 && rnd(1, 2) === 1);
          const v = malV(k, u);
          const bekannt = [0, 1, 2].filter(i => i !== pos);
          const gezeigt = v.map((x, i) => i === pos ? 'a' : x);
          const p = punktV(6);
          let q;
          do { q = punktV(6); } while (kollinear(u, minusV(q, p)));
          return {
            q: `Für welchen Wert von a sind die beiden Geraden parallel?<br>${gleichung('g', p, u)}<br>${gleichung('h', q, gezeigt, 's')}`,
            type: 'input', placeholder: 'a = ?',
            check: numCheck(v[pos]), testAnswer: String(v[pos]),
            answerText: `a = ${fmt(v[pos])}`,
            solution: `Parallel heißt: ${vname('v')} = k · ${vname('u')} in allen drei Zeilen. Der Faktor k lässt sich aus einer Zeile ohne a ablesen.${TRENN}Zeile ${ROEM[bekannt[0]]}: ${fmt(v[bekannt[0]])} : ${par(u[bekannt[0]])} = ${fmt(k)}${TRENN}Probe in Zeile ${ROEM[bekannt[1]]}: ${fmt(u[bekannt[1]])} · ${par(k)} = ${fmt(v[bekannt[1]])} ✓${TRENN}Jetzt Zeile ${ROEM[pos]}: a = ${fmt(u[pos])} · ${par(k)} = <strong>${fmt(v[pos])}</strong>${TRENN}Die Stützpunkte spielen dabei keine Rolle – sie entscheiden nur darüber, ob die Geraden echt parallel oder identisch sind. Hier liegt ${punkt('Q', q)} nicht auf g, also echt parallel.`
          };
        }

        const ausgang = choice(['treffen', 'kreuzen', 'windschief', 'parallel']);
        const { p, u, q, v, info } = bahnPaar(ausgang);
        const OPT = [
          'Ja, sie stoßen zusammen.',
          'Nein – die Bahnen kreuzen sich, aber die Drohnen sind dort zu verschiedenen Zeiten.',
          'Nein – die Bahnen kreuzen sich gar nicht, sie verlaufen windschief.',
          'Nein – die Bahnen sind parallel und treffen nie aufeinander.'
        ];
        const idx = info.art === 'parallel' ? 3
          : info.art === 'windschief' ? 2
            : info.t === info.s ? 0 : 1;
        const schluss = idx === 0
          ? `${TRENN}Beide Werte sind gleich: t = s = ${fmt(info.t)}. Die Drohnen sind zur selben Zeit am selben Ort – <strong>das ist ein Zusammenstoß</strong> nach ${fmt(info.t)} ${plural(info.t, 'Sekunde', 'Sekunden')} in ${punkt('S', info.S)}.`
          : idx === 1
            ? `${TRENN}Die Bahnen kreuzen sich in ${punkt('S', info.S)} – aber A ist dort nach t = ${fmt(info.t)} ${plural(info.t, 'Sekunde', 'Sekunden')}, B nach s = ${fmt(info.s)} ${plural(info.s, 'Sekunde', 'Sekunden')}. Verschiedene Zeiten, also <strong>kein Zusammenstoß</strong>. Für einen Zusammenstoß müsste t = s gelten.`
            : idx === 2
              ? `${TRENN}Die Bahnen haben nicht einmal einen gemeinsamen Punkt – <strong>kein Zusammenstoß</strong>.`
              : `${TRENN}Parallele Bahnen laufen immer im gleichen Abstand nebeneinander her – <strong>kein Zusammenstoß</strong>.`;
        /* Gründe je tatsächlichem Ausgang, in der Reihenfolge von OPT.
           „Zusammenstoß“ und „kreuzen“ tragen bei JEDEM Ausgang denselben Satz –
           die Bedingung, nicht welcher Teil davon scheitert. Ein Text je Ausgang
           („noch kein Zusammenstoß“ bei kreuzenden, „nicht nur in zweien“ bei
           windschiefen Bahnen) verriet sonst das Ergebnis der dritten Zeile, also
           genau die Rechnung, um die es geht. t = s passt zur Einkleidung: Beide
           Drohnen starten gleichzeitig, t und s zählen dieselbe Zeit.
           Die beiden übrigen Sätze hängen nur am ersten Schritt (Richtungen
           vergleichen), und dessen Ergebnis ist gerade der Einwand. */
        const nichtParallel = 'Die Richtungsvektoren sind keine Vielfachen voneinander – parallel sind die Bahnen also nicht.';
        const nichtWindschief = 'Nicht parallel heißt im Raum noch nicht windschief – das entscheidet erst das Gleichungssystem.';
        const zusammenstoss = 'Ein Zusammenstoß verlangt zweierlei: Das Gleichungssystem geht in allen drei Zeilen auf, und dabei ist t = s.';
        const kreuzen = 'Kreuzen zu verschiedenen Zeiten verlangt zweierlei: Das Gleichungssystem geht in allen drei Zeilen auf, und dabei ist t ≠ s.';
        const BAHN_GRUND = [
          [null, kreuzen, nichtWindschief, nichtParallel],
          [zusammenstoss, null, nichtWindschief, nichtParallel],
          [zusammenstoss, kreuzen, null, nichtParallel],
          [zusammenstoss, kreuzen, 'Windschief heißt mehr als „kein gemeinsamer Punkt“: Auch die Richtungsvektoren dürfen keine Vielfachen voneinander sein.', null]
        ];
        return {
          q: `Zwei Drohnen starten gleichzeitig. Drohne A ist nach t Sekunden im Punkt ${vname('x')} = ${vek(p)} + t · ${vek(u)}, Drohne B nach s Sekunden im Punkt ${vname('x')} = ${vek(q)} + s · ${vek(v)}. Alle Angaben in Metern. Stoßen die beiden zusammen?`,
          type: 'choice', options: OPT, correct: idx, gruende: BAHN_GRUND[idx],
          answerText: OPT[idx],
          solution: lageWeg(p, u, q, v, info, 'der Bahn von A', 'B', 'Bahnen', 'Startpunkt') + schluss
        };
      }
    };
  })();

  /* ============================================================
     Ebenen im Raum – viertes Thema der analytischen Geometrie.

     Baut auf `vektoren` (Ortsvektor, Verbindungsvektor, Betrag),
     `geraden` (Parameterform einer Geraden) und `skalarprodukt`
     (senkrecht heißt: Skalarprodukt null) auf.
     ============================================================ */
  const ebenen = (() => {

    /* ---------- Schreibweisen ---------- */

    const VAR = ['x₁', 'x₂', 'x₃'];
    const ACHSE = ['x₁-Achse', 'x₂-Achse', 'x₃-Achse'];
    const SPURNAME = ['S₁', 'S₂', 'S₃'];
    const KOORDEBENE = ['x₁x₂-Ebene', 'x₁x₃-Ebene', 'x₂x₃-Ebene'];
    const TRENN = '<br>';
    const PUNKT_HINWEIS = '<span class="hint">Gib die drei Koordinaten mit Semikolon getrennt ein, z. B. 3; −1; 5.</span>';
    const KOMP_HINWEIS = '<span class="hint">Gib die drei Komponenten mit Semikolon getrennt ein, z. B. 3; −1; 5.</span>';

    /* ---------- Vektor-Werkzeuge ---------- */

    const skalar = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const plusV = (a, b) => a.map((k, i) => k + b[i]);
    const minusV = (a, b) => a.map((k, i) => k - b[i]);
    const malV = (r, a) => a.map(k => r * k);
    const kreuz = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];

    /* Vektor durch seinen größten gemeinsamen Teiler kürzen und das Vorzeichen
       so drehen, dass die erste Komponente ungleich null positiv ist. Ohne diese
       Normierung wären „(2 | 4 | 4)“ und „(1 | 2 | 2)“ zwei Antworten auf
       dieselbe Frage. */
    function kuerzeVektor(v) {
      const g = gcd(gcd(v[0], v[1]), v[2]);
      const w = v.map(k => k / g);
      return w.find(k => k !== 0) < 0 ? w.map(k => -k) : w;
    }

    /** Zufallspunkt, alle Koordinaten ungleich null (sonst „+ 0“ in den Zeilen). */
    const punktOhneNull = max => [rndNonZero(-max, max), rndNonZero(-max, max), rndNonZero(-max, max)];

    /** Richtungs- oder Spannvektor: alle Komponenten ungleich null. */
    const richtungsVektor = max => punktOhneNull(max);

    /**
     * Normalenvektor für eine gut lesbare Koordinatenform: alle Komponenten
     * ungleich null, paarweise verschiedene Beträge, teilerfremd.
     * Die verschiedenen Beträge sind kein Schönheitswunsch: Nur dann ist eine
     * vertauschte Fassung von n wirklich ein anderer Vektor und taugt als
     * Ablenker – bei |n₁| = |n₂| wäre der „Ablenker“ dieselbe Ebene.
     */
    function normaleKlein(max = 4) {
      for (let i = 0; i < 300; i++) {
        const n = punktOhneNull(max);
        if (new Set(n.map(Math.abs)).size < 3) continue;
        if (gcd(gcd(n[0], n[1]), n[2]) !== 1) continue;
        return n;
      }
      return [1, 2, 3];
    }

    /* Normalenvektoren mit GANZZAHLIGEM Betrag. Nur mit ihnen geht der Abstand
       auf: |n| steht im Nenner der hesseschen Normalform. */
    const NORMALEN = [
      [1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11]
    ];
    const BETRAEGE = [...new Set(NORMALEN.map(t => t[3]))];

    /**
     * Erst den Betrag gleichverteilt ziehen, dann ein Tripel dazu – sonst kämen
     * die Beträge mit zwei Tripeln doppelt so oft vor wie die mit einem.
     * Reihenfolge und Vorzeichen werden gewürfelt; beides ändert |n| nicht.
     */
    function normaleMitBetrag() {
      const L = choice(BETRAEGE);
      const t = choice(NORMALEN.filter(x => x[3] === L));
      return [shuffle([t[0], t[1], t[2]]).map(k => k * choice([1, -1])), L];
    }

    /**
     * Ganzzahliger Punkt mit vorgegebenem Skalarprodukt: n · P = c.
     * Zwei Koordinaten werden gewürfelt, die dritte muss aufgehen – deshalb die
     * Teilbarkeitsprobe. Damit lassen sich Punkte in genau vorgegebenem Abstand
     * bauen, ohne blind zu suchen.
     */
    function punktMit(n, c, max) {
      const j = [0, 1, 2].find(i => n[i] !== 0);
      const rest = [0, 1, 2].filter(i => i !== j);
      for (let i = 0; i < 400; i++) {
        const P = [];
        P[rest[0]] = rndNonZero(-max, max);
        P[rest[1]] = rndNonZero(-max, max);
        const r = c - n[rest[0]] * P[rest[0]] - n[rest[1]] * P[rest[1]];
        if (r % n[j] !== 0) continue;
        P[j] = r / n[j];
        if (P[j] === 0 || Math.abs(P[j]) > max) continue;
        return P;
      }
      return null;
    }

    /**
     * Ganzzahliger Vektor, der auf m senkrecht steht: Komponenten aus −4 … 4,
     * höchstens eine davon null. Wird für die Lagebeziehung Gerade–Ebene
     * gebraucht – dort auch im schneidenden Fall, siehe die Begründung dort.
     */
    function senkrechteRichtung(m) {
      for (let i = 0; i < 4000; i++) {
        const w = [rnd(-4, 4), rnd(-4, 4), rnd(-4, 4)];
        if (w.every(c => c === 0)) continue;
        if (w.filter(c => c === 0).length > 1) continue;
        if (skalar(m, w) === 0) return w;
      }
      return null;
    }

    /* ---------- Textbausteine ---------- */

    /** Summe „2x₁ − 5x₂ + x₃“ aus Paaren [Koeffizient, Name]; Nullen fallen weg. */
    function termKette(paare) {
      let s = '';
      for (const [k, v] of paare) {
        if (k === 0) continue;
        if (!s) s = koef(k, v);
        else s += (k > 0 ? ' + ' : ' − ') + koef(Math.abs(k), v);
      }
      return s;
    }

    /** Linke Seite der Koordinatenform. */
    const linkeSeite = n => termKette([[n[0], VAR[0]], [n[1], VAR[1]], [n[2], VAR[2]]]);

    /** Ganze Koordinatenform „x₁ + 2x₂ + 2x₃ = 30“. */
    const ebeneForm = (n, d) => `${linkeSeite(n)} = ${fmt(d)}`;

    /** Bedingung „−3n₁ + 3n₂ + n₃“ für das Skalarprodukt mit einem Spannvektor. */
    const bedingung = w => termKette([[w[0], 'n₁'], [w[1], 'n₂'], [w[2], 'n₃']]);

    /**
     * Punkt in die linke Seite einsetzen:
     * „6 + 2 · 8 + 2 · 10 = 6 + 16 + 20 = 42“
     * Die Zwischenzeile entfällt, sobald ein Summand null wird – sonst stünde
     * dort ein „+ 0“, ein Schritt, der nichts tut.
     */
    function einsetzen(n, P, nur) {
      const idx = (nur || [0, 1, 2]).filter(i => n[i] !== 0);
      const term = idx.map((i, k) => {
        const a = Math.abs(n[i]);
        // Bei Koeffizient 1 entfällt der Faktor – außer die Koordinate ist null,
        // sonst bliebe ein einzelnes „+ 0“ stehen.
        const kern = (a === 1 && P[i] !== 0) ? par(P[i]) : `${fmt(a)} · ${par(P[i])}`;
        if (k === 0) return n[i] < 0 ? `−${kern}` : kern;
        return (n[i] < 0 ? ' − ' : ' + ') + kern;
      }).join('');
      const teile = idx.map(i => n[i] * P[i]);
      const summe = teile.reduce((a, b) => a + b, 0);
      // Sind alle Koeffizienten ±1, steht in der Zwischenzeile dasselbe wie in der
      // ersten – „2 + 1 − 3 = 2 + 1 − 3 = 0“ ist keine Rechnung, sondern eine
      // Wiederholung.
      const dopplung = idx.every(i => Math.abs(n[i]) === 1);
      const zwischen = (dopplung || teile.length < 2 || teile.some(t => t === 0)) ? '' : ' = ' + teile
        .map((w, k) => k === 0 ? fmt(w) : (w < 0 ? ` − ${fmt(-w)}` : ` + ${fmt(w)}`)).join('');
      return `${term}${zwischen} = ${fmt(summe)}`;
    }

    /** Gerade in Parameterform. */
    const geradeForm = (p, u) => `${vname('x')} = ${vek(p)} + t · ${vek(u)}`;

    /** Ebene in Parameterform. */
    const paramForm = (A, u, v) => `${vname('x')} = ${vek(A)} + r · ${vek(u)} + s · ${vek(v)}`;

    /** Quotient zweier Komponenten, gekürzt: „−6 : (−3) = 2“, „4 : 3 = 4/3“. */
    const quot = (z, n) => fracHTML(...reduce(z, n));

    /**
     * Normalenvektor aus zwei Spannvektoren – so, wie ihn die Seite im Beispiel
     * „Von drei Punkten zur Koordinatenform“ baut: eine Komponente eliminieren
     * (addieren oder subtrahieren, bei ungleichen Beträgen vorher vervielfachen
     * wie beim LGS mit I′ und II′), eine der beiden übrigen frei wählen, die
     * dritte aus einer Ausgangsgleichung. Vorher stand an dieser Stelle nur
     * „Aufgelöst ergibt sich n = …“: Der Weg kündigte die freie Wahl an und
     * übersprang sie.
     *
     * `n` ist das Ergebnis, das unter den Optionen steht; gewählt wird deshalb
     * genau dessen Komponente – bevorzugt eine 1 wie auf der Seite. Hat n dort
     * keine ±1 (knapp die Hälfte der Ziehungen), führte die Wahl 1 auf Brüche.
     * Das steht dann im Weg, samt dem Grund, warum man gleich den ganzzahligen
     * Wert nehmen darf. Kein Zufall: Welche Komponente wegfällt und welche frei
     * ist, entscheidet eine feste Rangfolge (wenig Vervielfachen, eine ±1 in n).
     * `bedingung` liefert die Zeilen „2n₁ + n₂ − 2n₃“.
     */
    function normalenWeg(u, v, n) {
      const N = ['n₁', 'n₂', 'n₃'];
      let wahl = null;
      for (const e of [0, 1, 2]) {
        const [x, y] = [0, 1, 2].filter(i => i !== e);
        const au = Math.abs(u[e]), av = Math.abs(v[e]);
        const aufwand = au === av ? 0 : (au % av === 0 || av % au === 0) ? 1 : 2;
        for (const [f, g] of [[x, y], [y, x]]) {
          const frei = n[f] === 1 ? 0 : n[f] === -1 ? 1 : n[f] > 0 ? 3 : 4;
          if (!wahl || aufwand + frei < wahl.rang) wahl = { e, f, g, rang: aufwand + frei };
        }
      }
      const { e, f, g } = wahl;
      // a · I ∓ b · II lässt n_e wegfallen.
      const ge = gcd(Math.abs(u[e]), Math.abs(v[e]));
      const a = Math.abs(v[e]) / ge, b = Math.abs(u[e]) / ge;
      const minus = Math.sign(u[e]) === Math.sign(v[e]);
      const c = [0, 1, 2].map(i => a * u[i] + (minus ? -b : b) * v[i]);
      const weg = [];
      if (a !== 1) weg.push(`I · ${fmt(a)} = I′:&nbsp;${bedingung(malV(a, u))} = 0`);
      if (b !== 1) weg.push(`II · ${fmt(b)} = II′:&nbsp;${bedingung(malV(b, v))} = 0`);
      /* c_f · n_f + c_g · n_g = 0. Beide Faktoren sind ungleich null: Wäre einer
         null, wäre es wegen n_f, n_g ≠ 0 auch der andere – dann wären u und v
         Vielfache voneinander. Gekürzt wird wie auf der Seite („8n₁ − 4n₃ = 0,
         also n₃ = 2n₁"). */
      const h = gcd(Math.abs(c[f]), Math.abs(c[g]));
      const cf = c[f] / h, cg = c[g] / h;
      const beziehung = Math.abs(cg) === 1
        ? `${N[g]} = ${koef(-cf * cg, N[f])}`
        : `${koef(Math.abs(cg), N[g])} = ${koef(-cf * Math.sign(cg), N[f])}`;
      weg.push(`${a === 1 ? 'I' : 'I′'} ${minus ? '−' : '+'} ${b === 1 ? 'II' : 'II′'}, damit ${N[e]} wegfällt:&nbsp;${bedingung(c)} = 0, also ${beziehung}`);
      const folgt = Math.abs(cg) === 1 ? `${N[g]} = ${fmt(n[g])}`
        : `${koef(Math.abs(cg), N[g])} = ${fmt(Math.abs(cg) * n[g])}, also ${N[g]} = ${fmt(n[g])}`;
      /* „Mit n_f = 1 käme ein Bruch heraus“ stimmt immer, wenn |n_f| > 1: n ist
         gekürzt, also teilt n_f mindestens eine der beiden anderen Komponenten
         nicht. */
      weg.push(Math.abs(n[f]) === 1
        ? `Eine Komponente darf man frei wählen – mit ${N[f]} = ${fmt(n[f])} folgt ${folgt}.`
        : `Eine Komponente darf man frei wählen. Mit ${N[f]} = 1 käme ein Bruch heraus; weil jedes Vielfache von ${vname('n')} ebenfalls Normalenvektor ist, nimmt man gleich ${N[f]} = ${fmt(n[f])} – dann bleibt alles ganzzahlig. Es folgt ${folgt}.`);
      // Die dritte Komponente aus der Ausgangsgleichung mit dem kleineren Faktor vor n_e.
      const nimmI = Math.abs(u[e]) <= Math.abs(v[e]);
      const w = nimmI ? u : v;
      const konst = [0, 1, 2].filter(i => i !== e).reduce((s, i) => s + w[i] * n[i], 0);
      const glieder = [0, 1, 2].map(i => (i === e ? [w[e], N[e]] : [w[i] * n[i], '']));
      weg.push(`Aus ${nimmI ? 'I' : 'II'}: ${linText(glieder)} = 0, also `
        + (w[e] === 1 ? `${N[e]} = ${fmt(n[e])}` : `${koef(w[e], N[e])} = ${fmt(-konst)} und ${N[e]} = ${fmt(n[e])}`));
      return weg;
    }

    /**
     * Drei verschiedene Zahlen als Ablenker – und zwar so, dass die richtige Zahl
     * gleich oft an jeder Stelle der der Größe nach sortierten Reihe steht.
     * Ohne diese Steuerung lag sie in 65 % der Ziehungen in der Mitte (gemessen:
     * 19 / 31 / 31 / 19 %), und „nie die äußerste Zahl nehmen“ war eine Regel,
     * die ohne jede Rechnung ein Drittel der Aufgaben löst. Jetzt wird der
     * Zielrang gewürfelt und dazu passend aus kleineren und größeren Kandidaten
     * gezogen; die Kandidaten bleiben echte Rechenfehler.
     */
    function zahlenMitRang(richtig, kandidaten, ziel) {
      const rein = [];
      for (const k of kandidaten) if (k !== richtig && !rein.includes(k)) rein.push(k);
      const klein = shuffle(rein.filter(k => k < richtig));
      const gross = shuffle(rein.filter(k => k > richtig));
      let r = Math.min(ziel, klein.length);
      if (3 - r > gross.length) r = 3 - gross.length;
      if (r < 0) r = 0;
      const raus = [...klein.slice(0, r), ...gross.slice(0, 3 - r)];
      // Notnagel: Die Auswahl muss immer vier Möglichkeiten haben, sonst steigt
      // die Ratequote still von 25 auf 33 %.
      for (let k = 1; raus.length < 3; k++)
        for (const kand of [richtig + k, richtig - k])
          if (raus.length < 3 && !raus.includes(kand) && kand !== richtig) raus.push(kand);
      return raus.slice(0, 3);
    }

    /**
     * Ebene in Parameterform mit sauberem Normalenvektor.
     * `pruefe(n, u, v)` darf zusätzliche Bedingungen stellen; ohne sie wird nur
     * verlangt, dass u und v nicht parallel sind – sonst spannen sie keine
     * Ebene auf, sondern nur eine Gerade.
     */
    function parameterEbene(maxA, maxR, pruefe) {
      for (let i = 0; i < 300; i++) {
        const u = richtungsVektor(maxR), v = richtungsVektor(maxR);
        const k = kreuz(u, v);
        if (k.every(c => c === 0)) continue;
        /* Das gewürfelte Gesamtvorzeichen ist kein Schönheitsspiel: `kuerzeVektor`
           dreht n so, dass die erste Komponente positiv ist – damit wäre die
           erste Zahl der Lösung NIE negativ. Gemessen: Wurde die erste Komponente
           abgefragt, war die Antwort in 100 % der Ziehungen positiv. Mit −n statt
           n bleibt alles richtig (jedes Vielfache ist ein Normalenvektor), und
           eindeutig bleibt die Antwort auch, weil die Aufgaben stets die beiden
           anderen Komponenten mitzeigen. */
        const n = malV(choice([1, -1]), kuerzeVektor(k));
        if (pruefe && !pruefe(n, u, v)) continue;
        return { A: punktOhneNull(maxA), u, v, n };
      }
      return null;
    }

    return {
      id: 'ebenen',
      icon: 'n·x=d',
      title: 'Ebenen im Raum',
      tagline: 'Parameterform, Normalenform und Schnitte',

      learn: `
        <h2>Ebenen im Raum – zwei Beschreibungen derselben Fläche</h2>
        <p>Eine Gerade entsteht, wenn man von einem Punkt aus <em>eine</em> Richtung immer
        weiterläuft. Nimmt man eine <strong>zweite</strong> Richtung dazu, die nicht dieselbe ist,
        so entsteht eine ganze Fläche: eine Ebene. Genau so beschreibt sie die Parameterform.
        Es geht aber auch ganz anders – über einen Pfeil, der auf der Ebene <strong>senkrecht</strong>
        steht. Aus ihm wird eine Gleichung mit drei Unbekannten, und mit der rechnet es sich
        erheblich bequemer.</p>

        <div class="einstieg-box">
          <p class="box-title">Anflug auf ein Glasdach</p>
          <p>Über einer Werkhalle liegt eine geneigte Glasfläche. Drei Punkte darauf sind
          vermessen: A(2 | 4 | 10), B(4 | 5 | 8) und C(8 | 3 | 8); gemessen wird in Metern, die
          dritte Zahl ist die Höhe. Eine Drohne startet im Punkt P(6 | 8 | 10) und fliegt
          geradlinig in die Richtung ${vek([2, -1, -2])}.</p>
          <p class="frage">Wo genau trifft sie auf das Dach – und wie weit ist sie beim Start von
          der Dachfläche entfernt?</p>
        </div>

        <h3>Zwei Wege, eine Ebene zu beschreiben</h3>

        <div class="herleitung-box">
          <p class="box-title">Warum zwei Richtungen genügen – und warum eine Zahl reicht</p>
          <p>Man beginnt in einem festen Punkt A der Ebene, dem <strong>Stützpunkt</strong>, und
          legt zwei Richtungen fest, in denen man von dort losgehen darf: die
          <strong>Spannvektoren</strong> ${vname('u')} und ${vname('v')}. Jeder Punkt der Ebene ist
          dann von A aus zu erreichen, indem man ein Stück in Richtung ${vname('u')} und ein Stück
          in Richtung ${vname('v')} geht – die beiden Stücke dürfen beliebig lang sein und auch
          rückwärts zeigen:</p>
          <p>${vname('x')} = ${vname('OA')} + r · ${vname('u')} + s · ${vname('v')}</p>
          <p>Wichtig ist nur, dass ${vname('u')} und ${vname('v')} nicht parallel sind. Wären sie
          es, käme man nie aus einer einzigen Geraden heraus.</p>
          <p>Sind statt der Vektoren drei Punkte A, B und C gegeben, so nimmt man einen davon als
          Stützpunkt und die Verbindungsvektoren als Spannvektoren – Spitze minus Fuß, wie bei den
          Vektoren gelernt: ${vname('AB')} und ${vname('AC')}.</p>
          <p>Diese Form beschreibt die Ebene vollständig, ist zum Rechnen aber unhandlich: Fragt
          man, ob ein Punkt in der Ebene liegt, muss man ein Gleichungssystem mit zwei Unbekannten
          lösen. Deshalb der zweite Weg.</p>
          <p><strong>Der Normalenvektor.</strong> Ein Vektor ${vname('n')}, der auf der Ebene
          senkrecht steht, steht auf <em>jedem</em> Pfeil senkrecht, der in ihr verläuft. Ist X ein
          Punkt der Ebene, so verläuft ${vname('AX')} in ihr, und aus dem Skalarprodukt wird eine
          Bedingung:</p>
          <p>${vname('n')} · (${vname('OX')} − ${vname('OA')}) = 0</p>
          <p>Ausmultipliziert steht dort ${vname('n')} · ${vname('OX')} = ${vname('n')} ·
          ${vname('OA')}. Rechts steht eine feste Zahl, die man d nennt – sie hängt nur von der
          Ebene ab, nicht davon, welchen Punkt X man betrachtet. Schreibt man das Skalarprodukt
          links in Koordinaten aus, entsteht die <strong>Koordinatenform</strong>:</p>
          <p>n₁x₁ + n₂x₂ + n₃x₃ = d</p>
          <p>Und hier steckt der praktische Gewinn: Die drei Zahlen vor den Variablen
          <strong>sind</strong> der Normalenvektor. Man kann ihn direkt ablesen. Ein Punkt gehört
          genau dann zur Ebene, wenn seine Koordinaten die Gleichung erfüllen – eine einzige
          Rechnung statt eines Gleichungssystems.</p>
          <p>Der Normalenvektor ist dabei nicht eindeutig: Mit ${vname('n')} steht auch jedes
          Vielfache von ${vname('n')} senkrecht auf der Ebene. Multipliziert man die ganze Gleichung
          mit einer Zahl, beschreibt sie deshalb weiterhin dieselbe Ebene.</p>
        </div>

        <div class="merkkasten">
          <p class="box-title">Die Formeln</p>
          <p><strong>Parameterform:</strong> ${vname('x')} = ${vname('OA')} + r · ${vname('u')} +
          s · ${vname('v')}&nbsp;(A Stützpunkt, ${vname('u')} und ${vname('v')} nicht parallel)</p>
          <p><strong>Aus drei Punkten A, B, C:</strong> ${vname('x')} = ${vname('OA')} + r ·
          ${vname('AB')} + s · ${vname('AC')}</p>
          <p><strong>Koordinatenform:</strong> n₁x₁ + n₂x₂ + n₃x₃ = d&nbsp;– die Koeffizienten
          bilden den Normalenvektor ${vname('n')}, und jedes Vielfache von ${vname('n')} tut es
          auch.</p>
          <p><strong>Die Zahl rechts:</strong> d = ${vname('n')} · ${vname('OA')} für einen
          beliebigen Punkt A der Ebene</p>
          <p><strong>Normalenvektor aus zwei Spannvektoren:</strong> ${vname('n')} · ${vname('u')}
          = 0 und ${vname('n')} · ${vname('v')} = 0 – zwei Gleichungen, drei Unbekannte, eine
          Komponente darf man frei wählen.</p>
          <p><strong>Punktprobe:</strong> Koordinaten in die linke Seite einsetzen; kommt die Zahl
          rechts heraus, liegt der Punkt in der Ebene.</p>
          <p><strong>Spurpunkte:</strong> Die beiden anderen Koordinaten null setzen, etwa
          x₂ = 0 und x₃ = 0 für den Punkt auf der x₁-Achse.</p>
          <p><strong>Gerade und Ebene:</strong> Ist ${vname('n')} · ${vname('u')} ≠ 0, gibt es genau
          einen Schnittpunkt – die Gerade in die Gleichung einsetzen und nach t auflösen. Ist
          ${vname('n')} · ${vname('u')} = 0, entscheidet der Aufpunkt: liegt er in E, so liegt die
          ganze Gerade darin, sonst verläuft sie echt parallel.</p>
          <p><strong>Zwei Ebenen:</strong> Sind die Normalenvektoren Vielfache voneinander, sind die
          Ebenen parallel oder identisch (das entscheidet die Zahl rechts, nachdem beide Gleichungen
          auf denselben Normalenvektor gebracht wurden); sonst schneiden sie sich in einer
          Geraden.</p>
          <p><strong>Abstand Punkt – Ebene</strong> (hessesche Normalform):
          ${frac('|n₁p₁ + n₂p₂ + n₃p₃ − d|', '|n|')} mit |n| = √(n₁² + n₂² + n₃²)</p>
          <p><strong>Abstand zweier paralleler Ebenen:</strong> beide auf denselben Normalenvektor
          bringen, dann ${frac('|d₁ − d₂|', '|n|')}</p>
        </div>

        <h3>So rechnest du</h3>
        <ol class="schritte">
          <li>Kläre zuerst, welche Form du vor dir hast. Steht dort ein Gleichheitszeichen mit
          x₁, x₂, x₃ und einer Zahl, ist es die Koordinatenform; stehen dort r und s, ist es die
          Parameterform.</li>
          <li>Ist die Gleichung unsortiert aufgeschrieben, bringe erst alle Variablen nach links und
          die Zahl nach rechts. Beim Seitenwechsel dreht sich das Vorzeichen um.</li>
          <li>Lies den Normalenvektor als Spalte der drei Koeffizienten ab. Fehlt eine Variable,
          steht an ihrer Stelle eine Null.</li>
          <li>Von der Parameterform zur Koordinatenform: erst ${vname('n')} aus den beiden
          Bedingungen ${vname('n')} · ${vname('u')} = 0 und ${vname('n')} · ${vname('v')} = 0
          bestimmen, dann d = ${vname('n')} · ${vname('OA')} mit dem Stützpunkt.</li>
          <li>Von drei Punkten zur Parameterform: einen als Stützpunkt wählen, die beiden
          Verbindungsvektoren zu den anderen als Spannvektoren.</li>
          <li>Punktprobe in der Koordinatenform: einsetzen und die beiden Seiten vergleichen. In der
          Parameterform: das Gleichungssystem aus zwei Zeilen lösen und das Ergebnis in der dritten
          prüfen.</li>
          <li>Fehlt in einem Punkt eine Koordinate, setze die bekannten ein und löse die entstehende
          lineare Gleichung nach der Unbekannten auf.</li>
          <li>Abstände immer über die hessesche Normalform: einsetzen, die Zahl rechts abziehen,
          Betrag nehmen und durch |n| teilen.</li>
        </ol>

        <h3>Wenn eine Variable fehlt</h3>
        <p>Kommt in der Gleichung eine Variable gar nicht vor, so darf diese Koordinate beliebig
        sein. Bei 3x₁ + 5x₂ = 15 etwa ist x₃ frei: Zu jedem Punkt der Ebene gehört die ganze
        senkrechte Gerade durch ihn. Die Ebene ist damit <strong>parallel zur x₃-Achse</strong> –
        an der dritten Stelle des Normalenvektors ${vek([3, 5, 0])} steht ja eine Null, und der
        Pfeil steht senkrecht auf der Richtung dieser Achse.</p>
        <p>Fehlen zwei Variablen, bleibt eine Gleichung wie x₃ = 4 übrig. Alle Punkte mit der Höhe 4
        bilden eine waagerechte Ebene: Sie liegt <strong>parallel zur x₁x₂-Ebene</strong>, um 4 nach
        oben verschoben. Merke dir die Richtung der Benennung – es ist die Ebene aus den beiden
        Achsen, deren Variablen <em>fehlen</em>.</p>

        <h3>Beispiele</h3>

        <div class="example-box">
          <p class="ex-title">Punktprobe, fehlende Koordinate und Spurpunkte</p>
          <p>E: x₁ + 2x₂ + 2x₃ = 30</p>
          <p>Liegt P(4 | 5 | 8) in E? Einsetzen: 4 + 2 · 5 + 2 · 8 = 4 + 10 + 16 = 30. Links kommt
          30 heraus, rechts steht 30 – <strong>ja</strong>.</p>
          <p>Und Q(1 | 1 | 1)? 1 + 2 + 2 = 5, gefordert sind 30. <strong>Nein.</strong></p>
          <p>Von R(6 | x₂ | 8) ist nur bekannt, dass es in E liegt. Einsetzen: 6 + 2x₂ + 16 = 30,
          also 2x₂ + 22 = 30, dann 2x₂ = 8 und <strong>x₂ = 4</strong>.</p>
          <p>Die Spurpunkte sind die Schnittpunkte mit den Achsen. Auf der x₁-Achse sind x₂ = 0 und
          x₃ = 0, übrig bleibt x₁ = 30: <strong>S₁(30 | 0 | 0)</strong>. Genauso liefert 2x₂ = 30
          den Punkt S₂(0 | 15 | 0) und 2x₃ = 30 den Punkt S₃(0 | 0 | 15).</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Koordinatenform aus Punkt und Normalenvektor</p>
          <p>Gesucht ist die Ebene durch P(3 | −1 | 4) mit dem Normalenvektor
          ${vname('n')} = ${vek([2, 5, -1])}.</p>
          <p>Die linke Seite steht damit schon fest: 2x₁ + 5x₂ − x₃. Die Zahl rechts ist das
          Skalarprodukt aus ${vname('n')} und dem Ortsvektor des Punktes:</p>
          <p>d = 2 · 3 + 5 · (−1) + (−1) · 4 = 6 − 5 − 4 = −3</p>
          <p><strong>E: 2x₁ + 5x₂ − x₃ = −3</strong></p>
          <p>Eine dazu parallele Ebene hat dieselbe linke Seite; nur d ändert sich. Durch den
          Ursprung ginge etwa 2x₁ + 5x₂ − x₃ = 0.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Von drei Punkten zur Koordinatenform</p>
          <p>Die drei vermessenen Punkte des Glasdachs: A(2 | 4 | 10), B(4 | 5 | 8) und
          C(8 | 3 | 8).</p>
          <p>Spannvektoren, Spitze minus Fuß: ${vname('AB')} = ${vek([2, 1, -2])} und
          ${vname('AC')} = ${vek([6, -1, -2])}. Sie sind keine Vielfachen voneinander, spannen also
          wirklich eine Ebene auf:</p>
          <p>E: ${vname('x')} = ${vek([2, 4, 10])} + r · ${vek([2, 1, -2])} + s · ${vek([6, -1, -2])}</p>
          <p>Jetzt der Normalenvektor. Er muss auf beiden Spannvektoren senkrecht stehen:</p>
          <p>${vname('n')} · ${vname('AB')} = 0:&nbsp;2n₁ + n₂ − 2n₃ = 0</p>
          <p>${vname('n')} · ${vname('AC')} = 0:&nbsp;6n₁ − n₂ − 2n₃ = 0</p>
          <p>Addiert man beide Gleichungen, fällt n₂ weg: 8n₁ − 4n₃ = 0, also n₃ = 2n₁. Eine
          Komponente darf man frei wählen – mit n₁ = 1 folgt n₃ = 2 und aus der ersten Gleichung
          2 + n₂ − 4 = 0, also n₂ = 2.</p>
          <p>${vname('n')} = ${vek([1, 2, 2])},&nbsp;Probe: 2 + 2 − 4 = 0 ✓ und 6 − 2 − 4 = 0 ✓</p>
          <p>d = ${vname('n')} · ${vname('OA')} = 2 + 8 + 20 = 30, also
          <strong>E: x₁ + 2x₂ + 2x₃ = 30</strong>.</p>
          <p>Probe mit B: 4 + 10 + 16 = 30 ✓ und mit C: 8 + 6 + 16 = 30 ✓</p>
          <p>Umgekehrt liefert jedes Zahlenpaar (r | s) einen Punkt der Ebene. Für r = 2 und s = 2
          etwa ${vek([2, 4, 10])} + 2 · ${vek([2, 1, -2])} + 2 · ${vek([6, -1, -2])} =
          ${vek([18, 4, 2])}, und die Koordinatenform bestätigt es: 18 + 8 + 4 = 30 ✓</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Liegt ein Punkt in der Parameterform?</p>
          <p>Liegt Q(11 | 4 | 6) in E: ${vname('x')} = ${vek([2, 4, 10])} + r · ${vek([2, 1, -2])}
          + s · ${vek([6, -1, -2])}?</p>
          <p>Gesucht sind r und s mit ${vname('AQ')} = r · ${vname('AB')} + s · ${vname('AC')}.
          Zuerst ${vname('AQ')} = ${vek([11, 4, 6])} − ${vek([2, 4, 10])} = ${vek([9, 0, -4])}.</p>
          <p>Zeile 1: 2r + 6s = 9</p>
          <p>Zeile 2: r − s = 0</p>
          <p>Zeile 3: −2r − 2s = −4</p>
          <p>Aus Zeile 2 folgt r = s. In Zeile 3 eingesetzt: −4s = −4, also s = 1 und r = 1.</p>
          <p>Und jetzt entscheidet Zeile 1: 2 · 1 + 6 · 1 = 8, verlangt sind aber 9.
          <strong>Q liegt nicht in E.</strong></p>
          <p>Die Kontrolle über die Koordinatenform ist schneller: 11 + 8 + 12 = 31, und rechts
          steht 30. Genau darum lohnt sich der Wechsel der Form.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Der Anflug: Schnittpunkt von Gerade und Ebene</p>
          <p>g: ${vname('x')} = ${vek([6, 8, 10])} + t · ${vek([2, -1, -2])},&nbsp;E: x₁ + 2x₂ + 2x₃ = 30</p>
          <p>Die Gerade steht in der Parameterform aus dem Thema <em>Geraden im Raum</em>:
          Aufpunkt plus ein Vielfaches des Richtungsvektors.</p>
          <p>Zuerst die Vorfrage: ${vname('n')} · ${vname('u')} = 2 − 2 − 4 = −4, also nicht null –
          es gibt genau einen Schnittpunkt.</p>
          <p>Ein Punkt von g hat die Koordinaten (6 + 2t | 8 − t | 10 − 2t). Diese drei Ausdrücke in
          die Gleichung von E einsetzen:</p>
          <p>(6 + 2t) + 2 · (8 − t) + 2 · (10 − 2t) = 30</p>
          <p>6 + 2t + 16 − 2t + 20 − 4t = 30, zusammengefasst 42 − 4t = 30, also −4t = −12 und
          <strong>t = 3</strong>.</p>
          <p>Dieses t in g einsetzen: 6 + 3 · 2 = 12,&nbsp;8 − 3 · 1 = 5,&nbsp;10 − 3 · 2 = 4.</p>
          <p>Die Drohne trifft das Dach im Punkt <strong>S(12 | 5 | 4)</strong>. Probe:
          12 + 10 + 8 = 30 ✓</p>
          <p>Weil der Richtungsvektor die Länge √(4 + 1 + 4) = 3 hat, sind das t = 3 mal 3 m,
          also 9 m Flugstrecke.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Abstände: Punkt und Ebene, Ebene und Ebene</p>
          <p>Wie weit ist die Drohne beim Start von der Dachebene entfernt?</p>
          <p>|${vname('n')}| = √(1² + 2² + 2²) = √9 = 3</p>
          <p>P eingesetzt: 6 + 2 · 8 + 2 · 10 = 6 + 16 + 20 = 42</p>
          <p>Abstand = ${frac('|42 − 30|', '3')} = ${frac('12', '3')} = <strong>4 m</strong></p>
          <p>Über der Halle liegt außerdem eine Schutzebene F: x₁ + 2x₂ + 2x₃ = 45. Sie hat
          denselben Normalenvektor wie E, ist also parallel dazu. Ihr Abstand von E:</p>
          <p>${frac('|45 − 30|', '3')} = ${frac('15', '3')} = <strong>5 m</strong></p>
          <p>Das ist keine neue Formel: Man nimmt irgendeinen Punkt von E und misst seinen Abstand
          von F – für alle Punkte von E kommt dasselbe heraus.</p>
        </div>

        <div class="example-box">
          <p class="ex-title">Gerade parallel zur Ebene</p>
          <p>h: ${vname('x')} = ${vek([1, 1, 1])} + t · ${vek([2, 1, -2])},&nbsp;E: x₁ + 2x₂ + 2x₃ = 30</p>
          <p>${vname('n')} · ${vname('u')} = 2 + 2 − 4 = 0 – die Gerade läuft in der Richtung der
          Ebene mit. Jetzt entscheidet der Aufpunkt: 1 + 2 + 2 = 5, rechts steht 30.</p>
          <p>Er liegt also nicht in E, und damit verläuft <strong>h echt parallel zu E</strong>: kein
          einziger gemeinsamer Punkt.</p>
          <p>Wäre der Aufpunkt A(2 | 4 | 10) genommen worden, käme 30 heraus – dann läge die ganze
          Gerade in der Ebene. Nur diese beiden Fälle gibt es, wenn das Skalarprodukt null ist.</p>
        </div>

        <div class="achtung-box">
          <p class="achtung-title">Einsetzen allein ist noch kein Abstand</p>
          <p>Setzt man einen Punkt in die linke Seite ein und zieht die Zahl rechts ab, bekommt man
          eine Zahl – aber noch keinen Abstand. Sie hängt davon ab, wie groß die Zahlen in der
          Gleichung zufällig sind, und dieselbe Ebene lässt sich mit beliebig großen Zahlen
          aufschreiben.</p>
          <p><strong>Gegenbeispiel:</strong> E: x₁ + 2x₂ + 2x₃ = 30 und dieselbe Ebene, mit 2
          multipliziert: E: 2x₁ + 4x₂ + 4x₃ = 60. Dazu der Punkt P(6 | 8 | 10).</p>
          <p>Erste Fassung: 6 + 16 + 20 = 42, und 42 − 30 = 12.</p>
          <p>Zweite Fassung: 12 + 32 + 40 = 84, und 84 − 60 = 24.</p>
          <p>Zwölf oder vierundzwanzig – für ein und denselben Punkt über ein und derselben Ebene.
          Das Teilen durch |n| räumt den Unterschied weg: In der ersten Fassung ist
          |n| = √(1 + 4 + 4) = 3 und 12 : 3 = 4; in der zweiten ist |n| = √(4 + 16 + 16) = 6 und
          24 : 6 = 4. Beide Male <strong>4 m</strong>, wie es sein muss.</p>
          <p>Dieselbe Falle steht beim Abstand zweier paralleler Ebenen: Erst beide Gleichungen auf
          denselben Normalenvektor bringen, dann die Zahlen rechts vergleichen.</p>
        </div>

        <div class="selbstcheck">
          <p class="box-title">Selbstcheck</p>
          <details><summary>Warum braucht die Parameterform einer Ebene zwei Parameter, die einer Geraden nur einen?</summary>
          <p>Weil man sich in einer Ebene in zwei unabhängige Richtungen bewegen kann. Mit nur einem
          Parameter erreicht man von A aus nur die Punkte einer Geraden. Aus demselben Grund müssen
          die beiden Spannvektoren verschiedene Richtungen haben: Wären sie parallel, bliebe es bei
          einer Geraden.</p></details>
          <details><summary>Ist ${vek([2, 4, 4])} ein Normalenvektor von E: x₁ + 2x₂ + 2x₃ = 30?</summary>
          <p>Ja. Die Koeffizienten liefern ${vek([1, 2, 2])}, und ${vek([2, 4, 4])} ist genau das
          Doppelte davon. Jedes Vielfache eines Normalenvektors steht ebenfalls senkrecht auf der
          Ebene; nur der Nullvektor scheidet aus.</p></details>
          <details><summary>Wie liegt die Ebene 3x₁ + 5x₂ = 15 im Raum?</summary>
          <p>x₃ kommt nicht vor, ist also frei wählbar: Die Ebene ist parallel zur x₃-Achse. Ihr
          Normalenvektor ${vek([3, 5, 0])} hat an der dritten Stelle eine Null und steht damit
          senkrecht auf der Richtung dieser Achse.</p></details>
          <details><summary>Wie liegen 2x₁ − x₂ + 2x₃ = 4 und −4x₁ + 2x₂ − 4x₃ = −8 zueinander?</summary>
          <p>Der zweite Normalenvektor ist das (−2)-Fache des ersten, die Ebenen sind also parallel
          oder identisch. Teilt man die zweite Gleichung durch −2, steht dort 2x₁ − x₂ + 2x₃ = 4 –
          genau die erste. Es ist <strong>dieselbe Ebene</strong>, nur anders aufgeschrieben.</p></details>
          <details><summary>Beim Test in der Parameterform gehen zwei Zeilen auf. Reicht das?</summary>
          <p>Nein. Zwei Zeilen sind zwei Gleichungen für zwei Unbekannte – die haben fast immer eine
          Lösung, ganz gleich, wo der Punkt liegt. Erst die dritte Zeile entscheidet, und sie ist
          deshalb kein lästiger Zusatz, sondern die eigentliche Probe.</p></details>
          <details><summary>Eine Gerade hat einen Richtungsvektor mit ${vname('n')} · ${vname('u')} = 0. Liegt sie in der Ebene?</summary>
          <p>Nur vielleicht. Das Skalarprodukt sagt bloß, dass die Gerade in der Richtung der Ebene
          verläuft. Ob sie darin liegt oder daneben, entscheidet allein der Aufpunkt: Erfüllt er die
          Gleichung, liegt die ganze Gerade in der Ebene, sonst verläuft sie echt parallel.</p></details>
        </div>
      `,

      gen(diff) {

        /* ============================================================
           Stufe 1 – die Koordinatenform lesen: Punktprobe, Normalenvektor,
           Spurpunkte, fehlende Koordinate, fehlende Variable, Umformen
           ============================================================ */
        if (diff === 1) {
          const art = rnd(1, 6);

          /* --- Punktprobe --- */
          if (art === 1) {
            const n = normaleKlein();
            const P = punktOhneNull(5);
            const links = skalar(n, P);
            const drin = rnd(0, 1) === 1;
            const d = drin ? links : links + rndNonZero(-6, 6);
            const ja = 'Ja, P liegt in E.';
            const nein = 'Nein, P liegt nicht in E.';
            const richtig = drin ? ja : nein;
            const opts = shuffle([ja, nein]);
            return {
              q: `Liegt der Punkt ${punkt('P', P)} in der Ebene E: ${ebeneForm(n, d)}?`,
              type: 'choice', options: opts, correct: opts.indexOf(richtig), answerText: richtig,
              solution: `Die Koordinaten von P in die linke Seite einsetzen:${TRENN}${einsetzen(n, P)}${TRENN}`
                + (drin
                  ? `Links steht damit ${fmt(links)}, rechts steht ${fmt(d)} – die Gleichung ist erfüllt, <strong>P liegt in E</strong>.`
                  : `Links steht damit ${fmt(links)}, rechts steht ${fmt(d)}. Die Gleichung ist nicht erfüllt, also <strong>liegt P nicht in E</strong>.`)
            };
          }

          /* --- Normalenvektor ablesen (Vielfache zählen auch) --- */
          if (art === 2) {
            const n = normaleKlein();
            const d = rndNonZero(-12, 12);
            const k = choice([-1, 2, -2, 3]);
            const richtig = vek(malV(k, n));
            // Alle Ablenker werden mit demselben k gestreckt. Sonst wäre die
            // richtige Antwort schon an der Größe der Zahlen zu erkennen.
            const ablenker = [[n[1], n[0], n[2]], [n[0], n[2], n[1]], [n[2], n[1], n[0]],
              [-n[0], n[1], n[2]], [n[0], -n[1], n[2]]].map(w => vek(malV(k, w)));
            // Bewusst ohne Gründe: Die gezeigten Ablenker sind Umstellungen, und
            // „zwei Koeffizienten vertauscht“ nennte die Lösung gleich mit.
            const mc = makeChoice(richtig, ablenker);
            return {
              q: `Welcher dieser Vektoren ist ein Normalenvektor der Ebene E: ${ebeneForm(n, d)}?`,
              type: 'choice', options: mc.options, correct: mc.correct, answerText: richtig,
              solution: `Die Koeffizienten vor ${VAR[0]}, ${VAR[1]} und ${VAR[2]} bilden einen Normalenvektor: ${vname('n')} = ${vek(n)}.${TRENN}Jedes Vielfache davon steht ebenfalls senkrecht auf E, hier das ${fmt(k)}-Fache: ${fmt(k)} · ${vek(n)} = <strong>${richtig}</strong>${TRENN}Bei den anderen Vorschlägen sind zwei Komponenten vertauscht oder eine hat das falsche Vorzeichen – dann ist der Vektor kein Vielfaches von ${vname('n')} mehr.`
            };
          }

          /* --- Spurpunkt auf einer Achse --- */
          if (art === 3) {
            let n = normaleKlein();
            let achse = rnd(0, 2);
            // Ohne Koeffizient ≥ 2 gäbe es nichts zu dividieren.
            for (let i = 0; i < 60 && Math.abs(n[achse]) < 2; i++) { n = normaleKlein(); achse = rnd(0, 2); }
            if (Math.abs(n[achse]) < 2) { n = [2, 3, 4]; achse = 0; }
            const k = rndNonZero(-6, 6);
            const d = n[achse] * k;
            const S = [0, 0, 0];
            S[achse] = k;
            const andere = [0, 1, 2].filter(i => i !== achse);
            return {
              q: `In welchem Punkt schneidet die Ebene E: ${ebeneForm(n, d)} die ${ACHSE[achse]}? ${PUNKT_HINWEIS}`,
              type: 'input', placeholder: 'z. B. 4; 0; 0',
              check: orderedCheck(S), testAnswer: S.join('; '),
              answerText: punkt(SPURNAME[achse], S),
              solution: `Auf der ${ACHSE[achse]} sind die beiden anderen Koordinaten null: ${VAR[andere[0]]} = 0 und ${VAR[andere[1]]} = 0.${TRENN}Von der Gleichung bleibt damit nur ${koef(n[achse], VAR[achse])} = ${fmt(d)} übrig.${TRENN}${VAR[achse]} = ${fmt(d)} : ${par(n[achse])} = ${fmt(k)}${TRENN}Der Spurpunkt ist <strong>${punkt(SPURNAME[achse], S)}</strong>.`
            };
          }

          /* --- fehlende Koordinate eines Punktes --- */
          if (art === 4) {
            let n, P, j, rest;
            for (let i = 0; i < 200; i++) {
              n = normaleKlein();
              P = punktOhneNull(5);
              const moeglich = [0, 1, 2].filter(x => Math.abs(n[x]) >= 2);
              if (!moeglich.length) continue;
              j = choice(moeglich);
              rest = [0, 1, 2].filter(x => x !== j).reduce((s, x) => s + n[x] * P[x], 0);
              if (rest !== 0) break;          // sonst stünde „3x₂ + 0 = 8“ da
            }
            if (rest === 0) { n = [1, 3, 2]; P = [2, 1, 3]; j = 1; rest = 8; }
            const d = skalar(n, P);
            const gezeigt = `P(${[0, 1, 2].map(i => i === j ? VAR[j] : fmt(P[i])).join(' | ')})`;
            const bekannt = [0, 1, 2].filter(i => i !== j);
            return {
              q: `Der Punkt ${gezeigt} liegt in der Ebene E: ${ebeneForm(n, d)}. Bestimme ${VAR[j]}.`,
              type: 'input', placeholder: `${VAR[j]} = ?`,
              check: numCheck(P[j]), testAnswer: String(P[j]),
              answerText: `${VAR[j]} = ${fmt(P[j])}`,
              solution: `Die beiden bekannten Koordinaten einsetzen und zusammenfassen:${TRENN}${einsetzen(n, P, bekannt)}${TRENN}Damit lautet die Gleichung ${koef(n[j], VAR[j])} ${rest > 0 ? '+' : '−'} ${fmt(Math.abs(rest))} = ${fmt(d)}&nbsp;| ${rest > 0 ? '−' : '+'} ${fmt(Math.abs(rest))}${TRENN}${koef(n[j], VAR[j])} = ${fmt(d - rest)}&nbsp;| : ${par(n[j])}${TRENN}${VAR[j]} = <strong>${fmt(P[j])}</strong>${TRENN}Probe: ${einsetzen(n, P)} ✓`
            };
          }

          /* --- fehlende Variable: parallel zu einer Achse oder zu einer Koordinatenebene --- */
          if (art === 5) {
            if (rnd(1, 2) === 1) {
              const fehlt = rnd(0, 2);
              const n = [0, 0, 0];
              for (const i of [0, 1, 2]) if (i !== fehlt) n[i] = rndNonZero(-5, 5);
              const d = rndNonZero(-15, 15);
              const opts = ACHSE.map(a => `zur ${a}`);
              // Jede falsche Achse gehört zu einer Variablen, die in der Gleichung steht.
              const gruende = opts.map((_, i) => (i === fehlt ? null
                : `In Richtung der ${ACHSE[i]} ändert sich nur ${VAR[i]} – und weil ${VAR[i]} in der Gleichung vorkommt, ändert sich damit die linke Seite.`));
              return {
                q: `Zu welcher Koordinatenachse ist die Ebene E: ${ebeneForm(n, d)} parallel?`,
                type: 'choice', options: opts, correct: fehlt, gruende, answerText: opts[fehlt],
                solution: `In der Gleichung kommt ${VAR[fehlt]} nicht vor. Die ${VAR[fehlt]}-Koordinate darf also beliebig sein: Liegt ein Punkt in E, so liegt die ganze Parallele zur ${ACHSE[fehlt]} durch ihn in E.${TRENN}Anders gesagt: Der Normalenvektor ${vek(n)} hat an der ${fmt(fehlt + 1)}. Stelle eine Null und steht damit senkrecht auf der Richtung dieser Achse.${TRENN}E ist <strong>${opts[fehlt]}</strong> parallel (und enthält sie nicht, denn rechts steht ${fmt(d)} und nicht 0).`
              };
            }
            const bleibt = rnd(0, 2);
            const n = [0, 0, 0];
            n[bleibt] = choice([1, 2, 3, -1, -2, -3]);
            const wert = rndNonZero(-6, 6);
            const d = n[bleibt] * wert;
            const richtigIdx = [2, 1, 0][bleibt];
            const opts = KOORDEBENE.map(e => `zur ${e}`);
            const andere = [0, 1, 2].filter(i => i !== bleibt);
            // Beide falschen Koordinatenebenen enthalten die Achse der einzigen Variablen.
            const gruende = opts.map((_, j) => (j === richtigIdx ? null
              : `In der ${KOORDEBENE[j]} ändert sich auch ${VAR[bleibt]} – in E hat ${VAR[bleibt]} aber einen festen Wert.`));
            return {
              q: `Zu welcher Koordinatenebene ist die Ebene E: ${ebeneForm(n, d)} parallel?`,
              type: 'choice', options: opts, correct: richtigIdx, gruende, answerText: opts[richtigIdx],
              // Steht die Gleichung schon nach der Variablen aufgelöst da, wäre
              // „nach x₂ aufgelöst“ ein Schritt, der nichts tut.
              solution: `${n[bleibt] === 1
                ? `Die Gleichung nennt nur ${VAR[bleibt]} und verlangt ${VAR[bleibt]} = ${fmt(wert)}.`
                : `Nach ${VAR[bleibt]} aufgelöst lautet die Gleichung ${VAR[bleibt]} = ${fmt(wert)}.`}${TRENN}${VAR[andere[0]]} und ${VAR[andere[1]]} sind völlig frei – E besteht aus allen Punkten mit ${VAR[bleibt]} = ${fmt(wert)}.${TRENN}Das ist genau die um ${fmt(Math.abs(wert))} verschobene ${KOORDEBENE[richtigIdx]}, also liegt E <strong>${opts[richtigIdx]}</strong> parallel.`
            };
          }

          /* --- Gleichung erst sortieren, dann den Normalenvektor ablesen --- */
          /* Die Zahl rechts wird in der Frage genannt. Ohne sie wäre die Antwort
             nicht eindeutig: Multipliziert man die ganze Gleichung mit −1 oder 2,
             beschreibt sie dieselbe Ebene, und jedes Vielfache von n wäre richtig. */
          const n = normaleKlein();
          const d = rndNonZero(-15, 15);
          const rechtsIdx = shuffle([0, 1, 2]).slice(0, rnd(1, 2));
          const linksIdx = [0, 1, 2].filter(i => !rechtsIdx.includes(i));
          const linksTeil = termKette(linksIdx.map(i => [n[i], VAR[i]]));
          const rechtsTeil = rechtsIdx.map(i => (n[i] < 0 ? ' + ' : ' − ') + koef(Math.abs(n[i]), VAR[i])).join('');
          return {
            q: `Die Ebene E ist durch ${linksTeil} = ${fmt(d)}${rechtsTeil} gegeben. Sortiere die Gleichung zur Koordinatenform mit der Zahl ${fmt(d)} auf der rechten Seite und gib den Normalenvektor an. ${KOMP_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(n), testAnswer: n.join('; '),
            answerText: vek(n),
            solution: `Alle Summanden mit einer Variablen kommen nach links, die Zahl bleibt rechts. Beim Seitenwechsel dreht sich das Vorzeichen um:${TRENN}${rechtsIdx.map(i => `${koef(-n[i], VAR[i])} steht rechts, links wird daraus ${koef(n[i], VAR[i])}`).join(TRENN)}${TRENN}Sortiert lautet die Koordinatenform E: ${ebeneForm(n, d)}${TRENN}Die drei Koeffizienten sind in der Reihenfolge ${VAR[0]}, ${VAR[1]}, ${VAR[2]} der Normalenvektor: <strong>${vek(n)}</strong>${TRENN}Achte auf die Reihenfolge: erst ${VAR[0]}, dann ${VAR[1]}, dann ${VAR[2]} – auch wenn die Gleichung sie anders aufzählt.`
          };
        }

        /* ============================================================
           Stufe 2 – zwischen den Formen wechseln: d = n · OP, Parameterform
           aus drei Punkten, Punktprobe in der Parameterform
           ============================================================ */
        if (diff === 2) {
          const art = rnd(1, 6);

          /* --- Koordinatenform aus Punkt und Normalenvektor --- */
          if (art === 1) {
            const n = normaleKlein();
            const P = punktOhneNull(6);
            const d = skalar(n, P);
            return {
              q: `Die Ebene E geht durch ${punkt('P', P)} und hat den Normalenvektor ${vname('n')} = ${vek(n)}. Ihre Koordinatenform lautet ${linkeSeite(n)} = d. Bestimme d.`,
              type: 'input', placeholder: 'd = ?',
              check: numCheck(d), testAnswer: String(d),
              answerText: `d = ${fmt(d)}`,
              solution: `Rechts steht in der Koordinatenform gerade das Skalarprodukt aus dem Normalenvektor und dem Ortsvektor eines Punktes der Ebene: d = ${vname('n')} · ${vname('OP')}.${TRENN}d = ${einsetzen(n, P)}${TRENN}Die Ebene lautet also <strong>E: ${ebeneForm(n, d)}</strong>.${TRENN}Probe: P eingesetzt ergibt links ${fmt(d)} – genau die Zahl rechts. ✓`
            };
          }

          /* --- Spannvektor der Ebene durch drei Punkte --- */
          if (art === 2) {
            /* `v.every((c, i) => c !== u[i])` sorgt dafür, dass auch BC = v − u
               keine Null enthält. Ohne diese Bedingung war BC in jeder achten
               Ziehung der einzige Vektor mit einer Null – und weil die Ablenker
               Nullen ausschließen, verriet die Null die Lösung: 11,9 % der
               Aufgaben waren ohne jede Rechnung lösbar (gemessen). */
            const E = parameterEbene(5, 4, (n, u, v) => n.every(k => k !== 0 && Math.abs(k) <= 12)
              && v.every((c, i) => c !== u[i]))
              || { A: [1, 2, 1], u: [1, 2, -1], v: [2, -1, 1], n: [1, -3, -5] };
            const { A, u, v, n } = E;
            const B = plusV(A, u), C = plusV(A, v);
            const BC = minusV(v, u);
            const wahl = rnd(1, 3);
            const richtigV = wahl === 1 ? u : wahl === 2 ? v : BC;
            const name = wahl === 1 ? 'AB' : wahl === 2 ? 'AC' : 'BC';
            /* Jeder Ablenker entsteht, indem eine Komponente um 1 verändert wird.
               Dann ist n · w = ± nᵢ, und weil alle Komponenten von n ungleich null
               sind, ist das nie null: Kein Ablenker liegt versehentlich doch in
               der Ebene, und es gibt immer genug davon. */
            const stoerungen = [];
            for (const basis of [u, v, BC])
              for (const i of [0, 1, 2])
                for (const s of [1, -1]) {
                  const w = basis.slice();
                  w[i] += s;
                  if (w.some(c => c === 0)) continue;
                  stoerungen.push(w);
                }
            // Ohne Gründe: Jeder Ablenker weicht nur um 1 von einem Verbindungsvektor
            // ab – ein Nachbarwert, kein benennbarer Fehler.
            const mc = makeChoice(vek(richtigV), shuffle(stoerungen).map(w => vek(w)));
            return {
              q: `Die Ebene E geht durch die Punkte ${punkt('A', A)}, ${punkt('B', B)} und ${punkt('C', C)}. Welcher der vier Vektoren kann in einer Parameterform von E als Spannvektor auftreten?`,
              type: 'choice', options: mc.options, correct: mc.correct, answerText: vek(richtigV),
              solution: `Spannvektoren sind Verbindungsvektoren zwischen zwei Punkten der Ebene – Spitze minus Fuß:${TRENN}${vname('AB')} = ${vek(B)} − ${vek(A)} = ${vek(u)}${TRENN}${vname('AC')} = ${vek(C)} − ${vek(A)} = ${vek(v)}${TRENN}${vname('BC')} = ${vek(C)} − ${vek(B)} = ${vek(BC)}${TRENN}Angeboten wird davon <strong>${vek(richtigV)}</strong>, also ${vname(name)}.${TRENN}Zur Kontrolle: Die Ebene hat den Normalenvektor ${vek(n)}, und für jeden Spannvektor muss das Skalarprodukt damit null sein. Für ${vek(richtigV)} ist es ${fmt(skalar(n, richtigV))}; bei den anderen Vorschlägen kommt nicht null heraus, sie zeigen aus der Ebene heraus.${TRENN}`
                /* Bei der Lösung BC zeigte der Weg bisher die Form mit Stützpunkt
                   A – AB und AC, die Antwort kam darin nicht vor. Die Seite erlaubt
                   jeden der drei Punkte als Stützpunkt; mit B steht BC darin. */
                + (wahl === 3
                  ? `${vname('BC')} gehört zu einer Parameterform mit B als Stützpunkt – als Stützpunkt taugt jeder der drei Punkte. Mit ${vname('BA')} = ${vek(A)} − ${vek(B)} = ${vek(malV(-1, u))} lautet sie E: ${paramForm(B, malV(-1, u), BC)}`
                  : `Eine mögliche Parameterform ist E: ${paramForm(A, u, v)}`)
            };
          }

          /* --- Punkt zu gegebenen Parameterwerten --- */
          if (art === 3) {
            /* Zwei Zeilen dürfen nicht dieselben drei Zahlen tragen – sonst steht
               im Lösungsweg zweimal wortgleich dieselbe Rechnung untereinander. */
            const E = parameterEbene(5, 4, (n, u, v) => true)
              || { A: [1, 2, 1], u: [1, 2, -1], v: [2, -1, 1] };
            const { u, v } = E;
            let A = E.A;
            for (let i = 0; i < 60 && new Set([0, 1, 2].map(k => `${A[k]},${u[k]},${v[k]}`)).size < 3; i++)
              A = punktOhneNull(5);
            const r = choice([-3, -2, 2, 3]), s = choice([-3, -2, 2, 3]);
            const X = [0, 1, 2].map(i => A[i] + r * u[i] + s * v[i]);
            return {
              q: `Die Ebene E ist in Parameterform gegeben:<br>E: ${paramForm(A, u, v)}<br>Welcher Punkt von E gehört zu r = ${fmt(r)} und s = ${fmt(s)}? ${PUNKT_HINWEIS}`,
              type: 'input', placeholder: 'z. B. 3; −1; 5',
              check: orderedCheck(X), testAnswer: X.join('; '),
              answerText: punkt('X', X),
              solution: `Die beiden Zahlen einsetzen und zeilenweise rechnen:${TRENN}${[0, 1, 2].map(i => `${fmt(A[i])} + ${par(r)} · ${par(u[i])} + ${par(s)} · ${par(v[i])} = ${fmt(X[i])}`).join(TRENN)}${TRENN}Der Punkt ist <strong>${punkt('X', X)}</strong>.${TRENN}Jedes Zahlenpaar (r | s) liefert genau einen Punkt der Ebene – deshalb braucht eine Ebene zwei Parameter, eine Gerade nur einen.`
            };
          }

          /* --- Punktprobe in der Parameterform --- */
          if (art === 4) {
            /* u bekommt an einer Stelle bewusst eine 1: Genau diese Zeile lässt
               sich ohne Bruch nach r auflösen, und der Lösungsweg zeigt dann eine
               echte Rechnung statt „das System hat die Lösung …“.
               Zusätzlich müssen alle drei Komponenten von u × v ungleich null
               sein. Sie sind gerade die drei 2×2-Unterdeterminanten; ist eine
               null, sind zwei der drei Zeilen dieselbe Gleichung („r + s = 5“ und
               „−r − s = −5“). Der Lösungsweg behauptet dann „erst die dritte Zeile
               entscheidet" und zeigt daneben eine Zeile, die nichts entscheidet –
               in 16 % der Ziehungen (gemessen). */
            let A = [1, 2, 1], u = [1, 3, -2], v = [2, -1, -1], i0 = 0, j = 1;
            for (let versuch = 0; versuch < 300; versuch++) {
              const ku = richtungsVektor(4), kv = richtungsVektor(4);
              const ki = rnd(0, 2);
              ku[ki] = 1;
              if (kreuz(ku, kv).some(c => c === 0)) continue;
              const dets = [0, 1, 2].filter(x => x !== ki).filter(x => Math.abs(kv[x] - ku[x] * kv[ki]) >= 2);
              if (!dets.length) continue;          // |Determinante| = 1 machte die Zeile „s = 3, also s = 3“
              const kj = choice(dets);
              A = punktOhneNull(5); u = ku; v = kv; i0 = ki; j = kj;
              break;
            }
            const k3 = [0, 1, 2].find(x => x !== i0 && x !== j);
            const r0 = choice([-2, -1, 1, 2, 3]), s0 = choice([-2, -1, 1, 2, 3]);
            const drin = rnd(0, 1) === 1;
            const abw = drin ? 0 : rndNonZero(-3, 3);
            const Q = [0, 1, 2].map(i => A[i] + r0 * u[i] + s0 * v[i] + (i === k3 ? abw : 0));
            const q3 = minusV(Q, A);
            const ja = 'Ja, Q liegt in E.';
            const nein = 'Nein, Q liegt nicht in E.';
            const richtig = drin ? ja : nein;
            const opts = shuffle([ja, nein]);
            /* Ist die rechte Seite null, hieße es sonst „r = 0 − 2s“ – die Null
               steht dann für nichts. */
            const nachR = aufgeloest(q3[i0], -v[i0], 's');
            const zeile = i => `Zeile ${fmt(i + 1)}: ${koef(u[i], 'r')} ${v[i] > 0 ? '+' : '−'} ${koef(Math.abs(v[i]), 's')} = ${fmt(q3[i])}`;
            return {
              q: `Liegt der Punkt ${punkt('Q', Q)} in der Ebene E?<br>E: ${paramForm(A, u, v)}`,
              type: 'choice', options: opts, correct: opts.indexOf(richtig), answerText: richtig,
              /* Die drei Zeilen stehen in ihrer natürlichen Reihenfolge, nicht in
                 der Reihenfolge, in der sie benutzt werden: „Zeile 3, Zeile 1,
                 Zeile 2" untereinander liest sich wie ein Fehler. */
              solution: `Ansatz: ${vname('OQ')} = ${vname('OA')} + r · ${vname('u')} + s · ${vname('v')}, also ${vname('AQ')} = r · ${vname('u')} + s · ${vname('v')}.${TRENN}${vname('AQ')} = ${vek(Q)} − ${vek(A)} = ${vek(q3)}${TRENN}Jede Zeile ist eine Gleichung:${TRENN}${zeile(0)}${TRENN}${zeile(1)}${TRENN}${zeile(2)}${TRENN}In Zeile ${fmt(i0 + 1)} steht vor r eine 1, also nach r auflösen: r = ${nachR}${TRENN}${einsetzWeg(u[j], q3[i0], -v[i0], v[j], q3[j], 's', `Das in Zeile ${fmt(j + 1)} einsetzen: `).join(TRENN)}${TRENN}Zurück in Zeile ${fmt(i0 + 1)}: ${rueckWeg('r', q3[i0], -v[i0], 's', s0, false)}${TRENN}Jetzt entscheidet Zeile ${fmt(k3 + 1)}: ${koef(u[k3], 'r')} ${v[k3] > 0 ? '+' : '−'} ${koef(Math.abs(v[k3]), 's')} = ${einsetzen([u[k3], v[k3], 0], [r0, s0, 0], [0, 1])}, verlangt sind ${fmt(q3[k3])}.${TRENN}`
                /* „fast immer“ wie im Selbstcheck der Seite: Ein singuläres
                   Zeilenpaar liefert kein Zahlenpaar. Der Generator schließt
                   solche Paare aus, als allgemeine Regel wäre „immer“ falsch. */
                + (drin
                  ? `Beide Zahlen stimmen überein – alle drei Zeilen gehen mit r = ${fmt(r0)} und s = ${fmt(s0)} auf, <strong>Q liegt in E</strong>.`
                  : `Die beiden Zahlen sind verschieden. Zwei Zeilen allein genügen nie: Sie liefern fast immer ein Zahlenpaar – hier r = ${fmt(r0)} und s = ${fmt(s0)} –, erst die dritte entscheidet. Sie scheitert, also <strong>liegt Q nicht in E</strong>.`)
            };
          }

          /* --- fehlende Komponente des Normalenvektors --- */
          if (art === 5) {
            const E = parameterEbene(5, 4, n => n.every(k => k !== 0 && Math.abs(k) <= 9))
              || { A: [1, 2, 1], u: [1, 2, -1], v: [2, -1, 1], n: [1, -3, -5] };
            const { u, v, n } = E;
            /* Nur Stellen, bei denen der Rest nicht null wird – sonst stünde im
               Lösungsweg „2x + 0 = 0“, ein Schritt, der nichts tut.
               Unter diesen werden große Beträge bevorzugt, weil sich die Antwort
               sonst auf wenige kleine Zahlen zusammenzieht: mit |nⱼ| = 1 war „x = 1“
               die Antwort in 16,5 % aller Ziehungen, mit |nⱼ| = 2 immer noch „x = 2“
               in 15 %. Ab |nⱼ| ≥ 3 verteilt sie sich auf höchstens 11 %. */
            const stellen = [0, 1, 2].filter(x => [0, 1, 2].filter(i => i !== x)
              .reduce((s, i) => s + n[i] * u[i], 0) !== 0);
            const gross = stellen.filter(x => Math.abs(n[x]) >= 3);
            const mittel = stellen.filter(x => Math.abs(n[x]) >= 2);
            const j = gross.length ? choice(gross) : mittel.length ? choice(mittel)
              : stellen.length ? choice(stellen) : 0;
            const rest = [0, 1, 2].filter(i => i !== j).reduce((s, i) => s + n[i] * u[i], 0);
            const gezeigt = n.map((k, i) => i === j ? 'x' : k);
            return {
              q: `Die Ebene E hat die Spannvektoren ${vname('u')} = ${vek(u)} und ${vname('v')} = ${vek(v)}. Der Vektor ${vname('n')} = ${vek(gezeigt)} steht auf beiden senkrecht. Bestimme x.`,
              type: 'input', placeholder: 'x = ?',
              check: numCheck(n[j]), testAnswer: String(n[j]),
              answerText: `x = ${fmt(n[j])}`,
              solution: `Senkrecht heißt: Das Skalarprodukt ist null. Die erste Bedingung lautet ${vname('n')} · ${vname('u')} = 0:${TRENN}${[0, 1, 2].map(i => i === j ? `x · ${par(u[i])}` : `${par(n[i])} · ${par(u[i])}`).join(' + ')} = 0${TRENN}${koef(u[j], 'x')} ${rest > 0 ? '+' : '−'} ${fmt(Math.abs(rest))} = 0&nbsp;| ${rest > 0 ? '−' : '+'} ${fmt(Math.abs(rest))}${TRENN}${u[j] === 1
                ? `x = <strong>${fmt(n[j])}</strong>`
                : `${koef(u[j], 'x')} = ${fmt(-rest)}&nbsp;| : ${par(u[j])}${TRENN}x = <strong>${fmt(n[j])}</strong>`}${TRENN}Probe mit dem zweiten Spannvektor: ${vname('n')} · ${vname('v')} = ${einsetzen(n, v)} ✓ – ${vname('n')} = ${vek(n)} steht wirklich auf beiden senkrecht und ist damit ein Normalenvektor von E.`
            };
          }

          /* --- parallele Ebene durch einen Punkt --- */
          const n = normaleKlein();
          const P = punktOhneNull(6);
          const dF = skalar(n, P);
          let dE = rndNonZero(-14, 14);
          for (let i = 0; i < 60 && dE === dF; i++) dE = rndNonZero(-14, 14);
          if (dE === dF) dE = dF + 1;
          /* Die Ablenker sind die Fehler, die man wirklich macht: das Vorzeichen
             der ganzen Rechnung gedreht, ein Produkt im Vorzeichen vertan, einen
             Summanden vergessen, die Zahl aus E abgeschrieben, die Koordinaten
             addiert statt das Skalarprodukt gebildet. Welche drei davon genommen
             werden, entscheidet der gewürfelte Zielrang – siehe `zahlenMitRang`. */
          const kandidaten = [
            -dF,
            dF - 2 * n[0] * P[0], dF - 2 * n[1] * P[1], dF - 2 * n[2] * P[2],
            dF - n[0] * P[0], dF - n[1] * P[1], dF - n[2] * P[2],
            dE, P[0] + P[1] + P[2]
          ];
          const falsch = zahlenMitRang(dF, shuffle(kandidaten), rnd(0, 3));
          /* Grund je Zahl, parallel zu `kandidaten`. Führen zwei Fehler auf dieselbe
             Zahl (−dF = dE, n₁P₁ = n₂P₂, …), bleibt sie ohne Grund – ebenso die
             Notnagel-Werte aus `zahlenMitRang`, die aus keinem Fehler stammen. */
          const fehlerGrund = [
            'Hier hat die Zahl rechts das falsche Vorzeichen – das ganze Skalarprodukt ist umgedreht.',
            ...[0, 1, 2].map(i => `Hier ist beim Einsetzen der Summand für ${VAR[i]} mit falschem Vorzeichen gezählt.`),
            ...[0, 1, 2].map(i => `Hier fehlt beim Einsetzen der Summand für ${VAR[i]}.`),
            `Das ist die Zahl aus E – diese Gleichung beschreibt E selbst, und P liegt nicht in E.`,
            `Hier sind nur die Koordinaten von P addiert, ohne sie mit den Komponenten von ${vname('n')} zu multiplizieren.`
          ];
          /* Ein Fehler, der nicht als Ablenker gebaut wird, aber auf dieselbe Zahl
             führen kann: die Minuszeichen von n, von P oder der Produkte übersehen.
             Trifft das genau EINEN Summanden, ist es der Vorzeichenfehler eines
             Summanden, trifft es alle DREI, ist es −dF – beides steht schon richtig
             in der Liste. Bei genau ZWEI Summanden entsteht eine Zahl, die zufällig
             wie „Summand vergessen“ aussehen kann (3x₁ − 4x₂ + 2x₃ mit P(3 | −5 | −5):
             9 − 20 + 10 = −1). Solche Zahlen bleiben deshalb ohne Grund. */
          const vzUebersehen = [
            [0, 1, 2].filter(i => n[i] < 0), [0, 1, 2].filter(i => P[i] < 0), [0, 1, 2].filter(i => n[i] * P[i] < 0)
          ].filter(S => S.length === 2).map(S => dF - 2 * S.reduce((s, i) => s + n[i] * P[i], 0));
          const grundZu = w => {
            if (vzUebersehen.includes(w)) return null;
            const g = [...new Set(kandidaten.map((k, m) => (k === w ? fehlerGrund[m] : null)).filter(Boolean))];
            return g.length === 1 ? g[0] : null;
          };
          const richtig = ebeneForm(n, dF);
          const mc = makeChoice(richtig, falsch.map(w => ebeneForm(n, w)), falsch.map(grundZu));
          return {
            q: `Die Ebene F ist parallel zur Ebene E: ${ebeneForm(n, dE)} und geht durch den Punkt ${punkt('P', P)}. Welche Gleichung beschreibt F?`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `Parallele Ebenen haben dieselbe Richtung, also denselben Normalenvektor ${vek(n)} – die linke Seite bleibt unverändert. Nur die Zahl rechts ändert sich.${TRENN}Sie ist das Skalarprodukt aus ${vname('n')} und dem Ortsvektor des gegebenen Punktes: d = ${einsetzen(n, P)}${TRENN}<strong>F: ${richtig}</strong>${TRENN}Die Zahl ${fmt(dE)} aus E einfach zu übernehmen wäre falsch: Dann bekäme man E zurück, und P liegt nicht in E.`
          };
        }

        /* ============================================================
           Stufe 3 – Schnitt, Lage und Abstand
           ============================================================ */
        const art = rnd(1, 6);

        /* --- Schnittpunkt einer Geraden mit der Ebene --- */
        if (art === 1) {
          const n = normaleKlein();
          let S = punktOhneNull(4), u = richtungsVektor(3), t0 = choice([-3, -2, 2, 3]);
          let p = [0, 1, 2].map(i => S[i] - t0 * u[i]);
          /* Drei Bedingungen: n · u darf nicht null sein (sonst gibt es keinen
             Schnittpunkt), keine zwei Zeilen dürfen dieselben Zahlen tragen –
             sonst stünde dieselbe Rechnung zweimal wortgleich im Lösungsweg –,
             und der Aufpunkt braucht Koordinaten ungleich null: „(0 − t)“ ist
             keine Klammer, sondern ein Schritt, der nichts tut. */
          for (let i = 0; i < 200; i++) {
            if (skalar(n, u) !== 0 && p.every(c => c !== 0)
              && new Set([0, 1, 2].map(k => `${p[k]},${u[k]}`)).size === 3) break;
            S = punktOhneNull(4); u = richtungsVektor(3); t0 = choice([-3, -2, 2, 3]);
            p = [0, 1, 2].map(k => S[k] - t0 * u[k]);
          }
          const d = skalar(n, S);
          const np = skalar(n, p), su = skalar(n, u);
          const klammer = i => `(${fmt(p[i])} ${u[i] > 0 ? '+' : '−'} ${koef(Math.abs(u[i]), 't')})`;
          /* Ist n · p zufällig null, entfiele der Schritt „| + 0“ – ein Rechenschritt,
             der nichts tut. Dann steht die nach t sortierte Gleichung schon da. */
          const sortiert = np === 0
            ? `${koef(su, 't')} = ${fmt(d)}`
            : `${fmt(np)} ${su > 0 ? '+' : '−'} ${koef(Math.abs(su), 't')} = ${fmt(d)}&nbsp;| ${np > 0 ? '−' : '+'} ${fmt(Math.abs(np))}${TRENN}${su === 1 ? `t = ${fmt(d - np)}` : `${koef(su, 't')} = ${fmt(d - np)}`}`;
          const eingesetzt = [0, 1, 2].map((i, k) => {
            const a = Math.abs(n[i]);
            const kern = a === 1 ? klammer(i) : `${fmt(a)} · ${klammer(i)}`;
            return k === 0 ? (n[i] < 0 ? `−${kern}` : kern) : (n[i] < 0 ? ' − ' : ' + ') + kern;
          }).join('');
          /* Die ausmultiplizierte Zeile steht eigens da, wie im Beispiel „Der
             Anflug" („6 + 2t + 16 − 2t + 20 − 4t = 30, zusammengefasst 42 − 4t
             = 30"). Vorher kündigte der Weg „Ausmultiplizieren“ an und nannte
             nur das Ergebnis – bei drei Klammern mit Vorzeichen davor steckt der
             Fehler aber meist in einem einzelnen Summanden. Ein Glied null
             (Aufpunkt mit einer 0, nur wenn die Suche oben scheitert) lässt
             `linText` weg, statt „+ 0“ zu schreiben. */
          const ausmult = linText([0, 1, 2].flatMap(i => [[n[i] * p[i], ''], [n[i] * u[i], 't']]));
          return {
            q: `Berechne den Schnittpunkt der Geraden g mit der Ebene E.<br>g: ${geradeForm(p, u)}<br>E: ${ebeneForm(n, d)} ${PUNKT_HINWEIS}`,
            type: 'input', placeholder: 'z. B. 3; −1; 5',
            check: orderedCheck(S), testAnswer: S.join('; '),
            answerText: punkt('S', S),
            solution: `Ein Punkt von g hat die Koordinaten (${[0, 1, 2].map(i => `${fmt(p[i])} ${u[i] > 0 ? '+' : '−'} ${koef(Math.abs(u[i]), 't')}`).join(' | ')}). Diese drei Ausdrücke in E einsetzen:${TRENN}${eingesetzt} = ${fmt(d)}${TRENN}Ausmultipliziert: ${ausmult} = ${fmt(d)}, zusammengefasst ${sortiert}${su === 1 ? '' : `&nbsp;| : ${par(su)}${TRENN}t = ${fmt(t0)}`}${TRENN}Dieses t in g einsetzen:${TRENN}${[0, 1, 2].map(i => `${fmt(p[i])} + ${par(t0)} · ${par(u[i])} = ${fmt(S[i])}`).join(TRENN)}${TRENN}Der Schnittpunkt ist <strong>${punkt('S', S)}</strong>.${TRENN}Probe: ${einsetzen(n, S)} – das ist die Zahl rechts. ✓`
          };
        }

        /* --- Lagebeziehung Gerade und Ebene --- */
        if (art === 2) {
          /* Der Richtungsvektor wird in ALLEN drei Lagen auf dieselbe Weise
             gezogen: als ganzzahliger Vektor, der auf irgendeinem kleinen
             Normalenvektor senkrecht steht. In den beiden parallelen Fällen ist
             das n selbst, im schneidenden Fall ein anderer solcher Vektor n′
             (mit n · u ≠ 0 nachgeprüft).

             Genau hier steckte der schwerste Fehler des Vorgängerthemas: Dort
             stammten die parallelen Fälle aus einem größeren Zahlenbereich, und
             wer eine 4 oder eine 5 sah, konnte „schneidet“ ausschließen – ein
             Drittel der Aufgaben ohne ein einziges Skalarprodukt lösbar. Ein
             bloß gleicher Würfel genügt dagegen nicht: Die Bedingung n · u = 0
             verbiegt die Verteilung von u für sich genommen schon, und damit war
             „u enthält eine 3“ ein Hinweis (55 % gegen 34 %). Über den Umweg
             n′ ziehen beide Seiten aus derselben verbogenen Verteilung.
             Nachgemessen über 10 000 Ziehungen: max |u| 45,6 / 44,9 / 46,1 %,
             jeder einzelne Betrag auf einen Prozentpunkt gleich häufig – an den
             Zahlen ist die Lage nicht mehr abzulesen. */
          let n = normaleKlein(), u = null;
          const lage = rnd(1, 3);                    // 1 schneidet, 2 echt parallel, 3 liegt darin
          for (let versuch = 0; versuch < 40 && !u; versuch++) {
            if (lage === 1) {
              const w = senkrechteRichtung(normaleKlein());
              if (w && skalar(n, w) !== 0) u = w;
            } else u = senkrechteRichtung(n);
            if (!u) n = normaleKlein();
          }
          if (!u) { n = [1, 2, 2]; u = lage === 1 ? [1, 1, 1] : [2, 1, -2]; }
          const p = punktOhneNull(5);
          const np = skalar(n, p);
          const d = lage === 3 ? np : lage === 2 ? np + rndNonZero(-6, 6) : np + rnd(-6, 6);
          const su = skalar(n, u);
          const opts = [
            'Sie schneiden sich in genau einem Punkt.',
            'g verläuft parallel zu E und hat keinen Punkt mit E gemeinsam.',
            'g liegt vollständig in E.'
          ];
          const anfang = `Entscheidend ist zuerst der Richtungsvektor: Steht er senkrecht auf ${vname('n')} = ${vek(n)}, so läuft g in der Ebene mit.${TRENN}${vname('n')} · ${vname('u')} = ${einsetzen(n, u)}${TRENN}`;
          const punktprobe = `Jetzt entscheidet der Aufpunkt ${punkt('P', p)}: ${einsetzen(n, p)}, rechts steht ${fmt(d)}.${TRENN}`;
          /* Gründe je Lage, in der Reihenfolge von `opts`. In Lage 2 und 3 ist
             n · u = 0 gesichert (`senkrechteRichtung(n)`), in Lage 1 ausgeschlossen.
             Den Ausgang der Punktprobe nennt keiner – nur, dass sie entscheidet. */
          const schraeg = 'Der Richtungsvektor von g steht senkrecht auf dem Normalenvektor – g läuft also in Richtung der Ebene, nicht schräg zu ihr.';
          const LAGE_GRUND = [
            [null,
              'Parallel zu E läuft g nur, wenn der Richtungsvektor von g senkrecht auf dem Normalenvektor von E steht.',
              'Ein gemeinsamer Punkt genügt nicht: In E liegt g nur, wenn auch der Richtungsvektor senkrecht auf dem Normalenvektor steht.'],
            [schraeg, null, 'In E liegt g nur, wenn zusätzlich der Aufpunkt die Ebenengleichung erfüllt.'],
            [schraeg, 'Dass g in Richtung der Ebene läuft, lässt noch offen, ob g sogar in E liegt – das entscheidet der Aufpunkt.', null]
          ];
          return {
            q: `Wie liegt die Gerade g zur Ebene E?<br>g: ${geradeForm(p, u)}<br>E: ${ebeneForm(n, d)}`,
            type: 'choice', options: opts, correct: lage - 1, gruende: LAGE_GRUND[lage - 1], answerText: opts[lage - 1],
            solution: anfang + (lage === 1
              ? `Das Skalarprodukt ist ${fmt(su)} und damit nicht null: g läuft schräg zur Ebene und <strong>schneidet sie in genau einem Punkt</strong>. Den bekommt man, indem man g in E einsetzt und nach t auflöst.`
              : punktprobe + (lage === 3
                ? `Beide Seiten stimmen überein – der Aufpunkt liegt in E, und weil g in der Ebene mitläuft, liegt <strong>g vollständig in E</strong>.`
                : `Die beiden Zahlen sind verschieden, der Aufpunkt liegt also nicht in E. Damit verläuft <strong>g echt parallel zu E</strong>: Sie läuft zwar in der Richtung der Ebene, geht aber an ihr vorbei – ohne einen einzigen gemeinsamen Punkt.`))
          };
        }

        /* --- Abstand eines Punktes von der Ebene --- */
        if (art === 3) {
          let n, L, d, P, m, vz;
          for (let i = 0; i < 200; i++) {
            [n, L] = normaleMitBetrag();
            d = skalar(n, punktOhneNull(5));
            if (d === 0) continue;          // „|42 − 0|“ wäre ein Schritt, der nichts tut
            m = rnd(1, 6); vz = choice([1, -1]);
            P = punktMit(n, d + vz * m * L, 9);
            if (P) break;
          }
          if (!P) { n = [1, 2, 2]; L = 3; d = 8; P = [5, 2, 4]; m = 3; vz = 1; }
          const links = skalar(n, P);
          return {
            q: `Wie weit ist der Punkt ${punkt('P', P)} von der Ebene E: ${ebeneForm(n, d)} entfernt?`,
            type: 'input', placeholder: 'Abstand in LE',
            check: numCheck(m), testAnswer: String(m),
            // plural, sonst stünde bei jeder sechsten Aufgabe „1 Längeneinheiten“.
            answerText: `${fmt(m)} ${plural(m, 'Längeneinheit', 'Längeneinheiten')}`,
            solution: `Die hessesche Normalform misst den Abstand: Man setzt den Punkt in die linke Seite ein, zieht die Zahl rechts ab und teilt durch den Betrag des Normalenvektors.${TRENN}|${vname('n')}| = √(${n.map(k => `${par(k)}²`).join(' + ')}) = √${fmt(L * L)} = ${fmt(L)}${TRENN}${vname('n')} · ${vname('OP')} = ${einsetzen(n, P)}${TRENN}Abstand = ${frac(`|${fmt(links)} − ${par(d)}|`, fmt(L))} = ${frac(fmt(Math.abs(links - d)), fmt(L))} = <strong>${fmt(m)}</strong>${TRENN}Ohne das Teilen durch |${vname('n')}| käme ${fmt(Math.abs(links - d))} heraus – das ist kein Abstand, sondern hängt davon ab, wie groß die Zahlen in der Gleichung zufällig sind.`
          };
        }

        /* --- Abstand zweier paralleler Ebenen --- */
        if (art === 4) {
          const [n, L] = normaleMitBetrag();
          /* Bis 8 statt bis 6: Beide Abstandsaufgaben der Stufe hätten sonst
             genau dieselben sechs möglichen Antworten. */
          const m = rnd(1, 8), vz = choice([1, -1]);
          // Keine der beiden Zahlen darf null sein – sonst stünde im Lösungsweg
          // „|15 − 0|“, ein Rechenschritt ohne Inhalt.
          let d1 = skalar(n, punktOhneNull(5));
          for (let i = 0; i < 60 && (d1 === 0 || d1 + vz * m * L === 0); i++) d1 = skalar(n, punktOhneNull(5));
          if (d1 === 0 || d1 + vz * m * L === 0) d1 = m * L + 1;
          const d2 = d1 + vz * m * L;
          const k = choice([1, 1, -1, 2]);           // F wird gestreckt dargestellt
          const nF = malV(k, n), dF = k * d2;
          return {
            q: `Die beiden Ebenen sind parallel. Wie weit sind sie voneinander entfernt?<br>E: ${ebeneForm(n, d1)}<br>F: ${ebeneForm(nF, dF)}`,
            type: 'input', placeholder: 'Abstand in LE',
            check: numCheck(m), testAnswer: String(m),
            answerText: `${fmt(m)} ${plural(m, 'Längeneinheit', 'Längeneinheiten')}`,
            solution: (k === 1
              ? `Beide Gleichungen haben schon dieselbe linke Seite, die Ebenen sind also wirklich parallel.${TRENN}`
              : `Zuerst müssen beide Gleichungen denselben Normalenvektor tragen. In F steckt das ${fmt(k)}-Fache von ${vek(n)}; teilt man die ganze Gleichung durch ${par(k)}, wird daraus F: ${ebeneForm(n, d2)}.${TRENN}Erst jetzt darf man die beiden Zahlen rechts vergleichen – vorher vergleicht man Äpfel mit Birnen.${TRENN}`)
              + `|${vname('n')}| = √(${n.map(c => `${par(c)}²`).join(' + ')}) = √${fmt(L * L)} = ${fmt(L)}${TRENN}Abstand = ${frac(`|${fmt(d1)} − ${par(d2)}|`, fmt(L))} = ${frac(fmt(Math.abs(d1 - d2)), fmt(L))} = <strong>${fmt(m)}</strong>${TRENN}Dahinter steckt nichts Neues: Man nimmt irgendeinen Punkt von E und bestimmt seinen Abstand von F – der ist für alle Punkte von E derselbe, weil die Ebenen parallel sind.`
          };
        }

        /* --- Koordinatenform aus der Parameterform --- */
        if (art === 5) {
          const E = parameterEbene(4, 3, w => w.every(c => c !== 0 && Math.abs(c) <= 9)
            && new Set(w.map(Math.abs)).size === 3)
            || { A: [1, 2, 1], u: [1, 2, -1], v: [2, -1, 1], n: [1, -3, -5] };
          const { A, u, v, n } = E;
          let d = skalar(n, A);
          // d = 0 wäre ungünstig: Dann beschriebe auch die im Vorzeichen gedrehte
          // Gleichung dieselbe Ebene, und ein Ablenker wäre in Wahrheit richtig.
          for (let i = 0; i < 40 && d === 0; i++) { E.A = punktOhneNull(4); d = skalar(n, E.A); }
          if (d === 0) { E.A = plusV(A, n); d = skalar(n, E.A); }
          const A2 = E.A;
          const richtig = ebeneForm(n, d);
          /* Vier Möglichkeiten als 2×2-Feld: zwei linke Seiten, zwei Zahlen
             rechts, jede Kombination genau einmal. Vorher standen DREI
             Möglichkeiten mit der richtigen linken Seite und nur eine mit einer
             falschen – wer die doppelt vorkommende linke Seite suchte, hatte ohne
             jede Rechnung eine Auswahl von zwei statt vier. Gemessen: In 100 %
             der Ziehungen gehörte die Lösung zur mehrfach vorkommenden Seite.
             Jetzt kommt jede linke Seite zweimal vor und jede Zahl rechts
             ebenfalls; erst n UND d zusammen entscheiden.
             Zusammenfallen können die vier nicht: n hat drei verschiedene
             Beträge, also ist die Vertauschung wirklich ein anderer Vektor, und
             d₂ ≠ d ist gesichert. Die beiden letzten Einträge sind trotzdem als
             Reserve dabei, damit die Auswahl niemals schrumpft. */
          const nT = [n[1], n[0], n[2]];
          const d2 = d + rndNonZero(-6, 6);
          const ablenker = [
            ebeneForm(n, d2), ebeneForm(nT, d), ebeneForm(nT, d2),
            ebeneForm([n[0], n[2], n[1]], d), ebeneForm([n[2], n[1], n[0]], d2)
          ];
          /* (n, d₂): Der Stützpunkt erfüllt sie nicht, weil n · A = d ≠ d₂.
             (nT, d): nT steht nie auf beiden Spannvektoren senkrecht – sonst wäre
             nT ein Vielfaches von n, bei drei verschiedenen Beträgen unmöglich.
             (nT, d₂) bleibt ohne Grund: Er wäre derselbe wie bei (nT, d), und ob
             der Stützpunkt die Gleichung erfüllt, hängt dort vom Zufall ab. */
          const mc = makeChoice(richtig, ablenker, [
            'Der Stützpunkt der Parameterform erfüllt diese Gleichung nicht.',
            'Der Vektor aus den Koeffizienten steht nicht auf beiden Spannvektoren senkrecht.',
            null, null, null
          ]);
          return {
            q: `Welche Koordinatenform beschreibt dieselbe Ebene?<br>E: ${paramForm(A2, u, v)}`,
            type: 'choice', options: mc.options, correct: mc.correct, gruende: mc.gruende, answerText: richtig,
            solution: `Gesucht ist zuerst ein Vektor ${vname('n')}, der auf beiden Spannvektoren senkrecht steht – er ist der Normalenvektor der Ebene. Senkrecht heißt: Das Skalarprodukt ist null.${TRENN}I: ${vname('n')} · ${vname('u')} = 0:&nbsp;${bedingung(u)} = 0${TRENN}II: ${vname('n')} · ${vname('v')} = 0:&nbsp;${bedingung(v)} = 0${TRENN}Zwei Gleichungen, drei Unbekannte: Eine Komponente wird eliminiert, eine darf man frei wählen.${TRENN}${normalenWeg(u, v, n).join(TRENN)}${TRENN}${vname('n')} = ${vek(n)}${TRENN}Probe: ${vname('n')} · ${vname('u')} = ${einsetzen(n, u)} ✓ und ${vname('n')} · ${vname('v')} = ${einsetzen(n, v)} ✓${TRENN}Die Zahl rechts liefert der Stützpunkt ${punkt('A', A2)}: d = ${vname('n')} · ${vname('OA')} = ${einsetzen(n, A2)}${TRENN}<strong>E: ${richtig}</strong>${TRENN}Bei den anderen Vorschlägen sind entweder zwei Koeffizienten vertauscht – dann steht der Vektor nicht mehr senkrecht auf beiden Spannvektoren – oder die Zahl rechts passt nicht zum Stützpunkt.`
          };
        }

        /* --- Lage zweier Ebenen --- */
        const n1 = normaleKlein();
        const d1 = skalar(n1, punktOhneNull(5));
        const lage = rnd(1, 3);                      // 1 identisch, 2 echt parallel, 3 Schnittgerade
        let m2 = n1, e2 = d1;
        if (lage === 2) e2 = d1 + rndNonZero(-8, 8);
        if (lage === 3) {
          m2 = normaleKlein();
          for (let i = 0; i < 60 && kreuz(n1, m2).every(c => c === 0); i++) m2 = normaleKlein();
          e2 = skalar(m2, punktOhneNull(5));
        }
        /* Beide Gleichungen werden mit demselben Faktor k gestreckt – auch die des
           schneidenden Falls. Sonst hätten die parallelen Fälle sichtbar größere
           Zahlen, und man könnte sie zählen statt rechnen. */
        const k2 = choice([-3, -2, -1, 2, 3]);
        const nF = malV(k2, m2), dF = k2 * e2;
        const quotienten = [0, 1, 2].map(i => quot(nF[i], n1[i]));
        const quotZeile = [0, 1, 2].map(i => `${fmt(nF[i])} : ${par(n1[i])} = ${quotienten[i]}`).join(', ');
        const zweiGleich = new Set(quotienten).size === 2;
        const opts2 = [
          'E und F sind dieselbe Ebene.',
          'E und F sind parallel und haben keinen gemeinsamen Punkt.',
          'E und F schneiden sich in einer Geraden.'
        ];
        /* Gründe je Lage. k₂ ist nie 1, also tragen E und F im identischen Fall
           sichtbar verschiedene Zahlen – genau daran hängt der typische Fehler. */
        const vielfache = 'Die Normalenvektoren sind Vielfache voneinander – solche Ebenen schneiden sich nie in einer Geraden.';
        const LAGE2_GRUND = [
          [null, 'Andere Zahlen heißen noch nicht andere Ebene: Erst auf denselben Normalenvektor bringen, dann die Zahlen rechts vergleichen.', vielfache],
          ['Dieselbe Ebene sind E und F nur, wenn nach dem Angleichen der Normalenvektoren auch die Zahlen rechts übereinstimmen.', null, vielfache],
          ['Dieselbe Ebene wäre es nur, wenn F nach dem Teilen durch einen Faktor Zeile für Zeile E ergäbe.',
            'Parallel sind Ebenen nur, wenn ihre Normalenvektoren Vielfache voneinander sind – mit demselben Faktor in allen drei Zeilen.', null]
        ];
        return {
          q: `Wie liegen die beiden Ebenen zueinander?<br>E: ${ebeneForm(n1, d1)}<br>F: ${ebeneForm(nF, dF)}`,
          type: 'choice', options: opts2, correct: lage - 1, gruende: LAGE2_GRUND[lage - 1], answerText: opts2[lage - 1],
          /* Der Vergleich wird Zeile für Zeile vorgerechnet, wie überall in der
             Reihe („Zeile 1: −6 : 2 = −3 …“, bei `geraden` die drei Quotienten).
             Vorher behauptete der Weg im schneidenden Fall nur „und das ist er
             nicht" – in gut jeder achten dieser Ziehungen liefern aber zwei
             Zeilen denselben Faktor, genau die Falle „zwei Zeilen genügen nicht“.
             Alle Komponenten von n₁ sind ungleich null, die Quotienten also
             immer definiert. */
          solution: `Zuerst die Normalenvektoren ${vek(n1)} und ${vek(nF)} vergleichen, Zeile für Zeile:${TRENN}${quotZeile}${TRENN}`
            + (lage === 3
              ? `${zweiGleich ? 'Zwei Zeilen liefern denselben Faktor, die dritte einen anderen – zwei passende Zeilen genügen nicht' : 'Die Faktoren sind verschieden'}: ${vek(nF)} ist kein Vielfaches von ${vek(n1)}. Die Ebenen stehen also schief zueinander und <strong>schneiden sich in einer Geraden</strong>.`
              : `Überall derselbe Faktor, also ${vek(nF)} = ${k2 === -1 ? `−${vek(n1)}` : `${fmt(k2)} · ${vek(n1)}`} – die Normalenvektoren sind Vielfache voneinander, die Ebenen sind damit parallel oder identisch.${TRENN}Jetzt entscheidet die Zahl rechts: Teilt man die Gleichung von F durch ${par(k2)}, so lautet sie F: ${ebeneForm(m2, e2)}.${TRENN}`
              + (lage === 1
                ? `Beide Gleichungen sind jetzt Zeile für Zeile gleich – <strong>E und F sind dieselbe Ebene</strong>, nur verschieden aufgeschrieben.`
                : `Links steht dasselbe, rechts ${fmt(d1)} gegen ${fmt(e2)}. Kein Punkt kann beide Gleichungen erfüllen, also sind <strong>E und F echt parallel</strong>.`))
        };
      }
    };
  })();

  return [vektoren, geraden, skalarprodukt, ebenen];
})();
