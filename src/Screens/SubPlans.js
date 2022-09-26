import { Icon } from 'native-base';
import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BG } from '../Assets';
import Header from '../Components/Header';
import { Colors, FontAwesome5 } from '../Theme';
import { connect } from 'react-redux';
import { AuthMiddleware } from "../Redux/middleware/AuthMiddleware";
import * as RNIap from 'react-native-iap';
import { purchaseErrorListener, purchaseUpdatedListener } from 'react-native-iap';

const productIds = [
  //'com.drytime.monthlySub',
  'com.drytime.yearlySub'
  // 'com.drytime.coins100'
];

const { width, height } = Dimensions.get('screen');

class SubPlans extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      refreshing: Platform.OS == "ios" ? true : false,
      selected_sku: ""
    }
  }

  purchaseUpdateSubscription = null
  purchaseErrorSubscription = null

  componentDidMount() {
    if (Platform.OS == "ios") {
      this.setupInApp();
    }
    else {
      this.props.GetSubPackages({
        callback: (data) => {
          this.setState({ data })
        }
      });
    }

  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
  }

  setupInApp = async () => {
    RNIap.initConnection().then(async (bool) => {
      if (!bool) {
        alert("Can not initialize In-App purchases")
        return;
      }
      this.onRefreshInApp();
      if (Platform.OS == "android")
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();

      this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: RNIap.InAppPurchase | RNIap.SubscriptionPurchase | RNIap.ProductPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          let product = this.state.data.find((value) => value.productId == this.state.selected_sku);
          this.props.SubscribePackage({
            package_id: this.state.selected_sku,
            price: product.price,
            token: this.props.user.token,
            type: "in-app",
            onSucess: async () => {
              await RNIap.finishTransaction(purchase, false)
            }
          })
        }
      });

      this.purchaseErrorSubscription = purchaseErrorListener((error: RNIap.PurchaseError) => {
        console.warn('purchaseErrorListener', error);
      });
    })

  }

  requestSubscription = async (sku) => {
    try {
      await RNIap.requestSubscription(sku);
      this.setState({ selected_sku: sku, loading: true })
    } catch (err) {
      alert("Error while processing please try again")
      console.warn(err.code, err.message, err);
    }
  }

  inAppAndStripeItem = (item) => {
    if (Platform.OS == "ios")
      return {
        title: item?.title ? item?.title : item?.subscriptionPeriodUnitIOS == "MONTH" ? "Monthly Subscription" : "Yearly Subscription",
        description: item?.description ? item?.description : "Watch yoga lessons and promote your posts",
        price: item?.localizedPrice ? item?.localizedPrice : item?.price,
        disabled: this.props.user?.user?.user_subscription?.package_id == item.productId,
        duration: item?.subscriptionPeriodUnitIOS
      }
    else
      return {
        title: item?.package_name,
        description: item?.description,
        price: "$" + item?.price,
        disabled: this.props.user?.user?.user_subscription?.plan_id == item.id,
        duration: item?.package_name.toLowerCase().includes("month") ? "MONTH" : item?.package_name.toLowerCase().includes("week")?"WEEK":"YEAR"
      }
  }

  _renderItem = (item, index) => {
    let package_data = this.inAppAndStripeItem(item);
    return (
      <View
        style={{
          width: width * 0.9,
          backgroundColor: '#fff',
          alignItems: 'center',
          borderRadius: 20,
          marginTop: 20,
          padding: 30,
        }}>
        <Text style={{ color: '#000', fontSize: 20 }}>{package_data.title}</Text>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopColor: '#ddd',
            borderTopWidth: 2,
            width: '118%',
            marginTop: 10,
          }}>
          <Text
            style={{ fontSize: 40, fontWeight: 'bold', color: Colors.Primary }}>
            {package_data.price}
          </Text>
          <Text style={{ fontSize: 15, textAlign: 'center' }}>PER {package_data.duration}</Text>
          <Text style={{ fontSize: 15, textAlign: 'center', marginHorizontal: 10, marginVertical: 10 }}>
            {package_data.description}
          </Text>
        </View>
        <TouchableOpacity
          disabled={package_data.disabled}
          onPress={() => {
            if (Platform.OS == "ios") {
              this.requestSubscription(item?.productId)
            }
            else {
              if (!this.props.user?.user?.user_subscription) {
                this.props.SubscribePackage({ package_id: item.plan_id, price: item.price, type: "stripe", token: this.props.user.token })
              }
              else {
                this.props.navigation.jumpTo("PaymentD")
              }
            }

          }}
          style={{ ...styles.btn, backgroundColor: package_data.disabled ? "#bbb" : Colors.Primary }}>
          <Text style={styles.btnTxt}>{package_data.disabled ? "Subscribed" : "Subscribe"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  onRefresh = () => {
    if (Platform.OS == "ios") {
      this.onRefreshInApp();
    }
    else
      this.props.GetSubPackages({
        callback: (data) => {
          this.setState({ data })
        }
      });
  }

  onRefreshInApp = async () => {
    try {
      const data: RNIap.Subscription[] = await RNIap.getSubscriptions(productIds);
      console.warn(data)
      this.setState({ data, refreshing: false });
    } catch (err) {
      console.warn(err);
    }
  }


  render() {
    return (
      <ImageBackground source={BG} style={styles.container}>
        <Header
          ArrowBackIcon
          onPress={() => this.props.navigation.goBack()}
          onPressDrawer={() => this.props.navigation.toggleDrawer()}
          Menu
          title={'VIP Plan'}
        />
        <View style={styles.innerCon}>
          <FlatList
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            data={this.state.data}
            renderItem={({ item, index }) => this._renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
});

const mapDispatchToProps = dispatch => ({
  GetSubPackages: (data) => dispatch(AuthMiddleware.getSubscriptions(data)),
  SubscribePackage: (data) => dispatch(AuthMiddleware.subscribePkg(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubPlans);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerCon: {
    flex: 1,
    paddingHorizontal: 20,
  },
  btnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginStart: 5,
  },
  btn: {
    backgroundColor: Colors.Primary,
    borderRadius: 12,
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
