export interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  color?: string; // defaults to from-node color
}

export const connections: Connection[] = [
  // Personaje → mecanismos core
  { id: 'p-conciencia',   from: 'conciencia',      to: 'percepcion',        label: 'construye' },
  { id: 'p-auto',         from: 'automatismo',     to: 'programas',         label: 'ejecuta' },
  { id: 'prog-creen',     from: 'programas',       to: 'creencias',         label: 'genera' },
  { id: 'creen-para',     from: 'creencias',       to: 'paradigmas',        label: 'forma' },
  { id: 'para-interp',    from: 'paradigmas',      to: 'interpretacion',    label: 'filtra' },
  { id: 'interp-perc',    from: 'interpretacion',  to: 'percepcion',        label: 'da forma a' },
  { id: 'mem-narr',       from: 'memoria',         to: 'narracion-retroactiva', label: 'alimenta' },
  { id: 'leng-interp',    from: 'lenguaje',        to: 'interpretacion',    label: 'estructura' },
  { id: 'rec-fractal',    from: 'recursividad',    to: 'el-fractal',        label: 'expresa' },
  { id: 'frec-barrera',   from: 'frecuencia-animica', to: 'barrera-frecuencial', label: 'define' },
  { id: 'micro-auto',     from: 'microinclinacion', to: 'automatismo',      label: 'sesga' },

  // Campo base — relaciones internas
  { id: 'campo-total',    from: 'el-campo',        to: 'totalidad',         label: 'es aspecto de' },
  { id: 'total-omni',     from: 'totalidad',       to: 'omnipotencialidad', label: 'emerge de' },
  { id: 'sep-limites',    from: 'separacion',      to: 'limites',           label: 'produce' },
  { id: 'fractal-cont',   from: 'el-fractal',      to: 'continuidad',       label: 'revela' },
  { id: 'omni-seminal',   from: 'omnipotencialidad', to: 'estado-seminal',  label: 'colapsa en' },
  { id: 'techo-innomb',   from: 'techo-conceptual', to: 'innombrable',      label: 'apunta a' },
  { id: 'presim-innomb',  from: 'pre-simbolico',   to: 'innombrable',       label: 'es' },

  // Tiempo — relaciones internas
  { id: 'det-posib',      from: 'determinismo-magico', to: 'posibilidades-infinitas', label: 'coexiste con' },
  { id: 'circ-ciclos',    from: 'tiempo-circular', to: 'ciclos-espiralados', label: 'genera' },
  { id: 'plantilla-circ', from: 'plantilla-triadica', to: 'tiempo-circular', label: 'describe' },
  { id: 'ritmo-ciclos',   from: 'ritmo',           to: 'ciclos-espiralados', label: 'articula' },
  { id: 'pasado-mem',     from: 'pasado-sesgo',    to: 'memoria',           label: 'distorsiona' },

  // Cuerpo — relaciones internas
  { id: 'neuro-dec',      from: 'neurocircuitos',  to: 'decision-7-segundos', label: 'precede a' },
  { id: 'chak-energia',   from: 'chakras',         to: 'energia-arriba-abajo', label: 'organiza' },
  { id: 'set-frec',       from: 'set-setting',     to: 'frecuencia-animica', label: 'establece' },

  // Pilares — relaciones internas
  { id: 'id-decision',    from: 'identidad',       to: 'decision',          label: 'requiere' },
  { id: 'det-libre',      from: 'determinismo',    to: 'libre-albedrio',    label: 'cuestiona' },
  { id: 'libre-dec',      from: 'libre-albedrio',  to: 'decision',          label: 'fundamenta' },

  // Sistemas ↔ Cuerpo
  { id: 'sys-chak',       from: 'siete-chakras',   to: 'chakras',           label: 'mapea' },
  { id: 'enteog-set',     from: 'enteogenos',      to: 'set-setting',       label: 'altera' },

  // Sistemas ↔ Mecanismos
  { id: 'gnosis-innomb',  from: 'gnosis-demiurgo', to: 'innombrable',       label: 'señala' },
  { id: 'ouro-recurs',    from: 'ouroboros',       to: 'recursividad',      label: 'simboliza' },
  { id: 'godel-techo',    from: 'markov-godel',    to: 'techo-conceptual',  label: 'prueba' },
  { id: 'barr-perc',      from: 'barrera-frecuencial', to: 'percepcion',    label: 'limita' },

  // Dominios ↔ Campo base
  { id: 'metaf-campo',    from: 'metafisica',      to: 'el-campo',          label: 'estudia' },
  { id: 'onto-sep',       from: 'ontologia',       to: 'separacion',        label: 'analiza' },
  { id: 'epist-techo',    from: 'epistemologia',   to: 'techo-conceptual',  label: 'delimita' },

  // Dominios ↔ Mecanismos
  { id: 'neuro-circ',     from: 'neurociencia',    to: 'neurocircuitos',    label: 'estudia' },
  { id: 'psico-prog',     from: 'psicologia',      to: 'programas',         label: 'describe' },
  { id: 'geo-fractal',    from: 'geometria-sagrada', to: 'el-fractal',      label: 'codifica' },
  { id: 'reson-frec',     from: 'resonancia-armonia', to: 'frecuencia-animica', label: 'explica' },

  // Social ↔ Mecanismos
  { id: 'careta-prog',    from: 'careta-sincera',  to: 'programas',         label: 'también es' },
  { id: 'decl-creen',     from: 'prog-declarada-interna', to: 'creencias',  label: 'separa' },
  { id: 'colec-campo',    from: 'colectivo',       to: 'el-campo',          label: 'es instancia de' },
  { id: 'estad-superv',   from: 'estatus',         to: 'supervivencia',     label: 'regula' },
  { id: 'espi-ident',     from: 'espiritualidad-camuflaje', to: 'identidad', label: 'refuerza' },

  // Cross-domain
  { id: 'det-auto',       from: 'determinismo',    to: 'automatismo',       label: 'implica' },
  { id: 'ia-paradigma',   from: 'ia',              to: 'paradigmas',        label: 'cuestiona' },
  { id: 'enteog-barr',    from: 'enteogenia',      to: 'barrera-frecuencial', label: 'disuelve' },
  { id: 'valis-campo',    from: 'valis',           to: 'el-campo',          label: 'es nombre de' },
  { id: 'nahual-freq',    from: 'nahual',          to: 'frecuencia-animica', label: 'es' },
];
