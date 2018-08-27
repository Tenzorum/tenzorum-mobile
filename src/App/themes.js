// @flow
import { Platform, Dimensions } from 'react-native';

// ==============================
// APP STYLE CONSTANTS
// ==============================

// color
const color = {
  textGrey: '#a7a1a0',
  green: '#03c845',
  darkGrey: '#eae9e2',
  magenta: '#FF00EC',
  lightGrey: '#EDF4EC',
  yellow: '#FEC21D',
  lightYellow: '#FDE79A',
  blue: '#AAE8F7',
  darkBlue: '#488094'
};

// font sizes
const fontSize = {
  xsmall: 12,
  small: 14,
  default: 17,
  large: 24,
  xlarge: 32,
};

// text styles
const text = {
  greySmall: {
    fontFamily: 'DIN Condensed',
    color: color.textGrey,
    fontSize: 10,
  },
  greyMedium: {
    fontFamily: 'DIN Condensed',
    color: color.textGrey,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  blackSmall: {
    fontFamily: 'DIN Condensed',
    color: 'black',
    fontSize: 10,
  },
  blackMedium: {
    fontFamily: 'DIN Condensed',
    color: 'black',
  },
};


const shadow = {
  shadowColor: '#aaa',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowRadius: 2,
  shadowOpacity: 1.0
}
// Component Specific
// ------------------------------

// navbar
const navbar = {
  backgroundColor: 'white',
  buttonColor: color.blue,
  height: Platform.OS === 'ios' ? 64 : 44,
  textColor: color.text,
};

// list header
const listheader = {
  height: 34,
};

// next up
const nextup = {
  height: Platform.OS === 'ios' ? 70 : 110,
};

const statusBarHeight = Platform.OS === 'ios' ? 20 : 24;
const talkPaneAndroidMinScrollAreaHeight = Dimensions.get('window').height - 48;

export {
  color,
  fontSize,
  text,
  shadow,
  navbar,
  nextup,
  listheader,
  talkPaneAndroidMinScrollAreaHeight,
};
