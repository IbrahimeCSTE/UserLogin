import React, { useState } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import "../Login/Login.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "500px",
    width: "500px",
    background: "#edafdf",
  },
};
Modal.setAppElement("#root");
const Login = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  var subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    invalid.invalidEmail = " ";
    invalid.invalidPass = " ";
    invalid.error = " ";
    invalid.succ = " ";
    invalid.logOut = " ";
  }
  const [newUser, setNewUser] = useState(false);
  const [invalid, setInvalid] = useState({
    IslogIn: false,
    invalidEmail: " ",
    invalidPass: " ",
    error: " ",
    succ: " ",
    logOut: " ",
  });
  const [user, setUser] = useState({
    fname: "",
    email: "",
    password: "",
    pic: " ",
  });
  const handleBlur = (e) => {
    let isValid = true;
    if (e.target.name === "fname") {
      isValid = true;
    }
    if (e.target.name === "lname") {
      isValid = true;
    }
    if (e.target.name === "email") {
      isValid = /\S+@\S+\.\S+/.test(e.target.value);
      invalid.invalidEmail = " ";
      if (!isValid) {
        const message = "email is invalid";
        const userInfo = { ...invalid };
        userInfo.invalidEmail = message;
        setInvalid(userInfo);
        console.log(invalid.invalidEmail);
      }
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isValid = isPasswordValid && passwordHasNumber;
      invalid.invalidPass = " ";
      if (!isValid) {
        const message = "Password must be > 5 charecter";
        const userInfo = { ...invalid };
        userInfo.invalidPass = message;
        setInvalid(userInfo);
      }
    }
    if (isValid) {
      const userInfo = { ...user };
      userInfo[e.target.name] = e.target.value;
      setUser(userInfo);
    }
  };

  const handleSubmit = (e) => {
    if (!newUser && user.email && user.password) {
      firebase.initializeApp(firebaseConfig);
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((result) => {
          const userInfo = { ...invalid };
          userInfo.error = " ";
          userInfo.succ = " Create succesfully";
          userInfo.IslogIn = true;
          setInvalid(userInfo);

          // ...
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          const userInfo = { ...invalid };
          userInfo.error = errorMessage;
          userInfo.succ = " ";
          userInfo.IslogIn = false;
          setInvalid(userInfo);

          // ..
        });
      setIsOpen(true);
    }
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const userInfo = { ...invalid };
          userInfo.error = " ";
          userInfo.succ = " Login succesfully";
          userInfo.IslogIn = true;
          setInvalid(userInfo);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          const userInfo = { ...invalid };
          userInfo.error = errorMessage;
          userInfo.succ = " ";
          userInfo.IslogIn = false;
          setInvalid(userInfo);
        });
      setIsOpen(true);
    }
    e.preventDefault();
  };
  const userSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const userInfo = { ...invalid };
        userInfo.error = " ";
        userInfo.logOut = "Log Out succesfully";
        userInfo.IslogIn = false;
        user.fname = " ";
        user.email = " ";
        user.pic = " ";
        userInfo.error = " ";
        userInfo.succ = " ";
        setInvalid(userInfo);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        const userInfo = { ...invalid };
        userInfo.error = errorMessage;
        userInfo.succ = " ";
        userInfo.IslogIn = true;
        setInvalid(userInfo);
      });
  };
  const handleGooleSignin = () => {
    firebase.initializeApp(firebaseConfig);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var userDetails = result.user;
        user.fname = userDetails.displayName;
        user.email = userDetails.email;
        user.pic = userDetails.photoURL;
        console.log(userDetails);
        const userInfo = { ...invalid };
        userInfo.error = " ";
        userInfo.succ = " Login succesfully";
        userInfo.IslogIn = true;
        setInvalid(userInfo);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        const userInfo = { ...invalid };
        userInfo.error = errorMessage;
        userInfo.succ = " ";
        userInfo.IslogIn = false;
        setInvalid(userInfo);
      });
  };
  const handleFacebookSignin = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.initializeApp(firebaseConfig);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var userDetails = result.user;
        user.fname = userDetails.displayName;
        user.email = userDetails.email;
        user.pic = userDetails.photoURL;
        const userInfo = { ...invalid };
        userInfo.error = " ";
        userInfo.succ = " Login succesfully";
        userInfo.IslogIn = true;
        setInvalid(userInfo);

        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        const userInfo = { ...invalid };
        userInfo.error = errorMessage;
        userInfo.succ = " ";
        userInfo.IslogIn = false;
        setInvalid(userInfo);

        // ...
      });
  };
  return (
    <div>
      {invalid.IslogIn ? <h3>Welcome:{user.fname}</h3> : " "}
      {invalid.IslogIn ? <img src={user.pic} alt="" /> : " "}
      <br />
      <br />

      {invalid.IslogIn ? (
        <button onClick={userSignOut}>Sign Out</button>
      ) : (
        <button onClick={openModal}>Sign in</button>
      )}
      <p>{invalid.logOut}</p>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Please Sign in</h2>
        <p style={{ color: "red" }}>{invalid.invalidEmail}</p>
        <p style={{ color: "red" }}>{invalid.invalidPass}</p>
        <input
          type="checkbox"
          name="checkbox"
          onClick={() => setNewUser(!newUser)}
        />
        <label for="vehicle1"> Have a account?</label>
        <br />
        <form onSubmit={handleSubmit} className="text-center">
          {newUser ? (
            " "
          ) : (
            <input
              style={{ border: "1px solid black", borderRadius: "10px" }}
              className="inputField w-50"
              type="text"
              name="fname"
              onBlur={handleBlur}
              placeholder="Enter Your Name"
              required
            />
          )}
          <br />
          <input
            style={{ border: "1px solid black", borderRadius: "10px" }}
            className="inputField w-50"
            type="email"
            name="email"
            onBlur={handleBlur}
            placeholder="Enter Your Email"
            required
          />
          <br />
          <input
            style={{ border: "1px solid black", borderRadius: "10px" }}
            className="inputField w-50"
            type="password"
            name="password"
            onBlur={handleBlur}
            placeholder="Enter Your Password"
            required
          />
          <br />
          <input
            className="btn btn-primary "
            type="submit"
            name="submit"
            value="submit"
          />
          <button className="btn btn-danger" onClick={closeModal}>
            Cancle
          </button>
          <p>{invalid.error}</p>
          <p>{invalid.succ}</p>
        </form>
        <button
          onClick={handleGooleSignin}
          className="signInGoogle mb-1"
          type="submit"
        >
          Sign in with google
        </button>
        <br />
        <button
          onClick={handleFacebookSignin}
          className="signInGoogle"
          type="submit"
        >
          Sign in with Facebook
        </button>
      </Modal>
    </div>
  );
};

export default Login;
