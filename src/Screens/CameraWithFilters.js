import React, {Component} from 'react';
import {Image, View, Dimensions} from 'react-native';
import {Grayscale} from 'react-native-image-filter-kit';

const {width, height} = Dimensions.get('screen');

export default class CameraWithFilters extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Grayscale
          style={{flex: 1}}
          extractImageEnabled={true}
          image={
            <Image
              style={{resizeMode: 'stretch', width, height}}
              source={require('../Assets/Images/back.jpeg')}
            />
          }
        />
      </View>
    );
  }
}
