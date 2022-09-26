import { Heading } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ImageBackground, Image, TouchableOpacity, Share } from 'react-native';
import { BG, faceId, Logo } from '../Assets';
import Header from '../Components/Header';
import {
    Colors,
    FontAwesome,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    AntDesign,
    Entypo,
} from '../Theme';

export default class InviteFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <Header
                    onPressNotification={() =>
                        this.props.navigation.navigate('Notifications')
                    }
                    onPressDrawer={() => this.props.navigation.toggleDrawer()}
                    Menu
                    title={''}
                    
                />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
                    <Image source={Logo} style={styles.AppLogo} />
                    <Heading>
                        Invite a friend
                    </Heading>
                    <TouchableOpacity
                        onPress={() => {
                            Share.share({
                                message: Platform.OS == "ios" ?
                                    "https://apps.apple.com/app/drytime/id1617604167"
                                    :
                                    "https://play.google.com/store/apps/details?id=com.drytime",
                                url: Platform.OS == "ios" ?
                                    "https://apps.apple.com/app/drytime/id1617604167"
                                    :
                                    "https://play.google.com/store/apps/details?id=com.drytime",
                                title: "Drytime"
                            })
                        }}
                        style={{ paddingHorizontal: 20, paddingVertical: 15, backgroundColor: "#eee", marginTop: 20 }}>
                        <Text>
                            {
                                Platform.OS == "ios" ?
                                    "https://apps.apple.com/app/drytime/id1617604167"
                                    :
                                    "https://play.google.com/store/apps/details?id=com.drytime"
                            }
                        </Text>
                    </TouchableOpacity>
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
    AppLogo: {
        width: 250,
        height: 200,
        marginTop: 30,
        marginBottom: 15,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
});  
