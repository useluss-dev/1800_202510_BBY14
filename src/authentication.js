import { getAuth, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import { app } from "./firebaseAPI_BBY14.js";

console.log("test");

// Get the Auth instance from the initialized app
const auth = getAuth(app);

// Initialize the FirebaseUI Widget using Firebase v9 modular syntax
const ui = new firebaseui.auth.AuthUI(auth);
console.log(ui);

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return true to redirect to signInSuccessUrl.
            return true;
        },
        uiShown: function () {
            // The widget is rendered; hide the loader.
            document.getElementById("loader").style.display = "none";
        },
    },
    // Use popup for sign-in flow.
    signInFlow: "popup",
    // URL to redirect to after a successful sign-in.
    signInSuccessUrl: "/",
    // Sign-in options; here we use the email/password provider.
    signInOptions: [EmailAuthProvider.PROVIDER_ID],
    // Terms of service URL.
    tosUrl: "<your-tos-url>",
    // Privacy policy URL.
    privacyPolicyUrl: "<your-privacy-policy-url>",
};

ui.start("#firebaseui-auth-container", uiConfig);
