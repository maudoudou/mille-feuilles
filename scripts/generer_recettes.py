#!/usr/bin/env python3
"""Mille Feuilles : génère tout ce qui dépend de data/recettes.json.

Lancement, depuis n'importe où :  python3 scripts/generer_recettes.py
(L'action GitHub .github/workflows/generer-recettes.yml le fait toute seule.)

Produit :
  - recettes/<slug>/index.html : une page par recette gratuite (gratuit: "oui") ;
  - recettes/index.html        : renvoi vers recettes.html ;
  - la liste gratuite de recettes.html et « Ce soir, par exemple. » de index.html,
    entre les commentaires GENERE ;
  - sitemap.xml.
Une recette repassée en membre, ou supprimée, perd sa page au lancement suivant.

Champ facultatif à ajouter à une recette : "intro": "Votre texte." remplace
l'introduction écrite automatiquement. Aucune dépendance à installer.
"""
import hashlib
import json
import math
import re
import shutil
import sys
from html import escape
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
SITE = 'https://millefeuilles.studiomillepages.fr'
NB_EXEMPLES = 3
NB_LIENS = 3
PAGES_FIXES = ['', 'recettes.html', 'tarifs.html', 'classeur.html', 'feuille-du-jeudi.html']
AP = '’'
NB = ' '


# ---------- quantités : même calcul que js/commun.js ----------
def arrondi(x):
    return math.floor(x + .5)


def nombre(x):
    return str(int(x)) if float(x).is_integer() else str(x)


def fr(x):
    w = math.floor(x)
    r = x - w
    f = '¾' if r >= .7 else '½' if r >= .45 else '¼' if r >= .2 else ''
    if not w:
        return f or '¼'
    return str(w) + (NB + f if f else '')


def plur(n, q):
    if q <= 1:
        return n
    stop, out = False, []
    for w in n.split(' '):
        if stop or w in ('de', 'du', 'à', 'aux', 'en', 'au') or AP in w:
            stop = True
            out.append(w)
        elif re.search(r'[sxz]$', w):
            out.append(w)
        elif w.endswith('eau'):
            out.append(w + 'x')
        else:
            out.append(w + 's')
    return ' '.join(out)


def unite_plur(u, v):
    if v <= 1 or u in ('càs', 'càc', 'cm') or re.search(r'[sx]$', u):
        return u
    if re.search(r'(eau|al)$', u):
        return re.sub(r'al$', 'au', u) + 'x'
    return u + 's'


def quantite(it, pb, mult):
    """Renvoie (quantité, nom) pour mult personnes ; it porte les quantités pour pb personnes."""
    if it.get('quantite') is None:
        return '', it['texte']
    u, n = it.get('unite') or '', it['nom']
    q = it['quantite'] / pb * mult
    de = f'd{AP}' if re.match(r'[aeiouyéèêœh]', n, re.I) else 'de '
    if u in ('g', 'ml'):
        r = arrondi(q / 5) * 5 if q < 50 else arrondi(q / 10) * 10
        if r >= 1000 and u == 'g':
            return nombre(r / 1000).replace('.', ',') + NB + 'kg', de + n
        return f'{r or 5}{NB}{u}', de + n
    if u:
        v = arrondi(q * 2) / 2 or .5
        return fr(v) + NB + unite_plur(u, v), de + n
    k = math.ceil(q * 2) / 2
    return fr(k), plur(n, k)


def duree(m):
    m = int(m)
    if not m:
        return 'aucune'
    if m < 60:
        return f'{m} min'
    return f'{m // 60} h' + (f' {m % 60}' if m % 60 else '')


def euro(v):
    return f'{v:.2f}'.replace('.', ',') + NB + '€'


def e(s):
    return escape(str(s), quote=True)


# ---------- données ----------
def charger():
    try:
        doc = json.loads((RACINE / 'data/recettes.json').read_text(encoding='utf-8'))
    except json.JSONDecodeError as err:
        sys.exit(f'data/recettes.json, ligne {err.lineno} : {err.msg}. Rien n{AP}a été généré.')
    cles = {}
    for s in doc['situations']:
        cles[s['key']] = dict(s, ink='#F8F5F4' if s['key'] == 'budget' else '#534741')
    vus = set()
    for r in doc['recettes']:
        if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', r['slug']):
            sys.exit(f'Slug invalide pour une adresse web : {r["slug"]}')
        if r['slug'] in vus:
            sys.exit(f'Slug en double : {r["slug"]}')
        vus.add(r['slug'])
        if r['situation'] not in cles:
            sys.exit(f'Situation inconnue pour {r["slug"]} : {r["situation"]}')
    return cles, doc['recettes'] + lire_apercus({r['slug'] for r in doc['recettes']})


def lire_apercus(gratuits):
    """Recettes membres réduites à leur titre et leurs filtres : ni ingrédients ni étapes.

    Sur cet ordinateur, recettes-membres.json met à jour data/membres-apercu.json.
    Sur GitHub, où ce fichier n'existe pas, l'aperçu déjà enregistré est utilisé.
    """
    source, cible = RACINE / 'recettes-membres.json', RACINE / 'data/membres-apercu.json'
    if source.is_file():
        champs = ('id', 'slug', 'titre', 'type', 'situation', 'regime', 'contient_porc', 'temps_minutes', 'budget_portion', 'allergenes', 'image')
        membres = json.loads(source.read_text(encoding='utf-8'))['recettes']
        lignes = [{c: r[c] for c in champs} for r in membres]
        cible.write_text(json.dumps({'recettes': lignes}, ensure_ascii=False, indent=0) + '\n', encoding='utf-8')
    apercus = json.loads(cible.read_text(encoding='utf-8'))['recettes'] if cible.is_file() else []
    return [dict(r, gratuit='non') for r in apercus if r['slug'] not in gratuits]


def a_photo(r):
    return (RACINE / 'images/recettes' / r['image']).is_file()


def libre(r):
    return r.get('gratuit') == 'oui'


def pb(r):
    return r.get('personnes_base') or 4


def sucre(r):
    return r.get('type') == 'sucré'


def portions(r):
    n = pb(r)
    if sucre(r):
        return f'{n} part' + ('s' if n > 1 else '')
    return f'{n} personne' + ('s' if n > 1 else '')


def prep(r):
    return r.get('preparation_minutes') or r['temps_minutes']


def groupes(r):
    """Ingrédients regroupés comme dans l'outil : [(titre de groupe, [(quantité, nom)])]."""
    out = []
    for it in r['ingredients']:
        titre = it.get('groupe') or ''
        if not out or out[-1][0] != titre:
            out.append((titre, []))
        out[-1][1].append(quantite(it, pb(r), pb(r)))
    return out


def note_courte(r):
    """Même règle que js/donnees.js : la note manuscrite, si elle est courte."""
    n = r.get('notes')
    if not n:
        return ''
    c = re.split(r'\s*;\s*', n)[0]
    c = c[:-1] if c.endswith('.') else c
    return c[0].lower() + c[1:] if len(c) <= 48 else ''


# ---------- morceaux de page ----------
def cadre_photo(r, s, racine, extra=''):
    style = f'--c:{s["couleur"]};--ink:{s["ink"]}'
    if a_photo(r):
        return (f'<div class="photo a-img {extra}" style="{style}"><img '
                f'src="{racine}images/recettes/{r["image"]}" alt="{e(r["titre"])}" loading="lazy"></div>')
    return (f'<div class="photo {extra}" style="{style}"><div class="attente" aria-hidden="true">'
            f'<b>{e(r["titre"])}</b><span>{e(s["nom"])}</span></div></div>')


def lien(r, racine):
    return f'{racine}recettes/{r["slug"]}/' if libre(r) else f'{racine}recettes.html#fiche/{r["slug"]}'


def carte(r, cles, racine, i, note=False):
    s = cles[r['situation']]
    pastille = '' if libre(r) else '<span class="pastille">Recette membre</span>'
    txt = note_courte(r) if note else ''
    txt_note = f'<span class="note">{e(txt)}</span>' if txt else ''
    return (f'<li class="carte" style="--c:{s["couleur"]}"><a href="{lien(r, racine)}" style="--i:{i}">{cadre_photo(r, s, racine)}'
            f'<div class="corps"><span class="sit">{e(s["nom"])}</span><h3>{e(r["titre"])}</h3>'
            f'<span class="meta"><span>{r["temps_minutes"]} min</span><span>{euro(r["budget_portion"])} / pers.</span></span>'
            f'{pastille}{txt_note}</div></a></li>')


def principaux(r):
    noms = [it['nom'] for it in r['ingredients'] if it.get('quantite') is not None][:3]
    if len(noms) < 2:
        return noms[0] if noms else ''
    return ', '.join(noms[:-1]) + ' et ' + noms[-1]


def intro(r, s):
    if r.get('intro'):
        return r['intro']
    regime = {'végan': 'Une recette végane', 'végétarien': 'Une recette végétarienne'}.get(r['regime'], 'Une recette')
    cuisson = f', plus {duree(r["cuisson_minutes"])} de cuisson' if r.get('cuisson_minutes') else ''
    avec = principaux(r)
    avec = f' Au programme : {avec}.' if avec else ''
    return (f'{regime} de l{AP}intercalaire «{NB}{s["nom"]}{NB}», pour {portions(r)} : '
            f'{duree(prep(r))} de préparation{cuisson}.{avec}')


def description(r, s):
    avec = principaux(r)
    avec = f' avec {avec}' if avec else ''
    debut = f'{r["titre"]} pour {portions(r)}, en {duree(r["temps_minutes"])}.'
    for fin in (f' Recette «{NB}{s["nom"]}{NB}»{avec} : ingrédients et étapes.',
                f' Recette «{NB}{s["nom"]}{NB}» : ingrédients et étapes.', ' Ingrédients et étapes.'):
        if len(debut + fin) <= 160:
            return debut + fin
    return debut


def voisines(r, recettes):
    """3 recettes de la même situation : les gratuites d'abord, puis les recettes membres."""
    meme = sorted((x for x in recettes if x['situation'] == r['situation']), key=lambda x: x['id'])
    k = meme.index(r)
    tour = meme[k + 1:] + meme[:k]
    return ([x for x in tour if libre(x)] + [x for x in tour if not libre(x)])[:NB_LIENS]


def json_ld(r, s, url):
    d = {
        '@context': 'https://schema.org', '@type': 'Recipe', 'name': r['titre'], 'url': url,
        'description': description(r, s).replace(NB, ' '), 'inLanguage': 'fr',
        'author': {'@type': 'Person', 'name': 'Maud Lenoir'},
        'publisher': {'@type': 'Organization', 'name': 'Studio Mille Pages', 'url': 'https://studiomillepages.fr'},
        'recipeCategory': s['nom'], 'recipeYield': portions(r),
        'prepTime': f'PT{prep(r)}M', 'totalTime': f'PT{r["temps_minutes"]}M',
        'recipeIngredient': [f'{q} {n}'.strip().replace(NB, ' ') for _, lignes in groupes(r) for q, n in lignes],
        'recipeInstructions': [{'@type': 'HowToStep', 'text': t} for t in r['etapes']],
    }
    if r.get('cuisson_minutes'):
        d['cookTime'] = f'PT{r["cuisson_minutes"]}M'
    if a_photo(r):
        d['image'] = f'{SITE}/images/recettes/{r["image"]}'
    regime = {'végan': 'VeganDiet', 'végétarien': 'VegetarianDiet'}.get(r['regime'])
    if regime:
        d['suitableForDiet'] = 'https://schema.org/' + regime
    return json.dumps(d, ensure_ascii=False, indent=1).replace('</', '<\\/')


PIED = ('<footer class="pied">\n  <div class="wrap pied-grille">\n    <div class="stack">\n'
        '      <a class="logo" href="{0}index.html" aria-label="mille feuilles, accueil"><img data-logo="lait" src="{0}assets/logo-lait.svg" alt="mille feuilles" height="64"></a>\n'
        '      <p style="max-width:40ch">Une collection de Studio Mille Pages, le studio de mise en page de Maud Lenoir, à Rouen. Chaque recette a été cuisinée chez nous.</p>\n'
        '      <a href="https://studiomillepages.fr" style="font-weight:700">Voir le studio →</a>\n    </div>\n'
        '    <nav aria-label="Pied de page">\n'
        '      <a href="{0}recettes.html">Recettes</a><a href="{0}tarifs.html">Tarifs</a><a href="{0}classeur.html">Le classeur</a><a href="{0}feuille-du-jeudi.html">La feuille du jeudi</a><a href="mailto:bonjour@studiomillepages.fr">Contact</a>\n'
        '    </nav>\n  </div>\n</footer>')


def page_recette(r, cles, recettes):
    s = cles[r['situation']]
    url = f'{SITE}/recettes/{r["slug"]}/'
    racine = '../../'
    ing = []
    for titre, lignes in groupes(r):
        h = f'<h3 style="--c:{s["couleur"]};color:{s["ink"]}">{e(titre)}</h3>' if titre else ''
        items = ''.join(f'<li><b>{q}</b> {e(n)}</li>' if q else f'<li>{e(n)}</li>' for q, n in lignes)
        ing.append(f'<div class="ing-groupe">{h}<ul>{items}</ul></div>')
    et = ''.join(f'<li><span class="n" style="--c:{s["couleur"]};color:{s["ink"]}" aria-hidden="true">{i}</span><span>{e(t)}</span></li>'
                 for i, t in enumerate(r['etapes'], 1))
    liens = ''.join(carte(x, cles, racine, i) for i, x in enumerate(voisines(r, recettes)))
    courte = note_courte(r)
    note = f'<p style="margin-top:22px"><span class="note">{e(courte)}</span></p>' if courte else ''
    sans = ''
    sv = r.get('version_sans_viande')
    if sv:
        soeur = next((x for x in recettes if x['id'] == sv.get('recette_id')), None) if sv.get('type') == 'recette_soeur' else None
        corps = (f'<p>Même base, sans viande&nbsp;: <a href="{lien(soeur, racine)}" style="font-weight:700">{e(sv["titre"])} →</a></p>'
                 if soeur else f'<p style="font-weight:700">{e(sv["texte"])}</p>')
        sans = (f'<div class="encart sans-viande" style="--c:#9599EA"><p style="font-weight:800;font-size:24px;line-height:1.15">'
                f'L{AP}assiette sans viande</p>{corps}</div>')
    savoir = (f'<p style="margin-top:22px;max-width:60ch"><b>Bon à savoir.</b> {e(r["notes"])}</p>' if r.get('notes') else '')
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(r["titre"])} · Recette Mille Feuilles</title>
<meta name="description" content="{e(description(r, s))}">
<link rel="canonical" href="{url}">
<link rel="icon" href="{racine}assets/monogramme.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kalam&amp;display=swap">
<link rel="stylesheet" href="{racine}css/mille-feuilles.css">
<script src="{racine}js/commun.js" defer></script>
<script type="application/ld+json">
{json_ld(r, s, url)}
</script>
</head>
<body>
<header class="wrap entete">
  <a class="lien" href="{racine}recettes.html">Recettes</a>
  <a class="logo" href="{racine}index.html" aria-label="mille feuilles, accueil"><img data-logo src="{racine}assets/logo.svg" alt="mille feuilles" height="60"></a>
  <a class="lien" href="{racine}tarifs.html">Tarifs</a>
</header>
<main>
<article class="wrap ecran">
  <a href="{racine}recettes.html" style="font-weight:700;text-decoration:none">← Toutes les recettes</a>
  <div class="fiche-tete" style="--c:{s["couleur"]};--ink:{s["ink"]}">
    <div class="fiche-titre">
      <p class="onglet-fiche">{e(s["nom"])}</p>
      <h1>{e(r["titre"])}</h1>
      <p class="fiche-meta"><span><b>Pour</b> {portions(r)}</span><span><b>Préparation</b> {prep(r)} min</span><span><b>Cuisson</b> {duree(r.get("cuisson_minutes") or 0)}</span><span><b>Total</b> {duree(r["temps_minutes"])}</span><span><b>Budget</b> {euro(r["budget_portion"])} / pers.</span></p>
    </div>
    {cadre_photo(r, s, racine, "fiche-photo")}
  </div>
  <p class="chapo" style="margin-top:22px;max-width:46ch">{e(intro(r, s))}</p>
  {note}
  <div class="fiche-corps">
    <div class="ing"><h2>Ingrédients</h2>{"".join(ing)}</div>
    <div class="et"><h2>Étapes</h2><div class="et-groupe"><ol>{et}</ol></div></div>
  </div>
  {sans}
  {savoir}
  <div class="row fiche-actions">
    <a class="btn" href="{racine}recettes.html#fiche/{r["slug"]}">Ajuster les quantités <span class="fl" aria-hidden="true">→</span></a>
    <a href="{racine}fiche.html?id={r["slug"]}" style="font-weight:700">Imprimer la fiche en A4</a>
  </div>
</article>
<section class="wrap" style="padding-bottom:clamp(48px,7vw,88px)">
  <h2 class="t-l">Dans le même intercalaire.</h2>
  <ul class="cartes" style="margin-top:20px">{liens}</ul>
</section>
</main>
{PIED.format(racine)}
</body>
</html>
'''


REDIRECTION = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Recettes · Mille Feuilles</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="{SITE}/recettes.html">
<meta http-equiv="refresh" content="0; url=../recettes.html">
</head>
<body><p><a href="../recettes.html">Voir les recettes</a></p></body>
</html>
'''


def remplacer_bloc(fichier, nom, contenu):
    chemin = RACINE / fichier
    html = chemin.read_text(encoding='utf-8')
    motif = re.compile(rf'(<!-- GENERE:{nom}:debut[^>]*-->).*?(<!-- GENERE:{nom}:fin -->)', re.S)
    if not motif.search(html):
        sys.exit(f'{fichier} : repères GENERE:{nom} introuvables.')
    chemin.write_text(motif.sub(lambda m: f'{m.group(1)}\n{contenu}\n{m.group(2)}', html), encoding='utf-8')


def exemples(gratuites):
    """Tirage au hasard, stable tant que la liste des gratuites ne change pas : pas de faux changement à chaque lancement."""
    graine = ','.join(r['slug'] for r in gratuites)
    cle = lambda r: hashlib.sha256(f'{graine}|{r["slug"]}'.encode()).hexdigest()
    return sorted(gratuites, key=cle)[:NB_EXEMPLES]


def main():
    cles, recettes = charger()
    gratuites = [r for r in recettes if libre(r)]
    if len(gratuites) < NB_EXEMPLES:
        sys.exit('Il faut au moins 3 recettes gratuites.')

    dossier = RACINE / 'recettes'
    dossier.mkdir(exist_ok=True)
    ids = {r['slug'] for r in gratuites}
    for d in dossier.iterdir():
        if d.is_dir() and d.name not in ids:
            shutil.rmtree(d)
    for r in gratuites:
        cible = dossier / r['slug']
        cible.mkdir(exist_ok=True)
        (cible / 'index.html').write_text(page_recette(r, cles, recettes), encoding='utf-8')
    (dossier / 'index.html').write_text(REDIRECTION, encoding='utf-8')

    remplacer_bloc('recettes.html', 'liste',
                   ''.join(carte(r, cles, '', min(i, 10)) for i, r in enumerate(gratuites)))
    remplacer_bloc('index.html', 'exemples',
                   ''.join(carte(r, cles, '', i, note=i % 2 == 0) for i, r in enumerate(exemples(gratuites))))

    urls = [f'{SITE}/{p}' for p in PAGES_FIXES] + [f'{SITE}/recettes/{r["slug"]}/' for r in gratuites]
    lignes = ''.join(f'  <url><loc>{u}</loc></url>\n' for u in urls)
    (RACINE / 'sitemap.xml').write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{lignes}</urlset>\n',
        encoding='utf-8')
    print(f'{len(gratuites)} pages recettes, {len(urls)} adresses dans sitemap.xml.')


if __name__ == '__main__':
    main()
