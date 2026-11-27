"use strict";

const foodGroups = {
  vegetables: { label: "Grönsaker", icon: "broccoli" },
  legumes: { label: "Baljväxter", icon: "beans" },
  grains: { label: "Pasta, ris & spannmål", icon: "spagheti" },
  dairy: { label: "Mejeri", icon: "milk-carton-2" },
  eggs: { label: "Ägg", icon: "eggs" },
  poultry: { label: "Fågel", icon: "chicken-drumstick" },
  fish: { label: "Fisk & skaldjur", icon: "fish" },
  meat: { label: "Kött", icon: "steak-2" },
  mushrooms: { label: "Svamp", icon: "mushrooms" },
  fruit: { label: "Frukt & bär", icon: "fruit" },
  nuts: { label: "Nötter & frön", icon: "almonds-2" },
  herbs: { label: "Örter & kryddor", icon: "spice-mills" },
  pantry: { label: "Olja & såser", icon: "olive-oil" },
};

// Categories say what kind of dish it is. The first one in a recipe's `meals` is shown on its card.
// `label` names the category in the filter, `name` is used for a single recipe when it differs.
// Diet, cuisine, occasion and the like are tags, not categories. The quick filter uses `time`.
const mealTypes = {
  main: { label: "Huvudrätter", name: "Huvudrätt", icon: "serving-cloche-1" },
  soup: { label: "Soppor", name: "Soppa", icon: "soup-bowl" },
  salad: { label: "Sallader", name: "Sallad", icon: "salad" },
  sandwich: { label: "Smörgåsar", name: "Smörgås", icon: "sandwiches" },
  starter: { label: "Förrätter", name: "Förrätt", icon: "shrimp-plate" },
  side: { label: "Tillbehör", icon: "potato-wedges" },
  sauce: { label: "Såser & röror", icon: "dip" },
  breakfast: { label: "Frukost & brunch", icon: "fried-egg" },
  snack: { label: "Mellanmål", icon: "bananas" },
  party: { label: "Mingelmat & tilltugg", icon: "appetizer-picks" },
  dessert: { label: "Desserter", name: "Dessert", icon: "sundae" },
  baking: { label: "Fika & bakning", icon: "cinnamon-bun" },
  bread: { label: "Bröd", icon: "bread-loaf" },
  candy: { label: "Godis & konfekt", icon: "candy" },
  drink: { label: "Drycker", name: "Dryck", icon: "drink" },
  preserves: { label: "Sylt, saft & inlagt", icon: "jam-jar" },
  basics: { label: "Grundrecept", icon: "bowl-and-whisk" },
  // Not a dish type: food that children eat and help make. List it after a recipe's dish type,
  // so the card still shows what kind of dish it is.
  kids: { label: "Barnvänligt", icon: "teddy-bear" },
  spa: {
    label: "Hemmaspa & behandlingar",
    name: "Hemmaspa",
    icon: "rolled-towels",
    badge: "HEMMASPA",
  },
  household: {
    label: "Hushåll & rengöring",
    icon: "spray-bottle",
    badge: "HUSHÅLL & RENGÖRING",
  },
  pets: { label: "Husdjur", icon: "dog-bone", badge: "HUSDJUR" },
  garden: {
    label: "Odling",
    icon: "pot-and-trowel",
    badge: "ODLING",
  },
};

const mealName = (meal) => mealTypes[meal].name ?? mealTypes[meal].label;

// The same difficulty names and fact icons on archive pages and generated recipes.
const difficultyLevels = {
  Nybörjare: "difficulty-level-beginner",
  Medelsvårt: "difficulty-level-intermediate",
  Avancerat: "difficulty-level-advanced",
  Mästerkock: "difficulty-level-masterchef",
};
// Older saved recipes may still use the former name for the first level.
const difficultyLabel = (value) => (value === "Lätt" ? "Nybörjare" : value);

// Recipe headings may hyphenate words of 13 letters or more (styles.css), but Chrome's Swedish
// hyphenation doesn't know English loanwords: it breaks "Halloncheesecake" as "Hallonchee-secake",
// even where the word would fit, to even out the lines. headingBreaks() puts a soft hyphen where such
// a compound meets one of these words, and the browser then breaks that word only there:
// "Hallon-cheesecake". Only the headings people see get it (recipe.njk, the cards and the archive's
// cards in app.js), so the titles stay as they are everywhere else; the scripts that read a heading's
// text take it out again. Add a loanword here when a new title breaks in the wrong place.
const headingLoanwords = [
  "cheesecake",
  "tiramisu",
  "muffins",
  "dumplings",
  "churros",
  "cookie",
  "brownie",
  "croissant",
];
function headingBreaks(text) {
  return String(text).replace(/\p{L}{13,}/gu, (word) => {
    const lower = word.toLowerCase();
    const loanword = headingLoanwords.find(
      (candidate) => lower !== candidate && lower.includes(candidate),
    );
    if (!loanword) return word;
    const start = lower.indexOf(loanword);
    return [start, start + loanword.length]
      .filter((cut) => cut > 0 && cut < word.length)
      .reduceRight(
        (marked, cut) => `${marked.slice(0, cut)}­${marked.slice(cut)}`,
        word,
      );
  });
}

// Spa, cleaning, pet and gardening recipes live on mer-an-mat.html, not in the food archive.
const nonFoodMeals = ["spa", "household", "pets", "garden"];
const isFood = (recipe) =>
  !recipe.meals.some((meal) => nonFoodMeals.includes(meal));

// The diet options supported by account preferences.
const dietTags = [
  "Vegetarian",
  "Vegan",
  "Dairy free",
  "Egg free",
  "Gluten free",
  "Lactose free",
];

// Vegan and dairy-free recipes also satisfy the diets they include.
const impliedTags = {
  Vegan: ["Vegetarian", "Dairy free", "Egg free", "Lactose free"],
  "Dairy free": ["Lactose free"],
};

function allTags(recipe) {
  return [
    ...new Set(
      (recipe.tags ?? []).flatMap((tag) => [tag, ...(impliedTags[tag] ?? [])]),
    ),
  ];
}

const hasTag = (recipe, tag) => allTags(recipe).includes(tag);

const recipeTagLabels = {
  "Alcohol free": "Alkoholfritt",
  "Alcohol free option": "Alkoholfritt alternativ",
  American: "Amerikanskt",
  Asian: "Asiatiskt",
  Autumn: "Höst",
  "Beginner friendly": "Nybörjarvänligt",
  Body: "Kropp",
  Budget: "Budget",
  Chocolate: "Choklad",
  Christmas: "Jul",
  Classic: "Klassiker",
  Cocktail: "Cocktail",
  Condiment: "Smaksättare",
  "Comfort food": "Mysig mat",
  "Dairy free": "Mjölkfritt",
  Danish: "Danskt",
  Dip: "Dipp",
  Face: "Ansikte",
  "Family friendly": "Familjevänligt",
  Feet: "Fötter",
  French: "Franskt",
  Gift: "Present",
  "Gluten free": "Glutenfritt",
  Greek: "Grekiskt",
  Hair: "Hår",
  "Hot drink": "Varm dryck",
  Indian: "Indiskt",
  Italian: "Italienskt",
  "Lactose free": "Laktosfritt",
  Leftovers: "Rester",
  Lips: "Läppar",
  "Low carb": "Kolhydratsnålt",
  Lunch: "Lunch",
  "Make ahead": "Kan förberedas",
  "Meal prep": "Matlåda",
  Mexican: "Mexikanskt",
  "Middle Eastern": "Mellanöstern",
  Natural: "Naturligt",
  "No bake": "Utan ugn",
  "Nut free": "Nötfritt",
  "One pot": "Allt i en gryta",
  Pescatarian: "Pescetariskt",
  Relaxing: "Avkopplande",
  "Shellfish free": "Skaldjursfritt",
  Soothing: "Lugnande",
  "Soy free": "Sojafritt",
  Spanish: "Spanskt",
  Stew: "Gryta",
  "Sunday dinner": "Söndagsmiddag",
  Swedish: "Svenskt",
  Thai: "Thailändskt",
  Vegan: "Veganskt",
  Vegetarian: "Vegetariskt",
  "Zero waste": "Minskar matsvinn",
  Bath: "Bad",
  Bathroom: "Badrum",
  Cat: "Katt",
  Cleaning: "Städning",
  Cordial: "Saft",
  Dog: "Hund",
  "Egg free": "Äggfritt",
  Eyes: "Ögon",
  Frozen: "Fryst",
  Grooming: "Päls- & tassvård",
  Hands: "Händer",
  "Home fragrance": "Rumsdoft",
  Jam: "Sylt",
  Kitchen: "Kök",
  Marinade: "Marinad",
  Marmalade: "Marmelad",
  Overnight: "Över natten",
  Pasta: "Pasta",
  Paws: "Tassar",
  Pickles: "Inlagt",
  Refreshing: "Uppfriskande",
  "Spice blend": "Kryddblandning",
  Treats: "Djurbelöning",
  Winter: "Vinter",
  Australian: "Australiskt",
  British: "Brittiskt",
  Chutney: "Chutney",
  Ears: "Öron",
  "Eastern European": "Östeuropeiskt",
  Enrichment: "Aktivering",
  Fermented: "Fermenterat",
  German: "Tyskt",
  Laundry: "Tvätt",
  Nose: "Nos",
  Toy: "Leksak",
  Argentinian: "Argentinskt",
  Balcony: "Balkong",
  Baking: "Bakning",
  BBQ: "Grillat",
  Beef: "Nötkött",
  Bistro: "Bistro",
  Bread: "Bröd",
  Breakfast: "Frukost",
  Brunch: "Brunch",
  Burger: "Burgare",
  Chicken: "Kyckling",
  Chinese: "Kinesiskt",
  Coffee: "Kaffe",
  Compost: "Kompost",
  Crêpes: "Crêpes",
  Crispy: "Krispigt",
  Dessert: "Dessert",
  DIY: "Gör det själv",
  Fertilizer: "Gödsling",
  Fika: "Fika",
  Fish: "Fisk",
  "Freezer friendly": "Går att frysa",
  Fresh: "Fräscht",
  Fried: "Friterat",
  Game: "Vilt",
  Gardening: "Odling",
  Halloween: "Halloween",
  Herbs: "Örter",
  Houseplants: "Krukväxter",
  Hungarian: "Ungerskt",
  Indoor: "Inomhus",
  Japanese: "Japanskt",
  Kids: "För barn",
  "Kitchen garden": "Köksodling",
  Korean: "Koreanskt",
  Lamb: "Lamm",
  "Long project": "Längre projekt",
  "Lunch box": "Lunchlåda",
  "Main course": "Huvudrätt",
  Mediterranean: "Medelhavsmat",
  Moroccan: "Marockanskt",
  Noodles: "Nudlar",
  Nordic: "Nordiskt",
  "One pan": "Allt i en panna",
  "Oven baked": "Ugnsbakat",
  Party: "Fest",
  Pork: "Fläskkött",
  Propagation: "Sticklingsförökning",
  Quick: "Snabblagat",
  Reindeer: "Ren",
  "Rice bowl": "Risskål",
  Roast: "Ugnsstekt",
  Salad: "Sallad",
  Sandwich: "Smörgås",
  Seafood: "Skaldjur",
  Seeds: "Frön",
  "Sheet pan": "Plåtmat",
  "Side dish": "Tillbehör",
  "Slow cooking": "Långkok",
  Smørrebrød: "Smörrebröd",
  Soil: "Jord",
  Soup: "Soppa",
  Spicy: "Starkt",
  Spring: "Vår",
  Starter: "Förrätt",
  "Street food": "Gatumat",
  Summer: "Sommar",
  "Sunday roast": "Söndagsstek",
  Tacos: "Tacos",
  Upcycling: "Återbruk",
  Vietnamese: "Vietnamesiskt",
  Weeknight: "Vardagsmat",
  Meat: "Kött",
  "Fresh pasta": "Färsk pasta",
  Handmade: "Handgjort",
  "Weekend project": "Helgprojekt",
  Festive: "Festligt",
  "Dinner party": "Middagsbjudning",
  Showstopper: "Blickfång",
  Duck: "Anka",
  "Warm salad": "Varm sallad",
  "Fine dining": "Finkrog",
  "Crayfish party": "Kräftskiva",
  Curing: "Rimning",
  Deli: "Deli",
  Cheese: "Ost",
  Raw: "Rått",
  Sauce: "Sås",
  "Egg whites": "Äggvitor",
  Weekend: "Helg",
  Snack: "Mellanmål",
  Beer: "Öl",
  Eggs: "Ägg",
  Picnic: "Picknick",
  Russian: "Ryskt",
  "New Year": "Nyår",
  Dumplings: "Dumplings",
  Steamed: "Ångat",
  "Dim sum": "Dim sum",
  "Egg yolks": "Äggulor",
  "Ice cream": "Glass",
  Cake: "Tårta",
  Rye: "Råg",
  Sourdough: "Surdeg",
  Candy: "Godis",
  Drink: "Dryck",
  Preserves: "Konservering",
  Basics: "Grundrecept",
  Stock: "Fond & buljong",
  Umami: "Umami",
  Birthday: "Födelsedag",
  "Natural colors": "Naturliga färger",
  Gingerbread: "Pepparkakor",
  "Family project": "Familjeprojekt",
  Austrian: "Österrikiskt",
  Filipino: "Filippinskt",
  Easter: "Påsk",
  Norwegian: "Norskt",
  Meringue: "Maräng",
  Almond: "Mandel",
  Custard: "Vaniljkräm",
  "17 May": "17 maj",
  Coconut: "Kokos",
  Caramel: "Karamell",
  Traybake: "Långpannekaka",
  "Puff pastry": "Smördeg",
  "Bundt cake": "Kaka i kransform",
  Pie: "Paj",
  Lime: "Lime",
  Citrus: "Citrus",
};

// The illustrated icon (assets/icons/) for a tag that has an obvious one. A tag's page shows it beside
// the heading, and the archive's diet filter uses the diet ones; a tag without one gets the hashtag.
const tagIcons = {
  // Diets
  Vegetarian: "diets/vegetarian",
  Vegan: "diets/vegan",
  "Dairy free": "diets/milk-free",
  "Egg free": "diets/egg-free",
  "Gluten free": "diets/gluten-free",
  "Lactose free": "diets/dairy-free",
  "Nut free": "diets/nut-free",
  "Shellfish free": "diets/shellfish-free",
  "Soy free": "diets/soy-free",
  // Odling
  Gardening: "pot-and-trowel",
  Houseplants: "monstera",
  Indoor: "grow-light",
  "Kitchen garden": "vegetable-bed-3",
  Balcony: "vegetable-bed-2",
  Herbs: "windowsill-herbs",
  Seeds: "seed-packet",
  Spring: "seedling-tray",
  Propagation: "cuttings",
  Compost: "wheelbarrow",
  Soil: "wheelbarrow",
  Fertilizer: "wheelbarrow",
  "Long project": "hourglass",
  Coffee: "cup-with-saucer",
  Kids: "teddy-bear",
  // Mat & dryck
  "Main course": "serving-cloche-1",
  Starter: "shrimp-plate",
  "Side dish": "potato-wedges",
  Soup: "soup-bowl",
  Salad: "salad",
  Sandwich: "sandwiches",
  Dip: "dip",
  Dessert: "sundae",
  Breakfast: "fried-egg",
  Brunch: "fried-egg",
  Bread: "bread-loaf",
  Pasta: "spagheti",
  Fish: "fish",
  Seafood: "shrimp",
  Chicken: "chicken-drumstick",
  Beef: "steak-1",
  Greek: "greek-salad",
  BBQ: "fire",
  "One pot": "cooking-pot",
  Stew: "cooking-pot",
  "Spice blend": "spice-mills",
  Jam: "jam-jar",
  Marmalade: "jam-jar",
  Cordial: "saft-bottle",
  Cocktail: "cocktail",
  "Hot drink": "teacup",
  Quick: "stopwatch",
  Frozen: "frozen-food-bag",
  "Freezer friendly": "freezer",
  // Hemmaspa, hushåll och husdjur
  Bath: "bubble-bath",
  Face: "face-mask-bowl",
  Relaxing: "spa-stones",
  Cleaning: "bucket-with-suds",
  Kitchen: "dish-brush",
  "Home fragrance": "candle",
  Dog: "dog-bone",
  Treats: "dog-biscuit",
  Paws: "paw-print",
};

const foods = {
  pasta: {
    name: "Pasta",
    group: "grains",
    aliases: ["spaghetti", "penne", "fusilli", "makaroner"],
  },
  tomat: {
    name: "Tomater",
    group: "vegetables",
    aliases: ["tomat", "körsbärstomat", "körsbärstomater", "cocktailtomater"],
  },
  spenat: { name: "Spenat", group: "vegetables", aliases: ["babyspenat"] },
  pesto: {
    name: "Grön pesto",
    group: "pantry",
    aliases: ["pesto", "basilikapesto"],
  },
  olja: {
    name: "Olivolja",
    group: "pantry",
    aliases: ["olja", "rapsolja", "matolja"],
  },
  ost: {
    name: "Parmesan",
    group: "dairy",
    aliases: ["parmesanost", "vegetarisk parmesan", "parmesanalternativ"],
  },
  morot: {
    name: "Morötter",
    group: "vegetables",
    aliases: ["morot", "morötterna"],
  },
  kal: {
    name: "Kål",
    group: "vegetables",
    aliases: ["rödkål", "vitkål", "spetskål"],
  },
  sallad: {
    name: "Bladsallad",
    group: "vegetables",
    aliases: ["sallad", "isbergssallad", "grönsallad"],
  },
  kikarter: {
    name: "Kikärter",
    group: "legumes",
    aliases: ["kikärt", "kikärtor"],
  },
  citron: {
    name: "Citron",
    group: "fruit",
    aliases: ["citroner", "citronsaft"],
  },
  senap: { name: "Dijonsenap", group: "pantry", aliases: ["senap", "dijon"] },
  broccoli: {
    name: "Broccoli",
    group: "vegetables",
    aliases: ["broccolibuketter"],
  },
  bonor: {
    name: "Kokta bönor",
    group: "legumes",
    aliases: ["bönor", "svarta bönor", "kidneybönor"],
  },
  agg: { name: "Ägg", group: "eggs", aliases: [] },
  cheddar: {
    name: "Riven ost",
    group: "dairy",
    aliases: ["ost", "cheddar", "hushållsost", "riven cheddar"],
  },
  potatis: {
    name: "Potatis",
    group: "vegetables",
    aliases: ["färskpotatis", "kokt potatis"],
  },
  lax: {
    name: "Kallrökt lax",
    group: "fish",
    aliases: ["rökt lax", "varmrökt lax"],
  },
  yoghurt: {
    name: "Naturell yoghurt",
    group: "dairy",
    aliases: ["yoghurt", "grekisk yoghurt", "turkisk yoghurt"],
  },
  dill: { name: "Dill", group: "herbs", aliases: [] },
  kyckling: {
    name: "Tillagad kyckling",
    group: "poultry",
    aliases: ["grillad kyckling", "kycklingrester", "kokt kyckling"],
  },
  ris: {
    name: "Ris",
    group: "grains",
    aliases: ["basmatiris", "jasminris", "kokt ris"],
  },
  gurka: { name: "Gurka", group: "vegetables", aliases: [] },
  soja: { name: "Sojasås", group: "pantry", aliases: ["soja", "japansk soja"] },
  lok: { name: "Gul lök", group: "vegetables", aliases: ["lök", "gul lök"] },
  linser: {
    name: "Röda linser",
    group: "legumes",
    aliases: ["linser", "röd lins"],
  },
  buljong: {
    name: "Grönsaksbuljong",
    group: "pantry",
    aliases: ["buljong", "buljongtärning"],
  },
  svamp: {
    name: "Champinjoner",
    group: "mushrooms",
    aliases: ["champinjon", "svamp"],
  },
  brod: {
    name: "Bröd",
    group: "grains",
    aliases: ["surdegsbröd", "rostbröd", "surdeg"],
  },
  vitlok: { name: "Vitlök", group: "herbs", aliases: ["vitlöksklyfta"] },
  smor: { name: "Smör", group: "dairy", aliases: [] },
  tacofars: {
    name: "Tillagad tacofärs",
    group: "meat",
    aliases: ["tacorester", "stekt tacofärs"],
  },
  tortilla: {
    name: "Tortillabröd",
    group: "grains",
    aliases: ["tortilla", "tortillas", "tortillabröd"],
  },
  majs: {
    name: "Majs",
    group: "vegetables",
    aliases: ["majskorn", "burkmajs"],
  },
  havre: { name: "Havregryn", group: "grains", aliases: ["havre"] },
  apple: { name: "Äpple", group: "fruit", aliases: ["äpplet", "äpplen"] },
  valnot: { name: "Valnötter", group: "nuts", aliases: ["valnöt"] },
  kanel: { name: "Kanel", group: "herbs", aliases: ["malen kanel"] },
  kokosmjolk: { name: "Kokosmjölk", group: "pantry", aliases: [] },
  curry: { name: "Currypulver", group: "herbs", aliases: ["curry"] },
  kross: { name: "Krossade tomater", group: "pantry", aliases: ["tomatkross"] },
};

// From src/_data/foods.json, which is a whole grocery list (lib/foods.js). collectionFoods, in
// data/recipe-index.js, are the foods the recipes use. The rest come in data/foods.js as moreFoods,
// {group: {key: [name, …other words]}}, which only the pages that match typed or photographed foods
// load: the home page and the new-recipe page. The build loads all of foods.json as collectionFoods.
Object.assign(foods, collectionFoods);
if (typeof moreFoods !== "undefined") {
  for (const [group, entries] of Object.entries(moreFoods)) {
    for (const [key, [name, ...aliases]] of Object.entries(entries)) {
      foods[key] = { name, group, aliases };
    }
  }
}
// Only the food groups above are ingredients. Blöjor and schampo are on the grocery list too, but
// a fridge list or a recipe has no use for them.
for (const [key, food] of Object.entries(foods)) {
  if (!Object.hasOwn(foodGroups, food.group)) delete foods[key];
}

// Everyday words people type for ingredients the recipes already use.
const extraAliases = {
  kyckling: [
    "kyckling",
    "kycklingfilé",
    "kycklingfiléer",
    "kycklingbröst",
    "kycklinglårfilé",
    "kycklingklubbor",
    "hel kyckling",
  ],
  vetemjol: ["mjöl"],
  vitlok: ["vitlöksklyftor"],
  lok: ["gula lökar"],
  tomat: ["plommontomater", "kvisttomater", "färska tomater"],
  kross: ["krossad tomat", "passerade tomater", "tomater på burk"],
  potatis: ["mandelpotatis", "fast potatis", "mjölig potatis"],
  cheddar: ["gratängost", "herrgårdsost", "grevé", "grevéost", "mild ost"],
  ost: ["parmigiano", "grana padano", "pecorino"],
  smor: ["normalsaltat smör", "osaltat smör"],
  mjolk: ["mellanmjölk", "standardmjölk", "lättmjölk", "laktosfri mjölk"],
  matlagningsgradde: ["matgrädde"],
  blandfars: ["köttfärs", "nötfärs", "färs"],
  bacon: ["sidfläsk"],
  falukorv: ["korv"],
  julskinka: ["skinka", "kokt skinka", "rökt skinka"],
  "vit-fisk": ["fisk", "fiskfilé", "torskfilé", "sejfilé", "kolja"],
  rakor: ["räka", "skalade räkor"],
  pasta: [
    "spagetti",
    "tagliatelle",
    "farfalle",
    "rigatoni",
    "pastaskruvar",
    "lasagneplattor",
  ],
  nudlar: ["äggnudlar"],
  brod: [
    "formbröd",
    "toast",
    "limpa",
    "baguette",
    "gammalt bröd",
    "brödskivor",
  ],
  paprika: ["gul paprika", "grön paprika", "paprikor"],
  gurka: ["slanggurka"],
  sallad: ["romansallad", "ruccola"],
  spenat: ["bladspenat", "fryst spenat"],
  citron: ["citronskal"],
  linser: ["gröna linser"],
  kokosmjolk: ["kokosgrädde"],
  havredryck: ["havremjölk"],
  korngryn: ["korn"],
  buljong: [
    "hönsbuljong",
    "kycklingbuljong",
    "buljongtärningar",
    "grönsaksfond",
  ],
  yoghurt: ["matyoghurt"],
  fetaost: ["feta", "salladsost"],
  rodbetor: ["rödbetor", "rödbeta", "kokta rödbetor"],
  fron: ["solrosfrön", "pumpafrön", "sesamfrön", "sesam"],
  rotfrukter: ["palsternacka", "palsternackor", "rotselleri"],
  salladslok: ["vårlök"],
  orter: [
    "örter",
    "persilja",
    "bladpersilja",
    "basilika",
    "koriander",
    "gräslök",
    "mynta",
    "timjan",
    "rosmarin",
  ],
  kryddor: ["chili", "chiliflakes", "paprikapulver", "spiskummin", "oregano"],
};

for (const [key, aliases] of Object.entries(extraAliases)) {
  foods[key].aliases.push(
    ...aliases.filter((alias) => !foods[key].aliases.includes(alias)),
  );
}

// From data/recipe-index.js, which the build writes from the recipes in src/recept/. The build itself
// also loads this file, with no recipes, for the lists above (lib/taxonomy.js).
const recipes = collectionRecipes;
