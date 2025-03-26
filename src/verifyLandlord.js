import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

const dbLandlord = db.collection("landlords");
const urlParameters = new URLSearchParams(window.location.search);
const landlordData = getLandlordData(urlParameters);

const defaultStyle = {
    a: "text-teal-500 underline line-clamp-1",
};

/**
 * @param {URLSearchParams} urlParameters
 * @return {{ [key: string] : string | string[] }}
 */
function getLandlordData(urlParameters) {
    /** @type {{ [key: string] : string | string[] }} */
    const landlordData = {};

    for (const [key, value] of urlParameters) {
        if (key == "firstName" || key == "lastName" || key == "facebookLink") {
            landlordData[key] = value;
        } else if (key.startsWith("email")) {
            if (landlordData.email == undefined) landlordData.email = [];
            if (value.length != 0) landlordData.email.push(value);
        } else if (key.startsWith("phone")) {
            if (landlordData.phone == undefined) landlordData.phone = [];
            if (value.length != 0) landlordData.phone.push(value);
        }
    }

    return landlordData;
}

/**
 * @param {HTMLElement} element
 * @param {...string} links
 */
function addLinksToElement(element, ...links) {
    for (const link of links) {
        if (link.length == 0) continue;

        const hyperlink = element.appendChild(document.createElement("a"));
        hyperlink.href = hyperlink.textContent = link;
        hyperlink.className = defaultStyle.a;
    }
}

/**
 * @param {string} urlScheme
 * @param {HTMLElement} element
 * @param {...string} links
 */
function addSchemeLinksToElement(urlScheme, element, ...links) {
    for (const link of links) {
        if (link.length == 0) continue;

        const hyperlink = element.appendChild(document.createElement("a"));
        hyperlink.href = urlScheme + link;
        hyperlink.textContent = link;
        hyperlink.className = defaultStyle.a;
    }
}

/**
 * @param {{ [key: string] : string | string[] }} landlordData
 */
function displayLandlordData(landlordData) {
    const name = document.getElementById("landlordName");
    const facebookLink = document.getElementById("facebookLink");
    const email = document.getElementById("emailAddresses");
    const phone = document.getElementById("phoneNumbers");

    name.textContent = landlordData.firstName + " " + landlordData.lastName;
    addLinksToElement(facebookLink, landlordData.facebookLink);
    addSchemeLinksToElement("mailto:", email, ...landlordData.email);
    addSchemeLinksToElement("tel:+1", phone, ...landlordData.phone);

    [facebookLink, email, phone].forEach((element) => {
        if (element.childElementCount == 0) element.parentElement.remove();
    });
}

// Event Listeners //

document.getElementById("editLandlord").addEventListener("click", (event) => {
    window.location.replace("/add-landlord?" + urlParameters.toString());
});

document.getElementById("reviewLandlord").addEventListener("click", (event) => {
    dbLandlord.add(landlordData).then((value) => {});
});

displayLandlordData(landlordData);
console.log(landlordData);
