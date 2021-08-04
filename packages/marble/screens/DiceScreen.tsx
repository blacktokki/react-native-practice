import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import Cube from '../components/dice'

export default function TabDiceScreen({
  navigation
}: StackScreenProps< typeof DrawerParamList, 'TabDice'>) {
  return (
    <Cube></Cube>
  );
}