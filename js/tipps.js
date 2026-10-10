/* ============================================================
   MatheNils – Tipps für den Übungsmodus
   Bewusst als Denkanstoß formuliert, nicht als Lösung:
   Sie zeigen den nächsten Schritt, nicht das Ergebnis.

   Aufgeschlüsselt nach Schwierigkeitsstufe (1 = Leicht,
   2 = Mittel, 3 = Schwer), weil die Stufen eines Themas ganz
   verschiedene Aufgabentypen stellen: Bei „Zinsen“ steht auf
   Stufe 1 der einfache Jahreszins, auf Stufe 3 der Zinseszins –
   ein gemeinsamer Tipp müsste einen von beiden verfehlen.
   ============================================================ */
'use strict';

const TOPIC_TIPPS = {

  /* Unterstufe */
  grundrechenarten: {
    1: 'Bei + und − zerlegst du in Zehner und Einer und rechnest in zwei Schritten. Beim Malnehmen hilft das kleine Einmaleins, beim Teilen die Frage: Wie oft passt die zweite Zahl in die erste?',
    2: 'Stehen · oder : in der Aufgabe, sind sie zuerst dran – Punkt vor Strich. Bei großen Zahlen hilft schriftliches Rechnen mit sauber untereinander stehenden Stellen.',
    3: 'Suche zuerst Klammern, dann alle Punktrechnungen. Erst danach von links nach rechts addieren und subtrahieren – bei Textaufgaben rechnest du jeden Posten einzeln aus und fasst zum Schluss zusammen.'
  },
  negative: {
    1: 'Zwei Zeichen nebeneinander fasst du zuerst zusammen: + (−) wird zu −. Danach hilft der Zahlenstrahl – von der ersten Zahl aus nach links oder rechts gehen.',
    2: 'Treffen zwei Zeichen aufeinander, fasse sie zuerst zusammen. Bei · und : rechne mit den Beträgen und bestimme das Vorzeichen separat.',
    3: 'Punktrechnung zuerst, danach erst die Vorzeichen zusammenfassen. Bei Konto und Temperatur gilt: Einzahlen und Erwärmen heißt addieren, Abheben und Abkühlen subtrahieren.'
  },
  teilbarkeit: {
    1: 'Für 2, 5 und 10 genügt ein Blick auf die letzte Ziffer. Für 3 und 9 brauchst du die Quersumme – dafür addierst du einfach alle Ziffern der Zahl.',
    2: 'Bei einer Primzahl probierst du der Reihe nach 2, 3, 5, 7 … durch, bis das Quadrat des Teilers die Zahl übersteigt. Beim ggT zerlegst du beide Zahlen in Primfaktoren und nimmst nur die gemeinsamen.',
    3: 'Zerlege beide Zahlen in Primfaktoren: Beim ggT suchst du die gemeinsamen, beim kgV alle in höchster Anzahl. „Möglichst viele gleiche Gruppen ohne Rest“ fragt immer nach dem ggT.'
  },
  brueche: {
    1: 'Zum Kürzen suchst du eine Zahl, die Zähler und Nenner teilt – der ggT bringt dich in einem Schritt ans Ziel. Bei gleichem Nenner addierst du nur die Zähler, der Nenner bleibt stehen.',
    2: 'Verschiedene Nenner? Dann zuerst den Hauptnenner (kgV) bilden und beide Brüche erweitern. Beim Multiplizieren brauchst du das nicht – dort rechnest du Zähler mal Zähler und Nenner mal Nenner.',
    3: '„Wie viel bleibt übrig?“ heißt: die Anteile vom ganzen Bruch 1 abziehen. Beim Umwandeln erweiterst du auf den Nenner 10, 100 oder 1000, beim Dividieren hilft der Kehrwert – am Ende kürzen.'
  },
  dezimalzahlen: {
    1: 'Schreibe Komma unter Komma und fülle hinten mit Nullen auf, dann rechnest du wie mit ganzen Zahlen. Beim Runden entscheidet allein die erste Ziffer, die wegfällt.',
    2: 'Rechne zuerst ohne Komma und zähle danach die Nachkommastellen zusammen – so viele hat auch das Ergebnis. Bei 10 und 100 wandert das Komma nur: beim Malnehmen nach rechts, beim Teilen nach links.',
    3: 'Fülle beim Ordnen mit Nullen auf, bis alle Zahlen gleich viele Nachkommastellen haben – dann vergleichst du Stelle für Stelle. Beim Multiplizieren zählst du die Nachkommastellen beider Faktoren zusammen, bei Geld heißt Rückgeld Schein minus Einkauf.'
  },
  einheiten: {
    1: 'Frage dich: Ist die Zieleinheit kleiner? Dann multiplizieren. Achte auf den Faktor – bei Längen und Massen 10, 100 oder 1000, bei der Zeit 60.',
    2: 'Ist die Zieleinheit größer, wird geteilt, ist sie kleiner, multipliziert – das Komma wandert also nach links oder nach rechts. So viele Nullen der Faktor hat, so viele Stellen rückt es.',
    3: 'Bei Flächen ist der Faktor das Quadrat: 1 m² = 100 dm² = 10 000 cm². Bei der Zeit rechnest du mit 60, in Sachaufgaben wandelst du erst am Schluss um.'
  },
  dreisatz: {
    1: 'Rechne zuerst auf eine Einheit herunter: Was kostet ein Stück? Danach multiplizierst du mit der gefragten Anzahl.',
    2: 'Erst der Wert für eine Minute, dann mal die gesuchte Anzahl. Hier laufen beide Größen in dieselbe Richtung – weniger Zeit bedeutet weniger Stück.',
    3: 'Kläre zuerst den Typ: Mehr Maler heißt weniger Tage, das ist antiproportional. Dann rechnest du auf eine Person hoch – mal der alten Anzahl, geteilt durch die neue.'
  },
  winkel: {
    1: 'Im Dreieck ergeben alle drei Winkel zusammen 180°. Ziehe also beide bekannten Winkel davon ab.',
    2: 'Nebenwinkel ergänzen sich zu 180°. Im gleichschenkligen Dreieck sind die beiden Basiswinkel gleich groß – zusammen mit der Spitze wieder 180°.',
    3: 'Im Viereck ist die Winkelsumme 360°. Beim gleichschenkligen Dreieck ziehst du zuerst die Spitze von 180° ab und verteilst den Rest gleichmäßig auf beide Basiswinkel.'
  },

  /* Mittelstufe */
  prozent: {
    1: 'Geh über 1 %: Teile den Grundwert durch 100 und multipliziere dann mit der Prozentzahl.',
    2: 'Finde zuerst den Grundwert – das ist das Ganze (meist nach dem Wort „von“). Fehlt er, teilst du den Prozentwert durch den Prozentsatz und rechnest mal 100.',
    3: 'Rabatt und Aufschlag gehen über den neuen Prozentsatz: Ein Rabatt lässt 100 % − p übrig, ein Aufschlag ergibt 100 % + p. Ist der Prozentsatz gesucht, teilst du den Anteil durch das Ganze und rechnest mal 100.'
  },
  zinsen: {
    1: 'Die Jahreszinsen sind schlicht p % des Kapitals: Kapital mal Zinssatz, geteilt durch 100.',
    2: 'Das Kapital danach ist Kapital plus Zinsen – rechne also zuerst die Zinsen für ein Jahr aus. Ist der Zinssatz gesucht, teilst du die Zinsen durch das Kapital und rechnest mal 100.',
    3: 'Bleiben die Zinsen auf dem Konto? Dann rechnest du mit dem Faktor q = 1 + p/100 hoch der Jahre, nicht mit einer einfachen Multiplikation.'
  },
  terme: {
    1: 'Beim Ausmultiplizieren geht der Faktor an jeden Summanden der Klammer einzeln. Zusammenfassen darfst du nur Glieder mit derselben Variablen – zähle einfach die x.',
    2: 'Das Quadrat einer Summe hat drei Glieder: a², das doppelte Produkt und b². Steht ein Minus in der Klammer, wird nur das mittlere Glied negativ.',
    3: 'Prüfe die Struktur: Steht dort das Quadrat einer Summe oder ein Produkt aus Summe und Differenz? Bei (2x + 3)² ist a = 2x – der Koeffizient wird mitquadriert.'
  },
  gleichungen: {
    1: 'Mach die Rechnung rückgängig, die an x klebt: Bei + rechnest du auf beiden Seiten minus, bei · teilst du beide Seiten.',
    2: 'Schaffe zuerst die Zahl weg, die addiert oder subtrahiert wird, und teile danach durch den Faktor vor dem x. Steht x im Bruch, multiplizierst du beide Seiten mit dem Nenner.',
    3: 'Klammern zuerst ausmultiplizieren, dann alle x-Terme auf eine Seite und alle Zahlen auf die andere. Bei Textaufgaben nennst du das Gesuchte x und schreibst den Satz Stück für Stück als Gleichung auf.'
  },
  lgs: {
    1: 'Eine Gleichung ist schon nach y aufgelöst – setze diesen Ausdruck in die andere ein. Danach steht dort nur noch x.',
    2: 'Suche die Variable, deren Koeffizienten entgegengesetzt sind – sie fällt beim Addieren beider Gleichungen weg. Den gefundenen Wert setzt du anschließend in eine der beiden Gleichungen ein.',
    3: 'Ziel ist immer, eine Variable zu eliminieren. Stehen vor x oder y weder gleiche noch entgegengesetzte Zahlen, vervielfache erst eine oder beide Gleichungen – dann addieren oder subtrahieren. Bei Textaufgaben wird jeder Satz zu einer Gleichung: erst benennen, was x und y sein sollen.'
  },
  linfunktion: {
    1: 'Setze die Zahl überall dort ein, wo x steht – bei negativen Werten mit Klammern. Dann Punkt vor Strich rechnen.',
    2: 'Die Steigung ist y-Unterschied geteilt durch x-Unterschied. Bei der Punktprobe setzt du den x-Wert ein und vergleichst das Ergebnis mit dem y-Wert des Punktes.',
    3: 'Für b setzt du den bekannten Punkt in y = mx + b ein und löst nach b auf. Für die Nullstelle setzt du f(x) = 0 und löst nach x.'
  },
  quadfunktion: {
    1: 'In der Scheitelform f(x) = a(x − d)² + e steht der Scheitel direkt da: S(d | e). Beim d dreht sich das Vorzeichen um, beim e nicht. Der Faktor a entscheidet allein über die Form: positiv heißt nach oben geöffnet, ein Betrag über 1 macht die Parabel enger.',
    2: 'Die Zahl, die die Klammer zu null macht, ist die Scheitelstelle; verschoben wird um Ziel minus Start. Ist ein Punkt gegeben, setzt du ihn in die Scheitelform ein und löst nach a auf. Für Nullstellen bringst du den Summanden auf die andere Seite, teilst durch a und ziehst die Wurzel – sie liefert zwei Werte.',
    3: 'Bei der quadratischen Ergänzung nimmst du die halbe Zahl vor dem x, quadrierst sie, addierst sie und ziehst sie sofort wieder ab. Die ersten drei Summanden sind dann eine binomische Formel. Schneller geht der Scheitel über x = −b geteilt durch 2a.'
  },
  quadratisch: {
    1: 'Ziehe die Wurzel und achte auf das Vorzeichen: Dieselbe Quadratzahl entsteht aus einer positiven wie aus einer negativen Zahl. Schau vorher, was rechts vom Gleichheitszeichen steht – davon hängt ab, wie viele Lösungen es überhaupt geben kann.',
    2: 'Bringe die Gleichung auf die Form x² + px + q = 0 und lies p und q ab. Dann die pq-Formel anwenden: unter der Wurzel steht (p/2)² − q. Fehlt der x-Term, ziehst du einfach die Wurzel.',
    3: 'Prüfe zuerst die Sonderfälle: Fehlt die Zahl, klammere x aus – eine Lösung ist dann 0. Bei Textaufgaben nennst du die gesuchte Länge x und stellst damit die Flächengleichung auf.'
  },
  potenzen: {
    1: 'Eine Potenz heißt: die Basis so oft mit sich selbst multiplizieren, wie die Hochzahl angibt. Die Wurzel fragt umgekehrt, welche Zahl mit sich selbst multipliziert das Ergebnis liefert.',
    2: 'Gleiche Basis mal gleiche Basis heißt Exponenten addieren, beim Dividieren subtrahieren. Multipliziert werden die Exponenten nur bei einer Potenz in der Potenz.',
    3: 'Bei Verdopplungen steht die Anzahl der Schritte im Exponenten: Startwert mal 2 hoch n. Die Kubikwurzel sucht die Zahl, die dreimal als Faktor auftritt – bei „hoch 0“ hilft die Potenzreihe rückwärts.'
  },
  flaechen: {
    1: 'Achte auf die Einheit in der Frage: cm bedeutet Umfang, cm² bedeutet Fläche. Beim Rechteck ist der Umfang 2 · (a + b), die Fläche a · b.',
    2: 'Beim Dreieck und Parallelogramm zählt die Höhe, nicht die schräge Seite. Das Dreieck ist ein halbes Parallelogramm – daher kommt das „: 2“.',
    3: 'Achte auf die Einheit in der Frage: cm bedeutet Umfang (2 · π · r), cm² bedeutet Fläche (π · r²). Setze erst den Radius ein und rechne dann mit π ≈ 3,14 weiter.'
  },
  volumen: {
    1: 'Denke an „Grundfläche mal Höhe“ – beim Quader also alle drei Kanten multiplizieren, beim Würfel dreimal dieselbe Kante.',
    2: 'Für die Oberfläche zählst du alle Begrenzungsflächen zusammen: Der Würfel hat 6 gleiche, der Quader drei verschiedene Paare. Beim Prisma bleibt es beim Volumen Grundfläche mal Höhe.',
    3: 'Beim Zylinder ist die Grundfläche ein Kreis: π · r², danach mal die Höhe. Ist umgekehrt die Kante aus dem Volumen gesucht, brauchst du die dritte Wurzel.'
  },
  koerper: {
    1: 'Spitze Körper bekommen ein Drittel: V = ⅓ · G · h. Beim Kegel ist die Grundfläche der Kreis π · r², bei der Kugel gibt es gar keine – dort gilt V = ⁴⁄₃ · π · r³ und O = 4 · π · r².',
    2: 'Steht die Mantellinie s in der Aufgabe, rechne sie erst mit Pythagoras in die Höhe um: h = √(s² − r²). s ist die längste der drei Strecken und steht nie in der Volumenformel. Rückwärts gilt: h = 3V : G.',
    3: 'Zerlege den Körper in seine Teile und rechne jedes für sich, bevor du addierst. Nützliche Faustregeln: Der Kegel füllt seinen gleich breiten Zylinder zu ⅓, die Kugel ihren zu ⅔.'
  },
  strahlensaetze: {
    1: 'Bei der zentrischen Streckung wird jede Länge mit k multipliziert, jede Fläche mit k² – und die Winkel bleiben unverändert. Den Faktor bekommst du über k = Bildlänge : Originallänge.',
    2: 'Schreibe zuerst die Verhältnisgleichung auf und miss dabei links und rechts in derselben Richtung: entweder beide Male ab dem Scheitel Z oder beide Male das Zwischenstück. Dann über Kreuz multiplizieren.',
    3: 'Suche in der Sachaufgabe die beiden ähnlichen Dreiecke und ordne einander zu, was sich entspricht (Höhe zu Höhe, Schatten zu Schatten). Oft reicht der Faktor: Ist die eine Strecke n-mal so lang, ist es die andere auch.'
  },
  vektoren: {
    1: 'Schreibe die drei Zeilen untereinander und rechne jede für sich – die x-Komponenten miteinander, dann die y-, dann die z-Komponenten. Ein Vielfaches trifft jede Zeile einzeln, der Gegenvektor dreht in jeder Zeile das Vorzeichen um.',
    2: 'Spitze minus Fuß: AB ist B − A, nicht umgekehrt. Für den Betrag alle drei Komponenten quadrieren, addieren, Wurzel ziehen – die Vorzeichen fallen dabei weg. Der Mittelpunkt ist der Mittelwert der beiden Ortsvektoren.',
    3: 'Schreibe die Bedingung als Vektorgleichung und rechne zeilenweise: kollinear heißt derselbe Faktor in allen drei Zeilen, beim Parallelogramm gilt AD = BC, für den Schwerpunkt OS = ⅓ · (OA + OB + OC). Bei r und s liefern zwei Zeilen die Zahlen, die dritte ist die Probe.',
  },
  skalarprodukt: {
    1: 'Komponente mal Komponente, dann alles addieren – heraus kommt eine Zahl, kein Vektor. Ist diese Zahl null, stehen die beiden Vektoren senkrecht aufeinander; ist sie negativ, ist der Winkel größer als 90°. Einen senkrechten Vektor in der Ebene bekommst du so: Komponenten vertauschen, bei einer das Vorzeichen umdrehen.',
    2: 'Soll etwas senkrecht stehen, setze das Skalarprodukt gleich null und löse die Gleichung nach der Unbekannten auf. Für den Winkel gilt cos φ = (a · b) : (|a| · |b|) – erst das Skalarprodukt, dann beide Beträge, zuletzt der Arkuskosinus.',
    3: 'Bei zwei Geraden zählen nur die Richtungsvektoren, die Aufpunkte kannst du weglassen – und in den Zähler kommen Betragsstriche, weil der Schnittwinkel höchstens 90° groß ist. Für einen Winkel im Dreieck müssen beide Vektoren im selben Eckpunkt beginnen.',
  },
  geraden: {
    1: 'Setze den Parameterwert in jede der drei Zeilen einzeln ein – die Zeilen wissen nichts voneinander. Bei einer Geraden durch zwei Punkte ist A der Stützpunkt und B − A der Richtungsvektor (Spitze minus Fuß). Steht die Gerade zeilenweise da, ist der Richtungsvektor das, was jeweils bei t steht; ohne Zahl davor zählt der Faktor 1.',
    2: 'Punktprobe: t aus einer Zeile bestimmen und in den beiden anderen prüfen – erst wenn alle drei denselben Wert liefern, liegt der Punkt auf der Geraden. Für einen Spurpunkt setzt du die passende Koordinate null und bekommst daraus t. Und für die Frage nach der Parallelität zählen allein die Richtungsvektoren, die Stützpunkte kannst du weglassen.',
    3: 'Immer in dieser Reihenfolge: erst die Richtungsvektoren vergleichen. Sind sie Vielfache voneinander, entscheidet eine Punktprobe zwischen identisch und echt parallel. Sonst gleichsetzen, zwei Zeilen nach t und s auflösen – und unbedingt die dritte Zeile als Probe rechnen, denn erst sie trennt schneidend von windschief. Bei zwei Flugbahnen gehört zum Zusammenstoß außerdem, dass beide Parameter denselben Wert haben.',
  },
  ebenen: {
    1: 'Die drei Zahlen vor x₁, x₂ und x₃ sind der Normalenvektor – und jedes Vielfache davon steht ebenso senkrecht auf der Ebene. Für die Punktprobe setzt du die Koordinaten links ein und vergleichst mit der Zahl rechts. Auf einer Achse sind die beiden anderen Koordinaten null; fehlt eine Variable ganz, darf ihre Koordinate beliebig sein.',
    2: 'Die Zahl rechts ist immer das Skalarprodukt aus dem Normalenvektor und einem Punkt der Ebene: d = n · OP. Spannvektoren bekommst du als Spitze minus Fuß zweier Ebenenpunkte, und senkrecht heißt auch hier: Skalarprodukt null. Beim Test in der Parameterform löst du zwei Zeilen nach r und s auf – entscheiden tut erst die dritte.',
    3: 'Für den Schnittpunkt setzt du den allgemeinen Punkt der Geraden in die Ebenengleichung ein und löst nach t auf. Ist n · u = 0, gibt es kein solches t – dann entscheidet der Aufpunkt, ob die Gerade in der Ebene liegt oder daneben. Bei Abständen teilst du zum Schluss durch |n|, und bei zwei Ebenen bringst du beide Gleichungen vorher auf denselben Normalenvektor.',
  },
  hypothesentest: {
    1: 'Kumuliert heißt aufsummieren: P(X ≤ k) zählt alle Fälle von 0 bis k. Für „mindestens“ gehst du über das Gegenereignis – und das Gegenteil von „mindestens k“ ist „höchstens k − 1“, nicht „höchstens k“.',
    2: 'Die geprüfte Behauptung gehört nach H₀, die Vermutung nach H₁ – nur H₀ kann der Test verwerfen. Die Irrtumswahrscheinlichkeit rechnest du immer mit dem p aus H₀ und nur über die Werte, die im Ablehnungsbereich liegen.',
    3: 'Bestimme die Grenze vom Rand her: Rechtsseitig suchst du das kleinste k, für das P(X ≤ k − 1) die Schranke 1 − α erreicht, linksseitig das größte c mit P(X ≤ c) ≤ α. Beim Fehler 2. Art rechnest du dagegen mit dem wahren p und fragst nach den Werten außerhalb des Ablehnungsbereichs.',
  },
  symmetrie: {
    1: 'Mach zwei Proben, nicht eine: Falten für die Achse, Drehen um 180° für das Zentrum. Eine Faltlinie zählt nur, wenn beide Hälften genau aufeinanderliegen.',
    2: 'Schau zuerst, welche Koordinate sich ändert. An der x-Achse wechselt nur die zweite das Vorzeichen, an der y-Achse nur die erste, am Ursprung beide.',
    3: 'Rechne mit dem doppelten Wert der Achse: Bei x = a wird aus x der Wert 2a − x, bei y = b aus y der Wert 2b − y. Beim Zentrum Z(a | b) gilt beides zugleich. Rückwärts hilft die Mitte: Achse und Zentrum liegen genau zwischen Punkt und Bildpunkt.',
  },
  vierecke: {
    1: 'Geh die Merkmale der Reihe nach durch: Welche Seiten sind gleich lang, welche parallel, gibt es einen rechten Winkel? Beim Dreieck entscheidet nach den Seiten die Zahl der gleich langen und nach den Winkeln allein der größte Winkel. Bei den Symmetrieachsen probierst du durch, an welchen Geraden sich die Figur decken lässt – erst die Mittellinien, dann die Diagonalen.',
    2: 'Schreib zuerst auf, was die genannte Form über ihre Seiten verrät: Im Parallelogramm kommt jede Länge zweimal vor, in der Raute sind alle vier gleich, beim gleichschenkligen Dreieck die beiden Schenkel. Bei den Diagonalen sind es drei Fragen: gleich lang, senkrecht, halbieren sie einander?',
    3: 'Bei einer Aussage frag dich, ob du ein einziges Gegenbeispiel findest – dann gilt sie nicht immer. Zusammengesetzte Figuren zerlegst du in Rechtecke und rechtwinklige Dreiecke, rechnest jedes Teil einzeln aus und zählst am Ende zusammen. Beim Rand hilft es, jede Kante einmal abzugehen.',
  },
  pythagoras: {
    1: 'Die Hypotenuse liegt gegenüber dem rechten Winkel und ist die längste Seite. Für sie addierst du die Quadrate beider Katheten – und ziehst erst ganz am Ende die Wurzel.',
    2: 'Hier ist die längste Seite schon bekannt, deshalb wird subtrahiert statt addiert: a² = c² − b². Die Wurzel kommt auch hier erst zum Schluss.',
    3: 'Zeichne dir das rechtwinklige Dreieck kurz auf: Diagonale, Leiter und schräger Weg sind immer die Hypotenuse. Danach entscheidest du, ob du addierst (Hypotenuse gesucht) oder subtrahierst.'
  },
  trigonometrie: {
    // Stufe 1 fragt seit der Umstellung auch nach β – „vom Winkel α aus“
    // hätte dort in die Irre geführt. Der zweite Satz nennt die
    // Buchstabenregel, ohne die die Aufgaben nach a, b und c nicht lösbar sind.
    1: 'Geh von dem Winkel aus, nach dem gefragt ist, und frage: Liegt die Seite ihm gegenüber, grenzt sie an ihn an oder ist sie die längste? Genau das steckt in ihrem Namen. Der Buchstabe verrät den Gegenwinkel: a gehört zu α, b zu β, c zum rechten Winkel.',
    2: 'Welche zwei Seiten kommen vor (gegeben und gesucht)? Das entscheidet zwischen sin, cos und tan. Danach stellst du die Formel nach der gesuchten Seite um.',
    3: 'Bilde zuerst den Quotienten aus den beiden gegebenen Seiten. Den Winkel holst du dann mit der Umkehrtaste sin⁻¹, cos⁻¹ oder tan⁻¹ zurück.'
  },
  statistik: {
    1: 'Der Mittelwert ist Summe geteilt durch Anzahl. Addiere also erst alle Werte und teile dann durch ihre Anzahl.',
    2: 'Sortiere die Daten zuerst der Größe nach. Der Median ist danach der mittlere Wert, die Spannweite größter minus kleinster Wert.',
    3: 'Rechne rückwärts: Mittelwert mal Anzahl ergibt die Summe aller Punkte. Davon ziehst du die bekannten Werte ab.'
  },
  wahrscheinlichkeit: {
    1: 'Zähle günstige und mögliche Ergebnisse – die Wahrscheinlichkeit ist günstige durch mögliche. Bei „keine“ oder „mindestens“ ist der Weg über das Gegenereignis fast immer kürzer.',
    2: 'Frage dich zuerst, was verlangt ist. „Kein …“ geht am schnellsten über das Gegenereignis: 1 minus die Wahrscheinlichkeit des Ereignisses. „A oder B“ darfst du addieren, solange beides nicht gleichzeitig eintreten kann. Bei zwei Zügen mit Zurücklegen bleiben die Anteile gleich und werden multipliziert.',
    3: 'Bei mehreren Zügen multiplizierst du entlang eines Pfades; führen mehrere Pfade zum Ereignis, werden sie addiert. Ohne Zurücklegen schrumpft der Nenner ab dem zweiten Zug. Bei „mindestens“ führt das Gegenereignis schneller zum Ziel.'
  },

  /* Oberstufe */
  wachstum: {
    1: 'Bestimme den Wachstumsfaktor q: Wachstum heißt q = 1 + p/100, Schrumpfen q = 1 − p/100. Umgekehrt liest du aus dem Abstand von q zur 1 den Prozentsatz ab.',
    2: 'Kläre erst den Faktor pro Schritt – Verdoppeln heißt q = 2, Halbieren q = 0,5. Dann rechnest du B₀ · qⁿ mit n = Anzahl der Schritte.',
    3: 'Ist die Anzahl der Schritte gesucht, teile Endwert durch Startwert und frage dich: Wie oft muss ich mit q multiplizieren, bis ich dort bin? Sonst wie gehabt B₀ · qⁿ.'
  },
  logarithmen: {
    1: 'Frage dich: „Basis hoch was ergibt das Argument?“ Zähle notfalls die Potenzen der Basis durch, bis du beim Argument ankommst.',
    2: 'Schreibe beide Seiten als Potenz derselben Basis, dann kannst du die Exponenten vergleichen. Ein Bruch oder eine Zahl unter 1 führt auf einen negativen Exponenten.',
    3: 'Steht das Gesuchte im Exponenten, wendest du auf beiden Seiten den Logarithmus an. Bei den Gesetzen gilt: Produkt wird Summe, Quotient wird Differenz, die Hochzahl wandert als Faktor nach vorn.'
  },
  ableitungsregeln: {
    1: 'Sieh dir zuerst die Bauart an: Zwei Klammern nebeneinander verlangen die Produktregel, eine Klammer mit Exponent die Kettenregel, ein Bruchstrich mit x im Nenner die Quotientenregel. Bei der Produktregel benennst du u und v, leitest beide einzeln ab und setzt in u′ · v + u · v′ ein.',
    2: 'Bei einer Klammer mit Exponent gilt: äußere Ableitung mal innere Ableitung. Der Exponent kommt nach vorn, die Klammer bleibt stehen und wird um eins kleiner – und dann folgt der Faktor, den die Klammer selbst als Ableitung hat. Genau dieser letzte Faktor wird am häufigsten vergessen.',
    3: 'Beim Bruch zählt die Reihenfolge: erst u′ · v, dann minus u · v′, der Nenner wird quadriert. Wurzel und ln sind äußere Funktionen: (√v)′ = 1/(2√v), (ln v)′ = 1/v – beide mal innere Ableitung. Steht ein x vor einer Klammer mit Exponent, erst Produkt-, dann Kettenregel.'
  },
  efunktion: {
    1: 'e und ln sind Umkehrfunktionen und heben sich gegenseitig auf – wie Quadrieren und Wurzelziehen. ln fragt: „Mit welchem Exponenten muss ich e potenzieren?“ Beim Ableiten bleibt der e-Teil unverändert, dazu kommt die Ableitung des Exponenten als Faktor davor.',
    2: 'Der Vorfaktor bleibt stehen, der e-Teil bleibt stehen, und die Ableitung des Exponenten kommt als Faktor davor. An der Stelle 0 hilft e hoch 0 = 1 – damit lässt sich f′(0) im Kopf ausrechnen. Steht x im Exponenten einer Gleichung, holt ln es heraus.',
    3: 'Bei Zerfall und Wachstum setzt du die Zeit einfach in den Exponenten ein. Fragt die Aufgabe nach einer Zeit, musst du umgekehrt vorgehen: erst die Startmenge wegteilen, dann auf beiden Seiten ln anwenden. Bei der Halbwertszeit kürzt sich die Startmenge dabei ganz heraus.'
  },
  ableitungen: {
    1: 'Potenzregel: Der Exponent kommt als Faktor nach vorn und wird um 1 kleiner. Eine Zahl ohne x fällt ganz weg, bei einem einfachen x bleibt genau der Faktor davor stehen.',
    2: 'Leite zuerst ab – Exponent als Faktor nach vorn, dann um 1 kleiner. Erst danach setzt du die Stelle in f′(x) ein; dieser Wert ist genau die gesuchte Steigung.',
    3: 'Leite jeden Summanden einzeln ab. Eine waagerechte Tangente bedeutet Steigung null: Setze f′(x) = 0 und löse nach x auf.'
  },
  kurvendiskussion: {
    1: 'f″ ist die Ableitung von f′ – also zweimal nacheinander die Potenzregel, nicht einmal „doppelt“. Schau zuerst auf f′: Nur bei waagerechter Tangente kommt ein Hoch- oder Tiefpunkt in Frage, und dann entscheidet das Vorzeichen von f″ – positiv heißt Linkskrümmung wie eine Schale, negativ Rechtskrümmung wie ein Hügel.',
    2: 'Extremstellen findest du über f′(x) = 0: durch den Vorfaktor teilen, dann die pq-Formel. Ist nach einer bestimmten Stelle gefragt, rechne dort erst f′ aus und dann f″. Ohne waagerechte Tangente gibt es weder Hoch- noch Tiefpunkt; wird f″ null, kippt dort die Krümmung.',
    3: 'Für die Wendestelle setzt du f″ null. Der y-Wert kommt aus der Ausgangsfunktion, nicht aus f′ oder f″. Ob der Graph steigt oder fällt, sagt das Vorzeichen von f′: Diese Parabel ist nach oben geöffnet, also außerhalb ihrer Nullstellen positiv und dazwischen negativ.'
  },
  integrale: {
    1: 'Denke rückwärts: Exponent um 1 erhöhen und durch den neuen Exponenten teilen. Zur Probe leitest du deine Antwort ab – sie muss wieder f(x) ergeben.',
    2: 'Bilde die Stammfunktion (Exponent um 1 erhöhen, durch den neuen Exponenten teilen) und rechne dann F(obere) − F(untere).',
    3: 'Integriere jeden Summanden einzeln und rechne dann F(obere) − F(untere). Bei einer Geschwindigkeit v(t) ist die Fläche unter dem Graphen der zurückgelegte Weg.'
  },

  /* Uni: Stochastik */
  kombinatorik: {
    1: 'Wenn du in jedem Schritt frei wählst, multiplizierst du die Möglichkeiten der Schritte. Sollen alle Objekte angeordnet werden, ist es n! = n · (n − 1) · … · 1.',
    2: 'Zwei Fragen entscheiden: Spielt die Reihenfolge eine Rolle? Wird zurückgelegt? Ohne Reihenfolge führt der Weg über den Binomialkoeffizienten.',
    3: 'Mit Wiederholung rechnest du Anzahl hoch Länge, ohne Reihenfolge über den Binomialkoeffizienten – dort erst kürzen, dann multiplizieren. Bei Wörtern mit gleichen Buchstaben teilst du n! durch die Fakultäten der Wiederholungen.'
  },
  bedingte: {
    1: 'Die Bedingung schränkt ein, wer überhaupt noch mitzählt – genau diese Gruppe steht im Nenner. Zähle dann, wie viele davon die gefragte Eigenschaft haben.',
    2: 'Trage die Zahlen in eine Vierfeldertafel ein, dann liest du Zeilen- und Spaltensummen direkt ab. Für Unabhängigkeit prüfst du, ob P(A) · P(B) genau P(A ∩ B) ergibt.',
    3: 'Rechne mit absoluten Zahlen statt Prozenten – wähle z. B. 1000 Personen. Ein Baum mit beiden Wegen zeigt dir, welche Pfade du addieren musst und durch welche Gruppe du am Ende teilst.'
  },
  erwartungswert: {
    1: 'Multipliziere jeden möglichen Wert mit seiner Wahrscheinlichkeit und addiere alles.',
    2: 'Bei Spielen zählt der Gewinn: Auszahlung minus Einsatz. Rechne E(X) über alle Ausgänge – kommt 0 heraus, ist das Spiel fair.',
    3: 'Für die Varianz nimmst du die quadrierten Abstände zum Erwartungswert, gewichtet mit ihren Wahrscheinlichkeiten. Bei E(aX + b) ziehst du a einfach heraus: a · E(X) + b.'
  },
  binomial: {
    1: 'Vergiss den Binomialkoeffizienten nicht – er zählt, auf wie viele Arten die Treffer verteilt sein können. Fragt die Aufgabe dagegen, wie viele Treffer zu erwarten sind, genügt n · p.',
    2: 'Kläre zuerst n, p und k. Dann Binomialkoeffizient mal p hoch k mal (1 − p) hoch (n − k) – bei einer Erwartungsfrage reicht wieder n · p.',
    3: 'Bei „mindestens eine“ gehst du über das Gegenereignis: 1 minus der Wahrscheinlichkeit für gar keinen Treffer. Ist n gesucht, steht es im Exponenten – dann hilft der Logarithmus; teilst du durch den negativen Logarithmus, dreht sich das Zeichen, und am Ende wird aufgerundet. Für die Streuung gilt σ = √(n · p · (1 − p)).'
  },
  hypergeometrisch: {
    1: 'Ohne Zurücklegen! Nach dem ersten Zug liegt eine Kugel weniger in der Urne – multipliziere die beiden Wahrscheinlichkeiten entlang des Pfades.',
    2: 'Ohne Zurücklegen! Zähle günstige Auswahlen (Treffer mal Nieten) und teile durch alle möglichen Auswahlen.',
    3: 'Beim Lotto zählst du alle möglichen Ziehungen – ein Binomialkoeffizient – und fragst, wie viele davon passen. Für die erwartete Trefferzahl gilt E(X) = n · K/N.'
  },
  normalverteilung: {
    1: 'Zähle zuerst, wie viele σ das Intervall von μ aus abdeckt – für 1σ, 2σ und 3σ gibt es je eine feste Sigma-Regel. Und μ teilt die Glocke wegen ihrer Symmetrie in zwei gleich große Hälften.',
    2: 'Der z-Wert misst, wie viele σ ein Wert von μ entfernt liegt: z = (x − μ)/σ. Liegt x links von μ, wird z negativ.',
    3: 'Skizziere die Glocke und markiere den Bereich. Vom Rest außerhalb des Intervalls liegt nur die Hälfte über der Grenze. Die Sigma-Regeln gehen auch rückwärts: Ist der Anteil gegeben, folgt daraus die Schranke oder σ. Aus einem Anteil wird eine Stückzahl, indem du ihn auf die Gesamtzahl anwendest.'
  },
  deskriptiv: {
    1: 'Für den Modalwert zählst du ab, wie oft jeder Wert vorkommt – sortieren macht das Zählen leichter. Beim Notendurchschnitt gewichtest du jede Note mit ihrer Anzahl und teilst durch die Gesamtzahl.',
    2: 'Für s² bildest du die Abweichungen vom Mittelwert, quadrierst sie und mittelst. Beim Ausreißer rechnest du beide Mittelwerte aus und vergleichst sie.',
    3: 'Für Quartile zuerst sortieren: Q1 liegt in der Mitte der unteren Hälfte, Q3 in der Mitte der oberen. „Robust“ ist ein Kennwert dann, wenn ein einzelner Extremwert ihn kaum verschiebt.'
  }

};
