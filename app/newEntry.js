import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { router } from 'expo-router';

// Custom imports
import { colors } from "../assets/theme";
import { addItem } from '../components/Database';
import { Camera, Gallery } from '../components/Camera';
import { SafeWrapper } from '../components/Elements';

export default function newEntry() {
    const [variety, setVariety] = useState(null);
    const [vintage, setVintage] = useState(null);
    const [rating, setRating] = useState(null);
    const [brand, setBrand] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [notes, setNotes] = useState(null);
    const [photoPath, setPhotoPath] = useState(null);
    const [cameraModalVisible, setCameraModalVisible] = useState(true);
    const [galleryModalVisible, setGalleryModalVisible] = useState(false);

    // Prepare stock images
    const images = {
        wineBottle: require('../assets/wine-bottle.png')
    }

    // Handle adding the new wine to the database
    function handleAddPress() {
        const wine = {
            variety: variety,
            origin: origin,
            rating: rating,
            brand: brand,
            notes: notes,
            vintage: vintage,
            photoPath: photoPath,
        }
        addItem(wine);
        router.back()
    }

    return (
        <SafeWrapper>
            <ScrollView style={styles.container}>
                <Modal
                    visible={cameraModalVisible}
                    transparent={false}
                    animationType='fade'
                >
                    <View style={styles.modalView}>
                        <Camera
                            photoPath={photoPath}
                            setPhotoPath={setPhotoPath}
                            setModalVisible={setCameraModalVisible}
                            changeModals={() => { 
                                setCameraModalVisible(false); 
                                setGalleryModalVisible(true); 
                            }}
                        />
                    </View>
                </Modal>
                <Modal
                    visible={galleryModalVisible}
                    transparent={false}
                    animationType='slide'
                >
                    <Gallery setModalVisible={setGalleryModalVisible} setPhotoPath={setPhotoPath} />
                </Modal>
                <Text style={styles.text}></Text>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Photo</Text>
                    <TouchableOpacity onPress={() => setCameraModalVisible(true)}><Image source={photoPath ? { uri: photoPath } : images.wineBottle} style={styles.image} resizeMode='cover' /></TouchableOpacity>
                </View>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Variety</Text>
                    <TextInput style={styles.textInput} value={variety} onChangeText={setVariety}></TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Vintage</Text>
                    <TextInput style={styles.textInput} value={vintage} onChangeText={setVintage}></TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Rating</Text>
                    <TextInput style={styles.textInput} value={rating} onChangeText={setRating}></TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Brand</Text>
                    <TextInput style={styles.textInput} value={brand} onChangeText={setBrand}></TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Origin</Text>
                    <TextInput style={styles.textInput} value={origin} onChangeText={setOrigin}></TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <Text style={styles.textInputTitle}>Notes</Text>
                    <TextInput style={styles.textInput} value={notes} onChangeText={setNotes}></TextInput>
                </View>
                <TouchableOpacity onPress={handleAddPress} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    text: {
        color: colors.text,
        fontSize: 30,
    },
    topBar: {
        backgroundColor: 'white',
        height: '3%',
    },
    listContaier: {
        flex: 1,
        marginTop: 25,
        borderColor: colors.primary,
        borderWidth: 5,
        borderRadius: 10,
    },
    menuBarContainer: {
        borderColor: colors.primary,
        borderWidth: 5,
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        borderStyle: 'solid',
        height: 100,
    },
    addButton: {
        borderWidth: 2,
        borderColor: colors.secondary,
        borderStyle: 'solid',
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignSelf: 'center',
        height: 80,
        width: 80,
    },
    addButtonText: {
        color: colors.text,
        fontSize: 50,
        textAlign: 'center',
    },
    textInputContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingVertical: 10,
        borderStyle: 'solid',
        borderColor: colors.primary,
        borderTopWidth: 2,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textInputTitle: {
        color: colors.text,
        fontSize: 24,
        marginHorizontal: 10,
    },
    textInput: {
        backgroundColor: colors.background,
        borderColor: colors.primary,
        borderWidth: 5,
        borderRadius: 10,
        marginHorizontal: 10,
        borderStyle: 'solid',
        color: colors.text,
        width: '90%',
        height: 50,
    },
    modalView: {
        flex: 1,
        backgroundColor: colors.background,
    },
    image: {
        height: 300,
        width: 300,
        borderStyle: 'solid',
        borderColor: colors.accent,
        borderWidth: 2,
        borderRadius: 10,
    }
});