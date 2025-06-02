// api.js

// In-memory cached Authorization header
let authHeader = null;

// Utility: Base64 encode username:password for Basic Auth
function encodeBasicAuth(username, password) {
  return 'Basic ' + btoa(`${username}:${password}`);
}

// Utility: Attach Authorization header if logged in
function getAuthHeaders() {
  return authHeader ? { Authorization: authHeader } : {};
}

// Public: Sign up a new user (optional password)
export async function signUp(username, email, password) {
  const body = { username, email };
  if (password) {
    body.password = password;
  }

  const response = await fetch('/api/buyers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// Public: Log in with credentials and cache the auth header
export async function login(username, password) {
  const tempHeader = encodeBasicAuth(username, password);

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: tempHeader
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  authHeader = tempHeader;
  return await response.json(); // buyer info
}

// Public: Check if user is logged in (header cached)
export function isLoggedIn() {
  return !!authHeader;
}

// Public: Log out (clear cached credentials)
export function logout() {
  authHeader = null;
}

// Protected: Fetch all buyers (requires auth)
export async function getAllBuyers() {
  const response = await fetch('/api/buyers', {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// Protected: Get currently authenticated user from /auth/me
export async function getCurrentUser() {
  if (!authHeader) return null;

  const response = await fetch('/api/auth/me', {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (response.ok) {
    return await response.json();
  }

  if (response.status === 401) {
    logout(); // Credentials expired or invalid
    return null;
  }

  throw new Error(await response.text());
}
