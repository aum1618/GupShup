import React, { useState, useContext } from 'react';
import { Wrapper } from '../../infrastructure/components/wrappper/wrapper';
import { AuthButton, AuthInput } from '../../components/Accounts/AccountStyles';
import { Spacer } from '../../infrastructure/components/spacer/spacer';
import { UserInfoContext } from '../../features/userInfo/UserInfoContext';

export default function NewConversationScreen({ navigation }) {
  const [number, setNumber] = useState();
  const { addNewConversation } =useContext(UserInfoContext);

  const handlePress = async () => {
    const ChatId = await addNewConversation(number);
    navigation.navigate('Main', { ChatId: ChatId });
  };

  return (
    <Wrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AuthInput onChangeText={(p) => setNumber(p)} label="Friend's Phone Number" />
      <Spacer size="large" />
      <AuthButton textColor="white" onPress={() => handlePress()}>
        Start Chatting!
      </AuthButton>
    </Wrapper>
  );
}
