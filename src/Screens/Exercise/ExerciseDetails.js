import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Banner, BG } from '../../Assets';
import Header from '../../Components/Header';
import { Colors, AntDesign, SCREEN_WIDTH, MaterialCommunityIcons, Entypo } from '../../Theme';
import VideoPlayer from 'react-native-video-player';
import { img_url } from '../../Config/APIs';
import MediaViewer from '../../Components/MediaViewer';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../../Components';
import { connect } from 'react-redux';
import Video from 'react-native-video';

class ExerciseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMedia: false,
      paused: true,
      buffering: false,
      modal: false

    };
  }

  render() {
    let data = this.props.route.params.item;
    let type = this.props.route.params.type;
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
          title={'Details'}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <TouchableOpacity
              onPress={() => {
                // if (type == "Exercise" && this.props.user?.user?.user_subscription) {
                //   this.props.navigation.navigate('ScheduleForm', { activity: data })
                // }
                // else if (type != "Exercise")
                // this.props.navigation.navigate('ScheduleForm', { activity: data })
                if (type == "Exercise" && !this.props.user?.user?.user_subscription) {
                  this.setState({ modal: true });
                }
                else {
                  this.props.navigation.navigate('ScheduleForm', { activity: data })
                }


              }}
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
                  defaultMuted={true}
                  onBuffer={(data) => {
                    this.setState({ buffering: data.isBuffering })
                  }}
                  onVideoBuffer={() => {
                    console.warn("buff")
                  }}
                  onVideoLoad={() => {
                    console.warn("load")
                  }}
                /> */}
                <Video
                  source={{
                    uri: img_url + data.video,
                  }}
                  controls
                  style={{ marginBottom: 10, height: 300, width: "100%" }}
                  resizeMode="contain"
                  onLoadStart={(data) => {
                    this.setState({ buffering: true })
                  }}
                  onLoad={(data) => {
                    this.setState({ buffering: false })
                  }}
                  paused
                 poster='https://static.vecteezy.com/system/resources/previews/003/589/714/original/play-button-icon-vector.jpg'
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
                  <Text style={styles.HeadingName}>{data.name}</Text>
                  <TouchableOpacity onPress={() => this.setState({ showMedia: true })}>
                    <MaterialCommunityIcons name='fullscreen' size={30} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.HeadingTime}>Time: {data.duration}</Text>
              </View>
            </View>
            <Text style={styles.HeadingDetail}>Details</Text>
            <Text style={styles.TextDescription}>
              {data.details}
            </Text>
          </View>
        </ScrollView>
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

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
});

export default connect(mapStateToProps, null)(ExerciseDetails);


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
    alignItems: "center"
  },
  TextReminder: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
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
