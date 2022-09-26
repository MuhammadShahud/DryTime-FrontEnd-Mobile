import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Theme';
import FastImage from "react-native-fast-image";

const ForumCard = (props) => {
    return (
        <TouchableOpacity style={{ ...styles.container, ...props.containerStyle }} disabled={props.disabled} onPress={props.onPress}>
            <View style={styles.DayView}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.DayText}>{props.Day}</Text>
            </View>
            <FastImage
                source={{
                    ...props.Image,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high
                }}
                resizeMode="contain"
                style={styles.Img}
            />
            {/* <Image source={props.Image} style={styles.Img} /> */}
            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
            <Text numberOfLines={3} style={styles.Description}>{props.Description}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '47%',
        height: 180,
        padding: 7,
        marginHorizontal: 5,
        borderRadius: 10,
        backgroundColor: Colors.white,
        marginBottom: 15,
        alignItems: 'center',
        // justifyContent: 'center',
        marginTop: 36,
    },
    DayView: {
        width: "60%",
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        backgroundColor: 'white',
        fontSize: 14,
        color: Colors.black,
        top: -34,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'absolute',
    },
    DayText: {
        fontSize: 14,
        color: Colors.black,
        fontWeight: 'bold',
    },
    Img: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    Heading: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
        marginVertical: 3,

    },
    Description: {
        fontSize: 10,
        fontWeight: 'normal',
    },


})


export default ForumCard;