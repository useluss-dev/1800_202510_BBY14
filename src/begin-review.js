import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

function addField(purpose, placeholder, required = true) {
    let fieldContainer = document.getElementById(purpose + "-fields");
    let index = fieldContainer.childElementCount + 1;

    let field = document.createElement("div");
    let fieldInput = field.appendChild(document.createElement("input"));
    let fieldDelButton = field.appendChild(document.createElement("button"));
    let fieldDelButtonText = fieldDelButton.appendChild(document.createElement("p"));

    field.className = "flex";

    fieldInput.type = "text";
    fieldInput.name = fieldInput.id = `${purpose}-${index}`;
    fieldInput.placeholder = placeholder + (required ? "*" : "");
    fieldInput.className = "w-full p-2 focus:outline-0";
    fieldInput.required = required;

    fieldDelButton.type = "button";
    fieldDelButton.name = fieldDelButton.id = `${purpose}-${index}-del`;
    fieldDelButton.className = "p-2 aspect-square border-l-2 border-dashed border-gray-500";
    fieldDelButton.addEventListener("click", () => {
        field.remove();
        modifyFieldStyle(purpose);
    });

    fieldDelButtonText.className = "text-gray-500";
    fieldDelButtonText.innerText = "-";

    fieldContainer.appendChild(field);
}

function modifyFieldStyle(purpose) {
    let fieldContainer = document.getElementById(purpose + "-fields");
    let fieldAddButton = document.getElementById(purpose + "-add");

    if (fieldContainer.childElementCount == 0) {
        fieldContainer.classList.remove("border-2");
        fieldAddButton.classList.add("border-t-2");
    } else {
        fieldContainer.classList.add("border-2");
        fieldAddButton.classList.remove("border-t-2");
    }
}

function findFields(purpose, regex) {
    let i = 1;
    let fieldInputs = [];

    if (typeof regex == "string") {
        regex = new RegExp(regex);
    }

    while (true) {
        /** @type {HTMLInputElement} */
        let fieldInput = document.getElementById(`${purpose}-${i}`);

        if (fieldInput == null) {
            break;
        }

        if (!regex.test(fieldInput.value)) {
            break;
        }

        fieldInputs.push(fieldInput);
        i++;
    }

    return fieldInputs;
}

// If the user goes back from verify-landlord.html to
// double check their landlord's information.
function applyValuesFromQuery() {
    for (const [key, value] of new URLSearchParams(document.location.search)) {
        if (["fname", "lname", "facebook-link"].includes(key)) {
            document.getElementById(key).value = value;
        } else {
            // my favorite JS syntax sugar
            const [purpose, index] = key.split("-");

            switch (purpose) {
                case "email":
                    addField(purpose, "Email address");
                    break;
                case "phone":
                    addField(purpose, "Phone number");
                    break;
                case "social":
                    addField(purpose, "Link");
                    break;
            }

            document.getElementById(`${purpose}-${index}`).value = value;
            modifyFieldStyle(purpose);
        }
    }
}

/*
    These functions below exist for cases where we need to
    add event listeners for other input events, especially
    involving mobile devices.
*/
/**
 *
 * @param {string} purpose
 * @param {string} placeholder
 * @param {boolean} required
 */
function setFieldEventListeners(purpose, placeholder, required = true) {
    const addButton = document.getElementById(`${purpose}-add`);
    const addButtonFunc = () => {
        addField(purpose, placeholder, required);
        modifyFieldStyle(purpose);
    };
    addButton.addEventListener("click", addButtonFunc);
}

// This one adds the remove buttons for each field.
/**
 * @param {HTMLButtonElement} fieldDelButton
 * @param {string} purpose
 */
function setRemoveFieldListener(purpose, index) {
    const delButton = document.getElementById(`${purpose}-${index}-del`);
    const delButtonFunc = () => {
        field.remove();
        modifyFieldStyle(purpose);
    };
    delButton.addEventListener("click", delButtonFunc);
}

setFieldEventListeners("email", "Email address");
setFieldEventListeners("phone", "Phone number");
setFieldEventListeners("social", "Link");

applyValuesFromQuery();

/*
    Warning for everyone:

    Do NOT use names for name and id attributes that already exist as
    an instance method or variable for a given element.

    The code below wasn't working previously because another element
    (the submit button) had an id that was the same in name as
    the submit() method for the form element.
*/

/** @type {HTMLFormElement} */
const beginForm = document.forms.begin;

beginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let fname = document.getElementById("fname");
    let lname = document.getElementById("lname");
    let facebookLink = document.getElementById("facebook-link");
    let emailAddresses = findFields("email", /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/);
    let phoneNumbers = findFields("phone", /^\d+$/);
    let socialLinks = findFields(
        "social",
        /^(https?:\/\/)?(www\.)?[\w\-]+(\.[\w\-]+)+([\/\w\-?.=&#]*)?$/
    );

    if (facebookLink.value == "") {
        if (emailAddresses.length == 0) {
            /*
                Sam (or anyone else) - put this shit in the HTML.
                Use Tailwind's 'hidden' class to hide the error
                in first input.
            */
            alert(
                "Email address is not provided once, or is invalid.\n" +
                    "Please try again, or provide a facebook link."
            );
        } else {
            beginForm.submit();
        }
    } else {
        beginForm.submit();
    }
});
