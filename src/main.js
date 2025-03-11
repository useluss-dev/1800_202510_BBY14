import page from "page";

// Helper function to load HTML partials
function loadContent(filePath) {
    fetch(filePath)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then((html) => {
            // Inject the HTML into your main container
            document.querySelector("main").innerHTML = html;
        })
        .catch((err) => {
            console.error("Error loading content:", err);
            document.querySelector("main").innerHTML = "<p>Error loading content.</p>";
        });
}

// Define your routes
page("/", () => loadContent("/src/partials/home.html"));
page("/login", () => loadContent("/src/partials/login.html"));
page("/search", () => loadContent("/src/partials/search.html"));
page("/review", () => loadContent("/src/partials/review.html"));
page("/begin-review", () => loadContent("/src/partials/begin-review.html"));

// Start the router
page();
