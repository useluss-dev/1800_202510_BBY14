import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

/** @type {HTMLFormElement} */
const addLandlordForm = document.forms.addLandlord;

const defaultStyle = {
    fieldsExtensible: "border-2 divide-y-2",
    fieldsExtensibleHasEmpty: "",
    field: "w-full p-2 focus:outline-0",
    fieldDiv: "flex",
    fieldAdd: "w-full p-2 border-b-2 border-x-2 border-dashed border-gray-500",
    fieldAddHasEmpty: "w-full p-2 border-2 border-dashed border-gray-500",
    fieldRemove: "px-4 border-l-2 border-dashed border-gray-500",
};

function addField(purpose, placeholder) {
    const fieldsExtensible = document.getElementById(purpose + "FieldsExtensible");
    const newFieldIndex = fieldsExtensible.childElementCount;

    const fieldDiv = document.createElement("div");
    const field = fieldDiv.appendChild(document.createElement("input"));
    const fieldRemove = fieldDiv.appendChild(document.createElement("button"));

    fieldDiv.className = defaultStyle.fieldDiv;

    field.type = "text";
    field.name = purpose + "Field" + newFieldIndex;
    field.placeholder = placeholder;
    field.className = defaultStyle.field;

    fieldRemove.type = "button";
    fieldRemove.id = purpose + "FieldRemove" + newFieldIndex;
    fieldRemove.className = defaultStyle.fieldRemove;
    fieldRemove.textContent = "-";

    fieldsExtensible.appendChild(fieldDiv);
    setFieldRemoveEventListener(purpose, newFieldIndex);
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

setFieldAddEventListener("email", "Email address");
modifyFieldStyle("email");
setFieldAddEventListener("phone", "Phone number");
modifyFieldStyle("phone");
setFieldAddEventListener("social", "Link");
modifyFieldStyle("social");

addLandlordForm.addEventListener("submit", (event) => {
    event.preventDefault();
});
