import { Heading } from 'native-base';
import React, { Component } from 'react';
import { ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { Button, Input } from '../../Components';
import Header from '../../Components/Header';
import { AuthMiddleware } from '../../Redux/middleware/AuthMiddleware';
import { Colors, Entypo } from '../../Theme';

class AddCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      number: "",
      expiry: "",
      cvc: ""
    };
  }

  AddPayMethod = () => {
    let { name, number, expiry, cvc } = this.state;
    if (!number || !expiry || !cvc) {
      alert("Please fill all fields")
      return;
    }
    this.props.AddPaymentMethods({
      number,
      expiry,
      cvc,
      callback: () => {
        this.setState({ modal: true, number: "", expiry: "", cvc: "" }, () => {
          this.props.navigation.goBack()
        })
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
          title={'Add New Card'}
        />
        <View style={{ flex: 1, padding: 20 }}>
          <Heading style={{ marginBottom: 40 }}>Credit or debit card</Heading>
          {/* <Input
            onChange={(text, name) => this.setState({ name: text })}
            inputPlaceHolder={'John Doe'} name={'Name on card'} /> */}
          <Input
            value={this.state.number}
            maxLength={16}
            keyboardType="number-pad"
            onChange={(text, name) => this.setState({ number: text })}
            inputPlaceHolder={'1231231313123123'}
            name={'Card number'} />
          <View style={{ flexDirection: 'row' }}>
            <Input
              keyboardType="number-pad"
              onChange={(text, name) => this.setState({ expiry: text.length == 2 ? text + "/" : text })}
              width="48%"
              value={this.state.expiry}
              inputPlaceHolder={'12/2024'}
              name={'Expiry Date'}
            />
            <View style={{ marginHorizontal: 5 }} />
            <Input
              value={this.state.cvc}
              maxLength={5}
              keyboardType="number-pad"
              onChange={(text, name) => this.setState({ cvc: text })}
              width="48%" inputPlaceHolder={'123'} name={'CVC'} />
          </View>
          <Button
            onPress={() => this.AddPayMethod()}
            name="Add Card"
            btnStyle={{
              width: '100%',
              backgroundColor: '#fff',
              marginTop: 20,
              borderRadius: 10,
            }}
          />
        </View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => this.setState({ modal: false })}>

          <View style={{
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
                  this.setState({ modal: false, name: "", expiry: "", number: "", cvc: "" })
                }}>
                <Entypo
                  name={'circle-with-cross'}
                  size={24}
                  color={'#000'}
                  style={{ marginLeft: 5, marginTop: 7 }}
                />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, color: Colors.black, marginTop: 40, fontWeight: 'bold' }}>Payment Method Added</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Your payment method added successfully</Text>

            </LinearGradient>

          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  AddPaymentMethods: (data) => dispatch(AuthMiddleware.addPaymentMethod(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCard);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
