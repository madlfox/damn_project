import { navigateTo } from "../index.js";
import { updateTextForElem } from "../utils/languages.js";
import { validateUsername } from "../utils/validateInput.js";

export function signIn() {
	// Get the form elements from the HTML
	const usernameElem = document.getElementById("username");
	const passwordElem = document.getElementById("password");
	const usernameErrorElem = document.getElementById("username-error");
	const passwordErrorElem = document.getElementById("password-error");

	// Add event listeners for when the user leaves the input fields
	usernameElem.addEventListener("blur", () => validateUsername(usernameElem, usernameErrorElem));
	passwordElem.addEventListener("blur", () => validatePassword(passwordElem, passwordErrorElem));

	const signInButton = document.querySelector("#sign-in-button");

	const validatePassword = (passwordElem, passwordErrorElem) => {
		const password = passwordElem.value;
		if (password === '') {
			updateTextForElem(passwordErrorElem, 'password-empty-error');
			return false;
		} else {
			passwordErrorElem.textContent = '\u00A0';
			return true;
		}
	}

	// Add event listener for the submit button
	signInButton.addEventListener("click", async (e) => {
		e.preventDefault();
	
		const usernameValid = validateUsername(usernameElem, usernameErrorElem);
		const passwordValid = validatePassword(passwordElem, passwordErrorElem);
		if (!usernameValid || !passwordValid) return;
	
		const username = usernameElem.value;
		const password = passwordElem.value;
	
		const response = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
	
		const containerLogin = document.querySelector('.container-login');
	
		if (response.status === 400) {
			const responseData = await response.json();
			updateTextForElem(usernameErrorElem, responseData.error[0]);
			updateTextForElem(passwordErrorElem, responseData.error[0]);
			return;
		}
	
		if (response.status === 200) {
			const result = await response.json();
	
			if (result.twofa_required && result.temp_token) {
				// Save the temp_token in sessionStorage or localStorage
				sessionStorage.setItem("temp_token", result.temp_token);
				navigateTo("/verify2fa");
			} else if (result.token) {
				// Save the final JWT token (can be used in Authorization headers later)
				localStorage.setItem("auth_token", result.token);
				navigateTo("/setup2fa");
			} else {
				containerLogin.innerHTML = `
					<div class="error text-center">
						<h5 id="failure-message" class="text-white">Login succeeded, but server response was unexpected</h5>
					</div>
				`;
			}
			return;
		}
	
		containerLogin.innerHTML = `
			<div class="error text-center">
				<h5 id="failure-message" class="text-white">An error occurred in the server</h5>
			</div>
		`;
		updateTextForElem(document.getElementById('failure-message'), 'sign-up-failure');
	});
}

/*Changed*/