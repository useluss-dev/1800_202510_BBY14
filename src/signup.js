import firebase from "firebase/app";
import { auth, db } from "./firebaseAPI_BBY14.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const errorElement = document.getElementById("error-message");

    errorElement.textContent = "";

    if (password !== confirmPassword) {
        errorElement.textContent = "Passwords do not match.";
        return;
    }

    try {
        // Create Firebase Auth account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create Firestore user profile (no name stored)
        await db.collection("users").doc(user.uid).set({
            email: user.email,
            reviews: [],
        });

        // Redirect to profile
        window.location.assign("/profile");
    } catch (err) {
        errorElement.textContent = err.message;
    }
});
