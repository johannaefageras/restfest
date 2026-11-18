# Fridge food and icon pairings

Reviewed 2026-11-18 against all 302 SVGs in `src/assets/icons/` and the foods actually recognised by the home page.

The catalogue already contains these groceries. 1,477 food entries now have explicit pairings, using 151 different illustrations including the name-specific choices. Aliases and plural forms inherit their food’s picture. Other recognised foods retain the category illustration.

`src/js/food-icons.js` contains the complete mapping and loads only on the home page. No food keys or recipe matching rules changed. Specific names such as Farfalle, Baguette, Ruccola and Rödkål survive the add form so their artwork can be shown. Unknown items remain unillustrated.

Each row lists up to six examples; the count is the number of explicit catalogue entries, excluding name-specific aliases.

| SVG | Examples of recognised foods | Entries |
| --- | --- | ---: |
| [artichoke.svg](../src/assets/icons/artichoke.svg) | Kronärtskocka, Kronärtskocksbottnar, Kronärtskockshjärtan, Inlagda kronärtskocksbottnar, Marinerade kronärtskockor | 5 |
| [asparagus.svg](../src/assets/icons/asparagus.svg) | Sparris, Grön sparris, Vit sparris, Minisparris, Sparris på burk | 5 |
| [avocados.svg](../src/assets/icons/avocados.svg) | Avokado, Fryst avokado i bitar | 2 |
| [beetroots.svg](../src/assets/icons/beetroots.svg) | Inlagda rödbetor, Gulbeta, Knippbetor, Polkabeta | 4 |
| [bell-peppers.svg](../src/assets/icons/bell-peppers.svg) | Paprika, Orange paprika, Paprikamix, Snackpaprika, Spetspaprika, Strimlad paprika | 7 |
| [bok-choy.svg](../src/assets/icons/bok-choy.svg) | Pak choi, Choi sum, Tatsoi | 3 |
| [broccoli.svg](../src/assets/icons/broccoli.svg) | Broccoli, Broccolini, Thaibroccoli (kailan) | 3 |
| [carrot.svg](../src/assets/icons/carrot.svg) | Morötter, Knippmorötter, Lila morötter, Morotsmix med flera färger, Snackmorötter, Morotsstavar | 10 |
| [cauliflower.svg](../src/assets/icons/cauliflower.svg) | Blomkål, Lila blomkål, Blomkålsbuketter, Blomkålsris, Romanesco | 5 |
| [celery.svg](../src/assets/icons/celery.svg) | Blekselleri | 1 |
| [corn.svg](../src/assets/icons/corn.svg) | Majs, Majskolv, Majskolvar, Minimajs, Färdigkokta majskolvar | 5 |
| [cucumber.svg](../src/assets/icons/cucumber.svg) | Gurka, Minigurka, Västeråsgurka | 3 |
| [eggplant.svg](../src/assets/icons/eggplant.svg) | Aubergine, Miniaubergine, Thaiaubergine, Grillad aubergine | 4 |
| [fennel.svg](../src/assets/icons/fennel.svg) | Fänkål | 1 |
| [garlic.svg](../src/assets/icons/garlic.svg) | Vitlök, Färsk vitlök, Solovitlök, Svart vitlök, Vitlöksfläta, Skalade vitlöksklyftor | 8 |
| [ginger.svg](../src/assets/icons/ginger.svg) | Färsk ingefära, Fryst ingefära | 2 |
| [green-cabbage.svg](../src/assets/icons/green-cabbage.svg) | vitkål, Kål, Savojkål, Kinakål, Strimlad vitkål och morot, Stuvad vitkål | 5 |
| [kale.svg](../src/assets/icons/kale.svg) | Grönkål, Svartkål | 2 |
| [leeks.svg](../src/assets/icons/leeks.svg) | Purjolök | 1 |
| [parsnips.svg](../src/assets/icons/parsnips.svg) | palsternacka, Persiljerot | 1 |
| [radishes.svg](../src/assets/icons/radishes.svg) | Rädisor, Rättika, Svart rättika | 3 |
| [red-cabbage.svg](../src/assets/icons/red-cabbage.svg) | rödkål, Röd spetskål, Strimlad rödkål, Kokt rödkål, Inlagd rödkål | 4 |
| [red-onion.svg](../src/assets/icons/red-onion.svg) | Rödlök | 1 |
| [root-vegetables.svg](../src/assets/icons/root-vegetables.svg) | Rotfrukter, Potatis, Bakpotatis, Blå potatis, Delikatesspotatis, Röd potatis | 20 |
| [salad.svg](../src/assets/icons/salad.svg) | Bladsallad, Bataviasallad, Ekbladssallad, Endiv, Frisésallad, Hjärtsallad | 15 |
| [bagged-salad.svg](../src/assets/icons/bagged-salad.svg) | Babyleaf, Salladskit, Salladsmix | 3 |
| [shallots.svg](../src/assets/icons/shallots.svg) | Schalottenlök, Bananschalottenlök | 2 |
| [spinach.svg](../src/assets/icons/spinach.svg) | Spenat, Vattenspenat, Hackad spenat, Stuvad spenat, Mangold | 5 |
| [spring-onions.svg](../src/assets/icons/spring-onions.svg) | Salladslök | 1 |
| [sprout.svg](../src/assets/icons/sprout.svg) | Alfalfagroddar, Broccoligroddar, Böngroddar, Linsgroddar, Purjolöksgroddar, Rädisgroddar | 11 |
| [sweet-potatoes.svg](../src/assets/icons/sweet-potatoes.svg) | Sötpotatis, Lila sötpotatis, Tärnad sötpotatis, Fryst tärnad sötpotatis | 4 |
| [butternut-squash.svg](../src/assets/icons/butternut-squash.svg) | Pumpa, Tärnad butternutpumpa, Muskotpumpa | 3 |
| [tomato.svg](../src/assets/icons/tomato.svg) | Tomater, Babyplommontomater, Bifftomater, Gröna tomater, Gula tomater, Oxhjärtatomat | 9 |
| [vegetables.svg](../src/assets/icons/vegetables.svg) | Blandade grönsaker, Wokmix, Färsk soppmix, Grillgrönsaksmix, Ugnsgrönsaksmix, Grillade grönsaker | 11 |
| [yellow-onions.svg](../src/assets/icons/yellow-onions.svg) | Gul lök, Färsk silverlök, Vit lök, Pärllök, Steklök, Hackad lök | 6 |
| [pickle-jar.svg](../src/assets/icons/pickle-jar.svg) | Saltgurka, Cornichons, Smörgåsgurka, Senapsgurka, Mixed pickles, Pressgurka | 7 |
| [potato-wedges.svg](../src/assets/icons/potato-wedges.svg) | Klyftpotatis, Rostad potatis, Sötpotatispommes, Rotfruktspommes | 4 |
| [beans.svg](../src/assets/icons/beans.svg) | Kokta bönor, Vita bönor, Stora vita bönor, Bondbönor, Lupinbönor, Adukibönor | 26 |
| [chickpeas.svg](../src/assets/icons/chickpeas.svg) | Kikärter, Chana dal (delade kikärtor) | 2 |
| [lentils.svg](../src/assets/icons/lentils.svg) | Röda linser, Färdigkokta linser, Belugalinser, Bruna linser, Franska gröna linser, Gula linser | 7 |
| [edamame.svg](../src/assets/icons/edamame.svg) | Edamame, Skalade edamamebönor | 2 |
| [green-beans.svg](../src/assets/icons/green-beans.svg) | Haricots verts, Brytbönor, Långbönor, Rosenbönor, Skärbönor, Vaxbönor | 6 |
| [peas.svg](../src/assets/icons/peas.svg) | Gröna ärter, Torkade gula ärter, Färska ärtor i balja, Sockerärtor, Sugarsnaps, Gråärtor | 7 |
| [apple.svg](../src/assets/icons/apple.svg) | Äpple, Gröna äpplen, Röda äpplen, Äppelklyftor i påse, Äppelringar, Krispiga äppelchips | 6 |
| [apricots.svg](../src/assets/icons/apricots.svg) | Aprikos, Torkade aprikoser | 2 |
| [bananas.svg](../src/assets/icons/bananas.svg) | Bananer, Matbanan, Minibanan, Röda bananer, Bananskivor, Bananchips | 6 |
| [berries.svg](../src/assets/icons/berries.svg) | Blandade bär, Blåbär, Lingon, Svarta vinbär, Färsk bärmix, Bärmix | 20 |
| [blackberries.svg](../src/assets/icons/blackberries.svg) | Björnbär | 1 |
| [cherries.svg](../src/assets/icons/cherries.svg) | Körsbär, Bigarråer, Surkörsbär, Torkade körsbär | 4 |
| [coconut.svg](../src/assets/icons/coconut.svg) | Kokosnöt, Kokosbitar, Kokoschips, Kokosflingor | 4 |
| [fig.svg](../src/assets/icons/fig.svg) | Fikon, Torkade fikon | 2 |
| [grapefruit.svg](../src/assets/icons/grapefruit.svg) | Grapefrukt, Blodgrapefrukt, Pomelo | 3 |
| [grapes.svg](../src/assets/icons/grapes.svg) | Vindruvor, Gröna vindruvor, Röda vindruvor, Svarta vindruvor, Kärnfria vindruvor | 5 |
| [lemons.svg](../src/assets/icons/lemons.svg) | Citron, Yuzu, Bergamott | 3 |
| [limes.svg](../src/assets/icons/limes.svg) | Lime | 1 |
| [mangoes.svg](../src/assets/icons/mangoes.svg) | Mango, Skuren mango, Torkad mango | 3 |
| [melon.svg](../src/assets/icons/melon.svg) | Cantaloupemelon, Charentaismelon, Galiamelon, Honungsmelon, Piel de sapo-melon, Skuren melon | 6 |
| [papaya.svg](../src/assets/icons/papaya.svg) | Papaya, Torkad papaya | 2 |
| [passion-fruit.svg](../src/assets/icons/passion-fruit.svg) | Passionsfrukt, Grenadilla (söt passionsfrukt), Passionsfruktpuré | 3 |
| [pears.svg](../src/assets/icons/pears.svg) | Päron, Nashipäron, Torkade päron | 3 |
| [physalis.svg](../src/assets/icons/physalis.svg) | Physalis, Inkabär | 2 |
| [plums.svg](../src/assets/icons/plums.svg) | Plommon, Gula plommon, Krikon, Mirabeller, Katrinplommon | 5 |
| [pomegranate.svg](../src/assets/icons/pomegranate.svg) | Granatäpple, Granatäppelkärnor, Frysta granatäppelkärnor | 3 |
| [raspberries.svg](../src/assets/icons/raspberries.svg) | Hallon, Gula hallon | 2 |
| [strawberries.svg](../src/assets/icons/strawberries.svg) | Jordgubbar, Smultron | 2 |
| [watermelon.svg](../src/assets/icons/watermelon.svg) | Vattenmelon, Minivattenmelon, Gul vattenmelon | 3 |
| [basil.svg](../src/assets/icons/basil.svg) | basilika, Röd basilika, Thaibasilika, Fryst basilika | 3 |
| [cilantro.svg](../src/assets/icons/cilantro.svg) | koriander, Fryst hackad koriander | 1 |
| [dill.svg](../src/assets/icons/dill.svg) | Dill, Krondill, Hackad dill | 3 |
| [herbs.svg](../src/assets/icons/herbs.svg) | Färska örter, Örtmix, Bouquet garni, Dragon, Salvia, Mejram | 12 |
| [mint.svg](../src/assets/icons/mint.svg) | mynta, Marockansk mynta | 1 |
| [parsley.svg](../src/assets/icons/parsley.svg) | persilja, Kruspersilja, Hackad persilja | 2 |
| [thyme.svg](../src/assets/icons/thyme.svg) | timjan, Citrontimjan | 1 |
| [ground-spice.svg](../src/assets/icons/ground-spice.svg) | paprikapulver, Kanel, Currypulver, Cayennepeppar, Chilipulver, Chipotlepulver | 60 |
| [pepper.svg](../src/assets/icons/pepper.svg) | Svartpeppar, Vitpeppar, Grönpeppar, Rosépeppar, Hel svartpeppar, Grovmalen svartpeppar | 13 |
| [salt-shaker.svg](../src/assets/icons/salt-shaker.svg) | Salt, Bergsalt, Chilisalt, Fint havssalt, Fleur de sel, Flingsalt | 22 |
| [blue-cheese.svg](../src/assets/icons/blue-cheese.svg) | Ädelost, Bleu d’Auvergne, Cambozola, Danablu, Fourme d’Ambert, Gorgonzola | 9 |
| [brie.svg](../src/assets/icons/brie.svg) | Brie, Brie de Meaux, Brillat-Savarin, Camembert, Camembert för ugn, Coulommiers | 9 |
| [butter.svg](../src/assets/icons/butter.svg) | Smör, Ekologiskt smör, Extrasaltat smör, Laktosfritt smör, Portionssmör, Smör med havssalt | 14 |
| [butter-spread.svg](../src/assets/icons/butter-spread.svg) | Bordsmargarin, Lättmargarin, Mjölkfritt margarin, Smörblandning, Lätt smörblandning, Bredbart havrepålägg | 6 |
| [cheese.svg](../src/assets/icons/cheese.svg) | Riven ost, Lagrad ost, Halloumi, Getost, Comté, Danbo | 69 |
| [cottage-cheese.svg](../src/assets/icons/cottage-cheese.svg) | Keso, Laktosfri keso, Lätt keso, Smaksatt keso, Keso med sylt | 5 |
| [cream-cheese.svg](../src/assets/icons/cream-cheese.svg) | Färskost, Vegansk färskost, Mascarpone, Ekologisk färskost, Fromage frais, Getfärskost | 19 |
| [cream.svg](../src/assets/icons/cream.svg) | Vispgrädde, Matlagningsgrädde, Buljonggrädde, Clotted cream, Dubbelgrädde (crème double), Ekologisk grädde | 19 |
| [creme-fraiche.svg](../src/assets/icons/creme-fraiche.svg) | Crème fraiche, Gräddfil, Ekologisk crème fraiche, Laktosfri crème fraiche, Lätt crème fraiche, Lätt gräddfil | 14 |
| [feta.svg](../src/assets/icons/feta.svg) | Fetaost, Salladsost i olja, Tärnad salladsost, Vit ost (beyaz peynir), Marinerad feta, Laktosfri fetaost | 7 |
| [milk-carton-2.svg](../src/assets/icons/milk-carton-2.svg) | Mjölk, Barista-mjölk, Chokladmjölk, Ekologisk mjölk, Fårmjölk, Getmjölk | 40 |
| [mozzarella.svg](../src/assets/icons/mozzarella.svg) | Mozzarella, Buffelmozzarella, Burrata, Minimozzarella, Stracciatella, Marinerade mozzarellakulor | 9 |
| [parmesan.svg](../src/assets/icons/parmesan.svg) | Parmesan, Hyvlad parmesan, Parmesanflarn, Riven grana padano, Riven parmesan | 5 |
| [quark.svg](../src/assets/icons/quark.svg) | Kvarg, Fet kvarg, Laktosfri kvarg, Lätt kvarg, Proteinkvarg, Smaksatt kvarg | 11 |
| [sour-milk.svg](../src/assets/icons/sour-milk.svg) | Filmjölk, A-fil, Ekologisk filmjölk, Filbunke, Fjällfil, Kefir | 15 |
| [yoghurt.svg](../src/assets/icons/yoghurt.svg) | Naturell yoghurt, Barnyoghurt, Bulgarisk yoghurt, Dessertyoghurt, Ekologisk yoghurt, Fruktyoghurt | 22 |
| [bacon.svg](../src/assets/icons/bacon.svg) | Bacon, Baconbit, Baconströssel, Bacontärningar, Ekologiskt bacon, Frukostbacon | 14 |
| [minced-meat.svg](../src/assets/icons/minced-meat.svg) | Blandfärs, Fläskfärs, Lammfärs, Ekologisk nötfärs, Hamburgerfärs, Hjortfärs | 18 |
| [sausages.svg](../src/assets/icons/sausages.svg) | Falukorv, Bräckkorv, Chilikorv, Cocktailkorv, Fläskkorv, Frukostkorv | 50 |
| [roast-chicken.svg](../src/assets/icons/roast-chicken.svg) | Tillagad kyckling, Ekologisk kyckling, Gårdskyckling, Halalkyckling, Majskyckling, Hel kalkon | 11 |
| [chicken-drumstick.svg](../src/assets/icons/chicken-drumstick.svg) | kycklingfilé, Kycklingben (drumsticks), Kycklingdelar, Kycklinglår, Kycklingvingar, Kalkonklubbor | 15 |
| [salmon-fillet.svg](../src/assets/icons/salmon-fillet.svg) | Kallrökt lax, Laxfilé, Laxkotletter, Laxsida, Marinerad laxfilé, Sashimilax | 16 |
| [canned-fish.svg](../src/assets/icons/canned-fish.svg) | Makrill i tomatsås, Tonfisk i olja, Sardellfiléer, Ansjovis, Sardiner, Kronsardiner | 18 |
| [shrimp.svg](../src/assets/icons/shrimp.svg) | Räkor, Rökta räkor, Handskalade räkor, Jätteräkor, Oskalade räkor, Räkor i lake | 12 |
| [lobster.svg](../src/assets/icons/lobster.svg) | Hummer, Hummerstjärtar, Havskräftor, Kräftor, Kräftstjärtar, Languster | 7 |
| [egg.svg](../src/assets/icons/egg.svg) | Ägg, Ankägg, Gåsägg, Kokta ägg, Vaktelägg | 5 |
| [egg-carton.svg](../src/assets/icons/egg-carton.svg) | Ekologiska ägg, Extra stora ägg, Frigående ägg, Medelstora ägg, Små ägg, Stora ägg | 7 |
| [almonds-2.svg](../src/assets/icons/almonds-2.svg) | Mandel, Bittermandel, Hackad mandel, Marconamandlar, Skållad mandel | 5 |
| [cashews.svg](../src/assets/icons/cashews.svg) | Cashewnötter, Chilicashewnötter, Salta cashewnötter | 3 |
| [peanuts.svg](../src/assets/icons/peanuts.svg) | Jordnötter, Jordnötter i skal, Osaltade jordnötter, Honungsrostade jordnötter, Salta jordnötter, Jordnötssmör | 8 |
| [seeds.svg](../src/assets/icons/seeds.svg) | Frön, Basilikafrön, Chiafrön, Fröblandning, Hampafrön, Krossat linfrö | 16 |
| [flour.svg](../src/assets/icons/flour.svg) | Vetemjöl, Potatismjöl, Majsmjöl, Bovetemjöl, Majsstärkelse, Rismjöl | 25 |
| [oats.svg](../src/assets/icons/oats.svg) | Havregryn, Fiberhavregryn, Grova havregryn, Havrekli, Havrekross, Skuren havre (steel cut) | 9 |
| [rice-grains.svg](../src/assets/icons/rice-grains.svg) | Ris, Arborioris, Bombaris, Carnaroliris, Fullkornsbasmatiris, Fullkornsris | 25 |
| [penne-jar.svg](../src/assets/icons/penne-jar.svg) | penne, Pasta, Bokstavspasta, Bönpasta, Casarecce, Cavatappi | 29 |
| [spagheti.svg](../src/assets/icons/spagheti.svg) | spagetti, Nudlar, Färsk tagliatelle, Bucatini, Capellini, Fettuccine | 26 |
| [wheat.svg](../src/assets/icons/wheat.svg) | Korngryn, Matvete, Mathavre, Hela vetekorn, Farro, Speltkärnor | 11 |
| [bread-loaf.svg](../src/assets/icons/bread-loaf.svg) | Bröd, Ankarstock, Barkis (bergis), Bondbröd, Brioche, Danskt rågbröd | 50 |
| [baguette.svg](../src/assets/icons/baguette.svg) | baguette, Fullkornsbaguette, Minibaguetter, Surdegsbaguette, Vitlöksbaguette | 4 |
| [crisp-bread.svg](../src/assets/icons/crisp-bread.svg) | Knäckebröd, Brungräddat knäckebröd, Dinkelknäcke, Frukostknäcke, Fröknäcke, Fullkornsknäcke | 15 |
| [sandwiches.svg](../src/assets/icons/sandwiches.svg) | Bánh mì, Club sandwich, Fylld ciabatta, Köttbullsmacka, Landgång, Ost- och skinkfralla | 12 |
| [cinnamon-bun.svg](../src/assets/icons/cinnamon-bun.svg) | Kanelbullar, Kanelknutar, Kanellängd, Kardemummabullar | 4 |
| [cookie.svg](../src/assets/icons/cookie.svg) | Cookies, Pepparkakor, Blandade småkakor, Bondkakor, Drömmar, Hallongrottor | 14 |
| [macarons.svg](../src/assets/icons/macarons.svg) | Macarons | 1 |
| [strawberry-shortcake.svg](../src/assets/icons/strawberry-shortcake.svg) | Jordgubbstårta, Gräddtårta, Frukttårta | 3 |
| [birthday-cake.svg](../src/assets/icons/birthday-cake.svg) | Chokladtårta, Marängtårta, Moussetårta, Prinsesstårta, Schwarzwaldtårta | 5 |
| [ice-cream-cone.svg](../src/assets/icons/ice-cream-cone.svg) | Glasstrut, Glassrån | 2 |
| [sundae.svg](../src/assets/icons/sundae.svg) | Vaniljglass, Blåbärsglass, Chokladglass, Cookie dough-glass, Frozen yoghurt, Gelato | 26 |
| [baking-soda.svg](../src/assets/icons/baking-soda.svg) | Bikarbonat, Bakpulver | 2 |
| [canned-tomatoes.svg](../src/assets/icons/canned-tomatoes.svg) | Krossade tomater, Finkrossade tomater, Körsbärstomater på burk, Smaksatta krossade tomater, Tärnade tomater | 5 |
| [coffee-bean.svg](../src/assets/icons/coffee-bean.svg) | Kaffe, Kaffebönor, Ekologiskt kaffe, Espressomalet kaffe, Koffeinfritt kaffe, Kokkaffe | 9 |
| [honey-jar.svg](../src/assets/icons/honey-jar.svg) | Honung, Akaciahonung, Fast honung, Flytande honung, Ljunghonung, Manukahonung | 6 |
| [hummus.svg](../src/assets/icons/hummus.svg) | Hummus, Rödbetshummus, Smaksatt hummus | 3 |
| [jam-jar.svg](../src/assets/icons/jam-jar.svg) | Apelsinmarmelad, Aprikosmarmelad, Blåbärsmarmelad, Chilimarmelad, Citronmarmelad, Fikonmarmelad | 41 |
| [ketchup.svg](../src/assets/icons/ketchup.svg) | Ketchup, Chiliketchup, Curryketchup, Sockerfri ketchup | 4 |
| [mustard.svg](../src/assets/icons/mustard.svg) | Dijonsenap, Fransk senap, Grovkornig senap, Honungssenap, Julsenap, Skånsk senap | 8 |
| [mayonnaise.svg](../src/assets/icons/mayonnaise.svg) | Majonnäs, Aioli, Gurkmajonnäs, Chilimajonnäs, Lätt majonnäs, Srirachamajonnäs | 9 |
| [tomato-puree.svg](../src/assets/icons/tomato-puree.svg) | Tomatpuré | 1 |
| [olives.svg](../src/assets/icons/olives.svg) | Oliver, Castelvetrano-oliver, Fyllda oliver, Marinerade oliver, Olivmix, Urkärnade oliver | 8 |
| [orange-juice.svg](../src/assets/icons/orange-juice.svg) | Apelsinjuice, Apelsinjuice med fruktkött, Blodapelsinjuice, Färskpressad apelsinjuice, Clementinjuice | 5 |
| [juice-box.svg](../src/assets/icons/juice-box.svg) | Ananasjuice, Aroniajuice, Druvjuice, Granatäpplejuice, Grapefruktjuice, Grönsaksjuice | 20 |
| [sugar-dispenser.svg](../src/assets/icons/sugar-dispenser.svg) | Strösocker, Demerarasocker, Ekologiskt strösocker, Farinsocker, Florsocker, Kokossocker | 15 |
| [vanilla.svg](../src/assets/icons/vanilla.svg) | Vaniljstång, Vaniljpulver, Vaniljpasta, Vaniljextrakt, Vaniljarom | 5 |
| [potato-chips.svg](../src/assets/icons/potato-chips.svg) | Potatischips, Chilichips, Dillchips, Grillchips, Gräddfilschips, Kettlechips | 19 |
| [popcorn.svg](../src/assets/icons/popcorn.svg) | Chokladpopcorn, Kolapopcorn, Micropopcorn, Ostpopcorn, Popcorn, Popcornmajs | 8 |
| [tea-bag.svg](../src/assets/icons/tea-bag.svg) | Assamte, Ceylonte, Darjeelingte, English breakfast-te, Fruktte, Grönt te | 21 |
| [soda-can.svg](../src/assets/icons/soda-can.svg) | Apelsinläsk, Bitter lemon, Champagneläsk, Citron- och limeläsk, Citronläsk, Cola | 30 |
| [saft-bottle.svg](../src/assets/icons/saft-bottle.svg) | Apelsinsaft, Blandsaft, Blåbärssaft, Drickfärdig saft, Fläderblomssaft, Hallonsaft | 16 |
| [tin-can.svg](../src/assets/icons/tin-can.svg) | Bläckfisk på burk, Musslor på burk, Rökta musslor på burk, Krabbkött, Köttbullar på burk, Köttgryta på burk | 8 |
| [soup-bowl.svg](../src/assets/icons/soup-bowl.svg) | Svartsoppa, Fiskmix till soppa, Blomkålssoppa, Broccolisoppa, Bönsoppa, Fisksoppa | 48 |
| [greek-salad.svg](../src/assets/icons/greek-salad.svg) | Grekisk sallad, Fetaostsallad | 2 |
| [oregano.svg](../src/assets/icons/oregano.svg) | oregano | 0 |
| [rosemary.svg](../src/assets/icons/rosemary.svg) | rosmarin | 0 |
| [rocket.svg](../src/assets/icons/rocket.svg) | ruccola | 0 |
| [farfalle.svg](../src/assets/icons/farfalle.svg) | farfalle | 0 |

The available drawings sometimes cover a family rather than the exact product: raw potatoes use the mixed root vegetables, parsley root uses parsnips, and similar cheese varieties share their nearest cheese illustration. Oranges, zucchini, tofu and walnuts have no dedicated drawing in this collection and retain their category illustration. Household and other non-food icons are excluded from fridge ingredients.
