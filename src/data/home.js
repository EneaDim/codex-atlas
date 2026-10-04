const R = (type, en, it, url, source) => ({ type, title: { en, it }, url, source });
const PLUMBING = R("tutorial", "Practical plumbing repairs", "Riparazioni idrauliche pratiche", "https://www.thisoldhouse.com/plumbing/no-sweat-plumbing-repairs", "This Old House");
const FAUCET = R("tutorial", "Faucets and drains repair guide", "Guida a rubinetti e scarichi", "https://www.thisoldhouse.com/how-to-repair-faucets-and-drains", "This Old House");
const AERATOR = R("tutorial", "Replace a faucet aerator", "Sostituire un aeratore", "https://www.thisoldhouse.com/plumbing/how-to-replace-a-faucet-aerator", "This Old House");
const CEI = R("official", "Residential electrical installation guidance", "Guida agli impianti elettrici residenziali", "https://ceimagazine.ceinorme.it/guida-cei-64-53-per-lintegrazione-e-la-predisposizione-degli-impianti-negli-edifici/", "CEI");
const ELECTRICAL_SAFETY = R("safety", "Electrical safety for DIY", "Sicurezza elettrica nel fai da te", "https://www.electricalsafetyfirst.org.uk/safety-advice/home-and-people/diy-ers/", "Electrical Safety First");
const SOCKET_SAFETY = R("safety", "Avoid overloading sockets", "Evitare il sovraccarico delle prese", "https://www.electricalsafetyfirst.org.uk/safety-advice/home-and-people/house-maintenance/overloading-sockets/", "Electrical Safety First");
const HEATING = R("official", "Home heating guidance", "Guida al riscaldamento domestico", "https://www.efficienzaenergetica.enea.it/servizi-per/cittadini/interventi-di-efficienza-e-risparmio-energetico-nelle-abitazioni/impianti/riscaldamento.html", "ENEA");
const COOLING = R("official", "Cooling and air-conditioning guidance", "Guida a raffrescamento e climatizzazione", "https://www.efficienzaenergetica.enea.it/servizi-per/cittadini/interventi-di-efficienza-e-risparmio-energetico-nelle-abitazioni/impianti/raffrescamento.html", "ENEA");
const ENERGY = R("official", "OIKIA practical home-efficiency guide", "Guida pratica OIKIA per l’efficienza domestica", "https://www.efficienzaenergetica.enea.it/pubblicazioni/guida-pratica-oikia-meno-co2-dalla-tua-casa-per-una-nuova-cultura-dell-efficienza-energetiuca.html", "ENEA");
const DRYWALL = R("tutorial", "How to patch drywall", "Come riparare il cartongesso", "https://www.thisoldhouse.com/walls/how-to-patch-drywall", "This Old House");
const CAULK = R("tutorial", "How to caulk windows", "Come sigillare le finestre", "https://www.thisoldhouse.com/windows/how-to-caulk-windows", "This Old House");
const TOOLS = R("manual", "Drills and drivers", "Trapani e avvitatori", "https://www.bosch-diy.com/it/it/elettroutensili/trapani-e-avvitatori", "Bosch DIY");
const DRILLING = R("manual", "Drilling accessories and materials", "Accessori e materiali per foratura", "https://www.bosch-diy.com/it/it/catalogo-online-diy-ac/foratura", "Bosch DIY");
const GAS = R("safety", "SICURO GAS — domestic gas safety", "SICURO GAS — sicurezza del gas domestico", "https://www.vigilfuoco.it/media/notizie/presentato-il-nuovo-manuale-sicuro-gas-un-utilizzo-sicuro-del-gas-domestico", "Vigili del Fuoco");
const HOME_REPAIR = R("tutorial", "Common home repair questions", "Problemi comuni di manutenzione della casa", "https://www.thisoldhouse.com/basements/top-10-repair-questions", "This Old House");

const RESOURCE_INDEX = {
  "plumbing": PLUMBING,
  "faucet": FAUCET,
  "aerator": AERATOR,
  "cei": CEI,
  "electrical_safety": ELECTRICAL_SAFETY,
  "socket_safety": SOCKET_SAFETY,
  "heating": HEATING,
  "cooling": COOLING,
  "energy": ENERGY,
  "drywall": DRYWALL,
  "caulk": CAULK,
  "tools": TOOLS,
  "drilling": DRILLING,
  "gas": GAS,
  "home_repair": HOME_REPAIR,
};
const resourceList = (keys = []) => keys.map((key) => RESOURCE_INDEX[key]).filter(Boolean);
const C = (id, en, it, wikiEn, wikiIt, opts = {}) => ({ id, title: { en, it }, wiki: { en: wikiEn, it: wikiIt }, ...opts, resources: resourceList(opts.resources) });
const S = (id, en, it, descEn, descIt, concepts, opts = {}) => ({ id, title: { en, it }, description: { en: descEn, it: descIt }, ...opts, resources: resourceList(opts.resources), concepts });
const D = (id, en, it, descEn, descIt, color, systems, resources = []) => ({ id, title: { en, it }, description: { en: descEn, it: descIt }, color, resources: resourceList(resources), systems });

export const home = {
  id: 'home',
  title: { en: 'Home Codex', it: 'Casa Pratica' },
  subtitle: { en: 'A practical atlas of household systems, maintenance and safe DIY.', it: 'Un atlante pratico di impianti domestici, manutenzione e fai da te sicuro.' },
  centerLabel: { en: 'HOME', it: 'CASA' },
  centerImage: '/public/images/home-center.svg',
  preferLocalDescriptions: true,
  resourceNote: { en: 'Practical links are curated from technical bodies, public agencies, manufacturers and established how-to publishers. High-risk work is marked for qualified professionals.', it: 'I link pratici sono selezionati da enti tecnici, agenzie pubbliche, produttori e fonti how-to consolidate. I lavori ad alto rischio sono indicati come attività da tecnico qualificato.' },
  domains: [
    D("plumbing-water", "Plumbing & Water", "Idraulica e Acqua", "Water supply, fixtures, drains and the everyday components that keep water moving safely through a home.", "Alimentazione idrica, rubinetteria, scarichi e componenti quotidiani che fanno circolare l’acqua in casa.", "#3589B8", [
        S("water-supply", "Water Supply", "Alimentazione Idrica", "The incoming water network, pressure control and isolation points.", "La rete di ingresso dell’acqua, il controllo della pressione e i punti di intercettazione.", [
                C("main-water-valve", "Main water shutoff", "Valvola generale dell’acqua", "Shutoff valve", "Valvola", {}),
                C("water-meter", "Water meter", "Contatore dell’acqua", "Water metering", "Contatore dell'acqua", {}),
                C("water-pressure", "Water pressure", "Pressione dell’acqua", "Water pressure", "Pressione", {}),
                C("pressure-reducer", "Pressure reducing valve", "Riduttore di pressione", "Pressure regulator", "Riduttore di pressione", {}),
                C("water-pipe", "Water pipe", "Tubo dell’acqua", "Plumbing", "Impianto idraulico", {}),
                C("pipe-fitting", "Pipe fitting", "Raccordo idraulico", "Piping and plumbing fitting", "Raccordo", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["plumbing"]}),
        S("fixtures-faucets", "Fixtures & Faucets", "Rubinetti e Sanitari", "User-facing fixtures, valves and common service parts.", "Rubinetti, valvole e componenti di uso quotidiano.", [
                C("faucet", "Faucet", "Rubinetto", "Tap (valve)", "Rubinetto", {}),
                C("mixer-tap", "Mixer tap", "Miscelatore", "Tap (valve)", "Miscelatore", {}),
                C("faucet-aerator", "Faucet aerator", "Aeratore del rubinetto", "Faucet aerator", "Rompigetto", {"risk": "low", "difficulty": "easy", "resources": ["aerator"]}),
                C("faucet-cartridge", "Faucet cartridge", "Cartuccia del rubinetto", "Tap (valve)", "Rubinetto", {}),
                C("flexible-hose", "Flexible supply hose", "Flessibile di alimentazione", "Hose", "Tubo flessibile", {}),
                C("shower-head", "Shower head", "Soffione doccia", "Shower", "Doccia", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["faucet"]}),
        S("drainage-traps", "Drainage & Traps", "Scarichi e Sifoni", "Gravity drainage, traps, vents and common causes of slow flow.", "Scarichi a gravità, sifoni, ventilazione e cause comuni di deflusso lento.", [
                C("drain", "Drain", "Scarico", "Drain (plumbing)", "Scarico (idraulica)", {}),
                C("p-trap", "P-trap", "Sifone a P", "Trap (plumbing)", "Sifone (idraulica)", {}),
                C("sink-trap", "Sink trap", "Sifone del lavello", "Trap (plumbing)", "Sifone (idraulica)", {}),
                C("floor-drain", "Floor drain", "Piletta a pavimento", "Floor drain", "Piletta", {}),
                C("clogged-drain", "Clogged drain", "Scarico ostruito", "Drain cleaner", "Disgorgante", {}),
                C("plumbing-vent", "Plumbing vent", "Colonna di ventilazione", "Drain-waste-vent system", "Ventilazione degli scarichi", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["plumbing"]}),
        S("toilet-bathroom", "Toilet & Bathroom", "WC e Bagno", "Cistern parts, seals and sanitary fixtures.", "Componenti della cassetta, guarnizioni e sanitari.", [
                C("toilet-cistern", "Toilet cistern", "Cassetta WC", "Flush toilet", "WC", {}),
                C("fill-valve", "Toilet fill valve", "Valvola di carico", "Flush toilet", "WC", {}),
                C("flush-valve", "Flush valve", "Valvola di scarico", "Flush toilet", "WC", {}),
                C("toilet-float", "Toilet float", "Galleggiante WC", "Ballcock", "Galleggiante", {}),
                C("toilet-seal", "Toilet seal", "Guarnizione WC", "Flush toilet", "WC", {}),
                C("bathroom-silicone", "Bathroom silicone seal", "Sigillatura in silicone", "Sealant", "Sigillante", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["plumbing"]})
      ], ["plumbing"]),
    D("electricity", "Electricity", "Elettricità", "Distribution, circuits, outlets and electrical safety — with a strong boundary between observation and qualified work.", "Distribuzione, circuiti, prese e sicurezza elettrica, distinguendo chiaramente controlli semplici e lavori da tecnico qualificato.", "#D39A28", [
        S("electrical-service", "Electrical Service", "Quadro Elettrico", "The protective and switching devices at the heart of the home electrical system.", "I dispositivi di protezione e sezionamento al centro dell’impianto elettrico domestico.", [
                C("electric-meter", "Electricity meter", "Contatore elettrico", "Electricity meter", "Contatore elettrico", {}),
                C("consumer-unit", "Consumer unit", "Quadro elettrico", "Distribution board", "Quadro elettrico", {}),
                C("circuit-breaker", "Circuit breaker", "Interruttore magnetotermico", "Circuit breaker", "Interruttore automatico", {}),
                C("rcd", "Residual-current device", "Interruttore differenziale", "Residual-current device", "Interruttore differenziale", {}),
                C("main-switch", "Main switch", "Interruttore generale", "Switch", "Interruttore", {}),
                C("surge-protector", "Surge protector", "Protezione da sovratensioni", "Surge protector", "Scaricatore di sovratensione", {})
            ], {"risk": "high", "difficulty": "pro", "resources": ["cei", "electrical_safety"]}),
        S("circuits-wiring", "Circuits & Wiring", "Circuiti e Cablaggi", "Conductors, routes, boxes and the logic of household circuits.", "Conduttori, percorsi, scatole e logica dei circuiti domestici.", [
                C("live-neutral-earth", "Live, neutral & earth", "Fase, neutro e terra", "Electrical wiring", "Impianto elettrico", {}),
                C("electrical-cable", "Electrical cable", "Cavo elettrico", "Electrical wiring", "Cavo elettrico", {}),
                C("junction-box", "Junction box", "Scatola di derivazione", "Junction box", "Scatola di derivazione", {}),
                C("electrical-conduit", "Electrical conduit", "Tubo corrugato", "Electrical conduit", "Tubo protettivo", {}),
                C("cable-detector", "Cable detector", "Rilevatore di cavi", "Stud finder", "Rilevatore di montanti", {}),
                C("circuit-load", "Electrical load", "Carico elettrico", "Electrical load", "Carico elettrico", {})
            ], {"risk": "high", "difficulty": "pro", "resources": ["cei", "electrical_safety"]}),
        S("outlets-lighting", "Outlets, Switches & Lighting", "Prese, Interruttori e Luci", "The visible endpoints of household electrical circuits.", "I punti terminali visibili dei circuiti elettrici domestici.", [
                C("power-outlet", "Power outlet", "Presa elettrica", "AC power plugs and sockets", "Spina elettrica", {}),
                C("light-switch", "Light switch", "Interruttore luce", "Light switch", "Interruttore", {}),
                C("dimmer", "Dimmer", "Dimmer", "Dimmer", "Dimmer", {}),
                C("lamp-holder", "Lamp holder", "Portalampada", "Lightbulb socket", "Portalampada", {}),
                C("led-lamp", "LED lamp", "Lampada LED", "LED lamp", "Lampada a LED", {}),
                C("extension-lead", "Extension lead", "Prolunga elettrica", "Extension cord", "Prolunga elettrica", {"risk": "medium", "difficulty": "easy", "resources": ["socket_safety"]})
            ], {"risk": "high", "difficulty": "pro", "resources": ["cei", "electrical_safety"]}),
        S("electrical-diagnostics", "Electrical Diagnostics", "Diagnostica Elettrica", "Safe observation of symptoms such as tripping, heat and loss of power.", "Osservazione sicura di sintomi come scatti, surriscaldamento e mancanza di corrente.", [
                C("multimeter", "Multimeter", "Multimetro", "Multimeter", "Multimetro", {"risk": "medium", "difficulty": "moderate"}),
                C("voltage-tester", "Voltage tester", "Cercatensione", "Test light", "Cercafase", {"risk": "medium", "difficulty": "moderate"}),
                C("breaker-tripping", "Breaker tripping", "Magnetotermico che scatta", "Circuit breaker", "Interruttore automatico", {}),
                C("rcd-tripping", "RCD tripping", "Differenziale che scatta", "Residual-current device", "Interruttore differenziale", {}),
                C("hot-socket", "Overheating outlet", "Presa che si surriscalda", "Electrical fire", "Incendio elettrico", {}),
                C("power-outage", "Power outage", "Blackout domestico", "Power outage", "Blackout", {})
            ], {"risk": "high", "difficulty": "pro", "resources": ["electrical_safety", "socket_safety"]})
      ], ["cei", "electrical_safety"]),
    D("heating-climate", "Heating & Climate", "Riscaldamento e Clima", "Heating, cooling, ventilation and the controls that determine indoor comfort and energy use.", "Riscaldamento, raffrescamento, ventilazione e controlli che determinano comfort e consumi.", "#D86845", [
        S("heating-generation", "Heating Generation", "Generazione del Calore", "Boilers, heat pumps, water heating and hydraulic support components.", "Caldaie, pompe di calore, acqua calda e componenti idraulici di supporto.", [
                C("boiler", "Boiler", "Caldaia", "Boiler", "Caldaia", {}),
                C("heat-pump", "Heat pump", "Pompa di calore", "Heat pump", "Pompa di calore", {}),
                C("water-heater", "Water heater", "Scaldacqua", "Water heating", "Scaldabagno", {}),
                C("room-thermostat", "Room thermostat", "Termostato ambiente", "Thermostat", "Termostato", {}),
                C("expansion-vessel", "Expansion vessel", "Vaso di espansione", "Expansion tank", "Vaso di espansione", {}),
                C("circulation-pump", "Circulator pump", "Circolatore", "Circulator pump", "Circolatore", {})
            ], {"risk": "high", "difficulty": "pro", "resources": ["heating", "energy"]}),
        S("radiators-hydronic", "Radiators & Hydronics", "Radiatori e Circuito", "Heat emitters, valves, air removal and system pressure.", "Terminali di emissione, valvole, spurgo e pressione dell’impianto.", [
                C("radiator", "Radiator", "Radiatore", "Radiator (heating)", "Radiatore (riscaldamento)", {}),
                C("thermostatic-valve", "Thermostatic radiator valve", "Valvola termostatica", "Thermostatic radiator valve", "Valvola termostatica", {}),
                C("lockshield-valve", "Lockshield valve", "Detentore del radiatore", "Radiator (heating)", "Radiatore (riscaldamento)", {}),
                C("bleeding-radiator", "Radiator bleeding", "Spurgo del radiatore", "Radiator (heating)", "Radiatore (riscaldamento)", {"risk": "medium", "difficulty": "easy"}),
                C("heating-pressure", "Heating system pressure", "Pressione impianto termico", "Hydronic balancing", "Bilanciamento idraulico", {}),
                C("hydronic-balancing", "Hydronic balancing", "Bilanciamento idraulico", "Hydronic balancing", "Bilanciamento idraulico", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["heating"]}),
        S("cooling-ventilation", "Cooling & Ventilation", "Climatizzazione e Ventilazione", "Air conditioning, filtration, extraction and humidity management.", "Climatizzazione, filtrazione, estrazione e gestione dell’umidità.", [
                C("air-conditioner", "Air conditioner", "Condizionatore", "Air conditioning", "Aria condizionata", {}),
                C("split-system", "Split system", "Sistema split", "Air conditioning", "Aria condizionata", {}),
                C("air-filter", "Air filter", "Filtro aria", "Air filter", "Filtro dell'aria", {"risk": "low", "difficulty": "easy"}),
                C("extractor-fan", "Extractor fan", "Aspiratore", "Mechanical fan", "Ventilatore", {}),
                C("indoor-humidity", "Indoor humidity", "Umidità interna", "Humidity", "Umidità", {}),
                C("dehumidifier", "Dehumidifier", "Deumidificatore", "Dehumidifier", "Deumidificatore", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["cooling", "energy"]}),
        S("insulation-efficiency", "Insulation & Efficiency", "Isolamento ed Efficienza", "The building envelope, drafts and simple controls that reduce wasted energy.", "Involucro edilizio, spifferi e controlli semplici che riducono gli sprechi.", [
                C("thermal-insulation", "Thermal insulation", "Isolamento termico", "Thermal insulation", "Isolamento termico", {}),
                C("draft-proofing", "Draft proofing", "Eliminazione degli spifferi", "Weatherstripping", "Guarnizione", {}),
                C("window-seal", "Window seal", "Guarnizione finestra", "Weatherstripping", "Guarnizione", {}),
                C("thermal-bridge", "Thermal bridge", "Ponte termico", "Thermal bridge", "Ponte termico", {}),
                C("energy-label", "Energy label", "Etichetta energetica", "European Union energy label", "Etichetta energetica", {}),
                C("smart-thermostat", "Smart thermostat", "Termostato intelligente", "Smart thermostat", "Termostato intelligente", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["energy", "caulk"]})
      ], ["heating", "energy"]),
    D("walls-surfaces", "Walls & Surfaces", "Pareti e Superfici", "Masonry, drywall, tiles, coatings and the materials used to repair and seal interior surfaces.", "Muratura, cartongesso, piastrelle, rivestimenti e materiali per riparare e sigillare le superfici interne.", "#8B5AA7", [
        S("masonry-plaster", "Masonry & Plaster", "Muratura e Intonaco", "Common mineral materials and defects in walls and finishes.", "Materiali minerali comuni e difetti di pareti e finiture.", [
                C("brick", "Brick", "Mattone", "Brick", "Mattone", {}),
                C("mortar", "Mortar", "Malta", "Mortar (masonry)", "Malta (materiale)", {}),
                C("plaster", "Plaster", "Intonaco", "Plaster", "Intonaco", {}),
                C("wall-crack", "Wall crack", "Crepa nel muro", "Fracture", "Fessurazione", {}),
                C("rising-damp", "Damp", "Umidità di risalita", "Rising damp", "Umidità di risalita", {}),
                C("efflorescence", "Efflorescence", "Efflorescenza", "Efflorescence", "Efflorescenza", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["home_repair"]}),
        S("drywall-paint", "Drywall & Paint", "Cartongesso e Pittura", "Lightweight partitions, patching and surface finishing.", "Pareti leggere, stuccatura e finitura delle superfici.", [
                C("drywall", "Drywall", "Cartongesso", "Drywall", "Cartongesso", {}),
                C("stud-wall", "Stud wall", "Parete a montanti", "Wall stud", "Montante", {}),
                C("joint-compound", "Joint compound", "Stucco per cartongesso", "Joint compound", "Stucco", {}),
                C("wall-anchor", "Wall anchor", "Tassello da parete", "Wall plug", "Tassello", {}),
                C("primer", "Primer", "Primer", "Primer (paint)", "Primer", {}),
                C("drywall-patch", "Drywall patch", "Riparazione cartongesso", "Drywall", "Cartongesso", {"resources": ["drywall"]})
            ], {"risk": "low", "difficulty": "easy", "resources": ["drywall", "drilling"]}),
        S("tiles-sealants", "Tiles & Sealants", "Piastrelle e Sigillanti", "Tiles, joints and flexible seals around wet areas.", "Piastrelle, fughe e sigillature elastiche nelle zone umide.", [
                C("ceramic-tile", "Ceramic tile", "Piastrella", "Tile", "Piastrella", {}),
                C("tile-grout", "Grout", "Stucco per fughe", "Grout", "Stucco", {}),
                C("sanitary-silicone", "Sanitary silicone", "Silicone sanitario", "Sealant", "Sigillante", {}),
                C("caulk-gun", "Caulking gun", "Pistola per silicone", "Caulking gun", "Pistola per silicone", {}),
                C("waterproof-membrane", "Waterproof membrane", "Guaina impermeabile", "Waterproofing", "Impermeabilizzazione", {}),
                C("mold", "Mold", "Muffa", "Mold", "Muffa", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["caulk", "home_repair"]})
      ], ["home_repair"]),
    D("woodwork-hardware", "Woodwork & Hardware", "Falegnameria e Ferramenta", "Doors, windows, furniture hardware and the fasteners used to assemble and adjust them.", "Porte, finestre, ferramenta dei mobili e fissaggi usati per montare e regolare.", "#B06D38", [
        S("doors-windows", "Doors & Windows", "Porte e Finestre", "Moving hardware, seals and everyday alignment problems.", "Ferramenta mobile, guarnizioni e comuni problemi di allineamento.", [
                C("door-hinge", "Door hinge", "Cerniera porta", "Hinge", "Cerniera", {}),
                C("door-lock", "Door lock", "Serratura", "Lock and key", "Serratura", {}),
                C("door-handle", "Door handle", "Maniglia", "Door handle", "Maniglia", {}),
                C("door-alignment", "Door alignment", "Regolazione porta", "Door", "Porta", {}),
                C("window-hardware", "Window hardware", "Ferramenta finestra", "Window", "Finestra", {}),
                C("weatherstrip", "Weatherstrip", "Guarnizione infisso", "Weatherstripping", "Guarnizione", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["caulk"]}),
        S("furniture-joinery", "Furniture & Joinery", "Mobili e Giunzioni", "Common fasteners and mechanisms used in furniture and cabinetry.", "Fissaggi e meccanismi comuni usati in mobili e armadi.", [
                C("wood-screw", "Wood screw", "Vite per legno", "Screw", "Vite", {}),
                C("dowel", "Dowel", "Spinotto", "Dowel", "Spinotto", {}),
                C("wood-glue", "Wood glue", "Colla per legno", "Wood glue", "Colla vinilica", {}),
                C("shelf-bracket", "Shelf bracket", "Reggimensola", "Bracket", "Staffa", {}),
                C("cabinet-hinge", "Cabinet hinge", "Cerniera mobile", "Hinge", "Cerniera", {}),
                C("drawer-slide", "Drawer slide", "Guida cassetto", "Drawer", "Cassetto", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["tools"]}),
        S("fastening-drilling", "Fastening & Drilling", "Fissaggio e Foratura", "Selecting anchors, bits and drilling techniques for different substrates.", "Scelta di tasselli, punte e tecniche di foratura per diversi supporti.", [
                C("wall-plug", "Wall plug", "Tassello", "Wall plug", "Tassello", {}),
                C("anchor-bolt", "Anchor bolt", "Tassello ad espansione", "Anchor bolt", "Bullone di ancoraggio", {}),
                C("drill-bit", "Drill bit", "Punta da trapano", "Drill bit", "Punta da trapano", {}),
                C("pilot-hole", "Pilot hole", "Foro pilota", "Pilot hole", "Foro pilota", {}),
                C("countersink", "Countersink", "Svasatura", "Countersink", "Svasatura", {}),
                C("stud-finder", "Stud finder", "Rilevatore di montanti", "Stud finder", "Rilevatore di montanti", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["drilling", "electrical_safety"]})
      ], ["tools", "drilling"]),
    D("appliances-kitchen", "Appliances & Kitchen", "Elettrodomestici e Cucina", "Connections, filters and maintenance points of common household appliances.", "Collegamenti, filtri e punti di manutenzione dei principali elettrodomestici.", "#4C9A84", [
        S("laundry-dishwashing", "Laundry & Dishwashing", "Lavaggio e Lavastoviglie", "Water-fed appliances and their common hoses, filters and drainage points.", "Elettrodomestici collegati all’acqua e relativi tubi, filtri e scarichi.", [
                C("washing-machine", "Washing machine", "Lavatrice", "Washing machine", "Lavatrice", {}),
                C("dishwasher", "Dishwasher", "Lavastoviglie", "Dishwasher", "Lavastoviglie", {}),
                C("appliance-inlet-hose", "Inlet hose", "Tubo di carico", "Hose", "Tubo flessibile", {}),
                C("appliance-drain-hose", "Drain hose", "Tubo di scarico", "Hose", "Tubo flessibile", {}),
                C("appliance-filter", "Appliance filter", "Filtro elettrodomestico", "Filter (signal processing)", "Filtro", {}),
                C("leak-tray", "Leak tray", "Vaschetta antiallagamento", "Leak detection", "Rilevatore di perdite", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["plumbing", "energy"]}),
        S("refrigeration-cooking", "Refrigeration & Cooking", "Freddo e Cottura", "Refrigeration, ovens, cooktops and extraction systems.", "Frigoriferi, forni, piani cottura e sistemi di aspirazione.", [
                C("refrigerator", "Refrigerator", "Frigorifero", "Refrigerator", "Frigorifero", {}),
                C("freezer", "Freezer", "Congelatore", "Freezer", "Congelatore", {}),
                C("electric-oven", "Electric oven", "Forno elettrico", "Oven", "Forno", {}),
                C("induction-hob", "Induction cooking", "Piano a induzione", "Induction cooking", "Cucina a induzione", {}),
                C("gas-hob", "Gas stove", "Piano cottura a gas", "Gas stove", "Fornello a gas", {"risk": "high", "difficulty": "pro", "resources": ["gas"]}),
                C("range-hood", "Range hood", "Cappa aspirante", "Kitchen hood", "Cappa da cucina", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["energy", "gas"]}),
        S("appliance-maintenance", "Appliance Maintenance", "Manutenzione Elettrodomestici", "Routine cleaning, seals, filters and manufacturer diagnostics.", "Pulizia ordinaria, guarnizioni, filtri e diagnostica del produttore.", [
                C("descaling", "Descaling", "Decalcificazione", "Descaling agent", "Anticalcare", {}),
                C("lint-filter", "Lint filter", "Filtro lanugine", "Clothes dryer", "Asciugatrice", {}),
                C("door-gasket", "Door gasket", "Guarnizione porta", "Gasket", "Guarnizione", {}),
                C("condenser-coil", "Condenser coil", "Serpentina condensatore", "Condenser (heat transfer)", "Condensatore", {}),
                C("appliance-error-code", "Appliance error code", "Codice errore", "Error code", "Codice di errore", {}),
                C("appliance-energy-label", "Appliance energy label", "Etichetta energetica elettrodomestici", "European Union energy label", "Etichetta energetica", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["energy"]})
      ], ["energy"]),
    D("tools-materials", "Tools & Materials", "Utensili e Materiali", "The basic toolkit, powered tools, consumables and protective equipment used for practical home work.", "La cassetta degli attrezzi, elettroutensili, consumabili e protezioni per i lavori pratici in casa.", "#668B50", [
        S("hand-tools", "Hand Tools", "Utensili Manuali", "Core tools for gripping, turning, measuring and striking.", "Utensili fondamentali per afferrare, avvitare, misurare e battere.", [
                C("screwdriver", "Screwdriver", "Cacciavite", "Screwdriver", "Cacciavite", {}),
                C("adjustable-wrench", "Adjustable wrench", "Chiave regolabile", "Adjustable spanner", "Chiave inglese", {}),
                C("pliers", "Pliers", "Pinza", "Pliers", "Pinza", {}),
                C("spirit-level", "Spirit level", "Livella", "Spirit level", "Livella", {}),
                C("utility-knife", "Utility knife", "Taglierino", "Utility knife", "Taglierino", {}),
                C("hammer", "Hammer", "Martello", "Hammer", "Martello", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["tools"]}),
        S("power-tools", "Power Tools", "Elettroutensili", "Common powered tools and the work they are designed to do.", "Elettroutensili comuni e lavori per cui sono progettati.", [
                C("drill-driver", "Drill/driver", "Trapano avvitatore", "Drill", "Trapano", {}),
                C("hammer-drill", "Hammer drill", "Trapano a percussione", "Hammer drill", "Trapano a percussione", {}),
                C("impact-driver", "Impact driver", "Avvitatore a impulsi", "Impact driver", "Avvitatore a impulsi", {}),
                C("jigsaw", "Jigsaw", "Seghetto alternativo", "Jigsaw (tool)", "Seghetto alternativo", {}),
                C("orbital-sander", "Orbital sander", "Levigatrice orbitale", "Sander", "Levigatrice", {}),
                C("angle-grinder", "Angle grinder", "Smerigliatrice angolare", "Angle grinder", "Smerigliatrice angolare", {"risk": "high", "difficulty": "pro"})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["tools", "electrical_safety"]}),
        S("consumables-adhesives", "Consumables & Adhesives", "Consumabili e Adesivi", "Tapes, lubricants and adhesives used for sealing and assembly.", "Nastri, lubrificanti e adesivi usati per sigillatura e montaggio.", [
                C("ptfe-tape", "PTFE thread seal tape", "Nastro PTFE", "Thread seal tape", "Nastro in PTFE", {}),
                C("plumbers-putty", "Plumber’s putty", "Mastice idraulico", "Plumber's putty", "Mastice", {}),
                C("penetrating-oil", "Penetrating oil", "Olio penetrante", "Penetrating oil", "Olio penetrante", {}),
                C("threadlocker", "Threadlocker", "Frenafiletti", "Thread-locking fluid", "Frenafiletti", {}),
                C("epoxy-adhesive", "Epoxy adhesive", "Adesivo epossidico", "Epoxy", "Resina epossidica", {}),
                C("construction-adhesive", "Construction adhesive", "Adesivo da montaggio", "Adhesive", "Adesivo", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["tools"]}),
        S("measurement-ppe", "Measurement & PPE", "Misura e Protezione", "Measurement, detection and personal protection before starting a job.", "Misura, rilevazione e protezione personale prima di iniziare un lavoro.", [
                C("tape-measure", "Tape measure", "Metro a nastro", "Tape measure", "Metro a nastro", {}),
                C("laser-level", "Laser level", "Livella laser", "Laser level", "Livella laser", {}),
                C("wall-scanner", "Wall scanner", "Scanner da parete", "Stud finder", "Rilevatore di montanti", {}),
                C("safety-glasses", "Safety glasses", "Occhiali protettivi", "Eye protection", "Occhiali di protezione", {}),
                C("work-gloves", "Work gloves", "Guanti da lavoro", "Glove", "Guanto", {}),
                C("dust-mask", "Dust mask", "Maschera antipolvere", "Dust mask", "Maschera antipolvere", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["tools", "electrical_safety"]})
      ], ["tools"]),
    D("safety-maintenance", "Safety & Maintenance", "Sicurezza e Manutenzione", "Emergencies, gas and fire safety, exterior water management and recurring checks that prevent damage.", "Emergenze, sicurezza gas/incendio, gestione dell’acqua esterna e controlli periodici che prevengono danni.", "#C6534D", [
        S("gas-fire", "Gas & Fire Safety", "Gas e Incendio", "Recognition, alarms and safe escalation for gas and fire hazards.", "Riconoscimento, allarmi e corretta escalation per rischi gas e incendio.", [
                C("gas-shutoff", "Gas shutoff valve", "Valvola generale gas", "Gas safety", "Sicurezza del gas", {"risk": "high", "difficulty": "pro"}),
                C("gas-leak", "Gas leak", "Perdita di gas", "Gas leak", "Fuga di gas", {"risk": "high", "difficulty": "pro"}),
                C("carbon-monoxide-alarm", "Carbon monoxide detector", "Rilevatore di monossido", "Carbon monoxide detector", "Rilevatore di monossido di carbonio", {}),
                C("smoke-alarm", "Smoke detector", "Rilevatore di fumo", "Smoke detector", "Rilevatore di fumo", {}),
                C("fire-extinguisher", "Fire extinguisher", "Estintore", "Fire extinguisher", "Estintore", {}),
                C("gas-appliance", "Gas appliance", "Apparecchio a gas", "Gas appliance", "Apparecchio a gas", {"risk": "high", "difficulty": "pro"})
            ], {"risk": "high", "difficulty": "pro", "resources": ["gas"]}),
        S("water-emergency", "Water Emergencies", "Emergenze Acqua", "Fast actions and diagnosis when water threatens the building.", "Azioni rapide e diagnosi quando l’acqua minaccia l’edificio.", [
                C("emergency-water-shutoff", "Emergency water shutoff", "Chiusura acqua in emergenza", "Shutoff valve", "Valvola", {"risk": "medium", "difficulty": "easy"}),
                C("burst-pipe", "Burst pipe", "Tubo scoppiato", "Plumbing", "Impianto idraulico", {}),
                C("leak-detection", "Leak detection", "Rilevazione perdite", "Leak detection", "Rilevatore di perdite", {}),
                C("home-flooding", "Home flooding", "Allagamento domestico", "Flood", "Alluvione", {}),
                C("freeze-protection", "Freeze protection", "Protezione dal gelo", "Pipe freezing", "Congelamento", {}),
                C("water-damage", "Water damage", "Danno da acqua", "Water damage", "Danno da acqua", {})
            ], {"risk": "medium", "difficulty": "moderate", "resources": ["plumbing", "home_repair"]}),
        S("roof-gutters-exterior", "Roof, Gutters & Exterior", "Tetto, Gronde ed Esterni", "Rainwater shedding and exterior seals, with fall risk treated explicitly.", "Smaltimento dell’acqua piovana e sigillature esterne, con attenzione esplicita al rischio di caduta.", [
                C("gutter", "Rain gutter", "Grondaia", "Rain gutter", "Grondaia", {}),
                C("downspout", "Downspout", "Pluviale", "Rain gutter", "Pluviale", {}),
                C("roof-tile", "Roof tile", "Tegola", "Roof tile", "Tegola", {}),
                C("roof-flashing", "Roof flashing", "Scossalina", "Flashing (weatherproofing)", "Scossalina", {}),
                C("exterior-sealant", "Exterior sealant", "Sigillante esterno", "Sealant", "Sigillante", {}),
                C("drainage-channel", "Drainage channel", "Canaletta di drenaggio", "Drainage system", "Drenaggio", {})
            ], {"risk": "high", "difficulty": "pro", "resources": ["caulk", "home_repair"]}),
        S("routine-maintenance", "Routine Maintenance", "Manutenzione Periodica", "Simple recurring checks that catch problems before they become repairs.", "Controlli ricorrenti semplici che intercettano i problemi prima che diventino riparazioni.", [
                C("maintenance-schedule", "Maintenance schedule", "Piano di manutenzione", "Preventive maintenance", "Manutenzione preventiva", {}),
                C("alarm-test", "Alarm testing", "Test degli allarmi", "Smoke detector", "Rilevatore di fumo", {}),
                C("filter-cleaning", "Filter cleaning", "Pulizia filtri", "Air filter", "Filtro dell'aria", {}),
                C("hose-inspection", "Hose inspection", "Controllo tubi flessibili", "Hose", "Tubo flessibile", {}),
                C("sealant-inspection", "Sealant inspection", "Controllo sigillature", "Sealant", "Sigillante", {}),
                C("seasonal-checklist", "Seasonal checklist", "Checklist stagionale", "Preventive maintenance", "Manutenzione preventiva", {})
            ], {"risk": "low", "difficulty": "easy", "resources": ["energy", "home_repair"]})
      ], ["gas", "home_repair"])
  ],
};
