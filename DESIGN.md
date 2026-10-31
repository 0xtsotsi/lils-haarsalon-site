# Lil's haarsalon — design thesis

## Subject + audience + single job
A neighbourhood hair salon in the centre of Rozenburg (Molenweg 49), run by Lil with
colleagues Sandra and Charèl. Audience: Rozenburg residents, families with children,
people who want a fair price and a no-nonsense cut.

Single job: **make it easy to book or call, and make people trust the salon before
they ever walk in.** Everything else is secondary.

The reviews describe the business as *"kleine sfeervolle haarsalon"*, *"netjes en
schoon"*, *"betaalbaar"*, *"gezellig"*, *"voor jong en oud"*. The design has to feel
that way: warm and open, never exclusive or clinical.

## Signature (one memorable device, from the subject's world)
The salon keeps a **traffic light outside the door** with a colour code the customers
describe in reviews: red = helaas (full), orange = misschien (maybe), green = je kan
vast geholpen worden. That is real, documented behaviour from this exact business.

The whole site is built around that stoplicht: a live status lamp in the header
(green = open now, orange = closing soon / busy, red = closed today), and a stoplicht
legend on the contact section. It replaces the generic "openingstijden" table as the
thing people actually look for when they want a walk-in.

De tweede herkenning is de **knip**: een messingstreep van 36px boven elke
sectiekop, en de schaar op de haarlijn (zie Motion).

## Type
- Display: **Fraunces** — a variable "soft serif" with optical-size, SOFT and WONK
  axes. Warm, crafted and a little editorial, without the coldness of a didone. It
  says *"we care about the craft"* rather than *"come to us, we are premium"*, which
  is the right register for a neighbourhood salon. Headline sizes use `opsz 120`,
  section headings `opsz 72`, smaller headings `opsz 36`.
- Body/UI: **Karla** — a slightly quirky grotesque with excellent Dutch diacritics
  and a warm voice that sits next to Fraunces without competing.

Two families, clear role split. Scale ratio 1.25, named tokens.

## Colour (OKLCH, measured) — warm botanical
Deep forest green, warm ivory and brass. Chosen over the previous burnt-orange
scheme because orange-on-cream is loud and generic, and because green reads
"natural, calm, professional" without ever going clinical.

- `--ink`      oklch(0.25 0.022 165)   deep forest black  #18251f
- `--ink-700`  oklch(0.41 0.022 165)   secondary text     #404e47
- `--ink-500`  oklch(0.495 0.018 160)  muted text         #59655e
- `--bg`       oklch(0.975 0.008 88)   warm ivory        #f9f7f1
- `--surface`  oklch(0.943 0.013 84)   soft oat          #f0ece3
- `--accent`   oklch(0.45 0.095 158)   deep forest green #176540
- `--accent-700` oklch(0.36 0.078 158) darker green      #0b492d (links, buttons)
- `--brass`    oklch(0.70 0.115 78)    warm brass        #c59542
- `--brass-700` oklch(0.50 0.095 72)   brass text        #84591a
- `--green` / `--amber` / `--red` — the stoplicht lamps, used **only** for the lamps
  and always paired with a text label. Brighter `--*-lit` variants glow on dark.

Measured contrast (every pair verified in the browser, 0 failures):
ink/bg 14.77 · ink700/bg 8.12 · ink500/bg 5.65 · ink500/surface 5.14 ·
white/accent 7.09 · white/accent700 10.47 · accent700/bg 9.74 ·
brass700/bg 5.69 · ink/brass 5.86 · ink400/bg 3.36 (UI boundaries only).
ink500 is 4.72 on surface2, so it is never used for body text on that surface.

**Rule that forced the second accent:** a green button on a green background cannot
work. On dark sections the primary button is therefore **brass** with dark green
text (5.86), which is why brass is in the palette at all.

## Space / density
Base unit 4px, scale 4/8/12/16/24/32/48/64/96. Marketing density: generous section
padding (96px desktop), tight inside cards (24px).

## Radius + material
Radius scale by role: 10px inputs/buttons, 16px cards, 28px media frames, full only
for the lamp and status pills. Material model: flat paper + hairline borders, one
elevation level (the hero image and the nav on scroll). No glass, no blurred panels.

## Imagery
**The image has to agree with the headline.** The headline promises *"de gezellige
kapsalon"*, so the hero shows a stylist working on a client under warm lamps, with
the salon's leather chairs behind her. An empty room in the hero contradicted both
the word "gezellig" and the status lamp that says the salon is open.

The real salon interior (photographed from their own Facebook page) leads the
*sfeer* gallery on the homepage, where the copy names the orange chairs. The same
room, cropped wide, leads the *De salon* gallery on the over-ons page. Each page
shows the real salon exactly once, so it never looks repetitive.

Supporting photography from Pexels covers the treatments and the gallery. Every
image has intrinsic dimensions, a `srcset` with a smaller variant, meaningful alt
text and lazy loading below the fold. The hero is preloaded with `fetchpriority="high"`
because it is the LCP element.

**Rule:** no photo appears twice on one page, and no section's text describes a
detail that its own image does not show.

**Two lessons the photos taught:**
- A posed, heavily made-up face reads as "sjagereinig" and fights the word
  "gezellig". The gallery therefore leads with the real salon and with people
  who are genuinely laughing (a mother and her daughter at the hairdresser),
  not with a styled model holding a perfect expression.
- The same model in two similar poses reads as "the same photo twice". Where the
  gallery needs a face, it gets one shot of one person, and the other slots
  are details (hands with comb and scissors, washing, the room itself).

## Motion
Vier bewegingen, allemaal subtiel genoeg om niet op te vallen tenzij je er
aandacht aan besteedt.

**De knip** is de signature: onder elke openingsblok loopt een haarlijn met een
kapschaar die erlangs rijdt. De schaar knipt zes keer onderweg; waar de bladen
elkaar raken, is de lijn even onderbroken en valt er een lokje weg. Eén
rondgang duurt 18 seconden, de knip zelf elke 3,4 seconden. De schaar en het
afgeknipte lokje zijn warm messing, de haarlijn is een zachte groene lijn. De
knip staat op elke pagina op dezelfde plek: onder de intro, op de overgang naar
de inhoud.

De schaar zelf is een lijntekening: twee elliptische vingerringen, gedraaid
langs de handvat-as, en twee lange bladen die elkaar precies in het midden
kruisen. Het kruispunt zit exact op de haarlijn, dus de onderbreking valt
altijd samen met de plek waar geknipt wordt. De onderbreking is een vast
element van 13 pixel breed dat dezelfde baan volgt als de schaar, niet een
masker in de svg. Zo blijft hij op elk schermformaat even breed en valt hij
niet weg zodra de svg schaalt.

De kleur van het onderbrekvlakje volgt de ondergrond: op de homepage het
ivoor van de hero, op de subpagina's het lichte vlak van de kop. Zo blijft de
knip op elke pagina onzichtbaar.

**Scroll-reveal** laat blokken 18px omhoog komen als ze in beeld komen
(620ms, uit-ease), met 60ms verschil tussen opeenvolgende blokken in dezelfde
sectie. Alleen actief als `IntersectionObserver` beschikbaar is en de bezoeker
geen voorkeur voor minder beweging heeft; anders staat alles meteen.
De eerste verf maakt de klasse `js-reveal` al in de `<head>` aan, met een
vangnettimer: als het script niet laadt, verdwijnt de klasse en blijft de tekst
zichtbaar.

**De live statuslamp** ademt: een ring schuift zachtjes uit zolang de salon open
is. **De hero-foto** drijft in dertig seconden van 102% naar 106%.

Kleuren en randen reageren in 90–180ms, zoals eerder. Onder
`prefers-reduced-motion` verdwijnen alle bewegingen: de schaar blijft in het
midden staan met de bladen open, de hero-foto staat stil en de tekst is meteen
zichtbaar.

## Alignment
One rail: 1200px max, 24px gutters (40px ≥1024px). The hero photo is a deliberate
breakout to the right screen edge; its text stays on the rail.

## Rejected defaults
- Reference site (denatuurlijkekapper.nl) is olive-green + cream + Avenir with a
  centred white card hero over a photo. **Replaced**: its own deep-forest-green +
  ivory + brass identity, asymmetric left-aligned hero, Fraunces instead of Avenir.
- No centred gradient hero, no violet, no glass cards, no bento grid, no icon
  medallions, no ALL-CAPS eyebrows, no em dashes in copy, no emoji as icons.
- The "three equal feature cards" is replaced by a ranked service list with real
  prices and a two-column layout, so prices (the thing people want) lead.
