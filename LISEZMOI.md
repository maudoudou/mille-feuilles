# Mille Feuilles · site statique

Site HTML, CSS et JavaScript sans outil de construction, compatible GitHub Pages.
Tous les chemins sont relatifs : le dossier fonctionne à la racine du dépôt `mille-feuilles`
ou dans un sous-dossier d'un autre dépôt (par exemple `studiomillepages.fr/mille-feuilles/`),
sans toucher aux pages existantes.

## Mettre en ligne
1. Copiez le contenu de ce dossier à la racine du dépôt `maudoudou/mille-feuilles` (ou dans un sous-dossier).
2. Poussez sur `main`.
3. Sur GitHub : Settings → Pages → Source « Deploy from a branch », branche `main`, dossier `/ (root)`.
Le fichier `.nojekyll` empêche GitHub de retraiter le site.

## Les fichiers

### Pages
- `index.html` : accueil. « On mange quoi ? », la première question (combien vous êtes), une pile de recettes, les sept intercalaires, des exemples, comment ça marche, l'abonnement, le classeur, la feuille du jeudi, les questions.
- `recettes.html` : l'outil. Questions une par une, résultats filtrables, fiche recette, menu de la semaine et liste de courses, passage membre. Tout est rendu par `js/outil.js`.
- `fiche.html` : fiches A4 à imprimer ou enregistrer en PDF. `fiche.html?id=chili&p=4` affiche une recette pour 4 ; sans paramètre, deux fiches d'exemple. Les aperçus de la page classeur utilisent cette page.
- `tarifs.html` : gratuit, membre (mis en avant), classeur PDF, feuille du jeudi, tableau comparatif.
- `classeur.html` : page de vente du classeur PDF à 24,90 €.
- `feuille-du-jeudi.html` : inscription à la newsletter.
- `email/feuille-du-jeudi.html` : modèle d'email à coller dans votre outil d'emailing (mode d'emploi en tête du fichier).

### Styles et scripts
- `css/mille-feuilles.css` : la feuille de style unique (couleurs, typographie, boutons, intercalaires, cartes, outil, animations, réduction des mouvements).
- `css/fiche.css` : mise en page A4 et réglages d'impression.
- `js/donnees.js` : lit `data/recettes.json` et prépare les recettes pour les autres scripts (le site doit être ouvert depuis son adresse en ligne : un double-clic sur le fichier ne permet pas de lire le JSON).
- `js/commun.js` : sur toutes les pages. Remplace l'image du logo par le SVG en ligne pour l'animer, fait « s'écrire » les notes manuscrites, et fournit le calcul des quantités et le cadre photo.
- `js/pages.js` : piles de recettes, exemples, aperçus du classeur, formulaires d'inscription, bascule année ou mois.
- `js/outil.js` : l'outil complet (filtres, quantités, variantes avec et sans viande, semaine, glisser pour changer, liste de courses, état gardé dans le navigateur).
- `js/fiche.js` : construit les fiches A4 à partir des données.
- `data/recettes.json` : la base complète du classeur : 727 recettes, 529 salées et 198 sucrées. 50 sont gratuites (40 salées, 10 sucrées). Champs : id, slug, titre, type, situation, regime, budget_portion, temps_minutes, personnes_base, batch, saison, allergenes, ingredients, etapes, version_sans_viande, gratuit, image, a_verifier. Les champs absents du PDF sont estimés et listés dans `a_verifier`.
- `photos-a-faire.csv` : suivi des photos (id, titre, nom du fichier, statut). S'ouvre dans Excel ou Numbers. À ne pas forcément mettre en ligne.

### Ressources
- `assets/logo.svg`, `assets/logo-lait.svg` : votre logo, en couleur sur fond clair et en version lait sur fond Encre.
- `assets/monogramme.svg` : favicon (les quatre onglets).
- `images/recettes/` : déposez `<slug>.webp` (exemple : `chili-con-carne.webp`, 1 200 × 900 px). La photo remplace la carte typographique partout : cartes, fiche, A4.
- `fonts/` : Pacaembu (licence d'essai : vérifiez la licence avant la mise en ligne publique) et IM Fell English. L'écriture manuscrite Kalam vient de Google Fonts.

## Pages recettes et sitemap
Modifiez `data/recettes.json` (ou ajoutez une photo) et poussez sur `main` : l'action `.github/workflows/generer-recettes.yml` lance `scripts/generer_recettes.py`, puis enregistre le résultat sur `main`. Faites ensuite « Pull » avant votre prochaine modification.
Le script crée `recettes/<slug>/` pour chaque recette `"gratuit": "oui"`, la liste de `recettes.html`, les exemples de l'accueil et `sitemap.xml`. Ne modifiez pas ces contenus à la main. À la main, si besoin : `python3 scripts/generer_recettes.py`.
Champ facultatif : `"intro": "Votre texte."` remplace l'introduction automatique d'une recette.

## Palette
- Pot au Lait #F8F5F4 : fond. Texte Encre toutes tailles.
- Encre #534741 : texte, pied de page, intercalaire « Petit budget » (texte Pot au Lait).
- Boucle d'Or #F4CC71 : bouton principal, « 20 minutes chrono ». Texte Encre toutes tailles (5,9:1).
- Bleuet #9CCBEF : « Frigo presque vide », liste de courses. Texte Encre toutes tailles (5,2:1).
- Praline #F6AA95 : « Réconfort ». Texte Encre toutes tailles (4,7:1).
- Guimauve #FF8FC2 : « Dimanche, on retrousse les manches ». Texte Encre 19 px gras minimum (4,3:1).
- Haricot #62B47E : « On reçoit ». Texte Encre 19 px gras minimum (3,6:1).
- Violet #9599EA : « Une base, deux assiettes ». Texte Encre 19 px gras minimum (3,4:1).

## À brancher avant l'ouverture
- **Paiement** : les boutons « Acheter le classeur » (`href="#acheter"`, attribut `data-achat`) attendent votre lien de paiement (Stripe Payment Link, Lemon Squeezy, Gumroad…).
- **Abonnement** : dans l'outil, « Devenir membre » est simulé (bouton de démonstration). Un vrai abonnement demande un service de comptes et de paiement (par exemple Memberstack ou Outseta, compatibles avec un site statique).
- **Newsletter** : remplacez `action="#"` des formulaires `data-newsletter` par l'adresse d'inscription de votre outil d'emailing.
- **Données** : relisez les champs listés dans `a_verifier` (situation, budget, saison, allergènes surtout).
- **Avis** : l'emplacement réservé de `classeur.html` attend de vrais retours.
