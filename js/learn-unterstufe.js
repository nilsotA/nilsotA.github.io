/* ============================================================
   MatheNils – Erklärseiten: Unterstufe (Klasse 5–7)
   Didaktischer Aufbau je Thema:
   Einstieg → Erarbeitung mit Herleitung → Merksatz →
   Verfahren → Beispiele → Fehlvorstellungen → Selbstkontrolle
   ============================================================ */
'use strict';

const LEARN_UNTER = (() => {
  const { frac } = Util;
  return {

    /* ---------- Grundrechenarten ---------- */
    grundrechenarten: `
      <h2>Sicher rechnen mit den Grundrechenarten</h2>
      <p>Addition, Subtraktion, Multiplikation und Division sind das Fundament der ganzen Mathematik.
      Wer hier sicher ist, hat es in jedem späteren Thema leichter.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Zwei Schüler rechnen <strong>8 + 4 · 5</strong>. Lisa tippt von links nach rechts:
        8 + 4 = 12, dann · 5 = 60. Ben rechnet erst 4 · 5 = 20 und dann + 8 = 28.
        Beide haben sauber gerechnet – aber nur einer hat recht.</p>
        <span class="frage">Wer hat recht? Und warum braucht Mathematik überhaupt eine feste Reihenfolge?</span>
      </div>

      <h3>Die Idee: Warum es eine Rangfolge geben muss</h3>
      <p>Stell dir vor, du kaufst 1 Brot für 8 € und 4 Brötchen zu je 5 €. Was du zahlst, steht fest –
      also darf auch der Rechenausdruck 8 + 4 · 5 nur <em>ein</em> Ergebnis haben. Damit weltweit alle
      dasselbe herausbekommen, gilt eine verbindliche Rangfolge.</p>

      <div class="herleitung-box"><span class="box-title">Warum kommt Punkt vor Strich?</span>
        <p>4 · 5 ist nur eine Kurzschreibweise für 5 + 5 + 5 + 5. Der Ausdruck 8 + 4 · 5 bedeutet
        also 8 + 5 + 5 + 5 + 5 – die vier Fünfer gehören <strong>zusammen</strong>.
        Die Multiplikation ist damit stärker gebunden als das Plus. Genau das drückt die Regel
        „Punkt vor Strich“ aus – sie ist keine Willkür, sondern folgt aus der Bedeutung.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: KlaPuStri</span>
        <ol>
          <li><strong>Kla</strong>mmern zuerst</li>
          <li><strong>Pu</strong>nktrechnung (· und :)</li>
          <li><strong>Stri</strong>chrechnung (+ und −)</li>
        </ol>
        <p>Innerhalb einer Stufe gilt: von <strong>links nach rechts</strong>.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Schau den ganzen Term an und suche <strong>Klammern</strong> – die haben Vorrang.</li>
        <li>Markiere alle <strong>Punktrechnungen</strong> und rechne sie einzeln aus.</li>
        <li>Erst jetzt die <strong>Strichrechnungen</strong>, von links nach rechts.</li>
        <li><strong>Überschlag zur Kontrolle:</strong> Ist das Ergebnis ungefähr plausibel?</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Punkt vor Strich</span>
        <p>8 + 4 · 5 = 8 + <u>20</u> = <strong>28</strong><br>
        Ben hatte also recht – Lisas 60 entstehen nur, wenn man die Rangfolge ignoriert.</p>
      </div>
      <div class="example-box"><span class="ex-title">Klammern ändern alles</span>
        <p>(8 + 4) · 5 = <u>12</u> · 5 = <strong>60</strong><br>
        Die Klammer erzwingt, dass zuerst addiert wird – deshalb kommt hier tatsächlich 60 heraus.</p>
      </div>
      <div class="example-box"><span class="ex-title">Alles kombiniert</span>
        <p>20 − 12 : 4 + 2 · 3<br>
        Schritt 1 – Punktrechnungen: 12 : 4 = <u>3</u> und 2 · 3 = <u>6</u><br>
        Schritt 2 – von links nach rechts: 20 − 3 + 6 = 17 + 6 = <strong>23</strong></p>
      </div>

      <h3>Die Fachbegriffe</h3>
      <div class="table-wrap"><table>
        <tr><th>Rechenart</th><th>Beispiel</th><th>Die Zahlen heißen</th><th>Das Ergebnis heißt</th></tr>
        <tr><td>Addition (+)</td><td>7 + 5 = 12</td><td>Summanden</td><td>Summe</td></tr>
        <tr><td>Subtraktion (−)</td><td>12 − 5 = 7</td><td>Minuend, Subtrahend</td><td>Differenz</td></tr>
        <tr><td>Multiplikation (·)</td><td>3 · 4 = 12</td><td>Faktoren</td><td>Produkt</td></tr>
        <tr><td>Division (:)</td><td>12 : 4 = 3</td><td>Dividend, Divisor</td><td>Quotient</td></tr>
      </table></div>

      <h3>Kopfrechnen: geschickt statt stur</h3>
      <ul>
        <li><strong>Stellenweise:</strong> 47 + 38 → Zehner 40 + 30 = 70, Einer 7 + 8 = 15, zusammen 85.
        Bei großen Zahlen zuerst die Hunderter.</li>
        <li><strong>Aufrunden:</strong> 47 + 38 = 47 + 40 − 2 = 85, ebenso 68 − 29 = 68 − 30 + 1 = 39</li>
        <li><strong>Faktor zerlegen:</strong> Zehner und Einer getrennt malnehmen: 25 · 6 = 20 · 6 + 5 · 6 = 120 + 30 = 150</li>
        <li><strong>Mal 5:</strong> erst · 10, dann halbieren: 24 · 5 = 240 : 2 = 120</li>
        <li><strong>Mal 9:</strong> erst · 10, dann einmal abziehen: 7 · 9 = 70 − 7 = 63</li>
        <li><strong>Dividend zerlegen:</strong> 84 = 60 + 24, also 84 : 6 = 10 + 4 = 14</li>
        <li><strong>Division rückwärts denken:</strong> 72 : 8 heißt „? · 8 = 72“ → 9</li>
        <li><strong>Zu groß für den Kopf?</strong> Dann schriftlich rechnen – die Stellen sauber
        untereinander, Einer unter Einer.</li>
      </ul>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Plus kommt vor Minus.“ – Stimmt nicht! Beide sind <strong>gleichrangig</strong>.
        Bei 10 − 4 + 2 wird von links gerechnet: 6 + 2 = <strong>8</strong>.
        Wer erst 4 + 2 rechnet, erhält fälschlich 4. Dasselbe gilt für · und : untereinander.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Warum ist 3 + 2 · 4 nicht 20?</summary>
          <p>Weil 2 · 4 zusammengehört (es steht für 4 + 4). Zuerst 2 · 4 = 8, dann 3 + 8 = <strong>11</strong>.</p></details>
        <details><summary>Wie rechnest du 100 − 20 : 4 − 5?</summary>
          <p>Erst die Punktrechnung: 20 : 4 = 5. Dann von links: 100 − 5 − 5 = <strong>90</strong>.</p></details>
        <details><summary>Wozu dient ein Überschlag?</summary>
          <p>Zur schnellen Kontrolle: 198 · 4 ist ungefähr 200 · 4 = 800. Kommt bei dir 79,2 oder 8000 heraus,
          hast du dich um eine Stelle vertan.</p></details>
      </div>
    `,

    /* ---------- Negative Zahlen ---------- */
    negative: `
      <h2>Rechnen mit negativen Zahlen</h2>
      <p>Negative Zahlen erweitern den Zahlenbereich nach links über die Null hinaus –
      und machen erst dadurch viele Alltagssituationen berechenbar.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Morgens zeigt das Thermometer 4 °C, nachts fällt die Temperatur um 11 Grad.
        Mit den bisherigen Zahlen ist 4 − 11 gar nicht lösbar – trotzdem gibt es diese Nacht.</p>
        <span class="frage">Welche Zahl beschreibt die Temperatur nach dem Sturz?</span>
      </div>

      <h3>Die Idee: Zahlen bekommen eine Richtung</h3>
      <p>Auf dem Zahlenstrahl liegen die negativen Zahlen links von der Null. Jede Zahl hat damit
      zwei Informationen: einen <strong>Betrag</strong> (wie weit von der Null entfernt) und ein
      <strong>Vorzeichen</strong> (in welche Richtung). Rechnen wird zur Bewegung:
      <strong>+ heißt nach rechts, − heißt nach links</strong>.</p>

      <div class="herleitung-box"><span class="box-title">Warum wird aus „minus minus“ ein Plus?</span>
        <p>Schau dir die Reihe an: 5 − 3 = 2,&nbsp;5 − 2 = 3,&nbsp;5 − 1 = 4,&nbsp;5 − 0 = 5.
        Der Subtrahend sinkt jeweils um 1, das Ergebnis steigt um 1. Setzt man das Muster fort,
        muss 5 − (−1) = 6 sein und 5 − (−2) = 7. Die Regel „− (−a) = + a“ ist also die einzige,
        die das Muster nicht zerstört.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Zwei Zeichen hintereinander – und Punkt vor Strich</span>
        <ul>
          <li>+ (−3) wird zu − 3:&nbsp;5 + (−3) = 5 − 3 = 2</li>
          <li>− (−3) wird zu + 3:&nbsp;5 − (−3) = 5 + 3 = 8</li>
          <li>Punkt vor Strich gilt weiter:&nbsp;−3 − (−9) · 2 = −3 − (−18) = 15</li>
        </ul>
        <p>Vorzeichen bei · und :&nbsp;<strong>gleich → positiv</strong>, <strong>verschieden → negativ</strong>.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Stehen · oder : in der Aufgabe, gilt weiter <strong>Punkt vor Strich</strong>.
        Rechne die Punktrechnung zuerst aus – mit Vorzeichen.</li>
        <li>Prüfe, ob zwei Zeichen aufeinandertreffen, und fasse sie zu einem zusammen.</li>
        <li>Bei + und −: Denke dir eine Bewegung auf dem Zahlenstrahl (Start, Richtung, Schritte).</li>
        <li>Bei · und :: Rechne zuerst mit den <strong>Beträgen</strong>, bestimme das Vorzeichen separat.</li>
        <li>Kontrolliere das Vorzeichen zum Schluss noch einmal bewusst.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Bewegung auf dem Zahlenstrahl</span>
        <p>−7 + 12: Start bei −7, 12 Schritte nach rechts → <strong>5</strong><br>
        −3 − 8: Start bei −3, 8 Schritte nach links → <strong>−11</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Multiplizieren mit Vorzeichen</span>
        <p>(−4) · (−6): Beträge 4 · 6 = 24, Vorzeichen gleich → <strong>+24</strong><br>
        (−4) · 6: Beträge 24, Vorzeichen verschieden → <strong>−24</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Punkt vor Strich – auch mit Vorzeichen</span>
        <p>−3 − (−9) · 2: Zuerst die Punktrechnung. Vorzeichen verschieden → (−9) · 2 = −18.<br>
        Übrig bleibt −3 − (−18). Zwei Zeichen treffen aufeinander: − (−18) wird zu + 18.<br>
        −3 + 18 = <strong>15</strong><br>
        Wer erst −3 − (−9) = 6 rechnet und dann mal 2 nimmt, erhält fälschlich 12.
        Die Punktrechnung ist zuerst dran – auch mit Vorzeichen.</p>
      </div>
      <div class="example-box"><span class="ex-title">Anwendung: der Temperatursturz</span>
        <p>4 °C − 11 °C = <strong>−7 °C</strong> – die Frage vom Anfang ist gelöst.<br>
        Und wie groß ist der Unterschied zwischen 4 °C und −7 °C?<br>
        4 − (−7) = 4 + 7 = <strong>11 Grad</strong>. Ein Unterschied ist immer positiv.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Vorzeichen</th><th>Ergebnis</th><th>Beispiel</th></tr>
        <tr><td>(+) · (+)</td><td>positiv</td><td>4 · 6 = 24</td></tr>
        <tr><td>(−) · (−)</td><td>positiv</td><td>(−4) · (−6) = 24</td></tr>
        <tr><td>(+) · (−)</td><td>negativ</td><td>4 · (−6) = −24</td></tr>
        <tr><td>(−) · (+)</td><td>negativ</td><td>(−4) · 6 = −24</td></tr>
      </table></div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„−3² ist dasselbe wie (−3)².“ – Nein! (−3)² = (−3)·(−3) = <strong>9</strong>,
        aber −3² = −(3 · 3) = <strong>−9</strong>. Ohne Klammer gehört das Minuszeichen nicht zur Potenz.<br>
        Ebenso falsch: „−5 ist größer als −2, weil 5 größer ist als 2.“ Auf dem Zahlenstrahl liegt
        −5 weiter links, also gilt <strong>−5 &lt; −2</strong>.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was ist größer: −8 oder −3?</summary>
          <p><strong>−3</strong>, denn es liegt weiter rechts auf dem Zahlenstrahl. Bei negativen Zahlen
          gilt: je größer der Betrag, desto kleiner die Zahl.</p></details>
        <details><summary>Warum ist (−2) · (−5) positiv?</summary>
          <p>Gleiche Vorzeichen ergeben ein positives Produkt – passend zum Muster:
          (−2)·2 = −4, (−2)·1 = −2, (−2)·0 = 0, (−2)·(−1) = +2. Das Ergebnis steigt jedes Mal um 2.</p></details>
        <details><summary>Wie groß ist der Abstand zwischen −6 und 3?</summary>
          <p>3 − (−6) = 3 + 6 = <strong>9</strong>. Nachzählen auf dem Zahlenstrahl bestätigt es.</p></details>
      </div>
    `,

    /* ---------- Teilbarkeit & Primzahlen ---------- */
    teilbarkeit: `
      <h2>Teilbarkeit, Primzahlen, ggT und kgV</h2>
      <p>Teilbarkeit ist die Grundlage für das Kürzen von Brüchen, für Hauptnenner und für
      das Verteilen in gleich große Gruppen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Du sollst 738 Bonbons gerecht auf 3 Kinder verteilen – ohne Rest.
        Musst du dafür wirklich dividieren, oder siehst du die Antwort in zwei Sekunden?</p>
        <span class="frage">Gibt es ein Erkennungszeichen für Teilbarkeit, das man ansieht?</span>
      </div>

      <h3>Die Idee: Teilbarkeit steckt in den Ziffern</h3>
      <p>Eine Zahl ist durch eine andere <strong>teilbar</strong>, wenn die Division ohne Rest aufgeht.
      Für die wichtigsten Teiler muss man dafür gar nicht rechnen – die Ziffern verraten es.</p>

      <div class="herleitung-box"><span class="box-title">Warum funktioniert die Quersummen-Regel?</span>
        <p>Zerlege 738 = 7 · 100 + 3 · 10 + 8. Nun ist 100 = 99 + 1 und 10 = 9 + 1:<br>
        738 = 7 · 99 + 3 · 9 + <strong>(7 + 3 + 8)</strong>.<br>
        Die ersten beiden Teile sind offensichtlich durch 3 (und 9) teilbar. Übrig bleibt genau die
        <strong>Quersumme</strong> – nur sie entscheidet also über die Teilbarkeit durch 3 und 9.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Teilbar durch</th><th>Regel</th><th>Beispiel</th></tr>
        <tr><td>2</td><td>letzte Ziffer gerade</td><td>734 ✓</td></tr>
        <tr><td>3</td><td>Quersumme durch 3 teilbar</td><td>738 → 18 ✓</td></tr>
        <tr><td>4</td><td>letzte zwei Ziffern durch 4 teilbar</td><td>716 → 16 ✓</td></tr>
        <tr><td>5</td><td>endet auf 0 oder 5</td><td>735 ✓</td></tr>
        <tr><td>6</td><td>durch 2 <em>und</em> durch 3 teilbar</td><td>738 ✓</td></tr>
        <tr><td>9</td><td>Quersumme durch 9 teilbar</td><td>738 → 18 ✓</td></tr>
        <tr><td>10</td><td>endet auf 0</td><td>730 ✓</td></tr>
      </table></div>

      <h3>Primzahlen: die Bausteine der Zahlen</h3>
      <p>Eine <strong>Primzahl</strong> hat genau zwei Teiler: 1 und sich selbst.
      Die ersten sind 2, 3, 5, 7, 11, 13, 17, 19, 23, 29. Jede andere Zahl lässt sich eindeutig
      aus Primzahlen zusammensetzen – wie aus Bausteinen.</p>

      <div class="merkkasten"><span class="merk-title">Merke: ggT und kgV</span>
        <p><strong>ggT</strong> = größter gemeinsamer Teiler: die größte Zahl, die beide Zahlen teilt.<br>
        <strong>kgV</strong> = kleinstes gemeinsames Vielfaches: die kleinste Zahl in beiden Vielfachenreihen.<br>
        Schneller geht es mit Primfaktoren:</p>
        <ul>
          <li><strong>ggT</strong> = die <em>gemeinsamen</em> Primfaktoren (wichtig beim Kürzen)</li>
          <li><strong>kgV</strong> = <em>alle</em> Primfaktoren in höchster Anzahl (wichtig beim Hauptnenner)</li>
          <li><strong>ggT · kgV</strong> = Produkt beider Zahlen – aus dem ggT folgt so das kgV</li>
        </ul>
      </div>

      <h3>So gehst du vor: Primfaktorzerlegung</h3>
      <ol class="schritte">
        <li>Teile die Zahl durch die <strong>kleinste</strong> passende Primzahl (2, dann 3, dann 5 …).</li>
        <li>Mit dem Ergebnis genauso weitermachen.</li>
        <li>Abbrechen, sobald eine Primzahl übrig bleibt.</li>
        <li><strong>Probe:</strong> Alle gefundenen Faktoren multiplizieren – es muss die Ausgangszahl herauskommen.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Primfaktorzerlegung von 60</span>
        <p>60 : 2 = 30 → 30 : 2 = 15 → 15 : 3 = 5 → 5 ist prim.<br>
        Also 60 = <strong>2 · 2 · 3 · 5</strong>&nbsp;(Probe: 2 · 2 · 3 · 5 = 60 ✓)</p>
      </div>
      <div class="example-box"><span class="ex-title">ggT und kgV von 24 und 36</span>
        <p>24 = 2 · 2 · 2 · 3&ensp;<span class="trenn">•</span>&ensp;36 = 2 · 2 · 3 · 3<br>
        Gemeinsam: 2 · 2 · 3 → <strong>ggT = 12</strong><br>
        Alles in höchster Anzahl: 2 · 2 · 2 · 3 · 3 → <strong>kgV = 72</strong><br>
        Kontrolle: ggT · kgV = 12 · 72 = 864 = 24 · 36 ✓<br>
        Das ist zugleich eine Abkürzung: kgV = 24 · 36 : ggT = 864 : 12 = <strong>72</strong>.<br>
        Ist der ggT 1, ist das kgV einfach das Produkt: kgV(3, 8) = 3 · 8 = 24.</p>
      </div>
      <div class="example-box"><span class="ex-title">Anwendung: Wann fahren beide Busse zusammen?</span>
        <p>Bus A fährt alle 12 Minuten, Bus B alle 18. Um 8:00 Uhr starten beide.<br>
        Bus A kommt 8:12, 8:24, <strong>8:36</strong> … Bus B kommt 8:18, <strong>8:36</strong> …<br>
        Das sind die Vielfachen von 12 und 18 – die erste gemeinsame Zeit ist das kgV.<br>
        Gesucht ist also das <strong>kgV</strong>: 12 = 2 · 2 · 3, 18 = 2 · 3 · 3 → kgV = 2 · 2 · 3 · 3 = <strong>36</strong><br>
        Nächste gemeinsame Abfahrt: <strong>8:36 Uhr</strong>.<br>
        <em>Merkhilfe:</em> „Wann wieder zusammen?“ → kgV. „In wie viele gleiche Gruppen?“ → ggT.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„1 ist auch eine Primzahl.“ – Nein, sie hat nur <em>einen</em> Teiler.
        Wäre die 1 prim, wäre die Primfaktorzerlegung nicht mehr eindeutig
        (6 = 2·3 = 1·2·3 = 1·1·2·3 …). Und: Die <strong>2</strong> ist die einzige gerade Primzahl.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Ist 738 durch 3 teilbar?</summary>
          <p>Quersumme 7+3+8 = 18, und 18 ist durch 3 teilbar → <strong>ja</strong>.
          Die Bonbons lassen sich also ohne Rest verteilen (je 246).</p></details>
        <details><summary>Warum braucht man beim Bruch-Kürzen den ggT?</summary>
          <p>Nur der größte gemeinsame Teiler kürzt in einem Schritt vollständig.
          Bei ${frac(18, 24)} ist ggT = 6 → ${frac(3, 4)}. Mit 2 zu kürzen wäre nicht falsch, aber unfertig.</p></details>
        <details><summary>Ist 91 eine Primzahl?</summary>
          <p>Nein: 91 = 7 · 13. Testen musst du nur Primzahlen bis √91 ≈ 9,5 – also 2, 3, 5, 7.</p></details>
      </div>
    `,

    /* ---------- Brüche ---------- */
    brueche: `
      <h2>Brüche verstehen und mit ihnen rechnen</h2>
      <p>Brüche beschreiben Anteile eines Ganzen – und schließen die Lücken zwischen den ganzen Zahlen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Drei Freunde teilen sich zwei Pizzen. Mit ganzen Zahlen lässt sich nicht sagen,
        wie viel jeder bekommt – „null Pizzen“ wäre falsch, „eine“ auch.</p>
        <span class="frage">Welche Zahl beschreibt den Anteil, den jeder erhält?</span>
      </div>

      <h3>Die Idee: Zähler zählt, Nenner benennt</h3>
      <p>Bei ${frac(3, 4)} sagt der <strong>Nenner</strong> (unten), in wie viele gleich große Teile das
      Ganze zerlegt wurde – er <em>benennt</em> die Teilgröße. Der <strong>Zähler</strong> (oben)
      sagt, wie viele solcher Teile gemeint sind – er <em>zählt</em>.</p>

      <div class="herleitung-box"><span class="box-title">Warum darf man erweitern und kürzen?</span>
        <p>Schneidest du jedes Viertel einer Pizza noch einmal durch, hast du doppelt so viele,
        aber halb so große Stücke – gegessen wird exakt gleich viel. Rechnerisch:
        ${frac(3, 4)} = ${frac('3 · 2', '4 · 2')} = ${frac(6, 8)}. Zähler und Nenner mit derselben
        Zahl zu multiplizieren bedeutet nichts anderes als „feiner unterteilen“ – der Wert bleibt gleich.</p>
        <p><strong>Kürzen</strong> ist der Weg zurück. Je zwei Achtel werden wieder ein Viertel –
        gröbere Stücke, gleich viel Pizza. Dafür teilst du Zähler und Nenner durch dieselbe Zahl:
        ${frac(6, 8)} = ${frac('6 : 2', '8 : 2')} = ${frac(3, 4)}. Fertig bist du, wenn Zähler und
        Nenner keinen gemeinsamen Teiler außer 1 mehr haben. Am schnellsten teilst du gleich durch
        den <strong>größten gemeinsamen Teiler</strong> (ggT). Bei ${frac(12, 18)} ist das die 6:
        ${frac(12, 18)} = ${frac('12 : 6', '18 : 6')} = ${frac(2, 3)}. Ein Schritt statt zwei –
        sonst erst durch 2, dann noch durch 3.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Erweitern, Kürzen und die vier Rechenarten</span>
        <ul>
          <li><strong>Erweitern:</strong> Zähler und Nenner mal dieselbe Zahl&ensp;<span class="trenn">•</span>&ensp;<strong>Kürzen:</strong> beide durch dieselbe Zahl – am schnellsten den ggT</li>
          <li><strong>+ und −:</strong> nur bei gleichem Nenner – sonst zuerst auf den Hauptnenner erweitern</li>
          <li><strong>·</strong> Zähler mal Zähler, Nenner mal Nenner&ensp;<span class="trenn">•</span>&ensp;<strong>:</strong> mit dem <strong>Kehrwert</strong> multiplizieren</li>
        </ul>
      </div>

      <h3>So gehst du vor: Brüche addieren und subtrahieren</h3>
      <ol class="schritte">
        <li>Nenner vergleichen. Sind sie gleich? Dann direkt mit den Zählern rechnen.</li>
        <li>Sonst den <strong>Hauptnenner</strong> bestimmen (kgV der Nenner).</li>
        <li>Beide Brüche auf diesen Nenner <strong>erweitern</strong>.</li>
        <li>Zähler addieren (oder subtrahieren), Nenner beibehalten.</li>
        <li>Ergebnis <strong>vollständig kürzen</strong> – durch den ggT von Zähler und Nenner.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Pizza-Frage vom Anfang</span>
        <p>Schneide jede der beiden Pizzen in drei gleich große Stücke – das ergibt 6 Drittel.
        Verteilt auf drei Freunde bekommt jeder zwei davon, also ${frac(2, 3)} einer Pizza.<br>
        Kürzer geht es so: Der Bruchstrich <em>ist</em> das Geteiltzeichen. 2 : 3 = ${frac(2, 3)}<br>
        <em>Probe:</em> 3 · ${frac(2, 3)} = ${frac(6, 3)} = <strong>2</strong> – die beiden Pizzen
        sind restlos verteilt. Genau für solche Anteile zwischen den ganzen Zahlen gibt es Brüche.</p>
      </div>
      <div class="example-box"><span class="ex-title">Addieren mit Hauptnenner</span>
        <p>${frac(2, 3)} + ${frac(1, 4)}&nbsp;→ Hauptnenner kgV(3, 4) = 12<br>
        ${frac(2, 3)} = ${frac(8, 12)}&nbsp;und&nbsp;${frac(1, 4)} = ${frac(3, 12)}<br>
        ${frac(8, 12)} + ${frac(3, 12)} = <strong>${frac(11, 12)}</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Was bleibt übrig? – vom Ganzen abziehen</span>
        <p>Mia isst ${frac(1, 3)} einer Pizza, Ben ${frac(2, 5)}. Welcher Anteil bleibt übrig?<br>
        Zuerst zusammenzählen, was weg ist – Hauptnenner kgV(3, 5) = 15:<br>
        ${frac(1, 3)} + ${frac(2, 5)} = ${frac(5, 15)} + ${frac(6, 15)} = ${frac(11, 15)}<br>
        Die ganze Pizza ist 1. Schreibe sie mit demselben Nenner: 1 = ${frac(15, 15)}.<br>
        ${frac(15, 15)} − ${frac(11, 15)} = <strong>${frac(4, 15)}</strong> der Pizza bleiben übrig.<br>
        <em>Subtrahieren geht wie Addieren:</em> gleicher Nenner, dann nur die Zähler – hier 15 − 11 = 4.</p>
      </div>
      <div class="example-box"><span class="ex-title">Multiplizieren – und vorher kürzen</span>
        <p>${frac(2, 3)} · ${frac(6, 7)} = ${frac(12, 21)} = <strong>${frac(4, 7)}</strong><br>
        <em>Schneller:</em> Erst über Kreuz kürzen (3 und 6 durch 3), dann rechnen:
        ${frac(2, 1)} · ${frac(2, 7)} = ${frac(4, 7)} – die Zahlen bleiben klein.</p>
      </div>
      <div class="example-box"><span class="ex-title">Dividieren mit dem Kehrwert</span>
        <p>${frac(3, 4)} : ${frac(2, 5)} = ${frac(3, 4)} · ${frac(5, 2)} = <strong>${frac(15, 8)}</strong><br>
        <em>Warum der Kehrwert?</em> „: ${frac(1, 2)}“ fragt: Wie oft passt eine Hälfte hinein?
        Doppelt so oft – also mal 2. Der Kehrwert dreht die Frage genau um.</p>
      </div>
      <div class="example-box"><span class="ex-title">Umwandeln in eine Dezimalzahl – und zurück</span>
        <p>Hat der Nenner 10, 100 oder 1000, kannst du den Bruch direkt mit Komma schreiben:
        ${frac(6, 10)} = 0,6. Deshalb erweiterst du auf so einen Nenner:<br>
        ${frac(3, 5)} = ${frac(6, 10)} = <strong>0,6</strong>&ensp;<span class="trenn">•</span>&ensp;${frac(9, 20)} = ${frac(45, 100)} = <strong>0,45</strong><br>
        Rückwärts: Zwei Stellen hinter dem Komma sind Hundertstel. 0,35 = ${frac(35, 100)}, mit 5 gekürzt <strong>${frac(7, 20)}</strong><br>
        <em>Probe:</em> 7 : 20 = 0,35 – der Bruchstrich ist das Geteiltzeichen.<br>
        <em>Auswendig lohnt sich:</em> ${frac(1, 2)} = 0,5&ensp;<span class="trenn">•</span>&ensp;${frac(1, 4)} = 0,25&ensp;<span class="trenn">•</span>&ensp;${frac(1, 5)} = 0,2&ensp;<span class="trenn">•</span>&ensp;${frac(1, 8)} = 0,125</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Nenner werden auch addiert.“ – ${frac(1, 2)} + ${frac(1, 3)} ist <strong>nicht</strong> ${frac(2, 5)}!
        Sonst käme heraus, dass eine halbe plus eine drittel Pizza weniger als eine halbe wäre.
        Richtig: ${frac(3, 6)} + ${frac(2, 6)} = ${frac(5, 6)}.<br>
        Ebenfalls typisch: „Ein größerer Nenner bedeutet mehr.“ – ${frac(1, 8)} ist <em>kleiner</em>
        als ${frac(1, 3)}, denn bei mehr Teilen wird jedes Teil kleiner.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was ist größer: ${frac(3, 5)} oder ${frac(5, 8)}?</summary>
          <p>Auf den Hauptnenner 40 bringen: ${frac(24, 40)} und ${frac(25, 40)} → <strong>${frac(5, 8)}</strong> ist größer.</p></details>
        <details><summary>Warum wird ${frac(3, 4)} : ${frac(1, 2)} größer als ${frac(3, 4)}?</summary>
          <p>Weil durch eine Zahl kleiner als 1 geteilt wird – man fragt, wie oft die kleine Menge hineinpasst.
          Ergebnis: ${frac(3, 4)} · ${frac(2, 1)} = ${frac(3, 2)}.</p></details>
        <details><summary>Wie erkennst du, dass ein Bruch vollständig gekürzt ist?</summary>
          <p>Wenn Zähler und Nenner keinen gemeinsamen Teiler außer 1 mehr haben (ggT = 1),
          z. B. ${frac(7, 12)}.</p></details>
        <details><summary>Wie schreibst du 0,875 als Bruch?</summary>
          <p>Drei Stellen hinter dem Komma sind Tausendstel: 0,875 = ${frac(875, 1000)}.
          Mit 125 kürzen → <strong>${frac(7, 8)}</strong>.</p></details>
      </div>
    `,

    /* ---------- Dezimalzahlen ---------- */
    dezimalzahlen: `
      <h2>Dezimalzahlen (Kommazahlen)</h2>
      <p>Dezimalzahlen sind eine zweite Schreibweise für Brüche – besonders praktisch beim Messen,
      Wiegen und Bezahlen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Zwei Läuferinnen: Mia braucht 12,8 Sekunden, Lena 12,45 Sekunden.
        Viele tippen spontan auf Lena als Langsamere – ihre Zahl hat ja „mehr Ziffern“.</p>
        <span class="frage">Wer ist wirklich schneller – und woran erkennt man das sicher?</span>
      </div>

      <h3>Die Idee: Das Stellenwertsystem geht hinter dem Komma weiter</h3>
      <p>Vor dem Komma stehen Einer, Zehner, Hunderter. Hinter dem Komma wird jede Stelle
      <strong>zehnmal kleiner</strong>: Zehntel, Hundertstel, Tausendstel.
      Eine Dezimalzahl ist also nur eine kurze Summe von Brüchen.</p>

      <div class="herleitung-box"><span class="box-title">Warum ist 0,8 größer als 0,45?</span>
        <p>0,8 = ${frac(8, 10)} = ${frac(80, 100)} und 0,45 = ${frac(45, 100)}.
        Verglichen werden also 80 Hundertstel mit 45 Hundertsteln. Die Anzahl der Ziffern sagt gar nichts –
        entscheidend ist der <strong>Stellenwert</strong>. Deshalb hilft der Trick, mit Nullen aufzufüllen:
        0,<strong>80</strong> gegen 0,<strong>45</strong>.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <ul>
          <li><strong>Vergleichen:</strong> stellenweise von links, notfalls mit Nullen auffüllen</li>
          <li><strong>· 10 / · 100:</strong> Komma je Null eine Stelle nach rechts, <strong>: 10:</strong> eine nach links</li>
          <li><strong>Runden:</strong> Ziffer dahinter 0–4 → abrunden, 5–9 → aufrunden</li>
          <li><strong>+ und −:</strong> Kommas untereinander, hinten mit Nullen auffüllen, dann wie mit ganzen Zahlen rechnen</li>
        </ul>
      </div>

      <h3>So gehst du vor: multiplizieren</h3>
      <ol class="schritte">
        <li>Kommas <strong>ignorieren</strong> und die Zahlen wie ganze Zahlen multiplizieren.</li>
        <li>Nachkommastellen beider Faktoren <strong>zusammenzählen</strong>.</li>
        <li>Im Ergebnis so viele Nachkommastellen abtrennen.</li>
        <li><strong>Überschlag prüfen:</strong> 2,5 · 1,2 muss ungefähr 3 sein – nicht 30.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Vergleichen – die Frage vom Anfang</span>
        <p>12,8 s und 12,45 s → auffüllen: 12,<strong>80</strong> und 12,<strong>45</strong><br>
        80 Hundertstel &gt; 45 Hundertstel → <strong>Lena ist schneller</strong> (12,45 s).</p>
      </div>
      <div class="example-box"><span class="ex-title">Addieren: Kommas untereinander</span>
        <p>12,45 + 3,8 → auffüllen zu 12,45 + 3,80<br>
        stellenweise addieren → <strong>16,25</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Subtrahieren: Rückgeld</span>
        <p>Dein Einkauf kostet 2,65 €, du zahlst mit einem 10-Euro-Schein. Rückgeld heißt Schein minus Einkauf.<br>
        Die 10 hat keine Nachkommastellen → auffüllen zu 10,00 − 2,65<br>
        Kommas untereinander, stellenweise subtrahieren → <strong>7,35 €</strong><br>
        <em>Kontrolle:</em> 2,65 + 7,35 = 10,00 ✓ – Einkauf plus Rückgeld ergibt den Schein.</p>
      </div>
      <div class="example-box"><span class="ex-title">Multiplizieren</span>
        <p>0,3 · 0,4: Rechne 3 · 4 = 12. Zusammen 2 Nachkommastellen → <strong>0,12</strong><br>
        <em>Plausibel?</em> Drei Zehntel von 0,4 müssen kleiner sein als 0,4 – und 0,12 &lt; 0,4 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Mal 10, mal 100: Das Komma wandert</span>
        <p>1,49 · 100: Der Faktor hat zwei Nullen → das Komma rückt zwei Stellen nach rechts → <strong>149</strong><br>
        5,31 : 10: Teilen – das Komma rückt eine Stelle nach links → <strong>0,531</strong><br>
        Fehlt eine Stelle, schreibst du eine Null dazu: 2,5 · 100 → 2,50 → <strong>250</strong> und 0,4 : 10 → <strong>0,04</strong><br>
        <em>Probe mit dem Verfahren oben:</em> 149 · 100 = 14 900, zwei Nachkommastellen → 149,00 ✓</p>
      </div>

      <h3>Umwandeln: Bruch ↔ Dezimalzahl</h3>
      <p>${frac(3, 4)} = ${frac(75, 100)} = 0,75&ensp;<span class="trenn">•</span>&ensp;0,6 = ${frac(6, 10)} = ${frac(3, 5)}</p>
      <p>Auswendig lohnt sich: ${frac(1, 2)} = 0,5&ensp;<span class="trenn">•</span>&ensp;${frac(1, 4)} = 0,25&ensp;<span class="trenn">•</span>&ensp;
      ${frac(1, 5)} = 0,2&ensp;<span class="trenn">•</span>&ensp;${frac(1, 8)} = 0,125</p>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Mehr Ziffern = größere Zahl.“ – Das gilt nur vor dem Komma!
        0,315 ist <strong>kleiner</strong> als 0,4.<br>
        Ebenso: Beim Addieren und Subtrahieren die Zahlen rechtsbündig untereinanderschreiben ist falsch –
        es müssen die <strong>Kommas</strong> untereinanderstehen.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <!-- Trennzeichen bewusst Semikolon: Der Malpunkt stand hier zwischen den
             zu ordnenden Zahlen – und in der Frage direkt darunter bedeutet
             derselbe Glyph Multiplikation (0,2 · 0,3). Gelesen als Produkt
             ergäbe „0,7 · 0,68 · 0,705“ den Wert 0,3348. -->
        <details><summary>Ordne der Größe nach: 0,7; 0,68; 0,705</summary>
          <p>Auf gleich viele Nachkommastellen auffüllen: 0,700; 0,680; 0,705 → <strong>0,68 &lt; 0,7 &lt; 0,705</strong></p></details>
        <details><summary>Warum hat 0,2 · 0,3 zwei Nachkommastellen?</summary>
          <p>Weil ${frac(2, 10)} · ${frac(3, 10)} = ${frac(6, 100)} = 0,06 – die Nenner multiplizieren sich zu 100.</p></details>
        <details><summary>Wie rundest du 3,4<u>4</u>9 auf Zehntel?</summary>
          <p>Entscheidend ist nur die Ziffer direkt dahinter (4) → abrunden: <strong>3,4</strong>.
          Die 9 am Ende spielt keine Rolle.</p></details>
      </div>
    `,

    /* ---------- Einheiten ---------- */
    einheiten: `
      <h2>Einheiten sicher umrechnen</h2>
      <p>Eine Zahl ohne Einheit ist in der Anwendung wertlos – und erst die Umrechnung macht
      Größen vergleichbar.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Regal ist 180 cm hoch, die Decke 2,1 m. Passt es aufrecht darunter?
        Solange die beiden Zahlen in verschiedenen Einheiten stehen, kann man sie nicht vergleichen.</p>
        <span class="frage">Wie bringt man Größen zuverlässig auf dieselbe Einheit?</span>
      </div>

      <h3>Die Idee: Dieselbe Größe, andere Portionsgröße</h3>
      <p>1 m und 100 cm sind <em>dieselbe</em> Länge – nur in unterschiedlich großen Portionen gemessen.
      Wählt man eine <strong>kleinere</strong> Einheit, braucht man entsprechend <strong>mehr</strong>
      davon. Deshalb gilt: in die kleinere Einheit → multiplizieren, in die größere → dividieren.</p>

      <div class="herleitung-box"><span class="box-title">Warum ist 1 m² gleich 100 dm² und nicht 10?</span>
        <p>Ein Quadratmeter ist ein Quadrat mit 1 m Seitenlänge, also 10 dm · 10 dm.
        Weil <strong>beide</strong> Richtungen umgerechnet werden, wird der Faktor quadriert:
        10 · 10 = 100. Beim Volumen kommt die dritte Richtung dazu: 10³ = 1000.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Größe</th><th>Einheiten-Kette</th><th>Faktor pro Schritt</th></tr>
        <tr><td>Länge</td><td>km → m → dm → cm → mm</td><td>· 1000, dann je · 10</td></tr>
        <tr><td>Masse</td><td>t → kg → g → mg</td><td>je · 1000</td></tr>
        <tr><td>Zeit</td><td>h → min → s</td><td>je · 60 (!)</td></tr>
        <tr><td>Fläche</td><td>m² → dm² → cm²</td><td>je · 100</td></tr>
        <tr><td>Volumen</td><td>m³ → dm³ → cm³</td><td>je · 1000&nbsp;(1 dm³ = 1 Liter)</td></tr>
      </table></div>

      <div class="merkkasten"><span class="merk-title">Merke: Die drei Stolperstellen</span>
        <ul>
          <li><strong>Zeit:</strong> Faktor 60, nicht 100 – 1,5 h sind 90 min</li>
          <li><strong>Flächen:</strong> Faktor 100 pro Stufe (der Längenfaktor wird quadriert)</li>
          <li><strong>Volumen:</strong> Faktor 1000 pro Stufe – und 1 dm³ = 1 Liter</li>
        </ul>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Frage: Ist die Zieleinheit <strong>kleiner</strong> oder größer als die Ausgangseinheit?</li>
        <li>Kleiner → multiplizieren, größer → dividieren. Die Zahl wird entsprechend größer bzw. kleiner.</li>
        <li>Zähle die <strong>Stufen</strong> und multipliziere die Faktoren (bei Flächen 100, bei Volumen 1000 pro Stufe).</li>
        <li><strong>Plausibilität prüfen:</strong> In cm muss die Zahl größer sein als in m.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Regal-Frage vom Anfang</span>
        <p>2,1 m = 2,1 · 100 cm = <strong>210 cm</strong> &gt; 180 cm →
        das Regal passt, es bleiben 30 cm Luft.</p>
      </div>
      <div class="example-box"><span class="ex-title">Länge und Masse umrechnen</span>
        <p>3,5 km = 3,5 · 1000 m = <strong>3500 m</strong><br>
        245 cm = 245 : 100 m = <strong>2,45 m</strong><br>
        0,8 kg = 0,8 · 1000 g = <strong>800 g</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Zeit – die Falle mit der 60</span>
        <p>2 h 35 min = 2 · 60 min + 35 min = <strong>155 min</strong><br>
        Aber Achtung: 1,5 h sind <strong>90 min</strong> – nicht 150. Die Nachkommastelle
        ist ein Anteil von 60 Minuten, nicht von 100.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Bei Flächen gilt derselbe Faktor 10.“ – Nein: 1 m² = <strong>100</strong> dm².
        Und bei der Zeit rechnet man mit 60, nicht mit 100:
        2,5 h = 2 h 30 min, nicht 2 h 50 min.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie viele cm² hat 1 m²?</summary>
          <p>100 cm · 100 cm = <strong>10 000 cm²</strong> – der Faktor 100 wird quadriert.</p></details>
        <details><summary>Wie viel Liter fasst ein Aquarium 40 cm · 30 cm · 25 cm?</summary>
          <p>V = 30 000 cm³ = 30 dm³ = <strong>30 Liter</strong>, denn 1 dm³ = 1 Liter.</p></details>
        <details><summary>Ein Läufer braucht 1,25 h. Wie viele Minuten sind das?</summary>
          <p>1 h = 60 min, 0,25 h = ¼ von 60 min = 15 min → <strong>75 Minuten</strong>.</p></details>
      </div>
    `,

    /* ---------- Dreisatz ---------- */
    dreisatz: `
      <h2>Dreisatz und Zuordnungen</h2>
      <p>Der Dreisatz löst unzählige Alltagsfragen mit einem einzigen, immer gleichen Schema.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>3 Brötchen kosten 1,20 €. Du brauchst 7 Stück.
        Ein Rezept für 4 Personen soll für 6 reichen. Und 4 Maler streichen eine Halle in 6 Tagen –
        wie lange brauchen 3?</p>
        <span class="frage">Lassen sich so unterschiedliche Fragen mit <em>einem</em> Verfahren lösen?</span>
      </div>

      <h3>Die Idee: über die Einheit gehen</h3>
      <p>Direkt von 3 auf 7 Brötchen zu schließen ist unübersichtlich. Der Trick: zuerst auf
      <strong>eine</strong> Einheit herunterrechnen – dieser Wert lässt sich dann beliebig
      hochrechnen. Daher die drei Zeilen, die dem Verfahren den Namen geben.</p>

      <div class="herleitung-box"><span class="box-title">Warum gibt es zwei verschiedene Fälle?</span>
        <p>Bei Brötchen gilt: doppelte Menge → doppelter Preis. Der <strong>Quotient</strong>
        Preis : Menge bleibt konstant (0,40 € pro Stück) – <em>proportional</em>.<br>
        Bei Malern gilt: doppelt so viele → halbe Zeit. Konstant bleibt hier das
        <strong>Produkt</strong> Anzahl · Zeit (die Gesamtarbeit von 24 Tagewerken) – <em>antiproportional</em>.
        Diese Unterscheidung entscheidet, ob man erst teilt oder erst multipliziert.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Die zwei Typen</span>
        <ul>
          <li><strong>Proportional</strong> („je mehr, desto mehr“): erst <strong>:</strong>, dann <strong>·</strong> — Quotient konstant</li>
          <li><strong>Antiproportional</strong> („je mehr, desto weniger“): erst <strong>·</strong>, dann <strong>:</strong> — Produkt konstant</li>
        </ul>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Typ bestimmen:</strong> Frage dich, was bei doppelter Menge passiert – doppelt oder halb?</li>
        <li>Gegebene Zeile aufschreiben (links Menge, rechts Wert).</li>
        <li>Auf <strong>eine</strong> Einheit rechnen – proportional durch Teilen, antiproportional durch Multiplizieren.</li>
        <li>Auf die gesuchte Menge hochrechnen (die Gegenoperation).</li>
        <li><strong>Probe:</strong> Ist das Ergebnis größer oder kleiner, als es sein müsste?</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Proportional: der Brötchenpreis</span>
        <p>3 Brötchen → 1,20 €&nbsp;| : 3<br>
        1 Brötchen → 0,40 €&nbsp;| · 7<br>
        7 Brötchen → <strong>2,80 €</strong><br>
        <em>Probe:</em> Mehr Brötchen, höherer Preis ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Über eine Zwischeneinheit</span>
        <p>250 g Käse kosten 3,50 €. Was kosten 400 g?<br>
        250 g → 3,50 €&nbsp;| : 5 → 50 g → 0,70 €&nbsp;| · 8 → 400 g → <strong>5,60 €</strong><br>
        <em>Tipp:</em> Man muss nicht bis auf 1 g herunter – jede bequeme Stufe ist erlaubt.</p>
      </div>
      <div class="example-box"><span class="ex-title">Antiproportional: die Maler</span>
        <p>4 Maler → 6 Tage&nbsp;| · 4<br>
        1 Maler → 24 Tage&nbsp;| : 3<br>
        3 Maler → <strong>8 Tage</strong><br>
        <em>Probe:</em> Weniger Maler, mehr Zeit ✓&nbsp;Und 4 · 6 = 3 · 8 = 24 ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Alles lässt sich mit dem Dreisatz rechnen.“ – Nein! Ein Kind ist mit 12 Jahren 1,50 m groß,
        mit 24 aber nicht 3 m. Prüfe immer zuerst, ob überhaupt eine proportionale oder
        antiproportionale Beziehung vorliegt.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>5 Hefte kosten 4 €. Was kosten 12?</summary>
          <p>1 Heft: 4 € : 5 = 0,80 € → 12 Hefte: 0,80 € · 12 = <strong>9,60 €</strong></p></details>
        <details><summary>6 Pumpen brauchen 4 h. Wie lange brauchen 8?</summary>
          <p>Antiproportional: 1 Pumpe 24 h → 8 Pumpen: 24 : 8 = <strong>3 h</strong></p></details>
        <details><summary>Woran erkennst du den antiproportionalen Fall?</summary>
          <p>Wenn mehr „Helfer“ oder mehr Leistung die benötigte Menge (Zeit) <em>verringern</em>.
          Kontrolle: Das Produkt beider Größen bleibt gleich.</p></details>
      </div>
    `,

    /* ---------- Winkel ---------- */
    winkel: `
      <h2>Winkel erkennen und berechnen</h2>
      <p>Winkel beschreiben Drehungen und Neigungen – vom Dachstuhl bis zur Kameraeinstellung.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>In einem Dreieck sind zwei Winkel bekannt: 65° und 48°. Der dritte ist nicht messbar,
        weil die Skizze abgeschnitten ist.</p>
        <span class="frage">Lässt sich der fehlende Winkel trotzdem sicher bestimmen?</span>
      </div>

      <h3>Die Idee: Die Winkelsumme ist immer gleich</h3>
      <p>Ein Winkel entsteht, wo zwei Strahlen von einem Punkt (dem <strong>Scheitel</strong>) ausgehen.
      Gemessen wird in Grad: eine volle Drehung sind 360°, eine halbe 180°.
      Im Dreieck sind die drei Winkel nicht frei wählbar – ihre Summe steht fest.</p>

      <div class="herleitung-box"><span class="box-title">Warum ergeben die Winkel im Dreieck 180°?</span>
        <p>Reiße die drei Ecken eines Papierdreiecks ab und lege sie mit den Spitzen aneinander:
        Es entsteht exakt eine <strong>gerade Linie</strong> – also 180°.<br>
        Rechnerisch zeigt es die Parallele zu einer Seite durch die gegenüberliegende Ecke:
        Dort treffen sich der Winkel γ und – als Wechselwinkel – α und β zu einem gestreckten Winkel.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Name</th><th>Größe</th><th>Beispiel</th></tr>
        <tr><td>spitzer Winkel</td><td>0° – 90°</td><td>45°</td></tr>
        <tr><td>rechter Winkel</td><td>genau 90°</td><td>Zimmerecke</td></tr>
        <tr><td>stumpfer Winkel</td><td>90° – 180°</td><td>120°</td></tr>
        <tr><td>gestreckter Winkel</td><td>genau 180°</td><td>gerade Linie</td></tr>
        <tr><td>überstumpfer Winkel</td><td>180° – 360°</td><td>270°</td></tr>
      </table></div>

      <div class="merkkasten"><span class="merk-title">Merke: Die wichtigsten Sätze</span>
        <ul>
          <li>Dreieck: α + β + γ = <strong>180°</strong>&ensp;<span class="trenn">•</span>&ensp;Viereck: <strong>360°</strong></li>
          <li><strong>Nebenwinkel</strong> ergänzen sich zu 180°, <strong>Scheitelwinkel</strong> sind gleich groß</li>
          <li>An parallelen Geraden: <strong>Stufen-</strong> und <strong>Wechselwinkel</strong> sind gleich groß</li>
          <li>Im gleichschenkligen Dreieck sind die <strong>Basiswinkel gleich</strong></li>
        </ul>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Skizze anfertigen und alle bekannten Winkel eintragen.</li>
        <li>Passenden Satz auswählen (Winkelsumme, Neben-, Scheitel- oder Basiswinkel).</li>
        <li>Gleichung aufstellen und nach dem gesuchten Winkel auflösen.</li>
        <li><strong>Plausibilität prüfen:</strong> Passt die Größe zum Bild – spitz, stumpf oder rechtwinklig?</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Frage vom Anfang</span>
        <p>α = 65°, β = 48°<br>
        γ = 180° − 65° − 48° = <strong>67°</strong><br>
        <em>Plausibel?</em> Alle drei Winkel unter 90° – ein spitzwinkliges Dreieck ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Gleichschenkliges Dreieck</span>
        <p>Die beiden Basiswinkel messen je 70°.<br>
        Spitze: 180° − 2 · 70° = <strong>40°</strong><br>
        Umgekehrt bei Spitze 40°: Basiswinkel = (180° − 40°) : 2 = 70° ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Neben- und Scheitelwinkel</span>
        <p>Zwei Geraden schneiden sich, ein Winkel misst 65°.<br>
        Nebenwinkel: 180° − 65° = <strong>115°</strong>&ensp;<span class="trenn">•</span>&ensp;Scheitelwinkel: <strong>65°</strong><br>
        Damit sind alle vier Winkel bekannt: 65°, 115°, 65°, 115° – zusammen 360° ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Ein größeres Dreieck hat größere Winkel.“ – Nein! Die Winkelsumme bleibt immer 180°,
        egal wie groß das Dreieck ist. Vergrößern ändert die Seitenlängen, nicht die Winkel.<br>
        Und: 180° gilt nur fürs Dreieck – beim Viereck sind es 360° (es besteht aus zwei Dreiecken),
        beim Fünfeck 540°.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Kann ein Dreieck zwei rechte Winkel haben?</summary>
          <p>Nein – 90° + 90° = 180°, für den dritten Winkel bliebe 0°. Ein Dreieck hat höchstens
          einen rechten Winkel.</p></details>
        <details><summary>Drei Winkel im Viereck sind 100°, 85° und 95°. Wie groß ist der vierte?</summary>
          <p>360° − 280° = <strong>80°</strong></p></details>
        <details><summary>Warum sind Scheitelwinkel gleich groß?</summary>
          <p>Beide haben denselben Nebenwinkel: Ist der eine 180° − x, so ist auch der andere 180° − x.
          Also sind sie gleich.</p></details>
      </div>
    `

  };
})();
