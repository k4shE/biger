// SWIPER CONFIGURATION
new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
    }
});

// LOGIN POPUP FUNCTIONALITY
document.getElementById("log-button").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "flex";
});

document.querySelector(".close").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none";
});

// GOOGLE LOGIN
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    const data = parseJwt(response.credential);

    // Display Google user's name
    const firstName = data.given_name || "Хэрэглэгч";
    const userNameDisplay = document.getElementById("user-name-display");
    if (userNameDisplay) {
        userNameDisplay.textContent = firstName;
    }

    // Close login popup
    const popup = document.querySelector(".popup");
    if (popup) popup.style.display = "none";

    console.log("Google User Info:", data);
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "1054327131273-t84cqtirtf9ttknb5nfejmj2htngskfk.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        { theme: "outline", size: "large", text: "continue_with" }
    );

    google.accounts.id.prompt();
};

// FORM VALIDATION
document.getElementById("login-button").addEventListener("click", function (event) {
    const surnameInput = document.querySelector(".logtext[placeholder='Овог']");
    const nameInput = document.querySelector(".logtext[placeholder='Нэр']");
    const emailInput = document.querySelector(".logtext[placeholder='И-мэйл']");
    const passwordInput = document.querySelector(".logtext[placeholder='Нууц үг']");
    const birthDateInput = document.getElementById("birth-date");
    const popup = document.querySelector(".popup");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!surnameInput.value.trim() || !nameInput.value.trim() || 
        !emailInput.value.trim() || !passwordInput.value.trim() || !birthDateInput.value) {
        alert("Бүх талбарыг бөглөнө үү.");
        event.preventDefault();
        return;
    }

    if (!emailRegex.test(emailInput.value.trim())) {
        alert("И-мэйл хаяг буруу байна.");
        event.preventDefault();
        return;
    }

    if (!passwordRegex.test(passwordInput.value.trim())) {
        alert("Нууц үг дор хаяж 8 тэмдэгттэй, нэг том үсэг, нэг тоо агуулах шаардлагатай.");
        event.preventDefault();
        return;
    }

    const birthDate = new Date(birthDateInput.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed = (today.getMonth() > birthDate.getMonth()) || 
                             (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (age < 21 || (age === 21 && !isBirthdayPassed)) {
        alert("Та 21 нас хүрсэн байх шаардлагатай.");
        event.preventDefault();
        return;
    }

    if (popup) {
        popup.style.display = "none";
    }

    const userNameDisplay = document.getElementById("user-name-display");
    if (userNameDisplay) {
        userNameDisplay.textContent = surnameInput.value.trim();
    }
});

// Decode JWT Token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

// FETCH PRODUCTS FROM BACKEND
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product");
            productItem.innerHTML = `
                <h3>${product.product_name}</h3>
                <p>Stock: ${product.total_prod}</p>
            `;
            productList.appendChild(productItem);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
});
