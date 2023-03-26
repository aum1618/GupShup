import { getDownloadURL, ref } from "@firebase/storage";
import { createContext, useEffect, useReducer, useCallback } from "react";
import { storage } from "../../../Firebase";

export const ProfilesContext = createContext();

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_URL":
      return { ...state, [action.number]: action.url };
    default:
      return state;
  }
}

export const ProfilesContextProvider = ({ children }) => {
  const [profileUrls, dispatch] = useReducer(reducer, initialState);

  const getChatUrl = useCallback(async (number) => {
    try {
      if (number in profileUrls) {
        // number already exists in profileUrls, return the existing URL
        return profileUrls[number];
      } else {
        // number doesn't exist in profileUrls, fetch the URL from Firebase Storage
        const url = await getDownloadURL(ref(storage, `${number}-photo`));

        // add the new URL to profileUrls and update state
        dispatch({ type: "ADD_URL", number, url });

        return url;
      }
    } catch (error) {
      console.error(error);
    }
  }, [profileUrls]);

  return (
    <ProfilesContext.Provider value={{ getChatUrl, profileUrls }}>
      {children}
    </ProfilesContext.Provider>
  );
};
