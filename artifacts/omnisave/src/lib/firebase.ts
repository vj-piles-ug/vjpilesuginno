import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyBsz3RyI6H9M70i-qG6HOAuvnyup_oOaaI',
  authDomain: 'vj-pilesug.firebaseapp.com',
  databaseURL: 'https://vj-pilesug-default-rtdb.firebaseio.com',
  projectId: 'vj-pilesug',
  storageBucket: 'vj-pilesug.appspot.com',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getDatabase(firebaseApp)
