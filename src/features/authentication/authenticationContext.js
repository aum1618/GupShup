import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signOut,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth } from "../../../Firebase";
import { appOptions } from "../../../Firebase";
export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fromLogin, setFromLogin] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const recaptchaVerifier = useRef(null);
  const firebaseConfig = appOptions;
  const [verificationId, setVerificationId] = useState(null);
  const [codeSent, setCodeSent] = useState(false);

  const onLogin = useCallback(async (phoneNumber) => {
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
      console.error(`Error: ${err}`);
      setIsLoading(false);
    }
  }, []);

  const confirmCode = useCallback(async (code) => {
    try {
      setIsLoading(true);
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      console.log("Phone authentication successful 👍");
      setCodeSent(false);
      setFromLogin(true);
      setIsLoading(false);
    } catch (err) {
      console.error(`Error: ${err}`);
      setIsLoading(false);
      setCodeSent(false);
    }
  }, [verificationId]);

  const setLoggedUser = useCallback(async () => {
    try {
      const userValue = JSON.stringify(user);
      await AsyncStorage.setItem('@loggedUser', userValue);
      console.log('Logged in user set!');
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const onLogout = useCallback(() => {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        setUser(null);
        AsyncStorage.removeItem('@loggedUser');
        console.log('No user logged in!');
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  const getLoggedUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem('@loggedUser');
      if (jsonValue != null) {
        setUser(JSON.parse(jsonValue));
        console.log('User set.');
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLoggedUser();
  }, [getLoggedUser]);

  useEffect(() => {
    console.log(`User is ${user?.email}`);
  }, [user]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      setLoggedUser();
    }
  });

  const authContextValue = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <AuthenticationContext.Provider value={authContextValue}>
      {children}
    </AuthenticationContext.Provider>

  );
};
