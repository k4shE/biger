new Swiper('.card-wrapper', {
    
    loop: true,
    spacebetween: 30,
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
        }
  });

  document.getElementById("log-button").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "flex";
  });

  document.querySelector(".close").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none";
  });

/*  function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // Use the response.credential (JWT token) to authenticate on your backend.
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "1054327131273-t84cqtirtf9ttknb5nfejmj2htngskfk.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    
    google.accounts.id.renderButton(
        document.getElementById("g_id_signin"),
        {
            theme: "outline", // Options: 'outline' or 'filled_blue'
            size: "large",    // Options: 'small', 'medium', or 'large'
            text: "continue_with" // Text options for the button
        }
    );
    
    google.accounts.id.prompt(); // Prompt the user for sign-in.
};
*/

document.getElementById("login-button").addEventListener("click", function (event) {
  const surnameInput = document.querySelector(".logtext[placeholder='Овог']");
  const nameInput = document.querySelector(".logtext[placeholder='Нэр']");
  const emailInput = document.querySelector(".logtext[placeholder='И-мэйл']");
  const passwordInput = document.querySelector(".logtext[placeholder='Нууц үг']");
  const birthDateInput = document.getElementById("birth-date");
  const popup = document.querySelector(".popup");

  // Regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex for password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Check if all fields are filled
  if (!surnameInput.value.trim() || !nameInput.value.trim() || 
      !emailInput.value.trim() || !passwordInput.value.trim() || !birthDateInput.value) {
      alert("Бүх талбарыг бөглөнө үү.");
      event.preventDefault(); // Prevent further actions
      return;
  }

  // Validate email format
  if (!emailRegex.test(emailInput.value.trim())) {
      alert("И-мэйл хаяг буруу байна.");
      event.preventDefault(); // Prevent further actions
      return;
  }

  // Validate password requirements
  if (!passwordRegex.test(passwordInput.value.trim())) {
      alert("Нууц үг дор хаяж 8 тэмдэгттэй, нэг том үсэг, нэг тоо агуулах шаардлагатай.");
      event.preventDefault(); // Prevent further actions
      return;
  }

  // Check age validation (21 years old)
  const birthDate = new Date(birthDateInput.value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const isBirthdayPassed = (today.getMonth() > birthDate.getMonth()) || 
                           (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (age < 21 || (age === 21 && !isBirthdayPassed)) {
      alert("Та 21 нас хүрсэн байх шаардлагатай.");
      event.preventDefault(); // Prevent further actions
      return;
  }

  // Close popup if all validations pass
  if (popup) {
      popup.style.display = "none";
  }

  // Optional: Perform further actions, like showing the name
  const userNameDisplay = document.getElementById("user-name-display");
  if (userNameDisplay) {
      userNameDisplay.textContent = surnameInput.value.trim();
  }
});

function handleCredentialResponse(response) {
  // Decode the JWT credential response
  const data = parseJwt(response.credential);

  // Extract the first name
  const firstName = data.given_name || "Хэрэглэгч";

  // Display the first name next to the user icon
  const userNameDisplay = document.getElementById("user-name-display");
  if (userNameDisplay) {
      userNameDisplay.textContent = firstName;
  }

  // Optional: Hide the popup if still visible
  const popup = document.querySelector(".popup");
  if (popup) {
      popup.style.display = "none";
  }

  console.log("Google User Info:", data); // Debug: Show user info in the console
}

// Utility function to decode JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
      atob(base64)
          .split('')
          .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
  );
  return JSON.parse(jsonPayload);
}
