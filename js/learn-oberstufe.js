/* ============================================================
   MatheNils – Erklärseiten: Oberstufe
   Exponentielles Wachstum · Logarithmen · Ableitungen · Integrale
   ============================================================ */
'use strict';

const LEARN_OBER = (() => {
  const { frac } = Util;
  return {

    /* ---------- Exponentielles Wachstum ---------- */
    wachstum: `
      <h2>Exponentielles Wachstum und Zerfall</h2>
      <p>Exponentielles Wachstum ist die vielleicht am meisten unterschätzte Entwicklung –
      es beginnt unauffällig und wird dann überwältigend.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Seerosen verdoppeln ihre Fläche täglich. Nach 30 Tagen ist der Teich vollständig bedeckt.
        Die meisten schätzen: Halb bedeckt war er etwa nach 15 Tagen.</p>
        <span class="frage">An welchem Tag war der Teich wirklich zur Hälfte bedeckt?</span>
      </div>

      <h3>Die Idee: konstanter Faktor statt konstanter Betrag</h3>
      <p>Bei <strong>linearem</strong> Wachstum kommt in jedem Schritt derselbe <em>Betrag</em> dazu.
      Bei <strong>exponentiellem</strong> Wachstum wird mit demselben <em>Faktor</em> multipliziert.
      Genau darin liegt der Unterschied – und die Wucht.</p>

      <div class="table-wrap"><table>
        <tr><th>Schritt</th><th>linear: +50</th><th>exponentiell: · 2</th></tr>
        <tr><td>Start</td><td>100</td><td>100</td></tr>
        <tr><td>1</td><td>150</td><td>200</td></tr>
        <tr><td>2</td><td>200</td><td>400</td></tr>
        <tr><td>5</td><td>350</td><td>3200</td></tr>
        <tr><td>10</td><td>600</td><td>102 400</td></tr>
      </table></div>

      <div class="herleitung-box"><span class="box-title">Warum entsteht eine Potenz?</span>
        <p>Nach einem Schritt: B₀ · q. Nach zwei Schritten: (B₀ · q) · q = B₀ · q².
        Jeder weitere Schritt hängt ein weiteres q an – nach n Schritten steht dort
        <strong>B₀ · qⁿ</strong>.<br>
        Deshalb steht die Variable im <em>Exponenten</em>, und deshalb wächst die Funktion
        schneller als jede Gerade oder Parabel.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">B(n) = B₀ · qⁿ</span></p>
        <ul>
          <li>+ p % pro Schritt → q = 1 + p/100&nbsp;(+5 % → q = 1,05)</li>
          <li>− p % pro Schritt → q = 1 − p/100&nbsp;(−20 % → q = 0,8)</li>
          <li>q &gt; 1 → Wachstum&ensp;<span class="trenn">•</span>&ensp;0 &lt; q &lt; 1 → Zerfall</li>
          <li>Umgekehrt: |q − 1| = p/100 – der Abstand von q zur 1 ist der Prozentsatz&nbsp;(q = 1,07 → +7 %, q = 0,6 → −40 %)</li>
        </ul>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Startwert B₀</strong> und die Schrittweite (pro Stunde, Jahr …) bestimmen.</li>
        <li><strong>Wachstumsfaktor q</strong> aus der Prozentangabe berechnen.</li>
        <li>Anzahl der Schritte n einsetzen: B(n) = B₀ · qⁿ.
        Ist dagegen <strong>n gesucht</strong>: B(n) durch B₀ teilen und abzählen, wie oft mit q multipliziert wurde.</li>
        <li><strong>Plausibilität prüfen:</strong> Bei q &gt; 1 muss das Ergebnis größer, bei q &lt; 1 kleiner sein.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Wachstum</span>
        <p>200 Bakterien verdoppeln sich stündlich (q = 2). Nach 4 Stunden:<br>
        B(4) = 200 · 2⁴ = 200 · 16 = <strong>3200</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Zerfall</span>
        <p>Ein Medikament baut sich um 20 % pro Stunde ab (q = 0,8), Start 500 mg:<br>
        B(3) = 500 · 0,8³ = 500 · 0,512 = <strong>256 mg</strong><br>
        <em>Beachte:</em> Es wird nie exakt null – der Zerfall verlangsamt sich immer weiter.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Seerosen-Frage vom Anfang</span>
        <p>Rückwärts gedacht: Am Tag 30 ist der Teich voll. Da sich die Fläche täglich verdoppelt,
        war sie am Tag davor genau halb so groß.<br>
        → Halb bedeckt war der Teich am <strong>Tag 29</strong>, nicht am Tag 15.<br>
        Das ist der typische Schock des exponentiellen Wachstums: 29 Tage sieht es harmlos aus.</p>
      </div>
      <div class="example-box"><span class="ex-title">Wie viele Schritte?</span>
        <p>Eine Kultur aus 25 Zellen verdoppelt sich stündlich. Nach wie vielen Stunden sind es 800?<br>
        Gesucht ist n mit 25 · 2ⁿ = 800. Zuerst durch den Startwert teilen: 2ⁿ = 800 : 25 = 32.<br>
        Dann die Potenzen von 2 durchzählen: 2, 4, 8, 16, 32 – fünf Schritte, also <strong>n = 5</strong>.<br>
        Probe: 25 · 2⁵ = 25 · 32 = 800 ✓<br>
        Geht die Division nicht auf eine glatte Potenz, holt der Logarithmus das n aus dem Exponenten.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„+5 % bedeutet q = 5“ oder „q = 0,05“. – Richtig ist <strong>q = 1,05</strong>:
        Der Bestand behält 100 % und bekommt 5 % dazu.<br>
        Und über 3 Jahre wächst er um 1,05³ ≈ 1,158, also um <strong>15,8 %</strong> – nicht um 15 %.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie lautet q bei einer Abnahme um 25 %?</summary>
          <p>q = 1 − 0,25 = <strong>0,75</strong> – es bleiben 75 % übrig.</p></details>
        <details><summary>Der Wachstumsfaktor ist q = 0,94. Um wie viel Prozent ändert sich der Bestand pro Schritt?</summary>
          <p>Er nimmt um <strong>6 %</strong> ab: 1 − 0,94 = 0,06. Von 100 % bleiben 94 % übrig –
          die 94 % sind der Rest, nicht die Änderung.</p></details>
        <details><summary>Von 80 g zerfällt stündlich die Hälfte. Wie viel ist nach 4 h übrig?</summary>
          <p>80 · 0,5⁴ = 80 : 16 = <strong>5 g</strong></p></details>
        <details><summary>Woran erkennst du in einer Wertetabelle exponentielles Wachstum?</summary>
          <p>Der <strong>Quotient</strong> aufeinanderfolgender Werte ist konstant
          (bei linearem Wachstum wäre es die Differenz).</p></details>
        <details><summary>6 Personen kennen ein Gerücht, stündlich verdoppelt sich die Zahl. Nach wie vielen Stunden sind es 96?</summary>
          <p>96 : 6 = 16 = 2⁴, also nach <strong>4 Stunden</strong>.</p></details>
      </div>
    `,

    /* ---------- Logarithmen ---------- */
    logarithmen: `
      <h2>Logarithmen – die Umkehrung des Potenzierens</h2>
      <p>Der Logarithmus beantwortet die Frage nach dem <strong>Exponenten</strong> –
      und macht damit Exponentialgleichungen lösbar.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>1000 € werden mit 5 % verzinst: K(n) = 1000 · 1,05ⁿ.
        Die Frage „Wie viel nach 10 Jahren?“ ist leicht. Aber:
        „Nach wie vielen Jahren hat sich das Geld verdoppelt?“ führt auf 1,05ⁿ = 2 –
        und das gesuchte n steht im Exponenten.</p>
        <span class="frage">Wie holt man eine Unbekannte aus dem Exponenten herunter?</span>
      </div>

      <h3>Die Idee: die Umkehrfrage stellen</h3>
      <p>Potenzieren fragt: „Was ist 2³?“ → 8. Der Logarithmus dreht die Frage um:
      <strong>„2 hoch was ergibt 8?“</strong> → 3. Beide Operationen heben einander auf,
      genau wie Quadrieren und Wurzelziehen.</p>

      <div class="herleitung-box"><span class="box-title">Warum wird aus log(aⁿ) plötzlich n · log(a)?</span>
        <p>a³ ist nur eine Kurzschreibweise für a · a · a. Nach dem ersten Logarithmusgesetz
        wird aus dem Produkt eine Summe:<br>
        log(a · a · a) = log(a) + log(a) + log(a) = 3 · log(a).<br>
        Genau deshalb „rutscht“ der Exponent nach vorn – und genau deshalb löst der Logarithmus
        Exponentialgleichungen.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">log<sub>b</sub>(x) = n&nbsp;⇔&nbsp;bⁿ = x</span></p>
        <p>Wichtige Werte: log<sub>b</sub>(1) = 0&ensp;<span class="trenn">•</span>&ensp;log<sub>b</sub>(b) = 1&ensp;<span class="trenn">•</span>&ensp;
        log₁₀(1000) = 3&ensp;<span class="trenn">•</span>&ensp;log₂(⅛) = −3</p>
        <p><strong>Schreibweisen:</strong> lg(x) = log₁₀(x) ist der <strong>Zehnerlogarithmus</strong> –
        das ist die „log“-Taste des Taschenrechners. ln(x) = log<sub>e</sub>(x) ist der natürliche
        Logarithmus zur Basis e ≈ 2,718 – mehr dazu beim Thema e-Funktion. Steht log ohne Basis,
        gilt die Regel für jede Basis. Jede andere Basis rechnet der Taschenrechner über den
        Basiswechsel: log<sub>b</sub>(x) = lg(x) / lg(b).</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Gesetz</th><th>Kontrolle</th></tr>
        <tr><td>log(a · b) = log(a) + log(b)</td><td>log₂(8 · 4) = 3 + 2 = 5 ✓ (2⁵ = 32)</td></tr>
        <tr><td>log(a : b) = log(a) − log(b)</td><td>log₂(32 : 4) = 5 − 2 = 3 ✓ (2³ = 8)</td></tr>
        <tr><td>log(aⁿ) = n · log(a)</td><td>log₂(4³) = 3 · 2 = 6 ✓ (2⁶ = 64)</td></tr>
      </table></div>

      <h3>So gehst du vor: Exponentialgleichung lösen</h3>
      <ol class="schritte">
        <li>Gleichung so umstellen, dass die <strong>Potenz allein</strong> steht (z. B. 1,05ⁿ = 2).</li>
        <li>Auf beiden Seiten den <strong>Logarithmus</strong> anwenden.</li>
        <li>Mit log(aⁿ) = n · log(a) den Exponenten nach vorn holen.</li>
        <li>Nach n auflösen: n = lg(2) / lg(1,05) – so rechnet es der Taschenrechner.</li>
        <li>Mit dem Taschenrechner ausrechnen und im Sachzusammenhang <strong>runden</strong>.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Logarithmen im Kopf</span>
        <p>log₃(81) = 4, denn 3⁴ = 81&ensp;<span class="trenn">•</span>&ensp;log₁₀(0,01) = −2, denn 10⁻² = 0,01<br>
        Frage dir immer: „Basis hoch was ergibt das Argument?“</p>
      </div>
      <div class="example-box"><span class="ex-title">Glatte Lösung</span>
        <p>2ˣ = 64 → x = log₂(64) = <strong>6</strong>, denn 2⁶ = 64</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Verdopplungs-Frage vom Anfang</span>
        <p>1,05ⁿ = 2&nbsp;| lg anwenden<br>
        n · lg(1,05) = lg(2)<br>
        n = lg(2) / lg(1,05) ≈ 0,301 / 0,0212 ≈ <strong>14,2 Jahre</strong><br>
        <em>Praktisch:</em> Nach 15 Jahren hat sich das Kapital verdoppelt.
        Der Taschenrechner braucht dafür nur die „log“-Taste. Diesen Schritt nennt man
        <strong>Basiswechsel</strong>: log<sub>1,05</sub>(2) = lg(2) / lg(1,05) – so ist jede Basis berechenbar.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„log(a + b) = log(a) + log(b)“ – Das Gesetz gilt nur fürs <strong>Produkt</strong>!
        Probe: lg(10 + 90) = lg(100) = 2, aber lg(10) + lg(90) ≈ 1 + 1,95 = 2,95 ✗<br>
        Und: log von 0 oder von negativen Zahlen ist nicht definiert – keine Potenz ergibt je null.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie groß ist log₅(125)?</summary>
          <p><strong>3</strong>, denn 5³ = 125.</p></details>
        <details><summary>Löse 3ˣ = 20 mit dem Taschenrechner.</summary>
          <p>Basiswechsel: x = log₃(20) = lg(20)/lg(3) ≈ 1,301/0,477 ≈ <strong>2,73</strong></p></details>
        <details><summary>Wo begegnen dir Logarithmen im Alltag?</summary>
          <p>pH-Wert, Dezibel und Erdbeben-Magnituden – überall dort, wo riesige Zahlbereiche
          auf eine handliche Skala gebracht werden. Ein Erdbeben der Stärke 7 ist zehnmal
          stärker als eines der Stärke 6.</p></details>
      </div>
    `,

    /* ---------- e-Funktion und ln ---------- */
    efunktion: `
      <h2>Die e-Funktion und der natürliche Logarithmus</h2>
      <p>Unter allen Exponentialfunktionen gibt es genau eine, die sich beim Ableiten überhaupt
      nicht verändert. Ihre Basis heißt <strong>e ≈ 2,718</strong> – die Eulersche Zahl.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Bei f(x) = 2<sup>x</sup> ist die Steigung im Punkt (0 | 1) etwa 0,69 – flacher als der Funktionswert.
        Bei f(x) = 3<sup>x</sup> ist sie etwa 1,10 – steiler. Irgendwo dazwischen muss eine Basis liegen,
        bei der die Steigung dort <em>genau 1</em> ist.</p>
        <span class="frage">Welche Basis ist das, und warum ist gerade sie so nützlich?</span>
      </div>

      <div class="herleitung-box"><span class="box-title">Warum ausgerechnet 2,718…?</span>
        <p>Die Zahl ist nicht willkürlich, sondern durch genau diese Bedingung festgelegt: e ist die
        Basis, bei der die Tangente im Punkt (0 | 1) die Steigung 1 hat. Der Zwischenwertsatz garantiert,
        dass es sie zwischen 2 und 3 gibt – ausgerechnet liegt sie bei 2,71828…</p>
        <p><strong>Und daraus folgt alles Weitere.</strong> Ist die Steigung bei (0 | 1) gleich 1, dann
        ist sie an jeder Stelle genauso groß wie der Funktionswert selbst: Verschiebt man den Graphen
        von e<sup>x</sup> um a nach rechts, wird er zugleich um den Faktor e<sup>a</sup> gestreckt –
        Höhe und Steigung wachsen im Gleichschritt.</p>
        <p>Deshalb gilt <strong>(e<sup>x</sup>)′ = e<sup>x</sup></strong>. Keine andere Funktion außer
        der Null hat diese Eigenschaft.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Ableiten und Umkehren</span>
        <p><span class="formula">(e<sup>x</sup>)′ = e<sup>x</sup></span></p>
        <p><span class="formula">(e<sup>kx</sup>)′ = k · e<sup>kx</sup></span> &ensp;– der Faktor k kommt aus der Kettenregel</p>
        <p>Steht x auch <em>vor</em> dem e, ist das kein Vorfaktor, sondern ein Produkt:
        (x · e<sup>x</sup>)′ = e<sup>x</sup> + x · e<sup>x</sup> = e<sup>x</sup> · (1 + x) – Produktregel.</p>
        <p>Der <strong>natürliche Logarithmus</strong> ln ist die Umkehrfunktion:</p>
        <p><span class="formula">ln(e<sup>x</sup>) = x</span>&ensp;<span class="trenn">•</span>&ensp;
        <span class="formula">e<sup>ln(a)</sup> = a</span>&nbsp;(für a &gt; 0)</p>
        <p>Wichtige Werte: ln(1) = 0, denn e<sup>0</sup> = 1&ensp;<span class="trenn">•</span>&ensp;
        ln(e) = 1, denn e<sup>1</sup> = e</p>
      </div>

      <ol class="schritte">
        <li><strong>Vorfaktor stehen lassen</strong> – er wird beim Ableiten nur mitgenommen. Vorfaktor heißt:
        eine Zahl ohne x. Steht x selbst vor dem e, ist das ein Produkt zweier Funktionen – dann Produktregel
        (Beispiel „Wenn x auch vor dem e steht“, ausführlich im Thema „Ableitungsregeln“).</li>
        <li><strong>e-Teil abschreiben</strong> – er bleibt unverändert.</li>
        <li><strong>Exponent ableiten</strong> und als Faktor davorstellen (Kettenregel).</li>
        <li><strong>Bei Gleichungen:</strong> auf beiden Seiten ln anwenden – das holt x aus dem Exponenten.</li>
        <li><strong>Probe:</strong> e<sup>0</sup> = 1 einsetzen, das geht im Kopf.</li>
      </ol>

      <div class="example-box"><span class="ex-title">Ableiten mit Vorfaktor</span>
        <p>f(x) = 3e<sup>2x</sup><br>
        Vorfaktor 3 bleibt, e<sup>2x</sup> bleibt, der Exponent 2x hat die Ableitung 2:<br>
        f′(x) = 3 · 2 · e<sup>2x</sup> = <strong>6e<sup>2x</sup></strong><br>
        <em>Probe bei x = 0:</em> f′(0) = 6 · e<sup>0</sup> = 6 · 1 = 6</p>
      </div>

      <div class="example-box"><span class="ex-title">Wenn x auch vor dem e steht</span>
        <p>f(x) = 6x · e<sup>x</sup><br>
        Die 6x ist kein Vorfaktor – ein Vorfaktor ist eine Zahl ohne x. Hier stehen zwei
        Funktionen im Produkt, also Produktregel: u = 6x mit u′ = 6, v = e<sup>x</sup> mit v′ = e<sup>x</sup>.<br>
        f′(x) = u′ · v + u · v′ = 6 · e<sup>x</sup> + 6x · e<sup>x</sup> = <strong>6e<sup>x</sup> · (1 + x)</strong><br>
        <em>Probe bei x = 0:</em> e<sup>0</sup> = 1 und die Klammer ist 1 + 0 = 1, also f′(0) = 6 · 1 · 1 = <strong>6</strong><br>
        <em>Wer 6x wie einen Vorfaktor behandelt,</em> schreibt f′(x) = 6x · e<sup>x</sup> und bekommt f′(0) = 0 –
        eine waagerechte Tangente im Ursprung. Zum Nachprüfen: f(0,1) = 0,6 · e<sup>0,1</sup> ≈ 0,6 · 1,105 = 0,663 –
        von 0 auf 0,663 in 0,1 Schritten ist eine Steigung von rund 6,6, nicht 0.</p>
      </div>

      <h3>Der natürliche Logarithmus</h3>
      <p>ln beantwortet die Frage „Mit welchem Exponenten muss ich e potenzieren?“. Weil e und ln
      Umkehrfunktionen sind, heben sie sich gegenseitig auf – wie Quadrieren und Wurzelziehen.
      Zwei Antworten hast du schon im Kopf: e<sup>0</sup> = 1, also ln(1) = 0 – und
      e<sup>1</sup> = e, also ln(e) = 1.</p>

      <div class="example-box"><span class="ex-title">Exponentialgleichung lösen</span>
        <p>3e<sup>0,5x</sup> = 12&nbsp;| : 3<br>
        e<sup>0,5x</sup> = 4&nbsp;| ln<br>
        0,5x = ln(4) ≈ 1,386&nbsp;| : 0,5<br>
        x ≈ <strong>2,77</strong><br>
        <em>Der ln muss auf die ganze Seite angewendet werden</em> – erst durch 3 teilen, dann
        logarithmieren. Andersherum ginge es schief.</p>
      </div>

      <h3>Wachstum und Zerfall mit e</h3>
      <p>Jeder exponentielle Vorgang lässt sich mit e schreiben: N(t) = N<sub>0</sub> · e<sup>λt</sup>.
      Ein positives λ bedeutet Wachstum, ein negatives Zerfall. Der Vorteil gegenüber N<sub>0</sub> · a<sup>t</sup>:
      Die Ableitung ist sofort da, und λ ist direkt die momentane Wachstumsrate.</p>

      <div class="example-box"><span class="ex-title">Halbwertszeit</span>
        <p>N(t) = N<sub>0</sub> · e<sup>−0,2t</sup>. Wann ist die Hälfte übrig?<br>
        0,5 · N<sub>0</sub> = N<sub>0</sub> · e<sup>−0,2t</sup>&nbsp;| : N<sub>0</sub><br>
        0,5 = e<sup>−0,2t</sup>&nbsp;| ln<br>
        ln(0,5) = −0,2t, und ln(0,5) = −ln(2)<br>
        t = ln(2) ⁄ 0,2 ≈ <strong>3,47</strong><br>
        <em>N<sub>0</sub> kürzt sich heraus</em> – die Halbwertszeit hängt nicht davon ab, wie viel
        man am Anfang hatte.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„e<sup>2x</sup> abgeleitet ist wieder e<sup>2x</sup> – die e-Funktion ändert sich ja nicht.“ –
        Nur bei e<sup>x</sup>. Sobald im Exponenten mehr als ein einfaches x steht, kommt die
        Kettenregel dazu.<br>
        <em>Gegenbeispiel, an einer Stelle nachgerechnet:</em> Wäre (e<sup>2x</sup>)′ = e<sup>2x</sup>,
        dann hätte der Graph bei x = 0 die Steigung e<sup>0</sup> = <strong>1</strong>.<br>
        Tatsächlich ist e<sup>2x</sup> doppelt so schnell unterwegs wie e<sup>x</sup>: Richtig ist
        (e<sup>2x</sup>)′ = 2e<sup>2x</sup>, bei x = 0 also die Steigung <strong>2</strong>.<br>
        Zum Nachprüfen: e<sup>0,2</sup> ≈ 1,221 – von 1 auf 1,221 in 0,1 Schritten ist eine Steigung
        von rund 2,2, nicht 1.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was ist ln(e<sup>7</sup>)? Und ln(1)?</summary>
          <p>7 und 0. ln fragt nach dem Exponenten von e – bei e<sup>7</sup> steht er schon da,
          bei 1 muss man ihn kurz suchen: e<sup>0</sup> = 1, also ist ln(1) = 0. Umgekehrt gilt genauso
          e<sup>ln(7)</sup> = 7.</p></details>
        <details><summary>Wie leitet man f(x) = 5e<sup>−3x</sup> ab?</summary>
          <p>f′(x) = 5 · (−3) · e<sup>−3x</sup> = −15e<sup>−3x</sup>. Der Vorfaktor bleibt, der
          e-Teil bleibt, und die Ableitung des Exponenten (−3) kommt davor.</p></details>
        <details><summary>Warum ist e<sup>x</sup> nie null oder negativ?</summary>
          <p>Weil eine positive Basis, mit welchem Exponenten auch immer potenziert, positiv bleibt.
          Der Graph nähert sich für sehr kleine x der x-Achse an, erreicht sie aber nie – deshalb
          hat f(x) = e<sup>x</sup> keine Nullstelle.</p></details>
      </div>
    `,

    /* ---------- Ableitungen ---------- */
    ableitungen: `
      <h2>Ableitungen – die Steigung an jeder Stelle</h2>
      <p>Die Ableitung misst Veränderung: wie schnell etwas wächst, fällt oder umkippt.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Bei einer Geraden ist die Steigung überall gleich – ein Steigungsdreieck genügt.
        Eine Parabel dagegen ist links steil fallend, unten flach und rechts steil steigend.</p>
        <span class="frage">Wie gibt man die Steigung einer <em>Kurve</em> an, die sich ständig ändert?</span>
      </div>

      <h3>Die Idee: Immer weiter hineinzoomen</h3>
      <p>Zoome an einem Punkt einer Kurve immer näher heran. Irgendwann sieht der Ausschnitt
      aus wie eine <strong>Gerade</strong> – die <strong>Tangente</strong>.
      Ihre Steigung ist die Steigung der Kurve an genau dieser Stelle: f′(x).</p>

      <div class="herleitung-box"><span class="box-title">Woher kommt die Potenzregel?</span>
        <p>Man betrachtet die Steigung zwischen x und einem sehr nahen Punkt x + h:<br>
        ((x+h)² − x²) / h = (x² + 2xh + h² − x²) / h = 2x + h.<br>
        Lässt man h immer kleiner werden (gegen 0), bleibt <strong>2x</strong> übrig – die Ableitung von x².<br>
        Dasselbe Verfahren liefert allgemein (xⁿ)′ = n · x<sup>n−1</sup>. Die Regel ist also
        keine Setzung, sondern ein Grenzwert.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Regel</th><th>Formel</th><th>Beispiel</th></tr>
        <tr><td>Potenzregel</td><td>(xⁿ)′ = n · xⁿ⁻¹</td><td>(x³)′ = 3x²</td></tr>
        <tr><td>Faktorregel</td><td>(a · f)′ = a · f′</td><td>(5x²)′ = 10x</td></tr>
        <tr><td>Summenregel</td><td>(f + g)′ = f′ + g′</td><td>summandenweise</td></tr>
        <tr><td>Konstante</td><td>(c)′ = 0</td><td>(7)′ = 0</td></tr>
        <tr><td>Linearer Term</td><td>(ax)′ = a</td><td>(4x)′ = 4</td></tr>
      </table></div>

      <div class="merkkasten"><span class="merk-title">Merke: So liest man <span class="mathe">f′(x)</span></span>
        <ul>
          <li>f′(x) &gt; 0 → der Graph <strong>steigt</strong></li>
          <li>f′(x) &lt; 0 → der Graph <strong>fällt</strong></li>
          <li>f′(x) = 0 → <strong>waagerechte Tangente</strong> (Hoch-, Tief- oder Sattelpunkt)</li>
          <li>Je größer |f′(x)|, desto steiler die Kurve</li>
        </ul>
      </div>

      <h3>So gehst du vor: Extremstelle bestimmen</h3>
      <ol class="schritte">
        <li>Funktion <strong>ableiten</strong> (Summand für Summand).</li>
        <li><strong>f′(x) = 0</strong> setzen und die Gleichung lösen.</li>
        <li>Prüfen, ob dort ein Hoch- oder Tiefpunkt liegt (Vorzeichenwechsel von f′).</li>
        <li>Den zugehörigen <strong>y-Wert</strong> über f(x) berechnen.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Schritt für Schritt gerechnet</span>
        <p>f(x) = 2x³ − 4x² + 7x − 5<br>
        f′(x) = 2 · 3x² − 4 · 2x + 7 − 0 = <strong>6x² − 8x + 7</strong><br>
        <em>Beachte:</em> Die Konstante −5 fällt weg, aus 7x wird 7 (nicht 0!).</p>
      </div>
      <div class="example-box"><span class="ex-title">Steigung an einer Stelle</span>
        <p>f(x) = x², gesucht ist die Steigung bei x = 3.<br>
        f′(x) = 2x → f′(3) = <strong>6</strong><br>
        Die Tangente steigt dort also um 6 pro Schritt nach rechts.</p>
      </div>
      <div class="example-box"><span class="ex-title">Tiefpunkt einer Parabel finden</span>
        <p>f(x) = x² − 6x + 10 → f′(x) = 2x − 6<br>
        f′(x) = 0: 2x − 6 = 0 → x = <strong>3</strong><br>
        y-Wert: f(3) = 9 − 18 + 10 = 1 → Tiefpunkt <strong>T(3 | 1)</strong><br>
        <em>Kontrolle:</em> Links von 3 ist f′ negativ (fällt), rechts positiv (steigt) ✓</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„f′(x) = 0 bedeutet, die Funktion ist null.“ – Nein! Null ist die <strong>Steigung</strong>,
        nicht der Funktionswert. Bei f(x) = x² − 6x + 10 ist f′(3) = 0, aber f(3) = 1.<br>
        Zweiter Klassiker: Beim Ableiten von 7x − 5 wird auch die 7 zu 0 gemacht.
        Richtig: (7x)′ = 7, nur die einzelne Konstante verschwindet.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Leite f(x) = 4x³ − x + 9 ab.</summary>
          <p>f′(x) = <strong>12x² − 1</strong></p></details>
        <details><summary>Was bedeutet f′(2) = −3 anschaulich?</summary>
          <p>An der Stelle x = 2 <strong>fällt</strong> der Graph, und zwar recht steil:
          pro Schritt nach rechts geht es 3 nach unten.</p></details>
        <details><summary>Warum ist die Ableitung einer Geraden konstant?</summary>
          <p>Weil ihre Steigung überall gleich ist: (mx + b)′ = m – unabhängig von x.</p></details>
      </div>
    `,

    /* ---------- Ableitungsregeln ---------- */
    ableitungsregeln: `
      <h2>Produkt-, Quotienten- und Kettenregel</h2>
      <p>Die Potenzregel reicht, solange nur <strong>Summen von Potenzen</strong> dastehen. Sobald
      Funktionen multipliziert, geteilt oder ineinandergesteckt werden, braucht jede dieser drei
      Bauarten ihre eigene Regel.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>f(x) = (x² + 1) · (2x − 3) könnte man ausmultiplizieren und dann Summand für Summand
        ableiten. Bei f(x) = x² · sin(x) oder f(x) = x · e<sup>x</sup> geht das nicht mehr – es gibt
        nichts auszumultiplizieren.</p>
        <span class="frage">Wie leitet man ein Produkt ab, ohne es ausmultiplizieren zu können?</span>
      </div>

      <div class="herleitung-box"><span class="box-title">Warum nicht einfach u′ · v′?</span>
        <p>Das wäre die naheliegende Vermutung – und sie ist falsch. Ein Gegenbeispiel genügt:<br>
        u = x², v = x³. Dann ist u · v = x⁵ und damit (u · v)′ = 5x⁴.<br>
        Getrennt abgeleitet käme dagegen u′ · v′ = 2x · 3x² = 6x³ heraus. Schon der Exponent stimmt nicht.</p>
        <p><strong>Woher die beiden Summanden kommen:</strong> Denk dir u und v als die Seiten eines
        Rechtecks, sein Flächeninhalt ist u · v. Wächst x ein wenig, wird die eine Seite um Δu länger,
        die andere um Δv. Es kommen zwei Streifen dazu – einer der Größe u · Δv, einer der Größe
        v · Δu – und in der Ecke ein winziges Rechteck Δu · Δv.</p>
        <p>Teilt man den Zuwachs durch Δx und lässt Δx gegen null gehen, verschwindet das Eckstück
        als Einziges: Es ist ein Produkt <em>zweier</em> kleiner Größen und schrumpft deshalb schneller
        als die beiden Streifen. Übrig bleiben genau zwei Summanden – daher <strong>u′v + uv′</strong>.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Die drei Regeln</span>
        <p><span class="formula">(u · v)′ = u′ · v + u · v′</span></p>
        <p><span class="formula">(u ⁄ v)′ = ${frac('u′ · v − u · v′', 'v²')}</span></p>
        <p><span class="formula">(u(v(x)))′ = u′(v(x)) · v′(x)</span></p>
        <p>Die dritte in Worten: <strong>äußere Ableitung mal innere Ableitung</strong>. Der letzte
        Faktor heißt Nachdifferenzieren – ihn zu vergessen ist der häufigste Fehler überhaupt.</p>
        <p>Sonderfall Wurzel: √v ist die Potenz v<sup>1/2</sup>, also <strong>(√v)′ = ${frac('1', '2√v')}</strong> –
        danach wie immer mal v′.</p>
        <p>Logarithmus: <strong>(ln x)′ = ${frac('1', 'x')}</strong> und <strong>(log<sub>a</sub> x)′ = ${frac('1', 'x · ln(a)')}</strong> –
        steht innen ein Term, wieder mal innere Ableitung.</p>
      </div>

      <ol class="schritte">
        <li><strong>Bauart erkennen.</strong> Zwei Klammern nebeneinander → Produktregel. Ein Bruchstrich
        mit x im Nenner → Quotientenregel. Eine Klammer mit Exponent → Kettenregel. Eine Wurzel über
        einem Term → ebenfalls Kettenregel.</li>
        <li><strong>u und v benennen</strong> und getrennt hinschreiben.</li>
        <li><strong>u′ und v′ einzeln bilden</strong> – jede für sich mit der Potenzregel.</li>
        <li><strong>In die Regel einsetzen</strong>, ohne unterwegs zusammenzufassen.</li>
        <li><strong>Erst danach ausrechnen</strong> und, wo möglich, eine Probe machen.</li>
      </ol>

      <div class="example-box"><span class="ex-title">Die Produktfrage vom Anfang</span>
        <p>f(x) = (x² + 1) · (2x − 3)<br>
        u = x² + 1 → u′ = 2x&ensp;<span class="trenn">•</span>&ensp;v = 2x − 3 → v′ = 2<br>
        f′(x) = 2x · (2x − 3) + (x² + 1) · 2 = 4x² − 6x + 2x² + 2 = <strong>6x² − 6x + 2</strong><br>
        <em>Probe durch Ausmultiplizieren:</em> f(x) = 2x³ − 3x² + 2x − 3, abgeleitet ebenfalls
        6x² − 6x + 2 ✓ Beide Wege führen zum selben Ergebnis – bei x² · sin(x) gäbe es nur noch den ersten.</p>
      </div>

      <h3>Die Kettenregel: außen mal innen</h3>
      <p>Bei f(x) = (2x + 1)³ steckt eine Funktion in der anderen. Welche innen liegt, verrät die
      Probe mit einer Zahl: Setzt du x = 4 ein, rechnest du <em>zuerst</em> 2 · 4 + 1 = 9 und
      <em>danach</em> 9³. Was zuerst dran ist, ist die innere Funktion.</p>

      <div class="example-box"><span class="ex-title">Kettenregel</span>
        <p>f(x) = (2x + 1)³<br>
        innere Funktion v = 2x + 1 → v′ = 2&ensp;<span class="trenn">•</span>&ensp;äußere Funktion u = v³ → u′ = 3v²<br>
        f′(x) = 3 · (2x + 1)² · 2 = <strong>6 · (2x + 1)²</strong><br>
        Der Faktor 2 am Ende ist das Nachdifferenzieren. Ohne ihn stünde dort 3 · (2x + 1)² – und das
        wäre die Ableitung von (2x + 1)³ nur dann, wenn innen schlicht x stünde.</p>
      </div>

      <div class="example-box"><span class="ex-title">Die Wurzel als äußere Funktion</span>
        <p>Eine Wurzel ist eine Potenz mit dem Exponenten ½: √v = v<sup>1/2</sup>. Damit gilt die
        Potenzregel auch hier – Exponent nach vorn, dann um 1 kleiner:<br>
        (v<sup>1/2</sup>)′ = ½ · v<sup>−1/2</sup> = ½ · ${frac('1', '√v')} = ${frac('1', '2√v')}<br>
        Der negative Exponent ist ein Kehrwert – das kennst du von den Potenzen. Steht unter der
        Wurzel ein Term mit x, kommt die Kettenregel dazu:<br>
        f(x) = √(3x + 3)<br>
        innere Funktion v = 3x + 3 → v′ = 3&ensp;<span class="trenn">•</span>&ensp;äußere Funktion u = √v → u′ = ${frac('1', '2√v')}<br>
        f′(x) = ${frac('1', '2√(3x + 3)')} · 3 = <strong>${frac('3', '2√(3x + 3)')}</strong><br>
        <em>Bei x = 2:</em> Unter der Wurzel steht 3 · 2 + 3 = 9, also √9 = 3 und f′(2) = ${frac('3', '6')} = 0,5.
        Die 3 im Zähler ist wieder das Nachdifferenzieren – ohne sie stünde dort nur ${frac('1', '6')}.</p>
      </div>

      <h3>Logarithmen ableiten</h3>
      <p>Der natürliche Logarithmus ln ist die Umkehrfunktion von e<sup>x</sup> – das kennst du aus
      dem Thema e-Funktion. Seine Ableitung ist überraschend einfach, und die Kettenregel zeigt, warum.</p>

      <div class="example-box"><span class="ex-title">Warum (ln x)′ = 1 ⁄ x gilt</span>
        <p>Weil e und ln sich aufheben, gilt für jedes x &gt; 0: e<sup>ln(x)</sup> = x.<br>
        Beide Seiten ableiten. Links steht eine Verkettung – außen e<sup>v</sup>, innen v = ln(x):<br>
        e<sup>ln(x)</sup> · (ln x)′ = 1<br>
        Der erste Faktor ist wieder x, also x · (ln x)′ = 1 und damit <strong>(ln x)′ = ${frac('1', 'x')}</strong>.<br>
        Für einen Logarithmus zu einer anderen Basis rechnet man um: log<sub>a</sub>(x) = ${frac('ln(x)', 'ln(a)')}.
        ln(a) ist nur eine Zahl, also (log<sub>a</sub> x)′ = ${frac('1', 'x · ln(a)')} – bei log<sub>10</sub> etwa ${frac('1', 'x · 2,303')}.</p>
      </div>

      <div class="example-box"><span class="ex-title">ln mit innerer Funktion</span>
        <p>f(x) = ln(x² + 1)<br>
        innere Funktion v = x² + 1 → v′ = 2x&ensp;<span class="trenn">•</span>&ensp;äußere Funktion u = ln(v) → u′ = ${frac('1', 'v')}<br>
        f′(x) = ${frac('1', 'x² + 1')} · 2x = <strong>${frac('2x', 'x² + 1')}</strong><br>
        <em>Bei x = 3:</em> ${frac('6', '10')} = 0,6. Ohne das Nachdifferenzieren stünde dort ${frac('1', '10')} – der Faktor 2x fehlte.</p>
      </div>

      <h3>Die Quotientenregel: Reihenfolge entscheidet</h3>
      <p>Anders als beim Produkt darf man u und v hier <strong>nicht</strong> vertauschen: Im Zähler
      steht eine Differenz, und ein Vorzeichenfehler dreht das ganze Ergebnis um.</p>

      <div class="example-box"><span class="ex-title">Quotientenregel</span>
        <p>f(x) = ${frac('x + 1', 'x − 2')}<br>
        u = x + 1 → u′ = 1&ensp;<span class="trenn">•</span>&ensp;v = x − 2 → v′ = 1<br>
        f′(x) = ${frac('1 · (x − 2) − (x + 1) · 1', '(x − 2)²')} = ${frac('−3', '(x − 2)²')}<br>
        Die x-Terme im Zähler heben sich auf, übrig bleibt eine Zahl. Da −3 negativ ist und der Nenner
        als Quadrat immer positiv, fällt der Graph überall – außer bei x = 2, wo die Funktion nicht
        definiert ist.</p>
      </div>

      <div class="example-box"><span class="ex-title">Beide Regeln in einer Aufgabe</span>
        <p>f(x) = x · (3x − 1)²<br>
        Außen ist es ein Produkt, also zuerst die Produktregel:<br>
        u = x → u′ = 1&ensp;<span class="trenn">•</span>&ensp;v = (3x − 1)²<br>
        v′ braucht die Kettenregel: v′ = 2 · (3x − 1) · 3 = 6 · (3x − 1)<br>
        f′(x) = 1 · (3x − 1)² + x · 6 · (3x − 1) = <strong>(3x − 1)² + 6x · (3x − 1)</strong><br>
        <em>Bei x = 1:</em> (2)² + 6 · 2 = 4 + 12 = 16.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Beim Produkt leite ich einfach beide Faktoren ab: (u · v)′ = u′ · v′.“ – Nein, und das
        lässt sich in einer Zeile widerlegen.<br>
        <em>Gegenbeispiel</em> mit u = x² und v = x³:<br>
        Richtig ist u · v = x⁵, also (u · v)′ = <strong>5x⁴</strong>.<br>
        Die vermutete Regel ergäbe u′ · v′ = 2x · 3x² = <strong>6x³</strong>.<br>
        Bei x = 2 wären das 5 · 16 = 80 gegen 6 · 8 = 48 – nicht einmal in der Nähe.<br>
        Mit der Produktregel dagegen: 2x · x³ + x² · 3x² = 2x⁴ + 3x⁴ = 5x⁴ ✓</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Welche Regel brauchst du für f(x) = (x² − 4) · (x + 7)?</summary>
          <p>Die Produktregel – zwei Klammern nebeneinander. Ausmultiplizieren ginge hier auch,
          führt aber bei längeren Termen schneller zu Fehlern.</p></details>
        <details><summary>Was ist bei f(x) = (5x − 2)⁴ innen, was außen?</summary>
          <p>Innen v = 5x − 2, außen u = v⁴. Probe mit x = 1: erst 5 − 2 = 3, dann 3⁴ = 81.
          Was zuerst gerechnet wird, ist innen. f′(x) = 4 · (5x − 2)³ · 5 = 20 · (5x − 2)³.</p></details>
        <details><summary>Was ist die Ableitung von f(x) = ln(5x)?</summary>
          <p>Kettenregel: ${frac('1', '5x')} · 5 = ${frac('1', 'x')}. Die 5 kürzt sich weg – kein Zufall, denn
          ln(5x) = ln(5) + ln(x), und ln(5) ist nur eine Zahl, die beim Ableiten wegfällt.</p></details>
        <details><summary>Warum darf man bei der Quotientenregel u und v nicht vertauschen?</summary>
          <p>Weil im Zähler eine Differenz steht. Aus u′v − uv′ würde uv′ − u′v, also genau das
          Negative. Bei f(x) = ${frac('x + 1', 'x − 2')} stünde dann +3 statt −3 im Zähler – der Graph
          würde überall steigen statt zu fallen.</p></details>
      </div>
    `,

    /* ---------- Kurvendiskussion ---------- */
    kurvendiskussion: `
      <h2>Kurvendiskussion mit der zweiten Ableitung</h2>
      <p>f′ verrät, <em>ob</em> der Graph steigt oder fällt. Für die Frage, ob an einer waagerechten
      Tangente ein Berg oder ein Tal liegt, braucht es eine Stufe mehr: die zweite Ableitung.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Bei f(x) = x³ − 3x ist f′(x) = 3x² − 3, und f′ wird null bei x = 1 und x = −1. An beiden
        Stellen ist die Tangente waagerecht – aber an einer liegt ein Hochpunkt, an der anderen ein
        Tiefpunkt.</p>
        <span class="frage">Woran erkennt man, welche Stelle welche ist – ohne den Graphen zu zeichnen?</span>
      </div>

      <div class="herleitung-box"><span class="box-title">Warum die Ableitung der Ableitung hilft</span>
        <p>f′ ist selbst eine Funktion. Leitet man sie noch einmal ab, misst f″, wie schnell sich die
        <strong>Steigung</strong> ändert – also die Krümmung.</p>
        <p>An einem <strong>Hochpunkt</strong> geht die Steigung von positiv über null nach negativ:
        Sie <em>nimmt ab</em>, also ist f″ dort negativ. An einem <strong>Tiefpunkt</strong> läuft es
        andersherum – von negativ über null nach positiv, die Steigung <em>nimmt zu</em>, f″ ist positiv.</p>
        <p>Damit ist die Frage entschieden, ohne dass man Werte links und rechts einsetzen muss.
        Wird f″ selbst null und wechselt dort das Vorzeichen, kippt die Krümmung um – das ist ein
        <strong>Wendepunkt</strong>.</p>
        <p>Und wenn <em>beide</em> Bedingungen verletzt sind, f′(x₀) ≠ 0 und f″(x₀) ≠ 0? Dann liegt dort
        <strong>kein besonderer Punkt</strong>: Der Graph läuft schräg hindurch und behält seine
        Krümmungsrichtung. Die Reihenfolge ist wichtig – erst f′, dann f″. Ohne waagerechte Tangente
        gibt es keinen Hoch- oder Tiefpunkt, so negativ f″ dort auch sein mag.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Die vier Fälle</span>
        <p><span class="formula">f′(x₀) = 0 und f″(x₀) &lt; 0 → Hochpunkt</span></p>
        <p><span class="formula">f′(x₀) = 0 und f″(x₀) &gt; 0 → Tiefpunkt</span></p>
        <p><span class="formula">f″(x₀) = 0 mit Vorzeichenwechsel → Wendepunkt</span></p>
        <p><span class="formula">f′(x₀) ≠ 0 und f″(x₀) ≠ 0 → kein besonderer Punkt</span></p>
        <p>Merkhilfe: Ein <strong>trauriger</strong> Mund ist rechtsgekrümmt – f″ negativ, Hochpunkt.</p>
      </div>

      <ol class="schritte">
        <li><strong>f′ und f″ bilden</strong> – nacheinander, jede mit der Potenzregel.</li>
        <li><strong>f′(x) = 0 setzen</strong> und lösen: Das sind die Kandidaten für Extremstellen.
        Bei einer Funktion dritten Grades ist das eine quadratische Gleichung – erst durch den
        Faktor vor x² teilen, dann pq-Formel.</li>
        <li><strong>Jede Stelle in f″ einsetzen</strong> – das Vorzeichen entscheidet über Hoch oder Tief.</li>
        <li><strong>f″(x) = 0 setzen</strong> für die Wendestelle.</li>
        <li><strong>y-Werte in f einsetzen</strong> – nicht in f′ oder f″.</li>
      </ol>

      <div class="example-box"><span class="ex-title">Die Frage vom Anfang</span>
        <p>f(x) = x³ − 3x&ensp;<span class="trenn">•</span>&ensp;f′(x) = 3x² − 3&ensp;<span class="trenn">•</span>&ensp;f″(x) = 6x<br>
        f′(x) = 0 → 3x² = 3 → x = 1 oder x = −1<br>
        f″(1) = 6 → positiv → <strong>Tiefpunkt</strong> bei (1 | −2)<br>
        f″(−1) = −6 → negativ → <strong>Hochpunkt</strong> bei (−1 | 2)<br>
        Die y-Werte kommen aus f: f(1) = 1 − 3 = −2 und f(−1) = −1 + 3 = 2.</p>
      </div>

      <div class="example-box"><span class="ex-title">Extremstellen mit der pq-Formel</span>
        <p>f(x) = x³ − 3x² − 9x&ensp;<span class="trenn">•</span>&ensp;f′(x) = 3x² − 6x − 9<br>
        f″(x) = 6x − 6<br>
        f′(x) = 0 → 3x² − 6x − 9 = 0. Durch 3 teilen: x² − 2x − 3 = 0<br>
        pq-Formel mit p = −2 und q = −3: −p/2 = 1 und (p/2)² − q = 1 + 3 = 4<br>
        x₁,₂ = 1 ± √4 = 1 ± 2 → x₁ = −1, x₂ = 3<br>
        f″(−1) = −12 → negativ → <strong>Hochpunkt</strong> bei (−1 | 5)<br>
        f″(3) = 12 → positiv → <strong>Tiefpunkt</strong> bei (3 | −27)<br>
        Die y-Werte kommen aus f: f(−1) = −1 − 3 + 9 = 5 und f(3) = 27 − 27 − 27 = −27.<br>
        <em>Vergleich:</em> Bei x³ − 3x kam f′ ohne x-Glied aus, da reichte Umstellen (3x² = 3).
        Hat f′ ein x-Glied, ist die pq-Formel der sichere Weg.</p>
      </div>

      <h3>Der Wendepunkt: wo die Krümmung kippt</h3>
      <p>Zwischen einem Hoch- und einem Tiefpunkt muss die Krümmung irgendwo umschlagen – von
      rechts- auf linksgekrümmt. Genau dort liegt der Wendepunkt, und dort ist der Graph am steilsten.</p>

      <div class="example-box"><span class="ex-title">Wendepunkt bestimmen</span>
        <p>Dieselbe Funktion f(x) = x³ − 3x mit f″(x) = 6x<br>
        f″(x) = 0 → 6x = 0 → <strong>x = 0</strong><br>
        f″ wechselt dort das Vorzeichen (links negativ, rechts positiv) – es ist wirklich ein Wendepunkt.<br>
        y-Wert aus f: f(0) = 0 → W(0 | 0)<br>
        <em>Bei jeder Funktion dritten Grades</em> liegt die Wendestelle genau in der Mitte zwischen
        den beiden Extremstellen: (1 + (−1)) / 2 = 0 ✓</p>
      </div>

      <h3>Monotonie: wo steigt der Graph?</h3>
      <p>Der Graph steigt dort, wo f′ positiv ist. Bei einer Funktion dritten Grades mit positivem
      Vorfaktor ist f′ eine nach oben geöffnete Parabel – sie ist außerhalb ihrer Nullstellen positiv.</p>
      <p>Steht vor x³ ein <strong>Minus</strong>, dreht sich alles um: f′ ist dann eine nach unten
      geöffnete Parabel, der Graph steigt <em>zwischen</em> den Extremstellen und fällt außerhalb –
      und der Hochpunkt liegt rechts statt links. Die vier Fälle oben gelten unverändert, denn sie
      fragen nur nach dem Vorzeichen von f″.</p>

      <div class="example-box"><span class="ex-title">Monotonie ablesen</span>
        <p>f′(x) = 3x² − 3 = 3 · (x − 1) · (x + 1)<br>
        Nullstellen bei −1 und 1. Außerhalb ist f′ positiv, dazwischen negativ:<br>
        <strong>steigend</strong> für x &lt; −1 und x &gt; 1&ensp;<span class="trenn">•</span>&ensp;<strong>fallend</strong> für −1 &lt; x &lt; 1<br>
        <em>Anschaulich:</em> Zwischen Hoch- und Tiefpunkt geht es bergab, überall sonst bergauf.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„f″(x₀) = 0 heißt Wendepunkt.“ – Nicht automatisch. Die Krümmung muss dort auch wirklich
        <strong>umschlagen</strong>.<br>
        <em>Gegenbeispiel:</em> f(x) = x⁴ hat f′(x) = 4x³ und f″(x) = 12x². Bei x = 0 ist f″(0) = 0 –
        die Bedingung ist erfüllt.<br>
        Aber f″(x) = 12x² ist für <strong>jedes</strong> x größer oder gleich null: f″(−1) = 12 und
        f″(1) = 12, beide positiv. Es gibt keinen Vorzeichenwechsel, die Krümmung bleibt links.<br>
        Bei x = 0 liegt deshalb kein Wendepunkt, sondern der <strong>Tiefpunkt</strong> der Parabel
        vierten Grades – f(0) = 0 ist der kleinste Wert überhaupt.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>f′(x₀) = 0 und f″(x₀) = −4 – was liegt vor?</summary>
          <p>Ein Hochpunkt. f″ negativ heißt rechtsgekrümmt, der Graph macht dort einen Bogen nach
          unten wie ein Hügel.</p></details>
        <details><summary>Und wenn f′(x₀) = 3 und f″(x₀) = −4 ist?</summary>
          <p>Kein besonderer Punkt. f″ ist zwar negativ, aber die Tangente ist nicht waagerecht –
          ohne f′(x₀) = 0 gibt es keinen Hochpunkt. Der Graph steigt dort und ist dabei
          rechtsgekrümmt, mehr nicht.</p></details>
        <details><summary>Warum setzt man den x-Wert des Wendepunkts in f ein und nicht in f″?</summary>
          <p>Weil f″ dort per Definition null ist – das war die Bedingung, mit der man die Stelle
          gefunden hat. Der y-Wert eines Punktes auf dem Graphen kommt immer aus der Ausgangsfunktion.</p></details>
        <details><summary>Wie viele Wendepunkte hat eine Funktion dritten Grades höchstens?</summary>
          <p>Genau einen. f″ ist bei x³ eine Gerade, und eine Gerade hat höchstens eine Nullstelle –
          und wechselt dort immer das Vorzeichen.</p></details>
      </div>
    `,

    /* ---------- Integrale ---------- */
    integrale: `
      <h2>Integrale – Flächen unter Kurven</h2>
      <p>Das Integral kehrt das Ableiten um – und beantwortet gleichzeitig eine
      geometrische Frage.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Auto fährt mit konstant 20 m/s. Der zurückgelegte Weg ist ein Rechteck im
        Geschwindigkeits-Zeit-Diagramm: Fläche = Weg. Nun beschleunigt es aber gleichmäßig –
        der Graph ist eine schräge Linie, später sogar eine Kurve.</p>
        <span class="frage">Wie berechnet man die Fläche unter einer beliebig gekrümmten Kurve?</span>
      </div>

      <h3>Die Idee: Flächen aus unendlich schmalen Streifen</h3>
      <p>Man legt die Fläche mit schmalen Rechtecken aus und macht sie immer schmaler.
      Der Grenzwert dieser Summe ist das <strong>Integral</strong>.
      Verblüffend: Berechnen lässt es sich mit der <strong>Umkehrung des Ableitens</strong>.</p>

      <div class="herleitung-box"><span class="box-title">Warum berechnet F(b) − F(a) eine Fläche?</span>
        <p>Betrachte die Funktion A(x), die die Fläche von a bis x misst.
        Wächst x um ein winziges Stück h, kommt näherungsweise ein Rechteck der Höhe f(x)
        und Breite h dazu: A(x + h) − A(x) ≈ f(x) · h.<br>
        Teilt man durch h, steht dort A′(x) = f(x) – die Flächenfunktion ist also eine
        <strong>Stammfunktion</strong> von f. Deshalb genügt es, F an den Grenzen auszuwerten
        und zu subtrahieren. Das ist der <em>Hauptsatz der Differential- und Integralrechnung</em>.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">f(x) = xⁿ → F(x) = xⁿ⁺¹ ⁄ (n+1) + C</span></p>
        <p>Exponent um 1 <em>erhöhen</em>, durch den neuen Exponenten teilen.</p>
        <p><span class="formula">∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)</span></p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Stammfunktion F</strong> bilden (Potenzregel rückwärts, summandenweise).</li>
        <li><strong>Kontrolle:</strong> F ableiten – es muss wieder f herauskommen.</li>
        <li>Obere Grenze b einsetzen, untere Grenze a einsetzen.</li>
        <li><strong>F(b) − F(a)</strong> rechnen – in dieser Reihenfolge.</li>
        <li>Bei Flächenaufgaben: Nullstellen prüfen, negative Teile ggf. getrennt behandeln.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Stammfunktionen finden und prüfen</span>
        <p>f(x) = 2x → F(x) = x² + C&ensp;<span class="trenn">•</span>&ensp;f(x) = 3x² → F(x) = x³ + C<br>
        f(x) = x² → F(x) = x³/3 + C&ensp;<span class="trenn">•</span>&ensp;f(x) = 5 → F(x) = 5x + C<br>
        <em>Probe:</em> Jeweils ableiten – man landet wieder bei f ✓</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Weg-Frage vom Anfang</span>
        <p>Ein Auto beschleunigt: v(t) = 2t + 1 (in m/s). Weg in den ersten 3 Sekunden?<br>
        F(t) = t² + t → F(3) − F(0) = (9 + 3) − 0 = <strong>12 Meter</strong><br>
        <em>Geometrische Kontrolle:</em> Die Fläche ist ein Trapez mit den parallelen Seiten
        1 und 7 und der Breite 3: (1 + 7)/2 · 3 = 12 ✓ – Analysis und Geometrie stimmen überein.</p>
      </div>
      <div class="example-box"><span class="ex-title">Integral von 1 bis 3</span>
        <p>∫<sub>1</sub><sup>3</sup> x² dx = [x³/3] = 27/3 − 1/3 = 26/3 ≈ <strong>8,67</strong></p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Das Integral ist immer die Fläche.“ – Verläuft der Graph <em>unterhalb</em> der x-Achse,
        wird das Integral <strong>negativ</strong> und hebt positive Anteile auf.<br>
        <em>Gegenbeispiel</em> f(x) = x − 2 auf [0; 4] mit F(x) = x²/2 − 2x:<br>
        ∫<sub>0</sub><sup>4</sup> (x − 2) dx = F(4) − F(0) = (8 − 8) − 0 = <strong>0</strong><br>
        An der Nullstelle x = 2 getrennt: ∫<sub>0</sub><sup>2</sup> = (2 − 4) − 0 = <strong>−2</strong> und
        ∫<sub>2</sub><sup>4</sup> = 0 − (−2) = <strong>+2</strong>. Die eingeschlossene Fläche ist also
        |−2| + 2 = <strong>4</strong> – und eben nicht 0. (Kontrolle: zwei Dreiecke mit je 2 · 2 : 2 = 2.)<br>
        Und die Reihenfolge zählt: ∫<sub>1</sub><sup>3</sup> x² dx = 27/3 − 1/3 = 26/3 ≈ 8,67;
        vertauscht käme 1/3 − 27/3 = −26/3 heraus – dasselbe Ergebnis mit falschem Vorzeichen.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie lautet eine Stammfunktion von f(x) = 6x²?</summary>
          <p>F(x) = <strong>2x³ + C</strong>&nbsp;(Probe: (2x³)′ = 6x² ✓)</p></details>
        <details><summary>Berechne ∫<sub>0</sub><sup>4</sup> x dx.</summary>
          <p>F(x) = x²/2 → 16/2 − 0 = <strong>8</strong>.
          Geometrisch ein Dreieck mit 4 · 4 : 2 = 8 ✓</p></details>
        <details><summary>Warum taucht beim bestimmten Integral kein „+ C“ auf?</summary>
          <p>Weil es sich beim Subtrahieren weghebt: (F(b) + C) − (F(a) + C) = F(b) − F(a).</p></details>
      </div>
    `

  };
})();
