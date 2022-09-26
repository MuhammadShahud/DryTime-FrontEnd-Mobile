import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  ImageBackground,
  Alert,
  Modal,
  Dimensions,
  LayoutAnimation,
  Platform,
  PermissionsAndroid,
  UIManager,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';

import { Colors, Entypo } from '../../Theme';
import { Alex, BG, Send } from '../../Assets';
import Header from '../../Components/Header';
import { ChatMiddleware } from '../../Redux/middleware/ChatMiddleware';
import { connect } from 'react-redux';
import { img_url } from '../../Config/APIs';
import moment from 'moment';
import { pusherConfig } from '../../Config/PusherSetup';
import { ActionTypes } from "../../Redux/action_types";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ApplyFilter from '../Profile/ApplyFilter';
import VideoPlayer from 'react-native-video-player';
import MediaViewer from '../../Components/MediaViewer';
import AudioRecorderPlayer, { AudioEncoderAndroidType, AudioSourceAndroidType, AVEncoderAudioQualityIOSType, AVEncodingOption, AVModeIOSOption } from 'react-native-audio-recorder-player';
import * as Animatable from "react-native-animatable";
import RNFS from 'react-native-fs';
import AudioPlayer from '../../Components/AudioPlayer';
import SoundPlayer from 'react-native-sound-player';
import DocumentPicker from "react-native-document-picker";
import { Box, Heading, Progress } from 'native-base';
import Video from 'react-native-video';

const { width, height } = Dimensions.get("window");

class Chat extends Component {


  constructor(props) {
    super(props);
    let chatlist = this.props.route.params.item;
    this.channel = pusherConfig.subscribe(`user.${this.props.user.user.id}`);
    this.channel.bind('App\\Events\\Message', (data) => {
      if (data.message.sent_to.id == props.user.user.id && data.message.chatlist_id == chatlist.id)
        props.AddMessage(data.message);
    });
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    // this.audioRecorderPlayer.setSubscriptionDuration(1);

  }

  state = {
    text: '',
    file: {
      uri: ""
    },
    fileDimension: {
      height: 0,
      width: 0
    },
    filterModal: false,
    showMedia: false,
    selectedFile: null,
    isRecording: false,
    recordSecs: 0,
    recordTime: 0,
    lastPlayedIndex: null,
    playing: false,
    keyboardShowing: false,
    uploadingModal: false,
    uploading: { sent: 0, total: 0 }
  };


  PlayPause = async (uri, playPause) => {
    if (this.playing) {
      this.playing = false;
      playPause()
      SoundPlayer.pause();
      //clearInterval(this.interval);
    }
    else {
      playPause()
      this.playing = true;
      // if (this.props.lastPlayedIndex == this.props.index) {
      SoundPlayer.playUrl(uri)
      //}
      //else
      //    SoundPlayer.resume();

    }

  }

  sendMessage = () => {
    let user = this.props.route.params.user;
    let data = this.props.route.params.item;
    let id = (this.props.messages?.data[this.props.messages?.data.length - 1]?.id) ? (this.props.messages?.data[this.props.messages?.data.length - 1]?.id) + 1 : 1
    let { text, file } = this.state;
    if (!text && !file.uri) {
      return;
    }
    let msgObj = {
      id,
      chatlist_id: data.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message: file?.type ? file?.type.includes("image") ? "Sent an image" : file?.type.includes("audio") ? "Sent an audio" : "Sent a video" : text,
      media: file.uri ? file.uri : "",
      image: file?.type ? file?.type.includes("image") ? 1 : file?.type.includes("audio") ? 2 : 0 : null,
      read: 0,
      sent_from: this.props.user.user,
      sent_from_id: this.props.user.user.id,
      sent_from_type: "App\\Models\\User",
      sent_to: user,
      sent_to_id: user.id,
      sent_to_type: "App\\Models\\User",
      type: file.uri ? "media" : "text",
      duration: this.state.recordTime >= 1 ? this.state.recordSecs * (this.state.recordTime * 60) : this.state.recordSecs
    }
    this.props.SendMessage({
      token: this.props.user.token,
      user_id: user.id,
      message: file?.type ? file?.type.includes("image") ? "Sent an image" : file?.type.includes("audio") ? "Sent an audio" : "Sent an video" : text,
      msgObj,
      file,
      image: file?.type ? file?.type.includes("image") ? 1 : file?.type.includes("audio") ? 2 : 0 : "",
      uploading: (sent, total) => {
        this.setState({ uploading: { sent, total }, uploadingModal: true })
      },
      callback: () => {
        this.setState({ text: '', file: { uri: "" }, recordSecs: 0, recordTime: 0, uploadingModal: false })
      }
    })
  };

  finishedPlaying = (data) => {
    console.warn(data)
    if (data.success) {
      this.playing = false;
      SoundPlayer.stop();
      if (this.stopPlaying)
        this.stopPlaying()
    }
  }

  componentDidMount() {
    let data = this.props.route.params.item;
    if (Object.values(data).length > 0) {
      this.props.GetMessages({
        id: data?.id,
        callback: () => { }
      });
    }
    else {
      this.props.EmptyChat();
    }
    this.props.NoNotify(false)
    this.KeyboardShow = Keyboard.addListener("keyboardWillShow", () => {
      this.setState({ keyboardShowing: true })
    })
    this.KeyboardHide = Keyboard.addListener("keyboardWillHide", () => {
      this.setState({ keyboardShowing: false })
    })
    // SoundPlayer.addEventListener("FinishedPlaying", this.finishedPlaying)

  }

  componentWillUnmount() {
    this.KeyboardHide.remove()
    this.KeyboardShow.remove();
    this.props.NoNotify(true)
    this.channel.unsubscribe();
    this.channel.unbind_all();
  }

  renderMessages = ({ item, index }) => {
    // console.log("current_user_id=>", current_user_id)
    // console.log("item.sent_to_id=>", item.sent_to_id)
    // let username = '';
    // let profile_pic = '';
    // item.sent_to_id === current_user_id ? (username = item.sent_from?.username) : (username = item.sent_to?.username);
    let user = this.props.route.params.user;
    let media = item?.media ? item?.media.includes("file:///") ? item.media : img_url + item.media : null;
    return (
      <View
        key={"chat-msg-" + index}
        style={{
          paddingHorizontal: 15,
          flex: 1,
          alignItems: item.sent_from?.id == this.props.user.user.id ? "flex-end" : "flex-start",
        }}>

        {/* <View

          style={{
            flex: 1,
            marginVertical: 12,
            flexDirection: item.sent_from?.id == this.props.user.user.id ? "row-reverse" : "row",
            alignItems: "center"
          }}>
          <View style={{ marginHorizontal: 10 }}>
            <Image source={profile_pic ? { uri: img_url + profile_pic } : Alex} style={styles.userImg} />
          </View>
          <Text
            style={{
              textAlign: 'left',
              color: Colors.black,
              fontWeight: "bold",
              fontSize: 20
            }}>
            {item.sent_from?.id == this.props.user.user.id ? " Me" : " " + user?.username}
          </Text>
        </View> */}
        <View
          style={{
            backgroundColor: item.sent_from?.id == this.props.user.user.id ? '#268c91' : '#fff',
            padding: 15,
            borderRadius: 10,
            marginVertical: 12,
            overflow: "hidden",
            borderTopLeftRadius:
              item.sent_from?.id == this.props.user.user.id ? 10 : 0,
            borderTopRightRadius:
              item.sent_from?.id == this.props.user.user.id ? 0 : 10,
            flex: 1,
            marginHorizontal: 20
          }}>
          <Text
            style={{
              textAlign: 'left',
              color: item.sent_from?.id == this.props.user.user.id ? Colors.white : Colors.black,
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 5
            }}>
            {item.sent_from?.id == this.props.user.user.id ? "Me" : user?.username}
          </Text>
          {
            item.type == "media" ?
              <TouchableOpacity
                key={index + ""}
                onPress={() => this.setState({ selectedFile: item }, () => this.setState({ showMedia: true }))}>
                {item.image == 1 ?
                  <Image style={{ width: width * 0.5, height: width * 0.5, borderRadius: 6, marginBottom: 10 }} source={{ uri: media }} />
                  :
                  item.image == 2 ?

                    <AudioPlayer
                      onPlayPause={() => {
                        //playPause, stop
                        //this.stopPlaying = stop;
                        //this.PlayPause(media, playPause)
                        let data = {
                          singer: "",
                          file: item?.media
                        }
                        this.props.navigation.navigate("MusicDetail", { hideImage: true, item: data, index: 0 })
                      }}
                      onLastPLayed={() => this.setState({ lastPlayedIndex: index })}
                      lastPlayedIndex={this.state.lastPlayedIndex}
                      key={index + "-audio"}
                      index={index}
                      duration={item?.duration ? item?.duration : 0}
                      uri={media} />
                    :
                    <Video
                      source={{
                        uri: media,
                      }}
                      controls
                      paused
                      poster='https://static.vecteezy.com/system/resources/previews/003/589/714/original/play-button-icon-vector.jpg'
                      // videoWidth={width * 0.3}
                      // videoHeight={width * 0.4}
                      // customStyles={{ borderRadius: 6, }}
                      style={{ marginBottom: 10, height: width * 0.8, width: width * 0.7 }}
                      onLoadStart={(data)=>console.warn("loading")}

                    //resizeMode={'contain'}
                    // showDuration={true}
                    // bufferConfig={{

                    // }}
                    // autoplay
                    // defaultMuted={false}
                    />
                }
              </TouchableOpacity>
              :
              <Text
                style={{
                  color: item.sent_from?.id == this.props.user.user.id ? Colors.white : Colors.black,
                  fontSize: 15,
                }}>
                {item.message}
              </Text>
          }

          <Text
            style={{
              textAlign: 'right',
              color: item.sent_from?.id == this.props.user.user.id ? Colors.white : Colors.black,
              fontSize: 10,
            }}>
            {moment(item.created_at).fromNow()}
          </Text>
        </View>
      </View>
    )
  };

  onEndReached = () => {
    if (this.props.messages.next_url) {
      this.props.GetMoreMessages({ next_url: this.props.messages.next_url })
    }
  }

  toTitleCase = (str = "") => {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  selectImage = () => {
    Alert.alert("Select", "Please select an option", [
      // {
      //   text: "Cancel",
      // },
      {
        text: "Cancel",
        // onPress: () => {
        //   if (this.state.file.uri)
        //     this.setState({
        //       filterModal: true
        //     })
        //   else
        //     alert("Please select image to  add filters")
        // }
      },
      {
        text: "Camera",
        onPress: () => {
          try {
            Alert.alert("Select", "Please select an option", [
              {
                text: "Cancel"
              },
              {
                text: "Photo",
                onPress: () => launchCamera({
                  mediaType: "photo",
                  quality: 0.7
                }, (response) => {
                  if (!response.errorCode && !response.didCancel) {
                    let img = response.assets[0];
                    this.setState({
                      file: {
                        uri: img.uri,
                        name: img.fileName,
                        size: img.fileSize,
                        type: img.type
                      },
                      fileDimension: {
                        height: img.height,
                        width: img.width
                      },
                      filterModal: true
                    })
                  }
                })
              },
              {
                text: "Video",
                onPress: () => launchCamera({
                  mediaType: "video",
                  videoQuality: "low"
                }, (response) => {
                  if (!response.errorCode && !response.didCancel) {
                    let img = response.assets[0];
                    this.setState({
                      file: {
                        uri: img.uri,
                        name: img.fileName,
                        size: img.fileSize,
                        type: img.type
                      },
                      fileDimension: {
                        height: img.height,
                        width: img.width
                      },
                      filterModal: true
                    })
                  }
                })
              }
            ])

          } catch (error) {

          }
        }
      },
      {
        text: "Library",
        onPress: () => {
          try {
            launchImageLibrary({
              mediaType: "mixed",
              videoQuality: "low",
              quality: 0.7
            }, (response) => {
              if (!response.errorCode && !response.didCancel) {
                let img = response?.assets[0];
                this.setState({
                  file: {
                    uri: img.uri,
                    name: img.fileName,
                    size: img.fileSize,
                    type: img.type
                  },
                  fileDimension: {
                    height: img.height,
                    width: img.width
                  },
                  filterModal: true
                })
              } else if (response.didCancel) {
                console.warn("dsadasda", response);
              }
            })
          } catch (error) {
            console.warn("dsadasda", error);

          }
        }
      },


    ], {
      cancelable: true
    })
  }

  selectAudio = async () => {
    let audio = await DocumentPicker.pick({
      type: ["audio/aac", "audio/mpeg", "audio/ogg", "audio/opus", "audio/wav", "audio/webm"],
    });
    if (audio.length > 0) {
      this.setState({
        file: {
          uri: audio[0].uri,
          name: audio[0].name,
          size: audio[0].size,
          type: audio[0].type
        },
      }, () => {
        this.sendMessage();
      })
    }
  }

  selectAttachment = () => {
    Alert.alert("Select option", "Please select option to continue", [
      {
        text: "Photo/Video",
        onPress: () => this.selectImage()
      },
      {
        text: "Audio",
        onPress: () => this.selectAudio()
      }
    ])
  }

  getPermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true
        } else {
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    else
      return true;
  }

  recordVoice = async () => {
    let permission = await this.getPermission();
    if (!permission)
      alert("Please enable permission to continue")

    this.setState({ isRecording: true });
    this.recordingView.bounceIn(800);
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${RNFS.CachesDirectoryPath}/hello.m4a`,
    });
    try {
      this.audioRecorderPlayer.startRecorder(path, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVModeIOS: AVModeIOSOption.measurement,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      }, false).then((value) => {
        // console.warn('ON START RECORDER===>>>>>>>', value);
        const namesArray = value.split('/');
        const fileName = namesArray[namesArray.length - 1];
        // const fileType = 'audio/mp3' + fileName.split('.')[1];
        // console.warn('FILENAME', fileName);
        // console.warn('FILETYPE', fileType);
        // this.setState({recordedUri: value});

        let mediaObject = {
          name: fileName,
          type: 'audio/mp3',
          uri: value,
        };
        this.setState({ file: mediaObject });
      });
      this.interval = setInterval(() => {
        this.setState({
          recordSecs: this.state.recordSecs + 1,
          recordTime: Math.floor(this.state.recordSecs / 60),
        });
      }, 1000);
    } catch (error) {
      console.warn(error);
      this.audioRecorderPlayer.stopRecorder();
    }
  }

  stopRecording = async () => {
    if (this.interval) clearInterval(this.interval);
    this.recordingView.bounceOut(800).then(endState => console.log(endState.finished ? this.setState({ isRecording: false }) : 'bounce cancelled'));
    await this.audioRecorderPlayer.stopRecorder();
    this.sendMessage();
  }

  render() {
    let user = this.props.route.params.user;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} {...Platform.OS == "ios" ? { behavior: "padding" } : {}}>
        <ImageBackground source={BG} style={styles.container}>
          <View style={{ paddingHorizontal: 14 }}>
            <Header
              onPressNotification={() =>
                this.props.navigation.navigate('Notifications')
              }
              onPress={() => this.props.navigation.goBack()}
              ArrowBackIcon
              title={this.toTitleCase(user?.username)}
            />
          </View>

          <FlatList
            data={this.props.messages?.data}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            renderItem={this.renderMessages}
            keyExtractor={(item, index) => "chat-" + index}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 10 }}
            inverted
          />

          <View style={[this.state.keyboardShowing ? { marginBottom: 45 } : { marginBottom: 0 }, styles.footer]}>
            {/* <TouchableOpacity
            disabled={this.props.sending}
            onLongPress={this.recordVoice}
            onPressOut={() => this.stopRecording()}
            style={{ padding: 10 }}>
            <Entypo
              name='mic'
              size={25}
              color="#000"
            />
          </TouchableOpacity> */}
            <TextInput
              value={this.state.text}
              onChangeText={text => this.setState({ text })}
              placeholder="Write a message"
              placeholderTextColor={Colors.black}
              style={styles.input}
            />
            <TouchableOpacity
              disabled={this.props.sending}
              onPress={this.selectAttachment}
              style={{ paddingHorizontal: 10 }}>
              <Entypo
                name='attachment'
                size={25}
              />
            </TouchableOpacity>
            {
              this.props.sending ?
                <View
                  style={{ paddingHorizontal: 10 }}>
                  <ActivityIndicator
                    size={"large"}
                    color="#000"
                  />
                </View>
                :
                <TouchableOpacity
                  disabled={this.props.sending}
                  onPress={this.sendMessage}
                  style={{ paddingHorizontal: 10 }}>
                  <Image
                    source={Send}
                    style={{ width: 22, height: 22, tintColor: this.props.sending ? '#aaa' : '#000' }}
                  />
                </TouchableOpacity>
            }

            {
              this.state.isRecording ?
                <Animatable.View ref={component => this.recordingView = component} style={{ ...StyleSheet.absoluteFill, left: "10%", }}>
                  <View style={{ backgroundColor: Colors.Primary, padding: 10, alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "row" }}>
                    <Text style={{ fontSize: 20, color: "#000", flex: 1, textAlign: "center" }}>
                      {((this.state.recordTime + "").length == 1 ? "0" + this.state.recordTime : this.state.recordTime) + ':' + (((this.state.recordSecs % 60) + "").length == 1 ? "0" + (this.state.recordSecs % 60) : (this.state.recordSecs % 60))}
                    </Text>
                    <Animatable.View
                      animation={{
                        from: {
                          opacity: 0
                        },
                        to: {
                          opacity: 1
                        },
                        easing: "ease-in-out"
                      }}
                      iterationCount="infinite"
                      direction='alternate'
                      style={{ width: 15, height: 15, borderRadius: 100, borderWidth: 2, borderColor: "red", justifyContent: "center", alignItems: "center", }}>
                      <View style={{ width: 8, height: 8, borderRadius: 100, backgroundColor: "red" }} />
                    </Animatable.View>
                  </View>
                </Animatable.View>
                : null
            }

          </View>
          <Modal
            visible={this.state.filterModal}
            animationType='slide'
            onRequestClose={() => this.setState({ filterModal: false })}
          >
            <ApplyFilter
              type={this.state.file?.type}
              image={this.state.file.uri}
              dimensions={this.state.fileDimension}
              SaveButtonText="Send"
              onSave={(imageUri) => {
                this.setState({
                  file: {
                    ...this.state.file,
                    uri: Platform.OS == "ios" ? "file://" + imageUri : imageUri
                  },
                  filterModal: false
                }, () => {
                  this.sendMessage()
                })
              }}
            />
          </Modal>
          <MediaViewer
            onClose={() => this.setState({ showMedia: false })}
            visible={this.state.showMedia}
            media={img_url + this.state.selectedFile?.media}
            type={this.state.selectedFile?.image == 1 ? "image" : "video"}
          />
        </ImageBackground >
        <Modal
          transparent
          visible={this.state.uploadingModal}
          animationType='fade'
        // onRequestClose={() => this.setState({ uploadingModal: false })}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "90%", height: "40%", backgroundColor: "#fff", borderRadius: 10, justifyContent: "center", alignItems: "center" }}>
              <Heading>
                Uploading {parseFloat(this.state.uploading.sent / this.state.uploading.total * 100).toFixed(2)} %
              </Heading>
              <Box w="100%" marginTop="6">
                <Progress value={(this.state.uploading.sent / this.state.uploading.total) * 100} mx="4" />
              </Box>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  messages: state.ChatReducer.messages,
  sending: state.ChatReducer.sending
})

const mapDispatchToProps = dispatch => ({
  GetMessages: (data) => dispatch(ChatMiddleware.getMessages(data)),
  GetMoreMessages: (data) => dispatch(ChatMiddleware.getMoreMessages(data)),
  SendMessage: (data) => dispatch(ChatMiddleware.sendMessage(data)),
  AddMessage: (data) => dispatch({ type: ActionTypes.SendMessages, payload: data }),
  NoNotify: (data) => dispatch({ type: ActionTypes.ChatNotify, payload: data }),
  EmptyChat: () => dispatch({ type: ActionTypes.GetMessages, payload: [], next_url: null })
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    flex: 1, paddingLeft: 14, color: Colors.black,
    ...Platform.OS == "ios" ? { height: 45 } : {},
  },
  userImg: { width: 55, height: 55, borderRadius: 100 },
  msgDay: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.black,
    fontSize: 16,
  },
  footer: {
    paddingVertical: 4,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.black,
    alignItems: 'center',
  },
});

