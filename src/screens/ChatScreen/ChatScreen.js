import React, { useState, useCallback, useEffect, useContext } from "react";
import { GiftedChat, InputToolbar, Send } from "react-native-gifted-chat";
import { set, onValue, ref, push, off } from "firebase/database";
import { db } from "../../../Firebase";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { Wrapper } from "../../infrastructure/components/wrappper/wrapper";
import ChatScreenHeader from "./ChatScreenHeader";
import styled from "styled-components";
import { ProfilesContext } from "../../features/Profiles/ProfilesContext";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

const Chat = styled(Wrapper)`
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

export function ChatScreen({ navigation, route }) {
  const { ChatId, chatName, number } = route.params;
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useContext(AuthenticationContext);
  const { profileUrls } = useContext(ProfilesContext);

  useEffect(() => {
    const messagesRef = ref(db, `${ChatId}`);
    const handleData = (snapshot) => {
      const messageList = [];
      snapshot.forEach((child) => {
        messageList.push(child.val());
      });
      setMessages(messageList.reverse());
    };
    onValue(messagesRef, handleData);

    return () => {
      off(messagesRef, "value", handleData);
    };
  }, []);

  useEffect(() => {
    const typingRef = ref(db, `typing/${ChatId}`);
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
  }, []);

  const updateTyping = async (typing) => {
    const typingRef = ref(db, `typing/${ChatId}`);
    if (typing) {
      await set(typingRef, { uid: user.uid });
    } else {
      await set(typingRef, null);
    }
  };

  const onInputTextChanged = (text) => {
    if (text.length > 0) {
      updateTyping(true);
    } else {
      updateTyping(false);
    }
  };

  const onSend = useCallback((messages = []) => {
    updateTyping(false);
    const newMessages = messages.map((message) => {
      return {
        ...message,
        createdAt: message.createdAt.toISOString(),
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
          avatar: profileUrls[user.phoneNumber],
          name: chatName,
        }}
        isTyping={isTyping}
      />
    </Chat>
  );
}
