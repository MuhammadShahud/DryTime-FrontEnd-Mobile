import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { achieve, achieved, BG } from '../../Assets';
import Header from '../../Components/Header';
import { Colors } from '../../Theme';

export default class AchievementDetails extends Component {
  render() {
    let data = this.props.route.params.item;
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          title={'Achievement Tokens'}
          onPress={() => this.props.navigation.goBack()}
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
        />
        <View style={styles.innerCon}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderRadius: 20,
              marginBottom: 20,
              padding: 10,
              paddingBottom: 40
            }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 20, borderWidth: 1, borderColor: "#aaa", marginBottom: 20 }}>
              <Image source={achieved} style={{ width: "90%", height: "90%", resizeMode: "contain", alignSelf: "center" }} />
            </View>
            <Text style={{ textAlign: "center", color: Colors.Primary, fontWeight: "bold", fontSize: 25 }}>
              Congratulations
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#000',
                fontWeight: 'bold',
                textAlign: "center"
              }}>
              "{data.achievements.token_name}"
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Share.share({
              message:"Wohoo, I have unclocked new acheivement on DryTime, You can unlock new achievements too Signup now on DryTime",
              title:"Sign up on DryTime now",
              url:"https://play.google.com/store/apps/details?id=com.drytime"
            })}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              padding: 15,
            }}>
            <Text style={{ fontSize: 16, color: '#000' }}>Share</Text>
          </TouchableOpacity>
        </View>
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
    margin: 15,
  },
});
