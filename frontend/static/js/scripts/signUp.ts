import { BASE_URL } from '../index.js';
import { updateTextForElem } from '../utils/languages.js';
import { navigateTo } from '../index.js';
import { validateUsername, validateEmail, validatePassword } from '../utils/validateInput.js';

export function signUp(): void {
  // Get the form elements from the HTML
  const usernameElem = document.getElementById('username') as HTMLInputElement;
  const emailElem = document.getElementById('email') as HTMLInputElement;
  const passwordElem = document.getElementById('password') as HTMLInputElement;

  const usernameErrorElem = document.getElementById('username-error') as HTMLElement;
  const emailErrorElem = document.getElementById('email-error') as HTMLElement;
  const passwordErrorElem = document.getElementById('password-error') as HTMLElement;

  // Apply Tailwind classes
  usernameElem.classList.add('input-field');
  emailElem.classList.add('input-field');
  passwordElem.classList.add('input-field');
  usernameErrorElem.classList.add('input-error');
  emailErrorElem.classList.add('input-error');
  passwordErrorElem.classList.add('input-error');

  // Add event listeners for when the user leaves the input fields
  usernameElem.addEventListener('blur', () => validateUsername(usernameElem, usernameErrorElem));
  emailElem.addEventListener('blur', () => validateEmail(emailElem, emailErrorElem));
  passwordElem.addEventListener('blur', () => validatePassword(passwordElem, passwordErrorElem));

  // Add event listener for the submit button
  const signUpButtonElem = document.getElementById('sign-up-button') as HTMLButtonElement;
  signUpButtonElem.classList.add('button-primary');
  signUpButtonElem.addEventListener('click', submitForm);

  /**
   * Function to handle form submission
   * @param e Event
   */
  async function submitForm(e: Event): Promise<void> {
    // Prevent the default behavior of the form
    e.preventDefault();

    // Make sure that all the fields are valid (at least front-end-wise)
    const usernameValid = validateUsername(usernameElem, usernameErrorElem);
    const emailValid = validateEmail(emailElem, emailErrorElem);
    const passwordValid = validatePassword(passwordElem, passwordErrorElem);

    // If any of the fields are not valid, exit the function
    if (!usernameValid || !emailValid || !passwordValid) return;

    // If all the fields are valid, send the data to the server
    const data = {
      username: usernameElem.value,
      email: emailElem.value,
      password: passwordElem.value
    };

    try {
      // Send the data to the server
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const containerLogin = document.querySelector('.container-login') as HTMLElement;
      if (!containerLogin) {
        console.error("Container login not found");
        return;
      }

      // ❌ If the status is an error, show the error message in the correct fields
      if (response.status === 400) {
        const responseData = await response.json();
        
        if (responseData.username) {
          updateTextForElem(usernameErrorElem, responseData.username[0]);
        }
        if (responseData.email) {
          updateTextForElem(emailErrorElem, responseData.email[0]);
        }
        if (responseData.password) {
          updateTextForElem(passwordErrorElem, responseData.password[0]);
        }
        return;
      }

      // ✅ Success case
      if (response.status === 200) {
        containerLogin.innerHTML = `
          <div class="success-message">
            <h1 id="success-message" data-translate="sign-up-success">
              Sign up successful!
            </h1>
            <div class="flex items-center justify-center py-5">
              <svg class='animate-spin h-8 w-8 text-white' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <g id="timer-zero--whole-midnight-hour-clock-time">
                  <path id="Union" fill="#FFFFFF" d="M10.75 5V1h2.5v4h-2.5Z..."/>
                </g>
              </svg>
            </div>
          </div>
        `;

        updateTextForElem(document.getElementById('success-message') as HTMLElement, 'sign-up-success');

        // Navigate to sign-in after 1 second
        setTimeout(() => {
          navigateTo('/signin');
        }, 1000);

        return;
      }

      // ❌ Handle server errors
      const responseData = await response.json();
      
      containerLogin.innerHTML = `
        <div class="error-message">
          <h1 id="failure-message">
            An error occurred in the server
          </h1>
          <p class="text-white">${responseData.error}</p>
        </div>
      `;
      updateTextForElem(document.getElementById('failure-message') as HTMLElement, 'sign-up-failure');

    } catch (error) {
      console.error("Sign-up error:", error);
      const containerLogin = document.querySelector('.container-login') as HTMLElement;
      if (containerLogin) {
        containerLogin.innerHTML = `
          <div class="error-message">
            <h1 id="failure-message">
              Network error occurred, please try again
            </h1>
          </div>
        `;
      }
    }
  }
}
