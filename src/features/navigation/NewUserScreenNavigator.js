import { View, Text } from "react-native";
import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import NewUserDetailsScreen from "../../screens/NewUserDetailsScreen/NewUserDetailsScreen";
import { CameraScreen } from "../../screens/NewUserDetailsScreen/ProfilePhotoCameraScreen";

export const NewUserStack = createStackNavigator();

export default function NewUserScreenNavigator({ setPrev }) {
  return (
    <NewUserStack.Navigator 
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerShown:false
    }}>
      <NewUserStack.Screen
        name="NewUserDetails"
        component={NewUserDetailsScreen}
        initialParams={{ setPrev }}
      />
      <NewUserStack.Screen name="ProfileCamera" component={CameraScreen} />
    </NewUserStack.Navigator>
  );
}
