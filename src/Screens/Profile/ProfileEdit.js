import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, Switch, AsyncStorage, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { connect } from 'react-redux';
import { Alex, BG } from '../../Assets';
import { Button } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { AuthMiddleware } from '../../Redux/middleware/AuthMiddleware';
import { Colors } from '../../Theme';

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      switchValue: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("@DT-publicKey", (error, result) => {
      if (!error) {
        if (result)
          this.setState({ switchValue: true })
        else
          this.setState({ switchValue: false })
      }
    });
  }

  toTitleCase = (str) => {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  toggleSwitch = () => {
    this.setState({ switchValue: !this.state.switchValue }, () => {
      if (this.state.switchValue)
        this.SetFaceIdFingerprint();
      else
        AsyncStorage.removeItem("@DT-publicKey");
    })
  }

  SetFaceIdFingerprint = async () => {
    let sensor = await ReactNativeBiometrics.isSensorAvailable();
    if (sensor.available) {
      let keys = await ReactNativeBiometrics.biometricKeysExist();
      if (!keys.keysExist)
        (await ReactNativeBiometrics.createKeys()).publicKey

      let signature = await ReactNativeBiometrics.createSignature({
        payload: "Set Face/Fingerprint",
        promptMessage: "Set Face/Fingerprint signin for drytime",
      });
      if (signature.success) {
        await AsyncStorage.setItem("@DT-publicKey", signature.signature, (error) => {
          //console.warn("Error",error);
        });
      }
    }
    else {
      alert("Face ID not supported");
      this.setState({ switchValue: false })
    }
  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          ArrowBackIcon
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          BellIcon
          Menu
          title={'Profile'}
        />
        <View style={styles.body}>
          <Image source={this.props.user?.user?.profile_pic ? { uri: img_url + this.props.user?.user?.profile_pic } : Alex} style={styles.ProImage} />
          <Text style={styles.NameProfile}>{this.props.user?.user?.username}</Text>
        </View>
        <View
          style={{ flex: 1, marginTop: 20, width: '88%', alignSelf: 'center' }}>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Email</Text>
            <Text style={styles.HeadingDetail}>{this.props.user?.user?.email}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Date of Birth</Text>
            <Text style={styles.HeadingDetail}>{moment(this.props.user?.user?.dob).format("DD-MM-YYYY")}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Gender</Text>
            <Text style={styles.HeadingDetail}>{this.toTitleCase(this.props.user?.user?.gender ? this.props.user?.user?.gender : "")}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Relation Status</Text>
            <Text style={styles.HeadingDetail}>{this.props.user?.user?.relation_status}</Text>
          </View>
          {this.props.user?.user?.rehab_name ?
            <View style={styles.FlewRow}>
              <Text style={styles.Heading}>Rehab Center</Text>
              <Text style={styles.HeadingDetail}>{this.props.user?.user?.rehab_name}</Text>
            </View>
            : null}
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Abstinent From</Text>
            <View>
              {
                this.props.user?.user?.user_addiction && this.props.user?.user?.user_addiction?.length ?
                  this.props.user?.user?.user_addiction.map((val) =>
                    <Text style={styles.HeadingDetail}>{val.addiction}</Text>
                  )
                  : null
              }
            </View>
          </View>
        </View>
        <View style={styles.Reminder}>
          <Text style={styles.ReminderText}>Unlock with FINGERPRINT/FACE ID</Text>
          <Switch
            style={{}}
            onValueChange={() => this.toggleSwitch()}
            trackColor={{ true: 'white', false: 'white' }}
            thumbColor={Colors.black}
            ios_backgroundColor={'#787878'}
            value={this.state.switchValue}
          />
        </View>
        <View style={{ width: '90%', alignSelf: 'center', bottom: 0 }}>
          <Button
            width={'100%'}
            height={50}
            name={'Edit'}
            textStyle={{
              fontSize: 16,
            }}
            btnStyle={{ marginTop: 25, marginBottom: 15 }}
            onPress={() => this.props.navigation.navigate('EditProfile')}
          />
          <Button
            width={'100%'}
            height={50}
            name={'Delete Account'}
            textStyle={{
              fontSize: 16,
            }}
            btnStyle={{ marginBottom: 15 }}
            onPress={() => Alert.alert("Warning", "Are you sure you want to delete your account?", [{
              text: "Cancel"
            }, {
              text: "Yes, Delete my account",
              style: "destructive",
              onPress: () => {
                this.props.DeleteAccount()
              }
            }])}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
})

const mapDispatchToProps = dispatch => ({
  DeleteAccount: () => dispatch(AuthMiddleware.deleteAccount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ProImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginVertical: 20,
    borderRadius: 20,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  Reminder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
    marginStart: 20
  },
  ReminderText: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
  },
  NameProfile: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.black,
  },
  FlewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  Heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  HeadingDetail: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.black,
  },
});
