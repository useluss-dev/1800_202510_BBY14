import { createLandlordCard, searchLandlords, sortLandlords } from "./search";
import { db } from "./firebaseAPI_BBY14";
import { getReviewData, createReviewCard } from "./profile";

// Helper function to load HTML partials
export async function loadContent(partialPath, callback) {
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

// Helper function to load static HTML components
export function loadStaticComponent(componentPath, containerSelector, callback) {
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

// Helper function to load dynamic HTML components
export async function loadComponent(componentPath, containerClass, updateCallback) {
    const response = await fetch(componentPath);
    const component = await response.text();

    const container = document.createElement("div");
    container.className = containerClass;
    container.innerHTML = component;

    // Invoke the callback to inject dynamic data
    updateCallback(container);

    return container;
}

export async function loadLandlordCards() {
    try {
        const response = await db.collection("landlords").get();
        const landlords = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const filtered = searchLandlords(landlords);
        sortLandlords(filtered);

        const container = document.querySelector("#card-container");
        container.innerHTML = filtered.length > 0 ? "" : "No landlords found.";

        Promise.all(filtered.map((landlord) => createLandlordCard(landlord))).then(
            (landlordCards) => {
                landlordCards.forEach((card) => container.appendChild(card));
            }
        );
    } catch (error) {
        console.error("Error fetching data from firestore: ", error);
    }
}

export async function loadProfileReviewCards(user) {
    try {
        const response = await db.collection("users").doc(user.uid).get();
        if (!response.exists) return;

        // Get the reviews from the response data
        const { reviews } = response.data();
        const container = document.querySelector("#card-container");

        // Map all of the reviews at the same time and wait for them to all be done
        await Promise.all(
            reviews.map(async (id) => {
                try {
                    const reviewInfo = await getReviewData(id);
                    createReviewCard(reviewInfo).then((reviewElement) => {
                        container.appendChild(reviewElement);
                    });
                } catch (error) {
                    console.error("Error creating review card: ", error);
                }
            })
        );
    } catch (error) {
        console.error("Error fetching the user document: ", error);
    }
}
