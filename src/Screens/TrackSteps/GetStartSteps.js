import { ArrowForwardIcon, Icon } from 'native-base';
import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { BG, Steps, stepsrun } from '../../Assets';
import Header from '../../Components/Header';
import { Entypo } from '../../Theme/index';

export default class GetStartSteps extends Component {

  componentDidMount() {
    AsyncStorage.setItem("@DT-steps", "started")
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
          title="Track your step"
          ArrowBackIcon
          BellIcon
          Menu
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={stepsrun}
            style={{ height: 180, width: 140, resizeMode: 'contain' }}
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ textAlign: 'center', color: '#000', fontSize: 16 }}>
            Track your steps to stay healthy and fit. Press start now to start tracking
          </Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('TrackSteps', this.props.route.params)}
            style={styles.btn}>
            <Text style={{ color: '#000', fontSize: 18 }}>Start</Text>
            <View
              style={{
                backgroundColor: '#000',
                borderRadius: 20,
                padding: 3,
                marginStart: 10,
              }}>
              <Icon as={Entypo} name="arrow-right" color="#fff" size="4" />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    backgroundColor: '#fff',
    padding: 15,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
