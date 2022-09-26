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
import { Alex, BG } from '../../Assets';
import {
  ActivityListCard,
  Button,
  RehabPatientsCard,
  SponsorListCard,
} from '../../Components';
import Header from '../../Components/Header';
import { AntDesign, Colors, Entypo, Ionicons, MaterialCommunityIcons } from '../../Theme';
import { img_url } from "../../Config/APIs";
import { connect } from 'react-redux';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';

class RehabDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonSelected: 0,
    };
  }

  componentDidMount() {
    let data = this.props.route.params?.item;
    this.props.GetPatients({ rehab_id: data.id });
  }

  _renderItem = ({ item }) => {
    return (
      <RehabPatientsCard
        Image={item.profile_pic ? { uri: img_url + item.profile_pic } : Alex}
        Heading={item.username}
        disabled={true}
      // onPress={() => this.props.navigation.navigate('SponsorDetails')}
      />
    );
  };

  onEndReached = () => {
    if (this.props.patients.next_url) {
      let data = this.props.route.params?.item;
      this.props.GetMorePatients({ rehab_id: data.id, next_url: this.props.patients.next_url });
    }
  }

  render() {
    let data = this.props.route.params?.item;
    let inPatients = [];
    let outPatients = [];
    this.props.patients?.data.map((value) => {
      if (value.patient_type == "inpatient")
        inPatients.push(value)
      else
        outPatients.push(value)
    })
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
          title={'Rehab Lookup Details'}
        />
        {/* <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}> */}
        <View style={styles.body}>

          {
            this.state.buttonSelected == 0 ?
              <FlatList
                data={inPatients}
                ListHeaderComponent={() => (
                  <View>

                    <View style={styles.ImageView}>
                      <View style={{ margin: 10 }}>
                        <Text style={styles.HeadingName}>
                          {data.rehab_name}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: img_url + data.image }}
                        style={styles.Image}
                      />
                      <View style={{ marginVertical: 10, marginHorizontal: 15 }}>

                        <View style={{ flexDirection: "row" }}>
                          <Ionicons name={'location'} size={25} color={Colors.black} />
                          <Text style={{ marginStart: 10 }}>
                            {data.address}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons name={'phone'} size={22} color={Colors.black} />
                          <Text style={{ marginStart: 10 }}> {data.phone}
                          </Text>
                        </View>
                        <Text>
                          {data.details}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ButtonView}>
                      <TouchableOpacity
                        onPress={() => this.setState({ buttonSelected: 0 })}
                        style={
                          this.state.buttonSelected == 0
                            ? styles.SelectedBtn
                            : styles.btn
                        }>
                        <Text
                          style={
                            this.state.buttonSelected == 0
                              ? styles.SelectedBtnText
                              : styles.btnText
                          }>
                          In Patients
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ buttonSelected: 1 })}
                        style={
                          this.state.buttonSelected == 1
                            ? styles.SelectedBtn
                            : styles.btn
                        }>
                        <Text
                          style={
                            this.state.buttonSelected == 1
                              ? styles.SelectedBtnText
                              : styles.btnText
                          }>
                          Out Patients
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListHeaderComponentStyle={{
                  marginBottom: 10,
                  marginTop: 10,
                }}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                // numColumns={3}
                showsHorizontalScrollIndicator={false}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.1}
              />
              :
              <FlatList
                data={outPatients}
                ListHeaderComponent={() => (
                  <View>
                    <View style={styles.ImageView}>
                      <View style={{ margin: 10 }}>
                        <Text style={styles.HeadingName}>
                          {data.rehab_name}
                        </Text>
                      </View>
                      <Image
                        source={{ uri: img_url + data.image }}
                        style={styles.Image}
                      />
                      <View style={{ marginVertical: 10, marginHorizontal: 15 }}>

                        <View style={{ flexDirection: "row" }}>
                          <Ionicons name={'location'} size={25} color={Colors.black} />
                          <Text style={{ marginStart: 10 }}>
                            {data.address}
                          </Text>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <Entypo name={'phone'} size={22} color={Colors.black} />
                          <Text style={{ marginStart: 10 }}> {data.phone}
                          </Text>
                        </View>
                        <Text>
                          {data.details}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.ButtonView}>
                      <TouchableOpacity
                        onPress={() => this.setState({ buttonSelected: 0 })}
                        style={
                          this.state.buttonSelected == 0
                            ? styles.SelectedBtn
                            : styles.btn
                        }>
                        <Text
                          style={
                            this.state.buttonSelected == 0
                              ? styles.SelectedBtnText
                              : styles.btnText
                          }>
                          In Patients
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ buttonSelected: 1 })}
                        style={
                          this.state.buttonSelected == 1
                            ? styles.SelectedBtn
                            : styles.btn
                        }>
                        <Text
                          style={
                            this.state.buttonSelected == 1
                              ? styles.SelectedBtnText
                              : styles.btnText
                          }>
                          Out Patients
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListHeaderComponentStyle={{
                  marginBottom: 10,
                  marginTop: 10,
                }}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                horizontal={false}
                // numColumns={3}
                showsHorizontalScrollIndicator={false}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.1}
              />
          }

        </View>
        {/* </ScrollView> */}
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  patients: state.ActivityReducer.patients
})

const mapDispatchToProps = dispatch => ({
  GetPatients: (data) => dispatch(ActivityMiddleware.getPatient(data)),
  GetMorePatients: (data) => dispatch(ActivityMiddleware.getMorePatient(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RehabDetails);

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
    borderRadius: 12,
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
  ButtonView: {
    width: '100%',
    height: 70,
    //backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: '40%',
    marginHorizontal: 10,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  SelectedBtn: {
    width: '40%',
    marginHorizontal: 10,
    height: 40,
    borderRadius: 6,
    backgroundColor: Colors.GRAY_1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SelectedBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
});
