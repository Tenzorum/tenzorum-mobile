import React, { Component } from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import NavigatorService from './utils/navigationWrapper';
import ScanPublicKey from './src/App/ScanPublicKey'
// import QRCode from './src/App/QRCode'
import WebView from './src/App/WebView'
import { initApp } from "./utils/ether";

import WalletMain from "./src/App/WalletMain";
import UserProfile from "./src/App/UserProfile";
import General from "./src/App/General";

//TODO: remove all public addresses and keys to use saved addresses and keys

export const Tabs = TabNavigator({
  Home: {screen: UserProfile },
  WalletMain: {screen: WalletMain },
  General: {screen: General}
  }, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    showLabel: false,
    backgroundColor: 'white',
    indicatorStyle: {
      backgroundColor: '#eee'
    },
    style: {
      backgroundColor: '#eee',
      borderTopWidth: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0
    },
    labelStyle: {},
    allowFontScaling: true,
    activeTintColor: 'yellow',
    inactiveTintColor: 'white'
  }});

export const Main = StackNavigator({
  Home: { screen: Tabs },
  WalletMain: { screen: WalletMain },
  WebView: { screen: WebView },
  UserProfile: { screen: UserProfile },
  ScanPublicKey: { screen: ScanPublicKey },
});

export default class App extends Component {

  componentDidMount() {
    initApp();
  }

  render() {
    return (
      <Main
        ref={navigatorRef => {
          NavigatorService.setContainer(navigatorRef);
        }}
      />
    );
  }
}
