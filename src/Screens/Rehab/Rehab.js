import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import { BG } from '../../Assets';
import { ActivityListCard, RehabListCard, SearchBar } from '../../Components';
import Header from '../../Components/Header';
import { ActivityMiddleware } from '../../Redux/middleware/ActivityMiddleware';
import { Colors } from '../../Theme';

class Rehab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      refreshing: false
    };
  }

  componentDidMount() {
    this.props.GetRehabs({ search: '' })
  }

  _renderItem = ({ item }) => {
    return (
      <RehabListCard
        //Image={item.image}
        Heading={item.rehab_name}
        onPress={() => this.props.navigation.navigate('RehabDetails', { item })}
      />
    );
  };

  onSearch = (search) => {
    this.setState({ search })
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.props.GetRehabs({ search })
    }, 1000)

  }

  onEndReached = () => {
    if (this.props.rehabs.next_url) {
      this.props.GetMoreRehabs({ next_url: this.props.rehabs.next_url, search: this.state.search })
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true })
    this.props.GetRehabs({ search: '' })
    this.setState({ refreshing: false })
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
          title={'Rehab Lookup'}
        />
        <View style={styles.body}>
          <SearchBar
            onChangeText={this.onSearch}
          />
          <FlatList
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            data={this.props.rehabs.data}
            ListHeaderComponent={() => <Text style={styles.Heading}></Text>}
            ListFooterComponent={() => <View style={{ marginBottom: 10 }}></View>}
            ListHeaderComponentStyle={{
              marginBottom: 10,
              marginTop: 10,
            }}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.2}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  rehabs: state.ActivityReducer.rehabs
})

const mapDispatchToProps = dispatch => ({
  GetRehabs: (data) => dispatch(ActivityMiddleware.getRehabs(data)),
  GetMoreRehabs: (data) => dispatch(ActivityMiddleware.getMoreRehabs(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Rehab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },
  Heading: {},
});
