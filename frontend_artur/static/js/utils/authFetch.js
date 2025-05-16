// utils/authFetch.js
import { navigateTo } from "../index.js";

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    navigateTo("/signin");
    throw new Error("Missing auth token");
  }

  const isFormData = options.body instanceof FormData;
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };

  // Set default Content-Type for JSON if not a FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // 🛠 Fix: If JSON request has no body, set body = "{}"
  if (
    !isFormData &&
    headers["Content-Type"] === "application/json" &&
    (options.method === "POST" || options.method === "PUT") &&
    !options.body
  ) {
    options.body = JSON.stringify({});
  }

  console.log("authFetch sending:", {
    url,
    token: localStorage.getItem("auth_token"),
    headers
  });
  const response = await fetch(url, {
    ...options,
    headers
  });

    if (response.status === 401 || response.status === 403) {
    console.warn("authFetch: unauthorized request", url);
    if (!url.endsWith("/record_PvPong_match") &&
        !url.endsWith("/record_AIpong_match") &&
        !url.endsWith("/record_tournament")) {
      localStorage.removeItem("auth_token");
      navigateTo("/signin");
    }
    throw new Error("Unauthorized or 2FA not verified");
  }

  return response;
}

/*Changed*/