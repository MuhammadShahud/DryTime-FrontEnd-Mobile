import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { BG } from '../../Assets';
import { ActivityListCard } from '../../Components';
import Header from '../../Components/Header';
import { Colors } from '../../Theme';

class Cooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [

        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Cooking with Chef',
          Company: 'Olivia',
          Time: '15 mins',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Cooking with Chef',
          Company: 'Emma',
          Time: '11 mins',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Cooking with Chef',
          Company: 'Emma',
          Time: '20 mins',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Cooking with Chef',
          Company: 'Olivia',
          Time: '20 mins',
        },
      ],
    };
  }
  _renderItem = ({ item }) => {
    return (
      <ActivityListCard
        Image={item.image}
        Heading={item.Heading}
        Company={item.Company}
        Time={item.Time}
        onPress={() => this.props.navigation.navigate('CookingDetails')}
      />
    );
  };

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
          title={'Cooking'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.state.data}
            ListHeaderComponent={() => (
              <Text style={styles.Heading}>More of what you do</Text>
            )}
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            // numColumns={3}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ImageBackground>
    );
  }
}

export default Cooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  Heading: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});
