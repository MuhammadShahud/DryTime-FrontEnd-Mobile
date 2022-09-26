import React, {Component} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import {BG} from '../../Assets';
import {Button} from '../../Components';
import Header from '../../Components/Header';

export default class SponsorSponsee extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          onPress={() => this.props.navigation.goBack()}
          ArrowBackIcon
          BellIcon
          Menu
          title={'Sponsee Lookup'}
        />
        <View style={styles.body}>
          <View style={{width: '100%'}}>
            <Button
              //ArrowRight
              width={'100%'}
              height={50}
              name={'Sponsee Form'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{marginVertical: 10}}
              onPress={() => this.props.navigation.navigate('SponseeForm')}
            />
            <Button
              //ArrowRight
              width={'100%'}
              height={50}
              name={'Sponsor Form'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{marginTop: 10}}
              onPress={() => this.props.navigation.navigate('SponsorForm')}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
