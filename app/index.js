import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, Link } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { WineItem } from "../components/WineItem";
import { colors } from "../assets/theme";
import { initDatabase, addItem, getItems } from '../components/Database';

const photosDir = `${FileSystem.documentDirectory}photos`;

const logPhotos = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(photosDir)
        if (!dirInfo.exists) {
            console.log('Photos folder does not exist.');
            setPhotos([]);
            return;
        }
        const files = await FileSystem.readDirectoryAsync(photosDir);
        const photoUris = files.map((file) => `${photosDir}/${file}`);
        console.log('Files in photos folder:', photoUris);
    } catch (error) {
        console.error('Error loging photos:', error);
    }
};

export default function home() {

    const [wineList, setWineList] = useState([]);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        initDatabase();
        getItems(setWineList);
    }, [reload]);

    return (
        <View style={styles.container}>
            <View style={styles.menuBarContainer}>
                <Text style={styles.text}>Welcome Home</Text>
                <Text onPress={() => setReload(reload + 1)} style={styles.text}>Reload</Text>
                <Text onPress={() => logPhotos()} style={styles.text}>Check Files</Text>
            </View>
            <ScrollView style={styles.listContaier}>
                {wineList.map((item, index) => (
                    <WineItem
                        key={index}
                        data={item}
                    />
                ))}
                <TouchableOpacity onPress={() => router.push("/newEntry")} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    text: {
        color: colors.text,
        fontSize: 30,
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
    }
});