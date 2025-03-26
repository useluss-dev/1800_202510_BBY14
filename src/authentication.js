import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import { db, auth } from "./firebaseAPI_BBY14.js";

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
      // window.location.assign("/profile");
    } catch (error) {
      console.error("Firestore error:", error);
    }
  } else {
    console.log("No user is signed in.");
    //ui.start("#firebaseui-auth-container", uiConfig);
  }
}

auth.onAuthStateChanged(handleUserAuthentication);
