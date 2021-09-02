
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.fonfig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
  })
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handelSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signInUser = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        }
        setUser(signInUser);
        console.log(displayName, photoURL, email);
      })

      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }

  const handelSingOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false,
        }
        setUser(signOutUser);
      })

      .catch(err => {

      })

  }

  const hadelFbSignIn = () => {
    firebase
    .auth()
    .signInWithPopup(fbProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
  
      // The signed-in user info.
      const user = result.user;
  
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var accessToken = credential.accessToken;
      
     console.log('fb after sign in', user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
  
      // ...
    });
  }

  const handelBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPassWordValid = e.target.value.length > 6;
      const isHasPasswordNunber = /\d{1}/.test(e.target.value);
      isFieldValid = isPassWordValid && isHasPasswordNunber;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handelSubmit = (e) => {
    console.log(user.email, user.password);
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)

        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch(error => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);

        });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info', res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    const updateUserName = name => {
      const user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: name,

      }).then(res => {
        console.log('User Updated Successfully');
        // ...
      }).catch((error) => {
        console.log(error);
        // ...
      });
    }

    e.preventDefault();
  }




  return (
    <div className="App">
      {user.isSignIn ? <button onClick={handelSingOut}>Sign Out</button> :
        <button onClick={handelSignIn}>Sign In</button>
      }
      <br />
      <button onClick={hadelFbSignIn}>SignIn with facebook</button>
      {
        user.isSignIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handelSubmit}>
        {
          newUser && <input type="text" onBlur={handelBlur} name="name" placeholder="Enter Your Name" />
        }
        <br />
        <input type="text" onBlur={handelBlur} name="email" placeholder="Enter Your Email Address" required />
        <br />
        <input type="password" name="password" onBlur={handelBlur} id="" placeholder="Enter Your PassWord" required />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'log in'} successfully</p>
      }
    </div>
  );
}

export default App;
