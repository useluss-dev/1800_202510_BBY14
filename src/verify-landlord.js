import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

function showQuery() {
    const contacts = document.getElementById("contacts");
    for (const [key, value] of new URLSearchParams(document.location.search)) {
        const textElement = document.createElement("p");
        textElement.className = "text-lg";

        if (key == "fname" || key == "lname") {
            document.getElementById(key).textContent = value;
        } else if (key == "facebook-link") {
            const facebookLink = document.getElementById(key);

            if (value == "") facebookLink.textContent = "No Facebook link provided.";
            else {
                facebookLink.textContent = "Facebook Link: ";

                const hyperlink = facebookLink.appendChild(document.createElement("a"));
                hyperlink.className = "underline text-blue-500";
                hyperlink.href = value;
                hyperlink.textContent = value;
            }
        } else {
            const [purpose, index] = key.split("-");
            const textElement = document.createElement("p");
            textElement.className = "text-lg";

            if (purpose == "email") textElement.textContent = `Email #${index}: `;
            else if (purpose == "phone") textElement.textContent = `Phone #${index}: `;
            else if (purpose == "social") textElement.textContent = `Link #${index}: `;

            const hyperlink = textElement.appendChild(document.createElement("a"));
            hyperlink.className = "underline text-blue-500";

            if (purpose == "email" || purpose == "social") hyperlink.href += "mailto:" + value;
            else if (purpose == "phone") hyperlink.href += "tel:+1" + value;
            hyperlink.textContent = value;

            contacts.appendChild(textElement);
        }
    }
}

showQuery();

document.getElementById("edit-landlord").addEventListener("click", (event) => {
    const landlordParams = new URLSearchParams(window.location.search);
    window.location.replace(`/begin-review?${landlordParams.toString()}`);
});

document.getElementById("review-landlord").addEventListener("click", (event) => {
    const landlordCollection = db.collection("landlords");

    let landlordDocData = {
        name: "",
        "facebook-link": "",
        email: [],
        phone: [],
        social: [],
        properties: [],
        rating: 1,
        reviews: [],
        tags: [],
    };

    new URLSearchParams(window.location.search).forEach((value, key) => {
        if (key == "fname") {
            landlordDocData.name = value + landlordDocData.name;
        } else if (key == "lname") {
            landlordDocData.name += " " + value;
        } else if (key == "facebook-link") {
            landlordDocData[key] = value;
        } else {
            const purpose = key.split("-")[0];
            console.log(purpose);
            landlordDocData[purpose].push(value);
        }
    });

    landlordCollection.add(landlordDocData).then((value) => {
        window.location.replace(`/review?landlord-id=${value.id}`);
    });
});
