import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { colors } from "../assets/theme";
import Svg, { Rect } from "react-native-svg";

const convertRating = (rating) => {
    var retval = "";
    for (let i = 1; i >= 0; i--) {
        if (rating <= 0) {
            retval += "☆";
        }
        else {
            retval += "★";
        }
        rating--;
    }
    return retval;
};

const makeFit = (text) => {
    var retval = "";
    for (let i = 0; i < 10; i++) {
        if (text[i] != null) {
            retval += text[i];
        }
    }
    if (text.length == 11) {
        retval += text[10];
    }
    else if (text.length >= 11) {
        retval += "…";
    }
    return retval;
};

export function WineItem(props) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <TouchableOpacity onPress={() => router.push(`/entry/${props.data.id}`)} style={styles.container}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.image}></View>
                <View style={styles.leftCaptions}>
                    <Text style={styles.text}>{makeFit(props.data.variety)}</Text>
                    <Text style={styles.text}>{makeFit(props.data.origin)}</Text>
                    <Text style={styles.text}>{convertRating(props.data.rating)}</Text>
                </View>
                <Svg height="75" width="2">
                    <Rect 
                        x="0"
                        y="7.5"
                        width="2"
                        height="60"
                        fill={colors.primary}
                    />
                </Svg>
                <View style={styles.rightCaptions}>
                    <Text style={styles.text}>{makeFit(props.data.brand)}</Text>
                    <Text style={styles.text}>{props.data.vintage}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background2,
        height: 85,
        borderWidth: 5,
        borderColor: colors.primary,
        borderRadius: 20,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    text: {
        color: colors.text,
        fontSize: 14,
        fontFamily: Platform.select({
            ios: 'Menlo',
            default: 'monospace',
        }),
    },
    leftCaptions: {
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        justifyContent: 'space-between',
        width: 115,
        height: 75,
    },  
    rightCaptions: {
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        width: 125,
        height: 75,
    },  
    image: {
        height: 75,
        width: 75,
        borderWidth: 3,
        borderRadius: 10,
        borderColor: colors.secondary,

    }
});