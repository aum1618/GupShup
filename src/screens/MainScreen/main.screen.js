import { ScrollView, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "../../infrastructure/components/typography/Text";
import styled from "styled-components";
import ChatCard from "../../components/ChatCard/ChatCard";
import { IconButton } from "react-native-paper";
import { UserInfoContext } from "../../features/userInfo/UserInfoContext";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { child, get, onValue, ref } from "@firebase/database";
import { db } from "../../../Firebase";
import moment from "moment/moment";
import { ProfilesContext } from "../../features/Profiles/ProfilesContext";

const Header = styled(View)`
  height: 15%;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 25px;
  padding-right: 25px;
  background-color: ${(props) => props.theme.colors.bg.secondary};
`;

const Body = styled(View)`
  width: 100%;
  background-color: ${(props) => props.theme.colors.bg.primary};
  height: 85%;
`;

export default function MainScreen({ navigation }) {
  const { localUsers } = useContext(UserInfoContext);
  const { user, onLogout } = useContext(AuthenticationContext);
  const [chats, setChats] = useState([]);
  const {getChatUrl}=useContext(ProfilesContext)

  const currentUser = localUsers.find(
    (localUser) => localUser.number === user.phoneNumber
  );

  const getChat = (conversation) => {
    console.log(conversation);
    const [number1, number2] = conversation.split("-");
    const otherNumber = number1 === user.phoneNumber ? number2 : number1;
    console.log(otherNumber);
    const otherUser = localUsers.find(
      (localUser) => localUser.number === otherNumber
    );
    const lastMessage = getLastConvo(conversation);
    const formattedTime = moment(lastMessage.createdAt).format("HH:mm");
    const chat = {
      name: otherUser.name,
      conversation,
      lastConvo: lastMessage.text,
      time: formattedTime,
      number:otherUser.number
    };
    return chat;
  };
  
  const getLastConvo = (conversation) => {
    let lastMessage = { text: "" };
    const messagesRef = ref(db, conversation);
    const handleData = (snapshot) => {
      const messageList = [];
      snapshot.forEach((child) => {
        messageList.push(child.val());
      });
  
      if (messageList.length > 0) {
        lastMessage = messageList.reverse()[0];
        setChats((prevChats) => {
          const newChats = [...prevChats];
          const chatIndex = newChats.findIndex(
            (chat) => chat.conversation === conversation
          );
          newChats[chatIndex] = {
            ...newChats[chatIndex],
            lastConvo: lastMessage.text,
            time: moment(lastMessage.createdAt).format("HH:mm"),
          };
          return newChats;
        });
      }
    };
    onValue(messagesRef, handleData);
  
    return lastMessage;
  };
  
  
  useEffect(() => {
    if (currentUser) {
      getChatUrl(user.phoneNumber)
      const newChats = currentUser.conversations.map((conversation) => {
        return getChat(conversation);
      });
      setChats(newChats);

    }
  }, [localUsers, currentUser]);

  useEffect(()=>{
      chats.forEach((chat)=>{
        getChatUrl(chat.number)
      })
  },[chats])

  

  return (
    <>
      <Header>
        <Text variant="title">GupShup</Text>
        <IconButton
          icon="dots-vertical"
          iconColor="white"
          size={32}
          onPress={onLogout}
        />
      </Header>
      <Body>
        <ScrollView>
          {chats.map((chat, id) => {
            return (
              <ChatCard
                key={id}
                navigation={navigation}
                conversationId={chat.conversation}
                name={chat.name}
                lastConvo={chat.lastConvo}
                time={chat.time}
                number={chat.number}
              />
            );
          })}
        </ScrollView>
        <IconButton
          icon="chat"
          mode="contained"
          onPress={() => navigation.navigate("NewChat")}
          size={40}
          style={{ position: "absolute", bottom: 50, right: 50, zIndex: 200 }}
        />
      </Body>
    </>
  );
}