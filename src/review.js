import { app, db } from "./firebaseAPI_BBY14.js";
import { doc, addDoc, setDoc, collection } from "firebase/firestore";

async function addLandlordListing() {
    const landlordsCol = collection(db, "landlords");
    const propertiesCol = collection(db, "properties");

    // Landlord
    let firstName = document.getElementById("method2-fname").value;
    let lastName = document.getElementById("method2-lname").value;
    /** @type {string[]} */
    let emailAddresses = [document.getElementById("method2-email-1").value];
    /** @type {string[]} */
    let socialLinks = [document.getElementById("method2-social-1").value];

    // Listing
    let postalCode = document.getElementById("method2-postal").value;
    let city = document.getElementById("method2-city").value;
    let province = document.getElementById("method2-province").value;
    let address = document.getElementById("method2-address").value;
    let bedroomCount = document.getElementById("method2-bedrooms").value;
    let bathroomCount = document.getElementById("method2-bathrooms").value;

    console.log("it does work?");
    console.log(
        firstName,
        lastName,
        emailAddresses,
        socialLinks,
        postalCode,
        city,
        address,
        bedroomCount,
        bathroomCount
    );

    let landlordDoc = addDoc(landlordsCol, {
        firstName: firstName,
        lastName: lastName,
        emailAddresses: emailAddresses,
        socialLinks: socialLinks,
    }).then((value) => {
        addDoc(propertiesCol, {
            landlordId: value.id,
            postalCode: postalCode,
            city: city,
            province: province,
            address: address,
            bedroomCount: bedroomCount,
            bathroomCount: bathroomCount,
        });
    });

    landlordDoc.then();
}

console.log("the script exists!");
document.getElementById("method2-submit").addEventListener("click", addLandlordListing);
