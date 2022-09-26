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
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button, Input } from '../../Components';
import Header from '../../Components/Header';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { Colors, Entypo, Ionicons } from '../../Theme';

class SponseeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ReligiousAffiliation: '',
      Counseling: '',
      CounselingYesNo: 0,
      inpatientTreatment: 0,
      WeeklyTreatment: 0,
      HelpSponsorship: '',
      waitingList: 0,
      modal: false
    };
  }
  handleChangeReligiousAffiliation = value => {
    this.setState({ ReligiousAffiliation: value });
  };
  handleChangeCounseling = value => {
    this.setState({ Counseling: value });
  };
  handleChangeWeeklyTreatment = value => {
    this.setState({ WeeklyTreatment: value });
  };
  handleChangeHelpSponsorship = value => {
    this.setState({ HelpSponsorship: value });
  };

  getValue = (value) => {
    return value == 0 ? "Yes" : "No"
  }

  AddSponsee = () => {
    let {
      ReligiousAffiliation,
      Counseling,
      CounselingYesNo,
      inpatientTreatment,
      WeeklyTreatment,
      HelpSponsorship,
      waitingList
    } = this.state;
    if (!ReligiousAffiliation || !Counseling || !HelpSponsorship) {
      alert("Please fill out the form to continue")
      return;
    }
    this.props.AddSponsee({
      ReligiousAffiliation,
      CounselingYesNo: this.getValue(CounselingYesNo),
      Counseling,
      inpatientTreatment: this.getValue(inpatientTreatment),
      WeeklyTreatment: this.getValue(WeeklyTreatment),
      HelpSponsorship,
      waitingList: this.getValue(waitingList),
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
          title={'Sponsee'}
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}>
          <View style={styles.body}>
            <View style={{ width: '100%' }}>
              <Input
                //Mail
                inputPlaceHolder={'Type here..'}
                inputName={'Religious Affiliation'}
                onChange={this.handleChangeReligiousAffiliation}
                name={'Religious Affiliation'}
                value={this.state.ReligiousAffiliation}
              />
              <Text style={styles.inputSentence}>
                Have you ever received Counseling, psychiatric, or drugs or
                alcohol treatment before?
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ CounselingYesNo: 0 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.CounselingYesNo == 0 ? (
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
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ CounselingYesNo: 1 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.CounselingYesNo == 1 ? (
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
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                //image={MailIcon}
                placeholder={'Type here...'}
                multiline
                onChangeText={this.handleChangeCounseling}
                textAlignVertical={'top'}
                value={this.state.Counseling}
                maxLength={150}
              />

              <Text style={styles.inputSentence}>
                Are you looking for inpatient treatment? (YES for inpatient NO for outpatient)
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ inpatientTreatment: 0 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.inpatientTreatment == 0 ? (
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
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ inpatientTreatment: 1 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.inpatientTreatment == 1 ? (
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
                    No
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputSentence}>
                Are you willing to follow your weekly treatment schedule?
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ WeeklyTreatment: 0 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.WeeklyTreatment == 0 ? (
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
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ WeeklyTreatment: 1 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.WeeklyTreatment == 1 ? (
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
                    No
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputSentence}>
                Why do you need Help/Sponsorship?
              </Text>
              <TextInput
                style={styles.textInput}
                //image={MailIcon}
                placeholder={'Type here...'}
                multiline
                onChangeText={this.handleChangeHelpSponsorship}
                textAlignVertical={'top'}
                value={this.state.HelpSponsorship}
                maxLength={150}
              />
              <Text style={styles.inputSentence}>
                Check yes if you want to be placed on the waiting list for
                in/out patients rehab sponsorship?
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => this.setState({ waitingList: 0 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.waitingList == 0 ? (
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
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ waitingList: 1 })}
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    marginVertical: 5,
                  }}>
                  {this.state.waitingList == 1 ? (
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
                    No
                  </Text>
                </TouchableOpacity>
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
                onPress={this.AddSponsee}
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
        </ScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  AddSponsee: (data) => dispatch(GeneralMiddleware.addSponsee(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SponseeForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    // justifyContent: "center",
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
});
