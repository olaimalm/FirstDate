# FirstDate i App Store Connect

Tekst du kan lime rett inn. Selve appen er på engelsk, så engelsk er hovedspråket.

## Rekkefølge

1. Sjekk at avtalen for betalte apper, bank og skatt er godkjent under **Business**.
2. Opprett appen under **Apps → + → New App**.
3. Opprett kjøpet (se under).
4. Bygg og last opp til TestFlight, og test kjøpet.
5. Fyll ut appsiden, velg bygget, legg ved kjøpet og send inn.

## Ny app

| Felt | Verdi |
|---|---|
| Platform | iOS |
| Name | First Date: Questions & Dares |
| Primary language | English (U.K.) eller English (U.S.) |
| Bundle ID | com.olaimalm.FirstDate |
| SKU | firstdate-ios |
| User access | Full Access |

Hvis navnet er tatt, kan du prøve `FirstDate: Questions & Dares`.

## Kjøpet (Monetization → In-App Purchases)

| Felt | Verdi |
|---|---|
| Type | Non-Consumable |
| Reference name | Level 5 Untamed |
| Product ID | com.olaimalm.FirstDate.untamed |
| Price | 11 kr hvis det finnes, ellers nærmeste pris |
| Availability | All countries or regions |
| Display name | Level 5: Untamed |
| Description | Unlocks Level 5 with 50 more cards. |
| Review screenshot | store/screenshots/iap-review.png |

Product ID må være nøyaktig som over, og kan ikke endres eller gjenbrukes etterpå.

**Review notes for kjøpet:**

> Tap Begin the Evening, then Level 5. The purchase screen shows the price and Restore Purchase.

## Appsiden

**Subtitle**

> Questions & dares, scored

**Promotional text**

> Take turns, earn hearts, and skip at your own risk: every skipped card costs a forfeit. Add your own cards and see who takes the evening.

**Description**

> Make the evening one to remember.
>
> First Date is a game for two, played face to face on one phone. Enter your names, then take turns with questions and dares. Answer a question for one heart, finish a dare for two. Skip a card and you get a forfeit instead. At the end of the night you see who took the evening.
>
> HOW IT WORKS
> - Two players take turns, and the app keeps score
> - Skipping is always allowed, but it costs a forfeit
> - Tap the star to keep a card you want to remember
> - End the evening for a summary: hearts, dares, forfeits and the cards you kept
> - Share the summary with each other afterwards
>
> YOUR OWN CARDS
> Write your own questions and dares, and pick the level they belong to. They're shuffled in with the rest and stay only on your phone.
>
> FIVE LEVELS, 50 CARDS EACH
> - Icebreaker: get comfortable
> - Getting Warmer: a little more personal
> - Sparks: now you're flirting
> - Desire: things are heating up
> - Untamed: for adults only
>
> SIMPLE TO PLAY
> - No account needed
> - No ads
> - Works without internet
>
> Levels 1 to 4 are free. Level 5 is a one-time in-app purchase, not a subscription.
>
> Every card is only a suggestion. Skip anything you don't want to do, and always respect your date's boundaries.
>
> For ages 18 and over.

**Keywords**

> date night,couples game,score,forfeit,custom cards,questions,dares,icebreaker,two player,romance

**Støtte og personvern**

| Felt | Verdi |
|---|---|
| Support URL | https://olaimalm.github.io/firstdate-support/ |
| Privacy Policy URL | https://olaimalm.github.io/firstdate-support/privacy.html |
| Copyright | 2026 Olai Malm |
| Primary category | Entertainment |
| Secondary category | Lifestyle |
| Price | Free |

**Skjermbilder (iPhone 6.5" eller 6.9")**

Bruk de seks i `store/screenshots/v2/`, i rekkefølge 1–6. De er 1179×2556 piksler (iPhone 6.1"/6.3") og viser de nye funksjonene. Slett de gamle bildene i App Store Connect først. De gamle 1.0-bildene i `store/screenshots/` brukes ikke lenger. Apple krever at bilder passer for 4+ uansett appens aldersgrense, så de viser bare nivå 1 og 2.

Bildene er tatt fra nettversjonen av appen. Skjermene er like, men hvis du vil ha bilder fra selve iPhonen, kan du ta dem fra TestFlight-bygget.

## Aldersgrense

Svarene dine er ditt ansvar, og Apple kan overstyre dem. Dette er forslaget mitt ut fra innholdet:

| Spørsmål | Svar |
|---|---|
| Mature or Suggestive Themes | Frequent |
| Sexual Content or Nudity | Frequent |
| Graphic Sexual Content and Nudity | None (se under) |
| Alcohol, Tobacco, or Drug Use or References | Infrequent (body shot-kortet) |
| Profanity or Crude Humor | Infrequent |
| Alt annet | None eller No |

Det gir 18+. Kortene beskriver ikke sex i detalj, men flere ber om seksuelle handlinger og eksplisitte fantasier. Grensen til "Graphic" er derfor en vurdering du selv må gjøre. Apple skriver at apper med "Graphic" ikke kan publiseres i App Store.

## App Privacy

Velg **Data Not Collected**. Kjøp håndteres av Apple, og koden samler ikke inn noe selv.

## App Review Information

**Notes**

> First Date is a scored game for two adults, played in person on one phone. Players enter their names and take turns. A question earns one heart, a dare two, and skipping a card draws a forfeit. Players can keep cards with the star, and End Evening shows a summary of the night. Under Your Cards, players can write their own questions and dares. These are stored only on the device and are never uploaded or shown to anyone else. The app has no accounts, no servers and no communication between users.
>
> Levels 1 to 4 are free. Level 5 is unlocked with the non-consumable in-app purchase com.olaimalm.FirstDate.untamed. To test it: tap Begin the Evening, then Start, then Level 5, then Unlock. Restore Purchase is on the same screen.
>
> Levels 4 and 5 contain adult themes, and the app is rated 18+. All cards are written by the developer. They are prompts for consenting adults, and players can skip any card.

Sign-in required: **No**.

## Test av ekte kjøp via TestFlight

1. Last opp bygget til TestFlight, og legg deg selv til som intern tester.
2. Installer FirstDate fra TestFlight-appen på iPhonen.
3. Åpne nivå 5. Prisen skal komme fra Apple, og "Test mode" skal ikke vises.
4. Trykk Unlock og fullfør kjøpet. I TestFlight belastes du ikke.
5. Sjekk at nivå 5 starter og at låsen er borte.
6. Lukk appen helt og åpne den igjen. Nivå 5 skal fortsatt være åpent.
7. Slett appen, installer den på nytt og trykk **Restore Purchase**. Nivå 5 skal åpnes igjen.

## Etter avslaget 13.11.2026 (4.3 Spam)

Apple mente 1.0.0 lignet for mye på andre apper. Bygget som sendes inn på nytt har fått poeng og turer for to navngitte spillere, straff når man hopper over et kort, egne kort som lagres på telefonen, stjerne for kort man vil huske, og et sammendrag av kvelden som kan deles. Teksten under limes inn som svar i App Review når det nye bygget sendes inn.

**Svar til App Review**

> Thank you for the feedback. We have made substantial changes in this build:
>
> - First Date is now a scored game for two named players. The app tracks turns, and players earn hearts for answering questions and completing dares.
> - Skipping a card draws a forfeit, so the game has stakes rather than being a list of prompts.
> - Your Cards lets players write their own questions and dares, choose a level for them, and have them shuffled into that level. They are stored only on the device.
> - Players can keep cards with a star, and End Evening shows a summary of the night (hearts, dares, forfeits and kept cards) that can be shared.
>
> The app is a standalone product and the first and only app on this developer account. It was not built from a commercial template or app generation service. The concept, the code and all card content are my own, and no client or third party is involved.
