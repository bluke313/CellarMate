import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as FileSystem from 'expo-file-system';

// Custom imports
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
    const [filteredWineList, setFilteredWineList] = useState([]);
    const [reload, setReload] = useState(0);
    const [sortMenuVisible, setSortMenuVisible] = useState(false);
    const [sorterAttribute, setSorterAttribute] = useState('date_created');
    const [sorterOrder, setSorterOrder] = useState('desc');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);

    const sortMenuOptions = [
        { key: 'recent', value: 'date_created' },
        { key: 'variety', value: 'variety' },
        { key: 'rating', value: 'rating' },
        // { key: 'vintage', value: 'vintage' },
        // { key: 'brand', value: 'brand' },
    ];

    const sortMenuIcons = {
        date_created: '⌛',
        variety: '🍷',
        rating: '⭐',
        vintage: '📅',
        brand: '🏭',
    };

    useEffect(() => {
        dbFunctions.initDatabase();
        dbFunctions.collectTrash();
    }, []);

    useEffect(() => {
        setFilteredWineList(wineList.filter(wine =>
            [wine.variety, wine.brand, wine.notes].some(field =>
                field && field.toLowerCase().includes(searchValue.toLowerCase())
            )
        ));
    }, [wineList, searchValue]);

    useFocusEffect(
        useCallback(() => {
            dbFunctions.getItems(setWineList);
            // console.log('Refreshing data...');
            return () => {
                // console.log('Screen unfocused');
            }
        }, [])
    );

    return (
        <SafeWrapper>
            <Modal
                visible={sortMenuVisible}
                transparent
                animationType='fade'
            >
                <View
                    style={styles.sortMenuContainer}
                    onTouchEnd={(e) => {
                        if (e.target === e.currentTarget) {
                            setSortMenuVisible(false);
                        }
                    }}
                >
                    <View style={styles.sortMenuContent}>
                        <Text style={styles.sortMenuTitle}>Sort By</Text>

                        {sortMenuOptions.map((item, index) => (
                            <View key={index} style={styles.sortMenuOptionContainer}>
                                <TouchableOpacity onPress={() => { setSorterAttribute(item.value); setSortMenuVisible(false) }}>
                                    <Text style={[styles.sortMenuText, sorterAttribute === item.value && { fontWeight: 'bold', color: 'black' }]}>{item.key}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </Modal>
            <View style={styles.container}>
                <View style={styles.menuBarContainer}>
                    <Text style={styles.text}>Welcome home</Text>
                    {/* <Text onPress={() => setReload(reload + 1)} style={styles.text}>Reload</Text> */}
                    {/* <Text onPress={() => logPhotos()} style={styles.text}>Log Files</Text> */}
                    {/* <Text onPress={() => dbFunctions.collectTrash()} style={styles.text}>Collect Trash</Text> */}
                    {/* <Text onPress={() => deletePhotos()} style={styles.text}>Delete Files</Text> */}
                </View>
                <View style={styles.listContaier}>
                    <View style={{flexDirection: 'row', borderBottomColor: colors.primary, borderWidth: 1, paddingHorizontal: 4, paddingBottom: 10 }}>
                        <View style={styles.searchBarContainer} >
                            <TextInput style={styles.searchBar} value={searchValue} onChangeText={setSearchValue} placeholder='Search...' placeholderTextColor={colors.placeholderText} />
                            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => setSearchValue('')}><Text style={{color: colors.placeholderText, fontSize: 30, marginHorizontal: 10}}>x</Text></TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', borderColor: colors.primary, borderRadius: 10, borderWidth: 2}}>
                            <TouchableOpacity onPress={() => setSortMenuVisible(true)} style={{ alignSelf: 'center' }}>
                                <Text style={styles.text}>{sortMenuIcons[sorterAttribute]}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { if (sorterOrder === 'desc') { setSorterOrder('asc') } else { setSorterOrder('desc') } }} style={{ alignSelf: 'center' }}>
                                <Text style={styles.text}>{sorterOrder === 'desc' ? "▼" : "▲"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View >
                        <FlatList
                            data={sort(filteredWineList, sorterAttribute, sorterOrder)}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <WineItem
                                    data={item}
                                    loading={loading}
                                />
                            )}
                            style={{ marginBottom: 75 }}
                        />
                        {filteredWineList.length === 0 && wineList.length !== 0 && <Text style={{ color: colors.placeholderText, textAlign: 'center'}}>No results</Text>}
                        {wineList.length === 0 && <Text style={{ color: colors.placeholderText, textAlign: 'center', marginTop: 150 }}>Tap + to add your first wine!</Text>}
                    </View>
                </View>
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
    },
    sortMenuContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sortMenuText: {
        color: 'rgba(0,0,0,.5)',
        textAlign: 'center',
        fontSize: 25,
    },
    sortMenuTitle: {
        color: colors.background,
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 10,
    },
    sortMenuContent: {
        backgroundColor: colors.accent,
        padding: 20,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: colors.secondary,
        width: 180,
    },
    sortMenuOptionContainer: {
        margin: 2,
        borderTopColor: colors.primary,
        borderTopWidth: 1,
        width: 120,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 4,
    },
    searchBar: {
        flex: 1,
        color: colors.text,
        marginLeft: 10,
        fontSize: 18,
        
    }
});
