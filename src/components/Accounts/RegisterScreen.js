import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { auth } from "../../../Firebase";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { Spacer } from "../../infrastructure/components/spacer/spacer";
import { Text } from "../../infrastructure/components/typography/Text";
import {
  AccountBackground,
  AccountContainer,
  AuthButton,
  AuthInput,
  Title,
} from "./AccountStyles";

import { RecaptchaVerifier } from "firebase/auth";

export const RegisterScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const recaptchaRef = useRef(null);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA verified:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
    });
      
    return () => {
      // Cleanup function to remove the recaptchaVerifier instance when the component unmounts
      window.recaptchaVerifier.clear();
    };
  }, [auth]);
  

  const { error, onRegister, isLoading } = useContext(AuthenticationContext);

  return (
    <AccountBackground>
      <Title>MealsToGo</Title>
      <AccountContainer>
        <AuthInput
          label="Phone Number"
          value={phoneNumber}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          onChangeText={(p) => setPhoneNumber(p)}
          autoCapitalize="none"
        />
        <Spacer size="large" />
        {error && (
          <Spacer>
            <Text variant="error">{error}</Text>
          </Spacer>
        )}
        {!isLoading ? (
          <AuthButton
            icon="email"
            mode="contained"
            onPress={() => onRegister(phoneNumber)}
          >
            Register
          </AuthButton>
        ) : (
          <ActivityIndicator color="blue" />
        )}
      </AccountContainer>
      <Spacer size="large" />
      <AuthButton
        mode="contained"
        onPress={() => navigation.navigate("Accounts")}
      >
        Back
      </AuthButton>
    </AccountBackground>
  );
};
