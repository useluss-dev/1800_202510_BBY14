import page from "page";
import { loadContent, loadComponent, executeScripts } from "./load.js";

// Define routes
page("/", () => loadContent("/src/partials/home.html"));
page("/login", () => loadContent("/src/partials/login.html", executeScripts));
page("/search", () =>
    loadContent("/src/partials/search.html", (container) => {
        loadComponent("/src/components/card.html", "#card-container");
    })
);
page("/review", () => loadContent("/src/partials/review.html"));
page("/begin-review*", () => loadContent("/src/partials/begin-review.html", executeScripts));
page("/verify-landlord*", () => loadContent("/src/partials/verify-landlord.html", executeScripts));

// Start the router
page();
