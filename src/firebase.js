import * as firebase from 'firebase';

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyAZvRZByBAybY9Mb3OxPTSM0Li95hHLVLQ",
    authDomain: "twain-e5fab.firebaseapp.com",
    databaseURL: "https://twain-e5fab.firebaseio.com",
    projectId: "twain-e5fab",
    storageBucket: "twain-e5fab.appspot.com",
    messagingSenderId: "655665196659"
  };

  export const firebaseApp = firebase.initializeApp(config);