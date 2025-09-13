import { ref, computed } from 'vue';

const USERS_KEY = 'auth_users';
const CURRENT_KEY = 'auth_current_user';

const users = ref(JSON.parse(localStorage.getItem(USERS_KEY) || '[]'));
const currentUser = ref(JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'));

function persist() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users.value));
  localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser.value));
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// Basic demo fallback admin (if no users yet)
const FALLBACK_ADMIN = { email: 'admin@nfp.local', password: 'Admin123!', role: 'admin' };

export async function register({ email, password, role = 'user' }) {
  email = email.trim().toLowerCase();
  if (!email || !password) throw new Error('Email and password are required');
  if (users.value.some(u => u.email === email)) throw new Error('Email already registered');
  const passwordHash = await sha256(password);
  users.value.push({ id: crypto.randomUUID(), email, passwordHash, role, createdAt: new Date().toISOString() });
  persist();
}

export async function login(email, password) {
  email = email.trim().toLowerCase();
  const passwordHash = await sha256(password);

  // Fallback admin if no users exist
  if (!users.value.length && email === FALLBACK_ADMIN.email && password === FALLBACK_ADMIN.password) {
    currentUser.value = { id: 'fallback-admin', email, role: 'admin' };
    persist();
    return;
  }

  const user = users.value.find(u => u.email === email && u.passwordHash === passwordHash);
  if (!user) throw new Error('Invalid credentials');
  currentUser.value = { id: user.id, email: user.email, role: user.role };
  persist();
}

export function logout() { currentUser.value = null; persist(); }

export const useCurrentUser = () => currentUser;
export const isAuthenticated = computed(() => !!currentUser.value);
export const hasRole = roles =>
  computed(() => !!currentUser.value && [].concat(roles).includes(currentUser.value.role));
