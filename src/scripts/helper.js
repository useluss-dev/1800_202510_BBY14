export function parseLandlordName(landlord) {
    const firstName = landlord.firstName;
    const lastName = landlord.lastName;
    return firstName.concat(" ", lastName);
}

export function formatTimestamp(timestamp) {
    const date = timestamp.toDate();
    const dateOptions = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", dateOptions);
}
