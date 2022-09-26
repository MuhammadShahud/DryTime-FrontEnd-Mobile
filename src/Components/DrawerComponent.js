import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Avatar, Heading } from 'native-base';
import React, { Component } from 'react';
import { AsyncStorage, Platform, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Alex } from '../Assets';
import { img_url } from '../Config/APIs';
import { ActionTypes } from '../Redux/action_types';
import messaging from '@react-native-firebase/messaging';

class DrawerComponent extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.2, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: "center", flex: 1 }}>
            <Avatar source={this.props.user?.user?.profile_pic ? { uri: img_url + this.props.user?.user?.profile_pic } : Alex} size={'xl'} />
            <Heading style={{ marginStart: 15, flex: 1 }} numberOfLines={2}>
              {this.props.user?.user?.username}
            </Heading>
          </View>
        </View>
        <DrawerContentScrollView {...this.props}>
          <DrawerItemList {...this.props} />
          <DrawerItem label={'Logout'} onPress={() => {
            AsyncStorage.getItem("@DT-publicKey", (error, result) => {
              if (!error) {
                if (!result) {
                  AsyncStorage.removeItem("qoute")
                  AsyncStorage.removeItem("@DT-user")
                  AsyncStorage.removeItem("@DT-steps")
                  AsyncStorage.removeItem("@DT-userSteps")
                }
              }
            })
            messaging().unsubscribeFromTopic("drytime");
            this.props.Logout()
          }} />
          <Text style={{ fontSize: 12, color: "#aaa", textAlign: "right", marginEnd: 10, marginTop: 10 }}>
            Version {Platform.OS == "ios" ? "2.4" : "2.9"}
          </Text>
        </DrawerContentScrollView>

      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
})

const mapDispatchToProps = dispatch => ({
  Logout: () => dispatch({ type: ActionTypes.Logout }),
});


export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent);
