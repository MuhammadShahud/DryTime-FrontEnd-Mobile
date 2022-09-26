import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Banner, BG } from '../../Assets';
import { Input, Button } from '../../Components';
import Header from '../../Components/Header';
import { Colors, AntDesign, SCREEN_WIDTH, IS_IOS, Entypo } from '../../Theme';
import DateTimePicker from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { connect } from 'react-redux';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      title: '',
      note: '',
      modal: false,
    };
  }
  handleChangeTitle = value => {
    this.setState({ title: value });
  };
  handleChangeNote = value => {
    this.setState({ note: value });
  };
  onChange = value => {
    this.setState({ time: value });
  };
  onChangeTO = value => {
    this.setState({ timeTo: value });
  };
  toggleSwitch = () => {
    this.setState(prevState => ({
      switchValue: !prevState.switchValue,
    }));
  };

  AddRequest = () => {
    let data = this.props.route.params?.data;
    let { day, title, note } = this.state;
    if (!title || !note) {
      alert("Please add title and note to contiue")
      return;
    }
    this.props.addRequest({
      date: day, title, note, therapist_id: data.id,
      callback: (response) => {
        if (response)
          this.setState({
            modal: true,
          })
      }
    })
  }

  render() {
    let { showPicker, showPickerTo } = this.state;
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPress={() => this.props.navigation.goBack()}
          ArrowBackIcon
          BellIcon
          Menu
          title={'Schedule'}
        />
        <KeyboardAwareScrollView>
          <View style={styles.body}>
            {this.state.day != '' ? (
              <View style={styles.FlexRow}>
                <Text style={styles.dateText}>
                  Date: {this.state.day?.day}-{this.state.day?.month}-
                  {this.state.day?.year}
                </Text>
                <AntDesign name={'calendar'} color={Colors.black} size={20} />
              </View>
            ) : null}
            <Calendar
              current={Date.now()}
              onDayPress={day => {
                this.setState({ day: day.dateString });
              }}
              disableAllTouchEventsForDisabledDays={true}
              markedDates={{
                [this.state.day]: { selected: true, selectedColor: 'black' },
              }}
              hideExtraDays={true}
              theme={{
                backgroundColor: 'rgba(255,255,255,0)',
                calendarBackground: 'rgba(255,255,255,0)',
                dayTextColor: 'black',
                monthTextColor: 'black',
                textSectionTitleColor: 'black',
                arrowColor: 'black',
                // selectedDayBackgroundColor: 'white',
                // selectedDayTextColor: '#ffffff',
                todayTextColor: 'white',
              }}
            />
            <View style={{ marginTop: 10 }}>
              <Input
                Mail
                inputPlaceHolder={'Title'}
                inputName={'Title'}
                onChange={this.handleChangeTitle}
                name={'Title'}
                value={this.state.title}
              />
            </View>

            <Text style={styles.inputSentence}>Note</Text>
            <TextInput
              style={styles.textInput}
              //image={MailIcon}
              placeholder={'Type here...'}
              multiline
              onChangeText={this.handleChangeNote}
              textAlignVertical={'top'}
              value={this.state.note}
              maxLength={150}
            />

            <Button
              width={'100%'}
              height={50}
              name={'Request'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{ marginTop: 20, marginBottom: 15 }}
              onPress={() =>
                this.AddRequest()
              }
            />
          </View>
        </KeyboardAwareScrollView>
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
                  textAlign: 'center',
                  fontSize: 16,
                  color: Colors.black,
                  marginTop: 45,
                }}>
                Please wait {'\n'}Admin will get back you
              </Text>
            </LinearGradient>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
})

const mapDispatchToProps = dispatch => ({
  addRequest: (data) => dispatch(ActivityMiddleware.addRequest(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  HeadingDate: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  FlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  inputSentence: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    marginTop: 0,
  },
  textInput: {
    width: '100%',
    height: 90,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
  Reminder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  ReminderText: {
    fontSize: 17,
    color: Colors.black,
    // fontWeight: 'bold',
  },
});
