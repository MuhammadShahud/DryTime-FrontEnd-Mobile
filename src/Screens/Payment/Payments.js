import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { BG, master, visa } from '../../Assets';
import { ActivityListCard, Button } from '../../Components';
import Header from '../../Components/Header';
import { AuthMiddleware } from '../../Redux/middleware/AuthMiddleware';
import { Colors, Ionicons, MaterialIcons } from '../../Theme';

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        };
    }

    componentDidMount() {
        this.props.GetPaymentMethods();
    }

    _renderItem = ({ item, index }) => {
        return (
            // <ActivityListCard
            //     Image={item.image}
            //     Heading={item.Heading}
            //     Time={item.Time}
            //     onPress={() => this.props.navigation.navigate('ExerciseDetails')}
            // />
            <TouchableOpacity
                onPress={() => this.props.DefaultPaymentMethods({ method_id: item.id, index })}
                style={{
                    alignSelf: 'center',
                    width: '94%',
                    borderRadius: 10,
                    height: 50,
                    borderWidth: 1,
                    borderColor: Colors.black,
                    marginBottom: 15,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                }}>
                <View style={{ flexDirection: 'row' }}>
                    {item.default_card == 1 ?
                        <Ionicons name={'radio-button-on'} size={12} color={Colors.black} />
                        : <Ionicons name={'radio-button-off-sharp'} size={12} color={Colors.black} />
                    }
                    {item.card_brand?.toLowerCase() == 'mastercard' ?
                        <Image source={master} style={{ marginStart: 10, width: 25, height: 20, resizeMode: 'cover' }} />
                        : item.card_brand?.toLowerCase() == 'visa' ?
                            <Image source={visa} style={{ marginStart: 10, width: 25, height: 20, resizeMode: 'cover' }} />
                            : null
                    }
                    <Text style={{ fontWeight: 'bold', color: Colors.black, marginStart: 10 }}>xxxx-xxxx-xxxx-{item.card_end_number}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {/* <TouchableOpacity>
                        <MaterialIcons name={'edit'} size={20} color={Colors.black} />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => this.props.DeletePaymentMethods({ method_id: item.stripe_source_id, index })}
                    >
                        <MaterialIcons name={'delete'} size={20} color={Colors.black} />
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>

        );
    };

    onRefresh = () => {
        this.props.GetPaymentMethods();
    }

    render() {
        return (
            <ImageBackground source={BG} style={styles.container}>
                <Header onPressNotification={() => this.props.navigation.navigate('Notifications')}
                    onPress={() => this.props.navigation.goBack()}
                    onPressDrawer={() => this.props.navigation.toggleDrawer()}
                    ArrowBackIcon
                    BellIcon
                    Menu
                    title={'Payment'} />
                <View style={styles.body}>

                    <FlatList
                        data={this.props.paymentMethods}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        ListHeaderComponent={() => <Text style={styles.Heading}>Choose Card</Text>
                        }
                        ListFooterComponent={() => <View style={{ marginBottom: 10 }}>
                            <Button
                                // ArrowRight
                                width={'100%'}
                                height={50}
                                name={'Add New Card'}
                                textStyle={{
                                    fontSize: 17,
                                }}
                                btnStyle={{ marginVertical: 20 }}
                                onPress={() => this.props.navigation.navigate('AddNewCard', { Yoga: this.props?.route?.params?.Yoga })}
                                ColorSecondary={Colors.white}
                                ColorPrimary={Colors.white}
                            />
                        </View>
                        }
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
                    />
                </View>

            </ImageBackground>
        );
    }
}

const mapStateToProps = state => ({
    paymentMethods: state.AuthReducer.paymentMethods,
});

const mapDispatchToProps = dispatch => ({
    GetPaymentMethods: () => dispatch(AuthMiddleware.getPaymentMethods()),
    DeletePaymentMethods: (data) => dispatch(AuthMiddleware.deletePaymentMethod(data)),
    DefaultPaymentMethods: (data) => dispatch(AuthMiddleware.defaultPaymentMethod(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);

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
})