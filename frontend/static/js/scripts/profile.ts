
//@ts-ignore
import { navigateTo, BASE_URL } from "../index.js";

export async function profile(): Promise<void> {
  /* ---------------- inner helpers ---------------- */
  async function renderLoggingInfo(): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/profile`);

    // Not logged in ➜ redirect
    if (response.status !== 200) {
      navigateTo('/signin');
      return;
    }

    const { user } = await response.json();
    localStorage.setItem('user_id', user.id);

    (document.getElementById('username-name') as HTMLElement).innerText = user.username;
    (document.getElementById('username-email') as HTMLElement).innerText = user.email;

    const avatarElem = document.getElementById('avatar') as HTMLImageElement;
    const avatarResp = await fetch(`${BASE_URL}/api/user_avatar`);
    if (avatarResp.status !== 200) {
      avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
    } else {
      const blob = await avatarResp.blob();
      avatarElem.src = URL.createObjectURL(blob);
    }

    (document.getElementById('profile-page') as HTMLElement).style.display = 'flex';
  }

  /* ---------------- logout button ---------------- */
  const logoutButton = document.getElementById('logout-button') as HTMLButtonElement;
  logoutButton.addEventListener('click', async () => {
    await fetch(`${BASE_URL}/api/logout`, { method: 'POST' });

    [
      'user_id', 'pacmanSkin', 'ghostSkin', 'pacmanGamemode', 'mapName',
      'pacmanKeybinds', 'pacmanTheme', 'themeName', 'pacmanUsernames',
      'pongColors', 'pongUsernames', 'pongKeybinds', 'gamemode', 'pongGamestyle'
    ].forEach(key => localStorage.removeItem(key));

    navigateTo('/signin');
  });

  await renderLoggingInfo();
}
