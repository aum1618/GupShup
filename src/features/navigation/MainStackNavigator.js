import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import MainScreen from "../../screens/MainScreen/main.screen";
import { ChatScreen } from "../../screens/ChatScreen/ChatScreen";
import NewUserDetailsScreen from "../../screens/NewUserDetailsScreen/NewUserDetailsScreen";
import { AuthenticationContext } from "../authentication/authenticationContext";
import { UserInfoContext } from "../userInfo/UserInfoContext";
import NewConversationScreen from "../../screens/NewConversationScreen/NewConversationScreen";
import VoiceCallingScreen from "../../screens/VoiceCallingScreen/VoiceCallingScreen";
import NewUserScreenNavigator from "./NewUserScreenNavigator";

const Stack = createStackNavigator();

function checkPrevUser(localUsers, uid) {
  return localUsers.some((localUser) => localUser.userid === uid);
}

export default function MainStackNavigator({}) {
  const { user, isAuthenticated, fromLogin } = useContext(AuthenticationContext);
  const { localUsers } = useContext(UserInfoContext);
  const [isPrevUser, setIsPrevUser] = useState(false);

  useEffect(() => {
    const prevUser = checkPrevUser(localUsers, user.uid);
    setIsPrevUser(prevUser);
  }, [localUsers, isAuthenticated]);

  return (
    <Stack.Navigator screenOptions={{ headerMode: false,...TransitionPresets.SlideFromRightIOS }}>
      {!isPrevUser && fromLogin ? (
        <Stack.Screen
          name="NewUser"
          component={() => <NewUserScreenNavigator setPrev={setIsPrevUser} />}
        />
      ) : (
        <Stack.Screen name="Main" component={MainScreen} />
      )}
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="NewChat"  component={NewConversationScreen}/>
      <Stack.Screen name="VoiceCall" component={VoiceCallingScreen} />
    </Stack.Navigator>
  );
}
