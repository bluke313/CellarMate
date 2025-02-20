import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity, Image, Button, Animated } from "react-native";
import { router } from "expo-router";
import Svg, { Rect } from "react-native-svg";

// Custom imports
import { colors } from "../assets/theme";
import { photosDir } from '../components/Database';

const HighlightedView = ({ isHighlighted, children }) => {
    const borderColorAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(borderColorAnim, {
            toValue: isHighlighted ? 1 : 0,
            duration: 350,
            useNativeDriver: false,
        }).start();
    }, [isHighlighted]);

    const borderColor = borderColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.primary, colors.secondary],
    });

    return <Animated.View style={[styles.container, { borderColor }]}>{children}</Animated.View>;

}

export function WineItem(props) {

    const [imageView, setImageView] = useState(false);

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

        <HighlightedView isHighlighted={props.isHighlighted} >
            <View style={{ flexDirection: "row" }}>
                <View style={{height: 75, width: 75, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, borderRightWidth: 4, borderColor: colors.primary}}>
                    <TouchableOpacity onPress={() => { if (props.data.photoUri) props.setOverlayImage() }} activeOpacity={props.data.photoUri ? 0.4 : 1}>
                        <Image 
                            source={props.data.photoUri ? { uri: `${photosDir}/${props.data.photoUri}` } : images.wineBottle} 
                            style={{borderTopLeftRadius: 15, borderBottomLeftRadius: 15, height: '100%', width: '100%'}} resizeMode='fit' 
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.leftCaptions}>
                        <Text style={styles.text} numberOfLines={1} ellipsizeMode='tail'>{props.data.variety}</Text>
                        <Text style={styles.text} numberOfLines={1}>{props.data.origin}</Text>
                        <Text style={styles.text} numberOfLines={1}>{convertRating(props.data.rating)}</Text>
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
                        <Text style={styles.text} numberOfLines={1}>{props.data.brand}</Text>
                        <Text style={styles.text} numberOfLines={1}>{props.data.vintage}</Text>
                    </View>
                    <View style={{}}>
                        <Button title="DELETE" onPress={props.deleteItem} />
                    </View>
                </View>
            </View>
        </HighlightedView>
    )
};

export function FocusedWineItem(props) {

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
        width: '35%',
        height: 75,
    },
    rightCaptions: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '30%',
        height: 75,
    },

});