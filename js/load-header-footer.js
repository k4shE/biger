document.addEventListener("DOMContentLoaded", function() {
    loadHTML("header.html", "header", updateActiveNavButton);
    loadHTML("footer.html", "footer");
    loadPageContent(window.location.pathname);

    document.querySelectorAll("nav .nav-buttons a, div.logo a").forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const page = this.getAttribute("href");
            loadPageContent(page);
            history.pushState({ page }, "", page);
        });
    });

    window.addEventListener("popstate", function(event) {
        if (event.state && event.state.page) {
            loadPageContent(event.state.page);
        }
    });
});

function loadHTML(url, elementId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(error => console.error('Error loading HTML:', error));
}

function loadPageContent(page) {
    const contentElement = document.querySelector("main");

    fetch(page)
        .then(response => {
            if (!response.ok) throw new Error("Page not found");
            return response.text();
        })
        .then(html => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const newContent = tempDiv.querySelector("main").innerHTML;
            contentElement.innerHTML = newContent;

            const newTitle = tempDiv.querySelector("title");
            if (newTitle) {
                document.title = newTitle.innerText;
            }

            updateScripts(tempDiv);
            updateActiveNavButton();
        })
        .catch(error => console.error("Error loading page content:", error));
}

function updateScripts(tempDiv) {
    tempDiv.querySelectorAll("script").forEach(oldScript => {
        const newScript = document.createElement("script");
        newScript.src = oldScript.src;
        newScript.textContent = oldScript.textContent;
        newScript.async = oldScript.async;
        document.body.appendChild(newScript);
    });
}

function updateActiveNavButton() {
    const currentPath = window.location.pathname;
    document.querySelectorAll("nav .nav-buttons a").forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || currentPath.startsWith(linkPath)) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}