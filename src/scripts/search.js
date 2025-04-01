import { parseLandlordName } from "./helper";
import { loadComponent } from "./load";
import { createAvatar } from "./profile";

export function createLandlordCard({ firstName, lastName, rating, tags }) {
    return loadComponent(
        "/src/components/landlord-card.html",
        "w-full not-last:mb-6 p-4 border-2 border-black",
        (container) => {
            container.querySelector("#name").textContent = firstName + " " + lastName;
            container.querySelector("#rating").textContent = rating.overall;
            createAvatar(firstName, container);
        }
    );
}

export function sortLandlords(landlords) {
    // Sort array based on rating (in descending order)
    landlords.sort((a, b) => parseFloat(b.rating.overall) - parseFloat(a.rating.overall));
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
