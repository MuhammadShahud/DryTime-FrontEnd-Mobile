import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView } from 'react-native';
import { BG } from '../../Assets';
import Header from '../../Components/Header';
import { Button } from '../../Components'
import { Colors, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Theme';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { connect } from 'react-redux';
import RenderHtml from 'react-native-render-html';

class PrivacyPolicy extends Component {
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
                    title={'Privacy Policy'}
                    ArrowBackIcon
                    Menu />
                <ScrollView style={styles.body}>
                    {/* <Text style={styles.text}>
                        {this.props.pages?.privacy}
                    </Text> */}
                    <RenderHtml
                        contentWidth={SCREEN_WIDTH}
                        source={{ html: this.props.pages?.privacy }}
                    />

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

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);
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