import React, {useCallback} from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { StyleSheet, Text, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
//import DraggableFlatListDummy from '../components/DraggableFlatListDummy'
import SectionDummy from '../components/SectionDummy'
import DraggableFlatListMain, {CommandSetterParams} from '../components/DraggableFlatListMain'

export default function TabThreeScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabTwo'>) {
  const header = []
  const arr = []
  for (let i=0;i<10;i++){
    header[i] = <Text style={styles.Panel_Button_Text}>{'Tab One' + (i+1)} </Text>
    arr[i] = <SectionDummy
    key={i}
    title={'Tab One' + (i+1)}
    pressText1='Go 2 screen!'
    onPress1={() => {navigation.navigate('TabTwo')}}
    path='/screens/TabOneScreen.tsx'
  />
  }
  const command:CommandSetterParams | any = {} 
  const onScroll = (e:NativeSyntheticEvent<NativeScrollEvent>) =>{
    const n=e.nativeEvent;
    //console.log(n.contentOffset.x/n.contentSize.width, n.layoutMeasurement.width/n.contentSize.width)
    if ((n.contentOffset.x + n.layoutMeasurement.width) >= n.contentSize.width){
      const _data = command.remove(0);
      setTimeout(() => command.add(_data, command.getData().length), 200)
    }
    else if (n.contentOffset.x == 0 ){
      const _data = command.remove(command.getData().length -1);
      setTimeout(() => command.add(_data, 0), 200)
    }
  }
  return (<DraggableFlatListMain
    header={header}
    commandSetter={(commandAll:CommandSetterParams)=>{Object.assign(command, commandAll)}}
    dataCallback={()=>{}}
    holderStyle={styles.Panel_Holder}
    sortEnabled={false}
    horizontal={true}
    onScroll={onScroll}
  >
    {arr}
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
  }
})
