import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { Alex, BG } from '../../Assets';
import { Button } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { Colors } from '../../Theme';

export default class TherapistProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let data = this.props.route.params?.item;
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          ArrowBackIcon
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          Menu
          BellIcon
          title={''}
        />
        <View style={styles.body}>
          <Image source={data.image ? {uri: img_url + data.image} : Alex} style={styles.ProImage} />
          <Text style={styles.NameProfile}>{data.name}</Text>
        </View>
        <View
          style={{ flex: 1, marginTop: 20, width: '88%', alignSelf: 'center' }}>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>profession</Text>
            <Text style={styles.HeadingDetail}>{data.profession}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Address</Text>
            <Text style={styles.HeadingDetail}>{data.address}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Contact</Text>
            <Text style={styles.HeadingDetail}>{data.contact}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Charges</Text>
            <Text style={styles.HeadingDetail}>{data.charges}</Text>
          </View>
          <View style={styles.FlewRow}>
            <Text style={styles.Heading}>Available Slots</Text>
            <View>
              <Text style={styles.HeadingDetail}>{data.time_slot1_from} - {data.time_slot1_to}</Text>
              <Text style={styles.HeadingDetail}>{data.time_slot2_from} - {data.time_slot2_to}</Text>
              <Text style={styles.HeadingDetail}>{data.time_slot3_from} - {data.time_slot3_to}</Text>
              <Text style={styles.HeadingDetail}>{data.time_slot4_from} - {data.time_slot4_to}</Text>
              <Text style={styles.HeadingDetail}>{data.time_slot5_from} - {data.time_slot5_to}</Text>
            </View>
          </View>
        </View>
        <View style={{ width: '90%', alignSelf: 'center', bottom: 0 }}>
          <Button
            width={'80%'}
            height={50}
            name={'Add Schedule'}
            textStyle={{
              fontSize: 17,
            }}
            btnStyle={{ marginTop: 25, marginBottom: 15 }}
            onPress={() => this.props.navigation.navigate('ScheduleForm', { data })}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ProImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginVertical: 20,
    borderRadius: 360,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
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
    width: 170,
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.black,
    textAlign: 'right',
  },
});
