import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { ActivityListCard, Button } from '../../Components';
import Header from '../../Components/Header';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { Colors, Entypo } from '../../Theme';
import { img_url } from "../../Config/APIs";
import { ActionTypes } from '../../Redux/action_types';
import LinearGradient from 'react-native-linear-gradient';

class Exercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
    props.EmptySoberActivity();
  }

  componentDidMount() {
    let type = this.props.route.params.type;
    if (type == "Music Classes")
      type = "instrument"
    else if (type == "Volunteer Work")
      type = "work"
    else if (type == "Creative Writing")
      type = "writing"
    else
      type = type.toLowerCase()

    this.props.GetAllExercise({ type, mine: false })
  }

  _renderItem = ({ item }) => {
    let type = this.props.route.params.type;
    console.warn(item.thumbnail)
    return (
      <ActivityListCard
        Uri={img_url + item.video}
        Image={{ uri: img_url + item.thumbnail }}
        Heading={item.name}
        Time={item.duration}
        onPress={() => this.props.navigation.navigate('ExerciseDetails', { item, type })}

      />
    );
  };

  onEndReached = () => {
    if (this.props.soberActivity.next_url) {
      this.props.GetMoreExercise({ next_url: this.props.soberActivity.next_url, mine: false })
    }
  }

  render() {
    let type = this.props.route.params.type;
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
          title={type}
        />
        <View style={styles.body}>
          <FlatList
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            data={this.props.soberActivity?.data}
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
          />
        </View>
        {
          type == "Cooking" ?
            <TouchableOpacity
              onPress={() => {
                if (this.props.user?.user?.user_subscription)
                  this.props.navigation.navigate('ScheduleFormMeal')
                else
                  this.setState({ modal: true });
              }}
              style={styles.plusButton}>
              <Entypo name={'circle-with-plus'} color={Colors.black} size={55} />
            </TouchableOpacity>
            : null
        }
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
  soberActivity: state.ActivityReducer.sober_activity
})

const mapDispatchToProps = dispatch => ({
  EmptySoberActivity: () => dispatch({ type: ActionTypes.EmptySoberActivity }),
  GetAllExercise: (data) => dispatch(ActivityMiddleware.getExercises(data)),
  GetMoreExercise: (data) => dispatch(ActivityMiddleware.getMoreExercises(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exercise);

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
  plusButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 15,
    right:15
  },
});
