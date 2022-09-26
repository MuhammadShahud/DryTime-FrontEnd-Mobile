import {Avatar, Box, HStack, IconButton} from 'native-base';
import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BG} from '../Assets';
import Header from '../Components/Header';

const {width} = Dimensions.get('screen');

export default class Posts extends Component {
  state = {
    data: [{}, {}, {}, {}, {}],
  };

  _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          borderRadius: 10,
          backgroundColor: '#fff',
          padding: 10,
          paddingTop: 30,
          width: width * 0.9,
          marginBottom: 40,
        }}>
        <HStack style={{alignItems: 'center'}}>
          <Avatar size={12} source={require('../Assets/Images/alex.png')} />
          <Box style={{marginStart: 10}}>
            <Text style={{color: '#000', fontSize: 12, fontWeight: 'bold'}}>
              Jason
            </Text>
            <Text style={{fontSize: 11}}>8 min ago</Text>
          </Box>
        </HStack>
        <Text numberOfLines={3} style={{marginVertical: 10}}>
          ajksbdjkasndjas djasn djka djan djkasdjknas dklj naskljdn jknd jkasn
          djsa ndkjsan djksa ndljnasjdk nsakjd nasjkdn jksan dkjsan dkjasnd kjas
          ndjksand kjasnd kjasd kjsa
        </Text>
        <Image
          source={require('../Assets/Images/banner.png')}
          style={{
            height: 200,
            width: '100%',
            borderRadius: 20,
            marginVertical: 10,
          }}
        />
        <HStack></HStack>
      </View>
    );
  };

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPress={() => this.props.navigation.goBack()}
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          title={'Posts'}
          ArrowBackIcon
          BellIcon
          Menu
        />
        <View style={styles.innerCon}>
          <FlatList renderItem={this._renderItem} data={this.state.data} />
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
    alignItems: 'center',
  },
});
