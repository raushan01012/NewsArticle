const apiKey = "26702a1270354e7992178d38130e75a1";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const PAGE_SIZE = 30;

// Utility function to fetch via AllOrigins proxy to bypass CORS
async function fetchViaProxy(url) {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

// Fetch top headlines
async function fetchRandomNews() {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${PAGE_SIZE}&apiKey=${apiKey}`;
    return await fetchViaProxy(apiUrl);
}

// Fetch news by search query
async function fetchNewsQuery(query) {
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${PAGE_SIZE}&apiKey=${apiKey}`;
    return await fetchViaProxy(apiUrl);
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
        img.src = article.urlToImage || "fallback.jpg";
        img.alt = article.title || "News image";

        const title = document.createElement("h2");
        const truncatedTitle = article.title?.length > 30 ? article.title.slice(0,30) + "..." : article.title || "No title";
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = article.description?.length > 120 ? article.description.slice(0,120) + "..." : article.description || "No description available";
        description.textContent = truncatedDes;

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
