export type Category =
  | 'campo-base'
  | 'pilares'
  | 'mecanismos'
  | 'tiempo'
  | 'cuerpo'
  | 'sistemas'
  | 'social'
  | 'dominios';

export const CATEGORY_COLORS: Record<Category, string> = {
  'campo-base': '#d4a843',
  'pilares':    '#c45c4a',
  'mecanismos': '#4a8ec4',
  'tiempo':     '#4ac4b0',
  'cuerpo':     '#5ab878',
  'sistemas':   '#d4a843',
  'social':     '#9b6fd4',
  'dominios':   '#e07c3a',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  'campo-base': 'Campo Base',
  'pilares':    'Pilares Ilusorios',
  'mecanismos': 'Mecanismos del Personaje',
  'tiempo':     'Tiempo y Movimiento',
  'cuerpo':     'El Cuerpo y lo Biológico',
  'sistemas':   'Sistemas de Referencia',
  'social':     'Lo Social y Cultural',
  'dominios':   'Dominios de Conocimiento',
};

export interface MapNode {
  id: string;
  title: string;
  description: string;
  category: Category;
  x: number; // center of canvas at (2000, 2000)
  y: number;
  modes: string[];
}

// Center: personaje at (2000, 2000)
// World canvas: 4400 x 4000

export const nodes: MapNode[] = [

  // ── CAMPO BASE (dorado) — arriba, cerca del centro ──────────────────────
  {
    id: 'innombrable',
    title: 'Lo innombrable',
    description: 'Aquello que antecede a cualquier sistema simbólico. No puede ser capturado por el lenguaje sin dejar de ser lo que es.',
    category: 'campo-base', x: 2000, y: 1480, modes: ['metafisico'],
  },
  {
    id: 'pre-simbolico',
    title: 'Lo pre-simbólico',
    description: 'El estado anterior a la representación. La experiencia antes de que el lenguaje la fragmente en conceptos.',
    category: 'campo-base', x: 1780, y: 1420, modes: ['metafisico'],
  },
  {
    id: 'el-campo',
    title: 'El campo',
    description: 'El sustrato continuo del que emergen todos los fenómenos. No es una cosa, es la condición de posibilidad de las cosas.',
    category: 'campo-base', x: 2220, y: 1420, modes: ['metafisico'],
  },
  {
    id: 'totalidad',
    title: 'La totalidad',
    description: 'El todo que incluye al observador. No puede ser observado desde afuera porque no hay afuera.',
    category: 'campo-base', x: 2000, y: 1280, modes: ['metafisico'],
  },
  {
    id: 'el-fractal',
    title: 'El fractal',
    description: 'El patrón que se repite a todas las escalas. Lo micro contiene lo macro; lo local refleja lo global.',
    category: 'campo-base', x: 1820, y: 1550, modes: ['metafisico', 'sistemico'],
  },
  {
    id: 'continuidad',
    title: 'La continuidad',
    description: 'La realidad como flujo ininterrumpido. Las separaciones son cortes conceptuales en algo que no se divide.',
    category: 'campo-base', x: 2180, y: 1550, modes: ['metafisico'],
  },
  {
    id: 'limites',
    title: 'Los límites',
    description: 'Fronteras que el sistema traza para operar. No son hechos ontológicos sino operaciones funcionales.',
    category: 'campo-base', x: 1700, y: 1650, modes: ['metafisico', 'logico'],
  },
  {
    id: 'separacion',
    title: 'La separación como dinámica generadora',
    description: 'Sin diferencia no hay información. La ilusión de separación es el mecanismo por el que el todo se experimenta a sí mismo.',
    category: 'campo-base', x: 2300, y: 1650, modes: ['metafisico'],
  },
  {
    id: 'doble-negacion',
    title: 'La doble negación',
    description: 'Negar la negación no restituye lo original: produce algo nuevo. La dialéctica como motor de emergencia.',
    category: 'campo-base', x: 1820, y: 1360, modes: ['metafisico', 'logico'],
  },
  {
    id: 'techo-conceptual',
    title: 'El techo conceptual',
    description: 'El límite máximo de lo que un sistema de conceptos puede aprehender. Más allá solo hay señales.',
    category: 'campo-base', x: 2180, y: 1360, modes: ['metafisico', 'logico'],
  },
  {
    id: 'omnipotencialidad',
    title: 'La omnipotencialidad',
    description: 'El estado de pura potencia anterior a cualquier actualización. Todos los posibles coexistiendo sin colapsar.',
    category: 'campo-base', x: 2000, y: 1160, modes: ['metafisico'],
  },
  {
    id: 'estado-seminal',
    title: 'El estado seminal',
    description: 'La forma mínima que contiene toda la información del despliegue futuro. El origen como condensación máxima.',
    category: 'campo-base', x: 1700, y: 1280, modes: ['metafisico'],
  },

  // ── MECANISMOS DEL PERSONAJE (azul) — derecha ───────────────────────────
  {
    id: 'conciencia',
    title: 'Conciencia',
    description: 'El sistema que se vuelve transparente a sí mismo. No una cosa sino un proceso: el registro del registro.',
    category: 'mecanismos', x: 2580, y: 1880, modes: ['sistemico', 'metafisico'],
  },
  {
    id: 'automatismo',
    title: 'Automatismo',
    description: 'La mayor parte de la conducta ocurre sin deliberación consciente. El piloto automático es la norma, no la excepción.',
    category: 'mecanismos', x: 2720, y: 1980, modes: ['sistemico'],
  },
  {
    id: 'memoria',
    title: 'Memoria',
    description: 'El pasado reconstruido en el presente. Cada recuerdo es una interpretación, no una copia fiel.',
    category: 'mecanismos', x: 2620, y: 2100, modes: ['sistemico', 'temporal'],
  },
  {
    id: 'lenguaje',
    title: 'Lenguaje',
    description: 'El sistema que recorta la experiencia en unidades manejables. Habitar el lenguaje es habitar un modelo del mundo.',
    category: 'mecanismos', x: 2800, y: 1860, modes: ['sistemico', 'logico'],
  },
  {
    id: 'frecuencia-animica',
    title: 'Frecuencia anímica',
    description: 'El estado de base desde el que se procesa toda experiencia. Filtra qué percibimos y qué ignoramos.',
    category: 'mecanismos', x: 2660, y: 1740, modes: ['sistemico', 'energetico'],
  },
  {
    id: 'programas',
    title: 'Programas',
    description: 'Rutinas de respuesta instaladas por repetición. Operan de forma autónoma antes de que la conciencia pueda intervenir.',
    category: 'mecanismos', x: 2920, y: 2040, modes: ['sistemico'],
  },
  {
    id: 'creencias',
    title: 'Creencias',
    description: 'Hipótesis sobre la realidad tomadas como certezas. Organizan la percepción y filtran la experiencia.',
    category: 'mecanismos', x: 2840, y: 2180, modes: ['sistemico'],
  },
  {
    id: 'paradigmas',
    title: 'Paradigmas',
    description: 'Marcos que determinan qué preguntas son posibles. Invisible desde adentro, visible solo desde otro paradigma.',
    category: 'mecanismos', x: 2980, y: 1900, modes: ['sistemico', 'logico'],
  },
  {
    id: 'interpretacion',
    title: 'Interpretación',
    description: 'El acto de dar sentido. No hay percepción sin interpretación: ver es ya construir.',
    category: 'mecanismos', x: 2720, y: 2260, modes: ['sistemico'],
  },
  {
    id: 'percepcion',
    title: 'Percepción',
    description: 'La construcción activa del mundo sensible. El cerebro predice y confirma, no registra pasivamente.',
    category: 'mecanismos', x: 2560, y: 2200, modes: ['sistemico'],
  },
  {
    id: 'narracion-retroactiva',
    title: 'Narración retroactiva',
    description: 'La historia que el sistema se cuenta sobre lo que ya pasó. La coherencia se construye después del hecho.',
    category: 'mecanismos', x: 3060, y: 2000, modes: ['sistemico', 'temporal'],
  },
  {
    id: 'microinclinacion',
    title: 'Microinclinación',
    description: 'Pequeños sesgos acumulados que determinan la dirección sin que ninguno sea decisivo por sí solo.',
    category: 'mecanismos', x: 2960, y: 2200, modes: ['sistemico'],
  },
  {
    id: 'recursividad',
    title: 'Recursividad',
    description: 'El sistema que se aplica a sí mismo. El pensamiento pensándose, la observación observándose.',
    category: 'mecanismos', x: 2820, y: 1740, modes: ['sistemico', 'logico'],
  },

  // ── TIEMPO Y MOVIMIENTO (cyan) — izquierda ──────────────────────────────
  {
    id: 'tiempo-circular',
    title: 'Tiempo circular / remolino',
    description: 'El tiempo no como línea recta sino como espiral: regresa transformado. Los patrones se repiten en distintas escalas.',
    category: 'tiempo', x: 1400, y: 1960, modes: ['temporal', 'metafisico'],
  },
  {
    id: 'pasado-sesgo',
    title: 'Pasado como sesgo geométrico',
    description: 'El pasado no está "atrás" sino impreso en la geometría del presente. Es la forma que tiene el ahora.',
    category: 'tiempo', x: 1240, y: 2060, modes: ['temporal'],
  },
  {
    id: 'futuro-cortinas',
    title: 'Futuro como cortinas que se abren',
    description: 'El futuro no se construye: se descubre. Las posibilidades ya existen, se van revelando al avanzar.',
    category: 'tiempo', x: 1440, y: 2120, modes: ['temporal', 'metafisico'],
  },
  {
    id: 'determinismo-magico',
    title: 'Determinismo mágico',
    description: 'Todo está determinado y al mismo tiempo es incierto. La determinación opera a escalas que la conciencia no alcanza.',
    category: 'tiempo', x: 1300, y: 1840, modes: ['temporal', 'metafisico'],
  },
  {
    id: 'posibilidades-infinitas',
    title: 'Posibilidades infinitas',
    description: 'En cada momento existe un espacio de estados posibles. El colapso a uno de ellos es lo que llamamos presente.',
    category: 'tiempo', x: 1140, y: 1940, modes: ['temporal', 'metafisico'],
  },
  {
    id: 'ritmo',
    title: 'Ritmo',
    description: 'La pulsación fundamental. Todo sistema vivo opera en ciclos: contracción y expansión, activación y reposo.',
    category: 'tiempo', x: 1480, y: 1820, modes: ['temporal', 'energetico'],
  },
  {
    id: 'ciclos-espiralados',
    title: 'Ciclos espiralados',
    description: 'Cada vuelta del ciclo ocurre en un nivel distinto. La repetición es aparente: hay progresión dentro del patrón.',
    category: 'tiempo', x: 1320, y: 1720, modes: ['temporal'],
  },
  {
    id: 'plantilla-triadica',
    title: 'La plantilla triádica',
    description: 'Todo proceso tiene tres momentos: generativo (expansión), entrópico (disolución) y recombinatorio (síntesis).',
    category: 'tiempo', x: 1180, y: 2180, modes: ['temporal', 'logico'],
  },

  // ── EL CUERPO Y LO BIOLÓGICO (verde) — abajo ────────────────────────────
  {
    id: 'billones-celulas',
    title: '35 billones de células',
    description: 'El organismo como comunidad masiva de entidades con agencia propia. El "yo" es un convenio administrativo de este colectivo.',
    category: 'cuerpo', x: 2000, y: 2560, modes: ['sistemico'],
  },
  {
    id: 'neurocircuitos',
    title: 'Neurocircuitos',
    description: 'Vías consolidadas por uso repetido. Pensar lo mismo fortalece el circuito; la plasticidad exige esfuerzo sostenido.',
    category: 'cuerpo', x: 1820, y: 2640, modes: ['sistemico'],
  },
  {
    id: 'adn-no-codificante',
    title: 'ADN no codificante',
    description: 'El 98% del genoma sin función proteica conocida. Regula expresión, memoria evolutiva, respuesta al entorno.',
    category: 'cuerpo', x: 2180, y: 2640, modes: ['sistemico'],
  },
  {
    id: 'decision-7-segundos',
    title: 'La decisión 7 segundos antes',
    description: 'La actividad cerebral precede a la experiencia de decidir. La voluntad consciente es posterior al inicio del acto.',
    category: 'cuerpo', x: 2000, y: 2760, modes: ['sistemico', 'metafisico'],
  },
  {
    id: 'chakras',
    title: 'Chakras',
    description: 'Centros de procesamiento energético. Cada uno corresponde a un dominio de experiencia: supervivencia, relación, poder, amor, expresión, percepción, trascendencia.',
    category: 'cuerpo', x: 1780, y: 2760, modes: ['energetico'],
  },
  {
    id: 'energia-arriba-abajo',
    title: 'Energía arriba / abajo',
    description: 'El eje vertical del cuerpo como continuum entre lo instintivo (abajo) y lo transpersonal (arriba). La integración es la salud.',
    category: 'cuerpo', x: 2220, y: 2760, modes: ['energetico'],
  },
  {
    id: 'set-setting',
    title: 'Set and setting',
    description: 'El estado mental (set) y el contexto (setting) determinan la naturaleza de cualquier experiencia. El mismo estímulo produce efectos radicalmente distintos.',
    category: 'cuerpo', x: 1920, y: 2880, modes: ['sistemico', 'cultural'],
  },

  // ── PILARES ILUSORIOS (rojo) — abajo-derecha ────────────────────────────
  {
    id: 'identidad',
    title: 'Identidad',
    description: 'La historia que el sistema se cuenta sobre su propia continuidad. Convenio narrativo, no entidad fija.',
    category: 'pilares', x: 2680, y: 2440, modes: ['metafisico', 'sistemico'],
  },
  {
    id: 'importancia',
    title: 'Importancia',
    description: 'La jerarquía de relevancia que el sistema construye. Nada es importante en sí mismo: la importancia es asignada.',
    category: 'pilares', x: 2840, y: 2480, modes: ['metafisico'],
  },
  {
    id: 'proposito',
    title: 'Propósito',
    description: 'La dirección que el sistema se da a sí mismo. Narrativa motivacional que organiza la conducta hacia un horizonte.',
    category: 'pilares', x: 2620, y: 2580, modes: ['metafisico'],
  },
  {
    id: 'decision',
    title: 'Decisión',
    description: 'La sensación de elegir. El sistema genera esta experiencia post-hoc, como parte de la narrativa de agencia.',
    category: 'pilares', x: 2800, y: 2660, modes: ['metafisico', 'sistemico'],
  },
  {
    id: 'posesion',
    title: 'Posesión',
    description: 'La ilusión de que algo puede pertenecer a alguien. Operación cognitiva que extiende el límite del yo hacia los objetos.',
    category: 'pilares', x: 2960, y: 2420, modes: ['metafisico'],
  },
  {
    id: 'libre-albedrio',
    title: 'Libre albedrío',
    description: 'La experiencia de originar causas. Fenomenológicamente real, ontológicamente cuestionable.',
    category: 'pilares', x: 2900, y: 2300, modes: ['metafisico', 'logico'],
  },
  {
    id: 'determinismo',
    title: 'Determinismo',
    description: 'La hipótesis de que todo estado es consecuencia necesaria de estados anteriores. No niega la experiencia: explica su estructura.',
    category: 'pilares', x: 2760, y: 2320, modes: ['metafisico', 'logico'],
  },

  // ── SISTEMAS DE REFERENCIA (dorado) — arriba-derecha ────────────────────
  {
    id: 'cuadrado-pierce',
    title: 'Cuadrado de Pierce',
    description: 'Estructura lógica de cuatro posiciones que permite mapear relaciones de contradicción, contrariedad e implicación.',
    category: 'sistemas', x: 2680, y: 1500, modes: ['logico'],
  },
  {
    id: 'carta-natal',
    title: 'Carta natal',
    description: 'Mapa simbólico del momento de nacimiento. Sistema de correspondencias entre posiciones celestes y disposiciones del carácter.',
    category: 'sistemas', x: 2880, y: 1580, modes: ['sistemico'],
  },
  {
    id: 'cuatro-elementos',
    title: 'Cuatro elementos',
    description: 'Fuego, Agua, Tierra, Aire como principios de cualidad. Tipología de modos de manifestación de la energía.',
    category: 'sistemas', x: 2700, y: 1360, modes: ['energetico', 'logico'],
  },
  {
    id: 'siete-chakras',
    title: 'Siete chakras',
    description: 'Sistema de mapeo de la experiencia en siete dominios verticales. Herramienta de diagnosis y trabajo energético.',
    category: 'sistemas', x: 2900, y: 1460, modes: ['energetico'],
  },
  {
    id: 'eneagrama',
    title: 'Eneagrama',
    description: 'Nueve configuraciones de carácter como estrategias de supervivencia psíquica. Mapa de los sesgos del ego.',
    category: 'sistemas', x: 2860, y: 1360, modes: ['sistemico'],
  },
  {
    id: 'enteogenos',
    title: 'Enteógenos',
    description: 'Sustancias que alteran el filtro perceptivo habitual. Herramientas de acceso a estados no ordinarios de conciencia.',
    category: 'sistemas', x: 3040, y: 1580, modes: ['energetico', 'metafisico'],
  },
  {
    id: 'gnosis-demiurgo',
    title: 'Gnosis / Demiurgo',
    description: 'La distinción gnóstica entre el creador del mundo material (Demiurgo) y el principio espiritual verdadero. El cosmos como error o trampa.',
    category: 'sistemas', x: 3080, y: 1440, modes: ['metafisico'],
  },
  {
    id: 'valis',
    title: 'VALIS',
    description: 'Vast Active Living Intelligence System (Philip K. Dick). La inteligencia cósmica que se filtra a través de la materia ordinaria.',
    category: 'sistemas', x: 3140, y: 1680, modes: ['metafisico'],
  },
  {
    id: 'nahual',
    title: 'Nahual',
    description: 'En las tradiciones mesoamericanas, el alter ego o doble animal. El aspecto no-humano de la conciencia.',
    category: 'sistemas', x: 2980, y: 1700, modes: ['energetico', 'cultural'],
  },
  {
    id: 'markov-godel',
    title: 'Markov / Gödel',
    description: 'Markov: el estado siguiente depende solo del presente. Gödel: todo sistema suficientemente complejo contiene verdades que no puede demostrar.',
    category: 'sistemas', x: 3100, y: 1800, modes: ['logico'],
  },
  {
    id: 'ouroboros',
    title: 'Ouroboros',
    description: 'La serpiente que se muerde la cola. El sistema que se contiene a sí mismo; el ciclo sin origen ni fin.',
    category: 'sistemas', x: 2880, y: 1800, modes: ['metafisico', 'logico'],
  },
  {
    id: 'barrera-frecuencial',
    title: 'La barrera frecuencial',
    description: 'El límite de lo que un organismo puede percibir dado su estado de base. Cada estado habilita un rango de realidad.',
    category: 'sistemas', x: 2720, y: 1640, modes: ['energetico', 'sistemico'],
  },

  // ── LO SOCIAL Y CULTURAL (violeta) — abajo-izquierda ────────────────────
  {
    id: 'estatus',
    title: 'Estatus',
    description: 'La posición relativa en la jerarquía social. Opera como señal biológica que regula acceso a recursos y pareja.',
    category: 'social', x: 1360, y: 2460, modes: ['cultural', 'sistemico'],
  },
  {
    id: 'supervivencia',
    title: 'Supervivencia',
    description: 'El imperativo basal que organiza la mayor parte del comportamiento. La mayoría de las motivaciones son supervivencia disfrazada.',
    category: 'social', x: 1200, y: 2560, modes: ['cultural', 'sistemico'],
  },
  {
    id: 'espiritualidad-camuflaje',
    title: 'Espiritualidad como camuflaje del ego',
    description: 'El ego puede usar el vocabulario espiritual para reforzarse. "Soy muy consciente" es otra forma de estatus.',
    category: 'social', x: 1440, y: 2660, modes: ['cultural', 'metafisico'],
  },
  {
    id: 'careta-sincera',
    title: 'La careta sincera',
    description: 'El que ejecuta su programa social también es auténtico: cumple su configuración. No hay hipocresía sin conocimiento de la diferencia.',
    category: 'social', x: 1300, y: 2780, modes: ['cultural', 'sistemico'],
  },
  {
    id: 'prog-declarada-interna',
    title: 'Programación declarada vs interna',
    description: 'Lo que decimos que creemos versus lo que realmente opera en nuestras decisiones. La brecha es el campo de trabajo.',
    category: 'social', x: 1560, y: 2540, modes: ['cultural', 'sistemico'],
  },
  {
    id: 'colectivo',
    title: 'El colectivo como sistema nervioso planetario',
    description: 'La humanidad como organismo distribuido que procesa información a escala global. Cada individuo es una neurona.',
    category: 'social', x: 1200, y: 2400, modes: ['cultural', 'sistemico', 'metafisico'],
  },

  // ── DOMINIOS DE CONOCIMIENTO (naranja) — arriba-izquierda ───────────────
  {
    id: 'metafisica',
    title: 'Metafísica',
    description: 'El estudio de lo que existe más allá de lo físico. Pregunta por la naturaleza última de la realidad.',
    category: 'dominios', x: 1380, y: 1540, modes: ['metafisico', 'logico'],
  },
  {
    id: 'ontologia',
    title: 'Ontología',
    description: 'La rama de la metafísica que estudia el ser en tanto ser. Qué tipos de cosas existen y en qué sentido existen.',
    category: 'dominios', x: 1220, y: 1620, modes: ['metafisico', 'logico'],
  },
  {
    id: 'epistemologia',
    title: 'Epistemología',
    description: 'La teoría del conocimiento. Cómo sabemos lo que creemos saber, y cuáles son los límites del conocimiento posible.',
    category: 'dominios', x: 1540, y: 1480, modes: ['logico'],
  },
  {
    id: 'psicologia',
    title: 'Psicología',
    description: 'El estudio de los procesos mentales y la conducta. Puente entre la biología y la fenomenología.',
    category: 'dominios', x: 1260, y: 1740, modes: ['sistemico'],
  },
  {
    id: 'neurociencia',
    title: 'Neurociencia',
    description: 'El estudio del sistema nervioso. Traduce la experiencia subjetiva al lenguaje de circuitos, neuronas y neurotransmisores.',
    category: 'dominios', x: 1420, y: 1700, modes: ['sistemico'],
  },
  {
    id: 'robotica',
    title: 'Robótica',
    description: 'La ingeniería de agentes autónomos. Espejo técnico de los mecanismos del organismo: percepción, decisión, acción.',
    category: 'dominios', x: 1160, y: 1820, modes: ['sistemico'],
  },
  {
    id: 'ia',
    title: 'IA',
    description: 'Inteligencia artificial. Sistema que aprende patrones y genera respuestas. Plantea preguntas sobre qué es comprender.',
    category: 'dominios', x: 1320, y: 1840, modes: ['sistemico', 'logico'],
  },
  {
    id: 'enteogenia',
    title: 'Enteogenia',
    description: 'La ciencia y práctica de las sustancias que generan experiencia de lo divino interior. Intersección de farmacología y espiritualidad.',
    category: 'dominios', x: 1480, y: 1580, modes: ['energetico', 'metafisico'],
  },
  {
    id: 'geometria-sagrada',
    title: 'Geometría sagrada',
    description: 'Las proporciones y formas que aparecen recurrentemente en la naturaleza y el arte. El lenguaje matemático de la manifestación.',
    category: 'dominios', x: 1180, y: 1680, modes: ['metafisico', 'logico'],
  },
  {
    id: 'resonancia-armonia',
    title: 'Resonancia / armonía',
    description: 'Dos sistemas que vibran en frecuencias relacionadas se influyen mutuamente. Principio que opera desde el átomo hasta lo social.',
    category: 'dominios', x: 1380, y: 1780, modes: ['energetico', 'sistemico'],
  },
];
