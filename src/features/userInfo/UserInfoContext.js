import { addDoc, arrayUnion, batch, collection, doc, getDocs, onSnapshot, updateDoc } from "@firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { firestoreDb } from "../../../Firebase";
import { AuthenticationContext } from "../authentication/authenticationContext";

export const UserInfoContext = createContext();

export const UserInfoContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthenticationContext);
  const [localUsers, setLocalUsers] = useState([]);

  const getFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(firestoreDb, "user"));
    const newLocalUsers = [];
    querySnapshot.forEach((doc) => {
      newLocalUsers.push({...doc.data(),docId:doc.id});
    });
    setLocalUsers(newLocalUsers);
  };
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestoreDb, "user"), (snapshot) => {
      const newLocalUsers = [];
      snapshot.forEach((doc) => {
        newLocalUsers.push({...doc.data(),docId:doc.id});
      });
      setLocalUsers(newLocalUsers);
    });
  
    return () => unsubscribe();
  }, []);
  

  const addNewConversation = async (friend, currentUserId) => {
    const currentUser = localUsers.find((localUser) => localUser.number === currentUserId);
    const batchedWrite = batch();
    const currentUserDocRef = doc(firestoreDb, "user", currentUser.docId);
    batchedWrite.update(currentUserDocRef, {
      conversations: arrayUnion(`${currentUser.number}-${friend.number}`),
    });
    const friendDocRef = doc(firestoreDb, "user", friend.docId);
    batchedWrite.update(friendDocRef, {
      conversations: arrayUnion(`${currentUser.number}-${friend.number}`),
    });
    await batchedWrite.commit();
    return `${currentUser.number}-${friend.number}`;
  };

  const addToFirestore = async (name) => {
    await addDoc(collection(firestoreDb, "user"), {
      name: name,
      userid: user.uid,
      number: user.phoneNumber,
      conversations: [],
    }).catch((e) => console.log(e));
  };

  return (
    <UserInfoContext.Provider
      value={{
        getFromFirestore,
        localUsers,
        addToFirestore,
        addNewConversation,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};
