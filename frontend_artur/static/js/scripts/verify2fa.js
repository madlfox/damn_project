import { navigateTo } from "../index.js";

export function verify2FA() {
  const verifyButton = document.getElementById("verify-button");
  const resultElem = document.getElementById("verify-result");

  verifyButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const code = document.getElementById("code-input").value;
    const temp_token = sessionStorage.getItem("temp_token");

    const res = await fetch("/api/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temp_token, code })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("auth_token", data.token);
    
      // Validate token before navigating
      const profileRes = await fetch("/api/profile", {
        headers: {
          "Authorization": `Bearer ${data.token}`
        }
      });
    
      if (profileRes.status === 200) {
        navigateTo("/profile");
      } else {
        resultElem.textContent = "Token valid, but profile access failed.";
      }
    }
  });
}

/*Changed*/