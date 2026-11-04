/* Mille Feuilles · rendu des fiches A4. fiche.html?id=chili&p=4 ; sans id : deux fiches d'exemple. */
window.MFpret(function () {
  var MF = window.MF, U = window.MFU, box = document.getElementById('feuilles');
  if (!MF || !U || !box) return;
  var q = new URLSearchParams(location.search);
  if (q.get('mini')) document.body.classList.add('mini');
  var Pq = +q.get('p') || 0;
  var ids = q.get('id') ? q.get('id').split(',') : ['chili-con-carne', 'cheesecake-rapide'];
  function li(it, m) { var f = U.quantite(it, m); return '<li><span><b>' + f.q + '</b> ' + U.esc(f.n) + '</span></li>'; }
  // Recette membre : titre, accroche et invitation à la liste d'attente, rien d'autre.
  function ficheMembre(r) {
    var s = MF.situation(r.situation);
    return '<article class="a4" style="--c-sit:' + s.couleur + '">' +
      '<header class="a4-tete" style="--c:' + s.couleur + ';--ink:' + s.ink + '"><div class="haut"><span class="sit">' + U.esc(s.nom) + '</span></div><h1>' + U.esc(r.titre) + '</h1></header>' +
      '<div class="encart" style="--c:var(--boucle-dor);margin:40px 56px"><p style="font-weight:800;font-size:24px;line-height:1.2">Une recette de l\u2019intercalaire «\u00a0' + U.esc(s.nom) + '\u00a0», réservée aux membres.</p>' +
      '<p>L\u2019abonnement n\u2019est pas encore ouvert. Rejoignez la liste d\u2019attente, on vous écrit à l\u2019ouverture.</p>' +
      '<a class="btn btn--encre" target="_top" href="tarifs.html#liste-attente">Rejoindre la liste d\u2019attente <span class="fl" aria-hidden="true">→</span></a></div></article>';
  }
  function fiche(r) {
    if (r.apercu) return ficheMembre(r);
    var P = Math.max(1, Math.min(8, Pq || r.personnesBase)), s = MF.situation(r.situation), idx = MF.TOUTES_SITUATIONS.indexOf(s), num = r.num;
    var tags = [r.batch ? 'Batch' : '', r.regime === 'vegan' ? 'Végan' : r.regime === 'vege' ? 'Végétarien' : r.regime === 'base' ? 'Avec et sans viande' : '', r.gluten ? '' : 'Sans gluten', r.saisons.length === 4 ? 'Toute l\u2019année' : ''].filter(Boolean);
    var ing = '', g = null; r.ingredients.forEach(function (it) { if (it.groupe !== g) { if (g !== null) ing += '</ul>'; g = it.groupe; ing += (g ? '<h3 style="--c:' + s.couleur + ';color:' + s.ink + '">' + U.esc(g) + '</h3>' : '') + '<ul>'; } ing += li(it, P); }); ing += '</ul>';
    var n = 0, et = '<ol>' + r.etapes.map(function (t) { n++; return '<li><span class="n" style="--c:' + s.couleur + ';color:' + s.ink + '">' + n + '</span><span>' + U.esc(t) + '</span></li>'; }).join('') + '</ol>';
    if (r.variantes) {
      var nv = Math.ceil(P / 2), ng = P - nv;
      [['viande', nv, '#F4CC71'], ['vege', ng, '#62B47E']].forEach(function (x) {
        var v = r.variantes[x[0]];
        ing += '<h3 style="--c:' + x[2] + '">' + v.nom + ' · ' + x[1] + '</h3><ul>' + v.ingredients.map(function (it) { return li(it, x[1]); }).join('') + '</ul>';
        et += '<h3 style="--c:' + x[2] + '">' + v.nom + '</h3><ol>' + v.etapes.map(function (t) { n++; return '<li><span class="n" style="--c:' + x[2] + '">' + n + '</span><span>' + U.esc(t) + '</span></li>'; }).join('') + '</ol>';
      });
    }
    var tabs = MF.TOUTES_SITUATIONS.map(function (x, i) { return '<i class="' + (i === idx ? 'ici' : '') + '" style="--c:' + x.couleur + '"></i>'; }).join('');
    return '<article class="a4" style="--c-sit:' + s.couleur + '">' +
      '<header class="a4-tete" style="--c:' + s.couleur + ';--ink:' + s.ink + '"><div class="haut"><span class="sit">' + U.esc(s.nom) + '</span><span class="num">n° ' + num + '</span></div>' +
      '<h1>' + U.esc(r.titre) + '</h1>' +
      '<p class="meta"><span><b>Pour</b> ' + P + (r.type === 'sucré' ? ' parts' : ' personnes') + '</span><span><b>Préparation</b> ' + r.prep + ' min</span><span><b>Cuisson</b> ' + U.duree(r.cuisson) + '</span><span><b>Budget</b> ' + U.euro(r.budget) + ' / pers.</span></p>' +
      (tags.length ? '<p class="tags">' + tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</p>' : '') + '</header>' +
      '<div class="a4-photo"><span class="ruban" aria-hidden="true"></span>' + U.cadrePhoto(r, s) + '</div>' +
      '<div class="a4-tabs" aria-hidden="true">' + tabs + '</div>' +
      '<div class="a4-corps"><div><div class="a4-ing"><h2>Ingrédients</h2>' + ing + '</div>' + (r.note ? '<p class="note a4-note">' + U.esc(r.note) + '</p>' : '') + '</div>' +
      '<div class="a4-et"><h2>Étapes</h2>' + et + '</div></div>' +
      (r.sansViande || r.notesPdf ? '<div class="a4-bas">' + (r.sansViande ? '<p class="a4-sv"><b>Sans viande</b> ' + U.esc(r.sansViande.soeur ? 'voir la fiche n° ' + (MF.recette(r.sansViande.soeur) || {}).num + ', ' + r.sansViande.titre + '.' : r.sansViande.texte) + '</p>' : '') + (r.notesPdf ? '<p class="a4-np"><b>Bon à savoir</b> ' + U.esc(r.notesPdf) + '</p>' : '') + '</div>' : '') + '<div class="a4-notes" aria-hidden="true"><h2>nos notes</h2>' + new Array(14).join('<i></i>') + '</div>' + '<footer class="a4-pied">' + U.logoSVG(false) + '<p class="sign"><b>' + U.esc(s.nom) + '</b>une collection Studio Mille Pages · millefeuilles.fr</p></footer>' +
      '</article>';
  }
  box.innerHTML = ids.map(function (id) { return MF.recette(id); }).filter(Boolean).map(fiche).join('');
  U.maj(box);
  document.querySelectorAll('.a4-pied svg .tab').forEach(function (t) { t.style.animation = 'none'; });
  if (window.innerWidth < 820) box.style.setProperty('--z', ((window.innerWidth - 16) / 794).toFixed(3));
});
