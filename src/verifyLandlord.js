import { app, db } from "./firebaseAPI_BBY14";

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
        if (key == "firstName" || key == "lastName" || key == "facebookLink" || key == "email") {
            landlordData[key] = value;
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

    name.textContent = landlordData.firstName + " " + landlordData.lastName;
    console.log(landlordData.email);
    addLinksToElement(facebookLink, landlordData.facebookLink);
    addSchemeLinksToElement("mailto:", email, landlordData.email);

    [facebookLink, email].forEach((element) => {
        if (element.childElementCount == 0) element.parentElement.remove();
    });
}

/**
 * @param {string} facebookLink
 * @return {{marketplace: string, profile: string}}
 */
function getMarketplaceId(marketplaceLink) {
    const marketplaceURL = marketplaceLink ? new URL(marketplaceLink) : null;
    if (marketplaceURL == null) {
        return "";
    }

    const parts = marketplaceURL.pathname.split("/");
    const marketplaceId = parts[3];
    return marketplaceId;
}

// Variables //

const dbLandlord = db.collection("landlords");
const urlParameters = new URLSearchParams(window.location.search);
const landlordData = getLandlordData(urlParameters);

// Event Listeners //

document.getElementById("editLandlord").addEventListener("click", (event) => {
    window.location.replace("/add-landlord?" + urlParameters.toString());
});

document.getElementById("reviewLandlord").addEventListener("click", (event) => {
    db.collection("landlords")
        .add({
            firstName: landlordData.firstName,
            lastName: landlordData.lastName,
            email: landlordData.email,
            marketplaceId: getMarketplaceId(landlordData.facebookLink),
            ratings: {
                behavior: 0,
                listingAmenities: 0,
                listingQuality: 0,
                listingRent: 0,
                overall: 0,
                rules: 0,
            },
            reviews: [],
            tags: [],
        })
        .then((value) => {
            window.location.replace("/review?landlord=" + value.id);
        });
});

displayLandlordData(landlordData);
