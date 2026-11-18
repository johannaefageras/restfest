"use strict";

// Reviewed against the artwork in assets/icons/. These are food keys, so aliases and plural
// forms inherit the same picture without changing how an ingredient matches recipes.
// Only the home page loads this file. Unlisted foods keep their food group's icon.
const pantryIconFoods = {
  artichoke: [
    "kronartskocka", "kronartskocksbottnar", "kronartskockshjartan", "inlagda-kronartskocksbottnar",
    "marinerade-kronartskockor",
  ],
  asparagus: ["sparris", "gron-sparris", "vit-sparris", "minisparris", "sparris-pa-burk"],
  avocados: ["avokado", "fryst-avokado-i-bitar"],
  beetroots: ["rodbetor", "gulbeta", "knippbetor", "polkabeta"],
  "bell-peppers": [
    "paprika", "orange-paprika", "paprikamix", "snackpaprika", "spetspaprika", "strimlad-paprika",
    "grillad-paprika",
  ],
  "bok-choy": ["pak-choi", "choi-sum", "tatsoi"],
  broccoli: ["broccoli", "broccolini", "thaibroccoli-kailan"],
  "brussel-sprouts": ["brysselkal", "brysselkal-pa-stjalk"],
  carrot: [
    "morot", "knippmorotter", "lila-morotter", "morotsmix-med-flera-farger", "snackmorotter",
    "morotsstavar", "riven-morot", "skalade-morotter", "minimorotter", "skivade-morotter",
  ],
  cauliflower: ["blomkal", "lila-blomkal", "blomkalsbuketter", "blomkalsris", "romanesco"],
  celery: ["selleri"],
  "chili-pepper": [
    "gron-chili", "rod-chili", "serranochili", "thaichili", "anchochili", "torkad-chili",
    "fryst-hackad-chili", "kashmiri-chili", "inlagd-chili",
  ],
  corn: ["majs", "majskolv", "majskolvar", "minimajs", "fardigkokta-majskolvar"],
  cucumber: ["gurka", "minigurka", "vasterasgurka"],
  eggplant: ["aubergine", "miniaubergine", "thaiaubergine", "grillad-aubergine"],
  fennel: ["fankal"],
  garlic: [
    "vitlok", "farsk-vitlok", "solovitlok", "svart-vitlok", "vitloksflata", "skalade-vitloksklyftor",
    "hackad-vitlok", "marinerad-vitlok",
  ],
  ginger: ["ingefara", "fryst-ingefara", "gurkmeja", "galangal"],
  jalapenos: ["jalapeno", "jalapenos"],
  "green-cabbage": ["kal", "savojkal", "kinakal", "strimlad-vitkal-och-morot", "stuvad-vitkal"],
  kale: ["gronkal", "svartkal"],
  "knobby-tubers": ["jordartskocka", "jams", "taro"],
  kohlrabi: ["kalrabbi"],
  leeks: ["purjolok"],
  parsnips: ["persiljerot"],
  radishes: ["radisa", "rattika", "svart-rattika"],
  "red-cabbage": ["rod-spetskal", "strimlad-rodkal", "kokt-rodkal", "inlagd-rodkal"],
  "red-onion": ["rodlok"],
  rhubarb: ["rabarber"],
  "root-vegetables": [
    "rotfrukter", "potatis", "bakpotatis", "bla-potatis", "delikatesspotatis", "rod-potatis",
    "skalad-potatis", "smapotatis", "sparrispotatis", "skivad-fryst-potatis", "kalrot", "majrova",
    "pepparrot", "svartrot", "kassava", "rotfruktsmix",
  ],
  salad: [
    "sallad", "bataviasallad", "ekbladssallad", "endiv", "frisesallad", "hjartsallad", "huvudsallad",
    "krispsallad", "kruksallad", "lollo-bianco", "lollo-rosso", "machesallad", "plocksallat",
    "romansalladshjartan", "strimlad-isbergssallad",
  ],
  "bagged-salad": ["babyleaf", "salladskit", "salladsmix"],
  shallots: ["schalottenlok", "bananschalottenlok"],
  spinach: ["spenat", "vattenspenat", "hackad-spenat", "stuvad-spenat", "mangold"],
  "spring-onions": ["salladslok"],
  sprout: [
    "alfalfagroddar", "broccoligroddar", "bongroddar", "linsgroddar", "purjoloksgroddar",
    "radisgroddar", "rodbetsgroddar", "solrosskott", "artskott", "krasse", "mikrogront",
  ],
  "sweet-potatoes": ["sotpotatis", "lila-sotpotatis", "tarnad-sotpotatis", "fryst-tarnad-sotpotatis"],
  "butternut-squash": [
    "pumpa", "tarnad-butternutpumpa", "muskotpumpa", "hokkaidopumpa", "halloweenpumpa",
    "spaghettipumpa",
  ],
  tomato: [
    "tomat", "babyplommontomater", "bifftomater", "grona-tomater", "gula-tomater", "oxhjartatomat",
    "tomatmix", "halvtorkade-tomater", "soltorkade-tomater",
  ],
  vegetables: [
    "gronsaker", "wokmix", "farsk-soppmix", "grillgronsaksmix", "ugnsgronsaksmix", "grillade-gronsaker",
    "gronsaksblandning", "soppgront", "wokgronsaker", "art-majs-paprika", "artor-och-morotter",
  ],
  "yellow-onions": ["lok", "farsk-silverlok", "vit-lok", "parllok", "steklok", "hackad-lok"],
  "pickle-jar": [
    "saltgurka", "cornichons", "smorgasgurka", "senapsgurka", "mixed-pickles", "pressgurka", "relish",
    "inlagd-gurka", "surkal",
  ],
  "potato-wedges": [
    "klyftpotatis", "rostad-potatis", "sotpotatispommes", "rotfruktspommes", "pommes-frites",
  ],
  capers: ["kapris", "kaprisbar", "kapris-i-salt"],
  chanterelles: ["kantareller", "trattkantareller", "torkade-trattkantareller"],
  "button-mushrooms": [
    "svamp", "bruna-champinjoner", "skivade-champinjoner", "marinerade-champinjoner",
    "champinjoner-pa-burk", "fryst-champinjon-i-skivor",
  ],

  beans: [
    "bonor", "vita-bonor", "stora-vita-bonor", "bondbonor", "lupinbonor", "adukibonor", "bakade-bonor",
    "borlottibonor", "bruna-bonor", "butterbonor", "bonmix", "cannellinibonor", "chilibonor",
    "flageoletbonor", "limabonor", "mungbonor", "pintobonor", "roda-bonor", "sojabonor",
    "svartogda-bonor", "torkade-bondbonor", "uridbonor-urad-dal", "vita-bonor-i-tomatsas", "akerbonor",
    "favabonor", "foul-medames-kokta-favabonor",
  ],
  chickpeas: ["kikarter", "chana-dal-delade-kikartor"],
  lentils: [
    "linser", "fardigkokta-linser", "belugalinser", "bruna-linser", "franska-grona-linser",
    "gula-linser", "linser-pa-burk",
  ],
  edamame: ["edamame", "skalade-edamamebonor"],
  "green-beans": ["haricots-verts", "brytbonor", "langbonor", "rosenbonor", "skarbonor", "vaxbonor"],
  peas: [
    "arter", "artor", "farska-artor-i-balja", "sockerartor", "sugarsnaps", "graartor",
    "grona-torkade-artor",
  ],

  apple: [
    "apple", "grona-applen", "roda-applen", "appelklyftor-i-pase", "appelringar", "krispiga-appelchips",
  ],
  apricots: ["aprikos-frukt", "aprikos"],
  bananas: ["banan", "matbanan", "minibanan", "roda-bananer", "bananskivor", "bananchips"],
  berries: [
    "bar", "svartvinbar", "farsk-barmix", "barmix", "skogsbarsmix",
    "tranbar", "torkade-tranbar", "roda-vinbar", "vita-vinbar", "krusbar", "hjortron",
    "havtorn", "aronia", "akerbar", "mullbar", "torkade-mullbar",
  ],
  blackberries: ["bjornbar"],
  blueberries: ["blabar", "vilda-blabar", "torkade-blabar"],
  cherries: ["korsbar", "bigarraer", "surkorsbar", "torkade-korsbar"],
  clementines: ["clementin", "mandarin", "satsuma", "mandariner-pa-burk"],
  coconut: ["kokosnot", "kokosbitar", "kokoschips", "kokosflingor"],
  dates: ["dadlar", "farska-dadlar", "medjooldadlar", "urkarnade-dadlar"],
  fig: ["fikon", "torkade-fikon"],
  grapefruit: ["grapefrukt", "blodgrapefrukt", "pomelo"],
  grapes: ["vindruvor", "grona-vindruvor", "roda-vindruvor", "svarta-vindruvor", "karnfria-vindruvor"],
  guava: ["guava"],
  lemons: ["citron", "yuzu", "bergamott"],
  limes: ["lime"],
  "lingon-berry": ["lingon"],
  mangoes: ["mango", "skuren-mango", "torkad-mango"],
  melon: [
    "cantaloupemelon", "charentaismelon", "galiamelon", "honungsmelon", "piel-de-sapo-melon",
    "skuren-melon",
  ],
  nectarines: ["nektarin"],
  oranges: ["apelsin", "blodapelsin", "juiceapelsiner"],
  papaya: ["papaya", "torkad-papaya"],
  "passion-fruit": ["passionsfrukt", "grenadilla-sot-passionsfrukt", "passionsfruktpure"],
  peaches: ["persika", "plattpersika", "frysta-persikobitar", "persikor-pa-burk"],
  pears: ["paron", "nashiparon", "torkade-paron"],
  physalis: ["physalis", "inkabar"],
  pineapple: [
    "ananas", "babyananas", "skuren-ananas", "ananas-pa-burk", "krossad-ananas", "torkad-ananas",
    "ananasbitar",
  ],
  plums: ["plommon", "gula-plommon", "krikon", "mirabeller", "katrinplommon"],
  pomegranate: ["granatapple", "granatappelkarnor", "frysta-granatappelkarnor"],
  raspberries: ["hallon", "gula-hallon"],
  strawberries: ["jordgubbar", "smultron"],
  watermelon: ["vattenmelon", "minivattenmelon", "gul-vattenmelon"],

  basil: ["rod-basilika", "thaibasilika", "fryst-basilika"],
  "bay-leaves": ["lagerblad"],
  cardamom: ["hela-kardemummakapslar", "kardemumma", "kardemummakarnor", "svart-kardemumma"],
  "cinnamon-sticks": ["kanelstanger"],
  cloves: ["kryddnejlika"],
  cilantro: ["fryst-hackad-koriander"],
  chives: ["fryst-graslok"],
  dill: ["dill", "krondill", "hackad-dill"],
  herbs: [
    "orter", "ortmix", "bouquet-garni", "dragon", "salvia", "mejram", "kyndel", "korvel", "libbsticka",
    "ramslok", "citronmeliss", "citronverbena",
  ],
  mint: ["marockansk-mynta"],
  nutmeg: ["muskotnot"],
  parsley: ["kruspersilja", "hackad-persilja"],
  saffron: ["saffran"],
  thyme: ["citrontimjan"],
  "ground-spice": [
    "kanel", "curry", "cayennepeppar", "chilipulver", "chipotlepulver", "lakritspulver", "lokpulver",
    "malen-ingefara", "malen-koriander", "rokt-paprikapulver", "senapspulver", "starkt-paprikapulver",
    "sumak", "svamppulver", "vitloksgranulat", "vitlokspulver", "allkrydda", "baharat", "bbq-rub",
    "berbere", "burritokrydda", "cajunkrydda", "chaat-masala", "chili-con-carne-krydda",
    "fajitaskrydda", "femkrydda", "garam-masala", "grillkrydda", "gulaschkrydda", "gyroskrydda",
    "hamburgerkrydda", "jerkkrydda", "kebabkrydda", "kycklingkrydda", "kottfarskrydda", "lammkrydda",
    "pepparkakskrydda", "pizzakrydda", "pommeskrydda", "potatiskrydda", "pumpkin-spice",
    "quatre-epices", "ras-el-hanout", "shawarmakrydda", "stark-curry", "tacokrydda", "tandoori-masala",
    "tikka-masala-krydda", "wokkrydda", "za-atar", "nasi-goreng-krydda", "gochugaru",
    "shichimi-togarashi", "enchiladakrydda", "aleppopeppar", "urfa-biber", "adobokrydda",
    "jollofkrydda", "mitmita", "suyakrydda",
  ],
  pepper: [
    "svartpeppar", "vitpeppar", "gronpeppar", "rosepeppar", "hel-svartpeppar", "grovmalen-svartpeppar",
    "malen-svartpeppar", "malen-vitpeppar", "pepparblandning", "pepparkvarn", "citronpeppar",
    "szechuanpeppar", "langpeppar",
  ],
  "salt-shaker": [
    "salt", "bergsalt", "chilisalt", "fint-havssalt", "fleur-de-sel", "flingsalt", "grovsalt",
    "havssalt", "himalayasalt", "joderat-bordssalt", "kala-namak-svartsalt", "kryddsalt", "lattsalt",
    "mineralsalt", "nitritsalt", "rokt-salt", "salt-utan-jod", "saltkvarn", "sellerisalt",
    "tryffelsalt", "vitlokssalt", "ortsalt",
  ],

  "blue-cheese": [
    "adelost", "bleu-d-auvergne", "cambozola", "danablu", "fourme-d-ambert", "gorgonzola",
    "graddadelost", "roquefort", "stilton",
  ],
  brie: [
    "brie", "brie-de-meaux", "brillat-savarin", "camembert", "camembert-for-ugn", "coulommiers",
    "tryffelbrie", "vitmogelost", "friterad-camembert",
  ],
  butter: [
    "smor", "ekologiskt-smor", "extrasaltat-smor", "laktosfritt-smor", "portionssmor",
    "smor-med-havssalt", "ghee", "kryddsmor", "tryffelsmor", "vitlokssmor", "ortsmor",
    "vaxtbaserat-smor", "bakmargarin", "stekmargarin",
  ],
  "butter-spread": [
    "bordsmargarin", "lattmargarin", "mjolkfritt-margarin", "smorblandning", "latt-smorblandning",
    "bredbart-havrepalagg",
  ],
  cheese: [
    "cheddar", "ost-lagrad", "getost", "comte", "danbo", "edamer", "ekologisk-hardost",
    "emmentaler", "fontina", "farost", "gouda", "gruyere", "graddost", "havarti", "hard-getost",
    "jarlsberg", "julost", "kashkaval", "kittost", "klosterost", "kryddost", "kumminost",
    "lagrad-cheddar", "lagrad-gouda", "lattost", "maasdam", "manchego", "mellanlagrad-ost", "mimolette",
    "morbier", "provolone", "raclette", "red-leicester", "rokt-ost", "svecia", "tete-de-moine",
    "tilsiter", "vallagrad-ost", "riven-vegansk-ost", "skivad-vegansk-ost",
    "vegansk-ost", "hamburgerost", "pizzaost", "riven-greve", "riven-lagrad-ost", "riven-lattost",
    "riven-prastost", "riven-vasterbottensost", "skivad-cheddar", "skivad-edamer", "skivad-emmentaler",
    "skivad-gouda", "skivad-greve", "skivad-havarti", "skivad-herrgardsost", "skivad-hushallsost",
    "skivad-lagrad-ost", "skivad-lattost", "skivad-maasdam", "skivad-prastost", "snackost",
    "tex-mex-ost", "tarnad-ost", "laktosfri-hardost", "laktosfri-skivad-ost", "laktosfri-riven-ost",
  ],
  halloumi: ["halloumi", "chilihalloumi", "laktosfri-halloumi", "vegansk-grillost"],
  "cottage-cheese": ["keso", "laktosfri-keso", "latt-keso", "smaksatt-keso", "keso-med-sylt"],
  "cream-cheese": [
    "farskost", "vegansk-farskost", "mascarpone", "ekologisk-farskost", "fromage-frais", "getfarskost",
    "grasloksfarskost", "labneh", "laktosfri-farskost", "latt-farskost", "paprikafarskost",
    "pepparrotsfarskost", "ricotta", "smaksatt-farskost", "stracchino", "twarog-tvorog",
    "vitloksfarskost", "ortfarskost", "laktosfri-mascarpone",
  ],
  cream: [
    "gradde", "matlagningsgradde", "buljonggradde", "clotted-cream", "dubbelgradde-creme-double",
    "ekologisk-gradde", "kaffegradde", "laktosfri-matlagningsgradde", "laktosfri-vispgradde",
    "langtidshallbar-gradde", "latt-matlagningsgradde", "mellangradde", "smaksatt-matlagningsgradde",
    "syrad-gradde", "havregradde", "risgradde", "sojagradde", "vispbar-havregradde",
    "vispbar-kokosgradde",
  ],
  "creme-fraiche": [
    "creme-fraiche", "graddfil", "ekologisk-creme-fraiche", "laktosfri-creme-fraiche",
    "latt-creme-fraiche", "latt-graddfil", "smaksatt-creme-fraiche", "smetana", "havrefraiche",
    "sojafraiche", "vaxtbaserad-graddfil", "laktosfri-graddfil", "laktosfri-smetana", "romme",
  ],
  feta: [
    "fetaost", "salladsost-i-olja", "tarnad-salladsost", "vit-ost-beyaz-peynir", "marinerad-feta",
    "laktosfri-fetaost", "vegansk-salladsost",
  ],
  "milk-carton-2": [
    "mjolk", "barista-mjolk", "chokladmjolk", "ekologisk-mjolk", "farmjolk", "getmjolk",
    "jordgubbsmjolk", "kaffemjolk", "karnmjolk", "laktosfri-lattmjolk", "laktosfri-mellanmjolk",
    "laktosfri-minimjolk", "laktosfri-standardmjolk", "lantmjolk", "langtidshallbar-mjolk", "minimjolk",
    "ohomogeniserad-mjolk", "proteinmjolk", "ramjolk", "bovetedryck", "cashewdryck",
    "hampadryck", "hasselnotsdryck", "kokosdryck", "mandeldryck", "osotad-mandeldryck",
    "potatisdryck", "risdryck", "artdryck", "laktosfri-chokladmjolk",
  ],
  "oat-milk": [
    "havredryck", "barista-havredryck", "chokladhavredryck", "ekologisk-havredryck",
    "glutenfri-havredryck",
  ],
  "soy-milk": ["sojadryck", "barista-sojadryck", "chokladsojadryck", "osotad-sojadryck", "vaniljsojadryck"],
  mozzarella: [
    "mozzarella", "buffelmozzarella", "burrata", "minimozzarella", "stracciatella",
    "marinerade-mozzarellakulor", "laktosfri-mozzarella", "vegansk-mozzarella", "riven-mozzarella",
  ],
  parmesan: ["ost", "hyvlad-parmesan", "parmesanflarn", "riven-grana-padano", "riven-parmesan"],
  quark: [
    "kvarg", "fet-kvarg", "laktosfri-kvarg", "latt-kvarg", "proteinkvarg", "smaksatt-kvarg",
    "vaniljkvarg", "sojakvarg", "skyr", "smaksatt-skyr", "yoghurtkvarg",
  ],
  "sour-milk": [
    "filmjolk", "a-fil", "ekologisk-filmjolk", "filbunke", "fjallfil", "kefir", "laktosfri-filmjolk",
    "laktosfri-kefir", "langfil", "lattfil", "mellanfil", "probiotisk-fil", "smaksatt-fil", "ymer",
    "viili-finsk-langfil",
  ],
  yoghurt: [
    "yoghurt", "barnyoghurt", "bulgarisk-yoghurt", "dessertyoghurt", "ekologisk-yoghurt",
    "fruktyoghurt", "faryoghurt", "getyoghurt", "laktosfri-yoghurt", "lattyoghurt", "mild-yoghurt",
    "proteinyoghurt", "rysk-yoghurt", "vaniljyoghurt", "yoghurt-med-topping",
    "yoghurt-utan-tillsatt-socker", "havreyoghurt", "kokosyoghurt", "mandelyoghurt",
    "smaksatt-havreyoghurt", "sojayoghurt", "laktosfri-grekisk-yoghurt",
  ],

  bacon: [
    "bacon", "baconbit", "baconstrossel", "bacontarningar", "ekologiskt-bacon", "frukostbacon",
    "forstekt-bacon", "kalkonbacon", "kycklingbacon", "pancetta", "rokt-notbacon", "strimlat-bacon",
    "tjockskivat-bacon", "vegobacon",
  ],
  ham: [
    "julskinka", "kassler", "rimmad-julskinka-okokt", "basturokt-skinka", "honungsskinka",
    "lantskinka", "pepparskinka", "skivad-julskinka", "skivad-kassler", "tarnad-skinka", "olskinka",
    "lufttorkad-skinka", "parmaskinka", "serranoskinka", "spickeskinka", "vegoskinka",
  ],
  "liver-pate": [
    "leverpastej", "ankleverpate", "bredbar-leverpastej", "grovhackad-leverpastej", "gasleverpate",
    "kalvleverpastej", "kycklingleverpate", "latt-leverpastej", "skivbar-leverpastej",
    "smaksatt-leverpastej", "ugnsbakad-leverpastej", "dansk-leverpastej",
  ],
  "pork-chops": [
    "flaskkotlett", "benfri-flaskkotlett", "kalvkotlett", "lammkotletter", "vildsvinskotlett",
    "marinerade-kotletter", "marinerade-lammkotletter",
  ],
  "minced-meat": [
    "blandfars", "flaskfars", "lammfars", "ekologisk-notfars", "hamburgerfars", "hjortfars",
    "hogrevsfars", "kalvfars", "kryddad-tacofars", "latt-notfars", "renfars", "salsicciafars",
    "vildsvinsfars", "viltfars", "algfars", "kycklingfars", "kalkonfars", "tacofars",
  ],
  "sausages": [
    "falukorv", "brackkorv", "chilikorv", "cocktailkorv", "flaskkorv", "frukostkorv", "grillkorv",
    "grynkorv", "julkorv", "kalkonkorv", "kokt-kottkorv", "kryddig-grillkorv", "kycklingkorv",
    "lammkorv", "lantkorv", "medisterkorv", "nurnbergerkorv", "ostkorv",
    "oxgrillare-grillkorv-av-notkott", "pilsnerkorv-pa-burk", "potatiskorv", "prinskorv", "renkorv",
    "rakorv", "tjock-grillkorv", "varmkorv", "vildsvinskorv", "viltkorv", "varmlandskorv", "wienerkorv",
    "algkorv", "jaktkorv", "olkorv", "rode-polser-roda-danska-korvar", "vegobratwurst", "vegochorizo",
    "vegofalukorv", "vegogrillkorv", "vegokabanoss", "vegokorv", "vegoprinskorv", "vegovarmkorv",
    "tofukorv", "bratwurst", "chorizo", "isterband", "kabanoss", "merguez", "salsiccia", "kabanosy",
  ],
  salami: [
    "salami", "dansk-salami", "milanosalami", "pepparsalami", "pepperoni", "salamipinnar",
    "tryffelsalami", "ungersk-salami", "viltsalami", "vitlokssalami", "vegopepperoni", "vegosalami",
  ],
  "roast-chicken": [
    "kyckling", "ekologisk-kyckling", "gardskyckling", "halalkyckling", "majskyckling", "hel-kalkon",
    "hel-anka", "hel-gas", "kokhona", "poussin", "parlhona",
  ],
  "chicken-drumstick": [
    "kycklingben-drumsticks", "kycklingdelar", "kycklinglar", "kycklingvingar", "kalkonklubbor",
    "kalkonlar", "kalkonvingar", "anklar", "gaslar", "bbq-vingar", "buffalo-wings",
    "grillade-kycklingklubbor", "grillade-kycklinglar", "marinerade-kycklingklubbor",
    "marinerade-kycklingvingar",
  ],
  "chicken-fillets": [
    "kycklinginnerfile", "kycklingminutfile", "strimlad-kyckling", "tarnad-kycklingfile",
    "kalkonbrost", "kalkonfile", "kalkoninnerfile", "strimlad-kalkon", "marinerad-kycklingfile",
    "marinerad-kycklinglarfile", "rokt-kycklingfile", "sous-vide-kycklingfile",
  ],
  "white-fish-fillet": [
    "vit-fisk", "abborrfile", "gosfile", "torskrygg", "hokifile", "koljafile", "kummelfile",
    "pangasiusfile", "rodspattafile", "tilapiafile", "fiskblock",
  ],
  "salmon-fillet": [
    "lax", "laxfile", "laxkotletter", "laxsida", "marinerad-laxfile", "sashimilax", "gravad-lax",
    "kallrokta-laxbitar", "rokt-laxsida", "varmrokt-pepparlax", "inkokt-lax", "rimmad-lax", "sotad-lax",
    "frysta-laxkuber", "laxportioner", "vildfangad-lax",
  ],
  "canned-fish": [
    "makrill", "tonfisk", "sardeller", "ansjovis", "sardiner", "kronsardiner", "surstromming",
    "brisling-i-tomatsas", "kippers", "lax-pa-burk", "makrillfile-i-olja", "sardiner-i-tomatsas",
    "sprats-rokt-skarpsill-i-olja", "tonfisk-i-vatten", "tonfiskfile-i-olivolja",
    "tonfisksallad-pa-burk", "torsklever", "torskrom-pa-burk",
  ],
  "pickled-herring": [
    "5-minuterssill", "bismarcksill", "brantevikssill", "citronsill", "currysill", "dillsill",
    "gaffelbitar", "glasmastarsill", "inlagd-sill", "inlaggningssill", "julsill", "kryddsill",
    "kraftsill", "loksill", "matjessill", "pasksill", "rollmops", "saltsill", "senapssill",
    "sherrysill", "skargardssill", "tomatsill", "vitlokssill", "inlagd-stromming",
    "stekt-inlagd-stromming", "gravad-stromming",
  ],
  shrimp: [
    "rakor", "rokta-rakor", "handskalade-rakor", "jatterakor", "oskalade-rakor", "rakor-i-lake",
    "scampi", "tigerrakor", "vitloksmarinerade-rakor", "frysta-rakor", "raa-rakor", "torkade-rakor",
  ],
  lobster: [
    "hummer", "hummerstjartar", "havskraftor", "kraftor", "kraftstjartar", "languster", "signalkraftor",
  ],
  roe: [
    "rom", "forellrom", "gaddrom", "ishavsrom", "kalix-lojrom", "laxrom", "lojrom", "sikrom",
    "storkaviar", "tobiko", "torskrom", "smorgaskaviar-pa-burk", "tangkaviar-tangrom",
  ],
  egg: ["agg", "ankagg", "gasagg", "kokta-agg", "vaktelagg", "aggvita"],
  "egg-carton": [
    "ekologiska-agg", "extra-stora-agg", "frigaende-agg", "medelstora-agg", "sma-agg", "stora-agg",
    "utomhusagg",
  ],

  "almond-oil": ["sesamolja", "valnotsolja"],
  "almonds-2": ["mandel", "bittermandel", "hackad-mandel", "marconamandlar", "skallad-mandel"],
  cashews: ["cashewnotter", "chilicashewnotter", "salta-cashewnotter"],
  hazelnuts: ["hasselnot", "hackade-hasselnotter", "hasselnotssmor", "hasselnotspasta"],
  peanuts: [
    "jordnotter", "jordnotter-i-skal", "osaltade-jordnotter", "honungsrostade-jordnotter",
    "salta-jordnotter", "jordnotssmor", "jordnotssmor-utan-tillsatt-socker", "krispigt-jordnotssmor",
  ],
  "pine-nuts": ["pinjenotter"],
  pistachios: [
    "pistagenotter", "skalade-pistagenotter", "hackade-pistagenotter", "salta-pistagenotter",
    "pistagekram", "pistagepasta",
  ],
  seeds: [
    "fron", "basilikafron", "chiafron", "froblandning", "hampafron", "krossat-linfro", "linfron",
    "melonkarnor", "psylliumfron", "solroskarnor", "svarta-sesamfron", "vallmofron", "egusifron",
    "ogbonofron", "rostade-och-saltade-solrosfron", "snackmix-med-fron",
  ],
  flour: [
    "vetemjol", "potatismjol", "majsmjol", "bovetemjol", "majsstarkelse", "rismjol", "mandelmjol",
    "kikartsmjol", "sojamjol", "lupinmjol", "kokosmjol", "hasselnotsmjol", "durramjol", "bananmjol",
    "klibbrismjol", "tempuramjol", "chapatimjol", "pizzamjol", "semola-rimacinata",
    "arepamjol-forkokt-majsmjol", "fufumjol", "kassavamjol", "teffmjol", "vitt-majsmjol", "yamsmjol",
  ],
  oats: [
    "havre", "fiberhavregryn", "grova-havregryn", "havrekli", "havrekross", "skuren-havre-steel-cut",
    "snabbhavregryn",
  ],
  porridge: [
    "grot", "fardig-havregrynsgrot", "mannagrynsgrot", "portionsgrot", "proteingrot", "overnight-oats",
    "barngrot", "fruktgrot-for-barn", "fullkornsgrot-for-barn", "havregrot-for-barn",
    "mjolkfri-barngrot", "risgrot-for-barn",
  ],
  cornflakes: ["majsflingor", "sockrade-cornflakes"],
  granola: [
    "granola", "bargranola", "chokladgranola", "granola-utan-tillsatt-socker", "notgranola",
    "proteingranola", "appel-och-kanelgranola", "glutenfri-granola", "ketogranola", "musli",
    "birchermusli", "barmusli", "chokladmusli", "crunchmusli", "fruktmusli", "fullkornsmusli",
    "notmusli", "osotad-musli", "tropisk-musli", "glutenfri-musli", "proteinmusli",
  ],
  "rice-grains": [
    "ris", "arborioris", "bombaris", "carnaroliris", "fullkornsbasmatiris", "fullkornsris", "grotris",
    "havreris", "klibbris", "kokpasris", "langkornigt-ris", "mikroris", "paellaris", "parboiled-ris",
    "risgryn", "rundkornigt-ris", "raris", "rott-ris", "smaksatt-ris", "snabbris", "sushiris",
    "svart-ris", "vialone-nano-ris", "vildris", "vildrismix",
  ],
  "penne-jar": [
    "pasta", "bokstavspasta", "bonpasta", "casarecce", "cavatappi", "conchiglie", "conchiglioni",
    "dinkelpasta", "ditalini", "figurpasta", "fullkornsmakaroner", "fullkornspasta", "gemelli",
    "idealmakaroner", "kikartspasta", "linspasta", "majspasta", "orecchiette", "orzo", "paccheri",
    "pasta-av-sojabonor", "radiatori", "rotelle-hjulpasta", "snabbmakaroner", "soppasta",
    "strozzapreti", "tortiglioni", "tricolorepasta", "trofie",
  ],
  spagheti: [
    "nudlar", "farsk-tagliatelle", "bucatini", "capellini", "fettuccine", "fullkornsspaghetti",
    "glasnudlar", "linguine", "mafaldine", "mienudlar", "pappardelle", "ramennudlar", "risvermicelli",
    "snabbnudlar", "sobanudlar", "somennudlar", "spaghettini", "sotpotatisnudlar-dangmyeon",
    "tagliolini", "udonnudlar", "vermicelli", "breda-risnudlar", "farska-nudlar", "farska-risnudlar",
    "farska-udonnudlar", "fardigkokta-woknudlar",
  ],
  wheat: [
    "korngryn", "matvete", "mathavre", "hela-vetekorn", "farro", "speltkarnor", "vetekross",
    "vetegroddar", "vetekli", "parlgryn", "freekeh",
  ],
  "bread-loaf": [
    "brod", "ankarstock", "barkis-bergis", "bondbrod", "brioche", "danskt-ragbrod", "finskt-ragbrod",
    "focaccia", "formfranska", "franskbrod", "fruktbrod", "frobrod", "fullkornsbrod",
    "fullkornsrostbrod", "grovbrod", "havrebrod", "halkaka", "jullimpa", "kavring", "kumminbrod",
    "karnbrod", "lantbrod", "levain", "lingonlimpa", "morotsbrod", "olivbrod", "potatisbrod",
    "pumpernickel", "ragbrod", "ragkaka", "ragsiktsbrod", "schwarzbrot", "sirapslimpa", "skargardsbrod",
    "solrosbrod", "speltbrod", "stenugnsbakat-brod", "valnotsbrod", "vortbrod", "ciabatta", "frallor",
    "frofrallor", "grahamsfrallor", "grova-frallor", "havrefrallor", "ostfrallor", "ragfrallor",
    "surdegsfrallor", "tekakor", "vallmofrallor",
  ],
  "baguette": ["fullkornsbaguette", "minibaguetter", "surdegsbaguette", "vitloksbaguette"],
  taco: ["tacoskal"],
  tortillas: [
    "tortilla", "fullkornstortillas", "majstortillas", "minitortillas", "glutenfria-tortillas",
    "lagkolhydrattortillas",
  ],
  pizza: ["pizza", "minipizza", "pizzaslice", "fryspizza", "panpizza", "vegansk-pizza", "glutenfri-fardigpizza"],
  "crisp-bread": [
    "knackebrod", "brungraddat-knackebrod", "dinkelknacke", "frukostknacke", "froknacke",
    "fullkornsknacke", "havreknacke", "miniknacke", "runda-knackebrod", "ragknacke", "sesamknacke",
    "spisbrod", "surdegsknacke", "tunt-knackebrod", "hart-tunnbrod",
  ],
  sandwiches: [
    "banh-mi", "club-sandwich", "fylld-ciabatta", "kottbullsmacka", "landgang", "ost-och-skinkfralla",
    "panini", "raksmorgas", "smorrebrod", "toast-skagen", "trekantsmacka", "aggmacka",
  ],
  crackers: [
    "kex", "cream-crackers", "frokex", "fullkornskex", "grahamskex", "havrekex",
    "kexsortiment-till-ost", "ostkex", "ragkex", "saltkex", "sesamkex", "vattenkex",
    "glutenfria-kex", "mjolkfria-kex",
  ],
  croissant: ["croissanter", "fylld-croissant", "mandelcroissant", "frysta-croissanter"],
  "cinnamon-bun": ["kanelbullar", "kanelknutar", "kanellangd", "kardemummabullar"],
  cookie: [
    "cookies", "pepparkakor", "blandade-smakakor", "bondkakor", "drommar", "hallongrottor",
    "havreflarn", "chokladflarn", "kokoskakor", "kolakakor", "notkakor", "schackrutor", "amaretti",
    "cantuccini",
  ],
  candy: ["lakrits"],
  chocolate: [
    "choklad", "chokladdroppar", "chokladknappar", "chokladspan", "hackad-choklad", "kakaomassa",
    "ljus-blockchoklad", "mork-blockchoklad", "rubychoklad", "sockerfri-bakchoklad",
    "vegansk-bakchoklad", "vit-blockchoklad", "vita-chokladdroppar", "overdragschoklad",
    "chokladbar", "ekologisk-choklad", "fylld-chokladkaka", "minichoklad", "mintchoklad",
    "mjolkchoklad", "nougatchoklad", "notchoklad", "sockerfri-choklad", "vegansk-choklad",
    "vit-choklad", "laktosfri-mjolkchoklad", "proteinchoklad", "mjolkfri-choklad",
  ],
  cocoa: ["kakao", "chokladpulver"],
  "hot-chocolate": ["drickchoklad"],
  "coconut-milk": ["kokosmjolk", "latt-kokosmjolk", "kondenserad-kokosmjolk"],
  macarons: ["macarons"],
  "strawberry-shortcake": ["jordgubbstarta", "graddtarta", "frukttarta"],
  "birthday-cake": ["chokladtarta", "marangtarta", "moussetarta", "prinsesstarta", "schwarzwaldtarta"],
  "ice-cream-cone": ["glasstrut", "glassran"],
  sundae: [
    "vaniljglass", "blabarsglass", "chokladglass", "cookie-dough-glass", "frozen-yoghurt", "gelato",
    "glass-utan-tillsatt-socker", "glassbagare", "graddglass", "hjortronglass", "jordgubbsglass",
    "kaffeglass", "kolaglass", "lakritsglass", "laktosfri-glass", "mintchokladglass", "nougatglass",
    "pistageglass", "proteinglass", "paronglass", "romrussinglass", "stracciatellaglass",
    "vaxtbaserad-glass", "havreglass", "kokosglass", "mjolkfri-glass",
  ],

  "baking-soda": ["bikarbonat", "bakpulver"],
  "canned-tomatoes": [
    "kross", "finkrossade-tomater", "korsbarstomater-pa-burk", "smaksatta-krossade-tomater",
    "tarnade-tomater",
  ],
  "coffee-bean": [
    "kaffe", "kaffebonor", "ekologiskt-kaffe", "espressomalet-kaffe", "koffeinfritt-kaffe", "kokkaffe",
    "presskaffe", "snabbkaffe", "turkiskt-kaffe",
  ],
  "honey-jar": ["honung", "akaciahonung", "fast-honung", "flytande-honung", "ljunghonung", "manukahonung"],
  hummus: ["hummus", "rodbetshummus", "smaksatt-hummus"],
  "jam-jar": [
    "apelsinmarmelad", "aprikosmarmelad", "blabarsmarmelad", "chilimarmelad", "citronmarmelad",
    "fikonmarmelad", "hallonmarmelad", "havtornsmarmelad", "ingefarsmarmelad", "jordgubbsmarmelad",
    "kvittenmarmelad-membrillo", "korsbarsmarmelad", "nyponmarmelad", "plommonmarmelad",
    "paronmarmelad", "rabarbermarmelad", "rodloksmarmelad", "ronnbarsgele", "svartvinbarsgele",
    "sylt-utan-tillsatt-socker", "vinbarsgele", "appelgele", "sockerfri-sylt", "bjornbarssylt",
    "blandbarssylt", "blabarssylt", "drottningsylt", "hallonsylt", "hjortronsylt", "jordgubbssylt",
    "krusbarssylt", "kylsylt", "korsbarssylt", "lingonsylt", "lattsylt", "plommonsylt", "rabarbersylt",
    "salmbarssylt", "svartvinbarssylt", "tranbarssylt", "akerbarssylt",
  ],
  ketchup: ["ketchup", "chiliketchup", "curryketchup", "sockerfri-ketchup"],
  mustard: [
    "senap", "fransk-senap", "grovkornig-senap", "honungssenap", "julsenap", "skansk-senap",
    "stark-senap", "sot-senap",
  ],
  mayonnaise: [
    "majo", "aioli", "gurkmajonnas", "chilimajonnas", "latt-majonnas", "srirachamajonnas",
    "tryffelmajonnas", "vegansk-majonnas", "japansk-majonnas",
  ],
  "tomato-puree": ["tomatpure"],
  "olives": [
    "oliver", "castelvetrano-oliver", "fyllda-oliver", "marinerade-oliver", "olivmix",
    "urkarnade-oliver", "mandelfyllda-oliver", "vitloksfyllda-oliver",
  ],
  "orange-juice": [
    "apelsinjuice", "apelsinjuice-med-fruktkott", "blodapelsinjuice", "farskpressad-apelsinjuice",
    "clementinjuice",
  ],
  "juice-box": [
    "ananasjuice", "aroniajuice", "druvjuice", "granatapplejuice", "grapefruktjuice", "gronsaksjuice",
    "havtornsjuice", "juice-i-portionstetra", "kallpressad-juice", "katrinplommonjuice",
    "korsbarsjuice", "morotsjuice", "multijuice", "paronjuice", "rodbetsjuice", "sellerijuice",
    "tomatjuice", "tranbarsjuice", "tropisk-juice", "appeljuice",
  ],
  "sugar-dispenser": [
    "socker", "demerarasocker", "ekologiskt-strosocker", "farinsocker", "florsocker", "kokossocker",
    "ljust-muscovadosocker", "muscovadosocker", "morkt-farinsocker", "parlsocker", "rasocker",
    "rorsocker", "syltsocker", "vaniljsocker", "vanillinsocker",
  ],
  vanilla: ["vaniljstang", "vaniljpulver", "vaniljpasta", "vaniljextrakt", "vaniljarom"],
  "potato-chips": [
    "chips", "chilichips", "dillchips", "grillchips", "graddfilschips", "kettlechips", "lattchips",
    "ost-och-lokchips", "paprikachips", "rotfruktschips", "rafflade-chips", "saltade-chips",
    "saltvinagerchips", "stapelchips", "sweet-chili-chips", "sotpotatischips", "tryffelchips",
    "tunnbrodschips", "ugnsbakade-chips",
  ],
  "popcorn": [
    "chokladpopcorn", "kolapopcorn", "micropopcorn", "ostpopcorn", "popcorn", "popcornmajs",
    "smorpopcorn", "sota-popcorn",
  ],
  "tea-bag": [
    "assamte", "ceylonte", "darjeelingte", "english-breakfast-te", "fruktte", "gront-te", "ingefarste",
    "jasminte", "kamomillte", "kvallste", "lakritste", "loste", "nyponte", "oolongte", "pepparmyntste",
    "pu-erh-te", "sencha", "smaksatt-svart-te", "svart-te", "vitt-te", "ortte",
  ],
  "soda-can": [
    "apelsinlask", "bitter-lemon", "champagnelask", "citron-och-limelask", "citronlask", "cola",
    "cream-soda", "enbarsdricka", "fladerblomslask", "fruktsoda", "ginger-ale", "grapefruktlask",
    "hallonsoda", "hantverkslask", "ingefarsol", "jordgubbslask", "julmust", "koffeinfri-cola",
    "korsbarscola", "passionsfruktlask", "paskmust", "paronsoda", "rabarberlask", "root-beer",
    "sockerdricka", "sockerfri-cola", "sockerfri-julmust", "sockerfri-lask", "appellask", "tonic",
  ],
  "saft-bottle": [
    "apelsinsaft", "blandsaft", "blabarssaft", "drickfardig-saft", "fladerblomssaft", "hallonsaft",
    "havtornssaft", "jordgubbssaft", "korsbarssaft", "lingonsaft", "paronsaft", "rabarbersaft",
    "sockerfri-saft", "svartvinbarssaft", "appelsaft", "saft-utan-tillsatt-socker",
  ],
  "tin-can": [
    "blackfisk-pa-burk", "musslor-pa-burk", "rokta-musslor-pa-burk", "krabbkott", "kottbullar-pa-burk",
    "kottgryta-pa-burk", "luncheon-meat", "skinkkonserv",
  ],
  "soup-bowl": [
    "svartsoppa", "fiskmix-till-soppa", "blomkalssoppa", "broccolisoppa", "bonsoppa", "fisksoppa",
    "fransk-loksoppa", "gron-artsoppa", "gronsakssoppa", "gulaschsoppa", "hummersoppa",
    "jordartskockssoppa", "kantarellsoppa", "kikartssoppa", "korvsoppa", "kycklingsoppa", "kalsoppa",
    "kottfarssoppa", "kottsoppa", "laxsoppa", "linssoppa", "majssoppa", "morotssoppa", "nudelsoppa",
    "nasselsoppa", "oxsvanssoppa", "palsternackssoppa", "paprikasoppa", "potatis-och-purjolokssoppa",
    "pumpasoppa", "rotfruktssoppa", "skaldjurssoppa", "sparrissoppa", "spenatsoppa", "svampsoppa",
    "sotpotatissoppa", "tacosoppa", "thailandsk-kycklingsoppa", "tomatsoppa", "zucchinisoppa",
    "artsoppa", "passoppa", "snabbsoppa", "blandad-fruktsoppa", "misosoppa", "blabarssoppa",
    "nyponsoppa", "maltidsersattningssoppa",
  ],
  "greek-salad": ["grekisk-sallad", "fetaostsallad"],
  lemonade: ["lemonad", "rosa-lemonad"],
  "sparkling-water": ["kolsyrat-vatten", "mineralvatten", "smaksatt-kolsyrat-vatten", "sodavatten"],
  "sunflower-oil": ["solrosolja"],
  "wine-bottle": [
    "matlagningsvin", "shaoxingvin", "sake", "alkoholfritt-rosevin", "alkoholfritt-rott-vin",
    "alkoholfritt-vitt-vin",
  ],
};

// Some distinct groceries intentionally share a recipe key (farfalle → pasta, basilika → örter).
// Match their typed names first so the picture can be precise while recipe matching stays intact.
const pantryIconNames = {
  basil: ["basilika", "basilikan"],
  cilantro: ["koriander", "koriandern"],
  chives: ["gräslök", "gräslöken"],
  parsley: ["persilja", "persiljan", "bladpersilja"],
  mint: ["mynta", "myntan"],
  oregano: ["oregano", "oreganon"],
  rosemary: ["rosmarin", "rosmarinen"],
  thyme: ["timjan", "timjanen"],
  rocket: ["ruccola", "ruccolan"],
  parsnips: ["palsternacka", "palsternackan", "palsternackor", "palsternackorna"],
  "celery-root": ["rotselleri", "rotsellerin"],
  "chili-pepper": ["chili", "chilin"],
  "red-cabbage": ["rödkål", "rödkålen"],
  "green-cabbage": ["vitkål", "vitkålen", "spetskål", "spetskålen"],
  farfalle: ["farfalle"],
  "penne-jar": ["penne", "rigatoni", "makaroner", "pastaskruvar", "fusilli"],
  spagheti: ["spagetti", "spaghetti", "tagliatelle"],
  baguette: ["baguette", "baguetten", "baguetter", "baguetterna"],
  "ground-spice": ["paprikapulver", "spiskummin", "malen kanel"],
  "chicken-fillets": [
    "kycklingfilé", "kycklingfiléer", "kycklingbröst", "kycklinglårfilé",
  ],
  "chicken-drumstick": ["kycklingklubbor"],
};

const pantryIconsByKey = new Map(Object.entries(pantryIconFoods).flatMap(([icon, keys]) =>
  keys.map(key => [key, icon]),
));
const pantryIconsByName = new Map(Object.entries(pantryIconNames).flatMap(([icon, names]) =>
  names.map(name => [searchKey(name), icon]),
));

function iconForPantryFood(name) {
  const key = keyForIngredient(name);
  const food = foods[key];
  if (!food) return null;
  return pantryIconsByName.get(searchKey(cleanIngredient(name)))
    ?? pantryIconsByKey.get(key)
    ?? foodGroups[food.group]?.icon
    ?? null;
}

// Keep the specific name when it has its own illustration; canonicalising "Farfalle" to "Pasta"
// would otherwise discard the name before renderPantry gets to choose its picture.
function nameForPantryFood(name, key = keyForIngredient(name)) {
  const food = foods[key];
  return food && !genericIngredientKeys.has(key) && !pantryIconsByName.has(searchKey(cleanIngredient(name)))
    ? food.name
    : capitalize(cleanIngredient(name));
}
