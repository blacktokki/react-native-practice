import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { View, Text } from 'react-native'

export default function TabMainScreen({
  navigation
}: StackScreenProps< typeof DrawerParamList, 'TabMain'>) {
  return (
    <View></View>
  );
}