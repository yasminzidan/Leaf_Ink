document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedBooks();
  loadPopularBooks();
  initAuthModal();
  initLiveSearch();
});


// Featured Books
async function loadFeaturedBooks() {
  const books = await fetchBooks(CATEGORIES.featured, 4);
  renderBookCards(books, "#featured-books-grid");
}

// Popular Books
async function loadPopularBooks() {
  const books = await fetchBooks(CATEGORIES.popular, 4);
  renderBookCards(books, "#popular-books-grid");
}

// Render Book Cards
function renderBookCards(books, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = "";

  if (books.length === 0) {
    container.innerHTML = `<p class="text-center col-12">Books cannot be downloaded at this time.</p>`;
    return;
  }
  books.forEach((book) => {
    const info = book.volumeInfo;
    const title = info.title || "Untitled";
    const author = info.authors ? info.authors[0] : "Unknown author";
    const image = info.imageLinks?.thumbnail?.replace("http://", "https://") || "images/placeholder.jpg";

    let price;
    if (book.saleInfo?.listPrice?.amount) {
      price = `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}`;

    } else {
      var seed = book.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      price = ((seed % 351) + 250).toFixed(2) + " EGP";
    }

    const cardHTML = `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="book-card-wrapper product-item" data-id="${book.id}">
          <figure class="product-style mb-3 text-center">
            <a href="book-details.html?id=${book.id}">
              <img src="${image}" alt="${title}" class="product-image img-fluid">
            </a>
          </figure>
          <figcaption>
            <h3><a href="book-details.html?id=${book.id}">${title}</a></h3>
            <span class="author-name">${author}</span>
            <div class="item-price">${price}</div>
            <button type="button" class="add-to-cart-btn add-to-cart">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </figcaption>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", cardHTML);
  });

  attachHomeAddToCartEvents();
}

// Add To Cart Events
function attachHomeAddToCartEvents() {
  var addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(function (button) {
    var newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (!isLoggedIn) {
        openAuthView('login');
        return;
      }

      var productItem = newButton.closest(".product-item");
      var id = productItem.getAttribute("data-id");
      var title = productItem.querySelector("h3").innerText;
      var author = productItem.querySelector(".author-name").innerText;
      var price = productItem.querySelector(".item-price").innerText;
      var image = productItem.querySelector("img").getAttribute("src");

      addToCart(id, title, author, price, image, 1);
    });
  });
}

// Auth View Helper
function openAuthView(viewName) {
  const authModal = document.getElementById('auth-modal');
  const registerView = document.getElementById('register-view');
  const loginView = document.getElementById('login-view');
  const profileView = document.getElementById('profile-view');
  const errorMsg = document.getElementById('login-error-msg');
  const successMsg = document.getElementById('register-success-msg');

  // Hide error/success messages while navigating
  if (errorMsg) errorMsg.classList.add('d-none');
  if (successMsg) successMsg.classList.add('d-none');

  // Hide all views
  if (registerView) registerView.classList.add('hidden');
  if (loginView) loginView.classList.add('hidden');
  if (profileView) profileView.classList.add('hidden');

  // Show the desired view
  if (viewName === 'register' && registerView) registerView.classList.remove('hidden');
  if (viewName === 'login' && loginView) loginView.classList.remove('hidden');
  if (viewName === 'profile' && profileView) profileView.classList.remove('hidden');

  if (authModal) authModal.classList.remove('hidden');
}

// -------------------------------------------
// Auth Modal Logic 
// -------------------------------------------
function initAuthModal() {
  const authModal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('close-btn');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const logoutBtn = document.getElementById('logout-btn');
  const goToLogin = document.getElementById('go-to-login');
  const goToRegister = document.getElementById('go-to-register');

  // ====================================
  // Update Navbar status based on Login State
  // ====================================
  function updateAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navAuthBtn = document.getElementById('nav-auth-btn');

    if (isLoggedIn) {
      const fname = localStorage.getItem('userFirstName') || '';
      const lname = localStorage.getItem('userLastName') || '';
      const email = localStorage.getItem('userEmail') || '';
      const mobile = localStorage.getItem('userMobile') || 'Not provided';
      const fullName = `${fname} ${lname}`.trim();

      if (navAuthBtn) {
        navAuthBtn.textContent = 'Sign Out';
        navAuthBtn.classList.remove('btn-outline-dark');
        navAuthBtn.classList.remove('sign-in-btn');
        navAuthBtn.classList.add('btn-danger');
      }

      // Update profile data
      const nameEl = document.getElementById('user-fullname-display');
      const emailEl = document.getElementById('user-email-display');
      const mobileEl = document.getElementById('user-mobile-display');

      if (nameEl) nameEl.textContent = fullName || 'User';
      if (emailEl) emailEl.textContent = email;
      if (mobileEl) mobileEl.textContent = mobile;

    } else {
      if (navAuthBtn) {
        navAuthBtn.textContent = 'Sign In';
        navAuthBtn.classList.remove('btn-danger');
        navAuthBtn.classList.add('btn-outline-dark');
        navAuthBtn.classList.add('sign-in-btn');
      }
    }
  }

  // ====================================
  // Logout
  // ====================================
  function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    updateAuthState();
    if (authModal) authModal.classList.add('hidden');
  }

  // ====================================
  // Navbar events
  // ====================================
  document.addEventListener('click', (e) => {
    const registerIcon = e.target.closest('#user-register-icon');
    const navAuthBtn = e.target.closest('#nav-auth-btn');
    const footerLoginBtn = e.target.closest('#footer-login-btn');
    const footerProfileBtn = e.target.closest('#footer-profile-btn');

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (registerIcon) {
      e.preventDefault();
      openAuthView(isLoggedIn ? 'profile' : 'register');
    }

    if (navAuthBtn) {
      e.preventDefault();
      if (isLoggedIn) {
        handleLogout();
      } else {
        openAuthView('login');
      }
    }

    if (footerLoginBtn) {
      e.preventDefault();
      openAuthView(isLoggedIn ? 'profile' : 'login');
    }

    if (footerProfileBtn) {
      e.preventDefault();
      openAuthView(isLoggedIn ? 'profile' : 'login');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      authModal.classList.add('hidden');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      authModal.classList.add('hidden');
    }
  });

  // ====================================
  // Switching between Register and Login
  // ====================================
  if (goToLogin) {
    goToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthView('login');
    });
  }

  if (goToRegister) {
    goToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthView('register');
    });
  }
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fname = document.getElementById('reg-fname').value.trim();
      const lname = document.getElementById('reg-lname').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const mobile = document.getElementById('reg-mobile').value.trim();

      localStorage.setItem('registeredEmail', email);
      localStorage.setItem('registeredPassword', password);
      localStorage.setItem('userFirstName', fname);
      localStorage.setItem('userLastName', lname);
      localStorage.setItem('userMobile', mobile);

      // Reset the form
      registerForm.reset();

      // Switch to Login with internal success message (no alert)
      openAuthView('login');

      // Display a success message within the login view
      const loginView = document.getElementById('login-view');
      let successMsg = document.getElementById('register-success-msg');

      if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.id = 'register-success-msg';
        successMsg.className = 'alert alert-success py-2 text-center small';
        successMsg.textContent = 'Account created successfully! Please Sign In.';
        loginView.insertBefore(successMsg, loginView.querySelector('form'));
      } else {
        successMsg.classList.remove('d-none');
      }
    });
  }
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const enteredEmail = document.getElementById('login-email').value.trim();
      const enteredPassword = document.getElementById('login-password').value;

      const registeredEmail = localStorage.getItem('registeredEmail');
      const registeredPassword = localStorage.getItem('registeredPassword');

      if (
        registeredEmail &&
        enteredEmail === registeredEmail &&
        enteredPassword === registeredPassword
      ) {
        // Save Login State
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', enteredEmail);

        if (loginErrorMsg) loginErrorMsg.classList.add('d-none');

        loginForm.reset();
        updateAuthState();

        if (authModal) authModal.classList.add('hidden');

      } else {
        // Incorrect data
        if (loginErrorMsg) loginErrorMsg.classList.remove('d-none');
      }
    });
  }
  // Toggle Password Visibility
  const toggleLoginPassword = document.getElementById('toggle-login-password');
  const loginPasswordInput = document.getElementById('login-password');

  if (toggleLoginPassword && loginPasswordInput) {
    toggleLoginPassword.addEventListener('click', () => {
      const isPassword = loginPasswordInput.type === 'password';
      loginPasswordInput.type = isPassword ? 'text' : 'password';
      toggleLoginPassword.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';
    });
  }
  // Toggle Register Password Visibility
  const toggleRegisterPassword = document.getElementById('toggle-register-password');
  const registerPasswordInput = document.getElementById('reg-password');

  if (toggleRegisterPassword && registerPasswordInput) {
    toggleRegisterPassword.addEventListener('click', () => {

      const isPassword = registerPasswordInput.type === 'password';

      registerPasswordInput.type = isPassword ? 'text' : 'password';

      toggleRegisterPassword.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';

    });
  }

  // Logout Button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Update status when page loads
  updateAuthState();
}

// -------------------------------------------
// Live Search
// -------------------------------------------
function initLiveSearch() {
  const searchIcon = document.getElementById('search-icon');
  const searchOverlay = document.getElementById('search-overlay');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  let debounceTimer;

  if (searchIcon) {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchOverlay) {
        searchOverlay.classList.remove('hidden');
        setTimeout(() => searchInput && searchInput.focus(), 100);
      }
    });
  }

  function closeSearch() {
    if (searchOverlay) {
      searchOverlay.classList.add('hidden');
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = `<p class="search-placeholder-text">Type to search books...</p>`;
    }
  }

  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  window.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(debounceTimer);

      if (query.length >= 1) {
        searchResults.innerHTML = `<p class="search-placeholder-text">Searching...</p>`;

        debounceTimer = setTimeout(async () => {
          try {
            const books = await fetchBooks(query, 5);
            renderSearchResults(books);
          } catch (err) {
            searchResults.innerHTML = `<p class="search-placeholder-text">Error loading results.</p>`;
          }
        }, 300);
      } else {
        searchResults.innerHTML = `<p class="search-placeholder-text">Type to search books...</p>`;
      }
    });
  }

  function renderSearchResults(books) {
    if (!searchResults) return;
    searchResults.innerHTML = '';

    if (!books || books.length === 0) {
      searchResults.innerHTML = `<p class="search-placeholder-text">No books found.</p>`;
      return;
    }

    books.forEach((book) => {
      const info = book.volumeInfo || {};
      const title = info.title || "Untitled";
      const author = info.authors ? info.authors[0] : "Unknown Author";
      const image = info.imageLinks?.thumbnail?.replace("http://", "https://") || "images/placeholder.jpg";

      const itemHTML = `
        <a href="book-details.html?id=${book.id}" class="search-item d-flex align-items-center gap-3 p-2 text-decoration-none text-dark">
          <img src="${image}" alt="${title}" style="width:45px;height:60px;object-fit:cover;border-radius:4px;">
          <div>
            <h4 class="m-0 fs-6 fw-bold text-dark">${title}</h4>
            <span class="text-muted small">${author}</span>
          </div>
        </a>
      `;
      searchResults.insertAdjacentHTML('beforeend', itemHTML);
    });
  }
} initAuthModal