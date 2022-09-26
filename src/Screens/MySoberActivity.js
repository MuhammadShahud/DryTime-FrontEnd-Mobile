import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { banner12, banner13, banner14, banner15, banner16, BG } from '../Assets';
import { ActivityListCard, Button } from '../Components';
import Header from '../Components/Header';
import { ActivityMiddleware } from '../Redux/middleware/ActivityMiddleware';
import { AntDesign, Colors, Entypo } from '../Theme';
import { img_url } from "../Config/APIs";
import { ActionTypes } from '../Redux/action_types';
import LinearGradient from 'react-native-linear-gradient';

const activities = [
    { title: 'Exercise', img: banner12 },
    { title: 'Playing', img: banner14 },
    { title: 'Music Classes', img: banner15 },
    { title: 'Cooking', img: banner16 },
    { title: 'Volunteer Work', img: banner15 },
    { title: 'Creative Writing', img: banner16 },
];

class Exercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: activities[0].title,
            refreshing: false,
            modal: false
        };
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.props.EmptySoberActivity();
            this.getSoberActivity(this.state.type)
        });
    }

    componentWillUnmount() {
        if (this.unsubscribe)
            this.unsubscribe();
    }

    getSoberActivity = (type) => {
        //let { type } = this.state;
        if (type == "Music Classes")
            type = "instrument"
        else if (type == "Volunteer Work")
            type = "work"
        else if (type == "Creative Writing")
            type = "writing"
        else
            type = type.toLowerCase()

        this.props.GetAllExercise({ type, mine: true })
    }

    _renderItem = ({ item, index }) => {
        return (
            <ActivityListCard
                Uri={img_url + item.video}
                Image={{ uri: img_url + item.thumbnail }}
                Heading={item.name}
                Time={item.duration}
                onPress={() => this.props.navigation.navigate('ExerciseDetails', { item })}
                onPressDelete={() => this.Delete(item.id, index)}
            />
        );
    };

    onEndReached = () => {
        if (this.props.soberActivity.next_url) {
            this.props.GetMoreExercise({ next_url: this.props.soberActivity.next_url, mine: true })
        }
    }

    renderActivityButton = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ type: item.title })
                    this.getSoberActivity(item.title)
                }}
                style={this.state.type == item.title ? styles.activityButtonActive : styles.activityButton}>
                <Text style={{ color: this.state.type == item.title ? "#fff" : "#000", fontSize: 15 }}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        )
    }

    onRefresh = () => {
        this.getSoberActivity(this.state.type)
    }

    Delete = (id, index) => {
        this.props.DeleteSoberActivity({ id, index })
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
                    title={"My Sober Activity"}
                />
                <View style={styles.body}>
                    <View>
                        <FlatList
                            style={{ marginVertical: 15, marginHorizontal: 10, }}
                            horizontal
                            data={activities}
                            renderItem={this.renderActivityButton}
                        />
                    </View>
                    <FlatList
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        style={{ flex: 1, }}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.1}
                        data={this.props.soberActivity?.data}
                        ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
                        ListHeaderComponentStyle={{
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>No data found</Text>
                            </View>}
                    />
                    <TouchableOpacity
                        style={{ bottom: 0, margin: 20, position: 'absolute', right: -10 }}
                        onPressIn={() => {
                            if (this.props.user?.user?.user_subscription)
                                this.props.navigation.navigate("AddSoberActivity", { type: activities.findIndex((value) => this.state.type == value.title) })
                            else
                                this.setState({ modal: true })
                        }}>
                        <AntDesign
                            name={'pluscircle'}
                            size={45}
                            color={Colors.black}
                        />
                    </TouchableOpacity>
                </View>
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
    soberActivity: state.ActivityReducer.sober_activity
})

const mapDispatchToProps = dispatch => ({
    EmptySoberActivity: () => dispatch({ type: ActionTypes.EmptySoberActivity }),
    GetAllExercise: (data) => dispatch(ActivityMiddleware.getExercises(data)),
    GetMoreExercise: (data) => dispatch(ActivityMiddleware.getMoreExercises(data)),
    DeleteSoberActivity: (data) => dispatch(ActivityMiddleware.deleteSoberActivity(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exercise);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
    },
    Heading: {
        fontSize: 17,
        color: Colors.black,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    activityButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginEnd: 10,
    },
    activityButtonActive: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#000",
        borderRadius: 5,
        marginEnd: 10,
    }
});
