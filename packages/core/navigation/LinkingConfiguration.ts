/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { PathConfigMap } from '@react-navigation/core';
import * as Linking from 'expo-linking';
import Config from './Config';
import { ScreenPackage } from '../types'

const screens:PathConfigMap = {} 
export function pushScreens(currentValue:ScreenPackage){
  Object.keys(currentValue).reduce((_previousValue, _currentValue)=>{
    const _screens:PathConfigMap = {}
    _screens[_currentValue] = currentValue[_currentValue].url
    _previousValue[_currentValue.substring(0, _currentValue.lastIndexOf("Screen"))] = { screens:_screens}
    return _previousValue
  }, screens)
}
const Root = {
  path: Config.rootPath,
  screens: screens
}

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: Root,
      NotFound: '*',
    },
  },
};
