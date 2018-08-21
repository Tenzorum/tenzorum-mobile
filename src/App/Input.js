import React, { Component } from 'react';
import {
  AlertIOS,
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {text} from './themes'

import * as Animatable from 'react-native-animatable'

import FeatherIcon from 'react-native-vector-icons/Feather'


let {height, width} = Dimensions.get('window');

export default class Input extends Component {
  constructor() {
    super();
    this.state = {
      visibleModal: null
    };
  }

  render() {
    const {} = this.state;
    const {onChangeText, _this, placeholder, keyboardType, autoCapitalize, value} = this.props;
    return (
      <View style={styles.inputContainer}>
        <FeatherIcon name="at-sign" size={25} color="#333"/>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardAppearance='dark'
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor='grey'
          style={styles.inputStyle}
          selectionColor='grey'
          autoCapitalize={autoCapitalize}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    shadowColor: '#aaa',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 1.0

  },
  inputStyle: {
    marginLeft: 10,
    backgroundColor: "transparent",
    height: 35,
    width: '100%',
    padding: 5,
    fontWeight: '900',
    fontSize: 20,
    color: '#333',
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 16,
  },
});

