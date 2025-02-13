import React, { useState } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import Svg, { Rect } from "react-native-svg";

// Custom imports
import { colors } from "../assets/theme";
import { photosDir } from '../components/Database';

export function WineItem(props) {

    const [imageView, setImageView] = useState(false);
    const [fullView, setFullView] = useState(false);

    // Prepare stock images
    const images = {
        wineBottle: require('../assets/wine-bottle.png'),
        loading: require('../assets/loading.gif')
    }

    // Convert the integer rating [0-2] into a star visual
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

    // Convert input text into formatted text that will fit the area on the screen
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

    if (props.loading) {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.imageContainer}>
                        <Image source={images.loading} style={styles.image} resizeMode='fit' />
                    </View>
                    <View style={styles.leftCaptions}>
                        <Text style={[styles.text, { color: colors.placeholderText }]}>loading...</Text>
                        <Text style={styles.text}></Text>
                        <Text style={styles.text}></Text>
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
                        <Text style={styles.text}></Text>
                        <Text style={styles.text}></Text>
                    </View>
                </View>
            </View>
        );
    }

    return (

        <View style={!imageView || fullView ? styles.container : [styles.container, { borderColor: colors.secondary }]}>
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={props.setOverlayImage} activeOpacity={0.4}>
                    <Image source={props.data.photoUri != 'null' ? { uri: `${photosDir}/${props.data.photoUri}` } : images.wineBottle} style={styles.image} resizeMode='fit' />
                </TouchableOpacity>
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
        </View>
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
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderRightWidth: 4,
        borderColor: colors.primary,
    },

});