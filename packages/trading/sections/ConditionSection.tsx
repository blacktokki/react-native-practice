import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput } from 'react-native';
import { STORAGE_KEY } from '../utils';
import { Button } from 'react-native';


export default function ConditionSection(props:{}) {
    const [condition, setCondition] = React.useState<string>('{}')
    const [size, setSize] = React.useState<{height:number|undefined}>({height:undefined});
    const setConditionFull = React.useCallback((cond:string) =>{
        setCondition(cond)
        AsyncStorage.setItem(STORAGE_KEY['condition'], cond)
      }, [])
    React.useEffect(()=>{
        AsyncStorage.getItem(STORAGE_KEY['condition']).then((value)=>{
            setConditionFull(value?value:condition)
        })
    })
    return (
    <View>
       <TextInput 
        style={[{borderColor:'#000', borderWidth: 1, margin: 25, padding:5}, {height:size.height}]} 
        multiline
        onChangeText={setConditionFull} 
        value={condition}
        onContentSizeChange={(e)=>{setSize(e.nativeEvent.contentSize)}}
     />
     <Button title={'format'} onPress={()=>{setConditionFull(JSON.stringify(JSON.parse(condition), null, 4))}}/>
    </View>
  )
}
