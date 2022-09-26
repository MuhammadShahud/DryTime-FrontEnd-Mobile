import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  Login,
  SignUp,
  AuthPrivacyPolicy,
  AuthTermsAndServices,
  StartDays,
  StartDate,
  GetStarted,
} from '../Screens';
import VerifyEmail from '../Screens/VerifyEmail';

const Auth = () => {
  const AuthStack = createNativeStackNavigator();
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="AuthPrivacyPolicy"
        component={AuthPrivacyPolicy}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="AuthTermsAndServices"
        component={AuthTermsAndServices}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{ headerShown: false }} />
      <AuthStack.Screen
        name="StartDate"
        component={StartDate}
        options={{ headerShown: false }} />
      <AuthStack.Screen
        name="StartDays"
        component={StartDays}
        options={{ headerShown: false }} />
      <AuthStack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{ headerShown: false }} />


    </AuthStack.Navigator>
  );
}

export default Auth;
