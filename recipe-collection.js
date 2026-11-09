'use strict';

const collectionFoods = {
  "rodbetor": {
    "name": "Inlagda rödbetor",
    "group": "vegetables",
    "aliases": [
      "inlagda rödbetor"
    ]
  },
  "rodlok": {
    "name": "Rödlök",
    "group": "vegetables",
    "aliases": [
      "rödlök"
    ]
  },
  "arter": {
    "name": "Gröna ärter",
    "group": "legumes",
    "aliases": [
      "gröna ärter",
      "ärter",
      "ärtor",
      "frysta ärter"
    ]
  },
  "vita-bonor": {
    "name": "Vita bönor",
    "group": "legumes",
    "aliases": [
      "vita bönor"
    ]
  },
  "havregradde": {
    "name": "Havregrädde",
    "group": "pantry",
    "aliases": [
      "havregrädde"
    ]
  },
  "creme-fraiche": {
    "name": "Crème fraiche",
    "group": "dairy",
    "aliases": [
      "crème fraiche",
      "creme fraiche",
      "crème fraîche"
    ]
  },
  "gradde": {
    "name": "Vispgrädde",
    "group": "dairy",
    "aliases": [
      "vispgrädde",
      "grädde"
    ]
  },
  "farskost": {
    "name": "Färskost",
    "group": "dairy",
    "aliases": [
      "färskost naturell",
      "färskost"
    ]
  },
  "vegansk-farskost": {
    "name": "Vegansk färskost",
    "group": "pantry",
    "aliases": [
      "vegansk färskost"
    ]
  },
  "mjolk": {
    "name": "Mjölk",
    "group": "dairy",
    "aliases": [
      "mjölk"
    ]
  },
  "filmjolk": {
    "name": "Filmjölk",
    "group": "dairy",
    "aliases": [
      "filmjölk"
    ]
  },
  "fetaost": {
    "name": "Fetaost",
    "group": "dairy",
    "aliases": [
      "fetaost"
    ]
  },
  "kvarg": {
    "name": "Kvarg",
    "group": "dairy",
    "aliases": [
      "kvarg naturell",
      "kvarg"
    ]
  },
  "ost-lagrad": {
    "name": "Lagrad ost",
    "group": "dairy",
    "aliases": [
      "lagrad ost",
      "prästost",
      "västerbottensost"
    ]
  },
  "bacon": {
    "name": "Bacon",
    "group": "meat",
    "aliases": [
      "bacon"
    ]
  },
  "makrill": {
    "name": "Makrill i tomatsås",
    "group": "fish",
    "aliases": [
      "makrill i tomatsås",
      "makrill"
    ]
  },
  "tonfisk": {
    "name": "Tonfisk i olja",
    "group": "fish",
    "aliases": [
      "tonfisk i olja",
      "burktonfisk"
    ]
  },
  "rom": {
    "name": "Stenbitsrom",
    "group": "fish",
    "aliases": [
      "stenbitsrom"
    ]
  },
  "fiskpinnar": {
    "name": "Fiskpinnar",
    "group": "fish",
    "aliases": [
      "fiskpinnar"
    ]
  },
  "sardeller": {
    "name": "Sardellfiléer",
    "group": "fish",
    "aliases": [
      "sardellfiléer",
      "sardeller"
    ]
  },
  "leverpastej": {
    "name": "Leverpastej",
    "group": "meat",
    "aliases": [
      "leverpastej"
    ]
  },
  "kottbullar": {
    "name": "Köttbullar",
    "group": "meat",
    "aliases": [
      "köttbullar"
    ]
  },
  "radisa": {
    "name": "Rädisor",
    "group": "vegetables",
    "aliases": [
      "rädisor",
      "rädisa"
    ]
  },
  "paprika": {
    "name": "Paprika",
    "group": "vegetables",
    "aliases": [
      "röd paprika",
      "röda paprikor",
      "paprika"
    ]
  },
  "saltgurka": {
    "name": "Saltgurka",
    "group": "vegetables",
    "aliases": [
      "saltgurkor",
      "saltgurka"
    ]
  },
  "salladslok": {
    "name": "Salladslök",
    "group": "vegetables",
    "aliases": [
      "salladslökar",
      "salladslök"
    ]
  },
  "kalrot": {
    "name": "Kålrot",
    "group": "vegetables",
    "aliases": [
      "kålrot"
    ]
  },
  "pepparrot": {
    "name": "Pepparrot",
    "group": "vegetables",
    "aliases": [
      "pepparrot"
    ]
  },
  "apelsin": {
    "name": "Apelsin",
    "group": "fruit",
    "aliases": [
      "apelsiner",
      "apelsin"
    ]
  },
  "lime": {
    "name": "Lime",
    "group": "fruit",
    "aliases": [
      "limesaft",
      "lime"
    ]
  },
  "banan": {
    "name": "Bananer",
    "group": "fruit",
    "aliases": [
      "bananer",
      "banan"
    ]
  },
  "lingon": {
    "name": "Lingon",
    "group": "fruit",
    "aliases": [
      "lingon",
      "rårörda lingon"
    ]
  },
  "blabar": {
    "name": "Blåbär",
    "group": "fruit",
    "aliases": [
      "blåbär"
    ]
  },
  "hallon": {
    "name": "Hallon",
    "group": "fruit",
    "aliases": [
      "hallon"
    ]
  },
  "mandel": {
    "name": "Mandel",
    "group": "nuts",
    "aliases": [
      "mandelspån",
      "mandlar",
      "mandel"
    ]
  },
  "hasselnot": {
    "name": "Hasselnötter",
    "group": "nuts",
    "aliases": [
      "hasselnötter"
    ]
  },
  "fron": {
    "name": "Frön",
    "group": "nuts",
    "aliases": []
  },
  "tahini": {
    "name": "Tahini",
    "group": "nuts",
    "aliases": [
      "tahini"
    ]
  },
  "majo": {
    "name": "Majonnäs",
    "group": "pantry",
    "aliases": [
      "majonnäs"
    ]
  },
  "havredryck": {
    "name": "Havredryck",
    "group": "pantry",
    "aliases": [
      "havredryck"
    ]
  },
  "havreyoghurt": {
    "name": "Havreyoghurt",
    "group": "pantry",
    "aliases": [
      "havreyoghurt"
    ]
  },
  "sirap": {
    "name": "Ljus sirap",
    "group": "pantry",
    "aliases": [
      "ljus sirap"
    ]
  },
  "socker": {
    "name": "Strösocker",
    "group": "pantry",
    "aliases": [
      "strösocker"
    ]
  },
  "honung": {
    "name": "Honung",
    "group": "pantry",
    "aliases": [
      "honung"
    ]
  },
  "choklad": {
    "name": "Mörk choklad",
    "group": "pantry",
    "aliases": [
      "mörk choklad"
    ]
  },
  "kapris": {
    "name": "Kapris",
    "group": "pantry",
    "aliases": [
      "kapris"
    ]
  },
  "attika": {
    "name": "Ättika",
    "group": "pantry",
    "aliases": [
      "ättika"
    ]
  },
  "vinager": {
    "name": "Vinäger",
    "group": "pantry",
    "aliases": []
  },
  "tomatpure": {
    "name": "Tomatpuré",
    "group": "pantry",
    "aliases": [
      "tomatpuré"
    ]
  },
  "potatismjol": {
    "name": "Potatismjöl",
    "group": "grains",
    "aliases": [
      "potatismjöl"
    ]
  },
  "vetemjol": {
    "name": "Vetemjöl",
    "group": "grains",
    "aliases": [
      "vetemjöl"
    ]
  },
  "smordeg": {
    "name": "Smördeg",
    "group": "grains",
    "aliases": [
      "smördeg"
    ]
  },
  "kanelbullar": {
    "name": "Kanelbullar",
    "group": "grains",
    "aliases": [
      "kanelbullar"
    ]
  },
  "grot": {
    "name": "Risgrynsgröt",
    "group": "grains",
    "aliases": [
      "risgrynsgröt"
    ]
  },
  "strobrod": {
    "name": "Ströbröd",
    "group": "grains",
    "aliases": [
      "ströbröd"
    ]
  },
  "kryddor": {
    "name": "Kryddor",
    "group": "herbs",
    "aliases": []
  },
  "orter": {
    "name": "Färska örter",
    "group": "herbs",
    "aliases": []
  },
  "selleri": {
    "name": "Blekselleri",
    "group": "vegetables",
    "aliases": [
      "blekselleri",
      "selleristjälk",
      "stjälkselleri"
    ]
  },
  "vindruvor": {
    "name": "Vindruvor",
    "group": "fruit",
    "aliases": [
      "vindruvor",
      "druvor"
    ]
  },
  "stek": {
    "name": "Tillagad stek",
    "group": "meat",
    "aliases": [
      "kall stek",
      "rostbiff",
      "oxstek",
      "fläskstek"
    ]
  },
  "kinakal": {
    "name": "Kinakål",
    "group": "vegetables",
    "aliases": [
      "kinakål",
      "salladskål"
    ]
  },
  "jordnotter": {
    "name": "Jordnötter",
    "group": "nuts",
    "aliases": [
      "jordnötter"
    ]
  },
  "schalottenlok": {
    "name": "Schalottenlök",
    "group": "vegetables",
    "aliases": [
      "schalottenlök",
      "schalottenlökar"
    ]
  },
  "purjolok": {
    "name": "Purjolök",
    "group": "vegetables",
    "aliases": [
      "purjolök",
      "purjolökar"
    ]
  },
  "blomkal": {
    "name": "Blomkål",
    "group": "vegetables",
    "aliases": [
      "blomkål",
      "blomkålshuvud"
    ]
  },
  "falukorv": {
    "name": "Falukorv",
    "group": "meat",
    "aliases": [
      "falukorv"
    ]
  },
  "julskinka": {
    "name": "Julskinka",
    "group": "meat",
    "aliases": [
      "julskinka"
    ]
  },
  "blandfars": {
    "name": "Blandfärs",
    "group": "meat",
    "aliases": [
      "blandfärs"
    ]
  },
  "matlagningsgradde": {
    "name": "Matlagningsgrädde",
    "group": "dairy",
    "aliases": [
      "matlagningsgrädde"
    ]
  },
  "fiskbuljong": {
    "name": "Fiskbuljong",
    "group": "pantry",
    "aliases": [
      "fiskbuljong",
      "fiskbuljongtärning"
    ]
  },
  "graddfil": {
    "name": "Gräddfil",
    "group": "dairy",
    "aliases": [
      "gräddfil"
    ]
  },
  "adelost": {
    "name": "Ädelost",
    "group": "dairy",
    "aliases": [
      "ädelost"
    ]
  },
  "mascarpone": {
    "name": "Mascarpone",
    "group": "dairy",
    "aliases": [
      "mascarpone"
    ]
  },
  "ansjovis": {
    "name": "Ansjovis",
    "group": "fish",
    "aliases": [
      "ansjovis",
      "ansjovisfiléer"
    ]
  },
  "sardiner": {
    "name": "Sardiner",
    "group": "fish",
    "aliases": [
      "sardiner"
    ]
  },
  "vit-fisk": {
    "name": "Vit fisk",
    "group": "fish",
    "aliases": [
      "vit fisk",
      "sej",
      "torsk",
      "alaska pollock"
    ]
  },
  "fiskbullar": {
    "name": "Fiskbullar",
    "group": "fish",
    "aliases": [
      "fiskbullar"
    ]
  },
  "rakor": {
    "name": "Räkor",
    "group": "fish",
    "aliases": [
      "räkor"
    ]
  },
  "janssons-frestelse": {
    "name": "Janssons frestelse",
    "group": "fish",
    "aliases": [
      "Janssons frestelse"
    ]
  },
  "paron": {
    "name": "Päron",
    "group": "fruit",
    "aliases": [
      "päron"
    ]
  },
  "bar": {
    "name": "Blandade bär",
    "group": "fruit",
    "aliases": [
      "bär",
      "blandade bär",
      "frysta bär"
    ]
  },
  "majsmjol": {
    "name": "Majsmjöl",
    "group": "grains",
    "aliases": [
      "majsmjöl"
    ]
  },
  "pepparkakor": {
    "name": "Pepparkakor",
    "group": "grains",
    "aliases": [
      "pepparkakor"
    ]
  },
  "granola": {
    "name": "Granola",
    "group": "grains",
    "aliases": [
      "granola"
    ]
  },
  "kakao": {
    "name": "Kakao",
    "group": "pantry",
    "aliases": [
      "kakao"
    ]
  },
  "jordnotssmor": {
    "name": "Jordnötssmör",
    "group": "nuts",
    "aliases": [
      "jordnötssmör"
    ]
  },
  "kaffe": {
    "name": "Kaffe",
    "group": "pantry",
    "aliases": [
      "kaffe",
      "bryggkaffe"
    ]
  },
  "sotpotatis": {
    "name": "Sötpotatis",
    "group": "vegetables",
    "aliases": [
      "sötpotatisar"
    ]
  },
  "tofu": {
    "name": "Tofu",
    "group": "legumes",
    "aliases": [
      "fast tofu"
    ]
  },
  "korngryn": {
    "name": "Korngryn",
    "group": "grains",
    "aliases": [
      "matkorn"
    ]
  },
  "rotfrukter": {
    "name": "Rotfrukter",
    "group": "vegetables",
    "aliases": []
  },
  "keso": {
    "name": "Keso",
    "group": "dairy",
    "aliases": [
      "cottage cheese"
    ]
  },
  "mozzarella": {
    "name": "Mozzarella",
    "group": "dairy",
    "aliases": []
  },
  "nudlar": {
    "name": "Nudlar",
    "group": "grains",
    "aliases": [
      "risnudlar",
      "vetenudlar"
    ]
  },
  "svartvinbar": {
    "name": "Svarta vinbär",
    "group": "fruit",
    "aliases": [
      "svartvinbär"
    ]
  }
};

const collectionRecipes = [
  {
    "id": "01-rodbetspytt",
    "title": "Rödbetspytt i torn med gyllene äggula",
    "description": "Gårdagens kokta potatis, en burk inlagda rödbetor och en gul lök blir ett rubinrött torn med krispiga kanter. Överst vilar en lysande äggula som smälter ner i pytten när du skär i den. Pyttipanna i finkläder, perfekt till en långsam helgbrunch.",
    "image": "assets/recipes/01-rodbetspytt.webp",
    "cardImage": "assets/recipes/01-rodbetspytt-card.webp",
    "alt": "Rödbetspytt i torn med gyllene äggula",
    "meals": [
      "main",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "20 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Swedish",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Pytt",
        "items": [
          {
            "name": "800 g kokt, kall potatis (ca 10 medelstora)",
            "key": "potatis"
          },
          {
            "name": "2 gula lökar",
            "key": "lok"
          },
          {
            "name": "250 g inlagda rödbetor, avrunna",
            "key": "rodbetor"
          },
          {
            "name": "3 msk smör",
            "key": "smor"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "½ tsk svartpeppar",
            "basic": true
          },
          {
            "name": "1 tsk torkad timjan (valfritt)",
            "key": "orter"
          },
          {
            "name": "4 mycket färska ägg",
            "key": "agg"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl crème fraiche",
            "key": "creme-fraiche"
          },
          {
            "name": "1 tsk lag från rödbetsburken"
          },
          {
            "name": "1 ask krasse",
            "key": "orter"
          },
          {
            "name": "2 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Skär potatisen i tärningar, ca 1 cm. Skalet kan sitta kvar. Finhacka löken.",
      "Skär rödbetorna i lika stora tärningar och lägg dem på hushållspapper så att de torkar. Blöta rödbetor gör potatisen mjuk i stället för krispig.",
      "Hetta upp 2 msk smör och oljan i en stor stekpanna (minst 28 cm) på medelhög värme. Lägg i potatisen i ett jämnt lager och låt den steka orörd i 4–5 minuter innan du vänder. Stek totalt 12–15 minuter tills den är gyllene och krispig. Har du en mindre panna, stek i två omgångar.",
      "Lägg i löken och resten av smöret. Stek 4–5 minuter till löken är mjuk och lätt gyllene.",
      "Vänd ner rödbetorna och timjan och stek 2 minuter till. Smaka av med salt och peppar.",
      "Rör ner rödbetslagen i crème fraichen så att den blir rosa.",
      "Ställ en matring (7–8 cm) på en tallrik, fyll den med pytt och tryck till lätt med en sked. Gör en liten grop i mitten och lyft försiktigt bort ringen. Saknar du ring, pressa pytten i ett glas och stjälp upp den.",
      "Dela äggen och lägg en hel äggula i gropen på varje torn. Den varma pytten värmer gulan lätt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Strö krasse och gräslök runt tornet, inte över äggulan, så att den syns.",
          "Lägg en klick rosa crème fraiche bredvid och droppa några prickar rödbetslag på tallriken.",
          "Avsluta med några flingsaltkorn och nymald peppar på äggulan.",
          "Servera på mörka tallrikar så att färgerna lyser.",
          "Vill du undvika rå äggula, toppa tornen med ett stekt ägg med flytande gula i stället."
        ]
      }
    ],
    "pantryKeys": [
      "potatis",
      "lok",
      "rodbetor",
      "agg"
    ]
  },
  {
    "id": "02-glaserade-morotter",
    "title": "Glaserade morötter på vit bönkräm med frödukkah",
    "description": "Morötterna längst in i grönsakslådan och en burk vita bönor blir en rätt som ser ut att komma från en bistro. Sirapsglaserade morötter med karamelliserade kanter vilar på en sidenlen bönkräm med citron och vitlök. Över allt strös rostade frön med spiskummin och koriander som knastrar i varje tugga.",
    "image": "assets/recipes/02-glaserade-morotter.webp",
    "cardImage": "assets/recipes/02-glaserade-morotter-card.webp",
    "alt": "Glaserade morötter på vit bönkräm med frödukkah",
    "meals": [
      "side",
      "starter",
      "main"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "30 min",
      "Portioner": "4 som tillbehör eller förrätt, 2 som huvudrätt",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Middle Eastern",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Morötter",
        "items": [
          {
            "name": "600 g morötter (ca 8 medelstora), gärna med blasten kvar",
            "key": "morot"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "2 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "1 msk citronsaft",
            "key": "citron"
          }
        ]
      },
      {
        "title": "Bönkräm",
        "items": [
          {
            "name": "1 burk vita bönor (380 g), sköljda och avrunna",
            "key": "vita-bonor"
          },
          {
            "name": "1 liten vitlöksklyfta",
            "key": "vitlok"
          },
          {
            "name": "2 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "1 msk tahini (valfritt, ger rundare smak)",
            "key": "tahini"
          },
          {
            "name": "3 msk olivolja",
            "key": "olja"
          },
          {
            "name": "2–4 msk kallt vatten",
            "basic": true
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Frödukkah",
        "items": [
          {
            "name": "2 msk solrosfrön",
            "key": "fron"
          },
          {
            "name": "2 msk pumpafrön",
            "key": "fron"
          },
          {
            "name": "1 msk sesamfrön",
            "key": "fron"
          },
          {
            "name": "1 tsk hel spiskummin (eller ½ tsk malen)",
            "key": "kryddor"
          },
          {
            "name": "1 tsk korianderfrön (eller ½ tsk malen koriander)"
          },
          {
            "name": "¼ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm chiliflakes (valfritt)",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl hackad persilja eller finhackad morotsblast",
            "key": "orter"
          },
          {
            "name": "Rivet skal av ½ citron",
            "key": "citron"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader. Skrubba eller skala morötterna. Dela tjocka morötter på längden så att alla blir ungefär lika tjocka. Spara gärna 2–3 cm av blasten.",
      "Lägg morötterna på en plåt med bakplåtspapper. Vänd dem i olja, spiskummin och salt. Rosta i mitten av ugnen i 20 minuter.",
      "Ringla sirapen över morötterna och vänd runt. Rosta 8–10 minuter till, tills de är mjuka och kanterna har karamelliserats. Pressa över citronsaften.",
      "Gör bönkrämen medan morötterna rostas. Mixa bönor, vitlök, citronsaft, tahini och salt med en stavmixer eller i en matberedare. Tillsätt olja och vatten lite i taget och mixa i minst 2 minuter, tills krämen är helt slät och fluffig. Smaka av med salt och citron.",
      "Rosta solros-, pumpa- och sesamfröna i en torr stekpanna på medelvärme i 3–4 minuter. Rör hela tiden tills de doftar och sesamfröna fått färg. Tillsätt kryddorna de sista 30 sekunderna.",
      "Häll upp fröna på en skärbräda och hacka dem grovt eller krossa dem lätt i en mortel. Rör ner salt och chiliflakes.",
      "Bred ut bönkrämen på ett stort fat med baksidan av en sked, i en enda svepande rörelse så att det bildas en grop. Lägg morötterna ovanpå, kors och tvärs."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Ringla olivolja i bönkrämens gropar så att den glänser.",
          "Strö dukkah generöst över morötterna och krämen, och avsluta med persilja och citronskal.",
          "Lämna blasten på några morötter, det ger ett vackert grönt avslut.",
          "Använd ljusa fat i lera eller sten som kontrast mot det orange.",
          "Servera ljummet med surdegsbröd som huvudrätt, eller som tillbehör till kyckling eller lax."
        ]
      }
    ],
    "pantryKeys": [
      "morot",
      "vita-bonor",
      "citron"
    ]
  },
  {
    "id": "03-makrillrillettes",
    "title": "Makrillrillettes på knäcke med rosa picklad lök",
    "description": "Den där burken makrill i tomatsås som alla har men ingen vet vad man ska göra med blir krämiga rillettes med färskost, citron och dill. De serveras på knaprigt knäckebröd under neonrosa ringar av snabbpicklad rödlök. En förrätt eller mingelbit som ser beställd ut, för en bråkdel av priset.",
    "image": "assets/recipes/03-makrillrillettes.webp",
    "cardImage": "assets/recipes/03-makrillrillettes-card.webp",
    "alt": "Makrillrillettes på knäcke med rosa picklad lök",
    "meals": [
      "starter",
      "party"
    ],
    "metadata": {
      "Förberedelse": "20 min + 20 min dragtid",
      "Tillagning": "5 min",
      "Portioner": "4 som förrätt (ca 16 bitar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Swedish",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Snabbpicklad rödlök",
        "items": [
          {
            "name": "1 rödlök",
            "key": "rodlok"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "2 msk ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "2 msk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Rillettes",
        "items": [
          {
            "name": "1 burk makrill i tomatsås (ca 170 g)",
            "key": "makrill"
          },
          {
            "name": "100 g färskost naturell",
            "key": "farskost"
          },
          {
            "name": "Rivet skal och 1 msk saft av ½ citron",
            "key": "citron"
          },
          {
            "name": "1 tsk dijonsenap",
            "key": "senap"
          },
          {
            "name": "2 msk finhackad dill",
            "key": "dill"
          },
          {
            "name": "1 msk kapris, grovhackad (valfritt)",
            "key": "kapris"
          },
          {
            "name": "2 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "4 runda, tunna knäckebröd, brutna i ca 4 bitar vardera"
          },
          {
            "name": "Några dillkvistar",
            "key": "dill"
          },
          {
            "name": "Rivet citronskal",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Skala rödlöken och skiva den i tunna ringar, 1–2 mm. Lägg ringarna i en ren glasburk eller skål.",
      "Koka upp vatten, ättika, socker och salt i en liten kastrull och rör tills sockret har löst sig. Häll den heta lagen över löken.",
      "Låt löken dra i minst 20 minuter, gärna en timme. Den blir klart rosa. Överbliven lök håller en vecka i kylen.",
      "Lyft över makrillen till en skål med ungefär hälften av tomatsåsen. Resten gör krämen för lös. Mosa grovt med en gaffel.",
      "Rör ner färskost, citronskal, citronsaft, senap, dill och kapris. Peppra. Smaka av, men salta sällan, eftersom makrillen redan är salt. Låt det finnas lite struktur kvar.",
      "Ställ rillettesen i kylen i minst 15 minuter så att den stelnar något.",
      "Precis före servering: forma små quenelles (avlånga klickar) med två teskedar, doppade i varmt vatten, och lägg en på varje knäckebit.",
      "Toppa varje bit med 2–3 avrunna lökringar, en dillkvist och lite citronskal."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg bitarna på en ljus träbricka eller ett blekblått fat, så att det rosa poppar.",
          "Bryt knäcket för hand i stället för att skära det, ojämna kanter ser mer hantverksmässiga ut.",
          "Servera direkt, knäcket mjuknar efter ungefär en halvtimme.",
          "Ställ fram burken med rosa lök bredvid som en färgklick på bordet.",
          "Passar till ett glas torrt vitt vin, cider eller en kall öl."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "04-rostade-vitkalsbiffar",
    "title": "Rostade vitkålsbiffar med brynt smör, bacon och äpple",
    "description": "Ett vitkålshuvud, ett paket bacon och ett äpple ur fruktskålen. Tjocka skivor vitkål rostas tills kanterna karamelliseras och mitten blir söt och mjuk. Ovanpå: nötigt brynt smör, krispigt bacon, frasig salvia och friska äppelstickor. Rustikt, gyllene och oväntat elegant.",
    "image": "assets/recipes/04-rostade-vitkalsbiffar.webp",
    "cardImage": "assets/recipes/04-rostade-vitkalsbiffar-card.webp",
    "alt": "Rostade vitkålsbiffar med brynt smör, bacon och äpple",
    "meals": [
      "main",
      "side"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "40 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Gluten free",
      "Low carb",
      "Swedish",
      "Autumn",
      "Comfort food",
      "Budget"
    ],
    "time": 55,
    "timeLabel": "55 min",
    "ingredientSections": [
      {
        "title": "Kålbiffar",
        "items": [
          {
            "name": "1 vitkålshuvud (ca 1,2 kg)",
            "key": "kal"
          },
          {
            "name": "3 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "½ tsk svartpeppar",
            "basic": true
          },
          {
            "name": "1 tsk hel kummin (valfritt)",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "140 g bacon (1 paket)",
            "key": "bacon"
          },
          {
            "name": "2 msk solrosfrön eller grovhackade hasselnötter",
            "key": "fron"
          },
          {
            "name": "1 syrligt grönt äpple, t.ex. Granny Smith",
            "key": "apple"
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          },
          {
            "name": "75 g smör",
            "key": "smor"
          },
          {
            "name": "8–10 färska salviablad eller 4 kvistar färsk timjan"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      },
      {
        "title": "Senapskräm (valfritt)",
        "items": [
          {
            "name": "1 dl crème fraiche",
            "key": "creme-fraiche"
          },
          {
            "name": "1 msk grovkornig senap",
            "key": "senap"
          },
          {
            "name": "1 tsk honung",
            "key": "honung"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader. Ta bort de yttersta bladen från kålen.",
      "Lägg kålhuvudet på sidan och skär det genom stocken i 4 skivor, ca 2,5 cm tjocka. Stocken håller ihop bladen, så skär inte bort den. Spara ändbitarna till coleslaw eller soppa.",
      "Lägg skivorna på en plåt med bakplåtspapper. Pensla dem med olja på båda sidor och strö över salt, peppar och kummin.",
      "Rosta i mitten av ugnen i 20 minuter. Vänd skivorna försiktigt med en bred stekspade. Rosta 15–20 minuter till, tills mitten är mjuk när du sticker i en kniv och kanterna är mörkt gyllenbruna.",
      "Skär baconet i bitar, ca 1 cm. Stek det i en torr stekpanna på medelvärme i 6–8 minuter tills det är krispigt. Lyft upp det på hushållspapper. Rosta fröna eller nötterna i baconfettet i 1–2 minuter och lägg dem bredvid baconet.",
      "Kärna ur äpplet och skär det i tunna stickor, ca 3 mm. Vänd stickorna i citronsaft så att de inte mörknar.",
      "Rör ihop crème fraiche, senap och honung till senapskrämen.",
      "Bryn smöret sist, så att det är varmt när du lägger upp. Smält smöret i en liten kastrull med ljus botten på medelvärme. Det skummar först och klarnar sedan. Rör då och då. Efter 4–6 minuter blir det gyllenbrunt med bruna prickar i botten och doftar hasselnöt. Ta genast av kastrullen från värmen, brynt smör går fort från brunt till bränt.",
      "Lägg salviabladen i det heta smöret. De fräser och blir krispiga på 20–30 sekunder."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg en kålbiff på varje tallrik med den mest karamelliserade sidan upp.",
          "Skeda det brynta smöret över, med de bruna prickarna, och lägg de krispiga salviabladen ovanpå.",
          "Strö över bacon och frön, och toppa med en liten hög äppelstickor så att det gröna syns.",
          "Avsluta med flingsalt. Servera senapskrämen i en liten skål bredvid.",
          "Servera som huvudrätt med kokt potatis eller bröd, eller som tillbehör till fläskkotlett eller korv."
        ]
      }
    ],
    "pantryKeys": [
      "kal",
      "bacon",
      "apple",
      "smor"
    ]
  },
  {
    "id": "05-fattiga-riddare",
    "title": "Fattiga riddare med varma lingon och kardemummagrädde",
    "description": "Torrt bröd, mjölk, ägg och lingonen i frysen. Gyllene, krispiga skivor rullas i kanelsocker medan de är heta och serveras med varm, glänsande lingonkompott och fluffig grädde som doftar kardemumma. Svensk husmanskost som dessert på en finare restaurang.",
    "image": "assets/recipes/05-fattiga-riddare.webp",
    "cardImage": "assets/recipes/05-fattiga-riddare-card.webp",
    "alt": "Fattiga riddare med varma lingon och kardemummagrädde",
    "meals": [
      "dessert",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "15 min",
      "Portioner": "4 (8 skivor)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Varma lingon",
        "items": [
          {
            "name": "3 dl frysta lingon (ca 150 g) + 2 msk extra till garnering",
            "key": "lingon"
          },
          {
            "name": "¾ dl strösocker",
            "key": "socker"
          },
          {
            "name": "2 msk vatten",
            "basic": true
          },
          {
            "name": "1 tsk potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "1 msk kallt vatten",
            "basic": true
          }
        ]
      },
      {
        "title": "Kardemummagrädde",
        "items": [
          {
            "name": "2 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "1 msk florsocker"
          },
          {
            "name": "½ tsk malen kardemumma, gärna nystött",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Fattiga riddare",
        "items": [
          {
            "name": "8 skivor gammalt vitt bröd, t.ex. formfranska eller brioche",
            "key": "brod"
          },
          {
            "name": "2 ägg",
            "key": "agg"
          },
          {
            "name": "2½ dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "½ tsk kanel",
            "key": "kanel"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "3 msk smör till stekning",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Kanelsocker",
        "items": [
          {
            "name": "3 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk kanel",
            "key": "kanel"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Florsocker"
          },
          {
            "name": "Några myntablad (valfritt)"
          },
          {
            "name": "2 msk rostade mandelspån (valfritt)",
            "key": "mandel"
          }
        ]
      }
    ],
    "directions": [
      "Lägg 3 dl lingon, socker och 2 msk vatten i en kastrull. Koka upp på medelvärme och låt sjuda i 3–4 minuter, tills en del bär spricker men de flesta är hela.",
      "Rör ut potatismjölet i 1 msk kallt vatten och rör ner det i lingonen. Låt det bara koka upp, ta sedan genast av kastrullen från värmen. Potatismjöl som kokar länge blir trådigt och tappar sin glans.",
      "Vispa grädden med florsocker och kardemumma till mjuka toppar. Ställ den kallt.",
      "Vispa ihop ägg, mjölk, socker, vaniljsocker, kanel och salt i en djup tallrik eller form. Blanda kanelsockret på en flat tallrik.",
      "Doppa brödskivorna i äggblandningen, en i taget, ca 10–15 sekunder per sida. Riktigt torrt bröd tål längre tid. Skivorna ska vara genomblöta men inte falla isär.",
      "Smält 1 msk smör i en stekpanna på medelvärme. Stek skivorna 2–3 minuter per sida tills de är gyllenbruna. Är värmen för hög blir skivorna mörka innan mitten har satt sig. Ta nytt smör till varje omgång.",
      "Vänd de heta skivorna direkt i kanelsockret, på båda sidor. Håll dem varma i ugnen på 100 grader medan du steker resten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skär skivorna diagonalt till trianglar och stapla två eller tre lätt förskjutet på varje tallrik.",
          "Skeda den varma lingonkompotten över hörnet så att den rinner ner och bildar en blank pöl.",
          "Lägg en quenelle kardemummagrädde bredvid, formad med två matskedar.",
          "Strö över några frysta, frostiga lingon, mandelspån och ett par myntablad. Pudra lätt med florsocker genom en sil.",
          "Servera på vita tallrikar så att det röda lyser, gärna med en kopp kaffe."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "06-gron-artveloute",
    "title": "Grön ärtvelouté med citronolja och vitlökskrutonger",
    "description": "En påse frysta ärter, en gul lök och gårdagens bröd. Det blir en lysande grön, sammetslen soppa med droppar av gyllene citronolja och krispiga vitlökskrutonger. Servera i små skålar eller glas och låt den smaka vår mitt i november.",
    "image": "assets/recipes/06-gron-artveloute.webp",
    "cardImage": "assets/recipes/06-gron-artveloute-card.webp",
    "alt": "Grön ärtvelouté med citronolja och vitlökskrutonger",
    "meals": [
      "soup",
      "starter"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "15 min",
      "Portioner": "4 som förrätt",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Soppa",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 vitlöksklyfta",
            "key": "vitlok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "6 dl vatten + 1 grönsaksbuljongtärning",
            "key": "buljong"
          },
          {
            "name": "500 g frysta gröna ärter",
            "key": "arter"
          },
          {
            "name": "5–6 färska myntablad (valfritt)"
          },
          {
            "name": "1 dl havregrädde (matlagning)",
            "key": "havregradde"
          },
          {
            "name": "1 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "½ tsk salt, efter smak",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Citronolja",
        "items": [
          {
            "name": "3 msk olivolja",
            "key": "olja"
          },
          {
            "name": "Fint rivet skal av ½ citron",
            "key": "citron"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Vitlökskrutonger",
        "items": [
          {
            "name": "2 skivor gammalt bröd, gärna surdeg (kontrollera att det är veganskt)",
            "key": "brod"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 vitlöksklyfta, krossad",
            "key": "vitlok"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 ask ärtskott"
          },
          {
            "name": "Några myntablad"
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop olivolja, citronskal och salt till citronoljan. Låt den dra medan du lagar soppan.",
      "Hacka löken och vitlöken. Fräs dem i olivoljan på medelvärme i 4–5 minuter, tills löken är mjuk. Löken ska inte få färg, då blir soppan mindre klargrön.",
      "Häll i vatten och buljongtärning och koka upp. Lägg i de frysta ärterna, låt koka upp igen och sjud i 3–4 minuter. Inte längre, för överkokta ärter blir gråaktiga.",
      "Ta upp 2 msk ärter till garnering. Lägg i myntan och mixa soppan med en stavmixer i 2–3 minuter, tills den är helt slät. Vill du ha den extra sammetslen, passera den genom en sil.",
      "Rör ner havregrädden och citronsaften och värm försiktigt utan att koka. Smaka av med salt och vitpeppar.",
      "Skär brödet i tärningar, ca 1 cm. Stek dem i olivoljan med den krossade vitlöksklyftan på medelvärme i 4–5 minuter, tills de är gyllene och krispiga. Ta bort vitlöken och salta."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera soppan direkt så att den behåller den klargröna färgen.",
          "Häll upp i små djupa skålar, kaffekoppar eller glas.",
          "Droppa citronolja över ytan med en tesked, så att den lägger sig i gyllene pärlor.",
          "Lägg några krutonger, de sparade ärterna, en liten tuss ärtskott och ett myntablad ovanpå precis före servering, så att krutongerna håller sig krispiga.",
          "Soppan går också att servera kall, eller som amuse-bouche i små shotglas."
        ]
      }
    ],
    "pantryKeys": [
      "arter",
      "havregradde",
      "brod",
      "lok"
    ]
  },
  {
    "id": "07-rostiblinier",
    "title": "Röstiblinier med crème fraiche och stenbitsrom",
    "description": "Råriven potatis, en burk stenbitsrom och en burk crème fraiche. Små krispiga potatisplättar toppas med en klick crème fraiche, glänsande svart och röd rom, finhackad rödlök och dill. Det ser ut som kaviar på en finkrog men kostar som en vardagsmiddag.",
    "image": "assets/recipes/07-rostiblinier.webp",
    "cardImage": "assets/recipes/07-rostiblinier-card.webp",
    "alt": "Röstiblinier med crème fraiche och stenbitsrom",
    "meals": [
      "starter",
      "party"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "20 min",
      "Portioner": "4 som förrätt (ca 16 st)",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Pescatarian",
      "Gluten free",
      "Swedish",
      "Budget"
    ],
    "time": 40,
    "timeLabel": "40 min",
    "ingredientSections": [
      {
        "title": "Röstiblinier",
        "items": [
          {
            "name": "500 g potatis, gärna mjölig (ca 5 medelstora)",
            "key": "potatis"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "1 msk potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          },
          {
            "name": "2 msk rapsolja och 2 msk smör till stekning",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "1 dl crème fraiche",
            "key": "creme-fraiche"
          },
          {
            "name": "40 g svart stenbitsrom",
            "key": "rom"
          },
          {
            "name": "40 g röd stenbitsrom",
            "key": "rom"
          },
          {
            "name": "½ rödlök",
            "key": "rodlok"
          },
          {
            "name": "1 knippe dill",
            "key": "dill"
          },
          {
            "name": "1 citron",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 100 grader, så att du kan hålla blinierna varma.",
      "Lägg rommen i en fin sil, en färg i taget. Skölj snabbt med kallt vatten och låt rinna av. Då färgar rommen inte crème fraichen.",
      "Finhacka rödlöken, plocka dillen i små kvistar och skär citronen i klyftor.",
      "Skala potatisen och riv den på rivjärnets grova sida. Lägg den rivna potatisen i en ren kökshandduk och vrid ur så mycket vätska som möjligt. Det är det viktigaste steget för krispiga blinier.",
      "Blanda potatisen med ägg, potatismjöl, salt och vitpeppar. Gör det direkt, eftersom riven potatis mörknar snabbt.",
      "Hetta upp ½ msk olja och ½ msk smör i en stekpanna på medelhög värme. Lägg i rågade matskedar av smeten och platta till dem till runda plättar, ca 5 cm breda och ½ cm tjocka. Forma kanterna med skeden så att de blir jämnt runda.",
      "Stek 3 minuter per sida, tills blinierna är gyllene och krispiga. Lägg dem på hushållspapper och sedan i ugnen. Ta nytt fett till varje omgång.",
      "Lägg upp blinierna och toppa var och en med en liten klick crème fraiche, ½ tsk rom, lite rödlök och en dillkvist."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Varva svart och röd rom på varannan blini, eller lägg båda färgerna sida vid sida på varje.",
          "Forma crème fraichen till små quenelles med två teskedar för ett mer restaurangmässigt intryck.",
          "Lägg 3–4 blinier per person på en mörk tallrik eller servera alla på ett stort fat som mingelmat.",
          "Ställ fram citronklyftor och strö lite rivet citronskal över precis före servering.",
          "Blinierna är godast nygräddade, men kan stekas en timme i förväg och värmas i ugnen på 200 grader i 5 minuter."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "08-vispad-leverpastej",
    "title": "Vispad leverpastej på rågbröd med picklad gurka och lingon",
    "description": "Leverpastejen från frukostbordet vispas med grädde till en fluffig mousse. Den spritsas på rostat rågbröd och toppas med knaprig snabbpicklad gurka, glänsande lingon och en kvist timjan. Smörgåsklassikern förklädd till fransk bistropaté, och en självklar bit på julbordet.",
    "image": "assets/recipes/08-vispad-leverpastej.webp",
    "cardImage": "assets/recipes/08-vispad-leverpastej-card.webp",
    "alt": "Vispad leverpastej på rågbröd med picklad gurka och lingon",
    "meals": [
      "starter",
      "party"
    ],
    "metadata": {
      "Förberedelse": "20 min + 20 min dragtid",
      "Tillagning": "10 min",
      "Portioner": "4 som förrätt (ca 12 bitar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Swedish",
      "Christmas",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Snabbpicklad gurka",
        "items": [
          {
            "name": "½ gurka (ca 150 g)",
            "key": "gurka"
          },
          {
            "name": "½ dl vatten",
            "basic": true
          },
          {
            "name": "1 msk ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "1½ msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Leverpastejmousse",
        "items": [
          {
            "name": "200 g leverpastej",
            "key": "leverpastej"
          },
          {
            "name": "1 msk smör, rumsvarmt",
            "key": "smor"
          },
          {
            "name": "½ tsk torkad timjan",
            "key": "orter"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "½ dl vispgrädde",
            "key": "gradde"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "4 skivor mörkt rågbröd eller kavring",
            "key": "brod"
          },
          {
            "name": "1 dl rårörda lingon",
            "key": "lingon"
          },
          {
            "name": "Några kvistar färsk timjan",
            "key": "orter"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Ta fram leverpastejen och smöret 20 minuter innan, rumsvarm pastej vispas lättare.",
      "Skiva gurkan tunt, 1–2 mm, med osthyvel eller mandolin. Rör ihop vatten, ättika, socker och salt tills sockret har löst sig. Häll lagen över gurkan och låt dra i minst 20 minuter.",
      "Vispa leverpastej, smör, timjan och svartpeppar slätt med elvisp i ca 1 minut.",
      "Vispa grädden till mjuka toppar i en annan skål. Vänd ner den i pastejen med en slickepott, försiktigt så att moussen blir luftig.",
      "Fyll moussen i en spritspåse med stjärntyll, eller i en fryspåse med ett avklippt hörn. Låt den vila i kylen i 15 minuter så att den håller formen.",
      "Skär varje brödskiva i 3 bitar. Rosta dem i en torr stekpanna på medelvärme, 1–2 minuter per sida, tills ytan är krispig. Låt bröden svalna helt, annars smälter moussen.",
      "Låt gurkan rinna av ordentligt på hushållspapper.",
      "Spritsa en hög rosett mousse på varje brödbit. Lägg 2 gurkskivor, vikta som en våg, bredvid rosetten och toppa med ½ tsk lingon."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Avsluta varje bit med några timjanblad och lite nymald svartpeppar.",
          "Lägg upp bitarna i en rad på ett avlångt träbräde eller en mörk skifferbricka.",
          "Välj rårörda lingon framför sylt, hela bär ser vackrare ut.",
          "Strö några extra lingon och timjankvistar direkt på brädet runt bitarna.",
          "Moussen kan göras en dag i förväg och förvaras i kylen, men montera bitarna precis före servering."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "09-chokladmousse",
    "title": "Chokladmousse på kikärtsspad med frostiga hallon",
    "description": "Spadet från en burk kikärtor och en kaka mörk choklad. Spadet vispas fluffigt som äggvita och blir en luftig, sidenlen mousse där smaken av kikärtor försvinner helt. Ingen skulle gissa att den är vegansk. Den serveras i små glas med frysta hallon, rostade hasselnötter och några flingsaltkorn.",
    "image": "assets/recipes/09-chokladmousse.webp",
    "cardImage": "assets/recipes/09-chokladmousse-card.webp",
    "alt": "Chokladmousse på kikärtsspad med frostiga hallon",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "20 min + minst 3 tim i kylen",
      "Tillagning": "5 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Chocolate",
      "Make ahead"
    ],
    "time": null,
    "timeLabel": "Minst 3 tim 25 min",
    "ingredientSections": [
      {
        "title": "Mousse",
        "items": [
          {
            "name": "1 burk kikärtor (400 g), ca 1 dl spad",
            "key": "kikarter"
          },
          {
            "name": "½ tsk citronsaft",
            "key": "citron"
          },
          {
            "name": "2 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "150 g mörk choklad, 70 % (kontrollera att den är mjölkfri)",
            "key": "choklad"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl frysta hallon",
            "key": "hallon"
          },
          {
            "name": "2 msk hasselnötter",
            "key": "hasselnot"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Lite riven mörk choklad (valfritt)",
            "key": "choklad"
          }
        ]
      }
    ],
    "directions": [
      "Häll av kikärtorna i en sil över en ren skål och spara spadet. Det ska bli ca 1 dl. Kikärtorna kan du rosta eller göra hummus av.",
      "Hacka chokladen och smält den i en skål över en kastrull med sjudande vatten. Rör tills den är slät och låt den svalna till ljummen, ca 30–35 grader. Är den för varm faller skummet ihop, är den för kall stelnar den i klumpar.",
      "Vispa spadet och citronsaften med elvisp på högsta hastighet i 3–5 minuter, tills det är vitt och fluffigt. Skålen och vispen måste vara helt fria från fett.",
      "Tillsätt socker och vaniljsocker lite i taget och vispa 3–5 minuter till, tills skummet står i fasta, blanka toppar.",
      "Rör ner en tredjedel av skummet i chokladen med en slickepott, så att chokladen blir lösare. Vänd sedan försiktigt ner resten i två omgångar, tills inga vita strimmor syns. Vänd ner saltet.",
      "Fördela moussen i 4 små glas eller koppar. Kyl i minst 3 timmar, gärna över natten, tills den har stelnat.",
      "Rosta hasselnötterna i en torr stekpanna på medelvärme i 4–5 minuter. Gnid av skalen i en kökshandduk och hacka nötterna grovt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg några frysta hallon på varje mousse precis före servering, så att de är frostiga och vita på ytan.",
          "Strö över hasselnötter, några flingsaltkorn och lite riven choklad.",
          "Servera i små glas, kaffekoppar eller kristallskålar, gärna olika modeller.",
          "Moussen är mäktig, så små portioner räcker."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "10-brulee",
    "title": "Brûlée på gårdagens risgrynsgröt med apelsin",
    "description": "Resterna från grötkastrullen, lite grädde och socker. Under ett knäckigt, glasblankt karamelltäcke väntar en krämig gröt som doftar vanilj och apelsin. Bredvid ligger saftiga skivor av färsk apelsin. Julens rester blir fransk bistrodessert.",
    "image": "assets/recipes/10-brulee.webp",
    "cardImage": "assets/recipes/10-brulee-card.webp",
    "alt": "Brûlée på gårdagens risgrynsgröt med apelsin",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "15 min + minst 1 tim i kylen",
      "Tillagning": "10 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Swedish",
      "Christmas",
      "Leftovers",
      "Budget"
    ],
    "time": null,
    "timeLabel": "Minst 1 tim 25 min",
    "ingredientSections": [
      {
        "title": "Grötkräm",
        "items": [
          {
            "name": "4 dl kall, kokt risgrynsgröt",
            "key": "grot"
          },
          {
            "name": "1 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "Fint rivet skal av ½ apelsin",
            "key": "apelsin"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "½ dl mjölk (vid behov)",
            "key": "mjolk"
          }
        ]
      },
      {
        "title": "Karamelltäcke",
        "items": [
          {
            "name": "4 msk strösocker",
            "key": "socker"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 apelsiner",
            "key": "apelsin"
          },
          {
            "name": "2 msk rostade mandelspån (valfritt)",
            "key": "mandel"
          },
          {
            "name": "Några myntablad (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Värm gröt, grädde, socker, vaniljsocker, apelsinskal och salt i en kastrull på låg värme. Rör tills gröten är krämig och lös, ca 5 minuter. Den ska vara som tjock yoghurt, så späd med mjölk om den är för fast.",
      "Fördela gröten i 4 ugnssäkra portionsformar, ca 1,5 dl vardera. Jämna ytan noga med baksidan av en sked.",
      "Kyl formarna i minst 1 timme, så att ytan blir kall och fast.",
      "Skär bort skal och vita hinnor från apelsinerna med en vass kniv. Skär dem i tunna skivor.",
      "Strö 1 msk socker i ett jämnt lager över varje form. Luta och knacka formen så att sockret täcker hela ytan.",
      "Med köksbrännare: håll lågan ca 5 cm från ytan och rör den hela tiden, tills sockret har smält och fått en djup bärnstensfärg.",
      "Utan brännare: sätt ugnen på grill, högsta värme. Ställ formarna högt upp i ugnen och grilla i 2–4 minuter. Stå kvar vid ugnen, sockret går fort från gyllene till bränt.",
      "Låt formarna stå i 2 minuter, så att karamellen stelnar och blir knäckig."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg 2–3 apelsinskivor lätt överlappande bredvid varje form, på ett flatt fat eller en tallrik.",
          "Strö några mandelspån och lägg ett myntablad på apelsinen, inte på karamellen.",
          "Servera inom 30 minuter, sedan börjar karamellen mjukna.",
          "Ge gästerna en tesked och låt dem själva knäcka karamelltäcket, det är halva upplevelsen."
        ]
      }
    ],
    "pantryKeys": [],
    "directionNotes": [
      {
        "title": "Har du ingen gröt över?",
        "text": "Koka 1 dl grötris i 1¼ dl vatten i 10 minuter. Tillsätt 5 dl mjölk och låt sjuda under lock på låg värme i ca 40 minuter. Rör då och då och låt gröten svalna innan du börjar."
      }
    ]
  },
  {
    "id": "11-minipavlovor",
    "title": "Minipavlovor med citronkvarg och blåbär",
    "description": "Några överblivna äggvitor, socker, en burk kvarg och frysta blåbär. Det blir krispiga små moln som är sega inuti, fyllda med syrlig citronkvarg och glänsande blåbärskompott. Perfekt efter rödbetspytten, som lämnar exakt fyra äggvitor över.",
    "image": "assets/recipes/11-minipavlovor.webp",
    "cardImage": "assets/recipes/11-minipavlovor-card.webp",
    "alt": "Minipavlovor med citronkvarg och blåbär",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "25 min",
      "Tillagning": "60 min + minst 1 tim svalning i ugnen",
      "Portioner": "4 (8 st)",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Make ahead",
      "Leftovers",
      "Budget"
    ],
    "time": null,
    "timeLabel": "Minst 2 tim 25 min",
    "ingredientSections": [
      {
        "title": "Maränger",
        "items": [
          {
            "name": "4 äggvitor (ca 130 g), rumsvarma",
            "key": "agg"
          },
          {
            "name": "2½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "1 tsk potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "1 tsk vaniljsocker"
          }
        ]
      },
      {
        "title": "Blåbärskompott",
        "items": [
          {
            "name": "2 dl frysta blåbär + 2 msk extra till garnering",
            "key": "blabar"
          },
          {
            "name": "2 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "1 msk kallt vatten",
            "basic": true
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          }
        ]
      },
      {
        "title": "Citronkvarg",
        "items": [
          {
            "name": "1 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "250 g kvarg naturell",
            "key": "kvarg"
          },
          {
            "name": "2 msk florsocker"
          },
          {
            "name": "Fint rivet skal och 1 msk saft av 1 citron",
            "key": "citron"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Några myntablad eller citronmelissblad"
          },
          {
            "name": "Florsocker"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 120 grader. Rita 8 cirklar, ca 7 cm, på ett bakplåtspapper och vänd pappret så att pennan hamnar på undersidan.",
      "Torka ur en bunke och elvispens visp med lite ättika på hushållspapper. Minsta fettrest gör att vitorna inte blir fasta.",
      "Vispa äggvitorna på medelhög hastighet till ett mjukt skum. Höj till hög hastighet och tillsätt sockret en matsked i taget. Vispa 8–10 minuter, tills marängen är stel och blank och sockret har löst sig. Gnid lite maräng mellan fingrarna, den ska inte kännas grynig.",
      "Vänd ner ättika, potatismjöl och vaniljsocker med en slickepott.",
      "Klicka ut marängen på cirklarna. Gör en grop i mitten av varje med baksidan av en sked och dra upp kanterna i små spetsar.",
      "Grädda i nedre delen av ugnen i 60 minuter. Stäng av ugnen och låt marängerna svalna i ugnen med luckan stängd i minst 1 timme. Då spricker de inte.",
      "Koka upp blåbären och sockret i en kastrull och låt sjuda i 3 minuter. Rör ut potatismjölet i det kalla vattnet och rör ner det. Låt bara koka upp, ta av från värmen och rör ner citronsaften. Låt svalna.",
      "Vispa grädden till mjuka toppar. Rör kvarg, florsocker, citronskal och citronsaft slätt i en annan skål. Vänd ner grädden och ställ kallt.",
      "Fyll pavlovorna precis före servering, annars mjuknar marängen. Lägg en rejäl klick citronkvarg i varje grop och skeda över blåbärskompott."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Låt kompotten rinna lite över kanten på marängen för en vacker kontrast mellan vitt och lila.",
          "Toppa med några frysta, frostiga blåbär, lite rivet citronskal och ett myntablad.",
          "Pudra lätt med florsocker genom en sil.",
          "Servera två små pavlovor per person på ljusa tallrikar, gärna i pastell.",
          "Marängerna håller sig krispiga i upp till en vecka i en lufttät burk, så de kan göras i förväg."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "12-appelskalsspritz",
    "title": "Äppelskalsspritz med rosmarin",
    "description": "Skal och kärnhus från äpplen, som annars hamnar i komposten, kokas till en gyllene sirap med kanel och en skvätt äppelcidervinäger. Sirapen toppas med iskallt kolsyrat vatten, tunna äppelskivor och en kvist rosmarin. Bubblig, klar och vacker som champagne, helt utan alkohol.",
    "image": "assets/recipes/12-appelskalsspritz.webp",
    "cardImage": "assets/recipes/12-appelskalsspritz-card.webp",
    "alt": "Äppelskalsspritz med rosmarin",
    "meals": [
      "drink"
    ],
    "metadata": {
      "Förberedelse": "10 min + 1 tim kylning",
      "Tillagning": "15 min + 15 min dragtid",
      "Portioner": "4 drinkar (ca 3 dl sirap)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Alcohol free",
      "Leftovers",
      "Zero waste",
      "Budget"
    ],
    "time": 100,
    "timeLabel": "1 tim 40 min",
    "ingredientSections": [
      {
        "title": "Äppelskalssirap",
        "items": [
          {
            "name": "Skal och kärnhus från 4 äpplen (ca 150 g), gärna röda för färgens skull",
            "key": "apple"
          },
          {
            "name": "3 dl vatten",
            "basic": true
          },
          {
            "name": "1½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 kanelstång",
            "key": "kanel"
          },
          {
            "name": "1 kvist rosmarin",
            "key": "orter"
          },
          {
            "name": "2 msk äppelcidervinäger",
            "key": "vinager"
          }
        ]
      },
      {
        "title": "Till 4 drinkar",
        "items": [
          {
            "name": "2 dl äppelskalssirap"
          },
          {
            "name": "6 dl iskallt kolsyrat vatten",
            "basic": true
          },
          {
            "name": "Is",
            "basic": true
          },
          {
            "name": "1 rött äpple",
            "key": "apple"
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          },
          {
            "name": "4 små kvistar rosmarin",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Lägg äppelskal, kärnhus, vatten, socker och kanelstång i en kastrull. Koka upp och låt sjuda under lock på låg värme i 15 minuter.",
      "Ta av kastrullen från värmen, lägg i rosmarinkvisten och låt dra i 15 minuter.",
      "Sila sirapen och pressa ur skalen ordentligt med en sked. Rör ner äppelcidervinägern.",
      "Låt sirapen svalna och kyl den i minst 1 timme. Den håller i ca 2 veckor i en ren flaska i kylen.",
      "Skiva äpplet tunt, 1–2 mm, gärna med mandolin eller osthyvel, och pensla skivorna med citronsaft så att de inte mörknar.",
      "Ställ 3–4 äppelskivor på högkant mot insidan av fyra höga glas. Fyll med is.",
      "Häll ½ dl sirap i varje glas och fyll på med 1½ dl kolsyrat vatten. Rör om försiktigt en gång, så att bubblorna stannar kvar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Toppa varje glas med en liten rosmarinkvist. Gnid den lätt mellan fingrarna först så att den doftar.",
          "Höga raka glas visar äppelskivorna bäst, men en champagneskål eller ett vinglas ger en festligare känsla.",
          "Kyl glasen i frysen i 10 minuter innan, så att de blir immiga.",
          "Vill du ha en variant med alkohol, ersätt det kolsyrade vattnet med torr cider eller cava."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "13-rosa-hallonsour",
    "title": "Rosa hallonsour med timjan",
    "description": "Frysta hallon, socker, citron och en äggvita, eller kikärtsspad för en vegansk variant. Allt skakas till en djuprosa drink med ett tjockt, sammetslent skum, toppad med en timjankvist och några droppar hallonsirap. Görs med gin eller vodka, eller helt utan sprit.",
    "image": "assets/recipes/13-rosa-hallonsour.webp",
    "cardImage": "assets/recipes/13-rosa-hallonsour-card.webp",
    "alt": "Rosa hallonsour med timjan",
    "meals": [
      "drink",
      "party"
    ],
    "metadata": {
      "Förberedelse": "15 min + 30 min svalning",
      "Tillagning": "10 min",
      "Portioner": "2 drinkar (sirap till ca 8)",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Cocktail",
      "Alcohol free option"
    ],
    "time": 55,
    "timeLabel": "55 min",
    "ingredientSections": [
      {
        "title": "Hallon- och timjansirap",
        "items": [
          {
            "name": "2 dl frysta hallon (ca 100 g)",
            "key": "hallon"
          },
          {
            "name": "1 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "2 kvistar färsk timjan",
            "key": "orter"
          }
        ]
      },
      {
        "title": "Till 2 drinkar",
        "items": [
          {
            "name": "8 cl gin eller vodka"
          },
          {
            "name": "4 cl färskpressad citronsaft (ca 1 citron)",
            "key": "citron"
          },
          {
            "name": "4 cl hallon- och timjansirap",
            "key": "hallon"
          },
          {
            "name": "1 färsk äggvita (ca 3 cl), eller 3 msk kikärtsspad",
            "key": "agg"
          },
          {
            "name": "Is",
            "basic": true
          }
        ]
      },
      {
        "title": "Alkoholfri variant",
        "items": [
          {
            "name": "Byt ut spriten mot 8 cl alkoholfri gin eller kallt, osötat grönt te",
            "note": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 små kvistar timjan",
            "key": "orter"
          },
          {
            "name": "2 frysta hallon",
            "key": "hallon"
          }
        ]
      }
    ],
    "directions": [
      "Koka upp hallon, socker och vatten i en kastrull och låt sjuda i 5 minuter. Mosa bären lätt med en gaffel.",
      "Ta av kastrullen från värmen, lägg i timjankvistarna och låt dra i 10 minuter.",
      "Sila sirapen genom en fin sil och pressa ur bären med en sked. Låt sirapen svalna helt. Den håller ca 1 vecka i kylen.",
      "Ställ två coupeglas eller vinglas i frysen i 10 minuter.",
      "Häll sprit, citronsaft, sirap och äggvita i en shaker, utan is. Saknar du shaker går en syltburk med tättslutande lock bra.",
      "Skaka kraftigt i 15 sekunder. Den här torrskakningen gör att äggvitan skummar.",
      "Fyll shakern med is och skaka kraftigt i ytterligare 15 sekunder, tills shakern är iskall på utsidan.",
      "Sila drinken genom en tesil ner i de kalla glasen. Vänta en halv minut så att skummet lägger sig i ett tjockt lager överst."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Droppa 3 små prickar hallonsirap på skummet och dra en tandpetare genom dem, så bildas små hjärtan.",
          "Lägg en timjankvist över glaskanten, eller ett fryst hallon på en drinkpinne.",
          "Använd färska ägg och skaka direkt, eller välj kikärtsspad om du vill undvika rå äggvita.",
          "Servera direkt, skummet är som vackrast de första minuterna."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "14-gyllene-mjolk",
    "title": "Gyllene mjölk med ingefära, kanel och honung",
    "description": "Gurkmejan som står orörd i kryddhyllan, mjölk och en sked honung blir en lysande gul, skummig dryck som värmer ända ut i fingrarna. Den serveras i glas med ett damm av kanel och en kanelstång. Perfekt en mörk novemberkväll i soffan.",
    "image": "assets/recipes/14-gyllene-mjolk.webp",
    "cardImage": "assets/recipes/14-gyllene-mjolk-card.webp",
    "alt": "Gyllene mjölk med ingefära, kanel och honung",
    "meals": [
      "drink"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "10 min",
      "Portioner": "2",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Hot drink",
      "Autumn",
      "Beginner friendly",
      "Budget"
    ],
    "time": 15,
    "timeLabel": "15 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "5 dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "1 tsk malen gurkmeja",
            "key": "kryddor"
          },
          {
            "name": "½ tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "½ tsk malen ingefära, eller 2 cm färsk ingefära, riven"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "½ tsk vaniljsocker"
          },
          {
            "name": "1 tsk smör eller kokosolja (valfritt, ger en rundare smak)",
            "key": "smor"
          },
          {
            "name": "1–2 msk honung",
            "key": "honung"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "½ tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "2 kanelstänger",
            "key": "kanel"
          }
        ]
      },
      {
        "title": "Vegansk variant",
        "items": [
          {
            "name": "Byt mjölken mot havredryck (barista-variant skummar bäst) och honungen mot ljus sirap.",
            "note": true
          }
        ]
      }
    ],
    "directions": [
      "Vispa gurkmeja, kanel, ingefära, svartpeppar och vaniljsocker med ½ dl kall mjölk i en kastrull, tills det blir en slät pasta utan klumpar.",
      "Vispa i resten av mjölken och smöret. Värm på medelvärme under omrörning i ca 5 minuter, tills mjölken ångar och precis börjar sjuda. Låt den inte koka.",
      "Sänk värmen och låt sjuda försiktigt i 2 minuter, så att smakerna går ihop.",
      "Ta av kastrullen från värmen och rör ner honungen. Smaka av och tillsätt mer honung om du vill.",
      "Sila genom en fin sil om du har använt färsk ingefära.",
      "Skumma mjölken med en mjölkskummare eller stavmixer i ca 30 sekunder, tills den är luftig.",
      "Häll upp i två värmetåliga glas eller koppar och skeda över skummet."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Pudra kanel genom en liten sil över skummet, gärna bara över ena halvan för en snygg kontrast.",
          "Ställ en kanelstång i varje glas.",
          "Använd genomskinliga, värmetåliga glas så att den gyllene färgen syns.",
          "Gurkmeja färgar, så skölj kastrull och visp direkt efter användning."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "15-bananbrod",
    "title": "Bananbröd med brynt smör och karamelliserad banan",
    "description": "De bruna, övermogna bananerna som ingen vill äta blir ett saftigt bananbröd med nötig smak av brynt smör. En banan delad på längden läggs ovanpå och karamelliseras till en blank, gyllene yta. Ser ut som från ett café i Köpenhamn.",
    "image": "assets/recipes/15-bananbrod.webp",
    "cardImage": "assets/recipes/15-bananbrod-card.webp",
    "alt": "Bananbröd med brynt smör och karamelliserad banan",
    "meals": [
      "baking"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "60 min",
      "Portioner": "1 bröd (ca 10 skivor)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 75,
    "timeLabel": "1 tim 15 min",
    "ingredientSections": [
      {
        "title": "Bananbröd",
        "items": [
          {
            "name": "100 g smör",
            "key": "smor"
          },
          {
            "name": "3 övermogna bananer (ca 300 g skalade)",
            "key": "banan"
          },
          {
            "name": "1 dl farinsocker"
          },
          {
            "name": "½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "2 ägg",
            "key": "agg"
          },
          {
            "name": "½ dl filmjölk",
            "key": "filmjolk"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "3 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 tsk bikarbonat"
          },
          {
            "name": "1 tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "1 banan",
            "key": "banan"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 msk ljus sirap (valfritt, för extra glans)",
            "key": "sirap"
          }
        ]
      }
    ],
    "directions": [
      "Smält smöret i en kastrull med ljus botten på medelvärme. Rör då och då i 4–6 minuter, tills det är gyllenbrunt och doftar hasselnöt. Häll upp smöret med de bruna prickarna i en bunke och låt svalna i 10 minuter.",
      "Sätt ugnen på 175 grader. Klä en brödform (1,5 liter) med bakplåtspapper som når upp över långsidorna, så att brödet blir lätt att lyfta ur.",
      "Mosa de tre bananerna med en gaffel. Små bitar får gärna finnas kvar.",
      "Vispa farinsocker, strösocker, ägg och vaniljsocker ner i det brynta smöret tills smeten är slät. Rör ner bananmoset och filmjölken.",
      "Blanda mjöl, bikarbonat, kanel och salt i en annan skål. Vänd ner det i smeten med en slickepott, bara tills inget mjöl syns. Rör du för länge blir brödet segt.",
      "Häll smeten i formen. Dela toppingbananen på längden och lägg halvorna med snittytan uppåt på smeten. Strö sockret över bananen.",
      "Grädda i nedre delen av ugnen i 55–65 minuter, tills en provsticka i mitten kommer ut torr eller med några fuktiga smulor. Lägg en bit folie över formen efter 40 minuter om ytan mörknar för snabbt.",
      "Pensla den varma bananen med sirapen. Låt brödet svalna i formen i 15 minuter och sedan på galler."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skär tjocka skivor tvärs över, så att den karamelliserade bananen syns som ett blankt band överst på varje skiva.",
          "Godast är en skiva som stekts kort i smör och fått några flingsaltkorn.",
          "Servera med en klick lättvispad grädde eller crème fraiche och en kopp kaffe.",
          "Brödet blir ännu saftigare dagen efter. Det håller 4–5 dagar inslaget i plast."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "16-kanelbullspudding",
    "title": "Kanelbullspudding med vaniljkräm",
    "description": "Gårdagens torra kanelbullar bakas i en krämig äggstanning tills toppen är gyllene och krispig och insidan mjuk som en sufflé. Pärlsocker knastrar på ytan. Puddingen serveras ljummen med kall, fluffig vaniljkräm som smälter ner i alla skrymslen. Svensk fika möter engelsk bread pudding.",
    "image": "assets/recipes/16-kanelbullspudding.webp",
    "cardImage": "assets/recipes/16-kanelbullspudding-card.webp",
    "alt": "Kanelbullspudding med vaniljkräm",
    "meals": [
      "baking",
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "15 min + 20 min dragtid",
      "Tillagning": "40 min",
      "Portioner": "6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 75,
    "timeLabel": "1 tim 15 min",
    "ingredientSections": [
      {
        "title": "Pudding",
        "items": [
          {
            "name": "6–8 gamla kanelbullar (ca 350 g)",
            "key": "kanelbullar"
          },
          {
            "name": "1 msk smör till formen",
            "key": "smor"
          },
          {
            "name": "3 ägg",
            "key": "agg"
          },
          {
            "name": "3 dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "2 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "2 msk pärlsocker"
          }
        ]
      },
      {
        "title": "Fluffig vaniljkräm",
        "items": [
          {
            "name": "1 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "2 dl färdig vaniljsås"
          }
        ]
      }
    ],
    "directions": [
      "Smörj en ugnsform, ca 20 × 25 cm. Dela bullarna i halvor eller fjärdedelar och lägg dem tätt i formen, med kanelvirvlarna uppåt.",
      "Vispa ihop ägg, mjölk, grädde, socker, vaniljsocker och salt. Häll blandningen jämnt över bullarna.",
      "Tryck ner bullarna lätt med en sked så att de suger åt sig vätskan. Låt formen stå i 20 minuter. Det är viktigt, annars blir botten blöt och toppen torr.",
      "Sätt ugnen på 175 grader under tiden.",
      "Strö pärlsockret över puddingen. Grädda i mitten av ugnen i 35–40 minuter, tills toppen är gyllene och stanningen har satt sig. Mitten ska bara darra lite när du skakar formen.",
      "Vispa grädden till mjuka toppar och vänd ner den i vaniljsåsen. Ställ kallt.",
      "Låt puddingen svalna i 10 minuter innan servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera puddingen direkt i formen på bordet, så att alla ser den gyllene, krispiga ytan.",
          "Ös upp portioner med en stor sked och lägg en rejäl klick kall vaniljkräm bredvid eller ovanpå.",
          "Strö lite extra pärlsocker och några nypor kanel över precis före servering.",
          "Funkar också med kardemummabullar eller annat gammalt vetebröd."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "17-havreflarn",
    "title": "Spröda havreflarn doppade i mörk choklad",
    "description": "Havregryn, sirap, socker och växtbaserat margarin blir tunna, gyllene flarn som är nästan genomskinliga, som spets. Halva flarnet doppas i mörk choklad och får några flingsaltkorn. Elegant till kaffet och fint att ge bort i en burk med band.",
    "image": "assets/recipes/17-havreflarn.webp",
    "cardImage": "assets/recipes/17-havreflarn-card.webp",
    "alt": "Spröda havreflarn doppade i mörk choklad",
    "meals": [
      "baking"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "20 min (i omgångar)",
      "Portioner": "ca 30 flarn",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Swedish",
      "Gift",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Flarn",
        "items": [
          {
            "name": "100 g växtbaserat margarin (mjölkfritt)"
          },
          {
            "name": "2 dl havregryn",
            "key": "havre"
          },
          {
            "name": "1 dl strösocker",
            "key": "socker"
          },
          {
            "name": "2 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "2 msk havredryck",
            "key": "havredryck"
          },
          {
            "name": "1 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "½ tsk bakpulver"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Chokladdopp",
        "items": [
          {
            "name": "100 g mörk choklad, 70 % (kontrollera att den är mjölkfri)",
            "key": "choklad"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Klä två plåtar med bakplåtspapper.",
      "Smält margarinet i en kastrull. Ta kastrullen från värmen och rör ner havregryn, socker, sirap, havredryck, mjöl, bakpulver och salt.",
      "Klicka ut små högar, 1 tsk vardera, med minst 8 cm mellanrum. Flarnen flyter ut mycket, så lägg högst 8 per plåt.",
      "Grädda en plåt i taget i mitten av ugnen i 5–6 minuter, tills flarnen är jämnt gyllenbruna och spetsiga. Håll koll, de går fort från gyllene till brända.",
      "Låt flarnen svalna på plåten i 2–3 minuter, tills de är fasta nog att lyfta. Flytta dem till ett galler med en tunn stekspade. Fastnar de, ställ in plåten i ugnen i 30 sekunder.",
      "Smält två tredjedelar av chokladen i en skål över sjudande vatten. Ta av skålen och rör ner resten av chokladen tills den har smält. Då blir chokladen blank när den stelnar.",
      "Doppa halva flarnet i chokladen, låt överskottet rinna av och lägg det på bakplåtspapper. Strö över några flingsaltkorn.",
      "Låt chokladen stelna i rumstemperatur, eller 10 minuter i kylen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "För ett restaurangmässigt utseende: lägg de varma flarnen över en kavel så att de stelnar i en böjd form.",
          "Stapla flarnen lätt förskjutet på ett fat, så att mönstret i spetsen syns.",
          "Förvara dem i en lufttät burk, där de håller sig spröda i ungefär en vecka.",
          "Servera till kaffe, glass eller chokladmoussen i recept 9."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "18-appelrosor",
    "title": "Äppelrosor i smördeg med kanel",
    "description": "En rulle smördeg, två röda äpplen och en sked sylt. Tunna äppelskivor rullas ihop med smördegen till rosor, där de röda skalkanterna blir kronblad. De gräddas gyllene och pudras med florsocker. Ser ut som från ett franskt konditori.",
    "image": "assets/recipes/18-appelrosor.webp",
    "cardImage": "assets/recipes/18-appelrosor-card.webp",
    "alt": "Äppelrosor i smördeg med kanel",
    "meals": [
      "baking",
      "dessert",
      "party"
    ],
    "metadata": {
      "Förberedelse": "30 min",
      "Tillagning": "40 min",
      "Portioner": "6 rosor",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 rulle färdigkavlad smördeg (ca 275 g)",
            "key": "smordeg"
          },
          {
            "name": "2 röda äpplen, t.ex. Royal Gala eller Ingrid Marie",
            "key": "apple"
          },
          {
            "name": "Saft av ½ citron",
            "key": "citron"
          },
          {
            "name": "3 msk aprikosmarmelad eller hallonsylt"
          },
          {
            "name": "1 msk vatten",
            "basic": true
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "Smör till formen",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Florsocker"
          },
          {
            "name": "Vaniljglass eller lättvispad grädde (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 190 grader. Smörj 6 hål i en muffinsplåt.",
      "Dela äpplena på mitten och skär ut kärnhusen. Skal ska sitta kvar. Skär halvorna i tunna halvmånar, ca 2 mm.",
      "Lägg äppelskivorna i en skål med citronsaft och vatten så att de täcks. Värm i mikron i 2–3 minuter, eller sjud dem i en kastrull i 2 minuter, tills de är mjuka och böjliga. Låt rinna av på hushållspapper.",
      "Värm sylten med 1 msk vatten så att den blir lättare att bre. Blanda socker och kanel.",
      "Rulla ut smördegen och skär 6 remsor på längden, ca 4 cm breda.",
      "Bred ett tunt lager sylt på varje remsa och strö över lite kanelsocker.",
      "Lägg äppelskivorna omlott längs remsans övre halva, med skalkanten uppåt så att den sticker upp ca 1 cm över degkanten.",
      "Vik upp nedre halvan av degen över äpplenas nedre del. Rulla ihop remsan löst från ena kortsidan till en ros och tryck fast änden.",
      "Ställ rosorna i muffinsplåten. Grädda i nedre delen av ugnen i 35–40 minuter, tills degen är gyllene och genomgräddad även i mitten. Lägg folie över efter 20 minuter om äppelkanterna mörknar för snabbt.",
      "Låt rosorna svalna i plåten i 5 minuter innan du lyfter ur dem."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Pudra florsocker genom en sil precis före servering, så att det lägger sig som frost på kronbladen.",
          "Pensla gärna äppelkanterna med lite uppvärmd sylt direkt efter gräddningen, så att de blir blanka.",
          "Servera ljumma på ett tårtfat, eller en och en på assietter med en kula vaniljglass.",
          "Rosorna är godast samma dag, medan degen är frasig."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "19-morotslax-pa-ragbrod",
    "title": "Morotslax på rågbröd med dill och kapris",
    "description": "Några helt vanliga morötter hyvlas tunt och marineras i en rökig, salt citronmarinad tills de liknar gravad lax i både färg och konsistens. De läggs i mjuka veck på rågbröd med vegansk färskost, rödlök, kapris och dill. Ser ut som en klassisk laxsmörgås men är bara morötter.",
    "image": "assets/recipes/19-morotslax-pa-ragbrod.webp",
    "cardImage": "assets/recipes/19-morotslax-pa-ragbrod-card.webp",
    "alt": "Morotslax på rågbröd med dill och kapris",
    "meals": [
      "sandwich"
    ],
    "metadata": {
      "Förberedelse": "20 min + minst 1 tim marinering",
      "Tillagning": "5 min",
      "Portioner": "4 smörgåsar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Swedish",
      "Lunch",
      "Make ahead",
      "Budget"
    ],
    "time": null,
    "timeLabel": "Minst 1 tim 25 min",
    "ingredientSections": [
      {
        "title": "Morotslax",
        "items": [
          {
            "name": "3 stora morötter (ca 300 g)",
            "key": "morot"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "1 tsk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 tsk rökt paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Smörgåsar",
        "items": [
          {
            "name": "4 skivor mörkt rågbröd",
            "key": "brod"
          },
          {
            "name": "125 g vegansk färskost (havrebaserad)",
            "key": "vegansk-farskost"
          },
          {
            "name": "½ rödlök",
            "key": "rodlok"
          },
          {
            "name": "1 msk kapris",
            "key": "kapris"
          },
          {
            "name": "1 knippe dill",
            "key": "dill"
          },
          {
            "name": "1 citron",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Skala morötterna. Hyvla långa, breda band med en potatisskalare och vrid moroten efter hand. Den smala kärnan som blir kvar kan du äta som snacks.",
      "Koka upp en kastrull med saltat vatten. Blanchera morotsbanden i 1–2 minuter, tills de är böjliga men inte mjuka.",
      "Häll av och skölj banden i kallt vatten. Klappa dem torra med hushållspapper.",
      "Rör ihop olja, citronsaft, soja, rökt paprika, salt, socker och peppar. Vänd morotsbanden i marinaden.",
      "Täck och låt marinera i kylen i minst 1 timme, gärna över natten. Ju längre, desto mer lik gravad lax blir smaken.",
      "Skala rödlöken och skiva den i tunna ringar. Skär citronen i tunna klyftor.",
      "Bred ett tjockt lager färskost på varje brödskiva, ända ut i kanterna.",
      "Lyft upp morotsbanden ur marinaden och lägg dem i mjuka veck över färskosten, som skivad lax.",
      "Toppa med rödlöksringar, kapris och dillkvistar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Vik några morotsband till en liten ros mitt på smörgåsen för ett extra elegant intryck.",
          "Avsluta med nymald svartpeppar och en citronklyfta på sidan.",
          "Servera på ett träbräde eller en ljus tallrik, med en kniv och gaffel som på en dansk lunchrestaurang.",
          "Morotslaxen håller i 3–4 dagar i kylen och går lika bra i en sallad eller på en bagel."
        ]
      }
    ],
    "pantryKeys": [
      "morot",
      "brod",
      "vegansk-farskost",
      "rodlok"
    ]
  },
  {
    "id": "20-smorrebrod",
    "title": "Smørrebrød med kall potatis, rostad lök och krasse",
    "description": "Gårdagens kokta potatis skivas tunt och läggs som fjäll på smörat rågbröd med små prickar av majonnäs. Ovanpå kommer krispig rostad lök, rosa rädisor, krasse, gräslök och flingsalt. En Köpenhamnsklassiker som gör rester till lunch på en finare restaurang.",
    "image": "assets/recipes/20-smorrebrod.webp",
    "cardImage": "assets/recipes/20-smorrebrod-card.webp",
    "alt": "Smørrebrød med kall potatis, rostad lök och krasse",
    "meals": [
      "sandwich"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "0 min",
      "Portioner": "4 smørrebrød",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Danish",
      "Lunch",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 15,
    "timeLabel": "15 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "4 skivor mörkt, kompakt rågbröd",
            "key": "brod"
          },
          {
            "name": "2 msk smör, rumsvarmt",
            "key": "smor"
          },
          {
            "name": "400 g kokt, kall fast potatis (ca 6–8 st)",
            "key": "potatis"
          },
          {
            "name": "4 msk majonnäs",
            "key": "majo"
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          },
          {
            "name": "4 rädisor",
            "key": "radisa"
          },
          {
            "name": "3 msk rostad lök"
          },
          {
            "name": "1 ask krasse",
            "key": "orter"
          },
          {
            "name": "2 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Bred smöret på brödskivorna ända ut i kanterna. Det skyddar brödet från att bli blött.",
      "Skala potatisen om du vill ha ett renare utseende. Skiva den 3–4 mm tunt med en vass kniv.",
      "Lägg potatisskivorna omlott som fjäll så att de täcker hela brödskivan.",
      "Rör ihop majonnäs och citronsaft. Fyll en fryspåse, klipp av ett litet hörn och spritsa små prickar eller ett tunt sicksackband över potatisen.",
      "Skiva rädisorna papperstunt och lägg några skivor på varje smørrebrød.",
      "Strö över rostad lök, krasse och gräslök precis före servering, så att löken håller sig krispig.",
      "Avsluta med flingsalt och nymald svartpeppar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Låt några krasseblad och rädisskivor sticka upp på höjden, det ger smørrebrødet liv.",
          "Servera ett smørrebrød per tallrik, med kniv och gaffel som i Danmark.",
          "Fast potatis håller formen bäst, mjölig potatis smular sönder när du skivar den.",
          "Servera gärna med ett glas kall öl eller mineralvatten med citron."
        ]
      }
    ],
    "pantryKeys": [
      "brod",
      "potatis",
      "majo",
      "radisa"
    ]
  },
  {
    "id": "21-kottbullssmorgas",
    "title": "Köttbullsmörgås med rödbetssallad och knaprig gurka",
    "description": "Överblivna köttbullar halveras och läggs på rågbröd med krämig, rosaröd rödbetssallad. Ovanpå kommer tunna band av saltgurka, rödlöksringar och persilja. Julbordsklassikern som en snygg delismörgås.",
    "image": "assets/recipes/21-kottbullssmorgas.webp",
    "cardImage": "assets/recipes/21-kottbullssmorgas-card.webp",
    "alt": "Köttbullsmörgås med rödbetssallad och knaprig gurka",
    "meals": [
      "sandwich"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "5 min",
      "Portioner": "4 smörgåsar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Swedish",
      "Lunch",
      "Christmas",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "Snabb rödbetssallad",
        "items": [
          {
            "name": "100 g inlagda rödbetor, avrunna",
            "key": "rodbetor"
          },
          {
            "name": "½ dl crème fraiche",
            "key": "creme-fraiche"
          },
          {
            "name": "2 msk majonnäs",
            "key": "majo"
          },
          {
            "name": "1 tsk senap",
            "key": "senap"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Smörgåsar",
        "items": [
          {
            "name": "4 skivor rågbröd eller grovt surdegsbröd",
            "key": "brod"
          },
          {
            "name": "2 msk smör, rumsvarmt",
            "key": "smor"
          },
          {
            "name": "4 blad smörsallad",
            "key": "sallad"
          },
          {
            "name": "16 kalla köttbullar (ca 250 g), rester eller köpta",
            "key": "kottbullar"
          },
          {
            "name": "2 saltgurkor",
            "key": "saltgurka"
          },
          {
            "name": "½ rödlök",
            "key": "rodlok"
          },
          {
            "name": "1 dl plockad bladpersilja"
          }
        ]
      }
    ],
    "directions": [
      "Hacka rödbetorna i små tärningar, ca ½ cm. Rör ihop dem med crème fraiche, majonnäs och senap. Smaka av med salt och peppar och ställ kallt.",
      "Dela köttbullarna på mitten. Vill du ha krispiga kanter, stek snittytorna i en torr stekpanna i 2 minuter och låt dem svalna.",
      "Skiva saltgurkorna i tunna band på längden med en osthyvel eller en vass kniv. Skiva rödlöken i tunna ringar.",
      "Bred smör på brödskivorna och lägg ett salladsblad på varje.",
      "Bred eller klicka rödbetssallad över salladsbladet.",
      "Lägg 8 köttbullshalvor tätt på varje smörgås, med snittytan uppåt.",
      "Vik gurkbanden i vågor mellan köttbullarna och toppa med rödlök och persilja."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Låt lite av den rosa rödbetssalladen synas mellan köttbullarna, det ger en vacker kontrast mot den mörka ytan.",
          "Avsluta med nymald svartpeppar och några persiljeblad ovanpå.",
          "Servera på ett träbräde med en extra skål rödbetssallad och några hela saltgurkor bredvid.",
          "Rödbetssalladen håller i 3 dagar i kylen."
        ]
      }
    ],
    "pantryKeys": [
      "rodbetor",
      "brod",
      "kottbullar",
      "saltgurka"
    ]
  },
  {
    "id": "22-hasselbackspotatis",
    "title": "Krispig hasselbackspotatis med ströbröd och lagrad ost",
    "description": "Potatisen i påsen skärs i tunna solfjädrar, penslas med smör och rostas tills varje lamell är krispig som chips och insidan krämig. Till sist får den ett gyllene täcke av ströbröd och riven lagrad ost. Sveriges vackraste potatis, och den är lättare att göra än den ser ut.",
    "image": "assets/recipes/22-hasselbackspotatis.webp",
    "cardImage": "assets/recipes/22-hasselbackspotatis-card.webp",
    "alt": "Krispig hasselbackspotatis med ströbröd och lagrad ost",
    "meals": [
      "side"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "65 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Classic",
      "Beginner friendly",
      "Budget"
    ],
    "time": 85,
    "timeLabel": "1 tim 25 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "12 medelstora, avlånga potatisar (ca 1 kg), gärna fast potatis"
          },
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk flingsalt",
            "basic": true
          },
          {
            "name": "3 msk ströbröd",
            "key": "strobrod"
          },
          {
            "name": "½ dl riven lagrad ost, t.ex. prästost eller Västerbottensost",
            "key": "ost-lagrad"
          },
          {
            "name": "4 kvistar färsk timjan eller 1 tsk torkad",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader.",
      "Skala potatisen. Lägg en potatis i taget i en stor slev, eller mellan två träslevar, så att kniven stoppar innan den skär igenom.",
      "Skär tunna skivor, 2–3 mm, tvärs över hela potatisen.",
      "Skölj potatisarna i kallt vatten och böj lätt isär lamellerna så att stärkelsen sköljs bort. Torka dem noga med en kökshandduk.",
      "Smält smöret tillsammans med oljan. Lägg potatisarna i en ugnsform med snittsidan uppåt. Pensla dem generöst, även ner mellan lamellerna, och strö över flingsalt.",
      "Rosta i mitten av ugnen i 30 minuter. Pensla igen med fettet i formen, nu har lamellerna börjat öppna sig. Rosta 20 minuter till.",
      "Blanda ströbröd, ost och timjanblad. Strö blandningen över potatisarna och rosta i 10–15 minuter, tills de är djupt gyllene och krispiga och mjuka i mitten när du sticker i dem."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg upp potatisarna tätt på ett varmt fat, så att de solfjädersformade lamellerna syns.",
          "Toppa med några färska timjankvistar och lite extra flingsalt.",
          "Servera direkt, de är som krispigast nyss ur ugnen.",
          "Passar till nästan allt, från söndagsstek och lax till en enkel grönsallad."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "23-balsamicorostade-lokhalvor",
    "title": "Balsamicorostade lökhalvor med timjan",
    "description": "Den gula löken, kökets mest anonyma råvara, halveras och rostas långsamt tills den är söt och mjuk som marmelad. Den glaseras blank med balsamvinäger, och lökringarna syns som årsringar i ett träd. Passar till kött, linser eller på en ostbricka.",
    "image": "assets/recipes/23-balsamicorostade-lokhalvor.webp",
    "cardImage": "assets/recipes/23-balsamicorostade-lokhalvor-card.webp",
    "alt": "Balsamicorostade lökhalvor med timjan",
    "meals": [
      "side"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "50 min",
      "Portioner": "4 (8 lökhalvor)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Beginner friendly",
      "Budget"
    ],
    "time": 60,
    "timeLabel": "1 tim",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "4 medelstora gula lökar",
            "key": "lok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "2 msk balsamvinäger",
            "key": "vinager"
          },
          {
            "name": "1 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "6 kvistar färsk timjan eller 1 tsk torkad",
            "key": "orter"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader.",
      "Dela lökarna på mitten tvärs över, så att ringarna syns på snittytan. Låt skalet sitta kvar, det håller ihop löken. Skär bort en tunn skiva av topp och rot så att halvorna står stadigt.",
      "Hetta upp 1 msk olja i en ugnssäker stekpanna på medelhög värme. Lägg lökhalvorna med snittytan nedåt och stek i 4–5 minuter, tills snittytorna är djupt gyllenbruna.",
      "Vänd lökhalvorna så att snittytan är uppåt. Har du ingen ugnssäker panna, flytta dem till en ugnsform.",
      "Rör ihop balsamvinäger, sirap, resten av oljan, salt och peppar. Skeda glasyren över lökarna och lägg timjankvistarna runt om.",
      "Täck med folie och rosta i 30 minuter.",
      "Ta bort folien och ös lökarna med skyn. Rosta 15 minuter till, tills de är mjuka hela vägen in när du sticker i en kniv och ytan är blank och karamelliserad."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Dra bort det yttersta skalet precis före servering, eller låt det sitta kvar för en rustik look.",
          "Lägg halvorna med snittytan uppåt på ett fat och skeda över den sirapsliknande skyn.",
          "Avsluta med några färska timjanblad och flingsalt.",
          "Servera till en stek, en linsgryta eller på en ostbricka med lagrad ost och knäckebröd."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "24-rotmos",
    "title": "Sammetslent rotmos med pepparrot och gräslöksolja",
    "description": "En kålrot och några potatisar vispas till ett silkeslent mos med smör och färsk riven pepparrot. Moset toppas med en lysande grön gräslöksolja som samlas i små gropar på ytan. Husmanskost som ser ut som från en finkrog.",
    "image": "assets/recipes/24-rotmos.webp",
    "cardImage": "assets/recipes/24-rotmos-card.webp",
    "alt": "Sammetslent rotmos med pepparrot och gräslöksolja",
    "meals": [
      "side"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "30 min",
      "Portioner": "4–6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Swedish",
      "Comfort food",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Gräslöksolja",
        "items": [
          {
            "name": "1 knippe gräslök (ca 25 g)",
            "key": "orter"
          },
          {
            "name": "1 dl neutral rapsolja",
            "key": "olja"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Rotmos",
        "items": [
          {
            "name": "1 kålrot (ca 800 g)",
            "key": "kalrot"
          },
          {
            "name": "400 g mjölig potatis (ca 4 st)",
            "key": "potatis"
          },
          {
            "name": "1 tsk salt till kokvattnet",
            "basic": true
          },
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "1 dl varm mjölk",
            "key": "mjolk"
          },
          {
            "name": "2–3 msk färsk riven pepparrot, eller 1 msk pepparrot från tub",
            "key": "pepparrot"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 bit färsk pepparrot att riva över",
            "key": "pepparrot"
          },
          {
            "name": "1 msk finklippt gräslök",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Koka upp en kastrull med vatten och ställ fram en skål med isvatten. Doppa gräslöken i det kokande vattnet i 10 sekunder och lägg den direkt i isvattnet. Då behåller den sin klargröna färg.",
      "Krama ur gräslöken ordentligt, klipp den grovt och mixa den med olja och salt med en stavmixer i 1–2 minuter.",
      "Sila oljan genom en fin sil eller ett kaffefilter och låt den rinna igenom utan att pressa, ca 15 minuter.",
      "Skala kålroten och skär den i tärningar, ca 2 cm. Skala potatisen och skär den i tärningar, ca 3 cm.",
      "Koka kålroten i saltat vatten i 10 minuter. Lägg i potatisen och koka 15–20 minuter till, tills allt är helt mjukt.",
      "Häll av vattnet ordentligt. Ställ tillbaka kastrullen på plattan i 1–2 minuter så att det sista vattnet ångar bort.",
      "Mosa med potatisstöt, eller pressa genom en potatispress för det silkeslenaste moset. Använd inte stavmixer, då blir potatisen klistrig.",
      "Vispa ner smöret och den varma mjölken lite i taget, tills moset är fluffigt. Rör ner pepparroten och smaka av med salt och vitpeppar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bred ut moset i en grund skål och gör svepande gropar med baksidan av en sked.",
          "Droppa gräslöksolja i groparna, så att den lyser grön mot det ljusorange moset.",
          "Riv lite färsk pepparrot över precis före servering och strö över klippt gräslök.",
          "Servera till fläsklägg, korv, köttbullar eller ugnsbakad fisk.",
          "Överbliven gräslöksolja håller i ca 1 vecka i kylen och är god på soppor och ägg."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "25-rokig-romesco",
    "title": "Rökig romesco på paprika, gammalt bröd och mandel",
    "description": "Två paprikor som börjat bli skrynkliga, en skiva gammalt bröd och en näve mandlar rostas och mixas med vitlök, rökt paprikapulver och vinäger. Det blir en tegelröd, sammetslen röra som toppas med olivolja och rostade mandelspån. Passar till grönsaker, potatis, fisk eller bara bröd.",
    "image": "assets/recipes/25-rokig-romesco.webp",
    "cardImage": "assets/recipes/25-rokig-romesco-card.webp",
    "alt": "Rökig romesco på paprika, gammalt bröd och mandel",
    "meals": [
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "30 min",
      "Portioner": "ca 3 dl (4–6 portioner)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Dip",
      "Spanish",
      "Make ahead",
      "Leftovers",
      "Budget"
    ],
    "time": 40,
    "timeLabel": "40 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 röda paprikor",
            "key": "paprika"
          },
          {
            "name": "2 vitlöksklyftor, med skal",
            "key": "vitlok"
          },
          {
            "name": "½ dl mandlar med skal",
            "key": "mandel"
          },
          {
            "name": "1 skiva gammalt bröd (ca 30 g), gärna surdeg (kontrollera att det är veganskt)",
            "key": "brod"
          },
          {
            "name": "3 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 tsk rökt paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 msk rödvinsvinäger eller vitvinsvinäger",
            "key": "vinager"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 msk rostade mandelspån",
            "key": "mandel"
          },
          {
            "name": "1 msk hackad bladpersilja"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          },
          {
            "name": "1 krm rökt paprikapulver",
            "key": "kryddor"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader. Dela paprikorna på längden och ta bort kärnhusen.",
      "Lägg paprikahalvorna med skalet uppåt på en plåt med bakplåtspapper, tillsammans med vitlöksklyftorna i skal. Rosta i 25–30 minuter, tills paprikaskalet har svarta fläckar och bubblor.",
      "Lägg paprikorna i en skål och täck med ett lock eller en tallrik i 10 minuter. Dra sedan av skalet, det lossnar lätt. Kläm ut vitlöken ur skalet.",
      "Rosta mandlarna i en torr stekpanna på medelvärme i 3–4 minuter, tills de doftar.",
      "Bryt brödet i bitar och stek dem i 1 msk olivolja i samma panna i 2–3 minuter, tills de är gyllene.",
      "Mixa paprika, vitlök, mandlar, bröd, tomatpuré, rökt paprika, vinäger, salt och chili i en matberedare eller med stavmixer. Tillsätt resten av oljan medan du mixar.",
      "Mixa tills rörans konsistens är jämn men med lite struktur kvar. Smaka av med salt och vinäger."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bred ut romescon i en grund skål och gör en virvel med baksidan av en sked.",
          "Ringla olivolja i virveln och strö över mandelspån, persilja och ett damm av rökt paprikapulver.",
          "Servera som dipp till grönsaksstavar och bröd, eller till grillad fisk, kyckling och rostad potatis.",
          "Romescon håller i ca 5 dagar i kylen och blir godare dagen efter."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "26-labneh",
    "title": "Hemmagjord labneh med paprikasmör och örter",
    "description": "En burk turkisk yoghurt silas över natten och blir en krämig, syrlig färskost. Den bres ut i virvlar och toppas med glödande rött paprikasmör, flingsalt och färska örter. Ser ut som en meze från Istanbul.",
    "image": "assets/recipes/26-labneh.webp",
    "cardImage": "assets/recipes/26-labneh-card.webp",
    "alt": "Hemmagjord labneh med paprikasmör och örter",
    "meals": [
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "10 min + 12–24 tim silning",
      "Tillagning": "5 min",
      "Portioner": "6–8 som dipp (ca 5 dl)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Dip",
      "Middle Eastern",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 1455,
    "timeLabel": "12 tim 15 min–24 tim 15 min",
    "ingredientSections": [
      {
        "title": "Labneh",
        "items": [
          {
            "name": "1 kg turkisk yoghurt (10 %)",
            "key": "yoghurt"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "1 vitlöksklyfta, finriven (valfritt)",
            "key": "vitlok"
          }
        ]
      },
      {
        "title": "Paprikasmör",
        "items": [
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "1 tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "½ tsk chiliflakes",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl blandade färska örter, t.ex. mynta, persilja och dill"
          },
          {
            "name": "Fint rivet skal av ½ citron",
            "key": "citron"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Varmt bröd, t.ex. pitabröd eller tunnbröd",
            "key": "brod"
          }
        ]
      }
    ],
    "directions": [
      "Rör ner saltet i yoghurten.",
      "Klä en sil med en dubbelvikt ostduk, en ren kökshandduk eller två kaffefilter. Ställ silen över en skål.",
      "Häll yoghurten i silen och vik tyget över. Ställ i kylen i 12–24 timmar. Efter 12 timmar är labnehen krämig som en dipp, efter 24 timmar fast och bredbar.",
      "Häll bort vätskan i skålen, eller spara den till bröd- eller pannkakssmet. Rör labnehen slät och blanda i den rivna vitlöken.",
      "Gör paprikasmöret precis före servering. Smält smöret i en liten kastrull på låg värme och ta den från värmen.",
      "Rör ner paprikapulver och chiliflakes och låt dra i 1 minut. Paprikapulver bränns lätt, så låt inte kastrullen stå kvar på plattan."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bred ut labnehen på ett flatt fat i stora virvlar med baksidan av en sked.",
          "Häll det varma paprikasmöret i groparna, så att det rinner ut som glödande röda strimmor mot det vita.",
          "Strö över örter, citronskal och flingsalt.",
          "Servera direkt med varmt bröd och grönsaksstavar.",
          "Rulla överbliven fast labneh till små bollar och lägg dem i olivolja med örter i en burk. De håller i ca 1 vecka i kylen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "27-tonnatosas",
    "title": "Tonnatosås på burktonfisk med kapris och citron",
    "description": "En burk tonfisk, majonnäs, kapris och citron mixas till en sidenlen italiensk sås. Den ringlas över kall stek, kyckling, ägghalvor eller rostad potatis och toppas med krispigt stekt kapris. Klassisk vitello tonnato utan dyra råvaror.",
    "image": "assets/recipes/27-tonnatosas.webp",
    "cardImage": "assets/recipes/27-tonnatosas-card.webp",
    "alt": "Tonnatosås på burktonfisk med kapris och citron",
    "meals": [
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "2 min",
      "Portioner": "ca 3 dl (4–6 portioner)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Gluten free",
      "Dip",
      "Italian",
      "Leftovers",
      "Budget"
    ],
    "time": 12,
    "timeLabel": "12 min",
    "ingredientSections": [
      {
        "title": "Sås",
        "items": [
          {
            "name": "1 burk tonfisk i olja (ca 185 g), avrunnen",
            "key": "tonfisk"
          },
          {
            "name": "1 dl majonnäs",
            "key": "majo"
          },
          {
            "name": "2 msk kapris",
            "key": "kapris"
          },
          {
            "name": "2 sardellfiléer (valfritt, ger djupare smak)",
            "key": "sardeller"
          },
          {
            "name": "Fint rivet skal och 2 msk saft av 1 citron",
            "key": "citron"
          },
          {
            "name": "2–4 msk kallt vatten",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Krispig kapris",
        "items": [
          {
            "name": "1 msk kapris",
            "key": "kapris"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Kall, tunt skivad stek eller kyckling, ägghalvor, kokt potatis eller rostade grönsaker"
          },
          {
            "name": "1 dl ruccola eller bladpersilja",
            "key": "sallad"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Mixa tonfisk, majonnäs, kapris, sardeller, citronskal och citronsaft slätt med en stavmixer.",
      "Späd med vatten, en matsked i taget, tills såsen har konsistens som tjock grädde.",
      "Smaka av med svartpeppar. Salt behövs sällan, eftersom tonfisk, kapris och sardeller redan är salta.",
      "Ställ såsen i kylen i minst 30 minuter så att smakerna går ihop.",
      "Klappa kaprisen till den krispiga kaprisen torr med hushållspapper. Hetta upp olivoljan i en liten stekpanna och stek kaprisen i 1–2 minuter, tills knopparna öppnar sig som små blommor och blir krispiga. Låt rinna av på hushållspapper."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg ut tunt skivad kall stek, kyckling eller ägghalvor omlott på ett stort, flatt fat.",
          "Ringla tonnatosåsen över i ett brett band, så att lite av köttet syns i kanterna.",
          "Strö över den krispiga kaprisen, ruccola och nymald svartpeppar, och ringla över några droppar olivolja.",
          "Servera resten av såsen i en skål som dipp till grönsaker.",
          "Såsen håller i 3 dagar i kylen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "28-pasta-aglio-e-olio",
    "title": "Pasta aglio e olio med citronpangrattato",
    "description": "Spagetti, vitlök, olivolja och en skiva gammalt bröd. Brödet rostas till gyllene, krispiga smulor med citronskal och chili och strös över blank, vitlöksdoftande pasta. Italiensk nattmat på 15 minuter.",
    "image": "assets/recipes/28-pasta-aglio-e-olio.webp",
    "cardImage": "assets/recipes/28-pasta-aglio-e-olio-card.webp",
    "alt": "Pasta aglio e olio med citronpangrattato",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "15 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Italian",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "Citronpangrattato",
        "items": [
          {
            "name": "2 skivor gammalt bröd (ca 60 g), gärna surdeg (kontrollera att det är veganskt)",
            "key": "brod"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "Fint rivet skal av 1 citron",
            "key": "citron"
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Pasta",
        "items": [
          {
            "name": "400 g torkad spagetti (utan ägg)",
            "key": "pasta"
          },
          {
            "name": "2 msk salt till pastavattnet",
            "basic": true
          },
          {
            "name": "1 dl olivolja",
            "key": "olja"
          },
          {
            "name": "6 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "½ tsk chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "1 dl hackad bladpersilja"
          },
          {
            "name": "1 msk citronsaft",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Riv brödet grovt eller mixa det till grova smulor.",
      "Stek smulorna i 2 msk olivolja i en stor stekpanna på medelvärme i 4–5 minuter. Rör ofta, tills de är gyllene och krispiga. Ta av från värmen, rör ner citronskal, chili och salt och lägg upp smulorna på en tallrik.",
      "Koka upp minst 4 liter vatten med salt. Koka spagettin 1 minut kortare än det står på förpackningen. Spara 2 dl av pastavattnet innan du häller av.",
      "Skiva vitlöken tunt medan pastan kokar. Lägg vitlöken och 1 dl olivolja i den kalla stekpannan och värm på låg till medelvärme i 3–4 minuter, tills vitlöken är ljust gyllene. Bränd vitlök blir bitter, så ta av pannan om den mörknar för snabbt. Rör ner chiliflakes de sista 30 sekunderna.",
      "Lägg den avrunna pastan i pannan med 1 dl av pastavattnet. Vänd kraftigt med en tång i 1–2 minuter, tills oljan och vattnet blir en blank, krämig sås som täcker pastan. Tillsätt mer pastavatten om det behövs.",
      "Vänd ner persilja och citronsaft och smaka av med salt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Snurra pastan till höga nystan med en tång mot en slev och lägg ett i varje djup tallrik.",
          "Strö rikligt med pangrattato över precis före servering, så att smulorna håller sig krispiga.",
          "Avsluta med lite extra persilja, citronskal och några droppar olivolja.",
          "Ställ fram resten av smulorna i en skål, alla vill ha mer."
        ]
      }
    ],
    "pantryKeys": [
      "pasta",
      "brod",
      "vitlok",
      "citron",
      "olja"
    ]
  },
  {
    "id": "29-shakshuka",
    "title": "Shakshuka med fetaost och örter",
    "description": "En burk krossade tomater, en lök och några ägg. Äggen sjuder i en kryddig, djupröd tomatsås tills vitan har stelnat och gulan är krämig. Toppas med smulad fetaost och gröna örter och serveras direkt i pannan, med bröd att doppa.",
    "image": "assets/recipes/29-shakshuka.webp",
    "cardImage": "assets/recipes/29-shakshuka-card.webp",
    "alt": "Shakshuka med fetaost och örter",
    "meals": [
      "main",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "25 min",
      "Portioner": "2 (dubbla satsen i två pannor till 4)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Middle Eastern",
      "One pot",
      "Beginner friendly",
      "Budget"
    ],
    "time": 30,
    "timeLabel": "30 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 röd paprika",
            "key": "paprika"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 krm chiliflakes eller cayennepeppar",
            "key": "kryddor"
          },
          {
            "name": "1 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "½ tsk strösocker",
            "key": "socker"
          },
          {
            "name": "4 ägg",
            "key": "agg"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "50 g fetaost",
            "key": "fetaost"
          },
          {
            "name": "½ dl hackad persilja eller koriander",
            "key": "orter"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          },
          {
            "name": "Bröd, t.ex. surdeg eller pitabröd",
            "key": "brod"
          }
        ]
      }
    ],
    "directions": [
      "Hacka löken och skär paprikan i tunna strimlor. Skiva vitlöken.",
      "Hetta upp oljan i en stekpanna med lock, ca 24–26 cm, på medelvärme. Fräs lök och paprika i 5 minuter, tills de är mjuka.",
      "Tillsätt vitlök, spiskummin, paprikapulver och chili och fräs i 1 minut, tills det doftar.",
      "Rör ner tomatpuré, krossade tomater, salt och socker. Låt sjuda utan lock i 8–10 minuter, tills såsen har tjocknat.",
      "Gör fyra gropar i såsen med en sked och knäck ett ägg i varje.",
      "Lägg på locket och låt sjuda på låg till medelvärme i 5–7 minuter, tills vitan har stelnat men gulan fortfarande är krämig."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Smula fetaosten över tomatsåsen runt äggen, inte på gulorna, så att de syns.",
          "Strö över örter och nymald svartpeppar.",
          "Ställ pannan direkt på bordet på en träbricka och servera med rostat bröd att doppa.",
          "Vill du ha extra glans, droppa lite olivolja över precis före servering."
        ]
      }
    ],
    "pantryKeys": [
      "agg",
      "kross",
      "paprika",
      "fetaost",
      "lok"
    ]
  },
  {
    "id": "30-fiskpinnetacos",
    "title": "Fiskpinnetacos med rödkålsslaw och limemajonnäs",
    "description": "Frysta fiskpinnar blir krispiga tacos med knaprig, lila rödkålsslaw, limemajonnäs och koriander i varma tortillas. Barnens favoritmat i en färgsprakande vuxenversion, klar på 20 minuter.",
    "image": "assets/recipes/30-fiskpinnetacos.webp",
    "cardImage": "assets/recipes/30-fiskpinnetacos-card.webp",
    "alt": "Fiskpinnetacos med rödkålsslaw och limemajonnäs",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "20 min",
      "Portioner": "4 (8 tacos)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Mexican",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Tacos",
        "items": [
          {
            "name": "1 paket frysta fiskpinnar (ca 15–16 st)",
            "key": "fiskpinnar"
          },
          {
            "name": "8 små mjöltortillas",
            "key": "tortilla"
          }
        ]
      },
      {
        "title": "Rödkålsslaw",
        "items": [
          {
            "name": "200 g rödkål (ca ¼ huvud)",
            "key": "kal"
          },
          {
            "name": "Saft av ½ lime",
            "key": "lime"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "2 salladslökar",
            "key": "salladslok"
          }
        ]
      },
      {
        "title": "Limemajonnäs",
        "items": [
          {
            "name": "1 dl majonnäs",
            "key": "majo"
          },
          {
            "name": "Fint rivet skal och saft av ½ lime",
            "key": "lime"
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 kruka koriander",
            "key": "orter"
          },
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          },
          {
            "name": "1 färsk röd chili, tunt skivad (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på den temperatur som står på fiskpinnarnas förpackning, oftast 225 grader. Lägg fiskpinnarna på en plåt med bakplåtspapper och grädda i 15–18 minuter. Vänd dem halvvägs så att båda sidorna blir krispiga.",
      "Strimla rödkålen så tunt du kan, med en vass kniv eller mandolin. Massera kålen med limesaft, salt och socker i 1 minut. Låt stå i 10 minuter, då blir den mjukare och klart magentafärgad.",
      "Skiva salladslöken tunt och vänd ner den i slawen.",
      "Rör ihop majonnäs, limeskal, limesaft och chiliflakes.",
      "Värm tortillorna en i taget i en torr stekpanna på hög värme, 20–30 sekunder per sida. Lägg dem i en vikt kökshandduk så att de håller värmen.",
      "Lägg en sked slaw på varje tortilla och toppa med två fiskpinnar.",
      "Ringla över limemajonnäs och toppa med koriander och chili."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Fyll en spritspåse eller fryspåse med limemajonnäsen och spritsa tunna sicksackränder över fiskpinnarna.",
          "Ställ tacosen tätt i rad på ett avlångt fat, så att de stöttar varandra.",
          "Servera med limeklyftor och resten av slawen i en skål.",
          "Låt alla bygga sina egna tacos vid bordet, det blir festligt även en vanlig tisdag."
        ]
      }
    ],
    "pantryKeys": [
      "fiskpinnar",
      "tortilla",
      "kal",
      "lime",
      "majo"
    ]
  },
  {
    "id": "31-stekt-ris",
    "title": "Stekt ris med grillkyckling, ärter och sesam",
    "description": "Gårdagens ris, resterna av en grillkyckling, frysta ärter och ett par ägg wokas snabbt med soja, vitlök och ingefära. Riset formas till en kupol och toppas med salladslök och rostade sesamfrön. Bättre än hämtmaten, och klart på 15 minuter.",
    "image": "assets/recipes/31-stekt-ris.webp",
    "cardImage": "assets/recipes/31-stekt-ris-card.webp",
    "alt": "Stekt ris med grillkyckling, ärter och sesam",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "10 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Dairy free",
      "Asian",
      "Family friendly",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "8 dl kokt, kallt ris, gärna från dagen innan",
            "key": "ris"
          },
          {
            "name": "300 g plockad grillkyckling (ca ½ kyckling)",
            "key": "kyckling"
          },
          {
            "name": "2 dl frysta gröna ärter",
            "key": "arter"
          },
          {
            "name": "3 ägg",
            "key": "agg"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "3 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "3 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 cm färsk ingefära"
          },
          {
            "name": "4 salladslökar",
            "key": "salladslok"
          },
          {
            "name": "3 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk sesamolja (valfritt)"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 msk sesamfrön",
            "key": "fron"
          },
          {
            "name": "Chilisås, t.ex. sriracha (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Förbered allt innan du börjar, det går fort när wokningen väl är igång. Riv vitlök och ingefära. Skiva salladslöken och håll isär de vita och de gröna delarna. Bryt isär klumparna i riset med fingrarna.",
      "Rosta sesamfröna i en torr wok eller stor stekpanna i 1–2 minuter, tills de är gyllene. Häll upp dem.",
      "Vispa äggen med saltet. Hetta upp 1 msk olja i pannan på hög värme, häll i äggen och rör tills de nästan har stelnat. Lyft upp äggen på en tallrik.",
      "Hetta upp resten av oljan. Fräs vitlök, ingefära och de vita salladslöksbitarna i 30 sekunder.",
      "Lägg i riset och stek på hög värme i 3–4 minuter. Rör inte för ofta, riset ska få lite stekyta.",
      "Tillsätt kyckling och ärter och stek i 2–3 minuter, tills allt är genomvarmt.",
      "Rör ner soja, socker och sesamolja och vänd tillbaka äggen. Smaka av med mer soja."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Tryck en portion ris i en liten skål och stjälp upp den på en tallrik, så får du en snygg kupol.",
          "Strö över de gröna salladslöksbitarna och de rostade sesamfröna.",
          "Servera med en liten skål soja och lite chilisås vid sidan.",
          "Kallt ris från dagen innan blir bäst. Nykokt ris klumpar sig och blir kladdigt."
        ]
      }
    ],
    "pantryKeys": [
      "ris",
      "kyckling",
      "arter",
      "agg",
      "soja"
    ]
  },
  {
    "id": "32-rod-linssoppa",
    "title": "Krämig röd linssoppa med kokos och chiliolja",
    "description": "Röda linser, en burk krossade tomater och en burk kokosmjölk kokas till en sammetslen, solgul soppa med spiskummin och ingefära. Den toppas med glödande röd chiliolja, en virvel kokosmjölk och färsk koriander. Värmande, mättande och klar på en halvtimme.",
    "image": "assets/recipes/32-rod-linssoppa.webp",
    "cardImage": "assets/recipes/32-rod-linssoppa-card.webp",
    "alt": "Krämig röd linssoppa med kokos och chiliolja",
    "meals": [
      "soup",
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "25 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Indian",
      "Meal prep",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Soppa",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 cm färsk ingefära"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk malen gurkmeja",
            "key": "kryddor"
          },
          {
            "name": "1 tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "2 dl röda linser",
            "key": "linser"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "1 burk kokosmjölk (400 ml)",
            "key": "kokosmjolk"
          },
          {
            "name": "6 dl vatten + 1 grönsaksbuljongtärning",
            "key": "buljong"
          },
          {
            "name": "1 msk limesaft eller citronsaft",
            "key": "lime"
          },
          {
            "name": "Salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Chiliolja",
        "items": [
          {
            "name": "3 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "½ tsk paprikapulver",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl hackad koriander",
            "key": "orter"
          },
          {
            "name": "4 msk havreyoghurt (valfritt)",
            "key": "havreyoghurt"
          },
          {
            "name": "Naanbröd eller annat bröd",
            "key": "brod"
          }
        ]
      }
    ],
    "directions": [
      "Hacka löken och riv vitlök och ingefära. Skölj linserna i en sil under kallt vatten.",
      "Fräs löken i oljan i en stor kastrull på medelvärme i 4 minuter, tills den är mjuk.",
      "Tillsätt vitlök, ingefära, spiskummin, gurkmeja och paprikapulver och fräs i 1 minut.",
      "Häll i linser, krossade tomater, vatten och buljongtärning. Spara 3 msk av kokosmjölken till garnering och häll i resten.",
      "Koka upp och låt sjuda under lock i 15–20 minuter. Rör då och då, tills linserna är helt sönderkokta.",
      "Mixa soppan slät med en stavmixer. Späd med lite vatten om den är för tjock. Smaka av med limesaft och salt.",
      "Gör chilioljan: värm oljan försiktigt i en liten kastrull i 1 minut. Ta av från värmen och rör ner chiliflakes och paprikapulver. Paprikapulver bränns lätt, så låt inte kastrullen stå kvar på plattan."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Häll upp soppan i djupa skålar och droppa kokosmjölken i en virvel på ytan.",
          "Ringla chilioljan över i tunna, glödande röda trådar och strö över koriander.",
          "Lägg en klick havreyoghurt mitt i, om du vill.",
          "Servera med varmt naanbröd.",
          "Soppan blir ännu godare dagen efter och går bra att frysa i portioner."
        ]
      }
    ],
    "pantryKeys": [
      "linser",
      "kokosmjolk",
      "kross",
      "lok",
      "buljong"
    ]
  },
  {
    "id": "33-havremask",
    "title": "Lugnande havremask med honung och yoghurt",
    "description": "Havregryn, en sked honung och en klick yoghurt rörs ihop till en mjuk, krämig mask som lugnar och återfuktar huden. Den serveras i en liten keramikskål med en pensel och en varm, rullad handduk. Som en ansiktsbehandling på ett lyxigt spa, med det du redan har i skafferiet.",
    "image": "assets/recipes/33-havremask.webp",
    "cardImage": "assets/recipes/33-havremask-card.webp",
    "alt": "Lugnande havremask med honung och yoghurt",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "15 min",
      "Räcker till": "1 behandling",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Face",
      "Soothing",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 msk havregryn",
            "key": "havre"
          },
          {
            "name": "2 msk varmt vatten",
            "basic": true
          },
          {
            "name": "1 msk flytande honung",
            "key": "honung"
          },
          {
            "name": "1 msk naturell yoghurt eller filmjölk",
            "key": "yoghurt"
          }
        ]
      }
    ],
    "directions": [
      "Mal havregrynen till ett fint mjöl i en mixer, kaffekvarn eller mortel. Fint mjöl gör masken krämigare och lättare att skölja av.",
      "Rör ihop havremjölet med det varma vattnet och låt det svälla i 2–3 minuter.",
      "Rör ner honung och yoghurt till en jämn kräm.",
      "Tvätta ansiktet. Lägg en varm, fuktig handduk över ansiktet i en minut, så att huden blir mjuk och mottaglig.",
      "Stryk masken i ett jämnt lager över ansiktet med en ren pensel eller fingrarna. Undvik området runt ögonen.",
      "Luta dig tillbaka och låt masken verka i 15 minuter.",
      "Skölj av med ljummet vatten och massera samtidigt med små cirkulära rörelser, så att havren fungerar som en mild peeling. Klappa torrt och avsluta med ansiktskräm."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Blanda masken i en liten keramikskål och ställ den på en bricka med en mjuk pensel bredvid.",
          "Fukta en tvättlapp, rulla ihop den och värm den 20–30 sekunder i mikron. Känn på den innan du använder den, den kan bli het.",
          "Tänd ett ljus, lägg kalla gurkskivor över ögonen och sätt på lugn musik.",
          "Passar fint som en del av en spakväll med vänner, en skål var."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Gör ett lapptest först om du har känslig hud.",
          "Använd inte masken om du är allergisk mot havre, honung eller mjölkprotein, eller på irriterad eller trasig hud.",
          "Gör masken precis innan du ska använda den, den håller sig inte."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "34-kaffeskrubb",
    "title": "Kaffeskrubb av gårdagens kaffesump",
    "description": "Kaffesumpen från morgonens bryggare blandas med farinsocker och kokosolja till en doftande skrubb som gör huden len och glansig. Den fylls på en vacker glasburk med en träsked. Det du brukar slänga blir en present du gärna ger bort.",
    "image": "assets/recipes/34-kaffeskrubb.webp",
    "cardImage": "assets/recipes/34-kaffeskrubb-card.webp",
    "alt": "Kaffeskrubb av gårdagens kaffesump",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "10 min + några timmars torktid",
      "Verkningstid": "2–3 min",
      "Räcker till": "3–4 behandlingar (ca 2 dl)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Body",
      "Natural",
      "Leftovers",
      "Zero waste",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "12 min + torktid",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 dl använd kaffesump från bryggkaffe"
          },
          {
            "name": "½ dl farinsocker"
          },
          {
            "name": "½ dl kokosolja"
          },
          {
            "name": "1 tsk vaniljsocker (för doften)"
          }
        ]
      }
    ],
    "directions": [
      "Bred ut kaffesumpen på en tallrik och låt den torka några timmar eller över natten. Torr sump möglar inte lika lätt.",
      "Smält kokosoljan försiktigt i en kastrull eller i mikron.",
      "Blanda kaffesump, farinsocker, vaniljsocker och den smälta oljan i en skål.",
      "Fyll skrubben i en ren glasburk med lock.",
      "Använd skrubben i duschen. Ta en matsked i taget och massera den i cirkulära rörelser över fuktig hud i 1–2 minuter, särskilt på armbågar, knän, lår och vader.",
      "Skölj av med ljummet vatten och klappa torrt. Oljan lämnar huden återfuktad, så du behöver ofta ingen extra kräm."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Fyll skrubben i en glasburk med patentlock och lägg en liten träsked bredvid.",
          "Knyt ett linnesnöre runt burken och stick in en kanelstång eller en torkad apelsinskiva som dekoration. Lägg den inte i skrubben.",
          "Fint som julklapp eller värdinnepresent, med en handskriven etikett.",
          "Kokosoljan stelnar i rumstemperatur, så skrubben blir fast. Ta upp den med skeden, den smälter mot den varma huden."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Använd inte skrubben i ansiktet, den är för grov, och inte på irriterad eller trasig hud.",
          "Duschgolvet blir halt av oljan, så var försiktig och skölj golvet efteråt.",
          "Kaffesump kan täppa till avlopp. Använd små mängder och spola rikligt med varmt vatten.",
          "Förvara burken svalt och använd skrubben inom två veckor. Släng den om den luktar unket eller får mögel."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "35-fotbad",
    "title": "Värmande fotbad med salt, rosmarin och timjan",
    "description": "Grovt salt, några kvistar rosmarin och timjan och en näve havregryn i en balja med varmt vatten. Örterna flyter i vattnet och doften fyller badrummet. En stunds lyx efter en lång dag på kalla novembergator.",
    "image": "assets/recipes/35-fotbad.webp",
    "cardImage": "assets/recipes/35-fotbad-card.webp",
    "alt": "Värmande fotbad med salt, rosmarin och timjan",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Verkningstid": "15–20 min",
      "Räcker till": "1 fotbad",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Feet",
      "Autumn",
      "Relaxing",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "30–35 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 liter kokande vatten + 3–4 liter varmt vatten",
            "basic": true
          },
          {
            "name": "4 kvistar färsk rosmarin",
            "key": "orter"
          },
          {
            "name": "4 kvistar färsk timjan",
            "key": "orter"
          },
          {
            "name": "1 dl grovt salt",
            "basic": true
          },
          {
            "name": "½ dl havregryn",
            "key": "havre"
          },
          {
            "name": "1 tunn tygpåse, en ren nylonstrumpa eller ett teefilter"
          }
        ]
      }
    ],
    "directions": [
      "Lägg rosmarin och timjan i en kastrull och häll över 1 liter kokande vatten. Låt örterna dra i 10 minuter, som ett starkt örtte.",
      "Häll havregrynen i tygpåsen eller strumpan och knyt ihop den.",
      "Häll örtvattnet med kvistarna i en stor balja. Fyll på med varmt vatten tills temperaturen är behaglig, ca 38–40 grader.",
      "Rör ner saltet tills det har löst sig och lägg i havrepåsen. Krama påsen några gånger så att vattnet blir mjölkigt och mjukt.",
      "Sätt ner fötterna och låt dem vila i 15–20 minuter. Fyll på med lite varmt vatten om det svalnar.",
      "Torka fötterna noga, särskilt mellan tårna. Smörj in dem med fotkräm eller lite olivolja och ta på varma sockor."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Använd en vacker balja i emalj, trä eller zink och ställ den på en vikt handduk.",
          "Låt örtkvistarna flyta på ytan och lägg några extra kvistar på kanten av baljan.",
          "Ställ fram en kopp te, ett tänt ljus och en mjuk handduk inom räckhåll.",
          "Blanda salt, havregryn och torkade örter i en glasburk så har du en färdig fotbadsblandning till nästa gång, eller att ge bort."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Känn alltid på vattnet med handen eller armbågen innan du sätter ner fötterna.",
          "Har du diabetes, dålig cirkulation eller nedsatt känsel i fötterna, var extra försiktig med varmt vatten och fråga gärna vården först.",
          "Undvik fotbad med salt om du har sår eller sprickor på fötterna."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "36-harinpackning",
    "title": "Glansande hårinpackning med banan, honung och olivolja",
    "description": "Den övermogna bananen som ingen ville äta mixas med honung och olivolja till en len, doftande inpackning. Den ger torrt och slitet hår mjukhet och glans. En lyxig söndagsritual för håret, för en bråkdel av vad en salongsbehandling kostar.",
    "image": "assets/recipes/36-harinpackning.webp",
    "cardImage": "assets/recipes/36-harinpackning-card.webp",
    "alt": "Glansande hårinpackning med banan, honung och olivolja",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "20–30 min",
      "Räcker till": "1 behandling för medellångt hår (dubbla satsen för långt hår)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Hair",
      "Natural",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "25–35 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 övermogen banan",
            "key": "banan"
          },
          {
            "name": "1 msk flytande honung",
            "key": "honung"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "2 msk naturell yoghurt (valfritt, gör inpackningen lättare att sprida)",
            "key": "yoghurt"
          }
        ]
      }
    ],
    "directions": [
      "Mixa banan, honung, olivolja och yoghurt med en stavmixer i minst 1 minut, tills inpackningen är helt slät. Klumpar fastnar i håret och är svåra att skölja ur.",
      "Pressa inpackningen genom en sil med baksidan av en sked om du vill vara helt säker på att den är klumpfri.",
      "Fukta håret lätt och krama ur överflödigt vatten.",
      "Stryk på inpackningen från mitten av längderna och ut i topparna, där håret är torrast. Har du fet hårbotten, undvik hårbotten.",
      "Kamma igenom med en grovtandad kam så att inpackningen fördelas jämnt.",
      "Sätt på en duschmössa eller linda in håret i plastfolie, och lägg en varm handduk utanpå. Låt verka i 20–30 minuter.",
      "Skölj först noga med ljummet vatten i minst 1–2 minuter, innan du tar schampo. Tvätta sedan håret som vanligt, gärna två gånger, och avsluta med balsam."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Häll upp inpackningen i en glasskål och lägg en träkam och en hårpensel bredvid.",
          "Gör behandlingen i badrummet, inpackningen kan droppa.",
          "Medan du väntar passar havremasken i behandling 33 och en kopp te perfekt.",
          "Avsluta gärna med en kall sköljning, det gör håret extra blankt."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Det viktigaste är att mixa inpackningen helt slät. Bananbitar i håret är det vanligaste misslyckandet.",
          "Gör ett lapptest om du har känslig hårbotten, och använd inte inpackningen om du är allergisk mot banan, honung eller mjölkprotein.",
          "Använd inpackningen direkt, den mörknar och håller sig inte."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "37-lappskrubb",
    "title": "Rosa läppskrubb med socker, honung och hallon",
    "description": "En sked socker, en skvätt honung och lite olja rörs ihop till en glittrande läppskrubb som gör läpparna mjuka och släta. En gnutta hallonsylt ger den en rosa färg och doftar sommar mitt i vintern. Fylld i en liten glasburk blir den en present som ser ut att komma från en dyr skönhetsbutik.",
    "image": "assets/recipes/37-lappskrubb.webp",
    "cardImage": "assets/recipes/37-lappskrubb-card.webp",
    "alt": "Rosa läppskrubb med socker, honung och hallon",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "1 min",
      "Räcker till": "5–6 behandlingar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Lips",
      "Natural",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 6,
    "timeLabel": "6 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 msk strösocker",
            "key": "socker"
          },
          {
            "name": "2 tsk flytande honung",
            "key": "honung"
          },
          {
            "name": "2 tsk olivolja eller smält kokosolja",
            "key": "olja"
          },
          {
            "name": "1 krm vaniljsocker"
          },
          {
            "name": "½ tsk hallonsylt (valfritt, ger rosa färg och doft)"
          }
        ]
      },
      {
        "title": "Vegansk variant",
        "items": [
          {
            "name": "Byt honungen mot ljus sirap.",
            "note": true
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop socker, honung, olja och vaniljsocker i en liten skål.",
      "Rör ner hallonsylten om du vill ha en rosa skrubb. Konsistensen ska vara som fuktig sand som håller ihop.",
      "Fyll skrubben i en liten, ren glasburk med lock.",
      "Använd skrubben på rena läppar. Ta en ärtstor mängd på fingertoppen och massera läpparna försiktigt med små cirkulära rörelser i 30–60 sekunder.",
      "Torka av med en fuktig tvättlapp, eller slicka bort det sista, den är ju gjord av mat.",
      "Avsluta med läppbalsam medan läpparna fortfarande är lite fuktiga."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Fyll skrubben i en liten glasburk med guld- eller trälock, så att sockerkristallerna glittrar genom glaset.",
          "Knyt ett tunt sidenband runt burken och fäst en handskriven etikett.",
          "Ge bort den tillsammans med kaffeskrubben i behandling 34, som ett litet presentset.",
          "Använd skrubben en eller två gånger i veckan, oftare blir för hårt för den tunna huden."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Använd inte skrubben på spruckna eller såriga läppar, eller vid munsår.",
          "Använd inte skrubben om du är allergisk mot honung eller hallon.",
          "Förvara burken svalt. Utan sylt håller skrubben i ca 2 veckor, med sylt i ca 1 vecka i kylen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "38-granola",
    "title": "Knaprig granola med hasselnötter, havreyoghurt och frostiga bär",
    "description": "De sista havregrynen i paketet, en näve frön och lite sirap rostas till stora, knapriga granolakluster som doftar kanel och kardemumma. De varvas i höga glas med havreyoghurt och frysta bär som tinar till en rosa sky. Ser ut som frukostbuffén på ett boutiquehotell, och en sats räcker i två veckor.",
    "image": "assets/recipes/38-granola.webp",
    "cardImage": "assets/recipes/38-granola-card.webp",
    "alt": "Knaprig granola med hasselnötter, havreyoghurt och frostiga bär",
    "meals": [
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "30 min + 30 min svalning",
      "Portioner": "ca 1 liter granola (8–10 portioner)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Make ahead",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "Granola",
        "items": [
          {
            "name": "5 dl havregryn",
            "key": "havre"
          },
          {
            "name": "1 dl hasselnötter, grovhackade",
            "key": "hasselnot"
          },
          {
            "name": "½ dl solrosfrön",
            "key": "fron"
          },
          {
            "name": "½ dl pumpafrön",
            "key": "fron"
          },
          {
            "name": "2 msk sesamfrön",
            "key": "fron"
          },
          {
            "name": "1 tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "½ tsk malen kardemumma",
            "key": "kryddor"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "½ dl rapsolja",
            "key": "olja"
          },
          {
            "name": "1 dl ljus sirap",
            "key": "sirap"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "½ dl russin eller hackade torkade aprikoser (valfritt)"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "4 dl havreyoghurt naturell",
            "key": "havreyoghurt"
          },
          {
            "name": "2 dl frysta blandade bär, t.ex. hallon och blåbär",
            "key": "bar"
          },
          {
            "name": "Några myntablad (valfritt)",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 160 grader. Klä en långpanna med bakplåtspapper.",
      "Blanda havregryn, hasselnötter, frön, kanel, kardemumma och salt i en stor skål.",
      "Värm olja, sirap och vaniljsocker i en kastrull tills det är varmt och lättflytande. Häll det över havreblandningen och rör tills allt är jämnt täckt.",
      "Bred ut granolan på plåten i ett jämnt lager, ca 1 cm tjockt, och tryck till hårt med baksidan av en slickepott eller botten av ett glas. Det är det som ger stora kluster.",
      "Rosta i mitten av ugnen i 25–30 minuter, tills granolan är jämnt gyllenbrun. Rör inte, men vrid plåten halvvägs om ugnen värmer ojämnt.",
      "Låt granolan svalna helt på plåten, minst 30 minuter. Den är mjuk när den är varm och blir knaprig först när den har svalnat.",
      "Bryt den i bitar av olika storlek och blanda ner russinen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Varva havreyoghurt, frysta bär och granola i höga glas, så att lagren syns genom glaset.",
          "Lägg några stora kluster överst så att de sticker upp, och avsluta med några bär och ett myntablad.",
          "Ta fram bären ur frysen 10 minuter innan, då hinner de släppa lite saft och färga yoghurten rosa.",
          "Förvara granolan i en lufttät glasburk, där håller den sig knaprig i ca 2 veckor.",
          "Knyt ett linnesnöre runt burken, så har du en färdig present."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "39-aggrora",
    "title": "Krämig äggröra på smörstekt surdeg med gräslök och krasse",
    "description": "Sex ägg, en klick smör och gårdagens surdegsbröd. Äggen röras långsamt på låg värme tills de blir krämiga som en sås, med mjuka, glänsande flak. De vilar på krispigt smörstekt bröd under ett täcke av gräslök och krasse. Hotellfrukost på tio minuter, för en bråkdel av priset.",
    "image": "assets/recipes/39-aggrora.webp",
    "cardImage": "assets/recipes/39-aggrora-card.webp",
    "alt": "Krämig äggröra på smörstekt surdeg med gräslök och krasse",
    "meals": [
      "breakfast",
      "sandwich"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "10 min",
      "Portioner": "2",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "French",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 15,
    "timeLabel": "15 min",
    "ingredientSections": [
      {
        "title": "Äggröra",
        "items": [
          {
            "name": "6 ägg",
            "key": "agg"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "25 g kallt smör, i bitar",
            "key": "smor"
          },
          {
            "name": "2 msk vispgrädde eller crème fraiche",
            "key": "gradde"
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Bröd",
        "items": [
          {
            "name": "2 tjocka skivor surdegsbröd, gärna en dag gammalt",
            "key": "brod"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "½ vitlöksklyfta (valfritt)",
            "key": "vitlok"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "½ ask krasse",
            "key": "orter"
          },
          {
            "name": "1 msk crème fraiche (valfritt)",
            "key": "creme-fraiche"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Knäck äggen i en skål och vispa dem lätt med saltet, bara tills gulor och vitor har blandats.",
      "Stek brödet i smöret i en stekpanna på medelvärme, 2–3 minuter per sida, tills det är gyllene och krispigt. Gnid ena sidan med vitlöksklyftan och lägg brödet på tallrikarna.",
      "Lägg hälften av det kalla smöret i en kall kastrull med tjock botten och häll i äggen. Ställ kastrullen på låg värme.",
      "Rör hela tiden med en slickepott, längs botten och kanterna. Efter 3–4 minuter börjar äggen tjockna. Lyft kastrullen från plattan i 10 sekunder då och då om de stelnar för snabbt. Långsam värme är hela hemligheten.",
      "När äggen är krämiga men fortfarande lite rinniga, efter 5–7 minuter, tar du kastrullen från värmen. Rör ner resten av smöret och grädden. Äggen fortsätter att stelna av eftervärmen.",
      "Smaka av med vitpeppar och lite mer salt om det behövs."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skeda äggröran över brödet i en mjuk hög och låt den flyta ut lite över kanten.",
          "Strö generöst med gräslök och lägg en tuss krasse ovanpå.",
          "Avsluta med en liten klick crème fraiche, flingsalt och nymald svartpeppar.",
          "Servera direkt, äggröra väntar inte på någon.",
          "Gott med några skivor gravad lax eller morotslaxen i recept 19."
        ]
      }
    ],
    "pantryKeys": [
      "agg",
      "brod"
    ]
  },
  {
    "id": "40-ugnspannkaka",
    "title": "Ugnspannkaka med krispigt bacon och rårörda lingon",
    "description": "Mjölk, ägg, mjöl och ett paket bacon. Smeten hälls i en rykande het gjutjärnspanna och reser sig i ugnen till en gyllene pannkaka med höga, frasiga kanter och knaprigt bacon inbakat. Den bärs ut direkt i pannan och serveras med glänsande lingon. Mormors fläskpannkaka i söndagskläder.",
    "image": "assets/recipes/40-ugnspannkaka.webp",
    "cardImage": "assets/recipes/40-ugnspannkaka-card.webp",
    "alt": "Ugnspannkaka med krispigt bacon och rårörda lingon",
    "meals": [
      "main",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "35 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Swedish",
      "Comfort food",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Pannkaka",
        "items": [
          {
            "name": "2½ dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "6 dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "3 ägg",
            "key": "agg"
          },
          {
            "name": "140 g bacon (1 paket)",
            "key": "bacon"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 dl rårörda lingon",
            "key": "lingon"
          },
          {
            "name": "2 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader.",
      "Vispa mjöl, salt och hälften av mjölken till en slät smet. Vispa i resten av mjölken och äggen. Smeten blir klumpfri om mjölet först blandas med lite av mjölken. Låt smeten vila medan du steker baconet.",
      "Skär baconet i bitar, ca 2 cm. Stek dem i en stor gjutjärnspanna (ca 30 cm) på medelvärme i 5–6 minuter, tills de är gyllene men inte helt krispiga. De steker klart i ugnen. Saknar du gjutjärnspanna, använd en ugnsform på ca 25 × 35 cm.",
      "Lyft upp hälften av baconet. Låt resten och fettet ligga kvar, lägg i smöret och ställ in pannan i ugnen i 5 minuter, så att den blir riktigt het.",
      "Vispa smeten snabbt och häll den i den heta pannan. Strö över det upplyfta baconet.",
      "Grädda i mitten av ugnen i 25–30 minuter, tills pannkakan har rest sig, är gyllenbrun och har stannat i mitten. Öppna inte ugnsluckan de första 20 minuterna."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bär ut pannkakan direkt, medan kanterna står höga. Den sjunker ihop efter några minuter.",
          "Ställ pannan på en träbricka mitt på bordet, så att alla ser de krispiga kanterna.",
          "Strö över gräslök och nymald svartpeppar.",
          "Skär i stora tårtbitar och servera med rårörda lingon i en skål bredvid.",
          "För en vegetarisk variant, byt baconet mot 200 g skivade champinjoner som stekts gyllene i smör."
        ]
      }
    ],
    "pantryKeys": [
      "vetemjol",
      "mjolk",
      "agg",
      "bacon"
    ]
  },
  {
    "id": "41-panzanella",
    "title": "Panzanella på gammalt bröd med tomater, gurka och kapris",
    "description": "Gårdagens bröd, en ask körsbärstomater och en halv gurka. Brödet rostas till gyllene krutonger som suger upp tomatsaft, olivolja och vinäger tills de är krispiga utanpå och saftiga inuti. Rödlök, kapris och basilika gör resten. En toskansk sommarsallad som går att göra året om.",
    "image": "assets/recipes/41-panzanella.webp",
    "cardImage": "assets/recipes/41-panzanella-card.webp",
    "alt": "Panzanella på gammalt bröd med tomater, gurka och kapris",
    "meals": [
      "salad",
      "side"
    ],
    "metadata": {
      "Förberedelse": "20 min + 15 min dragtid",
      "Tillagning": "10 min",
      "Portioner": "4 som tillbehör, 2 som lunch",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Italian",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Krutonger",
        "items": [
          {
            "name": "200 g gammalt surdegsbröd eller ciabatta (kontrollera att det är veganskt)",
            "key": "brod"
          },
          {
            "name": "3 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Sallad",
        "items": [
          {
            "name": "500 g körsbärstomater, gärna i olika färger",
            "key": "tomat"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "½ gurka",
            "key": "gurka"
          },
          {
            "name": "½ rödlök",
            "key": "rodlok"
          },
          {
            "name": "2 msk kapris",
            "key": "kapris"
          },
          {
            "name": "1 kruka basilika",
            "key": "orter"
          }
        ]
      },
      {
        "title": "Dressing",
        "items": [
          {
            "name": "4 msk olivolja",
            "key": "olja"
          },
          {
            "name": "2 msk rödvinsvinäger",
            "key": "vinager"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "1 tsk dijonsenap",
            "key": "senap"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Riv eller skär brödet i bitar, ca 3 cm. Rivna kanter blir krispigare än skurna.",
      "Vänd brödet i olivolja och salt på en plåt. Rosta i mitten av ugnen i 8–10 minuter, tills bitarna är gyllene och krispiga på ytan.",
      "Dela tomaterna och lägg dem i en stor skål. Strö över saltet och låt stå i 10 minuter. Saltet drar ut saften, som blir en del av dressingen.",
      "Dela gurkan på längden, skrapa ur kärnorna med en tesked och skär den i halvmånar. Skiva rödlöken tunt och lägg den i kallt vatten i 5 minuter, så blir smaken mildare.",
      "Vispa ihop olivolja, vinäger, vitlök, senap och peppar.",
      "Häll dressingen över tomaterna. Vänd ner brödet, gurkan, den avrunna löken och kaprisen. Låt salladen dra i 10–15 minuter, så att brödet suger upp saften men har lite krispighet kvar.",
      "Riv basilikabladen och vänd ner dem precis före servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg upp salladen på ett stort, flatt fat så att tomaterna i olika färger syns.",
          "Toppa med några hela basilikablad och ringla över lite extra olivolja.",
          "Avsluta med flingsalt och nymald svartpeppar.",
          "Servera inom en halvtimme, sedan blir brödet för mjukt.",
          "Vänd ner en burk sköljda vita bönor eller kikärtor för en mättande lunch."
        ]
      }
    ],
    "pantryKeys": [
      "brod",
      "tomat",
      "gurka",
      "rodlok"
    ]
  },
  {
    "id": "42-waldorfsallad",
    "title": "Krispig waldorfsallad med äpple, selleri och glaserade valnötter",
    "description": "Ett par äpplen, några stjälkar blekselleri och en näve valnötter. Allt vänds i en lätt, citronfrisk dressing på yoghurt och majonnäs och serveras i små skålar av smörsallad, toppat med glänsande glaserade valnötter och druvor. En hotellklassiker från 1890-talets New York, lika snygg på julbordet som till en vardagslunch.",
    "image": "assets/recipes/42-waldorfsallad.webp",
    "cardImage": "assets/recipes/42-waldorfsallad-card.webp",
    "alt": "Krispig waldorfsallad med äpple, selleri och glaserade valnötter",
    "meals": [
      "salad",
      "side"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "5 min",
      "Portioner": "4 som tillbehör",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "American",
      "Christmas",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Glaserade valnötter",
        "items": [
          {
            "name": "1 dl valnötter",
            "key": "valnot"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk smör",
            "key": "smor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Sallad",
        "items": [
          {
            "name": "2 syrliga äpplen, gärna ett rött och ett grönt",
            "key": "apple"
          },
          {
            "name": "1 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "3 stjälkar blekselleri, med bladen kvar",
            "key": "selleri"
          },
          {
            "name": "1½ dl kärnfria druvor, röda eller gröna",
            "key": "vindruvor"
          }
        ]
      },
      {
        "title": "Dressing",
        "items": [
          {
            "name": "½ dl majonnäs",
            "key": "majo"
          },
          {
            "name": "½ dl turkisk yoghurt",
            "key": "yoghurt"
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          },
          {
            "name": "1 tsk flytande honung",
            "key": "honung"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 litet huvud smörsallad",
            "key": "sallad"
          },
          {
            "name": "50 g ädelost, smulad (valfritt)",
            "key": "adelost"
          }
        ]
      }
    ],
    "directions": [
      "Rosta valnötterna i en torr stekpanna på medelvärme i 3 minuter. Strö över socker, smör och salt och rör hela tiden i 1–2 minuter, tills sockret har smält och glaserat nötterna. Häll upp dem på bakplåtspapper och sära på dem så att de inte klistrar ihop.",
      "Kärna ur äpplena och skär dem i tärningar, ca 1 cm. Låt skalet sitta kvar, det ger färg. Vänd tärningarna direkt i citronsaften så att de inte mörknar.",
      "Skär sellerin i tunna, sneda skivor. Spara de ljusgröna bladen till garnering. Dela druvorna.",
      "Rör ihop majonnäs, yoghurt, citronsaft, honung, salt och peppar.",
      "Hacka hälften av valnötterna grovt. Vänd ner äpple, selleri, druvor och de hackade nötterna i dressingen precis före servering, annars blir salladen vattnig."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg de inre, skålformade bladen av smörsalladen på ett fat och fyll dem med salladen.",
          "Toppa med resten av de glaserade valnötterna, några halva druvor och sellerins blad.",
          "Smula över lite ädelost om du vill, det ger en salt kontrast mot det söta.",
          "Passar till julskinka och rostad kyckling, eller som lätt lunch med bröd."
        ]
      }
    ],
    "pantryKeys": [
      "apple",
      "selleri",
      "vindruvor",
      "valnot"
    ]
  },
  {
    "id": "43-thaisallad",
    "title": "Krispig thaisallad på söndagsstekens rester med lime och jordnötter",
    "description": "De sista skivorna av söndagssteken, en bit kinakål och en morot. Köttet vänds med krispiga grönsaker, färska örter och en syrlig, het limedressing och toppas med rostade jordnötter. Färgsprakande som en sallad från ett gatukök i Bangkok, och lika god med köpt rostbiff.",
    "image": "assets/recipes/43-thaisallad.webp",
    "cardImage": "assets/recipes/43-thaisallad-card.webp",
    "alt": "Krispig thaisallad på söndagsstekens rester med lime och jordnötter",
    "meals": [
      "salad",
      "main"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "5 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Dairy free",
      "Asian",
      "Thai",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Limedressing",
        "items": [
          {
            "name": "Saft av 2 lime (ca 4 msk)",
            "key": "lime"
          },
          {
            "name": "2 msk fisksås eller japansk soja"
          },
          {
            "name": "1 msk farinsocker eller strösocker"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "1 färsk röd chili, finhackad, eller ½ tsk chiliflakes"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Sallad",
        "items": [
          {
            "name": "300 g kall stek, t.ex. rostbiff, oxstek eller fläskstek",
            "key": "stek"
          },
          {
            "name": "300 g kinakål (ca ½ huvud)",
            "key": "kinakal"
          },
          {
            "name": "1 morot",
            "key": "morot"
          },
          {
            "name": "½ gurka",
            "key": "gurka"
          },
          {
            "name": "3 salladslökar",
            "key": "salladslok"
          },
          {
            "name": "1 dl koriander",
            "key": "orter"
          },
          {
            "name": "½ dl mynta",
            "key": "orter"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "½ dl saltade jordnötter",
            "key": "jordnotter"
          },
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop limesaft, fisksås, socker, vitlök, chili och olja tills sockret har löst sig. Smaka av, dressingen ska vara syrlig, salt, söt och het på samma gång.",
      "Skär steken i tunna strimlor, ca ½ cm. Vänd dem i 2 msk av dressingen och låt dra medan du förbereder grönsakerna.",
      "Strimla kinakålen tunt. Hyvla moroten i tunna band med en potatisskalare. Dela gurkan på längden, skrapa ur kärnorna och skär den i tunna stavar. Skiva salladslöken snett.",
      "Rosta jordnötterna i en torr stekpanna i 2 minuter och hacka dem grovt.",
      "Vänd ihop kål, morot, gurka, salladslök och det mesta av örterna med resten av dressingen precis före servering, så att kålen behåller sitt knaprande.",
      "Lägg upp salladen och fördela köttet ovanpå."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg köttstrimlorna i en luftig hög mitt på salladen så att de syns.",
          "Strö över jordnötter, resten av örterna och lite extra chili.",
          "Servera med limeklyftor och gärna kokt jasminris eller risnudlar.",
          "Byt jordnötterna mot rostade solrosfrön om någon vid bordet är allergisk."
        ]
      }
    ],
    "pantryKeys": [
      "stek",
      "kinakal",
      "morot",
      "gurka",
      "jordnotter"
    ]
  },
  {
    "id": "44-champinjonbourguignon",
    "title": "Champinjonbourguignon med schalottenlök och potatismos",
    "description": "Två askar champinjoner, ett par morötter och några schalottenlökar. Svampen bryns hårt tills den blir köttig och djupt gyllene, och puttrar sedan i en blank, mörk sås med rödvin, timjan och tomat. Grytan serveras i en grop av fluffigt potatismos. En fransk vintergryta helt utan kött, och ingen kommer att sakna det.",
    "image": "assets/recipes/44-champinjonbourguignon.webp",
    "cardImage": "assets/recipes/44-champinjonbourguignon-card.webp",
    "alt": "Champinjonbourguignon med schalottenlök och potatismos",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "50 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Stew",
      "French",
      "Comfort food",
      "Make ahead",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "Gryta",
        "items": [
          {
            "name": "500 g champinjoner (2 askar)",
            "key": "svamp"
          },
          {
            "name": "3 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "8 små schalottenlökar, eller 2 gula lökar",
            "key": "schalottenlok"
          },
          {
            "name": "2 morötter",
            "key": "morot"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "2 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "2 dl rött vin (kontrollera att det är veganskt), eller 2 dl extra buljong och 1 msk balsamvinäger"
          },
          {
            "name": "4 dl vatten + 1 grönsaksbuljongtärning",
            "key": "buljong"
          },
          {
            "name": "1 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 lagerblad"
          },
          {
            "name": "4 kvistar färsk timjan eller 1 tsk torkad",
            "key": "orter"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Potatismos",
        "items": [
          {
            "name": "1 kg mjölig potatis",
            "key": "potatis"
          },
          {
            "name": "1 tsk salt till kokvattnet",
            "basic": true
          },
          {
            "name": "50 g växtbaserat margarin (mjölkfritt)"
          },
          {
            "name": "2 dl havredryck, varm",
            "key": "havredryck"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 msk hackad bladpersilja",
            "key": "orter"
          },
          {
            "name": "Några timjankvistar"
          }
        ]
      }
    ],
    "directions": [
      "Skala schalottenlöken och dela stora lökar på mitten. Skala morötterna och skär dem i tjocka slantar, ca 1 cm. Skiva vitlöken. Dela champinjonerna, eller låt små vara hela.",
      "Hetta upp 2 msk olja i en stor gryta på hög värme. Bryn svampen i två omgångar, 5–6 minuter per omgång, tills den har släppt sin vätska och fått djupt brun färg. Rör inte för ofta. Lägg upp svampen.",
      "Sänk till medelvärme och hetta upp resten av oljan. Fräs lök och morötter i 5 minuter, tills löken har fått färg. Tillsätt vitlök och tomatpuré och fräs 1 minut till.",
      "Strö över mjölet och rör om. Häll i vinet lite i taget under omrörning och låt koka ihop i 2 minuter.",
      "Tillsätt vatten, buljongtärning, soja, lagerblad och timjan och lägg tillbaka svampen. Låt sjuda under lock på låg värme i 25–30 minuter, tills morötterna är mjuka och såsen är blank och har tjocknat. Ta upp lagerbladet och timjanstjälkarna och smaka av med salt och peppar.",
      "Koka potatisen under tiden. Skala den, dela den i bitar och koka den i saltat vatten i 15–20 minuter, tills den är mjuk. Häll av och låt ånga av i 1 minut.",
      "Mosa potatisen med potatisstöt eller pressa den genom en potatispress. Vispa ner margarinet och den varma havredrycken lite i taget, tills moset är fluffigt. Smaka av med salt och vitpeppar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bred ut moset i djupa tallrikar med en grop i mitten och skeda grytan i gropen.",
          "Strö över persilja och lägg en timjankvist ovanpå.",
          "Servera med en skiva surdegsbröd att torka upp såsen med.",
          "Grytan blir ännu godare dagen efter och går bra att frysa i portioner."
        ]
      }
    ],
    "pantryKeys": [
      "svamp",
      "schalottenlok",
      "morot",
      "potatis"
    ]
  },
  {
    "id": "45-pastafrittata",
    "title": "Krispig pastafrittata på gårdagens spagetti",
    "description": "Gårdagens spagetti, fem ägg och en bit lagrad ost. Pastan vänds i ägg och ost och steks tills den bildar en gyllene, krispig kaka med ett mönster av knapriga pastasträngar, mjuk och krämig i mitten. Den skärs i tårtbitar och toppas med tomater och basilika. Neapels bästa sätt att ta hand om överbliven pasta.",
    "image": "assets/recipes/45-pastafrittata.webp",
    "cardImage": "assets/recipes/45-pastafrittata-card.webp",
    "alt": "Krispig pastafrittata på gårdagens spagetti",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "20 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Italian",
      "Family friendly",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 30,
    "timeLabel": "30 min",
    "ingredientSections": [
      {
        "title": "Frittata",
        "items": [
          {
            "name": "300 g kokt, kall spagetti (ca 125 g okokt)",
            "key": "pasta"
          },
          {
            "name": "5 ägg",
            "key": "agg"
          },
          {
            "name": "1 dl riven lagrad ost, t.ex. parmesan eller prästost, + lite extra till servering",
            "key": "ost-lagrad"
          },
          {
            "name": "½ dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "2 krm svartpeppar",
            "basic": true
          },
          {
            "name": "½ dl hackad bladpersilja",
            "key": "orter"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "250 g körsbärstomater",
            "key": "tomat"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "Några basilikablad",
            "key": "orter"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader.",
      "Vispa ihop ägg, ost, mjölk, salt, peppar och persilja i en stor skål. Lägg i pastan och vänd tills varje sträng är täckt. Klipp pastan några gånger med en sax om den är lång och tovig.",
      "Hetta upp olja och smör i en ugnsfast stekpanna, ca 24 cm, på medelvärme. Häll i pastan, fördela den jämnt och tryck till ytan med en slickepott.",
      "Stek utan att röra i 6–8 minuter, tills kanterna har stelnat och undersidan är gyllene och krispig. Lyft försiktigt i kanten med slickepotten och kika.",
      "Ställ in pannan i mitten av ugnen i 8–10 minuter, tills ytan har stelnat och fått färg. Har du ingen ugnsfast panna, vänd frittatan med hjälp av en stor tallrik och stek andra sidan i 4–5 minuter.",
      "Dela körsbärstomaterna under tiden och vänd dem i olivolja och salt.",
      "Låt frittatan vila i pannan i 3 minuter. Lossa kanterna med slickepotten och stjälp upp den på ett skärbräde."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Vänd frittatan så att den krispigaste sidan hamnar uppåt, då syns det gyllene pastamönstret.",
          "Toppa med tomaterna, basilika, lite extra riven ost och flingsalt.",
          "Skär i tårtbitar så att den krämiga insidan syns i snittet.",
          "God både varm och kall, perfekt i matlådan eller på en picknick.",
          "Pasta med rester av sås går lika bra, till exempel aglio e olio från recept 28."
        ]
      }
    ],
    "pantryKeys": [
      "pasta",
      "agg",
      "ost-lagrad",
      "mjolk"
    ]
  },
  {
    "id": "46-korv-stroganoff",
    "title": "Rökig korv stroganoff med smörris och gräddfil",
    "description": "En falukorv, en gul lök och en tub tomatpuré. Korven bryns i stavar tills den får krispiga kanter och puttrar sedan i en djupt orange, rökig gräddsås med senap. Den läggs bredvid glänsande smörris och toppas med en klick gräddfil och persilja. Sveriges mest älskade vardagsmiddag i lördagskläder.",
    "image": "assets/recipes/46-korv-stroganoff.webp",
    "cardImage": "assets/recipes/46-korv-stroganoff-card.webp",
    "alt": "Rökig korv stroganoff med smörris och gräddfil",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "25 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Swedish",
      "Comfort food",
      "Family friendly",
      "One pot",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Smörris",
        "items": [
          {
            "name": "3 dl långkornigt ris",
            "key": "ris"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Stroganoff",
        "items": [
          {
            "name": "1 falukorv (ca 800 g)",
            "key": "falukorv"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "3 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 tsk rökt paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "2½ dl matlagningsgrädde eller vispgrädde",
            "key": "matlagningsgradde"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "1 msk dijonsenap",
            "key": "senap"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl gräddfil",
            "key": "graddfil"
          },
          {
            "name": "2 msk hackad bladpersilja",
            "key": "orter"
          },
          {
            "name": "1 krm rökt paprikapulver",
            "key": "kryddor"
          }
        ]
      }
    ],
    "directions": [
      "Koka riset enligt förpackningen. Rör ner smöret och saltet när det är klart och håll det varmt under lock.",
      "Dra av skinnet på korven och skär den i stavar, ca 1 × 5 cm. Skala och skiva löken.",
      "Hetta upp smör och olja i en stor stekpanna på medelhög värme. Bryn korvstavarna i 5–6 minuter, tills de har krispiga, gyllenbruna kanter. Stek i två omgångar om pannan blir trång, annars kokar korven i stället för att få färg.",
      "Lägg i löken och stek 3–4 minuter till, tills den är mjuk.",
      "Rör ner tomatpuré och båda sorterna paprikapulver och fräs i 1 minut, så att tomatpurén får djupare smak.",
      "Häll i grädde, vatten och senap. Låt sjuda i 5 minuter, tills såsen har tjocknat och blivit djupt orange. Smaka av med peppar. Salt behövs sällan, eftersom korven redan är salt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg upp riset i djupa tallrikar och skeda stroganoffen bredvid, inte över, så att båda syns.",
          "Toppa med en klick gräddfil, persilja och ett damm av rökt paprikapulver.",
          "Servera med knapriga saltgurkor eller en grönsallad vid sidan.",
          "Byt korven mot en vegokorv för en vegetarisk variant."
        ]
      }
    ],
    "pantryKeys": [
      "falukorv",
      "ris",
      "lok",
      "tomatpure"
    ]
  },
  {
    "id": "47-chokladbollar",
    "title": "Chokladbollar i tre dräkter med kokos, pärlsocker och rostad mandel",
    "description": "Havregryn, kakao, smör och en skvätt av morgonens kaffe. Barnens favoritfika rullas till perfekt runda kulor och klär sig i tre olika dräkter: snövit kokos, glittrande pärlsocker och gyllene rostad mandel. I små pappersformar, uppradade i en ask, ser de ut som pralinerna i en chokladbutik.",
    "image": "assets/recipes/47-chokladbollar.webp",
    "cardImage": "assets/recipes/47-chokladbollar-card.webp",
    "alt": "Chokladbollar i tre dräkter med kokos, pärlsocker och rostad mandel",
    "meals": [
      "baking"
    ],
    "metadata": {
      "Förberedelse": "20 min + 30 min i kylen",
      "Tillagning": "5 min",
      "Portioner": "ca 20 st",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Family friendly",
      "No bake",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 55,
    "timeLabel": "55 min",
    "ingredientSections": [
      {
        "title": "Chokladbollar",
        "items": [
          {
            "name": "100 g smör, rumsvarmt",
            "key": "smor"
          },
          {
            "name": "1 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "3 msk kakao",
            "key": "kakao"
          },
          {
            "name": "3 dl havregryn",
            "key": "havre"
          },
          {
            "name": "2 msk kallt, starkt kaffe"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Tre dräkter",
        "items": [
          {
            "name": "3 msk kokosflingor"
          },
          {
            "name": "3 msk pärlsocker"
          },
          {
            "name": "3 msk mandlar",
            "key": "mandel"
          },
          {
            "name": "Små pappersformar till konfekt"
          }
        ]
      }
    ],
    "directions": [
      "Rör smör, socker och vaniljsocker poröst med en slev eller elvisp.",
      "Tillsätt kakao, havregryn, kaffe och salt och rör tills allt är jämnt blandat.",
      "Ställ smeten i kylen i 15–20 minuter, så blir den lättare att rulla.",
      "Rosta mandlarna i en torr stekpanna på medelvärme i 3–4 minuter, tills de doftar. Låt dem svalna och hacka dem fint. Lägg kokos, pärlsocker och mandel på var sin flat tallrik.",
      "Rulla smeten till jämna bollar, ca 3 cm. Använd en matsked som mått, så blir alla lika stora. Kalla, lätt fuktade händer ger en slätare yta.",
      "Rulla en tredjedel av bollarna i kokos, en tredjedel i pärlsocker och resten i mandel. Tryck lätt så att dräkten fastnar.",
      "Ställ bollarna i kylen i minst 30 minuter, tills de är fasta."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg varje boll i en liten pappersform, gärna i guld, brunt eller naturfärgat papper.",
          "Varva de tre sorterna i rader på ett fat eller i en ask, som praliner.",
          "Packa dem i en låda med silkespapper och ett snöre, så blir de en fin present.",
          "Förvara dem i kylen, där håller de i ca 1 vecka. De är godast när de fått stå framme i 10 minuter.",
          "Byt smöret mot växtbaserat margarin för en vegansk variant."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "48-smorkola",
    "title": "Mjuk smörkola med flingsalt i vaxpapper",
    "description": "Grädde, socker, sirap och en klick smör kokas långsamt till en blank, djupt gyllene kola. Den skärs i små bitar, får några flingsaltkorn och viras in i papper med tvinnade ändar. Ser ut som från en gammaldags karamellbutik och är en av julens finaste presenter.",
    "image": "assets/recipes/48-smorkola.webp",
    "cardImage": "assets/recipes/48-smorkola-card.webp",
    "alt": "Mjuk smörkola med flingsalt i vaxpapper",
    "meals": [
      "candy",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "10 min + 2 tim stelning",
      "Tillagning": "25 min",
      "Portioner": "ca 50 bitar",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Swedish",
      "Christmas",
      "Make ahead",
      "Gift",
      "Budget"
    ],
    "time": 155,
    "timeLabel": "2 tim 35 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "2 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 dl ljus sirap",
            "key": "sirap"
          },
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 tsk flingsalt",
            "basic": true
          },
          {
            "name": "Vaxpapper eller bakplåtspapper, skuret i rutor, ca 10 × 10 cm"
          }
        ]
      }
    ],
    "directions": [
      "Klä en form, ca 15 × 20 cm, med bakplåtspapper som når upp över kanterna. Ställ fram ett glas kallt vatten.",
      "Lägg grädde, socker, sirap och smör i en kastrull med tjock botten som rymmer minst 3 liter. Kolan bubblar upp kraftigt.",
      "Koka upp på medelvärme under omrörning, tills sockret har löst sig. Låt sedan koka utan lock och rör ofta, särskilt längs botten, så att kolan inte bränns.",
      "Koka i 15–25 minuter, tills kolan har mörknat till en djup gyllenbrun färg och håller 120 grader på en sockertermometer.",
      "Utan termometer: droppa lite kola i det kalla vattnet. Den ska gå att forma till en fast men mjuk kula mellan fingrarna. Är den rinnig, koka vidare och prova igen efter en minut.",
      "Ta kastrullen från värmen och rör ner vaniljsocker och salt. Häll kolan i formen.",
      "Låt kolan svalna i 15 minuter och strö flingsaltet över ytan. Låt den sedan stelna i rumstemperatur i minst 2 timmar.",
      "Lyft upp kolan med pappret och skär den i bitar, ca 2 × 3 cm, med en vass, lätt oljad kniv."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Rulla in varje bit i en pappersruta och tvinna ändarna, som en gammaldags karamell.",
          "Fyll en glasburk eller en papperspåse med kolorna och knyt ett snöre runt.",
          "Lägg några oinslagna bitar överst på ett fat, så att den blanka ytan och flingsaltet syns.",
          "Förvara kolorna svalt i en lufttät burk, där håller de i ca 2 veckor.",
          "Kokhet kola ger svåra brännskador, så låt barnen hjälpa till med inslagningen i stället för kokningen.",
          "Vill du ha segare kola, koka till 125 grader."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "49-kanderade-apelsinskal",
    "title": "Kanderade apelsinskal doppade i mörk choklad",
    "description": "Skalen från fruktskålens apelsiner, som annars hamnar i komposten, kokas mjuka och kanderas tills de lyser som bärnsten. Halva staven doppas i mörk choklad och får några flingsaltkorn. Konfekt som ser ut att kosta en förmögenhet, gjord på det du brukar slänga.",
    "image": "assets/recipes/49-kanderade-apelsinskal.webp",
    "cardImage": "assets/recipes/49-kanderade-apelsinskal-card.webp",
    "alt": "Kanderade apelsinskal doppade i mörk choklad",
    "meals": [
      "candy",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "20 min + torkning över natten",
      "Tillagning": "75 min",
      "Portioner": "ca 50 stavar",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Christmas",
      "Zero waste",
      "Gift"
    ],
    "time": null,
    "timeLabel": "1 tim 35 min + torkning över natten",
    "ingredientSections": [
      {
        "title": "Kanderade skal",
        "items": [
          {
            "name": "3 apelsiner, gärna ekologiska",
            "key": "apelsin"
          },
          {
            "name": "3 dl strösocker + 1 dl till rullning",
            "key": "socker"
          },
          {
            "name": "3 dl vatten",
            "basic": true
          }
        ]
      },
      {
        "title": "Chokladdopp",
        "items": [
          {
            "name": "100 g mörk choklad, 70 % (kontrollera att den är mjölkfri)",
            "key": "choklad"
          },
          {
            "name": "Flingsalt (valfritt)",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Skrubba apelsinerna i varmt vatten. Skär av topp och botten, ritsa skalet i fyra delar på längden och dra av det. Ät frukten eller pressa den till juice.",
      "Skär skalen i stavar, ca 6 mm breda. Den vita hinnan får sitta kvar, den blir mjuk och god.",
      "Lägg stavarna i en kastrull, täck med kallt vatten och koka upp. Låt koka i 2 minuter och häll av. Upprepa två gånger till med nytt kallt vatten. Det tar bort beskan.",
      "Koka upp 3 dl socker och 3 dl vatten i samma kastrull tills sockret har löst sig. Lägg i skalen och låt sjuda på låg värme i 45–60 minuter, tills de är genomskinliga och glansiga. Rör försiktigt då och då.",
      "Lyft upp stavarna med en hålslev och lägg dem på ett galler över ett bakplåtspapper, så att de får rinna av i 30 minuter. Spara sirapen, den är god i te och drinkar.",
      "Rulla hälften av stavarna i strösocker om du vill. Låt alla torka på gallret över natten, tills de inte längre är klibbiga.",
      "Smält två tredjedelar av chokladen i en skål över sjudande vatten. Ta av skålen och rör ner resten av chokladen tills den har smält. Då blir chokladen blank när den stelnar.",
      "Doppa ena halvan av varje stav i chokladen, låt överskottet rinna av och lägg staven på bakplåtspapper. Strö över några flingsaltkorn och låt chokladen stelna."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Ställ stavarna på högkant i ett litet glas, med chokladen nedåt, som en bukett.",
          "Blanda sockrade och blanka stavar på samma fat, det ger fin variation.",
          "Packa dem i en smal cellofanpåse eller en glasburk med ett sidenband.",
          "Förvara dem i en lufttät burk i rumstemperatur, där håller de i ca 3 veckor.",
          "Fungerar lika bra med citron- eller grapefruktskal."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "50-chiliolja",
    "title": "Krispig chiliolja med vitlök, lök och sesam",
    "description": "En gul lök, ett helt vitlökshuvud och chiliflakesen i kryddhyllan steks långsamt i olja tills de blir gyllene och knapriga. Allt blandas med sesamfrön, soja och socker till en glödande röd, krispig chiliolja. En sked lyfter allt från stekta ägg och ris till nudlar och soppor.",
    "image": "assets/recipes/50-chiliolja.webp",
    "cardImage": "assets/recipes/50-chiliolja-card.webp",
    "alt": "Krispig chiliolja med vitlök, lök och sesam",
    "meals": [
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "25 min + 1 tim dragtid",
      "Portioner": "ca 3 dl",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Condiment",
      "Asian",
      "Make ahead",
      "Gift",
      "Budget"
    ],
    "time": 100,
    "timeLabel": "1 tim 40 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2½ dl neutral rapsolja",
            "key": "olja"
          },
          {
            "name": "1 gul lök, eller 3 schalottenlökar",
            "key": "lok"
          },
          {
            "name": "1 vitlökshuvud (ca 10 klyftor)",
            "key": "vitlok"
          },
          {
            "name": "2 cm färsk ingefära (valfritt)"
          },
          {
            "name": "1 kanelstång eller 1 stjärnanis (valfritt, ger djupare smak)",
            "key": "kanel"
          },
          {
            "name": "4 msk chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "1 tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 msk sesamfrön",
            "key": "fron"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "1 msk japansk soja",
            "key": "soja"
          }
        ]
      }
    ],
    "directions": [
      "Blanda chiliflakes, paprikapulver, sesamfrön, socker och salt i en värmetålig skål av glas eller rostfritt stål.",
      "Skala löken och vitlöken. Skiva löken mycket tunt, gärna med mandolin. Hacka vitlöken fint och riv ingefäran.",
      "Häll oljan i en kastrull och lägg i löken och kanelstången. Stek på medellåg värme och rör ofta, i 12–15 minuter, tills löken är gyllenbrun. Lyft upp löken med en hålslev och lägg den på hushållspapper. Den blir krispig när den svalnar.",
      "Lägg vitlöken och ingefäran i samma olja och stek på låg värme i 3–5 minuter, tills vitlöken är ljust gyllene. Den mörknar snabbt och blir bitter, så ta hellre upp den för tidigt än för sent.",
      "Ta upp kanelstången och låt oljan svalna i 2 minuter. Den ska fortfarande fräsa när den möter chilin, men inte vara så het att chilin svartnar.",
      "Häll oljan över chiliblandningen i omgångar och rör om. Det fräser och doftar.",
      "Låt svalna i 10 minuter. Rör ner den krispiga löken, vitlöken och sojan.",
      "Fyll oljan i en ren glasburk med lock och låt den dra i minst en timme, så att smakerna går ihop."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Använd små glasburkar så att lagren syns, med röd olja överst och allt krispigt i botten. Rör om före varje användning.",
          "Ställ burken på bordet med en liten sked, som tillbehör till nästan allt.",
          "Gott på stekta ägg, ris, nudlar, dumplings, linssoppan i recept 32 och avokadomacka.",
          "Förvara burken i kylen och använd oljan inom en månad. Ta alltid med en ren sked.",
          "Fint att ge bort, med en handskriven etikett som varnar för styrkan."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "51-pesto",
    "title": "Grön pesto på broccolistjälk, persilja och solrosfrön",
    "description": "Broccolistjälken, som oftast hamnar i soporna, en halvslokig kruka persilja och en näve solrosfrön mixas till en klargrön, len pesto med citron och vitlök. Den lyser i burken och smakar som basilikapesto, för en bråkdel av priset. Ringla den över pasta, soppa eller rostade grönsaker.",
    "image": "assets/recipes/51-pesto.webp",
    "cardImage": "assets/recipes/51-pesto-card.webp",
    "alt": "Grön pesto på broccolistjälk, persilja och solrosfrön",
    "meals": [
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "5 min",
      "Portioner": "ca 3 dl",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1–2 broccolistjälkar (ca 150 g)",
            "key": "broccoli"
          },
          {
            "name": "1 kruka eller 1 knippe bladpersilja (ca 30 g), gärna med stjälkarna"
          },
          {
            "name": "Några blad basilika eller mynta (valfritt)",
            "key": "orter"
          },
          {
            "name": "½ dl solrosfrön",
            "key": "fron"
          },
          {
            "name": "1 vitlöksklyfta",
            "key": "vitlok"
          },
          {
            "name": "Fint rivet skal och 2 msk saft av 1 citron",
            "key": "citron"
          },
          {
            "name": "1–1½ dl olivolja",
            "key": "olja"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Skala broccolistjälken med en potatisskalare, det yttersta lagret är träigt. Skär den i små bitar, ca 1 cm.",
      "Koka upp lättsaltat vatten och ställ fram en skål med isvatten. Koka stjälkbitarna i 3 minuter och lägg i persiljan de sista 10 sekunderna. Lyft över allt till isvattnet, då behåller peston sin klargröna färg.",
      "Låt rinna av ordentligt och krama ur persiljan.",
      "Rosta solrosfröna i en torr stekpanna i 2–3 minuter, tills de är gyllene. Låt dem svalna.",
      "Mixa broccoli, persilja, basilika, solrosfrön, vitlök, citronskal, citronsaft och salt med en stavmixer eller i en matberedare. Tillsätt oljan i en tunn stråle medan du mixar, tills peston är len men har lite struktur kvar.",
      "Smaka av med salt, peppar och mer citron."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Fyll peston i en glasburk och häll ett tunt lager olivolja över ytan, så behåller den färgen. Den håller i ca 1 vecka i kylen.",
          "Frys peston i en isbitsform, så har du färdiga portioner till pasta och soppor.",
          "Vänd den med varm pasta och en skvätt pastavatten, och toppa med rostade solrosfrön och citronskal.",
          "Ringla den i groparna på bönkrämen i recept 2, eller över rotmoset i recept 24.",
          "Vill du ha en vegetarisk variant, mixa ner ½ dl riven parmesan."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "52-ortsmor",
    "title": "Rullat örtsmör med citron och vitlök",
    "description": "Ett paket smör och de örter som håller på att vissna i kylen. Allt rörs ihop med citronskal och vitlök, rullas till en tjock rulle i bakplåtspapper och kyls. Skivorna ser ut som grönsprängd marmor och smälter till glänsande pölar över stekt fisk, kött, potatis och varmt bröd.",
    "image": "assets/recipes/52-ortsmor.webp",
    "cardImage": "assets/recipes/52-ortsmor-card.webp",
    "alt": "Rullat örtsmör med citron och vitlök",
    "meals": [
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "15 min + 2 tim i kylen",
      "Tillagning": "0 min",
      "Portioner": "1 rulle (ca 20 skivor)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Condiment",
      "Make ahead",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 135,
    "timeLabel": "2 tim 15 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "250 g smör, rumsvarmt",
            "key": "smor"
          },
          {
            "name": "1 dl blandade färska örter, t.ex. persilja, dill, gräslök, timjan eller basilika",
            "key": "orter"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "Fint rivet skal av 1 citron",
            "key": "citron"
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          },
          {
            "name": "1 tsk flingsalt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "1 krm chiliflakes (valfritt)",
            "key": "kryddor"
          }
        ]
      }
    ],
    "directions": [
      "Ta fram smöret i god tid. Det ska vara mjukt men inte smält.",
      "Hacka örterna fint. De mjuka stjälkarna går också bra, men plocka bort grova stjälkar från timjan och rosmarin.",
      "Rör ihop smör, örter, vitlök, citronskal, citronsaft, flingsalt, peppar och chili med en slickepott, tills allt är jämnt fördelat.",
      "Lägg smöret i en avlång hög på ett bakplåtspapper. Vik pappret över smöret och tryck en linjal eller en stekspade mot pappret längs smörets underkant, så formas en jämn rulle, ca 4 cm tjock.",
      "Vrid ändarna som på en karamell och kyl rullen i minst 2 timmar, tills den är fast.",
      "Skär skivor, ca 1 cm, med en kniv som doppats i varmt vatten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg en skiva på en het biff, stekt fisk eller en bakad potatis precis före servering, så att den smälter i en glänsande pöl.",
          "Servera rullen på ett träbräde till varmt bröd, med ändarna av pappret kvar för en rustik look.",
          "Rullen håller i ca 1 vecka i kylen och i 3 månader i frysen. Skiva den innan du fryser, så kan du ta en skiva i taget.",
          "Byt citron och dill mot chili och koriander, eller mot rosmarin och vitlök, efter vad som finns i kylen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "53-krispiga-kikartor",
    "title": "Krispiga kikärtor med rökt paprika, lime och flingsalt",
    "description": "En burk kikärtor, gärna de som blev över efter chokladmoussen i recept 9. De rostas i ugnen tills de är krispiga hela vägen igenom och vänds i rökt paprika, spiskummin, limeskal och flingsalt. Servera dem i små skålar till drinken, de tar slut fortare än chipsen.",
    "image": "assets/recipes/53-krispiga-kikartor.webp",
    "cardImage": "assets/recipes/53-krispiga-kikartor-card.webp",
    "alt": "Krispiga kikärtor med rökt paprika, lime och flingsalt",
    "meals": [
      "party"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "35 min",
      "Portioner": "4 som snacks",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 burk kikärtor (400 g), avrunna",
            "key": "kikarter"
          },
          {
            "name": "1½ msk olivolja",
            "key": "olja"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Krydda",
        "items": [
          {
            "name": "1 tsk rökt paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "½ tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "½ tsk strösocker",
            "key": "socker"
          },
          {
            "name": "1 krm cayennepeppar eller chiliflakes"
          },
          {
            "name": "Fint rivet skal av 1 lime",
            "key": "lime"
          },
          {
            "name": "1 tsk flingsalt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader.",
      "Skölj kikärtorna och låt dem rinna av. Lägg dem på en kökshandduk och gnid försiktigt, så att de blir torra och så många skal som möjligt lossnar. Plocka bort skalen. Ju torrare kikärtor, desto krispigare blir de.",
      "Lägg kikärtorna på en plåt med bakplåtspapper och vänd dem i olja och salt. Bred ut dem i ett lager med lite luft emellan.",
      "Rosta i mitten av ugnen i 30–35 minuter och skaka plåten var tionde minut. De är klara när de är gyllene och knapriga hela vägen igenom. Smaka på en.",
      "Blanda rökt paprika, spiskummin, socker och cayennepeppar.",
      "Vänd de heta kikärtorna i kryddblandningen direkt när de kommer ur ugnen. Låt dem svalna på plåten, de blir krispigare när de svalnar.",
      "Riv limeskalet över och strö över flingsaltet precis före servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera i små skålar eller glas, gärna utspridda över mingelbordet.",
          "Fyll en strut av bakplåtspapper för en festligare känsla.",
          "Ställ fram limeklyftor bredvid, för den som vill ha mer syra.",
          "Kikärtorna är godast samma dag. De mjuknar i en burk, men blir krispiga igen efter 5 minuter i ugnen på 200 grader."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "54-ostkex",
    "title": "Smöriga ostkex på de sista ostkanterna",
    "description": "De hårda ostkanterna längst in i kylen, ett paket smör och lite mjöl. Allt rivs och arbetas ihop till en deg som rullas, skivas och gräddas till krispiga, smöriga kex med kummin, sesam och flingsalt. Ser ut som från en delikatessbutik och smälter i munnen.",
    "image": "assets/recipes/54-ostkex.webp",
    "cardImage": "assets/recipes/54-ostkex-card.webp",
    "alt": "Smöriga ostkex på de sista ostkanterna",
    "meals": [
      "party",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "15 min + 30 min i kylen",
      "Tillagning": "12 min",
      "Portioner": "ca 40 kex",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Leftovers",
      "Zero waste",
      "Gift",
      "Budget"
    ],
    "time": 57,
    "timeLabel": "57 min",
    "ingredientSections": [
      {
        "title": "Deg",
        "items": [
          {
            "name": "150 g ostkanter av hårdost, t.ex. prästost, grevé eller herrgård"
          },
          {
            "name": "100 g kallt smör",
            "key": "smor"
          },
          {
            "name": "2½ dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "1 krm cayennepeppar"
          },
          {
            "name": "1–2 msk kallt vatten",
            "basic": true
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "1 ägg, uppvispat",
            "key": "agg"
          },
          {
            "name": "1 tsk hel kummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk sesamfrön",
            "key": "fron"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Skär bort vax och hård skorpa från ostkanterna och riv osten fint.",
      "Nyp ihop ost, smör i bitar, mjöl, salt och cayennepeppar med fingrarna, eller kör det kort i en matberedare, tills det blir en smulig massa. Tillsätt vattnet och arbeta snabbt ihop till en deg.",
      "Forma degen till en rulle, ca 4 cm tjock. Rulla in den i plastfolie och kyl i minst 30 minuter.",
      "Sätt ugnen på 200 grader. Klä två plåtar med bakplåtspapper.",
      "Skär rullen i skivor, ca 5 mm tjocka, och lägg dem på plåtarna med lite mellanrum.",
      "Pensla kexen med ägg och strö över kummin, sesamfrön och några flingsaltkorn.",
      "Grädda i mitten av ugnen i 10–12 minuter, tills kexen är gyllene i kanterna. Låt dem svalna på plåten, de blir krispiga först när de har svalnat."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Stapla kexen i höga, lätt sneda torn på ett träbräde, så att de gyllene kanterna syns.",
          "Servera till ett glas vin, en kall öl eller som tilltugg på mingelbordet.",
          "Fyll en glasburk med kex och knyt ett snöre runt, en fin värdinnepresent.",
          "Kexen håller i ca 1 vecka i en lufttät burk. Degrullen kan frysas och skivas direkt från frysen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "55-agghalvor-med-gubbrora",
    "title": "Ägghalvor med gubbröra, rödlök och dill",
    "description": "Sex ägg, en burk ansjovis och en rödlök. Äggulorna mosas med gräddfil, finhackad ansjovis, dill och rödlök till en gyllene, salt röra som spritsas tillbaka i vitorna. Toppa med en ansjovisremsa och en dillkvist. Den klassiska gubbröran klädd för mingel, och en självklar bit på julbordet.",
    "image": "assets/recipes/55-agghalvor-med-gubbrora.webp",
    "cardImage": "assets/recipes/55-agghalvor-med-gubbrora-card.webp",
    "alt": "Ägghalvor med gubbröra, rödlök och dill",
    "meals": [
      "starter",
      "party"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "10 min",
      "Portioner": "12 ägghalvor",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Gluten free",
      "Swedish",
      "Christmas",
      "Beginner friendly",
      "Budget"
    ],
    "time": 30,
    "timeLabel": "30 min",
    "ingredientSections": [
      {
        "title": "Ägg",
        "items": [
          {
            "name": "6 ägg",
            "key": "agg"
          }
        ]
      },
      {
        "title": "Gubbröra",
        "items": [
          {
            "name": "6 ansjovisfiléer + 1 msk spad från burken",
            "key": "ansjovis"
          },
          {
            "name": "3 msk gräddfil",
            "key": "graddfil"
          },
          {
            "name": "1 msk majonnäs",
            "key": "majo"
          },
          {
            "name": "½ rödlök",
            "key": "rodlok"
          },
          {
            "name": "2 msk finhackad dill",
            "key": "dill"
          },
          {
            "name": "1 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 ansjovisfiléer, skurna i tunna remsor",
            "key": "ansjovis"
          },
          {
            "name": "Några dillkvistar",
            "key": "dill"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Lägg äggen i en kastrull med kokande vatten och koka i 9 minuter. Kyl dem direkt i kallt vatten, så blir gulan klargul utan grå kant och skalet lossnar lättare.",
      "Skala äggen och dela dem på längden. Skär en tunn skiva från undersidan av vitorna, så att de står stadigt. Lyft ut gulorna.",
      "Finhacka rödlöken. Spara 1 msk till garnering.",
      "Hacka ansjovisen fint. Mosa gulorna med en gaffel och rör ner ansjovis, spad, gräddfil, majonnäs, rödlök, dill och gräslök till en slät röra. Smaka av med peppar. Salt behövs inte.",
      "Fyll röran i en spritspåse med stjärntyll, eller i en fryspåse med ett avklippt hörn, och spritsa en hög rosett i varje vita.",
      "Kyl ägghalvorna i 15 minuter före servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Toppa varje ägghalva med en tunn ansjovisremsa i en liten båge, lite av den sparade rödlöken och en dillkvist.",
          "Lägg ägghalvorna i rader på ett fat med en bädd av dill under, så att de står stadigt.",
          "Avsluta med nymald svartpeppar.",
          "Servera inom ett par timmar och förvara dem kallt till dess.",
          "Svensk ansjovis är kryddinlagd skarpsill, inte italiensk sardell. Det är den du vill ha här."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "56-potatis-och-purjolokssoppa",
    "title": "Potatis- och purjolökssoppa med krispiga potatisskal",
    "description": "Några potatisar, en purjolök och skalen du annars slänger. Soppan mixas sammetslen och blek som grädde, och skalen rostas i ugnen till gyllene chips som läggs i en hög mitt i skålen, med gräslök och olivolja runt om. Fransk vardagssoppa som ser ut som förrätten på en brasserie, helt vegansk och utan svinn.",
    "image": "assets/recipes/56-potatis-och-purjolokssoppa.webp",
    "cardImage": "assets/recipes/56-potatis-och-purjolokssoppa-card.webp",
    "alt": "Potatis- och purjolökssoppa med krispiga potatisskal",
    "meals": [
      "soup"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "35 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "French",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Soppa",
        "items": [
          {
            "name": "800 g mjölig potatis (ca 8 medelstora)",
            "key": "potatis"
          },
          {
            "name": "1 stor purjolök (ca 300 g)",
            "key": "purjolok"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 liter vatten + 1½ grönsaksbuljongtärning",
            "key": "buljong"
          },
          {
            "name": "1 lagerblad"
          },
          {
            "name": "2 dl havregrädde (matlagning)",
            "key": "havregradde"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          },
          {
            "name": "1 krm riven muskotnöt (valfritt)"
          }
        ]
      },
      {
        "title": "Krispiga skal",
        "items": [
          {
            "name": "Skalen från potatisen",
            "key": "potatis"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "1 krm rökt paprikapulver (valfritt)",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Skrubba potatisen noga, eftersom skalen ska ätas. Skala den med en potatisskalare och spara skalen.",
      "Vänd skalen i olivolja, salt och rökt paprika på en plåt med bakplåtspapper och bred ut dem i ett lager. Rosta i mitten av ugnen i 15–20 minuter, tills de är gyllene och krispiga. Håll koll mot slutet, tunna skal bränns fort.",
      "Skär potatisen i bitar, ca 3 cm. Dela purjolöken på längden och skölj den noga mellan lagren, där brukar det sitta jord. Skiva den vita och ljusgröna delen. Hacka löken och vitlöken.",
      "Fräs purjolök, lök och vitlök i olivoljan i en stor kastrull på medelvärme i 6–8 minuter, tills allt är mjukt. Löken ska inte få färg, då blir soppan inte lika ljus.",
      "Lägg i potatis, vatten, buljongtärningar och lagerblad. Koka upp och låt sjuda under lock i 20 minuter, tills potatisen är helt mjuk.",
      "Ta upp lagerbladet och mixa soppan helt slät med en stavmixer. Rör ner havregrädden och värm försiktigt. Späd med lite vatten om soppan är för tjock. Smaka av med salt, vitpeppar och muskot."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Häll upp soppan i djupa, ljusa skålar och gör en liten grop i mitten med baksidan av en sked.",
          "Lägg en hög krispiga skal i gropen precis före servering, så att de inte hinner mjukna.",
          "Strö över gräslök, ringla över olivolja och avsluta med nymald svartpeppar.",
          "Servera resten av skalen i en skål bredvid, de försvinner som chips.",
          "Soppan går bra att frysa, men rosta skalen färska."
        ]
      }
    ],
    "pantryKeys": [
      "potatis",
      "purjolok",
      "lok",
      "havregradde"
    ]
  },
  {
    "id": "57-fransk-loksoppa",
    "title": "Fransk löksoppa med gratinerade ostkrutonger",
    "description": "Sex gula lökar, gårdagens bröd och en bit lagrad ost. Löken steks långsamt tills den blir mörkt bärnstensfärgad och söt som marmelad, och kokas sedan till en djup, glänsande buljong. Ovanpå flyter brödskivor under ett bubblande, gyllene ostlock. En parisisk klassiker, gjord på kökets billigaste råvara.",
    "image": "assets/recipes/57-fransk-loksoppa.webp",
    "cardImage": "assets/recipes/57-fransk-loksoppa-card.webp",
    "alt": "Fransk löksoppa med gratinerade ostkrutonger",
    "meals": [
      "soup"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "75 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "French",
      "Comfort food",
      "Leftovers",
      "Budget"
    ],
    "time": 90,
    "timeLabel": "1 tim 30 min",
    "ingredientSections": [
      {
        "title": "Soppa",
        "items": [
          {
            "name": "6 gula lökar (ca 1 kg)",
            "key": "lok"
          },
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "2 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 dl torrt vitt vin (valfritt)"
          },
          {
            "name": "1 liter vatten + 2 grönsaksbuljongtärningar",
            "key": "buljong"
          },
          {
            "name": "1 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 lagerblad"
          },
          {
            "name": "4 kvistar färsk timjan eller 1 tsk torkad",
            "key": "orter"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "1 tsk vitvinsvinäger, om du inte använder vin",
            "key": "vinager"
          }
        ]
      },
      {
        "title": "Ostkrutonger",
        "items": [
          {
            "name": "4–8 skivor gammalt bröd, t.ex. baguette eller surdeg",
            "key": "brod"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "2 dl riven lagrad ost, t.ex. gruyère, grevé eller Västerbottensost",
            "key": "ost-lagrad"
          }
        ]
      }
    ],
    "directions": [
      "Skala lökarna, dela dem på mitten och skiva dem tunt, ca 3 mm.",
      "Smält smöret med oljan i en stor gryta med tjock botten på medelvärme. Lägg i löken, socker och salt och rör om.",
      "Låt löken steka på medellåg värme i 45–50 minuter. Rör var femte minut och skrapa upp det bruna från botten. Löken blir först mjuk, sedan gyllene och till sist djupt brun. Fastnar den, häll i en skvätt vatten och skrapa loss. Ta inte genvägar med hög värme, då bränns löken i stället för att karamelliseras.",
      "Strö mjölet över löken och rör i 1 minut. Häll i vinet och låt det koka ihop under omrörning.",
      "Tillsätt vatten, buljongtärningar, soja, lagerblad och timjan. Låt sjuda utan lock i 20 minuter. Ta upp lagerbladet och timjanstjälkarna och smaka av med peppar, salt och vinäger.",
      "Sätt ugnen på grill, högsta värme. Bred lite smör på brödskivorna och rosta dem i en torr stekpanna tills de är gyllene.",
      "Fördela soppan i 4 ugnsfasta skålar och ställ dem på en plåt. Lägg 1–2 brödskivor i varje skål och täck med riven ost, gärna ända ut till kanterna.",
      "Gratinera högt upp i ugnen i 3–5 minuter, tills osten bubblar och har fått gyllenbruna fläckar. Stå kvar vid ugnen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Låt lite ost rinna över skålens kant, det är så den ska se ut.",
          "Strö över några timjanblad och nymald svartpeppar.",
          "Ställ skålarna på små tallrikar med en servett, de är mycket heta.",
          "Har du inga ugnsfasta skålar, gratinera brödet med osten på en plåt och lägg det på soppan precis före servering.",
          "Soppan blir ännu godare dagen efter och går bra att frysa, utan bröd och ost."
        ]
      }
    ],
    "pantryKeys": [
      "lok",
      "brod",
      "ost-lagrad"
    ]
  },
  {
    "id": "58-fisksoppa",
    "title": "Krämig fisksoppa med dill, citron och aioli",
    "description": "Ett paket fryst vit fisk, en burk krossade tomater och en morot. Fisken sjuder i en krämig, korallröd buljong med dill och citron, tills den delar sig i saftiga flak. Till soppan serveras rostat bröd med en rejäl klick vitlöksaioli. Ser ut som fiskgrytan på en hamnkrog, men är klar på en halvtimme.",
    "image": "assets/recipes/58-fisksoppa.webp",
    "cardImage": "assets/recipes/58-fisksoppa-card.webp",
    "alt": "Krämig fisksoppa med dill, citron och aioli",
    "meals": [
      "soup"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "25 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Swedish",
      "One pot",
      "Beginner friendly",
      "Budget"
    ],
    "time": 40,
    "timeLabel": "40 min",
    "ingredientSections": [
      {
        "title": "Snabb aioli",
        "items": [
          {
            "name": "1 dl majonnäs",
            "key": "majo"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "1 tsk citronsaft",
            "key": "citron"
          }
        ]
      },
      {
        "title": "Soppa",
        "items": [
          {
            "name": "400 g fryst vit fisk, t.ex. sej, torsk eller alaska pollock, tinad",
            "key": "vit-fisk"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 morot",
            "key": "morot"
          },
          {
            "name": "1 bit purjolök (ca 10 cm)",
            "key": "purjolok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "6 dl vatten + 1 fiskbuljongtärning",
            "key": "fiskbuljong"
          },
          {
            "name": "1 dl torrt vitt vin (valfritt)"
          },
          {
            "name": "2 dl matlagningsgrädde",
            "key": "matlagningsgradde"
          },
          {
            "name": "Fint rivet skal av ½ citron + 1 msk saft",
            "key": "citron"
          },
          {
            "name": "½ dl hackad dill",
            "key": "dill"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          },
          {
            "name": "100 g handskalade räkor (valfritt)",
            "key": "rakor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "4 skivor surdegsbröd eller baguette",
            "key": "brod"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "Några dillkvistar",
            "key": "dill"
          },
          {
            "name": "1 citron, i klyftor",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop majonnäs, vitlök och citronsaft till aiolin och ställ den kallt.",
      "Hacka löken. Skala moroten och skär den i små tärningar. Skölj purjolöken och skiva den tunt. Hacka vitlöken.",
      "Fräs grönsakerna i olivoljan i en stor kastrull på medelvärme i 5 minuter, utan att de får färg. Rör ner tomatpurén och fräs 1 minut till.",
      "Häll i krossade tomater, vatten, buljongtärning och vin. Koka upp och låt sjuda under lock i 10 minuter, tills moroten är mjuk.",
      "Skär fisken i bitar, ca 3 cm. Rör ner grädden i soppan och låt den sjuda upp. Lägg i fisken och låt sjuda på låg värme i 4–5 minuter, tills fisken är vit hela vägen in. Rör försiktigt så att bitarna håller ihop, och låt inte soppan koka, då blir fisken torr.",
      "Ta kastrullen från värmen och rör ner citronskal, citronsaft, dill och räkorna. Räkorna värms av soppan. Smaka av med salt och vitpeppar.",
      "Ringla olivolja över brödet och rosta det i en torr stekpanna, 1–2 minuter per sida, tills det är gyllene och krispigt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg fiskbitarna i djupa tallrikar först och skeda soppan runt, så att de stora flaken syns på ytan.",
          "Bred en rejäl klick aioli på det rostade brödet och lägg det på tallrikskanten.",
          "Toppa med dillkvistar, lite citronskal och några räkor.",
          "Servera med citronklyftor.",
          "Har du saffran kvar sedan lussebaket, lägg i ½ g tillsammans med tomaterna."
        ]
      }
    ],
    "pantryKeys": [
      "vit-fisk",
      "purjolok",
      "kross",
      "matlagningsgradde"
    ]
  },
  {
    "id": "59-fokaccia",
    "title": "Fokaccia med rödlök, rosmarin och flingsalt",
    "description": "Mjöl, vatten, jäst och en generös skvätt olivolja. Degen jäser över natten i kylen och gräddas till ett gyllene, luftigt bröd med krispig botten och djupa gropar där olivoljan samlas. Ovanpå ligger rödlök, körsbärstomater, rosmarin och flingsalt. Ser ut att komma från ett italienskt bageri, men kräver ingen knådning alls.",
    "image": "assets/recipes/59-fokaccia.webp",
    "cardImage": "assets/recipes/59-fokaccia-card.webp",
    "alt": "Fokaccia med rödlök, rosmarin och flingsalt",
    "meals": [
      "bread",
      "baking",
      "side"
    ],
    "metadata": {
      "Förberedelse": "15 min + 12 tim i kylen + 2 tim jäsning",
      "Tillagning": "25 min",
      "Portioner": "1 långpanna (ca 12 bitar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Italian",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 880,
    "timeLabel": "14 tim 40 min",
    "ingredientSections": [
      {
        "title": "Deg",
        "items": [
          {
            "name": "10 g färsk jäst eller ½ påse torrjäst (ca 5 g)"
          },
          {
            "name": "4 dl kallt vatten",
            "basic": true
          },
          {
            "name": "2 tsk salt",
            "basic": true
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "8 dl vetemjöl special (ca 500 g)",
            "key": "vetemjol"
          }
        ]
      },
      {
        "title": "I formen och ovanpå",
        "items": [
          {
            "name": "1 dl olivolja",
            "key": "olja"
          },
          {
            "name": "1 rödlök",
            "key": "rodlok"
          },
          {
            "name": "10 körsbärstomater (valfritt)",
            "key": "tomat"
          },
          {
            "name": "3 kvistar färsk rosmarin",
            "key": "orter"
          },
          {
            "name": "1 tsk flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Smula ner jästen i en stor bunke och rör ut den i vattnet. Använder du torrjäst, blanda den med mjölet i stället. Tillsätt salt, olivolja och mjöl och rör ihop till en kladdig deg med en slev. Den ska inte knådas.",
      "Täck bunken och låt den stå i rumstemperatur i 30 minuter.",
      "Sträck och vik degen: fukta handen, lyft ena kanten av degen, sträck den uppåt och vik den över mitten. Vrid bunken ett kvarts varv och upprepa, fyra vik totalt. Gör det tre gånger, med 15 minuters vila emellan. Degen blir slätare och smidigare för varje omgång.",
      "Täck bunken och ställ den i kylen i 12–24 timmar. Den långa, kalla jäsningen ger smak och stora bubblor.",
      "Häll 4 msk olivolja i en långpanna, ca 25 × 35 cm, och sprid ut den. Vänd ner degen i formen och vänd den en gång så att den blir oljig på båda sidor. Tryck försiktigt ut den mot hörnen. Drar den ihop sig, vänta 15 minuter och försök igen.",
      "Låt degen jäsa övertäckt i rumstemperatur i 2–3 timmar, tills den är pösig och full av bubblor.",
      "Sätt ugnen på 230 grader. Skala rödlöken och skär den i tunna klyftor. Dela tomaterna och plocka rosmarinbladen.",
      "Ringla 2 msk olivolja över degen. Smörj fingrarna med olja och tryck djupa gropar i hela degen, ända ner till botten. Lägg på rödlök, tomater och rosmarin, tryck ner dem lätt och strö över flingsaltet.",
      "Grädda i nedre delen av ugnen i 20–25 minuter, tills fokaccian är djupt gyllene. Ringla över resten av oljan direkt när den kommer ut och låt den svalna på galler i 10 minuter."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg fokaccian hel på ett skärbräde, så att alla ser groparna och toppingen.",
          "Skär eller riv den i stora rutor precis före servering.",
          "Servera den ljummen till soppa, sallad eller romescon i recept 25.",
          "Fokaccian är godast samma dag. Dagen efter blir den perfekt till panzanellan i recept 41.",
          "Variera toppingen efter vad som finns hemma: oliver, tunt skivad potatis, paprika eller timjan."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "60-filmjolksscones",
    "title": "Filmjölksscones med lagrad ost och gräslök",
    "description": "Filmjölken som närmar sig bäst före-datum, en bit lagrad ost och lite mjöl. Snabba scones utan jäst, som reser sig höga i ugnen med gyllene, knapriga ostkanter och en mjuk, fluffig insida. Servera dem varma med kallt smör till soppa eller helgfrukost. Från tom brödkorg till nybakat på tjugofem minuter.",
    "image": "assets/recipes/60-filmjolksscones.webp",
    "cardImage": "assets/recipes/60-filmjolksscones-card.webp",
    "alt": "Filmjölksscones med lagrad ost och gräslök",
    "meals": [
      "bread",
      "baking",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "15 min",
      "Portioner": "8 scones",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Scones",
        "items": [
          {
            "name": "5 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "2 tsk bakpulver"
          },
          {
            "name": "½ tsk bikarbonat"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "75 g kallt smör",
            "key": "smor"
          },
          {
            "name": "1½ dl riven lagrad ost, t.ex. prästost eller cheddar",
            "key": "ost-lagrad"
          },
          {
            "name": "3 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "2½ dl filmjölk",
            "key": "filmjolk"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "1 msk filmjölk till pensling",
            "key": "filmjolk"
          },
          {
            "name": "½ dl riven lagrad ost",
            "key": "ost-lagrad"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader. Klä en plåt med bakplåtspapper.",
      "Blanda mjöl, bakpulver, bikarbonat och salt i en bunke.",
      "Skär smöret i små tärningar och nyp ner det i mjölet med fingertopparna, tills det ser ut som grova smulor. Arbeta snabbt så att smöret inte hinner bli varmt. Kalla smörbitar blir till ånga i ugnen och gör sconesen luftiga.",
      "Rör ner osten och gräslöken. Häll i filmjölken och rör ihop till en kladdig deg med en gaffel, bara tills inget torrt mjöl syns.",
      "Vänd ut degen på ett mjölat bakbord och klappa ut den till en rund kaka, ca 3 cm tjock. Skär den i 8 trianglar med en vass, mjölad kniv och lägg dem på plåten med lite mellanrum.",
      "Pensla med filmjölk och strö över osten till toppingen, lite svartpeppar och några flingsaltkorn.",
      "Grädda i mitten av ugnen i 15–18 minuter, tills sconesen har rest sig och osten är gyllenbrun och krispig."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera sconesen varma i en korg med en linnehandduk, så håller de värmen.",
          "Dela dem på mitten och lägg i en tjock skiva kallt smör som smälter direkt.",
          "Gott till löksoppan i recept 57, till en sallad eller med äggröran i recept 39.",
          "Filmjölk som passerat bäst före-datum går ofta bra att använda. Lukta och smaka först.",
          "Sconesen är godast samma dag, men kan frysas och värmas i ugnen på 200 grader i 5 minuter."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "61-froknacke",
    "title": "Fröknäcke med pumpafrön, sesam och flingsalt",
    "description": "De sista nävarna frön i skafferiet, lite majsmjöl, olja och kokande vatten. Smeten breds ut tunt och torkas långsamt i ugnen till ett knaprigt, gyllene knäcke som ser ut som en mosaik när ljuset lyser igenom. Glutenfritt, veganskt och betydligt dyrare i butiken än det är svårt att göra.",
    "image": "assets/recipes/61-froknacke.webp",
    "cardImage": "assets/recipes/61-froknacke-card.webp",
    "alt": "Fröknäcke med pumpafrön, sesam och flingsalt",
    "meals": [
      "bread",
      "baking",
      "side"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "60 min",
      "Portioner": "1 plåt (ca 20 bitar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Swedish",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 dl majsmjöl",
            "key": "majsmjol"
          },
          {
            "name": "½ dl solrosfrön",
            "key": "fron"
          },
          {
            "name": "½ dl pumpafrön",
            "key": "fron"
          },
          {
            "name": "½ dl sesamfrön",
            "key": "fron"
          },
          {
            "name": "½ dl linfrön",
            "key": "fron"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "½ dl rapsolja",
            "key": "olja"
          },
          {
            "name": "2 dl kokande vatten",
            "basic": true
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "1 tsk flingsalt",
            "basic": true
          },
          {
            "name": "1 msk extra frön"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 150 grader.",
      "Blanda majsmjöl, alla frön och salt i en skål.",
      "Häll i oljan och det kokande vattnet och rör om ordentligt. Smeten är rinnig först men tjocknar när linfröna sväller. Låt den stå i 2–3 minuter.",
      "Bred ut smeten mycket tunt på en plåt med bakplåtspapper, med baksidan av en sked eller en slickepott. Den ska täcka nästan hela plåten och vara jämntjock, så att kanterna inte bränns innan mitten är klar.",
      "Strö över flingsalt och de extra fröna.",
      "Grädda i mitten av ugnen i ca 60 minuter, tills knäcket är gyllene och torrt även i mitten. Lyft ett hörn och känn efter, det ska släppa från pappret.",
      "Låt knäcket svalna helt på plåten och bryt det sedan i bitar. Vill du ha raka bitar, skär rutor med en pizzakniv efter 15 minuter i ugnen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bryt knäcket för hand i stora, oregelbundna flak och ställ dem på högkant i en burk eller ett glas.",
          "Servera med labnehen i recept 26, romescon i recept 25 eller en bit lagrad ost.",
          "Förvara knäcket i en lufttät burk, där håller det sig knaprigt i ca 2 veckor.",
          "Fint att ge bort i en hög glasburk med ett linnesnöre.",
          "Bakar du till någon med celiaki, kontrollera att majsmjölet är märkt glutenfritt."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "62-croque-madame",
    "title": "Croque madame på julskinka med senapsbéchamel",
    "description": "Julskinkan som aldrig tar slut, några skivor bröd och en bit ost. Smörgåsarna fylls med skinka och senapssås, täcks med riven ost och gratineras gyllene och bubblande i ugnen. Ovanpå vilar ett stekt ägg med lysande gula. Den franska caféklassikern är som gjord för annandagen.",
    "image": "assets/recipes/62-croque-madame.webp",
    "cardImage": "assets/recipes/62-croque-madame-card.webp",
    "alt": "Croque madame på julskinka med senapsbéchamel",
    "meals": [
      "sandwich",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "20 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "French",
      "Christmas",
      "Comfort food",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Senapsbéchamel",
        "items": [
          {
            "name": "1½ msk smör",
            "key": "smor"
          },
          {
            "name": "1½ msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "2½ dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "1 msk julsenap eller dijonsenap",
            "key": "senap"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "1 krm riven muskotnöt"
          },
          {
            "name": "½ dl riven lagrad ost",
            "key": "ost-lagrad"
          }
        ]
      },
      {
        "title": "Smörgåsar",
        "items": [
          {
            "name": "8 skivor formfranska eller annat vitt bröd",
            "key": "brod"
          },
          {
            "name": "1 msk smör, rumsvarmt",
            "key": "smor"
          },
          {
            "name": "200 g tunt skivad julskinka",
            "key": "julskinka"
          },
          {
            "name": "2 dl riven ost, t.ex. grevé, prästost eller gruyère",
            "key": "cheddar"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "4 ägg",
            "key": "agg"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "2 msk finklippt gräslök",
            "key": "orter"
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader. Klä en plåt med bakplåtspapper.",
      "Gör béchamelsåsen. Smält smöret i en kastrull, vispa ner mjölet och låt fräsa i 1 minut. Vispa i mjölken lite i taget och låt sjuda under omrörning i 3–4 minuter, tills såsen är tjock och slät. Rör ner senap, salt, muskot och den rivna osten.",
      "Bred smör på ena sidan av 4 brödskivor och lägg dem med smörsidan nedåt på plåten.",
      "Bred ett tunt lager béchamel på brödet och lägg på skinka och hälften av den rivna osten. Lägg på resten av brödskivorna.",
      "Bred resten av béchamelsåsen över smörgåsarna, ända ut i kanterna, och strö över resten av osten.",
      "Gratinera i mitten av ugnen i 10–12 minuter, tills osten bubblar och har fått gyllenbruna fläckar. Slå på grillen de sista 2 minuterna för extra färg.",
      "Stek äggen i smör på medelvärme medan smörgåsarna är i ugnen, tills vitan har stelnat men gulan är flytande."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg ett stekt ägg mitt på varje smörgås, så att gulan blir kronan.",
          "Strö över gräslök och nymald svartpeppar.",
          "Skär en smörgås diagonalt, så att lagren av skinka och ost syns.",
          "Servera med en krispig grönsallad och lite extra julsenap vid sidan.",
          "Utan ägget heter den croque monsieur, och är lika god."
        ]
      }
    ],
    "pantryKeys": [
      "brod",
      "julskinka",
      "cheddar",
      "agg"
    ]
  },
  {
    "id": "63-janssonbiffar",
    "title": "Krispiga janssonbiffar med rödbetssallad och dill",
    "description": "Resterna av Janssons frestelse, ett ägg och lite ströbröd. Den kalla gratängen formas till runda biffar, vänds i ströbröd och steks i smör tills de är krispiga och gyllene utanpå och krämiga inuti. De serveras med julbordets rödbetssallad, rödlök och dill. Julens mest omtyckta rätt, ännu godare dagen efter.",
    "image": "assets/recipes/63-janssonbiffar.webp",
    "cardImage": "assets/recipes/63-janssonbiffar-card.webp",
    "alt": "Krispiga janssonbiffar med rödbetssallad och dill",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "15 min + 30 min i kylen",
      "Tillagning": "15 min",
      "Portioner": "4 (ca 12 biffar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Swedish",
      "Christmas",
      "Comfort food",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 60,
    "timeLabel": "1 tim",
    "ingredientSections": [
      {
        "title": "Biffar",
        "items": [
          {
            "name": "ca 1 liter kall Janssons frestelse",
            "key": "janssons-frestelse"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "2 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1½ dl ströbröd eller panko",
            "key": "strobrod"
          },
          {
            "name": "2 msk smör och 2 msk rapsolja till stekning",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 dl rödbetssallad, från julbordet eller recept 21"
          },
          {
            "name": "½ rödlök",
            "key": "rodlok"
          },
          {
            "name": "Några dillkvistar",
            "key": "dill"
          },
          {
            "name": "1 citron, i klyftor",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Lägg den kalla janssonen i en skål och mosa den grovt med en gaffel, så att potatisstrimlorna bryts sönder lite. Rör ner ägget och mjölet.",
      "Forma smeten till biffar med fuktiga händer, ca 7 cm breda och 2 cm tjocka. Är smeten för lös, tillsätt lite mer mjöl.",
      "Vänd biffarna i ströbrödet och tryck till så att det fastnar. Lägg dem på en plåt och kyl i 30 minuter, så håller de ihop bättre i pannan.",
      "Hetta upp smör och olja i en stekpanna på medelvärme. Stek biffarna i 3–4 minuter per sida, tills de är djupt gyllene och krispiga. Vänd dem försiktigt med en bred stekspade.",
      "Låt dem rinna av på hushållspapper och håll dem varma i ugnen på 100 grader medan du steker resten.",
      "Finhacka rödlöken."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg 2–3 biffar per person lätt överlappande på en tallrik, med den krispigaste sidan uppåt.",
          "Lägg en klick rödbetssallad bredvid, så att det rosa lyser mot det gyllene.",
          "Strö över rödlök och dillkvistar och servera med citronklyftor.",
          "Ett glas kall öl eller julmust passar perfekt."
        ]
      }
    ],
    "pantryKeys": [
      "janssons-frestelse",
      "agg",
      "vetemjol",
      "strobrod"
    ],
    "directionNotes": [
      {
        "title": "Har du ingen Jansson över?",
        "text": "Blanda 8 grovt rivna, kokta och kalla potatisar med 1 finhackad gul lök som stekts mjuk i smör, 6 hackade ansjovisfiléer, 1 msk spad från ansjovisburken, ½ dl vispgrädde och 1 krm vitpeppar. Fortsätt sedan från steg 1."
      }
    ]
  },
  {
    "id": "64-gloggpocherade-paron",
    "title": "Glöggpocherade päron med pepparkakssmul och vaniljglass",
    "description": "Den halva flaskan glögg som blev över, fyra päron och några pepparkakor ur burken. Päronen sjuder i glöggen tills de är mjuka och djupt vinröda, och glöggen kokas ihop till en blank, kryddig sirap. De serveras stående, med krossade pepparkakor och en kula vaniljglass. Juldessert från en finkrog, för nästan ingenting.",
    "image": "assets/recipes/64-gloggpocherade-paron.webp",
    "cardImage": "assets/recipes/64-gloggpocherade-paron-card.webp",
    "alt": "Glöggpocherade päron med pepparkakssmul och vaniljglass",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "40 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Christmas",
      "Make ahead",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Päron",
        "items": [
          {
            "name": "4 fasta päron, t.ex. Conference",
            "key": "paron"
          },
          {
            "name": "7 dl glögg, med eller utan alkohol"
          },
          {
            "name": "2 dl vatten",
            "basic": true
          },
          {
            "name": "1 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 kanelstång",
            "key": "kanel"
          },
          {
            "name": "Skal av ½ apelsin, i en lång remsa",
            "key": "apelsin"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "8 pepparkakor",
            "key": "pepparkakor"
          },
          {
            "name": "4 kulor vaniljglass, eller lättvispad grädde"
          },
          {
            "name": "Några myntablad (valfritt)",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Skala päronen men låt skaftet sitta kvar. Skär en tunn skiva från botten så att de står stadigt. Skrapa gärna ur kärnhuset underifrån med en tesked.",
      "Koka upp glögg, vatten, socker, kanelstång och apelsinskal i en kastrull som är så smal att päronen nästan täcks av vätskan.",
      "Lägg ner päronen och låt sjuda under lock på låg värme i 20–30 minuter, tills de är mjuka när du sticker i en kniv. Vänd dem då och då så att de färgas jämnt.",
      "Låt päronen svalna i vätskan, gärna i flera timmar eller över natten. Ju längre de ligger, desto djupare röda blir de.",
      "Lyft upp päronen. Koka upp vätskan och låt den koka ihop utan lock i 10–15 minuter, tills ca 2 dl återstår och den har blivit en blank sirap. Ta upp kanelstången och apelsinskalet.",
      "Krossa pepparkakorna grovt i en påse med en kavel."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Ställ ett päron upprätt på varje tallrik och skeda den varma sirapen över, så att den rinner ner och bildar en blank pöl.",
          "Strö pepparkakssmul bredvid päronet och lägg en kula vaniljglass i smulet, så glider den inte.",
          "Avsluta med ett myntablad vid skaftet.",
          "Päronen kan serveras varma eller kalla och håller i 3 dagar i kylen i sin sirap.",
          "Med alkoholfri glögg, havrebaserad glass och veganska pepparkakor blir desserten vegansk."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "65-pepparkakstiramisu",
    "title": "Pepparkakstiramisu med apelsin och kaffe",
    "description": "Pepparkakorna som blev kvar i burken, morgonens kaffe, en burk mascarpone och en apelsin. Kakorna doppas i kaffe och varvas med en luftig, apelsinfrisk kräm i små glas. Toppen pudras med kakao och några pepparkakssmulor. Italiens mest älskade dessert i svensk julskrud, utan att du behöver sätta på ugnen.",
    "image": "assets/recipes/65-pepparkakstiramisu.webp",
    "cardImage": "assets/recipes/65-pepparkakstiramisu-card.webp",
    "alt": "Pepparkakstiramisu med apelsin och kaffe",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "20 min + minst 4 tim i kylen",
      "Tillagning": "0 min",
      "Portioner": "6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Italian",
      "Christmas",
      "No bake",
      "Make ahead",
      "Leftovers",
      "Beginner friendly"
    ],
    "time": null,
    "timeLabel": "Minst 4 tim 20 min",
    "ingredientSections": [
      {
        "title": "Kräm",
        "items": [
          {
            "name": "250 g mascarpone",
            "key": "mascarpone"
          },
          {
            "name": "2½ dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "½ dl florsocker"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "Fint rivet skal av 1 apelsin",
            "key": "apelsin"
          }
        ]
      },
      {
        "title": "Kaffedopp",
        "items": [
          {
            "name": "2 dl starkt kaffe, avsvalnat",
            "key": "kaffe"
          },
          {
            "name": "2 msk pressad apelsinjuice"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          }
        ]
      },
      {
        "title": "Varvning",
        "items": [
          {
            "name": "ca 30 pepparkakor (ca 200 g)",
            "key": "pepparkakor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 msk kakao",
            "key": "kakao"
          },
          {
            "name": "Några pepparkakor, krossade",
            "key": "pepparkakor"
          },
          {
            "name": "Rivet apelsinskal"
          },
          {
            "name": "6 hela pepparkakor, gärna hjärtan eller stjärnor",
            "key": "pepparkakor"
          }
        ]
      }
    ],
    "directions": [
      "Rör ut mascarponen med florsocker, vaniljsocker och apelsinskal tills den är slät.",
      "Vispa grädden till mjuka toppar i en annan skål. Vänd ner den i mascarponen i två omgångar, försiktigt så att krämen blir luftig.",
      "Blanda kaffe, apelsinjuice och socker i en djup tallrik.",
      "Doppa pepparkakorna snabbt i kaffet, bara ett par sekunder. De mjuknar mer i kylen, och för blöta kakor blir mos.",
      "Varva i 6 glas: ett lager pepparkakor, ett lager kräm, ett lager pepparkakor och sist ett lager kräm. Bryt kakorna så att de passar glasen.",
      "Täck glasen och kyl dem i minst 4 timmar, gärna över natten, tills kakorna är mjuka som en tårtbotten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Pudra kakao över ytan genom en sil precis före servering, så att den inte blir fuktig.",
          "Strö över lite krossade pepparkakor och rivet apelsinskal.",
          "Stick ner en hel pepparkaka på kant i varje glas.",
          "Servera i små glas, kaffekoppar eller i en stor form att ösa ur på bordet.",
          "Tiramisun håller i 2 dagar i kylen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "66-ugnsbakade-vita-bonor",
    "title": "Ugnsbakade stora vita bönor i tomatsås med dill och citron",
    "description": "Två burkar stora vita bönor, en burk krossade tomater och en lök. Bönorna bakas i ugnen i en söt, djupröd tomatsås med vitlök, oregano och mycket olivolja, tills såsen är tjock som sylt och bönorna överst har fått krispiga kanter. Toppa med dill, citronskal och ett varv olivolja. Grekisk tavernamat ur skafferiet.",
    "image": "assets/recipes/66-ugnsbakade-vita-bonor.webp",
    "cardImage": "assets/recipes/66-ugnsbakade-vita-bonor-card.webp",
    "alt": "Ugnsbakade stora vita bönor i tomatsås med dill och citron",
    "meals": [
      "main",
      "side"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "50 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Greek",
      "One pot",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 60,
    "timeLabel": "1 tim",
    "ingredientSections": [
      {
        "title": "Bönor",
        "items": [
          {
            "name": "2 burkar stora vita bönor eller smörbönor (à 400 g)",
            "key": "vita-bonor"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 morot",
            "key": "morot"
          },
          {
            "name": "3 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "1 dl olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "1 tsk torkad oregano"
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "½ dl hackad dill",
            "key": "dill"
          },
          {
            "name": "½ dl hackad bladpersilja",
            "key": "orter"
          },
          {
            "name": "Fint rivet skal av 1 citron",
            "key": "citron"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Rostat surdegsbröd (kontrollera att det är veganskt)",
            "key": "brod"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Skölj bönorna i en sil och låt dem rinna av.",
      "Hacka löken. Skala och riv moroten fint. Skiva vitlöken.",
      "Hetta upp hälften av olivoljan i en ugnsfast stekpanna eller gryta på medelvärme. Fräs lök och morot i 6–8 minuter, tills löken är mjuk och söt. Tillsätt vitlök och tomatpuré och fräs 1 minut till.",
      "Rör ner krossade tomater, vatten, oregano, socker, salt, chili och peppar. Låt sjuda i 5 minuter.",
      "Vänd försiktigt ner bönorna så att de inte går sönder. Ringla resten av olivoljan över ytan.",
      "Baka i mitten av ugnen utan lock i 30–35 minuter, tills såsen har tjocknat och bönorna överst har fått krispiga, lätt brända kanter.",
      "Låt stå i 10 minuter före servering. Bönorna är godast ljumma."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera direkt i pannan, så att de krispiga bönorna överst syns.",
          "Strö generöst med dill, persilja och citronskal, ringla över olivolja och avsluta med flingsalt.",
          "Ställ fram rostat surdegsbröd att skopa upp bönorna med.",
          "För en vegetarisk variant, smula 100 g fetaost över bönorna efter 20 minuter i ugnen.",
          "Bönorna blir ännu godare dagen efter och håller i 4 dagar i kylen."
        ]
      }
    ],
    "pantryKeys": [
      "vita-bonor",
      "kross",
      "lok",
      "morot"
    ]
  },
  {
    "id": "67-majsplattar",
    "title": "Krispiga majsplättar med limecrème och koriander",
    "description": "En burk majs, två ägg och lite mjöl. Smeten steks till små gyllene plättar, så fulla av majskorn att de knastrar i pannan, och toppas med syrlig limecrème, koriander, salladslök och färsk chili. Lika bra till brunch som till mingel eller en lätt vardagsmiddag.",
    "image": "assets/recipes/67-majsplattar.webp",
    "cardImage": "assets/recipes/67-majsplattar-card.webp",
    "alt": "Krispiga majsplättar med limecrème och koriander",
    "meals": [
      "main",
      "party",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "15 min",
      "Portioner": "4 (ca 12 plättar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Limecrème",
        "items": [
          {
            "name": "1 dl crème fraiche",
            "key": "creme-fraiche"
          },
          {
            "name": "Fint rivet skal och 1 msk saft av ½ lime",
            "key": "lime"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Majsplättar",
        "items": [
          {
            "name": "1 burk majs (ca 300 g), avrunnen",
            "key": "majs"
          },
          {
            "name": "2 ägg",
            "key": "agg"
          },
          {
            "name": "½ dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "1 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 tsk bakpulver"
          },
          {
            "name": "½ tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "½ tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "2 salladslökar",
            "key": "salladslok"
          },
          {
            "name": "3 msk rapsolja till stekning",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl koriander",
            "key": "orter"
          },
          {
            "name": "1 salladslök, tunt skivad",
            "key": "salladslok"
          },
          {
            "name": "1 färsk röd chili, tunt skivad"
          },
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop crème fraiche, limeskal, limesaft och salt. Ställ kallt.",
      "Låt majsen rinna av ordentligt och klappa den torr med hushållspapper. Torr majs ger krispigare plättar.",
      "Vispa ihop ägg, mjölk, mjöl, bakpulver, spiskummin, paprikapulver och salt till en tjock smet. Skiva salladslöken tunt och vänd ner den tillsammans med majsen.",
      "Hetta upp ett tunt lager olja i en stekpanna på medelhög värme. Klicka ut smeten, ca 2 msk per plätt, och platta till dem lätt med skeden.",
      "Stek plättarna 2–3 minuter per sida, tills de är gyllenbruna och krispiga i kanterna. Låt dem rinna av på hushållspapper och håll dem varma i ugnen på 100 grader medan du steker resten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Stapla 3 plättar lätt förskjutet på varje tallrik och lägg en klick limecrème överst.",
          "Toppa med koriander, salladslök, chili och några flingsaltkorn.",
          "Servera med limeklyftor.",
          "Gör plättarna mindre, ca 1 msk smet var, så blir de perfekt mingelmat på ett fat.",
          "Gott till brunch med ett stekt ägg eller några skivor krispigt bacon."
        ]
      }
    ],
    "pantryKeys": [
      "majs",
      "agg",
      "mjolk",
      "vetemjol"
    ]
  },
  {
    "id": "68-pan-con-tomate",
    "title": "Pan con tomate med sardiner, citron och chili",
    "description": "En burk sardiner i olivolja, två tomater och gårdagens bröd. Brödet rostas krispigt, gnids med vitlök och riven tomat och toppas med glänsande sardiner, citronskal, chili och persilja. Spansk tapas från en bar i Barcelona, gjord på det billigaste i fiskhyllan.",
    "image": "assets/recipes/68-pan-con-tomate.webp",
    "cardImage": "assets/recipes/68-pan-con-tomate-card.webp",
    "alt": "Pan con tomate med sardiner, citron och chili",
    "meals": [
      "starter",
      "sandwich",
      "party"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "5 min",
      "Portioner": "4 som förrätt eller 2 som lunch",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Dairy free",
      "Spanish",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 15,
    "timeLabel": "15 min",
    "ingredientSections": [
      {
        "title": "Tomatbröd",
        "items": [
          {
            "name": "4 skivor surdegsbröd eller ciabatta, gärna en dag gamla",
            "key": "brod"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 vitlöksklyfta",
            "key": "vitlok"
          },
          {
            "name": "2 mogna tomater",
            "key": "tomat"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "2 burkar sardiner i olivolja (à ca 120 g)",
            "key": "sardiner"
          },
          {
            "name": "Fint rivet skal av 1 citron",
            "key": "citron"
          },
          {
            "name": "1 färsk röd chili, tunt skivad, eller 1 krm chiliflakes"
          },
          {
            "name": "2 msk hackad bladpersilja",
            "key": "orter"
          },
          {
            "name": "¼ rödlök, i mycket tunna ringar (valfritt)",
            "key": "rodlok"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Svartpeppar",
            "basic": true
          },
          {
            "name": "1 citron, i klyftor",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Ringla olivolja över brödskivorna och rosta dem i en het, torr stekpanna eller grillpanna, ca 2 minuter per sida, tills de är krispiga med mörka ränder.",
      "Dela vitlöksklyftan och gnid snittytan över det varma brödet. Den krispiga ytan fungerar som ett rivjärn.",
      "Dela tomaterna och riv snittytan mot rivjärnets grova sida tills bara skalet är kvar. Salta tomatmoset.",
      "Bred tomatmoset över brödet ända ut i kanterna.",
      "Lyft upp sardinerna ur burken och låt oljan droppa av. Dela stora sardiner på längden och ta bort ryggbenet om du vill. Lägg 2–3 sardiner på varje brödskiva.",
      "Ringla lite av oljan från burken över."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Strö över citronskal, chili, persilja och rödlök.",
          "Avsluta med flingsalt och nymald svartpeppar.",
          "Servera på ett träbräde med citronklyftor, gärna till ett glas kallt vitt vin.",
          "Skär varje skiva i tre bitar om du serverar dem som mingelmat.",
          "Utan sardiner blir tomatbrödet en vegansk tapas i sig självt."
        ]
      }
    ],
    "pantryKeys": [
      "brod",
      "tomat",
      "sardiner"
    ]
  },
  {
    "id": "69-helrostad-blomkal",
    "title": "Helrostad blomkål med tahinisås, citron och rostade mandlar",
    "description": "Ett helt blomkålshuvud, en burk tahini och en citron. Blomkålen förkokas, penslas med kryddolja och rostas hel i ugnen tills den är gyllene och krispig utanpå och mjuk som smör inuti. Den bärs in hel på ett fat under tahinisås, mandlar, persilja och chili, och skärs upp vid bordet som en söndagsstek.",
    "image": "assets/recipes/69-helrostad-blomkal.webp",
    "cardImage": "assets/recipes/69-helrostad-blomkal-card.webp",
    "alt": "Helrostad blomkål med tahinisås, citron och rostade mandlar",
    "meals": [
      "main",
      "side"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "60 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Middle Eastern",
      "Sunday dinner",
      "Budget"
    ],
    "time": 75,
    "timeLabel": "1 tim 15 min",
    "ingredientSections": [
      {
        "title": "Blomkål",
        "items": [
          {
            "name": "1 stort blomkålshuvud (ca 1 kg)",
            "key": "blomkal"
          },
          {
            "name": "1 msk salt till kokvattnet",
            "basic": true
          },
          {
            "name": "3 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "½ tsk malen gurkmeja",
            "key": "kryddor"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Tahinisås",
        "items": [
          {
            "name": "3 msk tahini",
            "key": "tahini"
          },
          {
            "name": "2 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "4–6 msk kallt vatten",
            "basic": true
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "½ dl mandlar",
            "key": "mandel"
          },
          {
            "name": "1 dl hackad bladpersilja",
            "key": "orter"
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "Fint rivet skal av 1 citron",
            "key": "citron"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 220 grader. Skär bort de grövsta bladen men låt några små blad sitta kvar, de blir krispiga. Skär stocken plan så att huvudet står stadigt.",
      "Koka upp en stor kastrull med vatten och salt. Sänk ner hela blomkålen med stocken nedåt och koka i 6–8 minuter, tills en kniv går lätt in i stocken. Lyft upp den och låt den ånga av och torka i 5 minuter.",
      "Rör ihop olivolja, spiskummin, paprikapulver, gurkmeja och salt. Ställ blomkålen i en ugnsform eller gjutjärnspanna och pensla kryddoljan över hela huvudet, även in mellan buketterna.",
      "Rosta i mitten av ugnen i 40–50 minuter, tills blomkålen är djupt gyllenbrun och krispig på ytan. Pensla med oljan i formen halvvägs.",
      "Rör ihop tahini, citronsaft och vitlök. Tahinin stelnar först, men blir slät och krämig när du rör ner vattnet, en matsked i taget. Smaka av med salt.",
      "Rosta mandlarna i en torr stekpanna i 3–4 minuter och hacka dem grovt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Ställ blomkålen hel på ett stort fat och ringla tahinisåsen över i breda band, så att den rinner ner längs sidorna.",
          "Strö över mandlar, persilja, chiliflakes och citronskal, och avsluta med olivolja och flingsalt.",
          "Bär in den hel och skär den i tårtbitar vid bordet.",
          "Servera med couscous eller bulgur, och gärna fokaccian i recept 59.",
          "Romescon i recept 25 passar också fint som sås."
        ]
      }
    ],
    "pantryKeys": [
      "blomkal",
      "tahini",
      "citron"
    ]
  },
  {
    "id": "70-mac-and-cheese",
    "title": "Krämig mac and cheese med kylskåpets ostbitar och krispigt täcke",
    "description": "Ett paket makaroner, mjölk och alla ostbitar som ligger kvar i kylen. Pastan vänds i en sidenlen ostsås med senap, täcks med smörigt ströbröd och gratineras tills ytan knastrar och osten bubblar upp längs kanterna. Barnens favorit, och de vuxnas, i söndagskläder.",
    "image": "assets/recipes/70-mac-and-cheese.webp",
    "cardImage": "assets/recipes/70-mac-and-cheese-card.webp",
    "alt": "Krämig mac and cheese med kylskåpets ostbitar och krispigt täcke",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "35 min",
      "Portioner": "4–6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "American",
      "Comfort food",
      "Family friendly",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Pasta",
        "items": [
          {
            "name": "400 g makaroner eller annan kort pasta",
            "key": "pasta"
          },
          {
            "name": "2 msk salt till pastavattnet",
            "basic": true
          }
        ]
      },
      {
        "title": "Ostsås",
        "items": [
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "4 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "7 dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "1 tsk dijonsenap",
            "key": "senap"
          },
          {
            "name": "½ tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 krm riven muskotnöt"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "5 dl riven ost (ca 250 g), gärna blandat, t.ex. cheddar, prästost och mozzarella",
            "key": "cheddar"
          }
        ]
      },
      {
        "title": "Täcke",
        "items": [
          {
            "name": "1 dl ströbröd eller panko",
            "key": "strobrod"
          },
          {
            "name": "2 msk smör, smält",
            "key": "smor"
          },
          {
            "name": "½ dl riven ost",
            "key": "cheddar"
          },
          {
            "name": "2 msk hackad bladpersilja",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Smörj en ugnsform, ca 20 × 30 cm.",
      "Koka makaronerna i rikligt med saltat vatten 2 minuter kortare än det står på förpackningen. De kokar klart i ugnen. Häll av.",
      "Smält smöret i en stor kastrull på medelvärme. Vispa ner mjölet och låt fräsa i 1 minut. Vispa i mjölken lite i taget och låt sjuda under omrörning i 5 minuter, tills såsen har tjocknat.",
      "Ta kastrullen från värmen. Rör ner senap, paprikapulver, muskot, salt, peppar och osten, tills osten har smält och såsen är slät. Smaka av. Såsen ska smaka lite för salt, eftersom pastan suger åt sig.",
      "Vänd ner makaronerna i såsen och häll allt i formen.",
      "Blanda ströbröd, smält smör och ost och strö det jämnt över.",
      "Gratinera i mitten av ugnen i 20–25 minuter, tills täcket är gyllene och krispigt och såsen bubblar längs kanterna. Låt stå i 5 minuter före servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Strö över persilja precis före servering och bär ut formen direkt till bordet.",
          "Ta den första portionen med en stor sked, så att de långa oststrängarna syns.",
          "Servera med en syrlig grönsallad eller ugnsrostade tomater vid sidan.",
          "Blanda gärna en lagrad ost med mycket smak och en som smälter bra, som mozzarella, så får du både smak och oststrängar."
        ]
      }
    ],
    "pantryKeys": [
      "pasta",
      "cheddar",
      "mjolk"
    ]
  },
  {
    "id": "71-stekta-fiskbullar",
    "title": "Stekta fiskbullar med ärtpuré, citronsmör och krasse",
    "description": "Den mest förlöjligade burken i skafferiet, en påse frysta ärter och en citron. Fiskbullarna halveras och steks gyllene och krispiga i smör, och läggs på en klargrön ärtpuré under ett blankt citronsmör med kapris och en tuss krasse. Ingen kommer att gissa att de kom ur en burk.",
    "image": "assets/recipes/71-stekta-fiskbullar.webp",
    "cardImage": "assets/recipes/71-stekta-fiskbullar-card.webp",
    "alt": "Stekta fiskbullar med ärtpuré, citronsmör och krasse",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "20 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Pescatarian",
      "Swedish",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 30,
    "timeLabel": "30 min",
    "ingredientSections": [
      {
        "title": "Ärtpuré",
        "items": [
          {
            "name": "4 dl frysta gröna ärter",
            "key": "arter"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "25 g smör",
            "key": "smor"
          },
          {
            "name": "1 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm vitpeppar",
            "basic": true
          },
          {
            "name": "Några myntablad (valfritt)",
            "key": "orter"
          }
        ]
      },
      {
        "title": "Fiskbullar",
        "items": [
          {
            "name": "2 burkar fiskbullar i buljong (à ca 375 g)",
            "key": "fiskbullar"
          },
          {
            "name": "2 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "2 msk smör och 1 msk rapsolja till stekning",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Citronsmör",
        "items": [
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "1 msk kapris",
            "key": "kapris"
          },
          {
            "name": "Fint rivet skal och 1 msk saft av ½ citron",
            "key": "citron"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "½ ask krasse eller några dillkvistar",
            "key": "orter"
          },
          {
            "name": "1 citron, i klyftor",
            "key": "citron"
          },
          {
            "name": "Kokt potatis",
            "key": "potatis"
          }
        ]
      }
    ],
    "directions": [
      "Koka ärterna i vattnet under lock i 3 minuter. Mixa dem slätt med kokvattnet, smör, citronsaft, salt, vitpeppar och mynta med en stavmixer. Håll purén varm.",
      "Häll av fiskbullarna och dela dem på mitten. Klappa dem riktigt torra med hushållspapper, annars blir de inte krispiga.",
      "Vänd fiskbullshalvorna i mjölet och knacka av överskottet.",
      "Hetta upp smör och olja i en stor stekpanna på medelhög värme. Stek fiskbullarna med snittytan nedåt i 3–4 minuter, tills de är djupt gyllene och krispiga. Vänd och stek 1–2 minuter till.",
      "Smält smöret till citronsmöret i en liten kastrull. Rör ner kapris, citronskal och citronsaft precis före servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bred ut ärtpurén i en svepande rörelse på varje tallrik med baksidan av en sked.",
          "Lägg fiskbullarna i en rad på purén, med den gyllene snittytan uppåt.",
          "Skeda citronsmöret med kaprisen över och runt fiskbullarna.",
          "Toppa med krasse och servera med citronklyftor och kokt potatis.",
          "Spara buljongen från burkarna, den är god som bas i fisksoppan i recept 58."
        ]
      }
    ],
    "pantryKeys": [
      "fiskbullar",
      "arter",
      "citron"
    ]
  },
  {
    "id": "72-kottfarslimpa",
    "title": "Glaserad köttfärslimpa med gräddsås och pressgurka",
    "description": "Ett paket köttfärs, en lök och lite ströbröd. Limpan bakas saftig i ugnen och glaseras med en blank, mörkröd glasyr av tomatpuré, sirap och senap, som karamelliseras i kanterna. Den skivas tjockt och serveras med gräddsås, potatis och pressgurka. Klassisk svensk söndagsmiddag, med en glasyr som får den att glänsa på bordet.",
    "image": "assets/recipes/72-kottfarslimpa.webp",
    "cardImage": "assets/recipes/72-kottfarslimpa-card.webp",
    "alt": "Glaserad köttfärslimpa med gräddsås och pressgurka",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "50 min",
      "Portioner": "4–6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Swedish",
      "Sunday dinner",
      "Comfort food",
      "Family friendly",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "Köttfärslimpa",
        "items": [
          {
            "name": "½ dl ströbröd",
            "key": "strobrod"
          },
          {
            "name": "1½ dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "500 g blandfärs",
            "key": "blandfars"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "2 krm svartpeppar",
            "basic": true
          },
          {
            "name": "½ tsk torkad timjan",
            "key": "orter"
          },
          {
            "name": "1 msk japansk soja",
            "key": "soja"
          }
        ]
      },
      {
        "title": "Glasyr",
        "items": [
          {
            "name": "2 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "1 tsk dijonsenap",
            "key": "senap"
          },
          {
            "name": "1 tsk japansk soja",
            "key": "soja"
          }
        ]
      },
      {
        "title": "Gräddsås",
        "items": [
          {
            "name": "Skyn från formen"
          },
          {
            "name": "1 dl vatten + ½ buljongtärning",
            "key": "buljong"
          },
          {
            "name": "2 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "1 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 tsk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 tsk svartvinbärsgelé eller rönnbärsgelé (valfritt)"
          },
          {
            "name": "Salt och svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Pressgurka",
        "items": [
          {
            "name": "1 gurka",
            "key": "gurka"
          },
          {
            "name": "½ dl vatten",
            "basic": true
          },
          {
            "name": "1 msk ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "2 msk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "2 msk hackad bladpersilja",
            "key": "orter"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Kokt potatis eller potatismos",
            "key": "potatis"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Rör ihop ströbröd och mjölk i en bunke och låt svälla i 10 minuter. Det är det som gör limpan saftig.",
      "Hyvla gurkan tunt till pressgurkan. Rör ihop vatten, ättika, socker och salt, häll lagen över gurkan och strö över persiljan. Ställ kallt.",
      "Finhacka löken och fräs den mjuk i smöret i 4–5 minuter. Låt den svalna lite.",
      "Blanda färs, lök, ägg, salt, peppar, timjan och soja med ströbrödsblandningen. Arbeta ihop med händerna bara tills allt är jämnt blandat. Fukta händerna om smeten kladdar.",
      "Forma en avlång limpa, ca 8 × 20 cm, och lägg den i en ugnsform.",
      "Rör ihop glasyren och pensla hälften över limpan. Baka i mitten av ugnen i 20 minuter. Pensla på resten av glasyren och baka 20–25 minuter till, tills limpan håller 72 grader i mitten och glasyren har karamelliserats i kanterna. Saknar du termometer, stick in en kniv i mitten. Köttsaften ska vara klar, inte rosa.",
      "Lyft över limpan till ett skärbräde och låt den vila under folie i 10 minuter.",
      "Häll skyn från formen i en kastrull och tillsätt vatten, buljongtärning och grädde. Rör ut mjölet i lite kallt vatten och vispa ner det. Låt sjuda i 3–4 minuter, tills såsen har tjocknat. Smaka av med soja, gelé, salt och peppar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skär limpan i tjocka skivor på brädet, så att den blanka, mörkröda glasyren syns överst på varje skiva.",
          "Servera direkt från brädet, med gräddsåsen i en kanna bredvid.",
          "Lägg pressgurkan i en liten glasskål. Den gröna färgen och syran lyfter hela tallriken.",
          "Kalla skivor dagen efter är perfekta på smörgås med pressgurka."
        ]
      }
    ],
    "pantryKeys": [
      "blandfars",
      "lok",
      "agg",
      "strobrod",
      "gurka"
    ]
  },
  {
    "id": "73-banansoftis",
    "title": "Banansoftis med kakao, jordnötssmör och rostade hasselnötter",
    "description": "De bruna bananerna som ingen vill äta skivas, fryses och mixas till en len, krämig softglass utan grädde, socker eller glassmaskin. Den skopas i höga virvlar, ringlas med varmt jordnötssmör och toppas med rostade hasselnötter, riven choklad och flingsalt. Ser ut som från en glassbar och är helt vegansk.",
    "image": "assets/recipes/73-banansoftis.webp",
    "cardImage": "assets/recipes/73-banansoftis-card.webp",
    "alt": "Banansoftis med kakao, jordnötssmör och rostade hasselnötter",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "10 min + minst 4 tim i frysen",
      "Tillagning": "5 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "Minst 4 tim 15 min",
    "ingredientSections": [
      {
        "title": "Glass",
        "items": [
          {
            "name": "4 övermogna bananer",
            "key": "banan"
          },
          {
            "name": "2 msk kakao",
            "key": "kakao"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "2–4 msk havredryck",
            "key": "havredryck"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "3 msk jordnötssmör",
            "key": "jordnotssmor"
          },
          {
            "name": "2 msk hasselnötter",
            "key": "hasselnot"
          },
          {
            "name": "20 g mörk choklad (kontrollera att den är mjölkfri)",
            "key": "choklad"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Skala bananerna och skär dem i skivor, ca 1 cm. Lägg skivorna utspridda på en plåt eller tallrik med bakplåtspapper och frys i minst 4 timmar, gärna över natten. Fryser de var för sig klumpar de inte ihop sig.",
      "Rosta hasselnötterna i en torr stekpanna i 4–5 minuter. Gnid av skalen i en kökshandduk och hacka nötterna grovt.",
      "Mixa de frysta bananskivorna med kakao och salt i en matberedare. Först blir det grovt grus, sedan smuligt, och efter 2–4 minuter plötsligt slätt och krämigt som softglass. Skrapa ner kanterna och tillsätt havredryck en matsked i taget om det går trögt.",
      "Värm jordnötssmöret några sekunder i mikron så att det blir rinnigt.",
      "Ät glassen direkt som softglass, eller bred ut den i en form och frys i 30–60 minuter om du vill kunna skopa kulor."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skopa glassen i höga virvlar i små glas eller skålar.",
          "Ringla det varma jordnötssmöret över i tunna trådar.",
          "Riv chokladen över, strö över hasselnötterna och avsluta med några flingsaltkorn.",
          "Byt kakaon mot frysta hallon eller mango för en ljusare, fruktigare variant.",
          "Frys bananer i skivor så fort de blir för mogna, så har du alltid glass hemma."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "74-fryst-yoghurtbark",
    "title": "Fryst yoghurtbark med bär, honung och granola",
    "description": "Den sista burken turkisk yoghurt, en påse frysta bär och en sked honung. Yoghurten breds ut på en plåt, marmoreras med krossade bär, strös över med granola och fryses tills den kan brytas i stora, glittrande flak. Ett kallt, krispigt mellanmål som ser ut som skärvor av rosa marmor.",
    "image": "assets/recipes/74-fryst-yoghurtbark.webp",
    "cardImage": "assets/recipes/74-fryst-yoghurtbark-card.webp",
    "alt": "Fryst yoghurtbark med bär, honung och granola",
    "meals": [
      "dessert",
      "snack"
    ],
    "metadata": {
      "Förberedelse": "10 min + minst 3 tim i frysen",
      "Tillagning": "0 min",
      "Portioner": "ca 20 flak",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Family friendly",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "Minst 3 tim 10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "5 dl turkisk yoghurt (10 %)",
            "key": "yoghurt"
          },
          {
            "name": "3 msk flytande honung",
            "key": "honung"
          },
          {
            "name": "1 tsk vaniljsocker"
          },
          {
            "name": "2 dl frysta bär, t.ex. hallon och blåbär",
            "key": "bar"
          },
          {
            "name": "1 dl granola, gärna från recept 38",
            "key": "granola"
          },
          {
            "name": "1 msk pumpafrön",
            "key": "fron"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 msk flytande honung",
            "key": "honung"
          },
          {
            "name": "Några frysta bär",
            "key": "bar"
          }
        ]
      }
    ],
    "directions": [
      "Klä en plåt eller ett stort fat som får plats i frysen med bakplåtspapper.",
      "Rör ihop yoghurt, honung och vaniljsocker.",
      "Krossa hälften av bären lätt med en gaffel så att de släpper saft.",
      "Bred ut yoghurten på pappret till en rektangel, ca 1 cm tjock.",
      "Klicka ut de krossade bären och dra dem genom yoghurten med en tandpetare eller kniv, så att den blir marmorerad i rosa och lila.",
      "Strö över resten av bären, granolan och pumpafröna och tryck ner dem lätt.",
      "Frys i minst 3 timmar, tills barken är helt fast. Bryt den i oregelbundna flak."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Ställ flaken på högkant, lätt överlappande, på ett kallt fat precis före servering.",
          "Ringla över lite extra honung och strö över några frysta bär.",
          "Ta fram barken 5 minuter före servering, då blir den lagom mjuk att bita i.",
          "Förvara flaken i frysen i en burk med bakplåtspapper mellan lagren, där håller de i ca 1 månad."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "75-kaffegranita",
    "title": "Kaffegranita på morgonens kaffe med vispad grädde",
    "description": "Kaffet som blev kvar i bryggaren, lite socker och en form i frysen. Kaffet skrapas med en gaffel var halvtimme tills det blir glittrande, mörka iskristaller, som serveras i kalla glas under ett moln av lättvispad grädde och riven choklad. Den sicilianska klassikern, gjord på kaffe som annars hamnar i vasken.",
    "image": "assets/recipes/75-kaffegranita.webp",
    "cardImage": "assets/recipes/75-kaffegranita-card.webp",
    "alt": "Kaffegranita på morgonens kaffe med vispad grädde",
    "meals": [
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "10 min + 3–4 tim i frysen",
      "Tillagning": "0 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Italian",
      "Make ahead",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 250,
    "timeLabel": "3 tim 10 min–4 tim 10 min",
    "ingredientSections": [
      {
        "title": "Granita",
        "items": [
          {
            "name": "5 dl starkt bryggkaffe, varmt",
            "key": "kaffe"
          },
          {
            "name": "¾–1 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Grädde",
        "items": [
          {
            "name": "2 dl vispgrädde",
            "key": "gradde"
          },
          {
            "name": "1 msk florsocker"
          },
          {
            "name": "1 tsk vaniljsocker"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "10 g mörk choklad",
            "key": "choklad"
          },
          {
            "name": "Fint rivet skal av ½ apelsin (valfritt)",
            "key": "apelsin"
          }
        ]
      }
    ],
    "directions": [
      "Rör ut sockret och saltet i det varma kaffet tills det har löst sig. Det ska smaka lite för sött, sötman dämpas när det fryser.",
      "Låt kaffet svalna och häll det i en grund form, gärna av metall, ca 20 × 30 cm. Ju grundare form, desto snabbare fryser det.",
      "Ställ formen i frysen. Efter ca 45 minuter har kanterna börjat frysa. Skrapa isen med en gaffel från kanterna in mot mitten.",
      "Skrapa igen var 30:e minut i 3–4 timmar, tills allt har blivit lösa, fluffiga iskristaller.",
      "Ställ 4 glas i frysen 10 minuter före servering.",
      "Vispa grädden med florsocker och vaniljsocker till mjuka toppar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skrapa granitan en sista gång och skeda den i de kalla glasen, gärna i lager med grädden.",
          "Toppa med ett moln av vispad grädde och riv choklad och apelsinskal över.",
          "Servera direkt med en långskaftad sked, granita smälter fort.",
          "Granitan håller i frysen i en vecka. Skrapa upp den med en gaffel före servering.",
          "Byt grädden mot vispbar havregrädde för en vegansk variant."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "76-svalkande-ogonkuddar",
    "title": "Svalkande ögonkuddar av använda gröntepåsar och gurka",
    "description": "Två använda tepåsar med grönt te och en bit gurka. Tepåsarna kyls i frysen och läggs över ögonlocken tillsammans med tunna gurkskivor, medan du vilar under en kall, fuktig tvättlapp. Tio minuter som får trötta ögon att kännas svalare och piggare, gjorda av det som annars hamnar i soporna.",
    "image": "assets/recipes/76-svalkande-ogonkuddar.webp",
    "cardImage": "assets/recipes/76-svalkande-ogonkuddar-card.webp",
    "alt": "Svalkande ögonkuddar av använda gröntepåsar och gurka",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min + 20 min i frysen",
      "Verkningstid": "10 min",
      "Räcker till": "1 behandling",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Eyes",
      "Soothing",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 använda tepåsar med grönt eller svart te"
          },
          {
            "name": "¼ gurka, kall från kylen",
            "key": "gurka"
          },
          {
            "name": "1 tvättlapp eller liten handduk"
          },
          {
            "name": "Kallt vatten",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Låt tepåsarna svalna efter teet. Krama ur dem lätt, så att de är fuktiga men inte droppar.",
      "Lägg dem på en liten tallrik och ställ in dem i frysen i 15–20 minuter, eller i kylen i en timme. De ska vara kalla, inte stenhårda.",
      "Skär två tunna skivor gurka, ca 3 mm.",
      "Tvätta ansiktet och ta bort ögonsminket.",
      "Luta dig tillbaka med huvudet lite högt. Lägg en tepåse över varje stängt ögonlock och gurkskivorna ovanpå, eller under ögonen.",
      "Blöt tvättlappen i kallt vatten, vrid ur den och lägg den över pannan. Vila i 10 minuter.",
      "Ta bort tepåsarna och badda huden runt ögonen med lite kallt vatten. Klappa torrt och avsluta med en mild ögonkräm om du har."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Lägg tepåsarna och gurkskivorna på ett litet fat med en kvist mynta, och ställ det på en bricka med en kopp nybryggt te.",
          "Gör behandlingen på kvällen i soffan eller sängen, med släckt taklampa och ett tänt ljus.",
          "Passar fint som avslutning efter havremasken i behandling 33.",
          "Spara dagens använda tepåsar i en burk i kylen, så har du alltid ett par redo till kvällen."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Använd bara tepåsar utan tillsatt arom, glitter eller torkade blommor, och klipp inte upp påsarna.",
          "Låt inget te rinna in i ögonen. Får du det i ögat, skölj med ljummet vatten.",
          "Använd inte behandlingen vid ögoninflammation, rodnad eller om du nyligen har opererat ögonen.",
          "Släng tepåsarna efteråt, och använd inte påsar som legat i kylen mer än ett dygn."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "77-ansiktsangbad",
    "title": "Ångbad för ansiktet med kamomill, citrusskal och rosmarin",
    "description": "En påse kamomillte, skalet från en apelsin och en kvist rosmarin. Örterna dras i hett vatten i en stor skål, och du lutar dig över den under en handduk medan den doftande ångan värmer och mjukar upp huden. Fem minuter som känns som ångrummet på ett spa, och ett perfekt första steg före en ansiktsmask.",
    "image": "assets/recipes/77-ansiktsangbad.webp",
    "cardImage": "assets/recipes/77-ansiktsangbad-card.webp",
    "alt": "Ångbad för ansiktet med kamomill, citrusskal och rosmarin",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "5–8 min",
      "Räcker till": "1 behandling",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Face",
      "Relaxing",
      "Natural",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 13,
    "timeLabel": "10–13 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1½ liter vatten",
            "basic": true
          },
          {
            "name": "2 påsar kamomillte, eller 2 msk torkad kamomill"
          },
          {
            "name": "Skal av ½ apelsin eller citron, i remsor",
            "key": "apelsin"
          },
          {
            "name": "1 kvist färsk rosmarin eller timjan"
          },
          {
            "name": "1 stor handduk"
          }
        ]
      }
    ],
    "directions": [
      "Koka upp vattnet.",
      "Lägg tepåsar, citrusskal och rosmarin i en stor, värmetålig skål. Häll över det kokande vattnet och låt dra i 3–5 minuter, tills ångan inte längre är skållhet. Känn med handflatan en bit ovanför ytan.",
      "Tvätta ansiktet och sätt upp håret.",
      "Ställ skålen på ett stadigt bord. Sätt dig ner, luta dig över skålen på minst 30 centimeters avstånd och lägg handduken över huvudet och skålen som ett tält.",
      "Andas lugnt och låt ångan värma ansiktet i 5–8 minuter. Blir det för varmt, lyft på handduken eller luta dig längre bort.",
      "Badda ansiktet med en sval, fuktig tvättlapp och klappa torrt. Avsluta med ansiktskräm, eller fortsätt direkt med havremasken i behandling 33."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Använd en vacker skål i keramik eller emalj, och låt citrusskalen och örtkvisten flyta på ytan.",
          "Ställ skålen på en bricka med en vikt handduk, en tvättlapp och en kopp av samma kamomillte.",
          "Spara skal från fruktskålens apelsiner och citroner i frysen, så har du alltid något doftande till hands.",
          "Ångan gör huden mjuk och mottaglig, så ångbadet passar som första steg i en hel spakväll."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Ånga ger lätt brännskador. Låt vattnet svalna några minuter, håll avståndet och låt barn bara göra det med en vuxen bredvid.",
          "Hoppa över ångbadet om du har rosacea, eksem eller känslig, irriterad hud, eftersom värmen kan förvärra rodnaden.",
          "Är du allergisk mot korgblommiga växter, som gråbo, kan kamomill ge en reaktion. Använd då bara citrusskal och rosmarin."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "78-harglansskoljning",
    "title": "Glanssköljning för håret med äppelcidervinäger och rosmarin",
    "description": "En skvätt äppelcidervinäger, en kvist rosmarin och en kanna vatten. Sköljningen hälls över håret efter tvätten och gör det mjukt, lättkammat och blankt, helt utan köpta produkter. Ett sista steg i duschen som kostar några kronor och doftar som en örtträdgård.",
    "image": "assets/recipes/78-harglansskoljning.webp",
    "cardImage": "assets/recipes/78-harglansskoljning-card.webp",
    "alt": "Glanssköljning för håret med äppelcidervinäger och rosmarin",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min + 20 min dragtid",
      "Verkningstid": "2 min",
      "Räcker till": "1 behandling",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Hair",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": 27,
    "timeLabel": "27 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "5 dl vatten",
            "basic": true
          },
          {
            "name": "2 kvistar färsk rosmarin, eller 1 tsk torkad",
            "key": "orter"
          },
          {
            "name": "2 msk äppelcidervinäger"
          }
        ]
      }
    ],
    "directions": [
      "Koka upp vattnet och häll det över rosmarinen i en kanna. Låt dra i 15–20 minuter, tills vattnet har svalnat till ljummet.",
      "Sila bort rosmarinen och rör ner vinägern.",
      "Tvätta håret som vanligt med schampo och skölj ur det.",
      "Luta huvudet bakåt och häll sköljningen långsamt över håret, från hårbotten och ut i topparna. Massera lätt.",
      "Låt verka i 1–2 minuter.",
      "Skölj ur med svalt vatten. Doften av vinäger försvinner när håret torkar."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Häll sköljningen i en glaskaraff eller en gammal glasflaska med en rosmarinkvist kvar i, så blir den en dekoration i badrummet.",
          "Använd sköljningen en gång i veckan i stället för balsam, eller efter hårinpackningen i behandling 36.",
          "Byt rosmarinen mot kamomill för ljust hår, eller mot mynta för en svalare känsla i hårbotten."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Håll ögonen stängda, vinäger svider. Får du det i ögat, skölj med ljummet vatten.",
          "Späd alltid vinägern. Outspädd vinäger kan irritera hårbotten.",
          "Använd inte sköljningen på en irriterad eller sårig hårbotten.",
          "Gör sköljningen färsk varje gång, den håller sig inte."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "79-mjukgorande-handmask",
    "title": "Mjukgörande handmask på övermogen avokado och olivolja",
    "description": "Avokadon som hann bli för mogen, en sked olivolja och ett par bomullsvantar. Den mosade avokadon masseras in i torra vinterhänder och får verka under värmande vantar medan du vilar. Händerna blir mjuka som efter en manikyr, för en bråkdel av priset.",
    "image": "assets/recipes/79-mjukgorande-handmask.webp",
    "cardImage": "assets/recipes/79-mjukgorande-handmask-card.webp",
    "alt": "Mjukgörande handmask på övermogen avokado och olivolja",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "20 min",
      "Räcker till": "1 behandling",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Hands",
      "Natural",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "½ övermogen avokado"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 par rena bomullsvantar, eller två plastpåsar och en handduk"
          }
        ]
      }
    ],
    "directions": [
      "Mosa avokadon helt slät med en gaffel och rör ner olivoljan.",
      "Tvätta händerna med tvål och ljummet vatten och torka dem.",
      "Massera in masken i händerna i 2–3 minuter: handflator, ovansidor, mellan fingrarna och runt nagelbanden.",
      "Dra på bomullsvantarna, eller trä plastpåsar över händerna och linda en varm handduk runt. Värmen hjälper huden att ta upp oljan.",
      "Vila i 20 minuter.",
      "Ta av vantarna och torka av det mesta av masken med hushållspapper. Skölj händerna i ljummet vatten och klappa torrt. Avsluta med handkräm om du har."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Mosa avokadon i en liten skål av trä eller keramik och ställ den på en bricka med en sked, en handduk och bomullsvantarna.",
          "Lägg handduken på elementet en stund innan, så är den varm när du behöver den.",
          "Gör masken på kvällen framför en film, då går tjugo minuter fort.",
          "Rester av masken kan du massera in i fötterna efter fotbadet i behandling 35."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Gör ett lapptest om du har känslig hud, och använd inte masken om du är allergisk mot avokado. Den som är allergisk mot latex reagerar ibland även på avokado.",
          "Använd inte masken på sår, sprickor eller eksem.",
          "Använd avokado som är mjuk men inte har börjat mögla eller lukta unket.",
          "Gör masken precis innan du ska använda den, den mörknar snabbt."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "80-mjolk-och-honungsbad",
    "title": "Mjölk- och honungsbad med apelsinskal",
    "description": "En liter mjölk, några skedar honung och skalen från fruktskålens apelsiner. Allt rörs ut i ett varmt bad, där mjölken gör vattnet silkeslent och skalen flyter som små gyllene båtar. Kleopatras berömda mjölkbad, gjort på vanliga varor ur kylskåpet.",
    "image": "assets/recipes/80-mjolk-och-honungsbad.webp",
    "cardImage": "assets/recipes/80-mjolk-och-honungsbad-card.webp",
    "alt": "Mjölk- och honungsbad med apelsinskal",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Verkningstid": "15–20 min",
      "Räcker till": "1 bad",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Body",
      "Bath",
      "Relaxing",
      "Natural",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 30,
    "timeLabel": "25–30 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 liter mjölk, gärna standardmjölk",
            "key": "mjolk"
          },
          {
            "name": "3 msk flytande honung"
          },
          {
            "name": "2 msk olivolja (valfritt, för extra mjuk hud)",
            "key": "olja"
          },
          {
            "name": "Skal av 2 apelsiner, i remsor eller skivor",
            "key": "apelsin"
          },
          {
            "name": "1 kanelstång (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Värm mjölken i en kastrull till fingervarm, ca 40 grader. Den ska inte koka.",
      "Ta kastrullen från värmen och rör ner honungen tills den har löst sig. Rör ner olivoljan.",
      "Fyll badkaret med varmt vatten, ca 37–39 grader. Känn med handen eller armbågen.",
      "Häll i mjölkblandningen under rinnande vatten, så fördelar den sig jämnt och vattnet blir mjölkigt.",
      "Lägg i apelsinskalen och kanelstången.",
      "Bada i 15–20 minuter.",
      "Duscha av dig snabbt med ljummet vatten, klappa torrt och smörj in huden medan den fortfarande är lite fuktig."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Låt apelsinskalen flyta på ytan och lägg några extra skivor och en kanelstång på badkarskanten.",
          "Häll mjölkblandningen i en glaskaraff innan du bär in den i badrummet.",
          "Tänd några ljus, släck taklampan och ställ fram en kopp te och en mjuk handduk inom räckhåll.",
          "Har du inget badkar, gör ett fotbad: 2 dl mjölk, 1 msk honung och skalet från ½ apelsin i en balja med varmt vatten."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Olja och honung gör badkaret halt. Var försiktig när du kliver i och ur, och skölj ur badkaret direkt efteråt.",
          "Använd inte badet om du är allergisk mot mjölkprotein eller honung, eller har sår på huden.",
          "Citrusskal kan irritera känslig hud. Plocka upp skalen om det börjar klia eller svida.",
          "Ett för varmt bad kan göra dig yr. Håll vattnet under 40 grader och res dig långsamt."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "81-kylande-ansiktsisbitar",
    "title": "Kylande ansiktsisbitar med gurka, mynta och grönt te",
    "description": "En bit gurka, några myntablad och en kopp grönt te frysas till små, ljusgröna isbitar med blad och gurka infrusna som i glas. En isbit inlindad i en tunn tvättlapp glider över ansiktet på morgonen och får huden att kännas pigg och sval. Sociala mediers favoritknep, gjort i en vanlig isbitsform.",
    "image": "assets/recipes/81-kylande-ansiktsisbitar.webp",
    "cardImage": "assets/recipes/81-kylande-ansiktsisbitar-card.webp",
    "alt": "Kylande ansiktsisbitar med gurka, mynta och grönt te",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "10 min + 4 tim i frysen",
      "Verkningstid": "1–2 min",
      "Räcker till": "ca 12 isbitar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Face",
      "Refreshing",
      "Natural",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 252,
    "timeLabel": "4 tim 11–12 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 påse grönt te, gärna en redan använd"
          },
          {
            "name": "2 dl kokande vatten"
          },
          {
            "name": "¼ gurka",
            "key": "gurka"
          },
          {
            "name": "12 små myntablad",
            "key": "orter"
          },
          {
            "name": "1 tunn, ren tvättlapp eller bomullsduk"
          }
        ]
      }
    ],
    "directions": [
      "Låt tepåsen dra i det kokande vattnet i 3 minuter. Ta upp påsen och låt teet svalna helt.",
      "Skär 12 små, tunna gurkbitar. Mixa resten av gurkan slät med en stavmixer och pressa saften genom en sil. Du behöver ca 1 dl gurksaft.",
      "Blanda teet och gurksaften.",
      "Lägg ett myntablad och en gurkbit i varje fack i en isbitsform. Häll i vätskan och frys i minst 4 timmar.",
      "Tvätta ansiktet på morgonen.",
      "Lägg en isbit i tvättlappen och glid den lätt över ansiktet i små cirklar, från mitten och utåt: panna, kinder, käklinje och under ögonen. Håll den aldrig stilla på samma ställe.",
      "Efter 1–2 minuter, klappa huden torr och fortsätt med din vanliga ansiktskräm."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Använd en isbitsform i silikon, så blir isbitarna jämna och lätta att ta loss.",
          "Lägg några isbitar i en kall glasskål med en tvättlapp bredvid, på en bricka i badrummet.",
          "Gör isbitarna i en större omgång och förvara dem i en fryspåse, där håller de i ca en månad.",
          "Perfekt efter ångbadet i behandling 77, eller en morgon när du har sovit för lite."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Låt aldrig isen ligga direkt mot huden, och håll den i rörelse. För lång kyla kan ge köldskador.",
          "Använd inte behandlingen om du har rosacea, köldallergi, eksem eller trasig hud.",
          "Håll isen en bit från ögonen och låt inget smältvatten rinna in i dem.",
          "Använd en ren tvättlapp varje gång."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "82-brusande-badbomber",
    "title": "Brusande badbomber med vanilj och kamomill",
    "description": "Bikarbonat, citronsyra och potatismjöl ur bakskåpet, och innehållet i en påse kamomillte. Allt pressas till runda, pastellfärgade bomber med små gyllene blommor på toppen, som brusar och doftar vanilj när de möter badvattnet. Ser ut som från en dyr skönhetsbutik och är ett perfekt pyssel en regnig söndag.",
    "image": "assets/recipes/82-brusande-badbomber.webp",
    "cardImage": "assets/recipes/82-brusande-badbomber-card.webp",
    "alt": "Brusande badbomber med vanilj och kamomill",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "20 min + 1 dygns torkning",
      "Verkningstid": "15–20 min i badet",
      "Räcker till": "ca 6 bomber",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Bath",
      "Family friendly",
      "Make ahead",
      "Gift",
      "Budget"
    ],
    "time": 1480,
    "timeLabel": "35–40 min + torktid",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 dl bikarbonat (ca 200 g)"
          },
          {
            "name": "1 dl citronsyra"
          },
          {
            "name": "1 dl potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "1 msk vaniljsocker",
            "key": "kryddor"
          },
          {
            "name": "3 msk rapsolja eller smält kokosolja",
            "key": "olja"
          },
          {
            "name": "Några droppar karamellfärg (valfritt)"
          },
          {
            "name": "Innehållet i 1 påse kamomillte"
          },
          {
            "name": "Vatten i en sprayflaska",
            "basic": true
          },
          {
            "name": "1 muffinsform i silikon eller några små formar"
          }
        ]
      }
    ],
    "directions": [
      "Blanda bikarbonat, citronsyra, potatismjöl och vaniljsocker i en torr skål. Krossa eventuella klumpar med fingrarna.",
      "Rör ihop oljan och karamellfärgen i en liten skål.",
      "Ringla oljan över pulvret lite i taget och arbeta in den med fingrarna. Blandningen ska kännas som fuktig sand.",
      "Spraya 2–3 gånger med vatten och blanda snabbt. Kläm ihop en näve: håller den formen är den klar. Spraya lite i taget, för mycket vatten startar brusandet för tidigt.",
      "Strö lite kamomill i botten av formarna. Packa blandningen hårt i formarna och tryck till ordentligt.",
      "Låt bomberna torka i formarna i 4 timmar. Knacka sedan försiktigt ut dem och låt dem torka ett dygn till på ett bakplåtspapper."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Lägg badbomberna i en glasburk eller en papperspåse med silkespapper, så blir de en fin present.",
          "Gör några omgångar i olika färger och varva dem i en ask, som praliner.",
          "Släpp ner en bomb i ett varmt bad och se den brusa och sprida doft och färg.",
          "Har du inget badkar, använd en halv bomb i fotbadet i behandling 35."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Citronsyra svider i ögon och på sår. Tvätta händerna efteråt, och låt barn bara hjälpa till med en vuxen bredvid.",
          "Förvara bomberna torrt och utom räckhåll för små barn, som kan tro att de är godis.",
          "Använd bara några droppar färg, annars kan badkar och handdukar färgas.",
          "Oljan gör badkaret halt. Skölj ur det direkt efteråt.",
          "Bomberna håller i ca 3 månader i en lufttät burk."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "83-varmande-massageolja",
    "title": "Värmande massageolja med kardemumma och vanilj",
    "description": "En flaska rapsolja, en näve kardemummakapslar och vaniljstången som blev över efter bakningen. Kryddorna får dra i oljan på låg värme tills den doftar som en nybakad kardemummabulle. Oljan masseras in i axlar, armar och ben, gärna direkt efter badet. Spamassage på skafferiets vanligaste varor.",
    "image": "assets/recipes/83-varmande-massageolja.webp",
    "cardImage": "assets/recipes/83-varmande-massageolja-card.webp",
    "alt": "Värmande massageolja med kardemumma och vanilj",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "10 min + 1 tim i vattenbad + 1 dygns dragtid",
      "Verkningstid": "10–15 min massage",
      "Räcker till": "ca 2 dl",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Body",
      "Relaxing",
      "Leftovers",
      "Zero waste",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 1525,
    "timeLabel": "1 tim 20–25 min + dragtid",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 dl kallpressad rapsolja eller olivolja"
          },
          {
            "name": "10 kardemummakapslar"
          },
          {
            "name": "1 urskrapad vaniljstång från bakningen, eller 1 hel"
          },
          {
            "name": "1 ren glasflaska eller burk med lock"
          }
        ]
      }
    ],
    "directions": [
      "Krossa kardemummakapslarna lätt i en mortel eller med botten av ett glas. Klipp vaniljstången i bitar.",
      "Lägg kryddorna i en värmetålig glasburk och häll över oljan.",
      "Ställ burken i en kastrull med vatten som når halvvägs upp och värm på lägsta värme i 1 timme. Vattnet ska vara varmt men inte sjuda.",
      "Ta upp burken och låt oljan dra i rumstemperatur i ett dygn.",
      "Sila oljan genom ett kaffefilter eller en fin sil ner i en ren flaska.",
      "Värm lite olja mellan händerna och massera in den med långa, lugna tag, gärna på hud som fortfarande är lite fuktig efter dusch eller bad."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Häll oljan i en liten glasflaska med kork och lägg en hel kardemummakapsel och en bit vaniljstång i botten, för syns skull.",
          "Knyt ett linnesnöre runt flaskhalsen, så blir den en fin present tillsammans med kaffeskrubben i behandling 34.",
          "Ställ flaskan i en skål med varmt vatten några minuter före massagen, så känns oljan lyxigare.",
          "Passar perfekt efter mjölkbadet i behandling 80."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Gör ett lapptest först, kryddor kan irritera känslig hud.",
          "Använd inte oljan i ansiktet om du lätt får finnar, och inte på trasig hud.",
          "Oljan gör golv och badkar hala. Torka upp spill direkt.",
          "Förvara oljan svalt och mörkt och använd den inom 2–3 månader. Släng den om den luktar härsket."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "84-torrschampo",
    "title": "Torrschampo av potatismjöl och kakao",
    "description": "Ett paket potatismjöl och lite kakao. Pulvret pudras på hårbotten med en stor, mjuk borste, suger upp fettet och ger håret lyft och fräschör en dag till. Ett riktigt nödknep, i en vacker burk som får stå framme i badrummet.",
    "image": "assets/recipes/84-torrschampo.webp",
    "cardImage": "assets/recipes/84-torrschampo-card.webp",
    "alt": "Torrschampo av potatismjöl och kakao",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "5 min",
      "Räcker till": "ca 10 användningar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Hair",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": 10,
    "timeLabel": "10 min",
    "ingredientSections": [
      {
        "title": "Ljust hår",
        "items": [
          {
            "name": "4 msk potatismjöl",
            "key": "potatismjol"
          }
        ]
      },
      {
        "title": "Mellanbrunt hår",
        "items": [
          {
            "name": "3 msk potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "1 msk kakao",
            "key": "kakao"
          }
        ]
      },
      {
        "title": "Mörkt hår",
        "items": [
          {
            "name": "2 msk potatismjöl",
            "key": "potatismjol"
          },
          {
            "name": "2 msk kakao",
            "key": "kakao"
          }
        ]
      },
      {
        "title": "Att använda",
        "items": [
          {
            "name": "1 stor, mjuk puderborste"
          },
          {
            "name": "1 liten burk med lock, gärna en kryddburk med strölock"
          }
        ]
      }
    ],
    "directions": [
      "Blanda potatismjöl och kakao i en skål tills färgen är helt jämn. Sikta gärna blandningen så att den blir extra fin.",
      "Fyll pulvret i en liten burk.",
      "Dela håret i sektioner. Doppa borsten i pulvret, knacka av överskottet och pudra lätt längs hårbotten, där håret är fetast.",
      "Vänta 5 minuter så att pulvret hinner suga upp fettet.",
      "Massera hårbotten med fingertopparna och borsta sedan igenom håret ordentligt, tills inget pulver syns."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Fyll pulvret i en kryddburk av glas med strölock, eller en gammal puderdosa.",
          "Ställ burken och borsten på en liten bricka i badrummet.",
          "Börja med lite. Det är lättare att lägga på mer än att borsta ur för mycket.",
          "Fyll en liten dosa till handväskan eller resväskan."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Torrschampo ersätter inte hårtvätt. Tvätta håret som vanligt efter en eller två dagar.",
          "Kakao kan färga av sig på ljusa kläder och örngott. Borsta ur noga.",
          "Andas inte in pulvret, och pudra inte nära ögonen.",
          "Använd inte torrschampot på en irriterad hårbotten."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "85-fotnattinpackning",
    "title": "Nattinpackning för torra fötter med kokosolja och ullsockor",
    "description": "En burk kokosolja, en skvätt olivolja och ett par gamla ullsockor. Fötterna blötläggs, masseras med en mjuk, vaniljdoftande kräm och packas in i sockor över natten. På morgonen är hälarna mjuka som efter en pedikyr. Samlingens enklaste behandling, eftersom den gör jobbet medan du sover.",
    "image": "assets/recipes/85-fotnattinpackning.webp",
    "cardImage": "assets/recipes/85-fotnattinpackning-card.webp",
    "alt": "Nattinpackning för torra fötter med kokosolja och ullsockor",
    "meals": [
      "spa"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Verkningstid": "över natten",
      "Räcker till": "3–4 behandlingar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Feet",
      "Natural",
      "Overnight",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "10 min + över natten",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 msk kokosolja"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 krm vaniljsocker (valfritt, för doften)",
            "key": "kryddor"
          },
          {
            "name": "1 par tunna bomullssockor"
          },
          {
            "name": "1 par ullsockor"
          }
        ]
      }
    ],
    "directions": [
      "Smält kokosoljan försiktigt och rör ner olivoljan och vaniljsockret. Häll blandningen i en liten burk och låt den stelna till en mjuk kräm.",
      "Blötlägg fötterna i en balja med varmt vatten i 10 minuter, gärna som fotbadet i behandling 35.",
      "Torka fötterna noga, även mellan tårna.",
      "Ta en klick av krämen och massera in den i hälar, fotsulor och runt tårna i några minuter per fot.",
      "Dra på bomullssockorna och sedan ullsockorna ovanpå.",
      "Sov med sockorna på. Ta av dem på morgonen och torka bort det sista av oljan med en handduk."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Fyll krämen i en liten glasburk med lock och ställ den vid sängen tillsammans med sockorna.",
          "Vik sockorna och lägg dem i en liten korg med en handduk, som på ett hotell.",
          "Gör behandlingen två eller tre kvällar i rad när hälarna är som torrast, sedan en gång i veckan.",
          "Använd gamla sockor, oljan kan lämna fläckar."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Gå inte barfota på golvet med oljiga fötter, du kan halka.",
          "Har du diabetes, dålig cirkulation eller sår på fötterna, fråga vården innan du använder fotbad och värmande inpackningar.",
          "Djupa sprickor i hälarna eller fotsvamp ska inte behandlas med olja. Fråga på apoteket eller i vården.",
          "Förvara krämen svalt, kokosolja smälter vid ca 24 grader."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Gör ett lapptest innan du provar något nytt: stryk lite på insidan av underarmen och vänta ett dygn."
  },
  {
    "id": "86-paron-och-vaniljsylt",
    "title": "Päron- och vaniljsylt med kardemumma",
    "description": "De mjuka päronen längst ner i fruktskålen, en citron och en vaniljstång kokas till en gyllene, genomskinlig sylt med små mjuka fruktbitar och doft av nystött kardemumma. Den lyser som bärnsten i burken. Perfekt till ost, gröt och nygräddade scones, och en självklar julklapp.",
    "image": "assets/recipes/86-paron-och-vaniljsylt.webp",
    "cardImage": "assets/recipes/86-paron-och-vaniljsylt-card.webp",
    "alt": "Päron- och vaniljsylt med kardemumma",
    "meals": [
      "preserves"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "20 min",
      "Portioner": "ca 1 liter (4 burkar à 2½ dl)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Jam",
      "Leftovers",
      "Gift",
      "Budget"
    ],
    "time": 40,
    "timeLabel": "40 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 kg mjuka päron (ca 6 st)",
            "key": "paron"
          },
          {
            "name": "Saft av 1 citron",
            "key": "citron"
          },
          {
            "name": "½ dl vatten",
            "basic": true
          },
          {
            "name": "1 vaniljstång, eller 2 tsk vaniljsocker",
            "key": "kryddor"
          },
          {
            "name": "1 tsk nystött kardemumma"
          },
          {
            "name": "5 dl syltsocker (ca 450 g)"
          }
        ]
      }
    ],
    "directions": [
      "Ställ en tallrik i frysen till geléprovet. Diska och skålla burkarna.",
      "Skala och kärna ur päronen och skär dem i små tärningar, ca 1 cm. Vänd tärningarna direkt i citronsaften så att de inte mörknar. Du ska ha ca 800 g frukt.",
      "Dela vaniljstången på längden och skrapa ur fröna.",
      "Lägg päron, citronsaft, vatten, vaniljstång och vaniljfrön i en vid kastrull med tjock botten. Låt sjuda under lock i 8–10 minuter, tills päronen är mjuka. Mosa en del av bitarna med en potatisstöt, men låt hälften vara kvar.",
      "Rör ner syltsocker och kardemumma. Koka upp under omrörning och låt koka kraftigt i 5 minuter, eller enligt syltsockrets förpackning.",
      "Gör ett geléprov: droppa lite sylt på den kalla tallriken och vänta en minut. Skrynklar sig ytan när du drar ett finger genom den är sylten klar. Koka annars någon minut till och prova igen.",
      "Ta upp vaniljstången och skumma av ytan. Fyll de varma burkarna nästan ända upp och skruva på locken direkt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Klipp vaniljstången i bitar och stick ner en i varje burk, det syns fint genom glaset.",
          "Lägg en bit linnetyg eller bakplåtspapper över locket och knyt ett snöre runt.",
          "Servera till lagrad ost och knäckebröd, till fröknäcket i recept 61, eller på gröt och yoghurt.",
          "Oöppnade burkar håller ca 6 månader i ett svalt skafferi. En öppnad burk håller 3–4 veckor i kylen."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Diska burkar, flaskor och lock noga och skålla dem med kokande vatten precis före användning, eller värm glaset i ugnen på 125 grader i 10 minuter. Fyll dem medan innehållet är varmt och skruva på locket direkt. Förvara öppnade burkar i kylen och använd alltid en ren sked."
  },
  {
    "id": "87-apelsinmarmelad",
    "title": "Apelsinmarmelad med tunt skurna skal",
    "description": "Tre apelsiner och en citron ur fruktskålen, socker och lite tålamod. Skalen skärs i tunna strimlor och kokas tills de blir mjuka och genomskinliga, svävande i en klar, gyllene gelé. Bittersöt brittisk frukostmarmelad som lyser som solsken på frukostbordet.",
    "image": "assets/recipes/87-apelsinmarmelad.webp",
    "cardImage": "assets/recipes/87-apelsinmarmelad-card.webp",
    "alt": "Apelsinmarmelad med tunt skurna skal",
    "meals": [
      "preserves"
    ],
    "metadata": {
      "Förberedelse": "30 min",
      "Tillagning": "2 tim",
      "Portioner": "ca 9 dl (3–4 burkar)",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Marmalade",
      "Zero waste",
      "Gift"
    ],
    "time": 150,
    "timeLabel": "2 tim 30 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 apelsiner (ca 700 g), gärna ekologiska",
            "key": "apelsin"
          },
          {
            "name": "1 citron",
            "key": "citron"
          },
          {
            "name": "1 liter vatten",
            "basic": true
          },
          {
            "name": "8 dl strösocker (ca 700 g)",
            "key": "socker"
          },
          {
            "name": "1 bit gasväv eller ett teefilter till kärnorna"
          }
        ]
      }
    ],
    "directions": [
      "Skrubba frukten. Dela apelsinerna och citronen på mitten och pressa ur saften. Spara kärnorna, de innehåller pektin som får marmeladen att stelna. Knyt in kärnorna och hinnorna från pressen i gasväven.",
      "Dela skalhalvorna och skär dem i tunna strimlor, ca 2 mm. Den vita hinnan får sitta kvar.",
      "Lägg skal, saft, vatten och kärnpåsen i en stor kastrull. Låt sjuda under lock i ca 1½ timme, tills skalen är helt mjuka och går att mosa mellan fingrarna. Skalen mjuknar inte mer när sockret väl är i.",
      "Ställ en tallrik i frysen till geléprovet. Lyft upp kärnpåsen och krama ur den över kastrullen med en sked.",
      "Tillsätt sockret och rör på låg värme tills det har löst sig.",
      "Höj värmen och låt marmeladen koka kraftigt utan lock i 15–25 minuter, tills den håller 104–105 grader på en termometer eller klarar geléprovet: en droppe på den kalla tallriken ska skrynkla sig när du drar ett finger genom den. Rör då och då längs botten.",
      "Ta kastrullen från värmen och låt stå i 10 minuter, så att skalen fördelar sig jämnt och inte flyter upp. Rör om, fyll varma burkar och skruva på locken direkt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Fyll marmeladen i små, raka glasburkar, så att skalstrimlorna syns genom glaset.",
          "Servera på rostat bröd med salt smör, till filmjölksscones (recept 60) eller till lagrad ost.",
          "En sked marmelad blir en blank glasyr på julskinkan.",
          "Har marmeladen inte stelnat efter ett dygn, häll tillbaka den i kastrullen och koka några minuter till.",
          "Vill du vara säker på att den stelnar, byt strösockret mot syltsocker och följ förpackningens koktid.",
          "Oöppnade burkar håller ca 6 månader i ett svalt skafferi. En öppnad burk håller ca 1 månad i kylen."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Diska burkar, flaskor och lock noga och skålla dem med kokande vatten precis före användning, eller värm glaset i ugnen på 125 grader i 10 minuter. Fyll dem medan innehållet är varmt och skruva på locket direkt. Förvara öppnade burkar i kylen och använd alltid en ren sked."
  },
  {
    "id": "88-svartvinbarsglogg",
    "title": "Glöggsaft på frysta svartvinbär",
    "description": "En påse frysta svartvinbär och kryddhyllans kanel, nejlika, kardemumma och ingefära kokas till en djupt mörkröd, kryddig saft som doftar jul. Späd den med hett vatten och servera med russin och mandel, så har du alkoholfri glögg på en minut. I en vacker flaska blir den adventstidens finaste värdinnepresent.",
    "image": "assets/recipes/88-svartvinbarsglogg.webp",
    "cardImage": "assets/recipes/88-svartvinbarsglogg-card.webp",
    "alt": "Glöggsaft på frysta svartvinbär",
    "meals": [
      "preserves",
      "drink"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "20 min + 30 min dragtid",
      "Portioner": "ca 1 liter saft (ca 3 liter färdig glögg)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Cordial",
      "Alcohol free",
      "Christmas",
      "Make ahead",
      "Gift",
      "Budget"
    ],
    "time": 60,
    "timeLabel": "1 tim",
    "ingredientSections": [
      {
        "title": "Saft",
        "items": [
          {
            "name": "1 liter frysta svartvinbär (ca 500 g)",
            "key": "svartvinbar"
          },
          {
            "name": "7 dl vatten",
            "basic": true
          },
          {
            "name": "2 kanelstänger"
          },
          {
            "name": "8 hela nejlikor"
          },
          {
            "name": "5 kardemummakapslar, lätt krossade"
          },
          {
            "name": "3 cm färsk ingefära, skivad"
          },
          {
            "name": "Skal av 1 apelsin, i remsor",
            "key": "apelsin"
          },
          {
            "name": "1 stjärnanis (valfritt)"
          },
          {
            "name": "ca 5 dl strösocker per liter silad saft",
            "key": "socker"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Russin"
          },
          {
            "name": "Skållad mandel"
          }
        ]
      }
    ],
    "directions": [
      "Lägg bär, vatten och alla kryddor i en kastrull. Koka upp och låt sjuda under lock i 15 minuter. Mosa bären lätt med en potatisstöt.",
      "Ta kastrullen från värmen och låt dra i 30 minuter, så blir kryddsmaken djupare.",
      "Sila genom en sil klädd med en ren kökshandduk eller ett kaffefilter. Låt saften rinna igenom i lugn och ro och pressa inte för hårt, då blir den grumlig.",
      "Mät saften och häll tillbaka den i kastrullen. Tillsätt 5 dl socker per liter saft och värm under omrörning tills sockret har löst sig. Låt den bara precis koka upp.",
      "Skumma av ytan och häll den varma saften i skållade flaskor. Skruva på korken direkt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Späd 1 del saft med 2 delar hett vatten och servera i små glas eller koppar med några russin och mandlar i botten.",
          "Ställ flaskan på bordet med en kanelstång och en apelsinskalsremsa i halsen, eller knyt ett band runt den och ge bort den.",
          "För vinglögg, blanda 1 del saft med 2 delar rött vin och värm utan att koka.",
          "Saften går också att använda till glöggpäronen i recept 64.",
          "Saften håller ca 1 månad i kylen. Frys den i plastflaskor, med lite plats kvar upptill, så håller den i ett år."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Diska burkar, flaskor och lock noga och skålla dem med kokande vatten precis före användning, eller värm glaset i ugnen på 125 grader i 10 minuter. Fyll dem medan innehållet är varmt och skruva på locket direkt. Förvara öppnade burkar i kylen och använd alltid en ren sked."
  },
  {
    "id": "89-bostongurka",
    "title": "Bostongurka på slokiga gurkor och paprika",
    "description": "Gurkorna som börjat slokna i grönsakslådan, en röd paprika och två lökar. Allt finhackas, saltas och kokas i en söt och syrlig lag med senapsfrön och gurkmeja till en lysande gul, krispig relish. Korvkioskens klassiker, betydligt godare hemmagjord.",
    "image": "assets/recipes/89-bostongurka.webp",
    "cardImage": "assets/recipes/89-bostongurka-card.webp",
    "alt": "Bostongurka på slokiga gurkor och paprika",
    "meals": [
      "preserves"
    ],
    "metadata": {
      "Förberedelse": "30 min + 4 tim saltning",
      "Tillagning": "10 min",
      "Portioner": "ca 1 liter (4 burkar à 2½ dl)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Pickles",
      "Swedish",
      "Make ahead",
      "Leftovers",
      "Budget"
    ],
    "time": 280,
    "timeLabel": "4 tim 40 min",
    "ingredientSections": [
      {
        "title": "Grönsaker",
        "items": [
          {
            "name": "1 kg gurka (ca 2 slanggurkor)",
            "key": "gurka"
          },
          {
            "name": "2 gula lökar",
            "key": "lok"
          },
          {
            "name": "1 röd paprika",
            "key": "paprika"
          },
          {
            "name": "½ dl salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Lag",
        "items": [
          {
            "name": "3 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1½ dl ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "1½ dl vatten",
            "basic": true
          },
          {
            "name": "1 msk gula senapsfrön"
          },
          {
            "name": "1 tsk malen gurkmeja",
            "key": "kryddor"
          },
          {
            "name": "1 krm malen vitpeppar",
            "basic": true
          },
          {
            "name": "1 msk majsstärkelse, t.ex. Maizena"
          },
          {
            "name": "2 msk kallt vatten",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Dela gurkorna på längden och skrapa ur kärnorna med en tesked. Finhacka gurkan i små tärningar, ca ½ cm. Finhacka löken och paprikan lika smått.",
      "Blanda grönsakerna med saltet i en stor skål. Täck och låt stå i kylen i minst 4 timmar, gärna över natten. Saltet drar ut vätskan, så att relishen blir krispig.",
      "Häll grönsakerna i en sil, skölj snabbt med kallt vatten och krama ur dem ordentligt, gärna i en ren kökshandduk.",
      "Koka upp socker, ättika, vatten, senapsfrön, gurkmeja och vitpeppar i en stor kastrull.",
      "Lägg i grönsakerna, låt koka upp och sjud i 2–3 minuter.",
      "Rör ut majsstärkelsen i det kalla vattnet och rör ner det i kastrullen. Låt sjuda under omrörning i 1 minut, tills lagen har tjocknat och blivit blank.",
      "Fyll de varma burkarna och skruva på locken direkt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Fyll bostongurkan i små glasburkar, så att de gula, gröna och röda bitarna syns genom glaset.",
          "Servera till grillad korv, köttbullar, hamburgare eller köttfärslimpan i recept 72.",
          "Den blir godast efter ett par dagar, när smakerna har satt sig.",
          "Förvara burkarna i kylen, där håller de i ca 3 månader. En öppnad burk håller ca 1 månad.",
          "Gurkmeja färgar, så skölj kastrull och slev direkt."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Diska burkar, flaskor och lock noga och skålla dem med kokande vatten precis före användning, eller värm glaset i ugnen på 125 grader i 10 minuter. Fyll dem medan innehållet är varmt och skruva på locket direkt. Förvara öppnade burkar i kylen och använd alltid en ren sked."
  },
  {
    "id": "90-rodbetsagg",
    "title": "Rosa inlagda ägg i rödbetslag",
    "description": "Lagen som blev kvar i rödbetsburken och ett halvdussin ägg. Äggen får ligga i den söta, syrliga lagen i kylen tills vitan blivit klart cerise, och när de delas syns en rosa ring runt den gyllene gulan. Lika vackra på påskbordet som på julbordet, och ett perfekt sätt att ta vara på lagen.",
    "image": "assets/recipes/90-rodbetsagg.webp",
    "cardImage": "assets/recipes/90-rodbetsagg-card.webp",
    "alt": "Rosa inlagda ägg i rödbetslag",
    "meals": [
      "preserves",
      "party"
    ],
    "metadata": {
      "Förberedelse": "10 min + 1–3 dygn i kylen",
      "Tillagning": "10 min",
      "Portioner": "6 ägg",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Dairy free",
      "Gluten free",
      "Pickles",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 4340,
    "timeLabel": "20 min + 1–3 dygn",
    "ingredientSections": [
      {
        "title": "Ägg",
        "items": [
          {
            "name": "6 ägg",
            "key": "agg"
          },
          {
            "name": "Lagen från 1 burk inlagda rödbetor (ca 3 dl) och några av rödbetorna"
          },
          {
            "name": "½ rödlök, i ringar",
            "key": "lok"
          },
          {
            "name": "1 lagerblad"
          },
          {
            "name": "5 hela kryddpepparkorn"
          }
        ]
      },
      {
        "title": "Om lagen inte räcker",
        "items": [
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "1 msk ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 msk majonnäs eller crème fraiche",
            "key": "majo"
          },
          {
            "name": "Några dillkvistar"
          },
          {
            "name": "Flingsalt",
            "basic": true
          },
          {
            "name": "Svartpeppar",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Lägg äggen i kokande vatten och koka i 9 minuter. Kyl dem direkt i kallt vatten och skala dem.",
      "Lägg äggen i en ren glasburk, ca 1 liter, tillsammans med några rödbetsskivor, rödlöksringarna, lagerbladet och kryddpepparn.",
      "Häll över rödbetslagen så att äggen täcks helt. Räcker den inte, rör ihop vatten, ättika och socker och fyll på.",
      "Skruva på locket och ställ burken i kylen. Efter 1 dygn har vitan en rosa kant, efter 3 dygn är den rosa ända in till gulan."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Dela äggen på längden precis före servering, så att den rosa ringen syns skarp mot gulan.",
          "Lägg dem på ett fat med en liten klick majonnäs, dillkvistar, flingsalt och nymald svartpeppar.",
          "Fyll dem med gubbröra som ägghalvorna i recept 55, så får du ett rosa mingelfat.",
          "Skiva dem på smørrebrød (recept 20) eller hacka dem i en potatissallad.",
          "Förvara äggen i kylen hela tiden och ät dem inom en vecka."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Diska burkar, flaskor och lock noga och skålla dem med kokande vatten precis före användning, eller värm glaset i ugnen på 125 grader i 10 minuter. Fyll dem medan innehållet är varmt och skruva på locket direkt. Förvara öppnade burkar i kylen och använd alltid en ren sked."
  },
  {
    "id": "91-gronsaksbuljong",
    "title": "Grönsaksbuljong på skal och kanter",
    "description": "Lökskal, morotstoppar, purjolöksblast och persiljestjälkar samlas i en påse i frysen tills den är full. Då kokas allt till en klar, gyllene buljong som smakar mer än någon tärning och blir grunden i soppor, grytor och risotto. Gratis, gott och det mest hållbara receptet i hela samlingen.",
    "image": "assets/recipes/91-gronsaksbuljong.webp",
    "cardImage": "assets/recipes/91-gronsaksbuljong-card.webp",
    "alt": "Grönsaksbuljong på skal och kanter",
    "meals": [
      "basics"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "60 min",
      "Portioner": "ca 2 liter",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Make ahead",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 full fryspåse grönsaksrester (ca 500 g): skal och kanter av lök, morot, purjolök, selleri, palsternacka och svamp, och stjälkar av persilja och timjan"
          },
          {
            "name": "1 gul lök, med skal, delad",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor, krossade",
            "key": "vitlok"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 msk tomatpuré (valfritt, ger färg och djup)",
            "key": "tomatpure"
          },
          {
            "name": "2½ liter kallt vatten",
            "basic": true
          },
          {
            "name": "2 lagerblad"
          },
          {
            "name": "10 hela svartpepparkorn"
          }
        ]
      }
    ],
    "directions": [
      "Spara skal och kanter i en påse i frysen under veckan. Undvik kål, broccoli, potatisskal och rödbetor, som gör buljongen bitter, grumlig eller rosa.",
      "Fräs grönsaksresterna, löken och vitlöken i oljan i en stor kastrull på medelvärme i 5 minuter. Rör ner tomatpurén.",
      "Häll i det kalla vattnet, lagerbladen och pepparkornen. Koka upp och låt sjuda utan lock på låg värme i 45–60 minuter. Låt den inte koka kraftigt, då blir buljongen grumlig.",
      "Sila buljongen genom en sil klädd med en kökshandduk. Pressa inte grönsakerna, låt den rinna av i lugn och ro.",
      "Låt buljongen svalna och häll upp den i burkar eller fryspåsar. Salta den inte, salta rätten du använder den i."
    ],
    "extraSections": [
      {
        "title": "Användning och tips",
        "items": [
          "Använd buljongen i stället för vatten och buljongtärning, till exempel i ärtveloutén (recept 6), linssoppan (recept 32), potatis- och purjolökssoppan (recept 56) eller löksoppan (recept 57).",
          "Frys en del i isbitsformar, så har du små portioner till såser och risotto.",
          "Fyll inte glasburkar ända upp om de ska frysas, glaset kan spricka.",
          "Buljongen håller 4–5 dagar i kylen och ca 6 månader i frysen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "92-pajdeg",
    "title": "Frasig pajdeg med smör",
    "description": "Mjöl, kallt smör och några skedar isvatten. Degen nyps ihop på fem minuter och gräddas till ett frasigt, gyllene pajskal som håller för allt från kylskåpets sista grönsaker och ostbitar till en söt äppelpaj. Grundreceptet som gör rester till middag.",
    "image": "assets/recipes/92-pajdeg.webp",
    "cardImage": "assets/recipes/92-pajdeg-card.webp",
    "alt": "Frasig pajdeg med smör",
    "meals": [
      "basics",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "15 min + 40 min vila",
      "Tillagning": "17 min förgräddning",
      "Portioner": "1 pajskal, ca 24 cm",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 72,
    "timeLabel": "1 tim 12 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "125 g kallt smör",
            "key": "smor"
          },
          {
            "name": "2–3 msk iskallt vatten"
          },
          {
            "name": "Torkade bönor eller ris till förgräddningen",
            "key": "bonor"
          }
        ]
      }
    ],
    "directions": [
      "Blanda mjöl och salt. Skär smöret i små tärningar och nyp ihop det med mjölet med fingertopparna, eller kör kort i en matberedare, tills det ser ut som grova smulor. Arbeta snabbt så att smöret inte blir varmt.",
      "Tillsätt vattnet en matsked i taget och arbeta ihop till en deg. Knåda inte, då blir pajskalet segt.",
      "Platta till degen till en rund kaka, slå in den i plastfolie och låt den vila i kylen i 30 minuter.",
      "Sätt ugnen på 200 grader. Kavla ut degen ca 3 mm tjock på ett mjölat bakbord, eller mellan två bakplåtspapper. Klä en pajform med löstagbar botten, ca 24 cm, tryck in degen i hörnen och låt kanten hänga över lite.",
      "Nagga botten med en gaffel och ställ formen i frysen i 10 minuter. Kall deg krymper mindre i ugnen.",
      "Lägg ett bakplåtspapper i formen och fyll med torkade bönor eller ris. Grädda i nedre delen av ugnen i 12 minuter. Ta bort papper och bönor och grädda 5 minuter till, tills botten är torr och ljust gyllene.",
      "Skär bort den överhängande kanten med en vass kniv. Fyll och grädda vidare enligt ditt recept."
    ],
    "extraSections": [
      {
        "title": "Användning och tips",
        "items": [
          "Grundfyllning till en matpaj: vispa ihop 3 ägg, 3 dl mjölk eller grädde och 2 dl riven ost. Strö 2–3 dl rester i pajskalet, t.ex. broccoli, skinka, stekt lök eller champinjoner, häll över äggstanningen och grädda i 175 grader i 30–35 minuter.",
          "För en söt paj, byt saltet mot 1 msk strösocker.",
          "Nyp kanten i vågor med fingrarna innan förgräddningen, så ser pajen hemgjord och vacker ut.",
          "Degen håller 3 dagar i kylen och ca 3 månader i frysen. Bönorna kan sparas i en burk och användas igen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "93-pizzadeg",
    "title": "Pizzadeg med kall jäsning",
    "description": "Mjöl, vatten, en nypa jäst och salt. Degen jäser långsamt i kylen i ett till tre dygn och blir luftig, smakrik och lätt att forma, med krispig botten och bubbliga, lätt brända kanter. En deg, fyra pizzor och ett sätt att göra fredagsmys av kylskåpets rester.",
    "image": "assets/recipes/93-pizzadeg.webp",
    "cardImage": "assets/recipes/93-pizzadeg-card.webp",
    "alt": "Pizzadeg med kall jäsning",
    "meals": [
      "basics"
    ],
    "metadata": {
      "Förberedelse": "20 min + 1 tim jäsning + 1–3 dygn i kylen",
      "Tillagning": "6–8 min per pizza",
      "Portioner": "4 pizzor",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Italian",
      "Family friendly",
      "Make ahead",
      "Budget"
    ],
    "time": null,
    "timeLabel": "Jäsning i 1–3 dygn",
    "ingredientSections": [
      {
        "title": "Deg",
        "items": [
          {
            "name": "5 g färsk jäst (en tiondel av ett paket) eller ½ tsk torrjäst"
          },
          {
            "name": "2¾ dl kallt vatten",
            "basic": true
          },
          {
            "name": "7 dl vetemjöl special eller tipo 00 (ca 420 g)",
            "key": "vetemjol"
          },
          {
            "name": "1½ tsk salt",
            "basic": true
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Snabb tomatsås",
        "items": [
          {
            "name": "1 burk krossade eller passerade tomater (400 g)"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Smula ner jästen i vattnet och rör tills den har löst sig. Använder du torrjäst, blanda den med mjölet i stället.",
      "Tillsätt mjöl och salt och arbeta ihop till en deg. Knåda den på bakbordet i 8–10 minuter, tills den är slät och elastisk. Knåda in olivoljan de sista minuterna.",
      "Lägg degen i en oljad bunke, täck den och låt jäsa i rumstemperatur i 1 timme.",
      "Dela degen i 4 delar, ca 170 g var. Forma släta bollar genom att vika kanterna in mot mitten. Lägg dem i en oljad låda med lock.",
      "Ställ degbollarna i kylen i 24–72 timmar. Ju längre de står, desto mer smak.",
      "Ta fram degen 2 timmar före gräddningen. Ställ en plåt upp och ner, eller en baksten, på nedersta falsen och sätt ugnen på högsta värme, 250–275 grader, i minst 30 minuter.",
      "Rör ihop krossade tomater, olivolja och salt till såsen. Den ska inte kokas.",
      "Tryck ut en degboll med fingertopparna på ett mjölat bakbord, från mitten och utåt, och lämna en tjock kant. Dra den försiktigt till ca 28 cm. Använd inte kavel, den trycker ut luften.",
      "Lägg degen på ett bakplåtspapper, bred på ett tunt lager sås och din topping, och dra över pizzan till den heta plåten. Grädda i 6–8 minuter, tills kanten är bubblig och gyllene med mörka fläckar."
    ],
    "extraSections": [
      {
        "title": "Användning och tips",
        "items": [
          "Toppa med kylskåpets rester: ostkanter, skinka, stekt svamp, rostad lök eller resterna av söndagssteken.",
          "Ringla över chilioljan i recept 50 eller peston i recept 51 när pizzan kommer ut ur ugnen.",
          "Degbollarna kan frysas efter steg 4. Tina dem i kylen över natten.",
          "Snåla med toppingen, för mycket gör botten blöt."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "94-tacokrydda",
    "title": "Rökig tacokrydda i burk",
    "description": "Paprika, spiskummin, chili och oregano ur kryddhyllan blandas till en rökig, djupröd tacokrydda utan tillsatser, i en glasburk som räcker till många fredagar. Den smakar mer och saltar mindre än påsarna, och du bestämmer själv hur het den blir. I randiga lager i en hög burk blir den dessutom en fin present.",
    "image": "assets/recipes/94-tacokrydda.webp",
    "cardImage": "assets/recipes/94-tacokrydda-card.webp",
    "alt": "Rökig tacokrydda i burk",
    "meals": [
      "basics"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "0 min",
      "Portioner": "ca 2 dl (ca 5 tacomiddagar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Spice blend",
      "Mexican",
      "Make ahead",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 10,
    "timeLabel": "10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 msk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 msk rökt paprikapulver"
          },
          {
            "name": "3 msk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 msk chilipulver"
          },
          {
            "name": "1 msk torkad oregano",
            "key": "orter"
          },
          {
            "name": "1 msk vitlökspulver"
          },
          {
            "name": "1 msk lökpulver"
          },
          {
            "name": "1 msk salt",
            "basic": true
          },
          {
            "name": "2 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk svartpeppar",
            "basic": true
          },
          {
            "name": "1 msk majsstärkelse (valfritt, ger en krämigare sås)"
          }
        ]
      }
    ],
    "directions": [
      "Mät upp alla kryddor i en skål och krossa eventuella klumpar med baksidan av en sked.",
      "Rör om tills färgen är helt jämn, eller skaka allt i en burk med lock.",
      "Häll upp kryddan i en torr glasburk.",
      "Till tacofärs: bryn 500 g köttfärs, kycklingfärs eller sojafärs. Strö över 3 msk krydda och fräs i 1 minut. Häll i 1½ dl vatten och låt sjuda i 5 minuter, tills såsen har tjocknat."
    ],
    "extraSections": [
      {
        "title": "Användning och tips",
        "items": [
          "För en vegansk fredagstaco, mosa 2 burkar sköljda svarta bönor lätt och värm dem med kryddan och vattnet.",
          "Vill du ha en mildare krydda, halvera chilin. Vill du ha den hetare, tillsätt cayennepeppar.",
          "Kryddan är också god på rostad potatis och på kikärtorna i recept 53, i stället för rökt paprika och spiskummin.",
          "För en present, varva kryddorna i lager i en hög burk i stället för att blanda dem, och skriv på etiketten att burken ska skakas före användning.",
          "Lukta på kryddorna i skafferiet först. Gamla kryddor som tappat doften ger blek smak. Förvara burken mörkt och torrt och använd den inom ca 6 månader."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "95-allroundmarinad",
    "title": "Allroundmarinad med soja, honung, vitlök och ingefära",
    "description": "Soja, honung, vitlök och ingefära rörs ihop på två minuter till en söt, salt och djupt smakrik marinad som passar kyckling, fläsk, lax, tofu och grönsaker. Den sparade halvan kokas ihop till en blank glasyr som karamelliseras i pannan. Grundreceptet som får en vanlig vardagsmiddag att se ut som från en asiatisk grillrestaurang.",
    "image": "assets/recipes/95-allroundmarinad.webp",
    "cardImage": "assets/recipes/95-allroundmarinad-card.webp",
    "alt": "Allroundmarinad med soja, honung, vitlök och ingefära",
    "meals": [
      "basics"
    ],
    "metadata": {
      "Förberedelse": "5 min + marinering",
      "Tillagning": "5 min glasyr",
      "Portioner": "ca 2 dl, till 500–600 g kött, fisk eller tofu",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Dairy free",
      "Marinade",
      "Asian",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "10 min + marinering",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "2 msk flytande honung eller ljus sirap"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 msk äppelcidervinäger, risvinäger eller limesaft"
          },
          {
            "name": "2 vitlöksklyftor, finrivna",
            "key": "vitlok"
          },
          {
            "name": "2 cm färsk ingefära, finriven"
          },
          {
            "name": "1 tsk sesamolja (valfritt)"
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop alla ingredienser i en skål eller skaka dem i en burk med lock.",
      "Häll undan hälften av marinaden i en liten kastrull. Den blir glasyren.",
      "Lägg kött, fisk, tofu eller grönsaker i en fryspåse eller form, häll över resten av marinaden och vänd runt. Marinera i kylen: kyckling och fläsk 1–12 timmar, tofu minst 1 timme, lax högst 30 minuter.",
      "Torka av överflödig marinad och stek, grilla eller ugnsbaka som vanligt. Häll bort den marinad som har legat med det råa.",
      "Koka ihop den sparade halvan i 2–3 minuter, tills den är sirapsaktig. Pensla över glasyren de sista minuterna, så att ytan blir blank och karamelliserad."
    ],
    "extraSections": [
      {
        "title": "Användning och tips",
        "items": [
          "Avsluta med rostade sesamfrön och tunt skivad salladslök, och servera med ris och en krispig sallad.",
          "Ringla glasyren över stekt ris (recept 31) eller rostade grönsaker.",
          "Använd aldrig marinad som har legat med rått kött eller fisk som sås utan att koka den först.",
          "Byt honungen mot sirap för en vegansk marinad till tofu och grönsaker.",
          "Marinaden håller ca 1 vecka i kylen så länge den inte har varit i kontakt med något rått."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "96-smorknack",
    "title": "Smörknäck med mörk choklad och rostad mandel",
    "description": "Ett paket smör, socker och en skvätt vatten kokas till en djupt gyllene knäck som spricker med ett krasande ljud. Den täcks med smält mörk choklad, rostad mandel och flingsalt och bryts i stora, oregelbundna flak. Engelsk toffee som ser ut att komma från en dyr chokladbutik.",
    "image": "assets/recipes/96-smorknack.webp",
    "cardImage": "assets/recipes/96-smorknack-card.webp",
    "alt": "Smörknäck med mörk choklad och rostad mandel",
    "meals": [
      "candy"
    ],
    "metadata": {
      "Förberedelse": "10 min + 2 tim stelning",
      "Tillagning": "15 min",
      "Portioner": "ca 40 bitar",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Christmas",
      "Make ahead",
      "Gift"
    ],
    "time": 145,
    "timeLabel": "2 tim 25 min",
    "ingredientSections": [
      {
        "title": "Knäck",
        "items": [
          {
            "name": "200 g smör",
            "key": "smor"
          },
          {
            "name": "2½ dl strösocker (ca 210 g)",
            "key": "socker"
          },
          {
            "name": "3 msk vatten",
            "basic": true
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 tsk vaniljsocker",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "150 g mörk choklad",
            "key": "choklad"
          },
          {
            "name": "1 dl mandlar",
            "key": "mandel"
          },
          {
            "name": "1 tsk flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Rosta mandlarna i en torr stekpanna i 3–4 minuter och hacka dem fint. Hacka chokladen. Klä en plåt eller en form, ca 20 × 30 cm, med bakplåtspapper.",
      "Lägg smör, socker, vatten och salt i en kastrull med tjock botten. Smält på medelvärme under omrörning.",
      "Låt koka och rör ofta i 10–15 minuter, tills knäcken har fått färgen av mörk bärnsten och håller 150 grader på en sockertermometer. Utan termometer: droppa lite i ett glas kallt vatten. Den ska stelna direkt och gå att knäcka.",
      "Separerar smöret och lägger sig som en hinna, vispa snabbt ner 1 msk varmt vatten.",
      "Ta kastrullen från värmen, rör ner vaniljsockret och häll knäcken på pappret. Bred ut den till ca ½ cm tjocklek.",
      "Strö chokladen över den heta knäcken och vänta 3–5 minuter, tills den har smält. Bred ut chokladen jämnt med en slickepott.",
      "Strö över mandeln och flingsaltet. Låt stelna i rumstemperatur i minst 2 timmar och bryt sedan knäcken i bitar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bryt knäcken i stora, oregelbundna flak, så syns lagren av gyllene knäck och mörk choklad i brottytan.",
          "Lägg flaken i en glasburk eller en låda med bakplåtspapper mellan lagren.",
          "Servera till kaffe eller som en del av en konfektask med de andra recepten i kategorin.",
          "Kokhet knäck ger svåra brännskador. Låt barnen hjälpa till med toppingen, inte kokningen.",
          "Knäcken håller ca 2 veckor i en lufttät burk i rumstemperatur."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "97-chokladfudge",
    "title": "Chokladfudge med pepparkakssmulor och flingsalt",
    "description": "En burk sötad kondenserad mjölk, chokladkakorna i skafferiet och de sista pepparkakorna i burken. Allt smälts ihop till en tät, sammetslen fudge med knapriga pepparkaksbitar, som skärs i små, blanka rutor med flingsalt på toppen. Ingen termometer, ingen ugn, och klar på tio minuter innan kylen gör resten.",
    "image": "assets/recipes/97-chokladfudge.webp",
    "cardImage": "assets/recipes/97-chokladfudge-card.webp",
    "alt": "Chokladfudge med pepparkakssmulor och flingsalt",
    "meals": [
      "candy"
    ],
    "metadata": {
      "Förberedelse": "10 min + 3 tim i kylen",
      "Tillagning": "10 min",
      "Portioner": "ca 36 bitar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Christmas",
      "No bake",
      "Make ahead",
      "Leftovers",
      "Gift",
      "Beginner friendly"
    ],
    "time": 200,
    "timeLabel": "3 tim 20 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "350 g choklad, gärna hälften mörk och hälften mjölkchoklad"
          },
          {
            "name": "1 burk sötad kondenserad mjölk (397 g)"
          },
          {
            "name": "25 g smör",
            "key": "smor"
          },
          {
            "name": "1 tsk vaniljsocker",
            "key": "kryddor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "8 pepparkakor",
            "key": "pepparkakor"
          },
          {
            "name": "1 tsk flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Klä en form, ca 20 × 20 cm, med bakplåtspapper som når upp över kanterna.",
      "Krossa pepparkakorna grovt i en påse med en kavel. Spara en tredjedel till toppen.",
      "Hacka chokladen. Lägg choklad, kondenserad mjölk, smör, vaniljsocker och salt i en kastrull.",
      "Smält allt på låg värme under ständig omrörning, tills smeten är slät och blank. Låt det inte bli för varmt, då kan chokladen skära sig.",
      "Ta kastrullen från värmen och vänd ner två tredjedelar av pepparkakssmulorna.",
      "Bred ut fudgen i formen och jämna till ytan. Strö över resten av smulorna och flingsaltet och tryck lätt.",
      "Ställ formen i kylen i minst 3 timmar, tills fudgen är fast.",
      "Lyft upp fudgen med pappret och skär den i rutor, ca 3 × 3 cm, med en vass kniv som doppats i varmt vatten och torkats av mellan varje snitt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg fudgebitarna i små pappersformar, eller stapla dem i rader i en ask med bakplåtspapper emellan.",
          "Ta fram fudgen 15 minuter före servering, då blir den mjuk och sammetslen.",
          "Byt pepparkakorna mot hackade nötter, kanderade apelsinskal eller torkade tranbär.",
          "Fudgen håller ca 2 veckor i kylen i en lufttät burk och kan frysas."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "98-chokladtryfflar",
    "title": "Chokladtryfflar med apelsin, rullade i kakao",
    "description": "En kaka mörk choklad, en skvätt havregrädde och skalet från en apelsin. Ganachen rörs blank, kyls och rullas till små, ojämna tryfflar som får ett sammetslent täcke av kakao. Fransk konfekt som smälter på tungan, helt vegansk utan att någon märker det.",
    "image": "assets/recipes/98-chokladtryfflar.webp",
    "cardImage": "assets/recipes/98-chokladtryfflar-card.webp",
    "alt": "Chokladtryfflar med apelsin, rullade i kakao",
    "meals": [
      "candy"
    ],
    "metadata": {
      "Förberedelse": "20 min + 2 tim i kylen",
      "Tillagning": "5 min",
      "Portioner": "ca 25 tryfflar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Christmas",
      "Make ahead",
      "Gift"
    ],
    "time": 145,
    "timeLabel": "2 tim 25 min",
    "ingredientSections": [
      {
        "title": "Ganache",
        "items": [
          {
            "name": "200 g mörk choklad, 70 % (kontrollera att den är mjölkfri)",
            "key": "choklad"
          },
          {
            "name": "1 dl vispbar havregrädde"
          },
          {
            "name": "1 msk kokosolja"
          },
          {
            "name": "Fint rivet skal av 1 apelsin",
            "key": "apelsin"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Att rulla i",
        "items": [
          {
            "name": "3 msk kakao",
            "key": "kakao"
          },
          {
            "name": "2 msk finhackade rostade hasselnötter eller kokosflingor (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Hacka chokladen fint och lägg den i en skål.",
      "Värm havregrädden och kokosoljan i en liten kastrull tills det precis börjar sjuda.",
      "Häll den heta grädden över chokladen och låt stå orörd i 2 minuter.",
      "Rör från mitten och utåt med en slickepott, tills ganachen är slät och blank. Rör ner apelsinskal och salt.",
      "Täck skålen och ställ den i kylen i minst 2 timmar, tills ganachen är fast nog att forma.",
      "Ta upp små portioner med en tesked och rulla dem snabbt till kulor mellan kalla händer. De behöver inte vara perfekta, ojämna tryfflar ser mer hantverksmässiga ut.",
      "Rulla tryfflarna i kakao, eller i hasselnötter eller kokos för variation. Förvara dem i kylen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg tryfflarna i små pappersformar i en ask, gärna i blandade sorter.",
          "Ta fram dem 10 minuter före servering, då är de som krämigast.",
          "Byt apelsinskalet mot 1 msk starkt kaffe, en nypa kardemumma eller lite chili.",
          "Tryfflarna håller ca 1 vecka i kylen och 2 månader i frysen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "99-kokostoppar",
    "title": "Kokostoppar på överblivna äggvitor, doppade i choklad",
    "description": "De överblivna äggvitorna i kylen, en påse kokosflingor och lite socker. Smeten formas till små toppar som gräddas tills spetsarna blir gyllene och krispiga, med en seg, saftig insida. Botten doppas i mörk choklad. Mormors kakburkskaka i konfektaskens finkläder.",
    "image": "assets/recipes/99-kokostoppar.webp",
    "cardImage": "assets/recipes/99-kokostoppar-card.webp",
    "alt": "Kokostoppar på överblivna äggvitor, doppade i choklad",
    "meals": [
      "baking",
      "candy"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "15 min + 30 min stelning",
      "Portioner": "ca 20 st",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Swedish",
      "Leftovers",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 60,
    "timeLabel": "1 tim",
    "ingredientSections": [
      {
        "title": "Kokostoppar",
        "items": [
          {
            "name": "3 äggvitor (ca 100 g)",
            "key": "agg"
          },
          {
            "name": "1½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 tsk vaniljsocker",
            "key": "kryddor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "4½ dl kokosflingor (ca 150 g)"
          }
        ]
      },
      {
        "title": "Chokladdopp",
        "items": [
          {
            "name": "100 g mörk choklad",
            "key": "choklad"
          },
          {
            "name": "Flingsalt (valfritt)",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 175 grader. Klä en plåt med bakplåtspapper.",
      "Vispa äggvitorna med salt till ett mjukt skum. Tillsätt socker och vaniljsocker lite i taget och vispa tills smeten är vit och blank, men inte stel.",
      "Vänd ner kokosflingorna med en slickepott, tills allt är fuktigt.",
      "Forma toppar med fuktade händer eller två matskedar, ca 1 msk smet per topp. Nyp till spetsen så att den blir hög och spetsig. Lägg dem på plåten med lite mellanrum.",
      "Grädda i mitten av ugnen i 12–15 minuter, tills spetsarna och kanterna är gyllenbruna. Låt svalna helt på plåten.",
      "Smält två tredjedelar av chokladen i en skål över sjudande vatten. Ta av skålen och rör ner resten av chokladen tills den har smält. Då blir chokladen blank när den stelnar.",
      "Doppa botten på varje topp i chokladen, låt överskottet rinna av och ställ dem på bakplåtspapper. Strö eventuellt över några flingsaltkorn på kanten. Låt stelna i 30 minuter."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Ringla lite av chokladen i tunna trådar över spetsarna med en sked, för en extra elegant konfekt.",
          "Ställ topparna i små pappersformar i en ask, eller tätt på ett fat till kaffet.",
          "Spara äggvitor i en burk i kylen i upp till 4 dagar, eller frys dem tills du har tillräckligt.",
          "Topparna håller ca 1 vecka i en lufttät burk."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "100-branda-mandlar",
    "title": "Brända mandlar med kanel",
    "description": "En påse mandlar, socker, vatten och kanel. Mandlarna rörs i en het panna tills sockret först blir till sand och sedan smälter till ett knaprigt, glansigt och knöligt skal. Doften fyller hela köket som en julmarknad, och i en strut av bakplåtspapper blir de en present som tar femton minuter.",
    "image": "assets/recipes/100-branda-mandlar.webp",
    "cardImage": "assets/recipes/100-branda-mandlar-card.webp",
    "alt": "Brända mandlar med kanel",
    "meals": [
      "candy"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "15 min",
      "Portioner": "ca 3 dl (4 strutar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Christmas",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 dl mandlar med skal (ca 150 g)",
            "key": "mandel"
          },
          {
            "name": "1 dl strösocker",
            "key": "socker"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "1 tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "1 tsk vaniljsocker",
            "key": "kryddor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Klä en plåt med bakplåtspapper.",
      "Koka upp socker, vatten, kanel, vaniljsocker och salt i en stor stekpanna eller vid kastrull med tjock botten.",
      "Lägg i mandlarna och låt koka på medelhög värme under ständig omrörning.",
      "Efter 5–7 minuter har vattnet kokat bort och sockret blir torrt och sandigt runt mandlarna. Fortsätt att röra.",
      "Sänk till medelvärme och rör i ytterligare 3–5 minuter, tills en del av sockret har smält igen och mandlarna har fått ett glansigt, knöligt, rödbrunt skal. Rör hela tiden så att sockret inte bränns.",
      "Häll ut mandlarna på bakplåtspappret och sära på dem med två gafflar medan de är varma. Låt dem svalna helt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Fyll mandlarna i strutar av bakplåtspapper eller i små papperspåsar, som på julmarknaden.",
          "Servera dem ljumma, då doftar de som mest.",
          "Byt kanelen mot kardemumma, eller strö över lite flingsalt medan de fortfarande är varma.",
          "Hett socker ger svåra brännskador, så smaka inte förrän mandlarna har svalnat.",
          "Lägg pannan i blöt i varmt vatten direkt, så löser sig sockret av sig självt.",
          "Mandlarna håller ca 2 veckor i en lufttät burk."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "101-appelchips",
    "title": "Krispiga äppelchips med kanel",
    "description": "De lite mjuka äpplena i fruktskålen skivas papperstunt och torkas långsamt i ugnen till krispiga chips med ett litet stjärnmönster i mitten. Ett pudrigt lager kanel gör att de doftar äppelpaj. Lika knapriga som chips, men gjorda av bara frukt.",
    "image": "assets/recipes/101-appelchips.webp",
    "cardImage": "assets/recipes/101-appelchips-card.webp",
    "alt": "Krispiga äppelchips med kanel",
    "meals": [
      "snack"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "1½–2 tim",
      "Portioner": "2 plåtar (ca 4 portioner)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Family friendly",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 135,
    "timeLabel": "1 tim 45 min–2 tim 15 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 äpplen, gärna röda och lite syrliga, t.ex. Royal Gala eller Ingrid Marie",
            "key": "apple"
          },
          {
            "name": "½ tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "1 tsk strösocker (valfritt)",
            "key": "socker"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 100 grader. Klä två plåtar med bakplåtspapper.",
      "Skölj äpplena och skiva dem papperstunt, 1–2 mm, tvärs över kärnhuset med en mandolin eller en vass kniv. Använd mandolinens handskydd. Peta bort kärnorna, men låt stjärnan i mitten vara kvar.",
      "Lägg skivorna i ett enda lager på plåtarna, utan att de överlappar.",
      "Blanda kanel och socker och pudra det tunt över skivorna genom en tesil.",
      "Torka i ugnen i 1½–2 timmar. Ställ en träslev i ugnsluckan så att den står på glänt och fukten kan komma ut. Vänd skivorna efter en timme.",
      "Chipsen är klara när kanterna har börjat rulla sig och skivorna känns torra. De blir krispiga först när de svalnar, så låt dem svalna på ett galler."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera chipsen i en skål eller en papperspåse, gärna med några skivor stående på kant så att stjärnmönstret syns.",
          "Gott med en klick vaniljyoghurt att doppa i, eller smulat över gröt.",
          "Lägg en näve i matlådan eller i fickan på promenaden.",
          "Förvara chipsen i en lufttät burk. De håller sig krispiga i ca en vecka. Mjuknar de, torka dem 10 minuter till i ugnen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "102-kastrullpopcorn",
    "title": "Kastrullpopcorn med smör, flingsalt och rökt paprika",
    "description": "En påse popcornmajs, en klick smör och kryddhyllans rökta paprika. Majskornen poppas i kastrull på fem minuter och vänds i smält smör och flingsalt till stora, frasiga popcorn som slår allt i mikropåse. Fredagens självklara mellanmål, i en stor skål mitt i soffan.",
    "image": "assets/recipes/102-kastrullpopcorn.webp",
    "cardImage": "assets/recipes/102-kastrullpopcorn-card.webp",
    "alt": "Kastrullpopcorn med smör, flingsalt och rökt paprika",
    "meals": [
      "snack",
      "party"
    ],
    "metadata": {
      "Förberedelse": "2 min",
      "Tillagning": "8 min",
      "Portioner": "4 (ca 3 liter popcorn)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Gluten free",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 10,
    "timeLabel": "10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 dl popcornmajs"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "25 g smör",
            "key": "smor"
          },
          {
            "name": "½ tsk rökt paprikapulver"
          },
          {
            "name": "½ tsk flingsalt, smulat fint",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Hetta upp oljan och 3 majskorn i en stor kastrull med lock på medelhög värme.",
      "När de tre kornen har poppat är oljan lagom varm. Häll i resten av majsen, lägg på locket och skaka kastrullen så att alla korn täcks av olja.",
      "Låt locket stå lite på glänt så att ångan kommer ut, då blir popcornen frasigare. Skaka kastrullen då och då.",
      "Ta kastrullen från värmen när det går 2–3 sekunder mellan smällarna. Häll upp popcornen i en stor skål och plocka bort de kärnor som inte har poppat.",
      "Smält smöret med paprikapulvret i samma kastrull. Ringla det över popcornen, strö över flingsaltet och vänd runt ordentligt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera i en stor skål av trä eller emalj, eller i små papperspåsar till var och en.",
          "Byt paprikan mot en tesked tacokrydda (recept 94), kanelsocker eller fint riven lagrad ost.",
          "För en vegansk variant, använd olivolja i stället för smör.",
          "Ge inte popcorn till små barn, de sätter lätt i halsen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "103-blabarssmoothie",
    "title": "Blåbärssmoothie med havre och kvarg",
    "description": "En näve frysta blåbär, några skedar havregryn och en burk kvarg mixas till en tjock, djupt lila smoothie som mättar ända fram till middagen. Toppad med frostiga blåbär och lite granola ser den ut att komma från ett juicecafé. Klar på fem minuter, och helt utan banan.",
    "image": "assets/recipes/103-blabarssmoothie.webp",
    "cardImage": "assets/recipes/103-blabarssmoothie-card.webp",
    "alt": "Blåbärssmoothie med havre och kvarg",
    "meals": [
      "snack",
      "drink",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "0 min",
      "Portioner": "2 glas",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 5,
    "timeLabel": "5 min",
    "ingredientSections": [
      {
        "title": "Smoothie",
        "items": [
          {
            "name": "1 dl havregryn",
            "key": "havre"
          },
          {
            "name": "2 dl mjölk eller havredryck",
            "key": "mjolk"
          },
          {
            "name": "2 dl frysta blåbär",
            "key": "blabar"
          },
          {
            "name": "2 dl kvarg naturell eller turkisk yoghurt",
            "key": "kvarg"
          },
          {
            "name": "1 msk flytande honung"
          },
          {
            "name": "½ tsk malen kanel (valfritt)",
            "key": "kanel"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "2 msk frysta blåbär",
            "key": "blabar"
          },
          {
            "name": "2 msk granola, gärna från recept 38",
            "key": "granola"
          },
          {
            "name": "Några myntablad (valfritt)",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Häll havregrynen och mjölken i mixern eller en hög bunke och låt dem svälla i 5 minuter. Då blir smoothien slät utan gryn.",
      "Lägg i blåbär, kvarg, honung och kanel.",
      "Mixa i ca 1 minut, tills smoothien är helt slät och tjock. Späd med lite mer mjölk om den är för tjock.",
      "Smaka av med mer honung om bären är syrliga.",
      "Häll upp i två glas."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Toppa med några frysta, frostiga blåbär, granola och ett myntablad precis före servering.",
          "Ringla lite kvarg längs insidan av glaset innan du häller i smoothien, så blir det vackra vita ränder mot det lila.",
          "Häll smoothien i en burk med lock för matlådan eller som mellanmål på jobbet. Den håller sig i kylen till nästa dag.",
          "Byt blåbären mot frysta hallon eller mango för en ny färg."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "104-bananplattar",
    "title": "Små bananplättar med havre och kanel",
    "description": "Två brunfläckiga bananer, två ägg och en näve havregryn mixas till en tjock smet som steks till små, gyllene plättar som doftar banankaka. De staplas i höga torn med yoghurt och bär. Lika bra som mellanmål efter skolan som till helgfrukost, och helt utan tillsatt socker.",
    "image": "assets/recipes/104-bananplattar.webp",
    "cardImage": "assets/recipes/104-bananplattar-card.webp",
    "alt": "Små bananplättar med havre och kanel",
    "meals": [
      "snack",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "15 min",
      "Portioner": "ca 16 små plättar (2–3 portioner)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Family friendly",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20,
    "timeLabel": "20 min",
    "ingredientSections": [
      {
        "title": "Plättar",
        "items": [
          {
            "name": "2 övermogna bananer"
          },
          {
            "name": "2 ägg",
            "key": "agg"
          },
          {
            "name": "1 dl havregryn",
            "key": "havre"
          },
          {
            "name": "½ tsk bakpulver"
          },
          {
            "name": "½ tsk malen kanel",
            "key": "kanel"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "Smör till stekning",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 dl turkisk yoghurt eller kvarg",
            "key": "yoghurt"
          },
          {
            "name": "1 dl frysta hallon eller blåbär, tinade",
            "key": "hallon"
          },
          {
            "name": "1 msk flytande honung (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Mixa bananer, ägg, havregryn, bakpulver, kanel och salt slätt med en stavmixer.",
      "Låt smeten vila i 5 minuter, så att havren sväller och smeten tjocknar.",
      "Smält lite smör i en stekpanna på medellåg värme. Klicka ut smeten, ca 1 msk per plätt.",
      "Stek plättarna 1–2 minuter per sida, tills de är gyllenbruna och har stelnat. Ha inte för hög värme, bananen bränns lätt innan mitten har satt sig.",
      "Lägg de färdiga plättarna under en kökshandduk medan du steker resten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Stapla 5–6 plättar i ett högt torn på varje tallrik.",
          "Toppa med en klick yoghurt, tinade bär som rinner ner längs sidorna och en tunn stråle honung.",
          "Plättarna är goda även kalla, och fungerar fint i matlådan.",
          "Använd havregryn märkta glutenfria om plättarna ska bli helt glutenfria.",
          "Överblivna plättar håller 2 dagar i kylen och kan frysas."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "105-hummus",
    "title": "Snabb hummus med grönsaksstavar",
    "description": "En burk kikärtor, en sked tahini och en citron mixas på fem minuter till en fluffig, sidenlen hummus. Den bres ut i en virvel med olivolja och paprikapulver och serveras med krispiga morötter, gurka och paprika att doppa. Mellanmålet som får grönsakslådan att ta slut.",
    "image": "assets/recipes/105-hummus.webp",
    "cardImage": "assets/recipes/105-hummus-card.webp",
    "alt": "Snabb hummus med grönsaksstavar",
    "meals": [
      "snack",
      "sauce"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "0 min",
      "Portioner": "4 som mellanmål",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Middle Eastern",
      "Beginner friendly",
      "Budget"
    ],
    "time": 10,
    "timeLabel": "10 min",
    "ingredientSections": [
      {
        "title": "Hummus",
        "items": [
          {
            "name": "1 burk kikärtor (400 g)",
            "key": "kikarter"
          },
          {
            "name": "2 msk tahini",
            "key": "tahini"
          },
          {
            "name": "1 liten vitlöksklyfta",
            "key": "vitlok"
          },
          {
            "name": "Saft av ½ citron",
            "key": "citron"
          },
          {
            "name": "½ tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "3 msk olivolja",
            "key": "olja"
          },
          {
            "name": "3–4 msk iskallt vatten"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Olivolja",
            "key": "olja"
          },
          {
            "name": "1 krm paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "Några blad bladpersilja",
            "key": "orter"
          },
          {
            "name": "2 morötter, 1 bit gurka och 1 paprika, skurna i stavar",
            "key": "morot"
          }
        ]
      }
    ],
    "directions": [
      "Häll av kikärtorna i en sil över en skål. Spara spadet till chokladmoussen i recept 9. Skölj kikärtorna och spara några hela till garnering.",
      "Vill du ha extra slät hummus, nyp av skalen genom att trycka kikärtorna mellan fingrarna. Det tar några minuter men gör stor skillnad.",
      "Mixa kikärtor, tahini, vitlök, citronsaft, spiskummin och salt med en stavmixer eller i en matberedare i 1 minut.",
      "Tillsätt olja och iskallt vatten lite i taget och mixa i 2–3 minuter till, tills hummusen är fluffig och slät. Smaka av med mer salt och citron."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Bred ut hummusen i en grund skål med baksidan av en sked och gör en virvel i mitten.",
          "Ringla olivolja i virveln och toppa med de sparade kikärtorna, paprikapulver och persilja.",
          "Ställ grönsaksstavarna på högkant i ett glas bredvid, så blir det lätt att doppa.",
          "Gott med fröknäcket i recept 61 eller på en macka med gurka.",
          "Hummusen håller ca 4 dagar i kylen."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "106-allrengoringsspray",
    "title": "Allrengöringsspray på citrusskal och ättika",
    "description": "Skalen från veckans apelsiner och citroner får dra i en burk ättika tills vätskan blir gyllene och doftar citrus i stället för vinäger. Utspädd i en sprayflaska blir den en allrengöring som får kakel, kranar och glas att blänka. Det du brukar slänga blir det du städar med.",
    "image": "assets/recipes/106-allrengoringsspray.webp",
    "cardImage": "assets/recipes/106-allrengoringsspray-card.webp",
    "alt": "Allrengöringsspray på citrusskal och ättika",
    "meals": [
      "household"
    ],
    "metadata": {
      "Förberedelse": "10 min + 1–2 veckors dragtid",
      "Verkningstid": "1 min",
      "Räcker till": "ca 1½ liter spray",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Cleaning",
      "Kitchen",
      "Bathroom",
      "Natural",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": 20171,
    "timeLabel": "11 min + 1–2 veckor",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "Skal från 4–5 apelsiner eller citroner",
            "key": "apelsin"
          },
          {
            "name": "5 dl ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "Vatten till spädning",
            "basic": true
          },
          {
            "name": "1 glasburk med lock, ca 1 liter"
          },
          {
            "name": "1 sprayflaska, gärna av glas"
          }
        ]
      }
    ],
    "directions": [
      "Spara citrusskalen i en påse i frysen tills du har tillräckligt.",
      "Lägg skalen i glasburken och häll över ättikan så att de täcks. Skruva på locket.",
      "Låt burken stå svalt och mörkt i 1–2 veckor. Skaka den då och då.",
      "Sila bort skalen. Den gyllene citrusättikan håller i flera månader i burken.",
      "Häll 1 del citrusättika och 2 delar vatten i sprayflaskan.",
      "Spraya på ytan, låt verka i 1 minut och torka av med en fuktig trasa. På glas och speglar, eftertorka med en torr mikrofiberduk."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Häll citrusättikan i en hög glasflaska med en remsa apelsinskal kvar i, och ställ den på en hylla i städskåpet.",
          "Använd sprayen på kakel, kranar, rostfria diskbänkar, laminat, glas, speglar och i kylskåpet.",
          "På kalkfläckar i duschen, spraya outspädd citrusättika och låt verka i 10 minuter innan du torkar av.",
          "Ättiksdoften försvinner när ytan har torkat."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Använd inte sprayen på marmor, kalksten, granit eller annan natursten, och inte på oljat eller vaxat trä. Ättikan fräter på ytan.",
          "Prova alltid på en dold yta först.",
          "Blanda aldrig med klorin.",
          "Undvik att spraya mot ansiktet, och vädra om du städar i ett litet rum."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Märk alltid flaskor och burkar tydligt och förvara dem utom räckhåll för barn. Blanda aldrig hemgjorda rengöringsmedel med klorin eller andra köpta medel, ättika och klorin bildar en giftig gas."
  },
  {
    "id": "107-diskmedel",
    "title": "Diskmedel på grön såpa och bikarbonat",
    "description": "En skvätt grön såpa från städskåpet, lite bikarbonat och varmt vatten blandas till ett mjukt, ljusgrönt diskmedel som löser fett utan parfym och färgämnen. I en glasflaska med pump vid diskhon ser det ut som från en designbutik. Kostar några kronor per flaska.",
    "image": "assets/recipes/107-diskmedel.webp",
    "cardImage": "assets/recipes/107-diskmedel-card.webp",
    "alt": "Diskmedel på grön såpa och bikarbonat",
    "meals": [
      "household"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "under disken",
      "Räcker till": "ca 4 dl",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Cleaning",
      "Kitchen",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "5 min förberedelse",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 dl flytande grön såpa"
          },
          {
            "name": "3 dl varmt vatten",
            "basic": true
          },
          {
            "name": "1 tsk bikarbonat"
          },
          {
            "name": "1 pumpflaska, ca 5 dl, och en tratt"
          }
        ]
      }
    ],
    "directions": [
      "Rör ut bikarbonaten i det varma vattnet tills den har löst sig.",
      "Häll i såpan och rör försiktigt. Vispa inte, då skummar det över.",
      "Häll diskmedlet i flaskan med hjälp av tratten och låt svalna.",
      "Använd 1–2 msk i en diskbalja med varmt vatten, eller några droppar direkt på diskborsten.",
      "Skölj glas och bestick i rent, varmt vatten efteråt, så blir de inte randiga."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Häll diskmedlet i en glasflaska med pump, och ställ den vid diskhon tillsammans med en diskborste av trä.",
          "Det fungerar bra på vardagsdisk, kastruller och stekpannor. Låt riktigt flottiga pannor stå i blöt en stund först.",
          "Grön såpa är lika bra på golv, så samma flaska räcker till en hink skurvatten.",
          "Använd diskmedlet inom ca en månad och skaka flaskan före användning om det har skiktat sig."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Hemmagjort diskmedel skummar mindre än köpt, men skummet säger inget om hur rent det blir.",
          "Använd det aldrig i diskmaskinen, den fylls med skum.",
          "Såpa kan torka ut huden. Använd diskhandskar om du diskar mycket.",
          "Häll inte i citronsaft eller ättika, syra gör att såpan förlorar sin verkan."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Märk alltid flaskor och burkar tydligt och förvara dem utom räckhåll för barn. Blanda aldrig hemgjorda rengöringsmedel med klorin eller andra köpta medel, ättika och klorin bildar en giftig gas."
  },
  {
    "id": "108-avkalkare",
    "title": "Avkalkare med citronsyra för vattenkokare och kaffebryggare",
    "description": "Påsen med citronsyra som står kvar sedan saftkokningen, och en liter vatten. Lösningen kokas eller körs genom bryggaren och löser upp vita kalkavlagringar på en halvtimme, så att vattenkokaren blänker som ny och kaffet smakar renare. Fungerar lika bra på duschmunstycken och kranar.",
    "image": "assets/recipes/108-avkalkare.webp",
    "cardImage": "assets/recipes/108-avkalkare-card.webp",
    "alt": "Avkalkare med citronsyra för vattenkokare och kaffebryggare",
    "meals": [
      "household"
    ],
    "metadata": {
      "Förberedelse": "2 min",
      "Verkningstid": "30 min",
      "Räcker till": "1 avkalkning",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Cleaning",
      "Kitchen",
      "Bathroom",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": 32,
    "timeLabel": "32 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 msk citronsyra (ca 25 g)"
          },
          {
            "name": "1 liter vatten",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Fyll vattenkokaren med vattnet och rör ner citronsyran tills den har löst sig.",
      "Koka upp och låt stå i 30 minuter.",
      "Häll ut lösningen och skölj ur kokaren. Koka upp rent vatten två gånger och häll ut det, så försvinner smaken.",
      "Rör ut citronsyran i vattnet och häll det i bryggarens vattentank. Sätt i ett tomt filter.",
      "Starta bryggaren och stäng av den när halva lösningen har runnit igenom. Låt stå i 15 minuter.",
      "Starta igen och låt resten rinna igenom.",
      "Kör två omgångar med bara rent vatten, så försvinner smaken.",
      "Lägg duschmunstycket eller kranens strålsamlare i en skål med varm citronsyralösning i 30 minuter.",
      "Borsta med en gammal tandborste, skölj och sätt tillbaka."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Förvara citronsyran i en glasburk med en liten mätsked och en tydlig etikett, bredvid kaffet.",
          "Avkalka vattenkokaren och bryggaren en gång i månaden om du har hårt vatten, annars några gånger om året.",
          "Lösningen fungerar också på kalkfläckar i diskhon och runt kranar. Låt verka 10 minuter och skölj."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Citronsyra svider i ögonen. Tvätta händerna efteråt och torka upp spill.",
          "Använd den inte på marmor, kalksten eller annan natursten.",
          "Följ alltid bruksanvisningen till din kaffebryggare eller espressomaskin. Vissa maskiner har egna program och avkalkningsmedel."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Märk alltid flaskor och burkar tydligt och förvara dem utom räckhåll för barn. Blanda aldrig hemgjorda rengöringsmedel med klorin eller andra köpta medel, ättika och klorin bildar en giftig gas.",
    "directionGroups": [
      {
        "title": "Vattenkokare",
        "start": 0
      },
      {
        "title": "Kaffebryggare",
        "start": 3
      },
      {
        "title": "Duschmunstycke och kranar",
        "start": 7
      }
    ]
  },
  {
    "id": "109-ugnsrengoring",
    "title": "Ugnsrengöring med bikarbonat och ättika över natten",
    "description": "En burk bikarbonat, lite vatten och en sprayflaska ättika. Pastan breds ut i den kalla ugnen och får jobba över natten, så att fastbränt fett och gamla ostrester lossnar. På morgonen fräser ättikan bort det sista. Ingen skurning med starka kemikalier, bara en blank ugn.",
    "image": "assets/recipes/109-ugnsrengoring.webp",
    "cardImage": "assets/recipes/109-ugnsrengoring-card.webp",
    "alt": "Ugnsrengöring med bikarbonat och ättika över natten",
    "meals": [
      "household"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Verkningstid": "över natten, minst 12 tim",
      "Räcker till": "1 ugn",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Cleaning",
      "Kitchen",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "15 min + över natten",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1½ dl bikarbonat"
          },
          {
            "name": "ca ½ dl vatten",
            "basic": true
          },
          {
            "name": "Allrengöringssprayen i recept 106, eller 1 del ättika (12 %) och 2 delar vatten i en sprayflaska"
          },
          {
            "name": "Diskhandskar, en fuktig trasa och en plastskrapa eller stekspade av plast"
          }
        ]
      }
    ],
    "directions": [
      "Se till att ugnen är kall. Ta ut galler och plåtar.",
      "Rör ihop bikarbonat och vatten till en bredbar pasta, ungefär som tjock gräddfil.",
      "Ta på diskhandskar och bred ut pastan över ugnens botten, sidor och insidan av luckan. Lägg tjockast där smutsen sitter, och undvik värmeelement och fläkt. Pastan blir brun när den löser smuts, det är bra.",
      "Stäng luckan och låt verka över natten, minst 12 timmar.",
      "Torka bort pastan med en fuktig trasa. Skrapa loss det som sitter fast med plastskrapan.",
      "Spraya ättika över de vita rester som är kvar. Det fräser när ättikan möter bikarbonaten. Torka av med en ren, fuktig trasa tills inga vita rester syns.",
      "Lägg gallren i blöt i diskhon eller badkaret över natten, i varmt vatten med en skvätt diskmedel och ett par matskedar bikarbonat, och borsta rent nästa dag."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Förvara bikarbonaten i en stor glasburk med skruvlock och en mätsked, märkt tydligt.",
          "Använd samma pasta på fastbränt i kastruller och på kakel bakom spisen.",
          "En gång i kvartalet räcker för de flesta ugnar. Torka upp spill direkt, så slipper du skurningen."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Använd inte metoden på katalytiska ugnsväggar, de matta, porösa väggarna i vissa ugnar. Läs ugnens bruksanvisning. Har ugnen pyrolys, använd hellre det programmet.",
          "Använd diskhandskar, bikarbonat torkar ut huden.",
          "Ättika och klorin får aldrig blandas."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Märk alltid flaskor och burkar tydligt och förvara dem utom räckhåll för barn. Blanda aldrig hemgjorda rengöringsmedel med klorin eller andra köpta medel, ättika och klorin bildar en giftig gas."
  },
  {
    "id": "110-doftande-kastrull",
    "title": "Doftande kastrull med apelsinskal, kanel och nejlika",
    "description": "Apelsinskal, ett par kanelstänger och några nejlikor ur kryddhyllan sjuder i en kastrull vatten på spisen. På några minuter doftar hela hemmet som ett julbord, utan doftljus eller sprayer. Det billigaste och vackraste sättet att få hemmet att kännas varmt en mörk vinterkväll.",
    "image": "assets/recipes/110-doftande-kastrull.webp",
    "cardImage": "assets/recipes/110-doftande-kastrull-card.webp",
    "alt": "Doftande kastrull med apelsinskal, kanel och nejlika",
    "meals": [
      "household"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "så länge du vill",
      "Räcker till": "1 kastrull, 2–3 gånger",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Home fragrance",
      "Christmas",
      "Natural",
      "Leftovers",
      "Zero waste",
      "Beginner friendly",
      "Budget"
    ],
    "time": null,
    "timeLabel": "5 min förberedelse",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "Skal av 2 apelsiner, eller 1 hel apelsin i skivor",
            "key": "apelsin"
          },
          {
            "name": "2 kanelstänger"
          },
          {
            "name": "1 tsk hela nejlikor"
          },
          {
            "name": "5 kardemummakapslar, lätt krossade"
          },
          {
            "name": "2 kvistar rosmarin eller några skivor färsk ingefära (valfritt)",
            "key": "orter"
          },
          {
            "name": "1 liter vatten",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Lägg apelsinskal, kryddor och rosmarin i en kastrull och häll över vattnet.",
      "Koka upp och sänk sedan till lägsta värme, så att vattnet bara ångar och sjuder svagt. Ha inget lock på.",
      "Fyll på med varmt vatten var 30:e minut, så att kastrullen aldrig kokar torr.",
      "Stäng av spisen när du lämnar köket eller går och lägger dig.",
      "Låt innehållet svalna, ställ det i kylen och återanvänd det 2–3 gånger. Fyll på med nytt vatten varje gång."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Använd en vacker kastrull i emalj eller gjutjärn, så får den gärna stå framme på spisen.",
          "Fyll en glasburk med torkade apelsinskivor, kanelstänger, nejlikor och stjärnanis, och knyt på en lapp med instruktionen. Det blir en fin julklapp.",
          "Byt ut kryddorna efter säsong: äppelskal och kanel på hösten, citron och rosmarin på våren.",
          "Spara apelsinskalen i frysen, så har du alltid något att koka."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Låt aldrig kastrullen koka torr, den kan brännas och börja ryka.",
          "Lämna aldrig spisen påslagen utan tillsyn.",
          "Ställ kastrullen på en bakre platta om du har barn eller husdjur hemma."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Märk alltid flaskor och burkar tydligt och förvara dem utom räckhåll för barn. Blanda aldrig hemgjorda rengöringsmedel med klorin eller andra köpta medel, ättika och klorin bildar en giftig gas."
  },
  {
    "id": "111-hundkex",
    "title": "Hundkex med jordnötssmör, havre och banan",
    "description": "En brunfläckig banan, en klick jordnötssmör och några nävar havre och mjöl blir en fast deg som stansas ut till små ben, hjärtan och tassar. Kexen gräddas gyllene och torkas hårda, så att de knastrar mellan tänderna och håller i veckor. Ser ut som från en hunddelikatessbutik, och hunden kommer att sitta fint utan att bli tillsagd.",
    "image": "assets/recipes/111-hundkex.webp",
    "cardImage": "assets/recipes/111-hundkex-card.webp",
    "alt": "Hundkex med jordnötssmör, havre och banan",
    "meals": [
      "pets"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "25 min + 1 tim torkning",
      "Räcker till": "ca 30 kex, beroende på storlek",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Treats",
      "Dog",
      "Make ahead",
      "Leftovers",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 105,
    "timeLabel": "1 tim 45 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 övermogen banan",
            "key": "banan"
          },
          {
            "name": "1 dl jordnötssmör utan xylitol, gärna 100 % jordnötter",
            "key": "jordnotssmor"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "2½ dl vetemjöl eller havremjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 dl havregryn",
            "key": "havre"
          },
          {
            "name": "½ dl vatten, efter behov",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 175 grader. Klä en plåt med bakplåtspapper.",
      "Mosa bananen slät med en gaffel och rör ner jordnötssmöret och ägget.",
      "Tillsätt mjöl och havregryn och arbeta ihop till en fast deg. Tillsätt vatten en matsked i taget om den är för torr.",
      "Kavla ut degen ca ½ cm tjock mellan två bakplåtspapper och stansa ut kex med små formar, till exempel ben, hjärtan eller tassar. Anpassa storleken efter hunden.",
      "Lägg kexen på plåten och grädda i mitten av ugnen i 20–25 minuter, tills de är torra och gyllene.",
      "Stäng av ugnen och låt kexen torka kvar med luckan på glänt i en timme. Då blir de hårda och håller längre."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Förvara kexen i en glasburk med lock, gärna med en tass eller ett ben ritat på etiketten.",
          "Fyll en papperspåse och knyt ett snöre runt, så blir de en fin present till en hundvän eller en ny valpägare.",
          "Ge 1–2 kex om dagen, färre till en liten hund.",
          "Kexen håller ca 2 veckor i en lufttät burk och kan frysas."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Kontrollera alltid att jordnötssmöret inte innehåller xylitol. Det är mycket giftigt för hundar.",
          "Har hunden spannmålsallergi, använd bara havremjöl och fråga veterinären.",
          "Kexen är gjorda för hundar. De skadar inte människor, men de är inte heller särskilt goda."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Djur tål inte allt vi tål. Använd aldrig choklad, russin eller vindruvor, lök, vitlök, avokado, macadamianötter, alkohol, koffein eller xylitol, ett sötningsmedel som finns i vissa jordnötssmör och sockerfria produkter. Använd inga eteriska oljor, de kan vara giftiga, särskilt för katter. Godis bör vara högst en tiondel av djurets dagliga mat. Fråga veterinären om ditt djur har allergier, övervikt eller en sjukdom."
  },
  {
    "id": "112-hundglass",
    "title": "Fryst hundglass i tassformar med yoghurt och blåbär",
    "description": "En burk naturell yoghurt och en näve frysta blåbär blir små, marmorerade tassar i lila och vitt. De fryses i en silikonform och serveras som belöning, efter en lång promenad eller i en ihålig gummileksak som håller hunden sysselsatt en lång stund. Hundens egen glassbar, utan socker.",
    "image": "assets/recipes/112-hundglass.webp",
    "cardImage": "assets/recipes/112-hundglass-card.webp",
    "alt": "Fryst hundglass i tassformar med yoghurt och blåbär",
    "meals": [
      "pets"
    ],
    "metadata": {
      "Förberedelse": "10 min + 3 tim i frysen",
      "Tillagning": "0 min",
      "Räcker till": "ca 15 små bitar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Treats",
      "Dog",
      "No bake",
      "Make ahead",
      "Frozen",
      "Beginner friendly",
      "Budget"
    ],
    "time": 190,
    "timeLabel": "3 tim 10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "3 dl naturell yoghurt utan socker och smaktillsatser, gärna laktosfri",
            "key": "yoghurt"
          },
          {
            "name": "1 dl frysta blåbär, tinade",
            "key": "blabar"
          },
          {
            "name": "1 msk jordnötssmör utan xylitol (valfritt)",
            "key": "jordnotssmor"
          },
          {
            "name": "1 silikonform med små fack, gärna tassar eller ben"
          }
        ]
      }
    ],
    "directions": [
      "Mosa hälften av blåbären med en gaffel så att de släpper sin saft.",
      "Värm jordnötssmöret några sekunder i mikron så att det blir rinnigt, och rör ner det i yoghurten.",
      "Klicka yoghurt och blåbärsmos om vartannat i formens fack och dra en tandpetare genom dem, så blir bitarna marmorerade.",
      "Tryck ner ett helt blåbär i varje fack.",
      "Frys i minst 3 timmar, tills bitarna är helt fasta. Tryck ut dem ur formen och förvara dem i en fryspåse."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Ge en liten bit som belöning, eller lägg några i hundens matskål en varm dag.",
          "Fyll en ihålig gummileksak med yoghurtblandningen och frys den, så blir det en aktivering som räcker länge.",
          "Bitarna håller ca 2 månader i frysen."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Många hundar tål laktos dåligt. Börja med en liten bit och se hur magen reagerar, eller använd laktosfri yoghurt.",
          "Använd aldrig smaksatt eller sötad yoghurt, den kan innehålla socker eller xylitol.",
          "Byt aldrig blåbären mot vindruvor eller russin, de är giftiga för hundar."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Djur tål inte allt vi tål. Använd aldrig choklad, russin eller vindruvor, lök, vitlök, avokado, macadamianötter, alkohol, koffein eller xylitol, ett sötningsmedel som finns i vissa jordnötssmör och sockerfria produkter. Använd inga eteriska oljor, de kan vara giftiga, särskilt för katter. Godis bör vara högst en tiondel av djurets dagliga mat. Fråga veterinären om ditt djur har allergier, övervikt eller en sjukdom."
  },
  {
    "id": "113-kattgodis",
    "title": "Krispigt kattgodis med tonfisk",
    "description": "En burk tonfisk, ett ägg och lite mjöl mixas till en deg som skärs i små rutor och gräddas till krispiga, fiskdoftande godisbitar. Katten hör burken öppnas från andra sidan huset. Lika uppskattat av hundar, så hela hushållet blir nöjt.",
    "image": "assets/recipes/113-kattgodis.webp",
    "cardImage": "assets/recipes/113-kattgodis-card.webp",
    "alt": "Krispigt kattgodis med tonfisk",
    "meals": [
      "pets"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "15 min",
      "Räcker till": "ca 100 små bitar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Treats",
      "Dog",
      "Cat",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 30,
    "timeLabel": "30 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 burk tonfisk i vatten (ca 185 g), avrunnen"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "1 dl vetemjöl eller havremjöl",
            "key": "vetemjol"
          },
          {
            "name": "1–2 msk vatten, efter behov",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 175 grader. Klä en plåt med bakplåtspapper.",
      "Mixa tonfisk och ägg slätt med en stavmixer.",
      "Rör ner mjölet och arbeta ihop till en smidig deg. Tillsätt vatten om den är för torr, mer mjöl om den kladdar.",
      "Kavla ut degen ca ½ cm tjock mellan två bakplåtspapper. Skär den i små rutor, ca 1 × 1 cm, med en pizzakniv eller vass kniv. Bitarna behöver inte delas isär.",
      "Grädda i mitten av ugnen i 12–15 minuter, tills bitarna är torra och krispiga. Låt dem svalna och bryt isär dem längs skårorna."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Förvara godiset i en liten glasburk med lock, gärna med en fisk ritad på etiketten.",
          "Göm några bitar i en aktiveringsboll eller ett pussel, så får katten jaga sitt godis.",
          "Ge några bitar om dagen som belöning, inte en hel näve.",
          "Godiset håller ca 1 vecka i kylen i en lufttät burk och ca 2 månader i frysen."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Använd tonfisk i vatten, aldrig i olja eller i sås med lök eller kryddor.",
          "Tonfisk ska vara en lyx, inte vardagsmat, för vare sig katter eller hundar.",
          "Katter behöver framför allt kött. Godiset ersätter inte kattens vanliga, kompletta foder."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Djur tål inte allt vi tål. Använd aldrig choklad, russin eller vindruvor, lök, vitlök, avokado, macadamianötter, alkohol, koffein eller xylitol, ett sötningsmedel som finns i vissa jordnötssmör och sockerfria produkter. Använd inga eteriska oljor, de kan vara giftiga, särskilt för katter. Godis bör vara högst en tiondel av djurets dagliga mat. Fråga veterinären om ditt djur har allergier, övervikt eller en sjukdom."
  },
  {
    "id": "114-tassbalsam",
    "title": "Tassbalsam med kokosolja och bivax",
    "description": "En sked kokosolja, lite olivolja och några bivaxpastiller smälts ihop till en mjuk, gyllene balsam för torra trampdynor. Den skyddar tassarna mot is, grus och vägsalt på vinterpromenaderna och masseras in på några sekunder. Helt utan parfym, och ofarlig om hunden slickar lite.",
    "image": "assets/recipes/114-tassbalsam.webp",
    "cardImage": "assets/recipes/114-tassbalsam-card.webp",
    "alt": "Tassbalsam med kokosolja och bivax",
    "meals": [
      "pets"
    ],
    "metadata": {
      "Förberedelse": "10 min + 1 tim stelning",
      "Verkningstid": "efter varje promenad",
      "Räcker till": "ca 1 dl",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Dog",
      "Cat",
      "Paws",
      "Winter",
      "Natural",
      "Gift",
      "Beginner friendly",
      "Budget"
    ],
    "time": 70,
    "timeLabel": "1 tim 10 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 msk kokosolja"
          },
          {
            "name": "2 msk olivolja eller rapsolja",
            "key": "olja"
          },
          {
            "name": "1 msk bivaxpastiller (ca 15 g)"
          },
          {
            "name": "2 små burkar med lock, gärna av glas eller plåt"
          }
        ]
      }
    ],
    "directions": [
      "Lägg kokosolja, olivolja och bivax i en liten värmetålig skål eller glasburk.",
      "Ställ den i en kastrull med vatten som sjuder svagt och rör tills allt har smält, ca 5 minuter.",
      "Häll balsamen i burkarna och låt den stelna i rumstemperatur i en timme.",
      "Torka av tassarna med en fuktig trasa efter promenaden, så att salt och grus försvinner.",
      "Massera in en liten klick balsam i trampdynorna och mellan dem.",
      "Håll hunden sysselsatt i några minuter, så att balsamen hinner gå in innan den slickas bort."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Fyll balsamen i små plåtdosor och knyt ett snöre runt, en fin present till en hundvän tillsammans med kexen i recept 111.",
          "Ha en burk vid ytterdörren, så blir det en vana efter vinterpromenaden.",
          "Balsamen fungerar också på torra armbågar och nagelband hos människor.",
          "Förvara balsamen svalt. Den håller i ca 6 månader."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Tillsätt aldrig eteriska oljor. Många är giftiga för hundar och särskilt för katter.",
          "Blöder trampdynorna, har de djupa sprickor eller haltar djuret, kontakta veterinären.",
          "Vägsalt kan irritera tassarna. Skölj dem i ljummet vatten efter promenader på saltade vägar."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Djur tål inte allt vi tål. Använd aldrig choklad, russin eller vindruvor, lök, vitlök, avokado, macadamianötter, alkohol, koffein eller xylitol, ett sötningsmedel som finns i vissa jordnötssmör och sockerfria produkter. Använd inga eteriska oljor, de kan vara giftiga, särskilt för katter. Godis bör vara högst en tiondel av djurets dagliga mat. Fråga veterinären om ditt djur har allergier, övervikt eller en sjukdom."
  },
  {
    "id": "115-lugnande-havrebad",
    "title": "Lugnande havrebad för hund med kliande hud",
    "description": "Ett par deciliter havregryn mals till ett fint mjöl som gör badvattnet mjölkigt och mjukt. Hunden får stå i det ljumma vattnet medan du öser och masserar, och huden lugnas utan parfym eller starka tvättmedel. Ett spabad för hunden, gjort på frukostens havregryn.",
    "image": "assets/recipes/115-lugnande-havrebad.webp",
    "cardImage": "assets/recipes/115-lugnande-havrebad-card.webp",
    "alt": "Lugnande havrebad för hund med kliande hud",
    "meals": [
      "pets"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Verkningstid": "10 min",
      "Räcker till": "1 bad för en medelstor hund",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Dog",
      "Grooming",
      "Soothing",
      "Natural",
      "Beginner friendly",
      "Budget"
    ],
    "time": 15,
    "timeLabel": "15 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "2 dl havregryn, eller 1 dl för en liten hund",
            "key": "havre"
          },
          {
            "name": "Ljummet vatten"
          },
          {
            "name": "1–2 stora handdukar"
          }
        ]
      }
    ],
    "directions": [
      "Mixa havregrynen till ett fint mjöl i en mixer eller matberedare. Rör ner en tesked i ett glas vatten. Blir vattnet mjölkigt är mjölet fint nog.",
      "Fyll badkaret eller en stor balja med ljummet vatten, ungefär kroppstemperatur, så att det når upp till hundens mage. Rör ner havremjölet tills vattnet är mjölkigt.",
      "Lyft ner hunden och ös vattnet över ryggen, magen och benen med en kopp. Undvik öron, ögon och nos.",
      "Massera havrevattnet ner i pälsen och huden i ca 10 minuter, gärna med lugna, långa tag.",
      "Skölj lätt med rent, ljummet vatten, så att inga klumpar blir kvar i pälsen.",
      "Krama ur pälsen och torka hunden noga med handdukar, särskilt mellan tårna och i armhålorna."
    ],
    "extraSections": [
      {
        "title": "Presentation och användning",
        "items": [
          "Fyll havremjölet i en glasburk med en skopa och knyt en liten hundhandduk runt den, en fin present till en ny valpägare.",
          "För en liten hund går det bra att bada i diskhon eller handfatet.",
          "Ge en godisbit (recept 111) efter badet, så blir det en trevligare upplevelse nästa gång.",
          "Bada inte oftare än en gång i veckan, för ofta kan torka ut huden."
        ]
      },
      {
        "title": "Bra att veta",
        "items": [
          "Klåda kan bero på parasiter, allergi eller infektion. Gå till veterinären om den inte går över, eller om huden är röd, fuktig eller har sår.",
          "Använd ljummet vatten, aldrig varmt.",
          "Använd aldrig schampo för människor på hunden.",
          "Katter tycker oftast illa om bad. Fråga veterinären om din katt kliar sig."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Djur tål inte allt vi tål. Använd aldrig choklad, russin eller vindruvor, lök, vitlök, avokado, macadamianötter, alkohol, koffein eller xylitol, ett sötningsmedel som finns i vissa jordnötssmör och sockerfria produkter. Använd inga eteriska oljor, de kan vara giftiga, särskilt för katter. Godis bör vara högst en tiondel av djurets dagliga mat. Fråga veterinären om ditt djur har allergier, övervikt eller en sjukdom."
  },
  {
    "id": "116-linsbolognese",
    "title": "Linsbolognese med röda linser och morot",
    "description": "En påse röda linser, två burkar krossade tomater och ett par morötter puttrar till en tjock, djupröd köttfärssås helt utan kött. Linserna kokar sönder och ger samma mustiga konsistens, och en skvätt soja ger djup. Vänd den med spagetti och toppa med basilika, så blir det söndagspasta mitt i veckan.",
    "image": "assets/recipes/116-linsbolognese.webp",
    "cardImage": "assets/recipes/116-linsbolognese-card.webp",
    "alt": "Linsbolognese med röda linser och morot",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "35 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Pasta",
      "Italian",
      "Family friendly",
      "Meal prep",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Sås",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 morötter",
            "key": "morot"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "2 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "2 dl röda linser",
            "key": "linser"
          },
          {
            "name": "2 burkar krossade tomater (à 400 g)",
            "key": "kross"
          },
          {
            "name": "3 dl vatten + 1 grönsaksbuljongtärning, eller buljongen i recept 91",
            "key": "buljong"
          },
          {
            "name": "1 tsk torkad oregano",
            "key": "orter"
          },
          {
            "name": "1 tsk torkad timjan",
            "key": "orter"
          },
          {
            "name": "1 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "1 msk balsamvinäger"
          },
          {
            "name": "Salt och svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Pasta",
        "items": [
          {
            "name": "400 g spagetti utan ägg",
            "key": "pasta"
          },
          {
            "name": "2 msk salt till pastavattnet",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Några basilikablad",
            "key": "orter"
          },
          {
            "name": "Riven vegansk ost eller parmesan"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          }
        ]
      }
    ],
    "directions": [
      "Finhacka löken och riv morötterna fint. Hacka vitlöken.",
      "Fräs lök och morot i olivoljan i en stor kastrull på medelvärme i 8 minuter, tills allt är mjukt och lätt gyllene. Rör ner vitlök och tomatpuré och fräs 1 minut till.",
      "Skölj linserna i en sil och lägg dem i kastrullen tillsammans med krossade tomater, vatten, buljongtärning, oregano, timjan, soja och socker.",
      "Låt sjuda under lock i 20–25 minuter, tills linserna har kokat sönder. Rör då och då och späd med lite vatten om såsen blir för tjock.",
      "Rör ner balsamvinägern och smaka av med salt och peppar.",
      "Koka spagettin i rikligt med saltat vatten enligt förpackningen. Spara 1 dl pastavatten innan du häller av.",
      "Vänd spagettin med en tredjedel av såsen och en skvätt pastavatten, så att varje sträng blir täckt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Snurra spagettin till höga nystan i djupa tallrikar och skeda resten av såsen överst.",
          "Toppa med basilika, riven ost och några droppar olivolja.",
          "Såsen blir ännu godare dagen efter och går bra att frysa i portioner.",
          "Använd resten till en vegansk lasagne eller som fyllning i ugnsbakade paprikor."
        ]
      }
    ],
    "pantryKeys": [
      "linser",
      "morot",
      "kross",
      "pasta"
    ]
  },
  {
    "id": "117-kokoscurry",
    "title": "Krämig kokoscurry med sötpotatis och spenat",
    "description": "Två sötpotatisar, en burk kokosmjölk och en påse spenat puttrar ihop med curry, ingefära och vitlök till en solgul, krämig gryta. Sötpotatisen blir mjuk som smör, och spenaten vänds ner sist så att den behåller sin klargröna färg. Toppa med koriander och rostade nötter, och servera med ris. Allt i en kastrull.",
    "image": "assets/recipes/117-kokoscurry.webp",
    "cardImage": "assets/recipes/117-kokoscurry-card.webp",
    "alt": "Krämig kokoscurry med sötpotatis och spenat",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "25 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Indian",
      "One pot",
      "Meal prep",
      "Beginner friendly",
      "Budget"
    ],
    "time": 40,
    "timeLabel": "40 min",
    "ingredientSections": [
      {
        "title": "Curry",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "3 cm färsk ingefära"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 msk mild curry",
            "key": "curry"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk malen koriander",
            "key": "orter"
          },
          {
            "name": "½ tsk malen gurkmeja",
            "key": "kryddor"
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "2 sötpotatisar (ca 700 g)",
            "key": "sotpotatis"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "1 burk kokosmjölk (400 ml)",
            "key": "kokosmjolk"
          },
          {
            "name": "2 dl vatten",
            "basic": true
          },
          {
            "name": "1 burk kikärtor, sköljda (valfritt, för extra protein)",
            "key": "kikarter"
          },
          {
            "name": "100 g färsk spenat",
            "key": "spenat"
          },
          {
            "name": "Saft av 1 lime",
            "key": "lime"
          },
          {
            "name": "Salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "3 dl basmatiris, kokat enligt förpackningen",
            "key": "ris"
          },
          {
            "name": "1 dl koriander",
            "key": "orter"
          },
          {
            "name": "½ dl rostade cashewnötter eller jordnötter"
          },
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          }
        ]
      }
    ],
    "directions": [
      "Hacka löken. Riv vitlök och ingefära. Skala sötpotatisen och skär den i tärningar, ca 2 cm.",
      "Fräs löken i oljan i en stor kastrull på medelvärme i 5 minuter. Tillsätt vitlök, ingefära och alla kryddor och fräs 1 minut, tills det doftar.",
      "Lägg i sötpotatisen och rör om så att den täcks av kryddorna.",
      "Häll i krossade tomater, kokosmjölk och vatten. Spara 2 msk av kokosmjölken till garnering. Koka upp och låt sjuda under lock i 15–20 minuter, tills sötpotatisen är mjuk.",
      "Rör ner kikärtorna och låt dem bli varma.",
      "Vänd ner spenaten och låt den sjunka ihop i 1 minut. Smaka av med limesaft och salt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg upp riset i djupa skålar och skeda curryn bredvid, så att både det gula och det vita syns.",
          "Ringla den sparade kokosmjölken i en virvel över grytan.",
          "Toppa med koriander och rostade nötter, och servera med limeklyftor.",
          "Curryn blir ännu godare dagen efter och går bra att frysa."
        ]
      }
    ],
    "pantryKeys": [
      "sotpotatis",
      "spenat",
      "kokosmjolk",
      "kross"
    ]
  },
  {
    "id": "118-glaserad-tofu",
    "title": "Glaserad ugnstofu med broccoli, ris och sesam",
    "description": "Ett paket tofu, ett broccolihuvud och en påse ris. Tofun vänds i lite majsstärkelse och rostas krispig i ugnen, och vänds sedan i en blank, söt och salt glasyr av soja, sirap, vitlök och ingefära. Med rostad broccoli, sesamfrön och salladslök ser den ut som från en asiatisk restaurang och tar fyrtio minuter.",
    "image": "assets/recipes/118-glaserad-tofu.webp",
    "cardImage": "assets/recipes/118-glaserad-tofu-card.webp",
    "alt": "Glaserad ugnstofu med broccoli, ris och sesam",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "30 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Asian",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Tofu",
        "items": [
          {
            "name": "1 paket fast tofu (ca 400 g)",
            "key": "tofu"
          },
          {
            "name": "2 msk majsstärkelse eller potatismjöl"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Glasyr",
        "items": [
          {
            "name": "Allroundmarinaden i recept 95, gjord med sirap, eller:",
            "note": true
          },
          {
            "name": "3 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "2 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 msk äppelcidervinäger eller limesaft"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "2 cm färsk ingefära, finriven"
          }
        ]
      },
      {
        "title": "Broccoli och ris",
        "items": [
          {
            "name": "1 broccoli, med stjälk",
            "key": "broccoli"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "3 dl jasminris",
            "key": "ris"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 msk sesamfrön",
            "key": "fron"
          },
          {
            "name": "2 salladslökar",
            "key": "salladslok"
          },
          {
            "name": "1 färsk röd chili, tunt skivad (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 225 grader. Klä två plåtar med bakplåtspapper.",
      "Linda in tofun i en ren kökshandduk och lägg något tungt ovanpå, till exempel en gjutjärnspanna, i 15 minuter. Ju torrare tofu, desto krispigare blir den.",
      "Skär tofun i tärningar, ca 2 cm. Vänd dem i olja, salt och majsstärkelse på den ena plåten och bred ut dem med lite mellanrum.",
      "Rosta tofun i mitten av ugnen i 25–30 minuter. Vänd tärningarna halvvägs.",
      "Dela broccolin i buketter. Skala stjälken och skär den i skivor. Vänd allt i olja och salt på den andra plåten och rosta de sista 12–15 minuterna, tills kanterna är krispiga.",
      "Koka riset enligt förpackningen.",
      "Koka upp glasyren i en stor stekpanna och låt den puttra i 2–3 minuter, tills den är sirapsaktig. Vänd ner den heta tofun och rör tills alla tärningar är blanka."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg upp ris, broccoli och tofu bredvid varandra i djupa skålar, så att färgerna syns.",
          "Strö över sesamfrön, tunt skivad salladslök och chili.",
          "Ringla glasyren som blir kvar i pannan över broccolin.",
          "Rester av tofun är goda kalla i en sallad eller matlåda."
        ]
      }
    ],
    "pantryKeys": [
      "tofu",
      "broccoli",
      "ris",
      "soja"
    ]
  },
  {
    "id": "119-korngrynsotto",
    "title": "Korngrynsotto med gröna ärtor, citron och parmesan",
    "description": "Svenska korngryn, en påse frysta ärter och en bit lagrad ost. Kornet kokas långsamt som en risotto tills det blir krämigt men behåller sin tuggighet, och hälften av ärterna mixas till en klargrön puré som färgar hela grytan. Toppad med ärtskott, citronskal och parmesan blir den vår på tallriken mitt i vintern.",
    "image": "assets/recipes/119-korngrynsotto.webp",
    "cardImage": "assets/recipes/119-korngrynsotto-card.webp",
    "alt": "Korngrynsotto med gröna ärtor, citron och parmesan",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "35 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Italian",
      "Comfort food",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Korngrynsotto",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 vitlöksklyfta",
            "key": "vitlok"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk smör",
            "key": "smor"
          },
          {
            "name": "3 dl korngryn (matkorn)",
            "key": "korngryn"
          },
          {
            "name": "1 dl torrt vitt vin (valfritt)"
          },
          {
            "name": "ca 1 liter varm grönsaksbuljong, gärna från recept 91",
            "key": "buljong"
          },
          {
            "name": "3 dl frysta gröna ärter",
            "key": "arter"
          },
          {
            "name": "25 g smör",
            "key": "smor"
          },
          {
            "name": "1 dl riven lagrad ost, t.ex. parmesan",
            "key": "ost"
          },
          {
            "name": "Fint rivet skal och 1 msk saft av 1 citron",
            "key": "citron"
          },
          {
            "name": "Salt och svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "1 ask ärtskott"
          },
          {
            "name": "Några myntablad",
            "key": "orter"
          },
          {
            "name": "Riven parmesan",
            "key": "ost"
          },
          {
            "name": "Olivolja",
            "key": "olja"
          }
        ]
      }
    ],
    "directions": [
      "Finhacka löken och vitlöken. Fräs dem i olja och smör i en vid kastrull på medelvärme i 4–5 minuter, tills löken är mjuk.",
      "Tillsätt korngrynen och rör i 1 minut, tills de har blivit glansiga.",
      "Häll i vinet och låt det koka in under omrörning.",
      "Tillsätt buljongen, ca 2 dl i taget. Rör ofta och fyll på när vätskan nästan har kokat in. Efter 25–30 minuter ska kornet vara krämigt men fortfarande ha lite tugga.",
      "Mixa hälften av ärterna med 1 dl av buljongen till en slät puré med stavmixer.",
      "Rör ner ärtpurén och de hela ärterna och låt sjuda i 3 minuter.",
      "Ta kastrullen från värmen och rör ner smör, ost, citronskal och citronsaft. Smaka av med salt och peppar. Låt stå under lock i 2 minuter."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera korngrynsotton i djupa tallrikar, den ska vara lös nog att flyta ut lite.",
          "Toppa med en tuss ärtskott, några myntablad, extra parmesan, citronskal och en droppe olivolja.",
          "Parmesan och många andra lagrade ostar görs med löpe från djur. Vill du vara helt vegetarisk, välj en ost med mikrobiellt löpe.",
          "Kornet blir fastare när det svalnar. Späd rester med lite buljong när du värmer dem."
        ]
      }
    ],
    "pantryKeys": [
      "korngryn",
      "arter",
      "citron",
      "ost"
    ]
  },
  {
    "id": "120-gronsaksbiffar",
    "title": "Grönsaksbiffar på rotfruktsrester med tzatziki",
    "description": "De sista morötterna, en bit palsternacka och rotselleri som ingen visste vad de skulle göra med rivs och blandas med fetaost, ägg och havre. Biffarna steks krispiga och gyllene med färgglada strimlor i snittet och serveras med kall, frisk tzatziki. Grönsakslådans sista dagar som en färgsprakande middag.",
    "image": "assets/recipes/120-gronsaksbiffar.webp",
    "cardImage": "assets/recipes/120-gronsaksbiffar-card.webp",
    "alt": "Grönsaksbiffar på rotfruktsrester med tzatziki",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "25 min",
      "Tillagning": "20 min",
      "Portioner": "4 (ca 12 biffar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Family friendly",
      "Meal prep",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Tzatziki",
        "items": [
          {
            "name": "½ gurka",
            "key": "gurka"
          },
          {
            "name": "2 dl turkisk yoghurt",
            "key": "yoghurt"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk hackad dill eller mynta",
            "key": "dill"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Biffar",
        "items": [
          {
            "name": "500 g rotfrukter, t.ex. morot, palsternacka, rotselleri eller sötpotatis",
            "key": "rotfrukter"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "2 salladslökar",
            "key": "salladslok"
          },
          {
            "name": "2 ägg",
            "key": "agg"
          },
          {
            "name": "100 g fetaost, smulad",
            "key": "fetaost"
          },
          {
            "name": "1 dl havregryn",
            "key": "havre"
          },
          {
            "name": "½ dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "½ tsk paprikapulver",
            "key": "kryddor"
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "½ dl hackad persilja eller dill",
            "key": "orter"
          },
          {
            "name": "Rapsolja till stekning",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Grönsallad, pitabröd eller kokt potatis",
            "key": "sallad"
          },
          {
            "name": "1 citron, i klyftor",
            "key": "citron"
          }
        ]
      }
    ],
    "directions": [
      "Gör tzatzikin först. Riv gurkan grovt, krama ur vätskan ordentligt och rör ner den i yoghurten med vitlök, olivolja, dill och salt. Ställ kallt.",
      "Skala och riv rotfrukterna grovt. Blanda dem med saltet i ett durkslag och låt stå i 10 minuter.",
      "Krama ur så mycket vätska som möjligt, gärna i en ren kökshandduk. Det är det viktigaste steget för biffar som håller ihop.",
      "Skiva salladslöken tunt. Blanda rotfrukter, salladslök, ägg, fetaost, havregryn, mjöl, kryddor och persilja i en bunke.",
      "Forma ca 12 biffar med fuktiga händer, ca 7 cm breda och 1½ cm tjocka. Är smeten för lös, tillsätt mer havregryn.",
      "Hetta upp ett tunt lager olja i en stekpanna på medelvärme. Stek biffarna i 3–4 minuter per sida, tills de är gyllene och krispiga. Vänd dem försiktigt.",
      "Vill du hellre ugnsbaka dem, pensla med olja och grädda i 200 grader i ca 20 minuter. Vänd dem halvvägs."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg 3 biffar lätt överlappande på varje tallrik och en rejäl klick tzatziki bredvid.",
          "Strö över dill eller persilja och servera med citronklyftor och en grönsallad.",
          "Fyll varma pitabröd med biffar, tzatziki och sallad för en enklare middag.",
          "Biffarna är goda även kalla i matlådan och kan frysas."
        ]
      }
    ],
    "pantryKeys": [
      "rotfrukter",
      "agg",
      "fetaost",
      "yoghurt"
    ]
  },
  {
    "id": "121-chili-sin-carne",
    "title": "Chili sin carne med svarta bönor, kakao och limecrème",
    "description": "Två burkar bönor, en burk krossade tomater och en sked kakao puttrar till en mörk, rökig och mustig chili som smakar som om den stått på spisen hela dagen. Den serveras med syrlig limecrème, koriander och rödlök. En gryta som räcker till hela veckans matlådor, helt vegansk.",
    "image": "assets/recipes/121-chili-sin-carne.webp",
    "cardImage": "assets/recipes/121-chili-sin-carne-card.webp",
    "alt": "Chili sin carne med svarta bönor, kakao och limecrème",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "35 min",
      "Portioner": "4–6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Mexican",
      "One pot",
      "Meal prep",
      "Beginner friendly",
      "Budget"
    ],
    "time": 45,
    "timeLabel": "45 min",
    "ingredientSections": [
      {
        "title": "Chili",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "1 röd paprika",
            "key": "paprika"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "3 msk tacokrydda, gärna från recept 94",
            "key": "kryddor"
          },
          {
            "name": "2 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "1 burk svarta bönor (400 g), sköljda",
            "key": "bonor"
          },
          {
            "name": "1 burk kidneybönor (400 g), sköljda",
            "key": "bonor"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "1 dl majs från burk eller fryst",
            "key": "majs"
          },
          {
            "name": "2 dl vatten",
            "basic": true
          },
          {
            "name": "1 msk kakao",
            "key": "kakao"
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "Saft av ½ lime",
            "key": "lime"
          },
          {
            "name": "Salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Limecrème",
        "items": [
          {
            "name": "2 dl havreyoghurt naturell, gärna en tjock sort",
            "key": "havreyoghurt"
          },
          {
            "name": "Fint rivet skal och 1 msk saft av ½ lime",
            "key": "lime"
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Kokt ris eller tortillachips",
            "key": "ris"
          },
          {
            "name": "1 dl koriander",
            "key": "orter"
          },
          {
            "name": "½ rödlök, finhackad",
            "key": "lok"
          },
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop havreyoghurt, limeskal, limesaft och salt till limecrème och ställ kallt.",
      "Hacka löken, tärna paprikan och hacka vitlöken.",
      "Fräs lök och paprika i oljan i en stor kastrull på medelvärme i 6–8 minuter, tills allt är mjukt. Tillsätt vitlök, tacokrydda och tomatpuré och fräs 1 minut till.",
      "Rör ner bönor, krossade tomater, majs, vatten, kakao och socker.",
      "Låt sjuda utan lock i 25 minuter, tills chilin har tjocknat. Rör då och då och mosa några av bönorna mot kastrullens kant, så blir chilin krämigare.",
      "Smaka av med limesaft och salt."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skeda chilin i djupa skålar med ris eller tortillachips vid sidan.",
          "Toppa med en klick limecrème, koriander och finhackad rödlök, och servera med limeklyftor.",
          "Chilin blir ännu godare dagen efter och går bra att frysa i portioner.",
          "Använd rester som fyllning i tacos eller bakad potatis."
        ]
      }
    ],
    "pantryKeys": [
      "bonor",
      "kross",
      "majs",
      "paprika"
    ]
  },
  {
    "id": "122-spenatlasagne",
    "title": "Spenatlasagne med keso och tomatsås",
    "description": "En påse fryst spenat, två burkar keso och ett paket lasagneplattor. Lagren av klargrön spenat- och kesofyllning och djupröd tomatsås gräddas under ett gyllene, bubblande ostlock. Ingen béchamel att stå och röra i, bara en saftig, mättande lasagne som blir ännu godare dagen efter.",
    "image": "assets/recipes/122-spenatlasagne.webp",
    "cardImage": "assets/recipes/122-spenatlasagne-card.webp",
    "alt": "Spenatlasagne med keso och tomatsås",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "25 min",
      "Tillagning": "45 min + 10 min vila",
      "Portioner": "6",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Pasta",
      "Italian",
      "Family friendly",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 80,
    "timeLabel": "1 tim 20 min",
    "ingredientSections": [
      {
        "title": "Tomatsås",
        "items": [
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 msk tomatpuré",
            "key": "tomatpure"
          },
          {
            "name": "2 burkar krossade tomater (à 400 g)",
            "key": "kross"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "1 tsk torkad oregano",
            "key": "orter"
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Spenatfyllning",
        "items": [
          {
            "name": "400 g fryst bladspenat, tinad",
            "key": "spenat"
          },
          {
            "name": "500 g keso (2 burkar)",
            "key": "keso"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "1 krm riven muskotnöt"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Lasagne",
        "items": [
          {
            "name": "ca 12 torkade lasagneplattor som inte behöver förkokas (ca 250 g)",
            "key": "pasta"
          },
          {
            "name": "2 dl riven ost, t.ex. mozzarella eller prästost",
            "key": "cheddar"
          },
          {
            "name": "Några basilikablad",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Hacka löken och vitlöken och fräs dem i olivoljan i en kastrull på medelvärme i 5 minuter. Rör ner tomatpurén, krossade tomater, vatten, oregano, socker, salt och peppar. Låt sjuda i 10 minuter. Såsen ska vara ganska lös, plattorna suger åt sig vätska i ugnen.",
      "Sätt ugnen på 200 grader.",
      "Krama ur spenaten ordentligt, gärna i en kökshandduk. Blanda den med keso, ägg, muskot, salt och peppar.",
      "Bred ut en fjärdedel av tomatsåsen i botten av en ugnsform, ca 20 × 30 cm. Lägg ett lager lasagneplattor.",
      "Bred ut hälften av spenatfyllningen och en fjärdedel av såsen, och lägg ett nytt lager plattor. Upprepa med resten av fyllningen, en fjärdedel sås och ett sista lager plattor.",
      "Bred resten av tomatsåsen över de översta plattorna, ända ut i kanterna, och strö över osten.",
      "Grädda i mitten av ugnen i 40–45 minuter, tills osten är gyllene och plattorna är mjuka när du sticker i en kniv. Låt lasagnen vila i 10 minuter före servering."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Toppa med färska basilikablad precis före servering.",
          "Skär upp den första biten med en vass kniv och en bred spatel, så att de gröna, vita och röda lagren syns.",
          "Servera med en grönsallad med vinägrett.",
          "Lasagnen kan göras en dag i förväg och gräddas direkt från kylen. Räkna då med 10 minuter extra. Den går också att frysa."
        ]
      }
    ],
    "pantryKeys": [
      "spenat",
      "keso",
      "kross",
      "pasta"
    ]
  },
  {
    "id": "123-falafel",
    "title": "Ugnsbakade falafel med tahinisås och picklad rödkål",
    "description": "En påse torkade kikärtor, en lök och en stor näve örter mixas till en grön, kryddig smet som formas till små bollar och bakas krispiga i ugnen, utan frityr. De serveras i pitabröd med len tahinisås och knaprig, neonrosa picklad rödkål. Gatumat från Mellanöstern som går att förbereda dagen innan.",
    "image": "assets/recipes/123-falafel.webp",
    "cardImage": "assets/recipes/123-falafel-card.webp",
    "alt": "Ugnsbakade falafel med tahinisås och picklad rödkål",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "30 min + blötläggning över natten",
      "Tillagning": "30 min",
      "Portioner": "4 (ca 20 falafel)",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegan",
      "Middle Eastern",
      "Meal prep",
      "Budget"
    ],
    "time": null,
    "timeLabel": "1 tim + blötläggning",
    "ingredientSections": [
      {
        "title": "Falafel",
        "items": [
          {
            "name": "2½ dl torkade kikärtor (ca 200 g)",
            "key": "kikarter"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "1 dl bladpersilja",
            "key": "orter"
          },
          {
            "name": "½ dl koriander",
            "key": "orter"
          },
          {
            "name": "1 tsk malen spiskummin",
            "key": "kryddor"
          },
          {
            "name": "1 tsk malen koriander",
            "key": "orter"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "½ tsk bakpulver"
          },
          {
            "name": "2 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "3 msk rapsolja",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Picklad rödkål",
        "items": [
          {
            "name": "200 g rödkål",
            "key": "kal"
          },
          {
            "name": "1 dl vatten",
            "basic": true
          },
          {
            "name": "1 msk ättika (12 %)",
            "key": "attika"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Tahinisås",
        "items": [
          {
            "name": "3 msk tahini",
            "key": "tahini"
          },
          {
            "name": "2 msk citronsaft",
            "key": "citron"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "4–5 msk kallt vatten",
            "basic": true
          },
          {
            "name": "1 krm salt",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "4 pitabröd"
          },
          {
            "name": "Sallad, gurka och tomat",
            "key": "sallad"
          }
        ]
      }
    ],
    "directions": [
      "Lägg kikärtorna i rikligt med kallt vatten och låt dem stå över natten. Använd inte konserverade kikärtor, de är för blöta och falaflen faller isär.",
      "Strimla rödkålen tunt. Koka upp vatten, ättika, socker och salt, häll lagen över kålen och låt dra i minst 20 minuter.",
      "Rör ihop tahini, citronsaft och vitlök. Den stelnar först, men blir slät när du rör ner vattnet en matsked i taget. Smaka av med salt.",
      "Sätt ugnen på 200 grader. Klä en plåt med bakplåtspapper och pensla den med 1 msk olja.",
      "Häll av kikärtorna och torka dem lätt. Mixa dem i en matberedare med lök, vitlök, örter och kryddor till en grynig smet, som grovt sand. Den ska inte bli slät. Rör ner bakpulver och mjöl.",
      "Forma smeten till 20 små, platta bollar, ca 1 msk var, och lägg dem på plåten. Pensla med resten av oljan.",
      "Baka i mitten av ugnen i 25–30 minuter, tills falaflen är gyllene och krispig. Vänd dem halvvägs."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Värm pitabröden, fyll dem med sallad, gurka, tomat, 4–5 falafel och picklad rödkål, och ringla över tahinisås.",
          "Servera falaflen på ett fat med tahinisåsen i en skål och rödkålen i en annan, så att alla bygger själva.",
          "Den råa smeten kan formas en dag i förväg och stå övertäckt i kylen, eller frysas.",
          "Den picklade rödkålen håller en vecka i kylen."
        ]
      }
    ],
    "pantryKeys": [
      "kikarter",
      "kal",
      "tahini",
      "lok"
    ]
  },
  {
    "id": "124-gnocchi",
    "title": "Ugnsbakad potatisgnocchi på gårdagens potatis med tomat och mozzarella",
    "description": "Gårdagens kokta potatis, ett ägg och lite mjöl blir mjuka, fluffiga gnocchi som vänds i en enkel tomatsås. De gräddas i ugnen under smält mozzarella tills såsen bubblar och osten får gyllene fläckar. Italiensk mammamat av det som annars hade blivit stekt potatis.",
    "image": "assets/recipes/124-gnocchi.webp",
    "cardImage": "assets/recipes/124-gnocchi-card.webp",
    "alt": "Ugnsbakad potatisgnocchi på gårdagens potatis med tomat och mozzarella",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "30 min",
      "Tillagning": "25 min",
      "Portioner": "4",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Italian",
      "Comfort food",
      "Family friendly",
      "Leftovers",
      "Budget"
    ],
    "time": 55,
    "timeLabel": "55 min",
    "ingredientSections": [
      {
        "title": "Gnocchi",
        "items": [
          {
            "name": "600 g kokt, kall mjölig potatis (ca 6–7 st), skalad",
            "key": "potatis"
          },
          {
            "name": "1 ägg",
            "key": "agg"
          },
          {
            "name": "2½–3 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "2 msk salt till kokvattnet",
            "basic": true
          }
        ]
      },
      {
        "title": "Tomatsås",
        "items": [
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "2 msk olivolja",
            "key": "olja"
          },
          {
            "name": "1 burk krossade tomater (400 g)",
            "key": "kross"
          },
          {
            "name": "1 tsk torkad oregano",
            "key": "orter"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 krm chiliflakes (valfritt)",
            "key": "kryddor"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "125 g mozzarella",
            "key": "mozzarella"
          },
          {
            "name": "½ dl riven parmesan eller lagrad ost",
            "key": "ost"
          },
          {
            "name": "Några basilikablad",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Pressa potatisen genom en potatispress, eller riv den fint, ner i en bunke.",
      "Tillsätt ägg och salt och arbeta in mjölet lite i taget, tills degen är mjuk och inte längre kladdar. Knåda så lite som möjligt, då blir gnocchin lätt och luftig.",
      "Dela degen i fyra delar och rulla dem till långa rullar, ca 2 cm tjocka, på mjölat bakbord. Skär rullarna i bitar, ca 2 cm. Rulla gärna bitarna mot en gaffel, så får de räfflor som håller såsen.",
      "Sätt ugnen på 225 grader. Skiva vitlöken, fräs den i olivoljan i en ugnsfast panna i 1 minut och häll i tomater, oregano, salt och chili. Låt sjuda i 10 minuter.",
      "Koka upp en stor kastrull med saltat vatten. Koka gnocchin i omgångar. När de flyter upp till ytan, låt dem koka 30 sekunder till och lyft upp dem med en hålslev.",
      "Vänd gnocchin i tomatsåsen. Riv mozzarellan i bitar och lägg dem ovanpå, och strö över parmesanen.",
      "Gratinera i mitten av ugnen i 10–15 minuter, tills såsen bubblar och osten har fått gyllene fläckar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Servera direkt i pannan och toppa med färska basilikablad.",
          "Ringla över lite olivolja och strö över nymald svartpeppar.",
          "Mjölig potatis ger den lättaste gnocchin. Fast potatis kräver mer mjöl och blir segare.",
          "Okokta gnocchi kan frysas på en mjölad plåt och sedan förvaras i en påse. Koka dem direkt från frysen."
        ]
      }
    ],
    "pantryKeys": [
      "potatis",
      "kross",
      "mozzarella",
      "vetemjol"
    ]
  },
  {
    "id": "125-nudelwok",
    "title": "Nudelwok med krämig jordnötssås och grönsaker",
    "description": "Ett paket nudlar, en burk jordnötssmör och grönsakslådans morot, paprika och kål. Grönsakerna wokas krispiga på hög värme och vänds med nudlarna i en len, söt och salt jordnötssås med lime och ingefära. Toppa med rostade jordnötter och koriander. Klart på en kvart, och godare än hämtmaten.",
    "image": "assets/recipes/125-nudelwok.webp",
    "cardImage": "assets/recipes/125-nudelwok-card.webp",
    "alt": "Nudelwok med krämig jordnötssås och grönsaker",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "15 min",
      "Tillagning": "10 min",
      "Portioner": "4",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Asian",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 25,
    "timeLabel": "25 min",
    "ingredientSections": [
      {
        "title": "Jordnötssås",
        "items": [
          {
            "name": "3 msk jordnötssmör",
            "key": "jordnotssmor"
          },
          {
            "name": "3 msk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "1 msk limesaft",
            "key": "lime"
          },
          {
            "name": "1 vitlöksklyfta, finriven",
            "key": "vitlok"
          },
          {
            "name": "2 cm färsk ingefära, finriven"
          },
          {
            "name": "1 krm chiliflakes",
            "key": "kryddor"
          },
          {
            "name": "½ dl varmt vatten",
            "basic": true
          }
        ]
      },
      {
        "title": "Nudlar och grönsaker",
        "items": [
          {
            "name": "250 g nudlar utan ägg, t.ex. vetenudlar eller risnudlar",
            "key": "nudlar"
          },
          {
            "name": "1 msk rapsolja",
            "key": "olja"
          },
          {
            "name": "1 morot",
            "key": "morot"
          },
          {
            "name": "1 röd paprika",
            "key": "paprika"
          },
          {
            "name": "200 g vitkål eller kinakål",
            "key": "kal"
          },
          {
            "name": "2 dl frysta gröna ärter eller edamamebönor",
            "key": "arter"
          },
          {
            "name": "3 salladslökar",
            "key": "salladslok"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "½ dl rostade jordnötter, grovhackade",
            "key": "jordnotter"
          },
          {
            "name": "1 dl koriander",
            "key": "orter"
          },
          {
            "name": "1 lime, i klyftor",
            "key": "lime"
          },
          {
            "name": "1 msk sesamfrön",
            "key": "fron"
          }
        ]
      }
    ],
    "directions": [
      "Vispa ihop alla ingredienser till jordnötssåsen tills den är slät.",
      "Skala moroten och skär den i tunna stavar. Strimla paprikan och kålen tunt. Skiva salladslöken och håll isär de vita och de gröna delarna.",
      "Koka nudlarna enligt förpackningen, häll av och skölj dem snabbt i kallt vatten så att de inte klistrar ihop.",
      "Hetta upp oljan i en wok eller stor stekpanna på hög värme. Woka morot, paprika, kål och de vita salladslöksbitarna i 3–4 minuter, tills grönsakerna har fått lite färg men fortfarande är krispiga. Lägg i ärterna den sista minuten.",
      "Lägg i nudlarna och häll över såsen. Vänd runt med en tång i 1–2 minuter, tills allt är varmt och blankt. Späd med lite vatten om såsen blir för tjock."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg upp nudlarna i höga högar i djupa skålar, med grönsakerna synliga överst.",
          "Toppa med jordnötter, koriander, de gröna salladslöksbitarna och sesamfrön, och servera med limeklyftor.",
          "Byt ut grönsakerna mot det som finns i kylen, till exempel broccoli, sockerärtor eller champinjoner.",
          "Byt jordnötterna och jordnötssmöret mot solrosfrön och tahini om någon vid bordet är allergisk."
        ]
      }
    ],
    "pantryKeys": [
      "nudlar",
      "jordnotssmor",
      "kal",
      "morot",
      "paprika"
    ]
  },
  {
    "id": "126-grytbrod",
    "title": "Långjäst grytbröd utan knådning",
    "description": "Mjöl, vatten, salt och en nypa jäst rörs ihop på fem minuter och får jäsa i lugn och ro över natten. Brödet gräddas i en het gjutjärnsgryta och får en mörk, knastrande skorpa och en luftig, blank inkråm med stora hål. Det sjunger när det svalnar, och ser ut att komma från ett surdegsbageri.",
    "image": "assets/recipes/126-grytbrod.webp",
    "cardImage": "assets/recipes/126-grytbrod-card.webp",
    "alt": "Långjäst grytbröd utan knådning",
    "meals": [
      "bread",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "10 min + 12–18 tim jäsning + 1 tim",
      "Tillagning": "50 min",
      "Portioner": "1 bröd",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 1200,
    "timeLabel": "14–20 tim",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 bit färsk jäst, stor som en hasselnöt (ca 3 g), eller ¼ tsk torrjäst"
          },
          {
            "name": "4 dl kallt vatten",
            "basic": true
          },
          {
            "name": "2 tsk salt",
            "basic": true
          },
          {
            "name": "7 dl vetemjöl special",
            "key": "vetemjol"
          },
          {
            "name": "1 dl rågmjöl"
          },
          {
            "name": "Lite extra mjöl till utbakningen"
          }
        ]
      }
    ],
    "directions": [
      "Rör ut jästen i vattnet i en stor bunke. Använder du torrjäst, blanda den med mjölet i stället.",
      "Tillsätt salt, vetemjöl och rågmjöl och rör ihop till en kladdig, ojämn deg med en slev. Den ska inte knådas.",
      "Täck bunken och låt den stå i rumstemperatur i 12–18 timmar, tills degen har dubblats och är full av bubblor.",
      "Mjöla bakbordet och vänd ut degen. Vik kanterna in mot mitten några gånger, så att den blir en rund boll. Lägg den med skarven nedåt på ett mjölat bakplåtspapper och låt jäsa under en handduk i 1 timme.",
      "Ställ en gjutjärnsgryta med lock, ca 4 liter, i ugnen och sätt ugnen på 250 grader. Låt grytan bli het i 30 minuter.",
      "Lyft degen med pappret och sänk ner den i den heta grytan. Lägg på locket och grädda i 30 minuter.",
      "Ta av locket, sänk till 230 grader och grädda 15–20 minuter till, tills skorpan är djupt brun.",
      "Låt brödet svalna på galler i minst en timme innan du skär i det. Det fortsätter att gräddas av eftervärmen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Skär ett kryss eller ett långt snitt i degen med en vass kniv precis innan den läggs i grytan, så öppnar den sig vackert.",
          "Servera brödet på en träbräda med salt smör, eller till soppa och ost.",
          "Ett dagsgammalt bröd blir perfekt till panzanella (recept 41), krutonger eller fattiga riddare (recept 5).",
          "Brödet håller 2–3 dagar i en påse av papper eller tyg och kan frysas skivat."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "127-kavring",
    "title": "Mörk kavring med filmjölk och sirap",
    "description": "Filmjölken som närmar sig bäst före-datum, en skvätt mörk sirap och rågmjöl rörs ihop utan jäst och utan knådning. Kavringen gräddas långsamt till ett mörkt, saftigt och lite sött bröd som doftar fänkål och anis. Tunna skivor med smör och ost, eller till sill och leverpastej på julbordet.",
    "image": "assets/recipes/127-kavring.webp",
    "cardImage": "assets/recipes/127-kavring-card.webp",
    "alt": "Mörk kavring med filmjölk och sirap",
    "meals": [
      "bread",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "70 min",
      "Portioner": "1 limpa (ca 20 skivor)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Christmas",
      "Make ahead",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 80,
    "timeLabel": "1 tim 20 min",
    "ingredientSections": [
      {
        "title": "Kavring",
        "items": [
          {
            "name": "1 msk brödkryddor, t.ex. fänkål, anis och kummin"
          },
          {
            "name": "3 dl rågmjöl"
          },
          {
            "name": "3 dl grahamsmjöl"
          },
          {
            "name": "1 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "2 tsk bikarbonat"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "5 dl filmjölk",
            "key": "filmjolk"
          },
          {
            "name": "1 dl mörk sirap"
          },
          {
            "name": "Smör och ströbröd till formen",
            "key": "smor"
          }
        ]
      },
      {
        "title": "Glans",
        "items": [
          {
            "name": "1 msk mörk sirap"
          },
          {
            "name": "1 msk varmt vatten",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 175 grader. Smörj en avlång brödform, ca 1½ liter, och strö den med ströbröd.",
      "Krossa brödkryddorna lätt i en mortel.",
      "Blanda rågmjöl, grahamsmjöl, vetemjöl, bikarbonat, salt och brödkryddor i en bunke.",
      "Rör ner filmjölk och sirap, bara tills allt är blandat. Smeten ska vara tjock och kladdig.",
      "Häll smeten i formen och jämna till ytan.",
      "Grädda i nedre delen av ugnen i 60–70 minuter, tills en provsticka i mitten kommer ut torr.",
      "Rör ihop sirap och varmt vatten och pensla brödet direkt när det kommer ut ur ugnen.",
      "Stjälp upp kavringen och låt den svalna inlindad i en kökshandduk, så blir skorpan mjuk."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Kavringen är godast dagen efter, när den har satt sig. Skär den i tunna skivor med en vass kniv.",
          "Servera med salt smör och lagrad ost, eller med leverpastejmoussen i recept 8.",
          "På julbordet är den självklar till sill, gravlax och julskinka.",
          "Kavringen håller ca en vecka inslagen i plast och kan frysas i skivor."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "128-naanbrod",
    "title": "Snabba naanbröd i stekpanna med vitlökssmör",
    "description": "Mjöl, en burk yoghurt och lite bakpulver blir en mjuk deg som kavlas tunt och gräddas i en het, torr stekpanna. Bröden blåser upp med stora bubblor och svedda fläckar, och penslas med smält vitlökssmör och färska örter. Ingen jäsning, ingen ugn, klart på en halvtimme.",
    "image": "assets/recipes/128-naanbrod.webp",
    "cardImage": "assets/recipes/128-naanbrod-card.webp",
    "alt": "Snabba naanbröd i stekpanna med vitlökssmör",
    "meals": [
      "bread",
      "baking",
      "side"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "15 min",
      "Portioner": "8 bröd",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegetarian",
      "Indian",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "35 min",
    "ingredientSections": [
      {
        "title": "Deg",
        "items": [
          {
            "name": "5 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "2 tsk bakpulver"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "1 tsk strösocker",
            "key": "socker"
          },
          {
            "name": "2½ dl turkisk yoghurt",
            "key": "yoghurt"
          },
          {
            "name": "1 msk olivolja",
            "key": "olja"
          }
        ]
      },
      {
        "title": "Vitlökssmör",
        "items": [
          {
            "name": "50 g smör",
            "key": "smor"
          },
          {
            "name": "2 vitlöksklyftor, finrivna",
            "key": "vitlok"
          },
          {
            "name": "2 msk hackad koriander eller bladpersilja",
            "key": "orter"
          },
          {
            "name": "Flingsalt",
            "basic": true
          }
        ]
      }
    ],
    "directions": [
      "Blanda mjöl, bakpulver, salt och socker i en bunke. Rör ner yoghurten och oljan och arbeta ihop till en mjuk deg.",
      "Knåda degen på mjölat bakbord i 2 minuter, tills den är slät. Täck den och låt vila i 15 minuter.",
      "Smält smöret med vitlöken i en liten kastrull på låg värme. Ta från värmen och rör ner örterna.",
      "Dela degen i 8 bitar och kavla ut dem till tunna, avlånga bröd, ca 3 mm tjocka.",
      "Hetta upp en torr stekpanna, gärna av gjutjärn, på hög värme. Grädda ett bröd i taget i 1–2 minuter, tills det har blåst upp och fått svedda fläckar på undersidan. Vänd och grädda 1 minut till.",
      "Pensla bröden med vitlökssmöret direkt och strö över lite flingsalt. Håll dem varma och mjuka i en vikt kökshandduk medan du gräddar resten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg bröden lätt överlappande i en korg med en linneservett, med de svedda fläckarna uppåt.",
          "Servera till kokoscurryn i recept 117, linssoppan i recept 32 eller hummusen i recept 105.",
          "Byt vitlökssmöret mot olivolja med za'atar eller sesamfrön.",
          "Bröden är godast nygräddade, men kan frysas och värmas i en torr panna."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "129-frukostfrallor",
    "title": "Frukostfrallor med kall jäsning över natten",
    "description": "Degen rörs ihop på tio minuter på kvällen och jäser i kylen medan du sover. På morgonen skärs den direkt i bitar, utan knådning eller formning, och gräddas till rustika, luftiga frallor med krispig skorpa och frön på toppen. Nybakat till helgfrukosten, utan att gå upp tidigt.",
    "image": "assets/recipes/129-frukostfrallor.webp",
    "cardImage": "assets/recipes/129-frukostfrallor-card.webp",
    "alt": "Frukostfrallor med kall jäsning över natten",
    "meals": [
      "bread",
      "baking",
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "15 min + 8–12 tim i kylen",
      "Tillagning": "15 min",
      "Portioner": "ca 14 frallor",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Swedish",
      "Make ahead",
      "Beginner friendly",
      "Budget"
    ],
    "time": 750,
    "timeLabel": "8 tim 30 min–12 tim 30 min",
    "ingredientSections": [
      {
        "title": "Deg",
        "items": [
          {
            "name": "10 g färsk jäst (en femtedel av ett paket) eller ½ påse torrjäst"
          },
          {
            "name": "5 dl kallt vatten",
            "basic": true
          },
          {
            "name": "2 tsk salt",
            "basic": true
          },
          {
            "name": "1 msk ljus sirap",
            "key": "sirap"
          },
          {
            "name": "1 dl solrosfrön",
            "key": "fron"
          },
          {
            "name": "1 dl grahamsmjöl"
          },
          {
            "name": "10–11 dl vetemjöl special (ca 650 g)",
            "key": "vetemjol"
          }
        ]
      },
      {
        "title": "Topping",
        "items": [
          {
            "name": "2 msk solrosfrön, sesamfrön eller havregryn",
            "key": "fron"
          },
          {
            "name": "Lite vetemjöl"
          }
        ]
      }
    ],
    "directions": [
      "På kvällen: rör ut jästen i det kalla vattnet i en stor bunke. Använder du torrjäst, blanda den med mjölet i stället.",
      "Tillsätt salt, sirap, solrosfrön och grahamsmjöl. Tillsätt vetemjölet lite i taget och arbeta degen i 5 minuter med en slev eller i maskin. Den ska vara kladdig och lös, inte fast.",
      "Täck bunken med lock eller plastfolie och ställ den i kylen över natten, 8–12 timmar.",
      "På morgonen: sätt ugnen på 250 grader. Klä två plåtar med bakplåtspapper.",
      "Strö rikligt med mjöl på bakbordet och vänd försiktigt ut degen utan att knåda den, så att luften stannar kvar.",
      "Strö mjöl och frön över degen och skär den i ca 14 bitar med en degskrapa eller mjölad kniv. Lyft över bitarna till plåtarna med lite mellanrum.",
      "Grädda en plåt i taget i mitten av ugnen i 12–15 minuter, tills frallorna är gyllenbruna och låter ihåligt när du knackar på undersidan. Låt svalna på galler."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg frallorna i en brödkorg med en linnehandduk och servera dem ljumma.",
          "Gott med smör och ost, apelsinmarmeladen i recept 87 eller päronsylten i recept 86.",
          "Frys frallor som blir över. Värm dem frysta i ugnen på 200 grader i 8–10 minuter, så blir de som nybakade.",
          "Låt degen stå upp till ett dygn i kylen om det passar bättre, den får bara mer smak."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "130-lussekatter",
    "title": "Saftiga lussekatter med kesella",
    "description": "Saffran, smör, mjölk och en burk kesella, hemligheten bakom lussekatter som håller sig saftiga i flera dagar. Degen lyser solgul, och bullarna rullas till klassiska S med ett russin i varje snirkel och gräddas blanka och gyllene. Luciamorgonens doft, gjord hemma.",
    "image": "assets/recipes/130-lussekatter.webp",
    "cardImage": "assets/recipes/130-lussekatter-card.webp",
    "alt": "Saftiga lussekatter med kesella",
    "meals": [
      "bread",
      "baking"
    ],
    "metadata": {
      "Förberedelse": "45 min + 75 min jäsning",
      "Tillagning": "6–8 min per plåt",
      "Portioner": "ca 40 st",
      "Nivå": "Medelsvårt"
    },
    "tags": [
      "Vegetarian",
      "Swedish",
      "Christmas",
      "Make ahead"
    ],
    "time": null,
    "timeLabel": "2 tim + gräddning",
    "ingredientSections": [
      {
        "title": "Deg",
        "items": [
          {
            "name": "1 g saffran (1 kuvert)"
          },
          {
            "name": "1½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "150 g smör",
            "key": "smor"
          },
          {
            "name": "5 dl mjölk",
            "key": "mjolk"
          },
          {
            "name": "50 g färsk jäst (1 paket)"
          },
          {
            "name": "250 g kesella naturell"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "ca 15–16 dl vetemjöl",
            "key": "vetemjol"
          }
        ]
      },
      {
        "title": "Till garnering",
        "items": [
          {
            "name": "ca 80 russin"
          },
          {
            "name": "1 ägg, uppvispat",
            "key": "agg"
          }
        ]
      }
    ],
    "directions": [
      "Mortla saffranet med 1 tsk av sockret till ett fint pulver.",
      "Smält smöret i en kastrull, häll i mjölken och värm till fingervarmt, ca 37 grader.",
      "Smula ner jästen i en bunke och rör ut den med lite av den ljumma mjölken. Häll i resten av mjölken.",
      "Rör ner saffran, socker, salt och kesella. Tillsätt mjölet lite i taget och knåda degen i 10 minuter, gärna i maskin. Den ska vara smidig och lite kladdig, inte fast.",
      "Täck degen och låt den jäsa i 45 minuter, tills den har dubblats.",
      "Vänd ut degen på mjölat bakbord och dela den i ca 40 bitar. Rulla varje bit till en ca 20 cm lång rulle och snurra ändarna åt varsitt håll till ett S.",
      "Lägg lussekatterna på plåtar med bakplåtspapper och låt dem jäsa under en handduk i 30 minuter. Sätt ugnen på 250 grader.",
      "Pensla med ägg och tryck ner ett russin i varje snirkel.",
      "Grädda mitt i ugnen i 6–8 minuter, tills de är gyllene. Låt dem svalna under en handduk, så blir de mjuka."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg lussekatterna i en korg eller på ett fat med en linneduk och några tända ljus runt, till Lucia eller adventsfika.",
          "Blötlägg russinen i varmt vatten i 10 minuter innan, så blir de mjuka och bränns inte i ugnen.",
          "Lussekatterna håller sig mjuka i 2–3 dagar tack vare kesellan, och kan frysas direkt när de har svalnat.",
          "Torra lussekatter blir fantastiska fattiga riddare (recept 5) eller bullpudding (recept 16)."
        ]
      }
    ],
    "pantryKeys": []
  },
  {
    "id": "131-agg-och-mjolkfri-kladdkaka",
    "title": "Kladdkaka utan ägg och mjölk",
    "description": "Mjölkfritt margarin, socker, kakao och havredryck rörs ihop i en kastrull på fem minuter. Kakan får en krispig, sprucken yta och en kladdig, nästan mousseaktig mitt, precis som den ska. Servera med vispad havregrädde och hallon, så märker ingen på kalaset att ägg och smör saknas.",
    "image": "assets/recipes/131-agg-och-mjolkfri-kladdkaka.webp",
    "cardImage": "assets/recipes/131-agg-och-mjolkfri-kladdkaka-card.webp",
    "alt": "Kladdkaka utan ägg och mjölk",
    "meals": [
      "baking",
      "dessert"
    ],
    "metadata": {
      "Förberedelse": "10 min",
      "Tillagning": "20–25 min",
      "Portioner": "8–10 bitar",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Swedish",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 35,
    "timeLabel": "30–35 min",
    "ingredientSections": [
      {
        "title": "Kladdkaka",
        "items": [
          {
            "name": "100 g mjölkfritt margarin + lite till formen"
          },
          {
            "name": "2½ dl strösocker",
            "key": "socker"
          },
          {
            "name": "4 msk kakao",
            "key": "kakao"
          },
          {
            "name": "2 tsk vaniljsocker",
            "key": "kryddor"
          },
          {
            "name": "1 krm salt",
            "basic": true
          },
          {
            "name": "1½ dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 dl havredryck",
            "key": "havredryck"
          },
          {
            "name": "Ströbröd eller kakao till formen",
            "key": "strobrod"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "2 dl vispbar havregrädde"
          },
          {
            "name": "1 dl frysta hallon",
            "key": "hallon"
          },
          {
            "name": "Florsocker"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 175 grader. Smörj en rund form med löstagbar kant, ca 22 cm, och strö den med kakao eller ströbröd.",
      "Smält margarinet i en kastrull och ta kastrullen från värmen.",
      "Rör ner socker, kakao, vaniljsocker och salt. Rör ner mjöl och havredryck, bara tills smeten är slät.",
      "Häll smeten i formen och grädda i nedre delen av ugnen i 20–25 minuter. Kakan ska vara fast i kanterna men fortfarande darra lite i mitten.",
      "Låt kakan svalna i formen. Ställ den gärna i kylen i en timme, då blir den extra kladdig.",
      "Vispa havregrädden till mjuka toppar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Pudra florsocker över kakan genom en sil, gärna över en pappersmall i form av ett hjärta eller en stjärna.",
          "Servera med en klick vispad havregrädde och frostiga hallon.",
          "Kontrollera att margarinet är mjölkfritt. Vissa sorter innehåller kärnmjölk.",
          "Kakan håller 3–4 dagar i kylen och går bra att frysa."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Läs alltid innehållsförteckningen. Mjölk och ägg kan gömma sig i margarin, choklad, ströbröd, buljong, korv och bröd. Laktosfritt är inte mjölkfritt, laktosfria produkter innehåller fortfarande mjölkprotein."
  },
  {
    "id": "132-aggfria-havrepannkakor",
    "title": "Tunna pannkakor på havredryck utan ägg",
    "description": "Mjöl, havredryck och en nypa salt. Smeten får vila en halvtimme och steks sedan till tunna, gyllene pannkakor med spetsiga, krispiga kanter, som rullas eller viks i trianglar. Med sylt, bär och vispad havregrädde blir torsdagens ärtsoppa och pannkaka något alla kan äta.",
    "image": "assets/recipes/132-aggfria-havrepannkakor.webp",
    "cardImage": "assets/recipes/132-aggfria-havrepannkakor-card.webp",
    "alt": "Tunna pannkakor på havredryck utan ägg",
    "meals": [
      "breakfast"
    ],
    "metadata": {
      "Förberedelse": "5 min + 30 min vila",
      "Tillagning": "25 min",
      "Portioner": "ca 12 pannkakor",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Swedish",
      "Family friendly",
      "Beginner friendly",
      "Budget"
    ],
    "time": 60,
    "timeLabel": "1 tim",
    "ingredientSections": [
      {
        "title": "Smet",
        "items": [
          {
            "name": "3 dl vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "1 msk strösocker",
            "key": "socker"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "6 dl havredryck",
            "key": "havredryck"
          },
          {
            "name": "2 msk smält mjölkfritt margarin eller rapsolja"
          },
          {
            "name": "Mjölkfritt margarin till stekning"
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Sylt, t.ex. päronsylten i recept 86"
          },
          {
            "name": "1 dl frysta bär",
            "key": "bar"
          },
          {
            "name": "2 dl vispbar havregrädde"
          }
        ]
      }
    ],
    "directions": [
      "Vispa ihop mjöl, socker, salt och hälften av havredrycken till en slät, tjock smet. Vispa i resten av havredrycken och det smälta margarinet.",
      "Låt smeten vila i 30 minuter. Då sväller mjölet och pannkakorna håller ihop bättre utan ägg.",
      "Hetta upp en stekpanna på medelhög värme och smält en liten klick margarin.",
      "Vispa om smeten och häll i ca ¾ dl. Vrid pannan så att smeten täcker botten tunt.",
      "Stek i 1½–2 minuter, tills kanterna har släppt och undersidan är gyllene. Pannkakor utan ägg behöver lite längre tid innan de går att vända. Vänd och stek 1 minut till.",
      "Lägg pannkakorna på ett fat under ett lock eller en handduk medan du steker resten."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Vik pannkakorna i trianglar och lägg dem lätt överlappande på ett fat, eller rulla dem runt en sked sylt.",
          "Toppa med en klick vispad havregrädde och tinade bär.",
          "Spritsa sylten i en tunn sicksack över pannkakorna för ett festligare intryck.",
          "Smeten håller ett dygn i kylen. Vispa om den före stekningen."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Läs alltid innehållsförteckningen. Mjölk och ägg kan gömma sig i margarin, choklad, ströbröd, buljong, korv och bröd. Laktosfritt är inte mjölkfritt, laktosfria produkter innehåller fortfarande mjölkprotein."
  },
  {
    "id": "133-aggfri-kikartsmajonas",
    "title": "Äggfri majonnäs på kikärtsspad",
    "description": "Spadet från en burk kikärtor, en sked senap och neutral olja mixas på en minut till en tjock, blank majonnäs som är svår att skilja från den vanliga. Den håller ihop potatissallad, smörgåsar och dippsåser, och blir aioli med en vitlöksklyfta. Kikärtorna sparar du till hummusen i recept 105.",
    "image": "assets/recipes/133-aggfri-kikartsmajonas.webp",
    "cardImage": "assets/recipes/133-aggfri-kikartsmajonas-card.webp",
    "alt": "Äggfri majonnäs på kikärtsspad",
    "meals": [
      "sauce",
      "basics"
    ],
    "metadata": {
      "Förberedelse": "5 min",
      "Tillagning": "0 min",
      "Portioner": "ca 3 dl",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Gluten free",
      "Zero waste",
      "Budget"
    ],
    "time": 5,
    "timeLabel": "5 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "½ dl kikärtsspad, rumsvarmt"
          },
          {
            "name": "1 tsk dijonsenap",
            "key": "senap"
          },
          {
            "name": "1 tsk äppelcidervinäger eller citronsaft"
          },
          {
            "name": "½ tsk salt",
            "basic": true
          },
          {
            "name": "½ tsk strösocker",
            "key": "socker"
          },
          {
            "name": "2½ dl neutral rapsolja"
          }
        ]
      }
    ],
    "directions": [
      "Häll kikärtsspad, senap, vinäger, salt och socker i ett högt, smalt kärl, gärna det som följer med stavmixern.",
      "Häll i all olja och låt den lägga sig överst i några sekunder.",
      "Sätt stavmixern i botten av kärlet och starta den. Låt den stå stilla tills det börjar bli vitt och tjockt i botten, och lyft den sedan långsamt uppåt så att all olja dras ner.",
      "Mixa i ca 30 sekunder till, tills majonnäsen är tjock och blank. Smaka av med salt och vinäger.",
      "Skrapa över majonnäsen i en ren burk med lock och ställ den i kylen. Den tjocknar lite mer när den kallnar."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Rör ner 1 finriven vitlöksklyfta för aioli, till fisksoppan i recept 58 eller pan con tomate i recept 68.",
          "Rör ner hackade örter, chili eller lite rökt paprika för en smaksatt majonnäs.",
          "Använd den i potatissallad, coleslaw, smörgåstårta och smørrebrød (recept 20).",
          "Blir majonnäsen inte tjock, häll över den i ett annat kärl, tillsätt 1 msk nytt kikärtsspad i det första och mixa i den tunna majonnäsen långsamt igen.",
          "Majonnäsen håller ca en vecka i kylen."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Läs alltid innehållsförteckningen. Mjölk och ägg kan gömma sig i margarin, choklad, ströbröd, buljong, korv och bröd. Laktosfritt är inte mjölkfritt, laktosfria produkter innehåller fortfarande mjölkprotein."
  },
  {
    "id": "134-mjolkfri-potatisgratang",
    "title": "Krämig potatisgratäng utan mjölk",
    "description": "En påse potatis, en lök och ett paket havregrädde. Tunna potatisskivor gräddas långsamt i en vitlöksdoftande havregrädde med timjan och muskot, tills de blir krämiga inuti och gyllene och krispiga överst. Söndagsstekens bästa vän, som även den mjölkallergiska kan ta två portioner av.",
    "image": "assets/recipes/134-mjolkfri-potatisgratang.webp",
    "cardImage": "assets/recipes/134-mjolkfri-potatisgratang-card.webp",
    "alt": "Krämig potatisgratäng utan mjölk",
    "meals": [
      "side"
    ],
    "metadata": {
      "Förberedelse": "20 min",
      "Tillagning": "60 min + 10 min vila",
      "Portioner": "4–6 som tillbehör",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Vegan",
      "Swedish",
      "Sunday dinner",
      "Beginner friendly",
      "Budget"
    ],
    "time": 90,
    "timeLabel": "1 tim 30 min",
    "ingredientSections": [
      {
        "title": "",
        "items": [
          {
            "name": "1 kg potatis, gärna en blandning av fast och mjölig",
            "key": "potatis"
          },
          {
            "name": "1 gul lök",
            "key": "lok"
          },
          {
            "name": "2 vitlöksklyftor",
            "key": "vitlok"
          },
          {
            "name": "4 dl havregrädde (matlagning)",
            "key": "havregradde"
          },
          {
            "name": "1 dl havredryck",
            "key": "havredryck"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "2 krm vitpeppar",
            "basic": true
          },
          {
            "name": "1 krm riven muskotnöt"
          },
          {
            "name": "1 tsk torkad timjan, eller några kvistar färsk",
            "key": "orter"
          },
          {
            "name": "1 msk mjölkfritt margarin till formen"
          },
          {
            "name": "1 dl riven vegansk ost eller 2 msk ströbröd (valfritt)"
          }
        ]
      }
    ],
    "directions": [
      "Sätt ugnen på 200 grader. Smörj en ugnsform, ca 20 × 30 cm.",
      "Skala potatisen och skiva den tunt, ca 3 mm, gärna med en mandolin. Skölj inte skivorna, stärkelsen gör gratängen krämig.",
      "Skala och skiva löken tunt och finriv vitlöken.",
      "Värm havregrädde, havredryck, vitlök, salt, vitpeppar, muskot och timjan i en stor kastrull tills det precis börjar sjuda.",
      "Lägg i potatis och lök, vänd runt och låt sjuda i 5 minuter under omrörning, så att gratängen tjocknar och blir krämigare.",
      "Häll allt i formen och jämna till ytan. Strö över ost eller ströbröd.",
      "Grädda i mitten av ugnen i 50–60 minuter, tills potatisen är mjuk när du sticker i en kniv och ytan är gyllenbrun. Lägg folie över om ytan mörknar för snabbt.",
      "Låt gratängen vila i 10 minuter före servering, så sätter sig krämen."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Strö över några färska timjankvistar och lite nymald peppar precis före servering.",
          "Servera till stek, köttbullarna i recept 135, grillad fisk eller helrostad blomkål (recept 69).",
          "Alla veganska ostar smälter inte. Välj en som är märkt för gratinering, eller använd ströbröd i stället.",
          "Gratängen kan förberedas en dag i förväg och gräddas direkt från kylen. Räkna då med 15 minuter extra."
        ]
      }
    ],
    "pantryKeys": [],
    "beforeYouStart": "Läs alltid innehållsförteckningen. Mjölk och ägg kan gömma sig i margarin, choklad, ströbröd, buljong, korv och bröd. Laktosfritt är inte mjölkfritt, laktosfria produkter innehåller fortfarande mjölkprotein."
  },
  {
    "id": "135-mjolkfria-kottbullar-med-graddsas",
    "title": "Köttbullar utan ägg och mjölk med gräddsås på havregrädde",
    "description": "Ett paket köttfärs, en kall kokt potatis från igår och en skvätt havredryck. Potatisen tar äggets plats och gör köttbullarna mjuka och saftiga, och gräddsåsen blir lika len med havregrädde. Med lingon, pressgurka och potatismos blir Sveriges nationalrätt något alla vid bordet kan äta.",
    "image": "assets/recipes/135-mjolkfria-kottbullar-med-graddsas.webp",
    "cardImage": "assets/recipes/135-mjolkfria-kottbullar-med-graddsas-card.webp",
    "alt": "Köttbullar utan ägg och mjölk med gräddsås på havregrädde",
    "meals": [
      "main"
    ],
    "metadata": {
      "Förberedelse": "25 min",
      "Tillagning": "25 min",
      "Portioner": "4 (ca 40 köttbullar)",
      "Nivå": "Nybörjare"
    },
    "tags": [
      "Dairy free",
      "Egg free",
      "Swedish",
      "Comfort food",
      "Family friendly",
      "Leftovers",
      "Beginner friendly",
      "Budget"
    ],
    "time": 50,
    "timeLabel": "50 min",
    "ingredientSections": [
      {
        "title": "Köttbullar",
        "items": [
          {
            "name": "½ dl ströbröd utan mjölk och ägg",
            "key": "strobrod"
          },
          {
            "name": "1 dl havredryck",
            "key": "havredryck"
          },
          {
            "name": "1 liten gul lök",
            "key": "lok"
          },
          {
            "name": "1 kall kokt potatis (ca 100 g)",
            "key": "potatis"
          },
          {
            "name": "500 g blandfärs",
            "key": "blandfars"
          },
          {
            "name": "1 tsk salt",
            "basic": true
          },
          {
            "name": "1 krm svartpeppar",
            "basic": true
          },
          {
            "name": "1 krm malen kryddpeppar",
            "key": "kryddor"
          },
          {
            "name": "2 msk mjölkfritt margarin eller rapsolja till stekning"
          }
        ]
      },
      {
        "title": "Gräddsås",
        "items": [
          {
            "name": "1 msk vetemjöl",
            "key": "vetemjol"
          },
          {
            "name": "3 dl havregrädde (matlagning)",
            "key": "havregradde"
          },
          {
            "name": "1 dl vatten + ½ buljongtärning utan mjölk",
            "key": "buljong"
          },
          {
            "name": "1 tsk japansk soja",
            "key": "soja"
          },
          {
            "name": "1 tsk svartvinbärsgelé eller rönnbärsgelé"
          },
          {
            "name": "Salt och svartpeppar",
            "basic": true
          }
        ]
      },
      {
        "title": "Till servering",
        "items": [
          {
            "name": "Potatismos med havredryck och mjölkfritt margarin, eller kokt potatis"
          },
          {
            "name": "Rårörda lingon",
            "key": "lingon"
          },
          {
            "name": "Pressgurka, gärna från recept 72"
          },
          {
            "name": "Hackad persilja",
            "key": "orter"
          }
        ]
      }
    ],
    "directions": [
      "Rör ihop ströbröd och havredryck och låt svälla i 10 minuter.",
      "Riv löken och den kalla potatisen fint. Blanda dem med ströbrödsblandningen, färs, salt, peppar och kryddpeppar. Arbeta ihop smeten bara tills den är jämn.",
      "Rulla köttbullar, ca 3 cm, med fuktade händer. Lägg dem på en skärbräda eller en fuktad tallrik.",
      "Hetta upp margarinet i en stor stekpanna på medelvärme. Stek köttbullarna i omgångar i ca 8 minuter, tills de har fått fin färg runt om och är genomstekta. Skaka pannan då och då, så blir de runda. Lägg dem i en form under folie.",
      "Strö mjölet i stekpannan med stekfettet och rör i 1 minut. Vispa i havregrädde, vatten och buljongtärning och låt sjuda i 3–4 minuter, tills såsen har tjocknat.",
      "Smaka av med soja, gelé, salt och peppar. Lägg tillbaka köttbullarna i såsen och låt dem bli varma."
    ],
    "extraSections": [
      {
        "title": "Dekoration och servering",
        "items": [
          "Lägg en hög potatismos på varje tallrik, köttbullar bredvid och gräddsås över både mos och köttbullar.",
          "Servera med rårörda lingon, pressgurka och lite hackad persilja.",
          "Kontrollera innehållsförteckningen på ströbröd, buljongtärning och margarin. Alla sorter är inte fria från mjölk och ägg.",
          "Köttbullarna går bra att frysa, stekta eller råa på en plåt."
        ]
      }
    ],
    "pantryKeys": [
      "blandfars",
      "potatis",
      "havregradde",
      "lok"
    ],
    "beforeYouStart": "Läs alltid innehållsförteckningen. Mjölk och ägg kan gömma sig i margarin, choklad, ströbröd, buljong, korv och bröd. Laktosfritt är inte mjölkfritt, laktosfria produkter innehåller fortfarande mjölkprotein."
  }
];
