const params = new URLSearchParams(window.location.search);
const view = params.get("view") || "front";

const productData = {
  name: "Anime Printed Tee",
  price: 899,
  images: {
    front: "images/anime-front.jpg",
    back: "images/anime-back.jpg",
    close: "images/anime-close.jpg"
  }
};

// set image
document.getElementById("mainImage").src = productData.images[view];

// size logic
let selectedSize = null;

document.querySelectorAll(".sizes button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedSize = btn.innerText;
  };
});

// ADD TO CART
function addToCart() {
  if (!selectedSize) {
    alert("Select size");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = {
    id: "anime-tee-" + view,
    name: productData.name,
    price: productData.price,
    size: selectedSize,
    image: productData.images[view],
    quantity: 1
  };

  let existing = cart.find(item =>
    item.id === product.id && item.size === product.size
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
}