const apiKey = "d6edf437d6109733efb41f7d59b4b0e0";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Fetch default headlines
async function fetchRandomNews() {
    try {
        const apiUrl = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=20&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

// Fetch searched news
async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=20&apikey=${apiKey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching news by query", error);
        return [];
    }
}

// Display news
function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    articles.forEach(article => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.image || "fallback.jpg";
        img.alt = article.title || "News image";

        const title = document.createElement("h2");
        title.textContent =
            article.title?.length > 30
                ? article.title.slice(0, 30) + "..."
                : article.title || "No title";

        const description = document.createElement("p");
        description.textContent =
            article.description?.length > 120
                ? article.description.slice(0, 120) + "..."
                : article.description || "No description available";

        blogCard.append(img, title, description);

        blogCard.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}

// Search button
searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (!query) return;

    const articles = await fetchNewsQuery(query);
    displayBlogs(articles);
});

// Load default news on page load
(async () => {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
})();
