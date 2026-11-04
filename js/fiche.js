/* Mille Feuilles · rendu des fiches A4. fiche.html?id=chili&p=4 ; sans id : deux fiches d'exemple. */
(function () {
  var MF = window.MF, U = window.MFU, box = document.getElementById('feuilles');
  if (!MF || !U || !box) return;
  var q = new URLSearchParams(location.search);
  if (q.get('mini')) document.body.classList.add('mini');
  var P = Math.max(1, Math.min(8, +q.get('p') || 4));
  var ids = q.get('id') ? q.get('id').split(',') : ['chili', 'brioche'];
  function li(it, m) { var f = U.quantite(it, m); return '<li><span><b>' + f.q + '</b> ' + U.esc(f.n) + '</span></li>'; }
  function fiche(r) {
    var s = MF.situation(r.situation), idx = MF.SITUATIONS.indexOf(s), num = MF.RECETTES.filter(function (x) { return x.situation === r.situation; }).indexOf(r) + 1;
    var tags = [r.batch ? 'Batch' : '', r.regime === 'vegan' ? 'Végan' : r.regime === 'vege' ? 'Végétarien' : r.regime === 'base' ? 'Avec et sans viande' : '', r.gluten ? '' : 'Sans gluten', r.saisons.length === 4 ? 'Toute l\u2019année' : ''].filter(Boolean);
    var ing = '<ul>' + r.ingredients.map(function (it) { return li(it, P); }).join('') + '</ul>';
    var n = 0, et = '<ol>' + r.etapes.map(function (t) { n++; return '<li><span class="n" style="--c:' + s.couleur + ';color:' + s.ink + '">' + n + '</span><span>' + U.esc(t) + '</span></li>'; }).join('') + '</ol>';
    if (r.variantes) {
      var nv = Math.ceil(P / 2), ng = P - nv;
      [['viande', nv, '#F4CC71'], ['vege', ng, '#62B47E']].forEach(function (x) {
        var v = r.variantes[x[0]];
        ing += '<h3 style="--c:' + x[2] + '">' + v.nom + ' · ' + x[1] + '</h3><ul>' + v.ingredients.map(function (it) { return li(it, x[1]); }).join('') + '</ul>';
        et += '<h3 style="--c:' + x[2] + '">' + v.nom + '</h3><ol>' + v.etapes.map(function (t) { n++; return '<li><span class="n" style="--c:' + x[2] + '">' + n + '</span><span>' + U.esc(t) + '</span></li>'; }).join('') + '</ol>';
      });
    }
    var tabs = MF.SITUATIONS.map(function (x, i) { return '<i class="' + (i === idx ? 'ici' : '') + '" style="--c:' + x.couleur + '"></i>'; }).join('');
    return '<article class="a4" style="--c-sit:' + s.couleur + '">' +
      '<header class="a4-tete" style="--c:' + s.couleur + ';--ink:' + s.ink + '"><div class="haut"><span class="sit">' + U.esc(s.nom) + '</span><span class="num">n° ' + num + '</span></div>' +
      '<h1>' + U.esc(r.titre) + '</h1>' +
      '<p class="meta"><span><b>Pour</b> ' + P + (r.situation === 'manches' ? ' parts' : ' personnes') + '</span><span><b>Préparation</b> ' + r.prep + ' min</span><span><b>Cuisson</b> ' + U.duree(r.cuisson) + '</span><span><b>Budget</b> ' + U.euro(r.budget) + ' / pers.</span></p>' +
      (tags.length ? '<p class="tags">' + tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</p>' : '') + '</header>' +
      '<div class="a4-photo"><span class="ruban" aria-hidden="true"></span>' + U.cadrePhoto(r, s) + '</div>' +
      '<div class="a4-tabs" aria-hidden="true">' + tabs + '</div>' +
      '<div class="a4-corps"><div><div class="a4-ing"><h2>Ingrédients</h2>' + ing + '</div>' + (r.note ? '<p class="note a4-note">' + U.esc(r.note) + '</p>' : '') + '</div>' +
      '<div class="a4-et"><h2>Étapes</h2>' + et + '</div></div>' +
      '<div class="a4-notes" aria-hidden="true"><h2>nos notes</h2>' + new Array(14).join('<i></i>') + '</div>' + '<footer class="a4-pied">' + U.logoSVG(false) + '<p class="sign"><b>' + U.esc(s.nom) + '</b>une collection Studio Mille Pages · millefeuilles.fr</p></footer>' +
      '</article>';
  }
  box.innerHTML = ids.map(function (id) { return MF.recette(id); }).filter(Boolean).map(fiche).join('');
  U.maj(box);
  document.querySelectorAll('.a4-pied svg .tab').forEach(function (t) { t.style.animation = 'none'; });
  if (window.innerWidth < 820) box.style.setProperty('--z', ((window.innerWidth - 16) / 794).toFixed(3));
})();
