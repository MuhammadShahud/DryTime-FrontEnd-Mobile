import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {BG} from '../../Assets';
import {Button, Input} from '../../Components';
import Header from '../../Components/Header';
import {AntDesign, Colors, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../Theme';

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      Description: '',
    };
  }
  handleChangeTitle = value => {
    this.setState({title: value});
  };
  handleChangeDescription = value => {
    this.setState({Description: value});
  };
  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          onPressNotification={() =>
            this.props.navigation.navigate('Notifications')
          }
          onPress={() => this.props.navigation.goBack()}
          ArrowBackIcon
          title={'Create Post'}
        />
        <View style={styles.body}>
          <Text style={styles.inputSentence}>Description</Text>
          <TextInput
            style={styles.textInput}
            //image={MailIcon}
            placeholder={'Type here...'}
            multiline
            onChangeText={this.handleChangeDescription}
            textAlignVertical={'top'}
            value={this.state.note}
            maxLength={150}
          />
          <Text style={styles.inputSentence}>Choose</Text>
          <TouchableOpacity style={styles.UploadImage}>
            <AntDesign name={'cloudupload'} size={35} color={Colors.black} />
            <Text style={styles.ImageAndVideo}>Upload image/video</Text>
          </TouchableOpacity>
          <View style={{width: '100%'}}>
            <Button
              width={'100%'}
              height={50}
              name={'Post'}
              textStyle={{
                fontSize: 16,
              }}
              btnStyle={{marginTop: 25, marginBottom: 15}}
              onPress={() => this.props.navigation.navigate('NewsFeed')}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    width: '90%',
    alignSelf: 'center',
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    marginTop: 150,
    //justifyContent: 'center',
  },
  inputSentence: {
    fontSize: 16,
    marginLeft: 10,
    color: Colors.black,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '100%',
    height: 90,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
  },
  UploadImage: {
    width: '100%',
    height: 120,
    borderColor: Colors.black,
    borderWidth: 1.2,
    borderRadius: 10,
    marginTop: 5,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
    color: 'rgb(9,59,62)',
    backgroundColor: 'tansparent',
    alignItems: 'center',
    paddingTop: 30,
  },
  ImageAndVideo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
});
