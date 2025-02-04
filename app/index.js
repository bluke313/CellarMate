import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';

import { WineItem } from "../components/WineItem";
import { colors } from "../assets/theme";
import * as dbFunctions from '../components/Database';
import { sort } from '../components/Sort';
import { SafeWrapper } from '../components/Elements';

const photosDir = `${FileSystem.documentDirectory}photos`;

// Debug function to print all photo names to console
const logPhotos = async () => {
    try {
        const dirInfo = await FileSystem.getInfoAsync(photosDir)
        if (!dirInfo.exists) {
            console.log('Photos folder does not exist.');
            return;
        }
        const files = await FileSystem.readDirectoryAsync(photosDir);
        // const photoUris = files.map((file) => `${photosDir}/${file}`);
        console.log('Files in photos folder:', files);
    } catch (error) {
        console.error('Error loging photos:', error);
    }
};

// Main home page
export default function home() {

    const [wineList, setWineList] = useState([]);
    const [reload, setReload] = useState(0);

    const [sorterAtrribute, setSorterAttribute] = useState('id');
    const [sorterOrder, setSorterOrder] = useState('desc');

    useEffect(() => {
        dbFunctions.initDatabase();
        dbFunctions.collectTrash();
    }, []);

    useFocusEffect(() => {
        dbFunctions.getItems(setWineList);
    });

    return (
        <SafeWrapper>
            <View style={styles.container}>
                <View style={styles.menuBarContainer}>
                    {/* <Text style={styles.text}>Welcome Home</Text> */}
                    <Text onPress={() => setReload(reload + 1)} style={styles.text}>Reload</Text>
                    <Text onPress={() => logPhotos()} style={styles.text}>Log Files</Text>
                    <Text onPress={() => dbFunctions.collectTrash()} style={styles.text}>Collect Trash</Text>
                    {/* <Text onPress={() => deletePhotos()} style={styles.text}>Delete Files</Text> */}
                </View>
                <ScrollView style={styles.listContaier}>
                    <TouchableOpacity onPress={() => setSorterAttribute('variety')}><Text style={styles.text}>variety</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setSorterAttribute('id')}><Text style={styles.text}>id</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setSorterAttribute('rating')}><Text style={styles.text}>rating</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setSorterAttribute('vintage')}><Text style={styles.text}>vintage</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { if (sorterOrder === 'desc') { setSorterOrder('asc') } else { setSorterOrder('desc') } }}><Text style={styles.text}>flip order: {sorterOrder}</Text></TouchableOpacity>
                    {sort(wineList, sorterAtrribute, sorterOrder).map((item, index) => (
                        <WineItem
                            key={index}
                            data={item}
                        />
                    ))}
                </ScrollView>
                <TouchableOpacity onPress={() => router.push("/newEntry")} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </SafeWrapper>
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
    },
    addButton: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 20,
        borderWidth: 2,
        borderColor: colors.secondary,
        borderStyle: 'solid',
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignSelf: 'center',
        height: 80,
        width: 80,
        margin: 20,
    },
    addButtonText: {
        color: colors.text,
        fontSize: 50,
        textAlign: 'center',
    }
});