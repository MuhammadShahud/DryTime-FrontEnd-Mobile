import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, ActivityIndicator, Share, Modal, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Alex, BG } from '../../Assets';
import { Button, PostCard } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { deeplink } from '../../Config/Deeplink';
import { PostMiddleware } from '../../Redux/middleware/PostMiddleware';
import { Colors, Entypo } from '../../Theme';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      modal: false,
    };
  }
  _renderItem = ({ item }) => {
    let user = this.props.user.user;
    return (
      <PostCard
        Promote={item.is_promote == 0}
        Image={user?.profile_pic ? { uri: img_url + user?.profile_pic } : Alex}
        ImagePost={{ uri: img_url + item.file }}
        isVideo={item.image == 0 ? true : false}
        Heading={user?.username}
        Description={item.description}
        Time={moment(item.created_at).fromNow()}
        Like={false}
        comment={item.comment ? true : false}
        CommentName={item.comment?.username}
        Comment={item.comment?.comment}
        CommentImg={item.comment?.profile_pic ? { uri: img_url + item.comment?.profile_pic } : Alex}
        CommentTime={moment(item.comment?.created_at).fromNow()}
        onPress={() => this.props.navigation.navigate('ExerciseDetails')}
        onPressComment={() => this.props.navigation.navigate('Comments', { post_id: item.id })}
        onPressDelete={() => this.props.DeletePost({ post_id: item.id })}
        onPressLike={() => this.props.navigation.navigate('Likes', { post_id: item.id })}
        onPressEdit={() => this.props.navigation.navigate('CreatePostProfile', { item })}
        onPressPromote={() => {
          if (this.props.user?.user?.user_subscription)
            this.props.PromotePost({ id: item.id })
          else
            this.setState({ modal: true })

        }}
        onPressShare={() => this.onPressShare(item.id)}
      />
    );
  };

  onPressShare = (post_id) => {
    Share.share({
      message: deeplink(post_id),
      url: deeplink(post_id),
      title: "Drytime"
    });
  }

  onEndReached = () => {
    if (this.props.myPosts.next_url) {
      this.props.GetPost({
        Loading: (isLoading) => {
          this.setState({ loading: isLoading })
        }
      });
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
          title={'Posts'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.props.myPosts?.data}
            ListHeaderComponent={() => <View></View>}
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
              marginTop: 10,
            }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            // numColumns={3}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => this.setState({ modal: false })}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.50)',
            }}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={[Colors.white, Colors.white]}
              style={{
                height: 230,
                width: '90%',
                backgroundColor: Colors.Secondary,
                borderRadius: 14,
                alignItems: 'center',
                // justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 8 }}
                onPress={() => this.setState({ modal: false })}>
                <Entypo
                  name={'circle-with-cross'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: Colors.black,
                  marginTop: 30,
                  fontWeight: 'bold',
                }}>
                Please upgrade your plan
              </Text>
              <View style={{ width: '100%' }}>
                <Button
                  width={'90%'}
                  height={50}
                  name={'Next'}
                  textStyle={{
                    fontSize: 16,
                  }}
                  ColorSecondary={Colors.Primary}
                  ColorPrimary={Colors.Primary}
                  btnStyle={{ marginTop: 20 }}
                  onPress={() => {
                    this.setState({ modal: false }),
                      this.props.navigation.navigate('Subscription Plans');
                  }}
                />
              </View>
            </LinearGradient>
          </View>
        </Modal>
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
  DeletePost: data => dispatch(PostMiddleware.DeletePost(data)),
  PromotePost: data => dispatch(PostMiddleware.PromotePost(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);

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
