import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Alex, Banner } from '../../Assets';
import { AntDesign, Colors, FontAwesome, FontAwesome5, MaterialIcons } from '../../Theme';
import { MenuView } from '@react-native-menu/menu';
import { Icon } from 'native-base';
import VideoPlayer from 'react-native-video-player';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';

const { height, width } = Dimensions.get("window");

const PostCard = (props) => {

    const [buffering, setBuffering] = useState(true)

    return (
        <View style={styles.container} disabled={props.disabled} onPress={props.onPress}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.containerHeadBody}>
                    <FastImage
                        source={{
                            cache: FastImage.cacheControl.immutable,
                            priority: FastImage.priority.high,
                            ...props.Image ? props.Image : {}
                        }}
                        resizeMode="contain"
                        style={styles.Img}
                    />
                    <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.Heading}>{props.Heading}</Text>
                        <Text style={styles.Time}>{props.Time}</Text>
                    </View>
                </View>
                {props.onPressDelete || props.onPressEdit ?
                    <MenuView
                        isAnchoredToRight
                        title="Menu Title"
                        onPressAction={({ nativeEvent }) => {
                            if (nativeEvent.event == "delete")
                                props.onPressDelete()
                            else if (nativeEvent.event == "edit")
                                props.onPressEdit()
                        }}
                        actions={[
                            {
                                id: 'delete',
                                title: 'Delete',
                                attributes: {
                                    destructive: true,
                                },
                                image: Platform.select({
                                    ios: 'trash',
                                    android: 'ic_menu_delete',
                                }),
                            },
                            ...props.Promote ?
                                [{
                                    id: 'edit',
                                    title: 'Edit',
                                    image: Platform.select({
                                        ios: 'edit',
                                        android: 'ic_menu_edit',
                                    }),
                                }] : [{}]
                        ]}
                        shouldOpenOnLongPress={false}
                    >
                        <Icon name='more-vert' size="md" as={MaterialIcons} />
                    </MenuView> : null}
            </View>
            <Text numberOfLines={3} style={{ marginVertical: 10, fontSize: 12 }}>
                {props.Description}
            </Text>
            {
                props.isVideo ?
                    <>
                        <Video
                            source={props.ImagePost}
                            controls
                            style={{ marginBottom: 10, height: height * 0.35, width: "100%" }}
                            resizeMode="contain"
                            onBuffer={(data) => {
                                console.warn(data.isBuffering)
                            }}
                            paused
                            poster='https://static.vecteezy.com/system/resources/previews/003/589/714/original/play-button-icon-vector.jpg'
                            onLoadStart={async (data) => {
                                setBuffering(true)
                            }}
                            onLoad={async (data) => {
                                setBuffering(false)
                            }}
                        />
                        {buffering ?
                            <View style={{ ...StyleSheet.absoluteFill, top: props.comment != '' ? "18%" : "25%", bottom: props.comment != '' ? "32%" : "15%", left: "10%", right: "10%", backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: 'center', }}>
                                <ActivityIndicator
                                    size={90}
                                    color="#fff"
                                />
                            </View>
                            : null}
                    </>
                    // <VideoPlayer
                    //     videoHeight={height * 0.35}
                    //     videoWidth={height * 0.35}
                    //     defaultMuted={false}
                    //     resizeMode="contain"
                    //     video={props.ImagePost}
                    //     onBuffer={()=>{
                    //         alert("asdasd")
                    //     }}
                    //     onVideoBuffer={()=>{
                    //         alert("klasdaskdm")
                    //     }}
                    // />
                    :
                    <FastImage
                        source={props.ImagePost ? {
                            cache: FastImage.cacheControl.immutable,
                            priority: FastImage.priority.high,
                            ...props.ImagePost ? props.ImagePost : {}
                        } : require("../../Assets/Images/banner.png")}
                        resizeMode="contain"
                        style={{ ...styles.ImgPost, ...props.imgStyles, }}
                    />
            }
            <View style={styles.LCSView}>
                <View style={styles.LCSRow}>
                    <TouchableOpacity
                        onPress={() => props.onPressLike()}
                        style={{
                            flexDirection: 'row',
                        }}>
                        <AntDesign name={'like1'} size={18} color={props.Like ? Colors.Primary : Colors.black} />
                        <Text style={props.Like ? styles.LikeTextSelected : styles.LikeText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={props.onPressComment}
                        style={{
                            flexDirection: 'row',
                        }}>
                        <FontAwesome name={'comment'} size={18} color={Colors.black} />
                        <Text style={styles.LikeText}>Comment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={props.onPressShare}
                        style={{
                            flexDirection: 'row',
                        }}>
                        <FontAwesome5 name={'share'} size={18} color={Colors.black} />
                        <Text style={styles.LikeText}>Share</Text>
                    </TouchableOpacity>

                </View>
                {props.Promote ?
                    <TouchableOpacity
                        onPress={() => props.onPressPromote()}
                        style={styles.PromoteView}>
                        <Text style={styles.PromoteText}>Promote</Text>
                    </TouchableOpacity>
                    : null}
            </View>
            {props.comment != '' ?

                <View style={styles.CommentView}>
                    <Image source={props.CommentImg} style={styles.ImgComment} />
                    <View style={styles.commentDiv}>
                        <View style={styles.comments}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontWeight: 'bold', color: Colors.black }}>{props.CommentName} <Text style={styles.commentLike}>{props.CommentTime}</Text></Text>
                            <Text numberOfLines={2} style={{ fontSize: 12, }}>{props.Comment}</Text>
                        </View>
                        {/* <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'flex-start' }}>
                            <Text style={styles.commentLike}>21m</Text>
                             <Text style={styles.commentLike}>Like</Text>
                            <Text style={styles.commentLike}>Reply</Text> 
                        </View>*/}
                    </View>

                </View>
                : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 13,
        borderRadius: 10,
        backgroundColor: Colors.white,
        marginBottom: 15,
    },
    containerHeadBody: {
        flexDirection: 'row',
        flex: 1,
    },
    Img: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 360,
    },
    Heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Heading1: {
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Time: {
        fontSize: 11,
        fontWeight: 'normal',
    },
    ImgPost: {
        height: height * 0.40,
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
    },
    LCSView: {
        width: '100%',
        height: 40,
        // backgroundColor: 'pink',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    PromoteView: {
        width: 75,
        height: 30,
        backgroundColor: Colors.Primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    PromoteText: {
        fontSize: 13,
        color: Colors.white,
        fontWeight: 'bold',
    },
    LCSRow: {
        flex: 1,
        //backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    LikeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.black,
        top: 3,
        marginLeft: 3
    },
    LikeTextSelected: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.Primary,
        top: 3,
        marginLeft: 3
    },
    CommentView: {
        // height: 80,
        paddingVertical: 10,
        // backgroundColor: 'pink',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    ImgComment: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 360,
    },
    comments: {
        backgroundColor: '#f2f2f2',
        height: '90%',
        width: '100%',
        paddingHorizontal: 8,
        borderRadius: 8,
        justifyContent: 'center',

    },
    commentDiv: {
        height: 80,
        width: '80%',
        marginLeft: 5,

    },
    commentLike: {
        fontSize: 10,
        fontWeight: 'normal',
        color: "#aaa"
    },
})


export default PostCard;