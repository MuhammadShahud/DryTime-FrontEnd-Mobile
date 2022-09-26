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
  Linking,
  Platform,
} from 'react-native';
import {
  Banner,
  banner13,
  banner12,
  banner14,
  banner15,
  banner16,
  BG
} from '../Assets';
import Header from '../Components/Header';

const { width } = Dimensions.get('screen');

const activities = [
  { title: 'Exercise', img: banner12 },
  { title: 'Reading', img: banner13 },
  { title: 'Playing', img: banner14 },
  { title: 'Music Classes', img: banner15 },
  { title: 'Cooking', img: banner16 },
  { title: 'Volunteer Work', img: require("../Assets/Images/volunteer.jpeg") },
  { title: 'Creative Writing', img: require("../Assets/Images/writing.jpeg") },
  { title: 'Board Games', img: require("../Assets/Images/rpss.png") },
];
//  item.title == 'Playing'
//   ? this.props.navigation.navigate('Playing')
//   : item.title == 'Cooking'
//     ? this.props.navigation.navigate('Cooking')
//     : item.title == 'Learning an Instrument'
//       ? this.props.navigation.navigate('LearnInstruments')
//       : item.title == 'Reading'
//         ? this.props.navigation.navigate('Reading')
//         : {}
export default class SoberActivity extends Component {
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
          onPress={() => {
            if (item?.title == 'Reading')
              this.props.navigation.navigate('Reading', { type: item.title })
            else if (item?.title == 'Board Games')
              Linking.openURL(
                Platform.OS == "ios" ?
                  "https://apps.apple.com/app/rock-paper-scissor-scoot/id1607290525"
                  :
                  "https://play.google.com/store/apps/details?id=com.appicoder.RockPaperScissor")
            else
              this.props.navigation.navigate('Exercise', { type: item.title })
          }
          }
          style={{
            width: '100%',
            borderRadius: 20,
            borderColor: '#fff',
            borderWidth: 3,
            backgroundColor: "#fff",
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
            marginTop: 5,
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
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          BellIcon
          Menu
          ArrowBackIcon
          title={'Sober Activity'}
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
