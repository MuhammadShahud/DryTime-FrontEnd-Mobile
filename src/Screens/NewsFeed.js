import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions, Share } from 'react-native';
import { connect } from 'react-redux';
import { Alex, BG } from '../Assets';
import { PostCard } from '../Components';
import Header from '../Components/Header';
import { img_url } from '../Config/APIs';
import { deeplink } from '../Config/Deeplink';
import { PostMiddleware } from '../Redux/middleware/PostMiddleware';
import { AntDesign, Colors } from '../Theme';

const { height } = Dimensions.get("window");
const ItemHeight = height * 0.5;

class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    };
  }

  async componentDidMount() {
    let forum = this.props.route.params?.forum;
    let index = this.props.route.params?.index ? this.props.route.params?.index : 0;
    let day = this.props.route.params?.day ? this.props.route.params?.day : "";
    await this.props.GetPost({ forum, day });
    if (index)
      this.Flatlist.scrollToIndex({ animated: true, index })
  }

  _renderItem = ({ item }) => {
    return (
      <PostCard
        Promote={false}
        Image={item.user?.profile_pic ? { uri: img_url + item.user?.profile_pic } : Alex}
        isVideo={item.image == 0 ? true : false}
        ImagePost={{ uri: img_url + item.file }}
        Heading={item.user?.username}
        Description={item.description}
        Time={moment(item.created_at).fromNow()}
        Like={item.has_liked}
        comment={item.comment ? true : false}
        CommentName={item.comment?.username}
        Comment={item.comment?.comment}
        CommentImg={item.comment?.profile_pic ? { uri: img_url + item.comment?.profile_pic } : Alex}
        CommentTime={moment(item.comment?.created_at).fromNow()}
        onPress={() => this.props.navigation.navigate('ExerciseDetails')}
        onPressComment={() => this.props.navigation.navigate('Comments', { post_id: item.id })}
        // onPressDelete={() => this.props.DeletePost({ post_id: item.id })}
        onPressLike={() => this.props.LikePost({ post_id: item.id })}
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
    if (this.props.otherPosts.next_url) {
      let forum = this.props.route.params.forum;
      let day = this.props.route.params?.day ? this.props.route.params?.day : "";
      this.props.GetMorePost({ next_url: this.props.otherPosts.next_url, forum, day });
    }
  }

  onRefresh = () => {
    this.setState({ loading: true })
    let forum = this.props.route.params.forum;
    let day = this.props.route.params?.day ? this.props.route.params?.day : "";
    this.props.GetPost({ forum, day });
    this.setState({ loading: false })
  }

  render() {
    let forum = this.props.route.params?.forum;
    let day = this.props.route.params?.day ? this.props.route.params?.day : "";
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
          title={'News Feed'}
        />
        <View style={styles.body}>
          <FlatList
            ref={component => this.Flatlist = component}
            refreshing={this.state.loading}
            onRefresh={this.onRefresh}
            data={this.props.otherPosts?.data}
            ListHeaderComponent={() => <View></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            getItemLayout={(data, index) => ({
              index,
              length: ItemHeight,
              offset: ItemHeight * index
            })}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          {forum == 1 ?
            <TouchableOpacity onPressIn={() => {
              this.props.navigation.navigate("CreatePostProfile", { forum, day })
            }}>
              <AntDesign
                name={'pluscircle'}
                size={45}
                color={Colors.black}
                style={{ bottom: 0, margin: 20, position: 'absolute', right: 5 }}
              />
            </TouchableOpacity>
            : null}
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  otherPosts: state.PostReducer.others_posts
})

const mapDispatchToProps = dispatch => ({
  GetPost: data => dispatch(PostMiddleware.getOthersPost(data)),
  GetMorePost: data => dispatch(PostMiddleware.getMoreOthersPost(data)),
  LikePost: data => dispatch(PostMiddleware.LikePost(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);

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
