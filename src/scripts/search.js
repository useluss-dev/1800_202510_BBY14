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
            //tags
            let tagHtml = "";
            for (let i = 0; i < tags.length; i++) {
                tagHtml += "<span class=\"px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full\"> ";
                tagHtml += tags[i];
                tagHtml += "  </span>";
            }
            container.querySelector("#tags").innerHTML = tagHtml;

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
