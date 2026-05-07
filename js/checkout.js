// =====================
// 🔥 FULL FIXED checkout.js
// =====================

// =====================
// 🧠 SAFE CART LOAD
// =====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("summary-items");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");

let subtotal = 0;

if (container) {
  container.innerHTML = "";
}

// =====================
// 🛒 RENDER CART SUMMARY
// =====================
cart.forEach(item => {

  const price = Number(item.price || 0);
  const qty = Number(item.qty || 1);

  subtotal += price * qty;

  const div = document.createElement("div");

  div.className = "checkout-item";

  div.innerHTML = `
    <div class="checkout-product">
      <img 
        src="${item.image || '/images/placeholder.png'}"
        onerror="this.src='/images/placeholder.png'"
      />

      <div>
        <h4>${item.name}</h4>
        <p>Size: ${item.size || "Free Size"}</p>
        <p>Qty: ${qty}</p>
      </div>
    </div>

    <span>₹${price * qty}</span>
  `;

  if (container) {
    container.appendChild(div);
  }
});

// =====================
// 🚚 DELIVERY LOGIC
// =====================
let delivery = subtotal > 499 ? 0 : 50;
let total = subtotal + delivery;

if (subtotalEl) {
  subtotalEl.innerText = "₹" + subtotal;
}

if (deliveryEl) {
  deliveryEl.innerText = delivery === 0 ? "FREE" : "₹" + delivery;
}

if (totalEl) {
  totalEl.innerText = "₹" + total;
}

// =====================
// 🛒 PLACE ORDER FIXED
// =====================
async function placeOrder() {

  if (!cart.length) {
    alert("Cart is empty");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const pincode = document.getElementById("pincode").value.trim();

  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  )?.value;

  // =====================
  // VALIDATION
  // =====================
  if (
    !name ||
    !phone ||
    !address ||
    !city ||
    !pincode
  ) {
    alert("Fill all shipping details");
    return;
  }

  // =====================
  // COD FLOW
  // =====================
  if (paymentMethod === "cod") {

    alert("Order placed successfully!");

    localStorage.removeItem("cart");

    window.location.href = "order-success.html";

    return;
  }

  // =====================
  // ONLINE FLOW
  // =====================
  if (paymentMethod === "online") {
    await payNow();
  }
}

// =====================
// 💳 RAZORPAY PAYMENT
// =====================
async function payNow() {

  try {

    const res = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: total * 100
        })
      }
    );

    const order = await res.json();

    if (!order.id) {
      alert("Payment initialization failed");
      return;
    }

    const options = {

      key: "rzp_test_Sly4oBSpL3Ir79",

      amount: order.amount,

      currency: "INR",

      name: "ristylighty",

      description: "Anime Streetwear Order",

      image: "/images/logo.png",

      order_id: order.id,

      handler: function (response) {

        console.log(response);

        alert("Payment Successful!");

        localStorage.removeItem("cart");

        window.location.href = "order-success.html";
      },

      prefill: {
        name: document.getElementById("name").value,
        contact: document.getElementById("phone").value
      },

      theme: {
        color: "#111111"
      }
    };

    const rzp = new Razorpay(options);

    rzp.open();

  } catch (err) {

    console.error("Payment Error:", err);

    alert("Payment failed");

  }
}