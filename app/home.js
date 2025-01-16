import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { WineItem } from "../components/WineItem";
import { colors } from "../assets/theme";

export default function test() {

    const [wineList, setWineList] = useState([]);

    useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.menuBarContainer}>
                <Text style={styles.text}>Welcome Test</Text>
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
                <Link href="/">
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </Link>
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
        fontSize: 50,
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