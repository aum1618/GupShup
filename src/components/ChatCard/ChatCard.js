import { View, Image } from "react-native";
import React from "react";
import { Card } from "react-native-paper";
import { Text } from "../../infrastructure/components/typography/Text";
import styled from "styled-components";
import ProfilePhoto from "./ProfilePhoto";

const Message = styled(Text)`
  color: ${(props) => props.theme.colors.text.secondary};
`;
const Chat = styled(Card)`
  background-color: transparent;
`;
const ChatContent = styled(Card.Content)`
  flex-direction: row;
  align-items: center;
  margin: 10px;
`;
export const Profile = styled(Image)`
  height: 64px;
  width: 64px;
  border-radius: 32px;
`;
const MessageView = styled(View)`
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
`;

export default function ChatCard({navigation,conversationId,name,lastConvo,time,number}) {
  
  
  
  return (

    <Chat mode="contained" onPress={()=>navigation.navigate("Chat",{ChatId:conversationId,chatName:name,number:number})} >
      <ChatContent>
        <ProfilePhoto number={number} size={64} />
        <MessageView>
          <Text variant="label">{name}</Text>
          <Message variant="body" numberOfLines={2}>
            {lastConvo}
          </Message>
        </MessageView>
        <View>
          <Message variant="caption">{time}</Message>
        </View>
      </ChatContent>
    </Chat>
  );
}
