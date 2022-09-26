import React, { useState } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    Modal,
    View,
    ActivityIndicator
} from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { BG } from '../Assets';
import Header from './Header';
import FastImage from "react-native-fast-image";
import Video from 'react-native-video';


const { width, height } = Dimensions.get("window")

const MediaViewer = ({ visible, media, type, onClose }) => {

    const [buffering, setBuffering] = useState(true)

    return (
        <Modal
            onRequestClose={onClose}
            animationType='slide'
            visible={visible}>
            <SafeAreaView />
            <ImageBackground source={BG} style={styles.container}>
            <Header
                    onPress={() => onClose()}
                    ArrowBackIcon
                    headerStyle={{ backgroundColor: "rgba(255,255,255,0.4)" }}
                />
                {
                    type == "image" ?
                        // <Image
                        //     style={styles.image}
                        //     source={{ uri: media }}
                        //     resizeMode={'contain'} />
                        <FastImage
                            source={{
                                uri: media,
                                cache: FastImage.cacheControl.immutable,
                                priority: FastImage.priority.high
                            }}
                            resizeMode="contain"
                            style={styles.image}
                        />
                        :
                        <View style={{ flex: 1 }}>
                            <Video
                                source={{
                                    uri: media,
                                }}
                                controls={true}
                                style={{ height: "100%", width: "100%" }}
                                resizeMode="contain"
                                paused={false}
                                poster='https://static.vecteezy.com/system/resources/previews/003/589/714/original/play-button-icon-vector.jpg'
                                onLoadStart={() => {
                                    setBuffering(true)
                                }}
                                onLoad={(data) => {
                                    setBuffering(false)
                                }}
                                onBuffer={()=>console.warn("ok")}
                            />
                            {buffering ?
                                <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: 'center', }}>
                                    <ActivityIndicator
                                        size={90}
                                        color="#fff"
                                    />
                                </View>
                                : null}
                        </View>
                    // <VideoPlayer
                    //     video={{
                    //         uri: media,
                    //     }}
                    //     videoWidth={width}
                    //     videoHeight={height}
                    //     customStyles={{ borderRadius: 6, }}
                    //     style={{ backgroundColor: "#2b2b2b" }}
                    //     resizeMode={'contain'}
                    //     // autoplay
                    //     defaultMuted={false}
                    // />

                }
               
            </ImageBackground>
        </Modal>
    );
};
export default MediaViewer;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b2b2b"
    },
    image: {
        width: "100%",
        height: "100%",
        alignSelf: 'center',
        backgroundColor: "#2b2b2b"
    },
    filterSelector: {
        width: 100,
        height: 100,
        marginBottom: 5,
    },
    filterTitle: {
        fontSize: 12,
        textAlign: 'center',
        color: "#fff"
    },
});