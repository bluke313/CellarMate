import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from "../../assets/theme";
import { getItemFromId, deleteItem } from '../../components/Database';
import { useLocalSearchParams, router } from 'expo-router';

export default function WinePage() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        getItemFromId(id, setData);
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                This is the Entry Page {id} for {data ? data.variety : "idk bruh"}
            </Text>
            <TouchableOpacity onPress={() => {deleteItem(id); router.back()}} style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    text: {
        color: colors.text,
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