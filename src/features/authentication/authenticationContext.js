import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signOut,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { createContext, useEffect, useRef, useState } from "react";
import { auth } from "../../../Firebase";
import { appOptions } from "../../../Firebase";
export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fromLogin, setFromLogin] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const recaptchaVerifier = useRef(null);
  const firebaseConfig = appOptions;
  const [verificationId, setVerificationId] = useState();
  const [codeSent, setCodeSent] = useState(false);



  const onLogin = async (phoneNumber) => {
    try {
      setIsLoading(true);
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      console.log("Verification code has been sent to your phone.");
      setIsLoading(false);
      setCodeSent(true);
    } catch (err) {
      console.log(`Error: ${err}`);
      setIsLoading(false);
    }
  };

  const confirmCode = async (code) => {
    try {
      setIsLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      console.log("Phone authentication successful 👍");
      setCodeSent(false);
      setFromLogin(true)
      setIsLoading(false);
    } catch (err) {
      console.log(`Error: ${err}`);
      setIsLoading(false);
      setCodeSent(false);
    }
  };

  const setLoggedUser = async () => {
    try {
      const userValue = JSON.stringify(user);
      await AsyncStorage.setItem(`@loggedUser`, userValue);
      console.log(`log in user set!`);
    } catch (e) {
      console.log(e);
    }
  };

  const onLogout = () => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setUser(null);
        AsyncStorage.removeItem(`@loggedUser`);
        console.log("no user logged in!");
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setIsLoading(false);
      });
  };

  const getLoggedUser = async () => {
    try {
      setIsLoading(true);
      const JsonValue = await AsyncStorage.getItem(`@loggedUser`);
      if (JsonValue != null) {
        await setUser(JSON.parse(JsonValue));
        console.log(`user set`)
       !isPrevLoading && setIsLoading(false);
      } else setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLoggedUser();
  }, []);

  useEffect(() => {
    console.log(`user is ${user}`);
  }, [user]);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      setLoggedUser();
    }
  });

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        error,
        onLogin,
        confirmCode,
        onLogout,
        getLoggedUser,
        recaptchaVerifier,
        firebaseConfig,
        codeSent,
        fromLogin,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
