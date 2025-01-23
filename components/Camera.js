import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export function Camera(props) {
  const [facing, setFacing] = useState('back');
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
    // setFacing(current => (current === 'back' ? 'front' : 'back'));
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      props.setPhotoUri(photo);
      props.setModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} mode="picture" facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 5,
    borderRadius: 10,
    margin: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    margin: 32,
  },
  button: {
    height: 75,
    width: 75,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,.95)',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
