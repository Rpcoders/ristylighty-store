async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    // 🔥 FORCE SAVE (NO CLEAR)
    localStorage.setItem("token", data.token);

    const userObj = { role: data.role };
    localStorage.setItem("user", JSON.stringify(userObj));

    console.log("USER SAVED:", localStorage.getItem("user"));

    // 🔥 DELAY (important for browser write)
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 200);

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server error");
  }
}