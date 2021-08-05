import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import _ from 'lodash';
import { initRender, Navigation, useColorScheme, pushScreenModule } from '@react-native-practice/core';
import useCachedResources from './useCachedResources';

//import _default from '@react-native-practice/default/screens';
//import marble from '@react-native-practice/marble/screens';
import trading from '@react-native-practice/trading/screens';

//pushScreenModule(_default)
//pushScreenModule(marble)
pushScreenModule(trading)

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    initRender()
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
