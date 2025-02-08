document.addEventListener("DOMContentLoaded", function() {
    loadHTML("header.html", "header", updateActiveNavButton);
    loadHTML("footer.html", "footer");

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
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navButtons = document.querySelector('.nav-buttons');

    hamburger.addEventListener('click', function() {
        navButtons.classList.toggle('active');
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