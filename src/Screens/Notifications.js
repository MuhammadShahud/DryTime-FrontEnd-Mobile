import moment from 'moment';
import React, { Component } from 'react';
import { FlatList, ImageBackground, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../Assets';
import Header from '../Components/Header';
import { GeneralMiddleware } from '../Redux/middleware/GeneralMiddleware';

class Notifications extends Component {

  componentDidMount() {
    this.props.GetNotifications()
  }

  openLink = async (url) => {
    try {
      Linking.openURL(url);
    } catch (error) {
      console.warn(error)
    }
  }

  _renderItem = ({ item }) => {
    return (
      <View style={{ margin: 10, flexDirection: 'row', alignItems: "center" }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 15,
            width: 10,
            height: 10,
            marginEnd: 10,
          }}
        />
        <View>
          {item.content ?
            <TouchableOpacity onPress={() => item.content ? this.openLink(item.content) : ""}>
              <Text style={{ fontSize: 16, color: '#000', marginVertical: 5, textDecorationLine: "underline" }}>
                {item.content}
              </Text>
            </TouchableOpacity>
            : null}
          <Text style={{ fontSize: 16, color: '#000' }}>
            {item.body}
          </Text>
          <Text style={{ fontSize: 12, color: '#000' }}>{moment(item.created_at).fromNow()}</Text>
        </View>
      </View>
    );
  };

  onEndReached = () => {
    if (this.props.notifications?.next_url) {
      this.props.GetMoreNotifications({ next_url: this.props.notifications.next_url })
    }
  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          title={'Notifications'}
          ArrowBackIcon
          Menu
        />
        <View style={styles.innerCon}>
          <FlatList
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.3}
            data={this.props.notifications?.data}
            renderItem={this._renderItem}
            ListEmptyComponent={() =>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 12,
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  No notification
                </Text>
              </View>}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  notifications: state.GeneralReducer.notifications
})

const mapDispatchToProps = dispatch => ({
  GetNotifications: () => dispatch(GeneralMiddleware.getNotifications()),
  GetMoreNotifications: (data) => dispatch(GeneralMiddleware.getMoreNotifications(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    margin: 20,
  },
});
