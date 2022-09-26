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

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            addingComment: false,
            optionsModal: false,
            selected_comment: null,
            refreshing:false
        };
    }

    componentDidMount() {
        let post_id = this.props.route.params.post_id;
        this.props.GetAllComments({ post_id })
    }

    onRefresh = async () => {
        this.setState({ refreshing: false })
        let post_id = this.props.route.params.post_id;
        this.props.GetAllComments({ post_id })
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity onLongPress={() => {
                this.setState({ optionsModal: true, selected_comment: item.id })
            }}>
                <View style={styles.CommentView}>
                    <Image source={{ uri: img_url + item.user?.profile_pic }} style={styles.ImgComment} />
                    <View style={styles.commentDiv}>
                        <View style={styles.comments}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontWeight: 'bold', color: Colors.black }}>
                                {item.user?.username} <Text style={styles.commentLike}>{moment(item.created_at).fromNow()}</Text></Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, }}>{item.comment}</Text>
                        </View>
                        {/* <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text style={styles.commentLike}>21m</Text>
                     <Text style={styles.commentLike}>Like</Text>
                    <Text style={styles.commentLike}>Reply</Text> 
                </View>*/}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    onEndReached = () => {
        if (this.props.comments.next_url) {
            let post_id = this.props.route.params.post_id;
            this.props.GetMoreComments({ post_id, next_url: this.props.comments?.next_url });
        }
    }

    AddComment = async () => {
        let { comment } = this.state;
        let post_id = this.props.route.params.post_id;
        if (comment) {
            await this.props.AddComment({
                user: this.props.user.user,
                comment, post_id, Loading: (loading) => {
                    this.setState({ addingComment: loading })
                }
            });
            this.setState({ comment: "" })
            //this.flatlist.scrollToEnd({ animated: true });
        }
        else {
            alert("Please write comment")
        }
    }

    onDelete = async () => {
        let { selected_comment } = this.state;
        await this.props.DeleteComment({ comment_id: selected_comment });
        this.setState({ optionsModal: false })
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
                    title={'Comments'}
                />
                <View style={styles.body}>
                    <FlatList
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                        ref={component => this.flatlist = component}
                        data={this.props.comments?.data}
                        ListHeaderComponent={() => <View></View>}
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
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.1}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        horizontal={false}
                        // numColumns={3}
                        showsHorizontalScrollIndicator={false}
                    />
                    <View style={{ backgroundColor: "#fff", flexDirection: "row", alignItems: "center", marginHorizontal: "-6%" }}>
                        <TextInput
                            value={this.state.comment}
                            onChangeText={(comment) => this.setState({ comment })}
                            placeholder='Write your comment here'
                            style={{ height: 45, flex: 1, paddingHorizontal: 10 }} />
                        <TouchableOpacity
                            disabled={this.state.addingComment}
                            onPress={this.AddComment}
                            style={{ paddingHorizontal: 10 }}>
                            <Icon as={MaterialCommunityIcons} name='send' size="sm" color={this.state.addingComment ? "#aaa" : "#000"} />
                        </TouchableOpacity>
                    </View>
                    <Modal animationType='fade' visible={this.state.optionsModal} transparent>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "#000", opacity: 0.4 }} />
                            <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 5, padding: 20 }}>
                                <TouchableOpacity
                                    onPress={this.onDelete}
                                    style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontWeight: "bold", color: "#000" }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    comments: state.PostReducer.comment
})

const mapDispatchToProps = dispatch => ({
    GetAllComments: data => dispatch(PostMiddleware.getAllComment(data)),
    GetMoreComments: data => dispatch(PostMiddleware.getMoreComment(data)),
    AddComment: data => dispatch(PostMiddleware.AddComment(data)),
    DeleteComment: data => dispatch(PostMiddleware.DeleteComment(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Comments);

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