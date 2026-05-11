// ============================
// 🔥 PART 1 (FULL FIXED)
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

      allProducts = Array.isArray(data)
        ? data
        : (data.products || []);

      product = allProducts.find(
        p => String(p._id) === String(id)
      );

      if (!product) {

        document.body.innerHTML =
          "<h1 style='text-align:center'>Product not found</h1>";

        return;
      }

      renderProduct();
      setupSizeUI();
      renderRelatedProducts();
      setupImageSwitch();

    })
    .catch(err => {
      console.error("Fetch error:", err);
    });

});


// ============================
// 🔥 RENDER PRODUCT
// ============================
function renderProduct() {

  document.getElementById("mainImage").src =
    product.image || "/images/anime-front.jpg";

  document.getElementById("productName").innerText =
    product.name;

  document.getElementById("productPrice").innerText =
    "₹" + Number(product.price || 0);

  const desc = document.querySelector(".desc");

  if (desc) {
    desc.innerText = generateStory(product);
  }

}


// ============================
// 🔥 STORY ENGINE
// ============================
function generateStory(p) {

  if (p.category === "anime") {
    return "Anime-inspired premium drop.";
  }

  if (p.category === "oversized") {
    return "Oversized streetwear comfort fit.";
  }

  if (p.category === "trending") {
    return "Trending item — limited stock.";
  }

  return "Premium quality fashion product.";

}


// ============================
// 🔥 SIZE SYSTEM
// ============================
function setupSizeUI() {

  const buttons =
    document.querySelectorAll(".sizes button");

  if (!buttons.length) {
    console.warn("No size buttons found");
    return;
  }

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      buttons.forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      selectedSize =
        btn.dataset.size || btn.innerText.trim();

      console.log("Selected size:", selectedSize);

      showToast("Size selected: " + selectedSize);

    });

  });

}


// ============================
// 🔥 ADD TO CART (FULL FIX)
// ============================
async function addToCart() {

  if (!selectedSize) {
    showToast("Select size first");
    return;
  }

  // =========================
  // 🔥 LOCAL STORAGE FIRST
  // =========================

  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => {

    return (
      String(item.id) === String(product._id) &&
      item.size === selectedSize
    );

  });

  if (existing) {

    existing.qty =
      Number(existing.qty || 1) + 1;

  } else {

    cart.push({

      id: product._id,

      name: product.name,

      price: Number(product.price || 0),

      image:
        product.image ||
        "/images/anime-front.jpg",

      size: selectedSize,

      qty: 1

    });

  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  console.log(
    "✅ Local cart updated:",
    JSON.parse(localStorage.getItem("cart"))
  );

  // =========================
  // 🔥 BACKEND OPTIONAL
  // =========================

  if (token) {

    try {

      await fetch("/api/cart/add", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },

        body: JSON.stringify({
          productId: product._id,
          size: selectedSize,
          qty: 1
        })

      });

    } catch (err) {

      console.error(
        "Backend cart error:",
        err
      );
    }

  }

  showToast("Added to cart");

}

// ============================
// 🔥 PART 2 (FULL FIXED)
// ============================


// ============================
// 🔥 RELATED PRODUCTS
// ============================
function renderRelatedProducts() {

  const container =
    document.getElementById("relatedProducts");

  if (!container) return;

  const related = allProducts
    .filter(p => {

      return (
        p.category === product.category &&
        String(p._id) !== String(product._id)
      );

    })
    .slice(0, 4);

  container.innerHTML = "";

  if (!related.length) {

    container.innerHTML =
      "<p>No similar products</p>";

    return;
  }

  related.forEach(p => {

    const img =
      p.image || "/images/anime-front.jpg";

    container.innerHTML += `

      <div class="card product-card">

        <img
          src="${img}"
          onerror="this.src='/images/anime-front.jpg'"
        >

        <h3>${p.name}</h3>

        <p>
          ₹${Number(p.price || 0)}
        </p>

        <a href="product.html?id=${p._id}">
          View
        </a>

      </div>

    `;

  });

}


// ============================
// 🔥 IMAGE SWITCH
// ============================
function setupImageSwitch() {

  const main =
    document.getElementById("mainImage");

  const thumbs =
    document.querySelectorAll(".thumb");

  if (!thumbs.length) return;

  thumbs.forEach(img => {

    img.addEventListener("click", () => {

      main.src = img.src;

    });

  });

}


// ============================
// 🔥 QUICK BUY
// ============================
async function buyNow() {

  if (!selectedSize) {

    showToast("Select size first");

    return;
  }

  await addToCart();

  setTimeout(() => {

    window.location.href = "cart.html";

  }, 300);

}


// ============================
// 🔥 TOAST SYSTEM
// ============================
function showToast(msg) {

  const existing =
    document.querySelector(".toast-msg");

  if (existing) {
    existing.remove();
  }

  const t = document.createElement("div");

  t.className = "toast-msg";

  t.innerText = msg;

  t.style.position = "fixed";
  t.style.bottom = "20px";
  t.style.right = "20px";
  t.style.background = "#111";
  t.style.color = "#fff";
  t.style.padding = "12px 18px";
  t.style.borderRadius = "10px";
  t.style.fontSize = "14px";
  t.style.fontWeight = "600";
  t.style.boxShadow =
    "0 10px 30px rgba(0,0,0,0.3)";
  t.style.zIndex = "9999";
  t.style.opacity = "0";
  t.style.transform = "translateY(10px)";
  t.style.transition = "0.3s";

  document.body.appendChild(t);

  setTimeout(() => {

    t.style.opacity = "1";
    t.style.transform = "translateY(0px)";

  }, 50);

  setTimeout(() => {

    t.style.opacity = "0";
    t.style.transform = "translateY(10px)";

    setTimeout(() => {

      t.remove();

    }, 300);

  }, 2000);

}