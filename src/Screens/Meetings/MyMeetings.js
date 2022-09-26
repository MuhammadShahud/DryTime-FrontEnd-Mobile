import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { ActivityListCard, Button, RehabListCard, SearchBar } from '../../Components';
import Header from '../../Components/Header';
import MeetingListCard from '../../Components/MeetingListCard';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { AntDesign, Colors, Entypo } from '../../Theme';
import ZoomUs from 'react-native-zoom-us';
import LinearGradient from 'react-native-linear-gradient';

class MyMeetings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            refreshing: false,
            connecting: false,
            modal:false
        };
    }

    componentDidMount() {
        let type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : ""
        let mine = this.props.route.params?.mine ? this.props.route.params?.mine : ""
        this.props.GetMeetings({ search: '', type, mine })
    }

    _renderItem = ({ item, index }) => {
        return (
            <MeetingListCard
                connecting={this.state.connecting}
                data={item}
                navigation={this.props.navigation}
                onPressDelete={() => this.DeleteMeeting(item.id, index)}
                c_user_id={this.props.user.user.id}
                onMeetingPress={(mine) => {
                    this.startMeeting(this.props.user.user?.id == item?.user.id, item?.meeting_id)
                }
                }
            />
        );
    };

    DeleteMeeting = (id, index) => {
        this.props.DeleteMeetings({
            id,
            index
        });
    }

    startMeeting = async (meetingNumber) => {
        let init = await ZoomUs.isInitialized();
        if (init) {
            this.setState({ connecting: true })
            this.props.GetJWTToken({
                callback: (jwt_token) => {
                    if (!jwt_token) {
                        this.setState({ connecting: false })
                        return;
                    }
                    this.props.GetAccessToken({
                        token: jwt_token,
                        zoom_id: this.props.user.user.zoom_id,
                        callback: (token) => {
                            this.setState({ connecting: false })
                            if (token)
                                ZoomUs.startMeeting({
                                    userName: this.props.user.user.username,
                                    meetingNumber,
                                    userId: this.props.user.user.zoom_id,
                                    zoomAccessToken: token.token,
                                    //  userType: 2,
                                })
                        }
                    })
                }
            })
        }
    }

    onSearch = (search) => {
        let type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : ""
        this.setState({ search })
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.GetMeetings({ search, type })
        }, 500)

    }

    onEndReached = () => {
        if (this.props.meetings.next_url) {
            let mine = this.props.route.params?.mine ? this.props.route.params?.mine : ""
            this.props.GetMoreMeetings({ next_url: this.props.meetings.next_url, search: this.state.search, type, mine })
        }
    }

    onRefresh = () => {
        let type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : ""
        this.setState({ refreshing: true })
        this.props.GetMeetings({ search: '', type })
        this.setState({ refreshing: false })
    }

    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <Header
                    onPressNotification={() =>
                        this.props.navigation.navigate('Notifications')
                    }
                    onPress={() => this.props.navigation.goBack()}
                    onPressDrawer={() => this.props.navigation.toggleDrawer()}
                    ArrowBackIcon
                    BellIcon
                    Menu
                    title={'Meetings'}
                />
                <View style={styles.body}>
                    <SearchBar
                        onChangeText={this.onSearch}
                    />
                    <FlatList
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        data={this.props.meetings.data}
                        ListHeaderComponent={() => <Text style={styles.Heading}></Text>}
                        ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
                        ListHeaderComponentStyle={{
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.2}
                        ListEmptyComponent={
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>No data found</Text>
                            </View>}
                    />
                </View>
                <TouchableOpacity onPressIn={() => {
                    if (this.props.user?.user?.user_subscription)
                        this.props.navigation.navigate("AddMeeting")
                    else
                        this.setState({ modal: true })
                }}>
                    <AntDesign
                        name={'pluscircle'}
                        size={45}
                        color={Colors.black}
                        style={{ bottom: 0, margin: 20, position: 'absolute', right: 5 }}
                    />
                </TouchableOpacity>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.modal}
                    onRequestClose={() => this.setState({ modal: false })}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.50)',
                        }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={[Colors.white, Colors.white]}
                            style={{
                                height: 230,
                                width: '90%',
                                backgroundColor: Colors.Secondary,
                                borderRadius: 14,
                                alignItems: 'center',
                                // justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                                style={{ alignSelf: 'flex-end', marginRight: 8 }}
                                onPress={() => this.setState({ modal: false })}>
                                <Entypo
                                    name={'circle-with-cross'}
                                    size={24}
                                    color={'#000'}
                                    style={{ marginLeft: 5, marginTop: 7 }}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: Colors.black,
                                    marginTop: 30,
                                    fontWeight: 'bold',
                                }}>
                                Please upgrade your plan
                            </Text>
                            <View style={{ width: '100%' }}>
                                <Button
                                    width={'90%'}
                                    height={50}
                                    name={'Next'}
                                    textStyle={{
                                        fontSize: 16,
                                    }}
                                    ColorSecondary={Colors.Primary}
                                    ColorPrimary={Colors.Primary}
                                    btnStyle={{ marginTop: 20 }}
                                    onPress={() => {
                                        this.setState({ modal: false }),
                                            this.props.navigation.navigate('Subscription Plans');
                                    }}
                                />
                            </View>
                        </LinearGradient>
                    </View>
                </Modal>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    meetings: state.ActivityReducer.meetings
})

const mapDispatchToProps = dispatch => ({
    GetMeetings: (data) => dispatch(ActivityMiddleware.getMeetings(data)),
    GetMoreMeetings: (data) => dispatch(ActivityMiddleware.getMoreMeetings(data)),
    DeleteMeetings: (data) => dispatch(ActivityMiddleware.deleteMeeting(data)),
    GetAccessToken: (data) => dispatch(ActivityMiddleware.getZoomAccessToken(data)),
    GetJWTToken: (data) => dispatch(ActivityMiddleware.getJWTToken(data))

});

export default connect(mapStateToProps, mapDispatchToProps)(MyMeetings);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
    },
    Heading: {},
});
