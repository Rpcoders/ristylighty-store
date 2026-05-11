// =====================
// 🛒 FIXED CART SYSTEM
// =====================


// =====================
// 🧠 SAFE CART LOAD
// =====================
let cart =
  JSON.parse(localStorage.getItem("cart")) || [];

const cartItems =
  document.getElementById("cartItems");

const emptyCart =
  document.getElementById("emptyCart");

const totalEl =
  document.getElementById("total");

const suggestionsEl =
  document.getElementById("suggestions");

const token =
  localStorage.getItem("token");


// =====================
// 🚀 INIT
// =====================
function init() {

  sanitizeCart();

  renderLocalCart();

  loadSuggestions();

}

init();


// =====================
// 🧹 REMOVE BROKEN ITEMS
// =====================
function sanitizeCart() {

  cart = cart.filter(item => {

    return (
      item &&
      item.name &&
      item.price &&
      item.qty
    );

  });

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


// =====================
// 🛒 RENDER CART
// =====================
function renderLocalCart() {

  if (!cartItems) return;

  cartItems.innerHTML = "";

  // EMPTY CART
  if (!cart.length) {

    if (emptyCart) {
      emptyCart.style.display = "block";
    }

    totalEl.innerText = "0";

    return;
  }

  // HIDE EMPTY
  if (emptyCart) {
    emptyCart.style.display = "none";
  }

  let total = 0;

  cart.forEach((item, index) => {

    const price =
      Number(item.price || 0);

    const qty =
      Number(item.qty || 1);

    total += price * qty;

    cartItems.innerHTML += `

      <div class="item">

        <!-- IMAGE -->
        <div class="item-image">

          <img
            src="${item.image || '/images/anime-front.jpg'}"
            alt="${item.name}"
            onerror="this.src='/images/anime-front.jpg'"
          >

        </div>


        <!-- INFO -->
        <div class="item-info">

          <h3>
            ${item.name}
          </h3>

          <p class="size">
            Size:
            <span>
              ${item.size || "Free Size"}
            </span>
          </p>

          <p class="price">
            ₹${price}
          </p>

          <p class="delivery">
            🚚 Delivery in 3-7 days
          </p>

        </div>


        <!-- QUANTITY -->
        <div class="qty-box">

          <button
            class="qty-btn"
            onclick="dec(${index})"
          >
            -
          </button>

          <span class="qty-number">
            ${qty}
          </span>

          <button
            class="qty-btn"
            onclick="inc(${index})"
          >
            +
          </button>

        </div>


        <!-- REMOVE -->
        <div class="remove-box">

          <button
            class="remove-btn"
            onclick="removeItem(${index})"
          >
            Remove
          </button>

        </div>

      </div>

    `;

  });

  totalEl.innerText = total;

}


// =====================
// ➕ INCREASE QTY
// =====================
function inc(i) {

  cart[i].qty =
    Number(cart[i].qty || 1) + 1;

  update();

}


// =====================
// ➖ DECREASE QTY
// =====================
function dec(i) {

  if (cart[i].qty > 1) {

    cart[i].qty--;

    update();

  }

}


// =====================
// ❌ REMOVE ITEM
// =====================
function removeItem(i) {

  cart.splice(i, 1);

  update();

}


// =====================
// 💾 UPDATE STORAGE
// =====================
function update() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  renderLocalCart();

}


// =====================
// 💳 CHECKOUT
// =====================
function checkout() {

  if (!cart.length) {

    alert("Cart is empty");

    return;
  }

  window.location.href =
    "checkout.html";

}


// =====================
// 🔥 PRODUCT SUGGESTIONS
// =====================
async function loadSuggestions() {

  try {

    if (!suggestionsEl) return;

    const res =
      await fetch("/api/products");

    const data =
      await res.json();
const products =
      Array.isArray(data)
        ? data
        : (data.products || []);

    suggestionsEl.innerHTML = "";

    products
      .slice(0, 6)
      .forEach(p => {

        const img =
          p.image ||
          "/images/anime-front.jpg";

        suggestionsEl.innerHTML += `

          <div class="suggest-card">

            <img
              src="${img}"
              onerror="this.src='/images/anime-front.jpg'"
            >

            <p>
              ${p.name || "Unnamed"}
            </p>

            <small>
              ₹${Number(p.price || 0)}
            </small>

            <a href="product.html?id=${p._id}">
              View
            </a>

          </div>

        `;

      });

  } catch (err) {

    console.error(
      "Suggestions error:",
      err
    );

  }

}