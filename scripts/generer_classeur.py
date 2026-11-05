#!/usr/bin/env python3
"""Mille Feuilles : génère le classeur PDF à partir de data/recettes.json et recettes-membres.json.

Une seule commande :  python3 scripts/generer_classeur.py
Essai rapide       :  python3 scripts/generer_classeur.py --test 5   (5 recettes par intercalaire)

Résultat dans sortie-classeur/ (ignoré par Git) : le PDF et rapport.txt.
Fichiers facultatifs, à la racine du projet :
  - couverture.pdf : remplace la couverture provisoire ;
  - intercalaires/<cle>.pdf : remplace la page de séparation, avec <cle> parmi
    chrono, frigo, base, manches, recoit, reconfort, budget.
Le premier lancement installe Playwright, Chromium et Paged.js dans .venv-classeur/.
"""
import argparse
import datetime
import hashlib
import http.server
import json
import os
import re
import subprocess
import sys
import threading
import unicodedata
import urllib.request
from functools import partial
from html import escape
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
VENV = RACINE / '.venv-classeur'
PAGED = VENV / 'paged.polyfill.js'
SORTIE = RACINE / 'sortie-classeur'
NOM_PDF = 'Mille-Feuilles-classeur.pdf'
PAGED_URL = 'https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js'
CHAMPS = ['titre', 'temps_minutes', 'personnes_base', 'budget_portion', 'ingredients', 'etapes', 'situation']
RAYONS = ['Légumes', 'Fruits', 'Boucherie, poisson', 'Crèmerie, œufs', 'Épicerie', 'Surgelés']
JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
MOIS = 'janvier février mars avril mai juin juillet août septembre octobre novembre décembre'.split()


def installer():
    """Relance le script dans son environnement dédié, créé au besoin."""
    py = VENV / 'bin/python'
    if Path(sys.prefix).resolve() != VENV.resolve():
        if not py.exists():
            print('Premier lancement : installation (quelques minutes)…')
            subprocess.run([sys.executable, '-m', 'venv', str(VENV)], check=True)
            subprocess.run([str(py), '-m', 'pip', 'install', '-q', 'playwright==1.48.0', 'pypdf==5.1.0'], check=True)
            subprocess.run([str(py), '-m', 'playwright', 'install', 'chromium'], check=True)
        os.execv(str(py), [str(py), __file__] + sys.argv[1:])
    if not PAGED.exists():
        urllib.request.urlretrieve(PAGED_URL, PAGED)


# ---------- données ----------
def cle_tri(texte):
    t = texte.lower().replace('œ', 'oe').replace('æ', 'ae')
    t = unicodedata.normalize('NFKD', t)
    t = ''.join(c for c in t if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9 ]+', ' ', t).strip()


def nfc(o):
    if isinstance(o, str):
        return unicodedata.normalize('NFC', o)
    if isinstance(o, list):
        return [nfc(x) for x in o]
    if isinstance(o, dict):
        return {k: nfc(v) for k, v in o.items()}
    return o


def charger(test=0):
    gratuit = json.loads((RACINE / 'data/recettes.json').read_bytes())
    chemin = RACINE / 'recettes-membres.json'
    if not chemin.is_file():
        sys.exit('recettes-membres.json est introuvable : le classeur serait incomplet. Arrêt.')
    membres = json.loads(chemin.read_bytes())
    empreinte = hashlib.sha256((RACINE / 'data/recettes.json').read_bytes() + chemin.read_bytes()).hexdigest()[:8]
    toutes = nfc(gratuit['recettes'] + membres['recettes'])
    situations = nfc(gratuit['situations'])
    cles = {s['key'] for s in situations}
    retenues, ignorees = [], []
    vus = set()
    for r in toutes:
        manque = [c for c in CHAMPS if r.get(c) in (None, '', [])]
        if manque:
            ignorees.append((r.get('slug', '?'), 'champ manquant : ' + ', '.join(manque)))
        elif r['situation'] not in cles:
            ignorees.append((r['slug'], 'situation inconnue : ' + str(r['situation'])))
        elif r['slug'] in vus:
            ignorees.append((r['slug'], 'recette en double'))
        else:
            vus.add(r['slug'])
            retenues.append(r)
    groupes = {s['key']: sorted((r for r in retenues if r['situation'] == s['key']), key=lambda r: cle_tri(r['titre']))
               for s in situations}
    if test:
        groupes = {k: v[:test] for k, v in groupes.items()}
    return situations, groupes, ignorees, gratuit.get('version', '?'), empreinte, toutes


# ---------- index par ingrédient principal ----------
CANON = [
    ('lentilles', 'Lentilles'), ('pois chiche', 'Pois chiches'), ('haricots rouges', 'Haricots rouges'), ('haricots blancs', 'Haricots blancs'),
    ('haricots verts', 'Haricots verts'), ('haricot', 'Haricots'), ('poulet', 'Poulet'), ('volaille', 'Volaille'), ('dinde', 'Dinde'), ('canard', 'Canard'),
    ('boeuf', 'Bœuf'), ('bœuf', 'Bœuf'), ('veau', 'Veau'), ('agneau', 'Agneau'), ('lapin', 'Lapin'), ('porc', 'Porc'), ('jambon', 'Jambon'),
    ('lardon', 'Lardons'), ('saucisse', 'Saucisses'), ('merguez', 'Saucisses'), ('viande', 'Viande hachée'), ('saumon', 'Saumon'), ('thon', 'Thon'),
    ('cabillaud', 'Cabillaud'), ('crevette', 'Crevettes'), ('poisson', 'Poisson'), ('maquereau', 'Maquereau'), ('sardine', 'Sardines'),
    ('tofu', 'Tofu'), ('tempeh', 'Tempeh'), ('seitan', 'Seitan'), ('oeuf', 'Œufs'), ('œuf', 'Œufs'), ('potimarron', 'Potimarron'), ('butternut', 'Butternut'),
    ('courge', 'Courge'), ('patate douce', 'Patate douce'), ('patates douces', 'Patate douce'), ('pomme de terre', 'Pommes de terre'), ('pommes de terre', 'Pommes de terre'),
    ('courgette', 'Courgette'), ('aubergine', 'Aubergine'), ('poivron', 'Poivron'), ('tomate', 'Tomate'), ('carotte', 'Carotte'), ('poireau', 'Poireau'),
    ('épinard', 'Épinards'), ('champignon', 'Champignons'), ('chou fleur', 'Chou-fleur'), ('brocoli', 'Brocoli'), ('chou', 'Chou'), ('endive', 'Endive'),
    ('betterave', 'Betterave'), ('concombre', 'Concombre'), ('avocat', 'Avocat'), ('quinoa', 'Quinoa'), ('riz', 'Riz'), ('semoule', 'Semoule'), ('polenta', 'Polenta'),
    ('avoine', 'Avoine'), ('sarrasin', 'Sarrasin'), ('spaghetti', 'Pâtes'), ('lasagne', 'Pâtes'), ('coquillette', 'Pâtes'), ('nouille', 'Nouilles'), ('pâtes', 'Pâtes'),
    ('pâte feuilletée', 'Pâte feuilletée'), ('pâte brisée', 'Pâte brisée'), ('pain', 'Pain'), ('tortilla', 'Tortillas'), ('wrap', 'Tortillas'),
    ('chocolat', 'Chocolat'), ('cacao', 'Chocolat'), ('pomme', 'Pomme'), ('poire', 'Poire'), ('banane', 'Banane'), ('citron', 'Citron'), ('fraise', 'Fraise'),
    ('framboise', 'Framboise'), ('myrtille', 'Myrtille'), ('abricot', 'Abricot'), ('pêche', 'Pêche'), ('coco', 'Coco'), ('noisette', 'Noisette'), ('amande', 'Amande'),
    ('skyr', 'Skyr'), ('yaourt', 'Yaourt'), ('fromage', 'Fromage'), ('chèvre', 'Fromage'), ('feta', 'Fromage'), ('mozzarella', 'Fromage'), ('ricotta', 'Fromage'),
]
CANON.sort(key=lambda x: -len(x[0]))
BASIQUES = re.compile(r"^(sel|poivre|eau|huile|beurre|sucre|farine|levure|oignon|échalote|ail|gousse|épices?|herbes?|persil|thym|laurier|bouillon|vinaigre|moutarde|miel|curry|paprika|cumin|cannelle|muscade|maïzena|fécule|lait|crème|sauce|gingembre|coriandre|basilic|vanille|sirop|bicarbonate)\b", re.I)


def ingredient_principal(r):
    """Le fichier n'a pas ce champ : premier ingrédient non basique, ramené à un nom commun. Déduction à relire."""
    def chercher(texte):
        trouves = []
        for mot, label in CANON:
            m = re.search(r'\b' + re.escape(mot), texte)
            if m:
                trouves.append((m.start(), -len(mot), label))
        return min(trouves)[2] if trouves else None
    label = chercher(r['titre'].lower().replace('-', ' '))
    if label:
        return label, True
    noms = [(i.get('nom') or i.get('texte') or '').strip() for i in r['ingredients']]
    candidats = [n for n in noms if n and not BASIQUES.match(n)] or noms
    label = chercher(candidats[0].lower().replace('-', ' ')) if candidats else None
    if label:
        return label, True
    brut = candidats[0] if candidats else 'Divers'
    return brut[:1].upper() + brut[1:], False


# ---------- HTML ----------
def e(s):
    return escape(str(s), quote=True)


def nb_pdf(chemin):
    from pypdf import PdfReader
    return len(PdfReader(str(chemin)).pages)


def pages_vides(classe, n, attr=''):
    return ''.join(f'<section class="vide {classe}"{attr if i == 0 else ""}><p class="repere">.</p></section>' for i in range(n))


def page_recette(r, s, par_id, G):
    a_groupes = G.groupes(r)
    ing = ''
    for titre, lignes in a_groupes:
        ing += f'<h3>{e(titre)}</h3>' if titre else ''
        ing += '<ul>' + ''.join(f'<li><b>{q}</b> {e(n)}</li>' if q else f'<li>{e(n)}</li>' for q, n in lignes) + '</ul>'
    et = ''.join(f'<li><span class="n">{i}</span><span>{e(t)}</span></li>' for i, t in enumerate(r['etapes'], 1))
    bas = ''
    sv = r.get('version_sans_viande')
    if sv:
        soeur = par_id.get(sv.get('recette_id')) if sv.get('type') == 'recette_soeur' else None
        if soeur:
            corps = f'<a href="#r-{soeur["slug"]}">{e(soeur["titre"])}</a>, page <span class="num" data-cible="r-{soeur["slug"]}">000</span>'
        else:
            corps = e(sv.get('texte') or sv.get('titre') or '')
        bas += f'<p class="sv"><b>Sans viande</b> {corps}</p>'
    if r.get('notes'):
        bas += f'<p class="savoir"><b>Bon à savoir</b> {e(r["notes"])}</p>'
    if r.get('allergenes') and 'allergenes' not in r.get('a_verifier', []):
        bas += f'<p class="allergenes"><b>Allergènes</b> {e(", ".join(r["allergenes"]))}</p>'
    cuisson = G.duree(r.get('cuisson_minutes') or 0)
    return (f'<section class="recette sit-{s["key"]}" id="r-{r["slug"]}" data-signet="{e(r["titre"])}" data-slug="{r["slug"]}">'
            f'<header><h2>{e(r["titre"])}</h2><p class="meta"><span><b>Pour</b> {G.portions(r)}</span><span><b>Préparation</b> {G.prep(r)} min</span>'
            f'<span><b>Cuisson</b> {cuisson}</span><span><b>Total</b> {G.duree(r["temps_minutes"])}</span><span><b>Budget</b> {G.euro(r["budget_portion"])} / pers.</span></p></header>'
            f'<div class="corps"><div class="ing"><h3 class="tt">Ingrédients</h3>{ing}</div><div class="et"><h3 class="tt">Étapes</h3><ol>{et}</ol></div></div>'
            f'{f"""<div class="bas">{bas}</div>""" if bas else ""}</section>')


def construire(situations, groupes, version, empreinte, date_txt, G):
    par_id = {r['id']: r for v in groupes.values() for r in v}
    h = []
    cover = RACINE / 'couverture.pdf'
    if cover.is_file():
        h.append(pages_vides('p-couverture', nb_pdf(cover), ' data-externe="couverture.pdf" data-signet-simple="Couverture"'))
    else:
        h.append('<section class="couverture-prov" data-signet-simple="Couverture"><img src="/assets/logo.svg" alt=""><h1>Le classeur</h1><p>Couverture provisoire : déposez couverture.pdf à la racine du projet.</p></section>')
    h.append(f'''<section class="texte" data-signet-simple="Mode d’emploi"><h1>Mode d’emploi</h1>
<h2>Les intercalaires</h2><p>Les recettes ne sont pas rangées par ingrédient, mais par situation. Chacun des sept intercalaires répond à un genre de soirée : ouvrez celui qui ressemble à la vôtre, et piochez. À l’intérieur, les recettes suivent l’ordre alphabétique. Le sommaire les liste toutes ; l’index, à la fin, permet de partir d’un ingrédient.</p>
<ul class="pastilles">{"".join(f'<li><i style="background:{s["couleur"]}"></i>{e(s["nom"])}</li>' for s in situations)}</ul>
<h2>Le planning et la liste de courses</h2><p>En fin de classeur, deux pages vierges à réimprimer autant que vous voulez. Le jeudi, notez un dîner par soir sur le planning, avec le numéro de page de chaque recette. Reportez ensuite les ingrédients sur la liste de courses, rangée par rayon, en séparant ce qu’il reste à la maison et ce qu’il faut acheter.</p>
<h2>Avec et sans viande</h2><p>Quand une recette a une version sans viande, un encadré « Sans viande » le signale au bas de sa page. Il indique soit le changement à faire, soit la page de la recette sœur. L’intercalaire « Une base, deux assiettes » est pensé pour les tables où l’on ne mange pas pareil.</p>
<h2>Les quantités</h2><p>Chaque fiche indique pour combien de personnes ou de parts elle est prévue. Les budgets par personne sont des estimations.</p></section>''')
    h.append(f'''<section class="texte mentions" data-signet-simple="Mentions"><h1>Mentions</h1>
<p>© Studio Mille Pages, nom commercial de Maud Lenoir EI. Tous droits réservés.</p>
<h2>Licence d’usage personnel</h2><p>Ce fichier est destiné à l’usage personnel de la personne qui l’a acquis. Vous pouvez l’imprimer et le conserver sur vos appareils pour votre propre usage. Sa revente et son partage, en tout ou partie, gratuits ou payants, ne sont pas autorisés.</p>
<h2>Version</h2><p>Version {e(version)} ({empreinte}), générée le {date_txt}.</p></section>''')
    h.append('<div class="flux" data-flux="sommaire" data-titre="Sommaire" data-signet-simple="Sommaire">')
    for s in situations:
        v = groupes[s['key']]
        h.append(f'<a class="ligne tete" href="#i-{s["key"]}" style="--c:{s["couleur"]};--k:{s.get("ink") or "#534741"}"><span>{e(s["nom"])}</span><span class="num" data-cible="i-{s["key"]}">000</span></a>')
        h += [f'<a class="ligne" href="#r-{r["slug"]}"><span>{e(r["titre"])}</span><span class="num" data-cible="r-{r["slug"]}">000</span></a>' for r in v]
    h.append('</div>')
    for s in situations:
        s['ink'] = '#F8F5F4' if s['key'] == 'budget' else '#534741'
        ext = RACINE / 'intercalaires' / f'{s["key"]}.pdf'
        attrs = f' id="i-{s["key"]}" data-intercalaire="{e(s["nom"])}"'
        if ext.is_file():
            h.append(pages_vides('p-couverture', nb_pdf(ext), attrs + f' data-externe="intercalaires/{s["key"]}.pdf"'))
        else:
            h.append(f'<section class="separation inter-{s["key"]}"{attrs}><p class="nb">{len(groupes[s["key"]])} recettes</p><h1>{e(s["nom"])}</h1></section>')
        h += [page_recette(r, s, par_id, G) for r in groupes[s['key']]]
    h.append(f'<section class="texte outil" data-signet-simple="Planning de la semaine"><h1>Le planning de la semaine</h1><p class="sem">Semaine du ……………………………</p><table><thead><tr><th></th><th>Le dîner</th><th>Page</th></tr></thead><tbody>'
             + ''.join(f'<tr><th>{j}</th><td></td><td></td></tr>' for j in JOURS) + '</tbody></table></section>')
    h.append('<section class="texte outil" data-signet-simple="Liste de courses"><h1>La liste de courses</h1><div class="rayons">'
             + ''.join(f'<div><h2>{e(x)}</h2><table><thead><tr><th>Ce qu’il reste</th><th>À acheter</th></tr></thead><tbody>' + '<tr><td></td><td></td></tr>' * 8 + '</tbody></table></div>' for x in RAYONS)
             + '</div></section>')
    index, deduits = {}, 0
    for v in groupes.values():
        for r in v:
            lab, connu = ingredient_principal(r)
            deduits += 0 if connu else 1
            index.setdefault(lab, []).append(r)
    h.append('<div class="flux" data-flux="index" data-titre="Index par ingrédient principal" data-signet-simple="Index">')
    for lab in sorted(index, key=cle_tri):
        h.append(f'<p class="ligne tete-i">{e(lab)}</p>')
        h += [f'<a class="ligne" href="#r-{r["slug"]}"><span>{e(r["titre"])}</span><span class="num" data-cible="r-{r["slug"]}">000</span></a>'
              for r in sorted(index[lab], key=lambda r: cle_tri(r['titre']))]
    h.append('</div>')
    css = css_livre(situations)
    return f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Le classeur Mille Feuilles</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kalam&display=swap"><style>{css}</style>
<script>window.PagedConfig={{auto:false}};</script><script src="/.venv-classeur/paged.polyfill.js"></script></head><body>{"".join(h)}</body></html>''', deduits, len(index)


def css_livre(situations):
    base = '''
@font-face{font-family:Pacaembu;src:url(/fonts/Pacaembu-Light.otf);font-weight:300}
@font-face{font-family:Pacaembu;src:url(/fonts/Pacaembu-Regular.otf);font-weight:400}
@font-face{font-family:Pacaembu;src:url(/fonts/Pacaembu-Bold.otf);font-weight:700}
@font-face{font-family:Pacaembu;src:url(/fonts/Pacaembu-Black.otf);font-weight:800}
@font-face{font-family:'IM Fell English';src:url(/fonts/IMFellEnglish-Regular.ttf)}
@page{size:210mm 297mm;margin:20mm 14mm 16mm;
 @top-left{content:"mille feuilles";font:700 9pt Pacaembu;color:#534741}
 @bottom-right{content:counter(page);font:800 10pt Pacaembu;color:#534741}}
@page plein{margin:0;@top-left{content:none}@bottom-right{content:none}}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;color:#534741;font-family:Pacaembu,sans-serif;font-size:11pt;line-height:1.4;-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3,p,ul,ol{margin:0;padding:0}
a{color:inherit;text-decoration:none}
body:not(.pagine){width:182mm}
.vide,.couverture-prov,.separation{page:plein;break-before:page;break-after:page}
.vide{height:296mm;padding:10mm}.repere{color:#fff;font-size:1pt}
.couverture-prov{height:296mm;background:#F8F5F4;padding:40mm 20mm;display:flex;flex-direction:column;gap:12mm}
.couverture-prov img{width:90mm}.couverture-prov h1{font:400 44pt 'IM Fell English',serif}
.separation{height:296mm;padding:30mm 22mm;display:flex;flex-direction:column;justify-content:flex-end;gap:6mm}
.separation h1{font-weight:800;font-size:52pt;line-height:1;letter-spacing:-.03em}.separation .nb{font-weight:700;font-size:14pt}
.texte{break-before:page;break-after:page}
.texte h1,.liste-page h1{font-weight:800;font-size:34pt;line-height:1;letter-spacing:-.03em;margin-bottom:8mm}
.texte h2{font-size:15pt;font-weight:800;margin:7mm 0 2mm}.texte p{max-width:150mm}
.mentions h1{font-family:'IM Fell English',serif;font-weight:400;letter-spacing:0}
.pastilles{list-style:none;margin-top:4mm;display:grid;gap:1.5mm}.pastilles li{display:flex;gap:3mm;align-items:center;font-weight:700}
.pastilles i{width:4mm;height:6mm;border-radius:0 2mm 2mm 0}
.flux{break-before:page}
.liste-page{height:259mm;break-after:page;display:flex;flex-direction:column;overflow:hidden}
.liste-cols{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:8mm}.liste-cols>div{min-height:0;overflow:hidden}
.ligne{display:flex;justify-content:space-between;gap:3mm;font-size:8.5pt;line-height:1.25;padding:.45mm 0;break-inside:avoid}
.ligne .num{font-weight:700;flex:none;font-variant-numeric:tabular-nums}
.tete{background:var(--c);color:var(--k);font-weight:800;font-size:10.5pt;padding:1mm 2mm;border-radius:0 2.5mm 2.5mm 0;margin:2mm 0 1mm}
.tete-i{font-weight:800;font-size:9.5pt;margin-top:1.6mm}
.recette{height:258mm;overflow:hidden;break-before:page;break-inside:avoid;font-size:calc(var(--t,11) * 1pt);display:flex;flex-direction:column;gap:.9em}
.recette header{background:var(--sit);color:var(--sitk);border-radius:1.5mm 6mm 6mm 6mm;padding:1.1em 1.3em}
.recette h2{font-size:2.3em;font-weight:800;line-height:1.05;letter-spacing:-.025em}
.meta{display:flex;flex-wrap:wrap;gap:.2em 1.3em;margin-top:.6em;font-size:.92em;font-weight:700}.meta b{font-weight:400;margin-right:.25em}
.corps{display:grid;grid-template-columns:36% 1fr;gap:1.6em;align-items:start}
.tt{font-size:1.4em;font-weight:800;margin-bottom:.35em;letter-spacing:-.01em}
.ing ul{list-style:none}.ing li{padding:.28em 0;border-bottom:.25mm solid rgba(83,71,65,.16);line-height:1.28}
.ing h3:not(.tt){display:inline-block;background:var(--sit);color:var(--sitk);padding:.1em .8em .1em .5em;border-radius:0 .6em .6em 0;margin-top:.7em;font-size:.95em}
.et ol{list-style:none;display:flex;flex-direction:column;gap:.5em}.et li{display:flex;gap:.7em;line-height:1.33}
.n{flex:none;width:1.9em;height:1.55em;display:grid;place-items:center;background:var(--sit);color:var(--sitk);border-radius:0 .5em .5em 0;font-weight:800;font-size:.92em}
.bas{margin-top:auto;display:flex;flex-direction:column;gap:.4em;font-size:.92em}
.bas b{display:inline-block;margin-right:.5em;padding:0 .7em 0 .45em;border-radius:0 .5em .5em 0;background:var(--sit);color:var(--sitk)}
.sv b{background:#9599EA;color:#534741}
.outil table{width:100%;border-collapse:collapse}.outil th{text-align:left}.outil td,.outil tbody th{border:.3mm solid rgba(83,71,65,.3)}
.outil>table tbody tr{height:30mm}.outil>table thead th{padding:1mm 2mm}.outil>table tbody th{width:28mm;padding:2mm;font-weight:800}.outil>table td:last-child{width:20mm}
.sem{margin-bottom:5mm;font-weight:700}
.rayons{display:grid;grid-template-columns:1fr 1fr;gap:5mm 8mm}.rayons h2{margin:0 0 1.5mm;font-size:12pt}.rayons thead th{font-size:8.5pt;padding-bottom:1mm}.rayons td{height:7mm;width:50%}
'''
    extra = []
    for s in situations:
        k = s['key']
        ink = '#F8F5F4' if k == 'budget' else '#534741'
        nom = s['nom'].replace('"', '\\"')
        extra.append(f'''
@page sit-{k}{{@top-left{{content:"{nom}";background:{s["couleur"]};color:{ink};font:800 9.5pt Pacaembu;padding:1mm 4mm 1mm 2mm;border-radius:0 3mm 3mm 0;height:7mm;margin-top:8mm}}
 @bottom-right{{content:counter(page);background:{s["couleur"]};color:{ink};font:800 10pt Pacaembu;padding:0 2mm;height:6mm;margin-top:5mm;border-radius:2mm 0 0 2mm;text-align:center}}}}
.sit-{k}{{page:sit-{k};--sit:{s["couleur"]};--sitk:{ink}}}
.inter-{k}{{background:{s["couleur"]};color:{ink}}}
.pagedjs_page:has(.inter-{k}){{background:{s["couleur"]}}}''')
    return base + ''.join(extra)


JS_MISE_EN_PAGE = r'''
async () => {
  await document.fonts.load('400 11pt Pacaembu'); await document.fonts.load('800 11pt Pacaembu'); await document.fonts.load('700 11pt Pacaembu');
  await document.fonts.ready;
  // 1. chaque recette tient sur sa page : on réduit le corps si besoin
  const tailles=[11,10.5,10,9.5,9,8.5,8,7.5], stats={};
  document.querySelectorAll('.recette').forEach(r=>{
    let i=0; for(;i<tailles.length;i++){ r.style.setProperty('--t',tailles[i]); if(r.scrollHeight<=r.clientHeight+1) break; }
    if(i===tailles.length){ r.dataset.deborde='1'; i--; }
    r.dataset.corps=tailles[i];
  });
  // 2. sommaire et index : répartis en deux colonnes par page
  document.querySelectorAll('[data-flux]').forEach(f=>{
    const items=[...f.children]; f.innerHTML='';
    let page,col,nc=0,premiere=true;
    const nouvelle=()=>{ page=document.createElement('div'); page.className='liste-page';
      if(premiere){const h=document.createElement('h1');h.textContent=f.dataset.titre;page.append(h);premiere=false;}
      const g=document.createElement('div');g.className='liste-cols';g.append(document.createElement('div'),document.createElement('div'));page.append(g);f.append(page);
      nc=0;col=g.children[0]; };
    nouvelle();
    items.forEach(it=>{ col.append(it);
      if(col.scrollHeight>col.clientHeight+1){ it.remove(); if(nc===0){nc=1;col=col.parentNode.children[1];}else nouvelle(); col.append(it);} });
  });
  document.body.classList.add('pagine');
  await window.PagedPolyfill.preview();
  // 3. numéros de page réels
  const pageDe=el=>{const p=el&&el.closest('.pagedjs_page');return p?+p.dataset.pageNumber:null;};
  document.querySelectorAll('.num[data-cible]').forEach(n=>{ const c=document.getElementById(n.dataset.cible); n.textContent=c?pageDe(c):'?'; });
  // 4. informations pour les signets et le rapport
  const liste=s=>[...document.querySelectorAll(s)];
  return {
    total:document.querySelectorAll('.pagedjs_page').length,
    signets:liste('[data-signet-simple],[data-intercalaire],[data-signet]').map(el=>({titre:el.dataset.signetSimple||el.dataset.intercalaire||el.dataset.signet,type:el.dataset.intercalaire?'i':el.dataset.signet?'r':'s',page:pageDe(el)})),
    externes:liste('[data-externe]').map(el=>({f:el.dataset.externe,page:pageDe(el)})),
    recettes:liste('.recette[data-slug]').filter(r=>!r.dataset.splitFrom).map(r=>({slug:r.dataset.slug,titre:r.dataset.signet,corps:+r.dataset.corps,deborde:!!r.dataset.deborde,page:pageDe(r)})),
    fragments:liste('[data-split-from]').filter(x=>x.classList.contains('recette')).map(x=>x.dataset.slug),
  };
}
'''


def servir():
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), partial(H, directory=str(RACINE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def assembler(brut, final, infos):
    from pypdf import PdfReader, PdfWriter, Transformation
    w = PdfWriter(clone_from=str(brut))
    for x in infos['externes']:
        lecteur = PdfReader(str(RACINE / x['f']))
        for i, source in enumerate(lecteur.pages):
            cible = w.pages[x['page'] - 1 + i]
            sx = float(cible.mediabox.width) / float(source.mediabox.width)
            sy = float(cible.mediabox.height) / float(source.mediabox.height)
            cible.merge_transformed_page(source, Transformation().scale(sx, sy))
    parent = None
    vus = set()
    for s in infos['signets']:
        if s['type'] == 's':
            if s['titre'] in vus:
                continue
            vus.add(s['titre'])
        if s['type'] == 'i':
            parent = w.add_outline_item(s['titre'], s['page'] - 1)
        elif s['type'] == 'r':
            w.add_outline_item(s['titre'], s['page'] - 1, parent=parent)
        else:
            parent = None
            w.add_outline_item(s['titre'], s['page'] - 1)
    w.page_mode = '/UseOutlines'
    w.add_metadata({'/Title': 'Le classeur Mille Feuilles', '/Author': 'Studio Mille Pages'})
    w.compress_identical_objects()
    with open(final, 'wb') as f:
        w.write(f)


def controler(final):
    from pypdf import PdfReader
    r = PdfReader(str(final))
    non_incorporees, liens = set(), 0
    for p in r.pages:
        liens += len(p.get('/Annots') or [])
        for f in ((p.get('/Resources') or {}).get('/Font') or {}).values():
            f = f.get_object()
            if f.get('/Subtype') == '/Type3':  # glyphes dessinés dans le PDF lui-même : incorporés par nature
                continue
            d = f.get('/FontDescriptor')
            if f.get('/DescendantFonts'):
                d = f['/DescendantFonts'][0].get_object().get('/FontDescriptor')
            d = d.get_object() if d else None
            if not d or not any(k in d for k in ('/FontFile', '/FontFile2', '/FontFile3')):
                non_incorporees.add(str(f.get('/BaseFont')))
    return len(r.pages), liens, non_incorporees, len(r.outline)


def quantites_suspectes(toutes, G):
    """Compare le chiffre affiché au texte d'origine : même défaut sur le site et dans le PDF."""
    out = []
    for r in toutes:
        for it in r.get('ingredients', []):
            if it.get('quantite') is None:
                continue
            q, n = G.quantite(it, G.pb(r), G.pb(r))
            chiffres = re.sub(r'[^0-9]', '', q.split('\u00a0')[0].replace('¼', '').replace('½', '').replace('¾', ''))
            brut = it.get('texte', '').replace(',', '.')
            m = re.search(r'(\d+(?:\.\d+)?)\s*(cl|l|kg)\b', brut)
            if m and q.endswith(('ml', 'g')) and it.get('unite') in ('ml', 'g'):
                facteur = {'cl': 10, 'l': 1000, 'kg': 1000}[m.group(2)]
                if abs(float(m.group(1)) * facteur - float(chiffres or 0)) <= 10:
                    continue
            if chiffres and chiffres not in re.sub(r'[^0-9]', '', it.get('texte', '')):
                if not ('kg' in q or re.search(r'½|¼|¾|1/2|1/4', it.get('texte', '') + q)):
                    out.append((r['titre'], it.get('texte', ''), f'{q} {n}'.replace('\u00a0', ' ')))
    return out


def main():
    installer()
    ap = argparse.ArgumentParser()
    ap.add_argument('--test', type=int, default=0, help='nombre de recettes par intercalaire, pour un essai')
    args = ap.parse_args()
    from playwright.sync_api import sync_playwright
    sys.path.insert(0, str(RACINE / 'scripts'))
    sys.dont_write_bytecode = True
    import generer_recettes as G

    situations, groupes, ignorees, version, empreinte, toutes = charger(args.test)
    for s in situations:
        s['ink'] = '#F8F5F4' if s['key'] == 'budget' else '#534741'
    now = datetime.date.today()
    date_txt = f'{now.day} {MOIS[now.month - 1]} {now.year}'
    html, deduits, nb_index = construire(situations, groupes, version, empreinte, date_txt, G)
    SORTIE.mkdir(exist_ok=True)
    (SORTIE / 'classeur.html').write_text(html, encoding='utf-8')
    brut, final = SORTIE / 'brut.pdf', SORTIE / NOM_PDF
    srv = servir()
    print(f'Mise en page de {sum(map(len, groupes.values()))} recettes (plusieurs minutes pour le livre entier)…')
    with sync_playwright() as p:
        nav = p.chromium.launch()
        page = nav.new_page()
        page.set_default_timeout(0)
        page.goto(f'http://127.0.0.1:{srv.server_address[1]}/sortie-classeur/classeur.html', wait_until='networkidle')
        infos = page.evaluate(JS_MISE_EN_PAGE)
        page.pdf(path=str(brut), prefer_css_page_size=True, print_background=True)
        nav.close()
    srv.shutdown()
    assembler(brut, final, infos)
    brut.unlink()
    (SORTIE / 'classeur.html').unlink()
    pages, liens, polices, nb_signets = controler(final)
    mo = final.stat().st_size / 1024 / 1024
    incluses = infos['recettes']
    reduites = sorted((r for r in incluses if r['corps'] <= 8.5), key=lambda r: r['corps'])
    debords = [r for r in incluses if r['deborde']]
    fragments = sorted(set(infos['fragments']))
    verif = {}
    for r in toutes:
        for c in r.get('a_verifier', []):
            verif[c] = verif.get(c, 0) + 1
    L = [f'Classeur Mille Feuilles, version {version} ({empreinte}), {date_txt}', '',
         f'Fichier : {final.name}, {mo:.1f} Mo, {pages} pages (Paged.js : {infos["total"]})',
         f'Recettes incluses : {len(incluses)}',
         f'Recettes ignorées : {len(ignorees)}']
    L += [f'  - {s} : {m}' for s, m in ignorees]
    L += ['', 'Champs a_verifier (recettes incluses quand même ; allergènes masqués tant qu’ils y figurent) :']
    L += [f'  - {k} : {v} recettes' for k, v in sorted(verif.items(), key=lambda x: -x[1])]
    L += ['', f'Recettes qui dépassent de leur page, texte coupé (à raccourcir) : {len(debords)}']
    L += [f'  - {r["titre"]} (p. {r["page"]})' for r in debords]
    L += [f'Recettes réparties sur plusieurs pages : {len(fragments)}'] + [f'  - {s}' for s in fragments]
    L += [f'Pages anormalement longues (corps réduit à 8,5 pt ou moins) : {len(reduites)}']
    L += [f'  - {r["titre"]} (p. {r["page"]}, {r["corps"]} pt)' for r in reduites]
    ecarts = quantites_suspectes(toutes, G)
    L += ['', f'Quantités à contrôler (le calcul diffère du texte d’origine) : {len(ecarts)}']
    L += [f'  - {t} : « {o} » affiché « {c} »' for t, o, c in ecarts]
    L += ['', f'Index : {nb_index} entrées, dont {deduits} recettes rangées sous leur premier ingrédient brut (pas de correspondance).',
          f'Liens cliquables : {liens} ; signets : {nb_signets} au premier niveau.',
          f'Polices non incorporées : {", ".join(sorted(polices)) or "aucune"}',
          'Couverture : ' + ('couverture.pdf' if (RACINE / 'couverture.pdf').is_file() else 'PROVISOIRE, couverture.pdf absent'),
          'Intercalaires PDF : ' + (', '.join(x['f'] for x in infos['externes'] if x['f'].startswith('inter')) or 'aucun, pages à la couleur')]
    if mo >= 30:
        L.append(f'ATTENTION : le PDF dépasse 30 Mo ({mo:.1f} Mo).')
    texte = '\n'.join(L) + '\n'
    (SORTIE / 'rapport.txt').write_text(texte, encoding='utf-8')
    print(texte)
    print(f'PDF : {final}')


if __name__ == '__main__':
    main()
