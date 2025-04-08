import firebase from "firebase";
import { app, db } from "./firebaseAPI_BBY14";

/**
 * @param {(user: firebase.User) => null} userExistsCallback
 * @param {() => null} userNullCallback
 * @param {(error: firebase.auth.Error) => null} authErrorCallback
 */
export function onLogInCheck(userExistsCallback, userNullCallback, authErrorCallback) {
    firebase.auth().onAuthStateChanged(
        (user) => {
            if (user) userExistsCallback(user);
            else userNullCallback();
        },
        (error) => {
            authErrorCallback(error);
        }
    );
}
