import page from "page";
import {
    loadContent,
    loadStaticComponent,
    executeScripts,
    loadLandlordCards,
    loadProfileReviewCards,
} from "./load.js";
import { db, auth } from "./firebaseAPI_BBY14.js";
import { createAvatar } from "./profile.js";
import { createReviewCardLandlord } from "./landlord.js";

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
page("/edit-landlord*", () => loadContent("/src/partials/editLandlord.html", executeScripts));
page("/verify-landlord*", () => loadContent("/src/partials/verifyLandlord.html", executeScripts));
// page("/update-landlord*", () => loadContent("/src/partials/updateLandlord.html", executeScripts));
page("/update-landlord*", async (ctx) => {
    const urlParameters = new URLSearchParams(window.location.search);
    const landlordId = urlParameters.get('landlordId');

    try {
        await db.collection("landlords").doc(landlordId).update({
            firstName: urlParameters.get('firstName'),
            lastName: urlParameters.get('lastName'),
            facebookLink: urlParameters.get('facebookLink'),
            email: urlParameters.get('email'),
        });

    } catch (error) {
        console.error("Error editing landlord: ", error);
        alert("Failed to edit landlord.");
    }

    window.location.href = `/landlord/${landlordId}`;
});
page("/landlord/:id", (ctx) => {
    loadContent("/src/partials/landlord.html", async (container) => {
        executeScripts(container);
        const landlordId = ctx.params.id;
        // Now fetch the Firestore document using the ID
        try {
            const doc = await db.collection("landlords").doc(landlordId).get();
            if (doc.exists) {
                const data = doc.data();
                // Hide the "not found" section and show the dynamic section
                container.querySelector("#landlordNull").classList.add("hidden");
                container.querySelector("#landlordExists").classList.remove("hidden");

                if (data.email) {
                    const emailContainer = container.querySelector("#email");
                    emailContainer.classList.remove("hidden");
                    emailContainer.textContent = data.email;
                }
                if (data.marketplaceId) {
                    const marketplaceLinkContainer = container.querySelector("#marketplaceLink");
                    marketplaceLinkContainer.classList.remove("hidden");
                    marketplaceLinkContainer.textContent =
                        "facebook.com/marketplace/profile/" + data.marketplaceId;
                }

                // Set the Review Landlord hyperlink to /review?landlord={Landlord's ID}
                container.querySelector("#reviewButton").href = "/review?landlord=" + doc.id;

                // Update your HTML elements with dynamic data
                container.querySelector("#firstName").textContent = data.firstName || "N/A";
                container.querySelector("#lastName").textContent = data.lastName || "N/A";
                container.querySelector("#ratingOverall").textContent =
                    data.ratings.overall || "0.0";
                container.querySelector("#ratingBehavior").textContent =
                    data.ratings.behavior || "0.0";
                container.querySelector("#ratingRules").textContent = data.ratings.rules || "0.0";
                container.querySelector("#ratingQuality").textContent =
                    data.ratings.quality || "0.0";
                container.querySelector("#ratingRent").textContent = data.ratings.rent || "0.0";

                //reviews
                const reviewSnapshot = await db
                    .collection("reviews")
                    .where("landlordId", "==", landlordId)
                    .get();
                if (reviewSnapshot.empty) {
                    // reviewContainer.innerHTML = "<p>No reviews yet.</p>";
                } else {
                    const reviewsSection = document.getElementById("reviews");
                    reviewSnapshot.forEach((reviewDoc) => {
                        const review = reviewDoc.data();
                        review.landlordName = (data.firstName || "N/A") + " " + (data.lastName || "N/A");
                        createReviewCardLandlord(review).then((reviewElement) => {
                            container.appendChild(reviewElement);
                        });
                        const div = document.createElement("div");
                        div.className = "review-card";
                        div.innerHTML = `
                            <h4>${review.title || "No title"}</h4>
                            <p>${review.content || "No content"}</p>
                            <p><strong>Behavior:</strong> ${review.ratings.behavior ?? "N/A"}</p>
                            <p><strong>Listing Quality:</strong> ${review.ratings.listingQuality ?? "N/A"
                            }</p>
                            <p><strong>Listing Rent:</strong> ${review.ratings.listingRent ?? "N/A"
                            }</p>
                            <p><strong>Rules:</strong> ${review.ratings.rules ?? "N/A"}</p>
                            <p><strong>Overall:</strong> ${review.ratings.overall ?? "N/A"}</p>
                        `;

                        // reviewContainer.appendChild(div);
                        // reviewsSection.appendChild(div);
                    });
                }
            } else {
                // If the document does not exist, show a not found message
                container.querySelector("#landlordNull").classList.remove("hidden");
                container.querySelector("#landlordExists").classList.add("hidden");
            }
        } catch (error) {
            console.error("Error fetching landlord data:", error);
        }
    });
});
page("/profile", () =>
    loadContent("/src/partials/profile.html", async (container) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const email = user.email;
                container.querySelector("#profile-name").textContent = email;
                loadProfileReviewCards(user);
                createAvatar(email, container);
            } else {
                loadContent("/src/partials/login.html", executeScripts);
            }
        });
    })
);

// Start the router
page();
