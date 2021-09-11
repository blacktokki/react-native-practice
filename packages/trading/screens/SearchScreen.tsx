import * as React from 'react';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { StyleSheet, TouchableOpacity ,Text, View, FlatList, TextInput, Button } from 'react-native';
import {load_stocklist_json, load_stock_json, save_last_date, sleep, STORAGE_KEY} from '../utils';
import { CompanyResponse } from '../types';

const MAX_LOAD_STOCK = 4
let current_load_stock = 0
const MAX_RELOAD_STOCK = 32
let reload_stock = 0
let sync_lock = 0

async function load_stock(data_all:any[], endDate:Date, setter:(data_all:any[])=>void, show_log:number){
  if (sync_lock == 0){
    sync_lock = 1
    data_all.forEach((item)=>{item['checked'] = false})
    let new_data_all: any[] = data_all.map((item)=>item)
    setter(new_data_all)
    for (const [i, d] of data_all.entries()){
      let full_code = d['full_code']
      reload_stock += 1
      while (sync_lock==2)
        await sleep(1000)
      while (current_load_stock >= MAX_LOAD_STOCK || reload_stock>=MAX_RELOAD_STOCK){
          await sleep(200)
          if (reload_stock == MAX_RELOAD_STOCK){
              console.log('reload!!!!')
              new_data_all = data_all.map((item)=>item)
              setter(new_data_all)
              await save_last_date(new_data_all)
          }
          else{
            reload_stock +=1
            console.log(current_load_stock, '/', MAX_LOAD_STOCK)
          }
      }
      current_load_stock += 1
      load_stock_json(full_code, {
        start_date:new Date(2016, 0, 1), end_date:endDate, log_datetime:0, isSimple:1
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
          data_all[i]['lastDate'] = ddFormat(endDate)
          current_load_stock -= 1
      })
    }
    while (current_load_stock > 0)
      await sleep(200)
    console.log('reload!!!!')
    new_data_all = data_all.map((item)=>item)
    sync_lock = 0
    setter(new_data_all)
    await save_last_date(new_data_all)
  }
}

function Separator(){
  return <View style={{
    backgroundColor: '#000',
    marginVertical: 30,
    height: 1
  }}/>
}

function ddFormat(date:Date){
  return date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString().padStart(2,'0') + '/' + date.getDate().toString().padStart(2,'0')
}

export default function TabSearchScreen({
  navigation
}: StackScreenProps<typeof DrawerParamList, 'TabSearch'>) {
  const [data, setData] = React.useState<any[]>([])
  const [dataSearch, setDataSearch] = React.useState<any[]>([])
  const [keyword, setKeyword] = React.useState('')
  const [lastDate, setLastDate] = React.useState<Date>(new Date())
  const syncLength = React.useMemo(()=>{
    const dateString = ddFormat(lastDate)
    return [
      data.filter((item)=>(item['lastDate'] == dateString)).length, 
      data.filter((item)=>item['checked']).length,
      data.length
    ]
  }, [lastDate, data])
  const searchRef = React.useRef<NodeJS.Timeout>()
  const renderItem = React.useCallback(({item, index})=>{return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("Detail", {
        screen: 'DetailScreen',
        params: {full_code: item.full_code}
      })}}>
        <Text>[{index + 1}]{item.short_code}:{item.codeName} </Text>
      </TouchableOpacity>
      <Text>({item['lastDate']})</Text>
      <Text style={{color: item['checked'] !== undefined?(item['checked']?'green':'orange'): 'red'}}>◉</Text>
    </View>
  )},[])
  const setLastDateFull = React.useCallback((date:Date) =>{
    setLastDate(date)
    AsyncStorage.setItem(STORAGE_KEY['last_date'], ddFormat(date))
  }, [])
  React.useEffect(()=>{
    console.log('reload finished')
    reload_stock = 0
    AsyncStorage.getItem(STORAGE_KEY['last_date']).then((value)=>{
      let date = value?new Date(value):lastDate
      setLastDateFull(date)
      if (data.length == 0){
        load_stocklist_json().then(
          (data_all)=>{
            const dateString = ddFormat(date)
            //limited data
            //data_all.splice(10)
            //console.log(data_all)
            setData(data_all);
          }
        )
        }
        //setData([{full_code:11111},{full_code:11112},{full_code:11113},{full_code:11114},{full_code:11115}])
    })
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
      <View style={{flexDirection:'row'}}>
        <Text>Last Date: {ddFormat(lastDate)}</Text>
        <Button title={"down"} onPress={()=>{setLastDateFull(moment(lastDate).add(-1,'day').toDate())}}/>
        <Button title={"up"} onPress={()=>{setLastDateFull(moment(lastDate).add(1,'day').toDate())}}/>
      </View>
      {sync_lock!=1?
          (<Button title={"Sync!"} onPress={sync_lock==0?()=>load_stock(data, lastDate, setData, 1):()=>{sync_lock=1;setLastDate(new Date(lastDate))}}/>):
          (<Button title={"Pause!"} onPress={()=>{sync_lock=2;setLastDate(new Date(lastDate))}}/>)
      }
      <Text>({syncLength[0]}/{syncLength[2]})({syncLength[1]}/{syncLength[2]})</Text>
      <Separator/>
      <FlatList
        data={dataSearch}
        renderItem={renderItem}
        keyExtractor={item => (item as any).full_code}
        maxToRenderPerBatch={sync_lock!=1?200:10}
      />
    </View>
  )
}
