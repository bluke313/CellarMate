import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Modal, ActivityIndicator, FlatList } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Custom imports
import { photosDir } from './Database';
import { SafeWrapper } from '../components/Elements';
import { colors } from '../assets/theme';

// Accesses device's camera to take a picture
export function Camera(props) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraWidth, setCameraWidth] = useState(0);
  const [cameraHeight, setCameraHeight] = useState(0);
  const [deadAreaHeight, setDeadAreaHeight] = useState(0);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [isOverlayImageVisible, setIsOverlayImageVisible] = useState(false);

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

      const dirInfo = await FileSystem.getInfoAsync(photosDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
      }

      props.setPhotoPath(photo.uri);
      setIsPhotoCaptured(true);
    }
  }

  return (
    <SafeWrapper>
      <Modal
        visible={isOverlayImageVisible}
        transparent
        animationType='fade'
      >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)',}} onTouchEnd={() => setIsOverlayImageVisible(false)}>
          <Image source={{ uri: props.photoPath }} resizeMode='fit' style={{ height: '95%', width: '95%', borderRadius: 10, borderWidth: 4, borderColor: 'black', }} />
        </View>
      </Modal>
      {isPhotoCaptured ?
        <View style={[styles.container, { justifyContent: 'flex-start' }]}>
          <Image
            source={{ uri: props.photoPath }}
            resizeMode='fit'
            style={{ width: '85%', height: '85%', alignSelf: 'center', borderWidth: 5, borderColor: colors.secondary, borderRadius: 10, margin: 10 }}
          />
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: colors.primary }}>
            <TouchableOpacity onPress={() => { props.setPhotoPath(null); setIsPhotoCaptured(false) }} style={styles.capturedPhotoButton}><Text style={styles.capturedPhotoButtonText}>X</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { props.setModalVisible(false) }} style={styles.capturedPhotoButton}><Text style={styles.capturedPhotoButtonText}>✓</Text></TouchableOpacity>
          </View>
        </View>
        :
        <View style={styles.container}>
          <CameraView style={styles.camera} ref={cameraRef} mode="picture" facing={facing} onLayout={handleLayout}>
            <View style={[styles.overlay, styles.topOverlay, { width: cameraWidth, height: deadAreaHeight }]} >
              {props.photoPath ?
                <View style={[styles.image, { width: 0.9 * deadAreaHeight, height: 0.9 * deadAreaHeight, marginLeft: 0.05 * deadAreaHeight, marginTop: 0.05 * deadAreaHeight }]}>
                  <TouchableOpacity onPress={() => setIsOverlayImageVisible(true)}>
                    <Image source={{ uri: props.photoPath }} resizeMode='cover' style={{width: '100%', height: '100%'}} />
                  </TouchableOpacity>
                </View>
                :
                <Text style={styles.caption}>Capture a picture of the wine label!</Text>
              }
            </View>
            <View style={[styles.overlay, styles.bottomOverlay, { width: cameraWidth, height: (cameraHeight - cameraWidth) / 2 }]} />
            <View style={styles.exitButtonContainer}>
              <TouchableOpacity style={styles.exitButton} onPress={() => props.setModalVisible(false)}><Text style={styles.exitButtonText}>x</Text></TouchableOpacity>
            </View>
            <View style={styles.takePictureButtonContainer}>
              <TouchableOpacity style={styles.takePictureButton} onPress={takePicture} />
            </View>
            <TouchableOpacity style={styles.flipButton} onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}><Text style={styles.flipButtonText}>flip</Text></TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} onPress={props.changeModals}><Text style={styles.flipButtonText}>gallery</Text></TouchableOpacity>
          </CameraView>
        </View>
      }
    </SafeWrapper>
  );
}

// Modal content for device gallery
export function Gallery(props) {
  const [photos, setPhotos] = useState([]);
  const [permission, setPermission] = useState(null);
  const [after, setAfter] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status === 'granted');

      if (status === 'granted') {
        fetchPhotos();
      }
    })();
  }, []);

  const handleLayout = (event) => {
    setScreenWidth(event.nativeEvent.layout.width);
  };

  async function fetchPhotos() {
    if (loading || !hasNextPage) return;

    setLoading(true);

    const album = await MediaLibrary.getAlbumAsync('Camera');
    const assets = await MediaLibrary.getAssetsAsync({
      first: 15,
      after: after,
      mediaType: 'photo',
      album: album?.id,
    });

    if (assets.assets.length > 0) {
      const updatedPhotos = await Promise.all(
        assets.assets.map(async (asset) => {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
          return { ...asset, uri: assetInfo.localUri };
        })
      );

      setPhotos((prevPhotos) => [...prevPhotos, ...updatedPhotos]);
      setAfter(assets.endCursor);
      setHasNextPage(assets.hasNextPage);

    }

    setLoading(false);

  }

  if (permission === null) return <Text>Requesting permission...</Text>;
  if (!permission) return <Text>Permission denied.</Text>;
  return (
    <SafeWrapper>
      <View style={styles.modalView} onLayout={handleLayout}>
        <TouchableOpacity onPress={() => props.setModalVisible(false)}  >
          <Text style={[styles.exitButtonText, styles.exitButton, styles.exitButtonContainer]}>x</Text>
        </TouchableOpacity>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { props.setPhotoPath(item.uri); props.setModalVisible(false); }}>
              <Image source={{ uri: item.uri }} style={[styles.galleryImage, { width: (screenWidth / 3), height: (screenWidth / 3) }]} />
            </TouchableOpacity>
          )}
          onEndReached={fetchPhotos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator size="large" color="0000ff" /> : null}
        />
      </View>
    </SafeWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: colors.background,
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
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    // fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 0,
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
  },
  modalView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalText: {
    color: colors.text,
    fontSize: 30,
    textAlign: 'center',
  },
  galleryButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    alignSelf: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  galleryImage: {
    // borderStyle: 'solid',
    // borderColor: colors.accent,
    // borderWidth: 2,
    margin: 1,
  },
  capturedPhotoButton: {
    flex: 1, justifyContent: 'center', borderColor: colors.accent, borderWidth: 1
  },
  capturedPhotoButtonText: {
    color: 'white', textAlign: 'center', fontSize: 50
  }

});
