import page from "page";
import { loadContent, loadComponent, executeScripts, loadLandlordCards } from "./load.js";

// Define routes
page("/", () => loadContent("/src/partials/home.html"));
page("/login", () => loadContent("/src/partials/login.html", executeScripts));
page("/search", () =>
    loadContent("/src/partials/search.html", (container) => {
        loadLandlordCards();
    })
);
page("/review", () => loadContent("/src/partials/review.html"));
page("/begin-review", () => loadContent("/src/partials/begin-review.html"));

// Start the router
page();
