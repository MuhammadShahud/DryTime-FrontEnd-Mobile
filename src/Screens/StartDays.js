/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BG } from '../Assets';
import { AntDesign, Colors, Ionicons } from '../Theme';
import { Button } from '../Components'
import { connect } from 'react-redux';
import { AuthMiddleware } from '../Redux/middleware/AuthMiddleware';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'native-base';

class StartDays extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weekPress: true,
            MonthlyPress: false,
            YearlyPress: false,
            addictions: this.props.route.params?.Home ? this.props.route.params?.addictions : this.props.user?.user?.user_addiction,
            showDatePicker: false,
            selectedIndex: null,
            startDate: '',
            endDate: "",
            selectedDates: {},

        };
    }

    // componentDidMount() {
    //     let addictions = [...this.state.addictions].map((value, index) => {
    //         return value.addiction
    //     });
    //     this.setState({ addictions })
    // }

    weekPress = () => {
        if (this.state.startDate)
            this.getDaysArray(this.state.startDate, 7)

        this.setState({ weekPress: true, MonthlyPress: false, YearlyPress: false })
    }
    MonthlyPress = () => {
        if (this.state.startDate)
            this.getDaysArray(this.state.startDate, 30)

        this.setState({ weekPress: false, MonthlyPress: true, YearlyPress: false })
    }
    YearlyPress = () => {
        if (this.state.startDate)
            this.getDaysArray(this.state.startDate, 365)

        this.setState({ weekPress: false, MonthlyPress: false, YearlyPress: true })
    }

    getPlan = () => {
        let plan = '';
        if (this.state.weekPress)
            plan = "weekly"
        if (this.state.MonthlyPress)
            plan = "monthly"
        if (this.state.YearlyPress)
            plan = "yearly"

        return plan;
    }

    getPlanDays = () => {
        let days = '';
        if (this.state.weekPress)
            days = 7
        if (this.state.MonthlyPress)
            days = 30
        if (this.state.YearlyPress)
            days = 365

        return days;
    }

    getDaysArray = (startDate, length) => {
        var dateArray = {};
        var currentDate = moment(startDate.dateString);
        while (Object.keys(dateArray).length < length) {
            dateArray = {
                ...dateArray,
                [currentDate.format("YYYY-MM-DD")]:
                    { startingDay: Object.keys(dateArray).length == 0, endingDay: Object.keys(dateArray).length == length - 1, color: '#fff' }
            };
            currentDate = moment(currentDate).add(1, 'days');
            // console.warn(dateArray)
        }

        this.setState({ selectedDates: dateArray })
    };

    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <ScrollView>
                    <View style={styles.body}>
                        <Text style={styles.Heading}>When did you start this journey ?</Text>

                        {/* <TouchableOpacity
                        style={{ flexDirection: "row", marginVertical: 10, marginTop: 20 }}
                        onPress={() => this.weekPress()}>
                        {this.state.weekPress ?
                            <Ionicons name={'radio-button-on'} size={20} color={Colors.black} />
                            :
                            <Ionicons name={'radio-button-off'} size={20} color={Colors.black} />
                        }

                        <Text style={styles.Heading1}>Weekly</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ flexDirection: "row", marginVertical: 10, }} onPress={() => this.MonthlyPress()}>
                        {this.state.MonthlyPress ?
                            <Ionicons name={'radio-button-on'} size={20} color={Colors.black} />
                            :
                            <Ionicons name={'radio-button-off'} size={20} color={Colors.black} />
                        }
                        <Text style={styles.Heading1}>Monthly</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={{ flexDirection: "row", marginVertical: 10, }} onPress={() => this.YearlyPress()}>
                        {this.state.YearlyPress ?
                            <Ionicons name={'radio-button-on'} size={20} color={Colors.black} />
                            :
                            <Ionicons name={'radio-button-off'} size={20} color={Colors.black} />
                        }
                        <Text style={styles.Heading1}>Yearly</Text>
                    </TouchableOpacity> */}

                        {/* <View style={{ marginTop: 20 }}>

                        <Calendar
                            markingType='period'
                            current={Date.now()}
                            onDayPress={(day) => {
                                // if (!this.state.startDate)
                                // this.setState({ startDate: day.dateString }, () => {
                                //     this.getDaysArray(day, this.getPlanDays())
                                // })
                                // else {
                                //     this.setState({ endDate: day.dateString })
                                //     this.getDaysArray(this.state.startDate, day.dateString)
                                // }

                            }}
                            disableAllTouchEventsForDisabledDays={true}
                            markedDates={this.state.selectedDates}
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
                    </View> */}
                        <View style={{ margin: 10, flex: 1 }}>
                            {/* <Text style={{ fontSize: 17, color: "#000", fontWeight: "bold" }}>Addictions</Text> */}
                            {
                                this.state.addictions ?
                                    this.state.addictions.map((value, index) => {
                                        return (
                                            <View style={{ margin: 10, justifyContent: "space-between" }}>
                                                <Text style={{ color: "#000", fontWeight: "bold" }}>{value.addiction}</Text>
                                                <TouchableOpacity
                                                    onPress={() => this.setState({
                                                        selectedIndex: index,
                                                        showDatePicker: true
                                                    })}
                                                    style={{
                                                        padding: 10,
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderColor: "#dddd",
                                                        marginTop: 5
                                                    }}
                                                >
                                                    <Text style={{ color: "#000", }}>{value.time ? value.time : "Select Date"}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }
                                    )
                                    : null
                            }
                        </View>
                        {this.state.showDatePicker ? (
                            <View style={{ flex: 1, width: "100%" }}>
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    is24Hour={false}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        let today = new Date();
                                        if (selectedDate) {
                                            if (today.getTime() < selectedDate.getTime()) {
                                                alert("Please select older dates")
                                                this.setState({ showDatePicker: false })
                                                return;
                                            }
                                            let addiction_array = [...this.state.addictions];
                                            addiction_array[this.state.selectedIndex] = {
                                                ...addiction_array[this.state.selectedIndex],
                                                time: selectedDate.toISOString().split("T")[0]

                                            }
                                            this.setState({ addictions: addiction_array })
                                        }
                                        this.setState({ showDatePicker: false })
                                    }}
                                />
                            </View>
                        ) : null}
                        <Button
                            ArrowRight
                            width={'100%'}
                            height={50}
                            name={'Next'}
                            textStyle={{
                                fontSize: 16,
                            }}
                            btnStyle={{ marginTop: 50 }}
                            onPress={() => {
                                // let { startDate, selectedDates } = this.state;
                                // let values = Object.keys(selectedDates);
                                // let endDate = values[values.length - 1];
                                // let plan = this.getPlan();
                                // if (!plan || !startDate || !endDate) {
                                //     alert("Please select options to continue")
                                //     return;
                                // }
                                let validate = true;
                                this.state.addictions.forEach(element => {
                                    if (element.time)
                                        validate = true;
                                    else
                                        validate = false
                                });
                                if (!validate) {
                                    alert("Please select date")
                                    return;
                                }
                                this.props.SetSoberPlan({
                                    addictions: JSON.stringify(this.state.addictions),
                                    user: this.props.user,
                                    edit: this.props.route.params?.Home ? true : false,
                                    callback: () => {
                                        if (this.props.route.params?.Home) {
                                            this.props.navigation.navigate("BottomTabs");
                                        }
                                        else
                                            this.props.navigation.navigate("VerifyEmail");
                                    }
                                })
                            }}
                        />
                        {/* <Button
                        ArrowRight
                        width={'100%'}
                        height={50}
                        name={'Skip'}
                        textStyle={{
                            fontSize: 16,
                        }}
                        btnStyle={{ marginTop: 50 }}
                        onPress={() => {
                            
                        }}
                    /> */}

                    </View>
                </ScrollView>
            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
});

const mapDispatchToProps = dispatch => ({
    SetSoberPlan: data => dispatch(AuthMiddleware.SetPlan(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartDays);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        paddingVertical: 60,
        width: '90%',
        alignSelf: 'center',
    },
    Heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
    },
    Heading1: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginLeft: 10,
    },
    FlexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },

})
