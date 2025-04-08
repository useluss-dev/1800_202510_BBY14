import { db } from "./firebaseAPI_BBY14";
import { loadComponent } from "./load";
import { parseLandlordName, formatTimestamp } from "./helper";
const urlParameters = new URLSearchParams(window.location.search);

const dbLandlord = db.collection("landlords");
const pathParts = window.location.pathname.split("/");
const landlordId = pathParts[2];

const dbReview = db.collection("dbReview");


async function goToEditPage() {
    try {
        const landlordDocRef = db.collection("landlords").doc(landlordId);
        const landlordDocSnap = await landlordDocRef.get();

        if (landlordDocSnap.exists) {
            const landlordData = landlordDocSnap.data();

            const urlParameters = new URLSearchParams({
                firstName: landlordData.firstName || "",
                lastName: landlordData.lastName || "",
                email: landlordData.email || "",
                facebookLink: landlordData.facebookLink || "",
                landlordId: landlordId
            });

            window.location.replace("/edit-landlord?" + urlParameters.toString());
        } else {
            console.log("No landlord found");
        }
    } catch (error) {
        console.error("Error fetching landlord info:", error);
    }
}
window.goToEditPage = goToEditPage;

async function goToWritePage() {
    try {
        const landlordDocRef = db.collection("landlords").doc(landlordId);
        const landlordDocSnap = await landlordDocRef.get();

        if (landlordDocSnap.exists) {
            window.location.replace("/review?landlord=" + landlordDocSnap.id);
        } else {
            console.log("No landlord found");
        }
    } catch (error) {
        console.error("Error fetching landlord info:", error);
    }
}

window.goToWritePage = goToWritePage;

export async function createReviewCardLandlord({ landlordName, landlordId, ratings, title, content, createdAt }) {
    return loadComponent(
        "/src/components/review-card.html",
        "w-[700px] p-4 border-2 border-black mx-auto mb-6",
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