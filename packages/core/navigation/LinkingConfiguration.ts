/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { PathConfigMap } from '@react-navigation/core';
import * as Linking from 'expo-linking';
import Config from './Config';

const screens = Config.packages.reduce((previousValue, currentValue)=>{
  Object.keys(currentValue).reduce((_previousValue, _currentValue)=>{
    const _screens:PathConfigMap = {}
    _screens[_currentValue] = currentValue[_currentValue].url
    _previousValue[_currentValue.substring(0, _currentValue.lastIndexOf("Screen"))] = { screens:_screens}
    return _previousValue
  }, previousValue)
  return previousValue
}, {} as PathConfigMap)

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        path: Config.rootPath,
        screens: screens
      },
      NotFound: '*',
    },
  },
};
