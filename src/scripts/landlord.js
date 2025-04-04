import { db } from "./firebaseAPI_BBY14";
import { loadComponent } from "./load";
import { parseLandlordName, formatTimestamp } from "./helper";
const urlParameters = new URLSearchParams(window.location.search);

const dbLandlord = db.collection("landlords");
const pathParts = window.location.pathname.split("/");
const landlordId = pathParts[2];

const dbReview = db.collection("dbReview");

console.log("dbLandlord ", dbLandlord);
console.log("landlordId ", landlordId);
console.log("dbReview ", dbReview);


export async function createReviewCardLandlord({ landlordName, landlordId, ratings, title, content, createdAt }) {
    console.log("===========================");
    console.log(landlordId)
    console.log(ratings)
    console.log(title)
    console.log(content)
    console.log(createdAt)
    console.log(landlordName)
    console.log("===========================");
    return loadComponent(
        "/src/components/review-card.html",
        "flex-none w-full sm:max-w-3xl p-4 border-2 border-black",
        (container) => {
            // container.dataset.reviewId = id;
            const deleteButton = container.querySelector(".deleteBtn");
            if (deleteButton) {
                deleteButton.style.display = "none";
            }
            container.querySelector("#name").textContent = landlordName;
            container.querySelector("#rating").textContent = ratings.overall;
            container.querySelector("#title").textContent = title;
            container.querySelector("#content").textContent = content;
            container.querySelector("#date").textContent = formatTimestamp(createdAt);
        }
    );
}


// window.location.replace("/review?landlord=" + dbLandlord);