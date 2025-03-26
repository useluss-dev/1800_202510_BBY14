import page from "page";
import {
    loadContent,
    loadComponent,
    executeScripts,
    loadLandlordCards,
    loadProfileReviewCards,
} from "./load.js";
import { auth } from "./firebaseAPI_BBY14.js";

// Define routes
page("/", () =>
    loadContent("/src/partials/home.html", () => {
        loadComponent("/src/components/search-bar.html", "#logo");
    })
);

page("/login", () => loadContent("/src/partials/login.html", executeScripts));

page("/search", () =>
    loadContent("/src/partials/search.html", () => {
        loadComponent("/src/components/search-bar.html", "#search-bar");
        loadLandlordCards();
    })
);

page("/review*", () => loadContent("/src/partials/review.html", executeScripts));
page("/begin-review*", () => loadContent("/src/partials/begin-review.html", executeScripts));
page("/verify-landlord*", () => loadContent("/src/partials/verify-landlord.html", executeScripts));
page("/profile", () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            loadContent("/src/partials/profile.html", async (container) => {
                const name = user.email;
                container.querySelector("#profile-name").textContent = name;

                // Create Profile image
                const avatarPlaceholder = document.getElementById("avatarPlaceholder");
                const initial = name.trim().charAt(0).toUpperCase();
                avatarPlaceholder.textContent = initial;

                loadProfileReviewCards(user);
            });
        } else {
            loadContent("/src/partials/login.html", executeScripts);
        }
    });
});


// Start the router
page();
