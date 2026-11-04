/* Mille Feuilles · scripts communs à toutes les pages.
   1. remplace l'image du logo par le SVG en ligne pour l'animer ;
   2. fait « s'écrire » les notes manuscrites quand elles entrent à l'écran ;
   3. outils partagés : format des quantités, cadre photo, euros. */
(function () {
  document.documentElement.classList.add('js');
  var PATHS = '<path class="cls-4 tab" style="--d:0s" d="M141.61,39.46v45.09h-9.54v-49.03h5.6c2.18,0,3.94,1.76,3.94,3.94Z"></path><path class="cls-2 tab" style="--d:0.08s" d="M155.92,39.46v46.37h-9.54v-50.31h5.6c2.18,0,3.94,1.76,3.94,3.94Z"></path><path class="cls-1" d="M186.2,66.44v2.25h-16.96c.17,2.04,1.26,3.64,3.56,3.64,1.65,0,2.69-.65,3.08-1.69h9.97c-1.26,4.94-6.16,8.67-13.18,8.67-8.2,0-13.44-5.16-13.44-12.88s5.07-13.14,13.44-13.14,13.53,5.29,13.53,13.14ZM176.18,63.41c-.3-1.99-1.69-3.12-3.47-3.12s-3.17,1.13-3.47,3.12h6.94Z"></path><path class="cls-1" d="M84.5,101.34v2.25h-16.96c.17,2.04,1.26,3.64,3.56,3.64,1.65,0,2.69-.65,3.08-1.69h9.98c-1.26,4.94-6.16,8.67-13.19,8.67-8.2,0-13.44-5.16-13.44-12.88s5.07-13.14,13.44-13.14,13.53,5.29,13.53,13.14ZM74.48,98.3c-.3-1.99-1.69-3.12-3.47-3.12s-3.17,1.13-3.47,3.12h6.94Z"></path><path class="cls-1" d="M97.72,88.63v12.53c0,2.47,1.08,3.95,2.91,3.95s2.91-1.47,2.91-3.95v-12.53h9.54v25.15h-9.54v-1.91c-1.39,1.56-3.64,2.6-6.29,2.6-5.68,0-9.06-4.12-9.06-11.49v-14.35h9.54Z"></path><path class="cls-3 tab" style="--d:0.16s" d="M141.61,79.52v34.27h-9.54v-38.54h5.6c2.18,0,3.94,1.91,3.94,4.27Z"></path><path class="cls-5 tab" style="--d:0.24s" d="M155.92,79.52v34.27h-9.54v-38.54h5.6c2.18,0,3.94,1.91,3.94,4.27Z"></path><path class="cls-1" d="M185.93,101.34v2.25h-16.96c.17,2.04,1.26,3.64,3.56,3.64,1.65,0,2.69-.65,3.08-1.69h9.97c-1.26,4.94-6.16,8.67-13.18,8.67-8.2,0-13.44-5.16-13.44-12.88s5.07-13.14,13.44-13.14,13.53,5.29,13.53,13.14ZM175.91,98.3c-.3-1.99-1.69-3.12-3.47-3.12s-3.17,1.13-3.47,3.12h6.94Z"></path><path class="cls-1" d="M212.73,96.87h-9.11c0-1.3-1.17-2.13-3.04-2.13-1.65,0-2.73.43-2.73,1.26,0,.65.52,1.08,3.04,1.39l3.08.39c7.85,1,9.19,3.9,9.19,7.94,0,5.12-3.99,8.5-12.36,8.5s-12.49-3.47-12.49-9.02h9.11c0,1.43,1.22,2.47,3.6,2.47,1.95,0,3.04-.43,3.04-1.34,0-.69-.3-1.17-3.25-1.52l-2.91-.35c-7.29-.91-9.15-3.9-9.15-7.59,0-4.94,4.16-8.67,11.97-8.67s12.01,3.69,12.01,8.67Z"></path><path class="cls-1" d="M83.07,52.97v1.82c1.34-1.56,3.38-2.52,5.9-2.52,2.95,0,5.25,1.04,6.85,3.08,1.78-1.91,4.25-3.08,7.29-3.08,6.2,0,9.98,4.55,9.98,11.49v14.36h-9.54v-12.71c0-2.91-1-4.38-2.73-4.38s-2.73,1.47-2.73,4.38v12.71h-9.54v-12.71c0-2.91-1-4.38-2.73-4.38s-2.73,1.47-2.73,4.38v12.71h-9.54v-25.15h9.54Z"></path><path class="cls-1" d="M56.35,78.12v6.77h-3.73c-1.3,0-1.91.65-1.91,1.95v1.69h5.2v8.02h-5.2v17.13h-9.54v-17.13h-4.34v-8.02h4.34v-1.61c0-5.29,2.99-8.8,8.93-8.8h6.25Z"></path><path class="cls-1" d="M128.22,40.94c0,2.95-1.99,5.42-5.38,5.42s-5.38-2.47-5.38-5.42,1.99-5.42,5.38-5.42,5.38,2.43,5.38,5.42Z"></path><path class="cls-1" d="M127.66,48.18v65.6h-9.54V48.18c1.17.95,2.6,1.47,4.77,1.47s3.6-.52,4.77-1.47Z"></path>';
  var COUL = { '1': 'var(--encre)', '2': '#F4CC71', '3': '#9CCBEF', '4': '#FF8FC2', '5': '#62B47E' };
  function logoSVG(lait) {
    var p = PATHS.replace(/class="cls-(\d)( tab)?"/g, function (m, k, t) { return (t ? 'class="tab" ' : '') + 'fill="' + (k === '1' ? (lait ? '#F8F5F4' : '#534741') : COUL[k]) + '"'; });
    return '<svg viewBox="34 30 184 90" role="img" aria-label="mille feuilles">' + p + '</svg>';
  }
  function logos(root) {
    (root || document).querySelectorAll('img[data-logo]').forEach(function (img) {
      var span = document.createElement('span');
      span.innerHTML = logoSVG(img.getAttribute('data-logo') === 'lait');
      var svg = span.firstChild; svg.setAttribute('class', img.getAttribute('class') || '');
      svg.style.cssText = img.style.cssText;
      img.replaceWith(svg);
    });
  }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); } });
  }, { threshold: 0.2 }) : null;
  function notes(root) {
    (root || document).querySelectorAll('.note:not([data-ecrit])').forEach(function (n) {
      if (!io) return; n.setAttribute('data-ecrit', ''); io.observe(n);
    });
  }
  function photos(root) {
    (root || document).querySelectorAll('.photo img').forEach(function (img) {
      var box = img.parentNode;
      if (img.complete && img.naturalWidth) box.classList.add('a-img');
      img.addEventListener('load', function () { box.classList.add('a-img'); });
      img.addEventListener('error', function () { img.remove(); });
    });
  }
  var FR = function (x) { var w = Math.floor(x), r = x - w, f = r >= .7 ? '¾' : r >= .45 ? '½' : r >= .2 ? '¼' : ''; if (!w) return f || '¼'; return w + (f ? '\u00a0' + f : ''); };
  var voy = /^[aeiouyéèêœh]/i;
  function plur(n, q) {
    if (q <= 1) return n; var stop = false;
    return n.split(' ').map(function (w) {
      if (stop || /^(de|du|à|aux|en|au)$/.test(w) || w.indexOf('\u2019') > -1) { stop = true; return w; }
      if (/[sxz]$/.test(w)) return w; if (/eau$/.test(w)) return w + 'x'; return w + 's';
    }).join(' ');
  }
  function quantite(it, mult) {
    if (it.q == null) return { q: '', n: it.n };
    var q = it.q * mult, de = voy.test(it.n) ? 'd\u2019' : 'de ';
    if (it.u === 'g' || it.u === 'ml') { var r = q < 50 ? Math.round(q / 5) * 5 : Math.round(q / 10) * 10; if (r >= 1000 && it.u === 'g') return { q: (r / 1000).toString().replace('.', ',') + '\u00a0kg', n: de + it.n }; return { q: (r || 5) + '\u00a0' + it.u, n: de + it.n }; }
    if (it.u) { var u = Math.round(q * 2) / 2 || .5; return { q: FR(u) + '\u00a0' + (u > 1 && !/^(càs|càc|cm)$/.test(it.u) && !/[sx]$/.test(it.u) ? (/(eau|al)$/.test(it.u) ? it.u.replace(/al$/, 'au') + 'x' : it.u + 's') : it.u), n: de + it.n }; }
    var k = Math.ceil(q * 2) / 2; return { q: FR(k), n: plur(it.n, k) };
  }
  function euro(v) { return v.toFixed(2).replace('.', ',') + '\u00a0€'; }
  function duree(m) { if (!m) return 'aucune'; if (m < 60) return m + ' min'; return Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) : ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function cadrePhoto(r, sit, extra) {
    return '<div class="photo ' + (extra || '') + '" style="--c:' + sit.couleur + ';--ink:' + sit.ink + '">' +
      '<img src="' + r.photo + '" alt="' + esc(r.titre) + '" loading="lazy" onload="this.parentNode.classList.add(\'a-img\')" onerror="this.remove()">' +
      '<div class="attente" aria-hidden="true"><b>' + esc(r.titre) + '</b><span>' + esc(sit.nom) + '</span></div></div>';
  }
  function maj(root) { logos(root); notes(root); photos(root); }
  window.MFU = { logoSVG: logoSVG, maj: maj, quantite: quantite, euro: euro, duree: duree, esc: esc, cadrePhoto: cadrePhoto };
  if (document.readyState !== 'loading') maj(); else document.addEventListener('DOMContentLoaded', function () { maj(); });
})();
