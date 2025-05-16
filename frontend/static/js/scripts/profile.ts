
// //@ts-ignore
// import { navigateTo, BASE_URL } from "../index.js";

// export async function profile(): Promise<void> {
//   /* ---------------- inner helpers ---------------- */
//   async function renderLoggingInfo(): Promise<void> {
//     const response = await fetch(`${BASE_URL}/api/profile`);

//     // Not logged in ➜ redirect
//     if (response.status !== 200) {
//       navigateTo('/signin');
//       return;
//     }

//     const { user } = await response.json();
//     localStorage.setItem('user_id', user.id);

//     (document.getElementById('username-name') as HTMLElement).innerText = user.username;
//     (document.getElementById('username-email') as HTMLElement).innerText = user.email;

//     const avatarElem = document.getElementById('avatar') as HTMLImageElement;
//     const avatarResp = await fetch(`${BASE_URL}/api/user_avatar`);
//     if (avatarResp.status !== 200) {
//       avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
//     } else {
//       const blob = await avatarResp.blob();
//       avatarElem.src = URL.createObjectURL(blob);
//     }

//     (document.getElementById('profile-page') as HTMLElement).style.display = 'flex';
//   }

//   /* ---------------- logout button ---------------- */
//   const logoutButton = document.getElementById('logout-button') as HTMLButtonElement;
//   logoutButton.addEventListener('click', async () => {
//     await fetch(`${BASE_URL}/api/logout`, { method: 'POST' });

//     [
//       'user_id', 'pacmanSkin', 'ghostSkin', 'pacmanGamemode', 'mapName',
//       'pacmanKeybinds', 'pacmanTheme', 'themeName', 'pacmanUsernames',
//       'pongColors', 'pongUsernames', 'pongKeybinds', 'gamemode', 'pongGamestyle'
//     ].forEach(key => localStorage.removeItem(key));

//     navigateTo('/signin');
//   });

//   await renderLoggingInfo();
// }

import { navigateTo } from "../index.js";
import { BASE_URL } from "../index.js";
import { authFetch } from "../utils/authFetch.js";

export async function profile(): Promise<void> {
  
  // Function to render the user's profile information
  async function renderLoggingInfo(): Promise<void> {
    const token = localStorage.getItem("auth_token");

    // If there is no token, navigate to sign in
    if (!token) {
      navigateTo('/signin');
      return;
    }

    // Fetch user profile data
    const response = await fetch(`${BASE_URL}/api/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    // If the request is not successful, redirect to signin
    if (response.status !== 200) {
      navigateTo('/signin');
      return;
    }

    // Parse the response and store user data
    const responseData = await response.json();
    const user = responseData.user;

    // Store the user ID in localStorage
    localStorage.setItem('user_id', user.id);

    // Populate the DOM elements with the user's information
    const usernameElem = document.getElementById('username-name') as HTMLElement;
    if (usernameElem) {
      usernameElem.innerText = user.username;
    }

    const emailElem = document.getElementById('username-email') as HTMLElement;
    if (emailElem) {
      emailElem.innerText = user.email;
    }

    const avatarElem = document.getElementById('avatar') as HTMLImageElement;
    if (avatarElem) {
      // Fetch the user's avatar
      const responseAvatar = await authFetch(`${BASE_URL}/api/user_avatar`);

      if (responseAvatar.status !== 200) {
        avatarElem.src = 'static/assets/images/profile_pic_transparent.png';
      } else {
        const blob = await responseAvatar.blob();
        const url = URL.createObjectURL(blob);
        avatarElem.src = url;
      }
    }

    // Display the profile page
    const profilePage = document.getElementById('profile-page') as HTMLElement;
    if (profilePage) {
      profilePage.style.display = 'flex';
    }
  }

  /**
   * Logout Functionality
   */
  const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;

  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      // Perform logout with `authFetch`
      await authFetch(`${BASE_URL}/api/logout`, { method: 'POST' });

      // Remove all relevant local storage items
      const keysToRemove = [
        'auth_token', 'user_id', 'pacmanSkin', 'ghostSkin',
        'pacmanGamemode', 'mapName', 'pacmanKeybinds',
        'pacmanTheme', 'themeName', 'pacmanUsernames',
        'pongColors', 'pongUsernames', 'pongKeybinds',
        'gamemode', 'pongGamestyle'
      ];

      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Navigate back to sign-in page
      navigateTo('/signin');
    });
  }

  // Render user information
  await renderLoggingInfo();
}
