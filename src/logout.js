import { db, auth } from "./firebaseAPI_BBY14.js";

window.logout = function () {
    auth.signOut().then(() => {
        window.location.href = "/";
    });
};
