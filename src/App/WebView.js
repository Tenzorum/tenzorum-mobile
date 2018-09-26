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
  TouchableNativeFeedback,
  Vibration,
  View,
  WebView,
} from 'react-native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import {backAction} from "../../utils/navigationWrapper";

let {height, width} = Dimensions.get('window');

export default class WebViewTx extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        borderBottomWidth: 0,
      },
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(0)} style={{ width: 35, height: 35, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', margin: 10 }}>
          <EntypoIcon name="chevron-left" size={25} color="white" />
        </TouchableOpacity>
      )
    }
  };

  constructor() {
    super();
    this.state = {
      visibleModal: null,
      receiverAddress: '',
      amount: null,
    };
  }

  render() {
    const {} = this.state;
    const {isVisible, _this} = this.props;
    console.log(this.props.navigation);
    const { uri } = this.props.navigation.state.params;
    return (
      <WebView
        source={{uri}}
        style={{marginTop: 25, backgroundColor: 'white', paddingTop: 20, paddingLeft: 10}}
      />
    )
  }
}



const styles = StyleSheet.create({
  accountBox: {
    padding: 10,
    width: width/2 - 20,
    height: width/2 - 70,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  accountBoxText: {
    fontFamily: 'DIN Condensed',
    color: 'grey',
    fontSize: 15,
  },
  button: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
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
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 16,
  },
});