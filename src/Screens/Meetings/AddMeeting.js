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
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button, Input } from '../../Components';
import Header from '../../Components/Header';
import { AntDesign, Colors, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Theme';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

class AddMeeting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: "",
            address: "",
            file: {
                uri: ""
            },
            type: "",
            filterModal: false,
            date: new Date(),
            time: new Date(),
            showDate: false,
            showTime: false,
            zip: ""
        };
    }
    handleChangeTitle = value => {
        this.setState({ title: value });
    };
    handleChangeAddress = value => {
        this.setState({ address: value });
    };
    handleChangeDescription = value => {
        this.setState({ description: value });
    };
    handleChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (currentDate) {
            this.setState({ date: currentDate, showDate: false })
        }
        else {
            this.setState({ showDate: false })
        }
    }
    handleChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate;
        if (currentDate) {
            this.setState({ time: currentDate, showTime: false })
        }
        else {
            this.setState({ showTime: false })
        }
    }

    selectImage = () => {
        Alert.alert("Select", "Please select an option", [
            {
                text: "Cancel",
            },
            {
                text: "Camera",
                onPress: () => {
                    try {
                        launchCamera({
                            mediaType: "photo",
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

    createMeeting = () => {
        let { description, file, address, title, type, date, time, zip } = this.state;
        if (!description || !address || !title || !date || !time) {
            alert("Please fill all fields");
            return;
        }
        this.props.meet({
            userId: this.props.user.user.id,
            description,
            ...file.uri ? { file } : {},
            address,
            title,
            zip,
            start_time: date.toISOString().split("T")[0] + " " + time.toISOString().split("T")[1].split(".")[0],
            type: type ? type == "AA Meeting" ? "AA" : type == "NA Meeting" ? "NA" : "GA" : "",
            callback: () => {
                this.setState({ file: { uri: "" }, description: "", title: "", address: "" })
                alert('Meeting created successfully!');
                this.props.navigation.goBack();
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
                    title={'Create Meeting'}
                />
                <ScrollView>
                    <View style={styles.body}>
                        <Text style={styles.inputSentence}>Title</Text>
                        <TextInput
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Type here...'}
                            multiline
                            onChangeText={this.handleChangeTitle}
                            textAlignVertical={'center'}
                            value={this.state.title}
                            maxLength={150}
                        />
                        <Text style={styles.inputSentence}>Address</Text>
                        <TextInput
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Type here...'}
                            multiline
                            onChangeText={this.handleChangeAddress}
                            textAlignVertical={'center'}
                            value={this.state.address}
                            maxLength={150}
                        />
                        <Text style={styles.inputSentence}>Description</Text>
                        <TextInput
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Type here...'}
                            multiline
                            onChangeText={this.handleChangeDescription}
                            textAlignVertical={'center'}
                            value={this.state.description}
                            maxLength={150}
                        />
                        <Text style={styles.inputSentence}>Zip Code</Text>
                        <TextInput
                            onChangeText={(zip) => this.setState({ zip })}
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Zip code'}
                            textAlignVertical={'center'}
                            value={this.state.zip}
                        />
                        <Text style={styles.inputSentence}>Date</Text>
                        <TextInput
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Select Date...'}
                            textAlignVertical={'center'}
                            value={moment(this.state.date).format("MM-DD-YYYY")}
                            onFocus={() => {
                                Keyboard.dismiss();
                                this.setState({ showDate: true })
                            }}
                        />
                        {this.state.showDate && (
                            <View style={{ flex: 1, width: "100%" }}>
                                <DateTimePicker
                                    value={this.state.date}
                                    mode='date'
                                    display="default"
                                    onChange={this.handleChangeDate}
                                />
                            </View>
                        )}
                        <Text style={styles.inputSentence}>Time</Text>
                        <TextInput
                            style={styles.textInput}
                            //image={MailIcon}
                            placeholder={'Select Time...'}
                            multiline
                            onChangeText={this.handleChangeTime}
                            textAlignVertical={'center'}
                            value={moment(this.state.time).format("hh:mm A")}
                            onFocus={() => {
                                Keyboard.dismiss();
                                this.setState({ showTime: true })
                            }}
                        />

                        {this.state.showTime && (
                            <View style={{ flex: 1, width: "100%" }}>
                                <DateTimePicker
                                    value={this.state.time}
                                    mode="time"
                                    is24Hour={false}
                                    display="default"
                                    onChange={this.handleChangeTime}
                                />
                            </View>
                        )}
                        <Text style={styles.inputSentence}>Meeting Type (Optional)</Text>
                        <SelectDropdown
                            dropdownStyle={{
                                borderRadius: 10,
                                borderColor: Colors.black,
                                borderWidth: 1,
                            }}
                            data={[
                                "AA Meeting",
                                "NA Meeting",
                                "GA Meeting"
                            ]}
                            defaultValue={this.state.type}
                            dropdownIconPosition="right"
                            renderDropdownIcon={() => {
                                return (
                                    <AntDesign
                                        name={'caretdown'}
                                        size={16}
                                        color={Colors.black}
                                        style={styles.w20}
                                    />
                                );
                            }}
                            buttonTextStyle={styles.dropDownBtnText}
                            buttonStyle={styles.btnStyle}
                            onSelect={(selectedItem, index) => {
                                this.setState({ type: selectedItem });
                            }}
                        />
                        <Text style={styles.inputSentence}>Choose (Optional)</Text>
                        <TouchableOpacity onPress={this.selectImage} style={styles.UploadImage}>
                            {this.state.file?.uri ?
                                <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }} source={{ uri: this.state.file.uri }} />
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
                                name={'Create Meeting'}
                                textStyle={{
                                    fontSize: 16,
                                }}
                                btnStyle={{ marginTop: 25, marginBottom: 15 }}
                                onPress={this.createMeeting}
                            />
                        </View>
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
    meet: data => dispatch(ActivityMiddleware.createMeeting(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddMeeting);

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
});
