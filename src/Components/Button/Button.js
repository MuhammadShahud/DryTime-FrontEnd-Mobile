import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Colors, FontAwesome } from '../../Theme';
const Button = (props) => {
    return (
        <TouchableOpacity style={props.btnStyle} disabled={props.disabled} onPress={props.onPress}>
            <Animatable.View useNativeDriver duration={1000} animation={props.animation}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[props.ColorSecondary ? props.ColorSecondary : props.disabled ? Colors.GRAY_1 : Colors.white, props.ColorPrimary ? props.ColorPrimary : props.disabled ? Colors.GRAY_1 : Colors.white]} style={[style.container,
                {
                    borderRadius: props.borderRadius || 12,
                    width: props.width,
                },
                props.height ? { height: props.height } : null,

                ]}>
                    <Text style={[style.textStyle, props.textStyle]}>{props.name}</Text>
                    {props.ArrowRight ?
                        <View style={{ marginLeft: 8, }}>
                            <FontAwesome name={'arrow-circle-right'} size={20} color={props.iconColor ? props.iconColor : Colors.black} />
                        </View>
                        : null}
                </LinearGradient>
            </Animatable.View>
        </TouchableOpacity>
    );
}

const style = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",
    },
    textStyle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.black,
        textTransform: 'capitalize',
    }
})


export default Button;