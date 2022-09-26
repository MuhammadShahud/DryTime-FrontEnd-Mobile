import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  AsyncStorage,
} from 'react-native';
import { BG, faceId, Logo } from '../Assets';
import { Button, Input } from '../Components';
import {
  Colors,
  FontAwesome,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  AntDesign,
  Entypo,
} from '../Theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import CodeInput from 'react-native-confirmation-code-input';
import { AuthMiddleware } from '../Redux/middleware/AuthMiddleware';
import { ActionTypes } from '../Redux/action_types';
import { connect } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import { Settings, LoginManager, AuthenticationToken, AccessToken, GraphRequest, GraphRequestManager, Profile } from 'react-native-fbsdk-next';
import ReactNativeBiometrics from 'react-native-biometrics'
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emial: '',
      emailForget: '',
      password: '',
      modalVerification: false,
      modalVerifyCode: false,
      modalForgetPassword: false,
      Newpassword: '',
      Repassword: '',
      modalFaceId: false,
      forgotCode: null,
      wrongCode: false,
      messageModal: false
    };
  }

  async componentDidMount() {
    if (!messaging().isDeviceRegisteredForRemoteMessages)
      await messaging().registerDeviceForRemoteMessages();

    Settings.setAppID('1693689294173183');
    Settings.initializeSDK();
    GoogleSignin.configure({
      webClientId: "425103676848-sbg8kc68f4clh1rfns38812f7d5d0qqp.apps.googleusercontent.com",
      scopes: ["profile"],//, "https://www.googleapis.com/auth/user.birthday.read", "https://www.googleapis.com/auth/user.gender.read"] 
      iosClientId: "425103676848-mqa4v6qsr88jujqg49kmje2t0p89pm5r.apps.googleusercontent.com"
    });
    let sensor = await ReactNativeBiometrics.isSensorAvailable();
    if (sensor.available) {

      AsyncStorage.getItem("@DT-publicKey", async (error, res) => {
        if (!error) {
          console.warn(error)
          if (res) {
            //  this.setState({ modalFaceId: true }, async () => {
            try {
              let result = await ReactNativeBiometrics.simplePrompt({
                promptMessage: "Sign in to drytime with you Face/Fingerprint"
              });
              if (result.success) {
                AsyncStorage.getItem("@DT-user", (error, results) => {
                  if (!error && results) {
                    let data = JSON.parse(results);
                    this.props.LoginUser(data)
                  }
                });
              }

            } catch (error) {
              console.warn(error)
            }
            // });
          }
          else {
            // console.warn("No Result")
          }
        }
        else {
          console.warn("Error")
        }
      });

    }
  }

  handleChangeEmail = value => {
    this.setState({ emial: value });
  };
  handleChangeEmailForget = value => {
    this.setState({ emailForget: value });
  };
  handleChangePassword = value => {
    this.setState({ password: value });
  };
  handleChangeNewPassword = value => {
    this.setState({ Newpassword: value });
  };
  handleChangeRePassword = value => {
    this.setState({ Repassword: value });
  };
  modalVerificationEmail = () => {
    this.setState({
      modalVerification: false,
    });
    this.props.SendMail({
      email: this.state.emailForget,
      callback: (data) => {
        this.setState({
          modalVerifyCode: true,
          forgotCode: data.confirmation_code
        });
      }
    })

  };
  _onFulfill = code => {
    if (code == this.state.forgotCode)
      this.setState({
        modalVerification: false,
        modalVerifyCode: false,
        modalForgetPassword: true,
      });
    else
      this.setState({ wrongCode: true })
  };
  HandelChangePassword = () => {
    if (this.state.Newpassword == this.state.Repassword) {
      this.setState({
        modalVerification: false,
        modalVerifyCode: false,
        modalForgetPassword: false,
      });
      this.props.ResetPass({
        email: this.state.emailForget,
        password: this.state.Newpassword,
        callback: () => {
          this.setState({
            messageModal: true
          });
        }
      })
    }
    else
      alert("Password not match")
  };
  HandelVerifyCode = () => {
    this.setState({
      modalVerification: false,
      modalVerifyCode: false,
      modalForgetPassword: true,
    });
  };

  Login = async () => {
    let { emial, password } = this.state;
    let authStatus = await messaging().hasPermission();

    if (authStatus != messaging.AuthorizationStatus.AUTHORIZED)
      messaging().requestPermission();

    let token = "";
    if (messaging().isDeviceRegisteredForRemoteMessages && authStatus == messaging.AuthorizationStatus.AUTHORIZED)
      token = await messaging().getToken();

    if (emial && password) {
      this.props.Login({
        email: emial,
        password,
        token
      });
    } else {
      alert('Please enter Email & Password to login');
    }
  };

  googleSignin = async () => {
    try {
      let { user } = await GoogleSignin.signIn();
      // this.props.navigation.navigate("SignUp", { user })
      this.checkIfUserExist(user);
    } catch (error) {
      console.warn(error)
    }

  }

  facebookLogin = async () => {
    // try {
    //   const result = await LoginManager.logInWithPermissions(
    //     ['public_profile', 'email'],
    //     'limited',
    //     'my_nonce'
    //   );
    //   this.props.showLoading();
    //   let token='/me';
    //   if (Platform.OS === 'ios') {
    //     const tokenData = await AuthenticationToken.getAuthenticationTokenIOS();
    //     token=tokenData.authenticationToken;
    //   }
    //   const infoRequest = new GraphRequest(
    //     token,
    //     null,
    //     this._responseInfoCallback,
    //   );
    //   // Start the graph request.
    //   new GraphRequestManager().addRequest(infoRequest).start();
    //   this.props.hideLoading();
    // } catch (error) {
    //   this.props.hideLoading();
    //   console.log(error);
    // }
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (result) => {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          Profile.getCurrentProfile().then(
            (currentProfile) => {
              if (currentProfile) {
                this.checkIfUserExist(currentProfile)
              }
            }
          );
        }
      },
      (error) => {
        console.log("Login fail with error: " + error);
      }
    );
  }

  _responseInfoCallback = (error: ?Object, result: ?Object) => {
    this.props.hideLoading();
    if (error) {
      console.warn('Error fetching data: ', error);
    } else {
      console.warn('Success fetching data: ', result);
      this.checkIfUserExist(result)
    }
  }

  checkIfUserExist = (user) => {
    this.props.checkIfUserExistAndLogin({
      email: user.email,
      callback: (exist) => {
        if (!exist) {
          this.props.navigation.navigate("SignUp", { user })
        }
      }
    })
  }

  SetFaceIdFingerprint = async () => {
    let sensor = await ReactNativeBiometrics.isSensorAvailable();
    if (sensor.available == true && sensor.biometryType == "Biometrics") {
      let keys = await ReactNativeBiometrics.biometricKeysExist();
      if (!keys.keysExist)
        (await ReactNativeBiometrics.createKeys()).publicKey

      let signature = await ReactNativeBiometrics.createSignature({
        payload: "Set Face/Fingerprint",
        promptMessage: "Set Face/Fingerprint signin for drytime",
      });
      AsyncStorage.setItem("@DT-publicKey", signature);
    }
  }

  appleSignin = async () => {
    if (!appleAuth.isSupported) {
      alert("Device is not supported for apple signin")
      return
    }
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    const { email, fullname } = jwt_decode(appleAuthRequestResponse.identityToken)
    // this.props.navigation.navigate("SignUp", { user: { email, name: fullname } })
    let name = fullname ? fullname : appleAuthRequestResponse.fullName.givenName + " " + appleAuthRequestResponse.fullName.familyName
    this.checkIfUserExist({ email, name });
  }

  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <View style={{ flex: 1, width: '85%', alignSelf: 'center' }}>
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Animatable.View
              useNativeDriver
              duration={2000}
              animation={'bounceIn'}>
              <Image source={Logo} style={styles.AppLogo} />
            </Animatable.View>
            <View style={styles.InputView}>
              <Input
                Mail
                inputPlaceHolder={'Email Address'}
                inputName={'Email'}
                onChange={this.handleChangeEmail}
                name={'Email'}
                value={this.state.emial}
              />
              <Input
                Lock
                inputPlaceHolder={'Password'}
                inputName={'password'}
                onChange={this.handleChangePassword}
                name={'Password'}
                secure
                value={this.state.password}
              />
              <Button
                ArrowRight
                width={'100%'}
                height={50}
                name={'Sign In'}
                textStyle={{
                  fontSize: 16,
                }}
                btnStyle={{ marginTop: 20 }}
                onPress={() => this.Login()}
              />

              <TouchableOpacity
                onPress={() => this.setState({ modalVerification: true })}>
                <Text style={styles.forgetText}>Forget Password?</Text>
              </TouchableOpacity>
              <Text style={styles.connectText}>or connect with</Text>
              <View style={styles.socialView}>
                <TouchableOpacity
                  onPress={this.facebookLogin}
                  style={styles.facebookTag}>
                  <FontAwesome
                    name={'facebook-square'}
                    size={50}
                    color={'#3B5998'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.googleSignin}
                  style={styles.GoogleTag}>
                  <FontAwesome
                    name={'google-plus-square'}
                    size={50}
                    color={'#D84B37'}
                  />
                </TouchableOpacity>
                {Platform.OS == "ios" ?
                  <TouchableOpacity
                    onPress={this.appleSignin}
                    style={{ ...styles.GoogleTag, backgroundColor: "#A2AAAD", borderRadius: 8, padding: 5,width:45,alignItems:"center" }}>
                    <FontAwesome
                      name={'apple'}
                      size={36}
                      color={'#fff'}
                    />
                  </TouchableOpacity>
                  : null
                }
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.DontHaveText}>Don't have an account ?</Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('SignUp')}>
                  <Text style={styles.TextSignUp}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVerification}
          onRequestClose={() => this.setState({ modalVerification: false })}>
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
                height: 240,
                width: '90%',
                backgroundColor: Colors.Secondary,
                borderRadius: 14,
                alignItems: 'center',
                //justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 8, opacity: 0.3 }}
                onPress={() => this.setState({ modalVerification: false })}>
                <AntDesign
                  name={'closecircleo'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: 18, color: Colors.black, fontWeight: 'bold' }}>
                Verification
              </Text>
              <View style={{ width: '90%' }}>
                <Input
                  Mail
                  inputPlaceHolder={'Registered Email Address'}
                  inputName={'Email'}
                  onChange={this.handleChangeEmailForget}
                  name={'Email'}
                  value={this.state.emailForget}
                />
                <Button
                  animation={'zoomIn'}
                  width={'100%'}
                  height={50}
                  name={'Send Code'}
                  textStyle={{
                    fontSize: 16,
                    color: Colors.white,
                  }}
                  btnStyle={{ marginTop: 10 }}
                  onPress={this.modalVerificationEmail}
                  ColorSecondary={Colors.Primary}
                  ColorPrimary={Colors.Primary}
                />
              </View>
            </LinearGradient>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVerifyCode}
          onRequestClose={() => this.setState({ modalVerifyCode: false })}>
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
                height: 240,
                width: '90%',
                backgroundColor: Colors.Secondary,
                borderRadius: 14,
                alignItems: 'center',
                //justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 8, opacity: 0.3 }}
                onPress={() => this.setState({ modalVerifyCode: false })}>
                <AntDesign
                  name={'closecircleo'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: 18, color: Colors.black, fontWeight: 'bold' }}>
                Verify Code
              </Text>
              <View style={{ width: '90%' }}>
                <CodeInput
                  ref="codeInputRef1"
                  className={'border-box'}
                  codeLength={4}
                  size={50}
                  space={15}
                  codeInputStyle={styles._codeInputStyle}
                  inputPosition="center"
                  onFulfill={this._onFulfill}
                  onPressIn={() => this.setState({ wrongCode: false })}
                  activeColor={Colors.Primary}
                  inactiveColor={this.state.wrongCode ? "red" : Colors.GRAY_1}
                  cellBorderWidth={1}
                  placeholder={'0'}
                />
                <Button
                  animation={'zoomIn'}
                  width={'100%'}
                  height={50}
                  name={'Verify'}
                  textStyle={{
                    fontSize: 16,
                    color: Colors.white,
                  }}
                  btnStyle={{ marginTop: 70 }}
                  onPress={this.HandelVerifyCode}
                  ColorSecondary={Colors.Primary}
                  ColorPrimary={Colors.Primary}
                />
              </View>
            </LinearGradient>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalForgetPassword}
          onRequestClose={() => this.setState({ modalForgetPassword: false })}>
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
                height: 360,
                width: '90%',
                backgroundColor: Colors.Secondary,
                borderRadius: 14,
                alignItems: 'center',
                //justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 8, opacity: 0.3 }}
                onPress={() => this.setState({ modalForgetPassword: false })}>
                <AntDesign
                  name={'closecircleo'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: 18, color: Colors.black, fontWeight: 'bold' }}>
                Forget Password
              </Text>
              <View style={{ width: '90%', marginTop: 20 }}>
                <Input
                  Lock
                  inputPlaceHolder={'Enter Password'}
                  inputName={'password'}
                  onChange={this.handleChangeNewPassword}
                  name={'New Password'}
                  secure
                  value={this.state.Newpassword}
                />
                <Input
                  Lock
                  inputPlaceHolder={'Enter Password'}
                  inputName={'Re-Type New Password'}
                  onChange={this.handleChangeRePassword}
                  name={'Re-Type New Password'}
                  secure
                  value={this.state.Repassword}
                />

                <Button
                  animation={'zoomIn'}
                  width={'100%'}
                  height={50}
                  name={'Change Password'}
                  textStyle={{
                    fontSize: 16,
                    color: Colors.white,
                  }}
                  btnStyle={{ marginTop: 10 }}
                  onPress={this.HandelChangePassword}
                  ColorSecondary={Colors.Primary}
                  ColorPrimary={Colors.Primary}
                />
              </View>
            </LinearGradient>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalFaceId}
          onRequestClose={() => this.setState({ modalFaceId: false })}>
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
                height: 350,
                width: '90%',
                backgroundColor: Colors.Secondary,
                borderRadius: 14,
                alignItems: 'center',
                //justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginRight: 8, opacity: 0.3 }}
                onPress={() => this.setState({ modalFaceId: false })}>
                <AntDesign
                  name={'closecircleo'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text
                style={{ fontSize: 18, color: Colors.black, fontWeight: 'bold' }}>
                Set Face ID
              </Text>
              <View style={{ width: '90%', marginTop: 20 }}>
                <Image
                  source={faceId}
                  style={{
                    width: 160,
                    height: 180,
                    marginVertical: 30,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                  }}
                />
                {/* <Button
                  animation={'zoomIn'}
                  width={'100%'}
                  height={50}
                  name={'Save'}
                  textStyle={{
                    fontSize: 16,
                    color: Colors.white,
                  }}
                  btnStyle={{ marginTop: 10 }}
                  onPress={this.SetFaceIdFingerprint}
                  ColorSecondary={Colors.Primary}
                  ColorPrimary={Colors.Primary}
                /> */}
              </View>

            </LinearGradient>
          </View>
        </Modal>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.messageModal}
          onRequestClose={() => this.setState({ messageModal: false })}>
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
                  this.setState({ messageModal: false })
                }}>
                <Entypo
                  name={'circle-with-cross'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, color: Colors.black, marginTop: 45 }}>
                Password has been reset{' '}
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

const mapDispatchToProps = dispatch => ({
  Login: data => dispatch(AuthMiddleware.Login(data)),
  checkIfUserExistAndLogin: data => dispatch(AuthMiddleware.checkUser(data)),
  SendMail: data => dispatch(AuthMiddleware.SendEmail(data)),
  ResetPass: data => dispatch(AuthMiddleware.ResetPassword(data)),
  showLoading: () => dispatch({ type: ActionTypes.ShowLoading }),
  hideLoading: () => dispatch({ type: ActionTypes.HideLoading }),
  LoginUser: data => dispatch({ type: ActionTypes.Login, payload: data, plan: data.user?.user_plan }),
});

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    //alignItems: 'center',
  },
  AppLogo: {
    width: 250,
    height: 200,
    marginTop: 30,
    marginBottom: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  InputView: {
    //width: '85%',
  },
  forgetText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.black,
    marginVertical: 12,
    alignSelf: 'center',
  },
  connectText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.black,
    marginTop: 50,
    alignSelf: 'center',
  },
  socialView: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  facebookTag: {
    marginHorizontal: 5,
  },
  GoogleTag: {
    marginHorizontal: 5,
  },
  DontHaveText: {
    marginTop: 15,
    fontSize: 16,
    color: Colors.black,
    fontWeight: 'normal',
    alignSelf: 'center',
  },
  TextSignUp: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: 'bold',
    top: 8,
    marginLeft: 5,
  },
  _codeInputStyle: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
});
