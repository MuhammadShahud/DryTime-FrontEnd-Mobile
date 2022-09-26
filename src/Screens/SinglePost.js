import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';
import { Alex, BG } from '../Assets';
import { PostCard } from '../Components';
import Header from '../Components/Header';
import { img_url } from '../Config/APIs';
import { deeplink } from '../Config/Deeplink';
import { PostMiddleware } from '../Redux/middleware/PostMiddleware';
import { Colors } from '../Theme';

const { height } = Dimensions.get("window");
const ItemHeight = height * 0.5;

class SinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false
        };
    }

    componentDidMount() {
        let post_id = this.props.route.params.post_id;
        this.props.GetSinglePost({
            post_id,
            Loading: (loading) => {
                this.setState({ loading: loading })
            },
            callback: (data) => {
                this.setState({ data })
            }
        });
    }

    _renderItem = ({ item }) => {
        return (
            <PostCard
                imgStyles={{ height: 400 }}
                Promote={false}
                Image={item.user?.profile_pic ? { uri: img_url + item.user?.profile_pic } : Alex}
                ImagePost={{ uri: img_url + item.file }}
                Heading={item.user?.username}
                Description={item.description}
                Time={moment(item.created_at).fromNow()}
                Like={item.has_liked}
                comment={item.comment ? true : false}
                CommentName={item.comment?.username}
                Comment={item.comment?.comment}
                CommentImg={item.comment?.profile_pic ? { uri: img_url + item.comment?.profile_pic } : Alex}
                CommentTime={moment(item.comment?.created_at).fromNow()}
                onPress={() => this.props.navigation.navigate('ExerciseDetails')}
                onPressComment={() => this.props.navigation.navigate('Comments', { post_id: item.id })}
                // onPressDelete={() => this.props.DeletePost({ post_id: item.id })}
                onPressLike={() => this.props.LikePost({ post_id: item.id })}
                onPressShare={() => this.onPressShare(item.id)}
            />
        );
    };

    onPressShare = (post_id) => {
        Share.share({
            message: deeplink(post_id),
            url: deeplink(post_id),
            title: "Drytime"
        });
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
                    title={'Post'}
                />
                <View style={styles.body}>
                    <FlatList
                        ref={component => this.Flatlist = component}
                        data={this.state.data}
                        ListHeaderComponent={() => <View></View>}
                        ListHeaderComponentStyle={{
                            marginBottom: 10,
                            marginTop: 10,
                        }}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
})

const mapDispatchToProps = dispatch => ({
    GetSinglePost: data => dispatch(PostMiddleware.getSinglePost(data)),
    LikePost: data => dispatch(PostMiddleware.LikePost(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SinglePost);

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
});
