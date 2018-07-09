import { Platform } from 'react-native';

const PLATFORMS = {
  ios: 'ios',
  android: 'android',
};

const platform = Platform.OS;

export const isIOS = () => platform === PLATFORMS.ios;

export const isAndroid = () => platform === PLATFORMS.android;
