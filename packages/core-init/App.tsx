import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import _ from 'lodash';
import _default from '@react-native-practice/default';
import default_hooks from '@react-native-practice/default/hooks'; 
import useHeaderHeight from '@react-native-practice/core/hooks/useHeaderHeight';
import { initRender, Navigation, useCachedResources, useColorScheme, pushScreenModule } from '@react-native-practice/core';

default_hooks['useHeaderHeight'] = useHeaderHeight
pushScreenModule(_default)

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
