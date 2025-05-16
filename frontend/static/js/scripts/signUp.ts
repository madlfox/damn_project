

import { BASE_URL, navigateTo } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { validateUsername, validateEmail, validatePassword } from '../utils/validateInput.js';

export function signUp(): void {
  /* ---------------- DOM elements ---------------- */
  const usernameElem = document.getElementById('username') as HTMLInputElement;
  const emailElem = document.getElementById('email') as HTMLInputElement;
  const passwordElem = document.getElementById('password') as HTMLInputElement;

  const usernameErrorElem = document.getElementById('username-error') as HTMLElement;
  const emailErrorElem = document.getElementById('email-error') as HTMLElement;
  const passwordErrorElem = document.getElementById('password-error') as HTMLElement;

  /* ----------- live blur validation ----------- */
  usernameElem.addEventListener('blur', () => validateUsername(usernameElem, usernameErrorElem));
  emailElem.addEventListener('blur', () => validateEmail(emailElem, emailErrorElem));
  passwordElem.addEventListener('blur', () => validatePassword(passwordElem, passwordErrorElem));

  /* ---------------- submit ---------------- */
  const signUpButtonElem = document.getElementById('sign-up-button') as HTMLButtonElement;
  signUpButtonElem.addEventListener('click', submitForm);

  async function submitForm(e: Event): Promise<void> {
    e.preventDefault();

    const usernameValid = validateUsername(usernameElem, usernameErrorElem);
    const emailValid = validateEmail(emailElem, emailErrorElem);
    const passwordValid = validatePassword(passwordElem, passwordErrorElem);
    if (!usernameValid || !emailValid || !passwordValid) return;

    const data = {
      username: usernameElem.value,
      email: emailElem.value,
      password: passwordElem.value
    };

    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 400) {
      const errs = await response.json();
      if (errs.username) updateTextForElem(usernameErrorElem, errs.username[0]);
      if (errs.email) updateTextForElem(emailErrorElem, errs.email[0]);
      if (errs.password) updateTextForElem(passwordErrorElem, errs.password[0]);
      return;
    }

    if (response.status === 200) {
      showMessage('success', 'sign-up-success');
      setTimeout(() => navigateTo('/signin'), 1000);
      return;
    }

    // generic / unknown error
    const errJson = await response.json().catch(() => ({}));
    showMessage('error', 'sign-up-failure', errJson.error);
  }

  /* -------- helper to swap container content -------- */
  function showMessage(type: 'success' | 'error', translateKey: string, extraMsg = ''): void {
    const container = document.querySelector('.container-login') as HTMLElement;
    container.innerHTML = type === 'success' ? successMarkup() : errorMarkup(extraMsg);
    const msgElem = document.getElementById(`${type === 'success' ? 'success' : 'failure'}-message`) as HTMLElement;
    updateTextForElem(msgElem, translateKey);
  }

  const successMarkup = () => `
    <div class="success text-center">
      <h1 id="success-message" class="text-white" data-translate="sign-up-success">Sign up successful!</h1>
      <div class="d-flex align-items-center justify-content-center p-5">
        <svg class='loading-icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
          <g><path fill="#FFFFFF" d="M10.75 5V1h2.5v4h-2.5Z..."/></g>
        </svg>
      </div>
    </div>`;

  const errorMarkup = (msg: string) => `
    <div class="error text-center">
      <h1 id="failure-message" class="text-white">An error occured in the server</h1>
      <p class="text-white">${msg}</p>
    </div>`;
}
