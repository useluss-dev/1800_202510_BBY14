import firebase from "firebase/app";
import { auth } from "./firebaseAPI_BBY14.js";
import { createAvatar } from "./profile";

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.onAuthStateChanged((user) => {
    if (user) {
        createAvatar(user.email, null, "profileIcon1"); //top
        createAvatar(user.email, null, "profileIcon2"); //bottom
    }
});

const user = auth.currentUser;
