import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerParamList } from '@react-native-practice/core/types';
import { TouchableOpacity ,Text, View, FlatList, TextInput, Button, ScrollView } from 'react-native';
import {load_stocklist_json, STORAGE_KEY, ddFormat} from '../utils';
import { Candle } from '../components/chart/CandleType';
import SyncSection, { syncContext } from '../sections/SyncSection';
import AdvancedLoadSection, { loadContext } from '../sections/AdvancedLoadSection';
import moment from 'moment';

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
  const [syncData, setSyncData] = React.useState<any[]>([])
  const [data, setData] = React.useState<any[]>([])
  // const [keyword, setKeyword] = React.useState('')
  const [lastDate, setLastDate] = React.useState<Date>(new Date())
  const [lastDateFix, setLastDateFix] = React.useState<Date|undefined>(undefined)
  const lastDateFixStr = React.useMemo(()=>lastDateFix?ddFormat(lastDateFix):'@', [lastDateFix])
  // const searchRef = React.usseRef<NodeJS.Timeout>()
  const renderItem = React.useCallback(({item, index})=>{
    const candle = item['candles'][lastDateFixStr]
    const candleStd = candle.extra.hloc.bollingers[0].std / candle.extra.hloc.bollingers[0].mid * 100
    const ratio = 1 / (candleStd * candleStd)
    const defaultCash = 1000000
    return (
    <View style={{flexWrap: 'wrap'}}>
      <TouchableOpacity onPress={()=>{navigation.navigate("Detail", {
        screen: 'DetailScreen',
        params: {full_code: item.full_code}
      })}}>
        <Text>[{index + 1}]{item.short_code}:{item.codeName} </Text>
      </TouchableOpacity>
      <Text>({Math.round(candle.close)}원, {Math.round(candle.extra.hloc.bollingers[0].std)}원, {candleStd.toFixed(2)}%, {(100 * ratio).toFixed(2)}%, {(defaultCash * ratio / candle.close).toFixed(1)}주)</Text>
      <Text>({Math.round(candle.extra.volume.mas[0].val/10000)}만원)({(candle.extra.bolii.std!=0?candle.extra.bolii.avg/candle.extra.bolii.std:0).toFixed(4)})</Text>
    </View>
  )},[lastDateFixStr])
  React.useEffect(()=>{
    console.log('reload finished')
    syncContext.reload_stock = 0
    loadContext.reload_stock = 0
    AsyncStorage.getItem(STORAGE_KEY['last_date']).then((value)=>{
      let date = value?new Date(value):lastDate
      setLastDateFull(date)
      if (syncData.length == 0){
        load_stocklist_json().then(setSyncData)
      }
    })
  },[data, syncData])
  const setLastDateFull = React.useCallback((date:Date) =>{
    setLastDate(date)
    AsyncStorage.setItem(STORAGE_KEY['last_date'], ddFormat(date))
  }, [])

  const dataSearch = React.useMemo(()=>{
    const priceMin = 1000
    const priceMax = 20000
    const volumeRatio = 0.80
    const dateData = data.filter((value)=>value.candles[lastDateFixStr])
    const volumeVal = dateData.length?dateData.sort((a, b)=>{
      return ((a.candles[lastDateFixStr] as Candle<any>).extra.volume.mas[0].val < (b.candles[lastDateFixStr] as Candle<any>).extra.volume.mas[0].val)?1:-1
    })[Math.floor(data.length * volumeRatio)-1].candles[lastDateFixStr].extra.volume.mas[0].val:0

    return dateData.filter((value)=>{
      const candle:Candle<any> = value.candles[lastDateFixStr];
      const bolinger = candle.extra.hloc.bollingers[0]
      const pb = (candle.close - bolinger.low) / (bolinger.high - bolinger.low) * 100
      return priceMin <= candle.close && candle.close <= priceMax && candle.extra.volume.mas[0].val > volumeVal
       && (pb < 5 && candle.extra.ii.value > 0) && candle.extra.bolii.avg > 0
    })
  }, [data, lastDateFixStr])
  const stds = React.useMemo(()=>{
    return dataSearch.map((item)=>{
      const candle = item['candles'][lastDateFixStr]
      return (candle.extra.hloc.bollingers[0].std / candle.extra.hloc.bollingers[0].mid * 100).toFixed(2)
   }).join(',')  
  }, [dataSearch, lastDateFixStr])

  return (
    <ScrollView>
      <View style={{flexDirection:'row'}}>
        <Text>Last Date: {ddFormat(lastDate)}</Text>
        <Button title={"down"} onPress={()=>{setLastDateFull(moment(lastDate).add(-1,'day').toDate())}}/>
        <Button title={"up"} onPress={()=>{setLastDateFull(moment(lastDate).add(1,'day').toDate())}}/>
      </View>
      {loadContext.sync_lock==0?<SyncSection data={syncData} lastDate={lastDate} setData={setSyncData} setLastDate={setLastDate} context={syncContext}/>:undefined}
      {syncContext.sync_lock==0?<AdvancedLoadSection data={data} lastDate={lastDate} lastDateFix={lastDateFix} setData={setData} setLastDateFix={setLastDateFix} context={loadContext}/>:undefined}
      <Separator/>
      <View style={{flexDirection:'row'}}>
        <Text>Stds: {stds}</Text>
        <Button title={'go portfolio'} onPress={()=>{navigation.navigate("Util", {
          screen: 'UtilScreen',
          params: {optionStd: stds}
        })}}/>
      </View>
      <Separator/>
      <FlatList
        data={dataSearch}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={item => (item as any).full_code}
        maxToRenderPerBatch={loadContext.sync_lock!=1 && syncContext.sync_lock!=1?200:10}
      />
    </ScrollView>
  )
}
