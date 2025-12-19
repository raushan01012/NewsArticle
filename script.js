const apiKey = "26702a1270354e7992178d38130e75a1";

const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

// Fetch top headlines (random news)
async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=30&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching random news:", error);
        return [];
    }
}

// Fetch news by search query
async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=30&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error("Error fetching news by query:", error);
        return [];
    }
}

// Display articles in the blog container
function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || "fallback.jpg"; // fallback image
        img.alt = article.title || "News image";

        const title = document.createElement("h2");
        const titleText = article.title || "No title";
        title.textContent = titleText.length > 30
            ? titleText.slice(0, 30) + "..."
            : titleText;

        const description = document.createElement("p");
        const desc = article.description || "No description available";
        description.textContent = desc.length > 120
            ? desc.slice(0, 120) + "..."
            : desc;

        blogCard.append(img, title, description);

        blogCard.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}

// Search button click event
searchButton.addEventListener("click", async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by query:", error);
        }
    }
});

// Immediately fetch random news on page load
(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error fetching random news:", error);
    }
})();
