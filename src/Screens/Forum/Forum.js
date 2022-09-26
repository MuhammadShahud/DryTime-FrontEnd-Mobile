import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { ActivityListCard, ForumCard } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { Colors } from '../../Theme';

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Push Ups with Kim',
          Day: 'Monday',
          Description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Run with Kim',
          Day: 'Tuesday',
          Description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Cycling with Kim',
          Day: 'Wednesday',
          Description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Sit Ups with Kim',
          Day: 'Thusday',
          Description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        },
        {
          image: require('../../Assets/Images/banner.png'),
          Heading: 'Stretching with Kim',
          Day: 'Friday',
          Description:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry typesetting industry',
        },
      ],
    };
  }
  _renderItem = ({ item }) => {
    return (
      <ForumCard
        Image={{ uri: img_url + item.image }}
        Heading={item.topic}
        Description={item.description}
        Day={item.day}
        onPress={() => this.props.navigation.navigate('NewsFeed', { forum: 1, day: item.day })}
      />
    );
  };

  componentDidMount() {
    this.props.GetForumTopics();
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
          title={'Forum'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.props.forumTopics}
            //ListHeaderComponent={() => <View style={{ marginTop: 0 }}></View>}
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            numColumns={2}
            showsHorizontalScrollIndicator={false}
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
  user: state.AuthReducer.user,
  forumTopics: state.ActivityReducer.forum_topics
})

const mapDispatchToProps = dispatch => ({
  GetForumTopics: () => dispatch(ActivityMiddleware.getForumTopics()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Forum);

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
