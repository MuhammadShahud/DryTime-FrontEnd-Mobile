import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, BackHandler } from 'react-native';
import { BG, Logo } from '../Assets';

export default class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount(){
        BackHandler.addEventListener("hardwareBackPress",this.BackHand);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener("hardwareBackPress",this.BackHand);
    }

    BackHand=()=>{
        this.props.navigation.navigate("Login");
        return true
    }

    render() {
        return (
            <ImageBackground source={BG} style={{ flex: 1 }}>
                <Image source={Logo} style={{
                    width: 250,
                    height: 200,
                    marginTop: 30,
                    marginBottom: 15,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                }} />
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center',marginBottom:50 }}>
                    <Text style={{ color: "#000", marginBottom: 20, fontSize: 15 }}>
                        Please verify your email to continue
                    </Text>
                    <TouchableOpacity 
                    onPress={()=>{
                        this.props.navigation.navigate("Login")
                    }}
                    style={{ width: "50%", paddingVertical: 15, borderRadius: 5, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: "#000", fontWeight: "bold" }}>
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }
}
