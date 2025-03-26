import { parseLandlordName } from "./helper";

export function createLandlordCard({ firstName, lastName, rating, tags }) {
    const card = document.createElement("div");
    card.className = "max-w-3xl mx-auto mb-4 p-4 border-2 border-black";
    card.innerHTML = `
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gray-400"></div>
            <div>
                <p class="text-base font-semibold">${firstName} ${lastName}</p>
                <div class="flex items-center text-sm text-gray-700">
                    <!-- Example star icon (Heroicons/Font Awesome/etc.) -->
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 text-yellow-500 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.617a1 1 0 00.95.69h3.801c.969 0 
                1.371 1.24.588 1.81l-3.073 2.23a1 1 0 00-.364 1.118l1.175 3.617c.3.921-.755 
                1.688-1.54 1.118l-3.073-2.23a1 1 0 00-1.176 0l-3.073 2.23c-.784.57-1.84-.197-1.54
                -1.118l1.175-3.617a1 1 0 00-.364-1.118l-3.073-2.23c-.783-.57-.38-1.81.588-1.81h3.8
                a1 1 0 00.951-.69l1.176-3.617z"
                        />
                    </svg>
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
