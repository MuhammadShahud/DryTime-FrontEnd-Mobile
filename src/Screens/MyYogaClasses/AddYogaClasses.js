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
} from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button, Input } from '../../Components';
import Header from '../../Components/Header';
import { AntDesign, Colors, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Theme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import { img_url } from '../Config/APIs';
// import ApplyFilter from './ApplyFilter';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import SelectDropdown from 'react-native-select-dropdown';
import { Box, Heading, Progress } from 'native-base';
import { createThumbnail } from "react-native-create-thumbnail";


class AddYogaClasses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            duration: "",
            description: "",
            file: {
                uri: ""
            },
            uploading: {
                sent: 0,
                total: 0
            },
            uploadingModal: false
            // fileDimension: {
            //     height: 0,
            //     width: 0
            // },
            // filterModal: false
        };
    }
    handleChangeTitle = value => {
        this.setState({ title: value });
    };
    handleChangeDescription = value => {
        this.setState({ description: value });
    };

    handleChangeDuration = value => {
        this.setState({ duration: value });
    };

    addZero = (num) => {
        if (("" + num).length == 1)
            return "0" + num
        else
            return num
    }

    selectImage = () => {
        Alert.alert("Select", "Please select an option", [
            // {
            //   text: "Cancel",
            // },
            {
                text: "Cancel",
                // onPress: () => {
                //     if (this.state.file.uri)
                //         this.setState({
                //             filterModal: true
                //         })
                //     else
                //         alert("Please select image to  add filters")
                // }
            },
            {
                text: "Camera",
                onPress: () => {
                    try {
                        launchCamera({
                            mediaType: "video",
                            videoQuality: "low"
                        }, (response) => {
                            if (!response.errorCode && !response.didCancel) {
                                let img = response.assets[0];
                                let minutes = img.duration / 60;
                                let seconds = img.duration % 60;
                                this.setState({
                                    file: {
                                        uri: img.uri,
                                        name: img.fileName,
                                        size: img.fileSize,
                                        type: img.type,
                                    },
                                    duration: this.addZero(parseInt(minutes)) + ":" + this.addZero(parseInt(seconds))
                                    // fileDimension: {
                                    //     height: img.height,
                                    //     width: img.width
                                    // },
                                    // filterModal: true
                                })
                            }
                        })
                    } catch (error) {

                    }
                }
            },
            {
                text: "Library",
                onPress: () => {
                    try {
                        launchImageLibrary({
                            mediaType: "video",
                            videoQuality: "low"
                        }, (response) => {
                            if (!response.errorCode && !response.didCancel) {
                                let img = response?.assets[0];
                                let minutes = img.duration / 60;
                                let seconds = img.duration % 60;
                                this.setState({
                                    file: {
                                        uri: img.uri,
                                        name: img.fileName,
                                        size: img.fileSize,
                                        type: img.type
                                    },
                                    duration: this.addZero(parseInt(minutes)) + ":" + this.addZero(parseInt(seconds))
                                    // fileDimension: {
                                    //     height: img.height,
                                    //     width: img.width
                                    // },
                                    // filterModal: true
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

    UploadVideo = async () => {
        let { description, file, title, duration, } = this.state;
        if (!description || !file || !title || !duration) {
            alert("Please fill all fields to continue");
            return;
        }
        let thumb = await createThumbnail({
            url: file.uri,
            format: "png",
        });
        let thumb_name_array = thumb.path.split("/");
        let thumb_name = thumb_name_array[thumb_name_array.length - 1]
        thumb.name = thumb_name;
        this.setState({ uploadingModal: true })
        this.props.AddClass({
            token: this.props.user?.token,
            description,
            file,
            thumb,
            title,
            duration,
            uploading: (sent, total) => {
                this.setState({ uploading: { sent, total } })
            },
            callback: () => {
                this.setState({ file: { uri: "" }, description: "", title: "", duration: "", uploadingModal: false })
                alert('Video uploaded successfully!')
                this.props.navigation.goBack()
            }
        })
    }


    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <Header
                    onPressNotification={() =>
                        this.props.navigation.navigate('Notifications')
                    }
                    onPress={() => this.props.navigation.goBack()}
                    ArrowBackIcon
                    title={'Add Yoga Class'}
                />
                <ScrollView>
                    <View style={styles.body}>
                        <Text style={styles.inputSentence}>Title</Text>
                        <TextInput
                            style={styles.textInput0}
                            //image={MailIcon}
                            placeholder={'Type here...'}
                            multiline
                            onChangeText={this.handleChangeTitle}
                            value={this.state.title}
                            maxLength={150}
                        />
                        <Text style={styles.inputSentence}>Duration</Text>
                        <TextInput
                            style={styles.textInput0}
                            //image={MailIcon}
                            placeholder={'Type here...'}
                            multiline
                            onChangeText={this.handleChangeDuration}
                            value={this.state.duration + ""}
                            maxLength={150}
                        />
                        <Text style={styles.inputSentence}>Description</Text>
                        <TextInput
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Type here...'}
                            multiline
                            onChangeText={this.handleChangeDescription}
                            textAlignVertical={'top'}
                            value={this.state.description}
                            maxLength={150}
                        />
                        <Text style={styles.inputSentence}>Choose</Text>
                        <TouchableOpacity onPress={this.selectImage} style={styles.UploadImage}>
                            {this.state.file?.uri ?
                                <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={{ uri: this.state.file.uri }} />
                                :
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <AntDesign name={'cloudupload'} size={35} color={Colors.black} />
                                    <Text style={styles.ImageAndVideo}>Upload Video</Text>
                                </View>
                            }

                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Button
                                width={'100%'}
                                height={50}
                                name={'Upload'}
                                textStyle={{
                                    fontSize: 16,
                                }}
                                btnStyle={{ marginTop: 25, marginBottom: 15 }}
                                onPress={this.UploadVideo}
                            />
                        </View>
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
                        {/* <Modal
                        visible={this.state.filterModal}
                        animationType='slide'
                        onRequestClose={() => this.setState({ filterModal: false })}
                    >
                        <ApplyFilter
                            type={this.state.file?.type}
                            image={this.state.file.uri}
                            dimensions={this.state.fileDimension}
                            onSave={(imageUri) => {
                                this.setState({
                                    file: {
                                        ...this.state.file,
                                        uri: imageUri
                                    },
                                    filterModal: false
                                })
                            }}
                        />
                    </Modal> */}
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
    AddClass: data => dispatch(ActivityMiddleware.addYogaClass(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddYogaClasses);

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
    btnStyle: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        width: '100%',
        marginTop: 5,
        backgroundColor: 'transparent',
    },
    dropDownBtnText: {
        textAlign: 'left',
        color: 'rgb(9,59,62)',
        fontSize: 16,
    },
    w20: {
        width: 20,
    },
    inputContainer: {
        marginVertical: 5,
    },
    inputSentence: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.black,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    textInput0: {
        width: '100%',
        height: 50,
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
        width: '100%',
        height: 200,
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
