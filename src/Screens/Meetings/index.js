import { Heading } from 'native-base';
import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { aaMeet, BG, naMeet,gaMeet } from '../../Assets';
import Header from '../../Components/Header';

export default class Meetings extends Component {
  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          title={'Activities'}
          ArrowBackIcon
          BellIcon
          Menu
        />
        {/* <ScrollView style={{flex: 1}}> */}
        <View style={styles.innerCon}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AllMeetings', { meet_type: "AA" })}
            activeOpacity={0.8}
            style={styles.meetView}>
            <View style={styles.bannerView}>
              <Image source={aaMeet} style={styles.banner} />
            </View>
            <Heading style={{ alignSelf: 'center' }} fontSize="lg">
              AA Meetings
            </Heading>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AllMeetings', { meet_type: "NA" })}
            activeOpacity={0.8}
            style={styles.meetView}>
            <View style={styles.bannerView}>
              <Image source={naMeet} style={styles.banner} />
            </View>
            <Heading style={{ alignSelf: 'center' }} fontSize="lg">
              NA Meetings
            </Heading>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AllMeetings', { meet_type: "GA" })}
            activeOpacity={0.8}
            style={styles.meetView}>
            <View style={styles.bannerView}>
              <Image source={gaMeet} style={styles.banner} />
            </View>
            <Heading style={{ alignSelf: 'center' }} fontSize="lg">
              GA Meetings
            </Heading>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    margin: 20,
  },
  meetView: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginVertical: '2%',
    paddingBottom: 10,
  },
  bannerView: {
    backgroundColor: '#eee',
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    margin: 5,
    marginBottom: 10,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
});
