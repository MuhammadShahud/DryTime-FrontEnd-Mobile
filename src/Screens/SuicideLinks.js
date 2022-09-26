import { Icon } from 'native-base';
import React, { Component } from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  Share,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../Assets';
import Header from '../Components/Header';
import { ActivityMiddleware } from '../Redux/middleware/ActivityMiddleware';
import { Colors, FontAwesome5 } from '../Theme';

class SuicideLinks extends Component {


  componentDidMount() {
    this.props.getSuicideLinks();
  }

  _renderItem = ({ item }) => {
    let link = item.link.startsWith("http") ? item.link : "https://" + item.link;
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity
        onPress={()=>Linking.openURL(link)}
        >
        <Text style={{ color: '#000', textDecorationLine: 'underline' }}>
          {link}
        </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(link);
              alert("Link copied")
            }}
            style={{ ...styles.btn, marginEnd: 10 }}>
            <Icon
              name="copy"
              size={4}
              as={FontAwesome5}
              color={Colors.Primary}
            />
            <Text style={styles.btnTxt}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Share.share({
                title: "Suicide Help Link",
                message: link,
                url: link
              }, {
                dialogTitle: "Suicide Help Link"
              })
            }}
            style={styles.btn}>
            <Icon
              name="share-alt"
              size={4}
              as={FontAwesome5}
              color={Colors.Primary}
            />
            <Text style={styles.btnTxt}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          title={'Suicide Help'}
        />
        <View style={styles.innerCon}>
          <FlatList 
          ListEmptyComponent={
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{color:"#000",fontSize:20,fontWeight:"bold"}}>No data found</Text>
            </View>}
          data={this.props.suicideLinks} 
          renderItem={this._renderItem} />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  suicideLinks: state.ActivityReducer.suicide_help_links
})

const mapDispatchToProps = dispatch => ({
  getSuicideLinks: (data) => dispatch(ActivityMiddleware.getSuicideLinks(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuicideLinks);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    paddingHorizontal: 20,
  },
  btnTxt: {
    color: Colors.Primary,
    fontWeight: 'bold',
    fontSize: 15,
    marginStart: 5,
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 85,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
