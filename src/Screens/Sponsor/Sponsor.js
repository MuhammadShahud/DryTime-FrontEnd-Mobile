import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { SponsorListCard } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { Colors } from '../../Theme';

class Sponsor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonSelected: 0,
    };
  }

  componentDidMount() {
    this.props.GetRehabs();
  }

  _renderItem = ({ item }) => {
    return (
      <SponsorListCard
        Image={{ uri: img_url + item.image }}
        Heading={item.rehab_name || item.title}
        Description={item.details}
        onPress={() => this.props.navigation.navigate('SponsorDetails', { item, event: this.state.buttonSelected == 0 ? false : true })}
      />
    );
  };

  onEndReached = () => {
    if (this.props.sponsorRehabs.next_url) {
      this.props.GetMoreRehabs({ next_url: this.props.sponsorRehabs.next_url })
    }
  }

  onEndReachedEvents = () => {
    if (this.props.sponsorEvents.next_url) {
      this.props.GetMoreEvents({ next_url: this.props.sponsorEvents.next_url })
    }
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
          title={'Sponsor Details'}
        />
        <View style={styles.ButtonView}>
          <TouchableOpacity
            onPress={() => this.setState({ buttonSelected: 0 })}
            style={
              this.state.buttonSelected == 0 ? styles.SelectedBtn : styles.btn
            }>
            <Text
              style={
                this.state.buttonSelected == 0
                  ? styles.SelectedBtnText
                  : styles.btnText
              }>
              Rehab
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.props.sponsorEvents?.data?.length == 0)
                this.props.GetEvents();
              this.setState({ buttonSelected: 1 })
            }}
            style={
              this.state.buttonSelected == 1 ? styles.SelectedBtn : styles.btn
            }>
            <Text
              style={
                this.state.buttonSelected == 1
                  ? styles.SelectedBtnText
                  : styles.btnText
              }>
              Sober Activity
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          {
            this.state.buttonSelected == 0 ?
              <FlatList
                data={this.props.sponsorRehabs?.data}
                ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
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
                onEndReachedThreshold={0.2}
                ListEmptyComponent={
                  <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text style={{color:"#000",fontSize:20,fontWeight:"bold"}}>No data found</Text>
                    </View>}
              />
              :
              <FlatList
                data={this.props.sponsorEvents?.data}
                ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
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
                onEndReached={this.onEndReachedEvents}
                onEndReachedThreshold={0.2}
                ListEmptyComponent={
                  <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                    <Text style={{color:"#000",fontSize:20,fontWeight:"bold"}}>No data found</Text>
                    </View>}
              />
          }

        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  sponsorRehabs: state.ActivityReducer.sponsor_rehabs,
  sponsorEvents: state.ActivityReducer.sponsor_events
})

const mapDispatchToProps = dispatch => ({
  GetRehabs: (data) => dispatch(ActivityMiddleware.getSponseeRehabs(data)),
  GetMoreRehabs: (data) => dispatch(ActivityMiddleware.getMoreSponseeRehabs(data)),
  GetEvents: (data) => dispatch(ActivityMiddleware.getSponsorEvents(data)),
  GetMoreEvents: (data) => dispatch(ActivityMiddleware.getMoreSponsorEvents(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Sponsor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  body: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
  },
});
