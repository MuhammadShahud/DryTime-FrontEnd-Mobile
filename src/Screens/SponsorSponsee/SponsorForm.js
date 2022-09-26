import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button, Input } from '../../Components';
import Header from '../../Components/Header';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { AntDesign, Colors, Entypo, Ionicons } from '../../Theme';

class SponsorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      DateOfBirth: '',
      Address: '',
      Phone: '',
      Occupation: '',
      individual: 0,
      OrganizationName: '',
      OrganizationAddress: '',
      Title: '',
      EIN: '',
      Sponsorship: ['Select', 'Sober activity', 'Rehab center', 'Both'],
      Sponsorship_selected_v: '',
      modal: false
    };
  }
  handleChangeUserName = value => {
    this.setState({ UserName: value });
  };
  handleChangeTitle = value => {
    this.setState({ Title: value });
  };
  handleChangeEIN = value => {
    this.setState({ EIN: value });
  };
  handleChangeDateOfBirth = value => {
    this.setState({ DateOfBirth: value });
  };
  handleChangeAddress = value => {
    this.setState({ Address: value });
  };
  handleChangePhone = value => {
    this.setState({ Phone: value });
  };
  handleChangeOccupation = value => {
    this.setState({ Occupation: value });
  };
  handleChangeOrganizationName = value => {
    this.setState({ OrganizationName: value });
  };
  handleChangeOrganizationAddress = value => {
    this.setState({ OrganizationAddress: value });
  };


  getValue = (value) => {
    return value == 0 ? "individual" : "organization"
  }

  getSponsorValue = (value) => {
    return value == "Sober activity" ? "sober" : value == "Rehab center" ? "rehab" : "both"
  }

  AddSponsor = () => {
    let {
      DateOfBirth,
      Address,
      Phone,
      Occupation,
      individual,
      OrganizationName,
      OrganizationAddress,
      Title,
      EIN,
      Sponsorship_selected_v
    } = this.state;
    if (
      !Address ||
      !Phone ||
      !Occupation ||
      !Title ||
      !EIN ||
      !Sponsorship_selected_v) {
      alert("Please fill out the form to continue")
      return;
    }
    this.props.AddSponsor({
      DateOfBirth,
      Address,
      Phone,
      Occupation,
      individual: this.getValue(individual),
      OrganizationName,
      OrganizationAddress,
      Title,
      EIN,
      Sponsorship: this.getSponsorValue(Sponsorship_selected_v),
      callback: () => {
        this.setState({ modal: true })
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
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
          title={'Sponsor'}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}>
          <View style={styles.body}>
            <View style={{ width: '100%' }}>
              {/* <Input
                // Mail
                inputPlaceHolder={'User Name'}
                inputName={'User Name'}
                onChange={this.handleChangeUserName}
                name={'User Name'}
                value={this.state.UserName}
              /> */}
              {/* <Input
                // Mail
                inputPlaceHolder={'MM:DD:YYYY'}
                inputName={'Date of Birth'}
                onChange={this.handleChangeDateOfBirth}
                name={'Date of Birth'}
                value={this.state.DateOfBirth}
                keyboardType={'numeric'}
              /> */}
              <Text style={styles.inputSentence}>Address</Text>
              <TextInput
                style={styles.textInput}
                //image={MailIcon}
                placeholder={'Type here...'}
                multiline
                onChangeText={this.handleChangeAddress}
                textAlignVertical={'top'}
                value={this.state.Address}
                maxLength={150}
              />
              <Input
                // Mail
                inputPlaceHolder={'+1 234 234 234'}
                inputName={'Phone'}
                onChange={this.handleChangePhone}
                name={'Phone'}
                value={this.state.Phone}
                keyboardType={'phone-pad'}
              />
              <Input
                // Mail
                inputPlaceHolder={'Occupation'}
                inputName={'Occupation'}
                onChange={this.handleChangeOccupation}
                name={'Occupation'}
                value={this.state.Occupation}
              />
              <Text style={styles.inputSentence}>
                Are you sponsoring as an individual or organization?
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ individual: 0 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.individual == 0 ? (
                    <Ionicons
                      name={'radio-button-on'}
                      size={20}
                      color={Colors.black}
                    />
                  ) : (
                    <Ionicons
                      name={'radio-button-off-sharp'}
                      size={20}
                      color={Colors.black}
                    />
                  )}
                  <Text
                    style={{ marginHorizontal: 5, fontSize: 15, color: '#000' }}>
                    Individual
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ individual: 1 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.individual == 1 ? (
                    <Ionicons
                      name={'radio-button-on'}
                      size={20}
                      color={Colors.black}
                    />
                  ) : (
                    <Ionicons
                      name={'radio-button-off-sharp'}
                      size={20}
                      color={Colors.black}
                    />
                  )}
                  <Text
                    style={{ marginHorizontal: 5, fontSize: 15, color: '#000' }}>
                    Organization
                  </Text>
                </TouchableOpacity>
              </View>
              {
                this.state.individual == 1 ?
                  <View>
                    <Text style={styles.inputSentence}>
                      What is the name of your organization?
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      //image={MailIcon}
                      placeholder={'Type here...'}
                      multiline
                      onChangeText={this.handleChangeOrganizationName}
                      textAlignVertical={'top'}
                      value={this.state.OrganizationName}
                      maxLength={150}
                    />
                    <Text style={styles.inputSentence}>Organization Address?</Text>
                    <TextInput
                      style={styles.textInput}
                      //image={MailIcon}
                      placeholder={'Type here...'}
                      multiline
                      onChangeText={this.handleChangeOrganizationAddress}
                      textAlignVertical={'top'}
                      value={this.state.OrganizationAddress}
                      maxLength={150}
                    />
                  </View>
                  : null
              }

              <Input
                inputPlaceHolder={'Title'}
                inputName={'Title'}
                onChange={this.handleChangeTitle}
                name={'Title'}
                value={this.state.Title}
              />
              <Input
                inputPlaceHolder={'EIN'}
                inputName={'EIN'}
                onChange={this.handleChangeEIN}
                name={'EIN #'}
                value={this.state.EIN}
                keyboardType="phone-pad"
              />

              <View style={styles.inputContainer}>
                <Text style={styles.inputSentence}>
                  Who you want to sponsor?
                </Text>
                <SelectDropdown
                  dropdownStyle={{
                    borderRadius: 10,
                    borderColor: Colors.black,
                    borderWidth: 1,
                  }}
                  data={this.state.Sponsorship}
                  defaultValue={this.state.Sponsorship[0]}
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
                    this.setState({ Sponsorship_selected_v: selectedItem });
                  }}
                />
              </View>
              <Button
                //ArrowRight
                width={'100%'}
                height={50}
                name={'Submit'}
                textStyle={{
                  fontSize: 16,
                }}
                btnStyle={{ marginTop: 15, marginBottom: 20 }}
                onPress={() => this.AddSponsor()}
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
                    height: 180,
                    width: '90%',
                    backgroundColor: Colors.Secondary,
                    borderRadius: 14,
                    alignItems: 'center',
                    // justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    style={{ alignSelf: 'flex-end', marginRight: 8 }}
                    onPress={() => {
                      this.setState({ modal: false }),
                        this.props.navigation.navigate('BottomTabs');
                    }}>
                    <Entypo
                      name={'circle-with-cross'}
                      size={24}
                      color={'#000'}
                      style={{ marginLeft: 5, marginTop: 7 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 17.5,
                      color: Colors.black,
                      fontWeight: 'bold',
                    }}>
                    Submitted Successfully 
                  </Text>
                  <Text style={{ fontSize: 16, color: Colors.black, marginTop: 45 }}>
                    Your request has been submitted successfully
                  </Text>
                </LinearGradient>
              </View>
            </Modal>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  AddSponsor: (data) => dispatch(GeneralMiddleware.addSponsor(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SponsorForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  inputSentence: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    marginTop: 10,
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    height: 80,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
    marginTop: 6,
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
