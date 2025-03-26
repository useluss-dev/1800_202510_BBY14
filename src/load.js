import { createLandlordCard, searchLandlords, sortLandlords } from "./search";
import { db } from "./firebaseAPI_BBY14";
import { getReviewData, createReviewCard } from "./profile";

// Helper function to load HTML partials
export function loadContent(partialPath, callback) {
    fetch(partialPath)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((html) => {
            // Find main container in index.html
            const mainContainer = document.querySelector("main");
            // Inject the HTML into your main container
            mainContainer.innerHTML = html;
            // Execute the callback (e.g., to run any scripts) if provided
            if (callback && typeof callback === "function") {
                callback(mainContainer);
            }
        })
        .catch((err) => {
            console.error("Error loading content:", err);
            document.querySelector("main").innerHTML = "<p>Error loading content.</p>";
        });
}

// Helper function to load HTML components
export function loadComponent(componentPath, containerSelector, callback) {
    fetch(componentPath)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((html) => {
            const container = document.querySelector(containerSelector);
            if (container) {
                container.insertAdjacentHTML("beforeend", html);
                if (callback && typeof callback === "function") {
                    callback(container);
                }
            } else {
                console.error("Container not found:", containerSelector);
            }
        })
        .catch((err) => {
            console.error("Error loading component:", err);
        });
}

export async function loadLandlordCards() {
    try {
        const response = await db.collection("landlords").get();
        const landlords = response.docs.map((doc) => doc.data());
        console.log("landlords original: ", landlords);

        const filtered = searchLandlords(landlords);
        sortLandlords(filtered);
        console.log("filtered: ", filtered);

        const container = document.querySelector("#card-container");
        container.innerHTML = filtered.length > 0 ? "" : "No landlords found.";

        filtered.forEach((landlord) => container.appendChild(createLandlordCard(landlord)));
    } catch (error) {
        console.error("Error fetching data from firestore: ", error);
    }
}

export function loadProfileReviewCards(user) {
    db.collection("users")
        .doc(user.uid)
        .get()
        .then((userDoc) => {
            if (userDoc.exists) {
                const userData = userDoc.data();
                // getReviewData(userData.reviews);
                const container = document.querySelector("#card-container");
                userData.reviews.forEach((id) => {
                    getReviewData(id)
                        .then((reviewInfo) => {
                            const reviewCard = createReviewCard(reviewInfo);
                            container.appendChild(reviewCard);
                        })
                        .catch((error) => {
                            console.error("Error creating review card:", error);
                        });
                });
            }
        })
        .catch((error) => {
            console.error("Error getting the user document:", error);
        });
}

// Callback for `loadContent` and `loadComponent`
// Execute scripts in the content or component
export function executeScripts(container) {
    // Get all the scripts from given container (injected file).
    const scripts = container.querySelectorAll("script");

    scripts.forEach((oldScript) => {
        const newScript = document.createElement("script"); // Create a new script
        if (oldScript.type) {
            // Give the new script the same type
            newScript.type = oldScript.type;
        }

        if (oldScript.src) {
            // Give the new script the same src
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent; // Give the new script the same text content
        }

        document.body.appendChild(newScript); // Append script to the index.html
    });
}
