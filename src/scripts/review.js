import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

function getStarInputValue(purpose) {
    const radioButtons = document.querySelectorAll(`input[name='${purpose}]`);
}

function submitReview() {
    //
}

function getLandlordDocSnapshot() {
    const landlordID = new URLSearchParams(window.location.search).get("landlord-id");
    const landlordCollection = db.collection("landlords");

    return landlordCollection.doc(landlordID).get();
}

/**
 * @param {number} purpose
 * @param {number} index
 * @param {boolean} active
 */
function modifyStarInputStyle(purpose, index, active = false) {
    const label = document.querySelector(`label[for=${purpose}-${index}]`);
    label.childNodes[0].src = active ? "/assets/StarIconActive.svg" : "/assets/StarIcon.svg";
}

function applyStarInputs(purpose) {
    /** @type {NodeListOf<HTMLInputElement>} */
    const radioButtons = document.querySelectorAll(`input[name='${purpose}']`);
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", () => {
            for (let i = 1; i <= radioButtons.length; i++) {
                modifyStarInputStyle(purpose, i, i <= radio.value);
            }
        });
    });
}

function setupStarInputs(purpose) {
    let sectionField = document.getElementById("star__" + purpose);
    let heading =
        purpose == "overall" ? document.createElement("h3") : document.createElement("h5");
    let starDiv = document.createElement("div");

    heading.className = "text-gray-500 uppercase mb-1";
    heading.textContent = purpose;

    heading.textContent += " ";
    let span = heading.appendChild(document.createElement("span"));
    span.className = "text-red-500";
    span.textContent = "*";

    starDiv.className = "w-full flex gap-2";

    for (let i = 1; i <= 5; i++) {
        let star = starDiv.appendChild(document.createElement("input"));
        let starLabel = starDiv.appendChild(document.createElement("label"));
        let starImg = starLabel.appendChild(document.createElement("img"));

        star.type = "radio";
        star.id = `${purpose}-${i}`;
        star.name = `${purpose}`;
        star.value = i;
        star.className = "hidden";
        star.checked = i == 1;

        starImg.src = star.checked ? "/assets/StarIconActive.svg" : "/assets/StarIcon.svg";
        starImg.className = (purpose == "overall" ? "h-12" : "h-8") + " object-contain";
        starLabel.htmlFor = star.id;
    }

    sectionField.appendChild(heading);
    sectionField.appendChild(starDiv);

    applyStarInputs(purpose);
}

getLandlordDocSnapshot()
    .then((docSnapshot) => {
        const data = docSnapshot.data();

        /** @type {HTMLFormElement} */
        const form = document.forms["review"];

        const starPurposes = ["overall", "behavior", "rules", "quality", "rent", "amenities"];

        document.getElementById("landlord-null").classList.add("hidden");
        document.getElementById("landlord-name").textContent = data.name;

        for (const starPurpose of starPurposes) {
            setupStarInputs(starPurpose);
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const reviewCollection = db.collection("reviews");
            const reviewFormData = new FormData(form);
            const urlParameters = new URLSearchParams(window.location.search);
            // Normally, this is also where the user's id should be placed.

            let reviewData = {
                landlordId: urlParameters.get("landlord-id"),
            };

            reviewFormData.forEach((value, key) => {
                reviewData[key] = value;
            });

            reviewCollection.add(reviewData).then((value) => {
                window.location.replace(`/submitted?review-id=${value.id}`);
            });
        });
    })
    .catch((error) => {
        console.error(error);
        document.getElementById("landlord-null").classList.remove("hidden");
        document.getElementById("landlord-exists").classList.add("hidden");
    });
