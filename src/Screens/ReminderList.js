import moment from 'moment';
import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Banner, BG } from '../Assets';
import { ReminderCard } from '../Components';
import CalendarMealListCard from '../Components/CalendarMealItem';
import CalendarListCard from '../Components/CalenderItem';
import Header from '../Components/Header';
import { img_url } from '../Config/APIs';
import { ActivityMiddleware } from '../Redux/middleware/ActivityMiddleware';
import { Colors } from '../Theme';

class ReminderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectedDate: props.route.params?.selected_date ? props.route.params?.selected_date : "",
    };
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
        Time={moment("1997-01-01 " + item.start_time).format("hh:mm") + " - " + moment("1997-01-01 " + item.end_time).format("hh:mm A")}
        disabled={true}
      // onPress={() => this.props.navigation.navigate('ExerciseDetails')}
      />
    );
  };

  onEndReached = () => {
    if (this.props.schedules.next_url) {
      this.props.GetMoreSchedule({
        next_url: this.props.schedules.next_url,
        date: this.state.day
      })
    }
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
          title={'Schedule'}
        />

        <View style={styles.DayListView}>
          <ScrollView horizontal>
            {
              this.props.dates.length > 0 ?
                this.props.dates.map(item => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.GetSchedule({
                          date: item
                        })
                        this.setState({ SelectedDate: item })
                      }}
                      style={
                        this.state.SelectedDate == item
                          ? styles.SelectedDayView
                          : styles.DayView
                      }>
                      <Text
                        style={
                          this.state.SelectedDate == item
                            ? styles.SelectedTextDay
                            : styles.TextDay
                        }>
                        {moment(item).format("ddd")}
                      </Text>
                      <Text
                        style={
                          this.state.SelectedDate == item
                            ? styles.SelectedTextDate
                            : styles.TextDate
                        }>
                        {item?.substring(8, 10)}
                      </Text>
                    </TouchableOpacity>
                  );
                })
                : null
            }
          </ScrollView>
        </View>

        <View style={styles.body}>
          <FlatList
            data={this.props.schedules?.data}
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
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(ReminderList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '95%',
    alignSelf: 'center',
  },
  Heading: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  DayListView: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
  },
  DayView: {
    width: 60,
    height: 90,
    backgroundColor: Colors.white,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  TextDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  TextDay: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.black,
  },

  SelectedDayView: {
    width: 60,
    height: 90,
    backgroundColor: Colors.black,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  SelectedTextDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  SelectedTextDay: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
