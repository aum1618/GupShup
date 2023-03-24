import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { AccountsScreen } from "../../components/Accounts/AccountScreen";
import { LoginScreen } from "../../components/Accounts/LoginScreen";
import { RegisterScreen } from "../../components/Accounts/RegisterScreen";

export const AccountStack = createStackNavigator();

export const AccountNavigator = () => {
  return (
    
    <AccountStack.Navigator screenOptions={{headerShown:false,...TransitionPresets.BottomSheetAndroid }} >
      <AccountStack.Screen
        name="Accounts"
        component={AccountsScreen}
      />
      <AccountStack.Screen
        name="Login"
        component={LoginScreen}
      />
      <AccountStack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </AccountStack.Navigator>
    
  );
};
