import React from 'react';
import { TextInput, StyleSheet, View, Text, I18nManager, Image } from 'react-native';
import { Colors } from '../../Theme';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let alertborder = 0;
const Input = (props) => {
    //alertborder=props.alertborder
    return (

        <View style={[styles.container, props.style, props.backgroundColor ? { backgroundColor: props.backgroundColor } : props.width ? { width: props.width } : null, props.height ? props.height : null]}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={styles.textName}>{props.name}</Text>

            </View>

            <View style={styles.innerContainer}>
                {props.PhoneNumber ?
                    <Text style={styles.PhoneText}>{props.code}</Text>
                    :
                    null}
                {props.Mail ?
                    <View style={styles.IconPicx}>
                        <Entypo name={'mail'} size={16} color={'#000'} />
                    </View>
                    :
                    props.Lock ?
                        <View style={styles.IconPicx}>
                            <Entypo name={'lock'} size={16} color={'#000'} />
                        </View>
                        :
                        props.User ?
                            <View style={styles.IconPicx}>
                                <FontAwesome name={'user'} size={16} color={'#000'} />
                            </View>
                            :
                            props.PhoneNumber ?
                                <View style={styles.IconPicx}>
                                    <FontAwesome name={'mobile-phone'} size={20} color={'#000'} />
                                </View>
                                :
                                <Image source={props.image} style={[styles.imageStyle, props.imageStyle]} />
                }
                <TextInput
                    placeholder={props.inputPlaceHolder}
                    style={
                        styles.inputStyle || props.style}
                    value={props.value}
                    secureTextEntry={props.secure}
                    returnKeyType={!!props.returnKeyType ? props.returnKeyType : 'default'}
                    keyboardType={!!props.keyboardType ? props.keyboardType : 'default'}
                    onChangeText={(text) => props.onChange(text, props.inputName)}
                    placeholderTextColor={props.placeholderTextColor}
                    autoCorrect={props.autoCorrect || false}
                    editable={props.editable}
                    maxLength={props.maxLength}
                    onKeyPress={props.onKeyPress}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
         height: 78,
        marginBottom: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 10,
        shadowColor: '#f3f3f3',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0.5,
        },
        elevation: 0,
        borderWidth: 1.2,
        borderColor: Colors.black,
        //backgroundColor: 'white',

    },

    inputStyle: {
        height: 50,
        fontSize: 15,
        color: Colors.black,
        //color: 'darkgrey',
        marginLeft: 5,

    },
    imageStyle: {
        alignSelf: 'center',
        marginBottom: 5,
        paddingRight: 3
    },
    textName: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.black,
        textTransform: 'capitalize',
        marginBottom: 5,

    },
    PhoneText: {

        fontSize: 15,
        color: Colors.black,
        marginLeft: 5,
    },
    IconPicx: {
        marginLeft: 10,
    },
})

export default Input;