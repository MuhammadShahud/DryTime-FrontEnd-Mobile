import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image } from 'react-native';
import { BG, getStarted } from '../Assets';
import { Button } from '../Components';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../Theme';

export default class GetStarted extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ImageBackground
                source={BG}
                style={styles.container}
            >
                <View style={styles.body}>
                    <Image source={getStarted} style={styles.ImageBody} />
                    <View style={styles.bodyBtn}>
                        <Button
                            ArrowRight
                            width={'100%'}
                            height={50}
                            name={'Get Started'}
                            textStyle={{
                                fontSize: 16,
                            }}
                            btnStyle={{ marginTop: 20 }}
                            onPress={() => this.props.navigation.navigate('StartDays')}
                        />
                    </View>
                </View>
            </ImageBackground>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        //alignItems: 'center',
    },
    body: {
        marginTop: 100,
        flex: 1,
        width: '100%',
        alignSelf: 'center',
    },
    ImageBody: {
        flex: 0.9,
        rotation: 3,
        //backgroundColor: 'pink',
        resizeMode: 'contain',
        width: '105%',

    },
    bodyBtn: {
        // flex: 1,
        width: '90%',
        alignSelf: 'center',
    },
})