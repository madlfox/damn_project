

import { navigateTo } from "../index.js";
import { updateTextForElem } from "../utils/languages.js";
import { validateUsername } from "../utils/validateInput.js";

export function signIn(): void {
  const usernameElem = document.getElementById("username") as HTMLInputElement;
  const passwordElem = document.getElementById("password") as HTMLInputElement;
  const usernameErrorElem = document.getElementById("username-error") as HTMLElement;
  const passwordErrorElem = document.getElementById("password-error") as HTMLElement;

  usernameElem.addEventListener("blur", () => validateUsername(usernameElem, usernameErrorElem));
  passwordElem.addEventListener("blur", () => validatePassword(passwordElem, passwordErrorElem));

  const signInButton = document.querySelector("#sign-in-button") as HTMLButtonElement;

  const validatePassword = (pwdElem: HTMLInputElement, pwdErrElem: HTMLElement): boolean => {
    const password = pwdElem.value.trim();
    if (password === "") {
      updateTextForElem(pwdErrElem, "password-empty-error");
      return false;
    }
    pwdErrElem.textContent = "\u00A0"; // non‑breaking space to clear message
    return true;
  };

  signInButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const usernameValid = validateUsername(usernameElem, usernameErrorElem);
    const passwordValid = validatePassword(passwordElem, passwordErrorElem);
    if (!usernameValid || !passwordValid) return;

    const data = { username: usernameElem.value, password: passwordElem.value };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (response.status === 400) {
        const responseData = await response.json();
        updateTextForElem(usernameErrorElem, responseData.error[0]);
        updateTextForElem(passwordErrorElem, responseData.error[0]);
      } else if (response.status === 200) {
        navigateTo("/profile");
      } else {
        const containerLogin = document.querySelector(".container-login") as HTMLElement;
        containerLogin.innerHTML = `
          <div class="error text-center">
            <h5 id="failure-message" class="text-white">An error occured in the server</h5>
          </div>`;
        updateTextForElem(document.getElementById("failure-message")!, "sign-up-failure");
      }
    } catch (err) {
      // Network or unexpected error
      const containerLogin = document.querySelector(".container-login") as HTMLElement;
      containerLogin.innerHTML = `
        <div class="error text-center">
          <h5 id="failure-message" class="text-white">Network error</h5>
        </div>`;
    }
  });
}
