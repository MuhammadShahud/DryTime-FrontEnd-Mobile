import moment from 'moment';
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { achieve, BG } from '../../Assets';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';

class Achievement extends Component {

  state = {
    refreshing: false
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('AchievementsDetails', { item })}
        style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 100,
            marginEnd: 10,
            marginTop: 5,
            padding: 10,
          }}>
          <Image
            source={item.achievements.token_image ? { uri: img_url + item.achievements.token_image } : achieve}
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
        </View>
        <View>
          <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 5, }}>
            <Text style={{ color: "#000", marginEnd: 10 }}>
              {item.achievements.token_title ? item.achievements.token_title.toUpperCase() : ""}
            </Text>
            <Text style={{ fontSize: 10, color: "#5c5c5c", }}>
              {moment(item.created_at).format("MMM-DD-YY hh:mm A")}
            </Text>
          </View>
          <Text
            style={{ fontSize: 15, color: '#000', fontWeight: 'bold', flex: 1, flexWrap: "wrap", paddingEnd: 50, marginBottom: 5 }}>
            "{item.achievements.token_name}"
          </Text>

        </View>
      </TouchableOpacity>
    );
  };

  componentDidMount() {
    this.props.getAchievements();
  }

  onRefresh = () => {
    this.props.getAchievements();
  }

  onEndReached = () => {
    if (this.props.achievements?.next_url) {
      this.props.getMoreAchievements({
        next_url: this.props.achievements?.next_url
      })
    }
  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          title={'Achievement Tokens'}
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
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            data={this.props.achievements?.data}
            onEndReached={this.onEndReached}
            renderItem={this._renderItem}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>No data found</Text>
              </View>}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  achievements: state.GeneralReducer.achievements
})

const mapDispatchToProps = dispatch => ({
  getAchievements: () => dispatch(GeneralMiddleware.getAchievements()),
  getMoreAchievements: () => dispatch(GeneralMiddleware.getMoreAchievements()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Achievement);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    margin: 15,
  },
});
