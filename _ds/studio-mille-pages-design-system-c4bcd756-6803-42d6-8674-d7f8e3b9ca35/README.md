# Studio Mille Pages · design system

Studio Mille Pages est le studio de **Maud Lenoir**, designer éditoriale et maquettiste : livrets pédagogiques, ouvrages, papeterie et jeux de société, de la petite carte à la grande cimaise, pour les structures culturelles, les collectivités et les familles. Basée à Rouen, disponible partout en France. Site : studiomillepages.fr.

L'identité repose sur une idée : un **leporello**, un livret plié en six, qui se déplie comme une route. Le nom se lit sur ses plis.

Une seule surface produit aujourd'hui : le **site vitrine** studiomillepages.fr (accueil, studio, parcours, contact, plus deux rubriques « hors collection » : le blog À table et le jeu Mythes & Marmites).

## Sources
- Dépôt GitHub du site : https://github.com/maudoudou/mythesetmarmites (branche `main`). Fichiers clés : `style.css` (jetons, composants, animation des plis), `index.html` (coquille de toutes les pages), `studio/index.html`, `RAPPORT-REFONTE.md` (contrastes, choix de refonte), `scripts/generate-logos.py` (vectorisation des logos). Explorez ce dépôt pour aller plus loin dans la fidélité au site.
- Fichiers fournis : SVG du logo (horizontal, carré, rond × couleur, encre, lait), polices Pacaembu (Light à Black) et IM Fell English.
- Charte rédigée par l'autrice (logo, couleurs, typo, mise en page, motif du pli, ton).

**Mythes & Marmites n'est pas Studio Mille Pages.** Le jeu et le blog À table sont des projets personnels, avec leur propre logo et les illustrations de Christelle Louiset. Ces illustrations de contes ne s'utilisent pas sur les supports du studio, sauf pour présenter le jeu. Elles n'ont pas été importées ici.

---

## Content fundamentals
- **Langue** : français. **Vouvoiement** du lecteur ; l'autrice parle à la **première personne** (« Je mets en pages… », « Je réponds sous deux jours ouvrés. »).
- **Phrases courtes, voix active.** Ton personnel, simple, chaleureux et professionnel. Franchise assumée : « Si le projet ne me correspond pas, je vous le dis franchement et j'essaie de vous orienter. »
- **Titres en casse phrase**, souvent une phrase complète avec point : « Racontez-moi. », « Parlons de votre projet. », « De la première maquette au fichier d'impression. »
- **Interdits** : jargon marketing (« solutions innovantes », « passionnée par », « n'hésitez pas »), émoji, tiret cadratin, question rhétorique suivie de sa réponse, faux numéros de page.
- **Typographie française** : espace insécable avant « : ; ? ! », guillemets « ».
- Libellés concrets : « Ce que j'ai fait », « La commande », « Commanditaire », « Visuel à venir ».
- Accroche de référence : « Je mets en pages livrets, ouvrages et papeterie, de la petite carte à la grande cimaise. »
- Boutons à l'infinitif ou au nom : « Voir le studio », « Parler d'un projet », « Envoyer ».

## Visual foundations
- **Couleurs** : fond nu **Pot au Lait** #F8F5F4, texte **Encre** #534741. Accents : les trois couleurs des plis, chacune avec son pli voisin (-2) pour le survol ou l'ombre : Haricot #62B47E / #55A270, Boucle d'Or #F4CC71 / #EBBE5C, Violet #9599EA / #A9ACEF. Aucune autre couleur : la palette se limite à Pot au Lait, Encre et aux trois couleurs des plis.
- **Contrastes** : texte courant et liens en Encre, **soulignés**. Sur Boucle d'Or, Haricot ou Violet : texte Encre uniquement. Haricot (3,56) et Violet (3,42) : grand texte seulement.
- **Typographie** : Pacaembu Black (800) pour titres de section et lettres des plis, Bold (700) pour boutons, Regular (400) pour le texte courant (16 px min., interligne 1,6), Light (300) pour chapôs ; capitales interlettrées 2,6 px pour les surtitres. IM Fell English **romain** pour titres d'ouvrage, « Mille Pages » et chiffres romains des offres (I, II, III, IV). Aucune autre police.
- **Fonds** : beaucoup de Pot au Lait ; sections sombres en aplat Encre ; certaines sections en aplat de couleur des plis. **Aucun dégradé**, aucune texture, aucune photo d'illustration générique. Les seules images sont des photos de vrais projets (livrets, carnets, jeu), bord droit arrondi à 6 px.
- **Le motif du pli** : élément récurrent. Six plis 34 × 48, décalés de 6, pente 10°, ordre fixe. Usages : bande sous un titre / séparateur / bas de carte ; trame en coin qui déborde (jamais sous un texte) ; plis isolés comme puce, onglet, repère de chapitre (Haricot = I, Boucle d'Or = II, Violet = III) ; aplats de section. Un seul usage par écran ou double page, deux au maximum. Jamais de lettres sur les plis hors logo.
- **Animation** : les plis se déplient de gauche à droite, un par un, ~0,4 s, sans boucle (à l'apparition d'un titre, au survol d'un lien). Transitions de couleur 0,15 s ; easing `cubic-bezier(.2,.7,.3,1)`. Pas de rebond. `prefers-reduced-motion` : apparition sans mouvement.
- **Survol** : boutons → aplat du pli voisin (boucle-dor → boucle-dor-2) ; contour → aplat Encre ; liens de nav → bande de plis qui se déplie ; flèche « → » qui glisse de 4-5 px. **Pression** : rien de plus (pas de rétrécissement).
- **Bordures** : filet 1 px rgba(Encre, .12) sur les cartes ; 1,5 px sur étiquettes, filtres, champs. **Pas de filets décoratifs, pas de sommaire à pointillés.**
- **Ombres** : aucune. Ni portée, ni intérieure, ni relief. Le focus clavier est un double anneau (Pot au Lait 2 px + Encre 4,5 px).
- **Transparence et flou** : non utilisés, sauf opacités d'Encre pour textes discrets (78 %) et filets.
- **Rayons** : pastille 999 px (boutons, étiquettes, filtres), carte 20 px, panneau 24 px, champ 10 px, photo 6 px.
- **Cartes** : fond blanc ou Pot au Lait, filet 1 px, sans ombre, rayon 20 px, padding 34 px.
- **Mise en page** : colonne de 1 080 px, gouttière 40 px, sections espacées de 56 à 96 px. En-tête : logo centré, un lien de chaque côté. Pied de page en aplat Encre avec logo lait et colophon. Rien de fixe à l'écran.
- **Ambiance** : sobre dans la structure, généreux dans la couleur, jamais enfantin.

## Iconography
- Le système n'utilise **pas de bibliothèque d'icônes** ni de police d'icônes. Le dépôt n'en contient pas.
- Seuls signes : la flèche Unicode **→** (liens « En savoir plus → », boutons), les chevrons ← → de la pagination, le chevron SVG de la liste déroulante (inline dans `Field.jsx`).
- Les **plis** jouent le rôle de pictos : puces de liste, repères de chapitre, onglets (composant `Plis` avec `pair` / `single`).
- Pas d'émoji. Les illustrations de contes de Christelle Louiset appartiennent à Mythes & Marmites et ne sont pas utilisées.
- Favicon et icônes d'application : `assets/logos/favicon.svg`, `assets/icons/`.

## Logo
- Leporello de six plis portant S·T·U·D·I·O en Pacaembu Black, couleur Pot au Lait ; à côté, « Mille Pages » en IM Fell English romain.
- **Horizontal** : en-têtes, site, signatures, pied de page (min. 35 mm / 140 px). **Carré** (« Mille / STUDIO / Pages ») : couvertures, affiches, cimaises, image de partage (min. 18 mm / 64 px). **Rond** : photo de profil, favicon, tampon (min. 6 mm / 16 px).
- Couleur uniquement sur Pot au Lait ; sur Encre, version lait. Jamais sur un aplat de couleur. Zone de protection : la largeur d'un pli (space-4) tout autour. Ne jamais changer l'ordre ou les couleurs des plis, étirer, ajouter ombre, contour ou relief.
- Fichiers : `assets/logos/` (fichiers fournis) et `assets/logos/web/` (texte vectorisé, à préférer dans une balise `<img>`).

---

## Index
- `styles.css` : point d'entrée, uniquement des `@import`.
- `tokens/` : `fonts.css` (@font-face), `colors.css`, `typography.css`, `spacing.css` (espacements, rayons, mouvement), `motif.css` (keyframes des plis), `base.css` (body, liens soulignés, focus).
- `fonts/` : Pacaembu Light, Regular, Medium, Bold, Black ; IM Fell English Regular.
- `assets/logos/`, `assets/logos/web/`, `assets/icons/`, `assets/photos/` (photos de projets réels du site).
- `guidelines/` : cartes de fondations (couleurs, typographie, espacements, marque, motif).
- `components/` : primitives React (voir ci-dessous), une carte par dossier.
- `ui_kits/site/` : recréation cliquable du site (accueil, studio, contact).
- `SKILL.md`, `github.md`, `thumbnail.html`.

## Components
- **brand/** : `Logo`, `Plis`
- **type/** : `Kicker`, `SectionTitle`, `RomanNumeral`
- **actions/** : `Button`, `TextLink`
- **content/** : `Card`, `Panel`, `Badge`, `Tag`, `TagList`, `Facts`, `Step`
- **forms/** : `Field`, `Input`, `Select`, `Textarea`
- **navigation/** : `FilterChip`, `Pager`

Le site n'a pas de bibliothèque de composants : cet inventaire suit les classes de `style.css` (`.btn`, `.navlink`, `.more`, `.card`, `.panel`, `.badge-or`, `.kinds`, `.facts`, `.steps`, `.field`, `.chip`, `.pager`, `.num`, `.kicker`, `.t-sec`, `.plis`).

### Intentional additions
- `Logo` : enveloppe des SVG de production, impose les tailles minimales et la zone de protection.
- `Plis` : le motif du pli en composant (bande, paire, pli isolé, encre/lait, animation), demandé par la charte.

## Écarts entre le site en ligne et la charte
La charte prime. Le site actuel utilise encore des illustrations de contes en filigrane, des filets pointillés, un surlignage en dégradé et des liens non soulignés : le design system ne les reprend pas.

## Licence
Pacaembu est utilisée sous **licence d'essai** : vérifier la licence avant tout usage public ou commercial.
