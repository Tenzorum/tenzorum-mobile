import React, { Component } from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';

import NavigatorService from './utils/navigationWrapper';
import ScanPublicKey from './src/App/ScanPublicKey'
// import QRCode from './src/App/QRCode'
import WebView from './src/App/WebView'

import Landing from './src/App/Landing'
import WalletMain from "./src/App/WalletMain";

export const Tabs = TabNavigator({
  Home: {screen: WalletMain },
  Weigh: { screen: ScanPublicKey },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    showLabel: false,
    backgroundColor: 'white',
    indicatorStyle: {
      backgroundColor: '#1D2533'
    },
    style: {
      backgroundColor: '#1D2533',
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
  ScanPublicKey: { screen: ScanPublicKey },
});

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
