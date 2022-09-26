import moment from 'moment';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../Theme';

const CalendarMealListCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                <Text style={{ marginVertical: 5 }}>{moment(new Date().toISOString().substring(0,10)+"T"+props.time+"Z").format("hh:mm A")}</Text>
                {props.Note ?
                    <Text style={[styles.Time, { marginTop: 5 }]}>{props.Note}</Text>
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


export default CalendarMealListCard;