/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import moment from 'moment';
import { Heading, Icon } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, ActivityIndicator, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Alex, BG } from '../Assets';
import Header from '../Components/Header';
import { img_url } from '../Config/APIs';
import { PostMiddleware } from '../Redux/middleware/PostMiddleware';
import { Colors, MaterialCommunityIcons } from '../Theme';

class Likes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        };
    }

    componentDidMount() {
        this.onRefresh()
    }

    _renderItem = ({ item }) => {
        return (
            <View style={styles.CommentView}>
                <Image source={item.user?.profile_pic ? { uri: img_url + item.user?.profile_pic } : Alex} style={styles.ImgComment} />
                <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontWeight: 'bold', color: Colors.black }}>
                    {item.user?.username}
                </Text>
            </View>
        );
    };

    onRefresh = async () => {
        this.setState({ refreshing: false })
        let post_id = this.props.route.params.post_id;
        this.props.PostLikes({ post_id });
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
                    title={'Likes'}
                />
                <View style={styles.body}>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        ref={component => this.flatlist = component}
                        data={this.props.likes}
                        ListHeaderComponent={() => <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ color: "#000" }}>
                                Total Likes
                            </Text>
                            <Heading color="#000">
                                {this.props.likes.length}
                            </Heading>
                        </View>}
                        // ListFooterComponent={() => (
                        //     <View style={{ marginBottom: 10 }}>
                        //         {
                        //             this.state.loading ?
                        //                 <ActivityIndicator size="large" color="#fff" />
                        //                 : null
                        //         }

                        //     </View>
                        // )}
                        ListHeaderComponentStyle={{
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        // numColumns={3}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    likes: state.PostReducer.likes
})

const mapDispatchToProps = dispatch => ({
    PostLikes: data => dispatch(PostMiddleware.getLikes(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Likes);

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
    CommentView: {
        // height: 80,
        // backgroundColor: 'pink',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    ImgComment: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 360,
        marginEnd: 10
    },
    comments: {
        backgroundColor: '#f2f2f2',
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        marginStart: 10
    },
    commentDiv: {
        flex: 1

    },
    commentLike: {
        fontSize: 10,
        fontWeight: 'normal',
        color: "#aaa"
    },
})