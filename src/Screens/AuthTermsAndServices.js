import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, Linking } from 'react-native';
import { BG } from '../Assets';
import Header from '../Components/Header';
import { Button } from '../Components'
import { Colors, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Theme';
import { connect } from 'react-redux';
import { GeneralMiddleware } from '../Redux/middleware/GeneralMiddleware';
import RenderHTML from 'react-native-render-html';
import { Heading, Text as NBText } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

class AuthTermsAndServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.GetPages();
    }

    render() {
        return (
            <ImageBackground
                source={BG}
                style={styles.container}
            >
                <SafeAreaView>
                    <Header
                        onPress={() => this.props.navigation.goBack()}
                        title={'Terms & Services'}
                        ArrowBackIcon />
                    <ScrollView style={styles.body}>
                        {/* <Text style={styles.text}>
                        {this.props.pages?.terms}
                    </Text> */}
                        <RenderHTML
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
                        <View style={{ width: '100%', flexDirection: 'row', marginBottom: 20 }}>
                            <Button
                                //ArrowRight
                                width={'80%'}
                                height={50}
                                name={'Accept'}
                                textStyle={{
                                    fontSize: 16,
                                }}
                                btnStyle={{ marginTop: 10 }}
                                onPress={() => this.props.route.params.Register()}
                            />
                            <Button
                                // ArrowRight
                                width={'80%'}
                                height={50}
                                name={'Decline'}
                                textStyle={{
                                    fontSize: 16,
                                    color: Colors.white
                                }}
                                btnStyle={{ marginTop: 10 }}
                                onPress={() => this.props.navigation.goBack()}
                                ColorSecondary={Colors.GRAY_1}
                                ColorPrimary={Colors.GRAY_1}
                            />

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}
const mapStateToProps = state => ({
    pages: state.GeneralReducer.pages
})

const mapDispatchToProps = dispatch => ({
    GetPages: () => dispatch(GeneralMiddleware.GetPages()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthTermsAndServices);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        //alignItems: 'center',
    },
    body: {
        marginBottom:100,
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
        marginHorizontal: 15,
        marginTop: 5,
        lineHeight: 25,
        marginBottom: 20,

    },

})