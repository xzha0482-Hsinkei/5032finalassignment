// src/composables/useAuth.js
import { ref, computed } from 'vue'

const USERS_KEY = 'auth_users'
const CURRENT_KEY = 'auth_current_user'

const users = ref(JSON.parse(localStorage.getItem(USERS_KEY) || '[]'))
const currentUser = ref(JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'))

function persist() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users.value))
  localStorage.setItem(CURRENT_KEY, JSON.stringify(currentUser.value))
}

// --- 工具函数 ---
async function sha256(text) {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// --- 默认管理员 ---
const FALLBACK_ADMIN = { 
  email: 'admin@nfp.local', 
  password: 'Admin123!', 
  role: 'admin' 
}

// --- Firebase 可选支持 ---
const useFirebase = import.meta.env.VITE_USE_FIREBASE === 'true'
let firebaseAuth = null
let firebaseFns = {}

if (useFirebase) {
  const { auth } = await import('@/firebaseConfig')
  const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } = await import('firebase/auth')
  firebaseAuth = auth
  firebaseFns = { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
  console.log('[Auth] ✅ Firebase 模式启用')
} else {
  console.log('[Auth] ✅ 本地 LocalStorage 模式启用')
}

// --- 注册 ---
export async function register({ email, password, role = 'user' }) {
  email = email.trim().toLowerCase()
  if (!email || !password) throw new Error('Email and password are required')

  if (useFirebase) {
    const { createUserWithEmailAndPassword } = firebaseFns
    const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    currentUser.value = { email: userCred.user.email, uid: userCred.user.uid, role }
    persist()
    return
  }

  if (users.value.some(u => u.email === email)) throw new Error('Email already registered')
  const passwordHash = await sha256(password)

  // ✅ 管理员邮箱规则：凡是 @nfp.local 结尾，自动视为 admin
  const roleFinal = email.endsWith('@nfp.local') ? 'admin' : role

  users.value.push({
    id: crypto.randomUUID(),
    email,
    passwordHash,
    role: roleFinal,
    createdAt: new Date().toISOString(),
  })
  persist()
}

// --- 登录 ---
export async function login(email, password) {
  email = email.trim().toLowerCase()

  if (useFirebase) {
    const { signInWithEmailAndPassword } = firebaseFns
    const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password)
    currentUser.value = { email: userCred.user.email, uid: userCred.user.uid, role: 'user' }
    persist()
    return
  }

  const passwordHash = await sha256(password)

  // ✅ fallback 管理员账号
  if (!users.value.length && email === FALLBACK_ADMIN.email && password === FALLBACK_ADMIN.password) {
    currentUser.value = { id: 'fallback-admin', email, role: 'admin' }
    persist()
    return
  }

  const user = users.value.find(u => u.email === email && u.passwordHash === passwordHash)
  if (!user) throw new Error('Invalid credentials')

  currentUser.value = { id: user.id, email: user.email, role: user.role }

  // ✅ 登录后再次强制识别管理员邮箱
  if (email === FALLBACK_ADMIN.email || email.endsWith('@nfp.local')) {
    currentUser.value.role = 'admin'
  }

  persist()
}

// --- 登出 ---
export async function logout() {
  if (useFirebase) {
    const { signOut } = firebaseFns
    await signOut(firebaseAuth)
    currentUser.value = null
    return
  }
  currentUser.value = null
  persist()
}

// --- Firebase 监听登录状态 ---
if (useFirebase) {
  const { onAuthStateChanged } = firebaseFns
  onAuthStateChanged(firebaseAuth, user => {
    currentUser.value = user
      ? { email: user.email, uid: user.uid, role: 'user' }
      : null
  })
}

// --- 导出状态 ---
export const useCurrentUser = () => currentUser
export const isAuthenticated = computed(() => !!currentUser.value)
export const hasRole = roles =>
  computed(() => !!currentUser.value && [].concat(roles).includes(currentUser.value.role))
