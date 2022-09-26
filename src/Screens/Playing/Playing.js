import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { ActivityListCard } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { Colors } from '../../Theme';

class Playing extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.GetAllPlaying()
  }

  _renderItem = ({ item }) => {
    return (
      <ActivityListCard
        Image={{ uri: img_url + item.thumbnail }}
        Heading={item.name}
        Time={item.duration}
        onPress={() => this.props.navigation.navigate('PlayingDetails', { item })}
      />
    );
  };

  onEndReached = () => {
    if (this.props.playing.next_url) {
      this.props.GetMoreExercise({ next_url: this.props.playing.next_url })
    }
  }

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
          title={'Playing'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.state.data}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
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

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  playing: state.ActivityReducer.playing
})

const mapDispatchToProps = dispatch => ({
  GetAllPlaying: () => dispatch(ActivityMiddleware.getPlaying()),
  GetMorePlaying: (data) => dispatch(ActivityMiddleware.getMorePlaying(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Playing);

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
