import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { backgroundColor } from 'styled-system';
import { AntDesign, Colors } from '../../Theme';

const RehabListCard = (props) => {
    return (
        <TouchableOpacity style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <View style={{ width: '90%', marginHorizontal: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                <AntDesign name={'rightcircle'} size={20} color={Colors.black} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 13,
        borderRadius: 6,
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


export default RehabListCard;