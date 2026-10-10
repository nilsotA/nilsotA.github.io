/* ============================================================
   MatheNils – Erklärseiten: Mittelstufe Teil 1
   Prozent · Zinsen · Terme · Gleichungen · LGS ·
   Lineare Funktionen · Quadratische Gleichungen
   Aufbau: Einstieg → Erarbeitung → Merksatz → Verfahren →
   Beispiele → Fehlvorstellungen → Selbstkontrolle
   ============================================================ */
'use strict';

const LEARN_MITTEL1 = (() => {
  const { frac } = Util;
  return {

    /* ---------- Prozentrechnung ---------- */
    prozent: `
      <h2>Prozentrechnung – Anteile von Hundert</h2>
      <p>Prozente machen Anteile vergleichbar: Rabatte, Wahlergebnisse, Akkustand, Zinssätze –
      überall wird auf 100 normiert.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Zwei Klassen sammeln für einen Ausflug. Klasse A hat 18 von 24 Schülern dabei,
        Klasse B 21 von 30. Die absoluten Zahlen sagen wenig – die Klassen sind unterschiedlich groß.</p>
        <span class="frage">Welche Klasse ist anteilig besser dabei – und wie macht man das vergleichbar?</span>
      </div>

      <h3>Die Idee: alles auf 100 umrechnen</h3>
      <p>„Prozent“ heißt wörtlich „von Hundert“. Rechnet man beide Anteile so um, als hätte jede Klasse
      100 Schüler, werden sie direkt vergleichbar: 18 von 24 sind 75 %, 21 von 30 sind 70 %.
      Klasse A liegt also vorn.</p>

      <div class="herleitung-box"><span class="box-title">Warum funktioniert die Formel?</span>
        <p>Ein Prozentsatz ist nichts anderes als ein Bruch mit dem Nenner 100:
        25 % = ${frac(25, 100)} = ${frac(1, 4)} = 0,25.<br>
        „30 % von 80 €“ heißt also ${frac(30, 100)} · 80 € – man nimmt den Anteil <em>mal</em> das Ganze.
        Genau das steht in der Formel W = G · p/100. Die beiden anderen Formeln entstehen daraus
        durch einfaches Umstellen – man muss sie nicht extra lernen.</p>
        <p>Man kann die Formel auch in zwei Schritten rechnen: 1 % ist ein Hundertstel des Ganzen,
        also G : 100. Danach nimmt man diesen Wert mal die Prozentzahl.
        1 % von 640 € ist 6,40 €, also sind 5 % gleich 5 · 6,40 € = <strong>32 €</strong>.
        Das ist dieselbe Rechnung wie 640 · 5/100 – nur nacheinander statt auf einmal.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Eine Formel, drei Fragen</span>
        <p><span class="formula">W = G · p ⁄ 100</span></p>
        <ul>
          <li><strong>G</strong> = Grundwert, das Ganze (100 %)</li>
          <li><strong>p %</strong> = Prozentsatz, der Anteil in Prozent</li>
          <li><strong>W</strong> = Prozentwert, der Anteil als Zahl</li>
        </ul>
        <p>Umgestellt: G = W · 100 ⁄ p&ensp;<span class="trenn">•</span>&ensp;p = W · 100 ⁄ G</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Grundwert finden:</strong> Was ist hier das Ganze? (meist nach „von“)</li>
        <li>Zuordnen, welche zwei Größen gegeben sind und welche gesucht ist.</li>
        <li>Passende Formel wählen und einsetzen.</li>
        <li><strong>Probe:</strong> Ergebnis zurückrechnen oder mit einem Anker vergleichen
        (75 % = drei Viertel, 50 % = Hälfte, 25 % = Viertel, 20 % = Fünftel, 10 % = Zehntel).</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Prozentwert gesucht</span>
        <p>Wie viel sind 30 % von 80 €?<br>
        W = 80 · 30/100 = <strong>24 €</strong><br>
        <em>Kontrolle:</em> 10 % wären 8 €, also 30 % = 3 · 8 € = 24 € ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Grundwert gesucht</span>
        <p>20 % eines Betrags sind 15 €. Wie hoch ist der ganze Betrag?<br>
        G = 15 · 100/20 = <strong>75 €</strong><br>
        <em>Probe:</em> 20 % von 75 € = 15 € ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Prozentsatz gesucht – die Frage vom Anfang</span>
        <p>Klasse A: p = 18 · 100/24 = <strong>75 %</strong><br>
        Klasse B: p = 21 · 100/30 = <strong>70 %</strong><br>
        Obwohl Klasse B mehr Schüler mitbringt, ist Klasse A anteilig stärker dabei.</p>
      </div>

      <h3>Rabatt und Aufschlag – der schnelle Weg</h3>
      <p>Statt zweistufig (Rabatt berechnen, dann abziehen) geht es direkt über den
      <strong>Faktor</strong>: 25 % Rabatt heißt, man zahlt 75 % – also · 0,75.
      Ein Aufschlag geht genauso, nur nach oben: Steigt ein Preis um 5 %, zahlt man
      105 % – also · 1,05.</p>
      <div class="example-box"><span class="ex-title">25 % Rabatt auf 120 €</span>
        <p>Klassisch: 120 · 25/100 = 30 € Rabatt → 120 − 30 = <strong>90 €</strong><br>
        Direkt: 120 · 0,75 = <strong>90 €</strong> ✓ – ein Rechenschritt statt zwei.</p>
      </div>
      <div class="example-box"><span class="ex-title">5 % Aufschlag auf 240 €</span>
        <p>Ein Jahresabo kostet 240 €, der Preis steigt um 5 %.<br>
        Klassisch: 240 · 5/100 = 12 € Erhöhung → 240 + 12 = <strong>252 €</strong><br>
        Direkt: 240 · 1,05 = <strong>252 €</strong> ✓ – der Faktor ist jetzt größer als 1.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„−20 % und danach +20 % ergibt wieder den Ausgangspreis.“ – Nein!
        100 € · 0,8 = 80 €, dann 80 € · 1,2 = 96 €. Beim zweiten Mal bezieht sich der Prozentsatz auf einen
        <strong>anderen Grundwert</strong>. Frag dich bei jeder Prozentangabe:
        <em>Prozent wovon?</em></p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Ein Pullover kostet nach 30 % Rabatt 42 €. Was kostete er vorher?</summary>
          <p>42 € entsprechen 70 % → G = 42 · 100/70 = <strong>60 €</strong>.
          Vorsicht: Nicht 42 € + 30 % rechnen, das ergäbe 54,60 €!</p></details>
        <details><summary>Was ist mehr: 20 % von 50 oder 50 % von 20?</summary>
          <p>Beides <strong>10</strong> – die Rechnung ist dieselbe (0,2 · 50 = 0,5 · 20).</p></details>
        <details><summary>Wie rechnest du 35 % im Kopf?</summary>
          <p>25 % (ein Viertel) + 10 % (ein Zehntel). Bei 80 €: 20 € + 8 € = <strong>28 €</strong>.</p></details>
      </div>
    `,

    /* ---------- Zinsrechnung ---------- */
    zinsen: `
      <h2>Zinsrechnung – Prozente mit Geld und Zeit</h2>
      <p>Zinsen sind der Preis fürs Leihen von Geld – für Sparer ein Ertrag, für Kreditnehmer eine Last.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Zwei Angebote für 1000 €: Bank A zahlt 10 Jahre lang jährlich 50 € aus.
        Bank B schreibt jährlich 5 % gut und lässt alles auf dem Konto liegen.
        Beide werben mit „5 % Zinsen“.</p>
        <span class="frage">Ist das wirklich dasselbe – oder gewinnt eine Bank deutlich?</span>
      </div>

      <h3>Die Idee: Zinsrechnung ist Prozentrechnung mit neuen Namen</h3>
      <p>Aus dem Grundwert wird das <strong>Kapital K</strong>, aus dem Prozentwert die
      <strong>Zinsen Z</strong>, der Prozentsatz heißt <strong>Zinssatz p %</strong> – meist pro Jahr.
      Alles, was du über Prozente weißt, gilt weiter.</p>

      <div class="herleitung-box"><span class="box-title">Warum wächst Kapital beim Zinseszins schneller?</span>
        <p>Nach einem Jahr hast du K + 5 % von K, also K · 1,05.
        Bleibt dieses Geld liegen, verzinst sich im zweiten Jahr der <em>größere</em> Betrag:
        (K · 1,05) · 1,05 = K · 1,05².<br>
        Aus wiederholtem Multiplizieren mit demselben Faktor entsteht eine <strong>Potenz</strong> –
        deshalb wächst Kapital mit Zinseszins exponentiell und nicht linear.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">Z = K · p ⁄ 100</span></p>
        <p>Nach einem Jahr: K<sub>neu</sub> = K · (1 + p/100)</p>
        <p>Nach n Jahren mit Zinseszins: <span class="formula">K<sub>n</sub> = K · (1 + p⁄100)<sup>n</sup></span></p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Kläre: Werden die Zinsen <strong>abgehoben</strong> (einfacher Zins) oder bleiben sie liegen (Zinseszins)?</li>
        <li>Bestimme den <strong>Wachstumsfaktor</strong> q = 1 + p/100 (bei 5 % also 1,05).</li>
        <li>Einfacher Zins: Z pro Jahr berechnen und mit der Jahreszahl multiplizieren.</li>
        <li>Zinseszins: K · q<sup>n</sup> rechnen – Jahr für Jahr oder direkt mit der Potenz.</li>
        <li><strong>Kontrolle:</strong> Zinseszins muss immer etwas mehr ergeben als einfacher Zins.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Jahreszinsen berechnen</span>
        <p>1200 € zu 3 % pro Jahr:<br>
        Z = 1200 · 3/100 = <strong>36 €</strong> → nach einem Jahr 1236 €</p>
      </div>
      <div class="example-box"><span class="ex-title">Zinssatz gesucht</span>
        <p>Für 2000 € gibt es 90 € Zinsen im Jahr.<br>
        p = 90 · 100/2000 = <strong>4,5 %</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Die Frage vom Anfang: A oder B?</span>
        <p><strong>Bank A</strong> (einfacher Zins): 10 · 50 € = 500 € → Endstand <strong>1500 €</strong><br>
        <strong>Bank B</strong> (Zinseszins): 1000 · 1,05<sup>10</sup> ≈ <strong>1628,89 €</strong><br>
        Differenz: rund <strong>129 €</strong> – dieselbe Prozentangabe, deutlich anderes Ergebnis.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>1000 € zu 5 %</th><th>einfacher Zins</th><th>Zinseszins</th></tr>
        <tr><td>nach 1 Jahr</td><td>1050 €</td><td>1050 €</td></tr>
        <tr><td>nach 2 Jahren</td><td>1100 €</td><td>1102,50 €</td></tr>
        <tr><td>nach 10 Jahren</td><td>1500 €</td><td>≈ 1628,89 €</td></tr>
      </table></div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Bei 5 % über 2 Jahre rechne ich einfach 10 %.“ – Nur beim einfachen Zins.
        Mit Zinseszins sind es 1,05² = 1,1025, also <strong>10,25 %</strong>.
        Die zusätzlichen 0,25 % sind die Zinsen auf die Zinsen des ersten Jahres.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was bedeutet der Faktor 1,03?</summary>
          <p>Ein Wachstum um <strong>3 %</strong> pro Schritt: Das Kapital behält 100 % und bekommt 3 % dazu.</p></details>
        <details><summary>500 € zu 4 % für 3 Jahre mit Zinseszins – wie rechnest du?</summary>
          <p>500 · 1,04³ = 500 · 1,124864 ≈ <strong>562,43 €</strong></p></details>
        <details><summary>Warum ist ein Dispokredit mit 12 % so teuer?</summary>
          <p>Weil auch Schulden exponentiell wachsen: Aus 1000 € werden nach 3 Jahren
          1000 · 1,12³ ≈ 1405 € – über 40 % mehr.</p></details>
      </div>
    `,

    /* ---------- Terme & binomische Formeln ---------- */
    terme: `
      <h2>Terme umformen und binomische Formeln</h2>
      <p>Terme sind die Sprache der Algebra: Sie beschreiben Rechnungen allgemein –
      für <em>jede</em> Zahl gleichzeitig.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein quadratisches Grundstück mit Seitenlänge a soll auf beiden Seiten um b Meter
        erweitert werden. Wie groß wird die neue Fläche?
        Viele antworten spontan „a² + b²“.</p>
        <span class="frage">Stimmt das – oder fehlt da etwas Entscheidendes?</span>
      </div>

      <h3>Die Idee: Rechnen mit Platzhaltern</h3>
      <p>Ein <strong>Term</strong> ist ein Rechenausdruck mit Zahlen und Variablen, z. B. 3x + 5.
      Die Variable x steht für eine beliebige Zahl. Terme umformen heißt: denselben Wert
      einfacher oder passender schreiben – der Wert darf sich dabei <em>nie</em> ändern.</p>

      <div class="herleitung-box"><span class="box-title">Warum ist (a + b)² nicht a² + b²?</span>
        <p>Schau auf die Zeichnung: Das große Quadrat mit der Seite a + b zerfällt in
        <strong>vier</strong> Teile – a², das kleine Quadrat b² und <strong>zwei</strong> Rechtecke
        der Größe a · b. Genau diese beiden Rechtecke vergisst man bei „a² + b²“.<br>
        Rechnerisch: (a+b)² = (a+b)(a+b) = a·a + a·b + b·a + b·b = a² + 2ab + b².</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Umformungsregeln</span>
        <ul>
          <li>Nur <strong>gleichartige</strong> Terme zusammenfassen: 3x + 5x = 8x, aber 3x + 5x² bleibt stehen</li>
          <li><strong>Klammer auflösen:</strong> a · (b + c) = ab + ac</li>
          <li><strong>Minus vor der Klammer</strong> dreht alle Vorzeichen: 7 − (2x − 3) = 7 − 2x + 3</li>
        </ul>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Binomische Formel</th><th>Beispiel</th></tr>
        <tr><td>1.: (a + b)² = a² + 2ab + b²</td><td>(x + 3)² = x² + 6x + 9</td></tr>
        <tr><td>2.: (a − b)² = a² − 2ab + b²</td><td>(x − 5)² = x² − 10x + 25</td></tr>
        <tr><td>3.: (a + b)(a − b) = a² − b²</td><td>(x + 4)(x − 4) = x² − 16</td></tr>
      </table></div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Erkenne die <strong>Struktur</strong>: Steht da ein Quadrat einer Summe oder ein Produkt aus Summe und Differenz?</li>
        <li>Ordne a und b zu – auch Koeffizienten gehören dazu (bei 2x ist a = 2x).</li>
        <li>Formel anwenden und sorgfältig einsetzen.</li>
        <li><strong>Zahlenprobe:</strong> Setze x = 1 in Ausgangs- und Ergebnisterm ein –
        beide müssen denselben Wert liefern.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Klammer auflösen und zusammenfassen</span>
        <p>4 · (2x + 3) − 5x = 8x + 12 − 5x = <strong>3x + 12</strong><br>
        <em>Probe mit x = 1:</em> 4 · 5 − 5 = 15 und 3 + 12 = 15 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Mit Koeffizient vor dem x</span>
        <p>(2x + 3)²&nbsp;→ hier ist a = 2x und b = 3<br>
        = (2x)² + 2 · 2x · 3 + 3² = <strong>4x² + 12x + 9</strong><br>
        <em>Typischer Fehler wäre 2x² + 9</em> – sowohl das Quadrieren des Koeffizienten
        als auch der Mittelterm gehen dabei verloren.</p>
      </div>
      <div class="example-box"><span class="ex-title">Rückwärts: Faktorisieren</span>
        <p>x² + 10x + 25: vorn x², hinten 5², Mitte 2 · 5 · x ✓ → <strong>(x + 5)²</strong><br>
        x² − 49: Differenz zweier Quadrate → <strong>(x + 7)(x − 7)</strong></p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„(x + 3)² = x² + 9“ – der häufigste Fehler der Mittelstufe.
        Probe mit x = 1: (1+3)² = 16, aber 1 + 9 = 10 ✗.
        Es fehlt der Mittelterm 2 · 3 · x = 6x. Merke: <strong>Quadrieren verteilt sich nicht
        über die Summe.</strong></p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie groß wird das Grundstück aus dem Einstieg?</summary>
          <p>(a + b)² = a² + 2ab + b². Bei a = 20 m und b = 5 m: 400 + 200 + 25 = <strong>625 m²</strong>
          – nicht 425 m².</p></details>
        <details><summary>Multipliziere (3x − 2)² aus.</summary>
          <p>9x² − 12x + 4&nbsp;(a = 3x, b = 2, zweite binomische Formel)</p></details>
        <details><summary>Wie rechnest du 99 · 101 im Kopf?</summary>
          <p>Dritte binomische Formel: (100 − 1)(100 + 1) = 100² − 1 = <strong>9999</strong>.</p></details>
      </div>
    `,

    /* ---------- Gleichungen ---------- */
    gleichungen: `
      <h2>Lineare Gleichungen lösen</h2>
      <p>Gleichungen verwandeln eine Textaufgabe in eine Rechnung – und liefern die gesuchte Zahl
      systematisch statt durch Raten.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Handytarif kostet 5 € Grundgebühr plus 3 € pro GB. Deine Rechnung beträgt 26 €.
        Man könnte jetzt raten: 5 GB? 6 GB? 7 GB?</p>
        <span class="frage">Gibt es einen Weg, der die Antwort direkt liefert – ohne Probieren?</span>
      </div>

      <h3>Die Idee: Das Gleichgewicht der Waage</h3>
      <p>Eine Gleichung behauptet, dass links und rechts <em>derselbe</em> Wert steht – wie eine
      Waage im Gleichgewicht. Um x freizulegen, darf man die Waage verändern, aber immer
      <strong>auf beiden Seiten gleich</strong>. Solche Schritte heißen
      <strong>Äquivalenzumformungen</strong>, weil sie die Lösungsmenge nicht verändern.</p>

      <div class="herleitung-box"><span class="box-title">Warum darf man beide Seiten verändern?</span>
        <p>Steht links dasselbe wie rechts, dann bleibt das auch so, wenn man beiden dasselbe
        hinzufügt oder wegnimmt: Aus a = b folgt a + c = b + c.
        Genauso beim Multiplizieren mit c ≠ 0. Verändert man dagegen nur eine Seite,
        kippt die Waage – die Gleichung ist eine andere geworden und die Lösung wird falsch.<br>
        <em>Warum c ≠ 0?</em> Mit 0 multipliziert würde aus jeder Gleichung 0 = 0 – die Information ginge verloren.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Erlaubte Umformungen</span>
        <ul>
          <li>Auf beiden Seiten dieselbe Zahl <strong>addieren</strong> oder <strong>subtrahieren</strong></li>
          <li>Beide Seiten mit derselben Zahl (≠ 0) <strong>multiplizieren</strong> oder <strong>dividieren</strong></li>
        </ul>
        <p>Notiert wird die Umformung hinter einem senkrechten Strich:&nbsp;| − 5</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Bei einer <strong>Textaufgabe</strong> zuerst das Gesuchte <strong>x</strong> nennen und den Text
        Stück für Stück übersetzen: „3 € pro GB“ wird zu 3x, „4-mal so alt“ zu 4x, „zusammen“ zu einem Plus.</li>
        <li><strong>Klammern</strong> auflösen.</li>
        <li>Jede Seite für sich <strong>vereinfachen</strong> (gleichartige Terme zusammenfassen).</li>
        <li>Alle <strong>x-Terme auf eine Seite</strong>, alle Zahlen auf die andere.</li>
        <li>Durch den <strong>Faktor vor x</strong> teilen. Steht x im Bruch: mit dem Nenner multiplizieren.</li>
        <li><strong>Probe:</strong> Lösung in die <em>ursprüngliche</em> Gleichung einsetzen.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Grundform – die Frage vom Anfang</span>
        <p>Gesucht ist die Anzahl der GB – nenne sie x. „3 € pro GB“ ergibt 3x €, dazu 5 € Grundgebühr:<br>
        3x + 5 = 26&nbsp;| − 5<br>
        3x = 21&nbsp;| : 3<br>
        x = <strong>7</strong> → du hast 7 GB verbraucht.<br>
        <em>Probe:</em> 3 · 7 + 5 = 26 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">x im Bruch</span>
        <p>Der Bruchstrich ist ein Geteiltzeichen: ${frac('x', 5)} heißt x : 5.
        Teilen machst du mit Malnehmen rückgängig – multipliziere beide Seiten mit dem Nenner 5.</p>
        <p>${frac('x', 5)} = 13&nbsp;| · 5<br>
        x = 13 · 5 = <strong>65</strong><br>
        <em>Probe:</em> 65 : 5 = 13 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">x auf beiden Seiten</span>
        <p>5x + 7 = 2x + 19&nbsp;| − 2x<br>
        3x + 7 = 19&nbsp;| − 7<br>
        3x = 12&nbsp;| : 3<br>
        x = <strong>4</strong>&ensp;<span class="trenn">•</span>&ensp;<em>Probe:</em> 27 = 27 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Gleichung mit Klammer</span>
        <p>4 · (x − 2) = 2x + 6<br>
        4x − 8 = 2x + 6&nbsp;| − 2x<br>
        2x − 8 = 6&nbsp;| + 8<br>
        2x = 14&nbsp;| : 2<br>
        x = <strong>7</strong>&ensp;<span class="trenn">•</span>&ensp;<em>Probe:</em> 4 · 5 = 20 = 14 + 6 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Textaufgabe mit „-mal so“</span>
        <p>Ein Vater ist 3-mal so alt wie sein Kind. Zusammen sind sie 60 Jahre alt.<br>
        Das Gesuchte bekommt das x: Kind = x, Vater = 3x. „Zusammen“ heißt addieren:<br>
        x + 3x = 60<br>
        4x = 60&nbsp;| : 4<br>
        x = <strong>15</strong> → das Kind ist 15, der Vater 3 · 15 = 45.<br>
        <em>Probe:</em> 15 + 45 = 60 ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Ich bringe die 5 einfach nach rechts.“ – Dieses „Rüberbringen“ ist nur eine
        Abkürzung für „auf beiden Seiten 5 subtrahieren“. Wer das mechanisch macht,
        vergisst leicht das Vorzeichen. Schreib die Umformung hinter den Strich –
        dann bleibt sichtbar, <em>was</em> du auf beiden Seiten tust.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Löse 7x − 4 = 3x + 12.</summary>
          <p>| − 3x → 4x − 4 = 12&nbsp;| + 4 → 4x = 16&nbsp;| : 4 → x = <strong>4</strong></p></details>
        <details><summary>Was bedeutet es, wenn am Ende 0 = 5 herauskommt?</summary>
          <p>Die Gleichung hat <strong>keine Lösung</strong> – keine Zahl erfüllt sie.
          Kommt dagegen 0 = 0 heraus, ist <em>jede</em> Zahl eine Lösung.</p></details>
        <details><summary>Warum ist die Probe wichtig?</summary>
          <p>Sie deckt Rechen- und Vorzeichenfehler zuverlässig auf – und kostet nur wenige Sekunden.
          Wichtig: in die <em>ursprüngliche</em> Gleichung einsetzen, nicht in eine umgeformte.</p></details>
      </div>
    `,

    /* ---------- Gleichungssysteme ---------- */
    lgs: `
      <h2>Lineare Gleichungssysteme (LGS)</h2>
      <p>Manche Aufgaben haben zwei Unbekannte – dann braucht man auch zwei Gleichungen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Im Kino kosten 2 Erwachsenen- und 3 Kindertickets 39 €.
        1 Erwachsenen- und 4 Kindertickets kosten 32 €.
        Mit einer einzigen Gleichung kommt man hier nicht weiter.</p>
        <span class="frage">Wie ermittelt man beide Preise gleichzeitig?</span>
      </div>

      <h3>Die Idee: Zwei Bedingungen legen zwei Zahlen fest</h3>
      <p>Jede einzelne Gleichung lässt unendlich viele Möglichkeiten offen.
      Erst <strong>beide zusammen</strong> engen die Lösung auf ein Zahlenpaar ein.
      Geometrisch: Jede Gleichung ist eine Gerade – gesucht ist ihr <strong>Schnittpunkt</strong>.</p>

      <div class="herleitung-box"><span class="box-title">Warum darf man zwei Gleichungen addieren?</span>
        <p>Gilt links = rechts in beiden Gleichungen, dann stimmt auch die Summe beider Seiten überein.
        Addiert man geschickt, hebt sich eine Variable weg – übrig bleibt eine gewöhnliche Gleichung
        mit nur einer Unbekannten, die du längst lösen kannst.<br>
        Heben sich die Koeffizienten nicht von selbst weg, hilfst du nach.
        Eine Gleichung darfst du auf beiden Seiten mit derselben Zahl <strong>vervielfachen</strong> – sie bleibt wahr.
        Dann haben beide Gleichungen denselben Koeffizienten, und ihre Differenz lässt die Variable verschwinden.
        Alle drei Verfahren verfolgen dasselbe Ziel: <strong>eine Variable eliminieren</strong>.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Drei Wege, ein Ziel</span>
        <ul>
          <li><strong>Einsetzen:</strong> wenn eine Gleichung schon nach x oder y aufgelöst ist</li>
          <li><strong>Gleichsetzen:</strong> wenn beide nach derselben Variablen aufgelöst sind</li>
          <li><strong>Addieren:</strong> wenn sich Koeffizienten wegheben – sonst eine oder beide Gleichungen vervielfachen, dann subtrahieren</li>
        </ul>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Beide Gleichungen ordnen und mit I und II benennen.</li>
        <li>Verfahren wählen – welches passt zur Form der Gleichungen?</li>
        <li>Eine Variable <strong>eliminieren</strong> und die entstehende Gleichung lösen.
        Hebt sich beim Addieren nichts weg: eine oder beide Gleichungen vervielfachen, bis die Koeffizienten gleich sind, dann subtrahieren.</li>
        <li>Den Wert <strong>zurücksetzen</strong>, um die zweite Variable zu bestimmen.</li>
        <li><strong>Probe in beiden Gleichungen</strong> – erst dann ist die Aufgabe fertig.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Einsetzungsverfahren</span>
        <p>I. y = x + 1&ensp;<span class="trenn">•</span>&ensp;II. x + y = 5<br>
        I in II: x + (x + 1) = 5 → 2x + 1 = 5 → x = <strong>2</strong><br>
        Zurück in I: y = 3 → Lösung (2 | 3)</p>
      </div>
      <div class="example-box"><span class="ex-title">Additionsverfahren</span>
        <p>I. 2x + 3y = 12&ensp;<span class="trenn">•</span>&ensp;II. 4x − 3y = 6<br>
        I + II: 6x = 18 → x = <strong>3</strong><br>
        In I: 6 + 3y = 12 → y = <strong>2</strong><br>
        Probe in II: 12 − 6 = 6 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Additionsverfahren mit Vervielfachen</span>
        <p>I. 2x + 3y = 13&ensp;<span class="trenn">•</span>&ensp;II. 5x + 2y = 16<br>
        Hier hebt sich nichts weg. Also zuerst gleiche y-Koeffizienten herstellen:<br>
        I · 2 = I′: 4x + 6y = 26&ensp;<span class="trenn">•</span>&ensp;II · 3 = II′: 15x + 6y = 48<br>
        II′ − I′: 15x − 4x = 48 − 26 → 11x = 22 → x = <strong>2</strong><br>
        In I: 4 + 3y = 13 → 3y = 9 → y = <strong>3</strong><br>
        Probe in II: 10 + 6 = 16 ✓<br>
        Beim Subtrahieren ziehst du <strong>jedes</strong> Glied ab – auch die rechte Seite.
        Stimmt ein Koeffizient schon überein, sparst du dir das Vervielfachen: Bei 4x + 3y = 29 und
        4x + 2y = 26 liefert I − II sofort y = 3.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Kino-Frage vom Anfang</span>
        <p>I. 2E + 3K = 39&ensp;<span class="trenn">•</span>&ensp;II. E + 4K = 32<br>
        II nach E auflösen: E = 32 − 4K, in I einsetzen:<br>
        2(32 − 4K) + 3K = 39 → 64 − 8K + 3K = 39 → −5K = −25 → K = <strong>5 €</strong><br>
        E = 32 − 20 = <strong>12 €</strong>&ensp;<span class="trenn">•</span>&ensp;Probe in I: 24 + 15 = 39 ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Mit x bin ich fertig.“ – Nein, ein LGS ist erst mit dem <strong>vollständigen Paar</strong>
        (x | y) gelöst.<br>
        Und: Ergibt sich eine falsche Aussage wie 0 = 5, sind die Geraden <strong>parallel</strong> –
        es gibt keine Lösung. Bei 0 = 0 sind es dieselbe Gerade und damit unendlich viele Lösungen.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Welches Verfahren passt zu I. y = 2x − 1 und II. y = x + 3?</summary>
          <p>Das <strong>Gleichsetzungsverfahren</strong>: 2x − 1 = x + 3 → x = 4, y = 7.</p></details>
        <details><summary>Wie eliminierst du y bei I. 3x + 2y = 16 und II. 5x − 4y = 3?</summary>
          <p>I mit 2 multiplizieren: 6x + 4y = 32. Dann I′ + II: 11x = 35 → x = 35/11.</p></details>
        <details><summary>Was bedeutet der Schnittpunkt geometrisch?</summary>
          <p>Er ist der einzige Punkt, der auf <em>beiden</em> Geraden liegt – also beide Gleichungen
          gleichzeitig erfüllt.</p></details>
      </div>
    `,

    /* ---------- Lineare Funktionen ---------- */
    linfunktion: `
      <h2>Lineare Funktionen: f(x) = mx + b</h2>
      <p>Lineare Funktionen beschreiben gleichmäßige Veränderung – und sind das Werkzeug,
      um aus zwei Messwerten eine ganze Vorhersage zu machen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Taxi verlangt 4 € Grundpreis plus 2 € pro Kilometer.
        Nach 3 km zahlst du 10 €, nach 7 km 18 €.</p>
        <span class="frage">Wie sagst du den Preis für <em>jede</em> Strecke voraus – mit einer einzigen Formel?</span>
      </div>

      <h3>Die Idee: Startwert plus gleichmäßige Veränderung</h3>
      <p>Beim Taxi gibt es zwei Bestandteile: einen festen <strong>Startwert</strong> (Grundpreis)
      und eine feste <strong>Änderung pro Schritt</strong> (Preis je km). Genau diese beiden Zahlen
      stecken in f(x) = mx + b. Der Graph ist deshalb immer eine <strong>Gerade</strong>.</p>

      <div class="herleitung-box"><span class="box-title">Warum berechnet man m als Differenzenquotient?</span>
        <p>Die Steigung sagt: Wie viel ändert sich y, wenn x um 1 wächst?
        Zwischen zwei Punkten wächst y um (y₂ − y₁), während x um (x₂ − x₁) wächst.
        Teilt man beides, erhält man die Änderung <em>pro einem</em> x-Schritt:<br>
        m = (y₂ − y₁) ⁄ (x₂ − x₁). Beim Taxi: (18 − 10)/(7 − 3) = 8/4 = 2 € pro km.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <ul>
          <li><strong>b</strong> = y-Achsenabschnitt: Startwert, Punkt (0 | b)</li>
          <li><strong>m</strong> = Steigung: pro 1 nach rechts geht es m nach oben (m &gt; 0) bzw. unten (m &lt; 0)</li>
          <li>m = 0 → waagerechte Gerade</li>
        </ul>
        <p><span class="formula">m = (y₂ − y₁) ⁄ (x₂ − x₁)</span></p>
      </div>

      <h3>So gehst du vor: Geradengleichung aus zwei Punkten</h3>
      <ol class="schritte">
        <li><strong>Steigung m</strong> mit dem Differenzenquotienten berechnen.</li>
        <li>Einen der beiden Punkte in y = mx + b <strong>einsetzen</strong>.</li>
        <li>Nach <strong>b</strong> auflösen.</li>
        <li>Gleichung aufschreiben und mit dem <strong>zweiten Punkt prüfen</strong>.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Taxi-Frage vom Anfang</span>
        <p>Punkte: (3 | 10) und (7 | 18)<br>
        m = (18 − 10)/(7 − 3) = <strong>2</strong><br>
        Einsetzen von (3 | 10): 10 = 2 · 3 + b → b = <strong>4</strong><br>
        <strong>f(x) = 2x + 4</strong>&ensp;<span class="trenn">•</span>&ensp;Probe mit (7 | 18): 2 · 7 + 4 = 18 ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Nullstelle berechnen</span>
        <p>f(x) = 2x − 6. Wo schneidet die Gerade die x-Achse?<br>
        Setze f(x) = 0: 2x − 6 = 0 → x = <strong>3</strong> → Schnittpunkt (3 | 0)</p>
      </div>
      <div class="example-box"><span class="ex-title">Punktprobe</span>
        <p>Liegt P(2 | 5) auf f(x) = 3x − 1?<br>
        f(2) = 3 · 2 − 1 = 5 = y ✓ → <strong>ja</strong>.<br>
        Bei Q(2 | 7) wäre f(2) = 5 ≠ 7 → Q liegt nicht auf der Geraden.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Bei der Steigung teile ich x-Differenz durch y-Differenz.“ – Genau andersherum:
        <strong>y-Unterschied durch x-Unterschied</strong> („Höhe durch Breite“).<br>
        <em>Gegenbeispiel</em> mit A(1 | 2) und B(5 | 10): Richtig ist m = (10 − 2)/(5 − 1) = 8/4 = <strong>2</strong>,
        also f(x) = 2x – Probe mit B: 2 · 5 = 10 ✓<br>
        Verkehrt herum käme m = (5 − 1)/(10 − 2) = 4/8 = 0,5 heraus. Setzt man damit A ein, wird b = 1,5,
        und diese Gerade liefert bei x = 5 nur 0,5 · 5 + 1,5 = <strong>4</strong> statt 10 ✗<br>
        Auch die Reihenfolge zählt: Beginnst du oben mit y₂, muss unten x₂ zuerst stehen –
        sonst wird aus (10 − 2)/(1 − 5) = <strong>−2</strong> eine fallende statt einer steigenden Geraden.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was bedeutet m = −3 im Sachzusammenhang?</summary>
          <p>Pro Schritt nach rechts geht es <strong>3 nach unten</strong> – z. B. ein Tank,
          der pro Stunde 3 Liter verliert.</p></details>
        <details><summary>Bestimme die Gerade durch A(1 | 3) und B(4 | 12).</summary>
          <p>m = 9/3 = 3, dann 3 = 3 · 1 + b → b = 0 → <strong>f(x) = 3x</strong></p></details>
        <details><summary>Warum hat f(x) = 5 keine Nullstelle?</summary>
          <p>Die Gerade verläuft waagerecht auf der Höhe 5 und erreicht die x-Achse nie.
          5 = 0 hat keine Lösung.</p></details>
      </div>
    `,

    /* ---------- Quadratische Gleichungen ---------- */
    /* ---------- Quadratische Funktionen ---------- */
    quadfunktion: `
      <h2>Quadratische Funktionen und ihre Parabeln</h2>
      <p>Bei einer linearen Funktion ändert sich der Wert in gleichen Schritten. Kommt ein x²
      hinzu, wird der Graph zur <strong>Parabel</strong> – und die hat einen ausgezeichneten Punkt,
      den es bei der Geraden nicht gibt: den Scheitel.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Ball wird geworfen. Seine Höhe folgt der Gleichung h(t) = −2(t − 3)² + 18.
        Man könnte Werte einsetzen und probieren, wann er am höchsten ist.</p>
        <span class="frage">Wie liest man den höchsten Punkt ab, ohne zu probieren?</span>
      </div>

      <div class="herleitung-box"><span class="box-title">Warum verschiebt „minus 3“ nach rechts?</span>
        <p>Das ist die Stelle, an der fast alle einmal stolpern. Bei f(x) = (x − 3)² steht ein Minus –
        verschoben wird der Graph aber nach <strong>rechts</strong>.</p>
        <p>Der Grund liegt in der Klammer. Die Normalparabel y = x² hat ihren tiefsten Punkt dort,
        wo das Quadrierte null ist, also bei x = 0. Bei (x − 3)² wird die Klammer null, wenn
        <strong>x = 3</strong> ist. Der tiefste Punkt wandert also dorthin, wo die Klammer null wird –
        und das ist bei einem Minus die positive Zahl.</p>
        <p>Anders gesagt: Die Parabel braucht ein um 3 <em>größeres</em> x, um dasselbe zu tun wie
        vorher. Sie kommt später dran – und „später“ heißt auf der x-Achse rechts.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Die Scheitelpunktform</span>
        <p><span class="formula">f(x) = a · (x − d)² + e</span></p>
        <p>Der Scheitel liegt bei <strong>S(d | e)</strong> – d und e lassen sich direkt ablesen,
        beim d mit umgedrehtem Vorzeichen.</p>
        <ul>
          <li><strong>a &gt; 0</strong> → nach oben geöffnet, der Scheitel ist der tiefste Punkt</li>
          <li><strong>a &lt; 0</strong> → nach unten geöffnet, der Scheitel ist der höchste Punkt</li>
          <li><strong>|a| &gt; 1</strong> → enger als die Normalparabel, <strong>|a| &lt; 1</strong> → weiter</li>
        </ul>
        <p><strong>Nullstellen:</strong> a · (x − d)² + e = 0 nach der Klammer auflösen, dann die
        Wurzel mit beiden Vorzeichen ziehen. Steht rechts eine negative Zahl, gibt es keine
        Nullstelle.</p>
      </div>

      <ol class="schritte">
        <li><strong>a ablesen</strong> – es steht vor der Klammer und entscheidet über Richtung und Breite.</li>
        <li><strong>d ablesen</strong> und das Vorzeichen umdrehen: (x − 3) heißt d = 3, (x + 3) heißt d = −3.</li>
        <li><strong>e ablesen</strong> – der Summand ganz hinten, ohne Vorzeichenwechsel.</li>
        <li><strong>Scheitel hinschreiben:</strong> S(d | e).</li>
        <li><strong>Probe:</strong> f(d) einsetzen – die Klammer wird null, es muss e herauskommen.</li>
      </ol>

      <div class="example-box"><span class="ex-title">Die Ballfrage vom Anfang</span>
        <p>h(t) = −2(t − 3)² + 18<br>
        a = −2 → nach unten geöffnet, der Scheitel ist also der <strong>höchste</strong> Punkt.<br>
        d = 3, e = 18 → S(3 | 18)<br>
        Der Ball ist nach <strong>3 Sekunden</strong> am höchsten, und zwar <strong>18 Meter</strong> hoch.<br>
        <em>Probe:</em> h(3) = −2 · 0² + 18 = 18 ✓</p>
      </div>

      <div class="example-box"><span class="ex-title">Von einer Parabel zur nächsten</span>
        <p>f(x) = (x − 3)² + 2 hat den Scheitel S(3 | 2) – in der Klammer steht ein Minus, die
        Scheitelstelle ist also 3 und nicht −3. Der Graph wird verschoben, danach liegt der
        Scheitel bei S(1 | −3). Wie weit ging es wohin?<br>
        waagerecht: 1 − 3 = −2 → <strong>2 nach links</strong><br>
        senkrecht: −3 − 2 = −5 → <strong>5 nach unten</strong><br>
        <em>Merke:</em> Eine Verschiebung ist <strong>Ziel minus Start</strong>. Der Startscheitel
        muss deshalb zuerst abgelesen werden – mit dem umgedrehten Vorzeichen in der Klammer.<br>
        <em>Gegenprobe:</em> Wer die Klammer als −3 liest, rechnet 1 − (−3) = 4 und behauptet
        „4 nach rechts“ – falsche Weite und falsche Richtung.</p>
      </div>

      <h3>Was der Faktor a macht</h3>
      <p>a ist der einzige Teil, der die <em>Form</em> ändert. Verschiebungen bewegen die Parabel nur,
      sie machen sie nie enger oder weiter. Umgekehrt lässt sich a berechnen, wenn der Scheitel
      und ein weiterer Punkt bekannt sind: Punkt einsetzen und nach a auflösen.</p>

      <div class="example-box"><span class="ex-title">Drei Parabeln im Vergleich</span>
        <p>f(x) = x² → die Normalparabel<br>
        g(x) = 3x² → dreimal so hohe Werte, also <strong>enger</strong><br>
        h(x) = −0,5x² → halb so hohe Werte und nach unten gespiegelt, also <strong>weiter</strong><br>
        Bei x = 2: f(2) = 4&ensp;<span class="trenn">•</span>&ensp;g(2) = 12&ensp;<span class="trenn">•</span>&ensp;h(2) = −2</p>
      </div>

      <div class="example-box"><span class="ex-title">a aus Scheitel und Punkt</span>
        <p>Eine Parabel hat den Scheitel S(2 | 7) und geht durch P(6 | −1). Wie groß ist a?<br>
        Der Scheitel wandert in die Scheitelform, a bleibt offen: f(x) = a · (x − 2)² + 7<br>
        Jetzt P einsetzen, also x = 6 und f(x) = −1:<br>
        −1 = a · (6 − 2)² + 7<br>
        −1 = 16a + 7&nbsp;| − 7<br>
        −8 = 16a&nbsp;| : 16<br>
        a = <strong>−0,5</strong> → f(x) = −0,5(x − 2)² + 7<br>
        <em>Probe:</em> f(6) = −0,5 · 16 + 7 = −8 + 7 = −1 ✓<br>
        <em>Merke:</em> Die Klammer wird quadriert. Ob der Punkt links oder rechts vom Scheitel
        liegt, spielt deshalb keine Rolle – Q(−2 | −1) führt auf dasselbe a.</p>
      </div>

      <h3>Nullstellen aus der Scheitelform</h3>
      <p>Nullstellen sind die Stellen, an denen der Graph die x-Achse schneidet – dort ist
      f(x) = 0. In der Scheitelform braucht man die Klammer dafür nicht auszumultiplizieren:
      Man stellt sie frei und zieht die Wurzel. Ob es überhaupt Nullstellen gibt, verrät schon
      der Scheitel: Öffnet die Parabel nach oben und liegt ihr Scheitel unter der x-Achse, muss
      sie die Achse zweimal schneiden.</p>

      <div class="example-box"><span class="ex-title">Nullstellen aus der Scheitelform</span>
        <p>f(x) = 2(x + 2)² − 18<br>
        Scheitel S(−2 | −18), nach oben geöffnet – der tiefste Punkt liegt unter der x-Achse,
        es gibt also zwei Nullstellen. Nullstellen heißt f(x) = 0:<br>
        2(x + 2)² − 18 = 0&nbsp;| + 18<br>
        2(x + 2)² = 18&nbsp;| : 2<br>
        (x + 2)² = 9&nbsp;| √<br>
        Die Wurzel liefert <strong>zwei</strong> Werte, denn 3² = 9 und (−3)² = 9:<br>
        x + 2 = 3 → x₁ = <strong>1</strong>&ensp;<span class="trenn">•</span>&ensp;x + 2 = −3 → x₂ = <strong>−5</strong><br>
        <em>Probe:</em> f(1) = 2 · 3² − 18 = 0 ✓&ensp;<span class="trenn">•</span>&ensp;f(−5) = 2 · (−3)² − 18 = 0 ✓<br>
        <em>Merke:</em> Beide Nullstellen liegen 3 vom Scheitel x = −2 entfernt. Die Parabel ist
        symmetrisch zur senkrechten Geraden durch den Scheitel – er liegt immer genau in der
        Mitte zwischen den Nullstellen.<br>
        <em>Gegenprobe:</em> Bei g(x) = 2(x + 1)² + 5 steht nach dem Umstellen (x + 1)² = −2,5. Ein
        Quadrat ist nie negativ – g hat keine Nullstelle.</p>
      </div>

      <h3>Von der Normalform zur Scheitelform</h3>
      <p>Steht die Funktion als f(x) = x² + px + q da, ist der Scheitel nicht ablesbar. Die
      <strong>quadratische Ergänzung</strong> baut die fehlende binomische Formel künstlich auf:
      Man addiert (p/2)² und zieht es sofort wieder ab – der Wert der Funktion ändert sich dadurch nicht.</p>

      <div class="example-box"><span class="ex-title">Quadratische Ergänzung</span>
        <p>f(x) = x² + 6x + 5<br>
        Die halbe Zahl vor x ist 3, quadriert 9. Also 9 addieren und gleich abziehen:<br>
        f(x) = (x² + 6x <strong>+ 9</strong>) <strong>− 9</strong> + 5<br>
        Die Klammer ist jetzt (x + 3)², dahinter bleibt −4:<br>
        f(x) = (x + 3)² − 4 → Scheitel <strong>S(−3 | −4)</strong><br>
        <em>Probe:</em> f(−3) = 9 − 18 + 5 = −4 ✓</p>
      </div>

      <h3>Wenn vor x² eine Zahl steht</h3>
      <p>Bei f(x) = 2x² − 12x + 10 greift das Rezept von eben nicht sofort: Die halbe Zahl vor x
      passt nur, wenn vor x² eine 1 steht. Zwei Wege führen trotzdem zum Scheitel – der lange
      klammert a aus, der kurze nutzt die Symmetrie der Parabel.</p>

      <div class="merkkasten"><span class="merk-title">Merke: Scheitelstelle aus <span class="mathe">ax² + bx + c</span></span>
        <p><span class="formula">x = −b ⁄ (2a)</span></p>
        <p>Der y-Wert des Scheitels ist der Funktionswert an dieser Stelle. Bei a &gt; 0 ist der
        Scheitel der <strong>Tiefpunkt</strong>, bei a &lt; 0 der <strong>Hochpunkt</strong>.</p>
        <p><em>Warum das stimmt:</em> Der Summand c schiebt die Parabel nur nach oben oder unten.
        Ohne ihn bleibt ax² + bx = x · (ax + b) mit den Nullstellen 0 und −b ⁄ a. Die Parabel ist
        symmetrisch, der Scheitel liegt also genau in der Mitte: bei −b ⁄ (2a).</p>
      </div>

      <div class="example-box"><span class="ex-title">Scheitel ohne Ergänzung</span>
        <p>f(x) = 2x² − 12x + 10 → a = 2, b = −12, c = 10<br>
        Scheitelstelle: x = −(−12) ⁄ (2 · 2) = 12 ⁄ 4 = <strong>3</strong><br>
        y-Wert: f(3) = 2 · 9 − 36 + 10 = <strong>−8</strong><br>
        Scheitel <strong>S(3 | −8)</strong>, wegen a = 2 &gt; 0 ein Tiefpunkt.<br>
        <em>Probe über den langen Weg:</em> 2 ausklammern, dann in der Klammer ergänzen:<br>
        f(x) = 2 · (x² − 6x) + 10 = 2 · ((x − 3)² − 9) + 10 = 2 · (x − 3)² − 18 + 10 = 2 · (x − 3)² − 8 ✓<br>
        <em>Und der Ball vom Anfang?</em> h(t) = −2(t − 3)² + 18 ausmultipliziert ist −2t² + 12t.
        Nullstellen bei t = 0 (Abwurf) und t = 6 (Landung), die Mitte ist 3 – und
        −12 ⁄ (2 · (−2)) = 3 ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Bei f(x) = (x − 3)² liegt der Scheitel bei x = −3, weil da ein Minus steht.“ – Genau
        umgekehrt.<br>
        <em>Gegenbeispiel, an zwei Zahlen nachgerechnet:</em><br>
        f(3) = (3 − 3)² = 0² = <strong>0</strong><br>
        f(−3) = (−3 − 3)² = (−6)² = <strong>36</strong><br>
        Der tiefste Punkt einer nach oben geöffneten Parabel ist der kleinste Wert – und 0 ist kleiner
        als 36. Der Scheitel liegt also bei <strong>x = 3</strong>.<br>
        Merkhilfe: Setze die Zahl ein, die die Klammer zu null macht. Genau dort liegt der Scheitel.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wo liegt der Scheitel von f(x) = −2(x + 5)² + 7?</summary>
          <p>S(−5 | 7). Die Klammer wird bei x = −5 null, e = 7 wird unverändert übernommen.
          Wegen a = −2 ist es ein Hochpunkt.</p></details>
        <details><summary>Warum ändert der Summand e nichts an der Breite der Parabel?</summary>
          <p>Weil er zu jedem Funktionswert dieselbe Zahl addiert – die ganze Parabel wandert nach
          oben oder unten, ihre Form bleibt. Nur a verändert die Werte <em>unterschiedlich</em> stark,
          je nachdem, wie weit man vom Scheitel entfernt ist.</p></details>
        <details><summary>Wo schneidet f(x) = −(x − 1)² + 16 die x-Achse?</summary>
          <p>Bei x₁ = −3 und x₂ = 5. Umstellen: (x − 1)² = 16, also x − 1 = 4 oder x − 1 = −4.
          Beide liegen 4 vom Scheitel x = 1 entfernt.</p></details>
        <details><summary>Wie viele Nullstellen hat f(x) = (x − 4)² + 3?</summary>
          <p>Keine. Die Klammer ist als Quadrat nie negativ, also ist f(x) mindestens 3 – der
          Graph bleibt vollständig oberhalb der x-Achse.</p></details>
        <details><summary>Wo liegt der Scheitel von f(x) = 3x² + 12x + 9?</summary>
          <p>x = −12 ⁄ (2 · 3) = −2 und f(−2) = 3 · (−2)² + 12 · (−2) + 9 = 12 − 24 + 9 = −3,
          also S(−2 | −3). Kontrolle: 3 · (x + 2)² − 3 = 3x² + 12x + 12 − 3 = 3x² + 12x + 9 ✓</p></details>
      </div>
    `,

    quadratisch: `
      <h2>Quadratische Gleichungen lösen</h2>
      <p>Sobald x² auftritt, reicht Umstellen nicht mehr – es braucht ein eigenes Verfahren.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein rechteckiges Beet ist 2 m länger als breit und hat eine Fläche von 8 m².
        Mit der Breite x gilt: x · (x + 2) = 8, also x² + 2x − 8 = 0.
        Durch Umstellen kommt man hier nicht weiter, weil x zweimal vorkommt.</p>
        <span class="frage">Wie löst man eine Gleichung, in der x auch quadriert auftaucht?</span>
      </div>

      <h3>Die Idee: Erst die einfachen Fälle erkennen</h3>
      <p>Nicht jede quadratische Gleichung braucht die große Formel. Steht kein x-Term da,
      zieht man einfach die Wurzel; fehlt das absolute Glied, klammert man x aus.
      Nur der allgemeine Fall verlangt die pq-Formel.</p>

      <div class="herleitung-box"><span class="box-title">Warum gibt es meist zwei Lösungen?</span>
        <p>Weil das Quadrieren zwei Zahlen auf dasselbe Ergebnis schickt: 3² = 9 und (−3)² = 9.
        Zieht man die Wurzel, muss man deshalb <strong>beide Vorzeichen</strong> zulassen.<br>
        Geometrisch: Der Graph ist eine Parabel. Sie kann die x-Achse zweimal schneiden
        (zwei Lösungen), sie berühren (eine) oder verfehlen (keine).</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Die <span class="mathe">pq</span>-Formel</span>
        <p>Für die Normalform x² + px + q = 0 (vor x² steht eine 1):</p>
        <p><span class="formula">x₁,₂ = −p⁄2 ± √((p⁄2)² − q)</span></p>
        <p>Die <strong>Diskriminante</strong> D = (p/2)² − q entscheidet:
        D &gt; 0 → zwei Lösungen&ensp;<span class="trenn">•</span>&ensp;D = 0 → eine&ensp;<span class="trenn">•</span>&ensp;D &lt; 0 → keine</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Gleichung auf die Form <strong>… = 0</strong> bringen.</li>
        <li>Prüfe die Sonderfälle: nur x² und Zahl → Wurzel ziehen; kein absolutes Glied → x ausklammern.</li>
        <li>Sonst auf <strong>Normalform</strong> bringen (notfalls durch den Faktor vor x² teilen).</li>
        <li>p und q <strong>mit Vorzeichen</strong> ablesen und in die pq-Formel einsetzen.</li>
        <li><strong>Probe</strong> mit beiden Lösungen – oder Kontrolle über den Satz von Vieta.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Sonderfälle ohne große Formel</span>
        <p><strong>x² = 49</strong> → x = ±√49 → x₁ = 7, x₂ = −7 (beide Vorzeichen!)<br>
        <strong>x² − 6x = 0</strong> → x · (x − 6) = 0 → x₁ = 0, x₂ = 6<br>
        <em>Begründung:</em> Ein Produkt ist genau dann null, wenn ein Faktor null ist.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Beet-Frage mit der pq-Formel</span>
        <p>x² + 2x − 8 = 0 → p = 2, q = −8<br>
        −p/2 = −1&ensp;<span class="trenn">•</span>&ensp;D = (−1)² − (−8) = 1 + 8 = 9<br>
        x₁,₂ = −1 ± 3 → x₁ = <strong>2</strong>, x₂ = −4<br>
        Eine Breite kann nicht negativ sein → das Beet ist <strong>2 m breit und 4 m lang</strong> ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Vorzeichen sauber ablesen</span>
        <p>x² − 2x − 8 = 0 → p = <strong>−2</strong> (nicht 2!), q = −8<br>
        −p/2 = 1, D = 1 + 8 = 9 → x₁,₂ = 1 ± 3 → x₁ = 4, x₂ = −2<br>
        <em>Vieta-Kontrolle:</em> x₁ + x₂ = 2 = −p ✓ und x₁ · x₂ = −8 = q ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„x² = 49 hat die Lösung x = 7.“ – Das ist nur die halbe Antwort, −7 gehört dazu.<br>
        Zweiter Klassiker: Die pq-Formel auf 2x² + 6x − 8 = 0 anwenden, ohne vorher durch 2 zu teilen.
        Die Formel gilt <strong>nur für die Normalform</strong> mit dem Vorfaktor 1.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie viele Lösungen hat x² + 4x + 4 = 0?</summary>
          <p>D = 2² − 4 = 0 → genau <strong>eine</strong> Lösung: x = −2.
          Die Parabel berührt die x-Achse.</p></details>
        <details><summary>Löse 3x² − 12 = 0.</summary>
          <p>3x² = 12 → x² = 4 → x = <strong>±2</strong></p></details>
        <details><summary>Warum hat x² + 1 = 0 keine Lösung?</summary>
          <p>x² ist nie negativ, also ist x² + 1 immer mindestens 1.
          Rechnerisch: D = 0 − 1 = −1 &lt; 0 – die Wurzel aus einer negativen Zahl existiert nicht.</p></details>
      </div>
    `

  };
})();
