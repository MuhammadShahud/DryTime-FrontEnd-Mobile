import { Icon, Slider } from 'native-base';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TrackPlayer, { State, Event } from 'react-native-track-player';
import { BG } from '../../Assets';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { Fontisto, Colors, FontAwesome5 } from '../../Theme';
import SoundPlayer from 'react-native-sound-player';
import { connect } from 'react-redux';

class MusicDetail extends Component {


  constructor(props) {
    super(props)
    this.state = {
      duration: 0,
      position: 0,
      playing: false,
      data: {},
      index: this.props.route.params?.index
      //barPosition: 0
    }
    let music = this.props.route.params?.item;
    this.setupPlayer(img_url + music.file, music, true)
  }

  componentDidMount() {
    SoundPlayer.addEventListener("FinishedPlaying", () => {
      this.skipNext();
    })
  }

  componentWillUnmount() {
    SoundPlayer.stop()
  }

  async setupPlayer(url, music, firstTime = false) {
    try {
      if (firstTime)
        SoundPlayer.loadUrl(url)
      else
      SoundPlayer.playUrl(url)
      let data = await SoundPlayer.getInfo();
      let duration = data.duration;
      this.setState({ data: music, duration })

    } catch (error) {
      console.warn(error)
    }


  }

  PlayPause = () => {
    //let state = await TrackPlayer.getState();
    if (this.state.playing) {
      clearInterval(this.interval);
      this.setState({ playing: false }, () => {
        SoundPlayer.pause();
      })

    }
    else {
      SoundPlayer.play();
      this.interval = setInterval(async () => {
        let data = await SoundPlayer.getInfo();
        let duration = data.currentTime;
        this.setState({ position: duration, playing: true })
      }, 1000)
    }
  }

  addZero = (string) => {
    if (string.length == 1) {
      return "0" + string;
    }
    else {
      return string;
    }
  }

  skipNext = async () => {
    // await TrackPlayer.skipToNext();
    // await this.setupPlayer();
    // if (this.state.duration == 0) {
    //   let duration = await TrackPlayer.getDuration();
    //   this.setState({ duration })
    // }
    SoundPlayer.stop()
    setTimeout(() => {
      let music_index = this.state.index;
      let music_data = this.props.music?.data;
      let music = music_data[music_index + 1];
      if (!music?.file) {
        return;
      }
      let url = img_url + music.file
      this.setState({ index: this.state.index + 1 })
      this.setupPlayer(url, music);
    }, 1000);
  }

  skipPrevious = async () => {
    // await TrackPlayer.skipToPrevious();
    // this.setupPlayer();
    SoundPlayer.stop();
    setTimeout(() => {
      let music_index = this.state.index;
      let music_data = this.props.music?.data;
      let music = music_data[music_index - 1];
      if (!music?.file) {
        return;
      }
      this.setState({ index: this.state.index - 1 })
      let url = img_url + music.file
      this.setupPlayer(url, music);
    }, 1000)
  }


  render() {
    let hideImage = this.props.route.params?.hideImage;
    let { position, duration, data, playing } = this.state;
    let m = position / 60;
    let s = position % 60;
    let minutes = duration / 60;
    let seconds = duration % 60;
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          title={hideImage ? "Audio Player" : 'Music'}
          onPress={() => this.props.navigation.goBack()}
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
        />
        <View style={styles.innerCon}>
          <View style={{ padding: 30, flex: 1 }}>
            <View
              style={{
                borderRadius: 20,
                flex: 1,
                backgroundColor: '#fff',
              }}>
              {!hideImage ?
                <Image
                  source={data?.image ? { uri: img_url + data.image } : require('../../Assets/Images/musicD.png')}
                  style={{
                    width: '100%',
                    height: '70%',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    resizeMode: 'stretch',
                  }}
                />
                : null}
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text style={{ fontSize: 17, color: '#000', marginHorizontal: 10 }} numberOfLines={2}>
                  {data.file}
                </Text>
                <Text style={{ color: '#ddd', marginTop: 15, fontSize: 13 }}>
                  {data?.singer}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: '#fff', flex: 0.25, padding: 25 }}>
            <Slider
              colorScheme={Colors.Primary}
              defaultValue={0}
              value={(position / duration * 100)}
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
            </Slider>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Text style={{ color: '#000', fontSize: 12 }}>
                {this.addZero(Math.floor(m) + "") + ":" + this.addZero(Math.floor(s) + "")}
              </Text>
              {/* <Text style={{ color: '#999', fontSize: 12 }}>
                3:00 mins remained
              </Text> */}
              <Text style={{ color: '#000', fontSize: 12 }}>
                {this.addZero(Math.floor(minutes) + "") + ":" + this.addZero(Math.floor(seconds) + "")}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              {!hideImage ?
                <TouchableOpacity
                  onPress={this.skipPrevious}
                >
                  <Icon
                    as={FontAwesome5}
                    name="backward"
                    size="6"
                    color={Colors.Primary}
                  />
                </TouchableOpacity>
                : null}
              <TouchableOpacity
                onPressIn={this.PlayPause}
                style={{
                  backgroundColor: Colors.Primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 60,
                  width: 60,
                  borderRadius: 50,
                }}>
                {playing ?
                  <Icon
                    as={FontAwesome5}
                    name="pause"
                    size="5"
                    color="#ddd"
                    style={{ marginStart: 5 }}
                  /> :
                  <Icon
                    as={FontAwesome5}
                    name="play"
                    size="5"
                    color="#ddd"
                    style={{ marginStart: 5 }}
                  />}

              </TouchableOpacity>
              {!hideImage ? <TouchableOpacity
                onPress={this.skipNext}
              >
                <Icon
                  as={FontAwesome5}
                  name="forward"
                  color={Colors.Primary}
                  size="6"
                />
              </TouchableOpacity>
                : null}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  music: state.ActivityReducer.music
})


export default connect(mapStateToProps, null)(MusicDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
  },
});
