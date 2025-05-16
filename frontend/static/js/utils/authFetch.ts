// utils/authFetch.ts
import { navigateTo } from "../index.js";

// ✅ Interface: Omit `body` from RequestInit and re-declare it to avoid conflicts
interface AuthFetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, any> | null;
}

export async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    navigateTo("/signin");
    throw new Error("Missing auth token");
  }

  const isFormData = options.body instanceof FormData;

  // ✅ Initialize Headers correctly
  const headers: Headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  // ✅ Set default Content-Type for JSON if not a FormData
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // ✅ Handle body transformation correctly
  if (
    !isFormData &&
    headers.get("Content-Type") === "application/json" &&
    (options.method === "POST" || options.method === "PUT")
  ) {
    if (options.body && typeof options.body === "object") {
      options.body = JSON.stringify(options.body);
    } else if (!options.body) {
      options.body = JSON.stringify({});
    }
  }

  // ✅ Safer headers logging (no `.entries()`)
  const headersObj: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  console.log("authFetch sending:", {
    url,
    token: localStorage.getItem("auth_token"),
    headers: headersObj
  });

  try {
    // ✅ Remove `Record<string, any>` from body if it exists
    const requestInit: RequestInit = {
      ...options,
      headers,
      body: options.body instanceof FormData ? options.body : options.body ? String(options.body) : null
    };

    const response = await fetch(url, requestInit);

    if (response.status === 401 || response.status === 403) {
      console.warn("authFetch: unauthorized request", url);
      if (
        !url.endsWith("/record_PvPong_match") &&
        !url.endsWith("/record_AIpong_match") &&
        !url.endsWith("/record_tournament")
      ) {
        localStorage.removeItem("auth_token");
        navigateTo("/signin");
      }
      throw new Error("Unauthorized or 2FA not verified");
    }

    return response;
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
}
///??