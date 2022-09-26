/* eslint-disable prettier/prettier */
import { Dimensions, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { Fontisto, Colors, FontAwesome5 } from '../Theme';
import { Icon, Slider } from 'native-base';
import TrackPlayer, { State } from 'react-native-track-player';
import SoundPlayer from 'react-native-sound-player';

const { width, height } = Dimensions.get("window");

export default class AudioPlayer extends Component {


    constructor(props) {
        super(props);
        // this.setupPlayer();
    }

    state = {
        playing: false,
        position: 0,
        duration: 0
    }

    async componentDidMount() {

        // SoundPlayer.loadUrl(this.props.uri);
        // if (this.props.uri.includes("file:///"))
        //     this.setState({ duration: this.props.duration })
        // else {
        //     let info = await SoundPlayer.getInfo();
        //     this.setState({ duration: info.duration })
        // }
    }

    // onFinishedPlaying = (data) => {
    //     if (data.success) {
    //         this.setState({ playing: false, position: 0 })
    //         clearInterval(this.interval);
    //     }
    // }

    addZero = (string) => {
        if (string.length == 1) {
            return "0" + string;
        }
        else {
            return string;
        }
    }

    // PlayPause = async () => {
    //     this.props.onLastPLayed()
    //     if (this.state.playing) {
    //         this.setState({ playing: false })
    //         SoundPlayer.pause();
    //         clearInterval(this.interval);
    //     }
    //     else {
    //         this.setState({ playing: true })
    //         // if (this.props.lastPlayedIndex == this.props.index) {
    //         SoundPlayer.playUrl(this.props.uri)
    //         //}
    //         //else
    //         //    SoundPlayer.resume();

    //         this.interval = setInterval(async () => {
    //             let info = await SoundPlayer.getInfo();
    //             this.setState({ position: info.currentTime })
    //         }, 1000)
    //     }

    // }

    // componentWillUnmount() {
    //     clearInterval(this.interval)
    //     SoundPlayer.stop();
    // }


    render() {
        let { position, duration } = this.state;

        // let m = position / 60;
        // let s = position % 60;

        // let minutes = duration / 60;
        // let seconds = duration % 60;
        // let progress = (position / duration * 100);

        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onPlayPause();
                }}
                // key={this.props.uri}
                style={{ width: width * 0.3, alignItems: "center" }}
            //flexDirection: "row", alignItems: "center" }}
            >
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onPlayPause();
                        }}
                    >
                        <FontAwesome5
                            name={"play"}
                            size={35}
                            color="#000"
                        />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 20, marginBottom: 10 }}>Play audio</Text>
                </View>
                {/* <TouchableOpacity
                    onPress={() => {
                        this.props.onPlayPause(
                            () => this.setState({ playing: !this.state.playing }),
                            () => this.setState({ playing: false }));
                    }}
                >
                    <FontAwesome5
                        name={this.state.playing ? "pause" : "play"}
                        size={20}
                        color="#000"
                    />
                </TouchableOpacity> */}
                {/* <Slider
                    key={this.props.uri}
                    style={{ marginStart: 20, marginEnd: 10, flex: 1 }}
                    colorScheme={Colors.Primary}
                    defaultValue={0}
                    value={progress ? progress : 0}
                    minValue={0}
                    maxValue={100}
                    onChangeEnd={(value) => {
                        this.setState({ position: duration / 100 * value })
                        SoundPlayer.seek(duration / 100 * value);
                    }}
                >
                    <Slider.Track color={Colors.Primary}>
                        <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb w={3} h={3} color={Colors.Primary} />
                </Slider> */}
                {/* <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                    <Text style={{ color: '#000', fontSize: 12 }}>
                        {this.addZero(Math.abs(Math.floor(minutes)) + "") + ":" + this.addZero(Math.abs(Math.floor(seconds)) + "")}
                    </Text>
                </View> */}
            </TouchableOpacity>
        )
    }
}