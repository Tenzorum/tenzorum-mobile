import React, { Component } from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';

import NavigatorService from './utils/navigationWrapper';
import ScanPublicKey from './src/App/ScanPublicKey'
// import QRCode from './src/App/QRCode'
import WebView from './src/App/WebView'

import Landing from './src/App/Landing'
import WalletMain from "./src/App/WalletMain";
import General from "./src/App/General";
import Utilities from "./src/App/Utilities";

export const Tabs = TabNavigator({
  General: {screen: General },
  Home: {screen: WalletMain },
  Weigh: { screen: Utilities },
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
  ScanPublicKey: { screen: ScanPublicKey },
  Home: { screen: Tabs },
  WalletMain: { screen: WalletMain },
}, { headerMode: 'none'});

export default class App extends Component {
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

// ghost
//robot
//rocket
//user-secret