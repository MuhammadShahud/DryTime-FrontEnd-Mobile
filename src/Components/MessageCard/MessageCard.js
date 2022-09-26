import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Theme';

const MessageCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <Image source={props.Image} style={styles.Img} />
            <View style={{ marginLeft: 10, justifyContent: 'center', flex: 1 }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                <Text numberOfLines={1} style={{ color: props.newMessage ? "#000" : "#aaa", fontWeight: props.newMessage ? "bold" : "normal" }}>{props.Chats}</Text>
                <Text style={styles.Time}>{props.Time}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
        borderRadius: 7,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        marginBottom: 15,
    },
    Img: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 360,
    },
    Heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Heading1: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.black,
        width: '50%',
    },
    Time: {
        textAlign: 'right',
        fontSize: 10,
        fontWeight: 'normal',
        color: Colors.black,
    },
})


export default MessageCard;