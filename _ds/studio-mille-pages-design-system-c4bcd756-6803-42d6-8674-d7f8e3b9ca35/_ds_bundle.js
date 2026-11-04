/* @ds-bundle: {"format":4,"namespace":"StudioMillePagesDesignSystem_c4bcd7","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Plis","sourcePath":"components/brand/Plis.jsx"},{"name":"Badge","sourcePath":"components/content/Badge.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"Facts","sourcePath":"components/content/Facts.jsx"},{"name":"Panel","sourcePath":"components/content/Panel.jsx"},{"name":"Step","sourcePath":"components/content/Step.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"TagList","sourcePath":"components/content/Tag.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Field.jsx"},{"name":"Textarea","sourcePath":"components/forms/Field.jsx"},{"name":"Select","sourcePath":"components/forms/Field.jsx"},{"name":"FilterChip","sourcePath":"components/navigation/FilterChip.jsx"},{"name":"Pager","sourcePath":"components/navigation/Pager.jsx"},{"name":"Kicker","sourcePath":"components/type/Kicker.jsx"},{"name":"RomanNumeral","sourcePath":"components/type/RomanNumeral.jsx"},{"name":"SectionTitle","sourcePath":"components/type/SectionTitle.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"c0c0b3fc2a7b","components/actions/TextLink.jsx":"23bd7bb1439b","components/brand/Logo.jsx":"135ea3485ea9","components/brand/Plis.jsx":"d76045e7b40d","components/content/Badge.jsx":"e476767d90fe","components/content/Card.jsx":"f6e8d7a26985","components/content/Facts.jsx":"9006dfbb249c","components/content/Panel.jsx":"4e5b9941cd78","components/content/Step.jsx":"84ac4de2847f","components/content/Tag.jsx":"c1aed463f002","components/forms/Field.jsx":"33703efec6ec","components/navigation/FilterChip.jsx":"df2658049e46","components/navigation/Pager.jsx":"915c939832e4","components/type/Kicker.jsx":"620ca3915e01","components/type/RomanNumeral.jsx":"f1be26ab543e","components/type/SectionTitle.jsx":"e3f7d2eed1d7","ui_kits/site/Accueil.jsx":"52969969b0bc","ui_kits/site/Chrome.jsx":"2e1892ee99b1","ui_kits/site/Contact.jsx":"e313f464b03a","ui_kits/site/Studio.jsx":"d70063acfb7c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.StudioMillePagesDesignSystem_c4bcd7 = window.StudioMillePagesDesignSystem_c4bcd7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
const FILES = {
  horizontal: {
    couleur: 'web/smp-horizontal-couleur.svg',
    encre: 'smp-horizontal-encre.svg',
    lait: 'web/smp-horizontal-lait.svg'
  },
  carre: {
    couleur: 'web/smp-carre-couleur.svg',
    encre: 'smp-carre-encre.svg',
    lait: 'smp-carre-lait.svg'
  },
  rond: {
    couleur: 'smp-rond-couleur.svg',
    encre: 'smp-rond-encre.svg',
    lait: 'smp-rond-lait.svg'
  }
};
const MIN = {
  horizontal: 140,
  carre: 64,
  rond: 16
};
const PLI = {
  horizontal: 102 / 1470,
  carre: 170 / 1120,
  rond: 143 / 1000
};
/** Logo Studio Mille Pages, depuis les SVG de production. Jamais étiré, ni ombre ni contour. */
function Logo({
  variant = 'horizontal',
  tone = 'couleur',
  width,
  base = 'assets/logos/',
  protect = false,
  alt = 'Studio Mille Pages',
  style
}) {
  const w = Math.max(width || (variant === 'horizontal' ? 320 : variant === 'carre' ? 200 : 64), MIN[variant]);
  const pad = protect ? Math.round(w * PLI[variant]) : 0;
  return React.createElement('span', {
    style: {
      display: 'inline-block',
      padding: pad,
      lineHeight: 0,
      ...style
    }
  }, React.createElement('img', {
    src: base + FILES[variant][tone],
    alt,
    width: w,
    style: {
      display: 'block',
      width: w,
      height: 'auto'
    }
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Plis.jsx
try { (() => {
const ORDER = ['haricot', 'haricot-2', 'boucle-dor', 'boucle-dor-2', 'violet', 'violet-2'];
const MONO = {
  encre: ['var(--encre)', 'var(--pli-encre-2)'],
  lait: ['var(--pot-au-lait)', 'var(--pli-lait-2)']
};
const W = 34,
  H = 48,
  O = 6;
/** Le motif du pli : six plis (ou une paire, ou un pli seul), géométrie du logo (34 × 48, décalage 6, pente 10°). */
function Plis({
  height = 24,
  tone = 'couleur',
  pair,
  single = false,
  animate = false,
  hidden = false,
  play = 0,
  title,
  style,
  ...rest
}) {
  let idx = [0, 1, 2, 3, 4, 5];
  if (pair) {
    const s = ORDER.indexOf(pair);
    idx = single ? [s] : [s, s + 1];
  }
  const w = idx.length * W;
  const polys = idx.map((i, k) => {
    const x = k * W,
      first = i % 2 === 0;
    const pts = first ? [x, 0, x + W, O, x + W, H, x, H - O] : [x, O, x + W, 0, x + W, H - O, x, H];
    const fill = tone === 'couleur' ? 'var(--' + ORDER[i] + ')' : MONO[tone][i % 2];
    const st = {
      transformBox: 'fill-box',
      transformOrigin: 'left center'
    };
    if (hidden && !animate) {
      st.opacity = 0;
    }
    if (animate) {
      st.animation = 'smp-pli-deplie .1s var(--ease-plis) ' + (k * 0.06).toFixed(2) + 's both';
    }
    return React.createElement('polygon', {
      key: k + '-' + play,
      points: pts.join(' '),
      fill,
      style: st
    });
  });
  return React.createElement('svg', {
    'data-smp-plis': '',
    viewBox: '0 0 ' + w + ' ' + H,
    width: height * w / H,
    height,
    role: title ? 'img' : undefined,
    'aria-hidden': title ? undefined : true,
    'aria-label': title,
    style: {
      display: 'block',
      flex: 'none',
      ...style
    },
    ...rest
  }, polys);
}
Object.assign(__ds_scope, { Plis });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Plis.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
const V = {
  'boucle-dor': ['var(--boucle-dor)', 'var(--boucle-dor-2)', 'var(--encre)', 'var(--encre)'],
  haricot: ['var(--haricot)', 'var(--haricot-2)', 'var(--encre)', 'var(--encre)'],
  violet: ['var(--violet)', 'var(--violet-2)', 'var(--encre)', 'var(--encre)'],
  encre: ['var(--encre)', 'var(--encre-hover)', 'var(--pot-au-lait)', 'var(--pot-au-lait)'],
  lait: ['var(--pot-au-lait)', 'var(--blanc)', 'var(--encre)', 'var(--encre)'],
  ghost: ['transparent', 'var(--encre)', 'var(--encre)', 'var(--pot-au-lait)']
};
/** Pastille pleine Pacaembu Bold ; au survol l'aplat passe au pli voisin (0,15 s). */
function Button({
  children,
  variant = 'boucle-dor',
  size = 'md',
  href,
  arrow = false,
  plis = false,
  disabled = false,
  type = 'button',
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  const [n, setN] = React.useState(0);
  const v = V[variant] || V['boucle-dor'];
  const on = h && !disabled;
  const sm = size === 'sm';
  const ghost = variant === 'ghost';
  const st = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: sm ? 14.5 : 16,
    lineHeight: 1.2,
    padding: ghost ? sm ? '9.5px 22px' : '13.5px 28px' : sm ? '11px 22px' : '15px 28px',
    borderRadius: 'var(--radius-pastille)',
    background: on ? v[1] : v[0],
    color: on ? v[3] : v[2],
    border: ghost ? '1.5px solid ' + (on ? 'var(--encre)' : 'rgba(83,71,65,.25)') : '0',
    textDecoration: 'none',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? .4 : 1,
    transition: 'background .15s ease,color .15s ease,border-color .15s ease',
    ...style
  };
  const enter = () => {
    setH(true);
    setN(x => x + 1);
  };
  const props = {
    style: st,
    onMouseEnter: enter,
    onMouseLeave: () => setH(false),
    onFocus: enter,
    onBlur: () => setH(false),
    onClick: disabled ? undefined : onClick
  };
  const inner = [children, arrow ? React.createElement('span', {
    key: 'a',
    'aria-hidden': true,
    style: {
      transition: 'transform .18s var(--ease)',
      transform: on ? 'translateX(4px)' : 'none'
    }
  }, '→') : null];
  const el = href && !disabled ? React.createElement('a', {
    href,
    ...props
  }, ...inner) : React.createElement('button', {
    type,
    disabled,
    ...props
  }, ...inner);
  if (!plis) return el;
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6
    }
  }, el, React.createElement(__ds_scope.Plis, {
    height: 10,
    animate: on,
    hidden: !on,
    play: n
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/TextLink.jsx
try { (() => {
/** Lien Encre souligné ; au survol, une bande de six plis se déplie dessous. Variante nav et variante « suite → ». */
function TextLink({
  children,
  href = '#',
  variant = 'inline',
  active = false,
  tone = 'encre',
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  const [n, setN] = React.useState(0);
  const nav = variant === 'nav',
    more = variant === 'more';
  const color = tone === 'lait' ? 'var(--pot-au-lait)' : 'var(--encre)';
  const enter = () => {
    setH(true);
    setN(x => x + 1);
  };
  const open = nav && active;
  const st = {
    position: 'relative',
    display: nav || more ? 'inline-flex' : 'inline',
    alignItems: 'center',
    gap: 7,
    color,
    fontFamily: 'var(--font-sans)',
    fontWeight: nav || more ? 700 : 'inherit',
    fontSize: nav ? 15.5 : more ? 14.5 : 'inherit',
    textDecoration: nav ? 'none' : 'underline',
    textUnderlineOffset: '.18em',
    textDecorationThickness: '1.5px',
    paddingBottom: nav ? 8 : 0,
    cursor: 'pointer',
    transition: 'color .15s ease',
    ...style
  };
  const kids = [children];
  if (more) kids.push(React.createElement('span', {
    key: 'a',
    'aria-hidden': true,
    style: {
      transition: 'transform .18s var(--ease)',
      transform: h ? 'translateX(5px)' : 'none'
    }
  }, '→'));
  if (nav || more) kids.push(React.createElement('span', {
    key: 'p',
    style: {
      position: 'absolute',
      left: 0,
      bottom: nav ? -4 : -12
    }
  }, React.createElement(__ds_scope.Plis, {
    height: nav ? 10 : 8,
    tone: tone === 'lait' ? 'lait' : 'couleur',
    animate: h && !open,
    hidden: !(h || open),
    play: n
  })));
  return React.createElement('a', {
    href,
    onClick,
    onMouseEnter: enter,
    onMouseLeave: () => setH(false),
    onFocus: enter,
    onBlur: () => setH(false),
    'aria-current': active ? 'page' : undefined,
    style: st
  }, ...kids);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/content/Badge.jsx
try { (() => {
/** Mention courte en pastille Boucle d'Or, capitales (ex. « Offre principale »). */
function Badge({
  children,
  tone = 'boucle-dor',
  style
}) {
  const bg = tone === 'blanc' ? 'var(--blanc)' : 'var(--' + tone + ')';
  return React.createElement('span', {
    style: {
      display: 'inline-block',
      background: bg,
      color: 'var(--encre)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: 11.5,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-pastille)',
      padding: '4px 11px 3px',
      lineHeight: 1.35,
      verticalAlign: 'middle',
      border: tone === 'blanc' ? '1px solid var(--filet)' : 0,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
/** Carte : fond blanc ou Pot au Lait, filet 1 px, sans ombre, rayon radius-carte. */
function Card({
  children,
  surface = 'blanc',
  padding = 34,
  plis = false,
  as = 'div',
  style
}) {
  return React.createElement(as, {
    style: {
      background: surface === 'lait' ? 'var(--pot-au-lait)' : 'var(--blanc)',
      border: '1px solid var(--filet)',
      borderRadius: 'var(--radius-carte)',
      padding,
      color: 'var(--encre)',
      boxSizing: 'border-box',
      ...style
    }
  }, children, plis ? React.createElement('div', {
    style: {
      marginTop: 24
    }
  }, React.createElement(__ds_scope.Plis, {
    height: 16
  })) : null);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/Facts.jsx
try { (() => {
/** Fiche projet : intitulés en capitales discrètes, réponses en texte courant. */
function Facts({
  items = [],
  style
}) {
  const kids = [];
  items.forEach(([k, v], i) => {
    kids.push(React.createElement('dt', {
      key: 't' + i,
      style: {
        fontWeight: 800,
        fontSize: 11.5,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginTop: i ? 14 : 0
      }
    }, k));
    kids.push(React.createElement('dd', {
      key: 'd' + i,
      style: {
        margin: '3px 0 0',
        fontSize: 16,
        lineHeight: 1.6,
        color: 'var(--encre-90)'
      }
    }, v));
  });
  return React.createElement('dl', {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, kids);
}
Object.assign(__ds_scope, { Facts });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Facts.jsx", error: String((e && e.message) || e) }); }

// components/content/Panel.jsx
try { (() => {
const T = {
  encre: ['var(--encre)', 'var(--pot-au-lait)'],
  haricot: ['var(--haricot)', 'var(--encre)'],
  'boucle-dor': ['var(--boucle-dor)', 'var(--encre)'],
  violet: ['var(--violet)', 'var(--encre)'],
  'violet-2': ['var(--violet-2)', 'var(--encre)']
};
/** Aplat de section : Encre (texte lait) ou couleur d'un pli (texte Encre uniquement). */
function Panel({
  children,
  tone = 'encre',
  bleed = false,
  padding,
  as = 'section',
  style
}) {
  const t = T[tone] || T.encre;
  return React.createElement(as, {
    style: {
      background: t[0],
      color: t[1],
      borderRadius: bleed ? 0 : 'var(--radius-panneau)',
      padding: padding ?? (bleed ? 'var(--space-6) var(--gutter)' : 56),
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Panel.jsx", error: String((e && e.message) || e) }); }

// components/content/Step.jsx
try { (() => {
const C = ['var(--haricot)', 'var(--boucle-dor)', 'var(--violet)', 'var(--violet-2)'];
/** Étape numérotée : pastille dans la couleur des plis (chiffre Encre 22 px), titre, texte. */
function Step({
  n = 1,
  title,
  children,
  style
}) {
  return React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: '52px minmax(0,1fr)',
      gap: 18,
      alignItems: 'start',
      ...style
    }
  }, React.createElement('span', {
    'aria-hidden': true,
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-pastille)',
      background: C[(n - 1) % 4],
      color: 'var(--encre)',
      fontWeight: 800,
      fontSize: 22
    }
  }, n), React.createElement('div', null, React.createElement('h3', {
    style: {
      fontSize: 19,
      fontWeight: 800,
      lineHeight: 1.3,
      margin: '4px 0 6px',
      letterSpacing: '-.01em'
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 16,
      lineHeight: 1.6
    }
  }, children)));
}
Object.assign(__ds_scope, { Step });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Step.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
/** Étiquette de nature de support (« Livrets pédagogiques »), pastille blanche à filet, non cliquable. */
function Tag({
  children,
  style
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-block',
      border: '1.5px solid var(--filet-fort)',
      borderRadius: 'var(--radius-pastille)',
      padding: '6px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 14.5,
      fontWeight: 600,
      lineHeight: 1.4,
      background: 'var(--blanc)',
      color: 'var(--encre)',
      ...style
    }
  }, children);
}
function TagList({
  items = [],
  style
}) {
  return React.createElement('ul', {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px 10px',
      ...style
    }
  }, items.map((t, i) => React.createElement('li', {
    key: i
  }, React.createElement(Tag, null, t))));
}
Object.assign(__ds_scope, { Tag, TagList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
const base = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 'var(--radius-champ)',
  padding: '13px 14px',
  fontFamily: 'var(--font-sans)',
  fontSize: 16,
  color: 'var(--encre)',
  transition: 'border-color .15s ease,background .15s ease',
  outline: 'none'
};
function useFocus() {
  const [f, setF] = React.useState(false);
  const [h, setH] = React.useState(false);
  return [{
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, {
    border: '1.5px solid ' + (f ? 'var(--violet)' : h ? 'rgba(83,71,65,.4)' : 'rgba(83,71,65,.2)'),
    background: f ? 'var(--blanc)' : 'var(--pot-au-lait)'
  }];
}
/** Champ de formulaire : libellé + contrôle. */
function Field({
  label,
  children,
  hint,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'block',
      fontFamily: 'var(--font-sans)',
      color: 'var(--encre)',
      ...style
    }
  }, React.createElement('span', {
    style: {
      display: 'block',
      fontWeight: 600,
      fontSize: 14.5,
      marginBottom: 8
    }
  }, label), children, hint ? React.createElement('span', {
    style: {
      display: 'block',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, hint) : null);
}
function Input({
  style,
  ...rest
}) {
  const [ev, st] = useFocus();
  return React.createElement('input', {
    ...rest,
    ...ev,
    style: {
      ...base,
      ...st,
      ...style
    }
  });
}
function Textarea({
  rows = 5,
  style,
  ...rest
}) {
  const [ev, st] = useFocus();
  return React.createElement('textarea', {
    rows,
    ...rest,
    ...ev,
    style: {
      ...base,
      ...st,
      lineHeight: 1.6,
      resize: 'vertical',
      ...style
    }
  });
}
function Select({
  options = [],
  style,
  ...rest
}) {
  const [ev, st] = useFocus();
  const chev = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='9'><path d='M1 1l6 6 6-6' fill='none' stroke='%23534741' stroke-width='1.6' stroke-linecap='round'/></svg>\")";
  return React.createElement('select', {
    ...rest,
    ...ev,
    style: {
      ...base,
      ...st,
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundImage: chev,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 16px center',
      paddingRight: 40,
      ...style
    }
  }, options.map((o, i) => React.createElement('option', {
    key: i
  }, o)));
}
Object.assign(__ds_scope, { Field, Input, Textarea, Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterChip.jsx
try { (() => {
/** Filtre en pastille à contour ; actif : aplat Encre, texte Pot au Lait. */
function FilterChip({
  children,
  active = false,
  count,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  return React.createElement('button', {
    type: 'button',
    onClick,
    'aria-pressed': active,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      border: '1.5px solid ' + (active || h ? 'var(--encre)' : 'rgba(83,71,65,.2)'),
      borderRadius: 'var(--radius-pastille)',
      padding: '7.5px 18px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 14,
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      background: active ? 'var(--encre)' : h ? 'var(--blanc)' : 'transparent',
      color: active ? 'var(--pot-au-lait)' : 'var(--encre)',
      transition: 'background .15s ease,color .15s ease,border-color .15s ease',
      ...style
    }
  }, children, count != null ? React.createElement('span', {
    style: {
      opacity: .7,
      fontWeight: 500,
      marginLeft: 6
    }
  }, count) : null);
}
Object.assign(__ds_scope, { FilterChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterChip.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pager.jsx
try { (() => {
function B({
  children,
  on,
  disabled,
  onClick,
  label
}) {
  const [h, setH] = React.useState(false);
  return React.createElement('button', {
    type: 'button',
    disabled,
    onClick,
    'aria-label': label,
    'aria-current': on ? 'page' : undefined,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      minWidth: 42,
      height: 42,
      padding: '0 14px',
      borderRadius: 'var(--radius-pastille)',
      border: '1.5px solid ' + (on ? 'var(--boucle-dor)' : h && !disabled ? 'var(--encre)' : 'rgba(83,71,65,.2)'),
      background: on ? 'var(--boucle-dor)' : h && !disabled ? 'var(--blanc)' : 'transparent',
      color: 'var(--encre)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 14.5,
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? .35 : 1,
      transition: 'background .15s ease,border-color .15s ease'
    }
  }, children);
}
/** Pagination en pastilles ; page courante en Boucle d'Or. */
function Pager({
  page = 1,
  pages = 3,
  onChange = () => {},
  style
}) {
  const nums = Array.from({
    length: pages
  }, (_, i) => i + 1);
  return React.createElement('nav', {
    'aria-label': 'Pages',
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      ...style
    }
  }, React.createElement(B, {
    label: 'Page précédente',
    disabled: page <= 1,
    onClick: () => onChange(page - 1)
  }, '←'), nums.map(n => React.createElement(B, {
    key: n,
    on: n === page,
    onClick: () => onChange(n)
  }, n)), React.createElement(B, {
    label: 'Page suivante',
    disabled: page >= pages,
    onClick: () => onChange(page + 1)
  }, '→'));
}
Object.assign(__ds_scope, { Pager });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pager.jsx", error: String((e && e.message) || e) }); }

// components/type/Kicker.jsx
try { (() => {
/** Surtitre : capitales Pacaembu, interlettrage 2,6 px, éventuellement précédé d'un pli isolé. */
function Kicker({
  children,
  pli,
  as = 'p',
  tone = 'encre',
  style
}) {
  return React.createElement(as, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      margin: '0 0 18px',
      fontFamily: 'var(--font-sans)',
      fontWeight: 700,
      fontSize: 'var(--size-kicker)',
      letterSpacing: 'var(--tracking-kicker)',
      textTransform: 'uppercase',
      lineHeight: 1.3,
      color: tone === 'lait' ? 'var(--pot-au-lait)' : 'var(--encre)',
      ...style
    }
  }, pli ? React.createElement(__ds_scope.Plis, {
    pair: pli,
    single: true,
    height: 14
  }) : null, children);
}
Object.assign(__ds_scope, { Kicker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/Kicker.jsx", error: String((e && e.message) || e) }); }

// components/type/RomanNumeral.jsx
try { (() => {
const C = {
  1: 'var(--haricot)',
  2: 'var(--boucle-dor-2)',
  3: 'var(--violet)',
  4: 'var(--haricot-2)'
};
const R = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];
/** Chiffre romain des offres et grandes sections, IM Fell English romain, dans la couleur des plis. */
function RomanNumeral({
  n = 1,
  tone,
  size,
  style
}) {
  const color = tone === 'encre' ? 'var(--encre)' : tone === 'lait' ? 'var(--pot-au-lait)' : C[n] || 'var(--encre)';
  return React.createElement('span', {
    'aria-hidden': true,
    style: {
      display: 'block',
      fontFamily: 'var(--font-serif)',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: size || 'var(--size-roman)',
      lineHeight: .85,
      letterSpacing: '.01em',
      color,
      ...style
    }
  }, R[n] || String(n));
}
Object.assign(__ds_scope, { RomanNumeral });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/RomanNumeral.jsx", error: String((e && e.message) || e) }); }

// components/type/SectionTitle.jsx
try { (() => {
/** Titre de section Pacaembu Black ; la bande de plis se déplie une fois à son apparition. */
function SectionTitle({
  children,
  as = 'h2',
  plis = true,
  align = 'left',
  tone = 'encre',
  size,
  style
}) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!plis) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, {
      threshold: .4
    });
    io.observe(el);
    return () => io.disconnect();
  }, [plis]);
  const color = tone === 'lait' ? 'var(--pot-au-lait)' : 'var(--encre)';
  return React.createElement('div', {
    ref,
    style: {
      marginBottom: 36,
      textAlign: align,
      ...style
    }
  }, React.createElement(as, {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontWeight: 800,
      fontSize: size || 'var(--size-section)',
      lineHeight: 'var(--leading-title)',
      letterSpacing: 'var(--tracking-title)',
      color,
      textWrap: 'balance'
    }
  }, children), plis ? React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      marginTop: 16
    }
  }, React.createElement(__ds_scope.Plis, {
    height: 18,
    tone: tone === 'lait' ? 'lait' : 'couleur',
    animate: seen,
    hidden: !seen
  })) : null);
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/type/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Accueil.jsx
try { (() => {
(() => {
  const {
    Kicker,
    SectionTitle,
    RomanNumeral,
    Button,
    TextLink,
    Badge,
    Plis,
    Panel
  } = window.SMP;
  const wrap = window.kitWrap;
  const offres = [[1, 'Supports pédagogiques et médiation', "Pour les collectivités, les lieux culturels et les écoles\u00a0: du livret au panneau d'exposition.", 'mediation', true], [2, 'Papeterie personnalisée', 'Pour les particuliers\u00a0: faire-part, cartes et objets imprimés de famille.', 'papeterie'], [3, 'Jeux de société', 'Pour les éditeurs, les structures culturelles et éducatives\u00a0: cartes, règles, boîtes et éléments de jeu.', 'jeux'], [4, 'Livres et ouvrages', 'Pour les associations et les familles\u00a0: livres, catalogues, recueils.', 'livres']];
  const puces = ['haricot', 'boucle-dor', 'violet'];
  function Accueil({
    go
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        maxWidth: 1160,
        textAlign: 'center',
        paddingTop: 104,
        paddingBottom: 64
      }
    }, /*#__PURE__*/React.createElement(Kicker, {
      style: {
        justifyContent: 'center'
      }
    }, "Maud Lenoir \xB7 designer \xE9ditoriale et maquettiste"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 42,
        lineHeight: 1.12,
        letterSpacing: '-.022em',
        fontWeight: 800,
        maxWidth: '25.6em',
        margin: '0 auto',
        textWrap: 'balance'
      }
    }, "Je mets en pages livrets, ouvrages et papeterie,", /*#__PURE__*/React.createElement("br", null), "de la petite\xA0carte \xE0\xA0la grande\xA0cimaise."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 24,
        color: 'var(--encre-80)',
        margin: '16px 0 0'
      }
    }, "Pour les structures et les familles."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 300,
        fontSize: 22,
        margin: '26px 0 0'
      }
    }, "Bas\xE9e \xE0 Rouen, disponible partout en France."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        marginTop: 34
      }
    }, /*#__PURE__*/React.createElement(Button, {
      href: "#studio",
      onClick: e => {
        e.preventDefault();
        go('studio');
      }
    }, "Voir le studio"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      href: "#contact",
      onClick: e => {
        e.preventDefault();
        go('contact');
      }
    }, "Parler d'un projet"))), /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingTop: 96,
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, null, "Mes offres"), /*#__PURE__*/React.createElement("ol", {
      style: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
        gap: 36
      }
    }, offres.map(([n, t, d, id, main]) => /*#__PURE__*/React.createElement("li", {
      key: n,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(RomanNumeral, {
      n: n,
      style: {
        marginBottom: 14
      }
    }), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 23,
        lineHeight: 1.2,
        fontWeight: 800,
        letterSpacing: '-.01em',
        margin: '0 0 10px'
      }
    }, t, main ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'table',
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement(Badge, null, "Offre principale")) : null), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 300,
        fontSize: 17,
        lineHeight: 1.55,
        margin: '0 0 14px',
        flex: 1
      }
    }, d), /*#__PURE__*/React.createElement(TextLink, {
      variant: "more",
      href: '#studio',
      onClick: e => {
        e.preventDefault();
        go('studio');
      }
    }, "En savoir plus"))))), /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingTop: 96,
        paddingBottom: 96
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,320px) minmax(0,1fr)',
        gap: 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/photos/portrait-maud.webp",
      alt: "Portrait de Maud Lenoir sous les arcades d'un clo\xEEtre",
      style: {
        width: '100%',
        aspectRatio: '4/5',
        objectFit: 'cover',
        borderRadius: 6,
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
      plis: false,
      style: {
        marginBottom: 24
      }
    }, "Mon parcours"), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: 'none',
        padding: 0,
        margin: '0 0 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        fontSize: 18,
        fontWeight: 300,
        lineHeight: 1.5,
        maxWidth: '46ch'
      }
    }, [/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 700
      }
    }, "Deux fois majore de promotion"), ", en design puis en commerce connect\xE9."), "Un an chargée de communication à l'Agglomération Fécamp Caux Littoral.", "En master de littérature d'enfance et de jeunesse à l'université d'Artois."].map((t, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(Plis, {
      pair: puces[i],
      single: true,
      height: 16,
      style: {
        marginTop: 6
      }
    }), /*#__PURE__*/React.createElement("span", null, t)))), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      arrow: true
    }, "D\xE9couvrir mon parcours")))), /*#__PURE__*/React.createElement(Panel, {
      tone: "boucle-dor",
      bleed: true,
      style: {
        textAlign: 'center',
        padding: '88px 40px'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 46,
        lineHeight: 1.06,
        letterSpacing: '-.025em',
        fontWeight: 800,
        margin: '0 0 26px'
      }
    }, "Parlons de votre projet."), /*#__PURE__*/React.createElement(Button, {
      variant: "encre",
      href: "#contact",
      onClick: e => {
        e.preventDefault();
        go('contact');
      }
    }, "Parler d'un projet")));
  }
  Object.assign(window, {
    Accueil
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Accueil.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Chrome.jsx
try { (() => {
(() => {
  const {
    Logo,
    TextLink
  } = window.SMP;
  const wrap = {
    maxWidth: 1080,
    margin: '0 auto',
    padding: '0 40px',
    boxSizing: 'border-box'
  };
  function Header({
    page,
    go
  }) {
    const l = (p, t) => /*#__PURE__*/React.createElement(TextLink, {
      variant: "nav",
      href: '#' + p,
      active: page === p,
      onClick: e => {
        e.preventDefault();
        go(p);
      }
    }, t);
    return /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("nav", {
      "aria-label": "Navigation principale",
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 48,
        maxWidth: 1080,
        margin: '0 auto',
        padding: '28px 40px 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        justifySelf: 'end'
      }
    }, l('studio', 'Le studio')), /*#__PURE__*/React.createElement("a", {
      href: "#accueil",
      onClick: e => {
        e.preventDefault();
        go('accueil');
      },
      "aria-label": "Studio Mille Pages, accueil",
      style: {
        lineHeight: 0
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      base: "../../assets/logos/",
      width: 320
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        justifySelf: 'start'
      }
    }, l('contact', 'Contact'))));
  }
  function Footer({
    go
  }) {
    const h = {
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--boucle-dor)',
      margin: '0 0 4px'
    };
    const col = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 10,
      fontSize: 14.5
    };
    const nl = (p, t) => /*#__PURE__*/React.createElement(TextLink, {
      variant: "nav",
      tone: "lait",
      href: '#' + p,
      onClick: e => {
        e.preventDefault();
        go(p);
      },
      style: {
        fontSize: 14.5,
        fontWeight: 500
      }
    }, t);
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: 'var(--encre)',
        color: 'var(--pot-au-lait)',
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '34px 48px',
        padding: '54px 40px',
        maxWidth: 1080,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 280,
        fontSize: 14,
        lineHeight: 1.6,
        color: 'var(--lait-80)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      tone: "lait",
      base: "../../assets/logos/",
      width: 240
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "Le studio de Maud Lenoir, designer \xE9ditoriale et maquettiste."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '10px 0 0'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "mailto:bonjour@mythesetmarmites.fr",
      style: {
        color: 'var(--pot-au-lait)'
      }
    }, "bonjour@mythesetmarmites.fr"))), /*#__PURE__*/React.createElement("nav", {
      style: col,
      "aria-label": "Navigation du pied de page"
    }, /*#__PURE__*/React.createElement("p", {
      style: h
    }, "Le site"), nl('studio', 'Le studio'), nl('accueil', 'Parcours'), nl('contact', 'Contact')), /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("p", {
      style: h
    }, "Hors collection"), nl('accueil', 'À table, le blog'), nl('accueil', 'Le jeu')), /*#__PURE__*/React.createElement("div", {
      style: {
        ...col,
        gap: 0,
        maxWidth: 270,
        fontSize: 13.5,
        lineHeight: 1.65,
        color: 'var(--lait-80)'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        ...h,
        marginBottom: 10
      }
    }, "Colophon"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "Conception et textes\xA0: Maud Lenoir.", /*#__PURE__*/React.createElement("br", null), "Compos\xE9 en Pacaembu, chiffres romains en IM Fell English."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '10px 0 0',
        fontWeight: 300,
        fontSize: 16,
        color: 'var(--boucle-dor)'
      }
    }, "\xAB Raconter de belles histoires. \xBB"))));
  }
  Object.assign(window, {
    Header,
    Footer,
    kitWrap: wrap
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Contact.jsx
try { (() => {
(() => {
  const {
    Kicker,
    SectionTitle,
    Button,
    Card,
    Field,
    Input,
    Select,
    Textarea
  } = window.SMP;
  const wrap = window.kitWrap;
  function Contact({
    go
  }) {
    const [sent, setSent] = React.useState(false);
    if (sent) return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        textAlign: 'center',
        padding: '120px 40px 100px'
      }
    }, /*#__PURE__*/React.createElement(Kicker, {
      style: {
        justifyContent: 'center'
      }
    }, "C'est bien arriv\xE9"), /*#__PURE__*/React.createElement(SectionTitle, {
      align: "center",
      style: {
        maxWidth: '18ch',
        margin: '0 auto 18px'
      }
    }, "Je vous lis, et je vous r\xE9ponds."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 300,
        fontSize: 22,
        lineHeight: 1.5,
        maxWidth: '34ch',
        margin: '0 auto 36px'
      }
    }, "Sous deux jours ouvr\xE9s."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "encre",
      onClick: () => go('studio')
    }, "Voir le studio"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => go('accueil')
    }, "Revenir \xE0 l'accueil")));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        paddingTop: 88,
        paddingBottom: 72
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 60,
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 300
      }
    }, /*#__PURE__*/React.createElement(Kicker, null, "Contact"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 56,
        lineHeight: 1.07,
        fontWeight: 800,
        letterSpacing: '-.02em',
        margin: 0
      }
    }, "Racontez-moi."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 300,
        fontSize: 22,
        lineHeight: 1.5,
        margin: '22px 0 0',
        maxWidth: '34ch'
      }
    }, "Un livret, un livre, un faire-part\xA0: \xE9crivez-moi quelques lignes, m\xEAme si le projet est encore flou."), /*#__PURE__*/React.createElement("p", {
      style: {
        maxWidth: '46ch',
        margin: '22px 0 0'
      }
    }, "Si le projet ne me correspond pas, je vous le dis franchement et j'essaie de vous orienter.")), /*#__PURE__*/React.createElement(Card, {
      as: "form",
      padding: 38,
      style: {
        flex: 1,
        minWidth: 320
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      },
      onSubmit: e => e.preventDefault()
    }, /*#__PURE__*/React.createElement(Field, {
      label: "C'est \xE0 quel sujet ?"
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Un support pédagogique', 'De la papeterie personnalisée', 'Un jeu de société', 'Un livre ou un ouvrage', 'Autre']
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Vous \xEAtes"
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Votre nom, et votre structure s'il y en a une"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Votre e-mail"
    }, /*#__PURE__*/React.createElement(Input, {
      type: "email",
      placeholder: "vous@exemple.fr"
    })), /*#__PURE__*/React.createElement(Field, {
      label: "Le projet, en quelques lignes"
    }, /*#__PURE__*/React.createElement(Textarea, {
      placeholder: "Ce que vous avez, ce qu'il vous manque, et pour quand."
    })), /*#__PURE__*/React.createElement(Button, {
      onClick: e => {
        e.preventDefault();
        setSent(true);
      },
      style: {
        width: '100%'
      }
    }, "Envoyer"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        textAlign: 'center',
        fontSize: 13,
        color: 'var(--text-muted)'
      }
    }, "Vos coordonn\xE9es ne servent qu'\xE0 vous r\xE9pondre.")))));
  }
  Object.assign(window, {
    Contact
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/site/Studio.jsx
try { (() => {
(() => {
  const {
    Kicker,
    SectionTitle,
    RomanNumeral,
    Button,
    TextLink,
    Badge,
    TagList,
    Facts,
    Step
  } = window.SMP;
  const wrap = window.kitWrap;
  const P = '../../assets/photos/';
  const mini = {
    margin: '52px 0 22px',
    fontWeight: 700,
    fontSize: 12.5,
    letterSpacing: '2.6px',
    textTransform: 'uppercase'
  };
  const ph = {
    aspectRatio: '16/10',
    display: 'grid',
    placeItems: 'center',
    border: '1.5px dashed var(--filet-fort)',
    borderRadius: 6,
    background: 'var(--blanc)',
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--text-muted)'
  };
  function Project({
    media,
    title,
    facts,
    more
  }) {
    return /*#__PURE__*/React.createElement("article", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)',
        gap: 36,
        alignItems: 'start',
        marginBottom: 52
      }
    }, /*#__PURE__*/React.createElement("div", null, media), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      style: {
        fontSize: 24,
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: '-.01em',
        margin: '0 0 18px'
      }
    }, title), facts ? /*#__PURE__*/React.createElement(Facts, {
      items: facts
    }) : null, more ? /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 20
      }
    }, more) : null));
  }
  function Gallery({
    items,
    grid
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, items.map(([f, c], i) => /*#__PURE__*/React.createElement("figure", {
      key: f,
      style: {
        margin: 0,
        gridColumn: !grid && i === 0 ? '1/-1' : 'auto'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: P + f + '.webp',
      alt: c,
      style: {
        width: '100%',
        aspectRatio: !grid && i === 0 ? '1500/857' : '4/3',
        objectFit: 'cover',
        borderRadius: 6,
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("figcaption", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)',
        marginTop: 6
      }
    }, c))));
  }
  function Entry({
    n,
    id,
    title,
    badge,
    forTxt,
    kinds,
    children,
    refs = 'Références'
  }) {
    return /*#__PURE__*/React.createElement("section", {
      id: id,
      style: {
        ...wrap,
        paddingTop: 96,
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22,
        alignItems: 'flex-start',
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement(RomanNumeral, {
      n: n,
      style: {
        minWidth: '1.3em'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
      plis: false,
      style: {
        marginBottom: 10
      }
    }, title), badge ? /*#__PURE__*/React.createElement(Badge, null, badge) : null)), forTxt ? /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 300,
        fontSize: 23,
        lineHeight: 1.45,
        maxWidth: '46ch',
        margin: '0 0 22px'
      }
    }, forTxt) : null, /*#__PURE__*/React.createElement(TagList, {
      items: kinds,
      style: {
        marginBottom: 22
      }
    }), /*#__PURE__*/React.createElement("h3", {
      style: mini
    }, refs), children);
  }
  function Studio({
    go
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        paddingTop: 88,
        paddingBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Kicker, null, "Le studio"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 56,
        lineHeight: 1.07,
        fontWeight: 800,
        letterSpacing: '-.02em',
        maxWidth: '20ch',
        margin: 0,
        textWrap: 'balance'
      }
    }, "De la premi\xE8re maquette au fichier d'impression."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 300,
        fontSize: 22,
        lineHeight: 1.5,
        maxWidth: '54ch',
        margin: '22px 0 0'
      }
    }, "Je suis designer \xE9ditoriale et maquettiste. Je pars de votre charte graphique quand elle existe, ou je vous propose une direction typographique et de mise en page.")), /*#__PURE__*/React.createElement(Entry, {
      n: 1,
      id: "mediation",
      title: "Supports p\xE9dagogiques et m\xE9diation",
      badge: "Offre principale",
      forTxt: "Pour les collectivit\xE9s, les m\xE9diath\xE8ques, les mus\xE9es, les associations et les \xE9tablissements scolaires.",
      kinds: ['Livrets pédagogiques', 'Guides pour les familles', "Fiches d'activité", 'Livrets de visite', "Panneaux d'exposition"]
    }, /*#__PURE__*/React.createElement(Project, {
      media: /*#__PURE__*/React.createElement("img", {
        src: P + 'poules.webp',
        alt: "Guide de soins aux poules pondeuses : couverture orange et doubles pages int\xE9rieures illustr\xE9es",
        style: {
          width: '100%',
          borderRadius: 6,
          display: 'block'
        }
      }),
      title: "Guide de soins aux poules pondeuses",
      facts: [['Commanditaire', 'Agglomération Fécamp Caux Littoral'], ['La commande', "Un livret remis aux familles de l'agglomération qui adoptent des poules pondeuses."], ["Ce que j'ai fait", "Écriture des textes, maquette, fichiers d'impression, suivi du tirage."]]
    }), /*#__PURE__*/React.createElement(Project, {
      media: /*#__PURE__*/React.createElement(Gallery, {
        items: [['suede', 'Les carnets dépliés'], ['scandi', 'Le carnet Suède'], ['europe', 'Le carnet Europe centrale']]
      }),
      title: "Carnets de voyage p\xE9dagogiques",
      facts: [['Commanditaire', 'Scandinavan'], ['La commande', 'Une collection de carnets de voyage en leporello, un dépliant continu par pays.'], ["Ce que j'ai fait", 'Conception de la collection, maquette, choix du façonnage.']]
    })), /*#__PURE__*/React.createElement(Entry, {
      n: 2,
      id: "papeterie",
      title: "Papeterie personnalis\xE9e",
      refs: "R\xE9f\xE9rence",
      forTxt: "Pour les particuliers : des objets imprim\xE9s qui racontent une histoire de famille.",
      kinds: ['Faire-part de naissance', 'Faire-part de mariage', 'Cartes']
    }, /*#__PURE__*/React.createElement(Project, {
      media: /*#__PURE__*/React.createElement("div", {
        style: ph
      }, "Visuel \xE0 venir"),
      title: "S\xE9rie de cartes postales"
    })), /*#__PURE__*/React.createElement(Entry, {
      n: 3,
      id: "jeux",
      title: "Jeux de soci\xE9t\xE9",
      refs: "R\xE9f\xE9rence",
      forTxt: "Je con\xE7ois et mets en pages des jeux de soci\xE9t\xE9 et des jeux p\xE9dagogiques : cartes, r\xE8gles, bo\xEEtes et \xE9l\xE9ments de jeu.",
      kinds: ['Cartes à jouer', 'Livrets de règles', 'Boîtes et emballages', 'Éléments de jeu']
    }, /*#__PURE__*/React.createElement(Project, {
      media: /*#__PURE__*/React.createElement(Gallery, {
        grid: true,
        items: [['panier', 'Le panier en bois gravé'], ['cartes', 'Les cartes-contes'], ['jetons', 'Les jetons en bois gravé'], ['recettes', 'Le carnet de recettes-récits']]
      }),
      title: "Mythes & Marmites, jeu de r\xE9cit coop\xE9ratif",
      facts: [['Le projet', "Projet personnel, en collaboration avec l'illustratrice Christelle Louiset."], ["Ce que j'ai fait", 'Conception du jeu, règles, design graphique des 48 cartes, du carnet de recettes-récits, du panier et des jetons en bois gravé.'], ['Statut', "Prototype en test, à la recherche d'un éditeur."]],
      more: /*#__PURE__*/React.createElement(TextLink, {
        variant: "more",
        href: "#"
      }, "D\xE9couvrir le jeu")
    })), /*#__PURE__*/React.createElement(Entry, {
      n: 4,
      id: "livres",
      title: "Livres et ouvrages",
      kinds: ['Livres de famille', "Ouvrages d'associations", 'Catalogues', 'Recueils']
    }, /*#__PURE__*/React.createElement(Project, {
      media: /*#__PURE__*/React.createElement("div", {
        style: ph
      }, "Visuel \xE0 venir"),
      title: "Rapport d'activit\xE9 2024",
      facts: [['Commanditaire', 'Les Marteaux du Jardin, association de Saint-Malo'], ['La commande', "Le bilan annuel d'une association engagée dans le lien social et la transition écologique."]]
    })), /*#__PURE__*/React.createElement("section", {
      style: {
        ...wrap,
        paddingTop: 96,
        paddingBottom: 80
      }
    }, /*#__PURE__*/React.createElement(SectionTitle, null, "Comment je travaille"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
        gap: '30px 48px',
        marginBottom: 40
      }
    }, /*#__PURE__*/React.createElement(Step, {
      n: 1,
      title: "Vous m'\xE9crivez"
    }, "Quelques lignes suffisent. Je r\xE9ponds sous deux jours ouvr\xE9s."), /*#__PURE__*/React.createElement(Step, {
      n: 2,
      title: "On cadre le projet"
    }, "Format, volume et budget. Je fixe d\xE8s le d\xE9part le nombre de s\xE9ries de corrections et les d\xE9lais, puis je vous envoie un devis."), /*#__PURE__*/React.createElement(Step, {
      n: 3,
      title: "Je propose une premi\xE8re maquette"
    }, "Puis je l'ajuste avec vous, dans le cadre fix\xE9 au d\xE9part."), /*#__PURE__*/React.createElement(Step, {
      n: 4,
      title: "Je livre et je suis l'impression"
    }, "Fichiers d'impression, v\xE9rification du BAT avec l'imprimeur, suivi du tirage.")), /*#__PURE__*/React.createElement(Button, {
      href: "#contact",
      onClick: e => {
        e.preventDefault();
        go('contact');
      }
    }, "Parler d'un projet")));
  }
  Object.assign(window, {
    Studio
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/site/Studio.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Plis = __ds_scope.Plis;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Facts = __ds_scope.Facts;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Step = __ds_scope.Step;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.TagList = __ds_scope.TagList;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.FilterChip = __ds_scope.FilterChip;

__ds_ns.Pager = __ds_scope.Pager;

__ds_ns.Kicker = __ds_scope.Kicker;

__ds_ns.RomanNumeral = __ds_scope.RomanNumeral;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

})();
