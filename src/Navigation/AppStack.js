import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  GetStarted,
  Activity,
  SoberActivity,
  Exercise,
  ExerciseForm,
  ExerciseDetails,
  Playing,
  PlayingForm,
  PlayingDetails,
  Cooking,
  CookingForm,
  CookingDetails,
  LearnInstruments,
  LearnInstrumentsDetails,
  LearnInstrumentsForm,
  Reading,
  Read,
  ReadingForm,
  Reminder,
  ReminderList,
  AuthPrivacyPolicy,
  AuthTermsAndServices,
  Sponsor,
  SponsorDetails,
  Rehab,
  RehabDetails,
  Chat,
  Forum,
  CreatePost,
  ReviewAndRating,
  ContactUs,
  TermsAndServices,
  PrivacyPolicy,
  Posts,
  CreatePostProfile,
  ProfileEdit,
  EditProfile,
  TherapistProfile,
  Schedule,
  NewsFeed,
  SearchCounselor,
  SponsorSponsee,
  SponseeForm,
  SponsorForm,
  Notifications,
  SubPlans,
  SuicideLinks,
  Meetings,
  YogaClass,
  Payments,
  YogaDetail,
  YogaForm,
  TrackSteps,
  GetStartSteps,
  StepsReport,
  Music,
  MusicDetail,
  AddCard,
  StartDays,
} from '../Screens';
import Comments from '../Screens/Comments';
import Likes from '../Screens/Likes';
import ApplyFilter from '../Screens/Profile/ApplyFilter';
import ScheduleForm from '../Screens/ScheduleForm';
import SinglePost from '../Screens/SinglePost';
import BottomTabs from './BottomTabs';
import AllMeetings from "../Screens/Meetings/Meetings";
import AddMeeting from '../Screens/Meetings/AddMeeting';
import ScheduleFormMeal from '../Screens/ScheduleFormMeal';

const AppStack = createNativeStackNavigator();

const App = () => {
  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="BottomTabs" component={BottomTabs} />
      <AppStack.Screen name="Home" component={Posts} />
      <AppStack.Screen name="Activity" component={Activity} />
      <AppStack.Screen name="SoberActivity" component={SoberActivity} />
      <AppStack.Screen name="Exercise" component={Exercise} />
      <AppStack.Screen name="ExerciseDetails" component={ExerciseDetails} />
      <AppStack.Screen name="ExerciseForm" component={ExerciseForm} />
      <AppStack.Screen name="Playing" component={Playing} />
      <AppStack.Screen name="PlayingDetails" component={PlayingDetails} />
      <AppStack.Screen name="PlayingForm" component={PlayingForm} />
      <AppStack.Screen name="Cooking" component={Cooking} />
      <AppStack.Screen name="CookingDetails" component={CookingDetails} />
      <AppStack.Screen name="CookingForm" component={CookingForm} />
      <AppStack.Screen name="LearnInstruments" component={LearnInstruments} />
      <AppStack.Screen name="SearchCounselor" component={SearchCounselor} />
      <AppStack.Screen
        name="LearnInstrumentsDetails"
        component={LearnInstrumentsDetails}
      />
      <AppStack.Screen
        name="LearnInstrumentsForm"
        component={LearnInstrumentsForm}
      />
      <AppStack.Screen name="Reading" component={Reading} />
      <AppStack.Screen name="AddCard" component={AddCard} />
      <AppStack.Screen name="Read" component={Read} />
      <AppStack.Screen name="ReadingForm" component={ReadingForm} />
      <AppStack.Screen name="Reminder" component={Reminder} />
      <AppStack.Screen name="ReminderList" component={ReminderList} />
      <AppStack.Screen name="Sponsor" component={Sponsor} />
      <AppStack.Screen name="SponsorDetails" component={SponsorDetails} />
      <AppStack.Screen name="Rehab" component={Rehab} />
      <AppStack.Screen name="RehabDetails" component={RehabDetails} />
      <AppStack.Screen name="Chat" component={Chat} />
      <AppStack.Screen name="Forum" component={Forum} />
      <AppStack.Screen name="CreatePost" component={CreatePost} />
      <AppStack.Screen name="ReviewAndRating" component={ReviewAndRating} />
      <AppStack.Screen name="ContactUs" component={ContactUs} />
      <AppStack.Screen name="TermsAndServices" component={TermsAndServices} />
      <AppStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <AppStack.Screen name="Posts" component={Posts} />
      <AppStack.Screen name="CreatePostProfile" component={CreatePostProfile} />
      <AppStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <AppStack.Screen name="EditProfile" component={EditProfile} />
      <AppStack.Screen name="TherapistProfile" component={TherapistProfile} />
      <AppStack.Screen name="Schedule" component={Schedule} />
      <AppStack.Screen name="NewsFeed" component={NewsFeed} />
      <AppStack.Screen name="SponsorSponsee" component={SponsorSponsee} />
      <AppStack.Screen name="SponsorForm" component={SponsorForm} />
      <AppStack.Screen name="SponseeForm" component={SponseeForm} />
      <AppStack.Screen name="Notifications" component={Notifications} />
      <AppStack.Screen name="SubPlans" component={SubPlans} />
      <AppStack.Screen name="SuicideLinks" component={SuicideLinks} />
      <AppStack.Screen name="Meetings" component={Meetings} />
      <AppStack.Screen name="YogaClass" component={YogaClass} />
      <AppStack.Screen name="Payments" component={Payments} />
      <AppStack.Screen name="YogaDetail" component={YogaDetail} />
      <AppStack.Screen name="YogaForm" component={YogaForm} />
      <AppStack.Screen name="Comments" component={Comments} />
      <AppStack.Screen name="Likes" component={Likes} />
      <AppStack.Screen name="GetStartSteps" component={GetStartSteps} />
      <AppStack.Screen name="TrackSteps" component={TrackSteps} />
      <AppStack.Screen name="StepsReport" component={StepsReport} />
      <AppStack.Screen name="Music" component={Music} />
      <AppStack.Screen name="MusicDetail" component={MusicDetail} />
      <AppStack.Screen name="ScheduleForm" component={ScheduleForm} />
      <AppStack.Screen name="SinglePost" component={SinglePost} />
      <AppStack.Screen name="ApplyFilter" component={ApplyFilter} />
      <AppStack.Screen name="AllMeetings" component={AllMeetings} />
      <AppStack.Screen name="AddMeeting" component={AddMeeting} />
      <AppStack.Screen name="StartDays" component={StartDays} />
      <AppStack.Screen name="ScheduleFormMeal" component={ScheduleFormMeal} />

      {/* <AppStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      /> */}
      <AppStack.Screen
        name="AuthPrivacyPolicy"
        component={AuthPrivacyPolicy}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="AuthTermsAndServices"
        component={AuthTermsAndServices}
        options={{ headerShown: false }}
      />
    </AppStack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconImage: { height: 25, width: 25 },
  tabBarStyle: { height: 58 },
  tabBarLabelStyle: { fontWeight: 'bold', fontSize: 11 },
});

export default App;
