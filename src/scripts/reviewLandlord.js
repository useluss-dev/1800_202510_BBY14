import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

const urlParameters = new URLSearchParams(window.location.search);

const dbLandlord = db.collection("landlords");
const landlordId = urlParameters.get("landlord");

const reviewSection = document.getElementById("landlordExists");
const nullSection = document.getElementById("landlordNull");

const dbReview = db.collection("reviews");

/** @type {HTMLFormElement} */
const form = document.forms.review;

/**
 * @typedef Star
 * @property {HTMLLabelElement} label
 * @property {HTMLImageElement} image
 * @property {HTMLInputElement} input
 */

/**
 * @typedef StarClear
 * @property {HTMLLabelElement} label
 * @property {HTMLInputElement} input
 * @property {HTMLSpanElement} span
 */

const defaultSrc = {
    starImageActive: "/assets/StarIconActive.svg",
    starImageNone: "/assets/StarIcon.svg",
};

/**
 * Creates the necessary elements for a clear button on star inputs.
 * @param {HTMLDivElement} fieldDiv
 * @returns {StarClear}
 */
function createStarClear(fieldDiv) {
    const label = fieldDiv.appendChild(document.createElement("label"));
    return {
        label,
        input: label.appendChild(document.createElement("input")),
        span: label.appendChild(document.createElement("span")),
    };
}

/**
 * Creates the necessary elements for a singular star input.
 * @param {HTMLDivElement} starDiv
 * @returns {Star}
 */
function createStarInput(starDiv) {
    const label = starDiv.appendChild(document.createElement("label"));
    return {
        label,
        image: label.appendChild(document.createElement("img")),
        input: label.appendChild(document.createElement("input")),
    };
}

/**
 * Sets up the clear button with necessary attributes. It also provides
 * a setupCallback for changes on styling of these elements.
 * @param {string} purpose
 * @param {HTMLDivElement} fieldDiv
 * @param {(starClear: StarClear) => void} setupCallback
 */
function setupStarClear(purpose, fieldDiv, setupCallback) {
    const clear = createStarClear(fieldDiv);
    const { label, input, span } = clear;

    label.id = purpose + "ClearLabel";

    input.type = "radio";
    input.checked = true;
    input.id = purpose + "Clear";
    input.name = purpose;
    input.value = 0;

    span.textContent = "Clear";

    setupCallback(clear);
}

/**
 * Sets up the star inputs with necessary attributes. It also provides
 * a setupCallback for changes on styling of these elements.
 * @param {string} purpose
 * @param {HTMLDivElement} starDiv
 * @param {(star: Star) => void} setupCallback
 */
function setupStarInputs(purpose, starDiv, setupCallback) {
    for (let i = 1; i <= 5; i++) {
        const star = createStarInput(starDiv);

        star.label.id = purpose + "Label" + i;
        star.image.id = purpose + "Image" + i;

        star.input.type = "radio";
        star.input.id = purpose + i;
        star.input.name = purpose;
        star.input.value = i;

        setupCallback(star);
    }
}

/**
 * Sets up the whole star input system.
 * @param {string} purpose
 * @param {boolean} optional If true, it sets up a clear button for
 *                           optional rating inputs.
 * @param {{ [key: string]: string | null }} styles
 */
function setupStarField(purpose, optional, styles = {}) {
    const defaultStyle = {
        fieldDiv: "flex justify-between items-center",
        starDiv: "flex",

        clearLabel:
            "px-2 py-1 border-2 hover:border-black hover:bg-black hover:text-white transition",
        clearInput: "hidden",
        clearSpan: "",

        starLabel: "not-last:pr-2",
        starImage: "h-10",
        starInput: "hidden",
    };

    /** @type {HTMLDivElement} */
    const fieldDiv = document.getElementById(purpose + "Field");

    const starDiv = fieldDiv.appendChild(document.createElement("div"));

    fieldDiv.className = styles.fieldset ? styles.fieldset : defaultStyle.fieldDiv;
    starDiv.className = styles.starDiv ? styles.starDiv : defaultStyle.starDiv;

    // Star Inputs
    setupStarInputs(purpose, starDiv, ({ label, image, input }) => {
        label.className = styles.starLabel ? styles.starLabel : defaultStyle.starLabel;

        image.src = defaultSrc.starImageNone;
        image.className = styles.starImage ? styles.starImage : defaultStyle.starImage;

        input.className = styles.starInput ? styles.starInput : defaultStyle.starInput;

        input.addEventListener("change", (event) => {
            modifyStarFieldVisuals(purpose, input.value);
        });
    });

    // Star Clear Input
    if (optional)
        setupStarClear(purpose, fieldDiv, ({ label, input, span }) => {
            label.className = styles.clearLabel ? styles.clearLabel : defaultStyle.clearLabel;
            input.className = styles.clearInput ? styles.clearInput : defaultStyle.clearInput;
            span.className = styles.clearSpan ? styles.clearSpan : defaultStyle.clearSpan;

            input.addEventListener("change", (event) => {
                modifyStarFieldVisuals(purpose, input.value);
            });
        });

    modifyStarFieldVisuals(purpose, 0);
}

/**
 * Modifies the styling/look of the star input and clear button elements, depending
 * on the set input value.
 * @param {string} purpose
 * @param {string | number} chosenValue
 */
function modifyStarFieldVisuals(purpose, chosenValue) {
    /** @type {NodeListOf<HTMLInputElement>} */
    const inputElements = document.getElementsByName(purpose);

    for (const inputElement of inputElements) {
        if (inputElement.value == 0) {
            // Clear button //

            /** @type {HTMLLabelElement} */
            const label = document.getElementById(purpose + "ClearLabel");

            if (inputElement.value == chosenValue) label.classList.add("opacity-0");
            else label.classList.remove("opacity-0");
        } else {
            // Star button //

            /** @type {HTMLImageElement} */
            const image = document.getElementById(purpose + "Image" + inputElement.value);

            image.src =
                inputElement.value <= chosenValue
                    ? defaultSrc.starImageActive
                    : defaultSrc.starImageNone;
        }
    }
}

function showReviewSection() {
    reviewSection.classList.remove("hidden");
    nullSection.classList.add("hidden");
}

function showNullSection() {
    reviewSection.classList.add("hidden");
    nullSection.classList.remove("hidden");
}

/**
 * @param {firebase.firestore.DocumentData} landlordData
 */
function displayLandlordData(landlordData) {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");

    firstName.textContent = landlordData.firstName;
    lastName.textContent = landlordData.lastName;
}

function setupReview() {
    if (landlordId) {
        dbLandlord
            .doc(landlordId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    displayLandlordData(doc.data());
                    showReviewSection();
                } else showNullSection();
            })
            .catch((error) => {
                showNullSection();
            });
        return;
    }

    showNullSection();
}

function isReviewFormValid() {
    const formData = new FormData(form);

    for (const entry of formData) {
        const [key, value] = entry;

        switch (key) {
            case "behavior":
            case "rules":
            case "quality":
            case "rent":
                if (value == 0) return false;
                break;

            case "content":
            case "title":
                if (value.length == 0) return false;
                break;
        }
    }

    return true;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    // for (const [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    // }
    if (!isReviewFormValid()) {
        document.getElementById("requiredError").classList.remove("opacity-0");
        return;
    }

    // Format review form data
    const reviewData = {
        behavior: formData.get("behavior"),
        rules: formData.get("rules"),
        quality: formData.get("quality"),
        rent: formData.get("rent"),
        title: formData.get("title"),
        content: formData.get("content"),
    };

    // Submit review
    dbReview.doc(landlordId).set(reviewData);

    window.location.href = `/landlord/${landlordId}`;
});

setupReview();

setupStarField("behavior", true);
setupStarField("rules", true);
setupStarField("quality", true);
setupStarField("rent", true);
