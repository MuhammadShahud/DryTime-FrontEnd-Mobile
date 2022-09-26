import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { BG, searchIcon } from '../../Assets';
import { ReadingCard } from '../../Components';
import Header from '../../Components/Header';
import { img_url } from '../../Config/APIs';
import { ActionTypes } from '../../Redux/action_types';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { AntDesign, Colors } from '../../Theme';
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

class Reading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titel: { name: "Reading" },
      search: ""
    };
    this.props.EmptySoberActivity()
  }

  componentDidMount() {
    this.props.GetAllExercise({ type: "Reading", search: "" })
  }

  getUrlExtension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  openFile = (url) => {
    const extension = this.getUrlExtension(url);


    // Feel free to change main path according to your requirements.
    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    RNFS.downloadFile(options)
      .promise.then(() => FileViewer.open(localFile))
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
        alert(error)
      });
  }

  _renderItem = ({ item }) => {
    return (
      <ReadingCard
        Image={{ uri: img_url + item.thumbnail }}
        Heading={item.name}
        BookName={item.name}
        Time={item.duration}
        onPress={() => {
          this.openFile(img_url + item.file)
        }
          //  this.props.navigation.navigate('Read', { item })
        }
      />
    );
  };

  onEndReached = () => {
    if (this.props.soberActivity.next_url) {
      this.props.GetMoreExercise({ next_url: this.props.soberActivity.next_url })
    }
  }

  onSearch = (search) => {
    this.setState({ search })
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.GetAllExercise({ type: "Reading", search })
    }, 1000)

  }

  render() {
    let data1 = this.state?.titel;

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
          title={'Reading'}
        />

        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ScheduleForm', { activity: data1 })}
            style={styles.FlexRowRight}>
            <AntDesign name={'plussquare'} size={20} color={Colors.black} />
            <Text style={styles.TextReminder}>Add Reminder</Text>
          </TouchableOpacity>
          <View style={styles.searchbox}>
            <TextInput
              onChangeText={this.onSearch}
              placeholder="Search Here" style={{ flex: 1, height: 48 }} />
            <Image
              source={searchIcon}
              style={styles.searchIcon}
              resizeMode={'contain'}
            />
          </View>
          <FlatList
            style={{ marginTop: 20 }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            data={this.props.soberActivity?.data}
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            ListEmptyComponent={
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{color:"#000",fontSize:20,fontWeight:"bold"}}>No data found</Text>
                </View>}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  soberActivity: state.ActivityReducer.sober_activity
})

const mapDispatchToProps = dispatch => ({
  EmptySoberActivity: () => dispatch({ type: ActionTypes.EmptySoberActivity }),
  GetAllExercise: (data) => dispatch(ActivityMiddleware.getExercises(data)),
  GetMoreExercise: () => dispatch(ActivityMiddleware.getMoreExercises()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reading);

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
    marginBottom: 10,
  },
  FlexRowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  TextReminder: {
    fontSize: 17,
    color: Colors.black,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginHorizontal: 5,
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
