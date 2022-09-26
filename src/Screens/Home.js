import React, { Component } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Modal,
  AsyncStorage,
  Linking,
  Platform,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { BG, Path, Steps, Banner, Logo } from '../Assets';
import {
  Avatar,
  Box,
  Button,
  CloseIcon,
  Heading,
  HStack,
  ScrollView,
} from 'native-base';
import Header from '../Components/Header';
import { Colors, Fontisto } from '../Theme';
import { connect } from 'react-redux';
import { PostMiddleware } from '../Redux/middleware/PostMiddleware';
import { img_url } from '../Config/APIs';
import moment from 'moment';
import { GeneralMiddleware } from '../Redux/middleware/GeneralMiddleware';
import PushNotification from 'react-native-push-notification';
import { rgba } from 'react-native-image-filter-kit';
import { ForumCard } from '../Components';
import { ActivityMiddleware } from '../Redux/middleware/ActivityMiddleware';
import FastImage from "react-native-fast-image";
import StepcounterIosAndroid from "react-native-stepcounter-ios-android";
import { ActionTypes } from '../Redux/action_types';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { startCounter } from 'react-native-accurate-step-counter';


const { width, height } = Dimensions.get('screen');

let options = [
  {
    icon: require('../Assets/Images/4385434.png'),
    name: 'Smoking',
  },
  {
    icon: require('../Assets/Images/4385434.png'),
    name: 'Gambling',
  },
  {
    icon: require('../Assets/Images/4385434.png'),
    name: 'Drugs',
  },
  {
    icon: require('../Assets/Images/4385434.png'),
    name: 'Alcohol',
  },
];

class Home extends Component {
  state = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    counter: 0,
    stepCount: 0,
    data: [{}, {}, {}, {}],
    NotificationModal: false,
    tokenName: "",
    tokenModal: false,
    timerIndex: 0,
    alreadyInitSteps: true
  };

  async UNSAFE_componentWillMount() {
    let url = await Linking.getInitialURL();
    if (url) {
      let urlArray = url.split("/");
      this.props.navigation.navigate("SinglePost", { post_id: urlArray[urlArray.length - 1] })
    }
    Linking.addEventListener('url', ({ url }) => {
      console.warn(url)
      if (url) {
        let urlArray = url.split("/");
        this.props.navigation.navigate("SinglePost", { post_id: urlArray[urlArray.length - 1] })
      }
    })

  }

  async componentDidMount() {
    this.setupCounter();
    AsyncStorage.getItem("@DT-userSteps", (error, result) => {
      if (!error) {
        if (result) {
          this.props.setSteps(result);
        }
      }
    })
    this.props.getTrendingPosts();
    this.props.GetForumTopics();
    this.props.getQuotes({
      callback: (data) => {
        AsyncStorage.getItem("qoute", (error, result) => {
          if (!error) {
            if (result) {
              let quote = JSON.parse(result);
              let difference = moment(data.created_at).diff(quote.opened_at);
              let days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 7);
              if (quote.data.id != data.id) {
                if (data.type == "Weekly" && days >= 7) {
                  this.setState({ NotificationModal: true })
                }
                if (data.type == "Daily" && days >= 1) {
                  this.setState({ NotificationModal: true })
                }
                AsyncStorage.setItem("qoute", JSON.stringify({ data, opened_at: new Date().toISOString() }))
              }
            }
            else {
              this.setState({ NotificationModal: true });
              AsyncStorage.setItem("qoute", JSON.stringify({ data, opened_at: new Date().toISOString() }))
            }

          }
        })
      }
    });
    if (this.props.user?.user?.user_soberity?.length && this.props.user?.user?.user_soberity[0])
      this.getTime(this.props.user?.user?.user_soberity[0]?.time)
    // if (this.props.soberPlan) {
    //   if (new Date(this.props.soberPlan.end_date).getTime() < new Date().getTime())
    //     return;

    //   let end_date = new Date(this.props.soberPlan.end_date);
    //   this.plan_interval = setInterval(() => {
    //     let current_date = new Date();
    //     let remainingTime = end_date.getTime() - current_date.getTime();
    //     var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    //     var hours = Math.floor(
    //       (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    //     );
    //     var minutes = Math.floor(
    //       (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
    //     );
    //     var counter = Math.floor((remainingTime % (1000 * 60)) / 1000);
    //     this.setState({ days, hours, minutes, counter });
    //     if (days == 0 && hours == 0 && minutes == 0 && counter == 0) {
    //       clearInterval(this.plan_interval);
    //       this.props.awardToken({
    //         callback: (tokenName) => {
    //           this.setState({ tokenName, tokenModal: true })
    //         }
    //       });
    //     }
    //   }, 1000);
    // }

    this.props.navigation.addListener("focus", () => {
      if (this.props.trackSteps && !this.state.alreadyInitSteps) {
        this.setupCounter();
      }
      if (this.props.trackSteps) {
        AsyncStorage.setItem("@DT-userSteps", this.props.steps + "")
        this.props.AddSteps({
          steps: this.props.steps,
          distance: 0,
          date: new Date().toISOString().slice(0, 10)
        })
      }
    })


  }

  setupCounter = () => {
    this.setState({ alreadyInitSteps: true })
    if (Platform.OS == "android") {
      const config = {
        default_threshold: 25.0,
        default_delay: 180000000,
        cheatInterval: 3000,
        onStepCountChange: stepCount => {
          this.props.setSteps(parseInt(this.props.steps) + parseInt(stepCount))
        },
        onCheat: () => {
          console.log('User is Cheating');
        },
      };
      startCounter(config);
    }
    if (Platform.OS == "ios") {
      StepcounterIosAndroid.isSupported()
        .then((result) => {
          if (result) {
            console.log('Sensor TYPE_STEP_COUNTER is supported on this device');

            const myModuleEvt = new NativeEventEmitter(
              NativeModules.StepcounterIosAndroid
            );
            myModuleEvt.addListener('StepCounter', (data) => {
              this.props.setSteps(parseInt(this.props.steps) + parseInt(data.steps))
            });

            StepcounterIosAndroid.startStepCounter();
          } else {
            console.log(
              'Sensor TYPE_STEP_COUNTER is not supported on this device'
            );
          }
        })
        .catch((err) => console.warn(err));
    }

  }

  // componentDidUpdate() {
  //   if (this.props.soberPlan && !this.plan_interval) {
  //     if (new Date(this.props.soberPlan.end_date).getTime() < new Date().getTime())
  //       return;

  //     let end_date = new Date(this.props.soberPlan.end_date);
  //     this.plan_interval = setInterval(() => {
  //       let current_date = new Date();
  //       let remainingTime = end_date.getTime() - current_date.getTime();
  //       var days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  //       var hours = Math.floor(
  //         (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  //       );
  //       var minutes = Math.floor(
  //         (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
  //       );
  //       var counter = Math.floor((remainingTime % (1000 * 60)) / 1000);
  //       this.setState({ days, hours, minutes, counter });
  //       if (days == 0 && hours == 0 && minutes == 0 && counter == 0) {
  //         clearInterval(this.plan_interval);
  //         this.props.awardToken({
  //           callback: (tokenName) => {
  //             this.setState({ tokenName, tokenModal: true })
  //           }
  //         });
  //       }
  //     }, 1000);
  //   }
  //}

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('NewsFeed', { forum: 0, index: index })}
        style={{
          borderRadius: 10,
          backgroundColor: '#fff',
          padding: 10,
          paddingTop: 30,
          marginEnd: index == this.state.data.length - 1 ? 10 : 20,
          marginStart: index == 0 ? 10 : 0,
          width: width * 0.7,
        }}>
        <HStack>
          <Avatar source={{ uri: img_url + item.user?.profile_pic }} />
          <Box style={{ marginStart: 10 }}>
            <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>
              {item.user?.username}
            </Text>
            <Text style={{ fontSize: 11 }}>{moment(item.created_at).fromNow()}</Text>
          </Box>
        </HStack>
        <Text numberOfLines={3} style={{ marginVertical: 10, fontSize: 12 }}>
          {item.description}
        </Text>
        <FastImage
          source={{
            uri: img_url + item.file,
            cache: FastImage.cacheControl.immutable,
            priority: FastImage.priority.high
          }}
          resizeMode="contain"
          style={{
            height: 150,
            width: '100%',
            borderRadius: 20,
            marginVertical: 10,
          }}
        />
      </TouchableOpacity>
    );
  };

  getDistance = () => {
    let distance = 0;
    if (this.props.user.user.gender == "female") {
      distance = this.props.steps * 0.000378788;
    }
    else {
      distance = this.props.steps * 0.000435606;
    }
    return parseFloat(distance).toFixed(1);
  }

  _renderForumItem = ({ item }) => {
    return (
      <ForumCard
        containerStyle={{ width: width * 0.4 }}
        Image={{ uri: img_url + item.image }}
        Heading={item.topic}
        Description={item.description}
        Day={item.day}
        onPress={() => this.props.navigation.navigate('NewsFeed', { forum: 1, day: item.day })}
      />
    );
  };

  returnString = (number) => {
    if (number) {
      if (number < 10)
        return "0" + number
      else
        return number
    }
    else
      return "00"

  }

  getTime = (timerDate) => {
    clearInterval(this.plan_interval)
    if (timerDate) {
      let time_date = new Date(timerDate);
      this.plan_interval = setInterval(() => {
        let now = new Date();
        let zoneDiff = -(now.getTimezoneOffset()) * 60000;
        let remainingTime = (now.getTime() - time_date.getTime()) + zoneDiff;
        let counter = Math.floor(remainingTime / 1000);
        let minutes = Math.floor(counter / 60);
        counter = counter % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        let days = Math.floor(hours / 24);
        hours = hours % 24;
        let months = Math.floor(days / 30);
        days = days % 30;
        let years = Math.floor(months / 12);
        months = months % 12;
        this.setState({ months, years, days, hours, minutes, counter });
        //   // if (days == 0 && hours == 0 && minutes == 0 && counter == 0) {
        //   //   clearInterval(this.plan_interval);
        //   //   this.props.awardToken({
        //   //     callback: (tokenName) => {
        //   //       this.setState({ tokenName, tokenModal: true })
        //   //     }
        //   //   });
        //   // }
      }, 1000);
    }
  }

  getIcon = (name) => {
    let icon = "";
    switch (name.toLowerCase()) {
      case "tobacco":
        icon = require("../Assets/Images/tobacco.png")
        break;
      case "alcohol":
        icon = require("../Assets/Images/alcohol.png")
        break;
      case "drugs":
        icon = require("../Assets/Images/drugs.png")
        break;
      case "smoking":
        icon = require("../Assets/Images/smoking.png")
        break;
      case "gambling":
        icon = require("../Assets/Images/gambling.png")
        break;
      default:
        icon = ""
        break;
    }
    return icon;
  }


  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          BellIcon
          Menu
          title={'Drytime'}
          logo
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.innerCon}>
            <HStack
              style={{ justifyContent: 'space-between', paddingHorizontal: 15 }}>
              <Button
                rounded="md"
                h={"8"}
                padding={0}
                style={[styles.btn, { backgroundColor: '#2e2e2e', width: "30%" }]}>
                <Text style={[styles.btnText, { color: '#fff' }]}>Summary</Text>
              </Button>
              {/* {
                Platform.OS != "ios" ?
                  <Button
                    onPress={() => {
                      // if (Platform.OS == "ios")
                      //   alert("Sorry not available on IOS currently..")
                      // else
                        AsyncStorage.getItem("@DT-steps", (error, result) => {
                          if (!error && result)
                            this.props.navigation.navigate('TrackSteps')
                          else
                            this.props.navigation.navigate('GetStartSteps')
                        })
                    }}
                    rounded="md"
                    h="8"
                    padding={0}
                    style={styles.btn}>
                    <Text style={styles.btnText}>Tracker</Text>
                  </Button>
                  : null
              } */}
              <Button
                onPress={() => {
                  // if (Platform.OS == "ios")
                  //   alert("Sorry not available on IOS currently..")
                  // else
                  AsyncStorage.getItem("@DT-steps", (error, result) => {
                    if (!error && result)
                      this.props.navigation.navigate('TrackSteps', { setCounter: this.setupCounter, stpCounter: () => this.setState({ alreadyInitSteps: false }) })
                    else
                      this.props.navigation.navigate('GetStartSteps', { setCounter: this.setupCounter, stpCounter: () => this.setState({ alreadyInitSteps: false }) })
                  })
                }}
                rounded="md"
                h="8"
                padding={0}
                style={styles.btn}>
                <Text style={styles.btnText}>Tracker</Text>
              </Button>
              <Button
                onPress={() => this.props.navigation.navigate('NewsFeed', { forum: 0 })}
                rounded="md"
                h={"8"}
                padding={0}
                style={[styles.btn, { width: "30%" }]}>
                <Text style={styles.btnText}>Community</Text>
              </Button>
            </HStack>
            <View style={styles.timerCon}>
              <ScrollView style={{ width: "100%" }} horizontal>
                {
                  this.props.user?.user?.user_soberity ?
                    this.props.user?.user?.user_soberity.map((value, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({ timerIndex: index });
                            this.getTime(value.time)
                          }}
                          style={{ ...styles.option, marginStart: index == 0 ? 0 : 10, backgroundColor: this.state.timerIndex == index ? Colors.Primary : "#aaa" }}>
                          <Image source={this.getIcon(value.addiction)} style={styles.optionImg} />
                          <Text style={{ color: '#fff', fontSize: 9 }}>
                            {value.addiction}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                    : null}
              </ScrollView>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: "10%",
                  flex: 1,
                }}>
                <Heading>Keep it up !</Heading>
                <View style={styles.timer}>
                  <Box>
                    <Text style={styles.timevalue}>
                      {this.returnString(this.state.years)}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.timerunit}>YY</Text>
                  </Box>
                  <Text adjustsFontSizeToFit style={styles.seperator}>:</Text>
                  <Box>
                    <Text style={styles.timevalue}>
                      {this.returnString(this.state.months)}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.timerunit}>MM</Text>
                  </Box>
                  <Text adjustsFontSizeToFit style={styles.seperator}>:</Text>
                  <Box>
                    <Text style={styles.timevalue}>
                      {this.returnString(this.state.days)}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.timerunit}>DD</Text>
                  </Box>
                  <Text adjustsFontSizeToFit style={styles.seperator}>:</Text>
                  <Box>
                    <Text style={styles.timevalue}>
                      {this.returnString(this.state.hours)}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.timerunit}>HH</Text>
                  </Box>
                  <Text adjustsFontSizeToFit style={styles.seperator}>:</Text>
                  <Box>
                    <Text style={styles.timevalue}>
                      {this.returnString(this.state.minutes)}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.timerunit}>mm</Text>
                  </Box>
                  <Text adjustsFontSizeToFit style={styles.seperator}>:</Text>
                  <Box>
                    <Text style={styles.timevalue}>
                      {this.returnString(this.state.counter)}
                    </Text>
                    <Text adjustsFontSizeToFit style={styles.timerunit}>Secs</Text>
                  </Box>
                  {
                    this.props.user?.user?.user_soberity?.length && !this.props.user?.user?.user_soberity[this.state.timerIndex]?.time ?
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("StartDays", { Home: true, addictions: this.props.user?.user?.user_soberity })}
                        activeOpacity={0.7}
                        style={{ ...StyleSheet.absoluteFill, backgroundColor: "rgba(36, 189, 199, 0.8)", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                      >
                        <Fontisto name='redo' size={20} color="#fff" />
                        <Text style={{ color: "#fff", fontSize: 20, marginStart: 5 }}>
                          Set Time
                        </Text>
                      </TouchableOpacity>
                      : null
                  }
                </View>
              </View>
              {/* <Button
                ArrowRight
                width={'100%'}
                height={45}
                name={'Reset'}
                textStyle={{
                  fontSize: 16,
                }}
                onPress={() => this.props.navigation.navigate("")}
              /> */}
              {/* {
                Platform.OS == "ios" ? null :} */}
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={Steps} style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infotxt}>{this.props.steps ? this.props.steps : 0}</Text>
                    <Text style={styles.infotxtunit}>steps</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={Path} style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infotxt}>{this.props.steps ? this.getDistance() : 0}</Text>
                    <Text style={styles.infotxtunit}>Miles</Text>
                  </View>
                </View>
              </View>

            </View>
            <View style={styles.postCon}>
              <Heading style={{ color: '#000', marginStart: 10, fontSize: 20 }}>
                Trending Post
              </Heading>
              <FlatList
                style={{ marginTop: 20 }}
                data={this.props.trendingPosts}
                horizontal
                renderItem={this._renderItem}
              />
            </View>
            <View style={styles.postCon}>
              <Heading style={{ color: '#000', marginStart: 10, fontSize: 20 }}>
                Weekly Forum
              </Heading>
              <FlatList
                style={{ marginTop: 20 }}
                data={this.props.forumTopics}
                horizontal
                renderItem={this._renderForumItem}
              />
            </View>
            <Modal visible={this.state.NotificationModal}
              onRequestClose={() => this.setState({ NotificationModal: false })}
              transparent>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#000',
                    opacity: 0.8,
                    ...StyleSheet.absoluteFill,
                  }}
                />
                <View
                  style={{
                    width: width * 0.9,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 3,
                    alignSelf: 'center',
                  }}>
                  <Image
                    source={this.props.quotes?.image ? { uri: img_url + this.props.quotes?.image } : Banner}
                    style={{ borderRadius: 20, width: '100%', height: 300, resizeMode: "contain" }}
                  />
                  <View
                    style={{
                      marginVertical: 30,
                      marginHorizontal: 15,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#000',
                        textAlign: 'center',
                      }}>
                      {this.props.quotes?.text}
                    </Text>
                    <View
                      style={{
                        backgroundColor: Colors.Primary,
                        height: 3,
                        width: 50,
                        borderRadius: 25,
                        marginVertical: 10,
                      }}
                    />
                    <Text style={{ fontSize: 12 }}>{this.props.quotes?.quote_by}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({ NotificationModal: false })}
                    style={{
                      position: 'absolute',
                      top: 15,
                      right: 15,
                      borderRadius: 50,
                      borderColor: '#000',
                      borderWidth: 2,
                      padding: 6,
                    }}>
                    <CloseIcon size={3} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              onRequestClose={() => this.setState({ tokenModal: false })}
              visible={this.state.tokenModal}
              transparent>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View
                  style={{
                    backgroundColor: '#000',
                    opacity: 0.8,
                    ...StyleSheet.absoluteFill,
                  }}
                />
                <View
                  style={{
                    width: width * 0.9,
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 3,
                    alignSelf: 'center',
                    overflow: "hidden"
                  }}>
                  <Image
                    source={require("../Assets/Images/happy.gif")}
                    style={{ borderRadius: 20, width: '100%', height: 300 }}
                  />
                  <View
                    style={{
                      marginVertical: 30,
                      marginHorizontal: 15,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 12

                      }}>
                      You have achieved a new achievement
                    </Text>
                    <View
                      style={{
                        backgroundColor: Colors.Primary,
                        height: 3,
                        width: 50,
                        borderRadius: 25,
                        marginVertical: 10,
                      }}
                    />
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#000',
                      textAlign: 'center',
                    }}>
                      {this.state.tokenName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.setState({ tokenModal: false })}
                    style={{
                      position: 'absolute',
                      top: 15,
                      right: 15,
                      borderRadius: 50,
                      borderColor: '#000',
                      borderWidth: 2,
                      padding: 6,
                    }}>
                    <CloseIcon size={3} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  soberPlan: state.AuthReducer.user_sober_plan,
  trendingPosts: state.PostReducer.trending_posts,
  quotes: state.GeneralReducer.quotes,
  steps: state.GeneralReducer.steps,
  stepsDistance: state.GeneralReducer.steps_distance,
  forumTopics: state.ActivityReducer.forum_topics,
  trackSteps: state.GeneralReducer.track_steps,

});

const mapDispatchToProps = dispatch => ({
  AddSteps: (data) => dispatch(GeneralMiddleware.addSteps(data)),
  getTrendingPosts: data => dispatch(PostMiddleware.getTrendingPosts(data)),
  getQuotes: (data) => dispatch(GeneralMiddleware.getQoutes(data)),
  awardToken: (data) => dispatch(GeneralMiddleware.awardToken(data)),
  GetForumTopics: () => dispatch(ActivityMiddleware.getForumTopics()),
  setSteps: (steps) => dispatch({ type: ActionTypes.IncreaseSteps, steps: steps, distance: 0 }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AppLogo: {
    width: 250,
    height: 200,
    marginTop: 30,
    marginBottom: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  innerCon: {
    flex: 1,
    paddingHorizontal: 20,
  },
  btn: {
    width: '30%',
    backgroundColor: '#fff',
  },
  btnText: {
    color: '#1c1c1c',
    fontSize: 12,
  },
  timerCon: {
    borderRadius: 30,
    backgroundColor: '#fff',
    marginVertical: 20,
    marginHorizontal: 5,
    padding: 20,
    elevation: 5,
    justifyContent: "center"
  },
  option: {
    backgroundColor: Colors.Primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
    marginStart: 10
  },
  optionImg: {
    width: 15,
    height: 15,
    tintColor: '#fff',
  },
  timer: {
    flex: 1,
    width: '100%',
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 10,
    borderColor: Colors.Primary,
    borderWidth: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    overflow: "hidden"
  },
  timevalue: {
    color: Colors.Primary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center"
  },
  timerunit: {
    textAlign: 'center',
    fontSize: 16,
  },
  seperator: {
    // backgroundColor: "red",
    fontSize: 20,
    marginBottom: "9%"
  },
  infoIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginEnd: 10,
  },
  infotxt: {
    color: Colors.Primary,
    fontWeight: 'bold',
    fontSize: 17,
  },
  infotxtunit: {
    textAlign: 'center',
  },
  postCon: {
    marginVertical: 20,
  },
});
