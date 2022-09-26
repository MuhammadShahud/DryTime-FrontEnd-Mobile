import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors } from '../../Theme';

const RehabPatientsCards = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <Image source={props.Image} style={styles.Img} />
            <View style={{ marginLeft: 10, justifyContent: 'center', width: '75%' }}>
                <Text style={styles.Heading}>{props.Heading}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 5,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 2,
    },
    Img: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 360,
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


export default RehabPatientsCards;