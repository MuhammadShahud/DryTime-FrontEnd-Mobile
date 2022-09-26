import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Switch,
    TextInput,
    Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Banner, BG } from '../Assets';
import { Input, Button } from '../Components';
import Header from '../Components/Header';
import { Colors, AntDesign, SCREEN_WIDTH, IS_IOS, Entypo } from '../Theme';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import { ActivityMiddleware } from '../Redux/middleware/ActivityMiddleware';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import PushNotification, { Importance } from "react-native-push-notification";
import moment from 'moment';

class ScheduleForm extends Component {
    constructor(props) {
        super(props);
        let activity = this.props.route.params?.activity;

        this.state = {
            day: new Date().toISOString().split("T")[0],
            recurringCount: 0,
            title: activity?.name ? activity?.name : "",
            note: '',
            showPicker: false,
            showPickerTo: false,
            time: new Date(),
            timeTo: new Date(),
            switchValue: false,
            reminder: 'Once',
            messageModal: false,
        };
    }
    handleChangeTitle = value => {
        this.setState({ title: value });
    };
    handleChangeNote = value => {
        this.setState({ note: value });
    };
    onChange = value => {
        this.setState({ time: value, showPicker: false });
    };
    onChangeTO = value => {
        this.setState({ timeTo: value, showPickerTo: false });
    };
    toggleSwitch = () => {
        this.setState(prevState => ({
            switchValue: !prevState.switchValue,
        }));
    };

    AddSchedule = () => {
        let { title, note, time, timeTo, day, reminder, switchValue, recurringCount } = this.state;
        let activityId = this.props.route.params?.activity?.id;
        let type = this.props.route.params?.type;
        if (!title || !time || !timeTo || !day) {
            alert('Please fill out required fields to continue');
            return;
        }
        let start_time = time.toISOString().substring(11, 19);
        this.props.AddSchedule({
            title,
            startTime: time.toTimeString().substring(0, 8),
            endTime: timeTo.toTimeString().substring(0, 8),
            date: day,
            note,
            reminder: "",//switchValue ? reminder == "Once" ? "once" : reminder == "Daily" ? "daily" : "Weekly" : "",
            ...(activityId ? { activityId, type } : {}),
            callback: () => {
                this.setState({ messageModal: true })
                if (this.state.switchValue == true) {
                    if (reminder == "Daily") {
                        // let start_day = new Date();
                        // let end_day = new Date(day + `T${start_time}Z`)
                        for (let aday = 1; aday <= recurringCount; aday++) {
                            let schedule_date = new Date(day + `T${start_time}Z`);
                            let getDayArr = day.split("-");
                            let getDay = getDayArr[getDayArr.length - 1];
                            schedule_date.setDate(parseInt(getDay) + aday)
                            PushNotification.localNotificationSchedule({
                                date: schedule_date,
                                message: note ? note : "You have new reminder",
                                playSound: true,
                                title: title
                            })
                        }
                    }
                    if (reminder == "Weekly") {
                        // let start_day = new Date();
                        // let end_day = new Date(day + `T${start_time}Z`)
                        for (let aday = 1; aday <= recurringCount; aday++) {
                            let schedule_date = new Date(day + `T${start_time}Z`);
                            let getDayArr = day.split("-");
                            let getDay = getDayArr[getDayArr.length - 1];
                            schedule_date.setDate(parseInt(getDay) + (aday * 7))
                            PushNotification.localNotificationSchedule({
                                date: schedule_date,
                                message: note ? note : "You have new reminder",
                                playSound: true,
                                title: title
                            })
                        }
                    }
                    else {
                        PushNotification.localNotificationSchedule({
                            date: new Date(day + `T${start_time}Z`),
                            message: note ? note : "You have new reminder",
                            playSound: true,
                            title: title
                        })
                    }
                }
                this.props.navigation.goBack();
            }
        });

    };

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
                    title={'Schedule'}
                />
                <KeyboardAwareScrollView>
                    <View style={styles.body}>
                        {this.state.day != '' ? (
                            <View style={styles.FlexRow}>
                                <Text style={styles.dateText}>
                                    Date: {this.state.day}
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
                                is24Hour={false}
                                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                                onConfirm={date => this.onChange(date)}
                                onCancel={() => this.setState({ showPicker: false })}
                            />
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date()}
                                isVisible={this.state.showPickerTo}
                                mode={'time'}
                                minimumDate={IS_IOS ? null : Date.now()}
                                is24Hour={false}
                                display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                                onConfirm={date => this.onChangeTO(date)}
                                onCancel={() => this.setState({ showPickerTo: false })}
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
                                    onPress={() => this.setState({ showPicker: true })}
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
                                    onPress={() => this.setState({ showPickerTo: true })}
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
                                trackColor={{ true: 'white', false: 'white' }}
                                thumbColor={Colors.black}
                                ios_backgroundColor={'#787878'}
                                value={this.state.switchValue}
                            />
                        </View>
                        {
                            this.state.switchValue ?
                                <View>
                                    <SelectDropdown
                                        dropdownStyle={{
                                            borderRadius: 10,
                                            borderColor: Colors.black,
                                            borderWidth: 1,
                                        }}
                                        data={["Once", "Daily", "Weekly"]}
                                        defaultValue={"Once"}
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
                                            this.setState({ reminder: selectedItem });
                                        }}
                                    />
                                    {
                                        this.state.reminder != "Once" ?
                                            <Input
                                                style={{ marginTop: 15, height: 100 }}
                                                inputPlaceHolder={'How many times you want to repeat this reminder?'}
                                                inputName={'reminderCount'}
                                                onChange={(text) => this.setState({ recurringCount: text })}
                                                name={'How many times you want to repeat this reminder?'}
                                                value={this.state.recurringCount}
                                                keyboardType="number-pad"
                                                maxLength={5}
                                            /> :
                                            null
                                    }

                                </View>
                                : null
                        }
                        <Button
                            width={'100%'}
                            height={50}
                            name={'Save'}
                            textStyle={{
                                fontSize: 16,
                            }}
                            btnStyle={{ marginTop: 30, marginBottom: 15 }}
                            onPress={() => this.AddSchedule()}
                        />
                    </View>
                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        visible={this.state.messageModal}
                        onRequestClose={() => this.setState({ messageModal: false })}>
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
                                        this.setState({ messageModal: false });
                                    }}>
                                    <Entypo
                                        name={'circle-with-cross'}
                                        size={24}
                                        color={'#000'}
                                        style={{ marginLeft: 5, marginTop: 7 }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{ fontSize: 16, color: Colors.black, marginTop: 45 }}>
                                    Your schedule has been added{' '}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 17.5,
                                        color: Colors.black,
                                        fontWeight: 'bold',
                                    }}>
                                    Successfully !!!
                                </Text>
                            </LinearGradient>
                        </View>
                    </Modal>
                </KeyboardAwareScrollView>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    AddSchedule: data => dispatch(ActivityMiddleware.AddSchedule(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleForm);

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
    dropDownBtnText: {
        textAlign: 'left',
        color: 'rgb(9,59,62)',
        fontSize: 16,
    },
    btnStyle: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        width: '100%',
        marginTop: 5,
        backgroundColor: 'transparent',
    },
});
