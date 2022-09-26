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
import { Heading } from 'native-base';

class ScheduleFormMeal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: '',
            title: "",
            note: '',
            showPicker: false,
            showPickerTo: false,
            time: new Date(),
            timeTo: new Date(),
            switchValue: false,
            reminder: '',
            messageModal: false,
            plans: [{
                type: "",
                time: new Date(),
                note: ""
            }],
            selectedIndex: 0
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
        let { day, plans } = this.state;
        if (!day) {
            alert('Please select date to continue');
            return;
        }
        let validation = true;
        plans.forEach((value) => {
            if (value.time==null || value.time=="" || value.type == "") {
                validation = false
                return;
            }
        })
        if (!validation) {
            alert('Please fill all fields to continue');
            return;
        }
        let mapPlans = plans.map((val) => {
            let pln = { ...val };
            pln.time = val.time.toISOString().split("T")[1].replace("Z", "");
            return pln;
        })
        this.props.AddScheduleMeal({
            date: day,
            plans: JSON.stringify(mapPlans),
            callback: () => {
                this.setState({ messageModal: true })
                mapPlans.forEach((plan) => {
                    // if (reminder == "daily") {
                    //     let start_day = new Date();
                    //     let end_day = new Date(day + `T${start_time}Z`)
                    //     for (let aday = start_day.getDate(); aday <= end_day.getDate(); aday++) {
                    //         let schedule_date = new Date(day + `T${start_time}Z`);
                    //         schedule_date.setDate(aday)
                    //         PushNotification.localNotificationSchedule({
                    //             date: schedule_date,
                    //             message: note ? note : "You have new reminder",
                    //             playSound: true,
                    //             title: title
                    //         })
                    //     }
                    // }
                    // else {
                    PushNotification.localNotificationSchedule({
                        date: new Date(day + `T${plan.time}Z`),
                        message: plan.note ? plan.note : "You have a new reminder for your meal",
                        playSound: true,
                        vibrate: true,
                        title: plan.type
                    })
                    //  }
                })

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
                    title={'Custom meal plan'}
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
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 20, alignItems: 'center', }}>
                            <Heading fontSize={"xl"}>
                                Your Customized meal plan
                            </Heading>
                            <TouchableOpacity
                                onPress={() => {
                                    let plans = [...this.state.plans];
                                    plans.push({
                                        type: "",
                                        time: "",
                                        note: ""
                                    })
                                    this.setState({ plans })
                                }}>
                                <Entypo name={'circle-with-plus'} color={Colors.black} size={45} />
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.plans.map((val, index) => {
                                let plans = [...this.state.plans];
                                return (
                                    <View style={{ padding: 10, backgroundColor: "#fff", borderRadius: 10, marginVertical: 5 }}>
                                        <View style={{ marginVertical: 5, }}>
                                            <Text style={styles.inputSentence}>Type</Text>
                                            <SelectDropdown
                                                dropdownStyle={{
                                                    borderRadius: 10,
                                                    borderColor: Colors.black,
                                                    borderWidth: 1,
                                                }}
                                                data={["Breakfast", "Lunch", "Dinner", "Other"]}
                                                dropdownIconPosition="right"
                                                renderDropdownIcon={() => {
                                                    return (
                                                        <AntDesign
                                                            name={'caretdown'}
                                                            size={16}
                                                            color={Colors.black}
                                                        />
                                                    );
                                                }}
                                                buttonTextStyle={styles.dropDownBtnText}
                                                buttonStyle={styles.btnStyle}
                                                onSelect={(selectedItem, ind) => {
                                                    plans[index].type = selectedItem
                                                    this.setState({
                                                        plans
                                                    });
                                                }}
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

                                            <View
                                                style={{
                                                    marginRight: 0,
                                                    width: '100%',
                                                }}>
                                                <Text
                                                    style={{
                                                        fontSize: 16,
                                                        color: Colors.black,
                                                        marginTop: 3,
                                                        paddingTop: 4,
                                                        marginLeft: 8,
                                                    }}>
                                                    Time
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.setState({ showPicker: true, selectedIndex: index })}
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
                                                        {val.time
                                                            ? new Date(val.time).toLocaleTimeString()
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
                                            onChangeText={(text) => {
                                                plans[index].note = text
                                                this.setState({
                                                    plans
                                                });
                                            }}
                                            textAlignVertical={'top'}
                                            value={val.note}
                                            maxLength={150}
                                        />
                                    </View>
                                )
                            })
                        }
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            isVisible={this.state.showPicker}
                            mode={'time'}
                            minimumDate={IS_IOS ? null : Date.now()}
                            is24Hour={false}
                            display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                            onConfirm={date => {
                                let plans = [...this.state.plans];
                                plans[this.state.selectedIndex].time = date;
                                this.setState({
                                    plans,
                                    showPicker: false
                                });
                            }}
                            onCancel={() => this.setState({ showPicker: false })}
                        />
                        {/* <View style={styles.Reminder}>
                            <Text style={styles.ReminderText}>Reminder</Text>
                            <Switch
                                style={{}}
                                onValueChange={() => this.toggleSwitch()}
                                trackColor={{ true: 'white', false: 'white' }}
                                thumbColor={Colors.black}
                                ios_backgroundColor={'#787878'}
                                value={this.state.switchValue}
                            />
                        </View> */}
                        {
                            this.state.switchValue ?
                                <SelectDropdown
                                    dropdownStyle={{
                                        borderRadius: 10,
                                        borderColor: Colors.black,
                                        borderWidth: 1,
                                    }}
                                    data={["Everyday", "Once"]}
                                    defaultValue={"Everyday"}
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
    AddScheduleMeal: data => dispatch(ActivityMiddleware.AddScheduleMeal(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleFormMeal);

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
