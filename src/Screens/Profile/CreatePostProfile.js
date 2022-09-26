/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button, Input } from '../../Components';
import Header from '../../Components/Header';
import { PostMiddleware } from '../../Redux/middleware/PostMiddleware';
import { AntDesign, Colors, Entypo, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Theme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { img_url } from '../../Config/APIs';
import ApplyFilter from './ApplyFilter';
import { Box, Heading, Progress } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import ImageResizer from 'react-native-image-resizer';

class CreatePostProfile extends Component {
  constructor(props) {
    super(props);
    let item = props.route.params?.item;
    this.state = {
      title: '',
      Description: item?.description,
      file: item?.file ? {
        uri: img_url + item.file
      } : {
        uri: ""
      },
      fileDimension: {
        height: 0,
        width: 0
      },
      filterModal: false,
      uploading: {
        sent: 0,
        total: 0
      },
      uploadingModal: false,
      modal: false
    };
  }
  handleChangeTitle = value => {
    this.setState({ title: value });
  };
  handleChangeDescription = value => {
    this.setState({ Description: value });
  };

  selectImage = () => {
    Alert.alert("Select", "Please select an option", [
      // {
      //   text: "Cancel",
      // },
      {
        text: "Change Filter",
        onPress: () => {
          if (this.props.user?.user?.user_subscription) {
            if (this.state.file.uri)
              this.setState({
                filterModal: true
              })
            else
              alert("Please select image to  add filters")
          }
          else {
            this.setState({ modal: true })
          }

        }
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
                    if (this.props.user?.user?.user_subscription) {
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
                    else {
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
                      })
                    }
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
                    if (this.props.user?.user?.user_subscription) {
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
                    else {
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
                      })
                    }
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
              quality: 0.8,
              videoQuality: "low"
            }, (response) => {
              if (!response.errorCode && !response.didCancel) {
                let img = response?.assets[0];
                if (this.props.user?.user?.user_subscription) {
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
                else {
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
                  })
                }
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

  Post = () => {
    let { Description, file, fileDimension } = this.state;

    // ImageResizer.createResizedImage(file.uri, fileDimension.width - (fileDimension.width / 4), fileDimension.height - (fileDimension.height / 4), "PNG", 0.9).then((value) => {
    //   this.setState({ file: { ...file, uri: value.uri } })
    // })
    // return;
    if (!Description || !file?.uri) {
      alert("Please add description & file to post");
      return;
    }
    let forum = this.props.route.params?.forum;
    let day = this.props.route.params?.day;

    this.props.Post({
      userId: this.props.user.user.id,
      token: this.props.user.token,
      Description,
      file,
      forum,
      day,
      uploading: (sent, total) => {
        this.setState({ uploading: { sent, total }, uploadingModal: true })
      },
      callback: () => {
        this.setState({ file: { uri: "" }, Description: "" })
        alert('Post created successfully!')
        this.setState({ uploading: { sent: 0, total: 0 }, uploadingModal: false })
        this.props.navigation.navigate("Home");
      }
    })
  }

  EditPost = () => {
    let { Description, file } = this.state;
    let item = props.route.params?.item;
    if (!Description || !file) {
      alert("Please add description & file to update post");
      return;
    }
    this.props.EditPost({
      id: item.id,
      Description,
      file: (img_url + item.file) == file ? null : file,
      uploading: (sent, total) => {
        this.setState({ uploading: { sent, total }, uploadingModal: true })
      },
      callback: () => {
        alert('Post edited successfully!')
        this.setState({ file: null, Description: "", uploading: { sent: 0, total: 0 }, uploadingModal: false })
        this.props.navigation.navigate("Home");

      }
    })
  }

  render() {
    let item = this.props.route.params?.item;
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() => this.props.navigation.navigate('Notifications')
          }
          onPress={() => {
            if (this.state.file?.uri) {
              Alert.alert("Do you want to go back", "Discard this post?", [
                {
                  text: "No",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    this.setState({ file: { uri: "" }, description: "" });
                    this.props.navigation.goBack();
                  }
                }
              ])
            }
            else {
              this.props.navigation.goBack();
            }
          }}
          ArrowBackIcon
          title={'Create Post'}
        />
        <ScrollView>
          <View style={styles.body}>
            <Text style={styles.inputSentence}>Description</Text>
            <TextInput
              style={styles.textInput}
              //image={MailIcon}
              placeholder={'Type here...'}
              multiline
              onChangeText={this.handleChangeDescription}
              textAlignVertical={'top'}
              value={this.state.Description}
            />
            <Text style={styles.inputSentence}>Choose</Text>
            <TouchableOpacity onPress={this.selectImage} style={styles.UploadImage}>
              {this.state.file?.uri ?
                <View style={{ width: "100%", height: "100%", }}>
                  <Image style={{ width: "100%", height: "100%", flex: 1, resizeMode: "contain", }} source={{ uri: this.state.file.uri }} />
                </View>
                :
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign name={'cloudupload'} size={35} color={Colors.black} />
                  <Text style={styles.ImageAndVideo}>Upload image/video</Text>
                </View>
              }

            </TouchableOpacity>
            <View style={{ width: '100%' }}>
              <Button
                width={'100%'}
                height={50}
                name={'Post'}
                textStyle={{
                  fontSize: 16,
                }}
                btnStyle={{ marginTop: 25, marginBottom: 15 }}
                onPress={item?.description ? this.EditPost : this.Post}
              />
            </View>
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
            <Modal
              visible={this.state.filterModal}
              animationType='slide'
              onRequestClose={() => this.setState({ filterModal: false })}
            >
              <ApplyFilter
                type={this.state.file?.type}
                image={this.state.file.uri}
                dimensions={this.state.fileDimension}
                onSave={(imageUri) => {
                  console.warn(Platform.OS == "ios" ? "file://" + imageUri : imageUri)
                  this.setState({
                    file: {
                      ...this.state.file,
                      uri: Platform.OS == "ios" ? "file://" + imageUri : imageUri
                    },
                    filterModal: false
                  })
                }}
              />
            </Modal>
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
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user
})

const mapDispatchToProps = dispatch => ({
  Post: data => dispatch(PostMiddleware.createPost(data)),
  EditPost: data => dispatch(PostMiddleware.EditPost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    padding: "7%",
    alignItems: 'center',
    justifyContent: "center",
    //justifyContent: 'center',
  },
  inputSentence: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '100%',
    height: 90,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
  UploadImage: {
    width: SCREEN_WIDTH * 0.87,
    height: 300,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
    alignItems: 'center',
    justifyContent: "center"
  },
  ImageAndVideo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginStart: 10
  },
});
