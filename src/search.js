export function createLandlordCard({ properties, name, rating, tags }) {
    const card = document.createElement("div");
    card.className = "max-w-3xl mx-auto mb-4 p-4 border-2 border-black";
    // This code makes me feel upset.
    // I turned the svg part of the html into an existing star icon.
    card.innerHTML = `
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-full bg-gray-400"></div>
            <div>
                <p class="text-base font-semibold">${name}</p>
                <div class="flex align-middle gap-1 text-sm text-gray-700">
                    <!-- Example star icon (Heroicons/Font Awesome/etc.) -->
                    <img src="/assets/StarIconActive.svg" class="h-4" />
                    <span>${rating}</span>
                </div>
            </div>
        </div>
        <div class="text-center">
            <p class="text-xl font-semibold">${properties.length}</p>
            <p class="text-xs text-gray-500 tracking-wide">LISTINGS</p>
        </div>
    </div>

    <!-- Bottom row: tag-like pills -->
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
        landlords = landlords.filter((landlord) => landlord.name.toLowerCase().includes(query));
    }
    return landlords;
}
