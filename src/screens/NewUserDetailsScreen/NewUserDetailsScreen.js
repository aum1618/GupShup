import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { AuthButton, AuthInput } from "../../components/Accounts/AccountStyles";
import { Spacer } from "../../infrastructure/components/spacer/spacer";
import { Text } from "../../infrastructure/components/typography/Text";
import { Wrapper } from "../../infrastructure/components/wrappper/wrapper";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { addDoc, collection } from "@firebase/firestore";
import { firestoreDb } from "../../../Firebase";
import { UserInfoContext } from "../../features/userInfo/UserInfoContext";

export default function NewUserDetailsScreen({navigation,setPrev}) {
  const [name, setName] = useState("");
  const { user } = useContext(AuthenticationContext);
  const { addToFirestore,localUsers } = useContext(UserInfoContext);

  useEffect(() => {
    console.log(localUsers);
  }, []);

  const HandleContinue=()=>{
    addToFirestore(name)
    setPrev(true)

  }

  return (
    <Wrapper style={{ alignItems: "center", justifyContent: "center" }}>
      <Text>Hi {user.phoneNumber} </Text>
      <AuthInput label="Name" onChangeText={(n) => setName(n)} />
      <Spacer size="large" />
      <AuthButton icon="arrow-right" mode="contained" onPress={HandleContinue}>
        Continue
      </AuthButton>
    </Wrapper>
  );
}
