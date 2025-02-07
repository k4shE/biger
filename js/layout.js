document.addEventListener("DOMContentLoaded", function () {
    let page = sessionStorage.getItem("currentPage") || "index.html";
    loadPage(page);

    document.querySelectorAll("nav .nav-buttons a, div.logo a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("href");
            loadPage(page);
            history.pushState({ page }, "", page);
            sessionStorage.setItem("currentPage", page);
        });
    });

    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page);
        }
    });
});

function loadPage(page) {
    const contentElement = document.getElementById("content");

    fetch(page)
        .then(response => {
            if (!response.ok) throw new Error("Хуудас олдсонгүй");
            return response.text();
        })
        .then(html => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const newTitle = tempDiv.querySelector("title");
            if (newTitle) {
                document.title = newTitle.innerText;
            }

            updateScripts(tempDiv);

            contentElement.innerHTML = tempDiv.innerHTML;
        })
        .catch(error => console.error("Хуудас ачаалахад алдаа гарлаа:", error));
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
