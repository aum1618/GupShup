import React, { useState, useCallback, useEffect, useContext } from 'react';
import { GiftedChat, } from 'react-native-gifted-chat';
import { set, onValue, ref, push,off } from 'firebase/database';
import { db } from '../../../Firebase';
import { AuthenticationContext } from '../../features/authentication/authenticationContext';
import { Wrapper } from '../../infrastructure/components/wrappper/wrapper';
import ChatScreenHeader from './ChatScreenHeader';
import styled from 'styled-components';
import { ProfilesContext } from '../../features/Profiles/ProfilesContext';


const Chat=styled(Wrapper)`
background-color: ${props=>props.theme.colors.bg.primary};
`;


export function ChatScreen({navigation,route}) {
  const {ChatId,chatName,number}=route.params
  const [messages, setMessages] = useState([]);
  const {user}=useContext(AuthenticationContext)
  const {profileUrls}=useContext(ProfilesContext)
  useEffect(() => {
    const messagesRef = ref(db, `${ChatId}`);
    const handleData = (snapshot) => {
      const messageList = [];
      snapshot.forEach(child => {
        messageList.push(child.val());
      });
      setMessages(messageList.reverse());
    };
    onValue(messagesRef, handleData);
  
    return () => {
      off(messagesRef, 'value', handleData);
    };
  }, []);
    
  const onSend = useCallback((messages = []) => {
    const newMessages = messages.map(message => {
      return {
        ...message,
        createdAt: message.createdAt.toISOString(),

      };
    });
    const messagesRef = ref(db, `${ChatId}`);
    newMessages.forEach(message => {
      const newMessageRef = push(messagesRef);
      set(newMessageRef, message);
    });
  }, []);
 
  return (
    <Chat>
      <ChatScreenHeader navigation={navigation} name={chatName} number={number} />
    <GiftedChat
      messages={messages}
      showUserAvatar={true}
      onSend={onSend}
      user={{
        _id: user.uid,
        avatar: profileUrls[user.phoneNumber],
        name:chatName
        
      }}
    />
    </Chat>
  );
}
