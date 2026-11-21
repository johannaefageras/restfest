---
# ─────────────────────────────────────────────────────────────
# MALL FÖR EN PASTATYP
# Kopiera filen, döp den till <slug>.md (t.ex. cavatelli.md) och
# ta bort kommentarerna. Slugen blir adressen, pasta/<slug>.html,
# och är det som står i bytMot.
# Lägg den fyrkantiga teckningen, till kortet i listan, i
# src/assets/icons/pasta/<slug>.svg (512 × 512), och omslaget, den
# breda teckningen överst på sortens sida, i
# src/assets/covers/pasta/<slug>.svg (ca 1672 × 941).
# Själva mallen byggs inte (eleventy.config.js hoppar över den).
#
# Alla fält är obligatoriska utom region, alias och recept.
# Testet: går det inte att fylla i för makaroner är det inte ett fält.
# ─────────────────────────────────────────────────────────────
namn: ""
bildAlt: ""

# lång | kort | rör | band | liten | fylld | ark
kategori: kort
# slät | räfflad (visas inte längre, men fyll i)
yta: slät
# minuter, [min, max]. Torkad om sorten finns både färsk och torkad.
koktid: [10, 12]
# välj ur: olivolja, tomater, ost, grädde, smör, kött, fisk, kyckling, skaldjur, svamp, sallad
saser: []
# torkad | färsk | båda | potatis. färsk/båda länkar till grundreceptet
# på färsk äggpasta. Är degen inte äggpasta (som culurgiones, med semola
# och vatten), lägg till raden grundrecept: "" så försvinner länken.
deg: torkad
# Region på svenska (Kampanien, Puglia, Ligurien …). Tomt om det inte går att säga.
region: ""
# Andra namn, svenska eller italienska. Söks på. Tomt är ok.
alias: []

# INTRO — form + tugg. Två meningar, ca 15–30 ord. Visas överst, utan rubrik.
intro: ""

# NAMNET — vad namnet betyder, och en daterad eller platsad detalj
# som är sann. 2–3 meningar.
namnet: ""

# FUNKTION — "Därför ser den ut så". Nämn en fysisk egenskap (hålrum,
# räfflor, yta, veck, tjocklek, längd) och vad den gör med sås eller
# mat. Gärna också vad formen inte klarar. Inget "passar till" här.
funktion: ""

# PASSAR TILL — 1–3 namngivna rätter. Inget "därför", det står ovan.
passarTill: ""

# BYT MOT — slugs till andra pastor som har en egen sida. 1–2 st.
bytMot: []

# RECEPT — valfritt. Recept i arkivet där sorten används, med
# filnamnet i src/recept/ utan .md (t.ex. 70-mac-and-cheese).
# Visas som "Prova i" och öppnas i receptrutan.
recept: []

# BRA ATT VETA — ett praktiskt tips om kokning eller servering,
# specifikt för just den här formen. 1–3 meningar.
braAttVeta: ""

# RÄDDA EN REST — en konkret rest i kylen, sedan metoden i 2–3
# meningar. Får avslutas med en torr mening, men bara om den är
# specifik. "Det här är X." och "Det är X." räknas inte.
raddaEnRest: ""
---

<!-- Valfri brödtext. Visas under fälten på detaljsidan om den finns.
     Lämna tomt om det inte finns mer att säga. -->
