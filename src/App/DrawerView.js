import React, { Component } from 'react';
import {
  AlertIOS,
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import * as Animatable from 'react-native-animatable'
import { navigate } from "../../utils/navigationWrapper";
import { color } from "./themes";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'


let { height, width } = Dimensions.get('window');

export default class DrawerView extends Component {
  constructor() {
    super();
    this.state = {
      balance: null,
    };
  }

  _accountBoxCall = (name) => {
    navigate('ScanPublicKey', { data: { name }});
  };

  render() {
    return (
      <View style={{ flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1D2533' }}>
        <View style={{ marginTop: 40, marginBottom: 80, flexDirection: 'row', justifyContent: 'space-around', width: width/2 }}>
          <TouchableOpacity onPress={() => navigate('ScanPublicKey')}>
            <MaterialCommunityIcon size={30} name="qrcode-scan" color={'grey'}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon size={30} name="user-secret" color={'grey'}/>
          </TouchableOpacity>
        </View>
        <ScrollView style={{height: height - 800}}>
          <Animatable.View animation="slideInRight">
            <TouchableOpacity onPress={() => this._accountBoxCall('alpha')} style={[styles.accountBox, {backgroundColor: '#eee'}]}>
              <Image style={{ width: 30, height: 30, resizeMode:'contain'}} source={require('../../public/aion_logo.png')} />
              <Text style={styles.accountBoxText}>AION</Text>
            </TouchableOpacity>
          </Animatable.View>
          <TouchableOpacity onPress={() => this._accountBoxCall('ion')} style={[styles.accountBox, {backgroundColor: '#eee'}]}>
            <Image style={{ width: 30, height: 30, resizeMode:'contain'}} source={require('../../public/ethereum_logo.png')} />
            <Text style={styles.accountBoxText}>ETHEREUM</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._accountBoxCall('gamma')} style={[styles.accountBox, {backgroundColor: '#eee'}]}>
            <Image style={{ width: 40, height: 40, resizeMode:'contain'}} source={require('../../public/bitcoin_logo.png')} />
            <Text style={styles.accountBoxText}>BITCOIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._accountBoxCall('ohm')} style={[styles.accountBox, {backgroundColor: '#eee'}]}>
            <Image style={{ width: 30, height: 30, resizeMode:'contain'}} source={require('../../public/eos_logo.png')} />
            <Text style={styles.accountBoxText}>EOS</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  accountBox: {
    padding: 17,
    width: width/2 - 20,
    height: width/2 - 70,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: 'space-between'
  },
  accountBoxText: {
    fontFamily: 'DIN Condensed',
    color: 'rgba(0,0,0,0.35)',
    fontSize: 15,
  },
  topNavText: {
    fontFamily: 'DIN Condensed',
    color: 'white',
    fontSize: 20,
  },
});

//
// <View style={styles.container}>
//   <Modal
//     style={[styles.modal, styles.modal1]}
//     ref={"modal1"}
//     swipeToClose={this.state.swipeToClose}
//     onClosed={this.onClose}
//     onOpened={this.onOpen}
//     onClosingState={this.onClosingState}>
//     {this.state.orderPlaced === true ? <View>
//       <Animatable.View animation="bounceIn" style={{height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 80, backgroundColor: 'green'}}>
//         <IonIcon name="md-checkmark" size={40} color="white"/>
//       </Animatable.View>
//       <Text style={{fontSize: 25, fontWeight: 'bold'}}>Order Sent!</Text>
//
//     </View> : <View style={[styles.modal, styles.modal1]}>
//       <View style={{width, paddingLeft: 20, padding: 10}}>
//         {/*<Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{item.name} | ${item.price}</Text>*/}
//         {/*<Text style={{margin:0}}>{item.description}</Text>*/}
//       </View>
//       <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Special Instructions</Text>
//       <TextInput placeholder="E.g. Allergies etc."/>
//       <TouchableOpacity onPress={this.placeOrder}>
//         <LinearGradient
//           start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
//           colors={["#9be15d", "#00e3ae",]}
//           style={[styles.button, {shadowColor: '#00e3ae',}]}>
//           <Text style={{ color: 'white', fontSize: 25, backgroundColor: 'transparent', fontWeight: 'bold' }}>Place Order</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//     }
//   </Modal>
//   <ScrollView contentContainerStyle={styles.scrollWrapper}>
//     {menu_items.map( (item, i) => <TouchableOpacity key={i} onPress={() => this.refs.modal1.open()}>
//       <View style={{width, paddingLeft: 20, padding: 10}}>
//         <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{item.name} | ${item.price}</Text>
//         <Text style={{margin:0}}>{item.description}</Text>
//       </View>
//     </TouchableOpacity>)}
//   </ScrollView>
// </View>
