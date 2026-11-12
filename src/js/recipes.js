'use strict';

const foodGroups = {
  vegetables: {label: 'Grönsaker', icon: 'broccoli'},
  legumes: {label: 'Baljväxter', icon: 'beans-1'},
  grains: {label: 'Pasta, ris & spannmål', icon: 'spaghetti-bundle'},
  dairy: {label: 'Mejeri', icon: 'milk-carton-2'},
  eggs: {label: 'Ägg', icon: 'egg-carton-1'},
  poultry: {label: 'Fågel', icon: 'chicken-drumstick-1'},
  fish: {label: 'Fisk & skaldjur', icon: 'fish-1'},
  meat: {label: 'Kött', icon: 'steak-2'},
  mushrooms: {label: 'Svamp', icon: 'mushroom-1'},
  fruit: {label: 'Frukt & bär', icon: 'mixed-fruit'},
  nuts: {label: 'Nötter & frön', icon: 'almonds'},
  herbs: {label: 'Örter & kryddor', icon: 'spice-mills'},
  pantry: {label: 'Olja & såser', icon: 'olive-oil'}
};

// Categories say what kind of dish it is. The first one in a recipe's `meals` is shown on its card.
// `label` names the category in the filter, `name` is used for a single recipe when it differs.
// Diet, cuisine, occasion and the like are tags, not categories. Quick is decided by `time`.
const mealTypes = {
  main: {label: 'Huvudrätter', name: 'Huvudrätt', icon: 'serving-cloche'},
  soup: {label: 'Soppor', name: 'Soppa', icon: 'soup-bowl'},
  salad: {label: 'Sallader', name: 'Sallad', icon: 'salad-bowl'},
  sandwich: {label: 'Smörgåsar', name: 'Smörgås', icon: 'sandwich-halves'},
  starter: {label: 'Förrätter', name: 'Förrätt', icon: 'shrimp-entree'},
  side: {label: 'Tillbehör', icon: 'potato-wedges'},
  sauce: {label: 'Såser & röror', icon: 'ramekin-with-dip'},
  breakfast: {label: 'Frukost & brunch', icon: 'sunny-side-up-egg'},
  snack: {label: 'Mellanmål', icon: 'bananas'},
  party: {label: 'Mingelmat & tilltugg', icon: 'cocktail-picks'},
  dessert: {label: 'Desserter', name: 'Dessert', icon: 'sundae-glass'},
  baking: {label: 'Fika & bakning', icon: 'cinnamon-bun'},
  bread: {label: 'Bröd', icon: 'bread-loaf'},
  candy: {label: 'Godis & konfekt', icon: 'candy'},
  drink: {label: 'Drycker', name: 'Dryck', icon: 'tumbler-drink'},
  preserves: {label: 'Sylt, saft & inlagt', icon: 'jam-jar'},
  basics: {label: 'Grundrecept', icon: 'whisk-and-bowl'},
  // Not a dish type: food that children eat and help make. List it after a recipe's dish type,
  // so the card still shows what kind of dish it is.
  kids: {label: 'Barnvänligt', icon: 'teddy-bear'},
  spa: {label: 'Hemmaspa & behandlingar', name: 'Hemmaspa', icon: 'towel-and-candle', badge: 'HEMMASPA', action: 'Visa behandling'},
  household: {label: 'Hushåll & rengöring', icon: 'spray-bottle', badge: 'HUSHÅLL & RENGÖRING', action: 'Visa instruktioner'},
  pets: {label: 'Husdjur', icon: 'dog-bone', badge: 'HUSDJUR'}
};

const mealName = meal => mealTypes[meal].name ?? mealTypes[meal].label;

// Spa, cleaning and pet recipes live on their own page (mer-an-mat.html), not in the food archive.
const nonFoodMeals = ['spa', 'household', 'pets'];
const isFood = recipe => !recipe.meals.some(meal => nonFoodMeals.includes(meal));

// Only food recipes have diet tags. The archive shows these as their own filter group.
const dietTags = ['Vegetarian', 'Vegan', 'Dairy free', 'Egg free', 'Gluten free'];

// A vegan recipe is tagged only Vegan but also counts as these.
const impliedTags = {Vegan: ['Vegetarian', 'Dairy free', 'Egg free']};

function allTags(recipe) {
  return [...new Set((recipe.tags ?? []).flatMap(tag => [tag, ...(impliedTags[tag] ?? [])]))];
}

const hasTag = (recipe, tag) => allTags(recipe).includes(tag);

const recipeTagLabels = {
  'Alcohol free': 'Alkoholfritt', 'Alcohol free option': 'Alkoholfritt alternativ',
  American: 'Amerikanskt', Asian: 'Asiatiskt', Autumn: 'Höst',
  'Beginner friendly': 'Nybörjarvänligt', Body: 'Kropp', Budget: 'Budget', Chocolate: 'Choklad',
  Christmas: 'Jul', Classic: 'Klassiker', Cocktail: 'Cocktail', Condiment: 'Smaksättare',
  'Comfort food': 'Mysig mat', 'Dairy free': 'Mjölkfritt', Danish: 'Danskt',
  Dip: 'Dipp', Face: 'Ansikte',
  'Family friendly': 'Familjevänligt', Feet: 'Fötter', French: 'Franskt', Gift: 'Present',
  'Gluten free': 'Glutenfritt', Greek: 'Grekiskt', Hair: 'Hår', 'Hot drink': 'Varm dryck',
  Indian: 'Indiskt', Italian: 'Italienskt', Leftovers: 'Rester', Lips: 'Läppar',
  'Low carb': 'Kolhydratsnålt', Lunch: 'Lunch', 'Make ahead': 'Kan förberedas',
  'Meal prep': 'Matlåda', Mexican: 'Mexikanskt', 'Middle Eastern': 'Mellanöstern',
  Natural: 'Naturligt', 'No bake': 'Utan ugn', 'One pot': 'Allt i en gryta',
  Pescatarian: 'Pescetariskt', Relaxing: 'Avkopplande',
  Soothing: 'Lugnande', Spanish: 'Spanskt',
  Stew: 'Gryta', 'Sunday dinner': 'Söndagsmiddag', Swedish: 'Svenskt', Thai: 'Thailändskt',
  Vegan: 'Veganskt', Vegetarian: 'Vegetariskt', 'Zero waste': 'Minskar matsvinn',
  Bath: 'Bad', Bathroom: 'Badrum', Cat: 'Katt',
  Cleaning: 'Städning', Cordial: 'Saft', Dog: 'Hund', 'Egg free': 'Äggfritt',
  Eyes: 'Ögon', Frozen: 'Fryst', Grooming: 'Päls- & tassvård', Hands: 'Händer',
  'Home fragrance': 'Rumsdoft', Jam: 'Sylt', Kitchen: 'Kök', Marinade: 'Marinad',
  Marmalade: 'Marmelad', Overnight: 'Över natten', Pasta: 'Pasta', Paws: 'Tassar',
  Pickles: 'Inlagt', Refreshing: 'Uppfriskande',
  'Spice blend': 'Kryddblandning', Treats: 'Djurbelöning', Winter: 'Vinter',
  Australian: 'Australiskt', British: 'Brittiskt', Chutney: 'Chutney', Ears: 'Öron',
  'Eastern European': 'Östeuropeiskt', Enrichment: 'Aktivering', Fermented: 'Fermenterat',
  German: 'Tyskt', Laundry: 'Tvätt', Nose: 'Nos', Toy: 'Leksak'
};

const foods = {
  pasta: {name: 'Pasta', group: 'grains', aliases: ['spaghetti', 'penne', 'fusilli', 'makaroner']},
  tomat: {name: 'Tomater', group: 'vegetables', aliases: ['tomat', 'körsbärstomat', 'körsbärstomater', 'cocktailtomater']},
  spenat: {name: 'Spenat', group: 'vegetables', aliases: ['babyspenat']},
  pesto: {name: 'Grön pesto', group: 'pantry', aliases: ['pesto', 'basilikapesto']},
  olja: {name: 'Olivolja', group: 'pantry', aliases: ['olja', 'rapsolja', 'matolja']},
  ost: {name: 'Parmesan', group: 'dairy', aliases: ['parmesanost', 'vegetarisk parmesan', 'parmesanalternativ']},
  morot: {name: 'Morötter', group: 'vegetables', aliases: ['morot', 'morötterna']},
  kal: {name: 'Kål', group: 'vegetables', aliases: ['rödkål', 'vitkål', 'spetskål']},
  sallad: {name: 'Bladsallad', group: 'vegetables', aliases: ['sallad', 'isbergssallad', 'grönsallad']},
  kikarter: {name: 'Kikärter', group: 'legumes', aliases: ['kikärt', 'kikärtor']},
  citron: {name: 'Citron', group: 'fruit', aliases: ['citroner', 'citronsaft']},
  senap: {name: 'Dijonsenap', group: 'pantry', aliases: ['senap', 'dijon']},
  broccoli: {name: 'Broccoli', group: 'vegetables', aliases: ['broccolibuketter']},
  bonor: {name: 'Kokta bönor', group: 'legumes', aliases: ['bönor', 'svarta bönor', 'kidneybönor']},
  agg: {name: 'Ägg', group: 'eggs', aliases: []},
  cheddar: {name: 'Riven ost', group: 'dairy', aliases: ['ost', 'cheddar', 'hushållsost', 'riven cheddar']},
  potatis: {name: 'Potatis', group: 'vegetables', aliases: ['färskpotatis', 'kokt potatis']},
  lax: {name: 'Kallrökt lax', group: 'fish', aliases: ['rökt lax', 'varmrökt lax']},
  yoghurt: {name: 'Naturell yoghurt', group: 'dairy', aliases: ['yoghurt', 'grekisk yoghurt', 'turkisk yoghurt']},
  dill: {name: 'Dill', group: 'herbs', aliases: []},
  kyckling: {name: 'Tillagad kyckling', group: 'poultry', aliases: ['grillad kyckling', 'kycklingrester', 'kokt kyckling']},
  ris: {name: 'Ris', group: 'grains', aliases: ['basmatiris', 'jasminris', 'kokt ris']},
  gurka: {name: 'Gurka', group: 'vegetables', aliases: []},
  soja: {name: 'Sojasås', group: 'pantry', aliases: ['soja', 'japansk soja']},
  lok: {name: 'Gul lök', group: 'vegetables', aliases: ['lök', 'gul lök']},
  linser: {name: 'Röda linser', group: 'legumes', aliases: ['linser', 'röd lins']},
  buljong: {name: 'Grönsaksbuljong', group: 'pantry', aliases: ['buljong', 'buljongtärning']},
  svamp: {name: 'Champinjoner', group: 'mushrooms', aliases: ['champinjon', 'svamp']},
  brod: {name: 'Bröd', group: 'grains', aliases: ['surdegsbröd', 'rostbröd', 'surdeg']},
  vitlok: {name: 'Vitlök', group: 'herbs', aliases: ['vitlöksklyfta']},
  smor: {name: 'Smör', group: 'dairy', aliases: []},
  tacofars: {name: 'Tillagad tacofärs', group: 'meat', aliases: ['tacorester', 'stekt tacofärs']},
  tortilla: {name: 'Tortillabröd', group: 'grains', aliases: ['tortilla', 'tortillas', 'tortillabröd']},
  majs: {name: 'Majs', group: 'vegetables', aliases: ['majskorn', 'burkmajs']},
  havre: {name: 'Havregryn', group: 'grains', aliases: ['havre']},
  apple: {name: 'Äpple', group: 'fruit', aliases: ['äpplet', 'äpplen']},
  valnot: {name: 'Valnötter', group: 'nuts', aliases: ['valnöt']},
  kanel: {name: 'Kanel', group: 'herbs', aliases: ['malen kanel']},
  kokosmjolk: {name: 'Kokosmjölk', group: 'pantry', aliases: []},
  curry: {name: 'Currypulver', group: 'herbs', aliases: ['curry']},
  kross: {name: 'Krossade tomater', group: 'pantry', aliases: ['tomatkross']},
};

Object.assign(foods, collectionFoods);

// Everyday words people type for ingredients the recipes already use.
const extraAliases = {
  kyckling: ['kyckling', 'kycklingfilé', 'kycklingfiléer', 'kycklingbröst', 'kycklinglårfilé', 'kycklingklubbor', 'hel kyckling'],
  vetemjol: ['mjöl'],
  vitlok: ['vitlöksklyftor'],
  lok: ['gula lökar'],
  tomat: ['plommontomater', 'kvisttomater', 'färska tomater'],
  kross: ['krossad tomat', 'passerade tomater', 'tomater på burk'],
  potatis: ['mandelpotatis', 'fast potatis', 'mjölig potatis'],
  cheddar: ['gratängost', 'herrgårdsost', 'grevé', 'grevéost', 'mild ost'],
  ost: ['parmigiano', 'grana padano', 'pecorino'],
  smor: ['normalsaltat smör', 'osaltat smör'],
  mjolk: ['mellanmjölk', 'standardmjölk', 'lättmjölk', 'laktosfri mjölk'],
  matlagningsgradde: ['matgrädde'],
  blandfars: ['köttfärs', 'nötfärs', 'färs'],
  bacon: ['sidfläsk'],
  falukorv: ['korv'],
  julskinka: ['skinka', 'kokt skinka', 'rökt skinka'],
  'vit-fisk': ['fisk', 'fiskfilé', 'torskfilé', 'sejfilé', 'kolja'],
  rakor: ['räka', 'skalade räkor'],
  pasta: ['spagetti', 'tagliatelle', 'farfalle', 'rigatoni', 'pastaskruvar', 'lasagneplattor'],
  nudlar: ['äggnudlar'],
  brod: ['formbröd', 'toast', 'limpa', 'baguette', 'gammalt bröd', 'brödskivor'],
  paprika: ['gul paprika', 'grön paprika', 'paprikor'],
  gurka: ['slanggurka'],
  sallad: ['romansallad', 'ruccola'],
  spenat: ['bladspenat', 'fryst spenat'],
  citron: ['citronskal'],
  linser: ['gröna linser'],
  kokosmjolk: ['kokosgrädde'],
  havredryck: ['havremjölk'],
  korngryn: ['korn'],
  buljong: ['hönsbuljong', 'kycklingbuljong', 'buljongtärningar', 'grönsaksfond'],
  yoghurt: ['matyoghurt'],
  fetaost: ['feta', 'salladsost'],
  rodbetor: ['rödbetor', 'rödbeta', 'kokta rödbetor'],
  fron: ['solrosfrön', 'pumpafrön', 'sesamfrön', 'sesam'],
  rotfrukter: ['palsternacka', 'palsternackor', 'rotselleri'],
  salladslok: ['vårlök'],
  orter: ['örter', 'persilja', 'bladpersilja', 'basilika', 'koriander', 'gräslök', 'mynta', 'timjan', 'rosmarin'],
  kryddor: ['chili', 'chiliflakes', 'paprikapulver', 'spiskummin', 'oregano']
};

for (const [key, aliases] of Object.entries(extraAliases)) {
  foods[key].aliases.push(...aliases.filter(alias => !foods[key].aliases.includes(alias)));
}

// From data/recipe-index.js, which the build writes from the recipes in src/recept/. The build itself
// also loads this file, with no recipes, for the lists above (lib/taxonomy.js).
const recipes = collectionRecipes;
