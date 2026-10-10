/* ============================================================
   MatheNils – Erklärseiten: Mittelstufe Teil 2
   Potenzen · Flächen · Volumen · Pythagoras · Trigonometrie ·
   Statistik · Wahrscheinlichkeit
   ============================================================ */
'use strict';

const LEARN_MITTEL2 = (() => {
  const { frac } = Util;
  return {

    /* ---------- Potenzen & Wurzeln ---------- */
    potenzen: `
      <h2>Potenzen und Wurzeln</h2>
      <p>Potenzen kürzen lange Multiplikationen ab – und machen sehr große wie sehr kleine
      Zahlen überhaupt erst handhabbar.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Blatt Papier wird gefaltet: 1-mal → 2 Lagen, 2-mal → 4 Lagen, 3-mal → 8 Lagen.
        Nach 20 Faltungen müsste man 2 · 2 · 2 · … zwanzigmal aufschreiben.</p>
        <span class="frage">Wie schreibt man das kurz – und wie rechnet man damit?</span>
      </div>

      <h3>Die Idee: Der Exponent zählt die Faktoren</h3>
      <p>a<sup>n</sup> bedeutet: Die <strong>Basis</strong> a tritt n-mal als Faktor auf.
      2<sup>20</sup> = 1 048 576 – über eine Million Lagen. Diese Kurzschreibweise ist nicht nur
      bequem, sie macht auch das Rechnen einfacher.</p>

      <div class="herleitung-box"><span class="box-title">Warum werden Exponenten addiert?</span>
        <p>x³ · x⁴ = (x·x·x) · (x·x·x·x). Zähle einfach die Faktoren: es sind sieben, also x⁷.
        Deshalb gilt a<sup>m</sup> · a<sup>n</sup> = a<sup>m+n</sup> – die Regel folgt direkt
        aus dem Abzählen, man muss sie nicht auswendig glauben.<br>
        Und warum ist a⁰ = 1? Weil a³ : a³ einerseits a<sup>3−3</sup> = a⁰ ergibt und
        andererseits offensichtlich 1 ist.<br>
        Genauso einen Schritt weiter: a³ : a⁵ ergibt nach der Regel a<sup>3−5</sup> = a⁻²,
        ausgeschrieben aber ${frac('a·a·a', 'a·a·a·a·a')} = ${frac(1, 'a·a')} = ${frac(1, 'a²')}. Ein
        <strong>negativer Exponent</strong> ist also nichts Neues, sondern der Kehrwert:
        a<sup>−n</sup> = ${frac(1, 'a<sup>n</sup>')}.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Gesetz</th><th>Regel</th><th>Beispiel</th></tr>
        <tr><td>Gleiche Basis, mal</td><td>aᵐ · aⁿ = aᵐ⁺ⁿ</td><td>x³ · x⁴ = x⁷</td></tr>
        <tr><td>Gleiche Basis, geteilt</td><td>aᵐ : aⁿ = aᵐ⁻ⁿ</td><td>x⁷ : x⁵ = x²</td></tr>
        <tr><td>Potenz einer Potenz</td><td>(aᵐ)ⁿ = aᵐ·ⁿ</td><td>(x²)³ = x⁶</td></tr>
        <tr><td>Gleicher Exponent</td><td>aⁿ · bⁿ = (a·b)ⁿ</td><td>2³ · 5³ = 10³ = 1000</td></tr>
        <tr><td>Exponent 0</td><td>a⁰ = 1 (a ≠ 0)</td><td>2026⁰ = 1</td></tr>
        <tr><td>Negativer Exponent</td><td>a⁻ⁿ = ${frac(1, 'aⁿ')} (a ≠ 0)</td><td>2⁻³ = ${frac(1, 8)}</td></tr>
      </table></div>

      <h3>Wurzeln: die Umkehrung</h3>
      <p>√49 fragt: Welche positive Zahl mit sich selbst multipliziert ergibt 49? → 7.
      Die Kubikwurzel ∛64 fragt nach „hoch 3“: ∛64 = 4, denn 4³ = 64.</p>

      <div class="merkkasten"><span class="merk-title">Merke: Quadratzahlen bis 15 auswendig</span>
        <p>1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225<br>
        Wer sie kennt, zieht Wurzeln in Sekunden – und erkennt binomische Formeln schneller.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Prüfe, ob die <strong>Basen gleich</strong> sind – nur dann greifen die Potenzgesetze.</li>
        <li>Bestimme, welche Operation zwischen den Potenzen steht (·, : oder eine äußere Potenz).</li>
        <li>Wende genau das passende Gesetz an – Exponenten addieren, subtrahieren oder multiplizieren.</li>
        <li><strong>Kontrolle mit kleinen Zahlen:</strong> Setze x = 2 ein und rechne beide Seiten aus.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Potenzgesetze anwenden</span>
        <p>x³ · x⁴ = x<sup>7</sup>&ensp;<span class="trenn">•</span>&ensp;x⁷ : x⁵ = x<sup>2</sup>&ensp;<span class="trenn">•</span>&ensp;(x²)³ = x<sup>6</sup><br>
        <em>Probe mit x = 2:</em> 8 · 16 = 128 = 2⁷ ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Wurzeln im Kopf ziehen</span>
        <p>√144 = 12&ensp;<span class="trenn">•</span>&ensp;∛125 = 5&ensp;<span class="trenn">•</span>&ensp;√(9 · 16) = √9 · √16 = 3 · 4 = <strong>12</strong><br>
        Das Wurzelziehen darf man über ein <em>Produkt</em> verteilen – über eine Summe nicht.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Papier-Frage vom Anfang</span>
        <p>20 Faltungen → 2<sup>20</sup> = <strong>1 048 576 Lagen</strong>.<br>
        Bei 0,1 mm Papierdicke wären das über 100 Meter – exponentielles Wachstum in Reinform.</p>
      </div>
      <div class="example-box"><span class="ex-title">Verdoppeln mit Startwert</span>
        <p>Eine Kultur von 50 Bakterien verdoppelt sich jede Stunde. Nach 6 Stunden:<br>
        50 · 2 · 2 · 2 · 2 · 2 · 2 = 50 · 2<sup>6</sup> = 50 · 64 = <strong>3200 Bakterien</strong><br>
        Der Exponent zählt die Verdopplungen, der Startwert bleibt als Faktor davor stehen.
        Beim Papier war der Startwert 1 – ein einzelnes Blatt.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„x³ · x⁴ = x¹²“ – nein, das wären 3 · 4 Faktoren, es sind aber 3 + 4 = <strong>7</strong>.
        Multipliziert werden die Exponenten nur bei (x³)⁴ = x¹².<br>
        Ebenso falsch: √(a + b) = √a + √b. Probe: √(9+16) = 5, aber 3 + 4 = 7 ✗.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was ist 3⁰ + 5⁰?</summary>
          <p>1 + 1 = <strong>2</strong> – jede Zahl (außer 0) hoch 0 ergibt 1.</p></details>
        <details><summary>Vereinfache (2x³)².</summary>
          <p>Beide Faktoren quadrieren: 2² · (x³)² = <strong>4x⁶</strong></p></details>
        <details><summary>Warum ist 2⁻³ = ⅛?</summary>
          <p>Ein negativer Exponent bedeutet Kehrwert: 2⁻³ = 1/2³ = 1/8.
          Passend zum Muster 2³=8, 2²=4, 2¹=2, 2⁰=1, 2⁻¹=½ – jedes Mal halbieren.</p></details>
      </div>
    `,

    /* ---------- Flächen & Umfang ---------- */
    flaechen: `
      <h2>Flächeninhalt und Umfang</h2>
      <p>Umfang und Fläche beantworten zwei völlig verschiedene Fragen – und werden trotzdem
      häufig verwechselt.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Für einen rechteckigen Garten (12 m × 7 m) brauchst du zweierlei:
        einen Zaun rundherum und Rollrasen für die ganze Fläche.</p>
        <span class="frage">Welche Größe brauchst du wofür – und warum sind die Einheiten verschieden?</span>
      </div>

      <h3>Die Idee: Rand messen oder Fläche füllen</h3>
      <p>Der <strong>Umfang U</strong> ist die Länge der Randlinie – gemessen in cm, m, km (der Zaun).
      Der <strong>Flächeninhalt A</strong> gibt an, wie viele Einheitsquadrate hineinpassen –
      gemessen in cm², m² (der Rasen). Deshalb hat die Fläche immer eine „hoch 2“-Einheit.</p>

      <div class="herleitung-box"><span class="box-title">Warum wird beim Dreieck durch 2 geteilt?</span>
        <p>Nimm zwei identische Dreiecke und drehe eines um 180° – zusammen ergeben sie genau
        ein Parallelogramm mit der Fläche g · h. Ein Dreieck ist also die Hälfte davon:
        <strong>A = g · h : 2</strong>.<br>
        Und das Parallelogramm selbst? Schneide das überstehende Dreieck links ab und setze es
        rechts an – fertig ist ein Rechteck mit g · h.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Figur</th><th>Flächeninhalt</th><th>Umfang</th></tr>
        <tr><td>Rechteck</td><td>A = a · b</td><td>U = 2 · (a + b)</td></tr>
        <tr><td>Quadrat</td><td>A = a²</td><td>U = 4a</td></tr>
        <tr><td>Parallelogramm</td><td>A = g · h</td><td>Summe der Seiten</td></tr>
        <tr><td>Dreieck</td><td>A = g · h : 2</td><td>a + b + c</td></tr>
        <tr><td>Trapez</td><td>A = (a + c) : 2 · h</td><td>Summe der Seiten</td></tr>
        <tr><td>Kreis (Radius r)</td><td>A = π · r²</td><td>U = 2 · π · r</td></tr>
      </table></div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Kläre zuerst: Wird der <strong>Rand</strong> oder die <strong>Fläche</strong> gesucht?
        Die Einheit in der Frage verrät es.</li>
        <li>Figur bestimmen und die passende Formel wählen.</li>
        <li>Prüfe, ob wirklich die <strong>Höhe</strong> gegeben ist – nicht die schräge Seite.</li>
        <li>Einsetzen, rechnen und die Einheit mitschreiben (cm oder cm²).</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Rechteck: Zaun und Rasen</span>
        <p>a = 12 m, b = 7 m<br>
        Zaun: U = 2 · (12 + 7) = <strong>38 m</strong><br>
        Rasen: A = 12 · 7 = <strong>84 m²</strong><br>
        Zwei Fragen, zwei völlig verschiedene Zahlen ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Dreieck und Trapez</span>
        <p>Dreieck mit g = 8 cm, h = 5 cm: A = 8 · 5 : 2 = <strong>20 cm²</strong><br>
        Trapez mit a = 10 cm, c = 6 cm, h = 4 cm: A = (10 + 6) : 2 · 4 = <strong>32 cm²</strong><br>
        <em>Idee dahinter:</em> Beim Trapez rechnet man mit der <em>mittleren</em> Breite.</p>
      </div>
      <div class="example-box"><span class="ex-title">Kreis (mit π ≈ 3,14)</span>
        <p>r = 5 cm: A = 3,14 · 5² = 3,14 · 25 = <strong>78,5 cm²</strong><br>
        U = 2 · 3,14 · 5 = <strong>31,4 cm</strong><br>
        <em>Achtung:</em> Ist der Durchmesser d = 10 cm gegeben, erst halbieren!</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Zusammengesetzte Flächen</span>
        <p>Komplizierte Formen in Rechtecke, Dreiecke und Halbkreise <strong>zerlegen</strong> –
        oder zu einer großen Figur <strong>ergänzen</strong> und den überschüssigen Teil abziehen.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Gleicher Umfang bedeutet gleiche Fläche.“ – Nein! Ein 1×9-Rechteck und ein 5×5-Quadrat
        haben beide den Umfang 20, aber die Flächen 9 und 25.<br>
        Und beim Parallelogramm zählt die <strong>Höhe</strong>, nicht die schräge Seite.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Ein Quadrat hat die Fläche 49 cm². Wie lang ist der Umfang?</summary>
          <p>a = √49 = 7 cm → U = 4 · 7 = <strong>28 cm</strong></p></details>
        <details><summary>Was passiert mit der Fläche, wenn man alle Seiten verdoppelt?</summary>
          <p>Sie <strong>vervierfacht</strong> sich (2 · 2), denn beide Richtungen wachsen mit.</p></details>
        <details><summary>Wie berechnest du die Fläche eines Halbkreises mit r = 4 cm?</summary>
          <p>Ganzer Kreis: 3,14 · 16 = 50,24 cm² → Halbkreis: <strong>25,12 cm²</strong></p></details>
      </div>
    `,

    /* ---------- Körper & Volumen ---------- */
    volumen: `
      <h2>Körper: Volumen und Oberfläche</h2>
      <p>Vom zweidimensionalen Blatt zum dreidimensionalen Körper – jetzt kommt eine
      Richtung dazu.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Aquarium misst 40 cm × 30 cm × 25 cm. Du willst wissen, wie viele Liter Wasser
        hineinpassen – und wie viel Glas für die Herstellung nötig war.</p>
        <span class="frage">Welche Größe beantwortet welche Frage, und wie kommt man von cm³ zu Litern?</span>
      </div>

      <h3>Die Idee: Grundfläche mal Höhe</h3>
      <p>Das <strong>Volumen V</strong> zählt, wie viele Einheitswürfel hineinpassen (cm³, dm³, m³) –
      das Wasser. Die <strong>Oberfläche O</strong> ist die Summe aller Außenflächen (cm², m²) – das Glas.
      Bei Quader, Prisma und Zylinder gilt immer dasselbe Prinzip: <strong>Grundfläche · Höhe</strong>.</p>

      <div class="herleitung-box"><span class="box-title">Warum „Grundfläche mal Höhe“?</span>
        <p>Lege eine Schicht Würfel auf den Boden – das sind genau so viele, wie die Grundfläche
        Einheitsquadrate hat. Stapelt man h solcher Schichten übereinander, ergibt das
        G · h Würfel insgesamt.<br>
        Beim Zylinder ist die Grundfläche eben ein Kreis: V = π · r² · h. Dieselbe Idee, andere Grundfläche.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Körper</th><th>Volumen</th><th>Oberfläche</th></tr>
        <tr><td>Quader</td><td>V = a · b · c</td><td>O = 2 · (ab + ac + bc)</td></tr>
        <tr><td>Würfel</td><td>V = a³</td><td>O = 6 · a²</td></tr>
        <tr><td>Prisma</td><td>V = G · h</td><td>2 · G + Mantel</td></tr>
        <tr><td>Zylinder</td><td>V = π · r² · h</td><td>O = 2πr² + 2πr · h</td></tr>
      </table></div>

      <div class="merkkasten"><span class="merk-title">Merke: Volumen und Liter</span>
        <p><span class="formula">1 dm³ = 1 Liter</span></p>
        <p>1 cm³ = 1 ml&ensp;<span class="trenn">•</span>&ensp;1 m³ = 1000 Liter</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Körper erkennen und alle Maße in <strong>derselben Einheit</strong> notieren.</li>
        <li>Volumen: Grundfläche bestimmen, dann mit der Höhe multiplizieren.</li>
        <li>Oberfläche: alle Teilflächen einzeln berechnen und addieren (bei symmetrischen Körpern verdoppeln).</li>
        <li>Einheit prüfen: Volumen in cm³/Liter, Oberfläche in cm².</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Quader: Volumen und Oberfläche</span>
        <p>a = 4 cm, b = 3 cm, c = 5 cm<br>
        V = 4 · 3 · 5 = <strong>60 cm³</strong><br>
        O = 2 · (12 + 20 + 15) = 2 · 47 = <strong>94 cm²</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Die Aquarium-Frage vom Anfang</span>
        <p>V = 40 · 30 · 25 = 30 000 cm³ = 30 dm³ = <strong>30 Liter</strong><br>
        Glas (ohne Deckel): Boden 40 · 30 = 1200 cm², zwei Seiten je 40 · 25 = 1000 cm²,
        zwei Seiten je 30 · 25 = 750 cm² → 1200 + 2000 + 1500 = <strong>4700 cm²</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Würfel rückwärts</span>
        <p>V = 216 cm³ → a = ∛216 = <strong>6 cm</strong>, denn 6 · 6 · 6 = 216<br>
        Oberfläche dann: 6 · 36 = 216 cm² – zufällig dieselbe Zahl, aber eine andere Einheit!</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„1 m³ sind 100 dm³.“ – Nein, es sind <strong>1000</strong>, denn alle drei Richtungen
        werden umgerechnet: 10 · 10 · 10.<br>
        Und: Verdoppelt man alle Kanten, wird das Volumen <strong>achtmal</strong> so groß,
        nicht doppelt so groß.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie viele Liter fasst ein Würfel mit 20 cm Kante?</summary>
          <p>V = 8000 cm³ = 8 dm³ = <strong>8 Liter</strong></p></details>
        <details><summary>Zylinder mit r = 3 cm und h = 10 cm – wie groß ist V?</summary>
          <p>V = 3,14 · 9 · 10 = <strong>282,6 cm³</strong></p></details>
        <details><summary>Warum hat ein Prisma dieselbe Formel wie ein Quader?</summary>
          <p>Weil der Quader ein Spezialfall ist: Seine Grundfläche ist ein Rechteck (a · b),
          also V = G · h = a · b · c.</p></details>
      </div>
    `,

    /* ---------- Satz des Pythagoras ---------- */
    pythagoras: `
      <h2>Der Satz des Pythagoras</h2>
      <p>Er verbindet die drei Seiten eines rechtwinkligen Dreiecks – und ist damit das
      meistgenutzte Werkzeug der Geometrie.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Eine 5 m lange Leiter steht 3 m von der Hauswand entfernt.
        Messen kann man die Höhe am Haus nicht – dafür ist die Leiter im Weg.</p>
        <span class="frage">Wie hoch reicht die Leiter, ohne dass man hinaufklettert und misst?</span>
      </div>

      <h3>Die Idee: Aus zwei Seiten folgt die dritte</h3>
      <p>Im rechtwinkligen Dreieck heißen die beiden Seiten am rechten Winkel
      <strong>Katheten</strong> (a, b), die längste Seite gegenüber ist die
      <strong>Hypotenuse</strong> (c). Kennt man zwei davon, ist die dritte festgelegt –
      sie kann gar nicht anders sein.</p>

      <div class="herleitung-box"><span class="box-title">Warum gilt a² + b² = c²?</span>
        <p>Zeichne ein Quadrat mit der Seitenlänge a + b und lege vier gleiche rechtwinklige
        Dreiecke hinein. In der Mitte bleibt ein Quadrat mit der Seite c übrig – das
        <strong>Hypotenusenquadrat</strong> mit der Fläche c².<br>
        Ordnet man dieselben vier Dreiecke anders an, bleiben stattdessen die beiden
        <strong>Kathetenquadrate</strong> mit den Flächen a² und b² frei. Da beide Male dieselbe
        Restfläche übrig bleibt, muss gelten: <strong>a² + b² = c²</strong>.<br>
        In Worten: Die beiden Kathetenquadrate sind zusammen genauso groß wie das Hypotenusenquadrat.
        Mit a = 3 cm und b = 4 cm haben die Kathetenquadrate 9 cm² und 16 cm². Das Hypotenusenquadrat
        hat also 25 cm² und die Seite c = √25 = 5 cm.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">a² + b² = c²</span></p>
        <p>Nach einer Kathete umgestellt: b² = c² − a²<br>
        Gilt <strong>nur</strong> in rechtwinkligen Dreiecken. In beiden Formen ist c die Hypotenuse, die Seite gegenüber dem rechten Winkel.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Skizze</strong> zeichnen und den rechten Winkel markieren.</li>
        <li><strong>Hypotenuse identifizieren:</strong> Sie liegt gegenüber dem rechten Winkel
        und ist die längste Seite.</li>
        <li>Formel passend aufstellen – Hypotenuse gesucht → addieren, Kathete gesucht → subtrahieren.</li>
        <li>Wurzel ziehen und mit Einheit notieren.</li>
        <li><strong>Plausibilität:</strong> Die Hypotenuse muss länger sein als jede Kathete.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Hypotenuse gesucht</span>
        <p>a = 6 cm, b = 8 cm<br>
        c² = 6² + 8² = 36 + 64 = 100 → c = √100 = <strong>10 cm</strong><br>
        <em>Zwischenstand:</em> c² = 100 cm² ist die Fläche des Hypotenusenquadrats – erst die Wurzel liefert die Seite.<br>
        <em>Plausibel?</em> 10 &gt; 8 und 10 &gt; 6 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Leiter-Frage vom Anfang</span>
        <p>Die Leiter ist die Hypotenuse (c = 5 m), der Abstand eine Kathete (a = 3 m).<br>
        h² = c² − a² = 25 − 9 = 16 → h = <strong>4 m</strong><br>
        <em>Achtung:</em> Hier wird subtrahiert – wer 25 + 9 rechnet, erhält unmöglich große Werte.</p>
      </div>
      <div class="example-box"><span class="ex-title">Umkehrung: Ist das Dreieck rechtwinklig?</span>
        <p>Seiten 3, 4, 5: 9 + 16 = 25 = 5² ✓ → <strong>rechtwinklig</strong><br>
        Seiten 4, 5, 6: 16 + 25 = 41 ≠ 36 → nicht rechtwinklig<br>
        <em>Praxis:</em> Mit einem 3-4-5-Knotenseil prüfen Handwerker bis heute rechte Winkel.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„a² + b² = c² gilt in jedem Dreieck.“ – Nein, ausschließlich im <strong>rechtwinkligen</strong>.<br>
        <em>Gegenbeispiel</em> gleichseitiges Dreieck mit 5 cm Seitenlänge: a² + b² = 25 + 25 = <strong>50</strong>,
        die dritte Seite liefert aber nur c² = 5² = <strong>25</strong> – die Gleichung ist um das Doppelte daneben.<br>
        Und: Die Hypotenuse ist nicht automatisch die Seite, die „c“ heißt, sondern die Seite
        <em>gegenüber dem rechten Winkel</em>. Ist eine Kathete gesucht, wird <strong>subtrahiert</strong>:
        Bei c = 10 cm und a = 6 cm ist b = √(100 − 36) = √64 = <strong>8 cm</strong>.
        Wer stattdessen addiert, erhält √136 ≈ 11,7 cm – eine Kathete, die länger wäre als die Hypotenuse.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie lang ist die Diagonale eines Rechtecks 9 cm × 12 cm?</summary>
          <p>d² = 81 + 144 = 225 → d = <strong>15 cm</strong></p></details>
        <details><summary>c = 13 cm, a = 5 cm – wie lang ist b?</summary>
          <p>b² = 169 − 25 = 144 → b = <strong>12 cm</strong></p></details>
        <details><summary>Warum ist die Hypotenuse immer die längste Seite?</summary>
          <p>Weil c² = a² + b² größer ist als a² und als b² allein – also ist auch c größer als a und b.</p></details>
      </div>
    `,

    /* ---------- Trigonometrie ---------- */
    trigonometrie: `
      <h2>Trigonometrie: Sinus, Kosinus, Tangens</h2>
      <p>Pythagoras verbindet drei Seiten. Die Trigonometrie geht weiter und verknüpft
      <strong>Seiten mit Winkeln</strong>.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Du stehst 50 m von einem Kirchturm entfernt und misst mit einer App den Blickwinkel
        zur Turmspitze: 38°. Pythagoras hilft nicht – du kennst nur <em>eine</em> Länge.</p>
        <span class="frage">Wie kommt man vom Winkel auf die Höhe des Turms?</span>
      </div>

      <h3>Die Idee: Seitenverhältnisse hängen nur vom Winkel ab</h3>
      <p>Vergrößert man ein rechtwinkliges Dreieck, ändern sich alle Seiten – ihr
      <strong>Verhältnis</strong> zueinander bleibt aber gleich. Zu jedem Winkel gehört also
      ein fester Zahlenwert. Genau diese Werte liefern sin, cos und tan.</p>

      <div class="herleitung-box"><span class="box-title">Warum funktioniert das überhaupt?</span>
        <p>Alle rechtwinkligen Dreiecke mit demselben Winkel α sind zueinander <strong>ähnlich</strong> –
        eines ist die vergrößerte Kopie des anderen. Bei Ähnlichkeit bleiben Seitenverhältnisse konstant.<br>
        Deshalb ist tan(38°) immer dieselbe Zahl (≈ 0,781), egal ob das Dreieck 5 cm oder 500 m groß ist.
        Der Taschenrechner muss den Wert nur einmal kennen.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: GAGA-HühnerHof-AG</span>
        <p>sin(α) = ${frac('Gegenkathete', 'Hypotenuse')}&ensp;<span class="trenn">•</span>&ensp;
        cos(α) = ${frac('Ankathete', 'Hypotenuse')}&ensp;<span class="trenn">•</span>&ensp;
        tan(α) = ${frac('Gegenkathete', 'Ankathete')}</p>
        <p>Der Spruch nennt vier Brüche: <strong>G</strong>/<strong>H</strong>, <strong>A</strong>/<strong>H</strong>, <strong>G</strong>/<strong>A</strong> und <strong>A</strong>/<strong>G</strong> – oben GAGA, unten HHAG („HühnerHof-AG“). Die ersten drei sind Sinus, Kosinus und Tangens; das vierte gehört zum Kotangens, den du in der Schule selten brauchst.</p>
        <p>Jede Seite trägt den Buchstaben ihres Gegenwinkels: <strong>a</strong> liegt α gegenüber,
        <strong>b</strong> liegt β gegenüber, <strong>c</strong> dem rechten Winkel – c ist die Hypotenuse.
        Also sin(α) = a/c, aber sin(β) = b/c: Gegen- und Ankathete hängen immer vom
        <strong>betrachteten Winkel</strong> ab!</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Skizze zeichnen, rechten Winkel und den Winkel α markieren.</li>
        <li>Seiten vom betrachteten Winkel aus benennen: Gegenkathete, Ankathete, Hypotenuse.</li>
        <li>Prüfe, welche zwei Seiten <strong>vorkommen</strong> (gegeben + gesucht) –
        das bestimmt, ob du sin, cos oder tan brauchst.</li>
        <li>Gleichung aufstellen und nach der gesuchten Größe auflösen.</li>
        <li>Taschenrechner auf <strong>DEG</strong> stellen und rechnen.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Seite mit dem Sinus berechnen</span>
        <p>Hypotenuse c = 10 cm, α = 30°, gesucht: Gegenkathete a<br>
        sin(30°) = a/10 → a = 10 · sin(30°) = 10 · 0,5 = <strong>5 cm</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Die Turm-Frage vom Anfang</span>
        <p>Gegeben: Ankathete 50 m, Winkel 38°, gesucht: Gegenkathete (Höhe)<br>
        Gegen- und Ankathete → <strong>Tangens</strong><br>
        tan(38°) = h/50 → h = 50 · tan(38°) ≈ 50 · 0,781 ≈ <strong>39,1 m</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Winkel mit der Umkehrfunktion</span>
        <p>Gegenkathete 4 cm, Ankathete 7 cm<br>
        tan(α) = 4/7 ≈ 0,571 → α = tan⁻¹(0,571) ≈ <strong>29,7°</strong><br>
        <em>Plausibel?</em> Die Gegenkathete ist kürzer → der Winkel muss unter 45° liegen ✓</p>
      </div>

      <div class="example-box"><span class="ex-title">Dieselbe Seite, zwei Namen</span>
        <p>Ein Dreieck mit a = 3 cm, b = 4 cm, c = 5 cm; die Seite a liegt dem Winkel α gegenüber.<br>
        Von α aus ist a die <strong>Gegenkathete</strong>: sin(α) = a/c = 3/5 = 0,6 → α ≈ 36,9°<br>
        Von β aus ist dieselbe Seite die <strong>Ankathete</strong>: cos(β) = a/c = 3/5 = 0,6 → β ≈ 53,1°<br>
        Die Seite hat sich nicht bewegt, nur der Blickwinkel. <em>Probe:</em> 36,9° + 53,1° = 90° –
        zusammen mit dem rechten Winkel ergibt das die 180° des Dreiecks.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>α</th><th>30°</th><th>45°</th><th>60°</th></tr>
        <tr><td>sin(α)</td><td>0,5</td><td>≈ 0,707</td><td>≈ 0,866</td></tr>
        <tr><td>cos(α)</td><td>≈ 0,866</td><td>≈ 0,707</td><td>0,5</td></tr>
        <tr><td>tan(α)</td><td>≈ 0,577</td><td>1</td><td>≈ 1,732</td></tr>
      </table></div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Die Gegenkathete ist immer die senkrechte Seite.“ – Nein, sie hängt vom Winkel ab:
        Betrachtest du den anderen spitzen Winkel, tauschen Gegen- und Ankathete die Rollen.<br>
        Technischer Klassiker: Der Taschenrechner steht auf RAD statt <strong>DEG</strong> –
        dann kommen völlig falsche Werte heraus (sin(30) wäre −0,988 statt 0,5).</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Welche Funktion brauchst du bei gegebener Hypotenuse und gesuchter Ankathete?</summary>
          <p>Den <strong>Kosinus</strong>: cos(α) = Ankathete/Hypotenuse.</p></details>
        <details><summary>Warum ist tan(45°) = 1?</summary>
          <p>Bei 45° sind Gegen- und Ankathete gleich lang – ihr Verhältnis ist also 1.</p></details>
        <details><summary>Eine Rampe ist 6 m lang und überwindet 1,5 m Höhe. Wie steil ist sie?</summary>
          <p>sin(α) = 1,5/6 = 0,25 → α = sin⁻¹(0,25) ≈ <strong>14,5°</strong></p></details>
        <details><summary>Warum ist cos(β) genauso groß wie sin(α)?</summary>
          <p>Beide sind derselbe Bruch a/c. Die Seite a liegt dem Winkel α gegenüber (Gegenkathete),
          und sie grenzt an β an (Ankathete). Die Hypotenuse c gehört zu beiden Winkeln.</p></details>
      </div>
    `,

    /* ---------- Statistik & Daten ---------- */
    statistik: `
      <h2>Daten auswerten: Mittelwert, Median & Co.</h2>
      <p>Kennwerte fassen viele Zahlen zu einer einzigen zusammen – aber welche man wählt,
      verändert die Aussage erheblich.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>In einer kleinen Firma verdienen fünf Personen: 2000, 2200, 2400, 2600 und 20 800 €.
        Der Chef wirbt mit „Durchschnittsgehalt 6000 €“.</p>
        <span class="frage">Ist das gelogen – oder nur geschickt ausgewählt?</span>
      </div>

      <h3>Die Idee: Verschiedene Kennwerte, verschiedene Fragen</h3>
      <p>Der <strong>Mittelwert</strong> verteilt die Summe gleichmäßig auf alle – er ist der
      „Ausgleichswert“. Der <strong>Median</strong> teilt die sortierten Daten in zwei Hälften –
      er beschreibt die typische Mitte. Beide sind korrekt berechnet und sagen doch etwas anderes.</p>

      <div class="herleitung-box"><span class="box-title">Warum reagiert der Median nicht auf Ausreißer?</span>
        <p>Der Mittelwert verrechnet <em>jeden</em> Wert mit seiner vollen Größe – ein einzelner
        Extremwert zieht ihn stark mit.<br>
        Der Median dagegen fragt nur nach der <strong>Position</strong>: Welcher Wert steht in der Mitte?
        Ob der größte Wert 20 800 oder 200 000 beträgt, ändert an dieser Position nichts.
        Deshalb ist er <strong>robust</strong>.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Kennwert</th><th>Berechnung</th><th>Gut geeignet für</th></tr>
        <tr><td>Mittelwert</td><td>Summe : Anzahl</td><td>gleichmäßig verteilte Daten</td></tr>
        <tr><td>Median</td><td>sortieren, Mitte nehmen</td><td>Daten mit Ausreißern</td></tr>
        <tr><td>Modalwert</td><td>häufigster Wert</td><td>Kategorien, Schuhgrößen</td></tr>
        <tr><td>Spannweite</td><td>größter − kleinster Wert</td><td>Streuung grob einschätzen</td></tr>
      </table></div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Daten <strong>sortieren</strong> – das ist für Median und Spannweite zwingend.</li>
        <li>Nach Ausreißern schauen: Gibt es einzelne extreme Werte?</li>
        <li>Kennwert passend wählen – bei Ausreißern eher den Median.</li>
        <li>Berechnen und das Ergebnis <strong>im Sachzusammenhang deuten</strong>.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Alle Kennwerte an einem Datensatz</span>
        <p>Daten: 3, 8, 5, 10, 4<br>
        Mittelwert: 30 : 5 = <strong>6</strong><br>
        Sortiert: 3, 4, <u>5</u>, 8, 10 → Median = <strong>5</strong><br>
        Spannweite: 10 − 3 = <strong>7</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Die Gehalts-Frage vom Anfang</span>
        <p>Mittelwert: 30 000 : 5 = <strong>6000 €</strong> – rechnerisch korrekt.<br>
        Median: sortiert 2000, 2200, <u>2400</u>, 2600, 20 800 → <strong>2400 €</strong><br>
        Vier von fünf Personen verdienen <em>weniger</em> als den Mittelwert.
        Der Chef lügt nicht, wählt aber den irreführenden Kennwert.</p>
      </div>
      <div class="example-box"><span class="ex-title">Median bei gerader Anzahl</span>
        <p>Daten: 2, 4, 6, 10 → die beiden mittleren sind 4 und 6<br>
        Median = (4 + 6) : 2 = <strong>5</strong> – er muss selbst kein Datenwert sein.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Rückwärts rechnen</span>
        <p>Ist der Mittelwert gegeben, kennst du die <strong>Summe</strong>: Summe = Mittelwert · Anzahl.
        Damit lassen sich fehlende Werte bestimmen.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Der Median ist der mittlere Wert der unsortierten Liste.“ – Erst <strong>sortieren</strong>!
        Bei 3, 8, 5, 10, 4 wäre sonst fälschlich 5 … zufällig richtig, bei 8, 3, 10, 4, 5 aber 10.<br>
        Und: „Durchschnitt“ meint umgangssprachlich fast immer den Mittelwert – prüfe bei Statistiken
        in den Medien, welcher Kennwert gemeint ist.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Nach 4 Tests ist der Schnitt 2,0. Drei Noten sind 1, 3, 2. Wie lautet die vierte?</summary>
          <p>Summe muss 4 · 2 = 8 sein, bisher 6 → vierte Note <strong>2</strong>.</p></details>
        <details><summary>Welchen Kennwert nutzt du für „das typische Einkommen“?</summary>
          <p>Den <strong>Median</strong> – er wird von wenigen Spitzenverdienern nicht verzerrt.
          Genau deshalb berichten Statistikämter Medianeinkommen.</p></details>
        <details><summary>Kann der Mittelwert kleiner als alle Werte sein?</summary>
          <p>Nein – er liegt immer zwischen dem kleinsten und dem größten Wert.
          Das ist eine gute Kontrolle für Rechenfehler.</p></details>
      </div>
    `,

    /* ---------- Wahrscheinlichkeit ---------- */
    wahrscheinlichkeit: `
      <h2>Wahrscheinlichkeiten berechnen</h2>
      <p>Zufall ist nicht vorhersagbar – aber berechenbar. Wahrscheinlichkeiten sagen,
      wie oft etwas auf <em>lange Sicht</em> eintritt.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>„Bei zwei Würfen ist die Chance auf mindestens eine Sechs doppelt so groß wie bei einem –
        also ${frac(2, 6)} = ${frac(1, 3)}.“ Das klingt einleuchtend.</p>
        <span class="frage">Stimmt diese Verdopplung – und was wäre dann bei sechs Würfen?</span>
      </div>

      <h3>Die Idee: Günstige durch mögliche Ergebnisse</h3>
      <p>Sind alle Ergebnisse gleich wahrscheinlich (fairer Würfel, faire Münze), spricht man
      von einem <strong>Laplace-Experiment</strong>. Dann genügt Abzählen.
      P liegt immer zwischen 0 (unmöglich) und 1 (sicher).</p>

      <div class="herleitung-box"><span class="box-title">Warum darf man bei mehreren Würfen nicht einfach addieren?</span>
        <p>Die Verdopplungs-Idee scheitert an einem Test: Bei <em>sechs</em> Würfen käme
        6 · ${frac(1, 6)} = 1 heraus – also die Sicherheit, eine Sechs zu würfeln.
        Jeder weiß, dass das falsch ist.<br>
        Richtig rechnet man über das <strong>Gegenereignis</strong>:
        P(mindestens eine 6) = 1 − P(keine einzige 6). Bei zwei Würfen:
        1 − ${frac(5, 6)} · ${frac(5, 6)} = 1 − ${frac(25, 36)} = ${frac(11, 36)} ≈ 0,306 –
        etwas weniger als die vermuteten 0,333.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">P(E) = günstige ⁄ mögliche Ergebnisse</span></p>
        <p><strong>Pfadregeln:</strong> Entlang eines Pfades <strong>multiplizieren</strong>,
        mehrere Pfade zum selben Ziel <strong>addieren</strong>.</p>
        <p>Gegenereignis: P(nicht E) = 1 − P(E)</p>
        <p><strong>Oder-Regel:</strong> Können zwei Ereignisse nicht gleichzeitig eintreten
        (<em>unvereinbar</em>), addierst du ihre Wahrscheinlichkeiten:
        P(rot oder blau) = P(rot) + P(blau).</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Sind alle Ergebnisse gleich wahrscheinlich? Dann darfst du abzählen –
        bei zweimal Würfeln sind das 6 · 6 = 36 Paare.</li>
        <li>Mehrstufig? <strong>Baumdiagramm</strong> zeichnen und die Pfade beschriften.
        Ohne Zurücklegen gelten ab dem zweiten Zug die neuen Anzahlen.</li>
        <li>Bei „mindestens“-Fragen zuerst an das <strong>Gegenereignis</strong> denken.</li>
        <li>Pfade multiplizieren, verschiedene Pfade zum selben Ziel addieren.</li>
        <li><strong>Kontrolle:</strong> Alle Pfadwahrscheinlichkeiten zusammen müssen 1 ergeben.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Drei Ereignisse am Würfel</span>
        <p>P(6) = ${frac(1, 6)}&ensp;<span class="trenn">•</span>&ensp;
        P(gerade) = ${frac(3, 6)} = ${frac(1, 2)}&ensp;<span class="trenn">•</span>&ensp;
        P(mindestens 5) = ${frac(2, 6)} = ${frac(1, 3)}<br>
        <em>Gegenereignis:</em> P(keine 6) = 1 − ${frac(1, 6)} = ${frac(5, 6)}</p>
      </div>
      <div class="example-box"><span class="ex-title">Rot oder blau am Glücksrad</span>
        <p>Ein Glücksrad hat 10 gleich große Felder: 3 rote, 3 blaue, 4 weiße.
        Das Rad bleibt auf <em>einem</em> Feld stehen – rot und blau zugleich geht nicht.
        Solche Ereignisse heißen <strong>unvereinbar</strong>, und dann darfst du addieren:<br>
        P(rot oder blau) = ${frac(3, 10)} + ${frac(3, 10)} = ${frac(6, 10)} = <strong>${frac(3, 5)}</strong><br>
        <em>Kontrolle durch Abzählen:</em> 3 + 3 = 6 günstige von 10 Feldern ✓<br>
        <em>Anders bei zwei Würfen:</em> „Sechs im ersten oder im zweiten Wurf“ ist nicht
        ${frac(1, 6)} + ${frac(1, 6)}. Der Doppelwurf (6, 6) steckt in beiden Summanden und
        würde doppelt gezählt. Richtig: ${frac(6, 36)} + ${frac(6, 36)} − ${frac(1, 36)} = ${frac(11, 36)} –
        der Wert aus der Herleitung.</p>
      </div>
      <div class="example-box"><span class="ex-title">Zwei Pfade zum selben Ziel</span>
        <p>Genau eine Sechs bei zwei Würfen – das geht auf zwei Wegen:<br>
        (6, keine 6): ${frac(1, 6)} · ${frac(5, 6)} = ${frac(5, 36)}<br>
        (keine 6, 6): ${frac(5, 6)} · ${frac(1, 6)} = ${frac(5, 36)}<br>
        Zusammen: ${frac(10, 36)} = <strong>${frac(5, 18)}</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Zwei Würfel, eine Augensumme</span>
        <p>Zweimal würfeln ergibt 6 · 6 = <strong>36</strong> gleich wahrscheinliche Wurfpaare:
        6 Möglichkeiten für den ersten Wurf, zu jeder 6 für den zweiten. (3, 6) und (6, 3) sind
        dabei zwei verschiedene Ergebnisse – genau wie eben die zwei Pfade. Also darfst du abzählen:<br>
        Augensumme 9: (3, 6), (4, 5), (5, 4), (6, 3) – vier Paare, P = ${frac(4, 36)} = <strong>${frac(1, 9)}</strong><br>
        Augensumme mindestens 11: (5, 6), (6, 5), (6, 6) – drei Paare, P = ${frac(3, 36)} = <strong>${frac(1, 12)}</strong><br>
        Wer (3, 6) und (6, 3) für ein Paar hält, zählt bei der 9 nur zwei statt vier.
        Das halbiert das Ergebnis.</p>
      </div>
      <div class="example-box"><span class="ex-title">Mit und ohne Zurücklegen</span>
        <p>In einer Urne liegen 3 rote und 2 blaue Kugeln. Du ziehst zweimal – wie groß ist P(beide rot)?<br>
        <em>Mit Zurücklegen:</em> Beim zweiten Zug liegt wieder alles in der Urne.<br>
        ${frac(3, 5)} · ${frac(3, 5)} = <strong>${frac(9, 25)}</strong><br>
        <em>Ohne Zurücklegen:</em> Die erste rote Kugel fehlt jetzt – und die Urne hat nur noch 4 Kugeln.<br>
        ${frac(3, 5)} · ${frac(2, 4)} = ${frac(6, 20)} = <strong>${frac(3, 10)}</strong><br>
        Ab dem zweiten Zug ändern sich also Zähler und Nenner. Im Baumdiagramm stehen die neuen Brüche
        an den Ästen der zweiten Stufe.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Frage vom Anfang: „mindestens eine 6“</span>
        <p>Zwei Würfe: 1 − ${frac(5, 6)} · ${frac(5, 6)} = <strong>${frac(11, 36)}</strong> ≈ 0,306<br>
        Sechs Würfe: 1 − ${frac(5, 6)}<sup>6</sup> ≈ 1 − 0,335 = <strong>0,665</strong><br>
        Also keineswegs sicher – die Verdopplungs-Regel war falsch.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Nach fünf Würfen ohne Sechs muss die Sechs jetzt kommen.“ – Würfel und Roulette haben
        kein Gedächtnis: Auch im sechsten Wurf ist P(6) = ${frac(1, 6)} ≈ 0,167 (<em>Spielerfehlschluss</em>).<br>
        <em>Gegenbeispiel:</em> Wäre die Sechs nach fünf Fehlversuchen fällig, dürfte es keine sechs Würfe
        ganz ohne Sechs geben. Tatsächlich ist P(keine Sechs in 6 Würfen) = ${frac(5, 6)}<sup>6</sup> ≈
        <strong>0,335</strong> – knapp jede dritte Sechserserie verläuft genau so.
        Anders die Urne ohne Zurücklegen: Dort verändert jeder Zug den Inhalt, und der zweite Bruch
        hängt vom ersten Zug ab.<br>
        Ebenso falsch: Wahrscheinlichkeiten mehrerer Stufen addieren. 6 · ${frac(1, 6)} = 1 würde
        „mindestens eine Sechs in 6 Würfen“ zur <em>sicheren</em> Sache erklären; richtig sind
        1 − 0,335 = <strong>0,665</strong>. Bei 12 Würfen käme so sogar 12 · ${frac(1, 6)} = 2,
        also 200 % heraus.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie groß ist P(zwei Sechsen) bei zwei Würfen?</summary>
          <p>Pfadregel: ${frac(1, 6)} · ${frac(1, 6)} = <strong>${frac(1, 36)}</strong></p></details>
        <details><summary>In einer Urne sind 5 rote und 3 blaue Kugeln. P(blau)?</summary>
          <p>3 von 8 → <strong>${frac(3, 8)}</strong> = 0,375</p></details>
        <details><summary>Warum ist P(mindestens ein Treffer) fast immer über das Gegenteil leichter?</summary>
          <p>Weil „mindestens einer“ viele Pfade umfasst, „gar keiner“ aber nur einen einzigen.
          Ein Pfad statt vieler – deutlich weniger Rechenarbeit.</p></details>
      </div>
    `

  };
})();
