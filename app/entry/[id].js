import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { colors } from "../../assets/theme";
import { getItemFromId, deleteItem, collectTrash, photosDir } from '../../components/Database';
import { SafeWrapper } from '../../components/Elements';

export default function WinePage() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        getItemFromId(id, setData);
    }, []);

    function handleDeleteButtonPress() {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this item?",
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteItem(id);
                        router.back()
                    },
                },
            ]
        );
    };

    if (data) {
        return (
            <SafeWrapper>
                <View style={styles.container}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.text}>
                            This is the Entry Page {id} for {data ? data.variety : "idk bruh"}
                        </Text>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: `${photosDir}/${data.photoUri}` }} style={styles.image} resizeMode='cover' />
                            {/* <Text style={styles.text}>{data.photoUri}</Text> */}
                        </View>
                        <View style={styles.attributeContainer}>
                            <Text style={styles.attributeLeft}>Variety:</Text>
                            <Text style={styles.attributeLeft}>{data.variety}</Text>
                        </View>
                        <View style={styles.attributeContainer}>
                            <Text style={styles.attributeLeft}>Vintage:</Text>
                            <Text style={styles.attributeLeft}>{data.vintage}</Text>
                        </View>
                        <View style={styles.attributeContainer}>
                            <Text style={styles.attributeLeft}>Rating:</Text>
                            <Text style={styles.attributeLeft}>{data.rating}</Text>
                        </View>
                        <View style={styles.attributeContainer}>
                            <Text style={styles.attributeLeft}>Brand:</Text>
                            <Text style={styles.attributeLeft}>{data.brand}</Text>
                        </View>
                        <View style={styles.attributeContainer}>
                            <Text style={styles.attributeLeft}>origin:</Text>
                            <Text style={styles.attributeLeft}>{data.origin}</Text>
                        </View>
                        <View style={styles.attributeContainer}>
                            <Text style={styles.attributeLeft}>Notes:</Text>
                            <Text style={styles.attributeLeft}>{data.notes}</Text>
                        </View>
                        <TouchableOpacity onPress={handleDeleteButtonPress} style={styles.addButton}>
                            <Text style={styles.addButtonText}>x</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeWrapper>
        )
    }
    else {
        return (
            <SafeWrapper>
                <View style={styles.container}>
                    <Text style={styles.text}>Loading...</Text>
                </View>
            </SafeWrapper>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    text: {
        color: colors.text,
    },
    attributeLeft: {
        color: colors.text,
        width: '50%',
        textAlign: 'center',
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
    attributeContainer: {
        flex: 1,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 10,
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingVertical: 10,
        borderStyle: 'solid',
        borderColor: colors.primary,
        borderTopWidth: 2,
        alignItems: 'center',
    },
    image: {
        height: 200,
        width: 200,
        borderStyle: 'solid',
        borderColor: colors.accent,
        borderWidth: 2,
        borderRadius: 10,
    }
});