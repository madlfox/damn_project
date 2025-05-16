import { navigateTo } from "../index.js";
import { BASE_URL } from "../index.js";
import { authFetch } from "../utils/authFetch.js";

export async function profile() {
  async function renderLoggingInfo() {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${BASE_URL}/api/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.status !== 200) {
      navigateTo('/signin');
    } else {
      const responseData = await response.json();
      const user = responseData.user;

      localStorage.setItem('user_id', user.id);

      const usernameElem = document.getElementById('username-name');
      usernameElem.innerText = user.username;

      const emailElem = document.getElementById('username-email');
      emailElem.innerText = user.email;

      const avatarElem = document.getElementById('avatar');
	  const responseAvatar = await authFetch(`${BASE_URL}/api/user_avatar`);

      if (responseAvatar.status !== 200) {
        avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
      } else {
        const blob = await responseAvatar.blob();
        const url = URL.createObjectURL(blob);
        avatarElem.src = url;
      }

      document.getElementById('profile-page').style.display = 'flex';
    }
  }

  const logoutButton = document.querySelector('#logout-button');
  logoutButton.addEventListener('click', async () => {
    //await fetch(`${BASE_URL}/api/logout`, { method: 'POST' });
	await authFetch(`${BASE_URL}/api/logout`, { method: 'POST' });


    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('pacmanSkin');
    localStorage.removeItem('ghostSkin');
    localStorage.removeItem('pacmanGamemode');
    localStorage.removeItem('mapName');
    localStorage.removeItem('pacmanKeybinds');
    localStorage.removeItem('pacmanTheme');
    localStorage.removeItem('themeName');
    localStorage.removeItem('pacmanUsernames');
    localStorage.removeItem('pongColors');
    localStorage.removeItem('pongUsernames');
    localStorage.removeItem('pongKeybinds');
    localStorage.removeItem('gamemode');
    localStorage.removeItem('pongGamestyle');

    navigateTo('/signin');
  });

  await renderLoggingInfo();
}

/*Changed*/