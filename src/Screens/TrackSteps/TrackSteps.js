import { Button, HStack, Icon } from 'native-base';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Platform,
  NativeEventEmitter,
  NativeModules,
  AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
import { BG, stepsround, stepsrun, trackTimer } from '../../Assets';
import Header from '../../Components/Header';
import { ActionTypes } from '../../Redux/action_types';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import StepcounterIosAndroid from "react-native-stepcounter-ios-android";
import { AntDesign, Colors } from "../../Theme";

class TrackSteps extends Component {
  state = {
    tabToday: true,
    steps: this.props.steps ? this.props.steps : 0,
    button: null
  };

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
    //  this.setupCounter();
  }

  setupCounter = () => {
    this.setState({ button: 0 })
    this.props.route.params.setCounter();
    this.props.SetTrackSteps(true)
    // if (Platform.OS == "android") {
    //   const config = {
    //     default_threshold: 0.0,
    //     default_delay: 180000000,
    //     cheatInterval: 3000,
    //     onStepCountChange: stepCount => {
    //       this.setState({ steps: parseInt(this.props.steps) + parseInt(stepCount) })
    //     },
    //     onCheat: () => {
    //       console.log('User is Cheating');
    //     },
    //   };
    //   startCounter(config);
    // }
    // if (Platform.OS == "ios") {
    //   StepcounterIosAndroid.isSupported()
    //     .then((result) => {
    //       if (result) {
    //         console.log('Sensor TYPE_STEP_COUNTER is supported on this device');

    //         const myModuleEvt = new NativeEventEmitter(
    //           NativeModules.StepcounterIosAndroid
    //         );
    //         myModuleEvt.addListener('StepCounter', (data) => {
    //           this.setState({ steps: parseInt(this.props.steps) + parseInt(data.steps) });
    //         });

    //         StepcounterIosAndroid.startStepCounter();
    //       } else {
    //         console.log(
    //           'Sensor TYPE_STEP_COUNTER is not supported on this device'
    //         );
    //       }
    //     })
    //     .catch((err) => console.warn(err));
    // }

  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
    // AsyncStorage.setItem("@DT-userSteps", this.state.steps + "")
    // this.props.AddSteps({
    //   steps: this.state.steps,
    //   distance: 0,
    //   date: new Date().toISOString().slice(0, 10)
    // })
    // if (Platform.OS == "android")
    //   stopCounter();
    // else
    //   StepcounterIosAndroid.stopStepCounter();
  }

  onBackPress = () => {
    this.props.navigation.goBack("Home")
    return true;
  }

  stopTracking = () => {
    this.setState({ button: 1 })
    AsyncStorage.setItem("@DT-userSteps", this.props.steps + "")
    this.props.AddSteps({
      steps: this.props.steps,
      distance: 0,
      date: new Date().toISOString().slice(0, 10)
    })
    this.props.SetTrackSteps(false)
    if (Platform.OS == "android")
      stopCounter();
    else
      StepcounterIosAndroid.stopStepCounter();
  }

  resetCounter = () => {
    this.setState({ button: null })
    this.props.ResetSteps();
    this.setState({ steps: 0 })
    this.props.AddSteps({
      steps: 0,
      distance: 0,
      date: new Date().toISOString().slice(0, 10)
    })
  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPress={() => this.props.navigation.navigate("BottomTabs")}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
          title={'Track Your Steps'}
        />
        <View style={styles.innerCon}>
          <HStack
            style={{ justifyContent: 'space-between', paddingHorizontal: 5 }}>
            <Button
              onPress={() => this.setState({ tabToday: true })}
              rounded="md"
              h="10"
              padding={0}
              style={{
                ...styles.btn,
                backgroundColor: this.state.tabToday ? '#2e2e2e' : '#fff',
              }}>
              <Text
                style={{
                  ...styles.btnText,
                  color: this.state.tabToday ? '#fff' : '#2e2e2e',
                }}>
                Today
              </Text>
            </Button>
            <Button
              onPress={() => {
                this.props.GetStepsReport();
                this.setState({ tabToday: false })
              }}
              rounded="md"
              h="10"
              padding={0}
              style={{
                ...styles.btn,
                backgroundColor: this.state.tabToday ? '#fff' : '#2e2e2e',
              }}>
              <Text
                style={{
                  ...styles.btnText,
                  color: this.state.tabToday ? '#2e2e2e' : '#fff',
                }}>
                Report
              </Text>
            </Button>
          </HStack>
          {this.state.tabToday ? (
            <View
              style={{
                flex: 1,
                marginVertical: 40,
                backgroundColor: '#fff',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={stepsround}
                resizeMode='contain'
                style={{ width: "97%", height: "100%", alignItems: "center", justifyContent: "center", marginStart: 10 }}>
                <Image
                  source={stepsrun}
                  style={{ width: '90%', height: "17%", resizeMode: 'contain' }}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 26, fontWeight: "bold", color: "#000" }}>{this.props.steps}</Text>
                  <Text style={{ color: "#000" }}>Steps</Text>
                </View>
              </ImageBackground>
              {/* <View style={{justifyContent: 'center', alignItems: 'center',position:"absolute",top:0}}>
              <Text>0</Text>
              <Text>Steps</Text>
            </View> */}
              <HStack space={3}>
                <Button
                  borderWidth={this.props.track_steps ? 1 : 0}
                  borderColor={Colors.white}
                  onPress={this.setupCounter}
                  endIcon={<Icon as={AntDesign} name="play" size={5} />}>
                  Start
                </Button>
                <Button
                  borderColor={Colors.white}
                  borderWidth={this.props.track_steps ? 0 : 1}
                  onPress={this.stopTracking}
                  endIcon={<Icon as={AntDesign} name="pausecircle" size={5} />}>
                  Pause
                </Button>
                <Button
                  onPress={this.resetCounter}
                  endIcon={<Icon as={AntDesign} name="reload1" size={5} />}>
                  Reset
                </Button>
              </HStack>
            </View>
          ) : (
            <View style={{ flex: 1, marginVertical: 40 }}>
              <Text style={styles.heading}>Week</Text>
              <View style={styles.stepsView}>
                <Text style={styles.count}>{this.props.stepsReport[0][0]}</Text>
                <Text style={styles.steps}>Steps</Text>
              </View>
              <Text style={styles.heading}>Month</Text>
              <View style={styles.stepsView}>
                <Text style={styles.count}>{this.props.stepsReport[1][0]}</Text>
                <Text style={styles.steps}>Steps</Text>
              </View>
              <Text style={styles.heading}>Year</Text>
              <View style={styles.stepsView}>
                <Text style={styles.count}>{this.props.stepsReport[2][0]}</Text>
                <Text style={styles.steps}>Steps</Text>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  steps: state.GeneralReducer.steps,
  stepsReport: state.GeneralReducer.steps_report,
  track_steps: state.GeneralReducer.track_steps
});

const mapDispatchToProps = dispatch => ({
  AddSteps: (data) => dispatch(GeneralMiddleware.addSteps(data)),
  GetStepsReport: () => dispatch(GeneralMiddleware.getSteps()),
  SetTrackSteps: (payload) => dispatch({ type: ActionTypes.TRACK_STEPS, payload }),
  ResetSteps: () => dispatch({ type: ActionTypes.ResetSteps }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackSteps);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
  },
  btn: {
    width: '48%',
    backgroundColor: '#fff',
  },
  btnText: {
    color: '#1c1c1c',
    fontSize: 14,
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 20,
  },
  stepsView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 15,
    height: 100,
  },
  count: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2e2e2e',
  },
  steps: {
    color: '#2e2e2e',
    fontWeight: 'bold',
  },
});
