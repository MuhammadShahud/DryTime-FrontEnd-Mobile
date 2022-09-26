import React, {Component} from 'react';
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
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Banner, BG} from '../../Assets';
import {Input, Button} from '../../Components';
import Header from '../../Components/Header';
import {Colors, AntDesign, SCREEN_WIDTH, IS_IOS} from '../../Theme';
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class LearnInstrumentsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      title: '',
      note: '',
      showPicker: false,
      showPickerTo: false,
      time: Date(),
      timeTo: Date(),
      switchValue: true,
    };
  }
  handleChangeTitle = value => {
    this.setState({title: value});
  };
  handleChangeNote = value => {
    this.setState({note: value});
  };
  onChange = value => {
    this.setState({time: value});
  };
  onChangeTO = value => {
    this.setState({timeTo: value});
  };
  toggleSwitch = () => {
    this.setState(prevState => ({
      switchValue: !prevState.switchValue,
    }));
  };

  render() {
    let {showPicker, showPickerTo} = this.state;
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
          title={'Learn Instruments'}
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
                console.warn('selected day', day);
                this.setState({day: day});
              }}
              disableAllTouchEventsForDisabledDays={true}
              markedDates={{
                '2021-12-23': {selected: true, selectedColor: 'black'},
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
            <View style={{marginTop: 10}}>
              <Input
                Mail
                inputPlaceHolder={'Title'}
                inputName={'Title'}
                onChange={this.handleChangeTitle}
                name={'Title'}
                value={this.state.title}
              />
            </View>

            <View
              style={{
                alignSelf: 'center',
                // backgroundColor: 'red',
                width: '100%',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                isVisible={this.state.showPicker}
                mode={'time'}
                minimumDate={IS_IOS ? null : Date.now()}
                is24Hour={true}
                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                onConfirm={date => this.onChange(date)}
                onCancel={() => this.setState({showPicker: false})}
              />
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                isVisible={this.state.showPickerTo}
                mode={'time'}
                minimumDate={IS_IOS ? null : Date.now()}
                is24Hour={true}
                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                onConfirm={date => this.onChangeTO(date)}
                onCancel={() => this.setState({showPickerTo: false})}
              />
              <View
                style={{
                  marginRight: 0,
                  width: '47%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    marginTop: 3,
                    paddingTop: 4,
                    marginLeft: 8,
                  }}>
                  Start Time
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({showPicker: true})}
                  style={{
                    borderRadius: 10,
                    borderColor: Colors.black,
                    borderWidth: 1,
                    flexDirection: 'row',
                    width: '100%',
                    height: 50,
                    // backgroundColor: '#fff',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    marginTop: 3,
                    justifyContent: 'space-between',
                  }}>
                  <Text>
                    {this.state.time
                      ? new Date(this.state.time).toLocaleTimeString()
                      : ''}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '47%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.black,
                    marginTop: 3,
                    paddingTop: 4,
                    marginLeft: 8,
                  }}>
                  End Time
                </Text>
                <TouchableOpacity
                  onPress={() => this.setState({showPickerTo: true})}
                  style={{
                    borderRadius: 10,
                    borderColor: Colors.black,
                    borderWidth: 1,
                    flexDirection: 'row',
                    width: '100%',
                    height: 50,
                    // backgroundColor: '#fff',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    marginTop: 3,
                    justifyContent: 'space-between',
                  }}>
                  <Text>
                    {this.state.timeTo
                      ? new Date(this.state.timeTo).toLocaleTimeString()
                      : ''}
                  </Text>
                </TouchableOpacity>
              </View>
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
            <View style={styles.Reminder}>
              <Text style={styles.ReminderText}>Reminder</Text>
              <Switch
                style={{}}
                onValueChange={() => this.toggleSwitch()}
                trackColor={{true: 'white', false: 'white'}}
                thumbColor={Colors.black}
                ios_backgroundColor={'#787878'}
                value={this.state.switchValue}
              />
            </View>
            <Button
              width={'100%'}
              height={50}
              name={'Save'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{marginTop: 10, marginBottom: 15}}
              onPress={() => this.props.navigation.navigate('BottomTabs')}
            />
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}
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
    marginTop: 10,
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
