import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Theme';
import FastImage from "react-native-fast-image";

const ReadingCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            {/* <Image source={props.Image} style={styles.Img} /> */}
            <FastImage
                source={{
                    ...props.Image,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high
                }}
                resizeMode="contain"
                style={styles.Img}
            />
            <View style={{ marginLeft: 10, justifyContent: 'center', alignItems: "center" }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                <Text numberOfLines={1} style={styles.Heading1}>{props.BookName}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '45%',
        padding: 5,
        borderRadius: 12,
        backgroundColor: Colors.white,
        //flexDirection: 'row',
        marginBottom: 15,
        marginHorizontal: 10,
    },
    Img: {
        width: "100%",
        height: 190,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    Heading: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    Heading1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Time: {
        fontSize: 14,
        fontWeight: 'normal',
    },
})


export default ReadingCard;