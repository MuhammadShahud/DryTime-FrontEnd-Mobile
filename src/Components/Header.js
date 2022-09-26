import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import {
  Center,
  HStack,
  Icon,
  Box,
  ArrowBackIcon,
  HamburgerIcon,
  Heading,
} from 'native-base';
import { MaterialIcons } from '../Theme/index';
import { fontSize } from 'styled-system';
import { scoot } from '../Assets';

export default class Header extends Component {
  render() {
    return (
      <HStack
        style={{
          justifyContent: 'space-between',
          paddingVertical: 18,
          paddingHorizontal: 10,
          ...this.props.headerStyle
        }}>
        {this.props.ArrowBackIcon ? (
          <TouchableOpacity onPress={this.props.onPress} style={{}}>
            <ArrowBackIcon color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50, height: 30 }} />
        )}
        {/* {this.props.BellIcon && this.props.Menu ? (
          <View style={{ width: ,backgroundColor:"red",height:10 }} />
        ) : null} */}
        <View 
        style={{ flexDirection: "row", alignItems: "center", marginStart: this.props.BellIcon && this.props.Menu ? "7%" : "-7%" }}>
          <Heading fontSize={22} style={{ fontSize: 20, ...this.props.headingStyle }}>
            {this.props.title}
          </Heading>
          {
            this.props.logo ?
              <Image style={{ height: 25, width: 25, resizeMode: "contain", marginStart: 10 }} source={scoot} />
              : null
          }
        </View>
        <HStack space="xs">
          {this.props.BellIcon ? (
            <TouchableOpacity
              onPress={this.props.onPressNotification}
              style={{}}>
              <Icon as={MaterialIcons} name="notifications" color="#000" />
            </TouchableOpacity>
          ) : null}
          {this.props.Menu ? (
            <TouchableOpacity
              onPress={this.props.onPressDrawer}
              style={{}}>
              <HamburgerIcon color="#000" />
            </TouchableOpacity>
          ) : null}
        </HStack>
      </HStack>
    );
  }
}
