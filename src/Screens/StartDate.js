import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BG } from '../Assets';
import { AntDesign, Colors } from '../Theme';
import { Button } from '../Components'

class StartDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: '',
        };
    }

    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <View style={styles.body}>
                    <Text style={styles.Heading}>Way to go !</Text>
                    <Text style={styles.Heading}>When did you start this journey ?</Text>
                    <View style={{ marginTop: 50 }}>
                        {this.state.day != '' ?
                            <View style={styles.FlexRow}>
                                <Text style={styles.dateText}>Date: {this.state.day}</Text>
                                <AntDesign name={'calendar'} color={Colors.black} size={20} />

                            </View>
                            : null}
                        <Calendar
                            current={Date.now()}
                            onDayPress={(day) => {
                                this.setState({ day: day.dateString })
                            }}
                            disableAllTouchEventsForDisabledDays={true}
                            markedDates={{
                                [this.state.day]: { selected: true, selectedColor: 'black', },

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
                    </View>
                    <Button
                        ArrowRight
                        width={'100%'}
                        height={50}
                        name={'Next'}
                        textStyle={{
                            fontSize: 16,
                        }}
                        btnStyle={{ marginTop: 50 }}
                        onPress={() => this.props.navigation.navigate('StartDays', { date: this.state.day })}
                    />
                </View>
            </ImageBackground>
        );
    }
}

export default StartDate;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        paddingTop: 60,
        width: '90%',
        alignSelf: 'center',
    },
    Heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
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
