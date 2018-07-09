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
    const {onChange, _this, placeholder, keyboardType } = this.props;
    return (
      <TextInput
        keyboardAppearance='dark'
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor='grey'
        style={styles.modalInput}
        selectionColor='#C800B9'
      />
    )
  }
}


const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "transparent",
    flexDirection: 'row',
    padding: 22,
    justifyContent: "space-between",
    alignItems: "stretch",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "yellow"
  },
  modalInput: {
    fontFamily: 'DIN Condensed',
    backgroundColor: "transparent",
    height: 35,
    width: 200,
    padding: 5,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "yellow",
    color: 'white',
    marginBottom: 10
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 16,
  },
});

