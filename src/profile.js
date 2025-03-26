import { db } from "./firebaseAPI_BBY14";
import { parseLandlordName, formatTimestamp } from "./helper";

export function createReviewCard({ name, rating, title, content, date }) {
    const card = document.createElement("div");
    card.className = "flex-none w-full sm:max-w-3xl p-4 border-2 border-black";
    card.innerHTML = `
    <div class="flex-col pb-4">
        <h2 class="text-base font-semibold">${name}</h2>
        <div class="flex items-center pb-1 text-sm text-gray-700">
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
            <span>${rating}</span>
    </div>
    <!-- Content divider -->
    <hr class="border-t-2 border-black" />
    <div class="flex-col pt-4">
        <h2>${title}</h2>
        <p class="text-lg pt-4 pb-4">${content}</p>
        <h4>${date}</h4>
    </div>
    `;
    return card;
}

export async function getReviewData(id) {
    try {
        // Get the review document
        const reviewDoc = await db.collection("reviews").doc(id).get();
        if (!reviewDoc.exists) {
            throw new Error("Review does not exist");
        }
        const review = reviewDoc.data();

        // Get the landlord document based on review.landlordId
        const landlordDoc = await db.collection("landlords").doc(review.landlordId).get();
        const landlordName = landlordDoc.exists ? parseLandlordName(landlordDoc.data()) : "Unknown";

        // Get the date
        const formattedDate = formatTimestamp(review.createdAt);

        return {
            name: landlordName,
            rating: review.ratings.overall,
            title: review.title,
            content: review.content,
            date: formattedDate,
        };
    } catch (error) {
        console.error("Failed fetching review data: ", error);
        throw error;
    }
}
