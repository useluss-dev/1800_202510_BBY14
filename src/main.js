import page from "page";
import {
    loadContent,
    loadStaticComponent,
    executeScripts,
    loadLandlordCards,
    loadProfileReviewCards,
} from "./load.js";
import { auth } from "./firebaseAPI_BBY14.js";

// Define routes
page("/", () =>
    loadContent("/src/partials/home.html", () => {
        loadStaticComponent("/src/components/search-bar.html", "#searchBar");
    })
);
page("/login", () => loadContent("/src/partials/login.html", executeScripts));
page("/search", () =>
    loadContent("/src/partials/search.html", () => {
        loadStaticComponent("/src/components/search-bar.html", "#searchBar");
        loadLandlordCards();
    })
);
page("/review*", () => loadContent("/src/partials/reviewLandlord.html", executeScripts));
page("/add-landlord*", () => loadContent("/src/partials/addLandlord.html", executeScripts));
page("/verify-landlord*", () => loadContent("/src/partials/verifyLandlord.html", executeScripts));
page("/landlord*", () => loadContent("/src/partials/landlord.html", executeScripts));
page("/profile", () =>
    loadContent("/src/partials/profile.html", async (container) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const name = user.email;
                container.querySelector("#profile-name").textContent = name;
                loadProfileReviewCards(user);

                //Create Profile image
                const avatarPlaceholder = document.getElementById("avatarPlaceholder");
                const initial = name.trim().charAt(0).toUpperCase();

                avatarPlaceholder.textContent = initial;
                avatarPlaceholder.style.color = "white";
                avatarPlaceholder.style.display = "flex";
                avatarPlaceholder.style.alignItems = "center";
                avatarPlaceholder.style.justifyContent = "center";
                avatarPlaceholder.style.fontSize = "10em";
            }
        });
    })
);

// Start the router
page();
