/* ============================================================
   MatheNils – App-Logik
   Routing (Hash), Rendering, Übungs-Flow, XP/Level/Streak,
   Speicherung in localStorage
   ============================================================ */
'use strict';

(function () {

  const STORAGE_KEY = 'mathenils-v1';
  // Die Seite hieß bis August 2026 „MatheHeld“. Wer damals geübt hat, hat seinen
  // Fortschritt unter dem alten Schlüssel liegen – er wird beim ersten Laden
  // übernommen. Ohne das wäre die Umbenennung für alle ein Datenverlust.
  const ALT_STORAGE_KEY = 'matheheld-v1';
  const XP_BY_DIFF = { 1: 10, 2: 15, 3: 25 };
  const DIFF_NAMES = { 1: 'Leicht', 2: 'Mittel', 3: 'Schwer' };
  const STAR_THRESHOLD = 8; // richtige Antworten pro Schwierigkeit für einen Stern

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return [...document.querySelectorAll(sel)]; }

  /** Strichsymbol aus dem Sprite in index.html – einfärbbar über currentColor. */
  function icon(name, extra = '') {
    return `<svg class="icon ${extra}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /**
   * Suchtext vereinheitlichen. „bruch“ soll „Brüche“ finden und „flaeche“
   * soll „Flächen“ finden – deshalb werden Akzente entfernt UND die
   * ae/oe/ue-Umschreibungen auf denselben Buchstaben gezogen. Weil Suchbegriff
   * und Kartentext durch dieselbe Funktion laufen, bleibt das in sich stimmig.
   */
  function suchNorm(s) {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ß/g, 'ss')
      .replace(/ae|oe|ue/g, m => m[0])
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  /** HTML zu reinem Text – für Ansagen an Screenreader. */
  /* Die Aufgabe IST die Seite und steht in Schaugröße – für „Berechne: 16,4 − 15,2“
     genau richtig. Eine Sachaufgabe mit 190 Zeichen wurde so aber zu sieben
     Zeilen à 40 px, mit „t“ und „= 2?“ auf getrennten Zeilen. Ab etwa zwei
     Zeilen Fließtext eine Stufe kleiner; der Hinweis (.hint) zählt nicht mit. */
  function frageKlasse(q) {
    const text = nurText(String(q).replace(/<span class="hint">[\s\S]*?<\/span>/g, ''));
    return text.length > 110 ? ' lang' : '';
  }

  function nurText(html) {
    const d = document.createElement('div');
    d.innerHTML = String(html == null ? '' : html);
    return d.textContent.replace(/\s+/g, ' ').trim();
  }

  /* ---------- Zustand (localStorage) ---------- */

  function defaultState() {
    return {
      xp: 0, theme: null, streak: { count: 0, last: null }, lastTopic: null, topics: {},
      activity: {},        // { 'JJJJ-MM-TT': Anzahl richtig gelöster Aufgaben }
      geuebt: {},          // { 'JJJJ-MM-TT': Anzahl beantworteter Aufgaben }
      badges: [],          // freigeschaltete Abzeichen-IDs
      challenge: null,     // Ergebnis der heutigen Tages-Challenge
      challengeLauf: null, // angefangene Tages-Challenge (Themen, Stufen, Punktestand)
      challengesDone: 0,
      serie: 0,            // laufende Folge richtiger Antworten über alle Modi
      bestSerie: 0         // längste je erreichte Folge
    };
  }

  /**
   * Gespeicherte Daten in eine gültige Form bringen. Nötig für Stände aus
   * älteren Versionen (denen z. B. byDiff fehlt) und für beschädigte Einträge –
   * ohne diese Prüfung würde die App beim Rendern abbrechen.
   */
  function sanitizeState(roh) {
    const s = Object.assign(defaultState(), (roh && typeof roh === 'object' && !Array.isArray(roh)) ? roh : {});
    const zahl = v => (typeof v === 'number' && isFinite(v) && v >= 0) ? v : 0;
    // Obergrenze für alles, was gezählt wird. Eine Milliarde XP entspricht rund
    // 50 Millionen richtigen Antworten – wer so viel mitbringt, hat die Datei
    // bearbeitet. Ohne Deckel wandern absurde Werte in Rechnungen und Textstellen.
    const OBERGRENZE = 1e9;
    const gedeckelt = v => Math.min(zahl(v), OBERGRENZE);

    s.xp = gedeckelt(s.xp);
    s.challengesDone = gedeckelt(s.challengesDone);
    s.serie = gedeckelt(s.serie);
    s.bestSerie = gedeckelt(s.bestSerie);
    if (!s.streak || typeof s.streak !== 'object') s.streak = { count: 0, last: null };
    s.streak.count = gedeckelt(s.streak.count);
    if (typeof s.streak.last !== 'string') s.streak.last = null;
    if (!Array.isArray(s.badges)) s.badges = [];
    s.badges = s.badges.filter(id => typeof id === 'string');
    if (!s.activity || typeof s.activity !== 'object' || Array.isArray(s.activity)) s.activity = {};
    if (s.theme !== 'light' && s.theme !== 'dark') s.theme = null;
    if (typeof s.lastTopic !== 'string') s.lastTopic = null;
    if (!s.topics || typeof s.topics !== 'object' || Array.isArray(s.topics)) s.topics = {};

    // Tageszähler: nur echte Datumsschlüssel mit Zahlwerten übernehmen. Die
    // Werte werden auf der Statistikseite als HTML ausgegeben – eine
    // manipulierte Sicherungsdatei könnte hier sonst Markup einschleusen,
    // das bei jedem weiteren Seitenaufruf erneut ausgeführt wird.
    const istDatum = k => /^\d{4}-\d{2}-\d{2}$/.test(k);
    const aktivitaet = {};
    for (const [k, v] of Object.entries(s.activity)) {
      if (istDatum(k)) aktivitaet[k] = gedeckelt(v);
    }
    s.activity = aktivitaet;

    // Die sieben Kästchen der Serie fragen „an diesem Tag geübt?“ – die Serie
    // selbst zählt ebenfalls jede beantwortete Aufgabe. Vorher lasen die
    // Kästchen aus `activity`, das nur bei RICHTIGEN Antworten wächst: An einem
    // Tag mit lauter Fehlversuchen zählte die Zahl weiter, das Kästchen blieb
    // leer. Für Stände aus der Zeit davor ist `activity` die beste Schätzung.
    if (!s.geuebt || typeof s.geuebt !== 'object' || Array.isArray(s.geuebt)) s.geuebt = kopie(s.activity);
    const geuebt = {};
    for (const [k, v] of Object.entries(s.geuebt)) {
      if (istDatum(k)) geuebt[k] = gedeckelt(v);
    }
    s.geuebt = geuebt;

    // Ergebnis der Tages-Challenge: ebenfalls streng, denn correct/total
    // stehen auf der Startseite und in der Auswertung im Text.
    const ch = s.challenge;
    if (!ch || typeof ch !== 'object' || Array.isArray(ch) || !istDatum(ch.date)) {
      s.challenge = null;
    } else {
      s.challenge = { date: ch.date, correct: zahl(ch.correct), total: zahl(ch.total) || 5, done: ch.done === true };
    }

    // Angefangene Tages-Challenge: Themen-IDs und Stufen müssen stimmen, sonst
    // lieber verwerfen und neu würfeln als mit halben Daten weiterlaufen.
    const cl = s.challengeLauf;
    const eintraegeOk = cl && Array.isArray(cl.eintraege) && cl.eintraege.length > 0 && cl.eintraege.length <= 10 &&
      cl.eintraege.every(e => e && typeof e.id === 'string' && (e.diff === 1 || e.diff === 2 || e.diff === 3));
    if (!cl || typeof cl !== 'object' || Array.isArray(cl) || !istDatum(cl.date) || !eintraegeOk) {
      s.challengeLauf = null;
    } else {
      s.challengeLauf = {
        date: cl.date,
        eintraege: cl.eintraege.map(e => ({ id: e.id, diff: e.diff })),
        saat: (typeof cl.saat === 'number' && isFinite(cl.saat)) ? cl.saat : null,
        index: zahl(cl.index),
        correct: zahl(cl.correct),
        results: Array.isArray(cl.results) ? cl.results.filter(r => typeof r === 'boolean') : []
      };
    }

    // Ältere Stände kennen bestSerie nicht. Damit niemand ein bereits
    // verdientes Abzeichen verliert, wird sie einmalig aus dem besten
    // Themenwert übernommen.
    let ausThemen = 0;
    for (const [id, t] of Object.entries(s.topics)) {
      if (!t || typeof t !== 'object') { delete s.topics[id]; continue; }
      t.correct = gedeckelt(t.correct);
      t.wrong = gedeckelt(t.wrong);
      t.bestRun = gedeckelt(t.bestRun);
      t.stufe = (t.stufe === 1 || t.stufe === 2 || t.stufe === 3) ? t.stufe : undefined;
      if (!t.byDiff || typeof t.byDiff !== 'object') t.byDiff = {};
      for (const d of [1, 2, 3]) {
        const bd = t.byDiff[d];
        t.byDiff[d] = { c: gedeckelt(bd && bd.c), w: gedeckelt(bd && bd.w) };
      }
      if (t.bestRun > ausThemen) ausThemen = t.bestRun;
    }
    if (s.bestSerie < ausThemen) s.bestSerie = ausThemen;
    return s;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return sanitizeState(JSON.parse(raw));

      // Noch nichts unter dem neuen Schlüssel: Stand aus der Zeit als
      // „MatheHeld“ übernehmen. Der alte Eintrag wird erst gelöscht, wenn der
      // neue nachweislich geschrieben ist – im Privatmodus schlägt das Schreiben
      // fehl, und dann wäre er sonst ersatzlos weg.
      const alt = localStorage.getItem(ALT_STORAGE_KEY);
      if (alt) {
        const stand = sanitizeState(JSON.parse(alt));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stand));
          if (localStorage.getItem(STORAGE_KEY)) localStorage.removeItem(ALT_STORAGE_KEY);
        } catch (e) { /* nicht schreibbar – der alte Eintrag bleibt liegen */ }
        return stand;
      }
    } catch (e) { /* defekte Daten -> frisch starten */ }
    return defaultState();
  }

  let state = loadState();

  /** Tiefe Kopie – der Zustand enthält ausschließlich einfache Werte. */
  function kopie(o) { return JSON.parse(JSON.stringify(o)); }

  // Der Stand, wie dieser Tab ihn zuletzt gelesen oder geschrieben hat. Alles,
  // was seitdem in localStorage dazugekommen ist, stammt aus einem anderen Tab.
  let letzterStand = kopie(state);

  // Merkt sich, ob das Speichern zuletzt fehlgeschlagen ist – damit die Warnung
  // genau einmal erscheint und nicht bei jeder Antwort erneut.
  let speicherDefekt = false;

  /**
   * Übernimmt in den eigenen Zustand, was ein anderer Tab seit `basis`
   * hinzugefügt hat. Zwei offene Tabs hielten je einen eigenen Schnappschuss;
   * wer zuletzt schrieb, machte den Fortschritt des anderen still zunichte –
   * gemessen: ein Tab mit drei beantworteten Challenge-Aufgaben verlor sie
   * vollständig, sobald der andere Tab eine einzige Aufgabe beantwortete.
   *
   * Zähler wachsen additiv, Bestwerte als Maximum, Abzeichen als Vereinigung.
   * Einzelwerte (Theme, zuletzt geübtes Thema, laufende Runde) behält der Tab,
   * der sie selbst geändert hat; sonst gewinnt der fremde Stand.
   */
  function fremdesUebernehmen(fremd, basis) {
    const zuwachs = (jetzt, vorher) => Math.max(0, (Number(jetzt) || 0) - (Number(vorher) || 0));
    const leer = { correct: 0, wrong: 0, bestRun: 0, byDiff: {} };

    state.xp += zuwachs(fremd.xp, basis.xp);
    state.challengesDone += zuwachs(fremd.challengesDone, basis.challengesDone);
    state.bestSerie = Math.max(state.bestSerie, fremd.bestSerie || 0);
    state.serie = Math.max(state.serie, fremd.serie || 0);
    state.streak.count = Math.max(state.streak.count, fremd.streak.count || 0);
    if ((fremd.streak.last || '') > (state.streak.last || '')) state.streak.last = fremd.streak.last;
    for (const b of fremd.badges) if (!state.badges.includes(b)) state.badges.push(b);

    for (const feld of ['activity', 'geuebt']) {
      for (const [tag, wert] of Object.entries(fremd[feld])) {
        const plus = zuwachs(wert, (basis[feld] || {})[tag]);
        if (plus) state[feld][tag] = (state[feld][tag] || 0) + plus;
      }
    }

    for (const [id, f] of Object.entries(fremd.topics)) {
      const b = basis.topics[id] || leer;
      const t = topicState(id);   // legt den Eintrag an, falls dieser Tab ihn nicht kennt
      t.correct += zuwachs(f.correct, b.correct);
      t.wrong += zuwachs(f.wrong, b.wrong);
      t.bestRun = Math.max(t.bestRun, f.bestRun || 0);
      if (t.stufe === undefined && f.stufe !== undefined) t.stufe = f.stufe;
      for (const d of [1, 2, 3]) {
        const fb = f.byDiff[d] || { c: 0, w: 0 };
        const bb = (b.byDiff && b.byDiff[d]) || { c: 0, w: 0 };
        t.byDiff[d].c += zuwachs(fb.c, bb.c);
        t.byDiff[d].w += zuwachs(fb.w, bb.w);
      }
    }

    for (const feld of ['theme', 'lastTopic', 'challenge', 'challengeLauf']) {
      const selbstGeaendert = JSON.stringify(state[feld]) !== JSON.stringify(basis[feld]);
      if (!selbstGeaendert) state[feld] = fremd[feld];
    }
  }

  /**
   * @param {boolean} ersetzen – true beim Zurücksetzen und beim Einspielen einer
   *   Sicherung. Dort ist das Überschreiben die Absicht; ein Zusammenführen
   *   würde den gerade gelöschten Stand wieder heraufholen.
   */
  function save(ersetzen = false) {
    try {
      if (!ersetzen) {
        const roh = localStorage.getItem(STORAGE_KEY);
        if (roh) fremdesUebernehmen(sanitizeState(JSON.parse(roh)), letzterStand);
      }
      // Nach dem Zusammenführen erneut durch die Prüfung: Sie deckelt jeden
      // gezählten Wert und hält die Form auch dann sauber, wenn im Speicher
      // etwas Unerwartetes stand.
      Object.assign(state, sanitizeState(state));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      letzterStand = kopie(state);
      if (speicherDefekt) { speicherDefekt = false; }
    } catch (e) {
      // Privatmodus, volles Kontingent, gesperrter Speicher: Bisher lief das
      // still ins Leere – man übte eine ganze Sitzung, ohne dass etwas ankam.
      if (!speicherDefekt) {
        speicherDefekt = true;
        toast('Dein Fortschritt kann nicht gespeichert werden. Im privaten Modus oder bei vollem Speicher geht er beim Schließen des Tabs verloren.');
      }
    }
  }

  function topicState(id) {
    if (!state.topics[id]) {
      state.topics[id] = { correct: 0, wrong: 0, bestRun: 0, byDiff: { 1: { c: 0, w: 0 }, 2: { c: 0, w: 0 }, 3: { c: 0, w: 0 } } };
    }
    return state.topics[id];
  }

  /* ---------- Level, XP, Streak ---------- */

  /**
   * Level, Fortschritt im Level und Bedarf bis zum nächsten – aus dem XP-Stand.
   *
   * Stufe L kostet 100 + (L − 1) · 50 XP, die Summe der ersten L Stufen also
   * 25L² + 75L. Das lässt sich nach L auflösen, statt hochzuzählen.
   *
   * Die frühere Schleife (`while (rest >= need) rest -= need`) lief bei großen
   * Werten **endlos**: Ab etwa 10^18 ändert `rest -= need` in Gleitkomma nichts
   * mehr, die Abbruchbedingung wird also nie wahr. Eine von Hand bearbeitete
   * Sicherungsdatei mit `xp: 1e308` fror damit den Tab ein – ohne Fehlermeldung,
   * an der die Auffangseite hätte greifen können.
   */
  function levelInfo(xp) {
    const gesamt = L => 25 * L * L + 75 * L;   // XP für die ersten L Stufen
    let L = Math.floor((Math.sqrt(5625 + 100 * xp) - 75) / 50);
    if (!Number.isFinite(L) || L < 0) L = 0;
    // Die Wurzel kann um eine Stelle danebenliegen – in beide Richtungen nachziehen.
    while (gesamt(L + 1) <= xp) L++;
    while (L > 0 && gesamt(L) > xp) L--;
    return { level: L + 1, into: xp - gesamt(L), need: 100 + L * 50 };
  }

  const LEVEL_TITEL = ['Zahlen-Neuling', 'Rechen-Rookie', 'Formel-Fuchs', 'Term-Bändiger', 'Gleichungs-Profi',
    'Funktionen-Kenner', 'Wurzel-Ritter', 'Mathe-Magier', 'Zahlen-Zauberer', 'Mathe-Legende'];

  function levelTitel(level) {
    return LEVEL_TITEL[Math.min(level - 1, LEVEL_TITEL.length - 1)];
  }

  function dayStr(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return dayStr(d);
  }

  function updateStreak() {
    const today = dayStr();
    if (state.streak.last === today) return;
    state.streak.count = state.streak.last === yesterdayStr() ? state.streak.count + 1 : 1;
    state.streak.last = today;
  }

  function displayStreak() {
    return (state.streak.last === dayStr() || state.streak.last === yesterdayStr()) ? state.streak.count : 0;
  }

  function addXp(amount) {
    const before = levelInfo(state.xp).level;
    state.xp += amount;
    const after = levelInfo(state.xp).level;
    if (after > before) {
      confettiBurst();
      toast(`Level ${after} erreicht`);
    }
  }

  /* ---------- Sterne pro Thema ---------- */

  function starsFor(id) {
    const ts = state.topics[id];
    if (!ts) return 0;
    let s = 0;
    for (const d of [1, 2, 3]) {
      if (ts.byDiff[d] && ts.byDiff[d].c >= STAR_THRESHOLD) s++;
    }
    return s;
  }

  function starsHTML(n) {
    // title allein erreicht weder Screenreader noch Touch-Geräte zuverlässig –
    // deshalb zusätzlich ein aria-label mit dem tatsächlichen Stand.
    return `<span class="stars" role="img" aria-label="${n} von 3 Sternen – ein Stern je Schwierigkeitsstufe ab ${STAR_THRESHOLD} richtigen Antworten"` +
      ` title="Ein Stern pro Schwierigkeitsstufe ab ${STAR_THRESHOLD} richtigen Antworten">` +
      `${'<i class="voll"></i>'.repeat(n)}${'<i></i>'.repeat(3 - n)}</span>`;
  }

  /* ---------- Routing ---------- */

  function currentRoute() {
    const h = location.hash || '#/';
    const m = h.match(/^#\/thema\/([\w-]+)(?:\/(lernen|ueben))?$/);
    if (m) return { view: 'topic', id: m[1], tab: m[2] || null };
    if (h === '#/statistik') return { view: 'stats' };
    if (h === '#/challenge') return { view: 'challenge' };
    if (h === '#/training') return { view: 'training' };
    if (h === '#/formeln') return { view: 'formeln' };
    return { view: 'home' };
  }

  /* ---------- Übungs-Session (flüchtig, pro Thema) ---------- */

  let practice = null;

  function ensurePractice(topicId) {
    if (!practice || practice.topicId !== topicId) {
      // Zuletzt gewählte Stufe des Themas wiederaufnehmen: Wer auf „Schwer“
      // geübt hat, landete nach einem Ausflug ins Kapitel wieder bei „Leicht“.
      const gemerkt = state.topics[topicId] && state.topics[topicId].stufe;
      practice = { topicId, diff: gemerkt || 1, task: null, done: false, lastResult: null, lastInput: '',
        correct: 0, wrong: 0, run: 0, verlauf: [],
        attempt: 0, retry: false, wrongChoices: [], tippOffen: false, hinweis: null, diagnose: null };
      practice.task = newTask();
    }
    return practice;
  }

  function newTask() {
    const topic = TOPICS.find(t => t.id === practice.topicId);
    if (!Array.isArray(practice.letzteFragen)) practice.letzteFragen = [];
    let task = topic.gen(practice.diff);
    // Zuletzt gestellte Fragen möglichst meiden. Bei Themen mit wenigen
    // Varianten wird nach einigen Versuchen bewusst aufgegeben, damit es
    // niemals hängt – lieber eine Wiederholung als eine Endlosschleife.
    for (let i = 0; i < 12 && practice.letzteFragen.includes(task.q); i++) {
      task = topic.gen(practice.diff);
    }
    practice.letzteFragen.push(task.q);
    if (practice.letzteFragen.length > 5) practice.letzteFragen.shift();
    return task;
  }

  /* ---------- Rendering ---------- */

  const app = $('#app');

  /** Auffangseite, falls beim Rendern doch einmal etwas schiefgeht. */
  function renderFehler(e) {
    // Die kaputte Ansicht darf ihre Spuren nicht behalten: Ohne das hier bleibt
    // body[data-view] auf „ueben“ stehen (kein Mesh, keine Tab-Leiste) und in
    // der Fußleiste leuchtet weiter der Reiter, der gerade gescheitert ist.
    document.body.dataset.view = 'fehler';
    document.querySelectorAll('[data-nav]').forEach(a => a.removeAttribute('aria-current'));
    app.innerHTML = `
      <div class="challenge-wrap">
        <div class="task-card challenge-result">
          <div class="result-emoji">🛠️</div>
          <h1>Da ist etwas schiefgelaufen</h1>
          <p class="result-note">Diese Ansicht konnte nicht geladen werden. Meist hilft schon
          ein Wechsel zurück zur Themenübersicht. Bleibt das Problem bestehen, kannst du den
          gespeicherten Fortschritt zurücksetzen.</p>
          <p class="result-note"><code>${escapeAttr(String(e && e.message || e))}</code></p>
          <div class="next-row">
            <a class="btn btn-primary" href="#/">Zur Übersicht</a>
            <button class="btn btn-danger" id="notReset">Fortschritt zurücksetzen</button>
          </div>
        </div>
      </div>`;
    const btn = $('#notReset');
    if (btn) btn.addEventListener('click', () => {
      if (confirm('Gespeicherten Fortschritt wirklich löschen?')) {
        try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* egal */ }
        location.hash = '#/';
        location.reload();
      }
    });
  }

  function render() {
    const paint = () => {
      try { paintInner(); } catch (e) { renderFehler(e); }
    };
    const paintInner = () => {
      const route = currentRoute();
      if (route.view === 'topic') {
        const topic = TOPICS.find(t => t.id === route.id);
        // location.hash = … legt einen NEUEN History-Eintrag an: Die Zurück-Taste
        // führte auf die kaputte Adresse und von dort sofort wieder nach vorn.
        // replace tauscht den fehlerhaften Eintrag aus, statt ihn zu behalten.
        if (!topic) { location.replace('#/'); return; }
        renderTopic(topic, route.tab);
      } else if (route.view === 'stats') {
        renderStats();
      } else if (route.view === 'challenge') {
        renderChallenge('daily');
      } else if (route.view === 'training') {
        renderTraining();
      } else if (route.view === 'formeln') {
        renderFormeln();
      } else {
        renderHome();
      }
      // Steuert Mesh-Hintergrund, Tab-Leiste und Fußzeile. Im Übungsmodus ist
      // der Bildschirm bewusst still – dort ist Konzentration die Funktion.
      document.body.dataset.view = route.view === 'topic'
        ? (standardTab(route.id, route.tab) === 'ueben' ? 'ueben' : 'thema')
        : route.view;
      renderHeader();
      window.scrollTo(0, 0);
      setupReveal();
      // Fokus an den Seitenanfang, damit Screenreader und Tastatur dem Wechsel folgen –
      // außer die Ansicht hat bewusst etwas fokussiert: das Eingabefeld oder die
      // erste Antwortmöglichkeit in der Aufgabenkarte, oder das Suchfeld, wenn
      // der Weg über die Lupe im Kopf kam.
      const aktiv = document.activeElement;
      if (!aktiv || !aktiv.closest || !aktiv.closest('#taskCard, .tabs, .search-row')) app.focus({ preventScroll: true });
    };
    // Sanfter Übergang zwischen Seiten, wo der Browser es unterstützt
    // Sanfter Seitenübergang – nur bei sichtbarem Tab, mit Sicherheitsnetz:
    // Falls der Browser keine Frames rendert (Hintergrund-Tab, Drosselung),
    // wird die Transition nach 500 ms hart beendet, damit nie ein Overlay hängen bleibt.
    if (document.startViewTransition && document.visibilityState === 'visible' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const vt = document.startViewTransition(paint);
      // Ein abgebrochener Übergang lehnt diese Promises ab – das ist gewollt und
      // darf keine unbehandelte Rejection in der Konsole erzeugen.
      ['ready', 'finished', 'updateCallbackDone'].forEach(p => {
        if (vt && vt[p] && typeof vt[p].catch === 'function') vt[p].catch(() => {});
      });
      setTimeout(() => {
        try { if (vt && vt.skipTransition) vt.skipTransition(); } catch (e) { /* schon fertig */ }
      }, 500);
    } else {
      paint();
    }
  }

  /* Themen-Gruppen erst beim Scrollen einblenden (robust ohne Observer) */
  let revealFallbackTimer = null;
  function setupReveal() {
    revealCheck();
    // Sicherheitsnetz: spätestens nach 2,5 s ist alles sichtbar
    clearTimeout(revealFallbackTimer);
    revealFallbackTimer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
    }, 2500);
  }
  function revealCheck() {
    for (const el of document.querySelectorAll('.reveal:not(.in)')) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) el.classList.add('in');
    }
  }

  /* Die Fußzeile nannte „33 Themen“, als es längst 46 waren – die Zahl stand
     fest im HTML. Jetzt kommt sie aus der Themenliste selbst. */
  const themenZahl = document.getElementById('themenZahl');
  if (themenZahl) themenZahl.textContent = String(TOPICS.length);

  function renderHeader() {
    const li = levelInfo(state.xp);
    $('#levelNum').textContent = `Lv ${li.level}`;
    // XP ist jetzt die 3-px-Linie unter der Kopfzeile statt Balken plus Text.
    $('#xpFill').style.width = `${Math.round(li.into / li.need * 100)}%`;
    $('#xpFill').parentElement.setAttribute('aria-label',
      `Level ${li.level}, ${li.into} von ${li.need} XP`);
    const route = currentRoute();
    // Beide Navigationen (Kopfzeile ab 720 px, Tab-Leiste darunter) markieren.
    $$('[data-nav]').forEach(a => {
      const key = a.getAttribute('data-nav');
      const aktiv =
        (key === 'home' && (route.view === 'home' || route.view === 'topic')) ||
        (key === 'stats' && route.view === 'stats') ||
        (key === 'challenge' && (route.view === 'challenge' || route.view === 'training')) ||
        (key === 'formeln' && route.view === 'formeln');
      if (aktiv) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* ---------- Startseite ---------- */

  // Merkt sich Filter und Suchtext über Seitenwechsel hinweg, dazu den Wunsch
  // der Lupe im Kopf, den Fokus ins Suchfeld zu setzen.
  let stufe = 'alle';
  let suchText = '';
  let suchFokusGewuenscht = false;

  function renderHome() {
    const lt = state.lastTopic ? TOPICS.find(t => t.id === state.lastTopic) : null;
    const heute = state.challenge && state.challenge.date === dayStr();
    const chDone = heute && state.challenge.done;
    // Ein angefangener Lauf ist ein eigener Zustand. Ohne ihn sah ein halb
    // gespielter Tag aus wie ein unbegonnener – samt Bonusversprechen, das
    // rechnerisch längst nicht mehr zu erreichen war.
    const lauf = (!chDone && state.challengeLauf && state.challengeLauf.date === dayStr())
      ? state.challengeLauf : null;
    const chCorrect = chDone ? state.challenge.correct : (lauf ? lauf.correct : 0);
    const offen = lauf ? Math.max(0, 5 - lauf.results.length) : 5;
    const bonusMoeglich = !lauf || (lauf.correct + offen) >= 4;
    const reco = empfehlung();

    // Serie als sieben Kästchen: zeigt nicht nur die Zahl, sondern auch,
    // welcher Tag der letzten Woche fehlt.
    const wocheTage = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      wocheTage.push(!!(state.geuebt && state.geuebt[dayStr(d)]));
    }
    const serie = displayStreak();

    // Laufende Nummer über alle Gruppen hinweg: 01 … 33. Sie ist die
    // Orientierung, die vorher nur durch Scrollen entstand.
    let nr = 0;

    app.innerHTML = `
      <h1 class="sr-only">MatheNils – ${TOPICS.length} Themen von der Unterstufe bis zur Uni</h1>
      <a class="challenge-band" href="#/challenge">
        <div style="flex:1">
          <div class="ch-label">Tages-Challenge</div>
          <h2>${chDone ? 'Heute geschafft' : lauf ? `Weiter – noch ${offen} von 5` : '5 Aufgaben, gemischt'}</h2>
          <div class="ch-dots">
            ${[0, 1, 2, 3, 4].map(i => {
              if (!chDone && lauf && i < lauf.results.length) return `<span class="ch-dot ${lauf.results[i] ? 'done' : 'miss'}" aria-hidden="true"></span>`;
              return `<span class="ch-dot ${i < chCorrect ? 'done' : ''}" aria-hidden="true"></span>`;
            }).join('')}
            <span class="ch-meta">${chDone ? `${state.challenge.correct}/${state.challenge.total} richtig`
              : bonusMoeglich ? '+25 XP ab 4 richtigen' : 'Runde zu Ende spielen'}</span>
          </div>
        </div>
        ${icon('weiter', 'icon-lg')}
      </a>

      <div class="serie-zeile">
        <span class="serie-punkte" role="img" aria-label="Übungs-Serie: ${serie} ${serie === 1 ? 'Tag' : 'Tage'} in Folge">
          ${wocheTage.map(an => `<i class="${an ? 'an' : ''}"></i>`).join('')}
        </span>
        <span class="serie-text">${serie} ${serie === 1 ? 'Tag' : 'Tage'} in Folge</span>
      </div>

      ${lt ? `
      <a class="weiter-zeile" href="#/thema/${lt.id}/ueben">
        <span class="topic-icon-tile ${lt.grad || 'g-mittel'} mini" aria-hidden="true">${lt.icon}</span>
        <span class="titel">${lt.title}<span class="meta">zuletzt geübt · ${state.topics[lt.id] ? state.topics[lt.id].correct : 0} richtig</span></span>
        ${icon('weiter')}
      </a>` : ''}

      ${reco ? `
        <div class="reco-zeile">
          <a class="reco-banner" href="#/thema/${reco.t.id}/ueben">
            <span class="topic-icon-tile ${reco.t.grad || 'g-mittel'} mini" aria-hidden="true">${reco.t.icon}</span>
            <span><strong>Empfohlen:</strong> ${reco.t.title} – deine Quote liegt bei ${Math.round(reco.q * 100)} %.</span>
          </a>
          <a class="btn btn-ghost reco-training" href="#/training">Schwächen trainieren</a>
        </div>` : ''}

      <div class="search-row">
        ${icon('suche')}
        <input id="topicSearch" class="search-input" type="search"
               placeholder="Thema suchen, z. B. Brüche"
               aria-label="Thema suchen" value="${escapeAttr(suchText)}">
      </div>
      <p class="such-leer" id="suchLeer" hidden></p>

      <div class="stufen-filter" role="group" aria-label="Nach Klassenstufe filtern">
        <button data-stufe="alle" aria-pressed="${stufe === 'alle'}">Alle ${TOPICS.length}</button>
        ${STUFEN_FILTER.map(f => `<button data-stufe="${f.grad}" aria-pressed="${stufe === f.grad}">${f.label}</button>`).join('')}
      </div>

      ${TOPIC_GROUPS.map(g => `
        <section class="topic-group reveal ${g.grad}" data-stufe="${(g.stufen || [g.grad]).join(' ')}">
          <div class="group-head">
            <h2>${g.title}</h2>
            <span class="rule"></span>
            <span class="group-count">${g.topics.length}</span>
          </div>
          <div class="topic-grid">
            ${g.topics.map((t, i) => {
              nr++;
              const ts = state.topics[t.id];
              const barPct = Math.min(100, Math.round((ts ? ts.correct : 0) / (STAR_THRESHOLD * 3) * 100));
              return `
                <a class="topic-card ${g.grad}" href="#/thema/${t.id}"
                   style="--i:${Math.min(i, 9)}"
                   data-such="${escapeAttr(suchNorm(`${t.title} ${t.tagline} ${t.klasse || ''} ${t.schlagworte || ''}`))}">
                  <div class="kopf">
                    <span class="topic-icon-tile" aria-hidden="true">${t.icon}</span>
                    <span class="topic-num">${String(nr).padStart(2, '0')}</span>
                  </div>
                  <h3>${t.title}</h3>
                  <div class="progressbar"><span style="width:${barPct}%"></span></div>
                </a>`;
            }).join('')}
          </div>
        </section>`).join('')}`;

    /* --- Suche und Stufenfilter greifen ineinander ---------------------
       Beide schränken dieselbe Kartenmenge ein. Deshalb entscheidet eine
       gemeinsame Funktion, was sichtbar ist – sonst würde der eine den
       anderen beim nächsten Tastendruck wieder aufheben. */
    // Filter und Suchtext liegen außerhalb dieser Funktion, damit sie einen
    // Ausflug in ein Thema überleben: Wer die Oberstufe gefiltert hat, will nach
    // dem Zurück nicht wieder alle 33 Karten sortieren.
    const suchFeld = $('#topicSearch');
    const leerHinweis = $('#suchLeer');

    function anwenden(ansagen) {
      const roh = suchFeld.value.trim();
      // Mehrere Wörter dürfen in beliebiger Reihenfolge stehen: Alle müssen
      // vorkommen, keines muss am Stück getroffen werden.
      const woerter = suchNorm(roh).split(' ').filter(Boolean);
      $$('.reveal').forEach(el => el.classList.add('in'));
      let treffer = 0;
      $$('.topic-group').forEach(g => {
        // data-stufe kann mehrere Stufen tragen (die Stochastik gehört zur
        // Oberstufe UND zum Uni-Teil), deshalb kein Vergleich, sondern Enthalten.
        const stufePasst = stufe === 'alle' || g.dataset.stufe.split(' ').includes(stufe);
        let sichtbareKarten = 0;
        g.querySelectorAll('.topic-card').forEach(card => {
          const heuhaufen = card.dataset.such || '';
          const passt = stufePasst && (!woerter.length || woerter.every(w => heuhaufen.includes(w)));
          card.hidden = !passt;
          if (passt) { sichtbareKarten++; treffer++; }
        });
        g.hidden = sichtbareKarten === 0;
      });
      // Ohne diese Meldung verschwinden bei einem Tippfehler einfach alle
      // 33 Karten und die Seite sieht kaputt aus.
      if (treffer === 0) {
        // „Kein Thema passt zu Brüche“ war schlicht falsch, wenn nur der
        // Stufenfilter im Weg stand. Deshalb wird hier ohne Filter nachgezählt.
        const woanders = !woerter.length ? 0 : $$('.topic-card')
          .filter(c => woerter.every(w => (c.dataset.such || '').includes(w))).length;
        leerHinweis.hidden = false;
        leerHinweis.textContent = !roh
          ? 'In dieser Klassenstufe ist nichts vorhanden.'
          : woanders
            ? `„${roh}“ gibt es, aber in einer anderen Klassenstufe – ${woanders === 1 ? 'ein Thema' : woanders + ' Themen'}. Stell den Filter auf „Alle“.`
            : `Kein Thema passt zu „${roh}“. Versuch es mit einem anderen Wort.`;
      } else {
        leerHinweis.hidden = true;
      }
      if (ansagen) ansage(treffer === 0 ? leerHinweis.textContent
        : treffer === 1 ? 'Ein Thema' : `${treffer} Themen`);
    }

    suchFeld.addEventListener('input', () => { suchText = suchFeld.value; anwenden(true); });
    anwenden(false);   // gemerkten Filter und Suchtext sofort anwenden

    if (suchFokusGewuenscht) {
      suchFokusGewuenscht = false;
      suchFeld.focus();
      suchFeld.scrollIntoView({ block: 'center' });
    }

    // Der Filter blendet ganze Gruppen aus, statt zu scrollen: Wer in der
    // Oberstufe sucht, soll die Unterstufe gar nicht erst sehen.
    $$('.stufen-filter button').forEach(b => {
      b.addEventListener('click', () => {
        stufe = b.dataset.stufe;   // bleibt gemerkt, siehe oben
        $$('.stufen-filter button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        anwenden(true);
      });
    });
  }

  /* ---------- Themenseite ---------- */

  // Merkt sich, dass der Reiter per Pfeiltaste gewechselt wurde – dann muss der
  // Fokus auf den neuen Reiter wandern statt an den Seitenanfang.
  let reiterFokus = false;

  /**
   * Welcher Reiter ist gemeint, wenn die Route keinen nennt? Wer im Thema schon
   * geübt hat, landet im Übungsteil, alle anderen im Kapitel. Steht hier, weil
   * auch body[data-view] diese Antwort braucht.
   */
  function standardTab(topicId, tabParam) {
    if (tabParam) return tabParam;
    const ts = state.topics[topicId];
    return (ts && ts.correct + ts.wrong > 0) ? 'ueben' : 'lernen';
  }

  function renderTopic(topic, tabParam) {
    const tab = standardTab(topic.id, tabParam);

    app.innerHTML = `
      <div class="topic-view">
      <div class="breadcrumb"><a href="#/">${icon('zurueck')}Alle Themen</a></div>
      <div class="topic-head ${topic.grad || 'g-mittel'}">
        <span class="topic-icon-tile">${topic.icon}</span>
        <div class="head-titel">
          <h1>${topic.title}</h1>
          <p class="tagline">${topic.tagline}</p>
        </div>
        <div class="head-right">
          ${starsHTML(starsFor(topic.id))}
          <span class="klasse-badge">${topic.klasse || ''}</span>
        </div>
      </div>
      <div class="tabs" role="tablist" aria-label="Lernen oder Üben">
        <button class="tab-btn ${tab === 'lernen' ? 'active' : ''}" data-tab="lernen"
          role="tab" id="tab-lernen" aria-selected="${tab === 'lernen'}" aria-controls="tabContent"
          tabindex="${tab === 'lernen' ? '0' : '-1'}">${icon('lernen')}Lernen</button>
        <button class="tab-btn ${tab === 'ueben' ? 'active' : ''}" data-tab="ueben"
          role="tab" id="tab-ueben" aria-selected="${tab === 'ueben'}" aria-controls="tabContent"
          tabindex="${tab === 'ueben' ? '0' : '-1'}">${icon('ueben')}Üben</button>
      </div>
      <div id="tabContent" role="tabpanel" aria-labelledby="tab-${tab}"></div>
      </div>`;

    app.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => { location.hash = `#/thema/${topic.id}/${btn.dataset.tab}`; });
      // Links/Rechts wechselt den Reiter – so erwartet es die Tastaturbedienung
      // bei role="tablist".
      btn.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        reiterFokus = true;
        location.hash = `#/thema/${topic.id}/${btn.dataset.tab === 'lernen' ? 'ueben' : 'lernen'}`;
      });
    });

    if (tab === 'lernen') renderLearn(topic);
    else renderPractice(topic);

    if (reiterFokus) {
      reiterFokus = false;
      const aktiv = app.querySelector('.tab-btn.active');
      if (aktiv) aktiv.focus({ preventScroll: true });
    }
  }

  function renderLearn(topic) {
    $('#tabContent').innerHTML = `
      <article class="learn-content ${topic.grad || 'g-mittel'}" id="learnArticle">
        ${topic.learn}
        <div class="learn-cta">
          <p class="cta-text">Alles verstanden? Dann probier es direkt aus – die Aufgaben passen genau zu diesem Kapitel.</p>
          <button class="btn btn-primary" id="goPractice">${icon('ueben')}Jetzt üben</button>
        </div>
      </article>`;

    const art = $('#learnArticle');

    // Illustration hinter dem Einleitungsabsatz einsetzen
    const figur = (typeof LEARN_FIGURES !== 'undefined') ? LEARN_FIGURES[topic.id] : null;
    if (figur) {
      const intro = art.querySelector('h2 + p');
      if (intro) intro.insertAdjacentHTML('afterend', figur);
    }

    // Erklärvideos zum Thema (ERKLAERVIDEOS in topics-index.js): hinter die
    // Illustration, sonst hinter den Einleitungsabsatz – dort, wo man noch
    // entscheidet, ob man lieber liest oder schaut.
    const videos = (typeof ERKLAERVIDEOS !== 'undefined' && ERKLAERVIDEOS[topic.id]) || [];
    if (videos.length) {
      const anker = art.querySelector('.fig-wrap') || art.querySelector('h2 + p');
      if (anker) anker.insertAdjacentHTML('afterend', `
        <aside class="video-hinweis" aria-label="Erklärvideos auf YouTube">
          <p class="video-titel">${videos.length > 1 ? 'Erklärvideos' : 'Erklärvideo'} auf YouTube</p>
          <ul>${videos.map(v => `<li><a href="https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}" rel="noopener">${escapeAttr(v.titel)}</a></li>`).join('')}</ul>
        </aside>`);
    }

    // Beispiele durchnummerieren: „Beispiel 3 · Kreis“
    const beispiele = art.querySelectorAll('.example-box');
    beispiele.forEach((box, i) => {
      const titel = box.querySelector('.ex-title');
      if (!titel) return;
      // Kindknoten umhängen statt textContent kopieren: Sonst gehen <sub> und
      // <sup> verloren – aus „x<sub>1</sub>x<sub>2</sub>-Ebene" wurde „x1x2“,
      // und die Schrift setzt x zwischen zwei Ziffern als Malkreuz: „x1×2-Ebene“.
      const name = document.createElement('span');
      name.className = 'ex-name';
      name.append(...titel.childNodes);
      const erster = name.firstChild;
      if (erster && erster.nodeType === Node.TEXT_NODE)
        erster.data = erster.data.replace(/^\s*Beispiele?\s*\d*\s*[:·–-]?\s*/i, '');
      const nummer = document.createElement('span');
      nummer.className = 'ex-num';
      nummer.textContent = beispiele.length > 1 ? `Beispiel ${i + 1}` : 'Beispiel';
      titel.appendChild(nummer);
      if (name.textContent.trim()) titel.appendChild(name);
    });

    // Kapitel-Menü aus den Zwischenüberschriften
    const kapitel = [...art.querySelectorAll('h3')];
    if (kapitel.length >= 2) {
      const nav = document.createElement('nav');
      nav.className = 'learn-toc';
      nav.setAttribute('aria-label', 'Kapitel dieser Seite');
      kapitel.forEach((h, i) => {
        h.id = `kap-${topic.id}-${i}`;
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.textContent = h.textContent;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        nav.appendChild(a);
      });
      const anker = art.querySelector('.fig-wrap') || art.querySelector('h2 + p') || art.querySelector('h2');
      anker.insertAdjacentElement('afterend', nav);
    }

    $('#goPractice').addEventListener('click', () => { location.hash = `#/thema/${topic.id}/ueben`; });
  }

  /* ---------- Üben ---------- */

  function renderPractice(topic) {
    const pr = ensurePractice(topic.id);
    const el = $('#tabContent');

    el.innerHTML = `
      <div class="practice-bar">
        <div class="diff-chips">
          ${[1, 2, 3].map(d => `<button class="chip ${pr.diff === d ? 'active' : ''}" data-diff="${d}"><span class="dot d${d}"></span>${DIFF_NAMES[d]}</button>`).join('')}
        </div>
        <div class="session-stats" role="group"
             aria-label="Stand dieser Runde">
          <span class="sr-only">${pr.correct} richtig, ${pr.wrong} falsch, Serie ${pr.run}</span>
          ${(() => {
            // Nur die letzten acht Aufgaben als Striche: Die Lücken dazwischen
            // schrumpfen nicht mit, ab etwa zehn Einträgen wären die Striche
            // 0 px breit und die Zeile liefe über.
            const fenster = pr.verlauf.slice(-8);
            return fenster.map(v => `<i class="${v ? 'ok' : 'err'}"></i>`).join('') +
                   '<i></i>'.repeat(8 - fenster.length);
          })()}
          <span class="serie">${pr.correct}/${pr.correct + pr.wrong} · Serie ${pr.run}</span>
        </div>
      </div>
      <div class="task-card ${topic.grad || ''}" id="taskCard">
        <div class="task-label">Aufgabe ${pr.correct + pr.wrong + (pr.done ? 0 : 1)} · ${DIFF_NAMES[pr.diff]}</div>
        <div class="task-question${frageKlasse(pr.task.q)}">${pr.task.q}</div>
        <div id="answerArea"></div>
        ${(!pr.done && !pr.retry && tippText(topic, pr.diff)) ? `
          <div class="tipp-zone">
            <button class="tipp-btn" id="tippBtn" aria-expanded="${pr.tippOffen}" aria-controls="tippText">${icon('tipp')}Tipp ${pr.tippOffen ? 'ausblenden' : 'anzeigen'}</button>
            ${pr.tippOffen ? `<p class="tipp-text" id="tippText">${tippText(topic, pr.diff)}</p>` : ''}
          </div>` : ''}
        <div id="feedbackArea"></div>
        ${(pr.done || pr.attempt > 0) ? '' : '<div class="skip-row"><button class="skip-btn" id="skipBtn">Andere Aufgabe ↻</button></div>'}
      </div>`;

    el.querySelectorAll('.chip').forEach(c => {
      c.addEventListener('click', () => {
        pr.diff = Number(c.dataset.diff);
        topicState(topic.id).stufe = pr.diff;
        save();
        // Andere Stufe, andere Runde. Vorher wurde nur die Strichzeile geleert –
        // daneben stand dann weiter „5/7 · Serie 3“ und „Aufgabe 8“, also drei
        // Angaben zu einer Runde, die es nicht mehr gab.
        pr.verlauf = []; pr.correct = 0; pr.wrong = 0; pr.run = 0;
        nextTask(topic);
      });
    });

    const skip = $('#skipBtn');
    if (skip) skip.addEventListener('click', () => nextTask(topic));

    const tippBtn = $('#tippBtn');
    if (tippBtn) tippBtn.addEventListener('click', () => {
      // Halbfertige Eingabe retten: Das Neuzeichnen der Karte würde sonst
      // löschen, was schon getippt war – ausgerechnet beim Blick auf den Tipp.
      const feld = $('#answerInput');
      if (feld) pr.lastInput = feld.value;
      pr.tippOffen = !pr.tippOffen;
      renderPractice(topic);
      // renderPractice ersetzt den Knopf durch einen neuen Knoten, und
      // renderAnswerArea zieht den Fokus danach ins Antwortfeld. Wer den Tipp
      // per Tastatur aufklappte, verlor ihn also sofort wieder – und der Tipp
      // selbst wurde nirgends angesagt.
      const neu = $('#tippBtn');
      if (neu) neu.focus({ preventScroll: true });
      if (pr.tippOffen) {
        const text = tippText(topic, pr.diff);
        if (text) ansage(`Tipp: ${nurText(text)}`);
      }
    });

    renderAnswerArea(topic);
    renderFeedback(topic);
  }

  /**
   * Tipp zum Thema. TOPIC_TIPPS[id] darf ein einzelner Text sein oder ein
   * Objekt {1, 2, 3} mit einem Tipp je Schwierigkeitsstufe – die Stufen eines
   * Themas stellen sehr verschiedene Aufgaben, ein Tipp passt selten auf alle.
   */
  function tippText(topic, stufe) {
    if (typeof TOPIC_TIPPS === 'undefined') return null;
    const eintrag = TOPIC_TIPPS[topic.id];
    if (!eintrag) return null;
    if (typeof eintrag === 'string') return eintrag;
    return eintrag[stufe] || eintrag[1] || null;
  }

  function renderAnswerArea(topic) {
    const pr = practice;
    const area = $('#answerArea');

    if (pr.task.type === 'choice') {
      const KEYS = ['A', 'B', 'C', 'D', 'E'];
      area.innerHTML = `<div class="choice-grid">
        ${pr.task.options.map((o, i) => {
          const schonFalsch = pr.wrongChoices.includes(i);
          return `<button class="choice-btn" data-i="${i}" ${(pr.done || schonFalsch) ? 'disabled' : ''}><span class="choice-key">${KEYS[i] || ''}</span><span class="choice-text">${o}</span></button>`;
        }).join('')}
      </div>`;
      area.querySelectorAll('.choice-btn').forEach(btn => {
        const i = Number(btn.dataset.i);
        if (pr.done) {
          if (i === pr.task.correct) btn.classList.add('is-correct');
          else if (pr.wrongChoices.includes(i)) btn.classList.add('is-wrong');
        } else if (pr.wrongChoices.includes(i)) {
          btn.classList.add('is-wrong');
        } else {
          btn.addEventListener('click', () => submitAnswer(topic, i));
        }
      });
      // Fokus in die Aufgabe setzen – wie im Eingabe-Zweig weiter unten. Ohne
      // das landet der Fokus nach Stufenwechsel, Überspringen oder erstem
      // Fehlversuch auf <body>, und die Tastaturbedienung beginnt von vorn.
      if (!pr.done) {
        const erster = area.querySelector('.choice-btn:not([disabled])');
        if (erster) erster.focus({ preventScroll: true });
      }
      return;
    }

    area.innerHTML = `
      <form class="answer-form" id="answerForm">
        <input class="answer-input" id="answerInput" type="text" autocomplete="off" spellcheck="false"
          placeholder="${escapeAttr(pr.task.placeholder || 'Antwort')}" aria-label="Deine Antwort"
          ${pr.done ? 'disabled' : ''} value="${escapeAttr(pr.lastInput || '')}">
        ${pr.done ? '' : '<button class="btn btn-primary" type="submit">Prüfen</button>'}
      </form>`;

    if (!pr.done) {
      $('#answerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const v = $('#answerInput').value;
        if (!v.trim()) return;
        submitAnswer(topic, v);
      });
      const input = $('#answerInput');
      input.focus();
      if (pr.retry) input.select();
    }
  }

  function submitAnswer(topic, val) {
    const pr = practice;
    if (!pr || pr.done) return;
    const task = pr.task;

    let ok;
    pr.hinweis = null;
    if (task.type === 'choice') {
      ok = val === task.correct;
      // Der Fehler hinter dem gewählten Ablenker (makeChoice in topics.js) –
      // nur wo der Generator ihn eindeutig kennt, sonst bleibt es still.
      pr.diagnose = !ok && Array.isArray(task.gruende) ? task.gruende[val] || null : null;
    } else {
      pr.lastInput = String(val);
      ok = !!task.check(String(val));
      // Unlesbar ist kein Fehlversuch: „abc“ oder „x = 3 oder x = 4“ wird
      // erklärt, nicht gewertet – sonst kostet ein Tippfehler die zweite Chance.
      const unlesbar = !ok && typeof task.check.unlesbar === 'function' ? task.check.unlesbar(String(val)) : null;
      if (unlesbar) {
        pr.hinweis = unlesbar;
        renderFeedback(topic);
        ansage(unlesbar);
        const input = $('#answerInput');
        if (input) { input.focus(); input.select(); }
        return;
      }
      // Fehlerart, ohne die Lösung zu nennen – nur wenn die Prüfung sie sicher
      // erkennt. Eine unlesbare Eingabe (oben) ist kein Versuch und lässt die
      // Diagnose des gewerteten Versuchs stehen.
      pr.diagnose = !ok && typeof task.check.diagnose === 'function' ? task.check.diagnose(String(val)) : null;
    }

    // Zweite Chance: Der erste Fehlversuch verrät die Lösung noch nicht.
    // Bei einer Ja/Nein-Aufgabe verrät er sie allerdings vollständig – nach dem
    // Sperren der falschen Option bliebe genau eine übrig, und der Fokus sprang
    // sogar auf sie. Blindes Raten hätte so 100 % richtig ergeben. Deshalb gibt
    // es den zweiten Versuch nur, wenn danach noch mindestens zwei Optionen offen sind.
    const bleibtWahl = task.type !== 'choice' ||
      (task.options.length - pr.wrongChoices.length - 1) >= 2;
    if (!ok && pr.attempt === 0 && bleibtWahl) {
      pr.attempt = 1;
      pr.retry = true;
      if (task.type === 'choice') pr.wrongChoices.push(val);
      // Der Fehlversuch wird sofort verbucht, ohne XP-Abzug und ohne Sterne zu
      // berühren. Vorher fiel er unter den Tisch: Wer jede Aufgabe erst im
      // zweiten Anlauf löste, stand im Üben bei 100 %, in der Challenge bei 0 %.
      gradeAnswer(topic.id, pr.diff, false, 0);
      renderPractice(topic);
      renderHeader();
      ansage('Noch nicht ganz. Versuch es gleich nochmal.');
      const card = $('#taskCard');
      if (card) card.classList.add('shake');
      return;
    }

    pr.done = true;
    pr.retry = false;
    pr.lastResult = ok;
    pr.verlauf.push(ok);

    const ts = topicState(topic.id);
    if (ok) {
      pr.correct++;
      // Nur ein Treffer im ersten Anlauf verlängert die Serie.
      if (pr.attempt === 0) {
        pr.run++;
        if (pr.run > ts.bestRun) ts.bestRun = pr.run;
      } else {
        pr.run = 0;
      }
    } else {
      pr.wrong++; pr.run = 0;
      if (task.type === 'choice' && !pr.wrongChoices.includes(val)) pr.wrongChoices.push(val);
    }
    // Im zweiten Anlauf gibt es halbe XP – Dranbleiben lohnt sich, zählt aber weniger.
    gradeAnswer(topic.id, pr.diff, ok, pr.attempt === 0 ? 1 : 0.5);

    renderPractice(topic);
    renderHeader();
    ansage(ok ? 'Richtig.' : `Leider falsch. Richtige Antwort: ${nurText(task.answerText)}.`);

    if (!ok) {
      const card = $('#taskCard');
      if (card) card.classList.add('shake');
    }
    const nextBtn = $('#nextBtn');
    if (nextBtn) nextBtn.focus();
  }

  /** Aufgabe aufgeben: Lösung anzeigen, ohne weiteren Versuch. */
  function giveUp(topic) {
    const pr = practice;
    if (!pr || pr.done) return;
    pr.done = true;
    pr.retry = false;
    pr.lastResult = false;
    pr.wrong++; pr.run = 0;
    pr.verlauf.push(false);
    gradeAnswer(topic.id, pr.diff, false, 0);
    renderPractice(topic);
    renderHeader();
    // Ohne diese beiden Zeilen war „Lösung zeigen“ der einzige Weg im
    // Übungsflow, der weder etwas ansagt noch den Fokus mitnimmt – er landete
    // auf <body>, und die Tastaturbedienung begann von vorn.
    ansage(`Richtige Antwort: ${nurText(pr.task.answerText)}.`);
    const nextBtn = $('#nextBtn');
    if (nextBtn) nextBtn.focus();
  }

  function renderFeedback(topic) {
    const pr = practice;
    const area = $('#feedbackArea');
    const task = pr.task;
    const tipp = tippText(topic, pr.diff);

    // Zwischenstand: erster Fehlversuch – Denkanstoß statt Lösung
    if (pr.retry && !pr.done) {
      area.innerHTML = `
        <div class="feedback retry" role="status">
          <div class="fb-head">${icon('tipp')}Noch nicht ganz</div>
          ${pr.diagnose ? `<p class="fb-diagnose">${pr.diagnose}</p>` : ''}
          ${pr.hinweis ? `<p class="fb-diagnose fb-rueckfrage">${pr.hinweis}</p>` : ''}
          ${tipp ? `<p class="fb-tipp"><strong>Tipp:</strong> ${tipp}</p>` : ''}
          <div class="next-row">
            <button class="btn ${task.type === 'choice' ? 'btn-primary' : 'btn-ghost'}" id="retryBtn">Nochmal versuchen</button>
            <button class="btn btn-ghost" id="giveUpBtn">Lösung zeigen</button>
          </div>
        </div>`;
      // Bei Eingabeaufgaben steht „Prüfen“ direkt über dieser Zeile und bleibt
      // der eigentliche Hauptknopf – „Nochmal versuchen“ setzt nur den Fokus
      // zurück ins Feld. Zwei blaue Hauptknöpfe übereinander wären zwei
      // Aufforderungen für dieselbe Handlung. Bei Auswahlaufgaben gibt es
      // kein „Prüfen“, dort ist der Rücksprung zur nächsten offenen Option
      // die Haupthandlung und bleibt blau.
      $('#retryBtn').addEventListener('click', () => {
        const input = $('#answerInput');
        if (input) { input.focus(); input.select(); }
        else { const b = document.querySelector('#answerArea .choice-btn:not([disabled])'); if (b) b.focus(); }
      });
      $('#giveUpBtn').addEventListener('click', () => giveUp(topic));
      return;
    }

    if (!pr.done) {
      area.innerHTML = pr.hinweis ? `
        <div class="feedback lesen" role="status">
          <div class="fb-head">${icon('tipp')}Kurze Rückfrage</div>
          <p class="fb-diagnose">${pr.hinweis}</p>
        </div>` : '';
      return;
    }

    if (pr.lastResult) {
      const xp = Math.round(XP_BY_DIFF[pr.diff] * (pr.attempt === 0 ? 1 : 0.5));
      area.innerHTML = `
        <div class="feedback ok" role="status">
          <div class="fb-head">${icon('richtig')}${pr.attempt === 0 ? 'Richtig' : 'Richtig, im zweiten Anlauf'}
            <span class="xp-pop">+${xp} XP</span></div>
          <details><summary>Lösungsweg ansehen</summary><div class="fb-solution">${task.solution}</div></details>
          <div class="next-row"><button class="btn btn-primary" id="nextBtn">Nächste Aufgabe →</button></div>
        </div>`;
    } else {
      area.innerHTML = `
        <div class="feedback err" role="status">
          <div class="fb-head">${icon('falsch')}Diesmal nicht</div>
          ${pr.diagnose ? `<p class="fb-diagnose">${pr.diagnose}</p>` : ''}
          <p class="fb-answer">Richtige Antwort: <strong>${task.answerText}</strong></p>
          <div class="fb-solution"><span class="sol-title">So geht’s:</span>${task.solution}</div>
          <div class="next-row">
            <button class="btn btn-primary" id="nextBtn">Nächste Aufgabe →</button>
            <a class="btn btn-ghost" href="#/thema/${topic.id}/lernen">${icon('lernen')}Kapitel nachlesen</a>
          </div>
        </div>`;
    }

    $('#nextBtn').addEventListener('click', () => nextTask(topic));
  }

  function nextTask(topic) {
    const pr = practice;
    pr.task = newTask();
    pr.done = false; pr.retry = false; pr.attempt = 0; pr.hinweis = null; pr.diagnose = null;
    pr.lastInput = ''; pr.wrongChoices = [];
    renderPractice(topic);
  }

  /* ---------- Bewertung (gemeinsam für Üben & Challenge) ---------- */

  function gradeAnswer(topicId, diff, ok, xpAnteil = 1) {
    const ts = topicState(topicId);
    const bd = ts.byDiff[diff];
    // Die Serie zählt Tage, an denen geübt wurde – das verspricht auch der
    // Tooltip. Vorher riss sie an einem Tag mit lauter Fehlversuchen, obwohl
    // genau dann am meisten geübt wurde.
    updateStreak();
    const heute = dayStr();
    state.geuebt[heute] = (state.geuebt[heute] || 0) + 1;
    // Folge richtiger Antworten über ALLE Modi. Vorher wurde sie nur im
    // Übungsmodus gezählt (pr.run): Eine fehlerfreie Challenge-Runde ließ
    // „beste Serie“ und die Abzeichen „Serientäter“/„Unaufhaltsam“ kalt.
    // Nur ein Treffer im ersten Anlauf zählt – daran erkennt man ihn am
    // vollen XP-Anteil.
    if (ok && xpAnteil === 1) {
      state.serie++;
      if (state.serie > state.bestSerie) state.bestSerie = state.serie;
    } else {
      state.serie = 0;
    }
    if (ok) {
      ts.correct++; bd.c++;
      state.activity[heute] = (state.activity[heute] || 0) + 1;
      addXp(Math.round(XP_BY_DIFF[diff] * xpAnteil));
    } else {
      ts.wrong++; bd.w++;
    }
    state.lastTopic = topicId;
    checkBadges();
    save();
  }

  /* ---------- Abzeichen ---------- */

  function totalCorrect() {
    return TOPICS.reduce((s, t) => s + (state.topics[t.id] ? state.topics[t.id].correct : 0), 0);
  }

  const BADGES = [
    { id: 'first', icon: '🎈', name: 'Erste Schritte', desc: 'Die erste Aufgabe richtig gelöst', check: () => totalCorrect() >= 1 },
    { id: 'ten', icon: '🔟', name: 'Zweistellig', desc: '10 Aufgaben richtig gelöst', check: () => totalCorrect() >= 10 },
    { id: 'fifty', icon: '⭐', name: 'Halbes Hundert', desc: '50 Aufgaben richtig gelöst', check: () => totalCorrect() >= 50 },
    { id: 'hundred', icon: '💯', name: 'Jahrhundert', desc: '100 Aufgaben richtig gelöst', check: () => totalCorrect() >= 100 },
    { id: 'run5', icon: '🎯', name: 'Serientäter', desc: '5 richtige Antworten in Folge', check: () => state.bestSerie >= 5 },
    { id: 'run10', icon: '🚀', name: 'Unaufhaltsam', desc: '10 richtige Antworten in Folge', check: () => state.bestSerie >= 10 },
    { id: 'level5', icon: '🧗', name: 'Aufsteiger', desc: 'Level 5 erreicht', check: () => levelInfo(state.xp).level >= 5 },
    { id: 'level10', icon: '👑', name: 'Mathe-Royalty', desc: 'Level 10 erreicht', check: () => levelInfo(state.xp).level >= 10 },
    { id: 'streak3', icon: '🔥', name: 'Dranbleiber', desc: '3 Tage in Folge geübt', check: () => state.streak.count >= 3 },
    { id: 'streak7', icon: '🌋', name: 'Eine ganze Woche', desc: '7 Tage in Folge geübt', check: () => state.streak.count >= 7 },
    { id: 'explorer', icon: '🧭', name: 'Entdecker', desc: 'In 10 verschiedenen Themen geübt', check: () => TOPICS.filter(t => { const ts = state.topics[t.id]; return ts && ts.correct + ts.wrong > 0; }).length >= 10 },
    { id: 'allgroups', icon: '🎓', name: 'Allrounder', desc: 'In jeder Stufe eine Aufgabe richtig gelöst', check: () => TOPIC_GROUPS.every(g => g.topics.some(t => state.topics[t.id] && state.topics[t.id].correct > 0)) },
    { id: 'star', icon: '🌟', name: 'Erster Stern', desc: 'Einen Themen-Stern geholt', check: () => TOPICS.some(t => starsFor(t.id) >= 1) },
    { id: 'master', icon: '🏆', name: 'Themen-Meister', desc: 'Alle 3 Sterne in einem Thema', check: () => TOPICS.some(t => starsFor(t.id) === 3) },
    { id: 'daily1', icon: '📅', name: 'Challenge-Starter', desc: 'Erste Tages-Challenge abgeschlossen', check: () => (state.challengesDone || 0) >= 1 },
    { id: 'daily5', icon: '🗓️', name: 'Challenge-Gewohnheit', desc: '5 Tages-Challenges abgeschlossen', check: () => (state.challengesDone || 0) >= 5 }
  ];

  function checkBadges() {
    const neue = [];
    for (const b of BADGES) {
      if (!state.badges.includes(b.id) && b.check()) {
        state.badges.push(b.id);
        neue.push(b);
      }
    }
    if (neue.length === 1) toast(`Abzeichen freigeschaltet: ${neue[0].name}`);
    else if (neue.length > 1) toast(`${neue.length} Abzeichen freigeschaltet`);
  }

  /* ---------- Übungs-Empfehlung ---------- */

  function empfehlung() {
    let best = null;
    for (const t of TOPICS) {
      const ts = state.topics[t.id];
      if (!ts) continue;
      const tot = ts.correct + ts.wrong;
      if (tot >= 5) {
        const q = ts.correct / tot;
        if (q < 0.8 && (!best || q < best.q)) best = { t, q };
      }
    }
    return best;
  }

  /* ---------- Tages-Challenge ---------- */

  // Tages-Challenge und Training laufen getrennt: Vorher teilten sie sich eine
  // Variable, ein Klick auf „Schwächen trainieren“ warf also die angefangene
  // Tages-Challenge weg.
  const laeufe = { daily: null, training: null };
  let aktiveRunde = null; // die gerade gezeichnete Runde

  /** Themen mit der schwächsten Erfolgsquote – Grundlage fürs gezielte Training. */
  function schwacheThemen() {
    return TOPICS.map(t => {
      const ts = state.topics[t.id];
      if (!ts) return null;
      const tot = ts.correct + ts.wrong;
      if (tot < 2) return null;
      return { topic: t, quote: ts.correct / tot, wrong: ts.wrong };
    }).filter(x => x && x.quote < 1)
      .sort((a, b) => a.quote - b.quote || b.wrong - a.wrong);
  }

  /**
   * Die Schwierigkeitsstufe, auf der es in diesem Thema am meisten hakt.
   * Maßstab ist die Erfolgsquote, nicht die Zahl der Fehler: Wer viel auf
   * „Leicht“ übt, sammelt dort zwangsläufig die meisten Fehler und bekam
   * deshalb dauerhaft „Leicht“ vorgesetzt – auch bei 25 % auf „Schwer“.
   */
  function schwacheStufe(topicId) {
    const ts = state.topics[topicId];
    if (!ts) return 1;
    let beste = null;
    for (const d of [1, 2, 3]) {
      const bd = ts.byDiff[d];
      const gesamt = bd.c + bd.w;
      if (gesamt < 3) continue; // zu wenig Daten für ein Urteil
      const quote = bd.c / gesamt;
      if (!beste || quote < beste.quote) beste = { stufe: d, quote };
    }
    if (beste && beste.quote < 1) return beste.stufe;
    // Keine belastbare Quote: auf die Stufe mit Fehlern zurückfallen.
    let stufe = 1, meisteFehler = 0;
    for (const d of [1, 2, 3]) {
      if (ts.byDiff[d].w > meisteFehler) { meisteFehler = ts.byDiff[d].w; stufe = d; }
    }
    return meisteFehler > 0 ? stufe : 1;
  }

  /** Eine frische Runde aus fünf Aufgaben zusammenstellen. */
  function neueRunde(modus, saat = null) {
    let eintraege, ausSchwaeche = 0;
    if (modus === 'training') {
      const schwach = schwacheThemen().slice(0, 5).map(s => s.topic);
      ausSchwaeche = schwach.length;
      // Falls es zu wenige Schwachstellen gibt: mit bereits geübten Themen auffüllen
      const geuebt = Util.shuffle(TOPICS.filter(t => state.topics[t.id] && !schwach.includes(t)));
      // Reicht das noch nicht für fünf Aufgaben, kommen ungeübte Themen dazu.
      const rest = Util.shuffle(TOPICS.filter(t => !state.topics[t.id]));
      const themen = schwach.concat(geuebt, rest).slice(0, 5);
      eintraege = themen.map(t => {
        const diff = schwacheStufe(t.id);
        return { topic: t, diff, task: t.gen(diff) };
      });
    } else {
      const themen = Util.shuffle(TOPICS).slice(0, 5);
      const stufen = Util.shuffle([1, 1, 2, 2, 3]);
      // Feste Saat je Aufgabe: Nur so stellt der Tageslauf nach einem Neuladen
      // dieselben Fragen. Vorher wurde jede Aufgabe frisch gezogen – die noch
      // offene Frage ließ sich beliebig oft neu würfeln.
      saat = saat || (Math.floor(Math.random() * 1e9) + 1);
      eintraege = themen.map((t, i) => ({
        topic: t, diff: stufen[i],
        task: Util.mitSaat(saat + i * 7919, () => t.gen(stufen[i]))
      }));
    }
    return {
      // Startdatum, nicht Antwortzeit: Wer um 23:58 anfängt, spielt die
      // Challenge von diesem Tag. Vorher wurde bei jeder Antwort neu
      // gestempelt – der Lauf rutschte über Mitternacht auf den nächsten Tag,
      // der dann als „heute geschafft“ galt, ohne dass eine Frage kam.
      modus, tasks: eintraege, ausSchwaeche, saat, datum: dayStr(),
      index: 0, correct: 0, results: [],
      answered: false, lastResult: null, chosen: null, lastInput: ''
    };
  }

  /**
   * Laufstand der Tages-Challenge sichern. Ohne das ließ sich die Runde durch
   * Neuladen beliebig oft neu würfeln, bis die +25 Bonus-XP saßen.
   * Gesichert werden Themen, Stufen und der Punktestand – die konkreten
   * Aufgabeninstanzen enthalten Funktionen und sind nicht speicherbar.
   */
  function sichereTageslauf(ch) {
    state.challengeLauf = {
      date: ch.datum || dayStr(),
      eintraege: ch.tasks.map(e => ({ id: e.topic.id, diff: e.diff })),
      saat: ch.saat,
      index: ch.index,
      correct: ch.correct,
      results: ch.results.slice()
    };
    save();
  }

  /** Gesicherten Tageslauf wiederherstellen, sonst null. */
  function stelleTageslaufHer() {
    const g = state.challengeLauf;
    if (!g || g.date !== dayStr()) return null;
    // Mit derselben Saat wie beim ersten Ziehen: Die Runde stellt danach exakt
    // dieselben Fragen wie vor dem Neuladen. Fehlt die Saat (Stand aus einer
    // älteren Version), wird wie früher frisch gezogen.
    const tasks = g.eintraege
      .map((e, i) => {
        const t = TOPICS.find(x => x.id === e.id);
        if (!t) return null;
        const task = g.saat ? Util.mitSaat(g.saat + i * 7919, () => t.gen(e.diff)) : t.gen(e.diff);
        return { topic: t, diff: e.diff, task };
      })
      .filter(Boolean);
    if (tasks.length !== g.eintraege.length || !tasks.length) return null;
    // results ist nach einer Antwort um eins länger als index – gesichert wird
    // schon vor dem Klick auf „Weiter“. Ohne diesen Ausgleich stellt ein
    // Neuladen im Lösungsbild dieselbe Frage ein zweites Mal, und sie zählt
    // doppelt: „7 von 5 richtig“ war so erreichbar.
    const beantwortet = Math.min(Math.max(g.index, g.results.length), tasks.length);
    if (beantwortet >= tasks.length) return null;   // Runde war faktisch durch
    return {
      modus: 'daily', tasks, ausSchwaeche: 0, saat: g.saat, datum: g.date,
      index: beantwortet,
      correct: g.correct, results: g.results.slice(),
      answered: false, lastResult: null, chosen: null, lastInput: ''
    };
  }

  function renderTraining() {
    // Eine noch laufende Trainingsrunde wird fortgesetzt – eine bereits beendete
    // nicht: Sonst zeigte „Schwächen trainieren“ dauerhaft das alte Ergebnis,
    // statt eine neue Runde zu starten.
    if (laeufe.training && !laeufe.training.fertig) { renderSession('training'); return; }
    laeufe.training = null;

    const schwach = schwacheThemen();
    const geuebt = TOPICS.filter(t => state.topics[t.id]);
    if (geuebt.length === 0) {
      app.innerHTML = `
        <div class="challenge-wrap">
          <div class="task-card challenge-result">
            <div class="result-emoji">🌱</div>
            <h1>Noch keine Daten</h1>
            <p class="result-note">Übe zuerst ein paar Aufgaben – danach stellt dir das Training
            gezielt die Themen zusammen, bei denen es noch hakt.</p>
            <div class="next-row"><a class="btn btn-primary" href="#/">Zu den Themen</a></div>
          </div>
        </div>`;
      return;
    }
    if (schwach.length === 0) {
      // schwacheThemen() lässt Themen mit weniger als zwei Antworten aus. Wer
      // in jedem Thema genau einmal falsch geantwortet hat, bekam deshalb
      // „In allen geübten Themen liegst du bei 100 %“ zu lesen – das Gegenteil.
      const fehlerfrei = geuebt.every(t => state.topics[t.id].wrong === 0);
      app.innerHTML = `
        <div class="challenge-wrap">
          <div class="task-card challenge-result">
            <div class="result-emoji">${fehlerfrei ? '🏅' : '🌱'}</div>
            <h1>${fehlerfrei ? 'Keine Schwachstellen gefunden' : 'Noch zu wenig Daten'}</h1>
            <p class="result-note">${fehlerfrei
              ? 'In allen geübten Themen liegst du bei 100 %. Stark!'
              : 'Für eine Auswertung nach Erfolgsquote hast du in jedem Thema erst eine Antwort – das ist noch zu wenig, um Schwachstellen zu erkennen.'}<br>
            Du kannst trotzdem eine gemischte Runde starten – aus deinen Themen und, wenn es dafür noch zu wenige sind, aus neuen.</p>
            <div class="next-row">
              <button class="btn btn-primary" id="startTraining">Trotzdem trainieren</button>
              <a class="btn btn-ghost" href="#/">Neues Thema wählen</a>
            </div>
          </div>
        </div>`;
      $('#startTraining').addEventListener('click', () => {
        laeufe.training = neueRunde('training');
        renderSession('training');
      });
      return;
    }
    laeufe.training = neueRunde('training');
    renderSession('training');
  }

  function renderChallenge(modus = 'daily') {
    if (modus === 'training') return renderSession('training');
    const heute = dayStr();

    // Letzte Frage beantwortet, nur die Auswertung nie geöffnet: Die Runde
    // gilt als gespielt. Sonst ließe sie sich durch Neuladen neu würfeln.
    const g = state.challengeLauf;
    const schonAusgewertet = state.challenge && state.challenge.date === heute && state.challenge.done;
    if (g && g.date === heute && !schonAusgewertet && g.results.length >= g.eintraege.length) {
      const gesamt = g.eintraege.length;
      const richtig = Math.min(g.correct, gesamt);
      if (richtig >= 4) addXp(25);
      state.challenge = { date: heute, correct: richtig, total: gesamt, done: true };
      state.challengesDone = (state.challengesDone || 0) + 1;
      state.challengeLauf = null;
      laeufe.daily = null;
      checkBadges();
      save();
    }

    if (state.challenge && state.challenge.date === heute && state.challenge.done) {
      const c = state.challenge.correct;
      const emoji = c === 5 ? '🏆' : c === 4 ? '🎉' : c === 3 ? '👍' : '💪';
      // Die Überschrift folgt dem Ergebnis wie das Emoji: „Challenge geschafft!“
      // stand auch über „0 von 5 richtig“ – ein Lob, das ins Leere läuft.
      const titel = c === 5 ? 'Alle fünf richtig!' : c === 4 ? 'Stark gespielt!' : c === 3 ? 'Challenge geschafft!' : 'Challenge beendet';
      app.innerHTML = `
        <div class="challenge-wrap">
          <div class="task-card challenge-result">
            <div class="result-emoji">${emoji}</div>
            <h1>${titel}</h1>
            <p class="result-score">${c} von ${state.challenge.total} richtig${c >= 4 ? ' · +25 Bonus-XP' : ''}</p>
            <p class="result-note">Die nächste Tages-Challenge wartet morgen auf dich.</p>
            <div class="next-row">
              <a class="btn btn-primary" href="#/">Zu den Themen</a>
              <a class="btn btn-ghost" href="#/statistik">Statistik ansehen</a>
            </div>
          </div>
        </div>`;
      return;
    }

    // Erst den gesicherten Laufstand versuchen, dann eine frische Runde.
    if (!laeufe.daily) {
      laeufe.daily = stelleTageslaufHer();
      if (!laeufe.daily) {
        // Sofort sichern: Bis zur ersten Antwort stand nichts im Speicher, die
        // ganze Runde ließ sich also durch Neuladen neu würfeln.
        laeufe.daily = neueRunde('daily');
        sichereTageslauf(laeufe.daily);
      }
    }
    return renderSession('daily');
  }

  /**
   * Kopftext der Trainingsrunde. Er versprach bisher immer „Themen, bei denen es
   * zuletzt gehakt hat“ – auch wenn vier von fünf Aufgaben aus nie geübten
   * Themen kamen, weil es noch gar keine Schwachstellen gab.
   */
  function trainingText(ch) {
    const n = ch.ausSchwaeche || 0;
    const gesamt = ch.tasks.length;
    if (n >= gesamt) return `${gesamt} Aufgaben aus den Themen, bei denen es zuletzt gehakt hat.`;
    if (n === 0) return `Noch zu wenige Schwachstellen für gezieltes Training – hier eine gemischte Runde aus ${gesamt} Aufgaben.`;
    return `${n} ${n === 1 ? 'Aufgabe' : 'Aufgaben'} aus deinen Schwachstellen, dazu ${gesamt - n} zum Auffrischen.`;
  }

  function renderSession(modus) {
    aktiveRunde = laeufe[modus];
    // Trainingsrunde bereits abgeschlossen? Auswertung zeigen.
    if (modus === 'training' && aktiveRunde && aktiveRunde.fertig) {
      const c = aktiveRunde.correct;
      app.innerHTML = `
        <div class="challenge-wrap">
          <div class="task-card challenge-result">
            <div class="result-emoji">${c >= 4 ? '🎉' : c >= 2 ? '👍' : '💪'}</div>
            <h1>Trainingsrunde beendet</h1>
            <p class="result-score">${c} von ${aktiveRunde.tasks.length} richtig</p>
            <p class="result-note">Wiederhole gern gleich noch eine Runde – die Auswahl passt sich
            deinem aktuellen Stand an.</p>
            <div class="next-row">
              <button class="btn btn-primary" id="nochmalTraining">Noch eine Runde</button>
              <a class="btn btn-ghost" href="#/statistik">Statistik ansehen</a>
            </div>
          </div>
        </div>`;
      $('#nochmalTraining').addEventListener('click', () => { laeufe.training = null; renderTraining(); });
      return;
    }

    const ch = aktiveRunde;
    const eintrag = ch.tasks[ch.index];
    const t = eintrag.topic;
    const kopf = modus === 'training'
      ? { titel: 'Schwächen trainieren', text: trainingText(ch) }
      : { titel: 'Tages-Challenge', text: '5 Aufgaben quer durch alle Themen – ab 4 richtigen gibt es +25 Bonus-XP.' };

    app.innerHTML = `
      <div class="challenge-wrap">
        <div class="challenge-head">
          <h1>${kopf.titel}</h1>
          <p class="tagline">${kopf.text}</p>
          <div class="ch-dots">
            ${ch.tasks.map((_, i) => {
              let cls = 'dot-open';
              if (i < ch.results.length) cls = ch.results[i] ? 'dot-ok' : 'dot-err';
              else if (i === ch.index) cls = 'dot-now';
              return `<span class="ch-dot ${cls}"></span>`;
            }).join('')}
          </div>
        </div>
        <div class="task-card ${t.grad || ''}" id="taskCard">
          <div class="task-label">Aufgabe ${ch.index + 1} von ${ch.tasks.length} · ${t.title} · ${DIFF_NAMES[eintrag.diff]}</div>
          <div class="task-question${frageKlasse(eintrag.task.q)}">${eintrag.task.q}</div>
          <div id="answerArea"></div>
          <div id="feedbackArea"></div>
        </div>
      </div>`;

    renderChallengeAnswer();
  }

  function renderChallengeAnswer() {
    const ch = aktiveRunde;
    const eintrag = ch.tasks[ch.index];
    const task = eintrag.task;
    const area = $('#answerArea');
    const fbArea = $('#feedbackArea');

    if (task.type === 'choice') {
      const KEYS = ['A', 'B', 'C', 'D', 'E'];
      area.innerHTML = `<div class="choice-grid">
        ${task.options.map((o, i) => `<button class="choice-btn" data-i="${i}" ${ch.answered ? 'disabled' : ''}><span class="choice-key">${KEYS[i] || ''}</span><span class="choice-text">${o}</span></button>`).join('')}
      </div>`;
      area.querySelectorAll('.choice-btn').forEach(btn => {
        const i = Number(btn.dataset.i);
        if (ch.answered) {
          if (i === task.correct) btn.classList.add('is-correct');
          else if (i === ch.chosen) btn.classList.add('is-wrong');
        } else {
          btn.addEventListener('click', () => submitChallengeAnswer(i));
        }
      });
      // Fokus in die Aufgabe – wie im Eingabe-Zweig darunter und wie im
      // Übungsmodus. Ohne das landete er nach jedem „Weiter“ auf <body> und die
      // Tastaturbedienung begann bei jeder Auswahlaufgabe von vorn.
      if (!ch.answered) {
        const erster = area.querySelector('.choice-btn:not([disabled])');
        if (erster) erster.focus({ preventScroll: true });
      }
    } else {
      area.innerHTML = `
        <form class="answer-form" id="answerForm">
          <input class="answer-input" id="answerInput" type="text" autocomplete="off" spellcheck="false"
            placeholder="${escapeAttr(task.placeholder || 'Antwort')}" aria-label="Deine Antwort"
            ${ch.answered ? 'disabled' : ''} value="${ch.answered ? escapeAttr(ch.lastInput) : ''}">
          ${ch.answered ? '' : '<button class="btn btn-primary" type="submit">Prüfen</button>'}
        </form>`;
      if (!ch.answered) {
        $('#answerForm').addEventListener('submit', (e) => {
          e.preventDefault();
          const v = $('#answerInput').value;
          if (!v.trim()) return;
          submitChallengeAnswer(v);
        });
        $('#answerInput').focus();
      }
    }

    if (!ch.answered) {
      fbArea.innerHTML = ch.hinweis ? `
        <div class="feedback lesen" role="status">
          <div class="fb-head">${icon('tipp')}Kurze Rückfrage</div>
          <p class="fb-diagnose">${ch.hinweis}</p>
        </div>` : '';
      return;
    }

    const weiter = ch.index === ch.tasks.length - 1 ? 'Zur Auswertung →' : 'Weiter →';
    if (ch.lastResult) {
      fbArea.innerHTML = `
        <div class="feedback ok" role="status">
          <div class="fb-head">${icon('richtig')}Richtig <span class="xp-pop">+${XP_BY_DIFF[eintrag.diff]} XP</span></div>
          <details><summary>Lösungsweg ansehen</summary><div class="fb-solution">${task.solution}</div></details>
          <div class="next-row"><button class="btn btn-primary" id="chNextBtn">${weiter}</button></div>
        </div>`;
    } else {
      fbArea.innerHTML = `
        <div class="feedback err" role="status">
          <div class="fb-head">${icon('falsch')}Leider nicht richtig</div>
          ${ch.diagnose ? `<p class="fb-diagnose">${ch.diagnose}</p>` : ''}
          <p class="fb-answer">Richtige Antwort: <strong>${task.answerText}</strong></p>
          <div class="fb-solution"><span class="sol-title">So geht’s:</span>${task.solution}</div>
          <div class="next-row"><button class="btn btn-primary" id="chNextBtn">${weiter}</button></div>
        </div>`;
    }
    const btn = $('#chNextBtn');
    btn.addEventListener('click', () => {
      if (ch.index === ch.tasks.length - 1) { finishChallenge(); return; }
      ch.index++;
      ch.answered = false; ch.lastResult = null; ch.chosen = null; ch.lastInput = ''; ch.hinweis = null; ch.diagnose = null;
      if (ch.modus === 'daily') sichereTageslauf(ch);
      renderSession(ch.modus);
    });
    btn.focus();
  }

  function submitChallengeAnswer(val) {
    const ch = aktiveRunde;
    if (!ch || ch.answered) return;
    const eintrag = ch.tasks[ch.index];
    const task = eintrag.task;
    let ok;
    ch.hinweis = null; ch.diagnose = null;
    if (task.type === 'choice') {
      ch.chosen = val; ok = val === task.correct;
      if (!ok && Array.isArray(task.gruende)) ch.diagnose = task.gruende[val] || null;
    }
    else {
      ch.lastInput = String(val); ok = !!task.check(String(val));
      // wie im Übungsmodus: Unlesbares wird erklärt, nicht gewertet
      const unlesbar = !ok && typeof task.check.unlesbar === 'function' ? task.check.unlesbar(String(val)) : null;
      if (unlesbar) {
        ch.hinweis = unlesbar;
        renderSession(ch.modus);
        ansage(unlesbar);
        const input = $('#answerInput');
        if (input) { input.value = String(val); input.focus(); input.select(); }
        return;
      }
      if (!ok && typeof task.check.diagnose === 'function') ch.diagnose = task.check.diagnose(String(val));
    }
    ch.answered = true;
    ch.lastResult = ok;
    ch.results.push(ok);
    if (ok) ch.correct++;
    gradeAnswer(eintrag.topic.id, eintrag.diff, ok);
    if (ch.modus === 'daily') sichereTageslauf(ch);
    renderSession(ch.modus);
    renderHeader();
    ansage(ok ? 'Richtig.' : `Leider falsch. Richtige Antwort: ${nurText(task.answerText)}.`);
    if (!ok) { const card = $('#taskCard'); if (card) card.classList.add('shake'); }
  }

  function finishChallenge() {
    const ch = aktiveRunde;

    // Trainingsrunden sind unbegrenzt wiederholbar: kein Tages-Eintrag, kein Bonus.
    if (ch.modus === 'training') {
      ch.fertig = true;
      checkBadges();
      save();
      if (ch.correct === 5) confettiBurst();
      renderSession('training');
      renderHeader();
      return;
    }

    const bonus = ch.correct >= 4 ? 25 : 0;
    if (bonus) addXp(bonus);
    // Dem Starttag gutschreiben, nicht dem Tag des letzten Klicks.
    state.challenge = { date: ch.datum || dayStr(), correct: ch.correct, total: ch.tasks.length, done: true };
    state.challengesDone = (state.challengesDone || 0) + 1;
    state.challengeLauf = null; // Tageslauf ist abgeschlossen
    checkBadges();
    save();
    laeufe.daily = null;
    aktiveRunde = null;
    if (ch.correct === 5) confettiBurst();
    renderChallenge('daily');
    renderHeader();
  }

  /* ---------- Formelsammlung ---------- */

  /**
   * Liest Formeln und Merksätze direkt aus den Erklärseiten aus –
   * so bleibt die Sammlung automatisch synchron mit den Kapiteln.
   */
  function formelnFuer(topic) {
    const box = document.createElement('div');
    box.innerHTML = topic.learn;
    const formeln = [...box.querySelectorAll('.merkkasten .formula, .formula')]
      .map(f => f.innerHTML.trim())
      .filter((f, i, arr) => arr.indexOf(f) === i);
    const eintraege = formeln.slice(0, 3);

    // Bei Flächen, Volumen, Potenzen, Statistik und Ableitungen stehen die
    // Kernformeln ausschließlich in einer Übersichtstabelle. Ohne diesen Zweig
    // fehlen ausgerechnet dort die Formeln auf dem Spickzettel.
    if (eintraege.length < 3) {
      for (const tr of box.querySelectorAll('.table-wrap table tr')) {
        if (eintraege.length >= 3) break;
        const zellen = [...tr.children];
        if (zellen.length < 2 || zellen[0].tagName === 'TH') continue;
        const name = zellen[0].textContent.trim();
        const formel = zellen[1].innerHTML.trim();
        // Nur Zellen übernehmen, in denen wirklich gerechnet wird –
        // Spalten wie „Gut geeignet für“ gehören nicht auf den Spickzettel.
        if (!name || !formel || !/[=·:+−^√π]/.test(zellen[1].textContent)) continue;
        const eintrag = `<strong>${name}:</strong> ${formel}`;
        if (!eintraege.includes(eintrag)) eintraege.push(eintrag);
      }
    }

    // Mit den Kernaussagen der Merkkästen auffüllen, bis die Karte trägt.
    //
    // Vorher wurde nur der ERSTE Absatz des ersten Merkkastens betrachtet – und
    // der enthält fast immer die schon gelistete Formel, worauf er ersatzlos
    // verworfen wurde. Ergebnis: 16 der 33 Karten blieben unter drei Einträgen,
    // 8 zeigten eine einzige Zeile. Jetzt zählen alle Merkkästen, und aus einem
    // Absatz wird nur die bereits gelistete Formel entfernt statt der Absatz.
    const nurText = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const zusatz = [];
    for (const merk of box.querySelectorAll('.merkkasten')) {
      for (const li of merk.querySelectorAll('li')) zusatz.push(li.innerHTML.trim());
      if (merk.querySelector('li')) continue;   // Listen haben Vorrang vor Fließtext
      for (const p of merk.querySelectorAll('p')) {
        // Die Überschrift des Merkkastens ist keine Formel. Sie fiel bisher nur
        // deshalb nicht auf, weil fast alle kurz sind („Die Formeln“, 11 Zeichen)
        // und an der 12-Zeichen-Schwelle weiter unten hängen blieben. „Die beiden
        // Strahlensätze" ist länger – und stand prompt als erste Zeile auf der Karte.
        if (p.classList.contains('box-title')) continue;
        const kopie = p.cloneNode(true);
        kopie.querySelectorAll('.formula').forEach(f => {
          if (eintraege.includes(f.innerHTML.trim())) f.remove();
        });
        zusatz.push(kopie.innerHTML.replace(/\s+/g, ' ').trim());
      }
    }
    for (const z of zusatz) {
      if (eintraege.length >= 3) break;
      const t = nurText(z);
      // Satzreste und reine Wiederholungen überspringen
      if (t.length < 12) continue;
      if (eintraege.some(e => nurText(e) === t || nurText(e).includes(t))) continue;
      eintraege.push(z);
    }
    return eintraege;
  }

  function renderFormeln() {
    app.innerHTML = `
      <h1 class="section-title">Formelsammlung</h1>
      <p class="formel-intro">Alle Kernformeln auf einen Blick – automatisch aus den Kapiteln
      zusammengestellt. Tipp: Mit Strg/Cmd&nbsp;+&nbsp;P druckst du dir daraus einen Spickzettel.</p>
      ${TOPIC_GROUPS.map(g => `
        <section class="topic-group">
          <div class="group-head">
            <h2>${g.title}</h2>
            <span class="rule"></span>
            <span class="group-count">${g.klasse}</span>
          </div>
          <div class="formel-grid">
            ${g.topics.map(t => {
              const f = formelnFuer(t);
              if (!f.length) return '';
              return `
                <a class="formel-karte ${g.grad}" href="#/thema/${t.id}/lernen">
                  <div class="formel-kopf"><span class="formel-icon" aria-hidden="true">${t.icon}</span><h3>${t.title}</h3></div>
                  <ul>${f.map(x => `<li>${x}</li>`).join('')}</ul>
                </a>`;
            }).join('')}
          </div>
        </section>`).join('')}`;
  }

  /* ---------- Statistik ---------- */

  function renderStats() {
    const li = levelInfo(state.xp);
    let totalC = 0, totalW = 0;
    // Die Kachel zeigt die Serie über alle Modi, die Themenzeilen darunter
    // jeweils die beste Serie innerhalb ihres Themas.
    const bestRun = state.bestSerie;
    for (const t of TOPICS) {
      const ts = state.topics[t.id];
      if (!ts) continue;
      totalC += ts.correct; totalW += ts.wrong;

    }
    const total = totalC + totalW;
    const quote = total ? Math.round(totalC / total * 100) : 0;

    app.innerHTML = `
      <h1 class="section-title">Deine Statistik</h1>
      <div class="stat-tiles">
        <div class="stat-tile tile-accent" style="--i:0">
          <svg class="ring" viewBox="0 0 74 74" aria-hidden="true">
            <circle class="ring-bg" cx="37" cy="37" r="30"/>
            <circle class="ring-fg" cx="37" cy="37" r="30"
              style="stroke-dasharray:${(2 * Math.PI * 30).toFixed(1)};stroke-dashoffset:${(2 * Math.PI * 30 * (1 - li.into / li.need)).toFixed(1)}"/>
          </svg>
          <div class="value">Lv. ${li.level}</div>
          <div class="label">${levelTitel(li.level)} · ${li.into}/${li.need}&nbsp;XP</div>
        </div>
        <div class="stat-tile" style="--i:1"><div class="value">${displayStreak()}</div><div class="label">Tage-Serie</div></div>
        <div class="stat-tile" style="--i:2"><div class="value">${totalC}</div><div class="label">richtig gelöst</div></div>
        <div class="stat-tile" style="--i:3"><div class="value">${total ? quote + ' %' : '–'}</div><div class="label">Erfolgsquote</div></div>
        <div class="stat-tile" style="--i:4"><div class="value">${bestRun}</div><div class="label">beste Serie</div></div>
        <div class="stat-tile" style="--i:5"><div class="value">${state.challengesDone || 0}</div><div class="label">Challenges</div></div>
      </div>

      <h2 class="section-title">Deine Woche</h2>
      <div class="week-card">
        ${(() => {
          const tage = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const key = dayStr(d);
            const count = state.activity && state.activity[key] ? state.activity[key] : 0;
            const label = i === 0 ? 'Heute' : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()];
            const satz = `${count} ${TopicUtils.plural(count, 'Aufgabe', 'Aufgaben')} richtig gelöst`;
            tage.push(`<div class="week-day ${count ? 'active' : ''}" title="${satz}"` +
              ` aria-label="${label === 'Heute' ? 'Heute' : label}: ${satz}">
              <span class="week-count">${count || '·'}</span><span class="week-label">${label}</span>
            </div>`);
          }
          return tage.join('');
        })()}
      </div>
      ${total === 0
        ? `<p class="empty-hint">Noch keine Aufgaben gelöst – <a href="#/">such dir ein Thema aus</a> und leg los.</p>`
        : `<div class="stat-rows">
            ${TOPICS.map((t, i) => {
              const ts = state.topics[t.id];
              const c = ts ? ts.correct : 0, w = ts ? ts.wrong : 0, tot = c + w;
              const q = tot ? Math.round(c / tot * 100) : 0;
              return `
                <div class="stat-row" style="--i:${Math.min(i, 10)}">
                  <span class="topic-icon-tile ${t.grad || 'g-mittel'}">${t.icon}</span>
                  <h3>${t.title}</h3>
                  ${starsHTML(starsFor(t.id))}
                  <div class="numbers">${c} richtig · ${w} falsch · beste Serie: ${ts ? ts.bestRun : 0}</div>
                  <div class="quote">${tot ? q + ' %' : '–'}</div>
                  <div class="row-bar progressbar ${t.grad || 'g-mittel'}"><span style="width:${q}%"></span></div>
                </div>`;
            }).join('')}
          </div>`}

      <h2 class="section-title">${icon('abzeichen')}Abzeichen (${state.badges.length}/${BADGES.length})</h2>
      <div class="badge-grid">
        ${BADGES.map(b => {
          const frei = state.badges.includes(b.id);
          return `<div class="badge-card ${frei ? '' : 'locked'}">
            <span class="badge-icon" aria-hidden="true">${frei ? b.icon : '🔒'}</span>
            <span class="sr-only">${frei ? 'Freigeschaltet' : 'Noch gesperrt'}:</span>
            <span class="badge-name">${b.name}</span>
            <span class="badge-desc">${b.desc}</span>
          </div>`;
        }).join('')}
      </div>

      <div class="stats-actions">
        <a class="btn btn-primary" href="#/training">Schwächen trainieren</a>
        <a class="btn btn-ghost" href="#/formeln">${icon('formeln')}Formelsammlung</a>
      </div>

      <h2 class="section-title sichern-titel">Fortschritt sichern</h2>
      <p class="sicherung-hinweis">Dein Fortschritt liegt nur in diesem Browser. Sichere ihn als Datei,
      bevor du den Browser-Speicher löschst oder das Gerät wechselst.</p>
      <div class="stats-actions">
        <button class="btn btn-ghost" id="exportBtn">Als Datei sichern</button>
        <button class="btn btn-ghost" id="importBtn">Sicherung laden</button>
        <input type="file" id="importFile" accept="application/json,.json" hidden>
      </div>

      <div class="danger-zone">
        <button class="btn btn-danger" id="resetBtn">Fortschritt zurücksetzen …</button>
      </div>`;

    $('#exportBtn').addEventListener('click', exportieren);
    $('#importBtn').addEventListener('click', () => $('#importFile').click());
    $('#importFile').addEventListener('change', (e) => {
      const datei = e.target.files && e.target.files[0];
      if (datei) importieren(datei);
      e.target.value = '';
    });

    $('#resetBtn').addEventListener('click', () => {
      if (confirm('Wirklich den gesamten Fortschritt (XP, Level, Statistiken) löschen? Das kann nicht rückgängig gemacht werden.')) {
        const theme = state.theme;
        state = defaultState();
        state.theme = theme;
        // Ohne diese drei Zeilen lief die angefangene Tages-Challenge nach dem
        // Zurücksetzen einfach weiter und schrieb ihren Stand gleich wieder in
        // den frisch geleerten Speicher. Der Import räumt hier längst auf.
        practice = null;
        laeufe.daily = null;
        laeufe.training = null;
        aktiveRunde = null;
        save(true);   // ersetzen, nicht zusammenführen – sonst käme alles zurück
        render();
      }
    });
  }

  /* ---------- Fortschritt sichern und einspielen ---------- */

  function exportieren() {
    const daten = { app: 'MatheNils', version: 1, gesichert: new Date().toISOString(), stand: state };
    const blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathenils-fortschritt-${dayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Sicherung gespeichert');
  }

  function importieren(datei) {
    const leser = new FileReader();
    leser.onload = () => {
      let daten;
      try { daten = JSON.parse(leser.result); }
      catch (e) { toast('Datei ist keine gültige Sicherung'); return; }
      const roh = (daten && daten.stand) ? daten.stand : daten;
      if (!roh || typeof roh !== 'object' || (roh.xp === undefined && roh.topics === undefined)) {
        toast('Datei enthält keinen Fortschritt');
        return;
      }
      const neu = sanitizeState(roh);
      const gelöst = TOPICS.reduce((n, t) => n + (neu.topics[t.id] ? neu.topics[t.id].correct : 0), 0);
      if (!confirm(`Sicherung einspielen?\n\nLevel ${levelInfo(neu.xp).level} · ${neu.xp} XP · ${gelöst} gelöste Aufgaben\n\nDein aktueller Stand wird dabei ersetzt.`)) return;
      const theme = state.theme;
      state = neu;
      state.theme = theme;   // Darstellung des Geräts beibehalten
      save(true);            // ersetzen, nicht zusammenführen
      practice = null;
      laeufe.daily = null;
      laeufe.training = null;
      aktiveRunde = null;
      toast('Fortschritt eingespielt');
      render();
    };
    leser.onerror = () => toast('Datei konnte nicht gelesen werden');
    leser.readAsText(datei);
  }

  /* ---------- Toast & Konfetti ---------- */

  /**
   * Kurze Ansage für Screenreader. Der Umweg über das Leeren des Feldes ist
   * nötig, weil derselbe Text zweimal hintereinander sonst nicht erneut
   * vorgelesen wird (z. B. zweimal „Richtig“ in Folge).
   */
  const srStatus = document.getElementById('srStatus');
  let ansageTimer = null;
  function ansage(text) {
    if (!srStatus) return;
    srStatus.textContent = '';
    clearTimeout(ansageTimer);
    ansageTimer = setTimeout(() => { srStatus.textContent = text; }, 60);
  }

  function toast(msg) {
    ansage(msg);
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 2600);
  }

  function confettiBurst() {
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('i');
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = `hsl(${Math.floor(Math.random() * 360)}, 85%, 60%)`;
      p.style.animationDelay = `${Math.random() * 0.4}s`;
      p.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 3600);
  }

  /* ---------- Theme ---------- */

  function applyTheme() {
    const pref = state.theme ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', pref);
    const btn = $('#themeToggle');
    if (btn) btn.setAttribute('aria-label',
      pref === 'dark' ? 'Zum hellen Modus wechseln' : 'Zum dunklen Modus wechseln');
  }

  // Die Lupe im Kopf führt zur Themenübersicht und setzt den Fokus ins
  // Suchfeld – auf schmalen Geräten ist das der kürzeste Weg zur Suche.
  const suchKnopf = $('#searchToggle');
  if (suchKnopf) suchKnopf.addEventListener('click', () => {
    const fokussieren = () => {
      const feld = $('#topicSearch');
      if (feld) { feld.focus(); feld.scrollIntoView({ block: 'center' }); }
    };
    if (currentRoute().view === 'home') { fokussieren(); return; }
    // Früher stand hier ein 260-ms-Timer. Der lief gegen den Seitenübergang:
    // War der langsamer, gab es das Suchfeld noch gar nicht. Jetzt merkt sich
    // renderHome den Wunsch und erfüllt ihn, sobald das Feld existiert.
    suchFokusGewuenscht = true;
    location.hash = '#/';
  });

  $('#themeToggle').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    state.theme = cur === 'dark' ? 'light' : 'dark';
    save();
    applyTheme();
  });

  /* ---------- Kleine Interaktions-Details ---------- */

  // Header-Schatten beim Scrollen + Gruppen einblenden
  window.addEventListener('scroll', () => {
    document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 8);
    revealCheck();
  }, { passive: true });
  window.addEventListener('resize', revealCheck, { passive: true });

  // Beim Drucken alle aufklappbaren Antworten öffnen und danach zurücksetzen,
  // damit ein Handout vollständig ist.
  let vorherOffen = [];
  window.addEventListener('beforeprint', () => {
    vorherOffen = [...document.querySelectorAll('details')].map(d => d.open);
    document.querySelectorAll('details').forEach(d => { d.open = true; });
  });
  window.addEventListener('afterprint', () => {
    document.querySelectorAll('details').forEach((d, i) => { d.open = vorherOffen[i] ?? false; });
  });

  // Elemente, die ihre Tasten selbst brauchen.
  const TEXTFELD = 'input, textarea, select, [contenteditable="true"]';
  const BEDIENBAR = 'a[href], button, summary, [tabindex]:not([tabindex="-1"]), ' + TEXTFELD;

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const aktiv = document.activeElement;

    // Enter gehört dem fokussierten Element: Ein Link soll folgen, „Lösungsweg
    // ansehen“ soll aufklappen. Vorher kaperte diese Abkürzung jedes Enter im
    // Dokument und sprang stattdessen zur nächsten Aufgabe – die gerade
    // aufgerufene Erklärung war damit weg.
    if (e.key === 'Enter') {
      if (aktiv && aktiv.closest && aktiv.closest(BEDIENBAR)) return;
      const next = document.querySelector('#nextBtn, #chNextBtn');
      if (next) { e.preventDefault(); next.click(); }
      return;
    }

    // Auswahl-Aufgaben per Tastatur beantworten (A, B, C, D) – auch in der Challenge.
    // Der Buchstabe adressiert fest die Option, nicht die Position unter den
    // noch aktiven Buttons – sonst würde eine gesperrte Option alles verschieben.
    // In Eingabefeldern bleibt der Buchstabe ein Buchstabe (WCAG 2.1.4).
    if (aktiv && aktiv.closest && aktiv.closest(TEXTFELD)) return;
    const idx = ['a', 'b', 'c', 'd', 'e'].indexOf(e.key.toLowerCase());
    if (idx < 0) return;
    const btn = document.querySelector(`#answerArea .choice-btn[data-i="${idx}"]`);
    if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
  });

  /* ---------- Start ---------- */

  // „Zum Inhalt springen“ darf NICHT über den Hash laufen: #app ist keine
  // gültige Route, currentRoute() fiele auf 'home' zurück und der Link würde
  // aus jeder Lern- oder Übungsseite auf die Startseite werfen – das Gegenteil
  // dessen, wofür er da ist.
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    app.focus();
    app.scrollIntoView({ block: 'start' });
  });

  window.addEventListener('hashchange', () => {
    // Anker ohne Routen-Präfix (Kapitelsprünge, #app) wechseln die Ansicht nicht.
    if (location.hash && location.hash !== '#' && !location.hash.startsWith('#/')) return;
    render();
  });

  /**
   * Ein zweiter Tab hat gespeichert. Sein Zuwachs wird sofort übernommen, damit
   * beide Tabs dieselben Zahlen zeigen – ohne das Zusammenführen in save() ginge
   * er verloren, aber bis zum nächsten Neuladen stünden hier trotzdem veraltete
   * Werte. Die Ansicht wird nur dort neu gezeichnet, wo das niemanden stört:
   * mitten in einer Aufgabe würde ein Neuzeichnen die Eingabe wegwerfen.
   */
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    let fremd;
    try { fremd = sanitizeState(JSON.parse(e.newValue)); } catch (err) { return; }
    fremdesUebernehmen(fremd, letzterStand);
    // Der eigene, noch ungespeicherte Zuwachs ist die Differenz zum Speicher –
    // deshalb wird der Fremdstand zur neuen Bezugsgröße, nicht der eigene.
    letzterStand = kopie(fremd);
    renderHeader();
    const ruhig = ['home', 'stats', 'formeln'];
    if (ruhig.includes(document.body.dataset.view)) render();
  });
  /* ---------- Formelsatz beim Anzeigen ----------
   *
   * Die Inhalte stehen im Quelltext mit gewöhnlichen Leerzeichen – rund 1350
   * Stellen „Zahl Einheit“, dazu jede Rechnung in jeder Aufgabenvorlage. Der
   * Browser brach deshalb, wo es ihm passte: „Sie fliegt 2“ / „m nach rechts“,
   * „P(X“ / „≤ 3)“, „S₃(0 | 0“ / „| 15)“, „(3x −“ / „2)“, „u′ =“ am Zeilenende
   * und der Bruch allein darunter. Gemessen auf den Erklärseiten bei 375 px:
   * 183 Rechenzeichen am Zeilenanfang, 28 zerrissene Punkte, 30 Zahlen ohne
   * ihre Einheit. Statt jede Stelle einzeln zu schützen, werden die Leerzeichen
   * beim Anzeigen gebunden – für alles, was in #app landet, egal aus welcher
   * Ansicht. Umbrochen wird danach nur noch HINTER einem Rechenzeichen, wie im
   * gedruckten Formelsatz. Ein Treffer zu viel („2 s“ als Variable) kostet
   * nichts: Er verhindert nur einen Umbruch.
   *
   * Zählwörter („7 Flaschen“) bleiben frei – eine Bindung „Zahl + nächstes
   * Wort" träfe auch „5 und“, „3 oder“.
   */
  const NB = ' ';
  const EINHEIT_NACH_ZAHL = new RegExp('(\\d) (?=(?:mm|cm|dm|km|m|mg|kg|g|t|ml|cl|dl|l|L|min|s|h|ha|€|%|‰|°C|Liter|Euro|Cent|ct' +
    '|Sekunden?|Minuten?|Stunden?|Tage?n?|Wochen?|Monate?n?|Jahre?n?|Jahrzehnte?n?|Grad|Prozent|Meter|Kilometer|Zentimeter|Gramm|Kilogramm|Tonnen?)' +
    '[²³]?(?![\\p{L}\\d]))', 'gu');
  const RZ = '=≠≈≤≥<>+−·:×±→⇒⇔|';
  // Kein Rechenzeichen am Zeilenanfang: das Leerzeichen davor binden.
  // Nur wenn im selben Textknoten etwas davorsteht: Beginnt der Text mit
  // „ ≈ 0,593" direkt hinter einem Bruch, bliebe sonst Bruch, Zeichen und der
  // nächste Bruch eine unumbrechbare Kette – auf 320 px 23 px zu breit.
  const VOR_ZEICHEN = new RegExp(`(?<=[^ ${NB}]) (?=[${RZ}][ ${NB}])`, 'gu');
  // Ein Zeichen direkt nach „(“ oder „|“ ist ein Vorzeichen oder eine Umformung
  // („(≠ 0)“, „| − 5“, „| : 3“) – es gehört zu dem, was folgt.
  const NACH_VORZEICHEN = new RegExp(`([(|][${NB}﻿]*[${RZ}]) `, 'gu');
  // Der senkrechte Strich erlaubt als Umbruchklasse BA einen Umbruch hinter
  // sich, auch vor einem geschützten Leerzeichen (UAX #14). Das Nullbreite-
  // Zeichen U+FEFF hält ihn fest; es zählt für \s, also lesen die
  // Antwortprüfungen einen kopierten Punkt „S(7 | 1 | −5)“ weiter richtig.
  const NACH_STRICH = new RegExp(`\\|[ ${NB}]`, 'gu');
  // Kurze Klammern bleiben ganz: „P(X ≤ 3)“, „(3x − 2)“, „(10 über 3)“.
  const KURZE_KLAMMER = /\(([^()]{1,18})\)/gu;
  const TAUSENDER = /(\d) (?=\d{3}(?!\d))/gu;
  const ABKUERZUNG = /\b([zdu]|o|v)\. (?=[BhaÄA]\.)/gu;

  function bindeText(t) {
    return t.replace(EINHEIT_NACH_ZAHL, '$1' + NB)
      .replace(TAUSENDER, '$1' + NB)
      .replace(ABKUERZUNG, '$1.' + NB)
      .replace(VOR_ZEICHEN, NB)
      .replace(NACH_STRICH, '|﻿' + NB)
      .replace(NACH_VORZEICHEN, '$1' + NB)
      .replace(KURZE_KLAMMER, k => k.replace(/ /g, NB));
  }

  /* Ein Bruch (.frac) und ein Spaltenvektor (.vek) sind atomare Inline-
     Elemente. Davor darf der Browser immer umbrechen, auch nach einem
     geschützten Leerzeichen – deshalb stand „u′ =“ am Zeilenende und der Bruch
     allein darunter. Nur ein gemeinsamer Rahmen mit nowrap hält Zeichen und
     Bruch zusammen. */
  function bindeBrueche(wurzel) {
    if (!wurzel.querySelectorAll) return;
    const liste = [...wurzel.querySelectorAll('.frac, .vek')];
    if (wurzel.matches && wurzel.matches('.frac, .vek')) liste.push(wurzel);
    for (const f of liste) {
      // Steht der Bruch als erstes Kind in <strong>/<em>, zählt das Zeichen vor diesem.
      let el = f;
      // Nur wenn der Bruch dort allein steht – sonst würde der ganze Satz in
      // <strong> unumbrechbar (skalarprodukt: 244 px über den Rand).
      while (el.parentElement && /^(STRONG|EM|B|I)$/.test(el.parentElement.tagName) &&
             el.parentElement.textContent.trim() === el.textContent.trim()) el = el.parentElement;
      if (el.parentElement && el.parentElement.classList.contains('bindung')) continue;
      const t = el.previousSibling;
      if (!t || t.nodeType !== Node.TEXT_NODE) continue;
      const m = t.data.match(new RegExp(`[${RZ}][ ${NB}]*$`, 'u'));
      if (!m) continue;
      const zeichen = t.splitText(t.data.length - m[0].length);
      const rahmen = document.createElement('span');
      rahmen.className = 'bindung';
      el.before(rahmen);
      rahmen.append(zeichen, el);
    }
    // Ein Satzzeichen direkt hinter Bruch oder Vektor rutschte sonst allein an
    // den Anfang der nächsten Zeile („. Berechne …").
    for (const f of liste) {
      let el = f.parentElement && f.parentElement.classList.contains('bindung') ? f.parentElement : f;
      const n = el.nextSibling;
      if (!n || n.nodeType !== Node.TEXT_NODE || !/^[.,;:!?)]/.test(n.data)) continue;
      if (!el.classList.contains('bindung')) {
        const rahmen = document.createElement('span');
        rahmen.className = 'bindung';
        el.before(rahmen);
        rahmen.append(el);
        el = rahmen;
      }
      el.append(n.splitText(1).previousSibling);
    }
  }

  /* Der Trennpunkt zwischen zwei Formeln („a = 3&ensp;•&ensp;b = 4") gehört ans
     Ende der Zeile, nicht an ihren Anfang – dort sah er aus wie ein
     Aufzählungspunkt. Der Halbgeviert-Abstand davor wird deshalb mit dem Punkt
     gebunden. Steht im Quelltext hinter &ensp; noch ein Zeilenumbruch, wurde
     daraus eine doppelt so breite Lücke; die fällt hier weg. */
  function bindeTrenner(wurzel) {
    if (!wurzel.querySelectorAll) return;
    for (const p of wurzel.querySelectorAll('.trenn')) {
      const n = p.nextSibling;
      // Die Formelsammlung normalisiert Leerraum zu gewöhnlichen Leerzeichen –
      // deshalb jeder Leerraum, und daraus wird wieder ein Halbgeviert.
      if (n && n.nodeType === Node.TEXT_NODE) n.data = n.data.replace(/^[ \u2002\n\t]+/, '\u2002');
      if (p.parentElement.classList.contains('bindung')) continue;
      const v = p.previousSibling;
      if (!v || v.nodeType !== Node.TEXT_NODE) continue;
      v.data = v.data.replace(/[ \u2002\n\t]+$/, '\u2002');
      if (!v.data.endsWith('\u2002')) continue;
      const rahmen = document.createElement('span');
      rahmen.className = 'bindung';
      p.before(rahmen);
      rahmen.append(v.splitText(v.data.length - 1), p);
    }
  }

  // x̄ und Verwandte: Buchstabe mit kombinierendem Makron wird ein .quer-Span.
  function ersetzeMakron(n) {
    const teile = n.data.split(/(.\u0304)/u);
    const frag = document.createDocumentFragment();
    for (const t of teile) {
      if (!t) continue;
      if (t.length === 2 && t[1] === '\u0304') {
        const q = document.createElement('span');
        q.className = 'quer';
        q.textContent = t[0];
        frag.append(q);
      } else frag.append(t);
    }
    n.replaceWith(frag);
  }

  function setzeFormeln(wurzel) {
    const gang = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    const makron = [];
    for (let n; (n = gang.nextNode());) {
      // Figuren bleiben, wie sie gezeichnet sind: Ein HTML-Span in einem
      // SVG-<text> wird nicht dargestellt – das „B̄" der Vierfeldertafel war weg.
      if (n.parentElement && n.parentElement.closest('svg')) continue;
      if (n.data.includes('\u0304')) makron.push(n);
      // Der Bruchschrägstrich U+2044 ist für hoch- und tiefgestellte Ziffern
      // gebaut („⁴⁄₃"); zwischen normalen Zeichen stößt er an beide Nachbarn,
      // „p⁄100" wurde ein Klumpen. Dort wird er ein gewöhnlicher Schrägstrich.
      let neu = n.data.replace(/(?<![⁰¹²³⁴⁵⁶⁷⁸⁹])\u2044(?![₀₁₂₃₄₅₆₇₈₉])/gu, '/');
      if (/[ ]/.test(neu)) neu = bindeText(neu);
      if (neu !== n.data) n.data = neu;
    }
    makron.forEach(ersetzeMakron);
    bindeBrueche(wurzel);
    bindeTrenner(wurzel);
  }
  // Beobachtet nur hinzugefügte Knoten; das Umschreiben der Texte ist eine
  // characterData-Änderung und löst den Beobachter nicht erneut aus. Die
  // Rahmen um Brüche lösen ihn aus, werden aber übersprungen (.bindung).
  new MutationObserver(liste => {
    for (const m of liste) for (const k of m.addedNodes) {
      if (k.nodeType === Node.ELEMENT_NODE) setzeFormeln(k);
      else if (k.nodeType === Node.TEXT_NODE && k.parentNode) setzeFormeln(k.parentNode);
    }
  }).observe(app, { childList: true, subtree: true });

  applyTheme();
  render();

})();
