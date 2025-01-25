import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { photosDir } from './Database';

export function Camera(props) {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {

      const photo = await cameraRef.current.takePictureAsync();

      const fileName = `${uuidv4()}.jpg`;
      const newFilePath = `${photosDir}/${fileName}`;

      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      }

      await FileSystem.moveAsync({
        from: photo.uri,
        to: newFilePath,
      });

      
      props.setPhotoUri(fileName);
      props.setModalVisible(false);
    }
  }

  function flipCamera() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} mode="picture" facing={facing}>
        <View style={styles.boundaryContainer}></View>
        <View style={styles.exitButtonContainer}>
          <TouchableOpacity style={styles.exitButton} onPress={props.setModalVisible}><Text style={styles.exitButtonText}>x</Text></TouchableOpacity>
        </View>
        <View style={styles.takePictureButtonContainer}>
          <TouchableOpacity style={styles.takePictureButton} onPress={takePicture} />
        </View>
        <TouchableOpacity style={styles.flipButton} onPress={flipCamera}><Text style={styles.flipButtonText}>flip</Text></TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 5,
    borderRadius: 10,
    height: '100%',
    margin: 20,
  },
  takePictureButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    margin: 32,
  },
  takePictureButton: {
    height: 75,
    width: 75,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.95)',
  },
  flipButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignSelf: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  flipButtonTexttext: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  exitButtonContainer: {
    alignSelf: 'flex-end',
  },
  exitButton: {
    padding: 10,
    height: 60,
    width: 50,
    // backgroundColor: 'rgba(255, 0, 0, 0.35)',
    // borderColor: 'red',
    // borderRadius: 20,
    // borderStyle: 'solid',
    // borderWidth: 2,
  },
  exitButtonText: {
    fontSize: 30, 
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  boundaryContainer: {
    position: 'absolute',
    width: '100%',
    height: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  }
});
