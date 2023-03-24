import { useContext } from "react";
import { ActivityIndicator } from "react-native-paper";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { Spacer } from "../../infrastructure/components/spacer/spacer";

import {
  AccountBackground,
  AccountContainer,
  AuthButton,
  Title,
} from "./AccountStyles";

export const AccountsScreen = ({ navigation }) => {
  const { isLoading } = useContext(AuthenticationContext);
  return (
    <AccountBackground>
      <Title>GupShup</Title>
      

      <AccountContainer>
        {!isLoading?<AuthButton
          icon="lock-open-outline"
          mode="contained"
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          Login
        </AuthButton>:<ActivityIndicator size={55} color="purple" />}
      </AccountContainer>
    </AccountBackground>
  );
};
