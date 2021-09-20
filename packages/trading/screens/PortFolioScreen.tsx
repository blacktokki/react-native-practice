import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, FlatList, TextInput, Button } from 'react-native';
import {load_stocklist_json, load_stock_json, sleep, STORAGE_KEY} from '../utils';
import { CompanyResponse } from '../types';
import { ModelToCandle } from './DetailScreen';
import { Candle } from '../components/CandleType';
import hloc from '../components/indices/hloc';
import volume from '../components/indices/volume'
import ii from '../components/indices/ii';
import moment from 'moment';

const MAX_LOAD_STOCK = 8
let current_load_stock = 0
const MAX_RELOAD_STOCK = 100
let reload_stock = 0
let sync_lock = 0

async function load_stock(data_all:any[], endDate:Date, setter:(data_all:any[])=>void, show_log:number){
  if (sync_lock == 0){
    sync_lock = 1
    const endDateStr = ddFormat(endDate)
    let new_data_all: any[] = []
    for (const [i, d] of data_all.entries()){

      let full_code = d['full_code']
      reload_stock += 1
      while (sync_lock==2)
        await sleep(1000)
      while (current_load_stock >= MAX_LOAD_STOCK || reload_stock>=MAX_RELOAD_STOCK){
          await sleep(200)
          if (reload_stock == MAX_RELOAD_STOCK){
              console.log('reload!!!!')
              new_data_all = data_all.filter((value)=>value.lastCandle)
              setter(new_data_all)
          }
          else{
            reload_stock +=1
            console.log(current_load_stock, '/', MAX_LOAD_STOCK)
          }
      }
      current_load_stock += 1
      
      load_stock_json(full_code, {
        start_date:new Date(2016, 0, 1), end_date:new Date(2016, 0, 1), log_datetime:0, isSimple:1
      }).then((j2:CompanyResponse)=>{
        const candles:Candle<any>[] = j2.output.map(ModelToCandle).reverse()
        candles.forEach((candle, index, array)=>{
          if (index > 0)
            candle.prev = array[index - 1]
          candle.extra = {}
          hloc.setData(candle, {bollingers:[{fill:'green', count:20, exp:2}]})
          volume.setData(candle, {mas:[20]})
          ii.setData(candle, {depth:21})
        })
        console.log(i)
        candles.reverse().forEach((candle, index)=>{
          if (candle.date == endDateStr){
            data_all[i]['lastCandle'] = candle
          }
          else{
            candle.extra = undefined
          }
        })
        current_load_stock -= 1
      })
    }
    while (current_load_stock > 0)
      await sleep(200)
    console.log('reload!!!!')
    sync_lock = 0
    new_data_all = data_all.filter((value)=>value.lastCandle)
    setter(new_data_all)
  }
}

function ddFormat(date:Date){
  return date.getFullYear().toString() + '/' + (date.getMonth() + 1).toString().padStart(2,'0') + '/' + date.getDate().toString().padStart(2,'0')
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
  const [maxData, setMaxData] = React.useState(0)
  // const [dataSearch, setDataSearch] = React.useState<any[]>([])
  // const [keyword, setKeyword] = React.useState('')
  const [lastDate, setLastDate] = React.useState<Date>(new Date())
  // const searchRef = React.usseRef<NodeJS.Timeout>()
  const renderItem = React.useCallback(({item, index})=>{return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("Detail", {
        screen: 'DetailScreen',
        params: {full_code: item.full_code}
      })}}>
        <Text>[{index + 1}]{item.short_code}:{item.codeName} </Text>
      </TouchableOpacity>
      <Text>({item['lastDate']})</Text>
      <Text>({Math.round(item['lastCandle'].close)}원)</Text>
      <Text>({Math.round(item['lastCandle'].extra.volume.mas[0].val/10000)}만원)</Text>
      <Text style={{color: item['checked'] !== undefined?(item['checked']?'green':'orange'): 'red'}}>◉</Text>
    </View>
  )},[])
  React.useEffect(()=>{
    console.log('reload finished')
    reload_stock = 0
    AsyncStorage.getItem(STORAGE_KEY['last_date']).then((value)=>{
      let date = value?new Date(value):lastDate
      setLastDateFull(date)
    })
  },[data])
  /*
  const onChangeText = React.useCallback((value)=>{
    setKeyword(value)
    if (searchRef.current)
      clearTimeout(searchRef.current)
    searchRef.current = setTimeout(() => {
      setDataSearch(value != ''?data.filter((item)=>{return (item.short_code as string).indexOf(value) > -1 || (item.codeName as string).indexOf(value) > -1}):[])
    }, 200);
  }, [data])*/
  const setLastDateFull = React.useCallback((date:Date) =>{
    setLastDate(date)
    AsyncStorage.setItem(STORAGE_KEY['last_date'], ddFormat(date))
  }, [])
  const dataSearch = React.useMemo(()=>{
    const priceMax = 20000
    const volumeRatio = 0.80
    const volumeVal = data.length?data.sort((a, b)=>{
      return ((a.lastCandle as Candle<any>).extra.volume.mas[0].val < (b.lastCandle as Candle<any>).extra.volume.mas[0].val)?1:-1
    })[Math.floor(data.length * volumeRatio)-1].lastCandle.extra.volume.mas[0].val:0
    return data.filter((value)=>{
      const candle:Candle<any> = value.lastCandle;
      const bolinger = candle.extra.hloc.bollingers[0]
      const pb = (candle.close - bolinger.low) / (bolinger.high - bolinger.low) * 100
      return candle.close <= priceMax && candle.extra.volume.mas[0].val > volumeVal
       && (pb < 5 && candle.extra.ii.value > 0)
    })
  }, [data])
  return (
    <View>
      <View style={{flexDirection:'row'}}>
        <Text>Last Date: {ddFormat(lastDate)}</Text>
        <Button title={"down"} onPress={()=>{setLastDateFull(moment(lastDate).add(-1,'day').toDate())}}/>
        <Button title={"up"} onPress={()=>{setLastDateFull(moment(lastDate).add(1,'day').toDate())}}/>
      </View>
      <Button title={"load"} onPress={()=>{
        load_stocklist_json().then(
          (data_all)=>{
            setMaxData(data_all.length)
            load_stock(data_all, lastDate, setData, 0)
          }
        )
      }}/>
      <Text>({data.length}/{maxData})</Text>
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
