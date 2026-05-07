const container = document.getElementById("suggestedProducts");

fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    // 🔥 Simple smart logic (not random garbage)
    const trending = data.filter(p => p.category === "trending");

    const productsToShow = trending.length > 0 ? trending : data.slice(0, 6);

    container.innerHTML = "";

    productsToShow.forEach(p => {
      container.innerHTML += `
        <div class="card product-card">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <p>₹${p.price}</p>
          <a href="product.html?id=${p._id}" class="btn btn-primary">View</a>
        </div>
      `;
    });
  });