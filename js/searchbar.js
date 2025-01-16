export function search() {
    const query = document.getElementById("searchInput").value.trim();
    console.log("Search query:", query); // Debugging line
    if (query) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        console.log("Search URL:", searchUrl); // Debugging line
        chrome.tabs.create({ url: searchUrl }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                console.log("Tab created");
            }
        });
    }
}
