// Firebase en "modo compat": usamos el paquete de npm en vez de los <script> del CDN,
// pero mantenemos exactamente la misma forma de escribir (db.ref('x').on('value', cb)),
// así no hay que tocar ni una línea del resto del código.
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyAJFH_-n3TyLG4T9wdh3M2M0wpFGlvyj-w",
  authDomain: "blanqueriamya.firebaseapp.com",
  databaseURL: "https://blanqueriamya-default-rtdb.firebaseio.com",
  projectId: "blanqueriamya",
  storageBucket: "blanqueriamya.firebasestorage.app",
  messagingSenderId: "279094291275",
  appId: "1:279094291275:web:676e69949d1d31c89e16ce"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.database();
