/* ========= AUTH ========= */
let user = null;

try {
  user = JSON.parse(localStorage.getItem("user"));
} catch {
  user = null;
}

console.log("USER:", user);

// ❗ Only redirect if CLEARLY wrong
if (!user) {
  console.log("No user found");
} else if (user.role && user.role !== "admin") {
  window.location.href = "login.html";
}

const menuBtn = document.getElementById("menuBtn");
const panel = document.getElementById("profilePanel");

menuBtn.addEventListener("click", () => {
  panel.classList.toggle("active");
});

/* click outside = close */
document.addEventListener("click", (e) => {
  if (!panel.contains(e.target) && e.target !== menuBtn) {
    panel.classList.remove("active");
  }
});

/* ========= GLOBAL ========= */
let editId = null;

function editProduct(id, name, price, image, category) {
  editId = id;

  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("image").value = image;
  document.getElementById("category").value = category;

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ========= HELPERS ========= */
function getImage(img) {
  if (!img) return "/images/placeholder.png";
  if (img.startsWith("http")) return img;
  return img.startsWith("/") ? img : "/" + img;
}

/* ========= DOM ========= */
const list = document.getElementById("productList");
const countEl = document.getElementById("productsCount");

/* ========= LOAD ========= */
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    list.innerHTML = "";

    data.forEach(p => {
      list.innerHTML += `
        <div class="product-item">
          <div class="product-info">
            <img src="${getImage(p.image)}">
            <div>
              <b>${p.name}</b><br>
              ₹${p.price}
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-secondary"
              onclick="editProduct('${p._id}','${p.name}','${p.price}','${p.image}','${p.category}')">
              Edit
            </button>

            <button class="btn btn-danger"
              onclick="deleteProduct('${p._id}')">
              Delete
            </button>
          </div>
        </div>
      `;
    });

    countEl.innerText = data.length;

  } catch (err) {
    console.error(err);
  }
}

loadProducts();

/* ========= ADD / EDIT ========= */
async function addProduct() {
  try {
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const image = document.getElementById("image").value.trim();
    const file = document.getElementById("imageFile").files[0];
    const category = document.getElementById("category").value.trim();

    // ❗ FIX: only name + price required
    if (!name || !price) {
      alert("Name & Price required");
      return;
    }

    let finalImage = image;

    // 👉 अगर URL नहीं है लेकिन file है → पहले upload करो
    if (!finalImage && file) {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        alert(uploadData.error || "Upload failed");
        return;
      }

      finalImage = uploadData.imageUrl;
    }

    // 👉 अगर दोनों empty → allowed (placeholder use होगा)
    const token = localStorage.getItem("token");

    let url = "/api/products";
    let method = "POST";

    if (editId) {
      url = `/api/products/${editId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        name,
        price,
        image: finalImage,
        category
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    alert(editId ? "Updated" : "Added");

    editId = null;

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("image").value = "";
    document.getElementById("imageFile").value = "";
    document.getElementById("category").value = "";

    loadProducts();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* ========= EDIT ========= */
function editProduct(id, name, price, image, category) {
  editId = id;

  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("image").value = image;
  document.getElementById("category").value = category;
}

const fileInput = document.getElementById("imageFile");
const preview = document.getElementById("previewImg");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
});




/* ========= DELETE ========= */
async function deleteProduct(id) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    loadProducts();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* ========= LOGOUT ========= */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}