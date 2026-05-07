const orderIdEl = document.getElementById("orderId");
const summaryEl = document.getElementById("orderSummary");

let order = JSON.parse(localStorage.getItem("lastOrder")) || [];

let orderId = "RST" + Math.floor(Math.random()*100000);

orderIdEl.innerText = orderId;

order.forEach(item => {
  const div = document.createElement("div");

  div.innerHTML = 
    <p>${item.name} (${item.size}) x ${item.quantity}</p>
  ;

  summaryEl.appendChild(div);
});