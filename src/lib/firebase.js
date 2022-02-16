import Firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

// here I want to import the seed file
// import { seedDatabase } from '../seed'

const config = {
  apiKey: 'AIzaSyBIhS5PIpIEcoyoY-uUQAJA35qIgzUGkEM',
  authDomain: 'instagram-clone-a8e53.firebaseapp.com',
  projectId: 'instagram-clone-a8e53',
  storageBucket: 'instagram-clone-a8e53.appspot.com',
  messagingSenderId: '526758550860',
  appId: '1:526758550860:web:b024e2f720cf72b27b83e9',
  measurementId: 'G-GY1H57F99X',
}

const firebase = Firebase.initializeApp(config)
const { FieldValue } = Firebase.firestore
const storage = Firebase.storage()

console.log('firebase', firebase)

// here is where I want to call seed file (ONLY once)
// seedDatabase(firebase)

export { firebase, FieldValue, storage }
