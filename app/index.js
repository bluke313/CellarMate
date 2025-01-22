import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, Link } from 'expo-router';
import { WineItem } from "../components/WineItem";
import { colors } from "../assets/theme";
import { initDatabase, addItem, getItems } from '../components/Database';

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