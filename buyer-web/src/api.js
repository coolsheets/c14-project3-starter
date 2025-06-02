const AUTH_KEY = 'auth_header';

// Helper: get stored Authorization header
function getAuthHeader() {
  return localStorage.getItem(AUTH_KEY);
}

// Helper: build fetch options with auth
function authFetch(url, options = {}) {
  const auth = getAuthHeader();
  const headers = {
    ...options.headers,
    ...(auth ? { Authorization: auth } : {}),
  };
  return fetch(url, { ...options, headers });
}

// Signup — no auth required
export async function signUp(username, email) {
  const response = await fetch('/api/buyers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// Login — test credentials and store header
export async function login(username, password) {
  const encoded = btoa(`${username}:${password}`);
  const auth = `Basic ${encoded}`;
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const user = await response.json();
  localStorage.setItem(AUTH_KEY, auth);
  return user;
}

// Logout — just clear localStorage
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// Get current user if logged in
export async function getCurrentUser() {
  const response = await authFetch('/api/auth/me');
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

// Authenticated fetches
export async function getAllBuyers() {
  const response = await authFetch('/api/buyers');
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}
