import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { db } from "./firebaseAPI_BBY14";
import { parseLandlordName, formatTimestamp } from "./helper";
import { loadComponent } from "./load";

export async function createReviewCard({ id, name, rating, title, content, date }) {
    return loadComponent(
        "/src/components/review-card.html",
        "flex-none w-full sm:max-w-3xl p-4 border-2 border-black",
        (container) => {
            container.dataset.reviewId = id;

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
            id,
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

export function createAvatar(name, container, divName) {
    let avatarPlaceholder;
    const initial = name.trim().charAt(0).toUpperCase();
    if (!divName) {
        avatarPlaceholder = container.querySelector("#avatar-placeholder");
    } else {
        avatarPlaceholder = document.querySelector("#" + divName);
        avatarPlaceholder.innerHTML = "";
        const newDiv = document.createElement("div");
        newDiv.className =
            "w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-[1em]";
        avatarPlaceholder.replaceWith(newDiv);
        newDiv.textContent = initial;
    }
    avatarPlaceholder.textContent = initial;
}

async function deleteReview(buttonElement) {
    const reviewCard = buttonElement.closest(".flex-none");
    const reviewId = reviewCard.dataset.reviewId;
    console.log(reviewId);

    if (!reviewId) {
        console.error("No review id found for deletion.");
        return;
    }

    if (!confirm("Are you sure you want to delete this review?")) {
        return;
    }

    try {
        const reviewDocRef = db.collection("reviews").doc(reviewId);
        const reviewDoc = await reviewDocRef.get();
        if (!reviewDoc.exists) {
            console.error("Review document doens't exist.");
            return;
        }
        const reviewData = reviewDoc.data();

        const landlordId = reviewData.landlordId;
        if (!landlordId) {
            console.error("No landlord id found in review document.");
            return;
        }
        await db
            .collection("landlords")
            .doc(landlordId)
            .update({
                reviews: firebase.firestore.FieldValue.arrayRemove(reviewId),
            });

        const currentUserId = firebase.auth().currentUser.uid;
        await db
            .collection("users")
            .doc(currentUserId)
            .update({
                reviews: firebase.firestore.FieldValue.arrayRemove(reviewId),
            });

        await reviewDocRef.delete();
        console.log("Review deleted successfully.");
    } catch (error) {
        console.error("Error deleting review: ", error);
        alert("Failed to delete review.");
    }

    db.collection("reviews")
        .doc(reviewId)
        .delete()
        .then(() => {
            console.log("Review deleted successfully");
            reviewCard.remove();
        })
        .catch((error) => {
            console.error("Error deleting review: ", error);
            alert("Failed to delete review.");
        });
}

window.deleteReview = deleteReview;
