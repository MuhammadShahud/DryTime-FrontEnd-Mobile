import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Alex, BG, searchIcon } from '../../Assets';
import Header from '../../Components/Header';
import BottomSheet from '@gorhom/bottom-sheet';
import { Avatar } from 'native-base';
import { connect } from 'react-redux';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { img_url } from '../../Config/APIs';

const snapPoints = ['22%', '90%'];

class SearchCounselor extends Component {

  state = {
    search: "",
    coords: {
      latitude: null,
      longitude: null
    }
  }

  componentDidMount() {
    if (Platform.OS == "android") {
      PermissionsAndroid.requestMultiple([
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]).then((val) => {
        if (val['android.permission.ACCESS_COARSE_LOCATION'] == PermissionsAndroid.RESULTS.GRANTED || val['android.permission.ACCESS_FINE_LOCATION'] == PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              this.mapView.animateToRegion({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.6,
                longitudeDelta: 0.6
              }, 500)
              this.setState({
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }
              })
              let meet_type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : "";
              this.props.GetAllTherapist({
                search: '', meet_type, latitude: position.coords.latitude, longitude: position.coords.longitude, callback: () => {
                  // this.mapView.fitToElements({
                  //   animated: true,
                  //   edgePadding: {
                  //     bottom: 0,
                  //     top: 0,
                  //     left: 0,
                  //     right: 0
                  //   }
                  // })
                }
              });
            },
            (error) => {
              // See error code charts below.
              console.warn(error.code, error.message);
            },
            { timeout: 15000, maximumAge: 10000 }
          );
        }
        else {
          this.setState({
            coords: {
              latitude: null,
              longitude: null,
            }
          })
          let meet_type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : "";
          this.props.GetAllTherapist({
            search: '', meet_type, latitude: null, longitude: null, callback: () => {
              // this.mapView.fitToElements({
              //   animated: true,
              //   edgePadding: {
              //     bottom: 0,
              //     top: 0,
              //     left: 0,
              //     right: 0
              //   }
              // })
            }
          });
          alert("Location permission not granted")
        }
      })
    }
    else {
      Geolocation.getCurrentPosition(
        (position) => {
          this.mapView.animateToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.6,
            longitudeDelta: 0.6
          }, 500)
          this.setState({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          })
          let meet_type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : "";
          this.props.GetAllTherapist({
            search: '', meet_type, latitude: position.coords.latitude, longitude: position.coords.longitude, callback: () => {
              // this.mapView.fitToElements({
              //   animated: true,
              //   edgePadding: {
              //     bottom: 0,
              //     top: 0,
              //     left: 0,
              //     right: 0
              //   }
              // })
            }
          });
        },
        (error) => {
          // See error code charts below.
          console.warn(error.code, error.message);
        },
        { timeout: 15000, maximumAge: 10000 }
      );
    }

  }

  handleSheetChanges = (index: number) => {
    console.log('handleSheetChanges', index);
  };

  onSearch = (search) => {
    this.setState({ search })
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.GetAllTherapist({
        search, meet_type: "", callback: () => {
          this.mapView.fitToElements({
            animated: true,
            edgePadding: {
              bottom: 0,
              top: 0,
              left: 0,
              right: 0
            }
          })
        }
      })
    }, 1000)

  }

  renderItem = ({ item }) => {

    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate('TherapistProfile', { item })}
        style={{
          flexDirection: 'row',
          marginHorizontal: 10,
          marginVertical: 5,
          padding: 10,
          backgroundColor: '#fff',
          borderRadius: 15,
        }}>
        <Avatar source={{ uri: img_url + item?.image }} size="lg" />
        <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center" }}>
          <Text style={{ color: '#000', fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 12 }}>{item.profession}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  onEndReached = () => {
    if (this.props.therapists.next_url) {
      let meet_type = this.props.route.params?.meet_type ? this.props.route.params?.meet_type : "";
      this.props.GetMoreTherapist({ next_url: this.props.therapists.next_url, search: this.state.search, meet_type, latitude: this.state.coords.latitude, longitude: this.state.coords.longitude, })
    }
  }

  render() {
    return (
      <ImageBackground source={BG} style={{ flex: 1 }}>
        <Header
          onPress={() => this.props.navigation.goBack()}
          onPressNotification={() => this.props.navigation.navigate('Notifications')}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          ArrowBackIcon
          BellIcon
          Menu
          title="Counselor/Therapist"
        />
        <View style={styles.container}>
          <View style={styles.searchbox}>
            <TextInput
              onChangeText={this.onSearch}
              placeholder="Search Here" style={{ flex: 1, height: 45 }} />
            <Image
              source={searchIcon}
              style={styles.searchIcon}
              resizeMode={'contain'}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#ddd',
              borderRadius: 10,
              marginTop: 30,
              borderWidth: 2,
              borderColor: '#fff',
              transform: [{ rotate: '2deg' }],
            }}
          >
            <MapView
              ref={component => this.mapView = component}
              style={{ flex: 1 }}
              showsUserLocation>
              {
                this.props.therapists?.data.length > 0 ?
                  this.props.therapists?.data.map(element => (
                    <Marker
                      coordinate={{
                        latitude: parseFloat(element.lat),
                        longitude: parseFloat(element.lng),
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.015
                      }}
                      title={element.name}
                    />
                  ))
                  : null
              }
            </MapView>
          </View>
          <BottomSheet
            backgroundComponent={() => <View style={{ backgroundColor: "#ddd", ...StyleSheet.absoluteFill, borderColor: "#fff", borderWidth: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />}
            snapPoints={snapPoints}
            onChange={this.handleSheetChanges}
            enableContentPanningGesture={false}
          >
            <View style={{ flex: 1 }}>
              <FlatList
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.3}
                data={this.props.therapists?.data}
                renderItem={this.renderItem} />
            </View>
          </BottomSheet>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  therapists: state.ActivityReducer.therapists
})

const mapDispatchToProps = dispatch => ({
  GetAllTherapist: (data) => dispatch(ActivityMiddleware.getAllTherapist(data)),
  GetMoreTherapist: (data) => dispatch(ActivityMiddleware.getMoreAllTherapist(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchCounselor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  searchbox: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchIcon: {
    height: 20,
    width: 20,
    tintColor: '#000',
  },
});
