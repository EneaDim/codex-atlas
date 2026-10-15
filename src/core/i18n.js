export const LANGUAGES = Object.freeze(['it', 'en', 'es']);

const UI = Object.freeze({
  explore: { it: 'Esplora', en: 'Explore', es: 'Explorar' },
  learn: { it: 'Impara', en: 'Learn', es: 'Aprender' },
  learningLibrary: { it: 'LIBRERIA DI APPRENDIMENTO', en: 'LEARNING LIBRARY', es: 'BIBLIOTECA DE APRENDIZAJE' },
  interactiveMap: { it: 'MAPPA INTERATTIVA', en: 'INTERACTIVE MAP', es: 'MAPA INTERACTIVO' },
  mapHint: {
    it: 'Passa sui nodi per l’anteprima · clicca macro-aree, sistemi o concetti · trascina e usa la rotella per esplorare',
    en: 'Hover nodes to preview · open macro areas, systems or concepts · drag and use the wheel to explore',
    es: 'Pasa sobre los nodos para previsualizar · abre macroáreas, sistemas o conceptos · arrastra y usa la rueda para explorar',
  },
  searchPlaceholder: { it: 'Cerca per concetto o significato…', en: 'Search by concept or meaning…', es: 'Busca por concepto o significado…' },
  resetView: { it: 'Reimposta', en: 'Reset view', es: 'Restablecer' },
  aboutTitle: { it: 'Come leggere il Codex', en: 'How to read the Codex', es: 'Cómo leer el Codex' },
  aboutCopy: {
    it: 'Dal centro partono grandi famiglie colorate che si ramificano in sistemi e concetti sempre più specifici. Le macro-aree restano come callout esterni separati, mentre Esplora e Impara usano la stessa mappa in modi diversi.',
    en: 'Colored families radiate from the center and branch into systems and increasingly specific concepts. Macro areas remain as detached outer callouts, while Explore and Learn use the same map in different ways.',
    es: 'Desde el centro parten grandes familias de colores que se ramifican en sistemas y conceptos cada vez más específicos. Las macroáreas permanecen como llamadas externas separadas, mientras Explorar y Aprender utilizan el mismo mapa de maneras distintas.',
  },
  aboutFine: {
    it: 'Le sintesi sono a scopo didattico. Gli estratti Wikipedia vengono caricati al passaggio del mouse quando disponibili.',
    en: 'Summaries are educational. Wikipedia excerpts load on hover when available.',
    es: 'Los resúmenes tienen fines educativos. Los extractos de Wikipedia se cargan al pasar el cursor cuando están disponibles.',
  },
  switchThemeLight: { it: 'Passa alla modalità chiara', en: 'Switch to light mode', es: 'Cambiar al modo claro' },
  switchThemeDark: { it: 'Passa alla modalità scura', en: 'Switch to dark mode', es: 'Cambiar al modo oscuro' },
  courseNotes: { it: 'NOTE DEL CORSO', en: 'COURSE NOTES', es: 'APUNTES DEL CURSO' },
  resourcesUpper: { it: 'RISORSE', en: 'RESOURCES', es: 'RECURSOS' },
  wikiLoading: { it: 'Caricamento dell’introduzione da Wikipedia…', en: 'Loading the Wikipedia introduction…', es: 'Cargando la introducción de Wikipedia…' },
  summaryFromNotebooks: { it: 'Sintesi dai notebook', en: 'Summary from notebooks', es: 'Resumen de los notebooks' },
  wikiUnavailableHover: {
    it: 'Wikipedia non ha restituito un’introduzione per questa voce. Apri l’articolo completo o usa le risorse collegate.',
    en: 'Wikipedia did not return an introduction for this entry. Open the full article or use the linked resources.',
    es: 'Wikipedia no ha devuelto una introducción para esta entrada. Abre el artículo completo o utiliza los recursos relacionados.',
  },
  excerptUnavailable: { it: 'Estratto non disponibile', en: 'Excerpt unavailable', es: 'Extracto no disponible' },
  overviewWikipedia: { it: 'In breve · Wikipedia', en: 'Overview · Wikipedia', es: 'En breve · Wikipedia' },
  practicalDetails: { it: 'Dettagli pratici', en: 'Practical details', es: 'Detalles prácticos' },
  learnFolders: { it: 'IMPARA · CARTELLE', en: 'LEARN · FOLDERS', es: 'APRENDER · CARPETAS' },
  openFullArticle: { it: 'Apri l’articolo completo', en: 'Open full article', es: 'Abrir el artículo completo' },
  contents: { it: 'Contenuti', en: 'Contents', es: 'Contenidos' },
  concepts: { it: 'concetti', en: 'concepts', es: 'conceptos' },
  items: { it: 'elementi', en: 'items', es: 'elementos' },
  subtopics: { it: 'sotto-argomenti', en: 'subtopics', es: 'subtemas' },
  learnLibrary: { it: 'IMPARA · LIBRERIA', en: 'LEARN · LIBRARY', es: 'APRENDER · BIBLIOTECA' },
  learnRootCopy: {
    it: 'Scegli una macro-area, entra nelle sottocartelle e apri il concetto che vuoi studiare. La mappa rimane disponibile sullo sfondo.',
    en: 'Choose a macro area, open its subfolders, and pick the concept you want to study. The radial map stays available in the background.',
    es: 'Elige una macroárea, entra en sus subcarpetas y abre el concepto que quieras estudiar. El mapa radial permanece disponible en segundo plano.',
  },
  subfolders: { it: 'Sottocartelle', en: 'Subfolders', es: 'Subcarpetas' },
  lessons: { it: 'Lezioni', en: 'Lessons', es: 'Lecciones' },
  folders: { it: 'cartelle', en: 'folders', es: 'carpetas' },
  openLesson: { it: 'Apri la lezione', en: 'Open lesson', es: 'Abrir la lección' },
  backToFolder: { it: 'Torna alla cartella', en: 'Back to folder', es: 'Volver a la carpeta' },
  courseNotebook: { it: 'Notebook del corso', en: 'Course notebook', es: 'Notebook del curso' },
  formula: { it: 'Formula', en: 'Formula', es: 'Fórmula' },
  meaningTerms: { it: 'Significato dei termini', en: 'Meaning of the terms', es: 'Significado de los términos' },
  example: { it: 'Esempio', en: 'Example', es: 'Ejemplo' },
  note: { it: 'Nota', en: 'Note', es: 'Nota' },
  wikiUnavailableDrawer: {
    it: 'Wikipedia non ha restituito un’introduzione per questa voce. Puoi aprire l’articolo completo oppure consultare le risorse pratiche qui sotto.',
    en: 'Wikipedia did not return an introduction for this entry. You can open the full article or use the practical resources below.',
    es: 'Wikipedia no ha devuelto una introducción para esta entrada. Puedes abrir el artículo completo o consultar los recursos prácticos de abajo.',
  },
  semantic: { it: 'semantico', en: 'semantic', es: 'semántico' },
  semanticAll: { it: 'Ricerca semantica · tutti i Codex', en: 'Semantic search · all Codex', es: 'Búsqueda semántica · todos los Codex' },
  noSemanticResults: { it: 'Nessun risultato semantico.', en: 'No semantic results.', es: 'No hay resultados semánticos.' },
  simpleDIY: { it: 'DIY semplice', en: 'Simple DIY', es: 'Bricolaje sencillo' },
  intermediate: { it: 'Intermedio', en: 'Intermediate', es: 'Intermedio' },
  professional: { it: 'Tecnico', en: 'Professional', es: 'Profesional' },
  lowRisk: { it: 'Rischio basso', en: 'Low risk', es: 'Riesgo bajo' },
  caution: { it: 'Attenzione', en: 'Caution', es: 'Precaución' },
  highRisk: { it: 'Rischio alto', en: 'High risk', es: 'Riesgo alto' },
  safetyLow: {
    it: 'In genere adatto a controlli o manutenzione leggera. Segui il manuale del componente e isola acqua o alimentazione quando pertinente.',
    en: 'Generally suitable for inspection or light maintenance. Follow the component manual and isolate water or power when relevant.',
    es: 'En general, adecuado para inspecciones o mantenimiento ligero. Sigue el manual del componente y aísla el agua o la alimentación eléctrica cuando corresponda.',
  },
  safetyMedium: {
    it: 'Richiede attenzione: se devi aprire impianti, lavorare in quota o non riesci a isolare in sicurezza la fonte, fermati e chiama un professionista.',
    en: 'Use caution: if the job requires opening building systems, working at height, or you cannot safely isolate the source, stop and call a professional.',
    es: 'Requiere precaución: si debes abrir instalaciones, trabajar en altura o no puedes aislar la fuente de forma segura, detente y llama a un profesional.',
  },
  safetyHigh: {
    it: 'Non trattarlo come una procedura fai da te. Usa questa scheda per capire il sistema e riconoscere i segnali; l’intervento va affidato a un tecnico qualificato.',
    en: 'Do not treat this as a DIY procedure. Use this card to understand the system and recognize warning signs; hands-on work belongs with a qualified professional.',
    es: 'No lo trates como un procedimiento de bricolaje. Usa esta ficha para comprender el sistema y reconocer señales de alerta; la intervención debe quedar en manos de un profesional cualificado.',
  },
  callProfessional: { it: 'Quando chiamare un professionista', en: 'When to call a professional', es: 'Cuándo llamar a un profesional' },
  practicalNote: { it: 'Nota pratica', en: 'Practical note', es: 'Nota práctica' },
  practicalResources: { it: 'Risorse pratiche', en: 'Practical resources', es: 'Recursos prácticos' },
  officialSource: { it: 'FONTE UFFICIALE', en: 'OFFICIAL', es: 'FUENTE OFICIAL' },
  safety: { it: 'SICUREZZA', en: 'SAFETY', es: 'SEGURIDAD' },
  manual: { it: 'MANUALE', en: 'MANUAL', es: 'MANUAL' },
  roleDomain: { it: 'Macro-area', en: 'Macro area', es: 'Macroárea' },
  roleSystem: { it: 'Sistema', en: 'System', es: 'Sistema' },
  roleConcept: { it: 'Concetto', en: 'Concept', es: 'Concepto' },
  languageGroup: { it: 'Lingua', en: 'Language', es: 'Idioma' },
  atlasHome: { it: 'Torna alla pagina principale di Codex Atlas', en: 'Back to the Codex Atlas main page', es: 'Volver a la página principal de Codex Atlas' },
  wikiFallback: { it: 'fallback', en: 'fallback', es: 'alternativa' },
});

export function normalizeLanguage(value, fallback = 'en') {
  return LANGUAGES.includes(value) ? value : fallback;
}

export function t(key, lang = 'en') {
  const entry = UI[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en ?? entry.it ?? key;
}

export function localized(value, lang = 'en', fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  return value[lang] ?? value.en ?? value.it ?? value.es ?? fallback;
}

export function localizedList(value, lang = 'en') {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return value[lang] ?? value.en ?? value.it ?? value.es ?? [];
}
