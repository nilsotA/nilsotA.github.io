/* ============================================================
   MatheNils – Erklärseiten: Uni-Stochastik (Lehramt)
   Kombinatorik · Bedingte W'keit · Erwartungswert · Binomial ·
   Hypergeometrisch · Normalverteilung · Beschreibende Statistik
   ============================================================ */
'use strict';

const LEARN_UNI = (() => {
  const { frac } = Util;
  return {

    /* ---------- Kombinatorik ---------- */
    kombinatorik: `
      <h2>Kombinatorik – die Kunst des geschickten Zählens</h2>
      <p>Bevor man Wahrscheinlichkeiten berechnen kann, muss man zählen können –
      und zwar ohne alles aufzuschreiben.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Aus 10 Studierenden soll eine 3er-Gruppe gebildet werden.
        Eine erste Überlegung: 10 · 9 · 8 = 720 Möglichkeiten.
        Aber die Gruppe {Anna, Ben, Cem} ist dieselbe wie {Cem, Anna, Ben}.</p>
        <span class="frage">Wie viele <em>verschiedene</em> Gruppen gibt es wirklich?</span>
      </div>

      <h3>Die Grundregel: Möglichkeiten multiplizieren</h3>
      <p>Jedes Zählen beginnt mit der <strong>Produktregel</strong>, auch Zählprinzip genannt:
      Fällt eine Entscheidung in mehreren Schritten und hat jeder Schritt eine feste Zahl an
      Möglichkeiten, dann multipliziert man diese Zahlen. Das Baumdiagramm oben zeigt, warum:
      Zu jeder der 3 Hosen passen beide Shirts, also 3 · 2 = <strong>6</strong> Outfits.
      Bei drei Schritten geht es genauso weiter: 6 Vorspeisen, 3 Hauptgerichte und 2 Desserts
      ergeben 6 · 3 · 2 = <strong>36</strong> Menüs.</p>
      <p>Die Formeln der Tabelle unten bauen darauf auf. nᵏ ist n · n · … · n mit k gleichen
      Faktoren: Jeder Schritt wählt wieder aus allen n. Bei n · (n−1) · (n−2) · … wird der Faktor
      mit jedem Schritt um eins kleiner, weil nicht zurückgelegt wird. Der Binomialkoeffizient
      teilt dieses Produkt noch durch k! – warum, steht gleich.</p>

      <h3>Die Idee: Zwei Fragen entscheiden alles</h3>
      <p>Wird k-mal aus <em>derselben</em> Menge gewählt – k Ziffern, k Plätze, k Kugeln –,
      klärt man nur noch zwei Dinge:
      Spielt die <strong>Reihenfolge</strong> eine Rolle? Und wird <strong>zurückgelegt</strong>
      (dürfen sich Elemente wiederholen)? Die Antworten führen direkt zur passenden Formel.</p>

      <div class="table-wrap"><table>
        <tr><th></th><th>mit Reihenfolge</th><th>ohne Reihenfolge</th></tr>
        <tr><td><strong>mit Zurücklegen</strong></td><td>nᵏ&nbsp;(PIN: 10⁴ = 10 000)</td><td>(selten)</td></tr>
        <tr><td><strong>ohne Zurücklegen</strong></td><td>n · (n−1) · …&nbsp;(Podest: 8·7·6; alle 8 in einer Reihe: 8!)</td><td>(n über k)&nbsp;(Team)</td></tr>
      </table></div>

      <div class="herleitung-box"><span class="box-title">Warum teilt man durch k!?</span>
        <p>Die 720 aus dem Einstieg zählen <em>geordnete</em> Auswahlen. Jede 3er-Gruppe taucht darin
        aber mehrfach auf – nämlich in allen 3! = 6 möglichen Reihenfolgen.<br>
        Teilt man die Überzählung heraus, bleibt: 720 : 6 = <strong>120</strong>.
        Genau das leistet der Binomialkoeffizient (n über k) = n! / (k! · (n−k)!).</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">( n über k ) = n! ⁄ (k! · (n−k)!)</span></p>
        <p>n! = n · (n−1) · … · 1 („Fakultät“), z. B. 5! = 120&ensp;<span class="trenn">•</span>&ensp;Sonderfall: 0! = 1</p>
        <p><strong>Alle n Objekte in eine Reihe:</strong> n! Möglichkeiten – erster Platz n Kandidaten,
        zweiter n−1, …, letzter 1.</p>
        <p>Dahinter steckt immer die <strong>Produktregel:</strong> Schritte mit a, b, c, … Möglichkeiten
        ergeben zusammen a · b · c · … Möglichkeiten.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Zerlege die Aufgabe in Schritte: Wie viele Möglichkeiten hat jeder Schritt für sich?
        Sind es lauter freie Wahlen wie Hose und Shirt, reicht die Produktregel.</li>
        <li>Frage 1: Ist die <strong>Reihenfolge</strong> relevant? (Podest ja, Team nein)</li>
        <li>Frage 2: Wird <strong>zurückgelegt</strong>? (PIN ja, Lotto nein)</li>
        <li>Passende Formel aus der Tabelle wählen.</li>
        <li>Berechnen – beim Binomialkoeffizienten möglichst kürzen statt Fakultäten auszurechnen.</li>
        <li><strong>Plausibilität:</strong> „Ohne Reihenfolge“ muss stets weniger ergeben als „mit“.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Gruppen-Frage vom Anfang</span>
        <p>(10 über 3) = ${frac('10 · 9 · 8', '3 · 2 · 1')} = ${frac(720, 6)} = <strong>120</strong><br>
        <em>Rechentipp:</em> Oben k Faktoren absteigend, unten k! – das kürzt sich meist schön.</p>
      </div>
      <div class="example-box"><span class="ex-title">Drei Bilder nebeneinander</span>
        <p>Die Bilder A, B und C hängen nebeneinander an einer Wand. Für den linken Haken gibt es
        3 Kandidaten, für den mittleren noch 2, für den rechten bleibt 1: 3 · 2 · 1 = 3! = <strong>6</strong>.<br>
        <em>Klein genug zum Nachzählen:</em> ABC, ACB, BAC, BCA, CAB, CBA.<br>
        Bei 5 Bildern sind es schon 5 · 4 · 3 · 2 · 1 = 5! = <strong>120</strong> – aufschreiben lohnt nicht mehr.</p>
      </div>
      <div class="example-box"><span class="ex-title">Anordnungen von ANNA</span>
        <p>4 Buchstaben ergäben 4! = 24 Anordnungen. Aber A und N kommen je doppelt vor,
        und ihr Vertauschen ändert nichts:<br>
        ${frac('4!', '2! · 2!')} = ${frac(24, 4)} = <strong>6</strong> verschiedene Wörter</p>
      </div>
      <div class="example-box"><span class="ex-title">Lotto 6 aus 49</span>
        <p>(49 über 6) = <strong>13 983 816</strong><br>
        Die Chance auf sechs Richtige ist also 1 : 14 Millionen ≈ 0,0000072 %.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Beim Team-Bilden rechne ich n · (n−1) · (n−2) …“ – hier fehlt das Teilen durch k!,
        und dann ist jede Gruppe k!-fach gezählt.<br>
        <em>Klein genug zum Nachzählen:</em> Aus A, B, C, D soll ein 2er-Team werden. Die Rechnung
        4 · 3 = 12 liefert AB, AC, AD, BA, BC, BD, CA, CB, CD, DA, DB, DC. Verschiedene Teams sind
        darunter aber nur sechs, denn AB und BA sind dasselbe Team – jedes steht genau 2! = 2-mal
        in der Liste. Richtig ist (4 über 2) = ${frac('4 · 3', '2 · 1')} = ${frac(12, 2)} = <strong>6</strong>.<br>
        Kontrollfrage bei jeder Aufgabe: <em>Wäre eine andere Reihenfolge derselben Elemente
        ein neues Ergebnis?</em> Wenn nein → Binomialkoeffizient.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie viele Möglichkeiten gibt es für Gold, Silber, Bronze bei 8 Läufern?</summary>
          <p>Reihenfolge zählt, ohne Zurücklegen: 8 · 7 · 6 = <strong>336</strong></p></details>
        <details><summary>Warum ist (n über 0) = 1?</summary>
          <p>Es gibt genau eine Möglichkeit, nichts auszuwählen – die leere Auswahl.
          Formal sorgt 0! = 1 dafür.</p></details>
        <details><summary>Wie viele 4-stellige PINs gibt es?</summary>
          <p>Jede Stelle unabhängig 10 Ziffern: 10⁴ = <strong>10 000</strong></p></details>
      </div>
    `,

    /* ---------- Bedingte Wahrscheinlichkeit ---------- */
    bedingte: `
      <h2>Bedingte Wahrscheinlichkeit und Satz von Bayes</h2>
      <p>Zusatzinformation verändert Wahrscheinlichkeiten – manchmal dramatisch und oft
      entgegen der Intuition.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Ein Test erkennt 90 % aller Kranken zuverlässig, schlägt aber auch bei 10 % der
        Gesunden fälschlich an. Eine Krankheit betrifft 2 % der Bevölkerung.
        Du wirst positiv getestet. Die meisten – auch viele Ärztinnen und Ärzte in Studien –
        schätzen die Wahrscheinlichkeit, wirklich krank zu sein, auf etwa 90 %.</p>
        <span class="frage">Wie hoch ist sie tatsächlich?</span>
      </div>

      <h3>Die Idee: Die Bedingung schränkt den Blick ein</h3>
      <p>P(A|B) fragt: Wie wahrscheinlich ist A, <strong>wenn B bereits feststeht</strong>?
      Man betrachtet dann nur noch die B-Fälle und rechnet innerhalb dieser Gruppe neu auf 100 %.
      Deshalb steht im Nenner P(B) und nicht die Gesamtzahl.</p>

      <div class="herleitung-box"><span class="box-title">Warum ist das Ergebnis so überraschend klein?</span>
        <p>Rechne mit <strong>natürlichen Häufigkeiten</strong> statt mit Prozenten – dann wird es sofort klar.
        Von 1000 Personen sind 20 krank; davon erkennt der Test 18.
        Von den 980 Gesunden schlägt er bei 10 % fälschlich an – das sind 98 Personen.<br>
        Positiv getestet werden also 18 + 98 = 116 Menschen, aber nur 18 sind wirklich krank.<br>
        Der Grund: Die große Gruppe der Gesunden produziert in absoluten Zahlen mehr Fehlalarme,
        als es überhaupt Kranke gibt.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">P(A|B) = P(A ∩ B) ⁄ P(B)</span></p>
        <p><strong>Unabhängigkeit:</strong> A und B sind unabhängig, wenn P(A ∩ B) = P(A) · P(B) –
        Wissen über B ändert dann nichts an A.</p>
        <p><strong>Totale Wahrscheinlichkeit:</strong> über alle Pfade summieren.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Denk in <strong>absoluten Zahlen</strong>: Wähle eine bequeme Gesamtzahl (z. B. 1000).</li>
        <li>Vierfeldertafel oder Baumdiagramm ausfüllen.</li>
        <li>Die Bedingung markieren – nur diese Zeile bzw. Spalte zählt noch.</li>
        <li>Anteil innerhalb dieser Gruppe berechnen.</li>
        <li><strong>Kontrolle:</strong> Alle vier Felder müssen zusammen die Gesamtzahl ergeben.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Ablesen aus der Vierfeldertafel</span>
        <p>100 Personen: 18 Mädchen und 22 Jungen spielen ein Instrument,
        27 Mädchen und 33 Jungen nicht.<br>
        P(Instrument | Mädchen) = ${frac(18, 45)} = <strong>0,4</strong><br>
        P(Mädchen | Instrument) = ${frac(18, 40)} = <strong>0,45</strong><br>
        Zwei verschiedene Fragen – zwei verschiedene Antworten!</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Test-Frage vom Anfang</span>
        <p>P(krank | positiv) = ${frac(18, 116)} ≈ <strong>0,155</strong> – nur rund 15 %!<br>
        Trotz eines „90-prozentigen“ Tests ist ein positives Ergebnis bei einer seltenen
        Krankheit meist ein Fehlalarm. Deshalb wird in der Praxis nachgetestet.</p>
      </div>
      <div class="example-box"><span class="ex-title">Zwei Maschinen, ein Ausschussanteil</span>
        <p>Maschine A liefert 40 % der Teile (2 % Ausschuss), B 60 % (5 % Ausschuss).<br>
        P(Ausschuss) = 0,4 · 0,02 + 0,6 · 0,05 = 0,008 + 0,03 = <strong>3,8 %</strong><br>
        Über beide Pfade des Baumdiagramms summieren – das ist die totale Wahrscheinlichkeit.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>P(A|B) und P(B|A) verwechseln – der klassische <em>Fehlschluss der Umkehrung</em>.
        „90 % der Kranken werden erkannt“ (P(positiv | krank)) ist etwas völlig anderes als
        „90 % der positiv Getesteten sind krank“ (P(krank | positiv) ≈ 15 %).<br>
        Die Bedingung steht <strong>hinter dem Strich</strong> und legt fest, durch welche Gruppe geteilt wird.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Warum hilft das Rechnen mit natürlichen Häufigkeiten?</summary>
          <p>Weil man absolute Anzahlen direkt vergleichen kann (18 gegen 98), statt Prozente
          von verschiedenen Grundgesamtheiten im Kopf zu jonglieren. Studien zeigen: Damit lösen
          deutlich mehr Menschen solche Aufgaben korrekt – ein starkes didaktisches Argument.</p></details>
        <details><summary>P(A) = 0,4, P(B) = 0,5, P(A∩B) = 0,2 – unabhängig?</summary>
          <p>0,4 · 0,5 = 0,2 ✓ → <strong>ja</strong>, die Ereignisse sind unabhängig.</p></details>
        <details><summary>Was ändert sich, wenn die Krankheit häufiger wird?</summary>
          <p>Je häufiger die Krankheit, desto aussagekräftiger ein positiver Test.
          Bei 50 % Krankheitsrate läge P(krank | positiv) bereits bei 90 %.</p></details>
      </div>
    `,

    /* ---------- Erwartungswert & Varianz ---------- */
    erwartungswert: `
      <h2>Zufallsvariablen, Erwartungswert und Varianz</h2>
      <p>Der Erwartungswert beantwortet die Frage: Was passiert auf <em>lange Sicht</em>?</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Auf dem Jahrmarkt kostet ein Spiel 2 € Einsatz. Bei einer gewürfelten Sechs
        bekommst du 6 € ausgezahlt. „Sechsmal spielen, einmal gewinnen – das gleicht sich aus“,
        sagt der Schausteller.</p>
        <span class="frage">Ist das Spiel fair – oder verlierst du systematisch?</span>
      </div>

      <h3>Die Idee: Werte mit ihren Wahrscheinlichkeiten gewichten</h3>
      <p>Eine <strong>Zufallsvariable X</strong> übersetzt zufällige Ergebnisse in Zahlen
      (z. B. den Gewinn). Der Erwartungswert ist ein <em>gewichteter</em> Durchschnitt:
      Jeder mögliche Wert zählt so stark, wie er wahrscheinlich ist.</p>

      <div class="herleitung-box"><span class="box-title">Warum gewichtet man mit p?</span>
        <p>Stell dir 600 Spiele vor. Statistisch fällt die Sechs etwa 100-mal, die anderen
        Ergebnisse 500-mal. Gesamtauszahlung: 100 · 6 € = 600 €, Einsatz: 600 · 2 € = 1200 €.<br>
        Pro Spiel bedeutet das (600 − 1200) : 600 = −1 €.<br>
        Genau dieselbe Rechnung, nur allgemein formuliert, ist der Erwartungswert:
        Man ersetzt „wie oft“ durch „mit welcher Wahrscheinlichkeit“.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">E(X) = x₁ · p₁ + x₂ · p₂ + … + xₙ · pₙ</span></p>
        <p>Varianz – das gewichtete Mittel der quadrierten Abweichungen vom Erwartungswert μ = E(X):
        <span class="formula">Var(X) = (x₁ − μ)² · p₁ + … + (xₙ − μ)² · pₙ</span></p>
        <p>Schneller rechnet der Verschiebungssatz:
        <span class="formula">Var(X) = E(X²) − (E(X))², σ = √Var(X)</span></p>
        <p>Linearität: E(aX + b) = a · E(X) + b&ensp;<span class="trenn">•</span>&ensp;Var(aX + b) = a² · Var(X)</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Zufallsvariable festlegen:</strong> Was genau misst X – Auszahlung oder Gewinn?</li>
        <li>Alle möglichen Werte mit ihren Wahrscheinlichkeiten in eine Tabelle schreiben.</li>
        <li><strong>Kontrolle:</strong> Die Wahrscheinlichkeiten müssen sich zu 1 addieren.</li>
        <li>Jeden Wert mit seiner Wahrscheinlichkeit multiplizieren und alles addieren.</li>
        <li>Ergebnis deuten: E = 0 heißt fair, E &lt; 0 heißt Verlust auf Dauer.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Glücksrad</span>
        <p>Auszahlung 0 € mit ${frac(1, 2)}, 4 € mit ${frac(1, 4)}, 8 € mit ${frac(1, 4)}<br>
        E(X) = 0 · ${frac(1, 2)} + 4 · ${frac(1, 4)} + 8 · ${frac(1, 4)} = 0 + 1 + 2 = <strong>3 €</strong><br>
        Auf lange Sicht zahlt das Rad im Schnitt 3 € pro Drehung aus.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Jahrmarkt-Frage vom Anfang</span>
        <p>E(Gewinn) = 6 € · ${frac(1, 6)} − 2 € = 1 € − 2 € = <strong>−1 €</strong><br>
        Das Spiel ist <strong>nicht fair</strong>: Pro Runde verlierst du im Mittel 1 €.
        Fair wäre erst eine Auszahlung von 12 € bei einer Sechs.</p>
      </div>
      <div class="example-box"><span class="ex-title">Verlosung: Wo steckt die Wahrscheinlichkeit?</span>
        <p>Ein Los kostet 3 €. Unter 20 Losen ist genau ein Gewinnlos, es bringt 60 €.<br>
        Die Trefferwahrscheinlichkeit ist hier ${frac(1, 20)} und nicht ${frac(1, 6)} – sie steckt
        in der Zahl der Lose, nicht im Würfel.<br>
        E(Gewinn) = 60 € · ${frac(1, 20)} − 3 € = 3 € − 3 € = <strong>0 €</strong> → fair.<br>
        Brächte dasselbe Los nur 40 €, wären es 2 € − 3 € = <strong>−1 €</strong>:
        im Schnitt 1 € Verlust pro Los.</p>
      </div>
      <div class="example-box"><span class="ex-title">Varianz – zwei Wege, ein Ergebnis</span>
        <p>X nimmt 2 und 8 mit je ${frac(1, 2)} an, also μ = E(X) = 5.<br>
        <strong>Nach Definition:</strong> Beide Werte liegen 3 vom Erwartungswert entfernt.<br>
        Var(X) = (2 − 5)² · ${frac(1, 2)} + (8 − 5)² · ${frac(1, 2)} = 4,5 + 4,5 = <strong>9</strong><br>
        <strong>Verschiebungssatz:</strong> E(X²) = (4 + 64) · ${frac(1, 2)} = 34, also Var(X) = 34 − 25 = <strong>9</strong><br>
        σ = √9 = <strong>3</strong>: Die Werte streuen typischerweise um 3 Einheiten um den Erwartungswert.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Der Erwartungswert ist der Wert, den ich erwarten kann.“ – Beim Würfel ist E(X) = 3,5,
        aber 3,5 fällt nie. Der Erwartungswert ist ein <strong>Langzeit-Durchschnitt</strong>,
        kein konkretes Ergebnis.<br>
        Und beim Verschiebungssatz: E(X²) (erst quadrieren, dann mitteln) ist etwas anderes
        als (E(X))² (erst mitteln, dann quadrieren) – ihre Differenz <em>ist</em> gerade die Varianz.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wie groß ist E(X) beim fairen Würfel?</summary>
          <p>(1+2+3+4+5+6) · ${frac(1, 6)} = 21/6 = <strong>3,5</strong></p></details>
        <details><summary>E(X) = 4. Wie groß ist E(3X + 2)?</summary>
          <p>Linearität: 3 · 4 + 2 = <strong>14</strong></p></details>
        <details><summary>Warum kann die Varianz nie negativ sein?</summary>
          <p>Weil sie ein Mittel <em>quadrierter</em> Abweichungen ist – Quadrate sind nie negativ.
          Kommt bei dir etwas Negatives heraus, liegt ein Rechenfehler vor.</p></details>
      </div>
    `,

    /* ---------- Binomialverteilung ---------- */
    binomial: `
      <h2>Die Binomialverteilung</h2>
      <p>Das wichtigste Verteilungsmodell der Schule und des Lehramtsstudiums –
      es beschreibt die Anzahl der Treffer bei wiederholten Versuchen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Du würfelst dreimal und fragst nach der Wahrscheinlichkeit für <em>genau eine</em> Sechs.
        Ein naheliegender Ansatz: ${frac(1, 6)} · ${frac(5, 6)} · ${frac(5, 6)} = ${frac(25, 216)} ≈ 0,116.</p>
        <span class="frage">Warum ist dieser Ansatz zu klein – und was fehlt?</span>
      </div>

      <h3>Die Idee: Bernoulli-Kette</h3>
      <p>Ein Versuch mit nur zwei Ausgängen (Treffer/Niete), n-mal unabhängig wiederholt,
      mit konstantem p – das ist eine <strong>Bernoulli-Kette</strong>.
      X zählt die Treffer und ist dann binomialverteilt.</p>
      <ul>
        <li>☑ nur zwei Ausgänge</li>
        <li>☑ p bei jedem Versuch gleich</li>
        <li>☑ Versuche unabhängig voneinander</li>
      </ul>

      <div class="herleitung-box"><span class="box-title">Warum fehlt im Einstieg der Faktor 3?</span>
        <p>${frac(25, 216)} ist die Wahrscheinlichkeit für <em>einen ganz bestimmten</em> Pfad:
        Sechs im ersten Wurf, dann zweimal keine.<br>
        Die Sechs kann aber genauso im zweiten oder dritten Wurf fallen – es gibt
        <strong>(3 über 1) = 3 gleichwertige Pfade</strong>. Jeder hat dieselbe Wahrscheinlichkeit,
        also wird addiert bzw. mit 3 multipliziert:<br>
        3 · ${frac(25, 216)} = ${frac(75, 216)} = ${frac(25, 72)} ≈ 0,347.<br>
        Genau dafür steht der Binomialkoeffizient in der Formel: Er <strong>zählt die Pfade</strong>.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke: Bernoulli-Formel</span>
        <p><span class="formula">P(X = k) = ( n über k ) · pᵏ · (1−p)ⁿ⁻ᵏ</span></p>
        <p>Lies: (Anzahl der Pfade) · (Wahrscheinlichkeit eines Pfades)</p>
        <p>Kennwerte: E(X) = n · p&ensp;<span class="trenn">•</span>&ensp;Var(X) = n · p · (1−p)&ensp;<span class="trenn">•</span>&ensp;σ = √Var</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li><strong>Checkliste prüfen:</strong> Liegt wirklich eine Bernoulli-Kette vor?</li>
        <li>n, p und k aus dem Text herauslesen.</li>
        <li>Bei „höchstens k“ addierst du die Fälle P(X = 0) bis P(X = k). Bei „mindestens k“ nimmst du
        das <strong>Gegenereignis</strong> „höchstens k − 1“ und ziehst es von 1 ab.</li>
        <li>Formel einsetzen: Pfadanzahl mal Pfadwahrscheinlichkeit.</li>
        <li><strong>Plausibilität:</strong> Das Ergebnis muss zwischen 0 und 1 liegen und
        nahe bei E(X) = n · p am größten sein.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Würfel-Frage vom Anfang</span>
        <p>n = 3, p = ${frac(1, 6)}, k = 1<br>
        P(X = 1) = (3 über 1) · ${frac(1, 6)} · ${frac(25, 36)} = 3 · ${frac(25, 216)}
        = ${frac(25, 72)} ≈ <strong>0,347</strong><br>
        Also deutlich mehr als die anfangs vermuteten 0,116.</p>
      </div>
      <div class="example-box"><span class="ex-title">100 Münzwürfe</span>
        <p>E(X) = 100 · 0,5 = <strong>50</strong> Treffer<br>
        Var(X) = 100 · 0,5 · 0,5 = 25 → σ = <strong>5</strong><br>
        Typisch landen also 45–55 Köpfe – Werte unter 40 wären schon auffällig.</p>
      </div>
      <div class="example-box"><span class="ex-title">Mindestens ein Treffer</span>
        <p>P(X ≥ 1) = 1 − P(X = 0) = 1 − (1−p)ⁿ<br>
        Drei Würfe, mindestens eine Sechs: 1 − ${frac(125, 216)} = ${frac(91, 216)} ≈ <strong>0,421</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Höchstens eine – und mindestens zwei</span>
        <p>Drei Würfe, höchstens eine Sechs: Die Fälle k = 0 und k = 1 zählen beide, also addierst du sie.<br>
        P(X ≤ 1) = P(X = 0) + P(X = 1) = ${frac(125, 216)} + ${frac(75, 216)} = ${frac(200, 216)} ≈ <strong>0,926</strong><br>
        „Mindestens zwei Sechsen“ ist genau das Gegenteil davon:<br>
        P(X ≥ 2) = 1 − P(X ≤ 1) = 1 − ${frac(200, 216)} = ${frac(16, 216)} ≈ <strong>0,074</strong><br>
        Wer hier nur P(X = 0) abzieht, hat „mindestens eine“ gerechnet – ein Fall zu wenig.</p>
      </div>
      <div class="example-box"><span class="ex-title">Wie oft mindestens? – die Formel rückwärts</span>
        <p>Wie oft musst du würfeln, damit mit über 90 % mindestens eine Sechs fällt?
        Jetzt ist n gesucht. Der Anfang ist derselbe wie bei „mindestens ein Treffer“:<br>
        1 − ${frac(5, 6)}<sup>n</sup> &gt; 0,9, also ${frac(5, 6)}<sup>n</sup> &lt; 0,1<br>
        Das n steht im Exponenten – da hilft nur der Logarithmus:<br>
        n · log(${frac(5, 6)}) &lt; log(0,1)<br>
        log(${frac(5, 6)}) ≈ −0,0792 ist <strong>negativ</strong>. Teilst du durch eine negative Zahl,
        dreht sich das Zeichen um:<br>
        n &gt; log(0,1) / log(${frac(5, 6)}) ≈ −1 / (−0,0792) ≈ 12,6<br>
        Würfe sind ganze Zahlen, also <strong>aufrunden: n = 13</strong>.<br>
        Probe: 1 − ${frac(5, 6)}<sup>13</sup> ≈ 0,907 ✓ – mit 12 Würfen erst ≈ 0,888 ✗</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>Den <strong>Binomialkoeffizienten vergessen</strong> – dann rechnet man nur einen von
        vielen Pfaden und erhält ein zu kleines Ergebnis.<br>
        <em>Die Summenprobe entlarvt den Fehler sofort:</em> Für n = 3 und p = ${frac(1, 6)} hat ein
        <em>einzelner</em> Pfad mit k = 0, 1, 2, 3 Treffern die Wahrscheinlichkeit ${frac(125, 216)},
        ${frac(25, 216)}, ${frac(5, 216)} bzw. ${frac(1, 216)}.
        Ohne Koeffizienten addieren sie sich zu ${frac(156, 216)} ≈ 0,72 – es fehlen 28 %, obwohl
        k = 0, 1, 2, 3 schon alle möglichen Fälle sind. Mit den Faktoren 1, 3, 3, 1 wird daraus
        ${frac('125 + 75 + 15 + 1', 216)} = ${frac(216, 216)} = <strong>1</strong>, wie es sein muss.<br>
        Zweiter Fehler: binomial rechnen, obwohl <em>nicht</em> zurückgelegt wird. Zieht man aus einer
        Urne mit 5 Treffern und 5 Nieten <em>alle zehn</em> Kugeln, sind es zwingend 5 Treffer, also
        P = 1. Die Binomialformel liefert dagegen (10 über 5) · 0,5¹⁰ = ${frac(252, 1024)} ≈
        <strong>0,246</strong>. Zuständig ist die hypergeometrische Verteilung.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Wofür steht (n über k) in der Formel?</summary>
          <p>Für die <strong>Anzahl der Pfade</strong> mit genau k Treffern – also auf wie viele
          verschiedene Arten die Treffer verteilt sein können.</p></details>
        <details><summary>Wie groß ist P(genau 2× Kopf) bei 3 Münzwürfen?</summary>
          <p>(3 über 2) · ${frac(1, 2)}³ = 3 · ${frac(1, 8)} = <strong>${frac(3, 8)}</strong></p></details>
        <details><summary>Ist „10 Karten aus einem Skatblatt ziehen“ binomialverteilt?</summary>
          <p>Nein – ohne Zurücklegen ändern sich die Wahrscheinlichkeiten.
          Das ist ein Fall für die hypergeometrische Verteilung.</p></details>
      </div>
    `,

    /* ---------- Hypergeometrische Verteilung ---------- */
    hypergeometrisch: `
      <h2>Die hypergeometrische Verteilung</h2>
      <p>Das Modell für Stichproben aus einer endlichen Menge – vom Lotto bis zur Qualitätskontrolle.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>In einer Urne liegen 4 Treffer- und 6 Nieten-Kugeln. Du ziehst drei Kugeln –
        ohne sie zurückzulegen. Nach der ersten Ziehung sind nur noch 9 Kugeln übrig,
        die Chancen haben sich verschoben.</p>
        <span class="frage">Warum darf man hier nicht binomial rechnen?</span>
      </div>

      <h3>Die Idee: Die Grundmenge schrumpft</h3>
      <p>Bei N Kugeln, davon K Treffer, werden n gezogen. X zählt die gezogenen Treffer.
      Weil nicht zurückgelegt wird, ist p <strong>nicht konstant</strong> – die zentrale
      Voraussetzung der Binomialverteilung ist verletzt.</p>

      <div class="herleitung-box"><span class="box-title">Warum sieht die Formel wie ein Bruch aus Auswahlen aus?</span>
        <p>Man zählt schlicht Möglichkeiten – ganz im Sinne von Laplace:<br>
        <strong>Günstig:</strong> k Treffer aus den K Treffern wählen — (K über k) —
        <em>und</em> die restlichen n−k aus den Nieten — (N−K über n−k). Beides multipliziert.<br>
        <strong>Möglich:</strong> irgendwelche n aus N — (N über n).<br>
        Der Quotient ist P(X = k). Die Formel ist also reine Kombinatorik, keine neue Theorie.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">P(X = k) = (K über k) · (N−K über n−k) ⁄ (N über n)</span></p>
        <p>Erwartungswert wie gewohnt: E(X) = n · K⁄N</p>
        <p>„Mindestens einer“: P(X ≥ 1) = 1 − P(X = 0)&ensp;<span class="trenn">•</span>&ensp;„Höchstens k“: P(X = 0) + … + P(X = k)</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Prüfe: Wird <strong>zurückgelegt</strong>? Wenn nein → hypergeometrisch.</li>
        <li>N (alle), K (Treffer insgesamt), n (Ziehungen), k (gesuchte Treffer) notieren.</li>
        <li>Die drei Binomialkoeffizienten berechnen.</li>
        <li>Günstig durch möglich teilen.</li>
        <li>Bei „mindestens einem“ Treffer das Gegenereignis „kein Treffer“ rechnen und von 1 abziehen;
        bei „höchstens k“ die Fälle 0 bis k addieren – der Nenner bleibt derselbe.</li>
        <li><strong>Kontrolle:</strong> Über alle k summiert muss 1 herauskommen.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Urnen-Frage vom Anfang</span>
        <p>N = 10, K = 4, n = 3, gesucht k = 2<br>
        (4 über 2) = 6&ensp;<span class="trenn">•</span>&ensp;(6 über 1) = 6&ensp;<span class="trenn">•</span>&ensp;(10 über 3) = 120<br>
        P(X = 2) = ${frac('6 · 6', 120)} = ${frac(36, 120)} = <strong>${frac(3, 10)}</strong></p>
      </div>
      <div class="example-box"><span class="ex-title">Alternative über den Baum</span>
        <p>Bei kleinen Aufgaben geht es auch mit der Pfadregel – die Brüche schrumpfen mit:<br>
        P(Treffer, Treffer) = ${frac(4, 10)} · ${frac(3, 9)} = ${frac(12, 90)} = <strong>${frac(2, 15)}</strong><br>
        Gut zu sehen: Nach dem ersten Zug steht im Nenner 9 statt 10.</p>
      </div>
      <div class="example-box"><span class="ex-title">Mini-Lotto</span>
        <p>Beim Lotto „6 aus 49“ gilt N = 49, K = 6 (deine Tipps), n = 6:<br>
        P(6 Richtige) = 1 / (49 über 6) = <strong>1 : 13 983 816</strong><br>
        P(4 Richtige) = (6 über 4) · (43 über 2) / (49 über 6) ≈ 0,00097</p>
      </div>
      <div class="example-box"><span class="ex-title">Mindestens ein Gewinn – über das Gegenereignis</span>
        <p>In einer Lostrommel liegen 9 Lose, davon 2 Gewinnlose. Du ziehst 3. Statt k = 1 und k = 2
        einzeln zu rechnen, nimmst du das Gegenteil „kein Gewinn“:<br>
        P(X = 0) = (7 über 3) / (9 über 3) = ${frac(35, 84)} ≈ 0,417<br>
        P(X ≥ 1) = 1 − ${frac(35, 84)} = ${frac(49, 84)} = <strong>${frac(7, 12)}</strong> ≈ 0,583<br>
        Der direkte Weg ergibt dasselbe: (42 + 7) / 84 – nur mit doppelt so viel Rechnung.</p>
      </div>
      <div class="example-box"><span class="ex-title">Höchstens ein defektes Teil – zwei Fälle addieren</span>
        <p>Eine Lieferung von 10 Teilen enthält 3 defekte, 4 werden geprüft. „Höchstens 1 defektes“
        heißt k = 0 <em>oder</em> k = 1 – beides zählt:<br>
        P(X = 0) = (7 über 4) / (10 über 4) = ${frac(35, 210)}&ensp;<span class="trenn">•</span>&ensp;
        P(X = 1) = (3 über 1) · (7 über 3) / (10 über 4) = ${frac(105, 210)}<br>
        P(X ≤ 1) = ${frac('35 + 105', 210)} = ${frac(140, 210)} = <strong>${frac(2, 3)}</strong> ≈ 0,667<br>
        Der Nenner 210 zählt alle möglichen Stichproben und bleibt stehen – addiert werden nur die Zähler.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th></th><th>Binomial</th><th>Hypergeometrisch</th></tr>
        <tr><td>Ziehen</td><td>mit Zurücklegen</td><td>ohne Zurücklegen</td></tr>
        <tr><td>p pro Zug</td><td>konstant</td><td>ändert sich</td></tr>
        <tr><td>Beispiel</td><td>Würfeln, Münze</td><td>Lotto, Stichprobe, Skat</td></tr>
      </table></div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Jede gezogene Kugel ist mit p = ${frac(6, 49)} eine meiner sechs – also rechne ich
        binomial.“ – Die Kugeln werden aber nicht zurückgelegt.<br>
        <em>Nachgerechnet für sechs Richtige:</em> Binomial ergäbe p⁶ = ${frac('46 656', '13 841 287 201')}
        ≈ 1 : 296 667. Richtig ist 1 : (49 über 6) = <strong>1 : 13 983 816</strong>. Das binomiale
        Modell macht den Hauptgewinn also rund <strong>47-mal wahrscheinlicher</strong>, als er ist –
        weil es unterschlägt, dass nach jedem Treffer eine Trefferkugel weniger im Topf liegt und
        p auf ${frac(5, 48)} sinkt.<br>
        <em>Faustregel für die Praxis:</em> Ist die Stichprobe klein gegenüber der Grundmenge
        (n &lt; 5 % von N), darf man näherungsweise binomial rechnen. Beim Lotto ist sie das mit
        6 von 49 ≈ 12 % gerade nicht – daher der grobe Fehler.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Welche Erkennungsfrage stellst du vor jeder Aufgabe?</summary>
          <p>„Verändert ein Zug die Chancen des nächsten?“ Wenn ja → hypergeometrisch.</p></details>
        <details><summary>10 Kugeln, 4 Treffer, 5 gezogen – wie viele Treffer sind zu erwarten?</summary>
          <p>E(X) = 5 · ${frac(4, 10)} = <strong>2</strong></p></details>
        <details><summary>Warum steht (N−K über n−k) im Zähler?</summary>
          <p>Weil die restlichen Plätze der Stichprobe mit Nieten gefüllt werden müssen –
          auch dafür gibt es mehrere Möglichkeiten, die mitgezählt werden.</p></details>
      </div>
    `,

    /* ---------- Normalverteilung ---------- */
    normalverteilung: `
      <h2>Die Normalverteilung</h2>
      <p>Die Glockenkurve beschreibt unzählige natürliche Merkmale – und ist damit
      die wichtigste stetige Verteilung.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Du schreibst zwei Klausuren: in Mathe 72 Punkte (Schnitt 60, σ = 8),
        in Bio 76 Punkte (Schnitt 70, σ = 4). In Bio hast du absolut mehr Punkte.</p>
        <span class="frage">In welchem Fach warst du im Vergleich zum Kurs besser?</span>
      </div>

      <h3>Die Idee: Häufungen um einen Mittelwert</h3>
      <p>Viele Merkmale (Körpergröße, Messfehler, Testergebnisse) häufen sich um einen Mittelwert
      und werden nach außen seltener. Zwei Zahlen beschreiben die Kurve vollständig:
      <strong>μ</strong> (wo liegt der Gipfel) und <strong>σ</strong> (wie breit ist die Glocke).</p>

      <div class="herleitung-box"><span class="box-title">Warum machen z-Werte Leistungen vergleichbar?</span>
        <p>Ein Rohwert allein sagt nichts – 72 Punkte können großartig oder mittelmäßig sein.
        Entscheidend ist der Abstand zum Mittelwert, <em>gemessen in Standardabweichungen</em>:<br>
        z = (x − μ)/σ.<br>
        Damit rechnet man jede Verteilung auf eine gemeinsame Skala um (μ = 0, σ = 1).
        Erst dadurch werden Mathe- und Bio-Note vergleichbar.</p>
      </div>

      <div class="table-wrap"><table>
        <tr><th>Intervall</th><th>Anteil der Werte</th></tr>
        <tr><td>[μ − σ; μ + σ]</td><td>≈ 68 %</td></tr>
        <tr><td>[μ − 2σ; μ + 2σ]</td><td>≈ 95 %</td></tr>
        <tr><td>[μ − 3σ; μ + 3σ]</td><td>≈ 99,7 %</td></tr>
      </table></div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">z = (x − μ) ⁄ σ&ensp;⇔&ensp;x = μ + z · σ</span></p>
        <p>Sigma-Regeln als Eselsbrücke: <strong>68 – 95 – 99,7</strong></p>
        <p>Wegen der Symmetrie gilt außerdem: P(X ≤ μ) = 50 %</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>μ und σ aus der Aufgabe herauslesen.</li>
        <li>Gesuchten Bereich <strong>skizzieren</strong> – eine Glocke mit Markierungen genügt.</li>
        <li>Prüfen, ob eine Sigma-Regel direkt passt (μ ± σ, ± 2σ, ± 3σ).</li>
        <li>Ist umgekehrt der <strong>Anteil</strong> gegeben, lies die Tabelle rückwärts: 68 % ↔ μ ± σ,
        95 % ↔ μ ± 2σ; 16 % über der Grenze ↔ μ + σ, 2,5 % ↔ μ + 2σ. So findest du die Schranke –
        oder σ: Die halbe Intervallbreite ist σ (68 %), 2σ (95 %) oder 3σ (99,7 %).</li>
        <li>Sonst über z-Wert und Symmetrie argumentieren.</li>
        <li><strong>Kontrolle:</strong> Anteile über 100 % oder unter 0 % sind unmöglich.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">IQ-Test: μ = 100, σ = 15</span>
        <p>≈ 68 % liegen zwischen 85 und 115&ensp;<span class="trenn">•</span>&ensp;≈ 95 % zwischen 70 und 130<br>
        Über 130: außerhalb von 2σ liegen 5 %, davon wegen der Symmetrie die Hälfte oben
        → <strong>≈ 2,5 %</strong><br>
        Vom Anteil zur Anzahl: Bei 1000 Getesteten sind das etwa
        2,5 % · 1000 = <strong>25</strong> Menschen über 130. Das „etwa“ gehört zur Antwort –
        die Sigma-Regeln sind Näherungen.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die halbe Sigma-Regel</span>
        <p>P(X ≤ μ + σ) = 50 % (alles unter μ) + 34 % (halbe 68 %) = <strong>≈ 84 %</strong><br>
        Mit zwei Standardabweichungen genauso: P(X ≤ μ + 2σ) = 50 % + 47,5 % (halbe 95 %) = <strong>≈ 97,5 %</strong><br>
        Und der Streifen allein, ohne die 50 %: zwischen μ und μ + σ liegen <strong>≈ 34 %</strong>,
        zwischen μ und μ + 2σ <strong>≈ 47,5 %</strong>. Halbieren darf man nur, weil die Glocke
        symmetrisch um μ ist – die andere Hälfte des Intervalls liegt spiegelbildlich auf der anderen Seite.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Klausur-Frage vom Anfang</span>
        <p>Mathe: z = (72 − 60)/8 = <strong>1,5</strong><br>
        Bio: z = (76 − 70)/4 = <strong>1,5</strong><br>
        Beide Leistungen sind relativ gesehen exakt gleich stark – je 1,5 σ über dem Schnitt.
        Die höhere Punktzahl in Bio täuscht.</p>
      </div>
      <div class="example-box"><span class="ex-title">Rückwärts: vom z-Wert zum Rohwert</span>
        <p>Die Formel geht auch in die andere Richtung. Welche Punktzahl hätte in Bio z = 2 bedeutet?<br>
        x = μ + z · σ = 70 + 2 · 4 = <strong>78 Punkte</strong><br>
        Und z = −1 in Mathe: x = 60 + (−1) · 8 = 60 − 8 = <strong>52 Punkte</strong><br>
        μ ist der Nullpunkt, σ der Maßstab: z zählt Standardabweichungen, nicht Punkte.
        Deshalb erst z · σ rechnen und dann μ dazu.</p>
      </div>
      <div class="example-box"><span class="ex-title">Die Sigma-Regel rückwärts</span>
        <p>Bisher war der Bereich gegeben und der Anteil gesucht. Die Tabelle liest sich aber
        auch von rechts nach links: Der Anteil verrät, wie viele σ der Bereich nach jeder Seite von μ reicht.<br>
        Hühnereier: μ = 62 g, etwa 95 % wiegen zwischen 54 g und 70 g. Wie groß ist σ?<br>
        95 % gehören zu μ ± 2σ. Halbe Breite: (70 − 54)/2 = 8 g = 2σ → σ = <strong>4 g</strong><br>
        Umgekehrt: Welches Gewicht unterschreiten nur etwa 16 % der Eier?<br>
        Außerhalb von μ ± σ liegen 32 %, davon die Hälfte unten. Die Schranke ist
        μ − σ = 62 − 4 = <strong>58 g</strong><br>
        Probe: 62 ± 2 · 4 = [54; 70] ✓<br>
        Das ist die umgestellte z-Formel von eben: x = μ + z · σ mit z = −1.</p>
      </div>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>„Rund 68 % liegen innerhalb von zwei Standardabweichungen.“ – Die 68 % gelten für
        μ ± <strong>ein</strong> σ; für μ ± 2σ sind es 95 %.<br>
        <em>Was die Verwechslung anrichtet:</em> Beim IQ (μ = 100, σ = 15) liegt 130 genau bei μ + 2σ.
        Mit der falschen Zahl blieben außerhalb 100 % − 68 % = 32 % und oben davon die Hälfte,
        also 16 % – gut jeder sechste Mensch wäre hochbegabt. Richtig sind 100 % − 95 % = 5 % und oben
        <strong>2,5 %</strong>, also jeder vierzigste. Der Fehler überschätzt die Häufigkeit um den
        <strong>Faktor 6,4</strong>.<br>
        Und: Nicht alles ist normalverteilt! Ergibt eine Einkommenserhebung μ = 4000 € und
        σ = 3000 €, dann liegt μ − 2σ bei <strong>−2000 €</strong> – die Sigma-Regel behauptete also,
        2,5 % der Befragten verdienten weniger als −2000 €. Solche Daten sind stark
        <em>rechtsschief</em>; die Glocke passt nicht.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Was bedeutet z = −2?</summary>
          <p>Der Wert liegt <strong>zwei Standardabweichungen unter</strong> dem Mittelwert –
          nur etwa 2,5 % aller Werte sind noch kleiner.</p></details>
        <details><summary>Füllmenge μ = 500 ml, σ = 10 ml. Wie viel Prozent liegen unter 480 ml?</summary>
          <p>480 ml ist μ − 2σ. Außerhalb liegen 5 %, davon unten die Hälfte → <strong>2,5 %</strong>.
          Bei 2000 Flaschen sind das etwa 2,5 % · 2000 = <strong>50</strong> Flaschen.</p></details>
        <details><summary>Warum ist ein großes σ ein Zeichen für Unzuverlässigkeit?</summary>
          <p>Weil die Werte breit streuen – eine Abfüllanlage mit großem σ liefert stark
          schwankende Mengen.</p></details>
      </div>
    `,

    /* ---------- Beschreibende Statistik ---------- */
    deskriptiv: `
      <h2>Beschreibende Statistik auf Uni-Niveau</h2>
      <p>Bevor man testet und schätzt, muss man Daten sauber <em>beschreiben</em> –
      mit Lage- und Streuungsmaßen.</p>

      <div class="einstieg-box"><span class="box-title">Worum geht es?</span>
        <p>Zwei Messreihen: A = (9, 10, 10, 11) und B = (2, 6, 14, 18).
        Beide haben exakt denselben Mittelwert 10.</p>
        <span class="frage">Wie beschreibt man den offensichtlichen Unterschied zwischen ihnen?</span>
      </div>

      <h3>Die Idee: Lage genügt nicht, es braucht Streuung</h3>
      <p><strong>Lagemaße</strong> (Mittelwert, Median, Modus) sagen, wo das Zentrum liegt.
      <strong>Streuungsmaße</strong> (Varianz, Standardabweichung, IQR) sagen, wie weit die Werte
      darum herum verteilt sind. Erst beide zusammen beschreiben Daten vollständig.</p>

      <div class="herleitung-box"><span class="box-title">Warum quadriert man die Abweichungen?</span>
        <p>Die naheliegende Idee wäre, die Abweichungen vom Mittelwert zu mitteln.
        Das scheitert: Ihre Summe ist <strong>immer null</strong>
        (bei A: −1 + 0 + 0 + 1 = 0) – positive und negative heben sich auf.<br>
        Durch das Quadrieren werden alle Abweichungen positiv, große fallen zusätzlich stärker
        ins Gewicht. Damit man wieder die ursprüngliche Einheit erhält, zieht man am Ende
        die Wurzel: die <strong>Standardabweichung</strong> s.</p>
      </div>

      <div class="merkkasten"><span class="merk-title">Merke</span>
        <p><span class="formula">s² = Mittel der quadrierten Abweichungen</span>&ensp;<span class="trenn">•</span>&ensp;s = √s²</p>
        <p><strong>Quartile:</strong> Q1 und Q3 sind die Mediane der unteren bzw. oberen Hälfte.
        IQR = Q3 − Q1 umfasst die mittleren 50 % – die „Box“ im Boxplot.</p>
        <p><em>Klausur-Hinweis:</em> Manche Skripte teilen bei der Stichprobenvarianz durch n − 1
        statt durch n. Prüfe, welche Konvention verlangt ist – hier rechnen wir mit n.</p>
      </div>

      <h3>So gehst du vor</h3>
      <ol class="schritte">
        <li>Daten <strong>sortieren</strong> und einen Überblick verschaffen.</li>
        <li>Mittelwert x̄ berechnen.</li>
        <li>Abweichungen bilden, <strong>quadrieren</strong>, mitteln → s².</li>
        <li>Wurzel ziehen → s (in der Einheit der Daten).</li>
        <li>Für robuste Beschreibung zusätzlich Median und IQR bestimmen.</li>
      </ol>

      <h3>Beispiele</h3>
      <div class="example-box"><span class="ex-title">Die Frage vom Anfang: A gegen B</span>
        <p><strong>A</strong> = (9, 10, 10, 11): Abweichungen −1, 0, 0, 1 → s² = 2/4 = 0,5 → s ≈ <strong>0,71</strong><br>
        <strong>B</strong> = (2, 6, 14, 18): Abweichungen −8, −4, 4, 8 → s² = 160/4 = 40 → s ≈ <strong>6,32</strong><br>
        Gleicher Mittelwert, aber B streut fast neunmal so stark – genau das misst die Standardabweichung.</p>
      </div>
      <div class="example-box"><span class="ex-title">Gewichtetes Mittel</span>
        <p>3 Studierende schreiben 1,0&ensp;<span class="trenn">•</span>&ensp;5 schreiben 2,0&ensp;<span class="trenn">•</span>&ensp;2 schreiben 3,0<br>
        x̄ = ${frac('3 · 1 + 5 · 2 + 2 · 3', 10)} = ${frac(19, 10)} = <strong>1,9</strong><br>
        Jede Note zählt so oft, wie sie vorkommt.</p>
      </div>
      <div class="example-box"><span class="ex-title">Quartile und Boxplot</span>
        <p>Sortiert: 2, 4, 5, <u>7</u>, 9, 12, 15&nbsp;(n = 7)<br>
        Median = 7&ensp;<span class="trenn">•</span>&ensp;untere Hälfte 2, 4, 5 → Q1 = <strong>4</strong>&ensp;<span class="trenn">•</span>&ensp;
        obere Hälfte 9, 12, 15 → Q3 = <strong>12</strong><br>
        IQR = 12 − 4 = <strong>8</strong> → Boxplot-Fünf: 2 | 4 | 7 | 12 | 15</p>
      </div>

      <h3>Robustheit: Wer hält Ausreißer aus?</h3>
      <div class="table-wrap"><table>
        <tr><th>robust</th><th>empfindlich</th></tr>
        <tr><td>Median, Quartile, IQR, Modalwert</td><td>Mittelwert, Varianz, Spannweite</td></tr>
      </table></div>
      <p>Messreihe 10, 11, 12, 13, 44: Der Ausreißer hebt den Mittelwert von 11,5 auf 18 –
      der Median verschiebt sich nur von 11,5 auf 12. Genau deshalb zeigt der Boxplot
      Median und Quartile.</p>

      <h3>Der Modalwert – das dritte Lagemaß</h3>
      <p>Mittelwert und Median bekommen meist die ganze Aufmerksamkeit. Der
      <strong>Modalwert</strong> (auch Modus) ist aber kein Anhängsel: Er ist der Wert mit der
      größten Häufigkeit – und das einzige Lagemaß, das auch bei Daten funktioniert,
      mit denen man gar nicht rechnen kann.</p>
      <p>Eine Umfrage nach dem Lieblingsfach ergibt Mathe 11, Sport 9, Deutsch 7, Kunst 3
      (n = 30). Ein Mittelwert aus „Mathe“ und „Sport“ ist sinnlos, und der Größe nach sortieren
      lassen sich Schulfächer auch nicht – einen Median gibt es hier also ebenso wenig.
      Der Modalwert <strong>Mathe</strong> ist die einzige sinnvolle Antwort auf die Frage nach
      dem Zentrum. Für <em>nominale</em> Merkmale (Farbe, Beruf, Verkehrsmittel) ist er deshalb
      das Lagemaß der Wahl.</p>

      <div class="example-box"><span class="ex-title">Drei Lagemaße, drei verschiedene Antworten</span>
        <p>Geschwisterzahlen in einem Kurs: 12-mal 0&ensp;<span class="trenn">•</span>&ensp;8-mal 1&ensp;<span class="trenn">•</span>&ensp;4-mal 2&ensp;<span class="trenn">•</span>&ensp;einmal 5&nbsp;(n = 25)<br>
        x̄ = ${frac('12 · 0 + 8 · 1 + 4 · 2 + 1 · 5', 25)} = ${frac(21, 25)} = <strong>0,84</strong><br>
        Median = 13. Wert der sortierten Reihe = <strong>1</strong><br>
        Modalwert = <strong>0</strong> – die Null kommt zwölfmal vor, häufiger als jeder andere Wert.<br>
        Alle drei Zahlen sind richtig, sie beantworten nur verschiedene Fragen: „Wie viele im
        Schnitt?“, „Wer steht in der Mitte?“ und „Was kommt am häufigsten vor?“ Kein Kind hat
        0,84 Geschwister – als Beschreibung eines typischen Kurskindes taugt der Mittelwert hier nicht.</p>
      </div>

      <p>Zwei Eigenschaften solltest du noch kennen. Erstens ist der Modalwert <strong>robust</strong>:
      Hätte das Kind aus der Großfamilie statt 5 sogar 9 Geschwister, stiege der Mittelwert von
      0,84 auf 1,00 – Median und Modalwert blieben unverändert bei 1 und 0. Zweitens ist er
      <strong>nicht immer eindeutig</strong>: Kommen zwei Werte <em>am häufigsten</em> und gleich
      oft vor, gibt es zwei Modalwerte. Ob die Verteilung damit <em>zweigipflig</em> ist,
      entscheidet erst das Häufigkeitsbild. Liegen die beiden weit auseinander und fällt die
      Häufigkeit dazwischen ab – bei 1, 1, 2, 3, 3 sind die Häufigkeiten 2, 1, 2 –, dann sind es
      wirklich zwei Gipfel, und meist stecken zwei vermischte Gruppen dahinter, die man besser
      getrennt beschreibt. Stehen die beiden dagegen nebeneinander – bei 1, 1, 2, 2, 3 lauten die
      Häufigkeiten 2, 2, 1 –, geht es nur einmal hoch und wieder herunter: ein einziger, breiter
      Gipfel.</p>

      <div class="achtung-box"><span class="achtung-title">Häufige Fehlvorstellung</span>
        <p>Die Abweichungen einfach addieren statt zu quadrieren – das ergibt immer <strong>null</strong>.<br>
        <em>Rechne es an 4, 6, 8, 10 nach:</em> x̄ = 7, die Abweichungen sind −3, −1, 1, 3.
        Addiert: −3 − 1 + 1 + 3 = <strong>0</strong> – und zwar für <em>jeden</em> Datensatz, denn
        die negativen und die positiven Abweichungen heben sich per Definition des Mittelwerts auf.
        Ein Streuungsmaß, das immer null ist, wäre nutzlos. Erst quadriert bleibt etwas übrig:
        9 + 1 + 1 + 9 = 20, also s² = ${frac(20, 4)} = <strong>5</strong>.<br>
        Und: s² hat die <em>quadrierte</em> Einheit (z. B. cm²), erst s = √5 ≈ 2,24 ist wieder in cm –
        deshalb wird in Berichten meist die Standardabweichung angegeben.</p>
      </div>

      <div class="selbstcheck"><span class="box-title">Verstanden? Prüfe dich selbst</span>
        <details><summary>Berechne s² für 4, 6, 8, 10.</summary>
          <p>x̄ = 7, Abweichungen −3, −1, 1, 3 → Quadrate 9, 1, 1, 9 → s² = 20/4 = <strong>5</strong></p></details>
        <details><summary>Was sagt ein IQR von 0 aus?</summary>
          <p>Die mittleren 50 % der Daten sind <strong>identisch</strong> – die Box im Boxplot
          schrumpft zu einem Strich.</p></details>
        <details><summary>Warum berichten Statistikämter Medianeinkommen statt Durchschnittseinkommen?</summary>
          <p>Weil wenige Spitzenverdiener den Mittelwert stark nach oben ziehen.
          Der Median beschreibt die tatsächliche Mitte der Bevölkerung besser.</p></details>

        <details><summary>Wann ist der Modalwert das einzige brauchbare Lagemaß?</summary>
          <p>Bei <strong>nominalen</strong> Merkmalen – etwa Lieblingsfarbe oder Verkehrsmittel.
          Dort lässt sich weder addieren (kein Mittelwert) noch der Größe nach sortieren
          (kein Median). „Am häufigsten“ bleibt aber sinnvoll.</p></details>
      </div>
    `

  };
})();
