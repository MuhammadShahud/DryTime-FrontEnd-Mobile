import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../Theme';

const CalendarListCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            {/* <Image source={props.Image} style={styles.Img} /> */}
            <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                <Text style={{ marginVertical: 5 }}>{props.type}</Text>
                {props.Company ?
                    <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading1}>{props.Company}</Text>
                    : null}
                <Text style={styles.Time}>{props.Time}</Text>
                {props.Note ?
                    <Text style={[styles.Time,{marginTop:5}]}>{props.Note}</Text>
                    : null}
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
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
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
})


export default CalendarListCard;