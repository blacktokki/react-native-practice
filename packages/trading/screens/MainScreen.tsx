import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import SectionDummy from '@react-native-practice/core/components/SectionDummy'
import SliderSection from '../components/SliderSection'
import DraggableFlatListMain from '@react-native-practice/core/components/DraggableFlatListMain'
import { cdf, laplace_cdf } from '../utils/mathutil'
import load_normal from '../commands/load_normal';
import CoinBasePro from  '../components/CoinBasePro'
import { Touchable } from 'react-native';

export default function TabMainScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabTwo'>) {
  return (
    <DraggableFlatListMain
      header={[
        <Text style={styles.Panel_Button_Text}>{'Tab Two 1'} </Text>,
        <Text style={styles.Panel_Button_Text}>{'Tab Two 2'} </Text>,
        <Text style={styles.Panel_Button_Text}>{'Tab Two 3'} </Text>,
        <Text style={styles.Panel_Button_Text}>{'Tab Two 4'} </Text>,
        <Text style={styles.Panel_Button_Text}>{'Tab Two 5'} </Text>
      ]}
      dataCallback={()=>{}}
      holderStyle={styles.Panel_Holder}
      sortEnabled={false}
    >
      <SliderSection renderText={(text)=>{return cdf(parseFloat(text) || 0.0).toString()}}/>
      <SliderSection renderText={(text)=>{return laplace_cdf(parseFloat(text) || 0.0).toString()}}/>
      <CoinBasePro/>
      <View>
        <TouchableOpacity onPress={(e)=>{load_normal(undefined,undefined, undefined, undefined, 1)}}>
          <Text> execute</Text>  
        </TouchableOpacity>        
      </View>
      <SectionDummy
          title='Tab Two'
          pressText1='Go 1 screen!'
          onPress1={() => {navigation.navigate('TabOne')}}
          path='/screens/TabTwoScreen.tsx'
      />
    </DraggableFlatListMain>
  )
}

const styles = StyleSheet.create({
  Panel_text: {
    fontSize: 18,
    color: '#000',
    padding: 10
  },
  Panel_Button_Text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 21
  },
  Panel_Holder: {
    borderWidth: 1,
    borderColor: '#888',
    marginVertical: 5
  }
})
