import { navigateTo } from "../index.js";

export function setup2FA() {
  const qrBtn = document.getElementById("generate-qr-button");
  const enableBtn = document.getElementById("enable-2fa-button");
  const qrImg = document.getElementById("qr-code");
  const resultElem = document.getElementById("enable-result");

  qrBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("temp_token");
    const res = await fetch("/api/setup-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });

    const data = await res.json();
    if (data.qrCode) {
      qrImg.src = data.qrCode;
      qrImg.style.display = "block";
    }
  });

  enableBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const code = document.getElementById("code-input").value;
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("temp_token");

    const res = await fetch("/api/enable-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, code })
    });

    const data = await res.json();
    if (data.success) {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("temp_token");
      navigateTo("/signin");
    } else {
      resultElem.textContent = data.error?.[0] || "Failed to enable 2FA.";
    }
  });
}

/*Changed*/