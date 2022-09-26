import {NavigationContainer} from '@react-navigation/native';
import React, {Component} from 'react';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
//import { Provider } from 'react-redux';
import Navigator from './src/Navigation';
import { store } from './src/Redux/store';
//import store from './src/Redux/store';
import { Settings } from 'react-native-fbsdk-next';

Settings.setAppID('1693689294173183');
Settings.initializeSDK();
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </Provider>
    );
  }
}
