# Project Name

## Overview

This client-sida JavaScript web application provides a platform to residents in the Lower Mainland to search for landlords and review their landlords. Finding a place to rent in this economy is already hard, but it gets even worse when you have an awful landlord. We want to give tenants a voice and help people have the best renting experiences possible.

Developed for the COMP 1800 course, applying User-Centred Design practices, agile project management processes, and Firebase backend services.

---

## Features

-   Search for landlords by name.
-   Add your landlord to review.
-   Review existing landlords.
-   Delete your reviews.

---

## Technologies Used

-   **Frontend**: HTML, TailwindCSS, JavaScript
-   **Backend**: Firebase for hosting
-   **Database**: Firestore

---

## Usage

1. Open your browser and visit `https://bby14-rate-my-landlord.web.app/`
2. Enter the name of your landlord in the search bar and press search to see if they're in the database. Or you can just press search to see all landlords in the database sorted by ratings high to low.
3. Click on a landlord to read their reviews. You can click add review if you want to review that landlord.
4. If you want to review a landlord that doesn't exist click the pen and paper icon to add a landlord and a write a review on them.

---

## Project Structure

```
1800_202510_BBY14/
├── firebase.json
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── assets
│   │   ├── Account.svg
│   │   ├── FindLandlords.png
│   │   ├── fonts
│   │   │   ├── SpaceGrotesk.ttf
│   │   │   ├── SpaceMono-Bold.ttf
│   │   │   ├── SpaceMono-BoldItalic.ttf
│   │   │   ├── SpaceMono-Italic.ttf
│   │   │   └── SpaceMono-Regular.ttf
│   │   ├── home.png
│   │   ├── RateLandlord.png
│   │   ├── ratemylandlord-full.png
│   │   ├── ratemylandlord-text.png
│   │   ├── ratemylandlord-url.png
│   │   ├── rml-ico-outline.svg
│   │   ├── rml-ico.svg
│   │   ├── rml-review.svg
│   │   ├── rml-search.svg
│   │   ├── SearchFilters.png
│   │   ├── StarIcon.svg
│   │   ├── StarIconActive.svg
│   │   ├── StarIconYellow.svg
│   │   └── user.png
│   ├── components
│   │   ├── landlord-card.html
│   │   ├── review-card.html
│   │   └── search-bar.html
│   └── partials
│       ├── addLandlord.html
│       ├── editLandlord.html
│       ├── home.html
│       ├── landlord.html
│       ├── login.html
│       ├── profile.html
│       ├── reviewLandlord.html
│       ├── search.html
│       ├── submitted.html
│       └── verifyLandlord.html
├── README.md
├── src
│   ├── addLandlord.js
│   ├── authentication.js
│   ├── base.css
│   ├── editLandlord.js
│   ├── firebaseAPI_BBY14.js
│   ├── firebaseInit.js
│   ├── helper.js
│   ├── landlord.js
│   ├── load.js
│   ├── logout.js
│   ├── main.js
│   ├── profile.js
│   ├── reviewLandlord.js
│   ├── search.js
│   ├── userLoggedIn.js
│   └── verifyLandlord.js
├── tsconfig.json
├── .gitignore
└── vite.config.ts
```

---

## Contributors

-   **Ryan** - BCIT CST Student, lives in surrey :(
-   **Samuel** - BCIT CST Student, from Whistler. Loves programming & graphic design.
-   **Hyelim Kim** - BCIT CST Student with a passion for creating user-friendly applications. Fun fact: Loves baking bread.

---

## Acknowledgments

-   All icons and art in the app were created by Sam.

---

## Limitations and Future Work

### Limitations

-   Currently the app doesn't have features to sort by a location so it's only really going to work for people in the lower mainland.
-   Currently you can only search by landlord name no filtering for things like ratings high to low or ratings low to high.
-   We don't have any features to handle things like bots, trolls, etc.

### Future Work

-   Create a dark mode.
-   Add more to the landlord pages such as presenting thier 5 most used tags on their page.
-   Add a robust tag system with tags to choose from instead of just text input.
-   Add a search filter to filter by a bunch of things like ratings high to low, low to high, city, distance range, etc.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
