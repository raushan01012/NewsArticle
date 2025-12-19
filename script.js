const apiKey = "d6edf437d6109733efb41f7d59b4b0e0";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const PAGE_SIZE = 10;   // Free plan max per request
const TOTAL_ARTICLES = 50;  // Total articles we want

// Utility function to fetch multiple pages to reach 50 articles
async function fetchArticles(urlBase) {
    let articles = [];
    const totalPages = Math.ceil(TOTAL_ARTICLES / PAGE_SIZE);

    for (let page = 1; page <= totalPages; page++) {
        const apiUrl = `${urlBase}&max=${PAGE_SIZE}&page=${page}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.articles) {
                articles = articles.concat(data.articles);
            }
        } catch (error) {
            console.error(`Error fetching page ${page}`, error);
        }
    }
    return articles;
}

// Fetch default top headlines
async function fetchRandomNews() {
    const urlBase = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&apikey=${apiKey}`;
    return await fetchArticles(urlBase);
}

// Fetch news by search query
async function fetchNewsQuery(query) {
    const urlBase = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&apikey=${apiKey}`;
    return await fetchArticles(urlBase);
}

// Display news articles
function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    if (articles.length === 0) {
        blogContainer.innerHTML = "<p>No news found.</p>";
        return;
    }

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

// Search button functionality
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
