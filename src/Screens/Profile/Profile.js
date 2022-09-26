import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { BG } from '../../Assets';
import Header from '../../Components/Header';
import { Banner, Alex } from '../../Assets';
import { AntDesign, FontAwesome, Colors } from '../../Theme';
import { ActivityListCard } from '../../Components';
import { connect } from 'react-redux';
import { PostMiddleware } from '../../Redux/middleware/PostMiddleware';
import { img_url } from "../../Config/APIs";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true
    };
  }
  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Posts')}
        style={{
          width: '31%',
          height: 110,
          backgroundColor: 'white',
          marginHorizontal: 3.5,
          marginVertical: 8,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: "hidden"
        }}>
        <Image
          source={{ uri: img_url + item.file }}
          style={{
            width: '95%',
            height: 105,
            resizeMode: 'contain',
            borderRadius: 10,
          }}
        />
        {
          item.image == 0 ?
            <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" }}>
              <AntDesign name='playcircleo' size={35} color="#fff" />
            </View>
            : null
        }
      </TouchableOpacity>
    );
  };

  componentDidMount() {
    this.props.GetPost({
      Loading: (isLoading) => {
        this.setState({ loading: isLoading })
      }
    });
  }

  onEndReached = () => {
    if (this.props.myPosts?.next_url) {
      this.props.GetMorePost({
        Loading: (isLoading) => {
          this.setState({ loading: isLoading })
        },
        next_url: this.props.myPosts.next_url,
      });
    }
  }

  onRefresh = () => {
    this.props.GetPost({
      Loading: (isLoading) => {
        this.setState({ loading: isLoading })
      }
    });
  }

  render() {
    let user = this.props.user?.user;
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
          title={'Profile'}
        />
        {/* <ScrollView
        > */}
        <View style={styles.body}>
          <FlatList
            refreshing={this.state.loading}
            onRefresh={this.onRefresh}
            data={this.props.myPosts?.data}
            ListHeaderComponent={() => <View>
              <View style={styles.HeadView}>
                <View style={styles.ProPicView}>
                  <Image source={{ uri: img_url + user?.profile_pic }} style={styles.ImgPro} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.Heading}>{user?.username}</Text>
                    <Text style={styles.Email}>{user?.email}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  {/* <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('CreatePostProfile')
                    }
                    style={styles.ButtonView}>
                    <AntDesign
                      name={'plussquare'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.TextBtn}>Create Post</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('ProfileEdit')}
                    style={styles.ButtonView}>
                    <FontAwesome
                      name={'pencil-square-o'}
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.TextBtn}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>}
            ListFooterComponent={() => (
              <View style={{ marginBottom: 10 }}>
                {
                  this.state.loading ?
                    <ActivityIndicator size="large" color="#fff" />
                    : null
                }

              </View>
            )}
            ListHeaderComponentStyle={{
              marginBottom: 10,
            }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        {/* </ScrollView> */}
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  myPosts: state.PostReducer.my_posts
})

const mapDispatchToProps = dispatch => ({
  GetPost: data => dispatch(PostMiddleware.getPost(data)),
  GetMorePost: data => dispatch(PostMiddleware.getMorePost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
  },
  HeadView: {
    backgroundColor: 'white',
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  ProPicView: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    height: '70%',
  },
  ImgPro: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  Heading: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: 'bold',
  },
  Email: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  ButtonView: {
    alignSelf: 'center',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: Colors.Primary,
  },
  TextBtn: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 5,
    color: Colors.white,
  },
});
