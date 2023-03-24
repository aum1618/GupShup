import { addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, updateDoc } from "@firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { firestoreDb } from "../../../Firebase";
import { AuthenticationContext } from "../authentication/authenticationContext";

export const UserInfoContext = createContext();

export const UserInfoContextProvider = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthenticationContext);
  const [localUsers, setLocalUsers] = useState([]);
  // const [currentUser, setCurrentUser] = useState();

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
  

  const addNewConversation = async (number) => {
    const FriendId = localUsers.find(
      (localUser) => localUser.number === number
    );
    const currentUser=localUsers.find((localUser)=>localUser.number===user.phoneNumber)
    const userDocRef = doc(firestoreDb, "user", currentUser.docId);
    await updateDoc(userDocRef, {
      conversations: arrayUnion(`${currentUser.number}-${FriendId.number}`),
    })
      .then(() => console.log("added to my conversations"))
      .catch((e) => console.log(e));
    
      const FriendDocRef = doc(firestoreDb, "user", FriendId.docId);
      await updateDoc(FriendDocRef, {
        conversations: arrayUnion(`${currentUser.number}-${FriendId.number}`),
      })
        .then(() => console.log("added to friends conversations"))
        .catch((e) => console.log(e));

      return `${currentUser.number}-${FriendId.number}`
    
  };

  const addToFirestore = async (name) => {
    await addDoc(collection(firestoreDb, "user"), {
      name: name,
      userid: user.uid,
      number: user.phoneNumber,
      conversations: [],
      
    })
      .then(console.log("added to firestore"))
      .catch((e) => console.log(e));
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
