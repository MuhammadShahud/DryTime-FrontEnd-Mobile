import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DrawerComponent from '../Components/DrawerComponent';
import {
  ContactUs,
  Notifications,
  PrivacyPolicy,
  TermsAndServices,
  Achievements,
  AchievementsDetails,
  ReviewAndRating,
  SubPlans,
  Payments,
  AddCard,
  SponseeForm,
  SponsorForm,
  SponsorSponsee,
  SoberActivity,
  Profile,
} from '../Screens';
import AddSoberActivity from '../Screens/AddSoberActivity';
import InviteFriend from '../Screens/InviteFriend';
import MyMeetings from '../Screens/Meetings/MyMeetings';
import MySoberActivity from '../Screens/MySoberActivity';
import AddYogaClasses from '../Screens/MyYogaClasses/AddYogaClasses';
import MyYogaClasses from '../Screens/MyYogaClasses/MyYogaClasses';
import { Colors } from '../Theme';
import App from './AppStack';

const AchievementsStack = () => {
  const AchieveNav = createNativeStackNavigator();
  return (
    <AchieveNav.Navigator screenOptions={{ headerShown: false }} initialRouteName="Achievements">
      <AchieveNav.Screen name="Achievements" component={Achievements} />
      <AchieveNav.Screen
        name="AchievementsDetails"
        component={AchievementsDetails}
      />
    </AchieveNav.Navigator>
  );
};

const MyActivityStack = () => {
  const ActivityStack = createNativeStackNavigator();
  return (
    <ActivityStack.Navigator screenOptions={{ headerShown: false }}>
      <ActivityStack.Screen name="MySoberActivity" component={MySoberActivity} />
      <ActivityStack.Screen name="AddSoberActivity" component={AddSoberActivity} />
    </ActivityStack.Navigator>
  );
};

const MyClassesStack = () => {
  const ClassesStack = createNativeStackNavigator();
  return (
    <ClassesStack.Navigator screenOptions={{ headerShown: false }}>
      <ClassesStack.Screen name="MyClasses" component={MyYogaClasses} />
      <ClassesStack.Screen name="AddClass" component={AddYogaClasses} />
    </ClassesStack.Navigator>
  );
};


const PaymentStack = () => {
  const SubscripNav = createNativeStackNavigator();
  return (
    <SubscripNav.Navigator screenOptions={{ headerShown: false }}>
      {/* <SubscripNav.Screen name="SubscriptionPlans" component={SubPlans} /> */}
      <SubscripNav.Screen name="PaymentD" component={Payments} />
      <SubscripNav.Screen name="AddNewCard" component={AddCard} />
    </SubscripNav.Navigator>
  );
};

const SponsorStack = () => {
  const SponsorNav = createNativeStackNavigator();
  return (
    <SponsorNav.Navigator screenOptions={{ headerShown: false }} initialRouteName="Subscription">
      <SponsorNav.Screen name="SponsorLookup" component={SponsorSponsee} />
      <SponsorNav.Screen name="Sponsee" component={SponseeForm} />
      <SponsorNav.Screen name="Sponsor" component={SponsorForm} />
    </SponsorNav.Navigator>
  );
};

const Drawer = () => {
  const DrawerNav = createDrawerNavigator();
  return (
    <DrawerNav.Navigator
      drawerContent={props => <DrawerComponent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerActiveBackgroundColor: '#fff',
        drawerActiveTintColor: Colors.Primary,
        // unmountOnBlur: true
      }}>
      <DrawerNav.Screen name="Home" component={App} listeners={(props)=>({
        drawerItemPress:()=>{
          props.navigation.navigate("BottomTabs")
        }
      })} />
      <DrawerNav.Screen name="My Profile" component={Profile} />
      <DrawerNav.Screen name="Subscription Plans" component={SubPlans} />
      <DrawerNav.Screen name="Payment Methods" component={PaymentStack} />
      <DrawerNav.Screen name="Sponsee Lookup" component={SponsorStack} />
      <DrawerNav.Screen name="My Meetings" component={MyMeetings} initialParams={{ mine: true }} />
      <DrawerNav.Screen name="My Sober Activity" component={MyActivityStack} />
      <DrawerNav.Screen name="My Yoga Classes" component={MyClassesStack} />
      <DrawerNav.Screen name="Notifications" component={Notifications} />
      <DrawerNav.Screen name="Invite A Friend" component={InviteFriend} />
      <DrawerNav.Screen name="Terms & Services" component={TermsAndServices} />
      <DrawerNav.Screen name="Privacy Policy" component={PrivacyPolicy} />
      <DrawerNav.Screen name="Tokens" component={AchievementsStack} />
      <DrawerNav.Screen name="Contact Us" component={ContactUs} />
      <DrawerNav.Screen name="Rate & Review" component={ReviewAndRating} />
    </DrawerNav.Navigator>
  );
};

export default Drawer;
