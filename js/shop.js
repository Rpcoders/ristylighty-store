const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const filter = document.getElementById("categoryFilter");

let allProducts = [];

/* ===== FETCH PRODUCTS ===== */
async function loadProducts() {
  if (!grid) return;

  grid.innerHTML = "<p>Loading products...</p>";

  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    allProducts = data;
    render();

  } catch (err) {
    grid.innerHTML = "<p>Failed to load products</p>";
    console.error(err);
  }
}

loadProducts();

/* ===== RENDER ===== */
function render() {
  if (!grid) return;

  const searchText = search ? search.value.toLowerCase() : "";
  const category = filter ? filter.value : "all";

  grid.innerHTML = "";

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchText);
    const matchCategory =
      category === "all" ||
      (p.category && p.category.toLowerCase() === category.toLowerCase());

    return matchSearch && matchCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No products found</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card product-card";

    card.innerHTML = `
      <img src="${p.image || 'images/logo.png'}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <a href="product.html?id=${p._id}" class="btn btn-primary btn-sm">
        View
      </a>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/* ===== EVENTS (SAFE) ===== */
if (search) {
  search.addEventListener("input", render);
}

if (filter) {
  filter.addEventListener("change", render);
}