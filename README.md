# Lil's haarsalon — website

Een statische website voor **Lil's haarsalon**, Molenweg 49 in Rozenburg (ZH).
Geen build-stap, geen dependencies.

## De live site

**https://0xtsotsi.github.io/lils-haarsalon-site/**

Die link is permanent en altijd bereikbaar. De staat op GitHub Pages: de code
staat in de repository `0xtsotsi/lils-haarsalon-site` en elke keer
dat je naar `main` pusht, bouwt GitHub de site opnieuw. De repo is openbaar,
want GitHub Pages is op een gratis account alleen mogelijk voor openbare repos.
Er staat geen privékleding of wachtwoord in.

De vier pagina's:

| | |
|---|---|
| Home | https://0xtsotsi.github.io/lils-haarsalon-site/ |
| Behandelingen | https://0xtsotsi.github.io/lils-haarsalon-site/behandelingen/ |
| Over ons | https://0xtsotsi.github.io/lils-haarsalon-site/over-ons/ |
| Contact | https://0xtsotsi.github.io/lils-haarsalon-site/contact/ |

Daarnaast staat het **socialmediapakket** op:

**https://0xtsotsi.github.io/lils-haarsalon-site/social/**

Daar staan 12 kant-en-klare posts (elk in vier formaten), vier korte video's,
de bijschriften met hashtags en het weekschema. Alles is met één klik te
downloaden. Zie `social/README.md` voor de volledige beschrijving.

## De site lokaal openen

**Makkelijkst: dubbelklik `index.html`.** De site werkt dan meteen, zonder server.

**Met een lokale server** (aanbevolen, want dan werken alle paden en de kaart hetzelfde
als op een echte server):

- Windows: dubbelklik **`start-site.bat`**. De browser gaat vanzelf open op
  `http://localhost:8123`. Sluit het venster om te stoppen.
- Of via de terminal: `npm install` een keer, daarna `npm start`.

**Tijdelijk delen via een tunnel** (handig om even iemand live te laten kijken):

- Dubbelklik **`start-tunnel.bat`**. Dit start de lokale server én een publieke
  tunnel via Cloudflare. Er verschijnt een URL als
  `https://....trycloudflare.com` die je kunt kopiëren en delen. Stoppen gaat door
  het venster te sluiten.
- Let op: zo'n tunnel is tijdelijk en heeft geen uptime-garantie. Hij stopt zodra
  je het venster sluit of je computer uitgaat, en de URL verandert bij elke start.
  Gebruik voor de vaste link de GitHub Pages-link hierboven.

De vier pagina's lokaal zijn dan te vinden op:

| | |
|---|---|
| Home | http://localhost:8123/ |
| Behandelingen | http://localhost:8123/behandelingen/ |
| Over ons | http://localhost:8123/over-ons/ |
| Contact | http://localhost:8123/contact/ |

## Het socialmediapakket

In `social/` staat een vast pakket voor Instagram, Facebook en WhatsApp:

- **48 beelden**: 12 posts, elk in vier formaten (vierkant 1080, portret
  1080x1350, story 1080x1920, landschap 1200x628)
- **4 video's** van 6,4 seconden, H.264 en 30 fps
- **5 postschemas** die steeds terugkomen: sfeer, prijs, haaradvies,
  openingstijden en team
- Bijschriften met hashtags, en een weekschema

Alles is gebouwd op dezelfde merkidentiteit als de website: hetzelfde groen,
ivoor en messing, dezelfde lettertypen, het stoplicht linksboven op elke post
en de knip als video.

Opnieuw renderen gaat met:

```bash
npm run social:images     # de 48 beelden
npm run social:video      # de vier video's (ffmpeg nodig)
npm run social:all        # beelden, bijschriften en de downloadpagina
```

De sjablonen staan in `social/templates/`, alle teksten in
`social/content/posts.json`. Zie `social/README.md`.

## Mapstructuur

```
index.html              home
behandelingen/          behandelingen en tarieven
over-ons/               over de salon en het team
contact/                contactgegevens, kaart en afspraakformulier
assets/css/styles.css   alle stijlen en design tokens
assets/js/main.js       statuslamp, mobiel menu, openingstijden, formulier, scroll-reveal
assets/img/             foto's
social/                 het socialmediapakket (zie social/README.md)
start-site.bat          start de lokale server en open de browser
start-tunnel.bat        start de server plus een publieke tunnel om te delen
DESIGN.md               ontwerpkeuzes en kleurcontrasten
```

## De site online zetten

De site staat op GitHub Pages. Om iets te wijzigen:

1. Pas de bestanden aan in deze map.
2. `git add` en `git commit`.
3. `git push pages main:main`

GitHub bouwt de site daarna binnen een minuut opnieuw. De URL blijft hetzelfde.

De repository `0xtsotsi/LilsHaarsalon` is de privé-versie waar de voorgeschiedenis
staat; `0xtsotsi/lils-haarsalon-site` is de openbare repo die Pages
serveert.

## Wat er staat vast

| | |
|---|---|
| Adres | Molenweg 49, 3181 AT Rozenburg |
| Telefoon | 0181-219017 |
| Openingstijden | ma, di, do, vr 09:00-17:30 · za 08:30-15:00 · wo en zo gesloten |
| Instagram | instagram.com/lilshaarsalon |
| Facebook | facebook.com/p/Lils-haarsalon-100063602287699 |
| Team | Lil, Sandra en Charèl |
| Beoordelingen | 3,8 van 5 op basis van 38 beoordelingen (openingstijden.nl) |

Bron: openingstijden.nl, beautynailhairsalons.com, haar.expert, revieweuro.com, de
openbare Facebook- en Instagrampagina van de salon en de OpenStreetMap-locatie,
geraadpleegd op 30 oktober 2026.

De drie klantreacties op de homepage zijn letterlijk overgenomen uit openbare
beoordelingen op revieweuro.com, met de naam van de reviewer erbij. De gemiddelde
score staat erbij, zodat het beeld niet onevenredig roze is.

## De knip en de beweging

Onder de intro van elke pagina loopt een haarlijn met een kapschaar die erlangs
rijdt en af en toe knipt. Dat is het vaste beeldmerk van de site, naast het
stoplicht. Daarnaast komen blokken zachtjes omhoog als je er langs scrolt, de
live statuslamp ademt zolang de salon open is, en de hero-foto drijft heel langzaam.

Alles draait op CSS, behalve de scroll-reveal (IntersectionObserver). Wie liever
stil wil, krijgt dat van de browser zelf: `prefers-reduced-motion` zet alle
beweging uit en de tekst staat meteen. Is er geen JavaScript, dan blijft de tekst
gewoon staan.

## Het stoplicht

De salon heeft een stoplicht aan de deur: rood = helaas, oranje = misschien, groen =
kom binnen. Dat is het vaste element van de site en het komt uit een echte
klantreactie ("Werken op afspraak en met stoplicht buiten. Uitleg van de kleurcodering
stoplicht Rood - Helaas, Oranje - Misschien, Groen - Je kan vast geholpen worden").

De statuslamp in de bovenbalk rekent zelfde status uit de openingstijden, dus die
zegt open of gesloten, niet druk of vrij. Wil je dat de lamp ook de drukte toont, dan
moet dat vanaf de salon zelf gekoppeld worden.

## Wat je nog moet doen voor live gang

1. **Formulier koppelen.** Het afspraakformulier valideert en vat het bericht samen,
   maar verstuurt nog niets. Zet de gegevens op een formulierverwerker en koppel die
   aan `<form>` in `contact/index.html`.
2. **Prijzen controleren.** De tarieven zijn indicatief en opgebouwd uit gangbare
   Nederlandse salonprijzen. Vervang ze door de echte prijzen in
   `behandelingen/index.html` en in de prijssectie op `index.html`.
3. **Foto's vervangen.** De meeste foto's komen van Pexels en zijn sfeerbeelden, geen
   echt werk van deze salon. Twee foto's zijn wél van Lil's haarsalon zelf, via hun
   openbare Facebookpagina: `salon-interior-real.jpg` en `salon-interior-wide.jpg`
   (de interieurfoto met de oranje leren stoelen). Die staan in de sfeergalerij op
   de homepage en in de salon-galerij op over-ons. Zodra er eigen foto's zijn,
   vervang dan `assets/img/` en pas de teksten in de `alt`-attributen aan. Houd de
   regel aan: geen foto twee keer op dezelfde pagina, en geen tekst die iets beschrijft
   wat de eigen foto niet toont.
4. **Domein en beveiliging.** `robots.txt` en `sitemap.xml` verwijzen naar
   `lilshaarsalon.nl`. Dat domein bestaat nog niet. Zodra je het domein
   koopt en op GitHub Pages zet, pas die twee bestanden en de `canonical`- en
   `og:url`-tags in de vier HTML-bestanden aan. Tot die tijd is de
   Pages-link de echte link.
5. **KvK en privacy.** Voeg een privacyverklaring en het KvK-nummer toe zodra die
   bekend zijn. De formululiergegevens worden nu nergens opgeslagen.

## Techniek

- Geen framework, geen build. Vier HTML-pagina's, één stylesheet, één script.
- Fonts: **Fraunces** (koppen) en **Karla** (tekst) via Google Fonts.
- Kleuren staan als OKLCH-tokens in `assets/css/styles.css`: diepgroen, warm ivoor en
  messing. Alle tekstalternatieven halen 4.5:1 of hoger, gemeten in de browser.
- Statuslamp en "vandaag"-markering worden berekend uit `HOURS` in
  `assets/js/main.js`.
- `prefers-reduced-motion` zet alle beweging uit.
- `main.js` is bewust een klassiek script en geen ES-module: vanuit `file://`
  blokkeert de browser modules wegens CORS, en de site moet ook werken als je
  `index.html` dubbelklikt.

## Lokaal bekijken

```bash
npm install
npm start
```

Of open `index.html` direct. De kaart en de lettertypen laden dan via het internet.
