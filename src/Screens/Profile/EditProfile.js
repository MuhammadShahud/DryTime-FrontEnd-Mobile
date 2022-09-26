/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Alert,
    Platform,
} from 'react-native';
import { Alex, BG, Logo } from '../../Assets';
import { Button, Input } from '../../Components';
import {
    Colors,
    FontAwesome,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    AntDesign,
} from '../../Theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import { AuthMiddleware } from '../../Redux/middleware/AuthMiddleware';
import { connect } from 'react-redux';
import { ActionTypes } from '../../Redux/action_types';
import Header from '../../Components/Header';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { img_url } from '../../Config/APIs';
import ApplyFilter from './ApplyFilter';
import moment from 'moment';
import { Checkbox } from 'native-base';


class EditProfile extends Component {
    constructor(props) {
        super(props);
        let user = props.user?.user;
        this.state = {
            username: user.username ? user.username : "",
            relationship_status: [
                'Select',
                'T/Teen',
                'S/Single',
                'IC/In a committed relationship',
                'Married',
                'L/Leave me alone',
            ],
            relationship_status_v: user.relation_status ? user.relation_status : "Select",
            Single_status: [
                'Select',
                'SA/Single available',
                'SN/Single not available',
            ],
            Single_status_v: user.relation_status1 ? user.relation_status1 : "Select",
            gender: [
                'Select',
                'Male',
                'Female',
                'Non- Binary',
                'Transgender',
                'Intersex',
                'Other',
            ],
            gender_selected_v: user.gender ? this.toTitleCase(user.gender) : "Select",
            OtherGender: '',
            Addictions: ['Gambling', 'Smoking', 'Drugs', 'Alcohol', 'Tobacco', "Other/List Addiction"],
            Addiction_selected_v: user.user_addiction ? [...user.user_addiction] : "",
            OtherAddiction: "",
            Single_Available: [
                'Select',
                'Infatuation: passion only',
                'Friendship: intimacy only',
                'Empty love: commitment only',
                'Romantic love: passion + intimacy',
                'Fatuous love: passion + commitment',
                'Companionate love: intimacy + commitment',
                'Consummate love: passion + intimacy + commitment',
            ],
            Single_Available_v: user.relation_status2 ? user.relation_status2 : "Select",
            Single_Not_Available: ['Select', 'Friendship only', 'Not Looking'],
            Single_Not_Available_v: user.relation_status2 ? user.relation_status2 : "Select",
            Married_Status: [
                'Select',
                'Friendship only',
                'Not Looking',
                'F/Teacher /student friendship',
                'W/Work or professional relationship',
                'Friendships',
            ],
            Married_Status_v: user.relation_status1 ? user.relation_status1 : "Select",
            sober: user.sober_time ? user.sober_time : "",
            // RehabCenter: {
            //     data: [],
            //     rehabs: [],
            // },
            // Rehab_selected_v: user.rehab_name ? user.rehab_name : "",
            // Rehab_selected_vid: user.rehab_id,
            rehab: user?.rehab_name ? "Yes" : "No",
            Rehab_selected_v: user?.rehab_name,
            // OtherRehab: '',
            InOutPatient: ['Select', 'Inpatient', 'Outpatient'],
            InOutPatient_v: user.patient_type ? this.toTitleCase(user.patient_type) : "",
            DateOfBirth: user.dob ? user.dob : "",
            file: user?.profile_pic ? {
                uri: img_url + user.profile_pic
            } : {
                uri: ""
            },
            filterModal: false,
            fileDimension: {
                height: 0,
                width: 0
            },
        };
    }

    toTitleCase = (str) => {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    componentDidMount() {
        let user = this.props.user?.user;
        // this.props.getRehabs({
        //     callback: data => {
        //         let rehabs = data.map(element => {
        //             return element.rehab_name;
        //         });
        //         let selected_rehab = data.find((value) => value.id == user.rehab_id)
        //         this.setState({ RehabCenter: { data, rehabs }, Rehab_selected_v: selected_rehab?.rehab_name });
        //     },
        // });
        let OtherAddiction = "";
        let addictions = [...user.user_addiction].map((value, index) => {
            if (this.state.Addictions.includes(value.addiction))
                return value.addiction
            else {
                OtherAddiction = value.addiction;
                return "Other/List Addiction"
            }
        });

        this.setState({ Addiction_selected_v: addictions, OtherAddiction })
    }

    getAddictionArray = () => {
        if (this.state.Addiction_selected_v.includes(this.state.Addictions[this.state.Addictions.length - 1])) {
            let addictionArray = [...this.state.Addiction_selected_v];
            let addic_index = addictionArray.findIndex((value) => value == this.state.Addictions[this.state.Addictions.length - 1]);
            addictionArray[addic_index] = this.state.OtherAddiction;
            return addictionArray;
        }
        else
            return this.state.Addiction_selected_v;

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
                                    filterModal: true,
                                    fileDimension: {
                                        height: img.height,
                                        width: img.width
                                    },
                                })
                            } else if (response.didCancel) {
                                console.warn("error", response);
                            }
                        })
                    } catch (error) {
                        console.warn("error", error);
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
                                let img = response.assets[0];
                                this.setState({
                                    file: {
                                        uri: img.uri,
                                        name: img.fileName,
                                        size: img.fileSize,
                                        type: img.type
                                    },
                                    filterModal: true,
                                    fileDimension: {
                                        height: img.height,
                                        width: img.width
                                    },
                                })
                            } else if (response.didCancel) {
                                console.warn('error', response);
                            }
                        })
                    } catch (error) {
                        console.warn('error', error);
                    }
                }
            },

        ])
    }

    handleChangeEmail = value => {
        this.setState({ email: value });
    };
    handleChangeUserName = value => {
        this.setState({ username: value });
    };
    handleChangePassword = value => {
        this.setState({ password: value });
    };
    handleChangeRePassword = value => {
        this.setState({ Repassword: value });
    };
    handleChangeOther = value => {
        this.setState({ OtherGender: value });
    };
    handleChangeSober = value => {
        this.setState({ sober: value });
    };
    handleChangeOtherRehab = value => {
        this.setState({ OtherRehab: value });
    };
    handleChangeDateOfBirth = value => {
        this.setState({ DateOfBirth: value.length == 2 ? value + '-' : this.state.DateOfBirth.length == 4 ? value + '-' : value });
    };

    Update = () => {
        let {
            username,
            gender_selected_v,
            OtherGender,
            DateOfBirth,
            Rehab_selected_v,
            Rehab_selected_vid,
            InOutPatient_v,
            sober,
            OtherRehab,
            relationship_status_v,
            Single_status_v,
            Single_Available_v,
            Single_Not_Available_v,
            Married_Status_v,
            Addiction_selected_v,
            file
        } = this.state;
        if (
            username &&
            gender_selected_v &&
            gender_selected_v != 'Select' &&
            DateOfBirth &&
            sober &&
            relationship_status_v != 'Select' &&
            relationship_status_v &&
            Addiction_selected_v.length >= 1
        ) {
            if (gender_selected_v == 'Other' && !OtherGender) {
                alert('Please enter gender');
                return;
            }
            // if (
            //     relationship_status_v == 'S/Single' &&
            //     (!Single_Available_v || !Single_Not_Available_v)
            // ) {
            //     alert('Please select your relationship status');
            //     return;
            // }
            if (relationship_status_v == 'Married' && !Married_Status_v) {
                alert('Please select your relationship status');
                return;
            }
            this.props.UpdateProfile({
                username,
                Gender: gender_selected_v == 'Other' ? OtherGender : gender_selected_v,
                DateOfBirth,
                Rehab: Rehab_selected_v, //== 'Other' ? OtherRehab : Rehab_selected_vid,
                patient: InOutPatient_v,
                sober,
                relation_status: relationship_status_v,
                single_avail: Single_Available_v,
                single_not_avail: Single_Not_Available_v,
                married: Married_Status_v,
                addiction: JSON.stringify(this.getAddictionArray()),
                single_status: Single_status_v,
                profile_pic: file,
                token: this.props.user.token,
                onSuccess: () => {
                    this.props.navigation.goBack();
                }

            });
        } else alert('Please fill all fields');
    };

    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <Header ArrowBackIcon onPress={() => this.props.navigation.goBack()} title={'Edit Profile'} />
                <View style={{ flex: 1, width: '85%', alignSelf: 'center' }}>
                    <KeyboardAwareScrollView style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity
                                onPress={this.selectImage}
                            >
                                <Image source={this.state.file.uri ? { uri: this.state.file.uri } : Alex} style={{ width: 150, height: 200, resizeMode: "contain" }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.InputView}>
                            <Input
                                inputPlaceHolder={'User Name'}
                                onChange={this.handleChangeUserName}
                                name={'User Name'}
                                value={this.state.username}
                            />
                            <Input
                                // Mail
                                inputPlaceHolder={'MM: DD: YY'}
                                inputName={'Date of Birth'}
                                onChange={this.handleChangeDateOfBirth}
                                name={'Date of Birth'}
                                value={this.state.DateOfBirth?moment(this.state.DateOfBirth).format("DD-YY-YYYY"):this.state.DateOfBirth}
                                keyboardType={'number-pad'}
                            />
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputSentence}>
                                    Which of the following most accurately describe you?
                                </Text>
                                <SelectDropdown
                                    dropdownStyle={{
                                        borderRadius: 10,
                                        borderColor: Colors.black,
                                        borderWidth: 1,
                                    }}
                                    data={this.state.gender}
                                    defaultValue={this.state.gender_selected_v}
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
                                        this.setState({ gender_selected_v: selectedItem });
                                    }}
                                />
                            </View>
                            {this.state.gender_selected_v == 'Other' ? (
                                <Input
                                    inputPlaceHolder={'Type here'}
                                    inputName={'other'}
                                    onChange={this.handleChangeOther}
                                    name={'Other'}
                                    value={this.state.OtherGender}
                                />
                            ) : null}

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputSentence}>
                                    What type of addiction you have to overcome?
                                </Text>
                                <View style={{ flexWrap: "wrap", flex: 1, flexDirection: 'row', }}>
                                    {
                                        this.state.Addictions.map((value) => (
                                            <View style={{ flexDirection: 'row', margin: 10 }}>
                                                <Checkbox
                                                    value={value}
                                                    isChecked={this.state.Addiction_selected_v.includes(value)}
                                                    onChange={(checked) => {
                                                        let addiction_array = [...this.state.Addiction_selected_v];
                                                        if (checked) {
                                                            addiction_array.push(value);
                                                            this.setState({ Addiction_selected_v: addiction_array })
                                                        }
                                                        else {
                                                            let index = addiction_array.findIndex((val) => val == value)
                                                            addiction_array.splice(index, 1);
                                                            this.setState({ Addiction_selected_v: addiction_array })
                                                        }
                                                    }}
                                                />
                                                <Text style={{ marginStart: 5 }}>{value}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                {
                                    this.state.Addiction_selected_v.includes("Other/List Addiction") ?
                                        <Input
                                            inputPlaceHolder={'Enter Addiction'}
                                            inputName={'Other Addiction'}
                                            onChange={(text) => this.setState({ OtherAddiction: text })}
                                            name={'Other Addiction'}
                                            value={this.state.OtherAddiction}
                                        /> : null
                                }

                                {/* <SelectDropdown
                  dropdownStyle={{
                    borderRadius: 10,
                    borderColor: Colors.black,
                    borderWidth: 1,
                  }}
                  data={this.state.Addictions}
                  defaultValue={this.state.Addictions[0]}
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
                    this.setState({ Addiction_selected_v: selectedItem });
                  }}
                /> */}
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputSentence}>Have you ever been to Rehab Center?</Text>
                                <SelectDropdown
                                    dropdownStyle={{
                                        borderRadius: 10,
                                        borderColor: Colors.black,
                                        borderWidth: 1,
                                    }}
                                    defaultValue={this.state.rehab}
                                    data={["Yes", "No"]}
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
                                        this.setState({
                                            rehab: selectedItem
                                        });
                                    }}
                                />
                                {
                                    this.state.rehab == "Yes" ?
                                        <Input
                                            // Mail
                                            inputPlaceHolder={'Enter Rehab center name'}
                                            inputName={'Enter Rehab center name'}
                                            onChange={(text) => this.setState({ Rehab_selected_v: text })}
                                            name={''}
                                            value={this.state.Rehab_selected_v}
                                        />
                                        : null
                                }

                            </View>
                            {/* <View style={styles.inputContainer}>
                                <Text style={styles.inputSentence}>Rehab Center?</Text>
                                <SelectDropdown
                                    dropdownStyle={{
                                        borderRadius: 10,
                                        borderColor: Colors.black,
                                        borderWidth: 1,
                                    }}
                                    defaultValue={this.state.Rehab_selected_v}
                                    data={this.state.RehabCenter?.rehabs}
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
                                        this.setState({
                                            Rehab_selected_v: selectedItem,
                                            Rehab_selected_vid: this.state.RehabCenter.data[index].id,
                                        });
                                    }}
                                />
                            </View> */}
                            {
                           //  {this.state.Rehab_selected_v == 'Other' ? (
                            //    <Input
                            //        inputPlaceHolder={'Enter name of other rehab center'}
                            //        inputName={'Other Rehab Center'}
                           //         onChange={this.handleChangeOtherRehab}
                           //         name={'Other Rehab Center'}
                           //         value={this.state.OtherRehab}
                          //      />
                          //  ) : this.state.Rehab_selected_v != 'Other' &&
                             //   this.state.Rehab_selected_v != 'Select' && 
                                this.state.Rehab_selected_v != '' ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputSentence}>
                                        Inpatient / Outpatient?
                                    </Text>
                                    <SelectDropdown
                                        dropdownStyle={{
                                            borderRadius: 10,
                                            borderColor: Colors.black,
                                            borderWidth: 1,
                                        }}
                                        data={this.state.InOutPatient}
                                        defaultValue={this.state.InOutPatient_v}
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
                                            this.setState({ InOutPatient_v: selectedItem });
                                        }}
                                    />
                                </View>
                            ) : null}
                            <Text
                                style={{
                                    ...styles.inputSentence,
                                    marginTop: 10,
                                    marginBottom: -15,
                                }}>
                                How long have you been sober?
                            </Text>
                            <Input
                                inputPlaceHolder={'Type here...'}
                                onChange={this.handleChangeSober}
                                value={this.state.sober}
                            />
                            {/* <TextInput
                style={styles.textInput}
                //image={MailIcon}
                placeholder={'Type here...'}
                multiline
                onChangeText={this.handleChangeSober}
                textAlignVertical={'top'}
                value={this.state.sober}
                maxLength={150}
              /> */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Relationship Status</Text>
                                <SelectDropdown
                                    dropdownStyle={{
                                        borderRadius: 10,
                                        borderColor: Colors.black,
                                        borderWidth: 1,
                                    }}
                                    data={this.state.relationship_status}
                                    defaultValue={this.state.relationship_status_v}
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
                                        this.setState({ relationship_status_v: selectedItem });
                                    }}
                                />
                            </View>
                            {this.state.relationship_status_v == 'Married' ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Married Status</Text>
                                    <SelectDropdown
                                        dropdownStyle={{
                                            borderRadius: 10,
                                            borderColor: Colors.black,
                                            borderWidth: 1,
                                        }}
                                        data={this.state.Married_Status}
                                        defaultValue={this.state.Married_Status_v}
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
                                            this.setState({ Married_Status_v: selectedItem });
                                        }}
                                    />
                                </View>
                            ) : null}
                            {this.state.relationship_status_v == 'S/Single' ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Single Status</Text>
                                    <SelectDropdown
                                        dropdownStyle={{
                                            borderRadius: 10,
                                            borderColor: Colors.black,
                                            borderWidth: 1,
                                        }}
                                        data={this.state.Single_status}
                                        defaultValue={this.state.Single_status_v}
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
                                            this.setState({ Single_status_v: selectedItem });
                                        }}
                                    />
                                </View>
                            ) : null}
                            {this.state.Single_status_v == 'SA/Single available' &&
                                this.state.relationship_status_v == 'S/Single' ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Single available</Text>
                                    <SelectDropdown
                                        dropdownStyle={{
                                            borderRadius: 10,
                                            borderColor: Colors.black,
                                            borderWidth: 1,
                                        }}
                                        data={this.state.Single_Available}
                                        defaultValue={this.state.Single_Available_v}
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
                                            this.setState({ Single_Available_v: selectedItem });
                                        }}
                                    />
                                </View>
                            ) : null}
                            {this.state.Single_status_v == 'SN/Single not available' &&
                                this.state.relationship_status_v == 'S/Single' ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Single Not Available</Text>
                                    <SelectDropdown
                                        dropdownStyle={{
                                            borderRadius: 10,
                                            borderColor: Colors.black,
                                            borderWidth: 1,
                                        }}
                                        data={this.state.Single_Not_Available}
                                        defaultValue={this.state.Single_Not_Available_v}
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
                                            this.setState({ Single_Not_Available_v: selectedItem });
                                        }}
                                    />
                                </View>
                            ) : null}
                            <Button
                                ArrowRight
                                width={'100%'}
                                height={50}
                                name={'Update'}
                                textStyle={{
                                    fontSize: 16,
                                }}
                                btnStyle={{ marginTop: 20, marginBottom: 10 }}
                                onPress={
                                    () => {
                                        this.Update()
                                    }
                                }
                            />

                        </View>
                    </KeyboardAwareScrollView>
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
                </View>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user
});

const mapDispatchToProps = dispatch => ({
    UpdateProfile: data => dispatch(AuthMiddleware.UpdateProfile(data)),
    getRehabs: data => dispatch(AuthMiddleware.getRehabs(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        //alignItems: 'center',
    },
    AppLogo: {
        width: 250,
        height: 200,
        marginTop: 40,
        marginBottom: 15,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    InputView: {
        //width: '85%',
    },
    DontHaveText: {
        marginTop: 15,
        fontSize: 16,
        color: Colors.black,
        fontWeight: 'normal',
        alignSelf: 'center',
    },
    TextSignIn: {
        fontSize: 16,
        color: Colors.black,
        fontWeight: 'bold',
        top: 5,
        marginLeft: 5,
    },
    inputContainer: {
        marginVertical: 5,
    },
    inputLabel: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.black,
        textTransform: 'capitalize',
        marginBottom: 5,
    },
    inputSentence: {
        fontSize: 16,
        marginLeft: 10,
        color: Colors.black,
        marginBottom: 5,
    },
    w20: {
        width: 20,
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
    textInput: {
        width: '100%',
        height: 50,
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 6,
        marginTop: 5,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingTop: 8,
        color: 'rgb(9,59,62)',
        backgroundColor: 'transparent',
    },
});

