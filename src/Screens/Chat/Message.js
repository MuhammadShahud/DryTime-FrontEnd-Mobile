import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Modal, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Alex, BG, searchIcon } from '../../Assets';
import { MessageCard } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { pusherConfig } from '../../Config/PusherSetup';
import { ActionTypes } from '../../Redux/action_types';
import { ChatMiddleware } from '../../Redux/middleware/ChatMiddleware';
import { AntDesign, Colors, Entypo, SCREEN_HEIGHT } from '../../Theme';


class Message extends Component {
  constructor(props) {
    super(props);
    let channel = pusherConfig.subscribe(`user.${this.props.user.user.id}`);
    channel.bind('App\\Events\\Message', (data) => {
      let index = this.props.chats.data.findIndex(value => {
        return value.id == data.message.chatlist_id
      })
      if (index >= 0) {
        this.props.UpdateChatlist({
          message: data.message.message,
          index
        })
        this.setState({ newMessageIndex: index })
      }
      else {
        this.onRefresh();
      }
    });
    this.state = {
      refreshing: false,
      newMessageIndex: null,
      UserListModal: false,
      dataUsers: [],
    };
  }

  componentDidMount() {
    this.props.GetChatlist();
  }
  onSearch = (search) => {
    this.setState({ search })
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getUsersList(search)
    }, 1000)

  }

  getUsersList = (name) => {
    this.props.GetUsers({
      name,
      callback: response => {

        if (response) {
          console.warn("Users,", response);
          this.setState({
            dataUsers: response?.data
          })

        } else {
          this.setState({ loading: false, refreshing: false, });
        }
      },
    });
  }

  _renderItem = ({ item, index }) => {
    let user = item?.to_user?.id == this.props.user.user.id ? item.from_user : item.to_user;
    return (
      <MessageCard
        Image={user?.profile_pic ? { uri: img_url + user.profile_pic } : Alex}
        Heading={user?.username}
        Chats={item?.last_message.message}
        Time={moment(item?.last_message.time).fromNow()}
        newMessage={this.state.newMessageIndex == index}
        onPress={() => {
          this.setState({ newMessageIndex: null })
          this.props.navigation.navigate('Chat', { item, user })
        }}
      />
    );
  };
  _renderItemUser = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ dataUsers: false, UserListModal: false })
          this.props.navigation.navigate('Chat', { user: item, item: {} })
        }}
        style={{
          borderRadius: 6,
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 10,
          flexDirection: 'row',
          marginBottom: 10
        }}>
        <Image source={item?.profile_pic ? { uri: img_url + item?.profile_pic } : Alex} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 360, marginRight: 10 }} />
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item?.username}</Text>
      </TouchableOpacity>

    );
  }
  onEndReached = () => {
    if (this.props.chats?.next_url) {
      this.props.GetMoreChatlist({ next_url: this.props.chats.next_url })
    }
  }

  onRefresh = () => {
    this.props.GetChatlist()
  }

  componentWillUnmount() {
    this.setState({ UserListModal: false })
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
          title={'Chat'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.props.chats?.data}
            // ListHeaderComponent={() => <Text style={styles.Heading}>More of what you do</Text>
            // }
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.3}
            // numColumns={3}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity onPressIn={() => {
          this.setState({ UserListModal: true })
        }}>
          <AntDesign
            name={'pluscircle'}
            size={45}
            color={Colors.black}
            style={{ bottom: 0, margin: 20, position: 'absolute', right: 5 }}
          />
        </TouchableOpacity>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.UserListModal}
          onRequestClose={() => this.setState({ UserListModal: false })}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.50)',
            }}>
            <KeyboardAvoidingView behavior='padding' style={{
              width: '95%',
              flex: 1,
              marginVertical: 40
            }}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[Colors.Primary, Colors.Primary]}
                style={{
                  flex: 1,
                  backgroundColor: Colors.Secondary,
                  borderRadius: 14,
                  alignItems: 'center',
                  // justifyContent: 'center',
                }}>
                <View style={{ flexDirection: "row", marginVertical: 10, alignItems: "center", paddingStart: 30 }}>
                  <Text style={{ color: "#fff", fontSize: 25, flex: 1, textAlign: "center" }}>
                    Friends
                  </Text>
                  <TouchableOpacity
                    style={{ alignSelf: 'flex-end', marginRight: 8 }}
                    onPress={() => {
                      this.setState({ UserListModal: false });
                    }}>
                    <Entypo
                      name={'circle-with-cross'}
                      size={24}
                      color={'#000'}
                      style={{ marginLeft: 5, marginTop: 7 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.body}>
                  <View style={styles.searchbox}>
                    <TextInput
                      onChangeText={this.onSearch}
                      placeholder="Search Friends Here" style={{ flex: 1, height: 45 }} />
                    <Image
                      source={searchIcon}
                      style={styles.searchIcon}
                      resizeMode={'contain'}
                    />
                  </View>
                  <FlatList
                    data={this.state.dataUsers}
                    // ListHeaderComponent={() => <Text style={styles.Heading}>More of what you do</Text>
                    // }
                    ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
                    ListHeaderComponentStyle={{
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                    renderItem={this._renderItemUser}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    horizontal={false}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.3}
                    // numColumns={3}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>

              </LinearGradient>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </ImageBackground >
    );
  }
}
const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  chats: state.ChatReducer.chat_list
})

const mapDispatchToProps = dispatch => ({
  GetChatlist: () => dispatch(ChatMiddleware.getChatlist()),
  GetUsers: (data) => dispatch(ChatMiddleware.getUsers(data)),
  GetMoreChatlist: (data) => dispatch(ChatMiddleware.getMoreChatlist(data)),
  UpdateChatlist: (data) => dispatch({ type: ActionTypes.UpdateChatList, payload: data.message, index: data.index }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  Heading: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  searchbox: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  searchIcon: {
    height: 20,
    width: 20,
    tintColor: '#000',
  },
});
