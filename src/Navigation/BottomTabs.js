import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  calendar_active,
  calendar_inactive,
  home_active,
  home_inactive,
  profile_active,
  profile_inactive,
  store_active,
  store_inactive,
  chat_active,
  chat_inactive,
  activitytab_active,
  activitytab,
  add_active,
  add_inactive,
  magnifier,
  magnifier_active,
} from '../Assets';
import { Home, Message, Profile, Calendar, Activity, CreatePostProfile } from '../Screens';
import { Colors } from '../Theme';

const BottomTabs = () => {
  const BottomTab = createBottomTabNavigator();

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        //  unmountOnBlur: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'Home') {
            icon = (
              <Image
                source={focused ? home_active : home_inactive}
                style={[focused ? styles.iconImage1 : styles.iconImage]}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Calendar') {
            icon = (
              <Image
                source={focused ? calendar_active : calendar_inactive}
                style={[focused ? styles.iconImage1 : styles.iconImage]}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Message') {
            icon = (
              <Image
                source={focused ? chat_active : chat_inactive}
                style={[focused ? styles.iconImage1 : styles.iconImage]}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Activity') {
            icon = (
              <Image
                source={focused ? magnifier_active : magnifier}
                style={[focused ? styles.iconImage1 : styles.iconImage]}
                resizeMode={'contain'}
              />
            );

          } else if (route.name === 'Add Post') {
            icon = (
              <Image
                source={focused ? add_active : add_inactive}
                style={[focused ? styles.iconImage1 : styles.iconImage]}
                resizeMode={'contain'}
              />
            );
          }
          return icon;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.black,
        inactiveTintColor: Colors.black,
      }}
      initialRouteName="Home">
      <BottomTab.Screen
        name={'Home'}
        component={Home}
        options={{ tabBarLabel: 'Home' }}
      />
      <BottomTab.Screen
        name={'Message'}
        component={Message}
        options={{ tabBarLabel: 'Message' }}
      />
      <BottomTab.Screen
        name={'Calendar'}
        component={Calendar}
        options={{ tabBarLabel: 'Calendar' }}
      />
      <BottomTab.Screen
        name={'Activity'}
        component={Activity}
        options={{ tabBarLabel: 'Activity' }}
      />

      <BottomTab.Screen
        name={'Add Post'}
        component={CreatePostProfile}
        options={{ tabBarLabel: 'Add Post' }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconImage: { height: 20, width: 20, },
  iconImage1: { height: 20, width: 20, tintColor: "#000" },
  tabBarStyle: { height: 50, backgroundColor: Colors.Primary, borderWidth: 0, paddingBottom: 5 },
  tabBarLabelStyle: { fontWeight: 'bold', fontSize: 11, borderWidth: 0, },
});

export default BottomTabs;
