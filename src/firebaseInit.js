
import firebase from "firebase/app";
import { auth } from "./firebaseAPI_BBY14.js";

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
auth.onAuthStateChanged((user) => {
    console.log("firebaseInit");
    console.log("user ", user);
    if (user) {
        console.log("user logged in:", user.email);
    }
});

const user = auth.currentUser;
console.log("user;", user)