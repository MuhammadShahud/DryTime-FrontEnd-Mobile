import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button } from '../../Components';
import Header from '../../Components/Header';
import { GeneralMiddleware } from '../../Redux/middleware/GeneralMiddleware';
import { Colors, Entypo } from '../../Theme';

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      title: '',
      description: '',
      modal: false
    };
  }

  Contact = () => {
    let { type, title, description } = this.state;
    if (!type || !title || !description) {
      alert("Please fill all fields to continue");
      return;
    }
    this.props.ContactUs({
      type,
      title,
      description,
      callback: () => {
        this.setState({ modal: true,title:"",description:"",type:"" })
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
          title={'Contact Us'}
        />
        <View style={styles.body}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              marginVertical: 12,
              alignSelf: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            {['Queries', 'Claim', 'Complaint', 'Suggestion'].map((v, i) => (
              <TouchableOpacity
                onPress={() => this.setState({ type: v })}
                key={i}
                style={{
                  flexDirection: 'row',
                  marginTop: 12,
                  width: '47%',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 20,
                    borderRadius: 360,
                    backgroundColor:
                      this.state.type == v ? Colors.black : Colors.Primary,
                    borderWidth: 2,
                    borderColor:
                      this.state.type == v ? Colors.black : Colors.black,
                    height: 20,
                  }}
                />

                <Text style={{ marginLeft: 8, fontSize: 17 }}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.inputSentence}>Title</Text>
          <TextInput
            style={styles.textInput}
            //image={MailIcon}
            placeholder={'Type here...'}
            multiline
            onChangeText={title => this.setState({ title })}
            textAlignVertical={'top'}
            value={this.state.title}
            maxLength={150}
          />
          <Text style={styles.inputSentence}>Description</Text>
          <TextInput
            style={styles.DescriptionInput}
            //image={MailIcon}
            placeholder={'Type here...'}
            multiline
            onChangeText={description => this.setState({ description })}
            textAlignVertical={'top'}
            value={this.state.description}
            maxLength={150}
          />
          <View style={{ width: '100%', flexDirection: 'row', marginBottom: 20 }}>
            <Button
              //ArrowRight
              width={'85%'}
              height={50}
              name={'Submit'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{ marginTop: 10 }}
              onPress={() => this.Contact()}
            />
            <Button
              // ArrowRight
              width={'85%'}
              height={50}
              name={'Cancel'}
              textStyle={{
                fontSize: 16,
                color: Colors.white,
              }}
              btnStyle={{ marginTop: 10 }}
              onPress={() => this.props.navigation.navigate('BottomTabs')}
              ColorSecondary={Colors.GRAY_1}
              ColorPrimary={Colors.GRAY_1}
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
                <Text
                  style={{
                    fontSize: 17.5,
                    color: Colors.black,
                    fontWeight: 'bold',
                  }}>
                  Query submission successful
                </Text>
                <Text style={{ fontSize: 16, color: Colors.black, marginTop: 45,marginHorizontal:20, textAlign:"center" }}>
                  You request has been submitted. We will get back to you
                </Text>

              </LinearGradient>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}
const mapStateToProps = state => ({
  user: state.AuthReducer.user,
})

const mapDispatchToProps = dispatch => ({
  ContactUs: (data) => dispatch(GeneralMiddleware.ContactUs(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
  },
  inputSentence: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
    marginLeft: 10,
  },
  textInput: {
    width: '100%',
    height: 70,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
  DescriptionInput: {
    width: '100%',
    height: 170,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
});
