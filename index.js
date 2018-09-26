import { AppRegistry, YellowBox } from 'react-native';
import './global'
import './shim.js'
import App from './App';
// YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader'])

AppRegistry.registerComponent('NativeSigner', () => App);
