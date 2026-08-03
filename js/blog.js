document.addEventListener("DOMContentLoaded", () => {
  loadBlogArticles();
});

async function loadBlogArticles() {
  const books = await fetchBooks("bestsellers fiction", 40);

  const booksWithDescription = books.filter(
    (book) => book.volumeInfo.description && book.volumeInfo.description.length > 20
  );

  const finalBooks = booksWithDescription.slice(0, 6);
  renderBlogCards(finalBooks);
}

function renderBlogCards(books) {
  const container = document.querySelector("#blog-container");

  if (!container) {
    console.warn("There is no #blog-container element on the page");
    return;
  }

  container.innerHTML = "";

  if (books.length === 0) {
    container.innerHTML = `<p class="text-center">The articles could not be loaded at this time.</p>`;
    return;
  }

  books.forEach((book) => {
    const info = book.volumeInfo;

    const title = info.title || "Untitled Article";
    const image = info.imageLinks?.thumbnail || "";
    const category = info.categories ? info.categories[0].toUpperCase() : "READING TIPS";

    const fullDescription = info.description;
    const excerpt = fullDescription.length > 100
      ? fullDescription.substring(0, 100) + "..."
      : fullDescription;

    const mediaHTML = image
      ? `<img src="${image}" alt="${title}" style="width:100%; height:100%; object-fit:cover;">`
      : `<i class="fa-brands fa-leanpub"></i>`;

    const cardHTML = `
      <div class="card">
        <div class="card1">
          ${mediaHTML}
        </div>
        <div class="kool">
          <span>${category}</span>
          <h3>${title}</h3>
          <p>${excerpt}</p>
          <button class="btn1" onclick="window.location.href='book-details.html?id=${book.id}'">READ MORE</button>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHTML);
  });
}