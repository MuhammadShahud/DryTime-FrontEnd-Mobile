import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Banner, BG } from '../Assets';
import Header from '../Components/Header';
import { Colors, Entypo } from '../Theme';
import { Calendar } from 'react-native-calendars';
import { connect } from 'react-redux';
import { ActivityMiddleware } from '../Redux/middleware/ActivityMiddleware';
import { img_url } from '../Config/APIs';
import CalendarListCard from '../Components/CalenderItem';
import moment from 'moment';
import CalendarMealListCard from '../Components/CalendarMealItem';

class CalendarTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: "",
      schedules: [],
      refreshing: false,
      selected_timestamp: new Date().getTime()
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


  _renderItem = ({ item }) => {
    if (item?.meal_id)
      return (
        <CalendarMealListCard
          Heading={item.calender.type}
          time={item.calender.time}
          Note={item.calender.note}
          disabled={true}
        />
      )
    else
      return (
        <CalendarListCard
          Image={item.activity?.thumbnail ? { uri: img_url + item.activity.thumbnail } : Banner}
          Heading={item.title}
          type={item.meeting ? item.meeting.type + " Meeting" : item.activity?.type ? this.toTitleCase(item.activity?.type + "") : "Reading"}
          Time={moment(this.state.day + " " + item.start_time).format("hh:mm") + " - " + moment(this.state.day + " " + item.end_time).format("hh:mm A")}
          Note={item.note}
          disabled={true}
        // onPress={() => this.props.navigation.navigate('ExerciseDetails')}
        />
      );
  };

  componentDidMount() {
    this.props.GetScheduledDates();
  }

  onEndReached = () => {
    if (this.props.schedules.next_url) {
      this.props.GetMoreSchedule({
        next_url: this.props.schedules.next_url,
        date: this.state.day
      })
    }
  }


  getDates = () => {
    let dateObj = {};
    this.props.dates.forEach(element => {
      dateObj = { ...dateObj, [element]: { selected: true, selectedColor: 'black' } }
    });
    return dateObj;
  }

  onRefresh = () => {
    this.setState({ refreshing: false })
    this.props.GetScheduledDates();
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
          title={'Calendar'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.state.schedules}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            ListHeaderComponent={() => (
              <>
                <View style={{ marginVertical: 10 }}>
                  <Calendar
                    current={new Date(this.state.selected_timestamp)}
                    onDayPress={day => {

                      this.props.GetSchedule({
                        date: day.dateString,
                        callback: (schedules) => {
                          this.setState({ schedules })
                        }
                      });
                      this.setState({ day: day.dateString, selected_timestamp: day.timestamp });
                    }}
                    markedDates={{ ...this.getDates(), [this.state.day]: { selected: true, selectedColor: '#5c5c5c' } }}
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
                <View
                  style={{
                    margin: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.HeadingSchedule}>Schedules</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('ReminderList', { selected_date: this.state.day })
                    }>
                    <Text style={styles.HeadingViewAll}>View All</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            // numColumns={3}
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ScheduleForm')}
            style={styles.plusButton}>
            <Entypo name={'circle-with-plus'} color={Colors.black} size={55} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  schedules: state.ActivityReducer.schedules,
  dates: state.ActivityReducer.dates,
});

const mapDispatchToProps = dispatch => ({
  GetSchedule: data => dispatch(ActivityMiddleware.getSchedules(data)),
  GetMoreSchedule: data => dispatch(ActivityMiddleware.getMoreSchedules(data)),
  GetScheduledDates: data => dispatch(ActivityMiddleware.getScheduledDates(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  Heading: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  HeadingSchedule: {
    fontSize: 16,
    // color: Colors.black,
    fontWeight: 'bold',
  },
  HeadingViewAll: {
    fontSize: 16,
    //color: Colors.black,
    fontWeight: 'bold',
  },
  plusButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 15,
  },
});
