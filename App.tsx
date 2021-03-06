import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import _ from 'lodash';
import { initRender, Navigation, useColorScheme, pushScreenModule } from '@react-native-practice/core';
import useCachedResources from './useCachedResources';

//import _default from '@react-native-practice/default/screens';
//import marble from '@react-native-practice/marble/screens';
import trading from '@react-native-practice/trading/screens';
import useSyncData from '@react-native-practice/trading/hooks/useSyncData';

//pushScreenModule(_default)
//pushScreenModule(marble)
pushScreenModule(trading)

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [isSyncComplete, syncRender] = useSyncData()
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else if(!isSyncComplete){
    return (<SafeAreaProvider>{syncRender}</SafeAreaProvider>)
  }else {
    initRender()
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
