/* Mille Feuilles · l'outil « on mange quoi ? » (recettes.html).
   Écrans par ancre : #questions, #resultats, #fiche/<id>, #semaine, #membre/<raison>.
   L'état (personnes, filtres, semaine, cases cochées) est gardé dans le navigateur.
   L'abonnement n'est pas ouvert : les recettes membres ne sont pas en ligne, et l'outil renvoie vers la liste d'attente (tarifs.html#liste-attente). */
window.MFpret(function () {
  var app = document.getElementById('app');
  if (!app || !window.MF || !window.MFU) return;
  var MF = window.MF, U = window.MFU, E = '#534741', L = '#F8F5F4';
  var JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  var CLE = 'mf-outil-v1';
  var defaut = { p: 2, step: 0, plat: null, sit: [], budget: null, regime: 'tout', temps: null, sg: false, sl: false, allerg: [], mode: null, saison: null, exclus: [],
    filtres: false, variant: 'deux', fp: null, semaine: [], coche: {}, membre: false, formule: 'an', ajoute: null };
  var e = {};
  try { e = JSON.parse(localStorage.getItem(CLE)) || {}; } catch (x) { e = {}; }
  e = Object.assign({}, defaut, e);
  e.membre = false; // efface l'ancien mode de démonstration gardé dans le navigateur
  var q = new URLSearchParams(location.search);
  if (q.get('p')) { e.p = Math.max(1, Math.min(6, +q.get('p') || 2)); e.step = 1; }
  if (q.get('sit')) { e.sit = [q.get('sit')]; }
  if (q.toString()) history.replaceState(null, '', location.pathname + location.hash);
  function garde() { try { localStorage.setItem(CLE, JSON.stringify(e)); } catch (x) {} }
  function set(patch) { Object.assign(e, patch); garde(); rendre(); }
  function pW(n) { return n + (n > 1 ? ' personnes' : ' personne'); }
  var esc = U.esc;

  /* ---------- filtres ---------- */
  function correspond(r, sansSit) {
    if (e.plat && r.type !== (e.plat === 'sucre' ? 'sucré' : 'salé')) return false;
    if (!sansSit && e.sit.length && e.sit.indexOf(r.situation) < 0) return false;
    if (e.regime === 'vegetarien' && !(r.regime === 'vege' || r.regime === 'vegan' || r.regime === 'base')) return false;
    if (e.regime === 'vegan' && !(r.regime === 'vegan')) return false;
    if (e.regime === 'flexitarien' && r.regime === 'tout' && r.situation !== 'recoit' && r.situation !== 'reconfort') return false;
    if (e.regime === 'sansporc' && r.porc) return false;
    if (e.sg && r.gluten) return false;
    if (e.sl && r.lactose) return false;
    for (var i = 0; i < e.allerg.length; i++) if (r.allergenes.indexOf(e.allerg[i]) > -1) return false;
    if (e.budget === 'b1' && r.budget >= 2) return false;
    if (e.budget === 'b2' && (r.budget < 2 || r.budget > 4)) return false;
    if (e.budget === 'b3' && r.budget <= 4) return false;
    if (e.temps && r.prep > e.temps) return false;
    if (e.membre) {
      if (e.mode === 'batch' && !r.batch) return false;
      if (e.mode === 'jour' && r.batch) return false;
      if (e.saison && r.saisons.indexOf(e.saison) < 0) return false;
      for (var j = 0; j < e.exclus.length; j++) { var x = e.exclus[j]; if (r.ingredients.some(function (it) { return it.n.indexOf(x) > -1; })) return false; }
    }
    return true;
  }
  function resultats() {
    return MF.RECETTES.filter(function (r) { return correspond(r); })
      .sort(function (a, b) { return (e.membre ? 0 : (b.libre - a.libre)) || a.prep - b.prep; });
  }

  /* ---------- semaine ---------- */
  function poolSemaine() {
    var p = MF.RECETTES.filter(function (r) { return r.type !== 'sucré' && correspond(r, true) && (e.membre || r.libre); });
    return p.length >= 7 ? p : MF.RECETTES.filter(function (r) { return r.type !== 'sucré'; });
  }
  function remplirSemaine() {
    var pref = ['couscous-express', 'poulet-aux-clementines', 'chili-con-carne', 'omelette-a-la-grecque', 'dahl-de-lentilles-corail', 'hachis-parmentier', 'chili-sin-carne'];
    var pool = poolSemaine();
    e.semaine = pref.every(function (id) { return pool.some(function (r) { return r.id === id; }); }) ? pref : JOURS.map(function (d, i) { return pool[i % pool.length].id; });
    garde();
  }
  if (!e.semaine.length) remplirSemaine();
  function changer(d) {
    var pool = poolSemaine().filter(function (r) { return e.semaine.indexOf(r.id) < 0; });
    if (!pool.length) return;
    var cur = MF.RECETTES.findIndex(function (r) { return r.id === e.semaine[d]; });
    var next = pool.find(function (r) { return MF.RECETTES.indexOf(r) > cur; }) || pool[0];
    e.semaine[d] = next.id; e.anim = d; garde(); rendre();
  }
  function courses() {
    var tot = {}, ordre = [];
    function add(it, m) { if (/^(eau|sel|poivre|sel (&|et) poivre)\b/i.test(it.n)) return; if (it.q == null) { var kk = 'x|' + it.n; if (!tot[kk]) { tot[kk] = { it: it, q: null }; ordre.push(kk); } return; } var k = it.n + '|' + it.u; if (!tot[k]) { tot[k] = { it: it, q: 0 }; ordre.push(k); } tot[k].q += it.q * m; }
    e.semaine.forEach(function (id) {
      var r = MF.recette(id); if (!r) return;
      r.ingredients.forEach(function (it) { add(it, e.p); });
      if (r.variantes) { var nv = Math.ceil(e.p / 2); r.variantes.viande.ingredients.forEach(function (it) { add(it, nv); }); r.variantes.vege.ingredients.forEach(function (it) { add(it, e.p - nv); }); }
    });
    return MF.RAYONS.map(function (ray) {
      return { rayon: ray, items: ordre.filter(function (k) { return tot[k].it.rayon === ray; }).map(function (k) {
        var f = tot[k].q == null ? { q: '', n: tot[k].it.n } : U.quantite(Object.assign({}, tot[k].it, { q: tot[k].q }), 1); return { k: k, q: f.q, n: f.n, on: !!e.coche[k] };
      }) };
    }).filter(function (g) { return g.items.length; });
  }

  /* ---------- composants ---------- */
  function compteur(action, label) {
    return '<div class="compteur"><button type="button" data-a="' + action + '" data-v="-1" aria-label="Une personne de moins">−</button>' +
      '<output aria-live="polite">' + label + '</output><button type="button" data-a="' + action + '" data-v="1" aria-label="Une personne de plus">+</button></div>';
  }
  function chip(label, on, a, v, verrou, sw) {
    return '<button type="button" class="chip' + (verrou ? ' verrou' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-a="' + (verrou ? 'membre' : a) + '" data-v="' + esc(verrou ? 'filtres' : v) + '">' +
      (sw ? '<span class="sw" style="--c:' + sw + '" aria-hidden="true"></span>' : '') + esc(label) + '</button>';
  }
  function carte(r, i) {
    var s = MF.situation(r.situation), verrou = !r.libre && !e.membre;
    return '<li class="carte" style="--c:' + s.couleur + '"><a href="#fiche/' + r.id + '" style="--i:' + Math.min(i, 10) + '">' + U.cadrePhoto(r, s) +
      '<div class="corps"><span class="sit">' + esc(s.nom) + '</span><h3>' + esc(r.titre) + '</h3>' +
      '<span class="meta"><span>' + r.total + ' min</span><span>' + U.euro(r.budget) + ' / pers.</span><span>pour ' + e.p + '</span></span>' +
      (verrou ? '<span class="pastille">Recette membre</span>' : '') +
      (r.note && !verrou && i < 3 ? '<span class="note">' + esc(r.note) + '</span>' : '') + '</div></a></li>';
  }

  /* ---------- écrans ---------- */
  function questions() {
    var o = function (label, sub, on, a, v, sw, grand) {
      return '<button type="button" class="choix' + (grand ? ' choix--nb' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" data-a="' + a + '" data-v="' + esc(v) + '">' +
        (sw ? '<span class="sw" style="--c:' + sw + '" aria-hidden="true"></span>' : '') + '<span><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></button>';
    };
    var Q = [
      { t: 'Vous êtes combien ce soir\u00a0?', c: '#F4CC71', cls: 'choix-nb', crumb: pW(e.p), opts: [1, 2, 3, 4, 5, 6].map(function (n) { return o(String(n), n > 1 ? 'personnes' : 'personne', e.p === n && e.step > 0, 'q-p', n, null, true); }) },
      { t: 'C\u2019est quel genre de soir\u00a0?', c: '#9CCBEF', crumb: e.sit.length ? MF.situation(e.sit[0]).nom : 'Tous les soirs', opts: MF.SITUATIONS.map(function (s) { return o(s.nom, s.question, e.sit.indexOf(s.key) > -1, 'q-sit', s.key, s.couleur); }).concat([o('Je ne sais pas', 'montrez-moi tout', false, 'q-sit', '')]) },
      { t: 'Plutôt quel budget\u00a0?', c: '#F6AA95', crumb: { b1: 'Moins de 2 €', b2: '2 à 4 €', b3: 'Plus de 4 €' }[e.budget] || 'Tout budget', opts: [['b1', 'Moins de 2\u00a0€', 'par personne'], ['b2', '2 à 4\u00a0€', 'par personne'], ['b3', 'Plus de 4\u00a0€', 'pour se faire plaisir'], ['', 'Peu importe', '']].map(function (b) { return o(b[1], b[2], (e.budget || '') === b[0] && e.step > 2, 'q-budget', b[0]); }) },
      { t: 'Et la viande\u00a0?', c: '#62B47E', crumb: { tout: 'De tout', flexitarien: 'Flexitarien', vegetarien: 'Végétarien', vegan: 'Végan', sansporc: 'Sans porc' }[e.regime], opts: [['tout', 'On mange de tout', ''], ['flexitarien', 'Un peu, pas tous les soirs', 'flexitarien'], ['vegetarien', 'Pas du tout', 'végétarien'], ['sansporc', 'Sans porc', '']].map(function (b) { return o(b[1], b[2], e.regime === b[0] && e.step > 3, 'q-regime', b[0]); }) },
      { t: 'Combien de temps devant vous\u00a0?', c: '#9599EA', crumb: '', opts: [['20', '20 minutes', 'à peine'], ['40', '40 minutes', 'tranquille'], ['', 'Une heure ou plus', 'on a le temps']].map(function (b) { return o(b[1], b[2], false, 'q-temps', b[0]); }) }
    ];
    var s = Math.min(e.step, 4), cur = Q[s];
    var miettes = Q.slice(0, s).map(function (x, k) { return '<button type="button" class="miette" data-a="q-step" data-v="' + k + '"><span style="background:' + x.c + '" aria-hidden="true"></span>' + esc(x.crumb) + '</button>'; }).join('');
    return '<section class="wrap ecran ecran-q" data-label="a. Questions">' +
      '<p class="small" style="font-weight:700;margin-bottom:10px">Question ' + (s + 1) + ' sur 5</p>' +
      (miettes ? '<div class="miettes">' + miettes + '</div>' : '') +
      '<div class="question deplie" style="--c:' + cur.c + '"><h1>' + cur.t + '</h1><div class="choix-grille ' + (cur.cls || '') + '">' + cur.opts.join('') + '</div></div>' +
      '<div class="row" style="justify-content:space-between;margin-top:20px">' +
      (s > 0 ? '<button type="button" class="btn-texte" style="text-decoration:none" data-a="q-step" data-v="' + (s - 1) + '">← Question précédente</button>' : '<span></span>') +
      '<a href="#resultats" data-a="ouvre-filtres" style="font-weight:700">Passer directement aux filtres →</a></div>' +
      (s === 0 ? '<p style="margin-top:28px"><span class="note">cinq questions, pas une de plus</span></p>' : '') + '</section>';
  }

  function groupes() {
    var m = e.membre;
    var G = [
      ['Salé ou sucré', [chip('Salé', e.plat === 'sale', 'f-plat', 'sale'), chip('Sucré', e.plat === 'sucre', 'f-plat', 'sucre')]],
      ['Situation', MF.SITUATIONS.map(function (s) { return chip(s.nom, e.sit.indexOf(s.key) > -1, 'f-sit', s.key, false, s.couleur); })],
      ['Régime', [['tout', 'Tout'], ['flexitarien', 'Flexitarien'], ['vegetarien', 'Végétarien'], ['vegan', 'Végan'], ['sansporc', 'Sans porc']].map(function (b) { return chip(b[1], e.regime === b[0], 'f-regime', b[0]); }).concat([chip('Sans gluten', e.sg, 'f-sg', 1), chip('Sans lactose', e.sl, 'f-sl', 1)])],
      ['Budget par portion', [['b1', 'Moins de 2 €'], ['b2', '2 à 4 €'], ['b3', 'Plus de 4 €']].map(function (b) { return chip(b[1], e.budget === b[0], 'f-budget', b[0]); })],
      ['Temps de préparation', [['20', '20 min max'], ['40', '40 min max']].map(function (b) { return chip(b[1], String(e.temps) === b[0], 'f-temps', b[0]); })],
      ['Allergènes à éviter', ['œuf', 'lait', 'gluten', 'soja', 'fruits à coque', 'poisson', 'crustacés', 'céleri', 'moutarde'].map(function (a) { return chip(a, e.allerg.indexOf(a) > -1, 'f-allerg', a); })],
      ['Batch ou du jour', [['batch', 'Batch cooking'], ['jour', 'Cuisine du jour']].map(function (b) { return chip(b[1], e.mode === b[0], 'f-mode', b[0], !m); }), !m],
      ['Saison', [['a', 'Automne'], ['h', 'Hiver'], ['p', 'Printemps'], ['e', 'Été']].map(function (b) { return chip(b[1], e.saison === b[0], 'f-saison', b[0], !m); }), !m],
      ['Je n\u2019aime pas', ['champignons', 'poivron', 'lardons', 'lait de coco', 'chou-fleur', 'olives'].map(function (x) { return chip(x, e.exclus.indexOf(x) > -1, 'f-exclus', x, !m); }), !m]
    ];
    return G.map(function (g) {
      return '<div class="groupe"><div class="groupe-titre"><h2>' + g[0] + '</h2>' + (g[2] ? '<span class="pastille">Membres</span>' : '') + '</div><div class="chips">' + g[1].join('') + '</div></div>';
    }).join('');
  }

  function ecranResultats() {
    var res = resultats(), libres = res.filter(function (r) { return r.libre; }).length;
    var actifs = [];
    if (e.plat) actifs.push([e.plat === 'sucre' ? 'Sucré' : 'Salé', 'f-plat', e.plat]);
    e.sit.forEach(function (k) { actifs.push([MF.situation(k).nom, 'f-sit', k]); });
    if (e.regime !== 'tout') actifs.push([{ flexitarien: 'Flexitarien', vegetarien: 'Végétarien', vegan: 'Végan', sansporc: 'Sans porc' }[e.regime], 'f-regime', 'tout']);
    if (e.budget) actifs.push([{ b1: 'Moins de 2 €', b2: '2 à 4 €', b3: 'Plus de 4 €' }[e.budget], 'f-budget', e.budget]);
    if (e.temps) actifs.push([e.temps + ' min max', 'f-temps', String(e.temps)]);
    if (e.sg) actifs.push(['Sans gluten', 'f-sg', 1]);
    if (e.sl) actifs.push(['Sans lactose', 'f-sl', 1]);
    e.allerg.forEach(function (a) { actifs.push(['Sans ' + a, 'f-allerg', a]); });
    if (e.membre && e.mode) actifs.push([e.mode === 'batch' ? 'Batch cooking' : 'Du jour', 'f-mode', e.mode]);
    if (e.membre && e.saison) actifs.push([{ a: 'Automne', h: 'Hiver', p: 'Printemps', e: 'Été' }[e.saison], 'f-saison', e.saison]);
    if (e.membre) e.exclus.forEach(function (x) { actifs.push(['Sans ' + x, 'f-exclus', x]); });
    return '<section class="wrap ecran" data-label="b. Résultats">' +
      '<div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1 class="t-l">' + res.length + (res.length > 1 ? ' idées' : ' idée') + ' pour ' + pW(e.p) + '</h1>' +
      '<p style="margin-top:8px">' + (e.membre ? 'Toutes les recettes, triées par temps de préparation.' : libres + ' recettes gratuites. Les autres seront réservées aux membres.') + '</p></div>' +
      '<button type="button" class="btn btn--contour bouton-filtres" data-a="toggle-filtres" aria-expanded="' + e.filtres + '" aria-controls="panneau">' + (e.filtres ? 'Fermer les filtres' : 'Filtres' + (actifs.length ? ' (' + actifs.length + ')' : '')) + '</button></div>' +
      (actifs.length ? '<div class="actifs">' + actifs.map(function (a) { return '<button type="button" class="actif" data-a="' + a[1] + '" data-v="' + esc(a[2]) + '" aria-label="Retirer le filtre ' + esc(a[0]) + '">' + esc(a[0]) + ' <span aria-hidden="true">×</span></button>'; }).join('') + '</div>' : '') +
      '<div class="resultats-grille' + (e.filtres ? ' filtres-ouverts' : '') + '">' +
      '<aside id="panneau" class="panneau" aria-label="Filtres"><div class="groupe"><h2>Personnes au foyer</h2>' + compteur('pers', pW(e.p)) + '</div>' + groupes() +
      '<button type="button" class="btn-texte" data-a="raz">Tout effacer</button></aside>' +
      '<div>' + (res.length ? '<ul class="cartes">' + res.map(carte).join('') + '</ul>' :
        '<div class="vide"><p style="font-weight:800;font-size:22px">Rien ne correspond à tous ces filtres.</p><p>Retirez-en un, en touchant sa pastille en haut.</p></div>') + '</div></div></section>';
  }

  function ecranFiche(id) {
    if (id && !MF.recette(id)) return '<section class="wrap ecran"><a href="#resultats" style="font-weight:700;text-decoration:none">← Retour aux idées</a><div class="encart" style="--c:var(--boucle-dor);margin-top:26px"><p style="font-weight:800;font-size:24px;line-height:1.2">Cette recette est réservée aux membres.</p><p>L\u2019abonnement n\u2019est pas encore ouvert : rejoignez la liste d\u2019attente. Les 50 recettes gratuites restent à vous.</p><a class="btn btn--encre" href="tarifs.html#liste-attente">Rejoindre la liste d\u2019attente <span class="fl" aria-hidden="true">→</span></a></div></section>';
    var r = MF.recette(id) || MF.RECETTES[0], s = MF.situation(r.situation), P = e.fp || e.p, verrou = !r.libre && !e.membre;
    var groupesIng = []; r.ingredients.forEach(function (it) { var g = groupesIng[groupesIng.length - 1]; if (!g || g.t !== it.groupe) { g = { t: it.groupe || '', items: [] }; groupesIng.push(g); } g.items.push(U.quantite(it, P)); });
    if (!groupesIng.length) groupesIng.push({ t: '', items: [] });
    var groupesEt = [{ t: r.variantes ? 'La base commune' : '', st: r.etapes }];
    if (r.variantes) {
      var nv = e.variant === 'deux' ? Math.ceil(P / 2) : e.variant === 'viande' ? P : 0, ng = P - nv;
      [['viande', nv], ['vege', ng]].forEach(function (x) {
        if (!x[1]) return; var v = r.variantes[x[0]];
        groupesIng.push({ t: v.nom + ' · ' + pW(x[1]), items: v.ingredients.map(function (it) { return U.quantite(it, x[1]); }), c: x[0] === 'viande' ? '#F4CC71' : '#62B47E' });
        groupesEt.push({ t: v.nom, st: v.etapes, c: x[0] === 'viande' ? '#F4CC71' : '#62B47E' });
      });
    }
    var n = 0;
    var ing = groupesIng.map(function (g) { return '<div class="ing-groupe"' + (g.c ? ' style="--c:' + g.c + '"' : '') + '>' + (g.t ? '<h3>' + esc(g.t) + '</h3>' : '') + '<ul>' + g.items.map(function (it) { return '<li><b>' + it.q + '</b> ' + esc(it.n) + '</li>'; }).join('') + '</ul></div>'; }).join('');
    var et = groupesEt.map(function (g) { return '<div class="et-groupe">' + (g.t ? '<h3>' + esc(g.t) + '</h3>' : '') + '<ol>' + g.st.map(function (t) { n++; return '<li><span class="n" style="--c:' + (g.c || s.couleur) + ';color:' + (g.c ? E : s.ink) + '" aria-hidden="true">' + n + '</span><span>' + esc(t) + '</span></li>'; }).join('') + '</ol></div>'; }).join('');
    var vb = function (k, l) { return '<button type="button" class="chip" aria-pressed="' + (e.variant === k) + '" data-a="variant" data-v="' + k + '">' + l + '</button>'; };
    var ajoute = e.ajoute === r.id;
    return '<section class="wrap ecran" data-label="c. Fiche recette">' +
      '<a href="#resultats" style="font-weight:700;text-decoration:none">← Retour aux idées</a>' +
      '<div class="fiche-tete deplie" style="--c:' + s.couleur + ';--ink:' + s.ink + '"><div class="fiche-titre"><p class="onglet-fiche">' + esc(s.nom) + '</p><h1>' + esc(r.titre) + '</h1>' +
      '<p class="fiche-meta"><span><b>Préparation</b> ' + r.prep + ' min</span><span><b>Cuisson</b> ' + U.duree(r.cuisson) + '</span><span><b>Budget</b> ' + U.euro(r.budget) + ' / pers.</span></p></div>' +
      U.cadrePhoto(r, s, 'fiche-photo') + '</div>' +
      '<div class="row" style="justify-content:space-between;margin-top:22px"><div class="row" style="gap:10px"><span style="font-weight:700">Pour</span>' + compteur('fpers', pW(P)) + '</div>' +
      (r.note && !verrou ? '<span class="note">' + esc(r.note) + '</span>' : '') + '</div>' +
      (r.variantes && !verrou ? '<div class="chips" role="group" aria-label="Version" style="margin-top:18px">' + vb('deux', 'Les deux') + vb('viande', 'Tout avec viande') + vb('vege', 'Tout sans viande') + '</div>' : '') +
      (r.sansViande && !verrou ? '<div class="encart sans-viande" style="--c:#9599EA"><p style="font-weight:800;font-size:24px;line-height:1.15">L\u2019assiette sans viande</p>' + (r.sansViande.soeur ? '<p>Même base, sans viande&nbsp;: <a href="#fiche/' + r.sansViande.soeur + '" style="font-weight:700">' + esc(r.sansViande.titre) + ' →</a></p>' : '<p style="font-weight:700">' + esc(r.sansViande.texte) + '</p>') + '</div>' : '') +
      (verrou ?
        '<div class="encart" style="--c:var(--boucle-dor);margin-top:26px"><p style="font-weight:800;font-size:24px;line-height:1.2">Cette recette fait partie du classeur complet.</p><p>Elle est réservée aux membres. L\u2019abonnement n\u2019est pas encore ouvert : rejoignez la liste d\u2019attente. Les 50 recettes gratuites restent à vous.</p><a class="btn btn--encre" href="tarifs.html#liste-attente">Rejoindre la liste d\u2019attente <span class="fl" aria-hidden="true">→</span></a></div>' :
        '<div class="fiche-corps"><div class="ing"><h2>Ingrédients</h2>' + ing + '</div><div class="et"><h2>Étapes</h2>' + et + '</div></div>' +
        '<div class="row fiche-actions"><button type="button" class="btn" data-a="ajoute" data-v="' + r.id + '">' + (ajoute ? 'Ajoutée à ma semaine' : 'Ajouter à ma semaine') + '</button>' +
        '<a href="fiche.html?id=' + r.id + '&amp;p=' + P + '" style="font-weight:700">Imprimer la fiche en A4</a>' +
        (ajoute ? '<p style="font-weight:700;width:100%">Elle remplace le dîner de dimanche. <a href="#semaine">Voir ma semaine</a></p>' : '') + '</div>') +
      '</section>';
  }

  function ecranSemaine() {
    var C = courses(), reste = 0; C.forEach(function (g) { g.items.forEach(function (i) { if (!i.on) reste++; }); });
    var jours = JOURS.map(function (d, i) {
      var r = MF.recette(e.semaine[i]); if (!r) return ''; var s = MF.situation(r.situation);
      return '<li class="jour"><span class="jour-nom">' + d + '</span><div class="jour-fond" style="--c:' + s.couleur + '"><div class="jour-carte' + (e.anim === i ? ' deplie' : '') + '" data-jour="' + i + '">' +
        '<a href="#fiche/' + r.id + '"><b>' + esc(r.titre) + '</b><span>' + esc(s.nom) + ' · ' + r.prep + ' min</span></a>' +
        '<button type="button" class="chip" data-a="changer" data-v="' + i + '" aria-label="Changer la recette de ' + d + '">Autre idée</button></div></div></li>';
    }).join('');
    e.anim = null;
    return '<section class="wrap ecran" data-label="d. Ma semaine">' +
      '<div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1 class="t-l">Ma semaine</h1><p style="margin-top:8px">Sept dîners pour ' + pW(e.p) + '. Glissez une recette vers la droite pour en changer.</p></div>' + compteur('pers', pW(e.p)) + '</div>' +
      '<div class="semaine-grille"><ol class="jours">' + jours + '</ol>' +
      '<div class="courses"><div class="row" style="justify-content:space-between;align-items:baseline"><h2 class="t-m">La liste de courses</h2><span class="small" style="font-weight:700">' + reste + ' à acheter</span></div>' +
      '<p class="small" style="margin-top:6px">Calculée pour la semaine, rangée par rayon. Touchez ce que vous avez déjà.</p>' +
      C.map(function (g) { return '<h3>' + esc(g.rayon) + '</h3><ul>' + g.items.map(function (i) { return '<li><button type="button" data-a="coche" data-v="' + esc(i.k) + '" aria-pressed="' + i.on + '"><span class="case" aria-hidden="true">' + (i.on ? '✓' : '') + '</span><span><b>' + i.q + '</b> ' + esc(i.n) + '</span></button></li>'; }).join('') + '</ul>'; }).join('') +
      '<button type="button" class="btn btn--encre btn--plein" style="margin-top:22px" data-a="imprimer">Imprimer la liste</button></div></div>' +
      '<p class="small" style="margin-top:28px"><button type="button" class="btn-texte" data-a="demo-gratuit">Revenir au mode gratuit (démonstration)</button></p></section>';
  }

  function ecranMembre(raison) {
    var T = { semaine: 'Le menu de la semaine fait partie de l\u2019abonnement.', filtres: 'Ce filtre fait partie de l\u2019abonnement.', recette: 'Cette recette fait partie de l\u2019abonnement.', tarifs: 'L\u2019abonnement n\u2019est pas encore ouvert.' };
    var an = e.formule === 'an';
    var li = function (x, c) { return '<li style="--c:' + c + '">' + x + '</li>'; };
    return '<section class="wrap ecran" data-label="e. Passage membre">' +
      '<a href="#resultats" style="font-weight:700;text-decoration:none">← Retour aux idées</a>' +
      '<h1 class="t-l" style="margin-top:12px;max-width:20ch">' + (T[raison] || T.semaine) + '</h1>' +
      '<p class="chapo" style="margin-top:12px;max-width:46ch">Rien de ce que vous utilisez déjà ne disparaît. L\u2019abonnement ajoute le reste du classeur.</p>' +
      '<div class="grid-2" style="margin-top:28px;align-items:start">' +
      '<div class="encart deplie" style="--c:var(--boucle-dor);border-radius:6px 24px 24px 24px"><h2 class="t-m">Avec l\u2019abonnement</h2>' +
      '<div class="bascule" role="group" aria-label="Formule"><button type="button" class="chip" aria-pressed="' + an + '" data-a="formule" data-v="an">À l\u2019année</button><button type="button" class="chip" aria-pressed="' + !an + '" data-a="formule" data-v="mois">Au mois</button></div>' +
      '<p class="row" style="gap:6px 12px;align-items:baseline"><span style="font-weight:800;font-size:50px;line-height:1;letter-spacing:-.02em">' + (an ? '29\u00a0€' : '3,90\u00a0€') + '</span><span style="font-weight:700">' + (an ? 'par an, et le classeur PDF offert' : 'par mois') + '</span></p>' +
      '<ul class="liste-onglets">' + ['Plus de 700 recettes du classeur', 'Tous les filtres, dont goûts, saison et batch', 'Le menu de la semaine, à changer d\u2019un geste', 'La liste de courses calculée et rangée par rayon', 'Vos recettes favorites'].concat(an ? ['Le classeur PDF à imprimer, offert'] : []).map(function (x) { return li(x, E); }).join('') + '</ul>' +
      '<a class="btn btn--encre btn--plein" href="tarifs.html#liste-attente">Rejoindre la liste d\u2019attente <span class="fl" aria-hidden="true">→</span></a>' +
      '<p class="small">On vous écrit à l\u2019ouverture de l\u2019abonnement.</p></div>' +
      '<div class="encart" style="--c:var(--blanc);border:1px solid var(--filet)"><h2 style="font-size:24px">Déjà à vous, sans compte</h2><ul class="liste-onglets">' +
      ['50 recettes, sans créer de compte', 'Les filtres situation, régime, budget, temps et allergènes', 'Les quantités ajustées au nombre de personnes', 'Les fiches à imprimer en A4', 'La feuille du jeudi, chaque semaine par email'].map(function (x) { return li(x, '#9CCBEF'); }).join('') +
      '</ul><a class="btn btn--contour" href="#resultats">Continuer gratuitement</a><p><a href="tarifs.html">Comparer toutes les offres</a></p></div></div></section>';
  }

  /* ---------- routeur ---------- */
  var derniere = '';
  function rendre() {
    var h = location.hash.replace(/^#/, '') || 'questions', parts = h.split('/');
    var html;
    if (parts[0] === 'resultats') html = ecranResultats();
    else if (parts[0] === 'fiche') html = ecranFiche(parts[1]);
    else if (parts[0] === 'semaine') html = e.membre ? ecranSemaine() : ecranMembre('semaine');
    else if (parts[0] === 'membre') html = ecranMembre(parts[1] || 'tarifs');
    else html = questions();
    app.innerHTML = html;
    U.maj(app);
    // La liste statique reste dans la page ; elle s'efface quand l'outil affiche un autre écran que les questions.
    var liste = document.getElementById('liste-gratuite');
    if (liste) liste.hidden = !(parts[0] === 'questions' || !location.hash);
    if (derniere !== h) { window.scrollTo(0, 0); derniere = h; }
  }
  window.addEventListener('hashchange', function () { if (!/^#fiche/.test(location.hash)) e.fp = null; e.ajoute = null; rendre(); });

  function bascule(arr, v) { var i = arr.indexOf(v); return i > -1 ? arr.filter(function (x) { return x !== v; }) : arr.concat([v]); }
  function suivante(patch) {
    if (e.step < 4) set(Object.assign(patch, { step: e.step + 1 }));
    else { Object.assign(e, patch); garde(); location.hash = 'resultats'; }
  }
  app.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-a]'); if (!b) return;
    var a = b.getAttribute('data-a'), v = b.getAttribute('data-v');
    switch (a) {
      case 'q-p': return suivante({ p: +v });
      case 'q-sit': return suivante({ sit: v ? [v] : [], plat: v === 'manches' ? 'sucre' : v ? 'sale' : null });
      case 'f-plat': return set({ plat: e.plat === v ? null : v });
      case 'q-budget': return suivante({ budget: v || null });
      case 'q-regime': return suivante({ regime: v });
      case 'q-temps': return suivante({ temps: v ? +v : null });
      case 'q-step': return set({ step: +v });
      case 'ouvre-filtres': e.filtres = true; garde(); return;
      case 'toggle-filtres': return set({ filtres: !e.filtres });
      case 'pers': return set({ p: Math.max(1, Math.min(6, e.p + +v)) });
      case 'fpers': return set({ fp: Math.max(1, Math.min(6, (e.fp || e.p) + +v)) });
      case 'f-sit': return set({ sit: bascule(e.sit, v) });
      case 'f-regime': return set({ regime: e.regime === v ? 'tout' : v });
      case 'f-sg': return set({ sg: !e.sg });
      case 'f-sl': return set({ sl: !e.sl });
      case 'f-budget': return set({ budget: e.budget === v ? null : v });
      case 'f-temps': return set({ temps: String(e.temps) === v ? null : +v });
      case 'f-allerg': return set({ allerg: bascule(e.allerg, v) });
      case 'f-mode': return set({ mode: e.mode === v ? null : v });
      case 'f-saison': return set({ saison: e.saison === v ? null : v });
      case 'f-exclus': return set({ exclus: bascule(e.exclus, v) });
      case 'raz': return set({ plat: null, sit: [], budget: null, regime: 'tout', temps: null, sg: false, sl: false, allerg: [], mode: null, saison: null, exclus: [] });
      case 'membre': location.hash = 'membre/' + v; return;
      case 'variant': return set({ variant: v });
      case 'ajoute': if (!e.membre) { location.hash = 'membre/semaine'; return; } e.semaine[6] = v; e.anim = 6; return set({ ajoute: v });
      case 'changer': return changer(+v);
      case 'coche': var c = Object.assign({}, e.coche); c[v] = !c[v]; return set({ coche: c });
      case 'imprimer': return window.print();
      case 'formule': return set({ formule: v });
      case 'demo-gratuit': e.membre = false; garde(); location.hash = 'resultats'; return;
    }
  });

  // Glisser une journée vers la droite pour changer de recette.
  var drag = null;
  app.addEventListener('pointerdown', function (ev) {
    var c = ev.target.closest('.jour-carte'); if (!c || ev.target.closest('button')) return;
    drag = { el: c, x: ev.clientX, y: ev.clientY, d: +c.getAttribute('data-jour'), moved: false };
  });
  app.addEventListener('pointermove', function (ev) {
    if (!drag) return; var dx = ev.clientX - drag.x;
    if (Math.abs(ev.clientY - drag.y) > 30 && !drag.moved) { drag = null; return; }
    if (dx > 6) { drag.moved = true; drag.el.style.transform = 'translateX(' + Math.min(dx, 130) + 'px)'; }
  });
  function fin(ev) {
    if (!drag) return; var dx = ev.clientX - drag.x, d = drag.d, el = drag.el, m = drag.moved; drag = null;
    el.style.transform = '';
    if (m) { ev.preventDefault(); el.addEventListener('click', function stop(x) { x.preventDefault(); el.removeEventListener('click', stop, true); }, true); }
    if (dx > 80) changer(d);
  }
  app.addEventListener('pointerup', fin);
  app.addEventListener('pointercancel', function () { if (drag) { drag.el.style.transform = ''; drag = null; } });

  rendre();
});
