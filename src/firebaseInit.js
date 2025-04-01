
import firebase from "firebase/app";
import { auth } from "./firebaseAPI_BBY14.js";
import { createAvatar } from "./profile";

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.onAuthStateChanged((user) => {
    console.log("firebaseInit");
    console.log("user ", user);
    //profileIcon

    if (user) {
        console.log("user logged in:", user.email);
        createAvatar(user.email, null, "profileIcon");

    }
});

const user = auth.currentUser;
console.log("user;", user)