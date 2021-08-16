import * as React from 'react';
import moment from 'moment'
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import {load_stocklist_json, load_stock_json, sleep, Jdata} from '../utils';

const MAX_LOAD_STOCK = 4
let current_load_stock = 0
const MAX_RELOAD_STOCK = 32
let reload_stock = 0

async function load_stock(data_all:any[], setter:any, show_log:number){
  let new_data_all: any[] = []
  for (const [i, d] of data_all.entries()){
    let full_code = d['full_code']
    await sleep(40)
    reload_stock += 1
    while (current_load_stock >= MAX_LOAD_STOCK || reload_stock>=MAX_RELOAD_STOCK){
        await sleep(200)
        if (reload_stock == MAX_RELOAD_STOCK){
            console.log('reload!!!!')
            new_data_all = data_all.map((item)=>item)
            setter(new_data_all)
        }
        else{
          reload_stock +=1
          console.log(current_load_stock, '/', MAX_LOAD_STOCK)
        }
    }
    current_load_stock += 1
    load_stock_json(full_code, {start_date:new Date(2016, 0, 1), end_date:moment(new Date()).add(-2, 'day').set({h: 0, m: 0, s:0}).toDate(), log_datetime:0, isSimple:1}).then((j2:Jdata)=>{
        if(show_log){  
          if (j2['_status'] == 0){
            console.log(i, d)
            console.log(j2['output'].length?j2['output'][0] : null)
          }
          else{
            console.log(i, d['codeName'])
          }
        }
        data_all[i]['checked'] = true
        current_load_stock -= 1
    })
  }
  while (current_load_stock > 0)
    await sleep(200)
  console.log('reload!!!!')
  new_data_all = data_all.map((item)=>item)
  setter(new_data_all)
}

export default function TabMainScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabTwo'>) {
  const [data, setData] = React.useState<any[]>([])
  
  const renderItem = React.useCallback(({item})=>{return (
    <View><Text>{item.full_code}:{item.checked !== undefined? item.checked.toString():'false'}</Text></View>
  )},[])
  React.useEffect(()=>{
    console.log('reload finished')
    reload_stock = 0
    if (data.length == 0){
      load_stocklist_json().then(
        (data_all)=>{
          //limited data
          //data_all.splice(10)
          //console.log(data_all)
          setData(data_all);
          load_stock(data_all, setData, 1)
        }
      )
      //setData([{full_code:11111},{full_code:11112},{full_code:11113},{full_code:11114},{full_code:11115}])
    }
  },[data])
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => (item as any).full_code}
    />
  )
}
