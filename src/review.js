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

function applyStarInputs(purpose) {
    const radioButtons = document.querySelectorAll(`input[name='${purpose}']`);
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", () => {
            const [purpose, index] = radio.id.split("-");

            for (let i = 1; i <= radioButtons.length; i++) {
                let label = document.querySelector(`label[for='${purpose}-${i}']`);
                label.childNodes[0].src = "/assets/StarIcon.svg";
            }

            for (let i = 1; i <= radio.value; i++) {
                let label = document.querySelector(`label[for='${purpose}-${i}']`);
                label.childNodes[0].src = "/assets/StarIconActive.svg";
            }
        });
    });
}

function setupStarInputs(purpose) {
    let sectionField = document.getElementById(purpose);
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
        starImg.src = "/assets/StarIcon.svg";
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

        document.getElementById("landlord-null").className = "hidden";
        document.getElementById("landlord-name").textContent = data.name;

        setupStarInputs("overall");
        setupStarInputs("behavior");
        setupStarInputs("rules");
        setupStarInputs("quality");
        setupStarInputs("rent");
        setupStarInputs("amenities");
    })
    .catch((error) => {
        document.getElementById("landlord-exists").className = "hidden";
    });
