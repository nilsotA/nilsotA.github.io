/* ============================================================
   MatheNils – Illustrationen für die Erklärseiten
   Reine Inline-SVGs, über CSS-Klassen an das Theme angebunden.
   Werden in app.js hinter dem Einleitungsabsatz eingefügt.
   ============================================================ */
'use strict';

const LEARN_FIGURES = (() => {

  function fig(svg, caption) {
    return `<figure class="fig-wrap">${svg}<figcaption class="fig-cap">${caption}</figcaption></figure>`;
  }

  return {

    /* Zahlenstrahl mit negativen Zahlen */
    negative: fig(`
      <svg class="fig" viewBox="0 0 400 90" role="img" aria-label="Zahlenstrahl von minus 5 bis plus 5; ein Bogen führt von minus 3 vier Schritte nach rechts bis plus 1">
        <line x1="15" y1="50" x2="385" y2="50" class="fig-axis"/>
        <polygon points="385,50 375,45 375,55" class="fig-axis-head"/>
        ${[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n, i) => {
          const x = 30 + i * 34;
          return `<line x1="${x}" y1="44" x2="${x}" y2="56" class="fig-axis"/>
                  <text x="${x}" y="74" class="fig-label ${n === 0 ? 'is-accent' : ''}" text-anchor="middle">${n < 0 ? '−' + Math.abs(n) : n}</text>`;
        }).join('')}
        ${/* Teilstriche liegen bei x = 30 + i · 34: −3 ist x = 98, +1 ist x = 234.
             Der Bogen muss genau diese vier Schritte überspannen – das sagt die Bildunterschrift.
             Die Spitze steht senkrecht auf der Endtangente (68 | 32), die Beschriftung sitzt
             über dem Scheitel (166 | 22), damit die Kurve nicht durch die Ziffern läuft. */''}
        <path d="M 98 38 Q 166 6 234 38" class="fig-curve"/>
        <polygon points="234,38 221,37 225,28" class="fig-arrow"/>
        <text x="166" y="16" class="fig-label is-accent" text-anchor="middle">+ 4</text>
      </svg>`,
      'Rechnen als Bewegung: von −3 aus vier Schritte nach rechts landet man bei +1.'),

    /* Bruch als Kreisdiagramm */
    brueche: fig(`
      <svg class="fig" viewBox="0 0 340 150" role="img" aria-label="Kreis in vier Viertel geteilt, drei davon gefüllt">
        <g transform="translate(75,75)">
          <path d="M 0 0 L 0 -58 A 58 58 0 0 1 58 0 Z" class="fig-shape is-filled"/>
          <path d="M 0 0 L 58 0 A 58 58 0 0 1 0 58 Z" class="fig-shape is-filled"/>
          <path d="M 0 0 L 0 58 A 58 58 0 0 1 -58 0 Z" class="fig-shape is-filled"/>
          <path d="M 0 0 L -58 0 A 58 58 0 0 1 0 -58 Z" class="fig-shape"/>
        </g>
        <!-- Die Bildunterschrift stand auf Grundlinie 60, der Zähler (26 px, Grundlinie 88)
             begann bei 62 – beide Kästen berührten sich. Jetzt 9 Einheiten Luft. -->
        <text x="185" y="42" class="fig-label">3 von 4 Stücken</text>
        <g transform="translate(195,80)">
          <text x="20" y="0" class="fig-big" text-anchor="middle">3</text>
          <line x1="4" y1="8" x2="36" y2="8" class="fig-frac-line"/>
          <text x="20" y="34" class="fig-big" text-anchor="middle">4</text>
        </g>
        <text x="242" y="93" class="fig-label">= 0,75 = 75 %</text>
      </svg>`,
      'Zähler (3) zählt die Stücke, Nenner (4) sagt, in wie viele Teile das Ganze geteilt wurde.'),

    /* Winkelsumme im Dreieck */
    winkel: fig(`
      <svg class="fig" viewBox="0 0 340 170" role="img" aria-label="Dreieck mit den Winkeln alpha, beta und gamma">
        <polygon points="40,140 300,140 190,35" class="fig-shape"/>
        <!-- Winkelbögen liegen auf Kreisen UM die Ecke: Start- und Endpunkt sitzen
             auf den beiden Schenkeln, im Abstand des Radius vom Scheitel. -->
        <path d="M 66 140 A 26 26 0 0 0 61.3 125.09" class="fig-arc"/>
        <path d="M 274 140 A 26 26 0 0 1 281.19 122.05" class="fig-arc"/>
        <path d="M 170.34 48.76 A 24 24 0 0 0 207.36 51.57" class="fig-arc"/>
        <!-- Buchstaben auf der Winkelhalbierenden, außerhalb der Bögen -->
        <text x="78" y="132" class="fig-label is-accent" text-anchor="middle">α</text>
        <text x="263" y="130" class="fig-label is-accent" text-anchor="middle">β</text>
        <text x="190" y="78" class="fig-label is-accent" text-anchor="middle">γ</text>
        <text x="170" y="163" class="fig-label" text-anchor="middle">α + β + γ = 180°</text>
      </svg>`,
      'In jedem Dreieck ergeben die drei Innenwinkel zusammen genau 180°.'),

    /* Lineare Funktion mit Steigungsdreieck */
    linfunktion: fig(`
      <svg class="fig" viewBox="0 0 340 220" role="img" aria-label="Gerade im Koordinatensystem mit Steigungsdreieck">
        <line x1="30" y1="190" x2="320" y2="190" class="fig-axis"/>
        <line x1="60" y1="205" x2="60" y2="20" class="fig-axis"/>
        <polygon points="320,190 310,185 310,195" class="fig-axis-head"/>
        <polygon points="60,20 55,30 65,30" class="fig-axis-head"/>
        <text x="316" y="207" class="fig-label">x</text>
        <text x="42" y="28" class="fig-label">y</text>
        <line x1="60" y1="170" x2="290" y2="55" class="fig-curve"/>
        <polyline points="130,135 200,135 200,100" class="fig-tri"/>
        <text x="163" y="152" class="fig-label is-accent" text-anchor="middle">+1</text>
        <text x="214" y="122" class="fig-label is-accent">+m</text>
        <circle cx="60" cy="170" r="5" class="fig-dot"/>
        <text x="72" y="182" class="fig-label">(0 | b)</text>
        <text x="245" y="45" class="fig-label is-accent">f(x) = mx + b</text>
      </svg>`,
      'b ist der Startwert auf der y-Achse, m das Steigungsdreieck: ein Schritt nach rechts, m nach oben.'),

    /* Parabel mit zwei Nullstellen */
    quadratisch: fig(`
      <svg class="fig" viewBox="0 0 340 196" role="img" aria-label="Nach oben geöffnete Parabel, die die x-Achse an zwei Stellen schneidet">
        <line x1="25" y1="140" x2="315" y2="140" class="fig-axis"/>
        <line x1="170" y1="172" x2="170" y2="18" class="fig-axis"/>
        ${/* Die alte Kurve (Q 170 250) hatte ihren Scheitel bei y = 137,5 und
              blieb damit ÜBER der Achse (y = 140) – sie schnitt sie nie, während
              zwei Nullstellen eingezeichnet waren, 52 Einheiten neben der Kurve.
              Jetzt liegt der Scheitel bei y = 162, und die Kurve trifft y = 140
              genau bei x = 123,1 und x = 216,9 – dort sitzen die Punkte. */''}
        <path d="M 55 30 Q 170 294 285 30" class="fig-curve"/>
        <circle cx="123" cy="140" r="5" class="fig-dot"/>
        <circle cx="217" cy="140" r="5" class="fig-dot"/>
        <text x="114" y="161" class="fig-label is-accent">x₁</text>
        <text x="210" y="161" class="fig-label is-accent">x₂</text>
        <text x="170" y="188" class="fig-label" text-anchor="middle">zwei Lösungen: D &gt; 0</text>
      </svg>`,
      'Die Lösungen sind die Schnittpunkte der Parabel mit der x-Achse – zwei, eine oder keine.'),

    /* Flächenformeln */
    flaechen: fig(`
      <svg class="fig" viewBox="0 0 340 165" role="img" aria-label="Rechteck mit den Seiten a und b, Dreieck mit Grundseite g und Höhe h, Kreis mit Radius r">
        <rect x="26" y="36" width="86" height="62" class="fig-shape"/>
        <text x="12" y="71" class="fig-label is-accent">b</text>
        <text x="69" y="114" class="fig-label is-accent" text-anchor="middle">a</text>
        <text x="69" y="134" class="fig-label" text-anchor="middle">A = a · b</text>
        <text x="69" y="153" class="fig-label is-muted" text-anchor="middle">Rechteck</text>
        <polygon points="139,98 225,98 182,36" class="fig-shape"/>
        <line x1="182" y1="36" x2="182" y2="98" class="fig-dash"/>
        <text x="188" y="72" class="fig-label is-accent">h</text>
        <text x="182" y="114" class="fig-label is-accent" text-anchor="middle">g</text>
        <text x="182" y="134" class="fig-label" text-anchor="middle">A = g · h : 2</text>
        <text x="182" y="153" class="fig-label is-muted" text-anchor="middle">Dreieck</text>
        <circle cx="294" cy="67" r="31" class="fig-shape"/>
        <line x1="294" y1="67" x2="325" y2="67" class="fig-dash"/>
        <text x="310" y="61" class="fig-label is-accent" text-anchor="middle">r</text>
        <text x="294" y="134" class="fig-label" text-anchor="middle">A = π · r²</text>
        <text x="294" y="153" class="fig-label is-muted" text-anchor="middle">Kreis</text>
      </svg>`,
      'Beim Dreieck zählt die eingezeichnete Höhe h – nicht die schräge Seite; beim Kreis der Radius r, nicht der Durchmesser.'),

    /* Quader */
    volumen: fig(`
      <svg class="fig" viewBox="0 0 340 165" role="img" aria-label="Quader mit den Kanten a, b und c">
        <polygon points="60,55 190,55 240,25 110,25" class="fig-shape is-top"/>
        <polygon points="60,55 190,55 190,125 60,125" class="fig-shape"/>
        <polygon points="190,55 240,25 240,95 190,125" class="fig-shape is-side"/>
        <text x="125" y="145" class="fig-label is-accent" text-anchor="middle">a</text>
        <text x="42" y="95" class="fig-label is-accent">c</text>
        <text x="222" y="55" class="fig-label is-accent">b</text>
        <text x="290" y="80" class="fig-label" text-anchor="middle">V = a · b · c</text>
      </svg>`,
      'Volumen misst den Inhalt (cm³), die Oberfläche die Summe aller sechs Seitenflächen (cm²).'),

    /* Pythagoras */
    pythagoras: fig(`
      <svg class="fig" viewBox="0 0 340 200" role="img" aria-label="Rechtwinkliges Dreieck mit Katheten a, b und Hypotenuse c">
        <polygon points="55,165 245,165 55,45" class="fig-shape"/>
        <polyline points="55,145 75,145 75,165" class="fig-right-angle"/>
        <text x="150" y="188" class="fig-label is-accent" text-anchor="middle">a (Kathete)</text>
        <text x="45" y="110" class="fig-label is-accent" text-anchor="end">b</text>
        <text x="163" y="97" class="fig-label is-accent">c (Hypotenuse)</text>
        <text x="255" y="60" class="fig-label">a² + b² = c²</text>
      </svg>`,
      'Die Hypotenuse c liegt immer gegenüber dem rechten Winkel und ist die längste Seite.'),

    /* Pyramide, Kegel und Kugel nebeneinander */
    koerper: fig(`
      <svg class="fig" viewBox="0 0 420 205" role="img" aria-label="Drei Körper nebeneinander: eine quadratische Pyramide mit eingezeichneter Höhe h, ein Kegel mit Radius r, Höhe h und Mantellinie s, und eine Kugel mit Radius r; unter jedem Körper steht seine Volumenformel">
        ${/* --- Pyramide: Grundfläche als Parallelogramm wie beim Quader, nicht als Raute.
               Bei der Raute liegt die vordere Kante genau unter der Spitze – die
               gestrichelte Höhe fiel dann mit ihr zusammen und die Figur las sich
               als flaches Dreieck. Mitte der Grundfläche: ((22+92+117+47)/4 |
               (160+160+140+140)/4) = (69,5 | 150), also steht die Spitze (70|52)
               darüber. Das h sitzt links der Höhe, weil rechts die Seitenkante
               bei y = 100 schon auf x ≈ 91 liegt.
               Die verdeckte Kante Spitze → hintere Ecke ist bewusst NICHT gezeichnet:
               Sie läuft bei y = 100 über x ≈ 57,5 und lag damit 1,3 Einheiten neben
               dem h – gemessen, nicht geschätzt. Aus demselben Grund sitzt das h auf
               y = 120 und nicht auf 100: Bei 100 reichte der Kasten bis y = 87,5 hinauf,
               und dort ist die linke Seitenkante schon auf x = 54,2 – 0,5 Einheiten
               neben der Schrift. Weiter unten wird der Keil breiter. Die hintere Ecke zeigen die beiden
               gestrichelten Grundkanten ohnehin. --- */''}
        <text x="70" y="30" class="fig-label is-muted" text-anchor="middle">Pyramide</text>
        <polygon points="22,160 92,160 117,140 47,140" class="fig-shape is-top"/>
        <polygon points="70,52 22,160 92,160" class="fig-shape"/>
        <polygon points="70,52 92,160 117,140" class="fig-shape is-side"/>
        <line x1="47" y1="140" x2="22" y2="160" class="fig-dash"/>
        <line x1="47" y1="140" x2="117" y2="140" class="fig-dash"/>
        <line x1="70" y1="52" x2="70" y2="150" class="fig-dash"/>
        <polyline points="70,140 80,140 80,150" class="fig-right-angle"/>
        <text x="63" y="120" class="fig-label is-accent" text-anchor="end">h</text>
        <text x="70" y="192" class="fig-label" text-anchor="middle">V = ⅓ · G · h</text>

        ${/* --- Kegel: Grundkreis als Ellipse, Spitze bei (210|52).
               Die Mantellinie läuft von (252|150) zur Spitze – bei y = 96 liegt sie
               auf x ≈ 228,9; das Etikett sitzt 16 Einheiten rechts daneben. --- */''}
        <text x="210" y="30" class="fig-label is-muted" text-anchor="middle">Kegel</text>
        <ellipse cx="210" cy="150" rx="42" ry="15" class="fig-shape is-top"/>
        <path d="M 168 150 L 210 52 L 252 150" class="fig-shape"/>
        <line x1="210" y1="52" x2="210" y2="150" class="fig-dash"/>
        <line x1="210" y1="150" x2="252" y2="150" class="fig-curve"/>
        <polyline points="210,140 220,140 220,150" class="fig-right-angle"/>
        <text x="218" y="118" class="fig-label is-accent">h</text>
        <text x="245" y="96" class="fig-label is-accent">s</text>
        <text x="258" y="157" class="fig-label is-accent">r</text>
        <text x="210" y="192" class="fig-label" text-anchor="middle">V = ⅓ · π · r² · h</text>

        ${/* --- Kugel: Der Radius liegt auf der großen Achse der Äquator-Ellipse, dort
               schneidet sie ihn nirgends. Das r steht an der Spitze AUSSERHALB des
               Kreises (x = 392 > 348 + 40): innen bliebe zwischen Radiuslinie und
               Ellipsenbogen nur 12,4 Einheiten – zu wenig für eine 13er-Zeile. --- */''}
        <text x="348" y="30" class="fig-label is-muted" text-anchor="middle">Kugel</text>
        <circle cx="348" cy="105" r="40" class="fig-shape"/>
        <ellipse cx="348" cy="105" rx="40" ry="13" class="fig-dash"/>
        <line x1="348" y1="105" x2="388" y2="105" class="fig-curve"/>
        <circle cx="348" cy="105" r="3" class="fig-dot"/>
        <text x="395" y="110" class="fig-label is-accent">r</text>
        <text x="348" y="192" class="fig-label" text-anchor="middle">V = ⁴⁄₃ · π · r³</text>
      </svg>`,
      'Bei Pyramide und Kegel steht in der Formel die senkrechte Höhe h – nie die schräge Mantellinie s.'),

    /* V-Figur: zwei Strahlen aus Z, geschnitten von zwei Parallelen */
    strahlensaetze: fig(`
      <svg class="fig" viewBox="0 0 400 210" role="img" aria-label="Zwei Strahlen gehen vom Punkt Z aus. Eine erste senkrechte Parallele schneidet sie in A oben und C unten, eine zweite weiter rechts in B oben und D unten. Ein Doppelschrägstrich auf jeder der beiden Geraden zeigt, dass sie zueinander parallel sind">
        ${/* Steigung ±0,24 ab Z(35|105). Die Parallelen liegen 125 und 250 Einheiten
             hinter Z, also ergibt 0,24 · Abstand beide Male eine ganze Zahl (30 und 60):
             A, B, C, D liegen damit exakt auf den Strahlen, nicht nur ungefähr.
             Die erste Fassung hatte 0,28 – da rückten B und D so weit an den oberen
             und unteren Rand, dass für ihre Namen kein Platz blieb (gemessen: 1,1
             Einheiten Abstand zur Linie bei einer Textbox von 9,8 × 15,7). */''}
        <line x1="35" y1="105" x2="335" y2="33" class="fig-axis"/>
        <line x1="35" y1="105" x2="335" y2="177" class="fig-axis"/>
        <line x1="160" y1="68" x2="160" y2="142" class="fig-curve"/>
        <line x1="285" y1="38" x2="285" y2="172" class="fig-curve"/>
        <circle cx="35" cy="105" r="3.5" class="fig-dot"/>
        <circle cx="160" cy="75" r="3.5" class="fig-dot"/>
        <circle cx="160" cy="135" r="3.5" class="fig-dot"/>
        <circle cx="285" cy="45" r="3.5" class="fig-dot"/>
        <circle cx="285" cy="165" r="3.5" class="fig-dot"/>
        <text x="28" y="109" class="fig-label is-accent" text-anchor="end">Z</text>
        <text x="148" y="62" class="fig-label is-accent" text-anchor="end">A</text>
        <text x="148" y="158" class="fig-label is-accent" text-anchor="end">C</text>
        <text x="293" y="28" class="fig-label is-accent">B</text>
        <text x="293" y="192" class="fig-label is-accent">D</text>
        ${/* Doppelschrägstrich auf jeder Geraden – die übliche Kennzeichnung für
             „diese beiden sind parallel“, und die Parallelität ist die Voraussetzung
             beider Sätze. Zwei Vorgänger scheiterten: Doppelhaken lasen sich auf
             senkrechten Linien wie Pfeilspitzen, und das Zeichen ∥ ist bei 13 px nur
             4,5 Einheiten breit – die beiden Striche verschmelzen zu einem. */''}
        <line x1="154" y1="110" x2="162" y2="100" class="fig-arc"/>
        <line x1="158" y1="110" x2="166" y2="100" class="fig-arc"/>
        <line x1="279" y1="110" x2="287" y2="100" class="fig-arc"/>
        <line x1="283" y1="110" x2="291" y2="100" class="fig-arc"/>
        <text x="150" y="26" class="fig-label" text-anchor="middle">ZA : ZB = ZC : ZD</text>
      </svg>`,
      'Zwei Strahlen aus Z, geschnitten von zwei Parallelen: Von der ersten zur zweiten Parallelen gilt auf beiden Strahlen derselbe Faktor.'),

    vektoren: fig(`
      <svg class="fig" viewBox="0 0 470 255" role="img" aria-label="Ein Koordinatensystem mit den Pfeilen a und b, die beide im Ursprung beginnen. Zwei gestrichelte Linien ergänzen sie zu einem Parallelogramm; dessen Diagonale vom Ursprung zur gegenüberliegenden Ecke ist der Summenpfeil a plus b. Rechts daneben steht dieselbe Rechnung als Spaltenvektoren: 6 über 2 plus 3 über 5 ergibt 9 über 7.">
      <!-- Einheit 22, Ursprung (50 | 222). a = (6 | 2) endet bei (182 | 178),
      b = (3 | 5) bei (116 | 112), die Summe (9 | 7) bei (248 | 68). Alle
      Endpunkte liegen damit exakt auf Gitterpunkten, nicht nur ungefähr.
      b war zuerst (1 | 3) und damit so steil, dass zwischen y-Achse und
      Pfeil kein Platz für seinen Namen blieb; er stand dann oberhalb der
      Spitze und las sich wie die Beschriftung der gestrichelten Linie. -->
      <line x1="28" y1="222" x2="250" y2="222" class="fig-axis"/>
      <polygon points="250,222 240,217 240,227" class="fig-axis-head"/>
      <line x1="50" y1="240" x2="50" y2="48" class="fig-axis"/>
      <polygon points="50,48 45,58 55,58" class="fig-axis-head"/>
      <text x="260" y="226" class="fig-label is-muted">x</text>
      <text x="64" y="60" class="fig-label is-muted">y</text>

      <!-- Von der Spitze von a noch einmal b, von der Spitze von b noch einmal a.
      Beide enden im selben Punkt – genau das ist die Aussage der Figur. -->
      <line x1="182" y1="178" x2="248" y2="68" class="fig-dash"/>
      <line x1="116" y1="112" x2="248" y2="68" class="fig-dash"/>

      <line x1="50" y1="222" x2="248" y2="68" class="fig-curve"/>
      <polygon points="248,68 241.1,80.3 234.3,71.7" class="fig-arrow"/>
      <line x1="50" y1="222" x2="182" y2="178" class="fig-curve is-muted"/>
      <polygon points="182,178 172.2,186.5 169,177.1" class="fig-axis-head"/>
      <line x1="50" y1="222" x2="116" y2="112" class="fig-curve is-muted"/>
      <polygon points="116,112 114.1,124.9 105.5,119.7" class="fig-axis-head"/>
      <circle cx="50" cy="222" r="3" class="fig-dot"/>

      <!-- Grau ist gegeben, farbig ist das Ergebnis – in beiden Hälften der Figur
      gleich, deshalb sind auch nur die 9 und die 7 farbig.
      Das a sitzt im Keil zwischen seinem Pfeil und der x-Achse (9,9 bzw. 8,6
      Einheiten Abstand), das b links neben seinem Pfeil (11 zur y-Achse,
      12,2 zum Pfeil). Gemessen, nicht geschätzt. -->
      <text x="160" y="210" class="fig-label" text-anchor="middle">a</text>
      <text x="66" y="160" class="fig-label" text-anchor="middle">b</text>
      <text x="248" y="55" class="fig-label is-accent" text-anchor="middle">a + b</text>

      <!-- Dieselbe Rechnung als Spaltenvektoren. Die Klammern sind Polylinien in
      der Achsenfarbe; die Zahlen stehen 9 Einheiten von ihnen entfernt. Der
      Kontrollpunkt liegt AUSSEN (links der linken, rechts der rechten Linie) –
      bis September 2026 lag er innen, und die Klammern standen als „)6 2(" da. -->
      <text x="372" y="105" class="fig-label is-muted" text-anchor="middle">zeilenweise addieren</text>

      <path d="M 299 118 Q 294 147 299 176" class="fig-axis"/>
      <path d="M 321 118 Q 326 147 321 176" class="fig-axis"/>
      <text x="310" y="140" class="fig-label" text-anchor="middle">6</text>
      <text x="310" y="165" class="fig-label" text-anchor="middle">2</text>

      <text x="341" y="155" class="fig-label is-muted" text-anchor="middle">+</text>

      <path d="M 361 118 Q 356 147 361 176" class="fig-axis"/>
      <path d="M 383 118 Q 388 147 383 176" class="fig-axis"/>
      <text x="372" y="140" class="fig-label" text-anchor="middle">3</text>
      <text x="372" y="165" class="fig-label" text-anchor="middle">5</text>

      <text x="403" y="155" class="fig-label is-muted" text-anchor="middle">=</text>

      <path d="M 423 118 Q 418 147 423 176" class="fig-axis"/>
      <path d="M 445 118 Q 450 147 445 176" class="fig-axis"/>
      <text x="434" y="140" class="fig-label is-accent" text-anchor="middle">9</text>
      <text x="434" y="165" class="fig-label is-accent" text-anchor="middle">7</text>
      </svg>`,
      'Zwei Pfeile spannen ein Parallelogramm auf – seine Diagonale ist ihre Summe. Gezeichnet ist der ebene Fall; im Raum kommt nur eine dritte Zeile dazu.'),

    skalarprodukt: fig(`
      <svg class="fig" viewBox="0 0 420 210" role="img" aria-label="Links zwei Vektoren a und b mit gemeinsamem Anfangspunkt und dem eingeschlossenen Winkel phi, darunter die Formel für das Skalarprodukt. Rechts zwei Vektoren u und v, die einen rechten Winkel bilden; ihr Skalarprodukt ist null.">
      <!-- LINKS: der allgemeine Fall.
      O(60|165); a endet bei (200|125), b bei (110|55). Der Bogen hat den Radius 42
      und beginnt exakt auf den beiden Strahlen: O + 42 · Richtung. Damit liegt er
      auf dem Winkel, den er zeigt, und nicht daneben. -->
      <line x1="60" y1="165" x2="200" y2="125" class="fig-curve is-muted"/>
      <polygon points="200,125 188,127 191,136" class="fig-arrow"/>
      <line x1="60" y1="165" x2="110" y2="55" class="fig-curve is-muted"/>
      <polygon points="110,55 105,66 114,68" class="fig-arrow"/>
      <path d="M 100.4 153.5 A 42 42 0 0 0 77.4 126.8" class="fig-arc"/>
      <circle cx="60" cy="165" r="3.5" class="fig-dot"/>
      <!-- φ sitzt auf der Winkelhalbierenden, 58 Einheiten vom Scheitel: außerhalb des
      Bogens (42), aber noch deutlich innerhalb des Keils. -->
      <text x="104" y="132" class="fig-label is-accent" text-anchor="middle">φ</text>
      <!-- Die Namen stehen je 16 Einheiten SENKRECHT neben ihrem eigenen Schaft,
      nach außen vom Keil weg – innen läge das φ im Weg. -->
      <text x="134" y="165" class="fig-label is-accent" text-anchor="middle">a</text>
      <text x="70" y="108" class="fig-label is-accent" text-anchor="middle">b</text>
      <text x="130" y="200" class="fig-label" text-anchor="middle">a · b = |a| · |b| · cos φ</text>

      <!-- RECHTS: der Sonderfall.
      O(300|165); u = (4 | 1) und v = (−1 | 4), beide mit der Einheit 20 gezeichnet.
      4 · (−1) + 1 · 4 = 0 – die beiden stehen also wirklich senkrecht, der rechte
      Winkel ist nicht nach Augenmaß gesetzt. -->
      <line x1="300" y1="165" x2="380" y2="145" class="fig-curve"/>
      <polygon points="380,145 368,145 371,154" class="fig-arrow"/>
      <line x1="300" y1="165" x2="280" y2="85" class="fig-curve"/>
      <polygon points="280,85 277,97 286,96" class="fig-arrow"/>
      <polyline points="313.6,161.6 310.2,148 296.6,151.4" class="fig-right-angle"/>
      <circle cx="300" cy="165" r="3.5" class="fig-dot"/>
      <text x="344" y="174" class="fig-label is-accent" text-anchor="middle">u</text>
      <text x="276" y="133" class="fig-label is-accent" text-anchor="middle">v</text>
      <text x="330" y="200" class="fig-label" text-anchor="middle">u · v = 0</text>
      </svg>`,
      'Das Skalarprodukt ist genau dann null, wenn die beiden Pfeile einen rechten Winkel einschließen.'),

    geraden: fig(`
      <svg class="fig" viewBox="0 0 420 200" role="img" aria-label="Eine Gerade g, auf der der Stützpunkt P für t gleich 0 und ein zweiter Punkt für t gleich 2 markiert sind. Vom Ursprung O führt der Stützvektor p nach P, von P aus zeigt der Richtungsvektor u die Gerade entlang; nach zwei Schritten u ist der zweite Punkt erreicht. Darunter steht die Gleichung x gleich p plus t mal u.">
      <!-- Zeichenraster: P(140 | 100), Richtungsvektor u auf dem Bildschirm (62 | −16).
      Damit liegen die Punkte zu t = 1 bei (202 | 84) und zu t = 2 bei (264 | 68)
      exakt auf der Geraden – gerechnet, nicht nach Augenmaß gesetzt.
      Die Gerade selbst läuft von t = −0,9 bis t = 3,1 und hat bewusst KEINE
      Pfeilspitze: Eine Gerade hat keine Richtung, nur ihr Richtungsvektor hat eine. -->
      <line x1="84.2" y1="114.4" x2="332.2" y2="50.4" class="fig-curve is-muted"/>

      <!-- Stützvektor p: vom Ursprung O(48 | 160) zum Aufpunkt P. -->
      <line x1="48" y1="160" x2="140" y2="100" class="fig-curve"/>
      <polygon points="140,100 132.4,110.4 127.4,102.8" class="fig-arrow"/>

      <!-- Richtungsvektor u: ein Schritt auf der Geraden, von t = 0 nach t = 1. -->
      <line x1="140" y1="100" x2="202" y2="84" class="fig-curve"/>
      <polygon points="202,84 191.5,91.4 189.3,82.6" class="fig-arrow"/>

      <circle cx="48" cy="160" r="3" class="fig-dot"/>
      <circle cx="140" cy="100" r="3.5" class="fig-dot"/>
      <circle cx="264" cy="68" r="3.5" class="fig-dot"/>

      <!-- Alle Beschriftungen stehen senkrecht zu ihrer eigenen Linie, mindestens
      8 Einheiten von jeder Linie und voneinander entfernt (nachgerechnet).
      Das u steht unter seinem Pfeil, nicht darüber: oben las es sich als
      Fortsetzung der Beschriftung „P (t = 0)“. -->
      <text x="34" y="180" class="fig-label is-muted" text-anchor="middle">O</text>
      <text x="103.6" y="152" class="fig-label is-accent" text-anchor="middle">p</text>
      <text x="126" y="79" class="fig-label" text-anchor="middle">P (t = 0)</text>
      <text x="175.4" y="113.6" class="fig-label is-accent" text-anchor="middle">u</text>
      <text x="272" y="95.75" class="fig-label is-accent" text-anchor="middle">t = 2</text>
      <text x="348" y="44" class="fig-label is-muted" text-anchor="middle">g</text>
      <text x="210" y="190" class="fig-label" text-anchor="middle">g: x = p + t · u</text>
      </svg>`,
      'Der Stützvektor führt zum Startpunkt, der Richtungsvektor gibt die Richtung – der Parameter t läuft die Gerade ab.'),

    ebenen: fig(`
      <svg class="fig" viewBox="0 0 420 255" role="img" aria-label="Ein angedeutetes Koordinatensystem mit den drei Achsen x1, x2 und x3. Daneben liegt die Ebene E als schräges Parallelogramm. In ihr sitzt der Stützpunkt A, von dem die beiden Spannvektoren u und v ausgehen. Senkrecht auf der Ebene steht der Normalenvektor n; der rechte Winkel zwischen n und u ist als kleines Quadrat eingezeichnet. Darunter steht die Koordinatenform n mal x gleich d.">
      <!-- Angedeutetes Koordinatensystem, Ursprung (60 | 200): x₂ nach rechts,
      x₃ nach oben, x₁ schräg nach vorn – die übliche Schrägbilddarstellung.
      Die Achsen sind bewusst kurz. Sie sollen den Raum andeuten und nicht mit
      der Ebene um Aufmerksamkeit streiten. -->
      <line x1="60" y1="200" x2="148" y2="200" class="fig-axis"/>
      <polygon points="148,200 138,196 138,204" class="fig-axis-head"/>
      <line x1="60" y1="200" x2="60" y2="130" class="fig-axis"/>
      <polygon points="60,130 56,140 64,140" class="fig-axis-head"/>
      <line x1="60" y1="200" x2="36" y2="226" class="fig-axis"/>
      <polygon points="36,226 40.2,216.3 45.4,221.1" class="fig-axis-head"/>
      <text x="165" y="205" class="fig-label is-muted" text-anchor="middle">x₂</text>
      <text x="60" y="117" class="fig-label is-muted" text-anchor="middle">x₃</text>
      <text x="20" y="235" class="fig-label is-muted" text-anchor="middle">x₁</text>

      <!-- Die Ebene als Parallelogramm: P1(150|120), P2(330|85), P3(380|160),
      P4(200|195). P2 − P1 = (180 | −35) = P3 − P4 und P4 − P1 = (50 | 75)
      = P3 − P2 – nachgerechnet, nicht nach Augenmaß gelegt. -->
      <polygon points="150,120 330,85 380,160 200,195" class="fig-shape is-top"/>
      <text x="195" y="140" class="fig-label" text-anchor="middle">E</text>

      <!-- Stützpunkt A(245|120). Mit den Anteilen 0,47 und 0,22 der beiden
      Kantenrichtungen liegt er wirklich INNERHALB des Parallelogramms; ebenso
      die Spitzen von u (0,85 / 0,46) und v (0,44 / 0,81). Beide Spannvektoren
      sind absichtlich zu keiner Kante parallel: Sie stehen für eine beliebige
      Richtung in der Ebene, nicht für deren Rand. -->
      <line x1="245" y1="120" x2="325" y2="125" class="fig-curve"/>
      <polygon points="325,125 312.7,128.3 313.2,120.3" class="fig-arrow"/>
      <line x1="245" y1="120" x2="270" y2="165" class="fig-curve"/>
      <polygon points="270,165 258.4,159.4 265.4,155.5" class="fig-arrow"/>

      <!-- Normalenvektor, Richtung (−30 | −85). Der rechte Winkel wird zwischen n
      und u eingezeichnet: 13 Einheiten in beide Richtungen, dann das Quadrat
      geschlossen. -->
      <line x1="245" y1="120" x2="215" y2="35" class="fig-curve"/>
      <polygon points="215,35 222.8,45 215.2,47.6" class="fig-arrow"/>
      <polyline points="257.97,120.81 253.64,108.55 240.67,107.74" class="fig-right-angle"/>
      <circle cx="245" cy="120" r="3.5" class="fig-dot"/>

      <text x="222" y="130" class="fig-label" text-anchor="middle">A</text>
      <text x="292" y="145" class="fig-label is-accent" text-anchor="middle">u</text>
      <text x="240" y="152" class="fig-label is-accent" text-anchor="middle">v</text>
      <text x="198" y="40" class="fig-label is-accent" text-anchor="middle">n</text>

      <text x="300" y="228" class="fig-label" text-anchor="middle">n · x = d</text>
      </svg>`,
      'Zwei Spannvektoren beschreiben die Ebene von innen, der Normalenvektor von außen: Er steht auf jeder Geraden der Ebene senkrecht.'),

    hypothesentest: fig(`
      <svg class="fig" viewBox="0 0 340 205" role="img" aria-label="Säulendiagramm einer Binomialverteilung für n gleich 8 und p gleich einhalb; der hervorgehobene Bereich am rechten Rand umfasst die Trefferzahlen 7 und 8 und trägt zusammen 3,5 Prozent der Wahrscheinlichkeit">
      <rect x="251" y="60" width="60" height="90" class="fig-shape is-top"/>
      <line x1="25" y1="150" x2="320" y2="150" class="fig-axis"/>
      <rect x="45" y="148.5" width="22" height="1.5" class="fig-bar"/>
      <rect x="75" y="138" width="22" height="12" class="fig-bar"/>
      <rect x="105" y="108" width="22" height="42" class="fig-bar"/>
      <rect x="135" y="66" width="22" height="84" class="fig-bar"/>
      <rect x="165" y="45" width="22" height="105" class="fig-bar"/>
      <rect x="195" y="66" width="22" height="84" class="fig-bar"/>
      <rect x="225" y="108" width="22" height="42" class="fig-bar"/>
      <rect x="255" y="138" width="22" height="12" class="fig-bar is-accent"/>
      <rect x="285" y="148.5" width="22" height="1.5" class="fig-bar is-accent"/>
      <text x="56" y="170" class="fig-label is-muted" text-anchor="middle">0</text>
      <text x="86" y="170" class="fig-label is-muted" text-anchor="middle">1</text>
      <text x="116" y="170" class="fig-label is-muted" text-anchor="middle">2</text>
      <text x="146" y="170" class="fig-label is-muted" text-anchor="middle">3</text>
      <text x="176" y="170" class="fig-label is-muted" text-anchor="middle">4</text>
      <text x="206" y="170" class="fig-label is-muted" text-anchor="middle">5</text>
      <text x="236" y="170" class="fig-label is-muted" text-anchor="middle">6</text>
      <text x="266" y="170" class="fig-label is-muted" text-anchor="middle">7</text>
      <text x="296" y="170" class="fig-label is-muted" text-anchor="middle">8</text>
      <text x="138" y="30" class="fig-label" text-anchor="middle">Annahmebereich</text>
      <text x="281" y="30" class="fig-label is-accent" text-anchor="middle">Ā = {7, 8}</text>
      <text x="281" y="50" class="fig-label is-accent" text-anchor="middle">α = 3,5 %</text>
      <text x="170" y="192" class="fig-label" text-anchor="middle">Anzahl der Treffer k</text>
      </svg>`,
      'Der Ablehnungsbereich liegt am Rand der Verteilung: Fällt das Ergebnis dorthin, ist es unter der Nullhypothese zu unwahrscheinlich, um Zufall zu sein.'),

    symmetrie: fig(`
      <svg class="fig" viewBox="0 0 440 205" role="img" aria-label="Links eine achsensymmetrische Figur mit ihrer Spiegelachse und einem Paar Bildpunkten, rechts eine punktsymmetrische Figur mit ihrem Symmetriezentrum Z">
      <!-- Linke Hälfte: Achsensymmetrie.
      Das Fünfeck ist zur Geraden x = 110 symmetrisch (155 spiegelt auf 65,
      die Spitze liegt genau auf der Achse). P und P′ sind zwei Ecken, die
      durch die Spiegelung aufeinander abgebildet werden; die Strichlinie
      zwischen ihnen steht senkrecht auf der Achse, die beiden Querstriche
      markieren die gleich langen Abstände.

      Das Polygon steht VOR der Achse: Zeichnet man die Achse zuerst,
      überdeckt die Füllung des Fünfecks sie – sichtbar blieben nur zwei
      Stummel über dem Dach und unter dem Boden, und die Beschriftung
      „Spiegelachse“ zeigte auf nichts. -->
      <text x="110" y="20" class="fig-label" text-anchor="middle">achsensymmetrisch</text>
      <polygon points="110,45 155,80 155,145 65,145 65,80" class="fig-shape"/>
      <line x1="110" y1="32" x2="110" y2="165" class="fig-dash"/>
      <line x1="65" y1="80" x2="155" y2="80" class="fig-dash"/>
      <path d="M 129.5 75 L 135.5 85" class="fig-axis"/>
      <path d="M 84.5 75 L 90.5 85" class="fig-axis"/>
      <path d="M 110 87 L 117 87 L 117 80" class="fig-right-angle"/>
      <circle cx="155" cy="80" r="4" class="fig-dot"/>
      <circle cx="65" cy="80" r="4" class="fig-dot"/>
      <text x="164" y="76" class="fig-label is-accent">P</text>
      <text x="56" y="76" class="fig-label is-accent" text-anchor="end">P′</text>
      <text x="110" y="190" class="fig-label is-muted" text-anchor="middle">Spiegelachse</text>

      <!-- Rechte Hälfte: Punktsymmetrie.
      Das Parallelogramm ist bewusst schief (weder Raute noch Rechteck) –
      es hat deshalb KEINE Symmetrieachse, aber ein Zentrum. Z(330 | 100)
      ist die Mitte von Q(275 | 135) und Q′(385 | 65) und zugleich die
      Mitte der beiden anderen Ecken. -->
      <text x="330" y="20" class="fig-label" text-anchor="middle">punktsymmetrisch</text>
      <polygon points="275,135 345,145 385,65 315,55" class="fig-shape"/>
      <line x1="275" y1="135" x2="385" y2="65" class="fig-dash"/>
      <circle cx="275" cy="135" r="4" class="fig-dot"/>
      <circle cx="385" cy="65" r="4" class="fig-dot"/>
      <circle cx="330" cy="100" r="4.5" class="fig-arrow"/>
      <text x="262" y="143" class="fig-label is-accent" text-anchor="end">Q</text>
      <text x="398" y="62" class="fig-label is-accent">Q′</text>
      <text x="319" y="88" class="fig-label is-accent" text-anchor="middle">Z</text>
      </svg>`,
      'Bei der Achsenspiegelung klappt die Figur um eine Gerade, bei der Punktspiegelung dreht sie sich um ein Zentrum.'),

    vierecke: fig(`
      <svg class="fig" viewBox="0 0 360 308" role="img" aria-label="Das Haus der Vierecke als Stufenbild. Ganz oben steht das Quadrat. Zwei Pfeile führen von dort nach unten zum Rechteck und zur Raute. Von beiden führen Pfeile weiter zum Parallelogramm, von der Raute außerdem nach rechts zum Drachen. Vom Parallelogramm führt ein letzter Pfeil hinunter zum Trapez. Jeder Kasten zeigt die Form als kleine Skizze über ihrem Namen. Ein Pfeil bedeutet: ist ein Sonderfall von.">
      <!-- Vier Zeilen im Abstand von 80 Einheiten: y = 4, 84, 164, 244, Kastenhöhe 58.
      In jedem Kasten sitzt die Skizze zwischen y+4 und y+24, die Grundlinie des
      Namens liegt bei y+45. Der Textkasten einer 13-px-Zeile ist 15,5 hoch und
      beginnt 12,5 über der Grundlinie, reicht also von y+32,5 bis y+48: 8,5
      Einheiten unter der Skizze, 10 über der Kastenunterkante. Genau diese
      10 Einheiten sind der Abstand zum Ansatz der abgehenden Pfeile. -->

      <!-- Quadrat -->
      <rect x="106" y="4" width="88" height="58" rx="10" class="fig-cell"/>
      <polygon points="140,8 160,8 160,28 140,28" class="fig-shape"/>
      <text x="150" y="49" class="fig-label is-accent" text-anchor="middle">Quadrat</text>

      <!-- Rechteck -->
      <rect x="32" y="84" width="96" height="58" rx="10" class="fig-cell"/>
      <polygon points="64,88 96,88 96,108 64,108" class="fig-shape"/>
      <text x="80" y="129" class="fig-label" text-anchor="middle">Rechteck</text>

      <!-- Raute: bewusst breit und flach (Diagonalen 36 zu 20). Bei gleich langen
      Diagonalen wäre sie ein Quadrat auf der Spitze – und genau das soll die
      Skizze nicht zeigen. -->
      <rect x="182" y="84" width="76" height="58" rx="10" class="fig-cell"/>
      <polygon points="220,88 238,98 220,108 202,98" class="fig-shape"/>
      <text x="220" y="129" class="fig-label" text-anchor="middle">Raute</text>

      <!-- Parallelogramm: Grundseite 34, Schräge 14 bei Höhe 20. Wäre die Schräge
      so lang wie die Grundseite, stünde hier eine Raute. -->
      <rect x="45" y="164" width="130" height="58" rx="10" class="fig-cell"/>
      <polygon points="86,188 100,168 134,168 120,188" class="fig-shape"/>
      <text x="110" y="209" class="fig-label" text-anchor="middle">Parallelogramm</text>

      <!-- Drachen: oben zwei kurze, unten zwei lange Seiten. Die erste Fassung war
      fast so hoch wie breit und sah damit aus wie die Raute eine Zeile darüber –
      der Unterschied zwischen beiden ist aber genau das Thema. -->
      <rect x="255" y="164" width="90" height="58" rx="10" class="fig-cell"/>
      <polygon points="300,168 312,173 300,188 288,173" class="fig-shape"/>
      <text x="300" y="209" class="fig-label" text-anchor="middle">Drachen</text>

      <!-- Trapez: links 4, rechts 10 Einheiten Überstand. Symmetrisch gezeichnet
      wäre es ein gleichschenkliges Trapez – schon wieder ein Sonderfall. -->
      <rect x="68" y="244" width="84" height="58" rx="10" class="fig-cell"/>
      <polygon points="92,268 96,248 118,248 128,268" class="fig-shape"/>
      <text x="110" y="289" class="fig-label" text-anchor="middle">Trapez</text>

      <!-- Die Pfeile zeigen nach unten: vom Besonderen zum Allgemeinen.
      Sie setzen an der Unterkante des einen Kastens an und enden an der
      Oberkante des nächsten, 10 beziehungsweise 32,5 Einheiten von der
      nächsten Beschriftung entfernt. Die beiden Pfeile eines Kastens starten
      um 15 Einheiten versetzt, sonst lägen ihre Schäfte übereinander. -->
      <line x1="135" y1="62" x2="88.4" y2="80.7" class="fig-branch"/>
      <polygon points="80,84 86.6,76.4 90.1,84.9" class="fig-arrow"/>
      <line x1="165" y1="62" x2="211.6" y2="80.7" class="fig-branch"/>
      <polygon points="220,84 209.9,84.9 213.4,76.4" class="fig-arrow"/>
      <line x1="80" y1="142" x2="89.9" y2="156.6" class="fig-branch"/>
      <polygon points="95,164 86.1,159.2 93.7,154" class="fig-arrow"/>
      <line x1="205" y1="142" x2="143.6" y2="161.3" class="fig-branch"/>
      <polygon points="135,164 142.2,156.9 145,165.7" class="fig-arrow"/>
      <line x1="235" y1="142" x2="291.5" y2="161.1" class="fig-branch"/>
      <polygon points="300,164 290,165.5 292.9,156.8" class="fig-arrow"/>
      <line x1="110" y1="222" x2="110" y2="235" class="fig-branch"/>
      <polygon points="110,244 105.4,235 114.6,235" class="fig-arrow"/>

      <!-- Legende in der freien Ecke rechts unten, auf der Grundlinie des Trapez-Namens.
      Sie beginnt bei x = 180, also 47,7 Einheiten rechts von dessen Textkasten. -->
      <text x="180" y="289" class="fig-label is-muted">Pfeil: ist ein Sonderfall von</text>
      </svg>`,
      'Das Haus der Vierecke: Jede Stufe erbt alle Eigenschaften der Stufen unter ihr – ein Quadrat ist auch ein Rechteck.'),

    /* Trigonometrie */
    trigonometrie: fig(`
      <svg class="fig" viewBox="0 0 360 195" role="img" aria-label="Rechtwinkliges Dreieck mit den Winkeln alpha und beta, benannten Seiten und den Seitenbuchstaben a, b und c">
        <polygon points="50,160 270,160 270,50" class="fig-shape"/>
        <polyline points="250,160 250,140 270,140" class="fig-right-angle"/>
        <!-- Beide Bogenenden liegen exakt 38 vom Scheitel (50|160) entfernt,
             das Ende (84|143) genau auf der Hypotenuse: der Bogen zeigt damit
             die vollen 26,57° des Winkels statt vorher 23,81°. -->
        <path d="M 88 160 A 38 38 0 0 0 84 143" class="fig-arc"/>
        <!-- α sitzt jetzt auf der Winkelhalbierenden, 51 Einheiten vom Scheitel:
             außerhalb des Bogens (r = 38), aber sicher innerhalb des Keils.
             Vorher lag es bei x = 64 über der Hypotenuse, die es durchschnitt. -->
        <text x="100" y="152" class="fig-label is-accent" text-anchor="middle">α</text>
        <!-- β am oberen Scheitel (270|50): beide Bogenenden 30 davon entfernt,
             (270|80) auf der senkrechten Kathete, (243|63) auf der Hypotenuse.
             Die Beschriftung sitzt 42 vom Scheitel auf der Winkelhalbierenden –
             außerhalb des Bogens, 13 Einheiten neben der Hypotenuse.
             Ohne β zeigt die Figur die halbe Aussage: Erst der zweite Winkel
             macht sichtbar, dass die Namen wechseln und die Buchstaben nicht. -->
        <path d="M 270 80 A 30 30 0 0 1 243 63" class="fig-arc"/>
        <text x="248" y="90" class="fig-label is-accent" text-anchor="middle">β</text>
        <text x="160" y="182" class="fig-label" text-anchor="middle">Ankathete b</text>
        <text x="288" y="105" class="fig-label" text-anchor="middle" transform="rotate(-90 288 105)">Gegenkathete a</text>
        <text x="140" y="94" class="fig-label" transform="rotate(-26 140 94)">Hypotenuse c</text>
      </svg>`,
      'Von α aus gesehen ist a die Gegenkathete und b die Ankathete – von β aus tauschen die beiden ihre Namen. Die Buchstaben bleiben, sie gehören zum jeweils gegenüberliegenden Winkel.'),

    /* Baumdiagramm */
    wahrscheinlichkeit: fig(`
      <svg class="fig" viewBox="0 0 360 190" role="img" aria-label="Zweistufiges Baumdiagramm">
        <circle cx="40" cy="95" r="6" class="fig-dot"/>
        <line x1="46" y1="95" x2="150" y2="45" class="fig-branch"/>
        <line x1="46" y1="95" x2="150" y2="145" class="fig-branch"/>
        <text x="88" y="58" class="fig-label is-accent">p</text>
        <text x="88" y="140" class="fig-label is-accent">1−p</text>
        <circle cx="156" cy="45" r="6" class="fig-dot"/>
        <circle cx="156" cy="145" r="6" class="fig-dot"/>
        <!-- Zweite Stufe 10 Einheiten kürzer, Beschriftungen 12 nach links:
             „Treffer, Treffer“ ist die längste Zeile (rund 99 Einheiten) und stand
             sonst bündig am rechten Rand der viewBox (360). -->
        <line x1="162" y1="45" x2="252" y2="20" class="fig-branch"/>
        <line x1="162" y1="45" x2="252" y2="72" class="fig-branch"/>
        <line x1="162" y1="145" x2="252" y2="118" class="fig-branch"/>
        <line x1="162" y1="145" x2="252" y2="170" class="fig-branch"/>
        <text x="260" y="25" class="fig-label">Treffer, Treffer</text>
        <text x="260" y="77" class="fig-label">Treffer, Niete</text>
        <text x="260" y="123" class="fig-label">Niete, Treffer</text>
        <text x="260" y="175" class="fig-label">Niete, Niete</text>
      </svg>`,
      'Entlang eines Pfades wird multipliziert, mehrere Pfade zum selben Ziel werden addiert.'),

    /* Exponentielles Wachstum */
    wachstum: fig(`
      <svg class="fig" viewBox="0 0 340 190" role="img" aria-label="Vergleich von linearem und exponentiellem Wachstum">
        <line x1="35" y1="160" x2="320" y2="160" class="fig-axis"/>
        <line x1="35" y1="175" x2="35" y2="20" class="fig-axis"/>
        <line x1="35" y1="150" x2="300" y2="95" class="fig-line-2"/>
        <path d="M 35 152 Q 200 148 295 25" class="fig-curve"/>
        <!-- unter die Gerade gesetzt: bei x = 243 lag die Beschriftung nur gut 4
             Einheiten unter der Exponentialkurve (y = 79,2), aber 23 über der
             Geraden (y = 106,8) – sie beschriftete optisch die falsche Linie. -->
        <text x="252" y="122" class="fig-label is-muted">linear</text>
        <!-- rechtsbündig vor der Kurve: linksbündig bei x = 196 endete das Wort
             bei x ≈ 276 und stieß an die Kurve (auf Höhe der Schrift x ≈ 273–289). -->
        <text x="262" y="46" text-anchor="end" class="fig-label is-accent">exponentiell</text>
        <text x="310" y="176" class="fig-label">Zeit</text>
      </svg>`,
      'Linear wächst um denselben Betrag, exponentiell um denselben Faktor – und zieht rasant davon.'),

    /* Ableitung als Tangentensteigung */
    ableitungen: fig(`
      <svg class="fig" viewBox="0 0 340 190" role="img" aria-label="Kurve mit Tangente in einem Punkt">
        <line x1="30" y1="160" x2="320" y2="160" class="fig-axis"/>
        <line x1="55" y1="175" x2="55" y2="20" class="fig-axis"/>
        <path d="M 60 150 Q 150 145 200 100 T 300 30" class="fig-curve"/>
        <!-- Berührpunkt liegt jetzt auf der Kurve: (200|100) ist der Nahtpunkt der
             beiden Bézier-Stücke. Die Kurvensteigung ist dort −0,9, deshalb 120 nach
             rechts und 108 nach oben – nur so ist die Gerade wirklich Tangente. -->
        <line x1="140" y1="154" x2="260" y2="46" class="fig-tangent"/>
        <circle cx="200" cy="100" r="6" class="fig-dot"/>
        <!-- Lot vom Kurvenpunkt auf die Achse: x ist die Stelle, der Punkt liegt auf
             der Kurve. Die Erklärseite spricht von „an genau dieser Stelle“. -->
        <line x1="200" y1="106" x2="200" y2="160" class="fig-dash"/>
        <text x="200" y="176" class="fig-label" text-anchor="middle">Stelle x</text>
        <!-- 28 Einheiten tiefer: vorher schnitt die Kurve bei x ≈ 250 bis 267 quer
             durch das Wort „Tangente“. -->
        <text x="245" y="88" class="fig-label is-accent">Tangente</text>
        <text x="245" y="108" class="fig-label is-accent">Steigung f′(x)</text>
      </svg>`,
      'Die Ableitung f′(x) ist die Steigung der Tangente – also wie steil die Kurve an dieser Stelle ist.'),

    /* Integral als Fläche */
    integrale: fig(`
      <svg class="fig" viewBox="0 0 340 190" role="img" aria-label="Fläche unter einer Kurve zwischen a und b">
        <!-- Die Oberkante der Fläche ist jetzt exakt das Kurvenstück zwischen a und b.
             Ein Teilbogen einer quadratischen Bézier-Kurve braucht einen eigenen
             Kontrollpunkt (de Casteljau): (165,5|82,3) statt des ungeteilten (170|78). -->
        <path d="M 90 150 L 90 118.3 Q 165.5 82.3 250 50.3 L 250 150 Z" class="fig-area"/>
        <line x1="30" y1="150" x2="320" y2="150" class="fig-axis"/>
        <line x1="55" y1="170" x2="55" y2="20" class="fig-axis"/>
        <path d="M 60 133 Q 170 78 300 32" class="fig-curve"/>
        <line x1="90" y1="150" x2="90" y2="118.3" class="fig-dash"/>
        <line x1="250" y1="150" x2="250" y2="50.3" class="fig-dash"/>
        <text x="90" y="170" class="fig-label is-accent" text-anchor="middle">a</text>
        <text x="250" y="170" class="fig-label is-accent" text-anchor="middle">b</text>
        <text x="170" y="128" class="fig-label" text-anchor="middle">Fläche</text>
      </svg>`,
      'Das bestimmte Integral misst genau diese Fläche: F(b) − F(a).'),

    /* Binomialverteilung als Säulen */
    binomial: fig(`
      <svg class="fig" viewBox="0 0 340 180" role="img" aria-label="Säulendiagramm einer Binomialverteilung">
        <line x1="30" y1="150" x2="320" y2="150" class="fig-axis"/>
        ${[1.4, 11.4, 40, 80, 100, 80, 40, 11.4, 1.4].map((h, i) => {
          /* Höhen exakt proportional zu P(X = k) für n = 8 und p = 0,5 – die Achse
             k = 0…8 und die Akzentsäule bei E(X) = n · p = 4 legen beides fest.
             C(8,k) = 1, 8, 28, 56, 70, 56, 28, 8, 1, geteilt durch 70 und mal 100.
             Die Randsäulen bleiben deshalb winzig: P(X = 0) = 0,39 %. */
          const x = 45 + i * 30;
          return `<rect x="${x}" y="${150 - h}" width="22" height="${h}" class="fig-bar ${i === 4 ? 'is-accent' : ''}"/>
                  <text x="${x + 11}" y="167" class="fig-label is-muted" text-anchor="middle">${i}</text>`;
        }).join('')}
        <text x="170" y="24" class="fig-label" text-anchor="middle">Anzahl der Treffer k</text>
      </svg>`,
      'Die Wahrscheinlichkeiten häufen sich um den Erwartungswert E(X) = n · p (hier die mittlere Säule).'),

    /* Normalverteilung */
    normalverteilung: fig(`
      <svg class="fig" viewBox="0 0 360 190" role="img" aria-label="Glockenkurve; der markierte Bereich von my minus sigma bis my plus sigma enthält 68 Prozent der Werte">
        ${/* Echte Gaußkurve: μ = 180, σ = 42, Gipfelhöhe 125 über der Achse (y = 150),
              gezeichnet von μ−3σ = 54 bis μ+3σ = 306. Die sechs Bézier-Stücke sitzen bei
              z = −3, −2, −1, 0 und gespiegelt; Abweichung von der exakten Dichte < 0,6.
              Fläche und σ-Striche benutzen dieselben Punkte wie die Kurve – nur so liegt
              die Tönung wirklich unter der Kurve und trifft μ ± σ dort, wo die Dichte noch
              60,7 % des Gipfels beträgt (y = 74,2). Der Streifen ist dann 68 % der Fläche. */''}
        <path d="M 138 150 L 138 74.2 C 152 48.9 166 25 180 25 C 194 25 208 48.9 222 74.2 L 222 150 Z" class="fig-area"/>
        <line x1="25" y1="150" x2="335" y2="150" class="fig-axis"/>
        <path d="M 54 148.6 C 68 147.2 82 144.4 96 133.1 C 110 121.8 124 99.5 138 74.2 C 152 48.9 166 25 180 25 C 194 25 208 48.9 222 74.2 C 236 99.5 250 121.8 264 133.1 C 278 144.4 292 147.2 306 148.6" class="fig-curve"/>
        ${/* Die Mittellinie ist unterbrochen, wo „68 %“ steht (Kasten y = 107…122) –
             sonst läuft sie mitten durch die Schrift. Acht Einheiten Luft nach oben
             und unten. */''}
        <line x1="180" y1="150" x2="180" y2="130" class="fig-dash"/>
        <line x1="180" y1="99" x2="180" y2="25" class="fig-dash"/>
        <line x1="138" y1="150" x2="138" y2="74.2" class="fig-dash"/>
        <line x1="222" y1="150" x2="222" y2="74.2" class="fig-dash"/>
        <text x="180" y="169" class="fig-label is-accent" text-anchor="middle">μ</text>
        <text x="138" y="169" class="fig-label" text-anchor="middle">μ−σ</text>
        <text x="222" y="169" class="fig-label" text-anchor="middle">μ+σ</text>
        <text x="180" y="119" class="fig-label" text-anchor="middle">68 %</text>
      </svg>`,
      'Die Sigma-Regeln: 68 % der Werte liegen im Bereich μ ± σ, 95 % innerhalb von μ ± 2σ.'),

    /* Boxplot */
    deskriptiv: fig(`
      <svg class="fig" viewBox="0 0 360 150" role="img" aria-label="Boxplot mit Median und Quartilen">
        <line x1="45" y1="70" x2="120" y2="70" class="fig-whisker"/>
        <line x1="240" y1="70" x2="315" y2="70" class="fig-whisker"/>
        <line x1="45" y1="52" x2="45" y2="88" class="fig-whisker"/>
        <line x1="315" y1="52" x2="315" y2="88" class="fig-whisker"/>
        <rect x="120" y="42" width="120" height="56" class="fig-shape"/>
        <line x1="175" y1="42" x2="175" y2="98" class="fig-median"/>
        <text x="45" y="122" class="fig-label is-muted" text-anchor="middle">Min</text>
        <text x="120" y="122" class="fig-label" text-anchor="middle">Q1</text>
        <text x="175" y="122" class="fig-label is-accent" text-anchor="middle">Median</text>
        <text x="240" y="122" class="fig-label" text-anchor="middle">Q3</text>
        <text x="315" y="122" class="fig-label is-muted" text-anchor="middle">Max</text>
        <text x="180" y="26" class="fig-label" text-anchor="middle">Box = mittlere 50 % der Daten (IQR)</text>
      </svg>`,
      'Der Boxplot zeigt fünf Kennwerte auf einen Blick – robust gegenüber Ausreißern.'),

    /* Vierfeldertafel / bedingte Wahrscheinlichkeit */
    bedingte: fig(`
      <svg class="fig" viewBox="0 0 340 165" role="img" aria-label="Vierfeldertafel; die Spalte B ist hervorgehoben">
        ${/* Die Bedingung B ist die ganze linke Spalte (y = 35 bis 135) – die Tönung liegt
              deshalb über beiden B-Feldern und nicht nur über A ∩ B, sonst markiert das Bild
              den Zähler, während die Bildzeile vom Nenner spricht. Sie steht vor den Linien,
              damit das Raster darüber sichtbar bleibt. Welcher Teil der Spalte günstig ist,
              zeigt die Akzentfarbe der Beschriftung „A ∩ B“. */''}
        <rect x="70" y="35" width="100" height="100" class="fig-cell"/>
        <rect x="70" y="35" width="200" height="100" class="fig-grid"/>
        <line x1="170" y1="35" x2="170" y2="135" class="fig-grid-line"/>
        <line x1="70" y1="85" x2="270" y2="85" class="fig-grid-line"/>
        <text x="120" y="66" class="fig-label is-accent" text-anchor="middle">A ∩ B</text>
        <text x="220" y="66" class="fig-label is-muted" text-anchor="middle">A ∩ B̄</text>
        <text x="120" y="116" class="fig-label is-muted" text-anchor="middle">Ā ∩ B</text>
        <text x="220" y="116" class="fig-label is-muted" text-anchor="middle">Ā ∩ B̄</text>
        <text x="120" y="26" class="fig-label" text-anchor="middle">B</text>
        <text x="220" y="26" class="fig-label" text-anchor="middle">B̄</text>
        <text x="58" y="66" class="fig-label" text-anchor="end">A</text>
        <text x="58" y="116" class="fig-label" text-anchor="end">Ā</text>
        <text x="170" y="155" class="fig-label is-muted" text-anchor="middle">P(A|B): nur noch die linke Spalte zählt</text>
      </svg>`,
      'Die Bedingung B schränkt den Blick auf eine Spalte ein – dort wird neu „auf 100 %“ gerechnet.'),

    /* Rangfolge der Rechenarten */
    grundrechenarten: fig(`
      <svg class="fig" viewBox="0 0 360 180" role="img" aria-label="Rangfolge: Klammern, Punktrechnung, Strichrechnung">
        ${[['Klammern zuerst', '( )'], ['Punktrechnung', '· :'], ['Strichrechnung', '+ −']].map((z, i) => {
          const y = 16 + i * 55;
          return `<rect x="20" y="${y}" width="320" height="44" rx="13" class="fig-cell"/>
                  <circle cx="50" cy="${y + 22}" r="15" class="fig-dot"/>
                  <text x="50" y="${y + 27}" class="fig-num" text-anchor="middle">${i + 1}</text>
                  <text x="80" y="${y + 28}" class="fig-label">${z[0]}</text>
                  <text x="300" y="${y + 28}" class="fig-label is-accent" text-anchor="middle">${z[1]}</text>`;
        }).join('')}
      </svg>`,
      'KlaPuStri: von oben nach unten abarbeiten – innerhalb einer Stufe von links nach rechts.'),

    /* Primfaktorbaum */
    teilbarkeit: fig(`
      <svg class="fig" viewBox="0 0 380 212" role="img" aria-label="Primfaktorbaum: 60 wird schrittweise in 2 · 2 · 3 · 5 zerlegt">
        <line x1="175" y1="35" x2="128" y2="68" class="fig-branch"/>
        <line x1="188" y1="35" x2="240" y2="68" class="fig-branch"/>
        <line x1="238" y1="98" x2="200" y2="128" class="fig-branch"/>
        <line x1="252" y1="98" x2="298" y2="128" class="fig-branch"/>
        <line x1="292" y1="158" x2="256" y2="188" class="fig-branch"/>
        <line x1="306" y1="158" x2="342" y2="188" class="fig-branch"/>
        <text x="180" y="28" class="fig-big" text-anchor="middle">60</text>
        <text x="245" y="92" class="fig-big" text-anchor="middle">30</text>
        <text x="300" y="152" class="fig-big" text-anchor="middle">15</text>
        <text x="118" y="80" class="fig-big is-accent" text-anchor="middle">2</text>
        <text x="190" y="142" class="fig-big is-accent" text-anchor="middle">2</text>
        <text x="248" y="200" class="fig-big is-accent" text-anchor="middle">3</text>
        <text x="350" y="200" class="fig-big is-accent" text-anchor="middle">5</text>
        <text x="55" y="150" class="fig-label" text-anchor="middle">60 =</text>
        <text x="58" y="174" class="fig-label is-accent" text-anchor="middle">2 · 2 · 3 · 5</text>
      </svg>`,
      'Immer wieder durch die kleinste Primzahl teilen – die farbigen Blätter sind die Primfaktoren.'),

    /* Stellenwerttafel */
    dezimalzahlen: fig(`
      <svg class="fig" viewBox="0 0 380 165" role="img" aria-label="Stellenwerttafel der Zahl 3,472">
        ${/* fig-cell hat keine Kontur: Die Tönung des Einers wird darum separat gezeichnet,
             den Rahmen bekommen alle vier Felder – sonst fehlt der ersten Spalte der Tafel die Wand. */''}
        <rect x="28" y="52" width="76" height="52" rx="10" class="fig-cell"/>
        ${[['Einer', '3', 66], ['Zehntel', '4', 152], ['Hundertstel', '7', 238], ['Tausendstel', '2', 324]].map(([n, z, x]) =>
          `<rect x="${x - 38}" y="52" width="76" height="52" rx="10" class="fig-grid"/>
           <text x="${x}" y="44" class="fig-label is-muted" text-anchor="middle">${n}</text>
           <text x="${x}" y="90" class="fig-big" text-anchor="middle">${z}</text>`).join('')}
        ${/* Ein Komma hängt an der Grundlinie – dieselbe wie die Ziffern (y = 90). */''}
        <text x="109" y="90" class="fig-big is-accent" text-anchor="middle">,</text>
        <text x="190" y="140" class="fig-label" text-anchor="middle">3,472 = 3 + 0,4 + 0,07 + 0,002</text>
      </svg>`,
      'Jede Stelle hinter dem Komma ist zehnmal kleiner als die Stelle davor.'),

    /* Einheiten-Treppe */
    einheiten: fig(`
      <svg class="fig" viewBox="0 0 380 195" role="img" aria-label="Einheitentreppe von Meter bis Millimeter">
        ${['m', 'dm', 'cm', 'mm'].map((e, i) => {
          const x = 20 + i * 86, y = 46 + i * 32;
          return `<rect x="${x}" y="${y}" width="84" height="${172 - y}" class="fig-cell"/>
                  <text x="${x + 42}" y="${y + 24}" class="fig-big" text-anchor="middle">${e}</text>`;
        }).join('')}
        ${[0, 1, 2].map(i => `<text x="${20 + i * 86 + 90}" y="${40 + i * 32}" class="fig-label is-accent">· 10</text>`).join('')}
        <line x1="20" y1="172" x2="362" y2="172" class="fig-axis"/>
        ${/* Höher gesetzt: Auf y = 26 überschnitt die Zeile das erste „· 10“. */''}
        ${/* Kommas statt Malpunkte: „·“ bedeutet in dieser Figur dreimal „mal 10“ und darf
             nicht gleichzeitig als Aufzählungstrenner auftreten. */''}
        <text x="20" y="18" class="fig-label is-muted">1 km = 1000 m, 1 t = 1000 kg, 1 h = 60 min</text>
      </svg>`,
      'Eine Stufe hinunter (in die kleinere Einheit) heißt · 10, eine Stufe hinauf : 10.'),

    /* Dreisatz-Schema */
    dreisatz: fig(`
      <svg class="fig" viewBox="0 0 380 185" role="img" aria-label="Dreisatz: 3 Brötchen kosten 1,20 Euro; geteilt durch 3 kostet 1 Brötchen 0,40 Euro; mal 7 kosten 7 Brötchen 2,80 Euro">
        ${[['3 Brötchen', '1,20 €', 35], ['1 Brötchen', '0,40 €', 100], ['7 Brötchen', '2,80 €', 165]].map(([l, r, y], i) =>
          `<text x="35" y="${y}" class="fig-label ${i === 1 ? 'is-muted' : ''}">${l}</text>
           <line x1="145" y1="${y - 5}" x2="240" y2="${y - 5}" class="fig-dash"/>
           <text x="255" y="${y}" class="fig-label ${i === 2 ? 'is-accent' : ''}">${r}</text>`).join('')}
        ${/* „3 Brötchen“ ist in Inter 13 px rund 68 Einheiten breit und reicht bis x ≈ 103.
             Die Pfeile stehen deshalb in der freien Spalte zwischen Text (103) und Strichellinie (145). */''}
        <path d="M 124 45 L 124 82" class="fig-branch"/>
        <polygon points="124,90 119,78 129,78" class="fig-arrow"/>
        <path d="M 124 110 L 124 147" class="fig-branch"/>
        <polygon points="124,155 119,143 129,143" class="fig-arrow"/>
        <text x="133" y="70" class="fig-label is-accent">: 3</text>
        <text x="133" y="135" class="fig-label is-accent">· 7</text>
        ${/* Spiegelbild zur linken Spalte: Der Dreisatz rechnet in beiden Spalten gleichzeitig,
             ohne Pfeil hängen die Operationen rechts in der Luft. „1,20 €“ endet bei x ≈ 293. */''}
        <path d="M 305 45 L 305 82" class="fig-branch"/>
        <polygon points="305,90 300,78 310,78" class="fig-arrow"/>
        <path d="M 305 110 L 305 147" class="fig-branch"/>
        <polygon points="305,155 300,143 310,143" class="fig-arrow"/>
        <text x="315" y="70" class="fig-label is-accent">: 3</text>
        <text x="315" y="135" class="fig-label is-accent">· 7</text>
      </svg>`,
      'Erst auf eine Einheit herunterrechnen, dann auf die gesuchte Menge hoch.'),

    /* Prozentstreifen */
    prozent: fig(`
      <svg class="fig" viewBox="0 0 380 160" role="img" aria-label="Prozentstreifen mit 30 Prozent markiert">
        <rect x="35" y="62" width="310" height="46" rx="8" class="fig-grid"/>
        <!-- Nur links gerundet (wie der Streifen selbst), rechts bündig auf der 30-%-Marke x = 128 -->
        <path d="M 43 62 L 128 62 L 128 108 L 43 108 A 8 8 0 0 1 35 100 L 35 70 A 8 8 0 0 1 43 62 Z" class="fig-cell"/>
        <line x1="128" y1="62" x2="128" y2="108" class="fig-median"/>
        <text x="81" y="92" class="fig-label is-accent" text-anchor="middle">30 %</text>
        <text x="240" y="92" class="fig-label is-muted" text-anchor="middle">70 %</text>
        <text x="35" y="132" class="fig-label is-muted">0 %</text>
        <text x="128" y="132" class="fig-label is-accent" text-anchor="middle">W = 24 €</text>
        <text x="345" y="132" class="fig-label is-muted" text-anchor="end">100 %</text>
        <text x="345" y="48" class="fig-label" text-anchor="end">G = 80 € (das Ganze)</text>
      </svg>`,
      'Der Grundwert G ist immer der ganze Streifen, der Prozentwert W nur ein Stück davon.'),

    /* Zinseszins-Säulen */
    zinsen: fig(`
      <svg class="fig" viewBox="0 0 380 185" role="img" aria-label="Säulendiagramm: Kapital mit Zinseszins über drei Jahre, der Zinsanteil wächst jedes Jahr stärker">
        <line x1="30" y1="150" x2="350" y2="150" class="fig-axis"/>
        ${/* Kapital 66 Einheiten, Zinsen kumuliert bei 20 % pro Jahr:
              0,20 · 66 ≈ 13 · 0,44 · 66 ≈ 29 · 0,728 · 66 ≈ 48.
              Höchster Stapel 66 + 48 = 114, Oberkante also y = 36 –
              vorher ragte die letzte Säule 14 Einheiten aus dem Bild. */''}
        ${[[0, 0], [1, 13], [2, 29], [3, 48]].map(([j, zins]) => {
          const x = 46 + j * 76;
          return `<rect x="${x}" y="84" width="50" height="66" class="fig-bar"/>
                  ${zins ? `<rect x="${x}" y="${84 - zins}" width="50" height="${zins}" class="fig-bar is-accent"/>` : ''}
                  <text x="${x + 25}" y="169" class="fig-label is-muted" text-anchor="middle">${j === 0 ? 'Start' : 'Jahr ' + j}</text>`;
        }).join('')}
        ${/* Legende oben links: Dort ist Platz, weil die Säulen von links nach
              rechts wachsen. Vorher stand sie rechts – mitten in den Säulen. */''}
        <rect x="30" y="16" width="11" height="11" class="fig-bar is-accent"/>
        <text x="47" y="26" class="fig-label is-accent">Zinsen</text>
        <rect x="112" y="16" width="11" height="11" class="fig-bar"/>
        <text x="129" y="26" class="fig-label is-muted">Kapital</text>
      </svg>`,
      'Beim Zinseszins wächst der farbige Anteil jedes Jahr stärker – Zinsen bringen selbst Zinsen.'),

    /* Binomische Formel als Fläche */
    terme: fig(`
      <svg class="fig" viewBox="0 0 380 210" role="img" aria-label="Quadrat zur ersten binomischen Formel">
        <rect x="60" y="28" width="100" height="100" class="fig-cell"/>
        <rect x="160" y="28" width="60" height="100" class="fig-shape is-top"/>
        <rect x="60" y="128" width="100" height="60" class="fig-shape is-top"/>
        <rect x="160" y="128" width="60" height="60" class="fig-shape is-side"/>
        <rect x="60" y="28" width="160" height="160" class="fig-grid"/>
        <text x="110" y="86" class="fig-big" text-anchor="middle">a²</text>
        <text x="190" y="84" class="fig-label" text-anchor="middle">a · b</text>
        <text x="110" y="164" class="fig-label" text-anchor="middle">a · b</text>
        <text x="190" y="166" class="fig-big" text-anchor="middle">b²</text>
        <text x="110" y="20" class="fig-label is-accent" text-anchor="middle">a</text>
        <text x="190" y="20" class="fig-label is-accent" text-anchor="middle">b</text>
        <text x="50" y="84" class="fig-label is-accent" text-anchor="end">a</text>
        <text x="50" y="164" class="fig-label is-accent" text-anchor="end">b</text>
        <text x="242" y="96" class="fig-label">(a + b)² =</text>
        <text x="242" y="122" class="fig-label is-accent">a² + 2ab + b²</text>
      </svg>`,
      'Das große Quadrat hat die Seitenlänge a + b – es besteht aus a², zweimal a·b und b².'),

    /* Gleichung als Waage */
    gleichungen: fig(`
      <svg class="fig" viewBox="0 0 380 185" role="img" aria-label="Waage im Gleichgewicht als Bild für eine Gleichung">
        <line x1="70" y1="58" x2="310" y2="58" class="fig-branch"/>
        <polygon points="190,60 166,142 214,142" class="fig-shape"/>
        <line x1="58" y1="142" x2="322" y2="142" class="fig-axis"/>
        <line x1="105" y1="58" x2="105" y2="82" class="fig-dash"/>
        <line x1="275" y1="58" x2="275" y2="82" class="fig-dash"/>
        <path d="M 62 82 L 148 82 L 134 116 L 76 116 Z" class="fig-shape"/>
        <path d="M 232 82 L 318 82 L 304 116 L 246 116 Z" class="fig-shape"/>
        <text x="105" y="106" class="fig-label" text-anchor="middle">3x + 5</text>
        <!-- 26 statt 17: Die Waage zeigt jetzt die Einstiegsfrage der Seite (3x + 5 = 26, x = 7) -->
        <text x="275" y="106" class="fig-label" text-anchor="middle">26</text>
        <text x="190" y="38" class="fig-big is-accent" text-anchor="middle">=</text>
        <text x="190" y="174" class="fig-label is-muted" text-anchor="middle">Was links passiert, muss auch rechts passieren</text>
      </svg>`,
      'Eine Gleichung ist eine Waage im Gleichgewicht – umgeformt wird immer auf beiden Seiten.'),

    /* Zwei Geraden mit Schnittpunkt */
    lgs: fig(`
      <svg class="fig" viewBox="0 0 340 200" role="img" aria-label="Zwei Geraden mit Schnittpunkt">
        <line x1="25" y1="160" x2="315" y2="160" class="fig-axis"/>
        <line x1="60" y1="182" x2="60" y2="20" class="fig-axis"/>
        <line x1="60" y1="148" x2="292" y2="34" class="fig-curve"/>
        <line x1="60" y1="36" x2="292" y2="152" class="fig-line-2"/>
        <!-- Schnittpunkt exakt: 148 − 0,49138·(x−60) = 36 + 0,5·(x−60) → x = 172,97; y = 92,49 -->
        <circle cx="173" cy="92.5" r="7" class="fig-dot"/>
        <!-- Beschriftung 9 nach rechts: Der Punkt reicht jetzt bis x = 180, der Text begann bei
             x = 178. Punkt und Schrift haben dieselbe Farbe (--stufe), das S würde sonst in der
             Scheibe verschluckt. -->
        <!-- Nur EIN S: Ein zweites Etikett stand bei (173|64), also mittig über der
             Scheibe im leeren Keil zwischen den Geraden – auf keiner der beiden.
             Wer die obere Beschriftung als die des Punktes liest (Text über dem
             Punkt ist die übliche Konvention), sucht die Lösung genau dort, wo
             die Seite gerade erklärt, dass sie nicht liegt. -->
        ${/* S liegt bei (173 | 92,5). Der Name muss weit genug nach rechts, damit er in
             den sich öffnenden Keil zwischen beide Geraden passt: bei x = 212 liegt
             Gleichung I auf y = 73,3 und Gleichung II auf y = 112 – der Kasten
             (y = 84…100) hat zu beiden rund 10 Einheiten. */''}
        <text x="212" y="97" class="fig-label is-accent">S (x | y)</text>
        <text x="250" y="28" class="fig-label is-accent" text-anchor="middle">Gleichung I</text>
        <text x="252" y="184" class="fig-label is-muted" text-anchor="middle">Gleichung II</text>
      </svg>`,
      'Die Lösung eines Gleichungssystems ist genau der Schnittpunkt der beiden Geraden.'),

    /* Produktregel als Flächenzuwachs eines Rechtecks */
    ableitungsregeln: fig(`
      <svg class="fig" viewBox="0 0 340 210" role="img" aria-label="Ein Rechteck mit den Seiten u und v; wachsen beide Seiten ein wenig, kommen zwei Streifen und ein winziges Eckstück hinzu">
        ${/* Raster: linke Kante x = 55, u endet bei 165 (Breite 110), Δu endet bei 217 (Breite 52).
             Untere Kante y = 170, v beginnt bei 93 (Höhe 77), Δv endet bei 63 (Höhe 30).
             Die vier Rechtecke stoßen exakt aneinander – keine Lücke, keine Überlappung. */''}
        <rect x="55" y="93" width="110" height="77" class="fig-shape is-filled"/>
        <rect x="55" y="63" width="110" height="30" class="fig-shape is-side"/>
        <rect x="165" y="93" width="52" height="77" class="fig-shape is-side"/>
        <rect x="165" y="63" width="52" height="30" class="fig-shape is-top"/>

        <text x="110" y="137" class="fig-label" text-anchor="middle">u · v</text>
        <text x="110" y="83" class="fig-label" text-anchor="middle">u · Δv</text>
        <text x="191" y="137" class="fig-label" text-anchor="middle">v · Δu</text>

        ${/* Das Eckstück ist zu klein für seine Beschriftung – deshalb steht sie rechts daneben,
             mit einer Linie zum Rechteck. Genau dieses Stück verschwindet im Grenzwert. */''}
        <line x1="219" y1="78" x2="240" y2="52" class="fig-dash"/>
        <text x="243" y="49" class="fig-label is-muted">Δu · Δv</text>
        <text x="243" y="66" class="fig-label is-muted">verschwindet</text>

        <line x1="55" y1="181" x2="165" y2="181" class="fig-axis"/>
        <text x="110" y="197" class="fig-label is-accent" text-anchor="middle">u</text>
        <line x1="165" y1="181" x2="217" y2="181" class="fig-axis"/>
        <text x="191" y="197" class="fig-label is-accent" text-anchor="middle">Δu</text>

        <line x1="44" y1="93" x2="44" y2="170" class="fig-axis"/>
        <text x="30" y="136" class="fig-label is-accent" text-anchor="middle">v</text>
        <line x1="44" y1="63" x2="44" y2="93" class="fig-axis"/>
        <text x="26" y="82" class="fig-label is-accent" text-anchor="middle">Δv</text>
      </svg>`,
      'Wachsen beide Seiten, kommen zwei Streifen dazu – u · Δv und v · Δu. Das Eckstück ist ein Produkt zweier kleiner Größen und fällt im Grenzwert weg. Übrig bleiben die zwei Summanden der Produktregel.'),

    /* Normalparabel und verschobene Parabel mit Scheitelpunkt */
    quadfunktion: fig(`
      <svg class="fig" viewBox="0 0 340 210" role="img" aria-label="Zwei Parabeln: die Normalparabel mit Scheitel im Ursprung und eine um drei nach rechts und vier nach unten verschobene Parabel mit eingezeichnetem Scheitelpunkt">
        ${/* Koordinatengitter: Ursprung bei (120|60), 22 Einheiten je Schritt.
             Die verschobene Parabel hat Scheitel bei x = +2, y = −3 → (164|126).
             Beide Kurven sind quadratische Béziers: Für y = (x−d)² + e mit
             Halbbreite w gilt: Endpunkte (d±w | e+w²), Kontrollpunkt (d | e−w²).
             Normalparabel, w = 2: Enden (−2|4) und (2|4), Kontrolle (0|−4). */''}
        <line x1="20" y1="60" x2="320" y2="60" class="fig-axis"/>
        ${/* Die Achse endet bei y = 150, nicht bei 196: Darunter stehen die beiden
             Bildunterschriften, und die Achse lief mitten durch ihre Schrift. */''}
        <line x1="120" y1="16" x2="120" y2="150" class="fig-axis"/>
        <text x="313" y="52" class="fig-label is-muted">x</text>
        <text x="128" y="24" class="fig-label is-muted">y</text>

        ${/* Normalparabel: Scheitel (0|0) → Bildpunkt (120|60).
             Enden bei x = ±2, y = 4 → (76|-28) und (164|-28) … y = 4 liegt aber
             über der Achse, im Bild also 60 − 4·22 = −28. Das läge außerhalb.
             Deshalb w = 1,6: y = 2,56 → 60 − 56 = 4. Enden (85|4) und (155|4),
             Kontrollpunkt (120 | 60 + 56) = (120|116). */''}
        <path d="M 85 4 Q 120 116 155 4" class="fig-curve is-muted"/>
        ${/* Beschriftung weit genug nach links: Bei x = 60 lag sie über der
             Kurve, die zwischen y = 10 und 20 durch x ≈ 88 bis 95 läuft. */''}
        <text x="22" y="20" class="fig-label is-muted">y = x²</text>

        ${/* Verschobene Parabel: Scheitel (2|−3) → (164|126).
             w = 1,6 → Enden bei y = −3 + 2,56 = −0,44 → 60 + 9,7 ≈ 70.
             x = 2 ± 1,6 → 164 ∓ 35 → (129|70) und (199|70).
             Kontrollpunkt (164 | 126 + 56) = (164|182). */''}
        <path d="M 129 70 Q 164 182 199 70" class="fig-curve"/>
        <circle cx="164" cy="126" r="6" class="fig-dot"/>
        <text x="176" y="140" class="fig-label is-accent">S(2 | −3)</text>

        ${/* Verschiebungsweg vom Ursprung zum Scheitel – erst waagerecht, dann
             senkrecht. Beschriftet wird er unten links: Direkt am Weg lagen die
             Etiketten auf den Parabelbögen, weil sich dort beide Äste treffen. */''}
        <line x1="120" y1="60" x2="164" y2="60" class="fig-dash"/>
        <line x1="164" y1="60" x2="164" y2="120" class="fig-dash"/>

        <text x="24" y="172" class="fig-label">f(x) = (x − 2)² − 3</text>
        <text x="24" y="192" class="fig-label is-accent">2 nach rechts, 3 nach unten</text>
      </svg>`,
      'Die Klammer verschiebt waagerecht, der Summand senkrecht. „minus 2“ in der Klammer heißt zwei nach rechts – dort wird sie null, und genau dort liegt der Scheitel.'),

    /* e-Funktion: Höhe und Steigung sind an jeder Stelle gleich groß */
    efunktion: fig(`
      <svg class="fig" viewBox="0 0 340 200" role="img" aria-label="Der Graph der e-Funktion mit zwei eingezeichneten Tangenten; an jeder Stelle ist die Steigung genauso groß wie der Funktionswert">
        ${/* Koordinaten werden gerechnet, nicht geschätzt: Ursprung (95|172),
             50 px je x-Einheit, 30 px je y-Einheit. Der Pfad folgt e^x in
             Schritten von 0,1 – damit liegt jeder Punkt exakt auf der Kurve
             und nicht auf einer von Hand gelegten Bézierkurve. */''}
        ${(() => {
          const ox = 95, oy = 172, sx = 50, sy = 30;
          const px = x => ox + x * sx, py = y => oy - y * sy;
          let d = '';
          for (let i = 0; i <= 32; i++) {
            const x = -1.6 + i * 0.1;
            d += (i ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(Math.exp(x)).toFixed(1) + ' ';
          }
          // Tangente in (0|1): y = 1 + x, gezeichnet von x = −0,9 bis 0,9
          const t1 = `M ${px(-0.9).toFixed(1)} ${py(0.1).toFixed(1)} L ${px(0.9).toFixed(1)} ${py(1.9).toFixed(1)}`;
          // Tangente in (1|e): y = e + e·(x−1), von x = 0,35 bis 1,45
          const e = Math.E;
          const t2 = `M ${px(0.35).toFixed(1)} ${py(e * 0.35).toFixed(1)} L ${px(1.45).toFixed(1)} ${py(e * 1.45).toFixed(1)}`;
          return `<line x1="20" y1="${oy}" x2="320" y2="${oy}" class="fig-axis"/>
                  <line x1="${ox}" y1="24" x2="${ox}" y2="192" class="fig-axis"/>
                  <path d="${t1}" class="fig-tangent"/>
                  <path d="${t2}" class="fig-tangent"/>
                  <path d="${d}" class="fig-curve"/>
                  <circle cx="${px(0).toFixed(1)}" cy="${py(1).toFixed(1)}" r="5" class="fig-dot"/>
                  <circle cx="${px(1).toFixed(1)}" cy="${py(e).toFixed(1)}" r="5" class="fig-dot"/>`;
        })()}
        <text x="310" y="164" class="fig-label is-muted">x</text>
        <text x="103" y="32" class="fig-label is-muted">y</text>
        <text x="196" y="52" class="fig-label is-accent">y = e</text>
        <text x="228" y="46" class="fig-label is-accent">x</text>
        ${/* Eine kurze Beschriftung oben links: Dort ist nichts. Zwei längere
             direkt an den Punkten lagen auf der Kurve und auf beiden Tangenten,
             weil sich dort alles trifft. Den Rest sagt die Bildunterschrift. */''}
        ${/* Zweizeilig, weil einzeilig 105 Einheiten breit – die y-Achse bei x = 95
             lief durch das Wort „Höhe“. Zwei Zeilen à 16 Einheiten wie überall. */''}
        <text x="20" y="52" class="fig-label is-accent">Steigung</text>
        <text x="20" y="68" class="fig-label is-accent">= Höhe</text>
      </svg>`,
      'Bei der e-Funktion ist die Steigung der Tangente an jeder Stelle genauso groß wie der Funktionswert selbst. Genau das bedeutet (eˣ)′ = eˣ.'),

    /* Funktion dritten Grades mit Hoch-, Tief- und Wendepunkt */
    kurvendiskussion: fig(`
      <svg class="fig" viewBox="0 0 340 200" role="img" aria-label="Der Graph von x hoch drei minus drei x mit markiertem Hochpunkt links, Wendepunkt in der Mitte und Tiefpunkt rechts">
        ${/* f(x) = x³ − 3x, gerechnet statt geschätzt: Ursprung (170|100),
             52 px je x-Einheit, 22 px je y-Einheit. Extrema bei x = ∓1
             (Hochpunkt (−1|2), Tiefpunkt (1|−2)), Wendepunkt im Ursprung. */''}
        ${(() => {
          const ox = 170, oy = 100, sx = 52, sy = 22;
          const px = x => ox + x * sx, py = y => oy - y * sy;
          const f = x => x * x * x - 3 * x;
          let d = '';
          for (let i = 0; i <= 40; i++) {
            const x = -2 + i * 0.1;
            d += (i ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(f(x)).toFixed(1) + ' ';
          }
          const marke = (x, kl) => `<circle cx="${px(x).toFixed(1)}" cy="${py(f(x)).toFixed(1)}" r="5.5" class="${kl}"/>`;
          // Waagerechte Tangenten an den beiden Extremstellen
          const tang = x => `<line x1="${(px(x) - 26).toFixed(1)}" y1="${py(f(x)).toFixed(1)}" x2="${(px(x) + 26).toFixed(1)}" y2="${py(f(x)).toFixed(1)}" class="fig-tangent"/>`;
          return `<line x1="24" y1="${oy}" x2="316" y2="${oy}" class="fig-axis"/>
                  <line x1="${ox}" y1="16" x2="${ox}" y2="186" class="fig-axis"/>
                  ${tang(-1)}${tang(1)}
                  <path d="${d}" class="fig-curve"/>
                  ${marke(-1, 'fig-dot')}${marke(0, 'fig-dot')}${marke(1, 'fig-dot')}`;
        })()}
        <text x="24" y="46" class="fig-label">Hochpunkt</text>
        <text x="24" y="62" class="fig-label is-muted">f″ &lt; 0</text>
        <text x="185" y="174" class="fig-label">Tiefpunkt</text>
        <text x="185" y="190" class="fig-label is-muted">f″ &gt; 0</text>
        ${/* Nach links unten gesetzt: Rechts oben steigt der Ast wieder an und
             lief bei y = 66 durch die Beschriftung. Hier ist die Kurve über der
             Achse bzw. schon weit rechts – der Bereich bleibt frei. */''}
        <text x="78" y="130" class="fig-label is-accent">Wendepunkt</text>
        <text x="78" y="146" class="fig-label is-muted">f″ = 0</text>
        ${/* Ohne Hilfslinie: Sie begann innerhalb der Beschriftung „Wendepunkt“.
             Hoch- und Tiefpunkt kommen ebenfalls ohne aus – der Punkt selbst ist
             markiert, und die Beschriftung ist die nächstgelegene. */''}
      </svg>`,
      'Zwischen Hoch- und Tiefpunkt kippt die Krümmung – genau dort liegt der Wendepunkt. An beiden Extremstellen ist die Tangente waagerecht; erst das Vorzeichen von f″ unterscheidet sie.'),

    /* Potenz mit Basis und Exponent */
    potenzen: fig(`
      <svg class="fig" viewBox="0 0 360 180" role="img" aria-label="Die Potenz zwei hoch vier: Basis 2, Exponent 4, ausgeschrieben 2 mal 2 mal 2 mal 2 gleich 16">
        <text x="130" y="88" class="fig-huge" text-anchor="middle">2</text>
        <!-- Exponent rückt an die Basis heran: vorher lagen rund 19 Einheiten
             (0,35 em der 54-px-Basis) dazwischen, das las sich wie „2 4“. -->
        <text x="158" y="64" class="fig-big is-accent" text-anchor="middle">4</text>
        <path d="M 112 104 Q 98 128 82 132" class="fig-arc"/>
        <path d="M 173 52 Q 208 34 242 42" class="fig-arc"/>
        <text x="74" y="152" class="fig-label is-accent" text-anchor="middle">Basis</text>
        <text x="252" y="48" class="fig-label is-accent">Exponent</text>
        <text x="228" y="106" class="fig-label" text-anchor="middle">= 2 · 2 · 2 · 2 = 16</text>
        <text x="180" y="172" class="fig-label is-muted" text-anchor="middle">Der Exponent zählt, wie oft die Basis als Faktor auftritt.</text>
      </svg>`,
      'Vier Faktoren – 2⁴ ist also 16 und nicht „2 mal 4“.'),

    /* Mittelwert vs. Median */
    statistik: fig(`
      <svg class="fig" viewBox="0 0 380 175" role="img" aria-label="Datenpunkte mit Median und Mittelwert">
        <line x1="35" y1="105" x2="355" y2="105" class="fig-axis"/>
        ${/* r = 5: bei 11 Einheiten Punktabstand bleibt 1 Einheit Lücke – mit r = 8
             (Durchmesser 16) verschmolzen die Werte 2 bis 5 zu einem Balken. */''}
        ${[2, 3, 4, 5, 26].map(v => `<circle cx="${45 + v * 11}" cy="105" r="5" class="fig-dot"/>`).join('')}
        <line x1="89" y1="58" x2="89" y2="120" class="fig-median"/>
        <text x="89" y="48" class="fig-label is-accent" text-anchor="middle">Median 4</text>
        <line x1="133" y1="105" x2="133" y2="146" class="fig-tangent"/>
        <text x="146" y="164" class="fig-label">Mittelwert 8</text>
        <text x="331" y="86" class="fig-label is-muted" text-anchor="middle">Ausreißer</text>
      </svg>`,
      'Ein einziger Ausreißer zieht den Mittelwert weit nach rechts – der Median bleibt stabil.'),

    /* Logarithmus als Umkehrung */
    logarithmen: fig(`
      <svg class="fig" viewBox="0 0 360 170" role="img" aria-label="Potenzieren und Logarithmieren als Umkehrung">
        <rect x="40" y="62" width="72" height="54" rx="14" class="fig-cell"/>
        <rect x="248" y="62" width="72" height="54" rx="14" class="fig-cell"/>
        <text x="76" y="99" class="fig-big" text-anchor="middle">3</text>
        <text x="284" y="99" class="fig-big" text-anchor="middle">8</text>
        <path d="M 116 74 Q 180 28 244 74" class="fig-arc"/>
        <!-- Spitze in Richtung der Bogen-Tangente am Ende: P2 − P1 = (64|46),
             also 35,7° nach rechts unten (vorher 7,4°, fast waagerecht). -->
        <polygon points="244,74 231,73 238,62" class="fig-arrow"/>
        <path d="M 244 106 Q 180 150 116 106" class="fig-arc"/>
        <!-- Gegenrichtung: P2 − P1 = (−64|−44), 34,5° nach links oben. -->
        <polygon points="116,106 129,107 122,118" class="fig-arrow"/>
        <text x="180" y="34" class="fig-label is-accent" text-anchor="middle">potenzieren: 2³ = 8</text>
        <text x="180" y="162" class="fig-label is-accent" text-anchor="middle">logarithmieren: log₂(8) = 3</text>
      </svg>`,
      'Der Logarithmus macht das Potenzieren rückgängig – gesucht ist immer der Exponent.'),

    /* Kombinatorik: Zählprinzip */
    kombinatorik: fig(`
      <svg class="fig" viewBox="0 0 380 195" role="img" aria-label="Baumdiagramm: drei Hosen mal zwei Shirts ergeben sechs Möglichkeiten">
        ${/* Die sechs Blätter liegen auf einem festen Raster von 26 Einheiten
              (25, 51, 77, 103, 129, 155). Vorher standen die Beschriftungen nur
              11 Einheiten auseinander – bei 13 px Schrift überlappten sie sich.
              Jeder Knoten der ersten Stufe sitzt genau mittig über seinen
              beiden Blättern, die Wurzel mittig über den Knoten. */''}
        <circle cx="32" cy="90" r="7" class="fig-dot"/>
        ${[38, 90, 142].map((y, i) => `
          <line x1="39" y1="90" x2="126" y2="${y}" class="fig-branch"/>
          <circle cx="133" cy="${y}" r="7" class="fig-dot"/>
          ${/* Beschriftung ueber dem Knoten statt am Ast: Der Ast faellt/steigt mit
                52/87 ≈ 0,6; ueber die halbe Wortbreite (rund 21 Einheiten) wandert er
                12,5 Einheiten und lief bisher quer durch die Schrift. Ueber dem Knoten
                bleiben nach allen Seiten mindestens 4,5 Einheiten Luft (engste Stelle:
                der einlaufende Ast unter "Hose 3"). */''}
          <text x="133" y="${y - 14}" class="fig-label is-muted" text-anchor="middle">Hose ${i + 1}</text>
          <line x1="140" y1="${y}" x2="236" y2="${y - 13}" class="fig-branch"/>
          <line x1="140" y1="${y}" x2="236" y2="${y + 13}" class="fig-branch"/>
          <text x="246" y="${y - 9}" class="fig-label">Shirt A</text>
          <text x="246" y="${y + 17}" class="fig-label">Shirt B</text>`).join('')}
        <text x="190" y="190" class="fig-label is-accent" text-anchor="middle">3 · 2 = 6 Möglichkeiten</text>
      </svg>`,
      'Zählprinzip: Die Möglichkeiten der einzelnen Stufen werden multipliziert.'),

    /* Glücksrad mit Erwartungswert */
    erwartungswert: fig(`
      <svg class="fig" viewBox="0 0 360 180" role="img" aria-label="Glücksrad mit drei Sektoren und Erwartungswert">
        <g transform="translate(90,90)">
          <path d="M 0 0 L 0 -62 A 62 62 0 0 1 0 62 Z" class="fig-cell"/>
          <path d="M 0 0 L 0 62 A 62 62 0 0 1 -62 0 Z" class="fig-shape is-side"/>
          <path d="M 0 0 L -62 0 A 62 62 0 0 1 0 -62 Z" class="fig-shape is-filled"/>
          <circle cx="0" cy="0" r="62" class="fig-grid"/>
          <text x="30" y="6" class="fig-label" text-anchor="middle">0 €</text>
          <text x="-30" y="36" class="fig-label" text-anchor="middle">4 €</text>
          <text x="-30" y="-24" class="fig-label" text-anchor="middle">8 €</text>
        </g>
        <text x="180" y="72" class="fig-label">E(X) = 0 · ½ + 4 · ¼ + 8 · ¼</text>
        <text x="180" y="102" class="fig-label is-accent">= 3 € pro Drehung</text>
      </svg>`,
      'Jede Auszahlung wird mit ihrer Wahrscheinlichkeit gewichtet – die Summe ist der Erwartungswert.'),

    /* Urne: Ziehen ohne Zurücklegen */
    hypergeometrisch: fig(`
      <svg class="fig" viewBox="0 0 380 200" role="img" aria-label="Urne mit vier Treffer- und sechs Nieten-Kugeln, drei werden gezogen">
        <path d="M 45 58 L 60 168 L 196 168 L 211 58" class="fig-grid"/>
        ${[[80, 90, 1], [112, 90, 0], [144, 90, 0], [176, 90, 1],
           [96, 118, 0], [128, 118, 1], [160, 118, 0],
           [82, 146, 0], [114, 146, 1], [146, 146, 0]].map(([x, y, rot]) =>
          `<circle cx="${x}" cy="${y}" r="12" class="${rot ? 'fig-ball-a' : 'fig-ball-b'}"/>`).join('')}
        <path d="M 224 112 L 262 112" class="fig-branch"/>
        <polygon points="270,112 258,106 258,118" class="fig-arrow"/>
        <circle cx="292" cy="112" r="12" class="fig-ball-a"/>
        <circle cx="322" cy="112" r="12" class="fig-ball-b"/>
        <circle cx="352" cy="112" r="12" class="fig-ball-b"/>
        <text x="128" y="44" class="fig-label" text-anchor="middle">
          <tspan class="is-accent">4 Treffer</tspan> · 6 Nieten (N = 10)
        </text>
        <text x="322" y="152" class="fig-label is-muted" text-anchor="middle">3 gezogen –</text>
        <text x="322" y="172" class="fig-label is-accent" text-anchor="middle">ohne Zurücklegen</text>
      </svg>`,
      'Jede gezogene Kugel fehlt danach in der Urne – deshalb ändern sich die Chancen von Zug zu Zug.')

  };
})();
