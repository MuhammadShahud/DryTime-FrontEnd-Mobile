import React, { Component } from 'react';
//import App from './AppStack';
import { NativeBaseProvider } from 'native-base';
import Drawer from './DrawerNavigator';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import Auth from './AuthStack';
import { AsyncStorage, Image, ImageBackground, Modal, View, Dimensions, Platform, SafeAreaView, Text, PushNotificationIOS } from 'react-native';
import Spinner from 'react-native-spinkit';
import { ActionTypes } from '../Redux/action_types';
import { BG, Logo } from '../Assets';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from "react-native-push-notification";
import notifee from '@notifee/react-native';

const { width } = Dimensions.get("window");

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

class AppNavigation extends Component {
  constructor(props) {
    super(props)
    SplashScreen.hide();
    this.state = {
      loading: true
    }
   
    AsyncStorage.getItem("@DT-publicKey", (error, result) => {
      if (!error) {
        if (result)
          this.setState({ loading: false })
        else {
          AsyncStorage.getItem("@DT-user", (error, result) => {
            if (!error && result) {
              let data = JSON.parse(result);
              this.props.Login(data)
            }
            this.setState({ loading: false })
          });
        }
      }
      else {
        this.setState({ loading: false })
      }
    });
    if (Platform.OS == "ios") {
      messaging().requestPermission();
      messaging().registerDeviceForRemoteMessages();
    }

    messaging().subscribeToTopic("drytime");
    PushNotification.createChannel(
      {
        channelId: "drytime", // (required)
        channelName: "Dry Time", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification.title.includes("You have a message") && this.props.chatNotify)
        await notifee.displayNotification({
          title: remoteMessage.notification.title, // (optional)
          message: remoteMessage.notification.body,
          android: {
            channelId: "drytime",
          },
          ios: {

          }
        });
      // PushNotification.localNotification({
      //   channelId: "drytime", // (required) channelId, if the channel doesn't exist, notification will not trigger.
      //   vibrate: true, // (optional) default: true
      //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //   priority: "high", // (optional) set notification priority, default: high
      //   ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      //   onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      //   category: "", // (optional) default: empty string
      //   title: remoteMessage.notification.title, // (optional)
      //   message: remoteMessage.notification.body, // (required)
      // });
      else if (!remoteMessage.notification.title.includes("You have a message")) {
        await notifee.displayNotification({
          title: remoteMessage.notification.title, // (optional)
          message: remoteMessage.notification.body,
          android: {
            channelId: "drytime",
          },
          ios: {

          }
        });
        //     PushNotification.localNotification({
        //       channelId: "drytime", // (required) channelId, if the channel doesn't exist, notification will not trigger.
        //       vibrate: true, // (optional) default: true
        //       vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        //       priority: "high", // (optional) set notification priority, default: high
        //       ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        //       onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
        //       category: "", // (optional) default: empty string
        //       title: remoteMessage.notification.title, // (optional)
        //       message: remoteMessage.notification.body, // (required)
        //     });
      }
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      // PushNotification.localNotification({
      //   channelId: "drytime", // (required) channelId, if the channel doesn't exist, notification will not trigger.
      //   vibrate: true, // (optional) default: true
      //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //   priority: "high", // (optional) set notification priority, default: high
      //   ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      //   onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      //   category: "", // (optional) default: empty string
      //   title: remoteMessage.notification.title, // (optional)
      //   message: remoteMessage.notification.body, // (required)
      // });
      await notifee.displayNotification({
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body,
        android: {
          channelId: "drytime",
        },
        ios: {

        }
      });
    });
  }
  render() {
    return (
      <NativeBaseProvider>
        {
          this.state.loading ?
            <ImageBackground source={BG} style={{ flex: 1, paddingTop: "35%", alignItems: "center" }}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image style={{ width: width * 0.7, height: width * 0.7, resizeMode: "contain" }} source={Logo} />
                <Spinner
                  isVisible={true}
                  type="Circle"
                  color='#000'
                  size={80}
                />
              </View>
            </ImageBackground>
            : this.props.logged_in ? <SafeAreaView style={{ flex: 1 }}><Drawer /></SafeAreaView> : <Auth />}
        <Modal visible={this.props.loading} transparent>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: "center", alignItems: "center" }}>
            <Spinner
              isVisible={this.props.loading}
              type="FoldingCube"
              color='#fff'
              size={80}
            />
            <Text style={{ color: "#fff", margin: 15 }}>Loading please wait..</Text>
          </View>
        </Modal>
      </NativeBaseProvider>
    );
  }
}

const mapStateToProps = state => ({
  logged_in: state.AuthReducer.is_logged_in,
  loading: state.GeneralReducer.loading,
  chatNotify: state.GeneralReducer.chat_notify
});

const mapDispatchToProps = dispatch => ({
  Login: data => dispatch({ type: ActionTypes.Login, payload: data, plan: data.user?.user_plan }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);
