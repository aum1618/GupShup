import { Card } from "react-native-paper";
import React from "react";
import styled from "styled-components/native";
import { Text } from "../../infrastructure/components/typography/Text";
import ProfilePhoto from "./ProfilePhoto";
import { View } from "react-native";

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
export const Profile = styled.Image`
  height: 64px;
  width: 64px;
  border-radius: 32px;
`;
const MessageView = styled(View)`
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
`;

function ChatCard({ navigation, conversationId, name, lastConvo, time, number }) {
  const handlePress = React.useCallback(() => {
    navigation.navigate("Chat", { ChatId: conversationId, chatName: name, number: number });
  }, [navigation, conversationId, name, number]);

  return (
    <Chat mode="contained" onPress={handlePress}>
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

export default React.memo(ChatCard);
