import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BG } from '../../Assets';
import { ActivityListCard, Button } from '../../Components';
import Header from '../../Components/Header';
import { AntDesign, Colors, Entypo, Ionicons, MaterialCommunityIcons } from '../../Theme';
import { img_url } from "../../Config/APIs";
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { connect } from 'react-redux';

class SponsorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
      modal: false,
    };
  }
  handleChangeNote = value => {
    this.setState({ note: value });
  };

  render() {
    let data = this.props.route.params.item;
    let event = this.props.route.params.event;
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
          title={'Sponsor Details'}
        />
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.ImageView}>
              <Image
                source={data.image ? { uri: img_url + data.image } : require('../../Assets/Images/banner.png')}
                style={styles.Image}
              />
              <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <Text style={styles.HeadingName}>
                  {data.rehab_name || data.title}
                </Text>
              </View>
            </View>
            <Text style={styles.Heading}>Details</Text>
            <Text style={styles.text}>
              {data.details}
            </Text>
            <View style={styles.flexRow}>
              <Ionicons name={'location'} size={25} color={Colors.black} />
              <Text style={styles.Address}>
                {data.address}
              </Text>
            </View>
            <View style={styles.flexRow}>
              <MaterialCommunityIcons name={'phone'} size={22} color={Colors.black} />
              <Text style={styles.Address}>{data.phone}</Text>
            </View>
            <Text style={styles.inputSentence}>Note</Text>
            <TextInput
              style={styles.textInput}
              //image={MailIcon}
              placeholder={'Type here...'}
              multiline
              onChangeText={this.handleChangeNote}
              textAlignVertical={'top'}
              value={this.state.note}
              maxLength={150}
            />

            <Button
              width={'100%'}
              height={50}
              name={'Send'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{ marginTop: 10, marginBottom: 15 }}
              onPress={() => {
                if (!this.state.note) {
                  alert("Please write note to continue");
                  return;
                }
                this.props.AddRequest({
                  id: data.id,
                  event,
                  note: this.state.note,
                  callback: () => {
                    this.setState({ modal: true });
                  }
                })
              }}
            />
          </View>
        </ScrollView>
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
                  You request has been submitted successfully.
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
  AddRequest: (data) => dispatch(ActivityMiddleware.addSponsorRequest(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(SponsorDetails);

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
    marginTop: 10,
  },
  ImageView: {
    paddingTop: 8,
    width: '100%',
    alignSelf: 'center',
    height: 270,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  Image: {
    width: '95%',
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
  },

  HeadingName: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    color: '#000',
    marginVertical: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  Address: {
    width: '80%',
    marginLeft: 5,
    fontSize: 14,
    color: Colors.black,
  },
  inputSentence: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    marginTop: 10,
  },
  textInput: {
    width: '100%',
    height: 90,
    borderColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
});
