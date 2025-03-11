import page from "page";

// Helper function to load HTML partials
function loadContent(filePath, callback) {
    fetch(filePath)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((html) => {
            const mainContainer = document.querySelector("main");
            // Inject the HTML into your main container
            mainContainer.innerHTML = html;
            // Execute the callback (e.g., to run any scripts) if provided
            if (callback && typeof callback === "function") {
                callback(mainContainer);
            }
        })
        .catch((err) => {
            console.error("Error loading content:", err);
            document.querySelector("main").innerHTML = "<p>Error loading content.</p>";
        });
}

function executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.type) {
            newScript.type = oldScript.type;
        }

        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }

        document.body.appendChild(newScript);
    });
}

// Define your routes
page("/", () => loadContent("/src/partials/home.html"));
page("/login", () => loadContent("/src/partials/login.html", executeScripts));
page("/search", () => loadContent("/src/partials/search.html"));
page("/review", () => loadContent("/src/partials/review.html"));
page("/begin-review", () => loadContent("/src/partials/begin-review.html"));

// Start the router
page();
