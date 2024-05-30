
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
  import { getAuth, deleteUser, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, reauthenticateWithCredential,EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
  import { getDatabase, ref, set, push, get, update, onValue, child, remove,  query, orderByChild, equalTo  } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
  const firebaseConfig = {
    apiKey: "AIzaSyA3iGBy39CyPpI66vB-9ZQ34EJS46gA2ug",
    authDomain: "agrigear-bu.firebaseapp.com",
    databaseURL: "https://agrigear-bu-default-rtdb.firebaseio.com",
    projectId: "agrigear-bu",
    storageBucket: "agrigear-bu.appspot.com",
    messagingSenderId: "674643452707",
    appId: "1:674643452707:web:2b0552252f75af397ce296"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  
  export {deleteUser, auth, app, database, ref, get, query, orderByChild, equalTo,push,set,child,update, remove, reauthenticateWithCredential,EmailAuthProvider,updatePassword };


 
