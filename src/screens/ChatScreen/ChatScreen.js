import React, { useState, useCallback, useEffect, useContext, useMemo } from "react";
import { GiftedChat,} from "react-native-gifted-chat";
import { set, onValue, ref, push, off } from "firebase/database";
import { db } from "../../../Firebase";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { Wrapper } from "../../infrastructure/components/wrappper/wrapper";
import ChatScreenHeader from "./ChatScreenHeader";
import styled from "styled-components";
import { ProfilesContext } from "../../features/Profiles/ProfilesContext";

const Chat = styled(Wrapper)`
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

export function ChatScreen({ navigation, route }) {
  const { ChatId, chatName, number } = route.params;
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useContext(AuthenticationContext);
  const { profileUrls } = useContext(ProfilesContext);

  const messagesRef = useMemo(() => ref(db, `${ChatId}`), [ChatId]);
const typingRef = useMemo(() => ref(db, `typing/${ChatId}`), [ChatId]);

useEffect(() => {
  const handleData = (snapshot) => {
    const messageList = [];
    snapshot.forEach((child) => {
      if(child.val().user._id !== user.uid){
        const messageRef = ref(db, `${ChatId}/${child.key}`);
        set(messageRef, { ...child.val(), received: true });
      }
      messageList.push(child.val());
    });
    setMessages(messageList.reverse());
  };
  onValue(messagesRef, handleData);

  return () => {
    off(messagesRef, "value", handleData);
  };
}, [messagesRef, user.uid]);

useEffect(() => {
  const handleTyping = (snapshot) => {
    if (snapshot.val() && snapshot.val().uid !== user.uid) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };
  onValue(typingRef, handleTyping);

  return () => {
    off(typingRef, "value", handleTyping);
  };
}, [typingRef, user.uid]);


const updateTyping = useCallback(async (typing) => {
  if (typing) {
    await set(typingRef, { uid: user.uid });
  } else {
    await set(typingRef, null);
  }
}, [typingRef, user.uid]);

const onInputTextChanged = useCallback((text) => {
  if (text.length > 0) {
    updateTyping(true);
  } else {
    updateTyping(false);
  }
}, [updateTyping]);

  const onSend = useCallback((messages = []) => {
    updateTyping(false);
    const newMessages = messages.map((message) => {
      return {
        ...message,
        createdAt: message.createdAt.toISOString(),
        sent:true,
        received:false,
      };
    });
    const messagesRef = ref(db, `${ChatId}`);
    newMessages.forEach((message) => {
      const newMessageRef = push(messagesRef);
      set(newMessageRef, message);
    });
  }, []);

  return (
    <Chat>
      <ChatScreenHeader
        navigation={navigation}
        name={chatName}
        number={number}
      />
      <GiftedChat
        messages={messages}
        showUserAvatar={true}
        onSend={onSend}
        onInputTextChanged={onInputTextChanged}
        user={{
          _id: user.uid,
          avatar: profileUrls[user.phoneNumber] ? profileUrls[user.phoneNumber] : require("../../mockdata/profile.avif"),
          name: chatName,
        }}
        isTyping={isTyping}
      />
    </Chat>
  );
}