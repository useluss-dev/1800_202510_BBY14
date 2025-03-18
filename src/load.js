import { createCard, searchCards, sortCards } from "./card";

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
                container.innerHTML = html;
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

export function loadCards() {
    fetch("/src/test.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("failed to get json");
            }
            return response.json();
        })
        .then((cards) => {
            const filteredCards = searchCards(cards);
            sortCards(filteredCards);

            const container = document.querySelector("#card-container");
            if (filteredCards.length > 0) {
                container.innerHTML = ""; // Clears the landlord not found message
            }
            filteredCards.forEach((card) => {
                const cardElement = createCard(card);
                container.appendChild(cardElement);
            });
        })
        .catch((error) => {
            console.error("Error fetching json file: ", error);
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
