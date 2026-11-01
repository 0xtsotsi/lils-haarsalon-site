# Socialmediapakket — Lil's haarsalon

Een vaste set beelden, teksten en video's voor Instagram, Facebook en WhatsApp.
Alles wat hier staat past bij de website en bij elkaar: het is één merk.

**Wat je hebt**

- 12 kant-en-klare posts, elk in 4 formaten (48 bestanden)
- 4 korte video's
- 5 vaste postschemas die steeds terugkomen
- Bijschriften, hashtags en een weekschema
- De sjablonen zelf, zodat er nieuwe posts bij kunnen

---

## De vier formaten

Elke post staat in vier maten. Je kiest het onderwerp één keer en daarna is het
beeld voor elk kanaal klaar.

| Formaat | Afmeting | Waarvoor |
| --- | --- | --- |
| `square` | 1080 × 1080 | Instagram vierkant, Facebook, LinkedIn, WhatsApp |
| `portrait` | 1080 × 1350 | Instagram feed (4:5), Facebook feed |
| `story` | 1080 × 1920 | Instagram en Facebook Stories, WhatsApp Status |
| `landscape` | 1200 × 628 | Facebook omslag, LinkedIn, link in een bericht |

Het vierkante formaat is de basis. `portrait` vult het meeste scherm op een
telefoon, dus dat is meestal de beste keuze voor de gewone feed. `story` is
verticaal voor het doorver-scrollen, met de ruimte boven en onder vrij gelaten
zodat Instagram zijn eigen knoppen niet over de tekst legt.

De bestanden staan in `output/images/<formaat>/<id>.jpg`. Het zijn JPEG's op
kwaliteit 92, want dat is het formaat dat je ook uploadt.

## De video's

| Bestand | Formaat | Lengte | Inhoud |
| --- | --- | --- | --- |
| `de-knip.mp4` | 1080 × 1920 | 6,4 s | De schaar knipt langs de haarlijn, het merk komt erbij |
| `de-knip-vierkant.mp4` | 1080 × 1080 | 6,4 s | Dezelfde, vierkant |
| `de-salon.mp4` | 1080 × 1920 | 6,4 s | De salon, de camera zakt rustig naar binnen |
| `het-stoplicht.mp4` | 1080 × 1920 | 6,4 s | Het stoplicht gaat van rood naar groen |

Alle video's zijn H.264, yuv420p, 30 fps, zonder geluid. Voeg muziek toe in
Instagram zelf, dan heb je muziek die bij de trending audio past.

De video's hebben geen audio omdat er geen muziek bij is die je zomaar mag
gebruiken. Zet er zelf muziek onder in de app, of laat ze staan.

## De vijf schemas

De manieren waarop je post. Ze blijven hetzelfde, dus je feed ziet er elke
week herkenbaar uit.

| Schema | Wat het is | Bestand |
| --- | --- | --- |
| Sfeer | Foto van de salon of het werk, met één zin erboven | `post-foto.html` |
| Prijs | Eén behandeling met de prijs vanaf | `post-prijs.html` |
| Haaradvies | Een tip in een kaart met bullets | `post-tip.html` |
| Openingstijden | Het stoplicht en de weektijd | `post-stoplicht.html` |
| Team | De drie vaste gezichten | `post-team.html` |

Meer over de inhoud en de volgorde: `content/schemas.md` en
`content/planning.md`.

## Teksten

- `content/bijschriften-overzicht.md` — per post de bijschrift en de hashtags,
  klaar om te kopiëren
- `content/bijschriften.md` — hoe je een bijschrift opbouwt, en de hashtagsets
- `content/planning.md` — wat je elke week doet

## Een nieuwe post maken

Alle teksten staan op één plek: `content/posts.json`. Elke post heeft een id,
een sjabloon, een foto, de teksten, een bijschrift en hashtags.

```json
{
  "id": "prijs-fohnen",
  "template": "post-prijs.html",
  "img": "salon-happy.jpg",
  "focal": "50% 45%",
  "eyebrow": "Föhnen en stylen",
  "title": "Föhnen en stylen",
  "body": "Strijken, krullen of juist spiegelglad.",
  "price": "19,50",
  "caption": "Föhnen en stylen bij Lil's haarsalon vanaf 19,50. Strijken, krullen of juist spiegelglad. Bel 0181-219017.",
  "hashtags": ["#lilshaarsalon", "#rozenburg", "#kapsalon", "#styling", "#fohnen"]
}
```

Daarna:

```
node scripts/render-images.mjs
node scripts/export-captions.mjs
```

Het eerste script maakt de bestanden, het tweede zet de bijschriften in een
overzicht. De video's maak je met:

```
node scripts/render-videos.mjs
```

Om één video opnieuw te maken (sneller tijdens het experimenteren):

```
node scripts/render-one-video.mjs de-knip
```

### De focus van een foto

`focal` bepaalt welk deel van de foto zichtbaar blijft. Dat is nodig, want
dezelfde foto wordt in vier verhoudingen gebruikt. `50% 50%` is het midden,
`50% 20%` is bijvoorbeeld het bovenste deel.

## Wat je nodig hebt

- Node.js 20 of nieuwer
- Playwright met Chromium: `npm install --save-dev playwright && npx playwright install chromium`
- ffmpeg, alleen voor de video's

De lettertypen staan in `assets/fonts` (Fraunces en Karla, beide vrij te
gebruiken). Daardoor hangt het renderen niet van internet af.

## Wat er in deze map zit

```
assets/
  fonts/          Fraunces en Karla, lokaal
  logo/           het stoplicht-logo, profielfoto en omslag
images/           de foto's die in de posts staan
templates/        de vijf sjablonen, plus de drie video-scenes
scripts/          de render-scripts
content/          de teksten, het schema en de planning
output/
  images/         de 48 beelden, per formaat
  video/          de vier mp4's
```

## Belangrijk over de foto's

De foto's in `images/` zijn sfeerbeelden, geen foto's van deze salon. Op de
website staat dat er dan ook: *"Foto's: salon (eigen) en Pexels"*.

Zodra de salon zelf foto's maakt, wissel je die in. Een echte klant, een echte
kapster, een echte voor-en-na: dat is sterker dan welk stockbeeld ook, en het
is het enige wat het publiek zelf kan controleren.

## De merkregels op een rij

- **Kleuren** diepgroen `#18251f`, warm ivoor `#f9f7f1`, messing `#c59542`
- **Lettertypen** Fraunces voor de kop, Karla voor de tekst
- **Het stoplicht** staat op elke post, linksboven
- **Voettekst** op elke post: Molenweg 49, Rozenburg, 0181-219017
- **Rustig** geen emoji's in de beelden zelf, wel in de hashtags
- **Dezelfde opmaak** voor elk schema, zodat de feed herkenbaar blijft
