import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBsz3RyI6H9M70i-qG6HOAuvnyup_oOaaI",
  authDomain: "vj-pilesug.firebaseapp.com",
  databaseURL: "https://vj-pilesug-default-rtdb.firebaseio.com",
  projectId: "vj-pilesug",
  storageBucket: "vj-pilesug.firebasestorage.app",
  messagingSenderId: "916407856446",
  appId: "1:916407856446:web:0df28d7255061b7ee1906f",
  measurementId: "G-P73D3NMZCN",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)
export const database = db
export const storage = getStorage(app)
