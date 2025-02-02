import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Custom imports
import { photosDir } from './Database';
import { SafeWrapper } from '../components/Elements';

// Accesses device's camera to take a picture
export function Camera(props) {
  const [facing, setFacing] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraWidth, setCameraWidth] = useState(0);
  const [cameraHeight, setCameraHeight] = useState(0);
  const [deadAreaHeight, setDeadAreaHeight] = useState(0);

  const cameraRef = useRef(null);

  useEffect(() => {
    setDeadAreaHeight((cameraHeight - cameraWidth) / 2);
  }, [cameraWidth, cameraHeight])

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeWrapper>
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      </SafeWrapper>
    );
  }

  // Get the dimensions of the device's camera
  const handleLayout = (event) => {
    setCameraWidth(event.nativeEvent.layout.width);
    setCameraHeight(event.nativeEvent.layout.height);
  };

  // Capture photo and store in temporary storage
  const takePicture = async () => {
    if (cameraRef.current) {

      const photo = await cameraRef.current.takePictureAsync();

      const fileName = `${uuidv4()}.jpg`;

      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      }

      if (props.photoPath) {
        await FileSystem.deleteAsync(props.photoPath);
      }

      props.setPhotoUri(fileName);
      props.setPhotoPath(photo.uri);
      props.setModalVisible(false);
    }
  }

  // Switch between front and back-facing cameras
  function flipCamera() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <SafeWrapper>
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} mode="picture" facing={facing} onLayout={handleLayout}>
          <View style={[styles.overlay, styles.topOverlay, { width: cameraWidth, height: deadAreaHeight }]} >
            {props.photoPath ? <Image source={{ uri: props.photoPath }} resizeMode='cover' style={[styles.image, { width: 0.9*deadAreaHeight, height: 0.9*deadAreaHeight, marginLeft: 0.05*deadAreaHeight, marginTop: 0.05*deadAreaHeight }]} /> : <Text style={styles.caption}>Capture a picture of the wine label!</Text>}
          </View>
          <View style={[styles.overlay, styles.bottomOverlay, { width: cameraWidth, height: (cameraHeight - cameraWidth) / 2 }]} />
          <View style={styles.exitButtonContainer}>
            <TouchableOpacity style={styles.exitButton} onPress={() => props.setModalVisible(false)}><Text style={styles.exitButtonText}>x</Text></TouchableOpacity>
          </View>
          <View style={styles.takePictureButtonContainer}>
            <TouchableOpacity style={styles.takePictureButton} onPress={takePicture} />
          </View>
          <TouchableOpacity style={styles.flipButton} onPress={flipCamera}><Text style={styles.flipButtonText}>flip</Text></TouchableOpacity>
        </CameraView>
      </View>
    </SafeWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  caption: {
    position: 'absolute',
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    fontSize: 40,
    margin: 10,
    marginRight: 50,
  },
  camera: {
    // borderStyle: 'solid',
    // borderColor: 'black',
    // borderWidth: 5,
    // borderRadius: 10,
    height: '100%',
    width: '100%',
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
    backgroundColor: 'rgba(187, 187, 187, 0.8)',
    borderRadius: '50%',
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'rgba(109, 109, 109, 0.95)',
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
  flipButtonText: {
    fontSize: 24,
    color: 'black',
  },
  exitButtonContainer: {
    alignSelf: 'flex-end',
  },
  exitButton: {
    paddingTop: 10,
    height: 80,
    width: 70,
    // backgroundColor: 'rgba(255, 0, 0, 0.35)',
    // borderColor: 'red',
    // borderRadius: 20,
    // borderStyle: 'solid',
    // borderWidth: 2,
  },
  exitButtonText: {
    color: 'black',
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    // fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topOverlay: {
    top: 0,
    left: 0,
    right: 0,
    borderColor: 'black',
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },
  bottomOverlay: {
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: 'black',
    borderTopWidth: 2,
    borderStyle: 'solid',
  },
  image: {
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  }

});
