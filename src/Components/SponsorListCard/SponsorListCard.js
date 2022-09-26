import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Theme';

const ActivityListCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <Image source={props.Image} style={styles.Img} />
            <View style={{ marginLeft: 10, justifyContent: 'flex-start', width: '68%' }}>
                <Text style={styles.Heading}>{props.Heading}</Text>
                <Text numberOfLines={3}>{props.Description}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 13,
        borderRadius: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        marginBottom: 15,
    },
    Img: {
        width: "30%",
        height: 90,
        resizeMode: 'contain',
        borderRadius: 6,
    },
    Heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Heading1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Time: {
        fontSize: 14,
        fontWeight: 'normal',
    },
})


export default ActivityListCard;