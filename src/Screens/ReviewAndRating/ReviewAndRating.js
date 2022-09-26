import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { BG, starGrey, starYellow } from '../../Assets';
import Header from '../../Components/Header';
import Stars from 'react-native-stars';
import { Colors, Entypo } from '../../Theme';
import { Button } from '../../Components';
import LinearGradient from 'react-native-linear-gradient';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { connect } from 'react-redux';

class ReviewAndRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starRating: 0,
      Review: '',
      modal: false,
    };
  }
  handleChangeReview = value => {
    this.setState({ Review: value });
  };

  StoreRating = () => {
    let { Review, starRating } = this.state;
    this.props.addRateReview({
      rating: starRating,
      comment: Review,
      callback: () => {
        this.setState({ modal: true })
      }
    })
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
          title={'Reviews & Ratings'}
        />
        <View style={styles.body}>
          <Text style={styles.inputSentence}>How was your experience ?</Text>
          <View style={{ alignSelf: 'flex-start', marginTop: 10 }}>
            <Stars
              default={5}
              // disabled
              spacing={3}
              count={5}
              update={val => {
                this.setState({ starRating: val });
              }}
              starSize={32}
              fullStar={starYellow}
              emptyStar={starGrey}
            />
          </View>
          <TextInput
            style={styles.textInput}
            //image={MailIcon}
            placeholder={'Type here...'}
            multiline
            onChangeText={this.handleChangeReview}
            textAlignVertical={'top'}
            value={this.state.note}
            maxLength={150}
          />
          <Button
            width={'100%'}
            height={50}
            name={'Submit'}
            textStyle={{
              fontSize: 16,
            }}
            btnStyle={{ marginTop: 25, marginBottom: 15 }}
            onPress={() => this.StoreRating()}
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
                height: 180,
                width: '90%',
                backgroundColor: Colors.Secondary,
                borderRadius: 14,
                alignItems: 'center',
                // justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 8 }}
                onPress={() => {
                  this.setState({ modal: false }),
                    this.props.navigation.navigate('BottomTabs');
                }}>
                <Entypo
                  name={'circle-with-cross'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: Colors.black, marginTop: 45 }}>
                Review has been submitted{' '}
              </Text>
              <Text
                style={{
                  fontSize: 17.5,
                  color: Colors.black,
                  fontWeight: 'bold',
                }}>
                Successfully !!!
              </Text>
            </LinearGradient>
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
})

const mapDispatchToProps = dispatch => ({
  addRateReview: (data) => dispatch(GeneralMiddleware.RateApp(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAndRating);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 80,
  },
  inputSentence: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '100%',
    height: 150,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginVertical: 25,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
});
