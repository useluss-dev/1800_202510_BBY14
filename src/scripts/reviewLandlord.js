import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

// const defaultStyle = {
//     starClearInput: "hidden",
//     starClearLabel: "px-2 py-1 border-2 transition-all",
//     starClearLabelHover: " hover:bg-black hover:text-white hover:border-black",
//     starClearLabelInvisible: "px-2 py-1 border-2 transition-all opacity-0",
//     starClearText: "select-none",
//     starDiv: "flex",
//     starField: "flex justify-between items-center",
//     starImage: "h-10",
//     starLabel: "not-last:pr-2",
// };

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
 * @param {string} purpose
 * @param {boolean} optional
 * @param {{ [key: string]: string | null }} styles
 */
function setupStarField(purpose, optional, styles = {}) {
    const defaultStyle = {
        fieldDiv: "flex justify-between items-center",
        starDiv: "flex",

        clearLabel: "px-2 py-1 border-2",
        clearInput: "",
        clearSpan: "",

        starLabel: "",
        starImage: "",
        starInput: "",
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
            label.className = styles.clearLabel ? styles.clearLabel : defaultSrc.clearLabel;
            input.className = styles.clearInput ? styles.clearInput : defaultSrc.clearInput;
            span.className = styles.clearSpan ? styles.clearSpan : defaultSrc.clearSpan;

            input.addEventListener("change", (event) => {
                modifyStarFieldVisuals(purpose, input.value);
            });
        });
}

/**
 * @param {string} purpose
 * @param {string | number} chosenValue
 */
function modifyStarFieldVisuals(purpose, chosenValue) {
    /** @type {NodeListOf<HTMLInputElement>} */
    const inputElements = document.getElementsByName(purpose);

    for (const inputElement of inputElements) {
        if (inputElement.value == 0) {
            /** @type {HTMLLabelElement} */
            const label = document.getElementById(purpose + "ClearLabel");

            if (inputElement.value == chosenValue) label.classList.add("opacity-0");
            else label.classList.remove("opacity-0");
        } else {
            /** @type {HTMLImageElement} */
            const image = document.getElementById(purpose + "Image" + inputElement.value);

            image.src =
                inputElement.value <= chosenValue
                    ? defaultSrc.starImageActive
                    : defaultSrc.starImageNone;
        }
    }
}

setupStarField("behavior", true);
