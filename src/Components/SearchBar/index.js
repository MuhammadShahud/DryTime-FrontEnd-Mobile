import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { Colors } from '../../Theme';
import { eyeIcon, filterIcon, searchIcon } from '../../Assets';

export class SearchBar extends Component {

    render() {
        const { } =
            this.props;
        this.state = {
            autoFocusValue: this.props?.focus,
        }
        return (
            <View style={styles.searchContainer}>
                <View>
                    <Image
                        source={searchIcon}
                        style={styles.searchIcon}
                        resizeMode={'contain'}
                    />
                </View>
                {!this.props.editable ? (
                    <TextInput autoFocus={this.props?.focus} style={{ marginLeft: 5, flex: 1 }} placeholder={'Search here'} onChangeText={this.props.onChangeText} />
                ) : <Text style={{ marginLeft: 5, color: Colors.black }}>Search here</Text>}
                {this.props.filter ? (
                    <TouchableOpacity style={styles.searchFieldContainer}>
                        <Image
                            source={filterIcon}
                            style={styles.searchIcon}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>
                ) : (null)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.GRAY_1,
    },
    searchContainer: {
        flexDirection: 'row',
        // backgroundColor: Colors.GRAY_4,
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.black,
        marginTop: 5,
        borderRadius: 8,
    },
    searchIcon: {
        height: 15,
        width: 15,
        tintColor: '#000',
    },
    searchFieldContainer: {
        position: 'absolute',
        right: 20,
    },
});
export default SearchBar;
