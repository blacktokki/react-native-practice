import * as React from 'react';
import moment from 'moment'
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { StyleSheet, TouchableOpacity ,Text, View, FlatList, TextInput, Button } from 'react-native';
import {load_stocklist_json, load_stock_json, sleep} from '../utils';
import { CompanyResponse } from '../types';

const MAX_LOAD_STOCK = 4
let current_load_stock = 0
const MAX_RELOAD_STOCK = 32
let reload_stock = 0
let sync_lock = 0

async function load_stock(data_all:any[], setter:any, show_log:number){
  if (sync_lock == 0){
    sync_lock = 1
    let new_data_all: any[] = []
    for (const [i, d] of data_all.entries()){
      let full_code = d['full_code']
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
      load_stock_json(full_code, {
        start_date:new Date(2016, 0, 1), end_date:moment(new Date()).add(-2, 'day').set({h: 0, m: 0, s:0}).toDate(), log_datetime:0, isSimple:1
      }).then((j2:CompanyResponse)=>{
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
    sync_lock = 0
  }
}

function Separator(){
  return <View style={{
    backgroundColor: '#000',
    marginVertical: 30,
    height: 1
  }}/>
}

export default function TabSearchScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabSearch'>) {
  const [data, setData] = React.useState<any[]>([])
  const [dataSearch, setDataSearch] = React.useState<any[]>([])
  const [keyword, setKeyword] = React.useState('')
  const syncLength = React.useMemo(()=>[data.filter((item)=>item.checked).length, data.length], [data])
  const searchRef = React.useRef<NodeJS.Timeout>()
  const renderItem = React.useCallback(({item})=>{return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("Detail", {
        screen: 'DetailScreen',
        params: {full_code: item.full_code}
      })}}>
        <Text>{item.short_code}:{item.codeName} </Text>
      </TouchableOpacity>
      <Text style={{color: item.checked !== undefined?(item.checked?'green':'red'): 'orange'}}>◉</Text>
    </View>
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
        }
      )
      //setData([{full_code:11111},{full_code:11112},{full_code:11113},{full_code:11114},{full_code:11115}])
    }
  },[data])
  const onChangeText = React.useCallback((value)=>{
    setKeyword(value)
    if (searchRef.current)
      clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setDataSearch(value != ''?data.filter((item)=>{return (item.short_code as string).indexOf(value) > -1 || (item.codeName as string).indexOf(value) > -1}):[])
    }, 200);
  }, [data])
  return (
    <View>
      <TextInput style={{borderColor:'#000', borderWidth: 1, marginVertical: 30}} onChangeText={onChangeText} value={keyword}></TextInput>
      <Button title={"Sync!"} onPress={()=>load_stock(data, setData, 1)}/>
      <Text>({syncLength[0]}/{syncLength[1]})</Text>
      <Separator/>
      <FlatList
        data={dataSearch}
        renderItem={renderItem}
        keyExtractor={item => (item as any).full_code}
      />
    </View>
  )
}
