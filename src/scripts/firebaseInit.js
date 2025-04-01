
import firebase from "firebase/app";
import { auth } from "./firebaseAPI_BBY14.js";
import { createAvatar } from "./profile";

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.onAuthStateChanged((user) => {
    console.log("firebaseInit");
    console.log("user ", user);

    if (user) {
        // const images = document.querySelectorAll(".profileIcon");

        // images.forEach((img) => {
        //     img.style.display = "none";
        // });
        console.log("user logged in:", user.email);
        createAvatar(user.email, null, "profileIcon1"); //top
        createAvatar(user.email, null, "profileIcon2"); //bottom
        document.getElementById("navLogout").style.display = "block";

    }
    else {
        document.getElementById("navLogout").style.display = "none";
    }
});

const user = auth.currentUser;
console.log("user;", user)