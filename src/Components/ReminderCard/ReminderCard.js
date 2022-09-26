import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Theme';

const ReminderCard = (props) => {
    return (
        <View style={styles.ViewContainer}>
            <View style={styles.DateView}>
                <Text style={styles.TextDate}>{props.Date}</Text>
                <Text style={styles.TextDay}>{props.Day}</Text>
            </View>
            <View style={styles.container} >
                <Image source={props.Image} style={styles.Img} />
                <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                    {props.Company ?
                        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading1}>{props.Company}</Text>
                        : null}
                    <Text style={styles.Time}>Time: {props.Time}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    ViewContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',

    },
    container: {
        width: '85%',
        padding: 8,
        borderRadius: 10,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        marginBottom: 15,
    },
    Img: {
        width: "32%",
        height: 80,
        resizeMode: 'cover',
        borderRadius: 6,
    },
    Heading: {
        fontSize: 18,
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
    DateView: {
        width: '10%',
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
    TextDay: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.white,

    }
})


export default ReminderCard;