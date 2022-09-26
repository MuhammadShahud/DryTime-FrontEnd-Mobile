import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BG, searchIcon } from '../../Assets';
import Header from '../../Components/Header';
import { Icon } from 'native-base';
import { Entypo, EvilIcons } from '../../Theme';
import { connect } from 'react-redux';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { img_url } from '../../Config/APIs';
import TrackPlayer from 'react-native-track-player';

class Music extends Component {

  state = {
    search: ""
  }

  componentDidMount() {
    // TrackPlayer.setupPlayer({

    // });
    this.props.GetMusic({
      search: "",
      callback: () => {
        // this.props.music?.data.map((value) => {
        //   TrackPlayer.add({
        //     url: img_url + value.file,
        //     artist: value.singer,
        //     artwork: value.image,
        //     title: value.name,
        //   })
        // })
      }
    });
  }

  componentWillUnmount() {
    // TrackPlayer.destroy();
  }

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // TrackPlayer.skip(index)
          this.props.navigation.navigate('MusicDetail', { item, index })
        }}
        style={{ margin: 10, flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={item.image ? { uri: img_url + item.image } : require('../../Assets/Images/music.png')}
          style={{ width: 60, height: 60, resizeMode: 'stretch' }}
        />
        <View style={{ marginStart: 10 }}>
          <Text style={{ color: '#fff' }}>{item.file}</Text>
          <Text
            style={{
              fontSize: 11,
              color: '#000',
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            {item.singer} <Text style={{ fontSize: 16, color: '#000' }}>•</Text>{' '}
            <Icon as={EvilIcons} name="clock" size={'4'} /> {item.duration}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  onEndReached = () => {
    let { search } = this.state;
    if (this.props.music?.next_url) {
      this.props.GetMoreMusic({ next_url: this.props.music.next_url, search });
    }
  }

  onSearch = (search) => {
    this.setState({ search })
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.GetMusic({
        search,
        callback: () => {
          this.props.music?.data.map((value) => {
          })
        }
      });
    }, 1000)

  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          title={'Music'}
          onPress={() => this.props.navigation.goBack()}
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
        />
        <View style={styles.innerCon}>
          <View style={styles.searchbox}>
            <TextInput
              onChangeText={this.onSearch}
              placeholder="Search Here" style={{ flex: 1, height: 45 }} />
            <Image
              source={searchIcon}
              style={styles.searchIcon}
              resizeMode={'contain'}
            />
          </View>
          <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', marginTop: 10 }}>
            <FlatList
              ListEmptyComponent={
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>No data found</Text>
                </View>}
              data={this.props.music?.data}
              renderItem={this._renderItem}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.1}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  music: state.ActivityReducer.music
})

const mapDispatchToProps = dispatch => ({
  GetMusic: (data) => dispatch(ActivityMiddleware.getMusic(data)),
  GetMoreMusic: (data) => dispatch(ActivityMiddleware.getMoreMusic(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Music);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    margin: 20,
  },
  searchbox: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    height: 20,
    width: 20,
    tintColor: '#000',
  },
});
