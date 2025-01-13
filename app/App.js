import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WineItem from "../components/WineItem";
import { colors } from "../assets/theme";
import { initDatabase, addItem, getItems } from './Database';

export default function App() {

    const [wineList, setWineList] = useState([]);

    useEffect(() => {
        initDatabase();
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null); addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null); addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null); addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null); addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        addItem("Pinot Noir", "California", 2, "B. Lovely", "very tasty", 2021, null);
        getItems(setWineList);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.menuBarContainer}>
                <Text style={styles.text}>Welcome Home</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <ScrollView style={styles.listContaier}>
                {wineList.map((item, index) => (
                    <WineItem
                        key={index}
                        data={item}
                    />
                ))}
                <TouchableOpacity style={styles.addButton}>
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
    },
    listContaier: {
        flex: 1,
        marginTop: 25,
    },
    menuBarContainer: {
        height: 50,
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