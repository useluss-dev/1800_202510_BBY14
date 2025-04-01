import { db } from "./firebaseAPI_BBY14";
import { parseLandlordName, formatTimestamp } from "./helper";
import { loadComponent } from "./load";

export async function createReviewCard({ name, rating, title, content, date }) {
    return loadComponent(
        "/src/components/review-card.html",
        "flex-none w-full sm:max-w-3xl p-4 border-2 border-black",
        (container) => {
            container.querySelector("#name").textContent = name;
            container.querySelector("#rating").textContent = rating;
            container.querySelector("#title").textContent = title;
            container.querySelector("#content").textContent = content;
            container.querySelector("#date").textContent = date;
        }
    );
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

export function createAvatar(name, container) {
    const avatarPlaceholder = container.querySelector("#avatar-placeholder");
    const initial = name.trim().charAt(0).toUpperCase();

    avatarPlaceholder.textContent = initial;
    avatarPlaceholder.style.color = "white";
    avatarPlaceholder.style.display = "flex";
    avatarPlaceholder.style.alignItems = "center";
    avatarPlaceholder.style.justifyContent = "center";
}
