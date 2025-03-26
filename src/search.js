import { parseLandlordName } from "./helper";

export function createLandlordCard({ firstName, lastName, rating, tags }) {
    return fetch("/src/components/landlord-card.html")
        .then((response) => response.text())
        .then((component) => {
            const container = document.createElement("div");
            container.className = "max-w-3xl mx-auto mb-4 p-4 border-2 border-black";
            container.innerHTML = component;

            // Update component with dynamic data
            container.querySelector("#name").textContent = firstName + " " + lastName;
            container.querySelector("#rating").textContent = rating.overall;

            return container;
        });
}

export function sortLandlords(landlords) {
    // Sort array based on rating (in descending order)
    landlords.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
}

export function searchLandlords(landlords) {
    // Retrieve the search query from the URL (e.g., /search?query=John)
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query") ? params.get("query").toLowerCase() : "";

    if (query) {
        // Filter out names that don't include the query
        landlords = landlords.filter((landlord) =>
            parseLandlordName(landlord).toLowerCase().includes(query)
        );
    }
    return landlords;
}
