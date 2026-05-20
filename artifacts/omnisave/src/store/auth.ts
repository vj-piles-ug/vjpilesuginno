import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { ref as dbRef, set, get } from 'firebase/database'
import { auth, db } from '../lib/firebase'

const ADMIN_EMAIL = 'okotstephen57@gmail.com'

export const currentUser = ref<User | null>(null)
export const authLoading = ref(true)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  authLoading.value = false
})

export const isAdmin = computed(() => currentUser.value?.email === ADMIN_EMAIL)
export const isLoggedIn = computed(() => !!currentUser.value)

export async function signInEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  await updateLastLogin(cred.user.uid)
  return cred
}

export async function signUpEmail(email: string, password: string, name: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await set(dbRef(db, `users/${cred.user.uid}`), {
    name: name || email.split('@')[0],
    email,
    joinedAt: new Date().toISOString().slice(0, 10),
  })
  return cred
}

export async function signInGoogle() {
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  const snap = await get(dbRef(db, `users/${cred.user.uid}`))
  if (!snap.exists()) {
    await set(dbRef(db, `users/${cred.user.uid}`), {
      name: cred.user.displayName || cred.user.email?.split('@')[0] || 'User',
      email: cred.user.email || '',
      joinedAt: new Date().toISOString().slice(0, 10),
    })
  } else {
    await updateLastLogin(cred.user.uid)
  }
  return cred
}

export async function logOut() {
  return signOut(auth)
}

async function updateLastLogin(uid: string) {
  try {
    const snap = await get(dbRef(db, `users/${uid}`))
    if (snap.exists()) {
      await set(dbRef(db, `users/${uid}/lastLogin`), new Date().toISOString().slice(0, 10))
    }
  } catch (_) {}
}

export function useAuth() {
  return { currentUser, isAdmin, isLoggedIn, authLoading, signInEmail, signUpEmail, signInGoogle, logOut }
}
