/* Mille Feuilles · chargement de la base data/recettes.json.
   Convertit chaque recette au format utilisé par l'outil, les pages et les fiches A4.
   Les quantités du JSON valent pour « personnes_base » : on les ramène à une personne.
   Photo : images/recettes/<slug>.webp. Tant que le fichier n'existe pas, une carte
   typographique aux couleurs de l'intercalaire s'affiche à la place. */
(function () {
  var attente = [], pret = false;
  window.MFpret = function (cb) { if (pret) cb(); else attente.push(cb); };
  var COUL = { chrono: '#F4CC71', frigo: '#9CCBEF', base: '#9599EA', manches: '#FF8FC2', recoit: '#62B47E', reconfort: '#F6AA95', budget: '#534741' };
  var QUESTION = { chrono: 'Il faut aller vite', frigo: 'Le frigo fait la tête', base: 'On ne mange pas pareil', manches: 'Envie de pâtisser', recoit: 'On a du monde', reconfort: 'Besoin d\u2019un plat doudou', budget: 'C\u2019est la fin du mois' };
  var SAISON = { 'printemps': 'p', 'été': 'e', 'automne': 'a', 'hiver': 'h' };
  var ALLERG = { 'œufs': 'œuf' };
  var RAYONS = ['Légumes', 'Fruits', 'Boucherie, poisson', 'Crèmerie, œufs', 'Épicerie', 'Surgelés'];

  function note(n) {
    if (!n) return '';
    var c = n.split(/\s*;\s*/)[0].replace(/\.$/, '');
    return c.length <= 48 ? c.charAt(0).toLowerCase() + c.slice(1) : '';
  }
  function convertir(r, parId) {
    var pb = r.personnes_base || 4;
    var sv = r.version_sans_viande, sansViande = null;
    if (sv) sansViande = sv.type === 'recette_soeur' && parId[sv.recette_id]
      ? { soeur: parId[sv.recette_id].slug, titre: sv.titre }
      : { texte: sv.texte };
    var saisons = r.saison && r.saison.indexOf('toute') < 0
      ? r.saison.split(/\s*,\s*/).map(function (s) { return SAISON[s] || ''; }).join('') : 'peah';
    return {
      id: r.slug, num: r.id, titre: r.titre, type: r.type, situation: r.situation,
      regime: r.situation === 'base' ? 'base' : r.regime === 'végan' ? 'vegan' : r.regime === 'végétarien' ? 'vege' : 'tout',
      porc: !!r.contient_porc, gluten: r.allergenes.indexOf('gluten') > -1, lactose: r.allergenes.indexOf('lait') > -1,
      allergenes: r.allergenes.map(function (a) { return ALLERG[a] || a; }),
      budget: r.budget_portion, prep: r.preparation_minutes || r.temps_minutes, cuisson: r.cuisson_minutes || 0, total: r.temps_minutes,
      batch: r.batch === 'oui', saisons: saisons, libre: r.gratuit === 'oui', note: note(r.notes), notesPdf: r.notes || '',
      personnesBase: pb, portionsPdf: r.portions_pdf,
      ingredients: r.ingredients.map(function (it) {
        return { q: it.quantite == null ? null : it.quantite / pb, u: it.unite, n: it.quantite == null ? it.texte : it.nom, rayon: it.rayon, groupe: it.groupe || '' };
      }),
      etapes: r.etapes, sansViande: sansViande,
      photo: 'images/recettes/' + r.image
    };
  }
  // Recette membre : titre et filtres seulement. Le contenu n'est jamais en ligne.
  function apercu(r) {
    return {
      id: r.slug, num: r.id, titre: r.titre, type: r.type, situation: r.situation, apercu: true,
      regime: r.situation === 'base' ? 'base' : r.regime === 'végan' ? 'vegan' : r.regime === 'végétarien' ? 'vege' : 'tout',
      porc: !!r.contient_porc, gluten: r.allergenes.indexOf('gluten') > -1, lactose: r.allergenes.indexOf('lait') > -1,
      allergenes: r.allergenes.map(function (a) { return ALLERG[a] || a; }),
      budget: r.budget_portion, prep: r.temps_minutes, cuisson: 0, total: r.temps_minutes,
      batch: false, saisons: 'peah', libre: false, note: '', notesPdf: '', personnesBase: 4,
      ingredients: [], etapes: [], sansViande: null, photo: 'images/recettes/' + r.image
    };
  }
  function demarrer(doc) {
    var parId = {}; doc.recettes.forEach(function (r) { parId[r.id] = r; });
    (doc.apercus || []).forEach(function (r) { parId[r.id] = r; });
    var R = doc.recettes.map(function (r) { return convertir(r, parId); })
      .concat((doc.apercus || []).map(apercu)).sort(function (a, b) { return a.num - b.num; });
    var compte = {}; R.forEach(function (r) { compte[r.situation] = (compte[r.situation] || 0) + 1; });
    var S = doc.situations.map(function (s) {
      return { key: s.key, nom: s.nom, couleur: s.couleur || COUL[s.key], ink: s.key === 'budget' ? '#F8F5F4' : '#534741', question: QUESTION[s.key] || '', nombre: compte[s.key] || 0 };
    });
    window.MF = {
      SITUATIONS: S.filter(function (s) { return s.nombre > 0; }), TOUTES_SITUATIONS: S, RAYONS: RAYONS, RECETTES: R,
      situation: function (k) { for (var i = 0; i < S.length; i++) if (S[i].key === k) return S[i]; return S[0]; },
      recette: function (id) { for (var i = 0; i < R.length; i++) if (R[i].id === id || String(R[i].num) === String(id)) return R[i]; return null; }
    };
    pret = true; attente.splice(0).forEach(function (cb) { cb(); });
  }
  var base = document.currentScript ? document.currentScript.src.replace(/js\/donnees\.js.*$/, '') : location.href;
  var lire = function (f) { return fetch(new URL(f, base)).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); };
  Promise.all([lire('data/recettes.json'), lire('data/membres-apercu.json').catch(function () { return { recettes: [] }; })])
    .then(function (x) { x[0].apercus = x[1].recettes; demarrer(x[0]); })
    .catch(function (e) {
      console.error('Mille Feuilles : impossible de lire data/recettes.json', e);
      var app = document.getElementById('app');
      if (app) app.innerHTML = '<section class="wrap section"><p>Les recettes n\u2019ont pas pu être chargées. Ouvrez le site depuis son adresse en ligne (GitHub Pages) et non en double-cliquant sur le fichier.</p></section>';
    });
})();
