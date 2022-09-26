import React, { Component } from 'react';
import {
  Text,
  ImageBackground,
  FlatList,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Banner,
  BG,
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
  banner8,
  banner9,
  banner10,
  banner11,
  banner17,
} from '../Assets';
import Header from '../Components/Header';

const { width } = Dimensions.get('screen');

const activities = [
  { title: 'Sober Activity', img: banner1 },
  { title: 'Search Counselors', img: banner2 },
  { title: 'Rehab Lookup', img: banner3 },
  { title: 'AA/NA Meetings', img: banner4 },
  { title: 'Meet Ups', img: banner17 },
  { title: 'Forum', img: banner6 },
  { title: 'Classes', img: banner8 },
  { title: 'Relaxing Music', img: banner9 },
  { title: 'Sponsor', img: banner11 },
  { title: 'Suicide Help', img: banner10 },
  { title: 'Book Club', img: banner7 },
];

export default class Activity extends Component {
  _renderItem = (item, index) => {
    return (
      <View
        style={{
          width: width * 0.4,
          height: width * 0.4,
          marginTop:
            index > 1
              ? (index + 1) % 2 == 0
                ? width * 0.2 - width * 0.15
                : -width * 0.15
              : (index + 1) % 2 == 0
                ? width * 0.2
                : 0,
          marginStart: (index + 1) % 2 == 0 ? -10 : 0,
          transform: [
            {
              rotate: (index + 1) % 2 == 0 ? '8deg' : '-8deg',
            },
          ],
        }}>
        <TouchableOpacity
          onPress={() =>
            item?.title == 'Sober Activity'
              ? this.props.navigation.navigate('SoberActivity')
              : item?.title == 'Sponsor'
                ? this.props.navigation.navigate('Sponsor')
                : item?.title == 'Rehab Lookup'
                  ? this.props.navigation.navigate('Rehab')
                  : item?.title == 'Forum'
                    ? this.props.navigation.navigate('Forum')
                    : item?.title == 'Search Counselors'
                      ? this.props.navigation.navigate('SearchCounselor')
                      : item?.title == 'Suicide Help'
                        ? this.props.navigation.navigate('SuicideLinks')
                        : item?.title == 'Book Club'
                          ? this.props.navigation.navigate('Reading')
                          : item?.title == 'Meet Ups'
                            ? this.props.navigation.navigate('AllMeetings')
                            : item?.title == 'AA/NA Meetings'
                              ? this.props.navigation.navigate('Meetings')
                              : item?.title == 'Relaxing Music'
                                ? this.props.navigation.navigate('Music')
                                : item?.title == 'Classes'
                                  ? this.props.navigation.navigate('YogaClass')
                                  : {}
          }
          style={{
            width: '100%',
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 3,
          }}>
          <Image
            source={item.img}
            style={{ width: '100%', height: width * 0.32, borderRadius: 20 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: '#000',
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 3,
            marginLeft: 2,
          }}>
          {item.title}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          title={'Activities'}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          onPress={() => this.props.navigation.goBack()}
          onPressNotification={() => this.props.navigation.navigate("Notifications")}
          Menu
          ArrowBackIcon
          BellIcon
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.innerCon}>
            <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
              {activities.map(this._renderItem)}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    margin: 20,
    marginStart: width * 0.12,
  },
});
