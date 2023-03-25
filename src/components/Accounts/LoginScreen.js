import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import React, { useContext, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { Spacer } from "../../infrastructure/components/spacer/spacer";
import { Text } from "../../infrastructure/components/typography/Text";
import {
  AccountBackground,
  AccountContainer,
  AuthInput,
  AuthButton,
  Title,
} from "./AccountStyles";
export const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const {
    error,
    onLogin,
    confirmCode,
    isAuthenticated,
    recaptchaVerifier,
    firebaseConfig,
    codeSent
  } = useContext(AuthenticationContext);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingConfirmCode, setIsLoadingConfirmCode] = useState(false);

  const handleLogin = () => {
    if (!isLoadingLogin && !isLoginDisabled) {
      setIsLoadingLogin(true);
      onLogin(phoneNumber).finally(() => setIsLoadingLogin(false));
    }
  };

  const handleConfirmCode = () => {
    if (!isLoadingConfirmCode && !isConfirmCodeDisabled) {
      setIsLoadingConfirmCode(true);
      confirmCode(code).finally(() => setIsLoadingConfirmCode(false));
    }
  };

  const isLoginDisabled = phoneNumber.length === 0;
  const isConfirmCodeDisabled = code.length === 0;

  return (
    <AccountBackground>
      <Title>GupShup</Title>
      <AccountContainer>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        {!codeSent ?
        <>
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
        <TouchableOpacity
          disabled={isLoadingLogin || isLoginDisabled}
          style={{ backgroundColor: "blue", padding: 10, alignItems: "center" }}
          onPress={handleLogin}
        >
          {isLoadingLogin ? (
            <>
              <ActivityIndicator color="white" />
              <Text style={{ color: "white", marginLeft: 5 }}>
                Logging in...
              </Text>
            </>
          ) : (
            <Text style={{ color: "white" }}>Login</Text>
          )}
        </TouchableOpacity>
        </> :
        <>
        <AuthInput
          label="Verification Code"
          value={code}
          onChangeText={(text) => setCode(text)}
        />
        <TouchableOpacity
          disabled={isLoadingConfirmCode || isConfirmCodeDisabled}
          style={{ backgroundColor: "blue", padding: 10, alignItems: "center" }}
          onPress={handleConfirmCode}
        >
          {isLoadingConfirmCode ? (
            <>
              <ActivityIndicator color="white" />
              <Text style={{ color: "white", marginLeft: 5 }}>
                Confirming code...
              </Text>
            </>
          ) : (
            <Text style={{ color: "white" }}>Confirm Code</Text>
          )}
        </TouchableOpacity>
        </>}
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
