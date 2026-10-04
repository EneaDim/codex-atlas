import type { CodexPack } from './types';

const W = (en: string, it: string) => ({
  en: `https://en.wikipedia.org/wiki/${en}`,
  it: `https://it.wikipedia.org/wiki/${it}`,
});

export const humanBody: CodexPack = {
  id: 'human-body',
  title: { en: 'Human Body Codex', it: 'Codex del Corpo Umano' },
  subtitle: {
    en: 'A compact visual map of anatomy and physiology.',
    it: 'Una mappa visiva e concisa di anatomia e fisiologia.',
  },
  centerImage: '/images/center-placeholder.svg',
  domains: [
    {
      id: 'foundations',
      title: { en: 'Foundations', it: 'Fondamenti' },
      description: {
        en: 'Core ideas used to describe body structure, function and internal balance.',
        it: 'Concetti di base usati per descrivere struttura, funzione ed equilibrio interno del corpo.',
      },
      wikipedia: W('Human_body', 'Corpo_umano'),
      systems: [
        {
          id: 'organization',
          title: { en: 'Organization', it: 'Organizzazione' },
          description: {
            en: 'The body is organized from cells to tissues, organs and organ systems.',
            it: 'Il corpo è organizzato in cellule, tessuti, organi e sistemi di organi.',
          },
          wikipedia: W('Human_body', 'Corpo_umano'),
          concepts: [
            {
              id: 'cell',
              title: { en: 'Cell', it: 'Cellula' },
              description: {
                en: 'The basic structural and functional unit of living organisms.',
                it: 'L’unità strutturale e funzionale fondamentale degli organismi viventi.',
              },
              wikipedia: W('Cell_(biology)', 'Cellula'),
              learnOrder: 1,
            },
            {
              id: 'tissue',
              title: { en: 'Tissue', it: 'Tessuto' },
              description: {
                en: 'A coordinated group of similar cells and extracellular material performing shared functions.',
                it: 'Un insieme coordinato di cellule simili e materiale extracellulare che svolge funzioni comuni.',
              },
              wikipedia: W('Tissue_(biology)', 'Tessuto_(biologia)'),
              prerequisites: ['cell'],
              learnOrder: 2,
            },
            {
              id: 'organ',
              title: { en: 'Organ', it: 'Organo' },
              description: {
                en: 'A structure made of multiple tissue types working together for specific functions.',
                it: 'Una struttura formata da più tipi di tessuto che collaborano per funzioni specifiche.',
              },
              wikipedia: W('Organ_(biology)', 'Organo_(anatomia)'),
              prerequisites: ['tissue'],
              learnOrder: 3,
            },
            {
              id: 'organ-system',
              title: { en: 'Organ system', it: 'Sistema di organi' },
              description: {
                en: 'A set of organs that cooperate to perform broad physiological functions.',
                it: 'Un insieme di organi che cooperano per svolgere ampie funzioni fisiologiche.',
              },
              wikipedia: W('Organ_system', 'Apparato'),
              prerequisites: ['organ'],
              learnOrder: 33,
            },
            {
              id: 'anatomy',
              title: { en: 'Anatomy', it: 'Anatomia' },
              description: {
                en: 'The study of body structures and their spatial relationships.',
                it: 'Lo studio delle strutture del corpo e delle loro relazioni spaziali.',
              },
              wikipedia: W('Anatomy', 'Anatomia'),
              prerequisites: ['organ-system'],
              learnOrder: 46,
            },
            {
              id: 'physiology',
              title: { en: 'Physiology', it: 'Fisiologia' },
              description: {
                en: 'The study of how body structures function and interact.',
                it: 'Lo studio di come le strutture del corpo funzionano e interagiscono.',
              },
              wikipedia: W('Physiology', 'Fisiologia'),
              prerequisites: ['anatomy'],
              learnOrder: 47,
            },
          ],
        },
        {
          id: 'regulation',
          title: { en: 'Regulation', it: 'Regolazione' },
          description: {
            en: 'Mechanisms that keep internal conditions within ranges compatible with life.',
            it: 'Meccanismi che mantengono le condizioni interne entro intervalli compatibili con la vita.',
          },
          wikipedia: W('Homeostasis', 'Omeostasi'),
          concepts: [
            {
              id: 'homeostasis',
              title: { en: 'Homeostasis', it: 'Omeostasi' },
              description: {
                en: 'Dynamic regulation of internal variables such as temperature, pH and glucose.',
                it: 'Regolazione dinamica di variabili interne come temperatura, pH e glucosio.',
              },
              wikipedia: W('Homeostasis', 'Omeostasi'),
              prerequisites: ['cell'],
              learnOrder: 4,
            },
            {
              id: 'feedback',
              title: { en: 'Feedback loops', it: 'Circuiti di feedback' },
              description: {
                en: 'Control loops in which a response changes the stimulus, usually stabilizing or amplifying it.',
                it: 'Circuiti di controllo in cui la risposta modifica lo stimolo, stabilizzandolo o amplificandolo.',
              },
              wikipedia: W('Feedback', 'Retroazione'),
              prerequisites: ['homeostasis'],
              learnOrder: 5,
            },
            {
              id: 'negative-feedback',
              title: { en: 'Negative feedback', it: 'Feedback negativo' },
              description: {
                en: 'A control pattern that counteracts deviation and helps stabilize internal variables.',
                it: 'Uno schema di controllo che contrasta la deviazione e aiuta a stabilizzare le variabili interne.',
              },
              wikipedia: W('Negative_feedback', 'Retroazione_negativa'),
              prerequisites: ['feedback'],
              learnOrder: 34,
            },
            {
              id: 'set-point',
              title: { en: 'Set point', it: 'Set point' },
              description: {
                en: 'A target value around which a regulatory system stabilizes a variable.',
                it: 'Un valore-obiettivo attorno al quale un sistema di regolazione stabilizza una variabile.',
              },
              wikipedia: W('Setpoint_(control_system)', 'Setpoint'),
              prerequisites: ['negative-feedback'],
              learnOrder: 48,
            },
          ],
        },
      ],
    },
    {
      id: 'control',
      title: { en: 'Control & Integration', it: 'Controllo e Integrazione' },
      description: {
        en: 'Fast electrical and slower chemical systems coordinate activity across the body.',
        it: 'Sistemi elettrici rapidi e chimici più lenti coordinano le attività dell’organismo.',
      },
      wikipedia: W('Nervous_system', 'Sistema_nervoso'),
      systems: [
        {
          id: 'nervous',
          title: { en: 'Nervous System', it: 'Sistema Nervoso' },
          description: {
            en: 'Neural networks sense information, process it and produce rapid responses.',
            it: 'Le reti nervose ricevono informazioni, le elaborano e producono risposte rapide.',
          },
          wikipedia: W('Nervous_system', 'Sistema_nervoso'),
          concepts: [
            {
              id: 'neuron',
              title: { en: 'Neuron', it: 'Neurone' },
              description: {
                en: 'An excitable cell specialized in receiving, processing and transmitting information.',
                it: 'Una cellula eccitabile specializzata nel ricevere, elaborare e trasmettere informazioni.',
              },
              wikipedia: W('Neuron', 'Neurone'),
              prerequisites: ['cell'],
              learnOrder: 6,
            },
            {
              id: 'action-potential',
              title: { en: 'Action potential', it: 'Potenziale d’azione' },
              description: {
                en: 'A brief change in membrane voltage that propagates along excitable cells.',
                it: 'Una breve variazione del potenziale di membrana che si propaga nelle cellule eccitabili.',
              },
              wikipedia: W('Action_potential', 'Potenziale_d%27azione'),
              prerequisites: ['neuron'],
              learnOrder: 7,
            },
            {
              id: 'synapse',
              title: { en: 'Synapse', it: 'Sinapsi' },
              description: {
                en: 'A junction where a neuron communicates with another cell chemically or electrically.',
                it: 'Una giunzione in cui un neurone comunica con un’altra cellula per via chimica o elettrica.',
              },
              wikipedia: W('Synapse', 'Sinapsi'),
              prerequisites: ['neuron', 'action-potential'],
              learnOrder: 8,
            },
            {
              id: 'brain',
              title: { en: 'Brain', it: 'Cervello' },
              description: {
                en: 'The central organ that integrates sensory input, cognition and motor control.',
                it: 'L’organo centrale che integra input sensoriali, cognizione e controllo motorio.',
              },
              wikipedia: W('Brain', 'Cervello'),
              prerequisites: ['synapse'],
              learnOrder: 35,
            },
            {
              id: 'glial-cell',
              title: { en: 'Glial cell', it: 'Cellula gliale' },
              description: {
                en: 'A support cell that nourishes, insulates and protects neurons.',
                it: 'Una cellula di supporto che nutre, isola e protegge i neuroni.',
              },
              wikipedia: W('Glia', 'Cellula_gliale'),
              prerequisites: ['neuron'],
              learnOrder: 49,
            },
          ],
        },
        {
          id: 'endocrine',
          title: { en: 'Endocrine System', it: 'Sistema Endocrino' },
          description: {
            en: 'Hormones released into the circulation coordinate slower, widespread responses.',
            it: 'Gli ormoni rilasciati nel circolo coordinano risposte più lente e diffuse.',
          },
          wikipedia: W('Endocrine_system', 'Sistema_endocrino'),
          concepts: [
            {
              id: 'hormone',
              title: { en: 'Hormone', it: 'Ormone' },
              description: {
                en: 'A signaling molecule carried to target cells where it modifies their activity.',
                it: 'Una molecola segnale trasportata a cellule bersaglio, di cui modifica l’attività.',
              },
              wikipedia: W('Hormone', 'Ormone'),
              prerequisites: ['homeostasis'],
              learnOrder: 9,
            },
            {
              id: 'hypothalamus',
              title: { en: 'Hypothalamus', it: 'Ipotalamo' },
              description: {
                en: 'A brain region linking neural control with endocrine and autonomic regulation.',
                it: 'Una regione cerebrale che collega il controllo nervoso alla regolazione endocrina e autonoma.',
              },
              wikipedia: W('Hypothalamus', 'Ipotalamo'),
              prerequisites: ['neuron', 'hormone'],
              learnOrder: 10,
            },
            {
              id: 'pituitary',
              title: { en: 'Pituitary gland', it: 'Ipofisi' },
              description: {
                en: 'An endocrine gland that releases hormones controlling many other endocrine organs.',
                it: 'Una ghiandola endocrina che rilascia ormoni capaci di controllare molti altri organi endocrini.',
              },
              wikipedia: W('Pituitary_gland', 'Ipofisi'),
              prerequisites: ['hypothalamus'],
              learnOrder: 36,
            },
            {
              id: 'thyroid',
              title: { en: 'Thyroid gland', it: 'Tiroide' },
              description: {
                en: 'An endocrine gland that helps regulate metabolism, growth and development.',
                it: 'Una ghiandola endocrina che aiuta a regolare metabolismo, crescita e sviluppo.',
              },
              wikipedia: W('Thyroid', 'Tiroide'),
              prerequisites: ['pituitary'],
              learnOrder: 50,
            },
          ],
        },
      ],
    },
    {
      id: 'transport',
      title: { en: 'Transport & Exchange', it: 'Trasporto e Scambi' },
      description: {
        en: 'Systems that move blood and exchange gases, nutrients, wastes and heat.',
        it: 'Sistemi che muovono il sangue e scambiano gas, nutrienti, scorie e calore.',
      },
      wikipedia: W('Circulatory_system', 'Apparato_circolatorio'),
      systems: [
        {
          id: 'cardiovascular',
          title: { en: 'Cardiovascular', it: 'Cardiovascolare' },
          description: {
            en: 'The heart and vessels circulate blood through pulmonary and systemic circuits.',
            it: 'Cuore e vasi fanno circolare il sangue nei circuiti polmonare e sistemico.',
          },
          wikipedia: W('Circulatory_system', 'Apparato_circolatorio'),
          concepts: [
            {
              id: 'heart',
              title: { en: 'Heart', it: 'Cuore' },
              description: {
                en: 'A muscular pump that drives blood through the pulmonary and systemic circulations.',
                it: 'Una pompa muscolare che spinge il sangue nella circolazione polmonare e sistemica.',
              },
              wikipedia: W('Heart', 'Cuore'),
              prerequisites: ['organ'],
              learnOrder: 11,
            },
            {
              id: 'blood-vessel',
              title: { en: 'Blood vessels', it: 'Vasi sanguigni' },
              description: {
                en: 'Arteries, capillaries and veins form the conduits through which blood circulates.',
                it: 'Arterie, capillari e vene formano i condotti attraverso cui circola il sangue.',
              },
              wikipedia: W('Blood_vessel', 'Vaso_sanguigno'),
              prerequisites: ['tissue'],
              learnOrder: 12,
            },
            {
              id: 'blood',
              title: { en: 'Blood', it: 'Sangue' },
              description: {
                en: 'A fluid connective tissue transporting gases, nutrients, signals, heat and immune cells.',
                it: 'Un tessuto connettivo fluido che trasporta gas, nutrienti, segnali, calore e cellule immunitarie.',
              },
              wikipedia: W('Blood', 'Sangue'),
              prerequisites: ['tissue'],
              learnOrder: 13,
            },
            {
              id: 'circulation',
              title: { en: 'Circulation', it: 'Circolazione' },
              description: {
                en: 'The continuous movement of blood through the heart, vessels and tissues.',
                it: 'Il movimento continuo del sangue attraverso cuore, vasi e tessuti.',
              },
              wikipedia: W('Circulatory_system', 'Apparato_circolatorio'),
              prerequisites: ['heart', 'blood-vessel', 'blood'],
              learnOrder: 37,
            },
            {
              id: 'capillary',
              title: { en: 'Capillary', it: 'Capillare' },
              description: {
                en: 'A microscopic vessel where exchange occurs between blood and tissues.',
                it: 'Un vaso microscopico in cui avvengono gli scambi tra sangue e tessuti.',
              },
              wikipedia: W('Capillary', 'Capillare'),
              prerequisites: ['blood-vessel'],
              learnOrder: 51,
            },
          ],
        },
        {
          id: 'respiratory',
          title: { en: 'Respiratory', it: 'Respiratorio' },
          description: {
            en: 'Ventilation and gas exchange bring oxygen in and remove carbon dioxide.',
            it: 'Ventilazione e scambio gassoso introducono ossigeno ed eliminano anidride carbonica.',
          },
          wikipedia: W('Respiratory_system', 'Apparato_respiratorio'),
          concepts: [
            {
              id: 'lung',
              title: { en: 'Lungs', it: 'Polmoni' },
              description: {
                en: 'Paired organs where air is brought close to pulmonary blood for gas exchange.',
                it: 'Organi pari in cui l’aria viene portata vicino al sangue polmonare per lo scambio dei gas.',
              },
              wikipedia: W('Lung', 'Polmone'),
              prerequisites: ['organ'],
              learnOrder: 14,
            },
            {
              id: 'alveolus',
              title: { en: 'Alveolus', it: 'Alveolo' },
              description: {
                en: 'A microscopic air sac with a thin barrier specialized for oxygen and carbon-dioxide diffusion.',
                it: 'Un microscopico sacco aereo con una barriera sottile specializzata nella diffusione di ossigeno e CO₂.',
              },
              wikipedia: W('Pulmonary_alveolus', 'Alveolo_polmonare'),
              prerequisites: ['lung', 'blood-vessel'],
              learnOrder: 15,
            },
            {
              id: 'ventilation',
              title: { en: 'Ventilation', it: 'Ventilazione' },
              description: {
                en: 'The mechanical movement of air into and out of the lungs.',
                it: 'Il movimento meccanico dell’aria dentro e fuori dai polmoni.',
              },
              wikipedia: W('Breathing', 'Respirazione_(fisiologia)'),
              prerequisites: ['lung'],
              learnOrder: 16,
            },
            {
              id: 'diaphragm',
              title: { en: 'Diaphragm', it: 'Diaframma' },
              description: {
                en: 'The main respiratory muscle that changes thoracic volume during breathing.',
                it: 'Il principale muscolo respiratorio che modifica il volume toracico durante la respirazione.',
              },
              wikipedia: W('Thoracic_diaphragm', 'Diaframma'),
              prerequisites: ['ventilation'],
              learnOrder: 38,
            },
            {
              id: 'hemoglobin',
              title: { en: 'Hemoglobin', it: 'Emoglobina' },
              description: {
                en: 'The oxygen-carrying protein inside red blood cells.',
                it: 'La proteina che trasporta ossigeno all’interno dei globuli rossi.',
              },
              wikipedia: W('Hemoglobin', 'Emoglobina'),
              prerequisites: ['blood', 'alveolus'],
              learnOrder: 52,
            },
          ],
        },
      ],
    },
    {
      id: 'support',
      title: { en: 'Support & Movement', it: 'Sostegno e Movimento' },
      description: {
        en: 'Bones, joints and muscles provide structure, protection and controlled movement.',
        it: 'Ossa, articolazioni e muscoli forniscono struttura, protezione e movimento controllato.',
      },
      wikipedia: W('Musculoskeletal_system', 'Apparato_locomotore'),
      systems: [
        {
          id: 'skeletal',
          title: { en: 'Skeletal System', it: 'Sistema Scheletrico' },
          description: {
            en: 'Bones and connective structures support the body and provide levers for movement.',
            it: 'Ossa e strutture connettive sostengono il corpo e forniscono leve per il movimento.',
          },
          wikipedia: W('Human_skeleton', 'Scheletro_umano'),
          concepts: [
            {
              id: 'bone',
              title: { en: 'Bone', it: 'Osso' },
              description: {
                en: 'A mineralized connective tissue that provides support, protection and mineral storage.',
                it: 'Un tessuto connettivo mineralizzato che offre sostegno, protezione e deposito di minerali.',
              },
              wikipedia: W('Bone', 'Osso'),
              prerequisites: ['tissue'],
              learnOrder: 17,
            },
            {
              id: 'cartilage',
              title: { en: 'Cartilage', it: 'Cartilagine' },
              description: {
                en: 'A resilient connective tissue that cushions joints and supports some structures.',
                it: 'Un tessuto connettivo resistente che ammortizza le articolazioni e sostiene alcune strutture.',
              },
              wikipedia: W('Cartilage', 'Cartilagine'),
              prerequisites: ['tissue'],
              learnOrder: 39,
            },
            {
              id: 'joint',
              title: { en: 'Joint', it: 'Articolazione' },
              description: {
                en: 'A connection between skeletal elements that may permit or restrict movement.',
                it: 'Una connessione tra elementi scheletrici che può permettere o limitare il movimento.',
              },
              wikipedia: W('Joint', 'Articolazione_(anatomia)'),
              prerequisites: ['bone'],
              learnOrder: 18,
            },
            {
              id: 'bone-marrow',
              title: { en: 'Bone marrow', it: 'Midollo osseo' },
              description: {
                en: 'The soft tissue inside many bones where blood cells are produced.',
                it: 'Il tessuto molle presente in molte ossa dove vengono prodotte le cellule del sangue.',
              },
              wikipedia: W('Bone_marrow', 'Midollo_osseo'),
              prerequisites: ['bone'],
              learnOrder: 53,
            },
          ],
        },
        {
          id: 'muscular',
          title: { en: 'Muscular System', it: 'Sistema Muscolare' },
          description: {
            en: 'Muscle tissue converts chemical energy into force and movement.',
            it: 'Il tessuto muscolare converte energia chimica in forza e movimento.',
          },
          wikipedia: W('Muscular_system', 'Sistema_muscolare'),
          concepts: [
            {
              id: 'skeletal-muscle',
              title: { en: 'Skeletal muscle', it: 'Muscolo scheletrico' },
              description: {
                en: 'Voluntary striated muscle that moves the skeleton and helps maintain posture.',
                it: 'Muscolo striato volontario che muove lo scheletro e contribuisce alla postura.',
              },
              wikipedia: W('Skeletal_muscle', 'Muscolo_scheletrico'),
              prerequisites: ['tissue', 'bone'],
              learnOrder: 19,
            },
            {
              id: 'muscle-contraction',
              title: { en: 'Muscle contraction', it: 'Contrazione muscolare' },
              description: {
                en: 'Force generation caused by interactions between contractile proteins inside muscle cells.',
                it: 'Produzione di forza dovuta all’interazione tra proteine contrattili nelle cellule muscolari.',
              },
              wikipedia: W('Muscle_contraction', 'Contrazione_muscolare'),
              prerequisites: ['skeletal-muscle', 'action-potential'],
              learnOrder: 20,
            },
            {
              id: 'tendon',
              title: { en: 'Tendon', it: 'Tendine' },
              description: {
                en: 'A strong connective structure that transmits force from muscle to bone.',
                it: 'Una struttura connettiva resistente che trasmette la forza dal muscolo all’osso.',
              },
              wikipedia: W('Tendon', 'Tendine'),
              prerequisites: ['skeletal-muscle'],
              learnOrder: 40,
            },
            {
              id: 'smooth-muscle',
              title: { en: 'Smooth muscle', it: 'Muscolo liscio' },
              description: {
                en: 'Involuntary muscle found in the walls of many hollow organs and vessels.',
                it: 'Muscolo involontario presente nelle pareti di molti organi cavi e vasi.',
              },
              wikipedia: W('Smooth_muscle', 'Tessuto_muscolare_liscio'),
              prerequisites: ['skeletal-muscle'],
              learnOrder: 54,
            },
          ],
        },
      ],
    },
    {
      id: 'metabolism',
      title: { en: 'Nutrition & Elimination', it: 'Nutrizione ed Eliminazione' },
      description: {
        en: 'Systems that acquire nutrients, process them and regulate water and waste removal.',
        it: 'Sistemi che acquisiscono nutrienti, li elaborano e regolano acqua ed eliminazione delle scorie.',
      },
      wikipedia: W('Digestive_system', 'Apparato_digerente'),
      systems: [
        {
          id: 'digestive',
          title: { en: 'Digestive', it: 'Digerente' },
          description: {
            en: 'Food is mechanically and chemically processed so nutrients can be absorbed.',
            it: 'Il cibo viene elaborato meccanicamente e chimicamente per permettere l’assorbimento dei nutrienti.',
          },
          wikipedia: W('Human_digestive_system', 'Apparato_digerente'),
          concepts: [
            {
              id: 'stomach',
              title: { en: 'Stomach', it: 'Stomaco' },
              description: {
                en: 'A muscular organ that stores food and begins intensive chemical and mechanical digestion.',
                it: 'Un organo muscolare che immagazzina il cibo e avvia una digestione chimica e meccanica intensa.',
              },
              wikipedia: W('Stomach', 'Stomaco'),
              prerequisites: ['organ'],
              learnOrder: 21,
            },
            {
              id: 'small-intestine',
              title: { en: 'Small intestine', it: 'Intestino tenue' },
              description: {
                en: 'The main site of enzymatic digestion and absorption of most nutrients.',
                it: 'La principale sede della digestione enzimatica e dell’assorbimento della maggior parte dei nutrienti.',
              },
              wikipedia: W('Small_intestine', 'Intestino_tenue'),
              prerequisites: ['stomach'],
              learnOrder: 22,
            },
            {
              id: 'liver',
              title: { en: 'Liver', it: 'Fegato' },
              description: {
                en: 'A major metabolic organ that processes nutrients, makes bile and performs detoxification functions.',
                it: 'Un importante organo metabolico che elabora nutrienti, produce bile e svolge funzioni di detossificazione.',
              },
              wikipedia: W('Liver', 'Fegato'),
              prerequisites: ['organ'],
              learnOrder: 23,
            },
            {
              id: 'pancreas',
              title: { en: 'Pancreas', it: 'Pancreas' },
              description: {
                en: 'An organ with digestive and endocrine functions that contributes enzymes and hormones.',
                it: 'Un organo con funzioni digestive ed endocrine che fornisce enzimi e ormoni.',
              },
              wikipedia: W('Pancreas', 'Pancreas'),
              prerequisites: ['small-intestine'],
              learnOrder: 41,
            },
            {
              id: 'large-intestine',
              title: { en: 'Large intestine', it: 'Intestino crasso' },
              description: {
                en: 'The portion of the gut that absorbs water and compacts waste into feces.',
                it: 'La porzione dell’intestino che assorbe acqua e compatta le scorie in feci.',
              },
              wikipedia: W('Large_intestine', 'Intestino_crasso'),
              prerequisites: ['small-intestine'],
              learnOrder: 55,
            },
          ],
        },
        {
          id: 'urinary',
          title: { en: 'Urinary', it: 'Urinario' },
          description: {
            en: 'The kidneys regulate body-fluid composition and excrete many metabolic wastes.',
            it: 'I reni regolano la composizione dei liquidi corporei ed eliminano molte scorie metaboliche.',
          },
          wikipedia: W('Urinary_system', 'Apparato_urinario'),
          concepts: [
            {
              id: 'kidney',
              title: { en: 'Kidney', it: 'Rene' },
              description: {
                en: 'An organ that filters blood and regulates water, electrolytes, acid-base balance and waste excretion.',
                it: 'Un organo che filtra il sangue e regola acqua, elettroliti, equilibrio acido-base ed escrezione delle scorie.',
              },
              wikipedia: W('Kidney', 'Rene'),
              prerequisites: ['blood', 'homeostasis'],
              learnOrder: 24,
            },
            {
              id: 'nephron',
              title: { en: 'Nephron', it: 'Nefrone' },
              description: {
                en: 'The microscopic functional unit of the kidney that filters and modifies tubular fluid.',
                it: 'L’unità funzionale microscopica del rene che filtra e modifica il fluido tubulare.',
              },
              wikipedia: W('Nephron', 'Nefrone'),
              prerequisites: ['kidney', 'blood-vessel'],
              learnOrder: 25,
            },
            {
              id: 'bladder',
              title: { en: 'Urinary bladder', it: 'Vescica urinaria' },
              description: {
                en: 'A muscular reservoir that stores urine before elimination.',
                it: 'Un serbatoio muscolare che immagazzina l’urina prima dell’eliminazione.',
              },
              wikipedia: W('Urinary_bladder', 'Vescica_urinaria'),
              prerequisites: ['kidney'],
              learnOrder: 42,
            },
            {
              id: 'ureter',
              title: { en: 'Ureter', it: 'Uretere' },
              description: {
                en: 'A duct that carries urine from the kidney to the bladder.',
                it: 'Un condotto che trasporta l’urina dal rene alla vescica.',
              },
              wikipedia: W('Ureter', 'Uretere'),
              prerequisites: ['kidney', 'bladder'],
              learnOrder: 56,
            },
          ],
        },
      ],
    },
    {
      id: 'defense',
      title: { en: 'Defense & Protection', it: 'Difesa e Protezione' },
      description: {
        en: 'Barrier and immune systems protect the internal environment from injury and pathogens.',
        it: 'Barriere e sistema immunitario proteggono l’ambiente interno da lesioni e patogeni.',
      },
      wikipedia: W('Immune_system', 'Sistema_immunitario'),
      systems: [
        {
          id: 'immune',
          title: { en: 'Immune System', it: 'Sistema Immunitario' },
          description: {
            en: 'Cells, tissues and molecules detect threats and coordinate protective responses.',
            it: 'Cellule, tessuti e molecole riconoscono minacce e coordinano risposte protettive.',
          },
          wikipedia: W('Immune_system', 'Sistema_immunitario'),
          concepts: [
            {
              id: 'innate-immunity',
              title: { en: 'Innate immunity', it: 'Immunità innata' },
              description: {
                en: 'Rapid, broadly targeted defenses that act without prior exposure to a specific pathogen.',
                it: 'Difese rapide e ad ampio spettro che agiscono senza una precedente esposizione a uno specifico patogeno.',
              },
              wikipedia: W('Innate_immune_system', 'Immunit%C3%A0_innata'),
              prerequisites: ['cell'],
              learnOrder: 26,
            },
            {
              id: 'adaptive-immunity',
              title: { en: 'Adaptive immunity', it: 'Immunità adattativa' },
              description: {
                en: 'Specific immune responses that can generate long-lasting immunological memory.',
                it: 'Risposte immunitarie specifiche capaci di generare memoria immunologica duratura.',
              },
              wikipedia: W('Adaptive_immune_system', 'Immunit%C3%A0_adattativa'),
              prerequisites: ['innate-immunity'],
              learnOrder: 27,
            },
            {
              id: 'lymphocyte',
              title: { en: 'Lymphocyte', it: 'Linfocita' },
              description: {
                en: 'A white blood cell central to adaptive immunity, including B cells and T cells.',
                it: 'Un globulo bianco centrale nell’immunità adattativa, comprendente linfociti B e T.',
              },
              wikipedia: W('Lymphocyte', 'Linfocita'),
              prerequisites: ['blood', 'adaptive-immunity'],
              learnOrder: 28,
            },
            {
              id: 'inflammation',
              title: { en: 'Inflammation', it: 'Infiammazione' },
              description: {
                en: 'A protective response that recruits cells and molecules to damaged or infected tissue.',
                it: 'Una risposta protettiva che richiama cellule e molecole nei tessuti danneggiati o infetti.',
              },
              wikipedia: W('Inflammation', 'Infiammazione'),
              prerequisites: ['innate-immunity'],
              learnOrder: 43,
            },
            {
              id: 'antibody',
              title: { en: 'Antibody', it: 'Anticorpo' },
              description: {
                en: 'A protein made by B cells that specifically recognizes foreign molecules.',
                it: 'Una proteina prodotta dai linfociti B che riconosce in modo specifico molecole estranee.',
              },
              wikipedia: W('Antibody', 'Anticorpo'),
              prerequisites: ['lymphocyte'],
              learnOrder: 57,
            },
          ],
        },
        {
          id: 'integumentary',
          title: { en: 'Integumentary', it: 'Tegumentario' },
          description: {
            en: 'Skin and associated structures form a protective interface with the environment.',
            it: 'Cute e strutture associate formano un’interfaccia protettiva con l’ambiente.',
          },
          wikipedia: W('Integumentary_system', 'Apparato_tegumentario'),
          concepts: [
            {
              id: 'skin',
              title: { en: 'Skin', it: 'Cute' },
              description: {
                en: 'The body’s largest organ, providing barrier, sensory and thermoregulatory functions.',
                it: 'Il più grande organo del corpo, con funzioni di barriera, sensibilità e termoregolazione.',
              },
              wikipedia: W('Human_skin', 'Cute'),
              prerequisites: ['organ'],
              learnOrder: 29,
            },
            {
              id: 'epidermis',
              title: { en: 'Epidermis', it: 'Epidermide' },
              description: {
                en: 'The outer epithelial layer of the skin that forms a protective barrier.',
                it: 'Lo strato epiteliale più esterno della cute che forma una barriera protettiva.',
              },
              wikipedia: W('Epidermis', 'Epidermide'),
              prerequisites: ['skin'],
              learnOrder: 44,
            },
            {
              id: 'dermis',
              title: { en: 'Dermis', it: 'Derma' },
              description: {
                en: 'The deeper connective layer of the skin containing vessels, nerves and glands.',
                it: 'Lo strato connettivo più profondo della cute che contiene vasi, nervi e ghiandole.',
              },
              wikipedia: W('Dermis', 'Derma'),
              prerequisites: ['epidermis'],
              learnOrder: 58,
            },
          ],
        },
      ],
    },
    {
      id: 'reproduction',
      title: { en: 'Reproduction & Development', it: 'Riproduzione e Sviluppo' },
      description: {
        en: 'Processes that produce gametes, enable reproduction and guide development from embryo to adult.',
        it: 'Processi che producono gameti, consentono la riproduzione e guidano lo sviluppo dall’embrione all’adulto.',
      },
      wikipedia: W('Human_reproductive_system', 'Apparato_genitale'),
      systems: [
        {
          id: 'reproductive-system',
          title: { en: 'Reproductive System', it: 'Sistema Riproduttivo' },
          description: {
            en: 'Organs and hormones involved in gamete production, fertilization and reproduction.',
            it: 'Organi e ormoni coinvolti nella produzione dei gameti, nella fecondazione e nella riproduzione.',
          },
          wikipedia: W('Human_reproductive_system', 'Apparato_genitale'),
          concepts: [
            {
              id: 'gamete',
              title: { en: 'Gamete', it: 'Gamete' },
              description: {
                en: 'A haploid reproductive cell that combines with another gamete during fertilization.',
                it: 'Una cellula riproduttiva aploide che si unisce a un altro gamete durante la fecondazione.',
              },
              wikipedia: W('Gamete', 'Gamete'),
              prerequisites: ['cell'],
              learnOrder: 30,
            },
            {
              id: 'fertilization',
              title: { en: 'Fertilization', it: 'Fecondazione' },
              description: {
                en: 'Fusion of gametes that initiates development of a new organism.',
                it: 'Fusione dei gameti che avvia lo sviluppo di un nuovo organismo.',
              },
              wikipedia: W('Human_fertilization', 'Fecondazione'),
              prerequisites: ['gamete'],
              learnOrder: 31,
            },
            {
              id: 'embryo',
              title: { en: 'Embryonic development', it: 'Sviluppo embrionale' },
              description: {
                en: 'The early developmental period in which the body plan and major organ systems begin to form.',
                it: 'Il periodo iniziale dello sviluppo in cui iniziano a formarsi il piano corporeo e i principali sistemi di organi.',
              },
              wikipedia: W('Human_embryonic_development', 'Sviluppo_embrionale_umano'),
              prerequisites: ['fertilization', 'cell'],
              learnOrder: 32,
            },
            {
              id: 'placenta',
              title: { en: 'Placenta', it: 'Placenta' },
              description: {
                en: 'A temporary organ that mediates exchange between maternal and fetal circulations.',
                it: 'Un organo temporaneo che media gli scambi tra la circolazione materna e quella fetale.',
              },
              wikipedia: W('Placenta', 'Placenta'),
              prerequisites: ['embryo'],
              learnOrder: 45,
            },
            {
              id: 'gonad',
              title: { en: 'Gonad', it: 'Gonade' },
              description: {
                en: 'A reproductive organ that produces gametes and sex hormones.',
                it: 'Un organo riproduttivo che produce gameti e ormoni sessuali.',
              },
              wikipedia: W('Gonad', 'Gonade'),
              prerequisites: ['gamete'],
              learnOrder: 59,
            },
          ],
        },
      ],
    },
  ],
};
