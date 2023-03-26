import React, { useCallback, useContext, useEffect, useState } from "react";
import { Avatar, TextInput } from "react-native-paper";
import { AuthButton, AuthInput } from "../../components/Accounts/AccountStyles";
import { Spacer } from "../../infrastructure/components/spacer/spacer";
import { Text } from "../../infrastructure/components/typography/Text";
import { Wrapper } from "../../infrastructure/components/wrappper/wrapper";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { addDoc, collection } from "@firebase/firestore";
import { firestoreDb } from "../../../Firebase";
import { UserInfoContext } from "../../features/userInfo/UserInfoContext";
import styled from "styled-components";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

const AvatarContainer = styled(View)`
  align-items: center;
`;

const NewUserDetailsScreen = React.memo(({ navigation, route }) => {
  const { setPrev } = route.params;
  const [name, setName] = useState("");
  const { user } = useContext(AuthenticationContext);
  const { addToFirestore, localUsers } = useContext(UserInfoContext);
  const [photo, setPhoto] = useState(null);

  const getPicture = useCallback(async (cr = user) => {
    const photoURI = await AsyncStorage.getItem(`${cr.uid}-photo`);
    setPhoto(photoURI);
  }, []);

  useEffect(() => {
    console.log(localUsers);
  }, []);

  useEffect(() => {
    getPicture();
  }, [getPicture]);

  const handleContinue = () => {
    addToFirestore(name);
    setPrev(true);
  };

  return (
    <Wrapper style={{ alignItems: "center", justifyContent: "center" }}>
      <AvatarContainer>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileCamera")}>
          {!photo ? (
            <Avatar.Icon icon="account" size={180} />
          ) : (
            <Avatar.Image source={{ uri: photo }} size={180} />
          )}
        </TouchableOpacity>
        <Spacer />
        <Text>Hi {user?.phoneNumber}</Text>
      </AvatarContainer>
      <AuthInput label="Name" onChangeText={(n) => setName(n)} />
      <Spacer size="large" />
      <AuthButton icon="arrow-right" mode="contained" onPress={handleContinue}>
        Continue
      </AuthButton>
    </Wrapper>
  );
});

export default NewUserDetailsScreen;
