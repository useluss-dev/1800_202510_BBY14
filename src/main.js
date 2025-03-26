import page from "page";
import { loadContent, loadComponent, executeScripts, loadLandlordCards } from "./load.js";
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
page("/add-landlord*", () => loadContent("/src/partials/addLandlord.html", executeScripts));
page("/verify-landlord*", () => loadContent("/src/partials/verify-landlord.html", executeScripts));
page("/landlord*", () => loadContent("/src/partials/landlord.html", executeScripts));
page("/profile", () =>
    loadContent("/src/partials/profile.html", async (container) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const name = user.email;
                container.querySelector("#profile-name").textContent = name;
            }
        });
    })
);

// Start the router
page();
