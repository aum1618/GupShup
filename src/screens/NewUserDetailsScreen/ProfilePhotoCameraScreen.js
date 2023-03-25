import React, { useRef, useState, useEffect, useContext } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { View } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "../../infrastructure/components/typography/Text";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { storage } from "../../../Firebase";
import { ref, uploadBytes } from "@firebase/storage";
const ProfileCamera = styled(Camera)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const CameraScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const {user}=useContext(AuthenticationContext)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const snap = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      const response = await fetch(photo.uri);
      AsyncStorage.setItem(`${user.uid}-photo`,photo.uri)
      const blob = await response.blob();
      const storageRef = ref(storage, `${user.phoneNumber}-photo`);
      navigation.goBack();
      await uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    
      <ProfileCamera
        ref={(ref) => {
          cameraRef.current = ref;
        }}
        type={Camera.Constants.Type.front}
        ratio={"16:9"}
      >
        <Button mode="contained" icon="camera" onPress={snap} style={{backgroundColor:"black",position:"absolute",bottom:50}} >
          PHOTO
        </Button>
      </ProfileCamera>
    
  );
};
