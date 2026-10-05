export const statistics = {
  "id": "statistics",
  "title": {
    "it": "Statistics Codex",
    "en": "Statistics Codex"
  },
  "subtitle": {
    "it": "Politecnico di Torino · Ingegneria Gestionale · Statistica (2° anno)",
    "en": "Politecnico di Torino · Management Engineering · Statistics (2nd year)"
  },
  "centerLabel": {
    "it": "STATISTICA",
    "en": "STATISTICS"
  },
  "centerImage": "/public/images/statistics/center.svg",
  "resourceNote": {
    "it": "Contenuti sintetizzati esclusivamente dai sei notebook del corso caricati in questo progetto. Le formule e gli esempi seguono la terminologia e la progressione delle note.",
    "en": "Content summarized exclusively from the six course notebooks provided for this project. Formulas and examples follow the terminology and progression of the notes."
  },
  "domains": [
    {
      "id": "stat-ch1",
      "title": {
        "it": "Eventi e probabilità",
        "en": "Events & probability"
      },
      "description": {
        "it": "Linguaggio di base: casualità, interpretazioni della probabilità, spazio campione, eventi e σ-algebre.",
        "en": "Foundational language: randomness, interpretations of probability, sample spaces, events and sigma-algebras."
      },
      "color": "#8B5CF6",
      "systems": [
        {
          "id": "stat-randomness-interpretations",
          "title": {
            "it": "Casualità e interpretazioni",
            "en": "Randomness & interpretations"
          },
          "description": {
            "it": "Come si descrive un fenomeno casuale e quali letture della probabilità compaiono nelle note.",
            "en": "How a random phenomenon is described and which interpretations of probability appear in the notes."
          },
          "concepts": [
            {
              "id": "stat-random-phenomenon",
              "title": {
                "it": "Fenomeno casuale",
                "en": "Random phenomenon"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Un fenomeno casuale ha un esito non prevedibile a priori e può cambiare ripetendo l’esperimento nelle stesse condizioni.",
                "en": "A random phenomenon has an outcome that cannot be predicted in advance and may change when the experiment is repeated under the same conditions."
              },
              "study": {
                "summary": {
                  "it": "Un fenomeno casuale ha un esito non prevedibile a priori e può cambiare ripetendo l’esperimento nelle stesse condizioni.",
                  "en": "A random phenomenon has an outcome that cannot be predicted in advance and may change when the experiment is repeated under the same conditions."
                },
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Nel lancio di un dado equilibrato, l’esito può essere uno qualunque tra 1 e 6.",
                    "en": "For a fair die, the outcome can be any value from 1 to 6."
                  },
                  "tex": "S=\\{1,2,3,4,5,6\\}"
                },
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-classical-probability",
              "title": {
                "it": "Probabilità classica",
                "en": "Classical probability"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Negli spazi finiti equiprobabili la probabilità è il rapporto tra casi favorevoli e casi possibili.",
                "en": "In finite equiprobable spaces, probability is the ratio between favorable and possible outcomes."
              },
              "study": {
                "summary": {
                  "it": "Negli spazi finiti equiprobabili la probabilità è il rapporto tra casi favorevoli e casi possibili.",
                  "en": "In finite equiprobable spaces, probability is the ratio between favorable and possible outcomes."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Casi favorevoli / possibili",
                      "en": "Favorable / possible outcomes"
                    },
                    "tex": "P(E)=\\frac{\\#E}{\\#S}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "E",
                    "label": {
                      "it": "evento di interesse",
                      "en": "event of interest"
                    }
                  },
                  {
                    "symbol": "\\#E",
                    "label": {
                      "it": "numero di casi favorevoli",
                      "en": "number of favorable outcomes"
                    }
                  },
                  {
                    "symbol": "\\#S",
                    "label": {
                      "it": "numero totale di casi possibili",
                      "en": "total number of possible outcomes"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con un dado, l’evento “numero dispari” ha 3 casi favorevoli su 6.",
                    "en": "With a die, the event “odd number” has 3 favorable outcomes out of 6."
                  },
                  "tex": "P(\\{1,3,5\\})=\\frac36=\\frac12"
                },
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-relative-frequency",
              "title": {
                "it": "Frequenza relativa",
                "en": "Relative frequency"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Ripetendo un esperimento N volte, la frequenza relativa misura la quota di prove in cui si osserva l’evento.",
                "en": "After repeating an experiment N times, relative frequency measures the fraction of trials in which the event occurs."
              },
              "study": {
                "summary": {
                  "it": "Ripetendo un esperimento N volte, la frequenza relativa misura la quota di prove in cui si osserva l’evento.",
                  "en": "After repeating an experiment N times, relative frequency measures the fraction of trials in which the event occurs."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "f_N(E)=\\frac{\\text{numero di volte in cui si verifica }E}{N}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "N",
                    "label": {
                      "it": "numero di prove",
                      "en": "number of trials"
                    }
                  },
                  {
                    "symbol": "f_N(E)",
                    "label": {
                      "it": "frequenza relativa dell’evento E",
                      "en": "relative frequency of event E"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-axiomatic-view",
              "title": {
                "it": "Impostazione assiomatica",
                "en": "Axiomatic view"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "L’impostazione moderna descrive risultati, eventi ammissibili e una funzione di probabilità coerente, invece di affidarsi solo al conteggio.",
                "en": "The modern axiomatic view describes outcomes, admissible events and a coherent probability function rather than relying only on counting."
              },
              "study": {
                "summary": {
                  "it": "L’impostazione moderna descrive risultati, eventi ammissibili e una funzione di probabilità coerente, invece di affidarsi solo al conteggio.",
                  "en": "The modern axiomatic view describes outcomes, admissible events and a coherent probability function rather than relying only on counting."
                },
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-sample-events",
          "title": {
            "it": "Spazio campione ed eventi",
            "en": "Sample space & events"
          },
          "description": {
            "it": "Il linguaggio insiemistico che rappresenta esperimenti, risultati ed eventi.",
            "en": "The set-based language used to represent experiments, outcomes and events."
          },
          "concepts": [
            {
              "id": "stat-sample-space",
              "title": {
                "it": "Spazio campione",
                "en": "Sample space"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Lo spazio campione S è l’insieme di tutti i possibili risultati dell’esperimento; può essere finito, discreto infinito o continuo.",
                "en": "The sample space S is the set of all possible outcomes; it may be finite, countably infinite or continuous."
              },
              "study": {
                "summary": {
                  "it": "Lo spazio campione S è l’insieme di tutti i possibili risultati dell’esperimento; può essere finito, discreto infinito o continuo.",
                  "en": "The sample space S is the set of all possible outcomes; it may be finite, countably infinite or continuous."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "S=\\{\\text{tutti i risultati possibili}\\}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per la durata di un componente elettronico lo spazio può essere continuo.",
                    "en": "For the lifetime of an electronic component the space can be continuous."
                  },
                  "tex": "S=\\mathbb{R}_{\\ge 0}"
                },
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-event",
              "title": {
                "it": "Evento",
                "en": "Event"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Un evento è un sottoinsieme dello spazio campione: raccoglie gli esiti di cui vogliamo studiare la probabilità.",
                "en": "An event is a subset of the sample space: it collects the outcomes whose probability we want to study."
              },
              "study": {
                "summary": {
                  "it": "Un evento è un sottoinsieme dello spazio campione: raccoglie gli esiti di cui vogliamo studiare la probabilità.",
                  "en": "An event is a subset of the sample space: it collects the outcomes whose probability we want to study."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E\\subseteq S"
                  }
                ],
                "terms": [
                  {
                    "symbol": "S",
                    "label": {
                      "it": "spazio campione",
                      "en": "sample space"
                    }
                  },
                  {
                    "symbol": "E",
                    "label": {
                      "it": "evento",
                      "en": "event"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-complement",
              "title": {
                "it": "Complementare",
                "en": "Complement"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Il complementare Eᶜ contiene tutti gli esiti in cui E non si verifica.",
                "en": "The complement Eᶜ contains all outcomes for which E does not occur."
              },
              "study": {
                "summary": {
                  "it": "Il complementare Eᶜ contiene tutti gli esiti in cui E non si verifica.",
                  "en": "The complement Eᶜ contains all outcomes for which E does not occur."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E^c=S\\setminus E"
                  }
                ],
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-union-intersection",
              "title": {
                "it": "Unione e intersezione",
                "en": "Union & intersection"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "L’unione rappresenta “E oppure F oppure entrambi”; l’intersezione rappresenta “E e F insieme”.",
                "en": "The union means “E or F or both”; the intersection means “E and F together”."
              },
              "study": {
                "summary": {
                  "it": "L’unione rappresenta “E oppure F oppure entrambi”; l’intersezione rappresenta “E e F insieme”.",
                  "en": "The union means “E or F or both”; the intersection means “E and F together”."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E\\cup F \\qquad E\\cap F"
                  }
                ],
                "terms": [
                  {
                    "symbol": "E\\cup F",
                    "label": {
                      "it": "si verifica almeno uno dei due eventi",
                      "en": "at least one of the two events occurs"
                    }
                  },
                  {
                    "symbol": "E\\cap F",
                    "label": {
                      "it": "si verificano entrambi gli eventi",
                      "en": "both events occur"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-event-families",
          "title": {
            "it": "Famiglie di eventi",
            "en": "Families of events"
          },
          "description": {
            "it": "Le collezioni di eventi ammissibili usate per definire coerentemente una probabilità.",
            "en": "Collections of admissible events used to define probability consistently."
          },
          "concepts": [
            {
              "id": "stat-algebra",
              "title": {
                "it": "Algebra degli eventi",
                "en": "Event algebra"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Un’algebra contiene S ed è chiusa rispetto a complementare e unione; da queste proprietà segue anche la chiusura per intersezione.",
                "en": "An event algebra contains S and is closed under complements and unions; closure under intersections follows."
              },
              "study": {
                "summary": {
                  "it": "Un’algebra contiene S ed è chiusa rispetto a complementare e unione; da queste proprietà segue anche la chiusura per intersezione.",
                  "en": "An event algebra contains S and is closed under complements and unions; closure under intersections follows."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Legge di De Morgan",
                      "en": "De Morgan's law"
                    },
                    "tex": "E\\cap F=(E^c\\cup F^c)^c"
                  }
                ],
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            },
            {
              "id": "stat-sigma-algebra",
              "title": {
                "it": "Sigma-algebra",
                "en": "Sigma-algebra"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Una σ-algebra è un’algebra chiusa anche rispetto a unioni numerabili, cioè a sequenze infinite di eventi.",
                "en": "A sigma-algebra is an algebra also closed under countable unions, i.e. infinite sequences of events."
              },
              "study": {
                "summary": {
                  "it": "Una σ-algebra è un’algebra chiusa anche rispetto a unioni numerabili, cioè a sequenze infinite di eventi.",
                  "en": "A sigma-algebra is an algebra also closed under countable unions, i.e. infinite sequences of events."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E_1,E_2,\\ldots\\in\\mathcal A\\;\\Longrightarrow\\;\\bigcup_{i=1}^{\\infty}E_i\\in\\mathcal A"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per un dado si può scegliere la σ-algebra completa 2^S, che contiene 64 eventi.",
                    "en": "For a die one may choose the full sigma-algebra 2^S, containing 64 events."
                  },
                  "tex": "\\#(2^S)=2^6=64"
                },
                "source": {
                  "it": "Capitolo 1 · notebook del corso",
                  "en": "Chapter 1 · course notebook"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "stat-ch2",
      "title": {
        "it": "Assiomi, combinatoria e campionamento",
        "en": "Axioms, combinatorics & sampling"
      },
      "description": {
        "it": "Assiomi di Kolmogorov, inclusione-esclusione, conteggio combinatorio e campionamento.",
        "en": "Kolmogorov axioms, inclusion-exclusion, combinatorial counting and sampling."
      },
      "color": "#E5A63A",
      "systems": [
        {
          "id": "stat-kolmogorov",
          "title": {
            "it": "Assiomi e conseguenze",
            "en": "Axioms & consequences"
          },
          "description": {
            "it": "Le regole fondamentali che una funzione di probabilità deve rispettare.",
            "en": "The fundamental rules a probability function must satisfy."
          },
          "concepts": [
            {
              "id": "stat-kolmogorov-axioms",
              "title": {
                "it": "Assiomi di Kolmogorov",
                "en": "Kolmogorov axioms"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La probabilità è non negativa, assegna valore 1 all’evento certo ed è additiva su eventi disgiunti.",
                "en": "Probability is non-negative, assigns value 1 to the certain event and is additive over disjoint events."
              },
              "study": {
                "summary": {
                  "it": "La probabilità è non negativa, assegna valore 1 all’evento certo ed è additiva su eventi disgiunti.",
                  "en": "Probability is non-negative, assigns value 1 to the certain event and is additive over disjoint events."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E)\\ge0,\\qquad P(S)=1"
                  },
                  {
                    "title": {
                      "it": "Additività per eventi disgiunti",
                      "en": "Additivity for disjoint events"
                    },
                    "tex": "P\\!\\left(\\bigcup_i E_i\\right)=\\sum_iP(E_i)"
                  }
                ],
                "terms": [
                  {
                    "symbol": "S",
                    "label": {
                      "it": "spazio campione",
                      "en": "sample space"
                    }
                  },
                  {
                    "symbol": "E_i",
                    "label": {
                      "it": "eventi disgiunti",
                      "en": "disjoint events"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-complement-rule",
              "title": {
                "it": "Regola del complementare",
                "en": "Complement rule"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La probabilità che E non accada si ottiene sottraendo da 1 la probabilità di E.",
                "en": "The probability that E does not occur is one minus the probability of E."
              },
              "study": {
                "summary": {
                  "it": "La probabilità che E non accada si ottiene sottraendo da 1 la probabilità di E.",
                  "en": "The probability that E does not occur is one minus the probability of E."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E^c)=1-P(E)"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Se un evento ha probabilità 0.3, il suo complementare ha probabilità 0.7.",
                    "en": "If an event has probability 0.3, its complement has probability 0.7."
                  },
                  "tex": "P(E^c)=1-0.3=0.7"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-monotonicity",
              "title": {
                "it": "Monotonia",
                "en": "Monotonicity"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Se F è contenuto in E, allora E non può avere probabilità minore di F.",
                "en": "If F is contained in E, then E cannot have smaller probability than F."
              },
              "study": {
                "summary": {
                  "it": "Se F è contenuto in E, allora E non può avere probabilità minore di F.",
                  "en": "If F is contained in E, then E cannot have smaller probability than F."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "F\\subseteq E\\;\\Longrightarrow\\;P(F)\\le P(E)"
                  }
                ],
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-addition",
          "title": {
            "it": "Addizione e inclusione-esclusione",
            "en": "Addition & inclusion-exclusion"
          },
          "description": {
            "it": "Come calcolare la probabilità dell’unione evitando doppi conteggi.",
            "en": "How to calculate union probabilities while avoiding double counting."
          },
          "concepts": [
            {
              "id": "stat-addition-two",
              "title": {
                "it": "Regola di addizione",
                "en": "Addition rule"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per due eventi generici si sommano le probabilità e si sottrae l’intersezione, che altrimenti sarebbe contata due volte.",
                "en": "For two general events, add their probabilities and subtract the intersection, which would otherwise be counted twice."
              },
              "study": {
                "summary": {
                  "it": "Per due eventi generici si sommano le probabilità e si sottrae l’intersezione, che altrimenti sarebbe contata due volte.",
                  "en": "For two general events, add their probabilities and subtract the intersection, which would otherwise be counted twice."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E\\cup F)=P(E)+P(F)-P(E\\cap F)"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con un dado: E=pari, F=>3. L’unione contiene 4 risultati su 6.",
                    "en": "With a die: E=even, F=>3. The union contains 4 outcomes out of 6."
                  },
                  "tex": "\\frac36+\\frac36-\\frac26=\\frac46"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-inclusion-three",
              "title": {
                "it": "Inclusione-esclusione: 3 eventi",
                "en": "Inclusion-exclusion: 3 events"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Con tre eventi si alternano singoli, intersezioni a coppie e intersezione tripla per contare ogni esito una sola volta.",
                "en": "With three events, single probabilities, pairwise intersections and the triple intersection alternate so each outcome is counted once."
              },
              "study": {
                "summary": {
                  "it": "Con tre eventi si alternano singoli, intersezioni a coppie e intersezione tripla per contare ogni esito una sola volta.",
                  "en": "With three events, single probabilities, pairwise intersections and the triple intersection alternate so each outcome is counted once."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E\\cup F\\cup G)=P(E)+P(F)+P(G)-P(E\\cap F)-P(E\\cap G)-P(F\\cap G)+P(E\\cap F\\cap G)"
                  }
                ],
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-inclusion-four",
              "title": {
                "it": "Inclusione-esclusione: 4 eventi",
                "en": "Inclusion-exclusion: 4 events"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per quattro eventi il pattern continua: + singoli, − coppie, + terne, − intersezione quadrupla.",
                "en": "For four events the pattern continues: + singles, − pairs, + triples, − the four-way intersection."
              },
              "study": {
                "summary": {
                  "it": "Per quattro eventi il pattern continua: + singoli, − coppie, + terne, − intersezione quadrupla.",
                  "en": "For four events the pattern continues: + singles, − pairs, + triples, − the four-way intersection."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "+\\text{ singoli}-\\text{ coppie}+\\text{ terne}-\\text{ quadrupla}"
                  }
                ],
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-counting",
          "title": {
            "it": "Combinatoria",
            "en": "Combinatorics"
          },
          "description": {
            "it": "Formule per contare configurazioni quando l’ordine conta o non conta.",
            "en": "Counting formulas for configurations where order matters or does not matter."
          },
          "concepts": [
            {
              "id": "stat-factorial",
              "title": {
                "it": "Fattoriale",
                "en": "Factorial"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Il numero di modi per ordinare n elementi distinti è n fattoriale.",
                "en": "The number of ways to order n distinct elements is n factorial."
              },
              "study": {
                "summary": {
                  "it": "Il numero di modi per ordinare n elementi distinti è n fattoriale.",
                  "en": "The number of ways to order n distinct elements is n factorial."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "n!=n(n-1)\\cdots2\\cdot1"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Quattro elementi distinti possono essere ordinati in 24 modi.",
                    "en": "Four distinct elements can be ordered in 24 ways."
                  },
                  "tex": "4!=24"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-ordered-selection",
              "title": {
                "it": "Scelta con ordine",
                "en": "Ordered selection"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Se scegli k elementi tra n senza ripetizione e l’ordine conta, usi le disposizioni semplici.",
                "en": "If you choose k elements from n without repetition and order matters, use ordered selections."
              },
              "study": {
                "summary": {
                  "it": "Se scegli k elementi tra n senza ripetizione e l’ordine conta, usi le disposizioni semplici.",
                  "en": "If you choose k elements from n without repetition and order matters, use ordered selections."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\frac{n!}{(n-k)!}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "n",
                    "label": {
                      "it": "numero totale di elementi",
                      "en": "total number of elements"
                    }
                  },
                  {
                    "symbol": "k",
                    "label": {
                      "it": "numero di elementi scelti",
                      "en": "number of selected elements"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-combinations",
              "title": {
                "it": "Combinazioni",
                "en": "Combinations"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Se scegli k elementi tra n e l’ordine non conta, dividi anche per k! per eliminare i riordinamenti dello stesso gruppo.",
                "en": "If you choose k elements from n and order does not matter, divide by k! to remove reorderings of the same group."
              },
              "study": {
                "summary": {
                  "it": "Se scegli k elementi tra n e l’ordine non conta, dividi anche per k! per eliminare i riordinamenti dello stesso gruppo.",
                  "en": "If you choose k elements from n and order does not matter, divide by k! to remove reorderings of the same group."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\binom nk=\\frac{n!}{k!(n-k)!}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Scegliere 2 elementi tra 5 senza ordine dà 10 gruppi.",
                    "en": "Choosing 2 elements from 5 without order gives 10 groups."
                  },
                  "tex": "\\binom52=10"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-sampling",
          "title": {
            "it": "Campionamento",
            "en": "Sampling"
          },
          "description": {
            "it": "Differenza tra estrazioni con e senza reimmissione e le relative formule di conteggio.",
            "en": "Difference between sampling with and without replacement and the corresponding counting formulas."
          },
          "concepts": [
            {
              "id": "stat-with-replacement",
              "title": {
                "it": "Con reimmissione · forma binomiale",
                "en": "With replacement · binomial form"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Con reimmissione la composizione del lotto resta invariata; il numero di difettosi in n estrazioni segue la forma binomiale delle note.",
                "en": "With replacement the lot composition stays unchanged; the number of defectives in n draws follows the binomial form used in the notes."
              },
              "study": {
                "summary": {
                  "it": "Con reimmissione la composizione del lotto resta invariata; il numero di difettosi in n estrazioni segue la forma binomiale delle note.",
                  "en": "With replacement the lot composition stays unchanged; the number of defectives in n draws follows the binomial form used in the notes."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E_k)=\\binom nk\\left(\\frac KM\\right)^k\\left(\\frac{M-K}{M}\\right)^{n-k}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "M",
                    "label": {
                      "it": "dimensione del lotto",
                      "en": "lot size"
                    }
                  },
                  {
                    "symbol": "K",
                    "label": {
                      "it": "elementi difettosi nel lotto",
                      "en": "defective items in the lot"
                    }
                  },
                  {
                    "symbol": "n",
                    "label": {
                      "it": "numero di estrazioni",
                      "en": "number of draws"
                    }
                  },
                  {
                    "symbol": "k",
                    "label": {
                      "it": "difettosi richiesti",
                      "en": "required defectives"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Lotto da 10, 2 difettosi, 3 estrazioni con reimmissione: esattamente 1 difettoso.",
                    "en": "Lot of 10 with 2 defectives, 3 draws with replacement: exactly 1 defective."
                  },
                  "tex": "\\binom31(0.2)(0.8)^2=0.384"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-without-replacement",
              "title": {
                "it": "Senza reimmissione · forma ipergeometrica",
                "en": "Without replacement · hypergeometric form"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Senza reimmissione la composizione cambia dopo ogni estrazione; conviene contare direttamente i campioni senza ordine.",
                "en": "Without replacement the composition changes after each draw; it is convenient to count unordered samples directly."
              },
              "study": {
                "summary": {
                  "it": "Senza reimmissione la composizione cambia dopo ogni estrazione; conviene contare direttamente i campioni senza ordine.",
                  "en": "Without replacement the composition changes after each draw; it is convenient to count unordered samples directly."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E_k)=\\frac{\\binom Kk\\binom{M-K}{n-k}}{\\binom Mn}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "M",
                    "label": {
                      "it": "dimensione del lotto",
                      "en": "lot size"
                    }
                  },
                  {
                    "symbol": "K",
                    "label": {
                      "it": "difettosi disponibili",
                      "en": "available defectives"
                    }
                  },
                  {
                    "symbol": "n",
                    "label": {
                      "it": "dimensione del campione",
                      "en": "sample size"
                    }
                  },
                  {
                    "symbol": "k",
                    "label": {
                      "it": "difettosi nel campione",
                      "en": "defectives in the sample"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Stesso lotto: 3 estrazioni senza reimmissione, esattamente 1 difettoso.",
                    "en": "Same lot: 3 draws without replacement, exactly 1 defective."
                  },
                  "tex": "\\frac{\\binom21\\binom82}{\\binom{10}{3}}=\\frac7{15}\\approx0.4667"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            },
            {
              "id": "stat-probability-tree",
              "title": {
                "it": "Diagramma ad albero",
                "en": "Probability tree"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "In un albero si moltiplicano le probabilità lungo ogni percorso e si sommano i percorsi favorevoli dello stesso evento.",
                "en": "In a probability tree, multiply probabilities along each path and add favorable paths belonging to the same event."
              },
              "study": {
                "summary": {
                  "it": "In un albero si moltiplicano le probabilità lungo ogni percorso e si sommano i percorsi favorevoli dello stesso evento.",
                  "en": "In a probability tree, multiply probabilities along each path and add favorable paths belonging to the same event."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(\\text{percorso})=\\prod \\text{ probabilità dei rami}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Moneta: T→altra moneta, C→dado. L’evento (T,T) oppure (C,1) oppure (C,2) vale 5/12.",
                    "en": "Coin: H→another coin, T→die. The event (H,H) or (T,1) or (T,2) has probability 5/12."
                  },
                  "tex": "\\frac14+\\frac1{12}+\\frac1{12}=\\frac5{12}"
                },
                "source": {
                  "it": "Capitolo 2 · notebook del corso",
                  "en": "Chapter 2 · course notebook"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "stat-ch3",
      "title": {
        "it": "Condizionata, Bayes e indipendenza",
        "en": "Conditional probability, Bayes & independence"
      },
      "description": {
        "it": "Nuova informazione, regola moltiplicativa, probabilità totali, Bayes e indipendenza.",
        "en": "New information, product rule, total probability, Bayes and independence."
      },
      "color": "#4B9BE8",
      "systems": [
        {
          "id": "stat-conditioning",
          "title": {
            "it": "Probabilità condizionata",
            "en": "Conditional probability"
          },
          "description": {
            "it": "Come cambia lo spazio dei casi quando sappiamo che un evento si è già verificato.",
            "en": "How the space of possible outcomes changes once we know an event has occurred."
          },
          "concepts": [
            {
              "id": "stat-conditional-probability",
              "title": {
                "it": "Probabilità condizionata",
                "en": "Conditional probability"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La probabilità di F sapendo che E è avvenuto si ottiene restringendo l’attenzione all’evento E.",
                "en": "The probability of F given that E occurred is obtained by restricting attention to event E."
              },
              "study": {
                "summary": {
                  "it": "La probabilità di F sapendo che E è avvenuto si ottiene restringendo l’attenzione all’evento E.",
                  "en": "The probability of F given that E occurred is obtained by restricting attention to event E."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(F\\mid E)=\\frac{P(E\\cap F)}{P(E)},\\qquad P(E)>0"
                  }
                ],
                "terms": [
                  {
                    "symbol": "P(F\\mid E)",
                    "label": {
                      "it": "probabilità di F dato E",
                      "en": "probability of F given E"
                    }
                  },
                  {
                    "symbol": "P(E\\cap F)",
                    "label": {
                      "it": "probabilità che avvengano entrambi",
                      "en": "probability that both occur"
                    }
                  },
                  {
                    "symbol": "P(E)",
                    "label": {
                      "it": "probabilità dell’informazione su cui condizioniamo",
                      "en": "probability of the conditioning event"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Nel lotto di pneumatici: 25 hanno E e 7 hanno anche F. Condizionando su E, il denominatore diventa 25.",
                    "en": "In the tire lot: 25 have E and 7 also have F. Conditioning on E changes the denominator to 25."
                  },
                  "tex": "P(F\\mid E)=\\frac7{25}=0.28"
                },
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            },
            {
              "id": "stat-conditional-finite",
              "title": {
                "it": "Condizionata in spazio equiprobabile",
                "en": "Conditional probability in an equiprobable space"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "In uno spazio finito equiprobabile si conta l’intersezione E∩F rispetto ai soli esiti contenuti in E.",
                "en": "In a finite equiprobable space, count E∩F relative only to the outcomes contained in E."
              },
              "study": {
                "summary": {
                  "it": "In uno spazio finito equiprobabile si conta l’intersezione E∩F rispetto ai soli esiti contenuti in E.",
                  "en": "In a finite equiprobable space, count E∩F relative only to the outcomes contained in E."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(F\\mid E)=\\frac{\\#(E\\cap F)}{\\#E}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Due dadi: F=somma>8, E=almeno un 6. Tra gli 11 esiti di E, 7 sono anche in F.",
                    "en": "Two dice: F=sum>8, E=at least one 6. Of the 11 outcomes in E, 7 also belong to F."
                  },
                  "tex": "P(F\\mid E)=\\frac7{11}\\approx0.6364"
                },
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            },
            {
              "id": "stat-conditioning-order",
              "title": {
                "it": "L’ordine del condizionamento",
                "en": "Conditioning order"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "P(F|E) e P(E|F) sono in generale diversi: cambiare ciò che sappiamo cambia lo spazio di riferimento.",
                "en": "P(F|E) and P(E|F) are generally different: changing what is known changes the reference space."
              },
              "study": {
                "summary": {
                  "it": "P(F|E) e P(E|F) sono in generale diversi: cambiare ciò che sappiamo cambia lo spazio di riferimento.",
                  "en": "P(F|E) and P(E|F) are generally different: changing what is known changes the reference space."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(F\\mid E)\\neq P(E\\mid F)\\quad\\text{in generale}"
                  }
                ],
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-product-total",
          "title": {
            "it": "Regola moltiplicativa e probabilità totali",
            "en": "Product rule & total probability"
          },
          "description": {
            "it": "Intersezioni come prodotti condizionati e scomposizione di un evento in casi alternativi.",
            "en": "Intersections as conditional products and decomposition of an event into alternative cases."
          },
          "concepts": [
            {
              "id": "stat-product-rule",
              "title": {
                "it": "Regola moltiplicativa",
                "en": "Product rule"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La probabilità dell’intersezione si può calcolare come probabilità del primo evento per la probabilità condizionata del secondo.",
                "en": "The probability of an intersection can be computed as the first event probability times the conditional probability of the second."
              },
              "study": {
                "summary": {
                  "it": "La probabilità dell’intersezione si può calcolare come probabilità del primo evento per la probabilità condizionata del secondo.",
                  "en": "The probability of an intersection can be computed as the first event probability times the conditional probability of the second."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E\\cap F)=P(E)P(F\\mid E)=P(F)P(E\\mid F)"
                  }
                ],
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            },
            {
              "id": "stat-total-probability",
              "title": {
                "it": "Teorema delle probabilità totali",
                "en": "Law of total probability"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Se B₁,…,Bₙ formano una partizione, la probabilità di E è la somma dei contributi dei diversi casi alternativi.",
                "en": "If B₁,…,Bₙ form a partition, the probability of E is the sum of the contributions from the alternative cases."
              },
              "study": {
                "summary": {
                  "it": "Se B₁,…,Bₙ formano una partizione, la probabilità di E è la somma dei contributi dei diversi casi alternativi.",
                  "en": "If B₁,…,Bₙ form a partition, the probability of E is the sum of the contributions from the alternative cases."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E)=\\sum_{i=1}^{n}P(E\\mid B_i)P(B_i)"
                  }
                ],
                "terms": [
                  {
                    "symbol": "B_i",
                    "label": {
                      "it": "casi disgiunti ed esaustivi che formano una partizione",
                      "en": "disjoint exhaustive cases forming a partition"
                    }
                  },
                  {
                    "symbol": "P(E\\mid B_i)",
                    "label": {
                      "it": "probabilità di E nel caso i",
                      "en": "probability of E in case i"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Tre fornitori con quote 0.65, 0.25, 0.10 e difettosità 0.05, 0.10, 0.25 danno 8.25% di cambi difettosi.",
                    "en": "Three suppliers with shares 0.65, 0.25, 0.10 and defect rates 0.05, 0.10, 0.25 give an 8.25% defect probability."
                  },
                  "tex": "0.05(0.65)+0.10(0.25)+0.25(0.10)=0.0825"
                },
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-bayes",
          "title": {
            "it": "Bayes",
            "en": "Bayes"
          },
          "description": {
            "it": "Come invertire il condizionamento: dall’effetto osservato alle possibili cause.",
            "en": "How to reverse conditioning: from an observed effect back to possible causes."
          },
          "concepts": [
            {
              "id": "stat-bayes-formula",
              "title": {
                "it": "Formula di Bayes",
                "en": "Bayes' theorem"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Bayes aggiorna la probabilità di una causa Bⱼ dopo aver osservato l’effetto E, usando la probabilità totale al denominatore.",
                "en": "Bayes updates the probability of a cause Bⱼ after observing effect E, using total probability in the denominator."
              },
              "study": {
                "summary": {
                  "it": "Bayes aggiorna la probabilità di una causa Bⱼ dopo aver osservato l’effetto E, usando la probabilità totale al denominatore.",
                  "en": "Bayes updates the probability of a cause Bⱼ after observing effect E, using total probability in the denominator."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(B_j\\mid E)=\\frac{P(E\\mid B_j)P(B_j)}{\\sum_iP(E\\mid B_i)P(B_i)}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "P(B_j)",
                    "label": {
                      "it": "probabilità iniziale della causa",
                      "en": "prior probability of the cause"
                    }
                  },
                  {
                    "symbol": "P(E\\mid B_j)",
                    "label": {
                      "it": "probabilità dell’effetto se la causa è B_j",
                      "en": "likelihood of the effect under cause B_j"
                    }
                  },
                  {
                    "symbol": "P(B_j\\mid E)",
                    "label": {
                      "it": "probabilità aggiornata dopo aver osservato E",
                      "en": "updated probability after observing E"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per il secondo fornitore dell’esempio: 0.10·0.25 diviso per P(E)=0.0825.",
                    "en": "For the second supplier in the example: 0.10·0.25 divided by P(E)=0.0825."
                  },
                  "tex": "P(B_2\\mid E)=\\frac{0.10\\cdot0.25}{0.0825}\\approx0.3030"
                },
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            },
            {
              "id": "stat-diagnostic-bayes",
              "title": {
                "it": "Bayes e test diagnostico",
                "en": "Bayes and diagnostic testing"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Sensitività e specificità non coincidono con la probabilità di essere malati dato un test positivo: conta anche la prevalenza.",
                "en": "Sensitivity and specificity are not the same as the probability of disease given a positive test: prevalence also matters."
              },
              "study": {
                "summary": {
                  "it": "Sensitività e specificità non coincidono con la probabilità di essere malati dato un test positivo: conta anche la prevalenza.",
                  "en": "Sensitivity and specificity are not the same as the probability of disease given a positive test: prevalence also matters."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(B\\mid E)=\\frac{P(E\\mid B)P(B)}{P(E\\mid B)P(B)+P(E\\mid B^c)P(B^c)}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "P(B)",
                    "label": {
                      "it": "prevalenza",
                      "en": "prevalence"
                    }
                  },
                  {
                    "symbol": "P(E\\mid B)",
                    "label": {
                      "it": "sensitività",
                      "en": "sensitivity"
                    }
                  },
                  {
                    "symbol": "P(E^c\\mid B^c)",
                    "label": {
                      "it": "specificità",
                      "en": "specificity"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con prevalenza 0.5%, sensitività 95% e specificità 95%, un positivo porta la probabilità di malattia a circa 8.7%.",
                    "en": "With 0.5% prevalence, 95% sensitivity and 95% specificity, a positive result raises disease probability to about 8.7%."
                  },
                  "tex": "P(B\\mid E)\\approx0.0872"
                },
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-independence",
          "title": {
            "it": "Indipendenza",
            "en": "Independence"
          },
          "description": {
            "it": "Quando conoscere un evento non modifica la probabilità dell’altro.",
            "en": "When knowing one event does not change the probability of the other."
          },
          "concepts": [
            {
              "id": "stat-independence-two",
              "title": {
                "it": "Indipendenza di due eventi",
                "en": "Independence of two events"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "E e F sono indipendenti se la probabilità dell’intersezione fattorizza nel prodotto delle probabilità.",
                "en": "E and F are independent if the intersection probability factors into the product of their probabilities."
              },
              "study": {
                "summary": {
                  "it": "E e F sono indipendenti se la probabilità dell’intersezione fattorizza nel prodotto delle probabilità.",
                  "en": "E and F are independent if the intersection probability factors into the product of their probabilities."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E\\cap F)=P(E)P(F)"
                  }
                ],
                "terms": [
                  {
                    "symbol": "E,F",
                    "label": {
                      "it": "eventi considerati",
                      "en": "events being considered"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con due dadi, E=somma pari e F=6 sul primo dado soddisfano P(E∩F)=1/12=P(E)P(F).",
                    "en": "With two dice, E=even sum and F=6 on the first die satisfy P(E∩F)=1/12=P(E)P(F)."
                  },
                  "tex": "\\frac{3}{36}=\\frac12\\cdot\\frac16"
                },
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            },
            {
              "id": "stat-disjoint-vs-independent",
              "title": {
                "it": "Disgiunti ≠ indipendenti",
                "en": "Disjoint ≠ independent"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Due eventi disgiunti con probabilità positive non possono essere indipendenti: la loro intersezione vale zero ma il prodotto no.",
                "en": "Two disjoint positive-probability events cannot be independent: their intersection is zero while their product is not."
              },
              "study": {
                "summary": {
                  "it": "Due eventi disgiunti con probabilità positive non possono essere indipendenti: la loro intersezione vale zero ma il prodotto no.",
                  "en": "Two disjoint positive-probability events cannot be independent: their intersection is zero while their product is not."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E\\cap F=\\varnothing,\\;P(E),P(F)>0\\;\\Longrightarrow\\;P(E\\cap F)=0\\neq P(E)P(F)"
                  }
                ],
                "source": {
                  "it": "Capitolo 3 · notebook del corso",
                  "en": "Chapter 3 · course notebook"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "stat-ch4",
      "title": {
        "it": "Indipendenza multipla e variabili aleatorie",
        "en": "Multiple independence & random variables"
      },
      "description": {
        "it": "Dall’indipendenza congiunta alle variabili aleatorie e alla loro legge.",
        "en": "From joint independence to random variables and their distributions."
      },
      "color": "#28B7C7",
      "systems": [
        {
          "id": "stat-joint-independence",
          "title": {
            "it": "Indipendenza multipla",
            "en": "Multiple independence"
          },
          "description": {
            "it": "La differenza tra indipendenza a coppie e indipendenza congiunta.",
            "en": "The difference between pairwise and joint independence."
          },
          "concepts": [
            {
              "id": "stat-joint-independence-three",
              "title": {
                "it": "Indipendenza congiunta",
                "en": "Joint independence"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per tre eventi non basta controllare le coppie: deve fattorizzare anche l’intersezione tripla.",
                "en": "For three events, checking pairs is not enough: the triple intersection must factor as well."
              },
              "study": {
                "summary": {
                  "it": "Per tre eventi non basta controllare le coppie: deve fattorizzare anche l’intersezione tripla.",
                  "en": "For three events, checking pairs is not enough: the triple intersection must factor as well."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E\\cap F\\cap G)=P(E)P(F)P(G)"
                  }
                ],
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            },
            {
              "id": "stat-pairwise-not-joint",
              "title": {
                "it": "A due a due ma non congiunta",
                "en": "Pairwise but not joint"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "L’indipendenza di ogni coppia non implica l’indipendenza dell’intera famiglia.",
                "en": "Independence of every pair does not imply independence of the whole family."
              },
              "study": {
                "summary": {
                  "it": "L’indipendenza di ogni coppia non implica l’indipendenza dell’intera famiglia.",
                  "en": "Independence of every pair does not imply independence of the whole family."
                },
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Due dadi: E=primo pari, F=secondo pari, G=somma dispari. Le coppie sono indipendenti, ma E∩F∩G è vuoto.",
                    "en": "Two dice: E=first even, F=second even, G=odd sum. Pairs are independent, but E∩F∩G is empty."
                  },
                  "tex": "0=P(E\\cap F\\cap G)\\neq P(E)P(F)P(G)=\\frac18"
                },
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            },
            {
              "id": "stat-multi-product",
              "title": {
                "it": "Regola moltiplicativa per più eventi",
                "en": "Multiplication rule for several events"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Una sequenza di eventi dipendenti si calcola moltiplicando probabilità condizionate che tengono conto di tutto ciò che è già successo.",
                "en": "A sequence of dependent events is computed by multiplying conditional probabilities that account for everything that has already happened."
              },
              "study": {
                "summary": {
                  "it": "Una sequenza di eventi dipendenti si calcola moltiplicando probabilità condizionate che tengono conto di tutto ciò che è già successo.",
                  "en": "A sequence of dependent events is computed by multiplying conditional probabilities that account for everything that has already happened."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(E_1\\cap\\cdots\\cap E_n)=P(E_1)P(E_2\\mid E_1)\\cdots P(E_n\\mid E_1\\cap\\cdots\\cap E_{n-1})"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Urna con rinforzo: tre bianche consecutive hanno probabilità 5/10·7/12·9/14=3/16.",
                    "en": "Reinforced urn: three consecutive white draws have probability 5/10·7/12·9/14=3/16."
                  },
                  "tex": "\\frac5{10}\\frac7{12}\\frac9{14}=\\frac3{16}"
                },
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            },
            {
              "id": "stat-at-least-one",
              "title": {
                "it": "Almeno uno tra eventi indipendenti",
                "en": "At least one independent event"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per “almeno uno” spesso conviene calcolare il complementare: uno meno la probabilità che non accada nessuno.",
                "en": "For “at least one”, it is often easier to use the complement: one minus the probability that none occur."
              },
              "study": {
                "summary": {
                  "it": "Per “almeno uno” spesso conviene calcolare il complementare: uno meno la probabilità che non accada nessuno.",
                  "en": "For “at least one”, it is often easier to use the complement: one minus the probability that none occur."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(\\text{almeno uno})=1-P(\\text{nessuno})"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Tre anomalie indipendenti 5%, 3%, 2%: la probabilità di almeno una è 9.693%.",
                    "en": "Three independent anomalies at 5%, 3%, 2%: the probability of at least one is 9.693%."
                  },
                  "tex": "1-(0.95)(0.97)(0.98)=0.09693"
                },
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-random-variables",
          "title": {
            "it": "Variabili aleatorie",
            "en": "Random variables"
          },
          "description": {
            "it": "Funzioni che trasformano gli esiti di un esperimento in valori numerici.",
            "en": "Functions that map experiment outcomes to numerical values."
          },
          "concepts": [
            {
              "id": "stat-random-variable",
              "title": {
                "it": "Variabile aleatoria",
                "en": "Random variable"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Una variabile aleatoria assegna un numero reale a ogni esito dello spazio campione.",
                "en": "A random variable assigns a real number to each outcome in the sample space."
              },
              "study": {
                "summary": {
                  "it": "Una variabile aleatoria assegna un numero reale a ogni esito dello spazio campione.",
                  "en": "A random variable assigns a real number to each outcome in the sample space."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "X:S\\to\\mathbb R"
                  }
                ],
                "terms": [
                  {
                    "symbol": "S",
                    "label": {
                      "it": "spazio campione",
                      "en": "sample space"
                    }
                  },
                  {
                    "symbol": "X",
                    "label": {
                      "it": "regola che assegna un numero a ogni esito",
                      "en": "rule assigning a number to each outcome"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con una moneta si può porre X(T)=1 e X(C)=0.",
                    "en": "For a coin one can set X(H)=1 and X(T)=0."
                  },
                  "tex": "X(T)=1,\\qquad X(C)=0"
                },
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            },
            {
              "id": "stat-rv-measurability",
              "title": {
                "it": "Condizione di misurabilità",
                "en": "Measurability condition"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per poter calcolare P(X≤x), l’insieme degli esiti che producono valori ≤x deve essere un evento ammissibile.",
                "en": "To compute P(X≤x), the set of outcomes producing values ≤x must be an admissible event."
              },
              "study": {
                "summary": {
                  "it": "Per poter calcolare P(X≤x), l’insieme degli esiti che producono valori ≤x deve essere un evento ammissibile.",
                  "en": "To compute P(X≤x), the set of outcomes producing values ≤x must be an admissible event."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\{s\\in S:X(s)\\le x\\}\\in\\mathcal A"
                  }
                ],
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            },
            {
              "id": "stat-rv-dice",
              "title": {
                "it": "Variabili su due dadi",
                "en": "Random variables on two dice"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Sullo stesso esperimento si possono definire misure diverse: somma, massimo, differenza o differenza assoluta.",
                "en": "On the same experiment one may define different measurements: sum, maximum, difference or absolute difference."
              },
              "study": {
                "summary": {
                  "it": "Sullo stesso esperimento si possono definire misure diverse: somma, massimo, differenza o differenza assoluta.",
                  "en": "On the same experiment one may define different measurements: sum, maximum, difference or absolute difference."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "X(i,j)=i+j,\\quad Y(i,j)=\\max\\{i,j\\},\\quad W(i,j)=|i-j|"
                  }
                ],
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            },
            {
              "id": "stat-rv-law",
              "title": {
                "it": "Legge di una variabile aleatoria",
                "en": "Distribution of a random variable"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La legge trasferisce la probabilità dagli esiti originari ai valori numerici assunti dalla variabile.",
                "en": "The distribution transfers probability from original outcomes to the numerical values taken by the variable."
              },
              "study": {
                "summary": {
                  "it": "La legge trasferisce la probabilità dagli esiti originari ai valori numerici assunti dalla variabile.",
                  "en": "The distribution transfers probability from original outcomes to the numerical values taken by the variable."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(X\\in F)=P(\\{s\\in S:X(s)\\in F\\})"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con tre monete equilibrate, il numero di teste Y ha probabilità 1/8,3/8,3/8,1/8 per 0,1,2,3.",
                    "en": "With three fair coins, the number of heads Y has probabilities 1/8,3/8,3/8,1/8 for 0,1,2,3."
                  },
                  "tex": "P(Y=0,1,2,3)=\\left(\\frac18,\\frac38,\\frac38,\\frac18\\right)"
                },
                "source": {
                  "it": "Capitolo 4 · notebook del corso",
                  "en": "Chapter 4 · course notebook"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "stat-ch5",
      "title": {
        "it": "Distribuzioni, CDF e valore atteso",
        "en": "Distributions, CDF & expectation"
      },
      "description": {
        "it": "Densità discrete e continue, funzione di ripartizione, valore atteso e trasformazioni.",
        "en": "Discrete and continuous densities, cumulative distribution functions, expectation and transformations."
      },
      "color": "#52B788",
      "systems": [
        {
          "id": "stat-discrete-distributions",
          "title": {
            "it": "Distribuzioni discrete",
            "en": "Discrete distributions"
          },
          "description": {
            "it": "Masse di probabilità e distribuzioni costruite su valori numerabili.",
            "en": "Probability masses and distributions over countable values."
          },
          "concepts": [
            {
              "id": "stat-pmf",
              "title": {
                "it": "Densità discreta (PMF)",
                "en": "Discrete probability mass function"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Nel caso discreto la densità f_X(x) coincide con la probabilità puntuale P(X=x).",
                "en": "In the discrete case, f_X(x) is exactly the point probability P(X=x)."
              },
              "study": {
                "summary": {
                  "it": "Nel caso discreto la densità f_X(x) coincide con la probabilità puntuale P(X=x).",
                  "en": "In the discrete case, f_X(x) is exactly the point probability P(X=x)."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "f_X(x)=P(X=x)"
                  }
                ],
                "terms": [
                  {
                    "symbol": "f_X(x)",
                    "label": {
                      "it": "massa di probabilità nel valore x",
                      "en": "probability mass at value x"
                    }
                  },
                  {
                    "symbol": "C",
                    "label": {
                      "it": "insieme dei valori possibili di X",
                      "en": "set of possible values of X"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-pmf-normalization",
              "title": {
                "it": "Normalizzazione discreta",
                "en": "Discrete normalization"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Una densità discreta deve essere non negativa e la somma delle masse su tutti i valori possibili deve valere 1.",
                "en": "A discrete mass function must be non-negative and the sum of all masses over possible values must equal 1."
              },
              "study": {
                "summary": {
                  "it": "Una densità discreta deve essere non negativa e la somma delle masse su tutti i valori possibili deve valere 1.",
                  "en": "A discrete mass function must be non-negative and the sum of all masses over possible values must equal 1."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "f_X(x)\\ge0,\\qquad\\sum_{x\\in C}f_X(x)=1"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-sum-two-dice",
              "title": {
                "it": "Distribuzione della somma di due dadi",
                "en": "Sum of two dice"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Le somme non sono equiprobabili: 7 ha più combinazioni favorevoli di 2 o 12.",
                "en": "Sums are not equiprobable: 7 has more favorable combinations than 2 or 12."
              },
              "study": {
                "summary": {
                  "it": "Le somme non sono equiprobabili: 7 ha più combinazioni favorevoli di 2 o 12.",
                  "en": "Sums are not equiprobable: 7 has more favorable combinations than 2 or 12."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "f_X(x)=\\frac{\\#\\{(i,j):i+j=x\\}}{36}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "La somma 7 si ottiene in 6 modi, la somma 2 in un solo modo.",
                    "en": "Sum 7 occurs in 6 ways, while sum 2 occurs in only one way."
                  },
                  "tex": "P(X=7)=\\frac6{36}=\\frac16,\\qquad P(X=2)=\\frac1{36}"
                },
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-max-two-dice",
              "title": {
                "it": "Massimo di due dadi",
                "en": "Maximum of two dice"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per avere massimo y, entrambi i dadi devono essere ≤y ma non entrambi ≤y−1.",
                "en": "For the maximum to be y, both dice must be ≤y but not both ≤y−1."
              },
              "study": {
                "summary": {
                  "it": "Per avere massimo y, entrambi i dadi devono essere ≤y ma non entrambi ≤y−1.",
                  "en": "For the maximum to be y, both dice must be ≤y but not both ≤y−1."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(Y=y)=\\frac{2y-1}{36},\\qquad y=1,\\ldots,6"
                  }
                ],
                "terms": [
                  {
                    "symbol": "2y-1",
                    "label": {
                      "it": "differenza y²−(y−1)² dei casi cumulati",
                      "en": "difference y²−(y−1)² between cumulative counts"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-cdf",
          "title": {
            "it": "Funzione di ripartizione",
            "en": "Cumulative distribution function"
          },
          "description": {
            "it": "Probabilità accumulata fino a un valore e sue proprietà.",
            "en": "Probability accumulated up to a value and its properties."
          },
          "concepts": [
            {
              "id": "stat-cdf-definition",
              "title": {
                "it": "CDF / funzione di ripartizione",
                "en": "CDF / cumulative distribution function"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "F_X(x) raccoglie tutta la probabilità dei valori di X minori o uguali a x.",
                "en": "F_X(x) collects all probability for values of X less than or equal to x."
              },
              "study": {
                "summary": {
                  "it": "F_X(x) raccoglie tutta la probabilità dei valori di X minori o uguali a x.",
                  "en": "F_X(x) collects all probability for values of X less than or equal to x."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "F_X(x)=P(X\\le x)"
                  }
                ],
                "terms": [
                  {
                    "symbol": "F_X(x)",
                    "label": {
                      "it": "probabilità accumulata fino a x",
                      "en": "probability accumulated up to x"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per la somma di due dadi, F_X(4)=P(X≤4)=1/6.",
                    "en": "For the sum of two dice, F_X(4)=P(X≤4)=1/6."
                  },
                  "tex": "F_X(4)=\\frac1{36}+\\frac2{36}+\\frac3{36}=\\frac16"
                },
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-cdf-interval",
              "title": {
                "it": "Probabilità da una CDF",
                "en": "Interval probability from a CDF"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La probabilità dell’intervallo (a,b] si ottiene sottraendo la probabilità accumulata fino ad a da quella fino a b.",
                "en": "The probability of interval (a,b] is obtained by subtracting the accumulated probability up to a from that up to b."
              },
              "study": {
                "summary": {
                  "it": "La probabilità dell’intervallo (a,b] si ottiene sottraendo la probabilità accumulata fino ad a da quella fino a b.",
                  "en": "The probability of interval (a,b] is obtained by subtracting the accumulated probability up to a from that up to b."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(a<X\\le b)=F_X(b)-F_X(a)"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-cdf-properties",
              "title": {
                "it": "Proprietà della CDF",
                "en": "CDF properties"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Una CDF è compresa tra 0 e 1, non decrescente, continua da destra e tende a 0/1 agli estremi.",
                "en": "A CDF lies between 0 and 1, is non-decreasing, right-continuous and tends to 0/1 at the extremes."
              },
              "study": {
                "summary": {
                  "it": "Una CDF è compresa tra 0 e 1, non decrescente, continua da destra e tende a 0/1 agli estremi.",
                  "en": "A CDF lies between 0 and 1, is non-decreasing, right-continuous and tends to 0/1 at the extremes."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\lim_{x\\to-\\infty}F_X(x)=0,\\qquad\\lim_{x\\to+\\infty}F_X(x)=1"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-cdf-jumps",
              "title": {
                "it": "Salti della CDF discreta",
                "en": "Jumps of a discrete CDF"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Nel caso discreto, l’ampiezza del salto della CDF in xⱼ coincide con la probabilità puntuale in quel valore.",
                "en": "In the discrete case, the jump size of the CDF at xⱼ equals the point probability at that value."
              },
              "study": {
                "summary": {
                  "it": "Nel caso discreto, l’ampiezza del salto della CDF in xⱼ coincide con la probabilità puntuale in quel valore.",
                  "en": "In the discrete case, the jump size of the CDF at xⱼ equals the point probability at that value."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "f_X(x_j)=F_X(x_j)-F_X(x_j^-)"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-continuous",
          "title": {
            "it": "Variabili continue e densità",
            "en": "Continuous variables & density"
          },
          "description": {
            "it": "Probabilità come area sotto una densità e relazione con la CDF.",
            "en": "Probability as area under a density and its relation with the CDF."
          },
          "concepts": [
            {
              "id": "stat-continuous-density",
              "title": {
                "it": "Densità continua",
                "en": "Continuous density"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per una variabile continua la probabilità di un insieme è l’integrale della densità su quell’insieme.",
                "en": "For a continuous random variable, the probability of a set is the integral of the density over that set."
              },
              "study": {
                "summary": {
                  "it": "Per una variabile continua la probabilità di un insieme è l’integrale della densità su quell’insieme.",
                  "en": "For a continuous random variable, the probability of a set is the integral of the density over that set."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(X\\in F)=\\int_F f_X(x)\\,dx"
                  },
                  {
                    "title": {
                      "it": "Normalizzazione",
                      "en": "Normalization"
                    },
                    "tex": "\\int_{-\\infty}^{+\\infty}f_X(x)\\,dx=1"
                  }
                ],
                "terms": [
                  {
                    "symbol": "f_X(x)",
                    "label": {
                      "it": "densità locale, non probabilità puntuale",
                      "en": "local density, not point probability"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-continuous-point",
              "title": {
                "it": "Punto singolo nel continuo",
                "en": "A single point in the continuous case"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per una variabile continua ogni singolo punto ha probabilità zero; ciò che conta sono le aree su intervalli.",
                "en": "For a continuous random variable each single point has probability zero; probabilities come from areas over intervals."
              },
              "study": {
                "summary": {
                  "it": "Per una variabile continua ogni singolo punto ha probabilità zero; ciò che conta sono le aree su intervalli.",
                  "en": "For a continuous random variable each single point has probability zero; probabilities come from areas over intervals."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(X=x)=0"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-cdf-density",
              "title": {
                "it": "Relazione CDF-densità",
                "en": "CDF-density relationship"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La CDF continua è l’integrale cumulato della densità; dove è derivabile, la densità è la derivata della CDF.",
                "en": "A continuous CDF is the cumulative integral of the density; where differentiable, the density is the CDF derivative."
              },
              "study": {
                "summary": {
                  "it": "La CDF continua è l’integrale cumulato della densità; dove è derivabile, la densità è la derivata della CDF.",
                  "en": "A continuous CDF is the cumulative integral of the density; where differentiable, the density is the CDF derivative."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "F_X(x)=\\int_{-\\infty}^{x}f_X(u)\\,du"
                  },
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "f_X(x)=F_X'(x)"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-exponential-cdf",
              "title": {
                "it": "Esempio esponenziale",
                "en": "Exponential example"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Nel notebook una durata esponenziale ha CDF 1−e^(−λx) per x>0 e densità λe^(−λx).",
                "en": "In the notebook an exponential lifetime has CDF 1−e^(−λx) for x>0 and density λe^(−λx)."
              },
              "study": {
                "summary": {
                  "it": "Nel notebook una durata esponenziale ha CDF 1−e^(−λx) per x>0 e densità λe^(−λx).",
                  "en": "In the notebook an exponential lifetime has CDF 1−e^(−λx) for x>0 and density λe^(−λx)."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "F_X(x)=1-e^{-\\lambda x},\\qquad f_X(x)=\\lambda e^{-\\lambda x}\\quad(x>0)"
                  }
                ],
                "terms": [
                  {
                    "symbol": "\\lambda>0",
                    "label": {
                      "it": "parametro della distribuzione esponenziale",
                      "en": "parameter of the exponential distribution"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "La probabilità tra 10 e 20 si può calcolare sia integrando la densità sia facendo F(20)−F(10).",
                    "en": "The probability between 10 and 20 can be computed either by integrating the density or by F(20)−F(10)."
                  },
                  "tex": "P(10\\le X\\le20)=e^{-10\\lambda}-e^{-20\\lambda}"
                },
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-expectation-system",
          "title": {
            "it": "Valore atteso e trasformazioni",
            "en": "Expectation & transformations"
          },
          "description": {
            "it": "Centro della distribuzione, trasformazioni g(X) e proprietà di linearità.",
            "en": "Center of a distribution, transformations g(X) and linearity properties."
          },
          "concepts": [
            {
              "id": "stat-expectation",
              "title": {
                "it": "Valore atteso",
                "en": "Expected value"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Il valore atteso è una media pesata dei valori possibili nel discreto e un integrale pesato nel continuo.",
                "en": "Expected value is a weighted average of possible values in the discrete case and a weighted integral in the continuous case."
              },
              "study": {
                "summary": {
                  "it": "Il valore atteso è una media pesata dei valori possibili nel discreto e un integrale pesato nel continuo.",
                  "en": "Expected value is a weighted average of possible values in the discrete case and a weighted integral in the continuous case."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Caso discreto",
                      "en": "Discrete case"
                    },
                    "tex": "E[X]=\\sum_x x f_X(x)"
                  },
                  {
                    "title": {
                      "it": "Caso continuo",
                      "en": "Continuous case"
                    },
                    "tex": "E[X]=\\int_{-\\infty}^{+\\infty}x f_X(x)\\,dx"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per un dado equilibrato E[X]=3.5, anche se 3.5 non è un possibile esito.",
                    "en": "For a fair die E[X]=3.5 even though 3.5 is not a possible outcome."
                  },
                  "tex": "E[X]=\\frac{1+2+3+4+5+6}{6}=3.5"
                },
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-exponential-mean",
              "title": {
                "it": "Media esponenziale",
                "en": "Exponential mean"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per la densità esponenziale delle note, il valore atteso è l’inverso di λ.",
                "en": "For the exponential density in the notes, the expected value is the reciprocal of λ."
              },
              "study": {
                "summary": {
                  "it": "Per la densità esponenziale delle note, il valore atteso è l’inverso di λ.",
                  "en": "For the exponential density in the notes, the expected value is the reciprocal of λ."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E[X]=\\frac1\\lambda"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-transformation",
              "title": {
                "it": "Trasformazione Y=g(X)",
                "en": "Transformation Y=g(X)"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Applicare una funzione g ai valori di X produce una nuova variabile aleatoria Y.",
                "en": "Applying a function g to the values of X produces a new random variable Y."
              },
              "study": {
                "summary": {
                  "it": "Applicare una funzione g ai valori di X produce una nuova variabile aleatoria Y.",
                  "en": "Applying a function g to the values of X produces a new random variable Y."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "Y=g(X)"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con un dado e g(x)=(x−2)², i valori ottenuti sono 1,0,1,4,9,16.",
                    "en": "For a die and g(x)=(x−2)², the resulting values are 1,0,1,4,9,16."
                  },
                  "tex": "Y=(X-2)^2"
                },
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-expectation-transform",
              "title": {
                "it": "Valore atteso di g(X)",
                "en": "Expected value of g(X)"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Non serve prima trovare la distribuzione completa di g(X): si può mediare g direttamente rispetto alla distribuzione di X.",
                "en": "You do not need to derive the full distribution of g(X) first: average g directly with respect to the distribution of X."
              },
              "study": {
                "summary": {
                  "it": "Non serve prima trovare la distribuzione completa di g(X): si può mediare g direttamente rispetto alla distribuzione di X.",
                  "en": "You do not need to derive the full distribution of g(X) first: average g directly with respect to the distribution of X."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E[g(X)]=\\sum_x g(x)f_X(x)"
                  },
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E[g(X)]=\\int g(x)f_X(x)\\,dx"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            },
            {
              "id": "stat-linearity-expectation",
              "title": {
                "it": "Linearità del valore atteso",
                "en": "Linearity of expectation"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Il valore atteso di una combinazione lineare è la stessa combinazione lineare dei valori attesi.",
                "en": "The expectation of a linear combination is the same linear combination of expectations."
              },
              "study": {
                "summary": {
                  "it": "Il valore atteso di una combinazione lineare è la stessa combinazione lineare dei valori attesi.",
                  "en": "The expectation of a linear combination is the same linear combination of expectations."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E\\!\\left[\\sum_i c_i g_i(X)\\right]=\\sum_i c_iE[g_i(X)]"
                  }
                ],
                "source": {
                  "it": "Capitolo 5 · notebook del corso",
                  "en": "Chapter 5 · course notebook"
                }
              }
            }
          ]
        }
      ]
    },
    {
      "id": "stat-ch6",
      "title": {
        "it": "Varianza, deviazione standard e Tchebycheff",
        "en": "Variance, standard deviation & Tchebycheff"
      },
      "description": {
        "it": "Dispersione, trasformazioni di scala e bound probabilistici universali.",
        "en": "Dispersion, scaling transformations and universal probability bounds."
      },
      "color": "#E56B6F",
      "systems": [
        {
          "id": "stat-variance",
          "title": {
            "it": "Varianza",
            "en": "Variance"
          },
          "description": {
            "it": "Definizione, formule operative ed esempi discreti e continui.",
            "en": "Definition, practical formulas and discrete/continuous examples."
          },
          "concepts": [
            {
              "id": "stat-variance-definition",
              "title": {
                "it": "Definizione di varianza",
                "en": "Variance definition"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La varianza misura la dispersione quadratica dei valori attorno alla media.",
                "en": "Variance measures squared dispersion of values around the mean."
              },
              "study": {
                "summary": {
                  "it": "La varianza misura la dispersione quadratica dei valori attorno alla media.",
                  "en": "Variance measures squared dispersion of values around the mean."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\operatorname{Var}(X)=E[(X-E[X])^2]"
                  }
                ],
                "terms": [
                  {
                    "symbol": "E[X]",
                    "label": {
                      "it": "media / valore atteso",
                      "en": "mean / expected value"
                    }
                  },
                  {
                    "symbol": "X-E[X]",
                    "label": {
                      "it": "scostamento dalla media",
                      "en": "deviation from the mean"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-variance-discrete-continuous",
              "title": {
                "it": "Varianza discreta e continua",
                "en": "Discrete & continuous variance"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La stessa definizione si traduce in una somma nel caso discreto e in un integrale nel caso continuo.",
                "en": "The same definition becomes a sum in the discrete case and an integral in the continuous case."
              },
              "study": {
                "summary": {
                  "it": "La stessa definizione si traduce in una somma nel caso discreto e in un integrale nel caso continuo.",
                  "en": "The same definition becomes a sum in the discrete case and an integral in the continuous case."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\operatorname{Var}(X)=\\sum_x(x-E[X])^2f_X(x)"
                  },
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\operatorname{Var}(X)=\\int_{-\\infty}^{+\\infty}(x-E[X])^2f_X(x)\\,dx"
                  }
                ],
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-variance-practical",
              "title": {
                "it": "Formula pratica della varianza",
                "en": "Computational variance formula"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Spesso è più rapido calcolare il secondo momento E[X²] e sottrarre il quadrato della media.",
                "en": "It is often faster to compute the second moment E[X²] and subtract the square of the mean."
              },
              "study": {
                "summary": {
                  "it": "Spesso è più rapido calcolare il secondo momento E[X²] e sottrarre il quadrato della media.",
                  "en": "It is often faster to compute the second moment E[X²] and subtract the square of the mean."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\operatorname{Var}(X)=E[X^2]-E[X]^2"
                  }
                ],
                "terms": [
                  {
                    "symbol": "E[X^2]",
                    "label": {
                      "it": "secondo momento",
                      "en": "second moment"
                    }
                  },
                  {
                    "symbol": "E[X]^2",
                    "label": {
                      "it": "quadrato della media",
                      "en": "square of the mean"
                    }
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per il dado equilibrato E[X²]=91/6 ed E[X]=3.5.",
                    "en": "For a fair die E[X²]=91/6 and E[X]=3.5."
                  },
                  "tex": "\\operatorname{Var}(X)=\\frac{91}{6}-(3.5)^2=\\frac{35}{12}\\approx2.92"
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-exponential-variance",
              "title": {
                "it": "Varianza esponenziale",
                "en": "Exponential variance"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per la variabile esponenziale delle note, E[X²]=2/λ² e quindi la varianza vale 1/λ².",
                "en": "For the exponential random variable in the notes, E[X²]=2/λ² and variance is 1/λ²."
              },
              "study": {
                "summary": {
                  "it": "Per la variabile esponenziale delle note, E[X²]=2/λ² e quindi la varianza vale 1/λ².",
                  "en": "For the exponential random variable in the notes, E[X²]=2/λ² and variance is 1/λ²."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E[X^2]=\\frac{2}{\\lambda^2},\\qquad \\operatorname{Var}(X)=\\frac1{\\lambda^2}"
                  }
                ],
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-infinite-variance",
              "title": {
                "it": "Varianza infinita",
                "en": "Infinite variance"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Una distribuzione può avere media finita ma secondo momento, e quindi varianza, infinita.",
                "en": "A distribution may have finite mean but infinite second moment, and therefore infinite variance."
              },
              "study": {
                "summary": {
                  "it": "Una distribuzione può avere media finita ma secondo momento, e quindi varianza, infinita.",
                  "en": "A distribution may have finite mean but infinite second moment, and therefore infinite variance."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "E[X]<+\\infty,\\qquad E[X^2]=+\\infty\\;\\Longrightarrow\\;\\operatorname{Var}(X)=+\\infty"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per f(x)=2/x³ su x>1, la media vale 2 ma E[X²] diverge.",
                    "en": "For f(x)=2/x³ on x>1, the mean is 2 but E[X²] diverges."
                  },
                  "tex": "E[X]=2,\\qquad E[X^2]=+\\infty"
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-spread-transform",
          "title": {
            "it": "Scala e deviazione standard",
            "en": "Scaling & standard deviation"
          },
          "description": {
            "it": "Come la dispersione cambia sotto trasformazioni lineari e come tornare alle unità originali.",
            "en": "How dispersion changes under linear transformations and how to return to the original units."
          },
          "concepts": [
            {
              "id": "stat-affine-variance",
              "title": {
                "it": "Trasformazione affine della varianza",
                "en": "Variance under affine transformation"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Aggiungere una costante non cambia la dispersione; moltiplicare X per c₂ moltiplica la varianza per c₂².",
                "en": "Adding a constant does not change dispersion; multiplying X by c₂ multiplies variance by c₂²."
              },
              "study": {
                "summary": {
                  "it": "Aggiungere una costante non cambia la dispersione; moltiplicare X per c₂ moltiplica la varianza per c₂².",
                  "en": "Adding a constant does not change dispersion; multiplying X by c₂ multiplies variance by c₂²."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\operatorname{Var}(c_1+c_2X)=c_2^2\\operatorname{Var}(X)"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Se Var(X)=4 e Y=10+3X, allora Var(Y)=36.",
                    "en": "If Var(X)=4 and Y=10+3X, then Var(Y)=36."
                  },
                  "tex": "\\operatorname{Var}(Y)=3^2\\cdot4=36"
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-standard-deviation",
              "title": {
                "it": "Deviazione standard",
                "en": "Standard deviation"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La deviazione standard è la radice della varianza e torna nella stessa unità di misura di X.",
                "en": "Standard deviation is the square root of variance and returns to the same measurement unit as X."
              },
              "study": {
                "summary": {
                  "it": "La deviazione standard è la radice della varianza e torna nella stessa unità di misura di X.",
                  "en": "Standard deviation is the square root of variance and returns to the same measurement unit as X."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "\\sigma_X=\\sqrt{\\operatorname{Var}(X)}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per un dado, Var(X)=35/12 e σ≈1.71.",
                    "en": "For a die, Var(X)=35/12 and σ≈1.71."
                  },
                  "tex": "\\sigma_X=\\sqrt{\\frac{35}{12}}\\approx1.71"
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            }
          ]
        },
        {
          "id": "stat-bounds",
          "title": {
            "it": "Disuguaglianze e bound",
            "en": "Inequalities & bounds"
          },
          "description": {
            "it": "Limiti probabilistici ottenibili conoscendo solo media o media e varianza.",
            "en": "Probability bounds obtainable from only the mean or from mean and variance."
          },
          "concepts": [
            {
              "id": "stat-markov-tchebycheff",
              "title": {
                "it": "Tchebycheff per variabili non negative",
                "en": "Tchebycheff for non-negative variables"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Per X≥0, conoscere solo la media permette già di limitare dall’alto la probabilità di valori almeno k.",
                "en": "For X≥0, knowing only the mean already gives an upper bound on the probability of values at least k."
              },
              "study": {
                "summary": {
                  "it": "Per X≥0, conoscere solo la media permette già di limitare dall’alto la probabilità di valori almeno k.",
                  "en": "For X≥0, knowing only the mean already gives an upper bound on the probability of values at least k."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(X\\ge k)\\le\\frac{E[X]}{k},\\qquad k>0"
                  }
                ],
                "terms": [
                  {
                    "symbol": "k",
                    "label": {
                      "it": "soglia positiva",
                      "en": "positive threshold"
                    }
                  },
                  {
                    "symbol": "E[X]",
                    "label": {
                      "it": "media della variabile non negativa",
                      "en": "mean of the non-negative variable"
                    }
                  }
                ],
                "note": {
                  "it": "Nelle note questa forma è presentata come Tchebycheff ed è annotata come talvolta chiamata Markov.",
                  "en": "In the notes this form is presented as Tchebycheff and noted as sometimes called Markov."
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-chebyshev-centered",
              "title": {
                "it": "Tchebycheff centrata sulla media",
                "en": "Chebyshev centered at the mean"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Con varianza finita, la probabilità di trovarsi almeno t deviazioni standard dalla media è al massimo 1/t².",
                "en": "With finite variance, the probability of being at least t standard deviations from the mean is at most 1/t²."
              },
              "study": {
                "summary": {
                  "it": "Con varianza finita, la probabilità di trovarsi almeno t deviazioni standard dalla media è al massimo 1/t².",
                  "en": "With finite variance, the probability of being at least t standard deviations from the mean is at most 1/t²."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(|X-E[X]|\\ge t\\sigma_X)\\le\\frac1{t^2}"
                  }
                ],
                "terms": [
                  {
                    "symbol": "t>0",
                    "label": {
                      "it": "numero di deviazioni standard",
                      "en": "number of standard deviations"
                    }
                  },
                  {
                    "symbol": "\\sigma_X",
                    "label": {
                      "it": "deviazione standard",
                      "en": "standard deviation"
                    }
                  }
                ],
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-chebyshev-inside",
              "title": {
                "it": "Quota entro t deviazioni standard",
                "en": "Mass within t standard deviations"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "La forma equivalente garantisce una quota minima di probabilità dentro un intervallo centrato sulla media.",
                "en": "The equivalent form guarantees a minimum amount of probability inside an interval centered at the mean."
              },
              "study": {
                "summary": {
                  "it": "La forma equivalente garantisce una quota minima di probabilità dentro un intervallo centrato sulla media.",
                  "en": "The equivalent form guarantees a minimum amount of probability inside an interval centered at the mean."
                },
                "formulas": [
                  {
                    "title": {
                      "it": "Formula",
                      "en": "Formula"
                    },
                    "tex": "P(|X-E[X]|<t\\sigma_X)\\ge1-\\frac1{t^2}"
                  }
                ],
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Con t=2, almeno il 75% della probabilità cade entro due deviazioni standard dalla media.",
                    "en": "With t=2, at least 75% of the probability lies within two standard deviations of the mean."
                  },
                  "tex": "P(|X-E[X]|<2\\sigma_X)\\ge\\frac34"
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            },
            {
              "id": "stat-bound-vs-exact",
              "title": {
                "it": "Bound vs probabilità esatta",
                "en": "Bound vs exact probability"
              },
              "wiki": {
                "it": null,
                "en": null
              },
              "description": {
                "it": "Tchebycheff fornisce una garanzia universale, non necessariamente una stima stretta della probabilità reale.",
                "en": "Chebyshev provides a universal guarantee, not necessarily a tight estimate of the actual probability."
              },
              "study": {
                "summary": {
                  "it": "Tchebycheff fornisce una garanzia universale, non necessariamente una stima stretta della probabilità reale.",
                  "en": "Chebyshev provides a universal guarantee, not necessarily a tight estimate of the actual probability."
                },
                "example": {
                  "title": {
                    "it": "Esempio",
                    "en": "Example"
                  },
                  "body": {
                    "it": "Per X esponenziale con λ=1/2, Tchebycheff garantisce 0.75 entro 2σ, mentre la probabilità esatta nell’esempio è circa 0.9502.",
                    "en": "For exponential X with λ=1/2, Chebyshev guarantees 0.75 within 2σ, while the exact probability in the example is about 0.9502."
                  },
                  "tex": "1-e^{-3}\\approx0.9502>0.75"
                },
                "source": {
                  "it": "Capitolo 6 · notebook del corso",
                  "en": "Chapter 6 · course notebook"
                }
              }
            }
          ]
        }
      ]
    }
  ]
};
