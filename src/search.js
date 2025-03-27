import { parseLandlordName } from "./helper";

export function createLandlordCard({ firstName, lastName, rating, tags }) {
    const card = document.createElement("div");
    card.className = "w-full not-last:mb-6 p-4 border-2 border-black";
    // This code makes me feel upset.
    // I turned the svg part of the html into an existing star icon.
    card.innerHTML = `
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gray-400"></div>
            <div>
                <p class="text-base font-semibold">${firstName} ${lastName}</p>
                <div class="flex items-center text-sm text-gray-700">
                    <img src="/assets/StarIconYellow.svg" class="h-4 mr-1" />
                    <span>${rating.overall}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom row: tag-like pills -->
    <!-- TODO: Add in dynamically -->
    <div class="flex flex-wrap gap-2 mt-4">
        <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"> No Contract </span>
        <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"> Pet Friendly </span>
        <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"> Nice </span>
        <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"> Test </span>
        <span class="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"> Test </span>
    </div>
</div>
    `;
    return card;
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
