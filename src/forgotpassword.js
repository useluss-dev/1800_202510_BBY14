import { auth } from "./firebaseAPI_BBY14.js";

export function initForgotPassword() {
    const form = document.getElementById("forgot-password-form");
    if (!form) {
        console.error("Forgot password form not found!");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message");

        message.textContent = "";
        message.className = "mt-4 text-sm text-center";

        try {
            await auth.sendPasswordResetEmail(email);

            message.textContent = "A password reset email has been sent!";
            message.classList.add("text-green-600");
        } catch (error) {
            message.textContent = error.message;
            message.classList.add("text-red-600");
        }
    });
}
