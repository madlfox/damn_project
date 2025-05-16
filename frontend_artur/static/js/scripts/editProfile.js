import { updateTextForElem } from "../utils/languages.js";
import { navigateTo } from '../index.js';
import { BASE_URL } from '../index.js';
import { isUserConnected } from "../utils/utils.js";
import { validateUsername, validateEmail, validatePassword } from "../utils/validateInput.js";
import { authFetch } from "../utils/authFetch.js"; // ✅ import authFetch

export async function editProfile () {
	if (!(await isUserConnected())) {
		navigateTo('/signin');
		return;
	}
	
	const changes = {
		profilePicture: false,
		username: false,
		email: false,
		password: false
	};

	const avatarElem = document.getElementById('avatar');
	const avatarInputElem = document.getElementById('avatar-input');
	const usernameElem = document.getElementById('username');
	const emailElem = document.getElementById('email');
	const passwordElem = document.getElementById('password');

	const usernameErrorElem = document.getElementById('username-error');
	const emailErrorElem = document.getElementById('email-error');
	const passwordErrorElem = document.getElementById('password-error');
	const avatarErrorElem = document.getElementById('avatar-error');

	usernameElem.addEventListener('blur', () => validateUsername(usernameElem, usernameErrorElem));
	emailElem.addEventListener('blur', () => validateEmail(emailElem, emailErrorElem));
	passwordElem.addEventListener('blur', () => validatePassword(passwordElem, passwordErrorElem));

	avatarInputElem.addEventListener('change', () => {
		changes.profilePicture = true;
		if (validateAvatar()) {
			const avatar = avatarInputElem.files[0];
			const url = URL.createObjectURL(avatar);
			avatarElem.src = url;
		}
	});
	usernameElem.addEventListener('change', () => changes.username = true);
	emailElem.addEventListener('change', () => changes.email = true);
	passwordElem.addEventListener('change', () => changes.password = true);

	const saveButtonElem = document.getElementById('save-button');
	saveButtonElem.addEventListener('click', submitForm);

	// ✅ Use authFetch for protected endpoints
	const responseAvatar = await authFetch(`${BASE_URL}/api/user_avatar`);
	if (responseAvatar.status !== 200) {
		avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
	} else {
		const blob = await responseAvatar.blob();
		const url = URL.createObjectURL(blob);
		avatarElem.src = url;
	}

	const response = await authFetch(`${BASE_URL}/api/profile`);
	if (response.status === 200) {
		const responseData = await response.json();
		const user = responseData.user;
		usernameElem.value = user.username;
		emailElem.value = user.email;
	}

	function validateAvatar() {
		const avatar = avatarInputElem.files[0];
		const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
		if (!avatar) {
			updateTextForElem(avatarErrorElem, 'avatar-empty-error');
			return false;
		}
		if (!allowedExtensions.exec(avatar.name)) {
			updateTextForElem(avatarErrorElem, 'avatar-invalid-error');
			return false;
		}
		if (avatar.size > 1024 * 1024) {
			updateTextForElem(avatarErrorElem, 'avatar-size-error');
			return false;
		}
		avatarErrorElem.textContent = '\u00A0';
		return true;
	}

	async function submitForm(e) {
		e.preventDefault();

		const hasChanges = Object.values(changes).some(v => v === true);
		if (!hasChanges) return;

		const formData = new FormData();
		let formValid = true;

		if (changes.profilePicture && validateAvatar()) {
			formData.append('profile_picture', avatarInputElem.files[0]);
		} else if (changes.profilePicture) {
			formValid = false;
		}
		if (changes.username && validateUsername(usernameElem, usernameErrorElem)) {
			formData.append('username', usernameElem.value);
		} else if (changes.username) {
			formValid = false;
		}
		if (changes.email && validateEmail(emailElem, emailErrorElem)) {
			formData.append('email', emailElem.value);
		} else if (changes.email) {
			formValid = false;
		}
		if (changes.password && validatePassword(passwordElem, passwordErrorElem)) {
			formData.append('password', passwordElem.value);
		} else if (changes.password) {
			formValid = false;
		}

		if (!formValid) return;

		const response = await authFetch(`${BASE_URL}/api/update_user`, {
			method: 'PUT',
			body: formData
		});

		if (response.status === 400) {
			const responseData = await response.json();
			if (responseData.username) updateTextForElem(usernameErrorElem, responseData.username[0]);
			if (responseData.email) updateTextForElem(emailErrorElem, responseData.email[0]);
			if (responseData.password) updateTextForElem(passwordErrorElem, responseData.password[0]);
		} else if (response.status === 200) {
			const containerEdit = document.querySelector('.container-edit');
			containerEdit.innerHTML = `
				<div class="success text-center">
					<h1 id="success-message" class="text-white" data-translate="save-success">Changes saved successfully!</h1>
					<div class="d-flex align-items-center justify-content-center p-5">
						<svg class='loading-icon' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
							<path fill="#FFFFFF" d="M10.75 5V1h2.5v4h-2.5Zm-7.134 0.384 2.5 2.5 1.768-1.768-2.5-2.5-1.768 1.768Zm14.268 2.5 2.5-2.5-1.768-1.768-2.5 2.5 1.768 1.768Zm0 8.232 2.5 2.5-1.768 1.768-2.5-2.5 1.768-1.768Zm-11.768 0-2.5 2.5 1.768 1.768 2.5-2.5-1.768-1.768ZM10.75 19v4h2.5v-4h-2.5ZM5 13.25H1v-2.5h4v2.5Zm14 0h4v-2.5h-4v2.5Z"/>
						</svg>
					</div>
				</div>
			`;
			updateTextForElem(document.getElementById('success-message'), 'save-success');
			setTimeout(() => navigateTo('/profile'), 1000);
		} else {
			const containerLogin = document.querySelector('.container-edit');
			containerLogin.innerHTML = `
				<div class="error text-center">
					<h1 id="failure-message" class="text-white">An error occurred in the server</h1>
				</div>
			`;
			updateTextForElem(document.getElementById('failure-message'), 'save-failure');
		}
	};
}

/*Changed*/