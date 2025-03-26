import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import { db, auth } from "./firebaseAPI_BBY14.js";

//auth.signOut(); //temporaray
async function setAuthPersistence() {
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    console.log("Login persistence set to 'LOCAL'"); //Same account across all tabs, persists after browser restart
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
    errorMessage.textContent = "Login failed: " + error.message;
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
      if (authResult.additionalUserInfo.isNewUser) {
        //if new user
        console.log("new user");
      } else {
        console.log("old user");
      }
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
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};




async function handleUserAuthentication(user) {
  if (user) {
    console.log("User authenticated uid:", user.uid, "email: ", user.email);

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (!doc.exists) {
        console.log("Firestore does not contain user data. Adding new record...");
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          reviews: [],
        });
        console.log("Firestore test write successful");
      } else {
        console.log("User data already exists in Firestore.");
      }
      window.location.assign("/profile");
    } catch (error) {
      console.error("Firestore error:", error);
    }
  } else {
    console.log("No user is signed in.");
    //ui.start("#firebaseui-auth-container", uiConfig);
  }
}

auth.onAuthStateChanged(handleUserAuthentication);
