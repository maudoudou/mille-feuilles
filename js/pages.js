/* Mille Feuilles · petits comportements des pages (accueil, classeur, tarifs, formulaires). */
window.MFpret(function () {
  var MF = window.MF, U = window.MFU;
  function feuille(id, i) {
    var r = MF.recette(id); if (!r) return '';
    var s = MF.situation(r.situation);
    return '<a class="feuille" href="recettes.html#fiche/' + r.id + '">' + U.cadrePhoto(r, s) +
      '<span class="legende"><span class="onglet" style="--c:' + s.couleur + ';--ink:' + s.ink + ';font-size:14px;margin-bottom:6px">' + U.esc(s.nom) + '</span><br>' + U.esc(r.titre) + '</span></a>';
  }
  function pile(el, ids, note) {
    if (!el) return;
    el.innerHTML = ids.map(feuille).join('') + (note ? '<span class="note">' + note + '</span>' : '');
  }
  if (MF && U) {
    pile(document.getElementById('pile-accueil'), ['recette-membre', 'chili-con-carne', 'tartiflette'], 'toutes testées chez nous');
    pile(document.getElementById('pile-classeur'), ['dahl-de-lentilles-corails', 'tiramisu-express', 'quiche-lorraine']);
    pile(document.getElementById('pile-produit'), ['recette-membre', 'ratatouille', 'couscous-express'], '500 comme ça');
    var ex = document.getElementById('exemples-accueil');
    if (ex) {
      ex.innerHTML = ['couscous-express', 'chili-con-carne', 'dahl-de-lentilles-corails', 'one-pot-pasta-tomates-et-thon', 'hachis-parmentier', 'recette-membre'].map(function (id, i) {
        var r = MF.recette(id); if (!r) return ''; var s = MF.situation(r.situation);
        return '<li class="carte" style="--c:' + s.couleur + '"><a href="recettes.html#fiche/' + r.id + '" style="--i:' + i + '">' + U.cadrePhoto(r, s) +
          '<div class="corps"><span class="sit">' + U.esc(s.nom) + '</span><h3>' + U.esc(r.titre) + '</h3><span class="meta"><span>' + r.prep + ' min</span><span>' + U.euro(r.budget) + ' / pers.</span></span>' +
          (r.note && i % 2 === 0 ? '<span class="note">' + U.esc(r.note) + '</span>' : '') + '</div></a></li>';
      }).join('');
    }
    var ap = document.getElementById('apercus');
    if (ap) {
      ap.innerHTML = [['chili-con-carne', 'Une base, deux assiettes'], ['recette-membre', 'Dimanche, on retrousse les manches'], ['dahl-de-lentilles-corails', 'Petit budget'], ['recette-membre', 'On reçoit']].map(function (x) {
        return '<figure><a href="fiche.html?id=' + x[0] + '" aria-label="Voir la fiche en grand"><div class="mini"><iframe src="fiche.html?id=' + x[0] + '&amp;mini=1" title="Aperçu de fiche" loading="lazy" tabindex="-1"></iframe></div></a><figcaption>' + x[1] + '</figcaption></figure>';
      }).join('');
      var fit = function () { ap.querySelectorAll('.mini').forEach(function (m) { var f = m.querySelector('iframe'); f.style.transform = 'scale(' + (m.clientWidth / 794) + ')'; }); };
      fit(); window.addEventListener('resize', fit);
    }
    U.maj();
  }
});
(function () {
  // Inscription à la feuille du jeudi : remplacez action="#" par l'adresse de votre outil d'emailing.
  document.querySelectorAll('form[data-newsletter]').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      if (f.getAttribute('action') && f.getAttribute('action') !== '#') return;
      ev.preventDefault();
      f.querySelector('[data-avant]').hidden = true; f.querySelector('[data-apres]').hidden = false;
    });
  });
  // Tarifs : bascule année / mois.
  var t = document.querySelector('[data-tarif]');
  if (t) t.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-formule]'); if (!b) return;
    var an = b.getAttribute('data-formule') === 'an';
    t.querySelectorAll('[data-formule]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    t.querySelector('[data-prix]').textContent = an ? '29\u00a0€' : '3,90\u00a0€';
    t.querySelector('[data-prix-sous]').textContent = an ? 'par an, soit 2,42\u00a0€ par mois' : 'par mois';
    t.querySelector('[data-an-seul]').hidden = !an;
  });
})();
