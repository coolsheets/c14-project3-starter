const AUTH_KEY = 'auth_header_seller';

function getAuthHeader() {
  return localStorage.getItem(AUTH_KEY);
}

async function authGet(url, options = {}) {
  const auth = getAuthHeader();
  const headers = {
    ...options.headers,
    ...(auth ? { Authorization: auth } : {}),
  };
  const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

async function authPost(url, body, options = {}) {
  const auth = getAuthHeader();
  const headers = {
    ...options.headers,
    ...(auth ? { Authorization: auth } : {}),
    "Content-Type": "application/json"
  };

  const postOptions = {
    method: "post",
    body: JSON.stringify(body)
  }

  const response = await fetch(url, { ...postOptions, ...options, headers });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

// Signup — no auth required
export async function signUp(username, email, password) {
  const response = await fetch('/api/sellers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
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

  const response = await fetch('/api/auth/loginSeller', {
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
  return await authGet('/api/auth/me');
}

// Authenticated fetches
export async function getMyListings() {
  return await authGet('/api/listings/mine');
}

export async function getAllListings() {
  return await authGet('/api/listings');
}

export async function createListing(details) {
  return await authPost('/api/listings', details)
}