import { Dimensions } from "react-native";
export const Colors = {
    Primary: '#24BDC7',
    black: '#000',
    white: '#fff',
    GRAY_1: '#8D8D8D',
    GRAY_2: '#EEEBEB',
    GRAY_3: '#636060',
    GRAY_4: '#F8F8F8',
    GRAY_5: '#363636',
    GRAY_6: '#ABABAB',


};
// export const Fonts = {
//     bold: "calibrib_bold",
//     reg: "calibri_regular",
//     light: 'calibril_light'
// }
export const IS_IOS = Platform.OS === 'ios';
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const WP = (width) => (SCREEN_WIDTH / 100) * width
export const HP = (height) => (SCREEN_HEIGHT / 100) * height

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';

export {
    Entypo,
    AntDesign,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome5Pro,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
};
