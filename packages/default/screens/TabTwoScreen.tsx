import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { StyleSheet, Text} from 'react-native';
//import DraggableFlatListDummy from '../components/DraggableFlatListDummy'
import SectionDummy from '../components/SectionDummy'
import DraggableFlatListMain from '../components/DraggableFlatListMain'

export default function TabTwoScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabTwo'>) {
  return (<DraggableFlatListMain
    header={[
      <Text style={styles.Panel_Button_Text}>{'Tab Two 1'} </Text>,
      <Text style={styles.Panel_Button_Text}>{'Tab Two 2'} </Text>
    ]}
    dataCallback={()=>{}}
    holderStyle={styles.Panel_Holder}
    sortEnabled={false}
  >
    <SectionDummy
      title='Tab Two'
      pressText1='Go 1 screen!'
      onPress1={() => {navigation.navigate('TabOne')}}
      path='/screens/TabTwoScreen.tsx'
    />
    <SectionDummy
        title='Tab Two'
        pressText1='Go 1 screen!'
        onPress1={() => {navigation.navigate('TabOne')}}
        path='/screens/TabTwoScreen.tsx'
    />
    <SectionDummy
        title='Tab Two'
        pressText1='Go 1 screen!'
        onPress1={() => {navigation.navigate('TabOne')}}
        path='/screens/TabTwoScreen.tsx'
    />
  </DraggableFlatListMain>
  )
  //return (<DraggableFlatListDummy/>) 
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
