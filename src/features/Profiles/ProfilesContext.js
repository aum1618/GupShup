import { getDownloadURL, ref } from "@firebase/storage";
import { createContext, useEffect, useState } from "react";
import { storage } from "../../../Firebase";

export const ProfilesContext = createContext();

export const ProfilesContextProvider = ({ children }) => {
  const [profileUrls, setProfileUrls] = useState({});
  const getChatUrl = async (number) => {
    try {
      if (number in profileUrls) {
        // number already exists in profileUrls, return the existing URL
        return profileUrls[number];
      } else {
        // number doesn't exist in profileUrls, fetch the URL from Firebase Storage
        console.log("hi")
        const url = await getDownloadURL(ref(storage, `${number}-photo`));
        console.log(url);
        
        // add the new URL to profileUrls and update state
        setProfileUrls(prevUrls => ({ ...prevUrls, [number]: url }));
        
        return url;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  useEffect(() => {
    console.log(profileUrls);
  }, [profileUrls]);

  return (
    <ProfilesContext.Provider value={{ getChatUrl,profileUrls }}>
      {children}
    </ProfilesContext.Provider>
  );
};
