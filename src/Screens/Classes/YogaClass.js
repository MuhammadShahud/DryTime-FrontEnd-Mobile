import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { height } from 'styled-system';
import { BG } from '../../Assets';
import { ActivityListCard, Button } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { Colors, Entypo } from '../../Theme';

class YogaClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  componentDidMount() {
    this.props.getYogaClass();
  }

  _renderItem = ({ item }) => {
    return (
      // <ActivityListCard
      //     Image={item.image}
      //     Heading={item.Heading}
      //     Time={item.Time}
      //     onPress={() => this.props.navigation.navigate('ExerciseDetails')}
      // />
      <TouchableOpacity
        onPress={() => {
         // if (this.props.user?.user?.user_subscription)
            this.props.navigation.navigate("YogaDetail", { item })
          // else
          //   this.setState({ modal: true })
        }}
        style={{
          width: '100%',
          padding: 5,
          backgroundColor: Colors.white,
          marginBottom: 15,
          borderRadius: 15,
        }}>
        <Image
          source={{ uri: img_url + item.thumbnail }}
          style={{
            width: '100%',
            height: 180,
            marginBottom: 10,
            resizeMode: 'cover',
            borderRadius: 15,
          }}
        />
        <View style={{ alignSelf: 'center', width: '90%', padding: 4 }}>
          <Text style={{ fontSize: 17, color: '#000', fontWeight: 'bold' }}>
            {item.title}
          </Text>
          <Text
            numberOfLines={3}
            style={{ fontSize: 12, fontWeight: 'normal', marginBottom: 5 }}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  onEndReached = () => {
    if (this.props.classes?.next_url) {
      this.props.getMoreYogaClass({ next_url: this.props.classes.next_url })
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
          title={'Yoga Class'}
        />
        <View style={styles.body}>
          <FlatList
            data={this.props.classes?.data}
            ListHeaderComponent={() => <View></View>}
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.2}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            horizontal={false}
            // numColumns={3}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>No data found</Text>
              </View>}
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
  classes: state.ActivityReducer.yoga_classes
})

const mapDispatchToProps = dispatch => ({
  getYogaClass: (data) => dispatch(ActivityMiddleware.getYogaClass(data)),
  getMoreYogaClass: (data) => dispatch(ActivityMiddleware.getMoreYogaClass(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(YogaClass);

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
