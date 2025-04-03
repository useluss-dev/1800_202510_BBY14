import { db } from "./firebaseAPI_BBY14";

const urlParameters = new URLSearchParams(window.location.search);

const dbLandlord = db.collection("landlords");
const landlordId = urlParameters.get("landlord");
const dbReview = db.collection("dbReview");

console.log("dbLandlord ", dbLandlord);
console.log("landlordId ", landlordId);
console.log("dbReview ", dbReview);

