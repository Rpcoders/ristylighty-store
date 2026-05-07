// ============================
// 🔥 PART 1 (FIXED CORE + SIZE + ADD TO CART)
// ============================

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let product = null;
let allProducts = [];
let selectedSize = null;

const token = localStorage.getItem("token");

// ============================
// 🔥 INIT SAFE LOAD
// ============================
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      allProducts = Array.isArray(data) ? data : (data.products || []);

      product = allProducts.find(p => p._id === id);

      if (!product) {
        document.body.innerHTML = "<h1 style='text-align:center'>Product not found</h1>";
        return;
      }

      renderProduct();
      setupSizeUI();
      renderRelatedProducts();
      setupImageSwitch();
    })
    .catch(err => console.error("Fetch error:", err));
});


// ============================
// 🔥 RENDER PRODUCT
// ============================
function renderProduct() {
  document.getElementById("mainImage").src = product.image || "/images/anime-front.jpg";
  document.getElementById("productName").innerText = product.name;
  document.getElementById("productPrice").innerText = "₹" + Number(product.price || 0);

  const desc = document.querySelector(".desc");
  if (desc) desc.innerText = generateStory(product);
}


// ============================
// 🔥 STORY ENGINE
// ============================
function generateStory(p) {
  if (p.category === "anime") return "Anime-inspired premium drop.";
  if (p.category === "oversized") return "Oversized streetwear comfort fit.";
  if (p.category === "trending") return "Trending item — limited stock.";
  return "Premium quality fashion product.";
}


// ============================
// 🔥 SIZE SYSTEM (FULL FIX)
// ============================
function setupSizeUI() {
  const buttons = document.querySelectorAll(".sizes button");

  if (!buttons.length) {
    console.warn("No size buttons found");
    return;
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      // remove all active
      buttons.forEach(b => b.classList.remove("active"));

      // add active
      btn.classList.add("active");

      // FIXED LINE
      selectedSize = btn.dataset.size || btn.innerText.trim();

      console.log("Selected size:", selectedSize);

      showToast("Size selected: " + selectedSize);
    });
  });
}


// ============================
// 🔥 ADD TO CART (FULL SAFE FIX)
// ============================
async function addToCart() {
  if (!selectedSize) {
    showToast("Select size first");
    return;
  }

  const payload = {
    productId: product._id,
    name: product.name,
    price: Number(product.price || 0),
    image: product.image || "/images/anime-front.jpg",
    size: selectedSize
  };

  // ================= BACKEND =================
  if (token) {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to add");
        return;
      }

      showToast("Added to cart");
      return;

    } catch (err) {
      console.error("Backend error:", err);
      showToast("Server error");
      return;
    }
  }

  // ================= LOCAL =================
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(
    i => i.id === product._id && i.size === selectedSize
  );

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      id: product._id,
      name: product.name,
      price: Number(product.price || 0),
      size: selectedSize,
      image: product.image || "/images/anime-front.jpg",
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  console.log("Cart updated:", cart);
  showToast("Added to cart");
}
// ============================
// 🔥 PART 2 (RELATED + IMAGE + BUY + TOAST)
// ============================

// ============================
// 🔥 RELATED PRODUCTS (FIXED IMAGES)
// ============================
function renderRelatedProducts() {
  const container = document.getElementById("relatedProducts");
  if (!container) return;

  const related = allProducts
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  container.innerHTML = "";

  if (!related.length) {
    container.innerHTML = "<p>No similar products</p>";
    return;
  }

  related.forEach(p => {
    const img = p.image || "/images/anime-front.jpg";

    container.innerHTML += `
      <div class="card product-card">
        <img src="${img}" onerror="this.src='/images/anime-front.jpg'">
        <h3>${p.name}</h3>
        <p>₹${Number(p.price || 0)}</p>
        <a href="product.html?id=${p._id}">View</a>
      </div>
    `;
  });
}


// ============================
// 🔥 IMAGE SWITCH (THUMBNAIL FIX)
// ============================
function setupImageSwitch() {
  const main = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");

  if (!thumbs.length) return;

  thumbs.forEach(img => {
    img.addEventListener("click", () => {
      main.src = img.src;
    });
  });
}


// ============================
// 🔥 QUICK BUY (SAFE)
// ============================
function buyNow() {
  if (!selectedSize) {
    showToast("Select size first");
    return;
  }

  addToCart();

  setTimeout(() => {
    window.location.href = "cart.html";
  }, 400);
}


// ============================
// 🔥 TOAST SYSTEM (STABLE)
// ============================
function showToast(msg) {
  const existing = document.querySelector(".toast-msg");
  if (existing) existing.remove();

  const t = document.createElement("div");
  t.className = "toast-msg";

  t.innerText = msg;

  t.style.position = "fixed";
  t.style.bottom = "20px";
  t.style.right = "20px";
  t.style.background = "#111";
  t.style.color = "#fff";
  t.style.padding = "10px 16px";
  t.style.borderRadius = "6px";
  t.style.zIndex = "9999";
  t.style.opacity = "0";
  t.style.transition = "0.3s";

  document.body.appendChild(t);

  setTimeout(() => {
    t.style.opacity = "1";
  }, 50);

  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 300);
  }, 2000);
}