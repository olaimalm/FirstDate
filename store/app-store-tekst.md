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

> Conversation cards for two

**Promotional text**

> Skip the small talk. Five levels of questions and dares take you from easy icebreakers to the conversations you'll remember.

**Description**

> Make the evening one to remember.
>
> First Date is a card game for two. Take turns with questions and dares, and go as deep as you both feel like. Start with light icebreakers and work your way through the levels at your own pace.
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

> date,couples,conversation,cards,questions,dares,icebreaker,game for two,relationship,romance

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

Bruk disse fire, i denne rekkefølgen: `store/screenshots/1-home.png`, `2-levels.png`, `3-question.png` og `4-dare.png`. De er 1290×2796 piksler. Apple krever at bilder passer for 4+ uansett appens aldersgrense, så de viser bare nivå 1 og 2.

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

> First Date is a card game for two adults, played in person on one phone. It has no accounts, no user-generated content and no communication between users.
>
> Levels 1 to 4 are free. Level 5 is unlocked with the non-consumable in-app purchase com.olaimalm.FirstDate.untamed. To test it: tap Begin the Evening, then Level 5, then Unlock. Restore Purchase is on the same screen.
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
