import { app, db } from "./firebaseAPI_BBY14";
import { onLogInCheck } from "./userLoggedIn";

/** @type {HTMLFormElement} */
const addLandlordForm = document.forms.addLandlord;

const urlParameters = new URLSearchParams(window.location.search);

const defaultStyle = {
    fieldsExtensible: "border-2 divide-y-2",
    fieldsExtensibleHasEmpty: "",
    field: "w-full p-2 focus:outline-0",
    fieldDiv: "flex",
    fieldAdd: "w-full p-2 border-b-2 border-x-2 border-dashed border-gray-500",
    fieldAddHasEmpty: "w-full p-2 border-2 border-dashed border-gray-500",
    fieldRemove: "px-4 border-l-2 border-dashed border-gray-500",
    identifierExists: "text-grey-500 text-sm",
    noIdentifierExists: "text-red-500 text-lg",
};

const placeholders = {
    firstName: "First name",
    lastName: "Last name",
    facebookLink: "Copy & paste link",
    email: "Email address",
    phone: "Phone number",
};

/**
 * @param {string} purpose
 */
function addField(purpose, value = null) {
    const fieldsExtensible = document.getElementById(purpose + "FieldsExtensible");
    const newFieldIndex = fieldsExtensible.childElementCount;

    const fieldDiv = document.createElement("div");
    const field = fieldDiv.appendChild(document.createElement("input"));
    const fieldRemove = fieldDiv.appendChild(document.createElement("button"));

    fieldDiv.className = defaultStyle.fieldDiv;

    field.type = "text";
    field.name = purpose + "Field" + newFieldIndex;
    field.placeholder = placeholders[purpose];
    field.className = defaultStyle.field;
    if (value != null) field.value = value;

    fieldRemove.type = "button";
    fieldRemove.id = purpose + "FieldRemove" + newFieldIndex;
    fieldRemove.className = defaultStyle.fieldRemove;
    fieldRemove.textContent = "-";

    fieldsExtensible.appendChild(fieldDiv);
    setFieldRemoveEventListener(purpose, newFieldIndex);
}

/**
 * @param {string} purpose
 * @param {string} value
 */
function appendFieldWithExistingValue(purpose, value) {
    const fieldsExtensible = document.getElementById(purpose + "FieldsExtensible");
    const fieldInputs = fieldsExtensible.children;

    let valueAddedIn = false;

    for (let i = 0; i < fieldInputs.length && !valueAddedIn; i++) {
        if (fieldInputs[i].value == "") {
            fieldInputs[i].value = value;
            valueAddedIn = true;
        }
    }

    if (!valueAddedIn) {
        addField(purpose, value);
    }
}

/**
 * @param {HTMLButtonElement} fieldRemoveElement
 */
function removeField(fieldRemoveElement) {
    fieldRemoveElement.parentElement.remove();
}

function modifyFieldStyle(purpose) {
    const fieldsExtensible = document.getElementById(purpose + "FieldsExtensible");
    const fieldAdd = document.getElementById(purpose + "Add");

    if (fieldsExtensible.childElementCount > 0) {
        fieldsExtensible.className = defaultStyle.fieldsExtensible;
        fieldAdd.className = defaultStyle.fieldAdd;
    } else {
        fieldsExtensible.className = defaultStyle.fieldsExtensibleHasEmpty;
        fieldAdd.className = defaultStyle.fieldAddHasEmpty;
    }
}

/**
 * @param  {...string} invalid
 */
function modifyErrorVisibility(...invalid) {
    const invalidName = document.getElementById("invalidName").classList;
    const invalidFacebook = document.getElementById("invalidFacebook").classList;
    const invalidEmail = document.getElementById("invalidEmail").classList;

    [invalidName, invalidFacebook, invalidEmail].forEach((tokenList) => {
        tokenList.add("hidden");
    });

    invalid.forEach((key) => {
        if (key == "firstName" || key == "lastName") invalidName.remove("hidden");
        else if (key == "facebookLink") invalidFacebook.remove("hidden");
        else if (key.startsWith("email")) invalidEmail.remove("hidden");
    });
}

/**
 * @param {boolean} identifierExists
 */
function modifyNoIdentifierErrorVisibility(identifierExists) {
    const errorElement = document.getElementById("noIdentifierError");

    if (identifierExists) {
        errorElement.classList.add(...defaultStyle.identifierExists.split(" "));
        errorElement.classList.remove(...defaultStyle.noIdentifierExists.split(" "));
    } else {
        errorElement.classList.add(...defaultStyle.noIdentifierExists.split(" "));
        errorElement.classList.remove(...defaultStyle.identifierExists.split(" "));
    }
}

function applyFieldsFromQuery() {
    for (const [key, value] of urlParameters) {
        if (key == "firstName" || key == "lastName" || key == "facebookLink" || key == "email") {
            addLandlordForm.elements[key].value = value;
        }
    }
}

function setFieldRemoveEventListener(purpose, index) {
    const fieldRemove = document.getElementById(purpose + "FieldRemove" + index);
    const fieldRemoveFunction = () => {
        removeField(fieldRemove);
        modifyFieldStyle(purpose);
    };
    fieldRemove.addEventListener("click", fieldRemoveFunction);
}

function setFieldAddEventListener(purpose, placeholder) {
    const fieldAdd = document.getElementById(purpose + "Add");
    const fieldAddFunction = () => {
        addField(purpose, placeholder);
        modifyFieldStyle(purpose);
    };
    fieldAdd.addEventListener("click", fieldAddFunction);
}

// Event Listeners

onLogInCheck(
    (user) => {
        applyFieldsFromQuery();

        addLandlordForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const landlordData = new FormData(addLandlordForm);
            const invalidKeys = [];

            let identifierExists = false;

            for (const [key, value] of landlordData) {
                let valid = true;
                let allowEmpty = true;

                if (key == "firstName" || key == "lastName") {
                    valid = value.match(/^[a-zA-Z-]+$/);
                    allowEmpty = false;
                } else if (key == "facebookLink") {
                    valid = value.match(
                        /^(https?:\/\/)?(www\.)?facebook\.com\/marketplace\/profile\/\d+\/?$/
                    );
                    if (!identifierExists) identifierExists = value.length > 0;
                } else if (key == "email") {
                    valid = value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
                    if (!identifierExists) identifierExists = value.length > 0;
                }

                if (!valid && !allowEmpty) {
                    invalidKeys.push(key);
                } else if (!valid && allowEmpty && value.length > 0) {
                    invalidKeys.push(key);
                }
            }

            modifyErrorVisibility(...invalidKeys);
            modifyNoIdentifierErrorVisibility(identifierExists);

            if (invalidKeys.length == 0 && identifierExists) {
                addLandlordForm.submit();
            }
        });
    },
    () => {
        window.location.href = "/login";
    }
);
