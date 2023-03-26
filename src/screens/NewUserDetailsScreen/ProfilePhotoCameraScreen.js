import React, { useRef, useState, useEffect, useContext } from "react";
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "../../infrastructure/components/typography/Text";
import { AuthenticationContext } from "../../features/authentication/authenticationContext";
import { storage } from "../../../Firebase";
import { ref, uploadBytesResumable } from "@firebase/storage";
const ProfileCamera = styled(Camera)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const cameraRef = useRef(null);
  const { user } = useContext(AuthenticationContext);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setIsLoading(false);
    })();
  }, []);

  const snap = useCallback(async () => {
    try {
      if (cameraRef?.current) {
        const photo = await cameraRef.current.takePictureAsync();
        const response = await fetch(photo.uri);
        const photoRef = `${user.uid}-photo`;
        await AsyncStorage.setItem(photoRef, photo.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `${user.phoneNumber}-photo`);
        navigation.goBack();
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        }, (error) => {
          console.log(error);
        }, () => {
          console.log('Upload is complete');
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [cameraRef, navigation, user]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ProfileCamera
      ref={(ref) => {
        cameraRef.current = ref;
      }}
      type={Camera.Constants.Type.front}
      ratio="16:9"
    >
      <IconButton
        icon="camera"
        mode="contained"
        onPress={snap}
        style={{ backgroundColor: 'black', position: 'absolute', bottom: 50 }}
      />
    </ProfileCamera>
  );
};
