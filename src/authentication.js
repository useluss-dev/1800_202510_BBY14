import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import { db, auth } from "./firebaseAPI_BBY14";

async function setAuthPersistence() {
    try {
        //Same account across all tabs, persists after browser restart
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (error) {
        console.error("Error setting login persistence:", error);
    }
}
setAuthPersistence();

const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await handleUserAuthentication(user);
    } catch (error) {
        if (error.code == "auth/user-not-found") {
            console.log("here");
            try {
                const userCredential = await firebase
                    .auth()
                    .createUserWithEmailAndPassword(email, password);
                await handleUserAuthentication(userCredential.user);
            } catch (error) {
                errorMessage.textContent = "Registration failed: " + error.message;
            }
        } else {
            errorMessage.textContent = "Login failed: " + error.message;
        }
    }
});

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(auth);

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write.
            //------------------------------------------------------------------------------------------
            var user = authResult.user; // get the user object from the Firebase authentication database
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById("loader").style.display = "none";
        },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "/profile",
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
};

async function handleUserAuthentication(user) {
    if (user) {
        try {
            const doc = await db.collection("users").doc(user.uid).get();
            if (!doc.exists) {
                await db.collection("users").doc(user.uid).set({
                    email: user.email,
                    reviews: [],
                });
            }
            window.location.assign("/profile");
        } catch (error) {
            console.error("Firestore error:", error);
        }
    }
}

auth.onAuthStateChanged(handleUserAuthentication);
