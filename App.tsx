import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useScreenModule, Navigation, useColorScheme } from '@react-native-practice/core';
import useCachedResources from './useCachedResources';

import _default from '@react-native-practice/default/screens';
import marble from '@react-native-practice/marble/screens';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  useScreenModule([_default, marble], ["default", "marble"])
  if (!isLoadingComplete) {
    return null;
  }else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
