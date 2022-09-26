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
  AsyncStorage,
  Platform,
  Alert,
} from 'react-native';
import { BG, faceId, Logo } from '../Assets';
import { Button, Input } from '../Components';
import {
  Colors,
  FontAwesome,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  AntDesign,
} from '../Theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import { AuthMiddleware } from '../Redux/middleware/AuthMiddleware';
import { connect } from 'react-redux';
import { ActionTypes } from '../Redux/action_types';
import messaging from '@react-native-firebase/messaging';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Checkbox } from 'native-base';

class SignUp extends Component {
  constructor(props) {
    super(props);
    let user = props.route.params?.user;
    this.state = {
      email: user?.email ? user?.email : "",
      username: user?.name ? user?.name : "",
      password: '',
      Repassword: '',
      relationship_status: [
        'Select',
        'T/Teen',
        'S/Single',
        'IC/In a commited relationship',
        'Married',
        'L/Leave me alone',
      ],
      relationship_status_v: '',
      Single_status: [
        'Select',
        'SA/Single available',
        'SN/Single not available',
      ],
      Single_status_v: '',
      gender: [
        'Select',
        'Male',
        'Female',
        'Non- Binary',
        'Transgender',
        'Intersex',
        "I'd rather not say",
        'Other',
      ],
      gender_selected_v: '',
      OtherGender: '',
      Addictions: ['Gambling', 'Smoking', 'Drugs', 'Alcohol', 'Tobacco', "Other/List Addiction"],
      Addiction_selected_v: [],
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
      Single_Available_v: '',
      Single_Not_Available: ['Select', 'Friendship only', 'Not Looking'],
      Single_Not_Available_v: '',
      Married_Status: [
        'Select',
        'Friendship only',
        'Not Looking',
        'F/Teacher /student friendship',
        'W/Work or professional relationship',
        'Friendships',
      ],
      Married_Status_v: '',
      sober: '',
      // RehabCenter: {
      //   data: [],
      //   rehabs: [],
      // },
      rehab: "No",
      Rehab_selected_v: '',
      // Rehab_selected_vid: '',
      OtherRehab: '',
      InOutPatient: ['Select', 'Inpatient', 'Outpatient'],
      InOutPatient_v: '',
      DateOfBirth: '',
      modalFaceId: false,
      WhyUsingApp: "",
      WhereHear: "",
      WhyUsingAppArray: [
        "Personal",
        "Professional"
      ]
    };
  }

  componentDidMount() {
    // this.props.getRehabs({
    //   callback: data => {
    //     let rehabs = data.map(element => {
    //       return element.rehab_name;
    //     });
    //     this.setState({ RehabCenter: { data, rehabs } });
    //   },
    // });
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
    if (this.deleteDOB)
      this.setState({ DateOfBirth: value })
    else
      this.setState({ DateOfBirth: value.length == 2 ? value + '-' : this.state.DateOfBirth.length == 4 ? value + '-' : value });
  };

  handleChangeUsingApp = value => {
    this.setState({ WhyUsingApp: value });
  };

  handleChangeWhereHear = value => {
    this.setState({ WhereHear: value });
  };

  Register = async () => {
    let {
      email,
      username,
      password,
      Repassword,
      gender_selected_v,
      OtherGender,
      DateOfBirth,
      Rehab_selected_v,
      Rehab_selected_vid,
      InOutPatient_v,
      sober,
      OtherRehab,
      relationship_status_v,
      Single_Available_v,
      Single_Not_Available_v,
      Married_Status_v,
      Addiction_selected_v,
      Single_status_v,
      WhereHear,
      WhyUsingApp
    } = this.state;
    if (!this.props.route.params?.user) {
      if (password && Repassword) {
        if (password != Repassword) {
          alert('Password not match');
          return;
        }
      }
      else {
        alert("Please create a password");
        return;
      }
    }

    if (
      email &&
      username &&
      gender_selected_v &&
      gender_selected_v != 'Selected' &&
      DateOfBirth &&
      sober &&
      relationship_status_v != 'Selected' &&
      relationship_status_v &&
      Single_status_v != 'Select',
      Addiction_selected_v.length >= 1
    ) {
      if (gender_selected_v == 'Other' && !OtherGender) {
        alert('Please enter gender');
        return;
      }
      if (
        relationship_status_v == 'S/Single' &&
        (!Single_Available_v && !Single_Not_Available_v)
      ) {
        alert('Please select your relationship status');
        return;
      }
      if (relationship_status_v == 'Married' && !Married_Status_v) {
        alert('Please select your relationship status');
        return;
      }

      if (!messaging().isDeviceRegisteredForRemoteMessages)
        await messaging().registerDeviceForRemoteMessages();
      let token = "";
      let authStatus = await messaging().hasPermission();

      if (authStatus != messaging.AuthorizationStatus.AUTHORIZED)
        messaging().requestPermission();

      if (messaging().isDeviceRegisteredForRemoteMessages && authStatus == messaging.AuthorizationStatus.AUTHORIZED)
        token = await messaging().getToken();


      let data = {
        email,
        username,
        password,
        Repassword,
        Gender: gender_selected_v == 'Other' ? OtherGender : gender_selected_v,
        DateOfBirth,
        Rehab: Rehab_selected_v,// == 'Other' ? OtherRehab : Rehab_selected_vid,
        patient: InOutPatient_v,
        sober,
        relation_status: relationship_status_v,
        single_avail: Single_Available_v,
        single_not_avail: Single_Not_Available_v,
        married: Married_Status_v,
        addiction: JSON.stringify(this.getAddictionArray()),
        single_status: Single_status_v,
        token,
        WhereHear,
        WhyUsingApp,
        callback: () => {
          this.props.navigation.goBack();
          this.setState({ modalFaceId: true })
        }
      }
      this.props.Register(data);
    } else alert('Please fill all fields');
  };

  SetFaceIdFingerprint = async () => {
    let sensor = await ReactNativeBiometrics.isSensorAvailable();
    if (sensor.available) {
      let keys = await ReactNativeBiometrics.biometricKeysExist();
      if (!keys.keysExist)
        (await ReactNativeBiometrics.createKeys()).publicKey

      let signature = await ReactNativeBiometrics.createSignature({
        payload: "Set Face ID/Fingerprint",
        promptMessage: "Set Face ID/Fingerprint signin for drytime",
      });
      if (signature.success) {
        AsyncStorage.setItem("@DT-publicKey", signature.signature);
        this.setState({ modalFaceId: false })
        this.props.navigation.navigate("GetStarted")
      }
    }
    else {
      if (sensor.error)
        alert(sensor.error.split('"')[1])
      else
        alert("Face ID is not supported")
    }
  }

  Validation = () => {
    let {
      email,
      username,
      password,
      Repassword,
      gender_selected_v,
      OtherGender,
      DateOfBirth,
      Rehab_selected_v,
      Rehab_selected_vid,
      InOutPatient_v,
      sober,
      OtherRehab,
      relationship_status_v,
      Single_Available_v,
      Single_Not_Available_v,
      Married_Status_v,
      Addiction_selected_v,
      Single_status_v
    } = this.state;
    if (!this.props.route.params?.user) {
      if (password && Repassword) {
        if (password != Repassword) {
          alert('Password not match');
          return;
        }
      }
      else {
        alert("Please create a password");
        return;
      }
    }
    if (
      email &&
      username &&
      gender_selected_v &&
      gender_selected_v != 'Selected' &&
      DateOfBirth &&
      sober &&
      relationship_status_v != 'Selected' &&
      relationship_status_v &&
      Single_status_v != 'Select' &&
      Addiction_selected_v.length >= 1
    ) {
      if (gender_selected_v == 'Other' && !OtherGender) {
        alert('Please enter gender');
        return;
      }
      if (
        relationship_status_v == 'S/Single' &&
        (!Single_Available_v && !Single_Not_Available_v)
      ) {
        alert('Please select your relationship status');
        return;
      }
      if (relationship_status_v == 'Married' && !Married_Status_v) {
        alert('Please select your relationship status');
        return;
      }
      if (InOutPatient_v == 'Selected' && !InOutPatient_v && Rehab_selected_v == "Yes") {
        alert("Please select Inpatient/Outpatient");
        return;
      }
      this.props.navigation.navigate('AuthTermsAndServices', { Register: this.Register })
    } else alert('Please fill all fields');
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

  render() {
    let user = this.props.route.params?.user;
    return (
      <ImageBackground source={BG} style={styles.container}>
        <View style={{ flex: 1, width: '85%', alignSelf: 'center' }}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Animatable.View
              useNativeDriver
              duration={2000}
              animation={'bounceIn'}>
              <Image source={Logo} style={styles.AppLogo} />
            </Animatable.View>
            <View style={styles.InputView}>
              <Input
                inputPlaceHolder={'User Name'}
                inputName={'User Name'}
                onChange={this.handleChangeUserName}
                name={'User Name'}
                value={this.state.username}
              />
              <Input
                Mail
                inputPlaceHolder={'Email Address'}
                inputName={'Email'}
                onChange={this.handleChangeEmail}
                name={'Email'}
                value={this.state.email}
              />
              {
                user ?
                  null :
                  <Input
                    Lock
                    inputPlaceHolder={'Password'}
                    inputName={'password'}
                    onChange={this.handleChangePassword}
                    name={'Password'}
                    secure
                    value={this.state.password}
                  />
              }
              {
                user ?
                  null :
                  <Input
                    Lock
                    inputPlaceHolder={'Re-Type Password'}
                    inputName={'password'}
                    onChange={this.handleChangeRePassword}
                    name={'Confirm Password'}
                    secure
                    value={this.state.Repassword}
                  />
              }
              <Input
                // Mail
                inputPlaceHolder={'MM-DD-YYYY'}
                inputName={'Date of Birth'}
                onChange={this.handleChangeDateOfBirth}
                name={'Date of Birth'}
                value={this.state.DateOfBirth}
                keyboardType={"number-pad"}
                onKeyPress={(e) => {
                  let key = e.nativeEvent.key;
                  if (key == "Backspace") {
                    this.deleteDOB = true
                  }
                  else {
                    this.deleteDOB = false
                  }
                }}
              />
              <Input
                // Mail
                inputPlaceHolder={'Where?'}
                inputName={'Where did you hear about us?'}
                onChange={this.handleChangeWhereHear}
                name={'Where did you hear about us?'}
                value={this.state.WhereHear}
              />
              {/* <Input
                // Mail
                inputPlaceHolder={'Reason'}
                inputName={'Are you using this app for a personal or professional reason?'}
                onChange={this.handleChangeUsingApp}
                name={'Are you using this app for a personal or professional reason?'}
                value={this.state.WhyUsingApp}
              /> */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputSentence}>
                  Are you using this app for a personal or professional reason?
                </Text>
                <SelectDropdown
                  dropdownStyle={{
                    borderRadius: 10,
                    borderColor: Colors.black,
                    borderWidth: 1,
                  }}
                  data={this.state.WhyUsingAppArray}
                  defaultValue={this.state.WhyUsingApp[0]}
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
                    this.setState({ WhyUsingApp: selectedItem });
                  }}
                />
              </View>
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
                  defaultValue={this.state.gender[0]}
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
              {this.state.Rehab_selected_v == 'Other' ? (
                <Input
                  inputPlaceHolder={'Enter name of other rehab center'}
                  inputName={'Other Rehab Center'}
                  onChange={this.handleChangeOtherRehab}
                  name={'Other Rehab Center'}
                  value={this.state.OtherRehab}
                />
              ) : this.state.rehab != "No" ? (
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
                  defaultValue={this.state.relationship_status[0]}
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
                    defaultValue={this.state.Married_Status[0]}
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
                    defaultValue={this.state.Single_status[0]}
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
                    defaultValue={this.state.Single_Available[0]}
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
                    defaultValue={this.state.Single_Not_Available[0]}
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
                name={'Sign Up'}
                textStyle={{
                  fontSize: 16,
                }}
                btnStyle={{ marginTop: 20, marginBottom: 10 }}
                onPress={
                  () => {
                    this.Validation()
                  }
                }
              />

              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <Text style={styles.DontHaveText}>Don't have an account ?</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                  <Text style={styles.TextSignIn}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.state.modalFaceId}
            onRequestClose={() => this.setState({ modalFaceId: false })}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.50)',
                marginTop: 30
              }}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[Colors.white, Colors.white]}
                style={{
                  height: 400,
                  width: '90%',
                  backgroundColor: Colors.Secondary,
                  borderRadius: 14,
                  alignItems: 'center',
                  //justifyContent: 'center',
                }}>
                {/* <TouchableOpacity
                  style={{ alignSelf: 'flex-end', marginRight: 8, opacity: 0.3 }}
                  onPress={() => this.setState({ modalFaceId: false })}>
                  <AntDesign
                    name={'closecircleo'}
                    size={24}
                    color={'#000'}
                    style={{ marginLeft: 5, marginTop: 7 }}
                  />
                </TouchableOpacity> */}
                <Text
                  style={{ fontSize: 18, color: Colors.black, fontWeight: 'bold' }}>
                  Set Face ID
                </Text>
                <View style={{ width: '90%', marginTop: 20 }}>
                  <Image
                    source={faceId}
                    style={{
                      width: 160,
                      height: 180,
                      marginVertical: 30,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                  <Button
                    animation={'zoomIn'}
                    width={'100%'}
                    height={50}
                    name={'Next'}
                    textStyle={{
                      fontSize: 16,
                      color: Colors.white,
                    }}
                    btnStyle={{ marginTop: 10 }}
                    onPress={this.SetFaceIdFingerprint}
                    ColorSecondary={Colors.Primary}
                    ColorPrimary={Colors.Primary}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    marginTop: 20,
                    marginRight: 8,
                    opacity: 0.3,
                  }}
                  onPress={() => {
                    this.setState({ modalFaceId: false })
                    this.props.navigation.navigate("GetStarted")
                  }}>
                  <Text style={{ fontSize: 16, color: '#000' }}>{'Skip >>'}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  Register: (data) => dispatch(AuthMiddleware.Register(data)),
  getRehabs: data => dispatch(AuthMiddleware.getRehabs(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

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
