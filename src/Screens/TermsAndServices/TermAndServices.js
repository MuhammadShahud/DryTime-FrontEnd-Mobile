import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, Linking } from 'react-native';
import { BG } from '../../Assets';
import Header from '../../Components/Header';
import { Button } from '../../Components'
import { Colors, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Theme';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { connect } from 'react-redux';
import RenderHtml from 'react-native-render-html';
import { Heading, Text as NBText } from 'native-base';

class TermsAndServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.GetPages()
    }

    render() {
        return (
            <ImageBackground
                source={BG}
                style={styles.container}
            >
                <Header
                    onPress={() => this.props.navigation.goBack()}
                    onPressDrawer={() => this.props.navigation.toggleDrawer()}
                    title={'Terms & Services'}
                    ArrowBackIcon
                    Menu />
                <ScrollView style={styles.body}>
                    {/* <Text style={styles.text}>
                        {this.props.pages?.terms}
                    </Text> */}
                    <RenderHtml
                        contentWidth={SCREEN_WIDTH}
                        source={{ html: this.props.pages?.terms }}
                    />
                    <Heading fontSize="lg" color={"black"} mt={8} mb={5}>
                        End User License Agreement (EULA)
                    </Heading>
                    <NBText mb={10} onPress={() => {
                        Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")
                    }}>
                        https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
                    </NBText>
                    <Heading fontSize="lg" color={"black"} mt={8} mb={5}>
                        Privacy Policy
                    </Heading>
                    <NBText mb={20} onPress={() => {
                        Linking.openURL("http://drytimeapp.com/privacy")
                    }}>
                        http://drytimeapp.com/privacy
                    </NBText>
                </ScrollView>

            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    pages: state.GeneralReducer.pages
})

const mapDispatchToProps = dispatch => ({
    GetPages: () => dispatch(GeneralMiddleware.GetPages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndServices);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        //alignItems: 'center',
    },
    body: {
        flex: 1,
        width: '94%',
        alignSelf: 'center',
    },
    text: {
        flex: 1,
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: "center",
        fontSize: 14,
        color: "#000",
        marginHorizontal: 10,
        marginTop: 5,
        lineHeight: 25,
        marginBottom: 20,

    },

})