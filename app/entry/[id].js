import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from "../../assets/theme";
import { initDatabase, addItem, getItems } from './Database';

export default function WinePage() {
    return (
        <Text style={styles.text}> 
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
            This is the Entry Page!
        </Text>
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
});