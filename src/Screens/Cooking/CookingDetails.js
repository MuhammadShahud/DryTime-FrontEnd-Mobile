import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Banner, BG} from '../../Assets';
import Header from '../../Components/Header';
import {Colors, AntDesign, SCREEN_WIDTH} from '../../Theme';
import VideoPlayer from 'react-native-video-player';

export default class CookingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          title={'Cooking'}
        />
        <ScrollView>
          <View style={styles.body}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ScheduleForm', { activity_id: data.id })}
              style={styles.FlexRowRight}>
              <AntDesign name={'plussquare'} size={20} color={Colors.black} />
              <Text style={styles.TextReminder}>Add Reminder</Text>
            </TouchableOpacity>
            <View style={styles.VideoView}>
              <View style={styles.Video}>
                <VideoPlayer
                  video={{
                    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  }}
                  videoWidth={SCREEN_WIDTH}
                  videoHeight={220}
                  customStyles={{borderRadius: 30}}
                  thumbnail={Banner}
                  //  resizeMode={'contain'}
                  // autoplay
                  defaultMuted={true}
                />
              </View>
              <View style={{marginVertical: 10, marginHorizontal: 15}}>
                <Text style={styles.HeadingName}>Push Ups with Kim</Text>
                <Text style={styles.HeadingTime}>Time: 10 min</Text>
              </View>
            </View>
            <Text style={styles.HeadingDetail}>Details</Text>
            <Text style={styles.TextDescription}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </View>
        </ScrollView>
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
    height: 260,
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
