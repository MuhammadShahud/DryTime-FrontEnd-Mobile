import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Banner, BG } from '../../Assets';
import Header from '../../Components/Header';
import { Colors, AntDesign, SCREEN_WIDTH, MaterialCommunityIcons } from '../../Theme';
import VideoPlayer from 'react-native-video-player';
import { img_url } from '../../Config/APIs';
import MediaViewer from '../../Components/MediaViewer';
import Video from 'react-native-video';

export default class YogaDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMedia: false,
      buffering: true
    };

  }

  render() {
    let data = this.props.route.params?.item;
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
          title={'Yoga Class'}
        />
        <ScrollView>
          <View style={styles.body}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ScheduleForm', { activity_id: data.id, activity: { name: data.title } })}
              style={styles.FlexRowRight}>
              <AntDesign name={'plussquare'} size={20} color={Colors.black} />
              <Text style={styles.TextReminder}>Add Reminder</Text>
            </TouchableOpacity>
            <View style={styles.VideoView}>
              <View style={styles.Video}>
                {/* <VideoPlayer
                  video={{
                    uri: img_url + data.video,
                  }}
                  videoWidth={SCREEN_WIDTH}
                  videoHeight={220}
                  customStyles={{ borderRadius: 30 }}
                  //  resizeMode={'contain'}
                  // autoplay
                  defaultMuted={false}
                /> */}
                <Video
                  source={{
                    uri: img_url + data.video,
                  }}
                  controls
                  style={{ marginBottom: 10, height: 300, width: "100%" }}
                  resizeMode="contain"
                  paused
                  poster='https://static.vecteezy.com/system/resources/previews/003/589/714/original/play-button-icon-vector.jpg'
                  onLoadStart={(data) => {
                    this.setState({ buffering: true })
                  }}
                  onLoad={(data) => {
                    this.setState({ buffering: false })
                  }}
                />
                {
                  this.state.buffering ?
                    <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: 'center', }}>
                      <ActivityIndicator
                        size={90}
                        color="#fff"
                      />
                    </View>
                    : null
                }
              </View>
              <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={styles.HeadingName}>{data.title}</Text>
                  <TouchableOpacity onPress={() => this.setState({ showMedia: true })}>
                    <MaterialCommunityIcons name='fullscreen' size={30} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.HeadingTime}>Time: {data.duration}</Text>
              </View>
            </View>
            <Text style={styles.HeadingDetail}>Details</Text>
            <Text style={styles.TextDescription}>
              {data.description}
            </Text>
          </View>
        </ScrollView>
        <MediaViewer
          onClose={() => this.setState({ showMedia: false })}
          visible={this.state.showMedia}
          media={img_url + data.video}
          type={"video"}
        />
      </ImageBackground>
    );
  }
}
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
  FlexRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  TextReminder: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginHorizontal: 5,
  },
  VideoView: {
    paddingTop: 8,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  Video: {
    width: '95%',
    borderRadius: 30,
    alignSelf: 'center',
  },
  HeadingName: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
  },
  HeadingDetail: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  HeadingTime: {
    fontSize: 14,
    //  color: Colors.black,
    fontWeight: 'normal',
  },
  TextDescription: {
    fontSize: 14,
    color: Colors.black,
  },
});
