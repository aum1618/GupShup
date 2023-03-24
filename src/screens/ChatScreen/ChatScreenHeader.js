import { TouchableOpacity, View } from "react-native";
import React from "react";
import { Text } from "../../infrastructure/components/typography/Text";
import { Image } from "react-native";
import { IconButton } from "react-native-paper";
import styled from "styled-components";

const Header = styled(View)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  background-color: ${(props) => props.theme.colors.bg.secondary};
  flex-direction: row;
  align-items: center;
  z-index: 100;
  height: 100px;
  padding: 10px;
  justify-content: space-between;
  border-bottom-width:2px;
  /* border-color: gray; */
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const Profile = styled(Image)`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin-right: 10px;
`;
const Pressers = styled(IconButton)`
  height: 36px;
  width: 36px;
  background-color: rgb(16, 50, 32);
  border-radius: 5px;
`;

export default function ChatScreenHeader({navigation,name}) {
  return (
    
    <Header>
      
        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
      <Pressers icon="arrow-left" iconColor="rgb(32,220,119)" style={{backgroundColor:null,height:18,width:18}} size={18} onPress={()=>navigation.navigate("Main")} />
            
      <Profile
        source={{
          uri: "https://www.shutterstock.com/image-vector/male-avatar-profile-picture-vector-600w-149083895.jpg",
        }}
      />
      <Text variant="name">{name}</Text>
      </View>
      <View style={{flexDirection:"row",justifyContent:"space-evenly"}}>

      <Pressers icon="phone" iconColor="rgb(32,220,119)" onPress={()=>navigation.navigate("VoiceCall")} />
      <Pressers icon="video" iconColor="rgb(32,220,119)" />
      <Pressers icon="dots-vertical" iconColor="rgb(32,220,119)" />
      </View>

    </Header>

  );
}
