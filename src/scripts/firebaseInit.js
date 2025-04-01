import firebase from "firebase/app";
import { auth } from "./firebaseAPI_BBY14.js";
import { createAvatar } from "./profile";

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.onAuthStateChanged((user) => {
    // console.log("user ", user);
    if (user) {
        createAvatar(user.email, null, "profileIcon1"); //top
        createAvatar(user.email, null, "profileIcon2"); //bottom
        document.getElementById("navLogout").style.display = "block";
    } else {
        document.getElementById("navLogout").style.display = "none";
    }
});

const user = auth.currentUser;
