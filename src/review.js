function applyStarInputs(purpose) {
    const radioButtons = document.querySelectorAll(`input[name='rating-${purpose}']`);
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", () => {
            const [purpose, index] = radio.id.split("-").slice(1);

            for (let i = 1; i <= radioButtons.length; i++) {
                let label = document.querySelector(`label[for='rating-${purpose}-${i}']`);
                label.childNodes[0].src = "/assets/StarIcon.svg";
            }

            for (let i = 1; i <= radio.value; i++) {
                let label = document.querySelector(`label[for='rating-${purpose}-${i}']`);
                label.childNodes[0].src = "/assets/StarIconActive.svg";
            }
        });
    });
}

function setupStarInputs(purpose) {
    let sectionField = document.getElementById(`rating-${purpose}`);
    let heading =
        purpose == "overall" ? document.createElement("h3") : document.createElement("h5");
    let starDiv = document.createElement("div");

    heading.className = "text-gray-500 uppercase mb-2";
    heading.textContent = purpose;
    starDiv.className = "w-full flex gap-2";

    for (let i = 1; i <= 5; i++) {
        let star = starDiv.appendChild(document.createElement("input"));
        let starLabel = starDiv.appendChild(document.createElement("label"));
        let starImg = starLabel.appendChild(document.createElement("img"));

        star.type = "radio";
        star.id = `rating-${purpose}-${i}`;
        star.name = `rating-${purpose}`;
        star.value = i;
        star.className = "hidden";
        starImg.src = "/assets/StarIcon.svg";
        starImg.className = (purpose == "overall" ? "h-12" : "h-8") + " object-contain";
        starLabel.htmlFor = star.id;
    }

    sectionField.appendChild(heading);
    sectionField.appendChild(starDiv);

    applyStarInputs(purpose);
}

setupStarInputs("overall");
setupStarInputs("behavior");
setupStarInputs("rules");
setupStarInputs("rent");
setupStarInputs("amenities");
